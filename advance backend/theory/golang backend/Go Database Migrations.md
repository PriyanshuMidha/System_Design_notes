# Go Database Migrations

## Why learn this

Database schema changes must be versioned and repeatable.

## What to build

Create migrations for:

- users
- workspaces
- workspace_members
- clients
- invoices
- invoice_items
- payments
- webhook_events
- audit_logs

## Migration rules

- migrations are committed
- each migration has up/down if tool supports it
- avoid destructive changes without backfill plan
- add indexes for common filters
- use transactions where possible

## InvoiceOps indexes

```text
clients(workspace_id)
invoices(workspace_id, status)
invoices(workspace_id, due_date)
payments(invoice_id)
webhook_events(provider, event_id) unique
audit_logs(workspace_id, created_at)
```

## Connect to notes

- [[Database Indexing]]
- [[Data Modeling Content Table]]
- [[Go Database SQL]]

## Coding task

Pick a migration tool, add initial schema, and write repository tests against a test database.
