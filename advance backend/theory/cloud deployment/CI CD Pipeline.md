# CI CD Pipeline

## Complete notes

CI/CD means Continuous Integration and Continuous Deployment.

It automates testing, building, and deploying code.

## Easy explanation

CI/CD means Continuous Integration and Continuous Deployment.

In simple words: if you can explain `CI CD Pipeline` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of running your backend on cloud infrastructure with real users. This topic explains compute, networking, database/cache, monitoring, CI/CD, and rollback.

For `CI CD Pipeline`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## CI

Continuous Integration checks code when developer pushes.

Examples:

- install dependencies
- run lint
- run tests
- build app

## CD

Continuous Deployment sends successful build to production/staging.

## Pipeline diagram

```mermaid

flowchart LR
  Push[git push] --> CI[Run tests/build]
  CI --> Image[Build Docker image]
  Image --> Registry[Push to ECR]
  Registry --> Deploy[Deploy to ECS]
  Deploy --> Verify[Health check]
```

## GitHub Actions example idea

```yaml

name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: docker build -t app .
```

## Important secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- database URL
- Redis URL

## Real-life examples

### Easy real-life example

You deploy a backend API to cloud and expose it through a load balancer.

### Difficult production example

A production service runs on ECS/EKS/EC2 with CI/CD, secrets, IAM, private networking, RDS, cache, logs, metrics, alarms, autoscaling, and rollback.

### How to relate this topic

When reading `CI CD Pipeline`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `CI CD Pipeline` must be understood through its production use case, not just its definition.
- When to use it: Focus on packaging, environment config, secrets, networking, compute, database/cache, CI/CD, health checks, rollback, monitoring, and cost.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: deployment success, service health, 5xx, p95 latency, CPU/memory, restarts, DB connections, alarms, and cost.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Common mistakes

- No health checks or rollback plan.
- Bad IAM/security group/env var configuration.
- No logs, metrics, or alerts before production.
- No backup or restore path.
- No cost monitoring.

## Quick revision

CI/CD = push code -> test -> build -> deploy automatically.

## Deep revision

### Complete CI/CD flow

```mermaid

flowchart TD
  PR[Pull request] --> Test[Run tests/lint]
  Test --> Merge[Merge to main]
  Merge --> Build[Build Docker image]
  Build --> Scan[Optional security scan]
  Scan --> Push[Push image to ECR]
  Push --> Deploy[Deploy ECS task definition]
  Deploy --> Health[Check health endpoint]
  Health --> Notify[Notify success/failure]
```

### Stages

- CI validates code.
- Build creates deployable artifact.
- CD deploys artifact.
- Verification checks app is healthy.

### Good pipeline rules

- Fail fast.
- Keep secrets in GitHub secrets/AWS secrets.
- Use separate staging and production.
- Tag image with commit SHA.
- Run migrations carefully.
- Keep rollback plan.

### Common mistakes

- Deploying untested code.
- Running database migrations without backup.
- No health check after deploy.
- No logs when deploy fails.
- Too much manual clicking in console.


## Deep understanding checklist

To fully understand `CI CD Pipeline`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on packaging, environment config, secrets, networking, compute, database/cache, CI/CD, health checks, rollback, monitoring, and cost.

## Senior interview bank

These are topic-specific questions and strong answers for `CI CD Pipeline`.

### 1. How do you move a backend safely to cloud production?

Package the app, configure environment/secrets, provision compute/network/database/cache, add logs/metrics/alerts, deploy behind a load balancer, run health checks, and keep a rollback path.

### 2. What can fail after deployment?

Bad environment variables, missing IAM permissions, wrong security group, expired certificate, database connection exhaustion, bad image tag, unhealthy container, or no rollback plan.

### 3. How do you design CI/CD for this?

Build once, test, scan, push artifact, deploy to staging, run smoke tests, then deploy progressively to production using rolling/canary/blue-green strategy with automatic rollback signals.

### 4. What is the production readiness checklist?

Health checks, logs, metrics, alerts, secrets, backups, autoscaling, runbooks, rollback, cost monitoring, and clear ownership.

### 5. What should be monitored?

Deployment success, service health, 5xx rate, p95/p99 latency, CPU/memory, container restarts, database connections, queue lag, CloudWatch alarms, and cost.

## Topic-specific drill

### How would I answer `CI CD Pipeline` if the interviewer asks directly?

For `CI CD Pipeline`, I would explain the production deployment path, environment/secrets, infrastructure dependencies, health checks, rollback trigger, and the cloud metrics that prove it is stable.

### What is the trap question for `CI CD Pipeline`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `CI CD Pipeline` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
