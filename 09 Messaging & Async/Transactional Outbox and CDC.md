---
tags: [messaging, outbox, cdc, postgres, kafka]
level: advanced
status: reviewed
prereqs: ["[[Transactions and ACID]]", "[[Queues vs Streams and Broker Comparison]]", "[[Delivery Semantics and Exactly-Once]]"]
related: ["[[Kafka and Event Streaming]]", "[[Message Ordering and Partition Keys]]", "[[Idempotency and Idempotency Keys]]", "[[Event Sourcing]]", "[[Saga Pattern]]", "[[Replication]]", "[[Storage Engines - B-tree vs LSM and WAL]]"]
sources:
  - "Chris Richardson, microservices.io: Pattern - Transactional outbox; Pattern - Transaction log tailing"
  - "Debezium documentation: PostgreSQL connector; Outbox Event Router SMT"
  - "PostgreSQL 17 docs: Logical Decoding, Replication Slots, SELECT ... FOR UPDATE SKIP LOCKED, max_slot_wal_keep_size, pg_replication_slots"
  - "Kafka documentation: transactions and exactly-once semantics"
updated: 2026-11-13
---

# Transactional Outbox and CDC

> [!summary] TL;DR
> A service often must do two things for one request: save a row in its database and publish an event to a broker (a message system such as Kafka or RabbitMQ). The **transactional outbox** writes the event into an `outbox` table in the *same database transaction* as the business row, and a separate **relay** later copies it to the broker. **CDC** (change data capture) is one way to build that relay: it reads the database's write-ahead log instead of polling the table.

> [!abstract] Core idea
> - You cannot commit to PostgreSQL and Kafka atomically, so never try: commit only to the database.
> - The event row and the business row share one local transaction, so both exist or neither does.
> - A relay (a polling loop, or Debezium reading the WAL) publishes outbox rows afterwards, so delivery is **at-least-once**.
> - Consumers must therefore be idempotent, and per-entity order holds only if the relay keeps it.
> - Classic mistake: "publish after commit" in the request handler. A crash between the two loses the event forever.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (write path, outbox table, relay designs), 4 (worked example) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Transactions and ACID]]: writes inside one transaction all happen or none do, even if the process crashes.
> - [[Queues vs Streams and Broker Comparison]]: a broker such as Kafka carries messages from one service to others.
> - [[Delivery Semantics and Exactly-Once]]: messages can arrive twice, so consumers must skip duplicates by id.

**From zero, in 60 seconds** 🟢

When an order is placed, you must do two things: save it in the database, and tell other services.
These are two separate systems, so a crash between them leaves them out of sync.
Save first and crash: the order exists but nobody hears about it.
Tell first and crash: others act on an order that was never saved.
The fix: save the order and the message in the same database step, in a table called the **outbox**.
A small helper program, the **relay**, reads the outbox and sends the messages to the broker.
Reading the database's own change log instead of the table is called **CDC** (change data capture).

```mermaid
flowchart LR
    A["Save order"] --> X["crash"] --> B["Never sent:<br/>nobody knows"]
```

```mermaid
flowchart LR
    A["One DB step:<br/>order + outbox row"] --> R["Relay reads outbox"]
    R --> K[("Broker")]
    K --> C["Billing, email, search"]
```

The rest of this note is just these 3 questions:
1. What goes in the outbox, and why in the same transaction?
2. Should the relay poll the table or read the database log?
3. How do you deal with the duplicates the relay will sometimes send?


**The problem in one story**
You order a pizza online. The shop saves your order in its database.
It must also tell the kitchen and send you a receipt email.
If the shop's computer restarts right after saving, the kitchen may never hear about your order.
You paid, but no pizza and no email.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Transaction | A group of database writes that all happen or none happen | `BEGIN; INSERT ...; INSERT ...; COMMIT;` |
| Commit | The moment the database makes the writes permanent | `COMMIT` returns OK |
| Broker | A message system services use to send events to each other | Kafka, RabbitMQ |
| Event | A message saying something happened | `OrderPlaced {id: o-1}` |
| Relay | A background process that copies saved events to the broker | A loop running every 100 ms |
| WAL | The database's append-only log of every change | PostgreSQL's `pg_wal` files |
| CDC | Change data capture: reading the WAL to see every change | Debezium streaming new rows |
| Idempotent consumer | A receiver that handles the same message twice safely | Skip event id 1 if already seen |
| Dual write | Writing to two systems (database and broker) with no shared transaction | Commit order, then publish event |
| Aggregate | The one business object an event is about | Order `o-1` |
| Inbox | A consumer-side table of event ids already handled | Insert `event_id`, skip if it exists |
| Debezium | An open-source tool that reads a database's change log and publishes the changes to Kafka | Streams new outbox rows |

**Picture it**

```mermaid
flowchart LR
    A["API"] -->|"one transaction"| DB[("orders + outbox<br/>tables")]
    DB --> R["relay"]
    R --> K{{"broker"}}
    K --> C["consumer<br/>(dedupes)"]
```

**Analogy**
File the paperwork and drop the letter in the office out-tray in one motion; a clerk posts letters from the tray later.
Where it breaks: a real clerk rarely posts a letter twice, but a relay can, so receivers must spot duplicates.

**How the rest of this note builds up**

- First, the dual-write problem and why both naive orders fail (section 1), plus the out-tray model (section 2).
- Then the mechanics: the outbox table, the polling relay and the CDC relay with Debezium (section 3).
- Then a worked example in Go and PostgreSQL monitoring queries (section 4), and alternatives (section 5).
- Finally the SDE-3 depth: replication-slot failures, the identity-gap trap and per-aggregate ordering (sections 6-8).

> [!tip] Remember
> Commit the event with the data in one transaction, publish it later, and make consumers ignore duplicates.

## 1. Why it exists 🟢

An order service handles `POST /orders`. It must insert the order and publish `OrderPlaced` so that billing, email and search react.

There are only two naive orders of operations, and both break.

| Order | Crash point | Result |
| --- | --- | --- |
| Commit, then publish | Process dies (deploy, OOM kill: the system stopping a process that used too much memory) after `COMMIT`, before `Publish` | The order exists, nobody hears about it. Billing never charges; the customer never gets an email. |
| Publish, then commit | Publish succeeds, then the `INSERT` fails (constraint violation, deadlock, lost connection) | Consumers act on an order that does not exist. Billing charges a phantom order. |

This is the **dual-write problem**: two systems, no shared transaction. Retrying does not fix it, because the process that would retry is the one that crashed.

The numbers are not exotic. Suppose a service does 2,000 orders per second, and deploys, OOM kills and node failures mean that 1 request in 100 million dies exactly in the gap between commit and publish (an illustrative estimate).

That still loses about 1.7 events a day (2,000 × 86,400 × 10⁻⁸ ≈ 1.7), and each lost event is a support ticket and a manual fix.

**Real-life example.** On BookMyShow, when your seats are booked, the booking row is saved and a "booking confirmed" event must reach the ticket-email service and the theatre's system. If the server restarted between those two steps, you could pay and hold seats but never get a ticket email. Writing the booking and the event into the same database transaction, and letting a relay send the event afterwards, means the email may be sent twice in rare cases but is never silently lost.

Distributed transactions (two-phase commit, XA: protocols where a coordinator makes several systems commit together) across PostgreSQL and Kafka are not an option: Kafka does not take part in XA, and 2PC adds a blocking coordinator anyway.

**The dual-write problem, both ways:**

```mermaid
flowchart TB
    subgraph A["Commit, then publish"]
        A1["COMMIT order"] --> A2["crash"] --> A3["Event lost:<br/>billing never charges"]
    end
    subgraph B["Publish, then commit"]
        B1["Publish event"] --> B2["INSERT fails"] --> B3["Phantom order charged"]
    end
```

## 2. Mental model 🟢

Write the letter and drop it into the office **out-tray** in the same motion as filing the paperwork. A mail clerk empties the out-tray later.

If the clerk is sick, letters wait in the tray; they are never lost. If the clerk posts a letter and then forgets to take it out of the tray, it gets posted twice, so the recipient must recognise duplicates.

- **Outbox table:** the out-tray. It lives in the service's own database.
- **Relay:** the clerk. Two designs:
	- **Polling publisher:** a loop that queries the table for unsent rows.
	- **Log tailing (CDC):** a reader of the database's write-ahead log (WAL, the append-only file the database writes every change to before applying it; see [[Storage Engines - B-tree vs LSM and WAL]]). Debezium is the common tool.
- **Idempotent consumer:** the recipient who ignores a letter with a reference number it has already handled (owned by [[Delivery Semantics and Exactly-Once]]).

## Common beginner mistakes 🟢

- **Committing, then publishing to the broker directly** → a crash in between loses the event forever → write the event to the outbox in the same transaction.
- **Assuming the relay sends each event once** → a relay that crashes after publishing but before marking the row sends it again → make every consumer skip duplicates by `event_id`.
- **Tracking "last published id" and querying `id > last`** → ids are handed out before commit, so a slow transaction's row can be skipped forever → query rows where `published_at IS NULL`, or use CDC.
- **Never cleaning the outbox** → millions of sent rows slow the relay and vacuum → delete sent rows in batches, or drop old daily partitions.
- **Leaving a CDC replication slot unwatched** → if the reader stops, the database keeps all its log files and can fill the disk → alert on slot lag and set `max_slot_wal_keep_size`.

**The office out-tray, drawn:**

```mermaid
flowchart LR
    F["File paperwork +<br/>drop letter in out-tray<br/>(one motion)"] --> T[("Out-tray")]
    T --> C["Clerk posts letters later"]
    C -- "forgot to remove one" --> D["Sent twice:<br/>receiver ignores repeats"]
```

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** the dual-write problem and the fix: save the event in an outbox table in the same transaction, and let a relay send it. **Next we open the box**: the exact write path, what the outbox table holds, and the two ways a relay can find new rows.

### The write path

**In plain words:** one transaction writes the order and its message together; the relay sends the message later, so either both happen or neither does.

**Step by step:**
1. `POST /orders` arrives. The service runs `BEGIN`.
2. It inserts the order `o-1` and, in the same transaction, an outbox row `OrderPlaced {order: o-1}`.
3. `COMMIT`. Now both rows exist, or, after a crash, neither does.
4. The relay finds the unsent outbox row, publishes it to Kafka, and waits for the broker's "got it".
5. It marks the row `published_at = now()`. If it crashes before marking, it publishes the row again later.

```mermaid
sequenceDiagram
    participant API as Order API
    participant DB as PostgreSQL
    participant R as Relay
    participant K as Kafka topic orders
    participant C as Billing consumer
    API->>DB: BEGIN
    API->>DB: INSERT INTO orders (...)
    API->>DB: INSERT INTO outbox (aggregate_id, event_type, payload)
    API->>DB: COMMIT (both rows or neither)
    API-->>API: return 201 to the client
    loop every 100 ms, or on each WAL change
        R->>DB: read unsent outbox rows
        R->>K: produce(key = aggregate_id, value = payload)
        K-->>R: ack (acks=all)
        R->>DB: mark rows sent (or advance the WAL position)
    end
    K->>C: deliver OrderPlaced
    C->>C: dedupe on event id, then act
```

Crash analysis:
- Crash before `COMMIT`: neither row exists; the client sees an error and retries (with an idempotency key, see [[Idempotency and Idempotency Keys]]).
- Crash after `COMMIT`: the outbox row is durable; the relay will publish it eventually.
- Relay crashes after the broker ack but before marking the row: the row is published again. This duplicate is the price of the pattern and is why consumers dedupe.

### The outbox table

**In plain words:** a plain table with one row per message to send: who it is about, what kind of event, the payload, and when it was sent.

**Step by step (one row's fields):**
1. `event_id`: a unique id, for example a UUID, that consumers use to spot duplicates.
2. `aggregate_type` and `aggregate_id`: "order" and `o-1`, which decide the topic and the message key.
3. `event_type` and `payload`: `OrderPlaced` and its JSON data.
4. `published_at`: empty until the relay has sent it.

```sql
CREATE TABLE outbox (
    id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id       uuid        NOT NULL DEFAULT gen_random_uuid() UNIQUE, -- what consumers dedupe on
    aggregate_type text        NOT NULL,           -- 'order'  -> topic choice
    aggregate_id   text        NOT NULL,           -- 'o-1001' -> partition key
    event_type     text        NOT NULL,           -- 'OrderPlaced'
    payload        jsonb       NOT NULL,
    headers        jsonb       NOT NULL DEFAULT '{}', -- trace id, schema id, tenant
    created_at     timestamptz NOT NULL DEFAULT now(),
    published_at   timestamptz                     -- NULL = not sent yet
);

-- Only unsent rows are indexed, so the index stays tiny.
CREATE INDEX outbox_unsent ON outbox (id) WHERE published_at IS NULL;
```

`gen_random_uuid()` is built into PostgreSQL since version 13. `event_id` travels with the message (as a header or inside the payload) so that the consumer has a stable key to deduplicate on; see [[Idempotency and Idempotency Keys]].

### Two relay designs

**In plain words:** the relay either asks the table "anything new?" every second, or reads the database's own change log as it is written.

**Step by step:**
1. Polling relay: every 100 ms it asks "give me up to 100 unsent rows, oldest first, skipping rows another relay has locked".
2. It publishes each one, then marks them sent.
3. CDC relay: Debezium instead reads PostgreSQL's change log through a replication slot, a bookmark the database keeps for it.
4. Every committed insert into `outbox` shows up in that log, in commit order, and Debezium turns it into a Kafka record.
5. Polling needs nothing new to run; CDC is faster and keeps commit order, but you must run and watch Debezium.

```mermaid
flowchart LR
    subgraph poll["Polling relay"]
        T1[("outbox table")] -->|"SELECT ... WHERE published_at IS NULL<br/>FOR UPDATE SKIP LOCKED LIMIT 100"| P1["relay process"]
        P1 -->|produce| K1{{"Kafka"}}
        P1 -->|"UPDATE published_at = now()"| T1
    end
    subgraph cdc["Log-tailing relay (CDC)"]
        T2[("outbox table")] -->|INSERT is written to| W["WAL"]
        W -->|"logical replication slot<br/>pgoutput plugin"| D["Debezium connector<br/>+ Outbox Event Router"]
        D -->|produce| K2{{"Kafka"}}
        D -->|"confirm LSN"| W
    end
```

**Polling relay** in PostgreSQL 17:

```sql
BEGIN;
SELECT id, event_id, aggregate_type, aggregate_id, event_type, payload, headers
FROM outbox
WHERE published_at IS NULL
ORDER BY id
LIMIT 100
FOR UPDATE SKIP LOCKED;          -- other relays skip these rows instead of waiting
-- publish each row to the broker, wait for acks
UPDATE outbox SET published_at = now() WHERE id = ANY($1);  -- $1 = ids of the rows just published, bound by the relay code
COMMIT;
```

- `FOR UPDATE SKIP LOCKED` lets several relay processes share the table without blocking each other: each grabs a different batch.
- The row locks are held while publishing, so a relay that dies mid-batch releases them when its connection drops, and another relay picks the batch up.
- To cut latency below the polling interval, the writer can `NOTIFY outbox` in the same transaction and the relay can `LISTEN outbox`; the notification is delivered only on commit.

**Log-tailing relay (CDC):** PostgreSQL **logical decoding** (a feature that reads the WAL and turns it into readable row changes) turns WAL records into row changes.

1. Debezium creates a **logical replication slot** (a server-side bookmark that remembers how far this reader has confirmed) using the built-in `pgoutput` plugin.
2. It streams every `INSERT` into `outbox`.
3. Its **Outbox Event Router** single message transform turns each row into a Kafka record: the topic comes from `aggregatetype` (`outbox.event.order` by default), the key from `aggregateid`, and the value from `payload`.

Debezium's default column names are `id`, `aggregatetype`, `aggregateid`, `type` and `payload`. The snake_case table above therefore needs mapping in the connector config, for example `transforms.outbox.table.field.event.id=event_id`, `table.field.event.key=aggregate_id`, `route.by.field=aggregate_type` and `table.field.event.type=event_type`.

With `route.by.field=aggregate_type` the default topic is still `outbox.event.<value>`, here `outbox.event.order`; `route.topic.replacement` changes it.

With CDC the application can even delete the outbox row in the same transaction right after inserting it: the WAL still holds the insert, so Debezium publishes it, and the table never grows.

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** one order request, step by step: write both rows in one go, then the relay sends and marks the row as sent.

```text
POST /orders {id: o-1, amount: 49900}
  BEGIN
    INSERT orders  (o-1, 49900)
    INSERT outbox  (id=1, aggregate_id=o-1, OrderPlaced)
  COMMIT                         <- the only commit that matters
relay tick 1: fetch [1]  -> publish 1 -> crash before UPDATE
relay tick 2: fetch [1]  -> publish 1 again -> UPDATE published_at
broker now holds: OrderPlaced#1, OrderPlaced#1   (duplicate)
billing consumer: processes #1, sees #1 in its inbox table, skips
outbox lag = rows with published_at IS NULL = 0
```

The rule to remember: **the relay may publish twice, never zero times, and never out of order for one aggregate.**

### Go: a polling relay with an in-memory database

**In plain words:** a Go model of the whole pattern: one atomic write, a relay that keeps order, and tests that crash at the worst moments.

The relay below stops at the first failed publish. That keeps order: if event 2 fails, event 3 must not go out ahead of it. `MemDB` stands in for PostgreSQL; one mutex plays the part of one transaction, so `PlaceOrder` writes both rows atomically.

```go
// Package outbox shows a polling outbox relay with an in-memory database.
package outbox

import (
	"context"
	"errors"
	"sync"
)

// Event is one row of the outbox table.
type Event struct {
	ID          int64
	AggregateID string // also the broker partition key
	EventType   string
	Payload     string
	Published   bool
}

// MemDB stands in for PostgreSQL: one mutex plays the role of one transaction.
type MemDB struct {
	mu     sync.Mutex
	orders map[string]int64 // order id -> amount in paise
	outbox []Event
	nextID int64
	// FailMark makes the next MarkPublished call fail (simulates a crash).
	FailMark bool
}

func NewMemDB() *MemDB { return &MemDB{orders: map[string]int64{}} }

// PlaceOrder writes the business row and the outbox row atomically,
// like INSERT INTO orders ...; INSERT INTO outbox ...; COMMIT.
func (db *MemDB) PlaceOrder(orderID string, amount int64) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.orders[orderID] = amount
	db.nextID++
	db.outbox = append(db.outbox, Event{
		ID: db.nextID, AggregateID: orderID, EventType: "OrderPlaced",
		Payload: orderID,
	})
}

// FetchUnpublished returns up to limit unpublished rows in id order.
func (db *MemDB) FetchUnpublished(_ context.Context, limit int) ([]Event, error) {
	db.mu.Lock()
	defer db.mu.Unlock()
	var out []Event
	for _, e := range db.outbox {
		if !e.Published {
			out = append(out, e)
			if len(out) == limit {
				break
			}
		}
	}
	return out, nil
}

var ErrCrash = errors.New("relay crashed before marking rows")

// MarkPublished flags rows as sent.
func (db *MemDB) MarkPublished(_ context.Context, ids []int64) error {
	db.mu.Lock()
	defer db.mu.Unlock()
	if db.FailMark {
		db.FailMark = false
		return ErrCrash
	}
	set := make(map[int64]bool, len(ids))
	for _, id := range ids {
		set[id] = true
	}
	for i := range db.outbox {
		if set[db.outbox[i].ID] {
			db.outbox[i].Published = true
		}
	}
	return nil
}

// Pending counts unpublished rows (the "outbox lag" metric).
func (db *MemDB) Pending() int {
	db.mu.Lock()
	defer db.mu.Unlock()
	n := 0
	for _, e := range db.outbox {
		if !e.Published {
			n++
		}
	}
	return n
}

// Publisher is the broker client (Kafka, RabbitMQ, SQS ...).
type Publisher interface {
	Publish(ctx context.Context, key string, e Event) error
}

// Relay moves outbox rows to the broker.
type Relay struct {
	DB        *MemDB
	Pub       Publisher
	BatchSize int
}

// RunOnce publishes one batch. It stops at the first failed publish so that
// events of one aggregate never overtake each other, then marks the rows that
// did go out. A crash between Publish and MarkPublished means those rows are
// published again on the next run: delivery is at-least-once.
func (r *Relay) RunOnce(ctx context.Context) (int, error) {
	batch, err := r.DB.FetchUnpublished(ctx, r.BatchSize)
	if err != nil {
		return 0, err
	}
	var sent []int64
	var pubErr error
	for _, e := range batch {
		if pubErr = r.Pub.Publish(ctx, e.AggregateID, e); pubErr != nil {
			break
		}
		sent = append(sent, e.ID)
	}
	if len(sent) > 0 {
		if err := r.DB.MarkPublished(ctx, sent); err != nil {
			return 0, err
		}
	}
	return len(sent), pubErr
}
```

The tests cover the three behaviours that matter: everything gets out in order, a broker failure loses nothing and keeps order, and a crash between publish and mark produces a duplicate.

```go
package outbox

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"testing"
)

// fakeBroker records what it receives and can fail on chosen calls.
type fakeBroker struct {
	mu     sync.Mutex
	got    []Event
	calls  int
	failOn map[int]bool // 1-based call numbers that fail
}

func (b *fakeBroker) Publish(_ context.Context, _ string, e Event) error {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.calls++
	if b.failOn[b.calls] {
		return errors.New("broker unavailable")
	}
	b.got = append(b.got, e)
	return nil
}

func ids(es []Event) []int64 {
	out := make([]int64, len(es))
	for i, e := range es {
		out[i] = e.ID
	}
	return out
}

func TestRelayPublishesAllInOrder(t *testing.T) {
	db := NewMemDB()
	for i := 1; i <= 5; i++ {
		db.PlaceOrder(fmt.Sprintf("o%d", i), int64(i*100))
	}
	b := &fakeBroker{}
	r := &Relay{DB: db, Pub: b, BatchSize: 2}
	ctx := context.Background()
	for db.Pending() > 0 {
		if _, err := r.RunOnce(ctx); err != nil {
			t.Fatal(err)
		}
	}
	if got := fmt.Sprint(ids(b.got)); got != "[1 2 3 4 5]" {
		t.Fatalf("published %s", got)
	}
}

func TestRelayStopsAtFailureWithoutLoss(t *testing.T) {
	db := NewMemDB()
	for i := 1; i <= 3; i++ {
		db.PlaceOrder(fmt.Sprintf("o%d", i), 100)
	}
	b := &fakeBroker{failOn: map[int]bool{2: true}} // 2nd publish fails
	r := &Relay{DB: db, Pub: b, BatchSize: 10}
	n, err := r.RunOnce(context.Background())
	if err == nil || n != 1 {
		t.Fatalf("want 1 sent and an error, got %d, %v", n, err)
	}
	if db.Pending() != 2 {
		t.Fatalf("pending = %d, want 2", db.Pending())
	}
	if _, err := r.RunOnce(context.Background()); err != nil {
		t.Fatal(err)
	}
	if got := fmt.Sprint(ids(b.got)); got != "[1 2 3]" {
		t.Fatalf("order broken: %s", got)
	}
}

func TestCrashBeforeMarkRepublishes(t *testing.T) {
	db := NewMemDB()
	db.PlaceOrder("o1", 100)
	b := &fakeBroker{}
	r := &Relay{DB: db, Pub: b, BatchSize: 10}
	db.FailMark = true
	if _, err := r.RunOnce(context.Background()); !errors.Is(err, ErrCrash) {
		t.Fatalf("want ErrCrash, got %v", err)
	}
	if _, err := r.RunOnce(context.Background()); err != nil {
		t.Fatal(err)
	}
	// The same event id reached the broker twice: consumers must dedupe on it.
	if got := fmt.Sprint(ids(b.got)); got != "[1 1]" {
		t.Fatalf("got %s, want a duplicate of event 1", got)
	}
}

func TestConcurrentWritersAndRelay(t *testing.T) {
	db := NewMemDB()
	b := &fakeBroker{}
	r := &Relay{DB: db, Pub: b, BatchSize: 50}
	var wg sync.WaitGroup
	for w := 0; w < 4; w++ {
		wg.Add(1)
		go func(w int) {
			defer wg.Done()
			for i := 0; i < 250; i++ {
				db.PlaceOrder(fmt.Sprintf("w%d-%d", w, i), 1)
			}
		}(w)
	}
	done := make(chan struct{})
	go func() { wg.Wait(); close(done) }()
	ctx := context.Background()
	for {
		select {
		case <-done:
			for db.Pending() > 0 {
				if _, err := r.RunOnce(ctx); err != nil {
					t.Fatal(err)
				}
			}
			if len(b.got) != 1000 {
				t.Fatalf("published %d, want 1000", len(b.got))
			}
			for i, e := range b.got {
				if e.ID != int64(i+1) {
					t.Fatalf("position %d has id %d", i, e.ID)
				}
			}
			return
		default:
			if _, err := r.RunOnce(ctx); err != nil {
				t.Fatal(err)
			}
		}
	}
}
```

Run with `go vet ./... && go test -race ./...` (Go 1.24): all four tests pass, and the race detector is quiet with four writers and a relay running at once.

### What it looks like in PostgreSQL

**In plain words:** the real SQL to watch: how many messages are waiting, and how old the oldest one is.

Outbox lag, the first number to put on a dashboard (representative output, PostgreSQL 17):

```sql
SELECT count(*)                       AS unsent,
       now() - min(created_at)        AS oldest_unsent_age
FROM outbox
WHERE published_at IS NULL;
```

```text
 unsent | oldest_unsent_age
--------+-------------------
     37 | 00:00:00.412
```

For the CDC relay, the number that matters is how much WAL the slot is holding back (representative output, PostgreSQL 17):

```sql
SELECT slot_name, active,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn)) AS behind
FROM pg_replication_slots
WHERE slot_type = 'logical';
```

```text
  slot_name   | active | behind
--------------+--------+---------
 debezium_ord | t      | 184 kB
```

## 5. Variants and comparison 🟡

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Outbox + polling relay | Relay queries `published_at IS NULL`, publishes, marks | Default for most teams; no extra infrastructure | Polling load and latency (tens to hundreds of ms); table bloat without cleanup |
| Outbox + CDC (Debezium) | Relay reads the WAL through a logical slot | High volume, low latency, or a platform team already runs Kafka Connect (the framework that runs connectors like Debezium) | Kafka Connect cluster to operate; slot retention risk; schema of WAL events |
| CDC on business tables (no outbox) | Debezium streams `orders` row changes directly | Feeding a search index, cache or warehouse with table state | Leaks your internal schema as the public contract; no event intent ("why did it change?") |
| Listen to yourself | Publish only; the service consumes its own event to update its DB | Writes that can tolerate being asynchronous | The API cannot read its own write immediately; more moving parts |
| Event sourcing | The event log *is* the state; no separate business row | Domains needing a full audit history | Big model change; see [[Event Sourcing]] |
| Kafka transactions | Atomic writes across Kafka partitions and offsets | Consume-transform-produce entirely inside Kafka | Does not include your database; useless for the DB + Kafka dual write |

> [!warning] Interview trap
> "Use Kafka transactions" does not solve the dual write. Kafka transactions make a set of Kafka writes (and consumer offset commits) atomic. PostgreSQL is not part of that transaction, so the order row and the event can still disagree.

## 6. Trade-offs and when not to use 🟡

- **Duplicates are guaranteed to happen eventually.** Every consumer needs an inbox table or another idempotency check. If a consumer cannot be made idempotent, the outbox alone is not enough.
- **Latency.** Polling adds up to one interval of delay. CDC is usually lower but has its own batching. Neither suits a response the caller must wait for; use a synchronous call there.
- **Write amplification.** Every business write also writes an outbox row, its index entry and WAL. On a hot table this is measurable; measure before and after.
- **Operational weight of CDC.** Kafka Connect, connector configs, slot monitoring and PostgreSQL upgrades that must keep slots working.
- **When not to use it:**
	- The event is pure telemetry where losing a few is acceptable: publish directly, fire-and-forget.
	- There is no database write at all: there is nothing to make atomic.
	- The consumer is in the same database: just write to its table in the same transaction.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** the outbox write path, the table, the polling and CDC relays, and a tested Go relay that keeps order. **Next is the advanced part**: real CDC tools, slot and failover pitfalls, what to monitor, and the subtle identity-gap and ordering traps.

- **Real systems:**
	- Debezium's PostgreSQL and MySQL connectors with the Outbox Event Router are the common open-source CDC relay.
	- Managed CDC services exist on the major clouds (for example AWS DMS can stream changes into Kinesis or Kafka).
	- Job libraries backed by PostgreSQL (for example River for Go) offer "insert the job in the same transaction", which is the outbox idea applied to background jobs; see [[Background Jobs and Worker Pools]].
- **Failure modes → fixes:**
	- *Idle replication slot fills the disk.* A logical slot keeps every WAL segment the reader has not confirmed. If Debezium is down for a weekend, WAL piles up until the primary runs out of disk.
		- Fix: alert on slot lag, set `max_slot_wal_keep_size` (PostgreSQL 13+) so PostgreSQL invalidates the slot instead of dying, and enable Debezium heartbeats so a slot on a quiet database still advances.
	- *Failover loses the slot.* Before PostgreSQL 17, logical slots existed only on the primary, so a failover forced a fresh snapshot.
		- PostgreSQL 17 can synchronise logical slots to a physical standby (a replica that copies the database's raw log, ready to take over): the slot must be created with `failover = true`, the standby needs `sync_replication_slots = on` together with `hot_standby_feedback = on` and a `primary_slot_name`, and the primary should list that standby's physical slot in `synchronized_standby_slots` so the logical reader never gets ahead of it.
		- The CDC tool must also create the slot with the failover flag (recent Debezium versions expose this as `slot.failover`).
	- *Relay stuck on one poison row* (payload the broker rejects, e.g. too large). The whole outbox stalls behind it. Fix: after N failures, move the row to a parked state and alert; see [[Dead Letter Queues and Poison Messages]].
	- *Outbox table bloat.* Millions of sent rows slow the scan and vacuum. Fix: delete sent rows in small batches, or partition the table by day and drop old partitions.
	- *Order broken by parallel relays.* Two relays each grab a batch and publish concurrently, so `o-1:Paid` may land before `o-1:Placed`. Fix below in the deep dive.
- **What to monitor:**
	- Unsent row count and oldest unsent age (alert at, say, 30 s; pick from your SLO, the service-level objective: the target you promise, such as "events out within 30 s").
	- Relay publish error rate and retries.
	- For CDC: slot lag in bytes (`pg_wal_lsn_diff`), whether the slot is `active`, and connector status.
	- Consumer dedupe hits: a sudden rise means the relay is replaying.

## 8. Deep dive 🔴

- **The identity-gap trap.** A relay that remembers "last published id = 500" and then queries `WHERE id > 500` can skip events. Identity values are handed out at `INSERT` time, but transactions commit in a different order:
	1. Transaction A takes id 501.
	2. Transaction B takes id 502 and commits first.
	3. The relay publishes 502 and moves its mark past 501.
	4. A commits, and 501 is never seen.
	- Querying on `published_at IS NULL` (a per-row flag) avoids this. CDC avoids it too, because the WAL is in commit order.
- **Keeping per-aggregate order with several relays.** `SKIP LOCKED` spreads rows across relays with no regard to the aggregate. Options:
	- Run one active relay (leader election through a PostgreSQL **advisory lock** (an app-chosen lock number the database holds for you) or a lease) and scale it with bigger batches.
	- Shard the outbox: relay `k` of `n` only takes rows with `hashtext(aggregate_id) % n = k`. Same aggregate, same relay, same order.
	- Use CDC: one connector reads the WAL sequentially.
	- In every case, publish with `key = aggregate_id`, so the broker keeps the order within one partition; see [[Message Ordering and Partition Keys]].
- **Stop on failure, or skip ahead?** Stopping the batch on the first failure (as the Go code does) is simple and order-safe but lets one bad row block everything. A finer version stops only the failing aggregate and keeps publishing other aggregates.
- **Debezium snapshots.** When a connector starts with no stored offset it can take an initial snapshot of the table, then switch to streaming from the slot. For an outbox you usually do not want a snapshot of old rows; set the snapshot mode accordingly.
- **Transactions and CDC.** Changes appear in the slot only after commit, grouped by transaction. A rolled-back transaction's outbox insert never shows up, which is exactly the guarantee you want.
- **Inbox on the consumer side.** The mirror pattern: the consumer inserts `event_id` into an `inbox` table in the same transaction as its own side effect, with a unique constraint. A duplicate fails the insert and is skipped. Details live in [[Delivery Semantics and Exactly-Once]].
- **Payload: fat or thin?** A fat event carries the full order state (consumers need no callback). A thin event carries only the id and type (consumers call back, which can read newer state than the event). Most outboxes carry enough state for the main consumers, versioned with a schema; see [[Event Schemas and Schema Registry]].

**The identity-gap trap, drawn:**

```mermaid
sequenceDiagram
    participant A as Tx A
    participant B as Tx B
    participant R as Relay (WHERE id > mark)
    A->>A: takes id 501 (not committed)
    B->>B: takes id 502, commits
    R->>R: publishes 502, mark = 502
    A->>A: commits 501
    Note over R: 501 is never published
```

## 9. Interview questions 🔴

> [!question]- Why can't you just publish to Kafka right after the database commit?
> The process can die between the two steps. The commit is durable and the event is lost, and no retry happens because the retrying process is gone. The outbox moves the event into the same local transaction, so a crash leaves both or neither.

> [!question]- The outbox gives you exactly-once delivery, right? (trap)
> No. It gives at-least-once: a relay that crashes after the broker ack but before marking the row will publish it again. You get effectively-once processing only by pairing it with idempotent consumers (an inbox table keyed by `event_id`).

> [!question]- Polling relay or CDC? How do you choose?
> Polling needs nothing new and is usually fine up to a few thousand events per second (a rough estimate; measure your own) with latency in the hundreds of milliseconds. CDC gives lower latency and no polling load, reads in commit order, and lets you delete outbox rows immediately, but you must run Kafka Connect and watch replication slots. Start with polling unless you already run Debezium.

> [!question]- What goes wrong if Debezium is down for two days?
> Its logical replication slot pins all WAL since the last confirmed position, so `pg_wal` grows until the disk fills and the primary stops. Alert on slot lag, set `max_slot_wal_keep_size` so the slot gets invalidated first, and plan a re-snapshot if that happens.

> [!question]- How do you keep events for one order in order when running three relay instances?
> Make sure all events of one aggregate go through one relay (a single leader, or shard rows by `hash(aggregate_id) % n`), stop that aggregate on a failed publish, and publish with `key = aggregate_id` so the broker keeps them in one partition.

> [!question]- Why is `WHERE id > last_seen_id` a bug in a polling relay?
> IDs are assigned at insert but rows become visible at commit, which can happen in a different order. A lower id that commits late is skipped forever. Track a per-row `published_at` flag instead, or use CDC, which follows commit order.

> [!question]- Can you skip the outbox and just run CDC on the `orders` table?
> Yes, for replicating state (search index, cache, warehouse). But consumers then couple to your internal columns, and a row change does not say *why* it changed. An outbox lets you publish a deliberate, versioned event contract.

## 10. Cheat sheet 🟢

- Dual write = DB + broker with no shared transaction; both orders of operations lose or invent events.
- Outbox: business row + event row in one local transaction; a relay publishes later.
- Delivery is at-least-once; consumers dedupe on `event_id` (inbox table).
- Polling: `WHERE published_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED`, publish, mark.
- CDC: Debezium + logical slot (`pgoutput`) + Outbox Event Router; watch slot lag, set `max_slot_wal_keep_size`.
- Order per aggregate: one relay per aggregate and `key = aggregate_id`.
- Clean up sent rows (batch delete or drop partitions); monitor unsent count and oldest age.
- Kafka transactions do not cover your database.

## Self-check 🟢🟡

🟢 Easy

> [!question]- What is the dual-write problem?
> Writing to the database and the broker separately, so a crash between them leaves one done and the other not.

> [!question]- What goes into the outbox, and when?
> The event row, in the same transaction as the business change.

> [!question]- Can the relay send an event twice?
> Yes, if it crashes after publishing but before marking the row, so consumers must dedupe.

🟡 Medium

> [!question]- Why is `WHERE id > last_published_id` unsafe for a polling relay?
> Ids are assigned at insert, but transactions commit in a different order, so a slower row with a lower id can be skipped.

> [!question]- How do you keep per-order event order with several relays?
> Send all events of one aggregate through one relay (shard by `aggregate_id`) and publish with `key = aggregate_id`.

> [!question]- What can an idle CDC replication slot do to the database?
> Make it keep all WAL files, until the disk fills; alert on slot lag and set `max_slot_wal_keep_size`.

## Links

- **Before this:** [[Transactions and ACID]], [[Queues vs Streams and Broker Comparison]], [[Delivery Semantics and Exactly-Once]]
- **Next:** [[Kafka and Event Streaming]], [[Event Schemas and Schema Registry]], [[Saga Pattern]] (sagas publish their step events through an outbox)
- **Compare with:** [[Event Sourcing]] (the log is the state), [[CQRS]] (read models fed by these events), [[Replication]] (logical decoding is the same machinery)

### Watch on YouTube

- [What is the Transactional Outbox Pattern? / Designing Event-Driven Microservices](https://www.youtube.com/watch?v=5YLpjPmsPCA) · Confluent, an IBM Company · 5 min · 67,138 views
- [The Outbox Pattern & CDC Explained — Stop Losing Events / System Design Interview](https://www.youtube.com/watch?v=uagUOImVvAg) · NodePrism · 6 min · 2,621 views
