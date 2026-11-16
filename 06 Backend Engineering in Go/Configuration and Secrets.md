---
tags: [backend, go, configuration, secrets]
level: basic
status: reviewed
prereqs: ["[[Service Project Layout and Wiring]]"]
related: ["[[HTTP Server Fundamentals (net-http)]]", "[[Secrets Management]]", "[[Graceful Shutdown and Health Checks]]"]
sources:
  - "12factor.net, III. Config"
  - "Go 1.24 flag package docs"
  - "Go 1.24 log/slog package docs, LogValuer"
updated: 2026-11-13
---

# Configuration and Secrets

> [!summary] TL;DR
> Configuration is every value a service needs that changes between environments without changing code: addresses, timeouts, feature flags and credentials. It is loaded once, in `main`, into one typed `Config` struct, validated completely before anything else starts, and never read from `os.Getenv` anywhere else in the codebase.

> [!abstract] Core idea
> - Read the environment exactly once, in `main`, into a typed struct; everything else takes that struct (or fields of it) as a constructor argument.
> - `os.LookupEnv`, not `os.Getenv`: a variable set to `""` is not the same as a variable that was never set.
> - Collect every validation error with `errors.Join` and fail fast before any dependency is built, so one run reports every missing variable instead of one at a time.
> - A secret is a special kind of config value: never commit it, never log it, and its storage and rotation are a different concern (link [[Secrets Management]]) from the typed-loading problem this note solves.
> - Precedence, lowest to highest: built-in defaults → config file → environment variables → command-line flags.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and the cheat sheet (10). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add section 3 (how it works), 4 (worked example) and 5-6.
> - 🔴 **Interview / SDE-3 prep?** Add 7, 8 and 9. Headings are tagged 🟢🟡🔴 so you always know where you are.

**From zero, in 60 seconds** 🟢

Your service runs in different places — your laptop, a test server, production. In each place the database address, the port and the passwords are different.

**Configuration** is all those per-place values. The rule in Go: read them once, at startup, into one typed struct, and check them all before the service starts. Nothing else in the codebase ever calls `os.Getenv` directly.

```mermaid
flowchart LR
    E[Env vars / files] --> L[Load once in main] --> V{All valid?}
    V -- no --> X[Refuse to start, list every problem]
    V -- yes --> C[One Config struct passed to everything]
```

A **secret** is a config value that must never be printed or committed: passwords, API keys. They load the same way but are stored and logged differently.

The rest of this note is just these 4 questions:
1. Where do values come from, and which source wins (resolution order)?
2. How do you parse and validate them into one struct, failing fast?
3. How are secrets stored and kept out of logs?
4. Why are feature flags not the same thing as config?

**The problem in one story.**
Your service runs on your laptop, in staging and in production.
Each place uses a different database and a different secret key.
You do not want to edit and rebuild the code for each place.
So the code reads these values from outside, once, when it starts.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Environment variable | A named text value the OS hands to a program at start | `HTTP_ADDR=:8080` |
| Config | Every value that changes per environment, not per code change | DB address, timeouts |
| Secret | A config value that must never be shown or committed | `JWT_SECRET`, DB password |
| Struct | A Go type that groups named fields | `type Config struct { Addr string }` |
| Parse | Turn text into a typed value | `"5s"` → `5 * time.Second` |
| Validate | Check every value is present and sensible | port must be a number |
| Default | The value used when nothing is set | `:8080` if `HTTP_ADDR` is unset |

**Picture it**

```mermaid
flowchart LR
    D["Defaults"] --> L["Load()<br/>in main"]
    E["Env vars"] --> L
    F["Flags"] --> L
    L -- "any error" --> X["Exit with<br/>all errors listed"]
    L -- "ok" --> C["Typed Config"]
    C --> S["Server, DB,<br/>other parts"]
```

**Analogy.** A shop manager checks one opening-day form, all fields at once, then hands each desk only what it needs.
Where it breaks: a paper form cannot change later, while a real service may reload some values (feature flags) at runtime through a different system.

**How the rest of this note builds up**

- First, why config lives outside the code (section 1) and the form mental model (section 2).
- Then how loading works: `LookupEnv` vs `Getenv`, typed parsing, `errors.Join` and precedence (section 3).
- Then a full `Load` function with a redacting `Secret` type (section 4) and library choices (section 5).
- Finally the SDE-3 view: production failures, secret rotation and deep-dive trade-offs (sections 6-8).

> [!tip] Remember
> Read config once in `main`, check everything together, fail fast, and never print a secret.

### Whiteboard version

**In plain words:** the smallest load-once-validate-everything config loader.

The shape every service needs, with nothing else: read one variable, fail if it's missing, parse it.

```go
addr, ok := os.LookupEnv("HTTP_ADDR")
if !ok {
    addr = ":8080" // default
}

rawTimeout := os.Getenv("SHUTDOWN_TIMEOUT")
timeout, err := time.ParseDuration(rawTimeout)
if err != nil {
    return fmt.Errorf("SHUTDOWN_TIMEOUT: %w", err)
}
```

The rest of this note turns that one-variable shape into a typed struct that loads every variable a service needs, validates all of them together, and keeps secrets out of logs.

## 1. Why it exists 🟢

InvoiceOps runs the same binary in three environments: a developer's laptop, a staging cluster and production. The database address, the log verbosity and the JWT signing key are different in each one, but the code that uses them must not change.

The [12-factor app](https://12factor.net/config) rule for this is strict: config is read from the environment, never baked into the binary and never read from a committed file alongside the code (a config file checked into git is still code, just worse code — it can't differ per environment without a new commit).

Concretely, if `internal/repository` called `os.Getenv("DATABASE_URL")` directly, every package that needs a connection string would duplicate that call, nothing would catch a missing variable until the exact line that reads it executes — possibly minutes into a request — and no test could set a fake value without mutating real process state.

A typed `Config`, loaded once in `main` and passed down as a constructor argument, fixes all three: one place reads the environment, `Load` fails before the server starts if anything is missing or malformed, and tests pass in a fake config instead of a real environment.

## 2. Mental model 🟢

Treat configuration like a form someone has to fill out completely before a shop opens for the day.

`Load` is the manager reading that form once, at opening time: every required field gets checked, every optional field gets a sensible default if left blank, and if three fields are wrong the manager tells the owner about all three circumstances at once rather than stopping at the first blank box and making them submit the form repeatedly.

Only once the form passes does the shop's `main` hand it to the cash register, the stockroom and the delivery desk — not one of which goes and reads the form itself.

A secret is a field on that form that gets covered with a strip of tape before anyone photocopies it. It's still filled in, it still works when the register needs it, but anyone just glancing at the form, or printing it in a report, only ever sees "REDACTED".

## 3. How it works 🟡

### Resolution order

**In plain words:** when the same setting is set in two places, a fixed ranking decides which one wins — flags beat env vars beat files beat defaults.

```mermaid
flowchart LR
    D[built-in defaults] --> F[config file, optional] --> E[environment variables] --> A[flags] --> V{validate all fields}
    V -- "all valid" --> C[typed Config]
    V -- "any invalid" --> X["errors.Join: every problem, one error"]
```

Each stage only overrides what the previous stage set; nothing re-reads a variable that's already been resolved. Flags exist for local overrides and smoke tests (`./invoiceops --http-addr=:9091`); in a container, environment variables carry everything, since there usually is no interactive flag to pass.

### `LookupEnv` vs `Getenv`, and why it matters

`os.Getenv(key)` returns `""` both when the variable is unset and when it's set to an empty string — the two are indistinguishable. `os.LookupEnv(key)` returns `(value, ok)`, so "not set, use the default" and "set to empty on purpose" are different cases.

For a required field like `JWT_SECRET`, that distinction is the difference between "fail loudly because an operator forgot to set it" and "silently sign tokens with an empty-string key", which is a confirmed footgun, not a hypothetical one.

### Typed parsing

Every environment variable arrives as a `string`. `Load` converts each one with the standard-library function built for that type, not `fmt.Sscanf` or hand-rolled parsing:

| Field kind | Parser | Failure looks like |
| --- | --- | --- |
| Integer | `strconv.Atoi` / `strconv.ParseInt` | non-numeric string |
| Duration | `time.ParseDuration` ("25s", "2m30s") | missing unit, typo |
| Boolean | `strconv.ParseBool` ("1", "t", "true", "0", "f", "false") | anything else |
| URL | `net/url.Parse` | malformed DSN |
| Log level | `slog.Level.UnmarshalText` | not debug/info/warn/error |

Every parse failure is collected, not returned immediately — see the next section.

### Startup sequence

```mermaid
sequenceDiagram
    participant M as main
    participant L as config.Load
    participant R as repository.Open
    participant H as httpserver.New

    M->>L: Load(flags)
    L->>L: read env, parse, validate every field
    alt any field invalid
        L-->>M: error (every problem joined)
        M->>M: print to stderr, os.Exit(1)
    else all fields valid
        L-->>M: Config
        M->>R: Open(cfg.DatabaseURL)
        M->>H: New(cfg.HTTPAddr, cfg.JWTSecret, db)
    end
```

Nothing downstream of `Load` ever reads an environment variable again; every dependency is constructed from the fields of `cfg` that `main` already validated.

### Fail-fast validation that reports everything at once

**In plain words:** if 3 settings are wrong, say all 3 in one go — do not make the operator fix them one restart at a time.

A naive loader returns on the first error:

```go
if v, ok := os.LookupEnv("DATABASE_URL"); !ok {
    return Config{}, fmt.Errorf("DATABASE_URL is required")
}
// never reaches the JWT_SECRET check if DATABASE_URL was already missing
```

An operator fixes `DATABASE_URL`, redeploys, and immediately hits the next missing variable — one broken deploy per missing field.

`errors.Join` (Go 1.20) fixes this: every check appends to a slice of errors regardless of whether earlier checks failed, and `errors.Join(errs...)` folds them into one error whose `Error()` lists every message, separated by newlines, and whose `Unwrap() []error` still lets `errors.Is`/`errors.As` inspect each one individually.

### Precedence and libraries

Flags beat environment variables beat a config file beat defaults.

The standard library's `flag` package is enough for a handful of overrides; past a dozen flags, or when documented, typed, prefix-based env binding is wanted, `github.com/caarlos0/env` and `github.com/kelseyhightower/envconfig` do the struct-tag-to-field mapping this note's `Load` does by hand, with no config-file support.

`github.com/knadh/koanf` adds layered file + env + flag merging without `viper`'s global, package-level state (`viper.Get` reads a singleton no test can isolate) and without viper's automatic key lowercasing, which silently breaks a key that differs only by case.

### Secrets: storage, not just loading

**In plain words:** a password needs more than loading: it must live somewhere locked (a secret store), rotate, and never appear in a log line.

`JWT_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are config values, but they need more care than an address or a timeout:

- **Source.** In Kubernetes, a `Secret` object is mounted either as environment variables (visible to anything that can read the pod spec or exec into the container) or as files under a volume mount (readable only by processes with filesystem access, and rotatable by updating the file without restarting the pod if the application watches it). AWS Secrets Manager, SSM Parameter Store and HashiCorp Vault serve the same purpose outside Kubernetes, typically fetched at startup through a sidecar (the CSI Secrets Store driver, External Secrets Operator) that still lands the value as a file or env var the typed loader reads the same way.
- **Rotation.** A short-lived process picks up a new secret on its next restart. A long-running one needs either a signal handler that re-reads config on `SIGHUP`, or a dedicated poller that watches the mounted file and swaps the in-memory value — database credentials under Vault's dynamic-secrets engine expire on a schedule and need exactly this.
- **Never logged.** This is where the typed loader pays for itself: wrap every secret field in a type whose `String()`, `GoString()` and `slog.LogValuer.LogValue()` all return a fixed redacted string, so `fmt.Sprintf("%v", cfg)`, `%+v` on a struct that embeds it, and structured logging all redact it by construction — nobody has to remember to avoid logging `cfg.JWTSecret` by convention.

### Feature flags are not config

A feature flag (`new-checkout-flow: true`) changes behavior per user, cohort or percentage rollout, and typically flips without a deploy through a dedicated service (LaunchDarkly, Unleash, a database-backed flag table). Startup config is read once and fixed for the process's lifetime.

Treating a flag as a `Config` field means every flip needs a restart; treating config as a flag means a value that should never change per-request (`DATABASE_URL`) now has runtime-mutable state nothing guards. (Flag system design is [[Feature Flags]]'s job.)

## 4. Worked example 🟡

A `config` package that loads InvoiceOps' startup configuration: env vars with `os.LookupEnv`, typed parsing, `errors.Join` validation, flag overrides and a redacting `Secret` type. It compiles and passes `go vet` and `go test -race` on Go 1.24.4.

```go
// Package config loads InvoiceOps' typed configuration once at startup,
// from (lowest to highest precedence) defaults, an optional file, the
// environment, then flags, and validates everything before main wires any
// dependency.
package config

import (
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"time"
)

// Config is the one typed struct every dependency in main is built from.
// Nothing outside this package calls os.Getenv directly.
type Config struct {
	Env             string // "dev" | "staging" | "prod"
	HTTPAddr        string
	DatabaseURL     *url.URL
	RedisAddr       string
	JWTSecret       Secret
	WebhookSecret   Secret
	LogLevel        slog.Level
	ShutdownTimeout time.Duration
}

// Secret wraps a credential so it can be passed around and logged safely:
// String and LogValue both redact it, so fmt.Sprintf, %v, %+v and slog all
// print "REDACTED" instead of the value, even inside a struct that embeds it.
type Secret string

func (s Secret) String() string       { return "REDACTED" }
func (s Secret) GoString() string     { return "REDACTED" }
func (s Secret) LogValue() slog.Value { return slog.StringValue("REDACTED") }
func (s Secret) Reveal() string       { return string(s) } // the only way to get the real value out

// source abstracts "where do I read a named variable from", so Load can be
// pointed at a fake map in tests instead of the real environment.
type source interface {
	Lookup(key string) (string, bool)
}

// envSource reads from the real process environment via os.LookupEnv, which
// distinguishes "unset" from "set to empty string"; os.Getenv cannot.
type envSource struct{}

func (envSource) Lookup(key string) (string, bool) { return os.LookupEnv(key) }

// FlagSet carries the subset of flags allowed to override the environment.
// A zero value (no flags parsed) changes nothing.
type FlagSet struct {
	HTTPAddr string
	LogLevel string
}

// Load builds a Config from defaults, the environment, then flags (flags
// win), collecting every validation error with errors.Join instead of
// stopping at the first one, so an operator sees every problem in one run.
func Load(fs FlagSet) (Config, error) {
	return load(envSource{}, fs)
}

// load is Load's testable core: it takes a source instead of the real
// environment so tests can inject fake values without touching os.Setenv.
func load(src source, fs FlagSet) (Config, error) {
	var errs []error

	get := func(key, def string) string {
		if v, ok := src.Lookup(key); ok {
			return v
		}
		return def
	}
	require := func(key string) string {
		v, ok := src.Lookup(key)
		if !ok || v == "" {
			errs = append(errs, fmt.Errorf("%s: required and not set", key))
		}
		return v
	}

	cfg := Config{
		Env:      get("APP_ENV", "dev"),
		HTTPAddr: get("HTTP_ADDR", ":8080"),
	}

	rawDB := require("DATABASE_URL")
	if rawDB != "" {
		u, err := url.Parse(rawDB)
		if err != nil {
			errs = append(errs, fmt.Errorf("DATABASE_URL: %w", err))
		} else {
			cfg.DatabaseURL = u
		}
	}

	cfg.RedisAddr = get("REDIS_ADDR", "localhost:6379")
	cfg.JWTSecret = Secret(require("JWT_SECRET"))
	cfg.WebhookSecret = Secret(require("RAZORPAY_WEBHOOK_SECRET"))

	levelStr := get("LOG_LEVEL", "info")
	if fs.LogLevel != "" {
		levelStr = fs.LogLevel // flags win over env
	}
	if err := cfg.LogLevel.UnmarshalText([]byte(levelStr)); err != nil {
		errs = append(errs, fmt.Errorf("LOG_LEVEL: %w", err))
	}

	shutdownRaw := get("SHUTDOWN_TIMEOUT", "25s")
	d, err := time.ParseDuration(shutdownRaw)
	if err != nil {
		errs = append(errs, fmt.Errorf("SHUTDOWN_TIMEOUT: %w", err))
	} else if d <= 0 {
		errs = append(errs, fmt.Errorf("SHUTDOWN_TIMEOUT: must be positive, got %s", d))
	} else {
		cfg.ShutdownTimeout = d
	}

	if fs.HTTPAddr != "" {
		cfg.HTTPAddr = fs.HTTPAddr // flags win over env and defaults
	}

	switch cfg.Env {
	case "dev", "staging", "prod":
	default:
		errs = append(errs, fmt.Errorf("APP_ENV: must be dev, staging or prod, got %q", cfg.Env))
	}

	if len(errs) > 0 {
		return Config{}, errors.Join(errs...)
	}
	return cfg, nil
}

// ParseFlags is what main calls before Load, so flags are parsed exactly
// once and tests never touch the global flag.CommandLine.
func ParseFlags(args []string) FlagSet {
	fset := flag.NewFlagSet("invoiceops", flag.ExitOnError)
	addr := fset.String("http-addr", "", "override HTTP_ADDR")
	level := fset.String("log-level", "", "override LOG_LEVEL")
	_ = fset.Parse(args)
	return FlagSet{HTTPAddr: *addr, LogLevel: *level}
}
```

`main` wires it (illustrative — a `main` package isn't unit-tested the way the package above is):

```go
func main() {
	fs := config.ParseFlags(os.Args[1:])
	cfg, err := config.Load(fs)
	if err != nil {
		fmt.Fprintln(os.Stderr, "invalid configuration:\n"+err.Error())
		os.Exit(1)
	}
	// cfg is now immutable for the process's lifetime; every dependency
	// below is constructed from it, never from a fresh env read.
	db := repository.Open(cfg.DatabaseURL)
	srv := httpserver.New(cfg.HTTPAddr, cfg.JWTSecret, db)
	_ = srv
}
```

Five tests covering the behavior that matters: valid load, every error collected at once (not just the first), required fields reported by name, flag precedence, and that a `Secret` never prints its real value through any formatting path (`go test -race`, all pass):

```go
// fakeSource lets tests inject environment values without touching the real
// process environment, so tests can run in parallel safely.
type fakeSource map[string]string

func (f fakeSource) Lookup(key string) (string, bool) {
	v, ok := f[key]
	return v, ok
}

func validEnv() fakeSource {
	return fakeSource{
		"APP_ENV":                 "prod",
		"HTTP_ADDR":               ":9090",
		"DATABASE_URL":            "postgres://user:pass@localhost:5432/invoiceops",
		"REDIS_ADDR":              "localhost:6379",
		"JWT_SECRET":              "super-secret-jwt",
		"RAZORPAY_WEBHOOK_SECRET": "whsec_abc123",
		"LOG_LEVEL":               "debug",
		"SHUTDOWN_TIMEOUT":        "30s",
	}
}

func TestLoadValid(t *testing.T) {
	cfg, err := load(validEnv(), FlagSet{})
	if err != nil {
		t.Fatalf("load() returned error on a fully valid environment: %v", err)
	}
	if cfg.Env != "prod" {
		t.Errorf("Env = %q, want prod", cfg.Env)
	}
	if cfg.HTTPAddr != ":9090" {
		t.Errorf("HTTPAddr = %q, want :9090", cfg.HTTPAddr)
	}
	if cfg.LogLevel != slog.LevelDebug {
		t.Errorf("LogLevel = %v, want debug", cfg.LogLevel)
	}
	if cfg.ShutdownTimeout.String() != "30s" {
		t.Errorf("ShutdownTimeout = %v, want 30s", cfg.ShutdownTimeout)
	}
	if cfg.DatabaseURL == nil || cfg.DatabaseURL.Host != "localhost:5432" {
		t.Errorf("DatabaseURL not parsed correctly: %+v", cfg.DatabaseURL)
	}
}

// TestLoadCollectsEveryError proves errors.Join is actually used to report
// every missing/invalid field in one run, not just the first one found.
func TestLoadCollectsEveryError(t *testing.T) {
	env := fakeSource{
		"APP_ENV":          "nonsense",
		"LOG_LEVEL":        "not-a-level",
		"SHUTDOWN_TIMEOUT": "not-a-duration",
		// DATABASE_URL, JWT_SECRET, RAZORPAY_WEBHOOK_SECRET left unset
	}
	_, err := load(env, FlagSet{})
	if err == nil {
		t.Fatal("expected an error, got nil")
	}
	wantSubstrings := []string{
		"DATABASE_URL", "JWT_SECRET", "RAZORPAY_WEBHOOK_SECRET",
		"LOG_LEVEL", "SHUTDOWN_TIMEOUT", "APP_ENV",
	}
	msg := err.Error()
	for _, want := range wantSubstrings {
		if !strings.Contains(msg, want) {
			t.Errorf("error message missing %q; got: %s", want, msg)
		}
	}
	// errors.Join's result supports errors.Is/As traversal over each joined error.
	var count int
	for range unwrapJoined(err) {
		count++
	}
	if count < 6 {
		t.Errorf("expected at least 6 joined errors, got %d", count)
	}
}

// unwrapJoined reads the Unwrap() []error method errors.Join's result
// implements, the documented way to inspect a joined error's members.
func unwrapJoined(err error) []error {
	type multiUnwrap interface{ Unwrap() []error }
	if m, ok := err.(multiUnwrap); ok {
		return m.Unwrap()
	}
	return nil
}

func TestLoadRequiredMissing(t *testing.T) {
	env := fakeSource{"APP_ENV": "dev", "HTTP_ADDR": ":8080"}
	_, err := load(env, FlagSet{})
	if err == nil {
		t.Fatal("expected error when required secrets are missing")
	}
	if !strings.Contains(err.Error(), "JWT_SECRET") {
		t.Errorf("error should name the missing JWT_SECRET, got: %v", err)
	}
}

// TestFlagsOverrideEnv proves the documented precedence: flags beat env.
func TestFlagsOverrideEnv(t *testing.T) {
	cfg, err := load(validEnv(), FlagSet{HTTPAddr: ":1111", LogLevel: "warn"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.HTTPAddr != ":1111" {
		t.Errorf("HTTPAddr = %q, want flag override :1111", cfg.HTTPAddr)
	}
	if cfg.LogLevel != slog.LevelWarn {
		t.Errorf("LogLevel = %v, want warn from flag override", cfg.LogLevel)
	}
}

// TestSecretNeverPrintsRealValue proves Secret redacts in every common
// formatting path: %v, %s, %+v (via a wrapping struct) and slog.
func TestSecretNeverPrintsRealValue(t *testing.T) {
	s := Secret("hunter2-really-secret")

	for _, out := range []string{fmt.Sprintf("%v", s), fmt.Sprintf("%s", s), s.String()} {
		if strings.Contains(out, "hunter2") {
			t.Errorf("formatted output leaked the secret: %q", out)
		}
	}

	type wrapper struct{ JWT Secret }
	if out := fmt.Sprintf("%+v", wrapper{JWT: s}); strings.Contains(out, "hunter2") {
		t.Errorf("%%+v on a struct leaked the secret: %q", out)
	}

	var buf bytes.Buffer
	slog.New(slog.NewTextHandler(&buf, nil)).Info("startup", "jwt_secret", s)
	if strings.Contains(buf.String(), "hunter2") {
		t.Errorf("slog leaked the secret: %q", buf.String())
	}

	if s.Reveal() != "hunter2-really-secret" {
		t.Error("Reveal() must still return the real value for actual use")
	}
}
```

**Measured:** all five tests pass under `go test -race` on Go 1.24.4, darwin/arm64, 2026-11-07.

## 5. Variants and comparison 🟡

| Approach | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Hand-written `Load` (above) | `os.LookupEnv` + manual parse + `errors.Join` | Default for a small to mid service; full control, zero dependencies | More code than a library, but the most readable failure messages |
| `caarlos0/env` / `envconfig` | Struct tags (`env:"HTTP_ADDR"`) reflect-mapped to fields | Many flat env vars, little custom validation | Reflection at startup only (cheap); still needs custom `errors.Join` validation on top |
| `koanf` | Layered providers (file, env, flag) merged into one config map, then unmarshalled | Need a config file plus env plus flags, with explicit provider order | More moving parts; worth it once a file is a real requirement |
| `viper` | Same job as koanf, with a global singleton (`viper.GetString`) | Avoid for new code: the singleton can't be isolated in tests, and it lowercases keys silently | Hidden global state, surprising key matching |
| K8s Secret as env vars | Secret's keys injected as process env vars | Simple, works with this note's `Load` unmodified | Visible to anything that can read the pod spec (`kubectl describe pod`) or exec into the container |
| K8s Secret as mounted file | Secret's keys written as files under a volume | Rotation without a pod restart (watch the file); slightly more restrictive read access | Loader needs a file-watch path, not just env read |
| External Secrets Operator / CSI Secrets Store | Pulls from Vault/AWS Secrets Manager/SSM into a K8s Secret or volume automatically | Secrets live in a dedicated store, Kubernetes never holds the source of truth | Extra infrastructure component to operate |

## 6. Trade-offs and when not to use 🟡

- A tiny CLI tool with three flags doesn't need a `Config` struct or `errors.Join`; plain `flag.String` calls in `main` are simpler and the extra layer would be padding.
- Reflection-based env binding (`caarlos0/env`) trades a few lines of boilerplate for a less readable failure path when a tag is malformed; worth it once the field count passes roughly 15-20.
- A config file adds a deploy artifact to manage (who packages it, where does it live, how does it get updated without a binary rebuild) — skip it until environment variables and flags together are no longer expressive enough (nested structures, arrays of backend targets).
- Watching a mounted secret file for rotation adds a goroutine and a race to get right (swap the value atomically, don't read half-written bytes mid-update); a short-lived process that restarts on every deploy doesn't need it at all.

## 7. In production 🔴

- **Real systems:** every 12-factor-style service (Heroku's own apps, most Go services at Uber, Stripe and similar companies per their public engineering blogs) load config this way: one typed struct, built once, in `main`. Kubernetes' own `ConfigMap`/`Secret` objects are designed around "inject as env vars or mount as files", matching the two Config-loading paths this note covers.
- **Failure modes → fixes:**
  - A deploy silently starts with an empty JWT secret → `os.Getenv` returning `""` was indistinguishable from unset; switch every required field to `LookupEnv` + `require`.
  - An operator fixes one missing variable, redeploys, hits the next one → the loader returned on the first error instead of collecting all of them; use `errors.Join`.
  - A secret shows up in a log aggregator or an error-tracking dashboard → a struct containing it was passed to `%+v`, `fmt.Println` or a JSON encoder without a redacting type; wrap every secret field in a type with `String()`/`GoString()`/`LogValue()` all redacting, as above.
  - Two replicas behave differently after the "same" deploy → one picked up a stale `ConfigMap`/`Secret` because nothing restarted it; either restart on config change (most common) or implement an explicit reload path and prove it with a test.
- **What to monitor:** a start-up metric or log line that names which config fields came from env vs flags vs defaults (for debugging "why is staging behaving like prod"); an alert on any production container exiting immediately after start (frequently a config validation failure caught right where this note intends it to be caught).

## 8. Deep dive 🔴

- **Why validate everything before constructing anything.** If `Load` returns as soon as `DATABASE_URL` parses, and `main` goes on to call `repository.Open(cfg.DatabaseURL)` before checking `cfg.JWTSecret`, a malformed JWT secret now surfaces as a runtime panic deep inside the auth middleware on the first request, not as a startup failure with a clear message. Validating the whole struct before `main` constructs a single dependency turns every configuration mistake into the same failure mode: a readable message on stderr and a non-zero exit code, at the moment before any resource (a DB connection, a listening socket) was even opened.
- **`UnmarshalText` as the general typed-parsing hook.** `slog.Level` implements `encoding.TextUnmarshaler`, and so can custom config enums — implementing that one interface method lets `Load` call the same `field.UnmarshalText([]byte(raw))` pattern for any string-backed type without hand-rolling a switch statement per type, and the same type becomes usable directly with `encoding/json` and `encoding/yaml` for free.
- **Why `Secret` is a distinct type, not a convention.** A team rule ("never log `cfg.JWTSecret` directly") is only as good as everyone remembering it, every time, including six months from now when someone adds a debug log line under deadline pressure. A type-level guarantee (`LogValue()` always redacts) holds regardless of who writes the next line of code, and `go vet` combined with a lint rule can even flag a raw `string` field tagged `secret` that bypasses the wrapper.
- **Test isolation without `os.Setenv`.** `t.Setenv` (Go 1.17) is the right tool for testing code that must call `os.Getenv` directly, and it automatically restores the previous value and fails if the test calls `t.Parallel()` (mutating process-global env is inherently unsafe across parallel tests). The `source` interface in this note's `Load` goes one step further: tests never touch real env vars at all, so `TestLoadCollectsEveryError` and friends can run with `t.Parallel()` with zero risk of interference.

## 9. Interview questions 🔴

> [!question]- Why `os.LookupEnv` instead of `os.Getenv` for required fields?
> `Getenv` returns `""` both when a variable is unset and when it's deliberately set to empty, so a required secret left unset silently becomes an empty string instead of a startup error. `LookupEnv` returns `(value, ok)`, letting `Load` distinguish "missing" from "empty on purpose" and fail loudly on the former.

> [!question]- What does `errors.Join` buy you that returning on the first error doesn't?
> It collects every validation failure into one error whose message lists all of them, instead of stopping at the first one. An operator sees every misconfigured field in a single deploy attempt rather than fixing variables one redeploy at a time, and `Unwrap() []error` still lets `errors.Is`/`errors.As` inspect any individual joined error.

> [!question]- Where should a service read its configuration from: `main`, or wherever it's first needed?
> `main`, exactly once, into a typed struct passed down as constructor arguments. Reading `os.Getenv` scattered across packages means no single place can validate everything together, a missing variable surfaces as a runtime failure deep in whatever code path first needs it, and tests can't substitute a fake value without mutating real process state.

> [!question]- A Kubernetes Secret is mounted as environment variables for one service and as a file for another. Why the difference, and which is more secure?
> Environment variables are visible to anything that can read the pod spec (`kubectl describe pod`, any process that can see `/proc/<pid>/environ`) and typically require a pod restart to rotate. A mounted file is readable only by processes with filesystem access and can be updated in place, letting a service pick up a rotated secret without restarting if it watches the file — more secure and more operable, at the cost of needing a file-watch code path instead of a one-time env read.

> [!question]- Trap: is a feature flag just another config field?
> No. Config is read once at startup and fixed for the process's lifetime; a feature flag changes behavior per user or rollout percentage and typically flips without a deploy, through its own service. Modeling a flag as a `Config` field means every flip needs a restart, which defeats the point of having a flag system at all.

> [!question]- Why wrap `JWTSecret` in a `Secret` type instead of trusting the team not to log it?
> A type-level guarantee (`String()`, `GoString()` and `slog.LogValue()` all redacting) holds no matter who writes the next line of code or how much deadline pressure they're under; a convention only holds as long as everyone remembers it, every time, which is the exact failure mode that leaks secrets into log aggregators in practice.

> [!question]- What's the precedence order between a config file, environment variables and flags, and why that order?
> Defaults, then a config file, then environment variables, then flags — each later source overrides only the fields it sets. Flags are highest because they're the most deliberate, explicit, per-invocation override (a one-off smoke test); environment variables carry the normal per-deployment configuration in containers, where there's rarely an interactive flag to pass.

## 10. Cheat sheet 🟢

- Read config once, in `main`, into a typed `Config` struct; never scatter `os.Getenv` calls across packages.
- `os.LookupEnv`, not `os.Getenv`, for anything required — it distinguishes unset from empty.
- Parse with the matching stdlib function (`strconv`, `time.ParseDuration`, `net/url.Parse`, `UnmarshalText`); never hand-roll parsing.
- Collect every validation error with `errors.Join` and fail before any dependency is constructed.
- Precedence: defaults → file → environment → flags.
- Wrap every secret in a type whose `String()`/`GoString()`/`LogValue()` all redact it.
- Secrets come from K8s Secrets (env or mounted file), AWS Secrets Manager/SSM, or Vault — storage and rotation are a different concern from typed loading.
- A feature flag is not config: config is fixed per process start, a flag flips at runtime through its own system.

## Links 🟢

- **Before this:** [[Service Project Layout and Wiring]]
- **Next:** [[HTTP Server Fundamentals (net-http)]]
- **Compare with:** [[Secrets Management]] (storage, rotation and access control for the secret values this note loads)

### Watch on YouTube

- [27. The Twelve-Factor App](https://www.youtube.com/watch?v=2_fcv3-XfN4) · Sriniously · covers the 12-factor Config principle this note's precedence rules are based on
