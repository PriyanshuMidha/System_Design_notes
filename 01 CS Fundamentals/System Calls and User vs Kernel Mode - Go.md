---
tags: [cs-fundamentals, os, syscalls]
level: intermediate
status: draft
type: implementation
prereqs: ["[[Processes, Threads and Context Switching]]"]
related: ["[[System Calls and User vs Kernel Mode]]", "[[Virtual Memory, Paging and the TLB]]", "[[I-O Models - Blocking, epoll, io_uring and the Go Netpoller]]", "[[Runtime - Goroutine Scheduler (GMP)]]", "[[Latency Numbers Every Engineer Should Know]]"]
sources:
  - "Linux man-pages, syscalls(2), vdso(7)"
  - "Love, Linux Kernel Development, 3rd ed., ch. 5 (system calls)"
  - "Go runtime source, runtime/sys_linux_amd64.s and runtime/proc.go (entersyscall/exitsyscall), Go 1.24"
  - "strace(1) man page"
updated: 2026-11-13
---

# System Calls and User vs Kernel Mode - Go

> [!summary] TL;DR
> This code measures the real cost of a genuine, always-trapping system call (`write` to `/dev/null`), contrasts it with a syscall-shaped library call that may be cached (`os.Getpid`), and with a pure userspace function call that touches the kernel at all. It gives the three numbers [[System Calls and User vs Kernel Mode]] reasons about.

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read the theory note first ([[System Calls and User vs Kernel Mode]]). Here, read "From zero" below, "Before the code" and "What this code shows", then skim the code steps.
> - 🟡 **Know the basics?** Read the Code, Design decisions and Tests sections, then run it yourself.
> - 🔴 **Interview / SDE-3 prep?** Add the Pitfalls and Exercises sections. Headings are tagged 🟢🟡🔴.

**From zero** 🟢: this file is the hands-on side of [[System Calls and User vs Kernel Mode]]. It measures three costs side by side: a real system call (write to /dev/null), a syscall-shaped call that may be cached (os.Getpid), and a plain function call — so 'syscalls are expensive' becomes numbers you measured yourself.

## Before the code 🟢

- **`syscall` package** (`syscall.Write`): calls the raw OS system call directly, skipping `os.File`'s extra layers, so the measured cost is the kernel crossing.
- **`os` package** (`os.Getpid`): a syscall-shaped library call that may be cached and never trap.
- **Timing with `time.Since`**: measure many calls in a loop and divide, because one call is too fast to time alone.
- **Functions returning `time.Duration`**: costs come back as typed durations (nanoseconds), not raw integers.
- **Tests that compare, not assert exact numbers**: the test checks "a syscall is slower than a pure function call", which holds on any machine.
- **What to run:** `go vet ./... && go test -race ./...` inside the module; add `-v -run TestWriteSyscallCost` to see timings.

## What this code shows 🟢

| Code piece | Theory concept | Link |
| --- | --- | --- |
| `WriteSyscallCost` | A real trap: must cross into the kernel on every call | [[System Calls and User vs Kernel Mode#The user → kernel → user round trip]] |
| `GetpidCost` | A "syscall-shaped" call that may be cached, not a reliable cost baseline | [[System Calls and User vs Kernel Mode#Reading this table correctly this trace is reconstructed not measured]] |
| `PureCallCost` | The zero-crossing floor: no kernel involvement at all | [[System Calls and User vs Kernel Mode#Tracing the measurement by hand]] |
| `TestWriteSyscallCostIsMeasurableAndSlowerThanPureCall` | The core claim: a real trap costs measurably more than a pure call | [[System Calls and User vs Kernel Mode#Tracing the measurement by hand]] |

## Setup 🟢

- Module: `syscalls`, Go 1.24.4, no external dependencies (standard library only: `os`, `syscall`, `time`).
- Layout:
  ```text
  syscalls/
    go.mod
    cost.go       # the three cost functions
    cost_test.go  # the comparison test
  ```
- Run it:
  ```bash
  go vet ./...
  go test -race ./...
  go test -race -v ./... -run TestWriteSyscallCost
  ```

## Code 🟡

### Step 1: measuring a real, always-trapping syscall

**Concept.** This is the theory note's "ground truth" measurement: `write(2)` to `/dev/null` has a real side effect (moving bytes to a device, even a null one), so it is never vDSO-eligible and must trap into the kernel on every single call. Opening the file happens once, outside the timed loop, so the measured loop contains nothing but the syscall itself plus loop overhead.

```go
package syscalls

import (
	"os"
	"syscall"
	"time"
)

// WriteSyscallCost returns the average wall time of one real write(2) call of
// a single byte to /dev/null. Unlike a cached library call, write(2) must
// cross into the kernel on every call, so this is a genuine trap cost.
func WriteSyscallCost(iterations int) (time.Duration, error) {
	f, err := os.OpenFile(os.DevNull, os.O_WRONLY, 0)
	if err != nil {
		return 0, err
	}
	defer f.Close()
	fd := int(f.Fd())
	buf := []byte{0}

	start := time.Now()
	for i := 0; i < iterations; i++ {
		if _, err := syscall.Write(fd, buf); err != nil {
			return 0, err
		}
	}
	return time.Since(start) / time.Duration(iterations), nil
}
```

**How it works.**
1. `os.OpenFile(os.DevNull, ...)` and `defer f.Close()` set up and tear down the file descriptor outside the timing window — only the loop body is meant to measure syscall cost, not file-open cost.
2. `syscall.Write`, not `f.Write`, is used deliberately: it is the thinner wrapper, closer to the raw `write(2)` call, whereas `os.File.Write` adds a small amount of its own bookkeeping on top.
3. Dividing `time.Since(start)` by `iterations` gives an *average* per-call cost — a single call is far too fast and noisy to measure reliably with a wall clock, so the loop exists purely to amortize measurement overhead across many calls.
4. The error return matters here specifically because this function is making real syscalls: a transient `EINTR` or a closed descriptor would otherwise be silently ignored, which would corrupt the timing (and possibly the whole measurement) without any visible symptom.

### Step 2: a syscall-shaped call that might be cached

**Concept.** `os.Getpid()` exists precisely to illustrate the warning callout in the theory note: it looks like a syscall from the caller's side, but many platforms cache the PID after the first real call, since a process's PID never changes after it starts. This function is not a reliable "syscall cost" baseline — it exists to be compared against `WriteSyscallCost`, not to replace it.

```go
// GetpidCost returns the average wall time of one os.Getpid call. On some
// platforms the C library caches the pid after the first real call, so this
// number is not a reliable stand-in for syscall cost in general; the note
// uses WriteSyscallCost for that and this only to show the contrast.
func GetpidCost(iterations int) time.Duration {
	start := time.Now()
	for i := 0; i < iterations; i++ {
		_ = os.Getpid()
	}
	return time.Since(start) / time.Duration(iterations)
}
```

**How it works.**
1. The result is explicitly discarded with `_ =`, because this function only cares about the timing, not the PID value itself — a common Go idiom for "call this for its side effect or cost, not its return value."
2. No error path exists here because `os.Getpid()` cannot fail by its own signature — a deliberate contrast with `WriteSyscallCost`, which can.

### Step 3: the zero-crossing floor

**Concept.** `PureCallCost` establishes the baseline every other measurement is compared against: a function call that never touches the kernel at all. Without this floor, there would be nothing to prove that `write`'s ~420–550 ns and `getpid`'s ~7–12 ns are both *above* "doing essentially nothing."

```go
// pureFunctionCall is a userspace-only computation of comparable size, used
// as the "no syscall" baseline. The mask keeps the accumulator bounded so the
// loop below cannot overflow.
func pureFunctionCall(x int) int {
	return (x*2 + 1) & 0xFFFF
}

// sink keeps the compiler from proving the loop below is dead and eliding it.
var sink int

// PureCallCost returns the average wall time of one pureFunctionCall call.
func PureCallCost(iterations int) time.Duration {
	acc := 0
	start := time.Now()
	for i := 0; i < iterations; i++ {
		acc = pureFunctionCall(acc)
	}
	elapsed := time.Since(start)
	sink = acc
	return elapsed / time.Duration(iterations)
}
```

**How it works.**
1. `pureFunctionCall` is unexported (lowercase) because it is an implementation detail of the benchmark, not part of this package's public API — Go's visibility rule is purely about the first letter's case, no extra keyword needed.
2. The `& 0xFFFF` mask bounds the accumulator so repeated squaring-like growth can never overflow `int` across many iterations — a small defensive detail that matters once `iterations` gets into the tens of thousands.
3. `var sink int` plus `sink = acc` at the end is a standard Go micro-benchmarking trick: without using the loop's result somewhere the compiler can't prove is dead code, an optimizing compiler is free to notice the loop's output is never observed and delete the entire loop, which would silently measure "an empty loop" instead of real arithmetic.

> [!example]- Full file (`cost.go`)
> ```go
> package syscalls
>
> import (
> 	"os"
> 	"syscall"
> 	"time"
> )
>
> // WriteSyscallCost returns the average wall time of one real write(2) call of
> // a single byte to /dev/null. Unlike a cached library call, write(2) must
> // cross into the kernel on every call, so this is a genuine trap cost.
> func WriteSyscallCost(iterations int) (time.Duration, error) {
> 	f, err := os.OpenFile(os.DevNull, os.O_WRONLY, 0)
> 	if err != nil {
> 		return 0, err
> 	}
> 	defer f.Close()
> 	fd := int(f.Fd())
> 	buf := []byte{0}
>
> 	start := time.Now()
> 	for i := 0; i < iterations; i++ {
> 		if _, err := syscall.Write(fd, buf); err != nil {
> 			return 0, err
> 		}
> 	}
> 	return time.Since(start) / time.Duration(iterations), nil
> }
>
> // GetpidCost returns the average wall time of one os.Getpid call. On some
> // platforms the C library caches the pid after the first real call, so this
> // number is not a reliable stand-in for syscall cost in general; the note
> // uses WriteSyscallCost for that and this only to show the contrast.
> func GetpidCost(iterations int) time.Duration {
> 	start := time.Now()
> 	for i := 0; i < iterations; i++ {
> 		_ = os.Getpid()
> 	}
> 	return time.Since(start) / time.Duration(iterations)
> }
>
> // pureFunctionCall is a userspace-only computation of comparable size, used
> // as the "no syscall" baseline. The mask keeps the accumulator bounded so the
> // loop below cannot overflow.
> func pureFunctionCall(x int) int {
> 	return (x*2 + 1) & 0xFFFF
> }
>
> // sink keeps the compiler from proving the loop below is dead and eliding it.
> var sink int
>
> // PureCallCost returns the average wall time of one pureFunctionCall call.
> func PureCallCost(iterations int) time.Duration {
> 	acc := 0
> 	start := time.Now()
> 	for i := 0; i < iterations; i++ {
> 		acc = pureFunctionCall(acc)
> 	}
> 	elapsed := time.Since(start)
> 	sink = acc
> 	return elapsed / time.Duration(iterations)
> }
> ```

## Tests 🟡

### `TestWriteSyscallCostIsMeasurableAndSlowerThanPureCall`

**What it proves and why it matters.** This is the single load-bearing assertion of the whole note: a real trap must be both positive (measurable at all) and strictly slower than a pure function call with no kernel crossing. If this ever failed, it would mean either the timing harness is broken or — far more alarming — that the measured machine's syscall path has become as cheap as a plain function call, which would contradict the entire privilege-mode-switch mechanism the theory note describes.

| Input | Expected output |
| --- | --- |
| 10,000 iterations of `WriteSyscallCost` and `PureCallCost` | `writeCost > 0` and `writeCost > pureCost` |

```go
func TestWriteSyscallCostIsMeasurableAndSlowerThanPureCall(t *testing.T) {
	writeCost, err := WriteSyscallCost(10_000)
	if err != nil {
		t.Fatalf("WriteSyscallCost: %v", err)
	}
	// pureCost can legitimately average to 0 once rounded (a few additions
	// and a mask can complete in well under a nanosecond per iteration on
	// modern hardware), so only writeCost is checked for strict positivity.
	pureCost := PureCallCost(10_000)
	if writeCost <= 0 {
		t.Fatalf("expected a positive duration, got write=%v", writeCost)
	}
	if writeCost <= pureCost {
		t.Fatalf("expected a real syscall (%v) to cost more than a pure call (%v)", writeCost, pureCost)
	}
}
```

A failure where `writeCost <= pureCost` would mean something is deeply wrong with either the benchmark (most likely: the compiler eliminated the loop body despite the `sink` trick) or the measurement environment (a system under such heavy noise that nanosecond-scale timing is meaningless) — not a realistic outcome under normal conditions on real hardware.

## Design decisions 🟡

| Decision | Alternative | Trade-off |
| --- | --- | --- |
| `syscall.Write` instead of `f.Write` | `os.File.Write` (the usual idiomatic choice) | `syscall.Write` is thinner and closer to the raw trap, better isolating syscall cost from Go's `os` package overhead; `os.File.Write` is what application code should actually use day to day |
| Average over many iterations via a loop | A single timed call | A single call's wall-clock measurement is dominated by scheduler jitter and timer resolution, not the syscall itself; averaging over thousands of calls amortizes that noise |
| `sink` global to defeat dead-code elimination | `testing.B`'s built-in benchmark harness (`go test -bench`), which has its own anti-elision mechanisms | A plain `go test` with manual timing keeps this note's code runnable as an ordinary function from any caller, not only from `go test -bench`; the trade-off is needing the `sink` trick by hand |
| Testing only the `write` vs. pure-call comparison, not `getpid` vs. pure-call | Also asserting a strict inequality for `GetpidCost` | `GetpidCost` is explicitly unreliable across platforms (it may or may not be cached), so asserting a strict ordering on it would make the test flaky by design — the theory note itself warns against trusting that number |

## Running it 🟡

```bash
$ go test -race -v ./...
=== RUN   TestWriteSyscallCostIsMeasurableAndSlowerThanPureCall
--- PASS: TestWriteSyscallCostIsMeasurableAndSlowerThanPureCall (0.01s)
PASS
ok  	syscalls	1.420s
```

Reading this output: the test passes silently, meaning the real trap (`write` to `/dev/null`) measured strictly more expensive than the pure arithmetic call across this run's 10,000 iterations — consistent with (though not identical in magnitude to) the headline measurement in the theory note's worked example (~420–550 ns for the trap vs. ~0–1 ns for the pure call).

`-race` reports no data races, which is expected: this code is entirely single-goroutine, with no shared mutable state other than the package-level `sink` variable, which only this goroutine ever touches.

## Pitfalls in the code 🔴

- Removing the `sink = acc` assignment (or otherwise never reading `acc`'s final value) lets an optimizing compiler legally delete the entire loop in `PureCallCost`, since Go's compiler is permitted to eliminate computations whose results are provably never observed — this would silently turn the "pure call" baseline into "an empty loop," invalidating the whole comparison.
- `WriteSyscallCost` returns an error instead of calling `t.Fatal` directly, because it is library code meant to be called from a test (or anywhere else) — propagating the error lets the caller decide how to report it, which is the idiomatic Go pattern versus baking in a dependency on `testing`.
- The measured numbers in this note's "Running it" output and in the theory note's table are specific to one machine, one Go version, and one moment in time; rerunning this exact test on different hardware will produce different absolute numbers, though the *ordering* (trap > cached call > pure call) should hold everywhere.

## Exercises 🔴

1. **Change this, predict the result:** change `WriteSyscallCost` to write to a regular file on disk instead of `/dev/null` (clean up the file afterward). Predict whether the per-call average goes up, down, or stays about the same, and explain why using the theory note's "kernel's own work" cost component.
2. **Change this, predict the result:** reduce `iterations` in the test from 10,000 to 10. Predict whether the test becomes more or less likely to fail, and why, in terms of what a smaller sample size does to timing noise.
3. **Extend it:** add a `CgoCallCost`-style function (even a no-op stub that just documents what it would measure, if cgo isn't available in your environment) and a short comment explaining, using the theory note's Variants and comparison table, where you would expect its cost to land relative to the three functions already here.

## Links

- **Theory:** [[System Calls and User vs Kernel Mode]]
- **Compare with:** [[Runtime - Goroutine Scheduler (GMP)]] (what happens to a goroutine's scheduling context during a blocking syscall)
