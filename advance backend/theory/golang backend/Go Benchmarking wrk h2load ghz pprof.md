# Go Benchmarking wrk h2load ghz pprof

## Benchmarking types

- Go benchmark tests: measure function performance
- `pprof`: CPU/memory profiling
- `wrk`: HTTP load testing
- `h2load`: HTTP/2 benchmarking
- `ghz`: gRPC benchmarking

## Go benchmark

```bash
go test -bench=. ./...
```

## Race detector

```bash
go test -race ./...
```

## pprof

Use pprof to find CPU/memory bottlenecks. Do not guess performance problems.

## HTTP benchmark

```bash
wrk -t4 -c100 -d30s http://localhost:8080/health
```

## gRPC benchmark

```bash
ghz --insecure --proto proto/invoice/v1/invoice.proto \
  --call invoice.v1.InvoiceService.GetInvoice \
  -d '{"id":"inv_123"}' localhost:50051
```

## Common mistakes

- benchmarking debug builds only
- no warmup
- testing local laptop and calling it production truth
- ignoring p95/p99 latency
- comparing REST and gRPC with different business logic

## Coding task

Benchmark InvoiceOps health endpoint with `wrk` and gRPC `GetInvoice` with `ghz`. Record throughput, p50, p95, p99.
