---
tags: [rebuild/process]
updated: 2026-11-02
---

# Writer Brief

> [!summary] The job
> Write depth-5 topic notes for the rebuilt vault with zero factual errors. Each note takes a beginner from the TL;DR to the level of an SDE-3 interview, with diagrams, concrete examples and tested code.

## Read first

1. [[Conventions]] for the rules.
2. [[Topic Note Template]] for the structure.
3. [[Consistent Hashing]] for the quality bar. It has:
	- measured numbers
	- diagrams of the real mechanism
	- Go code that is tested
	- a comparison table
	- real systems
	- a deep dive
	- 6 interview Q&As
4. Your notes' blocks in `00 Rebuild/Audit/` (search for the old note titles listed after `from:` in [[Rebuild Tracker]]):
	- **Must cover:** the minimum content list. Cover every item.
	- **Problems:** errors in the old notes. Never repeat them.
	- **Keep:** the owner's points, code or tables to carry over, corrected.
5. The old source notes, only to pick up owner content worth keeping. Never copy template filler.
6. For 🆕 topics there is no block. Use the "Gaps" and "New notes" parts of that audit's area plan, plus your own expertise, to build a complete basic-to-advanced outline.

## Write

- **File:**
	- Path: `<NN folder>/<exact tracker title>.md`, inside a subfolder when the title has one.
	- The H1 equals the file name.
- **Frontmatter:**
	- `tags`, `prereqs`, `related`, `sources`.
	- `level`: B → basic, I → intermediate, A → advanced.
	- `status: draft`.
	- `updated` (the date).
- **Sections:** follow the template. A depth-5 note normally has all of them; drop a section only if it truly doesn't apply.
- **Length:** usually 250–500 lines for topics, longer for practice problems. No padding, no generic sentences.
	- Length warnings from the linter are information only. **Never cut code, tests, SQL or facts to make a note shorter.**
- **Diagrams:** at least 2 Mermaid diagrams of this topic's mechanism:
	- `sequenceDiagram` for interactions and timelines
	- `stateDiagram-v2` for lifecycles
	- `erDiagram` for schemas
	- `flowchart` for flows
- **Worked example:** concrete numbers, SQL in the PostgreSQL 17 dialect, and Go 1.24 code where it helps.
- **Interview questions:** 5–8 `> [!question]-` callouts with crisp 2–5 line answers. Include at least one trap question.
- **Links:**
	- Link only to written new notes or planned tracker titles, using the exact title text. Never link legacy notes.
	- Put links inline where they help, plus a `## Links` section (Before this / Next / Compare with).
- **Never:** screenshots, HTML, `[[` inside code, or code fences without a language.

## Accuracy rules

- If you are not sure a fact is right, check it or leave it out.
- Name the version for version-specific behaviour, for example "PostgreSQL 17" or "since Go 1.22".
- Do not invent benchmarks, company anecdotes or quotes.
- Every number must be one of three kinds:
	- **measured:** say how
	- **documented:** add the source to `sources`
	- **an estimate:** label it as one
- PostgreSQL cannot be run in this environment. Label every query result or `EXPLAIN` output **"representative output (PostgreSQL 17)"**, and keep it plausible and internally consistent: node types, row estimates, costs, timings.
- Go code must pass `go vet`, and logic code must ship with a test that passes `go test -race`.
	- Build it in a scratch module outside the vault, in the scratch directory given in your task.
	- The code in the note must be exactly the code you tested.
	- `github.com/jackc/pgx/v5` may be used; downloading modules is allowed. Running downloaded binaries or databases is not.

## Verify each note before you report

1. `python3 -I "00 Rebuild/tools/lint_notes.py" "<note>"` passes. Also fix its `~` warnings.
2. `node <scratch>/tools/mermaid/validate.mjs "<note>"` reports every block OK.
3. The Go code compiles and its tests pass.
4. Every Must-cover item and every Problem from the audit block is ticked off.

## Do not

- Edit the tracker, MOCs, Home, other writers' notes or legacy notes.
- Delete anything, touch `.obsidian`, or run git.

## Report (max 25 lines)

Give one line per note:
- path
- line count
- number of diagrams
- Go: which tests, and whether they passed
- must-cover: all, or which items are missing
- audit errors fixed
- anything uncertain, marked `verify:`
