---
tags: [home]
level: basic
status: reviewed
prereqs: []
related: ["[[Home]]"]
updated: 2026-11-04
---

# Conventions

> [!summary] The rules every note follows
> - One concept per note.
> - Notes go from basic to advanced.
> - Every claim is specific to the topic and correct.
> - Every diagram shows the real mechanism.
> - Every piece of code compiles.

## One concept, one note

- Each concept lives in exactly one note. Other notes link to it instead of explaining it again.
- Two angles on one idea can each get a note when both are real. For example, [[Rate Limiting - Algorithms and Distributed Design]] (system design) and the LLD rate-limiter practice problem (class design) link to each other.

## Folders and names

- The folders are numbered in learning order, from `01 CS Fundamentals` to `19 Interview & Career`.
- Each folder has one map note, `NN Folder MOC`, that lists its notes in order.
- File names:
	- Use plain Title Case with no typos.
	- Use ` - ` instead of `:`.
	- Start a name with "Go …" only in `04` and `06`.
- The H1 heading equals the file name.

## Frontmatter

```yaml
tags: [databases, transactions]   # folder topic + subtopics
level: intermediate                # basic | intermediate | advanced
status: draft                      # draft | reviewed | done
prereqs: ["[[Transactions and ACID]]"]
related: ["[[Locking - Optimistic vs Pessimistic]]"]
sources:
  - "PostgreSQL 17 docs, Transaction Isolation"
updated: 2026-11-02
```

**Status meanings:**
- `draft`: written.
- `reviewed`: passed an independent fact and code check.
- `done`: the whole folder passed its final checks.

## Note anatomy

Every topic note uses [[Topic Note Template]]. Leave out a section that has nothing specific to say; never fill it with generic text.

| Section | What goes in it |
| --- | --- |
| TL;DR | 1–2 sentences a beginner understands |
| 1. Why it exists | The problem, shown with one concrete scenario and numbers |
| 2. Mental model | The idea in plain words, plus one analogy |
| 3. How it works | The step-by-step mechanism, with at least one topic-specific diagram |
| 4. Worked example | A real request traced, real numbers, or Go code that compiles and has a test |
| 5. Variants and comparison | A table of the options: how each works, when to use it, what it costs |
| 6. Trade-offs and when not to use | Specific costs, and the cases where a simpler option wins |
| 7. In production | Real systems, failure modes with their fixes, and what to monitor |
| 8. Deep dive | Internals, edge cases, behaviour at scale |
| 9. Interview questions | 4–8 foldable `> [!question]-` callouts, each with a crisp answer |
| 10. Cheat sheet | 5–8 bullets you can revise in 60 seconds |
| Links | Before this, next, compare with |

**Depth 5** means a beginner can start at the TL;DR and an SDE-3 candidate still learns something from the deep dive.

## Diagrams

- **Mermaid** goes inside notes:
	- `flowchart` for flows
	- `sequenceDiagram` for requests between components
	- `stateDiagram-v2` for lifecycles
	- `classDiagram` for LLD
	- `erDiagram` for schemas
- **Excalidraw** is for hand-drawn sketches only. Export each drawing as SVG next to the source file so it shows everywhere.
- Never draw a generic "client → server → database" chart. Draw this topic's boxes and arrows.

## Code

- Use Go 1.24 and the standard library first.
- Every snippet must compile, and logic code ships with a test that passes under `go test -race`.
- SQL uses the PostgreSQL 17 dialect.
- When output wasn't run in this vault, label it "representative output" and say which version it represents.
- JavaScript appears only in `03 Frontend`.
- Keep scratch modules outside the vault.

## Numbers and facts

- Every number is one of three kinds:
	- **measured:** say how
	- **from documentation:** name the source in `sources`
	- **an estimate:** label it as one
- Version-specific behaviour names the version, for example "since Go 1.22" or "PostgreSQL 17".

## Images

- Images live in `Assets/Images/<NN folder>/`. Drawings live in `Assets/Drawings/`.
- Third-party screenshots never go into notes meant for sharing. Redraw the idea as a diagram instead.

## Links

- Add links by hand, by meaning. Never auto-link keywords.
- Link to the new notes only, never to legacy folders.
- A link to a planned note that is not written yet is fine: it resolves once the note exists.

## Checks before a note counts as done

1. `python3 -I "00 Rebuild/tools/lint_notes.py" <note>` passes.
2. Every Mermaid block parses (`00 Rebuild/tools/validate_mermaid.mjs`).
3. Every Go block compiles, and its tests pass.
4. Every error the audit listed for the source notes is fixed.
5. The note is listed in its folder MOC and ticked in [[Rebuild Tracker]].
