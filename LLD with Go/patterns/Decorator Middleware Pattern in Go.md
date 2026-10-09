# Decorator Middleware Pattern in Go

## Complete notes

Decorator adds behavior around an existing object without changing its core code.

In Go backend, this often appears as middleware or function wrapping.

## Diagram

```mermaid
flowchart LR
  Request --> Auth[Auth Middleware]
  Auth --> Rate[Rate Limit Middleware]
  Rate --> Log[Logging Middleware]
  Log --> Handler[Actual Handler]
```

## Go code

```go
package middleware

import (
    "log"
    "net/http"
    "time"
)

func Logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("method=%s path=%s duration=%s", r.Method, r.URL.Path, time.Since(start))
    })
}

func Auth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.Header.Get("Authorization") == "" {
            http.Error(w, "missing token", http.StatusUnauthorized)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

## Real-life example

Gin middleware for auth, request ID, logging, CORS, recovery, metrics, and rate limiting is Decorator in practice.

## When to use

- HTTP middleware
- logging wrapper
- retry wrapper
- cache wrapper
- metrics wrapper
- tracing wrapper

## When not to use

Do not hide major business behavior in middleware. Middleware should be cross-cutting behavior.

## Interview answer

I would use middleware/decorator for cross-cutting concerns like auth, logging, rate limiting, and metrics, so handlers stay focused on business logic.

## Common mistakes

- middleware order is wrong
- swallowing errors
- doing business decisions in middleware
- no request context propagation
