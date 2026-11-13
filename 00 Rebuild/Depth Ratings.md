---
tags: [rebuild]
type: reference
level: basic
status: reviewed
prereqs: []
related: ["[[Home]]", "[[Study Index]]"]
sources: []
updated: 2026-11-08
---

# Depth Ratings

> [!summary] An independent rating of all 395 notes
> Every note was read in full by a separate rater agent, 5 notes per agent. Each rating cites an exact quote from the note as proof it was read.
> Depth, ease and quality are scored 1–10. **Diagrams** is the number of diagrams the rater counted in the note.

## Summary

- **Notes rated:** 395
- **Vault average:** depth 8.6 · ease 7.1 · quality 9.0 · diagrams 3.7 per note
- **Strongest:** depth and quality. Most notes reach SDE-3 level.
- **Weakest:** ease, which averages about 7. Many notes are long and dense.
- **Diagrams:** only 07 Databases, which has the theory/Go split, averages about 8 per note. Everywhere else it is about 3.
- **Factual errors:** 3 confident ones, listed below.
- **Level tags:** 124 notes have a `level` that doesn't match their content, usually `basic` on notes that read as intermediate.

## By folder

| Folder                              | Notes | Depth | Ease | Quality | Diagrams |
| ----------------------------------- | ----- | ----- | ---- | ------- | -------- |
| 01 CS Fundamentals                  | 27    | 8.6   | 7.3  | 9.0     | 2.7      |
| 02 Networking & Web                 | 14    | 8.7   | 7.7  | 9.0     | 3.5      |
| 03 Frontend                         | 12    | 7.8   | 7.3  | 9.0     | 2.7      |
| 04 Go Language                      | 23    | 8.6   | 7.1  | 9.0     | 2.6      |
| 05 APIs                             | 15    | 8.8   | 6.9  | 9.0     | 3.2      |
| 06 Backend Engineering in Go        | 29    | 8.6   | 6.9  | 8.8     | 2.8      |
| 07 Databases                        | 45    | 8.4   | 7.4  | 8.9     | 7.7      |
| 08 Caching & Redis                  | 12    | 8.8   | 7.2  | 9.0     | 3.6      |
| 09 Messaging & Async                | 15    | 9.1   | 7.1  | 9.2     | 4.1      |
| 10 Distributed Systems & Resilience | 20    | 9.0   | 7.0  | 9.1     | 3.0      |
| 11 System Design                    | 29    | 8.9   | 7.1  | 9.2     | 4.0      |
| 12 Security & Auth                  | 12    | 8.8   | 6.8  | 9.0     | 3.0      |
| 13 DevOps & Cloud                   | 29    | 8.7   | 7.1  | 8.9     | 3.6      |
| 14 Observability & SRE              | 14    | 8.6   | 7.2  | 8.9     | 4.0      |
| 15 Testing                          | 10    | 8.3   | 7.1  | 8.8     | 2.2      |
| 16 Software Architecture            | 12    | 8.4   | 6.4  | 8.8     | 3.0      |
| 17 LLD                              | 51    | 8.7   | 6.6  | 9.0     | 3.3      |
| 18 AI Engineering                   | 20    | 8.5   | 7.2  | 8.9     | 3.7      |
| 19 Interview & Career               | 6     | 6.8   | 8.0  | 8.2     | 2.2      |

## Factual errors to fix

- **[[HTTP Caching - Cache-Control, ETag, Conditional Requests]]**: Cites 'RFC 9110 §13.1.1' (twice: body text and Go code comment) for the rule that If-None-Match takes priority over If-Modified-Since — §13.1.1 is actually the If-Match section; that precedence rule lives in §13.1.3 (If-Modified-Since).
- **[[Building REST Endpoints]]**: The worked `withIdempotency` example unlocks the mutex between checking `s.seen[key]` and writing the result after the handler runs, so two concurrent requests with the same Idempotency-Key can both see 'not seen' and both execute the handler — exactly the double-run race the note's own interview Q&A says must be prevented by claiming the key atomically 'before running the handler, not just record the result afterward.' The shown code does not implement that fix.
- **[[Performance Engineering and Capacity Planning]]**: The whiteboard example applies headroom AFTER dividing by per-pod capacity (4 pods × 1.3 = 5.2 → 6 pods), but the Go `ServersNeeded` function applies headroom to concurrency BEFORE dividing (300 × 1.3 = 390 / 80 = 4.875 → 5 pods). Same inputs (2,000 RPS, 150ms, 80/pod, 30% headroom) yield 6 pods in the prose walkthrough and 5 pods via the code the note presents as the rigorous version of the same arithmetic — the two are inconsistent.

## Weakest 15 notes

| Note | Depth | Ease | Quality | Diagrams | Biggest improvement |
|---|---|---|---|---|---|
| [[Learning Resources]] | 4 | 9 | 7 | 0 | flag which links are likely stale more specifically (e.g. test the two YouTube links whose titles are marked 'not re-checked') instead of one blanket disclaimer at the top |
| [[Backend Roadmap and Tech Landscape]] | 5 | 8 | 8 | 2 | The worked example (order service trace) is good but purely narrative; a small sequence or flow diagram tracing the request through the eight numbered steps would make the cross-layer story easier to retain than the numbered list alone. |
| [[CSS Fundamentals - Cascade, Selectors, Box Model]] | 7 | 6 | 9 | 2 | Split into a true basic note (cascade order, box model, units) and a follow-on intermediate note for specificity edge cases and @layer, since the current note mixes both levels. |
| [[Building REST Endpoints]] | 8 | 8 | 6 | 2 | Fix the idempotency store code to claim the key atomically (store an in-progress sentinel under the same lock before calling next, with a unique-constraint or held-lock equivalent) so the example matches the note's own stated correct behavior instead of contradicting it. |
| [[Performance Engineering and Capacity Planning]] | 9 | 6 | 7 | 2 | Reconcile the whiteboard arithmetic with the ServersNeeded formula's order of operations (headroom on concurrency, not on the rounded pod count) so the two don't silently disagree. |
| [[Design Patterns Overview and Chooser]] | 7 | 7 | 8 | 2 | Add one concrete end-to-end diagram showing several patterns composed in a single real request path (the checkout example is described in prose in section 8 but never drawn). |
| [[LLD Problem Cheat Sheet]] | 7 | 8 | 9 | 0 | Add a diagram-free quick visual (e.g., a small matrix of concurrency hazard families) since this is a pure reference table otherwise. |
| [[Cloud Computing Basics]] | 7 | 7 | 8 | 2 | Trim the pricing-model and cost-trap sections slightly — they partly overlap and could be a single consolidated table. |
| [[Syntax, Types and Control Flow]] | 7 | 7 | 9 | 2 | the note covers two large topics (types and control flow); splitting would shorten each wall of code |
| [[Standard Library Essentials (time, io, files, encoding)]] | 8 | 7 | 9 | 1 | add a small diagram contrasting time.Time's wall-clock vs monotonic reading, since that distinction drives several of the note's gotchas and is currently prose-only |
| [[Service Project Layout and Wiring]] | 7 | 7 | 9 | 2 | The DI/structural-typing discussion (deep dive, wire vs fx) pushes past 'basic' level — either simplify it or relabel the note intermediate. |
| [[Index Types and Index Design - Go]] | 7 | 8 | 8 | 2 | Add a worked test case for a range-only query with no Equal and no Sort to round out coverage of ESR's edge cases |
| [[Unit, Integration and E2E Tests]] | 8 | 6 | 9 | 2 | Add a short section on consumer-driven contract testing for service boundaries, a common SDE-3-level gap between integration and E2E. |
| [[Architecture Fundamentals - Coupling, Cohesion and Dependency Direction]] | 8 | 6 | 8 | 3 | The Stable Dependencies / connascence deep-dive content is denser than the 'basic' label suggests; either trim it or relabel as intermediate so expectations match. |
| [[Clean Architecture]] | 9 | 5 | 9 | 2 | The worked example is very long (4 rings, full HTTP stack); a shorter 'if you only have 10 minutes' version up front would help readers who just need the mental model before the full code. |

## Every note

Each folder below opens to show every note's scores, level check and improvement.

> [!note]- 01 CS Fundamentals
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Arrays and Dynamic Arrays (Go Slices)]] | 9 | 7 | 9 | 3 | should be intermediate | split section 9's five interview patterns into their own note or trim, since the core slice-mechanics content is already complete without th |
> | [[CPU Scheduling]] | 9 | 7 | 9 | 4 | ok | add a brief worked numeric example of vruntime updating across a couple of ticks, since CFS/EEVDF is described only qualitatively |
> | [[Complexity Analysis - Big-O and Amortized Cost]] | 8 | 7 | 9 | 2 | should be intermediate | add a second measured example besides slice append (e.g. hash-map resize) to generalize amortized analysis beyond the one recurring Go-slice |
> | [[Concurrency Primitives - Mutex, Semaphore, Atomics]] | 9 | 7 | 9 | 4 | ok | add a short concrete illustration of the ABA problem itself (mentioned by name but never actually walked through), since it's cited as the r |
> | [[Data Structures Overview and Big-O Cheat Sheet]] | 7 | 8 | 9 | 2 | ok | the master table's 'worst case (search)' column mixes true worst-case bounds (hash table O(n)) with best-case-ish entries (e.g. BST row says |
> | [[Graphs and Graph Algorithms]] | 8 | 7 | 9 | 3 | ok | trim the repeated code between the 'whiteboard' BFS snippet and the full package (they overlap almost verbatim) |
> | [[Hash Tables and Go Maps]] | 9 | 7 | 9 | 2 | ok | add a quick measured comparison (ns/op) between the hand-rolled chaining table and Go's built-in map to make the Swiss Tables speedup concre |
> | [[Heaps and Priority Queues]] | 9 | 6 | 9 | 2 | ok | the note stacks five separate worked patterns (top-K, k-way merge, running median, TaskQueue, MinHeap) back to back with code for each — cut |
> | [[How a Computer Runs a Program]] | 7 | 8 | 9 | 3 | intermediate | retag frontmatter level from 'basic' to 'intermediate' — the deep dive (relocations, PIE, cgo linking) is well past basic material |
> | [[I-O Models - Blocking, epoll, io_uring and the Go Netpoller]] | 10 | 7 | 9 | 6 | ok | add concrete measured numbers (e.g. epoll_wait call rate or syscalls/sec) for the echo-server test instead of only the qualitative 'represen |
> | [[Latency Numbers Every Engineer Should Know]] | 9 | 7 | 9 | 2 | frontmatter says basic but content | Trim the repetition of the same ladder numbers across TL;DR, abstract, cheat sheet and deep dive into one canonical table |
> | [[Linked Lists]] | 8 | 7 | 9 | 2 | ok | Add a small diagram of the LRU map+list interaction (pointers into list nodes) instead of relying on code alone to convey it |
> | [[Memory Hierarchy and CPU Caches]] | 9 | 6 | 9 | 3 | frontmatter says basic but MESI protocol | Cut the lengthy caveats around the false-sharing benchmark's noise into a single sentence to shorten an already-long note |
> | [[Number Representation and Text Encoding]] | 8 | 7 | 9 | 2 | ok | Pull the Go-vs-Swift-vs-Python overflow-semantics comparison out of Deep dive into the main comparison table where it's more discoverable |
> | [[Page Cache, File Systems and fsync]] | 9 | 7 | 9 | 3 | ok | Add a single comparative diagram (or table) of fsync cost tiers (NVMe vs SATA vs cloud block storage) instead of scattering the numbers acro |
> | [[Process Memory Layout - Stack vs Heap]] | 9 | 8 | 9 | 3 | ok | Add a concrete worked numeric example of goroutine stack growth (actual size sequence 2KB->4KB->8KB) rather than only describing it abstract |
> | [[Processes, Threads and Context Switching]] | 9 | 8 | 9 | 3 | ok | The measured goroutine-handoff benchmark is good, but add one real measured OS thread-switch number from this same machine (not just cited l |
> | [[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM]] | 8 | 8 | 9 | 3 | intermediate | Frontmatter says level: basic but the content (DDR5 sub-channels, Rowhammer, HBM TSVs, GOMEMLIMIT tuning) is squarely intermediate/SDE-3 dep |
> | [[ROM, Flash, Firmware and the Boot Process]] | 8 | 8 | 9 | 2 | ok | Add a small diagram or table showing initramfs/switch_root mechanics, since it's explained only in prose despite being one of the more subtl |
> | [[Sorting, Searching and Interview Patterns]] | 8 | 7 | 9 | 2 | ok | Section 4's six back-to-back code blocks for the interview patterns read as a wall of code with little prose between them; break each patter |
> | [[Stacks, Queues and Deques]] | 8 | 7 | 9 | 3 | intermediate | trim length or split concurrency/channel material into its own note; frontmatter says basic but content (monotonic deque, channel backpressu |
> | [[Storage Devices - HDD, SSD, NVMe]] | 9 | 7 | 9 | 2 | intermediate | frontmatter says basic but the write-amplification simulation, WAF formula, and RAID write-penalty analysis are intermediate/advanced-level  |
> | [[System Calls and User vs Kernel Mode]] | 9 | 8 | 9 | 2 | ok | the strace output is explicitly a reconstructed/representative trace rather than measured on this (darwin) machine — flag this more prominen |
> | [[Trees, BSTs and Balanced Trees]] | 8 | 8 | 9 | 2 | ok | add a short diagram contrasting AVL vs red-black rotation counts/invariants side by side, since that comparison is currently text-only despi |
> | [[Tries, Suffix Trees and Suffix Arrays]] | 9 | 7 | 9 | 3 | ok | the note is dense and long for its topic scope; consider splitting suffix trees/arrays out from tries+radix tries into a separate note, sinc |
> | [[Union-Find and Skip Lists]] | 9 | 8 | 9 | 4 | ok | Show an actual benchmark (timed search/insert at scale) instead of only pass/fail test claims, to back the asymptotic claims with real numbe |
> | [[Virtual Memory, Paging and the TLB]] | 9 | 8 | 9 | 2 | advanced | Frontmatter says 'intermediate' but the content (THP compaction stalls, OOM scoring, ASLR, RSS/VSZ divergence, fork COW internals) is advanc |

> [!note]- 02 Networking & Web
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[CDN and Edge]] | 9 | 8 | 10 | 5 | ok | Nothing major to fix in correctness; could add one diagram comparing the four invalidation strategies' timing/consistency trade-offs side by |
> | [[DNS - Resolution, Records and Caching]] | 9 | 8 | 9 | 3 | advanced | Frontmatter level is 'basic' but the note covers DNSSEC chains, EDNS0 amplification attacks, CoreDNS ndots quirks, and DoH/DoT — this is int |
> | [[Forward and Reverse Proxies - L4 vs L7]] | 9 | 8 | 9 | 4 | ok | Add a small diagram for the sidecar/service-mesh topology (today it's described only in prose) to match the diagram density of the rest of t |
> | [[HTTP Caching - Cache-Control, ETag, Conditional Requests]] | 8 | 8 | 8 | 3 | ok | fix the RFC 9110 section citation (§13.1.3, not §13.1.1) for the If-None-Match/If-Modified-Since precedence rule |
> | [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]] | 8 | 8 | 9 | 3 | intermediate | relabel frontmatter level to intermediate — the PATCH/idempotency nuance, 401 vs 403 traps and SameSite trade-offs go well past 'basic' |
> | [[HTTP-1.1 vs HTTP-2 vs HTTP-3]] | 9 | 8 | 9 | 4 | ok | add a short note on what metric actually reveals TCP-level HOL blocking in production (since the note stresses this is invisible at the HTTP |
> | [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]] | 9 | 8 | 9 | 4 | intermediate | relabel as intermediate — BGP AS-path selection, MTU/fragmentation cost, and the 5-tuple deep dive exceed a 'basic' note's usual scope |
> | [[IP Addressing, Subnets, NAT and VPC Basics]] | 8 | 8 | 9 | 3 | intermediate | list AWS's 5 reserved subnet addresses explicitly (network, router, DNS+2 reserved, broadcast) instead of just stating the count |
> | [[Network Debugging Toolkit - dig, curl, ss, tcpdump]] | 9 | 8 | 9 | 2 | ok | trim the lengthy Go health-probe code (dial/classify/tests run ~190 lines) which adds length without adding new conceptual content beyond wh |
> | [[Nginx]] | 8 | 8 | 9 | 4 | advanced | frontmatter says level: intermediate but the content (epoll internals comparison, CUBIC/BBR-adjacent reasoning on worker scheduling, service |
> | [[TCP - Handshake, Reliability, Flow and Congestion Control]] | 9 | 7 | 9 | 4 | advanced | frontmatter says level: intermediate but RTO formula derivation, SACK, BBR-vs-CUBIC fairness trade-offs and Nagle×delayed-ACK interaction ar |
> | [[TLS and HTTPS]] | 9 | 7 | 9 | 5 | advanced | frontmatter says level: intermediate but forward-secrecy mechanics, 0-RTT replay semantics, and post-quantum hybrid key exchange are advance |
> | [[UDP and QUIC]] | 9 | 7 | 9 | 3 | advanced | frontmatter says level: intermediate but packet-number-vs-sequence-number ambiguity, connection migration path validation, and multipath ext |
> | [[What Happens When You Type a URL]] | 9 | 7 | 9 | 2 | ok | The sequence diagram and the timing table repeat the same 9 steps twice; cut one representation to reduce density without losing information |

> [!note]- 03 Frontend
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[CSS Fundamentals - Cascade, Selectors, Box Model]] | 7 | 6 | 9 | 2 | should be intermediate — specificity ari | Split into a true basic note (cascade order, box model, units) and a follow-on intermediate note for specificity edge cases and @layer, sinc |
> | [[CSS Layout - Position, Flexbox, Grid]] | 7 | 7 | 9 | 4 | should be intermediate — stacking-contex | Add one runnable, side-by-side code example contrasting the same card-gallery layout built with flexbox vs. grid, so the content-out vs layo |
> | [[DOM, Events and Timers]] | 7 | 8 | 9 | 3 | ok | Add a short section on AbortController for bulk-removing listeners, since it's now the standard cleanup pattern and the note currently only  |
> | [[How Browsers Load and Render a Page]] | 8 | 7 | 9 | 4 | should be intermediate — critical render | Add a concrete before/after timing example for preload/preconnect/prefetch (like the worked-example table already done for async/defer) so t |
> | [[JavaScript Async - Event Loop, Promises, async-await]] | 8 | 8 | 9 | 2 | ok | Add a short sequence diagram for AbortController cancellation instead of only describing it in prose |
> | [[JavaScript Core - Types, Scope, Hoisting, Closures, this]] | 9 | 7 | 9 | 2 | intermediate | Frontmatter says 'basic' but content (TDZ internals, prototype chain, GC retention, currying, equality-coercion edge cases) is intermediate/ |
> | [[JavaScript Objects, Arrays and Iteration]] | 8 | 8 | 9 | 3 | ok | The long 'How it works' section front-loads too many sub-sections before the first interactive example; move the map/filter/reduce pipeline  |
> | [[React Fundamentals - Components, JSX, Props, State]] | 7 | 8 | 9 | 2 | ok | Add a small diagram showing key-based reconciliation (old list vs new list matching by id) since that's the most-tested trap in this note |
> | [[React Hooks]] | 8 | 7 | 9 | 2 | ok | Add a tiny diagram or table contrasting useMemo/useCallback's dependency-array comparison cost against the work they save, since the note ar |
> | [[React Rendering - Virtual DOM, Reconciliation, Lifecycle]] | 8 | 7 | 9 | 3 | ok | Add a single diagram that actually shows the three trees (element/fiber/DOM) side by side instead of only describing them in prose, since th |
> | [[React Routing and Rendering Strategies - CSR, SSR, SSG]] | 8 | 7 | 9 | 3 | ok | Add a streaming-SSR timeline diagram (chunks arriving over time), since that mechanism is described only in prose while every other strategy |
> | [[React State Management - Props, Context, Redux]] | 8 | 8 | 9 | 2 | ok | Add a diagram contrasting re-render blast radius (Context: all consumers vs Redux: only matching selector), since that is the note's central |

> [!note]- 04 Go Language
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Arrays, Slices and Maps (with internals)]] | 8 | 7 | 9 | 3 | should be intermediate | Reclassify frontmatter level from basic to intermediate — the content (Swiss Tables references, fatal-error semantics, measured JSON/race-cr |
> | [[Benchmarks, Profiling and Tracing]] | 9 | 6 | 9 | 2 | ok | Split into two notes (benchmarking+pprof vs tracing/PGO) or add more subheadings/whitespace breaks — at 462 lines with dense measured output |
> | [[Context Package]] | 9 | 7 | 9 | 2 | ok | Add a diagram for WithCancelCause/AfterFunc/WithoutCancel interplay, since only the cancellation-tree and deadline-flow are diagrammed and t |
> | [[Error Handling]] | 9 | 7 | 9 | 3 | ok | The flowchart and classDiagram both illustrate the same wrap/chain concept redundantly; merge into one diagram and use the freed space for a |
> | [[Functions, Closures, Defer, Panic and Recover]] | 9 | 7 | 9 | 4 | advanced | Frontmatter says level: basic, but the content (open-coded defers, GC-shape stenciling cross-reference, measured goroutine-panic crash, init |
> | [[Generics and Iterators]] | 9 | 8 | 9 | 3 | ok | Nothing structurally wrong; the deepest internals (stenciling vs dictionary GC-shape detail) arrive only in the Deep Dive section with no di |
> | [[Go Toolchain, Tooling and Debugging]] | 8 | 7 | 9 | 2 | intermediate | Frontmatter says level: basic with no prereqs, but it covers GOTOOLCHAIN internals, -ldflags -X linker mechanics, race-detector internals an |
> | [[Goroutines and Channels]] | 9 | 8 | 9 | 4 | ok | Trim the long duplicated test/code blocks in the worked example; a shorter leak-pattern diagram would land faster than the prose list of thr |
> | [[Interfaces]] | 9 | 8 | 9 | 3 | ok | Add one diagram showing the itab lookup path (type word -> itab -> function pointer slot -> call) since that mechanism is described only in  |
> | [[Memory Model and Data Races]] | 9 | 7 | 9 | 2 | ok | Add a small diagram for the torn multi-word read (pointer+length mismatch on a slice/interface) since that's described only in dense prose i |
> | [[Modern Go Feature Timeline (1.18-1.25)]] | 7 | 8 | 9 | 2 | ok | Breadth-over-depth is appropriate for a timeline note, but a per-release table column for 'breaking/non-breaking for existing code' would ma |
> | [[Packages, Modules and Dependency Management]] | 9 | 8 | 9 | 2 | ok | Add a diagram for the go.sum/checksum-database verification flow (proxy -> sum.golang.org -> local go.sum) since go.sum's role is explained  |
> | [[Pointers, Values and Escape Analysis]] | 9 | 7 | 9 | 4 | advanced | trim the worked-example code volume so the core mental model isn't buried under test/benchmark boilerplate |
> | [[Reflection and unsafe]] | 9 | 7 | 9 | 3 | ok | the cgo overhead claim ('tens of nanoseconds') is stated with more precision than the source material supports; soften or cite a range |
> | [[Runtime - Goroutine Scheduler (GMP)]] | 9 | 7 | 9 | 3 | ok | add a single end-to-end timeline diagram tying G lifecycle (run -> block -> park -> steal -> resume) together instead of three separate diag |
> | [[Runtime - Memory Allocator and Garbage Collector]] | 9 | 7 | 9 | 3 | ok | the pacer/GOGC math section would benefit from one worked numeric example (e.g. 100MB live heap, GOGC=100 vs 400) instead of only the formul |
> | [[Standard Library Essentials (time, io, files, encoding)]] | 8 | 7 | 9 | 1 | ok | add a small diagram contrasting time.Time's wall-clock vs monotonic reading, since that distinction drives several of the note's gotchas and |
> | [[Strings, Bytes, Runes and Unicode]] | 8 | 7 | 9 | 2 | intermediate | add a runnable grapheme-cluster-aware truncation example using uniseg instead of only describing it |
> | [[Structs, Methods and Embedding]] | 8 | 7 | 9 | 2 | intermediate | show actual `fieldalignment` CLI output for the measured struct instead of only a results table |
> | [[Syntax, Types and Control Flow]] | 7 | 7 | 9 | 2 | intermediate | the note covers two large topics (types and control flow); splitting would shorten each wall of code |
> | [[Testing in Go]] | 9 | 6 | 9 | 2 | ok | trim or move the synctest/go1.24-vs-1.25 versioning detail into a sidebar; it crowds the core table-test mechanics |
> | [[select and Concurrency Patterns]] | 9 | 6 | 9 | 3 | ok | add a small benchmark/numbers table comparing pool vs errgroup overhead to match the quantified style of other notes |
> | [[sync Primitives and Atomics]] | 9 | 7 | 9 | 3 | advanced | Split into two notes (mutex/WaitGroup/Once/Cond/Pool vs atomics) — the single note covers seven distinct primitives plus benchmarks and is d |

> [!note]- 05 APIs
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[API Contract Design and OpenAPI]] | 8 | 7 | 9 | 2 | ok | The 500+ line full OpenAPI YAML example could be trimmed to the fields that illustrate each rule, with the rest linked out, to reduce scroll |
> | [[API Error Handling]] | 9 | 7 | 9 | 3 | ok | Move the status-mapping table and retry flowchart earlier, before the long Go worked example, so the quick-reference payoff doesn't require  |
> | [[API Gateway and BFF]] | 9 | 7 | 9 | 3 | ok | The Go gateway implementation (routing + load shedding + canary in one ServeHTTP) is dense; splitting it into two smaller snippets (routing/ |
> | [[API Versioning and Backward Compatibility]] | 9 | 7 | 9 | 2 | ok | Add a short sequence diagram showing one request walking through the Down-transformer chain end-to-end; the current flowcharts explain the p |
> | [[Choosing an API Style]] | 8 | 7 | 9 | 4 | basic | Retag level as intermediate/advanced-leaning — the content (HTTP/2 trailers, gRPC transcoding, ALB idle timeouts, Int32 math) goes well past |
> | [[File Upload Architecture]] | 9 | 7 | 9 | 3 | ok | The two large Go code blocks (proxy handler + presign) plus their test files make section 4 a long unbroken read; splitting into clearly lab |
> | [[GraphQL]] | 9 | 6 | 9 | 3 | ok | The gqlgen implementation walkthrough (section 7) is dense and somewhat separate from the conceptual material above it — moving it to a dedi |
> | [[Idempotency and Idempotency Keys]] | 9 | 7 | 9 | 4 | ok | The important 'claim in the same transaction as the effect' simplification (section 8) that avoids the whole in_progress/409 machinery is bu |
> | [[Pagination, Filtering and Sorting]] | 9 | 7 | 9 | 2 | ok | Add a small diagram of the B-tree itself (showing it has no subtree row counts) next to the EXPLAIN output, since the key 'why OFFSET can't  |
> | [[Protocol Buffers and Schema Evolution]] | 9 | 7 | 9 | 2 | ok | add a diagram walking through the oneof/optional field-move safety rules, which are currently only prose |
> | [[REST and HTTP API Design]] | 9 | 7 | 9 | 5 | should be intermediate/advanced | fix frontmatter level label to match the actual advanced content so it isn't skipped as introductory |
> | [[Real-time APIs - WebSocket, SSE and Long Polling]] | 9 | 7 | 9 | 4 | ok | add a small diagram for the bounded send-buffer/backpressure decision (drop vs conflate vs disconnect), currently prose-only |
> | [[SOAP and WSDL (Legacy Integrations)]] | 8 | 7 | 9 | 2 | should be intermediate | add a diagram contrasting SOAP 1.1 vs 1.2 fault-to-HTTP-status mapping, a point that's easy to misremember |
> | [[Webhooks - Sending and Receiving]] | 9 | 7 | 9 | 3 | ok | add a diagram for the reconciliation job (comparing provider's events API against local state), currently only described in prose |
> | [[gRPC]] | 9 | 7 | 9 | 6 | ok | Trim or fold some of the section-7 production detail (keepalive, flow control, stream limits) into the deep dive only, so the main path read |

> [!note]- 06 Backend Engineering in Go
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Authentication and Authorization in Go]] | 9 | 8 | 9 | 2 | ok | Add one diagram contrasting HS256 (shared secret) vs RS256/EdDSA (asymmetric) signing/verification, since that distinction is explained in p |
> | [[Backend Request Lifecycle and Layering]] | 8 | 8 | 9 | 2 | intermediate | Frontmatter says level: basic, but the content (transaction-boundary subtleties, hexagonal vs CQRS trade-offs, goroutine-per-connection inte |
> | [[Background Workers and Job Queues]] | 10 | 6 | 9 | 3 | ok | The note is very code-dense (multiple full files plus 11 tests); pull the Pool/asynq code into a linked companion and keep this note to the  |
> | [[Building REST Endpoints]] | 8 | 8 | 6 | 2 | ok | Fix the idempotency store code to claim the key atomically (store an in-progress sentinel under the same lock before calling next, with a un |
> | [[Calling External APIs]] | 8 | 7 | 9 | 3 | ok | trim the production/deep-dive sections or move some to a linked note — the note covers a lot before reaching the worked example |
> | [[Capstone - InvoiceOps]] | 9 | 6 | 9 | 6 | ok | add a single one-page 'map of this note' diagram up front linking each subsection to the 06 chapter it exercises, since the note is long eno |
> | [[Configuration and Secrets]] | 7 | 8 | 9 | 2 | should be intermediate | retag the frontmatter level to intermediate (or basic+advanced split) — the Secret/LogValuer design, K8s rotation mechanics and koanf/viper  |
> | [[Containerizing Go Services]] | 9 | 7 | 9 | 3 | ok | add a one-line pointer to how to verify GOMAXPROCS/GOMEMLIMIT actually took effect at runtime (e.g. a /debug/vars or log line check) to clos |
> | [[Database Access (database-sql, pgx, sqlc)]] | 8 | 7 | 9 | 4 | ok | add a short upfront table contrasting pgx native types vs database/sql Scan handling, since that distinction currently only shows up scatter |
> | [[File Uploads and Object Storage]] | 9 | 7 | 9 | 3 | ok | Split the long worked-example code block into smaller, separately-headed chunks for easier scanning |
> | [[Graceful Shutdown and Health Checks]] | 9 | 7 | 9 | 2 | ok | Add a timeline diagram showing concrete millisecond budgets (drainDelay + shutdownTimeout vs terminationGracePeriodSeconds) side by side |
> | [[HTTP Server Fundamentals (net-http)]] | 8 | 7 | 9 | 2 | intermediate | Relabel frontmatter level from basic to intermediate — the content (pattern-precedence rules, MaxBytesReader internals, HTTP/2 goroutine mod |
> | [[Middleware]] | 8 | 7 | 9 | 2 | ok | Add a small diagram contrasting global vs per-route middleware composition visually, rather than only code snippets |
> | [[Observability in Go Services]] | 9 | 6 | 9 | 2 | ok | Trim the very long worked-example code blocks (logging + metrics + tracing all in one) into separately digestible sub-sections |
> | [[OpenAPI-First Development in Go]] | 8 | 7 | 8 | 3 | advanced | Trim the tool-comparison table/variants section or move some of it to the parent API-contract note to reduce redundancy with section 5's own |
> | [[Receiving Webhooks Idempotently]] | 9 | 7 | 9 | 4 | advanced | The outbox section is added almost as an afterthought/retrofit to the simpler channel-based worked example; integrating it into the main wor |
> | [[Redis in Go]] | 9 | 7 | 9 | 3 | advanced | The note defers most pattern-level content (queues, Redlock, sliding window) to other notes via one-liners; a reader relying only on this no |
> | [[Request Decoding, Validation and DTOs]] | 8 | 8 | 8 | 2 | advanced | Add a short diagram or table specifically contrasting PATCH semantics (pointer vs JSON Merge Patch) since that is one of the trickier, more  |
> | [[Scheduled Jobs]] | 9 | 7 | 9 | 4 | advanced | The claim that time.Ticker's channel buffer capacity itself changes from 1 to 0 based on the module's declared Go version (as opposed to jus |
> | [[Schema Migrations in Go Services]] | 8 | 7 | 9 | 2 | ok | Trim the backfill/goose Go-migration section; it slightly dilutes the core locking lesson with a second worked example. |
> | [[Secure Coding for Go Services]] | 9 | 6 | 9 | 2 | ok | Split into two notes (injection/traversal controls vs. crypto/secrets controls); as one note it reads as a long checklist rather than a sing |
> | [[Service Project Layout and Wiring]] | 7 | 7 | 9 | 2 | intermediate | The DI/structural-typing discussion (deep dive, wire vs fx) pushes past 'basic' level — either simplify it or relabel the note intermediate. |
> | [[Serving REST and gRPC Together]] | 9 | 6 | 9 | 2 | ok | The worked example duplicates the service implementation across grpc-gateway and ConnectRPC handlers; factor out the shared business logic t |
> | [[TLS, HTTPS and HTTP2 in Go Servers]] | 9 | 6 | 9 | 3 | ok | The httptest/h2c test-harness gotchas (SNI, ConfigureServer/ConfigureTransport) are excellent but belong in a callout box rather than inline |
> | [[Testing Go Services]] | 8 | 7 | 9 | 2 | ok | trim the very long full worked-example code block (handler+repo+testcontainers file in full) so the testing-layer concepts aren't buried und |
> | [[Transactions and the Repository Pattern]] | 9 | 7 | 9 | 4 | ok | note tests only run against SQLite, not real Postgres isolation semantics, which slightly undercuts confidence in the serialization-failure  |
> | [[WebSockets and SSE in Go]] | 9 | 6 | 9 | 4 | ok | the note is very long and dense (hub+WS+SSE+multi-pod fan-out all in one); splitting WebSocket and SSE into two notes would make each easier |
> | [[gRPC Services in Go]] | 9 | 7 | 9 | 3 | ok | add a small diagram contrasting trailers-only vs headers+trailers response shapes, since that distinction is explained only in prose |
> | [[gRPC Streaming in Go]] | 9 | 7 | 9 | 3 | ok | add a visual diagram of the HTTP/2 flow-control window filling and stalling Send, since backpressure is only described in prose despite bein |

> [!note]- 07 Databases
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Backup, PITR and Disaster Recovery - Go]] | 7 | 8 | 8 | 8 | ok | Show at least one case mapping the toy LSN model to real pgBackRest/WAL-G file naming, since the note admits it skips that translation entir |
> | [[Backup, PITR and Disaster Recovery]] | 9 | 7 | 9 | 9 | should be advanced | The frontmatter says intermediate, but section 8/9 (timelines, delayed replica recovery, sharded restore points, interview traps) is advance |
> | [[Connection Pooling - Go]] | 8 | 8 | 9 | 8 | ok | Add a quick note on how MaxIdleConns interacts with context cancellation under real network latency, since the fake driver's instant Close() |
> | [[Connection Pooling]] | 9 | 7 | 9 | 9 | should be advanced | At ~470 lines this is the densest note in the batch; frontmatter still says intermediate even though sections 7-9 (pg_stat_activity triage,  |
> | [[Consistent Hashing - Go]] | 8 | 8 | 9 | 8 | ok | The sources cite bounded-load consistent hashing (Mirrokni et al.) but the code never implements or even flags the gap in the text — add one |
> | [[Consistent Hashing]] | 9 | 8 | 9 | 7 | ok | Add a short worked example combining vnodes with bounded loads so the two deep-dive concepts aren't left purely abstract |
> | [[Distributed SQL - Go]] | 8 | 7 | 9 | 4 | ok | Add a small table-driven test for the Router.Split edge case where `at` already equals End, to cover the no-op branch explicitly |
> | [[Distributed SQL]] | 9 | 7 | 9 | 8 | ok | Double-check the CockroachDB READ COMMITTED GA version number cited (v24.1) against current docs, since this kind of detail changes across r |
> | [[Index Types and Index Design - Go]] | 7 | 8 | 8 | 2 | ok | Add a worked test case for a range-only query with no Equal and no Sort to round out coverage of ESR's edge cases |
> | [[Index Types and Index Design]] | 9 | 7 | 9 | 7 | ok | Section 4.1 stacks many representative EXPLAIN blocks back to back; collapsing the before/after plan pairs into a single annotated diff woul |
> | [[Indexing Fundamentals - Go]] | 7 | 8 | 8 | 3 | ok | add a variant that models page-level fan-out/splits instead of a flat slice, since the current model explicitly cannot teach that |
> | [[Indexing Fundamentals]] | 9 | 8 | 9 | 8 | advanced | frontmatter says level: basic but content (HOT updates, visibility map, page splits, skip scan internals) is advanced/SDE-3 depth; relabel t |
> | [[Isolation Levels and MVCC - Go]] | 8 | 7 | 9 | 5 | ok | note explicitly states PGStore/RecordPaymentLocked-equivalent code was never run against a real database; add at least one docker/testcontai |
> | [[Isolation Levels and MVCC]] | 10 | 7 | 9 | 11 | advanced | frontmatter says level: intermediate but the deep dive (SSI false positives, MultiXacts, xid wraparound, InnoDB undo/purge internals) is cle |
> | [[Locking - Optimistic vs Pessimistic - Go]] | 8 | 7 | 9 | 4 | ok | add a benchmark or load test comparing optimistic-retry throughput vs pessimistic FOR NO KEY UPDATE latency under real contention, since the |
> | [[Locking - Optimistic vs Pessimistic]] | 9 | 7 | 9 | 9 | advanced | Frontmatter says intermediate but the deep-dive (xmax/MultiXact storage, InnoDB gap locks, lock-queue ordering) is advanced/SDE-3 territory; |
> | [[Materialized Views and Denormalization - Go]] | 8 | 7 | 8 | 7 | ok | Frontmatter still has status: draft even though the content (tests, exercises, full-file appendix) reads as finished; resolve the status lab |
> | [[Materialized Views and Denormalization]] | 9 | 8 | 9 | 9 | ok | The cache-vs-materialized-view distinction and the covering-index escape hatch are buried in section 6/8; surfacing them earlier (near secti |
> | [[N+1 Query Problem - Go]] | 8 | 7 | 9 | 7 | ok | Frontmatter is missing a status field entirely (other companion notes mark draft/reviewed); add one so the vault's status tracking stays con |
> | [[N+1 Query Problem]] | 8 | 8 | 9 | 8 | ok | The pg_stat_statements detection query and the per-request tracer approach are both good but presented back-to-back without a decision guide |
> | [[NoSQL Data Modeling - Go]] | 8 | 7 | 9 | 5 | advanced | Show the real AWS SDK for Go v2 dynamodb.Query call with KeyConditionExpression alongside the in-memory stand-in, not just a prose mention a |
> | [[NoSQL Data Modeling]] | 9 | 8 | 9 | 15 | advanced | The capacity-arithmetic section (4.3) is the strongest interview-prep material in the note but is buried after the worked example — move it  |
> | [[Partitioning and Sharding - Go]] | 9 | 7 | 9 | 6 | ok | The note explicitly calls out that Freeze alone can't prevent lost writes and that the source database must enforce a shard_owner check (per |
> | [[Partitioning and Sharding]] | 9 | 8 | 10 | 14 | ok | Diagram density is very high (14 mermaid blocks); a reader moving fast would benefit from 2-3 being consolidated, e.g. merging the range/has |
> | [[Query Plans and EXPLAIN - Go]] | 7 | 8 | 9 | 3 | ok | Only one sample plan (a 3-node join) is tested; add a second fixture with a parallel Gather node to exercise the per-worker-averages pitfall |
> | [[Query Plans and EXPLAIN]] | 9 | 7 | 9 | 8 | advanced | trim some dense prose blocks (section 3.3/8) into tighter bullets to reduce wall-of-text feel |
> | [[Relational Schema Design - Go]] | 8 | 7 | 9 | 7 | intermediate | note is long for a 'basic' companion; split RLS/trigger section into its own code note or mark level intermediate |
> | [[Relational Schema Design]] | 9 | 7 | 9 | 8 | intermediate | frontmatter says level basic but the BCNF deep dive and multi-tenancy comparison are advanced-level content; relabel or split a 'basics only |
> | [[Replication - Go]] | 8 | 7 | 9 | 7 | ok | add a brief note on monitoring the fallback-rate metric in Go (it's referenced but not implemented) to close the loop with the theory note's |
> | [[Replication]] | 9 | 7 | 9 | 10 | advanced | frontmatter level 'intermediate' undersells content that covers split-brain, timelines, and consensus-based topologies at an SDE-3/advanced  |
> | [[SQL Essentials - Go]] | 8 | 8 | 9 | 5 | ok | Run the SQL against a live Postgres 17 instance to verify the 'representative output' tables instead of hand-computing them. |
> | [[SQL Essentials]] | 9 | 7 | 9 | 6 | should be intermediate | Split the planner-internals material (join_collapse_limit, geqo_threshold, NOT IN anti-join cost) into a follow-on advanced note so a true S |
> | [[SQL vs NoSQL]] | 8 | 8 | 9 | 8 | ok | Add one concrete story of polyglot persistence going wrong in production to balance the otherwise strongly positive framing of multi-store a |
> | [[Search Engines and Inverted Indexes - Go]] | 9 | 8 | 9 | 5 | ok | Replace followedBy's nested per-term, per-posting scan with a merge over sorted position lists, closer to how a real engine advances positio |
> | [[Search Engines and Inverted Indexes]] | 9 | 8 | 9 | 14 | ok | Add a short treatment of how per-field boosts combine with BM25 scoring across multiple analyzed fields, since the note otherwise treats fie |
> | [[Storage Engines - B-tree vs LSM and WAL - Go]] | 8 | 8 | 9 | 5 | ok | add a concurrency-safe variant (mutex or channel) since the pitfalls note explicitly flags Tree as not concurrent-safe but never shows the f |
> | [[Storage Engines - B-tree vs LSM and WAL]] | 10 | 7 | 10 | 11 | advanced | the note is dense enough (478 lines, 11 diagrams) that it could be split into a shorter core note plus a 'deep dive' companion for faster re |
> | [[Time-Series and Columnar Storage - Go]] | 8 | 7 | 9 | 11 | ok | the three encoders (timestamps, floats, RLE) plus three SQL systems (ClickHouse, Postgres, Timescale) in one file makes it long; splitting S |
> | [[Time-Series and Columnar Storage]] | 9 | 7 | 9 | 15 | ok | trim section 7 (production) slightly — it covers warehouse modeling, ELT, tiered retention, and three separate systems' failure modes all at |
> | [[Transactions and ACID - Go]] | 7 | 8 | 9 | 3 | intermediate | show the concurrent-buyer test (two goroutines racing ReserveUnit against a real or simulated DB) rather than only asserting the SQL comment |
> | [[Transactions and ACID]] | 9 | 7 | 9 | 10 | should be intermediate/advanced — frontm | split into a basic ACID note and a separate intermediate/advanced internals note so the level tag matches each piece |
> | [[Wide-Column Stores and Cassandra - Go]] | 8 | 7 | 8 | 5 | ok | add a real pgx/gocql-style Store implementation stub (not just the lww model) so the CQL and Go halves connect end to end |
> | [[Wide-Column Stores and Cassandra]] | 9 | 7 | 9 | 13 | ok | add one more worked numeric example of a QUORUM overlap failure (not just the 2+2>3 success case) to show where tunable consistency still br |
> | [[Zero-Downtime Schema Migrations - Go]] | 8 | 8 | 8 | 4 | ok | show the real pgx-backed Store (SQL + QueryRow for replay_lag) alongside the fake, since the note promises it but only ever shows the interf |
> | [[Zero-Downtime Schema Migrations]] | 9 | 8 | 9 | 9 | ok | add a short section on how to do this safely with a connection pooler/pgbouncer transaction mode, since the note mentions pooler advisory-lo |

> [!note]- 08 Caching & Redis
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Cache Eviction Policies - LRU, LFU, TTL]] | 9 | 7 | 9 | 2 | ok | Trim the long Go code/test listings so the eviction-algorithm reasoning isn't buried in implementation detail |
> | [[Cache Failure Modes - Stampede, Avalanche, Penetration, Hot and Big Keys]] | 10 | 6 | 9 | 3 | ok | Split the very large single note (5 failure modes + full code + measurements) into shorter linked notes for easier review passes |
> | [[Cache Invalidation, TTL and Consistency]] | 9 | 7 | 9 | 3 | ok | The race-fix comparison table (section 5) could move earlier, before the full code, so the decision framework isn't reached only after a lon |
> | [[Caching Fundamentals]] | 7 | 8 | 9 | 2 | ok | Add a small diagram contrasting the hit-ratio-vs-cache-size curve referenced in the deep dive, since it's described but not shown |
> | [[Caching Patterns]] | 9 | 7 | 9 | 4 | ok | The pattern-comparison table (section 5) is the clearest summary but arrives only after ~400 lines of code; move it up near section 3 |
> | [[Redis Data Structures and When to Use Each]] | 9 | 8 | 9 | 2 | ok | Consolidate the three overlapping memory-comparison tables (section 4) into one, they repeat the set-vs-HLL numbers twice |
> | [[Redis Fundamentals]] | 9 | 7 | 9 | 3 | intermediate | Frontmatter says basic but the content (threading internals, licensing history, fork/COW) is intermediate-to-advanced; relabel or split a tr |
> | [[Redis Hands-on Setup with Go]] | 8 | 7 | 9 | 3 | intermediate | The OTP service code block is long for a basic-level hands-on note; move the full OTP implementation into its own linked note and keep this  |
> | [[Redis Persistence - RDB and AOF]] | 9 | 8 | 9 | 3 | ok | Add a single decision table up front (cache vs queue vs system-of-record -> RDB/AOF/both) since the variants table in section 5 arrives late |
> | [[Redis Replication, Sentinel and Cluster]] | 9 | 7 | 9 | 3 | ok | The note covers three large mechanisms (replication, Sentinel, Cluster) in one file; splitting Cluster into its own note would reduce the wa |
> | [[Redis Use Cases]] | 8 | 7 | 9 | 7 | ok | Split into focused per-use-case notes instead of one broad survey; several entries (geo, bitmaps, pub/sub) are compressed to a paragraph eac |
> | [[Redis in Production - Memory, Latency, Security]] | 9 | 7 | 9 | 8 | ok | Add a short section on cluster-mode-specific memory/latency quirks (cross-slot ops, resharding pauses), currently only cross-referenced. |

> [!note]- 09 Messaging & Async
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[AWS SQS, SNS and EventBridge]] | 9 | 7 | 9 | 8 | ok | The note is very long (3 services, 2 full code models); splitting SQS from SNS/EventBridge would make it easier to scan in an interview-prep |
> | [[Background Jobs and Worker Pools]] | 9 | 7 | 9 | 8 | intermediate | Frontmatter says level: basic but the content (fencing tokens, autovacuum/dead-tuple mechanics, lease-vs-lock subtleties) is intermediate-to |
> | [[Backpressure and Flow Control]] | 9 | 7 | 9 | 8 | ok | The M/M/1 latency-vs-utilization claim is presented as a general rule without a small table/graph of the curve; a tiny chart would make the  |
> | [[Dead Letter Queues and Poison Messages]] | 9 | 8 | 9 | 2 | ok | Add a direct side-by-side diagram contrasting SQS/RabbitMQ/Kafka DLQ mechanics instead of three separate prose sections. |
> | [[Delivery Semantics and Exactly-Once]] | 10 | 8 | 10 | 2 | ok | Add a diagram walking through Kafka's producer-epoch fencing mechanism specifically, since it's described only in prose. |
> | [[Event Schemas and Schema Registry]] | 9 | 8 | 9 | 2 | ok | Clarify upfront that the Go compatibility checker is a deliberately stricter stand-in (it already says so, but burying it in the code commen |
> | [[Event-Driven Architecture Basics]] | 8 | 8 | 9 | 3 | should be intermediate | Retag as intermediate (or split the deep-dive section on bounded contexts/delta-event traps into a separate advanced note), since the conten |
> | [[Kafka and Event Streaming]] | 10 | 7 | 10 | 3 | ok | The note is very long and code-heavy for one sitting; consider moving the full Go partitioner/consumer-group implementation into a companion |
> | [[Message Ordering and Partition Keys]] | 9 | 7 | 9 | 2 | ok | Trim repetition across the whiteboard/Go/SQL versions of the same version-check idea to shorten the read. |
> | [[Queues vs Streams and Broker Comparison]] | 9 | 7 | 9 | 3 | should be intermediate | Frontmatter says basic but the content (internals, ack semantics across 10 systems, production failure modes) is intermediate-to-advanced de |
> | [[Redis as a Queue - Lists, Streams and Pub-Sub]] | 9 | 6 | 9 | 2 | ok | Shorten the repeated raw redis-cli/measured-output transcripts in section 3 to their key lines so the note reads less like a wall of termina |
> | [[Scheduled Jobs - Cron to Durable Schedulers]] | 9 | 7 | 9 | 3 | ok | Consolidate the Level 1/2/3 progression with the later Kubernetes CronJob settings subsection, which restates several of the same points. |
> | [[Stream Processing Basics]] | 10 | 6 | 10 | 2 | ok | Add a short Kafka Streams code snippet alongside the Flink SQL example so the comparison table's two main engines both get a concrete worked |
> | [[Transactional Outbox and CDC]] | 9 | 7 | 9 | 7 | ok | Trim the two full Go code blocks (toy relay + tests) into one shorter illustrative snippet; the prose and SQL already carry most of the teac |
> | [[Workflow Engines and Durable Execution]] | 9 | 7 | 9 | 7 | ok | The toy engine and the real Temporal SDK example both run long; cut the toy engine's test file to 2-3 representative tests to shorten the wa |

> [!note]- 10 Distributed Systems & Resilience
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Bulkheads and Concurrency Limits]] | 9 | 7 | 9 | 7 | should be advanced | Frontmatter says intermediate, but the content (Little's Law derivation, Go netpoller/scheduler internals, adaptive AIMD/Vegas limits, cgo t |
> | [[CAP and PACELC]] | 8 | 7 | 8 | 7 | should be intermediate | Frontmatter says basic, but the note covers the Gilbert-Lynch proof sketch, PACELC classification across real systems, and DynamoDB-vs-Dynam |
> | [[CQRS]] | 9 | 7 | 9 | 7 | ok | The level-1/level-3 SQL examples and the full Go projector with six tests overlap in what they teach; one worked example (the Go one) would  |
> | [[CRDTs and Conflict Resolution]] | 9 | 7 | 9 | 2 | ok | Trim the duplicated whiteboard + full-implementation Go blocks into one progressively-built example to cut the wall-of-code feel. |
> | [[Circuit Breaker]] | 8 | 7 | 9 | 2 | intermediate | Frontmatter says level: basic, but the content (generation counters, ring-buffer windows, gobreaker internals, Envoy outlier-detection nuanc |
> | [[Clocks and Ordering]] | 9 | 7 | 9 | 2 | ok | Add a small diagram for TrueTime's commit-wait interval — it is currently explained only in prose, unlike every other mechanism in the note. |
> | [[Consensus - Raft and Paxos]] | 10 | 7 | 10 | 2 | ok | A short diagram for joint-consensus membership changes would help, since that's explained only in text in the deep dive while every other me |
> | [[Consistency Models]] | 9 | 7 | 9 | 2 | ok | The linearizable-vs-serializable distinction (the note's own stated classic mistake) appears only once near the top; repeating it as a one-l |
> | [[Distributed Locks and Fencing Tokens]] | 9 | 7 | 9 | 2 | ok | the Redlock debate and etcd-internals deep dive are dense prose; a small comparison diagram (Redis vs etcd vs ZK token flow) would make the  |
> | [[Distributed Systems Fundamentals]] | 9 | 7 | 9 | 2 | intermediate | frontmatter says level: basic but the content (FLP impossibility, Byzantine fault bounds, phi-style math, metastable failures) is intermedia |
> | [[Event Sourcing]] | 9 | 7 | 9 | 2 | ok | the Go worked example is long (three code blocks plus tests); a short table mapping each test name to the invariant it proves would let a re |
> | [[Failure Detection, Gossip and Membership]] | 10 | 7 | 9 | 2 | ok | the gossip-rounds simulation table is presented as measured data but the methodology (seed, push-only vs push-pull, exact fanout model) is c |
> | [[High Availability and Failover]] | 8 | 8 | 9 | 2 | ok | the failover sequence diagram shows one Patroni-like timeline with a single estimate; adding a worst-case row (e.g. majority unreachable, re |
> | [[Leader Election]] | 9 | 7 | 9 | 2 | ok | The whiteboard pseudocode, full Go Elector/Store implementation, and the etcd variant cover the same ground three times; compressing to one  |
> | [[Load Shedding and Graceful Degradation]] | 9 | 6 | 9 | 3 | should be advanced | Frontmatter says intermediate but the content (AIMD math, Vegas/Gradient limiters, CoDel, brownout control, static stability) is advanced-le |
> | [[Multi-Region Architecture]] | 9 | 6 | 9 | 3 | ok | Many numbers are explicitly labeled 'estimate', which is honest, but there are so many of them (RTT figures, RTO stage table, RPO math) scat |
> | [[Quorums and Leaderless Replication]] | 9 | 7 | 9 | 3 | ok | Strongest and most tightly written of the batch; the only gap is it never contrasts version vectors with vector clocks by name, which interv |
> | [[Saga Pattern]] | 9 | 6 | 9 | 4 | ok | The orchestrator implementation plus its six-test suite is the longest code block in the batch; splitting it into a companion ' - Go' note w |
> | [[Timeouts, Retries and Backoff]] | 9 | 7 | 9 | 2 | frontmatter says basic but content | either trim section 8's advanced material or relabel the note's level to intermediate so frontmatter matches depth |
> | [[Two-Phase Commit]] | 10 | 8 | 10 | 2 | ok | add a small diagram for the Percolator primary-lock variant, which is currently only described in prose/table |

> [!note]- 11 System Design
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Back-of-the-Envelope Estimation]] | 7 | 8 | 9 | 2 | ok | add one short worked example with a wrong/naive estimate corrected, to make the 'why precision doesn't matter' point concrete rather than as |
> | [[Bloom Filters and Probabilistic Data Structures]] | 9 | 7 | 9 | 2 | ok | add a small diagram for the Count-Min Sketch grid/min-of-rows mechanism, which currently only has code and prose while every other structure |
> | [[Case Study - Ad Click Aggregation]] | 10 | 6 | 10 | 4 | ok | the note is very long and dense end-to-end; a summary architecture recap or navigation aid before section 8's deep dive would reduce the wal |
> | [[Case Study - Chat System]] | 9 | 7 | 9 | 3 | advanced | trim the two large Go code blocks (service + full test suite) so the design narrative isn't crowded by implementation detail |
> | [[Case Study - Distributed Job Scheduler]] | 10 | 7 | 10 | 4 | ok | shorten the long Go test file (7 tests) to 2-3 that each illustrate a distinct failure mode, rather than near-exhaustive coverage |
> | [[Case Study - Distributed Message Queue]] | 10 | 7 | 10 | 3 | ok | add a small diagram of the sparse offset index lookup (segment -> index -> scan) since the mechanism is described only in prose/code, unlike |
> | [[Case Study - File Storage and Sync]] | 10 | 7 | 10 | 5 | ok | the CDC vs fixed-chunking Go section is excellent but long; could move the full test file to a shorter excerpt and keep only the measured re |
> | [[Case Study - Key-Value Store]] | 9 | 7 | 9 | 3 | advanced | add a small diagram for Merkle-tree anti-entropy (the one mechanism in the deep dive explained only in prose, unlike hinted handoff and read |
> | [[Case Study - Leaderboard and Top-K]] | 8 | 7 | 9 | 3 | frontmatter says intermediate, but conte | add a small diagram showing cross-shard rank aggregation (ZCOUNT sum) visually instead of only prose |
> | [[Case Study - Metrics and Logging Platform]] | 9 | 6 | 9 | 4 | ok | the Go section (limiter + downsampler + tests) is long relative to the rest; trimming or collapsing the test file would ease reading without |
> | [[Case Study - News Feed]] | 8 | 7 | 9 | 4 | ok | add a small diagram for the ranking pipeline (candidate generation -> features -> scoring -> re-rank) instead of only the numbered prose lis |
> | [[Case Study - Notification System]] | 8 | 7 | 9 | 4 | slightly deeper than typical intermediat | add a small diagram for the admission gate's decision flow (dedupe -> preferences -> quiet hours -> cap) since it's currently only a numbere |
> | [[Case Study - Payment System]] | 10 | 6 | 9 | 4 | ok | the Go section plus five test functions is very long; moving some tests into a collapsed/appendix block would reduce wall-of-code feel while |
> | [[Case Study - Ride Sharing and Proximity]] | 9 | 7 | 9 | 9 | ok | Trim the geohash cell-size derivation table slightly; it's dense next to an already-long worked example. |
> | [[Case Study - Search Autocomplete]] | 8 | 8 | 9 | 7 | ok | Add one more diagram showing the sharded-trie routing layout, since sharding is covered in text only. |
> | [[Case Study - Ticket Booking]] | 9 | 7 | 10 | 9 | advanced | Retag level to advanced — the isolation-level re-check semantics and deadlock/SKIP LOCKED discussion go past 'intermediate'. |
> | [[Case Study - URL Shortener]] | 8 | 8 | 9 | 8 | intermediate | Retag level to intermediate — the Feistel/bijective-scramble and birthday-bound math exceed a 'basic' note. |
> | [[Case Study - Video Streaming]] | 9 | 7 | 10 | 9 | ok | The transcoding-compute estimate (20 CPU-s/s of video) could use a cited reference or at least a wider stated range, since it's flagged as v |
> | [[Case Study - Web Crawler]] | 9 | 8 | 9 | 3 | ok | Trim the duplication between the ASCII whiteboard and the mermaid flowchart in section 3 - they say the same thing twice before any new cont |
> | [[Geospatial Indexing]] | 9 | 8 | 9 | 2 | ok | Add one small diagram contrasting Z-order vs Hilbert curve locality (the deep-dive explains it well in prose but a picture would land it fas |
> | [[Hot Keys and Hot Partitions]] | 9 | 8 | 9 | 3 | ok | The fix-menu prose list and the decision flowchart right after it repeat the same branches - fold one into the other. |
> | [[Load Balancing]] | 8 | 8 | 9 | 2 | should be intermediate | Frontmatter says level: basic but the content (smooth WRR math, P2C proof, Maglev, consistent-hash routing, tested Go benchmarks) is interme |
> | [[Rate Limiting - Algorithms and Distributed Design]] | 10 | 7 | 9 | 4 | should be advanced | Frontmatter says level: intermediate but it covers GCRA derivation, Redis Cluster CROSSSLOT/hash-tag mechanics, hybrid local+global overshoo |
> | [[Scaling Basics]] | 9 | 7 | 9 | 2 | should be intermediate | trim or relocate the dense Amdahl/USL Go code so the formulas and numbers breathe on their own |
> | [[Scaling WebSockets]] | 9 | 6 | 9 | 3 | ok | split the ~350-line hub/registry/replay-buffer Go block into a linked companion code note so the theory flow isn't broken up |
> | [[Service Discovery]] | 9 | 7 | 9 | 3 | ok | add one diagram contrasting CP vs AP registry behavior during a network partition, since that distinction is argued only in prose |
> | [[System Design Fundamentals]] | 8 | 7 | 9 | 2 | ok | the building-block table and the mermaid catalogue diagram repeat the same information twice; merge them |
> | [[System Design Interview Framework]] | 8 | 8 | 9 | 2 | ok | walk a second case study (e.g. a write-heavy one) through the time budget, since the only worked example given is the read-heavy URL shorten |
> | [[Unique ID Generation]] | 9 | 7 | 9 | 2 | ok | Trim the three successive Go code blocks (whiteboard, full generator, tests) in section 4 — the whiteboard and full versions overlap enough  |

> [!note]- 12 Security & Auth
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[API Abuse and Bot Protection]] | 9 | 7 | 9 | 3 | ok | The threat catalog table and the worked-example risk engine partially restate the same thresholds twice (prose + code comments); consolidati |
> | [[Access and Refresh Tokens]] | 8 | 7 | 9 | 3 | ok | Add a short explicit note on PKCE's relationship to refresh-token security for public clients (mentioned only implicitly via RFC 9700), sinc |
> | [[Authentication vs Authorization]] | 8 | 7 | 9 | 2 | should be intermediate | Frontmatter says 'basic' but the deep-dive content (ReBAC/Zanzibar internals, OPA, row-level security, caching authorization decisions with  |
> | [[CORS and Same-Origin Policy]] | 8 | 7 | 9 | 3 | ok | The variants table and the deep-dive both cover the suffix/substring allowlist pitfall almost verbatim; merge into a single callout to avoid |
> | [[CSRF, XSS and Security Headers]] | 9 | 7 | 9 | 3 | ok | Trim the two full Go test blocks (CSRF token + headers) into one condensed snippet so the note reads less like a code dump and more like not |
> | [[JWT - Structure, Validation and Pitfalls]] | 9 | 7 | 9 | 3 | ok | Add a small comparison diagram/table of the three revocation strategies (short exp, jti denylist, token-version) ranked by cost vs responsiv |
> | [[OAuth 2.0 and OpenID Connect]] | 10 | 6 | 9 | 4 | ok | The note is dense enough (4 sequence/flow diagrams, 3 full Go files, 10 sections) that it would read faster split into a core OAuth note plu |
> | [[OWASP API Security Top 10]] | 8 | 7 | 9 | 2 | ok | The worked example only codes BOLA/BOPLA; add a short runnable snippet for BFLA (role check in a handler) since it's called out as equally c |
> | [[Password Storage and Login Security]] | 9 | 7 | 9 | 3 | ok | Add a small bar-style comparison (even as a table) of guesses/sec for SHA-256 vs bcrypt vs argon2id at stated parameters, since the note cur |
> | [[Secrets Management]] | 9 | 6 | 9 | 3 | advanced | Trim the ~200-line Go envelope-encryption example (two files plus tests) relative to the theory, or split it into a companion '- Go' note, s |
> | [[Service-to-Service Auth - API Keys, HMAC, mTLS]] | 10 | 6 | 9 | 4 | ok | The 'whiteboard version' HMAC snippet is immediately followed by a near-duplicate full implementation; collapse the two or make the whiteboa |
> | [[Sessions and Cookies]] | 8 | 7 | 9 | 3 | ok | The TL;DR, cheat sheet, and several interview-question answers restate the same four or five facts (rotation fixes fixation, HttpOnly doesn' |

> [!note]- 13 DevOps & Cloud
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[AWS 01 - Core Concepts (Regions, AZs, Accounts, Shared Responsibility)]] | 9 | 7 | 9 | 4 | should be intermediate | Anchor the AZ-failure correlation claim and the 39-regions/124-AZs count with a date-stamped citation inline (not just in frontmatter source |
> | [[AWS 02 - IAM]] | 10 | 6 | 10 | 3 | ok | The policy anatomy section introduces Condition keys as a key policy element, but the tested Go simulation (iamsim) drops Condition entirely |
> | [[AWS 03 - VPC Networking]] | 9 | 7 | 9 | 4 | should be advanced | Trim the two earlier NAT/endpoint diagrams which overlap in content; one consolidated diagram would read faster. |
> | [[AWS 04 - Compute Choices - EC2, ECS-Fargate, EKS, Lambda]] | 9 | 7 | 8 | 2 | should be advanced | The Go code section (Little's Law sizing) is useful but could be shortened; the three sizing functions overlap conceptually and a reader cou |
> | [[AWS 05 - ECS, Fargate and ECR]] | 9 | 7 | 9 | 2 | should be advanced | Add a one-line callout distinguishing the container-level HEALTHCHECK from the ALB target-group health check earlier, since both are mention |
> | [[AWS 06 - Load Balancing (ALB vs NLB)]] | 9 | 7 | 9 | 2 | should be advanced | The variants table is dense (6 columns); splitting ALB/NLB/CLB/GWLB into two smaller tables (modern vs legacy) would ease scanning. |
> | [[AWS 07 - S3]] | 9 | 7 | 9 | 3 | should be advanced | The lifecycle/storage-class stateDiagram shows a single linear path (Standard→IA→Glacier IR→Deep Archive→Expired) which could mislead reader |
> | [[AWS 08 - RDS and Aurora]] | 9 | 7 | 9 | 2 | ok | Clarify whether the quoted $0.35-0.40/hr db.r6g.large figure is already the Multi-AZ (doubled) price or the single-instance price before dou |
> | [[AWS 09 - Route 53 and ACM]] | 9 | 7 | 9 | 3 | should be intermediate | Frontmatter says level: basic but the deep-dive content (alias record internals, distributed health-check evaluation, ACM renewal mechanics) |
> | [[AWS 10 - CloudWatch]] | 9 | 7 | 9 | 3 | ok | The EMF Go code block is long relative to the concept it teaches; a shorter inline snippet with the full implementation linked out would eas |
> | [[Deploying a Go API on AWS (Reference Architecture)]] | 10 | 6 | 9 | 3 | ok | At 378 lines with multiple large tables (cost, glossary, troubleshooting) plus full code, this is the densest note in the set; consider spli |
> | [[Infrastructure as Code with Terraform]] | 9 | 7 | 9 | 2 | ok | The Go CI-gating example (tfplan package) is solid but tangential to core Terraform mechanics; a shorter version with the rest linked to a r |
> | [[Cloud Computing Basics]] | 7 | 7 | 8 | 2 | ok | Trim the pricing-model and cost-trap sections slightly — they partly overlap and could be a single consolidated table. |
> | [[Cloud Native and the 12-Factor App]] | 8 | 6 | 9 | 2 | ok | The Go code example (config loading + graceful shutdown) is useful but long for a conceptual note — could be shortened or moved to a linked  |
> | [[Autoscaling]] | 9 | 6 | 9 | 3 | ok | Very long for one sitting — consider splitting KEDA/AWS-policy-type material into its own note so the HPA/VPA/Cluster-Autoscaler core stays  |
> | [[CI-CD Pipelines (GitHub Actions for Go)]] | 9 | 6 | 9 | 2 | ok | The full GitHub Actions YAML workflow is thorough but very long to read inline — collapsing it under a details block or trimming repeated OI |
> | [[Deployment Strategies - Rolling, Blue-Green, Canary]] | 9 | 6 | 9 | 2 | ok | Add a small diagram showing blast-radius-vs-traffic-percentage numerically (the worked example's math is strong but stays text-only). |
> | [[Feature Flags]] | 8 | 8 | 8 | 2 | ok | Add a short section on SDK memory/CPU cost of holding large rule sets and on flag-service multi-region consistency, since the note otherwise |
> | [[Kubernetes Fundamentals]] | 9 | 6 | 9 | 5 | should be advanced | Note is dense and long (387 lines, 10 sections each with heavy bullet lists) - split into a base note plus a deep-dive companion, or trim se |
> | [[Rollback and Safe Migrations]] | 9 | 7 | 9 | 3 | ok | The 'Rolls back / Doesn't roll back' table and the mechanisms-by-layer list partially overlap - merge them so the reader sees one canonical  |
> | [[Docker 01 - Why Containers]] | 6 | 9 | 8 | 2 | ok | Main-text mental model lists only 4 namespaces (PID, mount, network, cgroups) while the interview Q&A mentions UTS/IPC/user namespaces too - |
> | [[Docker 02 - Images, Layers and Containers]] | 7 | 8 | 9 | 3 | ok | Add one concrete docker build/docker history walkthrough showing a cache-busting reorder fix in action, since the trade-offs section describ |
> | [[Docker 03 - CLI Essentials]] | 8 | 8 | 9 | 8 | intermediate | Content depth (scratch/distroless exec workaround, prune risk analysis, PID-1 signal nuance) runs ahead of the 'basic' frontmatter tag — rel |
> | [[Docker 04 - Writing a Production Dockerfile for Go]] | 9 | 7 | 9 | 8 | ok | The two near-duplicate graceful-shutdown Go test blocks make this the densest note in the set — trim one or move the full test file to a lin |
> | [[Docker 05 - Networking and Port Publishing]] | 9 | 8 | 9 | 9 | ok | Add a brief line on IPv6/dual-stack port publishing (Docker's IPv4-only default networks), an increasingly common interview trap this note o |
> | [[Docker 06 - Volumes and Bind Mounts]] | 9 | 8 | 9 | 8 | ok | Add a short comparison of volume drivers (local vs NFS/cloud-backed) since that bridges directly into the Kubernetes PersistentVolume discus |
> | [[Docker 07 - Docker Compose for Local Development]] | 8 | 8 | 9 | 8 | ok | Cover `docker compose up --abort-on-container-exit`/exit-code propagation for CI integration-test runs — a common real-world Compose-in-CI g |
> | [[Docker 08 - How Docker Works Under the Hood]] | 9 | 8 | 9 | 3 | ok | Trim the dense §3 call-chain/namespace/overlay2 prose into shorter sub-sections so it reads less as one long block before the diagrams. |
> | [[Docker 09 - Container Security and Hardening]] | 9 | 8 | 9 | 2 | ok | Add one concrete Trivy/cosign CLI output example (like the Dockerfile linter's test output) so the supply-chain diagram has a matching worke |

> [!note]- 14 Observability & SRE
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Alerting and On-Call]] | 9 | 7 | 9 | 3 | advanced | Frontmatter says 'intermediate' but the burn-rate derivation, Alertmanager internals, and per-cohort alerting content are advanced-level — b |
> | [[Debugging Database Performance]] | 9 | 7 | 9 | 2 | ok | Add a short diagram or table for MVCC bloat/autovacuum lag, which is only mentioned once in the production section despite being a common si |
> | [[Debugging Memory Leaks and OOMs in Go]] | 9 | 7 | 9 | 3 | ok | Add a small diagram or timeline plotting RSS vs. go_heap_inuse_bytes over time to make the lazy-reclamation point (currently only explained  |
> | [[Distributed Tracing with OpenTelemetry]] | 9 | 7 | 9 | 8 | ok | trim redundancy between the whiteboard intro and the worked example's span tree so the note reads faster |
> | [[Incident Response]] | 8 | 8 | 9 | 7 | ok | add a short worked postmortem excerpt so the handoff from this note to Postmortems and Root Cause Analysis is concrete |
> | [[Latency, Percentiles and Bottleneck Analysis]] | 10 | 7 | 10 | 7 | ok | a small plot/diagram of the M/M/1 wait-time curve (rho/(1-rho)) would make the 'knee' concept even more concrete alongside the prose explana |
> | [[Metrics and Prometheus]] | 8 | 8 | 9 | 6 | should be intermediate | frontmatter says level: basic but content (recording rules, native histograms, cardinality-as-product math, summary-vs-histogram aggregation |
> | [[Observability Fundamentals]] | 7 | 9 | 9 | 7 | ok | the 'wide events' critique and push-vs-pull explanation could use one more concrete numeric example (like the cardinality-explosion one) to  |
> | [[Performance Engineering and Capacity Planning]] | 9 | 6 | 7 | 2 | ok | Reconcile the whiteboard arithmetic with the ServersNeeded formula's order of operations (headroom on concurrency, not on the rounded pod co |
> | [[Postmortems and Root Cause Analysis]] | 9 | 7 | 9 | 3 | ok | The ActionItem validator Go section is useful but could be tightened — it restates the same owner/due-date point the prose already made thre |
> | [[Production Debugging Playbook]] | 9 | 7 | 9 | 2 | ok | The tool cheat-sheet table lists what each tool answers but no sample output except the one DBStats block later — adding one line of represe |
> | [[Production Readiness Review]] | 9 | 6 | 9 | 2 | ok | The nine checklist areas are explained as prose paragraphs under a mental-model table; collapsing them into one scannable table (area, pass  |
> | [[SLIs, SLOs, SLAs and Error Budgets]] | 9 | 7 | 9 | 2 | ok | The dependency-math section (availabilities multiplying across a call chain) is dropped with one example and no worked Go/test the way error |
> | [[Structured Logging]] | 7 | 8 | 9 | 2 | intermediate | Add a concrete sampling-implementation code snippet instead of only describing it in prose |

> [!note]- 15 Testing
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Chaos Engineering]] | 9 | 8 | 9 | 2 | ok | Add a short example of a game-day runbook or blast-radius progression schedule |
> | [[Contract Testing]] | 8 | 7 | 9 | 2 | ok | Trim the overlapping tables in sections 3 and 5 which repeat the contract-vs-schema comparison twice |
> | [[Fuzz and Property-Based Testing]] | 8 | 7 | 9 | 2 | ok | Show a brief gopter code example since the worked example only demonstrates rapid, despite the comparison table covering both |
> | [[Load and Performance Testing]] | 8 | 7 | 9 | 2 | ok | Include an actual k6 script snippet instead of relying only on prose plus a representative text output block |
> | [[Test Data Strategy]] | 8 | 7 | 8 | 2 | ok | Section 4's worked example is long relative to its teaching payoff; trim the full builder code and keep only the parts that differ from the  |
> | [[Test Doubles and Mocking in Go]] | 8 | 7 | 8 | 2 | intermediate | Frontmatter says 'basic' but content (consumer-side interfaces, codegen vs hand-written trade-offs, sqlmock internals) is clearly intermedia |
> | [[Testing Async and Event-Driven Systems]] | 9 | 7 | 9 | 2 | ok | The fakeClock implementation (registered channel, waiter slice) is dense; a short annotated walk-through of why WaitForWaiters avoids the lo |
> | [[Testing Strategy and the Test Pyramid]] | 8 | 8 | 9 | 3 | intermediate | Frontmatter says 'basic' but the trophy/honeycomb shapes, CI-stage mapping and flaky-smell taxonomy go beyond an intro note; it reads as the |
> | [[Testing in CI-CD, Flaky Tests and Testing in Production]] | 9 | 7 | 9 | 3 | ok | Very long note (12 sections, dense tables); splitting the canary/feature-flag material (3.5-3.6) into its own note would make each piece eas |
> | [[Unit, Integration and E2E Tests]] | 8 | 6 | 9 | 2 | ok | Add a short section on consumer-driven contract testing for service boundaries, a common SDE-3-level gap between integration and E2E. |

> [!note]- 16 Software Architecture
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Architecture Decision Records]] | 9 | 6 | 9 | 3 | ok | Show one worked example of a Rejected or Superseded ADR (not just Accepted) to make the full lifecycle concrete, not just stated in the stat |
> | [[Architecture Fundamentals - Coupling, Cohesion and Dependency Direction]] | 8 | 6 | 8 | 3 | ok | The Stable Dependencies / connascence deep-dive content is denser than the 'basic' label suggests; either trim it or relabel as intermediate |
> | [[Clean Architecture]] | 9 | 5 | 9 | 2 | ok | The worked example is very long (4 rings, full HTTP stack); a shorter 'if you only have 10 minutes' version up front would help readers who  |
> | [[Documenting Architecture - C4 Diagrams and Fitness Functions]] | 9 | 6 | 9 | 6 | ok | Mention an existing real tool (go-arch-lint or ArchUnit config snippet) alongside the homegrown importrules checker, since in practice SDE-3 |
> | [[Domain-Driven Design - Strategic Design]] | 8 | 7 | 9 | 3 | ok | add a concrete before/after example of a context map relationship actually changing over time |
> | [[Domain-Driven Design - Tactical Patterns in Go]] | 9 | 6 | 9 | 2 | ok | the worked example's code block is very long for one sitting; split it into smaller labeled excerpts or collapse boilerplate |
> | [[Hexagonal Architecture (Ports and Adapters)]] | 8 | 7 | 9 | 2 | ok | add a small diagram contrasting an adapter-shaped port vs a business-shaped port side by side, since that trap is called out twice in prose  |
> | [[Inversion of Control - Library vs Framework]] | 7 | 8 | 8 | 3 | ok | the DI-container and platform/SDK material pushes past a 'basic' label; consider flagging those subsections as intermediate or moving the wi |
> | [[Layered Architecture]] | 8 | 7 | 9 | 3 | ok | add a short note on the test-pyramid shape (approx. unit vs integration ratio) this architecture naturally produces, since testing-per-layer |
> | [[Modular Monolith]] | 9 | 6 | 9 | 2 | ok | Trim the worked-example code volume (two full test files plus the arch-test package) so the core mechanism isn't buried; a shorter excerpt w |
> | [[Monolith vs Microservices]] | 8 | 7 | 9 | 3 | should be intermediate | Relabel frontmatter level from basic to intermediate — the content (distributed monolith, saga/outbox trade-offs, Conway's law as a decision |
> | [[Strangler Fig Pattern and Legacy Migration]] | 9 | 6 | 9 | 4 | ok | The facade worked example (ShadowFacade, PercentCanary, full test suite) is long relative to the prose sections above it; consider trimming  |

> [!note]- 17 LLD
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Concurrency for LLD]] | 10 | 6 | 9 | 4 | ok | The single worked-example section runs through six separate code patterns back to back (store, wallet, seat booker, pool, config, semaphore/ |
> | [[Design Patterns Overview and Chooser]] | 7 | 7 | 8 | 2 | ok | Add one concrete end-to-end diagram showing several patterns composed in a single real request path (the checkout example is described in pr |
> | [[Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion]] | 8 | 7 | 9 | 2 | intermediate | Frontmatter says level: basic but the connascence/Law of Demeter/composition depth is intermediate-to-advanced; relabel or split a basic sub |
> | [[LLD Interview Method]] | 9 | 7 | 9 | 3 | intermediate | Labeled basic but covers SDE-3-specific content (idempotency keys, fencing tokens, multi-instance correctness) — relabel level. |
> | [[LLD Problem Cheat Sheet]] | 7 | 8 | 9 | 0 | ok | Add a diagram-free quick visual (e.g., a small matrix of concurrency hazard families) since this is a pure reference table otherwise. |
> | [[OOP in Go - Structs, Interfaces, Embedding]] | 9 | 7 | 10 | 2 | intermediate | Labeled basic but method-set/promotion-depth rules and typed-nil interface internals are intermediate+ content — relabel. |
> | [[Adapter]] | 9 | 8 | 9 | 2 | ok | The context-less-SDK timeout trick (goroutine + buffered channel + select) deserves its own small flowchart distinct from the sequence diagr |
> | [[Builder and Functional Options]] | 9 | 7 | 9 | 2 | ok | Split the long worked-example code block (3 sub-systems: client, grpc-style options, query builder) into separately headed mini-sections so  |
> | [[Chain of Responsibility and Pipelines]] | 9 | 7 | 9 | 3 | ok | The four forms in the worked example (classic chain, pipeline, ATM linked chain, HTTP middleware) could use a short orienting table up front |
> | [[Command, Undo and Memento]] | 9 | 7 | 9 | 3 | ok | The worked example packs four distinct subsystems (command/closure, durable envelope+worker, undo/redo, memento) into one file; a short tabl |
> | [[Composite]] | 9 | 7 | 9 | 2 | ok | The SQL persistence section (adjacency list, closure table, materialized path) is valuable but could be its own linked note; folding it into |
> | [[Decorator and Middleware]] | 9 | 7 | 9 | 3 | ok | Section 8's two competing fixes for 'one log line per request, panics included' are presented as equally valid without a clear default recom |
> | [[Facade (vs Mediator)]] | 9 | 6 | 9 | 4 | should be advanced | Trim the dual-topic worked example or split Facade and Mediator into two notes so the core idea isn't buried under ~800 lines of code. |
> | [[Factory and Abstract Factory]] | 9 | 6 | 9 | 2 | should be advanced | Add a short table up front distinguishing the four forms (simple/method/abstract/registry) before diving into the class diagram, so the taxo |
> | [[Iterator and range-over-func]] | 9 | 7 | 9 | 2 | should be advanced | The four-style comparison table in section 3 is excellent but appears before any code; move it just before section 5's variants table so it  |
> | [[Observer and Event Bus]] | 9 | 6 | 9 | 2 | should be advanced | The AsyncSubscriber Close()/lock-discipline section is the hardest and most valuable part of the note but is explained only in dense prose;  |
> | [[Proxy]] | 9 | 6 | 9 | 2 | should be advanced | Add a one-line summary diagram of the proxy stack order (auth -> cache -> lazy -> remote) near section 2's mental model, since the stacking- |
> | [[Rare GoF Patterns in Go]] | 9 | 7 | 9 | 9 | ok | trim breadth (6 patterns in one note) into a shorter core treatment with links out, so first pass is less of a wall |
> | [[Repository and Unit of Work]] | 8 | 7 | 9 | 6 | ok | add a small diagram showing MVCC/Read-Committed re-check visually, since the whole 'CAS is safe' claim hinges on it and is currently only pr |
> | [[Singleton and sync.Once]] | 8 | 7 | 9 | 6 | ok | the decision flowchart and code examples overlap heavily; could fold the per-key-singleton idea into the flowchart as a fifth leaf |
> | [[State Machines in Go]] | 9 | 7 | 9 | 8 | ok | add a small diagram contrasting status-only CAS vs version-column CAS to make the ABA problem visible, not just described in prose |
> | [[Strategy and Template Method]] | 9 | 7 | 9 | 8 | ok | the Strategy/State/Bridge decision table and flowchart say the same thing twice; merge into one to cut length |
> | [[ATM]] | 9 | 6 | 9 | 3 | should be advanced — bounded change-maki | Trim the repeated restatement of the same five ideas (state machine, DP planner, debit-dispense order, idempotency, int64 paise) across the  |
> | [[Cart Checkout with Coupons]] | 9 | 5 | 9 | 3 | should be advanced — the lease/attempt-n | Give the lease-fencing/takeover mechanism (the hardest part of the note, and the part most likely to be gotten wrong in an interview) its ow |
> | [[Circuit Breaker]] | 8 | 7 | 9 | 3 | ok | TestConcurrentHalfOpenAdmitsOnlyProbeLimit synchronizes with a busy-wait `time.Sleep` polling loop rather than a channel/WaitGroup signal (a |
> | [[Delivery Partner Assignment]] | 9 | 5 | 9 | 5 | should be advanced — the decide/call/re- | The note is very long (1394 lines) and restates the same core ideas (lock scope, fallback chain, claim-then-check) across the TL;DR, walkthr |
> | [[Digital Wallet and Ledger]] | 9 | 6 | 9 | 3 | ok | Move the idempotency-key lifecycle state diagram (currently only near the very end, after Drawing) up closer to where Acquire/Complete/Relea |
> | [[Elevator System]] | 9 | 6 | 9 | 3 | basic | Frontmatter says level: basic but the content (concurrency-safe dispatcher, LOOK scheduling, fire-recall ASME detail, -race tested concurren |
> | [[File Search (Unix find)]] | 9 | 6 | 9 | 3 | intermediate | Frontmatter level: intermediate undersells the content (Composite+Interpreter, fuzzing, fork-join parallel walk, DFS/BFS determinism gaps) w |
> | [[Food Ordering System]] | 9 | 6 | 9 | 3 | ok | Add a small diagram for the idempotency-key / pending-map flow (double-tap dedup) - currently explained only in dense prose and code, unlike |
> | [[Hotel Booking]] | 10 | 6 | 10 | 3 | ok | Add a visual (not just the comparison table) contrasting Model A (per-night counters) vs Model B (exclusion-constraint ranges) since this is |
> | [[In-memory KV Store with TTL and Transactions]] | 8 | 7 | 9 | 2 | ok | Add a diagram for active-expiry sampling (the janitor's bounded-rounds sweep) - the two existing diagrams cover transactions and lazy expiry |
> | [[Inventory Order Assignment (Dark Store)]] | 9 | 6 | 9 | 3 | advanced | Split the idempotency/fencing walkthrough into its own sub-section or add a summary diagram; the prose density in Step 8 is a wall of text f |
> | [[LRU Cache with TTL]] | 8 | 7 | 9 | 3 | intermediate | Trim the production-library comparison (ristretto/golang-lru) into a shorter callout so the core walkthrough reads faster. |
> | [[Library Management]] | 7 | 7 | 8 | 3 | intermediate | Add a small diagram (or annotate the existing state diagram) showing the FIFO hold-and-dequeue flow, which is currently only explained in pr |
> | [[Logging Library]] | 8 | 6 | 9 | 3 | intermediate | Condense the long slog-comparison table into a short paragraph to shorten an already dense note. |
> | [[Meeting Room Scheduler]] | 8 | 7 | 9 | 2 | intermediate | Add a small diagram for the conflictIndex binary-search-plus-two-neighbours check, currently explained only in prose. |
> | [[Movie Ticket Booking]] | 9 | 7 | 9 | 3 | ok | The file is extremely long (~1040 lines) for one sitting; consider splitting the SQL/production-scale material (Steps 6, 9's deadlock handli |
> | [[Notification Service]] | 9 | 7 | 9 | 4 | should be advanced | Frontmatter says level: intermediate but the content (worker pools, decorator/failover chains, full-jitter backoff math, graceful drain sema |
> | [[Order Book Matching Engine]] | 9 | 7 | 9 | 3 | ok | Add one concrete throughput/latency estimate (even order-of-magnitude) for the single-writer channel hop, since the note already flags it as |
> | [[Parking Lot]] | 8 | 8 | 9 | 3 | should be intermediate | Frontmatter says level: basic, but the note teaches SELECT FOR UPDATE SKIP LOCKED, partial unique indexes, fallback allocation strategy, and |
> | [[Pub-Sub Message Queue]] | 9 | 6 | 9 | 3 | ok | The densest of the batch (committed/next/acked/inflight/attempts tracked per subscription plus bounded buffers) — a short upfront glossary t |
> | [[Rate Limiter]] | 9 | 6 | 9 | 3 | advanced | Split the production extensions (Redis Lua scripts, GCRA, sliding-window-counter closed-form math) into a separate advanced companion so the |
> | [[Ride Sharing]] | 10 | 6 | 9 | 4 | ok | Add a small diagram of the ring-search heuristic itself (ring 0, ring 1, the extra ring) since it is called out as a named trap question but |
> | [[Splitwise Expense Sharing]] | 9 | 7 | 9 | 3 | ok | Settle() has no idempotency key even though the edge-case table flags retried settlements as a real risk; implement the same request-ID patt |
> | [[Task Scheduler (delayed and recurring jobs)]] | 9 | 6 | 9 | 3 | advanced | CatchUp's unbounded burst after a long pause is flagged in the edge-case table ('cap the catch-up count') but never implemented or tested; a |
> | [[Tic-Tac-Toe and Snake and Ladder]] | 7 | 7 | 9 | 3 | ok | The undo exercise (Command/Memento) is only described in prose as an exercise for the reader; add the actual code since undo is a common SDE |
> | [[Vending Machine]] | 9 | 6 | 9 | 3 | intermediate | Trim the code listing length (it is a 150-line interview target but the note prints ~350 lines including full tests); move more of the test  |
> | [[SOLID in Go]] | 8 | 7 | 9 | 2 | intermediate | Add one more diagram (e.g. the before/after dependency-direction arrows as a simple two-panel picture) so DIP's inversion is seen, not just  |
> | [[Testing LLD Code]] | 9 | 7 | 9 | 2 | ok | The note is excellent but very code-heavy (6+ full code blocks back to back in section 4); a short recap table right after the code dump wou |
> | [[UML for LLD]] | 8 | 7 | 9 | 6 | intermediate | Nothing structurally missing; the embedding-vs-realization distinction is subtle and could use one more contrasting mini-diagram showing a w |

> [!note]- 18 AI Engineering
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[AI Agents and Agentic Workflows]] | 9 | 7 | 9 | 4 | ok | The worked-example code uses a model constant (anthropic.ModelClaudeSonnet5_5) and claims to compile/pass tests against a real SDK but is ex |
> | [[Advanced RAG Patterns]] | 9 | 7 | 9 | 7 | ok | Add a mechanism diagram for GraphRAG community clustering/traversal and the CRAG grading branch, since those two are only described in prose |
> | [[Calling LLM APIs from Go]] | 8 | 7 | 9 | 6 | should be intermediate | Frontmatter says basic but the content (retry state machine, SSE decoding, token-bucket limiter, full-jitter backoff) is intermediate-level; |
> | [[Case Study - Chat with PDFs and Websites]] | 8 | 7 | 9 | 7 | ok | Add a small diagram for the DNS-rebinding attack timeline (submit-time resolution vs fetch-time resolution), since that's the single trickie |
> | [[Document Ingestion and Chunking]] | 8 | 8 | 9 | 7 | ok | The comparison table claims semantic chunking 'does not reliably beat recursive chunking on recall' as settled fact twice without a citable  |
> | [[Embeddings]] | 9 | 7 | 9 | 6 | ok | Add a small diagram for Matryoshka truncation (full vector vs truncated prefix vs recall trade-off), currently explained only in prose despi |
> | [[Guardrails and LLM Security]] | 9 | 6 | 9 | 2 | ok | Trim the long Go implementation/test block or move it after a shorter conceptual code snippet so the core argument is scannable without wadi |
> | [[Keyword, Semantic and Hybrid Search]] | 9 | 6 | 9 | 2 | ok | Shorten the from-scratch Go BM25/dense/RRF implementation (it is long relative to the concept) and lean more on the formulas/tables already  |
> | [[LLM Cost, Latency and Caching]] | 9 | 7 | 9 | 3 | ok | Add one concrete numeric table showing cumulative cost with vs. without caching over N calls, since the note argues the point narratively bu |
> | [[LLM Evals in Production]] | 8 | 7 | 9 | 3 | ok | Include one concrete LLM-as-judge rubric prompt example (the note describes judges abstractly but never shows an actual judge prompt templat |
> | [[LLM Fundamentals]] | 7 | 7 | 9 | 4 | ok | Add a short diagram/paragraph on the attention mechanism itself (currently the note explains tokens and sampling well but treats the transfo |
> | [[LLM Observability]] | 8 | 7 | 9 | 2 | ok | add a diagram tracing the full 'bad trace -> promoted eval case -> regression caught' loop end to end, since that's called out as the highes |
> | [[LangChain and LangGraph]] | 9 | 7 | 9 | 3 | ok | the note is long with heavy repeated hedging ('verify against current docs') on the Go-alternatives section; tighten that into one caveat st |
> | [[Model Context Protocol (MCP)]] | 9 | 8 | 9 | 2 | ok | add a small diagram contrasting stdio's process-boundary trust model against Streamable HTTP's OAuth trust model side by side, since that di |
> | [[Production AI Checklist]] | 9 | 7 | 9 | 2 | ok | the single worked-example Go block bundles kill switch, breaker, fallback chain, and canary together; splitting it per checklist item with i |
> | [[Prompt Engineering]] | 7 | 8 | 8 | 2 | should be intermediate | frontmatter says level: basic but the note covers prompt-caching prefix mechanics, few-shot order/bias effects and injection defense in real |
> | [[RAG Evaluation]] | 9 | 8 | 9 | 2 | ok | Add a worked numeric example showing recall@k/MRR/nDCG computed on the same small golden set side by side, so the three retrieval metrics' d |
> | [[RAG Pipeline]] | 8 | 8 | 9 | 3 | ok | The latency-budget deep-dive gives rough numbers per stage but no diagram; a small timeline/gantt-style diagram of the per-stage latency bre |
> | [[Structured Outputs and Tool Calling]] | 9 | 8 | 9 | 3 | should be advanced | Content depth (constrained-decoding grammar internals, strict-mode schema limits, parallel tool execution with errgroup) is advanced, not in |
> | [[Vector Databases and ANN Indexes]] | 9 | 7 | 9 | 4 | should be advanced | Note is tagged intermediate but covers HNSW/IVF parameter tuning, quantization trade-offs, RAM sizing math, and sharding at a depth that fit |

> [!note]- 19 Interview & Career
> | Note | D | E | Q | Dg | Level | Improvement |
> |---|---|---|---|---|---|---|
> | [[Backend Roadmap and Tech Landscape]] | 5 | 8 | 8 | 2 | ok | The worked example (order service trace) is good but purely narrative; a small sequence or flow diagram tracing the request through the eigh |
> | [[Zepto-style Product LLD Round]] | 9 | 8 | 9 | 3 | should be advanced | split the very long worked-example code block (service + test) into two sub-sections or move the test file to a callout so the core PlaceOrd |
> | [[Go Interview Questions and Traps]] | 9 | 7 | 9 | 2 | ok | the note is long (9 traps each with 2 snippets); a single summary table up top (already present in section 5) could be promoted earlier so a |
> | [[LLD Round Playbook]] | 7 | 8 | 8 | 3 | should be intermediate, not basic | the time-box table (45/60/90 min) would land better as a small diagram or visual timeline rather than a third table format in a row with the |
> | [[Learning Resources]] | 4 | 9 | 7 | 0 | ok | flag which links are likely stale more specifically (e.g. test the two YouTube links whose titles are marked 'not re-checked') instead of on |
> | [[SDE-3 Readiness Checklist]] | 7 | 8 | 8 | 3 | ok | the per-folder checklist items are currently unchecked placeholders with no actual tracked state (no checkboxes ticked, no dates) — wiring i |

## Missing topics

These are the main gaps against an SDE-3 backend (Go) syllabus. Check each against existing notes before writing it, because some are already partly covered.

1. Behavioural Interview and STAR Story Bank (19)
2. Leadership, Mentoring and Influence at SDE-3 (19)
3. Technical Debt, Estimation and Roadmapping (16)
4. Dynamic Programming Patterns (01)
5. DSA pattern catalog: greedy, intervals, monotonic stack, bit manipulation, segment/Fenwick trees (01)
6. Case Study - Distributed Cache (11)
7. Case Study - E-commerce, Inventory and Flash Sale (11)
8. Case Study - Collaborative Editor (11)
9. Case Study - Hotel Booking / Stock Exchange (11)
10. Case Study - Photo Sharing, Social Graph, Pastebin (11)
11. LLD Practice - Chess, Stack Overflow, Online Judge, Cricket Scoreboard (17)
12. Kubernetes Advanced, Service Mesh and GitOps (13)
13. AWS Data and Serverless - DynamoDB, Lambda, ElastiCache, CloudFront, API Gateway (13)
14. SSO/SAML, Encryption and Compliance (12). RBAC/ABAC is already covered in [[Authentication vs Authorization]]
15. Data Pipelines, Warehousing and Batch Processing (07)

## Links

- [[Home]] · [[Study Index]]
