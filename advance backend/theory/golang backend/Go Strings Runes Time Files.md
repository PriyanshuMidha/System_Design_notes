# Go Strings Runes Time Files

## Strings and runes

Go strings are bytes. A `rune` is a Unicode code point.

Use runes when working with user-visible characters, especially names and international text.

## Time

Go uses the reference layout:

```go
time.Parse("2006-01-02", "2026-10-01")
```

Backend use:

- invoice due dates
- reminder schedules
- token expiry
- audit timestamps

## Files

Use `os`, `io`, `bufio`, and `path/filepath`.

Security rule: never trust user-provided paths directly.

## Coding task

For InvoiceOps:

- parse invoice due date
- reject invalid date
- generate safe file path for invoice attachment
- write an uploaded file to local storage
