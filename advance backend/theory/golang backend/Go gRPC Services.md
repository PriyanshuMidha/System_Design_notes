# Go gRPC Services

## Why learn this

gRPC is common for internal service-to-service communication. It uses Protocol Buffers for strongly typed contracts.

Use this after REST. REST is good for public APIs; gRPC is good for internal APIs where both sides are controlled by your system.

## What to build

Create a tiny internal Invoice service:

```proto
service InvoiceService {
  rpc GetInvoice(GetInvoiceRequest) returns (InvoiceResponse);
  rpc MarkInvoicePaid(MarkInvoicePaidRequest) returns (InvoiceResponse);
}
```

## Steps

1. install `protoc`
2. install Go protobuf plugins
3. write `.proto`
4. generate Go code
5. implement server
6. write client
7. add deadline/context timeout
8. add error mapping

## Commands

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## Production checklist

- deadlines on every call
- retries only where safe
- protobuf backward compatibility
- structured errors/status codes
- authentication/mTLS for internal traffic
- tracing across services
- load balancing/service discovery

## Common mistakes

- no deadline, causing stuck calls
- changing field numbers in proto
- deleting fields instead of reserving them
- retrying non-idempotent operations
- exposing gRPC directly to browsers without a plan

## Connect to notes

- [[GRPC]]
- [[Go Context Package]]
- [[Go OpenTelemetry Metrics Tracing]]
- [[Distributed Systems Content Table]]

## Coding task

For InvoiceOps, keep the public API REST, but create a separate gRPC server for internal invoice read/update calls. Then write a small Go client that calls it with a timeout.

## Deep follow-up notes

For course-level depth, continue with:

- [[Go Protocol Buffers Deep Dive]]
- [[Go Proto Versioning Best Practices]]
- [[Go Protoc Code Generation]]
- [[Go gRPC Deep Dive]]
- [[Go gRPC Streaming Patterns]]
- [[Go gRPC TLS Metadata Deadlines]]
- [[Go gRPC Gateway REST Combo API]]
- [[Go gRPC Testing Tools Postman grpcurl]]
- [[Go Protobuf Validation]]
- [[Go Benchmarking wrk h2load ghz pprof]]
