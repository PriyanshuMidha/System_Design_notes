# Go Middleware

## Complete notes

Middleware wraps handlers to add cross-cutting behavior.

## Common middleware

- request id
- structured logging
- panic recovery
- authentication
- authorization
- rate limiting
- CORS
- body size limit
- metrics/tracing

## Simple shape

```go
func Logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // before
        next.ServeHTTP(w, r)
        // after
    })
}
```

## InvoiceOps example

`POST /invoices` should pass through request id, logging, auth, workspace authorization, and rate limit middleware before the handler creates an invoice.

## Common mistakes

- doing database business logic in middleware
- swallowing errors without logging
- putting auth after the handler
- not preserving request context
- panicking without recovery/logging

## Interview answer

Middleware is for repeated request concerns around handlers. I keep it small and predictable: auth, logging, rate limit, metrics, recovery, and request metadata.
