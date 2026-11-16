---
tags: [databases, distributed-sql, newsql, transactions, consensus]
level: advanced
status: reviewed
prereqs: ["[[Transactions and ACID]]", "[[Isolation Levels and MVCC]]", "[[Replication]]", "[[Partitioning and Sharding]]", "[[Consensus - Raft and Paxos]]"]
related: ["[[Two-Phase Commit]]", "[[CAP and PACELC]]", "[[Clocks and Ordering]]", "[[Multi-Region Architecture]]", "[[Locking - Optimistic vs Pessimistic]]", "[[Consistent Hashing]]"]
sources:
  - "Corbett et al., Spanner: Google's Globally-Distributed Database (OSDI 2012), TrueTime and commit wait"
  - "Taft et al., CockroachDB: The Resilient Geo-Distributed SQL Database (SIGMOD 2020)"
  - "Kulkarni et al., Logical Physical Clocks and Consistent Snapshots in Globally Distributed Databases (HLC, 2014)"
  - "Huang et al., TiDB: A Raft-based HTAP Database (VLDB 2020); Peng and Dabek, Percolator (OSDI 2010)"
  - "CockroachDB docs: Architecture overview, Transaction layer, Transaction retry error reference, Follower reads, range_max_bytes default 512 MiB, --max-offset default 500ms"
  - "YugabyteDB docs: DocDB sharding (hash and range), transaction isolation levels"
  - "AWS docs: Amazon Aurora DSQL concurrency control"
updated: 2026-11-13
---

# Distributed SQL

> [!summary] TL;DR
> A distributed SQL database looks like PostgreSQL or MySQL to your code, but splits its tables into small key ranges, keeps each range on 3 or more machines with its own consensus group (usually Raft), and runs ACID transactions across ranges. You get horizontal scale and automatic failover with strong consistency, and you pay for it in extra network round trips on every write and retry errors your code must handle.

> [!abstract] Core idea
> - Tables are cut into **ranges** of sorted keys; each range is a small replicated log with its own Raft leader.
> - A transaction that touches several ranges uses two-phase commit, but every participant is itself a Raft group, so a crashed machine does not block the commit.
> - Transactions are ordered by timestamps: Spanner uses atomic-clock **TrueTime**, CockroachDB and YugabyteDB use **hybrid logical clocks**, TiDB uses a central timestamp server.
> - Serializable is the default in CockroachDB and Spanner, so conflicts surface as `40001` "retry the transaction" errors that the client must handle.
> - Global consistency costs cross-region latency on every write. If one PostgreSQL primary with replicas fits your load, it is simpler, cheaper and faster.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works), 4 (worked example) and 5 (comparison).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

**From zero, in 60 seconds** 🟢

A normal SQL database lives on one computer. One day your data, or your traffic, no longer fits on one computer.

```mermaid
flowchart LR
    APP["Your app"] --> ONE["One database server<br/>(full, and if it dies, you're down)"]
```

A **distributed SQL** database looks the same to your code — you still write plain SQL — but behind the curtain it cuts each table into slices and spreads the slices over many machines. Each slice is copied to 3 machines, and the copies vote on every change so nothing is lost when one machine dies.

```mermaid
flowchart LR
    APP["Your app, plain SQL"] --> DB["Looks like one database"]
    DB --> S1["slice 1 on machines A,B,C"]
    DB --> S2["slice 2 on machines B,C,D"]
```

The hard part is time: a **transaction** ("move money from A to B, all or nothing") may touch two slices on different machines, and the machines' clocks disagree slightly. Most of this note is about how they agree anyway.

The rest of this note is just these 4 questions:
1. When does one normal database stop being enough? (section 1)
2. How is a table split, copied and kept in sync? (sections 2-3)
3. How do transactions and clocks work across machines? (sections 3-4)
4. Which product does what, and when should you NOT use any of them? (sections 5-9)

**The problem in one story.**
Your invoices table no longer fits on one server, and you need it in two regions.
You still want normal SQL: joins, transactions, and "the money moved from A to B or not at all".
Splitting the data by hand breaks transactions that touch two servers.
Distributed SQL databases split the data for you and still run real transactions across servers.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Transaction | A group of writes that all happen or none happen | Debit A and credit B together |
| Shard / range | One slice of a table, by key order, stored on some servers | Keys `a` to `m` on range 1 |
| Replica | A copy of a range on another machine | 3 copies of range 1 in 3 zones |
| Raft | A voting protocol so replicas agree on the order of writes | A write counts once 2 of 3 replicas accept it |
| Two-phase commit (2PC) | "Everyone ready? Then everyone commit" across several ranges | Prepare range 1 and 2, then commit both |
| Timestamp / clock | A number that orders transactions in time | Tx 1 at 100, Tx 2 at 105 |
| Serializable | Results look as if transactions ran one after another | No two people book the same seat |

**Picture it**

```mermaid
flowchart LR
    APP["SQL client"] --> GW["Any node<br/>(gateway)"]
    GW --> R1["Range 1<br/>Raft group: 3 copies"]
    GW --> R2["Range 2<br/>Raft group: 3 copies"]
    R1 --> C{"2PC: both ranges<br/>agree to commit?"}
    R2 --> C
    C --> OK["Committed with<br/>one timestamp"]
```

**Analogy.** A big library splits its books across several branches, and each branch keeps three copies of its shelf. Borrowing two books from two branches is one checkout: either both are stamped out or neither is.
Where it breaks: branches are minutes apart, but a real library has no clock problem; databases must work hard to agree on what "now" is across machines.

**How the rest of this note builds up**

- First, why one PostgreSQL server stops being enough (section 1) and the "many small Raft groups" mental model (section 2).
- Then how it works: ranges, splits, hot spots, 2PC over Raft, write intents and isolation (section 3).
- Then the clocks: TrueTime, hybrid logical clocks, timestamp oracles and Spanner's commit wait (section 3), traced with latency numbers (section 4).
- Finally the SDE-3 view: CockroachDB vs Spanner vs YugabyteDB vs TiDB, `40001` retries, follower reads and when not to use it (sections 5-8).

> [!tip] Remember
> Cut tables into ranges, replicate each with Raft, join them with 2PC, and order everything by timestamps.

## 1. Why it exists 🟢

InvoiceOps runs on one PostgreSQL 17 primary with two replicas. It now has 40,000 workspaces in the US, EU and India. Three problems appear:

- **Write ceiling.** All writes go to one machine. At peak month-end billing the primary runs at 85% CPU and the WAL volume saturates its disk; reads can go to replicas, writes cannot.
- **Failover.** When the primary dies, a replica is promoted. With asynchronous replication, the last few hundred milliseconds of commits can be lost, and the switch takes tens of seconds (estimates that depend on the setup).
- **Geography.** EU customers' data must live in the EU, and an EU user's write to a US primary pays roughly 80–100 ms of round trip (an estimate for a transatlantic link).

The classic fix is manual sharding by `workspace_id` ([[Partitioning and Sharding]]): many PostgreSQL clusters plus routing code. It works, but transactions across shards, global unique constraints, resharding and cross-shard queries become the application's problem.

Distributed SQL moves that work into the database: one logical SQL database, data split and rebalanced automatically, transactions that span machines, and failover without data loss because every write is committed by a quorum.

## 2. Mental model 🟢

Picture a library that outgrew one building.

- The catalogue is sorted by key and cut into **ranges** (shelves): "invoices from workspace 1 to 999", "1,000 to 1,999", and so on.
- Each shelf is copied to three branches. The three copies vote on every change, and a change counts once two of the three agree (a **quorum**). One branch is the **leader** for that shelf and orders its changes.
- A transaction that touches two shelves writes **provisional** entries on both, then flips one master switch that says "committed". Readers who meet a provisional entry check the switch.
- Every change carries a **timestamp**, so all branches agree which change came first, even though their wall clocks differ slightly.

Terms used below:

- **Range** (CockroachDB), **tablet** (YugabyteDB, Spanner calls them splits), **region** (TiDB): a contiguous slice of the sorted key space, the unit of replication and rebalancing.
- **Raft group**: the replicas of one range, running the Raft consensus protocol ([[Consensus - Raft and Paxos]]). A write is durable once a majority has it in its log.
- **Leaseholder**: the replica allowed to serve consistent reads for a range without asking the others; usually also the Raft leader.
- **Write intent**: a provisional MVCC (multi-version concurrency control) value written by an uncommitted transaction.
- **Gateway node**: whichever node the client connected to; it parses SQL and coordinates the transaction.

## 3. How it works 🟡

### Range sharding with Raft per range

**In plain words: every row becomes a key on one long sorted shelf; the shelf is cut into chunks, and each chunk has 3 copies that vote on changes.**

```mermaid
flowchart TB
    client["Go service via pgx"] --> gw["gateway node n1: SQL parse, plan, range cache"]
    gw -->|"key /invoices/7/..."| r1
    gw -->|"key /payments/7/..."| r2
    subgraph r1["Range 12: invoices keys from /invoices/1 to /invoices/5000"]
        direction LR
        a1["n1 leaseholder + Raft leader"] --- a2["n2 follower"] --- a3["n4 follower"]
    end
    subgraph r2["Range 31: payments keys from /payments/1 to /payments/9000"]
        direction LR
        b1["n3 leaseholder + Raft leader"] --- b2["n1 follower"] --- b3["n5 follower"]
    end
```

1. Every row becomes a key-value pair. The key is the table id plus the primary key, so rows are sorted by primary key, and a secondary index is just another set of keys.
2. The sorted key space is cut into ranges. CockroachDB splits a range when it passes 512 MiB (the default `range_max_bytes`) or when it gets too much load.
3. Each range has 3 replicas by default (configurable to 5 or more) on different nodes, ideally in different zones or regions.
4. The gateway looks up which range holds a key (a cached range directory; [[Distributed SQL - Go]] implements one as a `Router`) and sends the request to that range's leaseholder.
5. A write is proposed to the range's Raft leader, appended to a majority of logs, and then applied. A read at the leaseholder needs no consensus round, because the lease guarantees no other replica can be accepting writes.

### Range splits

**In plain words: when a chunk gets too fat or too busy, the database cuts it in two — like splitting an overfull binder into two binders.**

A range is not fixed. When it grows past the size limit or draws too much traffic, the database cuts it in two at a key and hands one half to a different set of nodes.

```mermaid
flowchart LR
    subgraph before["Before: one range, 512 MiB reached"]
        R1["Range 12<br/>keys /invoices/1 to /invoices/5000<br/>leaseholder n1"]
    end
    subgraph after["After split at /invoices/2500"]
        R2["Range 12<br/>keys /invoices/1 to /invoices/2500<br/>leaseholder n1"]
        R3["Range 58 (new)<br/>keys /invoices/2500 to /invoices/5000<br/>leaseholder moves to n2"]
    end
    R1 -->|"size or load threshold"| R2
    R1 --> R3
```

Example: a 1 GiB table with a 512 MiB limit ends up as at least 2 ranges. Each new range gets its own Raft group, and the balancer may move its leaseholder to a less busy node.

### Hot spots from sequential keys

**In plain words: if every new row's key is "the next number", all inserts pile onto the last chunk — one machine does all the work while the rest sit idle.**

Range sharding keeps nearby keys together, so range scans are efficient. The price is that a monotonically increasing key (a timestamp or a sequence) sends all inserts to the last range: a hot spot.

```mermaid
flowchart LR
    subgraph seq["Sequential key: SERIAL or created_at"]
        i1["insert 1001"] --> L1["last range, one leaseholder<br/>takes 100% of writes"]
        i2["insert 1002"] --> L1
        i3["insert 1003"] --> L1
        Z1["other ranges idle"]
    end
    subgraph spread["UUID or hash-sharded key"]
        j1["insert a3f"] --> M1["range A"]
        j2["insert 7c1"] --> M2["range B"]
        j3["insert e90"] --> M3["range C"]
    end
```

The fixes are UUID keys, hash-sharded indexes, or a leading `workspace_id`. YugabyteDB hash-shards the first primary-key column by default for this reason, and lets you choose range sharding with `ASC`/`DESC`.

### Transactions across ranges: two-phase commit over Raft

**In plain words: write "pencil" entries on every chunk first, then flip one master switch that turns them all into "ink" at once — and the switch itself is copied to 3 machines so no single crash can lose it.**

```mermaid
sequenceDiagram
    participant G as Gateway (coordinator)
    participant R12 as Range 12 leader (invoices)
    participant R31 as Range 31 leader (payments)
    participant TR as Txn record (lives in range 12)
    G->>G: pick start timestamp from HLC, ts = 100.0
    G->>R12: write intent: invoice 42 status = paid
    R12->>R12: Raft replicate to quorum
    G->>R31: write intent: payment 9001 row
    R31->>R31: Raft replicate to quorum
    G->>TR: set STAGING with list of intents (parallel commits)
    TR->>TR: Raft replicate to quorum
    Note over G,TR: Once all intents and STAGING are replicated, the txn is committed
    G-->>G: return COMMIT OK to client
    G->>TR: mark COMMITTED (async)
    G->>R12: resolve intent into a normal value (async)
    G->>R31: resolve intent into a normal value (async)
```

This is two-phase commit ([[Two-Phase Commit]]): phase one writes intents, phase two flips the transaction record. Classic 2PC blocks if the coordinator dies between the phases, because participants hold locks and do not know the outcome.

Here the transaction record and every intent are **replicated by Raft**, so any node can read the record and finish or abort the transaction.

A reader that meets an intent looks up the record: committed means use the value, aborted means ignore it, pending means wait or push the other transaction's timestamp.

CockroachDB's **parallel commits** (since v19.2) write the `STAGING` record at the same time as the last intents, which turns two sequential consensus rounds at commit into one. Spanner uses classic 2PC across Paxos groups, with one group's leader as coordinator.

TiDB uses the Percolator protocol: a primary lock and secondary locks in TiKV, with commit decided by the primary key's lock.

### What a reader does when it meets a write intent

**In plain words: a reader who finds a pencil entry goes and checks the master switch — committed means "use it", aborted means "ignore it", pending means "wait or push".**

```mermaid
stateDiagram-v2
    [*] --> Pending: intent written, txn record PENDING
    Pending --> Staging: coordinator writes STAGING with intent list
    Staging --> Committed: all intents replicated, or recovered by any node
    Pending --> Aborted: coordinator dies, others push it past its timeout
    Staging --> Aborted: an intent is missing
    Committed --> [*]: reader uses the value, intent resolved async
    Aborted --> [*]: reader ignores the intent
```

Example: transaction T1 has an intent on invoice 42 and then its coordinator crashes. A reader R finds the intent, reads T1's record from range 12, sees `STAGING`, checks that the payment intent in range 31 is also replicated, and concludes T1 is committed. R reads the new value and no one has to wait for the dead coordinator.

### Timestamps: TrueTime vs HLC vs a timestamp oracle

**In plain words: machines must agree on what happened first, but their watches all run slightly differently — the three schemes below are three ways of coping with bad watches.**

All of these databases use MVCC ([[Isolation Levels and MVCC]]): every value is stored with a commit timestamp, and a transaction reads the newest version at or below its read timestamp. The question is where the timestamps come from, given that server clocks drift ([[Clocks and Ordering]]).

- **Spanner: TrueTime.** Google's datacentres have GPS receivers and atomic clocks. `TT.now()` returns an interval `[earliest, latest]` guaranteed to contain true time; the uncertainty ε was typically 1–7 ms in the 2012 paper. At commit, Spanner picks timestamp `s = TT.now().latest` and then **waits until `TT.now().earliest > s`** before releasing locks (commit wait, about 2ε). After that wait, any transaction that starts later in real time is guaranteed to get a larger timestamp. That property is **external consistency** (also called strict serializability).
| System | Timestamp source | Needs special hardware | Price paid |
| --- | --- | --- | --- |
| Spanner | TrueTime interval | GPS and atomic clocks | Commit wait of about 2ε per write transaction |
| CockroachDB, YugabyteDB | HLC | No | Max clock offset, uncertainty restarts |
| TiDB | Central TSO in PD | No | One round trip to PD per transaction (batched) |

- **CockroachDB and YugabyteDB: hybrid logical clocks (HLC).** Each timestamp is wall time plus a logical counter. A node that receives a message with a larger timestamp moves its clock forward to it, so causally related events are ordered correctly without special hardware. Clocks must stay within a maximum offset (500 ms by default in CockroachDB); a node whose clock drifts past that shuts itself down. Because clocks are not exact, a reader that sees a value with a timestamp slightly above its own, inside its **uncertainty interval**, cannot tell whether it happened before or after it; it must restart at a higher timestamp.
- **TiDB: timestamp oracle (TSO).** The Placement Driver (PD) cluster hands out strictly increasing timestamps from one leader. Ordering is trivial; the cost is a round trip to PD for each transaction (batched) and a dependency on PD's availability and location.

### An HLC keeps cause before effect

**In plain words: when a machine hears from someone whose clock is ahead, it moves its own clock forward — so an effect can never get an earlier timestamp than its cause.**

Example: node A's clock reads 5 ms, node B's clock reads 0 ms. A commits invoice 42 at timestamp (5.000 ms, 0) and sends the news to B. Without help, B would stamp the payment it writes next with a time near 0 ms, earlier than the invoice it depends on.

```mermaid
sequenceDiagram
    participant A as Node A, wall clock 5.000 ms
    participant B as Node B, wall clock 0.000 ms
    A->>A: Now() returns (5.000 ms, 0) for invoice 42
    A->>B: message carries (5.000 ms, 0)
    B->>B: Update() sees remote wall above its own, adopts (5.000 ms, 1)
    B->>B: Now() for payment returns (5.000 ms, 2), because wall clock still 0
    Note over A,B: payment (5.000 ms, 2) is ordered after invoice (5.000 ms, 0)
```

### Commit wait in Spanner

**In plain words: Spanner knows its clock is at most a few milliseconds wrong, so it just waits those few milliseconds before saying "done" — after the wait, time has definitely passed the chosen timestamp.**

```mermaid
sequenceDiagram
    participant Tx as Spanner txn T1
    participant TT as TrueTime
    participant L as Paxos leader
    Tx->>L: acquire locks, prepare writes
    L->>TT: TT.now()
    TT-->>L: earliest 10.000, latest 10.006
    L->>L: choose commit ts s = 10.006
    L->>L: Paxos replicate commit record
    loop commit wait
        L->>TT: TT.now().earliest > 10.006 ?
    end
    L-->>Tx: committed at 10.006, release locks
    Note over Tx,L: Any txn that starts after this point gets a timestamp above 10.006
```

### Isolation and retries

**In plain words: these databases prefer to cancel one of two clashing transactions rather than let them corrupt each other — your code must be ready to simply run the whole transaction again.**

```mermaid
stateDiagram-v2
    [*] --> Running: BEGIN
    Running --> Committed: COMMIT ok
    Running --> Restart: conflict found, SQLSTATE 40001
    Restart --> Backoff: client ROLLBACK
    Backoff --> Running: wait with jitter, re-run every statement
    Backoff --> GaveUp: attempts exhausted
    Running --> Failed: non-retryable error such as 23505
    Committed --> [*]
    GaveUp --> [*]
    Failed --> [*]
```

CockroachDB and Spanner default to **SERIALIZABLE**. CockroachDB does it optimistically: transactions do not take read locks, and conflicts found at write or commit time cause one transaction to restart. The client sees SQLSTATE `40001` with a message such as `restart transaction: TransactionRetryWithProtoRefreshError: ... RETRY_SERIALIZABLE`.

CockroachDB added `READ COMMITTED` (generally available in v24.1) for workloads that cannot handle retries. YugabyteDB's YSQL behaves as snapshot isolation by default (what PostgreSQL calls `REPEATABLE READ`; `READ COMMITTED` maps to snapshot unless the `yb_enable_read_committed_isolation` flag is set) and also supports serializable.

TiDB defaults to snapshot isolation under the name `REPEATABLE READ`, with pessimistic locking the default for new clusters since v3.0.8. Aurora DSQL uses optimistic concurrency control with snapshot isolation and reports conflicts at commit.

The practical rule for every one of them: **wrap each transaction in a retry loop**, and keep anything non-transactional (HTTP calls, emails, Kafka publishes) outside it.

## 4. Worked example 🟡

### Whiteboard version

Paying an invoice touches two tables that live in different ranges. The SQL is plain PostgreSQL; the difference is that the database may answer `40001` and the client must re-run the whole block.

```sql
BEGIN;  -- SERIALIZABLE by default in CockroachDB
UPDATE invoices
   SET status = 'paid', paid_minor = total_minor
 WHERE workspace_id = 7 AND id = 42 AND status = 'open';   -- range 12
INSERT INTO payments (workspace_id, id, invoice_id, amount_minor)
VALUES (7, 9001, 42, 129900);                               -- range 31
COMMIT;
-- On ERROR 40001: ROLLBACK and run the whole block again.
```

### Tracing the latency in three layouts

**In plain words: where you put the 3 copies decides how long every write takes — copies in one city are fast, copies on three continents make every commit cross an ocean.**

Assume 3 replicas, about 1 ms round trip inside a region, about 70 ms US-east to EU and about 200 ms US-east to India (round numbers, **estimates**). Each write needs one Raft quorum round from the range leader; commit with parallel commits needs one more round, overlapped with the last write.

| Layout | Where replicas live | One write | This 2-write transaction | Survives |
| --- | --- | --- | --- | --- |
| Single region, 3 zones | us-east-1a, 1b, 1c | about 1–2 ms | about 3–5 ms | loss of one zone |
| Three regions, leaders in US | US, EU, India | quorum = US + EU, about 70 ms | about 140–150 ms from a US client | loss of one region |
| Regional by row (workspace pinned to its home region) | 3 zones inside the workspace's region, plus non-voting replicas elsewhere | about 1–2 ms in the home region | about 3–5 ms | loss of one zone, not the region |

```mermaid
flowchart TB
    subgraph one["Layout 2: leaders in US, quorum US + EU"]
        c1["US client"] -->|"1 ms"| l1["US leader"]
        l1 -->|"about 70 ms, waits for 2 of 3"| e1["EU replica acks"]
        l1 -.->|"India ack not needed"| i1["India replica"]
    end
    subgraph two["Layout 3: regional by row, EU workspace pinned to EU"]
        c2["EU client"] -->|"1 ms"| l2["EU zone-a leader"]
        l2 -->|"1 ms"| e2["EU zone-b replica acks"]
        l2 -.->|"async copy"| n2["non-voting replica in US"]
    end
```

The middle row is the price of surviving a whole region with consistent writes: every commit waits for a majority that lies in another region.

The usual answer is the third row: pin each workspace's rows to its home region (CockroachDB `REGIONAL BY ROW`, YugabyteDB tablespaces, Spanner placement configurations), and replicate only small, read-mostly tables everywhere (CockroachDB `GLOBAL` tables, which make reads local and writes slower).

```sql
-- CockroachDB multi-region syntax (v21.1 and later)
ALTER DATABASE invoiceops SET PRIMARY REGION "us-east1";
ALTER DATABASE invoiceops ADD REGION "europe-west1";
ALTER DATABASE invoiceops ADD REGION "asia-south1";
```

```sql
ALTER TABLE invoices SET LOCALITY REGIONAL BY ROW;   -- hidden crdb_region column per row
ALTER TABLE currencies SET LOCALITY GLOBAL;          -- fast reads everywhere, slow writes
```

```sql
-- Follower read: may be a few seconds stale, served by the nearest replica.
SELECT count(*) FROM invoices AS OF SYSTEM TIME follower_read_timestamp()
WHERE workspace_id = 7 AND status = 'open';
```

Representative output (CockroachDB, not PostgreSQL 17) of inspecting the ranges after a split:

```sql
SHOW RANGES FROM TABLE invoices WITH DETAILS;  -- v23.1+: lease and replica columns need WITH DETAILS
--   start_key        | end_key          | range_id | lease_holder | replicas
-- -------------------+------------------+----------+--------------+---------
--   …/1              | …/7/42           |       12 |            1 | {1,2,4}
--   …/7/42           | …/5000           |       58 |            2 | {1,2,4}
--   …/5000           | <after:/Max>     |       59 |            4 | {2,3,4}
```

Runnable Go version: [[Distributed SQL - Go]]

## 5. Variants and comparison 🟡

**In plain words: all five products use the same recipe — sorted slices, voting copies, timestamps — and differ mainly in where the timestamps come from and which wire protocol they speak.**

| System | Sharding and replication | Timestamps | Default isolation | Wire protocol | Notes |
| --- | --- | --- | --- | --- | --- |
| Google Spanner | Splits, Paxos per split | TrueTime + commit wait | Serializable, externally consistent | Native APIs, GoogleSQL and a PostgreSQL dialect | Managed only; strongest guarantees |
| CockroachDB | Ranges (512 MiB default), Raft per range | HLC, 500 ms max offset | Serializable | PostgreSQL wire | Multi-region SQL syntax; self-hosted or managed |
| YugabyteDB | Tablets, Raft per tablet; hash or range | HLC | Snapshot (YSQL), serializable available | PostgreSQL (reuses Postgres's query layer) and a Cassandra-like API | Good Postgres feature coverage |
| TiDB | Regions in TiKV, Raft per region | Central TSO in PD | Snapshot (`REPEATABLE READ`) | MySQL wire | TiFlash columnar replicas for analytics |
| Amazon Aurora DSQL | Serverless, multi-region active-active | Managed | Snapshot, optimistic | PostgreSQL wire (subset) | Conflicts reported at commit; check feature limits |
| PostgreSQL + replicas | One primary, streaming replicas | Local clock, no distributed txns | Read committed | PostgreSQL | Fastest single-region writes; manual sharding to scale writes |

## 6. Trade-offs and when not to use 🟡

- **Latency floor.** Every write waits for a quorum. In one region that is a millisecond or two; across regions it is the round trip to the second-closest replica. A single PostgreSQL primary commits with one local fsync.
- **Retries are part of the API.** Serializable plus optimistic concurrency means hot rows (one counter, one invoice sequence per workspace) cause restart storms. Code must be idempotent and wrapped in `RunTx`; hot counters need redesign.
- **Not every PostgreSQL feature exists.** Extensions, some index types, triggers, `LISTEN/NOTIFY`, and exact planner behaviour vary by product and version. Test your schema and ORM before committing.
- **Sequences and time-ordered keys hot-spot.** `SERIAL` keys and `ORDER BY created_at` primary keys send all inserts to one range. Use UUIDs or hash-sharded indexes.
- **Cost and operations.** Three or more replicas of everything, more CPU per query (key-value encoding, consensus), and a new system to learn.
- **When a single PostgreSQL wins.** If the write load fits on one large machine (often thousands to tens of thousands of writes per second, an estimate that depends on the workload), reads scale with replicas, and failover of a few seconds with synchronous replication is acceptable, then PostgreSQL with replicas is simpler, cheaper and faster. Consider distributed SQL when writes outgrow one primary, when you need zero-data-loss failover across zones or regions, or when data residency forces rows into specific regions within one logical database.

## 7. In production 🔴

**Real systems.** Google built Spanner for its ads backend (F1) and offers it as Cloud Spanner. CockroachDB, YugabyteDB and TiDB are open-source or source-available and run self-hosted or as managed services. Aurora DSQL is AWS's serverless option.

**Failure modes and fixes:**

- *Retry storms on a hot row.* Many transactions update the same row and keep restarting each other. Fix: remove the hot row (per-shard counters, an append-only ledger summed later), use `SELECT … FOR UPDATE` to queue instead of abort, or shorten transactions.
- *Uncertainty restarts.* Reads of recently written keys restart with `ReadWithinUncertaintyIntervalError`. Fix: good clock sync (chrony or a cloud time service), and follower reads or `AS OF SYSTEM TIME` for queries that tolerate staleness.
- *Clock skew past the maximum offset.* A CockroachDB node whose clock drifts beyond the configured offset terminates to protect consistency. Fix: monitor clock offset and alert well before the limit.
- *Hot range.* A sequential key sends all writes to one leaseholder. Fix: hash-sharded index or UUID primary key; the database can split on load but cannot split a single hot key.
- *Leaseholder far from users.* Reads cross an ocean. Fix: regional-by-row tables, lease preferences, follower reads.
- *Long-running transactions.* They hold intents that block or restart others. Fix: batch large updates into small transactions.

**What to monitor:** p99 commit latency per region, transaction restarts per second by reason, clock offset between nodes, ranges per node and range rebalancing activity, under-replicated or unavailable ranges, leaseholder distribution, and CPU per node (the hot-range signal).

## 8. Deep dive 🔴

**Why Raft per range and not one Raft for the cluster.** One log would serialise every write in the cluster through one leader. Thousands of small groups spread leadership across all nodes and let each range move, split and recover independently. The cost is per-group heartbeats; CockroachDB quiesces idle ranges and coalesces heartbeats per node pair.

**Follower reads and closed timestamps.** A follower can serve a consistent read at time `t` only if it knows no write at or below `t` can still arrive.

The leaseholder periodically **closes** a timestamp (promises not to accept writes below it) and sends it with the Raft log. Followers serve reads at or below the closed timestamp, so a follower read is consistent but a few seconds old.

Spanner's equivalent is the safe time each replica tracks.

```mermaid
sequenceDiagram
    participant C as EU client
    participant F as EU follower replica
    participant L as US leaseholder
    L->>F: Raft log entries plus closed timestamp 10:00:00
    L->>L: promises no new write at or below 10:00:00
    C->>F: SELECT ... AS OF SYSTEM TIME follower_read_timestamp()
    F->>F: picks t = 09:59:52, at or below closed 10:00:00
    F-->>C: consistent but about 8 seconds old, no trip to US
    C->>F: read at the current time
    F->>L: forwards, because now is above the closed timestamp
```

**Read-only transactions and snapshots.** Because every value is versioned, a read-only transaction at timestamp `t` needs no locks: it reads the version at `t` from any replica that is caught up to `t`. Spanner and CockroachDB both use this to run large reads without blocking writers.

**Why external consistency needs commit wait or a central clock.** With HLC alone, two transactions on unrelated keys with no message between them can be timestamped in the opposite order of their real-time order if clocks differ (within the max offset).

CockroachDB guarantees serializability and orders causally related transactions, and uses uncertainty restarts to give single-key linearizability; Spanner's commit wait makes the order match real time for all transactions. TiDB's central oracle gets the same effect with a network hop instead of a wait.

**CAP placement.** These systems choose consistency over availability during a partition: a range that loses its majority stops accepting writes ([[CAP and PACELC]]). In PACELC terms they are PC/EC: even without a partition they pay latency for consistency.

**Schema changes.** Online schema changes run as multi-step state machines across nodes (an F1-paper technique), so `ALTER TABLE` is non-blocking but can take long on big tables; compare with [[Zero-Downtime Schema Migrations]].

## 9. Interview questions 🔴

> [!question]- How does a distributed SQL database commit a transaction that touches two machines without the blocking problem of classic 2PC?
> It still runs two-phase commit, but every participant and the transaction record are Raft groups. If the coordinator crashes, the record and intents survive on a quorum, and any node can read the record and finish or abort the transaction. Blocking requires losing a majority of a range, not one machine.

> [!question]- What is commit wait in Spanner and why does it exist?
> TrueTime returns an uncertainty interval. Spanner picks the commit timestamp at the interval's upper bound and waits until the lower bound has passed it before releasing locks, about 2ε. After that, any later transaction in real time gets a larger timestamp, which gives external consistency.

> [!question]- How does a hybrid logical clock differ from TrueTime?
> An HLC is wall time plus a logical counter and is pushed forward by timestamps in incoming messages, so causally related events are ordered without special hardware. It does not bound real-time uncertainty, so the database needs a maximum clock offset and uncertainty restarts instead of commit wait.

> [!question]- Your service gets `40001` errors from CockroachDB. What do you do?
> They are expected under serializable isolation: retry the whole transaction with backoff, from `BEGIN`, and keep side effects outside it. If retries are frequent, look for a hot row or long transaction and redesign it; consider `SELECT … FOR UPDATE` to queue rather than abort.

> [!question]- Trap: "Distributed SQL scales writes linearly, so a global counter row is fine." True?
> No. Each row lives in one range with one leader, so a single hot row is limited by one Raft group and causes contention retries. Scale comes from spreading writes over many ranges; a counter must be sharded or replaced by an append-only log.

> [!question]- When would you choose PostgreSQL with replicas over distributed SQL?
> When writes fit on one primary, reads scale with replicas, users are in one region, and a few seconds of failover is acceptable. It has lower latency, full Postgres features and simpler operations. Choose distributed SQL for write scale beyond one node, zero-data-loss multi-zone or multi-region failover, or data residency within one database.

> [!question]- What is a follower read and what does it cost?
> A read served by a non-leaseholder replica at a timestamp at or below the range's closed timestamp. It avoids a trip to a distant leaseholder and spreads load, but the data is a few seconds stale, so it suits dashboards and lists, not read-modify-write paths.

> [!question]- Why are sequential primary keys a problem in range-sharded databases?
> New keys always sort to the end of the key space, so every insert goes to the last range and its single leaseholder. Use UUIDs, a hash-sharded index, or a leading high-cardinality column such as `workspace_id`.

## 10. Cheat sheet 🟢

- Tables → sorted keys → ranges (CockroachDB, 512 MiB default), tablets (YugabyteDB), regions (TiDB); 3+ replicas, Raft per range.
- Leaseholder serves consistent reads without consensus; writes need a quorum round.
- Cross-range transactions = 2PC with write intents and a Raft-replicated transaction record; parallel commits cut one round.
- Timestamps: TrueTime + commit wait (Spanner), HLC + max offset + uncertainty restarts (CockroachDB, YugabyteDB), central TSO (TiDB).
- Serializable by default in CockroachDB and Spanner → handle `40001` with a retry loop; no side effects inside.
- Multi-region writes pay a cross-region quorum; pin rows to home regions and use follower reads for stale-tolerant queries.
- Avoid sequential keys and hot rows.
- One PostgreSQL primary with replicas wins whenever it fits.

## Links 🟢

- **Before this:** [[Transactions and ACID]], [[Isolation Levels and MVCC]], [[Replication]], [[Partitioning and Sharding]], [[Consensus - Raft and Paxos]]
- **Runnable Go version:** [[Distributed SQL - Go]]
- **Next:** [[Multi-Region Architecture]], [[Clocks and Ordering]], [[Two-Phase Commit]]
- **Compare with:** [[Consistent Hashing]] (hash placement vs ordered ranges), [[Wide-Column Stores and Cassandra]] (leaderless, tunable consistency), [[CAP and PACELC]], [[Time-Series and Columnar Storage]] (TiFlash-style columnar replicas)

### Watch on YouTube

- [Google Spanner: TrueTime, Global Consistency & Distributed Databases Explained](https://www.youtube.com/watch?v=5NxPcafIy0Q) · Tech Papers Summary · explains TrueTime and Spanner's ordering guarantees
- [CockroachDB: A True Distributed SQL Database](https://www.youtube.com/watch?v=AeX5b89TJ2o) · CockroachDB · official vendor talk on ranges, Raft groups and distributed transactions
