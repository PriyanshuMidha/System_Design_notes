---
tags: [apis, api-design, openapi, contracts]
level: intermediate
status: reviewed
prereqs: ["[[REST and HTTP API Design]]", "[[Choosing an API Style]]"]
related: ["[[API Error Handling]]", "[[API Versioning and Backward Compatibility]]", "[[Idempotency and Idempotency Keys]]", "[[Pagination, Filtering and Sorting]]", "[[OpenAPI-First Development in Go]]", "[[Protocol Buffers and Schema Evolution]]", "[[Request Decoding, Validation and DTOs]]"]
sources:
  - "OpenAPI Specification 3.1.0 (2021) and 3.0.3"
  - "JSON Schema Draft 2020-12; RFC 3339 (date-time format)"
  - "RFC 9457, Problem Details for HTTP APIs"
  - "IETF draft-ietf-httpapi-idempotency-key-header"
  - "Stripe API docs: idempotent requests (keys up to 255 characters); stripe/openapi repository"
  - "GitHub, github/rest-api-description repository (OpenAPI description of the REST API)"
  - "ISO 4217 currency codes and minor units"
  - "Fowler, TolerantReader (martinfowler.com bliki, 2011); Hyrum's Law (hyrumslaw.com)"
  - "Google API Improvement Proposals (aip.dev) and api-linter; Zalando RESTful API Guidelines (rule 112: open-ended enums via examples, x-extensible-enum before October 2025; snake_case); Microsoft REST API Guidelines"
  - "oapi-codegen v2.8.2 README (OpenAPI 3.0 and 3.1 support, strict server)"
  - "Tool docs: Spectral, oasdiff, Pact, Schemathesis, kin-openapi, ogen, swaggo/swag, openapi-generator"
  - "MDN Web Docs, Number.MAX_SAFE_INTEGER"
updated: 2026-11-13
---

# API Contract Design and OpenAPI

> [!summary] TL;DR
> An **API contract** is the written promise of what an API accepts and returns: URLs, fields, types, limits, errors and headers. **OpenAPI** is the standard file format for writing that promise for HTTP APIs, so machines can lint it, diff it, generate code from it and test against it.
>
> Design the contract first, evolve it only by additive changes, and let CI reject anything that would break existing clients.

> [!abstract] Core idea
> - The **contract** is the written promise of what the API accepts and returns; OpenAPI is the machine-readable file for it.
> - Write the contract first, review it like code, and generate docs, clients and tests from it.
> - Evolve only by adding: new optional fields and endpoints are safe; removing, renaming or retyping is breaking.
> - Clients are tolerant readers (ignore unknown fields); servers are strict about requests.
> - Classic mistake: treating required, optional and nullable as the same thing.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works) and 4 (worked example).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[REST and HTTP API Design]]: an HTTP API is a set of URLs and methods (`GET /orders/42`) that take and return JSON, with status codes like `200` and `404`.
> - [[Choosing an API Style]]: REST, gRPC and GraphQL are different ways to shape an API; this note is mostly about REST.

**From zero, in 60 seconds** 🟢

Two teams build one product. One team builds the server, the other builds the app that talks to it.

The app has to know exactly what to send and what comes back. That written agreement is the **contract**: a list of every URL, every field, every rule.

```mermaid
flowchart LR
    A["App team"] -- "both read the same promise" --> C["Contract<br/>(openapi.yaml)"]
    B["Server team"] --> C
```

**OpenAPI** is just the standard file format for writing that contract down, so tools can read it too. From that one file you can generate docs, client code and tests.

The golden rule: you may **add** to the contract, but never remove or rename, because old apps out in the world still use the old names.

```mermaid
flowchart LR
    S["Contract v1"] -- "add a new optional field: safe" --> OK["Old apps keep working"]
    S -- "rename or remove a field: breaking" --> X["Old apps crash"]
```

That is the whole idea. The rest of this note is just three questions:
1. How do you write the promise down (OpenAPI)?
2. How do you change it without breaking anyone?
3. How do machines check it for you (lint, diff, tests)?

**The problem in one story.**
Your team builds a movie-booking server; another team builds the phone app.
They need to know exactly what to send and what comes back, field by field.
If you quietly rename `price` to `amount`, every installed app breaks overnight.
A contract is the written promise both sides agree on before anyone writes code.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| API | A way for one program to ask another program for something | App calls `POST /bookings` |
| Endpoint | One URL plus method the API answers | `GET /shows/42` |
| Request / response | What the client sends / what the server sends back | JSON body in, JSON body out |
| Schema | A description of the shape of some data | `price` is an integer, required |
| JSON | A text format for data with keys and values | `{"seat": "A7"}` |
| OpenAPI | A standard YAML/JSON file format that describes an HTTP API | `openapi.yaml` listing all endpoints |
| Breaking change | A change that makes an existing client fail | Removing a field the app reads |
| Code generation | Tools that write client or server code from the spec | A Go client built from `openapi.yaml` |
| CI | Automatic checks that run on every code change before it merges | "build fails if a field was removed" |
| Lint | An automatic style and mistake check over a file | "every string has a max length" |
| Enum | A field that may hold only values from a fixed list | `status: CONFIRMED` |
| Nullable | A field that may be present with the value `null` | `"note": null` |
| Drift | The spec says one thing while the server does another | spec says `total`, server sends `amount` |
| Tolerant reader | A client that ignores fields it does not know | an old app skipping `loyalty_points` |

**Picture it**

```mermaid
flowchart LR
    S["Contract<br/>(openapi.yaml)"] --> D["Docs"]
    S --> C["Client code"]
    S --> V["Server request<br/>validation"]
    S --> T["Tests and<br/>breaking-change checks"]
    C --> API["Running API"]
    V --> API
```

**Analogy.** A contract is like a restaurant menu: it lists what you can order and what arrives on the plate, before the kitchen cooks anything.
Where it breaks: a menu can change any day, but an API contract can only safely grow, because old clients keep ordering from the old menu.

**How the rest of this note builds up**

- First, why contracts exist (section 1) and the mental model of a promise between teams (section 2).
- Then how it works: contract-first vs code-first, OpenAPI anatomy, required vs optional vs nullable, and what counts as breaking (section 3).
- Then a worked Go example validated against a real spec (section 4), with variants and trade-offs (sections 5-6).
- Finally the SDE-3 view: production linting and breaking-change CI, OpenAPI 3.0 vs 3.1, and interview traps (sections 7-9).

> [!tip] Remember
> Write the promise first, generate everything from it, and only ever add to it.

## 1. Why it exists 🟢

A mobile app shows an order's total from `order.total`. A backend developer renames it to `order.total_amount` because it reads better. The change passes code review and every server test.

App store releases are slow and users update late, so suppose 30% of users still run the old app a month later (an estimate; measure your own version spread). For that 30%, the order screen now shows nothing or crashes, and the server logs show only `200 OK`.

Nothing told the developer that `total` was a promise to clients they cannot redeploy.

### Real-life example: a payment gateway's API 🟢

Payment gateways like Razorpay or Stripe publish one API that thousands of shops call: Swiggy, small online stores, ticket sites.
They cannot ask every shop to update their code on the same day, so they publish an exact written contract of every request and response.
New features arrive as new optional fields; old fields keep working for years.
Many of their client libraries (SDKs) are generated from that contract, so the docs, the libraries and the server all agree.

A contract makes the promise explicit and checkable:

- the field list, types and limits are written down in one file;
- a CI step compares the new file with the last released one and fails on `total` disappearing;
- client **SDKs** (ready-made libraries for calling the API), server **stubs** (empty handler shells to fill in), docs and tests are generated from the same file, so they cannot quietly disagree.

## 2. Mental model 🟢

A contract is an **electrical socket standard**. The plug maker and the socket maker never meet; both build to the published shape. You can add a new socket type (additive), but you cannot move the pins of the old one (breaking) while millions of plugs are in use.

OpenAPI is the **technical drawing** of the socket: precise enough that a machine can check a plug against it.

## Common beginner mistakes 🟢

- **Renaming a response field because the new name reads better** → every installed app that reads the old name breaks → add the new field, keep the old one, deprecate it, remove it much later.
- **Leaving strings and arrays without limits** → someone sends a 20 MB "note" → write `maxLength`, `maxItems` and a body size limit.
- **Treating "missing" and `null` as the same** → a partial update wipes fields the client never touched → model absent, `null` and set as three states.
- **Sending money as a float like `450.10`** → sums drift by tiny amounts → send integer minor units (`45010` paise) plus a currency code.
- **Using a closed enum in responses** → adding one new status crashes old clients → document response enums as open and handle "unknown".

## Often confused 🟡

| These two | First one | Second one |
| --- | --- | --- |
| OpenAPI vs Swagger | The standard spec format (3.x) | The older name (2.0) and a family of tools (Swagger UI) |
| Optional vs nullable | The key may be missing | The key is there but its value is `null` |
| Contract-first vs code-first | Write the spec, then generate code | Write the code, then generate the spec |
| Schema validation vs contract tests | Checks one response has the right shape | Checks real call sequences behave as promised |

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that a contract is a written promise between teams and that it may only grow. **Next we open the box**: two ways to produce the contract, what an OpenAPI file contains, house rules for names, money and dates, the three "maybe there" states, and exactly which changes break clients.

### Contract-first vs code-first

**In plain words:** you can write the promise first and build code from it, or build code first and print the promise from it. Either works, as long as a machine keeps the two in sync.

**Step by step:**
1. **Contract-first:** a developer writes `POST /orders` in `openapi.yaml` and opens a pull request.
2. The app team reviews the shape before any server code exists, and starts building against it.
3. A generator turns the file into a Go interface; the server handler must match it or it will not compile.
4. **Code-first:** a developer writes the Go handler first, and a tool prints `openapi.yaml` from it.
5. Either way, CI checks that the file and the code still match and that nothing breaking slipped in.

| Approach | How | Strength | Weakness |
| --- | --- | --- | --- |
| **Contract-first** (spec-first) | Write `openapi.yaml`, review it, then generate server interfaces and clients from it | Clients can start before the server exists; the spec is reviewed as a design | Needs a generator that fits your stack; spec authoring takes practice |
| **Code-first** | Write handlers, then produce the spec from annotations or types | Fast for one team; no separate file to keep in sync by hand | The design is reviewed only as code; the spec reflects whatever the code happened to do |

Either way, the danger is **drift**: the spec says one thing and the server does another. Contract-first prevents drift by generating the server interface from the spec, so a handler that returns the wrong type does not compile. Code-first prevents it by regenerating the spec in CI and failing if the committed file differs.

```mermaid
flowchart LR
    A["Edit openapi.yaml in a pull request"] --> B["CI: Spectral lint, style rules"]
    B --> C["CI: oasdiff against the released spec"]
    C -- "breaking change" --> X["Fail the build or require a new major version"]
    C -- "additive only" --> D["Generate server interfaces and client SDKs"]
    D --> E["Contract tests: Schemathesis against the server, Pact for known consumers"]
    E --> F["Publish docs: Swagger UI, Redoc or Scalar"]
    F --> G["Release, and tag the spec as the new baseline"]
```

### OpenAPI 3.1 anatomy

**In plain words:** an OpenAPI file is like a form with fixed sections: who the API is, its URLs, the shapes of data it moves, and how you log in. Skim the bullets, then the big example.

**Step by step:**
1. The top says `openapi: 3.1.0` and gives the API a title and version.
2. Under `paths`, `/orders` has a `post` entry: what body it takes and what each status code returns.
3. The body says "see `#/components/schemas/CreateOrderRequest`" instead of repeating the shape.
4. Under `components`, `CreateOrderRequest` lists `show_id` and `seats`, with types and limits.
5. Under `security`, it says every call needs a bearer token, except operations that opt out.

An OpenAPI document has a few top-level parts:

- `openapi`, `info`, `servers`: the version of the format, the API's own version, and base URLs.
- `paths`: each URL and method, with `parameters` (path, query, header, cookie), `requestBody` and `responses` by status code.
- `components`: reusable `schemas`, `parameters`, `responses`, `securitySchemes`, referenced with `$ref` (a pointer meaning "use the definition over there").
- `security`: which scheme applies, globally or per operation. An operation can override it, for example `security: []` for a public health check.
- `webhooks` (new in 3.1): requests your API sends to subscribers (HTTP calls your server makes to their server when something happens).

A complete contract for `POST /orders`:

```yaml
openapi: 3.1.0
info:
  title: Orders API
  version: 1.4.0
servers:
  - url: https://api.example.com/v1
security:
  - bearerAuth: []
paths:
  /orders:
    post:
      operationId: createOrder
      summary: Book seats for a show
      tags: [orders]
      parameters:
        - $ref: "#/components/parameters/IdempotencyKey"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateOrderRequest"
            examples:
              twoSeats:
                value:
                  show_id: shw_9f2c
                  seats: [A7, A8]
      responses:
        "201":
          description: Order created. Retries with the same Idempotency-Key replay this response.
          headers:
            Location:
              description: URL of the new order
              schema:
                type: string
                format: uri-reference
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"
        "400":
          $ref: "#/components/responses/Problem"
        "401":
          $ref: "#/components/responses/Problem"
        "409":
          $ref: "#/components/responses/Problem"
        "422":
          $ref: "#/components/responses/Problem"
        "429":
          $ref: "#/components/responses/Problem"
  /health:
    get:
      operationId: health
      security: []
      responses:
        "204":
          description: The service is up
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  parameters:
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: true
      description: >
        Client-generated unique key, for example a UUID. The server stores the
        first response for 24 hours and replays it for retries with the same key.
        Reusing a key with a different body returns 422; a retry while the first
        request is still running returns 409.
      schema:
        type: string
        minLength: 8
        maxLength: 255
  responses:
    Problem:
      description: Error as RFC 9457 problem details
      content:
        application/problem+json:
          schema:
            $ref: "#/components/schemas/Problem"
  schemas:
    CreateOrderRequest:
      type: object
      additionalProperties: false
      required: [show_id, seats]
      properties:
        show_id:
          type: string
          maxLength: 64
        seats:
          type: array
          minItems: 1
          maxItems: 10
          uniqueItems: true
          items:
            type: string
            pattern: "^[A-Z][0-9]{1,2}$"
        coupon_code:
          type: string
          maxLength: 32
        note:
          type: [string, "null"]
          maxLength: 500
    Order:
      type: object
      required: [id, status, seats, total, created_at]
      properties:
        id:
          type: string
          examples: [ord_81f2]
        status:
          $ref: "#/components/schemas/OrderStatus"
        seats:
          type: array
          items:
            type: string
        total:
          $ref: "#/components/schemas/Money"
        note:
          type: [string, "null"]
        created_at:
          type: string
          format: date-time
          examples: ["2026-11-02T08:15:00Z"]
    OrderStatus:
      type: string
      description: >
        Open set. New values may be added without a new API version;
        clients must treat values they do not know as "unknown".
      examples: [PENDING_PAYMENT, CONFIRMED, CANCELLED]
    Money:
      type: object
      required: [amount_minor, currency]
      properties:
        amount_minor:
          type: integer
          format: int64
          minimum: 0
          description: Amount in the currency's minor unit (paise for INR, cents for USD).
          examples: [45000]
        currency:
          type: string
          pattern: "^[A-Z]{3}$"
          description: ISO 4217 currency code
          examples: [INR]
    Problem:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri-reference
        title:
          type: string
        status:
          type: integer
        detail:
          type: string
        instance:
          type: string
          format: uri-reference
        code:
          type: string
          description: Stable machine-readable error code, for example SEAT_TAKEN
```

Points the example makes on purpose:

- **Every limit is written down**: `maxLength`, `maxItems: 10`, `pattern`. Unbounded strings and arrays are how a client sends a 50 MB body or a value longer than your database column.
- **`additionalProperties: false` on the request** rejects typos such as `seat` instead of `seats` (but see the rollout trap in the deep dive).
- **Errors are one shared response**, `application/problem+json` (a standard JSON error format with `type`, `title`, `status` and `detail`), so every endpoint fails the same way (see [[API Error Handling]]).
- **The `Idempotency-Key` header is part of the contract** (a unique key per request so a retry is not processed twice): required, bounded, with retention and reuse rules spelled out (see [[Idempotency and Idempotency Keys]]).
- **`OrderStatus` is documented as an open set** instead of a closed `enum`, so a new status is not a breaking change.

```mermaid
classDiagram
    class CreateOrderRequest {
        +string show_id
        +List~string~ seats
        +string coupon_code
        +nullable string note
    }
    class Order {
        +string id
        +OrderStatus status
        +List~string~ seats
        +Money total
        +nullable string note
        +datetime created_at
    }
    class Money {
        +int64 amount_minor
        +string currency
    }
    class OrderStatus {
        <<enumeration>>
        PENDING_PAYMENT
        CONFIRMED
        CANCELLED
        any future value
    }
    class Problem {
        +string type
        +string title
        +int status
        +string detail
        +string code
    }
    CreateOrderRequest ..> Order : createOrder returns
    CreateOrderRequest ..> Problem : or fails with
    Order *-- Money : total
    Order --> OrderStatus : status
```

### Conventions that prevent client bugs

**In plain words:** these are house rules for naming, dates, money and IDs. Pick one style and never mix, the same way a kitchen keeps all labels in one language.

**Step by step:**
1. Pick one casing, say `snake_case`, so every field looks like `show_id`, never `showId`.
2. Write times as `2026-11-02T08:15:00Z`: a standard text format, always in UTC.
3. Write ₹450.00 as `{"amount_minor": 45000, "currency": "INR"}`: whole paise plus the currency code.
4. Send IDs as strings like `"9007199254740993"`, because JavaScript rounds very big numbers.
5. Return lists in pages with a maximum size, never "all rows at once".

| Topic | Rule | Why |
| --- | --- | --- |
| Field casing | One style everywhere: `snake_case` (Stripe, Zalando) or `lowerCamelCase` (Google, Microsoft) | Mixed casing guarantees typos in clients |
| Times | RFC 3339 (the internet standard for date-time text) strings in UTC: `2026-11-02T08:15:00Z` (`format: date-time`) | Unambiguous, sortable, parsed by every language |
| Money | Integer **minor units** (the smallest coin: paise, cents) plus an ISO 4217 code (the three-letter currency code like INR): `{"amount_minor": 45000, "currency": "INR"}` | Floats cannot represent `0.10` exactly; minor-unit digits differ (JPY has 0, INR 2, KWD 3) |
| IDs | Strings, even when the database uses integers | JavaScript loses precision above 2^53 − 1; strings let you change ID schemes later |
| Enums | `UPPER_SNAKE` strings, documented as open in responses | Numbers are unreadable; closed enums make additions breaking |
| Optional fields | Absent means "not set"; do not send `""` or `0` as "no value" | Empty values are real values to clients |
| Collections | Always paged, with a documented maximum `limit` | One unbounded list can take the service down (see [[Pagination, Filtering and Sorting]]) |

### Required, optional and nullable are three different things

**In plain words:** "must be there", "may be missing" and "may be there but empty (null)" are three different promises, like a form field that is mandatory, optional, or allowed to say "none".

**Step by step:**
1. An order has a `note`. The client sends a partial update.
2. Body `{}`: `note` is absent, so the server leaves the note as it was.
3. Body `{"note": null}`: `note` is present and null, so the server clears it.
4. Body `{"note": "aisle seat"}`: the server sets it.
5. If the server's code cannot tell step 2 from step 3, it wipes notes nobody asked to change.

```mermaid
flowchart LR
    B["update body"] --> A["note absent → keep"]
    B --> N["note: null → clear"]
    B --> V["note: 'aisle' → set"]
```

- **Required**: the key must be present (`required: [show_id, seats]`).
- **Optional**: the key may be absent.
- **Nullable**: the key may be present with the value `null`. OpenAPI 3.0 wrote this as `nullable: true`; OpenAPI 3.1 uses JSON Schema's `type: [string, "null"]`.

The difference matters most in partial updates. With JSON Merge Patch (a standard where you send only the fields you want changed), an absent `note` means "leave it", `"note": null` means "clear it" and `"note": "aisle"` means "set it". A server that cannot tell absent from `null` will wipe fields the client never mentioned.

### What counts as a breaking change

**In plain words:** breaking means some app that worked yesterday fails today. Which changes break depends on direction: rules for what clients *send* can only loosen safely, rules for what servers *return* can only grow safely.

**Step by step:**
1. You make `coupon_code` **required** in requests. Old apps never send it, so they now get `400`: breaking.
2. You raise `seats` max from 10 to 20 in requests. Old apps still send 10 or fewer: safe.
3. You add `loyalty_points` to responses. Old apps ignore it: safe.
4. You remove `total` from responses. Old apps read it and get nothing: breaking.
5. You add status `ON_HOLD`. Old apps that only know three statuses may crash: breaking unless they handle "unknown".

```mermaid
flowchart TB
    R["Requests (client sends)"] -- "add a required field / tighten rules" --> B1["breaks"]
    R -- "loosen rules / new optional field" --> S1["safe"]
    P["Responses (server returns)"] -- "remove field / surprise enum value" --> B2["breaks"]
    P -- "add a new field (tolerant readers)" --> S2["safe"]
```

A change is breaking if **any existing, correctly written client** can fail or misbehave. The full classification table lives in [[API Versioning and Backward Compatibility]].

The one contract-specific point to remember is that direction matters: adding a required field or tightening validation breaks requests but not responses.

By contrast, making a required field optional or adding an enum value breaks responses (clients assume the field is there or switch exhaustively) but not requests.

The safe path for a rename: add `total_amount`, keep sending `total`, mark `total` as `deprecated: true` in the spec, watch until no client reads it, then remove it in the next major version (see [[API Versioning and Backward Compatibility]]).

**Tolerant reader.** Clients should read only the fields they need, ignore fields they do not know, and map unknown enum values to an "unknown" case. Servers can then add things freely. This is the half of the **robustness principle** ("be strict in what you send, liberal in what you accept") that works well; being liberal in what a server *accepts* is riskier, because sloppy input becomes behaviour clients then depend on.

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** the code below shows the one habit in both directions: as a client, shrug at fields you do not know; as a server, reject fields you do not know.

Tolerant on responses, strict on requests. The full version below adds the production concerns.

```go
package contract

import (
	"bytes"
	"encoding/json"
)

type Order struct {
	ID     string  `json:"id"`
	Status string  `json:"status"` // open enum: keep unknown values
	Note   *string `json:"note"`   // nil = absent or null
}

// Client side: tolerant reader. Unknown fields are ignored by default.
func DecodeResponse(b []byte) (Order, error) {
	var o Order
	err := json.Unmarshal(b, &o)
	return o, err
}

// Server side: strict about requests. Unknown fields are a 400.
func DecodeRequest(b []byte) (Order, error) {
	d := json.NewDecoder(bytes.NewReader(b))
	d.DisallowUnknownFields()
	var o Order
	err := d.Decode(&o)
	return o, err
}
```

### Full version

**In plain words:** a real Go client that proves three rules: unknown stuff never crashes it, typos in requests get rejected, and "missing", "null" and "set" are kept apart.

A Go 1.24 client for the `Order` schema above, written as a tolerant reader. It shows three contract rules in code: unknown fields and enum values do not break decoding, the server can still be strict about requests, and absent, `null` and set are three different states. It passes `go vet` and `go test -race`.

```go
package orderclient

import (
	"encoding/json"
	"time"
)

// OrderStatus is an open enum: a newer server may send values this client
// has never seen, so unknown values decode to StatusUnknown instead of failing.
type OrderStatus string

const (
	StatusPendingPayment OrderStatus = "PENDING_PAYMENT"
	StatusConfirmed      OrderStatus = "CONFIRMED"
	StatusCancelled      OrderStatus = "CANCELLED"
	StatusUnknown        OrderStatus = "UNKNOWN"
)

func (s *OrderStatus) UnmarshalText(b []byte) error {
	switch v := OrderStatus(b); v {
	case StatusPendingPayment, StatusConfirmed, StatusCancelled:
		*s = v
	default:
		*s = StatusUnknown // tolerant reader: render "unknown", do not crash
	}
	return nil
}

// Money is an integer amount in the currency's minor unit plus an ISO 4217 code.
// 45000 with "INR" means 450.00 rupees. Never a float.
type Money struct {
	AmountMinor int64  `json:"amount_minor"`
	Currency    string `json:"currency"`
}

// Order is the client's view of the Order schema. encoding/json ignores
// fields it does not know, which is what a tolerant reader wants.
type Order struct {
	ID        string      `json:"id"`
	Status    OrderStatus `json:"status"`
	Seats     []string    `json:"seats"`
	Total     Money       `json:"total"`
	CreatedAt time.Time   `json:"created_at"` // RFC 3339, e.g. 2026-11-02T08:15:00Z
}

// Field tells apart the three states a JSON property can be in.
// A *string cannot: absent and null both leave it nil.
type Field[T any] struct {
	Present bool // the key appeared in the body
	Null    bool // the key appeared with the value null
	Value   T
}

func (f *Field[T]) UnmarshalJSON(b []byte) error {
	f.Present = true
	if string(b) == "null" {
		f.Null = true
		return nil
	}
	return json.Unmarshal(b, &f.Value)
}

// OrderPatch is a JSON Merge Patch body: absent = keep, null = clear, value = set.
type OrderPatch struct {
	Note Field[string] `json:"note"`
}
```

```go
package orderclient

import (
	"bytes"
	"encoding/json"
	"testing"
)

// A newer server added a status and a field. An old client must keep working.
func TestTolerantReader(t *testing.T) {
	body := []byte(`{
		"id": "ord_81f2",
		"status": "ON_HOLD",
		"seats": ["A7", "A8"],
		"total": {"amount_minor": 45000, "currency": "INR"},
		"created_at": "2026-11-02T08:15:00Z",
		"loyalty_points": 120
	}`)
	var o Order
	if err := json.Unmarshal(body, &o); err != nil {
		t.Fatalf("old client broke on a newer response: %v", err)
	}
	if o.Status != StatusUnknown {
		t.Fatalf("status = %q, want UNKNOWN", o.Status)
	}
	if o.Total.AmountMinor != 45000 || o.CreatedAt.Hour() != 8 {
		t.Fatalf("known fields lost: %+v", o)
	}
}

// Servers can be strict about requests instead: a typo is rejected, not ignored.
func TestStrictRequestDecoding(t *testing.T) {
	type CreateOrderRequest struct {
		ShowID string   `json:"show_id"`
		Seats  []string `json:"seats"`
	}
	dec := json.NewDecoder(bytes.NewReader([]byte(`{"show_id": "shw_9f2c", "seat": ["A7"]}`)))
	dec.DisallowUnknownFields() // matches additionalProperties: false in the spec
	var req CreateOrderRequest
	if err := dec.Decode(&req); err == nil {
		t.Fatal(`typo "seat" was silently ignored`)
	}
}

func TestAbsentNullAndValueAreDifferent(t *testing.T) {
	cases := []struct {
		body          string
		present, null bool
		value         string
	}{
		{`{}`, false, false, ""},
		{`{"note": null}`, true, true, ""},
		{`{"note": "aisle seat"}`, true, false, "aisle seat"},
	}
	for _, c := range cases {
		var p OrderPatch
		if err := json.Unmarshal([]byte(c.body), &p); err != nil {
			t.Fatal(err)
		}
		if p.Note.Present != c.present || p.Note.Null != c.null || p.Note.Value != c.value {
			t.Errorf("%s: got %+v", c.body, p.Note)
		}
	}

	// The same bodies through a pointer: absent and null look identical.
	var a, b struct {
		Note *string `json:"note"`
	}
	_ = json.Unmarshal([]byte(`{}`), &a)
	_ = json.Unmarshal([]byte(`{"note": null}`), &b)
	if a.Note != nil || b.Note != nil {
		t.Fatal("expected both pointers to be nil")
	}
}

func TestMoneyAsMinorUnits(t *testing.T) {
	var asFloat float64
	var asMinor int64
	for i := 0; i < 10; i++ {
		asFloat += 0.10 // ten payments of 0.10
		asMinor += 10   // ten payments of 10 paise
	}
	if asFloat == 1.0 {
		t.Fatal("float64 summed exactly; expected binary rounding error")
	}
	if asMinor != 100 {
		t.Fatalf("minor units = %d, want 100", asMinor)
	}
}
```

Result (measured with `go test -race -count=1`, Go 1.24.4, 2026-11-02): all 4 tests pass. The response from the "newer server", with status `ON_HOLD` and an extra `loyalty_points` field, decodes without error.

A `*string` field cannot tell `{}` from `{"note": null}`; `Field[string]` can. Ten float64 additions of `0.10` do not equal `1.0`, while ten additions of 10 minor units equal exactly 100.

**Spec check (measured, 2026-11-02).** The YAML contract above was fed to oapi-codegen v2.8.2 (built from source with `go run`) with models, a strict `net/http` server and a client enabled. Generation succeeded and the generated package passes `go vet` on Go 1.24.4.

For the nullable `note` field it generated `Note *string` by default, which has exactly the absent-or-null ambiguity the test shows. Since v2.1.0, the `nullable-type: true` output option generates `nullable.Nullable[string]` instead.

## 5. Variants and comparison 🟡

**Tools along the contract pipeline:**

| Stage | Tool | What it does |
| --- | --- | --- |
| Lint and style | Spectral | Rules over the spec: naming, every operation has an `operationId`, every 4xx uses problem details, limits are present |
| Breaking-change diff | oasdiff | Compares the released spec with the new one: `oasdiff breaking base.yaml new.yaml --fail-on ERR` |
| Go server and client | oapi-codegen, ogen | Types, a server interface (oapi-codegen's strict server for `net/http`, chi, echo and others) and a typed client |
| Runtime validation | kin-openapi `openapi3filter` | Middleware that validates requests and responses against the spec |
| Code-first in Go | swaggo/swag | Builds a spec from comment annotations; its v1 releases emit Swagger 2.0, not OpenAPI 3 |
| SDKs in other languages | openapi-generator | Client libraries for dozens of languages from one spec |
| Contract tests | Schemathesis | Generates many valid and edge-case requests from the spec and checks the server's responses match it |
| Consumer-driven contracts | Pact | Each consumer records the requests and fields it relies on; the provider's CI replays them |
| Docs | Swagger UI, Redoc, Scalar | Render the spec as browsable documentation |

Go-specific setup (generation config, strict handlers, validation middleware) is in [[OpenAPI-First Development in Go]].

**Contract formats by API style:**

| Style | Contract | Evolution rule |
| --- | --- | --- |
| REST | OpenAPI (3.0 or 3.1) | Additive changes; tolerant readers |
| Events and async APIs | AsyncAPI, or JSON Schema per event | Same rules; consumers may lag days behind |
| gRPC | `.proto` files | Never reuse field numbers; see [[Protocol Buffers and Schema Evolution]] |
| GraphQL | SDL schema | Add fields, deprecate with `@deprecated`, never remove quickly; see [[GraphQL]] |
| SOAP | WSDL + XSD | Usually frozen; a change means a new WSDL |

**Style guides worth copying:** Google's API Improvement Proposals (AIPs, enforced on `.proto` files by `api-linter`), the Zalando RESTful API Guidelines and the Microsoft REST API Guidelines. Pick one as the base and write down only your exceptions.

## 6. Trade-offs and when not to use 🟡

- **Contract-first costs speed early.** For a prototype or an internal endpoint with one caller in the same repository, writing the spec first may be ceremony. Generate the spec from code and add the CI diff once a second consumer appears.
- **Generated code shapes your codebase.** Generators decide type names, optional-field representation (pointers or wrapper types) and routing. Keep generated types at the edge and map them to domain types, or the spec's shape leaks into business logic.
- **Strict request validation blocks safe rollouts.** `additionalProperties: false` rejects a new optional field sent by a newer client to an older server instance during a deploy.
- **Pact needs known consumers.** It works for internal services that can publish their expectations. A public API cannot collect pacts from strangers, so it relies on the spec diff instead.
- **A spec cannot capture everything.** Ordering, latency, rate limits and side effects are part of the real contract but are only prose in OpenAPI (Hyrum's law: every observable behaviour will be depended on by someone).

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how to write, evolve and check a contract. **Next is the advanced part**: how Stripe, GitHub and Google publish theirs, the failures that slip past teams, OpenAPI 3.0 vs 3.1, rollout traps, big integers and polymorphic types.

- **Real systems:**
	- **Stripe** publishes the OpenAPI description of its API in the `stripe/openapi` repository, including an SDK variant of the spec with annotations for generating client libraries. Files in its official SDKs, such as stripe-go, carry the header "File generated from our OpenAPI spec".
	- **GitHub** publishes the OpenAPI description of its REST API in `github/rest-api-description`.
	- **Google** defines APIs in `.proto` files that follow the AIPs and enforces them with `api-linter`.
- **Failure modes → fixes:**
	- Spec and server drift apart → generate the server interface from the spec, or regenerate the spec in CI and fail on any diff.
	- A field rename ships and old apps break → oasdiff in CI against the last released spec, with breaking changes blocked unless the major version changes.
	- A new enum value crashes an old client → document response enums as open from day one and test clients with unknown values. Zalando's guidelines (rule 112) list the known values under `examples` (OpenAPI 3.1) with an "Extensible enum" description prefix; until October 2025 they recommended the `x-extensible-enum` extension, which remains the fallback for OpenAPI 3.0 specs.
	- Missing limits let a client send a 20 MB description field → add `maxLength`, `maxItems` and a body size limit in the server (`http.MaxBytesReader` in Go), and a lint rule that every string has a `maxLength`.
	- Examples in the docs do not validate against the schema → lint examples in CI; Spectral can check them.
- **What to monitor:**
	- Requests rejected by contract validation, per field and per client version.
	- Calls to `deprecated` operations and reads of deprecated fields, per client.
	- Responses that fail schema validation in staging (a response validator in tests catches server-side drift).

## 8. Deep dive 🔴

- **OpenAPI 3.0 vs 3.1.** 3.1 adopts JSON Schema Draft 2020-12 completely, while 3.0 used a modified subset. In practice: `nullable: true` becomes `type: [T, "null"]`, schema `example` becomes `examples` (a list), `exclusiveMinimum` takes a number instead of a boolean, `$ref` may sit beside `summary` and `description`, `paths` became optional, and `webhooks` is new.

  Check generator support before moving: oapi-codegen v2.8.2's README states support for 3.0 and 3.1 (3.1 support is recent), and older releases needed a 3.1 spec downgraded to 3.0.
- **The `additionalProperties: false` rollout trap.** During a **rolling deploy** (servers are updated a few at a time, not all at once), new and old server instances serve traffic together. A new client that sends a new optional field to an old instance gets a `400`. Options: deploy the server before any client uses the field (usual), or let servers ignore unknown request fields and only lint for typos in client tests.
- **Large integers.** JSON numbers have no size limit, but JavaScript parses them as doubles, exact only up to 2^53 − 1 (9,007,199,254,740,991). A 64-bit ID such as a Snowflake ID (Twitter's time-based 64-bit ID scheme) loses its last digits in a browser. Send IDs, and `int64` amounts that might grow that large, as strings.
- **Polymorphism.** (One field that can hold one of several shapes.) `oneOf` with a `discriminator` (a field like `"type"` that says which shape it is: `"type": "card"` vs `"type": "upi"`) models payment methods. Generators handle it unevenly, and adding a new variant is a breaking change for clients that switch exhaustively. Treat the variant list like an open enum.
- **Contract tests vs schema validation.** Schema validation proves a response has the right shape. It does not prove `POST /orders` then `GET /orders/{id}` returns the same order. Schemathesis can chain operations using OpenAPI links; Pact tests the exact interactions consumers use.
- **The Idempotency-Key contract in detail.** Document scope (per API key or account), retention (Stripe: removable after 24 hours), the reuse error (`422` for a different body in the IETF draft), the in-flight error (`409`) and which operations accept it. Without these, clients cannot write correct retry logic.

## 9. Interview questions 🔴

> [!question]- What belongs in an API contract?
> Who calls it and with what auth; the method, URL, headers, query parameters and body; success response shapes; one error shape with stable codes; pagination, filtering and sorting rules and their limits; idempotency behaviour for creates and payments; rate limits; the versioning and deprecation policy; and request IDs for tracing.

> [!question]- Trap: is adding a field to a response a breaking change? Adding an enum value?
> Adding a response field is safe if clients are tolerant readers; it breaks clients that validate strictly or use `DisallowUnknownFields`-style decoding. Adding an enum value to a response breaks any client that switches exhaustively or validates against a closed `enum`. So document response enums as open and test clients with unknown values.

> [!question]- Contract-first or code-first?
> Contract-first when several teams or external clients consume the API: the design gets reviewed before code, clients start in parallel, and generated interfaces prevent drift. Code-first for a fast-moving internal API with one consumer, as long as CI regenerates the spec and diffs it against the last release.

> [!question]- Why send money as integer minor units with a currency code?
> Binary floats cannot represent `0.10` exactly, so sums drift (ten additions of `0.10` do not equal `1.0` in float64). Integers in minor units are exact. The currency code is required because the number of minor digits differs: JPY has 0, INR and USD have 2, KWD has 3.

> [!question]- How do you stop breaking changes from reaching production?
> Keep the released spec as a baseline, run oasdiff on every pull request and fail on breaking changes unless the major version changes. Add contract tests: Schemathesis against the server for the spec, Pact for known internal consumers. Watch deprecated-field usage before removing anything.

> [!question]- Required, optional and nullable: why does the difference matter?
> They are three separate promises. Required means the key is always present; optional means it may be absent; nullable means it may be present as `null`. In a merge-patch update, absent means "keep" and `null` means "clear". A Go `*string` cannot tell those apart, so use a wrapper type that records whether the key appeared.

> [!question]- A partner says your API "broke" but the spec did not change. What could it be?
> A behaviour the spec did not capture: default sort order, page size, a stricter validation rule, a new error code, slower responses, or a field that is now sometimes missing. That is Hyrum's law. Fix it by writing these behaviours into the contract (ordering, limits, error codes) and diffing them too.

## 10. Cheat sheet 🟢

- The contract is the promise; OpenAPI is the machine-checkable file that records it.
- Contract-first for shared APIs; either way, CI must catch drift and breaking changes (Spectral + oasdiff).
- Write every limit: string lengths, array sizes, page size, body size.
- RFC 3339 UTC times, integer minor-unit money with ISO 4217 code, string IDs, one casing style.
- Required ≠ optional ≠ nullable; 3.1 writes nullable as `type: [T, "null"]`.
- Requests and responses evolve differently: new required input breaks, new response fields do not.
- Clients are tolerant readers: ignore unknown fields, map unknown enum values to "unknown".
- One error schema (problem details) and an explicit `Idempotency-Key` contract for every create.

## Self-check 🟢🟡

> [!question]- Easy: what is an API contract?
> The written promise of what an API accepts and returns: URLs, fields, types, limits, errors.

> [!question]- Easy: is adding a new optional field to a response usually safe?
> Yes, as long as clients ignore fields they do not know (tolerant readers).

> [!question]- Easy: how should ₹450.00 be sent?
> As integer minor units plus a currency: `{"amount_minor": 45000, "currency": "INR"}`.

> [!question]- Medium: is adding a required field to a request breaking? To a response?
> To a request, yes: old clients do not send it. To a response, no: it only adds data.

> [!question]- Medium: what is the safe way to rename `total` to `total_amount`?
> Add `total_amount`, keep sending `total` marked deprecated, watch usage drop to zero, then remove it in a new major version.

> [!question]- Medium: what does oasdiff do in CI?
> It compares the new spec with the last released one and fails the build on breaking changes.

## Links 🟢

- **Before this:** [[REST and HTTP API Design]], [[Choosing an API Style]]
- **Next:** [[API Error Handling]], [[API Versioning and Backward Compatibility]], [[Idempotency and Idempotency Keys]], [[OpenAPI-First Development in Go]]
- **Compare with:** [[Protocol Buffers and Schema Evolution]] (the same evolution rules for `.proto`), [[GraphQL]] (SDL schema as the contract)

### Watch on YouTube

- [28. OpenAPI: The universal contract between clients and servers](https://www.youtube.com/watch?v=CwKsU84jIWs) · Sriniously · Explains OpenAPI as the machine-readable contract, matching the note's framing
