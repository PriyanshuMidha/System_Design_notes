# Go Context Package

## Complete notes

`context.Context` carries cancellation, deadlines, and request-scoped values across API boundaries.

In backend services, every request should have a context. Pass it from handler to service to repository to external calls.

## Example

```go
func (s *InvoiceService) Get(ctx context.Context, id string) (Invoice, error) {
    return s.repo.FindByID(ctx, id)
}
```

## What context is for

- cancel work when client disconnects
- enforce request timeout
- pass request id or trace id carefully
- stop database/external calls when deadline expires

## What context is not for

- not for optional function parameters
- not for storing big objects
- not for passing business data everywhere
- not for hiding dependencies

## Production example

If an invoice export request takes too long and the client disconnects, the context can cancel database queries and file generation so the server does not waste CPU.

## Common mistakes

- using `context.Background()` inside request logic
- not passing context to SQL queries
- storing user models or database handles in context
- ignoring cancellation in goroutines

## Interview answer

Context lets the request lifecycle control downstream work. I pass it through every blocking operation and use deadlines/timeouts to avoid stuck requests and resource leaks.
