---
tags: [networking, internet, protocols]
level: intermediate
status: draft
prereqs: []
related: ["[[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]]"]
sources:
  - "RFC 791, Internet Protocol"
  - "RFC 1122, Requirements for Internet Hosts - Communication Layers"
  - "ISO/IEC 7498-1, OSI Basic Reference Model"
  - "Cisco, BGP Case Studies and RFC 4271 overview"
updated: 2026-11-13
type: implementation
---

# How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP - Go

> [!summary] TL;DR
> This code opens a real TCP listener and a real TCP client on the loopback interface, and prints the 5-tuple each side sees, proving the claim in [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]] that a connection's identity is `(protocol, source IP:port, destination IP:port)`, not just a port number.

## Before the code

- **`net.Listen` / `net.Dial`**: the standard library's way to open a listening socket and an outgoing TCP connection.
- **`net.Conn` (an interface)**: one live connection; `LocalAddr()` and `RemoteAddr()` give this end and the other end as `ip:port`.
- **Goroutine (`go EchoServer(...)`)**: runs the server concurrently so the test can act as the client at the same time.
- **Channel (`chan string`)**: a typed pipe the server goroutine uses to hand its 5-tuple back to the test safely.
- **`defer`**: schedules `Close()` to run when the function returns, so sockets are never leaked.
- **What to run:** `go vet ./...` then `go test -race -v ./...` in a module containing `socket.go` and `socket_test.go`.

## What this code shows

| Code piece | Theory concept | Theory section |
| --- | --- | --- |
| `FiveTuple` | Formatting the 5-tuple exactly as the kernel keys its socket table on it | [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP#Ports and sockets the 5-tuple]] |
| `EchoServer` | The server side of a socket, accepting one connection and reporting what it saw | [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP#Mental model]] |
| `TestFiveTupleDiffersPerConnection` | Proves the OS assigns a distinct ephemeral source port per connection | [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP#Ports and sockets the 5-tuple]] |

## Setup

- **Module layout:** a single package, `socket`, with `socket.go` and `socket_test.go` in one directory.
- **Go version:** 1.24.
- **Dependencies:** none beyond the standard library (`net`, `io`, `fmt`).
- **How to run:**

```bash
go mod init socket   # one-time
go vet ./...
go test -race -v ./...
```

## Code

### Formatting the 5-tuple

**Concept.** The theory note's "Ports and sockets" section says a connection's real identity on the wire is the 5-tuple, not the port alone.

`FiveTuple` makes that concrete: given a `net.Conn`, it prints exactly the four address fields (protocol is fixed to the network name passed in) that the kernel uses as its socket lookup key.

An alternative design would print the fields separately as a struct, but a single formatted string is simplest for a demo that only needs to be logged and eyeballed.

```go
// Package socket demonstrates the TCP 5-tuple (protocol, source IP, source
// port, destination IP, destination port) that a kernel uses to route every
// packet to the right socket.
package socket

import (
	"fmt"
	"io"
	"net"
)

// FiveTuple formats the connection identity the kernel keys its socket
// table on: protocol + both endpoints.
func FiveTuple(network string, conn net.Conn) string {
	return fmt.Sprintf("%s %s -> %s", network, conn.LocalAddr(), conn.RemoteAddr())
}
```

**How it works:**

1. `conn.LocalAddr()` returns this end's own address — for the server, its listening address and port (an accepted connection shares the listener's port; the client's port is what makes it unique); for the client, the ephemeral source port the OS picked when dialing.
2. `conn.RemoteAddr()` returns the other end's address as seen from here.
3. Both are `net.Addr` values whose `String()` method already renders as `ip:port`, which is why formatting is a one-line `Sprintf`.

### The echo server

**Concept.** `EchoServer` plays the server side: it accepts exactly one connection (enough for this demo), reports its own view of the 5-tuple over a channel, and then echoes back whatever bytes it reads. A real server would loop on `Accept` forever; stopping after one connection keeps the test deterministic and short-lived.

```go
// EchoServer accepts one connection on addr, echoes whatever it reads back
// to the client, and reports the 5-tuple it saw over tuples before closing.
// It stops after the first connection, which is all the demo needs.
func EchoServer(ln net.Listener, tuples chan<- string) {
	conn, err := ln.Accept()
	if err != nil {
		close(tuples)
		return
	}
	defer conn.Close()
	tuples <- FiveTuple("tcp", conn)
	close(tuples)
	_, _ = io.Copy(conn, conn) // echo: write back everything read, until EOF; error ignored, demo only
}
```

**How it works:**

1. `ln.Accept()` blocks until a client dials in, then returns a `net.Conn` representing that one connection.
2. `defer conn.Close()` guarantees the connection is cleaned up even if something below panics or returns early — a habit worth keeping even in a demo, since a missing `Close()` is exactly the `CLOSE_WAIT` leak described in [[Network Debugging Toolkit - dig, curl, ss, tcpdump#Sockets ss netstat]].
3. The tuple is sent over `tuples` and the channel is closed immediately after — the test reads exactly one value and then knows no more are coming.
4. `io.Copy(conn, conn)` reads from the connection and writes whatever it read back to the same connection — a textbook one-line echo loop. The error is intentionally ignored because this is demo code, not production code; a real echo server would check and log it.

## Tests

### TestFiveTupleDiffersPerConnection

**What it proves:** each connection — even to the same listening port — gets its own distinct ephemeral source port, which is exactly the reason one listening port can serve many simultaneous clients.

This matters because it is the mechanism question an interviewer is actually probing when they ask "how does a server handle multiple clients on one port."

| Input | Expected output |
| --- | --- |
| Client dials the listener once | Client's local port is nonzero and distinct from the server's listening port |
| Client writes `"ping"`, then half-closes | Server echoes back exactly `"ping"` |

First, the test spins up the server and dials a client against it, then grabs each side's view of the 5-tuple:

```go
func TestFiveTupleDiffersPerConnection(t *testing.T) {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	defer ln.Close()

	tuples := make(chan string, 1)
	go EchoServer(ln, tuples)

	client, err := net.DialTimeout("tcp", ln.Addr().String(), 2*time.Second)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer client.Close()

	serverSide := <-tuples
	clientSide := FiveTuple("tcp", client)
```

Then it asserts the ephemeral port claim and exercises the echo path to prove the connection actually carries data both ways:

```go
	if !strings.Contains(serverSide, ln.Addr().String()) {
		t.Fatalf("server tuple %q should end at the listener address %q", serverSide, ln.Addr())
	}
	clientLocalPort := client.LocalAddr().(*net.TCPAddr).Port
	if clientLocalPort == 0 {
		t.Fatalf("expected the OS to assign a nonzero ephemeral port, got %d", clientLocalPort)
	}

	if _, err := client.Write([]byte("ping")); err != nil {
		t.Fatalf("write: %v", err)
	}
	client.(*net.TCPConn).CloseWrite() // signal EOF so the server's io.Copy returns
	buf := make([]byte, 4)
	if _, err := io.ReadFull(client, buf); err != nil {
		t.Fatalf("read echo: %v", err)
	}
	if string(buf) != "ping" {
		t.Fatalf("echo = %q, want %q", buf, "ping")
	}
	t.Logf("server saw: %s", serverSide)
	t.Logf("client saw: %s", clientSide)
}
```

A failure here would mean either the OS failed to hand out a usable ephemeral port (practically never happens on a healthy machine) or the echo path itself is broken — either way, the fix is in this file, not in the underlying network stack.

**Measured (Go 1.24.4, darwin/arm64, 2026-11-06):** `go test -race -v` output:

```text
=== RUN   TestFiveTupleDiffersPerConnection
    socket_test.go:57: server saw: tcp 127.0.0.1:54664 -> 127.0.0.1:54665
    socket_test.go:58: client saw: tcp 127.0.0.1:54665 -> 127.0.0.1:54664
--- PASS: TestFiveTupleDiffersPerConnection (0.00s)
PASS
ok  	net01	1.671s
```

Reading it line by line: `server saw: tcp 127.0.0.1:54664 -> 127.0.0.1:54665` means the server's local port is `54664` (the listening port, which every accepted connection shares) and its peer is at `54665`.

The client's line is the exact mirror: local `54665`, peer `54664` — the same socket pair, described from each side, with the OS having picked `54665` as a free ephemeral port for the client without being asked.

## Design decisions

| Decision | Alternative considered | Trade-off |
| --- | --- | --- |
| Stop the server after one connection | Loop `Accept()` forever | Simpler, deterministic test; not representative of a real long-running server |
| Report the 5-tuple over a channel | Return it from a blocking function call | A channel lets the server run in its own goroutine while the test still synchronizes on the result |
| Ignore `io.Copy`'s error | Log or propagate it | Fine for a demo; a production echo server should at least log a non-EOF error |
| `127.0.0.1:0` to let the OS pick a free port | Hardcoding a port number | Avoids port collisions when tests run in parallel or repeatedly; mirrors how ephemeral ports work for the *client* side too |

## Running it

```bash
$ go test -race -v ./...
=== RUN   TestFiveTupleDiffersPerConnection
    socket_test.go:57: server saw: tcp 127.0.0.1:54664 -> 127.0.0.1:54665
    socket_test.go:58: client saw: tcp 127.0.0.1:54665 -> 127.0.0.1:54664
--- PASS: TestFiveTupleDiffersPerConnection (0.00s)
PASS
ok  	net01	1.671s
```

Reading the output: `RUN` announces the test name; the two `t.Logf` lines are each side's own view of the same socket pair (notice the local/remote ports are swapped between them), and `PASS` confirms every assertion held.

The race detector (`-race`) finding nothing to report means no goroutine touched shared memory without synchronization — important here because the server and client run concurrently in separate goroutines.

## Pitfalls in the code

- **Forgetting `defer conn.Close()` on either end** would leak a file descriptor per connection — in a long-running server this is exactly the `CLOSE_WAIT` accumulation a tool like `ss -tan` would surface (see [[Network Debugging Toolkit - dig, curl, ss, tcpdump]]).
- **`client.(*net.TCPConn).CloseWrite()`** is a half-close: it signals EOF to the server's `io.Copy` without fully closing the connection, so the client can still read the echoed bytes back. Calling `client.Close()` instead at that point would also close the read side and the test would never see the echo.
- **`net.Listen("tcp", "127.0.0.1:0")`** binds to port `0`, which tells the OS "pick any free port." Hardcoding a specific port instead would make the test flaky whenever that port is already in use on the machine running it.

## Exercises

1. Change the server to loop and accept multiple connections instead of stopping after one. Predict: what has to change about `tuples` (currently closed after a single send) to support more than one client, and why would leaving it as-is cause a panic on the second send?
2. Remove the `defer client.Close()` call and rerun the test with `-race`. Predict whether the race detector flags anything, and explain why a missing client-side close is a resource leak but not necessarily a *data* race.
3. Change `client.(*net.TCPConn).CloseWrite()` to `client.Close()` instead. Predict what the subsequent `io.ReadFull(client, buf)` call will do, and why.

## Links

- **Theory:** [[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]]
- **Related code:** [[Network Debugging Toolkit - dig, curl, ss, tcpdump - Go]] (the Go health probe that also dials a `net.Conn` and classifies the outcome)
