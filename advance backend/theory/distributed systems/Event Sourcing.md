# Event Sourcing

## Complete notes

Event sourcing stores state as a sequence of events instead of only the latest row.

## Easy explanation

Event sourcing stores state as a sequence of events instead of only the latest row.

In simple words: if you can explain `Event Sourcing` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of multiple services or machines working together where one part can fail while others continue. This topic explains how to handle duplicates, delays, stale data, ordering, and recovery.

For `Event Sourcing`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Real-life examples

### Easy real-life example

Two services communicate using messages. One message might arrive twice, so the receiver should not perform the same action twice.

### Difficult production example

An order workflow spans payment, inventory, shipping, notification, and analytics services. Failures, retries, duplicate events, out-of-order delivery, and reconciliation all matter.

### How to relate this topic

When reading `Event Sourcing`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Event Sourcing` must be understood through its production use case, not just its definition.
- When to use it: Focus on consistency model, delivery guarantee, idempotency, ordering, quorum/consensus, leader failure, duplicate events, and reconciliation.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: replication lag, duplicate event rate, consumer lag, leader changes, quorum failures, stale reads, and reconciliation errors.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Diagram

```mermaid

flowchart LR
  Events[(Event store)] --> Replay[Replay events]
  Replay --> State[Current state]
  Events --> Projection[Read model]
```

## Use carefully

Great for audit-heavy domains, but adds complexity for normal CRUD.

## SDE-3 interview angle

At SDE-3 level, do not only define this topic. Explain tradeoffs, failure modes, production debugging signals, and what you would choose under different requirements.

## Common mistakes

- Claiming exactly-once behavior without explaining idempotency boundaries.
- Ignoring network partitions, duplicate messages, clock skew, or stale reads.
- Using distributed locks without fencing or timeout strategy.
- Assuming global ordering when only per-partition ordering exists.
- No reconciliation path after partial failure.

## Quick revision

Event sourcing stores state as a sequence of events instead of only the latest row.


## Deep understanding checklist

To fully understand `Event Sourcing`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on consistency model, delivery guarantee, idempotency, ordering, quorum/consensus, leader failure, duplicate events, and reconciliation.


## Production example and edge cases

Example: if a worker crashes after writing to the database but before acknowledging a message, the queue can redeliver it. The handler must be idempotent and reconciliation should catch inconsistent state.

For `Event Sourcing`, the edge cases to always think about are:

- duplicate request or duplicate event
- dependency timeout or partial failure
- stale data or inconsistent state
- bad input or abusive client
- high traffic causing bottleneck
- rollback or replay after a bad deploy

Interview answer rule: after explaining the concept, immediately give one production example, one failure mode, one tradeoff, and one metric.

## Senior interview bank

These are topic-specific questions and strong answers for `Event Sourcing`.

### 1. What guarantee does this design actually provide?

State the real guarantee: at-least-once delivery, eventual consistency, per-key ordering, quorum consistency, or best-effort availability. Do not claim exactly-once unless you explain the boundary and idempotency strategy.

### 2. What happens during a network partition?

The system must choose between rejecting/pausing some operations or accepting divergence. I would explain whether the design favors consistency or availability for this product flow and how it reconciles afterward.

### 3. How do duplicates get handled?

Use idempotency keys, unique constraints, processed-event tables, dedup windows, and safe retries. Deduplication must survive process restarts, so memory-only dedup is not enough.

### 4. How do you handle ordering?

Avoid global ordering where possible. Use per-entity or per-partition ordering, sequence numbers, version checks, or reconciliation jobs. Explain what happens when messages arrive late.

### 5. What would an interviewer push on?

They will push on partial failure: crash after side effect, leader failover, stale reads, duplicate events, clock skew, and replay. A strong answer names the failure before being asked.

## Topic-specific drill

### How would I answer `Event Sourcing` if the interviewer asks directly?

For `Event Sourcing`, I would explain the real guarantee, what happens during partial failure, how duplicates or stale state are handled, and what reconciliation path exists.

### What is the trap question for `Event Sourcing`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Event Sourcing` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
