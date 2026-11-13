---
tags: [devops, cloud, aws, storage]
level: intermediate
status: reviewed
prereqs: ["[[AWS 01 - Core Concepts (Regions, AZs, Accounts, Shared Responsibility)]]", "[[AWS 02 - IAM]]"]
related: ["[[File Upload Architecture]]", "[[AWS SQS, SNS and EventBridge]]", "[[AWS 09 - Route 53 and ACM]]", "[[Secrets Management]]"]
sources:
  - "AWS S3 User Guide, Buckets and objects"
  - "AWS S3 User Guide, Amazon S3 data consistency model (strong read-after-write since Dec 2020)"
  - "AWS S3 User Guide, Request rate and performance guidelines"
  - "AWS S3 User Guide, Multipart upload overview and quotas"
  - "AWS S3 User Guide, Using Amazon S3 storage classes"
  - "AWS S3 User Guide, Blocking public access and Object Ownership (bucket owner enforced)"
  - "AWS KMS Developer Guide, SSE-KMS"
updated: 2026-11-13
---

# AWS 07 - S3

> [!summary] TL;DR
> S3 is an object store: you put whole files ("objects") under string keys inside flat containers ("buckets") and get back one of the few AWS services with **11 nines of annual durability**.
>
> There is no real folder tree, no partial-file edits, and no server to patch; every read and write goes over HTTPS to an API, and almost every production feature (presigned URLs, lifecycle rules, event notifications, replication) exists to keep bytes out of your own servers.

> [!abstract] Core idea
> - A bucket is a flat namespace of key → object. "Folders" are just keys containing `/`, rendered as a tree by the console.
> - Since December 2020, S3 gives **strong read-after-write consistency**: a `GET` right after a successful `PUT` (even an overwrite) always sees the new object, with no "eventually consistent" window to code around.
> - Durability (11 nines: an object almost never disappears) and availability (99.9–99.99%: S3 might reject a request right now) are different guarantees — don't confuse "my data is safe" with "my request will succeed".
> - Upload and download directly between the client and S3 with presigned URLs; never proxy file bytes through your own API.
> - Storage class + lifecycle rules move cold data to cheaper tiers automatically; security defaults as of 2023 are "everything private, no ACLs, IAM/bucket-policy only".

## Start here: the basics

**The problem in one story.**
Your app lets users upload profile photos.
If you save them on your server's disk, the disk fills up, and if the server dies the photos die too.
You want a place that never loses files, never runs out of space, and serves them to millions of people.
S3 is that place: you hand it a file and a name, and later ask for the file back by name.

**Words you need first**

| Word | Plain meaning | Tiny example |
| --- | --- | --- |
| Object | One whole file plus some info about it | `user-7.jpg` and its content-type |
| Bucket | A named container that holds objects | `myapp-uploads` |
| Key | The full name of an object inside a bucket | `tenants/42/avatars/user-7.jpg` |
| HTTP API | Talking to a service by web requests | `PUT` to upload, `GET` to download |
| Availability Zone (AZ) | One separate data center group in a region | `ap-south-1a` |
| Durability | Chance your data is never lost | 11 nines = almost never |
| Availability | Chance a request works right now | 99.99% of requests succeed |
| IAM policy | Rules saying who may do what | "this role may read this bucket" |

**Picture it**

```mermaid
flowchart LR
    C["Client app"] -- "PUT key + bytes" --> B["S3 bucket"]
    C -- "GET key" --> B
    B --> A1["Copy in AZ 1"]
    B --> A2["Copy in AZ 2"]
    B --> A3["Copy in AZ 3"]
```

**Analogy.** S3 is a giant coat check: you hand over a coat (the file), get a ticket with a name on it (the key), and get the exact coat back when you show the ticket.
Where it breaks: a coat check has no pricing per visit or storage tier, and you can't edit part of a coat in place; in S3 you also replace the whole object, never a piece of it.

**How the rest of this note builds up**

- First, why S3 exists and the key-value mental model (sections 1-2).
- Then how it works: prefix scaling, the security model, presigned URLs, multipart upload, storage classes, events and CloudFront (section 3).
- Then a Go worked example and comparisons with other storage (sections 4-6).
- Finally the SDE-3 deep dive: production pitfalls, how strong consistency was built, throttling, and ETag gotchas (sections 7-9).

> [!tip] Remember
> S3 is a key → file store over HTTPS: whole files in, whole files out, almost never lost.

## 1. Why it exists

A backend team needs somewhere to put user uploads, static assets, logs, and backups — files that do not fit a row in a relational database and that traffic can spike on without warning (a viral post with 50,000 image views in a minute).

Running your own file servers means provisioning disks for peak size, replicating them for durability, writing your own backup process, and scaling read bandwidth by hand.

S3 replaces all of that with an HTTP API over effectively unlimited storage: single objects up to **5 TiB**, buckets with no size or object-count limit, data replicated across a minimum of three Availability Zones in the region by design. You pay per GB stored per month, per request, and per GB transferred out — nothing for the servers underneath.

**Concrete numbers (documented, AWS S3 User Guide, ap-south-1 pricing as of late 2026 — confirm current rates in the AWS Pricing Calculator):**
- S3 Standard: designed for **99.999999999%** (11 nines) annual durability and **99.99%** availability.
- S3 Standard storage: ~$0.025/GB-month for the first 50 TB; S3 Standard-IA: ~$0.0138/GB-month plus a $0.01/GB retrieval fee; S3 Glacier Deep Archive: ~$0.00099/GB-month (roughly 1/25th of Standard) with retrieval taking up to 12 hours.
- Requests: PUT/COPY/POST/LIST ~$0.005 per 1,000; GET/SELECT ~$0.0004 per 1,000 — cheap per call, but a service that lists a bucket per request rather than caching the listing can rack up millions of requests a day for free.
- A single PUT caps at 5 GiB; above that (and AWS recommends it above ~100 MB) you must use multipart upload.

## 2. Mental model

Think of S3 as a single, planet-scale **key-value store for blobs**, not a filesystem:

- The **bucket** is the namespace (globally unique name, created in one region).
- The **key** is the whole string after the bucket, e.g. `tenants/42/avatars/user-7.jpg` — there is no real directory `tenants/42/avatars/`, only a key that happens to contain slashes.
- The **object** is the bytes plus metadata (content-type, custom headers, a version ID if versioning is on).
- There is no partial write: an object is replaced atomically by a full PUT, or read back as a whole (or a byte range).

Because there's no real hierarchy, S3 can shard by key prefix behind the scenes and scale write and read throughput by adding more prefixes — which is exactly what the request-rate guidance in §3 is about.

## 3. How it works

### Request-rate scaling by prefix

S3 automatically partitions a bucket's keyspace to spread load, and the official guidance is **3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second, per prefix** — and a bucket can have many prefixes, so total throughput scales with how your keys are distributed.

Before mid-2018 you had to randomize a hash prefix (`a3f9/photo.jpg`) to force S3 to split partitions early; since then S3 scales automatically regardless of key naming, so the old "randomize your prefix" advice is no longer required, though spreading high-throughput key ranges (e.g. `tenants/{id}/...` instead of one shared prefix for all tenants) still helps if you expect to burst past the per-prefix numbers immediately rather than ramping into them.

### Security model

```mermaid
flowchart TB
    subgraph identity["Who is asking"]
        U["IAM user / role\n(identity-based policy)"]
    end
    subgraph bucket["Bucket-level controls"]
        BPA["Block Public Access\n(4 account/bucket settings, on by default)"]
        OWN["Object Ownership:\nBucket owner enforced\n(ACLs disabled, default since Apr 2023)"]
        BP["Bucket policy\n(resource-based JSON)"]
    end
    subgraph object["Per-object"]
        ENC["Encryption:\nSSE-S3 (AES-256, S3-managed key)\nor SSE-KMS (KMS key, audited, slower, costs per request)"]
    end
    U -- "request" --> BPA
    BPA -- "not blocked" --> OWN
    OWN --> BP
    BP -- "IAM policy AND bucket policy\nmust both allow it" --> ENC
    ENC --> OK["request served"]
    BPA -- "blocked" --> DENY["403, even if a policy would allow it"]
```

- **Block Public Access** is four switches (block public ACLs/policies, ignore public ACLs, restrict public buckets) that override everything else — a bucket policy that grants `s3:GetObject` to `*` still 403s if Block Public Access is on. New buckets have it on by default.
- **Object Ownership: Bucket owner enforced** (the default for buckets created since April 2023) disables ACLs entirely; access is granted only through IAM identity policies and bucket policies, which is simpler to reason about than the old ACL + policy + ownership mix.
- **IAM policy vs bucket policy**: an IAM policy is attached to a principal (user/role) and can reference many buckets; a bucket policy is attached to the bucket and can grant access to other accounts. S3 evaluates both (plus Block Public Access and any Service Control Policy) and denies if any explicit `Deny` matches, so **an explicit `Deny` in either one wins**.
- **SSE-S3** (`AES256`) encrypts with a key S3 manages entirely; no extra cost, no audit trail of individual key uses.

  **SSE-KMS** (`aws:kms`) encrypts with a KMS key you control (rotation, audit via CloudTrail, cross-account grants) at the cost of a KMS API call per object GET/PUT (billed, and rate-limited by KMS request quotas) — use it when you need to prove who decrypted what, or a customer-managed key you can revoke.

### Presigned URLs and direct upload

A presigned URL is a normal S3 URL with a signature and expiry baked into the query string, generated by *your* backend using *its* IAM credentials, so the browser can call S3 directly without ever holding an AWS credential:

```mermaid
sequenceDiagram
    participant Browser
    participant API as Your API
    participant S3
    participant SQS
    participant Worker

    Browser->>API: POST /uploads (file metadata)
    API->>API: sign a presigned PUT URL (expires in 15 min)
    API-->>Browser: { uploadUrl, key }
    Browser->>S3: PUT uploadUrl (file bytes, direct — bypasses API)
    S3-->>Browser: 200 OK
    S3->>SQS: s3:ObjectCreated:Put event
    SQS->>Worker: deliver event (key, bucket, size)
    Worker->>S3: GET original, process, PUT derivative
```

This is the pattern [[File Upload Architecture]] builds the whole upload flow around; S3's part of it is: sign the URL with a short expiry, restrict it to one key and content-type, and let S3 itself fan the completion out as an event instead of your API polling for it.

### Multipart upload

Required above 5 GiB, recommended above ~100 MB:

- Initiate → get an `UploadId` → upload parts in parallel (each part **5 MiB–5 GiB, except the last**, up to **10,000 parts**) → complete with the list of part ETags.

  The **5 TiB max object size** is a separate, independent cap — 10,000 parts at 5 GiB each would in principle sum to far more than 5 TiB, so it is not derived from multiplying part count by max part size; S3 enforces the 5 TiB ceiling directly.
- A failed part just gets re-uploaded; you never restart the whole object.
- Abandoned multipart uploads **still bill for storage** until completed or aborted — add a **lifecycle rule to abort incomplete multipart uploads** after N days, or orphaned parts quietly accumulate cost forever.

### Storage classes and lifecycle

```mermaid
stateDiagram-v2
    [*] --> Standard: object created
    Standard --> StandardIA: lifecycle rule,\nage >= 30 days
    StandardIA --> GlacierIR: age >= 90 days
    GlacierIR --> GlacierDeepArchive: age >= 180 days
    GlacierDeepArchive --> Expired: age >= 2555 days (7y retention policy)
    Expired --> [*]: object deleted

    Standard --> Deleted: explicit DELETE
    StandardIA --> Deleted: explicit DELETE
    note right of StandardIA
      Minimum 30-day storage charge
      and a per-GB retrieval fee apply
      even if you delete it on day 31
    end note
```

A lifecycle rule is a bucket-level policy (prefix or tag filter → transition after N days → class), evaluated once a day; it is not instant, and a transition still bills at least the source class's minimum storage duration (30 days for Standard-IA, 90 for Glacier classes) even if you delete the object the day after it moves.

### Versioning, Object Lock, replication

- **Versioning**: once enabled on a bucket it can only be **suspended**, never fully turned off; every PUT to an existing key creates a new version ID instead of overwriting, and a DELETE just adds a "delete marker" (the old versions are still there and billed until a lifecycle rule expires noncurrent versions).
- **Object Lock** (WORM) needs versioning on. **Governance mode**: users with `s3:BypassGovernanceRetention` can still delete/overwrite early. **Compliance mode**: nobody, including the root account, can shorten or delete until the retention date — used for audit/compliance data, not casual use.
- **Replication** (same-region SRR or cross-region CRR) needs versioning on both buckets and only replicates **new** writes going forward; objects that existed before replication was turned on need an explicit **S3 Batch Replication** job to be copied retroactively.

### Event notifications

S3 can push `s3:ObjectCreated:*` / `s3:ObjectRemoved:*` (and more) events to **SQS**, **SNS**, **Lambda**, or **EventBridge**.

EventBridge is the usual default for anything non-trivial because one event can fan out to many independent rules/consumers (a processing worker, an audit log, a metrics counter) without you wiring up separate SNS topics per consumer; plain SQS is simplest when there is exactly one queue of work to process.

### CloudFront in front of S3

Static assets (built frontend bundles, processed images, public downloads) go behind **CloudFront** with an **Origin Access Control (OAC)** — the modern replacement for the older Origin Access Identity — so the S3 bucket itself stays fully private (Block Public Access on) and only CloudFront's signed requests can read it.

Private content uses CloudFront **signed URLs/cookies** instead of S3 presigned URLs when you want one signing key to cover many paths or a whole CDN session rather than one object.

## 4. Worked example

### Whiteboard version

The shape of a presigned-upload call, stripped to the essentials: build an S3 client, ask it to presign a `PutObject`, hand the URL to the browser.

```go
presigner := s3.NewPresignClient(s3.NewFromConfig(cfg))
req, err := presigner.PresignPutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("uploads-bucket"),
    Key:    aws.String("tenant-42/orig/photo.jpg"),
})
// req.URL is what the browser PUTs the file bytes to.
```

The full version below adds content-type pinning and an explicit expiry, and ships with a test.

**Full code**, Go 1.24, using `github.com/aws/aws-sdk-go-v2` (`aws-sdk-go-v2` v1.32.6, `credentials` v1.17.47, `service/s3` v1.69.0). Presigning only computes a SigV4 signature locally — it makes no network call — so this compiles and runs with no real AWS account:

```go
package s3demo

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// newPresignClient builds an S3 presign client with static (fake) credentials.
// Presigning only computes a SigV4 signature locally; it makes no network call,
// so this works without real AWS credentials or connectivity.
func newPresignClient(region string) *s3.PresignClient {
	cfg := aws.Config{
		Region:      region,
		Credentials: credentials.NewStaticCredentialsProvider("AKIAEXAMPLE", "secretexample", ""),
	}
	client := s3.NewFromConfig(cfg)
	return s3.NewPresignClient(client)
}

// PresignedPut returns a time-limited URL a browser can PUT an object to
// directly, without the object's bytes ever passing through our API servers.
func PresignedPut(ctx context.Context, bucket, key, contentType string, ttl time.Duration) (*v4SignedURL, error) {
	presigner := newPresignClient("ap-south-1")
	req, err := presigner.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(key),
		ContentType: aws.String(contentType),
	}, s3.WithPresignExpires(ttl))
	if err != nil {
		return nil, err
	}
	return &v4SignedURL{URL: req.URL, Method: req.Method, SignedHeader: req.SignedHeader}, nil
}

type v4SignedURL struct {
	URL          string
	Method       string
	SignedHeader map[string][]string
}
```

```go
func TestPresignedPutIsTimeLimitedAndSigned(t *testing.T) {
	out, err := PresignedPut(context.Background(), "uploads-bucket", "tenant-42/orig/photo.jpg", "image/jpeg", 15*time.Minute)
	if err != nil {
		t.Fatalf("PresignedPut: %v", err)
	}
	if out.Method != "PUT" {
		t.Fatalf("method = %q, want PUT", out.Method)
	}
	if !strings.Contains(out.URL, "uploads-bucket") {
		t.Fatalf("URL missing bucket: %s", out.URL)
	}
	if !strings.Contains(out.URL, "X-Amz-Expires=900") {
		t.Fatalf("URL missing 900s expiry: %s", out.URL)
	}
	if !strings.Contains(out.URL, "X-Amz-Signature=") {
		t.Fatalf("URL missing SigV4 signature: %s", out.URL)
	}
}
```

**Measured:** `go test -race` passes in 1.5s; the generated URL for a 15-minute TTL carries `X-Amz-Expires=900` and a `X-Amz-Signature` query parameter, confirming the SDK signs a real SigV4 query-string request rather than returning a bare path.

A browser-direct upload from HTML instead uses a **presigned POST policy**, which (unlike a presigned PUT) can constrain multiple fields at once — exact key, content-type, and a `content-length-range` — in one signed form, which a single presigned PUT URL cannot do.

## 5. Variants and comparison

| Storage class | Durability | Retrieval | Minimum duration | Use when |
| --- | --- | --- | --- | --- |
| S3 Standard | 11 nines | Milliseconds | None | Actively read/written data |
| S3 Standard-IA | 11 nines | Milliseconds | 30 days | Backups, older versions, accessed monthly |
| S3 One Zone-IA | 11 nines (single AZ) | Milliseconds | 30 days | Re-creatable data, lower cost, AZ-loss risk accepted |
| S3 Glacier Instant Retrieval | 11 nines | Milliseconds | 90 days | Archives still needing instant reads |
| S3 Glacier Flexible Retrieval | 11 nines | Minutes–hours | 90 days | Archives read a few times a year |
| S3 Glacier Deep Archive | 11 nines | Up to 12 hours | 180 days | Compliance archives, 7-year retention |
| S3 Intelligent-Tiering | 11 nines | Milliseconds (hot tiers) | None | Unknown/changing access patterns; auto-moves between tiers, small monitoring fee per object |

| Upload path | How it works | Use when | Cost |
| --- | --- | --- | --- |
| Presigned PUT | One signed URL, one object, no extra constraints | Simple client uploads, mobile apps | One S3 PUT |
| Presigned POST policy | Signed form with conditions (key, content-type, size range) | Browser `<form>` uploads, tighter validation | One S3 PUT |
| Multipart upload | Parts uploaded in parallel, completed together | Objects > ~100 MB, unreliable networks, resumable uploads | N parts × PUT pricing |
| Proxy through API | API reads bytes, forwards to S3 | Needed only for synchronous validation/transformation before storage | API server memory/CPU/timeout cost, avoid at scale |

## 6. Trade-offs and when not to use

- S3 is not a filesystem: no atomic rename across prefixes, no partial in-place edits, no POSIX locking — anything that needs those semantics belongs on EBS/EFS or a database, not S3.
- Listing a bucket (`ListObjectsV2`) is **not a free count** — it's paginated API calls billed like any other request; track object counts in your own metadata store instead of listing to count.
- Strong read-after-write consistency means callers don't need to build staleness workarounds, but it does not mean S3 is always *available* for that read in the next second — plan for retries on 5xx/503 (Slow Down) the same as any other API.
- Minimum storage durations on IA/Glacier classes mean transitioning rarely-but-not-never-touched data to a cold tier can cost more than it saves if you then delete or re-read it early — model the access pattern before picking a lifecycle rule, not after.

## 7. In production

- **Real systems:** nearly every AWS-hosted SaaS backend uses S3 for user uploads, build artifacts (Terraform state, Lambda deployment packages), log archives, and as the origin behind a CloudFront CDN for static frontends.
- **Failure modes → fixes:**
  - 403 despite a bucket policy that should allow it → check Block Public Access and Object Ownership first; they override policy evaluation silently.
  - Runaway storage cost from abandoned multipart uploads → add the "abort incomplete multipart upload after N days" lifecycle rule.
  - SSE-KMS throttling (`ThrottlingException` from KMS) under high request volume → request a KMS quota increase or switch hot paths to SSE-S3 where the audit trail isn't required.
  - Replication silently missing old objects → remember CRR/SRR is forward-only; backfill with S3 Batch Replication.
- **What to monitor:** 4xx/5xx rate per bucket (CloudWatch request metrics, opt-in), bytes downloaded (egress cost), `NumberOfObjects`/`BucketSizeBytes` per storage class, and KMS `ThrottlingException` count if using SSE-KMS.

## 8. Deep dive

- **Why strong consistency was hard, and how S3 did it.** Before December 2020, a `GET` immediately after an overwrite `PUT` could return either the old or new version for a short window, because S3's metadata was served from multiple internal replicas that could momentarily disagree.

  AWS re-architected the metadata layer so every request is now strongly consistent across all AZs in the region, with no performance cliff and no new cost — this removed an entire class of "read my own write" workarounds application code used to need (retry loops, version stamping).
- **Why per-prefix throughput limits exist at all.** Internally S3 still partitions the keyspace to parallelize request handling; the per-prefix number is the ceiling on a single partition's handling capacity before it needs to split, and partition splitting is itself not instantaneous.

  A workload that suddenly jumps from near-zero to tens of thousands of requests/second on a brand-new prefix can briefly see throttling (503 Slow Down) while S3 catches up, even though a gradually-ramping workload to the same eventual rate would not.
- **ETag is not always an MD5.** For a single-part PUT, the ETag is the MD5 of the object. For a multipart upload, the ETag is `MD5-of-concatenated-part-MD5s-N` (a hash of hashes, suffixed with the part count) — it is still useful as a change-detection token, but code that assumes "ETag == MD5(object bytes)" to verify downloaded content will silently fail for every multipart-uploaded object.

## 9. Interview questions

> [!question]- What's the difference between S3's durability and its availability numbers?
> Durability (11 nines) is the chance an object you successfully stored is ever lost — effectively "never" at any realistic scale. Availability (99.9–99.99% depending on class) is the chance a given request succeeds right now. You can have a perfectly intact object and still get a 503 reading it during a brief availability dip.

> [!question]- Why upload through a presigned URL instead of your own API?
> The file's bytes go straight from the client to S3 instead of through your API process, so your servers never hold multi-gigabyte request bodies in memory, never hit their own request-size or timeout limits, and don't need to scale compute just to proxy bytes they don't inspect.

> [!question]- Trap: does enabling bucket versioning let you ever fully disable it again?
> No. Versioning can only be **suspended**, never turned back to "never versioned". New PUTs after suspension stop creating new version IDs, but all versions created while it was on remain and are still billed until a lifecycle rule expires them.

> [!question]- Your bucket policy clearly grants public read, but requests still 403. Why?
> Block Public Access is almost certainly on (the default for new buckets) and overrides any policy that would otherwise allow public access. Check the four Block Public Access settings before debugging the policy JSON itself.

> [!question]- When would you pick SSE-KMS over the default SSE-S3?
> When you need an audit trail of exactly which principal decrypted which object (via CloudTrail), a customer-managed key you can rotate or revoke independently of AWS, or cross-account key sharing through KMS grants — at the cost of a KMS API call (and its quota/rate limit) on every object read and write.

> [!question]- You turned on cross-region replication last week. Why are objects from two years ago still missing in the destination bucket?
> CRR/SRR only replicates writes that happen after replication is configured; it is not retroactive. Objects written before that point need an explicit **S3 Batch Replication** job to be copied across.

## 10. Cheat sheet

- Bucket = namespace, key = full path-like string, object = bytes + metadata; no real folders.
- Strong read-after-write consistency since December 2020 — no more eventual-consistency workarounds.
- 11 nines durability ≠ availability (99.9–99.99%): data safety and request success are different guarantees.
- Default security posture: Block Public Access on, Object Ownership "bucket owner enforced" (no ACLs), access via IAM + bucket policy only.
- SSE-S3 is free and simple; SSE-KMS adds audit trail and rotation at the cost of a KMS call per request.
- Multipart upload for >100 MB (required >5 GiB): 5 MiB–5 GiB per part, max 10,000 parts, 5 TiB max object — always add the abort-incomplete-upload lifecycle rule.
- Lifecycle rules move Standard → IA → Glacier tiers; each tier has a minimum storage duration that still bills if you delete early.
- Versioning can be suspended, never fully disabled; replication is forward-only.
- 3,500 writes / 5,500 reads per second per prefix, auto-scaled since 2018 — no need to randomize key prefixes anymore.

## Links

- **Before this:** [[AWS 01 - Core Concepts (Regions, AZs, Accounts, Shared Responsibility)]], [[AWS 02 - IAM]]
- **Next:** [[AWS 08 - RDS and Aurora]], [[AWS 09 - Route 53 and ACM]]
- **Compare with:** [[File Upload Architecture]] (the end-to-end upload flow this note's presigned-URL and event pieces slot into), [[AWS SQS, SNS and EventBridge]] (what receives S3's event notifications)

### Watch on YouTube

- [AWS re:Invent 2025 - How Netflix uses Amazon S3 Storage Lens to track exabytes of data (STG214)](https://www.youtube.com/watch?v=Q2YoHfhFuI8) · AWS Events · 51 min · 1,231 views
- [AWS re:Invent 2025 - Deep dive on Amazon S3 (STG407)](https://www.youtube.com/watch?v=S4swTRi1i0w) · AWS Events · 39 min · 4,944 views
