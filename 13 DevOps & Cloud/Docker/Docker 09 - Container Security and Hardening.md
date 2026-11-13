---
tags: [devops, docker, security]
level: advanced
prereqs: ["[[Docker 08 - How Docker Works Under the Hood]]", "[[Docker 04 - Writing a Production Dockerfile for Go]]"]
related: ["[[Secrets Management]]", "[[Kubernetes Fundamentals]]", "[[Authentication vs Authorization]]"]
sources:
  - "Docker security documentation, docs.docker.com"
  - "OWASP Docker Security Cheat Sheet, cheatsheetseries.owasp.org"
  - "Trivy documentation, aquasecurity.github.io/trivy"
  - "Sigstore / cosign documentation, docs.sigstore.dev"
  - "NIST SP 800-190, Application Container Security Guide"
status: reviewed
updated: 2026-11-13
---

# Docker 09 - Container Security and Hardening

> [!summary] TL;DR
> A container shares its kernel with the host, so its security boundary is only as strong as the Linux permissions you actually take away from it: run as a non-root user, drop capabilities, make the root filesystem read-only, scan and sign the image, and never bake a secret into a layer. None of this is automatic — Docker's defaults are permissive.

> [!abstract] Core idea
> - Shrink what the process can do: non-root `USER`, `--cap-drop ALL`, `no-new-privileges`, a read-only root filesystem, seccomp.
> - Shrink what the image contains: a minimal base (distroless/scratch), pinned by digest, scanned for CVEs, with no secrets in any layer.
> - Prove what you're running: sign images (cosign) and enforce that signature at admission, not just at build time.
> - Classic mistake: believing a non-root `USER` alone makes a container safe. Mounting `/var/run/docker.sock` into *any* container — root or not — hands it root on the host, because the Docker socket itself is an unauthenticated root API.

## Start here: the basics

**The problem in one story**

An attacker finds a bug in one library your Go API uses and gets code running inside its container.
What happens next depends on what that container was allowed to do.
If it runs as root with every permission and a writable disk, the attacker can dig in and maybe reach the host.
If it runs as a limited user with nothing extra, the attacker is stuck in a small, locked room.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| root | The all-powerful admin user on Linux, UID 0 | `USER root` |
| Linux capability | One slice of root's power that can be granted alone | `NET_BIND_SERVICE` to bind port 80 |
| Syscall | A request a program makes to the kernel | `open`, `mount`, `ptrace` |
| CVE | A public ID for a known security bug | `CVE-2024-xxxx` in a base-image package |
| Image digest | A hash that names exact image content forever | `@sha256:3f1a...` |
| Tag | A movable label pointing at some image | `golang:1.24`, `:latest` |
| Secret | A password, token or key the app needs | `DB_PASSWORD` |
| Docker socket | The file the Docker daemon's root API listens on | `/var/run/docker.sock` |

**Picture it**

```mermaid
flowchart LR
    Build["Build image<br/>minimal base, no secrets"] --> Scan["Scan for CVEs"]
    Scan --> Sign["Sign digest"]
    Sign --> Admit{"Admission check"}
    Admit --> Run["Run locked down<br/>non-root, no caps, read-only"]
```

**Analogy**

Hardening is like giving a contractor a keycard that opens only the one room they work in, instead of a master key.
Where it breaks: a keycard cannot fix a weak wall; if the shared kernel has a bug, least privilege only reduces the damage, it does not remove the hole.

**How the rest of this note builds up**

- First, why Docker's defaults are permissive and the "assume it gets compromised" mental model.
- Then the supply chain: minimal bases, digest pinning, scanning, SBOMs and signing.
- Then runtime hardening: non-root, capabilities, `no-new-privileges`, read-only rootfs, seccomp, AppArmor and the Docker socket, with a Go Dockerfile checker.
- Finally the SDE-3 deep dive: escape chains, rootless internals, keyless signing and admission policy.

> [!tip] Remember
> Assume the process will be compromised, and take away every permission it never needed.

## 1. Why it exists

Because a container is a process restricted by namespaces and cgroups on a kernel it shares with the host (see [[Docker 08 - How Docker Works Under the Hood]]), the isolation is real but it is not a security perimeter by default.

Docker's own defaults favor convenience: a container runs as root inside unless told otherwise, with a writable root filesystem, every Linux capability Docker grants by default (around 14, including `NET_RAW` and `SYS_CHROOT`), and no seccomp restriction beyond Docker's default profile.

Each of those defaults is a door left open:

- root inside a container that also holds a kernel exploit or a mounted host path is root with a path outward;
- a writable filesystem means malware dropped at runtime persists across a restart of that same container;
- an unpinned `:latest` tag means the image you tested is not provably the image that shipped.

## 2. Mental model

Treat a container like a process you don't fully trust, because its code came from a dependency tree you don't fully audit — then ask what that process should be *allowed* to do if it were compromised.

A compromised process with no root, no capabilities, a read-only filesystem, and a seccomp filter blocking `mount`/`ptrace`/`kexec_load` can still run your application logic. But it can't install a rootkit, escalate privileges, or pivot to the host — because the permissions to do those things were never granted, not because an antivirus caught it afterward.

Hardening is removing permissions the application never needed in the first place.

## 3. How it works

### The secure supply chain, end to end

```mermaid
flowchart LR
    SRC["source + Dockerfile"] --> BUILD["BuildKit build<br/>secrets via --mount=type=secret<br/>(never ENV/ARG)"]
    BUILD --> SBOM["SBOM (syft)"]
    BUILD --> SCAN["vulnerability scan<br/>(Trivy / Grype / ECR scan)"]
    SBOM --> SIGN["sign the digest<br/>(cosign)"]
    SCAN -->|pass| SIGN
    SCAN -->|fail: block| STOP["build fails"]
    SIGN --> REG["registry<br/>(image pinned by @sha256 digest)"]
    REG --> ADMIT{"admission check:<br/>signature verified? scan attached?"}
    ADMIT -->|no| DENY["deployment rejected"]
    ADMIT -->|yes| RUN["run: non-root USER, --cap-drop ALL,<br/>read-only rootfs, seccomp, pids/memory limits"]
```

Each stage removes one way an attacker could win:

1. Scanning catches known CVEs before deploy.
2. Signing proves the image in the registry is the exact one the pipeline built, not something swapped in afterward.
3. Admission control makes the signature and scan mandatory rather than advisory.
4. The runtime flags shrink what a still-successful compromise can do next.

### Hardening the image itself

- **Minimal base images.** `distroless` (no shell, no package manager) and `scratch` (nothing but your static binary) remove the tools an attacker would use after landing a shell — there's no `sh`, `curl`, or `apt` to pivot with. Alpine is smaller than Debian/Ubuntu but still a full Linux userland with a shell and `apk`; it trades some attack surface for debuggability.
- **Pin by digest, not by tag.** `FROM golang:1.24` can silently point at a different image tomorrow if the tag is retagged upstream; `FROM golang:1.24@sha256:<64 hex chars>` is the exact, immutable content you tested. Tags are mutable pointers; digests are content addresses.
- **Scanning and SBOMs.** Trivy and Grype scan an image's installed packages against CVE databases and report known vulnerabilities by severity; `syft` generates a Software Bill of Materials — the full list of packages and versions in the image — which is what a scanner consumes and what an incident response team needs when a new CVE drops for a package they may or may not be running.

### Hardening the runtime

```mermaid
flowchart TB
    subgraph before["Default container"]
        B1["root (UID 0)"]
        B2["writable rootfs"]
        B3["~14 default capabilities"]
        B4["Docker's default seccomp profile"]
    end
    subgraph after["Hardened container"]
        A1["USER 65532 (non-root, numeric)"]
        A2["--read-only rootfs + tmpfs for /tmp"]
        A3["--cap-drop ALL, add back only what's needed"]
        A4["--security-opt no-new-privileges"]
        A5["custom/strict seccomp profile"]
    end
    before -. hardening .-> after
```

- **Non-root `USER`.** `USER 65532` (the conventional "nonroot" UID used by distroless images) means a process that breaks out of the application logic still isn't root inside the container, so capabilities it was never granted stay out of reach even if it finds a bug.
- **`--cap-drop ALL`.** Linux capabilities split up what "root" traditionally meant into named grants — `NET_BIND_SERVICE` (bind ports below 1024), `CHOWN`, `SETUID`, and so on. Dropping all of them and adding back only the one or two an app genuinely needs (most Go web services need none) removes dozens of privilege-escalation primitives at once.
- **`no-new-privileges`.** Blocks a process from gaining more privileges than it started with via `setuid`/`setgid` binaries or file capabilities — closing a class of escalation that capability-dropping alone doesn't.
- **Read-only root filesystem (`--read-only`)**, with an explicit `tmpfs` mount for any directory the app genuinely needs to write to (like `/tmp`). This means a compromise can't persist a backdoor into the image's own filesystem.
- **seccomp.** A BPF filter on which syscalls a process may make at all. Docker's default profile already blocks dangerous syscalls like `mount`, `ptrace`, `kexec_load`, and `reboot`; a custom, stricter profile (generated by tracing the application's actual syscalls) narrows this further for a specific workload.
- **AppArmor (or SELinux).** A mandatory access control (MAC) layer, separate from seccomp: instead of filtering *which syscalls* a process may make, it restricts *what a given syscall may touch* — which paths a process may read, write or execute, and which capabilities it may use them with — via a named profile loaded into the kernel.
  - Docker loads a default `docker-default` AppArmor profile on Debian/Ubuntu hosts automatically; `--security-opt apparmor=<profile>` swaps in a custom, tighter one (or `unconfined` to disable it, which should be rare and deliberate).
  - RHEL/Fedora-family hosts use SELinux instead, enforced the same way via `--security-opt label=...`; Kubernetes exposes the equivalent through a Pod's `appArmorProfile`/`seLinuxOptions`.
- **Rootless Docker** (see [[Docker 08 - How Docker Works Under the Hood]]) moves this hardening up a level: even the daemon itself doesn't run as host root, so a daemon compromise doesn't hand over the whole host.
- **The Docker socket is the sharpest edge.** Mounting `/var/run/docker.sock` into a container — a common CI/CD pattern for "build images from inside a pipeline container" — hands that container the ability to start *new* containers with `--privileged` and arbitrary host mounts, through an API with no further authentication.
  - A non-root `USER` inside that container changes nothing: the socket itself is root-equivalent.
  - Use a rootless build tool (`buildx` with a rootless builder, `kaniko`, `buildah`) instead of socket-mounting when images must be built inside a pipeline container.

## 4. Worked example

### Whiteboard version

The check a reviewer does by eye on every Dockerfile: is there a `USER` line, is the base pinned, is a secret sitting in plain `ENV`?

```dockerfile
FROM app@sha256:<digest>   # pinned, not :latest
USER 65532                 # not root
```

### Full example: a Dockerfile hardening checker

A static checker that encodes those same three checks in Go — the kind of pre-commit or CI gate a team runs before Trivy even looks at the built image.

```go
// Package dockerlint checks a Dockerfile's text against a small set of
// hardening rules: it is a teaching tool, not a replacement for a real
// scanner like Trivy, Grype or Hadolint.
package dockerlint

import (
	"regexp"
	"strings"
)

// Finding is one hardening rule that the Dockerfile failed.
type Finding struct {
	Rule   string
	Detail string
}

var floatingTagRE = regexp.MustCompile(`(?i)^FROM\s+\S+:(latest)\s*$`)
var pinnedRE = regexp.MustCompile(`(?i)@sha256:[0-9a-f]{64}`)
var userRootRE = regexp.MustCompile(`(?i)^USER\s+(root|0)\s*$`)
var secretEnvRE = regexp.MustCompile(`(?i)^(ENV|ARG)\s+\w*(PASSWORD|SECRET|TOKEN|API_KEY)\w*\s*=`)

// Check scans a Dockerfile's lines and returns every rule it breaks.
// It flags: a floating "latest" tag with no digest pin, an explicit
// USER root (or no USER at all, which defaults to root), and a secret
// baked into ENV or ARG instead of injected at runtime or via a
// BuildKit --mount=type=secret.
func Check(dockerfile string) []Finding {
	lines := strings.Split(dockerfile, "\n")
	var findings []Finding
	sawUser := false
	sawDigestPin := pinnedRE.MatchString(dockerfile)

	for _, raw := range lines {
		line := strings.TrimSpace(raw)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if floatingTagRE.MatchString(line) && !sawDigestPin {
			findings = append(findings, Finding{
				Rule:   "unpinned-base-image",
				Detail: line + " — pin by digest (@sha256:...), not just a tag",
			})
		}
		if userRootRE.MatchString(line) {
			findings = append(findings, Finding{
				Rule:   "runs-as-root",
				Detail: line + " — switch to a numeric non-root USER, e.g. 65532",
			})
		}
		if strings.HasPrefix(strings.ToUpper(line), "USER ") {
			sawUser = true
		}
		if secretEnvRE.MatchString(line) {
			findings = append(findings, Finding{
				Rule:   "secret-in-build-arg",
				Detail: line + " — secrets in ENV/ARG land in image layers and `docker history`",
			})
		}
	}
	if !sawUser {
		findings = append(findings, Finding{
			Rule:   "no-user-instruction",
			Detail: "no USER instruction: the container runs as root by default",
		})
	}
	return findings
}
```

Test (`go test -race`, Go 1.24):

```go
package dockerlint

import "testing"

func hasRule(fs []Finding, rule string) bool {
	for _, f := range fs {
		if f.Rule == rule {
			return true
		}
	}
	return false
}

func TestCheckFlagsInsecureDockerfile(t *testing.T) {
	df := `FROM golang:latest
ENV DB_PASSWORD=hunter2
RUN go build -o app .
CMD ["./app"]
`
	findings := Check(df)
	for _, rule := range []string{"unpinned-base-image", "secret-in-build-arg", "no-user-instruction"} {
		if !hasRule(findings, rule) {
			t.Errorf("expected rule %q, got %+v", rule, findings)
		}
	}
}

func TestCheckPassesHardenedDockerfile(t *testing.T) {
	df := `FROM gcr.io/distroless/static@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
COPY --chown=65532:65532 app /app
USER 65532
ENTRYPOINT ["/app"]
`
	findings := Check(df)
	if len(findings) != 0 {
		t.Errorf("expected no findings on hardened Dockerfile, got %+v", findings)
	}
}

func TestCheckFlagsExplicitRootUser(t *testing.T) {
	df := `FROM gcr.io/distroless/static@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
USER root
CMD ["/app"]
`
	findings := Check(df)
	if !hasRule(findings, "runs-as-root") {
		t.Errorf("expected runs-as-root, got %+v", findings)
	}
}
```

**Build-time secret injection**, the right way to hand a build a credential it needs (a private module proxy token) without it ever landing in a layer:

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.24@sha256:<digest> AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=secret,id=goproxy_token \
    GOPROXY=https://$(cat /run/secrets/goproxy_token)@proxy.example.com go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /app .

FROM gcr.io/distroless/static-debian12@sha256:<digest>
COPY --from=build --chown=65532:65532 /app /app
USER 65532
ENTRYPOINT ["/app"]
```

Built with `docker build --secret id=goproxy_token,src=./token.txt`. 

The secret is mounted only into the one `RUN` layer that needs it, at a path that BuildKit never commits to any image layer — unlike `ARG`/`ENV`, which both end up readable in the final image's history or environment.

**Run with the hardened flags** (the manual equivalent of a Kubernetes `securityContext`):

```bash
docker run \
  --read-only \
  --tmpfs /tmp \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --pids-limit 100 \
  --memory 256m \
  myapp@sha256:<digest>
```

Kubernetes expresses the same hardening declaratively:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 65532
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop: ["ALL"]
  seccompProfile:
    type: RuntimeDefault
```

## 5. Variants and comparison

| Option | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Distroless / scratch base | No shell, no package manager, often just the binary + CA certs | Static Go binaries with no runtime shell-out needs | Harder to debug interactively (no `docker exec ... sh`) |
| Alpine base | musl libc, package manager (`apk`), has a shell | Need a shell/tools occasionally, want small size | Still has a shell and package manager an attacker can use |
| Image scanning (Trivy/Grype) | Matches installed packages against CVE databases | Every build, gating merge/deploy on severity thresholds | False positives on CVEs that don't apply to your usage; needs triage |
| Image signing (cosign) | Signs the image digest with a key or keyless (OIDC) identity | Supply-chain integrity, admission-controller enforcement | Key/identity management; breaks if signing infra is down |
| Rootless Docker | The daemon itself runs unprivileged via user namespaces | Multi-tenant build hosts, shared CI runners | Some networking and privileged-port limitations |
| gVisor / Kata (stronger isolation) | Intercept syscalls (gVisor) or run a microVM per container (Kata) | Untrusted or multi-tenant workloads needing a harder boundary than namespaces | Performance overhead; narrower syscall/feature support |

## 6. Trade-offs and when not to use

- A read-only root filesystem breaks any app that writes to arbitrary paths at runtime (some logging libraries, some caches) — audit write paths first and mount `tmpfs` for the ones that are legitimate.
- `--cap-drop ALL` can break an app that genuinely needs one capability (e.g., binding port 80 directly needs `NET_BIND_SERVICE`) — add that one back rather than running privileged or staying root.
- Scanning and signing add pipeline time and a dependency on external services (CVE feeds, a signing/transparency log) — budget for that latency and have a documented break-glass path if the scanner or signing service is down.
- Distroless images trade debuggability for attack surface; for a workload under active development where interactive debugging matters daily, Alpine with a locked-down runtime config can be the pragmatic middle ground.
- None of this replaces patching: a perfectly hardened container running a base image with a six-month-old known CVE is still vulnerable to that CVE.

## 7. In production

- **Real systems:** Google's distroless images are the base for a large share of Go and Java production images across the industry; Kubernetes' Pod Security Standards (`restricted` profile) codify almost exactly the runtime flags above as a cluster-wide policy; GitHub's own container registry and most major clouds (ECR, GCR/Artifact Registry) support cosign-verified signatures and attach vulnerability scan results to pushed images automatically.
- **Failure modes → fixes:**
  - A container is compromised and the attacker tries to read `/var/run/docker.sock` → never mount the Docker socket into application containers; use a rootless builder in CI instead.
  - A new CVE is published for a base-image package already running in production → rebuild on a cadence (weekly, or on CVE alert) even with no application code change, since the base image's packages still need patching.
  - A secret leaks because it was passed as `ARG` or `ENV` → audit `docker history <image>` for every image built this way (both show up there) and move the secret to BuildKit's `--mount=type=secret` or runtime injection.
  - An admission controller is bypassed because signature verification was advisory, not enforced → make signature and scan-pass checks a hard admission gate (e.g., Kyverno or OPA Gatekeeper policies), not just a dashboard warning.
- **What to monitor:** new critical/high CVEs against images currently running (not just at build time — CVEs are discovered after images ship); containers still running as root or with unexpected capabilities (via a runtime tool like Falco); unsigned or unverified images reaching production; base-image age/staleness.

## 8. Deep dive

- **Why shared-kernel isolation needs defense in depth.** A container escape usually chains two things: a kernel bug reachable from inside a namespace, and enough privilege (root, a dangerous capability, a mounted host path) to exploit it. Dropping capabilities and running non-root doesn't patch the kernel bug, but it removes the privilege half of the chain, which is why hardening still matters even on a fully patched host.
- **Rootless Docker's actual mechanism.** The daemon maps container UID 0 to an unprivileged host UID via `/etc/subuid`/`/etc/subgid` ranges and a user namespace; networking (since an unprivileged process can't create bridges or hold raw sockets for NAT) goes through a userspace network stack like `slirp4netns` or `RootlessKit`, at some throughput cost versus the default root daemon's native bridge networking.
- **Keyless signing.** Cosign's keyless mode signs using a short-lived certificate issued by Sigstore's Fulcio against an OIDC identity (e.g., a GitHub Actions workflow identity), and records the signature in Rekor, a public transparency log — so verification checks "was this signed by workflow X in repo Y" rather than managing a long-lived private key per team.
- **Admission policy is what turns scanning/signing from advisory to enforced.** Scanning a build and signing an image are no-ops for security if nothing downstream checks them before running the container — Kubernetes admission controllers (Kyverno, OPA Gatekeeper) or a registry's own policy engine are what actually reject an unsigned or critically-vulnerable image at deploy time.
- **`securityContext` in Kubernetes is the same checklist, declaratively.** `runAsNonRoot`, `readOnlyRootFilesystem`, `capabilities.drop`, `allowPrivilegeEscalation: false`, and `seccompProfile` map one-to-one onto the `USER`, `--read-only`, `--cap-drop`, `no-new-privileges`, and seccomp flags covered above — hardening a Dockerfile and hardening a Pod spec are the same five decisions in two different syntaxes.

## 9. Interview questions

> [!question]- Does running a container as a non-root user make it safe?
> No, by itself it only removes root's privileges inside the container. Mounting the Docker socket into that same container, for example, still hands it an unauthenticated root-equivalent API regardless of its own UID. Non-root `USER` is one layer of several (capabilities, read-only filesystem, seccomp, no socket mounts) that together reduce the blast radius of a compromise.

> [!question]- Why pin a base image by digest instead of by tag?
> A tag like `:1.24` is a mutable pointer that can be repointed to a different image by whoever controls the registry namespace; a digest (`@sha256:...`) addresses the exact content. Pinning by digest means the image you scanned, signed, and tested is provably the image that runs in production.

> [!question]- Where do Docker secrets go wrong most often, and what's the fix?
> Putting a secret in `ENV` or `ARG` bakes it into the image's layers and its history/config, retrievable by anyone who can pull or inspect the image — even after a later layer "overwrites" the variable. The fix is BuildKit's `--mount=type=secret` for build-time secrets (mounted only into the one RUN step, never committed to a layer) and runtime env injection or a secrets manager for running containers.

> [!question]- What's the difference between scanning and signing an image, and why do you need both?
> Scanning finds known vulnerabilities in the image's packages at a point in time. Signing proves the image in the registry is exactly the one your pipeline built and scanned — without it, an attacker with registry write access could swap in a different, unscanned image under the same tag. Scanning checks what's inside; signing checks it hasn't been swapped since.

> [!question]- What does `--cap-drop ALL` protect against that a non-root user doesn't?
> Linux capabilities are fine-grained privileges (`SETUID`, `NET_RAW`, `SYS_PTRACE`, and more) that even a non-root process can hold via file capabilities or a setuid binary found inside the container. Dropping all of them removes those specific escalation and sandbox-escape primitives regardless of the process's UID.

> [!question]- Your container needs to bind port 80. Does that force it to run as root?
> No. Add back only the `NET_BIND_SERVICE` capability (`--cap-drop ALL --cap-add NET_BIND_SERVICE`) while keeping a non-root `USER` — that's the specific permission needed to bind a privileged port, not full root.

## 10. Cheat sheet

- Non-root `USER` (numeric, e.g. 65532), `--cap-drop ALL` + add back only what's needed, `no-new-privileges`, `--read-only` rootfs with `tmpfs` for required writes, seccomp.
- Minimal base (distroless/scratch, or Alpine if a shell is genuinely needed), pinned by `@sha256:` digest.
- Scan every build (Trivy/Grype/ECR) and generate an SBOM (syft); sign the digest (cosign) and verify it at admission, not just on a dashboard.
- Secrets never in `ENV`/`ARG` (they land in layers and `docker history`); use BuildKit `--mount=type=secret` at build time, runtime injection or a secrets manager at run time.
- Mounting `/var/run/docker.sock` into any container is root on the host — use a rootless builder (buildx rootless, kaniko, buildah) in pipelines instead.
- Rootless Docker remaps container root to an unprivileged host UID via user namespaces, at some networking throughput cost.
- Kubernetes' `securityContext` is the same five decisions (non-root, read-only fs, dropped capabilities, no privilege escalation, seccomp) expressed declaratively.
- Hardening reduces blast radius; it doesn't replace patching a known CVE in a base image.

## Links

- **Before this:** [[Docker 08 - How Docker Works Under the Hood]], [[Docker 04 - Writing a Production Dockerfile for Go]]
- **Next:** [[Kubernetes Fundamentals]]
- **Compare with:** [[Secrets Management]] (runtime secret storage and rotation beyond the build), [[Authentication vs Authorization]] (least privilege as a general principle, applied here to a process instead of a user)

### Watch on YouTube

- [Docker Container Security in 30 Minutes / Trivy Vulnerability Scanning & Hardening / Hands-On Projec](https://www.youtube.com/watch?v=wh9c9peM1sk) · The Cloud Threat Defender · 32 min · 304 views
- [Container Security Explained](https://www.youtube.com/watch?v=b_euX_M82uI) · IBM Technology · 6 min · 86,273 views
