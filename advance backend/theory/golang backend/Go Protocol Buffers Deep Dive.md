# Go Protocol Buffers Deep Dive

## What Protocol Buffers are

Protocol Buffers define structured messages in `.proto` files and generate typed code for languages like Go.

They are compact, fast to serialize, and good for API contracts between services.

## Basic proto

```proto
syntax = "proto3";

package invoice.v1;

option go_package = "github.com/yourname/invoiceops/proto/invoice/v1;invoicev1";

message Invoice {
  string id = 1;
  string client_id = 2;
  int64 total_cents = 3;
  string currency = 4;
  InvoiceStatus status = 5;
}

enum InvoiceStatus {
  INVOICE_STATUS_UNSPECIFIED = 0;
  INVOICE_STATUS_DRAFT = 1;
  INVOICE_STATUS_SENT = 2;
  INVOICE_STATUS_PAID = 3;
}
```

## Field numbers matter

The binary format uses field numbers. Never casually change field numbers after clients exist.

## Common proto types

- `string`
- `bool`
- `int32`, `int64`
- `double`
- `bytes`
- `repeated`
- `map`
- `enum`
- nested `message`

## Coding task

Create `proto/invoice/v1/invoice.proto` for InvoiceOps and generate Go code.

## Links

- [[Go Proto Versioning Best Practices]]
- [[Go Protoc Code Generation]]
- [[Go gRPC Deep Dive]]
