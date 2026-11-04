---
tags: [distributed-systems, leader-election, leases, coordination]
level: advanced
status: reviewed
prereqs: ["[[Consensus - Raft and Paxos]]", "[[Clocks and Ordering]]"]
related: ["[[Distributed Locks and Fencing Tokens]]", "[[High Availability and Failover]]", "[[Failure Detection, Gossip and Membership]]", "[[Kubernetes Fundamentals]]", "[[Scheduled Jobs - Cron to Durable Schedulers]]", "[[Case Study - Distributed Job Scheduler]]", "[[Locking - Optimistic vs Pessimistic]]"]
sources:
  - "Garcia-Molina, Elections in a Distributed Computing System (IEEE Trans. Computers, 1982), bully algorithm"
  - "Chang & Roberts, An improved algorithm for decentralized extrema-finding in circular configurations of processes (CACM 1979), ring election"
  - "Ongaro & Ousterhout, Raft paper (USENIX ATC 2014), leader election and terms"
  - "Kubernetes client-go docs, package tools/leaderelection; kube-controller-manager flags --leader-elect-lease-duration=15s, --leader-elect-renew-deadline=10s, --leader-elect-retry-period=2s"
  - "Kubernetes API reference, Lease (coordination.k8s.io/v1): holderIdentity, leaseDurationSeconds, renewTime, leaseTransitions"
  - "etcd Go client docs, go.etcd.io/etcd/client/v3/concurrency: NewSession (default TTL 60 s), Election.Campaign, Resign, Observe"
  - "ZooKeeper Recipes and Solutions, Leader Election (ephemeral sequential znodes)"
  - "Consul docs, Sessions and Leader Election (lock-delay default 15 s)"
  - "PostgreSQL 17 docs, Advisory Lock Functions"
updated: 2026-11-04
---

# Leader Election

> [!summary] TL;DR
> **Leader election** picks exactly one instance out of several to do a job that must not run twice at once, such as running a scheduler or being the only writer. In practice the instances race to hold a **lease**, a record with an expiry time in a strongly consistent store, and the holder must keep renewing it to stay leader.

> [!abstract] Core idea
> - Elect a leader when work must have a single owner: a cron scheduler, a primary database, a partition owner, a controller.
> - The safe way is a **lease** in a store built on consensus (etcd, ZooKeeper, Consul, a Kubernetes Lease, or a database row).
> - The leader stops acting before its lease can expire (renew deadline < lease TTL), and everyone else waits for full expiry.
> - Even so, a paused old leader can wake up and act: protect writes with an **epoch** (fencing) number.
> - Classic mistake: "the node with the lowest IP is leader", decided by each node from its own view of who is alive. That creates two leaders during a partition.

## 1. Why it exists

You deploy a billing service with 3 replicas for availability. It has a job, "charge all subscriptions due today at 02:00", that must run **exactly once** per day. If all 3 replicas run it, each customer is charged 3 times. If you pin it to replica 1 and replica 1 dies, nobody is charged.

You need: one replica runs it, and if that replica dies, another takes over within seconds. That is leader election. The same need appears in:

- **Single writer:** a primary database; a Kafka partition leader; one owner per shard.
- **Coordinator:** a cluster controller, Kubernetes' `kube-controller-manager` and `kube-scheduler`, which run with several replicas and one active.
- **Scheduler:** the cron runner above, a job dispatcher, a cache warmer.

The hard part is not choosing; it is guaranteeing that two instances never both believe they lead (**split brain**) when the network is partitioned or a process is paused.

## 2. Mental model

**A baton with a sand timer.** There is one baton in a locked box (the consistent store). Whoever takes it turns over a 15-second sand timer and must come back to flip the timer before it runs out. If the holder does not come back, after the sand runs out anyone may take the baton, and the box writes a new, higher number on it. Any action taken "as leader" quotes that number, so actions from an old holder can be spotted.

**Vocabulary:**

- **Lease:** the right to lead until a time; renewed periodically.
- **TTL / lease duration:** how long a lease lasts without renewal.
- **Renew deadline:** how long the leader keeps acting without a successful renewal. Always shorter than the TTL.
- **Epoch (or term, generation, `leaseTransitions`):** a number that grows each time leadership changes. Used as a fencing token.

## 3. How it works

### The lease lifecycle

```mermaid
sequenceDiagram
    participant A as Instance A
    participant S as Lease store (etcd / K8s Lease)
    participant B as Instance B
    A->>S: acquire if free (compare-and-set)
    S-->>A: OK, holder=A, epoch=7, expires t+15s
    B->>S: acquire if free
    S-->>B: no, held by A until t+15s
    loop every 2 s
        A->>S: renew (holder is A)
        S-->>A: OK, expires now+15s
    end
    Note over A: GC pause or partition, renewals stop
    Note over A: 10 s after last renew, A stops leading (renew deadline)
    B->>S: acquire if free (retry every 2 s)
    S-->>B: no, not yet expired
    Note over S: 15 s after last renew, lease expires
    B->>S: acquire if free
    S-->>B: OK, holder=B, epoch=8
    A->>S: renew (A wakes up)
    S-->>A: no, held by B, epoch=8
    Note over A: A becomes a follower and keeps campaigning
```

### Each instance's states

```mermaid
stateDiagram-v2
    [*] --> Follower
    Follower --> Candidate: lease looks free or expired
    Candidate --> Leader: compare-and-set succeeds (epoch + 1)
    Candidate --> Follower: someone else won
    Leader --> Leader: renew succeeds within the renew deadline
    Leader --> Follower: renew deadline passed, or store reports a new holder
    Leader --> [*]: graceful shutdown, release the lease
```

### Four rules that keep it safe

1. **The store decides.** Acquisition must be an atomic compare-and-set (or create-if-absent) on a linearizable store. Two instances cannot both succeed.
2. **The leader gives up early.** It stops leader-only work when `now - lastSuccessfulRenew >= renewDeadline` (10 s), while followers wait for the full lease duration (15 s). The gap absorbs clock-rate differences and in-flight requests.
3. **Every takeover bumps the epoch.** Downstream systems reject writes carrying an older epoch. This handles the case rule 2 cannot: a leader paused *in the middle* of a write.
4. **Release on shutdown.** A leader that stops cleanly deletes the lease so a follower takes over immediately instead of waiting 15 s.

## 4. Worked example

### Whiteboard version

```text
loop every retryPeriod (2s):
    ok, epoch = store.CompareAndSet(lease,
        if lease.holder == me or lease.expired(): holder = me, expires = now + ttl,
                                                  epoch += 1 if holder changed)
    if ok: lastRenew = now

before every leader-only action:
    if now - lastRenew >= renewDeadline (10s): not leader, stop
    send action with epoch; downstream rejects epoch < highest seen

on SIGTERM: release lease if I hold it
```

### Go implementation with an injected clock

`Store` is the linearizable compare-and-set store (in production, etcd or a Kubernetes Lease object). `Elector` is one candidate. The clock is injected so the tests can simulate a 15-second pause without sleeping. It passes `go vet` and `go test -race` on Go 1.24.

```go
package election

import (
	"sync"
	"time"
)

// Lease is the single record every candidate competes for, like a
// Kubernetes Lease object or a row in a leases table.
type Lease struct {
	Holder  string
	Epoch   uint64    // bumped on every change of leader; used as a fencing token
	Expires time.Time // the store's own clock decides expiry
}

// Store is a linearizable compare-and-set store (etcd, a database row, a K8s Lease).
// now is injected so tests are deterministic.
type Store struct {
	mu    sync.Mutex
	lease Lease
	now   func() time.Time
}

func NewStore(now func() time.Time) *Store { return &Store{now: now} }

// TryAcquire makes id the leader if the lease is free or expired,
// or renews it if id already holds it. It returns the lease after the call.
func (s *Store) TryAcquire(id string, ttl time.Duration) (Lease, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := s.now()
	switch {
	case s.lease.Holder == id && now.Before(s.lease.Expires):
		s.lease.Expires = now.Add(ttl) // renew, same epoch
	case s.lease.Holder == "" || !now.Before(s.lease.Expires):
		s.lease = Lease{Holder: id, Epoch: s.lease.Epoch + 1, Expires: now.Add(ttl)}
	default:
		return s.lease, false // someone else holds a live lease
	}
	return s.lease, true
}

// Release gives the lease up early (graceful step-down on shutdown).
func (s *Store) Release(id string, epoch uint64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.lease.Holder == id && s.lease.Epoch == epoch {
		s.lease.Holder = ""
		s.lease.Expires = time.Time{}
	}
}

// Elector is one candidate. It treats itself as leader only until
// renewDeadline after its last successful renew, which is shorter than the
// lease TTL, so it stops leading before anyone else can take over.
type Elector struct {
	ID            string
	Store         *Store
	TTL           time.Duration // e.g. 15s
	RenewDeadline time.Duration // e.g. 10s, must be < TTL
	Now           func() time.Time

	epoch     uint64
	lastRenew time.Time
}

// Tick runs one attempt (call it every retry period, e.g. 2s) and reports
// whether this instance may act as leader right now, with its epoch.
func (e *Elector) Tick() (leader bool, epoch uint64) {
	sent := e.Now() // count the renew deadline from when the request was sent
	if l, ok := e.Store.TryAcquire(e.ID, e.TTL); ok {
		e.epoch, e.lastRenew = l.Epoch, sent
	}
	return e.IsLeader()
}

// IsLeader is checked before every leader-only action.
func (e *Elector) IsLeader() (bool, uint64) {
	if e.epoch == 0 || e.Now().Sub(e.lastRenew) >= e.RenewDeadline {
		return false, 0
	}
	return true, e.epoch
}

// StepDown releases the lease so a follower can take over at once.
func (e *Elector) StepDown() {
	e.Store.Release(e.ID, e.epoch)
	e.epoch = 0
}
```

The tests walk through the sequence diagram: A leads and renews, A freezes, A stops leading at 10 s, B cannot take over until 15 s, B takes over with epoch 2, and A cannot come back. A third test runs 50 concurrent candidates against the store and checks exactly one wins.

```go
package election

import (
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

func setup() (*fakeClock, *Elector, *Elector) {
	clk := &fakeClock{t: time.Date(2026, 11, 4, 9, 0, 0, 0, time.UTC)}
	s := NewStore(clk.Now)
	mk := func(id string) *Elector {
		return &Elector{ID: id, Store: s, TTL: 15 * time.Second, RenewDeadline: 10 * time.Second, Now: clk.Now}
	}
	return clk, mk("pod-a"), mk("pod-b")
}

func TestOnlyOneLeaderAndTakeoverAfterExpiry(t *testing.T) {
	clk, a, b := setup()
	if ok, ep := a.Tick(); !ok || ep != 1 {
		t.Fatalf("a should lead with epoch 1, got %v %d", ok, ep)
	}
	if ok, _ := b.Tick(); ok {
		t.Fatal("b must not lead while a's lease is live")
	}
	// a renews every 2s for a while; b keeps losing.
	for i := 0; i < 5; i++ {
		clk.Advance(2 * time.Second)
		if ok, _ := a.Tick(); !ok {
			t.Fatal("a should keep leading while it renews")
		}
		if ok, _ := b.Tick(); ok {
			t.Fatal("b must not lead")
		}
	}
	// a freezes (GC pause, partition): no more ticks from a.
	clk.Advance(10 * time.Second)
	if ok, _ := a.IsLeader(); ok {
		t.Fatal("a must stop acting as leader after its renew deadline")
	}
	if ok, _ := b.Tick(); ok {
		t.Fatal("lease (15s) has not expired yet at 10s")
	}
	clk.Advance(5 * time.Second) // 15s after a's last renew
	ok, ep := b.Tick()
	if !ok || ep != 2 {
		t.Fatalf("b should take over with epoch 2, got %v %d", ok, ep)
	}
	// a wakes up: its renew fails and it stays a follower.
	if ok, _ := a.Tick(); ok {
		t.Fatal("old leader must not regain leadership while b holds the lease")
	}
}

func TestGracefulStepDown(t *testing.T) {
	_, a, b := setup()
	a.Tick()
	a.StepDown()
	if ok, ep := b.Tick(); !ok || ep != 2 {
		t.Fatalf("b should take over immediately with epoch 2, got %v %d", ok, ep)
	}
}

func TestConcurrentCandidatesExactlyOneWins(t *testing.T) {
	clk := &fakeClock{t: time.Unix(0, 0)}
	s := NewStore(clk.Now)
	var wg sync.WaitGroup
	var mu sync.Mutex
	winners := 0
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			if _, ok := s.TryAcquire(string(rune('A'+id)), time.Second); ok {
				mu.Lock()
				winners++
				mu.Unlock()
			}
		}(i)
	}
	wg.Wait()
	if winners != 1 {
		t.Fatalf("winners = %d, want exactly 1", winners)
	}
}
```

**Timeline from the first test** (seconds since A first acquired; A's last successful renew is at t = 10):

| Time | A thinks | Store says | B's attempt |
| --- | --- | --- | --- |
| 10 | leader, epoch 1 | holder A, expires 25 | refused |
| 20 | **not leader** (10 s ≥ renew deadline) | holder A, expires 25 | refused |
| 25 | not leader | expired | **wins, epoch 2** |
| 25+ | renew refused, follower | holder B | leader |

Between 20 and 25 nobody leads. That gap is the price of never having two leaders, and it is why failover takes "lease duration plus retry period" rather than zero.

**A simplification to know about.** The test uses one shared clock. In real systems the store and the instances have separate clocks. Kubernetes' client-go avoids comparing them: each candidate measures, with its own monotonic clock, how long it has seen the same `renewTime` unchanged, and only takes over after a full lease duration of no change. That still assumes clocks *run* at roughly the same rate, which is why the 10 s / 15 s margin exists.

## 5. Variants and comparison

| Method | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Bully (1982) | On detecting the leader is down, a node messages all higher-ID nodes; if none answer, it declares itself leader | Textbook vocabulary; small static groups on a reliable network | Unsafe under partitions: each side elects its own leader |
| Ring (Chang–Roberts, 1979) | An election message circulates the ring collecting the highest ID | Textbook vocabulary | Same partition problem; `O(n)` to `O(n²)` messages |
| Consensus built in (Raft term) | Candidates request votes; a majority makes a leader for that term | You are building the replicated system itself | You must run a Raft group |
| etcd election | `concurrency.NewSession` (lease, default TTL 60 s, kept alive in the background), then `Election.Campaign`; the leader is the key with the lowest create revision under a prefix | Go services already running etcd | Needs an etcd cluster; revision of the key works as an epoch |
| ZooKeeper | Each candidate creates an ephemeral sequential znode; the lowest sequence leads; each watches only its predecessor | JVM ecosystems already on ZooKeeper | Session timeouts to tune; no herd on change |
| Consul session | `PUT ?acquire=<session>` on a key; session tied to health checks; `lock-delay` (default 15 s) blocks reacquire after a release by invalidation | Consul shops | Health-check-based expiry |
| Kubernetes Lease | client-go `leaderelection` updates a `coordination.k8s.io/v1` Lease: `holderIdentity`, `renewTime`, `leaseTransitions` | Anything running in Kubernetes | Typical 15 s lease, 10 s renew deadline, 2 s retry; API-server load from renewals |
| Database lease | `pg_try_advisory_lock(42)` on a session, or a `leases` row updated with `WHERE expires_at < now()` | You already have PostgreSQL and no etcd | The database becomes a dependency of failover; advisory locks are lost silently when the connection drops |

### PostgreSQL lease row

When the only consistent store you have is PostgreSQL, a lease row works. The database's clock (`now()`) is the single clock, and the `epoch` column is the fencing token.

```sql
CREATE TABLE leader_lease (
    name       text PRIMARY KEY,
    holder     text NOT NULL,
    epoch      bigint NOT NULL,
    expires_at timestamptz NOT NULL
);
INSERT INTO leader_lease VALUES ('billing-cron', '', 0, '-infinity');

-- Acquire or renew in one statement. Returns a row only if we lead.
UPDATE leader_lease
SET holder     = $1,
    epoch      = CASE WHEN holder = $1 AND expires_at > now() THEN epoch ELSE epoch + 1 END,
    expires_at = now() + interval '15 seconds'
WHERE name = 'billing-cron'
  AND (holder = $1 OR expires_at <= now())
RETURNING epoch;
```

Representative output (PostgreSQL 17), first call by `pod-a`:

```text
 epoch
-------
     1
(1 row)

UPDATE 1
```

A call by `pod-b` while `pod-a`'s lease is live returns `(0 rows)` and `UPDATE 0`. The row lock taken by `UPDATE` serializes competing candidates, so at most one sees a row back.

## 6. Trade-offs and when not to use

- **Failover is never instant.** Detection time is roughly the lease duration, plus the retry period, plus the new leader's warm-up. Shorter leases mean faster failover but more renewal traffic and more false failovers during GC pauses or brief network blips.
- **A lease is a promise about time.** It holds only if clocks run at similar rates and pauses are shorter than the margin. Add fencing for anything that writes.
- **The leader is a bottleneck and a single point of slowness.** If the work can be split, partition it (each instance leads a set of shards, as Kafka does per partition) instead of one global leader.
- **Often you do not need a leader:**
	- For "run this cron job once", a row lock with `FOR UPDATE SKIP LOCKED` on a jobs table, or a unique constraint on `(job, run_date)`, makes duplicates impossible without any election (see [[Scheduled Jobs - Cron to Durable Schedulers]]).
	- Idempotent work can simply run on every replica.

## 7. In production

- **Real systems:**
	- `kube-controller-manager` and `kube-scheduler` run several replicas with one active via a Lease object.
	- Patroni elects the PostgreSQL primary through a lease in etcd, Consul or ZooKeeper (see [[High Availability and Failover]]).
	- Kafka: the KRaft controller quorum elects the active controller with Raft; the controller then picks a leader for each partition from its in-sync replicas.
	- Redis Sentinel: sentinels agree (by majority) that the master is down and elect one sentinel to run the failover.
- **Failure modes → fixes:**
	- Leadership flapping during GC pauses or a slow store → longer lease, separate the renewal goroutine from heavy work, alert on transitions.
	- Old leader keeps writing after a pause → fencing: pass the epoch to every downstream write and reject older ones (see [[Distributed Locks and Fencing Tokens]]).
	- 15-second outage on every deploy → release the lease on `SIGTERM` (client-go's `ReleaseOnCancel: true`).
	- Leader holds the lease but its work loop is stuck → tie renewal to a health signal from the work loop, not just to "process is alive".
	- Advisory-lock leader loses its DB connection and the lock with it, but keeps running → check the lock (or re-acquire) before each unit of work, or use the lease row with an epoch.
- **What to monitor:** current leader identity, leadership transitions per hour, time since last successful renewal, renewal latency, and time with no leader during failovers.

## 8. Deep dive

- **Why renew deadline < lease duration.** The leader starts its 10 s countdown from when it *sent* its last successful renewal (the Go example records the time before calling the store for this reason), while the store computes expiry from when it *received* it, which is later. So the leader always believes its lease ends before the store does. The 5 s gap also absorbs a clock that runs a little fast and the time to finish an in-flight operation.
- **Detection vs safety.** A failure detector (heartbeats, phi accrual; see [[Failure Detection, Gossip and Membership]]) can say a leader is *probably* dead. It can never be sure, because a slow node looks like a dead one. So the safety of election must come from the store's atomic compare-and-set and from fencing, never from "I think the leader is dead".
- **Thundering herd.** With 100 candidates all watching one key, every change wakes 100 clients that all retry. ZooKeeper's recipe avoids this: each candidate watches only the znode just below its own, so one change wakes one client. etcd's `Campaign` does the same by waiting on the key with the previous revision.
- **Observers.** Followers often need to know who leads (to forward requests). etcd `Election.Observe` streams leader changes; Kubernetes clients read `holderIdentity`.
- **Epoch in the data path.** The strongest form puts the epoch inside the store transaction itself: etcd transactions can check that the leader key still has its create revision (`Txn().If(Compare(CreateRevision(leaderKey), "=", rev))`), so a write succeeds only while that exact leadership is live.

### The same with etcd's election API

In a Go service that already runs etcd, the library does the lease, the campaign and the watch-your-predecessor logic. This compiles and passes `go vet` against `go.etcd.io/etcd/client/v3` v3.6.7; it needs a live etcd cluster to run, so it has no unit test here.

```go
package etcdel

import (
	"context"
	"fmt"

	clientv3 "go.etcd.io/etcd/client/v3"
	"go.etcd.io/etcd/client/v3/concurrency"
)

// RunAsLeader campaigns for leadership of /election/billing-cron and calls
// work with the leader key's create revision, which serves as the epoch.
// work must stop when ctx is cancelled (session lost or shutdown).
func RunAsLeader(ctx context.Context, cli *clientv3.Client, id string, work func(ctx context.Context, epoch int64) error) error {
	sess, err := concurrency.NewSession(cli, concurrency.WithTTL(15)) // default TTL is 60 s
	if err != nil {
		return fmt.Errorf("new session: %w", err)
	}
	defer sess.Close() // revokes the lease, so a follower takes over at once

	e := concurrency.NewElection(sess, "/election/billing-cron")
	if err := e.Campaign(ctx, id); err != nil { // blocks until this instance leads
		return fmt.Errorf("campaign: %w", err)
	}
	epoch := e.Rev() // create revision of our leader key

	// Stop leading as soon as the session's lease is lost.
	leadCtx, cancel := context.WithCancel(ctx)
	defer cancel()
	go func() {
		select {
		case <-sess.Done():
			cancel()
		case <-leadCtx.Done():
		}
	}()

	workErr := work(leadCtx, epoch)
	if err := e.Resign(context.WithoutCancel(ctx)); err != nil && workErr == nil {
		return fmt.Errorf("resign: %w", err)
	}
	return workErr
}
```

`sess.Done()` closes when the keep-alive fails and the lease is gone, but the process learns that late, so the epoch still has to be checked downstream.

## 9. Interview questions

> [!question]- Why can't each node just elect the node with the highest ID among those it can reach?
> During a partition each side sees a different set of live nodes and elects its own leader: split brain. Election must go through a majority-backed decision (a consensus store or a quorum vote), so the minority side cannot elect anyone.

> [!question]- Kubernetes uses a 15 s lease, 10 s renew deadline and 2 s retry period. Why is renew deadline shorter than the lease?
> The leader must stop acting before any other instance can take over. It stops 10 s after its last successful renew; others wait 15 s of no change. The 5 s gap covers request delays, clock-rate differences and finishing in-flight work.

> [!question]- The old leader was paused for 30 s by GC and then writes to the database. What stops it?
> Nothing in the election itself; the lease check happened before the pause. The database must check a fencing token: the leader sends its epoch with each write and the database rejects epochs lower than the highest it has seen.

> [!question]- How long does failover take?
> Roughly lease duration + retry period + startup work: with 15 s / 2 s, about 15–17 s before the new leader acts. Shortening the lease speeds it up but raises false failovers during pauses. A graceful shutdown that releases the lease brings it down to one retry period.

> [!question]- Trap: "Use a Redis `SETNX` key as the leader lock and you are done."
> A single Redis node is not linearizable through failover: asynchronous replication can lose the key when a replica is promoted, giving two leaders. And without fencing, a paused leader still writes after expiry. Use a consensus store, and fence writes either way.

> [!question]- Do you even need a leader for a daily cron job?
> Often not. Insert a row keyed by `(job_name, run_date)` with a unique constraint, or claim it with `SELECT … FOR UPDATE SKIP LOCKED`; whoever inserts or claims it runs it. That turns "exactly one runner" into a database constraint.

## 10. Cheat sheet

- Leader = holder of a lease in a linearizable store, acquired by compare-and-set.
- Kubernetes defaults: 15 s lease, 10 s renew deadline, 2 s retry.
- Leader stops at renew deadline; others take over only after full expiry.
- Each takeover bumps an epoch; downstream rejects older epochs (fencing).
- Release the lease on shutdown for fast handover.
- Bully and ring are vocabulary; they split-brain under partitions.
- Tools: etcd `concurrency.Election`, ZooKeeper ephemeral sequential znodes, Consul sessions, K8s Lease, a PostgreSQL lease row.
- Prefer no leader at all when a unique constraint or `SKIP LOCKED` does the job.

## Links

- **Before this:** [[Consensus - Raft and Paxos]], [[Clocks and Ordering]]
- **Next:** [[Distributed Locks and Fencing Tokens]], [[Failure Detection, Gossip and Membership]]
- **Compare with:** [[High Availability and Failover]] (electing a database primary), [[Scheduled Jobs - Cron to Durable Schedulers]] (running a job once without an election)
