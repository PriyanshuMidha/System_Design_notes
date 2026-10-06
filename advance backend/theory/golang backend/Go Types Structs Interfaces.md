# Go Types Structs Interfaces

## Complete notes

Go uses structs to model data and interfaces to describe behavior.

## Structs

```go
type Invoice struct {
    ID        string
    ClientID  string
    Amount    int64
    Currency  string
    Status    string
}
```

Use structs for domain models, database rows, request DTOs, and response DTOs. Do not force one struct to serve all purposes.

## Interfaces

Interfaces are satisfied implicitly. A type does not need to declare that it implements an interface.

```go
type InvoiceRepository interface {
    Create(ctx context.Context, inv Invoice) error
    FindByID(ctx context.Context, id string) (Invoice, error)
}
```

## Backend use

- handlers depend on services
- services depend on repositories
- repositories depend on DB clients
- tests can replace repositories with fakes

## Real-life example

Invoice service should not know whether invoices are stored in Postgres, MySQL, or a fake test store. It should depend on behavior.

## Common mistakes

- creating interfaces for every struct too early
- returning huge interfaces
- mixing database tags and JSON tags on the same domain struct without purpose
- using `interface{}` or `any` when a real type is known

## Interview answer

Use interfaces at package boundaries where they improve testing or decouple business logic from infrastructure. Keep interfaces small and define them near the consumer.
