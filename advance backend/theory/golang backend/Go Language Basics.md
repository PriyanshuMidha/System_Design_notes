# Go Language Basics

## Complete notes

Go is a compiled, statically typed language designed for simple, readable, production-friendly software. For backend work, Go is popular because it builds to a single binary, has a strong standard library, handles concurrency well, and is easy to deploy.

## What you must know first

Before backend coding, be comfortable with:

- package and import
- `main` function
- variables and constants
- basic types
- control flow
- arrays, slices, and maps
- functions and multiple return values
- structs and methods
- errors
- modules and commands

## Hello world

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, InvoiceOps")
}
```

Run it:

```bash
go run main.go
```

Build it:

```bash
go build -o invoiceops .
```

## Packages

Every Go file starts with a package name.

- `package main` creates an executable program.
- other package names create reusable code.

Backend example:

```text
cmd/api        -> package main
internal/auth  -> package auth
internal/store -> package store
```

## Variables

```go
var name string = "InvoiceOps"
var port int = 8080
active := true
```

Use `:=` inside functions when the type is obvious.

## Constants

```go
const DefaultCurrency = "INR"
const MaxPageSize = 100
```

Use constants for fixed values like statuses, limits, and config defaults.

## Basic types

Common types:

- `string`
- `bool`
- `int`, `int64`
- `float64`
- `byte`
- `rune`
- `error`

Backend examples:

```go
type InvoiceStatus string

const (
    InvoiceDraft InvoiceStatus = "draft"
    InvoicePaid  InvoiceStatus = "paid"
)
```

## Control flow

### if

```go
if amount <= 0 {
    return errors.New("amount must be positive")
}
```

### for

Go has only `for`, but it covers normal loops, while-style loops, and range loops.

```go
for i := 0; i < 3; i++ {
    fmt.Println(i)
}
```

```go
for _, item := range items {
    total += item.Price
}
```

### switch

```go
switch status {
case "draft":
    // allow edit
case "paid":
    // lock invoice
 default:
    return errors.New("unknown status")
}
```

## Arrays, slices, and maps

### Array

Fixed length. Less common in backend request code.

```go
var nums [3]int
```

### Slice

Dynamic view over an array. Very common.

```go
items := []string{"invoice", "payment", "client"}
items = append(items, "reminder")
```

### Map

Key-value lookup.

```go
headers := map[string]string{
    "Content-Type": "application/json",
}
```

Backend uses:

- request metadata
- config lookup
- grouping records
- idempotency checks in memory tests

## Functions

Go functions can return multiple values. This is why errors are usually returned explicitly.

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}
```

## Multiple return values

Backend code often returns `(value, error)`.

```go
invoice, err := service.GetInvoice(ctx, id)
if err != nil {
    return err
}
```

## Zero values

Every type has a zero value:

| Type | Zero value |
|---|---|
| string | `""` |
| int | `0` |
| bool | `false` |
| pointer | `nil` |
| slice | `nil` |
| map | `nil` |
| struct | all fields zero |

This matters because missing values can silently become zero values if you do not validate requests.

## Exported vs unexported names

Names starting with capital letters are exported outside the package.

```go
type InvoiceService struct{} // exported
func calculateTotal() {}     // unexported
```

Use unexported names for package internals.

## Comments

Exported names should have useful comments when they are part of public package API.

```go
// InvoiceService contains invoice business logic.
type InvoiceService struct{}
```

## Go commands you will use daily

```bash
go mod init github.com/yourname/invoiceops
go mod tidy
go fmt ./...
go test ./...
go test -race ./...
go run ./cmd/api
go build ./cmd/api
```


## `make` vs `new`

This is an important Go basic.

### `make`

Use `make` for slices, maps, and channels because these types need runtime initialization.

```go
items := make([]string, 0, 10) // length 0, capacity 10
counts := make(map[string]int)
jobs := make(chan string, 100)
```

Backend examples:

```go
errorsByField := make(map[string]string)
invoiceItems := make([]InvoiceItem, 0, len(req.Items))
```

### `new`

`new(T)` allocates zero value of type `T` and returns `*T`.

```go
p := new(int)
fmt.Println(*p) // 0
```

In backend code, you usually use struct literals more often than `new`:

```go
svc := &InvoiceService{repo: repo}
```

### Rule

- use `make` for `slice`, `map`, `chan`
- use `&Struct{}` for structs
- use `new` rarely, mostly when you specifically want pointer to zero value

## `nil`

`nil` means no value for pointers, slices, maps, channels, functions, and interfaces.

```go
var items []string        // nil slice
var counts map[string]int // nil map
var ch chan string        // nil channel
```

Important difference:

```go
var items []string
items = append(items, "a") // ok

var counts map[string]int
counts["paid"] = 1 // panic: assignment to entry in nil map
```

So initialize maps before writing:

```go
counts := make(map[string]int)
counts["paid"] = 1
```

## Slice length and capacity

A slice has:

- pointer to array
- length
- capacity

```go
items := make([]string, 0, 3)
fmt.Println(len(items)) // 0
fmt.Println(cap(items)) // 3
```

Append can reuse capacity or allocate a new backing array.

```go
items = append(items, "a")
items = append(items, "b")
```

Backend tip: if you know expected size, preallocate to reduce allocations.

```go
responses := make([]InvoiceResponse, 0, len(invoices))
```

## Map basics

Maps are key-value collections.

```go
statusCount := map[string]int{
    "draft": 2,
    "paid":  5,
}
```

Check if key exists:

```go
count, ok := statusCount["overdue"]
if !ok {
    count = 0
}
```

Delete key:

```go
delete(statusCount, "draft")
```

Backend uses:

- counting invoices by status
- validation errors by field
- lookup tables
- test fakes

## `range`

Use `range` to loop over slices, maps, strings, and channels.

```go
for i, item := range items {
    fmt.Println(i, item)
}
```

For maps:

```go
for status, count := range statusCount {
    fmt.Println(status, count)
}
```

For strings, range gives rune index and rune value:

```go
for i, r := range "भारत" {
    fmt.Println(i, r)
}
```

Common mistake: taking address of range variable in old code patterns. Prefer copying value inside loop when storing pointers.

## Type conversion

Go does not do many implicit conversions. Convert explicitly.

```go
var cents int64 = 1000
rupees := float64(cents) / 100
```

String/int conversion:

```go
n, err := strconv.Atoi("42")
s := strconv.Itoa(42)
```

Backend uses:

- parse query params
- convert DB numeric values
- parse IDs/counts/page numbers

## Common built-in functions

| Function | Use |
|---|---|
| `len` | length of string/slice/map/channel |
| `cap` | capacity of slice/channel |
| `append` | add to slice |
| `copy` | copy slice data |
| `delete` | delete map key |
| `make` | initialize slice/map/channel |
| `new` | allocate zero value and return pointer |
| `close` | close channel |
| `panic` | unrecoverable failure |
| `recover` | recover from panic inside deferred function |

## `init` function

`init` runs before `main` when package is initialized.

```go
func init() {
    fmt.Println("package initialized")
}
```

Use it sparingly. Do not hide important production setup inside `init`. Prefer explicit setup in `main`.

## Type aliases and custom types

Custom type:

```go
type InvoiceID string
type MoneyCents int64
```

This improves meaning and avoids mixing unrelated strings/ints.

```go
func GetInvoice(id InvoiceID) {}
```

Alias:

```go
type MyString = string
```

Aliases are less common in app code; custom types are more useful for domain clarity.

## Struct tags basics

Struct tags provide metadata used by encoders, validators, ORMs, and reflection.

```go
type CreateInvoiceRequest struct {
    ClientID string `json:"client_id"`
    DueDate  string `json:"due_date"`
}
```

Common backend tags:

- `json`
- `db`
- `validate`

## Basic input/output packages

Common packages:

- `fmt`: formatting and printing
- `strconv`: string conversion
- `strings`: string helpers
- `errors`: simple errors
- `os`: files/env/process
- `io`: readers/writers
- `bufio`: buffered IO
- `time`: time and duration

Backend examples:

```go
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}
```

## Mini practice: basics before backend

Before starting REST APIs, you should be able to code these without looking:

1. Create a slice with `make`, append values, print len/cap.
2. Create a map with `make`, add values, check missing key with `ok`.
3. Convert query string value `page=2` to int using `strconv.Atoi`.
4. Define custom type `InvoiceStatus` with constants.
5. Define request struct with JSON tags.
6. Loop over invoice items with `range` and calculate total.
7. Return `(int64, error)` from a function.
8. Use `os.Getenv` with a default value.

## Backend mental model

In InvoiceOps, Go basics show up as:

- `struct` for invoices, clients, users
- `slice` for invoice line items
- `map` for headers/config/test fakes
- `function` for validation and business rules
- `error` for failure handling
- `package` for separating auth, invoice, payment, reminder

## Common beginner mistakes

- ignoring errors with `_`
- using `panic` for normal API errors
- not validating zero values from JSON
- using maps when structs would be clearer
- putting all code in `main.go`
- using globals for everything
- not running `go fmt`

## Practice tasks

1. Create `hello.go` and print app name.
2. Create an `InvoiceStatus` type with constants.
3. Create an `InvoiceItem` struct and calculate total.
4. Create a slice of invoice items and loop over it.
5. Create a map of status labels.
6. Write a function that returns `(total int64, err error)`.
7. Run `go test ./...` after adding one test.

## Interview answer

Go is a good backend language because it is simple, compiled, statically typed, fast enough for high-throughput services, has excellent standard-library networking support, has explicit error handling, and supports concurrency with goroutines and channels.
