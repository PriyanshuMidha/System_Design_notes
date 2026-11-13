---
tags: [databases, locking, concurrency, postgresql, mysql]
level: intermediate
status: reviewed
prereqs: ["[[Transactions and ACID]]", "[[Isolation Levels and MVCC]]"]
related: ["[[Locking - Optimistic vs Pessimistic - Go]]", "[[Distributed Locks and Fencing Tokens]]", "[[HTTP Caching - Cache-Control, ETag, Conditional Requests]]", "[[Background Workers and Job Queues]]", "[[Transactions and the Repository Pattern]]", "[[Timeouts, Retries and Backoff]]", "[[Zero-Downtime Schema Migrations]]", "[[Connection Pooling]]"]
sources:
  - "PostgreSQL 17 docs, Explicit Locking: Table-Level Locks, Row-Level Locks (conflict table), Deadlocks, Advisory Locks"
  - "PostgreSQL 17 docs, SELECT: The Locking Clause (FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, FOR KEY SHARE, NOWAIT, SKIP LOCKED)"
  - "PostgreSQL 17 docs, Server Configuration: lock_timeout, deadlock_timeout (default 1s), log_lock_waits"
  - "PostgreSQL 17 docs, Appendix A, PostgreSQL Error Codes (40001, 40P01, 55P03)"
  - "PostgreSQL 17 docs, System Information Functions (pg_blocking_pids), pg_locks view"
  - "MySQL 8.0 Reference Manual, InnoDB Locking (record, gap and next-key locks), Locking Reads (NOWAIT, SKIP LOCKED)"
  - "RFC 9110, HTTP Semantics: If-Match and 412 Precondition Failed; RFC 6585: 428 Precondition Required"
  - "AWS DynamoDB Developer Guide, Condition expressions; Redis docs, Transactions (WATCH)"
  - "pkg.go.dev, github.com/jackc/pgx/v5 (BeginFunc, pgconn.PgError)"
updated: 2026-11-13
---

# Locking - Optimistic vs Pessimistic

> [!summary] TL;DR
> When two requests read a row, change it in application code and write it back at the same time, one change can silently overwrite the other. **Pessimistic locking** stops this by locking the row before reading it (`SELECT … FOR UPDATE`), so the second request waits. **Optimistic locking** lets both proceed and adds a `version` column: the write succeeds only if the version is unchanged, and the loser re-reads and retries.

> [!abstract] Core idea
> - The bug being prevented is the **lost update**: read, compute in the app, write back, while someone else does the same.
> - Pessimistic: take a row lock first (`FOR UPDATE`, `FOR NO KEY UPDATE`); others wait, give up (`NOWAIT`, `lock_timeout`) or skip the row (`SKIP LOCKED`).
> - Optimistic: `UPDATE … WHERE id = $1 AND version = $2`; zero rows affected means "someone beat you, re-read and retry".
> - Pick by contention: rare conflicts favour optimistic, hot rows and expensive retries favour pessimistic.
> - Whenever a transaction locks more than one row, lock in a fixed order (for example by id) to avoid deadlocks.

## Start here: the basics

**The problem in one story.**
An invoice has 10,000 paid. Two payments of 2,000 arrive at the same instant.
Each request reads "paid = 10,000", adds 2,000 in code, and writes back 12,000.
The result should be 14,000. One payment silently vanished.
Locking is how you stop the second writer from wiping out the first.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Row | One record in a table | Invoice 42 |
| Transaction | Reads and writes that succeed or fail together | `BEGIN ... COMMIT` |
| Lost update | One write overwrites another that happened in between | 12,000 instead of 14,000 |
| Lock | A marker that says "this row is mine until I commit" | `SELECT ... FOR UPDATE` |
| Version column | A number bumped on every write, used to detect changes | `version = 7` |
| Contention | How often requests fight over the same row | A hot product's stock row |
| Deadlock | Two transactions each wait for a lock the other holds | A locks 1 then 2, B locks 2 then 1 |
| Retry | Run the whole read-compute-write again after a conflict | Re-read the invoice and try again |

**Picture it**

```mermaid
flowchart TD
    S["Read-modify-write on a shared row"] --> Q{"Conflicts common?"}
    Q -- "yes: hot row" --> P["Pessimistic: lock first<br/>SELECT ... FOR UPDATE"]
    Q -- "no: rare" --> O["Optimistic: write only if<br/>version unchanged"]
    P --> PW["Others wait"]
    O --> OR["0 rows updated:<br/>re-read and retry"]
```

**Analogy.** Pessimistic locking is booking a meeting room before using it; optimistic locking is walking in and leaving if someone is already there.
Where it breaks: rooms are visibly occupied, but a database writer only finds out about a conflict at write time, after doing the work.

**How the rest of this note builds up**

- First, why lost updates happen and the cheapest fix of letting the database do the arithmetic (section 1), then the mental model (section 2).
- Then pessimistic row locks, the optimistic version column, deadlocks and lock ordering (sections 3.1-3.3).
- Then advisory locks and optimistic concurrency outside SQL (sections 3.4-3.5), a traced worked example and comparisons (sections 4-6).
- Finally the SDE-3 view: `SKIP LOCKED` job queues, where PostgreSQL stores row locks, lock queues and InnoDB differences (sections 7-8).

> [!tip] Remember
> Rare conflicts: optimistic with a version check. Hot rows: lock first. Many rows: always lock in a fixed order.

## 1. Why it exists

InvoiceOps records payments against invoices. Invoice 501 has `total_minor = 100000` (₹1,000.00 in paise, the minor unit) and nothing paid yet. Two payment webhooks arrive within the same 5 ms, one for 30,000 and one for 50,000. The handler does what most first versions do:

1. `SELECT paid_minor FROM invoices WHERE id = 501` → 0
2. compute `0 + amount` in Go
3. `UPDATE invoices SET paid_minor = <computed> WHERE id = 501`

```mermaid
sequenceDiagram
    participant A as Webhook A (30,000)
    participant DB as invoices row 501
    participant B as Webhook B (50,000)
    A->>DB: SELECT paid_minor → 0
    B->>DB: SELECT paid_minor → 0
    A->>DB: UPDATE SET paid_minor = 30000
    Note over DB: paid_minor = 30000
    B->>DB: UPDATE SET paid_minor = 50000
    Note over DB: paid_minor = 50000<br/>A's 30,000 is gone
```

The customer paid 80,000 and the invoice says 50,000. No error was raised, no constraint failed, and the default isolation level (READ COMMITTED in PostgreSQL, see [[Isolation Levels and MVCC]]) allows it. This is the **lost update** anomaly.

A **read-modify-write** cycle (read a value, change it in the application, write it back) is exposed to it whenever two copies of the cycle overlap.

### The cheapest fix: let the database do the arithmetic

Before reaching for locks, note the cheapest fix: if the change can be expressed in SQL, let the database do the arithmetic.

```sql
UPDATE invoices SET paid_minor = paid_minor + 30000 WHERE id = 501;
```

A single `UPDATE` reads the latest committed row under a row lock, so two of these never lose each other's increment, even at READ COMMITTED. Locking is needed when the decision cannot be written in one statement: the code must check rules ("is the invoice cancelled?", "would this overpay?"), call another system, or update several rows consistently.

```mermaid
flowchart TD
    Q["I need to change a value that depends on its current value"] --> D1{"can one UPDATE do the arithmetic and the check?"}
    D1 -- "yes" --> F1["atomic UPDATE: paid_minor = paid_minor + $1, with a CHECK constraint"]
    D1 -- "no: app rules, remote call, several rows" --> D2{"is the row hot, or the work expensive to redo?"}
    D2 -- "yes" --> F2["pessimistic: lock first with FOR NO KEY UPDATE"]
    D2 -- "no, conflicts are rare" --> F3["optimistic: version column, retry on 0 rows"]
```

## 2. Mental model

- **Pessimistic locking** assumes a conflict will happen, so it prevents one. You take a lock on the row before you read it; anyone else who wants to change that row waits until you commit or roll back.
- **Optimistic locking** assumes a conflict is rare, so it detects one. Nothing waits. Every row carries a version number; you remember the version you read, and your write says "only if the version is still N". If someone got there first, your write matches zero rows and you start again.

Analogy: a pessimistic writer checks a library book out, so nobody else can edit it until it comes back. An optimistic writer edits a photocopy and, when handing it in, the librarian checks the edition number; if a newer edition appeared meanwhile, the writer must redo the edit on the new edition.

Both are correct. They differ in who pays: pessimistic makes the second request wait (and holds a database connection while it waits); optimistic makes the second request redo its work.

```mermaid
flowchart LR
    subgraph pess["pessimistic: the second request waits"]
        P1["A locks row"] --> P2["A writes, commits"] --> P3["B gets the lock, reads fresh data, writes"]
    end
    subgraph opt["optimistic: the second request redoes its work"]
        O1["A and B both read v7"] --> O2["A writes v8"] --> O3["B writes with v7: 0 rows, re-reads v8, writes v9"]
    end
```

| | Pessimistic | Optimistic |
| --- | --- | --- |
| Assumes | conflicts are common | conflicts are rare |
| Cost when there is no conflict | lock round trip, connection held | nothing extra |
| Cost when there is a conflict | the loser waits | the loser redoes its work |
| Needs a schema change | no | yes: a `version` column |
| Can span several HTTP requests | no | yes |

## 3. How it works

### 3.1 Pessimistic: row locks in PostgreSQL

A **row lock** is a lock on one row version, taken by a locking read or by `UPDATE`/`DELETE`, and held until the transaction ends. There is no way to release a row lock early, so the lock lives exactly as long as the transaction ([[Transactions and ACID]] covers where transactions begin and end).

```sql
BEGIN;
SELECT total_minor, paid_minor, status
  FROM invoices
 WHERE id = 501
   FOR UPDATE;                       -- waits here if another txn holds a conflicting lock
-- application checks: not cancelled, would not overpay
UPDATE invoices SET paid_minor = paid_minor + 30000, status = 'partially_paid'
 WHERE id = 501;
COMMIT;                              -- lock released
```

```mermaid
sequenceDiagram
    participant A as Txn A
    participant DB as row 501
    participant B as Txn B
    A->>DB: SELECT ... FOR UPDATE
    DB-->>A: row (paid 0), lock granted
    B->>DB: SELECT ... FOR UPDATE
    Note over B,DB: B blocks: A holds the lock
    A->>DB: UPDATE paid_minor = 30000
    A->>DB: COMMIT (lock released)
    DB-->>B: row (paid 30000), lock granted
    B->>DB: UPDATE paid_minor = 80000
    B->>DB: COMMIT
```

At READ COMMITTED, when B's wait ends, PostgreSQL re-reads the newest committed version of the row and re-checks B's `WHERE` clause against it, so B sees 30,000, not the stale 0. At REPEATABLE READ or SERIALIZABLE, B instead fails with SQLSTATE `40001` (`serialization_failure`) if A changed the row, and the application must retry the whole transaction.

#### The four row-lock strengths

PostgreSQL has four row-lock strengths. **FOR KEY SHARE** is what foreign-key checks take on the parent row; "key" here means the columns of a unique index that a foreign key could reference.

| Lock clause | Taken by | Blocks | Does not block |
| --- | --- | --- | --- |
| `FOR UPDATE` | `DELETE`, `UPDATE` of a key column, explicit request | all four | plain `SELECT` (MVCC readers never block) |
| `FOR NO KEY UPDATE` | `UPDATE` that changes no key column, explicit request | `FOR SHARE`, `FOR NO KEY UPDATE`, `FOR UPDATE` | `FOR KEY SHARE`, plain `SELECT` |
| `FOR SHARE` | explicit request | `FOR NO KEY UPDATE`, `FOR UPDATE` | other `FOR SHARE`, `FOR KEY SHARE` |
| `FOR KEY SHARE` | foreign-key checks on the parent row | `FOR UPDATE` | the other three weaker or equal locks |

```mermaid
flowchart LR
    FU["FOR UPDATE: strongest"] --> FNK["FOR NO KEY UPDATE"] --> FS["FOR SHARE"] --> FKS["FOR KEY SHARE: weakest"]
    FU -. "conflicts with all four" .-> X1["every other row lock"]
    FNK -. "conflicts with" .-> X2["FOR SHARE, FOR NO KEY UPDATE, FOR UPDATE"]
    FS -. "conflicts with" .-> X3["FOR NO KEY UPDATE, FOR UPDATE"]
    FKS -. "conflicts only with" .-> X4["FOR UPDATE"]
```

Practical reading of the table:

- Use **`FOR NO KEY UPDATE`** when you will update non-key columns (the common case, such as `paid_minor`). It is the lock your later `UPDATE` would take anyway, and unlike `FOR UPDATE` it does not block other sessions inserting `payments` rows that reference this invoice through a foreign key.
- Use **`FOR UPDATE`** when you will delete the row or change its key.
- Use **`FOR SHARE`** when you only need the row to stay unchanged while you work, for example to stop a client being deleted while you create an invoice for it. Several transactions can hold it together.

#### What happens when the row is already locked

Three modifiers decide what happens when the row is already locked:

| Modifier | Behaviour | Error | Typical use |
| --- | --- | --- | --- |
| (none) | wait until the holder ends | none, or `40P01` on deadlock | short critical sections |
| `NOWAIT` | fail immediately | `55P03` `lock_not_available` | interactive "someone else is editing" |
| `SKIP LOCKED` | silently leave locked rows out of the result | none | job queues with many workers |
| `SET LOCAL lock_timeout = '2s'` | wait at most 2 s per lock | `55P03` | everything else; bounds tail latency |

```mermaid
flowchart TD
    L["my SELECT ... FOR UPDATE finds the row locked by someone else"] --> M{"which modifier?"}
    M -- "none" --> W["wait until the holder commits or rolls back"]
    M -- "NOWAIT" --> E1["error 55P03 at once"]
    M -- "SKIP LOCKED" --> SK["row left out of the result, no wait, no error"]
    M -- "lock_timeout 2s" --> TM{"holder done within 2 s?"}
    TM -- "yes" --> GOT["lock granted"]
    TM -- "no" --> E2["error 55P03 after 2 s"]
```

`lock_timeout` is off (0) by default in PostgreSQL 17, which means a blocked request waits forever, holding a pooled connection. Set it per transaction with `SET LOCAL`, which resets at commit or rollback.

### 3.2 Optimistic: the version column

Add a counter to every row that is edited by read-modify-write:

```sql
ALTER TABLE invoices ADD COLUMN version bigint NOT NULL DEFAULT 0;
```

Every write checks the version it read and bumps it:

```sql
UPDATE invoices
   SET paid_minor = $2, status = $3, version = version + 1, updated_at = now()
 WHERE id = $1 AND version = $4;   -- $4 = the version this request read
```

The database returns the number of rows affected (`UPDATE 1` or `UPDATE 0`). One means you won; zero means the row changed (or was deleted) since you read it.

```mermaid
flowchart TD
    R["SELECT row and version (v = 7)"] --> C["compute new values in Go"]
    C --> U["UPDATE ... WHERE id = 501 AND version = 7"]
    U --> Q{"rows affected?"}
    Q -- "1" --> OK["done: version is now 8"]
    Q -- "0" --> N{"attempts left?"}
    N -- "yes" --> W["sleep with jitter"] --> R
    N -- "no" --> F["return conflict error (HTTP 409)"]
```

```mermaid
sequenceDiagram
    participant A as Request A
    participant DB as row 501 (v7)
    participant B as Request B
    A->>DB: SELECT → paid 0, v7
    B->>DB: SELECT → paid 0, v7
    A->>DB: UPDATE ... paid 30000, v8 WHERE version = 7
    DB-->>A: UPDATE 1
    B->>DB: UPDATE ... paid 50000, v8 WHERE version = 7
    DB-->>B: UPDATE 0 (conflict)
    B->>DB: SELECT → paid 30000, v8
    B->>DB: UPDATE ... paid 80000, v9 WHERE version = 8
    DB-->>B: UPDATE 1
```

Why this is safe: the `UPDATE` itself takes a row lock and evaluates `version = 7` against the latest committed row, so two writers can never both match the same version. No lock is held between the `SELECT` and the `UPDATE`, which is why the read can even happen in a separate transaction or a separate HTTP request.

An `updated_at` timestamp is a weaker substitute for a version: two writes in the same clock tick, or clock changes, make it ambiguous. A counter cannot be ambiguous.

| Step | Row state | Request A | Request B |
| --- | --- | --- | --- |
| 0 | paid 0, v7 | | |
| 1 | paid 0, v7 | reads v7 | reads v7 |
| 2 | paid 30,000, v8 | writes, `UPDATE 1` | |
| 3 | paid 30,000, v8 | | writes with v7, `UPDATE 0` |
| 4 | paid 80,000, v9 | | re-reads v8, writes, `UPDATE 1` |

Runnable Go version: [[Locking - Optimistic vs Pessimistic - Go]]

### 3.3 Deadlocks and lock ordering

A **deadlock** is a cycle of waits: transaction A holds row 1 and wants row 2, while B holds row 2 and wants row 1. Neither can proceed.

```mermaid
sequenceDiagram
    participant A as Txn A (merge 501 into 502)
    participant DB as invoices 501 and 502
    participant B as Txn B (merge 502 into 501)
    A->>DB: lock 501
    B->>DB: lock 502
    A->>DB: lock 502 (waits for B)
    B->>DB: lock 501 (waits for A)
    Note over DB: A has waited longest, so its deadlock_timeout (1 s) fires first and its check finds the cycle
    DB-->>A: ERROR 40P01 deadlock_detected (A rolled back)
    DB-->>B: lock 501 granted
```

PostgreSQL does not check for deadlocks on every wait. A waiting backend checks only after `deadlock_timeout` (default 1 s), then aborts one transaction in the cycle with SQLSTATE `40P01`.

In practice the victim is usually the backend that ran the check, which is the one that started waiting first; do not rely on which side loses. So a deadlock costs about a second of latency and one failed transaction.

```mermaid
flowchart LR
    TA["Txn A"] -- "holds" --> R501["row 501"]
    TB["Txn B"] -- "holds" --> R502["row 502"]
    TA -- "waits for" --> R502
    TB -- "waits for" --> R501
```

The prevention is **lock ordering**: every code path that locks several rows locks them in the same global order, usually ascending primary key. If A and B both lock 501 before 502, B simply waits behind A and no cycle can form.

```sql
SELECT id FROM invoices WHERE id = ANY($1) ORDER BY id FOR NO KEY UPDATE;
```

The `ORDER BY` matters: without it the rows are locked in whatever order the plan returns them.

```mermaid
sequenceDiagram
    participant A as Txn A (501 then 502)
    participant DB as invoices 501 and 502
    participant B as Txn B (also 501 then 502)
    A->>DB: lock 501
    B->>DB: lock 501 (waits for A, holds nothing)
    A->>DB: lock 502
    A->>DB: COMMIT, both released
    DB-->>B: lock 501 granted
    B->>DB: lock 502, COMMIT
    Note over A,B: no cycle is possible: nobody holds one row while waiting for a lower one
```

### 3.4 Advisory locks

An **advisory lock** is a lock on a number that you choose rather than on a row. PostgreSQL enforces nothing about what it protects; your code agrees on what the number means. It is useful as an application mutex when there is no row to lock, for example "only one job may regenerate the monthly statement for workspace 42".

```sql
BEGIN;
SELECT pg_advisory_xact_lock(hashtextextended('statement:42', 0));  -- waits
-- regenerate the statement
COMMIT;                                                             -- released
```

| Function | Scope | Released |
| --- | --- | --- |
| `pg_advisory_xact_lock(key)` | transaction | at commit or rollback, automatically |
| `pg_try_advisory_xact_lock(key)` | transaction | same; returns false instead of waiting |
| `pg_advisory_lock(key)` / `pg_advisory_unlock(key)` | session | only by explicit unlock or disconnect |

```mermaid
sequenceDiagram
    participant J1 as Job 1 (workspace 42)
    participant PG as PostgreSQL lock manager
    participant J2 as Job 2 (workspace 42)
    J1->>PG: pg_advisory_xact_lock(key of 'statement:42')
    PG-->>J1: granted
    J2->>PG: pg_advisory_xact_lock(same key)
    Note over J2,PG: J2 waits
    J1->>PG: COMMIT (lock released automatically)
    PG-->>J2: granted, J2 regenerates nothing twice
```

Prefer the transaction-scoped form. A session-scoped lock taken through a transaction-pooling proxy such as PgBouncer can stay attached to a server connection that another client then reuses (see [[Connection Pooling]]). Advisory locks protect only work inside one PostgreSQL cluster; for coordination across services, see [[Distributed Locks and Fencing Tokens]].

### 3.5 Optimistic concurrency outside SQL: compare-and-set

Optimistic concurrency outside SQL uses the same idea, called **compare-and-set** (CAS: write only if the current value still equals what you expect):

| System | Mechanism | Conflict signal |
| --- | --- | --- |
| HTTP API | `ETag: "7"` on GET; client sends `If-Match: "7"` on PUT/PATCH | `412 Precondition Failed`; `428 Precondition Required` if the header is missing |
| DynamoDB | `ConditionExpression: "version = :v"` on `UpdateItem` | `ConditionalCheckFailedException` |
| MongoDB | `findOneAndUpdate({_id, version: 7}, {$set: …, $inc: {version: 1}})` | `null` result |
| Redis | `WATCH key`, read, `MULTI` … `EXEC` | `EXEC` returns nil when the watched key changed |
| JPA / Hibernate, Rails | `@Version` field, `lock_version` column | `OptimisticLockException`, `StaleObjectError` |

The HTTP form is how InvoiceOps protects a user editing an invoice in a browser for five minutes: the version travels to the client as the ETag and comes back in `If-Match` ([[HTTP Caching - Cache-Control, ETag, Conditional Requests]] owns the header details).

Holding a database lock for five minutes of human thinking is never acceptable, so long-lived edits are always optimistic.

```mermaid
sequenceDiagram
    participant U1 as Browser of user 1
    participant API as InvoiceOps API
    participant U2 as Browser of user 2
    U1->>API: GET /invoices/501
    API-->>U1: 200, ETag "7"
    U2->>API: GET /invoices/501
    API-->>U2: 200, ETag "7"
    U1->>API: PATCH, If-Match "7"
    API-->>U1: 200, ETag "8"
    U2->>API: PATCH, If-Match "7"
    API-->>U2: 412 Precondition Failed, reload and merge
```

## 4. Worked example

The task: record payments against invoice 501 safely. Two handlers are possible. Both are correct; they differ in who pays when two webhooks collide.

### The bare idea in SQL

The pessimistic style: lock, check, write, commit.

```sql
BEGIN;
SET LOCAL lock_timeout = '2s';
SELECT total_minor, paid_minor FROM invoices WHERE id = 501 FOR NO KEY UPDATE;
-- app: if paid + 30000 > total then ROLLBACK
UPDATE invoices SET paid_minor = paid_minor + 30000 WHERE id = 501;
COMMIT;
```

The optimistic style: read, write only if unchanged, retry on 0 rows.

```sql
SELECT total_minor, paid_minor, version FROM invoices WHERE id = 501;   -- v = 7
UPDATE invoices SET paid_minor = 30000, version = 8
 WHERE id = 501 AND version = 7;                                       -- UPDATE 0 → re-read
```

### Trace: 50 payments of 2,000 at once

Invoice 1 has `total_minor = 100,000`. Fifty goroutines each pay 2,000 using the optimistic loop. Each round, exactly one writer wins; the others re-read and retry.

| Round | Writers still trying | Winner makes `paid_minor` | Losers retrying |
| --- | --- | --- | --- |
| 1 | 50 | 2,000 | 49 |
| 2 | 49 | 4,000 | 48 |
| … | … | … | … |
| 50 | 1 | 100,000, status `paid`, version 50 | 0 |

The worst case is 50 + 49 + … + 1 = 1,275 attempts; in practice goroutines do not all collide every round, and one measured run needed only a handful of retries.

The final state is always the same: `paid_minor = 100,000`, `version = 50`. The business rule is also checked on every attempt: if a 51st payment of 2,000 arrived, it would return "payment exceeds amount due" and never retry.

```mermaid
flowchart TD
    S["RecordPayment(invoice 1, 2,000, maxAttempts)"] --> G["Get: paid, total, version"]
    G --> OV{"paid + 2,000 > total?"}
    OV -- "yes" --> E1["ErrOverpay: a business rule, never retried"]
    OV -- "no" --> UP["UpdateIfVersion(next, version)"]
    UP --> R{"result"}
    R -- "nil" --> DONE["return the new invoice, version + 1"]
    R -- "ErrConflict" --> BK["wait 0 to attempt ms, then Get again"]
    BK --> G
    R -- "other error" --> E2["return it"]
    BK -. "attempts exhausted" .-> E3["ErrGaveUp"]
```

Runnable Go version: [[Locking - Optimistic vs Pessimistic - Go]]

### Seats and stock: the same two shapes

- **Seat booking:** "hold seat 14F" is a conditional write, `UPDATE seats SET held_by = $1 WHERE id = $2 AND held_by IS NULL`, and zero rows means the seat is gone. No retry: the user picks another seat.
- **Inventory decrement:** `UPDATE stock SET qty = qty - 1 WHERE sku = $1 AND qty > 0`. The condition is the version check. On a flash-sale SKU with thousands of buyers per second, every writer queues on that one row lock, so teams split stock into several rows (buckets) or reserve it in a cache first.

## 5. Variants and comparison

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Atomic `UPDATE … SET x = x + $1` | the database reads and writes under one row lock | the change fits in one statement | none extra; cannot run app logic in between |
| Conditional `UPDATE … WHERE <state check>` | business precondition in `WHERE`; 0 rows = rejected | claims, holds, `qty > 0` | caller must report "0 rows" properly |
| Optimistic (version column) | read, then `WHERE version = $n`; retry on 0 rows | low contention, user edits that span HTTP requests | wasted work and retries under contention |
| Pessimistic `FOR NO KEY UPDATE` / `FOR UPDATE` | lock row before reading | hot rows, expensive work that must not be redone | connection held while waiting; deadlock risk |
| `FOR SHARE` | shared lock: row cannot change, others can read-lock too | protect a parent row while inserting children | upgrading it to a write lock later invites deadlocks |
| `SKIP LOCKED` queue | each worker locks rows nobody else holds | job tables, outbox relays | not a general read; results are intentionally incomplete |
| Advisory lock | lock on an app-chosen number | mutex with no natural row | meaning lives only in your code |
| SERIALIZABLE isolation | the database detects dangerous patterns and aborts with `40001` | many invariants across rows (see [[Isolation Levels and MVCC]]) | retries on every transaction that touches the data |

```mermaid
flowchart TD
    Q["Which concurrency control?"] --> A{"one statement enough?"}
    A -- "yes" --> AT["atomic or conditional UPDATE"]
    A -- "no" --> B{"edit spans several HTTP requests or user think time?"}
    B -- "yes" --> OP["optimistic: ETag + If-Match, version column"]
    B -- "no" --> C{"many workers claiming rows from a table?"}
    C -- "yes" --> SK["FOR UPDATE SKIP LOCKED"]
    C -- "no" --> D{"hot row or work too expensive to redo?"}
    D -- "yes" --> PE["pessimistic: FOR NO KEY UPDATE with lock_timeout"]
    D -- "no" --> E{"no natural row to lock?"}
    E -- "yes" --> AD["advisory lock"]
    E -- "no" --> OP2["optimistic with retry and cap"]
```

## 6. Trade-offs and when not to use

- **Do not lock what one statement can do.** `SET paid_minor = paid_minor + $1` with a `CHECK (paid_minor <= total_minor)` constraint needs neither style.
- **Optimistic under heavy contention wastes work.** If 50 writers hit the same row together, each round lets one succeed and 49 retry. The number of attempts grows with contention, so cap attempts (the code uses a caller-given limit) and switch to a lock for genuinely hot rows.
- **Pessimistic locks hold connections.** A transaction waiting on a lock still occupies a pool connection. With a pool of 20 and 30 requests queued on one invoice, the whole service stalls. Always pair waiting locks with `lock_timeout` and keep the locked section free of network calls.
- **Never call another service while holding a row lock.** A payment provider that takes 10 s turns every request for that invoice into a 10 s wait. Do the remote call first, or record the intent and do the call outside the transaction.
- **Retry the whole transaction, not the failed statement.** After `40001` or `40P01` the transaction is aborted; every earlier read in it may be stale.
- **Business failures are not conflicts.** Retrying "would overpay" will fail the same way each time; the code returns `ErrOverpay` without retrying.

```mermaid
flowchart LR
    subgraph pool["connection pool of 20"]
        C1["20 connections busy"]
    end
    R["30 requests for invoice 501"] --> L["1 holds the row lock for 10 s (remote call inside)"]
    L --> W["19 other connections wait on the same lock"]
    W --> S["pool exhausted: requests for other invoices queue too"]
    pool --> S
```

## 7. In production

- **Real systems:** ORMs ship optimistic locking as a built-in (Hibernate `@Version`, Rails `lock_version`). Job-queue libraries on PostgreSQL such as River (Go), Oban (Elixir) and Solid Queue (Rails) fetch work with `FOR UPDATE SKIP LOCKED`. Kubernetes uses optimistic concurrency on every object through `resourceVersion` and rejects stale updates with HTTP 409.
- **Failure modes → fixes:**
	- Requests pile up behind one hot row → `lock_timeout`, shorter transactions, or split the row (stock buckets, counter shards).
	- Bursts of `40P01` → find the two code paths in the deadlock log entry and make them lock in the same order.
	- Optimistic retries never succeed under load → add jitter, cap attempts, or move that path to `FOR NO KEY UPDATE`.
	- A migration's `ALTER TABLE` waits behind a long transaction and every query queues behind the migration → `lock_timeout` on DDL; see [[Zero-Downtime Schema Migrations]].
	- `idle in transaction` sessions holding locks after an app crash mid-request → `idle_in_transaction_session_timeout`.
- **What to monitor:**
	- `log_lock_waits = on`: logs any lock wait longer than `deadlock_timeout`.
	- `pg_stat_database.deadlocks` counter, and the app's count of `40P01`, `40001`, `55P03` and optimistic conflicts per endpoint.
	- Who blocks whom, live:

```sql
SELECT pid, pg_blocking_pids(pid) AS blocked_by, wait_event_type,
       now() - xact_start AS txn_age, left(query, 60) AS query
  FROM pg_stat_activity
 WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

```mermaid
flowchart TD
    AL["alert: p99 latency of PATCH /invoices up, pool near 100 percent"] --> Q["run the pg_blocking_pids query"]
    Q --> R{"who is at the root of the blocking chain?"}
    R -- "idle in transaction" --> F1["app crash or missing commit: terminate it, set idle_in_transaction_session_timeout"]
    R -- "slow statement or remote call inside transaction" --> F2["move the call out of the transaction, add lock_timeout"]
    R -- "ALTER TABLE waiting behind a long transaction" --> F3["cancel the DDL, retry with lock_timeout"]
```

### The SKIP LOCKED job queue

Many workers can pull from one table without blocking each other. Each worker runs one statement that selects the next 10 due rows with `FOR UPDATE SKIP LOCKED` and marks them `running` in the same statement. The full SQL is in [[Locking - Optimistic vs Pessimistic - Go]].

```mermaid
sequenceDiagram
    participant W1 as Worker 1
    participant T as invoice_reminders (pending rows 1..30)
    participant W2 as Worker 2
    W1->>T: claim: FOR UPDATE SKIP LOCKED LIMIT 10
    T-->>W1: rows 1..10, locked
    W2->>T: same query a millisecond later
    Note over T: rows 1..10 are locked, so they are skipped, not waited on
    T-->>W2: rows 11..20, locked
    W1->>T: COMMIT with status running
    Note over W1,T: crash before COMMIT: rollback, rows 1..10 claimable again
```

Worker 1 locks the first 10 due rows; worker 2, running the same query a millisecond later, skips those 10 and gets the next 10. If a worker crashes while this statement's transaction is still open, the transaction rolls back and the rows become claimable again.

Once the claim has committed, the rows stay `running`, so a reaper must reset rows whose `locked_at` is too old. Retries, visibility timeouts and dead-letter handling belong to [[Background Workers and Job Queues]].

## Whiteboard version

```text
lost update = read -> compute in app -> write, overlapping another writer
1. one UPDATE can do it?        -> x = x + $1 (+ CHECK)
2. conflicts rare / long edit?  -> WHERE id=$1 AND version=$2 ; 0 rows = retry
3. hot row / costly to redo?    -> FOR NO KEY UPDATE + SET LOCAL lock_timeout
4. many workers on a table?     -> FOR UPDATE SKIP LOCKED
5. several rows?                -> lock in ascending id order ; retry on 40P01
```

## 8. Deep dive

### Where PostgreSQL stores row locks

A row lock is not an entry in the shared lock table. It is written into the row's header: the locker's transaction id goes into `xmax` with flag bits saying "locked, not deleted" (see [[Storage Engines - B-tree vs LSM and WAL]] for page layout).

That is why locking a million rows does not exhaust lock memory, and also why `SELECT … FOR UPDATE` dirties pages and writes WAL. When several transactions hold `FOR SHARE` on the same row, `xmax` points to a **MultiXact**, a separate record listing all lockers.

Heavy shared locking (including foreign-key checks on a popular parent row) grows the MultiXact area, which needs its own wraparound protection by VACUUM.

```mermaid
flowchart LR
    subgraph one["one locker"]
        H1["tuple header: xmax = 9001, flag locked-only"]
    end
    subgraph many["several FOR SHARE lockers"]
        H2["tuple header: xmax = MultiXact 55, flag is-multi"] --> MX["MultiXact 55: lists txns 9001, 9002, 9003"]
    end
```

### How waiting works

A transaction that finds a conflicting row lock waits on the holder's transaction id in the regular lock manager. When the holder ends, the waiter wakes, and at READ COMMITTED re-checks the updated row against its `WHERE` clause (PostgreSQL calls this EvalPlanQual).

A surprising consequence: `UPDATE … WHERE status = 'sent'` may wait, re-check, find the row is now `'paid'`, and update zero rows. That is correct, but the app must handle "0 rows" even in the pessimistic path.

### Lock queues

Waiters on table-level locks queue in arrival order, and a waiting strong lock blocks later weaker requests from jumping ahead. That is what makes one `ALTER TABLE`, waiting behind a long transaction, block every later reader of the table.

```mermaid
sequenceDiagram
    participant L as Long transaction (holds a weak table lock)
    participant D as ALTER TABLE invoices
    participant Q as New SELECT queries
    L->>L: running for 10 minutes
    D->>L: wants ACCESS EXCLUSIVE, waits
    Q->>D: SELECT arrives, queues behind the waiting ALTER
    Note over D,Q: every later query on invoices now waits too
    L->>L: COMMIT
    D->>D: ALTER runs, then releases
    Q->>Q: queued queries proceed
```

### InnoDB differs

MySQL InnoDB at its default REPEATABLE READ locks index ranges, not just rows. A locking read takes **next-key locks**: a lock on the index record plus the **gap** before it, so no one can insert into that gap.

The classic surprise: two sessions run `SELECT … FOR UPDATE WHERE id = 900` for an id that does not exist yet.

Both get the gap lock (gap locks do not conflict with each other), then both `INSERT id = 900`, each insert waits on the other's gap lock, and InnoDB reports a deadlock.

PostgreSQL has no gap locks; locking a non-existent row locks nothing, so the "check then insert" pattern there needs a unique constraint plus `INSERT … ON CONFLICT`. InnoDB has supported `NOWAIT`, `SKIP LOCKED` and `FOR SHARE` since MySQL 8.0.

```mermaid
sequenceDiagram
    participant A as Session A (InnoDB, REPEATABLE READ)
    participant IDX as index gap around id 900
    participant B as Session B
    A->>IDX: SELECT ... WHERE id = 900 FOR UPDATE (no row, gap lock)
    B->>IDX: SELECT ... WHERE id = 900 FOR UPDATE (gap locks do not conflict, granted)
    A->>IDX: INSERT id 900 (waits for B's gap lock)
    B->>IDX: INSERT id 900 (waits for A's gap lock)
    IDX-->>B: deadlock detected, one session rolled back
```

### Optimistic locking and isolation

The version check works at READ COMMITTED because the `UPDATE` re-reads the latest version. At REPEATABLE READ the same race surfaces as a `40001` error from the `UPDATE` instead of zero rows. Handle both: treat `40001` as a conflict and retry the whole transaction.

### Behaviour at scale

One row can absorb only so many locked writes per second, because they serialize on its lock and each one waits for the previous commit's WAL flush.

If a commit takes about 1 ms, one row tops out around 1,000 writes per second, regardless of how many CPUs the server has (an estimate from commit latency, not a benchmark).

Beyond that, change the data shape: per-shard counters summed on read, append-only ledger rows instead of a mutable balance, or batching.

```mermaid
flowchart LR
    subgraph hot["one hot row: serialized"]
        H1["write 1 (1 ms)"] --> H2["write 2 (1 ms)"] --> H3["write 3 (1 ms)"]
    end
    subgraph shard["4 counter shards: 4 rows in parallel"]
        S1["shard 0"]
        S2["shard 1"]
        S3["shard 2"]
        S4["shard 3"]
    end
    hot --> T1["about 1,000 writes per second (estimate)"]
    shard --> T2["about 4,000 writes per second (estimate), summed on read"]
```

## 9. Interview questions

> [!question]- What is a lost update, and does READ COMMITTED prevent it?
> Two transactions read the same value, each computes a new value in the application, and the second write overwrites the first. READ COMMITTED does not prevent it in PostgreSQL. Fixes: an atomic `SET x = x + 1`, a locking read (`FOR NO KEY UPDATE`), a version check, or REPEATABLE READ, which turns the second write into a `40001` error.

> [!question]- When would you choose optimistic over pessimistic locking?
> Optimistic when conflicts are rare, when the read and the write are far apart (a user editing in a browser), or when you cannot hold a connection. Pessimistic when the row is hot, the work is expensive to redo, or you must not do it twice (charging a card). Measure the conflict rate; if retries become common, switch.

> [!question]- Trap: "I added `FOR UPDATE` to my SELECT, but there is still a lost update." Why?
> Usually the `SELECT … FOR UPDATE` and the `UPDATE` ran in separate transactions, often because autocommit was on or the driver used two pool connections. The lock was released at the end of the first statement. Both statements must run inside one `BEGIN … COMMIT` on one connection, for example with `pgx.BeginFunc`.

> [!question]- Difference between FOR UPDATE and FOR NO KEY UPDATE?
> Both block other writers. `FOR UPDATE` also blocks `FOR KEY SHARE`, which foreign-key checks take, so inserting a child row that references the locked parent waits. `FOR NO KEY UPDATE` lets those inserts proceed and is what a plain `UPDATE` of non-key columns takes. Use it unless you will delete the row or change its key.

> [!question]- How do you prevent and handle deadlocks?
> Prevent by locking rows in a consistent order (ascending id, `ORDER BY id FOR UPDATE`), keeping transactions short, and avoiding lock upgrades (`FOR SHARE` then `UPDATE`). Handle by retrying the whole transaction on SQLSTATE `40P01`. PostgreSQL detects the cycle after `deadlock_timeout` (1 s by default) and aborts one victim.

> [!question]- How does SKIP LOCKED make a job queue work, and what is its catch?
> Each worker selects due jobs with `FOR UPDATE SKIP LOCKED`, so rows locked by other workers are skipped instead of waited on, and no two workers get the same job. The catch is that the result is intentionally inconsistent, so it is unusable for normal reads, and the jobs table needs an index on the filter and steady vacuuming because it churns.

> [!question]- What are advisory locks and when do they bite?
> Locks on an application-chosen 64-bit key, with no link to any row. Use `pg_advisory_xact_lock` for a mutex such as "one statement run per workspace". Session-level ones break under transaction-pooling proxies, because the lock stays on a server connection someone else gets, and they do nothing across separate database clusters.

## 10. Cheat sheet

- Lost update = read, compute in the app, write back, overlapping with another writer. Atomic SQL beats any lock.
- Pessimistic: `FOR NO KEY UPDATE` for updates, `FOR UPDATE` for deletes and key changes, `FOR SHARE` to freeze a row; lock lives until commit.
- Never wait forever: `SET LOCAL lock_timeout = '2s'`; `NOWAIT` fails at once; both raise `55P03`.
- Optimistic: `WHERE id = $1 AND version = $2`, `version = version + 1`; 0 rows = conflict; retry with jitter and a cap.
- HTTP form: ETag + `If-Match` → 412 on mismatch.
- Deadlocks: lock in id order; retry on `40P01`; detected after `deadlock_timeout` (1 s).
- `FOR UPDATE SKIP LOCKED` = job queue; `pg_advisory_xact_lock` = app mutex.
- Retry whole transactions on `40001`, `40P01`, `55P03`; never retry business-rule failures.

## Links

- **Implementation:** [[Locking - Optimistic vs Pessimistic - Go]]
- **Before this:** [[Transactions and ACID]], [[Isolation Levels and MVCC]]
- **Next:** [[Query Plans and EXPLAIN]], [[Background Workers and Job Queues]], [[Distributed Locks and Fencing Tokens]]
- **Compare with:** [[HTTP Caching - Cache-Control, ETag, Conditional Requests]], [[Transactions and the Repository Pattern]], [[Timeouts, Retries and Backoff]]

### Watch on YouTube

- [Optimistic Locking clearly explained / Java / SQL / System Design](https://www.youtube.com/watch?v=d41JuPT_Wls) · ByteMonk · clear explanation of version-column optimistic locking vs locking reads
