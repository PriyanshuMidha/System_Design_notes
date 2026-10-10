# Go LLD Folder Structure for Practice

## Complete notes

Use a consistent folder structure for every LLD practice problem. This makes your code easier to explain in interviews.

## Simple practice structure

Use this for small machine-coding style problems:

```text
parkinglot/
  go.mod
  main.go
  model.go
  service.go
  repository.go
  errors.go
```

## Backend-style structure

Use this when the problem has APIs, DB schema, services, and repositories:

```text
inventory-order-assignment/
  go.mod
  cmd/
    app/
      main.go
  internal/
    order/
      model.go
      service.go
      repository.go
      errors.go
    inventory/
      model.go
      service.go
      repository.go
    delivery/
      model.go
      service.go
      strategy.go
    notification/
      notifier.go
      factory.go
    platform/
      id.go
      clock.go
```

## What each file means

| File | Purpose |
|---|---|
| `model.go` | structs, enums, domain types |
| `service.go` | business logic/use cases |
| `repository.go` | storage interface + in-memory implementation |
| `strategy.go` | interchangeable algorithms |
| `factory.go` | object/provider creation |
| `errors.go` | domain errors |
| `main.go` | wiring + example calls |
| `*_test.go` | unit tests |

## Package rule

Keep packages by domain, not by technical layer only.

Good:

```text
internal/order
internal/inventory
internal/delivery
```

Avoid for bigger systems:

```text
models/
services/
repositories/
```

The second style becomes messy when the project grows because all domains mix together.

## Minimal main.go example

```go
package main

import (
    "context"
    "fmt"
)

func main() {
    ctx := context.Background()

    orderRepo := order.NewInMemoryRepository()
    inventoryRepo := inventory.NewInMemoryRepository()
    selector := delivery.NearestStoreStrategy{}

    service := order.NewService(orderRepo, inventoryRepo, selector)

    result, err := service.PlaceOrder(ctx, order.PlaceOrderRequest{
        UserID: "user_1",
        Items: []order.ItemRequest{{ProductID: "milk", Quantity: 2}},
    })
    if err != nil {
        fmt.Println("error:", err)
        return
    }

    fmt.Println("order created:", result.ID)
}
```

## Expected output

```text
order created: order_1
```

## Interview explanation

I keep `main.go` only for wiring and demo calls. The domain logic stays inside services. Storage details stay behind repository interfaces. This makes the design easier to test and easier to explain.

## Common mistakes

- writing all code in `main.go`
- mixing HTTP parsing with business logic
- using global maps everywhere
- no repository boundary
- no domain errors
- no tests for core method

## Quick rule

For interviews: `model -> repository -> service -> main/test`. That is enough for most LLD problems.
