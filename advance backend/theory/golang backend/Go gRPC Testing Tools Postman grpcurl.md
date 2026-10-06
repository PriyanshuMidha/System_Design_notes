# Go gRPC Testing Tools Postman grpcurl

## grpcurl

`grpcurl` is like curl for gRPC.

Useful commands:

```bash
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 describe invoice.v1.InvoiceService
grpcurl -plaintext -d '{"id":"inv_123"}' localhost:50051 invoice.v1.InvoiceService/GetInvoice
```

For this to work easily, enable gRPC reflection in development.

## Postman

Postman can test unary and streaming gRPC calls. It can import proto files and send metadata.

## What to test

- unary success
- not found
- invalid request
- auth metadata missing
- deadline exceeded
- streaming cancellation
- TLS connection

## Coding task

Enable reflection locally and test `GetInvoice` with grpcurl. Save the command in your project README.
