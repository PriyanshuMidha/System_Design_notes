# Go Deep Basics Functions Defer Panic Recover

## Functions

Functions are first-class values in Go. They can be passed around, returned, and used as closures.

## Variadic function

```go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}
```

## Defer

`defer` runs when the surrounding function returns. It is used for cleanup.

```go
f, err := os.Open(name)
if err != nil { return err }
defer f.Close()
```

Deferred calls run in LIFO order.

## Panic and recover

Use panic for programmer bugs or unrecoverable states. Do not use it for normal request errors.

In backend code, recover belongs in middleware:

```go
func Recover(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                http.Error(w, "internal error", http.StatusInternalServerError)
            }
        }()
        next.ServeHTTP(w, r)
    })
}
```

## Coding task

Add recovery middleware to InvoiceOps and write a test handler that panics. The API should return `500` without crashing the process.
