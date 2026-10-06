# Go Deployment Docker

## Complete notes

Go is easy to deploy because it builds to a single binary.

## Build

```bash
go build -o invoiceops ./cmd/api
```

## Docker idea

Use a multi-stage Dockerfile:

1. build binary in Go image
2. copy binary into small runtime image
3. run as non-root user
4. pass config through environment variables

## Production checklist

- environment config
- health endpoint
- readiness endpoint
- graceful shutdown
- database migrations
- logs to stdout/stderr
- metrics endpoint
- Docker image scanning
- non-root container
- resource limits

## Common mistakes

- baking secrets into image
- no graceful shutdown
- no health checks
- using latest tag blindly
- not running migrations safely
- huge images with unnecessary tools

## Interview answer

I build Go as a small binary, package it in a minimal container, configure with environment variables, expose health/readiness endpoints, handle graceful shutdown, and ship logs/metrics for production debugging.
