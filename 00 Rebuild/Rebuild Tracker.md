---
tags: [rebuild/tracker]
updated: 2026-11-02
---

# Rebuild Tracker

> [!info] How to use
> Every note the new vault will contain, in learning order inside each folder. Tick a box when the note is written, verified, and linked from its folder map. `from:` names the old notes it replaces; their per-note review is in the audit files linked from [[Rebuild Plan]].
> 🆕 = topic the vault never covered · Levels: **B** basic · **I** intermediate · **A** advanced

**Scope:** 373 topic notes + 19 folder maps (MOC) + Home. Rewrite order is in [[Rebuild Plan#5. Rewrite order]].

## 00 Home

- [x] **Home** · B · ✅ · from: START HERE - Advanced Backend SDE3 Path, Advancxe backend content table (nav part), SDE3 Backend Roadmap (+ Excalidraw)
- [x] **Conventions** · B 🆕 · ✅ · from: NEW
- [x] **Progress** · - 🆕 · from: NEW
- [x] **Templates/Topic Note** · - 🆕 · from: NEW
- [x] **Templates/MOC** · - 🆕 · from: NEW
- [x] **README (repo root, GitHub landing page)** · - · from: README.md (today only the title "System_Design_notes")

## 01 CS Fundamentals · 27 notes

- [x] **01 CS Fundamentals MOC** · - · ✅ · from: folder map, written last
- [x] **How a Computer Runs a Program** · B · ✅ · from: NEW (fetch-decode-execute; compile, link, load; Go static binaries)
- [x] **Memory Hierarchy and CPU Caches** · B · ✅ · from: Memory, type of cache (L1–L3 part), data structure/cache (image), SRAM (part)
- [x] **RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM** · B · ✅ · from: RAM, SRAM, DRAM, DDR SDRAM, GDDRM SDRM
- [x] **ROM, Flash, Firmware and the Boot Process** · B · ✅ · from: ROM, Firewares, BIOS
- [x] **Storage Devices - HDD, SSD, NVMe** · B · ✅ · from: Storages, HDD
- [x] **Latency Numbers Every Engineer Should Know** · B · ✅ · from: what is latency
- [x] **Number Representation and Text Encoding** · B 🆕 · ✅ · from: NEW
- [x] **Processes, Threads and Context Switching** · I 🆕 · ✅ · from: NEW
- [x] **System Calls and User vs Kernel Mode** · I 🆕 · ✅ · from: NEW
- [x] **Virtual Memory, Paging and the TLB** · I · ✅ · from: cache used for (TLB image), Memory (corrected)
- [x] **Process Memory Layout - Stack vs Heap** · I 🆕 · ✅ · from: NEW (link to Go escape analysis)
- [x] **Page Cache, File Systems and fsync** · I · ✅ · from: type of cache (page/inode cache part)
- [x] **CPU Scheduling** · I 🆕 · ✅ · from: NEW
- [x] **Concurrency Primitives - Mutex, Semaphore, Atomics** · I 🆕 · ✅ · from: NEW
- [x] **I-O Models - Blocking, epoll, io_uring and the Go Netpoller** · A 🆕 · ✅ · from: NEW
- [x] **Complexity Analysis - Big-O and Amortized Cost** · B 🆕 · ✅ · from: NEW
- [x] **Data Structures Overview and Big-O Cheat Sheet** · B · ✅ · from: Data structure content table (overview image)
- [x] **Arrays and Dynamic Arrays (Go Slices)** · B · ✅ · from: array
- [x] **Linked Lists** · B · ✅ · from: List
- [x] **Stacks, Queues and Deques** · B · ✅ · from: stack, queue
- [x] **Hash Tables and Go Maps** · I · ✅ · from: hash table
- [x] **Trees, BSTs and Balanced Trees** · I · ✅ · from: tree
- [x] **Heaps and Priority Queues** · I · ✅ · from: heaps
- [x] **Graphs and Graph Algorithms** · I · ✅ · from: graph
- [x] **Tries, Suffix Trees and Suffix Arrays** · A · ✅ · from: sufux tree
- [x] **Union-Find and Skip Lists** · A 🆕 · ✅ · from: NEW
- [x] **Sorting, Searching and Interview Patterns** · I 🆕 · ✅ · from: NEW

## 02 Networking & Web · 14 notes

- [x] **02 Networking & Web MOC** · - · ✅ · from: folder map, written last
- [x] **How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP** · B 🆕 · ✅ · from: NEW
- [x] **IP Addressing, Subnets, NAT and VPC Basics** · B 🆕 · ✅ · from: NEW
- [x] **DNS - Resolution, Records and Caching** · B · ✅ · from: work_DNS, whtat DNS (+ the DNS half of aws/Domain DNS HTTPS SSL TLS)
- [x] **TCP - Handshake, Reliability, Flow and Congestion Control** · I 🆕 · ✅ · from: NEW
- [x] **UDP and QUIC** · I 🆕 · ✅ · from: NEW
- [x] **HTTP Fundamentals - Methods, Status Codes, Headers, Cookies** · B 🆕 · ✅ · from: NEW
- [x] **HTTP-1.1 vs HTTP-2 vs HTTP-3** · I 🆕 · ✅ · from: NEW
- [x] **TLS and HTTPS** · I · ✅ · from: Domain DNS HTTPS SSL TLS (+ Go HTTPS HTTP2 TLS Server concepts); its DNS part feeds the bbg DNS note; NEW (+ the TLS half of aws/Domain DNS HTTPS SSL TLS)
- [x] **HTTP Caching - Cache-Control, ETag, Conditional Requests** · I 🆕 · ✅ · from: NEW
- [x] **CDN and Edge** · I · ✅ · from: CDN, Global CDN and Edge (+ bbg `React Theory/CDN`); React/CDN (+ api design/CDN, api design/Global CDN and Edge, the CDN part of real_cache)
- [x] **Forward and Reverse Proxies - L4 vs L7** · I · ✅ · from: Reverse Proxy vs Forward Proxy; other areas (api design/Reverse Proxy vs Forward Proxy, system design/Load Balancer)
- [x] **Nginx** · I · ✅ · from: Nginx
- [x] **What Happens When You Type a URL** · I 🆕 · ✅ · from: NEW (capstone: DNS → TCP → TLS → HTTP → CDN → render)
- [x] **Network Debugging Toolkit - dig, curl, ss, tcpdump** · A 🆕 · ✅ · from: NEW

## 03 Frontend · 12 notes

- [x] **03 Frontend MOC** · - · ✅ · from: folder map, written last
- [x] **How Browsers Load and Render a Page** · B · ✅ · from: asyncVSdeffer, the Real DOM part of Real_virtual
- [x] **CSS Fundamentals - Cascade, Selectors, Box Model** · B · ✅ · from: Types, CLASS_ID, styles, inline_block, sudo class, shadows
- [x] **CSS Layout - Position, Flexbox, Grid** · B · ✅ · from: Position, flex, grid
- [x] **JavaScript Core - Types, Scope, Hoisting, Closures, this** · B · ✅ · from: variables, strings, Promitive_non_Primitive_Types, functions, scope, core_Concepts (JS parts)
- [x] **JavaScript Objects, Arrays and Iteration** · B · ✅ · from: Objects, Arrays, Loops, filters
- [x] **DOM, Events and Timers** · B · ✅ · from: Dom
- [x] **JavaScript Async - Event Loop, Promises, async-await** · I · ✅ · from: Promises, async_await
- [x] **React Fundamentals - Components, JSX, Props, State** · B · ✅ · from: core_Concepts
- [x] **React Hooks** · I · ✅ · from: hooks
- [x] **React Rendering - Virtual DOM, Reconciliation, Lifecycle** · I · ✅ · from: Real_virtual, LIFE_Of _REact
- [x] **React State Management - Props, Context, Redux** · I · ✅ · from: Prop dilling, redux
- [x] **React Routing and Rendering Strategies - CSR, SSR, SSG** · I · ✅ · from: routing, core_Concepts (SPA, client vs server routing, lazy/Suspense)

## 04 Go Language · 23 notes

- [x] **04 Go Language MOC** · - · ✅ · from: folder map, written last
- [x] **Go Toolchain, Tooling and Debugging** · B · ✅ · from: Go Developer Tooling Git VSCode CLI, Go Source Code Reading Debugging, Go Language Basics (commands)
- [x] **Syntax, Types and Control Flow** · B · ✅ · from: Go Language Basics
- [x] **Functions, Closures, Defer, Panic and Recover** · B · ✅ · from: Go Deep Basics Functions Defer Panic Recover, Go Language Basics (functions, init)
- [x] **Arrays, Slices and Maps (with internals)** · B · ✅ · from: Go Language Basics (collections, make/new, nil, range) + NEW internals section
- [x] **Strings, Bytes, Runes and Unicode** · B · ✅ · from: Go Strings Runes Time Files, Go Language Basics (range over string)
- [x] **Structs, Methods and Embedding** · B · ✅ · from: Go Types Structs Interfaces, Go Language Basics (custom types, aliases, tags)
- [x] **Pointers, Values and Escape Analysis** · I · ✅ · from: Go Pointers Memory Values
- [x] **Interfaces** · I · ✅ · from: Go Types Structs Interfaces, LLD `Error Handling and Interfaces in Go LLD` (Part 1)
- [x] **Error Handling** · I · ✅ · from: Go Error Handling, LLD `Error Handling and Interfaces in Go LLD` (Part 2); Error Handling and Interfaces in Go LLD (errors half), merged with the Go-backend errors note (other reviewer)
- [x] **Packages, Modules and Dependency Management** · I · ✅ · from: Go Project Structure and Modules (modules)
- [x] **Standard Library Essentials (time, io, files, encoding)** · I · ✅ · from: Go Strings Runes Time Files (time, files), Go Language Basics (io packages), Go Bootcamp Course Coverage Map (topic list)
- [x] **Testing in Go** · I · ✅ · from: Go Testing, LLD `Testing LLD Code in Go`
- [x] **Goroutines and Channels** · I · ✅ · from: Go Concurrency Goroutines Channels
- [x] **select and Concurrency Patterns** · I · ✅ · from: Go Concurrency Goroutines Channels, LLD `Concurrency in Go LLD` (worker pool), Go Worker Queues and Background Jobs (in-process pool)
- [x] **sync Primitives and Atomics** · I 🆕 · ✅ · from: NEW (+ LLD `Concurrency in Go LLD` mutex and atomic code, LLD `Singleton Pattern in Go` sync.Once)
- [x] **Context Package** · I · ✅ · from: Go Context Package
- [x] **Generics and Iterators** · I · ✅ · from: Go Generics Reflection Runtime (generics)
- [x] **Memory Model and Data Races** · A 🆕 · ✅ · from: NEW
- [x] **Reflection and unsafe** · A · ✅ · from: Go Generics Reflection Runtime (reflection)
- [x] **Runtime - Goroutine Scheduler (GMP)** · A 🆕 · ✅ · from: NEW (only topic names exist in Go Generics Reflection Runtime)
- [x] **Runtime - Memory Allocator and Garbage Collector** · A 🆕 · ✅ · from: NEW
- [x] **Benchmarks, Profiling and Tracing** · I · ✅ · from: Profiling (+ pprof part of Go Benchmarking wrk h2load ghz pprof); performance/Profiling, golang backend/Go Benchmarking wrk h2load ghz pprof (pprof half); Go Benchmarking wrk h2load ghz pprof (Go parts)
- [x] **Modern Go Feature Timeline (1.18-1.25)** · I 🆕 · ✅ · from: NEW

## 05 APIs · 15 notes

- [x] **05 APIs MOC** · - · ✅ · from: folder map, written last
- [x] **Choosing an API Style** · B · ✅ · from: Api architecture cntent table
- [x] **REST and HTTP API Design** · B · ✅ · from: REST API (+ bbg REST ×3; Go REST code → 06); what is rest, use of rest (+ Api architecture/REST API; Go REST coding stays in 06)
- [x] **API Contract Design and OpenAPI** · I · ✅ · from: API Contract Design, API Design Content Table
- [x] **API Error Handling** · I · ✅ · from: API Error Handling
- [x] **Pagination, Filtering and Sorting** · I · ✅ · from: Pagination
- [x] **API Versioning and Backward Compatibility** · I · ✅ · from: API Versioning
- [x] **Idempotency and Idempotency Keys** · I · ✅ · from: NEW here (source: `reliability/Idempotency`, `Go Webhooks Idempotency`, other reviewers); Idempotency (+ webhook example from Reliability Content Table)
- [x] **File Upload Architecture** · I · ✅ · from: File Upload Architecture (+ Go File Uploads, AWS S3 presign part)
- [x] **Webhooks - Sending and Receiving** · I · ✅ · from: Webhooks, Webhook Processing (+ Go Webhooks Idempotency)
- [x] **SOAP and WSDL (Legacy Integrations)** · B · ✅ · from: SOAP
- [x] **GraphQL** · I · ✅ · from: GRAPHQL (+ Go GraphQL Backend concepts); Go GraphQL Backend
- [x] **gRPC** · I/A · ✅ · from: GRPC (+ concept parts of the 10 Go gRPC/proto notes)
- [x] **Protocol Buffers and Schema Evolution** · I · ✅ · from: Go Protocol Buffers Deep Dive, Go Proto Versioning Best Practices
- [x] **Real-time APIs - WebSocket, SSE and Long Polling** · I/A · ✅ · from: WEBSOCKET (+ reliability/WebSocket Scaling, Go WebSocket Realtime)
- [x] **API Gateway and BFF** · A · ✅ · from: API Gateway

## 06 Backend Engineering in Go · 29 notes

- [x] **06 Backend Engineering in Go MOC** · - · ✅ · from: folder map, written last
- [x] **Backend Request Lifecycle and Layering** · B · ✅ · from: Basic backend content table
- [x] **Service Project Layout and Wiring** · B · ✅ · from: Go Project Structure and Modules (layout)
- [x] **Configuration and Secrets** · B · ✅ · from: Go Configuration Environment
- [x] **HTTP Server Fundamentals (net-http)** · B · ✅ · from: Go HTTP Server, Go REST API Coding (routing)
- [x] **Building REST Endpoints** · B · ✅ · from: Go REST API Coding, Go Error Handling (HTTP table), LLD `Error Handling and Interfaces in Go LLD` (HTTPStatus)
- [x] **Request Decoding, Validation and DTOs** · I · ✅ · from: Go JSON Validation DTOs
- [x] **Middleware** · I · ✅ · from: Go Middleware, Go Deep Basics Functions Defer Panic Recover (recover middleware)
- [x] **OpenAPI-First Development in Go** · I · ✅ · from: Go OpenAPI Documentation
- [x] **Database Access (database-sql, pgx, sqlc)** · I · ✅ · from: Go Database SQL
- [x] **Transactions and the Repository Pattern** · I · ✅ · from: Go Transactions and Repository Pattern, Go SQL NoSQL API Practice (exercise)
- [x] **Schema Migrations in Go Services** · I · ✅ · from: Go Database Migrations
- [x] **Testing Go Services** · I · ✅ · from: Go Testing (handler and repository parts), Go gRPC Testing Tools Postman grpcurl
- [x] **Authentication and Authorization in Go** · I · ✅ · from: Go Auth JWT Sessions, Go Password Hashing (Go code)
- [x] **Calling External APIs** · I · ✅ · from: Go API Client External Calls
- [x] **Redis in Go** · I · ✅ · from: Go Redis Cache Queue Rate Limit
- [x] **Background Workers and Job Queues** · I · ✅ · from: Go Worker Queues and Background Jobs
- [x] **Scheduled Jobs** · I · ✅ · from: Go Cron Scheduled Jobs
- [x] **Receiving Webhooks Idempotently** · I · ✅ · from: Go Webhooks Idempotency, Go Security for Backend (webhook steps)
- [x] **File Uploads and Object Storage** · I · ✅ · from: Go File Uploads
- [x] **Observability in Go Services** · I · ✅ · from: Go Logging Observability, Go OpenTelemetry Metrics Tracing
- [x] **Graceful Shutdown and Health Checks** · I · ✅ · from: Go Graceful Shutdown
- [x] **TLS, HTTPS and HTTP2 in Go Servers** · I · ✅ · from: Go HTTPS HTTP2 TLS Server
- [x] **Containerizing Go Services** · I · ✅ · from: Go Deployment Docker
- [x] **Secure Coding for Go Services** · A · ✅ · from: Go Security for Backend
- [x] **gRPC Services in Go** · I · ✅ · from: Go gRPC Services, Go gRPC Deep Dive, Go gRPC TLS Metadata Deadlines, Go gRPC Testing Tools Postman grpcurl, Go Protoc Code Generation, Go Protobuf Validation
- [x] **gRPC Streaming in Go** · A · ✅ · from: Go gRPC Streaming Patterns
- [x] **Serving REST and gRPC Together** · A · ✅ · from: Go gRPC Gateway REST Combo API
- [x] **WebSockets and SSE in Go** · A · ✅ · from: Go WebSocket Realtime
- [x] **Capstone - InvoiceOps** · A · ✅ · from: InvoiceOps Golang Project Plan, Go Backend Coding Roadmap, Go Bootcamp Coding Checklist

## 07 Databases · 23 notes

- [x] **07 Databases MOC** · - · ✅ · from: folder map, written last
- [x] **SQL Essentials** · B 🆕 · ✅ · from: NEW
- [x] **SQL vs NoSQL** · B · ✅ · from: SQL vs NoSQL
- [x] **Relational Schema Design** · B · ✅ · from: Schema Design, Data Modeling Content Table
- [x] **Transactions and ACID** · B · ✅ · from: Transactions
- [x] **Indexing Fundamentals** · B · ✅ · from: Database Indexing (+ basics from Advanced Index Types)
- [x] **Storage Engines - B-tree vs LSM and WAL** · I 🆕 · ✅ · from: NEW
- [x] **Isolation Levels and MVCC** · I 🆕 · ✅ · from: NEW
- [x] **Locking - Optimistic vs Pessimistic** · I · ✅ · from: Optimistic and Pessimistic Locking
- [x] **Query Plans and EXPLAIN** · I · ✅ · from: Query Plans and EXPLAIN
- [x] **Index Types and Index Design** · I · ✅ · from: Advanced Index Types
- [x] **N+1 Query Problem** · I · ✅ · from: N Plus One Query Problem
- [x] **Connection Pooling** · I · ✅ · from: Connection Pooling
- [x] **Zero-Downtime Schema Migrations** · I · ✅ · from: Database Migration
- [x] **Backup, PITR and Disaster Recovery** · I · ✅ · from: Backup and Restore
- [x] **Materialized Views and Denormalization** · I · ✅ · from: Materialized Views
- [x] **NoSQL Data Modeling** · I · ✅ · from: NoSQL Data Modeling
- [x] **Replication** · I · ✅ · from: Database Replication
- [x] **Partitioning and Sharding** · A · ✅ · from: Sharding Patterns, Database Sharding
- [x] **Consistent Hashing** · A · ✅ · from: `00 Rebuild/Sample - Consistent Hashing` (replaces Consistent Hashing)
- [x] **Wide-Column Stores and Cassandra** · A · ✅ · from: Cassandra and Wide Column Stores
- [x] **Search Engines and Inverted Indexes** · A · ✅ · from: Search Architecture, Search Indexes
- [x] **Time-Series and Columnar Storage** · A · ✅ · from: Time Series and Analytics Storage
- [x] **Distributed SQL** · A 🆕 · ✅ · from: NEW

## 08 Caching & Redis · 12 notes

- [x] **08 Caching & Redis MOC** · - · ✅ · from: folder map, written last
- [x] **Caching Fundamentals** · B · ✅ · from: Caching Patterns and Types (locations) + bbg cache folder (other reviewer); real_cache, cache used for (text part)
- [x] **Redis Fundamentals** · B · ✅ · from: what is redis
- [x] **Redis Hands-on Setup with Go** · B · ✅ · from: redis setup
- [x] **Caching Patterns** · I · ✅ · from: Caching Patterns and Types, API Caching with Redis
- [x] **Cache Invalidation, TTL and Consistency** · I · ✅ · from: Caching Patterns and Types
- [x] **Cache Eviction Policies - LRU, LFU, TTL** · I · ✅ · from: Caching Patterns and Types (+ LLD LRU Cache link); data structure/cache (text part)
- [x] **Redis Data Structures and When to Use Each** · I · ✅ · from: what is redis, redis Content table (data-choice table), uses of redis
- [x] **Redis Use Cases** · I · ✅ · from: uses of redis, redis setup headings
- [x] **Redis Persistence - RDB and AOF** · I 🆕 · ✅ · from: NEW
- [x] **Cache Failure Modes - Stampede, Avalanche, Penetration, Hot and Big Keys** · A · ✅ · from: Caching Patterns and Types (stampede) + `performance/Cache Stampede Avalanche Penetration` (other reviewer); Cache Stampede Avalanche Penetration (+ stampede section of Caching Patterns and Types)
- [x] **Redis Replication, Sentinel and Cluster** · A 🆕 · ✅ · from: NEW + AWS ElastiCache
- [x] **Redis in Production - Memory, Latency, Security** · A 🆕 · ✅ · from: NEW (+ redis setup production points)

## 09 Messaging & Async · 15 notes

- [x] **09 Messaging & Async MOC** · - · ✅ · from: folder map, written last
- [x] **Queues vs Streams and Broker Comparison** · B · ✅ · from: Message Broker Comparison
- [x] **Event-Driven Architecture Basics** · B 🆕 · ✅ · from: NEW
- [x] **Background Jobs and Worker Pools** · B · ✅ · from: Background Jobs, Worker Architecture
- [x] **Redis as a Queue - Lists, Streams and Pub-Sub** · I · ✅ · from: Message Queue with Redis
- [x] **Delivery Semantics and Exactly-Once** · I · ✅ · from: Exactly Once Myth
- [x] **Dead Letter Queues and Poison Messages** · I · ✅ · from: Dead Letter Queue
- [x] **Scheduled Jobs - Cron to Durable Schedulers** · I · ✅ · from: Cron Jobs, Durable Job Scheduler
- [x] **Backpressure and Flow Control** · I · ✅ · from: Backpressure
- [x] **Message Ordering and Partition Keys** · I 🆕 · ✅ · from: NEW
- [x] **Transactional Outbox and CDC** · A · ✅ · from: Outbox Pattern
- [x] **Kafka and Event Streaming** · A · ✅ · from: Event Streaming
- [x] **AWS SQS, SNS and EventBridge** · I 🆕 · ✅ · from: NEW
- [x] **Event Schemas and Schema Registry** · A · ✅ · from: Schema Registry
- [x] **Workflow Engines and Durable Execution** · A 🆕 · ✅ · from: NEW
- [x] **Stream Processing Basics** · A 🆕 · ✅ · from: NEW

## 10 Distributed Systems & Resilience · 20 notes

- [x] **10 Distributed Systems & Resilience MOC** · - · ✅ · from: folder map, written last
- [x] **Distributed Systems Fundamentals** · B 🆕 · ✅ · from: NEW
- [x] **Timeouts, Retries and Backoff** · B · ✅ · from: Retry and Backoff
- [x] **Circuit Breaker** · B · ✅ · from: Circuit Breaker
- [x] **Bulkheads and Concurrency Limits** · I · ✅ · from: Thread Pools and Blocking IO
- [x] **Load Shedding and Graceful Degradation** · I · ✅ · from: Graceful Degradation
- [x] **CAP and PACELC** · B · ✅ · from: CAP Theorem
- [x] **Consistency Models** · I · ✅ · from: Consistency Models
- [x] **High Availability and Failover** · I · ✅ · from: High Availability and Failover
- [x] **Quorums and Leaderless Replication** · I · ✅ · from: Quorum Reads and Writes
- [x] **Clocks and Ordering** · A · ✅ · from: Clock Skew and Time
- [x] **Consensus - Raft and Paxos** · A · ✅ · from: Consensus
- [x] **Leader Election** · A · ✅ · from: Leader Election
- [x] **Distributed Locks and Fencing Tokens** · A · ✅ · from: Distributed Locks
- [x] **Two-Phase Commit** · A 🆕 · ✅ · from: NEW
- [x] **Saga Pattern** · A · ✅ · from: Saga Pattern
- [x] **CQRS** · A · ✅ · from: CQRS
- [x] **Event Sourcing** · A · ✅ · from: Event Sourcing
- [x] **CRDTs and Conflict Resolution** · A 🆕 · ✅ · from: NEW
- [x] **Failure Detection, Gossip and Membership** · A 🆕 · ✅ · from: NEW
- [x] **Multi-Region Architecture** · A · ✅ · from: Multi Region Architecture

## 11 System Design · 29 notes

- [x] **11 System Design MOC** · - · ✅ · from: folder map, written last
- [x] **System Design Fundamentals** · B · ✅ · from: System Design introduction, System Design Content Table
- [x] **Scaling Basics** · B · ✅ · from: Scaling Concepts
- [x] **Back-of-the-Envelope Estimation** · B · ✅ · from: Capacity Estimation
- [x] **Load Balancing** · B · ✅ · from: Load Balancer
- [x] **System Design Interview Framework** · B · ✅ · from: How to Answer System Design, System Design Practice Content Table
- [x] **Unique ID Generation** · I 🆕 · ✅ · from: NEW
- [x] **Rate Limiting - Algorithms and Distributed Design** · I/A · ✅ · from: Rate limiting with Redis (+ `LLD with Go/practice/Rate Limiter LLD in Go` concepts, API Abuse layering)
- [x] **Bloom Filters and Probabilistic Data Structures** · I · ✅ · from: Bloom/sketch part of bbg data-structure notes
- [x] **Service Discovery** · I 🆕 · ✅ · from: NEW
- [x] **Hot Keys and Hot Partitions** · A · ✅ · from: Hot Keys and Hot Partitions
- [x] **Scaling WebSockets** · A · ✅ · from: WebSocket Scaling
- [x] **Geospatial Indexing** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - URL Shortener** · B · ✅ · from: Design URL Shortener
- [x] **Case Study - Notification System** · I · ✅ · from: Design Notification System
- [x] **Case Study - Key-Value Store** · I 🆕 · ✅ · from: NEW
- [x] **Case Study - Search Autocomplete** · I 🆕 · ✅ · from: NEW
- [x] **Case Study - News Feed** · I · ✅ · from: Design News Feed
- [x] **Case Study - Chat System** · I · ✅ · from: Design Chat System
- [x] **Case Study - Ticket Booking** · I 🆕 · ✅ · from: NEW
- [x] **Case Study - Leaderboard and Top-K** · I 🆕 · ✅ · from: NEW
- [x] **Case Study - Payment System** · A · ✅ · from: Design Payment System
- [x] **Case Study - File Storage and Sync** · A · ✅ · from: Design File Storage
- [x] **Case Study - Web Crawler** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Ride Sharing and Proximity** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Distributed Job Scheduler** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Metrics and Logging Platform** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Video Streaming** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Distributed Message Queue** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Ad Click Aggregation** · A 🆕 · ✅ · from: NEW

## 12 Security & Auth · 12 notes

- [x] **12 Security & Auth MOC** · - · ✅ · from: folder map, written last
- [x] **Authentication vs Authorization** · B · ✅ · from: Authentication vs Authorization
- [x] **Password Storage and Login Security** · I · ✅ · from: NEW; Go Password Hashing (the only password-hashing note in the vault)
- [x] **Sessions and Cookies** · I · ✅ · from: Sessions and Cookies
- [x] **JWT - Structure, Validation and Pitfalls** · I · ✅ · from: JWT (+ Go Auth JWT Sessions concepts)
- [x] **Access and Refresh Tokens** · I · ✅ · from: Refresh Token and Access Token, Auth Security Content Table (checklist)
- [x] **CORS and Same-Origin Policy** · I · ✅ · from: CORS; NEW (or put it in 12 Security)
- [x] **CSRF, XSS and Security Headers** · I 🆕 · ✅ · from: NEW
- [x] **OWASP API Security Top 10** · I 🆕 · ✅ · from: NEW
- [x] **Secrets Management** · I · ✅ · from: Secrets Management
- [x] **OAuth 2.0 and OpenID Connect** · A · ✅ · from: OAuth
- [x] **Service-to-Service Auth - API Keys, HMAC, mTLS** · A 🆕 · ✅ · from: NEW
- [x] **API Abuse and Bot Protection** · A · ✅ · from: API Abuse and Bot Protection

## 13 DevOps & Cloud · 29 notes

- [x] **13 DevOps & Cloud MOC** · - · ✅ · from: folder map, written last
- [x] **Cloud Computing Basics** · B · ✅ · from: Cloud computing
- [x] **Cloud Native and the 12-Factor App** · I · ✅ · from: cloudnative, Pillars of Cloud Native, images from cloud native content table
- [x] **Docker/Docker 01 - Why Containers** · B · ✅ · from: DOCKER WHY
- [x] **Docker/Docker 02 - Images, Layers and Containers** · B · ✅ · from: Docker_Image_Container (+ layer part of how docker Works)
- [x] **Docker/Docker 03 - CLI Essentials** · B · ✅ · from: DOCKER_CODE
- [x] **Docker/Docker 04 - Writing a Production Dockerfile for Go** · I · ✅ · from: how to dockerize, Docker Multi-stage Build, Docker Content Table (checklist) (+ Go Deployment Docker)
- [x] **Docker/Docker 05 - Networking and Port Publishing** · I · ✅ · from: Docker Network, Porting mapping
- [x] **Docker/Docker 06 - Volumes and Bind Mounts** · I · ✅ · from: DOCKER Volums
- [x] **Docker/Docker 07 - Docker Compose for Local Development** · I · ✅ · from: docker comnpose
- [x] **Docker/Docker 08 - How Docker Works Under the Hood** · A · ✅ · from: how docker Works
- [x] **Docker/Docker 09 - Container Security and Hardening** · A · ✅ · from: Docker Security Basics
- [x] **Delivery and Kubernetes/CI-CD Pipelines (GitHub Actions for Go)** · I · ✅ · from: CI CD Pipeline
- [x] **Delivery and Kubernetes/Deployment Strategies - Rolling, Blue-Green, Canary** · I · ✅ · from: Canary Deployment, Blue Green Deployment
- [x] **Delivery and Kubernetes/Feature Flags** · I · ✅ · from: Feature Flags
- [x] **Delivery and Kubernetes/Rollback and Safe Migrations** · I/A · ✅ · from: Rollback Strategy
- [x] **Delivery and Kubernetes/Kubernetes Fundamentals** · I · ✅ · from: Kubernetes Basics
- [x] **Delivery and Kubernetes/Autoscaling** · I/A · ✅ · from: Autoscaling
- [x] **AWS/AWS 01 - Core Concepts (Regions, AZs, Accounts, Shared Responsibility)** · B 🆕 · ✅ · from: NEW
- [x] **AWS/AWS 02 - IAM** · B/I · ✅ · from: AWS IAM
- [x] **AWS/AWS 03 - VPC Networking** · I 🆕 · ✅ · from: NEW
- [x] **AWS/AWS 04 - Compute Choices - EC2, ECS-Fargate, EKS, Lambda** · I 🆕 · ✅ · from: NEW (+ AWS Deployment glossary)
- [x] **AWS/AWS 05 - ECS, Fargate and ECR** · I · ✅ · from: ECR and ECS
- [x] **AWS/AWS 06 - Load Balancing (ALB vs NLB)** · I 🆕 · ✅ · from: NEW
- [x] **AWS/AWS 07 - S3** · B/I · ✅ · from: AWS S3
- [x] **AWS/AWS 08 - RDS and Aurora** · I · ✅ · from: AWS RDS
- [x] **AWS/AWS 09 - Route 53 and ACM** · B · ✅ · from: Domain DNS HTTPS SSL TLS (AWS part)
- [x] **AWS/AWS 10 - CloudWatch** · I · ✅ · from: AWS CloudWatch
- [x] **AWS/Infrastructure as Code with Terraform** · I 🆕 · ✅ · from: NEW
- [x] **AWS/Deploying a Go API on AWS (Reference Architecture)** · A · ✅ · from: Production Architecture, AWS Deployment, Cloud Deployment Content Table

## 14 Observability & SRE · 14 notes

- [x] **14 Observability & SRE MOC** · - · ✅ · from: folder map, written last
- [x] **Observability Fundamentals** · B · ✅ · from: Logs Metrics Traces
- [x] **Structured Logging** · B · ✅ · from: Logs Metrics Traces, golang backend/Go Logging Observability
- [x] **Metrics and Prometheus** · B · ✅ · from: Logs Metrics Traces, Monitoring and Alerting (monitoring half), NEW
- [x] **Distributed Tracing with OpenTelemetry** · I · ✅ · from: Logs Metrics Traces (OTel callout), golang backend/Go OpenTelemetry Metrics Tracing
- [x] **SLIs, SLOs, SLAs and Error Budgets** · I · ✅ · from: SLO SLA SLI
- [x] **Alerting and On-Call** · I · ✅ · from: Monitoring and Alerting
- [x] **Incident Response** · I · ✅ · from: Incident Response, Production Debugging Content Table
- [x] **Production Debugging Playbook** · I · ✅ · from: Production Debugging Playbook, Production Debugging Content Table, Latency Debugging ("questions to ask")
- [x] **Latency, Percentiles and Bottleneck Analysis** · I · ✅ · from: Latency Debugging, performance/Bottleneck Analysis
- [x] **Postmortems and Root Cause Analysis** · I · ✅ · from: Postmortems, Root Cause Analysis
- [x] **Debugging Database Performance** · A · ✅ · from: Database Performance Debugging
- [x] **Debugging Memory Leaks and OOMs in Go** · A · ✅ · from: Memory Leak Debugging
- [x] **Performance Engineering and Capacity Planning** · I · ✅ · from: Bottleneck Analysis, Performance Engineering Content Table; performance/Performance Engineering Content Table, performance/Capacity Estimation (capacity-planning half; the back-of-envelope half goes to 11)
- [x] **Production Readiness Review** · A 🆕 · ✅ · from: NEW

## 15 Testing · 10 notes

- [x] **15 Testing MOC** · - · ✅ · from: folder map, written last
- [x] **Testing Strategy and the Test Pyramid** · B · ✅ · from: Testing Pyramid, Testing Strategy Content Table, the shared testing Q&A bank
- [x] **Unit, Integration and E2E Tests** · B · ✅ · from: Unit Integration E2E Tests (links 04 for `testing` package basics)
- [x] **Test Doubles and Mocking in Go** · B 🆕 · ✅ · from: NEW
- [x] **Test Data Strategy** · I · ✅ · from: Test Data Strategy
- [x] **Contract Testing** · I · ✅ · from: Contract Testing
- [x] **Fuzz and Property-Based Testing** · I 🆕 · ✅ · from: NEW
- [x] **Testing Async and Event-Driven Systems** · I 🆕 · ✅ · from: NEW
- [x] **Load and Performance Testing** · I · ✅ · from: Load Testing, golang backend/Go Benchmarking wrk h2load ghz pprof (load-tool half); Go Benchmarking wrk h2load ghz pprof (wrk/h2load/ghz part)
- [x] **Chaos Engineering** · A · ✅ · from: Chaos Testing
- [x] **Testing in CI-CD, Flaky Tests and Testing in Production** · A 🆕 · from: NEW

## 16 Software Architecture · 13 notes

- [x] **16 Software Architecture MOC** · - · ✅ · from: folder map, written last
- [x] **Architecture Fundamentals - Coupling, Cohesion and Dependency Direction** · B · ✅ · from: Architecture Patterns Content Table, NEW
- [x] **Inversion of Control - Library vs Framework** · B · ✅ · from: lib_frame
- [x] **Monolith vs Microservices** · B · ✅ · from: Monolith and Microservices (+ bbg `React/React Theory/mcroservise_monolith`); system design/Monolith and Microservices, bbg React/mcroservise_monolith (other reviewers); mcroservise_monolith (+ system design/Monolith and Microservices)
- [x] **Layered Architecture** · B · ✅ · from: Layered Architecture
- [x] **Hexagonal Architecture (Ports and Adapters)** · I · ✅ · from: Hexagonal Architecture, Architecture Patterns Content Table (InvoiceOps ports)
- [x] **Clean Architecture** · I · ✅ · from: Clean Architecture (with an onion comparison)
- [x] **Architecture Decision Records** · I · ✅ · from: Architecture Decision Records
- [x] **Domain-Driven Design - Strategic Design** · I · ✅ · from: Domain Driven Design
- [x] **Domain-Driven Design - Tactical Patterns in Go** · A · ✅ · from: Domain Driven Design
- [x] **Modular Monolith** · A 🆕 · ✅ · from: NEW
- [x] **Strangler Fig Pattern and Legacy Migration** · A · ✅ · from: Strangler Fig Pattern
- [x] **Documenting Architecture - C4 Diagrams and Fitness Functions** · A 🆕 · ✅ · from: NEW

## 17 LLD · 51 notes

- [x] **17 LLD MOC** · - · ✅ · from: folder map, written last
- [x] **LLD Interview Method** · B · ✅ · from: LLD Interview Approach in Go, LLD Practice Roadmap (10 steps), Go LLD Folder Structure for Practice
- [x] **OOP in Go - Structs, Interfaces, Embedding** · B · ✅ · from: Go LLD Mental Model, Error Handling and Interfaces in Go LLD (interfaces half), CodeWithAryan map + UML (Java→Go tables)
- [x] **Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion** · B · ✅ · from: DRY, KISS, YAGNI Principle notes + NEW (cohesion/coupling, Law of Demeter, composition over inheritance)
- [x] **SOLID in Go** · B · ✅ · from: SOLID Principles in Go LLD
- [x] **UML for LLD** · B · ✅ · from: UML for LLD Interviews
- [x] **Design Patterns Overview and Chooser** · B · ✅ · from: Creational, Structural, Behavioral Patterns in Go; Content Table (pattern → backend table)
- [x] **Patterns/Strategy and Template Method** · I · ✅ · from: Strategy Pattern in Go, Template Method Pattern in Go
- [x] **Patterns/Factory and Abstract Factory** · I · ✅ · from: Factory Pattern in Go, Abstract Factory Pattern in Go
- [x] **Patterns/Builder and Functional Options** · I · ✅ · from: Builder and Functional Options Pattern in Go
- [x] **Patterns/Singleton and sync.Once** · I · ✅ · from: Singleton Pattern in Go
- [x] **Patterns/Adapter** · I · ✅ · from: Adapter Pattern in Go
- [x] **Patterns/Decorator and Middleware** · I · ✅ · from: Decorator Middleware Pattern in Go
- [x] **Patterns/Proxy** · I · ✅ · from: Proxy Pattern in Go
- [x] **Patterns/Facade (vs Mediator)** · I · ✅ · from: Facade Pattern in Go, Mediator Pattern in Go
- [x] **Patterns/Composite** · I · ✅ · from: Composite Pattern in Go
- [x] **Patterns/Observer and Event Bus** · I · ✅ · from: Observer Pattern in Go
- [x] **Patterns/State Machines in Go** · I · ✅ · from: State Pattern in Go + Vending Machine state-interface code
- [x] **Patterns/Chain of Responsibility and Pipelines** · I · ✅ · from: Chain of Responsibility Pattern in Go
- [x] **Patterns/Command, Undo and Memento** · I · ✅ · from: Command Pattern in Go, Memento Pattern in Go
- [x] **Patterns/Iterator and range-over-func** · I · ✅ · from: Iterator Pattern in Go (rewrite)
- [x] **Patterns/Repository and Unit of Work** · I · ✅ · from: Repository Pattern in Go
- [x] **Patterns/Rare GoF Patterns in Go** · A · ✅ · from: Prototype, Bridge, Flyweight, Visitor, Interpreter (+ the full Mediator form)
- [x] **Concurrency for LLD** · A · ✅ · from: Concurrency in Go LLD
- [x] **Testing LLD Code** · I · ✅ · from: Testing LLD Code in Go
- [x] **Practice/Parking Lot** · B · ✅ · from: Parking Lot LLD in Go
- [x] **Practice/Vending Machine** · B · ✅ · from: Vending Machine LLD in Go
- [x] **Practice/Library Management** · B · ✅ · from: Library Management LLD in Go
- [x] **Practice/Meeting Room Scheduler** · B · ✅ · from: Meeting Room Scheduler LLD in Go
- [x] **Practice/LRU Cache with TTL** · B · ✅ · from: LRU Cache LLD in Go
- [x] **Practice/Elevator System** · B · ✅ · from: Elevator System LLD in Go (rewrite + NEW drawing + tests)
- [x] **Practice/Tic-Tac-Toe and Snake and Ladder** · B 🆕 · ✅ · from: NEW
- [x] **Practice/Cart Checkout with Coupons** · I · ✅ · from: Cart Checkout with Coupons LLD in Go
- [x] **Practice/Inventory Order Assignment (Dark Store)** · I · ✅ · from: Inventory Order Assignment LLD in Go
- [x] **Practice/Delivery Partner Assignment** · I · ✅ · from: Delivery Partner Assignment LLD in Go
- [x] **Practice/Notification Service** · I · ✅ · from: Notification System LLD in Go
- [x] **Practice/Rate Limiter** · I · ✅ · from: Rate Limiter LLD in Go
- [x] **Practice/Logging Library** · I · ✅ · from: Logging System LLD in Go
- [x] **Practice/File Search (Unix find)** · I · ✅ · from: File Search Unix Find LLD in Go
- [x] **Practice/ATM** · I 🆕 · ✅ · from: NEW
- [x] **Practice/In-memory KV Store with TTL and Transactions** · I 🆕 · ✅ · from: NEW
- [x] **Practice/Task Scheduler (delayed and recurring jobs)** · I 🆕 · ✅ · from: NEW
- [x] **Practice/Circuit Breaker** · I 🆕 · ✅ · from: NEW
- [x] **Practice/Movie Ticket Booking** · A · ✅ · from: Movie Ticket Booking LLD in Go
- [x] **Practice/Splitwise Expense Sharing** · A · ✅ · from: Splitwise Expense Sharing LLD in Go
- [x] **Practice/Food Ordering System** · A · ✅ · from: Food Ordering System LLD in Go
- [x] **Practice/Pub-Sub Message Queue** · A 🆕 · ✅ · from: NEW
- [x] **Practice/Ride Sharing** · A 🆕 · ✅ · from: NEW
- [x] **Practice/Hotel Booking** · A 🆕 · ✅ · from: NEW
- [x] **Practice/Order Book Matching Engine** · A 🆕 · ✅ · from: NEW
- [x] **Practice/Digital Wallet and Ledger** · A 🆕 · ✅ · from: NEW
- [x] **LLD Problem Cheat Sheet** · I · ✅ · from: LLD Question Bank with Answers (rewritten and brought in line with the full notes)

## 18 AI Engineering · 21 notes

- [x] **18 AI Engineering MOC** · - · ✅ · from: folder map, written last
- [x] **LLM Fundamentals** · B · ✅ · from: LLM Fundamentals, Introduction to AI Engineering
- [x] **Calling LLM APIs from Go** · B 🆕 · ✅ · from: NEW
- [x] **Prompt Engineering** · B · ✅ · from: Prompt Engineering
- [x] **Structured Outputs and Tool Calling** · I 🆕 · ✅ · from: NEW
- [x] **Embeddings** · I · ✅ · from: Embedding Models
- [x] **Vector Databases and ANN Indexes** · I · ✅ · from: Vector Database Architecture, Vector Databases
- [x] **Keyword, Semantic and Hybrid Search** · I · ✅ · from: Semantic Search
- [x] **Document Ingestion and Chunking** · I · ✅ · from: Document Processing
- [x] **RAG Pipeline** · I · ✅ · from: RAG
- [x] **Advanced RAG Patterns** · A · ✅ · from: RAG ("Advanced RAG patterns"), NEW (query rewriting/HyDE, routing, self-query filters, parent-child, contextual retrieval, GraphRAG, agentic and corrective RAG, long-context alternative)
- [x] **RAG Evaluation** · A 🆕 · ✅ · from: NEW
- [x] **Case Study - Chat with PDFs and Websites** · I · ✅ · from: AI Chat with PDFs and Websites
- [x] **AI Agents and Agentic Workflows** · A · ✅ · from: AI Agents
- [x] **LangChain and LangGraph** · A · ✅ · from: LangGraph, LangChain Fundamentals
- [x] **Model Context Protocol (MCP)** · A 🆕 · ✅ · from: NEW
- [x] **LLM Evals in Production** · A · ✅ · from: Production AI Best Practices (evals), NEW
- [x] **Guardrails and LLM Security** · A · ✅ · from: Production AI Best Practices (guardrails), AI Agents (guardrails), NEW
- [x] **LLM Cost, Latency and Caching** · A 🆕 · ✅ · from: NEW
- [x] **LLM Observability** · A 🆕 · ✅ · from: NEW
- [x] **Production AI Checklist** · A · ✅ · from: Production AI Best Practices

## 19 Interview & Career · 6 notes

- [x] **19 Interview & Career MOC** · - · ✅ · from: folder map, written last
- [x] **Backend Roadmap and Tech Landscape** · B · ✅ · from: backendburgerDiagram (+ the SDE3 roadmap notes)
- [x] **SDE-3 Readiness Checklist** · I · ✅ · from: 2026 SDE3 Gap Checklist, SDE3 Backend Roadmap, START HERE (completion checklist)
- [x] **Learning Resources** · B · ✅ · from: Advancxe backend content table (syllabus), plus the other reviewers' coverage maps (Go Bootcamp Course Coverage Map, CodeWithAryan LLD Playlist Coverage Map, Go YouTube Topic Links); Go YouTube Topic Links, Go Backend Complete Notes (resource table, 9 unique URLs), Go Bootcamp Course Coverage Map (curriculum list); CodeWithAryan LLD Playlist Coverage Map
- [x] **Go Interview Questions and Traps** · I 🆕 · ✅ · from: NEW (Go reviewer gap: nil-interface trap, loop vars, slices aliasing, map iteration, goroutine leaks)
- [x] **LLD Round Playbook** · B · ✅ · from: LLD Practice Roadmap (daily method, interviewer checks), the Zepto time table, the Interview Approach script
- [x] **Company Rounds/Zepto-style Product LLD Round** · I · ✅ · from: Zepto SDE1 LLD Round Pattern
