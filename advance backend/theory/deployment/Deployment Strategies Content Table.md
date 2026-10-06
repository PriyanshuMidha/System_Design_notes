# Deployment Strategies Content Table

- [[Blue Green Deployment]]
- [[Canary Deployment]]
- [[Rollback Strategy]]
- [[Autoscaling]]
- [[Kubernetes Basics]]
- [[Docker Multi-stage Build]]

## Revision dashboard

Deployment strategy decides how new versions are released safely.

## Visual topic map

Use this map like the Excalidraw roadmap: follow the arrows first, then open the linked notes.

```mermaid
flowchart LR
  N1["Docker Multi-stage Build"]
  N2["Blue Green Deployment"]
  N3["Canary Deployment"]
  N4["Rollback Strategy"]
  N5["Autoscaling"]
  N6["Kubernetes Basics"]
  N1 --> N2
  N2 --> N3
  N3 --> N4
  N4 --> N5
  N5 --> N6
```

## Color legend

- <span class="sd-key">Blue</span> = core concept
- <span class="sd-good">Green</span> = recommended pattern
- <span class="sd-risk">Red</span> = risk or failure mode
- <span class="sd-tradeoff">Purple</span> = tradeoff
- <span class="sd-2026">Orange</span> = current 2026 update

## Linked notes in this map

- [[Docker Multi-stage Build]]
- [[Blue Green Deployment]]
- [[Canary Deployment]]
- [[Rollback Strategy]]
- [[Autoscaling]]
- [[Kubernetes Basics]]

## Additional SDE-3 topics

- [[Feature Flags]]
