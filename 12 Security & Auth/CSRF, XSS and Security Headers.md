---
tags: [security, web, auth]
level: intermediate
prereqs: ["[[Sessions and Cookies]]", "[[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]"]
related: ["[[CORS and Same-Origin Policy]]", "[[OWASP API Security Top 10]]", "[[TLS and HTTPS]]"]
sources:
  - "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
  - "OWASP Cross Site Scripting Prevention Cheat Sheet"
  - "MDN, Content-Security-Policy"
  - "RFC 6797, HTTP Strict Transport Security (HSTS)"
status: reviewed
updated: 2026-11-13
---

# CSRF, XSS and Security Headers

> [!summary] TL;DR
> CSRF tricks a logged-in victim's browser into sending a request they never meant to send; XSS tricks their browser into running an attacker's script on your page. Stop CSRF by making every state-changing request prove it came from your own page (a token, or `SameSite` cookies). Stop XSS by never putting untrusted data into HTML without encoding it, backed by a Content-Security-Policy that blocks inline scripts even if encoding fails somewhere.

> [!abstract] Core idea
> - CSRF abuses the browser's habit of attaching cookies to every request to your site, even ones triggered by another site.
> - XSS abuses a page that renders attacker-controlled text as HTML or JavaScript instead of as plain text.
> - The fix for each is structural: CSRF tokens + `SameSite` cookies for the first, output encoding + CSP for the second. Neither fixes the other.
> - Security headers (CSP, HSTS, `X-Content-Type-Options`, `frame-ancestors`) are a second line of defense: they contain the damage when a specific encoding or validation bug slips through.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and 10 (why, mental model and the cheat sheet). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add sections 3, 4, 5 and 6 (how it works, a worked example, options and trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add sections 7, 8 and 9 (production, deep dive and interview questions). Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Sessions and Cookies]]: after login your browser holds a session cookie and sends it with every request to that site, which is exactly what CSRF abuses.
> - [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]: GET should only read, POST/PUT/DELETE change things, and responses carry headers the browser obeys.

**From zero, in 60 seconds** 🟢

Your browser sends your login cookie to a site every time you talk to that site, even if another page started the request.
**CSRF** abuses that: an evil page makes your browser send "move money" to your bank, and the cookie goes along.

```mermaid
flowchart LR
    E["Evil page"] -- "hidden form" --> B["Your browser"] -- "POST /transfer + your cookie" --> K["Bank"]
```

**XSS** is different: an attacker gets their own script to run inside the real site's page, so it can do anything you can do there.

```mermaid
flowchart LR
    A["Attacker saves a comment<br/>with &lt;script&gt;"] --> S["Site shows the comment"] --> V["Script runs in every<br/>visitor's browser"]
```

The fix for CSRF: each real form carries a secret token the evil page can't know.
The fix for XSS: always encode user text before putting it in HTML, so it shows as text and never runs.
Security headers are a safety net that tell the browser what is allowed.

The rest of this note is just these 3 questions:
1. How do tokens and SameSite cookies stop CSRF?
2. Where does XSS come from, and how does encoding stop it?
3. Which headers to send as a backup?


**The problem in one story.**
You are logged into your bank in one tab.
You open a bad website in another tab, and it secretly submits a "send money" form to your bank; your browser adds your bank cookie for you (CSRF).
Or a bad comment on a site contains a script that runs in every visitor's browser (XSS).
This note shows how to block both and how browser security headers limit the damage.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Cookie | Small value the browser stores and sends back to a site automatically | `session=abc123` |
| Session | The server remembering you are logged in | Session ID mapped to user 42 |
| CSRF | Another site making your browser send a request you did not mean | Hidden form posting to `/transfer` |
| XSS | Attacker JavaScript running inside your page | `<script>` saved in a comment |
| Encoding (escaping) | Turning special characters into safe text | `<` becomes `&lt;` |
| `SameSite` | Cookie flag limiting when cookies go on cross-site requests | `SameSite=Lax` |
| CSP | A header listing which scripts the page may run | `script-src 'self'` |
| Same-origin policy | Browser rule: one site's script cannot read another site's pages or cookies | evil.com cannot read your bank page |
| Synchronizer token (CSRF token) | A secret value placed in your own forms and checked on submit | Hidden field `csrf_token=t1` |
| DOM | The browser's live model of the page that JavaScript can change | `element.innerHTML = ...` |
| Clickjacking | Hiding your real page under a fake one so a click lands on a button the user did not see | Invisible "Delete account" under "Win a prize" |
| HSTS | A header telling the browser "only ever use HTTPS for this site" | `Strict-Transport-Security: max-age=63072000` |
| Nonce | A random one-time value; in CSP it marks the few inline scripts you trust | `<script nonce="r4nd0m">` |

**Picture it**

```mermaid
flowchart LR
    A["Attacker"] -- "forged form" --> C["CSRF: victim browser<br/>sends request + cookie"]
    A -- "malicious text" --> X["XSS: script runs<br/>inside your page"]
    C --> F1["Fix: CSRF token +<br/>SameSite cookie"]
    X --> F2["Fix: output encoding<br/>+ CSP header"]
```

**Analogy.** CSRF is someone slipping a signed cheque into your stack for you to hand over; XSS is someone sneaking into your office and acting from your desk.
Where it breaks: real cheques need your signature each time; browsers attach cookies automatically, which is exactly why CSRF works.

**How the rest of this note builds up**

- First, the bank-transfer attacks for CSRF and XSS (section 1) and the mental model (section 2).
- Then CSRF tokens with `SameSite`, the three XSS types, output encoding, and security headers (section 3).
- Then Go code: a stateless CSRF token and a security-headers middleware (section 4), plus a comparison (section 5).
- Finally the SDE-3 deep dive: trade-offs, production rollout of CSP, and edge cases (sections 6-8).

> [!tip] Remember
> CSRF: prove the request came from your page (token + `SameSite`). XSS: encode untrusted output and back it with CSP.

## 1. Why it exists 🟢

Say `bank.example.com` lets a logged-in user move money with:

```text
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: session=abc123
Content-Type: application/x-www-form-urlencoded

to=mallory&amount=5000
```

The browser attaches the `session` cookie automatically to *any* request to `bank.example.com`, no matter which page triggered it. So an attacker hosts a page with:

```html
<form id="f" action="https://bank.example.com/transfer" method="POST">
  <input type="hidden" name="to" value="mallory">
  <input type="hidden" name="amount" value="5000">
</form>
<script>document.getElementById('f').submit()</script>
```

If the victim is logged into the bank in another tab and visits that page, their browser submits the form, cookie and all. The bank sees a perfectly authenticated request — it just never came from the bank's own UI. That is **Cross-Site Request Forgery (CSRF)**: the attacker forges a request, the victim's browser supplies the proof of identity.

**Cross-Site Scripting (XSS)** is the other direction: instead of forging a request, the attacker gets *their own JavaScript* to run inside your page, in the victim's authenticated session. If a comment box echoes `<script>fetch('/transfer?to=mallory&amount=5000',{method:'POST'})</script>` back into the page without encoding it, every visitor who views that comment runs the attacker's script with their own cookies and permissions. The output above is itself a CSRF-less transfer, launched by XSS instead of a forged form.

### Real-life example: a review box on a shopping site 🟢

Think of the review section under a product on an app like Flipkart or Amazon. If the site showed reviews as raw HTML, someone could post a "review" containing a script, and every shopper who opened that product page would run it while logged in, maybe changing their delivery address (stored XSS). Separately, if the "change address" button only checked the cookie, any random web page could quietly submit that form for a logged-in shopper (CSRF). Real shops encode every review as plain text, put a secret token in every form, and send security headers as a safety net.

### CSRF vs XSS 🟡

| | CSRF | XSS |
| --- | --- | --- |
| Where the attacker's code runs | On the attacker's own site | Inside your real page |
| What it can do | Send one forged request with your cookie | Anything you can do on that page |
| Main fix | CSRF token + `SameSite` cookie | Encode output + CSP |
| Does a CSRF token help against the other? | — | No: a script on your page can read the token |

## 2. Mental model 🟢

- **CSRF**: the browser is a courier that stamps every envelope to your bank with your signature (the cookie), regardless of who hands it the envelope. The fix is to also require a one-time password written only on the bank's own paperwork (the CSRF token) or to tell the courier not to deliver on behalf of other senders at all (`SameSite`).
- **XSS**: your page is a whiteboard; untrusted input is a marker someone else hands you. If you write their text onto the board as *marker strokes you draw* (HTML), they can draw a `<script>` tag. If you write it as *quoted text in a sealed envelope* (HTML-encoded), their input can never become new markup.

## Common beginner mistakes 🟢

- **Changing data with a GET link (`/delete?id=5`)** → any image tag or link on another site can trigger it → use POST/DELETE for changes, with a CSRF token.
- **Building HTML by gluing strings** → a `<script>` in user text becomes real code → use `html/template` (Go) or the framework's default escaping.
- **Escaping on save instead of on display** → the stored text is mangled and other contexts (URLs, JS) are still open → encode when you render, for that exact spot.
- **Adding `'unsafe-inline'` to make CSP errors go away** → injected scripts run again → move scripts to files or use nonces.
- **Relying on `SameSite` alone** → a GET with side effects or a same-site attacker still gets through → use `SameSite` and CSRF tokens together.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** the two attacks: CSRF fakes a request using your cookie, XSS runs a stranger's script inside your page. **Next we open the box**: how CSRF tokens and `SameSite` block the first, where XSS sneaks in and how encoding blocks it, and which headers act as a safety net.

### CSRF: tokens and SameSite together

**In plain words:** give each real page a secret ticket, and also tell the browser not to send the cookie on cross-site requests. Two locks are better than one.

**Step by step:**
1. Priya opens the bank's transfer page. The bank puts a hidden field `csrf_token=t1` in the form, tied to her session.
2. She submits; the browser sends her cookie and `t1`. The bank checks `t1` matches her session → allowed.
3. In another tab, evil.example auto-submits a transfer form to the bank. Its script cannot read the bank page, so it has no `t1`.
4. With `SameSite=Lax`, the browser also leaves the cookie off this cross-site POST.
5. The bank sees no valid token (and no cookie) → 403.

```mermaid
sequenceDiagram
    participant Browser
    participant Bank as bank.example.com
    participant Evil as evil.example

    Browser->>Bank: GET transfer-form, logged in
    Bank-->>Browser: HTML with hidden csrf_token t1 tied to session
    Note over Browser,Bank: Legitimate transfer
    Browser->>Bank: POST transfer, cookie session, body has csrf_token t1
    Bank->>Bank: token matches session, allow
    Bank-->>Browser: 200 OK

    Note over Browser,Evil: Attacker's page in another tab
    Browser->>Evil: GET free-prize
    Evil-->>Browser: auto-submitting form to bank, no csrf_token, attacker cannot read it
    Browser->>Bank: POST transfer, cookie session, body has no csrf_token
    Bank->>Bank: token missing or wrong, reject
    Bank-->>Browser: 403 Forbidden
```

The synchronizer-token pattern works because of the **same-origin policy**: `evil.example`'s JavaScript cannot read a token embedded in `bank.example.com`'s page or in a non-HttpOnly cookie set by the bank, so it cannot forge a matching value, even though it can still *send* a request with the ambient cookie (the cookie the browser attaches by itself).

`SameSite` is a second, independent control set on the cookie itself: `Strict` withholds the cookie on every cross-site request, `Lax` sends it only on top-level `GET` navigation, and `None` always sends it (the full attribute table lives in [[Sessions and Cookies]]).

`SameSite=Lax` alone stops the form-POST example, because the cookie is withheld on a cross-site `POST`. It does **not** stop a cross-site `GET` that has a side effect (`GET /transfer?to=mallory&amount=5000`, which is also just bad API design — see [[OWASP API Security Top 10]]), and it does not stop XSS running same-origin.

Use CSRF tokens and `SameSite=Lax`/`Strict` together, not one instead of the other, and never put state-changing actions behind `GET`.

### XSS: three places the attacker's string lands

**In plain words:** the bad script can be saved in your database, bounced back from the URL, or added by your own front-end code. Same harm, different entry door.

**Step by step:**
1. Stored: Mallory posts a comment with `<script>`. It is saved and shown to every later visitor.
2. Reflected: Mallory sends Priya a link like `/search?q=<script>...`. The server copies `q` into the results page, so only Priya, who clicked, is hit.
3. DOM: Mallory sends a link ending `#name=<img onerror=...>`. The page's own JavaScript reads that part and writes it with `innerHTML`; the server never saw it.
4. In all three, the browser treats attacker text as code, and it runs with the victim's login.

| Variant | Where the payload is stored | Who gets hit |
| --- | --- | --- |
| **Stored XSS** | Saved server-side (a comment, a profile bio, a support ticket) and rendered to other users later | Every user who later views that page |
| **Reflected XSS** | Bounced straight back in the response from a request parameter (a search box echoing `?q=` into "No results for …") | Only the victim who clicks a crafted link |
| **DOM XSS** | Never touches the server at all; client-side JS reads something attacker-controlled (`location.hash`, the part of the URL after `#`; `document.referrer`, the page you came from) and writes it into the DOM with `innerHTML` or `document.write` | Only the victim who loads the crafted URL |

```mermaid
flowchart LR
    subgraph Stored
        A1["Attacker posts comment\ncontaining &lt;script&gt;"] --> A2["Saved to DB as-is"] --> A3["Victim loads page later"] --> A4["Script runs in victim's session"]
    end
    subgraph Reflected
        B1["Attacker sends victim a link\n?q=&lt;script&gt;...&lt;/script&gt;"] --> B2["Server echoes q into HTML response"] --> B3["Victim's browser renders it"] --> B4["Script runs in victim's session"]
    end
    subgraph DOM
        C1["Attacker sends victim a link\n#name=&lt;img onerror=...&gt;"] --> C2["Client JS reads location.hash"] --> C3["JS writes it via innerHTML"] --> C4["Script runs, server never saw the payload"]
    end
```

All three share one root cause: untrusted data crossed from "data" to "markup/code" without encoding for the context it landed in.

### Output encoding: the actual fix

**In plain words:** turn special characters like < into harmless text before showing them. The right way to encode depends on where the text lands (HTML, attribute, URL, JS).

**Step by step:**
1. A user saves the comment `<script>alert(1)</script>`. Store it exactly as typed.
2. When showing it inside a `<div>`, turn `<` into `&lt;` and `>` into `&gt;` (HTML entities, the "show this symbol as text" codes).
3. The browser now draws the characters `<script>` on screen instead of running them.
4. If the same text goes into a link or a JavaScript string instead, use that spot's own escaping rules.
5. In Go, `html/template` does steps 2-4 for you based on where the value sits.

Encoding must match the **context** the data lands in — HTML body, HTML attribute, URL, or JavaScript string — because each context has different special characters:

| Context | Example sink | What must be encoded |
| --- | --- | --- |
| HTML body | `<div>{{text}}</div>` | `< > & " '` → entities |
| HTML attribute | `<input value="{{text}}">` | Quotes especially; never leave an attribute unquoted |
| URL | `<a href="{{url}}">` | Percent-encode; also validate the scheme (reject `javascript:`) |
| JavaScript string literal | `var x = "{{text}}";` | JS string escaping, not HTML escaping — a common mix-up |

Go's `html/template` (unlike `text/template`) does exactly this automatically, picking the encoding based on where in the HTML tree the value sits:

```go
package render

import (
	"html/template"
	"strings"
)

var tmpl = template.Must(template.New("comment").Parse(
	`<div class="comment">{{.Body}}</div>`))

// Render returns the comment rendered as safe HTML; html/template
// context-encodes .Body for the HTML-body position automatically.
func Render(body string) (string, error) {
	var sb strings.Builder
	if err := tmpl.Execute(&sb, struct{ Body string }{Body: body}); err != nil {
		return "", err
	}
	return sb.String(), nil
}
```

`<script>alert(1)</script>` comes back as `&lt;script&gt;alert(1)&lt;/script&gt;` — text, not markup. The bug class this fixes is using `text/template` (or raw string concatenation, or React's `dangerouslySetInnerHTML`, or Vue's `v-html`) to build HTML from untrusted input.

### Security headers: the second line of defense

**In plain words:** these are rules you send to the browser, like "only run scripts from my own site". If an encoding bug slips through, the browser still blocks the attack.

**Step by step:**
1. Your server adds four headers to every response, once, in middleware.
2. A new page forgets to encode a comment, and an injected `<script>` lands in the HTML.
3. The browser reads `Content-Security-Policy: script-src 'self'`, sees the script is inline and not from your own files, and refuses to run it.
4. Meanwhile HSTS keeps the connection on HTTPS, `nosniff` stops uploaded text being run as HTML, and `frame-ancestors 'none'` stops other sites from framing your page.

Encoding bugs still happen — a new template, a `v-html`, a third-party widget. Security headers assume one will, and cap the damage:

```mermaid
flowchart TB
    Req["Browser requests the page"] --> Resp["Server response headers"]
    Resp --> CSP["Content-Security-Policy:\ndefault-src 'self'; script-src 'self'"]
    Resp --> HSTS["Strict-Transport-Security:\nmax-age=63072000"]
    Resp --> XCTO["X-Content-Type-Options: nosniff"]
    Resp --> FA["frame-ancestors 'none'"]
    CSP --> E1["Inline/injected &lt;script&gt; blocked\neven if encoding missed it"]
    HSTS --> E2["Browser refuses plain HTTP\nto this host, even if a link says http://"]
    XCTO --> E3["Browser won't sniff a text/plain\nupload as HTML and execute it"]
    FA --> E4["Page can't be framed by another\norigin -> no clickjacking overlay"]
```

- **Content-Security-Policy (CSP)**: an allowlist for where scripts, styles and resources may load from. `script-src 'self'` means an injected `<script>` tag or `onerror="..."` attribute simply does not execute, because inline script isn't on the allowlist — this is what actually contains most real-world stored XSS, on top of encoding.
- **frame-ancestors**: part of CSP (`frame-ancestors 'none'` or a list of trusted origins); it tells the browser which origins may embed this page in an `<iframe>`. It replaces the older `X-Frame-Options: DENY`/`SAMEORIGIN` header and stops clickjacking — an attacker overlaying your page in a transparent iframe to trick a click into, say, approving a transfer.
- **HSTS (`Strict-Transport-Security`)**: once a browser has seen this header over HTTPS, it refuses to connect over plain HTTP to that host for `max-age` seconds, even if the user types `http://` or clicks an old link. This closes the window for a network attacker to downgrade the connection (force it back to plain, readable HTTP) and steal the session cookie; see [[TLS and HTTPS]] for the handshake it protects. `preload` submits the host to browsers' built-in HSTS list, so even the very first request is HTTPS-only.
- **X-Content-Type-Options: nosniff**: stops the browser from guessing a response's type from its content instead of trusting `Content-Type`. Without it, a file uploaded as `Content-Type: text/plain` but containing HTML can be sniffed and rendered as HTML, reviving an XSS path through a file-upload feature.

## 4. Worked example 🟡

### Whiteboard version

The minimum you need to remember: generate an HMAC over the session ID and an expiry, hand it to the page, and check it (constant-time) on every state-changing request. Encode on output, always. Set the four headers once in middleware.

### Go: a stateless CSRF token

**In plain words:** the token is a signed note saying "for session X, valid until time T". The server can check it without storing anything.

A synchronizer token that needs no server-side storage: it is an HMAC over the session ID plus an expiry, so any server instance holding the shared secret can validate it. Compiles and passes `go vet` and `go test -race` on Go 1.24.

```go
// Package csrf implements a stateless synchronizer-style CSRF token:
// an HMAC over the session ID plus a timestamp, so the server never has to
// store issued tokens.
package csrf

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
)

var ErrInvalidToken = errors.New("csrf: invalid or expired token")

// Generate returns a token bound to sessionID, valid for maxAge from now.
func Generate(secret []byte, sessionID string, now time.Time, maxAge time.Duration) string {
	exp := now.Add(maxAge).Unix()
	mac := sign(secret, sessionID, exp)
	payload := fmt.Sprintf("%d.%s", exp, mac)
	return base64.RawURLEncoding.EncodeToString([]byte(payload))
}

// Validate checks the token against the session making the request.
// It is constant-time and rejects expired or tampered tokens.
func Validate(secret []byte, sessionID, token string, now time.Time) error {
	raw, err := base64.RawURLEncoding.DecodeString(token)
	if err != nil {
		return ErrInvalidToken
	}
	parts := strings.SplitN(string(raw), ".", 2)
	if len(parts) != 2 {
		return ErrInvalidToken
	}
	exp, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return ErrInvalidToken
	}
	if now.Unix() > exp {
		return ErrInvalidToken
	}
	want := sign(secret, sessionID, exp)
	if subtle.ConstantTimeCompare([]byte(want), []byte(parts[1])) != 1 {
		return ErrInvalidToken
	}
	return nil
}

func sign(secret []byte, sessionID string, exp int64) string {
	h := hmac.New(sha256.New, secret)
	fmt.Fprintf(h, "%s.%d", sessionID, exp)
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}
```

Test, including the tamper and expiry cases that matter for this design:

```go
package csrf

import (
	"testing"
	"time"
)

func TestValidateAcceptsFreshToken(t *testing.T) {
	secret := []byte("server-only-secret")
	now := time.Date(2026, 11, 7, 12, 0, 0, 0, time.UTC)
	tok := Generate(secret, "session-abc", now, 2*time.Hour)

	if err := Validate(secret, "session-abc", tok, now.Add(time.Minute)); err != nil {
		t.Fatalf("expected valid token, got %v", err)
	}
}

func TestValidateRejectsWrongSession(t *testing.T) {
	secret := []byte("server-only-secret")
	now := time.Date(2026, 11, 7, 12, 0, 0, 0, time.UTC)
	tok := Generate(secret, "session-abc", now, 2*time.Hour)

	if err := Validate(secret, "session-xyz", tok, now); err == nil {
		t.Fatal("expected error for mismatched session, got nil")
	}
}

func TestValidateRejectsTamperedToken(t *testing.T) {
	secret := []byte("server-only-secret")
	now := time.Date(2026, 11, 7, 12, 0, 0, 0, time.UTC)
	tok := Generate(secret, "session-abc", now, 2*time.Hour)
	tampered := tok[:len(tok)-1] + "x"

	if err := Validate(secret, "session-abc", tampered, now); err == nil {
		t.Fatal("expected error for tampered token, got nil")
	}
}

func TestValidateRejectsExpiredToken(t *testing.T) {
	secret := []byte("server-only-secret")
	now := time.Date(2026, 11, 7, 12, 0, 0, 0, time.UTC)
	tok := Generate(secret, "session-abc", now, time.Minute)

	if err := Validate(secret, "session-abc", tok, now.Add(2*time.Minute)); err == nil {
		t.Fatal("expected error for expired token, got nil")
	}
}
```

**Measured:** `go test -race ./csrf/...` on Go 1.24.4: 4/4 tests pass (fresh token, wrong session, tampered token, expired token all behave as asserted).

### Go: the security-headers middleware

**In plain words:** one small wrapper adds the safety headers to every response, so no handler can forget them.

```go
// Package secheaders sets the response headers that blunt XSS and
// clickjacking even if an encoding bug slips through.
package secheaders

import "net/http"

// Middleware sets CSP, HSTS, X-Content-Type-Options and a frame-ancestors
// policy on every response. Wrap your router with it once, at the top.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		// default-src 'self' blocks inline/third-party script unless whitelisted;
		// frame-ancestors 'none' replaces the legacy X-Frame-Options: DENY.
		h.Set("Content-Security-Policy",
			"default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'")
		// Only send on HTTPS responses; max-age is 2 years, as the preload list requires.
		h.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		// Stops the browser from guessing a text/plain upload is HTML/JS and running it.
		h.Set("X-Content-Type-Options", "nosniff")
		next.ServeHTTP(w, r)
	})
}
```

```go
package secheaders

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestMiddlewareSetsSecurityHeaders(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	ts := httptest.NewServer(Middleware(inner))
	defer ts.Close()

	resp, err := http.Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if got := resp.Header.Get("X-Content-Type-Options"); got != "nosniff" {
		t.Fatalf("X-Content-Type-Options = %q, want nosniff", got)
	}
	csp := resp.Header.Get("Content-Security-Policy")
	if !strings.Contains(csp, "frame-ancestors 'none'") {
		t.Fatalf("CSP missing frame-ancestors: %q", csp)
	}
	if !strings.Contains(resp.Header.Get("Strict-Transport-Security"), "max-age=63072000") {
		t.Fatalf("HSTS header missing or wrong: %q", resp.Header.Get("Strict-Transport-Security"))
	}
}
```

**Measured:** `go test -race ./secheaders/...` on Go 1.24.4: 1/1 test passes; all three headers present with the expected values.

In `06 Backend Engineering in Go`, [[Secure Coding for Go Services]] shows where this middleware sits in a full Go service's middleware chain, alongside input validation and the other hardening steps.

## 5. Variants and comparison 🟡

| Defense | Stops | Does not stop | Cost |
| --- | --- | --- | --- |
| CSRF synchronizer token | Cross-site forged state-changing requests | XSS (same-origin script can read the page's own token) | A token to generate, embed and verify per form/request |
| `SameSite=Lax`/`Strict` cookie | Cross-site forged `POST`/fetch requests carrying the cookie | Same-origin XSS; legitimate cross-site embeds need `None` | One attribute; breaks nothing for same-site apps |
| Double-submit cookie (token also set as a readable cookie, compared to a header/body value) | Cross-site forged requests, without server-side session storage | Needs the cookie to be readable by JS (not `HttpOnly`) unless combined with signing | Simpler infra than synchronizer tokens; slightly weaker if subdomains can set cookies |
| Output encoding (`html/template`, React/Vue default escaping) | Stored, reflected and DOM XSS at the point of render | A deliberate `dangerouslySetInnerHTML`/`v-html`/raw concatenation bypass | Essentially free; must be applied everywhere, every time |
| CSP (`script-src 'self'`) | Execution of injected inline scripts and scripts from unapproved origins | A payload hosted at an origin already on the allowlist | Requires auditing every inline script/style and third-party resource first |
| HSTS | Protocol-downgrade and cookie theft over a later plain-HTTP connection | Anything once TLS itself is compromised | One header; irreversible for `max-age` once a browser has seen it |

## 6. Trade-offs and when not to use 🟡

- A CSRF token on every GET is overkill: GET must never have side effects, so only state-changing requests (POST/PUT/PATCH/DELETE) need one.
- `SameSite=Strict` on the session cookie breaks "arrive via an external link while already logged in" flows (the cookie isn't sent on the first navigation); `Lax` is usually the right default.
- A strict CSP breaks any inline `<script>` or `onclick="..."` attribute in old templates; rolling it out needs an audit pass or a report-only phase (`Content-Security-Policy-Report-Only`) first.
- Pure API services authenticated only with a bearer token in an `Authorization` header (never a cookie) are not exposed to classic CSRF, because the browser does not attach that header automatically — but they still need XSS defenses if any browser client renders untrusted content.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how tokens and `SameSite` stop CSRF, how encoding stops XSS, and what each security header adds. **Next we look at real systems**: how frameworks ship these defenses, what breaks in production (AJAX tokens, rich text, CSP vs widgets), and the finer points such as nonces, double-submit cookies and Trusted Types.


- **Real systems:** Django, Rails and Spring ship CSRF middleware on by default; GitHub and most banks pair CSRF tokens with `SameSite=Lax`; Gmail and most SPA-heavy (single-page app: mostly JavaScript in the browser) sites run a strict CSP with nonces for the handful of scripts they must allow inline.
- **Failure modes → fixes:**
  - CSRF token not sent on an AJAX request (a background request made by page JavaScript) because it isn't in the form body → read it from a cookie-readable, non-`HttpOnly` copy and attach it as a custom header (`X-CSRF-Token`), which also happens to be blocked by CORS for cross-origin callers.
  - A new feature uses `v-html`/`dangerouslySetInnerHTML` to render "rich" user bios → sanitize with an allowlist library (DOMPurify, which strips everything except a safe list of tags) or drop the feature; CSP `script-src` is the backstop, not the primary control.
  - CSP breaks a third-party widget → add its exact origin to the allowlist, never fall back to `'unsafe-inline'`.
  - A reverse proxy or CDN strips security headers → set them at the edge too, and test with the real public hostname, not `localhost`.
- **What to monitor:** CSP violation reports (`report-uri`/`report-to`), rate of 403s from CSRF validation (spikes mean a client bug, not just attacks), and any response missing the security headers (a header-set regression test in CI catches this before production).

## 8. Deep dive 🔴

- **Why `SameSite=Lax` still allows top-level GET navigation**: browsers special-cased top-level navigations (clicking a link) so that "log in via an emailed link" keeps working, while still blocking the cross-site auto-submitting `POST` form from the opening example. This is a deliberate compromise, not an oversight — don't rely on it for anything with a side effect.
- **Double-submit cookie vs synchronizer token**: double-submit avoids server-side token storage by setting the token as a cookie *and* requiring the client to also send it as a header or body field; same-origin JS can read the cookie and echo it back, but cross-site JS cannot read another origin's cookie, so it can't forge the matching header. It is weaker than a session-bound synchronizer token if an attacker can set cookies on a sibling subdomain, which is why signing the double-submit value (HMAC over a random value, as above) is the safer variant.
- **CSP nonces for necessary inline scripts**: when a script truly must be inline (a server-rendered bootstrap payload), generate a random nonce per response, put it in both the CSP header (`script-src 'nonce-<value>'`) and the `<script nonce="...">` tag; an attacker's injected script has no way to know the nonce in advance.
- **Trusted Types** (Chrome, behind a CSP directive) go one step further than CSP's origin allowlisting: they make the browser itself refuse to pass a plain string into `innerHTML`/`document.write` unless it was produced by a sanitizing function the page registered, closing off DOM XSS sinks at the API level rather than the network-origin level.
- **Why `X-Content-Type-Options` matters for uploads specifically**: a user-generated-content domain that serves an uploaded `.txt` file with a sniffable HTML-like payload can have it rendered as HTML by a browser that ignores the declared `Content-Type` — `nosniff` forces the browser to trust the header, which is also why that header must be set correctly in the first place.

## 9. Interview questions 🔴

> [!question]- Does `SameSite=Lax` make CSRF tokens unnecessary?
> No. `Lax` blocks cross-site `POST`/fetch requests from carrying the cookie, which stops the classic auto-submitting form attack, but it still sends the cookie on a top-level cross-site `GET` navigation. Keep CSRF tokens for state-changing endpoints and never let `GET` have side effects; use both controls together.

> [!question]- A teammate says "we use JWTs in an `Authorization` header, so we don't need CSRF protection." Are they right?
> Mostly yes, for that specific endpoint: a browser does not attach a custom header automatically the way it does a cookie, so a forged cross-site form or fetch can't make the request look authenticated. But if any token is also mirrored into a cookie (for SSR, server-side rendering, for example), that endpoint is exposed again and needs the same defenses as a cookie-based session.

> [!question]- Trap: "We escape everything before storing it in the database, so we're safe from XSS." What's wrong with this?
> Encoding belongs at the **output** boundary, matched to the context it renders into (HTML body vs attribute vs URL vs JS string), not at the input/storage boundary. Encoding on input corrupts the stored data (search, exports, APIs all see mangled text) and still doesn't protect a different rendering context, like inserting the same stored value into a `<script>` block or an `href`.

> [!question]- What is the difference between stored, reflected and DOM XSS, and why does it matter which one you have?
> Stored XSS persists on the server and hits every viewer; reflected XSS only fires for someone who clicks a crafted link, because the payload lives in the request itself; DOM XSS never touches the server — a client-side script reads an attacker-controlled value (`location.hash`) and writes it unsafely into the DOM. It matters because the fix differs: stored and reflected need server-side encoding on render, while DOM XSS needs the client-side JavaScript itself to avoid unsafe sinks (`innerHTML`, `document.write`) regardless of what the server ever saw.

> [!question]- Why pair CSP with output encoding instead of picking one?
> Encoding stops the attacker's string from ever becoming markup in the first place; CSP stops injected markup from executing even if encoding was missed somewhere (a new template, a third-party widget, a `v-html`). They cover different failure points: encoding is the primary control, CSP is defense in depth for when encoding fails.

> [!question]- What does `frame-ancestors 'none'` actually prevent, concretely?
> It stops any other origin from embedding your page in an `<iframe>`. Without it, an attacker can overlay your page (say, a "delete account" confirmation) under a transparent decoy button on their own site, so a victim's genuine click lands on your page instead — a clickjacking attack. It supersedes the older `X-Frame-Options` header.

> [!question]- Your CSP blocks a legitimate third-party payment widget. What's the wrong fix, and what's the right one?
> The wrong fix is adding `'unsafe-inline'` or `*` to `script-src`, which defeats the policy for everything, not just the widget. The right fix is adding the widget's exact origin to the relevant directive (and, if it genuinely needs inline execution, giving it a per-response nonce instead of a blanket allowance).

## 10. Cheat sheet 🟢

- CSRF: browser forges a state-changing request using the victim's ambient cookie; fix with a session-bound token on every mutating request **and** `SameSite=Lax`/`Strict`.
- XSS: attacker's data becomes executable markup; fix by encoding for the exact output context, every time, at render — not at input.
- Stored XSS hits every viewer later; reflected XSS needs a crafted link per victim; DOM XSS never touches the server at all.
- `html/template` (not `text/template`) context-encodes automatically in Go; the equivalent trap elsewhere is `dangerouslySetInnerHTML`/`v-html`.
- CSP `script-src 'self'` is the backstop that blocks injected inline scripts even when encoding is missed.
- `frame-ancestors 'none'` stops clickjacking; HSTS stops protocol downgrade; `X-Content-Type-Options: nosniff` stops MIME sniffing turning an upload into HTML.
- Pure bearer-token APIs (no cookie) are largely CSRF-immune by construction, but still need XSS defenses wherever they render content in a browser.

## Self-check 🟢🟡

> [!question]- (easy) In CSRF, whose browser sends the forged request?
> The victim's own browser, with their cookie attached.

> [!question]- (easy) In XSS, where does the attacker's code run?
> Inside your real page, in the victim's browser.

> [!question]- (easy) What does encoding turn `<` into in HTML?
> `&lt;`, so it shows as text and never becomes a tag.

> [!question]- (medium) Why can't evil.example just copy the CSRF token?
> The same-origin policy stops its script from reading the bank's page or cookies, so it never sees the token.

> [!question]- (medium) Your API uses only a bearer token in the `Authorization` header, no cookies. Is it open to classic CSRF?
> Mostly no; browsers do not attach that header by themselves. It still needs XSS defenses.

> [!question]- (medium) What does `Content-Security-Policy: script-src 'self'` stop?
> Inline and outside scripts, so an injected `<script>` does not run even if encoding was missed.

## Links

- **Before this:** [[Sessions and Cookies]], [[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]
- **Next:** [[OWASP API Security Top 10]], [[Secrets Management]]
- **Compare with:** [[CORS and Same-Origin Policy]] (a different browser control: who may *read* a response, not who may *send* a request), [[TLS and HTTPS]] (what HSTS is protecting), [[Secure Coding for Go Services]] (where this middleware sits in a full Go service)

### Watch on YouTube

- [API Security Explained: Rate Limiting, CORS, SQL Injection, CSRF, XSS & More](https://www.youtube.com/watch?v=FsB_nRGdeLs) · Hayk Simonyan · 8 min · 501,701 views
- [Why Your Token Storage Could Be Your Biggest Security Risk - XSS and CSRF Attack in Action](https://www.youtube.com/watch?v=vTroMvQy6K0) · LearnThatStack · 5 min · 18,388 views
