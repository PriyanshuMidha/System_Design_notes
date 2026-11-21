---
tags: [cs-fundamentals, computer-architecture, hardware, boot]
level: basic
status: draft
type: implementation
prereqs: ["[[How a Computer Runs a Program]]"]
related: ["[[ROM, Flash, Firmware and the Boot Process]]", "[[RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM]]"]
sources:
  - "UEFI Specification, Unified EFI Forum (boot services, Secure Boot)"
  - "systemd.io documentation (init, unit ordering, boot targets)"
updated: 2026-11-13
---

# ROM, Flash, Firmware and the Boot Process - Go

> [!summary] TL;DR
> This code models the real boot sequence (POST → find boot device → bootloader → kernel → init) as an ordered list of `Stage`s, each of which can fail — exactly the state-machine shape described in [[ROM, Flash, Firmware and the Boot Process]].
>
> It doesn't touch real hardware; it proves the *ordering and halt-on-failure* property that makes a physical boot diagnosable.

> [!info] How to read this note (pick your level)
> - 🟢 **New to this?** Read the theory note first ([[ROM, Flash, Firmware and the Boot Process]]). Here, read "From zero" below, "Before the code" and "What this code shows", then skim the code steps.
> - 🟡 **Know the basics?** Read the Code, Design decisions and Tests sections, then run it yourself.
> - 🔴 **Interview / SDE-3 prep?** Add the Pitfalls and Exercises sections. Headings are tagged 🟢🟡🔴.

> [!note] Before this note
> - [[ROM, Flash, Firmware and the Boot Process]]: the theory twin. Know the boot relay (POST → find boot device → bootloader → kernel → init) and that a failed stage stops everything after it.
> - [[How a Computer Runs a Program]]: background only.

**From zero** 🟢: this file is the hands-on side of [[ROM, Flash, Firmware and the Boot Process]]. It is a small Go model of a boot chain — stages that verify and hand off to the next, like firmware to bootloader to OS. The code is a simulation to make the ideas concrete, not real firmware. Read each step with its notes.

## Before the code 🟢

- **Structs** (`Stage`, `Result`): a named bundle of fields, like one row of a boot log.
- **Function values** (`Run func() error`): a function stored in a field, so each boot stage carries its own "do the work" step.
- **Errors as values** (`error`, `errors.New`): a stage reports failure by returning a non-nil `error`, not by crashing.
- **Error wrapping** (`fmt.Errorf("...: %w", err)`): adds context to an error while keeping the original inside, so `errors.Is` can still find it.
- **POST**: power-on self-test, the firmware's hardware check; here it is just the first stage's name.
- **Slices** (`[]Stage`): an ordered, growable list; the boot chain is just a slice walked front to back.
- **Table-style tests** (`testing`, `reflect.DeepEqual`): tests build stages, run `Sequence`, and compare the result to what they expect.
- **What to run:** `go vet ./boot/... && go test -race ./boot/...` inside the module. No goroutines, interfaces or generics are needed here.

## What this code shows 🟢

| Code piece | Theory concept it demonstrates |
|---|---|
| `Stage` | One step in [[ROM, Flash, Firmware and the Boot Process#3 How it works\|the boot sequence]] — POST, find-device, bootloader, kernel, or init |
| `Sequence` | The hand-off rule: a stage's success moves to the next; a failure halts everything downstream, matching the state diagram in [[ROM, Flash, Firmware and the Boot Process#4 Worked example\|the worked example]] |
| `Result` | What a real firmware log or POST-code readout tells an operator: how far the machine got, and where it stopped |

## Setup 🟢

```text
module cs1scratch
go 1.24

package boot   // cs1scratch/boot
```

No external dependencies. Run with:

```bash
go vet ./boot/...
go test -race ./boot/...
```

## Code 🟡

> 🟢 → 🟡 **You now know** what the model is for: proving that boot stages run in order and stop at the first failure. **Next we read the code:** two small types and one loop.

### Step 1: the `Stage` type

**What this code does, in plain words:** it defines one boot step as a name plus a function that either works or returns an error.

**Concept.** A `Stage` is one link in the boot chain: it has a name (for reporting, like a POST code) and a `Run` function that either succeeds or returns an error. This mirrors real firmware, where POST is "a self-test that either passes or halts with a code," not a value-returning computation — the design deliberately keeps `Run` to a bare `func() error` rather than something richer, because every real boot stage reduces to exactly that binary outcome.

```go
package boot

import "fmt"

// Stage is one step in the boot sequence.
type Stage struct {
	Name string
	// Run performs the stage's work. A non-nil error halts the boot
	// sequence at this stage, just as a real POST failure halts before
	// any OS is loaded.
	Run func() error
}
```

**How it works.**
1. `Name` is a plain string, used only for reporting — the Go equivalent of a POST code shown on a diagnostic display.
2. `Run func() error` is the stage's entire contract: no return value besides success/failure, because a real firmware stage either hands off or halts — there is nothing else for it to communicate upward.

### Step 2: the `Result` type

**What this code does, in plain words:** it records which steps finished, in order, and the name and error of the step that failed, if any.

**Concept.** `Result` is what you'd read off a server's boot log or a BMC's POST-code history: which stages got through, and exactly where things stopped. Keeping `Completed` as a slice (not just a count) preserves the order, which is the detail that actually matters for diagnosis — "failed at bootloader" means something different from "failed at POST."

```go
// Result records what happened when Sequence ran.
type Result struct {
	Completed []string // stages that succeeded, in order
	FailedAt  string   // name of the stage that failed, or "" if all succeeded
	Err       error
}
```

**How it works.**
1. `Completed` grows one name at a time, only on success — so its length alone tells you how far the boot got.
2. `FailedAt` and `Err` stay zero-valued (`""`, `nil`) on a clean boot; a caller checks `FailedAt != ""` the same way a boot log is read for the first error entry.

### Step 3: `Sequence`, the hand-off loop

**What this code does, in plain words:** it runs the steps one by one; the first one that fails stops the loop, and the result says where it stopped.

**Concept.** This is [[ROM, Flash, Firmware and the Boot Process#3 How it works|the boot flowchart]] as code: a plain `for` loop over an ordered slice, returning the instant something fails. The alternative design — collecting every stage's result and returning them all — was rejected deliberately: a real boot never runs the bootloader after POST has failed, so the code shouldn't either.

```go
// Sequence runs stages in order, stopping at the first failure - exactly
// like a real boot: a POST failure never lets the bootloader run, a
// bootloader failure never lets the kernel run.
func Sequence(stages []Stage) Result {
	var r Result
	for _, s := range stages {
		if err := s.Run(); err != nil {
			r.FailedAt = s.Name
			r.Err = fmt.Errorf("boot: stage %q failed: %w", s.Name, err)
			return r
		}
		r.Completed = append(r.Completed, s.Name)
	}
	return r
}
```

**How it works.**
1. The loop visits `stages` in slice order — the caller encodes the real ordering (POST, find-device, bootloader, kernel, init) simply by the order it builds the slice in.
2. `s.Run()` is called synchronously; its error is checked immediately, so a failing stage can never let a later one start — there is no goroutine or channel here because real boot stages are strictly sequential, not concurrent.
3. `fmt.Errorf("... %w", err)` wraps the underlying error so a caller can still `errors.Is`/`errors.Unwrap` down to the original cause, the same way a POST failure code still identifies the specific subsystem that failed.
4. On success, the loop falls through to `return r` with `FailedAt` and `Err` left at their zero values — an explicit "all clear," not an absence of information.

## Tests 🟡

### `TestSequenceAllStagesSucceed`

| Property it proves | Why it matters |
|---|---|
| All five stages run, in order, when every stage succeeds | This is "Scenario A" from the theory note's worked example — the happy path a healthy machine takes every time it boots |

| Input | Expected `Completed` |
|---|---|
| 5 stages, all `Run` return `nil` | `["POST", "find-boot-device", "bootloader", "kernel", "init"]`, `FailedAt == ""` |

```go
package boot

import (
	"reflect"
	"testing"
)

func TestSequenceAllStagesSucceed(t *testing.T) {
	stages := []Stage{
		{Name: "POST", Run: func() error { return nil }},
		{Name: "find-boot-device", Run: func() error { return nil }},
		{Name: "bootloader", Run: func() error { return nil }},
		{Name: "kernel", Run: func() error { return nil }},
		{Name: "init", Run: func() error { return nil }},
	}

	got := Sequence(stages)

	want := []string{"POST", "find-boot-device", "bootloader", "kernel", "init"}
	if !reflect.DeepEqual(got.Completed, want) {
		t.Fatalf("Completed = %v, want %v", got.Completed, want)
	}
	if got.FailedAt != "" || got.Err != nil {
		t.Fatalf("expected no failure, got FailedAt=%q err=%v", got.FailedAt, got.Err)
	}
}
```

A failure here would mean `Sequence` either stopped early on a healthy run, or lost the ordering of `Completed` — either one would misreport a clean boot as broken.

### `TestSequenceStopsAtFirstFailure`

| Property it proves | Why it matters |
|---|---|
| A failing stage halts the loop; no later stage's `Run` is ever called | This is "Scenario B" — a missing boot device must never let the bootloader stage run, just as a real firmware never hands off after POST fails |

| Input | Expected result |
|---|---|
| POST succeeds, `find-boot-device` fails, `bootloader` would set a flag if it ran | `FailedAt == "find-boot-device"`, `Completed == ["POST"]`, the flag stays `false` |

```go
func TestSequenceStopsAtFirstFailure(t *testing.T) {
	ranAfterFailure := false
	stages := []Stage{
		{Name: "POST", Run: func() error { return nil }},
		{Name: "find-boot-device", Run: func() error { return errors.New("no bootable device") }},
		{Name: "bootloader", Run: func() error { ranAfterFailure = true; return nil }},
	}

	got := Sequence(stages)

	if got.FailedAt != "find-boot-device" {
		t.Fatalf("FailedAt = %q, want %q", got.FailedAt, "find-boot-device")
	}
	if ranAfterFailure {
		t.Fatal("a later stage ran after an earlier stage failed")
	}
	if len(got.Completed) != 1 || got.Completed[0] != "POST" {
		t.Fatalf("Completed = %v, want only [POST]", got.Completed)
	}
}
```

A failure here would mean a later stage ran despite an earlier one failing — the Go equivalent of a bootloader starting after POST reported a fatal hardware error, which should never happen.

**Measured output** (Go 1.24.4, darwin/arm64, scratch module, 2026-11-09):

```text
$ go vet ./boot/...
$ go test -race ./boot/...
ok  	cs1scratch/boot	0.311s
```

> 🟡 → 🔴 **You now know** the code and the two scenarios its tests prove. **Next comes the advanced part:** the small edits that would silently break the "halt on first failure" rule or lose information about what failed.

## Pitfalls in the code 🔴

- **Forgetting `return r` after a failure.** If the early return were dropped, the loop would keep calling later stages' `Run` even after one failed — silently turning "halt on failure" into "best effort," which is exactly the bug `TestSequenceStopsAtFirstFailure` exists to catch.
- **Losing stage order.** `Completed` is a slice specifically so order is preserved; swapping it for a `map[string]bool` would make "which stage failed first" unanswerable from the result alone.
- **Swallowing the underlying error.** Wrapping with `%w` (not `%v`) keeps the original error inspectable via `errors.Unwrap`/`errors.Is`; using `%v` would flatten it to a string and lose that.

## Exercises 🔴

1. Add a `Retries int` field to `Stage` so a stage is re-run up to `Retries` times before the whole sequence halts (mirroring a recoverable POST warning). Predict which existing test still passes unchanged.
2. Change `Sequence` to continue past a failure, collecting every error that occurred, and work out why this would misrepresent a real boot (hint: what should "failed at bootloader" even mean, if the bootloader ran after POST failed?).
3. Add a `Timeout` per stage and make `Run` get called with a context; predict what `Result` should contain if a stage times out rather than returning an explicit error.

## Self-check 🟢🟡

🟢 Easy

> [!question]- What does `Sequence` do when a stage returns an error?
> It stops immediately and records that stage as `FailedAt`; later stages never run.

> [!question]- On a clean boot, what are `FailedAt` and `Err`?
> Empty string and `nil`.

> [!question]- Why is `Completed` a slice?
> To keep the order, so you can see exactly how far the boot got.

🟡 Medium

> [!question]- How does the failure test prove the bootloader never ran?
> The bootloader's `Run` sets a flag; the test checks the flag is still `false`.

> [!question]- Why wrap errors with `%w` instead of `%v`?
> `%w` keeps the original error reachable by `errors.Is`/`errors.Unwrap`; `%v` turns it into plain text.

> [!question]- Why is there no goroutine in `Sequence`?
> Real boot stages are strictly one after another; running them in parallel would break the hand-off rule.

## Links

- **Theory:** [[ROM, Flash, Firmware and the Boot Process]]
