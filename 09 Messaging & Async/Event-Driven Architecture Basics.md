---
tags: [messaging, event-driven, architecture]
level: basic
status: reviewed
prereqs: ["[[Queues vs Streams and Broker Comparison]]", "[[Monolith vs Microservices]]"]
related: ["[[Saga Pattern]]", "[[Event Sourcing]]", "[[CQRS]]", "[[Transactional Outbox and CDC]]", "[[Event Schemas and Schema Registry]]", "[[Delivery Semantics and Exactly-Once]]", "[[Domain-Driven Design - Strategic Design]]"]
sources:
  - "Martin Fowler, What do you mean by Event-Driven? (2017): event notification, event-carried state transfer, event sourcing, CQRS"
  - "CloudEvents specification v1.0.2 (CNCF): required attributes id, source, specversion, type"
  - "Gregor Hohpe and Bobby Woolf, Enterprise Integration Patterns (2003): Command Message, Event Message, Document Message"
  - "Chris Richardson, Microservices Patterns (2018): choreography- and orchestration-based sagas"
updated: 2026-11-13
---

# Event-Driven Architecture Basics

> [!summary] TL;DR
> In an **event-driven architecture**, a service announces facts that already happened ("order placed") as **events**, and other services react to them on their own. The sender does not know or wait for the receivers, which makes the system easier to extend but harder to follow and debug.

> [!abstract] Core idea
> - An **event** is a fact in the past tense that anyone may react to; a **command** is a request to one specific receiver to do something.
> - **Event notification** carries just an id ("order 42 placed"); **event-carried state transfer** carries the data consumers need.
> - **Choreography**: services react to each other's events with no central controller. Easy to add consumers, hard to see the whole flow.
> - Events arrive late, twice or out of order. Consumers must cope, and publishers must publish reliably (outbox).
> - Classic mistake: an "event" that is really a command in disguise (`SendWelcomeEmail`), which couples the publisher to one consumer.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (commands vs events, choreography, event styles), 4 (worked example) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Queues vs Streams and Broker Comparison]]: a broker holds messages between a sender and its receivers, so they do not have to be online at the same time.
> - [[Monolith vs Microservices]]: a system can be split into separate services, each deployed on its own and owning one job.

**From zero, in 60 seconds** 🟢

Normally one service calls the others directly: "charge the card", "send the email".
If one of them is down, the whole action can fail.
In an event-driven design, a service just announces what happened: "order placed".
That announcement is an **event**.
Any service that cares listens and does its own part.
The sender doesn't know or care who is listening.
The catch: the other parts finish a bit later, not at the same instant. This is called **eventual consistency**.

```mermaid
flowchart LR
    O["Orders"] --> P["Payments"]
    O --> E["Email"]
    O --> L["Loyalty"]
    E -. "down => checkout fails" .-> O
```

```mermaid
flowchart LR
    O["Orders"] -- "order placed" --> B[("Event bus")]
    B --> P["Payments"]
    B --> E["Email"]
    B --> L["Loyalty"]
```

The rest of this note is just these 3 questions:
1. What is the difference between an event and a command?
2. How much data should an event carry?
3. How do you keep many services that react to events from turning into a mess?


**The problem in one story.**
You buy shoes online. The shop must charge your card, email a receipt, add loyalty points and update stock.
If the checkout code phones each of those teams one by one, any one of them being down breaks your purchase.
Instead, checkout just shouts "order placed!" and each team listens and does its own job.
That shout is an event, and building systems around such shouts is event-driven architecture.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Service | A separately deployed program that owns one job | The payments service |
| Synchronous call | Caller waits for the answer before moving on | HTTP `POST /charge` and wait |
| Asynchronous | Send now, the work happens later without waiting | Drop a letter in a postbox |
| Message broker / event bus | A server that holds messages between senders and receivers | Kafka, RabbitMQ, SNS |
| Publish / subscribe | Sender posts a message; anyone interested receives a copy | Email and loyalty both get `order.placed` |
| Coupling | How much one service must know or change because of another | Orders must redeploy when email changes |
| Eventually consistent | All copies agree, but only after a short delay | Points show up 2 seconds after checkout |
| Event vs command | "This happened" for anyone / "do this" for one receiver | `order.placed` vs `ChargeCard` |
| Outbox | A table where a service saves the event in the same transaction as its data change; a relay publishes it later | `outbox` row next to the new order |
| Choreography / orchestration | Services react to each other's events / one coordinator tells each service what to do | Saga without or with a boss |
| Idempotent | Safe to run twice: the second run changes nothing | Points added once even if the event arrives twice |

**Picture it**

```mermaid
flowchart LR
    O["Orders service"] -->|"order.placed"| B{{"Event bus"}}
    B --> P["Payments"]
    B --> E["Email"]
    B --> L["Loyalty"]
    B --> A["Analytics"]
```

**Analogy.** A town notice board: the bakery pins a notice, and whoever cares reads it and acts. The bakery does not phone anyone.
Where it breaks: a paper notice is read once and in order; real events can arrive twice, late or out of order.

**How the rest of this note builds up**

- First, why events exist (section 1) and the event vs command vs query vocabulary (section 2).
- Then how it works: notification vs state transfer, choreography vs orchestration (section 3), with a worked Go example (section 4).
- Then variants, trade-offs and when not to use events (sections 5-6).
- Finally the SDE-3 deep dive: production issues (section 7), fat vs thin events and versioning (section 8), then interview questions and a cheat sheet (sections 9-10).

> [!tip] Remember
> An event says "this happened" to anyone listening; a command says "do this" to one receiver.

## 1. Why it exists 🟢

An orders service in a **monolith**-turned-microservices system (a monolith is one big program that does everything) calls, on every checkout: payments, inventory, email, loyalty, analytics and fraud. That is 6 synchronous calls.

If each is 99.9% available, the chain is about 0.999^6 ≈ 99.4% available, so roughly 6 in 1,000 checkouts hit some failure (an estimate that assumes independent failures).

Each new team that wants to "know about orders" needs a code change and a deploy of the orders service.

With events, the orders service commits the order and publishes `order.placed`. Payments, email, loyalty, analytics and fraud subscribe.

The orders service no longer changes when the 7th consumer arrives, and an email outage does not fail checkouts.

**Real-life example.** When you order food on Zomato, one "order placed" moment sets off many things: the restaurant's tablet rings, a delivery partner is searched for, you get a notification, and analytics counts the order. None of these should be able to break your checkout if they are slow. That is the event-driven idea: the order service announces the fact once, and each of those parts listens and does its own job.

The cost: the business process "place order" now lives in six codebases, and its state is **eventually consistent** (the loyalty balance is updated a few hundred milliseconds or minutes later, not inside the checkout transaction).

**Why the chain of calls is fragile** (rounded, assumes failures are independent):

```mermaid
flowchart LR
    A["6 direct calls,<br/>each 99.9% up"] --> B["Whole checkout<br/>~99.4% up"]
    B --> C["~6 in 1,000<br/>checkouts fail"]
```

## 2. Mental model 🟢

A town notice board. The bakery pins "Fresh bread at 7 am". It does not phone each customer, and it does not know who reads the board. Anyone interested acts on the notice. Compare a phone call to the baker saying "bake 20 loaves for me": that is a command, addressed to one party, who can say no.

Three words to keep straight:

- **Event:** "OrderPlaced". Past tense, immutable, owned by the publisher. Zero or many consumers. The publisher does not expect a reply.
- **Command:** "ChargeCard". Imperative, addressed to one receiver who owns the decision, may be rejected. Often sent through a queue, which is fine, but it is still a command.
- **Query:** "GetOrder". Asks for data; no side effects.

**Notice board vs phone call:**

```mermaid
flowchart LR
    subgraph Event["Event: notice board"]
        B1["Bakery pins<br/>'fresh bread at 7'"] --> N[("Board")]
        N --> R1["Anyone who cares"]
    end
    subgraph Command["Command: phone call"]
        C1["Customer"] -- "bake 20 loaves" --> C2["Baker (can say no)"]
    end
```

## Common beginner mistakes 🟢

- **Naming an event after the reaction you want (`SendWelcomeEmail`)** → that is a command in disguise, and the publisher is now tied to one consumer → publish the fact, `user.registered`, and let the email service decide.
- **Publishing the event right after `COMMIT`** → if the process dies in between, the order exists but the event is lost forever → save the event in an outbox row in the same transaction.
- **Assuming each event arrives exactly once, in order** → brokers redeliver and can reorder → make consumers skip duplicates by event id and use version numbers.
- **Using an event when you need an answer right now** → nobody replies to an event, so the caller cannot continue → use a direct call for things like "is this card valid?".
- **Letting a long business flow live as a chain of reactions across ten services** → nobody can see where order 42 is stuck → move long flows with refunds into one orchestrator.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that an event is a past-tense fact that anyone may react to, and that a command is a request to one receiver. **Next we open the box**: how the arrows of dependency flip, how a checkout runs as a chain of reactions, and how much data each event should carry.

### Commands vs events

**In plain words:** a command is "please do X", sent to one service that can say no. An event is "X happened", and anyone may listen.

**Step by step:**
1. Command style: the orders service sends `ChargeCard` to payments, `SendReceipt` to email and `AddPoints` to loyalty. It must know all three.
2. The analytics team wants order data. The orders team must change and redeploy their code to send one more command.
3. Event style: the orders service publishes one event, `order.placed`, to the bus. It does not know who listens.
4. Payments, email and loyalty each subscribe to `order.placed`.
5. Analytics simply subscribes too. The orders service does not change at all.

```mermaid
flowchart LR
    subgraph Command style
      O1[orders] -->|ChargeCard| P1[payments]
      O1 -->|SendReceipt| E1[email]
      O1 -->|AddPoints| L1[loyalty]
    end
    subgraph Event style
      O2[orders] -->|order.placed| B{{event bus}}
      B --> P2[payments]
      B --> E2[email]
      B --> L2[loyalty]
      B --> A2[analytics: added later, no change to orders]
    end
```

In the command style the orders service knows every receiver; the dependency arrows point out of it. In the event style the arrows point into the bus, and the dependency is reversed: consumers depend on the event's contract, not the publisher's code.

### Choreography: a checkout as a chain of reactions

**In plain words:** there is no boss here. Each service hears an event, does its job, and announces its own event, like dancers reacting to each other.

```mermaid
sequenceDiagram
    participant O as orders
    participant Bus as event bus
    participant P as payments
    participant I as inventory
    participant S as shipping
    O->>O: insert order (status=pending) + outbox row, one tx
    O->>Bus: order.placed {order_id: 42, total: 1999}
    Bus->>P: order.placed
    P->>P: charge card
    P->>Bus: payment.captured {order_id: 42}
    Bus->>I: payment.captured
    I->>I: reserve stock
    I->>Bus: stock.reserved {order_id: 42}
    Bus->>S: stock.reserved
    Bus->>O: stock.reserved
    O->>O: status=confirmed
    Note over P,I: If stock fails: inventory publishes stock.unavailable,<br/>payments reacts by refunding. That compensation chain is a saga.
```

Steps:

1. The publisher changes its own state and records the event **in the same database transaction** (an outbox row). A relay publishes it. Publishing directly after commit is a **dual write**: if the process dies between commit and publish, the event is lost forever. See [[Transactional Outbox and CDC]].
2. The broker delivers the event to each subscriber (each has its own queue or **consumer group**: a named set of workers that share one copy of the event stream).
3. Each subscriber does its local work in its own transaction and may publish new events.
4. No service holds the whole flow. When a later step fails, earlier steps are undone by compensating events. The full pattern, including when to switch to a central **orchestrator**, is in [[Saga Pattern]].

### Two event styles

**In plain words:** an event can be a short ping ("order 42 changed, ask me for details") or a full copy of the data, so readers never need to call back.

**Step by step:**
1. Thin style: orders publishes `order.placed {order_id: 42}`.
2. Billing receives it and calls `GET /orders/42` to learn the total. If the orders service is down, billing is stuck.
3. Fat style: orders publishes `order.placed {order_id: 42, ship_to_city: Pune, total: 1999}`.
4. Shipping receives it, saves "order 42 → Pune" in its own table, and never calls back.
5. The trade: fat events keep consumers working when orders is down, but every field you add is a promise you must keep.

```mermaid
sequenceDiagram
    participant O as orders
    participant Bus as bus
    participant B as billing (notification)
    participant S as shipping (state transfer)
    O->>Bus: order.placed v1 {order_id: 42}
    Bus->>B: order.placed v1
    B->>O: GET /orders/42
    O-->>B: {total: 1999, customer: c-7, ...}
    O->>Bus: order.placed v2 {order_id: 42, ship_to_city: Pune, total: 1999}
    Bus->>S: order.placed v2
    S->>S: store city locally, no call back
```

- **Event notification** (thin event): small and safe to change, but every consumer calls back, so the publisher still takes load and must be up. If the order changed between the event and the call, the consumer sees the newer state, which may or may not be what it wants.
- **Event-carried state transfer** (fat event): consumers keep their own copy and never call back, so they keep working when the publisher is down. Cost: bigger events, a wider contract that is harder to change, and data duplicated across services.

A third style, **event sourcing**, uses events as the publisher's own source of truth. It is a storage pattern, not a messaging style, and is covered in [[Event Sourcing]].

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** the whole idea in a few lines: wrap each event in a standard envelope, and let many handlers subscribe to one event type.

```text
envelope = {id, source, type, version, time, data}     <- CloudEvents-like
bus.subscribe("order.placed", "billing",  h1)
bus.subscribe("order.placed", "shipping", h2)

orders:   tx { insert order; insert outbox(order.placed) }   relay -> bus.publish
billing:  on order.placed(id)      -> GET /orders/id -> charge      (notification)
shipping: on order.placed(full)    -> save city locally            (state transfer)

publish(e):
  for each subscriber of e.type:
     err = handler(e)          one failure does not stop the others
     if err: retry only that subscriber, later
```

### Code: an in-process bus with both event styles

**In plain words:** a tiny event bus in Go that gives each event to every subscriber, so you can watch both event styles work.

The bus below is the in-memory version of what a broker does for a topic: deliver to every subscriber of a type, independently. The envelope follows the **CloudEvents** (an industry standard for the common fields of an event) core attribute names (`id`, `source`, `type`, `time`) plus a version number.

```go
// Package eda shows an in-process event bus with a versioned envelope,
// and the two event styles: notification and event-carried state transfer.
package eda

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sync"
	"time"
)

// Event is the envelope every event travels in. The field names follow
// the CloudEvents core attributes (id, source, type, time) plus a version.
type Event struct {
	ID      string          `json:"id"`
	Source  string          `json:"source"`
	Type    string          `json:"type"` // past tense: "order.placed"
	Version int             `json:"version"`
	Time    time.Time       `json:"time"`
	Data    json.RawMessage `json:"data"`
}

type Handler func(ctx context.Context, e Event) error

// Bus delivers each published event to every subscriber of its type.
// The publisher does not know who (if anyone) is listening.
type Bus struct {
	mu   sync.RWMutex
	subs map[string]map[string]Handler // type -> subscriber name -> handler
}

func NewBus() *Bus { return &Bus{subs: map[string]map[string]Handler{}} }

func (b *Bus) Subscribe(eventType, subscriber string, h Handler) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.subs[eventType] == nil {
		b.subs[eventType] = map[string]Handler{}
	}
	b.subs[eventType][subscriber] = h
}

// Publish calls every handler. One failing subscriber does not stop the
// others; their errors are joined and named, so a real broker could retry
// only the failed subscriber.
func (b *Bus) Publish(ctx context.Context, e Event) error {
	b.mu.RLock()
	hs := make(map[string]Handler, len(b.subs[e.Type]))
	for name, h := range b.subs[e.Type] {
		hs[name] = h
	}
	b.mu.RUnlock()

	var errs []error
	for name, h := range hs {
		if err := h(ctx, e); err != nil {
			errs = append(errs, fmt.Errorf("subscriber %s: %w", name, err))
		}
	}
	return errors.Join(errs...)
}

// OrderPlacedThin is a notification event: it says what happened and
// carries only the id. Consumers call back for details.
type OrderPlacedThin struct {
	OrderID string `json:"order_id"`
}

// OrderPlacedFat is event-carried state transfer: it carries the state
// consumers need, so they never call the order service.
type OrderPlacedFat struct {
	OrderID    string `json:"order_id"`
	CustomerID string `json:"customer_id"`
	TotalPaise int64  `json:"total_paise"`
	ShipToCity string `json:"ship_to_city"`
}

func NewEvent(id, source, typ string, version int, at time.Time, data any) (Event, error) {
	raw, err := json.Marshal(data)
	if err != nil {
		return Event{}, err
	}
	return Event{ID: id, Source: source, Type: typ, Version: version, Time: at, Data: raw}, nil
}
```

```go
package eda

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

var t0 = time.Date(2026, 11, 4, 10, 0, 0, 0, time.UTC)

func TestNotificationConsumerCallsBack(t *testing.T) {
	bus := NewBus()
	var lookups atomic.Int32
	getOrder := func(id string) OrderPlacedFat { // stands in for GET /orders/{id}
		lookups.Add(1)
		return OrderPlacedFat{OrderID: id, TotalPaise: 199900}
	}
	var billed int64
	bus.Subscribe("order.placed", "billing", func(_ context.Context, e Event) error {
		var n OrderPlacedThin
		if err := json.Unmarshal(e.Data, &n); err != nil {
			return err
		}
		billed = getOrder(n.OrderID).TotalPaise
		return nil
	})

	e, _ := NewEvent("evt-1", "orders", "order.placed", 1, t0, OrderPlacedThin{OrderID: "o-42"})
	if err := bus.Publish(context.Background(), e); err != nil {
		t.Fatal(err)
	}
	if lookups.Load() != 1 || billed != 199900 {
		t.Fatalf("lookups=%d billed=%d", lookups.Load(), billed)
	}
}

func TestStateTransferConsumerBuildsLocalCopy(t *testing.T) {
	bus := NewBus()
	cityOf := map[string]string{} // shipping's own read model
	bus.Subscribe("order.placed", "shipping", func(_ context.Context, e Event) error {
		var o OrderPlacedFat
		if err := json.Unmarshal(e.Data, &o); err != nil {
			return err
		}
		cityOf[o.OrderID] = o.ShipToCity
		return nil
	})
	e, _ := NewEvent("evt-2", "orders", "order.placed", 2, t0,
		OrderPlacedFat{OrderID: "o-43", CustomerID: "c-7", TotalPaise: 50000, ShipToCity: "Pune"})
	if err := bus.Publish(context.Background(), e); err != nil {
		t.Fatal(err)
	}
	if cityOf["o-43"] != "Pune" {
		t.Fatalf("read model = %v", cityOf)
	}
}

func TestOneFailingSubscriberDoesNotBlockOthers(t *testing.T) {
	bus := NewBus()
	var emailed atomic.Bool
	bus.Subscribe("order.placed", "email", func(context.Context, Event) error {
		emailed.Store(true)
		return nil
	})
	bus.Subscribe("order.placed", "loyalty", func(context.Context, Event) error {
		return errors.New("points service down")
	})
	e, _ := NewEvent("evt-3", "orders", "order.placed", 1, t0, OrderPlacedThin{OrderID: "o-44"})
	err := bus.Publish(context.Background(), e)
	if !emailed.Load() {
		t.Fatal("email subscriber should still run")
	}
	if err == nil || !strings.Contains(err.Error(), "subscriber loyalty") {
		t.Fatalf("want a named loyalty error, got %v", err)
	}
}

func TestPublishWithNoSubscribersIsNotAnError(t *testing.T) {
	e, _ := NewEvent("evt-4", "orders", "order.cancelled", 1, t0, OrderPlacedThin{OrderID: "o-45"})
	if err := NewBus().Publish(context.Background(), e); err != nil {
		t.Fatal(err)
	}
}
```

Run with `go test -race ./eda` (Go 1.24): all 4 tests pass. They show:

- The notification consumer made exactly one call back to the publisher; the state-transfer consumer made none.
- A failing loyalty subscriber did not stop the email subscriber, and the returned error names which subscriber failed, so only that one is retried. With a real broker each subscriber has its own queue, so this isolation is automatic.
- Publishing an event nobody listens to is not an error. Events are facts, not requests.

## 5. Variants and comparison 🟡

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Synchronous request/response | Caller waits for the callee | Caller needs the answer now (price, auth, stock check before payment) | **Temporal coupling** (both must be up at the same moment); availability multiplies down the chain |
| Command via queue | One named receiver, async | A job must be done by a specific service, with retries | Sender knows the receiver |
| Event notification | Thin event, consumers call back | Data changes often, consumers need the freshest state, few consumers | Callback load; publisher must be up |
| Event-carried state transfer | Fat event with the needed data | Many consumers, publisher outages must not spread, consumers keep local **read models** (their own copy of the data, shaped for their queries) ([[CQRS]]) | Larger contract, duplicated data, schema evolution matters |
| Event sourcing | Events are the system of record | Audit, temporal queries, rebuilding projections | Hard to change past events; snapshots and upcasting |
| Choreography | Services react to each other's events | Few steps, independent teams, flow rarely changes | Flow is implicit; hard to answer "where is order 42?" |
| Orchestration | A coordinator sends commands and waits for replies | Many steps, compensation logic, need visibility | Central component to build and run ([[Workflow Engines and Durable Execution]]) |

## 6. Trade-offs and when not to use 🟡

- **Eventual consistency is user-visible.** After checkout the "My points" page may lag. Design the UI for it ("points arrive within a minute") or keep that read synchronous.
- **Hidden coupling.** Consumers depend on field names, meanings and timing of events they do not own. Renaming `total` to `amount` silently breaks three teams. Treat events as public APIs with versioning and a registry ([[Event Schemas and Schema Registry]]).
- **Event spaghetti.** With 40 event types and 15 services reacting to each other, nobody can draw the order flow. Signs: cycles (A reacts to B reacts to A), and incidents that need five teams to trace. Fix: name the business process, move it to an orchestrator, keep choreography for simple fan-out.
- **Debugging needs tooling.** Without a **correlation id** (one id copied into every event of the same business flow) in every event and tracing across the broker, "why was order 42 not shipped?" takes hours. Propagate trace context in message headers ([[Distributed Tracing with OpenTelemetry]]).
- **Duplicates and reordering are normal.** **At-least-once** delivery (the broker retries until it is sure, so a message may arrive twice) means every consumer must be idempotent ([[Delivery Semantics and Exactly-Once]]), and must handle `order.cancelled` arriving before `order.placed` ([[Message Ordering and Partition Keys]]).
- **Do not use events** for a request that needs an answer to continue, inside a single small service, or as a way to avoid deciding which team owns a process.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** commands vs events, how choreography runs a checkout, the two event styles, and how to build a tiny bus in Go. **Next is the advanced part**: real brokers, naming rules that age well, production failures, and where to draw event boundaries so they stay stable for years.

- **Real systems:** event buses are usually Kafka, SNS + SQS, EventBridge, or Pulsar ([[Queues vs Streams and Broker Comparison]]). Debezium turns database changes into events without touching application code. AWS EventBridge routes events by content with rules, and its schema registry can discover event shapes.
- **Naming conventions that age well:**
	- `<entity>.<past-tense verb>`: `order.placed`, `payment.captured`, `shipment.dispatched`.
	- Name the business fact, not the table change: `order.cancelled`, not `orders_row_updated`.
	- Never name the reaction you hope for: `send_welcome_email` is a command; publish `user.registered` and let the email service decide.
	- Include `id` (for dedupe), `source`, `type`, `version` (or a schema id), `time`, and a correlation or trace id.
- **Failure modes → fixes:**
	- Event lost because the process died between DB commit and publish → outbox or CDC.
	- Consumer double-applies a duplicate → dedupe on event `id` in the same transaction as the effect.
	- Breaking schema change → additive changes only; new major version as a new type; consumers ignore unknown fields.
	- Infinite loop between two services → never react to your own events; add a hop count or a cause id.
	- Slow consumer backlog → per-consumer queues and lag alerts, so one slow consumer does not slow the others.
- **What to monitor:** publish rate and errors per event type, consumer lag or oldest-message age per subscriber, DLQ (dead letter queue: where messages that keep failing are parked) depth, end-to-end latency from `time` in the envelope to processing, and outbox backlog.

## 8. Deep dive 🔴

**Where to draw event boundaries.** Events are most stable when they cross a **bounded context** boundary (the edge of one team's part of the business, with its own words and model) ([[Domain-Driven Design - Strategic Design]]). Inside one context, use domain events in-process; at the edge, publish **integration events** with a deliberately smaller, stable schema. Publishing internal domain events directly leaks your model and freezes it.

**Fat vs thin is a spectrum, and "delta" events are a trap.**

An event like `order.updated {changed: {status: "paid"}}` forces every consumer to have seen all earlier deltas in order.

Prefer either a thin notification or a full snapshot of the fields consumers need. Snapshots make reordering harmless if each carries a version: the consumer applies an event only if `event.version > stored.version`.

**Ordering scope.** A broker orders events per partition, per message group, or per queue. Put all events for one **aggregate** (one business object that changes as a unit, such as one order) under the same key so they stay ordered relative to each other. Across aggregates there is no order, and you should not need one.

**Time.** `time` in the envelope is the producer's clock, which can be skewed by seconds between hosts. Use it for latency metrics and humans, not for ordering decisions. Use per-aggregate version numbers for ordering.

**Replays change semantics.** If events go through a log with retention, a new consumer can rebuild state from history. That only works if events carry enough state (state transfer) and the consumer's handler is side-effect free during replay, or the replay would resend six months of emails.

**Request/reply over events** (send a command, wait for a reply event on a reply topic with a correlation id) is possible but brings back temporal coupling with extra moving parts. Use it for long-running steps where an orchestrator persists its state, not to fake a synchronous API.

**Using version numbers, not clocks, to handle out-of-order events:**

```mermaid
flowchart LR
    E["Event for order 42<br/>version 3"] --> C{"3 > stored version?"}
    C -- "yes" --> A["Apply, store 3"]
    C -- "no (old or repeat)" --> S["Skip"]
```

## 9. Interview questions 🔴

> [!question]- What is the difference between an event and a command?
> An event states a past fact (`order.placed`), is owned by the publisher, and may have zero or many consumers who decide what to do. A command (`ChargeCard`) asks one specific receiver to act and can be rejected. Both can travel through a broker; the difference is who owns the decision and who knows whom.

> [!question]- Event notification vs event-carried state transfer: when would you pick each?
> Notification (just an id) when consumers need the freshest data, there are few of them, and the publisher can take the call-back load. State transfer (the needed fields in the event) when many consumers exist and they must keep working while the publisher is down. State transfer makes the event a wider public contract.

> [!question]- Trap: "We publish the event right after `COMMIT`, so it is reliable." Is it?
> No. That is a dual write. If the process crashes or the broker is unreachable between the commit and the publish, the order exists and the event never goes out. Write the event to an outbox table in the same transaction and relay it, or use CDC on the table.

> [!question]- Choreography or orchestration for a 7-step order fulfilment with refunds?
> Orchestration. Seven steps with compensations are hard to follow when spread across services as reactions; a coordinator (or a workflow engine) makes the state of each order visible and the compensation order explicit. Choreography suits 2 or 3 steps and simple fan-out.

> [!question]- How do you stop event-driven systems from turning into spaghetti?
> Publish business facts at bounded-context edges, keep an event catalog with owners and schemas, ban command-like event names, require a correlation id and tracing through the broker, and move multi-step processes with compensations into an orchestrator.

> [!question]- A consumer receives `order.cancelled` before `order.placed`. What do you do?
> Key both events by order id so the broker keeps them in one partition or group. Still defend against it: store a per-order version and ignore older events, or park the early event and apply it after the missing one arrives. Never assume global order.

## 10. Cheat sheet 🟢

- Event = past-tense fact, many consumers, no reply expected. Command = one receiver, may be rejected.
- Name events `entity.past_tense_verb`; never name the reaction.
- Notification = id only, consumers call back. State transfer = data included, consumers keep copies.
- Publish via outbox or CDC, never "commit then publish".
- Consumers are idempotent (dedupe by event id) and tolerate reordering (versions).
- Choreography for simple fan-out; orchestration (saga coordinator, workflow engine) for long flows with compensation.
- Envelope: id, source, type, version, time, correlation id, data.

## Self-check 🟢🟡

🟢 Easy

> [!question]- Is `order.placed` an event or a command?
> An event: a past-tense fact that anyone may react to.

> [!question]- Does the publisher of an event know who is listening?
> No. It publishes the fact; subscribers decide for themselves.

> [!question]- What is eventual consistency in a checkout?
> Other parts, like loyalty points, catch up a little later instead of inside the checkout itself.

🟡 Medium

> [!question]- Why is "commit, then publish" unsafe?
> If the process dies between the two, the data is saved but the event is lost; use an outbox.

> [!question]- When is a thin (id-only) event better than a fat one?
> When consumers need the freshest data, there are few of them, and the publisher can handle the call-backs.

> [!question]- How do you handle events for one order arriving out of order?
> Send them with the order id as the key so they stay in order, and skip any event whose version is not newer than the stored one.

## Links

- **Before this:** [[Queues vs Streams and Broker Comparison]], [[Monolith vs Microservices]]
- **Next:** [[Background Jobs and Worker Pools]], [[Transactional Outbox and CDC]], [[Event Schemas and Schema Registry]]
- **Compare with:** [[Saga Pattern]], [[Event Sourcing]], [[CQRS]], [[Workflow Engines and Durable Execution]]

### Watch on YouTube

- [Event-Driven Architecture(EDA) vs. Request/Response (RR): System Design Explained](https://www.youtube.com/watch?v=7fkS-18KBlw) · Confluent, an IBM Company · 12 min · 311,560 views
- [What's an Event Driven System?](https://www.youtube.com/watch?v=rJHTK2TfZ1I) · Gaurav Sen · 14 min · 434,302 views
