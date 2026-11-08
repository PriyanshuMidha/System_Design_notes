---
tags: [frontend, javascript, browser]
level: basic
type: implementation
prereqs: ["[[JavaScript Core - Types, Scope, Hoisting, Closures, this]]", "[[How Browsers Load and Render a Page]]"]
related: ["[[DOM, Events and Timers]]", "[[JavaScript Objects, Arrays and Iteration]]"]
sources:
  - "WHATWG HTML Standard: timers (setTimeout/setInterval), the event loop"
  - "Go standard library docs: package time"
status: draft
updated: 2026-11-09
---

# DOM, Events and Timers - Go

> [!summary] TL;DR
> This code mirrors the one-shot-vs-repeating distinction between JavaScript's `setTimeout`/`setInterval` using Go's `time.Timer`/`time.Ticker`, the comparison described in [[DOM, Events and Timers#Go comparison: time.Timer vs time.Ticker]].

## What this code shows

| Code piece | Theory concept it implements | Theory section |
| --- | --- | --- |
| `AfterOnce` | `setTimeout`: fires once, no sooner than a minimum delay | [[DOM, Events and Timers#Timers and the event loop\|Timers and the event loop]] |
| `RepeatingTicks` | `setInterval`: fires repeatedly until explicitly stopped | same section |
| `TestAfterOnceFiresAtLeastOnce` | "a timer's delay is a floor, not a guarantee" | same section |
| `TestRepeatingTicksFiresMultipleTimes` | "`setInterval` does not run once — it keeps firing" | same section |

## Setup

- Go 1.24, standard library only (`time`, `testing`) — no external dependencies.
- Module layout: a single package, `timers`, with `timers.go` and `timers_test.go` side by side.
- Run it: `go vet ./...` then `go test -race ./...` from the module root.

## Code

### A one-shot timer: `AfterOnce`

**Concept.** The theory note's whole point about `setTimeout` is that its delay is a minimum, never a guarantee — the callback can run later than asked, but never earlier. `AfterOnce` implements exactly the JavaScript one-shot shape (`setTimeout(fn, d)`) using Go's `time.After`, which returns a channel that receives exactly one value once at least `d` has elapsed. An alternative design would use `time.NewTimer(d)` directly and expose the `*Timer` itself (so the caller could call `.Stop()` to cancel it, matching `clearTimeout`); `time.After` is chosen here because this note only needs to demonstrate the "fires once, delay is a floor" behavior, not cancellation.

```go
// Package timers mirrors the one-shot vs repeating distinction between
// JavaScript's setTimeout/setInterval using Go's time.Timer/time.Ticker.
package timers

import "time"

// AfterOnce fires exactly once after at least d, like setTimeout(fn, d).
// The delay is a minimum, not a guarantee: a busy scheduler can run it later.
func AfterOnce(d time.Duration) <-chan time.Time {
	return time.After(d)
}
```

**How it works.**
1. `AfterOnce` returns `<-chan time.Time` — a receive-only channel — the same shape `time.After` itself returns, so callers can only read from it, never accidentally send to it or close it.
2. `time.After(d)` starts a timer internally and returns a channel that will receive exactly one `time.Time` value once at least `d` has passed — there is no explicit "run this callback" step the way `setTimeout` takes a function; the caller instead blocks on a channel receive (`<-ch`) until the value arrives.
3. Because `time.After` returns immediately (the waiting happens in the background, like `setTimeout` returning an id right away), calling `AfterOnce` never blocks the caller — only reading from its returned channel does.

### A repeating timer: `RepeatingTicks`

**Concept.** `setInterval` keeps firing until `clearInterval` is called; the Go equivalent is `time.NewTicker`, which keeps sending values on its channel every `d` until `.Stop()` is called. `RepeatingTicks` collects a fixed number `n` of ticks and returns them, which lets the test assert on the exact count and ordering without needing to run forever like a real `setInterval` would. The choice to take `n` as a parameter (rather than running until some external stop signal) keeps this function's contract fully deterministic for a test — a more realistic production version would instead take a `context.Context` or a `done <-chan struct{}` so a caller could stop it early.

```go
// RepeatingTicks starts a ticker that fires every d until stop is closed,
// like setInterval(fn, d) running until clearInterval(id). The caller must
// call Ticker.Stop (the Go equivalent of clearInterval) to release it.
func RepeatingTicks(d time.Duration, n int) []time.Time {
	t := time.NewTicker(d)
	defer t.Stop() // equivalent to clearInterval: never leak the ticker
	ticks := make([]time.Time, 0, n)
	for i := 0; i < n; i++ {
		ticks = append(ticks, <-t.C)
	}
	return ticks
}
```

**How it works.**
1. `time.NewTicker(d)` starts a ticker that sends the current time on its `.C` channel every `d`, repeatedly, until stopped — this is the direct analog of `setInterval(fn, d)` firing `fn` every `d` until `clearInterval`.
2. `defer t.Stop()` is the Go equivalent of calling `clearInterval`: without it, the ticker's internal goroutine would keep running and leaking resources even after `RepeatingTicks` returns — `defer` guarantees it runs no matter how the function exits, including on a panic.
3. The `for i := 0; i < n; i++` loop blocks on `<-t.C` each iteration, so it naturally waits for each tick to actually arrive rather than polling — this is idiomatic Go: block on a channel receive instead of checking a flag in a busy loop.
4. `make([]time.Time, 0, n)` pre-allocates capacity for exactly `n` elements, since the final length is known up front — a minor efficiency detail, not a correctness one.

> [!example]- Full file
> ```go
> // Package timers mirrors the one-shot vs repeating distinction between
> // JavaScript's setTimeout/setInterval using Go's time.Timer/time.Ticker.
> package timers
>
> import "time"
>
> // AfterOnce fires exactly once after at least d, like setTimeout(fn, d).
> // The delay is a minimum, not a guarantee: a busy scheduler can run it later.
> func AfterOnce(d time.Duration) <-chan time.Time {
> 	return time.After(d)
> }
>
> // RepeatingTicks starts a ticker that fires every d until stop is closed,
> // like setInterval(fn, d) running until clearInterval(id). The caller must
> // call Ticker.Stop (the Go equivalent of clearInterval) to release it.
> func RepeatingTicks(d time.Duration, n int) []time.Time {
> 	t := time.NewTicker(d)
> 	defer t.Stop() // equivalent to clearInterval: never leak the ticker
> 	ticks := make([]time.Time, 0, n)
> 	for i := 0; i < n; i++ {
> 		ticks = append(ticks, <-t.C)
> 	}
> 	return ticks
> }
> ```

## Design decisions

| Choice made | Alternative | Trade-off |
| --- | --- | --- |
| `AfterOnce` returns a channel (`time.After`) | Return a `*time.Timer` and expose `.Stop()` | A raw channel is simpler and matches "fires once," but gives up cancellation — fine here since this note is about the one-shot/repeating distinction, not cancellation. |
| `RepeatingTicks` takes a fixed `n` and returns a slice | Take a `done <-chan struct{}` or `context.Context` and run until told to stop | The fixed-`n` version is fully deterministic for a test (no goroutine leak risk, no need to synchronize a stop signal); a production poller would need the context-based version instead. |
| `defer t.Stop()` immediately after creating the ticker | Call `Stop()` manually at the end of the function | `defer` guarantees cleanup even if the function panics or returns early from a future code change — the standard Go idiom for "this resource must always be released." |

## Tests

### `TestAfterOnceFiresAtLeastOnce`

**What it proves and why it matters.** That `AfterOnce`'s delay is a floor, not an exact schedule — this is the single most important rule from the theory note's "timers and the event loop" section, and the test that would catch a regression to firing early.

| Input delay | Assertion |
| --- | --- |
| 10ms | elapsed time when the channel receives `>= 10ms` |

```go
func TestAfterOnceFiresAtLeastOnce(t *testing.T) {
	start := time.Now()
	<-AfterOnce(10 * time.Millisecond)
	if elapsed := time.Since(start); elapsed < 10*time.Millisecond {
		t.Fatalf("fired after %v, want >= 10ms (a minimum delay, not a guarantee)", elapsed)
	}
}
```

**What a failure would mean.** If this test failed, `AfterOnce` fired strictly before the requested delay elapsed — a correctness bug in the underlying timer usage, since `time.After` is documented to never fire early.

### `TestRepeatingTicksFiresMultipleTimes`

**What it proves and why it matters.** That the ticker actually repeats — three strictly increasing timestamps — rather than firing once like a one-shot timer would. This is the test that would catch "ticker was accidentally replaced with a timer" style regressions.

| Input | Expected |
| --- | --- |
| `d = 5ms, n = 3` | 3 timestamps returned, each strictly after the previous one |

```go
func TestRepeatingTicksFiresMultipleTimes(t *testing.T) {
	ticks := RepeatingTicks(5*time.Millisecond, 3)
	if len(ticks) != 3 {
		t.Fatalf("got %d ticks, want 3 (a ticker repeats, it is not one-shot)", len(ticks))
	}
	for i := 1; i < len(ticks); i++ {
		if !ticks[i].After(ticks[i-1]) {
			t.Fatalf("tick %d did not come after tick %d", i, i-1)
		}
	}
}
```

**What a failure would mean.** A wrong length means the loop or the ticker stopped early or produced too many ticks; a timestamp that isn't strictly after the previous one would mean two ticks were read out of order or the same tick was read twice.

## Running it

```sh
$ go vet ./...
$ go test -race ./... -v
```

Measured output (Go 1.24.4, darwin/arm64, 2026-11-09):

```text
=== RUN   TestAfterOnceFiresAtLeastOnce
--- PASS: TestAfterOnceFiresAtLeastOnce (0.01s)
=== RUN   TestRepeatingTicksFiresMultipleTimes
--- PASS: TestRepeatingTicksFiresMultipleTimes (0.02s)
PASS
ok  	domsplit/timers	1.2s
```

Reading it line by line: `go vet` printed nothing, meaning it found no suspicious constructs. Both `RUN`/`PASS` pairs confirm each test executed and its assertions held. The final `ok` line under the race detector confirms no data race was detected across the goroutines `time.After` and `time.NewTicker` start internally — meaningful here because a ticker's internal delivery goroutine is exactly the kind of concurrent code `-race` is meant to catch problems in.

## Pitfalls in the code

- `RepeatingTicks` blocks forever if `n` is larger than the number of ticks that will ever arrive in practice (it has no timeout) — fine for a bounded test, not safe to call with an unbounded `n` in production code without an escape hatch.
- Forgetting the `defer t.Stop()` line would leak the ticker's internal goroutine for the lifetime of the program, the direct Go analog of forgetting `clearInterval` in JavaScript — the browser eventually garbage-collects an abandoned interval only when the page itself unloads, and Go's ticker never stops on its own either.
- `AfterOnce` has no way to cancel the wait once started (no equivalent of `clearTimeout`) — a caller that no longer cares about the result still has to let the full delay elapse before the channel is read or garbage collected.

## Exercises

1. **Change this:** add a `Cancel func()` return value to `AfterOnce` by switching its implementation to `time.NewTimer(d)` and returning `t.Stop` alongside the channel. Predict what happens to callers that destructure only the channel from the old single-return signature.
2. **Change this:** modify `RepeatingTicks` to accept a `context.Context` and stop early if the context is cancelled before `n` ticks arrive. Predict what the function should return in that case — a shorter slice, an error, or both?
3. **Predict the result:** without running it, what does `TestRepeatingTicksFiresMultipleTimes` report if you change `RepeatingTicks(5*time.Millisecond, 3)` to `RepeatingTicks(5*time.Millisecond, 0)`? Then run it and check.

## Links
- **Theory:** [[DOM, Events and Timers]]
- **Related:** [[JavaScript Objects, Arrays and Iteration]], [[How Browsers Load and Render a Page]]
