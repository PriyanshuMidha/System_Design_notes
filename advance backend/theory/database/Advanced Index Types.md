# Advanced Index Types

## Complete notes

An index is a data structure that speeds up reads by helping the database find rows/documents without scanning everything. Indexes improve reads but add storage and write cost.

## Main index types

| Index type | Best for | Example |
|---|---|---|
| Single-column | filtering by one field | `users(email)` |
| Composite/compound | filtering/sorting by multiple fields | `invoices(workspace_id, status, due_date)` |
| Unique | preventing duplicates | `users(email)` |
| Partial | indexing subset of rows | only active invoices |
| Covering | query served from index | index includes selected columns |
| Full-text | text search | documents/posts |
| Hash | equality lookup/sharding | hashed user id |
| Geospatial | location queries | nearby drivers/restaurants |
| Multikey/array | array fields in documents | tags, addresses |
| Vector index | similarity search | embeddings |

## PostgreSQL index access methods

PostgreSQL supports multiple index access methods. Do not say "index" as if every index behaves the same.

| Postgres index | Best for | Example |
|---|---|---|
| B-tree | equality, range, sort, most normal queries | `WHERE email = ?`, `ORDER BY created_at` |
| Hash | equality only | `WHERE token_hash = ?` |
| GIN | array/jsonb/full-text contains queries | `metadata @> ...`, tags |
| GiST | geometric/range/custom data types | overlaps, nearest-like searches |
| SP-GiST | partitioned search spaces | tries, spatial partitioning |
| BRIN | very large naturally ordered tables | logs ordered by timestamp |
| Bloom extension | many-column membership checks | wide tables with many optional filters |

Senior answer: choose the index based on query shape, not because one sounds faster.

## SQL composite index rule

For index:

```sql
CREATE INDEX idx_invoice_workspace_status_due
ON invoices(workspace_id, status, due_date);
```

Good queries:

```sql
WHERE workspace_id = ?
WHERE workspace_id = ? AND status = ?
WHERE workspace_id = ? AND status = ? ORDER BY due_date
```

Bad query for this index:

```sql
WHERE status = ?
```

because it skips the leftmost column.

## MongoDB examples

MongoDB supports single-field, compound, multikey, text, geospatial, and hashed indexes. Use compound indexes around real query patterns, not random fields.

## InvoiceOps indexes

```sql
CREATE UNIQUE INDEX users_email_uidx ON users(email);
CREATE INDEX clients_workspace_idx ON clients(workspace_id);
CREATE INDEX invoices_workspace_status_idx ON invoices(workspace_id, status);
CREATE INDEX invoices_workspace_due_idx ON invoices(workspace_id, due_date);
CREATE UNIQUE INDEX webhook_event_uidx ON webhook_events(provider, event_id);
CREATE INDEX audit_workspace_created_idx ON audit_logs(workspace_id, created_at DESC);
```

## Query plan thinking

Use `EXPLAIN` to check whether the database uses index scan, sequential scan, join strategy, and row estimates.

## How to design indexes step by step

1. List the top production queries by frequency and latency.
2. Separate point lookups, list screens, searches, reports, and background jobs.
3. For each query, write the `WHERE`, `JOIN`, `ORDER BY`, and `LIMIT`.
4. Put tenant/workspace key first for multi-tenant tables.
5. Put equality filters before range/sort fields.
6. Add unique indexes for business invariants and idempotency.
7. Run `EXPLAIN ANALYZE` on realistic data.
8. Remove unused indexes after observing production usage.

## Indexing list APIs

Example list endpoint:

```text
GET /workspaces/:workspace_id/invoices?status=overdue&sort=due_date&page=1
```

Good index:

```sql
CREATE INDEX invoices_workspace_status_due_idx
ON invoices(workspace_id, status, due_date DESC, id);
```

Why:

- `workspace_id` protects tenant isolation and narrows the scan
- `status` is equality filter
- `due_date` supports sorting/range
- `id` can stabilize cursor pagination

## Indexes for reliability

Indexes are not only for speed.

| Problem | Index solution |
|---|---|
| duplicate webhook processing | unique index on `(provider, event_id)` |
| duplicate user email | unique index on normalized email |
| idempotent payment request | unique index on `(workspace_id, idempotency_key)` |
| slow audit lookup | index on `(workspace_id, created_at DESC)` |

## Read/write tradeoff

Every extra index makes writes slower because the database must update the table and the index. In high-write systems, index only the queries that matter and measure write latency after adding indexes.

## Real-life example

If Amazon shows your past orders, it probably filters by account, sorts by date, and paginates. A useful index starts with `customer_id`, then order date. If it indexed only `status`, the database may still scan a huge number of rows.

## Common mistakes

- indexing every column
- missing composite index for real list filters
- wrong column order in composite indexes
- no unique index for idempotency
- indexing low-cardinality fields alone
- not checking query plans
- forgetting index write cost

## Interview bank

### 1. Why can too many indexes hurt?

Every insert/update/delete must update indexes. Too many indexes increase write latency, storage, and maintenance.

### 2. What is a covering index?

An index that contains all fields needed by a query, so the database can answer without reading the base table.

### 3. How do you choose index order?

Put equality filters and tenant keys first, then range/sort fields, based on the most important queries.

### 4. Why can an index still not be used?

The query may skip the leftmost columns, use a function that does not match the index, filter too many rows, have outdated statistics, or the planner may decide a sequential scan is cheaper. I would check `EXPLAIN ANALYZE`, table size, selectivity, and statistics.

### 5. What index would you add for idempotent webhooks?

I would store provider and provider event id, then add `UNIQUE(provider, event_id)`. The handler first inserts the event; if the insert conflicts, it returns success without reprocessing the side effect.

## Sources

- MongoDB index types: https://www.mongodb.com/docs/manual/core/indexes/index-types/
- PostgreSQL index types: https://www.postgresql.org/docs/18/indexes-types.html
