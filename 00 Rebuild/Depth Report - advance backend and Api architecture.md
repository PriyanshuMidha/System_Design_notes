---
tags: [rebuild/audit]
updated: 2026-11-03
---

# Depth Report - advance backend and Api architecture

> [!summary] What this is
> Depth of every note still in the two old folders (0 = definition only, 5 = complete basic→advanced), from the per-note audit. "Real lines" = lines that are not repeated template text. Verdict = what the rebuild does with it. Back to [[Rebuild Plan]].

Depth scale: 0 definition only · 1 a few bullets · 2 part of the mechanism · 3 decent but shallow · 4 solid · 5 complete.

## Summary by subfolder

| Folder / subfolder | Notes | Avg depth | Depth 0–1 | Depth 3+ |
| --- | --- | --- | --- | --- |
| Api architecture / (root) | 1 | 2.0 | 0 | 0 |
| advance backend / (root) | 3 | 0.7 | 3 | 0 |
| advance backend / advance_backedn_content | 1 | 0.0 | 1 | 0 |
| advance backend / ai engineering | 8 | 1.8 | 3 | 1 |
| advance backend / api design | 5 | 2.6 | 1 | 3 |
| advance backend / architecture patterns | 7 | 1.1 | 6 | 0 |
| advance backend / auth security | 9 | 1.1 | 6 | 1 |
| advance backend / aws | 7 | 0.0 | 7 | 0 |
| advance backend / basic Backend | 1 | 2.0 | 0 | 0 |
| advance backend / cloud deployment | 5 | 1.8 | 1 | 0 |
| advance backend / data modeling | 9 | 0.7 | 8 | 0 |
| advance backend / database | 13 | 1.8 | 5 | 5 |
| advance backend / deployment | 8 | 0.4 | 8 | 0 |
| advance backend / distributed systems | 14 | 1.3 | 10 | 1 |
| advance backend / docker | 10 | 1.9 | 1 | 0 |
| advance backend / golang backend | 54 | 1.3 | 34 | 2 |
| advance backend / observability | 4 | 1.5 | 2 | 1 |
| advance backend / performance | 8 | 1.1 | 5 | 0 |
| advance backend / production debugging | 8 | 1.2 | 6 | 0 |
| advance backend / rag | 8 | 2.4 | 1 | 4 |
| advance backend / redis | 8 | 2.5 | 1 | 4 |
| advance backend / reliability | 12 | 1.3 | 10 | 2 |
| advance backend / sde3 roadmap | 1 | 1.0 | 1 | 0 |
| advance backend / system design | 8 | 1.8 | 2 | 0 |
| advance backend / system design practice | 8 | 1.4 | 5 | 0 |
| advance backend / testing strategy | 7 | 0.9 | 7 | 0 |

## Api architecture / (root)

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| GRPC | 2 | 73/245 | REWRITE |

## advance backend / (root)

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| 2026 SDE3 Gap Checklist | 1 | 30/95 | MERGE |
| Grill Audit - SDE3 Backend Gaps | 0 | 8/19 | DELETE |
| START HERE - Advanced Backend SDE3 Path | 1 | 56/126 | MERGE |

## advance backend / advance_backedn_content

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Advancxe backend content table | 0 | 69/116 | MERGE |

## advance backend / ai engineering

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| AI Agents | 2 | 63/224 | POLISH |
| AI Engineering Content Table | 1 | 41/87 | DELETE |
| Introduction to AI Engineering | 1 | 41/189 | MERGE |
| LLM Fundamentals | 2 | 47/214 | REWRITE |
| LangChain Fundamentals | 1 | 43/208 | MERGE |
| LangGraph | 2 | 57/221 | POLISH |
| Production AI Best Practices | 2 | 48/203 | SPLIT |
| Prompt Engineering | 3 | 46/208 | POLISH |

## advance backend / api design

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| API Design Content Table | 1 | 48/124 | DELETE |
| CDN | 4 | 126/273 | POLISH |
| CORS | 3 | 49/170 | POLISH |
| Global CDN and Edge | 2 | 63/185 | MERGE |
| Reverse Proxy vs Forward Proxy | 3 | 57/180 | POLISH |

## advance backend / architecture patterns

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Architecture Decision Records | 1 | 7/155 | REWRITE |
| Architecture Patterns Content Table | 2 | 54/109 | MERGE |
| Clean Architecture | 1 | 8/163 | REWRITE |
| Domain Driven Design | 1 | 7/155 | REWRITE |
| Hexagonal Architecture | 1 | 7/155 | REWRITE |
| Layered Architecture | 1 | 6/154 | REWRITE |
| Strangler Fig Pattern | 1 | 7/155 | REWRITE |

## advance backend / auth security

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| API Abuse and Bot Protection | 1 | 19/152 | REWRITE |
| Auth Security Content Table | 1 | 48/122 | DELETE |
| Authentication vs Authorization | 0 | 8/159 | REWRITE |
| Docker Security Basics | 0 | 9/160 | MERGE |
| JWT | 2 | 34/197 | REWRITE |
| OAuth | 3 | 49/162 | POLISH |
| Refresh Token and Access Token | 1 | 9/154 | REWRITE |
| Secrets Management | 0 | 9/160 | REWRITE |
| Sessions and Cookies | 2 | 23/169 | REWRITE |

## advance backend / aws

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| AWS CloudWatch | 0 | 8/159 | REWRITE |
| AWS ElastiCache | 0 | 7/158 | MERGE |
| AWS IAM | 0 | 9/160 | REWRITE |
| AWS RDS | 0 | 8/159 | REWRITE |
| AWS S3 | 0 | 8/159 | REWRITE |
| AWS Services Content Table | 0 | 19/49 | DELETE |
| Domain DNS HTTPS SSL TLS | 0 | 10/161 | SPLIT |

## advance backend / basic Backend

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Basic backend content table | 2 | 65/139 | POLISH |

## advance backend / cloud deployment

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| AWS Deployment | 2 | 51/204 | MERGE |
| CI CD Pipeline | 2 | 55/221 | REWRITE |
| Cloud Deployment Content Table | 1 | 33/63 | DELETE |
| ECR and ECS | 2 | 42/199 | REWRITE |
| Production Architecture | 2 | 61/216 | REWRITE |

## advance backend / data modeling

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Data Modeling Content Table | 1 | 69/129 | MERGE |
| Materialized Views | 0 | 6/153 | REWRITE |
| N Plus One Query Problem | 2 | 17/165 | REWRITE |
| NoSQL Data Modeling | 0 | 7/154 | REWRITE |
| Optimistic and Pessimistic Locking | 1 | 7/154 | REWRITE |
| SQL vs NoSQL | 1 | 9/157 | REWRITE |
| Schema Design | 0 | 7/154 | REWRITE |
| Schema Registry | 0 | 9/153 | REWRITE |
| Search Indexes | 1 | 7/154 | MERGE |

## advance backend / database

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Advanced Index Types | 3 | 80/169 | POLISH |
| Backup and Restore | 0 | 8/158 | REWRITE |
| CAP Theorem | 0 | 8/158 | REWRITE |
| Cassandra and Wide Column Stores | 3 | 85/175 | POLISH |
| Connection Pooling | 2 | 21/164 | REWRITE |
| Database Content Table | 1 | 55/105 | DELETE |
| Database Indexing | 2 | 17/166 | REWRITE |
| Database Migration | 0 | 8/158 | REWRITE |
| Query Plans and EXPLAIN | 1 | 19/143 | REWRITE |
| Search Architecture | 3 | 73/157 | POLISH |
| Sharding Patterns | 3 | 76/149 | POLISH |
| Time Series and Analytics Storage | 3 | 64/134 | POLISH |
| Transactions | 2 | 29/168 | REWRITE |

## advance backend / deployment

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Autoscaling | 0 | 8/159 | REWRITE |
| Blue Green Deployment | 0 | 9/160 | MERGE |
| Canary Deployment | 0 | 8/159 | REWRITE |
| Deployment Strategies Content Table | 0 | 20/53 | DELETE |
| Docker Multi-stage Build | 1 | 14/164 | MERGE |
| Feature Flags | 1 | 12/156 | REWRITE |
| Kubernetes Basics | 1 | 20/170 | REWRITE |
| Rollback Strategy | 0 | 8/159 | REWRITE |

## advance backend / distributed systems

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| CQRS | 1 | 7/154 | REWRITE |
| Clock Skew and Time | 1 | 10/138 | REWRITE |
| Consensus | 1 | 9/159 | REWRITE |
| Consistency Models | 1 | 13/167 | REWRITE |
| Distributed Locks | 1 | 12/163 | REWRITE |
| Distributed Systems Content Table | 0 | 36/77 | DELETE |
| Event Sourcing | 1 | 7/157 | REWRITE |
| Exactly Once Myth | 2 | 11/143 | REWRITE |
| High Availability and Failover | 1 | 12/163 | REWRITE |
| Leader Election | 1 | 8/158 | REWRITE |
| Multi Region Architecture | 2 | 21/156 | REWRITE |
| Outbox Pattern | 2 | 18/169 | POLISH |
| Quorum Reads and Writes | 1 | 11/165 | REWRITE |
| Saga Pattern | 3 | 29/175 | POLISH |

## advance backend / docker

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| DOCKER Volums | 2 | 35/202 | REWRITE |
| DOCKER WHY | 2 | 30/186 | REWRITE |
| DOCKER_CODE | 2 | 42/213 | REWRITE |
| Docker Content Table | 1 | 42/65 | DELETE |
| Docker Network | 2 | 34/209 | REWRITE |
| Docker_Image_Container | 2 | 32/196 | POLISH |
| Porting mapping | 2 | 21/170 | MERGE |
| docker comnpose | 2 | 33/194 | REWRITE |
| how docker Works | 2 | 35/204 | REWRITE |
| how to dockerize | 2 | 32/187 | REWRITE |

## advance backend / golang backend

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Go API Client External Calls | 1 | 18/39 | REWRITE |
| Go Auth JWT Sessions | 2 | 27/61 | REWRITE |
| Go Backend Coding Roadmap | 0 | 72/148 | MERGE |
| Go Backend Complete Notes | 1 | 1879/3863 | DELETE |
| Go Benchmarking wrk h2load ghz pprof | 1 | 17/52 | SPLIT |
| Go Bootcamp Coding Checklist | 0 | 54/75 | MERGE |
| Go Bootcamp Course Coverage Map | 0 | 37/60 | MERGE |
| Go Concurrency Goroutines Channels | 1 | 29/63 | REWRITE |
| Go Configuration Environment | 1 | 21/43 | REWRITE |
| Go Context Package | 1 | 19/45 | REWRITE |
| Go Cron Scheduled Jobs | 2 | 20/48 | REWRITE |
| Go Database Migrations | 1 | 16/49 | REWRITE |
| Go Database SQL | 2 | 25/48 | REWRITE |
| Go Deep Basics Functions Defer Panic Recover | 2 | 23/53 | REWRITE |
| Go Deployment Docker | 1 | 23/47 | REWRITE |
| Go Developer Tooling Git VSCode CLI | 1 | 21/47 | REWRITE |
| Go Error Handling | 2 | 26/57 | REWRITE |
| Go File Uploads | 1 | 19/43 | REWRITE |
| Go Generics Reflection Runtime | 1 | 20/44 | SPLIT |
| Go Graceful Shutdown | 1 | 19/41 | REWRITE |
| Go HTTP Server | 2 | 28/58 | REWRITE |
| Go HTTPS HTTP2 TLS Server | 1 | 17/40 | REWRITE |
| Go JSON Validation DTOs | 2 | 25/49 | REWRITE |
| Go Language Basics | 3 | 264/566 | SPLIT |
| Go Logging Observability | 1 | 28/53 | MERGE |
| Go Middleware | 1 | 21/46 | REWRITE |
| Go OpenAPI Documentation | 1 | 27/53 | REWRITE |
| Go OpenTelemetry Metrics Tracing | 1 | 26/53 | MERGE |
| Go Password Hashing | 1 | 18/47 | MERGE |
| Go Pointers Memory Values | 1 | 20/45 | REWRITE |
| Go Project Structure and Modules | 2 | 34/66 | SPLIT |
| Go Protobuf Validation | 1 | 16/37 | MERGE |
| Go Protoc Code Generation | 2 | 16/37 | MERGE |
| Go REST API Coding | 2 | 32/70 | REWRITE |
| Go Redis Cache Queue Rate Limit | 1 | 24/63 | REWRITE |
| Go SQL NoSQL API Practice | 0 | 12/42 | DELETE |
| Go Security for Backend | 1 | 28/46 | REWRITE |
| Go Source Code Reading Debugging | 1 | 23/40 | MERGE |
| Go Strings Runes Time Files | 1 | 16/38 | SPLIT |
| Go Testing | 1 | 26/51 | REWRITE |
| Go Transactions and Repository Pattern | 2 | 25/61 | REWRITE |
| Go Types Structs Interfaces | 2 | 22/53 | SPLIT |
| Go WebSocket Realtime | 2 | 30/66 | REWRITE |
| Go Webhooks Idempotency | 2 | 30/61 | REWRITE |
| Go Worker Queues and Background Jobs | 2 | 34/63 | REWRITE |
| Go YouTube Topic Links | 0 | 17/36 | MERGE |
| Go gRPC Deep Dive | 1 | 24/55 | MERGE |
| Go gRPC Gateway REST Combo API | 2 | 22/49 | REWRITE |
| Go gRPC Services | 1 | 37/81 | REWRITE |
| Go gRPC Streaming Patterns | 2 | 18/47 | REWRITE |
| Go gRPC TLS Metadata Deadlines | 1 | 12/35 | MERGE |
| Go gRPC Testing Tools Postman grpcurl | 2 | 15/34 | MERGE |
| Golang Backend Content Table | 0 | 24/45 | DELETE |
| InvoiceOps Golang Project Plan | 3 | 96/152 | POLISH |

## advance backend / observability

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Logs Metrics Traces | 2 | 53/192 | SPLIT |
| Monitoring and Alerting | 1 | 27/156 | REWRITE |
| Observability Content Table | 0 | 16/49 | DELETE |
| Production Debugging Playbook | 3 | 39/155 | POLISH |

## advance backend / performance

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Backpressure | 1 | 7/154 | REWRITE |
| Bottleneck Analysis | 0 | 8/155 | REWRITE |
| Cache Stampede Avalanche Penetration | 2 | 27/179 | MERGE |
| Capacity Estimation | 2 | 25/172 | POLISH |
| Hot Keys and Hot Partitions | 1 | 6/153 | REWRITE |
| Performance Engineering Content Table | 1 | 48/91 | MERGE |
| Profiling | 0 | 7/154 | MERGE |
| Thread Pools and Blocking IO | 2 | 20/157 | POLISH |

## advance backend / production debugging

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Database Performance Debugging | 1 | 8/156 | REWRITE |
| Incident Response | 1 | 7/155 | REWRITE |
| Latency Debugging | 2 | 23/182 | MERGE |
| Memory Leak Debugging | 1 | 7/155 | REWRITE |
| Postmortems | 1 | 7/155 | REWRITE |
| Production Debugging Content Table | 2 | 49/92 | MERGE |
| Root Cause Analysis | 1 | 7/155 | MERGE |
| SLO SLA SLI | 1 | 6/154 | REWRITE |

## advance backend / rag

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| AI Chat with PDFs and Websites | 3 | 58/223 | POLISH |
| Document Processing | 3 | 51/214 | POLISH |
| Embedding Models | 2 | 33/207 | REWRITE |
| RAG Content Table | 1 | 38/86 | DELETE |
| RAG | 3 | 71/244 | POLISH |
| Semantic Search | 2 | 28/207 | REWRITE |
| Vector Database Architecture | 3 | 100/198 | POLISH |
| Vector Databases | 2 | 50/221 | MERGE |

## advance backend / redis

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| API Caching with Redis | 3 | 49/219 | MERGE |
| Caching Patterns and Types | 4 | 128/249 | SPLIT |
| Message Queue with Redis | 3 | 55/233 | REWRITE |
| Rate limiting with Redis | 3 | 107/322 | REWRITE |
| redis Content table | 1 | 53/118 | DELETE |
| redis setup | 2 | 40/229 | REWRITE |
| uses of redis | 2 | 32/202 | REWRITE |
| what is redis | 2 | 32/178 | REWRITE |

## advance backend / reliability

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Background Jobs | 1 | 9/159 | REWRITE |
| Circuit Breaker | 3 | 26/168 | POLISH |
| Cron Jobs | 1 | 8/158 | REWRITE |
| Dead Letter Queue | 1 | 8/158 | REWRITE |
| Durable Job Scheduler | 1 | 10/154 | MERGE |
| Event Streaming | 1 | 11/155 | REWRITE |
| Graceful Degradation | 1 | 11/139 | REWRITE |
| Message Broker Comparison | 1 | 10/157 | REWRITE |
| Reliability Content Table | 1 | 53/96 | DELETE |
| Retry and Backoff | 3 | 25/169 | POLISH |
| WebSocket Scaling | 1 | 9/152 | REWRITE |
| Worker Architecture | 1 | 9/159 | MERGE |

## advance backend / sde3 roadmap

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| SDE3 Backend Roadmap | 1 | 35/170 | MERGE |

## advance backend / system design

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Database Replication | 2 | 37/199 | POLISH |
| Database Sharding | 2 | 45/218 | MERGE |
| Load Balancer | 2 | 39/195 | POLISH |
| Monolith and Microservices | 2 | 42/207 | POLISH |
| Nginx | 2 | 40/199 | POLISH |
| Scaling Concepts | 2 | 54/224 | POLISH |
| System Design Content Table | 1 | 62/95 | DELETE |
| System Design introduction | 1 | 27/171 | REWRITE |

## advance backend / system design practice

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Design Chat System | 1 | 8/155 | REWRITE |
| Design File Storage | 1 | 8/155 | REWRITE |
| Design News Feed | 1 | 8/155 | REWRITE |
| Design Notification System | 1 | 9/156 | REWRITE |
| Design Payment System | 2 | 25/188 | REWRITE |
| Design URL Shortener | 1 | 9/156 | REWRITE |
| How to Answer System Design | 2 | 19/173 | POLISH |
| System Design Practice Content Table | 2 | 53/95 | MERGE |

## advance backend / testing strategy

| Note | Depth | Real lines / total | Verdict |
| --- | --- | --- | --- |
| Chaos Testing | 1 | 8/163 | REWRITE |
| Contract Testing | 1 | 8/163 | REWRITE |
| Load Testing | 1 | 7/155 | REWRITE |
| Test Data Strategy | 1 | 6/154 | REWRITE |
| Testing Pyramid | 1 | 5/153 | REWRITE |
| Testing Strategy Content Table | 0 | 7/13 | DELETE |
| Unit Integration E2E Tests | 1 | 6/154 | REWRITE |
