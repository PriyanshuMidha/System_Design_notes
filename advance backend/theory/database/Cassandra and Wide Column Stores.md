# Cassandra and Wide Column Stores

## Complete notes

Cassandra is a distributed wide-column database designed for high write throughput, horizontal scaling, and high availability. It is not a relational database and does not support joins like SQL.

## Mental model

In Cassandra, design tables around queries, not around normalized entities.

Important terms:

- keyspace: namespace and replication settings
- table: query-specific storage shape
- partition key: decides which node stores the data
- clustering columns: sort rows inside a partition
- replication factor: number of copies
- consistency level: how many replicas must respond

## Primary key

```sql
PRIMARY KEY ((workspace_id), due_date, invoice_id)
```

- `workspace_id` is partition key
- `due_date` and `invoice_id` are clustering columns

Better high-volume version:

```sql
PRIMARY KEY ((workspace_id, bucket_day), created_at, event_id)
```

Why add `bucket_day`? Without bucketing, one workspace can create a huge partition. Bucketing keeps partitions bounded.

## Query-first modeling

If you need these queries:

```text
list invoices by workspace and due date
list payments by invoice
list audit logs by workspace and time
```

You may create separate tables for each query. Duplication is normal.

Example tables:

```sql
CREATE TABLE audit_events_by_workspace_day (
  workspace_id text,
  bucket_day date,
  created_at timestamp,
  event_id text,
  actor_id text,
  action text,
  payload text,
  PRIMARY KEY ((workspace_id, bucket_day), created_at, event_id)
) WITH CLUSTERING ORDER BY (created_at DESC);
```

This table answers:

```text
Give me latest audit events for workspace X on day Y.
```

It does not answer arbitrary searches by `actor_id` unless you create another table for that query.

## Consistency levels

| Level | Meaning | Tradeoff |
|---|---|---|
| ONE | one replica responds | fastest, weaker consistency |
| QUORUM | majority responds | balanced consistency/latency |
| ALL | all replicas respond | strongest, slowest, least available |

With replication factor 3, `QUORUM` usually means 2 replicas. A common interview formula is:

```text
read consistency + write consistency > replication factor
```

This gives stronger read-after-write behavior, but increases latency and failure sensitivity.

## Wide-column vs document vs relational

| Need | Best fit |
|---|---|
| ACID transaction for invoice/payment | Postgres |
| flexible nested document per user preference | MongoDB |
| huge append-only events by known key/time | Cassandra |
| full-text relevance search | OpenSearch/Elasticsearch |
| semantic similarity search | vector DB |

## Production failure modes

- hot partition from bad partition key
- unbounded partition growth
- tombstone buildup after many deletes/TTL expiry
- read repair/compaction pressure
- inconsistent reads with weak consistency levels
- data duplication causing update fanout bugs
- using secondary indexes for high-cardinality production queries

## Real-life example

Think of a food delivery app tracking driver locations every few seconds. A relational DB may struggle at massive write volume. Cassandra can store location events by driver/day/time, but you must know the query first, such as "latest locations for driver X today." It is not for random ad-hoc analytics.

## Cassandra vs SQL

| Topic | SQL/Postgres | Cassandra |
|---|---|---|
| modeling | normalized + joins | query-based denormalized tables |
| transactions | strong multi-row support | limited/lightweight transactions |
| scaling | vertical + replicas + partitioning | horizontal by design |
| best for | relational consistency | massive writes/availability |
| avoid for | simple relational CRUD? no, SQL better | joins/ad-hoc queries |

## When Cassandra is useful

- event logs
- time-series writes
- IoT data
- high-volume append-only activity
- multi-region high availability
- write-heavy workloads

## InvoiceOps use

Do not use Cassandra for MVP core invoices/payments. Use Postgres.

Possible future use:

- high-volume audit events
- click/activity tracking
- notification delivery logs

## Common mistakes

- modeling Cassandra like SQL
- expecting joins
- using low-cardinality partition key
- creating huge partitions
- querying without partition key
- ignoring consistency level tradeoffs

## Interview bank

### 1. Why does Cassandra data modeling start from queries?

Because Cassandra is optimized for partition-key based reads and does not support joins. Tables must be designed to answer known queries efficiently.

### 2. What is a hot partition?

A partition receiving too much traffic or storing too much data, causing one node to become overloaded.

### 3. When would you not use Cassandra?

For relational workflows requiring joins, constraints, and strong multi-row transactions, such as core InvoiceOps invoices/payments.

### 4. How do you choose a Cassandra partition key?

Choose a key that matches the required query, spreads traffic across nodes, and keeps partition size bounded. If one key can grow forever, add a time bucket or another distribution field.

### 5. Why is duplication normal in Cassandra?

Because Cassandra optimizes known queries, not joins. You create separate tables for separate access patterns and write duplicated data intentionally. The cost is more complex write/update logic.

## Sources

- Apache Cassandra data modeling: https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/data-modeling_logical.html
- Cassandra CQL DDL: https://cassandra.apache.org/doc/latest/cassandra/developing/cql/ddl.html
