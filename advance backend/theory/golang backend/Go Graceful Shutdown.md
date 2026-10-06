# Go Graceful Shutdown

## Why learn this

Production services must stop cleanly during deploys, restarts, and crashes.

## What should happen

When the process receives shutdown signal:

1. stop accepting new HTTP requests
2. allow in-flight requests to finish for a short timeout
3. stop workers from taking new jobs
4. finish or requeue current jobs
5. close database/redis connections
6. flush logs/traces if needed

## Go tools

- `os/signal`
- `context.WithTimeout`
- `http.Server.Shutdown`
- worker cancellation through context

## Common mistakes

- using `ListenAndServe` without shutdown handling
- killing workers mid-job
- no timeout, so shutdown hangs forever
- not propagating context cancellation

## Connect to notes

- [[Go HTTP Server]]
- [[Go Worker Queues and Background Jobs]]
- [[Deployment Strategies Content Table]]

## Coding task

Add graceful shutdown to InvoiceOps API and worker process. Test by starting server and stopping it with Ctrl+C.
