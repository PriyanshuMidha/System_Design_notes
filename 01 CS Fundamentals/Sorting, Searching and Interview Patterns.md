---
tags: [cs-fundamentals, algorithms, interview-prep]
level: intermediate
status: reviewed
prereqs: ["[[Arrays and Dynamic Arrays (Go Slices)]]", "[[Complexity Analysis - Big-O and Amortized Cost]]"]
related: ["[[Tries, Suffix Trees and Suffix Arrays]]", "[[Union-Find and Skip Lists]]", "[[Graphs and Graph Algorithms]]", "[[Heaps and Priority Queues]]"]
sources:
  - "Go standard library docs, package sort and package slices"
  - "Go source, cmd/compile and src/sort: pdqsort (pattern-defeating quicksort), introduced in Go 1.19"
  - "Orson Peters, pdqsort: Pattern-defeating Quicksort (2021)"
updated: 2026-11-07
---

# Sorting, Searching and Interview Patterns

> [!summary] TL;DR
> Sorting puts data in order so that searching, deduplication and range queries all get cheaper; Go's `slices.Sort` uses **pdqsort**, a hybrid algorithm that is fast in the average case but is not stable (equal elements can be reordered). Binary search finds a target in sorted data in `O(log n)`, and Go's `sort.Search` generalizes it to any monotonic yes/no predicate. On top of both sit the recurring interview patterns — two pointers, sliding window, prefix sums, BFS/DFS, backtracking, and dynamic programming — that turn brute-force `O(n²)` or `O(2ⁿ)` solutions into linear or polynomial ones.

> [!abstract] Core idea
> - Comparison sorts have a hard floor of `O(n log n)` comparisons; **stability** (equal elements keep their input order) is a property some algorithms give up for speed.
> - Go's `slices.Sort` is pdqsort — fast, but **not stable**; use `slices.SortStableFunc` / `sort.SliceStable` when order among equal elements matters.
> - Binary search needs sorted data and a monotonic condition; `sort.Search` finds the first index where that condition is true, which also solves "binary search on the answer" problems.
> - Most interview problems are one of a handful of patterns in disguise — recognizing the pattern is most of the work.
> - Classic mistake: reaching for a sort (`O(n log n)`) when a hash set or two pointers would solve the same problem in `O(n)`.

## 1. Why it exists

Say you're given 10 million unsorted log-timestamp records and asked "how many requests happened between 14:00 and 14:05?" Scanning linearly costs `O(n)` **per query**. Sort the records once — `O(n log n)`, done one time — and every later range query becomes two binary searches, `O(log n)` each. The one-time sorting cost pays for itself the moment you run more than a handful of queries.

Searching has the same shape: checking "is `x` present?" against an unsorted list of a million elements costs up to a million comparisons. Sorted, binary search needs at most `log₂(1,000,000) ≈ 20` comparisons — a difference that matters the instant the list is queried more than once.

Most coding-interview problems are really asking "do you recognize which of these well-known patterns applies here," because the patterns turn a naive `O(n²)` or `O(2ⁿ)` brute force into something that runs in time for the given constraints.

## 2. Mental model

Think of sorting as the one-time cost of **organizing a library** so that later, finding any book by title is a quick jump to a shelf instead of scanning every book. Binary search is "open the book at the middle; is what you want earlier or later? Repeat on the half that matters" — exactly how a reader finds a word in a paper dictionary, and why it needs the dictionary to already be alphabetized.

The interview patterns are mental shortcuts for recognizing shape: "two sorted things, converging from both ends" is two pointers; "a fixed- or variable-size window sliding across an array" is the sliding-window pattern; "I need many range sums fast" is prefix sums; "explore everything reachable, level by level" is BFS; "explore as deep as possible, then back out" is DFS or backtracking; "the answer to a big problem is built from the answers to smaller, overlapping versions of itself" is dynamic programming.

## 3. How it works

### Comparison sorts and stability

A **comparison sort** decides order only by comparing pairs of elements, and no comparison sort can do better than `O(n log n)` comparisons in the worst case — a result from a decision-tree argument (there are `n!` possible orderings, and each comparison provides at most one bit of information, so you need at least `log₂(n!) = O(n log n)` comparisons).

**Stability** means elements that compare equal keep their original relative order. It matters whenever you sort by one key but care about an earlier sort's order among ties — for example, sort a list of orders by customer, then (stably) by amount, and within a customer the orders stay time-ordered.

```mermaid
flowchart LR
    In["Input: (A,30) (B,20) (C,30) (D,20)"] --> Stable["Stable sort by second field:\n(B,20) (D,20) (A,30) (C,30)\nB before D, A before C: input order kept among ties"]
    In --> Unstable["Unstable sort by second field:\n(D,20) (B,20) (C,30) (A,30)\nties may be reordered — still correctly sorted, just not order-preserving"]
```

Go's `slices.Sort` and the older `sort.Sort`/`sort.Slice` all use **pdqsort** (pattern-defeating quicksort) — a hybrid of quicksort, heapsort and insertion sort that picks good pivots, falls back to heapsort to avoid quicksort's `O(n²)` worst case, and detects already-sorted or few-distinct-value patterns to go faster on them. `sort.Sort`/`sort.Slice` switched to pdqsort in Go 1.19; the `slices` package (and `slices.Sort` with it) was added later, in Go 1.21, using the same algorithm from its first release. It is fast but **not stable**. `slices.SortStableFunc` and `sort.SliceStable` (an `O(n log n)` stable merge-based sort) exist specifically for when stability matters.

### Binary search and `sort.Search`

Binary search works only on data where a yes/no condition is **monotonic** — all false values, then all true values (or vice versa), with no mixing. Each step halves the remaining range by checking the midpoint, giving `O(log n)` total steps.

```mermaid
flowchart TD
    S["lo=0, hi=len(nums)"] --> C{"lo < hi?"}
    C -- no --> Done["return lo\n(first index where condition is true)"]
    C -- yes --> M["mid = (lo+hi)/2"]
    M --> P{"condition(nums[mid])?"}
    P -- false --> MoveLo["lo = mid+1"] --> C
    P -- true --> MoveHi["hi = mid"] --> C
```

Go's `sort.Search(n, f)` is exactly this loop, generalized: it takes a length `n` and a predicate `f(i) bool` that must be false for some prefix and true for the rest, and returns the first index where `f` is true (or `n` if `f` is never true). This generalization is what lets the same function solve "find the first element `>= target`" **and** "binary search on the answer" problems — for example, "what's the smallest capacity that lets a ship carry all packages within `D` days?" — where the predicate is "does capacity `c` work?" instead of a simple comparison.

## 4. Worked example

### Whiteboard version

The bare binary-search loop, before reaching for `sort.Search`: find the first index whose value is `>= target`.

```go
func firstGE(nums []int, target int) int {
    lo, hi := 0, len(nums)
    for lo < hi {
        mid := (lo + hi) / 2
        if nums[mid] >= target {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}
```

`sort.Search` below is this exact loop wrapped around an arbitrary predicate, which is why it can express both plain binary search and "binary search on the answer."

**Representative output (Go 1.24, pdqsort via `slices.Sort`):**

```go
nums := []int{5, 2, 2, 8, 1}
slices.Sort(nums)
fmt.Println(nums) // [1 2 2 5 8] — correctly sorted; pdqsort gives no order guarantee among the two 2s
```

### Interview patterns, tested

A Go package with one tested function per pattern. It compiles and passes `go vet` and `go test -race` on Go 1.24.

**Two pointers** (converging from both ends of sorted data):

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

**Sliding window** (a window of elements slides across the array, updating incrementally instead of recomputing):

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

**Prefix sums** (precompute once, answer range-sum queries in O(1)):

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

**BFS and DFS** (explore a graph or grid level-by-level, or depth-first):

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

**Backtracking and DP** (explore-and-undo vs. build-from-smaller-subproblems):

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

**Measured:** the full test suite (`TestTwoSumSorted`, `TestMaxSubarraySum`, `TestPrefixSumsAndRangeSum`, `TestBinarySearchFirstGE`, `TestStableSortByAgeIsStable`, `TestNumIslands`, `TestShortestPathBFS`, `TestSubsets`, `TestCoinChangeMinCoins`) passes under `go test -race` (Go 1.24.4, darwin/arm64, 2026-11-06). `TestStableSortByAgeIsStable` confirms `sort.SliceStable` keeps equal-age people in input order; that test is the actual proof behind the stability claims above, not just an assertion.

## 5. Variants and comparison

| Pattern / algorithm | How it works | Use when | Cost |
| --- | --- | --- | --- |
| pdqsort (`slices.Sort`) | Hybrid quicksort/heapsort/insertion sort, pattern-aware | General-purpose sorting, order among equal elements doesn't matter | `O(n log n)` average and worst case, not stable |
| Stable sort (`sort.SliceStable`, `slices.SortStableFunc`) | Merge-based, preserves input order among equal elements | Sorting by one key after already sorting by another | `O(n log n)`, stable |
| Binary search (`sort.Search`) | Halve a monotonic search space each step | Sorted data, or any monotonic yes/no predicate ("binary search on the answer") | `O(log n)` |
| Two pointers | Two indices move toward each other or together | Sorted array, pair/triplet sum problems | `O(n)`, `O(1)` extra space |
| Sliding window | A window's bounds move across the array, updating incrementally | Contiguous subarray/substring problems with a size or sum condition | `O(n)` |
| Prefix sums | Precompute cumulative sums once | Many range-sum queries on a fixed array | `O(n)` precompute, `O(1)` per query |
| BFS | Explore level by level via a queue | Shortest path / fewest steps in an unweighted graph | `O(V+E)` |
| DFS | Explore as deep as possible, then back out | Connectivity, cycle detection, topological order | `O(V+E)` |
| Backtracking | Try a choice, recurse, undo, try the next choice | Enumerate all subsets/permutations/valid configurations | Often exponential, pruned in practice |
| Dynamic programming | Build the answer from overlapping smaller subproblems, memoized or bottom-up | Optimal substructure + overlapping subproblems (counting, min/max, feasibility) | Typically polynomial, e.g. `O(amount × coins)` |

> [!warning] Interview trap
> "Just sort it" is sometimes the slow answer. If you only need "does a pair sum to `k`" over unsorted data, a hash set gets there in `O(n)`; sorting first costs `O(n log n)` for no benefit unless the problem also needs the data in order afterward.

## 6. Trade-offs and when not to use

- pdqsort's speed comes at the cost of stability — never assume `slices.Sort` preserves tie order; if a test or a user-visible ordering depends on it, that's a bug waiting to happen.
- Binary search requires the data to already be sorted (or the predicate to already be monotonic); sorting first costs `O(n log n)`, which can erase the benefit if you only search once.
- Backtracking's exponential worst case is only tamed by pruning (cutting a branch early once it can't possibly succeed); without pruning, it's too slow past small inputs.
- DP trades time for memory (the table of subproblem answers); for very large state spaces, memory becomes the real bottleneck, and techniques like rolling arrays (keeping only the last row or two) help.
- Two pointers and sliding window only work cleanly when the data has the right structure (sorted, or a window condition that changes monotonically as the window grows/shrinks) — forcing them onto data that doesn't fit usually produces a subtly wrong answer, not a slow one.

## 7. In production

- **Real systems:**
	- Database query planners choose a sort-merge join (sort both sides, then a two-pointer-style merge) versus a hash join depending on whether the inputs are already sorted or indexed — see [[Query Plans and EXPLAIN]].
	- Go's own standard library leans on `sort.Search` internally wherever a sorted slice needs a lookup — for example, `go/types` uses it to find a method by name in a sorted method set, and `debug/dwarf` and `debug/gosym` use it to search their sorted offset and program-counter tables.
	- Rate limiters and analytics pipelines use prefix-sum-style running totals (often as a sliding window over time buckets) to answer "requests in the last 5 minutes" without rescanning raw events.
	- BFS underlies shortest-path features in maps and networking tools (fewest hops, unweighted); DFS underlies dependency resolution and cycle detection in build systems (see the topological-sort note on [[Graphs and Graph Algorithms]]).
	- Scheduling and resource-allocation systems frequently reduce to DP (e.g., job scheduling to maximize profit under constraints) or backtracking with heavy pruning (constraint solvers).
- **Failure modes → fixes:**
	- Relying on `slices.Sort`'s output order for equal keys (it's pdqsort, unstable) → switch to `slices.SortStableFunc` or sort by a tiebreaker field explicitly.
	- A sliding window that forgets to shrink from the left when the condition is violated → re-derive the window invariant (what must hold true inside the window) before coding, not after a bug report.
	- Unmemoized recursive DP ("just recurse") blowing up exponentially on inputs that looked small in testing → add memoization or switch to the bottom-up tabulated form shown above.
- **What to monitor:**
	- Sort/search hot paths: whether an `O(n log n)` sort runs once and is reused, versus accidentally re-sorting on every request.
	- Backtracking/DP solvers used in request paths: wall-clock time or an iteration cap, since worst-case inputs can regress badly without a bound.

## 8. Deep dive

- **Why `O(n log n)` is a hard floor for comparison sorts.** There are `n!` possible orderings of `n` elements, and a decision tree where each internal node is one comparison (two outcomes) needs at least `log₂(n!)` levels to distinguish all `n!` outcomes. By Stirling's approximation, `log₂(n!) = Θ(n log n)`. Non-comparison sorts (counting sort, radix sort) can beat this floor only because they exploit structure in the keys (small integer range, fixed-width keys) instead of comparing elements pairwise.
- **How pdqsort avoids quicksort's `O(n²)` worst case.** Plain quicksort degrades to `O(n²)` on adversarial or already-sorted input with a naive pivot choice. pdqsort (the algorithm behind `sort.Sort`/`sort.Slice` since Go 1.19, and `slices.Sort` since the `slices` package's introduction in Go 1.21) picks pivots more carefully (median-of-three or median-of-medians on recursion), detects patterns like many equal elements or already-sorted runs and switches strategy, and falls back to heapsort entirely if it detects it's making bad progress (too many bad partitions) — guaranteeing `O(n log n)` worst case while staying fast on the common case. (Rust's standard library also ships a pdqsort-derived unstable sort; `verify:` whether any mainstream C++ `std::sort` implementation has adopted it, since GCC's libstdc++ and LLVM's libc++ have historically used introsort instead.)
- **"Binary search on the answer."** Many optimization problems ("minimum X such that condition holds") are solvable by binary searching over the space of possible answers rather than the input data, as long as the condition is monotonic in the candidate answer. `sort.Search`'s generalized signature (`func(i int) bool`) is built exactly for this: pass a predicate over candidate answers, not over array indices.
- **DP state design is the real skill.** The hard part of dynamic programming is rarely the transition (`dp[a] = min(dp[a], dp[a-c]+1)`) — it's identifying what the state needs to capture so that the "optimal substructure" property holds (the optimal answer to a subproblem can be built purely from optimal answers to smaller subproblems, without needing to know how you got there). Getting the state definition wrong is the most common reason a DP solution produces a wrong answer that still "looks" like DP.
- **Backtracking vs DP on the same problem.** Both explore a space of choices, but backtracking enumerates all valid configurations (and prunes dead branches), while DP collapses overlapping subproblems into a cache so the same sub-answer is never recomputed. A problem asking "how many ways" or "the minimum cost" is usually DP; a problem asking "list all valid configurations" is usually backtracking — recognizing which is being asked is often the actual interview signal.

## 9. Interview questions

> [!question]- Is Go's `slices.Sort` stable? What do you use if you need stability?
> No — `slices.Sort` is pdqsort (the `sort` package switched to pdqsort in Go 1.19; `slices.Sort` has used it since the `slices` package arrived in Go 1.21), which does not preserve the relative order of equal elements. Use `slices.SortStableFunc` or the older `sort.SliceStable` when tie order matters, at the same `O(n log n)` cost.

> [!question]- Implement binary search, then generalize it to `sort.Search`.
> A loop with `lo, hi := 0, len(nums)`, moving `hi = mid` when the condition at `mid` is true and `lo = mid+1` otherwise, terminating when `lo == hi`. `sort.Search(n, f)` is this same loop with `f(i) bool` in place of a direct comparison, which is why it also solves "binary search on the answer" problems where the predicate is "does this candidate answer work?"

> [!question]- Two sorted arrays; find if any pair (one from each) sums to a target. What pattern, and what's the cost?
> Two pointers: one pointer at the start of the first array, one at the end of the second; move the one whose sum is too small forward, or the one too large backward. `O(n + m)` time, `O(1)` extra space — far better than a nested loop's `O(n·m)`.

> [!question]- When would you reach for prefix sums instead of just summing a range each time?
> When there are many range-sum queries on a fixed (non-mutating) array. Precomputing prefix sums costs `O(n)` once, then each query is `O(1)`; without it, each query costs `O(range length)`, which adds up badly across many queries.

> [!question]- What's the difference between BFS and DFS for finding a path, and when does the choice matter?
> BFS explores level by level and is guaranteed to find the shortest path (fewest edges) in an unweighted graph first, because it visits nodes in increasing distance order. DFS explores as deep as possible before backtracking and does not give a shortest-path guarantee, but uses less memory in graphs that are wide but not deep, and is the natural fit for problems like cycle detection or topological sort where "shortest" isn't the question.

> [!question]- Trap: you need the k-th smallest element in an unsorted array. Is sorting the whole array the best approach?
> It works (`O(n log n)`), but it's not optimal: a selection algorithm (Quickselect) finds the k-th smallest in `O(n)` average time by partitioning like quicksort but recursing into only the side that contains the target rank, discarding the other side entirely instead of sorting it. Mention Quickselect as the faster answer, while noting `sort.Search`-style approaches don't apply here since the array isn't sorted yet.

> [!question]- Given a recursive solution that's correct but too slow, how do you tell if memoization will help?
> Check whether the same subproblem (the same arguments) is computed more than once across the recursion tree — if so, it's exhibiting overlapping subproblems, and memoization (caching results keyed by the arguments) turns the exponential blowup into one computation per distinct subproblem. If subproblems never repeat, memoization won't help and the exponential cost is likely inherent (e.g., enumerating all subsets).

## 10. Cheat sheet

- Comparison sorts have a hard floor of `O(n log n)`; `slices.Sort` (pdqsort — in `sort` since Go 1.19, in `slices` since Go 1.21) hits it but is not stable — use `SortStableFunc`/`SliceStable` when ties must keep their order.
- Binary search needs sorted data or a monotonic predicate; `sort.Search(n, f)` generalizes it, including "binary search on the answer."
- Two pointers: `O(n)` on sorted or paired data, converging from both ends.
- Sliding window: `O(n)`, incrementally update a window instead of recomputing it.
- Prefix sums: `O(n)` precompute, `O(1)` per range-sum query.
- BFS = shortest path in unweighted graphs, level by level; DFS = explore deep then backtrack, used for connectivity/cycles/ordering.
- Backtracking enumerates and prunes; DP caches overlapping subproblems — "how many ways / min cost" usually means DP, "list all configurations" usually means backtracking.
- "Just sort it" isn't always right: check if a hash set or two pointers solves the same problem in `O(n)`.

## Links

- **Before this:** [[Arrays and Dynamic Arrays (Go Slices)]], [[Complexity Analysis - Big-O and Amortized Cost]]
- **Next:** [[Tries, Suffix Trees and Suffix Arrays]], [[Union-Find and Skip Lists]]
- **Compare with:** [[Graphs and Graph Algorithms]] (BFS/DFS in full graph context), [[Heaps and Priority Queues]] (top-K and k-way merge patterns built on a heap instead of a sort)
