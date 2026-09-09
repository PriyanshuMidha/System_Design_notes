# System Design introduction

## Complete notes

System design means planning how the backend system should work at scale.

It is not only coding one API. It includes servers, database, cache, queue, load balancer, monitoring, and failure handling.

## Why system design is needed

A small app can run on one server.

When traffic grows, one server may become slow or crash.

System design helps decide how to handle:

- More users.
- More requests.
- More data.
- Failures.
- Security.
- Cost.

## Basic flow

```mermaid

flowchart LR
  Client[Client] --> API[API server]
  API --> DB[(Database)]
```

## Scaled flow

```mermaid

flowchart LR
  Client[Client] --> LB[Load balancer]
  LB --> API1[API server 1]
  LB --> API2[API server 2]
  API1 --> Redis[(Redis cache)]
  API2 --> Redis
  API1 --> DB[(Database)]
  API2 --> DB
```

## Important concepts

- Availability: system should stay up.
- Scalability: system should handle growth.
- Reliability: system should work correctly.
- Latency: response delay should be low.
- Throughput: system should handle many requests.

## Quick revision

System design = how to arrange backend parts so the app works for many users.
