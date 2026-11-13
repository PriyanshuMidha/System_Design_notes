---
tags: [networking, http, protocols]
level: intermediate
type: implementation
status: draft
prereqs: ["[[TCP - Handshake, Reliability, Flow and Congestion Control]]", "[[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]", "[[UDP and QUIC]]"]
related: ["[[HTTP-1.1 vs HTTP-2 vs HTTP-3]]", "[[TLS and HTTPS]]", "[[HTTP Caching - Cache-Control, ETag, Conditional Requests]]", "[[Network Debugging Toolkit - dig, curl, ss, tcpdump]]"]
sources:
  - "RFC 9112, HTTP/1.1"
  - "RFC 9113, HTTP/2"
  - "RFC 9114, HTTP/3"
  - "RFC 7541, HPACK"
  - "RFC 9204, QPACK"
  - "RFC 9000, QUIC"
updated: 2026-11-13
---

# HTTP-1.1 vs HTTP-2 vs HTTP-3 - Go

> [!summary] TL;DR
> This code proves, on one machine, the single claim the theory note makes about multiplexing: six requests through **one** HTTP/1.1 connection run serially, while six requests through **one** HTTP/2 connection run almost fully in parallel. See [[HTTP-1.1 vs HTTP-2 vs HTTP-3]] for why that gap exists.

## Before the code

- **Goroutines** (`go func() {...}()`): lightweight concurrent functions; here, one per request so all 6 fire at once.
- **`sync.WaitGroup`**: a counter that lets the test wait until every goroutine has finished.
- **`net/http` client and `http.Transport`**: the client sends requests; the transport owns the connection pool, and `MaxConnsPerHost` caps it.
- **`net/http/httptest`**: spins up a real local server inside a test; `EnableHTTP2` + `StartTLS` makes it speak HTTP/2.
- **`testing` helpers** (`t.Helper`, `t.Logf`, `t.Fatalf`): mark helpers, log measurements, fail the test.
- **What to run:** `go vet ./...` then `go test -race -v ./...` inside the module.

## What this code shows

| Code piece | Theory concept it demonstrates | Theory section |
| --- | --- | --- |
| `measureConcurrency` helper | Firing N concurrent client requests and timing the whole batch | [[HTTP-1.1 vs HTTP-2 vs HTTP-3#1. Why it exists]] |
| `http.Transport{MaxConnsPerHost: 1}` client | Forcing HTTP/1.1 onto exactly one connection, so its request queue has nowhere to hide | [[HTTP-1.1 vs HTTP-2 vs HTTP-3#2. Mental model]] |
| `httptest.Server{EnableHTTP2: true}` | HTTP/2 multiplexing many streams over that same single-connection constraint | [[HTTP-1.1 vs HTTP-2 vs HTTP-3#3. How it works]] |
| The two timing assertions | The measured gap between serial and parallel that section 1's table reports | [[HTTP-1.1 vs HTTP-2 vs HTTP-3#Whiteboard version]] |

## Setup

- **Go version:** 1.24.
- **Module:** a single package, `http2demo`, no external dependencies — everything needed (`net/http`, `net/http/httptest`) is in the standard library.
- **Layout:**

```text
http2demo/
  http2_test.go   # helper + the one test
```

- **Run it:**

```bash
go vet ./...
go test -race -v ./...
```

## Code

### Step 0: package and imports

**Concept.** The whole demo lives in one file, one package, with no external dependencies — everything it needs (`net/http`, `net/http/httptest`, `sync`) ships in the Go standard library, which is itself a small piece of evidence for the theory note's claim that HTTP/2 support needed no new application-level API.

```go
package http2demo

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"
)
```

### Step 1: a helper that fires N concurrent requests and times the batch

**Concept.** The theory note's claim is about wall-clock time for a *batch* of requests, not any single request.

This helper implements "fire N GETs at this client/URL at the same time, wait for all of them, return the elapsed time". Both the HTTP/1.1 and HTTP/2 cases reuse the exact same measurement logic — the only thing that should differ between the two calls is the `*http.Client` passed in.

Reusing one helper for both protocols, instead of writing the loop twice, is what makes this a fair, apples-to-apples comparison rather than two different benchmarks that happen to look similar.

```go
// measureConcurrency fires n concurrent GETs through client at server and
// returns the wall-clock time for all of them to finish. Each request makes
// the handler sleep for delay before replying, so serialized requests take
// n*delay and multiplexed/parallel requests take about delay.
func measureConcurrency(t *testing.T, client *http.Client, url string, n int, delay time.Duration) time.Duration {
	t.Helper()
	var wg sync.WaitGroup
	start := time.Now()
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			resp, err := client.Get(url)
			if err != nil {
				t.Errorf("get: %v", err)
				return
			}
			resp.Body.Close()
		}()
	}
	wg.Wait()
	return time.Since(start)
}
```

**How it works:**

1. `t.Helper()` marks this as a test helper, so if `t.Errorf` fires inside the goroutine, the failure's reported line points at the caller, not here.
2. A `sync.WaitGroup` is the standard Go pattern for "wait until N concurrent goroutines are all done" — `Add(1)` before each goroutine starts, `Done()` (deferred, so it still runs on an error) when it finishes, `Wait()` blocks until the count reaches zero.
3. Each goroutine does exactly one `client.Get(url)` and closes the body. Closing the response body matters here specifically: an unclosed body can prevent the underlying connection from being returned to the pool, which would quietly distort the very timing this helper measures.
4. `time.Since(start)` captures wall-clock time across the *whole* batch, from the moment the first goroutine could start to the moment the last one finishes — exactly the number the theory note's table reports.

### Step 2: set up one handler, two servers, two clients

**Concept.** This implements [[HTTP-1.1 vs HTTP-2 vs HTTP-3#2. Mental model]]'s "one room, one entrance" picture directly.

The *same* handler (sleep 50ms, reply) is served two ways: once through an HTTP/1.1 client capped to one connection (`MaxConnsPerHost: 1`), once through an HTTP/2 server negotiated over TLS.

The handler is deliberately identical in both cases, so the only variable is the protocol and connection count; any timing difference can only come from multiplexing, not from the handler doing different work.

```go
func TestH1SingleConnVsH2Multiplexing(t *testing.T) {
	const n = 6
	const delay = 50 * time.Millisecond

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(delay)
		fmt.Fprintf(w, "proto=%s", r.Proto)
	})

	// HTTP/2 server (ALPN negotiates h2 over TLS). httptest enables it when
	// EnableHTTP2 is set (Go 1.21+).
	h2srv := httptest.NewUnstartedServer(handler)
	h2srv.EnableHTTP2 = true
	h2srv.StartTLS()
	defer h2srv.Close()
	h2Client := h2srv.Client()

	// HTTP/1.1 server, client capped to one TCP connection per host: this is
	// what one HTTP/1.1 connection looks like once its request queue is full,
	// the "head-of-line blocking" this note describes.
	h1srv := httptest.NewServer(handler)
	defer h1srv.Close()
	h1Client := &http.Client{Transport: &http.Transport{MaxConnsPerHost: 1}}
```

**How it works:**

1. `httptest.NewUnstartedServer` + `EnableHTTP2 = true` + `StartTLS()` is the specific sequence `net/http/httptest` needs to negotiate real HTTP/2 over ALPN without a hand-rolled certificate — `httptest` generates one for you. `h2srv.Client()` returns a client already configured to trust that certificate and prefer `h2`.
2. `httptest.NewServer(handler)` (not `StartTLS`) gives a plain HTTP/1.1 server — no TLS, no ALPN negotiation, so there is no way for it to upgrade to HTTP/2.
3. `&http.Transport{MaxConnsPerHost: 1}` is the one line doing the real work on the HTTP/1.1 side: it forces every one of the 6 concurrent `Get` calls onto the *same* single TCP connection instead of Go's default behavior of opening more connections for concurrency.
   Without this cap, Go's default `http.Transport` would open several HTTP/1.1 connections itself and partially hide the effect this test exists to show.

### Step 3: measure both batches and assert the gap

**Concept.** This is the function body's second half, continuing directly inside `TestH1SingleConnVsH2Multiplexing` from Step 2. It calls `measureConcurrency` (Step 1) once per protocol, then turns the theory note's prose claim — "HTTP/2 multiplexes, HTTP/1.1 serializes" — into two numeric assertions so the test fails loudly if that claim ever stops holding on a future Go version.

```go
	h2Elapsed := measureConcurrency(t, h2Client, h2srv.URL, n, delay)
	h1Elapsed := measureConcurrency(t, h1Client, h1srv.URL, n, delay)

	t.Logf("measured on this machine: %d requests x %v handler delay", n, delay)
	t.Logf("HTTP/1.1, 1 connection: %v (ideal serial = %v)", h1Elapsed, time.Duration(n)*delay)
	t.Logf("HTTP/2, 1 connection, multiplexed: %v (ideal parallel = %v)", h2Elapsed, delay)

	// HTTP/2 must finish far closer to the parallel ideal than to the serial one.
	if h2Elapsed >= time.Duration(n)*delay/2 {
		t.Fatalf("HTTP/2 took %v, expected well under %v (multiplexing should parallelize streams on one connection)", h2Elapsed, time.Duration(n)*delay/2)
	}
	if h1Elapsed < time.Duration(n)*delay*7/10 {
		t.Fatalf("HTTP/1.1 single-connection took %v, expected close to the serial ideal %v", h1Elapsed, time.Duration(n)*delay)
	}
}
```

**How it works:**

1. Both `measureConcurrency` calls reuse the exact same helper from Step 1 — the only thing that changes between them is which client (and therefore which protocol and connection limit) is passed in.
2. The two `t.Fatalf` checks encode the theory note's claim as a test, not just a log line: HTTP/2 must land under half the serial ideal (closer to parallel), and HTTP/1.1 must land close to the full serial ideal (confirming the cap actually worked and nothing accidentally parallelized it).
3. `context` is not needed here — `client.Get` ships its own request lifecycle — but a production version calling an unbounded number of hosts would use `http.NewRequestWithContext` with a deadline instead of a bare `Get`, so a hung server can't block the batch forever.

## Tests

| Test | Property it proves | Why it matters |
| --- | --- | --- |
| `TestH1SingleConnVsH2Multiplexing` | A single HTTP/2 connection runs 6 concurrent requests in roughly one handler-delay's worth of wall time; a single-connection HTTP/1.1 client runs them in roughly six delays' worth | This is the entire reason HTTP/2 exists — without this gap, multiplexing would be a red herring |

| Input | Expected output |
| --- | --- |
| 6 requests, 50ms handler delay, HTTP/1.1, `MaxConnsPerHost: 1` | Elapsed ≥ 70% of `6 × 50ms` = 210ms (close to the 300ms serial ideal) |
| 6 requests, 50ms handler delay, HTTP/2, one TLS connection | Elapsed < 50% of `6 × 50ms` = 150ms (close to the 50ms parallel ideal) |

**Measured (Go 1.24.4, darwin/arm64, this machine):**

```text
=== RUN   TestH1SingleConnVsH2Multiplexing
    http2_test.go:64: measured on this machine: 6 requests x 50ms handler delay
    http2_test.go:65: HTTP/1.1, 1 connection: 312.98ms (ideal serial = 300ms)
    http2_test.go:66: HTTP/2, 1 connection, multiplexed: 67.81ms (ideal parallel = 50ms)
--- PASS: TestH1SingleConnVsH2Multiplexing (0.38s)
PASS
```

`go vet ./...` is clean; `go test -race ./...` passes with no data races reported.

If this test failed, the most likely cause is not a code bug but an environment one: a proxy or VPN forcing all traffic through an intermediary that itself serializes connections, or a Go version before 1.21 where `httptest.Server.EnableHTTP2` does not exist — both would make the HTTP/2 timing collapse toward the HTTP/1.1 number.

## Design decisions

| Decision | Alternative | Trade-off |
| --- | --- | --- |
| Use `httptest` servers instead of a real TLS cert and public host | Point the test at a real HTTPS endpoint | `httptest` is hermetic and fast (no network, no flaky external dependency) but only proves the claim against Go's own client/server; it says nothing about other languages' HTTP/2 stacks |
| Cap HTTP/1.1 to one connection via `MaxConnsPerHost: 1` | Let the default transport open several connections and compare *that* to HTTP/2 | The capped version isolates the one-connection comparison the theory note makes; the uncapped version would show a smaller, more confusing gap because Go's default HTTP/1.1 behavior already works around the same limitation by opening more sockets |
| Assert a threshold (`< n*delay/2`, `≥ n*delay*7/10`) rather than an exact number | Assert against the literal measured milliseconds | Wall-clock timings vary run to run and machine to machine; a threshold proves the *qualitative* claim (multiplexed is much faster) robustly, without the test becoming flaky on a slower CI box |
| Standard library only, no QUIC/HTTP-3 test | Add `golang.org/x/net/http3` or `quic-go` and test HTTP/3 too | Keeps this scratch module dependency-free and fast to verify; HTTP/3 behavior is covered conceptually in the theory note's deep dive instead, since Go's standard library doesn't speak QUIC as of 1.24 |

## Running it

```bash
$ go vet ./...
$ go test -race -v ./...
=== RUN   TestH1SingleConnVsH2Multiplexing
    http2_test.go:64: measured on this machine: 6 requests x 50ms handler delay
    http2_test.go:65: HTTP/1.1, 1 connection: 312.98ms (ideal serial = 300ms)
    http2_test.go:66: HTTP/2, 1 connection, multiplexed: 67.81ms (ideal parallel = 50ms)
--- PASS: TestH1SingleConnVsH2Multiplexing (0.38s)
PASS
ok  	roll10/http2demo	1.85s
```

Reading it line by line:

- `go vet` printed nothing, meaning no suspicious constructs (unused results, wrong `Printf` verbs).
- The two `t.Logf` lines are the actual measurement. 312.98ms for HTTP/1.1 is within a few percent of the 300ms serial ideal (6 × 50ms), confirming the single connection really did serialize all 6 requests.
- 67.81ms for HTTP/2 is close to the 50ms parallel ideal, with the extra ~18ms accounting for TLS/ALPN negotiation and goroutine scheduling overhead rather than any serialization.
- `PASS` and the final `ok` line confirm both threshold assertions held and `-race` found no data race in the concurrent `Get` calls or the shared `*testing.T`.

## Pitfalls in the code

- Forgetting `resp.Body.Close()` in a loop like this leaks connections from the client's pool; over many iterations it can exhaust `MaxConnsPerHost` and make a test hang waiting for a connection that will never free up.
- Calling `t.Fatalf` (not `t.Errorf`) from inside a spawned goroutine is a classic Go testing bug: `t.FailNow` (which `Fatalf` calls) must run on the test's own goroutine. This code avoids that trap by using `t.Errorf` inside the goroutines and reserving `t.Fatalf` for the main test goroutine after `wg.Wait()` returns.
- Without `MaxConnsPerHost: 1`, Go's default `http.Transport` silently opens multiple HTTP/1.1 connections under concurrent load, which would shrink the measured gap and make the test's assertions flaky rather than wrong.

## Exercises

1. **Change this:** set `n = 2` instead of `6`. Predict the result: does the HTTP/2 vs HTTP/1.1 gap get smaller, larger, or stay about the same in absolute milliseconds? (Hint: think about what the serial ideal, `n*delay`, does as `n` shrinks.)
2. **Change this:** remove `MaxConnsPerHost: 1` from the HTTP/1.1 client entirely. Predict the result: will the test still pass, and why might the measured HTTP/1.1 time now look surprisingly close to the HTTP/2 time?
3. **Change this:** raise `delay` to `200 * time.Millisecond` and lower it to `5 * time.Millisecond`. Predict which of the two threshold assertions (the `h2Elapsed` check or the `h1Elapsed` check) is more likely to flake at the very short delay, and why TLS/scheduling overhead matters more when `delay` is small.

> [!example]- Full file
> ```go
> package http2demo
>
> import (
> 	"fmt"
> 	"net/http"
> 	"net/http/httptest"
> 	"sync"
> 	"testing"
> 	"time"
> )
>
> // measureConcurrency fires n concurrent GETs through client at server and
> // returns the wall-clock time for all of them to finish. Each request makes
> // the handler sleep for delay before replying, so serialized requests take
> // n*delay and multiplexed/parallel requests take about delay.
> func measureConcurrency(t *testing.T, client *http.Client, url string, n int, delay time.Duration) time.Duration {
> 	t.Helper()
> 	var wg sync.WaitGroup
> 	start := time.Now()
> 	for i := 0; i < n; i++ {
> 		wg.Add(1)
> 		go func() {
> 			defer wg.Done()
> 			resp, err := client.Get(url)
> 			if err != nil {
> 				t.Errorf("get: %v", err)
> 				return
> 			}
> 			resp.Body.Close()
> 		}()
> 	}
> 	wg.Wait()
> 	return time.Since(start)
> }
>
> func TestH1SingleConnVsH2Multiplexing(t *testing.T) {
> 	const n = 6
> 	const delay = 50 * time.Millisecond
>
> 	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
> 		time.Sleep(delay)
> 		fmt.Fprintf(w, "proto=%s", r.Proto)
> 	})
>
> 	// HTTP/2 server (ALPN negotiates h2 over TLS). httptest enables it when
> 	// EnableHTTP2 is set (Go 1.21+).
> 	h2srv := httptest.NewUnstartedServer(handler)
> 	h2srv.EnableHTTP2 = true
> 	h2srv.StartTLS()
> 	defer h2srv.Close()
> 	h2Client := h2srv.Client()
>
> 	h2Elapsed := measureConcurrency(t, h2Client, h2srv.URL, n, delay)
>
> 	// HTTP/1.1 server, client capped to one TCP connection per host: this is
> 	// what one HTTP/1.1 connection looks like once its request queue is full,
> 	// the "head-of-line blocking" this note describes.
> 	h1srv := httptest.NewServer(handler)
> 	defer h1srv.Close()
> 	h1Client := &http.Client{Transport: &http.Transport{MaxConnsPerHost: 1}}
>
> 	h1Elapsed := measureConcurrency(t, h1Client, h1srv.URL, n, delay)
>
> 	t.Logf("measured on this machine: %d requests x %v handler delay", n, delay)
> 	t.Logf("HTTP/1.1, 1 connection: %v (ideal serial = %v)", h1Elapsed, time.Duration(n)*delay)
> 	t.Logf("HTTP/2, 1 connection, multiplexed: %v (ideal parallel = %v)", h2Elapsed, delay)
>
> 	// HTTP/2 must finish far closer to the parallel ideal than to the serial one.
> 	if h2Elapsed >= time.Duration(n)*delay/2 {
> 		t.Fatalf("HTTP/2 took %v, expected well under %v (multiplexing should parallelize streams on one connection)", h2Elapsed, time.Duration(n)*delay/2)
> 	}
> 	if h1Elapsed < time.Duration(n)*delay*7/10 {
> 		t.Fatalf("HTTP/1.1 single-connection took %v, expected close to the serial ideal %v", h1Elapsed, time.Duration(n)*delay)
> 	}
> }
> ```

## Links

- **Theory:** [[HTTP-1.1 vs HTTP-2 vs HTTP-3]]
- **Related:** [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies - Go]], [[HTTP Caching - Cache-Control, ETag, Conditional Requests - Go]]
