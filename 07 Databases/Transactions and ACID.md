---
tags: [databases, transactions, acid, postgresql, go]
level: basic
status: reviewed
prereqs: ["[[SQL Essentials]]"]
related: ["[[Transactions and ACID - Go]]", "[[Isolation Levels and MVCC]]", "[[Locking - Optimistic vs Pessimistic]]", "[[Storage Engines - B-tree vs LSM and WAL]]", "[[Transactions and the Repository Pattern]]", "[[Database Access (database-sql, pgx, sqlc)]]", "[[Transactional Outbox and CDC]]", "[[Saga Pattern]]", "[[Timeouts, Retries and Backoff]]"]
sources:
  - "PostgreSQL 17 docs, Tutorial: Transactions (BEGIN, COMMIT, ROLLBACK, SAVEPOINT)"
  - "PostgreSQL 17 docs, Reliability and the Write-Ahead Log: WAL Introduction, Asynchronous Commit, WAL Configuration (commit_delay, synchronous_commit, wal_writer_delay)"
  - "PostgreSQL 17 docs, Transaction Isolation (READ COMMITTED re-check of updated rows)"
  - "PostgreSQL 17 docs, Appendix A: PostgreSQL Error Codes (40001, 40P01, 23505, 23514, 25P02)"
  - "PostgreSQL 17 docs, Server Configuration: idle_in_transaction_session_timeout, statement_timeout"
  - "MySQL 8.0 Reference Manual, Statements That Cause an Implicit Commit; InnoDB Undo Logs"
  - "Go standard library docs, database/sql: DB.BeginTx, Tx.Commit, Tx.Rollback, TxOptions"
  - "Härder and Reuter, Principles of Transaction-Oriented Database Recovery (ACM Computing Surveys, 1983)"
  - "Kleppmann, Designing Data-Intensive Applications, chapter 7"
updated: 2026-11-07
---

# Transactions and ACID

> [!summary] TL;DR
> A **transaction** is a group of SQL statements that the database treats as one unit: either all of them take effect (**commit**) or none of them do (**rollback**). **ACID** names the four promises a transaction makes: Atomicity (all or nothing), Consistency (rules such as "stock is never negative" still hold afterwards), Isolation (transactions running at the same time do not corrupt each other's work) and Durability (a committed change survives a crash).

> [!abstract] Core idea
> - Wrap every multi-step change in `BEGIN … COMMIT`, so a crash or error halfway leaves no half-done work.
> - Durability comes from the write-ahead log (WAL): commit returns only after the log record is flushed to disk.
> - Consistency is mostly your job: constraints (`CHECK`, `UNIQUE`, foreign keys) plus correct transaction boundaries.
> - Isolation is level-dependent. At the default READ COMMITTED level, "read stock, then write stock" still oversells; use a conditional `UPDATE`, `SELECT … FOR UPDATE` or a constraint.
> - In Go: `BeginTx`, `defer tx.Rollback()`, `Commit()`, keep the transaction short, and never make HTTP calls inside it.

## 1. Why it exists

InvoiceOps (the running example in these notes: a multi-tenant invoicing SaaS) receives a payment webhook from its payment provider. Handling it takes four writes:

1. Record the webhook event so a redelivery is ignored.
2. Insert a row into `payments` with `amount_minor = 50000` (₹500.00, stored as **minor units**: an integer count of paise, so there are no floating-point rounding errors).
3. Update the invoice: `paid_minor = paid_minor + 50000`, `status = 'paid'`.
4. Write an audit log row.

### Problem 1: a crash halfway

Without a transaction, each statement is saved on its own. If the process crashes after step 2, the payment exists but the invoice still says `open`, so the customer receives an overdue reminder for an invoice they already paid. If the provider retries the webhook, step 1 may now say "already seen" and the invoice is never fixed.

```mermaid
flowchart LR
    S1["1 webhook event saved"] --> S2["2 payment row saved"]
    S2 --> X["process crashes here"]
    X -.-> S3["3 invoice update never runs"]
    X -.-> S4["4 audit row never written"]
    S2 --> R["Result: payment exists, invoice still open, retry skipped as 'already seen'"]
```

With a transaction, the four writes become one unit. A crash at any point before `COMMIT` leaves the database exactly as it was before step 1, and the retry simply runs the whole thing again.

| Crash point | Without a transaction | With a transaction |
| --- | --- | --- |
| After step 1 | Event recorded, nothing else: the retry is skipped | Nothing saved, retry runs all four steps |
| After step 2 | Payment recorded, invoice still `open`: wrong reminder email | Nothing saved, retry runs all four steps |
| After step 3 | Audit row missing | Nothing saved, retry runs all four steps |
| After `COMMIT` | Not applicable | All four saved, retry is deduplicated by step 1 |

### Problem 2: concurrency

If two customers try to buy the last unit of a product at the same moment, two transactions run side by side. Section 4 shows that a transaction alone does **not** stop both of them from succeeding; you also need the right SQL.

## 2. Mental model

Think of a transaction as a **shopping basket at a checkout**. You put items in one by one (statements), but nothing is yours until you pay (`COMMIT`). If your card is declined or you walk away (`ROLLBACK`, error, crash), every item goes back on the shelf. Nobody ever leaves with half a basket.

```mermaid
flowchart LR
    B["BEGIN: empty basket"] --> I1["INSERT payment: item in basket"]
    I1 --> I2["UPDATE invoice: item in basket"]
    I2 --> D{"pay or walk away?"}
    D -- "COMMIT" --> SH["everything leaves the shop together"]
    D -- "ROLLBACK, error, crash" --> RS["everything goes back on the shelf"]
```

### The four letters, in plain words

| Letter | Plain meaning | Who provides it | Mechanism (PostgreSQL 17) |
| --- | --- | --- | --- |
| **A**tomicity | All statements take effect, or none do | Database | Each row version is stamped with its transaction ID; if that transaction aborts, its versions are simply never visible, and the commit log (`pg_xact`) records the outcome |
| **C**onsistency | Data still obeys your rules after the transaction | **You**, helped by the database | `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys, plus transaction boundaries that keep related writes together |
| **I**solation | Concurrent transactions do not see or break each other's half-done work | Database, to the degree of the **isolation level** | MVCC snapshots and row locks; see [[Isolation Levels and MVCC]] |
| **D**urability | Once `COMMIT` returns, the change survives a crash or power loss | Database plus honest hardware | The WAL record is flushed to disk (`fsync`) before `COMMIT` returns |

### Two warnings about the letters

- **C in ACID is not the C in CAP.** ACID consistency means "your invariants hold". CAP consistency means linearizability, a distributed-systems property. Same word, different ideas.
- **The database cannot know your business rules unless you write them down.** "An invoice's `paid_minor` never exceeds `total_minor`" is only enforced if you add `CHECK (paid_minor <= total_minor)` or always check it in the same transaction.

## 3. How it works

### The lifecycle of one transaction

One idea: a transaction is always in exactly one of a few states, and only `COMMIT` from the active state makes work permanent.

```mermaid
stateDiagram-v2
    [*] --> Active: BEGIN
    Active --> Active: statement succeeds
    Active --> Failed: statement errors (PostgreSQL)
    Failed --> Failed: further statements rejected (25P02)
    Failed --> Active: ROLLBACK TO SAVEPOINT
    Active --> Committed: COMMIT (WAL flushed)
    Active --> RolledBack: ROLLBACK, crash or disconnect
    Failed --> RolledBack: ROLLBACK (or COMMIT, which rolls back)
    Committed --> [*]
    RolledBack --> [*]
```

- **Active.** Statements run. Their changes are visible to this transaction only.
- **Failed** (PostgreSQL behaviour). After any error, PostgreSQL rejects every further statement with `current transaction is aborted, commands ignored until end of transaction block` (SQLSTATE `25P02`). Sending `COMMIT` in this state performs a rollback. MySQL InnoDB differs: most errors roll back only the failing statement, and the transaction stays usable.
- **Committed.** All changes become visible to others at once and are durable.
- **Rolled back.** All changes are discarded.

Example: in InvoiceOps the webhook transaction runs `INSERT INTO payments`, which fails with `23505 unique_violation` because the payment already exists. The transaction moves to Failed; the following `UPDATE invoices` returns `25P02` without running. Only `ROLLBACK` clears it.

### Commit and rollback, step by step

One idea: before `COMMIT` the changes exist only as uncommitted row versions, so a rollback is a bookkeeping change, not an undo of data.

```mermaid
sequenceDiagram
    participant App as InvoiceOps API
    participant PG as PostgreSQL backend
    participant WAL as WAL on disk
    App->>PG: BEGIN
    App->>PG: INSERT INTO payments ...
    PG->>PG: write new row version (xmin = 9001), WAL record in memory
    App->>PG: UPDATE invoices SET paid_minor = ...
    PG->>PG: new invoice version, row lock held until end
    alt all good
        App->>PG: COMMIT
        PG->>WAL: append commit record, fsync
        WAL-->>PG: flushed
        PG-->>App: COMMIT ok (now durable and visible)
    else error or app decides to abort
        App->>PG: ROLLBACK
        PG->>PG: mark txn 9001 aborted, its row versions are never visible
        PG-->>App: ROLLBACK ok
    end
```

### Atomicity: invisible until committed

PostgreSQL writes each new row version as a new tuple in the table (the old version stays until VACUUM) and stamps it with the creating transaction ID (`xmin`). Readers check that ID against the commit log. An aborted transaction's versions are skipped and later cleaned up by VACUUM, so rollback is nearly free.

```mermaid
flowchart TD
    subgraph heap["invoices heap page"]
        V1["version A: paid_minor 0, xmin 700, xmax 9001"]
        V2["version B: paid_minor 50000, xmin 9001, xmax 0"]
    end
    Q["another session reads invoice 501"] --> L{"commit log: did txn 9001 commit?"}
    L -- "not yet, or aborted" --> V1
    L -- "committed" --> V2
```

Example numbers: transaction 9001 updates invoice 501 from `paid_minor = 0` to `50000`. While 9001 is open, every other session reads version A. If 9001 rolls back, version B is dead and version A is still the answer; nothing was copied back. InnoDB works the other way: it writes old values to an **undo log** and copies them back on rollback, so rolling back a large transaction in MySQL does real work and can take a long time.

### Durability: the write-ahead log

The **WAL** (write-ahead log) is an append-only file of change records. The rule is "log first, data pages later": before `COMMIT` returns, PostgreSQL flushes the WAL up to the commit record with `fsync` (a system call that forces data out of the OS cache onto the disk). The changed data pages can stay in memory; after a crash, PostgreSQL replays the WAL to rebuild them. Details live in [[Storage Engines - B-tree vs LSM and WAL]].

```mermaid
sequenceDiagram
    participant C as Client
    participant B as Backend
    participant M as Shared buffers (memory)
    participant W as WAL file
    participant D as Data files
    C->>B: COMMIT
    B->>M: data page changed, still dirty
    B->>W: append change records and commit record
    B->>W: fsync
    W-->>B: on disk
    B-->>C: COMMIT ok
    Note over M,D: checkpoint writes dirty pages to data files later
    Note over W,D: crash before the checkpoint: replay WAL to rebuild the pages
```

Example: the commit record for transaction 9001 is flushed at 10:00:00.001. The server loses power at 10:00:00.050 before the dirty invoice page reached the data file. On restart PostgreSQL replays the WAL, finds 9001's commit record, and reconstructs `paid_minor = 50000`. The client had already received `COMMIT ok`, so the promise holds.

### Consistency: constraints inside the transaction

A `CHECK`, `UNIQUE` or foreign-key violation raises an error and the transaction cannot commit. Constraints declared `DEFERRABLE INITIALLY DEFERRED` are checked at `COMMIT` instead of per statement.

| Constraint | Example rule | Violation | SQLSTATE |
| --- | --- | --- | --- |
| `CHECK` | `stock >= 0` | `UPDATE … SET stock = stock - 1` when stock is 0 | `23514` |
| `UNIQUE` | `(provider, provider_event_id)` | the same webhook inserted twice | `23505` |
| Foreign key | `payments.invoice_id` references `invoices.id` | payment for invoice 99999 | `23503` |

### Isolation: snapshots and locks

Each statement (READ COMMITTED) or each transaction (REPEATABLE READ and SERIALIZABLE) reads from a snapshot; writers take row locks. Which anomalies remain possible depends on the level: see [[Isolation Levels and MVCC]] and [[Locking - Optimistic vs Pessimistic]].

### Autocommit

If you send a statement without `BEGIN`, PostgreSQL wraps it in its own one-statement transaction and commits it immediately. This is **autocommit**. It is why a single `UPDATE` is always atomic, and also why two separate statements are **not** atomic together.

In Go, every call on `*sql.DB` (`db.ExecContext`, `db.QueryContext`) is autocommit, and the pool may send consecutive calls on **different connections**. So `db.Exec("BEGIN")` followed by `db.Exec("UPDATE …")` is a bug: the `BEGIN` may stay open on one connection while the `UPDATE` autocommits on another. Always use `db.BeginTx`, which pins one connection until `Commit` or `Rollback`.

```mermaid
sequenceDiagram
    participant G as Go code
    participant P as sql.DB pool
    participant C1 as connection 1
    participant C2 as connection 2
    G->>P: db.Exec("BEGIN")
    P->>C1: BEGIN
    Note over C1: transaction open, nobody will commit it
    G->>P: db.Exec("UPDATE invoices ...")
    P->>C2: UPDATE (autocommit)
    Note over C2: change is committed immediately, outside any transaction
    G->>P: db.Exec("ROLLBACK")
    P->>C2: ROLLBACK
    Note over C2: nothing to roll back, the UPDATE stays
```

Example: with a pool of 10 connections, three `db.Exec` calls in a row can land on three different connections. The `ROLLBACK` in the diagram does nothing, while connection 1 keeps holding its open transaction and its locks until the pool closes it.

### Savepoints

A **savepoint** is a named point inside a transaction you can roll back to without abandoning the whole transaction.

```sql
BEGIN;
INSERT INTO invoices (id, workspace_id, total_minor, status) VALUES (501, 7, 120000, 'draft');
SAVEPOINT try_coupon;
UPDATE coupons SET used = used + 1 WHERE code = 'LAUNCH10' AND used < max_uses;
-- suppose the coupon row violates a CHECK; undo only the coupon step:
ROLLBACK TO SAVEPOINT try_coupon;
RELEASE SAVEPOINT try_coupon;  -- forget the savepoint, keep the work before it
COMMIT;                         -- invoice 501 is saved without the coupon
```

```mermaid
stateDiagram-v2
    [*] --> InvoiceInserted: INSERT invoice 501
    InvoiceInserted --> SavepointSet: SAVEPOINT try_coupon
    SavepointSet --> CouponApplied: UPDATE coupons succeeds
    SavepointSet --> Failed: UPDATE coupons violates CHECK
    Failed --> SavepointSet: ROLLBACK TO SAVEPOINT try_coupon
    CouponApplied --> Committed: COMMIT, invoice with coupon
    SavepointSet --> Committed: RELEASE and COMMIT, invoice without coupon
    Committed --> [*]
```

In PostgreSQL, rolling back to a savepoint is the only way to recover from an error without losing the whole transaction. Some drivers and ORMs use savepoints to implement "nested transactions". Each savepoint creates a subtransaction, and thousands of them in one transaction can slow PostgreSQL down (see section 8).

### Retrying: what to do on 40001 and 40P01

Two SQLSTATE codes mean "nothing was saved, try again": `40001` (`serialization_failure`, raised by REPEATABLE READ and SERIALIZABLE) and `40P01` (`deadlock_detected`). The transaction is already aborted, so retrying only the failing statement is useless. The fix is to run the **whole** function again from `BEGIN`, with a small capped backoff.

```mermaid
flowchart TD
    A["run the whole transaction"] --> R{"result"}
    R -- "committed" --> OK["done"]
    R -- "40001 or 40P01" --> T{"attempts left?"}
    T -- "yes" --> W["wait with backoff, then run the whole transaction again"] --> A
    T -- "no" --> F["return a wrapped error"]
    R -- "any other error" --> E["roll back, return the error as is"]
```

Example: attempt 1 hits `40001`, waits 10 ms, attempt 2 hits `40001`, waits 20 ms, attempt 3 commits. A business error such as "out of stock" is returned at once, because running it again gives the same answer. The helper that does this is in [[Transactions and ACID - Go]].

## 4. Worked example: the last unit of stock

The task: InvoiceOps sells add-on products (for example, 100 printed cheque books) with a limited `stock`. Two customers try to buy the **last unit** at the same moment. Exactly one must succeed. The table has `stock int NOT NULL CHECK (stock >= 0)` as a safety net so stock can never go negative, and product 1 has `stock = 1` and `price_minor = 25000`.

### The bare idea in SQL

The wrong way reads, decides in the app, then writes. The right way puts the check inside the write:

```sql
-- WRONG at READ COMMITTED: both transactions read stock = 1, both "decide" to sell
SELECT stock FROM products WHERE id = 1;          -- both see 1
UPDATE products SET stock = 0 WHERE id = 1;       -- both write 0: two sales, one unit
```

```sql
-- RIGHT: the condition is evaluated on the latest committed row, under a row lock
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
-- winner: UPDATE 1, loser: UPDATE 0, so ROLLBACK and answer "sold out"
```

### Why the naive version oversells

Being inside a transaction does not help here. At **READ COMMITTED** (the PostgreSQL default), each statement sees all data committed before that statement started, and plain `SELECT` takes no lock. Both transactions read `stock = 1` before either commits.

```mermaid
sequenceDiagram
    participant A as Txn A (customer 1)
    participant DB as products id=1
    participant B as Txn B (customer 2)
    Note over A,B: Naive read-then-write (READ COMMITTED)
    A->>DB: SELECT stock -> 1
    B->>DB: SELECT stock -> 1
    A->>DB: UPDATE SET stock = 0 (row lock)
    B->>DB: UPDATE SET stock = 0 (waits for A's lock)
    A->>DB: COMMIT
    DB-->>B: lock granted, UPDATE 1
    B->>DB: COMMIT
    Note over A,B: two orders, one unit: oversold
```

### Why the conditional UPDATE is safe

The key PostgreSQL behaviour: at READ COMMITTED, when an `UPDATE` waits for another transaction's row lock and that transaction commits, PostgreSQL re-evaluates the `WHERE` clause against the **newly committed** row version before updating it. That re-check is what makes the conditional `UPDATE` safe.

```mermaid
sequenceDiagram
    participant A as Txn A (customer 1)
    participant DB as products id=1
    participant B as Txn B (customer 2)
    Note over A,B: Conditional UPDATE (READ COMMITTED)
    A->>DB: UPDATE SET stock = stock - 1 WHERE stock > 0
    DB-->>A: UPDATE 1 (row lock held)
    B->>DB: same UPDATE (waits for A's lock)
    A->>DB: COMMIT (stock = 0)
    DB-->>B: re-checks WHERE on new version: stock > 0 is false, UPDATE 0
    B->>DB: ROLLBACK, return "sold out"
```

The `CHECK (stock >= 0)` constraint is a second safety net. Even if some code path runs `SET stock = stock - 1` without the condition, the second buyer's update would fail with `23514 check_violation` instead of storing `-1`.

### Four correct ways to sell the last unit

| Technique | SQL shape | Loser sees | Use when |
| --- | --- | --- | --- |
| Conditional `UPDATE` | `UPDATE … SET stock = stock - 1 WHERE id = $1 AND stock > 0` | 0 rows affected | Counter-style resources; simplest and fastest |
| Pessimistic lock | `SELECT stock FROM products WHERE id = $1 FOR UPDATE`, then decide in Go, then `UPDATE` | Waits, then reads `stock = 0` | The decision needs several reads or app logic between read and write |
| Unique constraint | `UNIQUE (event_id, seat_no)` on a `tickets` table, then `INSERT` | `23505 unique_violation` | Each unit has an identity (seat 14B, invoice number) |
| SERIALIZABLE + retry | Naive read-then-write, run at `ISOLATION LEVEL SERIALIZABLE` | `40001 serialization_failure`; retry, then reads 0 | Complex invariants across many rows that are hard to express as one statement |

```mermaid
flowchart TD
    Q["Two buyers, one unit. How do I protect it?"] --> Q1{"Does one statement express the rule?"}
    Q1 -- "yes, a counter" --> C1["conditional UPDATE ... WHERE stock > 0"]
    Q1 -- "no" --> Q2{"Does each unit have an identity?"}
    Q2 -- "yes: seat 14B, invoice no." --> C2["UNIQUE constraint, INSERT, catch 23505"]
    Q2 -- "no" --> Q3{"Is the rule across one row you can lock?"}
    Q3 -- "yes" --> C3["SELECT ... FOR UPDATE, decide, UPDATE"]
    Q3 -- "no, many rows" --> C4["SERIALIZABLE, retry on 40001"]
```

Locks and the choice between waiting and retrying are covered in [[Locking - Optimistic vs Pessimistic]].

Runnable Go version: [[Transactions and ACID - Go]]

### Choosing the boundary: the payment webhook

The rule: **one transaction per business fact that must be all-or-nothing, and nothing slow inside it.** The webhook transaction does four things, in this order:

| Step | Statement | Why it is inside the transaction |
| --- | --- | --- |
| 1. Dedupe | `INSERT INTO webhook_events … ON CONFLICT (provider, provider_event_id) DO NOTHING`; if 0 rows inserted, `ROLLBACK` and return 200 | A redelivered webhook hits the unique key and inserts nothing |
| 2. Record the payment | `INSERT INTO payments (invoice_id, workspace_id, amount_minor, provider_ref)` with 50000 | Must exist exactly when step 3 happened |
| 3. Update the invoice | `UPDATE invoices SET paid_minor = paid_minor + 50000, status = CASE … END` | `CHECK (paid_minor <= total_minor)` guards overpayment |
| 4. Audit | `INSERT INTO audit_log …` | The audit row must exist exactly when the payment does |

The full SQL is in [[Transactions and ACID - Go]].

```mermaid
flowchart LR
    W["webhook arrives"] --> TX
    subgraph TX["one transaction: BEGIN ... COMMIT"]
        D["1 dedupe insert"] --> P["2 insert payment"] --> U["3 update invoice"] --> AU["4 audit row"] --> OB["5 outbox row: send email"]
    end
    TX -- "after COMMIT" --> WK["worker reads outbox, sends email"]
    D -. "0 rows: already processed" .-> OUT["ROLLBACK, return 200"]
```

Sending the "payment received" email is **not** inside this transaction. An SMTP call can take seconds, the transaction would hold the invoice row lock and a pooled connection the whole time, and if the commit then failed the email would already be sent. Instead, insert an outbox row in the same transaction and let a worker send the email: see [[Transactional Outbox and CDC]]. Why the dedupe step matters is covered in [[Idempotency and Idempotency Keys]].

## 5. Variants and comparison

| Option | What you get | Use when | Cost |
| --- | --- | --- | --- |
| Autocommit (single statement) | The one statement is atomic | One write, or reads that need no shared snapshot | None extra |
| Explicit `BEGIN … COMMIT` at READ COMMITTED | Atomic group; each statement sees fresh committed data | Default for multi-statement writes | Row locks held until commit |
| REPEATABLE READ | One snapshot for the whole transaction; concurrent update of the same row fails with `40001` | Consistent multi-query reads (reports, exports) | Must retry on `40001` |
| SERIALIZABLE | Result equals some one-at-a-time order | Invariants across many rows | More `40001` retries; predicate-lock memory |
| Savepoints | Partial rollback inside a transaction | Optional steps, recovering from an expected error | Subtransaction overhead in PostgreSQL |
| Saga or outbox (no ACID across services) | Eventual consistency with compensations | Work spans services or databases | Compensation logic, visible intermediate states |

```mermaid
flowchart TD
    N["What do I need?"] --> A{"one statement?"}
    A -- "yes" --> AC["autocommit"]
    A -- "no" --> B{"one database?"}
    B -- "no" --> SG["outbox + saga"]
    B -- "yes" --> C{"reads must be one consistent snapshot?"}
    C -- "yes" --> RR["REPEATABLE READ (read only for reports)"]
    C -- "no" --> D{"invariant across many rows?"}
    D -- "yes" --> SE["SERIALIZABLE + retry"]
    D -- "no" --> RC["READ COMMITTED + conditional UPDATE"]
```

Isolation levels are explained in full in [[Isolation Levels and MVCC]]. Cross-database atomicity is covered in [[Two-Phase Commit]] and [[Saga Pattern]].

## 6. Trade-offs and when not to use

- **Long transactions are expensive.** A transaction holds its row locks until it ends, keeps one pooled connection busy, and in PostgreSQL keeps an old snapshot alive so VACUUM cannot remove dead row versions anywhere in the database. Keep them to milliseconds.
- **No network calls inside.** HTTP, gRPC, email or queue publishes inside a transaction stretch lock time to the remote call's latency, and the remote side effect cannot be rolled back. Do them before (and pass the result in) or after (through an outbox).
- **A single statement does not need `BEGIN`.** Autocommit already makes it atomic, and an explicit transaction adds two round trips.
- **Large batch jobs should commit in chunks.** Updating 50 million rows in one transaction holds locks for the whole run, bloats the table, and a failure at 99% loses everything. Commit every few thousand rows and make the job resumable.
- **Transactions do not span services.** A `*sql.Tx` covers one connection to one database. Two services, or PostgreSQL plus Kafka, need the outbox pattern or a saga.
- **Higher isolation is not free.** SERIALIZABLE avoids whole classes of bugs but turns contention into retries. Use it where the invariant is hard to express in one statement, not everywhere.

```mermaid
flowchart LR
    subgraph short["short transaction: 5 ms"]
        S1["lock row"] --> S2["write"] --> S3["commit, lock freed"]
    end
    subgraph long["transaction wrapping an HTTP call: 3 s"]
        L1["lock row"] --> L2["wait for remote service"] --> L3["commit, lock freed"]
    end
    short --> T1["about 200 requests per second can use this row"]
    long --> T2["about 0.3 requests per second can use this row"]
```

The throughput figures are arithmetic (1 / lock time), not benchmarks: a row locked for 5 ms allows at most about 200 writers per second, a row locked for 3 s allows about one every 3 s.

## 7. In production

- **Real systems:** PostgreSQL, MySQL InnoDB, SQL Server and Oracle all provide ACID transactions on a single node. MongoDB has supported multi-document transactions since 4.0 (replica sets) and 4.2 (sharded clusters). Distributed SQL databases (CockroachDB, Spanner, YugabyteDB) provide them across nodes; CockroachDB and Spanner default to SERIALIZABLE, while YugabyteDB defaults to snapshot isolation (REPEATABLE READ): see [[Distributed SQL]].
- **Failure modes and fixes:**
	- *Idle in transaction:* code begins a transaction, then waits on an HTTP call or forgets to commit. Locks pile up behind it. Fix: no I/O inside transactions; set `idle_in_transaction_session_timeout` (default 0, meaning disabled) to something like `30s` so PostgreSQL kills such sessions.
	- *Using `db` instead of `tx`:* one statement silently runs outside the transaction. Fix: repositories accept a small interface satisfied by both `*sql.DB` and `*sql.Tx`, and the service layer decides which to pass.
	- *Retrying only the failed statement after `40001`:* the transaction is already aborted. Fix: retry the whole function, as `InTx` does.
	- *Pool exhaustion:* every open transaction holds a connection; slow transactions starve the pool. See [[Connection Pooling]].
	- *Deadlocks (`40P01`):* two transactions lock the same rows in opposite order. Fix: lock rows in a consistent order (for example, by `id`), and retry.
- **What to monitor:**
	- `pg_stat_activity` rows with `state = 'idle in transaction'` and old `xact_start`.
	- The age of the oldest open transaction (`now() - min(xact_start)`).
	- `pg_stat_database.xact_rollback` relative to `xact_commit`, and `deadlocks`.
	- Application metrics for `40001` and `40P01` retries.

```mermaid
flowchart TD
    M["alert: idle in transaction older than 30 s"] --> Q["SELECT pid, now() - xact_start, query FROM pg_stat_activity WHERE state = 'idle in transaction'"]
    Q --> C{"who holds it?"}
    C -- "app bug: HTTP call or missing commit" --> F1["fix the code path, add idle_in_transaction_session_timeout"]
    C -- "crashed client, connection still open" --> F2["pg_terminate_backend(pid), then fix timeouts"]
```

## Whiteboard version

If you have two minutes at a whiteboard, draw this:

```text
BEGIN --> stmt --> stmt --> COMMIT   (all visible, durable)
                      \--> ROLLBACK  (none visible)
A: aborted row versions are invisible    D: WAL fsync before COMMIT returns
C: constraints + your invariants         I: snapshot + row locks, level-dependent
Oversell fix: UPDATE ... WHERE stock > 0, check rows affected
```

## 8. Deep dive

- **Commit latency is an `fsync`.** With the default `synchronous_commit = on`, each commit waits for its WAL flush. On local NVMe with power-loss protection that is typically well under a millisecond; on network-attached cloud volumes it is often around 1–5 ms (estimates; measure your disk with `pg_test_fsync`). PostgreSQL batches concurrent commits into one flush (**group commit**); `commit_delay` can widen that window.
- **`synchronous_commit = off`.** Commit returns before the flush. A crash can lose the last commits (up to about three times `wal_writer_delay`, which defaults to 200 ms), but cannot corrupt the database. It can be set per transaction: `SET LOCAL synchronous_commit = off` is reasonable for analytics events, never for payments.
- **Replicated durability.** With synchronous replication, `synchronous_commit = remote_apply` (or `on`, or `remote_write`) also waits for a standby. That trades latency for surviving the loss of a whole machine: see [[Replication]].
- **DDL is transactional in PostgreSQL.** `CREATE TABLE`, `ALTER TABLE` and most other DDL can be rolled back. Exceptions include `CREATE INDEX CONCURRENTLY` and `VACUUM`, which refuse to run inside a transaction block. In MySQL, DDL causes an implicit commit, so a migration that mixes DDL and DML is not atomic.
- **Subtransactions.** Each `SAVEPOINT` (and each PL/pgSQL `EXCEPTION` block) creates a subtransaction. PostgreSQL caches up to 64 subtransaction IDs per backend; beyond that, visibility checks must consult `pg_subtrans` and throughput can collapse under concurrency. Avoid loops that create a savepoint per row.
- **Transaction ID wraparound.** PostgreSQL transaction IDs are 32-bit. VACUUM must "freeze" old rows before IDs wrap around; a transaction left open for days blocks this. See [[Isolation Levels and MVCC]].
- **Read-only transactions still matter.** `BEGIN READ ONLY` (Go: `TxOptions{ReadOnly: true}`) documents intent, lets a REPEATABLE READ export see one snapshot across many queries, and with `SERIALIZABLE READ ONLY DEFERRABLE` runs without any risk of serialization failure.

```mermaid
flowchart LR
    subgraph fast["synchronous_commit = on"]
        F1["commit record written"] --> F2["fsync 1-5 ms (estimate)"] --> F3["ack to client"]
    end
    subgraph async["synchronous_commit = off"]
        A1["commit record written"] --> A2["ack to client at once"]
        A1 -.-> A3["WAL writer flushes within about 600 ms"]
    end
    A3 -.-> L["crash before the flush: last commits lost, database not corrupted"]
```

## 9. Interview questions

> [!question]- What does each letter of ACID guarantee, and how does PostgreSQL provide it?
> Atomicity: all or nothing; row versions of an aborted transaction are never visible. Consistency: constraints and your invariants hold after commit; mostly the application's job, enforced with `CHECK`, `UNIQUE` and foreign keys. Isolation: concurrent transactions do not interfere, to the degree of the isolation level (MVCC snapshots plus row locks). Durability: commit returns only after the WAL record is flushed to disk.

> [!question]- Trap: two users buy the last ticket inside transactions. Does the transaction stop overselling?
> Not by itself. At READ COMMITTED (the PostgreSQL default), both can `SELECT stock` and see 1, then both write. Put the check inside the write (`UPDATE … WHERE stock > 0` and check rows affected), lock the row with `SELECT … FOR UPDATE`, use a unique constraint per seat, or run SERIALIZABLE and retry on `40001`. A `CHECK (stock >= 0)` constraint is a good safety net.

> [!question]- Why must you not call `db.Exec("BEGIN")` in Go?
> `*sql.DB` is a pool. Each call may use a different connection, so the `BEGIN` and the following statements can land on different sessions, leaving an open transaction on one connection and autocommitting on another. `db.BeginTx` pins one connection to the returned `*sql.Tx` until `Commit` or `Rollback`.

> [!question]- What do you do when a transaction fails with SQLSTATE 40001 or 40P01?
> Retry the whole transaction from `BEGIN`, re-reading all data, with a small capped backoff. Retrying only the failing statement is useless because PostgreSQL has already aborted the transaction. Side effects outside the database must not happen inside the retried function, or they repeat.

> [!question]- Why should a transaction never wrap an HTTP call?
> It holds row locks and a pooled connection for the duration of the remote call, so other requests queue behind it; it keeps an old snapshot open, which blocks VACUUM; and the remote side effect cannot be rolled back if the commit later fails. Call before the transaction, or after it through an outbox.

> [!question]- How is durability actually achieved, and what does `synchronous_commit = off` trade away?
> The commit record is written to the WAL and flushed with `fsync` before `COMMIT` returns; data pages are rebuilt from the WAL after a crash. With `synchronous_commit = off`, commit returns before the flush, so a crash can lose roughly the last 600 ms of commits (3 × the default `wal_writer_delay`), but never corrupts data.

> [!question]- Can you have a transaction across two microservices?
> Not an ACID one in practice. Two-phase commit exists but blocks when the coordinator fails and is rarely available across HTTP services. Use a local transaction plus an outbox to publish the event reliably, and a saga with compensating actions for multi-step business flows.

> [!question]- What happens in PostgreSQL after one statement in a transaction fails?
> The transaction enters the aborted state; every further statement returns `25P02` until you `ROLLBACK` (or `ROLLBACK TO SAVEPOINT`). Even `COMMIT` performs a rollback. MySQL InnoDB usually rolls back only the failing statement, which surprises people moving between the two.

## 10. Cheat sheet

- Transaction = all-or-nothing unit; `BEGIN`, then `COMMIT` or `ROLLBACK`.
- A: aborted versions are invisible. C: constraints plus your invariants. I: depends on level. D: WAL `fsync` before commit returns.
- Single statements autocommit; multi-statement changes need an explicit transaction.
- Go: `tx, err := db.BeginTx(ctx, opts)`, `defer tx.Rollback()`, pass `tx` everywhere, `return tx.Commit()`.
- Oversell fix: `UPDATE … WHERE stock > 0` and check rows affected, or `FOR UPDATE`, or `UNIQUE`, or SERIALIZABLE + retry.
- Retry the whole transaction on `40001` and `40P01`; never just the statement.
- Keep transactions short; no network calls inside; set `idle_in_transaction_session_timeout`.
- Across services: outbox and sagas, not distributed transactions.

## Links

- **Implementation:** [[Transactions and ACID - Go]]
- **Before this:** [[SQL Essentials]], [[Relational Schema Design]]
- **Next:** [[Isolation Levels and MVCC]], [[Locking - Optimistic vs Pessimistic]], [[Transactions and the Repository Pattern]], [[Storage Engines - B-tree vs LSM and WAL]]
- **Compare with:** [[Transactional Outbox and CDC]] and [[Saga Pattern]] (consistency across services without ACID), [[Two-Phase Commit]] (atomic commit across databases)
