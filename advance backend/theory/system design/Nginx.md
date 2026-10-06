# Nginx

## Complete notes

Nginx is a web server that is often used as a [[Reverse Proxy vs Forward Proxy|reverse proxy]] and load balancer.

## Easy explanation

Nginx is commonly used as a reverse proxy in front of backend services to route, terminate TLS, compress, cache, or load balance traffic.

In simple words: if you can explain `Nginx` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of designing a backend system end to end. This topic explains where a component sits, why it is needed, what bottleneck it solves, and what tradeoff it introduces.

For `Nginx`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Common uses

- Serve static files.
- Reverse proxy to Node/Express backend.
- Load balance between multiple servers.
- SSL/TLS termination.
- Compression and caching.
- Rate limiting.

## Reverse proxy

Client talks to Nginx.
Nginx forwards request to backend server.

```mermaid

flowchart LR
  Client[Client] --> Nginx[Nginx reverse proxy]
  Nginx --> API[Node/Express API]
```

## Load balancing

```mermaid

flowchart LR
  Client[Client] --> Nginx[Nginx]
  Nginx --> API1[API server 1]
  Nginx --> API2[API server 2]
  Nginx --> API3[API server 3]
```

## Simple config idea

```nginx

upstream backend {
  server app1:3000;
  server app2:3000;
}

server {
  listen 80;

  location / {
    proxy_pass http://backend;
  }
}
```

## Real-life examples

### Easy real-life example

You design a small app with users, API server, database, and cache.

### Difficult production example

You design a global service that needs load balancing, caching, replication, sharding, queues, observability, safe deployment, and clear tradeoffs.

### How to relate this topic

When reading `Nginx`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Nginx` must be understood through its production use case, not just its definition.
- When to use it: Focus on requirements, scale, APIs, data model, high-level architecture, bottleneck, failure mode, consistency, observability, and tradeoffs.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: QPS, p95 latency, availability, error rate, queue lag, cache hit rate, database latency, and saturation.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Common mistakes

- Listing components without explaining why they are needed.
- Ignoring bottlenecks and failure modes.
- No scale estimate or data model.
- No observability or rollback plan.
- Choosing tools without tradeoffs.

## Quick revision

Nginx usually sits in front of backend servers and forwards, balances, secures, and optimizes traffic.

## Important additions

### Nginx in production

Nginx can do:

- reverse proxy
- static file serving
- gzip compression
- TLS/SSL termination
- path routing
- load balancing
- basic rate limiting

### Common reverse proxy headers

```nginx

proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

These help backend know original client information.


## Deep understanding checklist

To fully understand `Nginx`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on requirements, scale, APIs, data model, high-level architecture, bottleneck, failure mode, consistency, observability, and tradeoffs.

## Senior interview bank

These are topic-specific questions and strong answers for `Nginx`.

### 1. What is the first thing you ask?

Clarify requirements: users, core features, read/write ratio, scale, latency, availability, consistency, geography, security, and what is explicitly out of scope.

### 2. What design path should you follow?

Requirements -> scale estimate -> APIs -> data model -> high-level design -> deep dive -> failure modes -> observability -> tradeoffs.

### 3. What separates senior from mid-level?

Senior answers discuss tradeoffs, failure modes, ownership, rollout, metrics, and recovery. Mid-level answers often stop at listing components.

### 4. How do you choose the deep dive?

Pick the hardest product risk: feed fanout, payment idempotency, chat ordering, file upload consistency, search latency, or notification delivery.

### 5. How do you close the interview?

Summarize the design, name key tradeoffs, say what you would monitor, and mention the first bottleneck or future improvement.

## Topic-specific drill

### How would I answer `Nginx` if the interviewer asks directly?

For `Nginx`, I would explain where it fits in the architecture, the scale problem it solves, the bottleneck or failure mode, the tradeoff, and the metric that proves the design is healthy.

### What is the trap question for `Nginx`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Nginx` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
