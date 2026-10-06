# Go SQL NoSQL API Practice

## SQL

Use SQL for relational invoice data:

- users
- workspaces
- clients
- invoices
- payments

Good for joins, constraints, transactions, and reporting.

## NoSQL

Use NoSQL when flexible document structure or high-scale key/document access fits better.

Example optional use:

- webhook raw payload archive
- audit/event document store
- user preferences

## Course mentions SQL and NoSQL

For InvoiceOps, use Postgres/MariaDB-style SQL as primary. Add a MongoDB-style note/example only after the SQL core works.

## Coding task

Implement the same `AuditLogRepository` interface with:

1. SQL implementation
2. in-memory fake
3. optional MongoDB-style design note

## Connect

- [[Database Content Table]]
- [[Data Modeling Content Table]]
- [[Go Database SQL]]
