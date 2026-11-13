---
name: note-to-video
description: Turn a topic or note from this Obsidian vault into a story-driven animated video with a different voice per character. Use when the user gives a topic ("make a video on DNS", "CDN and Edge story video", "note to video"). Flow - find the note, write a plot-driven voice script with a cast, build the world animation, preview, render the MP4 and subtitles.
---

# note-to-video (story mode)

The user gives a **topic**. You do the rest: read the note, invent a story with characters, write the voice script, animate it in a world, render an MP4 with a different voice per character, and report. No paid services: Chrome draws, `edge-tts` speaks, `ffmpeg` joins.

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
2. **Plan the story** (see "Story standard"). Decide: the problem (plot), the hero, one character per real part of the system, a street of places, a progress prop (case board).
3. **Scaffold:** `python3 "00 Rebuild/tools/note-to-video/new_story.py" "<Topic>"`.
4. **Write `script.txt`** (voice only, `id | SPEAKER | tone | text`, scenes as `== s1 Title`). Order easy to advanced. Spell hard words as they sound (`C D N`, `three oh four`, `slash twenty four`, `S N I`). Check coverage against the note's headings before moving on.
5. **Write `cast.json`** (speaker to voice). Use only these voices, they exist: `en-US-EmmaMultilingualNeural` (narrator), `en-US-AriaNeural`, `en-US-JennyNeural`, `en-US-AvaNeural`, `en-US-AvaMultilingualNeural`, `en-US-GuyNeural`, `en-US-ChristopherNeural`, `en-US-EricNeural`, `en-US-RogerNeural`, `en-US-AndrewMultilingualNeural`, `en-US-BrianMultilingualNeural`, `en-GB-RyanNeural`, `en-AU-NatashaNeural`, `en-IN-NeerjaExpressiveNeural`. (Davis, Tony and William do not exist.) Rate and pitch per speaker make them distinct.
6. **Voices first:** run `--voices` (see commands). It prints the length. Over about 20 minutes is long; offer to split.
7. **Write `scenes.js`** from the template. One `blk(firstLine, nextSceneFirstLine, () => {...})` per scene. Time everything to spoken phrases with `A('l12','phrase')`. A phrase must appear in that line's text (apostrophes split into words: `Ava's` is `ava`, `s`). The preview prints `PHRASE NOT FOUND` for mistakes. Entity ids must be unique across the whole file.
8. **Preview stills** across every scene, check them (build contact sheets, see below), fix overflow and overlaps.
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
- **Always include:** a hook in the first 10 seconds, deep dive, trade-offs, failures and fixes, monitoring, a Go code chapter (real code from the Go note, `S.codePanel`, highlight each step as it is explained), an interview round (a rookie asks, the hero answers), a seven-point summary ending with one line to keep, and a "where to go next" card (note, Go note, before, after, compare).
- **Chapter cards** between scenes are automatic (from the `== sN Title` headings). Use a clear heading for each.
- **Gaps:** the builder leaves a 2.8 second pause at every scene change.

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
