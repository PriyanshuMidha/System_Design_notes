---
tags: [cs-fundamentals, hardware, storage]
level: intermediate
status: reviewed
prereqs: ["[[Memory Hierarchy and CPU Caches]]"]
related: ["[[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM]]", "[[Page Cache, File Systems and fsync]]", "[[Latency Numbers Every Engineer Should Know]]", "[[Storage Engines - B-tree vs LSM and WAL]]"]
sources:
  - "Seagate Exos enterprise HDD datasheets (7200 rpm class, 2024)"
  - "NVM Express Base Specification (NVMe), nvmexpress.org"
  - "AWS EBS volume type documentation (gp3, io2), 2025"
  - "JEDEC and SNIA solid-state storage glossaries (NAND, FTL, TRIM, write amplification)"
updated: 2026-11-09
---

# Storage Devices - HDD, SSD, NVMe

> [!summary] TL;DR
> Storage is non-volatile: data survives power loss. An HDD reads and writes by physically moving a head over a spinning magnetic platter, which is slow (milliseconds) and loves sequential access. An SSD has no moving parts; it reads and writes NAND flash through a controller that must erase in large blocks before rewriting, which is fast (microseconds) but ages the device and causes write amplification. NVMe is the modern command protocol that lets an SSD talk to the CPU over PCIe with thousands of parallel queues instead of the one queue SATA allows.

> [!abstract] Core idea
> - HDDs move a physical head (seek + spin), so latency is milliseconds and sequential I/O is far cheaper than random I/O.
> - SSDs have no head to move, but flash can only be erased a whole block at a time, so overwriting data means copying it elsewhere first (write amplification).
> - NVMe is a protocol, not a chip: it lets an SSD controller expose up to 64K queues of 64K commands each over PCIe, instead of SATA's single queue of 32.
> - IOPS × block size = throughput. A device can be throughput-bound (big sequential transfers) or IOPS-bound (small random transfers) depending on the workload.
> - Durability on commit depends on `fsync` actually reaching persistent media, not just the OS's page cache.

## 1. Why it exists

A backend service writes an order to a database, a log line to disk, or a container image to a volume. All of it has to live somewhere after the process exits and the machine reboots. RAM loses its contents the instant power is cut (see [[Memory Hierarchy and CPU Caches]]), so every system that needs to remember anything past a restart needs a **non-volatile** tier underneath RAM: slower by 3–5 orders of magnitude, but durable and far cheaper per byte.

Here is why the device you pick matters in practice, not just in theory. A database doing 10,000 small random writes per second needs a device that can sustain 10,000 **IOPS** (input/output operations per second — one read or write counts as one operation, regardless of how small). An HDD tops out around 100–200 random IOPS, a 50–100× shortfall. An NVMe SSD sustains hundreds of thousands. Picking the wrong device class for the access pattern is one of the most common root causes of "the database is slow" incidents — and it is a cause nobody can fix with better code, because the bottleneck is physical.

> [!tip] Remember
> Storage exists because RAM forgets. The device you choose is really a bet about your access pattern: sequential and cold data tolerates slow, cheap devices; random and hot data does not.

## 2. Mental model

### The record player and the whiteboard

**In plain words:** An HDD behaves like a record player. A physical arm (the **head**) has to swing to the right groove (**seek**) and then wait for the right point on the spinning disk to arrive (**rotational latency**) before it can read anything. An SSD behaves like a whiteboard with one annoying rule: you can write on any blank cell instantly, but to erase, you must wipe an entire large tile of cells at once — even if only one cell on that tile is wrong.

**Picture it:**

```mermaid
flowchart LR
    subgraph HDD_Model["HDD: record player"]
        direction TB
        H1["Arm swings to the groove<br/>(seek)"] --> H2["Wait for the right spot<br/>to spin underneath<br/>(rotational latency)"] --> H3["Needle reads<br/>(transfer)"]
    end
    subgraph SSD_Model["SSD: ruled whiteboard"]
        direction TB
        S1["Write any blank cell<br/>instantly"] --> S2["To fix one cell,<br/>wipe the whole tile"] --> S3["Copy the tile's still-good<br/>cells elsewhere first"]
    end
```

**Example:** Reading one byte from the middle of a record means moving the needle there first — slow, no matter how small the byte is. Reading one byte from a already-open page of the whiteboard costs almost nothing, but erasing is always tile-sized, never cell-sized.

**Why it matters:** Every mechanical cost on an HDD (seek, rotation) is paid per *access*, not per *byte*, so batching accesses into one long sequential run is the single biggest lever you have. Every SSD cost (erase, copy-before-erase) is paid per *block*, not per *write*, so how full the drive is and how the writes are spread across it matter more than their size.

NVMe does not change either whiteboard or record player — it only changes how many clerks are standing at the desk taking requests. A single clerk (SATA/AHCI, one queue) versus thousands of clerks each holding thousands of pending requests (NVMe) is purely about how many requests can be in flight at once, not about the storage medium underneath.

> [!warning] Common mistake
> Treating "SSD" and "NVMe" as synonyms. SSD describes the storage medium (NAND flash); NVMe describes the command protocol used to talk to it. A SATA SSD and an NVMe SSD can use identical flash chips — the difference is entirely in how many requests the CPU can have outstanding at once.

## 3. How it works

### HDD mechanics: three costs, paid every random access

**In plain words:** A platter spins at a fixed rate. To read one sector, the head first moves to the right track, then waits for that exact sector to rotate underneath it, then transfers the bits. All three steps happen on every random read; only the last one happens on a sequential read that's already at the right track.

**Picture it:**

```mermaid
flowchart LR
    subgraph HDD["HDD read of one sector"]
        direction LR
        A["Seek: move arm to track<br/>~5-10 ms"] --> B["Rotational latency: wait for sector<br/>~4.2 ms avg @ 7200 rpm"] --> C["Transfer: read sector<br/>~tens of µs"]
    end
```

**Example:** Average rotational latency is half a revolution. At 7,200 rpm (120 revolutions/second), one revolution takes 8.33 ms, so the average wait for a random sector is **4.17 ms** (documented: 60,000 ms/min ÷ 7,200 rpm ÷ 2, from rotational speed). Add seek time (~5–10 ms, documented: Seagate Exos datasheets) and a single random read costs roughly **9–14 ms** before any data even starts moving. Sequential reads amortize seek and rotation across a whole track instead of paying them per sector, reaching **150–250 MB/s sequential vs. 100–200 random IOPS** (documented: enterprise HDD datasheets).

**Why it matters:** This is the entire reason databases, Kafka, and WAL-based systems design around sequential writes whenever a spinning disk is anywhere in the picture (see [[Storage Engines - B-tree vs LSM and WAL]]) — a workload that reorders itself to be sequential can be 1,000× cheaper on an HDD than one that doesn't.

> [!tip] Remember
> On an HDD, cost is paid per *access* (seek + rotate), almost regardless of how much data that access transfers. Sequential access pays it once for many sectors; random access pays it every single time.

### SSD internals: pages, blocks, and the FTL

**In plain words:** NAND flash is organized into **pages** (4–16 KB, the smallest unit you can write) grouped into **erase blocks** (hundreds of pages, the smallest unit you can erase). You can write a blank page directly, but you can never rewrite a page in place — it has to be erased first, and erasing only happens a whole block at a time. The **Flash Translation Layer (FTL)** — firmware living inside the SSD — hides this limitation from the OS entirely.

**Picture it:**

```mermaid
stateDiagram-v2
    [*] --> Free: block erased
    Free --> Valid: host writes a page
    Valid --> Stale: host overwrites that LBA\n(new copy written elsewhere)
    Stale --> Free: garbage collection erases\nthe whole block
    Valid --> Free: garbage collection erases the block\n(this page's data copied to a Free page first)
```

**Example:** Every logical write goes to a fresh physical page; the old physical copy, if there was one, is marked **stale** (dead weight, not yet reclaimed). A background **garbage collector** later picks a block, copies out any pages still marked **valid**, and only then erases the whole block — turning every page in it back to **free**.

**Why it matters:** That copy-before-erase step is not optional bookkeeping — it is the entire reason flash write cost can exceed what the host asked for, and it is the mechanism the worked example below measures directly.

### NAND cell types: a straight trade of density for speed and endurance

**In plain words:** A NAND cell can store more than one bit by distinguishing more voltage levels, but reading and writing more levels is slower and wears the cell out faster.

**Picture it:**

```mermaid
flowchart LR
    SLC["SLC — 1 bit/cell<br/>fastest, most durable, most $/GB"] --> MLC["MLC — 2 bits/cell"]
    MLC --> TLC["TLC — 3 bits/cell<br/>mainstream 2025 choice"]
    TLC --> QLC["QLC — 4 bits/cell<br/>cheapest, densest, slowest writes,<br/>lowest endurance"]
```

**Example:** A QLC block tolerates roughly 1,000–3,000 erase cycles before it wears out; an SLC block tolerates 30,000–100,000 (documented: SNIA / vendor endurance specs) — a 10–30× gap for the same silicon process, purely from how many voltage levels each cell has to distinguish.

**Why it matters:** This is why archival, read-heavy SSDs use QLC (cheap, dense, endurance doesn't matter if you rarely rewrite) while write-heavy database SSDs use TLC or better.

### Wear leveling, TRIM, and over-provisioning: the three levers that fight write amplification

- **Wear leveling** spreads writes evenly across blocks so no single block wears out first, since each block tolerates only a finite number of erases.
- **TRIM** is the OS telling the SSD "these logical blocks are deleted, don't bother preserving their data on your next garbage-collection pass." Without TRIM, the FTL keeps copying dead data forever, because it has no way to know the host stopped caring about it.
- **Over-provisioning** is spare physical capacity the FTL reserves beyond the drive's advertised logical size. More spare capacity means the garbage collector almost always finds blocks that are mostly empty to reclaim; less spare capacity (a nearly-full drive) forces it to reclaim blocks still full of live data, multiplying the number of physical writes per host write.

> [!tip] Remember
> Over-provisioning is the one lever you control after purchase: keeping a drive below ~80–90% utilization is, mechanically, keeping the garbage collector's job easy.

### SATA/AHCI vs NVMe: one clerk versus thousands

**In plain words:** SATA SSDs speak **AHCI**, a protocol designed in 2004 for spinning disks — one command queue, depth 32. **NVMe** is a protocol built from scratch for flash, running over PCIe instead of a SATA cable, with up to 64K queues of up to 64K commands each.

**Picture it:**

```mermaid
flowchart TB
    subgraph SATA["SATA / AHCI"]
        direction LR
        CPU1["CPU cores"] --> Q1["1 queue, depth 32"] --> SSD1["SSD controller"]
    end
    subgraph NVMe_Proto["NVMe"]
        direction LR
        CPU2["CPU cores"] --> Q2["up to 64K queues,<br/>64K commands each"] --> SSD2["SSD controller<br/>(many parallel flash channels)"]
    end
```

**Example:** SATA SSDs land around **500–550 MB/s** (the SATA III link limit, documented) and roughly 80–100 µs latency (an estimate, not measured on this machine); NVMe SSDs on PCIe 4.0/5.0 reach multiple GB/s and **20–100 µs latency** (documented: NVMe Base Specification; vendor NVMe datasheets, 2025).

**Why it matters:** A single queue of depth 32 becomes the bottleneck long before the flash chips themselves run out of parallelism. NVMe's many deep queues let the OS spread I/O across CPU cores so that no single queue, and no single core, becomes the choke point — matching how parallel the flash itself actually is internally.

## 4. Worked example

### Whiteboard version

IOPS, block size, and throughput are related by one identity:

```text
throughput = IOPS × block size
```

A device rated at 100,000 random 4 KB IOPS can sustain about 400 MB/s of small random I/O — far below its sequential rating, because sequential transfers use much larger blocks per operation. When sizing storage for a service, always ask which number matters for the workload: a log shipper doing large sequential appends is **throughput-bound**; an OLTP database doing point lookups is **IOPS-bound**.

### Tracing write amplification by hand

Take a tiny toy drive: 10 erase blocks of 4 pages each (40 pages total). Walk a skewed random-write workload across it and watch the garbage collector work.

1. The host writes to LBA 7. The FTL finds a free page, marks it **valid**, and records LBA 7 → that physical page.
2. The host writes to LBA 7 again. The *old* physical page is marked **stale** (it still holds data, but nobody will read it again); a brand-new physical page becomes the current copy.
3. Free pages run low (the toy FTL's threshold is "one block's worth of free pages remaining"). The garbage collector picks the block with the fewest **valid** pages — cheapest to reclaim — and copies those valid pages to fresh locations elsewhere.
4. Only after every valid page is safely copied out does the collector erase the whole block, turning every page in it back to **free**.
5. Every page copied in step 3 is a **gcWrite** — a physical write the host never asked for. **Write amplification** is `(host writes + GC writes) / host writes`; a working set that is 80% of capacity leaves little slack for step 3 to find nearly-empty blocks, so it amplifies far more than a working set at 40%.

```mermaid
sequenceDiagram
    participant Host
    participant FTL
    participant Block as Chosen block (GC target)

    Host->>FTL: Write(lba)
    FTL->>FTL: mark old physical copy stale (if any)
    FTL->>FTL: write new copy to a free page
    Note over FTL: free pages ≤ 1 block's worth
    FTL->>Block: find valid pages still in this block
    FTL->>Block: copy each valid page to a new free page (gcWrite)
    FTL->>Block: erase the whole block (all pages become free)
```

Runnable Go version: [[Storage Devices - HDD, SSD, NVMe - Go]]

## 5. Variants and comparison

| Device | Mechanism | Typical latency | Typical throughput | Cost per GB | Use when |
| --- | --- | --- | --- | --- | --- |
| HDD (7200 rpm) | Spinning platter, moving head | ~9–14 ms random; <1 ms/track sequential (documented: Seagate Exos datasheets) | 150–250 MB/s sequential; 100–200 random IOPS (documented: enterprise HDD datasheets) | Lowest | Backups, cold/archival tiers, large sequential logs |
| SATA SSD | NAND + FTL, AHCI protocol | ~80–100 µs (estimate) | ~500–550 MB/s (SATA III 6 Gb/s link limit, documented) | Medium | Budget servers, boot volumes, light random I/O |
| NVMe SSD (PCIe 4/5) | NAND + FTL, NVMe protocol | ~20–100 µs (documented: NVMe spec, 2025 vendor datasheets) | Multiple GB/s, millions of IOPS at depth | Higher | Databases, high-IOPS workloads, local instance storage |
| EBS gp3 (network block) | Remote NVMe-backed volume over the network | ~1 ms+ (network hop added) | Baseline 125 MB/s / 3,000 IOPS, provisionable higher (documented: AWS EBS docs, 2025) | Pay for provisioned IOPS/throughput | Durable, detachable cloud block storage |
| EBS io2 (network block) | Remote, replicated, higher durability tier | ~1 ms+ | Up to 256,000 IOPS per volume (documented: AWS EBS docs, 2025) | Highest block tier | Latency-sensitive databases needing guaranteed IOPS |

### RAID: trading capacity for redundancy, and how that interacts with write cost

**In plain words:** RAID combines several physical disks into one logical volume. The layout you pick decides both how much redundancy you get and how expensive each write becomes.

**Picture it:**

```mermaid
flowchart TB
    subgraph RAID0["RAID 0 (striping)"]
        direction LR
        W0["1 write"] --> D0a["Disk A"]
        W0 --> D0b["Disk B"]
    end
    subgraph RAID1["RAID 1 (mirroring)"]
        direction LR
        W1["1 write"] --> D1a["Disk A"]
        W1 --> D1b["Disk B (mirror copy)"]
    end
    subgraph RAID5["RAID 5 (parity)"]
        direction LR
        W5["1 write"] --> R1["read old data + old parity"] --> R2["write new data + new parity"]
    end
```

**Example:** RAID 5 computes parity across stripes, so every write requires reading the old data and the old parity, then writing the new data and new parity — the **RAID 5 write penalty**: roughly 4 physical I/Os per logical write. RAID 10 (striped mirrors) just writes to two disks directly, with no parity math at all, at the cost of needing twice the raw capacity instead of one extra parity disk.

**Why it matters:** For a random-write-heavy workload like an OLTP database, that 4-I/O penalty on RAID 5 is a real, measurable latency and throughput cost — which is why production databases usually choose RAID 10 despite its lower usable capacity.

> [!tip] Remember
> RAID 0 has zero redundancy and is not a backup strategy; RAID 1/10 trade capacity for simple, fast redundancy; RAID 5/6 trade write latency for cheaper redundancy.

## 6. Trade-offs and when not to use

- NVMe is not simply "a fast SSD" — it is a different command protocol. A SATA SSD cannot be made NVMe-fast just by changing drivers; the queue depth limit is architectural, built into the hardware.
- Local NVMe instance storage (e.g. EC2 instance store) is often faster and cheaper per IOPS than network-attached EBS, but it is ephemeral: data is lost if the instance stops. Use it for scratch space or data you can rebuild, never the system of record.
- HDDs still win on raw $/GB for cold data accessed rarely and sequentially (backups, write-once logs, archival tiers like S3 Glacier's underlying media) — don't pay SSD prices for data nobody reads.
- RAID 0 (striping) is not a backup: it has no redundancy, and a single disk failure loses everything. RAID 1 (mirroring) and RAID 10 (striped mirrors) add redundancy at the cost of usable capacity; RAID 5/6 use parity instead, trading a slower, CPU-heavier write path for less capacity overhead.
- Choosing per data type: a database's primary data and WAL benefit most from low-latency NVMe; application logs are sequential and can tolerate HDD or object storage; backups want the cheapest durable tier (often object storage, not block storage at all).

## 7. In production

- **Real systems:**
	- Cloud block storage: AWS EBS (gp3 general purpose, io2 provisioned IOPS), all backed by NVMe SSDs behind a network layer.
	- Cloud object storage: Amazon S3, which stores objects (not blocks or files) and is commonly backed by large pools of HDDs with SSD caching tiers for metadata and hot objects.
	- Managed file storage: AWS EFS (NFS-based, file-level, shared across instances) vs. EBS (block-level, single-attach by default) vs. S3 (object-level, HTTP API) — three different storage models for three different access patterns.
	- Databases: PostgreSQL and MySQL both assume random-write-capable storage for their WAL and data files; running them on HDD is a known source of commit-latency pain, because `fsync` must wait for rotational latency on every commit.
- **Failure modes → fixes:**
	- A nearly-full SSD shows rising write latency under sustained random writes (write-amplification spiral) → keep utilization below ~80–90%, or increase over-provisioning.
	- An HDD-backed database has high p99 commit latency → move the WAL to SSD/NVMe even if bulk data stays on HDD; or batch commits (`synchronous_commit` tuning) to amortize fsync cost.
	- An EC2 instance using local NVMe loses its data on stop/terminate → replicate to durable storage (EBS, S3, a database's own replication) before relying on it.
	- A drive degrades silently (rising uncorrectable error rate) → monitor SMART/NVMe health attributes, not just "is it responding".
- **What to monitor:**
	- IOPS and throughput against the device's rated limits (and whether the workload is IOPS-bound or throughput-bound).
	- p99/p999 I/O latency, not just average — tail latency is what users and SLAs actually feel.
	- SSD wear indicators: percentage of rated write endurance used, and SMART/NVMe SMART-log attributes.
	- Queue depth and `iostat`'s `%util` / `await` to see whether the device itself, not the application, is the bottleneck.

## 8. Deep dive

- **Write amplification factor (WAF)** is formally `(host writes + GC writes) / host writes`. It is driven by three things: how full the drive is (less spare capacity means GC must reclaim blocks with more live data), how skewed the write pattern is (hot LBAs rewritten often vs. spread evenly), and whether TRIM is in use (deleted data the FTL doesn't know about gets uselessly copied forward).
- **Power-loss protection:** enterprise SSDs include capacitors that hold enough charge to flush the device's internal write cache to NAND on sudden power loss. Consumer SSDs often lack this, meaning an `fsync` that the OS believes succeeded can still lose data if the device's own cache hadn't landed on flash yet — a real source of "the database said it committed, but the data is gone after a crash" bugs.
- **The write path and why `fsync` matters:**

```mermaid
sequenceDiagram
    participant App
    participant PageCache as OS page cache
    participant Block as Block layer
    participant Dev as Device's own cache
    participant NAND as Persistent NAND/platter

    App->>PageCache: write()
    Note over PageCache: returns success here —<br/>data is NOT yet durable
    App->>Block: fsync()
    Block->>Dev: flush dirty pages to device
    Dev->>NAND: device flushes its own cache
    NAND-->>App: fsync returns once this completes
```

  An application `write()` typically lands in the OS page cache first (see [[Page Cache, File Systems and fsync]]), not the device. `fsync` forces that dirty data out through the block layer to the device, and a well-behaved device then flushes its own cache to persistent NAND/platter before acknowledging. Any layer that lies about having persisted data (a RAID controller with a non-battery-backed cache, a misconfigured cloud volume) breaks the durability guarantee a database relies on.
- **Block vs. file vs. object storage** are different abstractions over the same physical devices: block storage (EBS) exposes raw addressable blocks that the OS formats with its own filesystem; file storage (EFS) exposes a shared hierarchical namespace over NFS; object storage (S3) exposes flat key → blob access over HTTP with no partial-update semantics — you replace a whole object, you don't seek into it and overwrite bytes.
- **USB drives and SD cards** use the same NAND flash as SSDs but pair it with much simpler, cheaper controllers: thinner wear leveling, little or no over-provisioning, and no power-loss protection — which is why they are reliable for file transfer but a poor choice for a database or anything needing write durability guarantees under power loss.

## 9. Interview questions

> [!question]- Why is sequential I/O so much faster than random I/O on an HDD, but the gap is much smaller on an SSD?
> On an HDD, each random access costs a full seek (moving the arm) plus rotational latency (waiting for the sector to rotate under the head) — several milliseconds of pure mechanical delay regardless of how little data is transferred. Sequential access does one seek for a whole run of data. An SSD has no moving parts, so there is no seek/rotation cost; the remaining gap on SSDs comes from controller overhead, parallelism across flash channels, and how garbage collection batches lookups — all much smaller effects.

> [!question]- What is write amplification, and what causes it to get worse?
> It's the ratio of physical bytes an SSD actually writes to the logical bytes the host asked it to write, caused by the FTL's garbage collector copying still-valid pages out of a block before erasing it. It worsens as the drive fills up (less spare capacity means GC must reclaim blocks with more live data) and as the write pattern gets more skewed (a few hot logical addresses rewritten constantly, instead of writes spread evenly).

> [!question]- Trap: "NVMe is just a faster kind of SSD, like a faster SATA SSD." True or false?
> False. NVMe is a command protocol designed for flash from the ground up, running over PCIe with up to 64K queues of 64K commands each, versus AHCI/SATA's single queue of depth 32. The NAND flash inside an NVMe drive isn't inherently different from a SATA SSD's; the protocol is what removes the queueing bottleneck and lets the drive's internal parallelism actually be used.

> [!question]- Why does a database's commit latency often track storage latency so tightly?
> A transactional commit typically can't be acknowledged to the client until the write-ahead log entry is durably persisted, which means an `fsync` (or equivalent) has to complete. That `fsync` blocks on the storage device's actual write latency — rotational latency and seek on an HDD, or program time on NAND — so the device's latency floor becomes the commit latency floor.

> [!question]- What does over-provisioning buy you on an SSD, concretely?
> Spare physical capacity beyond the advertised logical size. It gives the garbage collector blocks to work with that are mostly empty, so it reclaims space cheaply (few live pages to copy). Less over-provisioning (or a drive that's simply nearly full) forces GC to reclaim blocks full of live data, multiplying physical writes per host write and raising both write amplification and latency.

> [!question]- Block, file, and object storage: what's actually different, not just "where you'd use each"?
> Block storage (EBS) exposes raw fixed-size blocks the OS addresses directly and formats with its own filesystem — you can overwrite any byte range. File storage (EFS/NFS) adds a shared hierarchical namespace with POSIX-like semantics across multiple clients. Object storage (S3) has no partial writes at all: an object is replaced wholesale via an HTTP API, and there's no OS filesystem layer between you and it — that's also why you can't `fsync` into S3 the way you can into a mounted block device.

> [!question]- Why would you choose RAID 10 over RAID 5 for a database, given RAID 10 wastes more capacity?
> RAID 5 computes parity across stripes, so every write requires reading the old data and parity, then writing new data and new parity (the "RAID 5 write penalty"), which hurts random-write-heavy workloads like OLTP databases. RAID 10 (striped mirrors) just writes to two disks directly with no parity computation, so write latency and throughput are much better for that workload — at the cost of needing twice the raw capacity instead of just one extra parity disk.

## 10. Cheat sheet

- HDD: seek (~5–10 ms) + rotational latency (~4.2 ms avg at 7200 rpm) dominate random access; sequential is cheap. Still wins on $/GB for cold, sequential data.
- SSD: NAND pages are written freely but erased only a whole block at a time; the FTL never overwrites in place, so garbage collection must copy live pages before erasing — that copy cost is write amplification.
- IOPS × block size = throughput; know which one bounds your workload.
- NVMe is a protocol (massively parallel queues over PCIe), not just "a newer SSD"; it's why NVMe SSDs scale to millions of IOPS where SATA SSDs cap around SATA III's link speed.
- Over-provisioning (spare flash capacity) keeps write amplification low; a nearly-full SSD under random writes amplifies much more.
- `fsync` durability depends on every layer in the path actually flushing to persistent media, including the device's own write cache (power-loss protection matters here).
- Block (EBS) vs. file (EFS) vs. object (S3) storage are different data models, not just different price points.
- RAID 0 has no redundancy; RAID 10 beats RAID 5 on random-write-heavy workloads because it avoids the parity read-modify-write penalty.

## Links

- **Before this:** [[Memory Hierarchy and CPU Caches]]
- **Next:** [[Page Cache, File Systems and fsync]], [[Latency Numbers Every Engineer Should Know]]
- **Compare with:** [[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM]] (volatile, byte-addressable memory vs. non-volatile, block-addressable storage), [[Storage Engines - B-tree vs LSM and WAL]] (how databases lay data out on top of these devices)
- **Runnable Go version:** [[Storage Devices - HDD, SSD, NVMe - Go]]
