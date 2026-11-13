---
tags: [frontend, javascript, data-structures]
level: basic
status: draft
type: implementation
prereqs: ["[[JavaScript Core - Types, Scope, Hoisting, Closures, this]]"]
related: ["[[JavaScript Objects, Arrays and Iteration]]", "[[DOM, Events and Timers]]", "[[Arrays, Slices and Maps (with internals)]]"]
sources:
  - "ECMA-262 (ECMAScript Language Specification), sections on Object and Array exotic objects"
  - "MDN Web Docs: Array.prototype methods, Object, Map, Set"
updated: 2026-11-13
---

# JavaScript Objects, Arrays and Iteration - Go

> [!summary] TL;DR
> This code demonstrates JavaScript's `map`/`filter`/`reduce` in Go, using generics (Go 1.18+) to write each operation once for any element type. It's a companion to [[JavaScript Objects, Arrays and Iteration]] — read that note first for the concepts; this note shows the same three operations as a small, tested Go package.

## Before the code

- **Generics** (`func Map[T, U any]`): one function written once that works for any element type, like JS methods that accept any array.
- **Function values / closures** (`func(n int) int { ... }`): functions passed as arguments, the Go version of a JS callback.
- **Slices** (`[]T`): Go's growable list; `make([]U, len(in))` creates one with a fixed length, `append` grows it.
- **Structs** (`CartItem`): a fixed set of named fields, the typed cousin of a JS object literal.
- **Testing** (`testing`, `reflect.DeepEqual`): `TestXxx` functions run by `go test`; `DeepEqual` compares two slices element by element.
- **What to run:** `go vet ./... && go test -race -v ./...` inside the module. No goroutines, interfaces or `context` are needed here.

## What this code shows

| Code | Theory concept |
| --- | --- |
| `Map[T, U any]` | [[JavaScript Objects, Arrays and Iteration#map / filter / reduce\|JS's `Array.prototype.map`]] — transform every element, return a new slice, never mutate the input |
| `Filter[T any]` | the same note's `Array.prototype.filter` — keep only elements that pass a predicate |
| `Reduce[T, A any]` | the same note's `Array.prototype.reduce`, including the "must pass an initial value" rule |
| `CartItem` / `CartTotal` | the shopping-cart worked example from the theory note's whiteboard version |

Go has no built-in generic `Map`/`Filter`/`Reduce` in its standard library (the `slices` package has other helpers, but not these three), so this package exists to show the shape JavaScript's array methods would take if you wrote them yourself in a statically typed, generic language.

## Setup

- **Go version:** 1.24 (generics have been stable since 1.18; nothing here needs a newer feature).
- **Module layout:** a single package, two files.
  ```
  mapfilter/
    go.mod
    mapfilter.go       # Map, Filter, Reduce, CartItem, CartTotal
    mapfilter_test.go  # table-style and scenario tests
  ```
- **Dependencies:** none beyond the standard library (`reflect`, `testing`).
- **Run it:**
  ```bash
  go vet ./...
  go test -race -v ./...
  ```

## Code

### Step 1: `Map` and `Filter`

**Concept.** These two implement [[JavaScript Objects, Arrays and Iteration#map / filter / reduce|the theory note's map/filter section]]: both return a brand-new slice and leave the input untouched, exactly like JS's non-mutating array methods.

Go has no generic numeric or interface shortcut for "any type," so both functions use two type parameters — one for the input element type, one for the output element type — which is what lets `Map` change the *type* of each element (e.g. `[]int` → `[]string`), not just its value.

The alternative design, writing a separate `MapInts`, `MapStrings`, … for every type pair, is what Go code looked like before generics (1.18); it worked, but needed one copy of the same loop per type.

```go
// Package mapfilter mirrors JavaScript's Array.prototype.map/filter/reduce
// using Go generics, to show the same idea with Go's standard library shape.
package mapfilter

// Map returns a new slice with f applied to every element, like Array.map.
// It never mutates in, matching JS's non-mutating map.
func Map[T, U any](in []T, f func(T) U) []U {
	out := make([]U, len(in))
	for i, v := range in {
		out[i] = f(v)
	}
	return out
}

// Filter returns a new slice with only the elements that satisfy pred,
// like Array.filter.
func Filter[T any](in []T, pred func(T) bool) []T {
	out := make([]T, 0, len(in))
	for _, v := range in {
		if pred(v) {
			out = append(out, v)
		}
	}
	return out
}
```

**How it works.**
1. `func Map[T, U any](in []T, f func(T) U) []U` — `[T, U any]` declares two type parameters with no constraint beyond "any type at all"; `T` is the element type going in, `U` the element type coming out.
2. `out := make([]U, len(in))` pre-allocates the result slice at the final length, so the loop below never triggers a slice-growth reallocation — this is the one place the Go version is cheaper than JS's `map`, which grows its result array as it goes.
3. `out[i] = f(v)` calls the caller's function `f` on each element and stores the result at the matching index, keeping order — JS's `map` makes the same one-to-one, order-preserving guarantee.
4. `Filter` pre-allocates capacity (`make([]T, 0, len(in))`) but starts at length 0, since it doesn't know in advance how many elements will pass `pred`; `append` grows it lazily, same as JS's `filter` building its result incrementally.
5. Neither function reads or writes `in` — only `range` reads it — so the caller's original slice is guaranteed untouched, matching the theory note's "map/filter never mutate" rule.

### Step 2: `Reduce` and the cart example

**Concept.** `Reduce` implements [[JavaScript Objects, Arrays and Iteration#map / filter / reduce|the theory note's reduce]], including its most interview-relevant rule: an initial value is mandatory, not optional.

In Go this isn't a runtime check — the function signature itself has no way to omit `initial`, so the "what if you forget it" bug class the theory note warns about for JS simply cannot compile in Go.

`CartItem`/`CartTotal` then reuse `Reduce` for the theory note's shopping-cart worked example, with `Price` as an integer (paise) instead of a float, so summing many prices never accumulates floating-point rounding error.

```go
// Reduce folds in into a single value, like Array.reduce with an initial
// value. Go has no built-in equivalent to reduce-without-an-initial-value,
// which is also the case JS throws a TypeError for on an empty array.
func Reduce[T, A any](in []T, initial A, f func(acc A, cur T) A) A {
	acc := initial
	for _, v := range in {
		acc = f(acc, v)
	}
	return acc
}

type CartItem struct {
	Name  string
	Price int // paise, so a measured integer total has no float rounding
}

// CartTotal mirrors shoppingCart.reduce((acc, item) => acc + item.price, 0).
func CartTotal(items []CartItem) int {
	return Reduce(items, 0, func(acc int, it CartItem) int {
		return acc + it.Price
	})
}
```

**How it works.**
1. `Reduce[T, A any](in []T, initial A, f func(acc A, cur T) A) A` — two type parameters again: `T` for the element type, `A` for the accumulator type, which don't have to match (you could reduce a `[]string` down to an `int` count, for example).
2. `acc := initial` seeds the accumulator from the caller-supplied value — there is no fallback to "use the first element instead," so an empty `in` slice simply returns `initial` unchanged instead of panicking, unlike JS's `reduce` on an empty array with no initial value.
3. The loop calls `f(acc, v)` once per element and reassigns `acc`, exactly mirroring the JS callback shape `(acc, item) => ...`.
4. `CartTotal` is a thin, typed wrapper around `Reduce` — this is the pattern for using the generic helpers in real code: call the generic function with a closure, give the result a descriptive name.

> [!example]- Full file: mapfilter.go
> ```go
> // Package mapfilter mirrors JavaScript's Array.prototype.map/filter/reduce
> // using Go generics, to show the same idea with Go's standard library shape.
> package mapfilter
>
> // Map returns a new slice with f applied to every element, like Array.map.
> // It never mutates in, matching JS's non-mutating map.
> func Map[T, U any](in []T, f func(T) U) []U {
> 	out := make([]U, len(in))
> 	for i, v := range in {
> 		out[i] = f(v)
> 	}
> 	return out
> }
>
> // Filter returns a new slice with only the elements that satisfy pred,
> // like Array.filter.
> func Filter[T any](in []T, pred func(T) bool) []T {
> 	out := make([]T, 0, len(in))
> 	for _, v := range in {
> 		if pred(v) {
> 			out = append(out, v)
> 		}
> 	}
> 	return out
> }
>
> // Reduce folds in into a single value, like Array.reduce with an initial
> // value. Go has no built-in equivalent to reduce-without-an-initial-value,
> // which is also the case JS throws a TypeError for on an empty array.
> func Reduce[T, A any](in []T, initial A, f func(acc A, cur T) A) A {
> 	acc := initial
> 	for _, v := range in {
> 		acc = f(acc, v)
> 	}
> 	return acc
> }
>
> type CartItem struct {
> 	Name  string
> 	Price int // paise, so a measured integer total has no float rounding
> }
>
> // CartTotal mirrors shoppingCart.reduce((acc, item) => acc + item.price, 0).
> func CartTotal(items []CartItem) int {
> 	return Reduce(items, 0, func(acc int, it CartItem) int {
> 		return acc + it.Price
> 	})
> }
> ```

## Design decisions

| Choice | Alternative | Trade-off |
| --- | --- | --- |
| Two type parameters on `Map` (`T`, `U`) | One type parameter, requiring `f func(T) T` | One parameter is simpler but forbids changing element type (e.g. `[]CartItem` → `[]string` of names), which JS's `map` allows freely |
| Mandatory `initial` argument on `Reduce` | Overload without `initial`, panic on empty input | Matches JS's own behavior (throws without one) but makes the "forgot the initial value" bug a compile error in Go instead of a runtime error |
| Pre-sized `make([]U, len(in))` in `Map` | `append` into a zero-length slice, as `Filter` does | Faster for `Map` (output length is always known up front); would be wrong for `Filter`, where the final length isn't known until every predicate has run |
| Plain generic functions, no package-level state | A `Stream`-style chainable type (`.Map().Filter().Reduce()`) | Chainable types read closer to the JS call-site style but add API surface; plain functions keep this demo minimal |

## Tests

### `TestMapFilterChain`

**What it proves:** chaining `Map` twice then `Filter` produces exactly the pipeline traced by hand in the theory note's worked example, and the original input slice is never mutated by either call.

| Input | After `Map(×10)` | After `Map(+1)` | After `Filter(>=40)` |
| --- | --- | --- | --- |
| `[1..10]` | `[10,20,...,100]` | `[11,21,...,101]` | `[41,51,61,71,81,91,101]` |

```go
func TestMapFilterChain(t *testing.T) {
	nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	times10 := Map(nums, func(n int) int { return n * 10 })
	plus1 := Map(times10, func(n int) int { return n + 1 })
	atLeast40 := Filter(plus1, func(n int) bool { return n >= 40 })

	want := []int{41, 51, 61, 71, 81, 91, 101}
	if !reflect.DeepEqual(atLeast40, want) {
		t.Fatalf("got %v, want %v", atLeast40, want)
	}
	// nums must be untouched: map/filter never mutate the input.
	if nums[0] != 1 {
		t.Fatalf("input slice was mutated: %v", nums)
	}
}
```

If this test failed on the first assertion, `Map` or `Filter` would be computing the wrong values — a sign the pipeline's arithmetic or comparison is wrong.

If it failed on the second assertion (`nums[0] != 1`), it would mean one of the "non-mutating" functions is secretly writing back into its input slice, breaking the exact guarantee the theory note draws from JavaScript's `map`/`filter`.

### `TestCartTotal`

**What it proves:** `CartTotal`, built on `Reduce`, correctly sums a list of cart items' prices — the Go equivalent of the theory note's `shoppingCart.reduce(...)` worked example.

| Input items (name → price, paise) | Expected total |
| --- | --- |
| js course → 2999, py course → 999, mobile dev course → 5999, data science course → 12999 | 22996 |

```go
func TestCartTotal(t *testing.T) {
	items := []CartItem{
		{Name: "js course", Price: 2999},
		{Name: "py course", Price: 999},
		{Name: "mobile dev course", Price: 5999},
		{Name: "data science course", Price: 12999},
	}
	if got := CartTotal(items); got != 22996 {
		t.Fatalf("got %d, want 22996", got)
	}
}
```

A failure here would mean `Reduce`'s accumulator logic is wrong, or `CartTotal`'s closure is reading the wrong field — in either case, a checkout total that silently doesn't match the sum of the line items.

### `TestReduceSum`

**What it proves:** `Reduce` works correctly on its own, independent of `CartTotal`, confirming the generic fold itself (not just its one call site) is correct.

| Input | Initial | Expected |
| --- | --- | --- |
| `[1, 2, 3]` | `0` | `6` |

```go
func TestReduceSum(t *testing.T) {
	if got := Reduce([]int{1, 2, 3}, 0, func(a, c int) int { return a + c }); got != 6 {
		t.Fatalf("got %d, want 6", got)
	}
}
```

A failure here would isolate the bug to `Reduce` itself, rather than to how `CartTotal` calls it — useful for narrowing down a regression quickly.

## Running it

```bash
$ go vet ./...
$ go test -race -v ./...
=== RUN   TestMapFilterChain
--- PASS: TestMapFilterChain (0.00s)
=== RUN   TestCartTotal
--- PASS: TestCartTotal (0.00s)
=== RUN   TestReduceSum
--- PASS: TestReduceSum (0.00s)
PASS
ok  	mapfilter	2.201s
```

**Measured:** Go 1.24.4, darwin/arm64, 2026-11-09. `go vet ./...` reported no issues (no output on success).

All three tests pass under the race detector, confirming no data race in the package even though none of these functions touch shared mutable state across goroutines — the race detector is run here as standard practice for every Go note in this vault, not because this package uses concurrency.

- Line 1 (`go vet`): no output means no suspicious constructs found — a vet warning would print before the test run.
- `=== RUN`/`--- PASS` lines: each test function ran and its assertions held.
- `ok  mapfilter  2.201s`: the whole package's test suite passed; the duration is dominated by the Go toolchain's race-detector instrumentation, not the (trivial) work the functions themselves do.

## Pitfalls in the code

- `Map`'s `make([]U, len(in))` pre-sizes the result — correct and fast here, but if `f` were allowed to skip or add elements (it isn't; this signature guarantees one output per input) this pattern would under- or over-allocate.
- `Filter`'s `make([]T, 0, len(in))` only *reserves* capacity for the worst case (every element passes); the actual length can be anywhere from `0` to `len(in)`, so always use `len(out)`, never assume it equals `len(in)`.
- `Reduce`'s accumulator type `A` is fully caller-controlled generic — nothing stops a caller from passing a mismatched `initial` and `f` that compiles but produces a meaningless result (e.g. reducing to a `string` with a numeric-looking initial value of `"0"` that's never parsed); Go's generics check type *shapes*, not semantic intent.
- None of these three functions are safe to call concurrently on the *same* input slice if another goroutine is mutating that slice at the same time — they don't mutate it themselves, but `range` over a slice another goroutine is appending to or resizing is a data race regardless of which function reads it.

## Exercises

1. **Change this:** add a `FilterMap[T, U any](in []T, f func(T) (U, bool)) []U` that combines `Map` and `Filter` into one pass (the `bool` says "keep this one"). Predict: would this remove one of the two intermediate allocations that `Map(...).Filter(...)` currently creates in the chain test? Verify by tracing through `TestMapFilterChain`'s own numbers with your new function.
2. **Change this:** rewrite `CartTotal` to use `float64` prices (dollars, not paise) and sum ten items each priced `0.1`. Predict the printed total before running it — then explain, from [[Number Representation and Text Encoding]], why it isn't exactly `1.0`.
3. **Change this:** write `Reduce` so that passing a `nil` slice for `in` behaves identically to passing an empty, non-nil slice. Predict whether the existing code already does this correctly (hint: what does Go's `for _, v := range nilSlice` do?) before you change anything.

## Links

- **Theory note:** [[JavaScript Objects, Arrays and Iteration]]
- **Compare with:** [[Arrays, Slices and Maps (with internals)]] (Go's non-generic, fixed-type slice internals)
