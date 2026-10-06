# Database Replication

## Complete notes

Database replication means copying data from one database server to another.

## Easy explanation

Database replication means copying data from one database server to another.

In simple words: if you can explain `Database Replication` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of designing a backend system end to end. This topic explains where a component sits, why it is needed, what bottleneck it solves, and what tradeoff it introduces.

For `Database Replication`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Why it is used

- Improve read performance.
- Improve availability.
- Keep backup copy of data.
- Reduce load on primary database.

## Primary-replica model

Primary handles writes.
Replicas handle reads.

```mermaid

flowchart LR
  App[Backend app] --> Primary[(Primary DB - writes)]
  Primary --> R1[(Read replica 1)]
  Primary --> R2[(Read replica 2)]
  App --> R1
  App --> R2
```

## Read scaling

If app has many read requests, send reads to replicas.

Writes still go to primary.

## Replication lag

Replica may be slightly behind primary.

Example:

1. User updates profile.
2. Write goes to primary.
3. Replica receives update after small delay.
4. If app reads from replica immediately, old data may appear.

## Real-life examples

### Easy real-life example

You design a small app with users, API server, database, and cache.

### Difficult production example

You design a global service that needs load balancing, caching, replication, sharding, queues, observability, safe deployment, and clear tradeoffs.

### How to relate this topic

When reading `Database Replication`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Database Replication` must be understood through its production use case, not just its definition.
- When to use it: Focus on requirements, scale, APIs, data model, high-level architecture, bottleneck, failure mode, consistency, observability, and tradeoffs.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: QPS, p95 latency, availability, error rate, queue lag, cache hit rate, database latency, and saturation.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Common mistakes

- Listing components without explaining why they are needed.
- Ignoring bottlenecks and failure modes.
- No scale estimate or data model.
- No observability or rollback plan.
- Choosing tools without tradeoffs.

## Quick revision

Replication = copy same data to more DB servers, mostly to scale reads and improve availability.

## Deep revision

### Replication types

- Synchronous replication: write waits for replica confirmation.
- Asynchronous replication: primary responds first, replica catches up later.

### Read/write split

```mermaid

flowchart LR
  App[App] --> Write[Writes]
  Write --> Primary[(Primary DB)]
  App --> Read[Reads]
  Read --> Replica1[(Replica 1)]
  Read --> Replica2[(Replica 2)]
  Primary --> Replica1
  Primary --> Replica2
```

### Replication lag example

User updates profile and immediately refreshes page.
If read goes to lagging replica, old name may appear.

### Solutions

- Read your own writes from primary.
- Monitor lag.
- Use sticky read for recently updated user.
- Design UI to tolerate slight delay.

### Key point

Replication mostly helps read [[Scaling Concepts|scaling]] and availability, not write scaling.


## Deep understanding checklist

To fully understand `Database Replication`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on requirements, scale, APIs, data model, high-level architecture, bottleneck, failure mode, consistency, observability, and tradeoffs.

## Senior interview bank

These are topic-specific questions and strong answers for `Database Replication`.

### 1. What is the first thing you ask?

Clarify requirements: users, core features, read/write ratio, scale, latency, availability, consistency, geography, security, and what is explicitly out of scope.

### 2. What design path should you follow?

Requirements -> scale estimate -> APIs -> data model -> high-level design -> deep dive -> failure modes -> observability -> tradeoffs.

### 3. What separates senior from mid-level?

Senior answers discuss tradeoffs, failure modes, ownership, rollout, metrics, and recovery. Mid-level answers often stop at listing components.

### 4. How do you choose the deep dive?

Pick the hardest product risk: feed fanout, payment idempotency, chat ordering, file upload consistency, search latency, or notification delivery.

### 5. How do you close the interview?

Summarize the design, name key tradeoffs, say what you would monitor, and mention the first bottleneck or future improvement.

## Topic-specific drill

### How would I answer `Database Replication` if the interviewer asks directly?

For `Database Replication`, I would explain where it fits in the architecture, the scale problem it solves, the bottleneck or failure mode, the tradeoff, and the metric that proves the design is healthy.

### What is the trap question for `Database Replication`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Database Replication` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
