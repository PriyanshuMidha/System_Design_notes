# Go gRPC Deep Dive

## What gRPC is

gRPC is an RPC framework that commonly uses HTTP/2 for transport and Protocol Buffers for contracts.

## Core pieces

- `.proto` service definition
- generated client stub
- generated server interface
- server implementation
- client connection
- context deadlines
- status errors

## Unary RPC

```proto
service InvoiceService {
  rpc GetInvoice(GetInvoiceRequest) returns (GetInvoiceResponse);
}
```

## Server idea

```go
type InvoiceServer struct {
    invoicev1.UnimplementedInvoiceServiceServer
}
```

## Production checklist

- deadlines/timeouts
- status codes
- interceptors
- metadata auth
- TLS/mTLS
- reflection in dev
- health checks
- metrics/tracing
- backward-compatible proto evolution

## Coding task

Build `GetInvoice` unary RPC for InvoiceOps. Call it from a separate Go client with a 2-second deadline.

## Connect

- [[GRPC]]
- [[Go gRPC TLS Metadata Deadlines]]
- [[Go gRPC Streaming Patterns]]
- [[Go gRPC Gateway REST Combo API]]
