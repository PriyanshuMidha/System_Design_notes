---
tags: [rebuild/audit]
reviewed: 2026-11-02
---

# Audit F - LLD with Go

> [!info] What this is
> One block per old note: what it has, what is wrong, what to keep, where it goes, and the **must-cover outline** the rewrite follows. Verdicts: KEEP · POLISH · REWRITE · MERGE · SPLIT · DELETE. Depth 0 (definition only) to 5 (complete). The area plan is at the end. Back to [[Rebuild Plan]].

Scope: 17 root notes, 24 pattern notes, 19 practice notes, 15 LLD drawings, 2 scratch drawings (77 blocks).
Method: read every stripped copy (in this area the stripped copy equals the original apart from table separator rows; there is no template boilerplate). Read all Go code. Compiled every pattern note and every practice solution with Go 1.24.4. The compile harness and outputs are in `scratchpad/review/gocheck/`: `patterns_report.json`, `practice/practice_report.json`, and the scripts in `scratchpad/review/scripts/`.
The owner wrote none of this area by hand (`hand` = 0 for all 60 notes), and the only images are the drawing embeds.

---

## LLD with Go/ (root notes)

### Behavioral Patterns in Go
`LLD with Go/Behavioral Patterns in Go.md` · 144 lines · real 94 · depth 2 · MERGE→`17 LLD/Design Patterns Overview and Chooser`
- Has: a table of all 11 behavioral patterns (purpose, analogy, backend use, Go style), a category flowchart, and a "how to choose" decision flowchart.
- Problems: an overview only, with no mechanism. The Iterator Go-style row "`Next/HasNext`, callback, channel" is out of date: Go 1.23 range-over-func `iter.Seq` is idiomatic, and channel iterators leak a goroutine when the consumer stops early. The row "Mediator | checkout orchestration between services" confuses Mediator with Facade or an orchestrator. The category flowchart (B --> 11 boxes) only repeats the table. The Zepto example paragraph is copied in the Creational and Structural notes. The note has no links to the practice problems that use each pattern.
- Keep: the "Backend examples" and "Idiomatic Go style" tables, and the chooser flowchart after fixing the Mediator and Iterator rows.
- New home: `17 LLD/Design Patterns Overview and Chooser`
- Must cover (merged overview): GoF origin and the 3 categories · patterns that Go makes trivial (Strategy = func value, Iterator = range-over-func, Singleton = package var or sync.Once, Template Method = func taking a step interface) · patterns rarely needed in Go (Visitor, Interpreter, Flyweight, Memento, Prototype, Bridge, Mediator) · pattern → backend use table · pattern → stdlib example table (io.Reader/Writer decorators, http.Handler middleware, sort.Interface/slices.SortFunc strategy, database/sql driver as bridge + registry factory, slog.Logger/Handler, go/ast.Walk visitor, text/template interpreter, httputil.ReverseProxy proxy) · confusable pairs (Strategy vs State, Decorator vs Proxy vs Adapter, Facade vs Mediator, Factory vs Abstract Factory, Chain vs Decorator) · anti-patterns (pattern-itis, Java-style `IFoo`/`FooImpl` pairs)
- Diagrams: one flowchart chooser keyed on "what varies?" (algorithm / lifecycle / creation / wrapping / tree / event). Drop the per-category box diagrams.

### CodeWithAryan LLD Playlist Coverage Map
`LLD with Go/CodeWithAryan LLD Playlist Coverage Map.md` · 82 lines · real 56 · depth 1 · MERGE→`19 Interview & Career/Resource Maps/LLD Resources`
- Has: a course topic → vault note coverage table, a Java→Go translation table, and five CodeWithAryan source URLs.
- Problems: the "What was missing before this check ... These are now added" section is stale process notes. The coverage table points 6 course topics at a single note (LLD Interview Approach), and the course's "HLD vs LLD" topic is not actually explained there. The Java→Go table duplicates the tables in Go LLD Mental Model and UML. A resource map belongs in 19.
- Keep: the 5 source URLs, and the Java→Go row "synchronized → mutex or DB atomic update" (move it into the OOP in Go table).
- New home: `19 Interview & Career/Resource Maps/LLD Resources`
- Must cover: per resource (CodeWithAryan, Refactoring Guru, Effective Go, Go blog, GoF / Head First) what to use it for · tips for translating a Java course to Go · which vault note covers each course module (one line each) · what Java courses skip (concurrency, DB-level invariants, idempotency), so study those here
- Diagrams: none.

### Concurrency in Go LLD
`LLD with Go/Concurrency in Go LLD.md` · 298 lines · real 174 · depth 4 · POLISH
- Has: a primitive decision table, the check-then-act oversell timeline, lock-ordered Transfer, a bounded worker pool with backpressure, atomics, a DB-guarantee table, and an interview script.
- Problems: overlaps `golang backend/Go Concurrency Goroutines Channels` (29 unique lines); this note is much stronger. The "Where this shows up" table says the Rate Limiter is protected by a "mutex per bucket", but the practice code uses one limiter-wide mutex. `Wallet` exports `Balance` while guarding it with an unexported `mu`, so readers can skip the lock, and `Transfer` accepts amount ≤ 0. The worker pool silently drops queued jobs when ctx is cancelled. Missing: sync.Cond, semaphores (`x/sync/semaphore` or a buffered channel), `x/time/rate`, `atomic.Pointer` for copy-on-write config, lock striping, goroutine-owned state (an event loop as the alternative to a mutex), goleak, `WaitGroup.Go` (Go 1.25), and Redis lock fencing tokens.
- Keep: the decision table, the oversell timeline, the Store.Reserve and Transfer code, the Pool code, the DB-techniques table (conditional UPDATE, FOR UPDATE, optimistic version, unique constraint, idempotency key, `SET NX PX`), the "Where this shows up" table (after fixing it), the mistakes list, and the quick-revision block.
- New home: `17 LLD/Concurrency for LLD` (the primitives section links to `04 Go Language/Goroutines, Channels and sync`)
- Must cover: Go servers run every request in its own goroutine, so shared service state is shared memory · state the invariant first ("exactly one wins") · check-then-act inside one critical section · lock granularity: global → per entity → striped/sharded · lock ordering and deadlock · never hold a lock across I/O (decide under the lock, call outside, re-check) · RWMutex vs Mutex costs · atomics and atomic.Pointer config swap · goroutine-owned state (event loop / actor) vs mutex · bounded worker pool, backpressure, draining on shutdown · errgroup, singleflight, semaphore · multi-instance invariants: conditional UPDATE, SELECT … FOR UPDATE (SKIP LOCKED), optimistic version, unique and partial unique indexes, Redis SET NX PX + fencing token · proving it: N-goroutine winner tests, -race, goleak · interview script
- Diagrams: keep the "where does the invariant live" flowchart. Add a sequence diagram of the oversell race (two goroutines with interleaved lock sections) next to the fixed single-critical-section version, and a worker-pool flowchart (Submit → bounded queue → workers → retry/DLQ → drain on Stop).

### Creational Patterns in Go
`LLD with Go/Creational Patterns in Go.md` · 120 lines · real 59 · depth 2 · MERGE→`17 LLD/Design Patterns Overview and Chooser`
- Has: a 5-pattern table with analogies, a backend-examples table, a "how to choose" flowchart, and an idiomatic-Go table.
- Problems: an overview only. "Singleton | single DB connection pool/config" never notes that `*sql.DB` is already a pool you build in main and inject, not a global. The chooser flowchart mixes yes/no edges with label-only edges from the same node ("Many -->|clone template|"). The three-categories answer block is repeated in the Content Table and START HERE.
- Keep: the idiomatic Go style table, and the chooser after fixing the edge labels.
- New home: `17 LLD/Design Patterns Overview and Chooser`
- Must cover: see the Behavioral Patterns block (one merged overview).
- Diagrams: the merged chooser.

### DRY Principle in Go LLD
`LLD with Go/DRY Principle in Go LLD.md` · 110 lines · real 53 · depth 3 · MERGE→`17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Has: DRY explained as duplicated knowledge rather than duplicated lines, the CanCancel example, a duplication → pattern table, and "when DRY hurts".
- Problems: no rule of three, and no "the wrong abstraction costs more than duplication" (Sandi Metz). No Go angle ("A little copying is better than a little dependency"). The diagram is a generic two-path flowchart.
- Keep: the CanCancel bad/better code, the "DRY with design patterns" table, and the "When DRY can hurt" example.
- New home: `17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Must cover (merged note): DRY = one authoritative representation of each piece of knowledge (Pragmatic Programmer) · incidental vs real duplication · rule of three · cost of the wrong abstraction · Go proverb on copying vs dependencies · KISS: the simplest design that meets the use cases (fewer types, linear control flow, no reflection) · YAGNI: speculative generality, interfaces with one implementation · the DRY/KISS/YAGNI tension, with one worked pricing-rules example · composition over inheritance · cohesion and coupling · Law of Demeter / tell-don't-ask · separation of concerns (handler/service/repo) · interview phrasing
- Diagrams: one flowchart "should I abstract this?" (same knowledge? used 3+ times? real variation today? → abstract / keep concrete).

### Error Handling and Interfaces in Go LLD
`LLD with Go/Error Handling and Interfaces in Go LLD.md` · 198 lines · real 103 · depth 4 · SPLIT
- Has: interface rules (small, consumer-side, accept interfaces / return structs, compile-time check), generics vs interfaces, sentinel/typed/wrapped errors, and HTTP mapping at the edge.
- Problems: says "The service never imports `net/http`" but then declares `HTTPStatus` (which imports net/http) in `package booking`, the domain package. Move it to the handler/transport package. Missing: the typed-nil interface pitfall (`var e *ValidationError; return e` gives a non-nil error), `errors.Join` and multiple `%w` (Go 1.20), log-once-at-the-edge, and the retryable vs permanent error split. `LockSeat` mutates a map parameter with no lock (fine for a toy, but say so). Overlaps the thin `Go Error Handling` (26 unique lines), `Go Types Structs Interfaces` (22) and `api design/API Error Handling`; this note is stronger.
- Keep: the rules table, the StockReserver/PaymentCharger consumer-side example, the `var _ StockReserver = (*PostgresInventory)(nil)` line, the three-kinds-of-errors table, the ValidationError and wrapping code, the HTTPStatus switch (moved), and the mistakes list.
- New home: interfaces half → `17 LLD/OOP in Go - Structs, Interfaces, Embedding`; errors half → `04 Go Language/Errors - Sentinel, Typed, Wrapping` (its "domain errors → HTTP/gRPC status" section is linked from `05 APIs/API Error Handling`)
- Must cover (errors note): errors are values · sentinel vs typed vs opaque errors · wrapping with %w; errors.Is/As/Join; multiple %w · wrap once per layer with context · typed-nil interface trap · panic vs error (recover only at goroutine or HTTP boundaries) · a domain error package · mapping to HTTP and gRPC codes at the edge · log once, do not log-and-return · retryable vs permanent classification (used by the Notification and Cart retry loops) · testing with errors.Is
- Diagrams: keep the repo → service → handler error-flow flowchart and add a gRPC status branch. Add a decision tree: fixed condition → sentinel; needs data → typed; adds context → wrap.

### Go LLD Mental Model
`LLD with Go/Go LLD Mental Model.md` · 113 lines · real 62 · depth 3 · MERGE→`17 LLD/OOP in Go - Structs, Interfaces, Embedding`
- Has: an OOP→Go translation table, a handler/service/repo layering diagram, OrderService constructor-injection code, and a "when to use interfaces" list.
- Problems: says "inheritance → embedding/composition" but never explains how embedding behaves (method promotion, shadowing, no virtual dispatch). That is the most common Java→Go trap. Missing: method sets (why `T` may not satisfy an interface that `*T` does), enums with iota + String(), zero-value-useful constructors, `internal/` packages, and a composition root in main. The "InvoiceOps or Zepto-like" framing is personal; make it generic for sharing.
- Keep: the translation table, the layering diagram, the OrderService code, and the "When to use interfaces" and "Common mistakes" lists.
- New home: `17 LLD/OOP in Go - Structs, Interfaces, Embedding`
- Must cover: structs and methods; value vs pointer receivers · method sets and interface satisfaction · interfaces: implicit, small, consumer-side; accept interfaces, return structs; `var _ I = (*T)(nil)` · embedding: promotion, shadowing, no virtual dispatch (the Template-Method-by-embedding trap) · interface embedding (io.ReadWriter) · enums: typed consts + iota + String() + validation · NewX constructors, useful zero values, defaults · encapsulation through unexported fields and `internal/` · typed-nil interface pitfall · type switch vs polymorphism · generics vs interfaces (LRU[K,V]) · Java/OOP→Go translation table (merged from the Coverage Map and UML) · constructor DI and composition root in main (google/wire, uber/fx trade-offs)
- Diagrams: a class diagram showing embedding (Service embeds *Logger) next to interface realization (Repository ← Postgres/InMemory). A sequence diagram of the embedding trap: outer.Run() → embedded.Run() → embedded.step(), not outer.step().

### KISS Principle in Go LLD
`LLD with Go/KISS Principle in Go LLD.md` · 94 lines · real 37 · depth 2 · MERGE→`17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Has: the KISS definition, an over-abstracted interface vs a simple service, and "simple first, extensible where demanded".
- Problems: thin, and it overlaps YAGNI almost line for line. It gives no concrete measure of simplicity.
- Keep: the `OrderCreationAbstractFactoryProviderRegistry` bad example, and the rule "Simple first, extensible where the requirement demands it."
- New home: `17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Must cover: see the DRY block (merged).
- Diagrams: merged.

### LLD Interview Approach in Go
`LLD with Go/LLD Interview Approach in Go.md` · 155 lines · real 76 · depth 3 · MERGE→`17 LLD/LLD Interview Method`
- Has: a 10-step order, clarifying questions, movie-booking entities, relationships and core methods, a problem → pattern table, a Go file layout, and an interview script.
- Problems: the area has four different step orders: this note; the Practice Roadmap's 10 steps; Zepto's API → DB → entities; and the Content Table's "… Edge cases -> Code", which puts code after edge cases. "Step 4: Define relationships" lost its lead-in line. The coverage map sends "HLD vs LLD" here, but the note never explains it. It has no time boxes (those are in the Roadmap).
- Keep: the clarifying questions, the movie-booking example, the pattern table, the interview script, and the mistakes list.
- New home: `17 LLD/LLD Interview Method`
- Must cover: LLD vs HLD vs machine-coding rounds · one canonical 10-step method (requirements → actors/use cases → entities → relationships → APIs/methods → storage → patterns → core code → edge cases → tradeoffs) · how product-company rounds move API + schema earlier · a clarifying-question bank per problem type · choosing the hardest method to code · file layout for a 45-minute round (from Go LLD Folder Structure) · what to test (winner test, compensation test, fake clock) · narrating tradeoffs · common failure modes · the evaluator's rubric
- Diagrams: a flowchart of the 10 steps with time boxes, plus one worked class + sequence sketch (movie booking) as the example.

### LLD with Go - START HERE
`LLD with Go/LLD with Go - START HERE.md` · 139 lines · real 84 · depth 1 · MERGE→`17 LLD/00 LLD Map`
- Has: a study-order list, one-liners for principles and categories, the full GoF link list, revise questions, and practice links.
- Problems: navigation only. The study-order numbering repeats 7, 8, 9 (after item 9 it restarts at "7. Creational"). "Practice problems from course style" lists only Logging. The roadmap mermaid ends at a single problem. It duplicates the Content Table (two MOCs for one folder). It never links Elevator.
- Keep: the six "How to revise" questions (move into the MOC).
- New home: `17 LLD/00 LLD Map`
- Must cover (MOC): ordered path principles → OOP in Go → UML → method → patterns (common first, rare last) → concurrency/testing → practice levels 1-3 → cheat sheet · a one-line purpose per note · revision questions · links to the 19 round playbook and resource map
- Diagrams: one roadmap flowchart (principles → patterns → practice levels).

### LLD with Go Content Table
`LLD with Go/LLD with Go Content Table.md` · 196 lines · real 117 · depth 2 · MERGE→`17 LLD/00 LLD Map`
- Has: a second study path, the category Q&A, principle and pattern tables, a 27-node GoF mermaid tree, the pattern → backend/Zepto mapping table, and run instructions.
- Problems: a duplicate MOC. The "Backend-specific patterns" heading is empty. It claims every pattern note runs as one `package main` file with `go run main.go`. That fails for Factory, Facade and Mediator (compile errors, see the pattern blocks). Decorator blocks forever on `ListenAndServe`. The `fmt` import is missing from 23 of 24 main blocks, so "add the imports shown by the code" does not work. The interview target order "… Edge cases -> Code" contradicts the other notes. The 27-node tree is a list drawn as a diagram.
- Keep: the "What each pattern maps to in backend" table (the best table in the area) → Overview note.
- New home: `17 LLD/00 LLD Map`
- Must cover: see the START HERE block.
- Diagrams: only the MOC roadmap.

### SOLID Principles in Go LLD
`LLD with Go/SOLID Principles in Go LLD.md` · 131 lines · real 60 · depth 3 · POLISH
- Has: a SOLID table with Go translations, code per principle (god handler, PricingStrategy, fat repository interface), and a Zepto mapping.
- Problems: the LSP example ("MockGateway returns success but does not validate amount. Tests may lie.") is about unfaithful fakes, not substitutability. LSP means honoring the interface's behavioral contract. Better examples: one repository returns `(nil, nil)` for not-found where the contract says `ErrNotFound`; an `io.Writer` returns n < len(p) with a nil error. OCP is shown only as Strategy (no registry or new-type extension). The note never says that SOLID in Go is mostly ISP + DIP through consumer-side interfaces, and it has no over-application warning.
- Keep: the table, the SRP god handler, the ISP fat UserRepository, and the Zepto mapping list.
- New home: `17 LLD/SOLID in Go`
- Must cover: origin (Robert C. Martin) · SRP as "one reason to change = one actor" · OCP through interfaces, strategies and registries, and its cost · LSP as a behavioral contract (pre/postconditions, error semantics) with io.Writer and repository examples · ISP through io.Reader/Writer/ReadWriter composition · DIP through consumer-owned interfaces and constructor injection · package-level design (internal/, acyclic imports) · where SOLID conflicts with KISS/YAGNI · refactoring one god handler into handler/service/repo/gateway step by step · interview answer
- Diagrams: a before/after class diagram (god handler vs service with two consumer-side interfaces). Keep the existing dependency flowchart.

### Structural Patterns in Go
`LLD with Go/Structural Patterns in Go.md` · 121 lines · real 68 · depth 2 · MERGE→`17 LLD/Design Patterns Overview and Chooser`
- Has: a 7-pattern table with analogies, a backend-examples table, a chooser flowchart, an idiomatic-Go table, and a Zepto mapping.
- Problems: an overview only. In the chooser, every branch starts from one node with no exclusive conditions. There is no confusable-pair guidance, although Decorator, Proxy and Adapter all "wrap".
- Keep: the idiomatic Go style table and the backend examples table.
- New home: `17 LLD/Design Patterns Overview and Chooser`
- Must cover: see the Behavioral Patterns block.
- Diagrams: merged.

### Testing LLD Code in Go
`LLD with Go/Testing LLD Code in Go.md` · 254 lines · real 145 · depth 4 · POLISH
- Has: a checkout service with fakes, a table-driven test, a 50-goroutine last-item winner test, an injectable clock, and a fakes vs mocks table.
- Problems: overlaps the thin `golang backend/Go Testing` (26 unique lines) and `testing strategy/Unit Integration E2E Tests`; this note is stronger. The Fake clock is not goroutine-safe (`Advance` racing with `Now` from service goroutines is a data race). Missing: `testing/synctest` (experimental in Go 1.24, GA in 1.25) for time + goroutine tests, goleak, fuzzing, benchmarks with `b.Loop`, golden files, and contract tests that keep fakes honest against the real repository.
- Keep: all the code (Service + FakeInventory/FakePayment, TestCheckout, TestCheckout_LastItemOnlyOneWinner, the clock package), the fakes vs mocks table, and the mistakes list.
- New home: `17 LLD/Testing LLD Code` (generic mechanics cross-linked to `04 Go Language/Testing in Go` and `15 Testing/Unit Integration E2E`)
- Must cover: what to test in an LLD (happy path, rule failures, concurrent invariants, compensation, time rules) · table-driven tests, t.Run, t.Parallel caveats · fakes vs stubs vs mocks (consumer-side interfaces keep fakes tiny) · contract tests run against both fake and real repo · concurrency tests: N goroutines, a start barrier, atomic winner count, -race, -count=N · thread-safe fake clock and testing/synctest · deterministic IDs and randomness · goroutine-leak checks · fuzzing parsers (the File Search expression parser) · benchmarks for hot paths (LRU Get) · coverage as a signal, not a goal
- Diagrams: keep the test-doubles flowchart. Add a sequence diagram of the concurrent winner test (barrier → N Checkout calls → exactly one success).

### UML for LLD Interviews
`LLD with Go/UML for LLD Interviews.md` · 172 lines · real 107 · depth 4 · POLISH
- Has: the three-diagram rule, a relationship table with Mermaid syntax and Go form, class / sequence (alt failure path) / state examples, a Java UML→Go table, and a 5-minute whiteboard order.
- Problems: minor. The Go-form column suggests that `[]B` vs `[]*B` decides composition vs aggregation; in Go it is lifecycle ownership that decides, not the slice type. There is no summary of visibility and multiplicity notation. It does not say that clear boxes-and-arrows (Excalidraw) are acceptable if relationships and multiplicity are shown.
- Keep: everything (both tables, the three mermaid examples, the whiteboard order, the mistakes list).
- New home: `17 LLD/UML for LLD`
- Must cover: class notation (visibility, multiplicity, `<<interface>>`) · the six relationships with their Go mapping and the lifecycle-ownership rule · sequence diagrams with alt/opt/loop/par and failure paths · state diagrams with guards, timeouts and terminal states · a use-case bullet list instead of a use-case diagram · when an activity diagram is worth it (multi-step workflows) · whiteboard order and time box · Mermaid vs Excalidraw for practice · mapping a class diagram to Go files · mistakes
- Diagrams: keep the three. Add a Go-specific class diagram contrasting embedding with interface realization.

### YAGNI Principle in Go LLD
`LLD with Go/YAGNI Principle in Go LLD.md` · 82 lines · real 37 · depth 2 · MERGE→`17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Has: the YAGNI definition, an over-built payment class list, four "before adding an interface" questions, and a problem → pattern table.
- Problems: thin, and it overlaps KISS.
- Keep: the four interface questions and the real-problem → pattern table.
- New home: `17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion`
- Must cover: see the DRY block.
- Diagrams: merged.

### Zepto SDE1 LLD Round Pattern
`LLD with Go/Zepto SDE1 LLD Round Pattern.md` · 149 lines · real 77 · depth 3 · POLISH (move to 19)
- Has: what the round mixes, a Zepto-style question → skill table, a 60-minute time plan, PlaceOrder code, a schema, edge cases, and the atomic-UPDATE answer.
- Problems: the `## Diagram` heading is empty. `PlaceOrder` reserves inventory and then calls `Save`; if Save fails it returns without releasing the reservation, so stock leaks. Status is the raw string `"reserved"` (contradicts the DRY and State notes). The SDE-1 framing sits in an SDE-3 vault. The company claims cannot be checked (verify: treat them as anecdotal). The time plan disagrees with the Practice Roadmap's time boxes.
- Keep: the question → skill table, the time table, the schema, the edge-case list, and the "update only if available_qty >= requested" answer.
- New home: `19 Interview & Career/Company Rounds/Zepto-style Product LLD Round`
- Must cover: round formats (machine coding vs design discussion) · typical product-domain problems mapped to vault practice notes · time plan · why API + schema come first in product rounds · invariants they probe (overselling, double assignment, idempotent retries) · what an SDE-3 adds (multi-instance correctness, failure paths, observability, rollout) · opening script · post-round self-review checklist
- Diagrams: none (link the practice drawings). Remove the empty heading.

---

## LLD with Go/patterns/

### Abstract Factory Pattern in Go
`LLD with Go/patterns/Abstract Factory Pattern in Go.md` · 119 lines · real 60 · depth 3 · MERGE→`17 LLD/Patterns/Factory and Abstract Factory`
- Has: UIFactory light/dark families and a NewUIFactory selector. The backend family (Razorpay charge/refund/webhook verifier) appears in prose only. Builds, and the output matches the note.
- Problems: the UI-theme example is frontend-flavored and the backend family is never coded. No stdlib example (`database/sql/driver`: Driver → Conn → Stmt/Tx is a product family). Zero outgoing links.
- Keep: the code as a contrast example, and the Razorpay family paragraph.
- New home: `17 LLD/Patterns/Factory and Abstract Factory`
- Must cover: simple factory function vs factory method vs abstract factory · returning interfaces (and when to return a concrete type) · registry factory with self-registration in `init` (`sql.Register`, `image.RegisterFormat`) and its global-state cost · a config-driven provider family (PaymentGateway + RefundGateway + WebhookVerifier from one ProviderFactory) · typed error for an unknown kind · typed-nil interface trap when returning `(Notifier, error)` · when a `map[string]func() Notifier` is enough · testing with a fake family · where it is used (Splitwise NewSplitStrategy, Notification SenderFactory)
- Diagrams: a class diagram of the payment provider family (ProviderFactory interface, Razorpay/Stripe factories, three product interfaces).

### Adapter Pattern in Go
`LLD with Go/patterns/Adapter Pattern in Go.md` · 100 lines · real 44 · depth 3 · POLISH
- Has: a PaymentGateway interface, a RazorpayClient SDK shape and a RazorpayAdapter. Builds, and the output matches.
- Problems: the adapter ignores `ctx` and does not normalize errors, which are exactly the two mistakes its own "Common mistakes" list warns about. No `http.HandlerFunc`, the canonical Go function → interface adapter. No compile-time check. No anti-corruption-layer framing.
- Keep: the code and the real-life paragraph.
- New home: `17 LLD/Patterns/Adapter`
- Must cover: intent (you own the target interface and adapt the external one to it) · object adapter wrapping an SDK · function adapters (http.HandlerFunc, DispenserFunc, ValidatorFunc) · mapping provider errors to domain errors, retryable vs permanent · timeouts for SDK calls that take no ctx · anti-corruption layer · `var _ PaymentGateway = (*RazorpayAdapter)(nil)` · testing with a fake SDK · Adapter vs Facade vs Decorator vs Proxy · where it is used (Delivery PorterAdapter, Notification SMS/WhatsApp adapters)
- Diagrams: a class diagram: PaymentService → PaymentGateway ← RazorpayAdapter → Razorpay SDK.

### Bridge Pattern in Go
`LLD with Go/patterns/Bridge Pattern in Go.md` · 94 lines · real 42 · depth 2 · MERGE→`17 LLD/Patterns/Rare GoF Patterns in Go`
- Has: a Report struct holding an Exporter interface, and CSV/PDF exporters. Builds, and the output matches.
- Problems: there is only one abstraction type (`Report`), so the second independent axis is missing; as written it is Strategy. Both exporters return the title bytes. The diagram shows Sales and Inventory reports that the code does not have.
- Keep: the report type × export format motivation (avoids InvoicePDFReport-style class explosion).
- New home: `17 LLD/Patterns/Rare GoF Patterns in Go` (Bridge section)
- Must cover (Rare GoF note): for each pattern, give the intent, the one situation where it pays off in Go, a real stdlib example, and the ~10-line Go form. Bridge: slog.Logger ↔ slog.Handler, database/sql DB ↔ driver. Prototype: struct value copy; slices.Clone/maps.Clone are shallow; deep-copy rules. Flyweight: `unique.Make` interning (Go 1.23), shared immutable metadata; sync.Pool is not a flyweight. Visitor: type switch first; go/ast.Walk/Inspect; fs.WalkDir callback. Interpreter: text/template, regexp, CEL/expr-lang; parser + AST + Eval. Memento: struct snapshot, capped undo stack, DB savepoints. Mediator: chat room or form widgets that talk only through the mediator. Close with why each is rare in Go backends.
- Diagrams: one small class diagram per pattern (Bridge: two hierarchies joined by the bridge field).

### Builder and Functional Options Pattern in Go
`LLD with Go/patterns/Builder and Functional Options Pattern in Go.md` · 107 lines · real 57 · depth 3 · POLISH
- Has: an APIClient with WithBaseURL/WithTimeout/WithRetries and defaults set in the constructor. Builds, and the output matches.
- Problems: options cannot fail (no `func(*Client) error` variant) and there is no validation after applying them, though both are listed as mistakes. No real library examples (`grpc` DialOption, `zap.Option`, otel options). No comparison with a config struct (`http.Server{...}`) or a chained builder (SQL query builders).
- Keep: the code.
- New home: `17 LLD/Patterns/Builder and Functional Options`
- Must cover: the telescoping-constructor problem · config struct vs functional options vs chained builder (strings.Builder, SQL builders) · Option as func vs Option interface (grpc style) · error-returning options plus a final Validate · defaults and zero values · option order and override semantics · options for test injection (WithClock, WithLogger) · when not to use it (2-3 fields) · real examples (grpc, zap, otel)
- Diagrams: a sequence diagram: NewClient(opts…) → set defaults → apply each option → validate → return client or error.

### Chain of Responsibility Pattern in Go
`LLD with Go/patterns/Chain of Responsibility Pattern in Go.md` · 114 lines · real 56 · depth 3 · POLISH
- Has: a Validator interface, a Chain slice runner and a QuantityValidator. Builds, and the output matches.
- Problems: the text says each step "can accept, reject, or pass forward", but the code can only reject or pass; no handler can stop the chain with a success. That makes it a validation pipeline, not classic CoR. Fail-fast only (no collect-all with `errors.Join`). Never connects to http middleware, which is the real Go CoR.
- Keep: the code and the real-life paragraph.
- New home: `17 LLD/Patterns/Chain of Responsibility and Pipelines`
- Must cover: classic CoR (the first handler that can handle it wins: ATM cash dispenser 2000/500/100, support escalation) vs pipeline (every step must pass) · linked handlers vs a slice of handlers · func-typed handlers (ValidatorFunc) · fail-fast vs collect-all (errors.Join) · ordering, cheap checks first · short-circuit on success · http middleware as CoR · per-step context and timeouts · structured validation errors · where it is used (Cart Checkout coupon chain, Logging LevelFilter → FormatHandler)
- Diagrams: a flowchart of the coupon validation chain with reject exits, and a sequence diagram of the ATM dispenser variant.

### Command Pattern in Go
`LLD with Go/patterns/Command Pattern in Go.md` · 91 lines · real 40 · depth 2 · POLISH
- Has: a Command interface and a CancelOrderCommand wrapping a service. Builds, and the output matches.
- Problems: lists undo/redo and job queues as uses but shows neither (no Undo, no queue or worker, no serialization for durable jobs). No closure form (`func(ctx) error`), which is the usual Go command. No idempotency key, though retries are claimed.
- Keep: the code.
- New home: `17 LLD/Patterns/Command, Undo and Memento`
- Must cover: command as object vs closure · invoker, receiver and command roles · queueing and worker execution · serializable commands for durable jobs (type + JSON payload + registry) · idempotency key and retries · undo/redo with inverse commands vs Memento snapshots · command log / audit trail · CQRS commands (link 10) · Go examples (exec.Cmd, errgroup.Go(func)) · where it is used (Movie booking sweeper, Delivery retry, Elevator follow-up)
- Diagrams: a sequence diagram: API → enqueue Command → worker → Execute → retry/DLQ. A class diagram for the undo/redo stacks.

### Composite Pattern in Go
`LLD with Go/patterns/Composite Pattern in Go.md` · 98 lines · real 49 · depth 3 · POLISH
- Has: a CatalogNode interface, a Product leaf, and a Category group with recursive CountProducts. Builds, and the output matches.
- Problems: the mistakes list mentions cycle prevention and depth limits, but the code shows neither. No stdlib examples (io.MultiWriter, errors.Join, io/fs trees, html.Node). No link to File Search, which is the vault's full Composite example.
- Keep: the code.
- New home: `17 LLD/Patterns/Composite`
- Must cover: a uniform leaf/composite interface · recursive operations (count, total price, search) · iterative traversal with a stack or queue for deep trees · cycle detection and depth limits · where the mutation API lives (Add only on the composite) · composites of behavior (io.MultiWriter, errors.Join, multi-handler) · persisting trees (adjacency list, closure table, materialized path) · where it is used (File Search, category trees, org charts, comment threads)
- Diagrams: a class diagram Node ← Product, Category (Category o-- Node), plus one example tree.

### Decorator Middleware Pattern in Go
`LLD with Go/patterns/Decorator Middleware Pattern in Go.md` · 103 lines · real 45 · depth 3 · POLISH
- Has: Logging and Auth net/http middleware composed as `Logging(Auth(final))`. Builds and vets, but main blocks on `ListenAndServe`, so there is no output to compare.
- Problems: the diagram order "Request → Auth → Rate → Log → Handler" contradicts the code, where Logging is outermost and no rate-limit middleware exists. The logging middleware cannot log the status code (it needs a ResponseWriter wrapper). The "Example output" needs a live server plus curl; use `httptest.NewRecorder` in main. No non-HTTP decorators (io.Reader/Writer stacks: bufio, gzip, io.LimitReader, io.TeeReader; client-side http.RoundTripper). No embedding-based partial decorator (`type cachedRepo struct{ Repository }` overriding one method).
- Keep: both middleware functions and the "When not to use" rule (no business logic in middleware).
- New home: `17 LLD/Patterns/Decorator and Middleware`
- Must cover: decorator = same interface + added behavior · the `func(http.Handler) http.Handler` type and chain helpers · ordering (recover outermost → request ID → logging → auth → rate limit) · capturing status and bytes with a ResponseWriter wrapper and its Flusher/Hijacker pitfalls · io.Reader/Writer decorator stacks · RoundTripper decorators (retry, auth, tracing) · repository decorators (cache, metrics) through interface embedding · request-scoped values in context · testing with httptest · Decorator vs Proxy vs Adapter
- Diagrams: a sequence diagram of one request through recover → logging → auth → handler and back, with the status captured on the way out.

### Facade Pattern in Go
`LLD with Go/patterns/Facade Pattern in Go.md` · 110 lines · real 53 · depth 2 · POLISH
- Has: a checkout Service over InventoryService, PaymentService and OrderService interfaces.
- Problems: does not compile with the note's recipe: `./main.go:41:27: undefined: fakeInventory`, `./main.go:41:44: undefined: fakePayment`, `./main.go:41:59: undefined: fakeOrders`. On payment failure the reserved stock is never released, which is the "no compensation" mistake the note itself lists. It does not distinguish facade, application service and orchestrator.
- Keep: the interfaces and the Checkout skeleton (add the fakes and the compensation).
- New home: `17 LLD/Patterns/Facade (vs Mediator)`
- Must cover: intent (one simple API over a subsystem) · the application-service facade in Go backends · compensation inside a facade (release stock when payment fails; link Cart Checkout's saga) · idempotency key at the facade · keeping it thin (no business rules, no HTTP parsing) · stdlib facades (http.Get over Client/Transport, os.ReadFile) · Facade vs Mediator vs Adapter · testing with fakes · how to split a god facade
- Diagrams: a sequence diagram of Checkout with an alt branch "payment failed → Release(stock)".

### Factory Pattern in Go
`LLD with Go/patterns/Factory Pattern in Go.md` · 107 lines · real 48 · depth 3 · MERGE→`17 LLD/Patterns/Factory and Abstract Factory`
- Has: a Notifier interface, three notifiers, and a `NewNotifier(channel)` switch.
- Problems: does not compile with the note's recipe. The "How main calls it" block redefines the Send method: `./main.go:35:22: method EmailNotifier.Send already declared at ./main.go:14:22`. The unknown-channel case returns an untyped `errors.New`. No registry variant, and no typed-nil caveat.
- Keep: the code (drop the duplicate method; make the notifiers print).
- New home: `17 LLD/Patterns/Factory and Abstract Factory`
- Must cover: see the Abstract Factory block.
- Diagrams: see the Abstract Factory block.

### Flyweight Pattern in Go
`LLD with Go/patterns/Flyweight Pattern in Go.md` · 96 lines · real 46 · depth 2 · MERGE→`17 LLD/Patterns/Rare GoF Patterns in Go`
- Has: a ProductFactory caching shared `*ProductData`, and a CartItem holding the extrinsic Qty. Builds, and the output matches.
- Problems: the factory map is not goroutine-safe. `Get(sku, name, brand)` silently returns the cached data even when name or brand differ. No mention of Go's `unique` package (Go 1.23 interning, which is the stdlib flyweight). Rarely needed in Go backends; the note should say so.
- Keep: the intrinsic vs extrinsic explanation.
- New home: `17 LLD/Patterns/Rare GoF Patterns in Go` (Flyweight section)
- Must cover: see the Bridge block.
- Diagrams: see the Bridge block.

### Interpreter Pattern in Go
`LLD with Go/patterns/Interpreter Pattern in Go.md` · 93 lines · real 43 · depth 2 · MERGE→`17 LLD/Patterns/Rare GoF Patterns in Go`
- Has: an Expression interface with StatusExpr, MaxPriceExpr and AndExpr. Builds, and the output matches.
- Problems: the diagram says `price < 500` but MaxPriceExpr uses `<=`. No parser (the hard part) and no Or/Not. No real Go examples (text/template, regexp, go/parser, CEL/expr-lang). File Search already has a better parsed AND/OR/NOT filter.
- Keep: the expression structs, as the AST half.
- New home: `17 LLD/Patterns/Rare GoF Patterns in Go` (Interpreter section; link File Search)
- Must cover: see the Bridge block.
- Diagrams: an AST diagram for `ext=.go AND NOT size>1MB` (reuse File Search drawing section 2).

### Iterator Pattern in Go
`LLD with Go/patterns/Iterator Pattern in Go.md` · 91 lines · real 42 · depth 2 · REWRITE
- Has: a slice-backed HasNext/Next iterator. Builds, and the output matches.
- Problems: "In Go, this is often done with channels, callback functions, or simple `Next` methods" is out of date. Since Go 1.23, range-over-func (`iter.Seq`, `iter.Seq2`, `iter.Pull`) is the idiomatic form, and channel iterators leak a goroutine when the consumer breaks early. `Next()` panics past the end. The diagram shows DB pages but the code iterates a slice. No error-carrying iteration (the `sql.Rows` / `bufio.Scanner` Next/Err/Close style).
- Keep: only the paginated-orders motivation.
- New home: `17 LLD/Patterns/Iterator and range-over-func`
- Must cover: why iterators (hide storage, lazy evaluation, paging) · Next/Err/Close style (sql.Rows, bufio.Scanner) and checking Err after the loop · callback style with early stop (fs.WalkDir, sync.Map.Range) · range-over-func: iter.Seq/Seq2, yield returning false, cleanup with defer · iter.Pull and its stop func · a paginated DB iterator (keyset pagination) that surfaces errors · composing iterators (filter/map with generics, slices.Collect, maps.Keys) · why channel iterators leak and cost more · iterators are not goroutine-safe · testing early-break paths
- Diagrams: a sequence diagram of a range-over-func paginated iterator (for-range → yield → fetch next page → stop on break).

### Mediator Pattern in Go
`LLD with Go/patterns/Mediator Pattern in Go.md` · 98 lines · real 46 · depth 1 · MERGE→`17 LLD/Patterns/Facade (vs Mediator)`
- Has: a CheckoutMediator calling inventory → payment → orders.
- Problems: does not compile with the note's recipe: `undefined: InventoryService`, `undefined: PaymentService`, `undefined: OrderService`, `undefined: Request` (×2), `undefined: fakeInventory`, `undefined: fakePayment`, `undefined: fakeOrders`. The code is the Facade checkout copied: one-way orchestration. It never shows what defines a Mediator (colleagues hold a reference to the mediator and notify it; the mediator routes between them). The bidirectional diagram has no counterpart in the code.
- Keep: the sentence "If it only simplifies a public API, call it Facade."
- New home: contrast section in `17 LLD/Patterns/Facade (vs Mediator)`; the full form goes in `17 LLD/Patterns/Rare GoF Patterns in Go`
- Must cover: a colleague → mediator notify example (chat room, form widgets, air-traffic control) · how it differs from Facade (bidirectional vs one-way) and from an event bus (the mediator owns the routing logic) · the god-mediator risk
- Diagrams: a sequence diagram: Colleague A → Mediator.Notify(event) → Colleague B.Update.

### Memento Pattern in Go
`LLD with Go/patterns/Memento Pattern in Go.md` · 94 lines · real 45 · depth 2 · MERGE→`17 LLD/Patterns/Command, Undo and Memento`
- Has: a Draft with Save() and Restore(Snapshot) over unexported fields. Builds, and the output matches.
- Problems: no caretaker or history stack, and no history cap. `Save` builds a struct literal where a conversion works (staticcheck S1016, trivial). The real Go uses are missing: struct value copy, DB savepoints, event-sourcing snapshots.
- Keep: the code.
- New home: `17 LLD/Patterns/Command, Undo and Memento`
- Must cover: see the Command block, plus a capped caretaker stack, deep-copying slices and maps in snapshots, and memento vs inverse command (memory vs complexity).
- Diagrams: see the Command block.

### Observer Pattern in Go
`LLD with Go/patterns/Observer Pattern in Go.md` · 107 lines · real 50 · depth 3 · POLISH
- Has: an EventBus map of handlers with Subscribe/Publish, and an outbox mention. Builds, and the output matches.
- Problems: the handlers map is unguarded, so Subscribe running during Publish is a data race. Publish returns on the first handler error, so later observers never receive the event. Synchronous only. No unsubscribe. No async channel fan-out and no slow-subscriber policy.
- Keep: the code (fixed), the "publish after commit, use outbox" interview answer, and the mistakes list.
- New home: `17 LLD/Patterns/Observer and Event Bus`
- Must cover: subject/observer roles · an in-process bus guarded by RWMutex (copy the handler slice before calling) · sync vs async delivery (goroutine per handler vs buffered channel per subscriber) · error isolation (errors.Join, per-handler logging) · slow-subscriber policy (drop, block, buffer) · unsubscribe and leak avoidance · ordering guarantees · publish after commit and the transactional outbox · idempotent consumers · stdlib examples (os/signal.Notify, context.AfterFunc) · where it is used (Food StatusListener, Library Notifier, Inventory EventPublisher)
- Diagrams: a sequence diagram: OrderService → commit + outbox row → relay → bus → three handlers, one failing without blocking the others.

### Prototype Pattern in Go
`LLD with Go/patterns/Prototype Pattern in Go.md` · 91 lines · real 42 · depth 2 · MERGE→`17 LLD/Patterns/Rare GoF Patterns in Go`
- Has: InvoiceTemplate.Clone with a copied LineItem slice. Builds, and the output matches.
- Problems: rarely needed in Go, because plain struct assignment already copies values. `copy()` gives a deep copy here only because LineItem has no pointers or maps; the note does not say so. No mention of slices.Clone / maps.Clone (both shallow).
- Keep: the code and the line "The output proves the clone has its own copied item slice".
- New home: `17 LLD/Patterns/Rare GoF Patterns in Go` (Prototype section)
- Must cover: see the Bridge block.
- Diagrams: see the Bridge block.

### Proxy Pattern in Go
`LLD with Go/patterns/Proxy Pattern in Go.md` · 105 lines · real 52 · depth 3 · POLISH
- Has: a CachedProductService wrapping ProductService with a map cache. Builds, and the output matches.
- Problems: the cache map is unguarded, so concurrent GetProduct calls race (and can crash with a fatal concurrent map write). No TTL or invalidation (listed as a mistake, no fix shown). No singleflight for concurrent misses. No Proxy vs Decorator distinction. No real examples (httputil.ReverseProxy as a remote proxy; a lazy proxy built on sync.OnceValue).
- Keep: the code (add a mutex and TTL) and the call-once output demo.
- New home: `17 LLD/Patterns/Proxy`
- Must cover: kinds of proxy (caching, protection/auth, remote, virtual/lazy, rate-limited) · same interface as the subject · caching proxy with RWMutex + TTL + singleflight · negative caching · auth proxy reading the principal from ctx · remote proxy (gRPC stub, ReverseProxy) · lazy init with sync.OnceValue · Proxy vs Decorator (intent; who creates the subject) vs Adapter · metrics and timeouts · link the Cache Stampede and Caching Patterns notes
- Diagrams: a sequence diagram of hit and miss, with singleflight collapsing two concurrent misses into one backend call.

### Repository Pattern in Go
`LLD with Go/patterns/Repository Pattern in Go.md` · 111 lines · real 48 · depth 3 · POLISH
- Has: an Order Repository interface and an InMemoryRepository with Save/FindByID. Builds, and the output matches.
- Problems: the in-memory map is unguarded. Not-found is an inline `errors.New("order not found")` instead of a sentinel `ErrNotFound`, which contradicts the Error Handling note. Missing: transactions across repositories (Unit of Work or tx-in-context), pagination, and mapping `sql.ErrNoRows`. Overlaps `golang backend/Go Transactions and Repository Pattern`.
- Keep: the code (fixed) and the "When not to use" paragraph.
- New home: `17 LLD/Patterns/Repository and Unit of Work`
- Must cover: a repository is a collection-like boundary per aggregate · the interface is owned by the consuming service · an in-memory fake with a mutex for tests · a Postgres implementation mapping sql.ErrNoRows → ErrNotFound · conditional updates as repository methods (Reserve, CompareAndSetStatus from the practice notes) · transactions spanning repositories: WithTx(func(repos)) vs Unit of Work vs tx in ctx · keyset pagination · no business rules in repositories · avoid generic `Repository[T]` CRUD god-interfaces · contract tests for fake vs real · link the 06 DB access and transactions notes
- Diagrams: a class diagram Service → OrderRepository ← PostgresRepo / MemRepo, and a sequence diagram of a WithTx unit of work (begin → reserve → save → commit/rollback).

### Singleton Pattern in Go
`LLD with Go/patterns/Singleton Pattern in Go.md` · 96 lines · real 45 · depth 3 · POLISH
- Has: a sync.Once GetConfig, when and when not to use it, and a preference for DI. Builds, and the output matches.
- Problems: no `sync.OnceValue` / `OnceValues` (Go 1.21). No error handling: Once never retries, so a failed init leaves nil forever. No package-level var or `init()` alternatives and no init-order pitfalls. Nothing on why globals hurt tests (no reset between tests).
- Keep: the code and the when/not lists.
- New home: `17 LLD/Patterns/Singleton and sync.Once`
- Must cover: why globals hurt (hidden dependencies, tests) · package var vs init() vs sync.Once vs OnceValue(s) · init errors (OnceValues caches the error; or build in main and inject) · panics inside Once.Do · a mutable singleton needs its own lock · "one per process" built in main and injected (composition root) · stdlib defaults (http.DefaultClient, slog.SetDefault) and their pitfalls · testing with injected instances
- Diagrams: a sequence diagram of three concurrent first callers through sync.Once (one runs f, the others wait and then share the result).

### State Pattern in Go
`LLD with Go/patterns/State Pattern in Go.md` · 117 lines · real 62 · depth 3 · POLISH
- Has: an OrderStatus transition table with MoveTo, and a lifecycle state diagram. Builds, and the output matches.
- Problems: shows only the data-table form, not GoF State (one interface implementation per state). The Vending Machine practice note has the proper form; link it. The `allowed` map is rebuilt on every call. The diagram has no terminal states. No persistence (`UPDATE … WHERE status = $from`) and no actor permissions (Food Ordering has both).
- Keep: the code and the diagram (add terminal states).
- New home: `17 LLD/Patterns/State Machines in Go`
- Must cover: enum + transition table (data) vs state interface (behavior per state), and when each wins · typed states with String() · guards and actions on transitions · actor/role-based transitions · persisting with compare-and-set · emitting events on transitions (observer / outbox) · timeouts as transitions (offer expiry, seat hold) · terminal and error states · table-driven tests over every edge · where it is used (Vending, Food, Inventory, Delivery offers, Elevator, Library copies)
- Diagrams: a stateDiagram-v2 of the order lifecycle with guards and terminal states, and a class diagram of the state-interface form (Machine → State ← Idle / HasMoney / Dispensing / OutOfStock / OutOfService).

### Strategy Pattern in Go
`LLD with Go/patterns/Strategy Pattern in Go.md` · 138 lines · real 74 · depth 3 · POLISH
- Has: a StoreSelectionStrategy, NearestAvailableStoreStrategy, and AssignmentService constructor injection. Builds, and the output matches.
- Problems: no function-typed strategy (`type SelectFunc func(...)`), the lighter Go idiom. No stdlib examples (sort.Interface, `slices.SortFunc` cmp, http.Client.CheckRedirect, http.RoundTripper). No runtime selection by registry map and no composition of strategies.
- Keep: the code, the real-life paragraph, and the when-to-use list.
- New home: `17 LLD/Patterns/Strategy and Template Method`
- Must cover: interface strategy vs func strategy · selection at construction vs per call (registry map) · passing data in a context struct instead of globals · composing and decorating strategies (weekend pricing wrapping base pricing) · Template Method in Go = skeleton function + step interface, plus the embedding trap · Strategy vs State vs Bridge · stdlib examples · testing each strategy alone · where it is used (Parking allocation and pricing, Rate Limiter algorithms, Splitwise splits, Meeting room selector, Delivery ranking, Cart discounts)
- Diagrams: a class diagram Service → Strategy ← 3 implementations, and a flowchart "Strategy or State?" (does the choice depend on the object's own lifecycle?).

### Template Method Pattern in Go
`LLD with Go/patterns/Template Method Pattern in Go.md` · 87 lines · real 37 · depth 2 · MERGE→`17 LLD/Patterns/Strategy and Template Method`
- Has: a ProcessFile skeleton calling Parse/Validate/Save on a FileProcessor interface. Builds, and the output matches.
- Problems: `any` between the steps loses type safety (use a generic `ProcessFile[T]`). It does not warn that embedding cannot emulate overridable hooks, because Go has no virtual dispatch. `sort.Sort(sort.Interface)` is the stdlib example and is not mentioned.
- Keep: the code and the explanation "workflow function calling interface steps".
- New home: `17 LLD/Patterns/Strategy and Template Method`
- Must cover: see the Strategy block.
- Diagrams: see the Strategy block, plus a skeleton flowchart parse → validate → save with the variable steps highlighted.

### Visitor Pattern in Go
`LLD with Go/patterns/Visitor Pattern in Go.md` · 88 lines · real 38 · depth 2 · MERGE→`17 LLD/Patterns/Rare GoF Patterns in Go`
- Has: a Visitor/Item Accept double dispatch and a TaxVisitor. Builds, and the output matches.
- Problems: in Go a type switch usually replaces Visitor, and the note never shows it. The real example, `go/ast.Walk` / `ast.Inspect`, is missing. The integer tax truncation is not explained (rounding policy for money). The diagram lists a Medicine item that the code does not have.
- Keep: the code, as the double-dispatch illustration.
- New home: `17 LLD/Patterns/Rare GoF Patterns in Go` (Visitor section)
- Must cover: see the Bridge block.
- Diagrams: see the Bridge block.

---

## LLD with Go/practice/

Every full solution below (Elevator included) was extracted from its folded callout and run with `go vet` and `go test -race -count=1`. All compile, all vet clean, and every test suite passes. Coverage is listed per note.

### Cart Checkout with Coupons LLD in Go
`LLD with Go/practice/Cart Checkout with Coupons LLD in Go.md` · 1216 lines · real 938 · depth 5 · KEEP
- Has: the full 10 steps; repricing, an idempotency key, a coupon validation chain, all-or-nothing reservation with TTL sweeper, saga compensation, and a "stuck" state when the refund fails; 5 tests, 97.2% coverage.
- Problems: minor. `fmt.Errorf("%w: %v", ErrPaymentFailed, err)` drops the gateway error chain; use two `%w` (Go 1.20+). Only a per-user coupon limit (no global redemption cap). Percent discounts truncate (state the rounding policy). The order ID embeds the userID.
- Keep: everything (code, tests, SQL, drawing).
- New home: `17 LLD/Practice/Cart Checkout with Coupons`
- Must cover: present now: clarifications · entities Cart/Item/Coupon/Reservation/Order · DiscountStrategy + validator chain · reservation states HELD→COMMITTED/RELEASED/EXPIRED · idempotency states (in progress/done/stuck) · per-step compensations · unknown-outcome payment timeout handled by the gateway idempotency key · schema · concurrency tests. Add: a global coupon cap (`UPDATE coupons SET used = used + 1 WHERE used < max`) · rounding policy · multi-%w.
- Diagrams: keep the Excalidraw drawing (entities, saga with red failure boxes, reservation state machine, storage) and the existing mermaid diagrams.

### Delivery Partner Assignment LLD in Go
`LLD with Go/practice/Delivery Partner Assignment LLD in Go.md` · 1272 lines · real 967 · depth 4 · POLISH
- Has: a Fleet with stale-location filtering, expanding radii, an atomic TryClaim, a ranking strategy, a Porter 3PL adapter, and offer accept/reject/expire with re-offer; 8 tests, 89.2% coverage.
- Problems: the OfferService comment says "never hold it across a network call", but `nextOffer` → `bookThirdParty` → `CreateDelivery` calls the 3PL while holding `s.mu`. That happens on the Start, Reject, ExpireDue and late-Accept paths. Release the lock around external calls. Nearby is an O(n) scan (Redis GEO is noted). Haversine is duplicated in the Inventory note.
- Keep: everything else and the drawing.
- New home: `17 LLD/Practice/Delivery Partner Assignment`
- Must cover: present now: partner and offer state machines with timeouts · the claim race (available → busy compare-and-set) · radius expansion → 3PL fallback → retry queue · live location (Redis GEO/geohash, staleness) · schema. Add: decide under the lock, call outside it, re-check · batched assignment rounds (greedy vs Hungarian matching) as a follow-up.
- Diagrams: keep the 5-section drawing.

### Elevator System LLD in Go
`LLD with Go/practice/Elevator System LLD in Go.md` · 363 lines · real 262 · depth 3 · REWRITE
- Has: Controller, Elevator and DispatchStrategy; LOOK stop ordering; a tick-based Step(); class and state diagrams; a follow-up table. The code compiles and vets clean.
- Problems: uses the old template. It has no 10-step structure, no folder structure, no tests (0% coverage) and no drawing; confirmed that none exists in `Excalidraw/LLD/`. It is an orphan: no note links to it (not the Roadmap, START HERE or the Question Bank). `Snapshot(id)` indexes `c.elevators[id]` without a bounds check, so a bad id panics. The hall-call direction is ignored (the note acknowledges this). It claims the State pattern, but state is an enum inside step(). After the door closes, the elevator reports Idle even though stops remain.
- Keep: the code (LOOK nextDir, NearestSuitable cost function), the LOOK vs SCAN paragraph, the follow-ups table, and the interview answer.
- New home: `17 LLD/Practice/Elevator System`
- Must cover: requirements (N cars, hall vs cabin calls, capacity, special modes) · states (Idle / MovingUp / MovingDown / DoorOpen / Maintenance) · direction-aware stop sets (upStops/downStops) · LOOK vs SCAN vs FCFS · dispatcher strategies (nearest suitable, least loaded, ETA, zoning) · tick simulation vs a ticker goroutine; event loop owning state vs mutex · concurrency between button goroutines and the controller loop · tests: deterministic tick tests, duplicate presses, current-floor request, concurrent presses under -race · edge cases (overweight, fire mode, out of service) · extensions
- Diagrams: a NEW Excalidraw drawing (entities, LOOK timeline across floors, state machine, dispatcher cost). Keep the mermaid class and state diagrams.

### File Search Unix Find LLD in Go
`LLD with Go/practice/File Search Unix Find LLD in Go.md` · 839 lines · real 651 · depth 5 · KEEP
- Has: a Composite tree (Directory/File/Symlink), FilterFunc specifications with an AND/OR/NOT parser, DFS/BFS, MaxDepth, symlink-cycle protection and denied directories; 5 tests, 100% coverage.
- Problems: minor. A file reachable through two symlink paths is reported twice (`find -L` does the same; say so). BFS `frontier[1:]` keeps the backing array alive. The Composite and Interpreter pattern notes do not link back here.
- Keep: everything.
- New home: `17 LLD/Practice/File Search (Unix find)`
- Must cover: present now. Add: mapping to the real disk with `io/fs.WalkDir` + `fs.FileInfo` · a parallel walk with bounded workers and deterministic output · a fuzz test for the expression parser.
- Diagrams: keep the drawing.

### Food Ordering System LLD in Go
`LLD with Go/practice/Food Ordering System LLD in Go.md` · 1173 lines · real 889 · depth 5 · KEEP
- Has: a single-restaurant cart, price snapshots, an idempotent PlaceOrder that waits for an in-flight duplicate, an actor-checked transition table, refunds, and assigner/listener ports; 7 tests, 96.8% coverage.
- Problems: minor. The refund error is ignored (`_ = s.pay.Refund`, with a comment saying "outbox"); show the outbox row. A failed PlaceOrder restores the cart only if the user has not started a new one, so the old cart can be lost silently.
- Keep: everything.
- New home: `17 LLD/Practice/Food Ordering System`
- Must cover: present now. Add: refund through the outbox with retries · restaurant SLA timeout as a timed auto-reject transition.
- Diagrams: keep the drawing.

### Go LLD Folder Structure for Practice
`LLD with Go/practice/Go LLD Folder Structure for Practice.md` · 142 lines · real 78 · depth 2 · MERGE→`17 LLD/LLD Interview Method`
- Has: small and backend folder layouts, a file-purpose table, the package-by-domain rule, and a wiring main.go.
- Problems: main.go calls `order.`, `inventory.` and `delivery.` without importing them, so it does not compile as shown (it needs module-path imports). Store selection is placed in a `delivery` package. Overlaps `golang backend/Go Project Structure and Modules`.
- Keep: the two layouts, the file table, and the package rule.
- New home: `17 LLD/LLD Interview Method` (section "code layout in a round"), linking `06 Backend Engineering in Go/Project Layout`
- Must cover: merged.
- Diagrams: none.

### Inventory Order Assignment LLD in Go
`LLD with Go/practice/Inventory Order Assignment LLD in Go.md` · 1332 lines · real 1026 · depth 5 · KEEP
- Has: idempotency claim/bind/release, a nearest-with-full-stock strategy, all-or-nothing reservation with undo and fallback to the next store, compare-and-set transitions, and hold expiry; 9 tests, 90.0% coverage.
- Problems: minor. Confirmed → Cancelled releases stock but never refunds (payment is not modeled; say so). If BindKey fails after a successful place, the key stays "in progress" forever. Haversine is duplicated in the Delivery note.
- Keep: everything.
- New home: `17 LLD/Practice/Inventory Order Assignment (Dark Store)`
- Must cover: present now. Add: split-order fulfilment as an extension · refund on cancel-after-payment.
- Diagrams: keep the drawing.

### LLD Practice Roadmap
`LLD with Go/practice/LLD Practice Roadmap.md` · 116 lines · real 69 · depth 2 · MERGE→`17 LLD/00 LLD Map`
- Has: the 10-step solving flow, a deliverables list, the 15-problem level order, how solution notes are laid out, daily time boxes, and an interviewer checklist.
- Problems: Elevator is missing from the order. The step list duplicates Interview Approach and START HERE. The "Daily practice method" duplicates every practice note's "How to use this note".
- Keep: the 10-step flow (the canonical one), the level ordering, and the time boxes.
- New home: practice order → `17 LLD/00 LLD Map`; steps → `17 LLD/LLD Interview Method`; daily method and interviewer checks → `19 Interview & Career/LLD Round Playbook`
- Must cover: merged.
- Diagrams: merged.

### LLD Question Bank with Answers
`LLD with Go/practice/LLD Question Bank with Answers.md` · 809 lines · real 460 · depth 2 · REWRITE
- Has: 15 short answers (requirements, entities, method signatures, patterns, edge cases, explanation), each linking its full note.
- Problems: written before the full notes and never updated to match them. Parking lists `ParkVehicle/UnparkVehicle/FindSpot` and a `Floor` entity; the solution uses `Park/Exit/ExitLostTicket` and says "No Floor ... classes". Vending lists the states "idle, has money, selected, dispensing"; the solution has idle/has_money/dispensing/out_of_stock/out_of_service. Library copy states omit Held. Meeting `CancelBooking` lacks userID. LRU uses `any` instead of the generic `LRU[K,V]`. Elevator is absent.
- Keep: the per-problem "Interview explanation" one-liners, after updating them to match the solutions.
- New home: `17 LLD/LLD Problem Cheat Sheet`
- Must cover: one table row per problem: core invariant · the race and how it is prevented · key data structure · patterns used · signature of the hardest method · two follow-ups · links to the full note and drawing
- Diagrams: none.

### LRU Cache LLD in Go
`LLD with Go/practice/LRU Cache LLD in Go.md` · 723 lines · real 549 · depth 5 · KEEP
- Has: a generic LRU[K,V] with a sentinel list, per-entry TTL, lazy expiry + Sweep, an eviction callback called outside the lock, the container/list trade-off, and sharding/LFU follow-ups; 5 tests, 97.6% coverage.
- Problems: minor. When the cache is full, Put evicts the LRU tail even if some other entry has already expired; state the policy or evict expired entries first. No mention of production libraries (hashicorp/golang-lru/v2 expirable, ristretto/TinyLFU).
- Keep: everything.
- New home: `17 LLD/Practice/LRU Cache with TTL`
- Must cover: present now. Add: an expired-first eviction option · production libraries · read-heavy contention (sharding; approximate LRU the way Redis samples keys).
- Diagrams: keep the drawing.

### Library Management LLD in Go
`LLD with Go/practice/Library Management LLD in Go.md` · 1009 lines · real 757 · depth 5 · KEEP
- Has: Book vs BookCopy, copy states including Held, a FIFO reservation queue, borrow limits, a PerDayFine strategy with a cap, lost copies, and a notifier; 5 tests, 96.3% coverage.
- Problems: minor. The fine counts full 24-hour periods (`now.Sub(due) / (24 * time.Hour)`), so a return 23 hours late costs nothing and DST/calendar days are ignored. State the policy (verify: the library's local calendar days).
- Keep: everything.
- New home: `17 LLD/Practice/Library Management`
- Must cover: present now. Add: hold expiry (after N days a held copy goes back to the shelf or the next member in the queue).
- Diagrams: keep the drawing.

### Logging System LLD in Go
`LLD with Go/practice/Logging System LLD in Go.md` · 967 lines · real 771 · depth 5 · KEEP
- Has: levels, text/JSON formatter strategies, appenders, an AsyncAppender (bounded, drops and counts, close-safe under RWMutex), a LevelFilter chain, With fields, and Fatal with flush; 10 tests, 86.2% coverage.
- Problems: minor. JSON output loses field order (the note says so). Child loggers share the filter, so SetLevel on a child changes the parent; say so. No side-by-side mapping to `log/slog` (Logger ↔ Handler is a Bridge, LevelVar, With), although slog is mentioned.
- Keep: everything.
- New home: `17 LLD/Practice/Logging Library`
- Must cover: present now. Add: a slog design comparison table · fields carried in context (request_id) through InfoCtx.
- Diagrams: keep the drawing.

### Meeting Room Scheduler LLD in Go
`LLD with Go/practice/Meeting Room Scheduler LLD in Go.md` · 886 lines · real 642 · depth 5 · KEEP
- Has: half-open intervals, a sorted per-room calendar with a binary-search neighbour check, per-room locks, a smallest-fit selector, UTC storage, and Postgres `EXCLUDE USING gist`; 5 tests, 92.5% coverage.
- Problems: nothing material. Recurring meetings and time zones are deferred, which is fine.
- Keep: everything (the EXCLUDE constraint SQL is excellent).
- New home: `17 LLD/Practice/Meeting Room Scheduler`
- Must cover: present now. Add: recurring meetings (RRULE expansion window, exceptions) · an interval tree for very dense calendars.
- Diagrams: keep the drawing.

### Movie Ticket Booking LLD in Go
`LLD with Go/practice/Movie Ticket Booking LLD in Go.md` · 860 lines · real 608 · depth 5 · KEEP
- Has: per-show ShowSeat state, all-or-nothing holds with TTL and lazy expiry, an idempotent confirm keyed by paymentID, owner-checked release, a sweeper, and a pricing strategy; 5 tests, 91.9% coverage.
- Problems: minor. `SeatState(show, seat)` dereferences nil for unknown IDs, so this test helper panics. Hold IDs are sequential and guessable; use random IDs if they are exposed. One global mutex (per-show locks and Redis are discussed as the scaling answer).
- Keep: everything.
- New home: `17 LLD/Practice/Movie Ticket Booking`
- Must cover: present now. Add: payment arriving after the hold expired → automatic refund path · the virtual waiting room for hot shows (described, not modeled).
- Diagrams: keep the drawing.

### Notification System LLD in Go
`LLD with Go/practice/Notification System LLD in Go.md` · 999 lines · real 743 · depth 4 · POLISH
- Has: SMS/WhatsApp sender adapters, a factory, a token-bucket decorator, opt-out and contact preferences, an idempotency claim, a bounded queue with a worker pool, exponential backoff, and an order-event listener; 6 tests, 91.5% coverage.
- Problems: `deliver()` retries every Send error, although the note's own mistakes list says "Retrying permanent errors like invalid numbers"; add a retryable classification. Backoff has no jitter or cap in the code. It uses `text/template` for every channel; HTML email bodies need `html/template`. Workers exit on ctx cancel without draining the queue. staticcheck SA4000 fires (a false positive) on `!b.Allow() || !b.Allow() || b.Allow()`; the calls have side effects, so rewrite it for clarity.
- Keep: everything else.
- New home: `17 LLD/Practice/Notification Service`
- Must cover: present now. Add: retryable vs permanent errors · jitter and max delay · html/template for email · graceful drain · priority lanes (OTP vs marketing) · provider failover (primary/secondary SMS).
- Diagrams: keep the drawing.

### Parking Lot LLD in Go
`LLD with Go/practice/Parking Lot LLD in Go.md` · 861 lines · real 613 · depth 5 · KEEP
- Has: allocation and pricing strategies, pick + claim under one lock, a plate index, the lost-ticket flow, per-started-hour pricing, and SQL with partial unique indexes plus `FOR UPDATE SKIP LOCKED`; 4 tests, 95.1% coverage.
- Problems: nothing material. The Question Bank entry contradicts it (see that block).
- Keep: everything.
- New home: `17 LLD/Practice/Parking Lot`
- Must cover: present now. Add: a fallback allocation (bike in a car spot) coded as a second strategy, as a short exercise.
- Diagrams: keep the drawing.

### Rate Limiter LLD in Go
`LLD with Go/practice/Rate Limiter LLD in Go.md` · 807 lines · real 597 · depth 4 · POLISH
- Has: token bucket, fixed window and sliding log behind a Limiter strategy; an injected clock; fail-open/fail-closed middleware; an algorithm table; Redis Lua designs; an edge-case table; 4 tests, 98.5% coverage.
- Problems: the per-key maps never shrink. The janitor is described ("Janitor job removes state for idle keys") but not coded, so per-IP keys leak memory. `Retry-After` is hard-coded to "1" instead of computed from tokens and rate. No leaky bucket and no GCRA. `golang.org/x/time/rate` (the standard Go token bucket: Allow/Wait/Reserve) is never mentioned. Overlaps `redis/Rate limiting with Redis` and `golang backend/Go Redis Cache Queue Rate Limit`.
- Keep: everything.
- New home: `17 LLD/Practice/Rate Limiter`
- Must cover: present now. Add: janitor code or an LRU-bounded key map · computed Retry-After and RateLimit-* headers · an x/time/rate comparison · leaky bucket and GCRA · code for the sliding window counter.
- Diagrams: keep the drawing.

### Splitwise Expense Sharing LLD in Go
`LLD with Go/practice/Splitwise Expense Sharing LLD in Go.md` · 947 lines · real 707 · depth 5 · KEEP
- Has: equal, exact and percent (basis points) split strategies with a deterministic remainder, a factory, net balances, idempotent add, delete by reversal, settle, and greedy simplification with a worked example; 5 tests, 86.3% coverage.
- Problems: `CreateGroup` silently overwrites an existing group, wiping its balances; return ErrGroupExists. I checked the worked example by hand: nets +8/+1/−3/−6, 3 transfers, and the delete-taxi nets are all correct.
- Keep: everything.
- New home: `17 LLD/Practice/Splitwise Expense Sharing`
- Must cover: present now. Add: multiple payers per expense · multi-currency groups · largest-remainder rounding as an alternative.
- Diagrams: keep the drawing.

### Vending Machine LLD in Go
`LLD with Go/practice/Vending Machine LLD in Go.md` · 879 lines · real 657 · depth 4 · POLISH
- Has: the GoF State interface (idle, has_money, dispensing, out_of_stock, out_of_service), escrowed coins vs the coin box, change computed before dispensing, refund on a jam, a one-shot Buy flow, and restock/repair; 4 tests, 86.9% coverage.
- Problems: the makeChange comment "Greedy is optimal for canonical coin systems like INR 1,2,5,10,20,50,100" is false with a finite coin box. Price 40, paid 100, box {50×1, 20×3}: the code returns `exact change unavailable` although 3×20 works. I verified this by running the note's own code. Use bounded DP or backtracking over coin counts. Also, `dispensingState` can never be observed, because `m.mu` is held for the whole Dispense call; either release the lock while dispensing or drop the state.
- Keep: everything else. It is the best State-pattern example in the vault; link it from the State pattern note.
- New home: `17 LLD/Practice/Vending Machine`
- Must cover: present now. Add: bounded change-making (DP over coin counts) with a test for the {50×1, 20×3} case.
- Diagrams: keep the drawing.

---

## Excalidraw/ (scratch drawings)

### Drawing 2026-09-16 21.29.25
`Excalidraw/Drawing 2026-09-16 21.29.25.excalidraw.md` · 34 lines · real 0 · depth 0 · DELETE
- Has: nothing useful. `## Text Elements` is empty; decoding the compressed-json shows one unlabeled rectangle (no text, no images).
- Problems: referenced nowhere in the vault (checked all .md, .canvas and `.obsidian/*.json`). The frontmatter delimiters are malformed (`- --` instead of `---`).
- Keep: nothing.
- New home: none.
- Must cover: n/a.
- Diagrams: n/a.

### Drawing 2026-10-09 23.52.42
`Excalidraw/Drawing 2026-10-09 23.52.42.excalidraw.md` · 30 lines · real 0 · depth 0 · DELETE
- Has: nothing useful. `## Text Elements` is empty; decoding the compressed-json shows one unlabeled rectangle (no text, no images).
- Problems: referenced nowhere in the vault.
- Keep: nothing.
- New home: none.
- Must cover: n/a.
- Diagrams: n/a.

(`Excalidraw/SDE3 Backend Roadmap.excalidraw.md` is also an orphan, but it is outside my scope: it belongs to the SDE3 roadmap overlap.)

## Excalidraw/LLD/ (15 drawings)

Every drawing is linked from exactly its own practice note. That note embeds it under `## Drawing` and gives a "Redraw it from memory" checklist; some also link it from "How to use this note". The drawings are stored uncompressed (2.9k-6.9k lines of JSON). In each block below, "real" counts the lines in `## Text Elements`. I checked the Rate Limiter, LRU and Splitwise drawings line by line against their code, and all three match. For the other 12 I checked the section titles against the code.

### Cart Checkout LLD Drawing
`Excalidraw/LLD/Cart Checkout LLD Drawing.excalidraw.md` · 5466 lines · real 117 · depth n/a · KEEP
- Has: 1 entities and relationships, 2 Checkout saga (reprice → idempotency → reserve → charge → commit hold) with failure boxes, 3 Reservation state machine, 4 storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Cart Checkout LLD Drawing`
- Must cover: n/a (asset).
- Diagrams: n/a.

### Delivery Partner Assignment LLD Drawing
`Excalidraw/LLD/Delivery Partner Assignment LLD Drawing.excalidraw.md` · 6853 lines · real 141 · depth n/a · KEEP
- Has: 1 entities, 2 assign with offer and timeout, 3 partner and offer state machines, 4 live location tracking, 5 storage.
- Problems: none found. Once the code fix lands, mark "release the lock before the 3PL call" in section 2.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Delivery Partner Assignment LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### File Search LLD Drawing
`Excalidraw/LLD/File Search LLD Drawing.excalidraw.md` · 3586 lines · real 78 · depth n/a · KEEP
- Has: 1 Composite tree, 2 filter expression tree (`ext=.go AND NOT size>1048576`), 3 search loop.
- Problems: none. Section 2 is also the ideal illustration for the Interpreter section.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/File Search LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Food Ordering System LLD Drawing
`Excalidraw/LLD/Food Ordering System LLD Drawing.excalidraw.md` · 5386 lines · real 119 · depth n/a · KEEP
- Has: 1 entities, 2 PlaceOrder(user, idemKey) flow, 3 order state machine, 4 storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Food Ordering System LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Inventory Order Assignment LLD Drawing
`Excalidraw/LLD/Inventory Order Assignment LLD Drawing.excalidraw.md` · 4280 lines · real 106 · depth n/a · KEEP
- Has: 1 entities, 2 PlaceOrder (ClaimKey → select stores → reserveAll → save), 3 order state machine, 4 storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Inventory Order Assignment LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### LRU Cache LLD Drawing
`Excalidraw/LLD/LRU Cache LLD Drawing.excalidraw.md` · 4266 lines · real 88 · depth n/a · KEEP
- Has: 1 entities, 2 map + doubly linked list with sentinels and an expired node, 3 Get flow, 4 Put flow; matches the code exactly.
- Problems: none.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/LRU Cache LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Library Management LLD Drawing
`Excalidraw/LLD/Library Management LLD Drawing.excalidraw.md` · 5623 lines · real 115 · depth n/a · KEEP
- Has: 1 entities, 2 Borrow/Return/ReportLost flows, 3 BookCopy state machine, 4 storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Library Management LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Logging System LLD Drawing
`Excalidraw/LLD/Logging System LLD Drawing.excalidraw.md` · 4153 lines · real 90 · depth n/a · KEEP
- Has: 1 entities, 2 Info() through LevelFilter → FormatHandler → appenders, 3 AsyncAppender lifecycle.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Logging System LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Meeting Room Scheduler LLD Drawing
`Excalidraw/LLD/Meeting Room Scheduler LLD Drawing.excalidraw.md` · 2910 lines · real 71 · depth n/a · KEEP
- Has: 1 entities, 2 BookRoom (no double booking), 3 booking state machine, 4 Postgres storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Meeting Room Scheduler LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Movie Ticket Booking LLD Drawing
`Excalidraw/LLD/Movie Ticket Booking LLD Drawing.excalidraw.md` · 4445 lines · real 98 · depth n/a · KEEP
- Has: 1 entities, 2 lock → pay → confirm flow, 3 per-ShowSeat state machine, 4 storage.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Movie Ticket Booking LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Notification System LLD Drawing
`Excalidraw/LLD/Notification System LLD Drawing.excalidraw.md` · 5396 lines · real 105 · depth n/a · KEEP
- Has: 1 entities, 2 worker processing one notification (claim → prefs → template → rate-limited send → retry/DLQ), 3 notification state machine, 4 storage.
- Problems: once the code fix lands, add the "permanent error → no retry" branch.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Notification System LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Parking Lot LLD Drawing
`Excalidraw/LLD/Parking Lot LLD Drawing.excalidraw.md` · 4456 lines · real 92 · depth n/a · KEEP
- Has: 1 entities, 2 Park and lost-ticket exit flows, 3 Spot and Ticket state machines, 4 storage with the partial unique indexes.
- Problems: none found.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Parking Lot LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Rate Limiter LLD Drawing
`Excalidraw/LLD/Rate Limiter LLD Drawing.excalidraw.md` · 3679 lines · real 91 · depth n/a · KEEP
- Has: 1 Limiter interface + 3 algorithms + middleware, 2 token bucket worked example (capacity 10, refill 5/s), 3 Allow flow with fail-open/fail-closed, 4 SQL config vs Redis state (INCR, HASH, ZSET via Lua, Redis TIME).
- Problems: shows `Retry-After: 1`. Update it once the code computes the value.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Rate Limiter LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Splitwise LLD Drawing
`Excalidraw/LLD/Splitwise LLD Drawing.excalidraw.md` · 5592 lines · real 108 · depth n/a · KEEP
- Has: 1 entities, 2 AddExpense/DeleteExpense, 3 worked simplify-debts example (7 debts → 3 transfers; I checked the arithmetic), 4 storage.
- Problems: none.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Splitwise LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

### Vending Machine LLD Drawing
`Excalidraw/LLD/Vending Machine LLD Drawing.excalidraw.md` · 4795 lines · real 98 · depth n/a · KEEP
- Has: 1 entities, 2 SelectProduct in the has-money state, 3 state machine, 4 storage (fleet backend only).
- Problems: if it repeats the "greedy change" claim, fix it to say bounded change-making.
- Keep: whole drawing.
- New home: `Assets/Excalidraw/LLD/Vending Machine LLD Drawing`
- Must cover: n/a.
- Diagrams: n/a.

---

## Area plan: LLD (17 LLD + LLD parts of 19 and Assets)

Proposed change to the draft architecture: the draft puts "interview method" in 17 and "SD/LLD interview frameworks" in 19. Split them this way:
- The technical solving method (the 10 steps every practice note follows) stays in `17 LLD/LLD Interview Method`.
- Round logistics (time boxes, what interviewers check, opening scripts, company patterns, resource maps) go to 19.

Also, the 8 rarely-useful GoF patterns get one combined note instead of 8 stubs.

### New notes, ordered basic → advanced
1. `17 LLD/00 LLD Map` · B · from: LLD with Go - START HERE, LLD with Go Content Table, LLD Practice Roadmap (practice order)
2. `17 LLD/LLD Interview Method` · B · from: LLD Interview Approach in Go, LLD Practice Roadmap (10 steps), Go LLD Folder Structure for Practice
3. `17 LLD/OOP in Go - Structs, Interfaces, Embedding` · B · from: Go LLD Mental Model, Error Handling and Interfaces in Go LLD (interfaces half), CodeWithAryan map + UML (Java→Go tables)
4. `17 LLD/Design Principles - DRY, KISS, YAGNI, Coupling and Cohesion` · B · from: DRY, KISS, YAGNI Principle notes + NEW (cohesion/coupling, Law of Demeter, composition over inheritance)
5. `17 LLD/SOLID in Go` · B · from: SOLID Principles in Go LLD
6. `17 LLD/UML for LLD` · B · from: UML for LLD Interviews
7. `17 LLD/Design Patterns Overview and Chooser` · B · from: Creational, Structural, Behavioral Patterns in Go; Content Table (pattern → backend table)
8. `17 LLD/Patterns/Strategy and Template Method` · I · from: Strategy Pattern in Go, Template Method Pattern in Go
9. `17 LLD/Patterns/Factory and Abstract Factory` · I · from: Factory Pattern in Go, Abstract Factory Pattern in Go
10. `17 LLD/Patterns/Builder and Functional Options` · I · from: Builder and Functional Options Pattern in Go
11. `17 LLD/Patterns/Singleton and sync.Once` · I · from: Singleton Pattern in Go
12. `17 LLD/Patterns/Adapter` · I · from: Adapter Pattern in Go
13. `17 LLD/Patterns/Decorator and Middleware` · I · from: Decorator Middleware Pattern in Go
14. `17 LLD/Patterns/Proxy` · I · from: Proxy Pattern in Go
15. `17 LLD/Patterns/Facade (vs Mediator)` · I · from: Facade Pattern in Go, Mediator Pattern in Go
16. `17 LLD/Patterns/Composite` · I · from: Composite Pattern in Go
17. `17 LLD/Patterns/Observer and Event Bus` · I · from: Observer Pattern in Go
18. `17 LLD/Patterns/State Machines in Go` · I · from: State Pattern in Go + Vending Machine state-interface code
19. `17 LLD/Patterns/Chain of Responsibility and Pipelines` · I · from: Chain of Responsibility Pattern in Go
20. `17 LLD/Patterns/Command, Undo and Memento` · I · from: Command Pattern in Go, Memento Pattern in Go
21. `17 LLD/Patterns/Iterator and range-over-func` · I · from: Iterator Pattern in Go (rewrite)
22. `17 LLD/Patterns/Repository and Unit of Work` · I · from: Repository Pattern in Go
23. `17 LLD/Patterns/Rare GoF Patterns in Go` · A · from: Prototype, Bridge, Flyweight, Visitor, Interpreter (+ the full Mediator form)
24. `17 LLD/Concurrency for LLD` · I→A · from: Concurrency in Go LLD
25. `17 LLD/Testing LLD Code` · I · from: Testing LLD Code in Go
26. `17 LLD/Practice/Parking Lot` · B · from: Parking Lot LLD in Go
27. `17 LLD/Practice/Vending Machine` · B · from: Vending Machine LLD in Go
28. `17 LLD/Practice/Library Management` · B · from: Library Management LLD in Go
29. `17 LLD/Practice/Meeting Room Scheduler` · B · from: Meeting Room Scheduler LLD in Go
30. `17 LLD/Practice/LRU Cache with TTL` · B · from: LRU Cache LLD in Go
31. `17 LLD/Practice/Elevator System` · B · from: Elevator System LLD in Go (rewrite + NEW drawing + tests)
32. `17 LLD/Practice/Tic-Tac-Toe and Snake and Ladder` · B · NEW
33. `17 LLD/Practice/Cart Checkout with Coupons` · I · from: Cart Checkout with Coupons LLD in Go
34. `17 LLD/Practice/Inventory Order Assignment (Dark Store)` · I · from: Inventory Order Assignment LLD in Go
35. `17 LLD/Practice/Delivery Partner Assignment` · I · from: Delivery Partner Assignment LLD in Go
36. `17 LLD/Practice/Notification Service` · I · from: Notification System LLD in Go
37. `17 LLD/Practice/Rate Limiter` · I · from: Rate Limiter LLD in Go
38. `17 LLD/Practice/Logging Library` · I · from: Logging System LLD in Go
39. `17 LLD/Practice/File Search (Unix find)` · I · from: File Search Unix Find LLD in Go
40. `17 LLD/Practice/ATM` · I · NEW (State + CoR cash dispenser + bank idempotency)
41. `17 LLD/Practice/In-memory KV Store with TTL and Transactions` · I · NEW
42. `17 LLD/Practice/Task Scheduler (delayed and recurring jobs)` · I · NEW
43. `17 LLD/Practice/Circuit Breaker` · I · NEW
44. `17 LLD/Practice/Movie Ticket Booking` · A · from: Movie Ticket Booking LLD in Go
45. `17 LLD/Practice/Splitwise Expense Sharing` · A · from: Splitwise Expense Sharing LLD in Go
46. `17 LLD/Practice/Food Ordering System` · A · from: Food Ordering System LLD in Go
47. `17 LLD/Practice/Pub-Sub Message Queue` · A · NEW
48. `17 LLD/Practice/Ride Sharing` · A · NEW
49. `17 LLD/Practice/Hotel Booking` · A · NEW
50. `17 LLD/Practice/Order Book Matching Engine` · A · NEW
51. `17 LLD/Practice/Digital Wallet and Ledger` · A · NEW
52. `17 LLD/LLD Problem Cheat Sheet` · B (revision) · from: LLD Question Bank with Answers (rewritten and brought in line with the full notes)

Outside 17:
- `04 Go Language/Errors - Sentinel, Typed, Wrapping` · I · from: Error Handling and Interfaces in Go LLD (errors half), merged with the Go-backend errors note (other reviewer)
- `19 Interview & Career/LLD Round Playbook` · B · from: LLD Practice Roadmap (daily method, interviewer checks), the Zepto time table, the Interview Approach script
- `19 Interview & Career/Company Rounds/Zepto-style Product LLD Round` · I · from: Zepto SDE1 LLD Round Pattern
- `19 Interview & Career/Resource Maps/LLD Resources` · B · from: CodeWithAryan LLD Playlist Coverage Map
- `Assets/Excalidraw/LLD/` · the 15 drawings unchanged, plus a NEW Elevator drawing

### Gaps (topics missing entirely for complete coverage)
Concepts:
- OOP-in-Go mechanics: how embedding behaves (no virtual dispatch), method sets / pointer receivers vs interface satisfaction, the typed-nil interface trap, iota enums with String(), useful zero values.
- Dependency injection and the composition root (manual wiring in main vs google/wire vs uber/fx; `wire` is installed in `~/go/bin`).
- Coupling and cohesion, Law of Demeter / tell-don't-ask, GRASP-style responsibility assignment.
- Real Go stdlib examples per pattern: 21 of 24 pattern notes have none. Only Decorator (http.Handler), Singleton (sync.Once) and Builder (functional options) touch one.
- Modern Go idioms absent from the patterns: `iter.Seq` (1.23), `sync.OnceValue(s)` (1.21), `unique` (1.23), `log/slog` as Bridge/CoR (1.21), `errors.Join` and multi-%w (1.20), `WaitGroup.Go` (1.25), `testing/synctest` (1.24 experimental, 1.25 GA).
- Patterns used but never explained: Specification (File Search filters), Null Object (NopPublisher), Circuit Breaker, Object/connection pool, Retry policy objects.
- Concurrency for LLD: sync.Cond, semaphores, `x/time/rate`, atomic.Pointer config swap, lock striping, goroutine-owned state (event loop), goleak, Redis lock fencing tokens.
- Machine-coding mechanics: a command-line / stdin command interpreter loop for "machine coding" rounds, deterministic IDs, injecting a clock everywhere.

Practice problems, most valuable first for an SDE-3 Go backend candidate:
1. Pub-sub / in-memory message queue (topics, partitions, consumer groups, offsets, at-least-once delivery, backpressure)
2. In-memory KV store with TTL and nested transactions (BEGIN/ROLLBACK/COMMIT)
3. Task / job scheduler (delayed jobs with container/heap + timer, cron, retries, worker pool)
4. Circuit breaker (closed / open / half-open state machine, sliding failure window)
5. ATM (State + Chain-of-Responsibility cash dispenser)
6. Tic-tac-toe / Snake & Ladder (classic machine-coding round; O(1) win check)
7. Ride sharing (matching, trip state machine, surge-pricing strategy)
8. Hotel booking (per-night room-type inventory, overbooking)
9. Stock exchange order book (price-time priority, heaps, partial fills)
10. Digital wallet / double-entry ledger
11. Connection pool
12. Chess (polymorphic move validation; lower priority)

Elevator also needs its drawing and tests.

### Delete list (with reason)
- `Excalidraw/Drawing 2026-09-16 21.29.25.excalidraw.md`: one unlabeled rectangle, no text, referenced nowhere, malformed frontmatter.
- `Excalidraw/Drawing 2026-10-09 23.52.42.excalidraw.md`: one unlabeled rectangle, no text, referenced nowhere.
- Removed only after merging, since their content moves into the merged notes: START HERE, Content Table, CodeWithAryan map, the 3 category notes, DRY/KISS/YAGNI, Go LLD Mental Model, LLD Interview Approach, Go LLD Folder Structure, LLD Practice Roadmap, LLD Question Bank (replaced by the cheat sheet), and the merged pattern notes (Factory/Abstract Factory, Template Method, Mediator, Memento, Prototype, Bridge, Flyweight, Visitor, Interpreter).

### Cross-area overlaps found
The LLD area is an island: no note outside `LLD with Go/` links in, and no LLD note links out. Yet for several topics it is the strongest content in the vault. In each case, cross-link both ways and let the stronger note seed the weaker one; do not merge them.
- Concurrency: `Concurrency in Go LLD` (174 unique lines) vs `golang backend/Go Concurrency Goroutines Channels` (29) and `Go Worker Queues and Background Jobs` (34). The LLD note seeds the 04 concurrency primitives; LLD keeps the invariant/DB angle.
- Errors and interfaces: `Error Handling and Interfaces in Go LLD` (103) vs `Go Error Handling` (26), `Go Types Structs Interfaces` (22), `api design/API Error Handling`. SPLIT as described in its block.
- Testing: `Testing LLD Code in Go` (145) vs `Go Testing` (26), `testing strategy/Unit Integration E2E Tests`, `Testing Pyramid`. Link them; 04 and 15 hold the generic mechanics.
- Rate limiting: LLD Rate Limiter (597) vs `redis/Rate limiting with Redis` (107) vs `Go Redis Cache Queue Rate Limit` (24). Keep one algorithm comparison (in 11 System Design/Rate Limiting, the HLD view), keep class design in LLD, and keep the Redis Lua scripts in 08.
- Notification: LLD (743) vs `system design practice/Design Notification System` (only 9 unique lines). Rewrite the SD case study as HLD (fan-out, priority queues, provider failover, scale estimates) and link the LLD for outbox, DLQ and rate limits.
- LRU / caching: LLD LRU (549) vs `bytes GO …/data structure/theory/cache.md` (17), the bbg cache folder, and `redis/Caching Patterns and Types`. `08 Caching/Eviction Policies` (LRU/LFU/TinyLFU, Redis approximate LRU) links to the LLD implementation.
- Logging: LLD Logging (771) vs `Go Logging Observability` (28) vs `observability/Logs Metrics Traces`. LLD covers library design, 06 covers slog usage, and 14 covers the pipeline.
- Repository: pattern note vs `golang backend/Go Transactions and Repository Pattern`. Unit of Work and transactions live in 06; the pattern note links there.
- Middleware: Decorator note vs `golang backend/Go Middleware`.
- Events: Observer + Food/Inventory publishers vs `distributed systems/Outbox Pattern`, `reliability/Event Streaming`.
- Checkout saga and idempotency: Cart Checkout / Food / Inventory vs `distributed systems/Saga Pattern`, `reliability/Idempotency`, `golang backend/Go Webhooks Idempotency`, `system design practice/Design Payment System`.
- Locks: Movie seat holds / Meeting rooms vs `distributed systems/Distributed Locks` (SET NX PX, fencing).
- DB invariants: Parking (`FOR UPDATE SKIP LOCKED`, partial unique indexes), Inventory (conditional UPDATE), Meeting (`EXCLUDE USING gist`) vs the 07 transactions/locking notes. These SQL snippets are better than anything in 07 today.
- Time: injected clocks in every practice note vs `distributed systems/Clock Skew and Time`. The Rate Limiter's use of Redis `TIME` relates directly.
- Workers and retries: Concurrency worker pool and Notification workers vs `reliability/Worker Architecture`, `Background Jobs`, `Retry and Backoff`, `Dead Letter Queue`, `Circuit Breaker`.
- Layering and layout: Go LLD Mental Model / Folder Structure vs `golang backend/Go Project Structure and Modules` and `architecture patterns/Layered`, `Clean`, `Hexagonal Architecture`.
- Career: Zepto round vs `2026 SDE3 Gap Checklist`, `sde3 roadmap/SDE3 Backend Roadmap`, and the orphan `Excalidraw/SDE3 Backend Roadmap.excalidraw.md`. All go to 19.
- Geo: Delivery partner assignment (Redis GEO/geohash, Haversine) has no counterpart; `11 System Design` lacks a proximity-service note (gap for that reviewer).
- Within the area: Haversine is duplicated in the Inventory and Delivery notes; the Facade and Mediator notes contain the same checkout code; KISS and YAGNI overlap almost fully.

### Factual errors found (quote → correction)
- Vending Machine: "Greedy is optimal for canonical coin systems like INR 1,2,5,10,20,50,100." → This holds only with an unlimited coin supply. With a finite coin box greedy fails: price 40, paid 100, box {50×1, 20×3} gives `exact change unavailable` although 3×20 works (verified by running the note's code). Use bounded DP or backtracking.
- Iterator: "In Go, this is often done with channels, callback functions, or simple `Next` methods." → Out of date. Since Go 1.23 range-over-func (`iter.Seq`/`Seq2`, `iter.Pull`) is idiomatic. Channel iterators leak a goroutine on early break. The stdlib uses Next/Err/Close (`sql.Rows`, `bufio.Scanner`).
- Behavioral Patterns: Iterator row "`Next/HasNext`, callback, channel, or paginated scanner" → same correction.
- Error Handling and Interfaces: "The service never imports `net/http`" while `HTTPStatus` (imports net/http) is declared in `package booking` → put the mapping in the handler/transport package.
- Concurrency in Go LLD: Rate Limiter protection "mutex per bucket / Redis Lua" → the practice code uses one limiter-wide mutex; sharding is only suggested.
- Delivery Partner Assignment: the comment "never hold it across a network call" → `nextOffer` calls the 3PL `CreateDelivery` while holding `s.mu`.
- Notification System: Common mistakes "Retrying permanent errors like invalid numbers" → `deliver()` retries every Send error up to maxRetries; add retryable classification.
- Decorator Middleware: diagram "Request → Auth → Rate Limit → Logging → Handler" → the code is `Logging(Auth(final))`: Logging is outermost and there is no rate-limit middleware.
- Interpreter: diagram `price < 500` → `MaxPriceExpr` matches `p.Price <= e.Price`.
- Chain of Responsibility: "Each step can accept, reject, or pass forward" → the code can only reject or pass. That is a validation pipeline; classic CoR lets a handler handle the request and stop.
- Mediator: the code is presented as Mediator but is the Facade checkout. Mediator requires colleagues that hold the mediator and notify it, with the mediator routing between them.
- Behavioral Patterns: "Mediator | checkout orchestration between services" → that is a Facade or orchestrator (saga orchestrator), not Mediator.
- Bridge: "separates abstraction from implementation so both can vary independently" → the code has one Report type, so only one axis varies; as written it is Strategy.
- SOLID: the LSP example "MockGateway returns success but does not validate amount. Tests may lie." → that is fake fidelity. LSP is about honoring the interface contract: e.g. a repository returning `(nil, nil)` where the contract says `ErrNotFound`, or an io.Writer returning n < len(p) with a nil error.
- LLD with Go Content Table: "copy the pattern code and the `main` example into one `package main` file ... `go run main.go`" → fails for Factory (`method EmailNotifier.Send already declared at ./main.go:14:22`), Facade (`undefined: fakeInventory`, `fakePayment`, `fakeOrders`) and Mediator (`undefined: InventoryService/PaymentService/OrderService/Request/fake*`). Decorator blocks on `ListenAndServe`. 23 of 24 main blocks use `fmt` without showing the import.
- Go LLD Folder Structure: the "Minimal main.go example" uses `order.`, `inventory.`, `delivery.` with no imports → does not compile as shown.
- LLD with Go - START HERE: study-order numbering goes "… 9. Zepto, 7. Creational, 8. Structural, 9. Behavioral …" → renumber.
- LLD Question Bank: signatures, entities and states disagree with the full solutions (Parking `ParkVehicle/UnparkVehicle/FindSpot` + Floor vs `Park/Exit/ExitLostTicket` with no Floor class; Vending "idle, has money, selected, dispensing" vs the 5 real states; Library omits Held).
- Design flaws (not factual, listed for the rewrite):
  - Zepto PlaceOrder and the Facade/Mediator Checkout reserve stock with no release on a later failure.
  - Splitwise `CreateGroup` overwrites an existing group's balances.
  - Elevator `Snapshot(id)` panics on a bad id; Movie `SeatState` panics on an unknown seat.
  - Proxy, Repository, Observer and Flyweight examples use unguarded maps.
  - Rate Limiter key maps grow forever.
  - Notification uses `text/template` for email bodies.

### Owner content worth preserving
- There are no owner-handwritten lines and no pasted screenshots in this area: `hand` = 0 for all 60 notes, and the only embeds are the 15 drawings.
- Practice solutions (verbatim, highest value in the area): 15 full solutions plus test suites, all compiling, `go vet` clean and passing `go test -race`, with 86-100% statement coverage.
- SQL from the practice notes: Parking's partial unique indexes + `FOR UPDATE SKIP LOCKED`, Meeting's `EXCLUDE USING gist (room_id WITH =, during WITH &&)`, Inventory's conditional UPDATE, Rate Limiter's Redis Lua sketches.
- Drawings: 15 Excalidraw drawings, each with a "redraw from memory" checklist.
- Tables:
  - Concurrency: the decision table and the DB-technique table.
  - Errors and patterns: the three kinds of errors, and the pattern → backend use mapping (Content Table).
  - UML: the relationship table, plus its three mermaid examples (class, sequence with alt, state).
  - Practice: the rate-limiter algorithm comparison and the Splitwise worked example.
- Other code: the test-double code (fakes, winner test, clock), Transfer lock ordering, the worker pool, and the GoF State implementation in Vending Machine.

### Compile check (Go 1.24.4 darwin/arm64; harness in `scratchpad/review/gocheck/`)
Pattern notes: each note's Go blocks were concatenated into one `package main` with the package lines dropped and imports merged; `fmt` was added where main used it without importing it (23 notes). Then `go vet` and `go build` were run, and the binary was run against the note's "Example output".

| Pattern | vet/build | output vs note |
|---|---|---|
| Abstract Factory, Adapter, Bridge, Builder/Options, Chain, Command, Composite, Flyweight, Interpreter, Iterator, Memento, Observer, Prototype, Proxy, Repository, Singleton, State, Strategy, Template Method, Visitor (20) | OK | exact match (20/20) |
| Decorator Middleware | OK | n/a: main blocks on `http.ListenAndServe(":8080")` |
| Factory | FAIL: `./main.go:35:22: method EmailNotifier.Send already declared at ./main.go:14:22` | n/a |
| Facade | FAIL: `./main.go:41:27: undefined: fakeInventory`; `./main.go:41:44: undefined: fakePayment`; `./main.go:41:59: undefined: fakeOrders` | n/a |
| Mediator | FAIL: `./main.go:9:15: undefined: InventoryService`; `./main.go:10:15: undefined: PaymentService`; `./main.go:11:15: undefined: OrderService`; `./main.go:14:62: undefined: Request`; `./main.go:26:20: undefined: fakeInventory`; `./main.go:27:20: undefined: fakePayment`; `./main.go:28:20: undefined: fakeOrders`; `./main.go:31:61: undefined: Request` | n/a |

staticcheck finds only S1016 in Memento (trivial).

Practice notes: the folded "Full runnable code" and "Full test code" were extracted into one package per note, then `go vet ./...` and `go test -race -count=1 ./...` were run.

| Note | vet | test -race | coverage |
|---|---|---|---|
| Cart Checkout | ok | pass | 97.2% |
| Delivery Partner | ok | pass | 89.2% |
| File Search | ok | pass | 100% |
| Food Ordering | ok | pass | 96.8% |
| Inventory Order | ok | pass | 90.0% |
| LRU Cache | ok | pass | 97.6% |
| Library | ok | pass | 96.3% |
| Logging | ok | pass | 86.2% |
| Meeting Room | ok | pass | 92.5% |
| Movie Booking | ok | pass | 91.9% |
| Notification | ok | pass | 91.5% |
| Parking Lot | ok | pass | 95.1% |
| Rate Limiter | ok | pass | 98.5% |
| Splitwise | ok | pass | 86.3% |
| Vending | ok | pass | 86.9% |
| Elevator | ok (builds) | no tests | 0% |

staticcheck finds only SA4000 in the Notification test, a false positive caused by side-effecting `Allow()` calls.
By reading:
- `Go LLD Folder Structure` main.go does not compile: undefined `order` / `inventory` / `delivery`, no imports.
- The Question Bank and Zepto blocks are signature fragments, not compilable on their own.
