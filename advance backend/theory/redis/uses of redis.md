![[Pasted image 20260908160837.png]]

# uses of redis

## Complete notes

[[what is redis|Redis]] is useful when the backend needs very fast shared state.

## Easy explanation

Redis is useful when the backend needs very fast shared state.

In simple words: if you can explain `uses of redis` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of many backend servers needing one fast shared place for cache, counters, sessions, queues, or rate limits. This topic explains how Redis helps and what can break if Redis is misused.

For `uses of redis`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Main uses

### 1. Cache

Store repeated API/database results.

```text

GET product:123
if found in Redis -> return fast
else read DB -> store in Redis -> return
```

### 2. Session store

Store login/[[Sessions and Cookies|session]] data.

- Key: `session:userId`
- Value: token/session data
- TTL: expires automatically

### 3. Rate limiting

Count requests per user/IP/API key.

Example:

- `rate:user:42`
- Limit: 100 requests per minute
- Redis increments count and expires the key

### 4. Queue

Use Redis lists or streams for background work.

Examples:

- Send email later.
- Process uploaded image.
- Generate report.

### 5. Pub/Sub

Publish message from one service and receive it in another.

Good for real-time notifications and live updates.

### 6. Leaderboard

Sorted set stores users with score.

Example:

```text

ZADD leaderboard 500 priya
ZADD leaderboard 900 amit
```

### 7. Distributed lock

Use Redis to allow only one [[Worker Architecture|worker]] to do a job at a time.

## Diagram

```mermaid

flowchart TD
  Backend[Backend] --> Cache[Cache data]
  Backend --> Session[Session store]
  Backend --> Limit[Rate limit]
  Backend --> Queue[Queue jobs]
  Backend --> PubSub[Pub/Sub]
  Backend --> Rank[Leaderboard]
```

## Real-life examples

### Easy real-life example

A product page is opened many times, so the backend stores the product details in Redis for a short time instead of hitting the database every request.

### Difficult production example

During a sale, Redis handles cache, rate limits, idempotency keys, sessions, hot keys, TTL jitter, and queue-like workflows while avoiding cache stampede and Redis outage blast radius.

### How to relate this topic

When reading `uses of redis`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `uses of redis` must be understood through its production use case, not just its definition.
- When to use it: Focus on data structure choice, key design, TTL, atomicity, cache invalidation, hot keys, memory policy, cluster/replication, and Redis-down behavior.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: Redis latency, memory usage, evictions, hit rate, command rate, connection count, hot keys, and error rate.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Common mistakes

- Using Redis without a TTL or cleanup strategy.
- Creating hot keys that overload one shard/node.
- Assuming Redis is always available and not defining fail-open/fail-closed behavior.
- Doing non-atomic check-then-write logic without Lua/transactions where needed.
- Caching data without an invalidation or freshness strategy.

## Quick revision

Redis is best when data must be fast, shared across servers, and sometimes temporary.


## Deep understanding checklist

To fully understand `uses of redis`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on data structure choice, key design, TTL, atomicity, cache invalidation, hot keys, memory policy, cluster/replication, and Redis-down behavior.

## Senior interview bank

These are topic-specific questions and strong answers for `uses of redis`.

### 1. Which Redis structure would you choose for this topic?

Choose by access pattern: string for counters/cache, hash for grouped small fields, sorted set for ranking or sliding windows, stream for durable event processing, set for uniqueness, and Lua when multiple commands must be atomic.

### 2. What is the key and TTL design?

Keys should include scope and identity, for example `rate:tenant:123:user:456`. TTL should match freshness or quota window. Add jitter to cache TTLs to reduce stampedes.

### 3. What if Redis goes down?

Decide fail-open or fail-closed based on risk. For login abuse or payments, fail closed or degrade carefully. For optional recommendations, bypass Redis and serve a simpler response. Alert on latency, errors, evictions, and connection count.

### 4. How do you prevent stampede/hot keys?

Use TTL jitter, request coalescing, single-flight locks, early refresh, local cache for ultra-hot keys, and sharding/replication for load distribution.

### 5. What is the senior-level tradeoff?

Redis improves latency and shared coordination, but it can become load-bearing. If the database cannot survive a cache miss storm, the cache is not just an optimization; it is a reliability dependency that needs capacity planning and fallback.

## Topic-specific drill

### How would I answer `uses of redis` if the interviewer asks directly?

For `uses of redis`, I would explain the Redis data structure, key pattern, TTL, atomicity, failure mode if Redis is down, and the metric I would watch.

### What is the trap question for `uses of redis`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `uses of redis` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
