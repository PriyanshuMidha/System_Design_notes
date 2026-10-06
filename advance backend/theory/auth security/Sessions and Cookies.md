# Sessions and Cookies

## Complete notes

Session auth stores login state on server, while cookie stores session id in browser.

## Easy explanation

Session auth stores login state on server, while cookie stores session id in browser.

In simple words: if you can explain `Sessions and Cookies` with one real request, one failure case, and one metric, you understand the topic much better than just memorizing the definition.

## Simple example

Think of a user trying to access a protected resource. This topic decides who the user is, what they are allowed to do, how tokens/secrets are protected, and how abuse is detected.

For `Sessions and Cookies`, ask yourself:

1. What is the normal happy path?
2. What can fail?
3. What is the tradeoff?
4. What would I monitor in production?

## Real-life examples

### Easy real-life example

A user logs in and opens their own profile page. The backend must know who the user is and only return that user's data.

### Difficult production example

A multi-tenant SaaS app has admins, members, API keys, OAuth login, refresh tokens, audit logs, and attackers trying credential stuffing or object-id guessing.

### How to relate this topic

When reading `Sessions and Cookies`, connect it to:

- one user action
- one backend component
- one failure case
- one tradeoff
- one metric

## Important points

- Core idea: `Sessions and Cookies` must be understood through its production use case, not just its definition.
- When to use it: Focus on identity, authorization boundary, token/session lifecycle, secret storage, abuse prevention, auditability, and OWASP API risks.
- At scale: explain the bottleneck, failure path, operational owner, and rollback/fallback.
- What to monitor: 401/403 rate, login failures, token refresh failures, suspicious IP/device activity, permission-denied spikes, and audit events.
- Interview rule: always give one concrete example, one tradeoff, one failure mode, and one metric.

## Diagram

```mermaid

flowchart LR
  Browser --> Cookie[session id cookie]
  Cookie --> API
  API --> Redis[(Session store)]
  Redis --> User[User data]
```

## Common mistakes

- Checking only authentication and forgetting object-level authorization.
- Storing secrets/tokens in logs, Git, frontend code, or Docker images.
- Using long-lived tokens without rotation or revocation strategy.
- Ignoring abuse flows such as credential stuffing and fake account creation.
- Not auditing sensitive actions.

## Quick revision

Session auth stores login state on server, while cookie stores session id in browser.

## Examples and deeper diagrams

### Session login flow

```mermaid
sequenceDiagram
  participant Browser
  participant API
  participant Redis
  Browser->>API: POST /login
  API->>Redis: store sessionId -> userId
  API-->>Browser: Set-Cookie sessionId HttpOnly Secure
  Browser->>API: GET /profile with cookie
  API->>Redis: lookup sessionId
  Redis-->>API: userId
  API-->>Browser: profile
```

### Cookie security flags

| Flag | Why it matters |
|---|---|
| HttpOnly | JavaScript cannot read cookie |
| Secure | sent only over HTTPS |
| SameSite | reduces CSRF risk |

### JWT vs Session

| Topic | JWT | Session |
|---|---|---|
| Stored state | client token | server store |
| Revoke easily | harder | easier |
| Good for | APIs/mobile | browser apps |


## Deep understanding checklist

To fully understand `Sessions and Cookies`, be able to answer:

1. Where does it sit in the architecture?
2. What production problem does it solve?
3. What is the simplest implementation?
4. What breaks when traffic or data grows?
5. What is the main failure mode?
6. What tradeoff does it introduce?
7. Which metric proves it is healthy?

Strong answer focus: Focus on identity, authorization boundary, token/session lifecycle, secret storage, abuse prevention, auditability, and OWASP API risks.

## Senior interview bank

These are topic-specific questions and strong answers for `Sessions and Cookies`.

### 1. What exact security bug can happen here?

The most dangerous bug is usually broken object-level authorization: the user is logged in but accesses another user's or tenant's resource. The fix is to check ownership/permission on every object access, not only at login.

### 2. How would you store and rotate secrets/tokens safely?

Use a secret manager, short-lived access tokens, refresh-token rotation, secure cookies where appropriate, least-privilege IAM, audit logs, and rotation. Never put secrets in Git, frontend code, Docker images, or logs.

### 3. How do you handle compromised credentials?

Revoke or rotate refresh tokens, invalidate sessions, force password reset or re-auth, rotate affected secrets, audit suspicious actions, and add detection for repeated abuse patterns.

### 4. What should be logged and what must not be logged?

Log request id, user id, tenant id, action, result, IP/device risk, and denial reason. Do not log passwords, full tokens, secrets, private keys, or sensitive payloads.

### 5. How does this fail at scale?

At scale, attackers distribute traffic across IPs, target expensive endpoints, abuse password reset/login, and probe authorization gaps. Defense needs tenant/user/API-key quotas, anomaly detection, WAF/bot controls, and audit trails.

## Topic-specific drill

### How would I answer `Sessions and Cookies` if the interviewer asks directly?

For `Sessions and Cookies`, I would explain the attacker model, authorization boundary, storage/secret risk, audit trail, and how abuse is detected.

### What is the trap question for `Sessions and Cookies`?

The trap is giving only a definition. A senior answer must include a concrete production example, a failure mode, a tradeoff, and a metric.

### What should I draw?

Draw the smallest flow that shows where `Sessions and Cookies` sits, then add the failure path next to the happy path.

## Reviewer checklist

- Can I explain this without reading the note?
- Can I draw the happy path and failure path?
- Can I name one concrete metric?
- Can I explain the tradeoff against a simpler option?
- Can I give a production example in under two minutes?
