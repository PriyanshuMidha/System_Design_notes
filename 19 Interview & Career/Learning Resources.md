---
tags: [interview, career, resources]
type: reference
level: basic
status: reviewed
prereqs: []
related: ["[[LLD Round Playbook]]", "[[SDE-3 Readiness Checklist]]", "[[Backend Roadmap and Tech Landscape]]", "[[19 Interview & Career MOC]]"]
sources:
  - "Links collected from the owner's legacy notes and 00 Rebuild/Salvaged Links (not re-fetched on 2026-11-04)"
updated: 2026-11-04
---

# Learning Resources

> [!summary] TL;DR
> A curated list of the outside material behind this vault, grouped by area, with official documentation first, then books, then courses and videos. Each entry says what it is good for and which vault note it backs up, so you read the note first and the source only for the part you need.

> [!abstract] Core idea
> - Official docs are the source of truth; blogs and videos are for intuition.
> - Read the vault note, then the one section of the source it points to, then code the example yourself.
> - Courses taught in Java still work for LLD, but translate them to Go and add what they skip (concurrency, DB invariants, idempotency).
> - Links were collected from older notes and were not re-checked on the date above; if one is dead, search the title on the same site.

## How to use a resource

1. Read the vault note for the topic until the end of its worked example.
2. Open only the matching section of the source below, not the whole course.
3. Rebuild the example in a scratch module and add one test.
4. Write one interview answer in your own words in the note's question callouts.

## Go language

**Official (start here):**

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [Go documentation hub](https://go.dev/doc/) | Index of every official guide | [[04 Go Language MOC]] |
| [A Tour of Go](https://go.dev/tour/) | First pass over syntax, interfaces, goroutines | [[04 Go Language MOC]] |
| [How to Write Go Code](https://go.dev/doc/code) | Modules, packages, `go` tool setup | [[04 Go Language MOC]] |
| [Effective Go](https://go.dev/doc/effective_go) | Idioms; the [interfaces section](https://go.dev/doc/effective_go#interfaces) for small, implicit interfaces | [[OOP in Go - Structs, Interfaces, Embedding]] |
| [Go Code Review Comments: interfaces](https://go.dev/wiki/CodeReviewComments#interfaces) | Why interfaces belong on the consumer side | [[SOLID in Go]] |
| [The Go Memory Model](https://go.dev/ref/mem) | Happens-before, what a data race is | [[Concurrency for LLD]] |
| [Data Race Detector](https://go.dev/doc/articles/race_detector) | How `-race` works and its limits | [[Testing in Go]] |
| [Tutorial: add a test](https://go.dev/doc/tutorial/add-a-test) | The `testing` package basics | [[Testing in Go]] |
| [Table-driven tests (Go wiki)](https://go.dev/wiki/TableDrivenTests) | The standard test layout | [[Testing LLD Code]] |
| [Working with errors in Go 1.13](https://go.dev/blog/go1.13-errors) | `%w`, `errors.Is`, `errors.As` | [[04 Go Language MOC]] |
| [Go Concurrency Patterns: Context](https://go.dev/blog/context) | Why and how `context` carries cancellation | [[Context Package]] |
| [Go Concurrency Patterns: Pipelines and cancellation](https://go.dev/blog/pipelines) | Fan-out, fan-in, stopping goroutines | [[Goroutines and Channels]] |
| [package context](https://pkg.go.dev/context) | API reference | [[Context Package]] |
| [package sync](https://pkg.go.dev/sync) | Mutex, RWMutex, Once, WaitGroup reference | [[Concurrency for LLD]] |
| [Go 1.22 release notes](https://go.dev/doc/go1.22) | Per-iteration loop variables, method and wildcard routing in `net/http` | [[HTTP Server Fundamentals (net-http)]] |
| [Accessing relational databases](https://go.dev/doc/database/) | `database/sql`, transactions, prepared statements | [[06 Backend Engineering in Go MOC]] |
| [Tutorial: REST API with Go and Gin](https://go.dev/doc/tutorial/web-service-gin) | A first JSON API end to end | [[REST and HTTP API Design]] |

**Talks and videos:**

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [Rob Pike, Go Concurrency Patterns (Google I/O 2012)](https://www.youtube.com/watch?v=f6kdp27TYZs) | Generators, fan-in, timeouts with `select` | [[Goroutines and Channels]] |
| [Sameer Ajmani, Advanced Go Concurrency Patterns (Google I/O 2013)](https://www.youtube.com/watch?v=QDDwwePbDtw) | The for-select loop, owning state in one goroutine | [[Goroutines and Channels]] |
| [Go benchmarking and pprof (video; title not re-checked)](https://www.youtube.com/watch?v=TbdtTm6FCQU) | Writing benchmarks and reading profiles | [[Benchmarks, Profiling and Tracing]] |

**Books:** *The Go Programming Language* (Donovan and Kernighan) for a complete, careful pass over the language; *Concurrency in Go* (Katherine Cox-Buday) for patterns beyond the talks above.

### Course coverage checklist: Go Bootcamp

The owner followed the Udemy course *Go Bootcamp: With gRPC and Protocol Buffers (HTTP/S, HTTP2)*. Its public curriculum lists these topics. Use them as a checklist that the vault covers each one; ticks are not tracked here.

- Setup: Go toolchain, playground, editor, Git → [[04 Go Language MOC]]
- Basics: variables, functions, arrays, slices, maps, `defer`, `panic`, `recover` → [[04 Go Language MOC]]
- Intermediate: closures, recursion, pointers, strings and runes, `fmt` verbs, structs, interfaces, embedding, generics, `text/template` and `html/template`, `regexp`, `time`, random numbers, files and directories, URL parsing, base64, hashing → [[04 Go Language MOC]]
- Advanced: goroutines, channels, `context`, timers and tickers, worker pools, `WaitGroup`, mutexes, atomics, testing, benchmarking, pprof, OS processes, `reflect` → [[Goroutines and Channels]], [[Testing in Go]], [[Benchmarks, Profiling and Tracing]]
- REST API in Go: planning, folder structure, middleware, SQL and NoSQL → [[06 Backend Engineering in Go MOC]]
- HTTPS, HTTP/2, TLS → [[TLS, HTTPS and HTTP2 in Go Servers]]
- Protocol Buffers: syntax, types, serialization, services, versioning, `protoc` → [[gRPC]]
- gRPC: server and client, TLS, streaming, deadlines, metadata, reflection, `grpcurl`, gateway, combined REST and gRPC → [[gRPC Services in Go]], [[gRPC Streaming in Go]], [[Serving REST and gRPC Together]]
- Load tools `wrk`, `h2load`, `ghz` → [[Load Testing]]

## APIs, gRPC and Protocol Buffers

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [gRPC Go docs](https://grpc.io/docs/languages/go/) | Entry point for gRPC in Go | [[gRPC Services in Go]] |
| [gRPC Go quick start](https://grpc.io/docs/languages/go/quickstart/) | Install `protoc` plugins, run hello world | [[gRPC Services in Go]] |
| [gRPC Go basics tutorial](https://grpc.io/docs/languages/go/basics/) | All four RPC kinds, including streaming | [[gRPC Streaming in Go]] |
| [Protocol Buffers Go tutorial](https://protobuf.dev/getting-started/gotutorial/) | Messages, generated code, field numbers | [[gRPC]] |
| [Google codelab: getting started with gRPC Go](https://codelabs.developers.google.com/grpc/getting-started-grpc-go) | A guided build of a gRPC service | [[gRPC Services in Go]] |
| [Tech School: the complete gRPC course (article series)](https://dev.to/techschoolguru/the-complete-grpc-course-protobuf-go-java-2af6) | Longer project-style course | [[gRPC Services in Go]] |
| [Tech School: gRPC intro video (title not re-checked)](https://www.youtube.com/watch?v=VtX9w8uKvEk) | Why gRPC and HTTP/2, in one video | [[gRPC]] |

## Databases and caching

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [PostgreSQL 17 documentation](https://www.postgresql.org/docs/17/) | The SQL dialect used everywhere in this vault | [[07 Databases MOC]] |
| [Redis docs: key eviction](https://redis.io/docs/latest/reference/eviction/) | `maxmemory` policies, approximate LRU and LFU | [[Cache Eviction Policies - LRU, LFU, TTL]] |
| [AWS: caching best practices](https://aws.amazon.com/caching/best-practices/) | Cache-aside, write-through, TTL choices | [[Caching Patterns]] |
| [AWS whitepaper: database caching strategies using Redis, caching patterns](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html) | The same patterns with Redis specifics | [[Caching Patterns]] |

**Book:** *Designing Data-Intensive Applications* (Martin Kleppmann) for replication, partitioning, transactions and stream processing; read it alongside [[07 Databases MOC]] and [[10 Distributed Systems & Resilience MOC]].

## Containers, cloud and observability

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [Docker guide: Go](https://docs.docker.com/guides/golang/) | Multi-stage Dockerfile for a Go service | [[Docker 04 - Writing a Production Dockerfile for Go]] |
| [OpenTelemetry Go docs](https://opentelemetry.io/docs/languages/go/) | SDK setup, traces and metrics | [[Distributed Tracing with OpenTelemetry]] |
| [OpenTelemetry Go instrumentation libraries](https://opentelemetry.io/docs/languages/go/libraries/) | Ready-made instrumentation for `net/http`, gRPC, SQL | [[Distributed Tracing with OpenTelemetry]] |

## AI engineering

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [Pinecone Python SDK: upsert and query vectors](https://sdk.pinecone.io/python/how-to/vectors/upsert-and-query.html) | The shape of a vector-DB write and search | [[RAG Pipeline]] |
| [Pinecone TypeScript SDK: metadata filtering](https://sdk.pinecone.io/typescript/documents/data-operations_metadata-filtering.html) | Filtering search results by metadata | [[Advanced RAG Patterns]] |

## LLD and design

| Resource | Use it for | Backs up |
| --- | --- | --- |
| [CodeWithAryan: low level design page](https://codewitharyan.com/system-design/low-level-design) | Index of the LLD course and model problems (Java) | [[17 LLD MOC]] |
| [CodeWithAryan: what is low level system design](https://codewitharyan.com/tech-blogs/what-is-low-level-system-design) | What LLD is and how it differs from HLD | [[LLD Interview Method]] |
| [CodeWithAryan: how to approach LLD problems](https://codewitharyan.com/tech-blogs/how-to-approach-lld-problems) | A step order for solving a problem | [[LLD Interview Method]] |
| [CodeWithAryan: structural design patterns](https://codewitharyan.com/tech-blogs/structural-design-patterns) | Adapter, Decorator, Proxy, Facade, Composite in Java | [[Design Patterns Overview and Chooser]] |
| [CodeWithAryan: design a logging system](https://codewitharyan.com/tech-blogs/design-logging-system) | A pattern-combination model problem | [[Logging Library]] |
| [Refactoring Guru: design patterns](https://refactoring.guru/design-patterns) | Intent, structure and pitfalls of each GoF pattern, with a Go example per pattern | [[Design Patterns Overview and Chooser]] |
| [Mermaid: class diagrams](https://mermaid.js.org/syntax/classDiagram.html) | Syntax for the class diagrams in 17 | [[UML for LLD]] |
| [Mermaid: sequence diagrams](https://mermaid.js.org/syntax/sequenceDiagram.html) | Syntax for request flows | [[UML for LLD]] |
| [Mermaid: state diagrams](https://mermaid.js.org/syntax/stateDiagram.html) | Syntax for lifecycles | [[State Machines in Go]] |

**Books:** *Design Patterns* (Gamma, Helm, Johnson, Vlissides) as the reference for intent; *Head First Design Patterns* (Freeman and Robson) for a gentler first read; *The Pragmatic Programmer* (Hunt and Thomas) for DRY and orthogonality.

### CodeWithAryan course map

The course is taught in Java. Each module maps to one vault note:

- What is LLD, HLD vs LLD, requirements, use cases, entities, relationships, core methods → [[LLD Interview Method]]
- UML (class, sequence, activity) → [[UML for LLD]]
- SOLID → [[SOLID in Go]]
- DRY, KISS, YAGNI → [[Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion]]
- Factory → [[Factory and Abstract Factory]]; Strategy → [[Strategy and Template Method]]; Observer → [[Observer and Event Bus]]; Singleton → [[Singleton and sync.Once]]
- Structural patterns → [[Adapter]], [[Decorator and Middleware]], [[Proxy]], [[Facade (vs Mediator)]], [[Composite]]
- Logging system model problem → [[Logging Library]]

**Translating a Java course to Go:**

- A class becomes a struct with methods; an enum becomes a named type with typed constants.
- Inheritance becomes composition (embedding or a field), and abstract classes become an interface plus a helper.
- `synchronized` becomes a `sync.Mutex`, or, across instances, an atomic database update.
- A static singleton becomes a value built in `main` and injected, or `sync.Once` when it truly must be global.
- Define interfaces where they are used, not next to the implementation. The full table is in [[OOP in Go - Structs, Interfaces, Embedding]].

**What Java LLD courses usually skip, so study it here:** concurrency and race tests ([[Concurrency for LLD]]), invariants enforced in the database ([[Locking - Optimistic vs Pessimistic]]), and idempotent retries ([[Idempotency and Idempotency Keys]]).

## Backend course syllabus (Advanced Backend + AI)

The owner's earlier study plan followed a two-part backend course. Its syllabus, mapped to the vault:

| Level | Course topics | Vault area |
| --- | --- | --- |
| 0. Basic backend | HTTP, APIs, databases revision | [[02 Networking & Web MOC]], [[05 APIs MOC]] |
| 1. Docker | Images, containers, Compose | [[13 DevOps & Cloud MOC]] |
| 2. Redis | API caching, rate-limiting project, message queue | [[08 Caching & Redis MOC]], [[Rate Limiting - Algorithms and Distributed Design]], [[Redis as a Queue - Lists, Streams and Pub-Sub]] |
| 3. System design | Scaling, Nginx, microservices, replication, sharding | [[11 System Design MOC]], [[Nginx]], [[Monolith vs Microservices]], [[Replication]], [[Partitioning and Sharding]] |
| 4. AI | LLM fundamentals, LangChain, LangGraph, agents, prompt engineering, RAG, embeddings, vector DBs, semantic search, document processing, chat with PDFs and websites | [[18 AI Engineering MOC]] |
| 5. Cloud | AWS deployment, CI/CD, ECR and ECS, production best practices | [[AWS 05 - ECS, Fargate and ECR]], [[CI-CD Pipelines (GitHub Actions for Go)]], [[Deploying a Go API on AWS (Reference Architecture)]] |

## Links

- **Before this:** [[19 Interview & Career MOC]], [[Backend Roadmap and Tech Landscape]]
- **Next:** [[SDE-3 Readiness Checklist]], [[LLD Round Playbook]]
- **Compare with:** each area's MOC, which lists the vault notes in learning order
