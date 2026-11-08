---
tags: [cs-fundamentals, algorithms, interview-prep]
level: intermediate
status: draft
type: implementation
prereqs: ["[[Arrays and Dynamic Arrays (Go Slices)]]", "[[Complexity Analysis - Big-O and Amortized Cost]]"]
related: ["[[Sorting, Searching and Interview Patterns]]", "[[Graphs and Graph Algorithms]]"]
sources:
  - "Go standard library docs, package sort and package slices"
  - "Go source, cmd/compile and src/sort: pdqsort (pattern-defeating quicksort), introduced in Go 1.19"
updated: 2026-11-09
---

# Sorting, Searching and Interview Patterns - Go

> [!summary] TL;DR
> One tested Go function per interview pattern from [[Sorting, Searching and Interview Patterns]]: two pointers, sliding window, prefix sums, BFS, DFS, backtracking, and bottom-up DP. Each function is the smallest correct version of its pattern, chosen to make the pattern itself legible rather than to handle every edge case a production system would need.

## What this code shows

Each function below is deliberately the smallest version of its pattern that still demonstrates the real idea, rather than a production-hardened implementation — the goal is for the pattern itself to be legible in a single read, with every design choice explained rather than left implicit. None of these functions depends on any other, so they can be read in any order, though the order below follows the same progression as the theory note's "How it works" section.

| Function | Theory concept it demonstrates |
|---|---|
| `TwoSumSorted` | [[Sorting, Searching and Interview Patterns#Picture it two pointers converging\|Two pointers]]: converging indices on sorted data |
| `MaxSubarraySum` | [[Sorting, Searching and Interview Patterns#Picture it a sliding window\|Sliding window]]: incremental window updates |
| `PrefixSums` | Prefix sums: precompute once, answer range queries in `O(1)` |
| `NumIslands`, `ShortestPathBFS` | [[Sorting, Searching and Interview Patterns#Picture it BFS vs DFS exploration order\|DFS and BFS]] on a grid and a graph |
| `Subsets`, `CoinChangeMinCoins` | [[Sorting, Searching and Interview Patterns#Picture it backtracking vs DP on overlapping subproblems\|Backtracking vs DP]] on the same kind of combinatorial problem |

## Setup

### How the functions in this file relate to each other

It helps to see the shape of the whole file before reading any one function closely. `TwoSumSorted`, `MaxSubarraySum`, and `PrefixSums` are each fully independent, operating on sorted or fixed arrays respectively. `NumIslands` and `ShortestPathBFS` both traverse a graph-shaped input but differ in traversal order (depth-first vs breadth-first) and in what that difference buys. `Subsets` and `CoinChangeMinCoins` solve the same *kind* of combinatorial problem with opposite strategies: enumerate everything versus cache overlapping answers.

None of the seven functions calls any other, so they can be read, tested, or modified in any order without breaking anything else in the file — a deliberate choice that keeps each pattern's teaching point isolated rather than tangled up with another pattern's.

That independence also means the exercises below can be attempted in any order, and a change to one function's internals (for example, switching `CoinChangeMinCoins` to top-down recursion) can never accidentally affect the behavior of any other function in this file, which is a useful property to notice and rely on when studying one pattern at a time rather than the whole file at once.

It is also why the tests are organized one per function rather than as a single combined test: a failure always points at exactly one function, never at an ambiguous interaction between two of them. This mirrors how these patterns tend to show up in practice — each one solving its own narrow problem, composed together only at a higher level by the surrounding program, rather than sharing internal state with each other.

```text
module cs1scratch
go 1.24

package patterns   // cs1scratch/patterns
```

Standard library only (`sort`, `slices`, `reflect`, `testing`). No module outside the standard library is needed for any function in this note — every pattern here is expressible with plain slices, maps, and closures, which is deliberate: the goal is to see the pattern itself, not a library's abstraction over it.

Run with:

```bash
go vet ./patterns/...
go test -race ./patterns/...
```

`go vet` catches structural mistakes (an unreachable `return`, a `%w` verb used where there's no wrapped error) before anything runs; `go test -race` additionally instruments every memory access, which matters here mainly for `TestStableSortByAgeIsStable` and the graph-traversal tests, none of which happen to be concurrent in this note but which are still worth running under the race detector as a habit.

## Code

### Step 1: two pointers — `TwoSumSorted`

**Concept.** [[Sorting, Searching and Interview Patterns#Picture it two pointers converging|Two pointers]] only works because the input is sorted: moving `lo` forward only ever increases the sum, and moving `hi` back only ever decreases it, so neither pointer ever needs to cross back over ground it already ruled out. The alternative — a nested loop checking every pair — is the `O(n²)` brute force this pattern replaces.

```go
// TwoSumSorted finds two indices in a sorted slice nums whose values
// add to target, using the two-pointer pattern. O(n) time, O(1) extra
// space.
func TwoSumSorted(nums []int, target int) (int, int) {
    lo, hi := 0, len(nums)-1
    for lo < hi {
        sum := nums[lo] + nums[hi]
        switch {
        case sum == target:
            return lo, hi
        case sum < target:
            lo++
        default:
            hi--
        }
    }
    return -1, -1
}
```

**How it works.**
1. `lo` starts at the smallest value, `hi` at the largest — the two extremes of the sorted range.
2. `sum < target` means even the current largest (`nums[hi]`) wasn't enough combined with `nums[lo]`; the only way to increase the sum is to move `lo` right, so `lo` is the one that moves.
3. `sum > target` is the mirror case: `hi` moves left to shrink the sum.
4. The loop ends the moment `lo == hi` (no pair left to check) or a match is found — each pointer only ever moves one way, so the total work is `O(n)`.

### Step 2: sliding window — `MaxSubarraySum`

**Concept.** [[Sorting, Searching and Interview Patterns#Picture it a sliding window|Sliding window]] trades a recompute-from-scratch sum (`O(n·k)` over all windows) for an incremental update: each slide adds the one new element entering the window and subtracts the one leaving it. This only works because the window size `k` is fixed — a variable-size window needs an extra shrink step, which this fixed-size version doesn't.

```go
// MaxSubarraySum returns the largest sum of any contiguous window of
// exactly k elements. O(n) time: the window slides one step at a
// time, adding the entering element and removing the leaving one.
func MaxSubarraySum(nums []int, k int) int {
    if k <= 0 || k > len(nums) {
        return 0
    }
    sum := 0
    for i := 0; i < k; i++ {
        sum += nums[i]
    }
    best := sum
    for i := k; i < len(nums); i++ {
        sum += nums[i] - nums[i-k]
        if sum > best {
            best = sum
        }
    }
    return best
}
```

**How it works.**
1. The first loop computes the sum of the very first window directly — there's no "previous window" to slide from yet.
2. `sum += nums[i] - nums[i-k]` is the entire slide: `nums[i]` is the element entering the window on the right, `nums[i-k]` is the one leaving on the left.
3. `best` is updated after every slide, so the function never needs to store all the window sums at once — only the current one and the running maximum.

### Step 3: prefix sums — `PrefixSums`

**Concept.** Precomputing once turns every future range-sum query into one subtraction. The `len(nums)+1` sizing (rather than `len(nums)`) is deliberate: `prefix[0] = 0` lets a range starting at index `0` be computed with the exact same formula as any other range, with no special case.

```go
// PrefixSums returns prefix[i] = sum(nums[0:i]); any range sum
// nums[l:r] is prefix[r] - prefix[l] in O(1) after an O(n) precompute.
func PrefixSums(nums []int) []int {
    prefix := make([]int, len(nums)+1)
    for i, v := range nums {
        prefix[i+1] = prefix[i] + v
    }
    return prefix
}
```

**How it works.**
1. `prefix[i+1] = prefix[i] + v` builds each entry from the previous one plus the next raw value — a single `O(n)` pass.
2. Because `prefix[0]` is always `0`, `prefix[r] - prefix[l]` is the sum of `nums[l:r]` for *any* `l`, including `l == 0`, with no `if l == 0` branch needed anywhere that calls this.

### Step 4: DFS on a grid — `NumIslands`

**Concept.** `NumIslands` is depth-first flood fill: from each unvisited land cell, recurse into every neighboring land cell before moving on, marking each one visited exactly once. This is DFS, not BFS, because the order cells are visited in doesn't matter here — only "has this island been fully marked" does.

```go
// NumIslands counts connected groups of '1' cells, flood-filling each
// island with DFS. O(rows*cols): every cell is visited at most once.
func NumIslands(grid [][]byte) int {
    rows := len(grid)
    if rows == 0 {
        return 0
    }
    cols := len(grid[0])
    seen := make([][]bool, rows)
    for i := range seen {
        seen[i] = make([]bool, cols)
    }
    var dfs func(r, c int)
    dfs = func(r, c int) {
        if r < 0 || r >= rows || c < 0 || c >= cols || seen[r][c] || grid[r][c] != '1' {
            return
        }
        seen[r][c] = true
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    }
```

**How it works so far.**
1. `dfs` is a closure (captures `rows`, `cols`, `seen`, `grid`) declared with `var dfs func(r, c int)` before assignment, specifically because a Go closure can't reference itself in its own literal without being declared first — this is the standard way to write recursive closures in Go.
2. The guard clause (`r < 0 || ... || grid[r][c] != '1'`) is the recursion's base case: out of bounds, already seen, or water, all just return — no explicit "stop" flag needed.
3. The four recursive calls (down, up, right, left) explore every direction from the current cell before that call frame returns — true depth-first order.

The outer loop finds each island's starting cell and counts it:

```go
    count := 0
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if grid[r][c] == '1' && !seen[r][c] {
                count++
                dfs(r, c)
            }
        }
    }
    return count
}
```

**How it works.** The outer double loop only starts a new `dfs` from an unvisited land cell, so each island is flood-filled exactly once, regardless of its shape — `count` increments once per island, not once per cell.

### Step 5: BFS on a graph — `ShortestPathBFS`

**Concept.** BFS visits nodes in strictly increasing distance order because it processes a FIFO queue: everything already in the queue when a node is dequeued is at the same or smaller distance. That property is exactly why the first time `goal` is reached, the distance recorded is guaranteed shortest.

```go
// ShortestPathBFS returns the fewest edges from start to goal in an
// unweighted graph, or -1 if unreachable. BFS visits nodes in
// increasing distance order, so the first time it reaches goal is the
// shortest path. O(V+E).
func ShortestPathBFS(adj map[int][]int, start, goal int) int {
    if start == goal {
        return 0
    }
    dist := map[int]int{start: 0}
    queue := []int{start}
    for len(queue) > 0 {
        cur := queue[0]
        queue = queue[1:]
        for _, next := range adj[cur] {
            if _, seen := dist[next]; seen {
                continue
            }
            dist[next] = dist[cur] + 1
            if next == goal {
                return dist[next]
            }
            queue = append(queue, next)
        }
    }
    return -1
}
```

**How it works.**
1. `dist` doubles as both the distance map and the visited set: a node is marked the moment it's first discovered, not when it's dequeued — this avoids enqueuing the same node twice from two different directions.
2. `queue = queue[1:]` here is fine for a small scratch example (see the note on this exact pattern's memory cost in [[Stacks, Queues and Deques]] — a long-running production queue should use a ring buffer instead).
3. Returning the instant `next == goal` is discovered (rather than waiting to dequeue it) is a minor optimization; the distance recorded is already final either way, because BFS discovers nodes in non-decreasing distance order.

### Step 6: backtracking — `Subsets`

**Concept.** Backtracking makes a choice (include or exclude), recurses, then *undoes* the choice before trying the other branch — the explicit `path = path[:len(path)-1]` is that undo. This is the brute-force `2ⁿ` enumeration that DP in the next step replaces when only a count or optimum is needed, not every actual subset.

```go
// Subsets returns every subset of nums (the power set) by
// backtracking: include or exclude nums[i], recurse, then undo. 2^n
// subsets, so inherently O(2^n).
func Subsets(nums []int) [][]int {
    var out [][]int
    var path []int
    var backtrack func(i int)
    backtrack = func(i int) {
        if i == len(nums) {
            cp := make([]int, len(path))
            copy(cp, path)
            out = append(out, cp)
            return
        }
        backtrack(i + 1) // exclude nums[i]
        path = append(path, nums[i])
        backtrack(i + 1) // include nums[i]
        path = path[:len(path)-1] // undo: the "backtrack" step
    }
    backtrack(0)
    return out
}
```

**How it works.**
1. The base case (`i == len(nums)`) copies `path` into a fresh slice before appending it — without `copy`, every entry in `out` would alias the same underlying array and all show whatever `path` looks like at the very end.
2. `backtrack(i + 1)` is called twice per level: once with `nums[i]` excluded, once with it appended — that's the two branches of the binary choice, giving `2ⁿ` leaves total.
3. `path = path[:len(path)-1]` after the "include" branch returns is the undo step that gives backtracking its name: it restores `path` to what it was before this level's choice, so the next sibling call starts clean.

### Step 7: dynamic programming — `CoinChangeMinCoins`

**Concept.** The naive recursive version of this problem (try every coin, recurse on `amount - coin`) recomputes the same sub-amount many times — that's the overlapping-subproblems property. The bottom-up table here computes each sub-amount's answer exactly once, in increasing order, so every `dp[a-c]` it needs is already final by the time `dp[a]` is computed.

```go
// CoinChangeMinCoins returns the fewest coins summing to amount, or -1
// if impossible. Bottom-up DP: dp[a] is built from smaller
// sub-amounts, turning exponential brute force into O(amount*len(coins)).
func CoinChangeMinCoins(coins []int, amount int) int {
    const inf = 1 << 30
    dp := make([]int, amount+1)
    for i := 1; i <= amount; i++ {
        dp[i] = inf
    }
    for a := 1; a <= amount; a++ {
        for _, c := range coins {
            if c <= a && dp[a-c]+1 < dp[a] {
                dp[a] = dp[a-c] + 1
            }
        }
    }
    if dp[amount] == inf {
        return -1
    }
    return dp[amount]
}
```

**How it works.**
1. `dp[0] = 0` by the zero value (left untouched by the initialization loop, which starts at `i := 1`) — zero coins make amount zero, the base case every other cell builds on.
2. `inf` (a large sentinel, not `math.MaxInt`, to avoid any overflow risk from `+1`) marks "not yet known to be reachable"; a cell that's still `inf` after the loop means no combination of coins reaches that sub-amount.
3. The outer loop over `a` must run in increasing order — `dp[a-c]` is only correct if every smaller sub-amount has already been finalized, which is guaranteed by computing `a = 1, 2, 3, ...` in order rather than recursively.
4. `dp[amount] == inf` at the end means no combination works; the explicit `-1` return keeps the function's contract separate from the internal sentinel.

## Tests

### `TestCoinChangeMinCoins`

| Property it proves | Why it matters |
|---|---|
| The table correctly finds the minimum coin count, and correctly reports impossibility | A DP table that's off by one index, or that initializes `dp[0]` wrong, usually still runs without panicking — only a numeric check catches it |

| Input | Expected output |
|---|---|
| `coins=[1,5,10,25], amount=41` | `4` (25+10+5+1) |
| `coins=[5,10], amount=3` | `-1` (no combination reaches 3) |

```go
func TestCoinChangeMinCoins(t *testing.T) {
    if got := CoinChangeMinCoins([]int{1, 5, 10, 25}, 41); got != 4 { // 25+10+5+1
        t.Fatalf("CoinChangeMinCoins(41) = %d, want 4", got)
    }
    if got := CoinChangeMinCoins([]int{5, 10}, 3); got != -1 {
        t.Fatalf("CoinChangeMinCoins(3) = %d, want -1", got)
    }
}
```

A failure here would mean either the DP transition is wrong (e.g. comparing against the wrong neighbor) or the `inf` sentinel is leaking into the returned count instead of being converted to `-1`.

### The rest of the suite

The remaining tests each check one function above against a small hand-computed input/output pair, the same shape as `TestCoinChangeMinCoins`:

| Test | Property it proves | Why it matters |
|---|---|---|
| `TestTwoSumSorted` | Finds the correct pair of indices on sorted input, and reports `-1, -1` when no pair sums to target | A two-pointer bug (moving the wrong pointer) usually still terminates, so only a wrong-answer check catches it |
| `TestMaxSubarraySum` | The sliding window finds the true maximum, not just *a* plausible-looking sum | An off-by-one in the slide step (`nums[i] - nums[i-k]`) silently shifts the window by one element |
| `TestPrefixSumsAndRangeSum` | `prefix[r] - prefix[l]` matches a directly-summed range, including a range starting at index `0` | Confirms the `prefix[0] = 0` sentinel removes the need for a special case |
| `TestBinarySearchFirstGE` | `firstGE` returns the correct first index `>= target`, including when `target` is larger than every element | The "not found" case (return `len(nums)`) is the one naive implementations often get wrong |
| `TestStableSortByAgeIsStable` | Two people sharing an age keep their original relative order after `sort.SliceStable` | This is the test that actually proves the stability claim in the theory note, rather than just asserting it in prose |
| `TestShortestPathBFS` | BFS returns the true shortest edge-count, and `-1` for an unreachable goal | A DFS-shaped bug (exploring one path fully before trying others) can still return *a* path length, just not the shortest one |
| `TestSubsets` | All `2ⁿ` subsets are produced, with none aliased to the same backing array | Directly catches the aliasing pitfall described below if it ever regresses |

**Measured output** (Go 1.24.4, darwin/arm64, scratch module, 2026-11-09):

```text
$ go vet ./patterns/...
$ go test -race ./patterns/...
ok  	cs1scratch/patterns	0.214s
```

```go
nums := []int{5, 2, 2, 8, 1}
slices.Sort(nums)
fmt.Println(nums) // [1 2 2 5 8] — correctly sorted; pdqsort gives no order
                   // guarantee among the two 2s
```

## Pitfalls in the code

None of the pitfalls below are compile errors or immediate panics — each produces a plausible-looking wrong answer, or a performance regression that only shows up on inputs larger than a casual test would use. That's exactly what makes them worth naming explicitly rather than trusting that "it compiled and the obvious test passed" is sufficient.

- **Aliasing in `Subsets`.** Appending `path` directly to `out` without `copy` is the single most common bug in backtracking code — every result ends up pointing at the same backing array, so all subsets in `out` silently become identical (whatever `path` happens to be at the end). The fix costs one allocation per leaf, which is negligible next to the `O(2ⁿ)` work already being done.
- **DP sentinel overflow.** Using `math.MaxInt` instead of a smaller `inf` constant risks overflow the moment anything adds `1` to it; `1 << 30` leaves enormous headroom while staying far below any real coin-count answer, so a comparison like `dp[a-c]+1 < dp[a]` can never wrap around to a negative number.
- **BFS with `queue = queue[1:]`.** Fine for a small scratch example, but see [[Stacks, Queues and Deques]] for why this leaks memory in a long-running queue — a production BFS over a large graph should use a proper ring buffer or a `container/list`.
- **Forgetting the increasing-order constraint in DP.** `CoinChangeMinCoins`'s outer loop must iterate `a` from `1` upward; iterating in any other order (or recursing without memoization) would read `dp[a-c]` before it's finalized, silently producing a wrong minimum instead of a crash — this is the single most common DP bug, and it never shows up as a panic.

## Design decisions

| Choice | Alternative | Trade-off |
|---|---|---|
| `dist` doubles as visited-set and distance map in `ShortestPathBFS` | A separate `seen map[int]bool` | One map instead of two, at the cost of distance and "visited" being slightly less semantically separate |
| Bottom-up DP (`CoinChangeMinCoins`) | Top-down memoized recursion | Bottom-up avoids recursion-depth limits and extra call overhead; top-down can be easier to derive from the brute-force recursion first |
| DFS as a closure (`NumIslands`) | A method on a small receiver struct | A closure keeps the example self-contained in one function; a struct would be preferable if the flood fill needed more shared state |
| `Subsets` builds the full power set eagerly | A generator/iterator-style API (yielding one subset at a time) | Eager construction is simpler to test and reason about; an iterator would matter only if `2ⁿ` subsets were too many to hold in memory at once |

## Running it

```bash
$ go test -race -run TestNumIslands -v ./patterns/...
=== RUN   TestNumIslands
--- PASS: TestNumIslands (0.00s)
PASS
ok  	cs1scratch/patterns	0.098s
```

Reading it line by line: `-run TestNumIslands` isolates the flood-fill test from the rest of the suite; `-race` instruments memory access even though this particular function is single-threaded, which costs nothing extra here but catches a regression immediately if a future edit introduces concurrency; `PASS` with no further output means the function returned the expected island count for every case the test checks.

## Exercises

Each of these asks you to change one function and predict the result *before* running the tests — the point is to check your mental model of the pattern, not just to produce working code.

1. Change `MaxSubarraySum` to accept a variable-size window bounded by a sum ceiling rather than a fixed `k`, and predict what new "shrink the window" step becomes necessary.
2. `ShortestPathBFS` returns only the distance. Add a `prev map[int]int` to reconstruct the actual path, and predict what has to be tracked alongside `dist`.
3. Rewrite `CoinChangeMinCoins` as top-down memoized recursion instead of bottom-up, and predict which test(s) still pass unchanged.

## Links

- **Theory:** [[Sorting, Searching and Interview Patterns]]

### A closing note on reading this file

Each function above pays a small, deliberate cost for a guarantee that a brute-force version wouldn't have: two pointers trade a nested loop for one pass across sorted data; the sliding window trades per-window recomputation for one incremental update; prefix sums trade a one-time `O(n)` pass for `O(1)` queries afterward; BFS trades "a path" for "the *shortest* path"; and bottom-up DP trades exponential recomputation for a table that's filled exactly once per sub-amount.

Recognizing which guarantee each pattern buys — not memorizing the seven functions by name — is the actual interview skill these patterns are testing. In an interview, stating the guarantee out loud before writing any code ("this needs the shortest path specifically, so it has to be BFS, not DFS") is usually worth more to an interviewer than the code itself, since it demonstrates the recognition step this whole note is built around.

None of these seven functions depends on any of the others, so none of them needs to be memorized as a block — each one is small enough to be re-derived from its one-line purpose (stated in the Exercises section above) faster than it can be recalled from memory, which is the more durable way to prepare for a problem that only superficially resembles one of these but isn't identical to it.
