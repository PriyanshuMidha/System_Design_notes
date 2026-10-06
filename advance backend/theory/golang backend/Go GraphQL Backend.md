# Go GraphQL Backend

## Why learn this

GraphQL is useful when the frontend needs flexible nested data. Do not use it just because it is popular.

## What to build

Optional InvoiceOps dashboard GraphQL API:

```graphql
query {
  dashboard {
    totalPaid
    totalOverdue
    recentInvoices {
      id
      clientName
      status
      total
    }
  }
}
```

## Go libraries

Common Go GraphQL libraries include `gqlgen` and `graphql-go`. For serious typed schema-first work, `gqlgen` is common.

## Production checklist

- query depth limit
- query complexity limit
- resolver timeout
- DataLoader/batching for N+1 prevention
- object-level authorization
- schema versioning/deprecation
- metrics per resolver

## Common mistakes

- frontend can ask for unlimited nested data
- N+1 database queries
- auth only at endpoint level, not object/field level
- no persisted queries for public clients

## Connect to notes

- [[GRAPHQL]]
- [[Go Database SQL]]
- [[Go Security for Backend]]
- [[API Design Content Table]]

## Coding task

Keep InvoiceOps main write APIs as REST. Add one read-only GraphQL endpoint for dashboard data so you can compare REST vs GraphQL.
