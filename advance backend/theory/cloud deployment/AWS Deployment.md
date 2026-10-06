# AWS Deployment

## Complete notes

AWS deployment means putting your app on Amazon cloud so users can access it from internet.

## Easy explanation

AWS deployment means putting your app on Amazon cloud so users can access it from internet.

In simple words: if you can explain `AWS Deployment` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of running your backend on cloud infrastructure with real users. This topic explains compute, networking, database/cache, monitoring, CI/CD, and rollback.

For `AWS Deployment`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Common AWS services for backend

- EC2: virtual server.
- ECS: run containers.
- ECR: store Docker images.
- S3: store files/static assets.
- RDS: managed relational database.
- ElastiCache: managed Redis.
- CloudWatch: logs and monitoring.
- IAM: permissions/security.
- ALB: application load balancer.

## Deployment flow

```mermaid

flowchart TD
  Code[Code] --> Docker[Docker image]
  Docker --> ECR[(ECR)]
  ECR --> ECS[ECS task/service]
  ECS --> ALB[Application Load Balancer]
  ALB --> User[Users]
  ECS --> CloudWatch[Logs]
```

## Important production setup

- Environment variables.
- Secrets.
- Database connection.
- Redis connection.
- Health check route.
- Logs.
- HTTPS/domain.
- Auto restart.

## Real-life examples

### Easy real-life example

You deploy a backend API to cloud and expose it through a load balancer.

### Difficult production example

A production service runs on ECS/EKS/EC2 with CI/CD, secrets, IAM, private networking, RDS, cache, logs, metrics, alarms, autoscaling, and rollback.

### How to relate this topic

When reading `AWS Deployment`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `AWS Deployment` must be understood through its production use case, not just its definition.
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

AWS deployment = package app, push image, run service, expose through [[Load Balancer|load balancer]], monitor logs.

## Deep revision

### Common AWS backend architecture

```mermaid

flowchart TD
  User[User] --> Route53[Route 53 DNS]
  Route53 --> ALB[Application Load Balancer]
  ALB --> ECS[ECS/Fargate tasks]
  ECS --> RDS[(RDS database)]
  ECS --> Redis[(ElastiCache Redis)]
  ECS --> S3[(S3 files)]
  ECS --> CloudWatch[CloudWatch logs]
  GitHub[GitHub] --> Actions[GitHub Actions]
  Actions --> ECR[(ECR image registry)]
  ECR --> ECS
```

### Deployment checklist

- Dockerfile works locally.
- Health check route exists.
- Environment variables configured.
- Secrets are not in repo.
- Database reachable from backend.
- Security group allows correct ports.
- Logs visible in CloudWatch.
- Domain/HTTPS configured.

### Important AWS security idea

Use [[AWS IAM|IAM]] roles and least privilege.

Do not hardcode AWS keys in code or [[Docker_Image_Container|Docker image]].

### Common deployment failures

- Container starts on wrong port.
- Health check path wrong.
- Missing env variable.
- Security group blocks traffic.
- ECS task cannot pull image from ECR.


## Deep understanding checklist

To fully understand `AWS Deployment`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on packaging, environment config, secrets, networking, compute, database/cache, CI/CD, health checks, rollback, monitoring, and cost.

## Senior interview bank

These are topic-specific questions and strong answers for `AWS Deployment`.

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

### How would I answer `AWS Deployment` if the interviewer asks directly?

For `AWS Deployment`, I would explain the production deployment path, environment/secrets, infrastructure dependencies, health checks, rollback trigger, and the cloud metrics that prove it is stable.

### What is the trap question for `AWS Deployment`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `AWS Deployment` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
