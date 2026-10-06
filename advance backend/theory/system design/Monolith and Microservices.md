# Monolith and Microservices

## Complete notes

Monolith means most backend features live in one application.

Microservices means features are split into many small independent services.

## Easy explanation

Monolith means most backend features live in one application.

In simple words: if you can explain `Monolith and Microservices` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of designing a backend system end to end. This topic explains where a component sits, why it is needed, what bottleneck it solves, and what tradeoff it introduces.

For `Monolith and Microservices`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Monolith

```mermaid

flowchart TD
  App[One backend app] --> Auth[Auth]
  App --> Orders[Orders]
  App --> Payments[Payments]
  App --> DB[(One database)]
```

### Good

- Simple to build.
- Simple to deploy.
- Good for startup/MVP.
- Easy local development.

### Problem

- Can become large and hard to maintain.
- One bug can affect whole app.
- Scaling one feature separately is difficult.

## Microservices

```mermaid

flowchart LR
  Gateway[API gateway] --> Auth[Auth service]
  Gateway --> Orders[Order service]
  Gateway --> Payments[Payment service]
  Orders --> OrderDB[(Order DB)]
  Payments --> PaymentDB[(Payment DB)]
```

### Good

- Services can scale separately.
- Teams can own separate services.
- One service can be deployed independently.

### Problem

- More complex.
- Needs service communication.
- Needs monitoring, logs, CI/CD, and distributed debugging.
- Database consistency becomes harder.

## Real-life examples

### Easy real-life example

You design a small app with users, API server, database, and cache.

### Difficult production example

You design a global service that needs load balancing, caching, replication, sharding, queues, observability, safe deployment, and clear tradeoffs.

### How to relate this topic

When reading `Monolith and Microservices`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Monolith and Microservices` must be understood through its production use case, not just its definition.
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

Start with monolith for simple product.
Move to microservices only when scale/team boundaries need it.

## Important additions

### Modular monolith

Before microservices, build a modular monolith.

That means one deployable app, but code is separated by modules:

- auth module
- product module
- order module
- payment module

### Migration path

```mermaid

flowchart LR
  Monolith --> Modular[Modular monolith]
  Modular --> Split[Split high-scale module]
  Split --> Micro[Microservices]
```

### When microservices make sense

- many teams
- independent deploys needed
- one feature has different scale
- clear service boundaries exist

Do not choose microservices only because it sounds advanced.


## Deep understanding checklist

To fully understand `Monolith and Microservices`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on requirements, scale, APIs, data model, high-level architecture, bottleneck, failure mode, consistency, observability, and tradeoffs.

## Senior interview bank

These are topic-specific questions and strong answers for `Monolith and Microservices`.

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

### How would I answer `Monolith and Microservices` if the interviewer asks directly?

For `Monolith and Microservices`, I would explain where it fits in the architecture, the scale problem it solves, the bottleneck or failure mode, the tradeoff, and the metric that proves the design is healthy.

### What is the trap question for `Monolith and Microservices`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Monolith and Microservices` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
