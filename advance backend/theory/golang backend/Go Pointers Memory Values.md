# Go Pointers Memory Values

## Complete notes

A pointer stores the address of a value. Use pointers when a function needs to mutate a value, avoid copying a large struct, or represent optional/nil state.

## Example

```go
func markPaid(inv *Invoice) {
    inv.Status = "paid"
}
```

## Value vs pointer receiver

Use pointer receiver when:

- method mutates receiver
- struct is large
- consistency matters because some methods need pointers

Use value receiver when:

- small immutable value
- method does not mutate receiver

## Backend examples

- `*sql.DB` is shared database handle/pool
- `*http.Server` is controlled for shutdown
- request DTO can be value
- repository/service structs are usually pointers

## Common mistakes

- returning pointer to reused loop variable
- nil pointer dereference
- pointer everywhere without reason
- confusing mutation with reassignment

## Coding task

Write invoice status transition methods and decide pointer vs value receivers.
