# Go REST API Coding

## What to build

Build InvoiceOps REST endpoints using `net/http` first. You can later compare with Chi/Gin, but standard library knowledge matters.

## Go 1.22+ routing idea

Go's standard `http.ServeMux` supports method-aware patterns and path wildcards in modern Go.

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /health", healthHandler)
mux.HandleFunc("POST /clients", createClientHandler)
mux.HandleFunc("GET /clients/{id}", getClientHandler)
```

Inside handler:

```go
id := r.PathValue("id")
```

## InvoiceOps endpoints to code

```text
POST /clients
GET /clients?page=1&limit=20
GET /clients/{id}
PATCH /clients/{id}

POST /invoices
GET /invoices?status=overdue&page=1
GET /invoices/{id}
POST /invoices/{id}/send
```

## Handler checklist

1. limit body size
2. decode JSON
3. reject invalid fields if you choose strict mode
4. validate request DTO
5. get auth/workspace from context
6. call service
7. map service error to HTTP error
8. write JSON response

## Code practice

Write:

- `writeJSON(w, status, data)`
- `readJSON(r, dst)`
- `writeError(w, status, code, message)`
- handler tests using `httptest`

## Connect to notes

- [[REST API]]
- [[API Contract Design]]
- [[API Error Handling]]
- [[Pagination]]
- [[Go HTTP Server]]
- [[Go JSON Validation DTOs]]

## Interview answer

In Go, I keep handlers thin. They decode, validate, call service, and encode. Business rules live in services. SQL lives in repositories. HTTP errors are mapped at the edge.
