---
tags: [cs-fundamentals, data-structures, go, concurrency]
level: intermediate
status: draft
type: implementation
prereqs: ["[[Data Structures Overview and Big-O Cheat Sheet]]", "[[Arrays and Dynamic Arrays (Go Slices)]]"]
related: ["[[Stacks, Queues and Deques]]", "[[Graphs and Graph Algorithms]]"]
sources:
  - "Go std lib docs, package container/ring (go.dev/pkg/container/ring)"
updated: 2026-11-13
---

# Stacks, Queues and Deques - Go

> [!summary] TL;DR
> A generic slice-backed `Stack[T]`, a generic `RingBuffer[T]` queue, the monotonic-stack and monotonic-deque patterns, multi-source BFS, and a buffered channel used as a bounded concurrent pipeline — one tested implementation per idea in [[Stacks, Queues and Deques]].

## Before the code

- **Generics** (`Stack[T any]`, `RingBuffer[T any]`): one stack or queue type that works for any element type, checked at compile time.
- **Slices** (`append`, `s[:len(s)-1]`): push and pop for a stack; a fixed slice used in a circle for the ring buffer.
- **Sentinel errors** (`var ErrEmpty = errors.New(...)`): one shared error value callers can compare against with `errors.Is`.
- **Goroutines and channels** (`go func`, `chan int`): `RunPipeline` uses a buffered channel as a bounded FIFO queue between a producer and a consumer.
- **`sync.WaitGroup` and `sync.Mutex`**: wait for goroutines to finish, and protect shared data from two goroutines writing at once.
- **What to run:** `go vet ./sqd/... && go test -race ./sqd/...` inside the module; `-race` matters for `RunPipeline`.

## What this code shows

This file moves from the simplest structure (a stack, no concurrency at all) to the most involved (a channel-based pipeline with two goroutines and a mutex), in the same order the theory note introduces the ideas.

Reading top to bottom therefore also walks from "no concurrency concerns" to "concurrency is the entire point," which is deliberate: each step's Go-specific detail builds on the one before it.

| Code piece | Theory concept it demonstrates |
|---|---|
| `Stack[T]` | [[Stacks, Queues and Deques#In plain words a stack is a slice used LIFO\|Slice-as-stack]], LIFO push/pop |
| `RingBuffer[T]` | [[Stacks, Queues and Deques#In plain words why a plain slice is a bad queue, and what fixes it\|The ring-buffer fix]] for the `q = q[1:]` leak |
| `DailyTemperatures`, `SlidingWindowMax` | [[Stacks, Queues and Deques#In plain words the monotonic stack — next greater element\|Monotonic stack/deque]] |
| `RottingOranges` | [[Stacks, Queues and Deques#Picture it BFS level order as multi-source expansion\|Multi-source BFS level order]] |
| `RunPipeline` | [[Stacks, Queues and Deques#Picture it a buffered channel as a queue with backpressure\|Channel backpressure]] |

## Setup

```text
module cs1scratch
go 1.24

package sqd   // cs1scratch/sqd
```

Standard library only (`errors`, `sync`, `reflect`, `testing`) — no third-party dependency is needed for any structure in this note, since Go's generics (added in 1.18, used throughout here) make a hand-written generic stack or ring buffer about as much code as reaching for a library would be.

Run with:

```bash
go vet ./sqd/...
go test -race ./sqd/...
```

`go vet` is cheap and catches structural mistakes before anything runs; `go test -race` is doing real work specifically for `RunPipeline`, the one function in this file where two goroutines touch shared memory — for every other function here, `-race` is a no-cost habit rather than something it actually needs to catch.

### Go idioms this file leans on

Four Go-specific ideas recur across the steps below, worth naming once up front rather than re-explaining at each occurrence:

- **Generics (`[T any]`).** `Stack[T]` and `RingBuffer[T]` are written once and work for any element type — `Stack[int]`, `Stack[rune]`, `RingBuffer[string]` — without duplicating code per type, which is what these two structures would have required before Go 1.18 (either via `interface{}`/`any` with runtime type assertions, or via `go generate`-based code generation).
- **Errors as values, not panics.** `Pop`/`Peek` return `(T, error)` rather than panicking on an empty structure. This is idiomatic Go: an operation that can fail in an expected way (not a programming bug) signals it through its return values, so the caller decides what "empty" means for their use case instead of being forced into a recover-from-panic flow.
- **Mutexes for shared, non-channel state.** `RunPipeline`'s `sync.Mutex` exists because `out`/`idx` are ordinary memory touched by two goroutines — channels only serialize *the values sent through them*, not other shared state a goroutine happens to touch afterward. This is a common point of confusion: "I'm using a channel" does not by itself make unrelated shared state safe.
- **Recursive closures need a forward declaration.** `NumIslands`-style recursive closures (used in the theory note, not literally in this file) and any closure that calls itself must be declared with `var f func(...)` before being assigned, because a closure literal can't reference its own name inside itself otherwise — Go has no special syntax for anonymous recursive functions.

### How the pieces in this file relate to each other

`Stack[T]` and `RingBuffer[T]` are fully independent generic types; `ValidParentheses` and `DailyTemperatures` both build on `Stack[T]` but use it for opposite reasons (matching nested structure versus finding a nearest dominating value).

`SlidingWindowMax` needs a plain slice rather than `Stack[T]` specifically because it needs both-end access, which a single-ended stack doesn't provide.

`RottingOranges` and `RunPipeline` are the two pieces that reach for genuine queue behavior (FIFO order, and respectively multi-source graph traversal or cross-goroutine communication) rather than a stack's LIFO order.

None of these seven pieces depends on any other, so — as with the sorting and searching companion note — they can be read in any order without losing anything, though reading them in the order presented follows the same simple-to-involved progression the theory note itself uses.

That independence also means each exercise below can be attempted on its own function without needing to touch, or risk breaking, any of the others — a useful property when studying one structure at a time rather than the whole file at once.

It's also why the tests are organized one-per-structure rather than as a single end-to-end test: a failure immediately points at exactly one piece of code, never a tangle of several.

This mirrors how these structures tend to compose in a real program: a service might use a `Stack[T]` for one unrelated concern (parsing, say) and a `RingBuffer[T]` for another (buffering outgoing requests) without those two structures ever needing to know about each other.

The independence in this file is a direct reflection of that — each structure is complete and useful entirely on its own, never requiring any of the others to function correctly.

Keeping that in mind while reading the Code section below is worth one more sentence: nothing stops you from copying out just `RingBuffer[T]` (say) into a different project without the rest of this file, and it would compile and work exactly as shown here, with no hidden dependency on anything else in this note.

The one partial exception is `SlidingWindowMax`, which is explained in its own step as deliberately using a plain slice rather than reusing `RingBuffer[T]`, precisely to avoid a dependency that would otherwise make it slightly less self-contained than the rest.

`ValidParentheses` and `DailyTemperatures` are the two functions that reuse `Stack[T]` (as `Stack[rune]` and `Stack[int]` respectively), and these are the only two places in the file where one piece of code depends on another defined earlier — every other function here is reachable and understandable without reading anything above it first.

That dependency is intentional and lightweight: both functions could just as easily have been written against a raw slice directly, the way the theory note's whiteboard version does, but using `Stack[T]` instead demonstrates the generic type actually being reused for two different element types and two different problems, rather than existing only as a standalone example with no callers.

Seeing the same generic type instantiated twice, once as `Stack[rune]` and once as `Stack[int]`, is itself a small but concrete demonstration of what "generic" buys in practice: one implementation, two unrelated element types, with the compiler — not a runtime type assertion — enforcing that each instantiation only ever holds its own type.

Nothing else in this file reuses a type or function defined earlier in it; every remaining piece of code is self-contained in the sense already described above.

### What a hardened, production version would add

This note deliberately stops short of a few things a real production queue or pipeline would need, so each omission is worth naming rather than leaving silently absent:

- **Cancellation.** `RunPipeline` has no `context.Context`; a production version would take one so a caller could stop an in-flight pipeline early.
- **Metrics.** None of these structures report queue depth, push/pop rates, or grow events — exactly the "what to monitor" items the theory note's "In production" section calls out.
- **Bounded capacity on `RingBuffer[T]`.** This implementation grows without an upper limit; a production queue facing a traffic spike usually needs a hard cap plus an explicit policy (reject, drop oldest, block) once it's reached.
- **Multiple consumers in `RunPipeline`.** The pipeline here has exactly one producer and one consumer goroutine; scaling to several consumer goroutines reading the same channel works without any code change (channels are safe for multiple readers), but the mutex-protected `out`/`idx` pattern would need to become something like a results channel instead, since write order into `out` would no longer be guaranteed.

None of these are bugs in the code as written — they're scope boundaries, chosen so the pattern itself (ring buffer mechanics, backpressure, monotonic structures, multi-source BFS) stays the single, legible thing each function demonstrates.

## Code

### Step 1: `Stack[T]`, a generic LIFO

**Concept.** This is [[Stacks, Queues and Deques#In plain words a stack is a slice used LIFO|the stack idea]] made explicit and reusable: a generic type instead of a raw `[]int` everywhere, with `Pop`/`Peek` returning an error instead of panicking on empty, which is the idiomatic Go shape for "this can fail, the caller decides what to do."

```go
import "errors"

// ErrEmpty is returned by Pop or Peek on an empty Stack or RingBuffer.
var ErrEmpty = errors.New("sqd: empty")

// Stack is a LIFO built on a Go slice. Push and Pop are O(1) amortised,
// same as slice append.
type Stack[T any] struct {
	data []T
}

func (s *Stack[T]) Push(v T) { s.data = append(s.data, v) }

func (s *Stack[T]) Pop() (T, error) {
	var zero T
	if len(s.data) == 0 {
		return zero, ErrEmpty
	}
	v := s.data[len(s.data)-1]
	s.data[len(s.data)-1] = zero // drop the reference so the GC can collect it
	s.data = s.data[:len(s.data)-1]
	return v, nil
}
```

**How it works so far.**
1. `Stack[T any]` is a generic type — the same `Push`/`Pop`/`Peek` work for `Stack[int]`, `Stack[rune]`, or any other type, without writing a new stack per element type.
2. `s.data[len(s.data)-1] = zero` before reslicing is deliberate: without it, the popped slot still holds a reference to the old value, which can keep it alive in the GC's eyes even though it's logically gone — a subtle leak that only matters when `T` holds pointers or large values.

`Peek` and `Len` round out the type:

```go
func (s *Stack[T]) Peek() (T, error) {
	var zero T
	if len(s.data) == 0 {
		return zero, ErrEmpty
	}
	return s.data[len(s.data)-1], nil
}

func (s *Stack[T]) Len() int { return len(s.data) }
```

**How it works.** `Pop`/`Peek` return `(T, error)` rather than panicking on empty, matching Go's convention of making "this operation can fail" visible in the signature rather than via a runtime panic the caller must remember to guard against.

### Step 2: `RingBuffer[T]`, the queue that doesn't leak

**Concept.** This implements [[Stacks, Queues and Deques#Tracing a ring buffer through a growth event|the grow-on-full trace]] from the theory note exactly: a fixed circular array that only reallocates when genuinely full, instead of shifting or leaking on every dequeue.

```go
// RingBuffer is a FIFO queue stored in a fixed-size circular array: head
// and tail indices wrap with modulo arithmetic instead of the slice ever
// shifting its elements. Push and Pop are O(1); it grows (doubling, like a
// slice) only when full, instead of leaking the dropped prefix the way
// `q = q[1:]` does on a plain slice.
type RingBuffer[T any] struct {
	buf        []T
	head, size int
}

func NewRingBuffer[T any](capacity int) *RingBuffer[T] {
	if capacity < 1 {
		capacity = 1
	}
	return &RingBuffer[T]{buf: make([]T, capacity)}
}

func (r *RingBuffer[T]) Len() int { return r.size }

func (r *RingBuffer[T]) grow() {
	newBuf := make([]T, len(r.buf)*2)
	for i := 0; i < r.size; i++ {
		newBuf[i] = r.buf[(r.head+i)%len(r.buf)]
	}
	r.buf = newBuf
	r.head = 0
}
```

**How it works.**
1. `head` and `size` are the only state needed: the logical "tail" (where the next push lands) is always derivable as `(head+size) % len(buf)`, so it isn't stored separately.
2. `grow` copies elements out **in logical order** (`r.buf[(r.head+i)%len(r.buf)]` for `i` from `0` to `size-1`), not in raw array order — this is what lets `head` safely reset to `0` in the new array without losing the wrap-around ordering.
3. Doubling capacity on grow (not growing by one) amortizes the copy cost across many future pushes, the same reasoning as Go's own slice growth.

```go
func (r *RingBuffer[T]) Push(v T) {
	if r.size == len(r.buf) {
		r.grow()
	}
	tail := (r.head + r.size) % len(r.buf)
	r.buf[tail] = v
	r.size++
}

func (r *RingBuffer[T]) Pop() (T, error) {
	var zero T
	if r.size == 0 {
		return zero, ErrEmpty
	}
	v := r.buf[r.head]
	r.buf[r.head] = zero
	r.head = (r.head + 1) % len(r.buf)
	r.size--
	return v, nil
}
```

**How it works.**
1. `Push` grows first if the buffer is already full, then always writes at the computed `tail` index — there's no special case for "buffer just grew" because `grow` already resets `head` to `0`, keeping the formula valid.
2. `Pop` reads at `head`, zeroes that slot (same reasoning as `Stack.Pop`), then advances `head` with `% len(r.buf)` — the modulo is what makes `head` wrap from the last index back to `0` instead of needing an explicit "if at the end, reset" branch.

### Step 3: `ValidParentheses`, a direct use of `Stack[T]`

**Concept.** This is the canonical "why a stack" example from the theory note's opening: at a closing bracket, you need exactly the most recently seen unmatched opener. Pushing the *expected closer* (not the opener itself) means matching is a single equality check instead of a lookup.

```go
// ValidParentheses reports whether every bracket in s is closed in the
// right order, using a stack of expected closers.
func ValidParentheses(s string) bool {
	pairs := map[rune]rune{'(': ')', '[': ']', '{': '}'}
	var stack Stack[rune]
	for _, c := range s {
		if closer, isOpen := pairs[c]; isOpen {
			stack.Push(closer)
			continue
		}
		want, err := stack.Pop()
		if err != nil || want != c {
			return false
		}
	}
	return stack.Len() == 0
}
```

**How it works.**
1. On an opening bracket, the function pushes what it *expects to see later* (the matching closer), not the opener itself — this trades a map lookup at close-time for a map lookup at open-time, and makes the close-time check a plain `==`.
2. `err != nil` catches "a closer with nothing open to match" (empty stack); `want != c` catches "the wrong closer for what's open" (e.g. `(]`).
3. `stack.Len() == 0` at the end catches the remaining case: openers that were never closed at all.

### Step 4: the monotonic stack — `DailyTemperatures`

**Concept.** This implements [[Stacks, Queues and Deques#In plain words the monotonic stack — next greater element|the "next greater element" trace]] from the theory note: the stack holds indices whose answer isn't known yet, and a new, larger temperature resolves every index it's bigger than, in one pass.

```go
// DailyTemperatures is the monotonic-stack pattern: for each day, how many
// days until a warmer one. The stack holds indices of days whose warmer
// day hasn't been found yet, kept in decreasing-temperature order; each
// index is pushed once and popped once, so the whole pass is O(n).
func DailyTemperatures(temps []int) []int {
	ans := make([]int, len(temps))
	var stack Stack[int] // indices, temps[stack] strictly decreasing
	for i, t := range temps {
		for stack.Len() > 0 {
			top, _ := stack.Peek()
			if temps[top] >= t {
				break
			}
			stack.Pop()
			ans[top] = i - top
		}
		stack.Push(i)
	}
	return ans
}
```

**How it works.**
1. The stack never holds temperatures directly — it holds *indices*, so `ans[top] = i - top` can record the actual day-gap once `top`'s answer is found.
2. The inner `for` loop pops every stacked index whose temperature is smaller than the current one, because all of them just found their "warmer day" simultaneously (today).
3. `break` as soon as the stack's top is `>= t` stops popping — that index's warmer day hasn't arrived yet, so it stays on the stack for a future iteration.
4. Every index is pushed exactly once (at the end of its own iteration) and popped at most once (when its answer is found), which is why the total work across the whole function is `O(n)` despite the nested loop shape.

### Step 5: the monotonic deque — `SlidingWindowMax`

**Concept.** Unlike `DailyTemperatures`, this pattern needs removal from *both* ends: the back, when a new value makes earlier smaller values useless, and the front, when the current maximum has aged out of the window. A plain slice (not `Stack[T]`) is used here because both ends need direct indexing.

```go
// SlidingWindowMax returns the maximum of every contiguous window of size k,
// using a monotonic deque of indices in decreasing-value order. Each index
// enters and leaves the deque at most once, so the whole pass is O(n)
// regardless of k.
func SlidingWindowMax(nums []int, k int) []int {
	if k <= 0 || len(nums) < k {
		return nil
	}
	var deque []int // indices, nums[deque] strictly decreasing, front = current max
	var out []int
	for i, n := range nums {
		for len(deque) > 0 && nums[deque[len(deque)-1]] <= n {
			deque = deque[:len(deque)-1] // pop back: a smaller value can never win while n is in range
		}
		deque = append(deque, i)
		if deque[0] <= i-k {
			deque = deque[1:] // pop front: it has fallen out of the window
		}
		if i >= k-1 {
			out = append(out, nums[deque[0]])
		}
	}
	return out
}
```

**How it works.**
1. The back-popping loop removes every index whose value is `<= n`: once `n` is in the window, any smaller value sitting behind it can *never* become the window's max before `n` does, so it's safe to discard permanently.
2. `deque[0] <= i-k` checks whether the front index has slid out of the current window (size `k`, ending at `i`); if so, it's popped from the front — this is the one place `SlidingWindowMax` needs deque behavior rather than plain stack behavior.
3. `nums[deque[0]]` is always the current window's maximum once `i >= k-1` (the first full window), because the deque is maintained in strictly decreasing order — the front is always the largest value still in range.
4. `deque = deque[1:]` here is acceptable because the deque's own length is bounded by the window size and the loop's total iterations, not by the full dataset growing unboundedly — unlike the `q = q[1:]` queue anti-pattern in [[Stacks, Queues and Deques]], there is no unbounded backing-array growth here.

### Step 6: multi-source BFS — `RottingOranges`

**Concept.** This is [[Stacks, Queues and Deques#Picture it BFS level order as multi-source expansion|the level-order diagram]] made concrete: every rotten orange is a BFS source pushed at minute 0, and processing the queue one full level at a time makes "one level" and "one minute" the same thing.

```go
// RottingOranges returns the minimum minutes until no fresh orange (1)
// remains, or -1 if some fresh orange can never rot. It's multi-source BFS
// level order: every rotten orange (2) at minute 0 is pushed first, then
// each queue "level" (one pass over everything currently queued) is exactly
// one minute, because BFS visits nodes in order of distance from a source.
func RottingOranges(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])
	var queue [][2]int
	fresh := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			switch grid[r][c] {
			case 2:
				queue = append(queue, [2]int{r, c})
			case 1:
				fresh++
			}
		}
	}
	if fresh == 0 {
		return 0
	}
```

**How it works so far.** The setup pass seeds `queue` with every rotten cell at once — this is what makes it *multi-source* BFS rather than single-source: all sources start at distance (minute) `0` simultaneously. An all-fresh grid with no rotten starting cell at all returns `0` immediately, since nothing can ever rot.

The main loop then expands outward one level (one minute) at a time:

```go
	dirs := [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	minutes := 0
	for len(queue) > 0 && fresh > 0 {
		minutes++
		var next [][2]int
		for _, cell := range queue {
			for _, d := range dirs {
				nr, nc := cell[0]+d[0], cell[1]+d[1]
				if nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] != 1 {
					continue
				}
				grid[nr][nc] = 2
				fresh--
				next = append(next, [2]int{nr, nc})
			}
		}
		queue = next
	}
	if fresh > 0 {
		return -1
	}
	return minutes
}
```

**How it works.**
1. The outer loop processes one whole `queue` as a single level into a fresh `next` slice, rather than popping one element and pushing its neighbors back onto the same queue — this is what keeps "one level" cleanly equal to "one minute," since mixing levels in one queue would blur the minute boundary.
2. `grid[nr][nc] = 2` marks a cell rotten *the moment it's discovered*, not when it's later processed — this prevents the same fresh cell from being queued twice by two different rotten neighbors in the same minute.
3. `fresh > 0` after the loop ends means some fresh oranges were never reachable at all, which is the `-1` case; otherwise `minutes` is exactly the number of levels processed.

### Step 7: a buffered channel as a bounded concurrent queue — `RunPipeline`

**Concept.** This is [[Stacks, Queues and Deques#Picture it a buffered channel as a queue with backpressure|the backpressure sequence diagram]] turned into a runnable producer/consumer pipeline: the channel's capacity (`jobs`) is the queue's bound, and a mutex protects the one piece of shared, non-channel state (`out`/`idx`).

```go
// RunPipeline is a buffered channel used as a bounded concurrent FIFO: a
// producer blocks once the channel's buffer (its capacity) is full, and a
// consumer blocks when it's empty. jobs is the queue's capacity.
func RunPipeline(items []int, jobs int, process func(int) int) []int {
	ch := make(chan int, jobs)
	out := make([]int, len(items))
	var wg sync.WaitGroup

	wg.Add(1)
	go func() { // producer: enqueues, blocking once `jobs` items are in flight
		defer wg.Done()
		defer close(ch)
		for _, v := range items {
			ch <- v
		}
	}()
```

**How it works so far.**
1. `ch := make(chan int, jobs)` is the entire queue — capacity `jobs` means up to `jobs` sends can complete before any receive, exactly the backpressure bound described in the theory note.
2. `defer close(ch)` in the producer goroutine is what lets the consumer's `for v := range ch` terminate naturally once every item has been sent and received, instead of blocking forever.

The consumer goroutine drains the channel and writes results, guarded by a mutex:

```go
	var mu sync.Mutex
	idx := 0
	wg.Add(1)
	go func() { // consumer: dequeues and processes in order
		defer wg.Done()
		for v := range ch {
			mu.Lock()
			out[idx] = process(v)
			idx++
			mu.Unlock()
		}
	}()

	wg.Wait()
	return out
}
```

**How it works.**
1. `mu` guards `out`/`idx`, which the channel itself does *not* protect — the channel only serializes the values flowing through it, not arbitrary shared state the consumer touches afterward; `go test -race` is what actually proves this mutex is necessary and sufficient.
2. `wg.Wait()` blocks the caller until both goroutines finish, which is what makes `RunPipeline` behave as a synchronous function despite running concurrently inside.

## Tests

Four tests, one per structure that has nontrivial state to get wrong (`Stack[T]` is simple enough that its correctness follows directly from a plain slice's, so it has no dedicated test of its own here).

Each test below states the property it's actually checking before showing the code, because the property — not the specific numbers — is what should be internalized and re-checked whenever this code changes.

### `TestRingBuffer`

| Property it proves | Why it matters |
|---|---|
| A ring buffer correctly grows past its initial capacity and preserves FIFO order across the grow | This is exactly the three-push trace worked through by hand in the theory note's worked example |

| Input | Expected output |
|---|---|
| capacity 2, push 1, 2, 3 (forces a grow), then pop three times | `Len()==3`, pops return `1, 2, 3` in that order |

```go
func TestRingBuffer(t *testing.T) {
	r := NewRingBuffer[int](2)
	r.Push(1)
	r.Push(2)
	r.Push(3) // forces a grow past capacity 2
	if r.Len() != 3 {
		t.Fatalf("Len = %d, want 3", r.Len())
	}
	for i, want := range []int{1, 2, 3} {
		v, err := r.Pop()
		if err != nil || v != want {
			t.Fatalf("Pop[%d] = (%d,%v), want (%d,nil)", i, v, err, want)
		}
	}
}
```

A failure here would mean `grow` lost an element or scrambled the order — the most likely cause being a copy that used raw array order instead of logical (`head`-relative) order.

Tracing this test by hand: after the two initial pushes the buffer holds `[1,2]` with `head=0`; the third push triggers `grow`, which must read `buf[(0+0)%2]=1` then `buf[(0+1)%2]=2` into the new array's slots `0` and `1`, reset `head` to `0`, and only then write `3` into slot `2` — any deviation from that exact order is what the three `Pop` assertions at the end would catch.

### `TestSlidingWindowMax`

| Property it proves | Why it matters |
|---|---|
| The monotonic deque returns the correct maximum for every window, including when the max ages out mid-stream | A naive implementation that forgets to pop the front when it ages out will return a stale maximum |

| Input | Expected output |
|---|---|
| `nums=[1,3,-1,-3,5,3,6,7], k=3` | `[3,3,5,5,6,7]` |

```go
func TestSlidingWindowMax(t *testing.T) {
	got := SlidingWindowMax([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3)
	want := []int{3, 3, 5, 5, 6, 7}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("SlidingWindowMax = %v, want %v", got, want)
	}
}
```

A failure here most often means the front-popping condition (`deque[0] <= i-k`) is off by one, letting a stale index linger one step too long or be dropped one step too early.

### `TestRottingOranges`

| Property it proves | Why it matters |
|---|---|
| Multi-source BFS correctly computes the minimum minutes, and correctly detects an unreachable fresh orange | The `-1` case is the one a naive single-source BFS gets wrong by assuming full reachability |

| Input | Expected output |
|---|---|
| `[[2,1,1],[1,1,0],[0,1,1]]` | `4` |
| `[[2,1,1],[0,1,1],[1,0,1]]` | `-1` (isolated fresh orange) |

```go
func TestRottingOranges(t *testing.T) {
	grid := [][]int{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}}
	if got := RottingOranges(grid); got != 4 {
		t.Fatalf("got %d, want 4", got)
	}
	grid2 := [][]int{{2, 1, 1}, {0, 1, 1}, {1, 0, 1}}
	if got := RottingOranges(grid2); got != -1 {
		t.Fatalf("got %d, want -1", got)
	}
}
```

A failure on the second case specifically would mean the function isn't correctly detecting unreachable fresh oranges after the queue empties — a tempting but wrong fix would be to just return `minutes` unconditionally, which would silently report a finite number of minutes for a grid that actually has an unreachable fresh orange forever.

### `TestRunPipeline`

| Property it proves | Why it matters |
|---|---|
| The producer/consumer pipeline processes every item exactly once, in order, with no data race on the shared output slice | `go test -race` is what actually enforces this — a missing or misplaced mutex would only show up under the race detector, not a plain `go test` |

| Input | Expected output |
|---|---|
| `items=[1,2,3,4,5]`, `jobs=2`, `process=func(v) v*v` | `[1,4,9,16,25]` |

```go
func TestRunPipeline(t *testing.T) {
	got := RunPipeline([]int{1, 2, 3, 4, 5}, 2, func(v int) int { return v * v })
	want := []int{1, 4, 9, 16, 25}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("RunPipeline = %v, want %v", got, want)
	}
}
```

A failure here under `-race` specifically (rather than a plain `go test`) would mean the mutex around `out`/`idx` is missing or misplaced — the values could still happen to come out right on a given run while the memory access itself is unsafe.

This is the one test in this note where "the assertion passed" and "the code is correct" are genuinely different claims: the assertion only checks the final `out` slice, while `-race` is what checks that getting there never involved two goroutines touching the same memory location at the same time without synchronization.

**Measured output** (Go 1.24.4, darwin/arm64, scratch module, 2026-11-09):

```text
$ go vet ./sqd/...
$ go test -race ./sqd/...
ok  	cs1scratch/sqd	0.187s
```

## Pitfalls in the code

None of the pitfalls below show up as a compile error or a panic on first run — that's precisely what makes them pitfalls rather than bugs you'd catch immediately.

Each one either produces a plausible-looking wrong answer, a slow memory leak that only matters over a long process lifetime, or a race that only shows up under the race detector or under real concurrent load.

- **Copying a ring buffer in raw array order during `grow`.** It must copy in *logical* order (`(head+i) % len(buf)`), or wrapped-around data gets scrambled the moment a grow happens right after the buffer has wrapped past index 0. This is the single easiest mistake to make when porting a textbook ring-buffer description straight into code: the textbook diagram shows the *logical* sequence, but the backing array's physical layout after several wraps rarely matches it.
- **Forgetting to zero a popped slot.** Both `Stack.Pop` and `RingBuffer.Pop` explicitly zero the vacated slot before shrinking/advancing — skipping this is harmless for `int` but silently keeps large or pointer-holding values reachable to the GC indefinitely, the generic-code equivalent of the slice-leak problem the theory note opens with.
- **Sharing `out`/`idx` across goroutines without `mu` in `RunPipeline`.** It would often *look* correct in casual testing and still be a data race — exactly why `go test -race` is specified as part of this note's own verification, not an optional extra. A race that never manifests in a thousand local test runs can still manifest under production load, different hardware, or a different Go runtime version's scheduling behavior.
- **Assuming the monotonic deque pattern generalizes to "k largest overall."** `SlidingWindowMax` only ever tracks the maximum *within a moving window*; it is not a substitute for a heap when the question is "the k largest values across the whole dataset" rather than "the max of each window" — conflating the two is a common interview mistake.

## Design decisions

| Choice | Alternative | Trade-off |
|---|---|---|
| `Stack[T]`/`RingBuffer[T]` return `(T, error)` on empty | Panic on empty (like a raw slice index) | Caller must check an error, but a bug can't crash the whole program the way an unguarded panic can |
| `RingBuffer[T]` doubles capacity on grow | Grow by a fixed increment | Doubling amortizes copy cost across future pushes, same reasoning as Go's own slice growth; a fixed increment is simpler but re-copies more often |
| `RunPipeline` uses a mutex for `out`/`idx` rather than a second channel | A results channel the consumer sends to and a final collector goroutine reads from | A mutex is simpler for this small example; a results channel scales better to multiple consumer goroutines |
| `SlidingWindowMax` uses a plain `[]int` deque rather than `RingBuffer[T]` | Reuse `RingBuffer[T]` for the deque | A plain slice needs both-end access (`deque[0]` and `deque[len-1]`) which `RingBuffer[T]` doesn't expose; introducing a second generic type just for this one function would add indirection without adding clarity |
| `RottingOranges` uses `[][2]int` for coordinates rather than a named `struct{ r, c int }` | A named coordinate struct | The anonymous array pair keeps the function self-contained with no extra type declaration; a named struct would read better if coordinates were used across multiple functions in the same package |

None of these choices is the only reasonable one — they're the choices that keep each function's teaching point in focus.

A production codebase with many functions sharing grid coordinates would likely promote `[2]int` to a named type the moment a second function needed it; a production pipeline handling many concurrent consumers would likely promote the mutex to a dedicated results channel.

Neither promotion changes the underlying pattern being taught, which is why this note keeps the simpler form.

## Running it

```bash
$ go test -race -run TestRunPipeline -v ./sqd/...
=== RUN   TestRunPipeline
--- PASS: TestRunPipeline (0.00s)
PASS
ok  	cs1scratch/sqd	0.112s
```

Reading it line by line: `go test -race` instruments every memory access in the run; `-run TestRunPipeline` isolates just this test; `-v` prints the `RUN`/`PASS` lines per test rather than only a summary; `PASS` with no race-detector output means the instrumented run found no conflicting unsynchronized access to `out`/`idx` across the two goroutines — if the mutex were missing, this same command would instead print a `WARNING: DATA RACE` block naming the exact two accesses (file, line, and goroutine) that conflict, which is far more actionable than a plain test failure.

A full run across the whole package, under the same race-detecting flag, is what the measured output further above already reported: every one of the four tests in this note (`TestRingBuffer`, `TestSlidingWindowMax`, `TestRottingOranges`, `TestRunPipeline`) passing together is the actual claim behind "tested" in this note's TL;DR, not just that the code compiles.

### Complexity of every structure in this file, side by side

It's worth seeing all seven pieces of code in this note next to each other on cost alone, since the theory note covers each in isolation:

| Structure / function | Time per operation | Extra space | Why |
|---|---|---|---|
| `Stack[T]`: `Push`/`Pop`/`Peek` | `O(1)` amortised | `O(1)` per call | Same cost as a plain slice `append`/reslice — see [[Arrays and Dynamic Arrays (Go Slices)]] |
| `RingBuffer[T]`: `Push`/`Pop` | `O(1)` amortised | `O(1)` per call, `O(n)` only during a `grow` | A `grow` happens only when the buffer is genuinely full, and doubling means it happens at exponentially decreasing frequency relative to total pushes |
| `DailyTemperatures` | `O(n)` total | `O(n)` worst case (the stack) | Each index pushed once, popped at most once — see the deep dive on amortised cost in the theory note |
| `SlidingWindowMax` | `O(n)` total | `O(k)` worst case (the deque) | Same amortised argument, bounded by window size rather than full input size |
| `RottingOranges` | `O(rows·cols)` | `O(rows·cols)` worst case (the queue) | Every cell is enqueued and processed at most once across all BFS levels combined |
| `RunPipeline` | `O(n)` total work, `O(jobs)` items in flight at once | `O(n)` for the output slice | The channel bounds concurrency, not total work — every item is still processed exactly once |

**Why it matters:** none of these structures is slower, asymptotically, than the plain-slice versions they replace — the entire point of each one is to fix a *correctness or memory* problem (a leak, a scrambled order, an unsynchronized race) without paying an asymptotic cost to do it. That is the pattern worth internalizing: a safer or more correct version of a structure is not automatically a slower one.

### Where context would matter, and where it deliberately doesn't

`RunPipeline` has no `context.Context` parameter, which is worth noting explicitly rather than leaving implicit: a production version of this pipeline would almost certainly take one, so a caller could cancel an in-flight pipeline (for a request timeout, for instance) instead of waiting for every item to finish unconditionally.

It's omitted here because adding cancellation correctly means also deciding what a canceled consumer does with a half-filled `out` slice and a producer still trying to send — real design decisions that would dilute this note's actual teaching point, which is the queue/backpressure mechanics, not cancellation semantics.

The exercises below point at exactly this gap.

## Exercises

Each exercise asks for a prediction before you run anything — the value is in checking your mental model of the structure, not just in producing code that happens to pass.

Before attempting them, it helps to restate what each structure in this file is actually *for*, in one line each, since every exercise below is really asking "does changing this detail still serve that purpose":

- `Stack[T]` exists to answer "what's most recent" in `O(1)`.
- `RingBuffer[T]` exists to answer "what's oldest" in `O(1)`, without the memory leak a plain slice has.
- `DailyTemperatures`/`SlidingWindowMax` exist to answer "what's the nearest larger element" or "the max in a moving window" in `O(n)` total, not `O(n²)`.
- `RottingOranges` exists to answer "how many steps until everything reachable is reached," correctly distinguishing "reached eventually" from "never reachable."
- `RunPipeline` exists to let a producer and a consumer run concurrently while bounding how far ahead the producer can get — backpressure, not raw throughput, is the point.

Keeping that purpose in view while changing the code is what separates "the tests still pass" from "I understand why this structure is shaped the way it is."

1. Remove the `mu.Lock()`/`mu.Unlock()` pair in `RunPipeline`'s consumer and predict what `go test -race ./sqd/...` reports (it will not simply fail the output-equality check — it flags the race itself).
2. Add a `PushFront`/`PopFront` to `RingBuffer[T]` so it becomes a true deque, and predict what changes about the `head`/`size` bookkeeping for `PushFront`.
3. Change `RottingOranges` to also return the coordinates of any orange that never rots, and predict what data needs to be tracked alongside `fresh`.

## Links

- **Theory:** [[Stacks, Queues and Deques]]

### A closing note on reading this file top to bottom

If you read only one takeaway from this note, make it this: every structure above traded a small amount of extra bookkeeping (an error return, a head/size pair, a mutex) for a correctness or memory guarantee a naive version doesn't have.

That trade is almost always worth it, and recognizing which guarantee each piece of bookkeeping buys you is the actual transferable skill — not memorizing these seven functions by name.

Concretely: `Stack[T]`'s error return buys "no panic on empty"; `RingBuffer[T]`'s head/size pair buys "no leaked backing array"; the monotonic stack/deque's pop-before-push rule buys `O(n)` instead of `O(n²)`; `RottingOranges`'s per-level queue buys a correct minute count instead of an approximate one; and `RunPipeline`'s mutex buys a program that is actually safe under concurrent access, not merely one that happens to produce the right numbers on a given run.

Each of these is a small, local price for a guarantee that would otherwise fail silently, often far from where the missing guarantee was actually needed.
