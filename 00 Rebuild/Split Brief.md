# Split Brief: theory note + Go note

The owner reads these notes to learn. Their feedback was that each note is one long page that mixes theory, code and interview prep together, with too few diagrams. The theory gets buried.

The fix is to split every topic into two notes and add more diagrams and more theory.

## The two notes

### 1. Theory note: `<Title>.md` (keep the existing file and name)

- **Purpose.** It teaches the concept and needs no code to be understood.
- **Short snippets.** Keep a snippet of 10 lines or fewer only where it is the clearest way to show an idea, such as a SQL statement or a 3-line Go signature. Move everything longer to the Go note.
- **Diagrams.**
  - At least 5 Mermaid diagrams, ideally 6–8: one for every major idea.
  - Diagrams show this topic's real mechanism: sequences, state machines, data-structure layouts, timelines, before/after comparisons, decision trees.
  - Never draw generic box charts.
  - Place each diagram right next to the paragraph it explains.
- **Theory.** Add more of it. Separate ideas into short `###` subsections, each with:
  - one idea,
  - a plain-words explanation,
  - a diagram or table,
  - one concrete example with numbers.
- **Breaking up text.** Break up long paragraphs. Use tables for comparisons.
- **Structure.** Keep the standard order:
  1. TL;DR, then the Core idea callout.
  2. Why it exists.
  3. Mental model.
  4. How it works.
  5. Worked example. Keep it conceptual: trace numbers or a request step by step, with a diagram, and end it with a one-line pointer: "Runnable Go version: [[<Title> - Go]]".
  6. Variants and comparison.
  7. Trade-offs.
  8. In production.
  9. Deep dive.
  10. Interview questions (keep all of them; at least 4).
  11. Cheat sheet.
  12. Links. Add a link to `[[<Title> - Go]]`.
- **Whiteboard version.** Keep it, before the deep dive.

### 2. Implementation note: `<Title> - Go.md` (new file in the same folder)

- **Frontmatter.**
  - Copy tags, level, `status: draft`, `prereqs`, `sources` and `updated` from the theory note.
  - Add `type: implementation`.
  - `related` must include `"[[<Title>]]"`.
- **H1.** `# <Title> - Go`.
- **TL;DR.** One `> [!summary]` callout saying what the code demonstrates, linking `[[<Title>]]`.
- **Sections.**
  1. `## What this code shows`: map each piece of code to the theory concept, with a link back to the theory note.
  2. `## Setup`: module layout, Go 1.24, dependencies, how to run.
  3. `## Code`: all the Go code (and long SQL) moved from the theory note, unchanged except where it doesn't compile. Split it into `###` steps with a sentence of explanation before each block.
  4. `## Tests`: every test, plus the measured `go test -race` output.
  5. `## Pitfalls in the code`: code-level gotchas.
  6. `## Exercises`: 2–3 "change this, predict the result" tasks.
  7. `## Links`.
- **Diagrams.** One diagram of the code structure (packages/types, or call sequence) is welcome.

## Ease rules for theory notes

The owner asked for more theory, more detail, and easier understanding. Independent raters scored ease at only about 7/10 across the vault. Write the theory note so a learner can follow it alone.

- **Explain before you name.** Describe the problem in everyday words first, then give the technical term in **bold** with a one-line definition.
- **One idea per `###` subsection**, built from four pieces:
  1. **In plain words:** 2–4 simple sentences.
  2. **Picture it:** a diagram.
  3. **Example:** concrete numbers, or a step-by-step trace.
  4. **Why it matters:** one line on the real-world consequence.
- **An analogy for each hard idea,** for example a restaurant queue, a library catalog or a post office. Say where the analogy breaks down.
- **Step-by-step walkthroughs.** Number the steps for every mechanism, such as how a request flows or how a lock is acquired. Each step is one or two short sentences.
- **More depth, not more density.**
  - Add the "why" behind each rule.
  - Add the common misconceptions and correct them in a `> [!warning] Common mistake` callout.
  - Add "what happens if…" scenarios.
- **Short paragraphs:** 4 lines at most. Avoid long run-on sentences and dense jargon stacks.
- **Recap.** End each major section with a one-line `> [!tip] Remember` takeaway.
- **The level tag must match the content.** If the per-note hints say the level is wrong, fix the frontmatter `level`.

## Teaching rules for Go notes

The owner says the Go notes are "too much code". A Go note must teach, not dump code. At least half of its lines must be prose, tables or diagrams rather than code.

- **No code block longer than about 25 lines.**
  - Split long code into small pieces, such as one type, one function or one test.
  - Put teaching text between the pieces.
  - The full file can be repeated at the end in a folded callout, `> [!example]- Full file`, so it can still be copied in one go.
- **Before each block: a "Concept" paragraph (3–6 sentences).** It answers:
  - which theory idea this code implements, with a link to the exact section of the theory note (`[[<Title>#Section]]`);
  - why the code is shaped this way;
  - what alternative designs exist and why this one was chosen.
- **After each block: a "How it works" walkthrough.** A numbered list of the key lines, saying what each does and why. Point out Go-specific details: context, errors, mutexes, interfaces, generics.
- **A diagram for each step where it helps.** For example:
  - the call sequence;
  - the data layout, such as a document shape or key structure;
  - the state change, such as a row before and after;
  - the type relations.
- **Tests section.** For each test, before its code:
  - say what property it proves and why that property matters;
  - give the input → expected output as a table;
  - after the output, explain what a failure would mean.
- **"Design decisions" section** (new, after Code): a table of each choice made in the code, its alternative, and the trade-off.
- **"Running it" section.** Commands, then the real output, then a line-by-line reading of that output.
- **Keep all the code and all the tests.** This rule is about adding explanation and splitting blocks, never about removing code.

## Rules

- **Never lose content.** Every fact, code block, test, SQL statement and interview question from the original must exist in one of the two notes after the split. Before finishing, diff your memory of the original against the two notes.
- **Topics with almost no Go code** (fewer than 30 lines of Go in total): do not create a `- Go` note. Just raise the theory note to at least 5 diagrams with separated subsections.
- **The code must still compile.**
  - Copy the code into a scratch module under the scratch work directory you were given, never inside the vault.
  - Run `go vet ./...` and `go test -race ./...`.
  - If a test needs Postgres or Redis and they aren't available, keep the note's existing label (fake, sqlite or representative) and verify that it compiles.
- **Checks.** Run both checks on both notes and fix every ✗ and every Mermaid error.
  - Linter: `python3 -I "/Users/priyanshumidha/Documents/OBZEDIAN/00 Rebuild/tools/lint_notes.py" "<note>"`
  - Mermaid: `PATH=/opt/homebrew/bin:$PATH node /private/tmp/claude-502/-Users-priyanshumidha-Documents-OBZEDIAN/00fc1435-48e1-42f0-9888-340e4e0fbca2/scratchpad/tools/mermaid/validate.mjs "<note>"`
  - Mermaid labels with parentheses or special characters must be quoted, as in `A["text (x)"]`.
- **Status.** Set `status: reviewed` on the theory note and `status: draft` on the Go note; a second reviewer will check the Go note.
- **Writing style.** Clear, complete English sentences for a study guide. No edit-history text: never write "moved from", "the old note" or "previously".
- **Scope.** Edit only your assigned notes and their new `- Go` files. Do not touch MOCs, the tracker or other folders.
