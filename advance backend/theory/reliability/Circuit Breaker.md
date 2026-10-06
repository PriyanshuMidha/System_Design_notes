# Circuit Breaker

## Complete notes

Circuit breaker stops calling a failing service for some time to protect the system.

## Easy explanation

A circuit breaker stops calling a failing dependency for a while so one bad service does not bring down everything.

In simple words: if you can explain `Circuit Breaker` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of keeping the product working even when dependencies fail or traffic spikes. This topic explains how to limit blast radius and recover safely.

For `Circuit Breaker`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Real-life examples

### Easy real-life example

If payment provider keeps failing, the app temporarily stops calling it and returns a controlled error.

### Difficult production example

A service uses closed/open/half-open states, fallback behavior, thresholds, timeout budgets, and alerts to prevent cascading failures.

### How to relate this topic

When reading `Circuit Breaker`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Circuit Breaker` must be understood through its production use case, not just its definition.
- When to use it: Focus on timeout, retry, backoff, jitter, circuit breaker, idempotency, DLQ, graceful degradation, backpressure, and recovery testing.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: SLO burn, error rate, p95/p99 latency, timeout count, retry count, queue age, DLQ size, and circuit breaker state.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Diagram

```mermaid

stateDiagram-v2
  [*] --> Closed
  Closed --> Open: too many failures
  Open --> HalfOpen: timeout
  HalfOpen --> Closed: success
  HalfOpen --> Open: failure
```

## Common mistakes

- Retrying forever or retrying non-idempotent operations.
- No timeout on network calls.
- No fallback or degraded mode for optional dependencies.
- Letting queue backlog grow without DLQ or alerting.
- Testing only the happy path and not failure recovery.

## Quick revision

Circuit breaker stops calling a failing service for some time to protect the system.

## Examples and deeper diagrams

### Real example

Payment provider is down. If every API server keeps calling it, threads/connections get stuck and whole app slows down.

Circuit breaker opens and fails fast.

```mermaid
sequenceDiagram
  participant API
  participant Breaker
  participant Payment
  API->>Breaker: call payment
  Breaker->>Payment: request
  Payment-->>Breaker: failures
  Breaker-->>API: open circuit
  API->>Breaker: next request
  Breaker-->>API: fail fast / fallback
```

### States

- Closed: normal traffic.
- Open: block calls for timeout.
- Half-open: send small test traffic.

### Fallback examples

- show "payment temporarily unavailable"
- queue request for later
- use cached result for read-only data


## Deep understanding checklist

To fully understand `Circuit Breaker`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on timeout, retry, backoff, jitter, circuit breaker, idempotency, DLQ, graceful degradation, backpressure, and recovery testing.

## Senior interview bank

These are topic-specific questions and strong answers for `Circuit Breaker`.

### 1. What is the failure this pattern prevents?

Name the exact failure: timeout, retry storm, overload, duplicate side effect, poison message, queue backlog, or dependency outage. Then explain how the pattern limits blast radius.

### 2. What is the fallback or degraded mode?

Critical flows should continue while optional features degrade. For example, checkout continues without recommendations, email is queued for later, and analytics can be dropped temporarily.

### 3. How do you avoid making failure worse?

Use timeouts, retry budgets, exponential backoff with jitter, circuit breakers, idempotency, backpressure, and DLQs. Never retry forever and never let optional work consume critical resources.

### 4. What should alert?

Alert on user-visible symptoms: high error rate, high latency, low success rate, queue age, DLQ growth, SLO burn, and dependency outage. Avoid paging on noisy internal signals unless they predict user impact.

### 5. How do you prove the recovery path works?

Test it with failure injection, staging drills, load tests, replay from DLQ, rollback exercises, and runbooks. A recovery path that was never tested is a guess.

## Topic-specific drill

### How would I answer `Circuit Breaker` if the interviewer asks directly?

For `Circuit Breaker`, I would explain the failure it protects against, how it limits blast radius, what fallback exists, and which SLO or queue/dependency metric should alert.

### What is the trap question for `Circuit Breaker`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Circuit Breaker` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
