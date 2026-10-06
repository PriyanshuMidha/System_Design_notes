# Go gRPC Streaming Patterns

## Types of gRPC calls

1. unary: one request, one response
2. server streaming: one request, many responses
3. client streaming: many requests, one response
4. bidirectional streaming: many requests, many responses

## Server streaming example

Use when client asks for invoice events and server streams updates.

```proto
rpc WatchInvoice(WatchInvoiceRequest) returns (stream InvoiceEvent);
```

## Client streaming example

Use when client uploads many payment events and server returns summary.

```proto
rpc ImportPayments(stream PaymentEvent) returns (ImportSummary);
```

## Bidirectional streaming example

Use for live chat/support or live collaboration.

```proto
rpc Chat(stream ChatMessage) returns (stream ChatMessage);
```

## Production issues

- flow control/backpressure
- cancellation
- send/receive goroutine coordination
- ordering
- timeouts
- partial failure
- client disconnects

## Coding task

Implement `WatchInvoice` server streaming RPC that sends fake status updates every second until context is cancelled.
