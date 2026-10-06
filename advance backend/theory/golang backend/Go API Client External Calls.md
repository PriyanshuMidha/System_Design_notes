# Go API Client External Calls

## What to build

InvoiceOps may call external APIs:

- payment provider
- email provider
- file storage
- SMS/WhatsApp provider

## Rules for external calls

- use context timeout
- configure HTTP client timeout
- retry only safe operations
- add idempotency key where provider supports it
- log provider request id
- map provider errors to internal error categories
- never block DB transaction on slow external API unless absolutely required

## Common mistakes

- default HTTP client with no timeout
- retrying payment creation blindly
- leaking provider errors directly to user
- no circuit breaker/backoff for failing provider

## Connect to notes

- [[Reliability Content Table]]
- [[API Error Handling]]
- [[Go Context Package]]
- [[Go Webhooks Idempotency]]

## Coding task

Create an email client interface and fake implementation. Then add a real HTTP client shape with timeout, even if you do not call a real provider yet.
