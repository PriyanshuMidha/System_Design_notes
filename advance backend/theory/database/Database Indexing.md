# Database Indexing

## Complete notes

Database index makes read queries faster by creating a lookup structure.

## Easy explanation

An index is like a lookup table that helps the database find rows quickly without scanning everything.

In simple words: if you can explain `Database Indexing` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of important product data that must be stored correctly and queried efficiently. This topic explains how the database keeps data correct, fast, and recoverable.

For `Database Indexing`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Real-life examples

### Easy real-life example

Searching user by email is fast because the database has an index on `email`.

### Difficult production example

A high-traffic orders table needs composite indexes based on query patterns, EXPLAIN analysis, write-cost tradeoffs, and careful online index creation.

### How to relate this topic

When reading `Database Indexing`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Database Indexing` must be understood through its production use case, not just its definition.
- When to use it: Focus on data correctness, access patterns, indexes, query plans, transactions, isolation, migrations, replication, sharding, and recovery.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: query latency, slow queries, lock waits, connection pool usage, replication lag, deadlocks, storage growth, and backup restore time.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Diagram

```mermaid

flowchart LR
  Query[WHERE email = x] --> Index[Index on email]
  Index --> Row[Find row fast]
  Query2[No index] --> Scan[Full table scan]
```

## Common mistakes

- Adding indexes blindly without checking query plans.
- Ignoring write cost, lock contention, and migration risk.
- Choosing SQL/NoSQL without matching access patterns and consistency needs.
- Running large backfills without batching and monitoring.
- Not testing backup restore or rollback path.

## Quick revision

Database index makes read queries faster by creating a lookup structure.

## Examples and deeper diagrams

### Without index

Database scans many rows.

```sql
SELECT * FROM users WHERE email = 'a@test.com';
```

If `email` has no index, database may do full table scan.

### With index

```sql
CREATE INDEX idx_users_email ON users(email);
```

```mermaid
flowchart LR
  Query[WHERE email='a@test.com'] --> BTree[B-tree index]
  BTree --> Pointer[Row pointer]
  Pointer --> Row[User row]
```

### Tradeoff

Indexes make reads faster but writes slower because every insert/update may also update the index.

### Interview line

I would add indexes based on real query patterns and verify with EXPLAIN, not blindly index every column.


## Deep understanding checklist

To fully understand `Database Indexing`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on data correctness, access patterns, indexes, query plans, transactions, isolation, migrations, replication, sharding, and recovery.

## Senior interview bank

These are topic-specific questions and strong answers for `Database Indexing`.

### 1. How would you debug this if the database is slow?

First check query latency, slow query logs, connection pool saturation, lock waits, and recent deploys/backfills. Then run `EXPLAIN ANALYZE` on representative queries using production-like data volume.

### 2. What index would you add and what is the cost?

Add indexes for selective filters, joins, ordering, and uniqueness. The cost is slower writes, more storage, more maintenance, and possible planner confusion if indexes are redundant or low-selectivity.

### 3. How do you migrate this without downtime?

Use expand-migrate-contract: add backward-compatible schema, deploy code that supports both versions, backfill in batches with checkpoints, verify, switch reads, then remove the old path later.

### 4. What consistency does the product need?

Payments, inventory, and auth usually need stronger consistency. Feeds, analytics, counters, and recommendations often tolerate eventual consistency. The answer should match product risk, not personal preference.

### 5. What can go wrong under high write load?

High write load can cause lock contention, index bloat, replication lag, deadlocks, connection exhaustion, hot partitions, and slow backfills. I would monitor write latency, locks, lag, and pool usage.

## Topic-specific drill

### How would I answer `Database Indexing` if the interviewer asks directly?

For `Database Indexing`, I would explain the data access pattern, correctness requirement, index/transaction impact, migration risk, and the query or storage metric that proves it works.

### What is the trap question for `Database Indexing`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Database Indexing` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
