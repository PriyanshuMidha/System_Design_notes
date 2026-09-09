# Production Architecture

## Complete notes

Production architecture is the full setup used when real users use the app.

## Main parts

- Domain and DNS.
- HTTPS certificate.
- Load balancer.
- Backend containers.
- Database.
- Redis.
- File storage.
- Logs and metrics.
- CI/CD.
- Secrets management.

## Diagram

```mermaid

flowchart TD
  User[User] --> DNS[DNS]
  DNS --> HTTPS[HTTPS / Load balancer]
  HTTPS --> API[ECS backend containers]
  API --> DB[(Database)]
  API --> Redis[(Redis)]
  API --> S3[(File storage)]
  API --> Logs[CloudWatch logs]
  Git[GitHub] --> CICD[CI/CD]
  CICD --> API
```

## Production checklist

- Health route exists.
- Logs are visible.
- Secrets are not in code.
- Database has backups.
- Redis has memory limit.
- App has rate limiting.
- App validates input.
- Deployment can rollback.
- Monitoring alerts are configured.

## Quick revision

Production architecture = all infrastructure pieces needed to run safely for real users.

## Deep revision

### Production backend layers

```mermaid

flowchart TD
  Internet[Internet] --> Edge[DNS/CDN/WAF]
  Edge --> LB[Load balancer]
  LB --> App[App containers]
  App --> Cache[(Redis)]
  App --> DB[(Database)]
  App --> Queue[(Queue)]
  App --> Storage[(S3/files)]
  App --> Observability[Logs/metrics/traces]
```

### Non-functional requirements

- Availability.
- Scalability.
- Security.
- Observability.
- Maintainability.
- Cost control.
- Recoverability.

### Production readiness checklist

- Rate limiting.
- Request validation.
- Error handling.
- Centralized logging.
- Monitoring alerts.
- DB backups.
- Secret management.
- CI/CD.
- Rollback.
- Load testing.

### Real interview phrasing

Production architecture is not only where the code runs. It includes networking, security, scaling, data storage, observability, deployment, and failure recovery.
