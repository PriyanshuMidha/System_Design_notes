---
tags: [distributed-systems, locks, fencing, redis, etcd, zookeeper]
level: advanced
status: reviewed
prereqs: ["[[Leader Election]]", "[[Consensus - Raft and Paxos]]", "[[Locking - Optimistic vs Pessimistic]]"]
related: ["[[Clocks and Ordering]]", "[[Idempotency and Idempotency Keys]]", "[[Redis Use Cases]]", "[[Redis Replication, Sentinel and Cluster]]", "[[Scheduled Jobs - Cron to Durable Schedulers]]", "[[Transactions and ACID]]", "[[Delivery Semantics and Exactly-Once]]"]
sources:
  - "Kleppmann, How to do distributed locking (blog, February 2016): efficiency vs correctness locks, fencing tokens, critique of Redlock"
  - "Sanfilippo (antirez), Is Redlock safe? (blog, February 2016)"
  - "Redis docs, SET command (NX, PX options) and Distributed Locks with Redis (Redlock algorithm, Lua release script)"
  - "Redisson docs, lockWatchdogTimeout (default 30 s)"
  - "Burrows, The Chubby lock service for loosely-coupled distributed systems (OSDI 2006): sequencers"
  - "etcd Go client docs, go.etcd.io/etcd/client/v3/concurrency: Mutex, Session; etcd API docs, revisions"
  - "ZooKeeper Recipes and Solutions, Locks (ephemeral sequential znodes, watch predecessor)"
  - "PostgreSQL 17 docs, Advisory Locks and SELECT ... FOR UPDATE SKIP LOCKED"
updated: 2026-11-04
---

# Distributed Locks and Fencing Tokens

> [!summary] TL;DR
> A **distributed lock** lets only one of many processes, on different machines, work on a shared thing at a time. Because a lock holder can pause or lose its network and its lock can expire without it knowing, a lock alone is not enough for correctness: the protected resource must also check a **fencing token**, an increasing number issued with each lock, and reject requests carrying an older one.

> [!abstract] Core idea
> - Every distributed lock has a timeout (TTL), otherwise a crashed holder would block everyone forever.
> - A TTL means a paused holder (GC, network delay, slow disk) can lose the lock and still act as if it holds it.
> - Fix: the lock service hands out a token that grows with every grant; the storage rejects any write with a token lower than one it has already seen.
> - For efficiency (avoid doing work twice) a Redis lock is fine; for correctness (never corrupt data) use fencing plus a consensus store (etcd, ZooKeeper) or a database constraint.
> - Classic mistake: `SET lock 1 NX` with the same value for every client, and `DEL lock` to release. A slow client then deletes someone else's lock.

## 1. Why it exists

Two instances of an order service process the same "reserve seat A7" message at the same moment (a retry plus a redelivery). Each reads "A7 free", each writes "A7 held by me". One customer's booking silently disappears. Inside one process a `sync.Mutex` fixes this; across machines you need a lock that lives outside any one process.

Typical uses:

- Run a scheduled job on one instance only.
- Hold an inventory item or seat while a payment completes.
- Make one worker rebuild an expensive cache entry while others wait (avoid a stampede).
- Serialize writes to an external system that has no transactions, such as a file in object storage.

## 2. Mental model

**Efficiency vs correctness (Kleppmann's distinction).** Ask what happens if the lock fails and two processes run at once:

- **Efficiency lock:** some work is done twice. Two workers both rebuild a cache entry or both send a report. Annoying, not dangerous. A simple Redis lock is fine.
- **Correctness lock:** data is corrupted. Two writers overwrite each other's file; a seat is sold twice. Here the lock must be backed by fencing, or replaced by a database constraint.

**Analogy.** A lock with a TTL is a hotel key card that stops working at checkout time. If you fall asleep in the lobby past checkout, the room is given to someone else, but you still *think* it is yours. A fencing token is a room number plus a booking number printed on the card: the door only opens for the newest booking number it has seen.

## 3. How it works

### A single-Redis lock, done correctly

- **Acquire:** `SET lock:seat:A7 <unique-id> NX PX 30000`. `NX` sets only if absent; `PX 30000` expires after 30 s; the value is a random ID (a UUID) unique to *this* acquisition.
- **Release:** delete only if the value is still yours, atomically, with a Lua script:

```lua
-- KEYS[1] = lock key, ARGV[1] = my unique id
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

- **Renew (watchdog):** for long work, a background routine extends the TTL with the same compare-then-`PEXPIRE` script while the work runs. Redisson's watchdog defaults to a 30 s lease, renewed every 10 s.

```mermaid
sequenceDiagram
    participant W1 as Worker 1 (id u-111)
    participant R as Redis
    participant W2 as Worker 2 (id u-222)
    W1->>R: SET lock:seat:A7 u-111 NX PX 30000
    R-->>W1: OK
    W2->>R: SET lock:seat:A7 u-222 NX PX 30000
    R-->>W2: nil (already held)
    W1->>W1: reserve seat A7
    W1->>R: EVAL release script (key, u-111)
    R-->>W1: 1 (deleted, value matched)
    W2->>R: SET lock:seat:A7 u-222 NX PX 30000 (retry)
    R-->>W2: OK
```

### The pause problem

TTL, unique value and safe release are **necessary but not sufficient**. The holder can stop for longer than the TTL at any point: a stop-the-world GC pause, a VM migration, a page fault on a swapped-out page, or a network packet delayed in a queue. When it resumes it has no way to know time passed.

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant L as Lock service
    participant S as Storage
    participant C2 as Client 2
    C1->>L: acquire (TTL 30 s)
    L-->>C1: OK, token 33
    Note over C1: long GC pause (40 s)
    Note over L: TTL expires at 30 s
    C2->>L: acquire
    L-->>C2: OK, token 34
    C2->>S: write seat A7 = C2 (token 34)
    S-->>C2: OK, highest token seen = 34
    Note over C1: pause ends, C1 still thinks it holds the lock
    C1->>S: write seat A7 = C1 (token 33)
    S-->>C1: rejected, 33 < 34
```

Without the token check, the last arrow succeeds and client 1 overwrites client 2: both "held the lock". With it, the storage itself refuses the stale write. Checking "do I still hold the lock?" just before writing does not help, because the pause can happen between the check and the write.

### Where fencing tokens come from

- **etcd:** every key has a `create_revision`, a cluster-wide number that grows with every write. The lock key's create revision is a ready-made fencing token.
- **ZooKeeper:** the sequence number of the ephemeral sequential znode, or the `zxid` of its creation.
- **PostgreSQL:** a `bigserial` or a counter row incremented in the same transaction as the grant.
- **Chubby** called these *sequencers* (2006).

The storage side is one comparison. In SQL:

```sql
-- seats(seat_id text PRIMARY KEY, holder text, fence bigint NOT NULL DEFAULT 0)
UPDATE seats
SET holder = $2, fence = $3
WHERE seat_id = $1
  AND fence < $3;      -- reject a token we have already seen or passed
```

Representative output (PostgreSQL 17) for the stale write with token 33 after token 34 was applied: `UPDATE 0`. The application treats zero rows as "you lost the lock" and aborts. (Use `<=` instead of `<` if the same holder may write several times with one token.)

## 4. Worked example

### Whiteboard version

```text
LockService.Acquire(owner, ttl):
    if held and not expired: fail
    owner, expiry = owner, now + ttl
    token += 1;  return token

Storage.Write(token, data):
    if token < maxTokenSeen: reject (stale)
    maxTokenSeen = token; apply data
```

### Go: lock service plus fenced storage

The lock service mirrors `SET NX PX` with an owner check on release and adds a token. `Storage` is the protected resource that enforces the token. The clock is injected so the 40-second pause is simulated instantly. It passes `go vet` and `go test -race` on Go 1.24.

```go
package fencing

import (
	"errors"
	"sync"
	"time"
)

var (
	ErrHeld       = errors.New("lock held by another client")
	ErrNotOwner   = errors.New("not the current lock owner")
	ErrStaleToken = errors.New("stale fencing token")
)

// LockService grants a TTL lock and a fencing token that grows with every grant,
// like an etcd revision or a ZooKeeper zxid.
type LockService struct {
	mu      sync.Mutex
	now     func() time.Time
	owner   string // unique per acquirer (a UUID in real code)
	expires time.Time
	token   uint64
}

func NewLockService(now func() time.Time) *LockService { return &LockService{now: now} }

// Acquire is the moral equivalent of Redis SET key owner NX PX ttl, plus a token.
func (l *LockService) Acquire(owner string, ttl time.Duration) (uint64, error) {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := l.now()
	if l.owner != "" && now.Before(l.expires) {
		return 0, ErrHeld
	}
	l.owner, l.expires = owner, now.Add(ttl)
	l.token++
	return l.token, nil
}

// Release deletes the lock only if owner still holds it
// (the Lua compare-and-delete in Redis).
func (l *LockService) Release(owner string) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.owner != owner || !l.now().Before(l.expires) {
		return ErrNotOwner
	}
	l.owner = ""
	return nil
}

// Storage is the protected resource. It remembers the highest token it has
// seen and rejects anything older. This check is what makes the lock safe.
type Storage struct {
	mu       sync.Mutex
	maxToken uint64
	Data     map[string]string
}

func NewStorage() *Storage { return &Storage{Data: map[string]string{}} }

func (s *Storage) Write(token uint64, key, value string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if token < s.maxToken {
		return ErrStaleToken
	}
	s.maxToken = token
	s.Data[key] = value
	return nil
}
```

The first test is the sequence diagram above, step by step; the others check that the lock is exclusive while live and that exactly one of 64 concurrent acquirers wins.

```go
package fencing

import (
	"errors"
	"sync"
	"testing"
	"time"
)

type fakeClock struct {
	mu sync.Mutex
	t  time.Time
}

func (c *fakeClock) Now() time.Time          { c.mu.Lock(); defer c.mu.Unlock(); return c.t }
func (c *fakeClock) Advance(d time.Duration) { c.mu.Lock(); c.t = c.t.Add(d); c.mu.Unlock() }

// The GC-pause scenario: client 1's lease expires while it is paused,
// client 2 acquires and writes, then client 1 wakes up and tries to write.
func TestStaleHolderIsFencedOff(t *testing.T) {
	clk := &fakeClock{t: time.Unix(0, 0)}
	locks, store := NewLockService(clk.Now), NewStorage()

	t1, err := locks.Acquire("client-1-uuid", 30*time.Second)
	if err != nil || t1 != 1 {
		t.Fatalf("client 1: token %d, err %v", t1, err)
	}
	clk.Advance(40 * time.Second) // client 1 is paused for 40s; its lease expired

	t2, err := locks.Acquire("client-2-uuid", 30*time.Second)
	if err != nil || t2 != 2 {
		t.Fatalf("client 2: token %d, err %v", t2, err)
	}
	if err := store.Write(t2, "seat:A7", "client-2"); err != nil {
		t.Fatal(err)
	}

	// Client 1 resumes, still believing it holds the lock.
	if err := store.Write(t1, "seat:A7", "client-1"); !errors.Is(err, ErrStaleToken) {
		t.Fatalf("stale write: err = %v, want ErrStaleToken", err)
	}
	if got := store.Data["seat:A7"]; got != "client-2" {
		t.Fatalf("seat:A7 = %q, want client-2", got)
	}
	// And client 1 cannot release client 2's lock.
	if err := locks.Release("client-1-uuid"); !errors.Is(err, ErrNotOwner) {
		t.Fatalf("release by old owner: err = %v, want ErrNotOwner", err)
	}
}

func TestLockIsExclusiveWhileLive(t *testing.T) {
	clk := &fakeClock{t: time.Unix(0, 0)}
	locks := NewLockService(clk.Now)
	if _, err := locks.Acquire("a", 10*time.Second); err != nil {
		t.Fatal(err)
	}
	clk.Advance(9 * time.Second)
	if _, err := locks.Acquire("b", 10*time.Second); !errors.Is(err, ErrHeld) {
		t.Fatalf("err = %v, want ErrHeld", err)
	}
	if err := locks.Release("a"); err != nil {
		t.Fatal(err)
	}
	if tok, err := locks.Acquire("b", 10*time.Second); err != nil || tok != 2 {
		t.Fatalf("b: token %d, err %v", tok, err)
	}
}

func TestConcurrentAcquireOneWinner(t *testing.T) {
	clk := &fakeClock{t: time.Unix(0, 0)}
	locks := NewLockService(clk.Now)
	var wg sync.WaitGroup
	var mu sync.Mutex
	wins := 0
	for i := 0; i < 64; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			if _, err := locks.Acquire(string(rune('a'+i)), time.Minute); err == nil {
				mu.Lock()
				wins++
				mu.Unlock()
			}
		}(i)
	}
	wg.Wait()
	if wins != 1 {
		t.Fatalf("wins = %d, want 1", wins)
	}
}
```

## 5. Variants and comparison

| Lock | How it works | Fencing token | Use when | Weakness |
| --- | --- | --- | --- | --- |
| Single Redis node | `SET k uuid NX PX ttl`, Lua compare-and-delete | None built in (an `INCR` counter can be added) | Efficiency locks | Redis replication is asynchronous: a failover can lose the key and grant it twice |
| Redlock | Acquire on a majority of N (usually 5) independent Redis masters within a time budget; validity = TTL − elapsed − drift allowance | None | Rarely the best choice | Safety depends on bounded pauses, network delay and clock drift (see below) |
| etcd `concurrency.Mutex` | Session lease (TTL, kept alive) + key under a prefix; lowest create revision holds; wait on predecessor | Create revision of the key | Correctness locks in Go services with etcd | Needs etcd; lease expiry during a pause still requires fencing downstream |
| ZooKeeper lock recipe | Ephemeral sequential znode; lowest number holds; watch only the next-lower node | Znode sequence / zxid | JVM stacks with ZooKeeper | Session timeouts to tune |
| `pg_advisory_lock(key)` | Session or transaction-scoped lock in PostgreSQL (`pg_advisory_xact_lock` releases at commit) | None (add a counter column) | Service already on one PostgreSQL primary | Session lock silently lost if the connection drops; does not span databases |
| `SELECT … FOR UPDATE SKIP LOCKED` | Row locks; other workers skip locked rows | Not needed when the work is in the same transaction | Job queues, claiming work items | Lock lives only as long as the transaction |
| Unique constraint / conditional write | `INSERT … ON CONFLICT DO NOTHING`, `UPDATE … WHERE version = $v` | The row version is the token | Most "only once" problems | Requires the work's result to live in that database |

**Go libraries:** `github.com/go-redsync/redsync/v4` (Redis and Redlock), `go.etcd.io/etcd/client/v3/concurrency` (`NewSession`, `NewMutex`, `Lock`, `Unlock`), and plain `pgx` for advisory locks.

## 6. Trade-offs and when not to use

- **Try to avoid the lock first.** Most "lock" problems disappear with one of:
	- **Idempotency:** make the operation safe to run twice (see [[Idempotency and Idempotency Keys]]).
	- **A unique constraint or conditional update:** let the database reject the second writer (see [[Locking - Optimistic vs Pessimistic]]).
	- **Single-writer partitioning:** route all work for a key to one consumer, as a Kafka partition does.
- **TTL sizing.** The TTL must exceed the longest normal hold time plus GC and network jitter, but every extra second is a second of unavailability after a crash. Use a short TTL plus a renewal watchdog for long work, and still fence.
- **Fencing needs a cooperating resource.** The storage must store and compare the token. An external API that ignores your token (a payment provider, an email sender) cannot be fenced; use idempotency keys with it instead.
- **A lock service is a dependency.** If Redis or etcd is down, nothing can acquire. Decide whether the work should fail closed or open.

## 7. In production

- **Real systems:**
	- Kubernetes controllers and Patroni rely on lease locks in etcd or the API server (see [[Leader Election]]).
	- Google's Chubby (2006) provided coarse-grained locks and introduced sequencers checked by servers.
	- Many cron and batch frameworks use Redis locks (ShedLock on the JVM supports Redis, JDBC and ZooKeeper backends) for efficiency-grade "run once".
- **Failure modes → fixes:**
	- Lock released by the wrong client (same value, plain `DEL`) → unique value per acquisition plus the Lua compare-and-delete.
	- Holder paused past TTL; two writers → fencing tokens checked by the storage.
	- Redis failover loses the lock key → accept it for efficiency locks; use etcd/ZooKeeper or a database constraint for correctness.
	- Lock never released because the process crashed → that is what the TTL is for; never create a lock without one.
	- Herd of waiters polling the lock → ZooKeeper/etcd "watch your predecessor", or retry with jittered backoff (see [[Timeouts, Retries and Backoff]]).
	- Long job outlives its TTL → watchdog renewal, and have the job check the lock (or its token) between steps.
- **What to monitor:** acquire latency and failure rate, hold-time distribution compared with the TTL, number of expirations while held (watchdog misses), stale-token rejections at the storage (each one is a near miss), lock-service availability.

## 8. Deep dive

- **The Redlock debate (2016).** Redlock acquires the lock on a majority of 5 independent Redis nodes and computes how much validity time remains. Kleppmann argued it is unsafe for correctness: it relies on bounded process pauses, bounded network delay and clocks that do not jump (a node whose clock jumps forward expires the key early, letting a second client get a majority), and it provides no fencing token. antirez replied that the algorithm checks elapsed time after acquiring, that clock jumps can be avoided operationally, and that fencing makes the lock almost unnecessary. Takeaway for interviews: Redlock is an efficiency lock with extra cost; for correctness, use a consensus store plus fencing.
- **etcd lock internals.** `concurrency.NewMutex(session, "/locks/seat-A7")` creates the key `/locks/seat-A7/<leaseID>` attached to the session's lease. The holder is the key with the lowest create revision; each waiter waits for the deletion of the key just before its own. If the process dies, the lease expires and the key disappears. The mutex does not export its key's create revision directly: read it with `Get(m.Key())`, or use `m.Header().Revision` after `Lock`, which is at least as large and also grows with every new holder. For writes kept in etcd itself, `Txn().If(m.IsOwner())` (which compares the key's create revision) commits only while the lock key still exists.
- **Clocks.** Redis expires keys using its own clock. A TTL lock's safety assumes the holder's sense of elapsed time and the server's agree within a margin. Use a monotonic clock for the holder's countdown (Go's `time.Since` does; see [[Clocks and Ordering]]).
- **Token monotonicity across failovers.** Tokens must keep growing even when the lock service fails over. A consensus store gives this for free (revisions are part of the replicated log). A counter on a single Redis node can go backwards after a failover with asynchronous replication, which would let an old token pass.
- **Lock granularity.** One lock per seat scales; one lock per show serializes the whole show. Lock the smallest unit the invariant needs, and always acquire multiple locks in a fixed order to avoid deadlock.

## 9. Interview questions

> [!question]- What is wrong with `SET lock 1 NX EX 30` and `DEL lock`?
> Every client writes the same value, so a client whose lock already expired can `DEL` a lock now held by someone else. Use a unique value per acquisition and release with a Lua script that deletes only if the value matches.

> [!question]- The lock has a TTL, a unique value and a safe release. Is it now correct?
> No. A holder paused past the TTL (GC, network delay) resumes and writes while another client holds the lock. Only the protected resource can stop that, by checking a fencing token that increases with each grant.

> [!question]- Where does a fencing token come from, and who checks it?
> From the lock service: etcd's create revision, a ZooKeeper sequence number, or a database counter. The storage being protected checks it: it remembers the highest token seen and rejects lower ones, for example `UPDATE … WHERE fence < $token`.

> [!question]- Is Redlock safe?
> Safe only under timing assumptions: bounded pauses, bounded network delay, no clock jumps. It also gives no fencing token. Fine for efficiency; for correctness use a consensus-backed lock with fencing, or a database constraint.

> [!question]- Trap: "We check that we still hold the lock right before writing, so we don't need fencing."
> The pause can happen between the check and the write, or the write can sit in a network queue after the check. The check and the write are not atomic, so only a check performed by the storage itself is safe.

> [!question]- How would you make a cron job run once across 10 instances?
> Prefer a database guarantee: insert `(job, scheduled_for)` with a unique constraint, or claim the row with `FOR UPDATE SKIP LOCKED`. If you use a lock (Redis, etcd), make the job idempotent too, since a lock can be lost.

## 10. Cheat sheet

- Efficiency lock (duplicate work is fine) vs correctness lock (must never double-write).
- Redis: `SET key <uuid> NX PX ttl`; release with Lua compare-and-delete; watchdog to renew.
- TTL + unique value + safe release is necessary, not sufficient.
- Fencing token: increases per grant; storage rejects `token < max seen`.
- Tokens: etcd create revision, ZooKeeper sequence/zxid, DB counter.
- Redlock: timing assumptions, no token. Debate: Kleppmann vs antirez, 2016.
- Avoid locks: idempotency, unique constraints, `SKIP LOCKED`, single-writer partitions.

## Links

- **Before this:** [[Leader Election]], [[Consensus - Raft and Paxos]], [[Locking - Optimistic vs Pessimistic]]
- **Next:** [[Two-Phase Commit]], [[Idempotency and Idempotency Keys]]
- **Compare with:** [[Redis Use Cases]] (the Redis lock as one use case), [[Scheduled Jobs - Cron to Durable Schedulers]] (run-once without a lock)
