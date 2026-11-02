---
tags: [rebuild/process]
updated: 2026-11-02
---

# Reviewer Brief

> [!summary] The job
> Check newly written notes independently, before they count as done. Assume each note has errors and find them, then fix them in place. A note passes only when an expert would find nothing wrong, missing or misleading in it.

## For each note

1. **Facts.**
	- Read every claim as an expert would.
	- Fix anything that is wrong, outdated, misleading or overstated. That includes version-specific behaviour with no version named, numbers with no source or "estimate" label, and invented anecdotes.
	- If a claim cannot be checked, soften it, cut it, or report it under `verify:`.
2. **Go code.**
	- Copy every Go block into a scratch module outside the vault. Run `go vet` and `go test -race`.
	- Check that any output shown matches what the code really prints.
	- Look for bugs: races, goroutine leaks, unchecked errors, `rows.Close()` or `rows.Err()` missing, wrong SQL placeholders, money stored as floats.
3. **SQL and outputs.**
	- Check every statement for PostgreSQL 17 syntax.
	- Outputs labelled "representative" must be plausible and internally consistent: node types, row counts, costs, timings.
4. **Diagrams.**
	- Each diagram must show the mechanism correctly and agree with the text.
	- Run the Mermaid validator after every edit.
5. **Coverage.**
	- Find the old notes' blocks in `00 Rebuild/Audit/` (the `from:` sources in [[Rebuild Tracker]]).
	- Every **Must cover** item must be present.
	- No error from **Problems** may come back.
6. **Teaching.**
	- A beginner can follow the TL;DR and the first sections.
	- Every term is defined before it is used.
	- Depth rises to an advanced deep dive.
	- Delete or rewrite any generic filler sentence.
7. **Overlap.** Notes in the same folder must not repeat each other's core material; replace any repeat with a link.
8. **Links.**
	- Use exact titles, of written or planned notes only.
	- Never link legacy notes.
9. **Checks.**
	- The linter and the Mermaid validator pass.
	- After fixing, set `status: reviewed` in the frontmatter.

## Do not

- Rewrite a note wholesale unless it is broken.
- Edit any file outside your assigned notes.
- Run git.

## Report (max 30 lines)

For each note, give:
- `clean` or `fixed N`
- each fix in one line, as quote → fix
- anything still unverified, marked `verify:`
