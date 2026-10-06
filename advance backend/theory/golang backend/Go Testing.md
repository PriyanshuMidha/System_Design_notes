# Go Testing

## Complete notes

Go has built-in testing with the `testing` package.

## Test types

- unit tests for services
- handler tests with `httptest`
- repository tests against test database
- integration tests for full flows
- race tests for concurrency
- fuzz tests for edge cases/security-sensitive parsing

## Unit test shape

```go
func TestCreateInvoice(t *testing.T) {
    // arrange
    // act
    // assert
}
```

## Handler testing

Use `net/http/httptest` to test API handlers without starting a real server.

## What to test in InvoiceOps

- invoice total calculation
- invoice status transitions
- webhook idempotency
- auth middleware
- validation errors
- repository queries
- reminder scheduling

## Common mistakes

- only testing happy paths
- tests depending on execution order
- using real external providers in tests
- not testing duplicate webhook delivery
- not running race tests for concurrent workers

## Interview answer

I test business logic with unit tests, HTTP handlers with `httptest`, repositories with integration tests, and concurrency-sensitive code with the race detector. For payment/webhook flows, idempotency tests are mandatory.
