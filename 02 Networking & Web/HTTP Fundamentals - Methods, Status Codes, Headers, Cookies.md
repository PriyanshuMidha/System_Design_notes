---
tags: [networking, http, web]
level: basic
status: reviewed
prereqs: ["[[TCP - Handshake, Reliability, Flow and Congestion Control]]"]
related: ["[[REST and HTTP API Design]]", "[[HTTP-1.1 vs HTTP-2 vs HTTP-3]]", "[[HTTP Caching - Cache-Control, ETag, Conditional Requests]]", "[[Sessions and Cookies]]", "[[Idempotency and Idempotency Keys]]"]
sources:
  - "RFC 9110, HTTP Semantics"
  - "RFC 9111, HTTP Caching"
  - "RFC 6265bis (draft), HTTP State Management Mechanism (Set-Cookie attributes)"
  - "MDN Web Docs, HTTP response status codes"
updated: 2026-11-07
---

# HTTP Fundamentals - Methods, Status Codes, Headers, Cookies

> [!summary] TL;DR
> HTTP is a text-based request/response protocol: a client sends a method, a path and headers, and a server replies with a status code, headers and a body. Everything above this note — REST APIs, caching, cookies, auth — is built from these same five parts.

> [!abstract] Core idea
> - A request is a method + path + headers + optional body; a response is a status code + headers + optional body.
> - Methods carry two independent promises: **safe** (never changes server state) and **idempotent** (repeating it has the same effect as doing it once).
> - Status codes group into five classes; the two codes people confuse most are 401 vs 403 and 400 vs 422.
> - Classic mistake: assuming the HTTP/1.1 "connection" you write code against still means one TCP connection per request — keep-alive and multiplexing both change that picture.

## 1. Why it exists

Before HTTP, every service that wanted to serve documents over a network invented its own protocol: its own way to ask for a resource, its own way to signal success or failure, its own framing. HTTP (originally defined in RFC 1945, now specified across RFC 9110–9114) standardized that exchange into a single, text-readable shape that any client and any server can speak regardless of what they're written in — a browser from 1996 and a Go server written today still agree on what `GET /index.html HTTP/1.1` means.

Concretely: an API client calling `POST /orders` needs a way to say *what kind of operation this is* (create something) and the server needs a way to say *what happened* (created, 201; rejected, 400; server broke, 500) without the client having to parse a custom error format for every different backend. Methods and status codes are that shared vocabulary.

## 2. Mental model

A request is a short, structured letter: the first line says what you want and from where (`GET /orders/42`), a block of headers gives context (who you are, what formats you accept, whether you have a cached copy already), and an optional body carries data for the server to act on. A response mirrors the shape back: a status line says what happened, headers give metadata about the reply, and an optional body carries the result.

Statelessness is part of the model, not an accident: the server doesn't remember you sent a request a minute ago. Anything that needs to persist across requests — login state, a shopping cart — has to ride along in every request, usually via a cookie or a token, because the protocol itself has no memory.

## 3. How it works

### Request and response anatomy

```mermaid
flowchart TB
    subgraph req["Request"]
        direction TB
        rl["Request line: POST /orders HTTP/1.1"]
        rh["Headers: Host, Content-Type, Content-Length, Authorization, Cookie..."]
        rb["Body (optional): JSON payload"]
        rl --> rh --> rb
    end
    subgraph resp["Response"]
        direction TB
        sl["Status line: HTTP/1.1 201 Created"]
        sh["Headers: Content-Type, Location, Set-Cookie, Cache-Control..."]
        sb["Body (optional): JSON representation of the created order"]
        sl --> sh --> sb
    end
    req -. "sent over an open TCP (or QUIC) connection" .-> resp
```

A **measured** request/response exchange against a local Go `net/http` server (Go 1.24, `curl` 8.7.1, loopback, 2026-11-06):

```console
$ curl -v http://127.0.0.1:8099/items/1
> GET /items/1 HTTP/1.1
> Host: 127.0.0.1:8099
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Cache-Control: max-age=60
< Content-Type: application/json
< Etag: "2cf24dba5fb0a30e"
< Date: Fri, 06 Nov 2026 18:41:46 GMT
< Content-Length: 26
<
{"body":"hello","id":"1"}
```

`>` lines are what `curl` sent, `<` lines are what the server replied with — exactly the request/response anatomy above, with real header names.

### Methods: safe and idempotent are two different properties

**Safe** means a method must never change server state — a crawler, a prefetcher, or a browser's back button can call it freely. **Idempotent** means calling it N times has the same effect on server state as calling it once (though the *response* can still legitimately differ, e.g. a second `DELETE` of an already-gone resource still returns success-shaped semantics even if the first returned 200 and the second 404 or 204 depending on API design).

| Method | Safe | Idempotent | What it means |
| --- | --- | --- | --- |
| `GET` | Yes | Yes | Retrieve a representation; never changes anything |
| `HEAD` | Yes | Yes | Like GET, but headers only, no body — used to check existence/metadata cheaply |
| `OPTIONS` | Yes | Yes | Ask what methods/headers are allowed (also the CORS preflight method) |
| `PUT` | No | Yes | Replace a resource entirely; doing it twice with the same body leaves the same end state |
| `DELETE` | No | Yes | Remove a resource; doing it twice still ends with it gone |
| `POST` | No | No | Create or trigger a side effect; retrying can create a duplicate |
| `PATCH` | No | No (usually) | Partially modify a resource; a relative patch (`increment += 1`) is not idempotent even though the request body looks identical each time |

The trap hides in `PATCH`: a patch document like `{"status": "shipped"}` is idempotent (setting the same value twice is harmless), but one like `{"$inc": {"stock": -1}}` is not — the method name doesn't decide idempotency, the *semantics of the operation* do. This is exactly why non-idempotent operations that must tolerate client retries (payment creation, order placement) need an explicit idempotency key rather than relying on the HTTP method alone — see [[Idempotency and Idempotency Keys]].

### Status codes: five classes, and the pairs people confuse

```mermaid
flowchart LR
    c1["1xx Informational<br/>request received, continue"]
    c2["2xx Success<br/>request was received, understood, accepted"]
    c3["3xx Redirection<br/>further action needed to complete the request"]
    c4["4xx Client Error<br/>the request is wrong"]
    c5["5xx Server Error<br/>the server failed on a request that looked fine"]
    c1 --- c2 --- c3 --- c4 --- c5
```

| Code | Means | Commonly confused with |
| --- | --- | --- |
| `401 Unauthorized` | You are not authenticated (missing or invalid credentials) | `403`: 401 says "log in"; 403 says "I know who you are, and you still can't" |
| `403 Forbidden` | You are authenticated but not authorized for this resource | `401`: never send 403 to someone who hasn't even proven who they are if that leaks information you don't want to leak |
| `400 Bad Request` | The request is malformed — broken JSON, wrong type, missing required field | `422`: 400 is "I can't even parse/validate the shape of this"; 422 is "I understood it fine, but the content fails a business rule" |
| `422 Unprocessable Entity` | The request is well-formed and understood but semantically invalid (e.g. end date before start date) | `400`: see above |
| `409 Conflict` | The request conflicts with the current state (e.g. a version mismatch on optimistic locking, a duplicate unique key) | `422`: 409 is about *state*, not the request's own shape |
| `502 Bad Gateway` | A proxy/gateway got an invalid response from the upstream server | `503`/`504`: 502 means the upstream answered, just badly or not in a valid protocol shape |
| `503 Service Unavailable` | The server (or upstream) is temporarily unable to handle requests — overloaded or in maintenance | `502`/`504`: 503 often comes with a `Retry-After` header; the server itself is saying "not now" |
| `504 Gateway Timeout` | A proxy/gateway gave up waiting for the upstream to respond at all | `502`/`503`: 504 means no response arrived in time, not that an invalid one arrived |

> [!warning] Interview trap
> `401` vs `403` is not about whether the user is "logged in" in casual terms — it's about whether the *request itself* carries valid credentials. A perfectly logged-in user hitting an admin-only endpoint with their normal user token gets `403`, not `401`, because their credentials are valid, just insufficient.

### Headers: the handful that do the most work

| Header | Direction | Purpose |
| --- | --- | --- |
| `Host` | Request | Which virtual host/domain is being asked for — mandatory since HTTP/1.1 |
| `Content-Type` | Both | The media type of the body (`application/json`, `multipart/form-data`, …) |
| `Content-Length` | Both | Body size in bytes, so the receiver knows where the body ends |
| `Authorization` | Request | Credentials: `Bearer <token>`, `Basic <base64>`, etc. |
| `Cache-Control` | Both | Caching directives (`max-age`, `no-store`, `must-revalidate`) — see [[HTTP Caching - Cache-Control, ETag, Conditional Requests]] |
| `ETag` / `If-None-Match` | Response / Request | A fingerprint of a representation, used for conditional requests (see below) |
| `Set-Cookie` / `Cookie` | Response / Request | Server asks the client to store a cookie; client sends it back on later requests |
| `Connection` | Both | `keep-alive` to reuse the TCP connection, `close` to tear it down after this response |

### Conditional requests: avoiding a resend you don't need

A server can tag a representation with an `ETag` (a hash of its content). A client that already has a copy sends `If-None-Match: <etag>` on its next `GET`; if nothing changed, the server replies `304 Not Modified` with **no body at all**, saving the full transfer.

```mermaid
sequenceDiagram
    participant Cl as Client
    participant Sv as Server
    Cl->>Sv: GET /items/1
    Sv-->>Cl: 200 OK, ETag: "abc123", body
    Note over Cl: caches the body with its ETag
    Cl->>Sv: GET /items/1, If-None-Match: "abc123"
    alt resource unchanged
        Sv-->>Cl: 304 Not Modified (no body)
    else resource changed
        Sv-->>Cl: 200 OK, ETag: "def456", new body
    end
```

### Cookies: how state survives a stateless protocol

A cookie is just a header the server asks the client to store and resend. Its attributes decide how exposed it is:

| Attribute | What it controls | Why it matters |
| --- | --- | --- |
| `Secure` | Only sent over HTTPS | Without it, the cookie (session token and all) can be sniffed on plain HTTP |
| `HttpOnly` | Not readable from JavaScript (`document.cookie`) | Blunts cookie theft via XSS — a malicious script literally cannot read the value |
| `SameSite` | Whether the cookie is sent on cross-site requests (`Strict`, `Lax`, `None`) | `Strict`/`Lax` blunts CSRF by not attaching the session cookie to requests originating from another site |
| `Domain` | Which hosts the cookie is sent to | Too broad a domain leaks the cookie to unrelated subdomains |
| `Path` | Which URL paths the cookie is sent on | Scopes a cookie to, say, `/admin` instead of the whole site |

Full CSRF/XSS defenses and CORS belong to [[CSRF, XSS and Security Headers]] and [[CORS and Same-Origin Policy]] — this note only covers the cookie attributes themselves.

### Keep-alive: one request does not need one new TCP connection

HTTP/1.0 opened a fresh TCP connection per request. HTTP/1.1 defaults to `Connection: keep-alive`, reusing the same TCP connection for several sequential requests — avoiding a fresh handshake (and, under TLS, a fresh TLS handshake) every time. This is still head-of-line-blocked at the HTTP/1.1 level: requests on one connection are still answered one at a time unless the client opens multiple connections, which is why browsers historically capped and then parallelized connections per host, and why HTTP/2 multiplexing (see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]]) exists.

## 4. Worked example

A Go `net/http` server demonstrating idempotency by method, a conditional `GET` returning `304`, and cookie attributes. It compiles and passes `go vet` and `go test -race` on Go 1.24.

```go
package httpdemo

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"sync/atomic"
)

// Store is a tiny in-memory resource store used to demonstrate method
// semantics: GET is safe, PUT and DELETE are idempotent, POST is not.
type Store struct {
	mu      sync.Mutex
	items   map[string]string
	nextID  int64
	created atomic.Int64 // counts how many times POST actually created something
}

func NewStore() *Store {
	return &Store{items: make(map[string]string)}
}

func etag(body string) string {
	sum := sha256.Sum256([]byte(body))
	return `"` + hex.EncodeToString(sum[:8]) + `"`
}

// HandleGet is safe: it never changes state, so it may be cached, retried
// and prefetched freely. It also implements conditional GET: if the
// client's If-None-Match matches the current ETag, it replies 304 Not
// Modified with no body instead of resending unchanged bytes.
func (s *Store) HandleGet(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	s.mu.Lock()
	body, ok := s.items[id]
	s.mu.Unlock()
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	tag := etag(body)
	w.Header().Set("ETag", tag)
	w.Header().Set("Cache-Control", "max-age=60")
	if r.Header.Get("If-None-Match") == tag {
		w.WriteHeader(http.StatusNotModified)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": id, "body": body})
}

// HandlePut is idempotent: setting the same body twice leaves the exact
// same state as setting it once.
func (s *Store) HandlePut(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req struct{ Body string }
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request: "+err.Error(), http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	_, existed := s.items[id]
	s.items[id] = req.Body
	s.mu.Unlock()
	if existed {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusCreated)
	}
}

// HandlePost is NOT idempotent: every successful call appends a brand new
// resource with a new ID, so retrying a POST after a timeout can create a
// duplicate.
func (s *Store) HandlePost(w http.ResponseWriter, r *http.Request) {
	var req struct{ Body string }
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request: "+err.Error(), http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	s.nextID++
	id := fmt.Sprintf("%d", s.nextID)
	s.items[id] = req.Body
	s.mu.Unlock()
	s.created.Add(1)
	w.Header().Set("Location", "/items/"+id)
	w.WriteHeader(http.StatusCreated)
}

// HandleDelete is idempotent: deleting an already-deleted resource still
// ends with it gone, so it returns 204 whether or not it existed.
func (s *Store) HandleDelete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	s.mu.Lock()
	delete(s.items, id)
	s.mu.Unlock()
	w.WriteHeader(http.StatusNoContent)
}

// SetSessionCookie shows the attributes a session cookie needs in
// production: Secure (HTTPS only), HttpOnly (no JS access, blunts XSS
// cookie theft), SameSite=Strict (not sent on cross-site requests, blunts
// CSRF), and a scoping Path.
func SetSessionCookie(w http.ResponseWriter, sessionID string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Path:     "/",
		MaxAge:   3600,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})
}
```

Tests covering method semantics and conditional requests:

```go
func newMux(s *Store) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /items/{id}", s.HandleGet)
	mux.HandleFunc("PUT /items/{id}", s.HandlePut)
	mux.HandleFunc("DELETE /items/{id}", s.HandleDelete)
	mux.HandleFunc("POST /items", s.HandlePost)
	return mux
}

func TestPUTIsIdempotent(t *testing.T) {
	s := NewStore()
	mux := newMux(s)

	req := httptest.NewRequest(http.MethodPut, "/items/42", strings.NewReader(`{"Body":"v1"}`))
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("first PUT: got %d, want 201", rec.Code)
	}

	// Same PUT again: state after is identical, so the response is 200,
	// not another 201.
	req2 := httptest.NewRequest(http.MethodPut, "/items/42", strings.NewReader(`{"Body":"v1"}`))
	rec2 := httptest.NewRecorder()
	mux.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusOK {
		t.Fatalf("second PUT: got %d, want 200", rec2.Code)
	}
	if got := s.items["42"]; got != "v1" {
		t.Fatalf("stored body = %q, want v1", got)
	}
}

func TestPOSTIsNotIdempotent(t *testing.T) {
	s := NewStore()
	mux := newMux(s)
	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodPost, "/items", strings.NewReader(`{"Body":"dup"}`))
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)
		if rec.Code != http.StatusCreated {
			t.Fatalf("POST %d: got %d, want 201", i, rec.Code)
		}
	}
	// Three "identical" POSTs, as a client retry-on-timeout would send,
	// created three distinct resources — exactly the non-idempotent risk
	// idempotency keys exist to close.
	if got := s.created.Load(); got != 3 {
		t.Fatalf("created = %d, want 3 distinct resources", got)
	}
}

func TestConditionalGETReturns304(t *testing.T) {
	s := NewStore()
	s.items["1"] = "hello"
	mux := newMux(s)

	req1 := httptest.NewRequest(http.MethodGet, "/items/1", nil)
	rec1 := httptest.NewRecorder()
	mux.ServeHTTP(rec1, req1)
	tag := rec1.Header().Get("ETag")

	req2 := httptest.NewRequest(http.MethodGet, "/items/1", nil)
	req2.Header.Set("If-None-Match", tag)
	rec2 := httptest.NewRecorder()
	mux.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusNotModified {
		t.Fatalf("conditional GET: got %d, want 304", rec2.Code)
	}
	if rec2.Body.Len() != 0 {
		t.Fatalf("304 response should have no body, got %d bytes", rec2.Body.Len())
	}
}

func TestSessionCookieAttributes(t *testing.T) {
	rec := httptest.NewRecorder()
	SetSessionCookie(rec, "abc123")
	c := rec.Result().Cookies()[0]
	if !c.Secure || !c.HttpOnly {
		t.Fatalf("cookie must be Secure and HttpOnly, got Secure=%v HttpOnly=%v", c.Secure, c.HttpOnly)
	}
	if c.SameSite != http.SameSiteStrictMode {
		t.Fatalf("SameSite = %v, want Strict", c.SameSite)
	}
}
```

**Measured** on this machine (Go 1.24.4, darwin/arm64, `go test -race`, 2026-11-06): all five tests pass — two PUTs to the same resource produce 201 then 200 with identical stored state, three POSTs create three distinct resources, a repeated conditional GET returns 304 with a zero-length body, and the session cookie carries `Secure`, `HttpOnly` and `SameSite=Strict`.

## 5. Variants and comparison

| Representation style | How it works | Use when | Cost |
| --- | --- | --- | --- |
| HTTP/1.1 text protocol | Plain-text request/response lines, keep-alive reuses one TCP connection | Universal baseline; simple to debug by hand (`telnet`, `nc`) | One request at a time per connection; verbose headers repeated every request |
| HTTP/2 (binary framing) | Same methods/status/headers semantics, multiplexed binary frames over one TCP connection | Many parallel requests to one host | TCP-level head-of-line blocking still possible (see [[TCP - Handshake, Reliability, Flow and Congestion Control]]) |
| HTTP/3 (over QUIC) | Same semantics again, framed over QUIC streams | Lossy or high-latency networks, mobile clients | Needs UDP to reach the server; see [[UDP and QUIC]] |

> [!warning] Interview trap
> HTTP's methods, status codes and headers are the same across HTTP/1.1, HTTP/2 and HTTP/3 — only the **wire format and connection model** changed. A candidate who says "HTTP/2 added new status codes" has it backwards; see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]] for what actually changed.

## 6. Trade-offs and when not to use

- HTTP's statelessness is a deliberate simplicity trade: every request must carry its own context (auth token, session cookie), which is overhead compared to a protocol with a persistent session, but it's also why any server in a pool can answer any request.
- Plain-text headers repeated on every HTTP/1.1 request are wasteful at scale; HTTP/2's HPACK header compression exists specifically to fix this (see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]]).
- For truly bidirectional, low-latency, many-small-messages traffic (chat, live updates), request/response HTTP is the wrong shape entirely — see [[Real-time APIs - WebSocket, SSE and Long Polling]].

## 7. In production

- **Real systems:** every browser, every REST/HTTP API, every CDN and load balancer speaks this vocabulary; API gateways and reverse proxies route and rewrite based on exactly these methods, paths, and headers (see [[Forward and Reverse Proxies - L4 vs L7]]).
- **Failure modes → fixes:**
	- A client treats `403` as "please log in" and redirects to a login page → wrong UX; `403` means re-authenticating won't help, the account lacks permission.
	- A non-idempotent `POST` is retried blindly by a client library on timeout → duplicate orders/charges; use an idempotency key (see [[Idempotency and Idempotency Keys]]).
	- A `GET` endpoint is implemented to have a side effect (e.g. "mark as read" on fetch) → breaks prefetching, crawling and caching, which all assume `GET` is safe.
	- Missing `Secure`/`HttpOnly` on a session cookie → the session token is stealable over plain HTTP or via any XSS on the page.
- **What to monitor:** status code distribution by class (a rising share of `5xx` is a server health signal; a rising share of `4xx` is often a client or API-contract problem), `304` hit rate on cacheable `GET` endpoints, and `Connection: close` rate (frequent forced connection closes defeat keep-alive's savings).

## 8. Deep dive

- **Why 422 exists separately from 400 at all.** RFC 9110 defines 400 generically as "the server cannot or will not process the request due to something perceived as a client error," which technically covers everything from broken JSON to a business-rule violation — 422 (from WebDAV, RFC 4918, widely reused outside WebDAV) gives APIs a way to distinguish "your request is malformed" from "your request is well-formed but fails validation," which matters because client code often reacts differently (a 400 usually means a client bug; a 422 usually means user input needs correcting).
- **Why safe methods matter beyond "don't delete things."** Safety is what lets infrastructure the request author never thought about — browser prefetchers, crawlers, CDNs, retry logic in HTTP client libraries — treat `GET`/`HEAD`/`OPTIONS` as free to issue speculatively or repeatedly. Breaking that contract (a `GET` with a side effect) causes bugs far from the code that violated it.
- **Idempotency is about end state, not about the response being identical.** A second `DELETE /items/42` after the first succeeded can legitimately return `404` instead of repeating `204` — the method is still idempotent because the *server state* (item 42 does not exist) is the same either way. Confusing "same response" with "idempotent" is a common interview slip.
- **Why `Content-Length` and chunked transfer both exist.** `Content-Length` requires knowing the full body size before sending the first byte, which doesn't work for a response generated as a stream (e.g. a long-running export). `Transfer-Encoding: chunked` lets the server send the body in pieces of unknown total length up front, each prefixed with its own size, terminated by a zero-length chunk — HTTP/2 and HTTP/3 replace this mechanism with their own binary framing, which doesn't need chunking at all.

## 9. Interview questions

> [!question]- What's the difference between a safe method and an idempotent one?
> Safe means the method never changes server state at all (so it's always okay to call speculatively or repeatedly) — `GET`, `HEAD`, `OPTIONS`. Idempotent means repeating the call N times has the same effect on state as calling it once, but the call can still change state the first time — `PUT` and `DELETE` are idempotent but not safe.

> [!question]- When should an API return 401 versus 403?
> 401 means the request itself lacks valid credentials — the server can't tell who's asking, or the credentials it got are invalid/expired. 403 means the server knows exactly who's asking and that identity is simply not allowed to do this. A valid, logged-in user hitting an admin-only route gets 403, not 401.

> [!question]- What's the practical difference between 400 and 422, and does it matter?
> 400 says the request couldn't even be understood — malformed JSON, wrong content type, missing required structure. 422 says the request was understood perfectly but fails a business or semantic rule (an end date before a start date, a duplicate email). It matters for client error handling: a 400 usually signals a client bug to fix in code; a 422 usually signals a user-facing validation message to show.

> [!question]- A client gets intermittent 502s and 504s from the same endpoint. What's the first thing you'd check?
> Whether the upstream is actually responding at all. 504 means the gateway never got a response in time (a timeout, possibly an overloaded or hung upstream); 502 means the upstream *did* respond, just with something the gateway couldn't parse as a valid HTTP response. Check upstream latency/health for 504s, and the upstream's actual raw response (or a crash/panic mid-response) for 502s.

> [!question]- Trap: is `PATCH` always non-idempotent, and is `PUT` always idempotent?
> No to both, in practice. `PUT` is idempotent by definition (it replaces the whole resource with the given representation), but a buggy implementation that, say, appends to a log on every `PUT` would violate that contract. `PATCH` is usually not idempotent because partial-update documents often describe relative changes (`increment`), but a `PATCH` body that sets absolute values (`{"status":"shipped"}`) is idempotent in practice even though the method itself makes no such promise.

> [!question]- Why does HTTP need both `Secure` and `HttpOnly` on a cookie — isn't one enough?
> They block different attacks. `Secure` stops the cookie from ever being sent over plain HTTP, where a network observer could read it. `HttpOnly` stops client-side JavaScript from reading the cookie at all, which blocks an XSS payload from exfiltrating it even if the attacker got arbitrary script execution on the page. Either alone leaves the other attack path open.

> [!question]- What problem does `SameSite` solve, and what's the trade-off of `Strict` versus `Lax`?
> It controls whether a cookie is attached to a request that originated from a different site, which is the mechanism CSRF relies on (a malicious site makes your browser send a request to your bank, cookie included). `Strict` never sends the cookie cross-site, which is safest but breaks things like clicking a link from an email and landing already logged in; `Lax` (the modern browser default) allows the cookie on top-level navigations (clicking a link) but not on embedded cross-site requests (an image, a form auto-submit), balancing security and usability.

## 10. Cheat sheet

- Request = method + path + headers + optional body; response = status code + headers + optional body.
- Safe = never changes state (`GET`, `HEAD`, `OPTIONS`); idempotent = same effect if repeated (`GET`, `PUT`, `DELETE`, not `POST`, usually not `PATCH`).
- 401 = not authenticated; 403 = authenticated but not allowed.
- 400 = malformed/unparseable request; 422 = well-formed but semantically invalid.
- 502 = upstream answered badly; 503 = server/upstream overloaded or down; 504 = upstream never answered in time.
- `ETag` + `If-None-Match` → `304 Not Modified` avoids resending an unchanged body.
- Cookie attributes: `Secure` (HTTPS only), `HttpOnly` (no JS access), `SameSite` (cross-site sending policy), `Domain`/`Path` (scope).
- Keep-alive reuses one TCP connection across requests; it doesn't remove per-connection ordering until HTTP/2's multiplexing.

## Links

- **Before this:** [[TCP - Handshake, Reliability, Flow and Congestion Control]]
- **Next:** [[HTTP-1.1 vs HTTP-2 vs HTTP-3]], [[HTTP Caching - Cache-Control, ETag, Conditional Requests]], [[REST and HTTP API Design]]
- **Compare with:** [[Sessions and Cookies]] (cookies as a session mechanism, in depth), [[Idempotency and Idempotency Keys]] (handling non-idempotent retries), [[CORS and Same-Origin Policy]] and [[CSRF, XSS and Security Headers]] (the security side of cookies and headers)
