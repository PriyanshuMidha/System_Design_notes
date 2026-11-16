/* HTTP caching: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
(function () {
  const { mk, tw, show, hide, pop, kill, tx, mkChar, card, portrait, camTw, T, rect, circ } = S;
  const A = S.W, B = S.L, End = S.End, Em = S.E;
  const GY = 800;

  // ---------- small helpers ----------
  const ui = (id, inner, x, y, o) => mk(id, inner, Object.assign({ ui: true, x, y, o: 0 }, o || {}));
  const wd = (id, inner, x, y, o) => mk(id, inner, Object.assign({ x, y, o: 0 }, o || {}));
  const em = (id, e, size, x, y, o) => wd(id, Em(e, size), x, y, o);
  const uem = (id, e, size, x, y, o) => ui(id, Em(e, size), x, y, o);
  function chip(id, text, x, y, col, t, o) {
    const w = (o && o.w) || Math.max(170, text.length * 20 + 56);
    ui(id, rect(-w / 2, -28, w, 56, 'rgba(14,18,30,.93)', { rx: 28, stroke: col, sw: 3 }) + T(text, 26, col), x, y, o);
    pop(id, t); return id;
  }
  function label(id, text, size, col, x, y, t, o) { ui(id, T(text, size, col, { w: 800 }), x, y, o); pop(id, t); return id; }
  function line(id, x1, y1, x2, y2, col, w, o) { // drawable line, progress prop p
    o = o || {};
    return wd(id, '<path data-p pathLength="1" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + col + '" stroke-width="' + (w || 8) + '" stroke-linecap="round" fill="none"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>', 0, 0, Object.assign({ p: 0 }, o));
  }
  function draw(id, t, d) { tw(id, t, 0.001, { o: 1 }); tw(id, t, d, { p: [0, 1] }, { ease: 'inOut' }); }
  function fly(id, t, pts, total, o) { // move along waypoints, time split by distance
    o = o || {};
    let L = [], sum = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); sum += l; }
    tw(id, t, 0.001, { o: 1, x: pts[0][0], y: pts[0][1] });
    let tt = t;
    for (let i = 1; i < pts.length; i++) { const d = total * L[i - 1] / sum; tw(id, tt, d, { x: pts[i][0], y: pts[i][1] }, { ease: o.ease || 'inOut', arc: o.arc || 0 }); tt += d; }
    return tt;
  }
  const go = (id, t, d, x, y) => { const e = S.ents[id]; tw(id, t, 0.001, { f: x < e.cur.x ? -1 : 1 }); tw(id, t, d, y === undefined ? { x } : { x, y }, { ease: 'inOut', walk: true }); };
  const face = (id, t, f) => tw(id, t, 0.001, { f });
  const sceneKill = [];
  let sc;
  const scene = (fn) => { sc = []; S.scope(sc); fn(); S.scope(null); return sc; };

  // ---------- DNS helpers ----------
  const mono = 'ui-monospace, Menlo, monospace';
  const dim = (id, t0, t1) => { ui(id, rect(0, 0, 1920, 1080, 'rgba(8,12,24,.9)'), 0, 0); tw(id, t0, 0.5, { o: 1 }); tw(id, t1, 0.5, { o: 0 }); };
  function uline(id, x1, y1, x2, y2, col, w) { return ui(id, '<path data-p pathLength="1" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + col + '" stroke-width="' + (w || 8) + '" stroke-linecap="round" fill="none"/>', 0, 0, { p: 0 }); }
  const udraw = (id, t, d) => { tw(id, t, 0.001, { o: 1 }); tw(id, t, d, { p: [0, 1] }, { ease: 'inOut' }); };
  function bubble(id, text, col, x, y, o) { const w = Math.max(120, text.length * 17 + 40); return wd(id, rect(-w / 2, -28, w, 56, 'rgba(14,18,30,.95)', { rx: 28, stroke: col, sw: 4 }) + T(text, 28, col), x, y, o); }
  function ask(id, text, col, x1, y1, x2, y2, t, d) { bubble(id, text, col, x1, y1); fly(id, t, [[x1, y1], [x2, y2]], d || 1.0, { arc: 40 }); hide(id, t + (d || 1.0), 0.25); }
  const rowBox = (id, title, sub, x, y, w, h, col, t) => { ui(id, rect(0, 0, w, h, 'rgba(14,18,30,.94)', { rx: 16, stroke: col, sw: 4 }) + T(title, 34, col, { anchor: 'start', dx: 24, dy: sub ? h * 0.32 : h / 2 }) + (sub ? T(sub, 24, '#cdd6e6', { anchor: 'start', dx: 24, dy: h * 0.72 }) : ''), x, y); pop(id, t); return id; };

  // ---------- cast and world ----------
  const CFG = {
    ben: { who: 'BEN', skin: '#d9a37a', shirt: '#3b82f6', pants: '#2a2f3a', hair: '#2b2118', hold: '📱', w: 100, name: 'Ben', ring: '#3b82f6' },
    fran: { who: 'FRAN', skin: '#f0c4a0', shirt: '#06b6d4', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', hold: '🥛', blush: 1, w: 92, name: 'Fran', ring: '#06b6d4' },
    carl: { who: 'CARL', skin: '#e8b48a', shirt: '#b45309', pants: '#444', hat: 'cap', hatColor: '#92400e', hold: '📦', w: 112, name: 'Carl', ring: '#f59e0b' },
    olga: { who: 'OLGA', skin: '#9b6a47', shirt: '#7c3aed', pants: '#222', hair: '#111', hair2: 'long', glasses: 1, hold: '🧾', w: 96, name: 'Olga', ring: '#a78bfa' },
    vera: { who: 'VERA', skin: '#f1c9a5', shirt: '#be185d', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🗂️', w: 90, name: 'Vera', ring: '#ec4899' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#46589a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 56 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 26, '#fff', { dy: -315 }), Object.assign({ x, y: GY }, keep));
  bld('bB', 250, '#2a6fb0', 'BEN · HOME', '🏠'); bld('bF', 900, '#0e7490', 'FRAN · FRIDGE (browser)', '🧊'); bld('bC', 1650, '#a05a12', 'CARL · WAREHOUSE (CDN)', '📦'); bld('bO', 2450, '#6d28d9', 'OLGA · ORIGIN', '🏢');
  mkChar('ben', CFG.ben, 340, 830, keep); mkChar('fran', CFG.fran, 920, 830, keep); mkChar('carl', CFG.carl, 1670, 830, keep); mkChar('olga', CFG.olga, 2470, 830, keep);
  mkChar('vera', CFG.vera, 1880, 830, { o: 0, keep: 1 });
  [['Ben', 340, '#60a5fa'], ['Fran', 920, '#22d3ee'], ['Carl', 1670, '#fbbf24'], ['Olga', 2470, '#c4b5fd']].forEach((n) => mk('nm' + n[0], T(n[0], 38, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['BEN', 'FRAN', 'CARL', 'OLGA', 'VERA'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { wide: { x: 1350, y: 470, s: 0.62 }, fran: { x: 800, y: 520, s: 0.95 }, carl: { x: 1900, y: 520, s: 0.9 }, left: { x: 640, y: 480, s: 0.78 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.wide);
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, withDim, fn) => { scene(() => { if (withDim) dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  const pulse = (id, t) => { const b = S.ents[id].init.s; tw(id, t, 0.01, { s: b }); tw(id, t + 0.01, 0.3, { s: b * 1.1 }, { ease: 'back' }); tw(id, t + 0.7, 0.3, { s: b }); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };
  const ring = (id, x, y, r, col, label, t, d) => { ui(id, '<g transform="rotate(-90)"><circle r="' + r + '" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="18"/><circle data-p pathLength="1" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="18" stroke-linecap="round"/></g>' + T(label, 26, '#fff'), x, y, { p: 1 }); pop(id, t); tw(id, t + 0.6, d, { p: 0 }, { ease: 'lin' }); };

  /* ===== S1: the same answer, paid for twice (world) ===== */
  blk('l1', 'l5', false, () => {
    cam(B('l1', 0), 0.01, 'wide');
    em('rep', '🔁', 90, 1000, 640); pop('rep', A('l1', 'again', -0.3)); wl('repL', 'same logo · fonts · layout · price', '#ffd166', 1000, 520, A('l1', 'logo', -0.1), 40);
    ['bF'].forEach((b) => pulse(b, A('l2', 'fridge', -0.2)));
    em('milk', '🥛', 90, 560, 640); pop('milk', A('l2', 'milk', -0.2)); wl('bb', 'best before', '#7ee0ff', 560, 540, A('l2', 'best', -0.1), 36); hide('milk', A('l3', 'meet', -0.3), 0.4); hide('bb', A('l3', 'meet', -0.3), 0.4);
    pulse('bF', A('l3', 'fran', 0)); pulse('bC', A('l3', 'carl', 0)); pulse('bO', A('l3', 'olga', 0));
    [['Fran = the browser cache', 'fran', '#22d3ee', 900], ['Carl = a shared cache (CDN)', 'carl', '#fbbf24', 1650], ['Olga = the origin, owns the truth', 'olga', '#c4b5fd', 2450]].forEach((c, i) => wl('who' + i, c[0], c[2], c[3], 360, A('l3', c[1], 0.2), 34));
    ['who0', 'who1', 'who2'].forEach((i) => hide(i, B('l4', -0.2), 0.4)); hide('rep', B('l4', -0.2), 0.4); hide('repL', B('l4', -0.2), 0.4);
    [['request → response', 'request', '#7ee0ff'], ['header: a labelled line', 'header', '#ffd166'], ['body: the content', 'body', '#3ddc84'], ['status: 200 OK · 304 Not Modified', 'status', '#ff9f6b'], ['fingerprint: changes when content changes', 'fingerprint', '#c084fc']].forEach((w, i) => C('wd' + i, w[0], 1350, 170 + i * 75, w[2], 'l4', w[1], 700, 0));
  });

  /* ===== S2: why two gates (dim) ===== */
  blk('l5', 'l10', true, () => {
    P('nw', 'without caching', '1000 loads a minute → the same files fetched 1000 times · wasted bandwidth, CPU, delay', 160, 140, 1600, 130, '#ff7b7b', 'l5', 'without');
    P('g1', 'GATE 1 · freshness', 'skip the trip entirely, for a window the server names up front (max-age)', 160, 310, 1600, 130, '#3ddc84', 'l6', 'freshness');
    P('g2', 'GATE 2 · validation', 'skip the resend once stale: “still the same?” → cheap answer (304)', 160, 480, 1600, 130, '#7ee0ff', 'l6', 'validation');
    C('b14', '14-byte price file · max-age=60 → 60 s of traffic = 0 origin requests', 960, 700, '#ffd166', 'l7', 'fourteen', 1100, -0.3); C('b304', 'after that: one cheap comparison → 304, no body', 960, 780, '#ffd166', 'l7', 'conditional', 860, 0);
    ui('q2', T('1) recent enough copy?   2) changed since I last checked?', 46, '#fff', { w: 1500 }), 960, 900, {}); pop('q2', A('l8', 'two', 0));
    C('rem', 'ask “can I skip the trip?” before “can I skip the resend?”', 960, 980, '#3ddc84', 'l9', 'before', 1000, 0);
  });

  /* ===== S3a: Cache-Control and the freshness window (world) ===== */
  blk('l10', 'l13', false, () => {
    cam(B('l10', -0.3), 1.6, 'wide');
    ['bF', 'bC'].forEach((b, i) => pulse(b, A('l10', ['browser', 'c'][i] === 'c' ? 'edge' : 'browser', 0)));
    ask('hdr', 'Cache-Control: public, max-age=60', '#a78bfa', 2450, 520, 960, 520, A('l11', 'cache', -0.1), 2.2);
    ring('r60', 1350, 200, 70, '#3ddc84', '60 s', A('l12', 'stores', -0.2), 8);
    wl('fresh', 'fresh: answered from memory, zero contact with Olga', '#3ddc84', 1350, 330, A('l12', 'memory', -0.2), 36);
    wl('stale', 'second 61: stale → must at least ask', '#ffb066', 1350, 400, A('l12', 'sixty', 1.0), 36);
  });
  blk('l13', 'l21', true, () => {
    const D = [['max-age=N', 'fresh for N seconds · any cache · a best-before date', '#3ddc84', 'l13', 'max'], ['s-maxage=N', 'overrides max-age · shared caches only (CDN)', '#7ee0ff', 'l14', 's max'], ['no-cache', 'MAY store · must revalidate before every reuse', '#ffd166', 'l15', 'no cache'], ['no-store', 'keep nothing, anywhere · self-destructing message', '#ff7b7b', 'l16', 'no store'], ['private', 'only one user’s own browser · a locker with your key', '#c084fc', 'l17', 'private'], ['public', 'shared caches may store, even with auth · a notice board', '#f472b6', 'l17', 'public'], ['immutable', 'this URL never changes: skip even reload checks · hashed file names only', '#ff9f6b', 'l18', 'immutable'], ['stale-while-revalidate=N', 'serve stale now, refresh in the background', '#60a5fa', 'l19', 'stale while'], ['stale-if-error=N', 'serve stale if the origin errors or is unreachable', '#34d399', 'l19', 'stale if']];
    D.forEach((d, i) => { const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5; rowBox('dr' + i, d[0], d[1], 90 + col * 900, 110 + row * 160, 880, 138, d[2], A(d[3], d[4], -0.25)); });
    C('who', 'max-age: HOW LONG · no-cache/no-store: UNDER WHAT CONDITIONS · public/private: WHO', 1350, 790, '#ffd166', 'l20', 'max', 800, -0.1);
    C('mix', 'no-cache ≠ no-store: keep-but-check vs keep-nothing', 1350, 880, '#ff7b7b', 'l20', 'mix', 760, -0.1);
  });

  /* ===== S4: validation with ETag (world) ===== */
  blk('l21', 'l27', false, () => {
    cam(B('l21', -0.3), 1.6, 'wide');
    wl('stl', 'stale copy: tag "0f26d0f1409cfc3c"', '#ffb066', 920, 560, A('l21', 'stale', 0.3) , 34);
    ask('q1', '❓ price?', '#60a5fa', 340, 560, 900, 560, B('l23', 0.2), 1.0);
    ask('inm', 'If-None-Match: "0f26d0f1409cfc3c"', '#22d3ee', 920, 600, 2430, 600, B('l24', 0.6), 2.2);
    ask('r304', '304 Not Modified · no body', '#3ddc84', 2450, 520, 960, 520, B('l25', 1.2), 2.2);
    card(A('l22', 'e tag', -0.2), 'ETag', 'an exact fingerprint the server chooses', { color: '#22d3ee' });
    card(A('l25', 'three', -0.1), '304 Not Modified', 'no body · copy fresh again', { color: '#3ddc84', slot: 1 });
    wl('okm', '✓ copy fresh again', '#3ddc84', 920, 440, A('l26', 'fresh', -0.2), 40);
    C('lm', 'Last-Modified = the same idea with a timestamp', 1350, 250, '#c084fc', 'l22', 'last', 620, 0);
  });
  blk('l27', 'l29', true, () => {
    P('ex', 'If-None-Match (ETag)', 'exact · byte for byte · wins when both are sent', 160, 180, 760, 150, '#22d3ee', 'l27', 'tag');
    P('lm2', 'If-Modified-Since', 'one-second resolution · misses same-second changes', 1000, 180, 760, 150, '#c084fc', 'l27', 'last');
    C('rfc', 'RFC 9110 §13.1.3 · the server prefers If-None-Match', 960, 420, '#ffd166', 'l27', 'rule', 800, 0);
    P('mis', 'classic mistake', 'a timestamp or per-process random value inside the hashed bytes → a new ETag on every request → the server never answers 304 again', 160, 560, 1600, 170, '#ff7b7b', 'l28', 'mistake');
    C('sil', 'caching silently stops working', 960, 800, '#ffb066', 'l28', 'silently', 600, 0);
  });

  /* ===== S5: Vary (world) ===== */
  blk('l29', 'l33', false, () => {
    cam(B('l29', -0.3), 1.6, 'carl'); tw('vera', B('l29', 0.5), 0.5, { o: 1 }); pulse('vera', A('l29', 'vera', 0));
    wl('vh', 'Vary: Accept-Encoding', '#ec4899', 1900, 380, A('l29', 'vary', 0), 44);
    em('gz', '🗜️', 80, 1760, 620); wl('gzl', 'gzip copy', '#7ee0ff', 1760, 700, A('l30', 'gzip', -0.2), 30); pop('gz', A('l30', 'gzip', -0.2));
    em('pl', '📄', 80, 2040, 620); wl('pll', 'plain copy', '#ffd166', 2040, 700, A('l30', 'do', 0.2), 30); pop('pl', A('l30', 'do', 0.2));
    C('nint', 'not interchangeable, even at the same URL', 1900, 250, '#7ee0ff', 'l30', 'interchangeable', 640, 0);
    ['vh', 'gz', 'gzl', 'pl', 'pll', 'nint'].forEach((i) => hide(i, A('l31', 'famous', -0.3), 0.4));
    wl('vc', 'Vary: Cookie  ✗', '#ff5d5d', 1900, 380, A('l31', 'cookie', 0), 50);
    for (let i = 0; i < 12; i++) { em('ck' + i, '🍪', 60, 1560 + (i % 6) * 100, 600 + Math.floor(i / 6) * 90); pop('ck' + i, A('l31', 'cookies', 0.1) + i * 0.1); }
    wl('ckl', 'one shelf per visitor → almost never a hit', '#ff7b7b', 1900, 790, A('l31', 'near', 0), 34);
  });
  blk('l32', 'l33', true, () => {
    C('f1', 'response differs per user → mark it private, skip the shared cache', 960, 300, '#c084fc', 'l32', 'private', 1000, -0.2); C('f2', 'or split cacheable, cookie-free parts from personal parts', 960, 400, '#7ee0ff', 'l32', 'split', 940, 0); C('f3', 'Vary is a correctness tool, not a speed tool', 960, 500, '#ffd166', 'l32', 'correctness', 760, 0);
  });

  /* ===== S6: one resource, two requests (dim sequence) ===== */
  blk('l33', 'g1', true, () => {
    const ST = [['1  cold request', 'no If-None-Match · Olga hashes → ETag · 200 + the full 14-byte body', 'l33', 'cold', '#ff9f6b'], ['2  stored', 'Fran keeps the body and the ETag', 'l34', 'stores', '#7ee0ff'], ['3  60 s pass', 'max-age window closes → the copy is stale', 'l34', 'sixty', '#ffb066'], ['4  conditional request', 'GET + If-None-Match: "0f26d0f1409cfc3c"', 'l34', 'conditional', '#c084fc'], ['5  Olga compares', 'recomputes the current tag → they match', 'l35', 'recomputes', '#ffd166'], ['6  304 Not Modified', 'no body written again · caching WORKING, not failing', 'l35', 'three', '#3ddc84']];
    ST.forEach((s, i) => rowBox('st' + i, s[0], s[1], 220, 130 + i * 140, 1480, 120, s[4], A(s[2], s[3], -0.3)));
  });

  /* ===== S7: Go code ===== */
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('d1', -0.3));
    const L1 = ['func (r Resource) etag() string {', '\tsum := sha256.Sum256(r.Body)', '\treturn `"` + hex.EncodeToString(sum[:8]) + `"` // fingerprint of the CONTENT', '}'];
    const c1 = S.codePanel('c1', L1, { x: 180, y: 90, w: 1560, fs: 29, title: 'etag.go', t0: B('g2', -0.2), times: L1.map((x, i) => A('g2', 'resource', 0) + i * 0.5) });
    c1.hl(1, A('g2', 'sha', 0)); c1.out(A('g3', 'handler', -0.3));
    const L2 = ['func Handler(get func() Resource, maxAge time.Duration) http.HandlerFunc {', '\treturn func(w http.ResponseWriter, req *http.Request) {', '\t\tres := get(); etag := res.etag()', '\t\tw.Header().Set("Cache-Control", "public, max-age=60, must-revalidate")', '\t\tw.Header().Set("ETag", etag)', '\t\tw.Header().Set("Last-Modified", res.LastModified.UTC().Format(http.TimeFormat))', '\t\tw.Header().Set("Vary", "Accept-Encoding")', '\t\tif inm := req.Header.Get("If-None-Match"); inm != "" {', '\t\t\tif inm == etag { w.WriteHeader(304); return }', '\t\t} else if ims := req.Header.Get("If-Modified-Since"); ims != "" {', '\t\t\tif t, err := http.ParseTime(ims); err == nil && !res.LastModified.After(t) {', '\t\t\t\tw.WriteHeader(304); return', '\t\t\t}', '\t\t}', '\t\tw.WriteHeader(200); w.Write(res.Body)', '\t}', '}'];
    const c2 = S.codePanel('c2', L2, { x: 140, y: 100, w: 1640, fs: 26, title: 'handler.go', t0: A('g3', 'handler', -0.2), times: L2.map((x, i) => A('g3', 'gets', 0) + i * 0.3) });
    c2.hl(3, A('g3', 'cache', 0)); c2.hl(7, A('g4', 'if', 0)); c2.hl(8, A('g4', 'equals', 0)); c2.hl(9, A('g4', 'fall', 0)); c2.hl(14, A('g4', 'otherwise', 0));
    chip('gt', 'tests: repeat request with the current tag → 304 ✓ · Last-Modified fallback ✓ · go test -race', 960, 940, '#3ddc84', A('g5', 'tests', 0), { w: 1300 });
    S.scope(null);
  });
  kill(sc, B('d1', -0.3), 0.5);

  /* ===== S8: deep dive ===== */
  blk('d1', 't1', true, () => {
    P('d1a', 'strong vs weak validators', 'ETag without W/ = byte-identical · W/"…" = same meaning, maybe not same bytes · Range requests need a strong one', 140, 130, 1640, 170, '#7ee0ff', 'd1', 'strong');
    P('d2a', 'must-revalidate', 'without it a cache MAY serve stale (e.g. origin unreachable) · with it: never stale without a successful check', 140, 330, 1640, 170, '#ffd166', 'd2', 'must');
    P('d3a', 'a 304 still carries headers', 'a fresh Cache-Control, a changed ETag · the body is elided, not the metadata', 140, 530, 1640, 170, '#3ddc84', 'd3', 'third');
    P('d4a', 'request collapsing', 'many concurrent stale requests → ONE revalidation upstream · avoids a thundering herd · a CDN/proxy detail, not a header', 140, 730, 1640, 170, '#c084fc', 'd4', 'collapsing');
  });

  /* ===== S9: trade-offs, failures, monitoring ===== */
  blk('t1', 'q0', true, () => {
    C('tr1', 'live auction bid · stock ticker → no-store or a very short max-age', 960, 130, '#ff9f6b', 't1', 'auction', 1200, -0.2);
    C('tr2', 'never stale-while-revalidate where a stale read is a BUG: inventory near zero · payment status', 960, 210, '#ff7b7b', 't2', 'never', 1300, -0.2); C('tr3', 'ETags cost a hash · for huge bodies Last-Modified is cheaper but coarser', 960, 290, '#ffd166', 't2', 'tags', 1100, -0.3);
    P('fm1', 'stale data served silently', 'max-age far too long → shorten it, or no-cache + strong ETags', 140, 380, 1640, 110, '#ff7b7b', 't3', 'stale');
    P('fm2', 'a per-user page cached at a shared cache', 'Ben sees someone else’s account → mark it private · never public with auth or cookies', 140, 510, 1640, 110, '#ff9f6b', 't3', 'user', -0.4);
    P('fm3', 'Vary: Cookie kills sharing', 'split cacheable parts from personal parts', 140, 640, 1640, 110, '#ffd166', 't4', 'vary');
    P('fm4', 'an ETag that changes every request', 'hash only stable, meaningful fields', 140, 770, 1640, 110, '#c084fc', 't4', 'tag');
    C('mn1', '👁 hit ratio · 304 ratio (low 304 on stable content = unstable ETag)', 960, 930, '#3ddc84', 't5', 'hit', 1100, -0.2); C('mn2', 'static files: hashed name + public, max-age=31536000, immutable', 960, 1010, '#7ee0ff', 't5', 'recipe', 1100, -0.2);
  });

  /* ===== S10: interview ===== */
  blk('q0', 's0', true, () => {
    const QA = [['no-cache vs no-store?', 'no-cache: store, but revalidate before every reuse (304 still saves the download) · no-store: keep nothing', 'q1', 'one'], ['Why does If-None-Match beat If-Modified-Since?', 'ETags are exact · Last-Modified has 1 s resolution and misses same-second round trips', 'q2', 'two'], ['Every request returns 200: is caching broken?', 'not necessarily · the bug is a repeat request with a correct If-None-Match STILL getting 200 → unstable ETag', 'q3', 'three'], ['stale-while-revalidate vs a shorter max-age?', 'user never waits on the origin: serves stale instantly, refreshes in the background', 'q4', 'four'], ['Why is Vary: Cookie almost always a mistake?', 'one entry per visitor → shared cache never hits · use private instead', 'q5', 'five'], ['CDN s-maxage=300, browser still refetches?', 's-maxage is for shared caches only · browser max-age absent/0 → revalidates each load · set both deliberately', 'q6', 'six']];
    QA.forEach((q, i) => { const y = 100 + i * 150; ui('qa' + i, rect(0, 0, 1640, 134, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 40 }) + T(q[1], 25, '#fff', { anchor: 'start', dx: 26, dy: 94 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });

  /* ===== S11: summary ===== */
  blk('s0', 'rn1', true, () => {
    ui('sh', T('SUMMARY', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('s0', 0));
    const SUM = [['1', 'Freshness skips the trip · validation skips the resend, once the copy is stale', 's1a', '#7ee0ff'], ['2', 'Cache-Control: how long · under what conditions · who. immutable for hashed files', 's1b', '#3ddc84'], ['3', 'stale-while-revalidate / stale-if-error trade a little staleness for speed and resilience', 's1c', '#ffd166'], ['4', 'ETag = exact · Last-Modified = 1 s · If-None-Match wins · a match → 304, no body = caching works', 's1d', '#22d3ee'], ['5', 'Vary splits by a header: Accept-Encoding fine, Cookie kills sharing · no timestamps in an ETag', 's1e', '#ff7b7b'], ['6', 'strong tags for Range · must-revalidate · a 304 keeps headers · caches collapse revalidations', 's1f', '#c084fc'], ['7', 'Ask “can I skip the trip?” before “can I skip the resend?”', 's1g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1640, 108, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 26, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 140, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'e1', true, () => {
    C('rn1a', '📘 notes: HTTP Caching - Cache-Control, ETag, Conditional Requests  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1300, 0);
    C('rn1b', '⬅ before: HTTP-1.1 vs HTTP-2 vs HTTP-3 · HTTP Fundamentals', 960, 410, '#ffd166', 'rn1', 'before', 1300, 0);
    C('rn1c', '➡ after: CDN and Edge · Caching Fundamentals', 960, 490, '#3ddc84', 'rn1', 'after', 1300, 0);
    C('rn1d', '↔ compare: Cache Invalidation, TTL and Consistency (Redis-level caches)', 960, 570, '#c084fc', 'rn1', 'compare', 1300, 0);
  });
  cam(B('e1', -0.4), 1.4, 'left');
  tw('ben', B('e1', 0.5), 0.3, { r: -5 }); tw('ben', B('e1', 0.9), 0.3, { r: 5 }); tw('ben', B('e1', 1.3), 0.3, { r: 0 });
  ui('endT', T('HTTP Caching', 130, '#fff', { w: 1100 }), 960, 440, {}); ui('endS', T('can I skip the trip? can I skip the resend?', 48, '#cdd6e6', { w: 1100 }), 960, 570, {});
  pop('endT', B('e2', 1.2)); pop('endS', B('e2', 1.8));
})();
