# reel3d: real-3D reel pipeline (Three.js + physics + sound)

Used to make `API Contract Reel v3 (bridge).mp4`. Reference scene: a bridge built from two banks, a mismatch, a blueprint fix, a collapse and a rebuild.

Files
- `reel.html`: the 3D scene (Three.js r128, cannon.js physics precomputed at load, bloom, shadows). `seek(t)` draws any moment deterministically. Reads word times as `E.<name>` (key events) from `events.json`. **Copy and edit this file for each new reel** (new scene objects, camera keys `KC`, event choreography).
- `tts.py`: ONE continuous narration take (edge-tts Andrew +4%) with word timestamps -> `nar.mp3`, `words.json`. Edit `TEXT`.
- `events.py`: word times -> `events.json` (edit `KEYS`).
- `sfx.py`: synthesized sound effects (clang, whoosh, click, rumble, crash, splash, creak, chime) at event times plus a soft music pad -> `sfx.wav`. Edit the `add(...)` lines.
- `build_page.py W H out.html`: injects events and size into `reel.html` (`python build_page.py 1080 1920 page.html`).
- `shot.py t1,t2,...`: stills at given times (view them, fix, repeat). Prints console errors.
- `render.py out.mp4`: renders all frames (3 Chrome workers, 30 fps), mixes narration + sfx, loudnorm, writes the MP4.
- `three.min.js`, `cannon.min.js` and postprocessing files: local libs (no network needed).

Workflow for a new reel
1. `cp -r reel3d <scratch>/reel_<topic>` and work in the copy.
2. Write the narration paragraph (about 85 words for 35 s) in `tts.py`; run it. Run `events.py` after editing `KEYS`.
3. Edit `reel.html`: scene, camera keys keyed to `E.*`, physics, effects. Edit `sfx.py` events; run it.
4. `python build_page.py 1080 1920 page.html`; `python shot.py ...` and view stills; iterate.
5. `python render.py "<out>.mp4"`; verify with ffprobe.
Run every script from inside the working copy (`cd <scratch>/reel_<topic>`), because `tts.py`, `events.py` and `sfx.py` read and write files in the current folder. Use `~/.venvs/note-to-video/bin/python` (has edge-tts, playwright, numpy). Chrome flags used: `--use-gl=angle --use-angle=swiftshader`.

Rules (see SKILL.md): moving camera always, real physics for interaction, one narration take, sound layer, almost no on-screen text, independent setting per reel.
