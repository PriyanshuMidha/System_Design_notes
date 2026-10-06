# Go gRPC TLS Metadata Deadlines

## TLS

TLS encrypts gRPC traffic. In production, internal service traffic often uses TLS or mTLS.

## Metadata

Metadata is key-value data sent with gRPC calls. Use it for request ids, auth tokens, and tracing context.

## Deadlines

Every gRPC client call should have a deadline.

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()
```

## Headers and trailers

gRPC can send headers before response and trailers after response. They are useful for request ids, rate-limit metadata, or debug information.

## Common mistakes

- insecure credentials in production
- no deadline
- putting secrets in logs
- sending huge metadata
- not propagating request id/trace id

## Coding task

Add metadata `authorization` and `x-request-id` to the InvoiceOps gRPC client. Server should read it and reject missing auth.
