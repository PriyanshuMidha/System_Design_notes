#!/usr/bin/env python3
"""story_build.py: story mode of note-to-video.

Inputs (in one folder, e.g. Videos/CDN and Edge/story/):
  script.txt  - voice script: `id | SPEAKER | tone | text`, `== scene` headings
  scenes.js   - scene animation written against story_engine.js (never repeats the voice text)
  cast.json   - speaker -> edge-tts voice settings

Steps: synthesize each line with its own voice (word timings kept) -> lay lines on a timeline ->
render frames by seeking the animation in headless Chrome (parallel workers) -> ffmpeg.

  python story_build.py <story dir> --work <scratch dir> --out <dir> [--name "CDN Story"]
  python story_build.py <story dir> --work <scratch dir> --preview 12.5,40,80      # PNG stills only
  python story_build.py <story dir> --work <scratch dir> --voices                  # voice samples only
"""
import argparse, asyncio, hashlib, json, re, subprocess, sys, wave
from multiprocessing import Pool
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
FPS = 24
SR = 24000
TONES = {  # rate %, volume %, pitch Hz
    "normal": (0, 0, 0), "hook": (6, 8, 6), "punch": (-6, 12, 8), "calm": (-4, -2, -6),
    "warn": (-4, 6, -10), "question": (-2, 4, 10),
}
LEAD, GAP, SCENE_GAP, TAIL = 2.4, 0.28, 2.8, 2.5


def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(" ".join(map(str, a)) + "\n" + r.stderr[-1500:])
    return r.stdout


def parse_script(p):
    scenes, lines = [], []
    for raw in p.read_text().splitlines():
        raw = raw.strip()
        if not raw or raw.startswith("#"):
            continue
        if raw.startswith("=="):
            name = raw[2:].strip()
            scenes.append({"id": name.split()[0], "name": name, "lines": []})
            continue
        i, who, tone, text = [x.strip() for x in raw.split("|", 3)]
        ln = {"id": i, "who": who, "tone": tone, "text": text, "scene": scenes[-1]["id"]}
        lines.append(ln)
        scenes[-1]["lines"].append(i)
    return scenes, lines


async def synth_one(ln, cast, cache):
    c = cast[ln["who"]]
    rt, vt, pt = TONES.get(ln["tone"], TONES["normal"])
    rate, vol, pitch = c.get("rate", 0) + rt, c.get("volume", 0) + vt, c.get("pitch", 0) + pt
    key = hashlib.md5(json.dumps([c["voice"], rate, vol, pitch, ln["text"]]).encode()).hexdigest()[:16]
    mp3, js = cache / (key + ".mp3"), cache / (key + ".json")
    if not (mp3.exists() and js.exists()):
        import edge_tts
        com = edge_tts.Communicate(ln["text"], c["voice"], rate=f"{rate:+d}%", volume=f"{vol:+d}%", pitch=f"{pitch:+d}Hz", boundary="WordBoundary")
        words, buf = [], bytearray()
        async for m in com.stream():
            if m["type"] == "audio":
                buf += m["data"]
            elif m["type"] == "WordBoundary":
                words.append([m["text"], m["offset"] / 1e7])
        mp3.write_bytes(bytes(buf))
        js.write_text(json.dumps(words))
    wav = cache / (key + ".wav")
    if not wav.exists():
        sh("ffmpeg", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", "-sample_fmt", "s16", str(wav))
    return key


async def synth_all(lines, cast, cache):
    sem = asyncio.Semaphore(4)

    async def go(ln):
        async with sem:
            for attempt in range(4):
                try:
                    ln["key"] = await synth_one(ln, cast, cache)
                    return
                except Exception as e:  # network hiccup
                    if attempt == 3:
                        raise
                    await asyncio.sleep(1.5)
    await asyncio.gather(*[go(l) for l in lines])


def read_wav(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)


def layout(scenes, lines, cache):
    by = {l["id"]: l for l in lines}
    t, prev, out = LEAD, None, {}
    audio = []
    chapters = []
    for sc in scenes:
        for k, lid in enumerate(sc["lines"]):
            ln = by[lid]
            pcm = read_wav(cache / (ln["key"] + ".wav"))
            dur = len(pcm) / SR
            if k == 0:
                frm = 0.0 if prev is None else t
            if prev is not None:
                t += SCENE_GAP if k == 0 else (0.38 if prev["tone"] == "question" else GAP)
            if k == 0:
                title = sc["name"].split(" ", 1)[1] if " " in sc["name"] else sc["name"]
                chapters.append({"title": title, "from": round(frm, 3), "s": round(t, 3)})
            words = json.loads((cache / (ln["key"] + ".json")).read_text())
            out[lid] = {"who": ln["who"], "s": round(t, 3), "e": round(t + dur - 0.15, 3), "text": ln["text"],
                        "words": [[w, round(t + o, 3)] for w, o in words]}
            audio.append((t, pcm))
            t += dur
            prev = ln
    total = t + TAIL
    buf = np.zeros(int(total * SR), dtype=np.float32)
    for st, pcm in audio:
        i = int(st * SR); buf[i:i + len(pcm)] += pcm
    layout.chapters = chapters
    return out, total, buf


def write_wav(path, buf):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.clip(buf, -32768, 32767).astype(np.int16).tobytes())


def make_page(story, work, timeline, total):
    css = """html,body{margin:0;background:#0b1020;overflow:hidden} svg{display:block}"""
    page = work / "page.html"
    page.write_text(
        "<!doctype html><meta charset=utf-8><style>" + css + "</style>"
        "<svg id=stage width=1920 height=1080 viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'></svg>"
        "<script>window.LINES=" + json.dumps(timeline) + ";window.SCENES=" + json.dumps(layout.chapters) + ";window.TOTAL=" + str(total) + ";</script>"
        "<script>" + (HERE / "story_engine.js").read_text() + "</script>"
        "<script>" + (HERE / "story_lib.js").read_text() + "</script>"
        "<script>" + (story / "scenes.js").read_text() + "</script>"
        "<script>S.chapters && S.chapters();</script>")
    return page


def render_chunk(args):
    page, frames, outdir, fmt = args
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", args=["--disable-gpu-vsync"])
        pg = b.new_page(viewport={"width": 1920, "height": 1080})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type in ("warning", "error") else None)
        pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        pg.goto("file://" + page)
        for idx, t in frames:
            pg.evaluate(f"seek({t})")
            if fmt == "jpg":
                pg.screenshot(path=f"{outdir}/{idx:06d}.jpg", type="jpeg", quality=86)
            else:
                pg.screenshot(path=f"{outdir}/{idx}.png")
        b.close()
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("story"); ap.add_argument("--work", required=True); ap.add_argument("--out")
    ap.add_argument("--name", default="Story"); ap.add_argument("--preview"); ap.add_argument("--voices", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    story, work = Path(a.story).resolve(), Path(a.work).resolve()
    work.mkdir(parents=True, exist_ok=True)
    cache = work / "tts"; cache.mkdir(exist_ok=True)
    cast = json.loads((story / "cast.json").read_text())
    scenes, lines = parse_script(story / "script.txt")
    asyncio.run(synth_all(lines, cast, cache))
    timeline, total, audio = layout(scenes, lines, cache)
    write_wav(work / "voice.wav", audio)
    (work / "timeline.json").write_text(json.dumps({"lines": timeline, "total": total}))
    print(f"voice done: {len(lines)} lines, {total:.1f}s ({total/60:.1f} min)")
    if a.voices:
        return
    page = make_page(story, work, timeline, total)
    if a.preview:
        ts = [float(x) for x in a.preview.split(",")]
        pdir = work / "preview"; pdir.mkdir(exist_ok=True)
        errs = render_chunk((str(page), [(f"{t:.1f}", t) for t in ts], str(pdir), "png"))
        print("\n".join(sorted(set(errs))) or "no console errors")
        print("stills in", pdir)
        return
    fdir = work / "frames"; fdir.mkdir(exist_ok=True)
    n = int(total * FPS)
    frames = [(i, i / FPS) for i in range(n)]
    chunks = [frames[i::a.workers] for i in range(a.workers)]
    with Pool(a.workers) as pool:
        res = pool.map(render_chunk, [(str(page), c, str(fdir), "jpg") for c in chunks])
    errs = sorted({e for r in res for e in r})
    print("console messages:", errs[:10] or "none")
    out = Path(a.out).resolve(); out.mkdir(parents=True, exist_ok=True)
    srt = out / (a.name + ".srt")
    def ts(t):
        h, r = divmod(t, 3600); m, s = divmod(r, 60); return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    names = {"N": "Narrator"}
    with open(srt, "w") as f:
        for k, (lid, L) in enumerate(timeline.items(), 1):
            who = names.get(L["who"], L["who"].title())
            f.write(f"{k}\n{ts(L['s'])} --> {ts(L['e'])}\n{who}: {L['text']}\n\n")
    mp4 = out / (a.name + ".mp4")
    sh("ffmpeg", "-y", "-framerate", str(FPS), "-i", str(fdir / "%06d.jpg"), "-i", str(work / "voice.wav"), "-i", str(srt),
       "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-c:a", "aac", "-b:a", "160k", "-c:s", "mov_text",
       "-metadata:s:s:0", "language=eng", "-shortest", "-movflags", "+faststart", str(mp4))
    print("wrote", mp4)


if __name__ == "__main__":
    main()
