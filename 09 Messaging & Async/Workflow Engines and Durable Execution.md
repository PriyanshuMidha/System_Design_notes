---
tags: [messaging, workflows, temporal, durable-execution, distributed-systems]
level: advanced
status: reviewed
prereqs: ["[[Saga Pattern]]", "[[Background Jobs and Worker Pools]]", "[[Timeouts, Retries and Backoff]]", "[[Idempotency and Idempotency Keys]]"]
related: ["[[Scheduled Jobs - Cron to Durable Schedulers]]", "[[Event Sourcing]]", "[[Transactional Outbox and CDC]]", "[[Delivery Semantics and Exactly-Once]]", "[[Event-Driven Architecture Basics]]", "[[AWS SQS, SNS and EventBridge]]"]
sources:
  - "Temporal documentation: Workflows, Activities, Event History, Deterministic constraints, Versioning, Retry Policies, Activity timeouts, Workflow Execution limits, Continue-As-New"
  - "Temporal Go SDK v1.38.0 (go.temporal.io/sdk) API reference and testsuite package: workflow.ExecuteActivity, workflow.Sleep, workflow.GetVersion"
  - "AWS Step Functions Developer Guide: Standard vs Express workflows, Amazon States Language"
  - "Uber Engineering, Cadence open-source announcement"
updated: 2026-11-13
---

# Workflow Engines and Durable Execution

> [!summary] TL;DR
> A **workflow** is a business process with several steps that can take seconds or months: reserve stock, charge the card, wait for the courier, refund if it fails. A **workflow engine** such as Temporal runs that process as ordinary code and records every step's result in a durable **event history**. If the machine dies, another worker **replays** the code against the history and continues from the exact step where it stopped. This is called **durable execution**.

> [!abstract] Core idea
> - Split the process into **workflow code** (decides what happens next; must be deterministic) and **activities** (do the side effects: HTTP calls, DB writes, emails).
> - The engine stores each activity result. On recovery it re-runs the workflow function from the top, and already-completed activities return their stored result instead of running again.
> - Timers, retries with backoff, and waiting for external signals become one line of code each, and survive restarts.
> - Activities still run **at least once**, so they must be idempotent.
> - Classic mistake: calling `time.Now()`, `rand`, or a network API directly in workflow code. Replay then takes a different path and the engine reports a nondeterminism error.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (lifecycle, determinism, retries), 4 (worked example) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Saga Pattern]]: a multi-step process across services undoes earlier steps (compensates) when a later step fails.
> - [[Background Jobs and Worker Pools]]: workers take jobs from a queue, retry failures, and may run a job twice.
> - [[Timeouts, Retries and Backoff]]: give every call a time limit and retry with growing waits.
> - [[Idempotency and Idempotency Keys]]: a stable key lets a repeated call (such as a charge) take effect only once.

**From zero, in 60 seconds** 🟢

Some business tasks have many steps and can take days: reserve stock, charge the card, book a courier.
If the server crashes in the middle, you must know which steps are already done.
Doing that by hand needs status columns, cron jobs, queues and lots of glue code.
A **workflow engine** lets you write the whole flow as one normal function.
The engine writes down the result of every finished step in a log, called the **history**.
After a crash, the function runs again from the top, but finished steps just return their saved result instead of running twice.

```mermaid
flowchart LR
    S1["Reserve stock"] --> S2["Charge card"] --> X["crash"]
    X --> Q["Was the card charged? Nobody knows"]
```

```mermaid
flowchart LR
    S1["Reserve: done (saved)"] --> S2["Charge: done (saved)"] --> X["crash"]
    X --> R["New worker replays:<br/>skips 1 and 2, books courier"]
```

The rest of this note is just these 3 questions:
1. How does the engine replay your code and skip finished steps?
2. Why must the flow code give the same result every time it runs?
3. How are retries, timers and long waits handled for you?


**The problem in one story**
You order a phone. The shop reserves it, charges your card, then waits two days for a courier.
Halfway through, the shop's server restarts.
Did it charge you? Should it charge again? Who remembers to book the courier?
A workflow engine remembers every finished step, so the process picks up exactly where it stopped.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Workflow | A multi-step business process written as one function | Reserve, charge, ship, refund on failure |
| Activity | One step that touches the outside world | `ChargeCard(order-7, 499)` |
| Side effect | Something a step changes outside the program | Money moved, email sent |
| Event history | A saved log of every finished step and its result | "charge done, txn-42" |
| Replay | Re-running the function and reusing saved results | Skips the charge, returns txn-42 |
| Deterministic | Same input always gives the same path through the code | No `time.Now()` or random numbers |
| Idempotent | Doing it twice has the same effect as once | Charge with key `order-7` only once |
| Retry with backoff | Try again after waiting longer each time | Wait 1 s, 2 s, 4 s ... |
| Compensation | A step that undoes an earlier step after a later one fails | Refund the charge, release the stock |
| Webhook | An HTTP call another company's system makes to yours to report something | Courier says "booked" |
| Temporal | A popular open-source workflow engine with SDKs for Go and other languages | `workflow.ExecuteActivity(...)` |
| Continue-As-New | Restarting a long workflow with a fresh, empty history but the same ID | A monthly billing loop every year |

**Picture it**

```mermaid
flowchart LR
    W["workflow code"] -->|"run step"| A["activity"]
    A -->|"result"| H[("event history")]
    X["worker crashes"] --> N["new worker"]
    N -->|"replay"| H
    H -->|"saved results,<br/>skip done steps"| W
```

**Analogy**
A cook follows a recipe and writes each finished step in a notebook; a replacement cook reads the notebook and skips what is done.
Where it breaks: a real cook can improvise, but workflow code must take the same path on every replay.

**How the rest of this note builds up**

- First, the hand-built mess of status columns and cron jobs (section 1) and the recipe-and-notebook model (section 2).
- Then the mechanics: workers, task queues, event history, retries and timers (section 3).
- Then a worked example: a teaching replay engine in Go and the same flow in the Temporal Go SDK (section 4), plus alternatives like Step Functions (section 5).
- Finally the SDE-3 depth: history limits, versioning, replay mechanics and why activities run at least once (sections 6-8).

> [!tip] Remember
> Workflow code decides, activities act; the engine saves every result so a crash never repeats a finished step.

## 1. Why it exists 🟢

Take an order flow:

1. Reserve stock (inventory service).
2. Charge ₹499 (payment provider).
3. Book a courier (logistics API).
4. If courier booking fails three times, refund and release stock.

Booking can take up to 2 days because the courier confirms by webhook.

Built by hand, this becomes:
- a `status` column with 9 states and a `next_retry_at` column,
- a cron job that scans for stuck rows every minute ([[Scheduled Jobs - Cron to Durable Schedulers]]),
- a queue for each step and a worker for each queue ([[Background Jobs and Worker Pools]]),
- webhook handlers that find the row and nudge the state,
- compensations written as more states ([[Saga Pattern]]).

The business logic ("charge, then ship, refund on failure") is scattered across 6 places. Each new step needs a migration, a queue and new crash-recovery logic. A bug in any one leaves orders stuck in `CHARGING` with nobody knowing whether the card was charged.

**Real-life example.** Ordering on an e-commerce app like Flipkart is a long process: hold the item, take payment, wait for a seller to pack it, book a courier, then wait days for delivery, with refunds if anything fails. Ride and food apps run similar multi-step flows; Uber built Cadence, the engine Temporal grew from, for exactly this. The engine is what lets that whole process survive server restarts without charging twice or forgetting a step.

A workflow engine lets you write the flow as one function and makes the engine responsible for persistence, retries, timers and recovery.

**Same flow, by hand vs with an engine:**

```mermaid
flowchart TB
    subgraph Hand["By hand: 6 places"]
        H1["status column"] --- H2["retry column"] --- H3["cron scanner"]
        H3 --- H4["queues + workers"] --- H5["webhook handlers"] --- H6["undo states"]
    end
    subgraph Engine["With an engine: 1 function"]
        E1["reserve -> charge -> ship<br/>refund on failure"]
    end
```

## 2. Mental model 🟢

The workflow function is a **recipe** and the event history is a **cook's notebook**. Every time the cook finishes a step ("eggs whisked, result: bowl A"), they write it down.

If the cook faints, a new cook starts reading the recipe from the top. For each step, they check the notebook first: "eggs whisked? Yes, bowl A" and move on without whisking again. When they reach the first step not in the notebook, they actually do it.

This only works if the recipe gives the same instructions every time it is read. If the recipe says "add salt if it is raining" and the weather changed, the new cook goes a different way than the notebook records. That is why workflow code must be **deterministic**.

Terms:
- **Workflow execution:** one running instance, identified by a workflow ID (for example `order-7`).
- **Activity:** a function that does one side effect. It can fail, time out and be retried.
- **Event history:** the append-only log of everything that happened to one execution: started, activity scheduled, activity completed with result, timer fired, signal received.
- **Worker:** your process that hosts workflow and activity code and polls the engine for tasks.
- **Task queue:** the named queue on which the engine hands tasks to workers.
- **Signal:** a message sent into a running workflow from outside (for example "courier confirmed").
- **Durable timer:** a sleep stored by the engine, so `Sleep(48h)` survives restarts and costs no worker resources while waiting.

## Common beginner mistakes 🟢

- **Calling `time.Now()` or making HTTP calls inside workflow code** → on replay the code takes a different path and the engine raises a nondeterminism error → use the SDK's time functions and put all I/O in activities.
- **Assuming an activity runs exactly once** → a worker can finish the charge and die before reporting, so it is retried → pass a stable idempotency key to the payment API.
- **Leaving out the StartToClose timeout** → an activity stuck on a hung call waits forever → always set it, and heartbeat long activities.
- **Changing workflow code without versioning** → workflows already running replay against the new code and fail → wrap changes with `GetVersion` and replay-test saved histories.
- **Passing big files as activity inputs or results** → everything is stored in history, which has size limits → pass IDs and keep the data in a store.

**The cook's notebook, drawn:**

```mermaid
flowchart LR
    R["Recipe (workflow code)"] --> C{"Step in the notebook?"}
    C -- "yes" --> U["Use saved result, move on"]
    C -- "no" --> D["Do it now, write it down"]
```

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that a workflow engine saves the result of every finished step and replays your function after a crash, skipping what is already done. **Next we open the box**: how workers and the engine pass tasks, the life of one execution, what "deterministic" really forbids, and how retries and timeouts are declared.

```mermaid
sequenceDiagram
    participant S as Temporal service (history + matching)
    participant W1 as Worker 1
    participant W2 as Worker 2
    participant Pay as Payment API
    S->>W1: workflow task: start order-7
    W1->>W1: run workflow code until ExecuteActivity(charge)
    W1->>S: command: schedule activity charge
    S->>W1: activity task: charge
    W1->>Pay: POST /charges (idempotency key = order-7/charge)
    Pay-->>W1: pay_123
    W1->>S: activity completed: pay_123 (appended to history)
    Note over W1: worker 1 is killed here
    S->>W2: workflow task for order-7 (history so far)
    W2->>W2: replay: reserve and charge return stored results
    W2->>S: command: schedule activity ship
    Note over W2,S: card charged once, flow continues on worker 2
```

Step by step:
1. A client starts a workflow with an ID. The engine writes `WorkflowExecutionStarted` to the history and puts a **workflow task** on the task queue.
2. A worker takes the task and runs the workflow function. When the code calls `ExecuteActivity`, the SDK does not run the activity. It records a command "schedule activity" and suspends the workflow.
3. The engine appends `ActivityTaskScheduled` and puts an **activity task** on the queue. A worker runs the activity and reports the result, which becomes `ActivityTaskCompleted` in the history.
4. The engine schedules a new workflow task. The worker (often from a cache, or from scratch by replay) resumes the function, which now receives the activity result and runs to its next command.
5. If any worker dies, the engine notices through timeouts and gives the task to another worker, which replays the history.

### Execution lifecycle

**In plain words:** a workflow is started, runs, may wait for days, and ends as done, failed, cancelled or timed out. The picture shows each move.

**Step by step:**
1. The client starts workflow `order-7`. It is now running.
2. It reserves stock and charges the card, then waits up to 48 hours for the courier's webhook (a signal).
3. While it waits, no worker is busy: the engine just holds a durable timer.
4. The signal arrives on day 2. The workflow wakes, books the delivery and completes.
5. Had the timer fired first, the workflow would run its compensations (refund, release stock) and end as failed or completed with a refund.

```mermaid
stateDiagram-v2
    [*] --> Running: StartWorkflow(id)
    Running --> Running: activity completes / timer fires / signal arrives
    Running --> Completed: function returns a value
    Running --> Failed: function returns an error
    Running --> TimedOut: workflow run timeout reached
    Running --> Cancelled: cancel request handled
    Running --> Terminated: operator terminates
    Running --> ContinuedAsNew: history too long, start a fresh run with same id
    ContinuedAsNew --> [*]
    Completed --> [*]
    Failed --> [*]
    TimedOut --> [*]
    Cancelled --> [*]
    Terminated --> [*]
```

### What must be deterministic

**In plain words:** the flow code is run again during replay, so it must make the same choices every time. Time, random numbers and network calls go through the engine.

**Step by step (how a bad line breaks replay):**
1. Workflow code says: "if `time.Now()` is before 6 pm, use express courier, else standard".
2. The first run happens at 5:59 pm, so history records "scheduled express courier".
3. The worker crashes. Another worker replays the function at 6:01 pm.
4. Now the code asks for "standard courier", but history says "express". The engine sees the mismatch and stops with a nondeterminism error.
5. Using `workflow.Now(ctx)` instead returns the time recorded in history, so the replay makes the same choice.

Workflow code runs many times over the life of one execution. Anything that could differ between runs must go through the SDK so its value is recorded in history:

| Do not use in workflow code | Use instead (Temporal Go SDK) |
| --- | --- |
| `time.Now()`, `time.Sleep` | `workflow.Now(ctx)`, `workflow.Sleep(ctx, d)`, `workflow.NewTimer` |
| `go func()`, channels, `select` | `workflow.Go`, `workflow.Channel`, `workflow.Selector` |
| `rand`, `uuid.New()` | `workflow.SideEffect` (records the value once) or generate it in an activity |
| HTTP calls, DB queries, reading files or env vars | an activity |
| iterating a Go map (random order) and acting on order | sort the keys first |

### Retries and timeouts

**In plain words:** you declare once how to retry a step (wait 1 s, then 2 s, then 4 s ...) and how long it may take; the engine does the rest.

**Step by step:**
1. `BookCourier` has StartToClose = 30 s, so any single attempt is cut off after 30 seconds.
2. The first attempt fails with a timeout from the courier API. The engine waits 1 s and tries again.
3. Further failures wait 2 s, 4 s, 8 s ... up to the maximum interval.
4. You set MaximumAttempts = 3. After the third failure the activity fails for good, and the workflow runs its compensation.
5. A "card declined" error is marked non-retryable, so it stops at once with no retries.

Activities get retry policies declared once, not hand-written loops. Temporal's default activity retry policy:

- first retry after 1 s,
- backoff coefficient 2.0,
- maximum interval 100 × the initial interval,
- unlimited attempts.

Only `ScheduleToClose` (or a `MaximumAttempts` you set) ends the retries; `StartToClose` bounds a single attempt:
- **StartToClose:** maximum time for one attempt. Always set it.
- **ScheduleToClose:** maximum time for all attempts together.
- **ScheduleToStart:** maximum time waiting in the queue for a worker.
- **Heartbeat timeout:** for long activities that report progress; a missed heartbeat fails the attempt early.

Non-retryable error types (for example "card declined") stop retries at once. Detail on backoff and jitter: [[Timeouts, Retries and Backoff]].

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** the replay idea on a napkin: each step first checks the history, and only does real work if it is not there yet.

```text
workflow order-7:
  reserve(sku-1)   -> history[0] = reserve ok
  charge(49900)    -> history[1] = charge pay_123
  ship(order-7)    -> worker dies mid-call, nothing recorded
new worker replays order-7 from the top:
  reserve -> history[0] exists -> return "ok", do NOT call inventory
  charge  -> history[1] exists -> return "pay_123", do NOT charge again
  ship    -> no history[2] -> really call the courier -> "trk-9"
  history[2] = ship trk-9 -> workflow returns "shipped"
if ship fails 3 times: refund(pay_123) -> "refunded"   (saga as code)
if a deploy reorders reserve/charge: replay sees charge where history
  says reserve -> nondeterminism error, execution stops for a fix
```

### Go: a toy durable-execution engine

**In plain words:** a small Go engine that saves step results and replays them after a fake crash, so you can see that no step runs twice.

This is a teaching model of the replay idea, not a Temporal client. `Ctx.Execute` either answers from history or runs the activity with retries and appends the result. `ErrWorkerCrash` simulates the worker dying mid-activity: nothing is recorded, so the step is retried after recovery.

```go
// Package workflow is a toy durable-execution engine. Workflow code calls
// activities through Ctx.Execute; every completed activity is appended to an
// event history. After a crash the workflow function runs again from the top
// and Execute answers from the history instead of re-running the activity.
package workflow

import (
	"errors"
	"fmt"
	"sync"
)

// Event is one entry of a workflow's history.
type Event struct {
	Activity string
	Result   string
	Err      string // non-empty if the activity failed after all retries
}

// Store is the durable history (Temporal keeps it in Cassandra, MySQL or PostgreSQL).
type Store struct {
	mu      sync.Mutex
	history map[string][]Event
}

func NewStore() *Store { return &Store{history: map[string][]Event{}} }

func (s *Store) Load(id string) []Event {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]Event(nil), s.history[id]...)
}

func (s *Store) Append(id string, e Event) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.history[id] = append(s.history[id], e)
}

// Activity does the side effect (call a payment API, send an email ...).
type Activity func(input string) (string, error)

// ErrNondeterminism means the workflow code no longer matches its history.
var ErrNondeterminism = errors.New("nondeterminism: workflow code changed")

// ErrWorkerCrash simulates the worker process dying mid-activity: nothing is
// recorded, so the activity runs again after recovery.
var ErrWorkerCrash = errors.New("worker crashed")

// Ctx is handed to workflow code.
type Ctx struct {
	id          string
	store       *Store
	history     []Event
	pos         int
	activities  map[string]Activity
	maxAttempts int
}

// Execute runs (or replays) the next activity.
func (c *Ctx) Execute(name, input string) (string, error) {
	if c.pos < len(c.history) {
		ev := c.history[c.pos]
		if ev.Activity != name {
			return "", fmt.Errorf("%w: history has %q at step %d, code asked for %q",
				ErrNondeterminism, ev.Activity, c.pos, name)
		}
		c.pos++
		if ev.Err != "" {
			return "", errors.New(ev.Err)
		}
		return ev.Result, nil
	}
	act, ok := c.activities[name]
	if !ok {
		return "", fmt.Errorf("unknown activity %q", name)
	}
	var res string
	var err error
	for attempt := 1; attempt <= c.maxAttempts; attempt++ {
		res, err = act(input)
		if errors.Is(err, ErrWorkerCrash) {
			return "", err
		}
		if err == nil {
			break
		}
	}
	ev := Event{Activity: name, Result: res}
	if err != nil {
		ev.Err = err.Error()
	}
	c.store.Append(c.id, ev)
	c.history = append(c.history, ev)
	c.pos++
	return res, err
}

// Engine runs workflow functions durably.
type Engine struct {
	Store       *Store
	Activities  map[string]Activity
	MaxAttempts int
}

// Run starts or resumes workflow id. Calling it again after a crash replays
// the history and continues where the previous run stopped.
func (e *Engine) Run(id string, wf func(*Ctx) (string, error)) (string, error) {
	c := &Ctx{
		id: id, store: e.Store, history: e.Store.Load(id),
		activities: e.Activities, maxAttempts: max(1, e.MaxAttempts),
	}
	return wf(c)
}
```

```go
package workflow

import (
	"errors"
	"fmt"
	"sync/atomic"
	"testing"
)

// orderWorkflow: reserve stock, charge the card, ship; refund if shipping fails.
func orderWorkflow(c *Ctx) (string, error) {
	if _, err := c.Execute("reserve", "sku-1"); err != nil {
		return "", err
	}
	payID, err := c.Execute("charge", "49900")
	if err != nil {
		return "", err
	}
	if _, err := c.Execute("ship", "order-7"); err != nil {
		if errors.Is(err, ErrWorkerCrash) {
			return "", err
		}
		if _, rerr := c.Execute("refund", payID); rerr != nil {
			return "", rerr
		}
		return "refunded", nil
	}
	return "shipped", nil
}

type counters struct{ reserve, charge, ship, refund atomic.Int32 }

func activities(n *counters, ship Activity) map[string]Activity {
	return map[string]Activity{
		"reserve": func(string) (string, error) { n.reserve.Add(1); return "ok", nil },
		"charge":  func(string) (string, error) { n.charge.Add(1); return "pay_123", nil },
		"ship":    func(in string) (string, error) { n.ship.Add(1); return ship(in) },
		"refund":  func(string) (string, error) { n.refund.Add(1); return "ok", nil },
	}
}

func TestResumeAfterCrashDoesNotChargeTwice(t *testing.T) {
	var n counters
	crashed := false
	e := &Engine{Store: NewStore(), MaxAttempts: 3, Activities: activities(&n, func(string) (string, error) {
		if !crashed {
			crashed = true
			return "", ErrWorkerCrash
		}
		return "trk-9", nil
	})}
	if _, err := e.Run("wf-1", orderWorkflow); !errors.Is(err, ErrWorkerCrash) {
		t.Fatalf("first run: %v", err)
	}
	out, err := e.Run("wf-1", orderWorkflow) // a new worker picks it up
	if err != nil || out != "shipped" {
		t.Fatalf("resume: %q %v", out, err)
	}
	if n.reserve.Load() != 1 || n.charge.Load() != 1 || n.ship.Load() != 2 {
		t.Fatalf("reserve=%d charge=%d ship=%d", n.reserve.Load(), n.charge.Load(), n.ship.Load())
	}
}

func TestRetriesThenCompensates(t *testing.T) {
	var n counters
	e := &Engine{Store: NewStore(), MaxAttempts: 3, Activities: activities(&n, func(string) (string, error) {
		return "", errors.New("carrier down")
	})}
	out, err := e.Run("wf-2", orderWorkflow)
	if err != nil || out != "refunded" {
		t.Fatalf("got %q %v", out, err)
	}
	if n.ship.Load() != 3 || n.refund.Load() != 1 {
		t.Fatalf("ship=%d refund=%d", n.ship.Load(), n.refund.Load())
	}
	// Replaying a finished workflow runs no activity again.
	if out, _ := e.Run("wf-2", orderWorkflow); out != "refunded" || n.charge.Load() != 1 {
		t.Fatalf("replay: %q charge=%d", out, n.charge.Load())
	}
}

func TestChangedCodeIsDetected(t *testing.T) {
	var n counters
	e := &Engine{Store: NewStore(), MaxAttempts: 1, Activities: activities(&n, func(string) (string, error) {
		return "", ErrWorkerCrash
	})}
	_, _ = e.Run("wf-3", orderWorkflow) // history: reserve, charge
	// New deployment swaps the order of the first two steps.
	v2 := func(c *Ctx) (string, error) {
		if _, err := c.Execute("charge", "49900"); err != nil {
			return "", err
		}
		return c.Execute("reserve", "sku-1")
	}
	_, err := e.Run("wf-3", v2)
	if !errors.Is(err, ErrNondeterminism) {
		t.Fatalf("want ErrNondeterminism, got %v", err)
	}
}

func TestManyWorkflowsConcurrently(t *testing.T) {
	var n counters
	e := &Engine{Store: NewStore(), MaxAttempts: 1, Activities: activities(&n, func(string) (string, error) {
		return "trk", nil
	})}
	done := make(chan error, 50)
	for i := 0; i < 50; i++ {
		go func(i int) {
			_, err := e.Run(fmt.Sprintf("wf-%d", i), orderWorkflow)
			done <- err
		}(i)
	}
	for i := 0; i < 50; i++ {
		if err := <-done; err != nil {
			t.Fatal(err)
		}
	}
	if n.charge.Load() != 50 {
		t.Fatalf("charge=%d", n.charge.Load())
	}
}
```

`go vet` is clean and `go test -race` passes (Go 1.24). The tests prove the four properties that matter: a resumed workflow does not charge twice, failed activities are retried and then compensated, changed workflow code is caught by replay, and many executions run concurrently without sharing state.

### The same flow in the Temporal Go SDK

**In plain words:** the same order flow written with the real Temporal library, including a 48-hour wait for the courier's reply.

For comparison, here is the same flow written against the real Temporal Go SDK (`go.temporal.io/sdk` v1.38.0). It adds the 48-hour wait for the courier's webhook, delivered as a signal. The activities are stubs here; in a real service they call the inventory, payment and courier APIs.

```go
package temporalwf

import (
	"context"
	"time"

	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"
)

func Reserve(ctx context.Context, orderID string) error          { return nil }
func Charge(ctx context.Context, orderID string) (string, error) { return "pay_123", nil }
func Refund(ctx context.Context, payID string) error             { return nil }

func OrderWorkflow(ctx workflow.Context, orderID string) (string, error) {
	ctx = workflow.WithActivityOptions(ctx, workflow.ActivityOptions{
		StartToCloseTimeout: 10 * time.Second,
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts:        3,
			NonRetryableErrorTypes: []string{"CardDeclined"},
		},
	})
	if err := workflow.ExecuteActivity(ctx, Reserve, orderID).Get(ctx, nil); err != nil {
		return "", err
	}
	var payID string
	if err := workflow.ExecuteActivity(ctx, Charge, orderID).Get(ctx, &payID); err != nil {
		return "", err
	}
	// Wait up to 48 hours for the courier's webhook, delivered as a signal.
	confirmed := false
	sel := workflow.NewSelector(ctx)
	sel.AddReceive(workflow.GetSignalChannel(ctx, "courier-confirmed"), func(c workflow.ReceiveChannel, _ bool) {
		c.Receive(ctx, nil)
		confirmed = true
	})
	sel.AddFuture(workflow.NewTimer(ctx, 48*time.Hour), func(workflow.Future) {})
	sel.Select(ctx)
	if !confirmed {
		_ = workflow.ExecuteActivity(ctx, Refund, payID).Get(ctx, nil)
		return "refunded", nil
	}
	return "shipped", nil
}
```

The SDK ships an in-memory test environment that runs workflows without a server and skips timers forward instantly, so the 48-hour branch tests in milliseconds:

```go
package temporalwf

import (
	"testing"
	"time"

	"go.temporal.io/sdk/testsuite"
)

func TestShippedWhenSignalled(t *testing.T) {
	var s testsuite.WorkflowTestSuite
	env := s.NewTestWorkflowEnvironment()
	env.RegisterActivity(Reserve)
	env.RegisterActivity(Charge)
	env.RegisterActivity(Refund)
	env.RegisterDelayedCallback(func() { env.SignalWorkflow("courier-confirmed", nil) }, time.Hour)
	env.ExecuteWorkflow(OrderWorkflow, "order-7")
	var out string
	if err := env.GetWorkflowResult(&out); err != nil || out != "shipped" {
		t.Fatalf("%q %v", out, err)
	}
}

func TestRefundAfter48h(t *testing.T) {
	var s testsuite.WorkflowTestSuite
	env := s.NewTestWorkflowEnvironment()
	env.RegisterActivity(Reserve)
	env.RegisterActivity(Charge)
	env.RegisterActivity(Refund)
	env.ExecuteWorkflow(OrderWorkflow, "order-7")
	var out string
	if err := env.GetWorkflowResult(&out); err != nil || out != "refunded" {
		t.Fatalf("%q %v", out, err)
	}
}
```

Both tests pass under `go vet` and `go test -race` (Go 1.24, SDK v1.38.0).

The 48-hour wait is a durable timer: no goroutine sleeps for 48 hours. The engine stores the timer and wakes the workflow when it fires or when the signal arrives.

## 5. Variants and comparison 🟡

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Temporal / Cadence | Workflow as code in Go, Java, TypeScript, Python and more; event history plus replay | Long-running, many-step business processes with compensation | A cluster (Temporal server plus Cassandra, MySQL or PostgreSQL) or Temporal Cloud; determinism discipline |
| AWS Step Functions | State machine in JSON (Amazon States Language); each state calls a Lambda or AWS API | AWS-native orchestration, few custom services | Logic in JSON, not code; per-transition pricing on Standard |
| Azure Durable Functions | Orchestrator functions replayed from history, like Temporal | Azure Functions shops | Azure lock-in; same determinism rules |
| Restate, DBOS, Inngest | Durable execution as a library or lightweight service, often journaling steps in a DB you already run | Smaller teams wanting durable steps without a big cluster | Younger ecosystems |
| Airflow, Argo Workflows | DAGs (graphs of tasks where each runs after the ones it depends on) of batch tasks on a schedule | Data pipelines, ETL (extract, transform, load: moving data into a warehouse), ML training | Not built for per-request workflows with signals and low latency |
| Hand-built state machine | Status column + queues + cron + webhook handlers | Two or three steps, short-lived | Recovery and retries are your code and your bugs |
| Choreography with events | Each service reacts to the previous one's event | Loosely coupled flows with no central owner | Hard to see the whole flow or change it; see [[Saga Pattern]] |

**Step Functions types:**

- Standard workflows run up to 1 year with exactly-once execution of each workflow step and full history.
- Express workflows run up to 5 minutes, priced per request and duration, for high-volume short flows.
- Asynchronous Express runs are at-least-once and synchronous Express runs are at-most-once.

## 6. Trade-offs and when not to use 🟡

- **Determinism discipline.** Every developer must know what may not appear in workflow code. Library upgrades or innocent refactors can break replay of running executions.
- **Versioning running workflows.** A workflow that waits 30 days runs on code you will change many times. You must branch with `workflow.GetVersion` (or route old executions to old workers with worker versioning) for every change that alters the command sequence.
- **History size.** Temporal limits one execution's history (warnings start at 10,240 events or 10 MB; the hard limit is 51,200 events or 50 MB). Infinite loops (a subscription renewing monthly forever) must call **Continue-As-New**, which starts a fresh run with the same workflow ID and an empty history.
- **Latency.** Each step is a round trip through the engine and a durable write. Fine for business processes; wrong for a hot path that must answer in 20 ms.
- **Payloads.** Activity inputs and results are stored in history. Keep them small (IDs, not files).
- **When not to use it:**
	- A single background job with a retry: use a job queue.
	- Stream processing of millions of events per second: use [[Stream Processing Basics]].
	- A simple two-step flow where an outbox plus one consumer is enough ([[Transactional Outbox and CDC]]).

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how the engine and workers pass tasks, why workflow code must be deterministic, how retries and timeouts work, and the same flow in a toy engine and in Temporal. **Next is the advanced part**: real deployments, the production failures, and how replay, at-least-once activities and versioning work under the hood.

- **Real systems:** Cadence was built at Uber and open-sourced in 2017; Temporal was forked from it in 2019 by Cadence's original authors. Typical uses: order and payment flows, onboarding and KYC (know your customer: identity checks) with human steps, infrastructure provisioning, subscription billing loops, and long-running sagas.
- **Failure modes → fixes:**
	- *Nondeterminism error after a deploy.* Workflow code changed the order or type of commands. Fix: wrap changes in `GetVersion`, run replay tests against saved histories in CI (the Go SDK has a `WorkflowReplayer` for this).
	- *Activity charged twice.* The activity succeeded but the worker died before reporting, so it was retried. Fix: pass a stable idempotency key (workflow ID plus activity name) to the payment API; see [[Idempotency and Idempotency Keys]].
	- *Workers overloaded or starving.* Task-queue backlog grows (schedule-to-start latency rises). Fix: scale workers per task queue; split slow activities onto their own queue.
	- *Huge histories.* Long loops or large payloads hit history limits. Fix: Continue-As-New and storing large data outside (an object store) with only a reference in history.
	- *Stuck workflows.* An activity with no StartToClose timeout waits forever on a hung call. Fix: always set timeouts and heartbeats for long activities.
- **What to monitor:** schedule-to-start latency per task queue (worker capacity), workflow and activity failure rates, nondeterminism errors (should be 0), activity retry counts, history length percentiles, number of open executions per workflow type.

## 8. Deep dive 🔴

- **Replay mechanics.** A worker usually keeps a running workflow cached in memory ("sticky execution") and only feeds it new events. Full replay happens on cache eviction, worker restart or a different worker taking over.
	- Replay compares each command the code produces with the next command recorded in history; a mismatch is a nondeterminism error and the workflow task fails (and is retried) until fixed code is deployed.
- **Why activities are at-least-once.** The engine records `ActivityTaskCompleted` only after the worker reports. If the worker dies after the side effect but before reporting, the engine sees a timeout and schedules another attempt. No engine can avoid this window, which is the same dual-write problem as in [[Transactional Outbox and CDC]].
- **Workflow code is exactly-once in effect.** Workflow code may execute many times, but its *decisions* are recorded once, because the history is the source of truth. That is why it may not have side effects of its own.
- **Signals, queries and updates.** Signals append an event and wake the workflow (fire and forget). Queries read the workflow's state without changing history. Updates (newer in Temporal) are a request/response: a validated change whose result the caller waits for.
- **Child workflows** give a large process its own history and failure boundary. **Workflow ID reuse policies** decide whether starting `order-7` again is rejected, allowed after completion, or terminates a running one, which gives you idempotent starts.
- **Durable execution vs event sourcing.** Both rebuild state by replaying a log. In [[Event Sourcing]] the log holds domain events and you write the fold. In a workflow engine the log holds *execution* events and the SDK replays your code over them.
- **Sagas as code.** Compensations become a `defer`-like list: after each successful step, push its undo onto a slice; on failure, run the slice in reverse. The engine makes sure the compensations themselves are retried until they succeed. The saga concept is in [[Saga Pattern]].

**Sagas as code** (undo in reverse on failure):

```mermaid
flowchart LR
    A["Reserve ok<br/>push 'release'"] --> B["Charge ok<br/>push 'refund'"] --> C["Ship fails"]
    C --> U1["Run 'refund'"] --> U2["Run 'release'"]
```

## 9. Interview questions 🔴

> [!question]- What is durable execution in one sentence?
> Running ordinary code whose progress is recorded step by step in a durable history, so that after a crash the code is replayed against the history and continues from the last completed step instead of restarting the whole process.

> [!question]- Why must workflow code be deterministic?
> Because recovery re-runs the code from the top and matches each command against the recorded history. If the code takes a different path (different time, random value, changed order), the commands no longer match and the engine cannot tell what already happened.

> [!question]- Does Temporal give you exactly-once side effects? (trap)
> No. Workflow decisions are recorded once, but activities run at least once: a worker can die after the side effect and before reporting completion. Make activities idempotent, for example with an idempotency key derived from the workflow ID.

> [!question]- How do you change the code of a workflow that has 10,000 running executions?
> Guard the change with `workflow.GetVersion` so old executions replay the old branch and new ones take the new branch, or use worker versioning to keep old executions on old workers. Test with a replayer against real histories before deploying.

> [!question]- Workflow engine vs choreographed events for a saga?
> An engine (orchestration) puts the whole flow in one place, with retries, timers and compensations, and makes the current state visible. Choreography keeps services decoupled but spreads the flow across consumers and makes it hard to see or change. Use orchestration when the flow has many steps, timeouts or compensations.

> [!question]- How does a workflow wait 30 days without holding a goroutine?
> `workflow.Sleep` records a timer in the engine and the workflow's state is just its history. No worker holds anything; when the timer fires, the engine schedules a workflow task and a worker replays and continues.

> [!question]- Step Functions Standard or Express?
> Standard for long-running (up to a year), low-volume flows needing exactly-once step execution and history. Express for high-volume, short (up to 5 minutes) flows such as event processing, where at-least-once (asynchronous) or at-most-once (synchronous) execution is acceptable and cost matters.

## 10. Cheat sheet 🟢

- Workflow = deterministic orchestration code; activity = side effect, retried, at-least-once.
- Engine stores event history; recovery = replay code against history.
- No `time.Now`, `rand`, goroutines or I/O in workflow code; use SDK equivalents or activities.
- Durable timers and signals replace cron scans and status columns.
- Always set StartToClose; make activities idempotent with a stable key.
- Version changes with `GetVersion`; replay-test histories in CI.
- Long loops → Continue-As-New (history limits: 51,200 events / 50 MB in Temporal).
- Step Functions: Standard (1 year, exactly-once steps) vs Express (5 min, at-least-once async / at-most-once sync).

## Self-check 🟢🟡

🟢 Easy

> [!question]- What does a workflow engine save after each finished step?
> The step's result, in the workflow's event history.

> [!question]- What is an activity?
> One step that touches the outside world, such as charging a card; it can fail and be retried.

> [!question]- After a crash, does the engine run finished steps again?
> No. It replays the code and returns the saved results for steps already in history.

🟡 Medium

> [!question]- Why can't workflow code call `time.Now()` directly?
> On replay the time is different, so the code could take another path than the one recorded in history.

> [!question]- Why must a charge activity still use an idempotency key?
> The worker can charge and die before reporting, so the engine retries the activity.

> [!question]- What do you do for a workflow that loops forever, like a monthly subscription?
> Call Continue-As-New regularly so the history starts fresh and stays under its size limit.

## Links

- **Before this:** [[Saga Pattern]], [[Background Jobs and Worker Pools]], [[Timeouts, Retries and Backoff]]
- **Next:** [[Stream Processing Basics]], [[Scheduled Jobs - Cron to Durable Schedulers]]
- **Compare with:** [[Event Sourcing]] (replaying domain events), [[Transactional Outbox and CDC]] (the same crash window, solved for one event), [[AWS SQS, SNS and EventBridge]]

### Watch on YouTube

- [Durable Execution (Temporal/Inngest) / Distributed Systems Deep Dives With Ex-Google SWE](https://www.youtube.com/watch?v=GT9k8OSjzX8) · Jordan has no life · 18 min · 38,177 views
- [What is Temporal? Durable Execution Explained](https://www.youtube.com/watch?v=PCZghg9ySrY) · The Data and AI Guy · 14 min · 14,990 views
