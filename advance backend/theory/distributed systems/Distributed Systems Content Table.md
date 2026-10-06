# Distributed Systems Content Table

- [[Consistency Models]]
- [[Quorum Reads and Writes]]
- [[Leader Election]]
- [[Consensus]]
- [[Distributed Locks]]
- [[Saga Pattern]]
- [[Outbox Pattern]]
- [[Event Sourcing]]
- [[CQRS]]
- [[High Availability and Failover]]

## Revision dashboard

Distributed systems are systems where multiple machines coordinate over unreliable networks.

```mermaid

flowchart LR
  Client --> ServiceA[Service A]
  ServiceA --> ServiceB[Service B]
  ServiceA --> DB1[(DB primary)]
  DB1 --> DB2[(Replica)]
  ServiceB --> Queue[(Queue)]
```

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["Consistency Models"]
  N2["CAP Theorem"]
  N3["Consensus"]
  N4["Leader Election"]
  N5["Quorum Reads and Writes"]
  N6["Distributed Locks"]
  N7["Saga Pattern"]
  N8["Outbox Pattern"]
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
  N6 --> N7
  N7 --> N8
```

## Color legend

- <span class="sd-key">Blue</span> = core concept
- <span class="sd-good">Green</span> = recommended pattern
- <span class="sd-risk">Red</span> = risk or failure mode
- <span class="sd-tradeoff">Purple</span> = tradeoff
- <span class="sd-2026">Orange</span> = current 2026 update

## Linked notes in this map

- [[Consistency Models]]
- [[CAP Theorem]]
- [[Consensus]]
- [[Leader Election]]
- [[Quorum Reads and Writes]]
- [[Distributed Locks]]
- [[Saga Pattern]]
- [[Outbox Pattern]]

## Additional SDE-3 topics

- [[Clock Skew and Time]]

## Grill audit additions

- [[Exactly Once Myth]]
- [[Multi Region Architecture]]
