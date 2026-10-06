# Go Error Handling

## Complete notes

Go handles normal failure through explicit `error` return values.

## Basic pattern

```go
invoice, err := svc.GetInvoice(ctx, id)
if err != nil {
    return err
}
```

## Wrapping errors

```go
return fmt.Errorf("create invoice: %w", err)
```

Wrapping keeps context while allowing `errors.Is` and `errors.As`.

## Backend error categories

- validation error: client sent bad input
- authentication error: user is not logged in
- authorization error: user cannot access resource
- not found error: resource does not exist
- conflict error: duplicate or invalid state transition
- dependency error: database/payment/email failed
- internal error: unknown backend failure

## HTTP mapping

| Error | HTTP |
|---|---|
| validation | 400 |
| unauthenticated | 401 |
| forbidden | 403 |
| not found | 404 |
| conflict | 409 |
| rate limited | 429 |
| internal | 500 |

## Common mistakes

- ignoring errors with `_`
- returning raw database errors to clients
- losing context by returning only `err`
- using panic instead of returning errors
- inconsistent error response shapes

## Interview answer

In Go backend code, I create domain-level errors, wrap lower-level errors for logs, map errors to stable HTTP responses at the edge, and avoid leaking internal details to clients.
