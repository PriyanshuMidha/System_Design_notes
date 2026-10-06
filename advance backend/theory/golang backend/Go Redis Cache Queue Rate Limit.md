# Go Redis Cache Queue Rate Limit

## Why learn this

Redis appears in backend systems for caching, rate limiting, sessions, locks, queues, and pub/sub.

## What to build

In InvoiceOps:

- cache dashboard summary for 30 seconds
- rate limit login and webhook endpoints
- enqueue reminder jobs
- publish invoice status events for WebSocket fanout

## Cache example idea

```text
GET /dashboard/summary
check Redis key dashboard:{workspace_id}
if hit: return cached response
if miss: query DB, set Redis with TTL, return response
```

## Rate limit idea

Use Redis counters or token bucket style keys:

```text
rate:login:{ip}
rate:webhook:{provider}
```

## Queue idea

Use Redis list/stream for learning:

```text
reminder_jobs -> worker consumes -> send email -> update job status
```

## Production checklist

- TTL for cache keys
- cache invalidation after invoice/payment changes
- idempotent jobs
- retry count
- dead-letter queue
- rate limit by user, IP, workspace, or API key depending on endpoint

## Connect to notes

- [[redis Content table]]
- [[API Caching with Redis]]
- [[Rate limiting with Redis]]
- [[Message Queue with Redis]]
- [[Go Worker Queues and Background Jobs]]
- [[Go WebSocket Realtime]]

## Coding task

Implement Redis in three places: dashboard cache, login rate limit, and reminder queue.
