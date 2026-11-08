---
tags: [cs-fundamentals, computer-architecture, hardware]
level: intermediate
status: reviewed
prereqs: ["[[Memory Hierarchy and CPU Caches]]"]
related: ["[[How a Computer Runs a Program]]", "[[Storage Devices - HDD, SSD, NVMe]]"]
sources:
  - "JEDEC JESD79-5 (DDR5 SDRAM standard)"
  - "JEDEC JESD250E (GDDR6 SGRAM standard); JEDEC HBM3 (JESD238) standard"
  - "Hennessy & Patterson, Computer Architecture: A Quantitative Approach, 6th ed., ch. 2, appendix B (memory technology)"
  - "Micron and Samsung DDR5/HBM3 technical datasheets and whitepapers"
updated: 2026-11-09
---

# RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM

> [!summary] TL;DR
> RAM (Random Access Memory) means any address can be reached in roughly constant time, unlike a tape you must scan sequentially. RAM is also **volatile**: every cell depends on power to hold its value, so all of it — SRAM and DRAM alike — is lost the instant power is removed, which is exactly what [[ROM, Flash, Firmware and the Boot Process|ROM and flash]] are built to survive. The two building blocks are **SRAM** (fast, power-hungry, used for on-chip caches) and **DRAM** (denser and cheaper, used for main memory) — and DRAM itself comes in several interface flavors optimized for different jobs: **DDR** for general-purpose system memory, **GDDR** for GPU bandwidth, and **HBM** for the extreme bandwidth AI accelerators need. Runnable Go version: [[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM - Go]].

> [!abstract] Core idea
> - "Random access" means any address costs about the same, unlike sequential media (tape, and to a lesser extent spinning disks).
> - SRAM: a 6-transistor cell that holds its value with no refreshing, fast but low-density and expensive — used for CPU caches and register files.
> - DRAM: a 1-transistor-1-capacitor cell that must be refreshed roughly every 64 ms as the capacitor leaks charge — denser and cheaper, used as main memory.
> - DDR, GDDR and HBM are all DRAM; they differ in the interface and packaging used to get data on and off the chip, trading latency for bandwidth differently for different workloads.

## 1. Why it exists

Picture a single cell of memory as a light switch. It needs to hold one bit — on or off — and let the rest of the system read or set that bit quickly. There are two fundamentally different ways to build that switch, and the whole landscape of RAM technologies in this note grows out of the trade-off between them.

Build the switch from six transistors wired so it actively holds its own state as long as power is applied, and you get **SRAM**: fast, but expensive in area — six transistors per bit means fewer bits fit on a given chip, and chip area costs real money. Build it instead from one transistor and one tiny capacitor, and you get **DRAM**: six times as many bits fit in the same area — but a capacitor leaks its charge within milliseconds, so the cell must be read and rewritten ("refreshed") continuously just to remember a value nobody is even asking about right now.

That single trade-off — SRAM's speed and area cost versus DRAM's density and refresh cost — explains why a CPU has a few tens of kilobytes of SRAM cache sitting right next to each core and several gigabytes of DRAM a short trip away on the memory bus (see [[Memory Hierarchy and CPU Caches]] for the full pyramid), instead of either technology doing the whole job alone.

> [!tip] Remember
> SRAM trades area and cost for speed and no refresh; DRAM trades refresh overhead for six times the density. Neither technology wins outright, which is why real systems use both, in different places.

## 2. Mental model

**In plain words:** SRAM is a notepad on your desk — instantly available, but you only have room for a few pages, and the paper is expensive. DRAM is a filing cabinet across the room — it holds far more and costs far less per page, but every page is slowly fading, and a librarian has to walk over and re-copy each one periodically before it disappears. That re-copying happens invisibly, in the background, but it still takes real time on the shared "walkway" (the memory bus) that everything else also needs.

```mermaid
flowchart LR
    subgraph SRAM_m["SRAM = notepad on your desk"]
        direction TB
        S1["Instantly available"] --> S2["Room for only\na few pages"]
        S2 --> S3["Expensive paper\n(6 transistors/bit)"]
    end
    subgraph DRAM_m["DRAM = filing cabinet across the room"]
        direction TB
        D1["Holds far more"] --> D2["Costs far less\nper page"]
        D2 --> D3["A librarian must\nre-copy fading pages\n(refresh, ~every 64 ms)"]
    end
```

**Where the analogy breaks down:** a real notepad page never needs rewriting to keep its ink from fading, and a real librarian doesn't block every other errand while re-copying one page. DRAM's refresh really does compete with ordinary reads and writes for the same physical bus, which is the one place this picture understates the real cost.

> [!warning] Common mistake
> Thinking DRAM's refresh is something a program can avoid by "not touching" that memory. Every DRAM row must be refreshed on a schedule regardless of whether software is reading it — refresh is a property of the *hardware cell*, not of access patterns.

## 3. How it works

### The SRAM cell: 6 transistors, no refresh

**In plain words:** an SRAM bit cell is built from two cross-coupled inverters forming a **bistable latch** — a circuit with exactly two stable states, and whichever one it's in, it stays there until deliberately flipped — plus two access transistors that connect the latch to the bit lines for reading or writing.

```mermaid
flowchart LR
    subgraph SRAM_cell["SRAM bit cell"]
        direction TB
        L["Cross-coupled\ninverter pair\n(bistable latch)"] --- A1["Access\ntransistor"]
        L --- A2["Access\ntransistor"]
    end
```

**Example:** because the latch actively holds its state as long as power flows, no refresh is needed at all — it simply sits there, stable, until something deliberately writes a new value through the access transistors. **Why it matters:** the cost is area — 6 transistors per bit versus DRAM's 1 — so a chip of a given size holds far fewer SRAM bits than DRAM bits, which is exactly why SRAM is reserved for places where speed matters more than capacity: L1/L2/L3 caches, register files, and TLBs (see [[Virtual Memory, Paging and the TLB]]).

### The DRAM cell: 1 transistor, 1 capacitor, and the refresh problem

**In plain words:** a DRAM bit cell is one access transistor gating one tiny capacitor. A charged capacitor reads as a 1; an uncharged one reads as a 0.

```mermaid
flowchart LR
    subgraph DRAM_cell["DRAM bit cell"]
        direction TB
        T["Access\ntransistor"] --- C["Capacitor\n(leaks in ~64 ms)"]
    end
```

**Step by step, what happens on a read:**
1. The access transistor opens, connecting the capacitor to a sense amplifier.
2. The sense amplifier drains the capacitor's tiny charge to decide whether it was a 1 or a 0 — this is a **destructive read**: the act of reading empties the capacitor.
3. The memory controller must immediately rewrite the row, restoring whatever value was just read, before it can be considered "still there."
4. Separately, and regardless of whether anyone reads it, each capacitor also leaks its charge on its own within tens of milliseconds — JEDEC's DDR5 standard specifies a typical refresh interval of about **64 ms per row**, meaning the controller must proactively read and rewrite every row at least that often.

**Why it matters:** this refresh traffic uses a slice of the available memory-bus bandwidth even when the system is otherwise idle — it is pure overhead paid for DRAM's six-fold density advantage over SRAM.

> [!tip] Remember
> A DRAM read is destructive and must be followed by a rewrite; a DRAM cell also needs rewriting on a ~64 ms timer regardless of whether it's ever read. Both are the price of 1-transistor density.

### DRAM organization: channels, ranks, banks, rows

**In plain words:** a memory controller doesn't talk to "DRAM" as one undivided pool — it talks through a hierarchy of narrower and narrower subdivisions, each level adding a bit more independence or parallelism.

```mermaid
flowchart TD
    MC["Memory controller"] --> CH1["Channel 0"]
    MC --> CH2["Channel 1"]
    CH1 --> D1["DIMM"]
    D1 --> R1["Rank 0"]
    D1 --> R2["Rank 1"]
    R1 --> B1["Bank 0"]
    R1 --> B2["Bank 1"]
    B1 --> ROW["Row buffer\n(one open row at a time)"]
```

**Example:** a channel connects to one or more DIMMs; each DIMM has one or more ranks (independent sets of chips); each rank is divided into banks that can be worked somewhat independently; and within a bank, an address decomposes into a **row** and a **column**. Opening a row ("activating" it) copies its entire contents into a fast row buffer. A later access to the *same* open row — a **row-buffer hit** — is fast; an access to a *different* row in the same bank — a **row-buffer miss** — must first close the old row and then open the new one, costing extra cycles.

**Why it matters:** this is why sequential or blocked memory access patterns, which tend to stay within the same open row, run measurably faster than scattered random access — even purely within DRAM itself, independent of the CPU-cache locality effects covered in [[Memory Hierarchy and CPU Caches]].

### From SDRAM to DDR1-5

**In plain words:** early DRAM was **asynchronous** (FPM, then EDO) — the memory controller and the DRAM chip ran on independent timings, which capped how fast requests could be pipelined. **SDRAM** (Synchronous DRAM) fixed that by adding a shared clock, letting the controller and chip pipeline requests against the same tick. **DDR** (Double Data Rate) then doubled throughput again by transferring data on both the rising *and* falling edge of that clock, and every generation since has grown a **prefetch buffer** (how much data is fetched internally per access, then streamed out over several clock edges) to keep scaling bandwidth without needing the clock itself to keep doubling.

| Generation | Typical data rate | Typical voltage | Notable change (documented, JEDEC) |
|---|---|---|---|
| SDRAM | up to ~166 MT/s | 3.3 V | First synchronous clock |
| DDR1 | up to ~400 MT/s | 2.5 V | Double data rate (both clock edges) |
| DDR3 | up to ~2133 MT/s | 1.5 V | 8n prefetch |
| DDR4 | up to ~3200 MT/s | 1.2 V | 8n prefetch, bank groups |
| DDR5 | 4800-8800+ MT/s | 1.1 V | 16n prefetch; **two independent 32-bit sub-channels per DIMM**; **on-die ECC** (corrects internal bit errors, separate from system-level ECC); on-DIMM power management (PMIC) |

**Why it matters:** DDR5's two sub-channels mean a single DDR5 DIMM behaves like two narrower, independent channels, improving the controller's ability to keep multiple requests in flight simultaneously rather than over-fetching one large one. **LPDDR** (Low-Power DDR) is a parallel line optimized for mobile and laptop power budgets rather than raw bandwidth, used in phones and most laptops rather than desktops or servers.

> [!warning] Common mistake
> Assuming each DDR generation is "just a faster clock." The headline number (MT/s) grows from both a faster clock *and* a larger internal prefetch buffer — DDR5's jump to two independent sub-channels is a structural change to how the controller addresses the DIMM, not merely a speed bump.

### ECC RAM

**In plain words:** Error-Correcting Code RAM adds extra bits per word — commonly a 72-bit word storing 64 data bits plus 8 check bits — so the memory controller can detect and correct single-bit errors (and detect, without correcting, many double-bit errors) caused by cosmic rays or electrical noise flipping a capacitor's charge.

**Example:** a server running a database or cache that holds gigabytes of state for weeks at a time has a real, non-trivial chance of an uncorrected single-bit flip occurring somewhere in that memory over its uptime — a documented failure mode at scale. A consumer laptop, by contrast, is rebooted often enough and holds state briefly enough that the same risk rarely matters in practice, which is why most consumer hardware ships without ECC.

**Why it matters:** servers running long-lived, memory-heavy workloads pay the extra cost (and the small latency overhead of the check-bit logic) specifically because an uncorrected bit flip in multi-day-uptime DRAM is a real risk, not a theoretical one.

### GDDR and HBM: DRAM built for bandwidth

**In plain words:** a GPU has thousands of parallel execution units all wanting data at once — its bottleneck is **total bandwidth**, not the latency of any single access, because a GPU hides latency by having enormous numbers of threads in flight (a CPU core, by contrast, needs each individual access to come back fast, since it usually has far less work to overlap with the wait).

**GDDR** (Graphics DDR, now at GDDR6/6X/7) answers the GPU's need with a much wider bus per chip and chips soldered close to the GPU die, pushing a higher per-pin data rate (GDDR6X and 7 use multi-level signaling, PAM4/PAM3, to pack more bits per transfer) at the cost of higher latency than system DDR.

**HBM** (High Bandwidth Memory) goes further still: instead of a handful of chips on a circuit board, HBM stacks multiple DRAM dies vertically and connects them with thousands of through-silicon vias (TSVs), giving each stack a **1024-bit-wide interface** — far wider than GDDR's already-wide bus — at the cost of being physically bonded next to the compute die on an interposer rather than socketed.

```mermaid
flowchart LR
    subgraph DDR_sys["System DDR"]
        CPU1["CPU"] -- "64-bit bus per channel" --> DIMMs["DIMMs on\nthe motherboard"]
    end
    subgraph GDDR_sys["GPU with GDDR"]
        GPU1["GPU die"] -- "32-bit bus per chip,\nseveral chips" --> GChips["GDDR chips\nsoldered nearby"]
    end
    subgraph HBM_sys["AI accelerator with HBM"]
        GPU2["GPU/accelerator die"] -- "1024-bit bus per stack,\non an interposer" --> Stack["HBM stack:\nmultiple DRAM dies\n+ TSVs"]
    end
```

**Why it matters:** this is the memory technology behind AI accelerators like the Nvidia H100/H200, where total memory bandwidth, not raw compute, is frequently the limiting factor for serving large models — and VRAM/HBM capacity directly caps how large a model (or how big a batch) fits on one device.

> [!tip] Remember
> GDDR and HBM both sacrifice single-access latency for aggregate bandwidth. That trade only pays off for workloads with enough parallelism to hide the latency — GPUs and AI accelerators, not general-purpose CPU workloads.

## 4. Worked example

### Whiteboard version

A backend service's container is given a memory limit. Go's runtime needs to know that limit to decide how aggressively to run garbage collection:

```go
func ForContainer(containerBytes int64, headroomPct int) (int64, error) {
    usable := containerBytes * int64(100-headroomPct) / 100
    return usable, nil // simplified: real version validates inputs
}
```

This is the kind of small, real decision a backend engineer makes using exactly the concepts above: DRAM is the physical resource being budgeted; `GOMEMLIMIT` is how Go's runtime is told about that budget.

### Tracing the capacity-planning decision, step by step

**In plain words:** since Go 1.19, `runtime/debug.SetMemoryLimit` (and the equivalent `GOMEMLIMIT` environment variable) sets a **soft cap** on total Go-managed memory, prompting more frequent garbage collection as usage approaches that cap, instead of waiting for the default pacer (driven by `GOGC`) alone to decide.

1. A pod is given 512 MiB of DRAM by the container orchestrator (the physical resource this whole note has been about).
2. Without `GOMEMLIMIT`, Go's GC paces itself purely off `GOGC`, which tracks *live-heap growth*, not any absolute ceiling — so the process can still be OOM-killed by the kernel even while `GOGC`'s own metrics look perfectly healthy.
3. Setting `GOMEMLIMIT` with headroom (say, reserving 20% for runtime overhead, the OS page cache, and other processes) gives the runtime an actual number to GC against: `409.6 MiB` for a 512 MiB pod with 20% headroom.
4. As live Go-managed memory approaches that limit, the garbage collector runs more aggressively — on purpose, trading some CPU for staying under the hard container limit — well before the kernel's OOM killer would act.

**Example (measured, Go 1.24.4, darwin/arm64, run in the scratch module for this note, 2026-11-09):**

| Container size | Headroom | Computed `GOMEMLIMIT` |
| --- | --- | --- |
| 512 MiB | 20% | 409.6 MiB |
| 1 GiB | 10% | 0.9 GiB |

```text
$ go test -race ./memlimit/...
ok  	cs1scratch/memlimit	1.224s
```

**Why it matters:** `GOMEMLIMIT` and `GOGC` are not competing settings — `GOMEMLIMIT` is the absolute, DRAM-aware ceiling, and `GOGC` continues to control collection frequency *below* that ceiling. Pairing them is the production-grade answer to "how much container memory should a Go service actually request."

Runnable Go version, including input validation, the full table-driven test suite, and the `go vet`/`go test -race` output: [[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM - Go]].

## 5. Variants and comparison

| Technology | Cell / mechanism | Optimized for | Typical use |
|---|---|---|---|
| SRAM | 6T bistable latch, no refresh | Latency | CPU L1/L2/L3 cache, register files, TLB |
| DRAM (DDR5, 2025-era servers) | 1T1C, refreshed ~every 64 ms | Capacity and cost per GB, general-purpose bandwidth | System main memory |
| LPDDR | Same cell as DDR, lower-power interface | Power efficiency | Laptops, phones |
| GDDR6/6X/7 | Same cell family, wide per-chip bus, PAM4/PAM3 signaling | Raw bandwidth over latency | GPU video memory (VRAM) |
| HBM3 | 3D-stacked dies, TSVs, 1024-bit bus per stack | Maximum total bandwidth | AI accelerators (training/inference) |

## 6. Trade-offs and when not to use

- SRAM's speed costs area and money, so it's never used for gigabyte-scale main memory — only for the kilobytes-to-tens-of-megabytes that sit directly in the CPU's cache hierarchy.
- DRAM's refresh cycles are pure overhead: they use bus bandwidth and power for data nobody is reading right now, which is the price paid for 6x the density of SRAM per unit area.
- GDDR and HBM both sacrifice single-access latency for bandwidth; a workload dominated by latency-sensitive, low-parallelism memory access (most general-purpose CPU workloads) gains little or nothing from them, which is why servers run system DDR, not GDDR, for their CPUs.
- ECC RAM costs more and (on some platforms) is slightly slower due to the extra check-bit overhead; for a short-lived process or a non-critical workload, the probability of an uncorrected bit flip mattering in its lifetime is low enough that plain DDR is the common choice.

## 7. In production

- **Real systems:** cloud instance families advertise their DRAM technology and bandwidth explicitly (e.g. AWS/GCP/Azure memory-optimized instance types built on DDR5 platforms); Nvidia's H100/H200 and AMD's MI300 AI accelerators are specified by their HBM3/HBM3e capacity and bandwidth as a headline number, because it directly bounds model size and batch throughput; Redis and other in-memory stores are, at bottom, applications whose entire performance story depends on this chapter's DRAM latency and bandwidth numbers.
- **Failure modes -> fixes:**
  - A Go service gets OOM-killed by the kernel despite `GOGC` looking healthy in metrics -> set `GOMEMLIMIT` to a value with headroom below the container's hard limit (see the worked example).
  - Memory bandwidth, not CPU, caps throughput on a data-heavy workload (analytics, ML inference) -> check whether the workload is bandwidth-bound (profile memory bandwidth utilization) before assuming more CPU cores will help; may need a different instance type or accelerator with more memory bandwidth.
  - Rare, hard-to-reproduce data corruption in a long-running server -> check for ECC-capable hardware and whether ECC is actually enabled; non-ECC DRAM silently accepts the occasional bit flip.
- **What to monitor:** memory bandwidth utilization (not just capacity used) on bandwidth-sensitive workloads; ECC correctable-error counts (a rising rate signals failing DIMMs before they cause an uncorrectable error); container memory usage against both `GOGC`-driven heap size and `GOMEMLIMIT`.

## 8. Deep dive

- **Why "random access" is the defining property.** A magnetic tape must be read sequentially from wherever the read head currently sits — reaching byte 1,000,000 after byte 0 costs time proportional to the distance. RAM (SRAM or DRAM) is built so that, modulo row-buffer effects within DRAM banks, any address costs about the same as any other — the property the name describes, and the reason RAM can serve as a CPU's general-purpose working memory rather than only as a streaming buffer.
- **Rowhammer.** Repeatedly activating (hammering) one DRAM row at a very high rate can, due to electrical interference between physically adjacent rows, disturb a neighboring row's capacitors enough to flip bits in data the attacker never directly accessed — a real, documented hardware side-channel and security concern for both ECC and non-ECC DRAM (ECC mitigates single-bit instances but not all documented Rowhammer variants), and part of why DDR4/DDR5 controllers include target row refresh mitigations.
- **Why DDR5 needed two sub-channels.** As prefetch size grows each generation, a single wide, monolithic channel moves a bigger minimum chunk of data per access, which wastes bandwidth on small, scattered accesses; splitting each DIMM into two independent 32-bit sub-channels lets the controller serve two smaller requests in parallel instead of over-fetching one large one, improving effective bandwidth for mixed, less-than-perfectly-sequential real workloads.
- **GDDR and HBM latency, quantified relative to DDR.** Both trade higher per-access latency for bandwidth: GDDR's wider, faster-per-pin bus and HBM's enormous 1024-bit-per-stack interface both move far more bytes per second in aggregate than a CPU's DDR5 channel, but a single outstanding request to either typically takes longer to come back than a DDR5 request — acceptable for a GPU with thousands of threads able to hide that latency behind other work, and a poor fit for a CPU core executing a single serial instruction stream.
- **Where this connects back.** The density/speed/cost trade-off at the cell level (SRAM vs. DRAM) is the same trade-off that shapes the entire memory hierarchy in [[Memory Hierarchy and CPU Caches]]; the controller-and-bank mechanics here are also what the OS and hardware coordinate around for virtual memory and paging, covered in [[Virtual Memory, Paging and the TLB]].

## 9. Interview questions

> [!question]- What does "random access" actually mean, and what is it contrasted with?
> Any address can be read or written in about the same amount of time, regardless of which address was accessed previously — unlike sequential-access media (magnetic tape, and to a lesser degree spinning disks), where reaching a far-away address costs time proportional to the distance from the current position.

> [!question]- Why is SRAM used for CPU caches instead of just using faster DRAM everywhere?
> SRAM's 6-transistor cell needs no refresh and is inherently lower-latency, but costs roughly 6x the area per bit versus DRAM's 1-transistor-1-capacitor cell — so SRAM is reserved for the kilobytes-to-megabytes where speed matters most (caches, register files), while DRAM's density and lower cost per GB make it the only practical choice for gigabyte-scale main memory.

> [!question]- Why does DRAM need to be refreshed, and what does that cost?
> Each bit is stored as charge on a tiny capacitor, which leaks away within tens of milliseconds regardless of whether the system ever reads that address again. The memory controller must read and rewrite every row at least that often (JEDEC specifies roughly every 64 ms for DDR5) — bus bandwidth and power spent maintaining data, not serving requests.

> [!question]- Trap: is GDDR simply "faster DRAM," so could a CPU benefit from using it instead of DDR?
> No — GDDR trades higher per-access latency for much higher aggregate bandwidth, which suits a GPU's thousands of parallel, latency-tolerant threads but would slow down a CPU core's single serial instruction stream, where each individual memory access's latency directly stalls the next instruction. CPUs use DDR because CPU workloads are typically latency-sensitive, not bandwidth-saturating in the way GPU workloads are.

> [!question]- What problem does HBM solve that GDDR doesn't fully solve?
> Even more aggregate bandwidth than a wide GDDR bus can provide, by stacking multiple DRAM dies vertically and connecting them with thousands of through-silicon vias for a combined interface width (1024 bits per stack) far beyond what a planar PCB trace layout could route — the technology behind the memory bandwidth figures AI accelerators advertise, because total model/batch size that fits in memory, and the bandwidth to stream it, both directly limit inference and training throughput.

> [!question]- Why would a backend engineer set `GOMEMLIMIT` instead of only tuning `GOGC`?
> `GOGC` paces collection relative to live-heap growth, with no notion of an absolute ceiling, so a process can still be killed by the kernel's OOM killer in a memory-constrained container even while `GOGC`'s pacing looks fine. `GOMEMLIMIT` (Go 1.19+) gives the runtime an actual soft cap tied to the container's real memory limit, so GC runs more aggressively as usage approaches that cap instead of waiting to be killed.

## 10. Cheat sheet

- RAM = constant-time access to any address, unlike sequential media; it is volatile, so every bit is lost on power loss (ROM/flash is the non-volatile counterpart).
- SRAM: 6T latch, no refresh, fast, expensive, low density — used for caches and register files.
- DRAM: 1T1C, refreshed ~every 64 ms, cheaper and denser, slower — used as main memory.
- DDR doubles transfers per clock edge; each generation grows the prefetch buffer for more bandwidth (DDR5: two 32-bit sub-channels, on-die ECC, 4800-8800+ MT/s).
- ECC RAM adds check bits to detect/correct bit flips — standard in servers, usually skipped on consumer hardware.
- GDDR: wide bus, high bandwidth, higher latency than DDR — GPU VRAM.
- HBM: 3D-stacked dies with a 1024-bit-per-stack interface, the most bandwidth of all — AI accelerators.
- For Go services, pair `GOMEMLIMIT` (an absolute DRAM-aware ceiling) with `GOGC` (collection pacing below that ceiling).

## Links

- **Before this:** [[Memory Hierarchy and CPU Caches]]
- **Next:** [[ROM, Flash, Firmware and the Boot Process]], [[Storage Devices - HDD, SSD, NVMe]]
- **Compare with:** [[How a Computer Runs a Program]] (what DRAM holds once a process is loaded)
- **Runnable code:** [[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM - Go]]
