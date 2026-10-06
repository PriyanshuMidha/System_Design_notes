# Go Proto Versioning Best Practices

## Why this matters

Protobuf is a contract. Bad changes can break old clients or servers.

## Rules

- never reuse field numbers
- reserve deleted field numbers and names
- add new fields instead of renaming old fields
- keep enum zero value as unspecified
- prefer clear package versions like `invoice.v1`
- use comments for service and field meaning
- avoid huge deeply nested messages
- keep messages focused

## Example

```proto
message Invoice {
  reserved 6, 7;
  reserved "old_status", "legacy_total";
}
```

## Breaking changes

- changing field number
- changing field type incompatibly
- removing field without reserving
- changing package/go_package carelessly
- changing semantic meaning while keeping same name

## Coding task

Add one deprecated field to a sample proto, reserve it, regenerate code, and explain what stays compatible.
