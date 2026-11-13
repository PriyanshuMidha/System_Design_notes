# Resume Here

Last updated 2026-11-09. The work was stopped on purpose, mid-run.

## Done

- **Rebuild.** All 20 folders are rebuilt and reviewed.
- **07 Databases split.** It is fully split into theory notes and `- Go` teaching notes.
- **New HLD notes (47).** All written and independently reviewed:
  - `11 System Design/HLD Decision Guides/` (13 notes): round guide, worked mock, decision guides, cheat sheet, Staff signals.
  - `11 System Design/HLD Concepts/` (6 notes).
  - 13 new case studies.
  - `14 Observability & SRE/Incident Playbooks/` (13 notes).
  - 2 security notes in 12: Website Is Hacked, and the Hardening Checklist.
- **Ratings and index.** [[Depth Ratings]] rates all 395 notes, and [[Study Index]] lists 420 topics.

## Done (2026-11-13): note-to-video skill

Skill source: `00 Rebuild/tools/note-to-video/` (SKILL.md explains setup and use; script first, then animated storyboard). `.claude/skills/note-to-video` is a symlink to it. First video: `Videos/CDN and Edge/`. Setup needs `pip install edge-tts playwright` in `~/.venvs/note-to-video`.

## Done (2026-11-13): story-mode video (CDN)

Story mode added to the skill: `story_engine.js` and `story_build.py` in `00 Rebuild/tools/note-to-video/`. First story: `Videos/CDN and Edge/story/` (script.txt, cast.json, scenes.js) and `CDN Story.mp4`. Waiting on the user's list of mispronounced words.

## Done (2026-11-13): beginner base rollout

All 420 theory notes have "Start here: the basics", and the whole vault passes lint.

### Original plan

Every theory note gets a "Start here: the basics" section and has its long paragraphs split. Go notes get a "Before the code" section. The rules are in [[Beginner Base Brief]].

- **Batches.** 77 batches of up to 6 notes. They live in the scratchpad file `base_batches.json`; to rebuild them, find every note that doesn't contain "Start here: the basics".
- **Done:** the pilot, Virtual Memory and Modular Monolith.
- **Running:** 01 CS Fundamentals.
- **Next:** 02 to 19, folder by folder.
- **How to run:** plain background `Agent` calls.

## Paused: the vault-wide split rollout

This splits every topic into an easier, deeper theory note plus a teaching Go note, following [[Split Brief]] and the per-note rater hints.

- **Batches.** 120 batches of 3 notes, listed in `00 Rebuild/tools/rollout_batches.json`. The hints are in `00 Rebuild/tools/hints.json`.
- **Rewritten but never reviewed:** batches 1–8 and 10–18, covering 01 CS Fundamentals, 02 Networking & Web and 03 Frontend. They were committed in `e443527`.
- **Interrupted:** batches 9 and 19–25. Their partial edits were stashed as `stash@{0}` ("interrupted rollout batches…"). Drop the stash; don't apply it. Rerunning those batches redoes them cleanly.
- **Not started:** batches 26–120.

### How to resume

1. Reinstall the Mermaid validator in the new session's scratchpad. Use `PATH=/opt/homebrew/bin:$PATH`, run `npm i mermaid@11 jsdom@24`, then copy `00 Rebuild/tools/validate_mermaid.mjs` to `validate.mjs`.
2. Copy `00 Rebuild/tools/vault-split-rollout.workflow.js`. Change its `SP` path to the new scratchpad and copy `rollout_batches.json` and `hints.json` there. Then run it.
   - Its reviewer stage compares each note with `git show HEAD:<path>`. For batches 1–18, HEAD already contains the rewrite, so for those batches review against commit `ca966ab` instead.
   - Alternatively, skip the writer for batches that are already rewritten.
3. **Run it with plain background `Agent` calls, or right after a neutral user message.** Workflow agents can read the latest chat message and act on it.
4. Afterwards:
   - Rebuild the MOC "Go code" links.
   - Run `python3 -I "00 Rebuild/tools/build_study_index.py" "$PWD"`.
   - Lint every folder.

## Optional next topics (from the coverage check)

- Behavioural and STAR story bank, leadership at SDE-3 (19).
- The DSA pattern catalog and DP (01).
- More LLD problems (17): chess, Stack Overflow, online judge.
- Kubernetes depth and AWS serverless (13).

## Open decisions for the owner

- **Screenshots:** about 138 old screenshots are still in `advance backend/` and `bytes GO complete thimh/`.
- **Obsidian:** it must open this folder, not `~/Downloads/NotePad`.
