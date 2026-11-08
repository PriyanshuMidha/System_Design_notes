---
tags: [cs-fundamentals, os, memory, go]
level: intermediate
status: reviewed
prereqs: ["[[Virtual Memory, Paging and the TLB]]", "[[Processes, Threads and Context Switching]]"]
related: ["[[Pointers, Values and Escape Analysis]]", "[[Runtime - Goroutine Scheduler (GMP)]]", "[[Runtime - Memory Allocator and Garbage Collector]]"]
sources:
  - "System V Application Binary Interface, AMD64 Architecture Processor Supplement (stack layout, calling convention)"
  - "Go runtime source, runtime/stack.go and runtime/proc.go, `go build -gcflags=-m` output captured on Go 1.24.4, darwin/arm64, 2026-11-06"
  - "Love, Linux Kernel Development, 3rd ed., ch. 2 (process address space layout)"
updated: 2026-11-09
---

# Process Memory Layout - Stack vs Heap

> [!summary] TL;DR
> A running process's virtual address space is divided into regions with different jobs: code (**text**), initialized globals (**data**), zeroed globals (**bss**), a growable **heap** for dynamic allocations, memory-mapped regions (**mmap**), and a **stack** per thread for function calls. The stack is cheap and automatic; the heap is flexible but needs a manager (an allocator, and in Go a garbage collector) to reclaim it. Runnable Go version: [[Process Memory Layout - Stack vs Heap - Go]].

> [!abstract] Core idea
> - The stack is a LIFO region: entering a function pushes a frame, returning pops it — allocation and deallocation are both just moving one pointer.
> - The heap has no inherent order: anything can be freed at any time, in any order, which is exactly why it needs a real allocator (and, in Go, a garbage collector) instead of a single pointer.
> - A value's lifetime, not its type, decides where it lives: if a function could return a pointer to it, it can't safely live on that function's stack frame.
> - The Go compiler decides stack vs heap at compile time via **escape analysis**; `go build -gcflags=-m` shows you its reasoning.
> - Go goroutine stacks start small (about 2 KB) and grow by copying to a bigger stack, unlike a fixed-size OS thread stack that simply overflows when exhausted.

## 1. Why it exists

Say you call a function. Before you can picture what "the stack" is, picture the plainer problem it solves: every function call needs somewhere to put its local variables, and it needs to remember where to return to once it finishes. Calls nest — `main` calls `handleRequest`, which calls `parseBody`, which calls `readAll` — and they *unnest* in exactly the reverse order they were entered: `readAll` finishes first, then `parseBody`, then `handleRequest`.

That "last in, first out" pattern has a name: a **stack** — a data structure where you only ever add or remove from one end. Because function calls always follow this pattern, hardware and operating systems give every thread one real, dedicated region of memory organized this way, called **the stack**. Using one simple region for it, instead of asking an allocator for fresh memory on every single call, makes function calls cheap: entering a function just means moving a stack pointer down by the frame's size, and returning moves it back up. No searching for free space, no bookkeeping about which chunks are in use.

But not everything a program creates has that nested, "it dies when the function returns" lifetime. A value a function builds and returns a pointer to — a new struct handed back to the caller, a buffer stashed in a long-lived cache — must outlive the function that created it, sometimes indefinitely, and in no particular nesting order relative to other allocations. That is the **heap**: a region with no inherent structure, managed by an **allocator** that can hand out and reclaim chunks in any order, exactly because their lifetimes don't follow a stack's nesting discipline.

> [!tip] Remember
> The stack exists because function calls nest predictably (LIFO); the heap exists because not every value's lifetime does.

## 2. Mental model

**In plain words:** think of the stack as a stack of trays in a cafeteria line: you can only add a tray to the top or take the top tray off. There's nothing to decide — the next free spot is always "wherever the top currently is." The heap is a warehouse with a forklift (the allocator): you can request a crate of any size, the forklift puts it wherever there's room, and later you can remove any crate regardless of when it arrived. Someone has to keep track of what's free and what's occupied — and in Go, someone (the garbage collector) also has to notice when a crate is no longer referenced by anyone and can be hauled away.

```mermaid
flowchart LR
    subgraph Stack["Stack = cafeteria trays"]
        direction TB
        S1["Push a tray\n(enter a function)"] --> S2["Only the top tray\nis ever touched"]
        S2 --> S3["Pop a tray\n(return from a function)"]
    end
    subgraph Heap["Heap = warehouse + forklift"]
        direction TB
        H1["Request a crate\nof any size"] --> H2["Forklift places it\nanywhere there's room"]
        H2 --> H3["Remove any crate,\nany time, any order"]
        H3 --> H4["Garbage collector notices\nan unreferenced crate"]
    end
```

Whether a value becomes a tray or a crate is not a property of its *type* — an `int` and a `*Counter` can each go either way. It's a property of whether the compiler can prove its lifetime ends when the function that created it returns. If it can prove that, the value is a tray (stack). If a pointer to the value might be used after the function returns — the function returns `&x`, or stores `x`'s address somewhere that outlives the call — the value has to be a crate (heap), because the tray it would have sat on is about to be reused by the next function call.

> [!warning] Common mistake
> Thinking "pointers go on the heap, values go on the stack." Wrong on both counts: a `*Counter` that never leaves its function stays on the stack, and a plain `int` returned by value through a long chain of escaping closures can still end up on the heap. The only question is lifetime, never the spelling of the type.

## 3. How it works

### The address space, region by region

**In plain words:** a running process doesn't get one undivided blob of memory. The operating system lays it out in bands, each with one job, from low addresses to high.

```mermaid
flowchart TB
    subgraph as["One process's virtual address space (low to high addresses)"]
        direction TB
        Text["text (.text): the compiled machine code,<br/>read-only + executable"]
        Data["data (.data): initialized global/static variables,<br/>e.g. var count = 10"]
        Bss["bss (.bss): zero-initialized globals,<br/>e.g. var buf [4096]byte — takes no space on disk"]
        Heap["heap: grows upward;<br/>dynamic allocations (new/make in Go, malloc in C)"]
        Gap["(unused address space)"]
        Mmap["mmap region: shared libraries,<br/>memory-mapped files, large allocations"]
        Stack["stack(s): grows downward;<br/>one per OS thread (and, in Go, one growable one per goroutine)"]
        Text --> Data --> Bss --> Heap --> Gap --> Mmap --> Stack
    end
```

**Example:** `size` on Linux reports the exact byte counts of `text`, `data` and `bss` straight from the binary, because those three are fixed the moment the linker finishes — nothing at runtime changes their size. The heap and the stack(s), by contrast, grow and shrink continuously while the program runs: a slice growing past its capacity extends the heap; a deeply recursive call extends a stack.

**Why it matters:** this is a logical layout, not a promise about exact addresses. **ASLR** (Address Space Layout Randomization, see [[Virtual Memory, Paging and the TLB]]) randomizes where the heap, stack, and shared libraries actually start each run — specifically so an attacker who finds one bug can't hardcode "the buffer is always at address X" to exploit it.

### Stack frames and the call stack

**In plain words:** every time a function is called, it gets its own private slab of the stack, called a **frame**, sized exactly for its needs. When it returns, that slab disappears instantly — not erased, just abandoned, because the next call will simply overwrite it.

```mermaid
sequenceDiagram
    participant Caller as main()
    participant Callee as handleRequest(req)

    Caller->>Caller: push a frame: locals,<br/>saved registers, return address
    Caller->>Callee: call handleRequest(req)
    Callee->>Callee: push its own frame on top:<br/>its locals, its return address
    Note over Callee: Callee's frame sits above main's frame<br/>the stack pointer is now lower
    Callee-->>Caller: return
    Callee->>Callee: pop its frame<br/>(stack pointer moves back up)
    Note over Caller: main's frame is unchanged<br/>it never left the stack
```

**Example:** each frame typically holds three things: the function's local variables (the ones that qualify for the "stack" rule above), saved copies of registers the function is about to overwrite, and the return address — where execution resumes once the function is done. Entering a function is one instruction adjusting the stack pointer by the frame's size, a size computed once, at compile time, from the function's own locals. Returning is the exact reverse: one instruction, moving the pointer back.

**Why it matters:** this is why stack allocation is close to free compared to a heap allocation, which has to consult an allocator's data structures to find and reserve free space before it can hand anything back.

> [!tip] Remember
> A frame is a private, temporary slab of stack for one function call. Pushing and popping it costs one arithmetic instruction each way — there is no "freeing," only abandonment.

### Go goroutine stacks: small and growable

**In plain words:** a traditional OS thread's stack is reserved up front, at a large fixed size (1–8 MB is typical on Linux via `pthread_create`'s defaults), because the kernel has no cheap way to grow it later — the stack must occupy one contiguous region, and whatever sits above it in the address space might already be claimed by something else. Reserving 8 MB per thread for a program running thousands of threads is expensive, even though a thread may only ever touch a few KB of it (demand paging, from [[Virtual Memory, Paging and the TLB]], means the unused pages are never actually backed by physical RAM — but the *virtual* reservation and the kernel's own bookkeeping around it still aren't free at scale).

Go sidesteps the whole problem. Each goroutine starts with a tiny stack — **2 KB** as of recent Go releases — and the compiler inserts a cheap check (a "stack guard" check) at the start of functions that might need more room than is left. If a goroutine's stack would overflow, the runtime does not fail: it allocates a new, larger stack (typically double the size), copies the old stack's contents into it, and **fixes up every pointer that pointed into the old stack** so each one now points at the matching address in the new stack. This copy-and-grow trick only works because the Go runtime — unlike a general-purpose OS — knows, from compiler-generated metadata, exactly which values on the stack are pointers, and can therefore safely rewrite them.

```mermaid
stateDiagram-v2
    [*] --> Small: goroutine created<br/>(stack ~2 KB)
    Small --> CheckOverflow: function prologue checks<br/>"enough stack left?"
    CheckOverflow --> Small: yes, continue normally
    CheckOverflow --> Growing: no, call morestack
    Growing --> Doubled: allocate a new stack<br/>(typically 2x the size)
    Doubled --> CopyFixup: copy old stack's contents,<br/>rewrite every pointer into it
    CopyFixup --> Small: resume on the new,<br/>larger stack
```

**Analogy:** it's like moving into a bigger apartment every time your current one gets cramped, rather than renting the biggest apartment you could ever conceivably need on day one — except the "movers" (the Go runtime) also walk through every box you own and relabel it with your new address, something ordinary movers can't do for memory addresses. This analogy breaks down in one place: a goroutine never *shrinks* back down mid-recursion the way you might downsize an apartment; it only grows, and only the runtime decides when (see the measured example below for exactly how fast this happens).

> [!tip] Remember
> OS thread stacks are reserved large and fixed because moving them is unsafe without compiler cooperation. Go goroutine stacks start tiny and double on demand because the Go compiler tracks every pointer and can safely rewrite it.

## 4. Worked example

### Whiteboard version

The one decision the compiler is really making, reduced to its essence: does this value's address ever leave the function?

```go
func stackCandidate() int {
    x := 42   // address never taken, never returned: can live on the stack
    return x
}

func heapCandidate() *int {
    x := 42   // address IS returned: must outlive this frame
    return &x // the compiler must allocate x on the heap instead
}
```

### Tracing escape analysis, step by step

**Picture it:** the compiler's decision, for any one value, reduces to one question asked over and over as it reads the function body:

```mermaid
flowchart TD
    V["A value is created\n(e.g. x := 42, or c := &Counter{...})"] --> Q{"Does its address\never leave this\nfunction call?"}
    Q -->|"No: never returned,\nnever stored elsewhere,\nnever sent on a channel"| Stack["Stays on the stack\n(popped automatically on return)"]
    Q -->|"Yes: returned, stored in a\nlong-lived struct, captured\nby an escaping closure, etc."| Heap["Escapes to the heap\n(tracked by the allocator and GC)"]
```

1. The compiler reads `SumOnStack(a, b int) int`: it adds `a + b` into a local `sum` and returns the value `sum` (not its address). No pointer to `sum` ever exists, so the compiler can prove `sum` dies the instant the function returns.
2. It reads `NewCounterOnHeap(start int) *Counter`: it builds a `Counter{n: start}` and returns `&c` — the counter's **address**, not a copy of it.
3. Because that address is now visible to the caller, and the caller might keep it around indefinitely, the compiler cannot place `c` on this frame — the frame is about to be reused by whatever the caller calls next.
4. The compiler marks `c` as **escaping to the heap**, and emits code to allocate it there instead of on the stack.

**Measured** (`go build -gcflags=-m`, Go 1.24.4, darwin/arm64, run in the scratch module for this note, 2026-11-06):

```text
# scratch/escape
escape/demo.go:14:6: can inline SumOnStack
escape/demo.go:22:6: can inline NewCounterOnHeap
escape/demo.go:23:7: &Counter{...} escapes to heap
```

Exactly as predicted: `SumOnStack`'s local never gets an "escapes" line — it stays on the stack, and the whole tiny function is also small enough to be inlined into its caller, removing the frame entirely — while `&Counter{...}` inside `NewCounterOnHeap` is explicitly flagged as escaping, because its address is returned to the caller.

> [!tip] Reading `-gcflags=-m` yourself
> Run `go build -gcflags=-m ./...` (add a second `-m` for more detail) on any package. A line mentioning "escapes to heap" names a heap allocation the compiler could not avoid; "does not escape" (shown with `-m -m`, or implied by its absence here) means the value stayed on the stack. This is the single fastest way to find an unexpected allocation in a hot path.

### Worked numeric example: a goroutine's stack growing by doubling

**In plain words:** "the stack doubles when it overflows" is easy to say and easy to picture wrong. Here is what it actually measures to, on real hardware, as one goroutine recurses deeper and deeper and a growing array forces its stack to expand.

**Picture it:**

```mermaid
flowchart LR
    D1["depth 1\n~2 KB stack"] --> D2["depth 10\nstill fits in 2 KB"]
    D2 --> D3["depth 50\ngrew once"]
    D3 --> D4["depth 150\ngrew again"]
    D4 --> D5["depth 400\ngrew again"]
    D5 --> D6["depth 1000\ngrew again"]
    D6 --> D7["depth 3000\ngrew several more times"]
```

**Example (measured, Go 1.24.4, darwin/arm64, this machine, 2026-11-09):** a goroutine recurses to a given depth, touching a 4 KB local array (`[512]int64`) on every level, so its stack has to expand several times to hold the recursion. `runtime.ReadMemStats` reports process-wide `StackInuse` (total stack memory across every goroutine) immediately after each run:

| Recursion depth | Measured process-wide `StackInuse` |
| ---------------- | ----------------------------------- |
| 1 | 294,912 B (≈ 288 KiB — dominated by other goroutines already running) |
| 10 | 360,448 B |
| 50 | 819,200 B |
| 150 | 1,343,488 B |
| 400 | 4,489,216 B |
| 1000 | 8,683,520 B |
| 3000 | 33,849,344 B |

**Why it matters:** `StackInuse` is a process-wide total (it includes every other goroutine's stack, which is why depth 1 doesn't read as "2 KB"), but the *shape* is unmistakable: it climbs in clear jumps as recursion depth increases, not smoothly — each jump is one or more `morestack` doubling events kicking in, copying the goroutine's whole stack to roughly twice its previous size, exactly as the state diagram above describes. A single goroutine never shrinks this number mid-recursion; it only grows, which is also exactly what the test for this measurement asserts (see [[Process Memory Layout - Stack vs Heap - Go]]).

> [!warning] Common mistake
> Assuming a goroutine stack "starts at 2 KB and grows one byte at a time as needed." It grows in discrete doubling jumps (2 KB -> 4 KB -> 8 KB -> ...), triggered only when a function's prologue check finds too little room left — not continuously, and not down to the byte.

Runnable Go version, including the escape-analysis demo, the LIFO call-stack model, and the full stack-growth measurement harness: [[Process Memory Layout - Stack vs Heap - Go]].

## 5. Variants and comparison

| Region | Grows how | Lifetime | Allocation cost | Reclaimed by |
| ------ | ---------- | -------- | ---------------- | ------------- |
| Stack | Pointer bump on call; shrinks on return | Bound to the function call (or, in Go, to the goroutine) | Near-free: move a pointer | Automatic, on return — no manager needed |
| Heap | Allocator finds/extends free space | Until nothing references it | An allocator call (`malloc`-class bookkeeping); in Go also tracked by the GC | `free`/manual (C); garbage collector (Go, Java); see [[Runtime - Memory Allocator and Garbage Collector]] |
| `mmap` region | Explicit `mmap`/`munmap` (or Go's large-allocation path, which also uses `mmap` under the hood) | Until explicitly unmapped | A syscall (see [[System Calls and User vs Kernel Mode]]); pages then fault in lazily | Explicit `munmap`, or process exit |
| `data`/`bss` (globals) | Fixed size, set at link time | Whole process lifetime | None at runtime — space exists from process start | Process exit |

## 6. Trade-offs and when not to use

- Stack allocation is nearly free but inflexible: a value's size must be known (or boundable) at compile time for a given frame, and its lifetime must not outlive the call. Neither constraint can be relaxed without moving the value to the heap.
- Heap allocation is flexible but not free: in Go, every heap allocation is a candidate for the garbage collector to track and eventually scan, so unnecessary escapes (e.g., returning `*int` where returning `int` would do) add both allocator and GC pressure in a hot path — exactly what `-gcflags=-m` helps you find and what [[Pointers, Values and Escape Analysis]] covers in full.
- Go's growable goroutine stacks remove the "reserve 8 MB per thread" cost, but stack growth itself (copy + pointer fixup) is not instant; a function with an unusually deep, tight recursive loop can pay repeated stack-growth costs if each growth step is quickly outgrown again. This is rarely a practical problem, but it's why extremely deep recursion in a hot path is worth profiling rather than assuming is free.
- `mmap`-backed large allocations (Go's runtime uses this path for big objects) skip the heap's usual small-object bookkeeping, at the cost of needing a real syscall and page-fault-driven backing, which only pays off for allocations large enough that overhead is a rounding error.

## 7. In production

- **Real systems:** Go's own runtime documents the 2 KB initial goroutine stack and its doubling growth policy; JVM threads famously default to large fixed stacks (`-Xss`) for exactly the reason Go avoids — without growable stacks, you must either over-provision per thread or risk `StackOverflowError`; C programs commonly crash with a segmentation fault on deep uncontrolled recursion because their OS thread stack is fixed-size and unmoving.
- **Failure modes -> fixes:**
  - Unexpectedly high allocation/GC pressure in a Go hot path -> run `go build -gcflags=-m` on the package, or `go tool pprof` with an allocation profile, to find avoidable escapes (e.g., a small struct returned by pointer when returning by value would do, or a value captured by a closure that's stored somewhere long-lived).
  - A Go goroutine recursing very deeply (e.g., parsing a deeply nested structure) hits the runtime's maximum stack size and the whole program crashes with `fatal error: stack overflow` — unlike a normal stack-growth event, this one is not recoverable; convert unbounded recursion to an explicit loop with your own bounded stack ([[Stacks, Queues and Deques]]) if input depth isn't trusted.
  - A C/C++ or cgo-adjacent component segfaults under deep recursion -> its OS thread stack is fixed-size; check `ulimit -s` (Linux) and consider increasing it or bounding recursion depth, since there's no "morestack" there.
- **What to monitor:** Go's allocation profile (`pprof`'s `alloc_objects`/`alloc_space`) for unexpected heap growth; `GODEBUG=gctrace=1` output for GC frequency and pause time; for native code, `ulimit -s` and any crash reports mentioning stack exhaustion.

## 8. Deep dive

- **Escape analysis, mechanically.** The compiler keeps a value on the stack only if it can prove the address never outlives the call; the full rules and how to read `-gcflags=-m` output live in [[Pointers, Values and Escape Analysis]].
- **Stack growth's pointer-fixup problem, and why only Go's runtime can do it.** Moving a C thread's stack mid-flight is not generally safe: any raw pointer another part of the program holds into the old stack (a pointer to a local variable passed to another thread, for instance) would become invalid, and C's type system can't find and fix all of them. Go's compiler emits per-function metadata describing exactly which stack slots hold pointers at every point a stack check could trigger growth, so the runtime's `copystack` can find and rewrite every live pointer into the old stack as part of the copy — a capability that depends on the compiler and runtime co-designing this format, not something retrofittable onto an arbitrary ABI.
- **bss costs nothing on disk, something at runtime.** A 64 MB zero-initialized global array costs essentially nothing in the compiled binary's file size (bss is just a "reserve this many zeroed bytes" directive), but still costs real virtual address space and, once touched, real physical pages — the same demand-paging mechanism from [[Virtual Memory, Paging and the TLB]] applies to bss pages exactly as it does to heap pages.
- **Why the heap needs a manager and the stack doesn't.** The stack's nesting guarantee (whatever was pushed most recently is freed first) means "where is the next free byte" is always answered by one pointer. The heap has no such guarantee — a value allocated first might outlive one allocated after it, and vice versa — so free and in-use regions end up interleaved over time (fragmentation), and finding a free block of the right size, or coalescing adjacent free blocks, needs real data structures (free lists, size classes, Go's own span-based allocator) and, in a garbage-collected language, a separate process (the GC) to even determine what's still in use. See [[Runtime - Memory Allocator and Garbage Collector]] for that machinery in full.

## 9. Interview questions

> [!question]- What actually decides whether a value goes on the stack or the heap?
> Not its type, and not whether you wrote `new`/`&` — its *provable lifetime*. If the compiler can prove a value's address never outlives the function call that created it, it stays on the stack. If a pointer to it might be used after the function returns (returned, stored in a long-lived structure, sent on a channel, captured by an escaping closure), it must go on the heap, because the stack frame it would have occupied is about to be reused.

> [!question]- Why is stack allocation so much cheaper than heap allocation?
> Because the stack's structure (strictly LIFO — nested calls unwind in reverse order) means "allocate" and "free" are both just moving one pointer, with no search for free space and nothing to track afterward. The heap has no such ordering guarantee, so an allocator needs real bookkeeping (free lists, size classes) to find space and, eventually, to reclaim it — in Go's case, with help from the garbage collector.

> [!question]- Trap: does returning a pointer from a Go function always cause a heap allocation?
> Not always — the compiler can sometimes prove a returned pointer's target doesn't actually escape further (for instance, if it's immediately dereferenced and discarded by an inlined caller), in which case it may still stay stack-allocated after inlining. But as a rule of thumb it very often does escape, and the only way to know for a specific function is to check `go build -gcflags=-m`'s actual output rather than assume from the syntax alone.

> [!question]- How does a goroutine's stack grow without the goroutine itself breaking?
> The compiler inserts a cheap "do I have enough stack space left?" check near the start of functions. If not, the runtime allocates a new, larger stack (typically double the old size), copies the old stack's contents into it, and rewrites every pointer that referenced an address on the old stack so it now points into the new one — using compiler-generated metadata that identifies exactly which stack slots are pointers. The goroutine then resumes as if nothing happened.

> [!question]- Why don't OS threads get this same growable-stack treatment?
> Because the kernel and a general-purpose ABI have no reliable way to find and rewrite every pointer into a thread's stack — unlike Go, which controls both the compiler and the runtime and can therefore track exactly which stack slots hold pointers. So OS thread stacks are reserved at a large fixed size up front instead, trading some wasted virtual address space (and kernel bookkeeping overhead at scale) for not needing that pointer-safe relocation machinery at all.

> [!question]- A Go function returns a `*Counter` built from a struct literal in its body. Will that struct be on the stack or the heap, and how would you check?
> Almost certainly the heap, because its address is returned and therefore must outlive the function's own frame — the compiler cannot place something behind a returned pointer on a frame that's about to be popped. Confirm it with `go build -gcflags=-m`: it will print a line like `&Counter{...} escapes to heap` at the exact source location of the allocation.

> [!question]- What's actually stored in `bss`, and why does it matter for a large Go program?
> Zero-initialized package-level variables: Go arrays or slices backed by package-level zero values, for instance. `bss` costs nothing in the compiled binary on disk — it's a directive, not stored bytes — but it still reserves real virtual address space, and once the program actually touches those bytes, real physical pages get mapped in via ordinary demand paging, exactly like heap memory would.

## 10. Cheat sheet

- Layout, low to high: text (code) -> data (initialized globals) -> bss (zeroed globals) -> heap (grows up) -> ... -> mmap region -> stack(s) (grows down).
- Stack = LIFO, pointer-bump allocation, reclaimed automatically on return. Heap = unordered, needs a real allocator (and in Go, a GC) to track and reclaim.
- A value escapes to the heap when its address could outlive its creating function's frame — check reasoning directly with `go build -gcflags=-m`.
- Go goroutine stacks start ~2 KB and grow by copy-and-pointer-fixup, in discrete doubling jumps (measured on this machine: 288 KiB -> 33.8 MB of process-wide stack as recursion depth went from 1 to 3000) — OS thread stacks are large and fixed because that relocation trick needs compiler/runtime cooperation an OS ABI doesn't have.
- `bss` costs nothing on disk but still costs virtual (and eventually physical) memory once touched.
- Avoidable heap escapes in a hot path (e.g. pointer-returning small structs) add both allocation and GC-scanning cost; `-gcflags=-m` and an allocation profile both find them.
- Unbounded deep recursion in Go can still exhaust the runtime's maximum stack and crash — "growable" is not "unlimited".

## Links

- **Before this:** [[Virtual Memory, Paging and the TLB]], [[Processes, Threads and Context Switching]]
- **Next:** [[Pointers, Values and Escape Analysis]], [[Runtime - Memory Allocator and Garbage Collector]]
- **Compare with:** [[Runtime - Goroutine Scheduler (GMP)]] (how goroutines using these stacks get scheduled onto OS threads)
- **Runnable code:** [[Process Memory Layout - Stack vs Heap - Go]]
