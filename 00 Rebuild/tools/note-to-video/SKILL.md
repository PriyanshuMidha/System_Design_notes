---
name: note-to-video
description: Turn ANY topic or note from this Obsidian vault into a video: a short 3D reel (30-45 s, vertical) and/or a long plain-language story video with a different voice per character. USE THIS SKILL WHENEVER the user gives a topic, note name, or says "make a video / reel / story on X" (examples "DNS", "CDN and Edge video", "API Error Handling", "reel for TCP"). Flow - read the note, write a plain-language summary and a script for approval, build, preview, render MP4 and subtitles, report.
---

# note-to-video (story mode)

The user gives a **topic**. You do the rest: read the note, invent a story with characters, write the voice script, animate it in a world, render an MP4 with a different voice per character, and report. No paid services: Chrome draws, `edge-tts` speaks, `ffmpeg` joins.

## Standing rule: a topic means use this skill

Whenever the user gives a topic (a note name, a topic from a folder, "API X", "reel for Y"), invoke this skill without being asked. Default deliverables per topic, unless the user says otherwise:
1. **Scripts first** (reel script + long-video outline), shown for approval. Do not build before approval.
2. **Reel** (30 to 45 s, vertical, real 3D, one continuous narration, own independent setting).
3. **Long video** (about 18 min, plain language, story with conversational characters), built by a background agent while the reel is built in the main thread.
Then report paths, lengths, sizes, pronunciation words to check, and ask whether to commit (sources only; MP4s stay out of git, they are over GitHub's 100 MB limit).

Files in this folder:
- `story_engine.js`: seek-based SVG animation engine (characters walk, blink, talk, camera, tweens, chapter cards, code panels).
- `story_lib.js`: shared helpers (`H`): world, buildings, cast, evidence cards, board, interview, summary, read-next, end title.
- `story_build.py`: voices, timeline, parallel frame render, ffmpeg.
- `templates/`: `script.txt`, `scenes.js`, `cast.json` starting points. `new_story.py "<Topic>"` copies them into `Videos/<Topic>/story/`.
- Reference videos in `Videos/`: *Network Debugging* (detective story, the model to copy) and *CDN and Edge*.

## One-time setup

```bash
python3 -m venv ~/.venvs/note-to-video
~/.venvs/note-to-video/bin/pip install edge-tts playwright numpy
```
Needs Google Chrome in /Applications, `ffmpeg`, internet (for the voices).

## The workflow (do all of it unless the user asks to stop at the script)

1. **Find and read the note** (`02 Networking & Web/...` etc.) and its `- Go` note. Read every section: why, mental model, how it works, worked example, variants, trade-offs, production failures, monitoring, deep dive, interview questions, cheat sheet, links. Facts come from the note only.
2. **Plan the story** (see "Story standard" and "Plain language and a clean screen": write the 5-line plain summary first). Decide: the problem (plot), the hero, one character per real part of the system, a street of places, a progress prop (case board).
3. **Scaffold:** `python3 "00 Rebuild/tools/note-to-video/new_story.py" "<Topic>"`.
4. **Write `script.txt`** (voice only, `id | SPEAKER | tone | text`, scenes as `== s1 Title`). Order easy to advanced. Spell hard words as they sound (`C D N`, `three oh four`, `slash twenty four`, `S N I`). Check coverage against the note's headings before moving on.
5. **Write `cast.json`** (speaker to voice). Use only these voices, they exist: `en-US-EmmaMultilingualNeural` (narrator), `en-US-AriaNeural`, `en-US-JennyNeural`, `en-US-AvaNeural`, `en-US-AvaMultilingualNeural`, `en-US-GuyNeural`, `en-US-ChristopherNeural`, `en-US-EricNeural`, `en-US-RogerNeural`, `en-US-AndrewMultilingualNeural`, `en-US-BrianMultilingualNeural`, `en-GB-RyanNeural`, `en-AU-NatashaNeural`, `en-IN-NeerjaExpressiveNeural`. (Davis, Tony and William do not exist.) Rate and pitch per speaker make them distinct.
6. **Voices first:** run `--voices` (see commands). It prints the length. Over about 20 minutes is long; offer to split.
7. **Write `scenes.js`** from the template. One `blk(firstLine, nextSceneFirstLine, () => {...})` per scene. Time everything to spoken phrases with `A('l12','phrase')`. A phrase must appear in that line's text (apostrophes split into words: `Ava's` is `ava`, `s`). The preview prints `PHRASE NOT FOUND` for mistakes. Entity ids must be unique across the whole file.
8. **Preview stills** across every scene, check them (build contact sheets, see below), fix overflow and overlaps, and confirm no earlier points are left on screen when a new point appears.
9. **Render** in the background (about 2 to 2.5 minutes of rendering per minute of video), then verify with `ffprobe`.
10. **Report:** path, length, chapters, what was left out, ask for mispronounced words (the voice cannot be checked by Claude).

## Commands

```bash
P=~/.venvs/note-to-video/bin/python; T="00 Rebuild/tools/note-to-video/story_build.py"; D="Videos/<Topic>/story"
$P $T "$D" --work <scratch> --voices                               # synthesize voices, print length (cached by text)
$P $T "$D" --work <scratch> --preview 30,120,400                   # PNG stills at those seconds, prints PHRASE NOT FOUND / PAGEERROR
$P $T "$D" --work <scratch> --out "Videos/<Topic>" --name "<Topic> Story"   # full render: mp4 + srt
```
Contact sheet from stills: ffmpeg `hstack/vstack` of four 960x540 scaled stills into one image, then look at it.
Run long renders with `run_in_background`. `--voices` needs a `scenes.js` file to exist only for preview and render, not for `--voices` itself.

## Story standard

Feedback from the owner: dimmed diagram panels with a thin cast feel like slides. Every video must be a story.
- **A plot with stakes** that runs from the first scene to the last (a case, a rush, a crisis) and ends solved. Each concept is a clue or event in the plot, told by the character who owns it.
- **Each real part of the system is a character standing in a place.** The hero walks the street, the camera follows. The narrator only names the real terms.
- **Stay in the world.** Show output as small evidence cards (`ev`) and props, and keep a progress prop (case board `board(...)`) that changes. Do not dim the screen for tables.
- **Always include:** a hook in the first 10 seconds, deep dive, trade-offs, failures and fixes, monitoring, an interview round (a rookie asks, the hero answers), a seven-point summary ending with one line to keep, and a "where to go next" card (note, Go note, before, after, compare).
- **Chapter cards** between scenes are automatic (from the `== sN Title` headings). Use a clear heading for each.
- **Gaps:** the builder leaves a 2.8 second pause at every scene change.

## Long videos: real 3D, new storyline per version, concept level only (MANDATORY, owner feedback 2026-11-15)

The owner reviewed the API long videos v1, v2 and v3 and found them identical in feel: not 3D, same script, same narration, and too technical (code and templates shown). Rules from now on:

1. **Real 3D, like the reels.** Long videos are Three.js 3D scenes (landscape 1920x1080), not 2D SVG diagrams. Each chapter is a 3D set with depth, lighting, a moving camera, low-poly 3D characters that stand in the scene, and physics demos where they help (collapse, snap, flow). The 2D SVG story engine is retired for new long videos.
2. **Every new version needs a genuinely new storyline.** A new version (v2, v3...) of a topic changes the setting, characters, plot and narration, not just the dialogue wording. Never re-voice the same script and call it new. Ask what the previous version looked like and make this one different.
3. **Concept level only. No code.** Do not show or read code, config files, JSON/YAML/OpenAPI templates, function names or tool commands. Skip the Go code chapter even if the note has one. Explain the idea with a picture, an analogy and a 3D demo. Tool names may be said at most once, in passing.
4. **Shorter.** Aim for 12 to 15 minutes, about 14 chapters, one idea each.
5. **Script first.** Show the new storyline and chapter list for approval before building.

## Plain language and a clean screen (MANDATORY, owner feedback)

The notes are technical. The video is not allowed to be. A viewer must understand WHAT is happening and WHY from the story alone, even if they never read the note.

**Script and story rules**
1. **Summarize before you write.** Read the note, then write a 5-line plain summary first: what is the problem, what is the idea, how does it work, what goes wrong, what to remember. Build the story from that summary, not from the note's wording. Never paste note text into the script.
2. **One idea per scene, in simple words.** Each scene answers: what is happening, and why does it matter, in everyday language. Introduce a technical term only after the idea is clear, name it once, then keep using the plain word next to it ("a cache, a saved copy close to you").
3. **Round the numbers.** Say "1 millisecond", "about a quarter of a second", "a few seconds", "twice as fast". Never "0.34234 ms", "304 bytes", "99.97 percent". Exact figures stay in the note, not in speech or on screen. One number per scene at most.
4. **Few terms per scene.** Aim for 1 to 3 new technical words per scene. If a scene needs more, split it or move the extra terms to the deep dive.
5. **Story first, jargon second.** The plot (who wants what, what goes wrong) must be understandable with every technical word removed. Test: read the script aloud skipping the technical words; the story should still make sense.
6. **Say it in the story's world.** Prefer "the ship's papers" to "the request header", then connect once: "papers, that is the header".
7. **Recap often.** End each scene with one plain sentence: "So the rule is: ...".

**Screen rules (no overlap, no leftovers)**
1. **One thing at a time.** Items that appear in order (point 1, 2, 3 ...) must never pile on top of each other or on earlier items.
2. **Clear before you add.** Every card, chip, label or list item must be removed (faded out, `tw(id, t, 0.3, {o:0})` or `hide`) before the next group appears in the same area. When point 6 arrives, points 1 to 5 are already gone (or moved up if the list scrolls).
3. **Max 4 items visible in one area.** If a list is longer than 4 lines, show it as pages: show 1 to 4, fade out, show 5 to 8. Keep each card line short (under about 60 characters).
4. **Give every item its own slot.** Compute positions from the item index (`y = top + i * rowHeight`); never place two items at the same x, y.
5. **End every scene with a clean screen.** Hide all evidence cards and chips at the end of the scene (`End(line)` time), before the chapter card.
6. **Check the stills for overlap and leftovers.** In the preview, look at the last moment of each scene and at the busiest moment: no text over text, nothing left from an earlier point.

## Reels and natural dialogue (MANDATORY, owner feedback 2026-11-15)

The owner rejected the first API reels and the character voices. Rules:

**Reels (30 to 45 s, vertical)**
1. **Real 3D, not a flat diagram.** Use a Three.js scene with depth, lighting, real objects with volume, and a camera that moves the whole time (dolly, orbit, fly-along, push-in). A fixed camera on a flat layout is not acceptable. No text boxes or labels doing the work of the animation.
2. **Interactive.** Objects must react to each other: things snap, open, collide, collapse, light up when touched. The viewer should see cause and effect, not captions describing it.
3. **One continuous narration take.** Write the narration as ONE flowing spoken paragraph (about 85 words for 35 s), synthesized as a single audio file with no pauses between sentences. Never split into separate lines with gaps. Time the animation to the voice, not the voice to the animation. Narrator voice is Andrew (en-US-AndrewMultilingualNeural, rate about +4%): the owner likes its speed and flow.
4. **Less on screen.** Only a few big words, at most. No paragraph captions repeating the narration.
5. **Each reel is independent.** It does NOT have to stay in the Orbit Station / space world. Pick whatever setting explains the idea best (a bridge, a kitchen, a city, a toy factory). Reuse a storyline only when it genuinely fits.
6. **Script first.** Show the reel script (narration paragraph plus the shot list) and wait for approval before building.
7. **Narrator only (owner, 2026-11-21).** No character voices and no talking or acting characters in reels. 3D objects and graphics explain everything. Fast pace (narrator about +8%, a visual change every 2 to 3 s), everyday words and everyday analogies, 45 to 60 s. It must not look or sound like the long story videos.

**Character dialogue in long videos**
1. Characters must sound like people talking, not reading a script: contractions, short sentences, interruptions, reactions ("wait", "hold on", "oh no"), questions answered with questions, quick back and forth of 3 to 8 words. No lecture-style paragraphs from characters.
2. The narrator may explain; characters react, argue, joke, worry, and discover things together.
3. Vary tone and pitch per line (question, surprise, calm) and keep lines short so the synthesized voice stays natural.
4. Read the dialogue aloud before synthesis: if it sounds like a textbook, rewrite it.

## Production practices (from web research, 2026-11-15)

What creators of 3D explainer reels do, and what this skill must also do (sources: Revid "Claude 3D animation", JQ Visions motion-graphics repos, BobbyBroccoli workflow, Cursa storyboard guide, YumYum explainer process, ElevenLabs v3 docs, PromptQuorum Piper vs Kokoro):

1. **Lock the audio first, then animate to it.** Synthesize the narration as one take, get word timestamps, and key camera moves and object events to those timestamps. Never drop a finished voice onto fixed beat times.
2. **Pace by words.** About 75 words for 30 s, 150 for 60 s. One idea per beat. If the topic needs more, make a series of reels.
3. **Motivated camera.** Every camera move must reveal or emphasize something (push-in on the detail, orbit the problem, fly-along with the moving object). A near-static camera makes the 3D pointless.
4. **Real physics for interaction.** Collisions, collapse, snapping and stacking use a physics engine (for example cannon-es or Rapier) stepped at a fixed timestep with a deterministic start, precomputed per frame, so seeking to any frame is repeatable. Do not fake collapses by hand-keying.
5. **Sound layer.** Add sound effects at every snap, clang, whoosh and collapse, and a soft music bed under the narration. Narration only is not enough. Beat-sync with audio analysis (librosa) only for structural moments.
6. **Better models and finishing.** Prefer modeled assets (glTF, or Blender via Blender MCP for characters and rigs) over plain cylinders and boxes. Add bloom, depth of field, outlines and grain sparingly; compare every shot with effects off and remove any effect that hides information.
7. **Storyboard, then animatic, then render.** Show stills of the key shots, then a low-resolution motion test with temporary voiceover and placeholder camera moves. Render the full video only after approval.
8. **Render-compare-fix loop.** Render stills, view them, compare with the intent (or a reference), fix, repeat. Check frame rate after encoding.
9. **Simplest tool wins.** Flat typography, charts and diagrams stay SVG/Canvas; 3D only when depth carries the idea.
10. **Technical review.** Check every claim against the note; pronunciation guide for odd terms; ask the owner to flag mispronounced words.
11. **Voices.** Narrator = Andrew (en-US-AndrewMultilingualNeural, +4%). edge-tts has no emotion control, so for character dialogue write short conversational lines and vary rate/pitch per line; test a local Kokoro voice sample as a candidate for more expressive dialogue before the next long video, and consider ElevenLabs v3 (audio tags, text-to-dialogue) only if the owner approves a paid service.
12. **Reuse before building.** Check awesome-claude-video-skills, Lemo Opuscar, Video ShotCraft and the Remotion/HyperFrames ecosystem for an existing piece before writing a new one.

**Reel tooling lives in `reel3d/` (see its README.md):** copy it to a scratch folder per reel, edit `reel.html`, `tts.py`, `events.py`, `sfx.py`, then `build_page.py`, `shot.py`, `render.py`. It already has Three.js, cannon.js physics, bloom, shadows, word-synced events, synthesized sound effects and a music pad. Long 3D videos should extend this same engine (scenes per chapter, 3D characters), not the old 2D SVG engine.

Status of the reel pipeline: the first Three.js reels (CDN, API series) lacked items 1 to 7 and were rejected. `API Contract Reel v3 (bridge)` is the first reel made with the upgraded pipeline (physics, word-synced camera, sound).

## Animation vocabulary (`scenes.js`)

`H` gives: `world(width)`, `bld(id,x,colour,sign,emoji,scale)`, `cast(cfg, spots)`, `views({...})`, `cam(t,dur,'name')`, `walk(id,t,dur,x)`, `pulse(id,t)`, `ask(id,text,colour,x1,y1,x2,y2,t,dur)` (a flying message), `wl(id,text,colour,x,y,t)` (world label), `C(id,text,x,y,colour,line,phrase,width,offset)` (chip), `P(...)` (row box), `ev(id,title,lines,x,y,w,colour,times,tEnd)` (evidence card), `board(title,items,x,y,t)` returns `stamp(i,t,ok)`, `qa(rows)`, `summary(title,rows)`, `readNext(line,items)`, `endTitle(title,sub,line)`, `wave(id,t)`, `line/draw/fly` for drawn lines and paths, `ring` (countdown). Engine: `S.codePanel`, `S.card`, `S.portrait`, `camTw`.
Gotchas: per entity, tweens must be authored in time order. Keep cards inside x 30 to 1500 so the board (top right) is free. Do not reuse ids. A line id used in `blk(l0, lEnd)` must exist.

## Cost and time

Money: none. Tokens per video: about 60 to 90 thousand. Wall time: voices 3 to 6 minutes, render 2 to 2.5 times the video length.

## Known limits

- Animation is tween-based: walking, flying messages, drawn lines, popups, camera moves. No free-form physics.
- The voice is a neural voice, not a human. Fix a word by respelling it in `script.txt` (only changed lines are re-synthesized).
- `Videos/` MP4s are large; decide before committing them to git.
- The older slide-deck builder (`build_video.py`, `slide.css`, storyboard.html) still exists but story mode replaces it.
