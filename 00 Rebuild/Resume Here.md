# Resume Here

Last updated 2026-11-07.

## Folder status

| Folder | Status |
| --- | --- |
| All 20 folders (00 Home through 19 Interview & Career) | Done. All 398 tracker items are ticked, every MOC is written, and every old note is retired |

## To do

1. **Commit and push** if this hasn't been done yet.
2. **Decide what to do with the 138 old screenshots** still in `advance backend/` and `bytes GO complete thimh/` (see below).

## Open decisions for the owner

- Screenshot cleanup in the old `img/` folders: move them to `Assets/Legacy Screenshots` and delete the 4 that show faces, delete them all, or leave them.
- Obsidian must open `/Users/priyanshumidha/Documents/OBZEDIAN`, not the stale clone at `~/Downloads/NotePad`.
- Whether to store per-note depth ratings: a `rating:` frontmatter field, or a separate scorecard note.

## Lessons for the next run

- Agents run inside a Workflow are handed the user's latest chat message. They may act on it ("next 2" made writers write only 2 notes each) or refuse to work ("can we start again" made reviewers refuse). A "STANDING ORDER" line telling them to ignore it was not enough. Two fixes work:
  - Launch the workflow right after a neutral user message such as "start 16".
  - Use plain background Agent calls instead. They don't see chat, and that worked cleanly for the last 6 reviews.
- Keep each writer group to 2–3 notes when the notes are heavy on Go code.
- The Mermaid validator lives in scratch space and has to be reinstalled each session. Use `PATH=/opt/homebrew/bin:$PATH`, run `npm i mermaid@11 jsdom@24`, then copy `00 Rebuild/tools/validate_mermaid.mjs`.
- A note title containing `/` gets saved with `-` in the filename. The tracker title must match the filename.
