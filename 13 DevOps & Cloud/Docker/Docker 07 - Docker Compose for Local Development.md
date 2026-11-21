---
tags: [devops, docker, local-development]
level: intermediate
prereqs: ["[[Docker 05 - Networking and Port Publishing]]", "[[Docker 06 - Volumes and Bind Mounts]]"]
related: ["[[Docker 04 - Writing a Production Dockerfile for Go]]", "[[Kubernetes Fundamentals]]", "[[CI-CD Pipelines (GitHub Actions for Go)]]"]
sources:
  - "Docker Compose file reference (Compose Specification), docs.docker.com"
  - "Docker Compose v2 CLI reference, docs.docker.com"
status: reviewed
updated: 2026-11-13
---

# Docker 07 - Docker Compose for Local Development

> [!summary] TL;DR
> Docker Compose describes a multi-container application — the API, its database, its cache, its workers — in one YAML file, and `docker compose up` builds, networks, and starts all of them together. It is for one machine: local development and CI, not a production orchestrator.

> [!abstract] Core idea
> - One `compose.yaml` lists every service; Compose creates one project network and one DNS name per service automatically.
> - `depends_on` only orders container *start*; a `healthcheck` plus `condition: service_healthy` is what waits for a service to be *ready*.
> - Named volumes hold state (databases); bind mounts hold live source code; both outlive `down`, only `down -v` removes named volumes.
> - Classic mistake: treating `depends_on` as a readiness gate, so the API starts before Postgres accepts connections and crashes on its first query.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and 10 (why, mental model and the cheat sheet). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add sections 3, 4, 5 and 6 (how it works, a worked example, options and trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add sections 7, 8 and 9 (production, deep dive and interview questions). Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Docker 05 - Networking and Port Publishing]]: containers on a user-defined network find each other by name, and `-p` lets your laptop reach a container.
> - [[Docker 06 - Volumes and Bind Mounts]]: named volumes keep database data alive across container replacement; bind mounts show your code folder live inside a container.

**From zero, in 60 seconds** 🟢

A real app needs several containers: the API, a database, a cache, maybe a worker.
Starting each by hand means long commands and the right order every time.
**Docker Compose** lets you write all of them in one YAML file. Then one command starts everything.

```mermaid
flowchart LR
    F["compose.yaml"] --> U["docker compose up"]
    U --> A["API"]
    U --> D["Postgres"]
    U --> R["Redis"]
```

Compose also puts them on one private network, so the API can reach the database just by the name "db".
It is meant for your laptop and CI tests, not for running production.

The rest of this note is just these 3 questions:
1. What goes in a Compose file (services, networks, volumes)?
2. How do you make the API wait until the database is truly ready?
3. What does a full Go + Postgres + Redis setup look like?


**The problem in one story**

A new teammate joins and wants to run the app on their laptop.
The app needs a Go API, Postgres, Redis and a background worker.
Without a shared file they copy four long `docker run` commands from a wiki and get one flag wrong.
Compose writes the whole stack down once, so `docker compose up` starts everything the same way for everyone.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Service | One kind of container in your app | `api`, `postgres`, `redis` |
| YAML | A plain-text config format using indentation | `ports:` then `- "3000:3000"` |
| Image vs build | Use a ready image, or build one from your Dockerfile | `image: redis:7` / `build: .` |
| Environment variable | A named setting passed to a program at start | `DATABASE_URL=postgres://...` |
| Healthcheck | A command Docker runs to ask "is this ready?" | `pg_isready -U postgres` |
| Named volume | Docker-managed storage that outlives containers | `pgdata` |
| Port publishing | Making a container port reachable from the host | `"3000:3000"` |
| `depends_on` | "Start that service before this one" (start, not ready) | `api` depends on `postgres` |
| Project name | The label Compose puts on everything it creates, usually the folder name | `myapp_postgres_1` |
| Migration | A script that creates or changes database tables | "add column `status` to `orders`" |
| Interpolation | Filling `${VAR}` in the file from your `.env` file | `${POSTGRES_PASSWORD}` |
| Crash-loop | A container that keeps starting, failing and restarting | API dies on its first DB query, again and again |
| Orchestrator | A system that runs containers across many machines and heals them | Kubernetes |

**Picture it**

```mermaid
flowchart LR
    File["compose.yaml"] -->|"docker compose up"| Net["Project network"]
    Net --> API["api"]
    Net --> PG[("postgres")]
    Net --> R["redis"]
    API -->|"by service name"| PG
    API --> R
```

**Analogy**

A Compose file is a recipe card: list every ingredient and step once, and anyone can cook the same dish.
Where it breaks: a recipe does not keep the kitchen running if the stove fails; Compose also has no failover or multi-host scheduling.

**How the rest of this note builds up**

- First, why hand-written `docker run` scripts break down and the "parts list" mental model.
- Then how Compose networks services and the difference between start order and readiness.
- Then a full Go API + Postgres + Redis + worker example, with a Go readiness endpoint and test.
- Finally the SDE-3 deep dive: project names, override files, profiles and why Compose is not production orchestration.

> [!tip] Remember
> `depends_on` orders start; only a healthcheck with `condition: service_healthy` waits for ready.

## 1. Why it exists 🟢

Running an API, a Postgres database, a Redis cache, and a background worker by hand means four `docker run` commands, a hand-built network so they can find each other, and remembering the right flags every time:

```bash
docker network create devnet
docker run -d --name postgres --network devnet -e POSTGRES_PASSWORD=dev -v pgdata:/var/lib/postgresql/data postgres:17
docker run -d --name redis --network devnet redis:7
docker run -d --name api --network devnet -p 3000:3000 -e DATABASE_URL=postgres://postgres:dev@postgres:5432/app myapp:api
docker run -d --name worker --network devnet -e DATABASE_URL=postgres://postgres:dev@postgres:5432/app myapp:worker
```

That is four commands to remember, four to tear down in the right order, and no single place that says what the application actually consists of.

Compose replaces all four `docker run` invocations with one declarative file (it says what should exist, not the steps to make it) and two commands: `docker compose up -d` and `docker compose down`.

### Real-life example: a seat-booking service on day one 🟢

Say you join the team behind seat booking on an app like BookMyShow.
The booking API needs Postgres for bookings and Redis to hold a seat for a few minutes while you pay.
The repo has a `compose.yaml`, so you run `docker compose up -d` and the API, Postgres, Redis and a worker all start, already wired together by name.
If the API started before Postgres was ready it would crash, so the file makes it wait for a health check.
When you are done, `docker compose down` cleans everything up but keeps your test bookings in the volume.

## 2. Mental model 🟢

A Compose file is a **parts list for one application**, not a cluster manager. Think of it as a recipe card pinned to the project folder: every teammate who clones the repo runs `docker compose up` and gets the exact same stack — same versions, same environment variables, same network topology (which service can reach which) — without reading a setup wiki.

Compose derives a **project name** from the folder (or `name:` in the file, or `-p`), and every resource it creates is prefixed with it: `myapp_postgres_1`, `myapp_devnet`. That is also the isolation boundary — two projects in two folders never collide.

```mermaid
flowchart LR
    F1["folder: shop/"] --> P1["shop_postgres_1, shop_default network"]
    F2["folder: blog/"] --> P2["blog_postgres_1, blog_default network"]
    P1 -.-|"never collide"| P2
```

## Common beginner mistakes 🟢

- **Trusting `depends_on` to wait for the database** → it only waits for the container to start, so the API connects too early and crashes → add a `healthcheck` and `condition: service_healthy`.
- **Publishing Postgres and Redis ports "just in case"** → they become reachable from outside the project with weak passwords → publish only the API; others talk by service name.
- **Running `docker compose down -v` as a habit** → it deletes your database volume → use plain `down`.
- **Committing `.env` with real passwords** → secrets end up in Git history → commit a `.env.example` and keep `.env` in `.gitignore`.
- **Expecting `up` to rebuild after a code or dependency change** → it reuses the old image → run `docker compose up -d --build` or use `docker compose watch`.

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that Compose writes a whole multi-container app into one file and starts it with one command. **Next we open the box**: what the file is made of, how services find each other, and the key difference between "started" and "ready".

**In plain words:** a Compose file lists services (containers), plus the networks and volumes they share. Compose reads it and does all the docker run work for you.

**Step by step (what `docker compose up` does):**
1. Reads `compose.yaml` and fills in `${VAR}` values from `.env`.
2. Creates one network for the project (say `myapp_default`) and any named volumes, like `pgdata`.
3. Builds or pulls the image for each service.
4. Starts the services in `depends_on` order, waiting for health checks where the file asks for it.
5. Each service can now reach the others by name: the API connects to `postgres:5432`.

```mermaid
flowchart LR
    DB["db starts"] --> H{"healthcheck passes?"}
    H -- "no, retry" --> H
    H -- "yes" --> API["api starts (depends_on: healthy)"]
```

A Compose file has four kinds of top-level things:

- `services` (the containers)
- `volumes` (named, persistent storage)
- `networks` (how services reach each other)
- `configs`/`secrets` (files mounted in, since Compose v2: settings files and passwords handed to containers as files)

Compose v2 (the `docker compose` plugin, not the old standalone `docker-compose`) needs no `version:` key — the Compose Specification is versionless, and the plugin now ships alongside Docker Engine in current installs (bundled with Docker Desktop, and installed as `docker-compose-plugin` next to `docker-ce` on Linux).

```mermaid
flowchart TB
    subgraph net["devnet (default project network, bridge driver)"]
        api["api<br/>build: .<br/>ports: 3000:3000"]
        worker["worker<br/>build: .<br/>(no published port)"]
        pg[("postgres<br/>image: postgres:17<br/>volume: pgdata")]
        redis["redis<br/>image: redis:7"]
    end
    host(["host: localhost:3000"]) --> api
    api -- "postgres:5432 (service-name DNS)" --> pg
    api -- "redis:6379" --> redis
    worker -- "postgres:5432" --> pg
    worker -- "redis:6379" --> redis
```

Only `api` publishes a port to the host; `postgres`, `redis` and `worker` are reachable only from inside `devnet`, by service name, through Compose's embedded DNS (the same `127.0.0.11` resolver as a user-defined network — see [[Docker 05 - Networking and Port Publishing]]).

**Startup ordering vs readiness.**

**Step by step:**
1. Compose starts the `postgres` container. The process inside needs, say, 5 seconds to set itself up.
2. With only `depends_on`, Compose starts `api` right away. The API tries to connect at second 1, fails, and crash-loops.
3. With a `healthcheck`, Compose runs `pg_isready` every 2 seconds. Seconds 0-4: "not ready".
4. At second 6 it says "ready". The service is marked healthy, and only now does Compose start `api`.
5. The API connects on its first try.

`depends_on: [postgres]` only guarantees Docker *starts* the `postgres` container before `api`'s container is created — the Postgres process inside might still be running its first-time initialization for several seconds.

`condition: service_healthy` makes Compose wait for the dependency's `healthcheck` to report `healthy` before starting the dependent:

```mermaid
sequenceDiagram
    participant C as docker compose up
    participant PG as postgres container
    participant HC as healthcheck
    participant API as api container

    C->>PG: create + start
    loop every interval until healthy or retries exhausted
        HC->>PG: pg_isready -U postgres
        PG-->>HC: not ready
    end
    HC->>PG: pg_isready -U postgres
    PG-->>HC: ready
    HC-->>C: status = healthy
    C->>API: create + start (condition met)
    API->>PG: connect (succeeds on the first try)
```

Without the healthcheck, `api` would start as soon as the Postgres *container* exists, connect before `pg_isready` would succeed, and crash-loop until Postgres happens to catch up — the old `docker comnpose` note's `depends_on` example had exactly this gap.

## 4. Worked example 🟡

### Whiteboard version

The smallest useful file: one service, one dependency, one healthcheck.

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      redis:
        condition: service_healthy
  redis:
    image: redis:7
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 2s
      timeout: 2s
      retries: 10
```

The full example below adds a database, a worker, a one-off migration job, and the `.env` file a real project needs.

### Full example: Go API + Postgres + Redis + worker

**In plain words:** a complete working file. Notice the healthchecks and depends_on: they make the API start only after the database answers.

`compose.yaml` (Compose v2, no `version:` key):

```yaml
services:
  api:
    build:
      context: .
      target: api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/app?sslmode=disable
      REDIS_URL: redis://redis:6379/0
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    develop:
      watch:
        - action: sync
          path: ./cmd/api
          target: /src/cmd/api

  worker:
    build:
      context: .
      target: worker
    environment:
      DATABASE_URL: postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/app?sslmode=disable
      REDIS_URL: redis://redis:6379/0
    depends_on:
      migrate:
        condition: service_completed_successfully

  migrate:
    build:
      context: .
      target: migrate
    environment:
      DATABASE_URL: postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/app?sslmode=disable
    depends_on:
      postgres:
        condition: service_healthy
    restart: "no"

  postgres:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      timeout: 2s
      retries: 15

  redis:
    image: redis:7
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 2s
      timeout: 2s
      retries: 10

volumes:
  pgdata:
```

`.env` (loaded automatically by Compose, never committed):

```text
POSTGRES_PASSWORD=dev-only-password
```

Points worth noticing:

- `migrate` has `restart: "no"` and exits after running the migrations; `worker` waits for `condition: service_completed_successfully`, not `service_healthy`, since a one-off job never becomes "healthy" — it just finishes.
- Only `api` has a `ports:` entry. `postgres` and `redis` have none: they are reachable from `api`/`worker`/`migrate` by service name, never from the host, matching the "don't publish Redis to the host" lesson from [[Docker 05 - Networking and Port Publishing]].
- `develop.watch` (Compose v2.22+) syncs `./cmd/api` into the running container on save, for a dev inner loop (the edit → run → check cycle you repeat all day) without a full rebuild — `docker compose watch` runs this instead of `up`.
- The root `.env` file only feeds `${VAR}` interpolation *inside* `compose.yaml` (file paths, image tags, the password above). A service that needs a whole list of variables injected as its own environment uses `env_file: - .env.api` instead of (or alongside) an inline `environment:` map — same effect as `environment:`, but the values live in a separate file instead of being typed into the service block.

**Readiness endpoint the healthcheck is really testing for.** `pg_isready` proves Postgres is accepting connections.

But the API itself should expose its own readiness once it has completed its own startup (DB ping, cache ping). Go 1.24:

**What this code does, in plain words:** the server keeps one true/false flag called `ready`. The `/healthz` page answers "503, not yet" until the flag is set, and "200, OK" afterwards. The test checks both answers. A health check pointed at `/healthz` therefore keeps dependent services waiting until the API has really finished starting.

```go
// Package main is a scratch program for the "Docker Compose for Local
// Development" note: a minimal readiness endpoint that Compose's
// healthcheck + depends_on: condition: service_healthy can poll.
package main

import (
	"net/http"
	"sync/atomic"
)

// Server tracks whether downstream dependencies (DB, cache) have been
// pinged successfully at least once.
type Server struct {
	ready atomic.Bool
}

func (s *Server) setReady(v bool) { s.ready.Store(v) }

// healthz answers 200 only once the service has confirmed its
// dependencies are reachable; otherwise 503, so Compose's healthcheck
// keeps failing and dependents keep waiting.
func (s *Server) healthz(w http.ResponseWriter, r *http.Request) {
	if !s.ready.Load() {
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func main() {
	s := &Server{}
	http.HandleFunc("/healthz", s.healthz)
	// In a real service, a background goroutine would call
	// s.setReady(true) after a successful DB ping and Redis PING.
	_ = http.ListenAndServe(":8080", nil)
}
```

Test (`go test -race`, Go 1.24):

```go
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthzReflectsReadiness(t *testing.T) {
	s := &Server{}
	ts := httptest.NewServer(http.HandlerFunc(s.healthz))
	defer ts.Close()

	resp, err := http.Get(ts.URL)
	if err != nil {
		t.Fatalf("GET /healthz: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("before ready: got %d, want 503", resp.StatusCode)
	}

	s.setReady(true)

	resp2, err := http.Get(ts.URL)
	if err != nil {
		t.Fatalf("GET /healthz: %v", err)
	}
	resp2.Body.Close()
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("after ready: got %d, want 200", resp2.StatusCode)
	}
}
```

Wiring `compose.yaml`'s `healthcheck` to this endpoint instead of `pg_isready`-style process checks (for the API service itself) would use `test: ["CMD", "wget", "-qO-", "http://localhost:8080/healthz"]`.

**Everyday commands:**

```bash
docker compose up -d              # build (if needed), create network/volumes, start all services
docker compose up -d --build      # force a rebuild first
docker compose watch              # dev loop: sync/rebuild on file change (develop.watch)
docker compose ps                 # project-scoped container list with health status
docker compose logs -f api        # follow one service's logs
docker compose exec api sh        # shell into a running service
docker compose run --rm migrate   # one-off run of a service, not part of `up`
docker compose down               # stop and remove containers + default network; volumes kept
docker compose down -v            # also delete named volumes (pgdata is gone)
```

## 5. Variants and comparison 🟡

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Docker Compose | One YAML file, one project network, `up`/`down` | Local dev, CI integration tests, small single-host deployments | Single host only; no rolling updates or self-healing |
| Plain `docker run` scripts | Shell script of individual `docker run` commands | A single throwaway container | No shared state (network, env) between services; easy to drift |
| Kubernetes | Declarative manifests, a control plane (the cluster's brain that stores and enforces what should run) reconciling desired vs actual state | Production, multi-host, needs scaling/self-healing | Operational complexity; overkill for a laptop |
| `kompose` | Converts a Compose file into Kubernetes manifests | A starting point migrating from Compose to k8s | Output manifests still need hardening (resources, probes, security context) |
| Nomad / Docker Swarm | Compose-like files, but with a scheduler across multiple hosts | Small team wanting multi-host without full Kubernetes | Smaller ecosystem than Kubernetes; Swarm is in Docker's low-maintenance mode |

## 6. Trade-offs and when not to use 🟡

- Compose has no scheduler: it does not reschedule a container onto another host if the host dies, because there is only one host.
- No rolling updates or canary support (sending a small share of traffic to a new version first) — `up -d` recreates whatever changed, with a brief gap.
- Secrets in `.env` are plaintext on disk; fine for local dev, never for a shared or production file (use [[Secrets Management]] patterns there instead).
- For a single, stateless container with no dependencies, a bare `docker run` is simpler and Compose adds nothing.
- Don't reach for Kubernetes just to get Compose's conveniences locally — `docker compose watch` plus bind mounts is usually a faster inner loop than a local k8s cluster.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** what the Compose file contains, how services find each other by name, how health checks gate start-up, and a full Go + Postgres + Redis stack. **Next is the advanced part**: how teams and CI use Compose for real, the failures they hit, and the deeper features (project names, override files, profiles) plus why Compose stops short of production orchestration.


- **Real systems:** Compose is the de facto standard for local dev stacks (most Go/Node/Rails starter templates ship a `compose.yaml`); some small teams and side projects run it directly on a single production VM with `restart: unless-stopped`; CI systems (GitHub Actions, GitLab CI) use `docker compose up -d` to spin up integration-test dependencies (a real Postgres, a real Redis) instead of mocking them (faking them in code).
- **Failure modes → fixes:**
  - API crash-loops on startup because it connected to Postgres before it was ready → add a `healthcheck` and `condition: service_healthy`, not just `depends_on`.
  - `docker compose down -v` run by habit wipes the dev database → treat `-v` as a deliberate, separate command, never alias it into `down`.
  - Port conflict with another project on the same host (`3000` already bound) → set `ports: - "${API_PORT:-3000}:3000"` so `.env` can override it per clone.
  - Stale image after a dependency bump → `docker compose up -d --build` (or `pull` for prebuilt images) instead of assuming `up` always rebuilds.
- **What to monitor (locally and in CI):** `docker compose ps` health column going `unhealthy`; `docker compose logs --since` around a failing test; disk used by named volumes (`docker system df -v`) on long-lived dev machines.

## 8. Deep dive 🔴

- **Project identity.** The project name (folder name, `name:` key, or `-p`) scopes every resource Compose creates — containers, networks, volumes — so two checkouts of the same repo in different folders never collide, and `docker compose down` only ever touches its own project's resources.
- **Override files.** Compose merges `compose.yaml` with `compose.override.yaml` automatically, and `-f base.yaml -f prod.yaml` explicitly for other combinations — the common pattern is a base file plus a local override that adds bind mounts and debug ports without touching the committed file.
- **Profiles.** `profiles: ["debug"]` on a service (for example, a pgAdmin or Redis Commander UI, web pages for browsing a database or cache) keeps it out of a plain `docker compose up` and only starts it with `docker compose --profile debug up`.
- **`service_completed_successfully`.** Introduced for exactly the migration-job pattern above: a dependency that is expected to exit 0 and never run again, as opposed to a long-running service whose `healthy` state means "still fine".
- **Compose is not a production orchestrator**, but it is a correct map of the production topology at a smaller scale — the same service boundaries, environment variables and health checks typically carry over into the Kubernetes manifests in [[Kubernetes Fundamentals]], which is one reason to get the Compose file right first.

## 9. Interview questions 🔴

> [!question]- Why doesn't `depends_on` alone stop the API from connecting to Postgres too early?
> `depends_on` only orders container creation and start, not application readiness inside the container. Postgres's container can be "started" while the database is still initializing. Add a `healthcheck` to the dependency and `depends_on: <service>: condition: service_healthy` on the dependent so Compose actually waits for readiness.

> [!question]- What's the difference between `service_healthy` and `service_completed_successfully`?
> `service_healthy` waits for a long-running service's `healthcheck` to pass and keeps watching it. `service_completed_successfully` is for a one-shot job (a migration) that is expected to exit 0 once; the dependent starts after that exit code, not after some ongoing health state.

> [!question]- Why should only the API service publish a port?
> Postgres and Redis only need to be reachable from other containers on the project network, through Compose's embedded DNS by service name. Publishing their ports to the host needlessly exposes a database or cache with weak/no auth to anything else on that machine or network.

> [!question]- What does `docker compose down -v` do that `docker compose down` doesn't, and why is that dangerous?
> `down` stops and removes the project's containers and its default network, but keeps named volumes. `-v` additionally deletes named volumes, including a database's data directory — fine for a disposable test stack, destructive if `pgdata` holds dev data nobody backed up.

> [!question]- Is Compose a production-grade orchestrator?
> No. It manages containers on one host with no scheduler, no multi-host failover, and no rolling updates. It's the right tool for local dev, CI integration tests, and small single-host deployments; production multi-host workloads move to Kubernetes or a similar orchestrator.

> [!question]- How would you give two developers isolated copies of the same stack on one laptop?
> Run each from a different project name (`docker compose -p alice up`, `docker compose -p bob up`) or a different project folder, and parameterize the published host port through `.env` so the two projects' `ports:` don't collide.

## 10. Cheat sheet 🟢

- Compose v2 = `docker compose`, no `version:` key; one file, one project network, service-name DNS.
- `depends_on` orders start; `healthcheck` + `condition: service_healthy` orders readiness.
- `service_completed_successfully` is for one-off jobs (migrations), not long-running services.
- Only publish host ports (`ports:`) for the service other machines/tools must reach; internal services talk over the project network.
- `down` keeps named volumes; `down -v` deletes them — never alias the two.
- `.env` feeds `${VAR}` interpolation and is never committed with real secrets.
- `docker compose watch` is the fast dev inner loop; profiles gate optional services (debug UIs) out of a plain `up`.
- Compose is single-host only: it has no scheduler, no rolling updates, no multi-host failover.

## Self-check 🟢🟡

🟢 Easy

> [!question]- What does `docker compose up -d` do?
> Creates the project network and volumes, builds or pulls images, and starts every service in the file in the background.

> [!question]- How does the API reach Postgres inside a Compose project?
> By the service name, for example `postgres:5432`, through Compose's built-in DNS.

> [!question]- Does `docker compose down` delete the database volume?
> No. Only `docker compose down -v` deletes named volumes.

🟡 Medium

> [!question]- Your API crashes on start with "connection refused" to Postgres, even with `depends_on`. Why, and what is the fix?
> `depends_on` waits only for the container to start; add a Postgres `healthcheck` and `condition: service_healthy`.

> [!question]- Why does the worker use `service_completed_successfully` for `migrate` instead of `service_healthy`?
> The migration job runs once and exits; it never becomes "healthy", it just finishes with code 0.

> [!question]- Why is Compose not enough for production on many machines?
> It runs on one host only, with no scheduler, no failover to another machine and no rolling updates.

## Links

- **Before this:** [[Docker 05 - Networking and Port Publishing]], [[Docker 06 - Volumes and Bind Mounts]]
- **Next:** [[Docker 08 - How Docker Works Under the Hood]], [[Kubernetes Fundamentals]]
- **Compare with:** [[Docker 04 - Writing a Production Dockerfile for Go]] (the image Compose builds from), [[CI-CD Pipelines (GitHub Actions for Go)]] (Compose used to stand up integration-test dependencies)

### Watch on YouTube

- [How To Use Docker To Make Local Development A Breeze](https://www.youtube.com/watch?v=zkMRWDQV4Tg) · ArjanCodes · 21 min · 376,345 views
- [Docker Up and Running 13: Docker Compose for Local Development](https://www.youtube.com/watch?v=4mCye01GE54) · Syndri Training · 5 min · 588 views
