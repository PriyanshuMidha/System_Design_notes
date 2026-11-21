---
tags: [distributed-systems, resilience, retries, timeouts]
level: basic
status: reviewed
prereqs: ["[[Distributed Systems Fundamentals]]", "[[Context Package]]", "[[Idempotency and Idempotency Keys]]"]
related: ["[[10 Distributed Systems & Resilience/Circuit Breaker|Circuit Breaker]]", "[[Bulkheads and Concurrency Limits]]", "[[Load Shedding and Graceful Degradation]]", "[[Rate Limiting - Algorithms and Distributed Design]]", "[[Dead Letter Queues and Poison Messages]]", "[[Calling External APIs]]", "[[gRPC]]"]
sources:
  - "Marc Brooker, Exponential Backoff And Jitter (AWS Architecture Blog, 2015)"
  - "AWS Builders' Library, Timeouts, retries, and backoff with jitter"
  - "Google SRE book, chapter 22 Addressing Cascading Failures, and chapter 21 Handling Overload"
  - "Dean & Barroso, The Tail at Scale (CACM, February 2013)"
  - "gRPC A6 proposal: Client Retries (retryPolicy, hedgingPolicy, retry throttling)"
  - "RFC 9110 HTTP Semantics, section 10.2.3 Retry-After; RFC 6585 section 4 (429 Too Many Requests)"
  - "AWS SDKs and Tools Reference Guide, Retry behavior (standard mode)"
  - "Go 1.24 net/http and context package documentation"
updated: 2026-11-13
---

# Timeouts, Retries and Backoff

> [!summary] TL;DR
> A **timeout** is how long you wait for a remote call before giving up. A **retry** sends the call again after a transient failure, and **backoff** makes each wait longer than the last, with random **jitter** so that thousands of clients do not retry at the same instant.

> [!abstract] Core idea
> - Put a timeout on every network call; without one, a hung dependency hangs you.
> - Retry only transient errors (503, timeouts, resets) and only idempotent operations.
> - Wait `random(0, min(cap, base × 2^n))` before retry `n`: capped exponential backoff with full jitter.
> - Limit retries per request (about 3 attempts) and per client (a budget of about 10% extra load), and retry at one layer only.
> - Classic mistake: immediate retries in every layer, which multiply load on an already failing service.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works), 4 (worked example), 5 (variants) and 6 (trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Distributed Systems Fundamentals]]: a call that times out may still have worked on the other side; the outcome is "unknown".
> - [[Context Package]]: in Go, a `context` carries a deadline and a cancel signal down through every call.
> - [[Idempotency and Idempotency Keys]]: a unique key on a request lets the server skip a repeat, so retrying is safe.

**From zero, in 60 seconds** 🟢

Your service calls another service. Sometimes the answer never comes.
A **timeout** is how long you wait before giving up.
Without one, your code can wait forever and pile up stuck work.

```mermaid
flowchart LR
    Y["Your service"] -- "call" --> O["Other service"]
    Y --> T{"Waited 300 ms?"}
    T -- "yes" --> G["Give up"]
```

Many failures are short, like a server restarting. So trying again often works. That is a **retry**.
But if thousands of clients retry at once, they knock the server down again.
So each retry waits longer than the last (that is **backoff**), plus a small random extra, so clients do not all retry at the same moment.

```mermaid
flowchart LR
    A["Try 1 fails"] --> W1["Wait about 0.1 s"]
    W1 --> B["Try 2 fails"] --> W2["Wait about 0.2 s"]
    W2 --> C["Try 3 works"]
```

The rest of this note is just these 3 questions:
1. How long should you wait, and how does the time limit pass between services?
2. Which errors are worth retrying?
3. How do you space and limit retries so they help instead of hurt?

**The problem in one story.** You phone a friend and nobody picks up.
You do not hold the phone forever: after a while you hang up (a timeout).
You try again later (a retry), and if they still do not answer you wait longer each time (backoff).
If a whole class calls the same friend at the same second, the line is jammed, so each person waits a random extra bit (jitter).

**Words you need first**

| Word | Plain meaning | Tiny example |
|---|---|---|
| Remote call | Asking another program over the network to do something | Your service calls the payment API |
| Timeout | Maximum time you wait for one answer | Give up after 300 ms |
| Deadline | Absolute time by which the whole request must finish | "Done by 12:00:01.000" |
| Transient error | A failure that will likely go away soon | 503 while a pod restarts |
| Idempotent | Doing it twice has the same effect as once | `GET /user/7`, or a payment with an idempotency key |
| Backoff | Waiting longer before each new try | 100 ms, 200 ms, 400 ms |
| Jitter | Random part added to the wait | Wait a random time between 0 and 400 ms |
| Retry storm | Many clients retrying at once and overloading a server | 1,000 clients all retry at the same instant |
| Goroutine | A lightweight Go task; each waiting call holds one | 15,000 goroutines stuck on a hung API |
| p99.9 | The time that 999 of 1,000 calls beat | p99.9 = 250 ms for payments |
| Retry budget | A cap on retries as a share of all requests | Retries may add at most 10% extra calls |
| DLQ | Dead letter queue: a parking spot for jobs that keep failing | After 3 failed tries, the email job goes to the DLQ |
| Hedged request | Sending a second copy when the first is slow, and using whichever answers first | Ask replica B if replica A has not answered in 50 ms |

**Picture it**

```mermaid
flowchart LR
  A[Call service] --> B{Answer before timeout?}
  B -- yes --> C[Done]
  B -- no or 503 --> D{Retryable and attempts left?}
  D -- no --> E[Return error]
  D -- yes --> F[Wait random 0..cap x 2^n]
  F --> A
```

**Analogy.** Like knocking on a busy shop door: stop after a while, come back later, and do not all come back together.
Where it breaks: a shop never charges you twice for knocking, but a non-idempotent remote call (like "pay 100") can run twice if you retry.

**How the rest of this note builds up**

- First, *Why it exists* and *Mental model* show the two naive habits: no timeout and instant retries.
- Then *How it works* walks the four steps: timeouts as a budget, which errors to retry, backoff with jitter, bounding the total.
- The *Worked example* traces a deadline budget and gives a full Go implementation with tests.
- Finally, the SDE-3 deep dive covers deadline propagation, why full jitter wins, retry budgets and hedged requests.

> [!tip] Remember
> Always time out, retry only safe and transient failures, wait exponentially longer with random jitter, and cap the total.

## 1. Why it exists 🟢

🟢 **Plain version:** Short failures are common: a server restarts, a packet is lost. Trying again a moment later usually works. Two bad habits turn these small blips into big outages. First, waiting forever with no timeout, so stuck calls pile up. Second, retrying instantly and in every layer, so a weak server gets hit by waves of repeats.

Most failures between services are short: a **pod** (one running copy of a service in Kubernetes) restarting, a dropped packet, a **leader election** (the servers picking a new boss) that takes a second. Retrying a moment later usually succeeds. But two naive habits turn short failures into outages.

**No timeout.** Go's `http.DefaultClient` has no timeout. If a dependency accepts the connection and never answers, every goroutine that calls it waits forever. At 500 requests per second, 30 s of hanging means 15,000 stuck goroutines, each holding a connection and memory (**Little's Law**, a simple rule for queues: in flight = rate × wait; see [[Bulkheads and Concurrency Limits]]).

**Naive retries.** Suppose a database blips for 2 s and 1,000 clients each make 3 attempts with no wait in between.

The database receives 1,000 requests, then another 1,000 at the same moment, then another 1,000: it sees three synchronized waves at the exact moment it is weakest.

Now add layers. If the browser, the API gateway and the backend service each make 3 attempts, one user click becomes up to `3 × 3 × 3 = 27` calls to the bottom service.

```mermaid
flowchart LR
    U["1 click"] --> B["Browser: 3 tries"]
    B --> G["Gateway: 3 tries each"]
    G --> S["Backend: 3 tries each"]
    S --> DB["Bottom service: up to 27 calls"]
```

**Measured in this note's test** (`TestJitterSpreadsAStorm`, seeded PCG random, a random generator started from a fixed number so every run gives the same result, 1,000 clients, 3 retries each, 100 ms base): without jitter the busiest 10 ms window receives **1,000** retries; with full jitter the busiest window receives **158**.

### Real-life example 🟢

You order food on Swiggy and tap "Place order". Behind the button, the app calls the restaurant, payment and delivery services.
If the payment service is restarting, the first call fails, the app waits a fraction of a second and tries again, and you never notice.
If the app retried instantly, a million phones would hammer the payment service the moment it came back.
So each phone waits a slightly different, growing time. And because the order carries a unique key, a retry never charges you twice.

## 2. Mental model 🟢

Think of a crowded shop whose door jams for a minute.

- **Timeout:** each customer decides how long they will stand at the door before leaving. Without a limit, the queue outside grows without end.
- **Retry without backoff:** everyone pushes the door again every second. The crowd at the door never thins.
- **Exponential backoff:** each customer waits 1 minute, then 2, then 4 before trying again.
- **Jitter:** each customer picks a random time within that wait, so they come back one by one, not as a crowd.
- **Retry budget:** the shop lets only a few people re-try at once; the rest are told to come back later.

## Common beginner mistakes 🟢

- **Using Go's default HTTP client** → it has no timeout, so one hung server can freeze your service → create a client with `Timeout` set, and pass a context deadline.
- **Retrying every error** → a 400 "bad request" or "card declined" will fail the same way every time → retry only temporary errors such as 503, resets and timeouts.
- **Retrying a payment without an idempotency key** → the first try may have worked, so the retry charges twice → send one key per payment and let the server skip repeats.
- **Waiting a fixed 100 ms with no randomness** → all clients that failed together retry together, in waves → use growing waits with full jitter.
- **Retrying in every layer** → 3 layers × 3 tries = 27 calls on the weakest service → retry in one layer only; the others fail fast.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that you must stop waiting at some point, retry only safe and temporary failures, and spread retries out with growing random waits. **Next we open the box**: how a time budget flows down a chain of services, exactly which errors are retryable, the backoff formulas, and how to cap the total. Each step starts with a short walk-through.

### Step 1: timeouts everywhere, as a budget

**In plain words:** the user's request has one total time limit, and each call down the chain gets only what is left of it.

**Step by step:**
1. The gateway gets a checkout request and sets a deadline: "finish within 1,000 ms".
2. It passes that deadline to the checkout service inside the context. Checkout starts with 980 ms left.
3. Checkout calls payments with a 300 ms limit for this one try. The try times out: 680 ms left.
4. Checkout retries. Payments sees in the context that only about 600 ms remain, and stops work if that runs out.
5. If time runs out anywhere, everyone below stops together instead of working for a user who has left.

A timeout bounds one attempt. A **deadline** bounds the whole user request, and is passed down so that every hop knows how much time is left. In Go the deadline lives in the `context.Context`; in **gRPC** (a fast way for services to call each other) it travels in the `grpc-timeout` header, and the server's handler receives a context that expires at the same moment as the caller's.

Layers of timeouts on a Go HTTP client:

| Setting | Bounds | Typical value (estimate, tune per dependency) |
| --- | --- | --- |
| `net.Dialer.Timeout` | TCP connect | 100–500 ms inside a region |
| `http.Transport.TLSHandshakeTimeout` | TLS handshake (the step where both sides set up encryption) | 500 ms–1 s |
| `http.Transport.ResponseHeaderTimeout` | Waiting for response headers after sending the request | about p99.9 of the dependency |
| `http.Client.Timeout` | The whole exchange, including reading the body | per-attempt budget |
| `context.WithTimeout` | Everything done with that context, across retries | the user-facing deadline |

On the server side, `http.Server` has `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout` and `IdleTimeout`. All default to zero, which means no limit; a server without `ReadHeaderTimeout` can be held open by slow clients (**Slowloris**, an attack that sends a request one byte at a time to tie up the server).

```mermaid
flowchart LR
    G["Gateway: 1,000 ms total"] --> C["Checkout starts: 980 ms left"]
    C --> P["Payments try 1 times out: 680 ms left"]
    P --> B["Payments try 2: 616 ms left"]
```

### Step 2: decide whether the error is retryable

**In plain words:** retry short, temporary errors on calls that are safe to repeat. Never retry "bad request" or "card declined".

**Step by step:**
1. A call to the payment service fails.
2. Ask: is the error temporary? A 503 "busy" or a reset connection: yes. A 400 "bad request" or "card declined": no, stop.
3. Ask: is the call safe to repeat? A `GET /user/7`: yes. A `POST /pay` with key `pay-81`: yes. A `POST /pay` with no key: no, stop.
4. Is there still time left before the deadline? If yes, retry with backoff. If not, return the error.

Retry when the failure is **transient** and the operation is **idempotent** (repeating it has the same effect as doing it once). A non-idempotent POST is retryable only if it carries an idempotency key that the server deduplicates ([[Idempotency and Idempotency Keys]]).

| Retry | Do not retry |
| --- | --- |
| Connection refused or reset, DNS timeout | 400 Bad Request, 422 validation errors |
| 408 Request Timeout | 401 Unauthorized, 403 Forbidden |
| 429 Too Many Requests: honour `Retry-After` | 404 Not Found, 409 Conflict (business conflict) |
| 500, 502, 503, 504 on idempotent requests | 501 Not Implemented |
| gRPC `UNAVAILABLE`, and `RESOURCE_EXHAUSTED` with pushback (the server says how long to wait) | Invalid password, card declined, insufficient funds |
| Per-attempt timeout, when the overall deadline still has room | The caller's own deadline expired (`DEADLINE_EXCEEDED` on the outer context) |

Two subtleties:

- **408 and 429 are 4xx but retryable.** 429 means "you are sending too fast"; retry after the time in `Retry-After`, never sooner. See [[Rate Limiting - Algorithms and Distributed Design]].
- **gRPC `DEADLINE_EXCEEDED` is ambiguous.** The server may have done the work, and if the deadline was the caller's overall budget, there is no time left to retry. Retry it only for idempotent calls, with a per-attempt timeout shorter than the overall deadline.

```mermaid
flowchart TB
    E["Call failed"] --> T{"Temporary error? 503, reset, timeout"}
    T -- "no: 400, 404, card declined" --> S["Stop, return error"]
    T -- "yes" --> I{"Safe to repeat?"}
    I -- "no key, not idempotent" --> S
    I -- "yes" --> R["Retry with backoff"]
```

### Step 3: back off, with jitter

**In plain words:** wait a bit longer after each failure, and pick a random time within that wait so clients spread out.

**Step by step:**
1. Set `base` = 100 ms (first wait) and `cap` = 2 s (longest wait).
2. After the 1st failure, the ceiling is 100 ms. Pick a random wait between 0 and 100 ms, say 64 ms.
3. After the 2nd failure, the ceiling doubles to 200 ms. Pick a random wait between 0 and 200 ms, say 150 ms.
4. Each later ceiling doubles again (400, 800 ms...) but never goes above 2 s.
5. If the server sent `Retry-After: 2`, wait at least 2 seconds, whatever the random pick was.

Let `base` be the first wait and `cap` the longest. For retry number `n` (starting at 0) the **ceiling** is `min(cap, base × 2^n)`. Marc Brooker's AWS article compares three ways to pick the actual wait:

- **Full jitter:** `sleep = random(0, ceiling)`.
- **Equal jitter:** `sleep = ceiling/2 + random(0, ceiling/2)`.
- **Decorrelated jitter:** `sleep = min(cap, random(base, previous_sleep × 3))`.

In his simulation, full and decorrelated jitter finished the same work with far fewer total calls than no jitter, and full jitter was the simplest of the good options, which is why it is the usual default. Equal jitter keeps a guaranteed minimum wait at the cost of more clustering.

```mermaid
flowchart LR
    F0["attempt 1 fails"] --> W0["wait random 0–100 ms<br/>ceiling = base = 100 ms"]
    W0 --> A2["attempt 2"]
    A2 -- fails --> W1["wait random 0–200 ms<br/>ceiling = 200 ms"]
    W1 --> A3["attempt 3"]
    A3 -- fails --> STOP["stop: max 3 attempts<br/>return error, or park in a DLQ"]
    A2 -- succeeds --> OK["done"]
    A3 -- succeeds --> OK
    W0 -. "if the response had Retry-After: 2<br/>wait max(jitter, 2 s)" .-> A2
```

Why jitter matters, shown as two timelines for the same outage:

```mermaid
sequenceDiagram
    participant C as 1,000 clients
    participant S as Recovering service
    Note over C,S: No jitter: everyone waits exactly 100 ms, then 200 ms
    C->>S: t=0: 1,000 requests fail
    C->>S: t=100 ms: 1,000 retries at once (overload again)
    C->>S: t=300 ms: 1,000 retries at once (overload again)
    Note over C,S: Full jitter: each waits random(0, ceiling)
    C->>S: t=0: 1,000 requests fail
    C->>S: t=0–100 ms: retries spread out, at most 158 in any 10 ms window (measured)
    C->>S: t=0–300 ms: second retries spread over a wider window
    S-->>C: most succeed, the service stays below capacity
```

### Step 4: bound the total

**In plain words:** cap the number of tries per request and the share of extra traffic retries may add.

**Step by step:**
1. Each request gets at most 3 tries, and never more than its deadline allows.
2. Each client keeps a small "retry wallet". Every normal request adds 0.1 tokens; every retry costs 1 token.
3. During a full outage, 1,000 requests earn about 100 tokens, so only about 100 retries happen, not 2,000.
4. Only one layer (say, the checkout service) retries. The layers above and below fail fast and pass the error up.

- **Per request:** a maximum number of attempts (3 is common; gRPC caps `maxAttempts` at 5) and the overall deadline.
- **Per client:** a **retry budget**. The Google SRE book recommends keeping retries below about 10% of requests per client, so that a total outage adds at most 10% load rather than tripling it. gRPC's retry throttling does this with a **token bucket** (a counter that refills slowly; each retry must take a token).
- **Per system:** retry at one layer only, usually the one closest to the failing dependency, or at the edge where the user can be told. Inner layers fail fast and return a clear error.

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** about 20 lines: growing wait with a cap, random spread, stop when the deadline is gone.

The essentials in about 20 lines: capped exponential backoff, full jitter, a cancellable sleep, and no sleep after the last attempt. Randomness is passed in so tests can fix it.

```go
package wbretry

import (
	"context"
	"math/rand/v2"
	"time"
)

// Retry calls op up to 3 times with capped exponential backoff and full jitter.
func Retry(ctx context.Context, r *rand.Rand, op func(context.Context) error) error {
	base, ceiling := 100*time.Millisecond, 2*time.Second
	var err error
	for attempt := 0; attempt < 3; attempt++ {
		if err = op(ctx); err == nil {
			return nil
		}
		if attempt == 2 {
			break // no sleep after the last attempt
		}
		backoff := min(ceiling, base<<attempt)               // 100 ms, 200 ms, 400 ms ...
		sleep := time.Duration(r.Int64N(int64(backoff) + 1)) // full jitter: [0, backoff]
		select {
		case <-time.After(sleep):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return err
}
```

### A deadline budget, traced

**In plain words:** follow one 1-second checkout request and watch how much time each service down the chain gets.

A user request to `POST /checkout` has a 1 s deadline at the gateway. The checkout service calls payments, whose p99.9 latency is 250 ms (estimate for this example).

| Time | Event | Remaining budget |
| --- | --- | --- |
| 0 ms | Gateway sets deadline = now + 1,000 ms, passes it in the context | 1,000 ms |
| 20 ms | Checkout starts attempt 1 with a 300 ms per-attempt timeout | 980 ms |
| 320 ms | Attempt 1 times out; outcome unknown, but the request carries idempotency key `chk-9f2` | 680 ms |
| 320 ms | Retry 0: full jitter picks 64 ms out of the 0–100 ms range | 680 ms |
| 384 ms | Attempt 2 starts with a 300 ms timeout | 616 ms |
| 520 ms | Payments answers 200 OK (deduplicated by key if attempt 1 had landed) | 480 ms |
| 540 ms | Checkout replies to the gateway | 460 ms |

If attempt 2 had also timed out at 684 ms, a third attempt would need up to 200 ms of backoff plus 300 ms, which overruns the remaining 316 ms.

The code below makes the simpler check: it returns the error instead of sleeping when the chosen backoff alone would outlive the deadline. A stricter version would also reserve time for the next attempt (backoff + per-attempt timeout ≤ remaining).

### Production version

**In plain words:** the full retry helper with error checks, retry budgets and metrics. Skim the comments first.

`Do` adds what the whiteboard version leaves out:

- a `Policy` with base, cap and attempts, and all three jitter formulas;
- `Permanent(err)` to stop on errors that retrying cannot fix;
- `RetryAfterError`, so a server's `Retry-After` is respected;
- a `Budget` in which every request earns 0.1 tokens and every retry spends 1;
- a deadline check before sleeping;
- an injected `Sleeper` and `*rand.Rand`, so tests run instantly and give the same result every time.

```go
// Package retry runs an operation again after transient failures, with
// capped exponential backoff, full jitter, Retry-After and a retry budget.
package retry

import (
	"context"
	"errors"
	"math/rand/v2"
	"net/http"
	"strconv"
	"sync"
	"time"
)

// Policy bounds how often and how long we retry.
type Policy struct {
	Base        time.Duration // first backoff ceiling, e.g. 100 ms
	Cap         time.Duration // largest backoff ceiling, e.g. 5 s
	MaxAttempts int           // total attempts including the first, e.g. 3
}

// ceiling returns min(Cap, Base*2^n) without overflowing.
func (p Policy) ceiling(n int) time.Duration {
	d := p.Base
	for i := 0; i < n && d < p.Cap; i++ {
		d *= 2
	}
	return min(d, p.Cap)
}

// FullJitter returns a delay uniformly drawn from [0, min(Cap, Base*2^n)],
// where n is the retry number starting at 0.
func (p Policy) FullJitter(n int, r *rand.Rand) time.Duration {
	return time.Duration(r.Int64N(int64(p.ceiling(n)) + 1))
}

// EqualJitter keeps half the ceiling and randomises the other half.
func (p Policy) EqualJitter(n int, r *rand.Rand) time.Duration {
	half := p.ceiling(n) / 2
	return half + time.Duration(r.Int64N(int64(half)+1))
}

// Decorrelated returns min(Cap, random in [Base, prev*3]).
// Pass prev = Base for the first retry.
func (p Policy) Decorrelated(prev time.Duration, r *rand.Rand) time.Duration {
	hi := max(prev*3, p.Base)
	d := p.Base + time.Duration(r.Int64N(int64(hi-p.Base)+1))
	return min(d, p.Cap)
}

// permanentError marks an error that retrying cannot fix.
type permanentError struct{ err error }

func (e permanentError) Error() string { return e.err.Error() }
func (e permanentError) Unwrap() error { return e.err }

// Permanent wraps err so that Do stops at once.
func Permanent(err error) error { return permanentError{err} }

// RetryAfterError carries the server's Retry-After hint.
type RetryAfterError struct {
	Err   error
	After time.Duration
}

func (e *RetryAfterError) Error() string { return e.Err.Error() }
func (e *RetryAfterError) Unwrap() error { return e.Err }

// RetryableStatus reports whether an HTTP status is worth retrying
// for an idempotent request.
func RetryableStatus(code int) bool {
	switch code {
	case http.StatusRequestTimeout, http.StatusTooManyRequests,
		http.StatusInternalServerError, http.StatusBadGateway,
		http.StatusServiceUnavailable, http.StatusGatewayTimeout:
		return true
	}
	return false
}

// ParseRetryAfter reads a Retry-After value: delay-seconds or an HTTP-date.
func ParseRetryAfter(v string, now time.Time) (time.Duration, bool) {
	if s, err := strconv.Atoi(v); err == nil && s >= 0 {
		return time.Duration(s) * time.Second, true
	}
	if t, err := http.ParseTime(v); err == nil {
		return max(t.Sub(now), 0), true
	}
	return 0, false
}

// Budget allows retries only while they stay below a fraction of requests.
// Every request earns `ratio` tokens; every retry spends one token.
type Budget struct {
	mu     sync.Mutex
	ratio  float64
	tokens float64
	max    float64
}

// NewBudget with ratio 0.1 allows about one retry per ten requests.
func NewBudget(ratio, maxTokens float64) *Budget {
	return &Budget{ratio: ratio, tokens: maxTokens, max: maxTokens}
}

func (b *Budget) onRequest() {
	b.mu.Lock()
	b.tokens = min(b.tokens+b.ratio, b.max)
	b.mu.Unlock()
}

func (b *Budget) allowRetry() bool {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.tokens < 1 {
		return false
	}
	b.tokens--
	return true
}

// Sleeper waits for d or until ctx is done. Tests pass a fake.
type Sleeper func(ctx context.Context, d time.Duration) error

// RealSleep is the production Sleeper.
func RealSleep(ctx context.Context, d time.Duration) error {
	t := time.NewTimer(d)
	defer t.Stop()
	select {
	case <-t.C:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// ErrBudgetExhausted means the retry budget refused another attempt.
var ErrBudgetExhausted = errors.New("retry budget exhausted")

// Do calls op until it succeeds, fails permanently, runs out of attempts
// or budget, or ctx ends. It returns the number of attempts made.
func Do(ctx context.Context, p Policy, b *Budget, r *rand.Rand, sleep Sleeper,
	op func(context.Context) error) (int, error) {
	if b != nil {
		b.onRequest()
	}
	var err error
	for attempt := 1; ; attempt++ {
		if err = op(ctx); err == nil {
			return attempt, nil
		}
		var perm permanentError
		if errors.As(err, &perm) || ctx.Err() != nil || attempt >= p.MaxAttempts {
			return attempt, err
		}
		if b != nil && !b.allowRetry() {
			return attempt, errors.Join(ErrBudgetExhausted, err)
		}
		delay := p.FullJitter(attempt-1, r)
		var ra *RetryAfterError
		if errors.As(err, &ra) {
			delay = max(delay, ra.After) // never come back sooner than asked
		}
		if deadline, ok := ctx.Deadline(); ok && time.Until(deadline) < delay {
			return attempt, err // the wait would outlive the caller's deadline
		}
		if serr := sleep(ctx, delay); serr != nil {
			return attempt, errors.Join(serr, err)
		}
	}
}
```

The tests check the backoff ceilings, the three jitter ranges, when `Do` stops, `Retry-After`, the deadline check and the budget, and they measure how jitter spreads a storm:

```go
package retry

import (
	"context"
	"errors"
	"math/rand/v2"
	"sync"
	"testing"
	"time"
)

var errTransient = errors.New("503 service unavailable")

func newRand() *rand.Rand { return rand.New(rand.NewPCG(1, 2)) }

// fakeSleep records delays instead of waiting.
type fakeSleep struct{ delays []time.Duration }

func (f *fakeSleep) sleep(_ context.Context, d time.Duration) error {
	f.delays = append(f.delays, d)
	return nil
}

func TestCeilingDoublesThenCaps(t *testing.T) {
	p := Policy{Base: 100 * time.Millisecond, Cap: time.Second}
	want := []time.Duration{100, 200, 400, 800, 1000, 1000}
	for n, w := range want {
		if got := p.ceiling(n); got != w*time.Millisecond {
			t.Errorf("ceiling(%d) = %v, want %v", n, got, w*time.Millisecond)
		}
	}
	if got := p.ceiling(200); got != time.Second { // no overflow
		t.Errorf("ceiling(200) = %v", got)
	}
}

func TestJitterRanges(t *testing.T) {
	p := Policy{Base: 100 * time.Millisecond, Cap: time.Second}
	r := newRand()
	for i := 0; i < 1000; i++ {
		n := i % 6
		c := p.ceiling(n)
		if d := p.FullJitter(n, r); d < 0 || d > c {
			t.Fatalf("full jitter %v outside [0,%v]", d, c)
		}
		if d := p.EqualJitter(n, r); d < c/2 || d > c {
			t.Fatalf("equal jitter %v outside [%v,%v]", d, c/2, c)
		}
	}
	prev := p.Base
	for i := 0; i < 1000; i++ {
		d := p.Decorrelated(prev, r)
		if d < p.Base || d > p.Cap || d > max(prev*3, p.Base) {
			t.Fatalf("decorrelated %v from prev %v out of range", d, prev)
		}
		prev = d
	}
}

func TestRetriesTransientThenSucceeds(t *testing.T) {
	p := Policy{Base: 100 * time.Millisecond, Cap: time.Second, MaxAttempts: 4}
	fs := &fakeSleep{}
	calls := 0
	n, err := Do(context.Background(), p, nil, newRand(), fs.sleep, func(context.Context) error {
		calls++
		if calls < 3 {
			return errTransient
		}
		return nil
	})
	if err != nil || n != 3 || len(fs.delays) != 2 {
		t.Fatalf("n=%d err=%v delays=%v", n, err, fs.delays)
	}
	for i, d := range fs.delays {
		if d > p.ceiling(i) {
			t.Errorf("delay %d = %v above ceiling %v", i, d, p.ceiling(i))
		}
	}
}

func TestStopsAtMaxAttempts(t *testing.T) {
	p := Policy{Base: time.Millisecond, Cap: time.Second, MaxAttempts: 3}
	fs := &fakeSleep{}
	n, err := Do(context.Background(), p, nil, newRand(), fs.sleep,
		func(context.Context) error { return errTransient })
	if n != 3 || !errors.Is(err, errTransient) || len(fs.delays) != 2 {
		t.Fatalf("n=%d err=%v delays=%d", n, err, len(fs.delays))
	}
}

func TestPermanentErrorIsNotRetried(t *testing.T) {
	p := Policy{Base: time.Millisecond, Cap: time.Second, MaxAttempts: 5}
	errBad := errors.New("400 bad request")
	n, err := Do(context.Background(), p, nil, newRand(), (&fakeSleep{}).sleep,
		func(context.Context) error { return Permanent(errBad) })
	if n != 1 || !errors.Is(err, errBad) {
		t.Fatalf("n=%d err=%v", n, err)
	}
}

func TestRetryAfterIsHonoured(t *testing.T) {
	p := Policy{Base: 10 * time.Millisecond, Cap: 100 * time.Millisecond, MaxAttempts: 2}
	fs := &fakeSleep{}
	_, _ = Do(context.Background(), p, nil, newRand(), fs.sleep, func(context.Context) error {
		return &RetryAfterError{Err: errTransient, After: 2 * time.Second}
	})
	if len(fs.delays) != 1 || fs.delays[0] != 2*time.Second {
		t.Fatalf("delays = %v, want [2s]", fs.delays)
	}
}

func TestDoesNotSleepPastDeadline(t *testing.T) {
	p := Policy{Base: time.Hour, Cap: time.Hour, MaxAttempts: 5}
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	fs := &fakeSleep{}
	r := rand.New(rand.NewPCG(7, 7))
	n, err := Do(ctx, p, nil, r, fs.sleep, func(context.Context) error { return errTransient })
	// Seed 7 draws a first delay longer than the 1 min left, so Do gives up at once.
	if n != 1 || len(fs.delays) != 0 || !errors.Is(err, errTransient) {
		t.Fatalf("n=%d delays=%v err=%v", n, fs.delays, err)
	}
}

func TestBudgetCapsRetryRatio(t *testing.T) {
	p := Policy{Base: time.Millisecond, Cap: time.Millisecond, MaxAttempts: 3}
	b := NewBudget(0.1, 10) // starts full: 10 tokens
	fs := &fakeSleep{}
	retries := 0
	for i := 0; i < 1000; i++ { // the dependency is down for 1,000 requests
		n, _ := Do(context.Background(), p, b, newRand(), fs.sleep,
			func(context.Context) error { return errTransient })
		retries += n - 1
	}
	// 10 starting tokens + 0.1 per request => about 110 retries, not 2,000.
	t.Logf("retries with budget: %d", retries)
	if retries < 100 || retries > 120 {
		t.Fatalf("retries = %d, want about 110", retries)
	}
}

func TestBudgetConcurrent(t *testing.T) {
	b := NewBudget(0.1, 10)
	var wg sync.WaitGroup
	for i := 0; i < 8; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100; j++ {
				b.onRequest()
				b.allowRetry()
			}
		}()
	}
	wg.Wait()
}

func TestRetryableStatus(t *testing.T) {
	for _, c := range []int{408, 429, 500, 502, 503, 504} {
		if !RetryableStatus(c) {
			t.Errorf("%d should be retryable", c)
		}
	}
	for _, c := range []int{400, 401, 403, 404, 409, 422, 501} {
		if RetryableStatus(c) {
			t.Errorf("%d should not be retryable", c)
		}
	}
}

func TestParseRetryAfter(t *testing.T) {
	now := time.Date(2026, 11, 4, 10, 0, 0, 0, time.UTC)
	if d, ok := ParseRetryAfter("120", now); !ok || d != 2*time.Minute {
		t.Fatalf("seconds form: %v %v", d, ok)
	}
	if d, ok := ParseRetryAfter("Wed, 04 Nov 2026 10:00:30 GMT", now); !ok || d != 30*time.Second {
		t.Fatalf("date form: %v %v", d, ok)
	}
	if _, ok := ParseRetryAfter("soon", now); ok {
		t.Fatal("garbage accepted")
	}
}

func TestRealSleepStopsOnCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if err := RealSleep(ctx, time.Hour); !errors.Is(err, context.Canceled) {
		t.Fatal(err)
	}
}

// TestJitterSpreadsAStorm: 1,000 clients fail at t=0 and retry 3 times.
// It counts the busiest 10 ms window the server sees.
func TestJitterSpreadsAStorm(t *testing.T) {
	p := Policy{Base: 100 * time.Millisecond, Cap: 2 * time.Second}
	peak := func(jitter bool) int {
		r := newRand()
		buckets := map[time.Duration]int{}
		for c := 0; c < 1000; c++ {
			at := time.Duration(0)
			for n := 0; n < 3; n++ {
				d := p.ceiling(n)
				if jitter {
					d = p.FullJitter(n, r)
				}
				at += d
				buckets[at/(10*time.Millisecond)]++
			}
		}
		m := 0
		for _, v := range buckets {
			m = max(m, v)
		}
		return m
	}
	noJitter, full := peak(false), peak(true)
	t.Logf("busiest 10 ms window: no jitter %d, full jitter %d", noJitter, full)
	if noJitter != 1000 || full > 200 {
		t.Fatalf("no jitter %d, full jitter %d", noJitter, full)
	}
}
```

```bash
go vet ./... && go test -race ./retry
go test -run 'Storm|Budget' -v ./retry
# prints: retries with budget: 109
# prints: busiest 10 ms window: no jitter 1000, full jitter 158
```

What `TestBudgetCapsRetryRatio` shows: with the dependency fully down for 1,000 requests and up to 3 attempts each, a client without a budget would send 3,000 calls. With a 10% budget and 10 starting tokens it sends 1,109 (1,000 first attempts plus 109 retries, measured by the test's log line `retries with budget: 109`).

The example policy from the old notes, corrected:

```yaml
max_attempts: 3          # including the first
base_delay: 100ms
max_delay: 2s
backoff: exponential     # ceiling = min(2s, 100ms * 2^n)
jitter: full             # sleep = random(0, ceiling); additive "+0-500ms" barely spreads multi-second waits
retry_on: [connect_error, reset, 408, 429, 500, 502, 503, 504, grpc UNAVAILABLE]
honour_retry_after: true # never retry sooner than the server asked
retry_budget: 10%        # per client
idempotent_only: true    # or the request carries an idempotency key
```

## 5. Variants and comparison 🟡

| Strategy | How it works | Use when | Cost |
| --- | --- | --- | --- |
| No retry, fail fast | Return the error at once | Inner layers of a deep call chain; non-idempotent calls without keys | Users see every transient blip |
| Fixed delay | Wait the same time each try | Rarely: background jobs against a slow but stable system | Synchronized waves after an outage |
| Exponential, no jitter | Ceiling doubles; everyone waits the same | Single client, nothing else retrying | Clients that failed together retry together |
| Exponential + full jitter | `random(0, ceiling)` | The default for clients of shared services | Some retries come back very early |
| Exponential + equal jitter | `ceiling/2 + random(0, ceiling/2)` | You need a minimum wait | More clustering than full jitter |
| Decorrelated jitter | `min(cap, random(base, prev × 3))` | Long-running retry loops | Slightly more state (previous sleep) |
| Hedged request | Send a second copy if the first is slower than about p95; take the first answer | Idempotent reads with long tails | Extra load (a few percent if the hedge is delayed to p95) |
| Queue-based retry | Message goes back to a queue with a delay (SQS visibility timeout, Kafka retry topics), then a DLQ | Async work that can wait minutes | Ordering is lost; needs idempotent consumers |

### Retries versus things people confuse them with 🟡

| Thing | What it does | How it differs from a retry |
| --- | --- | --- |
| Timeout | Stops waiting on one try | A retry decides whether to try again after a timeout or error |
| Circuit breaker | Stops all calls to a failing service for a while | A retry repeats one call; a breaker blocks many calls to protect the service |
| Rate limiting (429) | The server caps how fast you may call | A retry must wait for `Retry-After`, not fight the limit |
| Hedged request | Sends a second copy before the first fails | A retry waits for failure first; hedging races two copies for speed |

## 6. Trade-offs and when not to use 🟡

- **Retries add load exactly when the dependency is weakest.** A retry budget or a [[10 Distributed Systems & Resilience/Circuit Breaker|Circuit Breaker]] must cap them.
- **Retries add latency.** Each attempt plus backoff eats the user's deadline. For interactive calls, often 1 retry is right; for background jobs, many slow retries via a queue are fine.
- **Do not retry non-idempotent operations** without an idempotency key. A retried "transfer ₹500" without a key can move ₹1,000.
- **Do not retry in every layer.** Pick one layer; the others fail fast.
- **Do not retry overload signals blindly.** A 503 with `Retry-After` or a 429 means "come back later", not "come back now".
- **Timeouts that are too short** cause their own failures: if the timeout is below the dependency's normal p99, 1% of healthy calls fail and get retried, adding load for nothing.
- **Hedging doubles work** if done naively (hedge at once); delay the hedge until about p95 latency and cancel the loser.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how a deadline flows down the chain, which errors to retry, how full jitter spreads retries, and how budgets cap them. **Next comes the advanced part**: how gRPC, AWS SDKs and service meshes do this in real life, what goes wrong in production, and the deeper reasons behind full jitter, budgets and hedging.

- **Real systems:**
	- gRPC's service config supports `retryPolicy` (maxAttempts, initialBackoff, maxBackoff, backoffMultiplier, retryableStatusCodes), `hedgingPolicy`, and retry throttling with a token bucket. Servers can push back with the `grpc-retry-pushback-ms` trailer.
	- AWS SDKs in "standard" retry mode default to 3 attempts, use exponential backoff with jitter (maximum backoff 20 s), and stop retrying when a client-side retry quota runs out.
	- Envoy and Istio (a **service mesh**: proxies beside every service that handle retries, timeouts and routing for it) retry policies (`retry_on: 5xx,reset,connect-failure`, `num_retries`, per-try timeout) move retries into the mesh. Then the application must not also retry.
	- Message queues: SQS redelivers after the **visibility timeout** (how long a taken message stays hidden before it reappears) and moves a message to a DLQ after `maxReceiveCount`; Kafka consumers use delayed retry topics and a DLQ ([[Dead Letter Queues and Poison Messages]]).
- **Failure modes → fixes:**
	- Retry storm after an outage → full jitter plus a retry budget.
	- 27× amplification through layers → retry at one layer; inner services fail fast.
	- Duplicate charges or emails after a timeout → idempotency keys, deduplication on the server.
	- Requests still running after the user left → propagate the context deadline; check `ctx.Err()` before expensive work.
	- Retry loop ignores `Retry-After` and gets banned → parse and honour it.
	- Metastable overload (the retries alone keep the service down) → budget, breaker, and server-side load shedding ([[Load Shedding and Graceful Degradation]]).
- **What to monitor:**
	- Retry rate (retries ÷ requests) per dependency; alert when it approaches the budget.
	- Attempts per successful call (1.0 when healthy).
	- Timeout rate per dependency, separate from error rate.
	- Budget-exhausted count and time spent in backoff.
	- Latency of first attempts versus retried requests.

## 8. Deep dive 🔴

- **Choosing a timeout from data.** Start from the dependency's latency distribution under normal load: a per-attempt timeout a little above p99.9 rarely cuts off healthy calls. Then check it fits the budget: `attempts × timeout + total backoff ≤ caller's deadline − own work`. Re-measure after the dependency changes.
- **Deadline propagation versus fixed timeouts.** Fixed per-hop timeouts can add up to more than the user waits: a gateway giving up at 1 s while the service below still waits 5 s on a database wastes 4 s of work.
  - Passing the deadline down (gRPC does it automatically; with HTTP you send a header such as a remaining-time value and rebuild the context) lets every layer stop together.
  - `context.WithoutCancel` (Go 1.21+) is the escape hatch for work that must finish after the caller leaves, such as writing an audit record.
- **Why full jitter wins.** With no jitter, clients that failed together stay synchronized forever, because they follow the same schedule.
  - Additive jitter (`+random(0, 500 ms)`) barely helps once delays reach several seconds, since 500 ms is a small fraction of the wait.
  - Full jitter spreads each wave over the whole window `[0, ceiling]`, so the arrival rate drops by the window's width.
- **Retry budgets versus attempt limits.** "3 attempts" alone still allows 3× load during a total outage. A ratio budget (retries ≤ 10% of requests) bounds the extra load to 1.1×, whatever the outage looks like. gRPC throttling disables retries when the token count falls below half of `maxTokens`, and refills by `tokenRatio` per success.
- **Hedged and tied requests.** *The Tail at Scale* reports that, in a Google BigTable benchmark reading 1,000 keys spread over 100 servers, sending a hedge after 10 ms cut 99.9th-percentile latency from 1,800 ms to 74 ms while adding only 2% more requests.
  - Tied requests go further: both copies are queued and the server that starts first cancels the other.
- **Retries and circuit breakers together.** Order them so the breaker sees every attempt and the retry loop stops when the breaker is open: `retry(breaker(timeout(call)))`. Treat `ErrOpen` as permanent in the retry loop. See [[10 Distributed Systems & Resilience/Circuit Breaker|Circuit Breaker]].
- **Server-side cooperation.** The server can reject early with 503 + `Retry-After` when overloaded, return a distinct "do not retry" error for overload deep in the stack (the SRE book's pattern), and deduplicate by idempotency key. Client politeness and server protection are two halves of one design.

## 9. Interview questions 🔴

> [!question]- Why exponential backoff with jitter rather than a fixed delay?
> A fixed delay keeps clients that failed together in step, so they hit the recovering service in synchronized waves. Exponential backoff reduces the rate of retries over time, and jitter spreads each wave over a window. Full jitter, `random(0, min(cap, base·2^n))`, is the usual default.

> [!question]- Which errors do you retry, and which do you not?
> Retry transient ones: resets, connect failures, 408, 429 (after `Retry-After`), 500/502/503/504 and gRPC `UNAVAILABLE`, on idempotent operations or requests with idempotency keys. Do not retry validation errors, auth failures, 404, business conflicts, or anything after the caller's own deadline has passed.

> [!question]- Trap: "Our POST /payments retries 3 times on timeout. That makes it reliable." What's wrong?
> A timeout does not mean the payment failed; it may have gone through. Retrying without an idempotency key can charge the customer several times. Add a key that the server deduplicates, or query the payment status by key before retrying.

> [!question]- Three services in a chain each retry 3 times. What happens when the last one fails?
> The bottom service receives up to `3 × 3 × 3 = 27` attempts per user request, making the outage worse. Retry at one layer only, make the others fail fast, and add a per-client retry budget.

> [!question]- What is a retry budget, and why is "max 3 attempts" not enough?
> A budget caps retries as a fraction of requests per client, for example 10%. With only "max 3 attempts", a total outage triples the load. With a 10% budget, it adds at most 10%. gRPC's retry throttling and the AWS SDK retry quota both implement this idea.

> [!question]- How do deadlines differ from timeouts, and how do you propagate them in Go?
> A timeout bounds one wait; a deadline is an absolute time for the whole request. In Go, create it once with `context.WithTimeout` at the edge and pass the context to every call. gRPC sends the remaining time to the server, which receives a context with the same deadline. Before retrying, check that the remaining time can fit another attempt.

> [!question]- What are hedged requests and when are they safe?
> After waiting about the p95 latency, send a second copy of the request to another replica and use whichever answers first, cancelling the other. They cut tail latency for idempotent reads at the cost of a few percent extra load. Never hedge non-idempotent writes.

## 10. Cheat sheet 🟢

- Timeout on every remote call; Go's default HTTP client has none.
- One deadline per user request, created at the edge and passed down in `context`.
- Retry only transient errors on idempotent operations (or with idempotency keys); 408 and 429 are retryable.
- `sleep = random(0, min(cap, base·2^n))` (full jitter); honour `Retry-After`.
- Max about 3 attempts, a retry budget of about 10%, retries at one layer only.
- Never sleep past the deadline; stop when the breaker is open.
- Monitor retry ratio, attempts per success and timeout rate per dependency.

## Self-check 🟢🟡

🟢 Easy

> [!question]- Why must every remote call have a timeout?
> Without one, a server that never answers makes your code wait forever, and stuck calls pile up until your own service falls over.

> [!question]- Should you retry a 400 Bad Request?
> No. The request itself is wrong, so it will fail the same way every time.

> [!question]- What does jitter add to backoff?
> A random part to each wait, so clients that failed together do not all retry at the same moment.

🟡 Medium

> [!question]- With base 100 ms and cap 2 s, what is the ceiling for retry 0, 1 and 5?
> 100 ms, 200 ms, and 2 s (100 × 32 = 3,200 ms, capped at 2,000 ms).

> [!question]- Your deadline has 316 ms left; the next backoff could be 200 ms and a try takes up to 300 ms. Retry?
> No. 200 + 300 = 500 ms does not fit in 316 ms, so return the error now.

> [!question]- Why is "max 3 attempts" alone not enough during a full outage?
> It still triples the load on the dead service. A retry budget (about 10% of requests) keeps extra load near 1.1×.

## Links

- **Before this:** [[Distributed Systems Fundamentals]], [[Context Package]], [[Idempotency and Idempotency Keys]]
- **Next:** [[10 Distributed Systems & Resilience/Circuit Breaker|Circuit Breaker]], [[Bulkheads and Concurrency Limits]], [[Load Shedding and Graceful Degradation]]
- **Compare with:** [[Rate Limiting - Algorithms and Distributed Design]] (the server side of 429), [[Dead Letter Queues and Poison Messages]] (retries for queued work), [[Calling External APIs]] (Go client setup), [[gRPC]] (retry and hedging policies)

### Watch on YouTube

- [Timeouts / Retries / Backoff with Jitter / System Design / Distributed Systems](https://www.youtube.com/watch?v=HZdE1dNLX9s) · MsDeep Singh · 26 min · 1,339 views
- [What Happens When a Service Fails? / Timeouts, Retries & Circuit Breakers](https://www.youtube.com/watch?v=UR6uPCsObFk) · Jasmeen Kaur · 8 min · 1,192 views
