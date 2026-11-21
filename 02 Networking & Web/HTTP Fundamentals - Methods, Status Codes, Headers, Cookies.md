---
tags: [networking, http, web]
level: intermediate
status: reviewed
prereqs: ["[[TCP - Handshake, Reliability, Flow and Congestion Control]]"]
related: ["[[REST and HTTP API Design]]", "[[HTTP-1.1 vs HTTP-2 vs HTTP-3]]", "[[HTTP Caching - Cache-Control, ETag, Conditional Requests]]", "[[Sessions and Cookies]]", "[[Idempotency and Idempotency Keys]]"]
sources:
  - "RFC 9110, HTTP Semantics"
  - "RFC 9111, HTTP Caching"
  - "RFC 6265bis (draft), HTTP State Management Mechanism (Set-Cookie attributes)"
  - "MDN Web Docs, HTTP response status codes"
updated: 2026-11-13
---

# HTTP Fundamentals - Methods, Status Codes, Headers, Cookies

> [!summary] TL;DR
> HTTP is a text-based request/response protocol: a client sends a method, a path and headers, and a server replies with a status code, headers and a body. Everything above this note — REST APIs, caching, cookies, auth — is built from these same five parts.

> [!abstract] Core idea
> - A request is a method + path + headers + optional body; a response is a status code + headers + optional body.
> - Methods carry two independent promises: **safe** (never changes server state) and **idempotent** (repeating it has the same effect as doing it once).
> - Status codes group into five classes; the two codes people confuse most are 401 vs 403 and 400 vs 422.
> - Classic mistake: assuming the HTTP/1.1 "connection" you write code against still means one TCP connection per request — keep-alive and multiplexing both change that picture.

### Whiteboard version

**In plain words:** one program asks, the other answers, and then both forget the conversation — that is the whole protocol in one picture.

```mermaid
flowchart LR
    client["Client"] -- "GET /orders/42\n(method + path + headers)" --> server["Server"]
    server -- "200 OK\n(status + headers + body)" --> client
```

One request, one response, nothing remembered in between — that last part ("nothing remembered") is the single idea everything else in this note builds on.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works), 4 (worked example) and 5.
> - 🔴 **Interview / SDE-3 prep?** Add 6, 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[TCP - Handshake, Reliability, Flow and Congestion Control]]: two programs open a connection with a quick handshake, then send bytes that arrive complete and in order. HTTP messages ride on that connection.

**From zero, in 60 seconds** 🟢

Your phone and a far-away server need to talk. They were built by different people, so they need shared rules. Those rules are **HTTP**.

The rules are simple. The phone sends a short message: what it wants (`GET /orders`) plus some labelled extra lines called **headers**. The server replies with a 3-digit number saying how it went (the **status code**: 200 = fine, 404 = not found) plus the data.

```mermaid
flowchart LR
    P["Your phone"] -- "GET /orders<br/>+ headers" --> S["Server"]
    S -- "200 OK<br/>+ the order list" --> P
```

One catch: the server forgets you after every answer. So the server hands your browser a small sticky note (a **cookie**) and the browser shows it back on every visit — that is how "stay logged in" works.

```mermaid
flowchart LR
    S2["Server: here, keep this note<br/>(Set-Cookie: session=abc)"] --> B["Browser stores it"]
    B -- "shows the note every visit<br/>(Cookie: session=abc)" --> S2
```

That is all of HTTP. The rest of this note is just these 4 questions:
1. What kinds of asking are there, and which are safe to repeat? (methods)
2. What do the answer numbers mean? (status codes)
3. What do the extra labelled lines do? (headers)
4. How does a forgetful protocol remember you? (cookies)

**The problem in one story.**
You open a shopping app and tap "My orders".
Your phone has to ask a far-away computer for that list, and the computer has to answer.
Both sides were built by different people, in different languages.
HTTP is the shared set of rules that lets any app ask and any server answer.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Client | The program that asks | Your browser or a Go `http.Client` |
| Server | The program that answers | A Go service listening on port 8080 |
| Request | One message from client to server | `GET /orders/42` |
| Response | The server's reply to one request | `200 OK` plus the order as JSON |
| Header | A `Name: value` line of extra info | `Content-Type: application/json` |
| Body | The actual data carried by a message | The JSON text of an order |
| Status code | A 3-digit number saying what happened | `404` = not found |
| Cookie | A small value the browser stores and sends back each time | `session=abc123` |
| Method | The verb of a request: what kind of action you want | `GET` read, `POST` create, `DELETE` remove |
| Safe | The method never changes anything on the server | `GET /orders` |
| Idempotent | Doing it twice leaves the server the same as doing it once | `DELETE /items/42` twice: still gone |
| Stateless | The server remembers nothing between requests by itself | Each request carries its own login cookie |
| Keep-alive | Reusing one open connection for several requests | `GET /a` then `GET /b` on the same TCP connection |

**Picture it**

```mermaid
flowchart LR
    C["Client"] -- "Request:<br/>method + path + headers + body" --> S["Server"]
    S -- "Response:<br/>status + headers + body" --> C
    S -. "Set-Cookie" .-> C
    C -. "Cookie (next request)" .-> S
```

**Analogy.** Ordering at a restaurant counter: you say what you want (method and path), add notes like "no onions" (headers), and get a tray back with a receipt saying "done" or "sold out" (status code).
Where it breaks: the counter staff forget you the moment you leave; HTTP itself remembers nothing, so cookies or tokens must carry who you are on every request.

**How the rest of this note builds up**

- First, why a shared protocol exists (section 1) and the letter-and-receipt mental model (section 2).
- Then the request and response anatomy, methods (safe vs idempotent) and status codes.
- Next the headers that matter most, conditional requests, cookies and keep-alive.
- Finally the SDE-3 deep dive: 400 vs 422, why safety lets infrastructure retry, idempotency as end state, and chunked transfer.

> [!tip] Remember
> HTTP = ask with a method and path, answer with a status code; nothing is remembered between requests unless a cookie or token carries it.

## 1. Why it exists 🟢

Imagine every website invented its own private way of asking for a page and its own private way of saying "found it" or "not found" — a browser built for one site couldn't talk to any other.

Before **HTTP** (HyperText Transfer Protocol — a shared, text-readable request/response vocabulary any client and any server can speak regardless of what they're written in), every service that wanted to serve documents over a network invented its own protocol: its own way to ask for a resource, its own way to signal success or failure, its own framing (the rules for where one message ends and the next begins).

HTTP (originally defined in RFC 1945, now specified across RFC 9110–9114; an RFC is an official internet standard document) standardized that exchange into one shape. A browser from 1996 and a Go server written today still agree on what `GET /index.html HTTP/1.1` means.

**Example:** an API client calling `POST /orders` needs a way to say *what kind of operation this is* (create something) and the server needs a way to say *what happened* (created, `201`; rejected, `400`; server broke, `500`) without the client having to parse a custom error format for every different backend. Methods and status codes are that shared vocabulary.

> [!tip] Remember
> HTTP's whole job is to be a vocabulary every client and server already agree on, so nobody has to invent their own.

### Real-life example: placing a Swiggy order 🟢

Open Swiggy and the app sends `GET /restaurants?lat=..&lng=..`. The server answers `200` with a list.
Tap "Place order" and the app sends `POST /orders` with your cart in the body. The server answers `201 Created`.
If your login has expired, the answer is `401`, and the app shows the login screen.
Your login itself travels as a cookie or token on every one of these requests, because the server does not remember you between them.
If the network drops right after "Place order", the app must not blindly send the `POST` again, or you could get two orders. That is why idempotency matters (section 3).

```mermaid
flowchart LR
    A["GET /restaurants"] --> B["200 + list"]
    C["POST /orders"] --> D["201 Created"]
    E["request with expired login"] --> F["401: log in again"]
```

## 2. Mental model 🟢

**In plain words:** a request is a short, structured letter.

The first line says what you want and from where (`GET /orders/42`), a block of headers gives context (who you are, what formats you accept, whether you have a cached copy already), and an optional body carries data for the server to act on.

A response mirrors the shape back: a status line says what happened, headers give metadata about the reply, and an optional body carries the result.

**Analogy:** think of it like sending a letter to a post office counter and getting a receipt back. You write what you want on the front (the request line), attach any supporting notes (headers), maybe include a form to fill out (the body).

The clerk hands back a receipt stating what happened (status line), any stamps or notices (response headers), and maybe the item you asked for (response body).

Where the analogy breaks down: the clerk has no memory of you from your last visit — **statelessness** is part of the HTTP model, not an accident.

Anything that needs to persist across requests — login state, a shopping cart — has to ride along in every request, usually via a cookie or a token, because the protocol itself remembers nothing between them.

```mermaid
flowchart TB
    subgraph req["Request = one short letter"]
        direction TB
        rl["Request line: what + where"]
        rh["Headers: context"]
        rb["Body (optional): data to act on"]
        rl --> rh --> rb
    end
    subgraph resp["Response = the receipt"]
        direction TB
        sl["Status line: what happened"]
        sh["Headers: metadata"]
        sb["Body (optional): the result"]
        sl --> sh --> sb
    end
    req -. "sent over an open TCP (or QUIC) connection" .-> resp
```

> [!warning] Common mistake
> Assuming the server "remembers" a previous request because the connection stayed open (keep-alive). The TCP connection may persist, but HTTP itself carries no memory across requests — the server only knows what this exact request tells it, plus whatever a cookie or token happens to carry along.

> [!tip] Remember
> Every request must be understandable entirely on its own — that's what "stateless" buys the system: any server in a pool can answer any request.

## Common beginner mistakes 🟢

- **Using `GET` for something that changes data** (like `GET /deleteItem?id=4`) → browsers, crawlers and caches call `GET` freely and will trigger it → use `POST`, `PUT` or `DELETE`.
- **Returning `200` with `{"error": ...}` in the body** → monitoring and clients think it worked → return the matching 4xx or 5xx code.
- **Sending `401` when the user is logged in but not allowed** → the app will ask them to log in again, which won't help → use `403`.
- **Retrying a failed `POST` automatically** → the first one may have worked, so you create a duplicate → send an idempotency key, or only auto-retry idempotent methods.
- **Setting a session cookie without `Secure`, `HttpOnly` and `SameSite`** → it can be stolen or misused → set all three.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** the shape of HTTP: a request (method, path, headers, body) and a response (status, headers, body), with no memory in between. **Next we open the box**: a real captured exchange, what each method promises, what each status family means, the headers and cookie settings that matter, and how connections get reused. Each subsection starts with a plain step-by-step walk; the full detail follows it.

### Request and response anatomy

**In plain words:** here is one real conversation, captured as it happened — the lines your side sent and the lines the server sent back, nothing hidden.

**Step by step:**
1. `curl` connects to `127.0.0.1` port `8099` (127.0.0.1 is loopback: your own machine talking to itself).
2. It sends the request line `GET /items/1 HTTP/1.1`: method, path, version.
3. It adds headers: `Host` (which site), `User-Agent` (which program), `Accept` (which formats it can read). A blank line ends the headers.
4. The server replies `HTTP/1.1 200 OK`, then its own headers: type of data, length (26 bytes), caching rules, an ETag.
5. After a blank line comes the body: `{"body":"hello","id":"1"}`.

A **measured** request/response exchange against a local Go `net/http` server (Go 1.24, `curl` 8.7.1, loopback: client and server on the same machine, 2026-11-06):

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

**In plain words:** two separate promises hide behind every HTTP method's name. **Safe** means a method must never change server state — a crawler (a bot that reads pages, like Google's), a prefetcher (the browser loading a link early, before you click), or a browser's back button can call it freely.

**Step by step:**
1. `GET /items/42` just reads. Call it 100 times; nothing changes. It is **safe** (and so also idempotent).
2. `PUT /items/42` with `{"name":"pen"}` replaces item 42. The first call changes it; calls 2 to 100 leave it exactly the same. Not safe, but **idempotent**.
3. `DELETE /items/42` removes it. A second call finds nothing to remove; the end state ("gone") is the same. Idempotent.
4. `POST /orders` creates a new order each time. Call it twice, get two orders. Neither safe nor idempotent.
5. So a client may retry `GET`, `PUT` and `DELETE` after a timeout, but must be careful with `POST`.

**Idempotent** means calling it N times has the same effect on server state as calling it once (though the *response* can still legitimately differ — a second `DELETE` of an already-gone resource still ends with it gone, even if the first call returned `200` and the second `404` or `204` depending on API design).

**Picture it:**

```mermaid
flowchart TD
    m["A method"] --> safe{"Safe?\n(never changes state)"}
    safe -- yes --> idem1{"Idempotent?"}
    safe -- no --> idem2{"Idempotent?"}
    idem1 -- yes --> cell1["GET, HEAD, OPTIONS\nfree to retry, cache, prefetch"]
    idem2 -- yes --> cell2["PUT, DELETE\nchanges state once, repeats are harmless"]
    idem2 -- no --> cell3["POST, usually PATCH\nretry risks duplicating the effect"]
```

| Method | Safe | Idempotent | What it means |
| --- | --- | --- | --- |
| `GET` | Yes | Yes | Retrieve a representation; never changes anything |
| `HEAD` | Yes | Yes | Like GET, but headers only, no body — used to check existence/metadata cheaply |
| `OPTIONS` | Yes | Yes | Ask what methods/headers are allowed (also the CORS preflight method: the browser's "may I?" check before a cross-site request) |
| `PUT` | No | Yes | Replace a resource entirely; doing it twice with the same body leaves the same end state |
| `DELETE` | No | Yes | Remove a resource; doing it twice still ends with it gone |
| `POST` | No | No | Create or trigger a side effect; retrying can create a duplicate |
| `PATCH` | No | No (usually) | Partially modify a resource; a relative patch (`increment += 1`) is not idempotent even though the request body looks identical each time |

**Example:** the trap hides in `PATCH`. A patch document like `{"status": "shipped"}` is idempotent — setting the same value twice is harmless. But `{"$inc": {"stock": -1}}` is not — sending it twice decrements stock twice. The method name doesn't decide idempotency; the *semantics of the operation* do.

> [!warning] Common mistake
> Assuming idempotent means "the response is identical every time." It only means the *end state* is the same. A second `DELETE /items/42` can legitimately return `404` instead of repeating the first call's `204` — the item being gone either way is what makes it idempotent.

This is exactly why non-idempotent operations that must tolerate client retries (payment creation, order placement) need an explicit idempotency key rather than relying on the HTTP method alone — see [[Idempotency and Idempotency Keys]].

> [!tip] Remember
> Safe and idempotent are two separate questions. `GET` is both; `PUT`/`DELETE` are idempotent but not safe; `POST` is neither.

### Status codes: five classes, and the pairs people confuse

**In plain words:** every HTTP response's status code falls into one of five families, numbered by their first digit. Knowing the family tells you who should act next.

**Step by step:**
1. Look at the first digit only.
2. `2xx`: it worked. `201` = created something new.
3. `3xx`: go somewhere else. `301` = moved for good, follow the `Location` header.
4. `4xx`: the client made a mistake. `404` = no such thing, `401` = who are you?, `403` = not allowed.
5. `5xx`: the server broke. `500` = bug, `503` = too busy right now, try later.

```mermaid
flowchart LR
    c1["1xx Informational\nrequest received, continue"]
    c2["2xx Success\nrequest was received, understood, accepted"]
    c3["3xx Redirection\nfurther action needed to complete the request"]
    c4["4xx Client Error\nthe request is wrong"]
    c5["5xx Server Error\nthe server failed on a request that looked fine"]
    c1 --- c2 --- c3 --- c4 --- c5
```

**Example:** a `201 Created` (2xx) means the server did what was asked and here is the new thing; a `404 Not Found` (4xx) means the client asked for something that doesn't exist; a `500 Internal Server Error` (5xx) means the client did nothing wrong, the server broke.

The two pairs people mix up most:

| Code | Means | Commonly confused with |
| --- | --- | --- |
| `401 Unauthorized` | You are not authenticated (missing or invalid credentials) | `403`: 401 says "log in"; 403 says "I know who you are, and you still can't" |
| `403 Forbidden` | You are authenticated but not authorized for this resource | `401`: never send 403 to someone who hasn't even proven who they are if that leaks information you don't want to leak |
| `400 Bad Request` | The request is malformed — broken JSON, wrong type, missing required field | `422`: 400 is "I can't even parse/validate the shape of this"; 422 is "I understood it fine, but the content fails a business rule" |
| `422 Unprocessable Entity` | The request is well-formed and understood but semantically invalid (e.g. end date before start date) | `400`: see above |
| `409 Conflict` | The request conflicts with the current state (e.g. a version mismatch on optimistic locking, where each update says which version it expects and fails if someone changed it first; or a duplicate unique key) | `422`: 409 is about *state*, not the request's own shape |
| `502 Bad Gateway` | A proxy/gateway got an invalid response from the upstream server (the server behind it) | `503`/`504`: 502 means the upstream answered, just badly or not in a valid protocol shape |
| `503 Service Unavailable` | The server (or upstream) is temporarily unable to handle requests — overloaded or in maintenance | `502`/`504`: 503 often comes with a `Retry-After` header; the server itself is saying "not now" |
| `504 Gateway Timeout` | A proxy/gateway gave up waiting for the upstream to respond at all | `502`/`503`: 504 means no response arrived in time, not that an invalid one arrived |

> [!warning] Common mistake
> Treating `401` vs `403` as "logged in or not" in casual terms — it's really about whether the *request itself* carries valid credentials. A perfectly logged-in user hitting an admin-only endpoint with their normal user token gets `403`, not `401`, because their credentials are valid, just insufficient.

> [!tip] Remember
> 401 = "I don't know who you are." 403 = "I know exactly who you are, and the answer is still no."

### Headers: the handful that do the most work

**In plain words:** headers are key-value metadata riding alongside the request line or status line. A handful of them show up in almost every real system.

**Step by step:**
1. Your app sends `POST /orders` to `api.shop.com`. `Host: api.shop.com` says which site, since one server may host many.
2. `Content-Type: application/json` says the body is JSON. `Content-Length: 58` says it is 58 bytes long.
3. `Authorization: Bearer eyJ...` carries your login token.
4. The response comes back with its own `Content-Type`, and maybe `Set-Cookie` or `Cache-Control`.

| Header | Direction | Purpose |
| --- | --- | --- |
| `Host` | Request | Which virtual host/domain (one of many sites served by the same server) is being asked for — mandatory since HTTP/1.1 |
| `Content-Type` | Both | The media type (the data format) of the body (`application/json`, `multipart/form-data`, …) |
| `Content-Length` | Both | Body size in bytes, so the receiver knows where the body ends |
| `Authorization` | Request | Credentials: `Bearer <token>` (a login token), `Basic <base64>` (username and password, lightly encoded, not encrypted), etc. |
| `Cache-Control` | Both | Caching directives (`max-age`, `no-store`, `must-revalidate`) — see [[HTTP Caching - Cache-Control, ETag, Conditional Requests]] |
| `ETag` / `If-None-Match` | Response / Request | A fingerprint of a representation, used for conditional requests (see below) |
| `Set-Cookie` / `Cookie` | Response / Request | Server asks the client to store a cookie; client sends it back on later requests |
| `Connection` | Both | `keep-alive` to reuse the TCP connection, `close` to tear it down after this response |

### Conditional requests: avoiding a resend you don't need

**In plain words:** a server can tag a representation with an **ETag** — a hash of its content. A client that already has a copy sends `If-None-Match: <etag>` on its next `GET`; if nothing changed, the server replies `304 Not Modified` with **no body at all**, saving the full transfer.

**Step by step:**
1. First `GET /items/1`: server sends `200`, the body and `ETag: "abc123"` (a fingerprint of this version).
2. The client keeps both.
3. Next time it sends `GET /items/1` with `If-None-Match: "abc123"`: "send it only if it is no longer abc123."
4. Nothing changed → `304`, a few bytes, no body. Changed → `200` with the new body and a new ETag.

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

**Example:** a 2KB JSON representation gets fetched once (`200`, full body), then checked again a minute later. If nothing changed, the second response is a few bytes of headers and nothing else — the full detail of this mechanism, including `Cache-Control` and the precedence between validators, lives in [[HTTP Caching - Cache-Control, ETag, Conditional Requests]].

> [!tip] Remember
> A `304` is the server proving "nothing changed" cheaply — it is caching working correctly, not a failure.

### Cookies: how state survives a stateless protocol

**In plain words:** a cookie is just a header the server asks the client to store and resend on every later request. Its attributes decide how exposed it is.

**Step by step:**
1. You log in. The server replies with `Set-Cookie: session=abc; Secure; HttpOnly; SameSite=Lax; Path=/`.
2. The browser saves `session=abc` for this site.
3. On every later request to the site it adds `Cookie: session=abc`, so the server knows it is you.
4. `Secure`: only send it over HTTPS. `HttpOnly`: page scripts cannot read it. `SameSite`: don't attach it to requests started by other sites.

```mermaid
flowchart LR
    S["Secure"] --> A1["blocks: reading it on plain HTTP Wi-Fi"]
    H["HttpOnly"] --> A2["blocks: a bad script stealing it (XSS)"]
    M["SameSite"] --> A3["blocks: another site sending requests as you (CSRF)"]
```

| Attribute | What it controls | Why it matters |
| --- | --- | --- |
| `Secure` | Only sent over HTTPS | Without it, the cookie (session token and all) can be sniffed (read by someone watching the network) on plain HTTP |
| `HttpOnly` | Not readable from JavaScript (`document.cookie`) | Blunts cookie theft via XSS (cross-site scripting: an attacker's script running inside your page) — a malicious script literally cannot read the value |
| `SameSite` | Whether the cookie is sent on cross-site requests (`Strict`, `Lax`, `None`) | `Strict`/`Lax` blunts CSRF (cross-site request forgery: another site making your browser send a request with your cookies) by not attaching the session cookie to requests originating from another site |
| `Domain` | Which hosts the cookie is sent to | Too broad a domain leaks the cookie to unrelated subdomains |
| `Path` | Which URL paths the cookie is sent on | Scopes a cookie to, say, `/admin` instead of the whole site |

**Example:** a session cookie set with `Secure; HttpOnly; SameSite=Strict; Path=/` is sent back by the browser on every request to the same site, over HTTPS only, invisible to any JavaScript running on the page, and never attached to a request that originated from another site.

> [!warning] Common mistake
> Setting only `HttpOnly` and assuming the cookie is now safe. `HttpOnly` blocks JavaScript from reading it; it does nothing against the cookie being sniffed on plain HTTP (that needs `Secure`) or against it riding along on a forged cross-site request (that needs `SameSite`). The three attributes block three different attacks.

Full CSRF/XSS defenses and CORS belong to [[CSRF, XSS and Security Headers]] and [[CORS and Same-Origin Policy]] — this note only covers the cookie attributes themselves.

> [!tip] Remember
> `Secure` stops eavesdropping, `HttpOnly` stops script theft, `SameSite` stops forged cross-site requests — all three, not any one of them alone.

### Keep-alive: one request does not need one new TCP connection

**In plain words:** HTTP/1.0 opened a fresh TCP connection per request. HTTP/1.1 defaults to `Connection: keep-alive`, reusing the same TCP connection for several sequential requests — avoiding a fresh handshake (and, under TLS, a fresh TLS handshake) every time.

**Step by step:**
1. The browser opens one TCP connection to the server (one handshake).
2. It sends `GET /a`, gets the answer, and leaves the connection open.
3. It sends `GET /b` on the same connection. No new handshake, so it is faster.
4. But `/b` must wait until `/a`'s answer is done: one at a time per connection in HTTP/1.1.
5. After some idle seconds, either side closes the connection.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    Note over C,S: HTTP/1.0 style: new connection per request
    C->>S: TCP handshake, GET /a, response, close
    C->>S: TCP handshake, GET /b, response, close
    Note over C,S: HTTP/1.1 keep-alive: one connection, several requests
    C->>S: TCP handshake (once)
    C->>S: GET /a, response
    C->>S: GET /b, response
```

This is still head-of-line-blocked (a slow first answer holds up everything queued behind it) at the HTTP/1.1 level: requests on one connection are still answered one at a time unless the client opens multiple connections, which is why browsers historically capped and then parallelized connections per host, and why HTTP/2 multiplexing (many requests in flight at once on one connection; see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]]) exists.

> [!tip] Remember
> Keep-alive saves handshakes, not ordering — one connection still answers one request at a time until HTTP/2.

## 4. Worked example 🟡

A Go `net/http` server trace, step by step, for one `PUT` sent twice to the same resource:

1. **First `PUT /items/42`** with body `{"Body":"v1"}` arrives. The store has no entry for `42` yet.
2. **Handler writes it.** The store now holds `items["42"] = "v1"`.
3. **Handler responds `201 Created`**, because the resource did not exist before this call.
4. **Same `PUT /items/42`** with the identical body arrives again — simulating a client retry after a timeout.
5. **Handler writes the same value again.** The store still holds exactly `items["42"] = "v1"` — unchanged from step 2.
6. **Handler responds `200 OK`** this time, because the resource already existed — but critically, the *stored state* after both calls is identical. That is what "idempotent" means in practice, traced through actual state.

Runnable Go version: [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies - Go]].

## 5. Variants and comparison 🟡

| Representation style | How it works | Use when | Cost |
| --- | --- | --- | --- |
| HTTP/1.1 text protocol | Plain-text request/response lines, keep-alive reuses one TCP connection | Universal baseline; simple to debug by hand (`telnet`, `nc`) | One request at a time per connection; verbose headers repeated every request |
| HTTP/2 (binary framing) | Same methods/status/headers semantics, multiplexed binary frames over one TCP connection | Many parallel requests to one host | TCP-level head-of-line blocking still possible (see [[TCP - Handshake, Reliability, Flow and Congestion Control]]) |
| HTTP/3 (over QUIC) | Same semantics again, framed over QUIC streams | Lossy or high-latency networks, mobile clients | Needs UDP to reach the server; see [[UDP and QUIC]] |

> [!warning] Interview trap
> HTTP's methods, status codes and headers are the same across HTTP/1.1, HTTP/2 and HTTP/3 — only the **wire format and connection model** changed. A candidate who says "HTTP/2 added new status codes" has it backwards; see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]] for what actually changed.

### HTTP vs the things people mix it up with 🟡

| Thing | What it is | How it relates to HTTP |
| --- | --- | --- |
| TCP | The reliable byte pipe | HTTP/1.1 and HTTP/2 messages travel over it |
| HTTPS | HTTP inside TLS encryption | Same methods and status codes, just encrypted |
| REST | A style of designing APIs | Uses HTTP methods and status codes in a disciplined way |
| WebSocket | A two-way open connection | Starts as an HTTP request, then stops being request/response |

## 6. Trade-offs and when not to use 🟡

- HTTP's statelessness is a deliberate simplicity trade: every request must carry its own context (auth token, session cookie), which is overhead compared to a protocol with a persistent session, but it's also why any server in a pool can answer any request.
- Plain-text headers repeated on every HTTP/1.1 request are wasteful at scale; HTTP/2's HPACK header compression (it remembers headers already sent and sends short references instead) exists specifically to fix this (see [[HTTP-1.1 vs HTTP-2 vs HTTP-3]]).
- For truly bidirectional, low-latency, many-small-messages traffic (chat, live updates), request/response HTTP is the wrong shape entirely — see [[Real-time APIs - WebSocket, SSE and Long Polling]].

## 7. In production 🔴

> 🟡 → 🔴 **You now know** methods, status codes, headers, cookies and keep-alive. **Next comes the advanced part**: the real bugs these cause in production, what to monitor, and the finer points (400 vs 422, why safety matters to infrastructure, chunked transfer) that interviewers probe.

- **Real systems:** every browser, every REST/HTTP API, every CDN and load balancer speaks this vocabulary; API gateways and reverse proxies route and rewrite based on exactly these methods, paths, and headers (see [[Forward and Reverse Proxies - L4 vs L7]]).
- **Failure modes → fixes:**
	- A client treats `403` as "please log in" and redirects to a login page → wrong UX; `403` means re-authenticating won't help, the account lacks permission.
	- A non-idempotent `POST` is retried blindly by a client library on timeout → duplicate orders/charges; use an idempotency key (see [[Idempotency and Idempotency Keys]]).
	- A `GET` endpoint is implemented to have a side effect (e.g. "mark as read" on fetch) → breaks prefetching, crawling and caching, which all assume `GET` is safe.
	- Missing `Secure`/`HttpOnly` on a session cookie → the session token is stealable over plain HTTP or via any XSS on the page.
- **What to monitor:** status code distribution by class (a rising share of `5xx` is a server health signal; a rising share of `4xx` is often a client or API-contract problem), `304` hit rate on cacheable `GET` endpoints, and `Connection: close` rate (frequent forced connection closes defeat keep-alive's savings).

## 8. Deep dive 🔴

- **Why 422 exists separately from 400 at all.** RFC 9110 defines 400 generically as "the server cannot or will not process the request due to something perceived as a client error," which technically covers everything from broken JSON to a business-rule violation — 422 (from WebDAV, a file-editing extension to HTTP, RFC 4918, widely reused outside WebDAV) gives APIs a way to distinguish "your request is malformed" from "your request is well-formed but fails validation," which matters because client code often reacts differently (a 400 usually means a client bug; a 422 usually means user input needs correcting).
- **Why safe methods matter beyond "don't delete things."** Safety is what lets infrastructure the request author never thought about — browser prefetchers, crawlers, CDNs, retry logic in HTTP client libraries — treat `GET`/`HEAD`/`OPTIONS` as free to issue speculatively or repeatedly. Breaking that contract (a `GET` with a side effect) causes bugs far from the code that violated it.
- **Idempotency is about end state, not about the response being identical.** A second `DELETE /items/42` after the first succeeded can legitimately return `404` instead of repeating `204` — the method is still idempotent because the *server state* (item 42 does not exist) is the same either way. Confusing "same response" with "idempotent" is a common interview slip.
- **Why `Content-Length` and chunked transfer both exist.** `Content-Length` requires knowing the full body size before sending the first byte, which doesn't work for a response generated as a stream (e.g. a long-running export).

  `Transfer-Encoding: chunked` lets the server send the body in pieces of unknown total length up front, each prefixed with its own size, terminated by a zero-length chunk — HTTP/2 and HTTP/3 replace this mechanism with their own binary framing, which doesn't need chunking at all.

## 9. Interview questions 🔴

> [!question]- What's the difference between a safe method and an idempotent one?
> Safe means the method never changes server state at all (so it's always okay to call speculatively or repeatedly) — `GET`, `HEAD`, `OPTIONS`. Idempotent means repeating the call N times has the same effect on state as calling it once, but the call can still change state the first time — `PUT` and `DELETE` are idempotent but not safe.

> [!question]- When should an API return 401 versus 403?
> 401 means the request itself lacks valid credentials — the server can't tell who's asking, or the credentials it got are invalid/expired. 403 means the server knows exactly who's asking and that identity is simply not allowed to do this. A valid, logged-in user hitting an admin-only route gets 403, not 401.

> [!question]- What's the practical difference between 400 and 422, and does it matter?
> 400 says the request couldn't even be understood — malformed JSON, wrong content type, missing required structure. 422 says the request was understood perfectly but fails a business or semantic rule (an end date before a start date, a duplicate email).
>
> It matters for client error handling: a 400 usually signals a client bug to fix in code; a 422 usually signals a user-facing validation message to show.

> [!question]- A client gets intermittent 502s and 504s from the same endpoint. What's the first thing you'd check?
> Whether the upstream is actually responding at all. 504 means the gateway never got a response in time (a timeout, possibly an overloaded or hung upstream); 502 means the upstream *did* respond, just with something the gateway couldn't parse as a valid HTTP response.
>
> Check upstream latency/health for 504s, and the upstream's actual raw response (or a crash/panic mid-response) for 502s.

> [!question]- Trap: is `PATCH` always non-idempotent, and is `PUT` always idempotent?
> No to both, in practice. `PUT` is idempotent by definition (it replaces the whole resource with the given representation), but a buggy implementation that, say, appends to a log on every `PUT` would violate that contract.
>
> `PATCH` is usually not idempotent because partial-update documents often describe relative changes (`increment`), but a `PATCH` body that sets absolute values (`{"status":"shipped"}`) is idempotent in practice even though the method itself makes no such promise.

> [!question]- Why does HTTP need both `Secure` and `HttpOnly` on a cookie — isn't one enough?
> They block different attacks. `Secure` stops the cookie from ever being sent over plain HTTP, where a network observer could read it. `HttpOnly` stops client-side JavaScript from reading the cookie at all, which blocks an XSS payload from exfiltrating (secretly sending out) it even if the attacker got arbitrary script execution on the page. Either alone leaves the other attack path open.

> [!question]- What problem does `SameSite` solve, and what's the trade-off of `Strict` versus `Lax`?
> It controls whether a cookie is attached to a request that originated from a different site, which is the mechanism CSRF relies on (a malicious site makes your browser send a request to your bank, cookie included).
>
> `Strict` never sends the cookie cross-site, which is safest but breaks things like clicking a link from an email and landing already logged in; `Lax` (the modern browser default) allows the cookie on top-level navigations (clicking a link) but not on embedded cross-site requests (an image, a form auto-submit), balancing security and usability.

## 10. Cheat sheet 🟢

🟢 **Plain version:** A request says what you want (method and path) plus extra labels (headers); a response says how it went (status code) plus data. `GET` only reads; `PUT` and `DELETE` are safe to repeat; `POST` is not. 2xx worked, 4xx your mistake, 5xx the server's. Cookies carry your login because the server forgets you between requests. The dense list follows.

- Request = method + path + headers + optional body; response = status code + headers + optional body.
- Safe = never changes state (`GET`, `HEAD`, `OPTIONS`); idempotent = same effect if repeated (`GET`, `PUT`, `DELETE`, not `POST`, usually not `PATCH`).
- 401 = not authenticated; 403 = authenticated but not allowed.
- 400 = malformed/unparseable request; 422 = well-formed but semantically invalid.
- 502 = upstream answered badly; 503 = server/upstream overloaded or down; 504 = upstream never answered in time.
- `ETag` + `If-None-Match` → `304 Not Modified` avoids resending an unchanged body.
- Cookie attributes: `Secure` (HTTPS only), `HttpOnly` (no JS access), `SameSite` (cross-site sending policy), `Domain`/`Path` (scope).
- Keep-alive reuses one TCP connection across requests; it doesn't remove per-connection ordering until HTTP/2's multiplexing.

## Self-check 🟢🟡

> [!question]- 🟢 What are the parts of an HTTP request?
> A method, a path, headers, and an optional body.

> [!question]- 🟢 What does a 404 mean?
> The thing you asked for does not exist on the server.

> [!question]- 🟢 Why does a website need cookies to keep you logged in?
> HTTP remembers nothing between requests, so the browser must send the login cookie every time.

> [!question]- 🟡 Is `DELETE` idempotent even if the second call returns 404?
> Yes. Idempotent is about the end state (the item is gone), not about getting the same response.

> [!question]- 🟡 A logged-in user calls an admin-only endpoint. 401 or 403?
> 403: the server knows who they are, they are just not allowed.

> [!question]- 🟡 What does keep-alive save, and what does it not fix?
> It saves a new handshake per request, but requests on one HTTP/1.1 connection are still answered one at a time.

## Links

- **Before this:** [[TCP - Handshake, Reliability, Flow and Congestion Control]]
- **Next:** [[HTTP-1.1 vs HTTP-2 vs HTTP-3]], [[HTTP Caching - Cache-Control, ETag, Conditional Requests]], [[REST and HTTP API Design]]
- **Compare with:** [[Sessions and Cookies]] (cookies as a session mechanism, in depth), [[Idempotency and Idempotency Keys]] (handling non-idempotent retries), [[CORS and Same-Origin Policy]] and [[CSRF, XSS and Security Headers]] (the security side of cookies and headers)
- **Runnable code:** [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies - Go]]

### Watch on YouTube

- [How websites and HTTP work? Web Basics Crash Course](https://www.youtube.com/watch?v=iD2fgC74ZtA) · Mehul Mohan · covers methods, status codes, headers and cookies together in one crash course
- [HTTP Fundamentals in 10 Minutes](https://www.youtube.com/watch?v=qv5-5hhsKpE) · The Cyber Mentors · fast 10-minute recap good for pre-interview review
