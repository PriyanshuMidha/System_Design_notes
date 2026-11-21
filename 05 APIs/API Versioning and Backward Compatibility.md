---
tags: [apis, versioning, compatibility, rest]
level: intermediate
status: reviewed
prereqs: ["[[REST and HTTP API Design]]", "[[API Contract Design and OpenAPI]]"]
related: ["[[Protocol Buffers and Schema Evolution]]", "[[GraphQL]]", "[[Zero-Downtime Schema Migrations]]", "[[Event Schemas and Schema Registry]]", "[[Webhooks - Sending and Receiving]]", "[[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]"]
sources:
  - "RFC 9745, The Deprecation HTTP Response Header Field (March 2025)"
  - "RFC 8594, The Sunset HTTP Header Field"
  - "RFC 9110, HTTP Semantics (410 Gone; 426 Upgrade Required must carry an Upgrade header)"
  - "RFC 6648, Deprecating the X- Prefix"
  - "Brandur Leach, APIs as infrastructure: future-proofing Stripe with versioning (Stripe blog, 2017)"
  - "Stripe API reference, Versioning (account pinning, Stripe-Version header)"
  - "GitHub REST API docs, API versions (X-GitHub-Api-Version, at least 24 months of support for the previous version)"
  - "Microsoft Azure REST API guidelines (api-version query parameter)"
  - "Google AIP-185, API Versioning"
  - "Semantic Versioning 2.0.0 (semver.org)"
  - "Protocol Buffers docs, Updating a Message Type"
updated: 2026-11-13
---

# API Versioning and Backward Compatibility

> [!summary] TL;DR
> **Backward compatibility** means a client written last year still works after today's deploy. Most changes can be made compatibly (add a field, add an endpoint).
>
> A **breaking change** (remove, rename or retype a field, change a meaning) needs a new **API version** that old clients do not see until they opt in, plus a planned way to retire the old version.

> [!abstract] Core idea
> - Most changes can be backward compatible: add fields and endpoints, never remove or change meaning.
> - A **breaking change** needs a new version that old clients do not see until they opt in.
> - Serve every version from one core: build the latest response, then walk it back for older clients.
> - Retire old versions on a published schedule with `Deprecation` and `Sunset` headers.
> - Classic mistake: copying the whole codebase per version, so every fix must be made N times.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works) and 4 (worked example).
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[REST and HTTP API Design]]: clients call URLs with methods and headers and get JSON back with a status code.
> - [[API Contract Design and OpenAPI]]: the API's fields and types are a written promise; adding is safe, removing or renaming is breaking.

**From zero, in 60 seconds** 🟢

Millions of phones run last year's copy of your app. You cannot update them. But your server changes every week.

So the rule is: changes that only **add** things are safe. Old apps simply ignore what they do not know.

```mermaid
flowchart LR
    C["Change"] --> Q{"Old apps still work?"}
    Q -- "add a field: yes" --> OK["Ship to everyone"]
    Q -- "rename / remove: no" --> V["Needs a new version"]
```

When you must break something, you give the API a new **version**: a label like `v2` or a date. Old apps keep asking for the old version and keep getting the old shape. New apps opt into the new one.

Old versions do not live forever. You announce a **sunset** (a published shut-off date), warn everyone, then turn the old version off.

```mermaid
flowchart LR
    A["v1 live"] --> B["v2 ships,<br/>v1 marked deprecated"] --> D["warnings + emails"] --> E["v1 turned off<br/>(410 Gone)"]
```

The rest of this note is just four questions:
1. Which changes break old clients and which do not?
2. Where does the version label live (URL, header, date)?
3. How do you serve many versions without copying the codebase?
4. How do you retire an old version politely?


**The problem in one story.**
Last year your app shipped reading `status: "paid"` from the payments API.
Today a developer renames it to `state` because it reads better.
Millions of phones still run last year's app, and their payment screen now crashes.
Versioning is how you change an API without breaking the clients you cannot update.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Client | Any program calling your API | An app installed on a phone |
| Backward compatible | Old clients keep working after a change | Adding a new optional field |
| Breaking change | A change that makes old clients fail | Renaming `status` to `state` |
| Version | A label saying which API behaviour a client wants | `/v2/charges` or a date `2025-03-01` |
| Header | Extra key-value info sent with an HTTP request | `Api-Version: 2025-03-01` |
| Deprecation | Announcing that something will be removed later | `Deprecation` response header |
| Sunset | The date an old version stops working | `Sunset: Sat, 01 Mar 2026 00:00:00 GMT` |
| Tolerant reader | A client that ignores fields it does not know | an old app skipping a new `currency` field |
| Enum | A field that may only hold values from a fixed list | `status: succeeded` |
| SDK | A ready-made library that calls the API for you | `stripe-go` |
| Account pin | The server remembers which version each customer uses | an account created in 2024 stays on 2024's shape |
| Transformer | A small step that turns the newest response into an older version's shape | `amount` object → old integer |
| Brownout | Turning an old version off for a short, announced window as a warning | `v1` fails for 1 hour on a Tuesday |

**Picture it**

```mermaid
flowchart LR
    CH["Planned change"] --> Q{"Can old clients<br/>still work?"}
    Q -- "yes" --> SHIP["Ship it to everyone"]
    Q -- "no" --> NV["New version"]
    NV --> CORE["One core builds<br/>latest response"]
    CORE --> OLD["Transform back<br/>for old clients"]
    OLD --> RET["Retire old version<br/>on a schedule"]
```

**Analogy.** It is like a power socket standard: new appliances can add features, but the plug shape stays the same so old appliances still fit.
Where it breaks: you can never force people to buy new appliances, but an API can eventually sunset an old version after enough warning.

**How the rest of this note builds up**

- First, why compatibility matters (section 1) and the mental model of "add, never change" (section 2).
- Then the four steps: classify the change, choose where the version lives, serve old versions from one core, retire on a schedule (section 3).
- Then a full Go example with date-based versions and transformers (section 4), variants and trade-offs (sections 5-6).
- Finally the SDE-3 deep dive: never-updating mobile apps, Protobuf rules, semver for SDKs, and how many versions to support (sections 7-9).

> [!tip] Remember
> Add freely, never change meaning, and give breaking changes a new version with a published end date for the old one.

## 1. Why it exists 🟢

Your payments API returns `"amount": 49900` (an integer, in paise). The mobile app parses it straight into an `Int`. The backend team decides amounts should carry their currency and ships:

```json
{"amount": {"value": 49900, "currency": "inr"}}
```

Every installed copy of the app now fails to decode the payment screen. You can ship a fixed app, but you cannot make users install it: app versions linger on phones for months (an estimate of a typical tail; measure your own with an app-version header).

Partners who integrated through your SDK broke the same day, and their deploy calendar is not yours.

### Real-life example: "Please update the app" 🟢

Apps like WhatsApp or BookMyShow sometimes show "This version is no longer supported, please update".
That screen exists because the server still has to talk to very old copies of the app for months.
Most server changes are additive, so old apps keep working without noticing.
When a change truly cannot work with an old app, the server either keeps an old version of the API alive, or tells apps below a minimum version to update.

Versioning lets the server keep changing while each client sees the contract it was written against, until that client chooses to move.

## 2. Mental model 🟢

An API is a contract with many signatories you cannot call into a room. Two rules follow:

- **Add, never change.** New fields, new endpoints and new optional inputs are safe because a well-behaved client ignores what it does not know (the "tolerant reader").
- **Breaking changes get a new contract number.** Old signatories keep the old terms until they sign the new one, and you give notice before you stop honouring the old terms.

Analogy: one power grid, many plug shapes. You do not build a second grid for travellers with old plugs; you hand them an **adapter**. In the best designs the server has one core implementation (the grid) and a thin adapter per old version (the version transformers).

## Common beginner mistakes 🟢

- **Renaming a field "because it reads better"** → every old app reading the old name breaks → add the new field and keep the old one until its version is retired.
- **Changing what a number means** (paise → rupees) **without a version** → nothing crashes, but every amount is 100 times wrong → treat meaning changes as breaking.
- **Copying the whole codebase for `v2`** → every bug fix must be made twice → one core plus small per-version transformers.
- **Turning an old version off with no warning** → partners find out from an outage → announce, send `Deprecation` and `Sunset` headers, run brownouts, then return `410`.
- **Assuming users update their apps** → many never do → keep a minimum supported version and a tiny frozen "must update?" endpoint.

## Often confused 🟡

| These two | First one | Second one |
| --- | --- | --- |
| Deprecation vs sunset | "Stop using this; it will go away" | "This is the date it stops working" |
| Backward compatible vs breaking | Old clients keep working | Old clients fail or get wrong data |
| API version vs SDK version | Which response shape the server sends | Which release of the client library you installed |
| `404` vs `410` after sunset | "Never heard of it" | "It existed and was removed on purpose" |

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** the core rule: add freely, and give breaking changes a new version with an end date for the old one. **Next we open the box** in four steps: decide if a change breaks, choose where the version label goes, serve old versions from one codebase, and retire them politely.

### Step 1: classify the change

**In plain words:** before touching anything, ask one question: could any app written yesterday fail after this? This table is the answer sheet.

**Step by step:**
1. Write down the change: "add `currency` next to `amount`".
2. Ask: would last year's app send a request that now fails? No, nothing new is required.
3. Ask: would last year's app misread a response? No, it ignores the unknown `currency`.
4. So it ships to everyone. Now try "change `amount` from a number to an object": last year's app reads a number and gets an object, so it fails. That needs a new version.

| Change | Breaking? | Why, or the safe alternative |
| --- | --- | --- |
| Add an endpoint, an optional request field, or a response field | No, for tolerant clients | Clients that reject unknown fields break; say in the contract that new fields will appear |
| Remove or rename a response field | **Yes** | Add the new field, keep the old one, retire it in a new version |
| Change a field's type (`int` → `string`, scalar → object) | **Yes** | Add a new field with the new type |
| Make an optional input required, or add a new required input | **Yes** | Give it a server-side default for old versions |
| Change a default or a meaning (paise → rupees, `limit` default 10 → 50) | **Yes**, and silent | The worst kind: nothing fails, numbers are just wrong |
| Add an enum value | **Yes for strict clients** | Clients with **exhaustive** `switch` (code that lists every known value and fails on any other) or strict decoders crash; document "expect unknown values" and map new values down for old versions |
| Change a status code (`200` → `201`, `404` → `403`) or an error code | **Yes** | Clients branch on them |
| Tighten validation (max length 255 → 100) | **Yes** | Requests that used to succeed now fail |
| Loosen validation, or make a required input optional | No | Old clients still send valid requests |

Hyrum Wright's observation ("Hyrum's law") applies: with enough users, every observable behaviour, including field order, error text and timing, is depended on by somebody. The table lists what you promise; **telemetry** (data your servers record about real usage) tells you what people actually rely on.

### Step 2: pick where the version lives

**In plain words:** the client has to say which version it wants. The only choice is where it says it: in the URL, in a header, in the query string, or remembered per account.

**Step by step:**
1. **Path:** the app calls `/v2/orders`. The version is right there in the URL.
2. **Header:** the app calls `/orders` and sends `API-Version: 2025-03-01`.
3. **Query:** the app calls `/orders?api-version=2025-03-01`.
4. **Account pin:** the app sends nothing; the server looks up "this account was created on 2024-11-01" and uses that version.

- **URI path:** `/v1/orders`, `/v2/orders`. Visible, easy to route and cache. Google uses major versions this way (AIP-185).
- **Custom header:** `API-Version: 2025-03-01`. Clean URLs; one resource has one URI. New headers should not use the `X-` prefix (RFC 6648).
- **Media type:** `Accept: application/vnd.example.v2+json` (the client asks for a specific data format, which includes the version). Most "RESTful", least convenient; GitHub's older `application/vnd.github.v3+json` worked this way.
- **Query parameter:** `?api-version=2023-01-01`. Azure REST APIs require it on every call.
- **Date-based with pinning:** Stripe pins an account to the latest version at its first request; a request can override with `Stripe-Version`. GitHub's REST API takes `X-GitHub-Api-Version: 2022-11-28`.

### Step 3: serve old versions from one core

**In plain words:** keep one real implementation that always speaks the newest shape, then a small "translate back" step per old version, like a power adapter per old plug. Never copy the whole codebase per version.

**Step by step:**
1. A client pinned to `2024-11-01` asks for charge `ch_1`.
2. The core handler builds the newest shape: `amount: {value: 49900, currency: "inr"}`, `status: "partially_refunded"`.
3. The `2025-09-01` step turns `amount` back into the plain integer `49900` with a separate `currency`.
4. The `2025-03-01` step turns `partially_refunded` into the old value `succeeded`.
5. The client gets exactly the shape it was written for. The core code never checks the version.

Stripe's 2017 post describes the approach that lets it keep every API version since 2011 working: responses are first rendered for the current version, then the system walks back through time, applying each **version change module** until it reaches the version the request asked for.

```mermaid
flowchart LR
    R["GET /v1/charges/ch_1<br/>API-Version: 2024-11-01"] --> V{"Resolve version:<br/>header, then account pin,<br/>then latest"}
    V -- "retired" --> G["410 Gone"]
    V -- "unknown" --> B["400 Bad Request"]
    V -- "2024-11-01 (deprecated)" --> H["Add Deprecation, Sunset<br/>and Link headers"]
    H --> C["Core handler<br/>always renders 2025-09-01"]
    C --> D2["Down 2025-09-01:<br/>amount object to integer + currency"]
    D2 --> D1["Down 2025-03-01:<br/>partially_refunded to succeeded"]
    D1 --> OUT["200 in the 2024-11-01 shape"]
```

Requests need the mirror image: an `Up` step per change that upgrades an old request body before the core sees it. The core code never contains `if version < X`.

### Step 4: retire old versions on a schedule

**In plain words:** retiring a version is a slow goodbye: announce, warn in every response, watch who still calls, do short practice blackouts, then switch off for real.

**Step by step:**
1. January: announce "v1 ends on 1 September" in the changelog and by email.
2. From then on, every v1 response carries `Deprecation` and `Sunset` headers.
3. Watch calls to v1 per API key, and contact the biggest callers.
4. July and August: turn v1 off for 1 hour, then 1 day (brownouts), so stragglers notice.
5. 1 September: v1 answers `410 Gone` with a link to the upgrade guide.

```mermaid
flowchart LR
    A["Announce<br/>changelog, email, docs<br/>(sunset date fixed)"] --> D["Deprecation + Sunset headers<br/>on every response<br/>of the old version"]
    D --> T["Usage telemetry<br/>requests per version<br/>per API key; contact<br/>the top callers"]
    T --> BR["Brownouts<br/>old version fails for<br/>announced windows:<br/>1 hour, then 1 day"]
    BR --> S["Sunset date reached"]
    S --> GONE["410 Gone with<br/>a link to the upgrade guide"]
    GONE --> RM["Delete the transformer<br/>and its tests"]
```

- `Deprecation: @1756684800` (RFC 9745, published March 2025) carries the deprecation date as a **Unix timestamp** (seconds since 1 January 1970); it may be in the future.
- `Sunset: Tue, 01 Sep 2026 00:00:00 GMT` (RFC 8594) says when the resource is expected to stop responding. RFC 9745 says the sunset must not be earlier than the deprecation date.
- `Link: <https://docs.example.com/upgrades>; rel="deprecation"` points humans to the migration guide.
- **Brownouts** turn the old version off for short, announced windows. Clients that ignored emails and headers now see errors while you can still switch the version back on.
- After the sunset, answer `410 Gone` rather than `404`: the version existed and was removed on purpose.

## 4. Worked example 🟡

### Whiteboard version

**In plain words:** six lines that show the whole trick: build the newest shape, then flatten it back for anyone pinned to an older date.

One core shape, walked back for an older version. The full version below adds the production concerns.

```go
package versioning

// Charge is always built in the latest shape.
type Charge struct {
	ID     string
	Amount map[string]any // since 2025-09-01: {"value": 499, "currency": "INR"}
}

// Render walks the latest shape back for clients pinned to an older version.
func Render(c Charge, version string) map[string]any {
	out := map[string]any{"id": c.ID, "amount": c.Amount}
	if version < "2025-09-01" { // ISO dates compare correctly as strings
		out["amount"] = c.Amount["value"] // old clients expect a plain number
	}
	return out
}
```

### Full version

**In plain words:** the real version adds the paperwork: reject retired or unknown versions, stamp warning headers on deprecated ones, and keep caches from mixing versions.

A charge resource with two breaking changes: on 2025-03-01 the status enum gained `partially_refunded`; on 2025-09-01 `amount` became an object. One core handler renders the latest shape; the policy walks it back for older clients, adds deprecation headers, and rejects retired or unknown versions.

It compiles and passes `go vet` and `go test -race` on Go 1.24 (`slices.Backward` needs Go 1.23 or later).

```go
// Package apiversion serves every supported API version from one core
// handler by walking its latest-version response back through a chain of
// version changes (the model Stripe described in 2017).
package apiversion

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"slices"
	"time"
)

// Change is one breaking change, named by the date it shipped.
// Down rewrites a response from the shape after the change to the shape before it.
type Change struct {
	Version string // "YYYY-MM-DD": dates compare correctly as strings
	Down    func(body map[string]any)
}

type Deprecation struct {
	At     time.Time // when the version was deprecated
	Sunset time.Time // when it stops working
}

type Policy struct {
	Latest     string
	Supported  []string                     // versions still served
	Retired    map[string]bool              // past their sunset: 410 Gone
	Deprecated map[string]Deprecation       // still served, with warnings
	Changes    []Change                     // ascending by Version
	PinnedFor  func(r *http.Request) string // account's pinned version, "" if none
	DocsURL    string
}

// Core always speaks the latest version.
type Core func(r *http.Request) (status int, body map[string]any)

func (p *Policy) Handler(core Core) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		v := r.Header.Get("API-Version") // explicit per-request override
		if v == "" && p.PinnedFor != nil {
			v = p.PinnedFor(r) // pinned at the account's first request
		}
		if v == "" {
			v = p.Latest
		}
		switch {
		case p.Retired[v]:
			http.Error(w, fmt.Sprintf("API version %s was retired, see %s", v, p.DocsURL), http.StatusGone)
			return
		case !slices.Contains(p.Supported, v):
			http.Error(w, fmt.Sprintf("unknown API version %q", v), http.StatusBadRequest)
			return
		}
		if d, ok := p.Deprecated[v]; ok {
			w.Header().Set("Deprecation", fmt.Sprintf("@%d", d.At.Unix()))   // RFC 9745
			w.Header().Set("Sunset", d.Sunset.UTC().Format(http.TimeFormat)) // RFC 8594
			w.Header().Set("Link", fmt.Sprintf("<%s>; rel=\"deprecation\"", p.DocsURL))
		}

		status, body := core(r)
		// Undo every change newer than the client's version, newest first.
		for _, c := range slices.Backward(p.Changes) {
			if c.Version <= v {
				break
			}
			c.Down(body)
		}
		w.Header().Set("API-Version", v)
		w.Header().Set("Vary", "API-Version") // caches must not mix versions
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		if err := json.NewEncoder(w).Encode(body); err != nil {
			// The status line is already sent; a write error can only be logged.
			log.Printf("apiversion: write response: %v", err)
		}
	})
}
```

The test drives the handler with `httptest` at three versions, through a header and through an account pin, and checks the retired and unknown cases:

```go
package apiversion

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// Two breaking changes to a charge resource.
var changes = []Change{
	{ // 2025-03-01 added the enum value "partially_refunded".
		Version: "2025-03-01",
		Down: func(b map[string]any) {
			if b["status"] == "partially_refunded" {
				b["status"] = "succeeded" // old clients only know succeeded/refunded/failed
			}
		},
	},
	{ // 2025-09-01 turned amount into {value, currency}.
		Version: "2025-09-01",
		Down: func(b map[string]any) {
			if m, ok := b["amount"].(map[string]any); ok {
				b["amount"], b["currency"] = m["value"], m["currency"]
			}
		},
	},
}

func core(r *http.Request) (int, map[string]any) {
	return http.StatusOK, map[string]any{
		"id":     "ch_1",
		"amount": map[string]any{"value": 49900, "currency": "inr"},
		"status": "partially_refunded",
	}
}

func newServer() http.Handler {
	p := &Policy{
		Latest:    "2025-09-01",
		Supported: []string{"2024-11-01", "2025-03-01", "2025-09-01"},
		Retired:   map[string]bool{"2023-06-01": true},
		Deprecated: map[string]Deprecation{"2024-11-01": {
			At:     time.Date(2025, 9, 1, 0, 0, 0, 0, time.UTC),
			Sunset: time.Date(2026, 9, 1, 0, 0, 0, 0, time.UTC),
		}},
		Changes:   changes,
		PinnedFor: func(r *http.Request) string { return r.Header.Get("X-Test-Pinned") },
		DocsURL:   "https://docs.example.com/upgrades",
	}
	return p.Handler(core)
}

func get(t *testing.T, h http.Handler, hdr map[string]string) (*httptest.ResponseRecorder, map[string]any) {
	t.Helper()
	req := httptest.NewRequest(http.MethodGet, "/v1/charges/ch_1", nil)
	for k, v := range hdr {
		req.Header.Set(k, v)
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	var body map[string]any
	if rec.Code == http.StatusOK {
		if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
			t.Fatal(err)
		}
	}
	return rec, body
}

func TestEachVersionGetsItsShape(t *testing.T) {
	h := newServer()

	_, latest := get(t, h, nil)
	if _, nested := latest["amount"].(map[string]any); !nested || latest["status"] != "partially_refunded" {
		t.Fatalf("latest = %v", latest)
	}

	_, mid := get(t, h, map[string]string{"API-Version": "2025-03-01"})
	if mid["amount"] != 49900.0 || mid["currency"] != "inr" || mid["status"] != "partially_refunded" {
		t.Fatalf("2025-03-01 = %v", mid)
	}

	rec, old := get(t, h, map[string]string{"X-Test-Pinned": "2024-11-01"}) // pinned, no header
	if old["amount"] != 49900.0 || old["status"] != "succeeded" {
		t.Fatalf("2024-11-01 = %v", old)
	}
	if rec.Header().Get("Deprecation") != "@1756684800" ||
		rec.Header().Get("Sunset") != "Tue, 01 Sep 2026 00:00:00 GMT" ||
		rec.Header().Get("Vary") != "API-Version" {
		t.Fatalf("deprecation headers = %v", rec.Header())
	}
}

func TestRetiredAndUnknownVersions(t *testing.T) {
	h := newServer()
	if rec, _ := get(t, h, map[string]string{"API-Version": "2023-06-01"}); rec.Code != http.StatusGone {
		t.Fatalf("retired version: status %d, want 410", rec.Code)
	}
	if rec, _ := get(t, h, map[string]string{"API-Version": "2024-02-30"}); rec.Code != http.StatusBadRequest {
		t.Fatalf("unknown version: status %d, want 400", rec.Code)
	}
}
```

The exchange a 2024-11-01 client sees, reconstructed from the handler above (the body is what the test decodes; `encoding/json` sorts map keys; the `Date` and `Content-Length` headers that `net/http` adds are left out):

```http
GET /v1/charges/ch_1 HTTP/1.1
Host: api.example.com
API-Version: 2024-11-01

HTTP/1.1 200 OK
Api-Version: 2024-11-01
Content-Type: application/json
Deprecation: @1756684800
Link: <https://docs.example.com/upgrades>; rel="deprecation"
Sunset: Tue, 01 Sep 2026 00:00:00 GMT
Vary: API-Version

{"amount":49900,"currency":"inr","id":"ch_1","status":"succeeded"}
```

Notes on the design:

- The `Down` for the enum maps the new value to the closest old one. Old clients never see a value they cannot handle, and new clients get the precise state.
- Versions are ISO dates so plain string comparison orders them. A semver-style `v10` would sort before `v9` as a string.
- The core returns `map[string]any` so transformers can reshape freely. In a typed codebase the core returns a struct, marshals it once to a generic tree, and the transformers edit the tree.

## 5. Variants and comparison 🟡

Where the version lives:

| Scheme | Example | Use when | Cost |
| --- | --- | --- | --- |
| URI path | `/v2/orders` | Public APIs with rare, big revisions; easy routing, caching and logs | Every link and SDK changes on a bump; tempts teams into whole-API rewrites |
| Custom header | `API-Version: 2025-03-01` | Frequent small changes; stable URLs | Invisible in a browser bar; caches must `Vary` on it (the `Vary` header tells caches to keep separate copies per header value) |
| Media type | `Accept: application/vnd.example.v2+json` | Per-representation versioning, content negotiation | Awkward for clients and tooling |
| Query parameter | `?api-version=2023-01-01` (Azure) | Simple to send from any client; easy to see in logs | Mixes control data with query data |
| Date-based + account pin | `Stripe-Version`; pinned at first request | Many small breaking changes; long-lived integrations | Needs a transformer chain and per-account state |
| No versions, evolve only | GraphQL `@deprecated`; protobuf field rules | Schemas where clients select fields or skip unknown ones | Discipline: never break, only add and deprecate |

How old versions are served:

| Strategy | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Parallel deployments | `v1` and `v2` run as separate code or services | A full rewrite; very few versions | Every bug fix and security patch lands in each copy |
| Branches in the code | `if version < "2025-03-01" { ... }` in handlers | One or two small changes | Version checks spread everywhere and are never deleted |
| One core + transformers | Core renders the latest; a chain of `Down`/`Up` steps per change | Many versions, long support windows | Transformer per change, contract tests per version |

## 6. Trade-offs and when not to use 🟡

- **Every live version costs money.** Each one adds transformers, contract tests, docs and support load. A version nobody calls still costs review time on every change near it.
- **Internal APIs with one owner rarely need versions.** If every caller deploys from the same repository or you control all consumers, use **expand/contract** instead: add the new field, move callers, then remove the old field.
- **A version bump is not a design tool.** Shipping `/v2` to clean up naming forces every client to migrate for no gain to them. Batch breaking changes, and only for real benefit.
- **URI versions invite big-bang rewrites.** Date-based versions push teams toward small, frequent, well-documented changes.
- **Versioning does not cover behaviour drift.** Changing rate limits, latency, or ordering of results can break clients without any field changing; announce those in the changelog too.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how to classify changes, place the version, serve old versions from one core and retire them. **Next is the advanced part**: how Stripe, GitHub and Azure do it, the failures that still happen, mobile apps that never update, protobuf and GraphQL rules, and SDK semver.

- **Real systems:**
	- Stripe pins each account to the newest version at its first request, allows a per-request `Stripe-Version` override, and lets accounts upgrade from the dashboard. Its 2017 post describes keeping every version since 2011 working through version change modules applied backwards. Version strings now also carry a release name (for example `2024-09-30.acacia`).
	- GitHub's REST API uses `X-GitHub-Api-Version` with dates and promises at least 24 months of support for the previous version after a new one ships. Requests without the header get the default, `2022-11-28`; after `2026-03-10` shipped, `2022-11-28` was given an end-of-support date of 10 March 2028 (GitHub docs, checked 2026-11-02).
	- Azure REST APIs take a required `api-version` query parameter; Twilio's REST API carries `2010-04-01` in the URI path; Google APIs use `v1`, `v1beta1` in the path (AIP-185).
- **Failure modes → fixes:**
	- A "harmless" new enum value crashes an old Android app with an exhaustive `when` → document that enums are open, test clients against unknown values, and map new values down for old versions.
	- A field rename ships without a version and partner integrations break → a contract test suite per supported version, run in CI against the latest core (see [[Contract Testing]]).
	- A deprecated version still carries 30% of traffic on sunset day → start telemetry at announcement, contact the top keys, and run brownouts weeks before the sunset.
	- A cache serves a `v2` body to a `v1` client → send `Vary: API-Version` when the version comes from a header.
	- The force-update endpoint itself changes and old apps can no longer learn they must update → keep that endpoint tiny, unversioned and frozen forever.
- **What to monitor:**
	- Requests per version per API key or app version (the input to every deprecation decision).
	- Traffic still on deprecated versions, as a percentage, trending toward zero before the sunset.
	- Error rates per version after each deploy (a transformer bug shows up only for old versions).
	- 410 responses after the sunset, by client, to find stragglers.

## 8. Deep dive 🔴

**Mobile clients that never update.** Apps send their version on every request (`User-Agent` or an app-version header). The server keeps a **minimum supported app version** per platform and exposes it through a small config endpoint.

Below the minimum, the app shows a blocking "update required" screen; between minimum and latest, a dismissible prompt. On the server side, reject requests from apps below the minimum with a specific error code that the oldest apps already understand.

`426 Upgrade Required` is a poor fit: RFC 9110 defines it for protocol upgrades and requires an `Upgrade` header naming the protocol.

**Expand/contract for a field rename** (`name` → `display_name`):

```mermaid
flowchart LR
    E["Expand: send both<br/>name + display_name"] --> M["Migrate: clients<br/>move to display_name"] --> C["Contract: new version<br/>drops name"]
```

1. **Expand:** add `display_name` to responses, keep `name`, accept either in requests (prefer the new one).
2. **Migrate:** update SDKs and first-party clients; watch telemetry by client version.
3. **Contract:** ship a new version without `name`. Its transformer re-adds `name` for older versions, so nobody breaks; drop the transformer at that version's sunset.

The same three steps drive database renames (see [[Zero-Downtime Schema Migrations]]) and event schema changes (see [[Event Schemas and Schema Registry]]).

**GraphQL evolves instead of versioning.** Add fields freely, mark old ones `@deprecated(reason: "Use displayName")`, and remove them when usage reaches zero. Because every query names the fields it reads, the server can log per-field usage, which REST cannot do. See [[GraphQL]].

**Protobuf and gRPC rules** (details in [[Protocol Buffers and Schema Evolution]]):

- Never change or reuse a field number.
- Mark removed numbers and names `reserved`.
- Do not change a field's type.
- Adding fields is safe because old readers skip unknown fields.
- proto3 enums are open, so an old reader keeps an unknown enum value as its number.

Package names carry the major version (`acme.payments.v1`).

**Semver for SDKs.** SDKs follow Semantic Versioning (version numbers shaped MAJOR.MINOR.PATCH, like `2.4.1`): MAJOR for a breaking change in the SDK's own surface, MINOR for additions, PATCH for fixes. The SDK version and the API version are different axes.

Stripe's SDKs for strongly typed languages (Go, Java, .NET), for example, use a fixed API version, the latest one when that SDK release shipped, and Stripe advises against overriding it, so moving such an integration to a new API version means upgrading the SDK.

Its Ruby, Python, PHP and Node SDKs have also defaulted to their release's API version since their 2023 major versions, but accept a per-client or per-request override (Stripe docs, "Set a Stripe API version", checked 2026-11-02).

**Webhooks are versioned too.** An event payload is a response the receiver never asked for. Render each event at the version of the receiving endpoint (Stripe lets each webhook endpoint set one) and run it through the same transformer chain. See [[Webhooks - Sending and Receiving]].

**How many versions to support.** With transformers, the cost grows with the number of *changes*, not versions, which is why date-based APIs can keep many versions alive. With parallel deployments, cost grows with versions, so keep two (current and previous) and publish a fixed support window.

A common rule of thumb for public APIs is a deprecation notice of at least 6 to 12 months (an estimate of common practice; GitHub commits to 24 months).

**Transformers are code with edge cases.** A `Down` must handle every place the resource appears: list items, nested expansions, webhook payloads, and error bodies. Keep one **golden-file** test (a test that compares output with a saved, known-good file) per version per resource so a core change that a transformer forgot shows up as a diff.

## 9. Interview questions 🔴

> [!question]- Is adding a field to a JSON response a breaking change? (trap)
> Not by contract, if you documented that clients must ignore unknown fields. In practice it breaks clients that validate strictly (`additionalProperties: false`, generated strict decoders) or that store the whole object in a fixed-size schema. Say "additive is safe for tolerant readers", state that rule in the contract, and test popular SDKs against new fields.

> [!question]- Is adding a new enum value safe?
> No for strict clients: an exhaustive `switch` or a strict enum decoder fails on the unknown value. Document that enums are open, require a default branch in SDKs, and for old API versions map the new value to the closest old one in a transformer.

> [!question]- URI versioning or header versioning?
> URI (`/v2`) is visible, cache-friendly and easy to route, and suits rare, large revisions. Headers (date-based) keep URLs stable and suit frequent small changes with per-account pinning, but need `Vary` for caches and are less visible. Both work; consistency and a deprecation process matter more than the choice.

> [!question]- How does Stripe keep many API versions without forking code?
> The core speaks only the latest version. Each breaking change ships as a version change module; for an older client, the response walks back through the modules newer than the client's version. Accounts are pinned to the version current at their first request and opt into upgrades.

> [!question]- How do you retire `v1` without an outage?
> Announce a sunset date, send `Deprecation` and `Sunset` headers on every `v1` response, track `v1` calls per API key and contact the biggest callers, run announced brownouts, then return `410 Gone` with a link to the migration guide. Delete the code only after 410 traffic fades.

> [!question]- How do you rename a field without breaking anyone?
> Expand/contract: add the new field and keep the old one, accept both in requests, migrate clients while watching telemetry, then remove the old field only in a new version whose transformer re-adds it for older versions.

> [!question]- Half your users are on an app version from last year. What does your API do?
> Treat the oldest supported app version as a client you must not break: version the API or keep changes additive. Keep a minimum supported version, enforced by a tiny, frozen config endpoint and a stable error code, so you can force an update when a change is unavoidable.

## 10. Cheat sheet 🟢

- Additive (new endpoint, optional input, new response field) is safe for tolerant readers; say so in the contract.
- Breaking: remove, rename or retype a field, new required input, changed default or meaning, new enum value for strict clients, changed status codes, tighter validation.
- Version in path (`/v2`), header (`API-Version`), media type, query (`api-version`), or date + account pin (Stripe).
- Best implementation: one core at the latest version plus `Down`/`Up` transformers per change.
- Retire with `Deprecation` (RFC 9745) + `Sunset` (RFC 8594) headers, telemetry, brownouts, then `410 Gone`.
- Mobile: minimum supported version, frozen force-update endpoint, never trust that users update.
- GraphQL: `@deprecated` and field usage; protobuf: never reuse field numbers, use `reserved`.

## Self-check 🟢🟡

> [!question]- Easy: is adding a new optional field to a response backward compatible?
> Yes, for clients that ignore unknown fields.

> [!question]- Easy: name two places a version label can live.
> The URL path (`/v2/orders`) or a header (`API-Version: 2025-03-01`); also a query parameter or an account pin.

> [!question]- Easy: what status code should a retired version return?
> `410 Gone`.

> [!question]- Medium: is changing `amount` from paise to rupees breaking if the type stays an integer?
> Yes, and silently: nothing fails, but every amount is wrong.

> [!question]- Medium: how does one core serve five versions without `if version < X` everywhere?
> The core builds the newest shape; a chain of small transformers walks it back to the version the client asked for.

> [!question]- Medium: why send `Vary: API-Version` with header-based versions?
> So a cache does not serve a `v2` response to a `v1` client asking for the same URL.

## Links 🟢

- **Before this:** [[REST and HTTP API Design]], [[API Contract Design and OpenAPI]], [[Pagination, Filtering and Sorting]]
- **Next:** [[Idempotency and Idempotency Keys]], [[Contract Testing]]
- **Compare with:** [[Protocol Buffers and Schema Evolution]] (wire-level rules), [[GraphQL]] (evolution without versions), [[Zero-Downtime Schema Migrations]] (expand/contract in the database), [[Event Schemas and Schema Registry]] (compatibility modes for events), [[Feature Flags]] (rolling out behaviour, not contracts)

### Watch on YouTube

- [Versioning & Backward Compatibility in APIs / Low-Level Design - Tabspace](https://www.youtube.com/watch?v=paSXDTcdfww) · Tabspace · Interview-style walkthrough of versioning strategies and backward compatibility
