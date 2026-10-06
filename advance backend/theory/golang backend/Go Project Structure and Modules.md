# Go Project Structure and Modules

## Complete notes

A Go module is the unit of dependency management. It is defined by `go.mod`.

For backend services, keep the structure simple. Do not copy huge enterprise layouts unless the project needs them.

## Recommended InvoiceOps structure

```text
invoiceops/
  cmd/api/main.go
  internal/config/
  internal/http/
  internal/middleware/
  internal/auth/
  internal/invoice/
  internal/client/
  internal/payment/
  internal/reminder/
  internal/store/
  internal/queue/
  internal/observability/
  migrations/
  api/
  Dockerfile
  go.mod
```

## Meaning

- `cmd/api`: executable entry point.
- `internal`: app code that should not be imported by other modules.
- `config`: env/config parsing.
- `http`: router and server setup.
- feature packages: invoice, client, payment, reminder.
- `store`: shared database setup.
- `migrations`: SQL migrations.
- `api`: OpenAPI docs or API contracts.

## Module commands

```bash
go mod init github.com/yourname/invoiceops
go mod tidy
go test ./...
go run ./cmd/api
```

## Easy example

Put invoice business logic in `internal/invoice`, not inside `main.go`.

## Difficult example

Payment webhook handling may need `payment`, `invoice`, `store`, `queue`, and `observability`. Keep `main.go` wiring dependencies, while each package owns its own behavior.

## Common mistakes

- making one giant `utils` package
- putting all code in `main.go`
- using interfaces before there are multiple implementations
- creating circular imports between feature packages
- exposing internal business types as API DTOs without thinking
