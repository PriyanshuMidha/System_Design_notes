# Go Protobuf Validation

## Why validation matters

Generated protobuf types prove shape, not business correctness.

Example: a string field can still be empty; an amount can still be negative unless validation exists.

## Validation layers

1. proto-level validation for shape constraints
2. service-level validation for business rules
3. database constraints for final protection

## Examples

- invoice id required
- amount greater than zero
- currency length is 3
- due date valid
- status enum known

## Tools

Common options include validation plugins such as protoc-gen-validate or newer protovalidate-style tooling. Pick one based on project compatibility.

## Common mistakes

- assuming proto schema is enough
- validating only client-side
- returning generic internal error for validation failure
- not testing invalid proto messages

## Coding task

Add validation for `CreateInvoiceRequest`: client id required, currency required, total greater than zero.
