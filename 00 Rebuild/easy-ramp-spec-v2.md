# Easy-ramp spec v2: make the BODY easy, not just the intro (owner request, 2026-11-21)

Pass 1 (easy-ramp-spec.md) added a level box, a "From zero" block, heading tags and "In plain words" lines. The owner still finds the notes too hard: the body sections jump straight into tough words, and some basic things a beginner needs are missing. Pass 2 fixes the BODY so a reader can climb basic -> medium -> advanced without getting stuck.

Rules: ADD, do not delete existing content, code, tables or diagrams. Exception: you may remove an exact word-for-word duplicate paragraph. Keep frontmatter, file names and wiki-links. Every new sentence: everyday English, short, one idea, no new unexplained jargon, round numbers.

For EVERY topic note (skip `*MOC.md`, `*.excalidraw.md`, files under `00 Rebuild/`, `00 Home/`):

## A. Before-you-start box (top, right after the level box)
> [!note] Before this note
> One line per prerequisite from frontmatter `prereqs`: `[[Note]]`: what you need from it, in plain words (e.g. "[[TCP]]: data travels as a reliable stream of bytes"). If there are none, write "Nothing. This note starts from zero."
Skip if the note already has this box.

## B. Jargon sweep (the biggest fix)
Read the whole body. For EVERY technical term that a beginner would not know, the FIRST time it appears in the body, make sure it is explained right there:
- add a short plain gloss in parentheses after it, e.g. "**WAL** (a diary file the database writes to before changing the real tables)", or
- if it already appears in the "Words you need first" table, leave it.
Also add any missing important terms to the "Words you need first" table (keep the table under ~14 rows).
Do not gloss the same term twice. Do not gloss everyday words.

## C. Step-by-step ladder for every "How it works" subsection (section 3 or equivalent)
At the top of each `###` subsection in the mechanics section, after any existing "In plain words" line, add a short numbered walk-through:
**Step by step:**
1. ... (plain, concrete, with a tiny example: real names, small numbers)
2. ...
3-6 steps max. Then the original dense text follows as the "full detail". If the subsection already has a plain numbered walk-through, skip.

## D. Bridge into each harder level
- At the start of the first 🟡 section: a 2-3 sentence "🟢 → 🟡 You now know X. Next we open the box and see how it actually works." bridge.
- At the start of the first 🔴 section: same kind of bridge into the advanced part.

## E. Fix wrong level tags
If a section tagged 🟢 is actually dense (several unexplained terms, production details, vendor names), do NOT retag; instead insert at its top a 🟢 **Plain version:** paragraph (3-5 sentences) that says the same thing simply, then let the original follow.

## F. Fill missing beginner factors
Check the note has each of these. If one is MISSING, add a short section in plain words (place it sensibly, tag it):
1. **What problem it solves** (usually section 1). 
2. **A real-life example** from apps people use (Swiggy, WhatsApp, UPI, Netflix, BookMyShow…), 3-5 sentences.
3. **Common beginner mistakes** 🟢: 3-5 bullets, each "Mistake → why it's wrong → do this instead".
4. **When to use / when NOT to use** 🟡 (skip if trade-offs section already covers it clearly).
5. **Compare with the thing people confuse it with** 🟡 (a 2-4 row table), if such a thing exists.
6. **Self-check** 🟢🟡 at the end, before Links: 3 easy + 3 medium questions, each with a one-line answer in a collapsed callout `> [!question]- Q` / `> answer`.

## G. Diagrams
Where a mechanism is explained only in prose, add a tiny mermaid diagram (max ~6 nodes). Use plain labels.

## Lighter version for code-heavy notes (`* - Go.md`, LLD Practice, Go-language notes that are mostly code)
Do A, B (comments outside code blocks only; never change code), D, and F.6 (self-check). Add one "**What this code does, in plain words:**" paragraph before each big code block if missing.

## Done check per file
- ``` count even; no heading lost; frontmatter unchanged; level box still present once.
- Read the first 150 lines as a beginner: every term explained before or where it is used.
- Mark the file done by adding `easy-ramp: v2` to nothing (do not touch frontmatter); instead the presence of the "Before this note" box marks it done.
