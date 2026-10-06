# Go Generics Reflection Runtime

## Generics

Generics let you write reusable typed functions and data structures.

Use them when the type relationship matters. Do not use generics just to avoid writing two functions.

## Example

```go
func Ptr[T any](v T) *T {
    return &v
}
```

## Reflection

Reflection inspects types/values at runtime.

Backend uses:

- reading struct tags
- validation libraries
- serializers
- ORMs
- gRPC/protobuf tooling internals

Reflection is powerful but less explicit and can be slower/harder to read.

## Runtime

Important runtime topics:

- goroutine scheduling
- garbage collection
- stack growth
- race detector
- pprof profiling

## Coding task

Write a small reflection helper that prints JSON tags from a request DTO. Then write why you should not use reflection for normal business logic.
