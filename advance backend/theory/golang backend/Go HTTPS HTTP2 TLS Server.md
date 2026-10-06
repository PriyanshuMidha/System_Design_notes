# Go HTTPS HTTP2 TLS Server

## HTTPS

HTTPS is HTTP over TLS. It protects traffic from eavesdropping and tampering.

## HTTP/2

HTTP/2 supports multiplexing, header compression, and efficient long-lived connections. gRPC commonly uses HTTP/2.

## Go server

```go
srv := &http.Server{
    Addr:         ":8443",
    Handler:      mux,
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  60 * time.Second,
}

err := srv.ListenAndServeTLS("server.crt", "server.key")
```

## Production reality

Often TLS is terminated by a load balancer/reverse proxy, but backend engineers still need to understand certificates, SANs, private keys, and secure transport.

## Common mistakes

- self-signed cert in production
- missing SAN in local cert
- weak TLS config
- no timeouts
- logging private key or secrets

## Coding task

Run InvoiceOps locally with HTTPS and document how TLS changes curl commands.
