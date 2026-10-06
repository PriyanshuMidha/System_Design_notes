# Autoscaling

## Complete notes

Autoscaling automatically adds/removes compute capacity based on load.

## Easy explanation

Autoscaling automatically adds/removes compute capacity based on load.

In simple words: if you can explain `Autoscaling` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of safely moving code from developer machine to production users. This topic explains rollout, rollback, health checks, config, and release safety.

For `Autoscaling`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Real-life examples

### Easy real-life example

You release a small backend change and watch errors/latency to make sure users are not affected.

### Difficult production example

A high-risk payment change rolls out behind a feature flag with canary, rollback triggers, backward-compatible migration, health checks, and dashboards by version.

### How to relate this topic

When reading `Autoscaling`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Autoscaling` must be understood through its production use case, not just its definition.
- When to use it: Focus on safe rollout, feature flags, canary/blue-green/rolling deploys, health checks, rollback, config/secrets, and database migration compatibility.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: deploy success, error rate by version, latency by version, health check failures, rollback count, and business KPI changes.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Diagram

```mermaid

flowchart LR
  Metrics[CPU/RPS/Queue] --> Policy[Scaling policy]
  Policy --> Add[Add containers]
  Policy --> Remove[Remove containers]
```

## Common mistakes

- Deploying schema changes that are not backward compatible.
- No canary, feature flag, health check, or rollback trigger.
- No separation between deploy and release.
- Secrets/config differ between staging and production.
- No monitoring by version during rollout.

## Quick revision

Autoscaling automatically adds/removes compute capacity based on load.

## SDE-3 depth notes

### Real production use

Use this topic when you need to scale API pods when CPU, p95 latency, queue lag, or request rate rises.

### What to explain in interviews

- <span class="sd-key">Where it sits in the architecture</span>: client, API layer, service layer, data layer, infrastructure, or operations.
- <span class="sd-good">Why it is chosen</span>: what problem it solves better than the simpler alternative.
- <span class="sd-tradeoff">Tradeoff</span>: cost, complexity, latency, consistency, operability, or security.
- <span class="sd-risk">Failure mode</span>: cold starts, bad scaling metric, database bottleneck, and cost explosion.

### Example explanation

In a production ecommerce system, `Autoscaling` is not just a definition. You should connect it to a concrete request path, data path, or deployment path. Explain what happens during normal traffic, what breaks during high load or partial failure, and how the team detects and recovers from it.

### Revision prompts

1. What problem does this solve?
2. What is the simplest version?
3. What changes at scale?
4. What can go wrong?
5. What metric or alert proves it is healthy?


## Deep understanding checklist

To fully understand `Autoscaling`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on safe rollout, feature flags, canary/blue-green/rolling deploys, health checks, rollback, config/secrets, and database migration compatibility.

## Senior interview bank

These are topic-specific questions and strong answers for `Autoscaling`.

### 1. How do you release this safely?

Use small changes, automated tests, canary or rolling deploy, health checks, feature flags, dashboards, and rollback triggers. Database changes must be backward-compatible.

### 2. What can go wrong during rollout?

Bad config, incompatible schema, failed health checks, partial deploy, hidden dependency change, stale clients, or a feature flag targeting error. Watch metrics by version and region.

### 3. How do feature flags help?

Feature flags separate deployment from release. They allow canary, kill switch, tenant rollout, A/B tests, and fast rollback without redeploying.

### 4. How do you handle migrations?

Use expand-migrate-contract, avoid long locks, backfill in batches, monitor replication lag, and keep old/new code compatible during rollout.

### 5. What is the rollback plan?

Rollback code/config/flag quickly, but be careful with irreversible data changes. If schema changed, use compatibility or forward-fix with data repair.

## Topic-specific drill

### How would I answer `Autoscaling` if the interviewer asks directly?

For `Autoscaling`, I would explain rollout strategy, health checks, rollback trigger, feature-flag or migration risk, and how to prove the release is safe.

### What is the trap question for `Autoscaling`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Autoscaling` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
