# Go JSON Validation DTOs

## Complete notes

Backend APIs should separate request DTOs, domain models, and response DTOs.

## Request DTO

```go
type CreateInvoiceRequest struct {
    ClientID string `json:"client_id"`
    DueDate  string `json:"due_date"`
    Items    []CreateInvoiceItemRequest `json:"items"`
}
```

## Response DTO

```go
type InvoiceResponse struct {
    ID     string `json:"id"`
    Status string `json:"status"`
    Total  int64  `json:"total"`
}
```

## Validation checklist

- required fields
- string length
- numeric ranges
- enum values
- date format
- duplicate line items
- authorization against workspace/client id
- body size limit
- unknown field policy if needed

## Common mistakes

- trusting JSON input directly
- allowing client to set server-owned fields like `status`, `user_id`, or `workspace_id`
- mixing DB models with API responses
- returning different error shapes for each endpoint

## Interview answer

I decode into request DTOs, validate them, convert to domain commands, call the service, and return response DTOs. I never let clients set trusted server-owned fields directly.
