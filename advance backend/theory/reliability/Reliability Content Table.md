# Reliability Content Table

- [[Idempotency]]
- [[Retry and Backoff]]
- [[Circuit Breaker]]
- [[Dead Letter Queue]]
- [[Background Jobs]]
- [[Cron Jobs]]
- [[Worker Architecture]]
- [[Message Broker Comparison]]
- [[WebSocket Scaling]]

## Revision dashboard

Reliability means backend keeps working correctly even when requests repeat, services fail, jobs fail, or traffic grows.

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["Retry and Backoff"]
  N2["Circuit Breaker"]
  N3["Idempotency"]
  N4["Dead Letter Queue"]
  N5["Background Jobs"]
  N6["Worker Architecture"]
  N7["WebSocket Scaling"]
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
  N6 --> N7
```

## Color legend

- <span class="sd-key">Blue</span> = core concept
- <span class="sd-good">Green</span> = recommended pattern
- <span class="sd-risk">Red</span> = risk or failure mode
- <span class="sd-tradeoff">Purple</span> = tradeoff
- <span class="sd-2026">Orange</span> = current 2026 update

## Linked notes in this map

- [[Retry and Backoff]]
- [[Circuit Breaker]]
- [[Idempotency]]
- [[Dead Letter Queue]]
- [[Background Jobs]]
- [[Worker Architecture]]
- [[WebSocket Scaling]]

## Additional SDE-3 topics

- [[Graceful Degradation]]
- [[Event Streaming]]
- [[Durable Job Scheduler]]
