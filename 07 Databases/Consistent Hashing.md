---
tags: [databases, distributed-systems, partitioning]
level: intermediate
status: reviewed
prereqs: ["[[Hash Tables and Go Maps]]", "[[Partitioning and Sharding]]"]
related: ["[[Replication]]", "[[Quorums and Leaderless Replication]]", "[[Hot Keys and Hot Partitions]]", "[[Load Balancing]]", "[[Redis Replication, Sentinel and Cluster]]"]
sources:
  - "Karger et al., Consistent Hashing and Random Trees (STOC 1997)"
  - "DeCandia et al., Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)"
  - "Lamping & Veach, A Fast, Minimal Memory, Consistent Hash Algorithm (Google, 2014)"
  - "Mirrokni, Thorup & Zadimoghaddam, Consistent Hashing with Bounded Loads (Google, 2016)"
  - "Eisenbud et al., Maglev: A Fast and Reliable Software Network Load Balancer (NSDI 2016)"
  - "Redis Cluster specification (hash slots)"
updated: 2026-11-01
---

# Consistent Hashing

> [!summary] TL;DR
> A way to spread keys across servers so that adding or removing one server moves only about `1/N` of the keys, instead of almost all of them. Servers and keys are hashed onto the same circle; each key belongs to the first server clockwise from it.

> [!abstract] Core idea
> - Servers and keys are hashed onto the same circle; a key belongs to the first server clockwise from it.
> - Adding or removing a server moves only the keys on one arc, about `1/N` of them.
> - Virtual nodes (many points per server) even out the load and spread a failed server's keys across all the others.
> - Classic mistake: thinking it fixes hot keys. One very popular key still lands on one server.

## 1. Why it exists

You have 4 cache servers and pick one per key with `server = hash(key) % 4`. Traffic grows, you add a 5th server, and the formula becomes `hash(key) % 5`.

A key stays on its server only if `hash % 4 == hash % 5`, which holds for about 1 key in 5. **Measured on 100,000 keys: 80.0% of keys changed server.** For a cache, that means 80% misses at once and a stampede on the database. For a database, it means moving 80% of your data to add one machine.

Consistent hashing makes the same change move only the new server's fair share: about 20%.

## 2. Mental model

Picture a clock face numbered from `0` to `2^64 − 1`.

- Hash each **server** name to a position on the clock.
- Hash each **key** to a position on the same clock.
- Walk **clockwise** from the key. The first server you meet owns the key.

Adding a server only steals keys from the arc just behind it. Every other key keeps its owner.

## 3. How it works

A ring is just a **sorted array of positions** that wraps around at the end:

```mermaid
flowchart LR
    subgraph ring["Toy ring 0–255: each key goes to the first node at or after its position"]
        direction LR
        A["A @ 10"] --> B["B @ 90"] --> C["C @ 170"] --> D["D @ 250"]
        D -- "wraps past 255 to 0" --> A
    end
    k1(["user:42 @ 37"]) -.-> B
    k2(["cart:7 @ 200"]) -.-> D
    k3(["order:9 @ 252"]) -.-> A
```

`order:9` sits at 252. No node exists at or after 252, so the lookup wraps to the start and lands on A.

**Lookup in code:**

```mermaid
flowchart LR
    K[key] --> H["h = hash(key)"] --> S["binary search the sorted points:<br/>first point >= h"] --> W{past the end?}
    W -- yes --> Z["use points[0]"] --> O["owner[point] = node"]
    W -- no --> O
```

Cost: `O(log P)` per lookup, where `P` is the number of points on the ring.

**Adding a node.** Put E at position 130. Only keys between B (90) and E (130) change owner, and they all move from C to E:

| Key (toy position) | Owner with A, B, C, D | Owner after adding E @ 130 |
| ------------------ | --------------------- | -------------------------- |
| user:42 (37)       | B                     | B                          |
| item:3 (100)       | C                     | **E** (moved)              |
| sku:5 (150)        | C                     | C                          |
| cart:7 (200)       | D                     | D                          |
| order:9 (252)      | A                     | A                          |

**Removing a node** is the reverse: its arc goes to its clockwise successor.

### Virtual nodes

With one point per server, arcs come out uneven (one server can own half the ring by luck), and when a server dies its whole arc lands on a single neighbour. The fix is to give each server many points, called **virtual nodes** (vnodes): `A#0, A#1, …, A#199`.

```mermaid
flowchart LR
    a0["A#0"] --> b0["B#0"] --> c0["C#0"] --> a1["A#1"] --> c1["C#1"] --> b1["B#1"] --> a2["A#2"] --> b2["B#2"] --> c2["C#2"]
    c2 -. wraps .-> a0
    classDef A fill:#fde68a,stroke:#b45309,color:#000
    classDef B fill:#bfdbfe,stroke:#1d4ed8,color:#000
    classDef C fill:#bbf7d0,stroke:#15803d,color:#000
    class a0,a1,a2 A
    class b0,b1,b2 B
    class c0,c1,c2 C
```

If B dies, its three arcs pass to three successors (C#0, A#2 and C#2), so its load is shared by A and C instead of dumped on one server. A server with twice the capacity simply gets twice as many vnodes.

## 4. Worked example

### Whiteboard version

The bare idea: a sorted slice of positions and a binary search. It assumes at least one server was added.

```go
package wb

import (
	"hash/crc32"
	"slices"
)

type Ring struct {
	points []uint32          // sorted positions on the circle
	node   map[uint32]string // position -> server
}

func (r *Ring) Add(server string) {
	p := crc32.ChecksumIEEE([]byte(server))
	r.node[p] = server
	r.points = append(r.points, p)
	slices.Sort(r.points)
}

// Get returns the first server clockwise from the key's position.
func (r *Ring) Get(key string) string {
	h := crc32.ChecksumIEEE([]byte(key))
	i, _ := slices.BinarySearch(r.points, h)
	if i == len(r.points) {
		i = 0 // wrap around the circle
	}
	return r.node[r.points[i]]
}
```

The full version below adds production concerns: virtual nodes, removal, collision handling, replica lookup, locking, and tests.


A Go ring with virtual nodes and replica lookup. It compiles and passes `go vet` and `go test -race` on Go 1.24.

```go
package ring

import (
	"crypto/sha256"
	"encoding/binary"
	"slices"
	"strconv"
	"sync"
)

// Ring maps keys to nodes using consistent hashing with virtual nodes.
type Ring struct {
	mu     sync.RWMutex
	vnodes int               // virtual nodes per physical node
	points []uint64          // sorted vnode positions on the ring
	owner  map[uint64]string // vnode position -> physical node
}

func New(vnodes int) *Ring {
	return &Ring{vnodes: vnodes, owner: make(map[uint64]string)}
}

// position places a string on the ring (0 .. 2^64-1).
// SHA-256 is slow but spreads similar strings evenly; see "Deep dive".
func position(s string) uint64 {
	sum := sha256.Sum256([]byte(s))
	return binary.BigEndian.Uint64(sum[:8])
}

func (r *Ring) Add(node string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for i := 0; i < r.vnodes; i++ {
		p := position(node + "#" + strconv.Itoa(i))
		if _, taken := r.owner[p]; taken {
			continue // 64-bit collision: practically never happens
		}
		r.owner[p] = node
		r.points = append(r.points, p)
	}
	slices.Sort(r.points)
}

func (r *Ring) Remove(node string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.points = slices.DeleteFunc(r.points, func(p uint64) bool {
		if r.owner[p] != node {
			return false
		}
		delete(r.owner, p)
		return true
	})
}

// Get returns the owner of key: the first vnode clockwise from position(key).
func (r *Ring) Get(key string) (string, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if len(r.points) == 0 {
		return "", false
	}
	i, _ := slices.BinarySearch(r.points, position(key)) // first point >= hash
	if i == len(r.points) {
		i = 0 // past the last point: wrap around
	}
	return r.owner[r.points[i]], true
}

// GetN returns up to n distinct physical nodes clockwise from key.
// Dynamo-style stores call this the "preference list" and replicate to it.
func (r *Ring) GetN(key string, n int) []string {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var out []string
	seen := make(map[string]bool)
	start, _ := slices.BinarySearch(r.points, position(key))
	for i := 0; i < len(r.points) && len(out) < n; i++ {
		node := r.owner[r.points[(start+i)%len(r.points)]]
		if !seen[node] {
			seen[node] = true
			out = append(out, node)
		}
	}
	return out
}
```

The test that proves the core promise: when a node joins, keys only ever move **to** the new node, and only about `1/N` of them.

```go
func TestAddingNodeOnlyMovesKeysToIt(t *testing.T) {
	r := New(200)
	for _, n := range []string{"a", "b", "c", "d"} {
		r.Add(n)
	}
	before := map[string]string{}
	for i := 0; i < 10_000; i++ {
		k := "user:" + strconv.Itoa(i)
		before[k], _ = r.Get(k)
	}

	r.Add("e")

	moved := 0
	for k, old := range before {
		now, _ := r.Get(k)
		if now == old {
			continue
		}
		if now != "e" {
			t.Fatalf("%s moved %s -> %s; only the new node may gain keys", k, old, now)
		}
		moved++
	}
	if moved < 1_500 || moved > 2_500 { // ideal is 1/5 = 2000
		t.Fatalf("moved %d of 10000 keys, want about 2000", moved)
	}
}
```

**Measured:** 100,000 keys `user:0 … user:99999`, growing from 4 nodes to 5 (Go 1.24, 2026-11-01).

| Scheme                | Vnodes per node | Keys moved (ideal 20%) | Busiest node vs average |
| --------------------- | --------------- | ---------------------- | ----------------------- |
| `hash % N`            | n/a             | 80.0%                  | n/a                     |
| Ring, CRC32           | 1               | 0.4%                   | 4.90×                   |
| Ring, CRC32           | 200             | 20.3%                  | 1.17×                   |
| Ring, FNV-1a 64       | 200             | 11.6%                  | 1.40×                   |
| Ring, SHA-256         | 1               | 20.6%                  | 1.36×                   |
| Ring, SHA-256         | 100             | 18.7%                  | 1.11×                   |
| Ring, SHA-256         | 200             | 19.2%                  | 1.03×                   |

Two lessons: vnodes even out the load, and the **hash function matters**. CRC32 with one point per node handed one server 97,950 of the 100,000 keys.

## 5. Variants and comparison

| Scheme                          | How it works                                                                     | Use when                                                                                   | Cost                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Ring + vnodes                   | Sorted points, first point clockwise                                             | General default: caches, Dynamo-style stores, sticky load balancing                        | `O(log P)` lookup, memory for `P` points                                |
| Rendezvous (HRW) hashing        | Score every node with `hash(node, key)`, pick the highest                        | Small node counts; you want no ring and perfect minimal movement                           | `O(N)` per lookup                                                       |
| Jump consistent hash            | A short loop maps a key to a bucket number `0..N-1`                              | Numbered shards that only grow or shrink at the end                                         | Cannot remove an arbitrary node from the middle                          |
| Maglev hashing                  | Precomputed lookup table built from per-node preference orders                   | Network load balancers needing `O(1)` lookups and very even spread                          | Table rebuild on change; a few extra keys move                           |
| Bounded loads                   | Ring, but a node above `(1 + ε) ×` average load passes the key clockwise         | Load balancing where key popularity is skewed                                              | More keys move as load shifts                                            |
| Fixed hash slots (Redis Cluster) | `CRC16(key) mod 16384` picks a slot; slots are assigned to nodes and moved explicitly | You want operators to control exactly which data moves                                      | A slot-to-node map that every client must keep current                   |

> [!warning] Interview trap
> Redis Cluster does **not** use consistent hashing. It uses 16,384 fixed hash slots. Use hash tags such as `{user:42}:cart` to keep related keys in one slot.

## 6. Trade-offs and when not to use

- It balances **keys, not traffic**. One viral key still lands on one node.
- Membership must be agreed on. Two clients with different views of the ring send the same key to different nodes.
- Range queries suffer: hashing scatters neighbouring keys, so `WHERE id BETWEEN …` hits every node. Use range partitioning when range scans dominate.
- With a fixed, rarely changing set of shards, plain `hash % N` or jump hash is simpler and just as good.

## 7. In production

- **Real systems:**
	- Akamai's CDN (the 1997 paper's original use case).
	- The Dynamo paper, and Cassandra and Riak after it. Cassandra's `num_tokens` is its vnode count: 256 by default before 4.0, 16 since.
	- Memcached client libraries using ketama.
	- Nginx `hash $request_uri consistent;`, HAProxy `hash-type consistent`, Envoy's `RING_HASH` and `MAGLEV` load-balancing policies.
- **Failure modes → fixes:**
	- Hot key overloads one node → split the key (`counter:{0..9}`), cache it locally, or serve reads from replicas.
	- Cascading failure when a node dies and one neighbour takes all its load → use vnodes so the load spreads.
	- Clients disagree about the ring → keep membership in gossip (Cassandra) or a coordinator (ZooKeeper or etcd), and version the ring.
	- Rebalancing saturates the network → throttle data streaming and add nodes one at a time.
- **What to monitor:**
	- Keys and requests per node, and the max/average ratio.
	- p99 latency per node.
	- Bytes streamed during rebalancing.
	- Cache hit rate before and after membership changes.

## 8. Deep dive

- **How many vnodes?** Each node's share is a sum of `V` random arcs, so its load varies by roughly `1/√V`: 100 vnodes gives about ±10%. More vnodes means smoother load, but more metadata and more overlap between nodes' replicas. With 256 vnodes, almost any two failed nodes share some ranges. That is part of why Cassandra 4.0 lowered its default to 16 and added a token-allocation algorithm that keeps load even with few tokens.
- **Hash quality.** Ring position is decided mostly by the high bits of the hash. CRC32 is a linear checksum, and FNV-1a mixes the last bytes of its input poorly into its high bits. So similar inputs (`cache-a#1`, `cache-a#2`, `user:41`, `user:42`) can land in clumps. Use a well-mixed hash: SHA-256 or MD5 (ketama uses MD5) for simplicity, xxHash or Murmur3 for speed. Then measure with your own keys.
- **Replication.** Store each key on the first `R` distinct physical nodes clockwise (`GetN` above), skipping extra vnodes of a node already chosen. Combine with quorum reads and writes (`R + W > N`, see [[Quorums and Leaderless Replication]]) for tunable consistency.
- **Bounded loads.** Give every node a capacity of `⌈(1 + ε) × average⌉`. A key whose node is full walks clockwise to the next node with room. Vimeo shipped this in HAProxy and cut cache bandwidth sharply.
- **Weighted nodes.** Give a node vnodes in proportion to its capacity. For rendezvous hashing, use the weighted form: pick the node with the highest `-w / ln(hash01(node, key))`.

## 9. Interview questions

> [!question]- Why not just use `hash(key) % N`?
> Changing N remaps about `N/(N+1)` of all keys (80% when going from 4 to 5 nodes). For a cache that means a miss storm. For a database it means moving almost all the data. A ring moves about `1/(N+1)`.

> [!question]- What do virtual nodes solve, and what do they cost?
> They even out arc sizes, spread a dead node's load across many survivors, and let you weight servers by capacity. The costs are more memory and metadata, slower ring rebuilds, and more small ranges to stream during rebalancing.

> [!question]- Does consistent hashing fix hot keys?
> No. It balances the number of keys, not the traffic per key. Fix hot keys separately: split the key, cache it on the client or an L1 cache, read from replicas, or use bounded-load hashing.

> [!question]- A node dies. Where does its data go, and how do clients find out?
> Its arcs belong to their clockwise successors. With replication those successors already hold copies, so reads keep working and repair restores the replica count. Clients learn the new membership through gossip or a coordinator (etcd or ZooKeeper) and refresh their ring.

> [!question]- How does Redis Cluster decide which node holds a key?
> `CRC16(key) mod 16384` gives a hash slot, and each node owns a set of slots. Resharding moves whole slots, and clients follow `MOVED` and `ASK` redirects. It is not a hash ring.

> [!question]- Ring, rendezvous, or jump hash: which would you pick?
> Pick the ring with vnodes as the general default. Pick rendezvous when there are few nodes and you want simple code without a ring. Pick jump hash for numbered shards that only grow or shrink at the end, with no memory overhead.

## 10. Cheat sheet

- `hash % N` remaps ~`N/(N+1)` of keys on resize; a ring remaps ~`1/(N+1)`.
- Ring = sorted array of points, binary search, wrap to index 0.
- Vnodes (100–256 per node) smooth the load and spread failover; more vnodes means more weight.
- Use a well-mixed hash (SHA, MD5, xxHash, Murmur3) and measure. FNV and CRC32 clump on similar keys.
- Replicate to the next `R` distinct physical nodes clockwise.
- It balances keys, not traffic: hot keys need their own fix.
- Redis Cluster uses 16,384 hash slots, not a ring.

## Links

- **Before this:** [[Hash Tables and Go Maps]], [[Partitioning and Sharding]]
- **Next:** [[Replication]], [[Quorums and Leaderless Replication]], [[Hot Keys and Hot Partitions]]
- **Compare with:** [[Load Balancing]] (consistent hashing as a sticky load-balancing policy), [[Redis Replication, Sentinel and Cluster]] (hash slots instead of a ring)
- **Code to read:** `github.com/golang/groupcache/consistenthash` (about 80 lines), `github.com/buraksezer/consistent` (bounded loads)
