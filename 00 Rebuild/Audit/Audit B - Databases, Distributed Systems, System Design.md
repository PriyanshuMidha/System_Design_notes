---
tags: [rebuild/audit]
reviewed: 2026-11-02
---

# Audit B - Databases, Distributed Systems, System Design

> [!info] What this is
> One block per old note: what it has, what is wrong, what to keep, where it goes, and the **must-cover outline** the rewrite follows. Verdicts: KEEP · POLISH · REWRITE · MERGE · SPLIT · DELETE. Depth 0 (definition only) to 5 (complete). The area plan is at the end. Back to [[Rebuild Plan]].

Scope: 74 notes under `advance backend/theory/` (database 14, data modeling 9, system design 8, system design practice 8, distributed systems 14, reliability 13, performance 8).
Conventions: `lines` = `wc -l`; `real` = audit `unique`; "template %" = 100 − audit `pct`.
No note in this scope has owner-handwritten text or images (`imgs` = 0; the only text above "## Complete notes" is generated study-order lists in content tables).
A finished rebuild sample and template already exist in the vault: `00 Rebuild/Sample - Consistent Hashing.md` and `00 Rebuild/Note Template.md` (10 sections; 1–4 basic, 5–7 intermediate, 8 advanced). The outlines below are written to fit that template.

---

## database

### Advanced Index Types
`advance backend/theory/database/Advanced Index Types.md` · 169 lines · real 80 · depth 3 · POLISH
- Has: index-type table, Postgres access methods (B-tree/Hash/GIN/GiST/SP-GiST/BRIN/bloom), leftmost-prefix rule, InvoiceOps indexes, idempotency unique indexes, 5 real Q&As.
- Problems: ~23% template; overlaps Database Indexing (composite, covering, write cost repeated in both); "Bad query for this index: `WHERE status = ?` because it skips the leftmost column" is stated as absolute (PG18 B-tree skip scan and MySQL 8.0.13+ skip scan can use it when the leading column has few distinct values); partial/covering listed but no syntax (`WHERE`, `INCLUDE`); no EXPLAIN output proving any claim; MongoDB section is one line.
- Keep: both type tables; `invoices(workspace_id, status, due_date DESC, id)` list-API index with its 4-bullet "why"; "Indexes for reliability" table (webhook/email/idempotency/audit); 8-step "design indexes step by step"; Q4 (why an index is not used) and Q5 (webhook unique index) answers; InvoiceOps `CREATE INDEX` block.
- New home: `07 Databases/Index Types and Index Design`
- Must cover: recap of leftmost prefix and the ESR rule (equality, sort, range) · composite column order worked against 3 queries with EXPLAIN before/after · covering indexes with `INCLUDE` and index-only scans (visibility-map caveat, `Heap Fetches`) · partial indexes (`WHERE status = 'overdue'`; unique-where-not-deleted for soft deletes) · expression indexes (`lower(email)`) and why the query must match the expression · GIN for jsonb/arrays/full-text, plus `pg_trgm` for `LIKE '%x%'` · GiST for ranges/geo and exclusion constraints (no double-booked room) · BRIN for append-only time-ordered tables (KB vs GB compared with B-tree) · Hash indexes (equality only, WAL-logged since PG10) · skip scan (PG18) nuance · maintenance: bloat, `REINDEX CONCURRENTLY`, unused indexes via `pg_stat_user_indexes.idx_scan` · write amplification (every index = extra page writes + WAL per INSERT) · MongoDB compound/multikey/wildcard/TTL indexes with ESR · vector indexes (HNSW/IVF) only as a pointer to 18 AI.
- Diagrams: flowchart decision tree "query shape → index type" (equality/range/sort → B-tree; contains on jsonb/array → GIN; overlap/nearest → GiST; huge append-only by time → BRIN); flowchart contrasting index scan + heap fetch vs index-only scan.

### Backup and Restore
`advance backend/theory/database/Backup and Restore.md` · 158 lines · real 8 · depth 0 · REWRITE
- Has: one-line definition; DB → backup → restore box diagram; failure-mode phrase (untested restores, no PITR, RPO/RTO mismatch).
- Problems: ~92% template; interview bank asks about slow queries, indexes and migrations; no mechanism (logical vs physical, WAL archiving), no RPO/RTO numbers, no restore drill.
- Keep: the failure-mode phrase as a checklist seed.
- New home: `07 Databases/Backup, PITR and Disaster Recovery`
- Must cover: RPO vs RTO with numbers (e.g., RPO 5 min, RTO 1 h) and how they drive the design · replication is not a backup (a `DROP TABLE` replicates in milliseconds) · logical backups (`pg_dump`/`mysqldump`: portable, slow restore) vs physical (`pg_basebackup`, EBS/volume snapshots) · base backup + continuous WAL/binlog archiving = point-in-time recovery ("restore to 10:41:59, just before the bad deploy") · managed: RDS automated backups (retention up to 35 days, PITR) vs manual snapshots, cross-region and cross-account copies · tools: pgBackRest, WAL-G, Barman (incremental, parallel, checksum verify) · 3-2-1 rule, encryption, immutability (S3 Object Lock) against ransomware and insider deletes · delayed replica (`recovery_min_apply_delay`) for fast undo of logical corruption · restore-time math (2 TB at 200 MB/s ≈ 3 h before WAL replay) · automated restore drills with row-count/checksum verification · DR tiers (backup-restore, pilot light, warm standby, active-active) with RPO/RTO each · partial restore of one table or tenant · real incident: GitLab 2017 database deletion, where none of 5 backup/replication methods worked.
- Diagrams: timeline flowchart of a base backup + WAL segments + PITR target point; flowchart of the 4 DR tiers labelled with typical RPO/RTO.

### CAP Theorem
`advance backend/theory/database/CAP Theorem.md` · 158 lines · real 8 · depth 0 · REWRITE
- Has: one-line definition repeated 3x; trivial CAP → C/A/P 3-box diagram.
- Problems: ~92% template; interview questions are about indexes and migrations, not CAP; omits that C = linearizability (not ACID C), that P is not optional, and PACELC; filed under database, belongs in distributed systems.
- Keep: nothing.
- New home: `10 Distributed Systems/CAP and PACELC`
- Must cover: what a partition is (lost or delayed messages, not just a cut cable) · C = linearizability vs ACID consistency · A = every non-failed node returns a non-error response (no latency bound) · why "pick 2 of 3" misleads (P is unavoidable, so during a partition choose C or A; "CA" means a single node) · CP systems (etcd, ZooKeeper, HBase, Spanner) vs AP systems (Cassandra, Riak, DNS, DynamoDB global tables with LWW) and that many are tunable per request · trap: DynamoDB ≠ Dynamo (DynamoDB uses leader-based replication with Multi-Paxos per partition) · tunable consistency (R + W > N, Cassandra QUORUM vs ONE, DynamoDB `ConsistentRead`) · PACELC: latency vs consistency when there is no partition (Cassandra PA/EL, Spanner PC/EC, MongoDB PA/EC) · a single-leader DB with async replicas fits neither label cleanly · product mapping (payments/inventory/auth lean CP; feeds/likes/presence lean AP) · Gilbert–Lynch proof sketch and Brewer's "CAP twelve years later".
- Diagrams: sequence diagram of a write during a partition (CP path rejects or blocks; AP path accepts, diverges, reconciles later); table placing real systems in PACELC classes.

### Cassandra and Wide Column Stores
`advance backend/theory/database/Cassandra and Wide Column Stores.md` · 175 lines · real 85 · depth 3 · POLISH
- Has: keyspace/partition/clustering terms, query-first table with day bucketing, consistency levels, R+W>RF, failure modes, comparisons, 5 real Q&As.
- Problems: ~21% template; garbled table row "avoid for | simple relational CRUD? no, SQL better | joins/ad-hoc queries"; no storage-engine mechanism (commit log → memtable → SSTable, compaction); no partition-size rule; QUORUM vs LOCAL_QUORUM in multi-DC missing; tombstones mentioned without `gc_grace_seconds`.
- Keep: `PRIMARY KEY ((workspace_id, bucket_day), created_at, event_id)` and the `audit_events_by_workspace_day` DDL; consistency-level table; "wide-column vs document vs relational" table; production failure-modes list; driver-location example; Q4 partition-key answer.
- New home: `07 Databases/Wide-Column Stores and Cassandra`
- Must cover: data model (partition key → node; clustering columns → on-disk sort order) · token ring + vnodes (`num_tokens` 16 since 4.0) and `NetworkTopologyStrategy` (RF per DC) · write path: commit log → memtable → immutable SSTables (LSM) and why writes are cheap · read path: bloom filter → partition index → merge across SSTables (read amplification) · compaction strategies STCS / LCS / TWCS for time series / UCS (5.0) · tunable consistency ONE/QUORUM/LOCAL_QUORUM/EACH_QUORUM/ALL and R + W > RF · repair: hinted handoff, read repair, anti-entropy repair with Merkle trees, run within `gc_grace_seconds` · tombstones (default grace 10 days): zombie data and tombstone-overwhelm failures · per-cell LWW with client timestamps (clock skew loses writes) · partition sizing rule of thumb (<100 MB, <100k rows) and time bucketing · lightweight transactions (Paxos, several round trips) only for compare-and-set · secondary indexes vs SAI (5.0) vs query tables vs materialized views · ScyllaDB/HBase/Bigtable comparison; Discord messages case (MongoDB → Cassandra → ScyllaDB).
- Diagrams: flowchart of the write path (client → coordinator → RF replicas → commit log + memtable → SSTable flush → compaction); excalidraw ring sketch with RF=3 replica placement and a LOCAL_QUORUM read.

### Connection Pooling
`advance backend/theory/database/Connection Pooling.md` · 164 lines · real 21 · depth 2 · REWRITE
- Has: reuse definition, pool + wait-queue diagram, "100 max connections, 10 containers, pool 50 each" sizing warning.
- Problems: ~79% template; generic DB interview bank; no Go `database/sql` settings, no sizing method, no external poolers, no exhaustion symptoms.
- Keep: the "10 containers × pool 50 = 500 connections > max_connections 100" example; wait-queue diagram.
- New home: `07 Databases/Connection Pooling`
- Must cover: cost of a new connection (TCP + TLS + auth; Postgres forks a backend process per connection) · Go `database/sql` pool: `SetMaxOpenConns` (default unlimited), `SetMaxIdleConns` (default 2), `SetConnMaxLifetime`, `SetConnMaxIdleTime`; pgxpool equivalents · sizing with Little's Law (in-flight = QPS × query time) and the "cores × 2 + spindles" starting point · global budget: instances × pool ≤ `max_connections` − reserved, and how autoscaling breaks it · exhaustion symptoms: rising `WaitCount`/`WaitDuration` in `db.Stats()`, p99 spikes while DB CPU is idle · leaks: unclosed `rows`, missing `tx.Rollback`, long transactions holding connections · context timeouts on acquire and query · external poolers: PgBouncer session/transaction/statement modes, prepared statements in transaction mode (PgBouncer ≥1.21 `max_prepared_statements`), RDS Proxy, PgCat/Supavisor · serverless connection storms · max lifetime for failover/DNS changes and rebalancing · metrics and alerts to set.
- Diagrams: flowchart of N app replicas × pools → PgBouncer → Postgres annotated with the connection-budget math; sequence diagram of acquire → wait (pool full) → context timeout.

### Consistent Hashing
`advance backend/theory/database/Consistent Hashing.md` · 159 lines · real 9 · depth 0 · REWRITE
- Has: one-line definition; key → ring → 3 nodes box diagram; failure-mode phrase (hot keys, vnode imbalance, no replication).
- Problems: ~91% template; DB interview bank (slow queries, migrations) unrelated to hashing; no ring mechanics. The rewrite already exists: `00 Rebuild/Sample - Consistent Hashing.md` (ring, vnodes, rendezvous, jump hash, Maglev, bounded loads, Redis slots, measured 80% remap). Its links point to old titles (`[[Database Sharding]]`, `[[Quorum Reads and Writes]]`, `[[Load Balancer]]`, `[[Hot Keys and Hot Partitions]]`) that this plan renames.
- Keep: nothing from the old note; promote the sample and update its links.
- New home: `07 Databases/Consistent Hashing`
- Must cover: (all present in the sample) `hash % N` remap problem with measured numbers · ring with clockwise ownership · vnodes and weighting · replication to next R distinct nodes · rendezvous/HRW · jump consistent hash · Maglev · bounded loads · Redis Cluster's 16,384 slots (not a ring) · hash-function quality · membership agreement (gossip/etcd) · hot keys are not solved · production users (Dynamo, Cassandra, Envoy RING_HASH/MAGLEV, ketama).
- Diagrams: already in the sample (ring with keys/nodes, vnode ring, node-add movement); keep.

### Database Content Table
`advance backend/theory/database/Database Content Table.md` · 105 lines · real 55 · depth 1 · DELETE
- Has: study-order links, 7 "for every backend design ask" questions, SQL/NoSQL decision flowchart, InvoiceOps constraints, 3 Q&As.
- Problems: nav note (one of 23+ content tables); decision flow "Need transactions? yes → SQL, no → NoSQL" is oversimplified; study order links replication/sharding notes that live in another folder.
- Keep: the 7-question checklist (what is transactional, unique, filtered, indexed, migrated, backed up, what if the primary fails) → 07 MOC; "backup is not enough, test restores" → Backup note.
- New home: `07 Databases/07 Databases MOC` (salvage only)
- Must cover: n/a (MOC lists the new 07 notes basic → advanced).
- Diagrams: none.

### Database Indexing
`advance backend/theory/database/Database Indexing.md` · 166 lines · real 17 · depth 2 · REWRITE
- Has: lookup-table analogy, email lookup with/without index SQL, B-tree → row pointer → row diagram, read/write trade-off line.
- Problems: ~82% template; generic interview bank; overlaps Advanced Index Types; never explains how a B-tree works, selectivity, or clustered vs heap storage; "B-tree → Row pointer → User row" is Postgres-heap-specific (InnoDB secondary indexes store the PK and need a second lookup).
- Keep: the two SQL snippets and the "with index" flowchart as the opener.
- New home: `07 Databases/Indexing Fundamentals`
- Must cover: full scan vs index lookup (pages read; O(n) vs O(log n)) · B+tree structure: root/internal/leaf pages, fan-out in the hundreds, height 3–4 for ~100M rows, linked leaves for range scans · clustered index (InnoDB PK) vs heap + secondary index (Postgres) and the double lookup · selectivity/cardinality and why the planner picks a seq scan when a large fraction of rows match · composite indexes and the leftmost prefix · range + sort (`ORDER BY created_at DESC LIMIT 20` served by the index) · covering / index-only scans · unique indexes as constraints · write cost (every INSERT touches every index; HOT updates in Postgres) · index size vs RAM working set · random UUIDv4 vs sequential/UUIDv7 keys (page splits, cache locality) · building online with `CREATE INDEX CONCURRENTLY` · verifying with `EXPLAIN ANALYZE`.
- Diagrams: B+tree diagram (root → internal → leaf pages with sibling links, lookup path highlighted; excalidraw or flowchart); flowchart of one InvoiceOps query via seq scan vs index scan.

### Database Migration
`advance backend/theory/database/Database Migration.md` · 158 lines · real 8 · depth 0 · REWRITE
- Has: one-line definition; code → migration file → schema → app diagram; failure-mode phrase (locking, breaking old versions, incomplete backfill, rollback).
- Problems: ~92% template; the one real expand/contract answer sits in the generic DB interview bank (copied into 8 notes); no Postgres lock behaviour; overlaps `golang backend/Go Database Migrations` (tooling).
- Keep: the expand–migrate–contract answer text as the core.
- New home: `07 Databases/Zero-Downtime Schema Migrations`
- Must cover: versioned migrations and tools (golang-migrate, goose, Atlas, Flyway); up/down vs forward-only · why migrations cause outages: `ALTER TABLE` takes ACCESS EXCLUSIVE; lock queue builds behind one long query · `lock_timeout` + retry for DDL · safe vs unsafe changes: add nullable column (safe), add column with constant default (metadata-only since PG11), change type (table rewrite), add NOT NULL (CHECK … NOT VALID then VALIDATE) · `CREATE INDEX CONCURRENTLY` (no transaction block; leaves an INVALID index on failure) · FKs/constraints with `NOT VALID` + `VALIDATE CONSTRAINT` · expand/contract for a rename or split: add → dual write → backfill → switch reads → stop old writes → drop · batched, throttled, resumable backfills by PK range while watching replication lag · old and new app versions running together during a rolling deploy · rollback reality: forward fixes, data changes rarely reversible · MySQL online schema change (gh-ost, pt-osc), Postgres pgroll · rehearse on a production-size snapshot and time it.
- Diagrams: timeline/sequence diagram of expand → dual write → backfill → switch reads → contract across 3 deploys; flowchart of the lock queue (long SELECT holds lock → ALTER waits → every new query queues behind ALTER).

### Query Plans and EXPLAIN
`advance backend/theory/database/Query Plans and EXPLAIN.md` · 143 lines · real 19 · depth 1 · REWRITE
- Has: one-line definition; slow-query → EXPLAIN decision flowchart; 6-item "what to check" list.
- Problems: ~79% template; never shows a plan or how to read one; no join algorithms, statistics, or `BUFFERS`; overlaps `production debugging/Database Performance Debugging`.
- Keep: the debugging flowchart; the "what to check" list.
- New home: `07 Databases/Query Plans and EXPLAIN`
- Must cover: cost-based planner (statistics → estimates → cheapest plan) · `EXPLAIN` vs `EXPLAIN ANALYZE` (executes the query; wrap writes in BEGIN/ROLLBACK) and `BUFFERS` · reading a plan tree: innermost first, `cost=startup..total`, rows, loops, actual time · scan nodes: Seq Scan, Index Scan, Index Only Scan (`Heap Fetches`), Bitmap Index/Heap Scan · join nodes: Nested Loop vs Hash Join vs Merge Join and when each wins · estimate vs actual mismatch → `ANALYZE`, `default_statistics_target`, `CREATE STATISTICS` for correlated columns · sorts/hashes spilling to disk (`Sort Method: external merge`, `work_mem`) · ORDER BY + LIMIT traps and OFFSET cost · prepared statements: custom vs generic plans (`plan_cache_mode`) · finding the queries first: `pg_stat_statements`, slow-query log, `auto_explain` · worked InvoiceOps example: seq scan 1.2 s → composite index → index scan 3 ms, both plans shown · MySQL `EXPLAIN FORMAT=TREE` / `EXPLAIN ANALYZE` differences.
- Diagrams: annotated plan tree (flowchart TD: Limit → Sort → Hash Join → Seq Scan / Index Scan); keep the debugging flowchart.

### Search Architecture
`advance backend/theory/database/Search Architecture.md` · 157 lines · real 73 · depth 3 · POLISH
- Has: search-type table, inverted-index sketch, when DB search suffices, sync options (dual write/outbox/CDC), outbox sequence, tenant security, ranking factors, 5 Q&As.
- Problems: ~27% template; outbox sequence duplicates the Outbox Pattern note; no text analysis, BM25, shard/segment architecture, near-real-time refresh, or reindexing; `data modeling/Search Indexes` duplicates it.
- Keep: search-type table; inverted index example; "when DB search is enough / when to add a search engine" lists; "Search result security" list; ranking factors + `acme` example; Q4 dual-write answer (link the outbox note instead of repeating the diagram).
- New home: `07 Databases/Search Engines and Inverted Indexes`
- Must cover: building an inverted index (documents → analyzer → terms → postings with positions) · analysis pipeline (tokenizer, lowercase, stop words, stemming, synonyms) and `text` vs `keyword` fields · relevance: TF-IDF → BM25, field boosts, exact-match boost · Postgres FTS (`tsvector`, GIN, `ts_rank`) and `pg_trgm` as the "good enough" option · Elasticsearch/OpenSearch architecture: index → primary/replica shards → Lucene segments; 1 s refresh (near-real-time); merges; shard count fixed at creation · keeping in sync via outbox/CDC (Debezium) with versioned upserts and deletes · zero-downtime reindex with aliases · autocomplete (edge n-grams, completion suggester) and fuzzy matching (edit distance) · facets/aggregations · deep pagination (`from/size` 10k cap → `search_after` + point-in-time) · tenant filtering and document-level security · hybrid search (BM25 + vector kNN, reciprocal rank fusion), linking 18 AI for vector internals.
- Diagrams: flowchart of the indexing pipeline (Postgres → outbox/CDC → indexer → alias → index v2) and the query path (query → analyzer → postings → BM25 scoring → top-k); excalidraw of index → shards → segments.

### Sharding Patterns
`advance backend/theory/database/Sharding Patterns.md` · 149 lines · real 76 · depth 3 · POLISH
- Has: "shard last" ladder, strategy and routing tables, shard-key rules, cross-shard problems, rebalancing steps, global IDs, Slack-style tenant example, 5 Q&As.
- Problems: ~24% template; duplicated by `system design/Database Sharding`; no Postgres native partitioning syntax; rebalancing steps skip cut-over consistency (writes during copy, CDC catch-up); no hot-partition mitigations or real systems (Vitess, Citus, MongoDB balancer).
- Keep: 5-step "when to shard" ladder; strategy table; good/bad shard-key lists; replication vs partitioning vs sharding table; routing-approaches table; 6-step rebalancing; ID options; Q4 cross-shard transaction answer; Q5 metrics.
- New home: `07 Databases/Partitioning and Sharding`
- Must cover: partitioning inside one DB (Postgres declarative range/list/hash, partition pruning, dropping old partitions) vs sharding across nodes · shard-key selection worked through InvoiceOps (`workspace_id`) · range vs hash vs directory vs geo vs tenant, with the hot-shard example (sequential user IDs → newest range takes all writes) · logical shards (many more than nodes; Notion: 480 logical on 32 physical) to make moves cheap · routing layer: app library, proxy (Vitess vtgate, Citus coordinator, mongos), shard map in etcd/DB · cross-shard reads: scatter-gather cost, global secondary indexes, lookup tables · cross-shard transactions: avoid; saga/2PC links · online resharding: snapshot copy + CDC catch-up + verify + short write freeze + flip map · global IDs (Snowflake, UUIDv7, shard-prefixed) · hot tenants/partitions: dedicated shard, salting, splitting · per-shard operations (backups, migrations, skew metrics) · real systems: Vitess (YouTube, Slack), Citus, MongoDB chunks + balancer, DynamoDB auto-split, Instagram/Figma Postgres sharding.
- Diagrams: flowchart request → router → shard map → logical shard → physical node; sequence diagram of an online tenant move (copy, CDC catch-up, freeze, flip map, resume).

### Time Series and Analytics Storage
`advance backend/theory/database/Time Series and Analytics Storage.md` · 134 lines · real 64 · depth 3 · POLISH
- Has: OLTP/OLAP/time-series table, storage options, storage-choice table, time partitioning, metrics vs events vs logs, rollups, retention, high-cardinality Q&A.
- Problems: ~26% template; never explains why columnar storage is fast or how TSDBs compress; no ClickHouse/Timescale/Prometheus internals; no warehouse modeling (star schema) or ingestion pipeline (CDC/ELT).
- Keep: all three tables; month-partition example; rollup table names; retention bullets; Stripe-like dashboard example; Q4 (dashboards off the primary) and Q5 (high-cardinality) answers.
- New home: `07 Databases/Time-Series and Columnar Storage`
- Must cover: row vs column layout and why OLAP reads fewer bytes (column pruning) · compression (dictionary, RLE, delta/delta-of-delta, Gorilla XOR floats) and vectorized execution · ClickHouse MergeTree: sorted parts, sparse primary index (8,192-row granules), background merges, materialized views as insert triggers, Replacing/AggregatingMergeTree · TimescaleDB hypertables/chunks, continuous aggregates, compression · Prometheus TSDB: head block + WAL, 2 h blocks, labels → series, cardinality explosion · downsampling and tiered retention (raw 15 d, 5-min rollups 1 y) · Postgres partitioning + BRIN for modest volumes · warehouse modeling: fact and dimension tables (star schema) · ingestion: CDC/ELT into a warehouse, Kafka → ClickHouse · lakehouse (Parquet + Iceberg/Delta on S3) for cheap raw retention · keeping OLAP load off OLTP (replica vs separate store) · comparison table: Postgres, ClickHouse, BigQuery/Snowflake/Redshift, Prometheus.
- Diagrams: excalidraw of row-store vs column-store page layout; flowchart of the analytics pipeline (OLTP → CDC/Kafka → ClickHouse raw → rollup MVs → dashboard; raw → S3 Parquet).

### Transactions
`advance backend/theory/database/Transactions.md` · 168 lines · real 29 · depth 2 · REWRITE
- Has: all-or-nothing definition, bank-transfer SQL, BEGIN/COMMIT/ROLLBACK sequence diagrams, one remark that isolation prevents ticket overselling.
- Problems: ~72% template; ACID never defined; isolation levels appear only in a question list; "If two users buy the last ticket at the same time, transaction isolation helps prevent overselling" is misleading at default isolation (see factual errors); generic DB interview bank.
- Keep: transfer SQL; the `alt all good / else error` sequence diagram; the 5 "ask yourself" questions.
- New home: `07 Databases/Transactions and ACID` (isolation goes to NEW `07 Databases/Isolation Levels and MVCC`; locking to `07 Databases/Locking - Optimistic vs Pessimistic`)
- Must cover: A, C, I, D precisely (atomicity via WAL/undo; consistency = invariants + constraints; isolation = level-dependent; durability = fsync'd WAL at commit) · autocommit vs explicit transactions; savepoints · Go: `db.BeginTx(ctx, opts)`, `defer tx.Rollback()`, passing `tx` through repositories · choosing boundaries (InvoiceOps webhook: event insert + payment + invoice update + audit in one txn) · keep transactions short; no HTTP calls inside (lock and pool hold time) · preventing overselling correctly: conditional `UPDATE … SET stock = stock - 1 WHERE id = $1 AND stock > 0` + rows-affected check, `SELECT … FOR UPDATE`, unique constraint, or SERIALIZABLE + retry · serialization failures (SQLSTATE 40001) and deadlocks (40P01) → retry loop with backoff · `idle_in_transaction_session_timeout`; long transactions block VACUUM · commit latency (fsync, `synchronous_commit`, group commit) · why transactions cannot span services → outbox/saga links.
- Diagrams: sequence diagram of two concurrent "buy last ticket" requests (naive read-then-write oversells vs conditional UPDATE where the second gets 0 rows); keep the commit/rollback sequence.

---

## data modeling

### Data Modeling Content Table
`advance backend/theory/data modeling/Data Modeling Content Table.md` · 129 lines · real 69 · depth 1 · MERGE→`07 Databases/Relational Schema Design`
- Has: study order, 9 access-pattern questions, modeling flowchart, InvoiceOps entity chain, webhook consistency example, index checklist, 3 Q&As.
- Problems: nav note with real content trapped inside; links both `[[Search Architecture]]` and `[[Search Indexes]]` (same topic).
- Keep: the 9 modeling questions; `users → workspace_members → workspaces …` entity chain; InvoiceOps index checklist; "every tenant-owned table carries `workspace_id`" rule; modeling flowchart (requirements → entities → access patterns → storage → schema → indexes → consistency → scale → migration).
- New home: `07 Databases/Relational Schema Design` (worked example) + `07 Databases/07 Databases MOC` (flowchart)
- Must cover: n/a (salvage into the target note).
- Diagrams: keep the modeling-flow flowchart in the MOC.

### Materialized Views
`advance backend/theory/data modeling/Materialized Views.md` · 153 lines · real 6 · depth 0 · REWRITE
- Has: one-line definition; base tables → expensive query → materialized view box diagram.
- Problems: ~93% template; interview bank is the "how to run a system design interview" bank (first thing you ask, how to close); no refresh semantics.
- Keep: nothing.
- New home: `07 Databases/Materialized Views and Denormalization`
- Must cover: view vs materialized view vs summary table · Postgres `CREATE MATERIALIZED VIEW`, `REFRESH` (blocks readers) vs `REFRESH … CONCURRENTLY` (needs a unique index, slower) · refresh strategies: scheduled, trigger-based, incremental (pg_ivm extension; not built in) · staleness budget as a product decision ("revenue chart may lag 5 min") · app-maintained denormalization: counters, rollup tables updated in the same txn or async · CQRS read models/projections as materialized views outside the DB · ClickHouse MVs (insert triggers into AggregatingMergeTree) and streaming MVs (Materialize, RisingWave) · drift risks: double counting, missed updates, rebuild/backfill procedure · indexing the MV · cache vs MV: when each wins · worked example: InvoiceOps per-workspace dashboard totals (query, MV, refresh cadence, EXPLAIN before/after).
- Diagrams: flowchart comparing three refresh paths (cron full refresh; trigger/incremental; CDC → projection); sequence diagram of `REFRESH CONCURRENTLY` (build new result → diff → apply while readers continue).

### N Plus One Query Problem
`advance backend/theory/data modeling/N Plus One Query Problem.md` · 165 lines · real 17 · depth 2 · REWRITE
- Has: posts/authors example (101 queries), batching flowchart, detection list (query logs, APM spans, latency grows with list size).
- Problems: ~82% template; SD-interview bank; no code (how ORMs cause it, the Go fix), no latency math, no GraphQL/DataLoader or cross-service N+1.
- Keep: the 101-queries example; "Fix with batching" flowchart; detection bullets.
- New home: `07 Databases/N+1 Query Problem`
- Must cover: how lazy loading and loops create it (GORM associations, per-row repository calls in Go) · latency math: 101 × 1 ms RTT vs 2 queries, plus pool pressure · detection: per-request query-count logging, trace span fan-out, `pg_stat_statements` call counts · fix 1: JOIN, and the row-duplication/cartesian blow-up with several 1:N joins · fix 2: batch `WHERE id = ANY($1)` then map in Go (chunk very large ID lists) · fix 3: ORM eager loading (GORM `Preload` vs `Joins`) · GraphQL N+1 and per-request DataLoader batching · N+1 across services (HTTP call per item → batch endpoint) · denormalize where reads dominate · test guard asserting query count in integration tests · Go code: naive loop vs batched version with pgx/sqlc.
- Diagrams: sequence diagrams side by side: naive (1 + N round trips) vs batched (2 round trips); keep the batching flowchart.

### NoSQL Data Modeling
`advance backend/theory/data modeling/NoSQL Data Modeling.md` · 154 lines · real 7 · depth 0 · REWRITE
- Has: one-line definition; access patterns → key design → partition key → hot-key-risk diagram.
- Problems: ~92% template; SD-interview bank; no document or key-value design rules at all.
- Keep: nothing.
- New home: `07 Databases/NoSQL Data Modeling`
- Must cover: list access patterns first, with expected QPS · MongoDB embed vs reference (1:few embed, 1:many reference, 1:squillions parent reference), 16 MB document limit, unbounded-array anti-pattern · Mongo patterns: bucket, computed, extended reference, subset, outlier · schema-version field and lazy migration · DynamoDB key design: partition key + sort key, item collections, composite sort keys (`INVOICE#2026-11#<id>`) · single-table design with GSI overloading and adjacency lists, vs multi-table · limits: 3,000 RCU / 1,000 WCU per partition, 400 KB item; write sharding for hot keys · GSIs are eventually consistent; LSIs cap an item collection at 10 GB · transactions: Mongo multi-document (4.0+), DynamoDB `TransactWriteItems` (100 items) and their cost · denormalization fan-out on update · pagination with `LastEvaluatedKey` · worked example: InvoiceOps in Mongo and in DynamoDB single-table, compared with the SQL schema.
- Diagrams: ER diagram → nested JSON document mapping; excalidraw table of a DynamoDB single-table layout (PK/SK rows for workspace, client, invoice, payment).

### Optimistic and Pessimistic Locking
`advance backend/theory/data modeling/Optimistic and Pessimistic Locking.md` · 154 lines · real 7 · depth 1 · REWRITE
- Has: one-line definition; version-check flowchart (update where version=1 → rows updated? → retry).
- Problems: ~92% template; SD-interview bank; pessimistic locking never shown.
- Keep: the version-check flowchart.
- New home: `07 Databases/Locking - Optimistic vs Pessimistic`
- Must cover: lost-update anomaly demo (two read-modify-write requests) · pessimistic: `SELECT … FOR UPDATE` / `FOR SHARE`, `NOWAIT`, `SKIP LOCKED` (job-queue pattern); lock lives as long as the txn · optimistic: version column, `UPDATE … WHERE id = $1 AND version = $2` + rows-affected check, retry policy · HTTP optimistic concurrency: `ETag` + `If-Match` → 412 Precondition Failed · NoSQL compare-and-set: DynamoDB condition expressions, Mongo versioned `findOneAndUpdate`, Redis `WATCH`/`MULTI` · choosing by contention (low → optimistic; hot rows or long critical sections → pessimistic) · deadlocks: consistent lock ordering, detection, retry on 40P01 · advisory locks (`pg_advisory_xact_lock`) for app-level mutexes · InnoDB gap/next-key lock surprises · Go code for both with a two-goroutine test · real cases: seat booking, inventory decrement.
- Diagrams: sequence diagrams for (a) lost update, (b) FOR UPDATE blocking the second txn, (c) optimistic version conflict + retry.

### SQL vs NoSQL
`advance backend/theory/data modeling/SQL vs NoSQL.md` · 157 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition; decision flowchart (relational/transactions? → SQL, else document/KV/graph/wide-column).
- Problems: ~91% template; SD-interview bank; decision flow repeats the "transactions → SQL" oversimplification; no products, myths, or real migrations.
- Keep: flowchart skeleton (to be corrected).
- New home: `07 Databases/SQL vs NoSQL`
- Must cover: families with one real product each: relational, document, key-value, wide-column, graph, time-series, search, vector · schema-on-write vs schema-on-read · normalized joins vs denormalized aggregates · ACID vs BASE, and the myths (NoSQL can do transactions: Mongo, DynamoDB; SQL can scale out: Vitess, Citus, Aurora) · scaling paths: vertical + replicas + sharding vs built-in partitioning · consistency defaults (DynamoDB eventually consistent reads by default, Cassandra tunable, Postgres serializable available) · Postgres JSONB as the middle ground · distributed SQL (Spanner, CockroachDB, YugabyteDB, TiDB) · decision table by workload (payments, sessions, catalog, chat messages, social graph, logs/metrics) · polyglot persistence costs (ops, cross-store consistency) · real migrations (Discord, Uber Schemaless on MySQL, Instagram sharded Postgres).
- Diagrams: corrected decision flowchart driven by access pattern, relationships, consistency and scale; families as a comparison table.

### Schema Design
`advance backend/theory/data modeling/Schema Design.md` · 154 lines · real 7 · depth 0 · REWRITE
- Has: one-line definition; requirements → entities → relations → tables → indexes diagram.
- Problems: ~92% template; SD-interview bank; no example schema although InvoiceOps exists in the same folder.
- Keep: nothing here (InvoiceOps schema comes from the Content Table).
- New home: `07 Databases/Relational Schema Design`
- Must cover: entities and relationships (1:1, 1:N, M:N via join table) on InvoiceOps · keys: surrogate vs natural; bigint identity vs UUIDv4 vs UUIDv7/ULID (index locality) · normalization 1NF → 3NF/BCNF with a broken-then-fixed example; when to denormalize · constraints as invariants: NOT NULL, CHECK, UNIQUE, FK with ON DELETE choices · types: money as integer minor units or NUMERIC (never float), `timestamptz`, text vs varchar, enum vs lookup table · soft delete with a partial unique index · audit columns and an audit-log table · multi-tenancy: `tenant_id` + row-level security vs schema-per-tenant vs DB-per-tenant · when JSONB columns are acceptable · anti-patterns: polymorphic associations, EAV · naming conventions and schema evolution (link migrations) · full InvoiceOps DDL with indexes.
- Diagrams: mermaid `erDiagram` of InvoiceOps (users, workspaces, workspace_members, clients, invoices, invoice_items, payments, webhook_events, audit_logs).

### Schema Registry
`advance backend/theory/data modeling/Schema Registry.md` · 153 lines · real 9 · depth 0 · REWRITE
- Has: one-line definition; diagram Producer → Registry → (valid schema) → Topic.
- Problems: ~90% template; the diagram puts the registry in the data path (wrong, see factual errors); misfiled (event contracts are messaging, not data modeling); uses the SD-interview bank.
- Keep: nothing.
- New home: `09 Messaging & Async/Event Schemas and Schema Registry`
- Must cover: why (producers and consumers deploy independently; one breaking field breaks every consumer) · formats: Avro, Protobuf, JSON Schema trade-offs · wire format: magic byte + 4-byte schema ID; clients cache schemas · subjects and naming strategies (TopicNameStrategy default, RecordNameStrategy) · compatibility modes: BACKWARD (default), FORWARD, FULL, the `_TRANSITIVE` variants, NONE, and which side must upgrade first · safe evolution rules: add optional fields with defaults; never reuse or renumber Protobuf fields (`reserved`); no type changes · CI enforcement: registry compatibility check, `buf breaking` · registries: Confluent, Apicurio, AWS Glue · when you must break: new topic or version field, upcasters · data contracts and ownership · links to API versioning and the Go protobuf notes.
- Diagrams: sequence diagram (producer registers/looks up schema → gets ID → writes record with ID to Kafka; consumer reads → fetches schema by ID → deserializes); compatibility-mode table.

### Search Indexes
`advance backend/theory/data modeling/Search Indexes.md` · 154 lines · real 7 · depth 1 · MERGE→`07 Databases/Search Engines and Inverted Indexes`
- Has: one-line definition; DB → change event → indexer → search index diagram.
- Problems: ~92% template; pure duplicate of Search Architecture.
- Keep: the CDC → indexer flowchart (fold into the merged note).
- New home: `07 Databases/Search Engines and Inverted Indexes`
- Must cover: see Search Architecture.
- Diagrams: folded into the merged note.

---

## system design

### Database Replication
`advance backend/theory/system design/Database Replication.md` · 199 lines · real 37 · depth 2 · POLISH
- Has: primary/replica read-scaling diagrams, 4-step lag example, read-your-writes fixes, sync vs async definitions.
- Problems: ~69% template; "Why it is used: … Keep backup copy of data" is wrong (replication is not a backup); interview bank is about running an SD interview, not replication; no mechanism (WAL/binlog), failover, multi-leader or leaderless; misfiled under system design.
- Keep: both diagrams; lag example; "Solutions" list; "replication helps reads and availability, not write scaling".
- New home: `07 Databases/Replication`
- Must cover: why (read scale, HA, geo-latency, analytics offload) · single-leader, multi-leader, leaderless overview · mechanisms: statement-based vs physical WAL streaming (Postgres) vs logical/row-based (binlog ROW, Postgres logical replication) · sync vs semi-sync vs async and the RPO each implies; Postgres `synchronous_standby_names` quorum · lag sources (long txns, replica I/O, bulk writes) and monitoring (`pg_stat_replication.replay_lag`, `Seconds_Behind_Source`) · anomalies: read-your-writes, monotonic reads, consistent prefix; fixes (read primary for N s after a write, LSN/GTID tokens, sticky replica) · read/write splitting in Go (two pools or a proxy) · failover: promotion, async data-loss window, split brain and fencing; Patroni, Orchestrator; RDS Multi-AZ vs read replicas · multi-leader conflicts (LWW, merge, CRDTs) → link · leaderless/quorums → link 10 · cascading and delayed replicas; replicas for backups/analytics · "not a backup" worked example.
- Diagrams: sequence diagram of async replication + stale read from a lagging replica, then the LSN-token fix; flowchart comparing single-leader, multi-leader and leaderless topologies.

### Database Sharding
`advance backend/theory/system design/Database Sharding.md` · 218 lines · real 45 · depth 2 · MERGE→`07 Databases/Partitioning and Sharding`
- Has: definition, user-ID range example, 4 strategies, shard-key rules, challenges, replication vs sharding table, router diagrams.
- Problems: ~66% template; SD-interview bank; duplicate of Sharding Patterns; the range example (IDs 1–1,000,000 on shard 1, …) is itself the hot-shard anti-pattern with auto-increment IDs, and the note never says so.
- Keep: range example (reuse it to demonstrate the hot shard); replication vs sharding table; hash-router diagram.
- New home: `07 Databases/Partitioning and Sharding`
- Must cover: see Sharding Patterns.
- Diagrams: folded into the merged note.

### Load Balancer
`advance backend/theory/system design/Load Balancer.md` · 195 lines · real 39 · depth 2 · POLISH
- Has: purpose, 4 algorithms, health checks, sticky-session pitfall, L4 vs L7 table, path-routing diagram.
- Problems: ~66% template; SD-interview bank; algorithms stop at basics (no least-request, power of two choices, EWMA, consistent hashing); nothing on LB redundancy, connection draining, or long-lived connections (gRPC/HTTP2, WebSocket).
- Keep: L4/L7 table; path-routing diagram; session store vs sticky sessions explanation; health-check section.
- New home: `11 System Design/Load Balancing`
- Must cover: L4 (connection-level: NLB, LVS) vs L7 (request-level: ALB, Envoy, Nginx) and what each can see and do · algorithms: round robin, weighted RR, least connections, least outstanding requests, latency-aware/EWMA, random, power of two choices, IP/consistent hash (ring hash, Maglev) · health checks: active vs passive/outlier detection; readiness vs liveness · connection draining (deregistration delay) and slow start · sticky sessions (cookie) vs externalized state · HTTP/2 and gRPC long-lived connections → L7 or client-side LB (look-aside, xDS) · TLS termination vs pass-through; `X-Forwarded-For` and PROXY protocol · LB high availability: active/passive pair (VRRP/keepalived), anycast, DNS/GSLB · global vs regional load balancing · products: AWS ALB/NLB/GWLB, HAProxy, Envoy, Nginx · metrics: per-backend RPS, 5xx, latency, surge queue.
- Diagrams: flowchart DNS → L4 LB → L7 LB fleet → services; sequence diagram of a failing health check → backend removed → in-flight requests drained; algorithms as a when-to-use table.

### Monolith and Microservices
`advance backend/theory/system design/Monolith and Microservices.md` · 207 lines · real 42 · depth 2 · POLISH
- Has: monolith and microservice diagrams with pros/cons, modular monolith, migration path, when microservices make sense.
- Problems: ~67% template; SD-interview bank; duplicates `bytes GO complete thimh/React/React Theory/mcroservise_monolith.md`; nothing on data ownership, the distributed-monolith anti-pattern, or Conway's law; architecture topic misfiled under system design.
- Keep: both diagrams; modular-monolith section; migration-path flowchart; "when microservices make sense" list.
- New home: `16 Software Architecture/Monolith vs Microservices`
- Must cover: monolith vs modular monolith vs microservices (deployment unit vs code boundary) · bounded contexts as split lines (link DDD) · database per service and data ownership; no shared tables · sync (REST/gRPC) vs async (events) communication and the latency of extra hops · distributed-monolith anti-pattern (lockstep deploys, chatty calls) · operational tax: service discovery, per-service CI/CD, tracing, on-call · cross-service consistency → saga/outbox · Conway's law and team topology · decision signals (team count, deploy contention, scale asymmetry) · migration with strangler fig · real cases: Amazon Prime Video monitoring moved back to a monolith (2023), Segment "Goodbye Microservices" (2018), Shopify's modular monolith.
- Diagrams: flowchart triptych (monolith / modular monolith with module boundaries / microservices with own DBs + event bus); keep the migration-path flowchart.

### Nginx
`advance backend/theory/system design/Nginx.md` · 199 lines · real 40 · depth 2 · POLISH
- Has: uses list, reverse-proxy and LB diagrams, minimal `upstream` config, `proxy_set_header` block.
- Problems: ~67% template; SD-interview bank; examples proxy a "Node/Express" backend on `app1:3000` in a Go vault; nothing on the event-loop architecture, location matching, timeouts, or WebSocket proxying; overlaps `api design/Reverse Proxy vs Forward Proxy`.
- Keep: upstream/server config (switch to a Go backend); proxy-header block and its explanation.
- New home: `02 Networking & Web/Nginx`
- Must cover: master/worker processes, non-blocking event loop (epoll), `worker_connections` (why it handled C10k) · config structure `http` → `server` → `location`; location precedence (`=`, `^~`, regex `~`/`~*`, longest prefix) · reverse proxy to a Go service with headers; trusting `X-Forwarded-For` only from known proxies · upstream methods: round robin, `least_conn`, `ip_hash`, `hash $key consistent`; passive health checks (`max_fails`, `fail_timeout`); active checks are NGINX Plus only · timeouts and buffering (`proxy_connect/read/send_timeout`; read default 60 s) · upstream keepalive (`keepalive`, `proxy_http_version 1.1`) · TLS termination, HTTP/2, HSTS · gzip, static files, `proxy_cache` micro-caching · rate limiting: `limit_req` (leaky bucket with `burst`/`nodelay`), `limit_conn` · WebSocket proxying (`Upgrade`/`Connection` headers) · zero-downtime `nginx -s reload` · alternatives and Kubernetes: Envoy, HAProxy, Caddy, Traefik; ingress-nginx retirement (verify: announced Nov 2025).
- Diagrams: flowchart of one request through Nginx (TLS → location match → limit_req → proxy_cache → upstream pick → Go API); sequence diagram of a WebSocket upgrade proxied through Nginx.

### Scaling Concepts
`advance backend/theory/system design/Scaling Concepts.md` · 224 lines · real 54 · depth 2 · POLISH
- Has: vertical vs horizontal with pros/cons, stateless servers, bottleneck list, scaling flowchart, metrics, 6-step solution order.
- Problems: ~61% template; SD-interview bank; wrong-context links: "Add `[[cache]]`" resolves to the ByteByteGo data-structure memoization note, "Add `[[Message Queue with Redis|queue]]`" sends a generic queue to a Redis note; no read-vs-write scaling paths, scale cube, or limits (Amdahl/USL).
- Keep: vertical/horizontal good/problem lists; stateless-server section; "common solution order"; scaling-pattern flowchart.
- New home: `11 System Design/Scaling Basics`
- Must cover: vertical vs horizontal with limits and cost curve · stateless services: externalize sessions, uploads, caches, locks · scale cube (X clone, Y functional split, Z data partition) · read-scaling path (cache → CDN → replicas) vs write-scaling path (batching, queues, sharding) · async processing to flatten peaks · autoscaling signals (CPU, RPS, queue depth) and their lag (link 13 Autoscaling) · Amdahl's law and the Universal Scalability Law (contention + coherency make extra nodes hurt) · the database is usually the hard part · headroom (run at 50–70% at peak) · measure before scaling (link Performance Engineering) · worked journey: 1 server → LB + 3 stateless apps + Redis + primary/replica → sharded.
- Diagrams: flowchart "growth journey" in 4 stages; excalidraw scale cube.

### System Design Content Table
`advance backend/theory/system design/System Design Content Table.md` · 95 lines · real 62 · depth 1 · DELETE
- Has: study order, big-picture architecture diagram, topic summary table, revision checklist, 7 interview questions, related links.
- Problems: nav note; the big-picture diagram mixes a replica path and a shard-router path from the same API servers without explanation.
- Keep: big-picture diagram (starting sketch for SD Fundamentals); the 7 interview questions → 11 MOC.
- New home: `11 System Design/11 System Design MOC` (salvage only)
- Must cover: n/a.
- Diagrams: none.

### System Design introduction
`advance backend/theory/system design/System Design introduction.md` · 171 lines · real 27 · depth 1 · REWRITE
- Has: definition, why it is needed, basic vs scaled flow diagrams, five one-line quality attributes.
- Problems: ~74% template; SD-interview bank; quality attributes are one-liners without measures; title capitalization.
- Keep: basic → scaled flow diagrams.
- New home: `11 System Design/System Design Fundamentals`
- Must cover: functional vs non-functional requirements · quality attributes with measures: availability (nines), latency (p50/p99), throughput (RPS), durability (S3's 11 nines), consistency, scalability, cost · SLI/SLO link · building-block catalogue (DNS, CDN, LB, API gateway, app tier, cache, DB, queue, object storage, search, observability) and what each solves · a request's lifecycle through the stack · read-heavy vs write-heavy systems · stateful vs stateless components · trade-off vocabulary (latency vs consistency, cost vs availability) · link to estimation and the case-study index.
- Diagrams: flowchart of the canonical web stack (client → DNS → CDN → LB → API → cache/DB/queue → workers → object storage) annotated with what each block solves.

---

## system design practice

### Design Chat System
`advance backend/theory/system design practice/Design Chat System.md` · 155 lines · real 8 · depth 1 · REWRITE
- Has: one-line requirement list (real-time, storage, presence, ordering, offline); WS server → pub/sub → WS server diagram.
- Problems: ~91% template; checklist: requirements ✗ (one line), estimates ✗, API ✗, data model ✗, HLD partial (4 boxes), deep dives ✗, bottlenecks ✗; "Simple example" says "design a URL shortener" (template text in every case study).
- Keep: the gateway ↔ pub/sub ↔ gateway idea.
- New home: `11 System Design/Case Study - Chat System`
- Must cover: requirements (1:1 and groups, receipts, presence, offline push, multi-device, history) · estimates (e.g., 50M DAU × 40 msgs = 2B/day ≈ 23k msg/s avg, ~100k peak; ~200 GB/day at 100 B) · API: WebSocket events (`send{client_msg_id}`, `ack`, `typing`) + REST history `GET /conversations/{id}/messages?before=` · data model: messages partitioned by conversation_id, clustered by time-sortable message_id (Cassandra/Scylla, as Discord) · HLD: stateful WS gateways + session registry (user → gateway in Redis) + message service + Kafka/pub-sub fan-out + push service · ordering per conversation (server sequence or Snowflake per channel) · idempotent send via `client_msg_id`; ack and resend · small-group write fan-out vs large-channel read fan-out · presence via heartbeats + TTL and its fan-out cost · offline delivery and per-device sync cursors · E2E encryption and what it removes from the server · bottlenecks: connections per gateway, hot groups, reconnect storms after deploys.
- Diagrams: flowchart HLD (clients → LB → WS gateways → registry; message service → Cassandra; Kafka → gateways/push); sequence diagram of send → persist → fan-out → deliver → ack → read receipt.

### Design File Storage
`advance backend/theory/system design practice/Design File Storage.md` · 155 lines · real 8 · depth 1 · REWRITE
- Has: one-line definition (metadata, chunks, replication, download URLs); upload → chunks → object store/metadata → CDN diagram.
- Problems: ~91% template; requirements ✗, estimates ✗, API ✗, data model ✗, HLD partial, deep dives ✗, bottlenecks ✗; overlaps `api design/File Upload Architecture`, `golang backend/Go File Uploads`, `aws/AWS S3`.
- Keep: diagram skeleton.
- New home: `11 System Design/Case Study - File Storage and Sync`
- Must cover: requirements (upload/download, sync across devices, sharing, versions, multi-GB files, resumable) · estimates (users × quota → PB; uploads/s; egress bandwidth) · API: init upload → presigned multipart URLs → complete; download via presigned/CDN URL; `GET /changes?cursor=` for sync · data model: files, file_versions, chunks (sha256, size, location), file_chunks, shares/ACL, per-device cursors · HLD: API + sharded metadata DB + object storage + sync notification service (long-poll/WS) + CDN · chunking: fixed 4 MB blocks (Dropbox) vs content-defined chunking (Rabin/FastCDC) · dedup by chunk hash and delta sync · S3 multipart rules (≥5 MiB parts except the last, ≤10,000 parts) and resumability · conflicts (conflicted copies, version vectors) · strong consistency for metadata, immutable blobs · orphan-chunk GC, storage tiering (IA/Glacier), encryption at rest · bottlenecks: hot metadata users, sync fan-out, egress cost.
- Diagrams: sequence diagram of a resumable chunked upload with presigned URLs and commit; flowchart of sync (device A change → metadata → notification → device B pulls changed chunks).

### Design News Feed
`advance backend/theory/system design practice/Design News Feed.md` · 155 lines · real 8 · depth 1 · REWRITE
- Has: one-line definition; post → fan-out service → feed cache ← feed API → ranking diagram.
- Problems: ~91% template; requirements ✗, estimates ✗, API ✗, data model ✗, HLD partial, deep dives ✗ (fan-out is a box only), bottlenecks ✗.
- Keep: diagram skeleton.
- New home: `11 System Design/Case Study - News Feed`
- Must cover: requirements (post, follow, ranked or chronological home feed, pagination, media) · estimates (e.g., 300M DAU, average 200 followees, posts/s → fan-out writes/s, feed reads/s) · API: `POST /posts`, `GET /feed?cursor=&limit=` · data model: posts, follows (follower, followee), per-user feed list of post IDs (Redis list/zset, ~800 entries as in Twitter's timeline cache) · HLD: post service, fan-out workers (Kafka), feed cache, post/user object caches, ranking service, media via object storage + CDN · fan-out on write vs on read vs hybrid (celebrity threshold, merged at read time) · hydration with multi-get · cursor pagination and dedupe · ranking pipeline (candidates → features → scoring) · sharded like/view counters · propagating deletes, privacy changes, blocks · skip fan-out to inactive users · bottlenecks: celebrity fan-out storms, cache memory, hot posts.
- Diagrams: flowchart of write path (post → Kafka → fan-out workers → follower feeds; celebrities skipped) and read path (feed cache + celebrity pull → merge → rank → hydrate); sequence diagram of `GET /feed`.

### Design Notification System
`advance backend/theory/system design practice/Design Notification System.md` · 156 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition (email/SMS/push/in-app); event → queue → worker → channels + DLQ diagram.
- Problems: ~90% template; requirements ✗, estimates ✗, API ✗, data model ✗, HLD partial, deep dives ✗, bottlenecks ✗; LLD counterpart `LLD with Go/practice/Notification System LLD in Go.md` (+ Excalidraw) exists; cross-link, don't duplicate.
- Keep: diagram skeleton (event → queue → workers → channels → DLQ).
- New home: `11 System Design/Case Study - Notification System`
- Must cover: requirements (transactional vs marketing, channels, preferences/opt-out, quiet hours, scheduling, delivery tracking) · estimates (e.g., 10M push + 5M email + 1M SMS per day; broadcast peaks) · API: `POST /notifications {recipient|segment, template_id, params, channels, priority, idempotency_key, send_at}` · data model: versioned/localized templates, user_preferences, device_tokens, notification_log with status · HLD: ingestion API → validation + preference filter → per-channel, per-priority queues → channel workers → providers (APNs, FCM, SES, Twilio) → delivery callbacks · priority isolation (an OTP never waits behind a marketing blast) · dedupe via idempotency keys · retries with backoff, DLQ, provider failover · rate limits: per-user frequency caps and provider quotas · broadcast to millions (segment expansion in batches) · scheduling and time zones · device-token invalidation (APNs 410, FCM UNREGISTERED) · tracking sent/delivered/opened · bottlenecks: provider throughput, marketing blasts.
- Diagrams: flowchart HLD with per-channel, per-priority queues; sequence diagram of an OTP SMS with provider timeout → retry → fallback provider.

### Design Payment System
`advance backend/theory/system design practice/Design Payment System.md` · 188 lines · real 25 · depth 2 · REWRITE
- Has: one-line definition, idempotency-key sequence, deeper flowchart (idempotency, PSP, webhook, ledger, reconciliation), must-have list, timeout failure case.
- Problems: ~79% template; sequence records to the ledger only after the PSP returns (persist the intent first, see factual errors); requirements ✗, estimates ✗, API partial, data model ✗ (no double-entry), HLD partial, deep dives partial (a concept list), bottlenecks ✗.
- Keep: must-have list (idempotency key, payment intent/order id, webhook signature verification, immutable ledger, reconciliation job, refund/chargeback flow); "provider charges but API times out" failure case; deeper flowchart.
- New home: `11 System Design/Case Study - Payment System`
- Must cover: requirements (pay-in via PSP, refunds, no double charge, auditability, PCI scope; payouts optional) · estimates (1M payments/day ≈ 12 TPS: correctness, not QPS, is the hard part) · API: `POST /payments` with `Idempotency-Key`, `GET /payments/{id}`, PSP webhook endpoint · state machine (created → requires_action/3DS → processing → succeeded | failed → refunded/disputed) · persist intent + key before calling the PSP; send the same key to the PSP · "unknown outcome" on timeout: query PSP / await webhook, never blind-retry · webhooks: signature verification, dedupe by event id, out-of-order events · double-entry ledger (immutable entries, debits = credits, balances derived) · outbox for payment events · daily reconciliation against PSP settlement files with mismatch alerts · money in minor units or decimal, with currency · tokenization/hosted fields to stay out of PCI DSS scope · refunds and chargebacks · bottlenecks: PSP latency/outages (multi-PSP failover), hot merchant ledger accounts.
- Diagrams: stateDiagram-v2 of payment states; sequence diagram (client → API: intent + key → DB; API → PSP with same key; timeout → reconciliation/webhook path); `erDiagram` of payments, payment_attempts, ledger_entries.

### Design URL Shortener
`advance backend/theory/system design practice/Design URL Shortener.md` · 156 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition; create → DB/cache and redirect → cache → long URL diagram.
- Problems: ~90% template; requirements ✗, estimates ✗, API ✗, data model ✗, HLD partial, deep dives ✗ (key generation absent), bottlenecks ✗.
- Keep: diagram skeleton.
- New home: `11 System Design/Case Study - URL Shortener`
- Must cover: requirements (shorten, redirect, custom alias, expiry, click analytics; ~100:1 read:write) · estimates (e.g., 100M new URLs/day ≈ 1.2k writes/s; 10B redirects/day ≈ 115k reads/s; 5 years ≈ 180B rows × 500 B ≈ 90 TB) · key space: base62^7 ≈ 3.5 trillion · API: `POST /urls {long_url, alias?, ttl?}` → 201; `GET /{code}` → 301/302 · 301 vs 302/307 (browser caching vs analytics) · key generation: hash + truncate + collision check vs counter + base62 (ID ranges from a ticket server/etcd) vs pre-generated key service · data model: code (PK) → long_url, owner, created_at, expires_at in a KV store (DynamoDB/Cassandra) · read path: Redis LRU + CDN edge redirects; hot links · analytics async (click events → Kafka → OLAP) · custom alias uniqueness via conditional put · abuse: malware URL scanning, creator rate limits · expiry cleanup (lazy + batch) · bottlenecks: key-service SPOF, hot keys, long-tail cache misses.
- Diagrams: flowchart HLD (write path via key service; read path CDN → cache → KV; clicks → Kafka → analytics); sequence diagram of a redirect with a cache miss.

### How to Answer System Design
`advance backend/theory/system design practice/How to Answer System Design.md` · 173 lines · real 19 · depth 2 · POLISH
- Has: 9-step answer-shape callout and flowchart: requirements, estimates, API, data model, HLD, deep dives, failures, observability, trade-offs.
- Problems: ~82% template; the SD-interview bank ("What is the first thing you ask?") that was pasted into 21 other notes in this scope fits only here; no time budget, worked mini-example, or rubric; the draft architecture lists the framework in both 11 and 19 (pick 11, link from 19).
- Keep: callout + flowchart; the 5 SD-interview Q&As (first question, design path, senior vs mid-level, choosing the deep dive, closing); from the Practice Content Table: 10-step framework, "what each problem teaches" table, common mistakes, practice method.
- New home: `11 System Design/System Design Interview Framework`
- Must cover: time budget for 45/60 min (requirements 5, estimates 3–5, entities/API 5, HLD 10, deep dives 15–20, wrap-up 5) · functional vs non-functional requirements and explicit out-of-scope · estimate only what changes a decision · core entities and API before boxes · HLD that satisfies functional requirements first, then NFR-driven deep dives · choosing the deep dive (riskiest component) and offering options · stating trade-offs as "X over Y because …" · failure modes, observability, evolution path · SDE-3 signals: driving, quantifying, operability, simplicity · anti-patterns (Kafka/microservices by default, buzzword lists, no numbers) · one-page worked example (URL shortener in 45 min) · self-review rubric.
- Diagrams: flowchart of the interview timeline with minute budget per phase.

### System Design Practice Content Table
`advance backend/theory/system design practice/System Design Practice Content Table.md` · 95 lines · real 53 · depth 2 · MERGE→`11 System Design/System Design Interview Framework`
- Has: 10-step framework, "what each problem teaches" table, InvoiceOps mapping, mistakes, 2 Q&As, 5-step practice method.
- Problems: nav note that holds the best framework content in the folder; "visual path" diagram is a plain chain of links.
- Keep: 10-step framework; problem / lesson / hard-part table (extend to all new case studies); mistakes list; practice method.
- New home: `11 System Design/System Design Interview Framework` (+ case-study index in `11 System Design/11 System Design MOC`)
- Must cover: n/a (salvage).
- Diagrams: none.

---

## distributed systems

### CQRS
`advance backend/theory/distributed systems/CQRS.md` · 154 lines · real 7 · depth 1 · REWRITE
- Has: one-line definition; command → write model → events → read model ← query diagram.
- Problems: ~92% template; distributed-systems generic interview bank; diagram implies CQRS needs events/event sourcing (it does not).
- Keep: nothing (redraw the diagram).
- New home: `10 Distributed Systems/CQRS`
- Must cover: CQS → CQRS (commands change state, queries return data) · levels: same DB with separate read models → separate read tables → separate read store (Elasticsearch/Redis) · read-model update paths: same transaction, outbox/CDC projection, event-sourced projections · eventual consistency of reads and UX handling (version tokens for read-your-writes, optimistic UI) · projection rebuild/replay; idempotent projectors · when it pays (read/write asymmetry, many query shapes) vs overkill (CRUD) · projection-lag monitoring · InvoiceOps dashboard read model fed by invoice/payment events · relation to materialized views and event sourcing.
- Diagrams: flowchart with command path (API → domain → write DB → outbox) and query path (projector → read store → query API); sequence diagram of write-then-read hitting projection lag.

### Clock Skew and Time
`advance backend/theory/distributed systems/Clock Skew and Time.md` · 138 lines · real 10 · depth 1 · REWRITE
- Has: one-line definition; sequence diagram where an event looks reordered because of skew.
- Problems: ~88% template; generic interview bank; no logical clocks, monotonic clocks, NTP limits, or LWW danger.
- Keep: the skew sequence diagram as the opener.
- New home: `10 Distributed Systems/Clocks and Ordering`
- Must cover: wall clock vs monotonic clock (Go `time.Now()` carries a monotonic reading; `time.Since` uses it) · drift (ppm), NTP accuracy (ms over the internet, sub-ms in a DC), clock jumps, leap-second smearing · why timestamps cannot order events across nodes (LWW silently drops writes) · happens-before and Lamport clocks · vector clocks (detect concurrency; Dynamo/Riak) and their size cost · hybrid logical clocks (CockroachDB, MongoDB cluster time) · TrueTime and commit-wait (Spanner) · sequence numbers/offsets as ordering (Kafka offsets, DB sequences) · leases and TTLs under clock jumps → fencing link · Snowflake IDs when the clock moves backwards · rules: store UTC, server-assigned times, never order by client clocks.
- Diagrams: sequence diagram of LWW losing a write because of skew; space-time diagram of 3 processes with Lamport vs vector timestamps (excalidraw or mermaid sequence).

### Consensus
`advance backend/theory/distributed systems/Consensus.md` · 159 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition; leader → replicated log → followers → majority commit diagram; "apps rely on etcd/ZooKeeper" point.
- Problems: ~91% template; generic interview bank; no Raft mechanics, quorum math, or FLP.
- Keep: the "you rely on etcd/ZooKeeper rather than implement consensus" point; majority-commit diagram idea.
- New home: `10 Distributed Systems/Consensus - Raft and Paxos`
- Must cover: problem statement (agreement, validity, termination) and uses (election, config, locks, replicated state machines) · crash vs Byzantine faults · majority quorums: 2f+1 nodes tolerate f failures; why 3 or 5, not 4 · FLP impossibility and how timeouts sidestep it · Raft roles, terms, randomized election timeouts (150–300 ms in the paper), RequestVote, election restriction · log replication: AppendEntries, consistency check, commit on majority, follower repair · safety: leader completeness; only current-term entries committed by counting · linearizable reads (ReadIndex, lease reads) · membership changes (joint consensus / single-server) and snapshots · Paxos/Multi-Paxos and ZAB in brief · real systems: etcd (Kubernetes), Consul, ZooKeeper, Kafka KRaft, CockroachDB/TiKV multi-Raft · cost: each write = majority RTT + fsync; cross-region latency.
- Diagrams: stateDiagram-v2 of Raft roles (follower → candidate → leader, term bumps); sequence diagram of AppendEntries to 2 followers → majority ack → commit → apply.

### Consistency Models
`advance backend/theory/distributed systems/Consistency Models.md` · 167 lines · real 13 · depth 1 · REWRITE
- Has: one-line definition; strong vs eventual read diagram; 3-row table (bank balance / like count / profile edit).
- Problems: ~87% template; generic interview bank; no hierarchy, no linearizable vs serializable distinction, only one session guarantee.
- Keep: the example table.
- New home: `10 Distributed Systems/Consistency Models`
- Must cover: linearizability (single object, real-time) · sequential consistency · causal consistency · eventual consistency (convergence only) · session guarantees: read-your-writes, monotonic reads, monotonic writes, writes-follow-reads · linearizability vs serializability vs strict serializability · how replication lag produces each anomaly (link Replication) · implementing session guarantees: sticky routing, LSN/version tokens, read from leader · real defaults: DynamoDB (eventual by default, strongly consistent reads opt-in), S3 (strong read-after-write since Dec 2020), Cassandra (tunable), MongoDB read/write concerns, Postgres replicas · cost of stronger models (latency, availability; link CAP/PACELC) · Jepsen as how systems get tested · choosing per feature (balance vs likes vs feed).
- Diagrams: hierarchy flowchart TD (strict serializable → linearizable / serializable → causal → eventual); sequence diagram of a monotonic-reads violation across two replicas.

### Distributed Locks
`advance backend/theory/distributed systems/Distributed Locks.md` · 163 lines · real 12 · depth 1 · REWRITE
- Has: one-line definition; Redis `SET lock value NX PX 30000` sequence; rule "TTL, owner value, safe unlock check".
- Problems: ~88% template; generic interview bank; no fencing tokens (TTL locks are unsafe under GC pauses and network delays); both workers send the same literal `value` (owner value must be unique); second `SET` lacks `PX`.
- Keep: the SET NX PX sequence diagram (with unique tokens); the TTL/owner/safe-unlock rule.
- New home: `10 Distributed Systems/Distributed Locks and Fencing Tokens`
- Must cover: efficiency locks vs correctness locks (Kleppmann) · Redis lock: `SET key <uuid> NX PX ttl`, release with a Lua compare-and-delete, renewal watchdog · the pause problem: holder stalls past TTL, second holder acquires, both write · fencing tokens: monotonically increasing number checked by the resource (`UPDATE … WHERE fence < $token`) · Redlock and the Kleppmann–antirez debate (timing assumptions) · consensus-backed locks: etcd lease + revision as fencing token; ZooKeeper ephemeral sequential znodes (watch predecessor, no herd) · DB locks: `pg_advisory_lock`, `SELECT … FOR UPDATE SKIP LOCKED` · TTL sizing vs work duration · avoid locks where possible: idempotency, unique constraints, single-writer partitioning by key · Go libraries: redsync, etcd `concurrency.Mutex` · use cases: single cron run, scheduler leader, inventory hold.
- Diagrams: sequence diagram of the GC-pause failure (client 1's lease expires mid-pause, client 2 writes, client 1 resumes and overwrites), then the same with fencing tokens rejecting the stale write.

### Distributed Systems Content Table
`advance backend/theory/distributed systems/Distributed Systems Content Table.md` · 77 lines · real 36 · depth 0 · DELETE
- Has: link lists, a generic service diagram, a linear "topic map" chain of links, colour legend.
- Problems: nav-only; the topic map is a straight chain with no structure; legend refers to an "Excalidraw roadmap".
- Keep: nothing (rebuild as the 10 MOC).
- New home: `10 Distributed Systems/10 Distributed Systems MOC`
- Must cover: n/a.
- Diagrams: none.

### Event Sourcing
`advance backend/theory/distributed systems/Event Sourcing.md` · 157 lines · real 7 · depth 1 · REWRITE
- Has: one-line definition; event store → replay → state / projection diagram; "great for audit-heavy domains, overkill for CRUD".
- Problems: ~92% template; generic interview bank; no event-store design, snapshots, versioning, or deletion handling.
- Keep: the "use carefully" line.
- New home: `10 Distributed Systems/Event Sourcing`
- Must cover: events as the source of truth vs state + audit log · aggregate streams with expected-version appends (optimistic concurrency) · rebuilding state by folding events; snapshots every N events · projections/read models (link CQRS) and replays · event design: past-tense facts, small, versioned; upcasting old events · GDPR erasure (crypto-shredding; keep PII out of events) · eventual consistency of projections · idempotent, ordered projectors · storage: EventStoreDB/Kurrent, Postgres append-only table; why Kafka alone is a weak event store (no per-aggregate expected-version append) · when to use (ledgers, audit, temporal queries) vs not · Go example: bank account or InvoiceOps invoice lifecycle.
- Diagrams: sequence diagram of command → load events → decide → append with expected version → publish → projector updates read model; flowchart of snapshot + tail replay.

### Exactly Once Myth
`advance backend/theory/distributed systems/Exactly Once Myth.md` · 143 lines · real 11 · depth 2 · REWRITE
- Has: core rule (at-least-once + idempotent processing), crash-after-side-effect diagram, payment-event dedupe example.
- Problems: ~87% template; generic interview bank; no definitions of the three semantics, no Kafka EOS scope, no dedupe-store design.
- Keep: practical rule; crash diagram; payment dedupe example.
- New home: `09 Messaging & Async/Delivery Semantics and Exactly-Once`
- Must cover: at-most-once / at-least-once / exactly-once defined by when the ack happens · two generals: exactly-once delivery is impossible over a lossy network · effectively-once = at-least-once + idempotent effect · dedupe store: `processed_messages(message_id unique)` written in the same DB transaction as the side effect · dedupe windows (SQS FIFO 5-minute) and their limits · Kafka EOS: idempotent producer (producer ID + sequence numbers), transactions (`transactional.id`, `read_committed`); scope is Kafka → Kafka read-process-write · external side effects (email, PSP) still need idempotency keys · transactional sinks: store offsets with results; Flink two-phase-commit sinks · outbox + idempotent consumer end to end · failure timeline table (crash before/after processing, before/after ack) · how to state guarantees precisely in an interview.
- Diagrams: sequence diagrams of the three semantics with crash points; flowchart of a consumer: begin txn → insert message_id (conflict → skip) → apply effect → commit → ack.

### High Availability and Failover
`advance backend/theory/distributed systems/High Availability and Failover.md` · 163 lines · real 12 · depth 1 · REWRITE
- Has: one-line definition; LB → 2 AZs → primary/standby diagram; correct nines table (8.8 h, 52 min, 5 min/year).
- Problems: ~88% template; generic interview bank; no availability math, failure detection, or failover steps; overlaps Database Replication, Multi Region, `production debugging/SLO SLA SLI`.
- Keep: nines table; AZ diagram as a starting point.
- New home: `10 Distributed Systems/High Availability and Failover`
- Must cover: availability = uptime / total; nines per year and per month · serial vs parallel math (two 99.9% services in series = 99.8%; an independent redundant pair ≈ 99.9999%) · removing SPOFs (N+1/N+2, multi-AZ) · failure detection: health checks, heartbeats, phi-accrual; the timeout trade-off (false positives vs slow failover) · active-passive vs active-active; hot/warm/cold standby · failover time budget: detect + decide + promote + reroute (DNS TTL, connection draining) · stateful failover: DB promotion, async data-loss window, split brain → fencing/STONITH · RTO/RPO per tier · static stability (keep serving when the control plane is down) · failback and testing (game days, chaos) · real examples: RDS Multi-AZ, Patroni, Route 53 failover records.
- Diagrams: sequence diagram of primary DB failure → detection → promotion → app reconnect, with timings; flowchart of multi-AZ redundancy with SPOFs marked.

### Leader Election
`advance backend/theory/distributed systems/Leader Election.md` · 158 lines · real 8 · depth 1 · REWRITE
- Has: one-line definition; 3 nodes → election → leader diagram; split-brain line (quorum/consensus/fencing).
- Problems: ~91% template; generic interview bank; no algorithm or practical recipe.
- Keep: the split-brain line.
- New home: `10 Distributed Systems/Leader Election`
- Must cover: why one leader (single writer, scheduler, coordinator) · classic bully and ring algorithms (vocabulary) · consensus-based election (Raft term + votes) · lease-based election through a coordination service: etcd election API, ZooKeeper ephemeral sequential znodes, Consul sessions · Kubernetes Lease objects with client-go leaderelection (typical 15 s lease, 10 s renew deadline, 2 s retry) · DB-based election (advisory lock or lease row with expiry) · detection timeouts vs failover latency · split brain and fencing with term/epoch numbers · graceful step-down on shutdown · Go example with `go.etcd.io/etcd/client/v3/concurrency` Election.
- Diagrams: sequence diagram of lease acquire → renew → missed renew → expiry → takeover between two instances and a lease store; stateDiagram of follower/candidate/leader.

### Multi Region Architecture
`advance backend/theory/distributed systems/Multi Region Architecture.md` · 156 lines · real 21 · depth 2 · REWRITE
- Has: active-passive vs active-active definitions, replication/conflict diagram, 7 hard problems, "use only when justified" answer.
- Problems: ~79% template; generic interview bank; no data-replication options, traffic routing, RPO/RTO, or cell architecture.
- Keep: hard-problems list; interview answer line.
- New home: `10 Distributed Systems/Multi-Region Architecture`
- Must cover: motivations: latency, disaster recovery, data residency · DR patterns (backup-restore, pilot light, warm standby, active-active) with RPO/RTO each · routing: GeoDNS/latency routing (Route 53), anycast/Global Accelerator, health-checked failover, DNS TTL caveats · data options: async cross-region replicas (Aurora Global, typically <1 s lag), multi-writer with LWW (DynamoDB global tables), synchronous geo-distributed SQL (Spanner/CockroachDB) and its write latency · write conflicts: home region per user/tenant, LWW, CRDTs · cell-based architecture and blast radius · global uniqueness (IDs, usernames) · caches and sessions across regions · data residency (GDPR, India DPDP) via geo-partitioning · cost of inter-region transfer · regional evacuation drills.
- Diagrams: flowchart of active-active with home-region routing and async replication; sequence diagram of a regional failover (health check fails → DNS shift → replica promoted).

### Outbox Pattern
`advance backend/theory/distributed systems/Outbox Pattern.md` · 169 lines · real 18 · depth 2 · POLISH
- Has: problem (crash between DB commit and publish), transaction + outbox flowchart, relay sequence diagram, consumer idempotency note.
- Problems: ~82% template; generic interview bank; no outbox schema, polling query, CDC/Debezium option, ordering, or cleanup; "related" link to `Message Queue with Redis` is weak; duplicated by the outbox flow in Search Architecture.
- Keep: both diagrams; problem statement; "consumers must be idempotent".
- New home: `09 Messaging & Async/Transactional Outbox and CDC`
- Must cover: dual-write problem in both orders (publish-then-commit, commit-then-publish) · outbox table schema (id, aggregate_type/id, event_type, payload, headers, created_at, published_at) · polling relay: `SELECT … FOR UPDATE SKIP LOCKED LIMIT 100`, publish, mark sent; several relays · log-tailing relay: Debezium on the Postgres WAL (logical slot) + outbox event router; WAL retention risk of an idle slot · ordering per aggregate (partition key = aggregate_id) and what parallel relays break · duplicates are expected → idempotent consumers / inbox table · cleanup (delete sent rows or drop partitions) · monitoring outbox lag and oldest unsent age · alternatives: listen-to-yourself, event sourcing, Kafka transactions (Kafka-only) · Go implementation sketch with a test.
- Diagrams: keep the sequence diagram; add a flowchart comparing polling relay vs CDC relay (DB → WAL → Debezium → Kafka).

### Quorum Reads and Writes
`advance backend/theory/distributed systems/Quorum Reads and Writes.md` · 165 lines · real 11 · depth 1 · REWRITE
- Has: one-line definition, W=2/R=2 overlap diagram, `R + W > N` with N=3.
- Problems: ~89% template; generic interview bank; "requires enough replicas to agree" (quorum replicas acknowledge/respond; agreement is consensus); no sloppy quorum, read repair, or why R+W>N is not linearizable.
- Keep: the overlap diagram (W on R1,R2; R on R2,R3) and formula.
- New home: `10 Distributed Systems/Quorums and Leaderless Replication`
- Must cover: leaderless (Dynamo-style) replication: any replica accepts writes · N, R, W and the overlap argument; common settings (N=3, R=W=2; R=1/W=N for read-heavy) · choosing the newest value: timestamps/LWW vs vector clocks/siblings · read repair and anti-entropy (Merkle trees) · sloppy quorum + hinted handoff and why they break the overlap guarantee · why R+W>N still is not linearizable (concurrent writes, partially failed writes, LWW with skew) · latency = slowest of the W/R replicas; speculative retries · per-request choice (Cassandra ONE/QUORUM/LOCAL_QUORUM) · quorum vs consensus · examples: Cassandra, Riak, ScyllaDB; trap: DynamoDB is leader-based (Multi-Paxos per partition), not Dynamo-style leaderless · worked failure: N=3, one replica down, W=2 still succeeds.
- Diagrams: keep the overlap diagram; sequence diagram of a read hitting a stale replica → read repair; flowchart of sloppy quorum + hinted handoff during a node outage.

### Saga Pattern
`advance backend/theory/distributed systems/Saga Pattern.md` · 175 lines · real 29 · depth 3 · POLISH
- Has: definition, two compensation sequence diagrams, orchestration vs choreography, why not a DB transaction, trade-off line.
- Problems: ~73% template; generic interview bank; both examples charge the card before reserving stock (order steps compensatable → pivot → retriable so a stock-out needs no refund); no isolation anomalies/countermeasures, saga state persistence, or tooling.
- Keep: both sequence diagrams (re-ordered); orchestration/choreography definitions; "why not normal DB transaction"; trade-off line.
- New home: `10 Distributed Systems/Saga Pattern`
- Must cover: why not 2PC across services (blocking coordinator, no XA across brokers/HTTP) · saga = local transactions + compensations · orchestration vs choreography: pros, cons, when each · step types: compensatable, pivot, retriable, and the ordering rule · compensation is semantic (refund, cancel, apology email), not rollback · no isolation: dirty reads/lost updates between concurrent sagas; countermeasures: semantic locks/pending states, commutative updates, reread value, version checks · reliable step messaging via outbox; idempotent participants; retries with backoff · persisted saga state machine/log; timeouts and stuck-saga recovery · tooling: Temporal/Cadence, AWS Step Functions, Camunda · observability: correlation id per saga, stuck-saga dashboard · worked example: reserve inventory → authorize/capture payment → create shipment, with a failure at each step.
- Diagrams: stateDiagram-v2 of the orchestrator (pending → inventory_reserved → paid → shipped; compensating → cancelled); sequence diagrams of the same flow as orchestration and as choreography.

---

## reliability

### Background Jobs
`advance backend/theory/reliability/Background Jobs.md` · 159 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition; API → queue → worker diagram; use cases; failure-mode phrase (duplicates, stuck workers, retry storms, poison messages).
- Problems: ~91% template; reliability generic interview bank; duplicates Worker Architecture and `golang backend/Go Worker Queues and Background Jobs`; no job lifecycle, ack/visibility, or concurrency control.
- Keep: use-case list; failure-mode phrase.
- New home: `09 Messaging & Async/Background Jobs and Worker Pools` (absorbs Worker Architecture; Go code stays in `06 Backend Engineering in Go`)
- Must cover: what leaves the request path (email, PDFs, webhook fan-out, reports) and returning 202 + job id · job lifecycle: enqueue → reserve/lease (visibility timeout) → run → ack / retry / dead-letter · at-least-once execution → idempotent handlers · reliable enqueue: same DB transaction (Postgres-backed queues like River) or outbox · backends: Redis (asynq, Streams), Postgres `SKIP LOCKED`, SQS, RabbitMQ, with trade-offs · worker pool sizing (CPU- vs IO-bound), per-queue concurrency, priorities, per-tenant fairness · timeouts, heartbeats/lease extension for long jobs · retries with backoff, max attempts, DLQ · graceful shutdown (stop fetching, finish or requeue in-flight) · job status API and progress · scale workers on queue depth/age (KEDA) · metrics: depth, oldest-job age, success/failure rate, runtime p99.
- Diagrams: stateDiagram-v2 of job states (queued → running → succeeded | retry_scheduled → dead); flowchart API → queue → worker pool with lease, ack, retry and DLQ paths.

### Circuit Breaker
`advance backend/theory/reliability/Circuit Breaker.md` · 168 lines · real 26 · depth 3 · POLISH
- Has: closed/open/half-open state diagram, fail-fast sequence diagram, payment-provider example, fallback examples.
- Problems: ~75% template; generic reliability interview bank; thresholds undefined (failure rate over what window, minimum volume?); no interplay with timeouts/retries; no Go library.
- Keep: state diagram; sequence diagram; fallback list; payment-provider example.
- New home: `10 Distributed Systems/Circuit Breaker`
- Must cover: cascading-failure mechanism (slow dependency → goroutines/connections pile up) · state machine with real config: failure-rate threshold (e.g., 50%) over a count- or time-based sliding window, minimum request volume, slow-call threshold, open duration, half-open probe count · what counts as failure (timeouts, 5xx, connection errors; not 4xx) · placement: per dependency/host; client-side vs service mesh (Envoy outlier detection) · interplay: timeout inside the breaker, retries inside it, never retry while open · fallbacks: cached/stale data, defaults, queue for later, hide the feature · Go implementation (sony/gobreaker or failsafe-go) with a test · metrics/alerts: state transitions, rejected calls · pitfalls: flapping, low-traffic endpoints · history: Hystrix (maintenance mode) → resilience4j.
- Diagrams: keep the stateDiagram with thresholds written on transitions; sequence diagram of a half-open probe succeeding and failing.

### Cron Jobs
`advance backend/theory/reliability/Cron Jobs.md` · 158 lines · real 8 · depth 1 · REWRITE
- Has: one-line definition; schedule → job → DB/logs diagram; uses; failure modes (overlapping runs, missed runs, timezone bugs, no idempotency).
- Problems: ~92% template; generic interview bank; overlaps Durable Job Scheduler and `golang backend/Go Cron Scheduled Jobs`; template grammar "when you need to scheduled cleanup".
- Keep: failure-mode list.
- New home: `09 Messaging & Async/Scheduled Jobs - Cron to Durable Schedulers` (absorbs Durable Job Scheduler)
- Must cover: cron syntax (`0 2 * * *`) and timezone/DST pitfalls (run in UTC; 02:30 local skipped or doubled) · OS cron vs in-process ticker vs Kubernetes CronJob (`concurrencyPolicy`, `startingDeadlineSeconds`, >100 missed schedules) vs EventBridge Scheduler · N replicas → N runs; fix with leader election/lock or one scheduler · overlap prevention for long runs · idempotent, checkpointed, resumable jobs · missed runs: catch-up vs skip policy · durable one-off scheduling ("remind at 9 am"): jobs table with `run_at` + `SKIP LOCKED` polling; Redis ZSET by timestamp; SQS delay (≤15 min); RabbitMQ delayed messages; Temporal timers · timing wheels for millions of timers · at-least-once execution → idempotent effect · dead-man's-switch monitoring (alert when a run does not happen) · Go: robfig/cron, River periodic jobs, asynq scheduler.
- Diagrams: flowchart scheduler → jobs table (index on run_at) → pollers with SKIP LOCKED → queue → workers; sequence diagram of 3 replicas racing for a lock where one runs.

### Dead Letter Queue
`advance backend/theory/reliability/Dead Letter Queue.md` · 158 lines · real 8 · depth 1 · REWRITE
- Has: one-line definition; queue → worker → done / DLQ diagram; failure modes (silent growth, no replay, no owner).
- Problems: ~92% template; generic interview bank; wrong-context link "Dead letter `[[Message Queue with Redis|queue]]`" (a generic concept linked to a Redis note); no broker mechanics.
- Keep: failure-mode phrase.
- New home: `09 Messaging & Async/Dead Letter Queues and Poison Messages`
- Must cover: poison message definition and why it blocks or loops · classify errors: transient → retry; permanent (validation, schema) → DLQ immediately · SQS redrive policy (`maxReceiveCount`) and DLQ redrive back to source · RabbitMQ dead-letter exchanges (reject/nack without requeue, TTL expiry, length limit) · Kafka has no native DLQ: retry topics with delays + dead-letter topic (`orders.retry.1m`, `orders.dlt`) · what to store: payload, headers, error, stack, attempt count, timestamps, consumer version · ordering impact (skipping one message breaks per-key order; park the key?) · alerts on DLQ depth/age; ownership and triage runbook · replay: fix → redrive in rate-limited batches into idempotent consumers · retention limits (SQS max 14 days) and archiving to S3.
- Diagrams: flowchart main topic → consumer → retry-1m → retry-10m → DLT → triage → replay; sequence diagram of an SQS receive count exceeding the max → DLQ.

### Durable Job Scheduler
`advance backend/theory/reliability/Durable Job Scheduler.md` · 154 lines · real 10 · depth 1 · MERGE→`09 Messaging & Async/Scheduled Jobs - Cron to Durable Schedulers`
- Has: one-line definition (future jobs that survive restarts); API → job store → scheduler → queue → worker → store diagram.
- Problems: ~89% template; generic interview bank; same scope as Cron Jobs; the distributed version is better as a case study.
- Keep: diagram skeleton.
- New home: `09 Messaging & Async/Scheduled Jobs - Cron to Durable Schedulers` (+ NEW `11 System Design/Case Study - Distributed Job Scheduler`)
- Must cover: see Cron Jobs.
- Diagrams: folded.

### Event Streaming
`advance backend/theory/reliability/Event Streaming.md` · 155 lines · real 11 · depth 1 · REWRITE
- Has: one-line definition (durable ordered log; Kafka/Pulsar/Redpanda); topic → partitions → consumer group + replay consumer diagram.
- Problems: ~89% template; generic reliability interview bank; no offsets, retention, replication, rebalancing, or ordering scope; overlaps Message Broker Comparison.
- Keep: diagram skeleton.
- New home: `09 Messaging & Async/Kafka and Event Streaming`
- Must cover: log vs queue (retention, replay, independent consumer groups) · topics, partitions, offsets; key → partition; ordering only within a partition · consumer groups: at most one consumer per partition; rebalancing (cooperative sticky, static membership, KIP-848 protocol) · offset commits (auto vs manual; commit after processing) → at-least-once · producer: batching/linger, compression, `acks=all`, idempotent producer · replication: leader/followers, ISR, `min.insync.replicas=2` with RF=3, unclean leader election · retention by time/size vs log compaction (latest value per key) · consumer lag as the key metric; sizing partition count · KRaft (ZooKeeper removed in Kafka 4.0), tiered storage · EOS transactions (link Delivery Semantics) · alternatives: Pulsar, Redpanda, Kinesis, Redis Streams · pointer to stream processing (Kafka Streams, Flink).
- Diagrams: flowchart producer → partitioned topic (leader/followers per partition) → two consumer groups at different offsets; sequence diagram of a consumer-group rebalance.

### Graceful Degradation
`advance backend/theory/reliability/Graceful Degradation.md` · 139 lines · real 11 · depth 1 · REWRITE
- Has: one-line definition; core vs optional dependency decision diagram.
- Problems: ~87% template; generic interview bank; no load shedding, kill switches, or static stability.
- Keep: the core/optional diagram.
- New home: `10 Distributed Systems/Load Shedding and Graceful Degradation`
- Must cover: classify features and dependencies as critical vs optional (checkout vs recommendations) · fallbacks: cached/stale data (`stale-if-error`), defaults, hidden component, do it later · kill switches/feature flags · load shedding: reject early with 429/503 + Retry-After before doing work; priority-based shedding (criticality tiers like Google's CRITICAL/SHEDDABLE; Netflix prioritized shedding) · adaptive concurrency limits (AIMD; Netflix concurrency-limits) · queue management: CoDel and adaptive LIFO (Facebook) · brownout / reduced-quality responses · static stability (AWS): keep serving with last-known-good config when the control plane fails · per-dependency timeouts and budgets · client behaviour (retry budgets, backoff) that avoids amplifying overload · testing with chaos/load tests; metrics: fallback rate, shed rate by priority.
- Diagrams: flowchart request → admission control (priority, concurrency limit) → handler with per-dependency fallbacks; sequence diagram of a recommendations timeout where the page still renders.

### Idempotency
`advance backend/theory/reliability/Idempotency.md` · 189 lines · real 26 · depth 2 · POLISH
- Has: definition, double-click/mobile-retry example, two idempotency-key sequence diagrams, where-to-use list.
- Problems: ~78% template; the check-then-insert diagram races (two concurrent retries both see "not exists"); no in-flight handling, request fingerprint, key TTL, or HTTP method semantics; four overlapping notes (`api design/Webhooks`, `api design/Webhook Processing`, `golang backend/Go Webhooks Idempotency`, Exactly Once Myth).
- Keep: payment double-click example; sequence diagrams (re-ordered to claim the key first); where-to-use list.
- New home: `05 APIs/Idempotency and Idempotency Keys` (the idempotent-consumer side links to 09 Delivery Semantics)
- Must cover: definition (same effect once or many times) vs "safe"; RFC 9110 idempotent methods (GET/PUT/DELETE) vs POST/PATCH · natural idempotency: PUT full state, conditional updates, unique business keys · `Idempotency-Key` header (IETF httpapi draft; Stripe) · key store: key, user/tenant, request hash, status (in_progress/done), response code/body, created_at · atomic claim via `INSERT … ON CONFLICT DO NOTHING` on a unique key, ideally in the same txn as the effect · concurrent duplicate while in progress → 409 or wait · same key with a different payload → 422 · replay the stored response, including errors · expiry (e.g., 24 h) and per-endpoint scope · propagate keys downstream (PSP idempotency keys) · idempotent webhooks/consumers (`event_id` unique) · Go middleware with a concurrency test.
- Diagrams: sequence diagram with three cases (first request; retry after completion; concurrent retry while in progress); stateDiagram of the key record (claimed → completed | failed-retryable).

### Message Broker Comparison
`advance backend/theory/reliability/Message Broker Comparison.md` · 157 lines · real 10 · depth 1 · REWRITE
- Has: one-line definition; producer → broker → 2 consumers diagram; 3-row table (Redis/BullMQ, RabbitMQ, Kafka).
- Problems: ~89% template; generic interview bank; "Redis/BullMQ | simple Node jobs" is the wrong ecosystem for a Go vault (Go: asynq, River); omits SQS/SNS, NATS, Pulsar, Redis Streams and the queue-vs-log distinction.
- Keep: nothing beyond the 3 rows (extend them).
- New home: `09 Messaging & Async/Queues vs Streams and Broker Comparison`
- Must cover: point-to-point queue vs pub/sub vs log/stream · push vs pull consumers; competing consumers · ack models: per-message ack + visibility timeout (SQS), ack/nack + prefetch (RabbitMQ), offset commit (Kafka) · ordering per system (SQS FIFO message groups, RabbitMQ per queue, Kafka per partition) · retention and replay (queue deletes on ack; log retains) · routing: RabbitMQ exchanges (direct/topic/fanout/headers), SNS → SQS fan-out · throughput, latency, ops burden, managed options · comparison table: Kafka, RabbitMQ (quorum queues, streams), SQS/SNS, Redis Streams / Lists / Pub-Sub (at-most-once), NATS JetStream, Pulsar · Go client libraries per broker · decision guide by use case (task queue, event bus, CDC stream, real-time fan-out).
- Diagrams: three small flowcharts (queue with competing consumers; pub/sub fan-out; partitioned log with two consumer groups at different offsets); comparison table.

### Reliability Content Table
`advance backend/theory/reliability/Reliability Content Table.md` · 96 lines · real 53 · depth 1 · DELETE
- Has: study order, 7 reliability questions, reliability flow diagram, InvoiceOps examples, webhook duplicate example, mistakes, 3 Q&As.
- Problems: nav note; its list mixes messaging, resilience and scheduling topics that belong in three folders.
- Keep: 7-question reliability checklist → 10 MOC; webhook duplicate example (DB update succeeds, response times out, provider retries) → Idempotency note.
- New home: `10 Distributed Systems/10 Distributed Systems MOC` (salvage only)
- Must cover: n/a.
- Diagrams: none.

### Retry and Backoff
`advance backend/theory/reliability/Retry and Backoff.md` · 169 lines · real 25 · depth 3 · POLISH
- Has: bad vs good retry, exponential + jitter diagrams, example policy, do-not-retry list.
- Problems: ~75% template; generic interview bank; additive "jitter = random 0-500ms" barely spreads retries once delays reach seconds; "do not retry permanent 4xx" needs the 408/429 exceptions; no timeouts/deadlines, retry budgets, or amplification.
- Keep: example policy (fix jitter); both diagrams; do-not-retry list (add 408/429 exceptions).
- New home: `10 Distributed Systems/Timeouts, Retries and Backoff`
- Must cover: transient vs permanent errors; retry only idempotent operations (link Idempotency) · timeouts first: connect/read/total, `context.WithTimeout`, deadline propagation (gRPC deadlines) · exponential backoff with a cap · jitter variants: full, equal, decorrelated (AWS Architecture Blog) and why full jitter wins · max attempts and retry budgets (retries ≤ ~10% of requests) · amplification across layers (3 layers × 3 attempts = 27×) → retry at one layer only · honouring `Retry-After` on 429/503; gRPC retryable codes (UNAVAILABLE; careful with DEADLINE_EXCEEDED) · hedged requests for tail latency ("The Tail at Scale") · interplay with circuit breakers and queues (visibility-timeout retries, delayed retry topics) · Go code with `context` and a fake-clock test · metrics: retry rate, attempts per success.
- Diagrams: flowchart of the backoff schedule showing each attempt's jitter range; sequence diagram of a synchronized retry storm vs jittered spread.

### WebSocket Scaling
`advance backend/theory/reliability/WebSocket Scaling.md` · 152 lines · real 9 · depth 1 · REWRITE
- Has: one-line definition; clients → LB → 2 WS servers ↔ Redis Pub/Sub diagram.
- Problems: ~90% template; generic reliability interview bank; overlaps `Api architecture/theory/WEBSOCKET.md` ("WebSocket scaling" section) and `golang backend/Go WebSocket Realtime`; misfiled under reliability.
- Keep: diagram skeleton.
- New home: `11 System Design/Scaling WebSockets`
- Must cover: per-connection cost (goroutine + buffers; fd limits; epoll libraries like gobwas/ws for ~1M connections) · load balancing long-lived connections (L4 vs L7, idle timeouts, skew after scale-out) · connection registry (user → gateway) in Redis · cross-node fan-out: Redis Pub/Sub (at-most-once) vs Redis Streams/Kafka/NATS · delivery: ack + resume from last message id on reconnect · heartbeats (ping/pong) and presence with TTL · reconnect storms after deploys: client backoff + jitter, staggered drain · graceful drain (close code, reconnect elsewhere) · auth at handshake (short-lived token) and per-message authz · slow clients: bounded send buffer, drop or close · SSE as the simpler one-way option · managed options (API Gateway WebSockets, Pusher, Ably) · metrics: connections per node, delivery latency, reconnect rate.
- Diagrams: flowchart of gateways + registry + pub/sub + message service; sequence diagram of reconnect with a resume token.

### Worker Architecture
`advance backend/theory/reliability/Worker Architecture.md` · 159 lines · real 9 · depth 1 · MERGE→`09 Messaging & Async/Background Jobs and Worker Pools`
- Has: one-line definition; API servers → Redis/RabbitMQ → workers diagram; failure modes (backlog, uneven concurrency, retry storms, lost acks).
- Problems: ~91% template; duplicate of Background Jobs.
- Keep: failure-mode phrase.
- New home: `09 Messaging & Async/Background Jobs and Worker Pools`
- Must cover: see Background Jobs.
- Diagrams: folded.

---

## performance

### Backpressure
`advance backend/theory/performance/Backpressure.md` · 154 lines · real 7 · depth 1 · REWRITE
- Has: one-line definition; producer → queue → "too full?" → slow/reject diagram.
- Problems: ~92% template; performance generic interview bank; no strategies or protocols.
- Keep: diagram idea.
- New home: `09 Messaging & Async/Backpressure and Flow Control`
- Must cover: unbounded queues hide overload until memory and latency explode (Little's Law: queue length = arrival rate × wait) · strategies: block the producer (bounded buffer), drop (newest/oldest/sample), spill to disk, reject upstream (429/503 + Retry-After), throttle at the source · Go: bounded channels, `select` with `default` to shed, semaphores · pull-based consumption (Kafka consumers, Reactive Streams `request(n)`) · credit/window flow control: TCP receive window, HTTP/2 and gRPC flow-control windows · broker signals: consumer lag, RabbitMQ prefetch and flow control, SQS in-flight limits · scaling consumers on lag (KEDA) vs shedding · propagating pressure end to end (don't absorb at one hop) · choosing per data type (metrics may drop; payments must block or queue durably).
- Diagrams: flowchart of a pipeline (ingest → bounded queue → workers) with block / drop / reject branches; sequence diagram of credit-based flow control (consumer grants N credits).

### Bottleneck Analysis
`advance backend/theory/performance/Bottleneck Analysis.md` · 155 lines · real 8 · depth 0 · REWRITE
- Has: one-line definition; request → API/DB/external/queue → "bottleneck?" box diagram.
- Problems: ~91% template; no method (USE/RED), no queueing theory, no worked example; overlaps `production debugging/Latency Debugging` and `Database Performance Debugging`.
- Keep: nothing (the Performance Engineering Content Table supplies the core).
- New home: `14 Observability & SRE/Performance Engineering and Bottleneck Analysis`
- Must cover: start from a target (SLO, p99, throughput) · latency vs throughput; percentiles and why averages lie; fan-out tail amplification (1 − 0.99^100 ≈ 63% of requests see a p99) · USE method (utilization, saturation, errors per resource) and RED (rate, errors, duration per service) · Little's Law and latency vs utilization (M/M/1 wait ∝ 1/(1−ρ): 90% busy → 10× service time) · Amdahl's law: speed up the dominant part · trace breakdown of one slow request · resource checks: CPU (pprof), memory/GC, DB (`pg_stat_statements`, locks), pools (wait counts), network · load testing to find the knee; coordinated omission (constant-arrival-rate tools: wrk2, k6) · usual culprits: N+1, missing index, pool exhaustion, lock contention, serialization, synchronous external calls · fix → re-measure → guard with alerts · worked example: InvoiceOps dashboard p99 1.8 s → 120 ms.
- Diagrams: flowchart of the investigation loop (SLO → measure → USE/RED → hypothesis → profile/trace → fix → verify); excalidraw latency-vs-utilization hockey-stick curve.

### Cache Stampede Avalanche Penetration
`advance backend/theory/performance/Cache Stampede Avalanche Penetration.md` · 179 lines · real 27 · depth 2 · MERGE→`08 Caching & Redis/Cache Stampede, Avalanche and Penetration`
- Has: three failure modes with fixes, two diagrams, short examples.
- Problems: ~75% template; performance interview bank; avalanche fix ignores the "cache tier down or cold" case; no mechanism for locks, stale-while-revalidate, or probabilistic early expiry; duplicates `redis/Caching Patterns and Types` (§Cache stampede protection + Q4); misfiled under performance.
- Keep: stampede/avalanche/penetration examples and fixes; the decision diagram (second mermaid).
- New home: `08 Caching & Redis/Cache Stampede, Avalanche and Penetration` (this note is the base; move the stampede section of Caching Patterns and Types here)
- Must cover: naming (stampede = thundering herd/dogpile; some sources call single-hot-key expiry "breakdown") · stampede math (10k RPS on a key with a 200 ms rebuild → ~2,000 DB queries) · in-process coalescing with Go `singleflight` · distributed rebuild lock (`SET lock NX PX`) while waiters serve stale · soft TTL / stale-while-revalidate and refresh-ahead · probabilistic early expiration (XFetch) · avalanche: TTL jitter, staggered warm-up, cache HA (replicas/cluster), rate limiting or circuit breaking in front of the DB, warm-up after failover · penetration: validate IDs, negative caching with short TTL, Bloom filter (false positives only; RedisBloom `BF.EXISTS`; rebuild on deletes or use a cuckoo filter) · link Hot Keys note · metrics: miss rate, DB QPS on misses, rebuild latency, lock waits · Go code: singleflight + stale fallback with a test.
- Diagrams: sequence diagram of a stampede vs a singleflight-coalesced rebuild; keep the decision flowchart; flowchart of a Bloom-filter-guarded lookup.

### Capacity Estimation
`advance backend/theory/performance/Capacity Estimation.md` · 172 lines · real 25 · depth 2 · POLISH
- Has: what-to-estimate list, correct DAU → RPS example (20M/day ≈ 231 avg, ≈2.3k peak), two flow diagrams.
- Problems: ~76% template; performance interview bank; only QPS is worked; no storage/bandwidth/cache/server math, unit table, or latency numbers; misfiled (system design skill).
- Keep: DAU → RPS example; "what to estimate" list; DAU → peak → sizing diagram.
- New home: `11 System Design/Back-of-the-Envelope Estimation`
- Must cover: powers of two and the unit ladder (KB → PB); 1 day ≈ 86,400 s ≈ 10^5 s shortcut · latency numbers (L1 ~1 ns, RAM ~100 ns, SSD read ~100 µs, same-DC round trip ~0.5 ms, cross-continent ~150 ms), linking 01 · QPS = DAU × actions / 86,400; peak factor 2–10×; read:write ratio · storage = objects/day × size × retention × replication (×3) + index overhead · bandwidth = QPS × payload (ingress and egress) · cache sizing (80/20: cache ~20% of the daily read set) · servers = peak QPS ÷ per-node QPS at 60–70% utilization; DB connections and IOPS · two full worked examples (URL shortener, chat) · rounding and sanity checks · common misses (peak, replication, metadata, growth) · when the numbers change the design (one Postgres vs sharding threshold).
- Diagrams: flowchart DAU → requests/day → avg QPS → peak QPS → servers/cache/storage/bandwidth; latency-numbers table.

### Hot Keys and Hot Partitions
`advance backend/theory/performance/Hot Keys and Hot Partitions.md` · 153 lines · real 6 · depth 1 · REWRITE
- Has: one-line definition; many requests → one hot key → Redis overloaded / split-replicate-key diagram.
- Problems: ~93% template; performance interview bank; topic is spread across Sharding Patterns (hot shard), Cassandra (hot partition), Caching Patterns (hot keys) and the consistent-hashing sample ("does not fix hot keys").
- Keep: diagram idea.
- New home: `11 System Design/Hot Keys and Hot Partitions` (one cross-cutting home for cache, DB and Kafka skew)
- Must cover: sources of skew: celebrity/viral content, flash-sale SKU, monotonic keys (timestamps, auto-increment), low-cardinality keys · why it hurts: a Redis shard executes commands on one thread; DynamoDB per-partition limits (3,000 RCU / 1,000 WCU); one Kafka partition = one consumer in a group · detection: `redis-cli --hotkeys` (LFU policy), per-shard metrics, DynamoDB Contributor Insights, per-partition lag · read fixes: in-process L1 cache with short TTL, key replication (`key#0..#N`, random read), read replicas, CDN, request coalescing · write fixes: write sharding/salting with aggregation on read (sharded counters), in-memory batching then flush, single-writer queue per key · partition fixes: composite or hashed keys, splitting hot partitions, adaptive capacity · Kafka hot partition from a skewed key: salting costs ordering · consistent hashing does not fix it (link) · real cases: like/view counters, ticket on-sales, celebrity posts.
- Diagrams: flowchart before/after (one shard melting vs suffix-replicated keys + L1 cache); sequence diagram of sharded-counter writes and an aggregated read.

### Performance Engineering Content Table
`advance backend/theory/performance/Performance Engineering Content Table.md` · 91 lines · real 48 · depth 1 · MERGE→`14 Observability & SRE/Performance Engineering and Bottleneck Analysis`
- Has: study order, 7 "senior engineer asks" questions, measure → fix → validate flow, InvoiceOps examples, mistakes, 3 Q&As.
- Problems: nav note; its content is a better core than Bottleneck Analysis itself.
- Keep: the 7 questions; performance flow diagram; `dashboard:{workspace_id}:summary` 30 s cache example; mistakes list (averages vs p99, cache without invalidation, unlimited concurrency).
- New home: `14 Observability & SRE/Performance Engineering and Bottleneck Analysis`
- Must cover: n/a (salvage).
- Diagrams: keep the performance flow diagram.

### Profiling
`advance backend/theory/performance/Profiling.md` · 154 lines · real 7 · depth 0 · MERGE→`04 Go Language/Profiling with pprof`
- Has: one-line definition; app → CPU/memory/trace → optimize diagram.
- Problems: ~92% template; no tooling at all in a Go vault; overlaps the pprof section of `golang backend/Go Benchmarking wrk h2load ghz pprof` and `production debugging/Memory Leak Debugging`.
- Keep: nothing.
- New home: `04 Go Language/Profiling with pprof`
- Must cover: sampling vs instrumentation profilers and their overhead · CPU profile (100 Hz sampling) · heap profile: `inuse_space` vs `alloc_space`, sampled every 512 KB · goroutine profile for leaks · block and mutex profiles (enable `SetBlockProfileRate` / `SetMutexProfileFraction`) · collecting: `net/http/pprof` (protect it), `go test -cpuprofile/-memprofile`, `runtime/pprof` · `go tool pprof`: top, list, peek, flame graph (`-http`), diff with `-base` · execution tracer (`go tool trace`) for scheduler/GC latency · reading flame graphs (width = time; on-CPU vs off-CPU) · PGO (`default.pgo`, Go 1.21+) · continuous profiling (Pyroscope/Grafana, Parca, eBPF) · worked example: JSON-encoding hot path found and fixed, with benchstat numbers.
- Diagrams: annotated flame-graph screenshot from a real run; flowchart of the loop (benchmark → profile → hypothesis → change → benchstat compare).

### Thread Pools and Blocking IO
`advance backend/theory/performance/Thread Pools and Blocking IO.md` · 157 lines · real 20 · depth 2 · POLISH
- Has: exhaustion diagram, "100 threads, 100 ms → 10 s" explanation, 7 fixes (timeouts, bulkheads, breakers, async IO, backpressure, pool limits).
- Problems: ~80% template; framed for thread-per-request runtimes: Go has no request thread pool, so the Go failure (goroutine pile-up, `sql.DB` and `http.Transport` waits) is never described; no Little's Law numbers.
- Keep: exhaustion diagram; interview explanation; fixes list.
- New home: `10 Distributed Systems/Bulkheads and Concurrency Limits` (rename; Go runtime internals link to 04)
- Must cover: thread-per-request (Tomcat default 200 threads) vs event loop (Node) vs Go's M:N scheduler (netpoller makes network I/O non-blocking; blocking syscalls hand off the P) · Little's Law sizing: in-flight = RPS × latency (1,000 RPS × 0.1 s = 100; at 10 s → 10,000) · how slow dependencies exhaust Go services: goroutines + memory, `sql.DB` pool waits, `http.Transport.MaxConnsPerHost`, file descriptors · bulkheads: per-dependency semaphores (`golang.org/x/sync/semaphore`, buffered channels), separate clients/pools · bounded worker pools and `errgroup.SetLimit` · timeouts everywhere (server Read/Write/Idle timeouts, client timeouts, context deadlines) · CPU-bound vs IO-bound sizing; GOMAXPROCS in containers (cgroup-aware default since Go 1.25) · adaptive concurrency limits · detection: goroutine count, pool wait metrics, `pprof` goroutine profile · contrast: Java virtual threads, Node event-loop blocking.
- Diagrams: sequence diagram of dependency slowdown → in-flight growth → pool exhaustion → health checks fail; flowchart with per-dependency bulkheads (payments pool vs recommendations pool).

---

## Area plan: databases, data modeling, messaging, distributed systems, system design (07 / 09 / 10 / 11, plus strays to 02 / 04 / 05 / 08 / 14 / 16)

Architecture changes proposed:
- The draft has no home for resilience patterns (timeouts, retries, circuit breaker, bulkheads, load shedding, graceful degradation). Rename `10 Distributed Systems` → `10 Distributed Systems & Resilience` and put them there.
- The draft lists the system design interview framework in both 11 and 19. Keep it in 11 (next to the case studies); 19 links to it.
- Replace the 7 content tables in this scope with one MOC per folder (07, 10, 11).
- Use InvoiceOps (`golang backend/InvoiceOps Golang Project Plan.md`) as the running example in all 07/09/10 rewrites; the generator already uses it consistently (schema, `webhook_events` unique key, dashboard cache key).

### New notes, ordered basic → advanced
02 Networking & Web
1. `02 Networking & Web/Nginx` · I · from: Nginx

04 Go Language
1. `04 Go Language/Profiling with pprof` · I · from: Profiling (+ pprof part of Go Benchmarking wrk h2load ghz pprof)

05 APIs
1. `05 APIs/Idempotency and Idempotency Keys` · I · from: Idempotency (+ webhook example from Reliability Content Table)

07 Databases
1. `07 Databases/SQL Essentials` · B · NEW (joins incl. anti-joins, GROUP BY/HAVING, window functions, CTEs incl. recursive, `INSERT … ON CONFLICT`, NULL semantics)
2. `07 Databases/SQL vs NoSQL` · B · from: SQL vs NoSQL
3. `07 Databases/Relational Schema Design` · B · from: Schema Design, Data Modeling Content Table
4. `07 Databases/Transactions and ACID` · B · from: Transactions
5. `07 Databases/Indexing Fundamentals` · B · from: Database Indexing (+ basics from Advanced Index Types)
6. `07 Databases/Storage Engines - B-tree vs LSM and WAL` · I · NEW (pages and buffer pool; B+tree in-place updates vs LSM memtable/SSTables/compaction; write/read/space amplification; WAL, checkpoints, fsync, group commit, crash recovery; Postgres/InnoDB vs RocksDB/Cassandra)
7. `07 Databases/Isolation Levels and MVCC` · I · NEW (dirty read, non-repeatable read, phantom, lost update, write skew (on-call doctors); RU/RC/RR/Serializable with Postgres and MySQL defaults; MVCC xmin/xmax snapshots, VACUUM, bloat, XID wraparound; InnoDB undo logs and next-key locks; SSI and 40001 retries)
8. `07 Databases/Locking - Optimistic vs Pessimistic` · I · from: Optimistic and Pessimistic Locking
9. `07 Databases/Query Plans and EXPLAIN` · I · from: Query Plans and EXPLAIN
10. `07 Databases/Index Types and Index Design` · I · from: Advanced Index Types
11. `07 Databases/N+1 Query Problem` · I · from: N Plus One Query Problem
12. `07 Databases/Connection Pooling` · I · from: Connection Pooling
13. `07 Databases/Zero-Downtime Schema Migrations` · I · from: Database Migration
14. `07 Databases/Backup, PITR and Disaster Recovery` · I · from: Backup and Restore
15. `07 Databases/Materialized Views and Denormalization` · I · from: Materialized Views
16. `07 Databases/NoSQL Data Modeling` · I · from: NoSQL Data Modeling
17. `07 Databases/Replication` · I · from: Database Replication
18. `07 Databases/Partitioning and Sharding` · A · from: Sharding Patterns, Database Sharding
19. `07 Databases/Consistent Hashing` · A · from: `00 Rebuild/Sample - Consistent Hashing` (replaces Consistent Hashing)
20. `07 Databases/Wide-Column Stores and Cassandra` · A · from: Cassandra and Wide Column Stores
21. `07 Databases/Search Engines and Inverted Indexes` · A · from: Search Architecture, Search Indexes
22. `07 Databases/Time-Series and Columnar Storage` · A · from: Time Series and Analytics Storage
23. `07 Databases/Distributed SQL` · A · NEW (ranges + Raft per range, TrueTime/HLC, cross-node serializable txns and their latency; Spanner, CockroachDB, YugabyteDB, TiDB, Aurora DSQL; when to choose over sharded Postgres)
24. `07 Databases/07 Databases MOC` · — · from: Database Content Table checklist, Data Modeling Content Table flowchart

08 Caching & Redis
1. `08 Caching & Redis/Cache Stampede, Avalanche and Penetration` · I · from: Cache Stampede Avalanche Penetration (+ stampede section of Caching Patterns and Types)

09 Messaging & Async
1. `09 Messaging & Async/Queues vs Streams and Broker Comparison` · B · from: Message Broker Comparison
2. `09 Messaging & Async/Event-Driven Architecture Basics` · B · NEW (events vs commands; event notification vs event-carried state transfer; choreography; event naming; pitfalls: hidden coupling, event spaghetti)
3. `09 Messaging & Async/Background Jobs and Worker Pools` · B · from: Background Jobs, Worker Architecture
4. `09 Messaging & Async/Delivery Semantics and Exactly-Once` · I · from: Exactly Once Myth
5. `09 Messaging & Async/Dead Letter Queues and Poison Messages` · I · from: Dead Letter Queue
6. `09 Messaging & Async/Scheduled Jobs - Cron to Durable Schedulers` · I · from: Cron Jobs, Durable Job Scheduler
7. `09 Messaging & Async/Backpressure and Flow Control` · I · from: Backpressure
8. `09 Messaging & Async/Message Ordering and Partition Keys` · I · NEW (global vs per-key ordering; Kafka keys; SQS FIFO message groups; ordering vs parallelism; sequence numbers/versions for out-of-order events; how retries break order)
9. `09 Messaging & Async/Transactional Outbox and CDC` · A · from: Outbox Pattern
10. `09 Messaging & Async/Kafka and Event Streaming` · A · from: Event Streaming
11. `09 Messaging & Async/Event Schemas and Schema Registry` · A · from: Schema Registry
12. `09 Messaging & Async/Workflow Engines and Durable Execution` · A · NEW (Temporal/Cadence: workflows vs activities, deterministic replay, durable timers, retries, sagas as code; Step Functions)
13. `09 Messaging & Async/Stream Processing Basics` · A · NEW (stateless vs stateful; event time vs processing time; tumbling/sliding/session windows; watermarks and late data; checkpoints; Kafka Streams vs Flink)

10 Distributed Systems (& Resilience)
1. `10 Distributed Systems/Distributed Systems Fundamentals` · B · NEW (8 fallacies; partial failure; a timeout cannot tell slow from dead; gray failure; crash-stop vs crash-recovery vs Byzantine models)
2. `10 Distributed Systems/Timeouts, Retries and Backoff` · B · from: Retry and Backoff
3. `10 Distributed Systems/Circuit Breaker` · B · from: Circuit Breaker
4. `10 Distributed Systems/CAP and PACELC` · B · from: CAP Theorem
5. `10 Distributed Systems/Bulkheads and Concurrency Limits` · I · from: Thread Pools and Blocking IO
6. `10 Distributed Systems/Load Shedding and Graceful Degradation` · I · from: Graceful Degradation
7. `10 Distributed Systems/Consistency Models` · I · from: Consistency Models
8. `10 Distributed Systems/High Availability and Failover` · I · from: High Availability and Failover
9. `10 Distributed Systems/Quorums and Leaderless Replication` · I · from: Quorum Reads and Writes
10. `10 Distributed Systems/Clocks and Ordering` · A · from: Clock Skew and Time
11. `10 Distributed Systems/Consensus - Raft and Paxos` · A · from: Consensus
12. `10 Distributed Systems/Leader Election` · A · from: Leader Election
13. `10 Distributed Systems/Distributed Locks and Fencing Tokens` · A · from: Distributed Locks
14. `10 Distributed Systems/Two-Phase Commit` · A · NEW (prepare/commit, coordinator log, blocking on coordinator failure, 3PC, XA, Postgres `PREPARE TRANSACTION`, 2PC over Paxos groups in Spanner/Percolator, why services use sagas)
15. `10 Distributed Systems/Saga Pattern` · A · from: Saga Pattern
16. `10 Distributed Systems/CQRS` · A · from: CQRS
17. `10 Distributed Systems/Event Sourcing` · A · from: Event Sourcing
18. `10 Distributed Systems/CRDTs and Conflict Resolution` · A · NEW (LWW vs multi-value vs merge; state- vs op-based CRDTs; G-Counter, PN-Counter, OR-Set, LWW-Register; sequence CRDTs for text (Yjs, Automerge); Redis Enterprise Active-Active, Riak)
19. `10 Distributed Systems/Failure Detection, Gossip and Membership` · A · NEW (heartbeats, phi-accrual, SWIM/memberlist, gossip dissemination, Merkle anti-entropy; Cassandra and Consul examples)
20. `10 Distributed Systems/Multi-Region Architecture` · A · from: Multi Region Architecture
21. `10 Distributed Systems/10 Distributed Systems MOC` · — · from: Reliability Content Table checklist

11 System Design
1. `11 System Design/System Design Fundamentals` · B · from: System Design introduction, System Design Content Table
2. `11 System Design/Scaling Basics` · B · from: Scaling Concepts
3. `11 System Design/Back-of-the-Envelope Estimation` · B · from: Capacity Estimation
4. `11 System Design/Load Balancing` · B · from: Load Balancer
5. `11 System Design/System Design Interview Framework` · B · from: How to Answer System Design, System Design Practice Content Table
6. `11 System Design/Unique ID Generation` · I · NEW (auto-increment limits; UUIDv4 vs UUIDv7 (RFC 9562, PG18 `uuidv7()`); ULID; Snowflake bit layout; Instagram's PL/pgSQL IDs; Flickr ticket servers; ID batches; clock rollback)
7. `11 System Design/Bloom Filters and Probabilistic Data Structures` · I · NEW (Bloom false-positive math and sizing (~9.6 bits/element for 1%); counting and cuckoo filters; HyperLogLog (Redis `PFADD`/`PFCOUNT`, 12 KB, ~0.81% error); Count-Min Sketch for heavy hitters; uses in LSM SSTables, cache penetration, crawler dedupe, unique visitors)
8. `11 System Design/Service Discovery` · I · NEW (client-side vs server-side; Consul, etcd, Kubernetes DNS + EndpointSlices; health checks; gRPC xDS); could live in 13
9. `11 System Design/Hot Keys and Hot Partitions` · A · from: Hot Keys and Hot Partitions
10. `11 System Design/Scaling WebSockets` · A · from: WebSocket Scaling
11. `11 System Design/Geospatial Indexing` · A · NEW (geohash precision and neighbour cells; quadtree; S2; H3 hexagons; Redis GEO; PostGIS + GiST; proximity queries)
12. `11 System Design/Case Study - URL Shortener` · B · from: Design URL Shortener
13. `11 System Design/Case Study - Rate Limiter` · B · NEW
14. `11 System Design/Case Study - Notification System` · I · from: Design Notification System
15. `11 System Design/Case Study - Key-Value Store` · I · NEW
16. `11 System Design/Case Study - Search Autocomplete` · I · NEW
17. `11 System Design/Case Study - News Feed` · I · from: Design News Feed
18. `11 System Design/Case Study - Chat System` · I · from: Design Chat System
19. `11 System Design/Case Study - Ticket Booking` · I · NEW
20. `11 System Design/Case Study - Leaderboard and Top-K` · I · NEW
21. `11 System Design/Case Study - Payment System` · A · from: Design Payment System
22. `11 System Design/Case Study - File Storage and Sync` · A · from: Design File Storage
23. `11 System Design/Case Study - Web Crawler` · A · NEW
24. `11 System Design/Case Study - Ride Sharing and Proximity` · A · NEW
25. `11 System Design/Case Study - Distributed Job Scheduler` · A · NEW (seeded by Durable Job Scheduler)
26. `11 System Design/Case Study - Metrics and Logging Platform` · A · NEW
27. `11 System Design/Case Study - Video Streaming` · A · NEW
28. `11 System Design/Case Study - Distributed Message Queue` · A · NEW (optional)
29. `11 System Design/Case Study - Ad Click Aggregation` · A · NEW (optional)
30. `11 System Design/11 System Design MOC` · — · from: System Design Content Table questions, Practice Content Table lesson table

14 Observability & SRE
1. `14 Observability & SRE/Performance Engineering and Bottleneck Analysis` · I · from: Bottleneck Analysis, Performance Engineering Content Table

16 Software Architecture
1. `16 Software Architecture/Monolith vs Microservices` · B · from: Monolith and Microservices (+ bbg `React/React Theory/mcroservise_monolith`)

### Gaps (topics missing entirely for complete coverage)
Vault-wide grep found zero mentions of: MVCC, write skew, phantom reads, vector clocks, Lamport clocks, CRDTs, PACELC, linearizability, HyperLogLog, Paxos, Little's Law. LSM, 2PC, geohash and Raft appear only in Excalidraw/LLD side notes.

07 Databases
- SQL essentials (joins, window functions, CTEs, upserts)
- Storage engines: B-tree vs LSM-tree, write/read/space amplification, compaction
- WAL / redo / undo, checkpoints, fsync, group commit, crash recovery
- Isolation anomalies (dirty read, non-repeatable read, phantom, lost update, write skew), MVCC internals (Postgres tuple versions, VACUUM/bloat, XID wraparound; InnoDB undo), SSI
- Deadlocks and InnoDB gap/next-key locks
- Distributed SQL / NewSQL
- Change data capture (Debezium) as a first-class idea (only mentioned in Search Architecture)

09 Messaging & Async
- Queue vs log fundamentals; push vs pull; ack/nack, visibility timeout, prefetch
- Message ordering and partition keys; consumer groups and rebalancing
- Event-driven architecture basics (events vs commands; notification vs event-carried state transfer)
- Inbox pattern / idempotent consumers as a named pattern
- Workflow engines / durable execution (Temporal): zero mentions in the vault
- Stream processing (windows, watermarks, stateful operators)
- SNS → SQS fan-out, priority queues, per-tenant fairness

10 Distributed Systems
- Fundamentals: fallacies, partial failure, gray failure, system models
- Failure detection (heartbeats, phi-accrual) and gossip/SWIM membership; Merkle-tree anti-entropy
- Two-phase commit / 3PC / XA and why it blocks
- Lamport clocks, vector clocks, HLC, TrueTime
- CRDTs
- Fencing tokens (only a phrase in the category template)
- Linearizability vs serializability
- Timeouts and deadline propagation; bulkheads; load shedding (resilience group)

11 System Design
- Unique ID generation (Snowflake, UUIDv7, ULID, ticket servers)
- Bloom filters, HyperLogLog, Count-Min Sketch
- Load-balancing algorithms beyond round robin (P2C, least-request, consistent/Maglev)
- Geospatial indexing (geohash, quadtree, S2, H3)
- Service discovery
- Real-time delivery comparison (short poll / long poll / SSE / WebSocket); exists only partly in `Api architecture/theory/WEBSOCKET`
- Batch vs stream pipelines; cell-based architecture and multi-tenancy at scale

Case studies missing (key deep dive, one line each)
- Rate limiter: token bucket vs sliding-window counter in Redis made atomic with a Lua script; local + global hybrid to save round trips; fail-open vs fail-closed when Redis is down; `RateLimit-*` and `Retry-After` headers (links `redis/Rate limiting with Redis` and the LLD note).
- Key-value store / distributed cache: consistent hashing with vnodes, N/R/W quorums, hinted handoff + Merkle anti-entropy, vector clocks vs LWW, gossip membership; cache variant adds eviction (LRU/LFU) and Redis Cluster slots.
- Unique ID generator (fold into the Unique ID Generation note): Snowflake 41-bit ms timestamp (~69 years) + 10-bit worker + 12-bit sequence (4,096 IDs/ms/worker), worker-id leasing from etcd, clock-rollback handling, k-sortable IDs vs UUIDv7.
- Search autocomplete: trie with top-k cached per prefix node vs Redis sorted set per prefix; offline aggregation of sampled query logs; CDN/browser caching of prefix responses; p99 < 100 ms.
- Web crawler: URL frontier with per-host politeness queues + priority, robots.txt, URL dedupe via Bloom filter, near-duplicate content via SimHash, host-hash partitioning across workers, crawler traps.
- Ride sharing / proximity: driver locations (every ~4 s) in an in-memory geospatial index (geohash/H3/quadtree) sharded by cell; dispatch that assigns exactly one driver (conditional update/lease); ETA; surge pricing (links LLD Delivery Partner Assignment).
- Ticket / seat booking (BookMyShow-style): seat hold with TTL (Redis `SET NX EX` or a `held_until` column) + `UNIQUE(show_id, seat_id)` / conditional update so double booking is impossible; virtual waiting room for on-sales; payment timeout releases holds; idempotent confirmation (links `LLD with Go/practice/Movie Ticket Booking LLD in Go`).
- Metrics and logging platform: agents → Kafka → TSDB; Gorilla compression, downsampling, retention tiers; high-cardinality label limits; query fan-out; alert evaluation; logs: index-everything (Elasticsearch) vs label-index-only (Loki) cost trade-off.
- Distributed job scheduler: durable job store partitioned by time bucket; pollers with `SKIP LOCKED`/leases; at-least-once execution + idempotency; heartbeats to detect dead workers and re-lease; retries/DLQ; cron evaluation at scale.
- Video streaming: upload → chunked transcoding DAG → HLS/DASH renditions → CDN (Open Connect-style); adaptive bitrate; storage tiers; view counting.
- Leaderboard / top-K: Redis ZSET (`ZINCRBY`, `ZREVRANGE`) for exact real-time ranks; Count-Min Sketch + heap for streaming heavy hitters over windows; sharding by score range.
- Distributed message queue (design Kafka, optional): partitioned append-only segments with offset index files, ISR replication, consumer offsets, retention and compaction.
- Ad click aggregation (optional): event-time windows, watermarks for late events, exactly-once via Flink checkpoints, reconciliation with a batch job (Lambda vs Kappa).
- Collaborative editor and digital wallet (optional, advanced): OT vs CRDT; event-sourced double-entry wallet.

### Delete list (with reason)
- `advance backend/theory/database/Database Content Table.md`: nav-only; its 7-question checklist moves to the 07 MOC.
- `advance backend/theory/system design/System Design Content Table.md`: nav-only; big-picture diagram and 7 questions move to the 11 MOC / SD Fundamentals.
- `advance backend/theory/distributed systems/Distributed Systems Content Table.md`: nav-only, linear chain of links, nothing to salvage.
- `advance backend/theory/reliability/Reliability Content Table.md`: nav-only; checklist → 10 MOC, webhook example → Idempotency.
- `advance backend/theory/database/Consistent Hashing.md`: superseded by `00 Rebuild/Sample - Consistent Hashing.md` (delete after promoting the sample).
- Removed by merge (no standalone file afterwards): Data Modeling Content Table, System Design Practice Content Table, Performance Engineering Content Table, Database Sharding, Search Indexes, Worker Architecture, Durable Job Scheduler, Cache Stampede Avalanche Penetration (becomes the 08 base), Profiling.

### Cross-area overlaps found
- Sharding: `system design/Database Sharding` + `database/Sharding Patterns` + `performance/Hot Keys and Hot Partitions` + `00 Rebuild/Sample - Consistent Hashing` (links old titles) → `07 Partitioning and Sharding`, `07 Consistent Hashing`, `11 Hot Keys and Hot Partitions`.
- Replication / HA: `system design/Database Replication`, `distributed systems/Quorum Reads and Writes`, `distributed systems/High Availability and Failover`, `distributed systems/Multi Region Architecture`, `aws/AWS RDS` (Multi-AZ, read replicas), `production debugging/SLO SLA SLI` (nines) → 07 Replication / 10 Quorums / 10 HA / 10 Multi-Region; AWS RDS links in.
- Search: `database/Search Architecture`, `data modeling/Search Indexes`, `rag/Semantic Search`, `rag/Vector Databases`, `rag/Vector Database Architecture` → 07 owns keyword + hybrid; 18 owns vector internals.
- Indexing and query performance: `database/Database Indexing`, `database/Advanced Index Types`, `database/Query Plans and EXPLAIN`, `production debugging/Database Performance Debugging` → 07 owns mechanics; 14 keeps the debugging playbook and links.
- Transactions / locking: `database/Transactions`, `data modeling/Optimistic and Pessimistic Locking`, `golang backend/Go Transactions and Repository Pattern`, `LLD with Go/Concurrency in Go LLD`, and LLD practice notes that use `FOR UPDATE`/`SKIP LOCKED` (Movie Ticket Booking, Parking Lot, Delivery Partner Assignment, Inventory Order Assignment, Library Management, Meeting Room Scheduler) → 07 owns concepts, 06 owns Go code, LLD notes link.
- Migrations: `database/Database Migration` vs `golang backend/Go Database Migrations` → 07 zero-downtime theory, 06 tooling.
- Connection pools: `database/Connection Pooling` vs `golang backend/Go Database SQL` → 07 sizing, 06 code.
- Jobs / workers / cron (8 notes): `reliability/Background Jobs`, `reliability/Worker Architecture`, `reliability/Cron Jobs`, `reliability/Durable Job Scheduler`, `golang backend/Go Worker Queues and Background Jobs`, `golang backend/Go Cron Scheduled Jobs`, `redis/Message Queue with Redis`, `golang backend/Go Redis Cache Queue Rate Limit` → two 09 concept notes + one 06 Go note + a Redis-as-queue section in 08.
- Brokers / streams: `reliability/Message Broker Comparison`, `reliability/Event Streaming`, `redis/Message Queue with Redis` (Queue vs Pub/Sub, BullMQ) → 09.
- Idempotency / webhooks / exactly-once (7+ notes): `reliability/Idempotency`, `distributed systems/Exactly Once Myth`, `distributed systems/Outbox Pattern`, `api design/Webhooks`, `api design/Webhook Processing`, `golang backend/Go Webhooks Idempotency`, `system design practice/Design Payment System`, plus `webhook_events(provider, event_id)` examples in Advanced Index Types, Data Modeling CT, Reliability CT → 05 Idempotency, 05 Webhooks, 09 Delivery Semantics, 09 Outbox, 06 Go code.
- Cache failure modes: `performance/Cache Stampede Avalanche Penetration`, `redis/Caching Patterns and Types` (§stampede + Q4), `redis/uses of redis` (hot-key line), the Redis category template question "How do you prevent stampede/hot keys?" in `redis/Message Queue with Redis` and `redis/Rate limiting with Redis` → 08.
- Rate limiting has no HLD note: `redis/Rate limiting with Redis`, `LLD with Go/practice/Rate Limiter LLD in Go`, `golang backend/Go Redis Cache Queue Rate Limit`, Nginx `limit_req` → NEW `11 Case Study - Rate Limiter` linking 08 algorithms and the 17 LLD.
- Notification: `system design practice/Design Notification System` vs `LLD with Go/practice/Notification System LLD in Go` (+ Excalidraw) → keep both (HLD vs LLD), cross-link.
- Ticket booking / logging / proximity HLDs (new) have LLD twins: `Movie Ticket Booking LLD in Go`, `Logging System LLD in Go`, `Delivery Partner Assignment LLD in Go`.
- File storage: `system design practice/Design File Storage`, `api design/File Upload Architecture`, `golang backend/Go File Uploads`, `aws/AWS S3`.
- WebSockets: `reliability/WebSocket Scaling`, `Api architecture/theory/WEBSOCKET` (§WebSocket scaling), `golang backend/Go WebSocket Realtime`, `system design practice/Design Chat System` → 05 protocol, 11 scaling, 06 Go code.
- Monolith / microservices: `system design/Monolith and Microservices`, `bytes GO complete thimh/React/React Theory/mcroservise_monolith`, `architecture patterns/Strangler Fig Pattern` → 16.
- Proxy / LB / gateway: `system design/Nginx`, `system design/Load Balancer`, `api design/Reverse Proxy vs Forward Proxy`, `api design/API Gateway` → 02 (proxies, Nginx), 11 (load balancing), 05 (gateway).
- Scaling: `system design/Scaling Concepts` vs `deployment/Autoscaling`.
- Performance: `performance/Bottleneck Analysis`, `performance/Profiling`, `production debugging/Latency Debugging`, `production debugging/Database Performance Debugging`, `production debugging/Memory Leak Debugging`, `golang backend/Go Benchmarking wrk h2load ghz pprof`, `testing strategy/Load Testing`, `bytes GO complete thimh/LAtency/what is latency` → 14 method, 04 pprof, 01 latency numbers, 15 load testing.
- Resilience: `reliability/Circuit Breaker`, `reliability/Retry and Backoff`, `golang backend/Go API Client External Calls` (timeouts/retry/circuit bullets) → 10 resilience group + 06 Go client code.
- Distributed locks: `distributed systems/Distributed Locks` vs `redis/uses of redis` (§Distributed lock) → 10 owns; 08 Redis use-case links.
- Schema evolution: `data modeling/Schema Registry` vs `golang backend/Go Proto Versioning Best Practices`, `golang backend/Go Protocol Buffers Deep Dive`, `api design/API Versioning`.
- Interview framework: How to Answer System Design + Practice CT + the SD-interview bank pasted into 21 notes + `sde3 roadmap/SDE3 Backend Roadmap`, `START HERE - Advanced Backend SDE3 Path`, `2026 SDE3 Gap Checklist`, `Grill Audit - SDE3 Backend Gaps` → one framework note in 11; 19 links.
- Wrong-context links (in scope): `reliability/Dead Letter Queue` L5 "Dead letter `[[Message Queue with Redis|queue]]`"; `system design/Scaling Concepts` L163 "Add `[[Message Queue with Redis|queue]]` for slow work" and L160 "Add `[[cache]]`" (resolves to the ByteByteGo data-structure memoization note, not system caching); `distributed systems/Outbox Pattern` related link to `Message Queue with Redis`; `reliability/WebSocket Scaling` "WebSocket `[[Scaling Concepts|scaling]]`" (auto-link noise).

### Factual errors found (quote → correction)
- `system design/Database Replication`: "Why it is used: … Keep backup copy of data." → A replica is not a backup: deletes, bad migrations and corruption replicate within milliseconds. Keep PITR backups, and optionally a delayed replica.
- `database/Transactions`: "If two users buy the last ticket at the same time, transaction isolation helps prevent overselling." → Not at default levels: under READ COMMITTED (Postgres default) a read-check-write transaction still oversells. Use a conditional `UPDATE … WHERE available > 0` and check rows affected, `SELECT … FOR UPDATE`, a unique constraint, or SERIALIZABLE with retry on 40001.
- `reliability/Idempotency` diagram: "API->>DB: key abc exists? … alt not exists → create payment + store key abc" → check-then-insert races (two concurrent retries both see "not exists" and both charge). Claim the key atomically first (`INSERT … ON CONFLICT DO NOTHING` on a unique key, status in_progress), then execute and store the response; return 409 or wait for in-flight duplicates.
- `system design practice/Design Payment System` sequence: "API->>PaymentProvider: Charge … API->>Ledger: Record transaction" (recorded after the charge) → persist the payment intent + idempotency key before calling the PSP and send the same key to the PSP; otherwise a crash or timeout after the charge leaves an untracked charge. Resolve "unknown" outcomes via PSP query, webhook or reconciliation.
- `data modeling/Schema Registry` diagram: "Producer --> Registry -->|valid schema| Topic" → the registry is not in the data path. Producers register or look up the schema, embed its ID (magic byte + 4-byte ID) in each record and write directly to Kafka; consumers fetch the schema by ID and cache it.
- `distributed systems/Quorum Reads and Writes`: "requires enough replicas to agree before read/write succeeds" → replicas only acknowledge or respond; no agreement protocol runs (that is consensus). R + W > N gives overlap, not linearizability (sloppy quorums, concurrent writes, LWW with clock skew, partially failed writes).
- `distributed systems/Distributed Locks`: "Lock must have TTL, owner value, and safe unlock check." → necessary, not sufficient: a holder paused past its TTL (GC, network) can still write after another client acquires the lock. Correctness needs fencing tokens checked by the protected resource or a consensus-backed lease. The diagram also gives both workers the same literal `value`; the owner value must be unique per acquirer.
- `reliability/Message Broker Comparison`: "Redis/BullMQ | simple Node jobs" → BullMQ is a Node.js library; for a Go stack the equivalents are asynq (Redis) and River (Postgres).
- `system design/Nginx`: "Reverse proxy to Node/Express backend" and `server app1:3000;` → wrong stack for this vault; proxy a Go service.
- `reliability/Retry and Backoff`: "jitter = random 0-500ms" → additive 0–500 ms jitter barely de-correlates once delays reach seconds; use full jitter `sleep = rand(0, min(cap, base·2^n))`. "Do not retry … permanent 4xx errors" → 408 and 429 are retryable (honour `Retry-After`).
- `database/Database Content Table` and `data modeling/SQL vs NoSQL` decision flows: "Need transactions? yes → SQL / no → NoSQL" → MongoDB (multi-document since 4.0) and DynamoDB (`TransactWriteItems`) support transactions; choose by access pattern, relationships/joins, consistency and scale.
- `database/Advanced Index Types`: "Bad query for this index: `WHERE status = ?` because it skips the leftmost column." → usually right, but PostgreSQL 18's B-tree skip scan (and MySQL 8.0.13+ / Oracle skip scan) can use the index when the leading column has few distinct values.
- `database/Cassandra and Wide Column Stores` table: "avoid for | simple relational CRUD? no, SQL better | joins/ad-hoc queries" → garbled. Should read: Postgres: avoid for massive multi-region append-only write volume; Cassandra: avoid for joins, ad-hoc queries, multi-row transactions.
- `system design/Database Sharding`: "Shard 1: user ID 1 to 1,000,000 …" → with auto-increment IDs every new user lands on the newest range, which is the hot-shard problem the note warns about later; say so or hash the ID.
- `performance/Cache Stampede Avalanche Penetration`: "Avalanche: Many keys expire at same time. Solution: random TTL jitter, stagger expiry" → incomplete: avalanche also covers the cache tier itself failing or restarting cold; add replicas/HA, rate limiting or circuit breaking in front of the DB, and warm-up.
- `distributed systems/CQRS` diagram (WriteModel → Events → ReadModel) → CQRS needs neither events, a broker nor event sourcing; read models can be updated in the same transaction, via CDC, or be separate query code over the same database.
- `distributed systems/Saga Pattern` examples (charge, then reserve stock) → order steps compensatable → pivot → retriable (reserve inventory, then capture payment, then ship) so a stock-out never needs a refund.
- `database/Database Indexing` diagram "B-tree index → Row pointer → User row" → true for Postgres heap tables; InnoDB secondary indexes store the primary key and need a second lookup in the clustered index.
- `performance/Thread Pools and Blocking IO` framing → Go has no request thread pool; the equivalent failure is goroutine pile-up plus waits on `sql.DB` and `http.Transport` pools.
- Interview-bank mismatches (whole categories): CAP Theorem, Consistent Hashing, Backup and Restore etc. carry "How would you debug this if the database is slow?"; all 8 data-modeling notes and all system-design component notes carry "What is the first thing you ask?" (an SD-interview bank), so their Q&A sections answer questions about other topics.

### Owner content worth preserving
- No owner-handwritten text, screenshots or Excalidraw in these 74 notes; everything is generator output.
- Whole note to promote: `00 Rebuild/Sample - Consistent Hashing.md` (already at the target quality bar).
- Correct, specific generator content to carry over:
  - InvoiceOps running example: entity chain, index checklist, `webhook_events(provider, event_id)` unique key, `dashboard:{workspace_id}:summary` cache key, list-API index `(workspace_id, status, due_date DESC, id)`.
  - Advanced Index Types: type tables, "indexes for reliability" table, 8-step index design.
  - Cassandra: day-bucketed DDL, consistency-level table, failure modes.
  - Sharding Patterns: when-to-shard ladder, strategy/routing tables, 6-step rebalancing.
  - Search Architecture: search-type table, "when to add a search engine", search-security list.
  - Time Series: three tables, rollups, retention.
  - Connection Pooling: 10 × 50 > 100 connection-budget example.
  - Capacity Estimation: DAU → RPS worked example.
  - HA: nines table.
  - Diagrams worth reusing: Circuit Breaker state + sequence, Saga sequences (re-ordered), Outbox sequence, Quorum overlap, Retry/backoff, Thread Pools exhaustion, Idempotency (fixed), Transactions commit/rollback.
  - Thread Pools "100 threads, 100 ms → 10 s" explanation; Payment must-have list and timeout failure case.
  - SD framework: 10-step flow, "what each problem teaches" table, 5 SD-interview Q&As (belong in the framework note).
