# Go Protoc Code Generation

## Tools

Install:

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

Generate:

```bash
protoc \
  --go_out=. --go_opt=paths=source_relative \
  --go-grpc_out=. --go-grpc_opt=paths=source_relative \
  proto/invoice/v1/invoice.proto
```

## Generated files

- `.pb.go`: message types and serialization
- `_grpc.pb.go`: service interfaces, client stubs, server registration

## Common mistakes

- missing `go_package`
- plugin not in PATH
- generated files committed inconsistently
- editing generated files manually
- proto package and Go package confusion

## Coding task

Generate InvoiceOps proto code and register a gRPC service using the generated server interface.
