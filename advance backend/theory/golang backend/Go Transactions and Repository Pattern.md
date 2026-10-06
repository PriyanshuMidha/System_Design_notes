# Go Transactions and Repository Pattern

## Complete notes

Use transactions when multiple database changes must succeed or fail together.

## InvoiceOps transaction example

When a payment webhook arrives:

1. insert webhook event id for idempotency
2. insert payment record
3. update invoice paid amount
4. update invoice status
5. enqueue follow-up job or outbox event
6. commit

If any step fails, rollback.

## Transaction shape

```go
tx, err := db.BeginTx(ctx, nil)
if err != nil { return err }
defer tx.Rollback()

// execute statements with tx

if err := tx.Commit(); err != nil {
    return err
}
```

## Repository pattern

Repository hides SQL details from business logic.

Service should say:

```go
repo.CreateInvoice(ctx, invoice)
```

not:

```go
db.ExecContext(ctx, "INSERT ...")
```

## Common mistakes

- forgetting rollback
- doing network calls inside DB transactions
- making transactions too long
- hiding all database behavior behind vague `Save()` methods
- no idempotency table for webhook events

## Interview answer

Transactions protect invariants. I keep them short, avoid external calls inside them, use idempotency keys for retries/webhooks, and keep SQL in repositories so services stay focused on business rules.
