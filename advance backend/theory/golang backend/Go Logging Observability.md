# Go Logging Observability

## Complete notes

Observability helps you understand what the Go service is doing in production.

## Three pillars

- logs: what happened
- metrics: how much/how often/how slow
- traces: where time went across services

## What to log

- request id
- method and path
- user/workspace id when safe
- status code
- latency
- error category
- payment/webhook event id
- job id for workers

## What not to log

- passwords
- full tokens
- secret keys
- card details
- sensitive personal data

## InvoiceOps metrics

- request latency
- error rate
- webhook duplicate count
- payment update failures
- reminder job retries
- invoice creation rate
- database query latency

## Common mistakes

- logging only plain strings
- no request id
- logging secrets
- no metrics for workers
- no trace across API and job processing

## Interview answer

For Go services, I use structured logs, request ids, metrics for latency/error/retry counts, and tracing for request-to-database or request-to-queue flows. Observability must cover workers too, not just HTTP.
