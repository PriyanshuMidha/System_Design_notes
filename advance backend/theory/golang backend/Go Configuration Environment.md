# Go Configuration Environment

## What to build

Create app config loaded from environment variables.

## Config fields

```text
APP_ENV
HTTP_ADDR
DATABASE_URL
REDIS_ADDR
JWT_SECRET
RAZORPAY_WEBHOOK_SECRET
LOG_LEVEL
```

## Rules

- fail fast if required config is missing
- never commit secrets
- keep config typed
- pass config through dependencies
- different config for local/test/prod

## Common mistakes

- reading env vars everywhere
- hardcoding secrets
- no validation on startup
- using production secrets locally

## Connect to notes

- [[Secrets Management]]
- [[Go Deployment Docker]]
- [[Docker Content Table]]

## Coding task

Build `internal/config` with `Load()` and tests for missing required config.
