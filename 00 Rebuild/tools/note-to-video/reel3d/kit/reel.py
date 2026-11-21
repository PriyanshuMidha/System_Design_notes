"""Reel kit driver. One folder per reel (DIR) holding:
  narration.txt  one spoken paragraph (one take)
  meta.json      {"title":"TCP","ep":4,"q":"Why does TCP need 3 messages to start?",
                  "caption_map":{"T C P":"TCP"}, "keys":{"syn":["Sin",0], ...},
                  "rate":"+8%", "T0":0.9, "tail":2.6}
  scene.js       KC, KW, SHAKE, setup(), update(t)   (see kit.js header)
  sfx.json       [["syn","clang",1.0], [12.4,"whoosh",0.8,1.2], ...]  (time = event name or seconds (+offset as "syn+0.3"); optional 4th = duration)
Usage (python = ~/.venvs/note-to-video/bin/python):
  reel.py DIR tts            synthesize narration (cached unless text changed) -> nar.mp3, words.json, events.json
  reel.py DIR events         recompute events.json from meta keys
  reel.py DIR page           build page.html (inlines libs + kit + scene)
  reel.py DIR shot 2,8,15    stills p_<t>.png, prints console errors
  reel.py DIR sheet 2,8,15,22,30,40   stills + contact sheet sheet.png (scaled)
  reel.py DIR sfx            sound effects + music -> sfx.wav
  reel.py DIR render OUT.mp4 full render (waits for a global render lock)
"""
import sys, os, json, re, subprocess, asyncio, time, wave, hashlib
KIT = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.dirname(KIT)
D = os.path.abspath(sys.argv[1]); CMD = sys.argv[2]; ARGS = sys.argv[3:]
P = lambda n: os.path.join(D, n)
meta = json.load(open(P('meta.json')))
T0 = meta.get('T0', 0.9); TAIL = meta.get('tail', 2.6)
CHROME = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
W, H, FPS = 1080, 1920, 30

def norm(s): return re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))

def tts():
    text = open(P('narration.txt')).read().strip()
    rate = meta.get('rate', '+8%'); voice = meta.get('voice', 'en-US-AndrewMultilingualNeural')
    h = hashlib.md5((text + rate + voice).encode()).hexdigest()
    if os.path.exists(P('words.json')) and json.load(open(P('words.json'))).get('hash') == h:
        print('tts cached'); events(); return
    import edge_tts
    async def go():
        for k in range(6):
            try:
                c = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
                words = []; buf = bytearray()
                async for m in c.stream():
                    if m["type"] == "audio": buf += m["data"]
                    elif m["type"] == "WordBoundary": words.append([m["text"], m["offset"] / 1e7])
                return words, bytes(buf)
            except Exception as e:
                print('retry', e); time.sleep(3)
        raise SystemExit('tts failed')
    words, audio = asyncio.run(go())
    open(P('nar.mp3'), 'wb').write(audio)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", P('nar.mp3')]).decode())
    json.dump({"words": words, "dur": dur, "hash": h}, open(P('words.json'), 'w'))
    print(len(words), 'words, narration', round(dur, 1), 's, total', round(T0 + dur + TAIL, 1), 's')
    events()

def caption_words():
    """boundary words -> display words with punctuation from the text and caption_map merges; times include T0"""
    d = json.load(open(P('words.json'))); ws = d['words']
    toks = open(P('narration.txt')).read().split()
    out = []; j = 0
    for w, t in ws:
        nw = norm(w); disp = w
        for k in range(j, min(j + 4, len(toks))):
            if norm(toks[k]).startswith(nw) or nw.startswith(norm(toks[k])) and norm(toks[k]):
                disp = toks[k] if norm(toks[k]) == nw else w + (toks[k][-1] if toks[k][-1] in '.,!?;:' else '')
                j = k + 1; break
        out.append([disp, round(t + T0, 3)])
    cm = meta.get('caption_map', {})
    for src, dst in sorted(cm.items(), key=lambda x: -len(x[0].split())):
        parts = [norm(x) for x in src.split()]; n = len(parts); i = 0; res = []
        while i < len(out):
            if [norm(x[0]) for x in out[i:i + n]] == parts:
                punct = out[i + n - 1][0][-1] if out[i + n - 1][0][-1] in '.,!?;:' else ''
                res.append([dst + punct, out[i][1]]); i += n
            else:
                res.append(out[i]); i += 1
        out = res
    return out

def events():
    d = json.load(open(P('words.json'))); ws = d['words']
    def at(word, k):
        c = 0
        for t, o in [(x[0], x[1]) for x in ws]:
            if norm(t) == norm(word):
                if c == k: return round(o + T0, 2)
                c += 1
        raise SystemExit('KEY WORD NOT FOUND: %s #%d' % (word, k))
    ev = {n: at(*v) for n, v in meta.get('keys', {}).items()}
    ev.update(dur=round(d['dur'], 2), T0=T0, end=round(T0 + d['dur'], 2), total=round(T0 + d['dur'] + TAIL, 2))
    json.dump(ev, open(P('events.json'), 'w')); print(json.dumps(ev))

def page():
    libs = ''.join(open(os.path.join(LIB, f)).read() + '\n' for f in ['three.min.js', 'CopyShader.js', 'LuminosityHighPassShader.js', 'EffectComposer.js', 'ShaderPass.js', 'RenderPass.js', 'UnrealBloomPass.js', 'cannon.min.js'])
    tpl = open(os.path.join(KIT, 'template.html')).read()
    rep = {'__LIBS__': libs, '__KIT__': open(os.path.join(KIT, 'kit.js')).read(), '__SCENE__': open(P('scene.js')).read(),
           '__EV__': open(P('events.json')).read(), '__WORDS__': json.dumps(caption_words()), '__W__': str(W), '__H__': str(H),
           '__Q__': meta.get('q', ''), '__TITLE__': meta.get('title', '').upper(), '__EP__': str(meta.get('ep', ''))}
    # order matters: insert code blocks last so their contents are not re-substituted
    for k in ['__EV__', '__WORDS__', '__W__', '__H__', '__Q__', '__TITLE__', '__EP__']:
        tpl = tpl.replace(k, rep[k])
    for k in ['__SCENE__', '__KIT__', '__LIBS__']:
        a, b = tpl.split(k, 1); tpl = a + rep[k] + b
    open(P('page.html'), 'w').write(tpl); print('page ok')

def browser(fn):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", args=CHROME)
        pg = b.new_page(viewport={"width": W, "height": H}); errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type in ("warning", "error") else None)
        pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        pg.goto("file://" + P('page.html')); pg.wait_for_timeout(2000)
        fn(pg); b.close()
        e = sorted(set(x for x in errs if 'GL Driver' not in x and 'GPU stall' not in x))
        print("\n".join(e) if e else "no errors", "| setup ok" if True else "")

def shot(ts):
    page()
    def f(pg):
        print('setup', pg.evaluate("window.PHYS"))
        for t in ts: pg.evaluate(f"seek({t})"); pg.screenshot(path=P(f"p_{t:05.1f}.png"))
    browser(f)

def sheet(ts):
    shot(ts); files = [P(f"p_{t:05.1f}.png") for t in ts]
    inp = sum([['-i', f] for f in files], []); n = len(files); cols = min(n, 4); rows = (n + cols - 1) // cols
    while len(files) < rows * cols: files.append(files[-1]); inp += ['-i', files[-1]]
    fc = ''.join(f'[{i}:v]scale=360:640[v{i}];' for i in range(rows * cols))
    fc += ''.join(''.join(f'[v{r*cols+c}]' for c in range(cols)) + f'hstack={cols}[r{r}];' for r in range(rows))
    fc += ''.join(f'[r{r}]' for r in range(rows)) + (f'vstack={rows}[o]' if rows > 1 else 'null[o]')
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error'] + inp + ['-filter_complex', fc, '-map', '[o]', P('sheet.png')]); print('sheet', P('sheet.png'))

def sfx():
    import numpy as np
    E = json.load(open(P('events.json'))); SR = 44100; TOT = E['total']; rng = np.random.default_rng(7)
    buf = np.zeros(int(TOT * SR) + SR)
    def add(t, x, g=1.0):
        i = int(max(0, t) * SR); n = min(len(x), len(buf) - i)
        if n > 0: buf[i:i + n] += x[:n] * g
    def env(n, a=.005, d=1.0): t = np.arange(n) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
    def lp(x, k):
        y = np.copy(x)
        for i in range(1, len(y)): y[i] = y[i - 1] + k * (x[i] - y[i - 1])
        return y
    def noise(n): return rng.standard_normal(n)
    def tone(f, n, dec=.3): t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * env(n, .002, dec)
    def sweep(f0, f1, dur, dec=.4):
        n = int(dur * SR); f = np.linspace(f0, f1, n); return np.sin(np.cumsum(2 * np.pi * f / SR)) * env(n, .003, dec)
    FX = {
        'clang': lambda d: (tone(520, int(.9*SR), .35) + .7*tone(830, int(.9*SR), .25) + .5*tone(1410, int(.9*SR), .15)) * .5,
        'clink': lambda d: (tone(1800, int(.35*SR), .08) + .6*tone(2650, int(.35*SR), .05)) * .3,
        'click': lambda d: (tone(2200, int(.12*SR), .02) + .5*noise(int(.12*SR))*env(int(.12*SR), .0005, .01)) * .5,
        'whoosh': lambda d: lp(noise(int(d*SR)), .08) * np.sin(np.pi*np.linspace(0, 1, int(d*SR)))**2 * .9,
        'rumble': lambda d: lp(noise(int(d*SR)), .01) * 3.0 * np.minimum(np.linspace(0, 1, int(d*SR))*8, 1) * np.minimum((1-np.linspace(0, 1, int(d*SR)))*8, 1),
        'crack': lambda d: noise(int(.25*SR)) * env(int(.25*SR), .0005, .05) * .7,
        'crash': lambda d: (lp(noise(int(2.2*SR)), .15)*env(int(2.2*SR), .003, .6)*2.2 + noise(int(2.2*SR))*env(int(2.2*SR), .001, .08)*.5) * .6,
        'smash': lambda d: (noise(int(1.2*SR))*env(int(1.2*SR), .001, .25)*.6 + sum(tone(f, int(1.2*SR), .2) for f in (2400, 3100, 3900, 5200))*.12),
        'splash': lambda d: (lambda x: (x - lp(x, .05)) * env(int(1.6*SR), .01, .5) * .5)(noise(int(1.6*SR))),
        'chime': lambda d: (tone(880, int(1.8*SR), .6) + .6*tone(1320, int(1.8*SR), .5) + .4*tone(1760, int(1.8*SR), .4)) * .2,
        'ding': lambda d: (tone(1320, int(1.0*SR), .35) + .4*tone(2640, int(1.0*SR), .2)) * .25,
        'pop': lambda d: sweep(900, 250, .12, .05) * .6,
        'beep': lambda d: np.sin(2*np.pi*1000*np.arange(int(.14*SR))/SR) * .25,
        'buzz': lambda d: np.sign(np.sin(2*np.pi*140*np.arange(int(.45*SR))/SR)) * env(int(.45*SR), .005, .3) * .2,
        'thud': lambda d: (sweep(140, 45, .4, .15) + lp(noise(int(.4*SR)), .05)*env(int(.4*SR), .001, .05)*2) * .7,
        'zap': lambda d: sweep(2400, 300, .25, .1) * .35,
        'stamp': lambda d: (sweep(220, 70, .25, .08) + noise(int(.25*SR))*env(int(.25*SR), .0005, .02)*.6) * .8,
        'swish': lambda d: lp(noise(int(.35*SR)), .3) * np.sin(np.pi*np.linspace(0, 1, int(.35*SR)))**3 * .6,
        'tick': lambda d: tone(3200, int(.05*SR), .01) * .4,
        'bass': lambda d: sweep(90, 35, 1.4, .7) * .9,
        'riser': lambda d: sweep(200, 1400, d, 10) * np.linspace(0, 1, int(d*SR))**2 * .25 + lp(noise(int(d*SR)), .1) * np.linspace(0, 1, int(d*SR))**2 * .4,
        'lock': lambda d: (tone(1600, int(.2*SR), .03) + noise(int(.2*SR))*env(int(.2*SR), .0005, .015)*.7 + sweep(300, 120, .2, .06)) * .6,
        'flatline': lambda d: np.sin(2*np.pi*1000*np.arange(int(d*SR))/SR) * .2,
        'horn': lambda d: (lambda t: (np.sin(2*np.pi*233*t) + np.sin(2*np.pi*277*t)) * np.minimum(t/.05, 1) * np.minimum((d-t)/.1, 1) * .2)(np.arange(int(d*SR))/SR),
        'drip': lambda d: sweep(1200, 2600, .08, .05) * .4,
        'spark': lambda d: noise(int(.5*SR)) * env(int(.5*SR), .0005, .06) * np.sign(np.sin(np.arange(int(.5*SR))*.9)) * .3,
        'engine': lambda d: (lambda t: (np.sign(np.sin(2*np.pi*(60+40*t/d)*t))*.15 + lp(noise(len(t)), .05)*.8) * np.minimum(t/.2, 1) * np.minimum((d-t)/.3, 1))(np.arange(int(d*SR))/SR),
        'water': lambda d: lp(noise(int(d*SR)), .2) * .35 * np.minimum(np.linspace(0, 1, int(d*SR))*6, 1) * np.minimum((1-np.linspace(0, 1, int(d*SR)))*6, 1),
    }
    def tm(x):
        if isinstance(x, (int, float)): return float(x)
        m = re.match(r'^([a-zA-Z_0-9]+)([+-][0-9.]+)?$', x)
        return E[m.group(1)] + (float(m.group(2)) if m.group(2) else 0)
    for row in json.load(open(P('sfx.json'))):
        t, kind, g = tm(row[0]), row[1], row[2] if len(row) > 2 else 1.0
        dur = row[3] if len(row) > 3 else 1.0
        add(t, FX[kind](dur), g)
    # series sting + end chime
    add(0.0, FX['bass'](1), .8); add(0.05, FX['riser'](.8), .5); add(E['total'] - 2.4, FX['chime'](1), .7)
    # music pad: slow minor-ish progression with soft pulse
    t = np.arange(len(buf)) / SR; pad = np.zeros(len(buf))
    ch = [(220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7), (164.8, 207.7, 246.9)]
    for idx, (a, b, c) in enumerate(ch * 20):
        st = idx * 3.2
        if st > TOT: break
        i0 = int(st * SR); n = int(3.8 * SR); tt = np.arange(n) / SR
        x = sum(np.sin(2*np.pi*f*tt) + .4*np.sin(2*np.pi*2*f*tt) for f in (a, b, c)) * np.minimum(tt/.8, 1) * np.minimum((3.8-tt)/.8, 1)
        m = min(n, len(buf) - i0)
        if m > 0: pad[i0:i0 + m] += x[:m] * .03
    pulse = (np.sin(2*np.pi*t*2.0) > .6) * np.exp(-((t*2.0) % 1) * 9) * np.sin(2*np.pi*55*t) * .12
    pad += pulse * (t > 1.0)
    pad *= np.minimum(t / 1.5, 1) * np.clip((TOT - t) / 2, 0, 1)
    buf += pad
    buf = np.clip(buf / (np.abs(buf).max() + 1e-6) * .9, -1, 1)
    w = wave.open(P('sfx.wav'), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype(np.int16).tobytes()); w.close()
    print('sfx ok', round(len(buf) / SR, 1))

def _chunk(args):
    ids, path = args
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", args=CHROME)
        pg = b.new_page(viewport={"width": W, "height": H}); pg.goto("file://" + path); pg.wait_for_timeout(2500)
        for i in ids:
            pg.evaluate(f"seek({i/FPS})"); pg.screenshot(path=os.path.join(os.path.dirname(path), 'fr', f"{i:05d}.jpg"), type="jpeg", quality=90)
        b.close()

def render(out):
    from multiprocessing import Pool
    page(); sfx(); E = json.load(open(P('events.json'))); N = int(E['total'] * FPS)
    lock = os.environ.get('REEL_LOCK', '/tmp/reel_render.lock')
    while True:
        try: os.mkdir(lock); break
        except FileExistsError: print('waiting for render lock'); time.sleep(20)
    try:
        os.makedirs(P('fr'), exist_ok=True)
        for f in os.listdir(P('fr')): os.remove(P('fr/' + f))
        K = int(os.environ.get('REEL_WORKERS', '6')); ids = list(range(N)); t0 = time.time()
        with Pool(K) as pool: pool.map(_chunk, [(ids[k::K], P('page.html')) for k in range(K)])
        print('frames', N, 'in', round(time.time() - t0), 's')
    finally:
        os.rmdir(lock)
    d = int(T0 * 1000)
    fc = f"[1:a]adelay={d}|{d},volume=1.0[n];[2:a]volume=0.5[s];[n][s]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.0[a]"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', P('fr/%05d.jpg'), '-i', P('nar.mp3'), '-i', P('sfx.wav'),
                           '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                           '-c:a', 'aac', '-b:a', '160k', '-t', str(E['total']), '-movflags', '+faststart', out])
    # srt from caption words
    cw = caption_words(); lines = []; cur = []
    for w in cw:
        cur.append(w)
        if len(cur) >= 6 or w[0][-1] in '.!?': lines.append(cur); cur = []
    if cur: lines.append(cur)
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    with open(os.path.splitext(out)[0] + '.srt', 'w') as f:
        for i, l in enumerate(lines):
            end = lines[i + 1][0][1] if i + 1 < len(lines) else E['end']
            f.write(f"{i+1}\n{ts(l[0][1])} --> {ts(end)}\n{' '.join(w[0] for w in l)}\n\n")
    print('wrote', out)
    for f in os.listdir(P('fr')): os.remove(P('fr/' + f))

if __name__ == '__main__':
    if CMD == 'tts': tts()
    elif CMD == 'events': events()
    elif CMD == 'page': page()
    elif CMD == 'shot': shot([float(x) for x in ARGS[0].split(',')])
    elif CMD == 'sheet': sheet([float(x) for x in ARGS[0].split(',')])
    elif CMD == 'sfx': sfx()
    elif CMD == 'render': render(ARGS[0])
    else: print(__doc__)
