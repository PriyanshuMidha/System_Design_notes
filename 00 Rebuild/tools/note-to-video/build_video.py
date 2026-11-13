#!/usr/bin/env python3
"""note-to-video: storyboard.html -> animated, narrated MP4 plus SRT.

What is different from a slide deck:
  * Narration is split into phrases at cue marks like {3}. Each phrase is spoken with its own tone
    (hook, punch, calm, warn, question) so the voice is not monotone.
  * Every element with data-step="3" appears (fade, pop, wipe, glow...) at the exact moment the phrase
    carrying cue {3} starts. So the picture builds up while the voice explains it.

Run with a Python that has edge-tts and playwright installed (see SKILL.md):
    python build_video.py storyboard.html --out "Videos/CDN and Edge" --work /tmp/work
    python build_video.py storyboard.html --work /tmp/work --preview     # final-state slide images only
Needs: Google Chrome, ffmpeg + ffprobe, internet (for the voice).
"""
import argparse
import asyncio
import hashlib
import html
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS = 30
LEAD = 0.35      # silence before the first word of a slide
GAP = 0.16       # silence between phrases
TAIL = 0.6       # silence after the last word
REVEAL_LEAD = 0.05  # an element starts appearing this long before its phrase

# tone presets: (rate %, volume %, pitch Hz) added to the storyboard's base rate
STYLES = {
    "normal": (0, 0, 0),
    "hook": (6, 8, 6),
    "punch": (-6, 12, 8),
    "calm": (-4, -2, -6),
    "warn": (-4, 6, -10),
    "question": (-2, 4, 10),
    "fast": (10, 0, 0),
}

JS = r"""(function () {
const clamp = (x) => Math.min(1, Math.max(0, x));
const outCubic = (p) => 1 - Math.pow(1 - p, 3);
const outBack = (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
window.seek = function (t) {
  document.querySelectorAll('[data-step]').forEach((el) => {
    const at = (window.REVEAL || {})[el.dataset.step];
    const dur = parseFloat(el.dataset.dur || '0.6');
    const kind = el.dataset.anim || 'up';
    const p = at === undefined ? 1 : clamp((t - at) / dur);
    const e = outCubic(p);
    el.style.filter = ''; el.style.boxShadow = ''; el.style.clipPath = '';
    if (kind === 'glow') {
      el.style.opacity = 1; el.style.transform = '';
      el.style.filter = 'brightness(' + (0.55 + 0.45 * e) + ') saturate(' + (0.6 + 0.4 * e) + ')';
      const ring = Math.sin(Math.PI * p);
      if (p > 0 && p < 1) el.style.boxShadow = '0 0 ' + (50 * ring) + 'px ' + (10 * ring) + 'px rgba(255,194,75,.85)';
      return;
    }
    el.style.opacity = kind === 'pop' ? Math.min(1, p * 3) : e;
    if (kind === 'up') el.style.transform = 'translateY(' + (1 - e) * 40 + 'px)';
    else if (kind === 'pop') el.style.transform = 'scale(' + (0.7 + 0.3 * outBack(p)) + ')';
    else if (kind === 'left') el.style.transform = 'translateX(' + (1 - e) * -90 + 'px)';
    else if (kind === 'right') el.style.transform = 'translateX(' + (1 - e) * 90 + 'px)';
    else if (kind === 'zoom') el.style.transform = 'scale(' + (1.25 - 0.25 * e) + ')';
    else if (kind === 'wipe') { el.style.opacity = p > 0 ? 1 : 0; el.style.clipPath = 'inset(0 ' + (1 - e) * 100 + '% 0 0)'; }
    else el.style.transform = '';
  });
};
})();
"""


def attrs_of(s):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', s))


def parse_token(tok):
    left, _, style = tok.partition(":")
    out = {"steps": [], "style": style.strip() or None, "pause": 0.0}
    left = left.strip()
    if left == "pause":
        out["pause"] = 0.45
    elif left:
        out["steps"] = [s.strip() for s in left.split(",") if s.strip()]
    return out


def parse_narration(raw):
    raw = html.unescape(" ".join(raw.split()))
    pending = {"steps": [], "style": None, "pause": 0.0}
    segs = []
    for part in re.split(r"(\{[^}]*\})", raw):
        m = re.fullmatch(r"\{([^}]*)\}", part)
        if m:
            t = parse_token(m.group(1))
            pending["steps"] += t["steps"]
            pending["style"] = t["style"] or pending["style"]
            pending["pause"] += t["pause"]
        elif part.strip():
            segs.append({**pending, "text": part.strip()})
            pending = {"steps": [], "style": None, "pause": 0.0}
    return segs


def parse(path):
    t = Path(path).read_text()
    head = re.search(r"<storyboard\b([^>]*)>", t)
    meta = attrs_of(head.group(1)) if head else {}
    prons = re.findall(r'<pron\s+from="([^"]+)"\s+to="([^"]+)"\s*/?>', t)
    slides = []
    for m in re.finditer(r"<section\b([^>]*)>(.*?)</section>", t, re.S):
        a = attrs_of(m.group(1))
        body = m.group(2)
        n = re.search(r"<narration>(.*?)</narration>", body, re.S)
        a["segs"] = parse_narration(n.group(1)) if n else []
        a["body"] = re.sub(r"<narration>.*?</narration>", "", body, flags=re.S)
        slides.append(a)
    if not slides:
        sys.exit("no <section> found in storyboard")
    return meta, prons, slides


def short(*parts):
    return hashlib.sha1("\x1f".join(str(p) for p in parts).encode()).hexdigest()[:8]


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **kw)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(map(str, cmd))}\n{r.stderr[-1500:]}")
    return r


def duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).stdout)


def page_html(meta, s, i, n, css, reveal):
    heading, sub, series = s.get("heading", ""), s.get("sub", ""), meta.get("series", "")
    if s.get("layout") == "title":
        inner = (f'<div class="title-slide"><div class="kicker">{series}</div>'
                 f'<h1>{heading}</h1><p class="sub" data-step="{s.get("sub-step", "1")}">{sub}</p></div>')
        footer = ""
    else:
        inner = f'<h1>{heading}</h1><div class="body">{s["body"]}</div>'
        footer = f'<div class="footer"><span>{meta.get("title", "")}</span><span>{i + 1} / {n}</span></div>'
    bar = f'<div class="bar" style="width:{(i + 1) / n * 100:.1f}%"></div>'
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>'
            f'<div class="slide">{inner}{footer}{bar}</div>'
            f'<script>window.REVEAL={json.dumps(reveal)};{JS}</script></body></html>')


async def tts_one(text, voice, rate, vol, pitch, out):
    import edge_tts
    last = None
    for _ in range(3):
        try:
            await edge_tts.Communicate(text, voice, rate=f"{rate:+d}%", volume=f"{vol:+d}%", pitch=f"{pitch:+d}Hz").save(str(out))
            return
        except Exception as e:
            last = e
            await asyncio.sleep(2)
    sys.exit(f"edge-tts failed: {last}")


async def tts_all(jobs):
    await asyncio.gather(*[tts_one(*j) for j in jobs if not j[-1].exists()])


def plan_audio(meta, prons, s, idx, work):
    """Speak each phrase with its own tone. Returns segments with absolute start times and the slide wav."""
    voice = meta.get("voice", "en-US-EmmaMultilingualNeural")
    base_rate = int(meta.get("rate", "6").replace("%", "").replace("+", ""))
    segs = s["segs"]
    jobs = []
    for k, sg in enumerate(segs):
        style = sg["style"]
        if style is None:
            style = "question" if sg["text"].rstrip().endswith("?") else ("punch" if "!" in sg["text"] else "normal")
            if idx == 0 and k == 0:
                style = "hook"
        if style not in STYLES:
            sys.exit(f"unknown tone '{style}' (use: {', '.join(STYLES)})")
        r, v, p = STYLES[style]
        spoken = sg["text"]
        for frm, to in prons:
            spoken = re.sub(rf"(?<![\w-]){re.escape(frm)}(?![\w-])", to, spoken)
        mp3 = work / f"a{idx + 1:02}-{k}-{short(spoken, voice, base_rate + r, v, p)}.mp3"
        sg["mp3"], sg["tone"] = mp3, style
        jobs.append((spoken, voice, base_rate + r, v, p, mp3))
    if jobs:
        # own thread: Playwright's sync API keeps an event loop running in the main one
        with ThreadPoolExecutor(1) as ex:
            ex.submit(lambda: asyncio.run(tts_all(jobs))).result()
    t = LEAD
    for k, sg in enumerate(segs):
        sg["dur"] = duration(sg["mp3"])
        sg["start"] = t
        nxt = segs[k + 1]["pause"] if k + 1 < len(segs) else 0.0
        sg["gap"] = GAP + nxt
        t += sg["dur"] + sg["gap"]
    total = t if segs else LEAD
    reveal = {}
    for sg in segs:
        for st in sg["steps"]:
            reveal[st] = max(0.0, round(sg["start"] - REVEAL_LEAD, 3))
    wav = work / f"a{idx + 1:02}-{short(*[sg['mp3'].name + str(sg['gap']) for sg in segs])}.wav"
    if segs and not wav.exists():
        cmd, parts = ["ffmpeg", "-y"], []
        for sg in segs:
            cmd += ["-i", sg["mp3"]]
        for k, sg in enumerate(segs):
            lead = f"adelay={int(LEAD * 1000)}:all=1," if k == 0 else ""
            parts.append(f"[{k}:a]aresample=44100,aformat=channel_layouts=mono,{lead}apad=pad_dur={sg['gap']:.3f}[a{k}]")
        graph = ";".join(parts) + ";" + "".join(f"[a{k}]" for k in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[out]"
        run(cmd + ["-filter_complex", graph, "-map", "[out]", "-c:a", "pcm_s16le", wav])
    return segs, reveal, total, wav


def frame_times(reveal, slide_len):
    """Frames only where something moves; everything else is a held still."""
    times = {0.0, round(slide_len, 3)}
    for at in reveal.values():
        t = at
        while t <= at + 0.75:
            times.add(round(t, 3))
            t += 1 / FPS
        times.add(round(at + 0.75, 3))
    return sorted(t for t in times if t <= slide_len)


def srt_chunks(segs, offset):
    out = []
    for sg in segs:
        words = sg["text"].split()
        chunks = [" ".join(words[j:j + 12]) for j in range(0, len(words), 12)]
        total = sum(len(c) for c in chunks) or 1
        t = offset + sg["start"]
        for c in chunks:
            d = sg["dur"] * len(c) / total
            out.append((t, t + d, c))
            t += d
    return out


def stamp(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("storyboard")
    ap.add_argument("--out", default=".")
    ap.add_argument("--work", required=True, help="scratch folder")
    ap.add_argument("--preview", action="store_true", help="only render each slide's final state as a PNG")
    a = ap.parse_args()

    from playwright.sync_api import sync_playwright
    t0 = time.time()
    meta, prons, slides = parse(a.storyboard)
    css = (HERE / "slide.css").read_text()
    work = Path(a.work).resolve()
    work.mkdir(parents=True, exist_ok=True)
    n = len(slides)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        if a.preview:
            for i, s in enumerate(slides):
                page.set_content(page_html(meta, s, i, n, css, {}), wait_until="load")
                page.evaluate("window.seek(1e6)")
                page.screenshot(path=str(work / f"preview-{i + 1:02}.png"))
            print(f"preview images (everything revealed) in {work}")
            return

        clips, srt, clock = [], [], 0.0
        for i, s in enumerate(slides):
            segs, reveal, total, wav = plan_audio(meta, prons, s, i, work)
            used = {st for sg in segs for st in sg["steps"]}
            doc_steps = set(re.findall(r'data-step="([^"]+)"', s["body"]))
            if s.get("layout") == "title":
                doc_steps.add(s.get("sub-step", "1"))
            for miss in sorted(doc_steps - used):
                print(f"  ! slide {i + 1}: data-step={miss} has no matching cue in the narration (it shows from the start)")
            slide_len = total + TAIL + float(s.get("hold", 0)) + (0.8 if s.get("layout") == "title" else 0)
            doc = page_html(meta, s, i, n, css, reveal)
            clip = work / f"c{i + 1:02}-{short(doc, wav.name if segs else '', slide_len)}.mp4"
            if not clip.exists():
                times = frame_times(reveal, slide_len)
                page.set_content(doc, wait_until="load")
                fdir = work / f"f{i + 1:02}"
                fdir.mkdir(exist_ok=True)
                lines = []
                for k, t in enumerate(times):
                    f = fdir / f"{k:04d}.jpg"
                    page.evaluate("t => window.seek(t)", t)
                    page.screenshot(path=str(f), type="jpeg", quality=93)
                    d = (times[k + 1] - t) if k + 1 < len(times) else 0.04
                    lines.append(f"file '{f}'\nduration {d:.4f}")
                lines.append(f"file '{fdir / f'{len(times) - 1:04d}.jpg'}'")
                lst = fdir / "list.txt"
                lst.write_text("\n".join(lines) + "\n")
                cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst]
                if segs:
                    cmd += ["-i", wav, "-af", "apad"]
                else:
                    cmd += ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono"]
                cmd += ["-t", f"{slide_len:.3f}", "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-preset", "medium",
                        "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", clip]
                run(cmd)
                for f in fdir.glob("*.jpg"):
                    f.unlink()
            clips.append(clip)
            srt += srt_chunks(segs, clock)
            clock += slide_len
            tones = ",".join(sg["tone"][0] for sg in segs)
            print(f"  slide {i + 1:2}/{n}  {slide_len:5.1f}s  {len(reveal)} reveals  tones[{tones}]  {s.get('heading', '')[:40]}")
        browser.close()

    out_dir = Path(a.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    name = meta.get("title", "video")
    srt_path = out_dir / f"{name}.srt"
    srt_path.write_text("\n".join(f"{k}\n{stamp(st)} --> {stamp(en)}\n{tx}\n" for k, (st, en, tx) in enumerate(srt, 1)))
    lst = work / "list.txt"
    lst.write_text("".join(f"file '{c}'\n" for c in clips))
    mp4 = out_dir / f"{name}.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", srt_path, "-map", "0", "-map", "1",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-af", "loudnorm=I=-14:TP=-1.0:LRA=11",
         "-c:s", "mov_text", "-metadata:s:s:0", "language=eng", mp4])
    print(f"\nDONE  {mp4}  ({clock / 60:.1f} min, {mp4.stat().st_size / 1e6:.1f} MB)  subtitles: {srt_path.name}")
    print(f"build time {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
