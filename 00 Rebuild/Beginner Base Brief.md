# Beginner Base Brief

The owner says the notes are good but hard for a beginner. Too many long paragraphs. Do NOT dumb the note down and do NOT remove anything. Add a ramp at the start, and break up walls of text.

## 1. Add `## Start here: the basics` (right after the Core idea callout, before "Why it exists")

Goal: a beginner who knows only basic programming can read this section, then read the rest of the note.

- **The problem in one story** (3-5 short lines): an everyday situation where this topic matters. No jargon.
- **Words you need first**: a table `| Word | Plain meaning | Tiny example |` with 5-8 terms the note uses without defining (prerequisite terms too).
- **Picture it**: one simple Mermaid diagram of the big idea (simplest version, max ~8 nodes).
- **Analogy**: one real-world analogy, plus one line on where it breaks.
- **How the rest of this note builds up**: 3-5 bullets, basic → advanced, naming the sections ("First X, then Y, finally the SDE-3 deep dive on Z").
- End with `> [!tip] Remember` one-liner.

Keep it 30-60 lines. Correct facts only.

## 2. Split long paragraphs everywhere in the note

- Any prose paragraph over ~4 lines / ~60 words: split into 2-4 short paragraphs, or a numbered list of steps, or bullets, or a small table.
- Keep every fact, number and sentence meaning. Rewording only for flow. Never delete content, interview questions, code, or diagrams.
- Do not touch code blocks, Mermaid, or tables except to fix errors.

## 3. Go note (`<Title> - Go.md`, if it exists)

- Same paragraph splitting.
- Add `## Before the code` after the TL;DR: 3-6 bullets on what Go features the code uses (goroutines, interfaces, generics, context...) each with a one-line meaning, and what to run.
- Improve code only if clearly better: fix bugs, add short comments on non-obvious lines, add a missing test. Code must pass `go vet ./...` and `go test -race ./...` in a scratch module under your scratch dir (never in the vault). Paste real output if you change tests.
- Keep code share ≤ 50% and no block over 30 lines (linter rule).

## Checks
- Lint: `python3 -I "/Users/priyanshumidha/Documents/OBZEDIAN/00 Rebuild/tools/lint_notes.py" "<note>"` — fix every ✗.
- Do not change frontmatter except `updated: 2026-11-13`. Do not touch MOCs, tracker, or other notes.
- No edit-history wording ("added", "previously", "new section").
