# Go Backend Coding Roadmap

This is the coding-first roadmap. Do not only read theory. For every topic, build one small thing inside [[InvoiceOps Golang Project Plan]].

## Phase 0: setup

Build:

- Go module
- folder structure
- health endpoint
- config loader
- logger
- graceful shutdown

Revise:

- [[Go Project Structure and Modules]]
- [[Go Configuration Environment]]
- [[Go Graceful Shutdown]]

## Phase 1: REST API

Build:

- `POST /clients`
- `GET /clients`
- `POST /invoices`
- `GET /invoices/{id}`
- validation and error response
- pagination/filtering

Revise:

- [[Go REST API Coding]]
- [[REST API]]
- [[API Contract Design]]
- [[API Error Handling]]
- [[Pagination]]

## Phase 2: database

Build:

- migrations
- repositories
- transactions
- indexes

Revise:

- [[Go Database Migrations]]
- [[Go Database SQL]]
- [[Go Transactions and Repository Pattern]]
- [[Database Content Table]]

## Phase 3: auth/security

Build:

- signup/login
- password hashing
- access/refresh token flow or secure session flow
- workspace authorization
- rate limit login

Revise:

- [[Go Auth JWT Sessions]]
- [[Go Password Hashing]]
- [[Auth Security Content Table]]
- [[JWT]]
- [[Sessions and Cookies]]
- [[Rate limiting with Redis]]

## Phase 4: async backend

Build:

- reminder queue
- email worker
- retry + dead-letter behavior
- scheduled overdue invoice scanner

Revise:

- [[Go Worker Queues and Background Jobs]]
- [[Go Redis Cache Queue Rate Limit]]
- [[Go Cron Scheduled Jobs]]
- [[Message Queue with Redis]]

## Phase 5: integrations

Build:

- payment webhook endpoint
- webhook signature verification
- idempotency table
- file upload endpoint

Revise:

- [[Go Webhooks Idempotency]]
- [[Go File Uploads]]
- [[Webhooks]]
- [[Webhook Processing]]
- [[File Upload Architecture]]

## Phase 6: advanced API styles

Build:

- small gRPC internal invoice service
- WebSocket live invoice status updates
- optional GraphQL read-only dashboard endpoint

Revise:

- [[Go gRPC Services]]
- [[Go WebSocket Realtime]]
- [[Go GraphQL Backend]]
- [[GRPC]]
- [[WEBSOCKET]]
- [[GRAPHQL]]

## Phase 7: production

Build:

- OpenAPI docs
- structured logs
- metrics/traces
- Dockerfile
- tests
- CI command list

Revise:

- [[Go OpenAPI Documentation]]
- [[Go OpenTelemetry Metrics Tracing]]
- [[Go Testing]]
- [[Go Deployment Docker]]
- [[Observability Content Table]]

## Rule

For every note, write code for the InvoiceOps project. If there is no code task, the note is incomplete.
