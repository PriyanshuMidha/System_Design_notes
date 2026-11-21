---
tags: [devops, docker, containers]
level: basic
status: reviewed
prereqs: ["[[Processes, Threads and Context Switching]]"]
related: ["[[Docker 02 - Images, Layers and Containers]]", "[[Docker 08 - How Docker Works Under the Hood]]", "[[Cloud Native and the 12-Factor App]]", "[[Containerizing Go Services]]"]
sources:
  - "Docker docs, What is a Container? (docs.docker.com/guides/docker-overview)"
  - "Open Container Initiative, Image Format and Runtime Specifications (opencontainers.org)"
updated: 2026-11-13
---

# Docker 01 - Why Containers

> [!summary] TL;DR
> A container packages an application with everything it needs to run — code, runtime, libraries, config — as one immutable artifact, and runs it as an isolated process that shares the host's kernel. That one artifact behaves the same on a laptop, in CI, and in production, which is the problem containers exist to solve.

> [!abstract] Core idea
> - "Works on my machine" happens because the machine, not the artifact, carries the runtime and its exact dependency versions.
> - A container is an isolated **process**: it gets its own filesystem, process tree, network, and environment, but still runs on the host's shared kernel.
> - A container is not a VM. It skips the hypervisor and the guest OS, so it starts in milliseconds and costs megabytes, not a full OS's time and footprint.
> - The artifact is immutable and content-addressed: you build an image once, and promote the exact same bytes through dev, CI, and production.
> - Isolation does not fix everything: it does not remove config drift between environments, kernel-feature differences, or the need to manage state.

### Whiteboard version

A team ships a Go service. In 2024 it was built and tested against Go 1.21 and a specific version of a C library used by a CGO dependency (a Go library that calls C code, so it needs that C library on the machine). By 2026, a new engineer's laptop has Go 1.24 and a newer system library.

The code that compiled and passed tests in 2024 now fails to build, or builds but behaves differently at runtime, because the **environment**, not the code, changed underneath it.

A container fixes this by shipping the Go 1.21 toolchain's *output* (a compiled binary) together with the exact base OS layer and libraries it was built and tested against, as one artifact. Nothing about the new engineer's laptop — its Go version, its library versions, its OS — can leak into how that artifact runs.

## Start here: the basics 🟢

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read "From zero" below, then sections 1, 2 and 10 (why, mental model and the cheat sheet). Stop there, that is a full first pass.
> - 🟡 **Know the basics?** Add sections 3, 4, 5 and 6 (how it works, a worked example, options and trade-offs).
> - 🔴 **Interview / SDE-3 prep?** Add sections 7, 8 and 9 (production, deep dive and interview questions). Headings are tagged 🟢🟡🔴 so you always know where you are.

> [!note] Before this note
> - [[Processes, Threads and Context Switching]]: a process is one running program; the operating system gives it an ID number (PID) and its own memory. A container turns out to be just a process with blinkers on.

**From zero, in 60 seconds** 🟢

"It works on my machine" is the oldest problem in software. Your laptop and the server have different versions of things.
A **container** packs your app together with everything it needs: code, libraries, settings.
That pack is called an **image**. The same image runs the same way on your laptop, in testing, and in production.

```mermaid
flowchart LR
    L["Laptop"] --> I["One image"]
    I --> T["Test server"]
    I --> P["Production"]
```

A container is not a full virtual computer. It is a normal program that is walled off so it only sees its own files.
That is why containers start in under a second and you can run dozens on one machine.

```mermaid
flowchart LR
    VM["VM: own full OS,<br/>slow to start"] --- CT["Container: shares the host's OS core,<br/>starts in ~1 s"]
```

The rest of this note is just these 3 questions:
1. What problem did containers solve?
2. How is a container different from a virtual machine?
3. How does one image give the same result everywhere?


**The problem in one story.**
Your Go service runs fine on your laptop.
On the server it crashes: a different OS version, a missing certificate file, a wrong timezone setting.
A teammate's laptop fails in a third way.
Containers ship the app *and* its surroundings together, so "works on my machine" means works everywhere.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Dependency | Something your app needs to run | CA certificates, `libc`, a config file |
| Operating system (OS) | Software that manages the machine | Linux, macOS |
| Kernel | The core of the OS that talks to hardware | The Linux kernel shared by all containers on a host |
| Process | One running program | Your `./server` binary while it runs |
| Virtual machine (VM) | A full fake computer with its own OS | An EC2 instance |
| Image | A frozen package of app + files | `myapi:1.4.0` |
| Container | A running, isolated process started from an image | `docker run myapi:1.4.0` |
| Namespace | A Linux feature that limits what a process can *see* (its own files, its own process list, its own network) | Inside, your app thinks it is PID 1 |
| cgroup (control group) | A Linux feature that limits what a process can *use* (CPU, memory) | "This container gets at most 512 MiB" |
| Hypervisor | Software that splits one physical machine into several VMs | AWS Nitro, VMware |
| Registry | An online store for images that you push to and pull from | Docker Hub, AWS ECR |
| Digest | A fingerprint (hash) of an image's exact bytes; same digest = same image | `sha256:3f2a9c…` |
| Dockerfile | A text recipe of steps that builds an image | `FROM golang:1.24` … |

**Picture it**

```mermaid
flowchart TB
    subgraph Host["One Linux host (one kernel)"]
        C1["Container A:<br/>Go API + its files"]
        C2["Container B:<br/>Postgres + its files"]
        C3["Container C:<br/>Redis + its files"]
    end
```

**Analogy.** Shipping containers: the crane does not care whether the box holds shoes or TVs, because every box has the same shape.
Where it breaks: real shipping boxes are fully sealed; software containers share the host's kernel, so isolation is weaker than a VM.

**How the rest of this note builds up**

- First, why containers exist and the "isolated process, not a mini-VM" mental model (sections 1-2).
- Then how isolation works (namespaces, cgroups, images) in section 3, and a worked example in section 4.
- Then containers vs VMs vs bare binaries, and when not to use them (sections 5-6).
- Finally the SDE-3 view: production concerns and the deep dive (sections 7-8).

> [!tip] Remember
> A container is just a normal Linux process with a fenced-off view of the machine and its own packaged files.

## 1. Why it exists 🟢

Before containers, deploying meant replicating a server's exact state by hand or with a configuration-management tool (a script runner like Ansible or Chef that installs the same things on many servers): install this OS package at this version, this language runtime, this library, set these environment variables, open these ports. Four places had to agree: a developer's laptop, a teammate's laptop, the CI runner (the machine that builds and tests code on every push), and production. They rarely did.

Concretely: an API depends on `libssl` 1.1 and Node.js 18. A teammate's laptop has `libssl` 3.0 and Node.js 20 because they set it up a year later.

The code runs locally for them with subtly different TLS defaults (the rules for encrypted connections) and V8 behavior (V8 is the JavaScript engine inside Node.js), passes their tests, and then fails a cipher-negotiation test (a check of which encryption method both sides agree on) in CI, which still has the older versions. Nobody changed the code; the environment changed under it.

Multiply this by every dependency and every machine, and "works on my machine" becomes the default failure mode of the team, not an edge case.

Containers close the gap by making the environment part of the shipped artifact instead of part of the target machine.

```mermaid
flowchart LR
    Code["Same code"] --> A["Laptop A:<br/>libssl 1.1, Node 18"]
    Code --> B["Laptop B:<br/>libssl 3.0, Node 20"]
    A --> OK["tests pass"]
    B --> Fail["CI fails"]
    Img["Container image:<br/>code + its own libssl + Node"] --> Same["same result everywhere"]
```

### Real-life example: a new joiner's first day 🟢

Imagine joining the backend team at a company like Swiggy.
Without containers, day one is spent installing the right Postgres, Redis and Go versions, and something is always slightly off.
With containers, you run one command and get the exact Postgres, Redis and API images the rest of the team uses.
The image that the build system tested is the same one that later runs in production.
So "it worked on my laptop" finally means something.

## 2. Mental model 🟢

A container is **a normal operating-system process that cannot see most of the machine it is running on.**

The host kernel is the only thing actually running the code — there is no second kernel, no virtual CPU. Four Linux kernel mechanisms do the hiding:

- **PID namespace** — the process sees itself as PID 1 (process number 1, normally the first program a machine starts) and cannot see the host's other processes.
- **Mount namespace** — the process sees its own root filesystem (the image's files), not the host's.
- **Network namespace** — the process gets its own loopback (its own private `localhost`) and network interfaces.
- **cgroups** — the kernel caps how much CPU, memory, and I/O the process (and its children) may use, and can kill it if it goes over a memory limit.

Analogy: a container is like a hotel room, not a separate building.

Every room (container) shares the same building's foundation, plumbing, and electrical grid (the host kernel), but each guest sees only their own room's door, furniture, and thermostat (namespaces), and the hotel caps how much power and water each room can draw (cgroups).

A VM, by contrast, is a separate building with its own foundation, plumbing, and electrical grid — a full guest OS and kernel — which is why it costs far more to stand up and run.

## Common beginner mistakes 🟢

- **Calling a container a "small VM"** → it has no kernel of its own; it is one process on the host's kernel → think "fenced-off process", which also explains why it starts in under a second.
- **Using a floating tag like `node:20`** → that tag can point to a different image next week, so builds drift again → pin the version, ideally by digest.
- **Storing important data inside the container** → its files vanish when the container is removed → put data in a volume or an outside database.
- **Assuming containers fix every environment difference** → settings and outside services can still differ between staging and prod → keep config in environment variables and check them per environment.
- **Running as root inside the container "because it's isolated"** → the isolation is thinner than a VM's → run as a normal user (see Docker 09).

## 3. How it works 🟡

> 🟢 → 🟡 **You now know** that a container is a normal process that cannot see most of the machine, and that the image carries the app's whole environment. **Next we open the box**: how this stack differs from a VM's stack, and how one image travels unchanged from your laptop to production.

**In plain words:** you write a recipe (Dockerfile), build it into an image, push it to a shared store (registry), and anyone can pull and run the exact same thing.

**Step by step (VM vs container):**
1. A VM host runs a hypervisor. Each VM on top boots its own full OS and kernel, which takes tens of seconds and gigabytes.
2. A container host runs one OS with one kernel. There is no second OS to boot.
3. Starting a container just asks that kernel for a new process, with namespaces (what it can see) and cgroups (what it can use) switched on.
4. So App A and App B start almost instantly, sharing the one kernel but not each other's files.

```mermaid
flowchart TB
    subgraph VM["Virtual machine stack"]
        direction TB
        HW1[Physical server] --> HV[Hypervisor]
        HV --> GOS1[Guest OS 1<br/>own kernel] --> APP1[App A]
        HV --> GOS2[Guest OS 2<br/>own kernel] --> APP2[App B]
    end
    subgraph CT["Container stack"]
        direction TB
        HW2[Physical server] --> HOSTOS[Host OS + one shared kernel]
        HOSTOS --> ENG[Container engine<br/>namespaces + cgroups]
        ENG --> C1[Container A<br/>isolated process] --> APP3[App A]
        ENG --> C2[Container B<br/>isolated process] --> APP4[App B]
    end
```

Each guest OS in the VM stack boots its own kernel, drivers, and init system (the first program that starts all the others) before the app ever starts — that is where the extra minutes and gigabytes go. In the container stack, `App A` and `App B` start as soon as the single shared kernel hands them a process id; there is no second boot.

The second mechanism is **build once, run anywhere the same way**:

**Step by step:**
1. `docker build` turns your source code and Dockerfile into an image, fingerprinted as `sha256:3f2a9c…`.
2. `docker push` uploads it to a registry such as ECR.
3. Your laptop, the CI runner and production all `pull` that same fingerprint.
4. Same fingerprint means same bytes, so nothing can quietly change between test and production.

```mermaid
flowchart LR
    SRC[Source + Dockerfile] -->|docker build| IMG["Image<br/>sha256:3f2a9c…"]
    IMG -->|push| REG[(Registry)]
    REG -->|pull, same digest| DEV[Developer laptop]
    REG -->|pull, same digest| CI[CI runner]
    REG -->|pull, same digest| PROD[Production]
```

The image is identified by a content hash (its digest), not just a name. Pulling that digest in CI and in production fetches byte-identical layers — there is no "rebuild for production" step where a version could silently drift, because the thing that runs in production is the thing that was already built and tested.

## 4. Worked example 🟡

**In plain words:** two people, two machines, one image: they get the same app because the image carries everything with it.

Two developers, Priya and Sam, both run the same image, `myapi:3f2a9c` (a digest-pinned tag), on different host operating systems:

| Host | What the kernel sees | What the container sees |
| --- | --- | --- |
| Priya's Linux laptop | A process in its own PID/mount/net namespaces, cgroup-limited to 512 MiB and 1 CPU | Its own root filesystem from the image, PID 1, `localhost` |
| Sam's Mac (Docker Desktop, the Mac/Windows app that runs Docker) | Docker Desktop runs one lightweight Linux VM; inside that VM, the same namespaced process | Identical: same root filesystem, same PID 1, same `localhost` |
| A production EC2 host | Same namespaced process, same cgroup limits, same image digest | Identical to both of the above |

This is the concrete payoff: the thing both developers and production run is bit-for-bit the same artifact, so a bug that shows up in production can be reproduced locally by pulling that exact digest — not by trying to remember what versions production happened to have.

**Representative startup comparison** (estimate, consistent with Docker's own published container-vs-VM guidance; exact numbers depend on image and host):

| | Typical cold start | Typical disk footprint |
| --- | --- | --- |
| VM (full guest OS) | 10s of seconds to minutes | Gigabytes |
| Container | Tens to hundreds of milliseconds | Megabytes to low hundreds of MB |

Label: **estimate** — these vary enormously by image size and VM image, but the order-of-magnitude gap (seconds-to-minutes vs. milliseconds, gigabytes vs. megabytes) is the documented reason containers replaced VMs for per-service isolation.

## 5. Variants and comparison 🟡

| Approach | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Containers | Shared host kernel, isolated via namespaces + cgroups | Packaging and deploying one service per isolated unit, dev/CI/prod parity | Weaker isolation boundary than a VM; shares the kernel |
| Virtual machines | Hypervisor virtualizes hardware; each VM boots its own kernel | Running different OS kernels on one host, or where kernel-level isolation is a hard security requirement | Minutes to boot, gigabytes of overhead per instance |
| Bare metal / direct install | App runs directly on the host OS, no isolation layer | Maximum performance, single-tenant hardware you fully control | No portability, no isolation between apps on the same host |
| WebAssembly (Wasm) sandboxes | App compiled to Wasm, run in a Wasm runtime's sandbox | Very fast cold starts for simple, language-agnostic, CPU-bound functions | Smaller ecosystem, limited syscall (requests a program makes to the kernel, like "open this file")/network access without extra runtimes |

## 6. Trade-offs and when not to use 🟡

- Containers share the host kernel, so a kernel exploit can, in principle, cross container boundaries — a VM's hardware-enforced isolation is stronger. Multi-tenant, hostile-workload platforms often still put a VM (or a sandboxed runtime like gVisor/Kata, which add an extra wall between the container and the real kernel) around groups of containers.
- A container needs a Linux-kernel-compatible host. Running Linux containers on macOS or Windows works only because Docker Desktop first starts a small Linux VM for you — see the deep dive.
- Containers do not fix configuration drift between environments: an environment variable or a feature flag that differs between staging and production still differs, container or not.
- Containers do not remove the need to manage state. A container's own filesystem is ephemeral; databases and files that must survive a restart still need volumes or external storage (see [[Docker 06 - Volumes and Bind Mounts]]).
- For a single, trusted, long-lived service with no need for portability or per-service isolation, a container adds an extra build and runtime layer for little benefit — a systemd-managed process (a program started and restarted by Linux's built-in service manager) can be simpler.

## 7. In production 🔴

> 🟡 → 🔴 **You now know** how containers differ from VMs, how one image moves unchanged through every environment, and when containers are the wrong tool. **Next is the advanced part**: how real platforms use containers, the failures teams actually hit, and what really happens on a Mac when you type `docker run`.


- **Real systems:** every major cloud platform (AWS ECS/EKS/Fargate, Google Cloud Run/GKE, Azure Container Apps/AKS) runs workloads as containers; CI systems (GitHub Actions, GitLab CI) run each job inside a container for a clean, reproducible environment.
- **Failure modes → fixes:**
  - "Works on my machine, fails in CI" despite using containers → the Dockerfile itself is not pinned (a floating base tag like `node:20` resolved to a different patch version on different days); pin by digest.
  - Container runs locally but not on a teammate's Mac/Windows laptop → usually a resource limit in Docker Desktop's VM (memory, disk) or a platform mismatch (an `arm64`-only image, built for Apple-silicon-style chips, on an `amd64` Intel/AMD host or vice versa); see [[Docker 02 - Images, Layers and Containers]] on multi-arch images.
  - "It worked before I added volumes" → state leaking across container restarts in ways the image didn't account for; isolate what must persist.
- **What to monitor:** image digest actually deployed (not just the tag), container restart count, OOM-kill count (OOM = out of memory: the kernel kills a container that goes over its memory limit) from cgroup limits, and build time as a proxy for how bloated the image has become.

## 8. Deep dive 🔴

**Why Docker Desktop needs a VM on macOS and Windows.** Linux containers rely on Linux-specific kernel namespaces and cgroups; macOS's XNU kernel and Windows's NT kernel don't have them. Docker Desktop starts one small Linux VM (historically via HyperKit/Virtualization.framework on macOS, WSL2 on Windows) and runs the actual containers as Linux processes inside that single VM. From the outside this looks like "Docker just works" on a Mac, but there is in fact one VM boot happening — it's just shared across every container you start, not one VM per container, which is why it is still far cheaper than running separate VMs per service.

**The ecosystem map.** "Docker" names several distinct pieces that container terminology often blurs together:
- **Docker Engine** — the daemon (`dockerd`, a background program that does the real work) and CLI that build images and run containers on one host.
- **OCI (Open Container Initiative)** — the vendor-neutral specifications for what an image and a runtime must look like, so images built by Docker run under `containerd`, `podman`, or a Kubernetes node's runtime without changes.
- **Registries** — where built images are stored and pulled from (Docker Hub, AWS ECR, GitHub Container Registry).
- **Compose** — a tool to describe and run several related containers together on one host (see [[Docker 07 - Docker Compose for Local Development]]).
- **Kubernetes** — an orchestrator that runs containers across a *fleet* of hosts, handling scheduling, scaling, and failover (see [[Kubernetes Fundamentals]]).

A single-host `docker run` and a Kubernetes-scheduled pod both end up starting the same kind of OCI-compliant isolated process; Kubernetes just decides *which* host and *how many* replicas.

## 9. Interview questions 🔴

> [!question]- Is a container a lightweight virtual machine?
> No. A VM virtualizes hardware and boots its own kernel; a container is an isolated process that uses the host's single kernel. That's why containers start in milliseconds and cost megabytes, while VMs take tens of seconds or more and cost gigabytes.

> [!question]- What two Linux kernel mechanisms actually provide container isolation?
> Namespaces (PID, mount, network, UTS, IPC, user, cgroup namespaces) hide most of the system from the process; cgroups cap and account for the CPU, memory, and I/O it's allowed to use. Docker is the tooling layer on top of both.

> [!question]- If containers share the host kernel, what security boundary do they actually provide?
> A weaker one than a VM: a kernel bug can, in principle, be exploited from inside a container to affect the host or other containers. Harden with a minimal base image, a non-root user, and dropped capabilities (see [[Docker 09 - Container Security and Hardening]]), and consider a VM-backed sandbox (gVisor, Kata Containers) for untrusted workloads.

> [!question]- Why does "build once, deploy the same image everywhere" matter more than "containers are fast"?
> Speed is a side effect of a shared kernel. The real reliability win is that the artifact that passed tests in CI is, byte for byte, the same artifact that runs in production — there is no separate "production build" step where a dependency version could silently differ.

> [!question]- Trap: "We containerized our app, so it will work the same everywhere now." What's missing from that claim?
> Containers fix *runtime and dependency* drift, not everything. Environment variables, feature flags, external service versions, and any state outside the container (databases, mounted volumes) can still differ between environments and still cause environment-specific bugs.

> [!question]- Why do we still need Kubernetes if containers already give us portability?
> A single host running `docker run` has no answer for "that host just died" or "we need 50 replicas across 10 machines." Kubernetes schedules containers across a fleet, restarts failed ones, and load-balances traffic to them — portability at the single-container level doesn't give you fleet-level scheduling or failover.

## 10. Cheat sheet 🟢

- A container is an isolated **process**, not a mini VM: it shares the host's one kernel via namespaces and cgroups.
- VMs virtualize hardware and boot a guest kernel each; containers don't, which is the whole speed/size difference.
- The artifact is immutable and digest-addressed: build once, promote the same digest through every environment.
- Docker Desktop on macOS/Windows runs one shared Linux VM under the hood so Linux containers can exist at all.
- Containers do not fix config drift, kernel-feature differences, or statefulness — those need their own solutions.
- "Docker" = Engine (daemon/CLI) + OCI spec (portability) + registries (distribution) + Compose/Kubernetes (orchestration).

## Self-check 🟢🟡

🟢 Easy

> [!question]- What does a container package together?
> The app plus everything it needs to run: code, libraries, files and settings.

> [!question]- Does a container have its own kernel?
> No. It shares the host's one kernel; only a VM has its own.

> [!question]- What is the difference between an image and a container?
> The image is the frozen package; a container is a running process started from it.

🟡 Medium

> [!question]- Which Linux feature stops a container from seeing other processes, and which one stops it using all the memory?
> Namespaces hide things (the PID namespace hides other processes); cgroups limit resources like memory.

> [!question]- Why pull an image by digest instead of a tag like `myapi:latest`?
> A tag can be moved to a different image; a digest always means the exact same bytes.

> [!question]- How do Linux containers run on a Mac at all?
> Docker Desktop starts one small Linux VM, and every container runs as a process inside it.

## Links

- **Before this:** [[Processes, Threads and Context Switching]]
- **Next:** [[Docker 02 - Images, Layers and Containers]], [[Docker 03 - CLI Essentials]]
- **Compare with:** [[Cloud Native and the 12-Factor App]], [[Containerizing Go Services]] (Go-specific packaging), [[Docker 08 - How Docker Works Under the Hood]] (the namespaces/cgroups internals in depth)

### Watch on YouTube

- [Docker Tutorial 1- Why and What is Docker, Dockers Containers, Virtualization In Machine Learning](https://www.youtube.com/watch?v=hTacGMfL8lc) · Krish Naik · 18 min · 144,448 views
- [What is Docker? / Containerization Explained! / Why use Docker Container? (In Hindi)](https://www.youtube.com/watch?v=qN1CzLdCq5g) · CodeWithHarry · 8 min · 482,135 views
