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
updated: 2026-11-13
---

# DOM, Events and Timers - Go

> [!summary] TL;DR
> This code mirrors the one-shot-vs-repeating distinction between JavaScript's `setTimeout`/`setInterval` using Go's `time.Timer`/`time.Ticker`, the comparison described in [[DOM, Events and Timers#Go comparison: time.Timer vs time.Ticker]].

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then "Before the code" and "What this code shows". Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add the "Code" walkthrough and the "Tests" section.
> - 🔴 **Interview / SDE-3 prep?** Add "Design decisions", "Pitfalls" and the "Exercises". Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[JavaScript Core - Types, Scope, Hoisting, Closures, this]]: a function can be handed to another function and run later. That is the idea a timer is built on.
> - [[How Browsers Load and Render a Page]]: the browser runs your code one job at a time, so a timer can only run when the browser is free.
> - [[DOM, Events and Timers]] (the theory twin): `setTimeout` runs once, `setInterval` repeats until stopped, and both delays are a minimum.

**From zero, in 60 seconds** 🟢

This file is the hands-on twin of the DOM, Events and Timers note. In plain words: JavaScript has two kinds of alarm clocks — `setTimeout` rings once, `setInterval` keeps ringing until you turn it off. Go has the same pair: `time.After` rings once, `time.NewTicker` keeps ringing until you call `Stop()`. The code here builds both, and the tests prove the two rules that matter: a timer's delay is a minimum (it can ring late, never early), and a ticker really repeats. Read "Before the code" for the Go bits, then walk the two small functions. All code stays runnable as-is.

## Before the code 🟢

- **Channels** (`<-chan time.Time`): a pipe between **goroutines** (Go's lightweight threads: functions that run at the same time as others). `<-ch` waits until a value arrives, so reading one is how the code "waits for the timer".
- **`time.After` / `time.NewTicker`**: the standard library's one-shot timer and repeating ticker, the Go cousins of `setTimeout` and `setInterval`.
- **`defer`**: schedules a call to run when the function returns, used here so the ticker is always stopped.
- **`go vet` and `-race`**: `go vet` checks for likely mistakes; `-race` turns on the **race detector**, which reports two goroutines touching the same data at once.
- **Slices with capacity** (`make([]time.Time, 0, n)`): a growable list with room for `n` items reserved up front.
- **What to run:** `go vet ./... && go test -race -v ./...` inside the module. No interfaces or generics are needed here.

## What this code shows 🟢

| Code piece | Theory concept it implements | Theory section |
| --- | --- | --- |
| `AfterOnce` | `setTimeout`: fires once, no sooner than a minimum delay | [[DOM, Events and Timers#Timers and the event loop\|Timers and the event loop]] |
| `RepeatingTicks` | `setInterval`: fires repeatedly until explicitly stopped | same section |
| `TestAfterOnceFiresAtLeastOnce` | "a timer's delay is a floor, not a guarantee" | same section |
| `TestRepeatingTicksFiresMultipleTimes` | "`setInterval` does not run once — it keeps firing" | same section |

## Setup 🟢

- Go 1.24, standard library only (`time`, `testing`) — no external dependencies.
- Module layout: a single package, `timers`, with `timers.go` and `timers_test.go` side by side.
- Run it: `go vet ./...` then `go test -race ./...` from the module root.

## Code 🟡

> 🟢 → 🟡 **You now know** the two alarm clocks: one rings once, one keeps ringing. **Next we open the box** and read the two tiny Go functions that build them, line by line.

### A one-shot timer: `AfterOnce`

**In plain words:** this is the alarm that rings once. You ask for "at least 10ms", and you get a channel that delivers one value when the time is up — maybe a bit late, never early.

**Concept.** The theory note's whole point about `setTimeout` is that its delay is a minimum, never a guarantee — the callback can run later than asked, but never earlier.

`AfterOnce` implements exactly the JavaScript one-shot shape (`setTimeout(fn, d)`) using Go's `time.After`, which returns a channel that receives exactly one value once at least `d` has elapsed.

An alternative design would use `time.NewTimer(d)` directly and expose the `*Timer` itself (so the caller could call `.Stop()` to cancel it, matching `clearTimeout`); `time.After` is chosen here because this note only needs to demonstrate the "fires once, delay is a floor" behavior, not cancellation.

**What this code does, in plain words:** `AfterOnce(10ms)` gives you a pipe. After at least 10ms, exactly one value (the current time) drops out of that pipe. Reading from the pipe is how you wait.

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
1. `AfterOnce` returns `<-chan time.Time` — a **receive-only** channel (you can take values out, never put them in) — the same shape `time.After` itself returns, so callers can only read from it, never accidentally send to it or close it.
2. `time.After(d)` starts a timer internally and returns a channel that will receive exactly one `time.Time` value once at least `d` has passed — there is no explicit "run this callback" step the way `setTimeout` takes a function; the caller instead **blocks** (stops and waits) on a channel receive (`<-ch`) until the value arrives.
3. Because `time.After` returns immediately (the waiting happens in the background, like `setTimeout` returning an id right away), calling `AfterOnce` never blocks the caller — only reading from its returned channel does.

### A repeating timer: `RepeatingTicks`

**In plain words:** this is the alarm that keeps ringing. It collects a fixed number of rings into a list so a test can check them, and `defer t.Stop()` is the "turn the alarm off" step you must never forget.

**Concept.** `setInterval` keeps firing until `clearInterval` is called; the Go equivalent is `time.NewTicker`, which keeps sending values on its channel every `d` until `.Stop()` is called.

`RepeatingTicks` collects a fixed number `n` of ticks and returns them, which lets the test assert on the exact count and ordering without needing to run forever like a real `setInterval` would.

The choice to take `n` as a parameter (rather than running until some external stop signal) keeps this function's contract fully deterministic for a test — a more realistic production version would instead take a `context.Context` (Go's standard "stop now" signal passed into functions) or a `done <-chan struct{}` so a caller could stop it early.

**What this code does, in plain words:** `RepeatingTicks(5ms, 3)` starts a clock that rings every 5ms, writes down the time of the first 3 rings, switches the clock off, and returns the 3 times.

```go
// RepeatingTicks starts a ticker that fires every d and collects n ticks,
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
2. `defer t.Stop()` is the Go equivalent of calling `clearInterval`: without it, the ticker's internal goroutine would keep running and leaking resources even after `RepeatingTicks` returns — `defer` guarantees it runs no matter how the function exits, including on a **panic** (Go's crash-style error that unwinds the function).
3. The `for i := 0; i < n; i++` loop blocks on `<-t.C` each iteration, so it naturally waits for each tick to actually arrive rather than polling — this is idiomatic Go: block on a channel receive instead of checking a flag in a **busy loop** (a loop that spins and checks over and over, wasting CPU).
4. `make([]time.Time, 0, n)` **pre-allocates** (reserves memory in advance for) capacity for exactly `n` elements, since the final length is known up front — a minor efficiency detail, not a correctness one.

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
> // RepeatingTicks starts a ticker that fires every d and collects n ticks,
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

## Design decisions 🔴

> 🟡 → 🔴 **You now know** how both functions work and what the tests check. **Next is the advanced part**: why the code is shaped this way, where it would be unsafe in production, and exercises to extend it.

| Choice made | Alternative | Trade-off |
| --- | --- | --- |
| `AfterOnce` returns a channel (`time.After`) | Return a `*time.Timer` and expose `.Stop()` | A raw channel is simpler and matches "fires once," but gives up cancellation — fine here since this note is about the one-shot/repeating distinction, not cancellation. |
| `RepeatingTicks` takes a fixed `n` and returns a slice | Take a `done <-chan struct{}` or `context.Context` and run until told to stop | The fixed-`n` version is fully **deterministic** (same result every run) for a test (no **goroutine leak** risk, meaning a goroutine left running forever, no need to synchronize a stop signal); a production poller would need the context-based version instead. |
| `defer t.Stop()` immediately after creating the ticker | Call `Stop()` manually at the end of the function | `defer` guarantees cleanup even if the function panics or returns early from a future code change — the standard Go idiom for "this resource must always be released." |

## Tests 🟡

### `TestAfterOnceFiresAtLeastOnce`

**What it proves and why it matters.** That `AfterOnce`'s delay is a floor, not an exact schedule — this is the single most important rule from the theory note's "timers and the event loop" section, and the test that would catch a regression to firing early.

| Input delay | Assertion |
| --- | --- |
| 10ms | elapsed time when the channel receives `>= 10ms` |

**What this code does, in plain words:** it notes the start time, waits on `AfterOnce(10ms)`, and fails if less than 10ms passed.

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

**What this code does, in plain words:** it asks for 3 rings 5ms apart, then fails if it did not get exactly 3 times or if any time is not later than the one before.

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

## Running it 🟢

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

Reading it line by line: `go vet` printed nothing, meaning it found no suspicious constructs. Both `RUN`/`PASS` pairs confirm each test executed and its assertions held.

The final `ok` line under the race detector confirms no data race was detected across the goroutines `time.After` and `time.NewTicker` start internally — meaningful here because a ticker's internal delivery goroutine is exactly the kind of concurrent code `-race` is meant to catch problems in.

## Pitfalls in the code 🔴

- `RepeatingTicks` blocks forever if `n` is larger than the number of ticks that will ever arrive in practice (it has no timeout) — fine for a bounded test, not safe to call with an unbounded `n` in production code without an escape hatch.
- Forgetting the `defer t.Stop()` line would leak the ticker's internal goroutine for the lifetime of the program, the direct Go analog of forgetting `clearInterval` in JavaScript — the browser eventually **garbage-collects** (frees the memory of) an abandoned interval only when the page itself unloads, and Go's ticker never stops on its own either.
- `AfterOnce` has no way to cancel the wait once started (no equivalent of `clearTimeout`) — a caller that no longer cares about the result still has to let the full delay elapse before the channel is read or garbage collected.

## Exercises 🔴

1. **Change this:** add a `Cancel func()` return value to `AfterOnce` by switching its implementation to `time.NewTimer(d)` and returning `t.Stop` alongside the channel. Predict what happens to callers that destructure only the channel from the old single-return signature.
2. **Change this:** modify `RepeatingTicks` to accept a `context.Context` and stop early if the context is cancelled before `n` ticks arrive. Predict what the function should return in that case — a shorter slice, an error, or both?
3. **Predict the result:** without running it, what does `TestRepeatingTicksFiresMultipleTimes` report if you change `RepeatingTicks(5*time.Millisecond, 3)` to `RepeatingTicks(5*time.Millisecond, 0)`? Then run it and check.

## Self-check 🟢🟡

> [!question]- Easy: which Go tool matches `setTimeout`, and which matches `setInterval`?
> `time.After` (or `time.NewTimer`) matches `setTimeout`; `time.NewTicker` matches `setInterval`.

> [!question]- Easy: what is the Go version of `clearInterval`?
> `ticker.Stop()`.

> [!question]- Easy: how does the code "wait" for a timer in Go?
> It reads from the channel with `<-ch`, which blocks until a value arrives.

> [!question]- Medium: why is `defer t.Stop()` written right after `time.NewTicker`?
> So the ticker is always stopped when the function exits, even on an early return or panic; otherwise it leaks.

> [!question]- Medium: why does the test check `>= 10ms` and not `== 10ms`?
> A timer's delay is a minimum. It may fire late on a busy machine, but never early.

> [!question]- Medium: what goes wrong if you call `RepeatingTicks` with a huge `n` in production?
> It blocks for `n` ticks with no way to stop early. A real poller should take a `context.Context`.

## Links 🟢
- **Theory:** [[DOM, Events and Timers]]
- **Related:** [[JavaScript Objects, Arrays and Iteration]], [[How Browsers Load and Render a Page]]
