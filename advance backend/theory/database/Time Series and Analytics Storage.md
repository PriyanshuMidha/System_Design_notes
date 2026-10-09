# Time Series and Analytics Storage

## Complete notes

Time-series and analytics storage are used when the system needs to store and query large amounts of event or metric data over time.

## Use cases

- request metrics
- IoT readings
- audit/event streams
- payment event history
- monitoring dashboards
- business analytics
- clickstream data

## OLTP vs OLAP

| Type | Purpose | Example |
|---|---|---|
| OLTP | transactional app data | Postgres invoices/payments |
| OLAP | analytics/reporting | warehouse/dashboard aggregates |
| Time-series | metrics/events over time | Prometheus/TimescaleDB |

## Storage options

- Postgres partitioned tables
- TimescaleDB
- ClickHouse
- BigQuery/Snowflake/Redshift
- Prometheus for metrics
- object storage + lakehouse for raw events

## Choosing storage

| Data | Better storage | Reason |
|---|---|---|
| current invoices/payments | Postgres | transactions and constraints |
| request latency metrics | Prometheus | time-series metrics and alerting |
| audit events for product UI | Postgres partitioned table | simple query by workspace/time |
| large product analytics | ClickHouse/warehouse | fast aggregation over huge history |
| raw event archive | object storage | cheap retention |

## InvoiceOps example

MVP can keep audit logs in Postgres.

Later analytics may need:

- monthly revenue aggregates
- webhook event volume
- reminder delivery stats
- invoice payment delay trends
- user activity events

## Partitioning by time

Large event tables are often partitioned by day/month:

```text
audit_logs_2026_10
audit_logs_2026_11
```

Benefits:

- faster date range queries
- easier retention/deletion
- smaller indexes per partition

## Metrics vs events vs logs

| Type | Example | Query |
|---|---|---|
| Metric | `http_requests_total{route="/invoices"}` | rate over time |
| Event | `invoice_paid` | user/business activity history |
| Log | error message with request id | debugging exact failure |

Do not put everything in one system. Metrics power alerts, events power analytics, logs power debugging.

## Rollups

Raw events are expensive to scan forever. Create rollups:

```text
daily_revenue_by_workspace
monthly_overdue_invoice_count
webhook_failures_by_provider_hour
```

Rollups can be updated by scheduled jobs or streaming consumers.

## Retention

Retention is a product and cost decision:

- keep raw request logs for 7-30 days
- keep audit logs for compliance as required
- keep aggregates longer than raw events
- delete partitions instead of row-by-row deletes

## Real-life example

Stripe-like dashboards need current payment state and historical analytics. The payment itself belongs in OLTP. The revenue chart can be a rollup table or analytics store. Keeping both in the same transactional query path eventually hurts the core payment flow.

## Common mistakes

- running heavy analytics on primary OLTP database
- no retention policy
- no partitioning for huge event tables
- metrics stored without labels/tags discipline
- high-cardinality labels in monitoring systems

## Interview bank

### 1. When do you move analytics out of OLTP?

When analytical queries slow down transactional workloads or need scans/aggregations over large historical data.

### 2. Why partition time-series data?

It improves query pruning, retention deletion, and index management.

### 3. What should stay in OLTP?

Current transactional state: users, invoices, payments, clients, and active workflow records.

### 4. Why not run all dashboards on the primary database?

Dashboards often scan and aggregate lots of historical rows. On the primary DB, that can slow down writes and user-facing APIs. Use read replicas, rollups, partitioned tables, or OLAP storage depending on scale.

### 5. What is high-cardinality metrics problem?

High-cardinality labels, like `user_id` or `request_id`, create too many metric series and can overload monitoring storage. Use labels like route, status, service, and region; keep request-specific detail in logs/traces.
