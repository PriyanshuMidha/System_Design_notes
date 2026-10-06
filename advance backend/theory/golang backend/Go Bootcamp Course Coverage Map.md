# Go Bootcamp Course Coverage Map

This note maps the Udemy course `Go Bootcamp: With gRPC and Protocol Buffers (HTTP/S, HTTP2)` to your own notes and InvoiceOps coding tasks.

Important: the full paid videos are not directly accessible here. This map is based on the public Udemy curriculum plus official Go, Protocol Buffers, gRPC, and OpenTelemetry docs.

## Course-level topics visible from the curriculum

- Go setup, Go playground, VS Code, Git/GitHub
- Go basics: syntax, variables, functions, arrays/slices/maps, defer/panic/recover
- Intermediate Go: closures, recursion, pointers, strings/runes, formatting, structs, interfaces, embedding, generics, templates, regex, time, random, files/directories, URL parsing, base64, hashing
- Advanced Go: goroutines, channels, context, timers/tickers, worker pools, wait groups, mutexes, atomics, testing, benchmarking, pprof, OS processes, reflect
- REST API in Go with planning, folder structure, middleware, SQL and NoSQL
- HTTPS, HTTP/2, TLS/SSL
- Protocol Buffers: proto syntax, fields, types, messages, serialization, services/RPC, versioning, best practices, protoc generation
- gRPC: server/client, TLS, proto packages, streaming, deadlines, metadata, headers/trailers, reflection, grpcurl, Postman, validation, gateway, combo REST + gRPC API
- Benchmarking tools: `wrk`, `h2load`, `ghz`

## Notes added for this course

- [[Go Bootcamp Coding Checklist]]
- [[Go Developer Tooling Git VSCode CLI]]
- [[Go Deep Basics Functions Defer Panic Recover]]
- [[Go Pointers Memory Values]]
- [[Go Strings Runes Time Files]]
- [[Go Generics Reflection Runtime]]
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
- [[Go HTTPS HTTP2 TLS Server]]
- [[Go SQL NoSQL API Practice]]
- [[Go Source Code Reading Debugging]]
- [[Go YouTube Topic Links]]

## How to study

1. Read one topic note.
2. Code the task in InvoiceOps.
3. Write one small test.
4. Link the code concept back to your backend/system-design notes.
5. Explain the topic in interview style.

## Main issue found

Earlier notes covered the names of topics, but not enough depth for course-level practice. The missing layer was:

- exact commands
- exact code artifact to build
- failure modes
- interview answer
- link to InvoiceOps
- link to existing REST/gRPC/WebSocket/system-design notes
