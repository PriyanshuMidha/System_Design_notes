---
tags: [caching, redis, go, setup, security]
level: basic
status: reviewed
prereqs: ["[[Redis Fundamentals]]"]
related: ["[[Redis in Go]]", "[[Redis Use Cases]]", "[[Redis in Production - Memory, Latency, Security]]", "[[Redis Replication, Sentinel and Cluster]]", "[[Docker 07 - Docker Compose for Local Development]]", "[[Rate Limiting - Algorithms and Distributed Design]]"]
sources:
  - "redis.io docs, redis-cli, SCAN, SLOWLOG, MONITOR, INFO, CONFIG SET"
  - "redis.io docs, Security (protected mode, ACL, TLS)"
  - "redis.io docs, Key eviction (maxmemory, maxmemory-policy, default noeviction)"
  - "Docker Hub, official redis image (redis-server arguments, /data volume)"
  - "go-redis v9 docs, Options (PoolSize default 10 per GOMAXPROCS, timeouts, ParseURL)"
  - "NIST SP 800-63B, out-of-band authenticators (short-lived codes, attempt limits)"
  - "Measured on Redis 8.2.1 locally: redis-cli sessions, maxmemory test, Go tests against port 6392"
updated: 2026-11-13
---

# Redis Hands-on Setup with Go

> [!summary] TL;DR
> Run Redis locally (Docker or a binary), learn the dozen `redis-cli` commands you will use daily, connect from Go with go-redis using explicit timeouts and pool size, and lock it down with a password, ACL users and no public port. The lab ends with a working one-time-password (OTP) service in Go.

> [!abstract] Core idea
> - Locally: one container with a named volume and a password; your Go app reads one `REDIS_URL`.
> - Daily `redis-cli`: `SET ... EX/NX`, `TTL`, `SCAN` (never `KEYS`), `INFO`, `SLOWLOG`; `MONITOR` only for a moment.
> - In Go: build the client once, set timeouts lower than your database latency, pass a `context` to every call.
> - Configure `maxmemory` and `maxmemory-policy` on day one; the default `noeviction` makes writes fail when memory is full.
> - Decide per feature what happens when Redis is down: a cache falls back to the database, an OTP check fails closed.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2, 3.1, 3.2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add 3.3 to 3.5 (redis-cli, memory and security settings), section 4 (the OTP service in Go), 5 and 6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Redis Fundamentals]]: Redis is a shared in-memory store; you send commands like `SET key value EX 60` and `GET key`, and each command runs on its own, one at a time.

**From zero, in 60 seconds** 🟢

This note is the "set it up properly" guide for Redis with Go.
You run Redis (on your laptop with Docker, or as a managed service), and your Go app talks to it through a **client** library, go-redis.
Getting it working takes five minutes; most trouble comes from three settings people skip.
One: **timeouts**, so your app gives up fast instead of hanging when Redis is slow.
Two: a memory limit, so Redis does not grow until it crashes.
Three: a password and a private network, so strangers cannot reach it.

```mermaid
flowchart LR
    G["Go app<br/>(go-redis client)"] -- "private network,<br/>password, timeouts" --> R["Redis<br/>(memory limit set)"]
```

Then the note builds one real feature: a login code (OTP) that expires after a few minutes and can only be used once.

```mermaid
flowchart LR
    S["send code: SET otp:42 EX 300"] --> V["user types code"]
    V --> C{"matches?"}
    C -- "yes" --> D["delete key, log in"]
    C -- "no" --> T["count tries; too many,<br/>code is thrown away"]
```

The rest of this note is just these 3 questions:
1. How do you start Redis and poke at it?
2. Which settings must you set on day one?
3. How do you build a small, safe feature on top of it in Go?

**The problem in one story.**
You want your Go app to remember things fast, like a login code sent by SMS.
You install Redis on your laptop and connect to it from Go.
It works on day one, but in production it can hang, fill up, or get hacked.
This note sets it up the safe way from the start.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Docker container | A packaged program that runs isolated on your machine | `docker run redis:8` |
| Port | A numbered door a server listens on | Redis listens on 6379 |
| `redis-cli` | The command-line tool to talk to Redis by hand | `redis-cli PING` → `PONG` |
| Client / connection pool | Your app's Redis handle, reusing a set of open connections | go-redis keeps 10 connections per CPU by default |
| Timeout | Max time to wait before giving up | Read timeout of 200 ms |
| `context` (Go) | A value that carries a deadline or cancel signal into a call | `ctx, cancel := context.WithTimeout(...)` |
| ACL | Access control list: which user may run which commands | User `app` cannot run `FLUSHALL` |
| OTP | One-time password, a short code valid for minutes | `482913`, expires in 5 min |
| Failover | A backup Redis taking over when the main one dies; it can pause traffic for a few seconds | Main node crashes, replica becomes main |
| p99 | The time 99 out of 100 requests finish within | p99 = 40 ms |
| HMAC | A fingerprint of a value made with a secret key; without the key you cannot fake or reverse it | `HMAC(secret, "u1:482913")` |
| Fail open / fail closed | When a check cannot run: let the request through / refuse it | Cache down: fail open; OTP check down: fail closed |

**Picture it**

```mermaid
flowchart LR
    Dev["You at redis-cli"] --> R["Redis container<br/>(password, maxmemory)"]
    App["Go app<br/>(go-redis client + timeouts)"] -- "REDIS_URL" --> R
    R --> V["Named volume<br/>(data on disk)"]
    X["Internet"] -. "blocked: no public port" .-x R
```

**Analogy.** Setting up Redis is like installing a safe in a shop: you pick where it goes, set a combination (password), decide how much it can hold (maxmemory), and tell staff how long to wait if it jams (timeouts).
Where it breaks: a full safe just refuses new items; Redis can instead throw out old keys if you pick an eviction policy.

**How the rest of this note builds up**

- First, what goes wrong without a careful setup (section 1) and the mental model (section 2).
- Then hands-on: starting Redis, daily `redis-cli` commands, memory config and security basics (section 3).
- Then a full worked example: a go-redis client and an OTP service with tests (section 4).
- Finally variants, trade-offs, production settings, the SDE-3 deep dive and interview questions (sections 5-9).

> [!tip] Remember
> Timeouts, `maxmemory` with a policy, and no public port: set all three on day one.

## 1. Why it exists 🟢

A new backend engineer adds Redis to a Go service. Three things usually go wrong in the first month:

1. The client has no read timeout. Redis stalls for 2 seconds during a failover, every request goroutine waits, and the service's p99 jumps from 40 ms to 2 s.
2. Nobody set `maxmemory`. The cache grows until the container's 512 MB limit and the kernel kills Redis. Or `maxmemory` is set but the policy stays `noeviction`, and writes start failing (measured below: 13,741 of 30,000 writes rejected).
3. Port 6379 is published to the internet without a password.
	- Exposed Redis servers are a well-known target for attackers who write **SSH keys** (files that let someone log in to the machine) or **cron jobs** (commands the machine runs on a schedule) through `CONFIG SET dir`.
	- Since Redis 7.0, `enable-protected-configs` (default `no`, measured on Redis 8.2) blocks changing `dir` at runtime, but an open port still leaks or wipes all data.

This note sets Redis up so none of these happen, and then builds one real feature end to end.

## 2. Mental model 🟢

Think of Redis as a **shared whiteboard in a locked room**.

- The **room** is the network boundary: only your app servers have a key to the door (private network, no public port).
- Each app gets its **own marker colour** (an ACL user) that can only write in its own corner (`~app:*` key patterns) and cannot wipe the board (`-@dangerous`).
- The board has a fixed size (`maxmemory`). When it is full, you choose: refuse new writing (`noeviction`) or erase the least recently used notes (`allkeys-lru`, an approximate LRU).
- Your Go client is a **team of runners** (the connection pool) carrying notes to the board. Each runner gives up after a set time (timeouts) instead of waiting forever.

**What a missing timeout does, as a picture.**

```mermaid
flowchart LR
    R["Redis stalls 2 s<br/>(failover)"] --> N["no timeout:<br/>every request waits 2 s"]
    R --> T["100 ms timeout:<br/>request fails fast,<br/>app falls back"]
```

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** the three settings people skip (timeouts, a memory limit, a password on a private network) and why each one matters. **Next we open the box**: the pieces involved, how to start Redis on your laptop, the daily `redis-cli` commands, and the memory and security settings with measured results.

### 3.1 The pieces

**In plain words:** the parts in play: Redis itself, the command-line tool, your Go app, and the pool of connections between them.

```mermaid
flowchart LR
    subgraph app["Go service (one process)"]
        H["HTTP handlers"] --> C["*redis.Client (built once)"]
        C --> P["connection pool: PoolSize 20, MinIdleConns 5"]
    end
    P -- "TCP 6379, private network, AUTH user + password, TLS in cloud" --> R["redis-server"]
    R --> CFG["config: maxmemory, maxmemory-policy, appendonly, protected-mode"]
    R --> V[("named volume /data: dump.rdb, appendonlydir")]
    OPS["you: redis-cli"] -- "same AUTH" --> R
    X["internet"] -. "blocked: never publish 6379" .-> R
```

### 3.2 Start Redis locally

**In plain words:** the exact commands to run Redis on your laptop, reachable only from your own machine.

With Docker (commands not run for this note; the official image passes extra arguments to `redis-server`):

```bash
docker volume create redis-data
docker run -d --name redis \
  -p 127.0.0.1:6379:6379 \
  -v redis-data:/data \
  redis:8.2 \
  redis-server --requirepass devpass --appendonly yes \
               --maxmemory 256mb --maxmemory-policy allkeys-lru
docker exec -it redis redis-cli -a devpass ping   # PONG
```

- `-p 127.0.0.1:6379:6379` publishes the port on **loopback** only (the address `127.0.0.1`, which only your own machine can reach), not on every network interface.
- The named volume keeps `dump.rdb` (Redis's snapshot file) and the AOF (append-only file: a log of every write) across container restarts.
- Use `valkey/valkey:8` instead of `redis:8.2` for Valkey; the commands are the same for everything in this note.

For a full Go API + Postgres + Redis stack, use Compose with a **healthcheck** (a small command Docker runs again and again to see if the service answers) so the API waits for Redis to be ready, not just started; see [[Docker 07 - Docker Compose for Local Development]].

```yaml
services:
  redis:
    image: redis:8.2
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}", "--appendonly", "yes",
              "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    volumes: ["redis-data:/data"]
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -a \"$REDIS_PASSWORD\" --no-auth-warning ping | grep PONG"]
      interval: 5s
      retries: 10
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
  api:
    build: .
    environment:
      REDIS_URL: redis://default:${REDIS_PASSWORD}@redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
volumes:
  redis-data: {}
```

Redis is not published to the host at all here: the API reaches it as `redis:6379` on the Compose network.

Without Docker (how this note's measurements were made):

```bash
redis-server --port 6392 --dir /tmp/redis-lab --daemonize yes --save '' --appendonly no
redis-cli -p 6392 ping
redis-cli -p 6392 shutdown nosave
```

### 3.3 redis-cli essentials

**In plain words:** the handful of terminal commands you will use every day to look inside Redis, and the ones that can freeze it.

Measured on Redis 8.2 (`redis-cli -p 6392`):

```text
> SET greeting hello EX 60        # value with a 60 s TTL
OK
> TTL greeting
(integer) 60
> SET greeting other NX           # only if the key does not exist
(nil)
> GET greeting
"hello"
> SET k v
OK
> TTL k                           # -1: no TTL
(integer) -1
> TTL nokey                       # -2: key does not exist
(integer) -2
> SET a 1 EX 100
OK
> SET a 2                         # plain SET drops the TTL...
OK
> TTL a
(integer) -1                      # ...use SET a 2 KEEPTTL to keep it
```

| Command | Use it for | Watch out |
| --- | --- | --- |
| `SET key val EX 60 NX` | create-if-absent with expiry in one atomic command | `SETNX` + `EXPIRE` as two commands can leave a key with no TTL |
| `TTL` / `PTTL` | seconds / ms left | -1 none, -2 missing |
| `SCAN 0 MATCH user:* COUNT 100` | walk keys in steps | may return few or zero matches per call; keep going until the cursor is `0` |
| `KEYS user:*` | never in production | blocks the server; measured 54 ms on 1M keys |
| `INFO memory` / `INFO stats` / `INFO keyspace` | memory, hits/misses, evictions, keys per DB | – |
| `SLOWLOG GET 10` | commands slower than `slowlog-log-slower-than` (µs) | time is server-side execution only, not network |
| `MONITOR` | see every command live, briefly, on a dev box | streams everything; a busy server slows down noticeably, and it shows values |
| `MEMORY USAGE key` | bytes for one key | – |
| `--bigkeys`, `--memkeys` (redis-cli flags) | find the largest keys with SCAN | runs SCAN over the whole keyspace; do it on a replica |
| `UNLINK key` | delete a big key without blocking | memory is freed in a background thread |

A real `SCAN` call on 40 keys (measured): `SCAN 0 MATCH 'user:*' COUNT 10` returned cursor `12` and only one key, `user:2`. That is normal: `COUNT` is how many slots to look at, not how many matches to return.

`INFO keyspace` output (measured): `db0:keys=43,expires=1,avg_ttl=9991,subexpiry=0`.

### 3.4 Memory config you set on day one

**In plain words:** tell Redis how much memory it may use, and what to do when full: drop old keys (a cache) or refuse writes (data you must keep).

| Setting | Meaning | For a cache | For durable state |
| --- | --- | --- | --- |
| `maxmemory` | Memory limit for data | ~70–80% of the box or container limit (an estimate that leaves room for fork copy-on-write and buffers) | same |
| `maxmemory-policy` | What to do when full | `allkeys-lru` or `allkeys-lfu` | `noeviction`: fail writes rather than drop data |
| `appendonly` | AOF log on/off | often `no` | `yes`, with `appendfsync everysec` |

Measured on Redis 8.2 with `maxmemory 8mb` and 30,000 writes of 300-byte values:
- With the default `noeviction`: 16,259 writes returned `OK` and 13,741 returned `OOM command not allowed when used memory > 'maxmemory'`.
- After `CONFIG SET maxmemory-policy allkeys-lru` and another 30,000 writes: all returned `OK`, `evicted_keys` reached 30,222 and 16,037 keys remained.

How the policies work is in [[Cache Eviction Policies - LRU, LFU, TTL]]; persistence trade-offs are in [[Redis Persistence - RDB and AOF]].

### 3.5 Security basics

**In plain words:** keep Redis off the internet, set a password, and give each app its own login that can only touch its own keys.

- **Protected mode** (on by default, measured `protected-mode yes`): if no password is set and Redis is bound to all interfaces, it refuses connections from non-loopback addresses.
- **Never expose 6379** to the internet. Use a private subnet and **security groups** (cloud firewall rules that say who may connect); publish to `127.0.0.1` only on a laptop.
- **ACL users** (since 6.0) instead of one shared password. Measured on Redis 8.2:

```text
> ACL SETUSER app on >s3cret ~app:* +@read +@write -@dangerous
OK
$ redis-cli --user app --pass s3cret SET app:x 1
OK
$ redis-cli --user app --pass s3cret SET other 1
NOPERM No permissions to access a key
$ redis-cli --user app --pass s3cret FLUSHALL
NOPERM User app has no permissions to run the 'flushall' command
$ redis-cli --user app --pass s3cret KEYS '*'
NOPERM User app has no permissions to run the 'keys' command
```

- **TLS** (encryption of network traffic, the "S" in HTTPS) for traffic between hosts (`rediss://` URLs in go-redis); managed services offer in-transit encryption.
- Disable the `default` user or give it a strong password once ACL users exist.

More (renaming commands, audit, secrets rotation) is in [[Redis in Production - Memory, Latency, Security]].

## 4. Worked example 🟡

**What this code does, in plain words:** it builds a login-by-code feature. When you ask for a code, the app makes 6 random digits, saves only a secret fingerprint of them in Redis for 5 minutes, and sends the digits by SMS. When you type the code, one small script in Redis checks it, counts your tries, and deletes the code on success or after 5 wrong tries, so a code can never be used twice.

### Whiteboard version

**In plain words:** the login-code feature as a few Redis commands: save the code with a timer, check it, count wrong tries.

```text
Feature: login with a 6-digit code sent by SMS.

Send(user):
  code  = 6 random digits from crypto/rand        (never math/rand)
  SET otp:<user> HMAC(secret, user:code) EX 300 NX
     -> nil? a code is already active: "try again later"
  DEL otp:attempts:<user>
  hand the code to the SMS provider               (never return it in HTTP)

Verify(user, code)  -- one Lua script, atomic:
  stored = GET otp:<user>            -> nil: expired or never sent
  tries  = INCR otp:attempts:<user>  (same TTL as the code)
  tries > 5  -> DEL both, "request a new code"
  stored == HMAC(code) -> DEL both, success (a replay finds nothing)
  else -> "wrong code"

Redis down -> Verify returns an error -> login fails closed.
```

```mermaid
sequenceDiagram
    participant U as User
    participant API as Go API
    participant R as Redis
    participant SMS as SMS provider
    U->>API: POST /otp/send {phone}
    API->>API: code = crypto/rand 6 digits, h = HMAC(secret, id:code)
    API->>R: SET otp:id h EX 300 NX
    alt key already exists
        R-->>API: nil
        API-->>U: 429 code already sent
    else created
        R-->>API: OK
        API->>R: DEL otp:attempts:id
        API->>SMS: send code
        API-->>U: 202 accepted (no code in body)
    end
    U->>API: POST /otp/verify {phone, code}
    API->>R: EVALSHA verify (GET, INCR attempts, compare, DEL)
    alt match within 5 tries
        R-->>API: 1 (both keys deleted)
        API-->>U: 200 logged in
    else wrong code
        R-->>API: 0
        API-->>U: 401 wrong code
    else 6th try or later
        R-->>API: -2 (both keys deleted)
        API-->>U: 429 request a new code
    else expired after 300 s
        R-->>API: -1
        API-->>U: 401 code expired
    end
```

The lifecycle of the `otp:<id>` key:

```mermaid
stateDiagram-v2
    [*] --> Active: SET otp:id h EX 300 NX
    Active --> Active: wrong code, attempts 1..5
    Active --> Deleted: right code (script DELs code and counter)
    Active --> Deleted: 6th attempt (script DELs both)
    Active --> Expired: 300 s pass
    Expired --> [*]: lazy or active expiry removes it
    Deleted --> [*]
```

### The client (Go 1.24, go-redis v9)

**In plain words:** make one shared Redis client per app, with clear timeouts and pool size.

```go
// Package setup builds a production-shaped go-redis client and an OTP service.
package setup

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// NewClient parses a URL such as redis://app:secret@localhost:6379/0
// (or rediss:// for TLS) and sets explicit timeouts and pool limits.
func NewClient(ctx context.Context, url string) (*redis.Client, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, fmt.Errorf("parse REDIS_URL: %w", err)
	}
	opt.DialTimeout = 2 * time.Second        // TCP + TLS + AUTH handshake
	opt.ReadTimeout = 500 * time.Millisecond // per command; keep below your DB latency
	opt.WriteTimeout = 500 * time.Millisecond
	opt.PoolSize = 20             // max open connections per process
	opt.MinIdleConns = 5          // warm connections, no dial on the hot path
	opt.PoolTimeout = time.Second // wait this long for a free connection

	rdb := redis.NewClient(opt)
	pingCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	if err := rdb.Ping(pingCtx).Err(); err != nil {
		rdb.Close()
		return nil, fmt.Errorf("redis ping: %w", err)
	}
	return rdb, nil
}

// Healthy is what a /readyz handler calls: one PING with a short deadline.
func Healthy(ctx context.Context, rdb *redis.Client) error {
	ctx, cancel := context.WithTimeout(ctx, 200*time.Millisecond)
	defer cancel()
	return rdb.Ping(ctx).Err()
}
```

- Build one `*redis.Client` per process and share it; it is safe for concurrent use.
- go-redis's default `PoolSize` is 10 connections per `GOMAXPROCS` (the number of CPU cores Go uses) (documented); setting it explicitly makes capacity planning visible: 30 pods × 20 connections = 600 server connections.
- The `context` you pass to each command also bounds it; cancelling the HTTP request cancels the Redis call.

### The OTP service

**In plain words:** the full login-code feature in Go: random codes, a time limit, a cap on wrong tries, and only one successful use.

```go
package setup

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"math/big"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	ErrTooSoon      = errors.New("otp: a code is already active")
	ErrNoCode       = errors.New("otp: no active code (expired or never sent)")
	ErrWrongCode    = errors.New("otp: wrong code")
	ErrTooManyTries = errors.New("otp: too many attempts, request a new code")
)

const (
	otpTTL      = 5 * time.Minute
	maxAttempts = 5
)

// OTP stores only an HMAC of the code, never the code itself.
type OTP struct {
	rdb    *redis.Client
	secret []byte // server-side pepper, from a secret manager
}

func NewOTP(rdb *redis.Client, secret []byte) *OTP { return &OTP{rdb: rdb, secret: secret} }

func codeKey(id string) string    { return "otp:" + id }
func attemptKey(id string) string { return "otp:attempts:" + id }

func (o *OTP) hash(id, code string) string {
	m := hmac.New(sha256.New, o.secret)
	m.Write([]byte(id + ":" + code))
	return hex.EncodeToString(m.Sum(nil))
}

// Send creates a 6-digit code with crypto/rand and stores its HMAC with
// SET ... EX 300 NX, so only one code is active per user. The caller hands the
// code to the SMS/email provider; it must never go into the HTTP response.
func (o *OTP) Send(ctx context.Context, id string) (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", err
	}
	code := fmt.Sprintf("%06d", n.Int64())
	ok, err := o.rdb.SetNX(ctx, codeKey(id), o.hash(id, code), otpTTL).Result()
	if err != nil {
		return "", err
	}
	if !ok {
		return "", ErrTooSoon
	}
	if err := o.rdb.Del(ctx, attemptKey(id)).Err(); err != nil { // fresh code, fresh attempt budget
		return "", err
	}
	return code, nil
}

// verifyScript does the whole check atomically, so two parallel requests with
// the right code cannot both succeed, and guesses cannot skip the counter.
// Returns 1 ok, 0 wrong, -1 no code, -2 too many tries.
var verifyScript = redis.NewScript(`
local stored = redis.call('GET', KEYS[1])
if not stored then return -1 end
local tries = redis.call('INCR', KEYS[2])
if tries == 1 then redis.call('PEXPIRE', KEYS[2], redis.call('PTTL', KEYS[1])) end
if tries > tonumber(ARGV[2]) then
  redis.call('DEL', KEYS[1], KEYS[2])
  return -2
end
if stored == ARGV[1] then
  redis.call('DEL', KEYS[1], KEYS[2])
  return 1
end
return 0
`)

// Verify checks a code. Redis being down is an error: OTP fails closed.
func (o *OTP) Verify(ctx context.Context, id, code string) error {
	res, err := verifyScript.Run(ctx, o.rdb,
		[]string{codeKey(id), attemptKey(id)}, o.hash(id, code), maxAttempts).Int()
	if err != nil {
		return err
	}
	switch res {
	case 1:
		return nil
	case 0:
		return ErrWrongCode
	case -1:
		return ErrNoCode
	default:
		return ErrTooManyTries
	}
}
```

Why each choice:
- `crypto/rand`: `math/rand` output is predictable; an attacker who sees a few codes could predict the next.
- **HMAC with a server secret** (sometimes called a **pepper**: a secret mixed into every hash and kept outside Redis), not a plain SHA-256: there are only 1,000,000 six-digit codes, so a plain hash leaked from Redis is reversed instantly by trying all of them.
- **Attempt counter inside the script**: guessing a 6-digit code with 5 tries succeeds with probability 5 in 1,000,000. Without the counter an attacker can try all codes in minutes.
- **Delete on success**: the same code cannot be replayed.
- `redis.NewScript` runs `EVALSHA` and falls back to `EVAL` if the script is not cached yet.
- Limiting how often `/otp/send` can be called per phone number and per IP belongs to a rate limiter; see [[Rate Limiting - Algorithms and Distributed Design]].

### Tests

**In plain words:** tests that ran against a real Redis, including 20 people entering the right code at once, where exactly one wins.

```go
package setup

import (
	"context"
	"errors"
	"os"
	"regexp"
	"sync"
	"sync/atomic"
	"testing"

	"github.com/redis/go-redis/v9"
)

func newClient(t *testing.T) *redis.Client {
	t.Helper()
	url := os.Getenv("REDIS_URL")
	if url == "" {
		url = "redis://localhost:6379/0"
	}
	rdb, err := NewClient(context.Background(), url)
	if err != nil {
		t.Skipf("no Redis: %v", err)
	}
	t.Cleanup(func() { rdb.Close() })
	return rdb
}

func newOTP(t *testing.T, id string) (*OTP, *redis.Client) {
	rdb := newClient(t)
	ctx := context.Background()
	rdb.Del(ctx, codeKey(id), attemptKey(id))
	t.Cleanup(func() { rdb.Del(ctx, codeKey(id), attemptKey(id)) })
	return NewOTP(rdb, []byte("test-secret")), rdb
}

func TestSendStoresHashWithTTL(t *testing.T) {
	ctx := context.Background()
	o, rdb := newOTP(t, "u1")
	code, err := o.Send(ctx, "u1")
	if err != nil {
		t.Fatal(err)
	}
	if !regexp.MustCompile(`^\d{6}$`).MatchString(code) {
		t.Fatalf("code %q is not 6 digits", code)
	}
	stored := rdb.Get(ctx, codeKey("u1")).Val()
	if stored == code || len(stored) != 64 {
		t.Fatalf("stored value must be a hex HMAC, got %q", stored)
	}
	if ttl := rdb.TTL(ctx, codeKey("u1")).Val(); ttl <= 0 || ttl > otpTTL {
		t.Fatalf("ttl = %v", ttl)
	}
	if _, err := o.Send(ctx, "u1"); !errors.Is(err, ErrTooSoon) {
		t.Fatalf("second Send: %v, want ErrTooSoon", err)
	}
}

func TestVerifyHappyPathDeletesCode(t *testing.T) {
	ctx := context.Background()
	o, rdb := newOTP(t, "u2")
	code, _ := o.Send(ctx, "u2")
	if err := o.Verify(ctx, "u2", code); err != nil {
		t.Fatal(err)
	}
	if n := rdb.Exists(ctx, codeKey("u2"), attemptKey("u2")).Val(); n != 0 {
		t.Fatalf("%d keys left after success", n)
	}
	if err := o.Verify(ctx, "u2", code); !errors.Is(err, ErrNoCode) {
		t.Fatalf("replay: %v, want ErrNoCode", err)
	}
}

func TestVerifyLocksAfterMaxAttempts(t *testing.T) {
	ctx := context.Background()
	o, _ := newOTP(t, "u3")
	code, _ := o.Send(ctx, "u3")
	wrong := "000000"
	if code == wrong {
		wrong = "111111"
	}
	for i := 0; i < maxAttempts; i++ {
		if err := o.Verify(ctx, "u3", wrong); !errors.Is(err, ErrWrongCode) {
			t.Fatalf("try %d: %v", i, err)
		}
	}
	if err := o.Verify(ctx, "u3", code); !errors.Is(err, ErrTooManyTries) {
		t.Fatalf("6th try with the right code: %v, want ErrTooManyTries", err)
	}
}

func TestParallelCorrectVerifySucceedsOnce(t *testing.T) {
	ctx := context.Background()
	o, _ := newOTP(t, "u4")
	code, _ := o.Send(ctx, "u4")
	var ok atomic.Int32
	var wg sync.WaitGroup
	for range 20 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if o.Verify(ctx, "u4", code) == nil {
				ok.Add(1)
			}
		}()
	}
	wg.Wait()
	if ok.Load() != 1 {
		t.Fatalf("%d successes, want exactly 1", ok.Load())
	}
}

func TestHealthy(t *testing.T) {
	if err := Healthy(context.Background(), newClient(t)); err != nil {
		t.Fatal(err)
	}
	down := redis.NewClient(&redis.Options{Addr: "localhost:1"})
	defer down.Close()
	if Healthy(context.Background(), down) == nil {
		t.Fatal("expected error for unreachable Redis")
	}
}
```

Measured: `REDIS_URL=redis://localhost:6392/0 go test -race ./setup/` against Redis 8.2 passed all five tests, including 20 parallel correct verifications of which exactly one succeeded.

## 5. Variants and comparison 🟡

Where to run Redis:

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Local binary or Docker | One process on your laptop | Development, tests | Nothing to manage; no HA |
| Self-managed on VMs or Kubernetes | You run primaries, replicas, Sentinel or Cluster | Full control, special modules, cost at large scale | You own upgrades, failover, backups, security |
| AWS ElastiCache (Valkey or Redis OSS engine), Google Memorystore, Azure Cache | Managed nodes in your **VPC** (your private network inside the cloud) with failover, snapshots, encryption | Most production services on that cloud | Per-node pricing; some commands and configs restricted |
| ElastiCache Serverless | Capacity scales automatically; billed by data stored and requests | Spiky or unknown load | Can cost more at steady high load |
| Upstash | Serverless Redis-compatible over TCP or HTTP, pay per request | Serverless/edge functions, low traffic | Per-request pricing; higher latency than in-VPC |

How a feature should behave when Redis is unavailable:

| Feature | Policy | Why |
| --- | --- | --- |
| Read-through cache | Fail open: log, skip Redis, read the database | The database is the source of truth; keep a short Redis timeout so the fallback is fast |
| OTP, session check | Fail closed: return an error | Letting users in without a check is a security hole |
| Rate limiter | Usually fail open with a local in-process limiter | Do not take the whole API down with Redis |
| Idempotency keys | Fail closed for payments | A duplicate charge is worse than a retry later |

## 6. Trade-offs and when not to use 🟡

- **Short timeouts vs false errors:** a 500 ms read timeout protects your p99, but a too-short timeout (say 5 ms) turns normal jitter into errors. Set it above Redis's p99.9 and below your database query time.
- **Large pools hide problems:** a pool of 500 per pod lets a slow Redis absorb thousands of waiting connections. A modest pool plus `PoolTimeout` fails fast instead.
- **`MONITOR` and `--bigkeys` in production:** both have real cost; run `--bigkeys` on a replica and `MONITOR` for seconds only.
- **When a simpler option wins:** if only one instance needs the data and losing it on restart is fine, an in-process cache needs no setup at all. For OTPs at small scale, a database row with an expiry column also works; Redis wins when you need TTL cleanup and atomic counters at high request rates.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how to run Redis safely, connect from Go with timeouts and a bounded pool, and build an OTP feature that cannot be replayed or brute-forced. **Next is the advanced part**: production setups, the failures you will meet, and the fine print behind the OTP script, `SCAN` and database numbers.

- **Real systems:** managed Redis/Valkey in a private subnet, one ACL user per service, TLS in transit, `REDIS_URL` from a secret manager.
- **Failure modes and fixes:**
	- Requests hang during a failover: set read/write timeouts and retries with backoff (go-redis retries some errors itself, `MaxRetries` default 3).
	- `OOM command not allowed`: set an eviction policy for caches, or more memory for durable data.
	- Connection storms after a deploy: `MinIdleConns` and a bounded `PoolSize`; watch `connected_clients` against `maxclients` (default 10,000).
	- Accidental `FLUSHALL` from a script: ACL `-@dangerous` for application users.
- **What to monitor:** `PoolStats()` from go-redis (hits, misses, timeouts, total and idle connections), Redis `connected_clients`, `used_memory`, `evicted_keys`, `rejected_connections`, `SLOWLOG` length, and your own error rate per Redis command.

## 8. Deep dive 🔴

- **Why OTP verification must be one script.** If the API did `GET`, compared in Go, then `DEL`, two requests carrying the right code could both pass the `GET` before either `DEL` ran, and the code would be used twice. The test `TestParallelCorrectVerifySucceedsOnce` runs 20 such requests and requires exactly one success.
- **Comparing hashes in Lua.** Lua string equality is not **constant-time** (it stops at the first differing character, so timing can leak how much matched), but the values compared are HMAC outputs keyed with a server secret, so timing reveals nothing useful about the code.
- **`SET NX` vs a resend button.** With `NX`, the user cannot get a new code until the old one expires or is used up. Products that want "resend after 60 s" store a separate cooldown key (`SET otp:cooldown:<id> 1 EX 60 NX`) and overwrite the code key instead.
- **`SCAN` guarantees.** A full iteration returns every key that existed for the whole scan at least once; keys may appear twice, and keys added or removed during the scan may or may not appear.
- **Database numbers.** `SELECT 3` works on a single node, but Redis Cluster supports only database 0. Use key prefixes instead of database numbers from the start.

## 9. Interview questions 🔴

> [!question]- How do you configure a Go Redis client for production?
> One shared `*redis.Client`, URL from secrets, explicit `DialTimeout`, `ReadTimeout`/`WriteTimeout` below the database's latency, a bounded `PoolSize` with `PoolTimeout`, a `context` with deadline on every call, TLS and an ACL user. Then decide per feature whether a Redis error fails open or closed.

> [!question]- Trap: you run `SETNX key v` and then `EXPIRE key 300`. What can go wrong?
> If the process crashes or the connection drops between the two commands, the key exists forever with no TTL; for a lock or OTP that means a permanent block. Use the single atomic `SET key v NX EX 300`.

> [!question]- Why does `SCAN 0 MATCH user:* COUNT 10` sometimes return no keys with a non-zero cursor?
> `COUNT` is the amount of work per call (slots examined), and `MATCH` filters afterwards. A call can find no matches and still have more to scan. Keep calling until the cursor returns to 0.

> [!question]- How would you design OTP storage in Redis?
> `crypto/rand` 6-digit code; store an HMAC of it with `SET otp:<id> <hmac> EX 300 NX`; never return the code in the API response; verify in one Lua script that checks, increments an attempt counter with the same TTL, deletes both keys on success or after 5 tries. Rate-limit sends per phone and IP.

> [!question]- What happens when Redis reaches `maxmemory` with default settings?
> The default policy is `noeviction`: reads still work but commands that add memory fail with `OOM command not allowed`. Measured on Redis 8.2 with an 8 MB limit, 13,741 of 30,000 writes failed. For a cache set `allkeys-lru` or `allkeys-lfu`.

> [!question]- How do you secure a Redis instance?
> Private network only, never publish 6379; protected mode on; ACL users with key patterns and no dangerous commands; TLS between hosts; strong secrets from a secret manager; disable or lock down the `default` user.

## 10. Cheat sheet 🟢

- Docker: named volume `/data`, `--requirepass`, publish only to `127.0.0.1`; Compose waits on a `healthcheck`.
- Daily commands: `SET k v EX n NX`, `TTL`, `SCAN`, `INFO`, `SLOWLOG GET`, `MEMORY USAGE`, `UNLINK`.
- Never in production: `KEYS`, long `MONITOR`, `FLUSHALL` from app users.
- Day one config: `maxmemory` + `maxmemory-policy` (`allkeys-lru` for caches; default `noeviction` fails writes).
- Go client: one instance, URL from secrets, timeouts, bounded pool, `context` on every call.
- OTP: `crypto/rand`, store an HMAC, `EX 300 NX`, attempt counter in the same script, delete on success, never return the code.
- Redis down: caches fail open, auth checks fail closed.

## Self-check 🟢🟡

🟢 Easy

> [!question]- Why should a Go Redis client always have a read timeout?
> Without one, a Redis stall (for example a failover) makes every request wait as long as Redis does.

> [!question]- Which command lists keys safely in production: `KEYS` or `SCAN`?
> `SCAN`, which walks the keys in small steps; `KEYS` blocks the server.

> [!question]- What is the default `maxmemory-policy`, and what does it do when memory is full?
> `noeviction`: writes fail with an `OOM` error.

🟡 Medium

> [!question]- Why use `SET key v NX EX 300` instead of `SETNX` followed by `EXPIRE`?
> If the app crashes between the two commands, the key lives forever with no TTL.

> [!question]- Why is the OTP check one Lua script instead of GET, compare, DEL from Go?
> Two requests with the right code could both pass the GET before either DEL, so the code would be used twice.

> [!question]- When Redis is down, should a cache read and an OTP check behave the same?
> No. The cache fails open and reads the database; the OTP check fails closed and refuses the login.

## Links 🟢

- **Before this:** [[Redis Fundamentals]]
- **Next:** [[Redis Data Structures and When to Use Each]], [[Redis Use Cases]], [[Redis in Go]]
- **Go deeper:** [[Redis in Production - Memory, Latency, Security]], [[Redis Persistence - RDB and AOF]]
- **Compare with:** [[Docker 07 - Docker Compose for Local Development]], [[Sessions and Cookies]]

### Watch on YouTube

- [Beginner's Guide to Redis with Go!](https://www.youtube.com/watch?v=1C3Ym_JjkMw) · TutorialEdge · concise intro to connecting to Redis from Go
- [Setup Redis & Go with Docker Compose ( Redis CLI setup included )](https://www.youtube.com/watch?v=nxubvWC0MNc) · Jason Cheung · hands-on local setup walkthrough with Docker Compose and redis-cli
