---
tags: [moc]
status: reviewed
generated: false
updated: 2026-11-02
---

# 07 Databases MOC

> [!summary] What this folder covers
> SQL, transactions, indexes, storage engines, isolation and MVCC, replication, sharding, NoSQL, search and analytics stores. After this folder you can pick a datastore, model data for it, make queries fast, keep data correct under concurrency, and scale it across machines.

## Before and after

- **Before this:** [[01 CS Fundamentals MOC]]
- **After this:** [[08 Caching & Redis MOC]] · [[09 Messaging & Async MOC]] · [[10 Distributed Systems & Resilience MOC]] · [[18 AI Engineering MOC]]

Back to [[Home]].

## Learning path

1. [[SQL Essentials]] · basic. The query language every later note assumes: joins, grouping, window functions and CTEs.
2. [[SQL vs NoSQL]] · basic. How to choose a store from access patterns, consistency needs and scale.
3. [[Relational Schema Design]] · basic. Keys, normalization and constraints that keep data correct.
4. [[Transactions and ACID]] · basic. What a transaction guarantees and where to draw its boundaries.
5. [[Indexing Fundamentals]] · basic. Why a B-tree index turns a full scan into a few page reads.
6. [[Storage Engines - B-tree vs LSM and WAL]] · intermediate. How data actually lands on disk and survives a crash.
7. [[Isolation Levels and MVCC]] · intermediate. The anomalies each level allows and how snapshots prevent them.
8. [[Locking - Optimistic vs Pessimistic]] · intermediate. Row locks, version columns and deadlocks in practice.
9. [[Query Plans and EXPLAIN]] · intermediate. Reading a plan to find out why a query is slow.
10. [[Index Types and Index Design]] · intermediate. Composite, partial, covering, GIN, GiST and BRIN indexes, and how to design them.
11. [[N+1 Query Problem]] · intermediate. Spotting and fixing the most common ORM performance bug.
12. [[Connection Pooling]] · intermediate. Sizing pools and avoiding connection exhaustion.
13. [[Zero-Downtime Schema Migrations]] · intermediate. Expand and contract changes that never lock production.
14. [[Backup, PITR and Disaster Recovery]] · intermediate. RPO, RTO and restoring to any point in time.
15. [[Materialized Views and Denormalization]] · intermediate. Trading write cost and staleness for fast reads.
16. [[NoSQL Data Modeling]] · intermediate. Designing keys and documents around access patterns.
17. [[Replication]] · intermediate. Leaders, followers, lag and failover.
18. [[Partitioning and Sharding]] · advanced. Splitting data across machines and choosing a shard key.
19. [[Consistent Hashing]] · advanced. Rings and virtual nodes that move little data on resize.
20. [[Wide-Column Stores and Cassandra]] · advanced. Partition keys, clustering columns and tunable consistency.
21. [[Search Engines and Inverted Indexes]] · advanced. How full-text search, analyzers and relevance scoring work.
22. [[Time-Series and Columnar Storage]] · advanced. Column layouts, compression and rollups for analytics.
23. [[Distributed SQL]] · advanced. SQL and serializable transactions across many nodes with consensus.

## Concept map

```mermaid
flowchart LR
    SQL[SQL Essentials] --> SCH[Schema Design]
    SQL --> CHO[SQL vs NoSQL]
    SCH --> TX[Transactions and ACID]
    SCH --> IDX[Indexing Fundamentals]
    IDX --> SE[Storage Engines]
    TX --> SE
    TX --> ISO[Isolation and MVCC]
    SE --> ISO
    ISO --> LCK[Locking]
    IDX --> QP[Query Plans]
    QP --> IT[Index Types]
    QP --> N1[N+1 Queries]
    TX --> POOL[Connection Pooling]
    SCH --> MIG[Schema Migrations]
    SE --> BAK[Backup and PITR]
    QP --> MV[Materialized Views]
    CHO --> NOSQL[NoSQL Modeling]
    SE --> REP[Replication]
    REP --> SH[Partitioning and Sharding]
    SH --> CH[Consistent Hashing]
    CH --> CAS[Cassandra]
    NOSQL --> CAS
    IT --> SRCH[Search Engines]
    SE --> TS[Time-Series and Columnar]
    SH --> DSQL[Distributed SQL]
    ISO --> DSQL
    REP --> DSQL
```

## Interview focus

- What do the four ACID properties guarantee, and where should a transaction begin and end? See [[Transactions and ACID]].
- Which anomalies does each isolation level allow, and how does MVCC work? See [[Isolation Levels and MVCC]].
- When would you use optimistic versus pessimistic locking? See [[Locking - Optimistic vs Pessimistic]].
- How does a B-tree index work, and why does column order matter in a composite index? See [[Indexing Fundamentals]] and [[Index Types and Index Design]].
- This query is slow; how do you diagnose it? See [[Query Plans and EXPLAIN]].
- B-tree or LSM tree: which suits a write-heavy workload, and why? See [[Storage Engines - B-tree vs LSM and WAL]].
- SQL or NoSQL for this system, and why? See [[SQL vs NoSQL]].
- How do you pick a shard key, and what happens with hot partitions? See [[Partitioning and Sharding]].
- How does consistent hashing reduce data movement when nodes join or leave? See [[Consistent Hashing]].
- How does replication lag cause read-your-writes bugs, and how do you fix them? See [[Replication]].

## Sources worth reading

- Martin Kleppmann, *Designing Data-Intensive Applications*, chapters 2 to 9.
- Alex Petrov, *Database Internals*.
- Markus Winand, *Use The Index, Luke* (use-the-index-luke.com).
- The PostgreSQL documentation on concurrency control, indexes and `EXPLAIN`.
- Hermitage by Martin Kleppmann, a test suite of isolation anomalies across databases.
- The DynamoDB, Spanner and Cassandra papers.
