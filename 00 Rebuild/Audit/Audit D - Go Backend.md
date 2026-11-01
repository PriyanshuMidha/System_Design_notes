---
tags: [rebuild/audit]
reviewed: 2026-11-02
---

# Audit D - Go Backend

> [!info] What this is
> One block per old note: what it has, what is wrong, what to keep, where it goes, and the **must-cover outline** the rewrite follows. Verdicts: KEEP · POLISH · REWRITE · MERGE · SPLIT · DELETE. Depth 0 (definition only) to 5 (complete). The area plan is at the end. Back to [[Rebuild Plan]].

Method: read every original note in full (they are short), plus the 3 LLD Go notes for overlap. Verification artefacts are under `scratchpad/review/gocheck-go/`:
- `scripts/compare.py` and `compare_strict.py`: section-by-section diff of the Complete Notes against the small notes.
- `deadlock/`, `probe/`, `panicsrv/`, `vetcancel/`, `apis/`, `wggo/`: Go 1.24.4 programs that check the claims below.
- `scripts/boiler.py`: boilerplate share per note.
- `scripts/gapgrep.py`: vault-wide topic grep.

Folder facts:
- Only ~6% of lines are repeated boilerplate (the vault average is 44%). The problem in this folder is thin content, not template text.
- 36 of 56 notes contain no Go code block at all.
- 33 notes end with a "Coding task" whose solution never appears.
- No note has handwritten lines or images (audit: hand=0, imgs=0 for all 57).

---

### Go API Client External Calls
`advance backend/theory/golang backend/Go API Client External Calls.md` · 39 lines · real 18 · depth 1 · REWRITE
- Has: 7 rules (timeouts, safe retries, idempotency key, provider request id, error mapping) and 4 mistakes; no code.
- Problems: a note about HTTP clients that shows no client code, and the coding task asks for a "client shape" the note never shows. Missing:
  - `http.DefaultClient` has `Timeout: 0` (verified).
  - `DefaultMaxIdleConnsPerHost = 2` (verified), which causes connection churn when calling one host.
  - Close and drain `resp.Body` so the connection can be reused.
  - A non-2xx response returns `err == nil`; the code must check `StatusCode`.
  - `NewRequestWithContext`, backoff with jitter, Retry-After, and the circuit-breaker states.

  It also links `[[Reliability Content Table]]`, a navigation note that will go away.
- Keep: the rule list (as a summary box); the InvoiceOps provider list (payment, email, storage, SMS).
- New home: `06 Backend Engineering in Go/Calling External APIs`
- Must cover: one shared http.Client per provider, never one per request · Client.Timeout vs per-attempt ctx deadline vs Transport timeouts (DialContext, TLSHandshakeTimeout, ResponseHeaderTimeout, IdleConnTimeout) · pool knobs MaxIdleConns / MaxIdleConnsPerHost (default 2) / MaxConnsPerHost · NewRequestWithContext and deadline budgets · always close and drain the body; cap reads with io.LimitReader · status handling (non-2xx is not an error) and mapping provider errors to domain errors · retry policy: retry only idempotent ops or ops with an Idempotency-Key; exponential backoff with full jitter; honour Retry-After on 429/503; retry budget · circuit breaker (closed/open/half-open, sony/gobreaker) and a bulkhead (semaphore) per dependency · hedged requests for tail latency (idempotent ops only) · outbound rate limiting with x/time/rate to respect provider quotas · SSRF guard when the URL is user-supplied (Dialer.Control blocking private and link-local ranges) · tracing with otelhttp.NewTransport and logging provider request ids · tests with httptest.Server plus fault injection (timeout, 500, 429, slow body)
- Diagrams: sequence diagram of one call with retries inside the parent ctx deadline: attempt 1 times out, backoff with jitter, attempt 2 gets 429 with Retry-After, attempt 3 succeeds. State diagram of a circuit breaker: Closed → Open on failure ratio → Half-Open probe → Closed or Open.

### Go Auth JWT Sessions
`advance backend/theory/golang backend/Go Auth JWT Sessions.md` · 61 lines · real 27 · depth 2 · REWRITE
- Has: one-line JWT vs session comparison; sound advice (short-lived access token, hashed rotating refresh token); middleware flowchart; checklist.
- Problems: no Go code: no JWT parse/verify, no middleware, no context key.

  Misleading claim: "JWT is stateless … harder to revoke immediately unless you use short expiry and refresh-token storage". Short expiry only limits how long a stolen token works. Revoking a live access JWT requires a server-side check (a jti denylist or a per-user token version).

  Missing:
  - Pinning the algorithm (alg=none and RS→HS confusion attacks).
  - Validating exp/nbf/iss/aud.
  - Key rotation with kid and JWKS.
  - Cookie vs header storage, and CSRF when using cookies.
  - Refresh-token reuse detection.
  - Object-level authorization enforced in queries.
- Keep: the recommendation list and checklist; the middleware flowchart idea (rebuild it as a sequence diagram).
- New home: `06 Backend Engineering in Go/Authentication and Authorization in Go`. Concepts stay in `12 Security & Auth` (JWT, sessions, refresh tokens, OAuth).
- Must cover: authn vs authz recap (link to 12) · sessions: opaque crypto/rand ID in an HttpOnly + Secure + SameSite cookie, server store in Redis or Postgres, sliding vs absolute expiry · access JWTs with golang-jwt/jwt/v5: ParseWithClaims, WithValidMethods, WithIssuer/WithAudience, leeway, RegisteredClaims · HS256 vs RS256/EdDSA; kid + JWKS rotation · refresh tokens: opaque, stored hashed, rotated on every use; reuse revokes the whole token family · logout and revocation (delete session, revoke refresh token, jti denylist with TTL = remaining exp) · auth middleware: extract → verify → store the principal in ctx under an unexported key type; 401 vs 403 · authorization: workspace membership + role (RBAC), object checks in SQL (`WHERE workspace_id = $1`) to stop BOLA/IDOR · CSRF for cookie auth (SameSite, CSRF token, `http.CrossOriginProtection` in Go 1.25) · login hardening: rate limit per IP + account, uniform errors and timing (no account enumeration), audit events · OAuth2/OIDC login in Go (x/oauth2 + go-oidc: state, PKCE, ID-token verification) · tests: expired, forged and wrong-alg tokens; cross-workspace access returns 404/403
- Diagrams: sequence diagram covering:
  - login, then access + refresh tokens issued;
  - an API call, then 401 expired;
  - refresh rotation;
  - replay of the old refresh token revokes the token family.

  Flowchart of the middleware chain: authn → load principal → authz (workspace, role) → handler.

### Go Backend Coding Roadmap
`advance backend/theory/golang backend/Go Backend Coding Roadmap.md` · 148 lines · real 72 · depth 0 · MERGE→`06 Backend Engineering in Go/Capstone - InvoiceOps`
- Has: 8 build phases (setup through production), each listing "Build" items and "Revise" links.
- Problems: a meta/plan note with no teaching content. It duplicates the InvoiceOps "Development milestones" and "Advanced coding modules" sections. 15% of its lines are repeated. It has 30+ links to notes the rebuild renames or removes.
- Keep: the phase order and per-phase build lists (they become capstone milestones with acceptance criteria); the rule "every note ends with a code task".
- New home: `06 Backend Engineering in Go/Capstone - InvoiceOps` (section "Build phases"); the order also feeds `00 Home/Roadmap`.
- Must cover: n/a (merge). The capstone outline is in the InvoiceOps block.
- Diagrams: n/a. The capstone gets a phase-timeline flowchart.

### Go Backend Complete Notes
`advance backend/theory/golang backend/Go Backend Complete Notes.md` · 3863 lines · real 1879 · depth 1 · DELETE
- Has: all 55 small notes (every note except Golang Backend Content Table) concatenated word for word, plus a 133-line preamble.
- Problems: I verified this by script, comparing section by section and line by line with headings demoted one level.
  - Zero lines exist only in the small notes.
  - Each section adds only a `Source note: [[…]]` line and a `---` separator.
  - The preamble has 5 parts: How to use, Correct study flow, Master TOC, Video and Resource Map, and a "Big picture" mermaid diagram.

  So the file is a pure duplicate. It doubles search hits, carries every error of the parts (the channel deadlock, the swallowing recover middleware), and makes the line-frequency audit overcount repeated lines in this folder.
- Keep: 9 resource URLs that exist nowhere else in the vault (checked by script):
  - `go.dev/tour/`
  - `go.dev/doc/code`
  - `go.dev/blog/context`
  - `go.dev/doc/tutorial/web-service-gin`
  - `docs.docker.com/guides/golang/`
  - `opentelemetry.io/docs/languages/go/libraries/`
  - `dev.to/techschoolguru/the-complete-grpc-course-protobuf-go-java-2af6`
  - `youtube.com/watch?v=VtX9w8uKvEk` (verify: "Tech School gRPC intro")
  - `youtube.com/watch?v=TbdtTm6FCQU` (verify: "benchmarking and pprof")

  Also keep the 7-step "Correct study flow".
- New home: none.
  - The 9 resources go to `19 Interview & Career/Go Learning Resources`.
  - The study flow goes to `00 Home/Roadmap`.
  - Verdict for the pair: the small notes are the source of truth (they hold 100% of the content). Delete this file once the preamble has been moved. In the rebuild neither copy survives as-is: the small notes are rewritten or merged per the blocks in this file.
- Must cover: n/a (pure duplicate).
- Diagrams: n/a. The "Big picture" flowchart is a generic table-of-contents chain; drop it.

### Go Benchmarking wrk h2load ghz pprof
`advance backend/theory/golang backend/Go Benchmarking wrk h2load ghz pprof.md` · 52 lines · real 17 · depth 1 · SPLIT
- Has: the tool list; `go test -bench=.`; `wrk -t4 -c100 -d30s`; a ghz command (syntax correct); 5 mistakes.
- Problems:
  - No benchmark function and no pprof workflow. h2load is listed but never shown. A race-detector section sits here by mistake.
  - "benchmarking debug builds only" does not apply to Go: go build and go test optimize by default. The real pitfalls are benchmarking with `-race`, with `-gcflags=all=-N -l`, or on a noisy laptop, and letting the compiler delete the measured work.
  - wrk runs closed-loop, so its p99 hides coordinated omission. Use wrk2, k6 or vegeta at a constant arrival rate.
  - The note mixes Go micro-benchmarks (belongs in 04) with system load testing (belongs in 15).
- Keep: the wrk and ghz commands; the task "record throughput, p50, p95, p99".
- New home: `04 Go Language/Benchmarks, Profiling and Tracing` (testing.B, pprof, trace) + `15 Testing/Load Testing` (wrk2/k6, h2load, ghz)
- Must cover:
  - 04 part: testing.B with `for b.Loop()` (Go 1.24, verified) vs the classic b.N loop · ReportAllocs / -benchmem (ns/op, B/op, allocs/op), ResetTimer, sub-benchmarks · -count=10 + benchstat for statistically sound comparisons · pprof via `go test -cpuprofile/-memprofile`, and net/http/pprof on a private admin port (never the public mux or DefaultServeMux) · profile types: CPU, heap (inuse vs alloc), goroutine, block and mutex (the last two need SetBlockProfileRate / SetMutexProfileFraction) · reading `go tool pprof -http`: flat vs cum, flame graph, `list`, `-diff_base` · `go tool trace` and runtime/trace.FlightRecorder (Go 1.25) · `-gcflags=-m` escape output tied to allocations · PGO with default.pgo (Go 1.21+) · continuous profiling (Pyroscope/Parca) · typical fixes: preallocation, strings.Builder, sync.Pool buffers, fewer pointers.
  - 15 part: open vs closed workload models and coordinated omission · wrk2 -R and k6 constant-arrival-rate · `h2load -n -c -m` for HTTP/2 multiplexing · `ghz --rps --concurrency --connections` · warm-up, a separate load-generator host, p50/p95/p99/p99.9 plus error rate, finding the knee of the latency curve.
- Diagrams: flowchart of the optimisation loop (hypothesis → benchmark → profile → change → benchstat compare); excalidraw of an annotated CPU flame graph with a JSON-encoding hot path.

### Go Bootcamp Coding Checklist
`advance backend/theory/golang backend/Go Bootcamp Coding Checklist.md` · 75 lines · real 54 · depth 0 · MERGE→`06 Backend Engineering in Go/Capstone - InvoiceOps`
- Has: about 50 unchecked task checkboxes covering foundation, language, backend, protobuf, gRPC and production.
- Problems: a progress tracker for the Udemy "Go Bootcamp" course, not a note. The tasks have no solutions or links, and they overlap the Roadmap and the InvoiceOps milestones.
- Keep:
  - Backend, protobuf, gRPC and production items become the capstone acceptance checklist.
  - Language items become "Exercises" at the end of the matching 04 notes: slices/maps, struct + method, interface + fake, pointer mutation, defer/recover, generic helper, reflection on struct tags, file IO, time parsing.
  - Ticking off progress moves to `00 Home/Progress Tracker`.
- New home: `06 Backend Engineering in Go/Capstone - InvoiceOps` (plus the 04 exercises); delete the standalone note.
- Must cover: n/a (merge)
- Diagrams: n/a

### Go Bootcamp Course Coverage Map
`advance backend/theory/golang backend/Go Bootcamp Course Coverage Map.md` · 60 lines · real 37 · depth 0 · MERGE→`19 Interview & Career/Go Learning Resources`
- Has: summary of the Udemy "Go Bootcamp" curriculum; list of notes "added for this course"; study steps.
- Problems: contains generator meta-text, for example "the full paid videos are not directly accessible here" and "Main issue found: earlier notes covered the names of topics, but not enough depth". That diagnosis is still true. The note list duplicates the TOC.
- Keep: the "Course-level topics visible from the curriculum" bullets, as a coverage checklist. They expose topics that no note covers: closures, recursion, fmt verbs, embedding, text/html templates, regexp, random numbers, URL parsing, base64, hashing, timers/tickers, atomics, OS processes, reflect.
- New home: `19 Interview & Career/Go Learning Resources` (section "Course coverage checklist")
- Must cover: n/a
- Diagrams: n/a

### Go Concurrency Goroutines Channels
`advance backend/theory/golang backend/Go Concurrency Goroutines Channels.md` · 63 lines · real 29 · depth 1 · REWRITE
- Has: one-line goroutine definition, 3-line channel snippet, uses list, worker fan-out flowchart, risks and rules lists.
- Problems:
  - The channel snippet deadlocks: `jobs := make(chan Job); jobs <- Job{ID: "1"}; job := <-jobs`. An unbuffered send blocks forever with no receiver in another goroutine. I ran it: "fatal error: all goroutines are asleep - deadlock!". Fix: receive in another goroutine, or use `make(chan Job, 1)`.
  - `go sendReminder(ctx, invoiceID)` is shown as normal practice. It is fire-and-forget with the request ctx: the ctx is cancelled when the handler returns, and nothing waits for or bounds the goroutine.
  - Risks (leaks, races, deadlocks) are listed with no example of any.
  - No sync, select, WaitGroup, errgroup or patterns.
  - `LLD with Go/Concurrency in Go LLD` already has far better, correct code: mutex check-then-act, lock ordering, a worker pool with backpressure.
- Keep: the risks list and the "know who closes the channel" rule as a summary; the worker-pool flowchart idea.
- New home: `04 Go Language/Goroutines and Channels` (plus NEW `select and Concurrency Patterns`, `sync Primitives and Atomics` and `Memory Model and Data Races`)
- Must cover: goroutine vs OS thread (2 KB initial growable stack, verified `stackMin = 2048`; preview of M:N scheduling) · `go` statement; main exiting kills all goroutines; WaitGroup basics (Add before `go`; `wg.Go` in Go 1.25, absent in 1.24 as verified) · unbuffered = synchronous handoff vs buffered = bounded queue · directional channel types in APIs · close semantics: only the sender closes; receive from closed → zero, ok=false; send on closed, close twice or close nil → panic · `for range ch`; a nil channel blocks forever · runtime deadlock detection only fires when every goroutine is blocked, so a server never triggers it · goroutine leaks: send blocked after a timeout (fix: buffered chan of 1), forgotten consumer, missing ctx.Done case; detect with the goroutine profile or goleak · ownership pattern: the owner creates, writes and closes, and returns `<-chan` · request/response over channels; generators · fire-and-forget from handlers: detach with context.WithoutCancel, add a timeout, and bound the count · channels vs mutex decision (link the LLD table)
- Diagrams: sequence diagram of an unbuffered handoff (the sender blocks until the receiver is ready) vs a buffered one (the sender continues until the buffer is full). State diagram of a channel (open → closed) showing which operations panic and which return zero.

### Go Configuration Environment
`advance backend/theory/golang backend/Go Configuration Environment.md` · 43 lines · real 21 · depth 1 · REWRITE
- Has: env var names, 5 rules, 4 mistakes; no code.
- Problems: the coding task asks for `internal/config.Load()` but no code is shown. Missing: LookupEnv vs Getenv, typed parsing (durations, ints, bools), aggregated validation, precedence, secret sources, and redaction in logs. It links `[[Docker Content Table]]` (a navigation note).
- Keep: the env var set (APP_ENV, HTTP_ADDR, DATABASE_URL, REDIS_ADDR, JWT_SECRET, RAZORPAY_WEBHOOK_SECRET, LOG_LEVEL) as the capstone config; the rules list.
- New home: `06 Backend Engineering in Go/Configuration and Secrets`
- Must cover: 12-factor config and why env vars · a typed Config struct with `Load() (Config, error)` built once in main and injected (no package globals, no env reads in `init()`) · os.LookupEnv vs Getenv (unset vs empty) · parsing with strconv, time.ParseDuration and url.Parse; defaults · fail-fast validation that collects all errors (errors.Join) · precedence flags > env > file > defaults; the `flag` package · libraries: caarlos0/env, envconfig and koanf vs viper (global state, key lowercasing) · secret sources: AWS Secrets Manager/SSM/Vault, K8s Secrets as env vs mounted files, External Secrets/CSI · rotation: reload on SIGHUP vs restart; DB credential rotation · never log secrets: redact via `String()` or slog `LogValuer` · per-environment config; feature flags vs config (link 13) · tests with t.Setenv
- Diagrams: flowchart of config resolution at startup: defaults → file → env → flags → validate → fail fast, or build dependencies.

### Go Context Package
`advance backend/theory/golang backend/Go Context Package.md` · 45 lines · real 19 · depth 1 · REWRITE
- Has: what context is and is not for; one pass-through example; sensible common mistakes.
- Problems: not one context constructor is shown. Exactly what is missing:
  - WithCancel / WithTimeout / WithDeadline / WithValue usage.
  - A `ctx.Done()` select loop.
  - `ctx.Err()` values (Canceled vs DeadlineExceeded) and context.Cause.
  - `defer cancel()` and the leak `go vet` catches (verified: "the cancel function returned by context.WithTimeout should be called, not discarded, to avoid a context leak").
  - Typed, unexported context keys.
  - Propagation into goroutines, `db.QueryContext`, `http.NewRequestWithContext` and gRPC.
  - When `r.Context()` is cancelled.
  - Go 1.21's WithoutCancel and AfterFunc.
- Keep: the "for / not for" lists; the export example (a client disconnect cancels the DB query and file generation).
- New home: `04 Go Language/Context Package`
- Must cover: the Context interface (Deadline, Done, Err, Value); contexts are immutable (derive, never mutate) · Background vs TODO; ctx as the first parameter, not stored in structs · WithCancel / WithTimeout / WithDeadline + `defer cancel()`; go vet lostcancel · cancellation tree: a parent's cancel cascades to children, never the reverse · `select { case <-ctx.Done(): return ctx.Err() … }` in worker loops; checking ctx in CPU-bound loops · Canceled vs DeadlineExceeded; WithCancelCause / WithTimeoutCause + context.Cause (1.20/1.21) · WithValue: unexported key type, request-scoped data only (request id, principal, trace), typed accessor functions · server side: r.Context() is cancelled on client disconnect or when ServeHTTP returns; client side: NewRequestWithContext · database/sql `*Context` methods, Redis and gRPC (deadline sent as grpc-timeout and enforced server-side) · deadline budgets across hops (don't reset a fresh 5s at each layer) · work after the response: context.WithoutCancel + its own timeout; AfterFunc · leaks from ignored cancellation; tests with cancelled and expired contexts and t.Context() (1.24)
- Diagrams: flowchart TD context tree: request ctx → WithTimeout(db, 2s) → WithCancel(fan-out workers), showing the cascade on client disconnect. Sequence diagram of a deadline flowing handler → service → DB/HTTP/gRPC and the DB query being cancelled.

### Go Cron Scheduled Jobs
`advance backend/theory/golang backend/Go Cron Scheduled Jobs.md` · 48 lines · real 20 · depth 2 · REWRITE
- Has: the InvoiceOps job list; a correct ticker + ctx.Done select loop; a production checklist (single execution across replicas, idempotency, metrics).
- Problems:
  - Ticker semantics are not explained. A slow job causes dropped ticks because the ticker channel buffers only 1, and nothing prevents overlapping runs.
  - "use locks or a scheduler" gives no mechanism.
  - No cron expressions, time zones, missed-run policy, or K8s CronJob alternative.
  - Links to two navigation "Content Table" notes.
- Keep: the ticker loop code; the job list (overdue marker, due-soon reminders, refresh-token cleanup, payment reconciliation).
- New home: `06 Backend Engineering in Go/Scheduled Jobs`. Concepts go to `09 Messaging & Async/Schedulers and Cron`.
- Must cover: in-process time.Ticker loop (drops ticks when slow; Stop; Go 1.23 timer changes) · robfig/cron v3: cron spec vs @every, WithLocation, WithChain(Recover, SkipIfStillRunning / DelayIfStillRunning) · running once across N replicas: Postgres advisory lock (pg_try_advisory_lock), Redis SET NX PX lock with token-checked release (and why fencing matters), K8s Lease leader election · alternatives: K8s CronJob (concurrencyPolicy: Forbid, startingDeadlineSeconds, backoffLimit) and DB-backed periodic jobs (river / asynq scheduler) · idempotent batches: `WHERE status='sent' AND due_date < now() LIMIT 500 FOR UPDATE SKIP LOCKED`, looping until empty · enqueue work rather than doing it inside the scheduler · time zones and DST (run in UTC; DST gaps skip or double runs) · catch-up policy for missed runs after downtime · jitter to avoid the :00 thundering herd · observability: last-success timestamp gauge + staleness alert (dead man's switch), duration, rows processed · graceful shutdown mid-batch
- Diagrams: sequence diagram of 3 replicas at the same tick: all try the advisory lock, one wins, runs the SKIP LOCKED batch and enqueues reminder jobs. Flowchart of the overdue-scanner batch loop.

### Go Database Migrations
`advance backend/theory/golang backend/Go Database Migrations.md` · 49 lines · real 16 · depth 1 · REWRITE
- Has: a table list, 5 generic rules, the InvoiceOps index list.
- Problems:
  - 21% of lines are repeated (the table lists are copied into 3 notes).
  - No tool, no file example, no Go code.
  - "use transactions where possible" without warning that Postgres `CREATE INDEX CONCURRENTLY` cannot run inside a transaction, and that MySQL DDL commits implicitly.
  - Nothing on zero-downtime migrations (expand/contract) or concurrent migrators.
- Keep: the index list. In particular `webhook_events(provider, event_id) unique` is the constraint that makes webhook idempotency work.
- New home: `06 Backend Engineering in Go/Schema Migrations in Go Services`. Theory is canonical in `07 Databases/Schema Migrations` (from `database/Database Migration`).
- Must cover: versioned migration files (up/down, naming, never edit applied ones) · tools: golang-migrate (schema_migrations table, dirty flag, Postgres advisory lock), goose (SQL or Go migrations, `NO TRANSACTION`), Atlas (declarative diff + lint), tern · migrations embedded with embed.FS / the iofs source · where to run them: app startup vs CI step vs K8s Job / init container; locking against concurrent runners · expand/contract for rolling deploys: add nullable → backfill in batches → dual write → switch reads → drop · lock hazards: lock_timeout; CREATE INDEX CONCURRENTLY outside a tx; table rewrites on some ALTERs (verify per PG version) · MySQL implicit commits; online DDL (gh-ost, pt-osc) · data migrations vs schema migrations; batched backfills · rollback strategy: roll forward vs down migrations · CI runs up → down → up against a real DB (testcontainers) · seed data
- Diagrams: flowchart of expand/contract across three deploys (v1 old column, v2 both, v3 new only) lined up with app versions. Sequence diagram of two pods starting at once and racing for the migration lock.

### Go Database SQL
`advance backend/theory/golang backend/Go Database SQL.md` · 48 lines · real 25 · depth 2 · REWRITE
- Has: "sql.DB is a pool" (correct); one QueryRowContext call with $1 parameters; safe-SQL rules; the names of the pool knobs.
- Problems:
  - The QueryRowContext example never calls `.Scan(...)`. Errors, including sql.ErrNoRows, only surface at Scan.
  - No `Query` loop with `defer rows.Close()` + `rows.Err()`, even though "forgetting rows.Close()" is listed as a mistake.
  - Pool knobs are named without values or defaults. MaxOpen defaults to unlimited and MaxIdle to 2 (both verified in the Go source).
  - "no indexes for common filters" is a database-design point, not a Go one.
- Keep: the safe-SQL rules; the line "sql.DB is not a single connection".
- New home: `06 Backend Engineering in Go/Database Access (database-sql, pgx, sqlc)`. Pooling theory is canonical in `07 Databases/Connection Pooling`.
- Must cover: sql.Open doesn't connect → PingContext at startup · QueryRowContext + Scan + errors.Is(err, sql.ErrNoRows) → domain ErrNotFound · QueryContext loop: defer rows.Close, rows.Next, Scan, rows.Err · ExecContext with RowsAffected or RETURNING · NULLs: sql.Null[T] (1.22), pointers, COALESCE · placeholder style per driver ($1 vs ?) · pool sizing: SetMaxOpenConns (default unlimited), SetMaxIdleConns (default 2), SetConnMaxLifetime / IdleTime; size against DB max_connections × replicas; db.Stats (WaitCount, WaitDuration) as metrics · connection leaks: unclosed rows or tx hold a connection, so requests hang waiting on the pool · context timeouts cancel queries · drivers: pgx native (pgxpool, batch, CopyFrom) vs pgx/stdlib vs lib/pq (maintenance mode; verify current status) · query layer: raw SQL vs sqlc (typed codegen) vs sqlx vs GORM/ent · N+1 and batching (`= ANY($1)`, joins) · prepared statements and PgBouncer transaction-mode caveats · tests against real Postgres (link Testing Go Services)
- Diagrams: sequence diagram of a request borrowing a pool connection (waiting when the pool is exhausted) and returning it on rows.Close. Flowchart: raw SQL vs sqlc vs ORM decision.

### Go Deep Basics Functions Defer Panic Recover
`advance backend/theory/golang backend/Go Deep Basics Functions Defer Panic Recover.md` · 53 lines · real 23 · depth 2 · REWRITE
- Has: one sentence on first-class functions; a variadic sum; defer f.Close with LIFO order; the panic-vs-error rule; a recover middleware.
- Problems:
  - The recover middleware never logs the panic or its stack trace, so panics vanish silently.
  - It writes a 500 even when the handler has already sent headers. In my test, a panic after a partial write produced status 200, body `{"partial":internal error`, and the log line "superfluous response.WriteHeader".
  - It should re-panic `http.ErrAbortHandler`.
  - The coding task, "return 500 without crashing the process", is misleading. net/http already recovers panics in the handler goroutine: with no middleware the process survives and the client gets EOF (tested).
  - A panic in a goroutine started by the handler kills the process no matter what middleware exists, because recover only works in the same goroutine.
  - Missing: closures, defer argument evaluation time, defer with named results, defer inside loops, and os.Exit/log.Fatal skipping defers.
  - The note has no "## Complete notes" heading, unlike its siblings.
- Keep: the variadic example; the defer f.Close idiom; the recover skeleton (the fixed version moves to the 06 Middleware note).
- New home: `04 Go Language/Functions, Closures, Defer, Panic and Recover`. Recover middleware goes to `06 Backend Engineering in Go/Middleware`.
- Must cover: signatures, multiple and named results · variadics, and `f(s...)` aliasing the caller's slice · function types, first-class funcs, method values and method expressions · closures capture variables, not values; Go 1.22 per-iteration loop variables · recursion (no tail-call optimisation) · defer: LIFO, arguments evaluated at the defer statement, runs during a panic, cheap since open-coded defers (1.14) · defer + named result to wrap errors or check Close on writes · defer inside loops holds resources until the function returns (extract a helper) · runtime panics (nil map write, index out of range, nil deref) vs explicit panic · recover: only in a deferred call, only in the same goroutine; re-panic unknown values · os.Exit and log.Fatal skip defers; runtime.Goexit · init() order and why to avoid side effects there · preview of range-over-func iterators (link Generics and Iterators)
- Diagrams: flowchart of a panic unwinding the stack, running deferred calls LIFO until a recover. Sequence diagram showing a panic in a spawned goroutine bypassing the handler's recover and killing the process.

### Go Deployment Docker
`advance backend/theory/golang backend/Go Deployment Docker.md` · 47 lines · real 23 · depth 1 · REWRITE
- Has: a `go build -o` command; a 4-step multi-stage idea in prose; a production checklist; mistakes.
- Problems:
  - A Docker note with no Dockerfile.
  - "Go is easy to deploy because it builds to a single binary" is only fully true with CGO_ENABLED=0 or pure-Go dependencies. cgo builds link libc dynamically and fail on `scratch`, which also lacks CA certificates and tzdata.
  - No GOMAXPROCS or GOMEMLIMIT guidance for containers.
  - Overlaps 10 docker notes plus `deployment/Docker Multi-stage Build`, `auth security/Docker Security Basics` and `cloud deployment/ECR and ECS`.
- Keep: the production checklist.
- New home: `06 Backend Engineering in Go/Containerizing Go Services`. Generic Docker is canonical in `13 DevOps & Cloud`.
- Must cover: a full multi-stage Dockerfile (a `go mod download` layer → build → distroless/static:nonroot) · CGO_ENABLED=0, -trimpath, `-ldflags "-s -w -X main.version=…"`; VCS stamping via debug.ReadBuildInfo · BuildKit cache mounts for GOMODCACHE and GOCACHE; .dockerignore · scratch vs distroless vs alpine (musl, CA certs, tzdata via time/tzdata, non-root user) · multi-arch builds with buildx (TARGETOS/TARGETARCH) or `ko` · exec-form ENTRYPOINT so SIGTERM reaches the binary; PID 1 and when tini is needed · runtime limits: container-aware GOMAXPROCS (Go 1.25; uber automaxprocs before), GOMEMLIMIT ≈ 90% of the memory limit to avoid OOMKill · probes hit app endpoints (distroless has no curl) · migrations as a separate job · hardening: non-root, read-only rootfs, dropped capabilities, image scan (Trivy/Grype), SBOM, cosign, govulncheck in CI · expected image size (~10-20 MB) and startup time
- Diagrams: flowchart of the multi-stage build: builder stage with cache mounts → artifact → minimal runtime image, with layer-cache boundaries marked.

### Go Developer Tooling Git VSCode CLI
`advance backend/theory/golang backend/Go Developer Tooling Git VSCode CLI.md` · 47 lines · real 21 · depth 1 · REWRITE
- Has: a list of go commands, basic Git commands, a VS Code extension list.
- Problems: commands are listed without explanation. Git basics are not Go-specific. Linters, debugger usage, build flags and toolchain management are missing.
- Keep: the command list (as a cheat-sheet table).
- New home: `04 Go Language/Go Toolchain, Tooling and Debugging`, merged with Go Source Code Reading Debugging. If the Git basics are kept, they go to `13 DevOps & Cloud`.
- Must cover: installing and upgrading Go; GOTOOLCHAIN auto-switching (1.21) · go run/build/install/test/vet/fmt/generate/doc/env/clean; build and test caches (-count=1) · gofmt/goimports, go vet analyzers (printf, copylocks, lostcancel, tests), staticcheck, golangci-lint config · gopls in VS Code (rename, references, code actions) · build flags: -race, -trimpath, `-ldflags -X`, -tags, -gcflags=-m · cross-compiling with GOOS/GOARCH and CGO_ENABLED=0 · pinning tools with the go.mod `tool` directive + `go tool` (1.24) · go generate (stringer, mockgen, sqlc) · Delve: dlv debug/test/attach, breakpoints, goroutines, stack; VS Code launch config; dlv in containers · reading panics and stack traces (`goroutine N [state]`, `+0x` offsets, `created by`) · SIGQUIT goroutine dumps, GOTRACEBACK, GODEBUG (gctrace, schedtrace, http2debug) · reading stdlib source (`$(go env GOROOT)/src`) and pkg.go.dev · govulncheck
- Diagrams: flowchart of the inner dev loop (edit → gopls/gofmt → go test -race → lint → commit) and where each tool runs (editor, pre-commit, CI).

### Go Error Handling
`advance backend/theory/golang backend/Go Error Handling.md` · 57 lines · real 26 · depth 2 · REWRITE
- Has: the `if err != nil` pattern, %w wrapping, a mention of Is/As, error categories, an HTTP status table, mistakes.
- Problems:
  - errors.Is/As are named but never shown. There is no sentinel or custom error-type code.
  - The categories list includes "dependency error", but the HTTP table has no row for it (it should map to 502/503/504). There is no 422.
  - Missing: errors.Join, the typed-nil trap, the "log or return, not both" rule, errors from goroutines.
  - `LLD with Go/Error Handling and Interfaces in Go LLD` covers sentinel, typed and wrapped errors with correct code and an HTTPStatus mapper. It is the better source.
- Keep: the category list and HTTP table (extend both); the gist of the interview answer.
- New home: `04 Go Language/Error Handling`. HTTP mapping goes to `06 Backend Engineering in Go/Building REST Endpoints`.
- Must cover: the error interface; errors are values · errors.New and fmt.Errorf; message style (lowercase, no punctuation, "op: %w") · sentinel errors (exported vars become API) · custom error types with fields; pointer receivers · %w vs %v (opaque); multiple %w (1.20) · errors.Is / errors.As / Unwrap chain traversal; custom Is/As methods · errors.Join for validation and cleanup errors · the typed-nil trap: a func returning `(*MyErr)(nil)` as `error` is non-nil · handle once (log or return); add context at boundaries · panic vs error; recover at goroutine and HTTP boundaries · errors from goroutines: errgroup, error channels · Close errors on writes via a named result · domain → transport mapping table (HTTP and gRPC codes) kept at the edge; never leak driver errors
- Diagrams: flowchart of one error's journey: repo (sql.ErrNoRows → ErrNotFound) → service (wrap with context) → handler (errors.Is/As → 404 + problem+json) → log (full chain). Class diagram contrasting sentinel, typed and wrapped error values.

### Go File Uploads
`advance backend/theory/golang backend/Go File Uploads.md` · 43 lines · real 19 · depth 1 · REWRITE
- Has: a 9-step backend flow, a security checklist, the plan "local disk first, then S3".
- Problems:
  - No Go code: no MaxBytesReader, ParseMultipartForm, FormFile or streaming.
  - "validate content type/extension": both are client-controlled. Sniff the bytes instead (http.DetectContentType on the first 512 bytes) and check against an allowlist.
  - No presigned direct-to-S3 uploads, which are the production default for large files.
  - Overlaps `api design/File Upload Architecture`, `aws/AWS S3` and `system design practice/Design File Storage`.
- Keep: the flow and the checklist.
- New home: `06 Backend Engineering in Go/File Uploads and Object Storage`. Architecture is canonical in `05 APIs/File Uploads`.
- Must cover: http.MaxBytesReader + 413 · ParseMultipartForm(maxMemory) spills to temp files; FormFile/FileHeader (Filename is untrusted) · streaming with r.MultipartReader + io.Copy, no full buffering · content sniffing + allowlist; check image size with image.DecodeConfig before decoding (decompression bombs) · storage keys are random IDs, never user filenames; filepath.Base and os.Root (Go 1.24, verified) for local disk · S3 via aws-sdk-go-v2 manager.Uploader (multipart) · presigned PUT/POST for direct browser uploads (expiry, content-length-range, content-type conditions) + a confirm step · metadata row lifecycle: pending → scanned → available · async virus scan and SHA-256 checksum · downloads: presigned GET, `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff` · cleanup: orphan job + S3 lifecycle rule for incomplete multipart uploads · resumable uploads (S3 multipart parts, tus)
- Diagrams: sequence diagram of a presigned upload: client asks API for a URL → PUT to S3 → S3 event or confirm call → scan worker → status available. Flowchart of the server-side streaming path with its size and type gates.

### Go Generics Reflection Runtime
`advance backend/theory/golang backend/Go Generics Reflection Runtime.md` · 44 lines · real 20 · depth 1 · SPLIT
- Has: one generic Ptr[T] helper; a list of reflection uses; a bare list of runtime topic names.
- Problems: three advanced areas in 40 lines.
  - Generics stop at `any`: no constraints, ~T, comparable, type sets or generic types.
  - Reflection has no API at all.
  - "Runtime" is a 5-word list: scheduler, GC, stack growth, race detector and pprof are never explained. This is the biggest gap for an SDE-3 Go track.
  - Ptr[T] may become unnecessary if Go 1.26 adds `new(expr)` (verify).
- Keep: the Ptr[T] example; the guidance "do not use generics just to avoid writing two functions"; the struct-tag reflection task.
- New home: `04 Go Language/Generics and Iterators` + `04 Go Language/Reflection and unsafe` + `04 Go Language/Runtime - Goroutine Scheduler (GMP)` + `04 Go Language/Runtime - Memory Allocator and Garbage Collector`. The two runtime outlines are under Gaps below.
- Must cover:
  - Generics and Iterators: type parameters on funcs and types · constraints as interfaces: any, comparable, method constraints, unions and ~T, cmp.Ordered · type inference and when explicit instantiation is needed · generic types (Set[T], LRU[K comparable, V any]); methods cannot declare their own type params · `var zero T` · GC-shape stenciling + dictionaries, and the performance tradeoff vs interfaces · generic type aliases (1.24) · slices/maps/cmp (1.21) · iterators: iter.Seq/Seq2, the yield contract, iter.Pull, maps.Keys, slices.Collect, strings.SplitSeq · choosing generics vs interfaces vs duplication.
  - Reflection and unsafe: TypeOf/ValueOf, Kind vs Type, the laws of reflection, settability via pointer + Elem · iterating struct fields and tags (Tag.Get) · DeepEqual pitfalls (nil vs empty slices) · reflection cost and why encoding/json is slower than codegen · unsafe.Pointer's valid patterns, Sizeof/Alignof/Offsetof, unsafe.String/Slice (1.20), uintptr hazards, go vet unsafeptr · cgo call cost and its static-linking impact.
- Diagrams: Generics: flowchart for "interface vs generic vs any". Reflection: excalidraw of an interface value (type word + data word) mapped to reflect.Type / reflect.Value.

### Go Graceful Shutdown
`advance backend/theory/golang backend/Go Graceful Shutdown.md` · 41 lines · real 19 · depth 1 · REWRITE
- Has: a 6-step shutdown sequence; tool names (os/signal, WithTimeout, Server.Shutdown); mistakes.
- Problems:
  - No code, for the most code-shaped topic in the folder.
  - "Production services must stop cleanly during deploys, restarts, and crashes" is wrong for crashes. Crashes, SIGKILL and OOM kills cannot be intercepted; graceful shutdown only handles SIGTERM/SIGINT. Crash safety comes from idempotent, at-least-once processing.
  - Misses the classic bug: when Shutdown starts, ListenAndServe returns ErrServerClosed immediately, so main must wait for Shutdown, not for ListenAndServe.
  - Also missing: the K8s endpoint-propagation delay (preStop / readiness), hijacked WebSocket connections that Shutdown does not drain, gRPC GracefulStop.
- Keep: the 6-step order (extend it).
- New home: `06 Backend Engineering in Go/Graceful Shutdown and Health Checks`
- Must cover: SIGTERM vs SIGINT vs SIGKILL; signal.NotifyContext · server goroutine checking `errors.Is(err, http.ErrServerClosed)` · Shutdown(ctx with timeout): stops listeners, closes idle conns, waits for active ones; Close as fallback · main waits for Shutdown to finish · K8s termination: Terminating → endpoint removal races SIGTERM → readiness=false + preStop sleep → drain; budget within terminationGracePeriodSeconds (default 30s) · liveness vs readiness vs startup probes, and what each must or must not check · hijacked and long-lived conns: RegisterOnShutdown, WebSocket close 1001, SSE · workers: stop fetching, finish in-flight jobs (WaitGroup + deadline), nack or requeue the rest · gRPC GracefulStop with timeout → Stop · flush telemetry (TracerProvider.Shutdown), then close DB and Redis pools last · errgroup running server + workers + signal watcher; a second signal forces exit · log.Fatal and os.Exit skip defers · testing: send SIGTERM mid-request and assert the request completes
- Diagrams: sequence diagram: K8s sends SIGTERM to the pod; the app sets readiness=false, sleeps, calls Shutdown, drains workers, flushes and exits 0, while the endpoints controller removes the pod in parallel. State diagram: Running → Draining → Stopped, with → Killed if the grace period is exceeded.

### Go GraphQL Backend
`advance backend/theory/golang backend/Go GraphQL Backend.md` · 57 lines · real 26 · depth 1 · MERGE→`05 APIs/GraphQL`
- Has: a sample dashboard query; library names (gqlgen, graphql-go); a production checklist (depth/complexity limits, DataLoader, field-level auth).
- Problems: no schema, resolver or gqlgen workflow. The checklist duplicates `Api architecture/GRAPHQL`. The capstone marks GraphQL as optional, so a standalone Go note isn't justified.
- Keep: the dashboard query example; the production checklist.
- New home: `05 APIs/GraphQL`, section "Implementing in Go with gqlgen".
- Must cover (Go section): schema-first gqlgen: schema.graphqls → `gqlgen generate` → resolver stubs · resolver ctx, auth from ctx, field-level authorization · a per-request dataloader (dataloadgen) to fix N+1 · complexity and depth limits (FixedComplexityLimit); introspection off in prod; APQ / persisted queries · errors: HTTP 200 with errors[] + extension codes · subscriptions over WebSocket · testing resolvers with the gqlgen client
- Diagrams: sequence diagram of N+1 vs dataloader batching (10 invoices → 1 batched client lookup).

### Go HTTP Server
`advance backend/theory/golang backend/Go HTTP Server.md` · 58 lines · real 28 · depth 2 · REWRITE
- Has: the handler signature, a request-flow sequence diagram, timeout names, mistakes, an interview answer.
- Problems:
  - The handler does a manual `r.Method != http.MethodPost` check. That has been outdated since Go 1.22: register "POST /invoices" and ServeMux returns 405 with an Allow header (verified). It also contradicts the REST note.
  - Timeouts are named, but there are no values and no http.Server code. ReadHeaderTimeout (Slowloris protection) is missing.
  - The diagram puts middleware after the router; global middleware wraps the mux.
  - Missing: the Handler interface, ResponseWriter rules, and the goroutine-per-request model.
- Keep: the sequence diagram (fix the ordering); the mistakes "writing response twice" and "decoding huge request bodies without limits".
- New home: `06 Backend Engineering in Go/HTTP Server Fundamentals (net-http)`
- Must cover: Handler interface, HandlerFunc adapter, ServeMux · one goroutine per connection; HTTP/1.1 requests are sequential per conn, HTTP/2 gets a goroutine per stream · Go 1.22 patterns: method, host, {id}, {path...}, {$}; precedence (most specific wins; conflicts panic at registration); automatic 405 + Allow; GET also matches HEAD (verified); r.PathValue · ResponseWriter rules: set headers before WriteHeader/Write, implicit 200, a single WriteHeader, Content-Type sniffing · http.Server fields with recommended values: ReadHeaderTimeout, ReadTimeout, WriteTimeout, IdleTimeout, MaxHeaderBytes (1 MB default) · per-request deadlines with http.ResponseController (1.20); http.TimeoutHandler (503) · request body limits via MaxBytesReader · DefaultServeMux pitfalls (pprof and expvar register on it as an import side effect) · ListenAndServe errors and ErrServerClosed (link the shutdown note) · keep-alive and connection reuse · routers: stdlib vs chi vs gin/echo; fiber sits on fasthttp and is not net/http-compatible · thin handlers: decode → validate → service → map error → encode
- Diagrams: sequence diagram client → listener → conn goroutine → middleware chain → mux → handler → service → DB, annotated with where each timeout applies (ReadHeader, Read, Write, Idle).

### Go HTTPS HTTP2 TLS Server
`advance backend/theory/golang backend/Go HTTPS HTTP2 TLS Server.md` · 40 lines · real 17 · depth 1 · REWRITE
- Has: one-line HTTPS and HTTP/2 definitions; an http.Server with 3 timeouts and ListenAndServeTLS; "TLS is often terminated at the load balancer".
- Problems:
  - `err := srv.ListenAndServeTLS("server.crt", "server.key")`: the error is never handled, and http.ErrServerClosed must be treated as a normal exit.
  - No tls.Config at all.
  - Doesn't say HTTP/2 is enabled automatically over TLS (via ALPN), or how to get h2c (cleartext HTTP/2).
  - No mTLS, certificate reload or autocert.
  - Concept overlap with `aws/Domain DNS HTTPS SSL TLS`.
- Keep: the server snippet (add ReadHeaderTimeout and the error check).
- New home: `06 Backend Engineering in Go/TLS, HTTPS and HTTP2 in Go Servers`. Protocol theory is canonical in `02 Networking & Web`.
- Must cover: ListenAndServeTLS vs Server.TLSConfig + ServeTLS · tls.Config defaults: server minimum is TLS 1.2 since Go 1.22 (GODEBUG `tls10server` confirmed in source); TLS 1.3 suites aren't configurable; hybrid post-quantum X25519MLKEM768 by default (1.24) · certificates: chain order, SANs, a local CA with mkcert · automatic HTTP/2 via ALPN; disabling it with TLSNextProto; h2c via Server.Protocols SetUnencryptedHTTP2 (1.24, verified) or x/net/http2/h2c · hot cert reload with GetCertificate; autocert (ACME / Let's Encrypt) · mTLS: ClientAuth RequireAndVerifyClientCert + ClientCAs; identity from VerifiedChains / SPIFFE · HTTP → HTTPS redirect + HSTS · termination at ALB/Ingress: X-Forwarded-Proto, trusted proxies, re-encryption to pods · client side: RootCAs, never InsecureSkipVerify; KeyLogWriter for Wireshark · HTTP/3 only via quic-go · certificate expiry monitoring
- Diagrams: sequence diagram of a TLS 1.3 handshake with ALPN selecting h2, followed by multiplexed streams. Flowchart of termination options: edge-terminated, re-encrypt, passthrough + mTLS.

### Go JSON Validation DTOs
`advance backend/theory/golang backend/Go JSON Validation DTOs.md` · 49 lines · real 25 · depth 2 · REWRITE
- Has: request and response DTO structs, a validation checklist, and "never let clients set server-owned fields".
- Problems: no decoding or validation code. It misses the encoding/json behaviours that make mass assignment and bad input possible:
  - Key matching is case-insensitive. Verified: `{"STATUS":"paid"}` sets Status despite the tag `json:"status"`.
  - With duplicate keys the last one wins (verified).
  - Unknown fields are silently ignored.
  - Missing, zero and null are indistinguishable without pointers.

  There is no field-error response format, and `CreateInvoiceItemRequest` is never defined.
- Keep: the DTO examples; the validation checklist; the server-owned-fields rule.
- New home: `06 Backend Engineering in Go/Request Decoding, Validation and DTOs`
- Must cover: separate request DTO → domain command → response DTO · readJSON: MaxBytesReader, json.Decoder, DisallowUnknownFields, reject trailing data (a second Decode must return io.EOF) · classify decode errors (SyntaxError offset, UnmarshalTypeError field, empty body, 413) · encoding/json gotchas: case-insensitive keys, duplicate keys, numbers become float64 in `any` (UseNumber), omitempty vs omitzero (1.24, verified), time.Time as RFC 3339, HTML escaping · json/v2 experiment (Go 1.25; case-sensitive and rejects duplicates; verify) · PATCH: pointer fields or JSON Merge Patch to tell absent from null · validation: hand-written Validate() vs go-playground/validator tags; cross-field rules; normalisation (trim, lowercase email) · field-level error response (problem+json errors[]); a 400 vs 422 policy · money as int64 minor units + currency, never float · mapping to response DTOs that omit internal fields · fuzzing the decoder
- Diagrams: flowchart of request gates (size limit → decode → unknown fields → validate → authorize → command) with the HTTP status each gate returns.

### Go Language Basics
`advance backend/theory/golang backend/Go Language Basics.md` · 566 lines · real 264 · depth 3 · SPLIT
- Has: correct beginner coverage in 43 snippets: types, control flow, slices/maps, make vs new, nil-map panic, range, builtins, struct tags.
- Problems:
  - "For strings, range gives rune index and rune value" is wrong: range yields the byte offset of each rune. Running it on "भारत" gives 0, 3, 6, 9.
  - "Common mistake: taking address of range variable in old code patterns": since Go 1.22 each iteration gets a fresh variable (verified that &v differs per iteration). The gotcha that remains is that v is a copy, so mutate via items[i].
  - `rupees := float64(cents) / 100` is taught as the conversion example; never do money arithmetic in float64.
  - `count, ok := m["overdue"]; if !ok { count = 0 }` is redundant, because a missing key already returns zero. The comma-ok form exists to tell "absent" from "present with value zero".
  - The zero-value table omits chan, func, interface (all nil) and arrays. The builtins table omits min, max and clear (1.21).
  - A stray indent before `default:` (gofmt would fix it).
  - Nothing on slice aliasing, map internals, shadowing or iota.
- Keep: most snippets and tables (zero values, builtins, the make/new rule, the nil-map panic example, the mini-practice list).
- New home: `04 Go Language/Syntax, Types and Control Flow` + `04 Go Language/Arrays, Slices and Maps (with internals)`. Functions and init go to the Functions note; struct tags and aliases to the Structs note; commands to the Toolchain note.
- Must cover:
  - Syntax, Types and Control Flow: imports (blank and aliased) · var, :=, multiple assignment, := shadowing bugs (err) · const, iota enums + String() via stringer, untyped constants · numeric types, int size, silent overflow wraparound, sign of integer division and modulo · explicit conversions; strconv (ParseInt base/bitSize) · if-with-init; all for forms including range over int (1.22); labelled break/continue · switch: no implicit fallthrough, tagless switch, `fallthrough` · the complete zero-value table · exported names and doc comments · builtins including min/max/clear · fmt verbs (%v %+v %#v %T %q %w).
  - Arrays, Slices and Maps: arrays are values · the slice header {ptr, len, cap}; slicing shares the backing array; the append aliasing bug; full slice expression s[a:b:c] · growth policy (~2x, easing toward 1.25x after 256 elements, rounded to size classes) · copy; nil vs empty slice (JSON null vs []) · sub-slices retaining big arrays (slices.Clone) · slices package (Sort, BinarySearch, Delete zeroing, Compact) · maps: comparable keys, comma-ok, random iteration order, delete during range, map elements aren't addressable · map internals: Go 1.24 Swiss tables (8-slot groups, control bytes, 1024-entry tables) vs the old buckets / overflow / load factor 6.5 · maps never shrink; clear(m) · concurrent map writes are a fatal error, not a panic (link sync) · set idiom map[T]struct{}; capacity hints.
- Diagrams: excalidraw of two slices sharing one backing array, before and after an append reallocates. Excalidraw of a Swiss-table map: groups, control bytes, probing.

### Go Logging Observability
`advance backend/theory/golang backend/Go Logging Observability.md` · 53 lines · real 28 · depth 1 · MERGE→`06 Backend Engineering in Go/Observability in Go Services`
- Has: the three pillars, what to log and not log, an InvoiceOps metric list, mistakes.
- Problems: no log/slog code, no metrics library, no correlation mechanism. The content is language-agnostic and duplicates `observability/Logs Metrics Traces`.
- Keep: the log / don't-log lists and the InvoiceOps metric list.
- New home: `06 Backend Engineering in Go/Observability in Go Services`. Concepts are canonical in `14 Observability & SRE`.
- Must cover: one merged outline, in the Go OpenTelemetry Metrics Tracing block.
- Diagrams: see the merged note.

### Go Middleware
`advance backend/theory/golang backend/Go Middleware.md` · 46 lines · real 21 · depth 1 · REWRITE
- Has: a list of common middleware; a `func(http.Handler) http.Handler` skeleton with before/after comments; the InvoiceOps ordering example.
- Problems:
  - No working middleware and no chaining helper.
  - No ordering rule.
  - No ResponseWriter wrapper for capturing the status code, which is the one hard part.
  - No context values.
  - Overlaps LLD `Decorator Middleware Pattern in Go` and `Chain of Responsibility Pattern in Go`.
- Keep: the middleware list and the InvoiceOps chain example.
- New home: `06 Backend Engineering in Go/Middleware`
- Must cover: the decorator shape and a Chain(h, m...) helper · ordering: outermost runs first; recover → request ID → logging/tracing → CORS → body limit → auth → rate limit → routes · global vs per-route (wrap single handlers; sub-muxes with StripPrefix) · status/bytes capture wrapper with Unwrap() so http.ResponseController keeps Flush/Hijack working · request ID: accept or generate, typed ctx key, echo it in a header · access log with latency and route pattern (r.Pattern, Go 1.23) · recovery done right: log debug.Stack, increment a metric, send 500 only if headers are unsent, re-panic http.ErrAbortHandler · auth middleware putting the principal in ctx · CORS: preflight, origin allowlist, credentials rule · rate limiting (x/time/rate per key with eviction; Redis for multi-instance) · timeouts: http.TimeoutHandler vs ctx deadlines · testing each middleware alone with httptest
- Diagrams: onion diagram (nested flowchart) of the middleware chain, with the request going in, the response coming out, and where the status is captured.

### Go OpenAPI Documentation
`advance backend/theory/golang backend/Go OpenAPI Documentation.md` · 53 lines · real 27 · depth 1 · REWRITE
- Has: what to document; which endpoints to document first; three tool options (manual, annotations, type-first); mistakes.
- Problems: no example spec fragment. No Go tool is named (oapi-codegen, swaggo, kin-openapi, ogen). No spec-first vs code-first tradeoff and no drift prevention. Links two navigation notes.
- Keep: the endpoint list; the "treat it as a contract" task.
- New home: `06 Backend Engineering in Go/OpenAPI-First Development in Go`. Contract concepts are canonical in `05 APIs/API Contracts and OpenAPI`.
- Must cover: spec-first vs code-first, and drift · OpenAPI 3.0 vs 3.1 (JSON Schema 2020-12, nullable) · a minimal spec: paths, parameters, requestBody, responses, components/schemas, $ref · securitySchemes (bearer JWT) and per-operation security · error schema (problem+json) and examples · oapi-codegen: types + strict server for net/http or chi + client · ogen as an alternative; swaggo annotations (Swagger 2.0) tradeoffs · request/response validation middleware (kin-openapi) · breaking-change checks in CI (oasdiff) · serving docs (Swagger UI / Redoc / Scalar) · contract tests (schemathesis) and generated TypeScript clients
- Diagrams: flowchart of the spec-first pipeline: openapi.yaml → server stubs + client SDKs → CI lint and breaking check → docs site.

### Go OpenTelemetry Metrics Tracing
`advance backend/theory/golang backend/Go OpenTelemetry Metrics Tracing.md` · 53 lines · real 26 · depth 1 · MERGE→`06 Backend Engineering in Go/Observability in Go Services`
- Has: what to instrument; useful metrics; a webhook span tree (a good span-naming idea); mistakes (high-cardinality labels).
- Problems: no SDK setup; no instrumentation libraries (otelhttp, otelgrpc, otelsql / otelpgx); no propagation, sampling or shutdown flush.
- Keep: the webhook span tree (`verify_signature → db.check_webhook_event → db.update_invoice → queue.publish_invoice_status`); the metric list.
- New home: `06 Backend Engineering in Go/Observability in Go Services`, one note together with Logging Observability. Concepts go to `14 Observability & SRE`.
- Must cover: log/slog: JSON handler, levels + LevelVar, With attrs, InfoContext with a handler that injects trace_id/span_id, LogValuer redaction · access-log middleware (status, latency, route pattern) · Prometheus client_golang: counters and histograms with low-cardinality labels (route pattern, not raw path), RED metrics, Go runtime collectors, db.Stats, worker metrics (queue depth, oldest-job age, retries, DLQ), served on a private /metrics port · OTel SDK: TracerProvider + OTLP exporter + resource (service.name, version) + ParentBased(TraceIDRatioBased) sampler · W3C TraceContext + Baggage propagators · instrumentation libraries: otelhttp handler/transport, otelgrpc stats handlers, otelpgx/otelsql, go-redis hooks · manual spans: Start/End, semantic-convention attributes, RecordError + SetStatus · trace context through queues (inject/extract in message headers) and background jobs (span links) · exemplars linking histograms to traces · TracerProvider.Shutdown to flush on exit · collector as agent vs gateway; tail sampling to keep error and slow traces · cardinality and PII rules
- Diagrams: sequence diagram of one trace across API → Postgres → Redis Streams → worker → email provider, with traceparent carried in the message. Flowchart of the telemetry pipeline: app SDK → OTel Collector → Tempo/Jaeger, Prometheus, Loki.

### Go Password Hashing
`advance backend/theory/golang backend/Go Password Hashing.md` · 47 lines · real 18 · depth 1 · MERGE→`12 Security & Auth/Password Hashing`
- Has: algorithm names (bcrypt, argon2id, scrypt); the signup/login flow as text; rules; mistakes.
- Problems: no code and no parameters. No mention of bcrypt's 72-byte limit (x/crypto bcrypt returns ErrPasswordTooLong above 72 bytes; verified in the cached module source). This is the only password-hashing note in the whole vault (vault-wide search), so it must become the canonical one in 12, with Go code reused by the 06 auth note.
- Keep: the algorithm list; the mistakes "SHA256 password hashing without salt/work factor" and "leaking whether email exists".
- New home: `12 Security & Auth/Password Hashing`. Go snippets are referenced from `06 Backend Engineering in Go/Authentication and Authorization in Go`.
- Must cover: why fast hashes fail (GPU guess rates) and why a salt alone is not enough · Argon2id (OWASP minimum m=19 MiB, t=2, p=1), scrypt (N=2^17, r=8, p=1), bcrypt (cost ≥ 10, 72-byte limit), PBKDF2-HMAC-SHA256 with 600k iterations for FIPS · Go: x/crypto/argon2.IDKey with PHC-string encoding; bcrypt.GenerateFromPassword / CompareHashAndPassword · a random per-password salt (crypto/rand); optional pepper (HMAC with a server secret) · constant-time compare (subtle.ConstantTimeCompare) · tune cost to ~100-500 ms on prod hardware; DoS considerations (rate limit, queue) · rehash on login when parameters change · user-enumeration defence: same error + a dummy hash for unknown users · password policy per NIST SP 800-63B (length over composition rules, breached-password check via HIBP k-anonymity) · reset tokens: single-use, hashed, short-lived · migrating legacy hashes (wrap the old hash)
- Diagrams: sequence diagram of signup and login, including rehash-on-login and the dummy-hash path for an unknown email.

### Go Pointers Memory Values
`advance backend/theory/golang backend/Go Pointers Memory Values.md` · 45 lines · real 20 · depth 1 · REWRITE
- Has: a pointer definition, a markPaid example, pointer vs value receiver bullets, backend examples, mistakes.
- Problems:
  - "returning pointer to reused loop variable" is listed as a current mistake. Go 1.22's per-iteration loop variables fixed this (verified).
  - "Memory" is in the title, but stack vs heap, escape analysis and GC cost are absent.
  - Missing method sets and addressability, i.e. why a T value may not satisfy an interface whose methods have *T receivers.
- Keep: the receiver rules; backend examples such as "*sql.DB is a shared pool handle".
- New home: `04 Go Language/Pointers, Values and Escape Analysis`
- Must cover: everything is pass-by-value, including pointers and slice/map headers · & and *; new vs &T{} · when to use pointer receivers (mutation, size, no-copy types holding sync.Mutex, consistency) vs value receivers · method sets and addressability: T vs *T interface satisfaction; map elements aren't addressable · nil pointers: deref panics; methods on nil receivers as a deliberate pattern · &s[i] and append reallocation · optional values: pointer vs zero value vs sql.Null[T] · stack vs heap and escape analysis (`go build -gcflags=-m`): returned pointers, conversion to interface, closures, sizes unknown at compile time · cost model: heap allocation + GC scan vs copying small structs · copying structs that hold locks (go vet copylocks) · the pointer-to-interface anti-pattern · no pointer arithmetic outside unsafe
- Diagrams: excalidraw of stack frame vs heap for `func newInvoice() *Invoice` (escapes) vs a local value (stays on the stack), next to the matching `-gcflags=-m` output.

### Go Project Structure and Modules
`advance backend/theory/golang backend/Go Project Structure and Modules.md` · 66 lines · real 34 · depth 2 · SPLIT
- Has: the InvoiceOps directory tree with what each folder means; module commands; easy and difficult examples; mistakes.
- Problems:
  - Modules get one sentence ("unit of dependency management, defined by go.mod"): no go.sum, MVS, semantic import versioning, GOPROXY/GOPRIVATE or workspaces.
  - The `internal` rule is stated loosely.
  - Mixes language modules (belongs in 04) with service layout (belongs in 06).
  - Overlaps LLD `practice/Go LLD Folder Structure for Practice` and the architecture-patterns notes (Clean, Hexagonal, Layered).
- Keep: the InvoiceOps tree and folder meanings; the "main.go wires dependencies" example; the mistakes list.
- New home: `04 Go Language/Packages, Modules and Dependency Management` + `06 Backend Engineering in Go/Service Project Layout and Wiring`
- Must cover:
  - 04 modules: packages vs modules; package naming; init order · go.mod directives: module, go (a minimum version, enforced since 1.21), toolchain, require, replace (local only), exclude, retract, tool (1.24) · go.sum and the checksum DB (GOSUMDB) · MVS: how versions are chosen, and why Go needs no lockfile · semantic import versioning (/v2 paths); pseudo-versions · go get @version / @latest / @none; go list -m -u; go mod why / graph / tidy · GOPROXY, and GOPRIVATE/GONOSUMDB for private repos · vendoring · workspaces (go work) · the exact internal/ visibility rule · govulncheck.
  - 06 layout: cmd/<app>/main.go does the wiring · internal/ packaged by feature vs by layer · avoid util/common packages · dependency direction handler → service → repository · interfaces defined on the consumer side · manual DI vs wire/fx · api/, migrations/, deploy/ folders · golang-standards/project-layout is not official (see go.dev/doc/modules/layout) · multiple binaries (api, worker, migrate) sharing internal packages.
- Diagrams: 04: flowchart of MVS choosing versions over a dependency graph. 06: component flowchart of InvoiceOps packages and the allowed import directions (cmd → http → invoice service → store), showing there are no cycles.

### Go Proto Versioning Best Practices
`advance backend/theory/golang backend/Go Proto Versioning Best Practices.md` · 38 lines · real 19 · depth 2 · MERGE→`05 APIs/Protocol Buffers and Schema Evolution`
- Has: correct core rules (never reuse numbers, reserve, UNSPECIFIED zero enum, versioned packages); reserved example; breaking-change list.
- Problems:
  - "add new fields instead of renaming old fields" gives no reason. Renaming is safe on the binary wire but breaks JSON (protojson uses field names) and generated code.
  - No list of compatible type changes.
  - No tooling (buf breaking).
  - Nothing on evolving oneof or optional fields.
  - Nothing Go-specific despite the title.
- Keep: the rules list and the reserved example.
- New home: `05 APIs/Protocol Buffers and Schema Evolution`
- Must cover: merged outline in the Go Protocol Buffers Deep Dive block.
- Diagrams: see the merged note.

### Go Protobuf Validation
`advance backend/theory/golang backend/Go Protobuf Validation.md` · 37 lines · real 16 · depth 1 · MERGE→`06 Backend Engineering in Go/gRPC Services in Go`
- Has: shape vs business validation; 3 validation layers; examples; tool names (PGV, "protovalidate-style").
- Problems: no annotation or code example. It doesn't say that protoc-gen-validate is in maintenance mode and has been replaced by protovalidate (CEL-based `buf.validate`).
- Keep: the 3-layer model (proto → service → DB constraints).
- New home: `06 Backend Engineering in Go/gRPC Services in Go`, section "Validation".
- Must cover: protovalidate annotations ((buf.validate.field).string.min_len, int64.gt, string.len, enum.defined_only, CEL message rules) · protovalidate-go in a unary interceptor → codes.InvalidArgument with errdetails.BadRequest field violations · business validation in the service · DB constraints as the last line of defence · tests with invalid messages
- Diagrams: flowchart of the validation layers with the status code each one returns.

### Go Protoc Code Generation
`advance backend/theory/golang backend/Go Protoc Code Generation.md` · 37 lines · real 16 · depth 2 · MERGE→`06 Backend Engineering in Go/gRPC Services in Go`
- Has: correct install and protoc commands with `paths=source_relative`; what each generated file contains; mistakes.
- Problems:
  - Installing plugins with `@latest` makes builds non-reproducible. Pin the versions instead, with the go.mod `tool` directive (Go 1.24) or buf remote plugins.
  - No buf workflow.
  - No explanation of go_package's "path;name" form, or why the Unimplemented server must be embedded (by value).
- Keep: the commands and the generated-files explanation.
- New home: `06 Backend Engineering in Go/gRPC Services in Go`, section "Code generation".
- Must cover: protoc include paths (-I) and googleapis imports · go_package semantics · pinned protoc-gen-go / protoc-gen-go-grpc versions · buf.yaml (lint STANDARD, breaking FILE) + buf.gen.yaml, `buf generate`, managed mode · generated code: messages (never copy them; use proto.Clone/Equal), the service interface, Unimplemented embedding for forward compatibility · CI check that generated code is fresh (`git diff --exit-code`) · a policy on committing vs generating
- Diagrams: flowchart .proto → buf lint/breaking → buf generate → *.pb.go / *_grpc.pb.go → server and client.

### Go Protocol Buffers Deep Dive
`advance backend/theory/golang backend/Go Protocol Buffers Deep Dive.md` · 59 lines · real 29 · depth 2 · MERGE→`05 APIs/Protocol Buffers and Schema Evolution`
- Has: a correct proto3 example (package invoice.v1, go_package, UNSPECIFIED as the zero enum value, int64 total_cents); a type list.
- Problems: titled "Deep Dive" but covers no wire format, presence semantics, well-known types, oneof, JSON mapping or Go API rules. Overlaps `Api architecture/GRPC`.
- Keep: the Invoice proto example.
- New home: `05 APIs/Protocol Buffers and Schema Evolution`
- Must cover: messages and field numbers (1-15 encode as one-byte tags; 19000-19999 reserved; max 2^29-1) · wire format: tag = field << 3 | wire type; varint; ZigZag for sint32/64 (a negative int32 costs 10 bytes); length-delimited · proto3 implicit presence vs `optional` explicit presence; wrappers · enums: UNSPECIFIED zero, value prefixes, open enums and unknown values · oneof, maps, repeated (packed) · well-known types: Timestamp, Duration, FieldMask (partial updates), Struct, Any, Empty · unknown-field preservation · JSON mapping via protojson (lowerCamelCase, int64 as string) · evolution: never reuse numbers; reserve names and numbers; compatible type changes (int32/uint32/int64/uint64/bool; sint32↔sint64; string↔bytes when UTF-8); renames break JSON; moving fields into a oneof · buf breaking levels (FILE / PACKAGE / WIRE_JSON / WIRE) · Editions (2023/2024) replacing `syntax` · Go API rules: don't copy messages, proto.Equal/Clone, nil-safe getters, the Opaque API · protobuf vs JSON size and speed, benchmarked
- Diagrams: byte-level excalidraw of the encoding of `Invoice{id:"inv_1", total_cents:1500}` (tag bytes, varint, length prefix). Flowchart deciding compatible vs breaking changes.

### Go REST API Coding
`advance backend/theory/golang backend/Go REST API Coding.md` · 70 lines · real 32 · depth 2 · REWRITE
- Has: correct Go 1.22 ServeMux patterns (`"GET /clients/{id}"`, r.PathValue); an endpoint list; an 8-step handler checklist; helper names.
- Problems:
  - The helpers (writeJSON, readJSON, writeError) are only named, never written.
  - No status-code choices, pagination implementation, error envelope or idempotency.
  - It contradicts the HTTP Server note, which still does a manual method check.
- Keep: the routing snippet, the endpoint list, the handler checklist.
- New home: `06 Backend Engineering in Go/Building REST Endpoints`. REST design concepts are canonical in `05 APIs`.
- Must cover: resource and route design on ServeMux (method + wildcards, {$}, precedence) · writeJSON (set Content-Type, then WriteHeader, then Encode; log encode errors) · readJSON (link the DTO note) · status codes: 200/201 + Location/202/204; 400/401/403/404/409/412/415/422/429; 500/502/503/504 · domain error → status mapping, including dependency errors (base it on the LLD HTTPStatus func) · error envelope: RFC 9457 problem+json with field errors · pagination: offset vs keyset cursor (opaque base64 of (created_at, id)), max page size, stable ordering · filtering and sorting via allowlists (ORDER BY injection) · PATCH semantics and partial updates · idempotency keys on POST (store key + response hash, replay on retry) · optimistic concurrency: ETag / If-Match → 412 · versioning (/v1 prefix vs header) · handler tests with httptest through the real router
- Diagrams: sequence diagram of POST /invoices with an Idempotency-Key: the first request stores the result, and a retry gets the stored 201. Flowchart of building a keyset-pagination query.

### Go Redis Cache Queue Rate Limit
`advance backend/theory/golang backend/Go Redis Cache Queue Rate Limit.md` · 63 lines · real 24 · depth 1 · REWRITE
- Has: InvoiceOps Redis uses; cache-aside steps as text; key-naming ideas; a queue idea; a production checklist.
- Problems:
  - No Go code: no go-redis client, no redis.Nil handling.
  - "Use Redis counters or token bucket style keys" ignores the atomicity problem: separate INCR then EXPIRE calls can race, so use a Lua script or pipeline.
  - Rate limiting inbound payment webhooks with `rate:webhook:{provider}` risks rejecting legitimate signed events. Rate-limit unauthenticated traffic instead.
  - "Use Redis list/stream for learning" gives no semantics: pub/sub drops messages, lists need BLMOVE to be reliable, and streams need XACK and XAUTOCLAIM.
  - Overlaps 4 redis notes, `performance/Cache Stampede Avalanche Penetration` and the LLD Rate Limiter.
- Keep: the dashboard cache example (TTL 30s, key `dashboard:{workspace_id}`); the key naming; the checklist.
- New home: `06 Backend Engineering in Go/Redis in Go`. Patterns are canonical in `08 Caching & Redis`; algorithms in `11 System Design/Rate Limiting`.
- Must cover: go-redis v9 setup (pool size, timeouts); ctx on every call; redis.Nil vs real errors · cache-aside with a JSON codec; TTL + jitter · stampede protection with singleflight; negative caching · invalidation after the DB commit (delete, don't update); versioned keys · fail-open vs fail-closed when Redis is down (cache vs limiter) · rate limiting: fixed window INCR + EXPIRE made atomic in Lua, sliding window with a ZSET, token bucket / GCRA (redis_rate); choosing the key (IP, user, API key) · in-process x/time/rate vs Redis for multi-instance limits · distributed lock: SET NX PX + compare-and-delete in Lua; TTL vs work time; fencing tokens; the Redlock debate · queues: List + BLMOVE (reliable), Streams consumer groups (XADD, XREADGROUP, XACK, XPENDING/XAUTOCLAIM, MAXLEN), Pub/Sub as at-most-once WebSocket fan-out · pipelining and MULTI/EXEC · Cluster hash tags {workspace} · tests with miniredis or testcontainers
- Diagrams: sequence diagram of cache-aside with singleflight (100 concurrent misses → 1 DB query). Sequence diagram of a Streams consumer group where one consumer crashes and XAUTOCLAIM re-delivers its message.

### Go SQL NoSQL API Practice
`advance backend/theory/golang backend/Go SQL NoSQL API Practice.md` · 42 lines · real 12 · depth 0 · DELETE
- Has: SQL vs NoSQL one-liners, "course mentions SQL and NoSQL", and a task to implement one repository twice.
- Problems: 27% of lines are repeated (the table lists). Course meta-text. No Go code. SQL-vs-NoSQL theory already exists in `data modeling/SQL vs NoSQL`.
- Keep: the exercise idea (one AuditLogRepository interface with a SQL implementation and an in-memory fake). It becomes an exercise in the 06 Repository note.
- New home: none. The exercise goes to `06 Backend Engineering in Go/Transactions and the Repository Pattern`; theory to `07 Databases/SQL vs NoSQL`.
- Must cover: n/a
- Diagrams: n/a

### Go Security for Backend
`advance backend/theory/golang backend/Go Security for Backend.md` · 46 lines · real 28 · depth 1 · REWRITE
- Has: a 12-item must-know list, webhook verification steps, mistakes, an interview answer.
- Problems:
  - A checklist with no Go APIs.
  - Misses SSRF, path traversal, html/template vs text/template, crypto/rand vs math/rand, and constant-time comparison.
  - Misses dependency scanning.
  - Says nothing Go-specific, though Go has relevant tools: govulncheck, os.Root, CrossOriginProtection.
- Keep: the must-know list; the webhook steps (they move to the webhooks note).
- New home: `06 Backend Engineering in Go/Secure Coding for Go Services`. Concepts are canonical in `12 Security & Auth`.
- Must cover: OWASP API Top 10 (2023) mapped to Go code: BOLA (scoped queries), BOPLA / mass assignment (explicit DTOs; JSON case-insensitivity), unrestricted resource consumption (MaxBytesReader, timeouts, page caps, rate limits) · SQL injection, including ORDER BY allowlists; os/exec without a shell · SSRF: URL allowlist + a custom Dialer.Control blocking private, loopback and link-local addresses (169.254.169.254) · path traversal: filepath.IsLocal (1.20), os.Root (1.24, verified that it blocks `../`) · XSS: html/template's contextual escaping vs text/template · crypto: crypto/rand (rand.Text in 1.24, verified), hmac.Equal / subtle.ConstantTimeCompare, AES-GCM; never math/rand for secrets · TLS config (link) · CSRF and CORS for cookie auth (SameSite; CrossOriginProtection in Go 1.25) · secrets hygiene and log redaction · DoS: ReadHeaderTimeout (Slowloris), JSON size and depth, zip bombs; RE2 regexp is linear-time · supply chain: go.sum + GOSUMDB, govulncheck (reachability-based), gosec, Renovate/Dependabot, pinned tools · security headers (HSTS, nosniff, CSP for HTML)
- Diagrams: flowchart of the request trust boundary with each control in order: TLS → size/time limits → authn → authz → validation → parameterized SQL → output encoding.

### Go Source Code Reading Debugging
`advance backend/theory/golang backend/Go Source Code Reading Debugging.md` · 40 lines · real 23 · depth 1 · MERGE→`04 Go Language/Go Toolchain, Tooling and Debugging`
- Has: a 7-step method for reading source; packages worth reading; debugging tool names.
- Problems: "The course mentions…" meta-text. Delve, stack traces, goroutine dumps and GODEBUG are either just named or missing.
- Keep: the 7-step reading method; the package list (net/http, context, database/sql, encoding/json, sync, time); the task to read Server.Shutdown.
- New home: `04 Go Language/Go Toolchain, Tooling and Debugging`, section "Reading source and debugging".
- Must cover: covered in the Toolchain outline (Delve, panics, SIGQUIT dumps, GODEBUG, go doc and GOROOT source).
- Diagrams: n/a (merged).

### Go Strings Runes Time Files
`advance backend/theory/golang backend/Go Strings Runes Time Files.md` · 38 lines · real 16 · depth 1 · SPLIT
- Has: "strings are bytes, rune is a code point"; Go's reference time layout; file package list; "never trust user paths".
- Problems:
  - "Go strings are bytes" is imprecise. A string is an immutable byte sequence, conventionally UTF-8 but not validated: len counts bytes, indexing yields bytes, and range decodes runes (invalid bytes become U+FFFD).
  - `time.Parse("2006-01-02", …)` drops the error, and the note doesn't say the result is in UTC (verified) or mention ParseInLocation.
  - Three unrelated topics in 38 lines; no file-I/O code.
- Keep: the layout example; the backend uses of time; the path-safety rule.
- New home: `04 Go Language/Strings, Bytes, Runes and Unicode` + `04 Go Language/Standard Library Essentials (time, io, files, encoding)`
- Must cover:
  - Strings: immutable bytes; len vs utf8.RuneCountInString · indexing gives bytes, range gives runes at byte offsets · []byte/[]rune conversions copy · strings.Builder vs += in loops · substrings share memory (strings.Clone) · strings vs bytes packages; EqualFold · grapheme clusters vs runes (x/text/unicode/norm, uniseg) · truncating user text safely · raw literals, %q, strconv.Quote.
  - Stdlib essentials: time.Time holds wall + monotonic readings; Since/Until; == vs Equal · layouts and RFC 3339; Parse (UTC) vs ParseInLocation; store UTC · Duration; AddDate vs Add across DST · Timer/Ticker semantics and Go 1.23 changes; time.After in loops · io.Reader/Writer composition (Copy, LimitReader, TeeReader, MultiWriter, Pipe) · bufio.Scanner's 64 KB token limit; Writer.Flush · os.ReadFile/WriteFile, OpenFile flags, check Close on writes, atomic write via temp file + rename · filepath vs path, WalkDir, os.Root, embed and io/fs (fstest.MapFS) · base64 variants, hex, sha256, hmac · net/url parsing and escaping · regexp (RE2) · text/template vs html/template · os/exec and signals · math/rand/v2 vs crypto/rand.
- Diagrams: excalidraw of "naïve" and "भारत" as bytes vs runes vs graphemes. Flowchart of an io pipeline: file → LimitReader → TeeReader(sha256) → gzip → S3.

### Go Testing
`advance backend/theory/golang backend/Go Testing.md` · 51 lines · real 26 · depth 1 · REWRITE
- Has: a list of test types, an arrange/act/assert comment skeleton, a mention of httptest, what to test, mistakes.
- Problems:
  - The "Unit test shape" contains only comments; the folder's testing note has not one assertion.
  - No table tests, subtests, fakes, fuzzing, benchmarks or integration setup.
  - `LLD with Go/Testing LLD Code in Go` already has correct table-driven tests, fakes vs mocks, a -race "one winner" test and an injectable clock. Use it as the base.
- Keep: the "what to test in InvoiceOps" list; the mistakes list.
- New home: `04 Go Language/Testing in Go`. httptest, testcontainers and bufconn go to `06 Backend Engineering in Go/Testing Go Services`; strategy is canonical in `15 Testing`.
- Must cover: go test basics; `_test.go`; package vs package_test (black-box) · table-driven tests with t.Run, t.Parallel, t.Helper, t.Cleanup, t.TempDir, t.Setenv, t.Context (1.24, verified) · Fatal vs Error; go-cmp diffs vs testify assert/require · fakes vs mocks (hand-written fakes; go.uber.org/mock, mockery) and consumer-side interfaces · injectable clock vs testing/synctest (Go 1.25) for time-based code · testdata/ and golden files with an -update flag · Example tests with `// Output:` · TestMain for global setup; build tags and -short for integration tests · race detector in CI; concurrency "one winner" tests · fuzzing: FuzzX, f.Add seeds, testdata/fuzz corpus, -fuzz/-fuzztime · coverage: -cover, -coverprofile, -coverpkg; integration coverage via `go build -cover` · goleak for goroutine leaks · flakiness controls: -count=1, -shuffle=on
- Diagrams: flowchart of the test layers in a Go service (unit with fakes → handler with httptest → repository with testcontainers → e2e), annotated with run time and build tags.

### Go Transactions and Repository Pattern
`advance backend/theory/golang backend/Go Transactions and Repository Pattern.md` · 61 lines · real 25 · depth 2 · REWRITE
- Has: the payment-webhook transaction steps; a correct BeginTx / defer Rollback / Commit shape; why repositories exist; mistakes.
- Problems:
  - Step 5, "enqueue follow-up job or outbox event", happens inside the tx. That contradicts the note's own rule against network calls inside DB transactions. Enqueueing to Redis or a broker inside a tx is a dual write; only an outbox row belongs in the tx.
  - The real design problem is missing: how repositories share one tx (DBTX interface, WithTx, unit of work).
  - No isolation levels, row locks, or retries on serialization failure.
  - Overlaps LLD `patterns/Repository Pattern in Go`, `database/Transactions`, `data modeling/Optimistic and Pessimistic Locking` and `distributed systems/Outbox Pattern`.
- Keep: the tx shape snippet; the webhook transaction steps (fix step 5); the mistakes list.
- New home: `06 Backend Engineering in Go/Transactions and the Repository Pattern`
- Must cover: BeginTx with TxOptions (isolation, read-only); defer Rollback is a no-op after Commit (it returns ErrTxDone) · a tx pins one connection, is not goroutine-safe, and rolls back when ctx is cancelled · sharing a tx across repositories: a DBTX interface (satisfied by *sql.DB and *sql.Tx), sqlc's WithTx, a WithTx(ctx, fn) helper, unit-of-work tradeoffs · SQL lives in repositories, business rules in services; repository interfaces sit with the consumer · row locks: SELECT … FOR UPDATE / SKIP LOCKED / NOWAIT · optimistic locking with a version column and conditional UPDATE (rows affected = 0 → conflict) · uniqueness as concurrency control: INSERT … ON CONFLICT DO NOTHING · retry the whole tx on serialization failure (40001) or deadlock (40P01), with backoff · outbox row in the same tx + a relay that publishes after commit · no external calls while a tx is open; idle_in_transaction_session_timeout · savepoints for nested work · tests on real Postgres, including two concurrent transactions
- Diagrams: sequence diagram: webhook handler → BEGIN → insert event (ON CONFLICT) → update invoice FOR UPDATE → insert outbox → COMMIT → relay publishes. Class diagram: Service → InvoiceRepo and PaymentRepo, both taking a DBTX.

### Go Types Structs Interfaces
`advance backend/theory/golang backend/Go Types Structs Interfaces.md` · 53 lines · real 22 · depth 2 · SPLIT
- Has: an Invoice struct; implicit interface satisfaction; an InvoiceRepository interface; layering bullets; good guidance (small, consumer-side interfaces).
- Problems:
  - Misses embedding and method sets.
  - Misses the trap of a nil pointer stored in an interface (the interface is non-nil).
  - Misses type assertions and switches, struct tags and comparability.
  - `Amount int64` without saying it is in minor units.
  - `LLD with Go/Error Handling and Interfaces in Go LLD` Part 1 covers interfaces better (a consumer-side example, a compile-time check, embedding, generics vs interfaces).
- Keep: the Invoice struct; the InvoiceRepository interface; the common-mistakes list; the interview answer.
- New home: `04 Go Language/Structs, Methods and Embedding` + `04 Go Language/Interfaces`
- Must cover:
  - Structs: keyed literals; zero-value-usable types · constructors that validate (NewX) · methods on any named type · embedding is composition: promotion, shadowing, ambiguous selectors, embedded pointers · struct tag syntax and reflect.StructTag · anonymous structs (test tables, ad-hoc JSON) · comparability and use as map keys; the empty struct · field alignment and padding (fieldalignment) · custom types vs aliases; the iota + String() enum pattern · shallow-copy pitfalls (slices and maps inside structs).
  - Interfaces: implicit satisfaction; small interfaces (io.Reader, Stringer) · defined at the consumer; accept interfaces, return structs · compile-time assertion `var _ I = (*T)(nil)` · method sets of T vs *T · an interface value is a (type, data) pair; itab · nil interface vs typed nil (the err != nil surprise) · type assertion with comma-ok; type switches · interface embedding · `any`, and when it is justified · dynamic-dispatch cost; PGO devirtualization · interfaces vs generics (behaviour vs algorithm) · interface pollution (IService/ServiceImpl).
- Diagrams: class diagram of InvoiceService depending on InvoiceRepository, implemented by PostgresRepo and FakeRepo. Excalidraw of the interface value layout showing why a typed nil pointer makes err != nil.

### Go WebSocket Realtime
`advance backend/theory/golang backend/Go WebSocket Realtime.md` · 66 lines · real 30 · depth 2 · REWRITE
- Has: live-status use case, sequence diagram, production checklist (ping/pong, deadlines, backpressure, Redis fan-out), correct library guidance.
- Problems:
  - No Go code: no upgrade, no read/write pumps, no hub.
  - Doesn't state gorilla's rule of one concurrent reader and one concurrent writer per connection.
  - Doesn't explain CheckOrigin; setting it to always-true opens cross-site WebSocket hijacking when auth uses cookies.
  - The diagram has the payment webhook publish straight to the WS server. With more than one instance this must go through Redis Pub/Sub or NATS.
  - Nothing on load-balancer idle timeouts or the SSE alternative.
  - Overlaps `Api architecture/WEBSOCKET`, `reliability/WebSocket Scaling` and `system design practice/Design Chat System`.
- Keep: the checklist and mistakes; the library guidance.
- New home: `06 Backend Engineering in Go/WebSockets and SSE in Go`. Protocol concepts go to `05 APIs/WebSocket and SSE`; scaling to `11 System Design`.
- Must cover: handshake/upgrade and auth (cookie or a short-lived ticket; browsers can't set an Authorization header) · origin checks and cross-site WebSocket hijacking · readPump/writePump goroutines per connection; the single-writer rule · a buffered send channel per client; a slow-consumer policy (drop or disconnect) · ping/pong with read deadlines and a pong handler; write deadlines; SetReadLimit · hub pattern (register/unregister/broadcast) vs a mutex-protected map · multi-instance fan-out via Redis Pub/Sub or NATS; presence · LB idle timeouts (ALB default 60s) vs ping interval · shutdown: Server.Shutdown ignores hijacked conns, so send close frame 1001 and have clients reconnect with backoff + jitter; resume via last event id · capacity: memory per connection (2 goroutines + buffers), fd limits, epoll-based libraries for 1M connections · SSE for one-way updates (text/event-stream, flushing via ResponseController, Last-Event-ID) · tests with httptest + a client library; goroutine-leak tests
- Diagrams: sequence diagram: browser connected to pod A; payment webhook lands on pod B → Redis Pub/Sub → pod A → browser. Component flowchart of one connection: reader goroutine, writer goroutine, send buffer, hub.

### Go Webhooks Idempotency
`advance backend/theory/golang backend/Go Webhooks Idempotency.md` · 61 lines · real 30 · depth 2 · REWRITE
- Has: a 10-step handler flow, a duplicate/new sequence diagram, mistakes, a test task (send the same event twice).
- Problems:
  - Race condition (check-then-act): step 4, "check event id in webhook_events", runs before step 6, "start transaction", so two concurrent retries can both pass the check.
  - Correct approach: `INSERT … ON CONFLICT (provider, event_id) DO NOTHING` inside the tx, treating 0 rows as "already processed". The unique index this relies on is defined only in the Migrations note.
  - No HMAC code, no constant-time compare, no replay window.
  - No handling of out-of-order events, and no reconciliation.
  - Overlaps `api design/Webhooks`, `api design/Webhook Processing` and `reliability/Idempotency`.
- Keep: the flow (fix the order), the diagram (fix it), the test task.
- New home: `06 Backend Engineering in Go/Receiving Webhooks Idempotently`. Concepts are canonical in `05 APIs/Webhooks` and `05 APIs/Idempotency`.
- Must cover: read the raw body with MaxBytesReader before decoding · HMAC-SHA256 verification with hmac.Equal; Razorpay's X-Razorpay-Signature over the raw body (verify the event-id header name); Stripe-style timestamped signatures and a replay tolerance window · secret rotation (accept two secrets during the switch) · dedupe via unique (provider, event_id) + ON CONFLICT inside the tx · ack fast: store the raw event, then process async, vs process inline within the provider's timeout · response codes: 2xx for processed or duplicate, 4xx for a bad signature, 5xx only for retryable failures · out-of-order events: state-machine guards, provider timestamps or versions · partial payments; check amounts against the invoice · a reconciliation job that polls the provider for missed events · outbox for downstream effects (emails, WebSocket pushes) · observability: event id in logs and spans; a duplicate counter · tests: the same event twice, concurrent duplicates, a tampered signature, out-of-order paid → pending · outbound webhooks: signing, retries with backoff, per-endpoint DLQ, SSRF checks
- Diagrams: sequence diagram of two concurrent deliveries of the same event: both verify, both BEGIN, one inserts, the other gets 0 rows and returns 200 with no side effects. State diagram of invoice payment status showing which transitions webhooks may drive.

### Go Worker Queues and Background Jobs
`advance backend/theory/golang backend/Go Worker Queues and Background Jobs.md` · 63 lines · real 34 · depth 2 · REWRITE
- Has: InvoiceOps job examples, an API/queue/worker sequence diagram, queue options, production concerns, mistakes.
- Problems:
  - No Go code: no worker pool, no ack/retry loop.
  - The diagram does `API->>DB: create invoice` then `API->>Queue: enqueue`. That is a dual write: if the enqueue fails after the commit, the email is lost. Use an outbox, or a DB-backed job table written in the same tx.
  - "visibility timeout" is named but not explained.
  - It never states that at-least-once delivery means handlers must be idempotent.
  - Overlaps the reliability folder (Background Jobs, Worker Architecture, Durable Job Scheduler, Retry and Backoff, Dead Letter Queue) and LLD Notification System.
- Keep: the job examples, the queue options list, the concerns list.
- New home: `06 Backend Engineering in Go/Background Workers and Job Queues`. Delivery semantics are canonical in `09 Messaging & Async`.
- Must cover: in-process worker pool (bounded channel, N workers, WaitGroup, ctx; reuse the LLD Pool code) and why it is not durable · durable job tables in Postgres: SELECT … FOR UPDATE SKIP LOCKED claim loop, LISTEN/NOTIFY wake-ups, river · Redis-based asynq (retries, scheduled and unique tasks) · brokers: SQS (visibility timeout, ChangeMessageVisibility heartbeats), RabbitMQ (ack/nack, prefetch), Kafka (consumer groups, commit after processing, per-partition ordering) · at-least-once delivery ⇒ idempotent handlers (dedupe table or naturally idempotent writes) · enqueue atomically with business data (outbox or a job row in the same DB) · retries: exponential backoff + full jitter, max attempts, retryable vs permanent errors, DLQ + replay tooling · poison messages and per-job timeouts · concurrency limits per tenant or provider; priorities · graceful drain on SIGTERM; lease expiry when a worker crashes · metrics: queue depth, oldest-job age, throughput, failure/retry/DLQ counts; trace context in the job payload · Temporal or similar durable workflows for multi-step sagas
- Diagrams: sequence diagram of an outbox-based enqueue: the API tx writes the invoice + a job row → a worker claims it with SKIP LOCKED → sends the email → marks it done; on a crash the lease expires and another worker retries. State diagram of a job: queued → running → succeeded, or retry_wait → dead.

### Go YouTube Topic Links
`advance backend/theory/golang backend/Go YouTube Topic Links.md` · 36 lines · real 17 · depth 0 · MERGE→`19 Interview & Career/Go Learning Resources`
- Has: 12 links (the Rob Pike 2012 and Sameer Ajmani 2013 concurrency talks, gRPC/protobuf docs, Go docs, OTel docs).
- Problems: a resource list, not a note. It is a subset of the resource table in the Complete Notes preamble.
- Keep: all the links.
- New home: `19 Interview & Career/Go Learning Resources` (or each new note's "References" section).
- Must cover: n/a
- Diagrams: n/a

### Go gRPC Deep Dive
`advance backend/theory/golang backend/Go gRPC Deep Dive.md` · 55 lines · real 24 · depth 1 · MERGE→`06 Backend Engineering in Go/gRPC Services in Go`
- Has: a core-pieces list, a unary proto, the Unimplemented-embedding struct, a production checklist.
- Problems: called "Deep Dive" but has no server or client code. It repeats the gRPC Services checklist almost line for line.
- Keep: the Unimplemented embedding snippet.
- New home: `06 Backend Engineering in Go/gRPC Services in Go`
- Must cover: see the gRPC Services block.
- Diagrams: see the gRPC Services block.

### Go gRPC Gateway REST Combo API
`advance backend/theory/golang backend/Go gRPC Gateway REST Combo API.md` · 49 lines · real 22 · depth 2 · REWRITE
- Has: what grpc-gateway does, a flowchart, a correct google.api.http annotation, tradeoffs.
- Problems: no generation or registration code. Nothing on error/status mapping, header → metadata mapping, or in-process vs network registration. Doesn't mention ConnectRPC, the main modern alternative (one net/http handler serving gRPC, gRPC-Web and Connect/JSON).
- Keep: the annotation example; the tradeoff list.
- New home: `06 Backend Engineering in Go/Serving REST and gRPC Together`
- Must cover: grpc-gateway v2 codegen (protoc-gen-grpc-gateway, protoc-gen-openapiv2) with googleapis annotations: path params, `body: "*"`, additional_bindings · runtime.NewServeMux options (protojson UseProtoNames, EmitUnpopulated) · RegisterXHandlerFromEndpoint (network hop) vs RegisterXHandlerServer (in-process; no streaming, verify) · gRPC status → HTTP mapping; custom error handler · header ↔ metadata matchers (`grpcgateway-` prefix); auth propagation · the generated OpenAPI as the public contract · serving both on one port (h2c, cmux) vs two ports · ConnectRPC; gRPC-Web for browsers; Envoy JSON transcoding · limits of streaming over the gateway (newline-delimited JSON) · when not to bother (small systems)
- Diagrams: flowchart of a REST client → gateway mux (JSON → proto) → gRPC server, next to a Connect handler serving gRPC, gRPC-Web and JSON on one endpoint.

### Go gRPC Services
`advance backend/theory/golang backend/Go gRPC Services.md` · 81 lines · real 37 · depth 1 · REWRITE
- Has: REST vs gRPC positioning, two-RPC proto, 8 build steps, plugin install commands, production checklist, mistakes, 10 follow-up links.
- Problems:
  - No Go code for server or client.
  - The checklist names deadlines, status codes, mTLS and load balancing without explaining any mechanism.
  - Duplicated by gRPC Deep Dive.
  - Its 10 sibling notes split one topic into 35-55-line fragments.
- Keep: the proto service; the checklist (as section headings); the "public REST, internal gRPC" decision.
- New home: `06 Backend Engineering in Go/gRPC Services in Go`. This is the canonical gRPC-in-Go note; it absorbs gRPC Deep Dive, gRPC TLS Metadata Deadlines, gRPC Testing Tools, Protoc Code Generation and Protobuf Validation. Protocol concepts go to `05 APIs/gRPC`.
- Must cover: codegen pipeline (buf/protoc, pinned plugins) and the generated interfaces · server: net.Listen, grpc.NewServer options, Register, embed Unimplemented by value, Serve, GracefulStop with a timeout · client: grpc.NewClient (Dial is deprecated since grpc-go 1.63), one shared ClientConn per target, credentials · status errors: status.Error / FromError, what each code means, errdetails (BadRequest), domain error → code mapping · deadlines: client ctx timeout → grpc-timeout header → server ctx; propagation and budgets · metadata: AppendToOutgoingContext / FromIncomingContext, -bin keys, headers vs trailers · interceptors: unary and stream, chained (auth, logging, recovery, validation via protovalidate) · TLS/mTLS credentials; PerRPCCredentials; insecure credentials only locally · health service; reflection in dev only · load balancing: long-lived HTTP/2 connections defeat L4 balancers → round_robin + headless DNS, xDS, or an L7 proxy; MaxConnectionAge · keepalive params and `too_many_pings` · message size limits (4 MB receive default) · retries and hedging via service config (idempotent methods only) · observability via otelgrpc stats handlers · testing: bufconn in-process tests, grpcurl / Postman / buf curl, ghz
- Diagrams: sequence diagram client → (deadline, metadata) → interceptor chain → handler, with status and trailers coming back. Flowchart of client-side load balancing with a headless service vs an L7 proxy.

### Go gRPC Streaming Patterns
`advance backend/theory/golang backend/Go gRPC Streaming Patterns.md` · 47 lines · real 18 · depth 2 · REWRITE
- Has: the four RPC kinds with proto signatures and use cases; production-issue names (flow control, cancellation, ordering).
- Problems: no Go stream code (Send, Recv, io.EOF, SendAndClose, CloseSend). No goroutine model for bidirectional streams. Flow control is named but not explained. The task (WatchInvoice until ctx is cancelled) is left unsolved.
- Keep: the four proto examples.
- New home: `06 Backend Engineering in Go/gRPC Streaming in Go`
- Must cover: server-streaming loop watching stream.Context().Done() and checking Send errors · client streaming: Recv until io.EOF → SendAndClose · bidirectional: one goroutine Recv, one Send; never Send from several goroutines · client side: CloseSend, drain to io.EOF, cancel ctx to avoid leaks · generic stream types in newer codegen (grpc.ServerStreamingServer[T]) · HTTP/2 flow-control windows and BDP; a blocking Send as backpressure · ordering is guaranteed only within a stream · errors mid-stream via trailers; partial results; resume tokens · long-lived streams vs load balancing: MaxConnectionAge/Grace, client reconnect with backoff · keepalive for idle streams · stream interceptors (wrapped ServerStream) · choosing streaming vs pagination vs WebSocket
- Diagrams: sequence diagram of a bidirectional chat with separate send/recv goroutines and a cancellation. Flowchart of flow-control backpressure: slow receiver → window full → Send blocks.

### Go gRPC TLS Metadata Deadlines
`advance backend/theory/golang backend/Go gRPC TLS Metadata Deadlines.md` · 35 lines · real 12 · depth 1 · MERGE→`06 Backend Engineering in Go/gRPC Services in Go`
- Has: one-line definitions of TLS, metadata and trailers; a WithTimeout(context.Background(), 2s) snippet; mistakes.
- Problems: no credentials code and no metadata API. In a server request path the deadline must derive from the incoming ctx, not context.Background(); otherwise cancellation and deadline budgets stop propagating.
- Keep: the mistakes list; the authorization + x-request-id task.
- New home: `06 Backend Engineering in Go/gRPC Services in Go` (sections Deadlines, Metadata, TLS)
- Must cover: see the gRPC Services block.
- Diagrams: see the gRPC Services block.

### Go gRPC Testing Tools Postman grpcurl
`advance backend/theory/golang backend/Go gRPC Testing Tools Postman grpcurl.md` · 34 lines · real 15 · depth 2 · MERGE→`06 Backend Engineering in Go/gRPC Services in Go`
- Has: correct grpcurl list/describe/call commands; the reflection requirement; what Postman can do; a what-to-test list.
- Problems: covers tools only. No Go-side tests (bufconn), and no warning that reflection should be off, or protected, in production.
- Keep: the grpcurl commands; the what-to-test list.
- New home: `06 Backend Engineering in Go/gRPC Services in Go`, section "Testing".
- Must cover: see the gRPC Services block.
- Diagrams: n/a.

### Golang Backend Content Table
`advance backend/theory/golang backend/Golang Backend Content Table.md` · 45 lines · real 24 · depth 0 · DELETE
- Has: a pointer to Go Backend Complete Notes, coverage bullets, a path flowchart.
- Problems: navigation only. It routes everything through the duplicate Complete Notes file, and its flowchart duplicates the Complete Notes "Big picture".
- Keep: nothing; the coverage bullets are superseded by the Area plan.
- New home: none. The `00 Home` MOC lists 04 and 06 in order.
- Must cover: n/a
- Diagrams: n/a

### InvoiceOps Golang Project Plan
`advance backend/theory/golang backend/InvoiceOps Golang Project Plan.md` · 152 lines · real 96 · depth 3 · POLISH
- Has: product scope, modules, MVP API list, invoice state diagram, tables, topic→project map, milestones, senior story, code checkpoints.
- Problems:
  - The state machine is incomplete: there is no overdue → partially_paid (a partial payment on an overdue invoice), no refund or void, no terminal markers and no guards.
  - No ERD, no money rules (minor units + currency, rounding, tax), no tenancy rule, no webhook/outbox sequence.
  - `DELETE /clients/{id}` has no soft delete even though invoices reference clients.
  - It duplicates the Roadmap milestones.
- Keep: almost everything: the API list, tables, milestones, checkpoints and the senior story.
- New home: `06 Backend Engineering in Go/Capstone - InvoiceOps`
- Must cover: scope and non-goals · ERD (workspaces, members, clients, invoices, items, payments, webhook_events, outbox, jobs, attachments, audit_logs) · tenancy: workspace_id on every row and query, composite indexes, optional Postgres RLS · money: int64 minor units + ISO 4217 currency; rounding and tax rules · invoice state machine as a guarded transition table (including overdue → partially_paid, refunds, cancelled/void as terminal states) · payment webhook flow (signature → dedupe → tx → outbox → 200) + reconciliation job · idempotency keys on POST /invoices · reminders via scheduler + SKIP LOCKED workers · dashboard queries + Redis cache invalidated by payment events · auth (sessions, or JWT + refresh rotation) + workspace RBAC · API surfaces: REST + OpenAPI, internal gRPC, WebSocket/SSE live status · observability + SLOs (for example, webhook → status-update latency) · deployment: Docker, a migrations job, graceful shutdown · test and load-test plan with targets · build phases with acceptance criteria (from the Roadmap + Bootcamp Checklist) · ADRs (Postgres-as-queue vs Redis; JWT vs sessions) and a STAR interview story
- Diagrams: ER diagram of the schema. State diagram of the invoice lifecycle with guards. Sequence diagram: payment webhook → tx + outbox → worker → WebSocket push. C4-style component flowchart (API, worker, scheduler, Postgres, Redis, S3, payment provider).

---

## Area plan: Go Backend (`advance backend/theory/golang backend/`)

### New notes, ordered basic → advanced

**04 Go Language** (22 notes)
1. `04 Go Language/Go Toolchain, Tooling and Debugging` · B · from: Go Developer Tooling Git VSCode CLI, Go Source Code Reading Debugging, Go Language Basics (commands)
2. `04 Go Language/Syntax, Types and Control Flow` · B · from: Go Language Basics
3. `04 Go Language/Functions, Closures, Defer, Panic and Recover` · B · from: Go Deep Basics Functions Defer Panic Recover, Go Language Basics (functions, init)
4. `04 Go Language/Arrays, Slices and Maps (with internals)` · B · from: Go Language Basics (collections, make/new, nil, range) + NEW internals section
5. `04 Go Language/Strings, Bytes, Runes and Unicode` · B · from: Go Strings Runes Time Files, Go Language Basics (range over string)
6. `04 Go Language/Structs, Methods and Embedding` · B · from: Go Types Structs Interfaces, Go Language Basics (custom types, aliases, tags)
7. `04 Go Language/Pointers, Values and Escape Analysis` · I · from: Go Pointers Memory Values
8. `04 Go Language/Interfaces` · I · from: Go Types Structs Interfaces, LLD `Error Handling and Interfaces in Go LLD` (Part 1)
9. `04 Go Language/Error Handling` · I · from: Go Error Handling, LLD `Error Handling and Interfaces in Go LLD` (Part 2)
10. `04 Go Language/Packages, Modules and Dependency Management` · I · from: Go Project Structure and Modules (modules)
11. `04 Go Language/Standard Library Essentials (time, io, files, encoding)` · I · from: Go Strings Runes Time Files (time, files), Go Language Basics (io packages), Go Bootcamp Course Coverage Map (topic list)
12. `04 Go Language/Testing in Go` · I · from: Go Testing, LLD `Testing LLD Code in Go`
13. `04 Go Language/Goroutines and Channels` · I · from: Go Concurrency Goroutines Channels
14. `04 Go Language/select and Concurrency Patterns` · I · from: Go Concurrency Goroutines Channels, LLD `Concurrency in Go LLD` (worker pool), Go Worker Queues and Background Jobs (in-process pool)
15. `04 Go Language/sync Primitives and Atomics` · I · from: NEW (+ LLD `Concurrency in Go LLD` mutex and atomic code, LLD `Singleton Pattern in Go` sync.Once)
16. `04 Go Language/Context Package` · I · from: Go Context Package
17. `04 Go Language/Generics and Iterators` · I · from: Go Generics Reflection Runtime (generics)
18. `04 Go Language/Memory Model and Data Races` · A · from: NEW
19. `04 Go Language/Reflection and unsafe` · A · from: Go Generics Reflection Runtime (reflection)
20. `04 Go Language/Runtime - Goroutine Scheduler (GMP)` · A · from: NEW (only topic names exist in Go Generics Reflection Runtime)
21. `04 Go Language/Runtime - Memory Allocator and Garbage Collector` · A · from: NEW
22. `04 Go Language/Benchmarks, Profiling and Tracing` · A · from: Go Benchmarking wrk h2load ghz pprof (Go parts)
- Optional: `04 Go Language/Modern Go Feature Timeline (1.18-1.25)` · I · NEW (see Gaps)

**06 Backend Engineering in Go** (28 notes)
1. `06 Backend Engineering in Go/Service Project Layout and Wiring` · B · from: Go Project Structure and Modules (layout)
2. `06 Backend Engineering in Go/Configuration and Secrets` · B · from: Go Configuration Environment
3. `06 Backend Engineering in Go/HTTP Server Fundamentals (net-http)` · B · from: Go HTTP Server, Go REST API Coding (routing)
4. `06 Backend Engineering in Go/Building REST Endpoints` · B · from: Go REST API Coding, Go Error Handling (HTTP table), LLD `Error Handling and Interfaces in Go LLD` (HTTPStatus)
5. `06 Backend Engineering in Go/Request Decoding, Validation and DTOs` · I · from: Go JSON Validation DTOs
6. `06 Backend Engineering in Go/Middleware` · I · from: Go Middleware, Go Deep Basics Functions Defer Panic Recover (recover middleware)
7. `06 Backend Engineering in Go/OpenAPI-First Development in Go` · I · from: Go OpenAPI Documentation
8. `06 Backend Engineering in Go/Database Access (database-sql, pgx, sqlc)` · I · from: Go Database SQL
9. `06 Backend Engineering in Go/Transactions and the Repository Pattern` · I · from: Go Transactions and Repository Pattern, Go SQL NoSQL API Practice (exercise)
10. `06 Backend Engineering in Go/Schema Migrations in Go Services` · I · from: Go Database Migrations
11. `06 Backend Engineering in Go/Testing Go Services` · I · from: Go Testing (handler and repository parts), Go gRPC Testing Tools Postman grpcurl
12. `06 Backend Engineering in Go/Authentication and Authorization in Go` · I · from: Go Auth JWT Sessions, Go Password Hashing (Go code)
13. `06 Backend Engineering in Go/Calling External APIs` · I · from: Go API Client External Calls
14. `06 Backend Engineering in Go/Redis in Go` · I · from: Go Redis Cache Queue Rate Limit
15. `06 Backend Engineering in Go/Background Workers and Job Queues` · I · from: Go Worker Queues and Background Jobs
16. `06 Backend Engineering in Go/Scheduled Jobs` · I · from: Go Cron Scheduled Jobs
17. `06 Backend Engineering in Go/Receiving Webhooks Idempotently` · I · from: Go Webhooks Idempotency, Go Security for Backend (webhook steps)
18. `06 Backend Engineering in Go/File Uploads and Object Storage` · I · from: Go File Uploads
19. `06 Backend Engineering in Go/Observability in Go Services` · I · from: Go Logging Observability, Go OpenTelemetry Metrics Tracing
20. `06 Backend Engineering in Go/Graceful Shutdown and Health Checks` · I · from: Go Graceful Shutdown
21. `06 Backend Engineering in Go/TLS, HTTPS and HTTP2 in Go Servers` · I · from: Go HTTPS HTTP2 TLS Server
22. `06 Backend Engineering in Go/Containerizing Go Services` · I · from: Go Deployment Docker
23. `06 Backend Engineering in Go/Secure Coding for Go Services` · A · from: Go Security for Backend
24. `06 Backend Engineering in Go/gRPC Services in Go` · I · from: Go gRPC Services, Go gRPC Deep Dive, Go gRPC TLS Metadata Deadlines, Go gRPC Testing Tools Postman grpcurl, Go Protoc Code Generation, Go Protobuf Validation
25. `06 Backend Engineering in Go/gRPC Streaming in Go` · A · from: Go gRPC Streaming Patterns
26. `06 Backend Engineering in Go/Serving REST and gRPC Together` · A · from: Go gRPC Gateway REST Combo API
27. `06 Backend Engineering in Go/WebSockets and SSE in Go` · A · from: Go WebSocket Realtime
28. `06 Backend Engineering in Go/Capstone - InvoiceOps` · A · from: InvoiceOps Golang Project Plan, Go Backend Coding Roadmap, Go Bootcamp Coding Checklist

**Targets in other folders, fed by this area**
- `05 APIs/Protocol Buffers and Schema Evolution` · I · from: Go Protocol Buffers Deep Dive, Go Proto Versioning Best Practices
- `05 APIs/GraphQL` (existing target; add a Go/gqlgen section) · I · from: Go GraphQL Backend
- `12 Security & Auth/Password Hashing` · I · from: Go Password Hashing (the only password-hashing note in the vault)
- `15 Testing/Load Testing` (existing target) · I · from: Go Benchmarking wrk h2load ghz pprof (wrk/h2load/ghz part)
- `19 Interview & Career/Go Learning Resources` · B · from: Go YouTube Topic Links, Go Backend Complete Notes (resource table, 9 unique URLs), Go Bootcamp Course Coverage Map (curriculum list)

**Classification of the meta notes**
- `06` capstone:
  - InvoiceOps Golang Project Plan (POLISH, becomes the capstone).
  - Go Backend Coding Roadmap (MERGE: build phases).
  - Go Bootcamp Coding Checklist (MERGE: acceptance checklist; language items become 04 exercises).
- `19` Interview & Career:
  - Go Bootcamp Course Coverage Map (MERGE: curriculum coverage checklist).
  - Go YouTube Topic Links (MERGE).
  - The Complete Notes resource table (moved before deletion).
- Delete:
  - Golang Backend Content Table (navigation).
  - Go Backend Complete Notes (verified duplicate).
  - Go SQL NoSQL API Practice (course meta).

### Gaps (topics missing entirely for complete coverage)
Vault-wide grep found zero notes mentioning any of these: escape analysis, GOGC, GOMEMLIMIT, GOMAXPROCS, work stealing, happens-before, tri-color / write barrier, sync.Cond, type parameters, ~T constraints, unsafe, cgo, go tool trace, advisory locks, synctest, goleak, testcontainers, x/time/rate, Swiss-table maps, typed-nil / nil-interface. pprof appears only as a bare word in 7 Go notes.

Missing topics:
- Runtime internals (scheduler, allocator, GC, stack growth).
- Memory model.
- sync primitives (beyond the LLD mutex).
- errgroup, semaphore and singleflight in depth (only named in LLD).
- Generics constraints and iterators.
- Reflection API, unsafe, cgo.
- Embedding and method sets.
- iota, shadowing, closures, recursion.
- Stdlib areas from the course curriculum: templates, regexp, encoding, hashing/HMAC, net/url, os/exec, signals, math/rand/v2, embed/io/fs.
- slog and Prometheus code.
- HTTP client transport tuning.
- pgx/sqlc, SKIP LOCKED queues, advisory locks.
- Outbox implementation in Go.
- Fuzzing, synctest, goleak, testcontainers.
- PGO, the execution tracer, the flight recorder.
- A Go-specific interview trap bank (nil interface, slice aliasing, map concurrency, defer evaluation, goroutine leaks), which belongs in 19.

Outlines for the NEW notes with no old source:
- **`04 Go Language/select and Concurrency Patterns`**
  - Must cover: select semantics (blocks until a case is ready; random choice among ready cases; `default` makes it non-blocking; a nil channel disables a case) · timeouts: time.After vs ctx deadline; Go 1.23 timer GC · for-select worker loops with ctx.Done · worker pool (bounded queue, N workers, Submit with backpressure, Stop and drain; the LLD Pool code) · pipelines (each stage owns and closes its output) · fan-out/fan-in with a WaitGroup + closer goroutine · bounded parallelism: buffered-chan semaphore, x/sync/semaphore, errgroup.SetLimit · errgroup.WithContext (cancel on first error) · singleflight request coalescing · rate limiting with time.Ticker vs x/time/rate · broadcast pub/sub with per-subscriber buffers and a drop policy · backpressure choices: block, drop, or 429 · leak-free shutdown ordering · channels vs mutex.
  - Diagrams: flowchart of a 3-stage pipeline with fan-out/fan-in and cancellation arrows. Sequence diagram of errgroup: three parallel calls, one fails, ctx cancels the other two.
- **`04 Go Language/sync Primitives and Atomics`**
  - Must cover: Mutex (usable zero value, not reentrant, defer Unlock, starvation mode after 1 ms of waiting, TryLock rarely right) · critical-section rules: check-then-act in one lock, no I/O under a lock, consistent lock ordering · RWMutex: when it helps; writer preference; recursive RLock deadlock · WaitGroup (Add before `go`, never copy; wg.Go in Go 1.25) · Once / OnceFunc / OnceValue(s) (1.21) for lazy init; what happens on a panic inside Do · Cond (Wait in a loop; prefer channels) · sync.Map use cases vs map + RWMutex (reimplemented in Go 1.24) · sync.Pool for temporary buffers: reset objects; contents are dropped across GCs (victim cache) · typed atomics atomic.Int64 / Bool / Pointer[T] (1.19); CAS loops; atomics only protect single-word invariants · go vet copylocks; sharded locks for hot maps · finding contention with the mutex profile · deadlock patterns (lock-order inversion, early return without Unlock, RLock→Lock upgrade).
  - Diagrams: sequence diagram of two goroutines racing on check-then-act, with and without one critical section (oversell); reuse the LLD text diagram. Flowchart "which primitive?" (extend the LLD decision tree).
- **`04 Go Language/Memory Model and Data Races`**
  - Must cover: why reordering happens (compiler, CPU caches) · the happens-before relation · operations that synchronize:
    - the go statement;
    - channel send, receive and close, including the buffered-capacity semaphore rule;
    - Mutex Unlock → next Lock;
    - Once;
    - WaitGroup Done → Wait;
    - atomics, which are sequentially consistent since the 2022 memory-model revision (Go 1.19).

    Also: goroutine exit gives no guarantee · the definition of a data race, and Go's "no out-of-thin-air values" stance · torn multi-word values (interface, string, slice headers) → crashes or memory corruption · a busy-wait `for !done {}` may never end · race detector (ThreadSanitizer-based; only catches races on executed paths; ~5-10x memory and 2-20x CPU; run in CI and canaries) · classic races: concurrent map writes (fatal), a shared err across goroutines, lazy init without Once, counters without atomics, using request data after the handler returns, double-checked locking · fixes: confinement, channels, mutex, atomics, immutability.
  - Diagrams: happens-before graph (flowchart) for safely publishing a struct through an unbuffered channel. Excalidraw of a torn interface read during a concurrent write.
- **`04 Go Language/Runtime - Goroutine Scheduler (GMP)`**
  - Must cover: why M:N scheduling · G, M and P; GOMAXPROCS = number of Ps (container-aware since Go 1.25; uber automaxprocs before) · per-P local run queues (256 slots) + runnext + global queue; the global queue is checked every 61 schedticks for fairness · work stealing (half of a random victim's queue); spinning Ms · blocking syscalls: P handoff; sysmon retakes the P · network I/O through the netpoller (epoll/kqueue), so no thread per connection · parking on channels and mutexes (gopark/goready) · preemption: cooperative at function prologues + asynchronous signal-based preemption since 1.14 · goroutine stacks start at 2 KB and grow by copying · LockOSThread; cgo calls pin Ms; the debug.SetMaxThreads (10000) crash · observing: GODEBUG=schedtrace, go tool trace, the /sched/latencies runtime metric · practical rules: size CPU-bound pools to GOMAXPROCS; I/O-bound work can exceed it; blocking cgo or syscalls can explode the thread count.
  - Diagrams: excalidraw of Ps with local run queues, Ms, the global queue, the netpoller and a work-steal arrow. Sequence diagram of a goroutine entering a blocking syscall: its P is handed to another M and reacquired afterwards.
- **`04 Go Language/Runtime - Memory Allocator and Garbage Collector`**
  - Must cover: stack vs heap recap (link escape analysis) · allocator: per-P mcache → mcentral → mheap; ~68 size classes; spans; tiny allocator for small pointer-free objects (<16 B); objects >32 KB go straight to the heap · GC: concurrent tri-color mark-sweep, non-moving, non-generational · phases: sweep termination (stop-the-world), concurrent mark + write barrier, mark termination (stop-the-world), concurrent sweep · pacer: heap goal = live × (1 + GOGC/100); ~25% CPU for background marking + mutator assists · GOMEMLIMIT (1.19) as a soft limit; the GOGC=off + limit pattern; set to ~90% of the container limit · cost model: GC work is proportional to live pointers, not garbage; pointer-free data is cheap to scan · reducing pressure: fewer allocations, preallocation, value types, sync.Pool, avoiding pointer-heavy maps · finalizers vs runtime.AddCleanup (1.24); weak pointers (1.24) · returning memory to the OS (scavenger); RSS vs heap size · observing: GODEBUG=gctrace=1 fields, runtime/metrics, heap profiles · Go leak patterns (goroutines, unbounded maps, sub-slice retention, global registries) · Green Tea GC (experiment in Go 1.25; whether it is default later, verify).
  - Diagrams: state diagram of the GC cycle with the stop-the-world points. Excalidraw of tri-color marking (white/grey/black, the write barrier shading a pointer). Sketch of heap size over time (sawtooth) under GOGC vs GOMEMLIMIT.
- **`06 Backend Engineering in Go/Testing Go Services`**
  - Must cover: handler tests through the real router + middleware (httptest.NewRecorder) · in-process end-to-end tests with httptest.NewServer · repository tests against real Postgres via testcontainers-go (avoid sqlmock); isolation via tx rollback or a schema per test · fixtures, factories, seed data · fake external providers: an httptest server with fault injection (timeouts, 429, 500) · gRPC tests with bufconn · OpenAPI contract validation inside tests (kin-openapi) · idempotency and concurrency tests (duplicate webhook, N concurrent requests, -race) · time control (fake clock or synctest) · goleak in TestMain · golden JSON responses · CI: build tags, -short, service containers, parallelism · coverage of integration paths (`go build -cover`).
  - Diagrams: flowchart of the InvoiceOps test pyramid with the tool used at each layer.
- **`04 Go Language/Modern Go Feature Timeline (1.18-1.25)`** (optional, high interview value)
  - Must cover, by release:
    - 1.18: generics, fuzzing, workspaces.
    - 1.19: typed atomics, GOMEMLIMIT, memory-model revision.
    - 1.20: errors.Join and multiple %w, WithCancelCause, ResponseController, `go build -cover`, PGO preview.
    - 1.21: min/max/clear, slog, slices/maps/cmp, WithoutCancel/AfterFunc, OnceFunc, PGO GA, toolchain directive.
    - 1.22: per-iteration loop variables, range over int, method/wildcard ServeMux, math/rand/v2, sql.Null[T], server TLS 1.2 minimum.
    - 1.23: iterators, timer changes, unique, Request.Pattern.
    - 1.24: generic type aliases, Swiss maps, tool directive, b.Loop, T.Context, os.Root, omitzero, rand.Text, AddCleanup/weak, http.Protocols.
    - 1.25: container-aware GOMAXPROCS, synctest GA, WaitGroup.Go, CrossOriginProtection, FlightRecorder, json/v2 and Green Tea GC experiments.
  - Pin the vault to one target version (`go 1.24+` in examples).
  - Diagrams: a timeline flowchart.

### Delete list (with reason)
- `Go Backend Complete Notes`: verified verbatim concatenation of 55 notes (0 unique lines in the body). Move its 9 unique URLs and the study flow first.
- `Golang Backend Content Table`: navigation-only; it points to the duplicate.
- `Go SQL NoSQL API Practice`: course meta + copied table lists. Its exercise moves to the 06 Repository note; the theory already exists in `data modeling/SQL vs NoSQL`.
- Removed as standalone files after their merge (content preserved):
  - Go Backend Coding Roadmap, Go Bootcamp Coding Checklist: into the 06 capstone.
  - Go Bootcamp Course Coverage Map, Go YouTube Topic Links: into 19 Go Learning Resources.
  - Go gRPC Deep Dive, Go gRPC TLS Metadata Deadlines, Go gRPC Testing Tools Postman grpcurl, Go Protoc Code Generation, Go Protobuf Validation: into 06 gRPC Services in Go.
  - Go Protocol Buffers Deep Dive, Go Proto Versioning Best Practices: into 05.
  - Go GraphQL Backend: into 05 GraphQL.
  - Go Logging Observability, Go OpenTelemetry Metrics Tracing: into 06 Observability.
  - Go Password Hashing: into 12.
  - Go Source Code Reading Debugging: into the 04 Toolchain note.

### Cross-area overlaps found
**Go ↔ LLD canonical placement** (decisions requested in my brief)

**Concurrency** (`Go Concurrency Goroutines Channels` ↔ `LLD with Go/Concurrency in Go LLD`). The LLD note is much stronger: correct mutex check-then-act, lock-ordered Transfer, a worker pool with backpressure, an atomic counter, and a table of DB-level invariants.
- Canonical home for primitives and patterns: the four 04 notes (Goroutines and Channels; select and Concurrency Patterns; sync Primitives and Atomics; Memory Model and Data Races). The LLD Pool and Counter code moves there.
- `17 LLD/Concurrency in LLD` keeps the interview framing ("where is the shared state / what protects it / what happens on collision"), the decision table and diagram, the check-then-act and lock-ordering examples, and the DB-invariant table, and links to 04.
- DB techniques (conditional UPDATE, FOR UPDATE, version column) are canonical in `07 Databases` (locking/transactions).

**Errors and interfaces** (`Go Error Handling`, `Go Types Structs Interfaces` ↔ `LLD with Go/Error Handling and Interfaces in Go LLD` ↔ `api design/API Error Handling`).
- Canonical: `04 Go Language/Error Handling` (built mostly from LLD Part 2) and `04 Go Language/Interfaces` (from LLD Part 1).
- The HTTPStatus mapper and error envelope go to `06 .../Building REST Endpoints`.
- The error *contract* (problem+json, codes) stays in `05 APIs/API Error Handling`.
- The LLD note becomes a short "Go idioms interviewers check in LLD" section in `17 LLD/LLD Interview Method`, linking to 04.

**Testing** (`Go Testing` ↔ `LLD with Go/Testing LLD Code in Go` ↔ `testing strategy/*`).
- Canonical Go testing mechanics: `04 Go Language/Testing in Go`, built from the LLD note (table tests, fakes vs mocks, -race winner test, Clock) + fuzz/bench/synctest.
- Service-level testing (httptest, testcontainers, bufconn): `06 .../Testing Go Services`.
- Strategy (pyramid, contract, load, chaos): `15 Testing`.
- "How to test your design in an LLD round" becomes a section of `17 LLD/LLD Interview Method`.

**Other overlaps** (Go note ↔ other notes → canonical home):
- Middleware + recover ↔ LLD `Decorator Middleware Pattern in Go`, `Chain of Responsibility Pattern in Go`, `Rate Limiter LLD in Go` (has ResponseWriter middleware) → `06 .../Middleware`; the LLD patterns link to it.
- Transactions/Repository ↔ LLD `Repository Pattern in Go`, `database/Transactions`, `data modeling/Optimistic and Pessimistic Locking`, `distributed systems/Outbox Pattern` → Go code in 06; isolation/locking theory in 07; outbox in 10 (or 09).
- Project layout ↔ LLD `Go LLD Folder Structure for Practice`, `architecture patterns/Clean, Hexagonal, Layered Architecture` → 06 layout; architecture styles in 16.
- Migrations ↔ `database/Database Migration` → 07 canonical; Go tooling section in 06.
- Database SQL ↔ `database/Connection Pooling`, `data modeling/N Plus One Query Problem` → pooling and N+1 theory in 07; Go code in 06.
- Auth ↔ `auth security/JWT`, `Sessions and Cookies`, `Refresh Token and Access Token`, `OAuth`, `Authentication vs Authorization` → 12 concepts; 06 implementation.
- Password hashing: the only note on this topic in the vault → `12 Security & Auth/Password Hashing`.
- Security ↔ `auth security/*`, `api design/CORS`, `Docker Security Basics` → 12 concepts; 06 Go checklist.
- Config ↔ `auth security/Secrets Management` → 12 for secrets management; 06 for config loading.
- Redis ↔ `redis/API Caching with Redis`, `Rate limiting with Redis`, `Message Queue with Redis`, `Caching Patterns and Types`, `performance/Cache Stampede Avalanche Penetration`, LLD `Rate Limiter LLD in Go` → 08 patterns; 11 rate-limit algorithms; 06 Go client code.
- Workers + cron ↔ `reliability/Background Jobs`, `Cron Jobs`, `Durable Job Scheduler`, `Worker Architecture`, `Retry and Backoff`, `Dead Letter Queue`, `performance/Backpressure`, LLD `Notification System LLD in Go` → 09 canonical; 06 Go implementation. With the two Go notes this cluster is 8 notes, not the 6 in the brief.
- Webhooks ↔ `api design/Webhooks`, `Webhook Processing`, `reliability/Idempotency` → 05 (webhooks, idempotency keys); 06 worked Go example.
- File uploads ↔ `api design/File Upload Architecture`, `aws/AWS S3`, `system design practice/Design File Storage` → 05 architecture; 06 Go implementation.
- External calls ↔ `reliability/Circuit Breaker`, `Retry and Backoff` → reliability patterns in 09/10; 06 Go code.
- WebSocket ↔ `Api architecture/WEBSOCKET`, `reliability/WebSocket Scaling`, `Design Chat System` → 05 protocol; 11 scaling; 06 Go.
- GraphQL ↔ `Api architecture/GRAPHQL`, `N Plus One Query Problem` → 05 (merge).
- gRPC/proto (10 Go notes) ↔ `Api architecture/GRPC` → 05 protocol + protobuf evolution; 06 Go services, streaming, gateway.
- HTTPS/TLS/HTTP2 ↔ `aws/Domain DNS HTTPS SSL TLS` → 02 protocols; 06 Go server config.
- Benchmarking ↔ `performance/Profiling` (generic, never mentions pprof), `testing strategy/Load Testing`, `production debugging/Memory Leak Debugging` → 04 Go profiling; 15 load testing; 14 performance engineering.
- Logging/OTel ↔ `observability/Logs Metrics Traces`, `Monitoring and Alerting`, LLD `Logging System LLD in Go` (has slog/sync.Pool) → 14 concepts; 06 Go instrumentation.
- Graceful shutdown ↔ `deployment/Kubernetes Basics` (probes, termination) → 06 canonical; 13 for the Kubernetes pod lifecycle.
- Docker ↔ docker folder (10 notes), `deployment/Docker Multi-stage Build`, `auth security/Docker Security Basics`, `cloud deployment/ECR and ECS` → 13 canonical; 06 Go-specific Dockerfile.
- OpenAPI ↔ `api design/API Contract Design`, `API Versioning` → 05 canonical; 06 Go tooling.
- Generics ↔ LLD `Iterator Pattern in Go`, `LRU Cache LLD in Go` (generic LRU) → 04.
- sync.Once ↔ LLD `Singleton Pattern in Go` → 04 sync canonical; LLD links to it.
- Functional options ↔ LLD `Builder and Functional Options Pattern in Go` → 17 canonical; the 06 config and constructor notes link to it.
- Coding Roadmap ↔ `sde3 roadmap/SDE3 Backend Roadmap` and the other roadmap notes → 19 / 00 Home.

### Factual errors found (quote → correction)
1. Go Concurrency Goroutines Channels: `jobs := make(chan Job)` / `jobs <- Job{ID: "1"}` / `job := <-jobs` → this deadlocks (ran it: "fatal error: all goroutines are asleep - deadlock!"). Receive in another goroutine, or use `make(chan Job, 1)`.
2. Go Language Basics: "For strings, range gives rune index and rune value" → it yields the byte offset of each rune (ran "भारत": 0, 3, 6, 9) plus the rune.
3. Go Language Basics: "Common mistake: taking address of range variable in old code patterns", and Go Pointers Memory Values: "returning pointer to reused loop variable" → no longer a bug since Go 1.22 (per-iteration loop variables when go.mod says go ≥ 1.22; verified &v differs per iteration). The gotcha that remains: v is a copy of the element.
4. Go Language Basics: `rupees := float64(cents) / 100` as the conversion example → never do money arithmetic in float64. Keep int64 minor units and format with /100 and %100, or use a decimal type.
5. Go Language Basics: `count, ok := statusCount["overdue"]; if !ok { count = 0 }` → redundant, because a missing key already yields 0. Comma-ok exists to tell "absent" from "present with value zero".
6. Go Deep Basics: task premise "The API should return 500 without crashing the process" → net/http already recovers panics in the handler goroutine. Tested with no middleware: the process survives and the client gets EOF. The middleware only adds a clean 500 and logging. A panic in a goroutine spawned by the handler still crashes the process, because recover works per goroutine.
7. Go Deep Basics: the recover middleware calls `http.Error(w, "internal error", 500)` and never logs → the panic value and stack are swallowed. After a partial write it sends status 200 + a corrupted body (tested: `{"partial":internal error`) and the log shows "superfluous response.WriteHeader". Fix: log debug.Stack, write 500 only if headers are unsent, re-panic http.ErrAbortHandler.
8. Go HTTP Server: `if r.Method != http.MethodPost { http.Error(…, 405) }` → outdated since Go 1.22. Register "POST /invoices" and ServeMux replies 405 with `Allow: POST` (tested).
9. Go Graceful Shutdown: "Production services must stop cleanly during deploys, restarts, and crashes" → crashes, SIGKILL and OOM kills can't be intercepted. Graceful shutdown covers only SIGTERM/SIGINT; crash safety needs idempotent at-least-once processing.
10. Go Transactions and Repository Pattern: step 5, "enqueue follow-up job or outbox event", before commit → enqueueing to a queue inside the tx is a network call and a dual write, contradicting the note's own rule. Only insert an outbox row in the tx, and publish after commit.
11. Go Webhooks Idempotency: "4. check event id in webhook_events … 6. start transaction 7. insert event id" → check-then-insert outside the tx races. Use `INSERT … ON CONFLICT (provider, event_id) DO NOTHING` inside the tx and treat 0 rows as a duplicate.
12. Go Worker Queues and Background Jobs: diagram `API->>DB: create invoice` then `API->>Queue: enqueue send_invoice_email` → a dual write that can lose or orphan jobs. Write a job or outbox row in the same tx.
13. Go Auth JWT Sessions: "JWT … harder to revoke immediately unless you use short expiry and refresh-token storage" → those only limit how long a stolen token works. Immediately revoking an access JWT needs a server-side check (jti denylist or token version).
14. Go Deployment Docker: "Go is easy to deploy because it builds to a single binary" → it is only fully static with CGO_ENABLED=0 / pure Go. cgo builds need libc, and scratch images also need CA certs and tzdata.
15. Go Benchmarking: "benchmarking debug builds only" → Go has no debug/release build split (go build and go test optimize by default). The real pitfalls are -race, `-gcflags=all=-N -l`, dead-code elimination (use b.Loop, Go 1.24) and noisy hosts. Also, wrk's closed-loop model under-reports tail latency (coordinated omission).
16. Go Strings Runes Time Files: "Go strings are bytes" → strings are immutable byte sequences, conventionally but not necessarily valid UTF-8. And `time.Parse("2006-01-02", "2026-10-01")` ignores the error and returns UTC (verified); use ParseInLocation for local dates.
17. Go Proto Versioning Best Practices: "add new fields instead of renaming old fields" (no reason given) → renames are binary-compatible but break protojson/text format and generated code. That is the actual reason.
18. Go HTTPS HTTP2 TLS Server: `err := srv.ListenAndServeTLS("server.crt", "server.key")` with the error unhandled → check it, and treat http.ErrServerClosed as a clean shutdown.
19. Go Database SQL: a `QueryRowContext(…)` example with no `.Scan` → errors, including sql.ErrNoRows, only surface at Scan.
20. Go gRPC TLS Metadata Deadlines: `context.WithTimeout(context.Background(), 2*time.Second)` presented as the pattern → inside request paths, derive from the incoming ctx so cancellation and deadline budgets propagate.
21. Go Protoc Code Generation / Go gRPC Services: `go install …@latest` → pin plugin versions (go.mod tool directive in Go 1.24, or buf remote plugins) for reproducible codegen.
22. Go File Uploads: "validate content type/extension" → both are client-controlled. Sniff the bytes (http.DetectContentType on the first 512 bytes) and use an allowlist.

### Owner content worth preserving
- Nothing in this folder is handwritten and there are no images (audit: hand=0, imgs=0 for all 57). All content was generated.
- Worth carrying into the rebuild:
  - The InvoiceOps capstone spec: product scope, MVP API list, tables, milestones, code checkpoints, senior interview story.
  - The env var list.
  - The index list, including `webhook_events(provider, event_id) unique`.
  - The webhook span tree.
  - Snippets: Go 1.22 routing, the tx shape, the ticker loop.
  - The Invoice proto and reserved example.
  - The grpcurl, ghz and wrk commands.
  - Go Language Basics' tables (zero values, builtins, make/new rule) and its mini-practice list.
  - All resource links: 12 in YouTube Links + 9 found only in the Complete Notes preamble.
  - The Udemy curriculum topic list, as a coverage checklist.
- From the LLD folder (another reviewer's area, but the best Go source text in the vault for 04):
  - Concurrency: mutex check-then-act, lock-ordered Transfer, the worker Pool with Submit backpressure, the atomic Counter, the DB-invariant table.
  - Errors: the sentinel/typed/wrapped table, the ValidationError type, the HTTPStatus mapper.
  - Testing: table tests, the -race one-winner test, the Clock interface, the fakes-vs-mocks table.
