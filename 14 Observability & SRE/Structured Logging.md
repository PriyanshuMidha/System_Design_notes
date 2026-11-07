---
tags: [observability, go, logging]
level: basic
status: reviewed
prereqs: ["[[Observability Fundamentals]]"]
related: ["[[Metrics and Prometheus]]", "[[Distributed Tracing with OpenTelemetry]]", "[[Observability in Go Services]]"]
sources:
  - "log/slog package docs (Go 1.21+): Logger, Handler, JSONHandler, LogValuer"
  - "OpenTelemetry specification, Logs Data Model and Bridge API"
  - "Google SRE Book, ch. 6: Monitoring Distributed Systems (logs vs metrics)"
updated: 2026-11-07
---

# Structured Logging

> [!summary] TL;DR
> A structured log is a line of key-value fields (usually JSON), not a formatted sentence — so a machine can filter, aggregate and join it with other telemetry, instead of a human having to parse free text with regular expressions.

> [!abstract] Core idea
> - A `printf`-style log (`"user 42 paid $19.99"`) is a sentence; a structured log (`{"event":"payment","user_id":42,"amount_cents":1999}`) is a row. Rows are queryable; sentences are not.
> - Go's `log/slog` (standard library since Go 1.21) gives every log line a level, a message and typed key-value attributes, written through a pluggable `Handler` — usually `JSONHandler` in production.
> - A field should be unloggable by construction when it must never appear: implement `slog.LogValuer` on the type and it always renders as `[REDACTED]`, no matter who logs the struct that holds it.
> - The fields worth standardizing across every service are the ones that let you filter and join: `trace_id`, `request_id`, `service`, and a few domain fields — not an unbounded dump of every variable in scope.

### Whiteboard version

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
logger.Info("invoice created", "invoice_id", 482, "amount_cents", 129900)
// {"time":"...","level":"INFO","msg":"invoice created","invoice_id":482,"amount_cents":129900}
```

One call, one JSON object, one event. Everything below adds what production needs: standard fields, request-scoped context, redaction, levels, sampling and a real pipeline.

## 1. Why it exists

A `printf` log line like `log.Printf("payment failed for order %d: %v", orderID, err)` is fine to read once, by eye, in a terminal. It fails the moment you need to answer "how many payment failures happened for tenant `acme` in the last hour, broken down by error code" — that requires parsing the sentence back apart with a regex that breaks the next time someone tweaks the wording.

A structured log line for the same event —

```json
{"time":"2026-11-07T10:02:03Z","level":"ERROR","msg":"payment failed","order_id":9123,"tenant":"acme","error_code":"card_declined","trace_id":"4bf92f..."}
```

— is already a row a log backend (Loki, Elasticsearch, CloudWatch Logs Insights) can filter on `tenant="acme" AND error_code="card_declined"` and count, without parsing anything. The cost is discipline: every field has a stable key, and nobody free-text-formats a value that should be its own field.

## 2. Mental model

Think of `printf` logging as handwriting a diary entry and structured logging as filling in a form. The diary entry is natural to write and read once, but a thousand diary entries can only be searched by reading them. A thousand filled-in forms can be filtered, sorted, counted and joined — because every entry put the same fact in the same named box.

`log/slog`'s job is to make filling in that form as easy as calling a function: `logger.Info(msg, key1, val1, key2, val2, ...)` builds one structured record; the `Handler` decides how it's rendered (JSON for machines, a human-readable line for a local terminal) and where it goes.

## 3. How it works

A request's logger is built once by middleware and carries `request_id` and `trace_id` into every layer that logs from then on, without every function needing to pass those fields explicitly:

```mermaid
sequenceDiagram
    participant C as Client
    participant MW as Logging middleware
    participant H as Handler (business logic)
    participant DB as Repository layer
    participant L as log/slog JSONHandler

    C->>MW: HTTP request (Traceparent header)
    MW->>MW: build logger.With(request_id, trace_id, method, path)
    MW->>MW: ctx = context.WithValue(ctx, loggerKey, logger)
    MW->>H: next.ServeHTTP(w, r.WithContext(ctx))
    H->>H: log := FromContext(ctx)
    H->>DB: UpdateInvoice(ctx, id)
    DB->>DB: log := FromContext(ctx)
    DB->>L: log.Info("invoice updated", "invoice_id", id)
    Note over L: line carries request_id + trace_id,<br/>injected once, never passed as a parameter
    H->>L: log.Info("request handled", "status", 200)
    L-->>MW: JSON lines, each carrying the same request_id/trace_id
```

Every log line from this one request — whether written by the handler or three layers down in the repository — carries the same `request_id` and `trace_id`, because both were attached to the logger once, in the context, not threaded through every function signature by hand.

### `log/slog`'s building blocks

- **`Logger`** is what you call (`Info`, `Warn`, `Error`, `Debug`, and their `*Context` variants that also record the current span if one is active).
- **`Handler`** decides format and destination. `slog.NewJSONHandler(w, opts)` is the production choice; `slog.NewTextHandler` is readable for local development.
- **`With(key, val, ...)`** returns a new `*Logger` carrying those attributes on every future call — this is how a request-scoped logger is built once and reused.
- **`WithGroup(name)`** nests attributes under a JSON object, useful for a request's fields vs. a business event's fields staying visually and structurally separate.
- **`LogValuer`** is an interface a type implements to control how it renders when logged — the mechanism for redaction (see `## 4`).
- **`HandlerOptions.Level`**, backed by an `slog.LevelVar`, can be changed at runtime (e.g. via an admin endpoint) without restarting the process — useful for turning on `Debug` logging on one instance during an incident.

## 4. Worked example

The Go code below builds a request-scoped logger via middleware, and makes a password field unloggable by construction with `LogValuer`. It compiles and passes `go vet` and `go test -race` on Go 1.24.

```go
package logging

import (
	"context"
	"log/slog"
	"net/http"
)

// ctxKey is an unexported type so no other package can collide with this context key.
type ctxKey struct{}

// Secret implements slog.LogValuer (Go 1.21+) so it is redacted by construction:
// logging the struct that holds it can never leak the real value.
type Secret string

func (s Secret) LogValue() slog.Value {
	return slog.StringValue("[REDACTED]")
}

// WithLogger returns a context carrying l as the request-scoped logger.
func WithLogger(ctx context.Context, l *slog.Logger) context.Context {
	return context.WithValue(ctx, ctxKey{}, l)
}

// FromContext returns the request-scoped logger injected by RequestLogger,
// or slog.Default() if none was injected (so callers never need a nil check).
func FromContext(ctx context.Context) *slog.Logger {
	if l, ok := ctx.Value(ctxKey{}).(*slog.Logger); ok {
		return l
	}
	return slog.Default()
}

// RequestLogger is middleware that builds one logger per request, carrying
// request_id, trace_id (when present), method and path, and injects it into
// the request's context so every layer below logs with the same fields.
func RequestLogger(base *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			requestID := r.Header.Get("X-Request-Id")
			if requestID == "" {
				requestID = "unknown"
			}
			l := base.With(
				"request_id", requestID,
				"method", r.Method,
				"path", r.URL.Path,
			)
			if traceID := r.Header.Get("Traceparent"); traceID != "" {
				l = l.With("trace_id", traceID)
			}
			ctx := WithLogger(r.Context(), l)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
```

The test proves two things: a `Secret` field never appears in the rendered output, and the injected logger's fields actually make it into the JSON line.

```go
func TestSecretIsRedacted(t *testing.T) {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))

	logger.Info("login attempt", "user", "alice", "password", Secret("hunter2"))

	out := buf.String()
	if strings.Contains(out, "hunter2") {
		t.Fatalf("secret leaked into log output: %s", out)
	}
	if !strings.Contains(out, "[REDACTED]") {
		t.Fatalf("expected redacted marker in output: %s", out)
	}
}

func TestRequestLoggerInjectsFields(t *testing.T) {
	var buf bytes.Buffer
	base := slog.New(slog.NewJSONHandler(&buf, nil))

	var captured *slog.Logger
	handler := RequestLogger(base)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		captured = FromContext(r.Context())
		captured.InfoContext(r.Context(), "handled")
	}))

	req := httptest.NewRequest(http.MethodGet, "/invoices/42", nil)
	req.Header.Set("X-Request-Id", "req-123")
	req.Header.Set("Traceparent", "00-trace-span-01")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	var line map[string]any
	json.Unmarshal(bytes.TrimSpace(buf.Bytes()), &line)
	for _, field := range []string{"request_id", "method", "path", "trace_id"} {
		if _, ok := line[field]; !ok {
			t.Errorf("log line missing field %q: %v", field, line)
		}
	}
}
```

**Measured:** both tests above pass under `go test -race` (Go 1.24.4, 2026-11-07).

### Standard fields worth putting on every line

| Field | Why |
| --- | --- |
| `time`, `level`, `msg` | `slog`'s own required fields |
| `service`, `version`, `env` | Which deployable and build this line came from |
| `trace_id`, `span_id` | Joins this line to a trace — the single most valuable correlation field |
| `request_id` | Joins lines within one request even without tracing wired up |
| `route` (templated), `method`, `status`, `latency_ms` | The RED facts about this request |
| `tenant` | Lets support and on-call filter to one customer's traffic |
| `error_code` | A stable, grep-able code, separate from the free-text error message |

### The shipping pipeline

From a `slog.JSONHandler` writing to `stdout` to a line a human can search:

```mermaid
flowchart LR
    APP["Go service<br/>slog.JSONHandler → stdout"] --> AGENT["Log agent<br/>(Fluent Bit / Vector /<br/>OTel Collector filelog receiver)"]
    AGENT -->|"parse, batch,<br/>redact, drop rules"| BACKEND["Log backend<br/>(Loki / Elasticsearch /<br/>CloudWatch Logs)"]
    BACKEND --> HOT["Hot tier<br/>7-14 days, searchable"]
    BACKEND --> COLD["Cold tier<br/>long retention, compliance"]
    HOT --> GRAF["Grafana / Kibana<br/>query by trace_id, tenant, error_code"]
```

The agent is where redaction rules, batching and drop rules for low-value lines live — centrally, not re-implemented per service.

## 5. Variants and comparison

| Approach | How it works | Use when | Cost |
| --- | --- | --- | --- |
| `printf`/text logs | Free-text sentences, read by eye | Local scratch scripts, never production services | Unqueryable at any scale beyond one terminal |
| `log/slog` JSON | Key-value attrs through a pluggable `Handler` | The Go 1.21+ default for any production service | Small per-call allocation cost; see `## 8` |
| Wide structured events | One large event per unit of work (dozens of fields), often via OTel's Logs API | You need arbitrary ad hoc slicing across many fields (see [[Observability Fundamentals]]) | Higher per-event size; more valuable per byte for debugging |
| Audit logs | A separate, append-only, long-retention stream of who-did-what | Compliance, security review, "who changed this invoice" | Must be tamper-evident and kept far longer than app logs |

> [!tip] Log or metric?
> If the question is "how many/how often," it's a metric — cheaper to store and query at scale. If the question is "show me exactly what happened on this one request," it's a log. Don't log a counter you could aggregate as a metric instead (e.g. don't log every cache hit just to count the hit rate), and don't try to reconstruct per-event detail from a metric's aggregates — it can't be done.

## 6. Trade-offs and when not to use

- JSON logs are heavier to eyeball in a local terminal than a formatted sentence; most teams keep a `TextHandler` for local development and `JSONHandler` only in deployed environments.
- Every attribute has an allocation and encoding cost on the hot path (see `## 8`); logging at `Debug` level on every request in a high-traffic service is a real latency and cost problem, not just noise — set the level per environment and consider sampling.
- Structured logs are not a substitute for metrics or traces: computing "p99 latency over the last 5 minutes" by scanning log lines is far more expensive than reading it off a Prometheus histogram that was built for exactly that.
- Audit logs and application logs have different retention, access-control and immutability requirements; mixing them into one stream makes both harder to govern correctly.

## 7. In production

- **Real systems:** nearly every Go service post-2023 uses `log/slog` directly or through a thin wrapper; Loki, Elasticsearch and CloudWatch Logs Insights are the three most common JSON-log backends; the `otelslog` bridge (part of the OpenTelemetry Go contrib repo) attaches the active span's `trace_id`/`span_id` to every `slog` record automatically, so handlers don't have to do it by hand.
- **Failure modes → fixes:**
  - Logging a struct with a password or token field by accident → implement `LogValuer` on the secret type so it is redacted no matter which call site logs it.
  - No `request_id`/`trace_id` on a line → inject the request-scoped logger via middleware once (as in `## 4`), never expect every call site to pass it explicitly.
  - Logging the raw, unbounded request path or full payload on every request → fine for a log (logs tolerate unbounded fields), but never copy that same unbounded value into a metric label.
  - Debug-level logging left on in production under load → set the level per environment via `HandlerOptions.Level` backed by an `slog.LevelVar`, and sample noisy debug lines (e.g. log every 100th) instead of all of them.
- **What to monitor:** log volume (bytes/lines per minute) per service, so a logging regression shows up as a cost and ingestion-lag spike before it becomes a Loki/Elasticsearch outage; the ratio of `ERROR` lines to total requests, as a cheap proxy error-rate metric; dropped/throttled lines at the shipping agent.

## 8. Deep dive

- **The pipeline.** `stdout` (JSON lines) → a log-shipping agent (Fluent Bit, Vector, or the OpenTelemetry Collector's filelog/stdout receiver) → a backend (Loki, Elasticsearch, CloudWatch Logs) → retention tiers (7–14 days hot/searchable, longer cold storage for compliance). Shipping from `stdout` rather than writing to a file directly is standard in containerized deployments: the container runtime already captures `stdout`, so the agent only needs to tail it.
- **Hot-path cost.** Every `slog` call with attributes allocates: `slog.Attr` values and the `[]any` varargs slice both cost. For very hot paths (millions of calls/second), prefer the `LogAttrs` method with pre-built `slog.Attr` values over the variadic `Info(msg, "k", v, ...)` form, and consider sampling (log 1 in N successful requests at `Info`, but always log every `Error`).
- **Runtime level switching.** `slog.HandlerOptions{Level: levelVar}` where `levelVar` is an `*slog.LevelVar` lets an operator flip a running process from `Info` to `Debug` via an internal admin endpoint during an incident, then flip it back — without a restart or redeploy.
- **The `otelslog` bridge.** Rather than manually pulling `trace_id`/`span_id` out of `context` at every log call, the OTel `otelslog` handler wraps your base handler and reads the active span from context automatically, attaching the IDs to every record — the same correlation as `## 3`'s manual middleware, done once at the handler level instead of per request.
- **Never log:** passwords, full auth tokens, card numbers (PCI), and other PII in the clear. Hash or truncate an identifier if you need to correlate without storing the raw value (e.g. a hashed email for deduplication).

## 9. Interview questions

> [!question]- Why is a structured log better than a formatted sentence?
> A structured log is a row of named fields a backend can filter, aggregate and join without parsing free text. A formatted sentence like `"user 42 paid $19.99"` can only be searched by regex, which breaks the moment the wording changes, and can't be reliably aggregated (what if the amount format changes?).

> [!question]- How do you make sure a secret never ends up in a log line?
> Implement `slog.LogValuer` on the secret's type so `LogValue()` always returns a redacted placeholder. This makes the field unloggable by construction — logging the struct that holds it, or passing it to a log call directly, can never leak the real value, unlike relying on every call site to remember not to log it.

> [!question]- How does `request_id`/`trace_id` end up on every log line without every function passing it explicitly?
> Middleware builds one logger with `.With("request_id", ..., "trace_id", ...)` once per request and stores it in the request's `context.Context`. Every layer below calls `FromContext(ctx)` to get that same logger, so the fields ride along with the context instead of being threaded through every function signature by hand.

> [!question]- When should something be a log line instead of a metric?
> When the question is about one specific event's full detail ("what exactly happened on this request") rather than an aggregate trend ("how many, how often"). If you find yourself trying to compute a rate or percentile by scanning log lines, that's a metric you should have recorded directly instead.

> [!question]- Trap: "We log everything at Debug level in production so we never miss anything." What's wrong with that?
> Every `Debug` call on a hot path still allocates and gets shipped, parsed, indexed and stored — at production traffic, that's a real latency, ingestion-cost and storage-cost problem, not free insurance. Set `Debug` off by default, enable it narrowly and temporarily (via a runtime-switchable level) during an incident, and use sampling for anything noisy that must stay on.

> [!question]- What's the difference between an audit log and an application log?
> An audit log is an append-only, tamper-evident record of who did what, kept for compliance and security review, often for years. An application log is operational telemetry for debugging, usually retained for days to weeks. Mixing them into one stream makes both harder to govern: audit logs need stricter access control and immutability than routine debug noise needs.

## 10. Cheat sheet

- Structured = key-value rows (JSON), not formatted sentences. Rows are queryable; sentences aren't.
- `log/slog`: `Logger` + pluggable `Handler` (`JSONHandler` in prod); `.With(...)` builds a reusable logger carrying fixed fields.
- Inject a request-scoped logger via middleware and `context`, carrying `request_id` and `trace_id`.
- Implement `slog.LogValuer` to make a field unloggable by construction.
- Standard fields: `service`, `version`, `env`, `trace_id`, `span_id`, `request_id`, templated `route`, `status`, `latency_ms`, `tenant`, `error_code`.
- Log or metric? "How often" is a metric; "what exactly happened here" is a log.
- Pipeline: `stdout` → Fluent Bit/Vector/OTel Collector → Loki/Elasticsearch/CloudWatch → tiered retention.
- Never log passwords, tokens, card numbers or PII in the clear.

## Links

- **Before this:** [[Observability Fundamentals]]
- **Next:** [[Metrics and Prometheus]], [[Distributed Tracing with OpenTelemetry]]
- **Compare with:** [[Observability in Go Services]] (the full Go wiring across logs, metrics and traces together)
