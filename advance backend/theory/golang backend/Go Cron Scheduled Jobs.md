# Go Cron Scheduled Jobs

## What to build

Scheduled jobs for InvoiceOps:

- mark invoices overdue
- send due soon reminders
- retry failed reminder jobs
- cleanup expired refresh tokens
- reconcile pending payments

## Simple approach

Start with a ticker:

```go
ticker := time.NewTicker(1 * time.Minute)
defer ticker.Stop()
for {
    select {
    case <-ctx.Done():
        return
    case <-ticker.C:
        runJob(ctx)
    }
}
```

## Production checklist

- avoid duplicate job execution across multiple replicas
- use locks or a scheduler
- make jobs idempotent
- log job id/start/end/error
- expose job metrics
- handle graceful shutdown

## Connect to notes

- [[Go Worker Queues and Background Jobs]]
- [[Reliability Content Table]]
- [[Observability Content Table]]

## Coding task

Create an overdue scanner that runs every minute locally and updates invoices whose due date has passed.
