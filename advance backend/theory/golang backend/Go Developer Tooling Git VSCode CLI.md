# Go Developer Tooling Git VSCode CLI

## Complete notes

A Go backend developer must be comfortable with the Go toolchain, Git, editor integration, and CLI workflow.

## Go commands

```bash
go version
go env
go mod init github.com/yourname/invoiceops
go mod tidy
go run ./cmd/api
go build ./cmd/api
go test ./...
go test -race ./...
go test -bench=. ./...
go fmt ./...
go vet ./...
```

## Git workflow

```bash
git init
git status
git add .
git commit -m "initial invoiceops setup"
git branch -M main
git remote add origin git@github.com:yourname/invoiceops.git
git push -u origin main
```

## VS Code essentials

- Go extension
- format on save
- `gopls`
- test explorer
- debugger
- error lens or equivalent

## Coding task

Create InvoiceOps repo locally, run `go test ./...`, and make the first commit.
