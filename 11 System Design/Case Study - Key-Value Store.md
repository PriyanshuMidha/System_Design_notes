---
tags: [system-design, case-study, key-value-store, dynamo, replication, quorum]
level: intermediate
status: reviewed
prereqs: ["[[Consistent Hashing]]", "[[Replication]]", "[[Quorums and Leaderless Replication]]", "[[Storage Engines - B-tree vs LSM and WAL]]"]
related: ["[[Partitioning and Sharding]]", "[[CAP and PACELC]]", "[[Clocks and Ordering]]", "[[CRDTs and Conflict Resolution]]", "[[Failure Detection, Gossip and Membership]]", "[[Wide-Column Stores and Cassandra]]", "[[Consensus - Raft and Paxos]]", "[[In-memory KV Store with TTL and Transactions]]"]
sources:
  - "DeCandia et al., Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)"
  - "Elhemali et al., Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service (USENIX ATC 2022)"
  - "Apache Cassandra documentation: consistency levels, hinted handoff (max_hint_window), repair"
  - "etcd documentation: storage quota (default 2 GB, suggested maximum 8 GB)"
  - "Lakshman & Malik, Cassandra - A Decentralized Structured Storage System (LADIS 2009)"
updated: 2026-11-13
---

# Case Study - Key-Value Store

> [!summary] TL;DR
> Design a distributed key-value store: `put(key, value)` and `get(key)` over billions of keys on dozens of machines, which stays available when machines fail.
>
> This case study assembles known building blocks (consistent hashing, replication, quorums, an LSM storage engine, gossip) and spends its time on the decisions between them: which consistency you give up, how conflicts are resolved and how the cluster heals.

> [!abstract] Core idea
> - Partition keys over nodes with consistent hashing and virtual nodes; replicate each key to N nodes (usually 3).
> - A coordinator writes to all N replicas and waits for W acknowledgements; reads ask R replicas. `W + R > N` makes reads see the latest acknowledged write when no failures intervene.
> - The leaderless (Dynamo) design keeps accepting writes during failures and resolves conflicts later with vector clocks or last-write-wins. The leader-based design (Raft per partition) gives linearizable keys but pauses a partition during leader elections.
> - Healing happens in three layers: hinted handoff, read repair and Merkle-tree anti-entropy.
> - Each node stores data in an LSM tree: commit log, memtable, SSTables, compaction, Bloom filters.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add sections 3 (how it works), 4 (worked example), 5 (variants) and 6 (trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Consistent Hashing]]: keys and machines are placed on a circle, and a key belongs to the next machine clockwise.
> - [[Replication]]: keeping copies of data on several machines so one failure loses nothing.
> - [[Quorums and Leaderless Replication]]: any copy can take a write, and a request waits for "enough" copies (like 2 of 3) to answer.
> - [[Storage Engines - B-tree vs LSM and WAL]]: an LSM engine writes new data to memory and a log, then to sorted files, which makes writes cheap.

**From zero, in 60 seconds** 🟢

A key-value store is like a giant dictionary: give it a key, get back a value.
When there are billions of keys, they do not fit on one machine, so they are spread over many.
A hash of the key decides which machines hold it. This layout is called a **hash ring**.
Each key is copied to 3 machines, so one crash loses nothing.
A write or read does not wait for all 3. It waits for "enough" of them, for example 2 of 3. That "enough" is a **quorum**.

```mermaid
flowchart LR
    C["put cart:42"] --> R["Hash ring picks<br/>3 machines"]
    R --> A["A: ok"]
    R --> B["B: ok"]
    R --> X["C: slow"]
    A --> Q["2 of 3 ok: done"]
    B --> Q
```

Copies can disagree for a while. Background jobs compare them and fix differences.

So the rest of this note is just these 3 questions:
1. How do you decide which machines store a key?
2. How many copies must answer before a read or write counts?
3. How do copies that disagree get fixed?

**The problem in one story.**
A map in a program stores `name -> value` and finds it instantly.
Now imagine that map holds billions of entries, too many for one computer.
You spread it over dozens of machines, and some of them will crash.
You still want `get` and `put` to work, and not lose data.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Key-value pair | A name and the data stored under it | `user:42 -> "Asha"` |
| Node | One machine in the cluster | `node-7` |
| Partition | One slice of all keys, owned by some nodes | Keys hashing to 0-99 |
| Replica | An extra copy of the same data on another node | 3 copies of `user:42` |
| Hash | A function that turns a key into a number | `hash("user:42") = 8812` |
| Quorum | The minimum number of replicas that must answer | 2 of 3 |
| Consistency | Whether every reader sees the latest write | Read right after write shows it |

| Coordinator | The node that receives a request and talks to the replicas for it | node B forwards `put` to A, B and C |
| Vector clock | A small version stamp with one counter per node, used to spot concurrent writes | `{A:1, B:1}` |
| Sibling | One of two versions written at the same time, both kept for the client to merge | cart `[book, pen]` and `[book, cup]` |
| Tombstone | A "deleted" marker kept for a while instead of erasing the key at once | `cart:42` deleted at clock `{A:3}` |

**Picture it**

```mermaid
flowchart LR
    C["Client: put(k, v)"] --> CO["Coordinator node"]
    CO --> H["hash(k) picks<br/>3 replicas"]
    H --> A["Replica A"]
    H --> B["Replica B"]
    H --> D["Replica C"]
    A --> OK["2 of 3 said OK<br/>so write succeeds"]
    B --> OK
```

**Analogy.** A library splits its books across many branches by the first letter of the title, and keeps three copies of each book in different branches in case one branch floods.
Where it breaks: a library rarely updates a book in two branches at the same moment, but a key-value store must decide which of two conflicting writes wins.

**How the rest of this note builds up**

- First, requirements (section 1) and the mental model (section 2).
- Then the high-level design: partitioning, replication, quorums and storage (section 3), plus estimates, API and Go code for vector clocks (section 4).
- Then variants, trade-offs and production lessons (sections 5-7).
- Finally the SDE-3 deep dive: healing with hints and Merkle trees, adding nodes, what quorums do not give you (section 8).

> [!tip] Remember
> Hash keys to pick nodes, keep N copies, wait for enough of them to answer, and repair differences in the background.

## 1. Why it exists - requirements 🟢

A single Redis or PostgreSQL instance holds a few hundred GB and fails as a unit. A shopping cart, session store or user-profile cache that must take 100k operations per second, hold 10 TB and **never reject a write because one machine died** needs the data spread and copied across many machines.

**Functional requirements**
- `put(key, value)`, `get(key)`, `delete(key)`. Keys up to 256 B, values up to 100 KB (assumed limits).
- Optional per-key TTL.
- Tunable consistency per request (fast and possibly stale, or quorum).

**Non-functional requirements**
- **Scale:** 10 billion keys, average value 1 KB (interview assumptions).
- **Throughput:** 100k reads/s and 50k writes/s, growing 2x per year.
- **Latency:** p99 under 10 ms inside one region (a target).
- **Availability:** writes keep succeeding when any one node, or one availability zone (one data centre building inside a cloud region), is down.
- **Durability:** an acknowledged write survives the loss of any single node.
- **Elasticity:** add nodes without downtime; data moves automatically.

### Real-life example: a shopping cart 🟢

Amazon built its original Dynamo store so the shopping cart would always accept "add to cart", even when some servers were down.
Say you add a book on your phone and a pen on your laptop at nearly the same moment, and the two writes land on different servers.
Instead of throwing one away, the store keeps both versions, and the next time you open the cart they are merged into "book + pen".
That is the main idea of this note: stay writable, and fix disagreements afterwards.

**Out of scope**: secondary indexes, range scans across keys, multi-key transactions, cross-region replication (mentioned at the end).

## 2. Mental model 🟢

Picture a **library spread over many branch buildings**. Every book (key) has a catalogue number that says which three branches keep a copy (replication by consistent hashing). To lend a book you only need two of the three branches to agree (quorum).

If one branch is closed, a neighbouring branch keeps a note "return this to branch C when it reopens" (hinted handoff). Every night, branches compare checklists to find copies that drifted apart (anti-entropy).

The core decision is the **CAP and PACELC choice** ([[CAP and PACELC]]): during a network partition (machines up but unable to reach each other), keep accepting writes on both sides and reconcile later (AP: available over consistent; Dynamo, Cassandra, Riak), or refuse writes on the minority side to keep one true value (CP: consistent over available; etcd, DynamoDB's per-partition Paxos, TiKV). Even without a partition, quorum size trades latency for consistency.

```mermaid
flowchart LR
    W["Write for branch C"] --> C{"Branch C open?"}
    C -- "yes" --> S["Store at C"]
    C -- "no" --> N["Neighbour keeps a note<br/>(hinted handoff)"]
    N -- "C reopens" --> S
```

## Common beginner mistakes 🟢

- **Placing keys with `hash mod N`** → adding a node moves almost every key → use consistent hashing with virtual nodes.
- **Thinking `W + R > N` means always up to date** → sloppy quorums and failed writes can still return old data → use consensus (Raft) when you need one true value.
- **Using "last write wins" for a shopping cart** → one of two concurrent adds silently disappears → keep vector clocks and merge siblings.
- **Deleting a key by erasing it** → a replica that missed the delete brings it back → write a tombstone and run repair before it is purged.
- **Putting all 3 copies in one rack** → one power cut loses every copy → pick replicas from different racks or zones.

## 3. How it works - high-level design 🟡

> 🟢 → 🟡 **You now know** the plan: hash keys to machines, keep 3 copies, wait for "enough" answers, and repair later. **Next we open the box**: where each key lives, and how a write and a read move through the replicas when one of them is down.

**Step by step (plain):**
1. The app calls `put("cart:42", ...)`. The key is hashed to a spot on the ring.
2. The next 3 different machines clockwise, say A, B and C, are the key's copies.
3. Whichever node got the request (the coordinator) sends the write to A, B and C.
4. As soon as 2 of the 3 say "saved" (W = 2), the app gets "OK". If C is down, a stand-in keeps a note to pass on later.
5. A read asks 2 copies (R = 2). If they disagree, the coordinator returns the newer one and quietly fixes the stale copy.

```mermaid
flowchart TB
    C[Client library<br/>knows ring from gossip] -->|put k| CO[Coordinator node<br/>first healthy node in k's preference list]
    subgraph Ring["Token ring: 32 nodes x 256 vnodes"]
        CO
        R1[Replica 1]
        R2[Replica 2]
        R3[Replica 3]
        H[Healthy neighbour<br/>holds hints]
    end
    CO -->|write, wait for W=2 acks| R1
    CO --> R2
    CO -.->|R3 down| H
    H -.->|hinted handoff when R3 returns| R3
    subgraph Node["Inside one node"]
        CL[Commit log<br/>append + fsync] --> MT[Memtable<br/>sorted, in memory]
        MT -->|flush when 64 MB| SST[SSTables on disk<br/>+ Bloom filter + index]
        SST --> CMP[Compaction]
    end
    R1 --- Node
    G[Gossip: membership, ring,<br/>failure suspicion] --- Ring
    AE[Anti-entropy: Merkle trees<br/>per token range] --- Ring
```

**Placement.** Keys and nodes are hashed onto a ring ([[Consistent Hashing]]). The key's **preference list** is the next N distinct physical nodes clockwise, chosen from different racks or availability zones. Virtual nodes spread each node's load and its recovery traffic across the cluster.

**Write path (N=3, W=2) with one replica down.**

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant CO as Coordinator (node A)
    participant B as Replica B
    participant D as Replica D (down)
    participant E as Node E (next on ring)
    C->>CO: PUT cart:42 = [book, pen], context {A:1}
    CO->>CO: new clock {A:2}, append to commit log, memtable
    par to replicas
        CO->>B: replicate cart:42 {A:2}
        CO->>D: replicate cart:42 {A:2}
    end
    B-->>CO: ack
    Note over CO: own write + B = 2 acks, W satisfied
    CO-->>C: 200 OK, context {A:2}
    D--xCO: timeout (gossip marks D suspect)
    CO->>E: store hint for D: cart:42 {A:2}
    E-->>CO: ack
    Note over E,D: when D is back, E replays the hint, then deletes it
```

**Read path (R=2) with read repair.**

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant CO as Coordinator (node A)
    participant B as Replica B
    participant D as Replica D
    C->>CO: GET cart:42
    par ask R replicas (plus digest from the rest)
        CO->>B: read cart:42
        CO->>D: read cart:42
    end
    B-->>CO: [book, pen] {A:2}
    D-->>CO: [book] {A:1}
    CO->>CO: compare clocks: {A:1} is before {A:2}, drop stale
    CO-->>C: [book, pen], context {A:2}
    CO-)D: read repair: write [book, pen] {A:2}
```

## 4. Worked example - estimates, API and data model 🟡

### Whiteboard version

```text
Data:     10B keys × (1 KB value + ~100 B key and metadata) ≈ 11 TB
RF=3:     ≈ 33 TB  -> + 50% headroom for compaction ≈ 50 TB
Node:     4 TB NVMe, keep ≤ 2 TB used  -> ~25 nodes; round to 32
Traffic:  100k reads/s + 50k writes/s  -> per node ≈ 6.3k replica reads, 4.7k replica writes
Quorum:   N=3, W=2, R=2  (W+R > N)

PUT /v1/kv/{key}  body + X-Context: <opaque clock>
GET /v1/kv/{key}  -> value(s) + X-Context

[client] -> [coordinator] -> [N=3 replicas on ring]
[each node: commit log -> memtable -> SSTables]
[gossip] [hinted handoff] [read repair] [Merkle anti-entropy]
```

### Estimates (inputs are assumptions; results are estimates)

**In plain words:** rough sums: how much data, how many machines, and how many requests each one handles.

| Quantity | Arithmetic | Result |
| --- | --- | --- |
| Raw data | 10 × 10^9 keys × 1.1 KB | ≈ 11 TB |
| Replicated | 11 TB × 3 | ≈ 33 TB |
| With compaction headroom | 33 TB × 1.5 (size-tiered compaction, which merges similar-sized files into bigger ones, can temporarily need extra space) | ≈ 50 TB |
| Nodes by disk | 50 TB / 2 TB used per node | 25 nodes, round to 32 for even vnode spread and growth |
| Reads per node | 100,000 reads/s × R=2 / 32 nodes | ≈ 6,250 replica reads/s per node |
| Writes per node | 50,000 writes/s × N=3 / 32 nodes | ≈ 4,700 replica writes/s per node |
| Commit log bandwidth per node | 4,700/s × 1.1 KB | ≈ 5.2 MB/s, easy for NVMe |
| Re-replication after a node loss | 33 TB / 32 ≈ 1 TB on the lost node, re-copied by 31 peers | ≈ 33 GB per peer; at 50 MB/s throttled streaming per peer ≈ 11 minutes |

**What the numbers decide.** Disk, not CPU, sets the node count. Write rate per node is low enough for an LSM engine without special tuning.

The re-replication estimate is why virtual nodes matter.

Without them, the whole 1 TB would be streamed into one replacement node from the few ring neighbours that share its ranges, so the replacement's own intake becomes the bottleneck.

At the same 50 MB/s that is about 5.6 hours (1,000,000 MB / 50 MB/s = 20,000 s), during which those ranges run with one fewer replica.

### API

**In plain words:** just get, put and delete, plus a small "version" token passed back and forth.

```http
GET /v1/kv/cart:42?consistency=quorum

HTTP/1.1 200 OK
X-Context: eyJBIjoyfQ
Content-Type: application/json

{"values": [{"value": "[book, pen]"}]}
```

```http
PUT /v1/kv/cart:42
X-Context: eyJBIjoyfQ
Content-Type: application/octet-stream

[book, pen, cup]
```

- `X-Context` is an opaque (the client does not read it, only returns it), encoded vector clock. The client returns the context of the version it read, which tells the store which versions this write supersedes.
- When the read finds **concurrent** versions, `values` holds all siblings; the client merges them and writes back with the combined context.
- `consistency` can be `one`, `quorum` or `all` per request. `DELETE` writes a **tombstone** (a marker with a clock), never a physical delete, so replicas that missed the delete cannot resurrect the value.

### Key schema (one record on disk)

**In plain words:** what one stored entry looks like: the key, the value and a few small fields for version and expiry.

| Field | Size | Purpose |
| --- | --- | --- |
| `key` | up to 256 B | Partition key; its hash picks the ring position |
| `clock` | ~10-50 B | Vector clock `{node: counter}` (or a single timestamp under last-write-wins) |
| `tombstone` | 1 B | Marks a delete; purged after a grace period (Cassandra's `gc_grace_seconds` defaults to 10 days) |
| `expires_at` | 8 B | Optional TTL |
| `value` | up to 100 KB | Opaque bytes |

### Code: vector clocks and sibling reconciliation

**In plain words:** each value carries a small version stamp. The code compares stamps to tell "newer" from "written at the same time", and keeps both copies in the second case.

The coordinator and the client both need one operation: given several versions, drop those that another version dominates and return the rest. The test replays the classic shopping-cart case from the Dynamo paper.

```go
// Package kv shows how a Dynamo-style store decides which versions of a key
// are stale and which are concurrent siblings that the client must merge.
package kv

// VClock maps a replica (node) ID to the number of writes it coordinated.
type VClock map[string]uint64

// Order is the causal relation between two clocks.
type Order int

const (
	Equal      Order = iota
	Before           // a happened before b: a is stale
	After            // a happened after b: b is stale
	Concurrent       // neither saw the other: keep both as siblings
)

// Compare returns how a relates to b.
func Compare(a, b VClock) Order {
	aBigger, bBigger := false, false
	for node, av := range a {
		if bv := b[node]; av > bv {
			aBigger = true
		} else if av < bv {
			bBigger = true
		}
	}
	for node, bv := range b {
		if _, ok := a[node]; !ok && bv > 0 {
			bBigger = true
		}
	}
	switch {
	case aBigger && bBigger:
		return Concurrent
	case aBigger:
		return After
	case bBigger:
		return Before
	default:
		return Equal
	}
}

// Merge returns the element-wise maximum, used after a client resolves siblings.
func Merge(a, b VClock) VClock {
	out := VClock{}
	for n, v := range a {
		out[n] = v
	}
	for n, v := range b {
		if v > out[n] {
			out[n] = v
		}
	}
	return out
}

// Version is one stored value with its clock.
type Version struct {
	Value string
	Clock VClock
}

// Reconcile drops every version that another version dominates and returns the
// survivors. One survivor means the read is clean; more than one are siblings.
func Reconcile(vs []Version) []Version {
	var out []Version
	for i, v := range vs {
		dominated := false
		for j, w := range vs {
			if i == j {
				continue
			}
			o := Compare(v.Clock, w.Clock)
			if o == Before || (o == Equal && j < i) { // drop stale and exact duplicates
				dominated = true
				break
			}
		}
		if !dominated {
			out = append(out, v)
		}
	}
	return out
}

// QuorumOverlaps reports whether every read quorum must meet every write quorum.
func QuorumOverlaps(n, w, r int) bool { return w+r > n }
```

```go
package kv

import "testing"

func TestCompare(t *testing.T) {
	cases := []struct {
		a, b VClock
		want Order
	}{
		{VClock{"A": 1}, VClock{"A": 1}, Equal},
		{VClock{"A": 1}, VClock{"A": 2}, Before},
		{VClock{"A": 2, "B": 1}, VClock{"A": 1}, After},
		{VClock{"A": 2}, VClock{"A": 1, "B": 1}, Concurrent},
		{VClock{}, VClock{"C": 1}, Before},
	}
	for i, c := range cases {
		if got := Compare(c.a, c.b); got != c.want {
			t.Fatalf("case %d: got %v want %v", i, got, c.want)
		}
	}
}

// The cart example: two clients write through different coordinators after
// both read version {A:1}.
func TestReconcileKeepsSiblingsAndDropsStale(t *testing.T) {
	base := Version{"[book]", VClock{"A": 1}}
	viaB := Version{"[book, pen]", VClock{"A": 1, "B": 1}}
	viaC := Version{"[book, cup]", VClock{"A": 1, "C": 1}}
	got := Reconcile([]Version{base, viaB, viaC, viaB})
	if len(got) != 2 {
		t.Fatalf("want 2 siblings, got %v", got)
	}
	// Client merges the siblings and writes back via A.
	m := Merge(viaB.Clock, viaC.Clock)
	m["A"]++
	merged := Version{"[book, pen, cup]", m}
	got = Reconcile([]Version{viaB, merged, viaC})
	if len(got) != 1 || got[0].Value != "[book, pen, cup]" {
		t.Fatalf("merged write should dominate, got %v", got)
	}
}

func TestQuorumOverlaps(t *testing.T) {
	if !QuorumOverlaps(3, 2, 2) || QuorumOverlaps(3, 1, 1) || !QuorumOverlaps(3, 3, 1) {
		t.Fatal("quorum rule wrong")
	}
}
```

`go vet` and `go test -race` pass on Go 1.24.4 in a scratch module.

### One request traced

1. Alice's phone and laptop both read `cart:42 = [book]` with context `{A:1}`.
2. The phone adds a pen; its write lands on coordinator B (A is slow), giving `{A:1, B:1}`. The laptop adds a cup through coordinator C, giving `{A:1, C:1}`. Each write gets W=2 acks.
3. Alice opens the cart. The coordinator reads R=2 replicas and gets both versions. `Compare` says **Concurrent**, so the response carries two siblings.
4. The client merges them (set union: `[book, pen, cup]`) and writes back with the merged context `{A:1, B:1, C:1}`; coordinator A bumps it to `{A:2, B:1, C:1}`, which dominates both siblings. Later reads return one value.
5. With last-write-wins instead, the later timestamp would win and either the pen or the cup would silently disappear. That is the whole argument for vector clocks in a cart.

## 5. Variants and comparison 🟡

| Design | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Leaderless, vector clocks (Dynamo paper, Riak) | Any replica accepts writes; siblings returned to the client | Writes must always succeed and the app can merge (carts, CRDT counters) | Clients must merge; clocks grow and need pruning |
| Leaderless, last-write-wins (Cassandra) | Each cell carries a client or coordinator timestamp; highest wins | Overwrites of whole values where losing a concurrent write is acceptable | Silent lost updates under concurrency; clock skew decides winners |
| Leader per partition, Raft or Paxos (etcd, TiKV, DynamoDB per partition) | One leader orders writes; a majority must persist each write | You need linearizable reads (every read sees the latest finished write) and compare-and-set | Minority side unavailable during partitions; leader elections pause writes for a short time |
| Single-node in-memory (Redis) with async replicas | One primary, replicas copy asynchronously | Caches and data that fits one machine's RAM | Failover can lose acknowledged writes; scale by sharding (Redis Cluster) |

**Quorum settings (N=3):**

| W | R | Behaviour |
| --- | --- | --- |
| 2 | 2 | Read-your-quorum-writes when no sloppy quorum is used; survives one slow or down replica for both reads and writes |
| 3 | 1 | Fast reads, but a single down replica blocks writes |
| 1 | 1 | Fastest and most available; reads may be stale (eventual consistency) |
| 1 | 3 | Fast writes; reads block if any replica is down |

### Things people confuse this with 🟡

| System | What it is | How it differs from this key-value store |
| --- | --- | --- |
| [[Case Study - Distributed Cache]] | Memory-only copies of data that also lives elsewhere | It may forget anything; this store is the durable source of truth |
| Relational database | Tables, joins, transactions | Supports queries across rows; a KV store only does get and put by key |
| etcd / ZooKeeper | Small, strongly consistent key-value stores for config and locks | Refuse writes without a majority; hold gigabytes, not terabytes |

## 6. Trade-offs and when not to use 🟡

- **Leaderless over leader-based because** the requirement is "never reject a write". The price is conflict handling: siblings, read repair and anti-entropy. If the requirement is "never lose a concurrent update to a bank balance", pick a leader-based CP design instead (or no KV store at all).
- **Sloppy quorum plus hinted handoff over strict quorum because** it keeps writes available when the preference list is unhealthy. The price: `W + R > N` no longer guarantees overlap, because W acks may come from stand-in nodes outside the preference list.
- **LSM over B-tree because** writes are frequent and sequential appends are cheap; the price is read and space amplification (a read may check several files, and old copies take disk until merged), controlled by Bloom filters and compaction ([[Storage Engines - B-tree vs LSM and WAL]]).
- **When not to build one:** if data fits on one PostgreSQL 17 or Redis primary with a replica, use that. If you need range scans, secondary indexes or transactions, a KV store is the wrong tool; use a relational or [[Distributed SQL]] database. Managed services (DynamoDB, Cassandra-compatible clouds) usually beat running your own cluster.

```mermaid
flowchart TD
    Q{"Fits on one database<br/>with a replica?"} -- "yes" --> P["Use PostgreSQL or Redis"]
    Q -- "no" --> R{"Must never reject a write?"}
    R -- "yes" --> L["Leaderless store (this note)"]
    R -- "no" --> LB["Leader-based store"]
```

## 7. In production 🔴

> 🟡 → 🔴 **You now know** the ring, quorums, the read and write paths, the API and the vector-clock code. **Next is the advanced part**: real systems, failures such as zombie data and clock skew, the three ways copies heal, adding nodes, and what quorums do not promise.

- **Well-documented real systems:**
	- *Amazon Dynamo (2007 paper):* consistent hashing with virtual nodes, N/R/W quorums with a common configuration of (3, 2, 2), vector clocks with client-side reconciliation for the shopping cart, sloppy quorum and hinted handoff, Merkle trees for anti-entropy, gossip-based membership.
	- *Apache Cassandra:* Dynamo-style partitioning and replication with Bigtable-style storage (commit log, memtable: the in-memory table of recent writes, SSTables: sorted files on disk); per-request consistency levels (`ONE`, `QUORUM`, `LOCAL_QUORUM`, `ALL`); last-write-wins per cell; hinted handoff limited by `max_hint_window` (3 hours by default); `nodetool repair` for Merkle-tree anti-entropy.
	- *Amazon DynamoDB (2022 paper):* despite the name, not leaderless. Each partition is replicated across three availability zones and uses Multi-Paxos (a consensus protocol, like Raft) with a leader; strongly consistent reads go to the leader.
	- *etcd:* Raft-replicated, linearizable KV for small, critical data (Kubernetes state); its default storage quota is 2 GB with 8 GB as the suggested maximum, which shows this design is for metadata, not 10 TB.
- **Failure modes → fixes:**
	- *Node down for minutes* → hinted handoff replays on return. *Down for longer than the hint window* → hints are dropped; run repair (anti-entropy) on that node before trusting it.
	- *Deleted data comes back ("zombie" data)* → a replica missed the tombstone and the tombstone was purged before repair ran. Run repair more often than the tombstone grace period.
	- *Hot partition* → one key or token range gets most traffic; see [[Hot Keys and Hot Partitions]].
	- *Clock skew under last-write-wins* → a node with a fast clock wins every conflict. Run NTP (the network time protocol that keeps clocks in sync) with monitoring, or use vector clocks or a CRDT ([[CRDTs and Conflict Resolution]]).
	- *Compaction falling behind* → read latency rises with SSTable count, disk fills. Alert on pending compactions, keep disk below about 50% for size-tiered compaction.
- **SLOs and monitoring (targets):** p99 read and write latency per consistency level; unavailable-quorum error rate; hints pending; repair age per token range; SSTables per read; pending compactions; disk usage per node; gossip "down" events.

## 8. Deep dive 🔴

### 8.1 Healing: hints, read repair and Merkle trees

**In plain words:** three ways to fix copies that disagree: leave a note for a down machine, fix on read, and compare in the background.

Three mechanisms cover different time scales.
1. **Hinted handoff (seconds to hours).** A stand-in node stores writes meant for a down replica and replays them when gossip reports it up again. It is fast but bounded by the hint window and lost if the stand-in dies.
2. **Read repair (on access).** When a read sees replicas disagree, the coordinator writes the winner back to stale replicas. It only fixes keys someone reads.
3. **Anti-entropy with Merkle trees (background).** Each replica builds a hash tree over a token range (a slice of the ring): leaves hash small key ranges, parents hash children.
   - Two replicas compare roots; if they match, the range is identical. Otherwise they descend only into differing branches.
   - For a range of 1 billion keys split into 2^15 leaves, a single differing key costs about 15 levels of hash comparisons plus streaming one leaf, instead of comparing a billion keys.
   - This is the only mechanism that fixes cold, never-read keys.

```mermaid
flowchart LR
    H["Hinted handoff"] --> T1["minutes"]
    RR["Read repair"] --> T2["on each read"]
    M["Merkle tree compare"] --> T3["hours / nightly"]
```

```mermaid
flowchart TD
    R["root hash differs?"] -- "no" --> SAME["range identical: stop"]
    R -- "yes" --> L["compare left and right child"]
    L --> D["descend only into the differing child"]
    D --> LEAF["reach one leaf: stream those keys"]
```

### 8.2 Adding a node without downtime

**In plain words:** a new machine takes over small slices of keys from its neighbours, a bit at a time.

A new node takes 256 virtual-node tokens. For each token it becomes the owner of a slice previously owned by its clockwise neighbour, so it streams that slice from the current replicas while they keep serving.

During streaming, writes for those ranges go to both old and new owners ("pending ranges"), so nothing is missed. When streaming completes, the ring update is gossiped and old owners clean up the ranges they no longer own.

Because vnodes are spread around the ring, all 32 existing nodes contribute about 1/33 of their data each, instead of one neighbour giving up half of its data.

### 8.3 What quorums do not give you

**In plain words:** "2 of 3 agree" sounds strong, but some edge cases can still return old data.

`W + R > N` is often quoted as "strong consistency". It is weaker:
- With **sloppy quorums**, the W acks may come from stand-ins, so a later read quorum may not overlap.
- A write that **failed** (fewer than W acks) may still be present on some replicas and appear in later reads.
- Two concurrent writes with last-write-wins both "succeed" and one silently vanishes.
- Quorum reads are not linearizable unless read repair finishes before the response: one reader can see a new value that reached only one replica, and a later reader can still get the old value from two others.

For compare-and-set or "exactly one owner" semantics, use consensus ([[Consensus - Raft and Paxos]]), as etcd and DynamoDB's conditional writes do.

## 9. Interview questions 🔴

> [!question]- Why N=3, W=2, R=2?
> Three replicas survive one failure with room for a second; W=2 and R=2 overlap in at least one replica (2 + 2 > 3), and both reads and writes still succeed with one replica down. It is the common default from the Dynamo paper and Cassandra's `QUORUM`.

> [!question]- Trap: "W + R > N, so this store is strongly consistent."
> Not in a Dynamo-style store. Sloppy quorums let W acks come from nodes outside the preference list, failed writes can linger on some replicas, and last-write-wins drops concurrent updates. You get linearizability only with consensus per key or partition.

> [!question]- Vector clocks or last-write-wins?
> Vector clocks when concurrent updates must not be lost and the client can merge them (carts, sets). Last-write-wins when values are replaced whole and losing a concurrent write is acceptable; it is simpler and needs no client merging, but depends on synchronized clocks.

> [!question]- A node was down for a day. What do you do when it returns?
> Hints only cover the hint window (3 hours by default in Cassandra), so it missed writes. Run anti-entropy repair on its ranges before serving reads at consistency `ONE`, or keep it out of the read path until repair finishes.

> [!question]- Why do deletes need tombstones?
> If a replica missed the delete and the others physically removed the key, read repair or anti-entropy would copy the old value back. A tombstone is a versioned "deleted" value that wins reconciliation; it can be purged only after every replica has seen it.

> [!question]- How does a node find a key on disk quickly in an LSM tree?
> Check the memtable, then SSTables from newest to oldest; each SSTable's Bloom filter skips files that cannot contain the key, and a sparse index gives the block offset. Compaction keeps the number of SSTables per read small.

> [!question]- How is this different from DynamoDB?
> The Dynamo paper describes a leaderless store with vector clocks. The DynamoDB service uses leader-based Multi-Paxos replication per partition across three availability zones, which is why it can offer strongly consistent reads and conditional writes.

## Self-check 🟢🟡

> [!question]- Easy: what does a quorum of 2 of 3 mean?
> A read or write counts once 2 of the key's 3 copies have answered.

> [!question]- Easy: why keep 3 copies of each key?
> So losing any one machine loses no acknowledged data.

> [!question]- Easy: what is a tombstone?
> A marker that says "this key was deleted", kept for a while so other copies learn about the delete.

> [!question]- Medium: phone writes `{A:1, B:1}` and laptop writes `{A:1, C:1}`. Which wins?
> Neither dominates, so they are concurrent; both are returned as siblings for the client to merge.

> [!question]- Medium: 10 billion keys × 1.1 KB, 3 copies. Roughly how much disk?
> About 11 TB raw, 33 TB with 3 copies, about 50 TB with compaction headroom.

> [!question]- Medium: which healing method fixes keys nobody reads?
> Anti-entropy with Merkle trees, run in the background.

## 10. Cheat sheet 🟢

A 45-minute interview script:
- **0-5 min, requirements:** get, put, delete, TTL; 10B keys, 1 KB values; 100k reads/s, 50k writes/s; always writable; p99 under 10 ms; ask "AP or CP?".
- **5-10 min, estimates:** 11 TB raw, 33 TB at RF=3, about 50 TB with headroom, 32 nodes; per-node load is modest; re-replication time drives the vnode choice.
- **10-15 min, API and data model:** `GET` and `PUT` with an opaque context; record = key, clock, tombstone, TTL, value.
- **15-25 min, high-level design:** consistent hashing with vnodes, preference list across zones, coordinator, N/W/R quorums, LSM storage, gossip.
- **25-40 min, deep dives:** conflict resolution (vector clocks vs last-write-wins, the cart example); healing (hints, read repair, Merkle trees); adding nodes; what quorums do not guarantee.
- **40-45 min, wrap-up:** monitoring (hints, repair age, compactions), tombstone and zombie data, multi-region with `LOCAL_QUORUM`, and when to choose a CP design instead.

## Links

- **Before this:** [[Consistent Hashing]], [[Replication]], [[Quorums and Leaderless Replication]], [[Partitioning and Sharding]], [[Storage Engines - B-tree vs LSM and WAL]]
- **Next:** [[Case Study - Search Autocomplete]], [[Case Study - Distributed Message Queue]], [[Multi-Region Architecture]]
- **Compare with:** [[In-memory KV Store with TTL and Transactions]] (the class-level LLD twin), [[Wide-Column Stores and Cassandra]], [[Consensus - Raft and Paxos]], [[CRDTs and Conflict Resolution]], [[Failure Detection, Gossip and Membership]], [[Bloom Filters and Probabilistic Data Structures]]

### Watch on YouTube

- [How Key value Stores Work (Redis, DynamoDB, Memcached)?](https://www.youtube.com/watch?v=Dwt8R0KPu7k) · ByteByteGo · 6 min · 60,020 views
- [Design a Key-Value Store - System Design Mock Interview (with Microsoft Software Engineer)](https://www.youtube.com/watch?v=6fOoXT1HYxk) · Aced (formerly Exponent) · 36 min · 97,938 views
