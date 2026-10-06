# Go Source Code Reading Debugging

## Why this matters

The course mentions learning how to read Go source code and find solutions. This is a real senior skill.

## How to read source

1. start from public API
2. jump to type definition
3. read comments
4. inspect interface boundaries
5. trace one happy path
6. trace one error path
7. run a tiny experiment

## Good packages to inspect

- `net/http`
- `context`
- `database/sql`
- `encoding/json`
- `sync`
- `time`

## Debugging tools

- logs
- debugger
- `go test -run`
- `go test -race`
- `go test -bench`
- `pprof`
- `go doc`
- `go env`

## Coding task

Read `net/http.Server.Shutdown` docs/source enough to explain graceful shutdown in your own words.
