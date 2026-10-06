# Go Security for Backend

## Complete notes

Security in a Go backend is mostly about safe API design, safe storage, safe crypto usage, and safe operational defaults.

## Must know

- validate input
- use parameterized SQL
- verify authentication
- enforce object-level authorization
- hash passwords with a strong password hashing algorithm
- do not write custom crypto
- verify webhook signatures
- limit request body size
- rate limit public endpoints
- keep secrets in environment/secret manager
- avoid logging sensitive data
- set secure cookies correctly if using cookies

## Webhook security

For payment webhooks:

1. read raw body
2. verify signature
3. parse event
4. check event id/idempotency
5. process transactionally
6. return stable response

## Common mistakes

- trusting `user_id` from request body
- no authorization check on resource ownership
- string-building SQL
- long-lived tokens without revocation
- no rate limit on login
- logging tokens
- no CSRF protection with cookie auth

## Interview answer

I treat auth and authorization separately, validate every request, verify ownership at the database/service layer, use parameterized SQL, verify webhooks, and make sensitive operations idempotent and auditable.
