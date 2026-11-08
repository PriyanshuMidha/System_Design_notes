---
tags: [databases, transactions, isolation, mvcc, postgresql, mysql]
level: intermediate
status: reviewed
prereqs: ["[[Transactions and ACID]]", "[[Storage Engines - B-tree vs LSM and WAL]]"]
related: ["[[Isolation Levels and MVCC - Go]]", "[[Locking - Optimistic vs Pessimistic]]", "[[Consistency Models]]", "[[Replication]]", "[[Distributed SQL]]", "[[Timeouts, Retries and Backoff]]", "[[Transactions and the Repository Pattern]]"]
sources:
  - "PostgreSQL 17 docs, Concurrency Control: Introduction, Transaction Isolation, Serialization Failure Handling"
  - "PostgreSQL 17 docs, Routine Vacuuming: Recovering Disk Space, Preventing Transaction ID Wraparound Failures"
  - "PostgreSQL 17 docs, System Columns; System Information Functions (pg_current_snapshot, pg_current_xact_id); pageinspect"
  - "PostgreSQL 17 docs, Server Configuration: autovacuum, idle_in_transaction_session_timeout, max_pred_locks_per_transaction"
  - "PostgreSQL 17 release notes (VACUUM memory management)"
  - "MySQL 8.0 Reference Manual, InnoDB Locking and Transaction Model: Transaction Isolation Levels, Consistent Nonlocking Reads, Locking Reads, Phantom Rows"
  - "MySQL 8.0 Reference Manual, InnoDB Multi-Versioning and Purge"
  - "Berenson et al., A Critique of ANSI SQL Isolation Levels (SIGMOD 1995)"
  - "Cahill, Röhm, Fekete, Serializable Isolation for Snapshot Databases (SIGMOD 2008)"
  - "Ports and Grittner, Serializable Snapshot Isolation in PostgreSQL (VLDB 2012)"
  - "Kleppmann, Designing Data-Intensive Applications, chapter 7"
updated: 2026-11-07
---

# Isolation Levels and MVCC

> [!summary] TL;DR
> An **isolation level** is the promise a database makes about what one transaction can see of others running at the same time; weaker levels allow known bugs called **anomalies**. Most databases implement isolation with **MVCC** (multi-version concurrency control): a write creates a new version of the row, and each transaction reads from a consistent **snapshot**, so readers never block writers. PostgreSQL defaults to READ COMMITTED, MySQL InnoDB to REPEATABLE READ, and neither default stops every anomaly.

> [!abstract] Core idea
> - Isolation level = how much of other running transactions you can see; weaker levels allow named bugs (anomalies).
> - MVCC: an update writes a new row version; each transaction reads from a snapshot, so readers never block writers.
> - A version is visible if the transaction that created it committed before your snapshot and the one that deleted it did not.
> - Classic mistake: assuming REPEATABLE READ stops every anomaly. Write skew still gets through; only SERIALIZABLE (with retries) or explicit locks stop it.
> - Old versions stay until VACUUM; one long-open transaction blocks that cleanup everywhere.

## 1. Why it exists

InvoiceOps lets a customer run up an open balance only up to a credit limit. Customer 7 has `credit_limit_minor = 100000` and 70,000 open. Two staff members create invoices for customer 7 at the same moment:

| Step | Session A (invoice of 25,000) | Session B (invoice of 20,000) |
| --- | --- | --- |
| 1 | reads open balance → 70,000; 95,000 ≤ 100,000, OK | |
| 2 | | reads open balance → 70,000; 90,000 ≤ 100,000, OK |
| 3 | `INSERT` invoice, `COMMIT` | |
| 4 | | `INSERT` invoice, `COMMIT` |

```mermaid
sequenceDiagram
    participant A as Session A (25,000)
    participant DB as invoices of customer 7
    participant B as Session B (20,000)
    A->>DB: SELECT open balance
    DB-->>A: 70,000, so 95,000 fits under 100,000
    B->>DB: SELECT open balance
    DB-->>B: 70,000, so 90,000 fits under 100,000
    A->>DB: INSERT invoice 25,000, COMMIT
    B->>DB: INSERT invoice 20,000, COMMIT
    Note over DB: open balance is 115,000, limit was 100,000
```

The open balance is now 115,000. Neither session did anything wrong on its own, and no row was written twice. At PostgreSQL's default level, and even at REPEATABLE READ, both commit. Running transactions one at a time would have rejected B. Isolation levels define how close to "one at a time" the database gets for you, and what you must add yourself.

## 2. Mental model

### Snapshots: your own printout

Each transaction reads from a photograph of the committed data. Other sessions keep changing the real rows, but your photograph does not change. The isolation level decides how often you take a new photograph: per statement (READ COMMITTED) or once per transaction (REPEATABLE READ).

```mermaid
flowchart LR
    subgraph rc["READ COMMITTED: new photograph per statement"]
        R1["statement 1 sees data as of t1"] --> R2["statement 2 sees data as of t2"] --> R3["statement 3 sees data as of t3"]
    end
    subgraph rr["REPEATABLE READ: one photograph per transaction"]
        P1["statement 1 takes the snapshot at t1"] --> P2["statement 2 reuses it"] --> P3["statement 3 reuses it"]
    end
```

### Versions, not overwrites

An `UPDATE` does not erase the old row. It writes a new version and marks the old one as replaced, so older photographs can still find the version they need. Cleaning up versions nobody can see any more is a separate job (VACUUM in PostgreSQL, purge in InnoDB).

### What snapshots cannot see

A snapshot shows you a consistent past, but your decision is applied to the present. When your write depends on something another transaction changed after your photograph, you get lost updates and write skew. Only SERIALIZABLE, or a lock you take yourself, catches that.

Analogy: everyone works from their own printout of a shared spreadsheet. Printouts never change under you, but two people can each check "total < limit" on their printout and each add a row.

## 3. How it works

### The six anomalies

Each timeline runs top to bottom; statements outside `BEGIN … COMMIT` autocommit. A mapping from anomaly to the shortest fix:

```mermaid
flowchart TD
    A["Which anomaly worries you?"] --> D1{"sees uncommitted data?"}
    D1 -- "yes: dirty read" --> F1["any level above READ UNCOMMITTED, PostgreSQL never allows it"]
    D1 -- "no" --> D2{"same row or query differs inside one transaction?"}
    D2 -- "yes: non-repeatable read, phantom, read skew" --> F2["REPEATABLE READ: one snapshot"]
    D2 -- "no" --> D3{"two read-modify-write cycles overlap on one row?"}
    D3 -- "yes: lost update" --> F3["atomic UPDATE, row lock, version column, or REPEATABLE READ in PostgreSQL"]
    D3 -- "no, different rows" --> F4["write skew: SERIALIZABLE, lock a parent row, or a constraint"]
```

#### Dirty read

You see another transaction's uncommitted change.

| Step | Session A | Session B |
| --- | --- | --- |
| 1 | `BEGIN; UPDATE invoices SET status = 'paid' WHERE id = 42;` | |
| 2 | | `SELECT status FROM invoices WHERE id = 42;` → `paid` |
| 3 | `ROLLBACK;` | B emailed a receipt for a payment that never happened |

#### Non-repeatable read

The same row read twice gives different values.

| Step | Session A | Session B |
| --- | --- | --- |
| 1 | `BEGIN; SELECT total_minor FROM invoices WHERE id = 42;` → 50000 | |
| 2 | | `UPDATE invoices SET total_minor = 45000 WHERE id = 42;` |
| 3 | same `SELECT` → 45000 | |

#### Phantom read

The same query returns a different set of rows.

| Step | Session A | Session B |
| --- | --- | --- |
| 1 | `BEGIN; SELECT count(*) FROM invoices WHERE customer_id = 7 AND status = 'overdue';` → 3 | |
| 2 | | inserts a fourth overdue invoice for customer 7 |
| 3 | same `count(*)` → 4 | |

#### Read skew

You see part of another transaction's effects.

| Step | Session A (monthly statement) | Session B (payment webhook) |
| --- | --- | --- |
| 1 | `BEGIN; SELECT paid_minor FROM invoices WHERE id = 42;` → 0 | |
| 2 | | `BEGIN; INSERT INTO payments (invoice_id, amount_minor) VALUES (42, 50000); UPDATE invoices SET paid_minor = 50000 WHERE id = 42; COMMIT;` |
| 3 | `SELECT sum(amount_minor) FROM payments WHERE invoice_id = 42;` → 50000 | |

A's statement says "paid 0" next to "payments 50,000".

```mermaid
sequenceDiagram
    participant A as Session A (statement)
    participant DB as invoice 42
    participant B as Session B (webhook)
    A->>DB: BEGIN, SELECT paid_minor
    DB-->>A: 0
    B->>DB: BEGIN, INSERT payment 50,000, UPDATE paid_minor = 50,000, COMMIT
    A->>DB: SELECT sum of payments
    DB-->>A: 50,000
    Note over A: statement shows paid 0 next to payments 50,000
```

#### Lost update

Two read-modify-write cycles; one write silently overwrites the other.

| Step | Session A (payment of 10,000) | Session B (payment of 20,000) |
| --- | --- | --- |
| 1 | `BEGIN; SELECT paid_minor FROM invoices WHERE id = 42;` → 0 | |
| 2 | | `BEGIN; SELECT paid_minor FROM invoices WHERE id = 42;` → 0 |
| 3 | `UPDATE invoices SET paid_minor = 10000 WHERE id = 42; COMMIT;` | |
| 4 | | `UPDATE invoices SET paid_minor = 20000 WHERE id = 42; COMMIT;` |

The invoice shows 20,000 paid instead of 30,000. The fixes (atomic updates, row locks, version columns) are in [[Locking - Optimistic vs Pessimistic]].

```mermaid
sequenceDiagram
    participant A as Session A (+10,000)
    participant DB as invoice 42
    participant B as Session B (+20,000)
    A->>DB: SELECT paid_minor
    DB-->>A: 0
    B->>DB: SELECT paid_minor
    DB-->>B: 0
    A->>DB: UPDATE paid_minor = 10,000, COMMIT
    B->>DB: UPDATE paid_minor = 20,000, COMMIT
    Note over DB: 20,000 stored, A's 10,000 is lost
```

#### Write skew

The credit-limit story in section 1. Each transaction reads the same data, checks a rule, and writes a *different* row. No row is written twice, so no write-write conflict is ever detected.

```mermaid
flowchart LR
    subgraph shared["both transactions read the same rows"]
        RD["open balance of customer 7 = 70,000"]
    end
    RD --> TA["Txn A: checks 95,000 <= 100,000, inserts invoice row X"]
    RD --> TB["Txn B: checks 90,000 <= 100,000, inserts invoice row Y"]
    TA --> W["X and Y are different rows: no write-write conflict is detected"]
    TB --> W
    W --> BAD["balance 115,000: the rule is broken"]
```

### What each level prevents

| Anomaly | PG READ COMMITTED (default) | PG REPEATABLE READ | PG SERIALIZABLE | MySQL InnoDB REPEATABLE READ (default) |
| --- | --- | --- | --- | --- |
| Dirty read | prevented | prevented | prevented | prevented |
| Non-repeatable read | **possible** | prevented | prevented | prevented for plain `SELECT` |
| Phantom read | **possible** | prevented | prevented | prevented for plain `SELECT` |
| Read skew | **possible** | prevented | prevented | prevented for plain `SELECT` |
| Lost update (read in app, then write) | **possible** | prevented: second writer gets 40001 | prevented | **possible** |
| Write skew | **possible** | **possible** | prevented: one transaction gets 40001 | **possible** |

```mermaid
flowchart LR
    RU["READ UNCOMMITTED: nothing ruled out by the standard"] --> RCm["READ COMMITTED: + no dirty reads"]
    RCm --> RRm["REPEATABLE READ: + no non-repeatable reads, in PostgreSQL also no phantoms"]
    RRm --> SZ["SERIALIZABLE: result equals some one-at-a-time order, + no write skew"]
```

The SQL standard defines four levels by which phenomena they rule out. What engines actually do differs:

| Level | SQL standard rules out | PostgreSQL 17 | MySQL 8.0 / 8.4 InnoDB |
| --- | --- | --- | --- |
| READ UNCOMMITTED | nothing | Same as READ COMMITTED | Dirty reads really happen |
| READ COMMITTED | dirty reads | Default. New snapshot per statement. An `UPDATE` that meets a row changed by a concurrent transaction waits for it, then re-checks its `WHERE` on the newest version | New snapshot per consistent read; no gap locks except for foreign-key and duplicate-key checks |
| REPEATABLE READ | + non-repeatable reads | **Snapshot isolation**: one snapshot, taken at the first statement (not at `BEGIN`). Updating a row that changed after your snapshot fails with SQLSTATE 40001 | Default. Plain `SELECT` reads one snapshot. `UPDATE`, `DELETE` and locking reads use the *latest* committed rows and take next-key locks |
| SERIALIZABLE | + phantoms, and the result must equal some serial order | **Serializable snapshot isolation (SSI)**: snapshot isolation plus dependency tracking; aborts a transaction with 40001 instead of blocking | Like REPEATABLE READ, but plain `SELECT` becomes `SELECT … FOR SHARE` when autocommit is off: it blocks on locks instead of aborting |

> [!warning] Interview trap
> The standard's phenomena were defined so loosely that snapshot isolation satisfies them and still allows write skew (Berenson et al., 1995). That is why Oracle's level called SERIALIZABLE, and PostgreSQL's before 9.1, are really snapshot isolation.

### MVCC in PostgreSQL: versions in the heap

Every row version (tuple) carries hidden system columns:

- `xmin`: the transaction ID (xid) that created this version.
- `xmax`: the xid that deleted or replaced it, or 0. It is also set by row locks, with a flag that marks it as "lock only".
- `ctid`: the physical location `(page, slot)`. For a replaced version, it points to the next version in the chain.

An `UPDATE` therefore writes a new tuple and stamps `xmax` on the old one. With the `pageinspect` extension you can see both versions on the page. A demo table, after transaction 731 inserted invoice 42 and transaction 734 set it to `paid`:

```sql
SELECT lp, t_xmin, t_xmax, t_ctid
FROM heap_page_items(get_raw_page('invoices_demo', 0));
```

Representative output (PostgreSQL 17):

```text
 lp | t_xmin | t_xmax | t_ctid
----+--------+--------+--------
  1 |    731 |    734 | (0,2)
  2 |    734 |      0 | (0,2)
```

```mermaid
flowchart LR
    subgraph page["heap page 0 of invoices_demo"]
        L1["slot 1: status sent, xmin 731, xmax 734, ctid (0,2)"]
        L2["slot 2: status paid, xmin 734, xmax 0, ctid (0,2)"]
    end
    L1 -- "ctid points to the next version" --> L2
    S1["snapshot taken before 734 committed"] --> L1
    S2["snapshot taken after 734 committed"] --> L2
```

### Snapshots and the commit log

A **snapshot** records which transactions count as finished. `SELECT pg_current_snapshot();` prints it as `xmin:xmax:xip_list`, for example `735:738:736`: every xid below 735 had finished, none at or above 738 had started, and 736 was still running. Whether a finished xid committed or aborted is kept in `pg_xact`, two bits per transaction. The first reader to look a status up caches it in the tuple as **hint bits**, which is why a plain `SELECT` can dirty pages (and, with data checksums or `wal_log_hints` on, write WAL).

```mermaid
flowchart LR
    subgraph line["transaction id timeline for snapshot 735:738:736"]
        A["xid below 735: finished"] --> B["735: finished"] --> C["736: still running, in xip_list"] --> D["737: finished"] --> E["738 and above: not started"]
    end
```

### The visibility rule

```mermaid
flowchart TD
    T["row version with xmin and xmax"] --> C1{"xmin is my own xid, or xmin<br/>committed before my snapshot?"}
    C1 -- no --> I1["invisible: inserter aborted,<br/>still running, or started later"]
    C1 -- yes --> C2{"xmax set, and not lock-only?"}
    C2 -- no --> V["visible"]
    C2 -- yes --> C3{"xmax is my own xid, or xmax<br/>committed before my snapshot?"}
    C3 -- yes --> I2["invisible: deleted or replaced<br/>as far as I can see"]
    C3 -- no --> V
```

"Committed before my snapshot" means: the xid is below the snapshot's `xmax`, not in its in-progress list, and marked committed in `pg_xact`.

| Version | xmin | xmax | Reading with snapshot `735:738:736` | Visible? |
| --- | --- | --- | --- | --- |
| A | 731 | 736 | 731 finished and committed; 736 is in the in-progress list, so the delete is not seen | yes |
| B | 736 | 0 | 736 is in the in-progress list | no |
| C | 737 | 0 | 737 finished and committed | yes |

### READ COMMITTED vs REPEATABLE READ in PostgreSQL

This is only a question of when the snapshot is taken, plus one rule for writes:

- READ COMMITTED takes a new snapshot for every statement. If an `UPDATE`, `DELETE` or `SELECT … FOR UPDATE` finds its target row changed by a concurrent transaction, it waits for that transaction to finish (if it is still running) and, if it committed, re-evaluates its `WHERE` clause on the newest version. That is why `UPDATE invoices SET paid_minor = paid_minor + 10000 WHERE id = 42` never loses an update, while reading the value into Go and writing it back does.
- REPEATABLE READ keeps one snapshot. If the row you update, delete or lock was changed by a transaction that committed after your snapshot, you get `ERROR: could not serialize access due to concurrent update` (SQLSTATE 40001). The second writer loses, and your code must retry the whole transaction.

```mermaid
sequenceDiagram
    participant A as Txn A
    participant DB as invoice 42
    participant B as Txn B
    A->>DB: UPDATE paid_minor = paid_minor + 10000 (row lock)
    B->>DB: UPDATE paid_minor = paid_minor + 20000 (waits)
    A->>DB: COMMIT, paid_minor = 10000
    alt B at READ COMMITTED
        DB-->>B: re-evaluates on the new version, 10000 + 20000 = 30000
    else B at REPEATABLE READ
        DB-->>B: ERROR 40001 could not serialize access due to concurrent update
        Note over B: retry the whole transaction with a new snapshot
    end
```

### SERIALIZABLE in PostgreSQL: SSI

Since 9.1, PostgreSQL's SERIALIZABLE runs transactions exactly like REPEATABLE READ and additionally tracks **read-write dependencies**. "T1 →rw T2" means T1 read something that the concurrent T2 then wrote: a row version, or a gap T2 inserted into. Readers record what they read as **SIRead locks** (shown as `SIReadLock` in `pg_locks`). These never block anyone; they only let the database notice conflicts.

Every anomaly under snapshot isolation needs a "dangerous structure": two rw-dependencies in a row, T1 →rw T2 →rw T3, where T3 commits first (T1 and T3 may be the same transaction). PostgreSQL watches for that pattern and aborts one participant with 40001. That is cheap, but it also catches some harmless patterns (false positives), so retries are part of using SERIALIZABLE.

```mermaid
flowchart LR
    T1["T1 (reads)"] -- "rw: T1 read what T2 wrote" --> T2["T2 (pivot)"]
    T2 -- "rw: T2 read what T3 wrote" --> T3["T3 (commits first)"]
    T3 -. "T1 and T3 may be the same transaction: a cycle" .-> T1
    T2 --> AB["PostgreSQL aborts one of them with 40001"]
```

```mermaid
sequenceDiagram
    participant A as Session A (invoice 25,000)
    participant DB as PostgreSQL
    participant B as Session B (invoice 20,000)
    A->>DB: BEGIN ISOLATION LEVEL SERIALIZABLE
    B->>DB: BEGIN ISOLATION LEVEL SERIALIZABLE
    A->>DB: open balance of customer 7?
    DB-->>A: 70,000, SIRead lock on customer 7's invoices
    B->>DB: open balance of customer 7?
    DB-->>B: 70,000, SIRead lock on the same range
    A->>DB: INSERT invoice 25,000
    Note over DB: B read what A wrote: B →rw A
    B->>DB: INSERT invoice 20,000
    Note over DB: A read what B wrote: A →rw B, a cycle
    A->>DB: COMMIT
    DB-->>A: ok, open balance 95,000
    B->>DB: COMMIT
    DB-->>B: ERROR 40001 could not serialize access due to read/write dependencies
    Note over B,DB: B retries: 95,000 + 20,000 > 100,000, rejected
```

At REPEATABLE READ the same two sessions both commit and the balance ends at 115,000.

### VACUUM, bloat and transaction ID wraparound

Old versions stay in the table until VACUUM removes them, and VACUUM may only remove a version once no running snapshot could still need it. The oldest snapshot still in use (the **xmin horizon**) decides that.

```mermaid
stateDiagram-v2
    [*] --> InProgress: INSERT or UPDATE writes a new version
    InProgress --> Live: writer commits
    InProgress --> Dead: writer aborts
    Live --> Frozen: VACUUM freezes it, visible to every future snapshot
    Live --> Dead: a later UPDATE or DELETE commits and sets xmax
    Frozen --> Dead: a later UPDATE or DELETE commits
    Dead --> Removable: older than the xmin horizon
    Removable --> [*]: VACUUM frees the slot and its index entries
```

#### Bloat

Dead tuples, and the index entries pointing at them, take space and slow scans until VACUUM runs. Autovacuum starts when dead tuples exceed `autovacuum_vacuum_threshold` (50) + `autovacuum_vacuum_scale_factor` (0.2) × rows, and since PostgreSQL 13 also after many inserts. Plain VACUUM makes space reusable inside the table but rarely shrinks the file; `VACUUM FULL` rewrites the table under an ACCESS EXCLUSIVE lock.

Example: a table with 1,000,000 rows triggers autovacuum after 50 + 0.2 × 1,000,000 = 200,050 dead tuples.

#### The xmin horizon

One transaction left open for hours ("idle in transaction"), a stale replication slot, or a replica with `hot_standby_feedback = on` running a long query holds the horizon back. Then no table in the database can be cleaned, however often VACUUM runs.

```mermaid
flowchart LR
    subgraph timeline["dead versions by the xid that replaced them"]
        D1["xid 100-199: dead"] --> D2["xid 200-299: dead"] --> D3["xid 300-399: dead"]
    end
    OLD["idle in transaction, snapshot xmin = 150"] --> H["horizon = 150"]
    H --> CAN["VACUUM may remove: versions replaced before 150"]
    H --> CANT["VACUUM must keep: everything replaced after 150, in every table"]
```

#### XID wraparound

Transaction IDs are 32 bits and compared in a circle: about 2 billion xids are "in the past" and 2 billion "in the future". VACUUM **freezes** old tuples so they count as older than every xid. When a table's oldest unfrozen xid gets older than `autovacuum_freeze_max_age` (200 million), an anti-wraparound autovacuum is forced, even with autovacuum disabled. If that cannot keep up, PostgreSQL warns once only 40 million xids remain, and finally refuses to start transactions that need a new xid until a VACUUM fixes it. That is an outage.

```mermaid
flowchart LR
    N["xid 0"] --> M["current xid: 2 billion xids behind are the past"]
    M --> F["2 billion xids ahead look like the future"]
    F --> N
    G["200 million: forced anti-wraparound autovacuum"] --> W["40 million left: warnings"] --> S["0 left: refuses new xids until VACUUM runs"]
```

### MVCC in InnoDB: undo logs and two kinds of read

InnoDB updates the row in place in the clustered index and copies the old version into the **undo log**. Each row has hidden `DB_TRX_ID` (last writer) and `DB_ROLL_PTR` (pointer into undo) columns.

```mermaid
flowchart LR
    CUR["clustered index row: status paid, DB_TRX_ID 734"] -- "DB_ROLL_PTR" --> U1["undo record: status sent, trx 731"]
    U1 -- "older undo record" --> U2["undo record: earlier value"]
    RV["consistent read with a read view older than 734"] --> CUR
    RV -. "walks back through undo" .-> U1
```

- A **consistent read** (plain `SELECT`) builds the version its read view should see by following `DB_ROLL_PTR` back through undo records. At REPEATABLE READ the read view is created by the first consistent read of the transaction, or by `START TRANSACTION WITH CONSISTENT SNAPSHOT`.
- A **locking read** (`SELECT … FOR UPDATE` / `FOR SHARE`), `UPDATE` and `DELETE` read the *latest committed* version. They lock the index records they scan, plus the gaps before them (**next-key locks**) at REPEATABLE READ, which blocks phantom inserts for locking reads.
- The surprise this creates, from the MySQL manual: a REPEATABLE READ transaction can `UPDATE` or `DELETE` rows that its own `SELECT` cannot see, because another session committed them after the snapshot.
- There is no "first updater wins" check, so the lost-update timeline above silently succeeds at InnoDB's default level.
- **Purge** threads discard undo records once no read view needs them. A long transaction makes the **history list length** grow, the InnoDB version of bloat.

| | PostgreSQL | InnoDB |
| --- | --- | --- |
| Where old versions live | in the table (heap), next to the new one | in the undo log, away from the table |
| Cost of rollback | nearly free: versions just become invisible | real work: old values are copied back |
| Cleanup | VACUUM, and page pruning | purge threads |
| Symptom of a long transaction | table and index bloat, stuck xmin horizon | growing history list length |

## 4. Worked example

The task: decide, for InvoiceOps, how to stop the credit-limit write skew, and see what each level does with the same two sessions. Customer 7 has a limit of 100,000 and 70,000 open; session A adds 25,000 and session B adds 20,000.

### The bare idea

The visibility rule in plain steps. A snapshot remembers which transactions were finished when it was taken.

```text
visible(version, snapshot) =
    created_by_finished_committed_txn(version.xmin, snapshot)
    AND NOT deleted_by_finished_committed_txn(version.xmax, snapshot)

finished_committed(xid) = xid below snapshot.xmax
                          AND xid not in snapshot.in_progress_list
                          AND the commit log says committed
```

### Trace: the same two sessions at each level

| Level | A inserts 25,000 | B inserts 20,000 | Final open balance | Rule kept? |
| --- | --- | --- | --- | --- |
| READ COMMITTED | commits | commits | 115,000 | no |
| REPEATABLE READ | commits | commits (no row written twice, so no 40001) | 115,000 | no |
| SERIALIZABLE | commits | 40001; retry reads 95,000, 95,000 + 20,000 > 100,000, rejected | 95,000 | yes |
| READ COMMITTED + `FOR UPDATE` on the customer row | commits | waits for A, then reads 95,000, rejected | 95,000 | yes |

```mermaid
flowchart TD
    S["Credit-limit check: read open balance, compare, insert invoice"] --> Q{"how do I protect it?"}
    Q -- "SERIALIZABLE and retry" --> A1["second committer gets 40001, retry reads 95,000, rejects"]
    Q -- "lock the customer row first" --> A2["writers queue on customers.id = 7, second sees 95,000, rejects"]
    Q -- "constraint or one conditional UPDATE" --> A3["only if the rule fits one row, for example a running total column"]
```

The retrying wrapper that makes the first option correct is in [[Isolation Levels and MVCC - Go]], together with a runnable model of the visibility rule and the tests for each snapshot situation.

Runnable Go version: [[Isolation Levels and MVCC - Go]]

## 5. Variants and comparison

Ways to stop the anomalies that the default level allows:

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Atomic single statement | `UPDATE … SET x = x + $1 WHERE … AND x + $1 <= limit`, check rows affected | The rule fits in one row | Only works for one-row rules |
| Lock the parent row | `SELECT … FROM customers WHERE id = $1 FOR UPDATE` before the check: every writer for that customer queues | A rule over many rows that share a parent ("materialise the conflict") | Serialises writers per parent; deadlock risk if you lock in different orders |
| REPEATABLE READ | One snapshot; the second writer of a row gets 40001 | Consistent reports, lost-update protection on single rows | Retries; still allows write skew |
| SERIALIZABLE (SSI) | Snapshot + dependency tracking, 40001 on danger | Invariants across rows or tables; many code paths you cannot audit | Retries, false positives, SIRead-lock memory |
| Constraint | `UNIQUE`, `CHECK`, `EXCLUDE USING gist` | The rule can be declared | Only for rules the schema can express |

Defaults elsewhere, for interviews:

| Database | Default level | Notes |
| --- | --- | --- |
| PostgreSQL | READ COMMITTED | REPEATABLE READ = snapshot isolation; SERIALIZABLE = SSI |
| MySQL InnoDB | REPEATABLE READ | Snapshot for plain reads, next-key locks for locking reads |
| Oracle | READ COMMITTED | Its SERIALIZABLE is snapshot isolation |
| SQL Server | READ COMMITTED (locking; Azure SQL Database turns on row versioning by default) | `READ_COMMITTED_SNAPSHOT` switches it to row versioning; `SNAPSHOT` is snapshot isolation |
| CockroachDB | SERIALIZABLE | READ COMMITTED is generally available since v24.1 (preview in v23.2); see [[Distributed SQL]] |

```mermaid
flowchart TD
    N["Which level for this code path?"] --> Q1{"single-row change that one UPDATE can express?"}
    Q1 -- "yes" --> L1["READ COMMITTED + atomic conditional UPDATE"]
    Q1 -- "no" --> Q2{"report or export that must see one consistent snapshot?"}
    Q2 -- "yes" --> L2["REPEATABLE READ READ ONLY"]
    Q2 -- "no" --> Q3{"invariant over many rows?"}
    Q3 -- "yes, and a shared parent row exists" --> L3["lock the parent row FOR UPDATE"]
    Q3 -- "yes, no shared parent" --> L4["SERIALIZABLE + retry"]
    Q3 -- "no" --> L1
```

## 6. Trade-offs and when not to use

- **READ COMMITTED is fine for most single-statement work**, provided you write conditional updates instead of read-then-write in application code.
- **REPEATABLE READ** gives a stable view for reports and exports and turns lost updates into errors. A long-running REPEATABLE READ report also holds the xmin horizon for its whole duration.
- **SERIALIZABLE** costs retries and some throughput: predicate-lock bookkeeping, false-positive aborts, and wasted work on every retry. It is only guaranteed for transactions that *all* run SERIALIZABLE; one READ COMMITTED writer in the mix can still create an anomaly.
- **Do not reach for SERIALIZABLE** when a single atomic `UPDATE`, a unique constraint or one row lock expresses the rule more cheaply and more visibly.
- **Never put non-repeatable side effects inside a retried transaction**: charging a card, sending an email. Record the intent in the transaction and act after commit (see [[Transactional Outbox and CDC]]).

| Level | Retries needed? | Blocks readers? | Allows write skew? | Typical cost |
| --- | --- | --- | --- | --- |
| READ COMMITTED | rarely (deadlocks) | no | yes | lowest |
| REPEATABLE READ | yes, on 40001 | no | yes | one long-lived snapshot |
| SERIALIZABLE | yes, on 40001, including false positives | no | no | SIRead lock memory, wasted retries |

## 7. In production

- **Real systems:** InvoiceOps-style services typically run READ COMMITTED with conditional updates and row locks, and use SERIALIZABLE for the few invariants that span rows (credit limits, ledger balances), wrapped in the retry helper in [[Isolation Levels and MVCC - Go]].
- **Failure modes → fixes:**
	- *An "idle in transaction" session holds the xmin horizon for hours* → set `idle_in_transaction_session_timeout` (for example 60 s) and `statement_timeout`; never hold a transaction open across an HTTP call.
	- *A forgotten replication slot or `hot_standby_feedback` pins old versions* → monitor slot `xmin` and lag, drop dead slots.
	- *Wraparound warnings* → find what blocks freezing (old transactions, slots, prepared transactions), then run VACUUM on the oldest tables first.
	- *Retry storms under SERIALIZABLE* → cap attempts, add jitter, keep transactions short, prefer index scans (a sequential scan takes a relation-wide SIRead lock and conflicts with every write), and mark reports `READ ONLY DEFERRABLE`.
	- *SERIALIZABLE on a hot standby* is refused; replicas offer at most REPEATABLE READ.
	- *InnoDB history list length climbing* → find the oldest open transaction in `information_schema.innodb_trx` and end it.
- **What to monitor:**
	- Oldest snapshot: `SELECT pid, age(backend_xmin), xact_start, state FROM pg_stat_activity WHERE backend_xmin IS NOT NULL ORDER BY 2 DESC;`
	- `pg_replication_slots.xmin` and `catalog_xmin`.
	- Wraparound headroom: `SELECT datname, age(datfrozenxid) FROM pg_database;` (alert far below 2 billion; 500 million to 1 billion is a common choice).
	- `n_dead_tup` and `last_autovacuum` in `pg_stat_user_tables`.
	- Your own counter of 40001 and 40P01 retries per endpoint.
	- InnoDB: history list length (`SHOW ENGINE INNODB STATUS`).

```mermaid
flowchart TD
    AL["alert: n_dead_tup growing, queries slowing"] --> Q1["check oldest backend_xmin in pg_stat_activity"]
    Q1 --> C{"what holds the horizon?"}
    C -- "idle in transaction" --> F1["terminate it, set idle_in_transaction_session_timeout"]
    C -- "replication slot" --> F2["fix the lagging consumer or drop the slot"]
    C -- "replica with hot_standby_feedback" --> F3["shorten replica queries or turn feedback off"]
    C -- "prepared transaction" --> F4["COMMIT PREPARED or ROLLBACK PREPARED it"]
```

## Whiteboard version

```text
Level      snapshot       PostgreSQL gives            still possible
RC         per statement  re-check WHERE on update    lost update (read in app), write skew
RR         per txn        40001 on concurrent update  write skew
SERIAL     per txn + SSI  40001 on danger structure   nothing, but you must retry
visible = xmin committed-before-snapshot AND NOT (xmax committed-before-snapshot)
Fix write skew: SERIALIZABLE + retry | lock parent row | constraint
```

## 8. Deep dive

- **Snapshot timing.** In PostgreSQL the REPEATABLE READ snapshot is taken by the first statement after `BEGIN`, not by `BEGIN` itself. `pg_export_snapshot()` plus `SET TRANSACTION SNAPSHOT` lets several sessions share one snapshot; `pg_dump -j` uses it for consistent parallel dumps.
- **Why SSI has false positives.** SIRead locks start on tuples. When a transaction holds too many, they are promoted to page and then relation locks (`max_pred_locks_per_transaction`, default 64, sizes the shared lock table). A coarser lock conflicts with writes that never touched the rows actually read.
- **Read-only transactions are cheaper.** A `SERIALIZABLE READ ONLY DEFERRABLE` transaction waits for a "safe" snapshot, then runs with no SIRead locks and can never fail with 40001. It suits long reports.
- **Even a read-only transaction can see a non-serializable state under snapshot isolation** (Fekete, O'Neil and O'Neil, 2004): a report can observe the effect of a later transaction but not of an earlier one it depends on. SSI accounts for read-only transactions too.
- **MultiXacts.** When several transactions lock one row (for example `FOR SHARE`, or foreign-key checks), `xmax` holds a MultiXact ID that lists them. MultiXact IDs wrap around too and are frozen by VACUUM on their own schedule (`autovacuum_multixact_freeze_max_age`).
- **Page pruning (HOT pruning).** Any backend reading a heap page can prune it without waiting for VACUUM: dead tuple versions behind the xmin horizon have their space reclaimed. Heap-only tuples are removed completely; dead tuples that still have index entries are reduced to dead line pointers until VACUUM removes those index entries. That keeps hot, frequently updated rows from bloating as fast.
- **VACUUM in PostgreSQL 17** stores dead-tuple IDs in a new, compact structure, which uses much less memory and is no longer silently capped at 1 GB.
- **InnoDB secondary indexes** carry no version columns. When a secondary-index page was changed by a newer transaction, a consistent read must look the row up in the clustered index and walk undo to decide visibility, so long transactions make secondary-index reads slower too.

```mermaid
flowchart LR
    subgraph before["page before pruning"]
        B1["dead heap-only tuple"] --> B2["dead tuple with index entry"] --> B3["live tuple"]
    end
    subgraph after["after pruning by any reader"]
        A1["heap-only tuple: space reclaimed"] --> A2["dead line pointer kept for the index entry"] --> A3["live tuple"]
    end
    before --> after
    A2 -. "VACUUM removes the index entry, then the line pointer" .-> V["slot reusable"]
```

## 9. Interview questions

> [!question]- What exactly does PostgreSQL's REPEATABLE READ give you?
> Snapshot isolation: every statement sees one snapshot taken at the first statement, so no non-repeatable reads, phantoms or read skew. If you update a row someone else changed after your snapshot, you get 40001 and must retry. It still allows write skew.

> [!question]- Trap: SERIALIZABLE means transactions run one at a time, so no retries are needed?
> No. PostgreSQL runs them concurrently on snapshots and aborts one with 40001 when the dependency graph could form a cycle, sometimes as a false positive. The application must retry the whole transaction, and every participating transaction must use SERIALIZABLE.

> [!question]- Trap: does MySQL's default REPEATABLE READ prevent lost updates?
> No. A plain `SELECT` reads the snapshot, but `UPDATE` writes over the latest committed version without checking that it changed, so a read-modify-write cycle silently loses the other update. Use an atomic `UPDATE x = x + ?`, `SELECT … FOR UPDATE`, or a version column.

> [!question]- Explain write skew and three ways to prevent it.
> Two transactions read the same data, each checks a rule, and each writes a different row, so no write-write conflict fires; for example two invoices that together exceed a credit limit. Fixes: run SERIALIZABLE and retry; lock a shared parent row (`customers … FOR UPDATE`) before checking; or turn the rule into a constraint, or into one conditional update on one row.

> [!question]- How does PostgreSQL decide which row version a query sees?
> Each version has `xmin` (creator) and `xmax` (deleter). It is visible if the creator committed before the snapshot (or is you) and the deleter did not. "Before the snapshot" means below the snapshot's `xmax`, not in its in-progress list, and committed in `pg_xact`.

> [!question]- Why can one idle transaction hurt a busy PostgreSQL database?
> Its snapshot pins the xmin horizon, so VACUUM cannot remove any dead version newer than it in any table. Tables and indexes bloat, queries slow down, and in the extreme freezing stalls and the database approaches xid wraparound. Set `idle_in_transaction_session_timeout` and alert on the oldest `backend_xmin`.

> [!question]- Which isolation level would you run InvoiceOps at?
> READ COMMITTED by default, with atomic conditional updates or row locks for single-invoice changes. SERIALIZABLE with a retry wrapper for multi-row invariants such as credit limits. `REPEATABLE READ READ ONLY` for monthly statements, so totals and line items come from one snapshot.

## 10. Cheat sheet

- Anomalies: dirty read, non-repeatable read, phantom, read skew, lost update, write skew.
- PostgreSQL: RU = RC (default, snapshot per statement); RR = snapshot isolation (40001 on concurrent update); SERIALIZABLE = SSI (40001 on dangerous structures). Retry the whole transaction.
- InnoDB: RR default; plain reads use a snapshot, writes and locking reads use the latest rows with next-key locks; no lost-update protection.
- Write skew survives snapshot isolation: use SERIALIZABLE, lock a parent row, or a constraint.
- PostgreSQL MVCC: `xmin`/`xmax` per version, snapshot `xmin:xmax:xip`, status in `pg_xact`.
- VACUUM removes versions behind the xmin horizon and freezes old xids; long transactions and stale slots block both.
- Wraparound: 32-bit xids; forced autovacuum at 200 million; monitor `age(datfrozenxid)`.

## Links

- **Implementation:** [[Isolation Levels and MVCC - Go]]
- **Before this:** [[Transactions and ACID]], [[Storage Engines - B-tree vs LSM and WAL]]
- **Next:** [[Locking - Optimistic vs Pessimistic]], [[Replication]], [[Transactions and the Repository Pattern]]
- **Compare with:** [[Consistency Models]] (linearizability is about single objects in distributed systems; serializability is about transactions), [[Distributed SQL]] (serializable transactions across nodes)
