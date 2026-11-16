# Easy-ramp spec (owner request, 2026-11-16)

Goal: every note must be readable by a beginner WITHOUT watching a video. Start basic, then mid, then advanced, in the same file. ADD, do not rewrite; never delete existing content, code, tables or diagrams. Simple everyday English for everything new.

Reference example (already done, copy its feel): "02 Networking & Web/CDN and Edge.md".

For EVERY topic note (skip `*MOC.md`, `*.excalidraw.md`, templates):

1. **Level guide box** right under the first `## Start here` heading (or under the H1 if no such section):
   > [!info] How to read this note (pick your level)
   > - 🟢 New to this? ...which sections to read and where to stop
   > - 🟡 Know the basics? ...which to add
   > - 🔴 Interview / SDE-3 prep? ...which to add
   Mention that headings are tagged 🟢🟡🔴.
2. **"From zero, in 60 seconds" 🟢 block** right after that box: 5-10 short plain sentences that explain the topic to someone with no background. One idea per sentence. Introduce at most 2-3 technical words, each bolded and explained in the same breath. Include 1-2 tiny mermaid diagrams (simple flowchart, max ~5 nodes) showing before/after or the core picture. End with "the rest of this note is just these N questions" list.
3. **Tag every `## ` section heading** with 🟢 🟡 or 🔴 (typically: basics/why/mental model/cheat sheet = 🟢; how it works/worked example/variants/trade-offs = 🟡; production/deep dive/interview = 🔴).
4. **"In plain words:" opener** (one bolded line, everyday language, an analogy when possible) at the start of every dense `### ` subsection (roughly: any subsection that starts with jargon, a table or code).
5. **Simplify truly heavy sentences** where they block understanding: split long sentences, prefer common words ("use" not "utilize"). Only touch sentences that are genuinely hard; do not churn the whole file.
6. **More diagrams**: if a section explains a flow/comparison in prose only and has no diagram, add a small mermaid diagram. Target 2-4 new diagrams per note, only where they truly help.
7. **Go companion notes (`* - Go.md`)**: lighter pass — level guide box, one "From zero" paragraph saying in plain words what this file teaches and how to read it, 🟢🟡🔴 heading tags, "In plain words" openers before big code blocks. Keep all code.
8. **Do not** change frontmatter except nothing, do not rename files, do not touch wiki-links, do not remove anything.
9. Verify after editing: file still has valid structure (headings intact, mermaid fences balanced: count ``` occurrences is even).

Tone for all new text: normal spoken English, short sentences, no formal words, no new unexplained jargon, numbers rounded.
