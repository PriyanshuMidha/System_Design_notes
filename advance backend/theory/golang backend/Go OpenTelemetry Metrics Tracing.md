# Go OpenTelemetry Metrics Tracing

## Why learn this

OpenTelemetry gives a standard way to collect traces, metrics, and logs from Go services.

## What to instrument

- HTTP requests
- database queries
- Redis calls
- worker jobs
- payment webhook processing
- external API calls

## Useful metrics

- request latency
- request count by status
- error rate
- database query latency
- webhook duplicate count
- worker retry count
- queue length

## Trace example

```text
POST /payments/webhooks/razorpay
  verify_signature
  db.check_webhook_event
  db.update_invoice
  queue.publish_invoice_status
```

## Common mistakes

- only logging errors, no metrics
- no request id correlation
- no worker instrumentation
- high-cardinality labels like raw user email
- tracing secrets or full payloads

## Connect to notes

- [[Observability Content Table]]
- [[Go Logging Observability]]
- [[Go Webhooks Idempotency]]

## Coding task

Add request duration metric and trace spans around webhook processing. Even if you start with logs only, design the span names now.
