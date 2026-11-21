---
tags: [system-design, fundamentals, requirements, architecture]
level: basic
status: reviewed
prereqs: ["[[What Happens When You Type a URL]]", "[[Backend Request Lifecycle and Layering]]"]
related: ["[[Scaling Basics]]", "[[Back-of-the-Envelope Estimation]]", "[[Load Balancing]]", "[[System Design Interview Framework]]", "[[SLIs, SLOs, SLAs and Error Budgets]]", "[[CAP and PACELC]]"]
sources:
  - "AWS S3 User Guide, Data protection in Amazon S3 (designed for 99.999999999% durability)"
  - "Google SRE Book, ch. 4 Service Level Objectives"
  - "Martin Kleppmann, Designing Data-Intensive Applications (2017), ch. 1"
updated: 2026-11-13
---

# System Design Fundamentals

> [!summary] TL;DR
> System design is choosing the components of a software system (servers, databases, caches, queues) and how they connect, so that it does what users need (**functional requirements**) at the speed, scale, reliability and cost the business needs (**non-functional requirements**). Every choice trades one quality for another, and good design states that trade-off with numbers.

> [!abstract] Core idea
> - Start from requirements: what the system must do, then how well it must do it (latency, availability, scale, durability, cost).
> - Every quality has a unit: nines for availability, milliseconds at p99 for latency, requests per second for throughput.
> - A standard stack of building blocks (DNS, CDN, load balancer, stateless app tier, cache, database, queue, object storage) solves most problems; each block exists to fix one specific pain.
> - Keep the app tier stateless and push state into a few purpose-built stores; the stores are where the hard trade-offs live.
> - Trap: "highly available" or "scalable" without a number means nothing.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (requirements, quality targets, building blocks), 4 (whiteboard and availability maths) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[What Happens When You Type a URL]]: a browser finds a server's address, opens a connection and sends a request; the server sends a page back.
> - [[Backend Request Lifecycle and Layering]]: inside the server, a request passes through a handler, business logic and a database call, then a response goes back.

**From zero, in 60 seconds** 🟢

Writing code makes one feature work. System design is deciding how the whole thing holds up when real life hits.
Real life means: lots of users at once, a disk that dies, a deploy in the middle of the day.
First you write down what the app must do (the features) and how well it must do it (fast, always up, never lose data).
"How well" is called the **non-functional requirements**, and it always comes with numbers.
Then you pick building blocks to meet those numbers: load balancer, app servers, cache, database, queue.

```mermaid
flowchart LR
    A["One box: app + database"] -- "grows up into" --> B["Load balancer -> many app servers<br/>-> cache -> database + replica"]
```

A part that keeps no data between requests is **stateless**: you can copy it freely. Parts that hold data (the database) are hard to copy, so they need the most care.

```mermaid
flowchart LR
    U["Users"] --> LB["Load balancer"] --> APP["App servers (stateless, copy freely)"] --> DB[("Database (stateful, handle with care)")]
```

The rest of this note is just these 3 questions:
1. What exactly must the system do, and how well (with numbers)?
2. Which building blocks give you that?
3. What does each choice cost you (speed, money, correctness)?

**The problem in one story.**
You build a small shop website on one computer, and it works.
Then a sale brings 50 times more visitors, the disk dies, and a restart drops orders.
None of that is a coding bug.
System design is planning, before that day, how the system stays fast, safe and up.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Functional requirement | What the system must do | "Users can create invoices" |
| Non-functional requirement | How well it must do it | "p99 under 200 ms, 99.9% up" |
| Latency | Time for one request | 80 ms |
| Throughput | Requests handled per second | 5,000 RPS |
| Availability | Share of time the system works | 99.9% ≈ 8.8 hours down a year |
| Cache | Fast copy of data used often | Redis holding a user profile |
| Queue | A line of jobs processed later | Send email after signup |
| Single point of failure | One part whose failure stops everything | The only database server |
| Load balancer | Spreads requests across many servers and skips dead ones | request 1 to server A, request 2 to server B |
| CDN | Servers near users that keep copies of files | an image served from Mumbai, not Virginia |
| DNS | The internet's phone book: turns a name into an address | `api.example.com` → `13.32.1.5` |
| p99 | 99 out of 100 requests are faster than this | p99 = 200 ms |
| Replica | A copy of the database kept in sync | a second Postgres that takes reads |
| Durability | Saved data is not lost, even if a disk dies | a paid invoice still exists after a crash |

**Picture it**

```mermaid
flowchart LR
    U["User"] --> CDN["CDN"]
    CDN --> LB["Load balancer"]
    LB --> APP["App servers<br/>(stateless)"]
    APP --> C[("Cache")]
    APP --> DB[("Database")]
    APP --> Q["Queue"] --> W["Workers"]
```

**Analogy.** Designing a restaurant kitchen, not cooking one dish: stations, staff and storage chosen for the expected crowd.
Where it breaks: a kitchen grows slowly; software traffic can jump 10 times in minutes.

**How the rest of this note builds up**

- First, why design matters (section 1) and the kitchen model (section 2).
- Then requirements, quality attributes with units, the building-block catalogue and a request's lifecycle (section 3).
- Then a worked example with availability arithmetic (section 4).
- Finally the SDE-3 view: variants, trade-offs, production practice and deep dive (sections 5-8).

> [!tip] Remember
> Start from requirements with numbers, then pick building blocks, and say what each trade-off costs.

## 1. Why it exists 🟢

A team builds an invoice service on one virtual machine: Go API and PostgreSQL on the same box. It works for 200 customers. Then three things happen in one quarter:

- A marketing email sends 5,000 users to the dashboard in ten minutes. CPU hits 100% and p99 latency goes from 80 ms to 9 s.
- The disk fails. There is a nightly backup, so 14 hours of invoices are lost.
- A deploy restarts the process, and every request in flight during the 20-second restart fails.

None of these is a coding bug. They are **design** gaps: one machine is a single point of failure, there is no headroom for peaks, and durability was never specified. System design is the discipline of deciding, before the incident, how much of each quality the system needs and which components buy it.

## 2. Mental model 🟢

Think of designing a restaurant kitchen rather than cooking one dish.

- The **menu** is the functional requirements: what can be ordered.
- **"Food within 15 minutes, 300 covers a night, never poison anyone"** are the non-functional requirements.
- **Stations** (grill, fry, pass, dishwash) are the building blocks. You add a second grill cook when the grill is the bottleneck, not before.
- The **walk-in fridge** is the database: it holds the state everything else depends on, and it is the hardest thing to duplicate.

Two vocabulary pairs you will use in every design:

- **Stateless vs stateful.** A stateless component keeps nothing between requests that another copy could not also serve (a Go API that reads the session from Redis). You can add or kill copies freely. A stateful component owns data (PostgreSQL, Kafka, Redis); copying it means [[Replication]] and splitting it means [[Partitioning and Sharding]].
- **Read-heavy vs write-heavy.** A URL shortener does about 100 reads per write, so caches and replicas fix it. A metrics ingester does mostly writes, so batching, queues and partitioning fix it. The read:write ratio decides the whole architecture.

### Real-life example: ordering food on Swiggy 🟢

The features are simple: browse restaurants, add to cart, pay, track the rider.
The hard part is the "how well": menus must load in under a second, the app must stay up on a rainy Friday night when orders jump, and a paid order must never vanish.
So menus and photos are served from caches and a CDN, many identical app servers take the traffic, and orders are saved in a database with copies.
Sending the "order confirmed" message is pushed to a queue, so a slow message service never blocks your payment.
Each of those choices comes from a number in the requirements, not from habit.

```mermaid
flowchart LR
    F["Features: browse, order, pay"] --> N["Numbers: under 1 s, always up, never lose an order"]
    N --> B["Blocks: CDN, cache, many app servers, DB + copy, queue"]
```

## Common beginner mistakes 🟢

- **Drawing boxes before writing requirements** → you build things nobody asked for and miss what matters → list features, numbers and out-of-scope first.
- **Saying "highly available" or "fast" with no number** → nobody can check it or design for it → say "99.9% a month" or "p99 under 200 ms".
- **Mixing up availability and durability** → you can be up and still lose data, or down and lose nothing → give each its own target.
- **Adding every building block "just in case"** → each extra hop adds delay and another thing that can fail → add a block only when a number says you need it.
- **Two copies on the same machine or rack** → they fail together, so you gain nothing → put copies in different zones.

### Words people mix up 🟡

| Pair | First one | Second one |
| --- | --- | --- |
| Latency vs throughput | How long one request takes (80 ms) | How many requests per second (5,000 RPS) |
| Availability vs durability | Is it answering right now? | Is saved data still there? |
| Functional vs non-functional | What it does ("create invoice") | How well ("p99 under 200 ms") |
| Stateless vs stateful | Keeps nothing between requests, copy freely | Owns data, copying needs replication |

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that design starts from what the app must do and how well, and that state (the database) is the hard part. **Next we open the box**: how to write requirements, what unit each quality uses, what each building block is for, and the path one request takes. Each subsection starts with a plain step-by-step walk; the full detail follows.

### Requirements first

**In plain words:** before drawing boxes, write three lists: what users can do, how well it must work (with numbers), and what you will not build yet.

**Step by step:**
1. Ask: what can a user do? For an invoice app: create an invoice, send it, record a payment.
2. Ask: how well? "Lists load in under 200 ms for 99% of users, the app is up 99.9% of the month, no payment is ever lost."
3. Ask: how much? "2,000 requests per second at the busiest hour."
4. Write what you will NOT build now, such as multi-currency tax.
5. Only now start choosing boxes, each one tied to a number above.

| Kind | Question it answers | Example (invoice service) |
| --- | --- | --- |
| Functional | What can a user do? | Create invoice, send it, record payment, list unpaid invoices |
| Non-functional | How well, how much, how safely? | p99 read < 200 ms, 99.9% monthly availability, zero lost payments, 2,000 RPS peak |
| Out of scope | What will we not build now? | Multi-currency tax, offline mobile mode |

### Quality attributes and their units

**In plain words:** "fast", "reliable" and "scalable" mean nothing until you put a number on them. This table gives each word its unit.

**Step by step:**
1. "Reliable" becomes availability: 99.9% means about 43 minutes down a month.
2. "Fast" becomes latency: p99 under 200 ms, so only 1 in 100 requests is slower.
3. "Handles lots of users" becomes throughput: 2,000 requests per second.
4. "Never loses data" becomes durability: how likely saved data survives a year.
5. Now each word can be tested, and each one points at a different building block.

| Attribute | Definition | Unit and typical target |
| --- | --- | --- |
| Availability | Fraction of time (or of requests) the system answers correctly | Nines: 99.9% allows 8 h 46 min down per year (computed below) |
| Latency | Time for one request, measured as a distribution | p50 and p99 in ms; p99 is what your slowest 1% of users feel |
| Throughput | Work completed per unit of time | Requests per second (RPS), messages/s, MB/s |
| Durability | Probability that stored data is not lost | S3 is designed for 99.999999999% (11 nines) of object durability per year (AWS docs) |
| Consistency | Whether every reader sees the latest write | Strong, read-your-writes, eventual; see [[Consistency Models]] |
| Scalability | How cost and effort grow with load | "2x traffic needs about 2x app nodes and no redesign" |
| Cost | Money per unit of work | $ per million requests, $ per GB-month |

Availability and durability are different. A system can be down for an hour (availability lost) and still lose no data (durability kept). Losing a disk with no replica loses both.

The formal way to write these targets is an SLI (what you measure) and an SLO (the target for it); see [[SLIs, SLOs, SLAs and Error Budgets]].

### The building-block catalogue

**In plain words:** most systems are built from the same dozen parts. This map shows what each one is for.

**Step by step:**
1. The user's phone asks DNS for the address of `api.invoiceops.example`.
2. Images and scripts come from a nearby CDN server, not from your servers.
3. API calls hit a load balancer, which picks one healthy app server.
4. The app server checks the cache first, then the database if the cache has nothing.
5. Slow jobs, like sending an email, go on a queue; a worker picks them up later.
6. Files go to object storage (a big, cheap store for files, like S3); logs and metrics go to monitoring.

```mermaid
flowchart LR
    C[Client] --> DNS["DNS<br/>name to IP, geo routing"]
    C --> CDN["CDN<br/>static files near the user"]
    C --> LB["Load balancer<br/>spread requests, drop dead nodes"]
    LB --> GW["API gateway<br/>auth, rate limits, routing"]
    GW --> APP["Stateless app tier<br/>business logic, N copies"]
    APP --> CACHE["Cache (Redis)<br/>hot reads in under 1 ms"]
    APP --> DB[("Database<br/>source of truth, transactions")]
    APP --> Q["Queue / log<br/>absorb spikes, decouple slow work"]
    Q --> W["Workers<br/>emails, PDFs, webhooks"]
    APP --> OBJ[("Object storage<br/>files and blobs")]
    W --> OBJ
    DB --> SEARCH["Search index<br/>full-text, filters"]
    APP -.-> OBS["Observability<br/>logs, metrics, traces"]
```

| Block | Pain it removes | Owning note |
| --- | --- | --- |
| DNS | Clients need an address; regions need routing | [[DNS - Resolution, Records and Caching]] |
| CDN | Static and cacheable bytes travel far | [[CDN and Edge]] |
| Load balancer | One server is a bottleneck and a single point of failure | [[Load Balancing]] |
| API gateway | Every service re-implements auth and rate limits | [[API Gateway and BFF]] |
| Stateless app tier | Code must scale by adding copies | [[Scaling Basics]] |
| Cache | The database is too slow or too busy for hot reads | [[Caching Patterns]] |
| Database | State must be correct and survive crashes | [[SQL vs NoSQL]] |
| Queue or log | Slow or bursty work blocks the request path | [[Queues vs Streams and Broker Comparison]], [[Kafka and Event Streaming]] |
| Object storage | Files do not belong in database rows | [[File Uploads and Object Storage]] |
| Search index | `LIKE '%term%'` cannot rank or scale | [[Search Engines and Inverted Indexes]] |
| Observability | You cannot fix what you cannot see | [[Observability Fundamentals]] |

### A request's lifecycle through the stack

**In plain words:** follow one click from the phone, through every box, to the database and back.

**Step by step:**
1. Riya opens "unpaid invoices". Her browser looks up the server's address in DNS (and remembers it for a while).
2. The request goes, encrypted with TLS (the lock in the address bar), to the load balancer.
3. The load balancer hands it to one healthy API server.
4. The API asks Redis for the list. If Redis has it (a hit), done in about 1 ms.
5. If not (a miss), the API asks PostgreSQL, then saves the answer in Redis for 60 seconds.
6. The answer goes back the same way. Riya sees her list.

```mermaid
sequenceDiagram
    autonumber
    participant U as Browser
    participant D as DNS
    participant L as Load balancer
    participant A as API (1 of N)
    participant R as Redis
    participant P as PostgreSQL
    participant K as Queue
    U->>D: resolve api.invoiceops.example
    D-->>U: IP of the load balancer (cached for TTL)
    U->>L: GET /invoices?status=unpaid (TLS)
    L->>A: forward to a healthy instance
    A->>R: GET dashboard:{workspace}:unpaid
    alt cache hit
        R-->>A: cached list
    else cache miss
        A->>P: SELECT ... WHERE status = 'unpaid'
        P-->>A: rows
        A->>R: SET with TTL 60 s
    end
    A-->>L: 200 OK
    L-->>U: 200 OK
    Note over A,K: a write such as "send invoice" commits to PostgreSQL,<br/>then a worker sends the email from the queue
```

Each hop adds latency and a failure point. Most design work is deciding which hops a given request must take and which it can skip.

## 4. Worked example 🟡

### Whiteboard version

Draw this in two minutes for any web system, then adapt it:

```text
[Client] -> [DNS] -> [CDN: static]
         -> [LB] -> [API x N, stateless]
                       |-> [Redis cache]      (reads)
                       |-> [Postgres primary] (writes) -> [replicas] (reads)
                       |-> [Queue] -> [Workers] -> [Object storage / email]
NFRs on the side: p99 < 200 ms, 99.9%, 2k RPS peak, RPO 0 for payments
```

NFR means non-functional requirement. RPO (recovery point objective) is how much recent data you may lose in a disaster; RPO 0 means "lose nothing".

### Availability is arithmetic

**In plain words:** parts in a chain multiply their risk, so more steps means less uptime. Spare copies side by side cut the risk, because all of them must fail at once.

```mermaid
flowchart LR
    subgraph chain["In a chain: 99.9% x 99.9% = 99.8%"]
        A1["LB"] --> A2["App"] --> A3["DB"]
    end
    subgraph spare["Side by side: down only if both are down"]
        B1["App copy 1"]
        B2["App copy 2"]
    end
```

A request that passes through components **in series** succeeds only if all of them are up, so you multiply. **Redundant** copies fail only if all copies are down at once. This Go code computes both; it passes `go vet` and `go test -race` on Go 1.24.

```go
package avail

import "time"

// Series is the availability of components that must ALL be up
// (a request passes through each one): multiply the availabilities.
func Series(a ...float64) float64 {
	out := 1.0
	for _, x := range a {
		out *= x
	}
	return out
}

// Parallel is the availability of redundant copies where ANY ONE up is enough,
// assuming the copies fail independently: 1 - P(all down).
func Parallel(a ...float64) float64 {
	allDown := 1.0
	for _, x := range a {
		allDown *= 1 - x
	}
	return 1 - allDown
}

// Downtime converts an availability into allowed downtime over a period.
func Downtime(availability float64, period time.Duration) time.Duration {
	return time.Duration((1 - availability) * float64(period))
}
```

```go
package avail

import (
	"math"
	"testing"
	"time"
)

func near(a, b, eps float64) bool { return math.Abs(a-b) < eps }

func TestSeriesLowersAvailability(t *testing.T) {
	// LB -> app -> database, each 99.9%.
	got := Series(0.999, 0.999, 0.999)
	if !near(got, 0.997003, 1e-9) {
		t.Fatalf("Series = %.6f, want 0.997003", got)
	}
}

func TestParallelRaisesAvailability(t *testing.T) {
	// Two independent replicas, each 99%.
	got := Parallel(0.99, 0.99)
	if !near(got, 0.9999, 1e-12) {
		t.Fatalf("Parallel = %.6f, want 0.9999", got)
	}
}

func TestDowntimeBudget(t *testing.T) {
	year := 365 * 24 * time.Hour
	cases := []struct {
		a    float64
		want time.Duration
	}{
		{0.99, 87*time.Hour + 36*time.Minute},       // 3.65 days
		{0.999, 8*time.Hour + 45*time.Minute + 36*time.Second},
		{0.9999, 52*time.Minute + 33*time.Second + 600*time.Millisecond},
	}
	for _, c := range cases {
		got := Downtime(c.a, year)
		if d := got - c.want; d > time.Second || d < -time.Second {
			t.Errorf("Downtime(%v) = %v, want about %v", c.a, got, c.want)
		}
	}
}
```

What the numbers say (computed by the code above, 365-day year, 30-day month):

| Availability | Down per year | Down per 30-day month |
| --- | --- | --- |
| 99% | 3.65 days | 7 h 12 min |
| 99.9% | 8 h 45 min 36 s | 43 min 12 s |
| 99.99% | 52 min 34 s | 4 min 19 s |
| 99.999% | 5 min 15 s | 26 s |

Three lessons for the invoice service:

1. **Series hurts.** LB, API and database at 99.9% each give 0.999³ = 99.7003%, about 26 hours of downtime a year. Every component you add to the request path lowers availability.
2. **Redundancy helps, if failures are independent.** Two API instances at 99% each give 1 − 0.01² = 99.99%. Two instances in the same rack on the same bad deploy are not independent, which is why real gains come from separate zones and staged rollouts.
3. **Pick the target before the architecture.** 99.9% can tolerate a 10-minute manual database failover a few times a year. 99.99% (4 minutes a month) cannot, so it forces automatic failover; see [[High Availability and Failover]].

## 5. Variants and comparison 🟡

```mermaid
flowchart TD
    Q{"Mostly reads or writes?"} -- "reads" --> R["Cache, CDN, read replicas"]
    Q -- "writes" --> W["Batching, queues, partitioning"]
    Q -- "money / seats" --> T["Relational DB, idempotency, ledgers"]
```

Systems fall into a few shapes, and the shape decides the first components you reach for.

| Shape | Read:write | First tools | Typical example |
| --- | --- | --- | --- |
| Read-heavy | 10:1 to 1000:1 | Cache, CDN, read replicas | URL shortener, product catalogue, news feed reads |
| Write-heavy | 1:1 or below | Append-only logs, batching, partitioning, LSM stores (databases built to take writes fast by appending, like Cassandra) | Metrics, logs, ad clicks, IoT telemetry |
| Real-time / connection-heavy | Mixed | Long-lived connections, fan-out, presence | Chat, live scores; see [[Scaling WebSockets]] |
| Transactional / correctness-heavy | Mixed, low volume | Relational DB, idempotency keys, ledgers | Payments, ticket booking |
| Batch / analytical | Huge scans | Columnar storage, stream or batch jobs | Reporting, billing runs |

| Trade-off pair | Choosing the left means | Example |
| --- | --- | --- |
| Latency vs consistency | Serve possibly stale data fast | Feed from a cache with 60 s TTL |
| Availability vs consistency (during a partition, when the network cuts some servers off from others) | Accept writes that may conflict | Shopping cart in a leaderless store (any copy accepts writes, no single boss copy); see [[CAP and PACELC]] |
| Cost vs availability | Fewer replicas, one region | Internal admin tool at 99.5% |
| Simplicity vs scalability | One database, no sharding yet | Most products below about 10k writes/s (estimate; depends on hardware and query shape) |
| Throughput vs latency | Batch writes, wait to fill a batch | Kafka producer `linger.ms` |

## 6. Trade-offs and when not to use 🟡

- **Do not design for scale you do not have.** A single PostgreSQL primary with a replica serves most products for years. Microservices, Kafka and sharding each add operational cost before they add value.
- **Every extra hop costs latency and availability** (see the series rule). A cache that is down must not take the request path down with it.
- **Stateless is a property you maintain.** One in-memory session map or local file upload quietly makes an instance stateful and breaks load balancing.
- **Strong guarantees cost money.** Synchronous cross-region replication gives zero data loss and adds a cross-region round trip (often 50-150 ms, estimate) to every write.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** the building blocks, their units and how availability adds up. **Next comes the senior view**: the real stack companies run, how it fails, and the subtle cases where the simple maths lies (shared failures, slow tails).

- **Real systems:** The canonical stack above is how most web products are built: a CDN (CloudFront, Cloudflare), a managed load balancer (AWS ALB), containers on ECS or Kubernetes, PostgreSQL or MySQL, Redis, a queue (SQS or Kafka), and S3 for files.
- **Failure modes → fixes:**
	- Single point of failure (one DB, one LB) → redundancy across availability zones plus automated failover.
	- Cache outage sends all reads to the database → capacity for a cold cache, rate limits, circuit breakers (a switch that stops calling a failing service for a while); see [[Cache Failure Modes - Stampede, Avalanche, Penetration, Hot and Big Keys]].
	- Slow dependency ties up every request → timeouts and bulkheads (separate pools per dependency, so one slow one cannot use up all workers); see [[Timeouts, Retries and Backoff]].
	- Deploy kills in-flight requests → graceful shutdown and connection draining; see [[Graceful Shutdown and Health Checks]].
- **What to monitor:** the four golden signals per component (latency, traffic, errors, saturation), and the SLO burn rate for each user-facing journey.

## 8. Deep dive 🔴

- **Availability by requests, not minutes.** Many SLOs are written as "good requests ÷ total requests" rather than uptime. A system that fails 1% of requests all day is 99% available even though it was never "down".
- **Correlated failure breaks the parallel formula.** `Parallel` assumes independence. Shared power, a shared bad config, a shared dependency (DNS, an identity provider) or a retry storm make replicas fail together. This is why cloud regions are split into availability zones with separate power and networking.
- **Tail latency amplification.** If a page fans out to 100 backends and each has a 1% chance of being slow, the page is slow with probability 1 − 0.99¹⁰⁰ ≈ 63%. Fan-out designs must chase p99 and p99.9, not p50.
- **Durability is replication plus independence plus repair.** Eleven nines come from storing data across devices and facilities and repairing lost copies quickly; a replica alone is not a backup, because deletes and bad migrations replicate too (see [[Backup, PITR and Disaster Recovery]]).
- **State is the hard part.** Stateless tiers scale by adding copies. Stateful tiers need [[Replication]], [[Partitioning and Sharding]] and [[Consistent Hashing]], and each brings consistency questions. Most interview deep dives end up in the data layer.

## 9. Interview questions 🔴

> [!question]- What is the difference between functional and non-functional requirements?
> Functional requirements are what the system does ("users can shorten a URL"). Non-functional requirements are how well it does it, with numbers: "p99 redirect under 50 ms, 99.99% available, 10k writes/s". The non-functional ones decide the architecture; two systems with the same features can need very different designs.

> [!question]- Your service has an LB, API and database in series, each 99.9%. What is the end-to-end availability?
> 0.999³ ≈ 99.7%, about 26 hours of downtime a year. Components in series multiply. To raise it, make each tier redundant across zones and remove hops from the critical path.

> [!question]- Trap: two replicas at 99% give 99.99%, so we are done?
> Only if they fail independently. Same rack, same deploy, same config or same dependency means they fail together. Real redundancy needs separate failure domains, staged rollouts and no shared single dependency.

> [!question]- What makes a service stateless, and why do we care?
> No request depends on data held only in that instance's memory or disk: sessions, uploads, caches and locks live in shared stores. Then any instance can serve any request, so you can load-balance freely, autoscale and replace instances during deploys.

> [!question]- Is availability the same as durability?
> No. Availability is whether the system answers now. Durability is whether stored data survives. A database can be unavailable for an hour and lose nothing; a cache can be always up and keep nothing durable.

> [!question]- How does the read:write ratio change the design?
> Read-heavy systems scale with caches, CDNs and replicas. Write-heavy systems need batching, queues, append-only storage and partitioning, because caches do not absorb writes. Always ask for the ratio early.

## 10. Cheat sheet 🟢

- Requirements first: functional, non-functional with numbers, and out of scope.
- Units: nines for availability, p99 ms for latency, RPS for throughput, nines for durability.
- 99.9% ≈ 8 h 46 min/year ≈ 43 min/month; 99.99% ≈ 53 min/year ≈ 4.3 min/month.
- Series multiplies (0.999³ = 99.7%); parallel is `1 − Π(1 − a)` only for independent failures.
- Canonical stack: DNS → CDN → LB → gateway → stateless API → cache / DB / queue → workers → object storage.
- Stateless app tier, few stateful stores; the stores hold the hard trade-offs.
- Read-heavy → cache and replicas; write-heavy → batch, queue, partition.

## Self-check 🟢🟡

> [!question]- (easy) Give one functional and one non-functional requirement for a URL shortener.
> Functional: "a user can shorten a link". Non-functional: "redirects take under 50 ms for 99% of users".

> [!question]- (easy) What does "stateless" let you do with app servers?
> Add, remove or replace copies freely, because any copy can serve any request.

> [!question]- (easy) Why put a cache in front of the database?
> Hot reads come back in about 1 ms and the database is spared the repeat work.

> [!question]- (medium) LB, API and DB are each 99.9% and in a chain. What is the total?
> 0.999 × 0.999 × 0.999 ≈ 99.7%, about 26 hours down a year.

> [!question]- (medium) Two app copies at 99% each give 99.99%. When is that false?
> When they fail together: same rack, same bad deploy, same shared dependency.

> [!question]- (medium) A system is mostly writes. Which tools come first?
> Batching, queues and partitioning; caches and replicas only help reads.

## Links

- **Before this:** [[What Happens When You Type a URL]], [[Backend Request Lifecycle and Layering]]
- **Next:** [[Scaling Basics]], [[Back-of-the-Envelope Estimation]], [[Load Balancing]], [[System Design Interview Framework]], and the case-study index in [[11 System Design MOC]]
- **Compare with:** [[Architecture Fundamentals - Coupling, Cohesion and Dependency Direction]] (inside one service rather than across services), [[Distributed Systems Fundamentals]] (what goes wrong between the boxes)

### Watch on YouTube

- [20 System Design Concepts Explained in 10 Minutes](https://www.youtube.com/watch?v=i53Gi_K3o7I) · NeetCode · 11 min · 1,768,613 views
- [System Design Concepts Course and Interview Prep](https://www.youtube.com/watch?v=F2FmTdLtb_4) · freeCodeCamp.org · 53 min · 3,275,212 views
