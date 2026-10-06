# Go Bootcamp Coding Checklist

Use this as your coding tracker.

## Foundation tasks

- [ ] install Go and confirm `go version`
- [ ] create module with `go mod init`
- [ ] configure VS Code Go extension
- [ ] create Git repo and first commit
- [ ] write `hello.go`
- [ ] run `go run`, `go build`, `go test`

## Go language tasks

- [ ] write examples for arrays, slices, maps
- [ ] write struct + method example
- [ ] write interface + fake implementation
- [ ] write pointer mutation example
- [ ] write defer/panic/recover middleware example
- [ ] write generic helper function
- [ ] write reflection example that reads struct tags
- [ ] write file read/write examples
- [ ] write time parsing/formatting examples

## Backend tasks

- [ ] build REST health endpoint
- [ ] build clients CRUD
- [ ] build invoices CRUD
- [ ] add middleware from scratch
- [ ] add SQL repository
- [ ] add NoSQL-style repository note/example if needed
- [ ] add auth middleware
- [ ] add file upload
- [ ] add Redis cache/rate-limit/queue

## Protocol Buffers tasks

- [ ] install `protoc`
- [ ] install Go protobuf plugins
- [ ] write invoice `.proto`
- [ ] generate Go code
- [ ] marshal/unmarshal protobuf message
- [ ] add enums
- [ ] add nested messages
- [ ] add reserved fields

## gRPC tasks

- [ ] build unary gRPC server
- [ ] build unary gRPC client
- [ ] add deadlines/timeouts
- [ ] add metadata auth token
- [ ] add TLS
- [ ] add server streaming
- [ ] add client streaming
- [ ] add bidirectional streaming
- [ ] enable reflection
- [ ] test with `grpcurl`
- [ ] test with Postman
- [ ] add validation
- [ ] add gRPC gateway
- [ ] benchmark with `ghz`

## Production tasks

- [ ] add `pprof` locally
- [ ] run Go benchmark tests
- [ ] benchmark HTTP with `wrk`
- [ ] benchmark HTTP/2 with `h2load`
- [ ] benchmark gRPC with `ghz`
- [ ] add OpenTelemetry plan
- [ ] Dockerize app
