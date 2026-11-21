---
tags: [cs-fundamentals, hardware, storage]
level: intermediate
status: draft
type: implementation
prereqs: ["[[Memory Hierarchy and CPU Caches]]"]
related: ["[[Storage Devices - HDD, SSD, NVMe]]", "[[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM]]", "[[Page Cache, File Systems and fsync]]", "[[Latency Numbers Every Engineer Should Know]]", "[[Storage Engines - B-tree vs LSM and WAL]]"]
sources:
  - "Seagate Exos enterprise HDD datasheets (7200 rpm class, 2024)"
  - "NVM Express Base Specification (NVMe), nvmexpress.org"
  - "AWS EBS volume type documentation (gp3, io2), 2025"
  - "JEDEC and SNIA solid-state storage glossaries (NAND, FTL, TRIM, write amplification)"
updated: 2026-11-13
---

# Storage Devices - HDD, SSD, NVMe - Go

> [!summary] TL;DR
> This code builds a toy flash translation layer (FTL) — the firmware logic every real SSD runs — and measures write amplification rising as a drive fills up. It demonstrates in a runnable, testable form the mechanism described in [[Storage Devices - HDD, SSD, NVMe]]: pages, erase blocks, garbage collection, and why over-provisioning matters.

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read the theory note first ([[Storage Devices - HDD, SSD, NVMe]]). Here, read "From zero" below, "Before the code" and "What this code shows", then skim the code steps.
> - 🟡 **Know the basics?** Read the Code, Design decisions and Tests sections, then run it yourself.
> - 🔴 **Interview / SDE-3 prep?** Add the Pitfalls and Exercises sections. Headings are tagged 🟢🟡🔴.

> [!note] Before this note
> - [[Storage Devices - HDD, SSD, NVMe]]: the theory twin. Know that flash cannot overwrite a page, erases whole blocks, and that garbage collection's extra copies are "write amplification".
> - [[Memory Hierarchy and CPU Caches]]: background only.

**From zero** 🟢: this file is the hands-on side of [[Storage Devices - HDD, SSD, NVMe]]. It builds a toy version of the firmware brain inside every SSD (a flash translation layer), then measures write amplification growing as the drive fills up — the theory note's pages, erase blocks and garbage collection made runnable. Read each step's notes before the code.

## Before the code 🟢

- **Structs with methods** (`FTL`, `func (f *FTL) Write`): the flash translation layer is one struct whose methods change its state.
- **Pointer receivers** (`*FTL`): methods change the shared FTL itself, not a copy.
- **Maps and slices** (`map[...]`, `[]int`): the logical-to-physical page mapping and the per-block page lists.
- **`math/rand` with a fixed seed**: pseudo-random but repeatable writes, so tests give the same write-amplification numbers every run.
- **Helper functions in tests** (`writeRandom`): shared setup that several tests reuse.
- **LBA (logical block address)**: the block number the OS uses; the FTL maps each one to a real flash page.
- **FTL (flash translation layer)**: the SSD's firmware "address book" that hides erase-before-write from the OS.
- **What to run:** `go vet ./... && go test -race ./...` inside the module; add `-v -run TestAmplification` to see the amplification numbers.

## What this code shows 🟢

| Code piece | Theory concept | Link |
| --- | --- | --- |
| `page` / `pageState` | NAND pages and their free/valid/stale lifecycle | [[Storage Devices - HDD, SSD, NVMe#SSD internals pages blocks and the FTL]] |
| `FTL.Write` | A host write never overwrites in place; the old copy goes stale | [[Storage Devices - HDD, SSD, NVMe#SSD internals pages blocks and the FTL]] |
| `FTL.garbageCollect` | Copy-before-erase: the exact cost that write amplification measures | [[Storage Devices - HDD, SSD, NVMe#Tracing write amplification by hand]] |
| `FTL.WriteAmplification` | The WAF formula `(host writes + GC writes) / host writes` | [[Storage Devices - HDD, SSD, NVMe#Deep dive]] |
| `TestAmplificationRisesAsOverProvisioningShrinks` | Over-provisioning keeps WAF low; a full drive amplifies more | [[Storage Devices - HDD, SSD, NVMe#Wear leveling TRIM and over-provisioning the three levers that fight write amplification]] |

## Setup 🟢

- Module: `storage`, Go 1.24.4, no external dependencies.
- Layout:
  ```text
  storage/
    go.mod
    ftl.go       # the FTL implementation
    ftl_test.go  # three tests, including the amplification measurement
  ```
- Run it:
  ```bash
  go vet ./...
  go test -race ./...
  go test -race -v ./... -run TestAmplification
  ```

## Code 🟡

> 🟢 → 🟡 **You now know** what the toy FTL is for: watching write amplification grow as the drive fills. **Next we read the code:** six small steps, from page states to the final ratio.

### Step 1: the geometry and page states

**What this code does, in plain words:** it sets up a tiny fake SSD shape: blocks of 4 pages, where each page is free, valid (holds live data) or stale (old copy, waiting to be erased).

**Concept.** This step encodes the physical shape the theory note describes: pages grouped into erase blocks, and the three states a page moves through (free → valid → stale → free). The theory note's state diagram is literally this `pageState` enum plus the transitions `FTL.Write` and `FTL.garbageCollect` implement below. A real SSD uses blocks of hundreds of pages; this toy uses four, because the mechanism — not the scale — is what the theory needs to show.

```go
// Package storage is a toy flash translation layer (FTL) that shows why a
// skewed write pattern causes write amplification on an SSD, and how garbage
// collection recovers space by copying still-live pages.
package storage

// Toy geometry: 4 pages per erase block. Real SSDs use blocks of hundreds
// of pages, but the mechanism (page writes, whole-block erase, garbage
// collection copies live pages) is the same.
const pagesPerBlock = 4

type pageState int

const (
	free pageState = iota
	valid
	stale
)

type page struct {
	state pageState
	lba   int // logical block address this physical page holds, if valid
}
```

**How it works.**
1. `pagesPerBlock` is deliberately tiny (4, not the hundreds a real SSD uses) so garbage collection triggers often enough to observe in a short test run.
2. `pageState` is an `iota`-based enum — Go's idiomatic way to express a small closed set of states without a separate type per value.
3. `page.lba` only means something when `state == valid`; a free or stale page's `lba` is leftover data nobody reads, which is why `garbageCollect` below checks `state` before trusting `lba`.

### Step 2: the FTL's bookkeeping

**What this code does, in plain words:** it defines the controller's notebook: the blocks, the "logical address → physical page" map, where to write next, and counters for host writes, GC copies and erases.

**Concept.** The `FTL` struct is the controller's entire memory of the drive: which physical page holds which logical address (`mapTable`), where the next fresh page is (`writeCursor`, log-structured — always advancing, never searching from zero), and three counters that let `WriteAmplification` compute its ratio after the fact. Keeping counters instead of recomputing from state matches how a real SSD controller tracks wear: counting events as they happen is cheap; re-deriving them by scanning all flash is not.

```go
// FTL maps logical addresses to physical flash pages and tracks how many
// extra page writes garbage collection caused (write amplification).
type FTL struct {
	blocks      [][]page    // blocks[block][pageInBlock]
	mapTable    map[int]int // lba -> absolute physical page index
	writeCursor int         // next free physical page to write, log-structured
	hostWrites  int         // pages written because the host asked
	gcWrites    int         // pages written by garbage collection (copies)
	erases      int
}

// NewFTL builds an FTL with the given number of erase blocks.
func NewFTL(numBlocks int) *FTL {
	blocks := make([][]page, numBlocks)
	for b := range blocks {
		blocks[b] = make([]page, pagesPerBlock)
	}
	return &FTL{blocks: blocks, mapTable: make(map[int]int)}
}

func (f *FTL) total() int { return len(f.blocks) * pagesPerBlock }

func (f *FTL) at(abs int) *page { return &f.blocks[abs/pagesPerBlock][abs%pagesPerBlock] }
```

**How it works.**
1. `blocks [][]page` is a slice of slices — each outer element is one erase block, each inner element one physical page. Indexing `at(abs)` turns a flat "absolute page number" into `blocks[abs/pagesPerBlock][abs%pagesPerBlock]`, the same flattening trick a real FTL's address translation does, just in software instead of silicon.
2. `mapTable` is the translation table itself: logical address in, physical page index out. An alternative design (a flat array indexed by LBA) would be faster but requires knowing the logical address space size up front; the map trades a little speed for not needing that bound, which is fine at this toy's scale.
3. `at` returns a pointer (`*page`), not a copy, so callers can mutate the page in place — idiomatic Go for "give me a handle to this element to modify," and it avoids copying the whole struct on every access.

### Step 3: writing a logical address

**What this code does, in plain words:** to write a logical address, it marks the old page (if any) stale, puts the data in a fresh page, updates the map and counts one host write.

**Concept.** This is the theory note's central claim made literal: a host write *never* overwrites a physical page. `Write` always allocates a fresh page, and if an old physical copy existed, it is marked stale rather than erased in place — because flash cannot be erased at page granularity at all, only at block granularity.

```go
// Write performs a host write to a logical address. Flash cannot overwrite a
// page in place, so the old physical copy (if any) is marked stale and the
// new data goes to a fresh page.
func (f *FTL) Write(lba int) {
	if old, ok := f.mapTable[lba]; ok {
		f.at(old).state = stale
	}
	abs := f.allocPage()
	f.at(abs).state = valid
	f.at(abs).lba = lba
	f.mapTable[lba] = abs
	f.hostWrites++
}
```

**How it works.**
1. `if old, ok := f.mapTable[lba]; ok` is Go's comma-ok idiom: "look this key up, and tell me whether it was actually there" — distinguishing "LBA never written before" from "LBA maps to physical page 0," which a bare lookup returning the zero value could not.
2. The old page becomes `stale`, not `free` — it still holds (now dead) data until garbage collection erases its block; marking it free immediately would risk another write landing on it before its old content is safely superseded by the map update.
3. `hostWrites++` happens exactly once per call, counting only writes the *host* asked for — `allocPage` below may trigger garbage collection internally, but those copies are counted separately as `gcWrites`.

### Step 4: finding a free page, and triggering GC when space is tight

**What this code does, in plain words:** it finds the next free page, but first runs garbage collection if only one block's worth of free pages is left.

**Concept.** `allocPage` is where over-provisioning becomes concrete: the threshold `freePages() <= pagesPerBlock` is the toy's stand-in for a real SSD reserving spare capacity. A real controller's actual threshold is tuned by its firmware and the drive's advertised over-provisioning percentage; this toy collects as soon as free space drops below one block's worth, which is the smallest safe margin that guarantees GC always has somewhere to land its copies.

```go
// allocPage returns a free physical page, running garbage collection first
// if free space is low. Real SSDs reserve spare physical capacity (over-
// provisioning) so GC always has somewhere to copy live pages; this toy FTL
// reclaims a block as soon as free pages drop to one block's worth, for the
// same reason.
func (f *FTL) allocPage() int {
	if f.freePages() <= pagesPerBlock {
		f.garbageCollect()
	}
	for tries := 0; tries < f.total(); tries++ {
		abs := f.writeCursor
		f.writeCursor = (f.writeCursor + 1) % f.total()
		if f.at(abs).state == free {
			return abs
		}
	}
	panic("no free page even after GC: raise over-provisioning (fewer logical LBAs for this capacity)")
}

func (f *FTL) freePages() int {
	n := 0
	for _, b := range f.blocks {
		for _, p := range b {
			if p.state == free {
				n++
			}
		}
	}
	return n
}
```

**How it works.**
1. The scan starting at `writeCursor` and wrapping with `% f.total()` is the **log-structured** (always write to the next spot forward, like adding lines to a diary) write pattern real FTLs use: always advance forward, never search from the beginning, so writes cluster rather than scatter.
2. The `panic` is a deliberate, loud failure, not a silently wrong result — it signals a configuration bug (too little over-provisioning for the working set), which is exactly the failure mode the theory note's over-provisioning section warns about; a production FTL would instead refuse new writes and report "drive full," but panicking is the right choice for a teaching toy where that state should never be reached by the tests.

### Step 5: garbage collection — the copy-before-erase that *is* write amplification

**What this code does, in plain words:** it picks the block with the fewest live pages, saves those live pages' addresses, wipes the block, and rewrites the live data elsewhere, counting every rewrite as an extra (GC) write.

**Concept.** `garbageCollect` has two distinct jobs, each small enough to read on its own: pick *which* block to reclaim, then actually reclaim it. Splitting them this way mirrors how the theory note separates "the GC policy" (which block is cheapest to reclaim) from "the GC mechanism" (copy-then-erase).

```go
// garbageCollect picks the block with the fewest valid pages, copies its
// live pages forward (counted as gcWrites, not hostWrites), and erases it.
// This copy-forward cost is exactly what "write amplification" measures.
func (f *FTL) garbageCollect() {
	best, bestLive := -1, pagesPerBlock+1
	for b, pages := range f.blocks {
		live := 0
		for _, p := range pages {
			if p.state == valid {
				live++
			}
		}
		if live < bestLive {
			best, bestLive = b, live
		}
	}
	f.reclaim(best)
}
```

**How it works.**
1. Choosing the block with the *fewest* valid pages (`live < bestLive`) is the standard "greedy" garbage-collection policy: reclaiming an almost-empty block costs almost nothing to copy forward, while reclaiming a nearly-full block would cost almost as much as writing that data fresh.
2. The scan is a plain linear pass over every block — fine at this toy's scale, though a real SSD controller keeps a running count of live pages per block instead of rescanning, to make this selection O(1) instead of O(blocks).
3. Once the target block is chosen, the actual reclaim work (copy live pages out, then erase) is delegated to `reclaim`, kept separate so each function fits on one screen.

**Concept.** `reclaim` is where the copy-before-erase mechanism lives: it gathers every still-valid LBA in the chosen block, wipes the whole block in one step, and only then copies each gathered LBA to a fresh page elsewhere — counting every one of those copies as a `gcWrite`, never a `hostWrite`.

```go
// reclaim copies every valid page out of block b, erases the whole block,
// and writes the valid pages back to fresh locations. Erasing before copying
// back (rather than copying page-by-page) matches how flash actually erases
// an entire block atomically before any of its pages can be reused.
func (f *FTL) reclaim(b int) {
	var liveLBAs []int
	for i := range f.blocks[b] {
		if f.blocks[b][i].state == valid {
			liveLBAs = append(liveLBAs, f.blocks[b][i].lba)
		}
		f.blocks[b][i] = page{}
	}
	f.erases++
	for _, lba := range liveLBAs {
		newAbs := f.copyForward()
		f.at(newAbs).state = valid
		f.at(newAbs).lba = lba
		f.mapTable[lba] = newAbs
		f.gcWrites++
	}
}
```

**How it works.**
1. The live LBAs are collected into a slice *before* anything is erased, so the erase step can safely wipe the whole block in one pass without worrying about reading a page it just zeroed.
2. `f.blocks[b][i] = page{}` resets a page to its zero value — `state: free, lba: 0` — in one assignment, relying on Go's zero-value guarantee rather than setting each field individually.
3. The final loop copies every collected LBA to a fresh page via `copyForward` (next step) and counts each one as a `gcWrite`, never a `hostWrite` — this separation is exactly what makes `WriteAmplification` meaningful.

**Concept.** `copyForward` is deliberately almost identical to `allocPage`'s free-page search: a GC-originated copy and a fresh host write both just need "the next free physical page," so there is no special-case allocation path for GC — only the caller decides whether the result counts as a `gcWrite` or lands inside a `hostWrites` increment.

```go
// copyForward returns the next free physical page for a GC copy, scanning
// forward from the write cursor exactly like a fresh host write would.
func (f *FTL) copyForward() int {
	for i := 0; i < f.total(); i++ {
		abs := f.writeCursor
		f.writeCursor = (f.writeCursor + 1) % f.total()
		if f.at(abs).state == free {
			return abs
		}
	}
	panic("no free page for GC copy: raise over-provisioning (fewer logical LBAs for this capacity)")
}
```

**How it works.**
1. The scan-and-wrap pattern (`writeCursor`, modulo `f.total()`) is copy-pasted in spirit from `allocPage` on purpose: both are "find the next free page starting from where we left off," and keeping them structurally identical makes it obvious at a glance that GC copies and host writes compete for the same free-page pool.
2. The `panic` here is reachable only if `garbageCollect` somehow freed fewer pages than it needs to copy — which should never happen, since erasing a whole block always frees at least as many pages as it had live ones — so hitting it in practice would point to a bug in `garbageCollect`'s bookkeeping, not normal operation.

### Step 6: measuring the result

**What this code does, in plain words:** it returns (host writes + GC writes) ÷ host writes; 1.0 means no extra writes.

**Concept.** `WriteAmplification` is the single public number the entire mechanism exists to produce, and it is the thing the theory note's worked example and the test below both check against real measured behavior, not just an asserted formula.

```go
// WriteAmplification is total physical pages written per host page written.
// 1.0 is ideal (sequential, never-overwritten workload); higher means GC is
// copying live data repeatedly, which is what a skewed random workload does.
func (f *FTL) WriteAmplification() float64 {
	if f.hostWrites == 0 {
		return 1
	}
	return float64(f.hostWrites+f.gcWrites) / float64(f.hostWrites)
}
```

**How it works.**
1. The guard `if f.hostWrites == 0 { return 1 }` avoids a division by zero and defines "no writes yet" as the ideal ratio, a reasonable convention since there is nothing to amplify.
2. Both operands are converted with `float64(...)` before dividing — Go performs integer division silently if both operands stay `int`, which would truncate `3/2` to `1` instead of `1.5`; this is one of the most common correctness bugs when porting a ratio formula into Go.

> [!example]- Full file (`ftl.go`)
> ```go
> // Package storage is a toy flash translation layer (FTL) that shows why a
> // skewed write pattern causes write amplification on an SSD, and how garbage
> // collection recovers space by copying still-live pages.
> package storage
>
> // Toy geometry: 4 pages per erase block. Real SSDs use blocks of hundreds
> // of pages, but the mechanism (page writes, whole-block erase, garbage
> // collection copies live pages) is the same.
> const pagesPerBlock = 4
>
> type pageState int
>
> const (
> 	free pageState = iota
> 	valid
> 	stale
> )
>
> type page struct {
> 	state pageState
> 	lba   int // logical block address this physical page holds, if valid
> }
>
> // FTL maps logical addresses to physical flash pages and tracks how many
> // extra page writes garbage collection caused (write amplification).
> type FTL struct {
> 	blocks      [][]page    // blocks[block][pageInBlock]
> 	mapTable    map[int]int // lba -> absolute physical page index
> 	writeCursor int         // next free physical page to write, log-structured
> 	hostWrites  int         // pages written because the host asked
> 	gcWrites    int         // pages written by garbage collection (copies)
> 	erases      int
> }
>
> // NewFTL builds an FTL with the given number of erase blocks.
> func NewFTL(numBlocks int) *FTL {
> 	blocks := make([][]page, numBlocks)
> 	for b := range blocks {
> 		blocks[b] = make([]page, pagesPerBlock)
> 	}
> 	return &FTL{blocks: blocks, mapTable: make(map[int]int)}
> }
>
> func (f *FTL) total() int { return len(f.blocks) * pagesPerBlock }
>
> func (f *FTL) at(abs int) *page { return &f.blocks[abs/pagesPerBlock][abs%pagesPerBlock] }
>
> // Write performs a host write to a logical address. Flash cannot overwrite a
> // page in place, so the old physical copy (if any) is marked stale and the
> // new data goes to a fresh page.
> func (f *FTL) Write(lba int) {
> 	if old, ok := f.mapTable[lba]; ok {
> 		f.at(old).state = stale
> 	}
> 	abs := f.allocPage()
> 	f.at(abs).state = valid
> 	f.at(abs).lba = lba
> 	f.mapTable[lba] = abs
> 	f.hostWrites++
> }
>
> // allocPage returns a free physical page, running garbage collection first
> // if free space is low. Real SSDs reserve spare physical capacity (over-
> // provisioning) so GC always has somewhere to copy live pages; this toy FTL
> // reclaims a block as soon as free pages drop to one block's worth, for the
> // same reason.
> func (f *FTL) allocPage() int {
> 	if f.freePages() <= pagesPerBlock {
> 		f.garbageCollect()
> 	}
> 	for tries := 0; tries < f.total(); tries++ {
> 		abs := f.writeCursor
> 		f.writeCursor = (f.writeCursor + 1) % f.total()
> 		if f.at(abs).state == free {
> 			return abs
> 		}
> 	}
> 	panic("no free page even after GC: raise over-provisioning (fewer logical LBAs for this capacity)")
> }
>
> func (f *FTL) freePages() int {
> 	n := 0
> 	for _, b := range f.blocks {
> 		for _, p := range b {
> 			if p.state == free {
> 				n++
> 			}
> 		}
> 	}
> 	return n
> }
>
> // garbageCollect picks the block with the fewest valid pages, copies its
> // live pages forward (counted as gcWrites, not hostWrites), and erases it.
> // This copy-forward cost is exactly what "write amplification" measures.
> func (f *FTL) garbageCollect() {
> 	best, bestLive := -1, pagesPerBlock+1
> 	for b, pages := range f.blocks {
> 		live := 0
> 		for _, p := range pages {
> 			if p.state == valid {
> 				live++
> 			}
> 		}
> 		if live < bestLive {
> 			best, bestLive = b, live
> 		}
> 	}
> 	f.reclaim(best)
> }
>
> // reclaim copies every valid page out of block b, erases the whole block,
> // and writes the valid pages back to fresh locations. Erasing before copying
> // back (rather than copying page-by-page) matches how flash actually erases
> // an entire block atomically before any of its pages can be reused.
> func (f *FTL) reclaim(b int) {
> 	var liveLBAs []int
> 	for i := range f.blocks[b] {
> 		if f.blocks[b][i].state == valid {
> 			liveLBAs = append(liveLBAs, f.blocks[b][i].lba)
> 		}
> 		f.blocks[b][i] = page{}
> 	}
> 	f.erases++
> 	for _, lba := range liveLBAs {
> 		newAbs := f.copyForward()
> 		f.at(newAbs).state = valid
> 		f.at(newAbs).lba = lba
> 		f.mapTable[lba] = newAbs
> 		f.gcWrites++
> 	}
> }
>
> // copyForward returns the next free physical page for a GC copy, scanning
> // forward from the write cursor exactly like a fresh host write would.
> func (f *FTL) copyForward() int {
> 	for i := 0; i < f.total(); i++ {
> 		abs := f.writeCursor
> 		f.writeCursor = (f.writeCursor + 1) % f.total()
> 		if f.at(abs).state == free {
> 			return abs
> 		}
> 	}
> 	panic("no free page for GC copy: raise over-provisioning (fewer logical LBAs for this capacity)")
> }
>
> // WriteAmplification is total physical pages written per host page written.
> // 1.0 is ideal (sequential, never-overwritten workload); higher means GC is
> // copying live data repeatedly, which is what a skewed random workload does.
> func (f *FTL) WriteAmplification() float64 {
> 	if f.hostWrites == 0 {
> 		return 1
> 	}
> 	return float64(f.hostWrites+f.gcWrites) / float64(f.hostWrites)
> }
> ```

## Tests 🟡

### `TestSequentialWritesNoAmplification`

**What it proves and why it matters.** A clean sequential fill, within capacity, should never trigger garbage collection at all — proving the baseline case (write amplification = 1.0, the ideal) before the next test shows it rising.

| Input | Expected output |
| --- | --- |
| 6 blocks (24 pages), 20 unique sequential LBAs written once each | `WriteAmplification() == 1.0` |

```go
func TestSequentialWritesNoAmplification(t *testing.T) {
	f := NewFTL(6) // 24 pages
	for lba := 0; lba < 20; lba++ {
		f.Write(lba)
	}
	if got := f.WriteAmplification(); got != 1.0 {
		t.Fatalf("sequential fill: amplification = %.2f, want 1.00", got)
	}
}
```

A failure here would mean the FTL is triggering garbage collection (or miscounting writes) even when there is no reason to — a bug in the free-space threshold or the counters, not in the GC policy itself.

### `TestAmplificationRisesAsOverProvisioningShrinks`

**What it proves and why it matters.** This is the theory note's central claim, made into an assertion: write amplification must be higher when the working set uses 80% of the drive's capacity than when it uses 40%, because less spare capacity forces GC to reclaim blocks that still hold more live data.

| Input | Expected output |
| --- | --- |
| 10 blocks (40 pages), working set = 40% of capacity, 2,000 random writes | amplification close to 1.0 (checked: ≤ 1.1×) |
| 10 blocks (40 pages), working set = 80% of capacity, 2,000 random writes | amplification strictly higher than the 40% case |

```go
// writeRandom overwrites a working set of w distinct LBAs n times, in a
// pseudo-random order (so rewrites interleave instead of trailing a clean
// log), and returns the FTL afterwards.
func writeRandom(capacityBlocks, w, n int, seed int64) *FTL {
	f := NewFTL(capacityBlocks)
	r := rand.New(rand.NewSource(seed))
	for i := 0; i < n; i++ {
		f.Write(r.Intn(w))
	}
	return f
}

func TestAmplificationRisesAsOverProvisioningShrinks(t *testing.T) {
	const capacityPages = 40 // 10 blocks * 4 pages/block
	lowFill := writeRandom(10, capacityPages*4/10, 2000, 1)  // 40% full
	highFill := writeRandom(10, capacityPages*8/10, 2000, 1) // 80% full

	lowAmp, highAmp := lowFill.WriteAmplification(), highFill.WriteAmplification()
	if highAmp <= lowAmp {
		t.Fatalf("80%% full amplification = %.2fx, want > 40%% full amplification = %.2fx", highAmp, lowAmp)
	}
	if lowAmp > 1.1 {
		t.Fatalf("40%% full (plenty of over-provisioning) amplified to %.2fx, want close to 1.0", lowAmp)
	}
	t.Logf("40%% full: %.2fx, 80%% full: %.2fx", lowAmp, highAmp)
}
```

A failure where `highAmp <= lowAmp` would mean the over-provisioning mechanism is backwards or broken — the single most important property this whole simulation exists to demonstrate.

### `TestGCPreservesMapping`

**What it proves and why it matters.** Garbage collection must never lose or duplicate live data. This test hammers the FTL with 5,000 writes across a small working set (heavy GC churn) and then verifies every logical address ever written is still correctly mapped to a valid physical page.

| Input | Expected output |
| --- | --- |
| 10 blocks, 28 distinct LBAs, 5,000 writes cycling through them | every LBA has exactly one map entry, pointing at a page marked `valid` with the matching `lba` |

```go
func TestGCPreservesMapping(t *testing.T) {
	f := NewFTL(10)
	const w = 28
	last := make(map[int]bool)
	for i := 0; i < 5000; i++ {
		lba := i % w
		f.Write(lba)
		last[lba] = true
	}
	if len(f.mapTable) != w {
		t.Fatalf("mapTable has %d entries, want %d (one per LBA ever written)", len(f.mapTable), w)
	}
	for lba := range last {
		abs, ok := f.mapTable[lba]
		if !ok {
			t.Fatalf("lba %d missing from map after GC churn", lba)
		}
		if f.at(abs).state != valid || f.at(abs).lba != lba {
			t.Fatalf("lba %d: physical page %d is not a valid copy of it", lba, abs)
		}
	}
}
```

A failure here is the most serious possible bug class for this code: silent data loss or corruption during garbage collection, exactly the class of bug a real SSD's firmware testing exists to rule out.

## Design decisions 🟡

| Decision | Alternative | Trade-off |
| --- | --- | --- |
| Log-structured write cursor (scan forward, wrap around) | Free-list of available pages, popped in any order | The cursor keeps new writes clustering near each other (closer to how real NAND page programming is sequenced); a free-list would be simpler code but loses that locality property the theory explicitly cares about |
| Collect live LBAs, then erase, then copy forward | Copy each live page immediately, in place, before erasing | Matches the real hardware constraint: flash cannot be erased at page granularity, so the block must be fully read before any page in it is wiped |
| `panic` on exhausted capacity | Return an error from `allocPage` | A panic is louder and simpler for a teaching toy proving over-provisioning math; production code should return an error (`ErrDriveFull`) so callers can apply backpressure instead of crashing |
| `map[int]int` for the translation table | A flat `[]int` indexed by LBA | The map works for any LBA value without needing to know the logical address space size up front, at the cost of slower lookups than direct array indexing |

## Running it 🟡

```bash
$ go test -race -v ./...
=== RUN   TestSequentialWritesNoAmplification
--- PASS: TestSequentialWritesNoAmplification (0.00s)
=== RUN   TestAmplificationRisesAsOverProvisioningShrinks
    ftl_test.go:46: 40% full: 1.06x, 80% full: 2.70x
--- PASS: TestAmplificationRisesAsOverProvisioningShrinks (0.00s)
=== RUN   TestGCPreservesMapping
--- PASS: TestGCPreservesMapping (0.00s)
PASS
ok  	storage	1.455s
```

Reading this output line by line: the first test passes silently (no log line was requested), confirming the ideal 1.0 baseline.

The second test's `t.Logf` line is the headline number from the theory note's worked example — a drive at 40% utilization amplifies writes by only 1.06×, while the same drive at 80% utilization amplifies by 2.70×, a 2.5× worse ratio purely from having less spare capacity.

The third test's silent pass confirms no data was lost or corrupted across 5,000 writes and repeated garbage collection cycles. `-race` found no data races because this code is single-goroutine; it is run here for consistency with every other Go note in this vault.

> 🟡 → 🔴 **You now know** how the FTL works and what the three tests prove. **Next comes the advanced part:** the silent integer-division bug, an unguarded edge case, and what the `panic` calls really mean.

## Pitfalls in the code 🔴

- Forgetting `float64(...)` on either side of the division in `WriteAmplification` silently truncates the ratio to an integer — Go will not warn you, because integer division is valid Go, just wrong here.
- `garbageCollect` assumes at least one block exists with a computable `bestLive`; calling it on an `FTL` with zero blocks would leave `best == -1` and panic on `f.blocks[best]` — not exercised by the tests above because `NewFTL` is never called with 0 blocks, but worth guarding in production code.
- The `panic` calls in `allocPage` and `copyForward` are correctness safety nets, not expected code paths — if a test ever triggers one, the fix is almost always "this working set doesn't fit the configured over-provisioning," not a bug in the GC logic itself.

## Exercises 🔴

1. **Change this, predict the result:** lower `pagesPerBlock` from 4 to 2 and rerun `TestAmplificationRisesAsOverProvisioningShrinks`. Predict whether the 80%-full amplification goes up or down before running it, and explain why using the "fewest live pages" GC policy.
2. **Change this, predict the result:** change `allocPage`'s trigger from `f.freePages() <= pagesPerBlock` to `f.freePages() <= pagesPerBlock*2` (double the effective over-provisioning reserve) and predict what happens to both the 40%-full and 80%-full amplification numbers.
3. **Extend it:** add a `TRIM(lba int)` method that marks an LBA's current physical page `stale` immediately (as if the OS told the FTL the data is deleted) without writing a replacement. Write a test showing that a workload with TRIM calls between writes ends up with lower write amplification than the same workload without TRIM.

## Self-check 🟢🟡

🟢 Easy

> [!question]- What happens to the old page when the host rewrites an LBA?
> It is marked stale; the new data goes to a fresh page.

> [!question]- What does a write amplification of 1.0 mean?
> No extra writes: every physical write was one the host asked for.

> [!question]- Which block does garbage collection pick?
> The one with the fewest valid pages, because it is cheapest to clean.

🟡 Medium

> [!question]- Why is amplification higher at 80% full than at 40% full?
> With less spare space, blocks chosen for cleaning still hold more live pages, so more must be copied.

> [!question]- Why does `reclaim` collect live LBAs before erasing?
> Flash erases a whole block at once, so the live data must be saved first and rewritten after.

> [!question]- What bug do the `float64(...)` conversions prevent?
> Integer division would turn 3/2 into 1 instead of 1.5.

## Links

- **Theory:** [[Storage Devices - HDD, SSD, NVMe]]
- **Compare with:** [[Storage Engines - B-tree vs LSM and WAL]] (how databases lay data out on top of these devices)
