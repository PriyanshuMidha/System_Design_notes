---
tags: [networking, tcp, transport-layer]
level: advanced
status: draft
type: implementation
prereqs: ["[[How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP]]"]
related: ["[[TCP - Handshake, Reliability, Flow and Congestion Control]]", "[[UDP and QUIC]]", "[[HTTP Fundamentals - Methods, Status Codes, Headers, Cookies]]", "[[TLS and HTTPS]]", "[[Forward and Reverse Proxies - L4 vs L7]]", "[[Network Debugging Toolkit - dig, curl, ss, tcpdump]]"]
sources:
  - "RFC 793, Transmission Control Protocol"
  - "RFC 5681, TCP Congestion Control"
  - "RFC 6298, Computing TCP's Retransmission Timer"
  - "RFC 9293, Transmission Control Protocol (STD 7, obsoletes RFC 793)"
  - "Cardwell et al., BBR: Congestion-Based Congestion Control (ACM Queue, 2016)"
updated: 2026-11-13
---

# TCP - Handshake, Reliability, Flow and Congestion Control - Go

> [!summary] TL;DR
> This code models the two windows that gate every TCP sender — a flow-control `Window` (the receiver's buffer limit) and a congestion-control `Sender` (slow start, congestion avoidance, loss response) — and then proves the handshake and byte-stream behavior for real over a loopback socket. See the theory in [[TCP - Handshake, Reliability, Flow and Congestion Control]].

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" and "Before the code", then skim the Code section's plain-words lines and the Running it output. Skip the tests on a first pass.
> - 🟡 **Know the basics?** Read the Code and Tests sections properly, plus Design decisions.
> - 🔴 **Interview / SDE-3 prep?** Add Pitfalls in the code and do the Exercises. Headings are tagged 🟢🟡🔴.

**From zero** 🟢: this file is the hands-on twin of the TCP theory note. It builds TCP's two "how fast may I send" limits as tiny Go types you can run on your laptop — one for the receiver's buffer (flow control), one for the network's capacity (congestion control) — and then opens one real connection over loopback to prove the handshake and the byte-stream behavior are real, not just diagrams. Read the theory note first; here, read each code block's bold intro line, then the code.

## Before the code 🟢

- **Structs with methods:** `Window` and `Sender` are plain structs; methods like `OnACK` change their fields through a pointer receiver.
- **Two packages:** `wb` holds pure flow-control math with no networking; `main` holds congestion control and real sockets.
- **`net.Listener` / `net.Conn`:** Go's interfaces for a listening socket and one open connection; `Accept` and `Dial` hide the 3-way handshake.
- **Type assertion:** `conn.(*net.TCPConn)` turns the general `net.Conn` into the TCP-specific type that has `SetNoDelay` and `SetKeepAlive`.
- **Goroutine + channel:** the echo test runs `Serve` in a goroutine and collects its error on a buffered channel.
- **What to run:** `go vet ./...` then `go test -race ./...` in a module containing both packages.

## What this code shows 🟢

This note turns three separate pieces of the theory note into runnable code, each testable in isolation: a pure flow-control model with no network involved, a pure congestion-control state machine with no network involved, and then a real TCP connection over loopback that exercises the actual kernel handshake and socket options.

Keeping the first two network-free is deliberate — it lets the tests below assert exact `cwnd` values on every simulated RTT, something that would be far harder to pin down reliably against a real, jittery network path.

| Code | Theory concept | Theory section |
| --- | --- | --- |
| `wb.Window` | Flow control: the receiver's advertised window bounding in-flight bytes | [[TCP - Handshake, Reliability, Flow and Congestion Control#Flow control the sliding window]] |
| `Sender` (`Cwnd`, `Ssthresh`, `OnACK`, `OnLoss`) | Congestion control: slow start, congestion avoidance, multiplicative decrease | [[TCP - Handshake, Reliability, Flow and Congestion Control#Congestion control cwnd slow start CUBIC and BBR]] |
| `Serve` / `DialAndRoundtrip` | A real 3-way handshake (hidden inside `net.Dial`), `TCP_NODELAY`, and keepalive tuning | [[TCP - Handshake, Reliability, Flow and Congestion Control#Connection setup the 3-way handshake]], [[TCP - Handshake, Reliability, Flow and Congestion Control#Nagle's algorithm and TCP_NODELAY]] |
| `TestSlowStartThenCongestionAvoidance` | The exact doubling-then-linear growth curve RFC 5681 describes | [[TCP - Handshake, Reliability, Flow and Congestion Control#Congestion control cwnd slow start CUBIC and BBR]] |
| `TestTCPHandshakeAndEcho` | A byte stream, not a message queue: one write, one read, over a real socket | [[TCP - Handshake, Reliability, Flow and Congestion Control#Mental model]] |

## Setup 🟢

- **Module layout:** two packages — `wb` (the whiteboard flow-control model, in its own `wb/` subdirectory) and `main` (congestion control plus the real socket code), each with its own `_test.go` file.
- **Go version:** 1.24.
- **Dependencies:** standard library only (`net`, `io`, `time`).
- **Why two packages instead of one.** `wb` is kept separate on purpose: it has no dependency on `net` at all, so its tests run in microseconds and can never be flaky from network timing, unlike the socket tests in `main`.

  Splitting them this way mirrors a real codebase's instinct to keep pure, deterministic logic (flow control's arithmetic) apart from anything that touches the outside world (a real listener and dialer).
- **Run it:**

```text
go mod init tcpdemo
go vet ./...
go test -race ./...
```

## Code 🟡

### The whiteboard model: flow control alone

**In plain words: a tiny calculator that answers one question — "how many more bytes may I send before the receiver's inbox is full?"**

```go
package wb

// Window models flow control only: how many unacknowledged bytes a
// sender may have in flight, bounded by the receiver's advertised window.
type Window struct {
	NextSeq   int // next byte the sender will send
	UnackedAt int // oldest byte not yet ACKed
	RecvWin   int // bytes the receiver says it can still buffer
}

// CanSend reports how many more bytes may be sent right now.
func (w *Window) CanSend() int {
	inFlight := w.NextSeq - w.UnackedAt
	room := w.RecvWin - inFlight
	if room < 0 {
		return 0
	}
	return room
}

func (w *Window) Send(n int) { w.NextSeq += n }

// OnAck slides the window forward and applies the receiver's latest
// advertised window size.
func (w *Window) OnAck(ackSeq, newRecvWin int) {
	w.UnackedAt = ackSeq
	w.RecvWin = newRecvWin
}
```

**Concept.** This is the theory note's sliding-window diagram turned into state: `NextSeq - UnackedAt` is "bytes in flight," and `CanSend` is exactly the gate the theory note describes as `in-flight < rwnd`.

It deliberately knows nothing about congestion control — keeping flow control and congestion control as two separate types, rather than one combined "window" struct, mirrors the real protocol's own separation and makes each easy to test alone.

A single merged type was considered and rejected: it would make it impossible to write a test that proves flow control behaves correctly independent of whatever congestion control is doing.

**How it works.**
1. `NextSeq` and `UnackedAt` are the two ends of "bytes in flight" — the same gap the handshake's sequence numbers track in the theory note's ACK diagram.
2. `CanSend` clamps at zero instead of returning a negative number, modeling the real protocol's zero-window state, where the sender must stop and wait for a window update rather than ever sending a negative amount.
3. `OnAck` takes both the new ACKed position and the new advertised window in one call, because a real ACK segment always carries both pieces of information together — splitting them into two calls would let them go out of sync.

### Congestion control: the sender's state machine

**In plain words: the sender's own speedometer — double the speed each round trip while all is well, halve the remembered limit and restart slow when a packet is lost.**

```go
package main

// Sender models the congestion-control state machine of a TCP sender:
// slow start, congestion avoidance, and multiplicative-decrease on loss.
// Units are MSS-sized segments (MSS = Maximum Segment Size, the largest
// chunk of data one segment carries), matching RFC 5681's convention.
type Sender struct {
	Cwnd        float64 // congestion window, in segments
	Ssthresh    float64 // slow-start threshold, in segments
	InSlowStart bool
}

func NewSender() *Sender {
	return &Sender{Cwnd: 1, Ssthresh: 64, InSlowStart: true}
}
```

**Concept.** This implements the three-step algorithm in [[TCP - Handshake, Reliability, Flow and Congestion Control#Congestion control cwnd slow start CUBIC and BBR]]: `Cwnd` is the number the theory note calls the sender's own estimate of the network's capacity, and `Ssthresh` is the remembered "last known safe ceiling" that keeps a reconnecting sender from re-discovering capacity from zero.

`float64` was chosen over an integer segment count so the multiplicative-decrease math (`Cwnd / 2`) never needs separate rounding logic — real kernels track this in bytes with their own fixed-point rules, but segments-as-floats is the clearest model for teaching the shape of the curve.

```go
// OnACK runs once per RTT's worth of ACKs (one simulated round trip).
func (s *Sender) OnACK() {
	if s.Cwnd < s.Ssthresh {
		s.InSlowStart = true
		s.Cwnd *= 2 // slow start: cwnd doubles each RTT
	} else {
		s.InSlowStart = false
		s.Cwnd += 1 // congestion avoidance: +1 segment per RTT
	}
}

// OnLoss reacts to a retransmission timeout or three duplicate ACKs.
func (s *Sender) OnLoss() {
	s.Ssthresh = s.Cwnd / 2
	if s.Ssthresh < 2 {
		s.Ssthresh = 2
	}
	s.Cwnd = 1 // Reno-style multiplicative decrease back to slow start
	s.InSlowStart = true
}
```

**How it works.**
1. `OnACK`'s branch on `Cwnd < Ssthresh` is the entire slow-start/congestion-avoidance switch from the theory note: doubling while under threshold, then +1 per RTT once past it — there is no third state, the branch *is* the state machine.
2. The `Ssthresh` floor of 2 in `OnLoss` exists so a sequence of back-to-back losses can't drive the threshold toward zero and leave the sender permanently stuck unable to grow — a detail real stacks also guard against.
3. `OnLoss` resets `InSlowStart` to `true` because a Reno-style reset always re-enters slow start at `Cwnd = 1`, not congestion avoidance — the sender has to re-earn its way back up.
4. There's no separate "fast recovery" state modeled here; this is deliberately the simpler Reno-style collapse described in the theory note's variants table, not CUBIC's cubic-growth curve or BBR's model — see the theory note for why those differ.

### A real socket: handshake, `TCP_NODELAY` and keepalive

**In plain words: a real echo server — the kernel does the 3-way handshake for you inside `Accept` and `Dial`; this code just turns two tuning knobs and copies bytes back.**

```go
package main

import (
	"io"
	"net"
	"time"
)

// Serve accepts exactly one connection, tunes it, and echoes back everything
// it reads until the client closes its write side.
func Serve(ln net.Listener) error {
	conn, err := ln.Accept()
	if err != nil {
		return err
	}
	defer conn.Close()

	if tc, ok := conn.(*net.TCPConn); ok {
		tc.SetNoDelay(true)                     // disable Nagle: send small writes immediately
		tc.SetKeepAlive(true)                   // ask the OS to probe a silent peer
		tc.SetKeepAlivePeriod(30 * time.Second) // first probe after 30s idle
	}
	_, err = io.Copy(conn, conn) // echo
	return err
}
```

**Concept.** `ln.Accept()` is where the 3-way handshake from [[TCP - Handshake, Reliability, Flow and Congestion Control#Connection setup the 3-way handshake]] actually happens — the kernel completes SYN/SYN-ACK/ACK before `Accept` ever returns a connection to this code, so the handshake is real but invisible at this layer.

`SetNoDelay` and `SetKeepAlivePeriod` are the two knobs the theory note names directly: disabling Nagle for latency, and tuning keepalive so a silently dead peer (a dropped NAT mapping, a crashed host) is eventually detected instead of held open forever.

The alternative of leaving both at their OS defaults was rejected specifically because this demo wants to show the knobs exist, not just that an echo server works.

**How it works.**
1. `ln.Accept()` blocks until a client's handshake completes; everything before this line is below Go's visibility, handled entirely by the kernel's TCP stack.
2. The type assertion `conn.(*net.TCPConn)` is needed because `net.Listener.Accept` returns the general `net.Conn` interface — the TCP-specific tuning methods (`SetNoDelay`, `SetKeepAlive`) only exist on the concrete `*net.TCPConn` type.
3. `io.Copy(conn, conn)` reading and writing the same connection is what makes this an echo server: every byte read is immediately written back, with no buffering or framing logic of its own.

```go
// DialAndRoundtrip opens a TCP connection (the 3-way handshake happens
// inside Dial), writes msg, and returns the echoed bytes plus how long the
// round trip took.
func DialAndRoundtrip(addr string, msg []byte) ([]byte, time.Duration, error) {
	start := time.Now()
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return nil, 0, err
	}
	defer conn.Close()

	if _, err := conn.Write(msg); err != nil {
		return nil, 0, err
	}
	buf := make([]byte, len(msg))
	if _, err := io.ReadFull(conn, buf); err != nil {
		return nil, 0, err
	}
	return buf, time.Since(start), nil
}
```

**How it works.**
1. `net.Dial("tcp", addr)` is where the client side's handshake runs: `Dial` doesn't return until the 3-way handshake is complete and the connection is `ESTABLISHED`.
2. `io.ReadFull(conn, buf)` rather than a single `conn.Read` is the direct, working proof of the theory note's byte-stream warning: a single `Read` call is not guaranteed to return all `len(msg)` bytes in one call, even over loopback, so the code must keep reading until the buffer is full.
3. The timer wraps the whole call, so the measured duration in the Tests section below includes one real handshake plus one real data round trip, not just the data transfer alone.

> [!example]- Full file (serve.go)
> ```go
> package main
>
> import (
> 	"io"
> 	"net"
> 	"time"
> )
>
> func Serve(ln net.Listener) error {
> 	conn, err := ln.Accept()
> 	if err != nil {
> 		return err
> 	}
> 	defer conn.Close()
>
> 	if tc, ok := conn.(*net.TCPConn); ok {
> 		tc.SetNoDelay(true)
> 		tc.SetKeepAlive(true)
> 		tc.SetKeepAlivePeriod(30 * time.Second)
> 	}
> 	_, err = io.Copy(conn, conn)
> 	return err
> }
>
> func DialAndRoundtrip(addr string, msg []byte) ([]byte, time.Duration, error) {
> 	start := time.Now()
> 	conn, err := net.Dial("tcp", addr)
> 	if err != nil {
> 		return nil, 0, err
> 	}
> 	defer conn.Close()
>
> 	if _, err := conn.Write(msg); err != nil {
> 		return nil, 0, err
> 	}
> 	buf := make([]byte, len(msg))
> 	if _, err := io.ReadFull(conn, buf); err != nil {
> 		return nil, 0, err
> 	}
> 	return buf, time.Since(start), nil
> }
> ```

## Design decisions 🟡

A reader coming from the theory note might expect this code to model CUBIC or BBR directly, since those are what Linux and most production stacks actually run.

It deliberately doesn't: the goal here is a state machine small enough to assert an exact `cwnd` trace against, which only the simpler Reno-style rules in RFC 5681 allow. The table below lays out each choice and what it costs.

| Choice | Alternative | Trade-off |
| --- | --- | --- |
| `wb.Window` as its own package, separate from `Sender` | One combined `Connection` type holding both windows | Keeping flow control and congestion control as separate types lets each be tested in isolation, matching the theory note's point that they solve two different problems |
| `Cwnd`/`Ssthresh` as `float64` | Integer segment counts with manual rounding | Avoids writing custom rounding rules for `Cwnd / 2`; real kernels use fixed-point byte counts instead, which this demo intentionally simplifies away |
| Reno-style reset only (no CUBIC/BBR model) | Implementing CUBIC's cubic growth function | Keeps the state machine small enough to unit-test exactly against RFC 5681's three rules; CUBIC and BBR are covered conceptually in the theory note instead of re-implemented here |
| `io.ReadFull` in the client | A single `conn.Read` call | Matches the theory note's warning that TCP has no message boundaries — a single `Read` is not guaranteed to fill the buffer |

## Tests 🟡

### TestSlowStartThenCongestionAvoidance

**Property proved:** `Cwnd` doubles every simulated RTT while below `Ssthresh`, then grows by exactly 1 per RTT once past it — the exact curve RFC 5681 describes, not an approximation of it.

| Input | Expected output |
| --- | --- |
| `Ssthresh = 64`, 8 calls to `OnACK()` from `Cwnd = 1` | `Cwnd` trace: `1, 2, 4, 8, 16, 32, 64, 65` |

A failure here would mean the slow-start/congestion-avoidance switch is off by one RTT, or that growth past `Ssthresh` isn't linear — either would misrepresent exactly the mechanism this note exists to teach.

```go
func TestSlowStartThenCongestionAvoidance(t *testing.T) {
	s := NewSender()
	var cwnds []float64
	for i := 0; i < 8; i++ {
		cwnds = append(cwnds, s.Cwnd)
		s.OnACK()
	}
	// Slow start doubles: 1, 2, 4, 8, 16, 32 (next would cross Ssthresh=64,
	// so OnACK at i=5 flips into congestion avoidance: +1 from then on).
	want := []float64{1, 2, 4, 8, 16, 32, 64, 65}
	for i, w := range want {
		if cwnds[i] != w {
			t.Fatalf("cwnd[%d] = %v, want %v (trace: %v)", i, cwnds[i], w, cwnds)
		}
	}
}
```

### TestLossHalvesSsthreshAndResetsCwnd

**Property proved:** a loss event halves `Ssthresh` from the current `Cwnd` and resets `Cwnd` to 1 — the multiplicative-decrease half of additive-increase/multiplicative-decrease.

| Input | Expected output |
| --- | --- |
| `Cwnd` grown to 64 over 6 RTTs, then `OnLoss()` | `Ssthresh == 32`, `Cwnd == 1` |

A failure here would mean a lost segment doesn't actually shrink the sender's rate — the one behavior that keeps a congested network from collapsing under senders that never back off.

```go
func TestLossHalvesSsthreshAndResetsCwnd(t *testing.T) {
	s := NewSender()
	for i := 0; i < 6; i++ {
		s.OnACK()
	}
	before := s.Cwnd // 64 (six RTTs of doubling from 1: 1,2,4,8,16,32,64)
	s.OnLoss()
	if s.Ssthresh != before/2 {
		t.Fatalf("ssthresh = %v, want %v", s.Ssthresh, before/2)
	}
	if s.Cwnd != 1 {
		t.Fatalf("cwnd after loss = %v, want 1", s.Cwnd)
	}
}
```

### TestTCPHandshakeAndEcho

**Property proved:** a real TCP connection over loopback — handshake, write, read — round-trips a message unchanged, and the whole round trip (handshake included) is measurable.

| Input | Expected output |
| --- | --- |
| Dial a listener on `127.0.0.1`, write `"seq=1 ack=1 SYN,ACK"`, read it back | The echoed bytes equal the sent bytes; no error |

A failure here would mean either the handshake itself didn't complete (a `Dial` error) or the byte stream didn't round-trip correctly (a mismatch), which would undercut every claim this note makes about "it compiles, and it actually works."

```go
func TestTCPHandshakeAndEcho(t *testing.T) {
	ln, _ := net.Listen("tcp", "127.0.0.1:0")
	defer ln.Close()
	done := make(chan error, 1)
	go func() { done <- Serve(ln) }()

	msg := []byte("seq=1 ack=1 SYN,ACK")
	got, rtt, err := DialAndRoundtrip(ln.Addr().String(), msg)
	if err != nil {
		t.Fatalf("DialAndRoundtrip: %v", err)
	}
	if string(got) != string(msg) {
		t.Fatalf("echo = %q, want %q", got, msg)
	}
	t.Logf("loopback handshake + echo round trip: %v", rtt)
}
```

### TestWindowCanSendShrinksAsBytesGoInFlight (`wb` package)

**Property proved:** `CanSend` shrinks as bytes go in flight and tracks the receiver's latest advertised window after an ACK — the flow-control gate the theory note's sliding-window diagram describes.

| Input | Expected output |
| --- | --- |
| `RecvWin=100`, send 60 bytes, then ACK with a new `RecvWin=10` | `CanSend()` goes `100 → 40 → 10` |

A failure here would mean the whiteboard model doesn't actually enforce the window — exactly the bug class flow control exists to prevent in the real protocol.

```go
func TestWindowCanSendShrinksAsBytesGoInFlight(t *testing.T) {
	w := &Window{NextSeq: 0, UnackedAt: 0, RecvWin: 100}
	if got := w.CanSend(); got != 100 {
		t.Fatalf("CanSend() = %d, want 100", got)
	}
	w.Send(60)
	if got := w.CanSend(); got != 40 {
		t.Fatalf("CanSend() after sending 60 = %d, want 40", got)
	}
	w.OnAck(60, 10) // receiver's buffer is nearly full now
	if got := w.CanSend(); got != 10 {
		t.Fatalf("CanSend() after ack + shrunk window = %d, want 10", got)
	}
}
```

## Running it 🟢

```text
$ go vet ./...
$ go test -race ./... -v
=== RUN   TestSlowStartThenCongestionAvoidance
--- PASS: TestSlowStartThenCongestionAvoidance (0.00s)
=== RUN   TestLossHalvesSsthreshAndResetsCwnd
--- PASS: TestLossHalvesSsthreshAndResetsCwnd (0.00s)
=== RUN   TestTCPHandshakeAndEcho
    serve_test.go:22: loopback handshake + echo round trip: 330.917µs
--- PASS: TestTCPHandshakeAndEcho (0.00s)
PASS
ok  	tcpdemo	2.619s
=== RUN   TestWindowCanSendShrinksAsBytesGoInFlight
--- PASS: TestWindowCanSendShrinksAsBytesGoInFlight (0.00s)
PASS
ok  	tcpdemo/wb	1.468s
```

**Measured** (Go 1.24.4, darwin/arm64, loopback, 2026-11-09): the full connect + write + echo + read round trip over `127.0.0.1` took **331µs**, including one complete 3-way handshake hidden inside `net.Dial`.

Reading the output line by line: `go vet` printed nothing (no suspicious constructs found); every test ran under `-race`, Go's data-race detector, so a pass here is proof the two packages have no unsynchronized concurrent access, not just that the assertions happened to be true this run.

**Representative output (Linux, `ss` from iproute2)** — inspecting an established connection's congestion-control state (illustrative values, not from a live capture, since this machine is darwin and `ss` is Linux-only):

```console
$ ss -tin dst 10.0.4.12
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port
ESTAB  0      0       10.0.4.7:51342       10.0.4.12:443
	 cubic wscale:7,7 rto:204 rtt:3.4/1.1 mss:1448 cwnd:40 ssthresh:28
	 bytes_sent:184320 bytes_retrans:1448 bytes_acked:182872
	 segs_out:132 segs_in:131 send 136Mbps lastsnd:4 lastrcv:8
```

Reading it: `cubic` is the active congestion-control algorithm, `cwnd:40` segments (about 58KB at this `mss`) is currently allowed in flight, `ssthresh:28` shows a previous loss already happened (an ssthresh below the Reno default of ~2³¹ means a loss event set it), `rtt:3.4/1.1` is the smoothed RTT and its mean deviation in milliseconds, and `bytes_retrans:1448` shows exactly one segment was retransmitted so far.

Across all four tests, the shape to notice is the same one the theory note argues for: flow control and congestion control are proven as two entirely separate, independently-testable mechanisms, and only the socket test touches a real network at all.

That separation is also why a bug in one almost never shows up as a failure in another — each test's blast radius is exactly one mechanism.

## Pitfalls in the code 🔴

- **Comparing `Cwnd` with `==` after repeated multiplication** would be fragile with real floating-point segment sizes; this demo's inputs happen to stay exact powers of two, but production congestion-control code tracks bytes as integers specifically to avoid float drift over millions of RTTs.
- **Forgetting the `Ssthresh` floor of 2** in `OnLoss` would let a run of consecutive losses drive the threshold toward zero, permanently trapping the sender in a tiny `Cwnd` it can never grow out of.
- **Calling `conn.Read` once instead of `io.ReadFull`** is the single most common bug in code built on top of TCP: it happens to work on a fast loopback link in testing and then intermittently truncates messages in production once the network between client and server adds any real latency or packet fragmentation.
- **Skipping the `*net.TCPConn` type assertion's `ok` check** would panic on any `net.Conn` that isn't a TCP connection (for example, if this code were ever reused over a Unix domain socket listener).

Each exercise below is deliberately a "change this, predict the result" task, not a "write this from scratch" task: the point is to build intuition for how a small change to the state machine or the socket code ripples through the existing tests, the same intuition that matters when debugging a real connection's `cwnd` trace in production.

## Exercises 🔴

1. Change `OnLoss` to model "fast recovery" instead of a full reset: on a fast-retransmit-triggered loss (as opposed to a timeout), set `Cwnd = Ssthresh` instead of `Cwnd = 1`. Predict how the `TestSlowStartThenCongestionAvoidance`-style trace changes, then write a test for it.
2. Change `DialAndRoundtrip` to use a single `conn.Read(buf)` instead of `io.ReadFull(conn, buf)`, then run the existing test in a loop (`go test -race -count=100`). Predict whether it ever fails on loopback, and why relying on that result would still be a mistake for code that has to run over a real network.
3. Add a second `Serve` instance and a second `DialAndRoundtrip` call racing against the first inside one test, both writing to the same listener's address. Predict what `TestTCPHandshakeAndEcho`-style assertions would need to change to handle two concurrent connections instead of one, and why `Accept` only ever hands back one connection per call.

## Links

- **Theory:** [[TCP - Handshake, Reliability, Flow and Congestion Control]]
- **Related:** [[UDP and QUIC]], [[TLS and HTTPS]], [[Network Debugging Toolkit - dig, curl, ss, tcpdump]]
