---
tags: [cs-fundamentals, data-structures, graphs, algorithms]
level: intermediate
status: reviewed
prereqs: ["[[Heaps and Priority Queues]]", "[[Stacks, Queues and Deques]]", "[[Hash Tables and Go Maps]]"]
related: ["[[Union-Find and Skip Lists]]", "[[Runtime - Goroutine Scheduler (GMP)]]", "[[Load Balancing]]", "[[Graphs and Graph Algorithms - Go]]"]
sources:
  - "Cormen, Leiserson, Rivest, Stein, Introduction to Algorithms (3rd ed.), ch. 22–24"
  - "Go standard library docs, container/heap"
updated: 2026-11-13
---

# Graphs and Graph Algorithms

> [!summary] TL;DR
> A graph is a set of **vertices** (nodes) connected by **edges**, used whenever data is naturally a network of relationships rather than a hierarchy — social connections, road networks, service dependencies, build order. BFS and DFS explore a graph in O(V+E); Dijkstra finds shortest paths with non-negative weights; topological sort orders a dependency graph; union-find groups vertices into connected components.

> [!abstract] Core idea
> - A graph is **vertices + edges**; edges can be directed or undirected, weighted or unweighted.
> - **BFS** explores level by level (shortest path by edge count); **DFS** explores depth-first (good for cycle detection, topological order).
> - **Dijkstra** finds shortest weighted paths using a min-heap frontier, same shape as [[Heaps and Priority Queues]].
> - **Topological sort** only exists for a DAG (directed, acyclic graph) — if there's a cycle, there's no valid order.

## Start here: the basics

**The problem in one story**

You want to drive from home to a friend's house across town.
There are many streets, some one-way, each taking a different number of minutes.
Some routes loop back to where you started.
You need a reliable recipe to find the fastest way, not just a guess.
That "places joined by connections" picture is a graph.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Vertex (node) | One point or place | A street corner |
| Edge | A link between two vertices | The street joining two corners |
| Directed | Edges go one way only | A one-way street |
| Weight | A number on an edge (cost, time, distance) | "This street takes 4 minutes" |
| Queue | First in, first out line | People waiting at a ticket counter |
| Stack | Last in, first out pile | A pile of plates |
| Heap (min-heap) | Structure that always hands back the smallest item fast | "Give me the closest unvisited corner" |
| `O(V+E)` | Work grows with number of vertices plus edges | 10 corners + 20 streets ≈ 30 steps |

**Picture it**

```mermaid
flowchart LR
    Home((Home)) -- 5 min --> Park((Park))
    Home -- 2 min --> Shop((Shop))
    Shop -- 1 min --> Park
    Park -- 3 min --> Friend((Friend))
```

Fastest route: Home → Shop → Park → Friend (2 + 1 + 3 = 6 minutes), beating Home → Park → Friend (8 minutes).

**Analogy**

A graph is like a city map: corners are vertices, streets are edges, and travel times are weights.
Where it breaks: real traffic changes every minute, but graph algorithms assume the map stays fixed while they run.

**How the rest of this note builds up**

- First, why graphs exist and the mental model (sections 1-2).
- Then the vocabulary and ways to store a graph in memory (adjacency list vs. matrix).
- Then the core walks: BFS, DFS, cycle detection, topological sort.
- Then weighted problems: Dijkstra, union-find and Kruskal's MST.
- Finally the SDE-3 deep dive: why Dijkstra needs non-negative weights, union-find's `α(n)` cost, production uses and interview questions.

> [!tip] Remember
> Graph = things (vertices) + connections (edges); every algorithm here is just a disciplined way to walk them.

## 1. Why it exists

Say you're building a package manager: package A depends on B and C, B depends on D, and you need to install everything in an order where every dependency comes before the package that needs it.

Or you're building a road-routing service: given a map of intersections and road segments with drive times, find the fastest route between two points.

Neither problem is a hierarchy (a tree) — a package can be depended on by many others, and a road network has cycles (you can get back to where you started).

Both are graphs, and both have a standard, well-understood algorithm: topological sort for the first, Dijkstra's algorithm for the second.

> [!tip] Remember
> A tree is a special case of a graph (no cycles, exactly one path between any two vertices). Reach for graph algorithms the moment "depended on by many" or "can get back to where you started" is true of your data.

## 2. Mental model

A graph is a map of "what connects to what."

Picture a subway map: stations are vertices, the lines between them are edges. If the lines have direction (one-way streets), it's a **directed** graph; if they have travel times, it's **weighted**.

Most of this note is "how do you walk this map systematically" (BFS/DFS) and "how do you walk it to answer a specific question" (shortest path, dependency order, is there a cycle).

**Where the subway analogy breaks down:** a real subway map's lines don't change while you're riding it; several of the algorithms below (Dijkstra, cycle detection) depend on the graph being fixed while they run, which a live, constantly-updating network (like actual traffic conditions) technically isn't.

Routing services handle this by re-running the algorithm on a fresh snapshot rather than mutating state mid-traversal.

## 3. How it works

### Terms

**In plain words:** five words cover almost every concept in this note; get comfortable with them before anything else.

| Term | Plain meaning |
| --- | --- |
| **Vertex** (node) | One point in the graph |
| **Edge** | A connection between two vertices |
| **Degree** | How many edges touch a vertex (in-degree/out-degree separately, for directed graphs) |
| **Path** | A sequence of edges connecting a sequence of vertices |
| **Cycle** | A path that returns to its starting vertex |
| **DAG** | A directed graph with no cycles — the shape dependency graphs must have |
| **Connected component** | A maximal set of vertices all reachable from each other (undirected graphs) |

### Representations

**In plain words:** a graph needs to answer "what does this vertex connect to?" — the three common representations trade off space against how fast that question is to answer.

| Representation | Space | Edge lookup `(u,v)` | Iterate u's neighbors | Use when |
|---|---|---|---|---|
| Adjacency list (`map[int][]Edge` or `[][]int`) | O(V+E) | O(degree(u)) | O(degree(u)) — optimal | Sparse graphs (most real graphs): default choice |
| Adjacency matrix (`[][]bool` or `[][]int` of weights) | O(V²) | O(1) | O(V) — wasteful if sparse | Dense graphs, or when O(1) edge lookup matters more than space |
| Edge list (`[]Edge{U, V, Weight}`) | O(E) | O(E) — slow | O(E) — slow | Algorithms that only need to process every edge once, e.g. Kruskal's MST |

**Picture it:**

```mermaid
flowchart LR
    subgraph g["A small weighted graph"]
        direction LR
        A((A)) -- 1 --> B((B))
        B -- 2 --> D((D))
        A -- 4 --> C((C))
        C -- 2 --> D
    end
    subgraph list["Adjacency list"]
        direction TB
        LA["A: [(B,1), (C,4)]"]
        LB["B: [(D,2)]"]
        LC["C: [(D,2)]"]
        LD["D: []"]
    end
```

**Example:** the graph above has 4 vertices and 4 edges, so its adjacency list uses `O(V+E) = O(8)` space; the equivalent matrix would reserve 16 cells (`4×4`), most of them unused `false`/zero entries.

**Why it matters:** in Go, this is naturally `map[int][]Edge` where `Edge{To int; Weight int}` — the hash table from [[Hash Tables and Go Maps]] doing the "which vertices exist, and what do they point to" bookkeeping. Default to an adjacency list unless the graph is genuinely dense.

### BFS: breadth-first search

**In plain words:** explore level by level using a **queue** — visit the start vertex, enqueue its neighbors, then repeatedly dequeue a vertex and enqueue any of *its* unvisited neighbors.

The first time you reach any vertex, you've reached it by the shortest path **in edge count** (not weight) — this only holds for unweighted graphs.

**Picture it:**

```mermaid
flowchart TD
    S0["queue: [0], visited: {0}"] --> S1["pop 0, visit; enqueue 1, 2<br/>queue: [1, 2]"]
    S1 --> S2["pop 1, visit; enqueue 3 (2's edge to 3 already covered)<br/>queue: [2, 3]"]
    S2 --> S3["pop 2, visit; 3 already enqueued<br/>queue: [3]"]
    S3 --> S4["pop 3, visit; no new neighbors<br/>queue: []"]
```

**Example:** starting BFS at vertex 0 on a graph where `0→{1,2}`, `1→{3}`, `2→{3}` visits in the order `0, 1, 2, 3` — vertex 3 is reached at "distance 2" (two edges from 0), regardless of which of 1 or 2 reaches it first.

**Why it matters:** cost is `O(V+E)` — every vertex enqueued once, every edge examined once — and the level-by-level order is exactly what guarantees "first visit = shortest edge count."

### DFS: depth-first search

**In plain words:** explore as deep as possible before backtracking, using a **stack** — either the call stack (recursive) or an explicit stack (iterative, avoiding Go's goroutine stack limits on very deep graphs).

**Why it matters:** DFS is the natural tool for cycle detection and topological sort because it naturally tracks "what's on the current path," which the next two subsections depend on directly.

### Cycle detection (directed graphs): three-color DFS

**In plain words:** mark every vertex **white** (unvisited), **gray** (on the current DFS path, not yet fully explored), or **black** (fully explored, including all its descendants).

A cycle exists exactly when DFS encounters an edge to a **gray** vertex — a "back edge" to something still on the current path, not merely something visited earlier in a different branch.

**Picture it:**

```mermaid
stateDiagram-v2
    [*] --> White: every vertex starts white
    White --> Gray: DFS visits it (on current path)
    Gray --> Black: DFS finishes exploring all its descendants
    Gray --> Gray: edge to another gray vertex = CYCLE (back edge)
    Black --> [*]
```

**Example:** DFS from vertex A reaches B (gray), then C (gray), then finds an edge `C → A`. A is still gray (it's an ancestor on the current path, not finished), so this is a cycle: `A → B → C → A`.

If instead the edge were `C → D` where D was already black (fully explored on a separate earlier branch), that's not a cycle — D is just a shared descendant.

**Why it matters:** "already visited" alone can't distinguish these two cases — only the three-color scheme can, which is exactly why directed cycle detection is conventionally taught with DFS rather than BFS (expanded in section 8).

> [!warning] Common mistake
> Treating any edge to an already-visited vertex as a cycle. An edge to a **black** vertex (fully explored, on a different branch) is completely normal in a DAG — only an edge to a **gray** vertex (still on the current path) is a cycle.

### Topological sort: Kahn's algorithm

**In plain words:** only defined for a DAG. Repeatedly remove any vertex with **in-degree 0** (no remaining unprocessed dependency), append it to the output order, and decrement the in-degree of everything it pointed to.

**Picture it:**

```mermaid
stateDiagram-v2
    [*] --> ComputeInDegrees
    ComputeInDegrees --> Queue0: enqueue all in-degree-0 vertices
    Queue0 --> Process: pop one, append to order
    Process --> Decrement: decrement each neighbor's in-degree
    Decrement --> Queue0: any neighbor now at 0? enqueue it
    Queue0 --> Done: queue empty
    Done --> CheckCycle
    CheckCycle --> [*]: order.length == V → valid order
    CheckCycle --> [*]: order.length < V → cycle, no valid order
```

**Example:** packages `A→B`, `A→C`, `B→D`, `C→D` start with in-degrees `A:0, B:1, C:1, D:2`. Remove A (in-degree 0), decrement B and C to 0 each, remove both, decrement D twice to 0, remove D. Output: `A, B, C, D` (or `A, C, B, D` — either is valid).

**Why it matters:** if every vertex gets removed, the output is a valid topological order; if some vertices remain stuck with in-degree > 0, the graph has a cycle and no valid order exists — this is the mechanical cycle check Kahn's algorithm gives you for free, without a separate DFS pass.

### Dijkstra's algorithm: shortest paths with non-negative weights

**In plain words:** maintain a `dist` map (shortest known distance to each vertex) and a min-heap frontier keyed by distance — exactly the [[Heaps and Priority Queues]] mechanism.

Repeatedly pop the closest unvisited vertex, and for each of its edges, check if going through it gives a shorter path to the neighbor (**relaxation**); if so, update `dist` and push the neighbor.

**Picture it:**

```mermaid
sequenceDiagram
    participant H as Min-heap frontier
    participant D as dist map

    Note over D: dist = {0: 0}
    H->>H: pop (0, dist=0)
    H->>D: relax edges from 0: dist[1]=1, dist[2]=4
    H->>H: push (1, dist=1), (2, dist=4)
    H->>H: pop (1, dist=1) — smallest in heap
    H->>D: relax edge 1→3 (w2): dist[3]=3
    H->>H: push (3, dist=3)
    H->>H: pop (3, dist=3) — beats popping (2, dist=4) first
    H->>D: relax edge 3→ nothing cheaper for 2
    H->>H: pop (2, dist=4): dist[2] already final
```

**Example:** on the sample graph `0→1 (w1)`, `1→3 (w2)`, `0→2 (w4)`, `2→3 (w2)`, the path `0→1→3` (total weight 3) is found before the path `0→2→3` (total weight 6) is even finished relaxing.

The heap always pops the globally closest unvisited vertex next, which is why 3 ends up with the cheaper distance.

**Why it matters:** requires non-negative weights because the algorithm commits to a vertex's shortest distance once popped.

A later negative-weight edge could invalidate that commitment, which Bellman-Ford handles instead (at `O(VE)` instead of `O((V+E) log V)`), as section 8 proves in detail.

### Union-find and Kruskal's MST

**In plain words:** a **minimum spanning tree (MST)** connects every vertex with the cheapest possible total edge weight and no cycles.

**Kruskal's algorithm** sorts all edges by weight, then greedily adds each edge that connects two *different* components, skipping any edge that would close a cycle.

**Picture it:**

```mermaid
flowchart TD
    Sort["Sort all edges by weight ascending"] --> Pick["Take the next cheapest edge"]
    Pick --> Check{"Find(u) == Find(v)?<br/>(already same component?)"}
    Check -- "yes: would close a cycle" --> Skip["Skip this edge"]
    Check -- "no: different components" --> Add["Add edge to MST;<br/>Union(u, v)"]
    Skip --> More{"Edges left?"}
    Add --> More
    More -- yes --> Pick
    More -- "no" --> Done["MST complete:<br/>V-1 edges, no cycles"]
```

**Example:** on a 4-vertex graph with edges of weight 1, 2, 3, 4, 5 (sorted), Kruskal keeps the weight-1 edge, the weight-2 edge, skips the weight-4 edge if it would close a cycle, keeps the next valid edge, and stops once `V-1 = 3` edges are chosen.

**Why it matters:** that same-component check is exactly what **union-find** (disjoint-set union) answers in near-O(1):

- `Find(x)` returns x's component representative (with **path compression**, repointing every visited node straight at the root).
- `Union(x, y)` merges two components (attaching the shorter tree under the taller one, **union by rank**, to keep future `Find` calls fast).

The full analysis of path compression's amortized cost, and the related ordered-structure problem skip lists solve, live in [[Union-Find and Skip Lists]].

## 4. Worked example

### Whiteboard version

The bare mechanism — adjacency list plus BFS — needs only the shape of the two core types to picture the rest of this note:

```go
type Edge struct{ To, Weight int }
type Graph struct{ adj map[int][]Edge }
```

Every algorithm above (BFS, DFS, cycle detection, topological sort, Dijkstra, Kruskal's MST with union-find) is implemented and tested against the sample graph `0→1 (w1)`, `1→3 (w2)`, `0→2 (w4)`, `2→3 (w2)` in the runnable version: [[Graphs and Graph Algorithms - Go]].

Tracing Dijkstra on that sample graph by hand is exactly the sequence diagram above; the Go tests assert the same result (`dist = {0:0, 1:1, 2:4, 3:3}`) under `go test -race`.

## 5. Variants and comparison

| Algorithm | Finds | Requires | Cost |
|---|---|---|---|
| BFS | Shortest path by edge count (unweighted) | Nothing special | O(V+E) |
| DFS | Reachability, cycle detection, topological order | Nothing special | O(V+E) |
| Dijkstra | Shortest weighted path | Non-negative weights | O((V+E) log V) with a binary heap |
| Bellman-Ford | Shortest weighted path, detects negative cycles | Works with negative weights | O(VE) |
| A\* | Shortest weighted path, faster in practice | An admissible heuristic (never overestimates) | O((V+E) log V), fewer nodes expanded than Dijkstra |
| Kahn's (topological sort) | A valid processing order | A DAG (no cycles) | O(V+E) |
| Kruskal's (MST) | Minimum spanning tree | Undirected, weighted | O(E log E) (dominated by the sort) |
| Union-find | Connected components, cycle checks | — | Near O(1) amortized per op (see [[Union-Find and Skip Lists]]) |

## 6. Trade-offs and when not to use

- BFS/DFS visit every reachable vertex and edge — `O(V+E)` — there's no way to do better if you genuinely need to explore the whole reachable graph.
- Dijkstra breaks silently wrong (not a crash, just an incorrect answer) on negative edge weights, because it commits to a vertex's shortest distance as soon as it's popped from the heap. Use Bellman-Ford if negative weights are possible.
- An adjacency matrix wastes `O(V²)` space on a sparse graph (most real-world graphs: a social network has far fewer friendships than `V²` possible pairs) — default to an adjacency list unless you specifically need `O(1)` edge-existence checks on a dense graph.
- Topological sort and cycle detection are meaningless on an undirected graph in the directed sense described here — undirected cycle detection uses union-find instead (two endpoints of an edge already in the same component means a cycle).

> [!warning] What happens if… you run Dijkstra on a graph with a negative edge?
> It can return a distance that's too large for some vertex, silently, with no error or crash.
>
> Because it already finalized that vertex's distance before the negative edge had a chance to offer a cheaper path through it. This is the single most common "my shortest-path code is wrong but I don't see why" bug in practice.

## 7. In production

- **Real systems:**
	- Facebook's TAO (the social graph serving layer) and Neo4j (a dedicated graph database) store and query relationship data as a graph natively, rather than reconstructing it from SQL joins every time.
	- Map and routing services (road networks) run Dijkstra- or A\*-family algorithms over a graph of intersections and road segments, often precomputed with contraction hierarchies for speed at scale.
	- Build systems and package managers (Go's own module graph, `npm`, `make`) use topological sort to decide a valid build/install order from a dependency graph.
	- Service dependency graphs (which microservice calls which) use the same representation to compute blast radius for an outage or a safe deployment order.
	- Deadlock detection in databases and OS schedulers models "who's waiting on whom" as a directed graph and checks for cycles — a wait-for cycle is a deadlock.
	- Go's own garbage collector uses **tri-color marking** (white/gray/black, the exact same three states as the cycle-detection DFS above) to track which heap objects have been visited during a mark phase, covered in [[Process Memory Layout - Stack vs Heap]].
- **Failure modes → fixes:**
	- Dijkstra given negative weights silently returns a wrong (too-high) distance for some vertex → validate weights are non-negative, or switch to Bellman-Ford.
	- Recursive DFS on a very deep or adversarial graph can exhaust the call stack → use the iterative, explicit-stack form.
	- A dependency graph with an accidental cycle (circular imports, circular service calls) has no valid topological order → detect the cycle (Kahn's algorithm reports it directly: `len(order) < V`) and surface it as a build/deploy error instead of silently picking an arbitrary order.
- **What to monitor:** for a routing or dependency service, query latency as the graph grows (does it stay near `O(log V)`-ish per lookup, or does it degrade toward `O(V)`?), and the depth/size of DFS recursion on production data, not just test fixtures.

## 8. Deep dive

### Why Dijkstra needs non-negative weights

Dijkstra's correctness proof relies on **greedy finalization**.

Once a vertex is popped from the frontier with the smallest tentative distance, that distance is treated as final, because every other path to it would have to go through some other, non-popped vertex whose distance is at least as large — and weights only add, never subtract, so no such path could possibly be shorter.

A negative edge breaks that argument: a path through a vertex with a *larger* current tentative distance could still end up cheaper overall if it crosses a negative edge later.

Bellman-Ford instead relaxes every edge up to `V-1` times, never assuming any distance is final until the last pass, which is why it tolerates negative weights (and can detect negative cycles: if a `V`-th pass still finds an improvement, a negative cycle exists).

### Path compression's effect on union-find's complexity

Naive union-find (no path compression, no union by rank) can degrade to `O(n)` per `Find` in the worst case — a tall, unbalanced tree of parent pointers.

Path compression alone (flattening every visited node to point directly at the root on each `Find`) already gives an amortized bound close to `O(log n)`.

Combined with union by rank, the amortized cost per operation becomes `O(α(n))`, where `α` is the inverse Ackermann function — a quantity that is, for any input size that could ever exist in practice, at most 4.

This is one of the few data structures where the asymptotic bound is, for all practical purposes, constant time.

The fuller treatment, including the related ordered-structure problem skip lists solve (and where Redis uses them for sorted sets), lives in [[Union-Find and Skip Lists]].

### BFS vs. DFS for cycle detection

BFS can detect cycles in an undirected graph (a visited neighbor that isn't your immediate parent means a cycle) but is awkward for directed cycle detection, because "already visited" doesn't distinguish "visited on this path" from "visited on a completely different branch that happens to share a descendant."

DFS's three-color scheme makes that distinction explicit (gray = on the current path), which is why directed cycle detection is conventionally taught with DFS, not BFS.

### Classic practice problems

- **Number of islands** (treat a grid as an implicit graph where adjacent land cells are edges; BFS or DFS from each unvisited land cell, counting how many times you start a fresh search).
- **Course schedule** (can all courses be finished given prerequisite pairs — exactly cycle detection or topological sort on the prerequisite DAG).
- **Clone graph** (DFS or BFS while keeping a hash map from original node to its clone, so shared references are cloned once, not duplicated).
- **Network delay time** (Dijkstra from the broadcasting node; the answer is the maximum distance across all reachable nodes, or -1 if some node is unreachable).
- **Word ladder** (BFS over an implicit graph where words are vertices and an edge connects two words differing by one letter — shortest transformation sequence is a shortest-path-by-edge-count problem.

## 9. Interview questions

> [!question]- When does BFS give you the shortest path, and when does it not?
> BFS gives the shortest path by **edge count** on an unweighted graph, because it explores strictly level by level. On a weighted graph it can return a path with more total weight than the true shortest one — Dijkstra (or BFS variants like 0-1 BFS for only two distinct weights) is needed instead.

> [!question]- Why does Dijkstra fail on negative edge weights?
> It finalizes a vertex's shortest distance as soon as that vertex is popped from the frontier, assuming no cheaper path could appear later — an assumption that only holds when weights never decrease a path's total, i.e., are non-negative. A later negative edge can invalidate an already-finalized distance.

> [!question]- How do you detect a cycle in a directed graph?
> Three-color DFS: mark each vertex white (unvisited), gray (on the current DFS path), or black (fully explored). An edge to a gray vertex is a back edge to something still on the current path — a cycle. An edge to a black vertex is fine; that vertex was already fully explored on a different branch.

> [!question]- Trap: can you topologically sort a graph with a cycle?
> No — a topological order requires every edge to point "forward" in the order, which is only possible if there's no cycle (a DAG). Kahn's algorithm detects this directly: if the final order has fewer vertices than the graph, some vertices never reached in-degree 0, meaning a cycle exists.

> [!question]- Adjacency list vs. adjacency matrix: which would you pick for a social graph with a million users?
> Adjacency list. A social graph is sparse — each user has at most a few thousand connections, far fewer than the million-minus-one a matrix would reserve space for per user — so an adjacency list's O(V+E) space beats a matrix's O(V²) by orders of magnitude.

> [!question]- What does union-find give you that BFS/DFS from scratch wouldn't, for Kruskal's algorithm?
> A near-O(1) amortized "are these two vertices already connected" check, maintained incrementally as edges are added — re-running BFS/DFS from scratch after every edge to check connectivity would cost O(V+E) per edge, turning an O(E log E) algorithm into O(E(V+E)).

## 10. Cheat sheet

- Representations: adjacency list (sparse, default, O(V+E) space) vs. adjacency matrix (dense, O(1) edge check, O(V²) space).
- BFS = queue, level by level, shortest path by edge count on unweighted graphs. O(V+E).
- DFS = stack (recursive or explicit), good for cycle detection and topological order. O(V+E).
- Directed cycle detection: three-color DFS; a gray→gray edge is a cycle.
- Topological sort (Kahn's): repeatedly remove in-degree-0 vertices; fewer vertices in the output than in the graph means a cycle.
- Dijkstra: min-heap frontier, non-negative weights only, O((V+E) log V). Bellman-Ford handles negative weights at O(VE).
- Union-find: near-O(1) amortized Find/Union via path compression + union by rank; powers Kruskal's MST's cycle check.
- Real uses: dependency resolution (build systems, package managers), routing (maps), service dependency graphs, deadlock detection (wait-for cycles), Go's GC tri-color marking.

## Links

- **Before this:** [[Heaps and Priority Queues]], [[Stacks, Queues and Deques]], [[Hash Tables and Go Maps]]
- **Next:** [[Union-Find and Skip Lists]], [[Runtime - Goroutine Scheduler (GMP)]]
- **Compare with:** [[Trees, BSTs and Balanced Trees]] (a tree is a graph with no cycles and one path between any two vertices)
- **Runnable code:** [[Graphs and Graph Algorithms - Go]]

### Watch on YouTube

- [Top 5 Most Common Graph Algorithms for Coding Interviews](https://www.youtube.com/watch?v=utDu3Q7Flrw) · NeetCode · Interview-focused overview covering BFS/DFS/Dijkstra/topo-sort in one video
- [Network Delay Time - Dijkstra's algorithm - Leetcode 743](https://www.youtube.com/watch?v=EaphyqKU4PQ) · NeetCode · Worked Dijkstra implementation and interview walkthrough
