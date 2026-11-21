---
tags: [system-design, rate-limiting, redis, api]
level: intermediate
status: reviewed
prereqs: ["[[Redis Fundamentals]]", "[[API Gateway and BFF]]", "[[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]"]
related: ["[[Rate Limiter]]", "[[API Abuse and Bot Protection]]", "[[Load Shedding and Graceful Degradation]]", "[[Timeouts, Retries and Backoff]]", "[[Redis Replication, Sentinel and Cluster]]", "[[Hot Keys and Hot Partitions]]", "[[Redis in Go]]"]
sources:
  - "RFC 6585, Additional HTTP Status Codes (429 Too Many Requests)"
  - "RFC 9110, HTTP Semantics, section 10.2.3 Retry-After"
  - "IETF draft-ietf-httpapi-ratelimit-headers (RateLimit header fields; still an Internet-Draft)"
  - "Redis docs: EVAL and scripting (script effects replication), TIME, INCR, EXPIRE (NX option since Redis 7.0), Cluster specification (hash tags)"
  - "Stripe engineering blog, Scaling your API with rate limiters (2017)"
  - "Cloudflare blog, How we built rate limiting capable of scaling to millions of domains (2017)"
  - "Envoy docs: global rate limiting (envoyproxy/ratelimit service) and the local rate limit filter"
  - "redis-cell README (CL.THROTTLE, GCRA); throttled Go library README (GCRA)"
  - "golang.org/x/time/rate package docs"
  - "GitHub REST API docs, Rate limits (x-ratelimit-* headers)"
updated: 2026-11-13
---

# Rate Limiting - Algorithms and Distributed Design

> [!summary] TL;DR
> A **rate limiter** counts how many requests a client (an IP, user, API key or tenant) has made recently and rejects the extra ones with HTTP **429 Too Many Requests**.
>
> The counting rule is the **algorithm** (fixed window, sliding window, token bucket, leaky bucket, GCRA); when you have many servers, the counts live in a shared store such as Redis and must be updated **atomically**.

> [!abstract] Core idea
> - Pick a **key** (who is limited), a **limit** (how many per how long) and an **algorithm** (how bursts are treated).
> - Token bucket is the usual default: it allows a short burst up to the bucket size, then a steady rate.
> - With many API servers, the state goes in Redis and the read-check-update runs as **one Lua script**, or two servers will both let the "last" request through.
> - Decide up front what happens when Redis is down: **fail open** (allow, maybe with a local limiter) or **fail closed** (reject).
> - Tell clients what happened: `429`, `Retry-After`, and the remaining quota.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (where to limit and the algorithms), 4 (Go code, Redis + Lua, the public API case) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Redis Fundamentals]]: Redis is a fast in-memory store that many servers can share; keys can expire on their own after a set time.
> - [[API Gateway and BFF]]: an API gateway is the front door every API call passes through, where checks like login and limits run once for all services.
> - [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]: every reply has a status code (200 ok, 429 too many) and headers (extra lines like `Retry-After`).

**From zero, in 60 seconds** 🟢

Your API can handle only so many requests per second.
One buggy or greedy caller can send so many that everyone else gets stuck.
A **rate limiter** is a bouncer at the door. It counts how often each caller comes in.
If a caller goes over its allowed amount, the bouncer says "slow down" and sends back an error called **429 Too Many Requests**.

```mermaid
flowchart LR
    C["Caller"] --> B{"Bouncer:<br/>under the limit?"}
    B -- "yes" --> A["Your API"]
    B -- "no" --> E["429: try again later"]
```

The most common rule is the **token bucket**: each caller has a bucket of tokens. Each request uses one. Tokens refill slowly over time.
Quiet callers save up tokens, so they can do a short burst. Then they must wait for the refill.

```mermaid
flowchart LR
    R["Refill: 1 token per second"] --> K["Bucket (max 10 tokens)"]
    K -- "1 token per request" --> Q["Request allowed"]
```

When you have many servers, they must all share one count, so the count usually lives in Redis.

The rest of this note is just these 3 questions:
1. Who do you limit (user, API key, IP) and where (edge, gateway, service)?
2. Which counting rule do you use (fixed window, sliding window, token bucket)?
3. How do many servers share one count fast and safely?

**The problem in one story.**
A water park has one slide that fits 10 riders a minute.
One kid runs back up and cuts in line 50 times a minute.
Everyone else waits forever and the slide jams.
A lifeguard who says "max 2 rides a minute per kid" keeps it fair.
A rate limiter is that lifeguard for an API.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Request | One call a client makes to your server | `GET /orders/42` |
| Client / key | Who we count requests for | An API key, a user ID or an IP |
| RPS | Requests per second | 500 RPS = 500 calls each second |
| Window | A time span we count inside | "100 requests per **minute**" |
| Burst | Many requests arriving at almost the same moment | 20 calls in 50 ms |
| HTTP 429 | The "Too Many Requests" reply code | Server says: slow down |
| Redis | A fast in-memory store many servers can share | Holds the counter `rl:{user:42}` |
| Atomic | A step that runs as one unbroken piece | Read-check-update with no one in between |
| TTL | Time after which a Redis key deletes itself | counter key expires after 60 s |
| Token bucket | A bucket of tokens that refills slowly; each request spends one | 10 tokens max, 1 back per second |
| Lua script | A small program Redis runs in one go, with nothing else in between | read tokens, refill, take one |
| Fail open / fail closed | If the limiter breaks: let requests through / block them | open for search, closed for login |
| API gateway | The front door all API calls pass through | Kong, AWS API Gateway |
| Hash tag | The `{...}` part of a Redis key; only it decides which shard holds the key | `rl:{user:42}:cur` |

**Picture it**

```mermaid
flowchart LR
    C["Client request"] --> L{"Limiter:<br/>under the limit?"}
    L -- "yes" --> A["API handles it"]
    L -- "no" --> R["Reply 429<br/>+ Retry-After"]
    L <--> S[("Shared counter<br/>in Redis")]
```

**Analogy.** A bucket of tokens: each ride costs one token, and the lifeguard drops in new tokens at a steady pace. No token, no ride.
Where it breaks: a real lifeguard sees the whole line at once; ten API servers each see only part of the traffic, so they must share one counter.

**How the rest of this note builds up**

- First, why limits exist (section 1) and the key / limit / algorithm mental model (section 2).
- Then where to limit and the algorithms: fixed window, sliding window, token bucket, leaky bucket, GCRA (section 3).
- Then Go code from a single process to a Redis Lua script and HTTP middleware, plus a sizing case (section 4).
- Finally the SDE-3 deep dive: why `MULTI` is not enough, hash tags, hybrid local/global limits, GCRA, concurrency limits and fail open vs fail closed (sections 5-8).

> [!tip] Remember
> Count requests per key, reject the extra ones with 429, and keep the shared count atomic.

## 1. Why it exists 🟢

Your public API runs on 10 servers, and each can handle about 500 requests per second before latency climbs (an estimate for a typical JSON API doing one database query). That is 5,000 requests per second in total.

One customer ships a bug: a retry loop with no delay. Their client alone sends 4,000 requests per second. Now every other customer shares the remaining 1,000 requests per second of capacity, their requests queue, time out and retry, and the whole API goes down because of one caller.

A per-API-key limit of, say, 100 requests per second would have rejected 3,900 of those requests per second at almost no cost, and everyone else would not have noticed.

Rate limits protect against more than bugs:

- **Abuse:** password guessing on `/login`, scraping, card testing on a payment form (see [[API Abuse and Bot Protection]]).
- **Cost:** an endpoint that calls a paid service (an LLM, an SMS gateway) costs money per call.
- **Fairness:** on a multi-tenant platform, one tenant must not starve the others.
- **Business plans:** "Free: 60 requests per minute, Pro: 1,000" is a product feature.

## 2. Mental model 🟢

```mermaid
flowchart LR
    T["Quiet for a while:<br/>bucket full (10)"] --> B["Burst of 10 quick requests"] --> E["Bucket empty"] --> S["Now only 1 per second<br/>(as fast as tokens drip in)"]
```

Think of a **token bucket** as a turnstile that only opens when you drop a token in.

- Each client has a bucket that holds at most `capacity` tokens (for example 10).
- Tokens drip in at a steady rate (for example 1 per second) until the bucket is full.
- Each request takes one token. No token, no entry: the request gets a 429.

A client that has been quiet for a while has a full bucket, so it can make 10 quick requests (a **burst**). After that it can only go as fast as tokens drip in: 1 per second. Every other algorithm in this note is a different rule for when the turnstile opens.

### Real-life example: OTPs and booking rushes 🟢

When you log in to a UPI or banking app, you can only ask for a new OTP a few times before it says "try again after some time". That is a rate limit on the "send OTP" button, because every SMS costs money and attackers would love to spam it.
During a Tatkal rush on IRCTC, or a big film opening on BookMyShow, the site limits how fast each user or IP can hit "search" and "book", so bots cannot grab everything and real users still get through.
Public APIs like GitHub's tell you your limit in the reply headers and send `429` when you go over.

## Common beginner mistakes 🟢

- **Using `INCR` then `EXPIRE` as two separate calls** → if the second one never runs, the counter never expires and the user is blocked forever → set the expiry in the same atomic step (or use a Lua script).
- **Limiting by the IP the server sees** → behind a load balancer that is the balancer's IP, so everyone shares one bucket → read the client IP from your own trusted proxy's `X-Forwarded-For`.
- **Each server keeping its own count** → with 10 servers a user gets 10 times the limit → keep the count in a shared store such as Redis.
- **Not deciding what happens when Redis is down** → either the whole API dies or login has no limit at all → choose on purpose: fail open with a local limiter for normal calls, fail closed for login and payments.
- **Returning 429 with no `Retry-After`** → clients retry instantly and make the overload worse → tell them when to come back, and ask them to back off with random delay.

### Rate limit vs things people confuse it with 🟡

| Thing | Question it answers | Example |
| --- | --- | --- |
| Rate limit | How many requests may this caller start per second or minute? | 100 per second per API key |
| Quota | How much may this customer use this month (for billing)? | 1 million calls per month |
| Concurrency limit | How many of this caller's requests may run at the same time? | at most 5 reports running |
| Load shedding | The whole server is overloaded; what do we drop first? | reject low-priority calls at 90% CPU |

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** a rate limiter counts requests per caller and rejects extras with 429, usually using a token bucket. **Next we open the box**: where limits sit, what key to count by, how each counting rule works, and how to choose one. Each subsection starts with a plain walk-through; the full detail follows.

### Where to limit, and by what key

**In plain words:** you can put a bouncer at several doors: the outer edge (by IP), the API gateway (by API key or user), and inside each service. Cheap checks go first.

**Step by step:**
1. A flood of 1 million requests a second from bots hits your site. The edge (CDN or WAF, a web firewall in front of your site) drops most of it by IP before it reaches you.
2. Real traffic reaches the API gateway. It knows the API key, so it applies "Free plan: 10 per second".
3. The request reaches the search service. Search is expensive, so the service adds "5 searches per second per user".
4. Login has its own rule: 5 wrong passwords per account per 15 minutes.
5. Each layer catches a different kind of overuse, cheapest first.

Limits usually stack in layers, cheapest first:

```mermaid
flowchart LR
    C[Clients] --> E["Edge / CDN / WAF<br/>per-IP limits, bot rules<br/>(drops floods before they reach you)"]
    E --> G["API gateway<br/>per API key or user,<br/>per plan, per route"]
    G --> S["Service<br/>per tenant, per expensive<br/>operation (e.g. /search, /llm)"]
    S --> D[(Database / paid API)]
    G -.->|429 + Retry-After| C
    S -.->|429| C
```

- **Edge** limits stop volumetric floods by IP before they cost you anything.
- **Gateway** limits know who the caller is (API key, user ID, plan) and are the usual place for public quotas (see [[API Gateway and BFF]]).
- **Service** limits protect a specific expensive operation, for example 5 password attempts per account per 15 minutes on `/login`.

Choosing the key:

| Key | Good for | Watch out for |
| --- | --- | --- |
| IP address | Anonymous traffic, login pages | Behind a load balancer, the socket's IP is the proxy's IP, so everyone shares one bucket. Read the client IP from `X-Forwarded-For` **only** when it is set by your own trusted proxy, otherwise clients can forge it. Many users share one IP behind corporate NAT (network address translation: many devices going out through one public IP) or a mobile carrier. |
| User ID | Logged-in actions | Not available before authentication. |
| API key | Public APIs, paid plans | One customer may use many keys; add a tenant-level limit as well. |
| Tenant / org | Multi-tenant fairness | Needs a second, finer key so one user cannot use the whole tenant's quota. |
| Key + route | Expensive endpoints | More keys in the store. |

### The algorithms

**In plain words:** these are different ways to count. The simplest counts requests per minute. Smarter ones smooth out the edges between minutes or use a bucket of tokens.

**Step by step (token bucket, the usual default):**
1. User 42 has a bucket with room for 10 tokens, refilled at 1 token per second. It starts full.
2. At 10:00:00 the user fires 10 quick requests. Each takes a token. All 10 pass.
3. The 11th request finds 0 tokens. It gets `429` and "retry after 1 second".
4. At 10:00:03, 3 seconds have passed, so 3 tokens are added back when the next request arrives (no background timer needed).
5. The user can now make 3 more requests. Long-run average: 1 per second; short burst: up to 10.

The other rules below (fixed window, sliding window, leaky bucket, GCRA) just change when the "door" opens.

**1. Fixed window counter.** Keep one counter per key per window, for example `rl:user:42:2026-11-04T10:30`. Increment it on each request, reject when it is above the limit, and let it expire after the window.

The classic Redis version is **not atomic**:

```text
INCR  rl:user:42:202611041030
EXPIRE rl:user:42:202611041030 60
```

(`INCR` adds 1 to a counter; `EXPIRE` sets its TTL.) If the process crashes between the two calls, or the `EXPIRE` is only sent when `INCR` returned 1 and that one call fails, the key has no TTL and lives forever. Once it passes the limit, the user is blocked for good. Atomic versions:

```text
# Option A (Redis 7.0+): both commands in one MULTI/EXEC; NX only sets a TTL if none exists
MULTI
INCR   rl:user:42:202611041030
EXPIRE rl:user:42:202611041030 60 NX
EXEC

# Option B (any version): create the key with its TTL first, then increment
SET  rl:user:42:202611041030 0 EX 60 NX
INCR rl:user:42:202611041030
```

The weakness of a fixed window is the **boundary burst**: a client can send the full limit at the end of one window and the full limit again at the start of the next.

```mermaid
flowchart LR
    subgraph W1["Window 10:00:00 to 10:00:59 (limit 100)"]
        A["10:00:00-10:00:58<br/>0 requests"] --> B["10:00:59<br/>100 requests: allowed"]
    end
    subgraph W2["Window 10:01:00 to 10:01:59 (limit 100)"]
        C["10:01:00<br/>100 requests: allowed<br/>(counter reset)"] --> D["10:01:01-10:01:59<br/>rejected"]
    end
    B --> C
    B -.-> X["200 requests in about 1 second:<br/>2x the limit"]
    C -.-> X
```

**2. Sliding window log.** Store the timestamp of every request in a sorted set (ZSET) and count the ones inside the last window.

```text
ZREMRANGEBYSCORE rl:{user:42} -inf <now_ms - 60000>   # drop old entries
ZCARD            rl:{user:42}                          # how many in the last 60 s?
ZADD             rl:{user:42} <now_ms> <request_id>    # only if under the limit
PEXPIRE          rl:{user:42} 60000
```

It is exact, with no boundary burst, but memory is **O(requests in the window)** per key, and the four commands must run in one Lua script to be correct under concurrency.

**3. Sliding window counter.** Keep only the counters for the current and the previous fixed window, and estimate the count over the last full window by weighting the previous one by how much of it still overlaps:

`estimate = prev × (1 − elapsed / window) + curr`

Example: limit 100 per minute. The previous minute had 80 requests, the current one has 30, and we are 15 seconds into it (elapsed / window = 0.25). Estimate = 80 × 0.75 + 30 = **90**, so 10 more requests fit.

It assumes the previous window's requests were spread evenly, which is why it is an approximation, but it costs two integers per key.

```mermaid
flowchart LR
    P["Previous minute: 80"] -- "x 0.75 still overlaps" --> E["Estimate = 60 + 30 = 90"]
    C["Current minute so far: 30"] --> E
    E --> D{"Under 100?"}
    D -- "yes" --> OK["Allow"]
```

**4. Token bucket.** Keep `tokens` and `last_refill_time`. On each request, first add `elapsed × rate` tokens (capped at `capacity`), then take one if available. This is **lazy refill**: nothing runs in the background; the bucket is topped up only when it is read. Capacity sets the burst size and rate sets the long-run average.

**5. Leaky bucket.** Two different things share this name:
- **As a queue:** requests enter a FIFO (first in, first out) queue of fixed size and a worker takes them out at a constant rate; when the queue is full, new requests are dropped. Output is perfectly smooth, but requests wait. This is **traffic shaping** (for example, sending to a partner API that allows exactly 10 calls per second).
- **As a meter:** a counter that drains at a constant rate and rejects when it would overflow. This behaves like a token bucket viewed upside down.

**6. GCRA (generic cell rate algorithm).** Store a single timestamp per key: the **theoretical arrival time** (TAT) of the next request. With emission interval `T = period / rate` and burst tolerance `τ = T × (burst − 1)`, a request at time `now` is allowed if `now ≥ TAT − τ`; then `TAT = max(TAT, now) + T`.

It gives the same behaviour as a token bucket while storing one number instead of two. redis-cell (`CL.THROTTLE`) and the Go library throttled implement it.

### Choosing an algorithm

**In plain words:** pick by what you need: exact counts, low memory, or allowing short bursts. The chart below walks you to an answer.

**Step by step:**
1. Calling a partner that allows exactly 10 calls a second, no bursts? Use a leaky bucket queue.
2. Is a short burst fine, like a page load firing 8 calls at once? Use a token bucket (or GCRA).
3. Is every single attempt precious, like OTP or login, and traffic per user small? Use a sliding window log for exact counts.
4. Otherwise, at huge scale, use the cheap sliding window counter.

```mermaid
flowchart TD
    Q1{"Must output be perfectly<br/>smooth (calling a strict partner)?"} -- yes --> LB["Leaky bucket as a queue"]
    Q1 -- no --> Q2{"Are short bursts OK<br/>(page loads, batch clients)?"}
    Q2 -- yes --> TB["Token bucket or GCRA"]
    Q2 -- no --> Q3{"Need exact counts<br/>and traffic per key is low<br/>(login, OTP)?"}
    Q3 -- yes --> SL["Sliding window log"]
    Q3 -- no --> SC["Sliding window counter<br/>(cheap, approximate)"]
```

## 4. Worked example 🟡

### Whiteboard version

The whole token bucket in 15 lines:

```go
package wb

import "time"

// Bucket is the bare token bucket: refill lazily, then spend one token.
type Bucket struct {
	cap, perSec, tokens float64
	last                time.Time
}

func (b *Bucket) Allow(now time.Time) bool {
	b.tokens = min(b.cap, b.tokens+now.Sub(b.last).Seconds()*b.perSec)
	b.last = now
	if b.tokens < 1 {
		return false // caller answers 429
	}
	b.tokens--
	return true
}
```

Trace with capacity 10 and 1 token per second: at `t = 0` the bucket is full, so 10 requests pass and the 11th fails. At `t = 2.5 s`, 2.5 tokens have come back, so 2 more pass and the third fails (0.5 tokens left).

### Single-process limiters in Go

**In plain words:** these limiters live inside the memory of one server. Fast and simple, but each server only sees its own traffic.

All three take an injected clock, so tests can move time without sleeping. Each is safe for concurrent use.

Token bucket, which also reports how long to wait (for `Retry-After`):

```go
// Package ratelimit holds single-process limiters with an injected clock.
package ratelimit

import (
	"sync"
	"time"
)

// TokenBucket allows bursts up to capacity and a long-run rate of refill tokens/second.
// Refill is lazy: tokens are topped up only when Allow is called.
type TokenBucket struct {
	mu       sync.Mutex
	capacity float64
	refill   float64 // tokens per second
	tokens   float64
	last     time.Time
	now      func() time.Time
}

func NewTokenBucket(capacity, refillPerSec float64, now func() time.Time) *TokenBucket {
	return &TokenBucket{capacity: capacity, refill: refillPerSec, tokens: capacity, last: now(), now: now}
}

// Allow spends cost tokens if available. When it refuses, retryAfter says when
// enough tokens will exist.
func (b *TokenBucket) Allow(cost float64) (ok bool, retryAfter time.Duration) {
	b.mu.Lock()
	defer b.mu.Unlock()
	now := b.now()
	if elapsed := now.Sub(b.last).Seconds(); elapsed > 0 {
		b.tokens = min(b.capacity, b.tokens+elapsed*b.refill)
		b.last = now
	}
	if b.tokens >= cost {
		b.tokens -= cost
		return true, 0
	}
	missing := cost - b.tokens
	return false, time.Duration(missing / b.refill * float64(time.Second))
}
```

Sliding window counter:

```go
package ratelimit

import (
	"sync"
	"time"
)

// SlidingWindow is the sliding-window counter: two fixed-window counters and a
// weighted estimate  prev*(1 - elapsed/window) + curr.
type SlidingWindow struct {
	mu          sync.Mutex
	limit       int
	window      time.Duration
	windowStart time.Time // start of the current fixed window
	prev, curr  int
	now         func() time.Time
}

func NewSlidingWindow(limit int, window time.Duration, now func() time.Time) *SlidingWindow {
	return &SlidingWindow{limit: limit, window: window, windowStart: now().Truncate(window), now: now}
}

func (s *SlidingWindow) Allow() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := s.now()
	start := now.Truncate(s.window)
	switch n := start.Sub(s.windowStart) / s.window; {
	case n == 1: // moved into the next window
		s.prev, s.curr = s.curr, 0
	case n > 1: // idle for 2+ windows: both counters are stale
		s.prev, s.curr = 0, 0
	}
	s.windowStart = start
	elapsed := float64(now.Sub(start)) / float64(s.window)
	estimate := float64(s.prev)*(1-elapsed) + float64(s.curr)
	if estimate+1 > float64(s.limit) {
		return false
	}
	s.curr++
	return true
}
```

GCRA:

```go
package ratelimit

import (
	"sync"
	"time"
)

// GCRA (generic cell rate algorithm) stores one timestamp per key: the
// theoretical arrival time (TAT) of the next request.
type GCRA struct {
	mu       sync.Mutex
	interval time.Duration // emission interval T = period / rate
	tau      time.Duration // burst tolerance = T * (burst - 1)
	tat      time.Time
	now      func() time.Time
}

func NewGCRA(rate int, period time.Duration, burst int, now func() time.Time) *GCRA {
	t := period / time.Duration(rate)
	return &GCRA{interval: t, tau: t * time.Duration(burst-1), now: now}
}

func (g *GCRA) Allow() (bool, time.Duration) {
	g.mu.Lock()
	defer g.mu.Unlock()
	now := g.now()
	tat := g.tat
	if tat.Before(now) {
		tat = now
	}
	allowAt := tat.Add(-g.tau)
	if now.Before(allowAt) {
		return false, allowAt.Sub(now)
	}
	g.tat = tat.Add(g.interval)
	return true, 0
}
```

Tests. `TestFixedWindowBoundaryBurstIsBlockedBySlidingCounter` replays the boundary-burst timeline from section 3: 100 requests at 10:00:59, then 100 more at 10:01:00. A fixed window would allow all 200; the sliding counter estimates `100 × (1 − 0) + 0 = 100` and rejects all of the second batch.

```go
package ratelimit

import (
	"sync"
	"testing"
	"time"
)

type clock struct {
	mu sync.Mutex
	t  time.Time
}

func (c *clock) now() time.Time      { c.mu.Lock(); defer c.mu.Unlock(); return c.t }
func (c *clock) add(d time.Duration) { c.mu.Lock(); c.t = c.t.Add(d); c.mu.Unlock() }
func newClock() *clock               { return &clock{t: time.Date(2026, 11, 4, 10, 0, 0, 0, time.UTC)} }

func TestTokenBucketBurstThenRefill(t *testing.T) {
	c := newClock()
	b := NewTokenBucket(10, 1, c.now) // burst 10, 1 token/s
	for i := 0; i < 10; i++ {
		if ok, _ := b.Allow(1); !ok {
			t.Fatalf("request %d should pass (burst)", i)
		}
	}
	ok, retry := b.Allow(1)
	if ok || retry != time.Second {
		t.Fatalf("11th: ok=%v retry=%v", ok, retry)
	}
	c.add(2500 * time.Millisecond) // 2.5 tokens come back
	passed := 0
	for i := 0; i < 5; i++ {
		if ok, _ := b.Allow(1); ok {
			passed++
		}
	}
	if passed != 2 {
		t.Fatalf("after 2.5 s want 2 passes, got %d", passed)
	}
	c.add(time.Hour) // refill is capped at capacity
	passed = 0
	for i := 0; i < 20; i++ {
		if ok, _ := b.Allow(1); ok {
			passed++
		}
	}
	if passed != 10 {
		t.Fatalf("cap: got %d", passed)
	}
}

func TestTokenBucketConcurrent(t *testing.T) {
	c := newClock()
	b := NewTokenBucket(100, 1, c.now)
	var wg sync.WaitGroup
	var mu sync.Mutex
	passed := 0
	for g := 0; g < 10; g++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := 0; i < 50; i++ {
				if ok, _ := b.Allow(1); ok {
					mu.Lock()
					passed++
					mu.Unlock()
				}
			}
		}()
	}
	wg.Wait()
	if passed != 100 {
		t.Fatalf("500 concurrent requests, capacity 100: passed %d", passed)
	}
}

func TestSlidingWindowWeightsPreviousWindow(t *testing.T) {
	c := newClock() // 10:00:00, exactly on a window boundary
	s := NewSlidingWindow(100, time.Minute, c.now)
	c.add(30 * time.Second)
	for i := 0; i < 100; i++ {
		if !s.Allow() {
			t.Fatalf("first window request %d refused", i)
		}
	}
	if s.Allow() {
		t.Fatal("101st in the same window must be refused")
	}
	// 10:01:15 -> 25% into the new window: estimate = 100*0.75 + curr, so 25 fit.
	c.add(45 * time.Second)
	passed := 0
	for i := 0; i < 100; i++ {
		if s.Allow() {
			passed++
		}
	}
	if passed != 25 {
		t.Fatalf("want 25, got %d", passed)
	}
	c.add(3 * time.Minute) // idle for several windows: everything resets
	if !s.Allow() {
		t.Fatal("should allow after idle")
	}
}

func TestFixedWindowBoundaryBurstIsBlockedBySlidingCounter(t *testing.T) {
	c := newClock()
	s := NewSlidingWindow(100, time.Minute, c.now)
	c.add(59 * time.Second) // 100 requests at 10:00:59
	for i := 0; i < 100; i++ {
		s.Allow()
	}
	c.add(time.Second) // 10:01:00 -> a fixed window would allow 100 more now
	passed := 0
	for i := 0; i < 100; i++ {
		if s.Allow() {
			passed++
		}
	}
	if passed != 0 {
		t.Fatalf("sliding counter should refuse the boundary burst, passed %d", passed)
	}
}

func TestGCRA(t *testing.T) {
	c := newClock()
	g := NewGCRA(10, time.Second, 3, c.now) // 10/s, burst 3 -> T = 100 ms, tau = 200 ms
	for i := 0; i < 3; i++ {
		if ok, _ := g.Allow(); !ok {
			t.Fatalf("burst request %d refused", i)
		}
	}
	ok, retry := g.Allow()
	if ok || retry != 100*time.Millisecond {
		t.Fatalf("4th: ok=%v retry=%v", ok, retry)
	}
	c.add(100 * time.Millisecond)
	if ok, _ := g.Allow(); !ok {
		t.Fatal("one slot should open every 100 ms")
	}
	if ok, _ := g.Allow(); ok {
		t.Fatal("only one slot opened")
	}
}
```

For one process you rarely need to write your own: `golang.org/x/time/rate` is a token bucket, where `Limit` is the refill rate and `burst` is the capacity.

```go
package ratelimit

import (
	"fmt"
	"time"

	"golang.org/x/time/rate"
)

// x/time/rate is a token bucket: Limit is the refill rate, burst is the capacity.
func Example_xTimeRate() {
	lim := rate.NewLimiter(rate.Every(100*time.Millisecond), 3) // 10/s, burst 3
	start := time.Date(2026, 11, 4, 10, 0, 0, 0, time.UTC)
	for i := 0; i < 4; i++ {
		fmt.Print(lim.AllowN(start, 1), " ")
	}
	fmt.Println(lim.AllowN(start.Add(100*time.Millisecond), 1))
	// Output: true true true false true
}
```

### Distributed token bucket: Redis + Lua

**In plain words:** many servers share one bucket kept in Redis. A small script reads, refills and takes a token in one go, so two servers never spend the same token.

With 10 API servers, each server's in-memory bucket only sees a tenth of the traffic. The state must be shared, and the read-refill-check-write must be **one atomic step**. Otherwise two servers both read `tokens = 1`, both allow, and both write `0`, so two requests went through on one token.

Redis runs a Lua script atomically: no other command runs in the middle of it. The script also reads the time with Redis `TIME`, so every API server uses **Redis's clock**, not its own (API servers' clocks drift apart).

Since Redis 5.0 scripts are replicated by their effects (the writes they make) by default, and Redis 7.0 removed the old verbatim mode, so calling `TIME` before writing is safe.

```mermaid
sequenceDiagram
    participant C as Client (API key k_42)
    participant A as API server 3
    participant R as Redis
    C->>A: GET /v1/orders
    A->>R: EVALSHA token_bucket 1 rl:{key:k_42} 100 10 1
    Note over R: one atomic step:<br/>TIME, HMGET tokens ts,<br/>refill, check, HSET, PEXPIRE
    alt tokens >= 1
        R-->>A: {1, 57, 0}
        A-->>C: 200 OK, RateLimit-Remaining: 57
    else bucket empty
        R-->>A: {0, 0, 83000}
        A-->>C: 429, Retry-After: 1
    end
```

The Go side, with go-redis v9. `redis.NewScript` sends `EVALSHA` and falls back to `EVAL` the first time the script is not cached on the server.

```go
package ratelimit

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// tokenBucketLua runs atomically inside Redis. It reads the clock with TIME so
// every API server uses the same clock. Redis 7 always replicates a script's
// effects (its writes), so calling TIME before writing is allowed.
const tokenBucketLua = `
local capacity = tonumber(ARGV[1])
local rate     = tonumber(ARGV[2])   -- tokens per second
local cost     = tonumber(ARGV[3])
local t   = redis.call('TIME')
local now = tonumber(t[1]) * 1000000 + tonumber(t[2])   -- microseconds
local s      = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(s[1]) or capacity
local ts     = tonumber(s[2]) or now
tokens = math.min(capacity, tokens + math.max(0, now - ts) * rate / 1000000)
local allowed, retry_us = 0, 0
if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
else
  retry_us = math.ceil((cost - tokens) * 1000000 / rate)
end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], math.ceil(capacity / rate * 1000) + 1000)
return {allowed, math.floor(tokens), retry_us}
`

var tokenBucketScript = redis.NewScript(tokenBucketLua)

// Decision is what the HTTP layer needs to answer 200 or 429.
type Decision struct {
	Allowed    bool
	Remaining  int64
	RetryAfter time.Duration
}

// RedisTokenBucket is a distributed limiter shared by every API server.
type RedisTokenBucket struct {
	rdb      redis.Scripter
	capacity int
	perSec   float64
}

func NewRedisTokenBucket(rdb redis.Scripter, capacity int, perSec float64) *RedisTokenBucket {
	return &RedisTokenBucket{rdb: rdb, capacity: capacity, perSec: perSec}
}

// Key wraps the id in a hash tag so that, in Redis Cluster, every key for this
// client hashes to the same slot.
func Key(scope, id string) string { return fmt.Sprintf("rl:{%s:%s}", scope, id) }

func (r *RedisTokenBucket) Allow(ctx context.Context, key string) (Decision, error) {
	res, err := tokenBucketScript.Run(ctx, r.rdb, []string{key}, r.capacity, r.perSec, 1).Int64Slice()
	if err != nil {
		return Decision{}, err
	}
	return Decision{
		Allowed:    res[0] == 1,
		Remaining:  res[1],
		RetryAfter: time.Duration(res[2]) * time.Microsecond,
	}, nil
}
```

Notes on the script:

- `now` is in microseconds: about 1.7 × 10^15 today, well below 2^53, so Lua's double-precision numbers hold it exactly.
- The TTL is the time to refill a full bucket plus 1 second. An idle key disappears, and a missing key is treated as a full bucket, which is exactly what it would be after that much idle time.
- Lua returns floats to Redis as truncated integers, so the script floors `tokens` itself.
- This code compiles and passes `go vet`; the Redis path was not run here because no Redis server is available in this environment. Its logic is the same as the tested in-memory `TokenBucket`.

### HTTP middleware with headers and a fail-open fallback

**In plain words:** this wraps every web request with the limit check. If Redis is down, it lets requests through (fail open) instead of blocking everyone.

```go
package ratelimit

import (
	"context"
	"math"
	"net/http"
	"strconv"
	"time"
)

// Limiter is satisfied by RedisTokenBucket (and by fakes in tests).
type Limiter interface {
	Allow(ctx context.Context, key string) (Decision, error)
}

// Middleware asks the global limiter first. If the store fails or is slow, it
// falls back to a per-instance bucket (fail-open, but still bounded).
func Middleware(global Limiter, fallback *TokenBucket, limit int, keyOf func(*http.Request) string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 20*time.Millisecond)
		defer cancel()
		d, err := global.Allow(ctx, keyOf(r))
		if err != nil {
			ok, retry := fallback.Allow(1)
			d = Decision{Allowed: ok, RetryAfter: retry, Remaining: -1}
			w.Header().Set("X-RateLimit-Degraded", "local")
		}
		w.Header().Set("RateLimit-Limit", strconv.Itoa(limit))
		if d.Remaining >= 0 {
			w.Header().Set("RateLimit-Remaining", strconv.FormatInt(d.Remaining, 10))
		}
		if !d.Allowed {
			secs := int(math.Ceil(d.RetryAfter.Seconds()))
			w.Header().Set("Retry-After", strconv.Itoa(max(secs, 1)))
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}
```

```go
package ratelimit

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

type fakeLimiter struct {
	d   Decision
	err error
}

func (f fakeLimiter) Allow(context.Context, string) (Decision, error) { return f.d, f.err }

func serve(l Limiter, fb *TokenBucket) *httptest.ResponseRecorder {
	ok := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	h := Middleware(l, fb, 100, func(r *http.Request) string { return r.Header.Get("X-API-Key") }, ok)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/orders", nil))
	return rec
}

func TestMiddleware429WithRetryAfter(t *testing.T) {
	c := newClock()
	rec := serve(fakeLimiter{d: Decision{Allowed: false, Remaining: 0, RetryAfter: 1200 * time.Millisecond}},
		NewTokenBucket(5, 1, c.now))
	if rec.Code != http.StatusTooManyRequests || rec.Header().Get("Retry-After") != "2" ||
		rec.Header().Get("RateLimit-Remaining") != "0" {
		t.Fatalf("code=%d headers=%v", rec.Code, rec.Header())
	}
}

func TestMiddlewareFallsBackWhenRedisFails(t *testing.T) {
	c := newClock()
	fb := NewTokenBucket(2, 1, c.now)
	down := fakeLimiter{err: errors.New("dial tcp: connection refused")}
	codes := []int{serve(down, fb).Code, serve(down, fb).Code, serve(down, fb).Code}
	if codes[0] != 200 || codes[1] != 200 || codes[2] != 429 {
		t.Fatalf("fallback codes = %v", codes)
	}
}
```

`go vet` is clean and `go test -race` passes all eight tests and the example in the package (Go 1.24.4).

### Case: design a rate limiter for a public API

**In plain words:** a full design you could draw in an interview: plans with different limits, shared counts, tiny extra delay, and keep working if the limiter breaks.

**Requirements.** Limit each API key to its plan's rate (Free: 10 requests per second, burst 20; Pro: 100 per second, burst 200). Limits hold across all servers and all regions to within a few percent. The check adds under 2 ms at p99. If the limiter fails, the API keeps serving. Clients learn their quota from headers.

**Estimates (all estimates, with units):**

- Peak traffic: 200,000 requests per second across 200 API servers, so 1,000 requests per second per server.
- Active keys: 5,000,000 API keys, of which 500,000 are active in any minute.
- State per key (token bucket as a Redis hash with two fields): about 100 bytes including key name and overhead. 500,000 × 100 B = **50 MB**. Even all 5,000,000 keys would be 500 MB. Memory is not the problem.
- The same with a sliding log at a Pro limit of 6,000 requests per minute: up to 6,000 entries × about 50 B = 300 KB per busy key. 10,000 busy keys would need **3 GB**. This is why the log is kept for low-rate keys such as logins.
- Redis load: one script call per request = 200,000 calls per second.

  One Redis process handles on the order of 100,000 simple commands per second (an estimate; measure with `redis-benchmark` on your hardware), and a Lua script call costs several times a simple command, so shard across a Redis Cluster of several primaries (for example 4 to 8) and measure.

**High-level design.**

```mermaid
flowchart LR
    LB[Load balancer] --> A1[API server 1<br/>local bucket cache]
    LB --> A2[API server 2<br/>local bucket cache]
    LB --> A3[API server N<br/>local bucket cache]
    A1 --> RC
    A2 --> RC
    A3 --> RC
    subgraph RC["Redis Cluster (hash slots)"]
        R1[(primary 1)]
        R2[(primary 2)]
        R3[(primary 3)]
    end
    CFG[(Plan config:<br/>key -> limits)] -.->|cached, refreshed every 60 s| A1
    A1 -->|"allowed: forward<br/>denied: 429"| U[Upstream handlers]
```

**Deep dives an interviewer will push on:**

1. **Race conditions** (two servers acting on the same value at the same moment). The read-check-write runs as one Lua script per key (shown above). `MULTI` (Redis's way to send a batch of commands that run together) alone is not enough for token bucket, because the decision depends on values read inside the transaction.
2. **Redis Cluster.** A script may only touch keys in one hash slot. A sliding window counter that uses `rl:user:42:1030` and `rl:user:42:1029` would hash the two keys to different slots and fail with `CROSSSLOT`.

   Put the shared part in a **hash tag**: `rl:{user:42}:1030` and `rl:{user:42}:1029`; only the text inside `{…}` is hashed, so both land in the same slot. A single hot key still sits on one shard (see [[Hot Keys and Hot Partitions]]).
3. **Latency and round trips: hybrid local + global.** A Redis call per request adds a network round trip (typically a fraction of a millisecond in the same zone, an estimate).

   To cut it, each server can keep a **local** bucket that takes a share of the quota (for example `limit / number_of_servers`, with a margin) and sync with Redis in batches, say every 100 ms or every 10 requests.

   You trade exactness (a key can briefly exceed its limit by up to the unsynced amount) for fewer round trips. Envoy offers both a local rate-limit filter and a global rate-limit service for the same reason.
4. **Fail open or fail closed.** If Redis times out (20 ms budget in the middleware above), **fail open with a local limiter** for ordinary API traffic, so a Redis outage does not take the API down while each server still caps damage on its own.

   **Fail closed** where letting extra requests through is worse than rejecting, such as `/login` brute-force limits or an endpoint that sends money or SMS.
5. **Multi-region.** One global Redis adds a cross-region round trip (tens of milliseconds) to every request. The usual answer is a limiter per region with a share of the global quota, or asynchronous counter syncing between regions, accepting that a client hitting several regions at once can briefly exceed the limit.
6. **Client feedback.** Return `429` with `Retry-After` (seconds, RFC 9110) and quota headers, and document that clients should back off with jitter (a small random extra wait, so clients do not all retry at the same instant) (see [[Timeouts, Retries and Backoff]]). Without this, rejected clients retry immediately and make the overload worse.

### Response headers

**In plain words:** tell callers how much they have left and when to retry, so good clients can slow down on their own.

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
Retry-After: 12
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 12

{"type":"https://api.example.com/errors/rate-limited","title":"Too Many Requests","status":429,"detail":"Limit 100 requests per 60 s for this API key."}
```

- `429 Too Many Requests` is defined in RFC 6585; `Retry-After` in RFC 9110 (seconds or an HTTP date).
- The `RateLimit-*` fields come from an IETF draft that is **not yet an RFC**. Earlier drafts (and many APIs today) use the three separate fields above; later revisions of the draft replace them with structured `RateLimit` and `RateLimit-Policy` fields. Many APIs still use their own `X-RateLimit-*` names; GitHub, for example, sends `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-used` and `x-ratelimit-reset`.
- `Reset` as "seconds from now" avoids depending on the client's clock; an absolute Unix timestamp (GitHub's choice) breaks when the client's clock is wrong.

## 5. Variants and comparison 🟡

| Algorithm | State per key | Redis type | Accuracy | Bursts | Best for |
| --- | --- | --- | --- | --- | --- |
| Fixed window | 1 counter | String (`INCR`) | Up to 2× the limit at a window edge | Boundary burst | Coarse quotas (per day), simplest code |
| Sliding window log | 1 entry per request | Sorted set | Exact | None beyond the limit | Low-rate, sensitive limits: login, OTP |
| Sliding window counter | 2 counters | Two strings, hash-tagged | Approximate (assumes even spread) | Smoothed | General API limits at large scale |
| Token bucket | tokens + timestamp | Hash | Exact for the model | Up to capacity, then steady rate | Public APIs, the usual default |
| Leaky bucket (queue) | queue | List or in-process queue | Exact | None: output is constant | Shaping calls to a strict downstream |
| GCRA | 1 timestamp (TAT) | String | Exact for the model | Up to `burst` | Token-bucket behaviour with the least state |
| Concurrency limiter | in-flight count | Counter with `INCR`/`DECR` | Exact | n/a | Long or expensive requests (Stripe uses one) |

**Rate limits vs quotas.** A rate limit protects capacity over seconds or minutes ("100 per second"). A quota is a business allowance over a long period ("1,000,000 calls per month") and must be durable and billable, so it usually lives in a database with periodic aggregation, not in a Redis key with a TTL.

## 6. Trade-offs and when not to use 🟡

- **Exactness costs memory or round trips.** The sliding log is exact but O(requests) per key; the counter and the bucket are O(1) but approximate the window or allow bursts.
- **Global accuracy costs latency.** A shared store adds a network hop to every request; local limiters are free but each one sees only part of the traffic.
- **A limiter is another dependency.** If it is in the request path, its outage policy (fail open or closed) matters as much as its algorithm.
- **Per-client limits do not stop overload.** If 10,000 legitimate clients each stay under their limit, the system can still be overloaded. Protecting the server from total load is the job of load shedding and concurrency limits (see [[Load Shedding and Graceful Degradation]]), not per-key rate limits.
- **IP limits punish shared networks.** One office or one mobile carrier NAT can put thousands of users behind one IP. Use IP limits as a coarse outer layer and identity-based limits inside.
- **When a simpler option wins:** a single-instance internal tool needs `x/time/rate` in memory, not Redis. A batch job calling a partner needs a client-side limiter (a leaky bucket or `rate.Limiter.Wait`), not a server.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** the algorithms, the Go and Redis code, and a full public-API design. **Next comes the senior view**: how Stripe, Cloudflare and Envoy do it, what breaks in production, and the subtle details (transactions vs scripts, hash slots, hybrid limits, the sliding counter's error).

- **Real systems:**
	- **Stripe** (2017 engineering blog) described four limiters: a request-rate limiter (token bucket in Redis), a concurrent-requests limiter, and two load shedders that reserve capacity for critical traffic when the fleet or workers are saturated.
	- **Cloudflare** (2017 blog) uses the sliding window counter at its edge. It reported that, on 400 million requests, 0.003% were wrongly allowed or rate-limited compared with an exact count.
	- **Envoy** offers a local rate-limit filter (a token bucket per proxy) and a global mode in which the proxy calls an external gRPC rate-limit service (the reference implementation, envoyproxy/ratelimit, keeps counters in Redis).
	- **redis-cell** adds a `CL.THROTTLE` command implementing GCRA inside Redis.
	- **GitHub** publishes per-user and per-app hourly limits with `x-ratelimit-*` headers.
- **Failure modes and fixes:**
	- *Key with no TTL blocks a user forever* → atomic `INCR` + `EXPIRE … NX`, `SET … NX EX`, or Lua.
	- *All traffic shares one bucket* → the limiter keyed on the load balancer's IP; read the client IP from your trusted proxy's `X-Forwarded-For`.
	- *Redis outage takes the API down* → a short timeout and fail open with a local limiter (or fail closed on sensitive endpoints, by decision, not by accident).
	- *Hot key overloads one Redis shard* → a local pre-limiter for that key, or cache denials locally for the `Retry-After` period so a blocked client does not hit Redis on every retry.
	- *Clients retry 429s instantly* → `Retry-After` plus documented exponential backoff with jitter.
	- *Clock differences between servers* → take time from Redis `TIME` inside the script, not from each server.
- **What to monitor:** 429 rate per key and per route (a sudden jump means an attack, a bug or a limit set too low), limiter latency p99, limiter errors and fallback activations (`X-RateLimit-Degraded` above), Redis CPU and ops per second per shard, and the top keys by rejections.

## 8. Deep dive 🔴

### Why `MULTI` is not enough for a token bucket

**In plain words:** a Redis transaction cannot "read, think, then write" in one step. A Lua script can, so we use that.

`MULTI … EXEC` queues commands and runs them together, but you cannot use a value read inside the transaction to decide what to write inside the same transaction. A token bucket must read `tokens`, compute, and then decide whether to decrement.

The options are optimistic `WATCH` (retry on conflict, which spins under contention), a Lua script (one atomic step, the standard choice), or a Redis Function (the Redis 7.0+ way to register scripts by name).

### Hash tags and multi-key scripts

**In plain words:** in a Redis cluster, put the same `{...}` part in all keys of one caller so they sit on the same machine and one script can touch them all.

Redis Cluster splits keys into 16,384 slots by `CRC16(key) mod 16384`. If a key contains `{…}`, only the text inside the braces is hashed. Rate-limit keys should therefore be built as `rl:{<scope>:<id>}:<suffix>`, as the `Key` helper above does, so that every key a script touches for one client is in one slot.

The downside: everything for one client lives on one shard, so a very hot client is a hot shard.

### Hybrid limits, worked out

**In plain words:** each server keeps a small local bucket and checks in with Redis now and then. Much less Redis traffic, at the cost of letting a few extra requests slip through.

```mermaid
flowchart LR
    S1["Server 1: local bucket 100/s"] -- "sync every 100 ms" --> R["Redis: global 1,000/s"]
    S2["Server 2: local bucket 100/s"] -- "sync every 100 ms" --> R
    S3["... 10 servers"] -- "sync" --> R
```

Global limit: 1,000 requests per second for a key, 10 API servers. Give each server a local bucket of 100 per second (1,000 / 10) and sync usage to Redis every 100 ms.

Between syncs, the worst case is every server using its full local share while the global bucket is already empty: up to 10 servers × 100 per second × 0.1 s = **100 extra requests per sync interval**, about 10% over for one interval.

Shorter syncs or smaller local shares reduce the overshoot and increase Redis traffic. If traffic for the key is spread unevenly over servers, a fixed `limit / N` share rejects too early on the busy server, so real systems rebalance the shares from Redis.

### GCRA in one picture

**In plain words:** GCRA is a token bucket that stores just one time stamp ("when you may come next") instead of a token count.

With rate 10 per second (`T = 100 ms`) and burst 3 (`τ = 200 ms`): three requests at `t = 0` push TAT from 0 to 100, 200, then 300 ms.

A fourth request at `t = 0` would need `0 ≥ 300 − 200 = 100`, so it is rejected and told to retry in 100 ms. That is exactly the behaviour of a token bucket with capacity 3 and 10 tokens per second, but the state is one timestamp. `TestGCRA` checks this trace.

### Concurrency limits vs rate limits

**In plain words:** a rate limit asks "how many started this second?". A concurrency limit asks "how many are running right now?". Slow jobs need the second one.

A rate limit counts **starts per second**; a concurrency limit counts **requests in flight**. A report endpoint that takes 30 seconds can be "1 per second" and still have 30 running at once.

For slow or expensive work, limit concurrency (a semaphore, a counter of free slots that callers take and give back, locally, or `INCR`/`DECR` with a TTL safety net in Redis), and remember to release in a `defer` so failures do not leak slots.

### The sliding counter's error

**In plain words:** the sliding counter guesses, assuming the requests of the last minute were spread evenly. Usually the guess is great; in rare cases it lets in up to double.

The sliding counter assumes the previous window's requests were spread evenly.

If they were all at its very end, the estimate undercounts them. Worst case, with a limit of 100 per minute: 100 requests at 10:00:59, then at 10:01:58 the estimate is `100 × (1 − 58/60) + curr ≈ 3 + curr`, so about 96 more are allowed during 10:01:00-10:01:58.

That is close to **2× the limit inside one 60-second span**, the same bound as the fixed window, but only for this contrived pattern. Cloudflare's measurement (0.003% of requests wrongly handled) shows that on real traffic the error is tiny; for a security limit where every attempt counts, use the sliding log instead.

## 9. Interview questions 🔴

> [!question]- Design a rate limiter for an API with 200 servers.
> Key by API key (plus IP at the edge). Token bucket per key in Redis Cluster, updated by one Lua script that uses Redis `TIME`; keys hash-tagged per client. Middleware with a 20 ms timeout: on Redis failure, fail open to a per-server local bucket.
>
> Return 429 with `Retry-After` and remaining-quota headers. Then discuss hot keys, hybrid local/global limits to save round trips, and multi-region shares.

> [!question]- Trap: "We use `INCR` then `EXPIRE` in Redis, so the fixed window is atomic." Is it?
> No. They are two separate commands. If the client crashes or the `EXPIRE` fails after `INCR`, the key has no TTL, and once it passes the limit the user is blocked forever. Use `MULTI` with `EXPIRE key 60 NX` (Redis 7.0+), `SET key 0 EX 60 NX` followed by `INCR`, or a Lua script.

> [!question]- Token bucket vs leaky bucket?
> A token bucket allows a burst up to its capacity and then a steady rate; requests are allowed or rejected immediately. A leaky bucket used as a queue smooths output to a constant rate and makes requests wait, rejecting only when the queue is full.
>
> Use token bucket for APIs, and leaky bucket for shaping calls to a downstream that cannot take bursts.

> [!question]- Write the sliding window counter formula and explain its error.
> `prev × (1 − elapsed / window) + curr`. It assumes requests in the previous window were spread evenly, so bunched traffic is under- or over-counted. It costs two counters per key instead of one entry per request; Cloudflare measured the error at 0.003% of requests on real traffic.

> [!question]- Redis is down. What does your rate limiter do?
> It depends on the endpoint, and that is a decision you make up front. For ordinary traffic, fail open with a local per-server limiter so the API stays up and each server still caps abuse.
>
> For login, OTP or money-moving endpoints, fail closed. Either way, use a short timeout so a slow Redis does not add seconds to every request, and alert on fallback activations.

> [!question]- How do you rate-limit across Redis Cluster shards when your algorithm needs two keys?
> Put a hash tag in the key, for example `rl:{user:42}:cur` and `rl:{user:42}:prev`. Only `user:42` is hashed, so both keys are in the same slot and one Lua script can touch both. Without the tag, the script fails with `CROSSSLOT`.

> [!question]- What is the difference between a rate limit and a quota?
> A rate limit protects capacity over a short window ("100 per second"), is approximate and can live in Redis with TTLs. A quota is a business allowance over a long period ("1 million calls per month"), must be durable and auditable for billing, and usually lives in a database fed by usage events.

## 10. Cheat sheet 🟢

- Key choice: IP at the edge (from a trusted proxy's `X-Forwarded-For`), API key or user at the gateway, tenant plus route in the service.
- Fixed window: one atomic counter; up to 2× the limit at a window boundary.
- Sliding log: exact, ZSET, memory O(requests). Sliding counter: `prev × (1 − elapsed/window) + curr`.
- Token bucket: capacity = burst, rate = refill, lazy refill on read. GCRA: one TAT timestamp, same behaviour.
- Distributed: one Lua script per check, Redis `TIME` as the clock, hash tags `{…}` for Redis Cluster.
- Fail open with a local limiter for normal traffic; fail closed for login, OTP and payments.
- Respond `429` + `Retry-After`; `RateLimit-*` headers are an IETF draft.

## Self-check 🟢🟡

> [!question]- (easy) What status code does a rate limiter send when you are over the limit?
> `429 Too Many Requests`, ideally with a `Retry-After` header.

> [!question]- (easy) In a token bucket, what do capacity and refill rate control?
> Capacity is the largest burst; refill rate is the long-run average allowed.

> [!question]- (easy) Why must many API servers share one count?
> Otherwise each server allows the full limit, so a user gets the limit times the number of servers.

> [!question]- (medium) What is the boundary burst problem of a fixed window?
> A client can send the full limit at the end of one window and again at the start of the next: about 2× in one second.

> [!question]- (medium) Limit 100/min, previous minute 80, current 30, 15 s in. Sliding counter estimate?
> 80 × 0.75 + 30 = 90, so 10 more fit.

> [!question]- (medium) Why does the Redis check run as one Lua script?
> So read, refill, check and write happen with nothing in between; otherwise two servers can spend the same last token.

## Links

- **Before this:** [[Unique ID Generation]], [[Redis Fundamentals]], [[API Gateway and BFF]]
- **Next:** [[Bloom Filters and Probabilistic Data Structures]]
- **Compare with:** [[Rate Limiter]] (the class-level LLD twin), [[Load Shedding and Graceful Degradation]] (protecting total capacity), [[API Abuse and Bot Protection]] (the security layer around limits), [[Redis in Go]]

### Watch on YouTube

- [Design a Distributed Rate Limiter w/ a Ex-Meta Staff Engineer: System Design Breakdown](https://www.youtube.com/watch?v=MIJFyUPG4Z4) · Hello Interview · 55 min · 326,544 views
- [Rate Limiter System Design: Token Bucket, Leaky Bucket, Scaling](https://www.youtube.com/watch?v=YXkOdWBwqaA) · ByteByteGo · 7 min · 99,414 views
