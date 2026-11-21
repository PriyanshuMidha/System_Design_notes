---
tags: [distributed-systems, failure-detection, gossip, membership, swim, phi-accrual]
level: advanced
status: reviewed
prereqs: ["[[Distributed Systems Fundamentals]]", "[[Timeouts, Retries and Backoff]]", "[[Quorums and Leaderless Replication]]"]
related: ["[[Leader Election]]", "[[Consensus - Raft and Paxos]]", "[[Consistent Hashing]]", "[[Wide-Column Stores and Cassandra]]", "[[High Availability and Failover]]", "[[CRDTs and Conflict Resolution]]", "[[Clocks and Ordering]]"]
sources:
  - "Chandra & Toueg, Unreliable Failure Detectors for Reliable Distributed Systems (JACM 1996): completeness and accuracy"
  - "Hayashibara, Défago, Yared & Katayama, The phi Accrual Failure Detector (SRDS 2004)"
  - "Das, Gupta & Motivala, SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol (DSN 2002)"
  - "Dadgar, Phillips & Currey, Lifeguard: Local Health Awareness for More Accurate Failure Detection (HashiCorp, 2017)"
  - "hashicorp/memberlist source, config.go DefaultLANConfig (ProbeInterval 1 s, ProbeTimeout 500 ms, IndirectChecks 3, SuspicionMult 4, GossipInterval 200 ms, GossipNodes 3)"
  - "Demers et al., Epidemic Algorithms for Replicated Database Maintenance (PODC 1987)"
  - "Apache Cassandra docs: gossip (runs every second, exchanges state with up to three other nodes), phi_convict_threshold (default 8), Merkle-tree repair"
  - "DeCandia et al., Dynamo (SOSP 2007): gossip membership, hinted handoff, Merkle anti-entropy"
  - "Consul docs, Gossip Protocol (Serf, LAN and WAN pools)"
updated: 2026-11-13
---

# Failure Detection, Gossip and Membership

> [!summary] TL;DR
> In a cluster, every node needs to know which other nodes are alive. A **failure detector** guesses that a node is dead when its heartbeats stop arriving; it can only guess, because a slow node looks exactly like a dead one. **Gossip** spreads that knowledge: each node periodically tells a few random peers what it knows, and news reaches all `N` nodes in about `log N` rounds.

> [!abstract] Core idea
> - You cannot tell "crashed" from "slow" over a network, so every failure detector trades speed of detection against false alarms.
> - **Phi accrual** outputs a suspicion level based on how late a heartbeat is compared with the node's normal rhythm, instead of a fixed timeout.
> - **SWIM** probes one random member per period, asks others to probe indirectly before suspecting, and lets a suspected node refute the rumour.
> - **Gossip** (epidemic) dissemination spreads updates in `O(log N)` rounds with constant load per node; **Merkle-tree anti-entropy** repairs data that gossip missed.
> - Classic mistake: having every node heartbeat every other node. That is `N²` messages per interval: 1,000 nodes means about a million messages every heartbeat interval.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works), 4 (worked example), 5 (variants) and 6 (trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Distributed Systems Fundamentals]]: over a network, a crashed machine and a very slow one look exactly the same: both are silent.
> - [[Timeouts, Retries and Backoff]]: a timeout is how long you wait before giving up; too short causes false alarms, too long makes users wait.
> - [[Quorums and Leaderless Replication]]: data is kept on several replicas, and a replica that missed writes must be repaired later.

**From zero, in 60 seconds** 🟢

In a cluster of many servers, each one needs to know which others are alive.
Each server sends a small "I'm alive" message every second. That is a **heartbeat**.
If heartbeats from a server stop, others start to suspect it is dead.

```mermaid
flowchart LR
    A["Server A"] -- "I'm alive, every 1 s" --> B["Server B"]
    B --> Q{"Silence for 5 s?"}
    Q -- "yes" --> S["Suspect A"]
```

But a slow server looks the same as a dead one, so this is always a guess.
Once one server learns news, like "C left", it has to spread it.
**Gossip** spreads it like a rumor: each server tells a few random others, and they tell a few more.
News reaches 10,000 servers in about 10 rounds.

```mermaid
flowchart LR
    A["A knows"] --> B["B"]
    A --> C["C"]
    B --> D["D"]
    C --> E["E"]
```

The rest of this note is just these 3 questions:
1. How do you guess well whether a node is dead?
2. How does news spread to everyone cheaply?
3. How do you avoid wrongly killing a node that is only slow?

**The problem in one story.**
A friend in a group chat stops replying.
Are they asleep, out of signal, or did their phone die? You cannot tell from silence.
Still, the group must decide quickly whether to stop waiting for them.
And everyone in the group should reach the same decision without one person being in charge.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Cluster | A group of machines working as one system | 300 Cassandra nodes |
| Heartbeat | A small "I'm alive" message sent regularly | Every 1 s |
| Timeout | How long silence lasts before you suspect a node | 5 s without a heartbeat |
| False positive | Declaring a healthy node dead | A slow node marked down |
| Failure detector | The component that guesses which nodes are dead | Phi accrual in Cassandra |
| Gossip | Telling a few random peers what you know, repeatedly | Each node talks to 3 others per second |
| Membership list | Each node's view of who is in the cluster and their state | `node47: suspect` |
| Single point of failure | One part whose loss stops everything | A central health-check server |
| Suspect | "Probably dead, not yet sure" | `node47: suspect` for a few seconds |
| Incarnation number | A counter only the node itself can raise, to prove it is alive | B says "alive@6" to beat "suspect@5" |
| Fanout | How many random peers each node tells per round | Fanout 3 |
| Flapping | A node marked down, then up, then down again | Every GC pause marks it dead |
| Anti-entropy | A background job that compares replicas and fixes differences | Cassandra `nodetool repair` |

**Picture it**

```mermaid
flowchart LR
    A["Node A"] -- "ping" --> B["Node B"]
    B -. "no reply" .-> A
    A --> S["Mark B suspect"]
    S -- "gossip" --> C["Node C"]
    S -- "gossip" --> D["Node D"]
    C -- "gossip" --> E["Node E"]
```

**Analogy.** Office rumours: each person tells two or three colleagues, and soon the whole floor knows, with nobody sending a company-wide email.
Where it breaks: office rumours are rarely corrected, but SWIM lets a suspected node refute the rumour with a newer message.

**How the rest of this note builds up**

- First, the three jobs: detect, disseminate, agree on membership (section 1), and the slow-vs-dead mental model (section 2).
- Then heartbeats and timeouts, phi accrual, SWIM, member states and gossip (section 3).
- Then a Go phi accrual detector and SWIM merge rules (section 4), and how real systems compare (section 5).
- Finally the SDE-3 deep dive: false positives in production, Lifeguard, Merkle-tree anti-entropy and tuning trade-offs (sections 6-8).

> [!tip] Remember
> Slow and dead look the same; detectors only suspect, and gossip spreads the news in about log N rounds.

## 1. Why it exists 🟢

A 300-node Cassandra cluster loses a node to a **kernel panic** (the operating system itself crashes). **Coordinators** (the nodes that forward client requests to replicas) keep sending it reads and writes; each one waits for a timeout, latency climbs, and the client retries make it worse.

The cluster needs to learn, within seconds, "node 47 is down: stop routing to it, store **hints** (writes saved for it to replay later) for it, and replace it if it does not come back".

Every node needs the same answer, without a central server that would itself be a single point of failure.

Three separate jobs hide in that sentence:

1. **Detect:** decide that node 47 has probably failed.
2. **Disseminate:** tell all other nodes, cheaply.
3. **Agree on membership:** keep a list of members and their states that converges on every node.

### Real-life example 🟢

A Swiggy delivery partner's app sends its location every few seconds. That is a heartbeat.
If the app goes quiet for a minute, Swiggy does not instantly reassign the order: the rider may just be in a lift or a tunnel.
It first marks the rider "maybe offline", tries again, and only reassigns after a longer silence.
Big server clusters do the same with each other: suspect first, confirm later, because silence alone cannot prove someone is gone.

## 2. Mental model 🟢

🟢 **Plain version:** A good failure detector should do two things: notice every crashed node in the end, and not blame healthy nodes. You cannot fully have both quickly. A short timeout catches crashes fast but also blames nodes that just paused for a moment. A long timeout rarely blames wrongly but leaves users waiting on dead nodes.

**Detector properties** (Chandra and Toueg, 1996):

- **Completeness:** every crashed node is eventually suspected by every correct node.
- **Accuracy:** correct nodes are not suspected (or, in the weaker form, eventually not suspected).

You cannot have perfect accuracy and fast completeness at the same time on an **asynchronous network** (one with no upper limit on message delay). A short timeout catches crashes quickly and flags healthy nodes during a **GC pause** (the program freezing while its memory cleaner runs); a long one is accurate and slow.

**Analogy.** Rumours in an office. You do not phone all 300 colleagues when you hear news; you tell 3 people you happen to meet, each of them tells 3 more, and within a lunch break everyone knows. Before you declare that Sam has left the company because Sam missed a meeting, you ask two other people to check on Sam, and if Sam hears the rumour, Sam can say "I'm still here".

## Common beginner mistakes 🟢

- **Every node heartbeats every other node** → 1,000 nodes means about a million messages per interval → use gossip or SWIM, where each node talks to only a few peers.
- **One central monitor that watches everyone** → if it dies, nobody knows who is alive → spread detection across the nodes, or back it with a highly available store.
- **Declaring a node dead after one missed heartbeat** → a short GC pause or a dropped packet triggers needless failovers → suspect first, ask others to check, then confirm.
- **Acting as leader because "the old leader seems dead"** → it may be alive behind a network break, giving two leaders → use a lease or consensus plus fencing.
- **Relying on gossip alone to fix data** → gossip spreads membership news, not every missed write → run regular anti-entropy repair.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that a detector can only suspect, never know, and that gossip spreads news by each node telling a few others. **Next we open the box**: plain heartbeats, the phi accrual suspicion score, the SWIM protocol, member states and how fast gossip really spreads. Each subsection starts with a short walk-through.

### Heartbeats and timeouts

**In plain words:** expect a heartbeat every T seconds; if you hear nothing for a few T, suspect the node.

**Step by step:**
1. Node A sends B a heartbeat every 1 second (T = 1 s).
2. B notes the time of each heartbeat it receives.
3. A pauses for 4 seconds. B hears nothing.
4. B's rule is "suspect after 3 missed beats" (k = 3), so at 3 s of silence B marks A suspect.
5. A wakes up and sends a heartbeat at 4 s. B clears the suspicion. A was never dead: this was a false positive.

The basic detector: node B expects a heartbeat from A every `T` seconds and suspects A after `k × T` of silence. All-to-all heartbeats cost `N²` messages per period; heartbeating to a central monitor costs `N` but creates a single point of failure. Gossip and SWIM keep the per-node cost constant.

```mermaid
flowchart LR
    AA["All talk to all: N x N messages"] --> X["Too many in big clusters"]
    CM["All talk to one monitor: N messages"] --> Y["Monitor is one point of failure"]
    G["Gossip and SWIM"] --> Z["Small, fixed cost per node"]
```

### Phi accrual

**In plain words:** instead of yes or no, give a suspicion score that grows with silence, based on how regular the heartbeats normally are.

**Step by step:**
1. B keeps the last few gaps between A's heartbeats: about 1 s each.
2. 1 s of silence is normal, so the score (phi) is low, about 0.4.
3. After 5 s of silence the score is about 2: unusual, but A is probably still alive.
4. After 19 s the score passes 8. The chance A is just late is tiny, so B convicts A.
5. Node C usually sends every 3 s. The same 5 s of silence gives C a much lower score, because that is closer to C's normal rhythm.

Instead of answering "dead or alive", the phi accrual detector (Hayashibara et al., 2004) outputs a suspicion level:

`phi = -log10( P(the next heartbeat arrives later than now) )`

It learns the distribution of recent heartbeat gaps from a **sliding window** (only the most recent gaps are kept; older ones are forgotten). If heartbeats usually arrive every 1 s and it has been 1 s, phi is low; after 18 s, phi is high.

The application picks a threshold: Cassandra convicts a node when phi exceeds `phi_convict_threshold`, default 8.

Because the model adapts to each node's normal rhythm, a node on a jittery link is not convicted for jitter it always has.

With exponentially distributed gaps (a simple statistical model of random waiting times; Cassandra's approximation), `phi = elapsed / (mean × ln 10)`. For a 1 s mean gap:

| Silence | phi | Chance the node is alive and just late |
| --- | --- | --- |
| 1 s | 0.43 | about 37% |
| 5 s | 2.17 | about 0.7% |
| 18 s | 7.82 | about 1.5 in 10⁸ |
| 19 s | 8.25 | about 5.6 in 10⁹, convict at threshold 8 |

### SWIM

**In plain words:** each round, ping one random node. If it does not answer, ask a few others to ping it too before you suspect it.

SWIM (2002) separates detection from dissemination and keeps both at constant cost per node.

```mermaid
sequenceDiagram
    participant A as Node A (prober)
    participant B as Node B (target)
    participant C as Node C
    participant D as Node D
    Note over A: protocol period starts, A picks B at random
    A->>B: ping
    Note over A: no ack within the probe timeout (500 ms)
    A->>C: ping-req(B)
    A->>D: ping-req(B)
    C->>B: ping
    D->>B: ping
    Note over B: B is really down, no acks
    Note over A: no indirect ack by end of period
    A->>A: mark B Suspect (incarnation 5)
    A-->>C: gossip "B suspect@5" piggybacked on next messages
    A-->>D: gossip "B suspect@5"
    Note over A,D: if nobody hears "B alive@6" before the suspicion timeout, B is marked Dead
```

1. **Probe:** every protocol period (memberlist, HashiCorp's Go SWIM library, uses a LAN default of 1 s), each node pings one random member.
2. **Indirect probe:** if no ack arrives within the probe timeout (500 ms), it asks `k` other members (3 by default) to ping the target on its behalf. This filters out a bad link between just two nodes.
3. **Suspect:** still no ack → mark the target **Suspect**, not Dead, and gossip that.
4. **Refute:** the suspected node, on hearing the rumour, increments its **incarnation number** and gossips "Alive" with the higher incarnation. Only the node itself may raise its incarnation.
5. **Confirm:** if the suspicion timeout passes without a refutation, the member is marked **Dead** and removed.
6. **Disseminate:** membership updates ride **piggybacked** (attached for free) on ping and ack messages (infection style), so there are no extra messages.

### Member states

**In plain words:** a node moves from alive to suspect to dead, and a suspect can clear its name by saying "I'm alive" with a newer number.

**Step by step:**
1. B joins the cluster as "Alive, incarnation 0". Over time it is at incarnation 5.
2. A cannot reach B and spreads "B suspect@5".
3. B hears this rumour about itself. It raises its own number and spreads "B alive@6".
4. Every node compares: 6 is higher than 5, so "alive@6" wins and B is cleared.
5. If B were really down, nobody would hear "alive@6", and after the suspicion timeout B becomes Dead.

```mermaid
stateDiagram-v2
    [*] --> Alive: join (incarnation 0)
    Alive --> Suspect: direct and indirect probes fail
    Suspect --> Alive: node refutes with a higher incarnation
    Suspect --> Dead: suspicion timeout expires
    Alive --> Dead: graceful leave message
    Dead --> [*]: removed from the member list
```

The merge rule that makes every node converge: Dead is final in this simplified model (a dead node rejoins as a new member); otherwise a higher incarnation wins, and at the same incarnation Dead beats Suspect beats Alive. So "Suspect@5" overrides "Alive@5", and only "Alive@6", sent by the node itself, clears it.

### Gossip dissemination

**In plain words:** each node passes news to a few random nodes each round, so the number who know roughly triples each round.

**Step by step:**
1. Node A learns "C has left". It tells 3 random nodes (fanout 3).
2. Next round, those 4 nodes each tell 3 random nodes: about 16 now know.
3. Next round about 64, then about 250, then about 1,000.
4. Near the end, most picks hit nodes that already know, so the last few take a couple of extra rounds.
5. For 10,000 nodes, this takes about 10 rounds: about 2 seconds at one round every 200 ms.

Each round, each node that knows an update sends it to `f` random peers (the **fanout**). The number of informed nodes roughly multiplies each round, then a tail of rounds catches the last few nodes.

**Measured:** a push-gossip simulation in Go 1.24, 100 seeded runs per row, counting rounds until every node knows an update started at one node.

| Nodes | Fanout 1: average (worst) rounds | Fanout 3: average (worst) rounds |
| --- | --- | --- |
| 100 | 12.5 (19) | 5.8 (8) |
| 1,000 | 18.2 (22) | 8.2 (9) |
| 10,000 | 23.6 (29) | 10.5 (12) |

Going from 1,000 to 10,000 nodes adds only about 2 rounds at fanout 3: logarithmic growth. With memberlist's 200 ms gossip interval, 9 rounds is under 2 seconds.

```mermaid
flowchart LR
    R0["Round 0: 1 knows"] --> R1["Round 1: about 4"]
    R1 --> R2["Round 2: about 16"]
    R2 --> R3["... about 10 rounds: 10,000 know"]
```

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** the suspicion formula and the SWIM rules, short enough to draw in an interview.

```text
phi detector:
    on heartbeat(now): window.push(now - last); last = now
    phi(now) = (now - last) / (mean(window) * ln 10)
    suspect if phi > 8

membership merge(current, incoming):
    if current is Dead: keep current
    if incoming.inc > current.inc: take incoming
    if same inc and rank(incoming) > rank(current): take incoming   # Alive < Suspect < Dead
    else keep current

on hearing "me Suspect@inc": broadcast "me Alive@(inc+1)"
```

### Go: phi accrual detector and SWIM merge rules

**In plain words:** working code for the suspicion score and for merging member lists, with time passed in so tests are exact.

Time is passed in by the caller, so tests are deterministic. It passes `go vet` and `go test -race` on Go 1.24.

```go
package failure

import (
	"math"
	"time"
)

// PhiDetector is a phi-accrual failure detector. Instead of a yes/no answer
// it reports phi = -log10(P(a heartbeat this late)). Inter-arrival times are
// modelled as exponential (as Cassandra does), so phi = elapsed / (mean * ln 10).
type PhiDetector struct {
	window  []time.Duration // recent heartbeat gaps
	size    int
	last    time.Time
	hasLast bool
}

func NewPhiDetector(windowSize int) *PhiDetector { return &PhiDetector{size: windowSize} }

// Heartbeat records a heartbeat that arrived at now.
func (d *PhiDetector) Heartbeat(now time.Time) {
	if d.hasLast {
		d.window = append(d.window, now.Sub(d.last))
		if len(d.window) > d.size {
			d.window = d.window[1:]
		}
	}
	d.last, d.hasLast = now, true
}

// Phi returns the suspicion level at now. 1 means about a 10% chance the
// node is alive and merely slow, 2 means 1%, 8 means 0.000001%.
func (d *PhiDetector) Phi(now time.Time) float64 {
	if len(d.window) == 0 {
		return 0
	}
	var sum time.Duration
	for _, g := range d.window {
		sum += g
	}
	mean := sum.Seconds() / float64(len(d.window))
	elapsed := now.Sub(d.last).Seconds()
	return elapsed / (mean * math.Ln10)
}

// Status of a member in a SWIM-style membership list.
type Status int

const (
	Alive Status = iota
	Suspect
	Dead
)

// Member is what gossip carries about one node. Incarnation is a counter only
// the node itself increments, to refute suspicion about itself.
type Member struct {
	Status      Status
	Incarnation uint64
}

// Merge decides whether gossip about a node overrides what we know.
// Higher incarnation wins; at equal incarnation Dead > Suspect > Alive.
// So "Suspect@5" beats "Alive@5", and the node refutes it with "Alive@6".
func Merge(current, incoming Member) Member {
	if current.Status == Dead {
		return current // dead is final; the node must rejoin with a new identity
	}
	if incoming.Incarnation > current.Incarnation {
		return incoming
	}
	if incoming.Incarnation == current.Incarnation && incoming.Status > current.Status {
		return incoming
	}
	return current
}

// Refute is what a node does when it hears it is suspected.
func Refute(self Member, rumour Member) Member {
	if rumour.Status != Alive && rumour.Incarnation >= self.Incarnation {
		return Member{Status: Alive, Incarnation: rumour.Incarnation + 1}
	}
	return self
}
```

The tests check the phi values in the table, that the same silence is alarming for a 1 s sender but routine for a 3 s sender, that the sliding window forgets old gaps, and every merge and refutation rule.

```go
package failure

import (
	"math"
	"testing"
	"time"
)

func TestPhiGrowsWithSilence(t *testing.T) {
	d := NewPhiDetector(100)
	start := time.Unix(0, 0)
	now := start
	for i := 0; i < 10; i++ { // steady 1s heartbeats
		d.Heartbeat(now)
		now = now.Add(time.Second)
	}
	last := now.Add(-time.Second)
	cases := []struct {
		after time.Duration
		want  float64
	}{
		{1 * time.Second, 1 / math.Ln10},   // 0.43: perfectly normal
		{5 * time.Second, 5 / math.Ln10},   // 2.17
		{18 * time.Second, 18 / math.Ln10}, // 7.82: just under 8
		{19 * time.Second, 19 / math.Ln10}, // 8.25: convict at threshold 8
	}
	for _, c := range cases {
		got := d.Phi(last.Add(c.after))
		if math.Abs(got-c.want) > 1e-9 {
			t.Fatalf("phi after %v = %.4f, want %.4f", c.after, got, c.want)
		}
	}
}

func TestPhiAdaptsToSlowerHeartbeats(t *testing.T) {
	fast, slow := NewPhiDetector(100), NewPhiDetector(100)
	t0 := time.Unix(0, 0)
	for i := 0; i <= 10; i++ {
		fast.Heartbeat(t0.Add(time.Duration(i) * time.Second))
		slow.Heartbeat(t0.Add(time.Duration(i) * 3 * time.Second))
	}
	// The same 6s of silence is alarming for a 1s sender and routine for a 3s one.
	pf := fast.Phi(t0.Add(10*time.Second + 6*time.Second))
	ps := slow.Phi(t0.Add(30*time.Second + 6*time.Second))
	if !(pf > 2.5 && ps < 1) {
		t.Fatalf("phi fast=%.2f slow=%.2f", pf, ps)
	}
}

func TestWindowDropsOldGaps(t *testing.T) {
	d := NewPhiDetector(3)
	t0 := time.Unix(0, 0)
	for _, s := range []int{0, 10, 20, 21, 22, 23} { // gaps 10,10,1,1,1
		d.Heartbeat(t0.Add(time.Duration(s) * time.Second))
	}
	got := d.Phi(t0.Add(24 * time.Second)) // mean of last 3 gaps = 1s
	if math.Abs(got-1/math.Ln10) > 1e-9 {
		t.Fatalf("phi = %.4f, want %.4f", got, 1/math.Ln10)
	}
}

func TestMergeRules(t *testing.T) {
	cases := []struct {
		name          string
		cur, in, want Member
	}{
		{"suspect beats alive at same incarnation", Member{Alive, 5}, Member{Suspect, 5}, Member{Suspect, 5}},
		{"alive at same incarnation does not clear suspicion", Member{Suspect, 5}, Member{Alive, 5}, Member{Suspect, 5}},
		{"refutation with higher incarnation clears it", Member{Suspect, 5}, Member{Alive, 6}, Member{Alive, 6}},
		{"old rumour is ignored", Member{Alive, 6}, Member{Suspect, 5}, Member{Alive, 6}},
		{"dead is final", Member{Dead, 5}, Member{Alive, 9}, Member{Dead, 5}},
		{"dead beats suspect", Member{Suspect, 5}, Member{Dead, 5}, Member{Dead, 5}},
	}
	for _, c := range cases {
		if got := Merge(c.cur, c.in); got != c.want {
			t.Errorf("%s: got %+v, want %+v", c.name, got, c.want)
		}
	}
}

func TestRefute(t *testing.T) {
	self := Member{Alive, 5}
	got := Refute(self, Member{Suspect, 5})
	if got != (Member{Alive, 6}) {
		t.Fatalf("got %+v, want Alive@6", got)
	}
	// Everyone else accepts the refutation.
	if m := Merge(Member{Suspect, 5}, got); m != got {
		t.Fatalf("peer kept %+v", m)
	}
}
```

## 5. Variants and comparison 🟡

| Technique | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Fixed-timeout heartbeat | Suspect after `k` missed intervals | Small clusters, a leader watching followers (Raft heartbeats) | One number to tune for every network condition |
| Central monitor | Every node heartbeats a coordinator or registers a lease in etcd/ZooKeeper | You already run a coordination service; you need one authoritative view | Coordinator load grows with `N`; it must itself be highly available |
| All-to-all heartbeats | Every node pings every node | Very small groups only | `N²` messages per interval |
| Phi accrual | Suspicion level from the observed gap distribution | Varied or jittery networks (Cassandra, Akka Cluster) | Window per peer; still needs a threshold |
| SWIM | Random probe + indirect probes + suspicion + incarnation; piggybacked gossip | Large clusters needing membership without a coordinator | Weakly consistent: nodes may briefly disagree |
| SWIM + Lifeguard (memberlist) | Nodes that notice they are slow (missed acks) widen their own timeouts; suspicion timeouts shrink as more peers confirm | Production SWIM | More tuning knobs |
| Anti-entropy (Merkle trees) | Replicas compare hash trees of their data and stream only differing ranges | Repairing data after missed writes (Dynamo, Cassandra repair) | CPU and I/O to build trees; run periodically |

### Failure detection versus things people confuse it with 🟡

| Thing | What it answers | How it differs |
| --- | --- | --- |
| Health check (load balancer, Kubernetes probe) | "Should I send traffic to this server?" | One checker watches many targets; gossip detection is spread across all nodes |
| Consensus membership (Raft, etcd) | "Who are the official voters?" | One agreed answer for a few nodes; gossip gives a fast, possibly briefly different answer for thousands |
| Leader election | "Who is in charge now?" | Needs agreement and fencing; a detector only gives the hint that the old leader may be gone |

## 6. Trade-offs and when not to use 🟡

- **Speed vs false positives.** Lower thresholds detect crashes faster and cause more flapping during GC pauses, CPU starvation or packet loss. False suspicion is not free: it triggers re-replication, hinted handoff or failover.
- **A detector is advice, not truth.** Never use "I think the leader is dead" as the only reason to start acting as leader. Pair detection with a lease (a time-limited right to act) or a consensus decision and **fencing** (rejecting commands from an old leader) (see [[Leader Election]]).
- **Gossip is eventually consistent.** Two nodes may disagree about membership for a few rounds. That is fine for routing and monitoring and wrong for anything needing a single authoritative decision, such as which node owns a lock.
- **Small, fixed clusters do not need SWIM.** Three to five nodes behind a consensus protocol already have heartbeats in Raft; a Kubernetes deployment already has kubelet (the agent on each Kubernetes machine) health checks and the node lifecycle controller.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how heartbeats, phi accrual and SWIM decide who is suspect, how incarnation numbers let a node clear its name, and how gossip reaches everyone in about log N rounds. **Next comes the advanced part**: how Cassandra, Consul, Dynamo, Akka and Redis Cluster use this, the failure modes (flapping, asymmetric partitions, zombies), and the tuning formulas behind memberlist.

- **Real systems:**
	- **Cassandra:** each node gossips every second with up to three other nodes, exchanging heartbeat generations and versions per endpoint; phi accrual (threshold 8) marks peers down; Merkle-tree repair (`nodetool repair`) fixes data divergence (see [[Wide-Column Stores and Cassandra]]).
	- **Consul and Nomad:** Serf, built on hashicorp/memberlist (SWIM + Lifeguard), runs a LAN gossip pool per datacenter (nodes on the same local network) and a WAN pool (across the wide-area network between sites) between server nodes. Raft among the servers holds the authoritative catalog (see [[Consensus - Raft and Paxos]]).
	- **Dynamo (2007):** gossip for membership and ring ownership, hinted handoff for temporary failures, Merkle trees for anti-entropy (see [[Quorums and Leaderless Replication]] and [[Consistent Hashing]]).
	- **Akka Cluster:** gossip membership plus a phi accrual detector.
	- **Redis Cluster:** nodes exchange ping/pong over a cluster bus (a separate port just for node-to-node talk); a master is marked failing when a majority of masters report it unreachable within a validity window of twice the node timeout.
- **Failure modes → fixes:**
	- Flapping during GC pauses or CPU saturation → raise the phi threshold or suspicion multiplier; Lifeguard-style local health awareness; fix the pauses.
	- **Asymmetric partition** (A can reach B but not the reverse) → indirect probes through other nodes; require several independent suspicions.
	- Zombie node rejoins with stale state → incarnation numbers or generation (Cassandra uses a generation number set at process start), so old state loses the merge.
	- Gossip storm after a mass restart → rate-limit gossip, cap message size, stagger restarts.
	- Membership disagreement causes mis-routing → clients retry on another replica; data placement tolerates it through replication and hinted handoff.
- **What to monitor:** suspicion and conviction events per node, flaps (alive → suspect → alive), probe round-trip time, gossip message rate and size, time for a membership change to reach all nodes, repair backlog and the bytes it streams.

## 8. Deep dive 🔴

- **Why indirect probes matter.** Without them, one bad network link (or one overloaded prober) convicts healthy nodes. Asking `k` random members to probe means the target is suspected only if it is unreachable from `k + 1` vantage points.
- **Suspicion timeout scales with cluster size.** memberlist computes a minimum suspicion timeout of `SuspicionMult × max(1, log10(N)) × ProbeInterval` (4 s for up to 10 nodes on LAN defaults), so bigger clusters wait longer, giving the refutation time to spread. With Lifeguard the timer starts at `SuspicionMaxTimeoutMult` (6) times that minimum and shrinks toward the minimum as independent confirmations arrive.
- **Infection-style dissemination with retransmit limits.** Each update is piggybacked a limited number of times (`RetransmitMult × ⌈log10(N+1)⌉` times in memberlist), which is enough for every node to hear it with high probability without sending it forever.
- **Push, pull and push-pull gossip.** Push spreads fast while few nodes know the news; pull finishes faster when most nodes already know it; push-pull combines both. Periodic full-state push-pull syncs (memberlist does one every 30 s on LAN) catch anything piggybacking missed.
- **Merkle-tree anti-entropy.** Each replica builds a hash tree over its key ranges: leaves hash small ranges, parents hash their children. Two replicas compare roots; if equal, they are in sync; otherwise they descend only into differing branches. For a 1 TB range with a few differing keys, they exchange a few kilobytes of hashes instead of scanning everything. Cassandra builds these during repair, which is I/O-heavy, so repairs are scheduled (incremental repair limits work to unrepaired data).
- **Membership vs consensus.** Gossip membership is weakly consistent and scales to thousands; consensus membership is strongly consistent and stays small (3–7 voters). Systems combine them: Consul gossips health among thousands of agents but keeps the catalog in Raft on a few servers.

## 9. Interview questions 🔴

> [!question]- Why can't a failure detector be perfect?
> On an asynchronous network a crashed node and a slow node look the same: both are silent. Any detector either waits long (accurate, slow) or suspects early (fast, false positives). Systems treat detection as a hint and rely on leases, quorums and fencing for safety.

> [!question]- What does phi accrual improve over a fixed timeout?
> It outputs a suspicion level from the observed distribution of heartbeat gaps, so it adapts to each node's normal rhythm and jitter. You tune one threshold (Cassandra: 8) that means roughly the same probability of a mistake on any network.

> [!question]- Walk through SWIM.
> Each period a node pings one random member. No ack → ask `k` others to ping it. Still nothing → mark it Suspect and gossip that; the node can refute by gossiping Alive with a higher incarnation. If not refuted in time, it is Dead. Updates piggyback on pings, so load per node is constant.

> [!question]- How fast does gossip spread, and why?
> In about `log N` rounds: the number of informed nodes multiplies each round. Measured in a seeded simulation with fanout 3: about 8 rounds for 1,000 nodes and 10.5 for 10,000.

> [!question]- Trap: "Gossip tells us node 47 is dead, so we can promote its replica to leader."
> Gossip is eventually consistent and detection is a guess: node 47 may be alive behind a partition, and other nodes may disagree. Promotion needs an authoritative decision (consensus or a lease) and fencing, or you risk two leaders.

> [!question]- What is Merkle-tree anti-entropy for?
> Repairing replicas that missed writes (a node was down beyond hint retention, or hints were lost). Replicas compare hash trees top-down and stream only differing ranges, so the cost is proportional to the difference, not the data size.

## 10. Cheat sheet 🟢

- Crashed and slow look the same; detection is always a trade-off between speed and false alarms.
- Phi accrual: `phi = -log10(P(late))`; Cassandra convicts at phi > 8.
- SWIM: random ping → `k` indirect pings → Suspect → refute with higher incarnation, or Dead.
- Merge: higher incarnation wins; same incarnation, Dead > Suspect > Alive.
- Gossip spreads in `O(log N)` rounds; measured 8 rounds for 1,000 nodes at fanout 3.
- memberlist LAN: probe 1 s, timeout 500 ms, 3 indirect checks, gossip every 200 ms to 3 nodes.
- Merkle trees repair data that writes and hinted handoff missed.
- Detection is a hint; leadership needs consensus and fencing.

## Self-check 🟢🟡

🟢 Easy

> [!question]- Why can a failure detector only "suspect"?
> A slow node and a dead node are both silent, so silence alone never proves a crash.

> [!question]- What is gossip?
> Each node repeatedly tells a few random peers what it knows, so news spreads like a rumour.

> [!question]- Why not have every node heartbeat every other node?
> It needs N × N messages: about a million per interval for 1,000 nodes.

🟡 Medium

> [!question]- In SWIM, why ask other nodes to ping the target before suspecting it?
> A single bad link or a busy prober could make a healthy node look dead; indirect pings check from several places.

> [!question]- B is "suspect@5". How does B clear its name?
> It gossips "alive@6". Only B may raise its own incarnation, and the higher number wins the merge.

> [!question]- Heartbeats usually come every 1 s. Is 5 s of silence enough to convict at phi threshold 8?
> No. 5 s gives phi of about 2; it takes about 19 s of silence to pass 8.

## Links

- **Before this:** [[Distributed Systems Fundamentals]], [[Timeouts, Retries and Backoff]], [[Quorums and Leaderless Replication]]
- **Next:** [[Leader Election]], [[CRDTs and Conflict Resolution]]
- **Compare with:** [[Consensus - Raft and Paxos]] (strongly consistent membership for a few voters), [[Wide-Column Stores and Cassandra]] (gossip and repair in a real database)

### Watch on YouTube

- [Jinal Parikh – Are you Dead or Alive? Using Gossip for Failure Detection / Øredev 2022](https://www.youtube.com/watch?v=wJPRtGfbPLE) · Øredev Conference · 42 min · 370 views
- [System Design / Design Key Value Store /  Pt8 / Failure Detection / Gossip Protocol](https://www.youtube.com/watch?v=4oLHS4eBo_M) · Software Interviews Prep · 11 min · 433 views
