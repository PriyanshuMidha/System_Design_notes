# Database Content Table

- [[Database Indexing]]
- [[Transactions]]
- [[Connection Pooling]]
- [[Database Migration]]
- [[Backup and Restore]]
- [[CAP Theorem]]
- [[Consistent Hashing]]

## Revision dashboard

Database engineering is about storing, querying, [[Scaling Concepts|scaling]], backing up, and protecting data.

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["Transactions"]
  N2["Database Indexing"]
  N3["Connection Pooling"]
  N4["Database Replication"]
  N5["Database Sharding"]
  N6["Backup and Restore"]
  N7["Database Migration"]
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

- [[Transactions]]
- [[Database Indexing]]
- [[Connection Pooling]]
- [[Database Replication]]
- [[Database Sharding]]
- [[Backup and Restore]]
- [[Database Migration]]

## Grill audit additions

- [[Query Plans and EXPLAIN]]
