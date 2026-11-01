---
tags: [rebuild/audit]
reviewed: 2026-11-02
---

# Audit A - APIs, Security, Docker, Redis, Cloud

> [!info] What this is
> One block per old note: what it has, what is wrong, what to keep, where it goes, and the **must-cover outline** the rewrite follows. Verdicts: KEEP · POLISH · REWRITE · MERGE · SPLIT · DELETE. Depth 0 (definition only) to 5 (complete). The area plan is at the end. Back to [[Rebuild Plan]].

Scope: `Api architecture/theory/` (6), `advance backend/theory/{basic Backend (1), api design (13), auth security (9), docker (10), redis (8), aws (7), cloud deployment (5), deployment (8)}` = 67 notes, plus 45 screenshots in `Api architecture/img/` and `advance backend/img/`.
"real" = audit `unique`. Template % = 100 − audit `pct`.
Two measurement notes:
- The audit `hand` metric reads 0 for most notes here, but the owner's handwriting does exist. In Api architecture it is mixed into the template sections. In docker and redis it sits *below* `## Complete notes`.
- Every screenshot I opened (15 of 45) is a frame from a third-party course: a REST blackboard YouTube video, Net Ninja's GraphQL course, Hussein Nasser's gRPC course, a Hindi Docker/Redis course (slides read "karta hai", and the instructor's terminal runs `docker network create ayush`), and ByteByteGo's API-gateway diagram. None of them is the owner's own drawing.

---

### Api architecture cntent table
`Api architecture/theory/Api architecture cntent table.md` · 118 lines · real 57 · depth 2 · MERGE→`05 APIs/Choosing an API Style`
- Has: five-style comparison table, decision flowchart, 10-point production checklist, one-line analogies, study order.
- Problems: title typo "cntent". It is one of four overlapping API navigation notes. The decision tree is a linear if-chain: it asks "normal CRUD?" first, so the real-time and internal-RPC branches are never reached for most systems. No SSE, long polling, webhooks or async messaging. The interview answers only restate the table. ~32% template.
- Keep: the comparison table (extend it with transport, contract format, browser support, HTTP caching and streaming columns); the decision-flowchart idea; the "one company uses all five styles" example.
- New home: `05 APIs/Choosing an API Style`
- Must cover: communication patterns (request-response, server push, streaming, async events) · REST as default for public resource APIs · GraphQL for client-driven aggregation (vs BFF) · gRPC for internal typed low-latency calls · WebSocket/SSE/long polling for push · webhooks for cross-company events · SOAP for legacy partners · comparison on transport (HTTP/1.1 vs HTTP/2), payload (JSON/protobuf/XML), contract (OpenAPI/SDL/.proto/WSDL), browser support, HTTP cacheability, streaming · mixing styles (REST/GraphQL at edge, gRPC inside, gRPC-gateway transcoding) · real APIs (Stripe REST, GitHub REST+GraphQL, Google gRPC+REST transcoding, Slack WebSocket) · interview drill "how would you expose X"
- Diagrams: decision flowchart (push needed? → WebSocket/SSE; internal service call? → gRPC; many client shapes? → GraphQL/BFF; partner requires XML? → SOAP; else REST); architecture flowchart: mobile/web → gateway (REST/GraphQL) → gRPC microservices → Kafka → webhooks out.

### GRAPHQL
`Api architecture/theory/GRAPHQL.md` · 244 lines · real 80 · depth 2 · REWRITE
- Has: over/under-fetching motivation, schema/query/mutation/resolver/subscription terms, query+mutation examples, REST vs GraphQL table.
- Problems: ~47% template.
  - Owner line "so fronted directly call the data base so there is one connection of data base and the frontend" is wrong. The client calls a GraphQL server, whose resolvers fetch from databases and services.
  - The first mermaid is the generic Client→API→DB flowchart.
  - No SDL schema, no DataLoader mechanism, no query-cost limits or field-level auth detail.
  - The "over fetching" slide of this course is embedded in the REST note instead of here.
- Keep: the over-/under-fetching framing; query, mutation and response JSON examples; REST vs GraphQL table. Screenshots 20260907145211 (single endpoint), 20260907145713, 20260907145803 (Games→Reviews→Authors graph) and 20260907151856 are Net Ninja course frames: redraw them.
- New home: `05 APIs/GraphQL`
- Must cover: over-/under-fetching (REST needs 3 calls, GraphQL needs 1 query) · SDL (types, `!`, lists, input types, enums, interfaces/unions) · queries, mutations and subscriptions with variables and fragments · resolver execution model (per field, parent → child) · N+1 problem and DataLoader per-request batching · errors (HTTP 200 + `errors[]`, partial data) · field- and object-level authorization in resolvers · cost control (depth limit, complexity scoring, persisted queries/APQ, timeouts) · caching (no URL caching by default; GET + persisted queries; normalized client caches like Apollo/Relay) · Relay cursor pagination · schema evolution with `@deprecated` instead of versions · federation for microservices (Apollo Federation) · Go pointer (gqlgen, schema-first) · when not to use it
- Diagrams: sequence diagram of one query fanning out to User service and Posts DB through resolvers and merging the response; flowchart of N+1 (1 + N SELECTs) vs DataLoader (2 batched SELECTs).

### GRPC
`Api architecture/theory/GRPC.md` · 245 lines · real 73 · depth 2 · REWRITE
- Has: owner notes on protobuf, HTTP/2 and the four RPC modes; .proto example; call-type table; REST vs gRPC table.
- Problems: ~52% template.
  - The owner's "gap" line ("the http is handled by client library so here if the browser is not upto date then it is a issue") garbles the slide. The slide says gRPC ships one maintained client library per language and hides HTTP/2. Browsers are a separate problem: no native gRPC, so you need gRPC-Web or Connect through a proxy.
  - "Server streaming → youtube" is a weak example: video streams over HLS/DASH on HTTP.
  - Wrong-context link `[[REST API|http]]`: HTTP is not REST.
  - Generic Client→API→DB mermaid; the streaming diagram is a single arrow pair.
  - Overlaps 10 Go gRPC/proto notes.
- Keep: the four-mode list with examples (upload = client streaming, chat/gaming = bidi); proto example; comparison table. Screenshots 20260907152644 and 20260907152849 are Hussein Nasser course slides.
- New home: `05 APIs/gRPC and Protocol Buffers` (Go code goes to `06 Backend Engineering in Go/gRPC Services in Go`)
- Must cover: RPC and IDL idea · protobuf encoding (field number + wire type tag, varint, why it is smaller than JSON) · service definition and codegen (protoc/buf) · HTTP/2 underneath (streams, multiplexing, HPACK, `grpc-status` in trailers) · the four call types with real examples (GetUser; price ticker or log tail; telemetry or file upload; chat) · deadlines, propagation and cancellation · status codes and retry policy (retry only UNAVAILABLE, with backoff and a retry budget) · metadata and interceptors (auth, logging, tracing) · compatibility rules (never reuse field numbers, `reserved`, additive changes only) · load balancing (long-lived HTTP/2 connections defeat L4 LBs → client-side LB/xDS or an L7 proxy like Envoy) · browser story (gRPC-Web, Connect, gRPC-gateway) · TLS/mTLS · tooling (grpcurl, server reflection, health-check protocol) · when not to use it
- Diagrams: four small sequence diagrams (unary, server-stream, client-stream, bidi); flowchart of a protobuf message becoming bytes (`tag = field<<3 | wire_type`); architecture flowchart browser → Envoy (gRPC-Web) → services with client-side LB.

### REST API
`Api architecture/theory/REST API.md` · 246 lines · real 87 · depth 2 · REWRITE
- Has: path/query/body parameters, nested vs filtered URLs, method table, status-code table, best practices, error JSON.
- Problems: ~45% template.
  - Owner sentence is garbled ("so nesting of data can notwe loo long params...").
  - Screenshot 20260907145002 under "# Path" is the GraphQL course's "Over fetching" slide: it is misplaced.
  - REST is reduced to "URLs + JSON": no REST constraints, no safe/idempotent table, no conditional requests.
  - Generic sequence diagram.
  - Three other REST notes exist (bbg REST ×3, Go REST API Coding).
- Keep: owner's "prefer filtering (`/comments?post_id=`) over deep nesting" point; path vs query vs body; methods and status tables; error JSON; the "`POST /getUsers`" anti-pattern. Blackboard screenshots 20260907141713 and 20260907141906 are third-party frames: redraw them as a route table.
- New home: `05 APIs/REST and HTTP API Design`
- Must cover: REST constraints (client-server, stateless, cacheable, uniform interface, layered; HATEOAS and Richardson maturity levels) · resource modeling (plural nouns, collections vs items, sub-resources vs filters, max nesting depth) · path vs query vs body vs headers · method semantics table: safe / idempotent / cacheable (PUT and DELETE are idempotent; POST is not; PATCH not necessarily) · PUT vs PATCH (JSON Merge Patch vs JSON Patch) · status codes in depth (201 + Location, 202 for async, 204, 304, 400 vs 422, 401 vs 403, 404 vs 410, 409, 412, 429 + Retry-After, 503) · ETag + If-None-Match (caching) and If-Match (optimistic concurrency, lost update) · content negotiation · non-CRUD actions (`POST /orders/{id}/cancel`) · long-running operations (202 + operation resource) · bulk endpoints · links to Contract / Errors / Pagination / Versioning / Idempotency notes
- Diagrams: sequence diagram of an optimistic-concurrency update (GET → ETag v1; PUT If-Match v1 → 200; a concurrent PUT If-Match v1 → 412); flowchart of a long-running operation (POST → 202 + Location → poll `/operations/{id}`).

### SOAP
`Api architecture/theory/SOAP.md` · 214 lines · real 63 · depth 2 · POLISH
- Has: envelope/header/body/fault structure, SOAP 1.2 XML example, WSDL contents, SOAP vs REST table, use cases.
- Problems: ~53% template. "SOAP has built-in standards for security, transactions, and reliability" is wrong: those are separate WS-* specs (WS-Security, WS-AtomicTransaction, WS-ReliableMessaging) layered on SOAP. SOAP 1.2 also dropped the "Simple Object Access Protocol" expansion (minor). Generic Client→API→DB mermaid.
- Keep: envelope mermaid, XML example, WSDL bullets, comparison table, owner's "work with XML".
- New home: `05 APIs/SOAP and WSDL (Legacy Integrations)`
- Must cover: envelope anatomy (Header, Body, Fault) · SOAP 1.1 vs 1.2 (namespaces, `SOAPAction` header vs `action` in Content-Type) · WSDL parts (types/XSD, messages, portType/operations, binding, service) · document/literal vs rpc/encoded · SOAP Fault structure and HTTP 500 mapping · WS-Security (UsernameToken, XML Signature, timestamps) · code generation and brittleness (gowsdl) · calling SOAP from Go (`encoding/xml`, timeouts, retries only on idempotent operations) · MTOM attachments · wrapping a SOAP partner behind a REST anti-corruption layer · where it still lives (banks, insurance, telecom, government)
- Diagrams: flowchart of the envelope tree; sequence diagram Go service → SOAP adapter → bank endpoint, including the Fault path.

### WEBSOCKET
`Api architecture/theory/WEBSOCKET.md` · 218 lines · real 72 · depth 3 · REWRITE
- Has: upgrade flow with 101, polling vs WebSocket and WebSocket vs SSE tables, Redis Pub/Sub scaling diagram, production checklist.
- Problems: ~49% template.
  - Wrong-context link `[[REST API|HTTP]]`.
  - No handshake headers (Sec-WebSocket-Key/Accept), frames, opcodes or close codes.
  - No long polling; no SSE details (resume, connection limits).
  - Auth on connect and sticky sessions are only named, not explained.
  - Overlaps `reliability/WebSocket Scaling` and `Go WebSocket Realtime`.
- Keep: owner's "backend can push to FE without a request; connection stays open"; both comparison tables; scaling mermaid; production-details list.
- New home: `05 APIs/Real-time APIs: WebSocket, SSE and Long Polling`
- Must cover: short polling vs long polling vs SSE vs WebSocket (latency, overhead, direction, proxy friendliness) · Upgrade handshake (`Sec-WebSocket-Accept` = base64(SHA-1(key+GUID)), 101) · frames (text/binary/ping/pong/close opcodes, client masking, fragmentation, close codes 1000/1001/1006/1011) · SSE (`text/event-stream`, `id` + `Last-Event-ID` resume, auto-reconnect, 6-connection limit on HTTP/1.1 vs HTTP/2) · auth (cookie + Origin check against cross-site WebSocket hijacking, short-lived ticket, re-auth when the token expires) · heartbeats vs LB idle timeouts (ALB default 60 s) · reconnect with exponential backoff + jitter and resume from last offset · scaling (connections per node, file descriptors, memory per connection, fan-out via Redis Pub/Sub/NATS/Kafka, connection registry, sticky sessions trade-off) · backpressure and slow consumers (bounded send buffer, drop or disconnect) · ordering and delivery guarantees (none built in; add seq numbers + acks) · Go pointer (one reader + one writer goroutine per connection) · real systems (Slack, tickers, collaborative docs)
- Diagrams: sequence diagram of handshake → messages → ping/pong → close; flowchart of horizontal scale-out (clients → LB → WS nodes ↔ Redis Pub/Sub ↔ presence store).

### Basic backend content table
`advance backend/theory/basic Backend/Basic backend content table.md` · 139 lines · real 65 · depth 2 · POLISH
- Has: route→middleware→controller→service→DB layering, request-lifecycle sequence diagram, 10-point request checklist, todo/payment examples.
- Problems: called a content table but it is really an overview note. Uses Express/MVC vocabulary (controller, model) rather than Go (handler, service, repository). The status-code table duplicates the REST note. No code. ~33% template.
- Keep: lifecycle sequence diagram; "real backend request checklist"; `POST /payments` example (idempotency key, provider timeout); "keep controllers thin" answer.
- New home: `06 Backend Engineering in Go/Backend Request Lifecycle and Layering`
- Must cover: TCP accept → `net/http` goroutine per connection → ServeMux routing · middleware order (recover → request ID → logging → auth → rate limit → body limit) · handler / service / repository split behind interfaces · decoding, validation and DTOs · `context.Context` propagation (deadline, cancellation, request-scoped values) · mapping domain errors to HTTP status · transaction boundaries in the service layer · outbound calls with timeouts/retries · response encoding · logs/metrics/traces keyed by request ID · graceful shutdown · end-to-end worked example `POST /payments`
- Diagrams: sequence diagram client → middleware chain → handler → service → repo/DB + payment provider (with timeout branch); flowchart of the Go project layout (`cmd/`, `internal/http`, `internal/service`, `internal/repo`).

### API Contract Design
`advance backend/theory/api design/API Contract Design.md` · 150 lines · real 20 · depth 1 · REWRITE
- Has: one-paragraph definition, 8-bullet contract checklist, trivial flowchart, one-line `POST /payments` example.
- Problems: ~78% template. The five interview questions are identical across all api-design notes. No OpenAPI, no example contract, no breaking-change rules.
- Keep: checklist bullets; the 11-point checklist and "what breaks API clients" answer from API Design Content Table.
- New home: `05 APIs/API Contract Design and OpenAPI`
- Must cover: contract-first vs code-first · OpenAPI 3.1 anatomy (paths, components/schemas, parameters, responses, securitySchemes) with a full `POST /orders` example · naming and format conventions (consistent casing, ISO-8601 times, money as integer minor units + currency) · required vs optional vs nullable fields; forward-compatible enums (clients tolerate unknown values) · validation limits (string lengths, max page size, max body size) · error contract (link) · `Idempotency-Key` header contract · additive vs breaking changes; tolerant-reader principle · codegen (oapi-codegen for Go servers, client SDKs) · contract checks in CI (spectral lint, oasdiff breaking-change diff, Pact) · API style guides (Google AIP, Zalando, Microsoft)
- Diagrams: flowchart of the contract-first workflow (spec → lint/diff in CI → server stubs + SDKs → contract tests → docs); class diagram of the Order schema.

### API Design Content Table
`advance backend/theory/api design/API Design Content Table.md` · 124 lines · real 48 · depth 1 · DELETE
- Has: link lists, two navigation diagrams, quick-revision bullets, 11-point API checklist, two examples, three interview answers.
- Problems: navigation-only. The "visual topic map" is a meaningless chain (Gateway → Versioning → Pagination → CORS → ...). Duplicates the Api architecture content table.
- Keep: the 11-point API design checklist and the "what breaks API clients" answer → `05 APIs/API Contract Design and OpenAPI`.
- New home: `00 Home/05 APIs MOC` (links only)
- Must cover: n/a (navigation)
- Diagrams: none.

### API Error Handling
`advance backend/theory/api design/API Error Handling.md` · 154 lines · real 20 · depth 1 · REWRITE
- Has: definition, flowchart mapping bad input / auth / dependency failure to 400/401/403/5xx, error JSON with requestId.
- Problems: ~79% template. No RFC 9457 Problem Details, no error-code taxonomy, no retryable vs non-retryable guidance. The diagram mixes retry/fallback into the error format.
- Keep: error JSON example; flowchart idea.
- New home: `05 APIs/API Error Handling`
- Must cover: Problem Details (RFC 9457: `type`, `title`, `status`, `detail`, `instance`) vs a custom envelope · stable machine-readable codes + human messages · field-level validation error arrays · status mapping (400/401/403/404/409/412/422/429/500/502/503/504) · retryable vs non-retryable errors and `Retry-After` · never leak internals (stack traces, SQL); log them with the request ID · Go mapping of domain errors (sentinel and typed errors, `errors.Is/As`) → HTTP in one middleware · gRPC status codes + rich error details · consistency across gateway and services · metrics (4xx vs 5xx split, top error codes per route) · real references (Stripe error object, Google AIP-193)
- Diagrams: flowchart domain error → error-mapping middleware → problem+json response, with the log/trace side-branch.

### API Gateway
`advance backend/theory/api design/API Gateway.md` · 188 lines · real 47 · depth 3 · POLISH
- Has: responsibilities, routing example, auth sequence diagram, "keep the gateway thin" warning, gateway vs LB, metrics, ByteByteGo diagram.
- Problems: ~59% template. Missing:
  - the BFF pattern and aggregation;
  - gateway vs service mesh (north-south vs east-west);
  - concrete products and limits (Kong, Envoy, NGINX, AWS API Gateway with its 29 s integration timeout);
  - JWT verification at the edge vs zero-trust re-checks in services;
  - circuit breaking and load shedding.
- Keep: screenshot 20260920004936 (third-party ByteByteGo pipeline: validation → allow/deny → authn/z → rate limit → routing → discovery → protocol conversion; redraw it); both mermaid diagrams; interview answers 1–4.
- New home: `05 APIs/API Gateway and BFF`
- Must cover: filter pipeline (TLS termination, request validation, IP allow/deny, authn via JWT/JWKS or API key, coarse authz, rate limits/quotas, routing, service discovery, REST↔gRPC translation, caching, compression) · gateway vs reverse proxy vs load balancer vs service mesh · BFF per client type and response aggregation · products and trade-offs (Kong, Envoy Gateway, NGINX, AWS API Gateway REST vs HTTP API, Apigee) · keep business logic out · resilience (timeouts, retry budgets, circuit breakers, load shedding) · gateway as a single point of failure (horizontal scale, multi-AZ) · weighted/canary routing · observability (request ID injection, per-route RED metrics, access logs) · zero trust: services still authorize
- Diagrams: flowchart of the gateway filter pipeline (redraw of the ByteByteGo figure); flowchart contrasting an edge gateway (north-south) with mesh sidecars (east-west).

### API Versioning
`advance backend/theory/api design/API Versioning.md` · 160 lines · real 9 · depth 0 · REWRITE
- Has: one-sentence definition and a v1/v2 routing flowchart.
- Problems: ~91% template. No versioning schemes, no list of breaking changes, no deprecation process.
- Keep: nothing (the flowchart idea at most).
- New home: `05 APIs/API Versioning and Backward Compatibility`
- Must cover: breaking changes (remove/rename field, type change, new required input, changed defaults or meaning, new enum value for strict clients, status-code changes) vs additive changes · schemes: URI `/v1`, media type/header, query param, date-based (Stripe `Stripe-Version` with per-account pinning) · one core implementation + version transformers vs parallel deployments · deprecation lifecycle (`Deprecation` header, `Sunset` RFC 8594, changelog, per-client usage telemetry, brownouts, 410 Gone) · mobile clients that never update (min supported version, force-update) · expand/contract for fields · GraphQL `@deprecated` and protobuf field rules · semver for SDKs · how many live versions to support and their cost
- Diagrams: flowchart request with version header → transformer chain → single core handler; timeline-style flowchart announce → Deprecation header → brownout → Sunset → 410.

### CDN
`advance backend/theory/api design/CDN.md` · 273 lines · real 126 · depth 4 · POLISH
- Has: hit/miss/revalidation/purge, Cache-Control directives, cache-key design, invalidation, signed URLs, poisoning, failure modes, metrics, comparison table.
- Problems: ~32% template.
  - "`max-age`: browser freshness lifetime" is wrong: max-age applies to every cache, including CDNs; `s-maxage` overrides it for shared caches only.
  - Missing: how users reach the nearest edge (anycast vs GeoDNS), origin shield / tiered cache, request collapsing, `Vary`, `CDN-Cache-Control`/`Surrogate-Control`, dynamic-content acceleration.
  - Filed under api design; belongs in 02. Duplicates Global CDN and Edge and bbg `React Theory/CDN`.
- Keep: almost all: directive list, cache-key section (utm example), invalidation mermaid, security list, failure modes, metrics/debug headers, CDN vs proxy vs app-cache table, six interview answers.
- New home: `02 Networking & Web/CDN and Edge`
- Must cover: routing to the edge (anycast BGP vs GeoDNS) · PoP → regional/shield tier → origin · hit/miss/revalidate (ETag, 304) · Cache-Control (max-age vs s-maxage, no-cache vs no-store, private, immutable, stale-while-revalidate, stale-if-error) · cache key + `Vary` (Accept-Encoding OK, avoid Vary: Cookie) · request collapsing + origin shield against stampedes · invalidation (versioned asset URLs, surrogate-key/tag purge, soft purge) · private content (signed URLs/cookies, never cache `Set-Cookie`) · cache poisoning and cache deception · dynamic acceleration (TLS/TCP termination near the user, warm origin connections, HTTP/3) · edge compute (Workers, Lambda@Edge vs CloudFront Functions) and what must stay at origin · push vs pull; video segments (HLS/DASH) · metrics (request vs byte hit ratio, origin offload, TTFB by region, egress cost) · providers (CloudFront, Cloudflare, Akamai, Fastly)
- Diagrams: flowchart user → anycast edge → shield → origin with hit/miss/stale branches; sequence diagram of a mass expiry with request collapsing (100 misses → 1 origin fetch).

### CORS
`advance backend/theory/api design/CORS.md` · 170 lines · real 49 · depth 3 · POLISH
- Has: browser-only enforcement, preflight sequence, headers, credentials warning, Postman-works-browser-fails bug, debugging steps, edge cases.
- Problems: ~52% template.
  - No definition of origin (scheme+host+port) and no simple vs preflighted rules (a JSON POST triggers preflight; a form POST does not).
  - Calls `*` with credentials "dangerous"; in fact browsers reject it outright. The real vulnerability is reflecting any `Origin` together with `Access-Control-Allow-Credentials: true`.
  - Never says the request still reaches the server (so CSRF needs its own defense).
  - Missing `Vary: Origin`, `Access-Control-Max-Age`, `Expose-Headers`.
  - Misfiled; belongs in 12.
- Keep: important-points list, header block, edge-case list, "CORS is not auth" callout, debugging answer.
- New home: `12 Security & Auth/CORS and Same-Origin Policy`
- Must cover: same-origin policy and origin = scheme+host+port · SOP blocks reading, not sending · simple requests (GET/HEAD/POST + safelisted headers and content types) vs preflight (OPTIONS + Access-Control-Request-Method/Headers) · response headers (Allow-Origin, -Methods, -Headers, -Credentials, Expose-Headers, Max-Age) · credentialed requests (no wildcard, exact origin, `Vary: Origin`) · allowlist implementation in Go middleware (rs/cors) and suffix/regex pitfalls (`evil-example.com`) · reflected-origin + credentials vulnerability · CORS vs CSRF (cookies still sent on simple cross-site POST → SameSite + CSRF tokens) · preflight cost and caching · CDN/proxy stripping or caching CORS headers · DevTools debugging
- Diagrams: sequence diagram of a credentialed preflighted PUT (OPTIONS → 204 + headers → PUT → readable response) with the blocked branch; flowchart "does this request need a preflight?".

### File Upload Architecture
`advance backend/theory/api design/File Upload Architecture.md` · 193 lines · real 70 · depth 4 · POLISH
- Has: presigned direct-to-storage sequence, API steps, pending→uploaded→processing→ready states, failure modes, security list, metrics, strong answers.
- Problems: ~47% template.
  - "returns presigned URL with size/type restrictions" is imprecise: a presigned PUT can only pin exact signed headers; a size *range* needs a presigned POST policy (`content-length-range`).
  - No multipart specifics (≥5 MiB parts except the last, ≤10,000 parts), no resumable uploads, no checksums, no S3 event notifications, no lifecycle rule to abort incomplete multipart uploads.
  - Overlaps `Go File Uploads` and `AWS S3`.
- Keep: sequence diagram, status machine, failure modes, security list (incl. "do not serve uploaded HTML from the app domain"), answers 1–5.
- New home: `05 APIs/File Upload Architecture`
- Must cover: why not proxy bytes through API servers (memory, timeouts, LB body limits) · presigned PUT vs presigned POST policy (size range, content-type conditions), short expiry · multipart flow (initiate → presign parts → parallel upload → complete; resume after failure) · completion via client callback vs S3 event → SQS/Lambda; idempotent completion · post-upload validation (magic-byte sniffing, size, `x-amz-checksum-sha256`, malware scan) · async processing (thumbnails, transcoding) with retries and DLQ · orphan cleanup (pending-TTL sweeper, abort-incomplete-MPU lifecycle rule) · secure downloads (presigned GET / CloudFront signed URLs, `Content-Disposition: attachment`, separate user-content domain) · tenant key layout + IAM scoping · small files via Go `multipart` with `http.MaxBytesReader` · metrics
- Diagrams: sequence diagram of multipart presigned upload → S3 event → SQS → worker; state diagram pending → uploaded → processing → ready / failed / expired.

### Global CDN and Edge
`advance backend/theory/api design/Global CDN and Edge.md` · 185 lines · real 63 · depth 2 · MERGE→`02 Networking & Web/CDN and Edge`
- Has: CDN vs edge-logic distinction, edge use cases, what must stay at origin, failure modes, metrics.
- Problems: ~48% template. Repeats the CDN note's hit-ratio, purge and metrics content. No concrete platforms or limits (CPU-time caps, no local state) and no consistency model for edge KV stores.
- Keep: "edge use cases" and "what should not live at edge" lists; the CDN vs edge-logic answer.
- New home: `02 Networking & Web/CDN and Edge` (section "Edge compute")
- Must cover: edge functions vs edge caching · platforms (Cloudflare Workers, Lambda@Edge vs CloudFront Functions, Fastly Compute) and their limits · eventual consistency of edge KV · JWT pre-check at the edge vs authoritative authorization at origin · geo routing, A/B, redirects · versioned rollout and rollback of edge rules · edge vs origin log correlation
- Diagrams: flowchart edge request pipeline WAF → cache lookup → edge function → origin (in the merged note).

### Pagination
`advance backend/theory/api design/Pagination.md` · 157 lines · real 10 · depth 1 · REWRITE
- Has: one definition, offset vs cursor table, one flowchart.
- Problems: ~89% template. Its "Production example" is about a create-payment API (pasted boilerplate). Never explains why offset is slow or unstable; no keyset SQL.
- Keep: offset vs cursor table.
- New home: `05 APIs/Pagination, Filtering and Sorting`
- Must cover: why paginate · offset/limit cost (`OFFSET 100000` reads and discards rows) and instability (inserts/deletes cause skipped or duplicated items) · keyset/seek pagination on `(created_at, id)`: `WHERE (created_at, id) < ($1,$2) ORDER BY created_at DESC, id DESC LIMIT 21` + matching composite index · opaque cursors (encoded sort key, tied to sort/filter, optionally signed) · max page size and the `limit+1` trick for `has_more` · total counts (expensive; estimates) · response envelope (`data`, `next_cursor`, `has_more`) and RFC 8288 `Link` headers (GitHub) · backward cursors · filter/sort syntax with allow-listed fields · GraphQL Relay connections and gRPC `page_token` (AIP-158) · Elasticsearch `search_after` vs deep paging
- Diagrams: flowchart offset scan (rows skipped) vs keyset index seek; sequence diagram of a client walking pages with `next_cursor`.

### Reverse Proxy vs Forward Proxy
`advance backend/theory/api design/Reverse Proxy vs Forward Proxy.md` · 180 lines · real 57 · depth 3 · POLISH
- Has: who-represents-whom table, reverse-proxy duties (TLS, routing, XFF, buffering, limits, compression, cache), failure modes, metrics.
- Problems: ~51% template. Missing:
  - an NGINX config example;
  - L4 vs L7;
  - X-Forwarded-For spoofing / trusted-proxy rules, the `Forwarded` header (RFC 7239), PROXY protocol;
  - upstream keepalive pools;
  - forward-proxy HTTPS via CONNECT;
  - sidecars.
  - Misfiled (02, not api design). Name collides with the LLD "Proxy Pattern in Go" note, which is a different concept.
- Keep: difference table, responsibilities and failure-mode lists, interview answers.
- New home: `02 Networking & Web/Forward Proxy vs Reverse Proxy`
- Must cover: forward proxy (corporate egress, CONNECT tunneling for HTTPS, allowlists, caching) · reverse proxy roles (TLS termination, host/path routing, LB algorithms, buffering slow clients, compression, caching, rate limits, WAF) · L4 (TCP/SNI passthrough) vs L7 · forwarded headers and trusting only known proxies; client-IP extraction in Go · PROXY protocol · timeouts (connect/read/idle) and 502 vs 504 · upstream keepalive and pool sizing · body limits (413) · proxying WebSocket/HTTP2/gRPC · sidecar proxies (Envoy) and service mesh · reverse proxy vs API gateway vs load balancer · minimal NGINX config
- Diagrams: flowchart showing both paths (laptop → forward proxy → internet; user → reverse proxy → upstream pool); sequence diagram of XFF growing per hop and a 504 on upstream timeout.

### Webhook Processing
`advance backend/theory/api design/Webhook Processing.md` · 163 lines · real 25 · depth 2 · MERGE→`05 APIs/Webhooks: Sending and Receiving`
- Has: verify → enqueue → 200 → worker → idempotent update sequence; at-least-once, dedupe, ordering, DLQ, raw-payload audit.
- Problems: ~75% template. "Production example" is the generic create-payment text. Duplicates Webhooks; overlaps `Go Webhooks Idempotency` and `reliability/Idempotency`.
- Keep: sequence diagram, "key ideas" list, answers 1–3 (return fast, dedupe on event id, entity version for ordering).
- New home: `05 APIs/Webhooks: Sending and Receiving`
- Must cover: receiver pipeline (verify, persist raw, ack, async process) · dedupe table with unique provider event id · out-of-order handling (version compare or re-fetch from provider) · DLQ and replay tooling (rest in the Webhooks block)
- Diagrams: receiver sequence diagram (merged; see Webhooks).

### Webhooks
`advance backend/theory/api design/Webhooks.md` · 158 lines · real 15 · depth 1 · REWRITE
- Has: one definition, Stripe→API sequence, "return fast, queue slow work", answers on signatures and idempotency.
- Problems: ~84% template. Its own diagram updates the DB inside the webhook request, which contradicts "return fast". "Production example" is boilerplate. The sender side is never covered.
- Keep: answers on HMAC signature, timestamp/replay window, event-id dedupe.
- New home: `05 APIs/Webhooks: Sending and Receiving`
- Must cover: webhooks vs polling vs pub/sub · HMAC signature over the raw body, constant-time compare · timestamp tolerance (Stripe default 5 min) against replay · secret rotation with two active secrets · persist raw event, ack 2xx within the provider timeout · inbox/dedupe table · out-of-order events (version check or re-fetch state) · async workers, retries, DLQ, replay · sender side: outbox → dispatcher, exponential backoff + jitter over hours/days, per-endpoint circuit breaker and auto-disable, delivery logs, signing, SSRF protection for customer URLs · thin vs fat payloads, event versioning · reconciliation jobs for missed events · real providers (Stripe, GitHub, Razorpay) · Go receiver snippet
- Diagrams: sequence diagram of the receiver (provider → verify → inbox → 200 → worker → idempotent update, with a duplicate delivery branch); flowchart of the sender (domain event → outbox → dispatcher → endpoint → backoff → DLQ/disable).

### API Abuse and Bot Protection
`advance backend/theory/auth security/API Abuse and Bot Protection.md` · 152 lines · real 19 · depth 1 · REWRITE
- Has: 7-layer defense list (authn, rate limits, risk signals, CAPTCHA, WAF, quotas, audit) + flowchart; "login needs stricter controls".
- Problems: ~80% template. Names no concrete attacks or concrete defenses. The interview bank is the generic security set.
- Keep: layers list and flowchart.
- New home: `12 Security & Auth/API Abuse and Bot Protection`
- Must cover: threat catalog (credential stuffing, account enumeration, scraping, OTP/SMS pumping, fake signups, card testing, inventory hoarding/ticket scalping, expensive-query DoS) · edge WAF/bot management (IP/ASN reputation, TLS fingerprints JA3/JA4) · rate limits per dimension (IP, account, device, API key, tenant) · progressive challenges (CAPTCHA/Turnstile, proof-of-work) · device fingerprinting and behavioral signals · login hardening (breached-password check, per-account + per-IP throttles, generic errors, MFA) · OTP endpoint caps (per phone/IP, cooldown, country allowlist) · quotas for costly endpoints · detection (velocity rules, honeypot fields, anomaly dashboards) · actions (block, throttle, shadow-ban, step-up auth) · false positives and partner allowlists · OWASP API4 and API6 mapping
- Diagrams: flowchart defense-in-depth pipeline (edge → bot score → gateway limit → risk engine → allow / challenge / block); sequence diagram of a credential-stuffing burst being throttled then challenged.

### Auth Security Content Table
`advance backend/theory/auth security/Auth Security Content Table.md` · 122 lines · real 48 · depth 1 · DELETE
- Has: link lists, navigation diagrams, "must not miss" list, 10-point auth checklist, three interview answers.
- Problems: navigation-only; the first link block omits JWT and Sessions; linear "topic map".
- Keep: the 10-point auth/security checklist and the token-storage answer (HttpOnly cookie + CSRF) → `12 Security & Auth/Access and Refresh Tokens`.
- New home: `00 Home/12 Security & Auth MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### Authentication vs Authorization
`advance backend/theory/auth security/Authentication vs Authorization.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one-line definition and a three-box flowchart.
- Problems: ~92% template. The interview bank asks about secret rotation and compromised credentials, not authn vs authz. No authorization models and no BOLA.
- Keep: nothing.
- New home: `12 Security & Auth/Authentication vs Authorization`
- Must cover: authentication factors and MFA · issuing an identity (session or token) · 401 vs 403 (and 404 to hide existence) · authorization models: RBAC, ABAC, ReBAC (Zanzibar, OpenFGA/SpiceDB), ACLs · coarse checks at the gateway vs object-level checks in the service · BOLA/IDOR (`GET /orders/123` owned by someone else) and the fix (scope every query by owner/tenant) · BFLA (admin functions) · multi-tenant isolation (tenant_id everywhere, Postgres row-level security) · policy engines (OPA, Casbin) and a Go middleware pattern · default deny, least privilege · audit logging of decisions · service identity vs user identity (on-behalf-of)
- Diagrams: sequence diagram request → authn middleware (principal) → authz check (principal, action, resource) → 403 or data; class diagram RBAC (User–Role–Permission) vs ReBAC tuples.

### Docker Security Basics
`advance backend/theory/auth security/Docker Security Basics.md` · 160 lines · real 9 · depth 0 · MERGE→`13 DevOps & Cloud/Docker 09: Container Security and Hardening`
- Has: one-line definition, Dockerfile → scan → registry → runtime flowchart, one failure-mode line.
- Problems: ~91% template; the interview bank is generic auth; misfiled under auth security.
- Keep: the failure-mode line (root user, huge images, unpinned deps, baked secrets) as the checklist seed.
- New home: `13 DevOps & Cloud/Docker 09: Container Security and Hardening`
- Must cover: non-root `USER` (e.g. 65532), `--cap-drop ALL`, `no-new-privileges`, read-only root FS · minimal bases (distroless/scratch/alpine trade-offs), pin by digest · scanning (Trivy/Grype/ECR) and SBOM (syft) · secrets never in layers/ENV/ARG; BuildKit `--mount=type=secret`; runtime injection · Docker socket mount = root on host · shared kernel, seccomp/AppArmor, rootless mode and user namespaces · memory/CPU/pids limits · image signing (cosign) and admission policies · rebuild cadence for base-image CVEs · Kubernetes `securityContext` equivalents
- Diagrams: flowchart of the secure supply chain (source → BuildKit build with secret mount → SBOM + scan → sign → registry → admission check → run non-root with dropped caps).

### JWT
`advance backend/theory/auth security/JWT.md` · 197 lines · real 34 · depth 2 · REWRITE
- Has: header.payload.signature, payload example, "encoded not encrypted" warning, login and refresh-rotation sequences, localStorage warning.
- Problems: ~71% template; generic interview bank. No signing algorithms (HS256 vs RS256/ES256, JWKS, `kid`). No attacks (`alg: none`, RS/HS confusion, missing `aud`/`iss` checks). Revocation is only called "harder".
- Keep: both sequence diagrams; payload example; encoded-not-encrypted warning.
- New home: `12 Security & Auth/JWT: Structure, Validation and Pitfalls`
- Must cover: JWS structure (base64url, what is signed); JWE briefly · registered claims (iss, sub, aud, exp, nbf, iat, jti); keep claims minimal · HS256 shared secret vs RS256/ES256 key pairs · JWKS, `kid`, rotation with overlap · validation checklist (signature, allowed alg list, iss, aud, exp/nbf with leeway) · attacks (`alg: none`, algorithm confusion, `kid`/`jku` injection, tokens in URLs/logs) · revocation (short TTL + refresh, `jti` denylist in Redis, per-user token version) · size and per-request cost vs a session lookup · storage (memory + HttpOnly refresh cookie vs localStorage XSS exposure) · ID token vs access token in OIDC · Go (golang-jwt v5 with `WithValidMethods`, `WithAudience`, `WithIssuer`)
- Diagrams: flowchart of the three parts and the signature input; sequence diagram of validation with cached JWKS and refresh on unknown `kid`.

### OAuth
`advance backend/theory/auth security/OAuth.md` · 162 lines · real 49 · depth 3 · POLISH
- Has: delegated authz, actors, Authorization Code + PKCE, state/redirect validation, OAuth vs OIDC, edge cases, good answers.
- Problems: ~51% template.
  - The diagram shows the provider handing the code straight to the app. In reality the code returns through a browser redirect to the redirect URI (front channel); only the code→token exchange is a direct back-channel call.
  - No grant comparison (client credentials, device code; implicit and password grants deprecated in OAuth 2.1).
  - No ID-token, discovery or introspection detail.
- Keep: important points, edge-case list, answers 1–5.
- New home: `12 Security & Auth/OAuth 2.0 and OpenID Connect`
- Must cover: roles (resource owner, client, authorization server, resource server) · front vs back channel · Authorization Code + PKCE step by step (`code_verifier`, S256 challenge, `state`, `nonce`) · confidential vs public clients · other grants (client credentials for service-to-service, device authorization, refresh); deprecated implicit/ROPC · scopes and consent · OIDC (ID token claims, discovery document, JWKS, userinfo) · JWT vs opaque access tokens + introspection (RFC 7662) · refresh rotation and reuse detection · exact redirect-URI matching, open-redirect and mix-up attacks · mapping a Google login to a local account by `sub` (not email) · BFF pattern for SPAs · Go (`golang.org/x/oauth2`, `coreos/go-oidc`)
- Diagrams: sequence diagram of Authorization Code + PKCE across Browser, App backend, Authorization Server, Resource Server, with front/back-channel steps marked; flowchart for choosing a grant type.

### Refresh Token and Access Token
`advance backend/theory/auth security/Refresh Token and Access Token.md` · 154 lines · real 9 · depth 1 · REWRITE
- Has: one definition and a login/refresh sequence diagram.
- Problems: ~90% template. Its "Production example" is about BOLA on an order endpoint (wrong topic). Generic interview bank.
- Keep: the sequence skeleton (the JWT note's rotation diagram is better).
- New home: `12 Security & Auth/Access and Refresh Tokens`
- Must cover: why two tokens (limit the bearer-theft window; avoid re-login) · typical lifetimes (5–15 min access; days/weeks refresh; sliding vs absolute expiry) · storage per client (HttpOnly Secure SameSite cookie scoped to `/auth/refresh`; Keychain/Keystore on mobile) · rotation and reuse detection (token family; revoke the family on reuse) · server-side store of hashed refresh tokens with device metadata · logout and "log out everywhere" · access-token revocation options (short TTL, denylist, token version) · concurrent-refresh races in SPAs/mobile (single-flight refresh, grace window) · sender-constrained tokens (DPoP, mTLS) · 401 → refresh → retry once flow · tokens vs server sessions
- Diagrams: sequence diagram with rotation and an attacker replaying an old refresh token → family revoked; state diagram of a refresh token (active → rotated → revoked/expired).

### Secrets Management
`advance backend/theory/auth security/Secrets Management.md` · 160 lines · real 9 · depth 0 · REWRITE
- Has: one definition and an App → env vars / secret manager flowchart.
- Problems: ~91% template. Nothing on stores, rotation, leak response or identity-based access.
- Keep: failure-mode line (secrets in Git, logs, images, frontend bundles).
- New home: `12 Security & Auth/Secrets Management`
- Must cover: what counts as a secret and its blast radius · anti-patterns (committed `.env`, image layers, ENV/ARG, logs, CI output, frontend bundles) · env vars vs mounted files vs runtime fetch (`/proc/<pid>/environ` exposure) · stores: AWS Secrets Manager vs SSM Parameter Store, HashiCorp Vault, Kubernetes Secrets (base64 only; encryption at rest, External Secrets, Sealed Secrets) · KMS and envelope encryption · rotation (dual credentials, Secrets Manager rotation, Vault dynamic DB credentials with leases) · prefer identity over secrets (ECS task roles, IRSA, GitHub OIDC → AWS) · scanning (gitleaks, GitHub push protection) · leak response (revoke → rotate → audit) · app-side caching and reload on rotation · least-privilege access + audit trail
- Diagrams: sequence diagram ECS task (task role) → Secrets Manager → KMS decrypt → app at startup, plus a rotation event; flowchart of envelope encryption (data key wrapped by KMS key).

### Sessions and Cookies
`advance backend/theory/auth security/Sessions and Cookies.md` · 169 lines · real 23 · depth 2 · REWRITE
- Has: session login sequence with Redis, cookie flags table, JWT vs session table.
- Problems: ~78% template. Missing:
  - SameSite values (Strict/Lax/None; Lax is Chrome's default);
  - Domain/Path/Max-Age and the `__Host-` prefix;
  - session fixation, CSRF tokens, idle vs absolute timeouts.
  - "JWT good for APIs/mobile, sessions for browser apps" is oversimplified.
- Keep: login sequence, flags table, JWT vs session table (expand it).
- New home: `12 Security & Auth/Sessions and Cookies`
- Must cover: stateless HTTP and why sessions exist · cookie attributes (Domain, Path, Expires/Max-Age, Secure, HttpOnly, SameSite=Strict/Lax/None, `__Host-` prefix, 4 KB limit) · server-side store (Redis, key = random 128-bit session ID, TTL) vs signed/encrypted cookie sessions · lifecycle (create, rotate ID on login/privilege change against fixation, idle + absolute timeout, logout deletes the server record) · CSRF and defenses (SameSite, synchronizer/double-submit token, Origin check) · XSS impact on cookies vs localStorage · scaling (sticky sessions vs shared store) · sessions vs JWT decision table (revocation, size, cross-domain, mobile) · Go (`alexedwards/scs` or `gorilla/sessions` with a Redis store)
- Diagrams: sequence diagram login → Set-Cookie → request → Redis lookup → logout; flowchart of a CSRF attempt blocked by SameSite=Lax + CSRF token.

### DOCKER Volums
`advance backend/theory/docker/DOCKER Volums.md` · 202 lines · real 35 · depth 2 · REWRITE
- Has: owner bind-mount vs named-volume notes, volume types incl. anonymous, commands, compose mongo example, course slide.
- Problems: title typo "Volums". ~71% template.
  - Owner: "bind mount... if the docker is deleted or stopped we have a backup". A bind mount is a live two-way view of a host folder, not a backup: deleting inside the container deletes on the host.
  - Wrong-context link `[[Backup and Restore|backup]]` (DB backup note).
  - Missing: tmpfs, UID/permission issues, that `docker compose down -v` deletes named volumes, and that images like mongo/postgres declare `VOLUME` (anonymous volumes get orphaned rather than deleted).
- Keep: named vs bind table; compose `mongo-data` example; commands. Screenshot 20260908144307 is a third-party course slide.
- New home: `13 DevOps & Cloud/Docker 06: Volumes and Bind Mounts`
- Must cover: writable layer is ephemeral (gone on `docker rm`) · named volumes vs bind mounts vs tmpfs · `-v` vs `--mount` syntax · anonymous volumes from image `VOLUME` and cleanup (`volume prune`) · choosing: DB data → named volume, live source → bind mount, scratch/secrets → tmpfs · ownership/UID mismatch on bind mounts · macOS file-sharing performance · back up / restore a volume with a throwaway container + tar · `compose down` vs `down -v` · production: keep containers stateless; use managed DBs/EBS/EFS or Kubernetes PVs
- Diagrams: flowchart container layers + writable layer vs a named volume, bind mount and tmpfs mapped to host locations.

### DOCKER WHY
`advance backend/theory/docker/DOCKER WHY.md` · 186 lines · real 30 · depth 2 · REWRITE
- Has: owner's dependency-version-drift story, benefits list, "same image dev→test→prod" diagram, two course frames.
- Problems: ~73% template. Wrong-context link `[[Database Replication|Replication]]`: the owner means reproducing the environment, not DB replication. No containers-vs-VMs comparison. Node-only example (node, toastr, react).
- Keep: the owner's 2024-project story (old deps vs newly installed versions), rewritten cleanly; the same-image diagram. Screenshots 20260907165423 and 20260907170401 are third-party course sketches.
- New home: `13 DevOps & Cloud/Docker 01: Why Containers`
- Must cover: "works on my machine" and dependency drift (owner story) · a container = isolated process sharing the host kernel · containers vs VMs (hypervisor + guest OS vs namespaces/cgroups; MB vs GB; ms vs s startup) · immutable artifact: build once, promote the same digest dev → CI → prod · what isolation does and does not give · density and cost · ecosystem map (Engine, OCI images, registries, Compose, Kubernetes) · what containers do not solve (config drift, kernel differences, state) · Docker Desktop runs a Linux VM on macOS/Windows
- Diagrams: side-by-side flowchart VM stack (hardware → hypervisor → guest OS → app) vs container stack (hardware → host kernel → runtime → containers).

### DOCKER_CODE
`advance backend/theory/docker/DOCKER_CODE.md` · 213 lines · real 42 · depth 2 · REWRITE
- Has: owner command notes (run -it, ps, images, exec), command lists (pull/run/stop/rm, build, logs/exec/inspect, prune), three terminal frames.
- Problems: "DOCKER_CODE" is not a topic name.
  - Owner: "docker run node just install the node image. it do not start the container" is wrong. `docker run` pulls the image if missing, then creates *and starts* a container. Node exits immediately without `-it` because it gets no TTY/stdin. `docker pull` is the download-only command.
  - Owner: "to show all container - docker ps" is wrong: `docker ps` lists running containers; `docker ps -a` lists all.
  - `docker exec -it (name) unbandtu (command)` is garbled; the form is `docker exec -it <container> <cmd>`. Typo "ubantu".
  - Wrong-context link `[[Logs Metrics Traces|logs]]` for `docker logs`.
- Keep: the corrected command lists. Screenshots 20260907171158, 20260908115350 and 20260908115442 are course terminal frames: retype them as text.
- New home: `13 DevOps & Cloud/Docker 03: CLI Essentials`
- Must cover: `pull` vs `run` vs `create` + `start` · `run` flags (`-d`, `-it`, `--name`, `--rm`, `-p`, `-v`, `-e`/`--env-file`, `--network`, `--restart`) · `ps` vs `ps -a`; `stop` (SIGTERM, then SIGKILL after 10 s) vs `kill`; `rm`, `rmi` · `exec -it <c> sh` vs `attach` · `logs -f --tail` · `inspect --format` · `cp`, `stats`, `top` · cleanup (`system prune`, `image prune -a`, `volume prune`) · `build -t`, `tag`, `login`, `push` · debugging recipes (container exits at once → `docker logs`, check CMD/PID 1; port unreachable → app bound to 127.0.0.1 inside the container)
- Diagrams: state diagram of the container lifecycle (created → running → paused → exited → removed) with commands on the transitions.

### Docker Content Table
`advance backend/theory/docker/Docker Content Table.md` · 65 lines · real 42 · depth 1 · DELETE
- Has: two link lists, a learning checklist, a production checklist.
- Problems: navigation-only. The first list has typos ("Dokcer", "volums") and links with stray spaces: `[[DOCKER WHY ]]`, `[[ how to dockerize]]`, `[[Porting mapping ]]` (verify whether Obsidian resolves them).
- Keep: the production Docker checklist (`.dockerignore`, no `.env` in the image, small base, log to stdout) → `13 DevOps & Cloud/Docker 04: Writing a Production Dockerfile for Go`.
- New home: `00 Home/13 DevOps & Cloud MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### Docker Network
`advance backend/theory/docker/Docker Network.md` · 209 lines · real 34 · depth 2 · REWRITE
- Has: driver list (bridge/host/none/overlay), Compose service-name DNS, localhost-inside-container pitfall, six course terminal frames.
- Problems: ~71% template; the only owner text is "how to create our own network". It omits the key fact the course demo exists to show: the default `bridge` network has no name-based DNS; user-defined and Compose networks do (embedded DNS at 127.0.0.11). No macvlan, no `host.docker.internal`, no port publishing (that lives in a separate tiny note).
- Keep: "localhost means the same container" section; compose example. Screenshots 20260908142833, 20260908143026, 20260908143624, 20260908144113, 20260908144132 and 20260908144144 are third-party.
- New home: `13 DevOps & Cloud/Docker 05: Networking and Port Publishing`
- Must cover: network namespaces, veth pairs, the docker0 bridge, NAT via iptables · drivers (bridge default vs user-defined, host, none, overlay, macvlan) · embedded DNS and aliases on user-defined networks · container→container (service name) vs container→host (`host.docker.internal`) vs host→container (published port) · `-p host:container`, `-p 127.0.0.1:...`, `-P`; EXPOSE is documentation only · apps must listen on 0.0.0.0 inside the container · published ports bypass ufw rules · Compose default network and split networks for isolation · debugging (`network inspect`, nslookup, netshoot)
- Diagrams: flowchart of the host with a user-defined bridge, two containers on veth pairs, NAT host:8080 → container:80, embedded DNS resolving `redis`.

### Docker_Image_Container
`advance backend/theory/docker/Docker_Image_Container.md` · 196 lines · real 32 · depth 2 · POLISH
- Has: owner "one image → many containers", image vs container table, one-image-many-containers diagram, basic commands.
- Problems: ~73% template; underscore title. No layers, union FS, copy-on-write, or tags vs digests (the layer content currently sits in `how docker Works`).
- Keep: comparison table; one-image-many-containers mermaid; owner point.
- New home: `13 DevOps & Cloud/Docker 02: Images, Layers and Containers`
- Must cover: image = ordered read-only layers + config (OCI manifest) · a layer per filesystem-changing instruction; content-addressed, shared across images · container = image + thin writable layer (overlay2 copy-on-write) · tags vs digests (`@sha256:`), the `latest` pitfall · image-size anatomy (`docker history`, dive) · multi-arch images (amd64/arm64) · pulls fetch only missing layers · a container is a process (PID 1, signals, exit codes) · many containers from one image
- Diagrams: flowchart stacking base → deps → app layers with two containers' writable layers sharing them.

### Porting mapping
`advance backend/theory/docker/Porting mapping.md` · 170 lines · real 21 · depth 2 · MERGE→`13 DevOps & Cloud/Docker 05: Networking and Port Publishing`
- Has: `-p 8080:80` explained, browser → host port → container port diagram, 127.0.0.1 binding tip, `-P`.
- Problems: wrong title ("Porting" → port publishing). Owner line "mapping of the container port to the port of the container" is wrong: it maps a host port to a container port. Too small to stand alone; ~79% template.
- Keep: example, diagram, 0.0.0.0 vs 127.0.0.1 tip.
- New home: `13 DevOps & Cloud/Docker 05: Networking and Port Publishing` (section)
- Must cover: `-p HOST:CONTAINER` semantics · binding to 127.0.0.1 vs 0.0.0.0 · `-P` random ports · EXPOSE vs publish · port conflicts · Compose `ports` vs `expose`
- Diagrams: in the merged note.

### docker comnpose
`advance backend/theory/docker/docker comnpose.md` · 194 lines · real 33 · depth 2 · REWRITE
- Has: owner up/down notes, api+redis compose example, commands, three course frames of a compose file.
- Problems: title typo "comnpose". ~71% template. `depends_on` is shown as if it waits for Redis; it only orders start-up (readiness needs a `healthcheck` + `condition: service_healthy`). The screenshot compose publishes Redis 6379 to the host, which the network note itself calls a mistake.
- Keep: example and commands. Screenshots 20260908135328, 20260908141236 and 20260908142055 are third-party.
- New home: `13 DevOps & Cloud/Docker 07: Docker Compose for Local Development`
- Must cover: file anatomy (services, build vs image, ports, environment/env_file, volumes, networks) · project name and default network · `depends_on` + healthchecks (`service_healthy`, `service_completed_successfully` for migrations) · `.env` interpolation · profiles and override files · dev loop (bind mounts, `compose watch`) · commands (`up -d`, `down -v`, `logs -f`, `ps`, `exec`, `run --rm`, `build`) · one-off jobs and migrations · Compose is single-host, not a production orchestrator · full example: Go API + Postgres + Redis + worker
- Diagrams: flowchart of the compose project (api, worker, postgres with named volume, redis on one network; only api publishes a host port).

### how docker Works
`advance backend/theory/docker/how docker Works.md` · 204 lines · real 35 · depth 2 · REWRITE
- Has: course slides (component table; 7-step run flow), CLI→daemon diagram, layer build-cache example, isolation list.
- Problems: ~71% template. Wrong-context link `Layer [[API Caching with Redis|caching]]`: Docker build cache is not Redis API caching. No namespaces, cgroups, overlayfs, containerd or runc. The isolation list omits that the kernel is shared.
- Keep: the 7-step run flow (20260908115828) and the component table (20260908115634), retyped as text; the build-cache ordering example.
- New home: `13 DevOps & Cloud/Docker 08: How Docker Works Under the Hood`
- Must cover: CLI → REST API on `/var/run/docker.sock` → dockerd → containerd → shim → runc (OCI runtime) · `docker run` step by step (resolve, pull missing layers, snapshot, namespaces, network, start PID 1) · namespaces (pid, net, mnt, uts, ipc, user, cgroup) · cgroups v2 (memory/CPU/pids, OOM kill) · overlay2 (lowerdir/upperdir/merged, copy-on-write) · BuildKit and cache invalidation rules (first changed instruction invalidates all below) · OCI image/runtime specs; Podman/containerd as alternatives · Docker Desktop's VM
- Diagrams: sequence diagram CLI → dockerd → containerd → runc for `docker run`; flowchart of a process wrapped by namespaces + cgroups on the host kernel.

### how to dockerize
`advance backend/theory/docker/how to dockerize.md` · 187 lines · real 32 · depth 2 · REWRITE
- Has: 9 steps, Node Dockerfile, build/run commands, good practices (.dockerignore, layer order, no secrets).
- Problems: Node example in a Go-first vault; `npm install` instead of `npm ci`. No non-root user, HEALTHCHECK, `.dockerignore` example or PID 1/signal handling. The step "Expose app port" suggests EXPOSE makes the port reachable; EXPOSE is metadata and `-p` publishes.
- Keep: step order; "copy dependency manifests before source" rule. Screenshot 20260908121110 is third-party.
- New home: `13 DevOps & Cloud/Docker 04: Writing a Production Dockerfile for Go` (absorbs Docker Multi-stage Build and Go Deployment Docker)
- Must cover: instructions (FROM, WORKDIR, COPY vs ADD, RUN, ENV vs ARG, EXPOSE, USER, ENTRYPOINT vs CMD, HEALTHCHECK) · cache-friendly order (`COPY go.mod go.sum` → `go mod download` → `COPY . .`) · BuildKit cache mounts for the Go build cache · `.dockerignore` · exec vs shell form, PID 1 and SIGTERM for graceful shutdown (`--init`/tini) · multi-stage build to distroless/scratch (`CGO_ENABLED=0`, `-trimpath -ldflags="-s -w"`, CA certs, tzdata) · non-root user · 12-factor config through env · tags by git SHA + digest pinning · multi-arch builds (buildx `--platform`) · full Go Dockerfile + commands
- Diagrams: flowchart of build stage → binary → runtime stage with image sizes, plus which layers hit cache after a code-only change.

### API Caching with Redis
`advance backend/theory/redis/API Caching with Redis.md` · 219 lines · real 49 · depth 3 · MERGE→`08 Caching & Redis/Caching Patterns`
- Has: why cache, cache-aside flow and steps, Redis commands with EX, Node cache-aside code, delete-on-update, strategy table.
- Problems: ~62% template.
  - The strategy table says write-through gives "strong consistency". It only keeps the cache warm; dual writes can still diverge on partial failure or races.
  - The code caches `null` for missing products for 5 min (accidental negative caching), has no Redis-down fallback and no stampede guard.
  - Delete-after-update still leaves a stale-set race.
  - Node code; `[[cache]]` links to a data-structure memoization note.
- Keep: cache-aside mermaid, command block, invalidation snippet (port to Go).
- New home: `08 Caching & Redis/Caching Patterns` (worked example: cache-aside in Go)
- Must cover: Go cache-aside with go-redis + `singleflight` · explicit negative caching with a short TTL · fall back to the DB when Redis errors (timeouts < DB latency) · serialization choice (JSON vs msgpack) · invalidation on write and its race
- Diagrams: in the merged note.

### Caching Patterns and Types
`advance backend/theory/redis/Caching Patterns and Types.md` · 249 lines · real 128 · depth 4 · SPLIT
- Has: cache-location table, five patterns, Redis eviction table, invalidation, stampede fixes, InvoiceOps example, key design, consistency models.
- Problems: ~22% template; dense, mixing four topics. Missing:
  - penetration (Bloom filter / negative cache), avalanche, hot and big keys;
  - that Redis LRU is approximate (sampling) and the default policy is `noeviction`;
  - the delete/set race and leases (Facebook memcache).
- Keep: nearly everything: InvoiceOps (Gin + Postgres, `dashboard:{workspace_id}:summary:v2`, 30 s TTL + jitter) as the running example for all of 08; key-design rules; consistency-model table; eviction table; ops checklist; sources.
- New home: `08 Caching & Redis/Caching Fundamentals` + `/Caching Patterns` + `/Cache Invalidation, TTL and Consistency` + `/Eviction Policies`
- Must cover: cache locations (browser, CDN, proxy, in-process, distributed, DB buffer pool) · hit-ratio math (effective latency = h·t_cache + (1−h)·t_db) · cache-aside / read-through / write-through / write-behind / refresh-ahead with failure semantics · TTL choice + jitter · invalidation ordering, the stale-set race and fixes (leases, versioned keys, CDC-driven invalidation via Debezium) · strong vs bounded vs eventual freshness per feature · key design and tenant isolation · eviction (LRU/LFU/TTL, Redis sampled LRU, `maxmemory` + policy, eviction vs lazy/active expiry) · negative caching · two-level caching (in-process LRU + Redis) with pub/sub invalidation · metrics (hit ratio, evictions, memory, miss latency, DB load)
- Diagrams: sequence diagrams for cache-aside and write-behind; sequence diagram of the stale-set race (reader A reads old value; writer updates DB and deletes; A sets the stale value) and its lease fix.

### Message Queue with Redis
`advance backend/theory/redis/Message Queue with Redis.md` · 233 lines · real 55 · depth 3 · REWRITE
- Has: why queues, producer/worker flow, LPUSH/BRPOP, Streams XADD/XREADGROUP/XACK, BullMQ features + example, queue vs Pub/Sub table.
- Problems: ~60% template.
  - Calls LPUSH/BRPOP "good for simple queues" without saying a worker crash after the pop loses the job (use BLMOVE into a processing list).
  - No PEL, XAUTOCLAIM or trimming for Streams.
  - "Pub/Sub: job stored? Usually no": Redis Pub/Sub never stores messages, while Kafka and cloud Pub/Sub do. Name the system.
  - Node/BullMQ only (the Go equivalent is asynq). No durability caveat (AOF fsync, failover loss).
  - Misfiled: belongs in 09.
- Keep: list/stream command snippets; queue vs pub/sub table; BullMQ feature list as concepts.
- New home: `09 Messaging & Async/Redis as a Queue: Lists, Streams and Pub-Sub`
- Must cover: list queue (LPUSH + BRPOP) and the lost-job problem · reliable list queue (BLMOVE to processing list + reaper) · Pub/Sub (fire-and-forget, no persistence, slow subscribers disconnected by output-buffer limits) · Streams (XADD with MAXLEN/MINID, consumer groups, `>`, PEL, XACK, XPENDING, XAUTOCLAIM, delivery count → DLQ) · at-least-once → idempotent handlers · durability (RDB/AOF fsync, async-replica failover can lose acked writes) · delayed jobs with a sorted set (score = run_at) · Go: asynq (retries, scheduling, uniqueness); Node: BullMQ · when to pick Kafka/RabbitMQ/SQS instead (retention, replay, throughput, per-partition ordering)
- Diagrams: sequence diagram of a Streams consumer group (XADD → consumer1 reads → crashes → consumer2 XAUTOCLAIM → XACK); flowchart of the reliable list queue with a processing list.

### Rate limiting with Redis
`advance backend/theory/redis/Rate limiting with Redis.md` · 322 lines · real 107 · depth 3 · REWRITE
- Has: why a shared store, limit dimensions, fixed/sliding-log/sliding-counter/token/leaky algorithms, comparison table, Lua atomicity, headers, Express middleware.
- Problems: ~45% template.
  - The `INCR` + `EXPIRE` pattern (both snippets and course screenshot 20260909153519) is not atomic. A crash between the two calls leaves a key with no TTL, so the client is blocked forever. Fix: `EXPIRE key 60 NX` inside MULTI or a pipeline, `SET key 0 EX 60 NX` then `INCR`, or a Lua script.
  - `req.ip` behind a load balancer is the proxy's IP unless trust-proxy is configured, so all users would share one bucket.
  - Says "use Lua" but shows no Lua.
  - No fail-open/closed policy, no Redis Cluster hash-tag issue, no GCRA, no sliding-counter formula.
  - Node code. Misfiled: belongs in 11.
- Keep: algorithm sections, comparison table, decision flowchart, header block, multi-server diagram.
- New home: `11 System Design/Rate Limiting: Algorithms and Distributed Design`
- Must cover: where to limit (edge, gateway, service, per endpoint) and keys (IP, user, API key, tenant) · fixed window (atomic) and boundary burst · sliding log (ZSET, memory O(requests)) · sliding counter `prev × (1 − elapsed/window) + curr` · token bucket (capacity, refill, lazy refill on read) · leaky bucket (queue vs meter) · GCRA (redis-cell, throttled) · a full Lua script using Redis `TIME` · Redis Cluster hash tags so all keys share one slot · 429 + `Retry-After` + IETF `RateLimit` headers · fail-open vs fail-closed; local fallback limiter · hybrid local + global limits; quotas vs rate limits · real systems (Stripe, Cloudflare sliding counter, Envoy global rate-limit service) · Go (`x/time/rate` locally, go-redis + Lua distributed)
- Diagrams: flowchart LB → N API servers → Redis Lua → allow/429; sequence diagram of an atomic token-bucket check-and-consume; timeline flowchart of the fixed-window boundary burst (2× limit within 1 s).

### redis Content table
`advance backend/theory/redis/redis Content table.md` · 118 lines · real 53 · depth 1 · DELETE
- Has: link lists, study order, use-case diagram, course checklist, "Redis data choice" table.
- Problems: navigation-only. `[[cache]]` resolves to `bytes GO complete thimh/data structure/theory/cache.md` (memoization), which is the wrong context. Linear topic map.
- Keep: the "Redis data choice" table (use case → type) → `08 Caching & Redis/Redis Data Structures`.
- New home: `00 Home/08 Caching & Redis MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### redis setup
`advance backend/theory/redis/redis setup.md` · 229 lines · real 40 · depth 2 · REWRITE
- Has: nine course code screenshots under owner headings (OTP, JWT, rate-limit middleware, queues, BullMQ), local/Docker setup, production points.
- Problems:
  - The owner's content is almost entirely Node/Express code screenshots.
  - The rate-limiter frame has the non-atomic INCR/EXPIRE bug.
  - The OTP frame (20260909152730) generates the code with `Math.random()` (not a CSPRNG) and returns the OTP in the HTTP response, which defeats verification.
  - Mixes setup with four use cases.
- Keep: `docker run ... redis` + `redis-cli ping`, REDIS_URL, production points, and the use-case headings as the lab outline. Screenshots 20260908160048, 20260908160105, 20260908160606, 20260909152630, 20260909152730, 20260909152938, 20260909153519, 20260909154614 and 20260909160103 are third-party: transcribe, don't embed.
- New home: `08 Caching & Redis/Redis Hands-on Setup with Go`
- Must cover: Redis/Valkey in Docker with a named volume and password · redis-cli essentials (SET EX/NX, TTL, SCAN not KEYS, INFO, SLOWLOG, MONITOR caveat) · go-redis setup (pool size, dial/read timeouts, context) · config (`maxmemory`, `maxmemory-policy`, `appendonly`) · security (protected mode, ACL users, TLS, never expose 6379) · OTP flow in Go (`crypto/rand`, `SET otp:<id> <hash> EX 300 NX`, attempt counter, delete on success, never return the code) · health checks and degrading gracefully when Redis is down · managed options (ElastiCache/Valkey, Upstash)
- Diagrams: sequence diagram of OTP send/verify with TTL, attempt counter and rate limit.

### uses of redis
`advance backend/theory/redis/uses of redis.md` · 202 lines · real 32 · depth 2 · REWRITE
- Has: cache, sessions, rate limiting, queues, pub/sub, leaderboard (ZADD), one-line distributed lock; one course frame.
- Problems: ~72% template. Session key `session:userId` should be keyed by a random session ID (`session:<sid>`) with a `user_sessions:<uid>` set for logout-all. The lock is one line, with no SET NX PX, owner token or fencing. Overlaps what-is-redis.
- Keep: use-case list and leaderboard example. Screenshot 20260908160837 is third-party.
- New home: `08 Caching & Redis/Redis Use Cases`
- Must cover: cache · session store · OTP/verification codes · counters and rate limits (→ 11) · leaderboards (ZINCRBY, ZREVRANGE WITHSCORES, ZRANK) · unique counts (Set vs HyperLogLog: ~0.81% error, 12 KB) · bitmaps for daily-active flags · geo (GEOADD/GEOSEARCH for nearby drivers) · distributed locks (SET NX PX + token, Lua compare-and-delete, Redlock debate, fencing tokens → 10) · idempotency keys · pub/sub and streams (→ 09) · when not to use Redis (system of record without durability, large blobs, ad-hoc queries)
- Diagrams: flowchart use case → data structure → key pattern; sequence diagram of lock acquire / work / release with the token check (and the expiry-during-GC-pause hazard).

### what is redis
`advance backend/theory/redis/what is redis.md` · 178 lines · real 32 · depth 2 · REWRITE
- Has: owner "in-memory storage", course slides (definition + use cases, cache hit, cache miss), data-type list, Redis vs DB.
- Problems: ~71% template. Lists Pub/Sub as a data type (it is a messaging feature) and omits bitmaps, HyperLogLog and geo. "Why fast" omits the single-threaded executor, epoll multiplexing and compact encodings. `[[cache]]` link goes to the DS memoization note.
- Keep: data-type list; Redis vs DB bullets. Slides 20260908154907, 20260908154748 and 20260908154819 are third-party.
- New home: `08 Caching & Redis/Redis Fundamentals`
- Must cover: Redis as an in-memory data-structure server with optional persistence · why fast (RAM, single-threaded command execution without locks, epoll, listpack/intset encodings, I/O threads since 6.0; RTT dominates → pipelining) · type overview (strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geo, JSON) · keyspace, TTL, lazy + active expiry · atomicity (single commands, MULTI/EXEC/WATCH, Lua/Functions) · persistence and HA overview (→ links) · single-thread pitfalls (KEYS, big keys, long Lua block everyone) · Redis vs Memcached vs a DB · licensing and the Valkey fork (verify current status)
- Diagrams: flowchart of the event loop (clients → epoll → single executor → replies); mindmap-style flowchart of data types → typical uses.

### AWS CloudWatch
`advance backend/theory/aws/AWS CloudWatch.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence and an App → Logs/Metrics → Alarm flowchart.
- Problems: ~92% template; generic interview bank.
- Keep: nothing.
- New home: `13 DevOps & Cloud/AWS 10: CloudWatch`
- Must cover: metrics (namespaces, dimensions, resolution, custom metrics via EMF, cardinality cost) · logs (groups/streams, retention, awslogs/FireLens from ECS, Logs Insights queries) · alarms (thresholds vs anomaly detection, M-of-N datapoints, missing-data handling, composite alarms) → SNS/PagerDuty · dashboards · Container Insights · traces (X-Ray / Application Signals vs an OpenTelemetry collector) · cost traps (per-GB ingest, never-expiring retention) · CloudWatch vs Prometheus/Grafana/Datadog
- Diagrams: flowchart ECS task → awslogs/EMF → Logs/Metrics → alarm → SNS → on-call.

### AWS ElastiCache
`advance backend/theory/aws/AWS ElastiCache.md` · 158 lines · real 7 · depth 0 · MERGE→`08 Caching & Redis/Redis Replication, Sentinel and Cluster`
- Has: one sentence and an ECS → ElastiCache flowchart.
- Problems: ~93% template. The "failure mode" line is just a list of topics.
- Keep: nothing.
- New home: `08 Caching & Redis/Redis Replication, Sentinel and Cluster` (section "Managed: ElastiCache / Valkey")
- Must cover: cluster mode disabled (primary + replicas) vs enabled (shards over 16384 slots) · Multi-AZ automatic failover and primary/reader endpoints · ElastiCache Serverless · Valkey vs Redis OSS engines · encryption in transit/at rest, AUTH/RBAC · sizing (reserved memory for fork), parameter group eviction policy · snapshots · cluster-aware clients and retry on failover
- Diagrams: flowchart of a 3-shard cluster across AZs (primaries + replicas) with a cluster-aware Go client.

### AWS IAM
`advance backend/theory/aws/AWS IAM.md` · 160 lines · real 9 · depth 0 · REWRITE
- Has: one sentence and a Role → Policy → S3/ECR/Logs flowchart.
- Problems: ~91% template.
- Keep: nothing.
- New home: `13 DevOps & Cloud/AWS 02: IAM`
- Must cover: principals (root, users, roles, federated identities) · identity-based vs resource-based policies; JSON anatomy (Effect/Action/Resource/Condition) · evaluation logic (explicit deny > allow > implicit deny; SCPs, permission boundaries) · roles, STS AssumeRole, temporary credentials · workload identity (ECS task role vs task execution role, EC2 instance profile, IRSA/EKS Pod Identity) · GitHub Actions OIDC federation · least privilege and IAM Access Analyzer · MFA, no root usage · cross-account access · common mistakes (`"Action": "*"`, long-lived keys in code)
- Diagrams: sequence diagram ECS task → STS → temporary credentials → S3 call evaluated against identity + bucket policy; flowchart of the policy-evaluation logic.

### AWS RDS
`advance backend/theory/aws/AWS RDS.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence and a Backend → RDS → backup/replica flowchart.
- Problems: ~92% template. The "Failure mode" line lists features (read replicas, Multi-AZ, backups), not failures.
- Keep: nothing.
- New home: `13 DevOps & Cloud/AWS 08: RDS and Aurora`
- Must cover: managed vs self-hosted (patching, backups, failover) · Multi-AZ synchronous standby (HA, not reads) vs async read replicas (lag) vs Multi-AZ DB clusters with readable standbys · automated backups + PITR, snapshots · failover behavior (endpoint flip, typically 60–120 s; app reconnect/retry) · Aurora (shared storage, 6 copies across 3 AZs, reader endpoint, fast failover) · RDS Proxy and connection pooling · parameter groups, gp3/io2 storage, Performance Insights · security (private subnets, SGs, IAM DB auth, encryption) · blue/green deployments for major upgrades
- Diagrams: flowchart primary (AZ-a) + sync standby (AZ-b) + async read replicas, with writer/reader endpoints from the app.

### AWS S3
`advance backend/theory/aws/AWS S3.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence and a presigned-upload flowchart.
- Problems: ~92% template; overlaps File Upload Architecture.
- Keep: nothing.
- New home: `13 DevOps & Cloud/AWS 07: S3`
- Must cover: buckets/objects/keys (flat namespace, prefixes) · strong read-after-write consistency (since Dec 2020) · storage classes and lifecycle rules · 11-nines durability vs availability · security (Block Public Access, bucket policy vs IAM, Object Ownership/ACLs disabled, SSE-S3 vs SSE-KMS) · presigned URLs · multipart upload (and verify current max object size) · versioning, Object Lock, replication · event notifications → SQS/SNS/Lambda/EventBridge · request-rate guidance (3,500 writes / 5,500 reads per second per prefix) · static assets behind CloudFront with OAC · cost (requests, egress)
- Diagrams: flowchart client presigned PUT → S3 → event → SQS → worker → derivatives bucket → CloudFront.

### AWS Services Content Table
`advance backend/theory/aws/AWS Services Content Table.md` · 49 lines · real 19 · depth 0 · DELETE
- Has: link list and a linear topic map.
- Problems: navigation-only; covers only five services.
- Keep: nothing.
- New home: `00 Home/13 DevOps & Cloud MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### Domain DNS HTTPS SSL TLS
`advance backend/theory/aws/Domain DNS HTTPS SSL TLS.md` · 161 lines · real 10 · depth 0 · SPLIT
- Has: one sentence, a User → domain → DNS → LB → TLS → API flowchart, one failure-mode line.
- Problems: ~90% template; four topics in the title and none explained. "SSL" is obsolete (only TLS 1.2/1.3 should be used). Filed under aws though it is networking. `[[whtat DNS|DNS]]` points to a typo-titled bbg note.
- Keep: failure-mode line (wrong DNS TTL, expired certs, mixed content, TLS at the wrong layer).
- New home: `02 Networking & Web/TLS and HTTPS` (DNS part → `02 Networking & Web/DNS`; AWS part → `13 DevOps & Cloud/AWS 09: Route 53 and ACM`)
- Must cover: TLS 1.3 handshake (key share in ClientHello, 1-RTT; 0-RTT and its replay risk) vs TLS 1.2 (2-RTT) · certificates, chains, CAs, SAN/wildcard, DV/OV/EV · ACME/Let's Encrypt and ACM auto-renewal · SNI · termination at the LB vs re-encryption vs mTLS · HSTS, HTTP→HTTPS redirects, mixed content · ECDHE forward secrecy and cipher suites · OCSP stapling, Certificate Transparency · common outages (expired cert, missing intermediate, clock skew) · DNS cutover (A/AAAA/CNAME/ALIAS, lower TTL before migration)
- Diagrams: sequence diagram of the TLS 1.3 handshake; flowchart user → Route 53 → ALB (ACM cert, TLS terminates) → ECS.

### AWS Deployment
`advance backend/theory/cloud deployment/AWS Deployment.md` · 204 lines · real 51 · depth 2 · MERGE→`13 DevOps & Cloud/Deploying a Go API on AWS (Reference Architecture)`
- Has: AWS service glossary, code→ECR→ECS→ALB flow, reference diagram, deployment checklist, common deployment failures.
- Problems: ~61% template. No VPC/subnets/NAT/security-group detail and no ALB health-check settings. Overlaps Production Architecture and the cloud content table.
- Keep: reference diagram (Route 53 → ALB → ECS/Fargate → RDS/ElastiCache/S3/CloudWatch; GitHub Actions → ECR); checklist; failures list (wrong port, health-check path, SG blocks, ECR pull failure).
- New home: `13 DevOps & Cloud/Deploying a Go API on AWS (Reference Architecture)`
- Must cover: service glossary (EC2, ECS/Fargate, ECR, ALB, RDS, ElastiCache, S3, CloudWatch, IAM, Route 53, ACM) · deploy-failure troubleshooting table (symptom → cause → fix) · the rest is in the Production Architecture block
- Diagrams: in the merged note.

### CI CD Pipeline
`advance backend/theory/cloud deployment/CI CD Pipeline.md` · 221 lines · real 55 · depth 2 · REWRITE
- Has: CI vs CD definitions, PR→test→build→scan→ECR→ECS→health pipeline diagram, GitHub Actions snippet, pipeline rules.
- Problems: ~60% template.
  - "CI/CD means Continuous Integration and Continuous Deployment" is incomplete: CD means continuous *delivery* (always releasable, manual prod approval) or continuous *deployment* (automatic to prod), and the difference matters.
  - Lists `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` as pipeline secrets; use GitHub OIDC to assume an IAM role (no long-lived keys).
  - The YAML is Node (`npm ci`) and stops before push/deploy.
- Keep: complete-flow mermaid; rules (fail fast, SHA tags, careful migrations, rollback plan); common mistakes.
- New home: `13 DevOps & Cloud/CI-CD Pipelines (GitHub Actions for Go)`
- Must cover: CI vs continuous delivery vs continuous deployment · trunk-based development · Go stages (gofmt/vet/golangci-lint, `go test -race`, coverage, govulncheck, build) · Docker build with cache, Trivy scan, push by SHA · build once, promote the same digest across environments · environments, approvals, protection rules · OIDC → AWS role · deploy (render ECS task definition, wait for stability; or GitOps with Argo CD) · migrations as a separate expand/contract job · post-deploy smoke tests and alarm-based auto-rollback · dependency caching, matrix builds, flaky-test policy · DORA metrics
- Diagrams: flowchart of the full pipeline with gates (PR checks → merge → build/scan → staging → smoke → approval → prod canary → full).

### Cloud Deployment Content Table
`advance backend/theory/cloud deployment/Cloud Deployment Content Table.md` · 63 lines · real 33 · depth 1 · DELETE
- Has: link list, study order, big-picture diagram, deployment checklist, dev/staging/prod environments.
- Problems: navigation-only; duplicates the AWS Deployment diagram.
- Keep: deployment checklist and environments list → reference-architecture note.
- New home: `00 Home/13 DevOps & Cloud MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### ECR and ECS
`advance backend/theory/cloud deployment/ECR and ECS.md` · 199 lines · real 42 · depth 2 · REWRITE
- Has: ECR/ECS definitions, concept table incl. task role vs execution role, task-definition contents, push commands, SHA-tag tip.
- Problems: ~66% template.
  - `aws ecr get-login-password --region ap-south-1` alone does not log in. Pipe it into `docker login --username AWS --password-stdin <acct>.dkr.ecr.<region>.amazonaws.com`, otherwise the push fails.
  - The table row "Task | running container instance" is wrong: a task is a running copy of a task definition and can hold several containers (app + sidecars).
  - Missing: Fargate vs EC2 launch types, awsvpc networking, deployment circuit breaker, service auto scaling.
- Keep: concept table (fix the Task row), task execution role vs task role, task-definition contents, SHA-tag tip.
- New home: `13 DevOps & Cloud/AWS 05: ECS, Fargate and ECR`
- Must cover: ECR (repositories, immutable tags, lifecycle policies, scanning, pull-through cache) · cluster, task definition revisions, task, service, capacity providers · Fargate vs EC2 launch type · awsvpc networking, per-task SGs, private subnets + NAT or VPC endpoints for ECR pulls · task execution role vs task role · ALB integration (ip target groups, health checks, deregistration delay vs graceful shutdown) · rolling deploys (minimumHealthyPercent/maximumPercent), deployment circuit breaker with rollback, CodeDeploy blue/green · service auto scaling (target tracking on CPU or ALBRequestCountPerTarget) · secrets from Secrets Manager/SSM · logging (awslogs/FireLens) · ECS vs EKS vs Lambda
- Diagrams: flowchart of an ECS service in a VPC (ALB in public subnets → tasks in private subnets across 2 AZs → RDS; VPC endpoints to ECR); sequence diagram of a rolling deployment with health checks.

### Production Architecture
`advance backend/theory/cloud deployment/Production Architecture.md` · 216 lines · real 61 · depth 2 · REWRITE
- Has: main-parts list, two layered architecture diagrams, production checklist, NFR list, readiness checklist.
- Problems: ~57% template. Generic boxes: no VPC/AZ layout, no numbers, no failure scenarios.
- Keep: layered diagram; NFR and readiness checklists; the interview phrasing line.
- New home: `13 DevOps & Cloud/Deploying a Go API on AWS (Reference Architecture)` (absorbs AWS Deployment + Cloud Deployment Content Table)
- Must cover: end-to-end request path (Route 53 → CloudFront/WAF → ALB → ECS → RDS/ElastiCache/S3/SQS) · VPC over 2–3 AZs (public: ALB/NAT; private: app; isolated: DB) · security-group chain (ALB SG → app SG → DB SG) · config and secrets injection · health checks (ALB target health; liveness vs readiness) · scaling (service auto scaling, read replicas, cache) · observability (CloudWatch, OTel/X-Ray, alarms) · CI/CD and rollback · backups and DR (RPO/RTO, PITR, cross-region snapshots) · rough monthly cost (Fargate, the NAT gateway trap, RDS) · failure drills (AZ loss, DB failover, bad deploy) · dev/staging/prod parity
- Diagrams: flowchart reference architecture with VPC → AZ → subnet subgraphs; sequence diagram of a request during an RDS failover (errors → reconnect → recovery).

### Autoscaling
`advance backend/theory/deployment/Autoscaling.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence, a metrics → policy → add/remove flowchart, one failure-mode line.
- Problems: ~92% template.
- Keep: failure-mode line (cold starts, bad metric, DB bottleneck, cost explosion).
- New home: `13 DevOps & Cloud/Autoscaling`
- Must cover: horizontal vs vertical · target tracking vs step vs scheduled vs predictive · metric choice (CPU vs requests per target vs p95 latency vs queue depth/age; KEDA for workers) · Kubernetes HPA formula `desired = ceil(current × metric/target)`, VPA, Cluster Autoscaler/Karpenter · ECS service auto scaling and EC2 ASGs · warm-up, cooldown/stabilization windows, flapping · cold-start costs (image pull, cache warm-up, connection pools) · downstream limits (DB connections → RDS Proxy/pgbouncer; third-party quotas) · min/max bounds and cost guardrails · validating with load tests
- Diagrams: flowchart of the HPA control loop; sequence diagram of a spike: scale-out lag, queue build-up, recovery.

### Blue Green Deployment
`advance backend/theory/deployment/Blue Green Deployment.md` · 160 lines · real 9 · depth 0 · MERGE→`13 DevOps & Cloud/Deployment Strategies: Rolling, Blue-Green, Canary`
- Has: one sentence, an LB-switch flowchart, one failure-mode line.
- Problems: ~91% template.
- Keep: failure-mode line (DB compatibility, stale cache, DNS delay, double cost).
- New home: `13 DevOps & Cloud/Deployment Strategies: Rolling, Blue-Green, Canary`
- Must cover: blue-green mechanics (switch at LB/target group vs DNS and TTL lag) · pre-switch smoke tests · instant switch-back · shared-DB compatibility (expand/contract) · connection draining · double-capacity cost
- Diagrams: in the merged note.

### Canary Deployment
`advance backend/theory/deployment/Canary Deployment.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence, a 95/5 split flowchart, a 1→5→25→100% ramp line.
- Problems: ~92% template.
- Keep: ramp schedule.
- New home: `13 DevOps & Cloud/Deployment Strategies: Rolling, Blue-Green, Canary`
- Must cover: recreate vs rolling (maxSurge/maxUnavailable) vs blue-green vs canary vs shadow/dark launch · traffic-shifting mechanisms (ALB weighted target groups, Route 53 weighted records, mesh/Argo Rollouts, CodeDeploy) · canary analysis (canary vs baseline error rate, latency, business KPIs; automated promote/abort, e.g. Kayenta/Argo analysis) · sticky user cohorts vs per-request splitting · schema compatibility across N and N-1 · draining long-lived connections · capacity and cost per strategy · rollback speed per strategy · bake times between steps
- Diagrams: flowchart comparing strategies (subgraphs per strategy); timeline-style flowchart of a canary ramp with an analysis gate and abort path.

### Deployment Strategies Content Table
`advance backend/theory/deployment/Deployment Strategies Content Table.md` · 53 lines · real 20 · depth 0 · DELETE
- Has: link list and a linear topic map.
- Problems: navigation-only.
- Keep: nothing.
- New home: `00 Home/13 DevOps & Cloud MOC`
- Must cover: n/a (navigation)
- Diagrams: none.

### Docker Multi-stage Build
`advance backend/theory/deployment/Docker Multi-stage Build.md` · 164 lines · real 14 · depth 1 · MERGE→`13 DevOps & Cloud/Docker 04: Writing a Production Dockerfile for Go`
- Has: definition, build → artifact → runtime flowchart, Node two-stage Dockerfile.
- Problems: ~86% template. The runtime stage copies only `/app/dist` then runs `node dist/server.js`; any app with npm runtime dependencies crashes because node_modules is never copied. "Production example" is feature-flag boilerplate. The Go case (static binary → distroless/scratch) is absent.
- Keep: the flowchart idea.
- New home: `13 DevOps & Cloud/Docker 04: Writing a Production Dockerfile for Go` (multi-stage section)
- Must cover: `golang` build stage → `CGO_ENABLED=0 go build -trimpath -ldflags="-s -w"` → `distroless/static:nonroot` or `scratch` (+ CA certs, tzdata) · size comparison (hundreds of MB → ~10–20 MB) · named stages and `--target` (test/debug stages) · copy only artifacts · cache and secret mounts · multi-arch with buildx · debugging distroless (ephemeral debug containers)
- Diagrams: in the merged note.

### Feature Flags
`advance backend/theory/deployment/Feature Flags.md` · 156 lines · real 12 · depth 1 · REWRITE
- Has: definition, a request → flag service → new/old path flowchart, a flag + canary ramp example.
- Problems: ~88% template. The diagram implies a network call to a flag service per request; real SDKs evaluate locally from cached rules with streamed updates.
- Keep: the "deploy behind a flag, ramp, instantly disable" example.
- New home: `13 DevOps & Cloud/Feature Flags`
- Must cover: deploy vs release · flag types (release, experiment, ops kill switch, entitlement) · targeting (attributes, segments, percentage via `hash(flag+userID) % 100`) · evaluation architecture (server SDK, local rule cache, streaming updates; client-side flags) · safe defaults when the flag service is down · experiments and metrics · flag debt (owners, expiry, cleanup) · testing flag combinations · audit trail · tools (LaunchDarkly, Unleash, GrowthBook, OpenFeature) · Go sketch with the OpenFeature SDK
- Diagrams: sequence diagram of SDK init (fetch rules, subscribe) and per-request local evaluation; flowchart of percentage bucketing.

### Kubernetes Basics
`advance backend/theory/deployment/Kubernetes Basics.md` · 170 lines · real 20 · depth 1 · REWRITE
- Has: Deployment/Pod/Service/Ingress diagrams, must-know object list (ConfigMap, Secret, HPA, probes, rolling update).
- Problems: ~81% template. The diagrams draw Deployment → Pods directly; a Deployment manages ReplicaSets, which manage Pods. No control plane, no YAML. "Production example" is feature-flag boilerplate.
- Keep: the SDE-3 object list; the second diagram (fix it).
- New home: `13 DevOps & Cloud/Kubernetes Fundamentals`
- Must cover: why orchestration (scheduling, self-healing, scaling, discovery) · control plane (API server, etcd, scheduler, controller manager) and nodes (kubelet, kube-proxy, runtime) · desired state + reconciliation loops · Pod, ReplicaSet, Deployment (rollout, `rollout undo`), StatefulSet, DaemonSet, Job/CronJob · Services (ClusterIP/NodePort/LoadBalancer), cluster DNS, Ingress/Gateway API · ConfigMap and Secret (base64, not encrypted by default) · liveness vs readiness vs startup probes (and restart loops from bad liveness) · requests/limits, QoS, OOMKilled, CPU throttling · HPA · graceful termination (SIGTERM, preStop, grace period, endpoint-removal race) · namespaces and RBAC · minimal YAML for a Go API · EKS vs ECS
- Diagrams: flowchart control plane + worker nodes; sequence diagram `kubectl apply` → API server → etcd → scheduler → kubelet → pod ready → endpoints updated.

### Rollback Strategy
`advance backend/theory/deployment/Rollback Strategy.md` · 159 lines · real 8 · depth 0 · REWRITE
- Has: one sentence, an errors-high → rollback flowchart, one failure-mode line.
- Problems: ~92% template.
- Keep: failure-mode line (irreversible DB changes, stale clients, config drift).
- New home: `13 DevOps & Cloud/Rollback and Safe Migrations`
- Must cover: rollback vs roll-forward · what can be rolled back (code, config, flags, infra) and what cannot (sent emails, captured payments, dropped columns) · mechanisms (redeploy the previous digest, `kubectl rollout undo`, ECS circuit breaker, blue-green switch-back, kill-switch flag) · expand/contract migrations so N and N-1 both work · backward-compatible API and event changes · automatic rollback triggers (alarms, SLO burn rate) · data repair and replay · clients you cannot roll back (shipped mobile apps) · runbooks and rollback drills · versioned artifacts and config
- Diagrams: flowchart of expand → migrate/backfill → contract across three deploys; decision flowchart rollback vs roll-forward.

---

## Area plan: A (Api architecture, api design, auth security, docker, redis, aws, cloud deployment, deployment, basic Backend)

### New notes, ordered basic → advanced
**02 Networking & Web**
1. `02 Networking & Web/Forward Proxy vs Reverse Proxy` · I · from: Reverse Proxy vs Forward Proxy
2. `02 Networking & Web/CDN and Edge` · I · from: CDN, Global CDN and Edge (+ bbg `React Theory/CDN`)
3. `02 Networking & Web/TLS and HTTPS` · I · from: Domain DNS HTTPS SSL TLS (+ Go HTTPS HTTP2 TLS Server concepts); its DNS part feeds the bbg DNS note

**05 APIs**
1. `05 APIs/Choosing an API Style` · B · from: Api architecture cntent table
2. `05 APIs/REST and HTTP API Design` · B · from: REST API (+ bbg REST ×3; Go REST code → 06)
3. `05 APIs/API Contract Design and OpenAPI` · I · from: API Contract Design, API Design Content Table
4. `05 APIs/API Error Handling` · I · from: API Error Handling
5. `05 APIs/Pagination, Filtering and Sorting` · I · from: Pagination
6. `05 APIs/API Versioning and Backward Compatibility` · I · from: API Versioning
7. `05 APIs/Idempotency Keys and Safe Retries` · I · from: NEW here (source: `reliability/Idempotency`, `Go Webhooks Idempotency`, other reviewers)
8. `05 APIs/File Upload Architecture` · I · from: File Upload Architecture (+ Go File Uploads, AWS S3 presign part)
9. `05 APIs/Webhooks: Sending and Receiving` · I · from: Webhooks, Webhook Processing (+ Go Webhooks Idempotency)
10. `05 APIs/SOAP and WSDL (Legacy Integrations)` · B · from: SOAP
11. `05 APIs/GraphQL` · I · from: GRAPHQL (+ Go GraphQL Backend concepts)
12. `05 APIs/gRPC and Protocol Buffers` · I/A · from: GRPC (+ concept parts of the 10 Go gRPC/proto notes)
13. `05 APIs/Real-time APIs: WebSocket, SSE and Long Polling` · I/A · from: WEBSOCKET (+ reliability/WebSocket Scaling, Go WebSocket Realtime)
14. `05 APIs/API Gateway and BFF` · A · from: API Gateway

**06 Backend Engineering in Go**
1. `06 Backend Engineering in Go/Backend Request Lifecycle and Layering` · B · from: Basic backend content table
(Go code companions owned by other reviewers: `gRPC Services in Go`, `GraphQL Server in Go (gqlgen)`, `WebSocket Server in Go`. Each links back to its single 05 concept note.)

**08 Caching & Redis**
1. `08 Caching & Redis/Caching Fundamentals` · B · from: Caching Patterns and Types (locations) + bbg cache folder (other reviewer)
2. `08 Caching & Redis/Redis Fundamentals` · B · from: what is redis
3. `08 Caching & Redis/Redis Hands-on Setup with Go` · B · from: redis setup
4. `08 Caching & Redis/Caching Patterns` · I · from: Caching Patterns and Types, API Caching with Redis
5. `08 Caching & Redis/Cache Invalidation, TTL and Consistency` · I · from: Caching Patterns and Types
6. `08 Caching & Redis/Eviction Policies` · I · from: Caching Patterns and Types (+ LLD LRU Cache link)
7. `08 Caching & Redis/Redis Data Structures and When to Use Each` · I · from: what is redis, redis Content table (data-choice table), uses of redis
8. `08 Caching & Redis/Redis Use Cases` · I · from: uses of redis, redis setup headings
9. `08 Caching & Redis/Redis Persistence: RDB and AOF` · I · from: NEW
10. `08 Caching & Redis/Cache Failure Modes: Stampede, Avalanche, Penetration, Hot and Big Keys` · A · from: Caching Patterns and Types (stampede) + `performance/Cache Stampede Avalanche Penetration` (other reviewer)
11. `08 Caching & Redis/Redis Replication, Sentinel and Cluster` · A · from: NEW + AWS ElastiCache
12. `08 Caching & Redis/Redis in Production: Memory, Latency, Security` · A · from: NEW (+ redis setup production points)

Redis use-case notes that leave 08:
- Rate limiting → 11.
- Message queue → 09.
- Distributed lock → `10 Distributed Systems/Distributed Locks`.
- Session store → 12 Sessions.
- Pub/Sub fan-out → 05 Real-time APIs.

**09 Messaging & Async**
1. `09 Messaging & Async/Redis as a Queue: Lists, Streams and Pub-Sub` · I · from: Message Queue with Redis
2. `09 Messaging & Async/AWS SQS, SNS and EventBridge` · I · from: NEW

**11 System Design**
1. `11 System Design/Rate Limiting: Algorithms and Distributed Design` · I/A · from: Rate limiting with Redis (+ `LLD with Go/practice/Rate Limiter LLD in Go` concepts, API Abuse layering)

**12 Security & Auth**
1. `12 Security & Auth/Authentication vs Authorization` · B · from: Authentication vs Authorization
2. `12 Security & Auth/Password Storage and Login Security` · I · from: NEW
3. `12 Security & Auth/Sessions and Cookies` · I · from: Sessions and Cookies
4. `12 Security & Auth/JWT: Structure, Validation and Pitfalls` · I · from: JWT (+ Go Auth JWT Sessions concepts)
5. `12 Security & Auth/Access and Refresh Tokens` · I · from: Refresh Token and Access Token, Auth Security Content Table (checklist)
6. `12 Security & Auth/CORS and Same-Origin Policy` · I · from: CORS
7. `12 Security & Auth/CSRF, XSS and Security Headers` · I · from: NEW
8. `12 Security & Auth/OWASP API Security Top 10` · I · from: NEW
9. `12 Security & Auth/Secrets Management` · I · from: Secrets Management
10. `12 Security & Auth/OAuth 2.0 and OpenID Connect` · A · from: OAuth
11. `12 Security & Auth/Service-to-Service Auth: API Keys, HMAC, mTLS` · A · from: NEW
12. `12 Security & Auth/API Abuse and Bot Protection` · A · from: API Abuse and Bot Protection

**13 DevOps & Cloud**
Docker sequence (practical first, internals last):
1. `13 DevOps & Cloud/Docker 01: Why Containers` · B · from: DOCKER WHY
2. `13 DevOps & Cloud/Docker 02: Images, Layers and Containers` · B · from: Docker_Image_Container (+ layer part of how docker Works)
3. `13 DevOps & Cloud/Docker 03: CLI Essentials` · B · from: DOCKER_CODE
4. `13 DevOps & Cloud/Docker 04: Writing a Production Dockerfile for Go` · I · from: how to dockerize, Docker Multi-stage Build, Docker Content Table (checklist) (+ Go Deployment Docker)
5. `13 DevOps & Cloud/Docker 05: Networking and Port Publishing` · I · from: Docker Network, Porting mapping
6. `13 DevOps & Cloud/Docker 06: Volumes and Bind Mounts` · I · from: DOCKER Volums
7. `13 DevOps & Cloud/Docker 07: Docker Compose for Local Development` · I · from: docker comnpose
8. `13 DevOps & Cloud/Docker 08: How Docker Works Under the Hood` · A · from: how docker Works
9. `13 DevOps & Cloud/Docker 09: Container Security and Hardening` · A · from: Docker Security Basics

Delivery:

10. `13 DevOps & Cloud/CI-CD Pipelines (GitHub Actions for Go)` · I · from: CI CD Pipeline
11. `13 DevOps & Cloud/Deployment Strategies: Rolling, Blue-Green, Canary` · I · from: Canary Deployment, Blue Green Deployment
12. `13 DevOps & Cloud/Feature Flags` · I · from: Feature Flags
13. `13 DevOps & Cloud/Rollback and Safe Migrations` · I/A · from: Rollback Strategy
14. `13 DevOps & Cloud/Kubernetes Fundamentals` · I · from: Kubernetes Basics
15. `13 DevOps & Cloud/Autoscaling` · I/A · from: Autoscaling

AWS sequence:

16. `13 DevOps & Cloud/AWS 01: Core Concepts (Regions, AZs, Accounts, Shared Responsibility)` · B · from: NEW
17. `13 DevOps & Cloud/AWS 02: IAM` · B/I · from: AWS IAM
18. `13 DevOps & Cloud/AWS 03: VPC Networking` · I · from: NEW
19. `13 DevOps & Cloud/AWS 04: Compute Choices: EC2, ECS/Fargate, EKS, Lambda` · I · from: NEW (+ AWS Deployment glossary)
20. `13 DevOps & Cloud/AWS 05: ECS, Fargate and ECR` · I · from: ECR and ECS
21. `13 DevOps & Cloud/AWS 06: Load Balancing (ALB vs NLB)` · I · from: NEW
22. `13 DevOps & Cloud/AWS 07: S3` · B/I · from: AWS S3
23. `13 DevOps & Cloud/AWS 08: RDS and Aurora` · I · from: AWS RDS
24. `13 DevOps & Cloud/AWS 09: Route 53 and ACM` · B · from: Domain DNS HTTPS SSL TLS (AWS part)
25. `13 DevOps & Cloud/AWS 10: CloudWatch` · I · from: AWS CloudWatch
26. `13 DevOps & Cloud/Infrastructure as Code with Terraform` · I · from: NEW
27. `13 DevOps & Cloud/Deploying a Go API on AWS (Reference Architecture)` · A · from: Production Architecture, AWS Deployment, Cloud Deployment Content Table

Proposed change to the target architecture: 13 ends up with ~27 notes. Either add subfolders `13 DevOps & Cloud/{Docker, Delivery, Kubernetes, AWS}`, or keep it flat with the "Docker NN" / "AWS NN" prefixes used above.

### Gaps (topics missing entirely for complete coverage)
- **05 APIs:**
  - idempotency-key contract;
  - HTTP semantics in practice (ETag/If-Match concurrency, 202 long-running operations, bulk endpoints, content negotiation);
  - OpenAPI/codegen;
  - Problem Details;
  - BFF;
  - SSE and long polling;
  - gRPC-Web/Connect and gRPC-gateway transcoding;
  - GraphQL federation and query-cost limits;
  - API docs/SDKs and developer portals.
- **12 Security:**
  - password hashing (argon2id/bcrypt params) and credential-stuffing defense;
  - MFA (TOTP, WebAuthn/passkeys);
  - CSRF tokens; XSS + CSP/HSTS and other security headers;
  - OWASP API Top 10 (BOLA, BFLA, mass assignment, SSRF);
  - API keys and HMAC request signing;
  - mTLS/SPIFFE service identity;
  - RBAC/ABAC/ReBAC and policy engines;
  - multi-tenant isolation (Postgres RLS);
  - audit logging;
  - encryption at rest/in transit and KMS.
- **08 Caching/Redis:**
  - RDB/AOF persistence;
  - replication, Sentinel, Cluster (16384 slots, MOVED/ASK, hash tags);
  - transactions (MULTI/WATCH) and Lua/Functions; pipelining;
  - distributed locks + fencing;
  - big/hot keys and memory fragmentation;
  - cache penetration with Bloom filters;
  - two-level caching;
  - Valkey/licensing.
- **13 Docker:**
  - namespaces/cgroups/overlayfs internals;
  - registries, tags vs digests;
  - HEALTHCHECK and PID 1 signal handling;
  - BuildKit cache/secret mounts;
  - multi-arch builds;
  - rootless mode;
  - Go-specific Dockerfile.
- **13 Delivery/K8s:**
  - probes, requests/limits, graceful termination;
  - Helm/Kustomize;
  - GitOps (Argo CD);
  - service mesh;
  - artifact promotion;
  - DB migrations in CD (expand/contract);
  - DORA metrics;
  - IaC (Terraform state, plan/apply, modules).
- **AWS (missing core services):**
  - Regions/AZs/accounts (Organizations, SCPs);
  - VPC (subnets, route tables, IGW, NAT GW, SG vs NACL, VPC endpoints/PrivateLink);
  - EC2 (instance families, AMIs, ASGs, Spot);
  - ELB (ALB vs NLB, target groups, health checks);
  - Lambda (cold starts, concurrency, event sources, limits);
  - AWS API Gateway;
  - SQS/SNS/EventBridge/Kinesis;
  - DynamoDB (partition keys, GSIs, capacity modes);
  - CloudFront;
  - Route 53 routing policies + health checks;
  - ACM; KMS; Secrets Manager/SSM;
  - EKS;
  - CloudFormation/CDK;
  - Well-Architected pillars;
  - cost management (NAT and egress traps).
- **Missing worked example:** one end-to-end deploy of a Go API on AWS that ties 13 together.

### Delete list (with reason)
- `advance backend/theory/api design/API Design Content Table.md`: navigation only; salvage the 11-point checklist into Contract Design.
- `advance backend/theory/auth security/Auth Security Content Table.md`: navigation only; salvage the auth checklist + token-storage answer.
- `advance backend/theory/docker/Docker Content Table.md`: navigation only, duplicated link lists with typo/space links; salvage the production checklist.
- `advance backend/theory/redis/redis Content table.md`: navigation only; salvage the "Redis data choice" table.
- `advance backend/theory/aws/AWS Services Content Table.md`: navigation only, nothing to salvage.
- `advance backend/theory/cloud deployment/Cloud Deployment Content Table.md`: navigation only; salvage the deployment checklist.
- `advance backend/theory/deployment/Deployment Strategies Content Table.md`: navigation only, nothing to salvage.
- Notes that disappear after merging into their target: Api architecture cntent table, Global CDN and Edge, Webhook Processing, Docker Security Basics, Porting mapping, API Caching with Redis, AWS ElastiCache, AWS Deployment, Blue Green Deployment, Docker Multi-stage Build.
- Orphan images (embedded nowhere):
  - `Api architecture/img/Pasted image 20260907145143.png` (duplicate "Single Endpoint" GraphQL slide);
  - `Api architecture/img/Pasted image 20260907145701.png`;
  - `advance backend/img/Pasted image 20260908154735.png`;
  - `advance backend/img/Pasted image 20260909152603.png`.

### Cross-area overlaps found
- **REST:** `Api architecture/theory/REST API` ↔ bbg `REST/theory/{what is rest, use of rest, REST content table}` ↔ `golang backend/Go REST API Coding`. One concept note in 05; code in 06.
- **GraphQL:** GRAPHQL ↔ `Go GraphQL Backend`.
- **gRPC:** GRPC ↔ 10 Go notes (`Go gRPC Deep Dive`, `Services`, `Streaming Patterns`, `TLS Metadata Deadlines`, `Gateway REST Combo API`, `Testing Tools Postman grpcurl`, `Go Proto Versioning Best Practices`, `Go Protocol Buffers Deep Dive`, `Go Protobuf Validation`, `Go Protoc Code Generation`). Concepts and compatibility rules → 05; codegen, interceptors and testing → 06.
- **WebSocket:** WEBSOCKET ↔ `reliability/WebSocket Scaling` ↔ `Go WebSocket Realtime`.
- **Webhooks/idempotency:** Webhooks ↔ Webhook Processing ↔ `Go Webhooks Idempotency` ↔ `reliability/Idempotency`.
- **CDN:** CDN ↔ Global CDN and Edge ↔ bbg `React/React Theory/CDN`.
- **Proxy/LB/gateway:** Reverse Proxy vs Forward Proxy ↔ API Gateway ↔ `system design/Load Balancer`. Name clash with `LLD with Go/patterns/Proxy Pattern in Go` (different concept; keep links apart).
- **Uploads:** File Upload Architecture ↔ `Go File Uploads` ↔ AWS S3.
- **Auth:** JWT / Sessions and Cookies / Refresh Token ↔ `Go Auth JWT Sessions`.
- **TLS/DNS:** Domain DNS HTTPS SSL TLS ↔ `Go HTTPS HTTP2 TLS Server` ↔ bbg `DNS/theory/{whtat DNS, work_DNS, DNS CONTENT TABLE}`.
- **Docker:** docker folder (10) ↔ Docker Multi-stage Build ↔ Docker Security Basics ↔ `Go Deployment Docker` ↔ ECR and ECS (13 notes total).
- **Caching:** redis caching notes ↔ bbg `cache/theory/*` (4) ↔ bbg `data structure/theory/cache` ↔ `performance/Cache Stampede Avalanche Penetration` ↔ AWS ElastiCache ↔ `LLD with Go/practice/LRU Cache LLD in Go` (+ Excalidraw) ↔ `Go Redis Cache Queue Rate Limit`.
- **Rate limiting:** Rate limiting with Redis ↔ `LLD with Go/practice/Rate Limiter LLD in Go` (807 lines, 85% unique: the strongest rate-limiter material in the vault) ↔ `Excalidraw/LLD/Rate Limiter LLD Drawing` ↔ `Go Redis Cache Queue Rate Limit` ↔ API Abuse and Bot Protection.
- **Queues/jobs:** Message Queue with Redis ↔ `Go Worker Queues and Background Jobs` ↔ `reliability/{Background Jobs, Worker Architecture, Dead Letter Queue, Event Streaming}`.
- **Cloud:** cloud deployment folder ↔ bbg `cloud native/theory/*` (4).
- **Observability:** AWS CloudWatch ↔ `observability/{Logs Metrics Traces, Monitoring and Alerting}`.
- **Scaling:** Autoscaling ↔ `system design/Scaling Concepts`.
- **Contracts:** API Contract Design / API Versioning ↔ `testing strategy/Contract Testing`.

**Link and image hygiene** (wrong-context auto-links):
- `GRPC`: `[[REST API|http]]` (HTTP ≠ REST)
- `WEBSOCKET`: `[[REST API|HTTP]]`
- `DOCKER WHY`: `[[Database Replication|Replication]]` (the owner means environment reproducibility)
- `how docker Works`: `[[API Caching with Redis|caching]]` (Docker layer cache)
- `DOCKER Volums`: `[[Backup and Restore|backup]]`
- `DOCKER_CODE`: `[[Logs Metrics Traces|logs]]` (`docker logs`)
- `what is redis`, `API Caching with Redis`, `redis Content table`: `[[cache]]` → data-structure memoization note
- "AWS" → `[[AWS Deployment|AWS]]` and "Docker" → `[[Docker Content Table|Docker]]` in ~15 notes (navigation noise)

Misplaced image: REST API embeds the GraphQL "Over fetching" slide (20260907145002).

### Factual errors found (quote → correction)
1. GRAPHQL (owner): "fronted directly call the data base so there is one connection of data base and the frontend" → the client calls a GraphQL server; resolvers query DBs/services; the client never touches the DB.
2. GRPC (owner): "the http is handled by client library so here if the browser is not upto date then it is a issue" → the slide means gRPC ships one maintained client library per language and hides HTTP/2. Browsers can't speak native gRPC (need gRPC-Web/Connect via a proxy); that is unrelated to being "out of date".
3. GRPC (owner): server streaming example "youtube" → video uses HLS/DASH over HTTP; use a price ticker or log tail.
4. SOAP: "SOAP has built-in standards for security, transactions, and reliability" → those are separate WS-* specs (WS-Security, WS-AtomicTransaction, WS-ReliableMessaging).
5. CDN: "`max-age`: browser freshness lifetime" → applies to all caches, CDNs included; `s-maxage` overrides it for shared caches.
6. CORS: `Access-Control-Allow-Origin: *` with credentials framed as a risky config → browsers reject it outright; the real vulnerability is reflecting any Origin with `Access-Control-Allow-Credentials: true`.
7. File Upload Architecture: "presigned URL with size/type restrictions" → presigned PUT pins exact signed headers only; size ranges need a presigned POST policy (`content-length-range`).
8. Webhooks diagram: provider → API → "Update payment status" in the request → verify, persist/enqueue, ack 2xx, process asynchronously (as the note's own text says).
9. OAuth diagram: "Provider-->>App: Authorization code" → the code comes back via a browser redirect to the redirect URI (front channel); only the token exchange is back channel.
10. DOCKER_CODE (owner): "docker run node just install the node image. it do not start the container" → `docker run` pulls if needed, then creates and starts a container; node exits at once without `-it`. `docker pull` only downloads.
11. DOCKER_CODE (owner): "to show all container - docker ps" → `docker ps -a`; `docker ps` lists running only.
12. DOCKER_CODE (owner): "docker exec -it (name of the container)unbandtu (commnad)" → `docker exec -it <container> <command>`, e.g. `docker exec -it web sh`.
13. Porting mapping (owner): "mapping of the container port to the port of the container" → host port → container port (`-p HOST:CONTAINER`).
14. DOCKER Volums (owner): bind mount means "if the docker is deleted or stopped we have a backup" → a bind mount is a live shared host folder, not a backup.
15. how to dockerize: step "Expose app port" as what makes the app reachable → EXPOSE is metadata; `-p` publishes.
16. Docker Multi-stage Build: runtime stage copies only `dist` then `node dist/server.js` → crashes without node_modules; copy production deps or bundle.
17. docker comnpose: `depends_on: redis` used as if it waits for Redis → start order only; add a healthcheck + `condition: service_healthy`.
18. API Caching with Redis: "Write through | Write cache and DB together | Strong consistency" → only fresher reads; dual writes can diverge.
19. Rate limiting with Redis (+ screenshot 20260909153519): `INCR` then `EXPIRE` when count == 1 → not atomic; a crash leaves a TTL-less key (permanent block). Use `EXPIRE key 60 NX` in MULTI, `SET key 0 EX 60 NX` + `INCR`, or Lua.
20. Rate limiting with Redis: keying on `req.ip` behind a load balancer → every client shares the proxy IP unless trust-proxy/XFF parsing is configured.
21. redis setup screenshot 20260909152730 (OTP): `Math.random()` OTP and `res.json({ otp })` → use a CSPRNG, deliver only via email/SMS, store hashed with attempt limits.
22. what is redis: "Pub/Sub" listed among Redis data types → it is a messaging feature; the missing types are bitmaps, HyperLogLog, geo.
23. Message Queue with Redis: LPUSH/BRPOP "good for simple queues" → loses jobs if the worker dies after the pop; use BLMOVE + processing list, or Streams.
24. Message Queue with Redis: Pub/Sub "Job stored? Usually no" → Redis Pub/Sub never stores; Kafka/Cloud Pub/Sub do.
25. uses of redis: session key `session:userId` → `session:<random id>` (+ `user_sessions:<uid>` set); one user has many sessions.
26. CI CD Pipeline: "CI/CD means Continuous Integration and Continuous Deployment" → CD = continuous delivery or continuous deployment (manual vs automatic prod release).
27. CI CD Pipeline: `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` as pipeline secrets → GitHub OIDC → IAM role, no long-lived keys.
28. ECR and ECS: `aws ecr get-login-password --region ap-south-1` as the login step → pipe it into `docker login --username AWS --password-stdin <acct>.dkr.ecr.<region>.amazonaws.com`.
29. ECR and ECS: "Task | running container instance" → a task is a running copy of a task definition and may hold several containers.
30. Kubernetes Basics diagrams: Deployment → Pod → Deployment → ReplicaSet → Pods.
31. Feature Flags diagram: request → feature-flag service per request → SDKs evaluate locally from cached, streamed rules.
32. AWS RDS: "Failure mode: read replicas, Multi-AZ, backups, parameter tuning..." → those are features, not failure modes.
33. Domain DNS HTTPS SSL TLS: "SSL" → SSL is deprecated/broken; only TLS 1.2/1.3.
34. Wrong-topic generator text:
    - Pagination, Webhooks and Webhook Processing carry a "create-payment API" production example.
    - Refresh Token and Access Token carries a BOLA order example.
    - Docker Multi-stage Build and Kubernetes Basics carry the feature-flag canary example.
    - The auth notes' interview banks ask about secret rotation regardless of topic.

### Owner content worth preserving
- Owner's own text (short, often garbled; keep the idea and rewrite it):
  - REST: path vs query vs body; "filter instead of deep nesting".
  - GraphQL: over/under-fetching as the reason it exists.
  - gRPC: the four modes with upload/chat/gaming examples.
  - WebSocket: "server pushes without a request; connection stays open".
  - SOAP: "XML".
  - DOCKER WHY: the 2024-project dependency-drift story.
  - Image/container: "one image → many containers".
  - Compose: `docker compose up/down`.
  - Volumes: bind vs named distinction (corrected).
  - Redis lab: the use-case outline (OTP, JWT auth, rate-limit middleware, BullMQ queue).
- InvoiceOps example in Caching Patterns and Types: Gin API + Postgres, `dashboard:{workspace_id}:summary:v2`, 30 s TTL + jitter, invalidate on payment. This is the owner's project; use it as the running example through 08 and in the 06 capstone.
- High-quality generated content to carry over almost verbatim:
  - CDN: Cache-Control, cache key, invalidation, failure modes, metrics.
  - File Upload state machine and failure/security lists.
  - Rate limiting comparison table + decision flowchart.
  - CORS edge cases.
  - API Gateway "keep thin" + gateway vs LB.
  - ECS task role vs execution role.
  - Webhook Processing dedupe/ordering answers.
  - Caching Patterns key-design and consistency tables.
- Screenshots: all 45 are third-party course frames, of which 41 are embedded and 4 orphaned:
  - Api architecture/img (11): REST blackboard video; Net Ninja GraphQL; Hussein Nasser gRPC.
  - advance backend/img (34): Hindi Docker/Redis course; ByteByteGo API gateway.
  - Keep them as private references at most. For a vault meant to be shared, redraw the useful ones as mermaid (API-gateway pipeline, docker run flow, Docker component table, cache hit/miss, gRPC modes) and transcribe code frames to text.
