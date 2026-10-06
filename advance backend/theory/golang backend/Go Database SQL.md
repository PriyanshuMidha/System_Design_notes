# Go Database SQL

## Complete notes

Go's standard database entry point is `database/sql`. It works with drivers for Postgres, MySQL, SQLite, SQL Server, and others.

`sql.DB` is not a single connection. It represents a pool of database connections.

## Query example

```go
row := db.QueryRowContext(ctx, `
    SELECT id, status, total
    FROM invoices
    WHERE id = $1 AND workspace_id = $2
`, id, workspaceID)
```

## Safe SQL rules

- use query parameters, not string concatenation
- pass context to queries
- check `sql.ErrNoRows`
- close rows
- scan into explicit fields
- set connection pool limits
- use transactions for multi-step writes

## Connection pool knobs

- max open connections
- max idle connections
- max connection lifetime
- max idle time

## Common mistakes

- SQL injection by string concatenation
- forgetting `rows.Close()`
- treating `sql.DB` as one connection
- no indexes for common filters
- no context timeout for queries
- returning raw SQL errors to clients

## Interview answer

I use `database/sql` or a thin helper with parameterized queries, context-aware methods, explicit transactions, connection pool tuning, and indexes for production query paths.
