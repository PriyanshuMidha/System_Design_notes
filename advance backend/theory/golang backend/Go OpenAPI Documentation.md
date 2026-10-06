# Go OpenAPI Documentation

## Why learn this

OpenAPI documents REST APIs so frontend, QA, and other services know the contract.

## What to document

- endpoint path
- method
- auth requirement
- request body
- response body
- error response
- status codes
- pagination/query params
- examples

## InvoiceOps endpoints to document first

- `POST /auth/login`
- `POST /clients`
- `GET /clients`
- `POST /invoices`
- `GET /invoices/{id}`
- `POST /payments/webhooks/razorpay`

## Tools

Options:

- write `openapi.yaml` manually
- generate docs using annotations/tools
- use type-first API libraries if you choose them later

## Common mistakes

- docs do not match code
- missing error responses
- missing auth info
- no examples
- no versioning plan

## Connect to notes

- [[API Contract Design]]
- [[API Design Content Table]]
- [[Go REST API Coding]]

## Coding task

Create `api/openapi.yaml` for the MVP endpoints before writing all handlers. Treat it as a contract.
