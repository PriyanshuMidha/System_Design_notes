/* Network debugging: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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

  // ---------- cast and world: Packet City ----------
  const CFG = {
    dana: { who: 'DANA', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '🔍', w: 96, name: 'Dana', ring: '#38bdf8' },
    rio: { who: 'RIO', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Rio', ring: '#4ade80' },
    dex: { who: 'DEX', skin: '#e3b08a', shirt: '#92400e', pants: '#333', glasses: 1, hair: '#8a8a8a', tie: '#fbbf24', hold: '📖', w: 108, name: 'Dex', ring: '#fbbf24' },
    mel: { who: 'MEL', skin: '#9b6a47', shirt: '#ca8a04', pants: '#444', hat: 'cap', hatColor: '#f59e0b', hold: '🗺️', w: 112, name: 'Mel', ring: '#f59e0b' },
    nell: { who: 'NELL', skin: '#f1c9a5', shirt: '#0d9488', pants: '#2a2540', hat: 'cap', hatColor: '#115e59', hair2: 'long', hold: '🔦', w: 94, name: 'Nell', ring: '#2dd4bf' },
    tess: { who: 'TESS', skin: '#f0c4a0', shirt: '#7c3aed', pants: '#2a2540', glasses: 1, hair: '#7a3b1a', hair2: 'long', hold: '🛂', blush: 1, w: 90, name: 'Tess', ring: '#a78bfa' },
    curt: { who: 'CURT', skin: '#d9a37a', shirt: '#dc2626', pants: '#333', hat: 'cap', hatColor: '#991b1b', hold: '⏱️', w: 106, name: 'Curt', ring: '#f87171' },
    tad: { who: 'TAD', skin: '#e8b48a', shirt: '#475569', pants: '#222', glasses: 1, hair: '#222', hold: '🎧', w: 100, name: 'Tad', ring: '#94a3b8' },
    bo: { who: 'BO', skin: '#e0ac82', shirt: '#2563eb', pants: '#1e3a8a', hair: '#3a2a1a', hold: '💻', w: 104, name: 'Bo', ring: '#60a5fa' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset=".62" stop-color="#2c3a75"/><stop offset="1" stop-color="#c9805a"/></linearGradient></defs>' + rect(-1600, -1600, 9400, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 110 }, (_, i) => circ((i * 197) % 7600 - 700, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.75)')).join('') + circ(5400, 120, 60, '#f4f1d0') , keep);
  mk('skyline', Array.from({ length: 90 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#1b2650' : '#222f63'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 9400, 2000, '#26332b') + rect(-1600, 830, 9400, 70, '#363948') + Array.from({ length: 130 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon, sc2) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY, s: sc2 || 1 }, keep));
  bld('bH', 250, '#1e3a5f', 'DANA · HQ', '🕵️'); bld('bX', 950, '#92400e', 'PHONE BOOK · DEX', '📖'); bld('bM', 1650, '#a16207', 'ROAD SURVEY · MEL', '🗺️'); bld('bN', 2350, '#0f766e', 'THE GATE · NELL', '🚪'); bld('bT', 3050, '#6d28d9', 'PASSPORTS · TESS', '🛂'); bld('bC', 3750, '#b91c1c', 'COURIER · CURT', '⏱️');
  bld('bP', 4400, '#475569', 'REX · PROXY', '🔀'); bld('b1', 4900, '#1d4ed8', 'BACKEND 1', '🖥️', 0.7); bld('b2', 5230, '#1d4ed8', 'BACKEND 2', '🖥️', 0.7); bld('b3', 5560, '#1d4ed8', 'BACKEND 3 · BO', '🖥️', 0.7);
  mk('tower', rect(-70, -620, 140, 620, '#334155') + rect(-120, -700, 240, 100, '#475569', { rx: 10 }) + Em('📡', 80, { dy: -650 }) + T('TAD · TOWER', 26, '#fff', { dy: -520 }), Object.assign({ x: 6050, y: GY }, keep));
  mkChar('dana', CFG.dana, 380, 830, keep); mkChar('rio', CFG.rio, 270, 830, keep);
  mkChar('dex', CFG.dex, 970, 830, keep); mkChar('mel', CFG.mel, 1670, 830, keep); mkChar('nell', CFG.nell, 2370, 830, keep); mkChar('tess', CFG.tess, 3070, 830, keep); mkChar('curt', CFG.curt, 3770, 830, keep);
  mkChar('bo', CFG.bo, 5580, 830, Object.assign({ s: 0.85 }, keep)); mkChar('tad', CFG.tad, 6060, 830, keep);
  [['Dana', 380, '#38bdf8'], ['Rio', 270, '#4ade80'], ['Dex', 970, '#fbbf24'], ['Mel', 1670, '#f59e0b'], ['Nell', 2370, '#2dd4bf'], ['Tess', 3070, '#a78bfa'], ['Curt', 3770, '#f87171'], ['Bo', 5580, '#60a5fa'], ['Tad', 6060, '#94a3b8']].forEach((n) => mk('nm' + n[0], T(n[0], 36, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['DANA', 'RIO', 'DEX', 'MEL', 'NELL', 'TESS', 'CURT', 'TAD', 'BO'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { hq: { x: 520, y: 520, s: 0.9 }, wide: { x: 3000, y: 470, s: 0.3 }, dex: { x: 1000, y: 520, s: 0.95 }, mel: { x: 1700, y: 520, s: 0.95 }, nell: { x: 2400, y: 520, s: 0.95 }, tess: { x: 3100, y: 520, s: 0.95 }, curt: { x: 3800, y: 520, s: 0.95 }, back: { x: 5150, y: 520, s: 0.78 }, bo: { x: 5450, y: 520, s: 0.95 }, tower: { x: 5800, y: 520, s: 0.85 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.hq);
  const C = (id, text, x, y, col, l, ph, w, off) => { const ww = Math.max(w || 200, text.length * 14.5 + 60); const xx = Math.min(Math.max(x, ww / 2 + 20), 1900 - ww / 2); return chip(id, text, xx, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: ww }); };
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, fn) => { scene(() => { fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };
  // evidence card (screen space): title + mono lines that appear one after another
  const ev = (id, title, lines, x, y, w, col, times, tEnd) => {
    const maxLen = Math.max.apply(null, lines.map((l) => l.length));
    w = Math.min(Math.max(w, 700), 1400); x = Math.max(30, Math.min(x, 1500 - w));
    const fs = Math.max(17, Math.min(26, Math.floor((w - 56) / (maxLen * 0.62))));
    const h = 70 + lines.length * 42;
    ui(id, rect(0, 0, w, h, 'rgba(8,12,24,.94)', { rx: 16, stroke: col, sw: 4 }) + T(title, 26, col, { anchor: 'start', dx: 24, dy: 34 }), x, y, {}); pop(id, times[0] - 0.4);
    lines.forEach((ln, i) => { ui(id + '_' + i, T(ln, fs, i === lines.length - 1 && /✗|✓/.test(ln) ? col : '#e6edf7', { anchor: 'start', font: mono }), x + 24, y + 62 + i * 42, {}); pop(id + '_' + i, times[i]); });
    [id].concat(lines.map((l, i) => id + '_' + i)).forEach((k) => hide(k, tEnd, 0.4));
  };
  // the case board: one status line per suspect layer
  const SUSP = [['DNS', '📖'], ['TCP', '🚪'], ['TLS', '🛂'], ['HTTP', '📦']];
  ui('boardBg', rect(0, 0, 330, 300, 'rgba(8,12,24,.9)', { rx: 18, stroke: '#38bdf8', sw: 4 }) + T('CASE BOARD', 26, '#38bdf8', { dx: 165, dy: 32 }), 1560, 30, {}); pop('boardBg', B('l9', -0.5));
  SUSP.forEach((s, i) => { ui('cb' + i, T(s[1] + ' ' + s[0] + '  ❓', 34, '#e6edf7', { anchor: 'start' }), 1590, 100 + i * 58, {}); pop('cb' + i, B('l9', i * 0.3)); });
  const stamp = (i, t, ok) => tx('cb' + i, t, SUSP[i][1] + ' ' + SUSP[i][0] + (ok ? '  ✅ cleared' : '  🚨 lead'));
  const walk = (id, t, d, x) => { const e = S.ents[id]; tw(id, t, 0.001, { f: x < e.cur.x ? -1 : 1 }); tw(id, t, d, { x }, { ease: 'inOut', walk: true }); };

  /* ===== S1: the alarm ===== */
  blk('l1', 'l7', () => {
    em('alarm', '🚨', 130, 420, 430); pop('alarm', B('l1', 0.6)); wd('al', T('1% of requests → 502 Bad Gateway', 44, '#ff7b7b', { w: 900 }), 420, 330); pop('al', A('l1', 'one', -0.2));
    ['alarm', 'al'].forEach((i) => hide(i, A('l2', 'rookie', -0.5), 0.5));
    walk('rio', B('l2', 0.5), 1.8, 520);
    ['📖 the phone book (DNS)', '🚪 the road and the gate (TCP)', '🛂 the security check (TLS)', '📦 the server (HTTP)'].forEach((t, i) => wl('sq' + i, t, ['#fbbf24', '#2dd4bf', '#a78bfa', '#f87171'][i], 430, 330 - 0 + i * 0, A('l3', ['phone', 'road', 'security', 'server'][i], 0), 40));
    ['sq0', 'sq1', 'sq2', 'sq3'].forEach((i, k) => { tw(i, A('l3', ['phone', 'road', 'security', 'server'][k], 0) + 0.01, 0.01, { y: 300 + k * 56 }); hide(i, B('l4', 0.4), 0.4); });
    C('rule1', 'every step has its own witness · its own logbook', 1200, 330, '#3ddc84', 'l4', 'witness', 760, -0.2);
    const W = [['DNS: the phone book · name → IP', 'name', '#fbbf24'], ['IP address · a machine', 'machine', '#7ee0ff'], ['port · a numbered door (443 = HTTPS)', 'port', '#ff9f6b'], ['TCP · a reliable pipe, opened by a handshake', 'pipe', '#2dd4bf'], ['TLS · encryption + a certificate check', 'encryption', '#a78bfa'], ['socket · the OS handle for one connection', 'socket', '#f87171'], ['packet · a small chunk · flag · a command option', 'packet', '#4ade80']];
    W.forEach((w, i) => C('wd' + i, w[0], 1560, 360 + i * 62, w[2], 'l5', w[1], 760, 0)); W.forEach((w, i) => hide('wd' + i, B('l6', -0.2), 0.4));
    ['1 · was the address right?', '2 · did the truck leave?', '3 · did the gate guard let it in?', '4 · did the receiver sign?'].forEach((t, i) => C('par' + i, '📦 ' + t, 1400, 360 + i * 70, '#ffd166', 'l6', ['address', 'truck', 'guard', 'sign'][i], 620, -0.1));
  });

  /* ===== S2: the rules (wall map) ===== */
  blk('l7', 'l13', () => {
    cam(B('l7', -0.3), 1.2, { x: 760, y: 520, s: 0.9 });
    C('e7', 'curl: (7) Failed to connect · curl: (35) SSL connect error → a layer, not the WHY', 1300, 250, '#ffb066', 'l7', 'seven', 1100, -0.3);
    C('e8', 'the case: after a deploy, 502 for 1% of requests', 1300, 320, '#ff7b7b', 'l8', 'deploy', 720, -0.2);
    ui('wall', rect(0, 0, 1280, 470, 'rgba(8,12,24,.9)', { rx: 18, stroke: '#38bdf8', sw: 4 }) + T('DANA’S WALL MAP · one witness per layer', 30, '#38bdf8', { dx: 640, dy: 36 }), 320, 400, {}); pop('wall', A('l9', 'stack', -0.5));
    [['DNS', 'Dex · dig', '#fbbf24', 'dex'], ['TCP reachability', 'Nell · nc, ss  ·  Mel · traceroute, mtr', '#2dd4bf', 'reachability'], ['TLS', 'Tess · openssl s_client', '#a78bfa', 'tess'], ['HTTP', 'Curt · curl -v, curl -w', '#f87171', 'curt'], ['the wire', 'Tad · tcpdump', '#94a3b8', 'wire']].forEach((r, i) => { ui('wm' + i, T(r[0], 30, r[2], { anchor: 'start' }) + T('→ ' + r[1], 28, '#e6edf7', { anchor: 'start', dx: 300 }), 360, 480 + i * 66, {}); pop('wm' + i, A('l9', r[3], 0)); });
    C('top', 'work TOP-DOWN: DNS → TCP → TLS → HTTP · Tad only when nothing else explains it', 1300, 160, '#3ddc84', 'l10', 'rule', 1200, -0.2);
    ['wall', 'wm0', 'wm1', 'wm2', 'wm3', 'wm4'].forEach((i) => hide(i, A('l11', 'wall', -0.3), 0.5));
    const PB = [['request times out?', 'nc: no route / timeout → routing or a firewall · refused → nothing listening · open but curl hangs → the app never answers', 'l11', 'time'], ['name does not resolve (NXDOMAIN)', 'Dex: dig +trace', 'l12', 'name'], ['502 / 504 from a proxy', 'Curt: curl straight to the backend, bypass the proxy', 'l12', 'five'], ['certificate error', 'Tess: openssl s_client', 'l12', 'certificate'], ['200 but slow', 'Curt: curl -w phase timing', 'l12', 'slow'], ['still unclear', 'Tad: tcpdump', 'l12', 'unclear']];
    PB.forEach((r, i) => { P('pb' + i, r[0], r[1], 150, 480 + i * 92 - (i > 0 ? 0 : 0), 1620, i === 0 ? 150 : 86, ['#2dd4bf', '#fbbf24', '#f87171', '#a78bfa', '#f87171', '#94a3b8'][i], r[2], r[3]); });
    ['pb1', 'pb2', 'pb3', 'pb4', 'pb5'].forEach((i, k) => tw(i, A('l12', 'name', -0.5), 0.01, { y: 0 }));
  });
  blk('l11', 'l13', () => {});

  /* ===== S3: suspect one, the phone book ===== */
  blk('l13', 'l23', () => {
    cam(B('l13', -0.3), 2.4, 'dex'); walk('dana', B('l13', 0.3), 3.2, 880); walk('rio', B('l13', 0.5), 3.2, 790);
    ask('q1', 'dig example.com A', '#38bdf8', 880, 520, 960, 520, B('l14', 1.0), 1.0);
    ev('dg', 'dig example.com A', ['status: NOERROR', 'ANSWER SECTION: 2 records', 'example.com. 196 IN A 172.66.147.243', 'example.com. 196 IN A 104.20.23.154', 'Query time: 30 msec · SERVER 100.64.0.1#53'], 1180, 90, 960, '#fbbf24', [A('l15', 'status', 0), A('l15', 'answer', 0), A('l16', 'hundred', 0.2), A('l16', 'and', 0.2), A('l15', 'query', 0)], B('l17', 0));
    card(A('l15', 't t l', -0.2), 'TTL = 196 s', 'how long this answer stays cached', { color: '#fbbf24', slot: 1 });
    ev('nx', 'dig nonexistent-domain-xyz123abc.com A', ['no ANSWER SECTION', 'AUTHORITY: com. SOA a.gtld-servers.net …', 'Query time: 82 msec', '→ NXDOMAIN: “this exact name does not exist”', '≠ a timeout: the resolver never answered'], 1180, 90, 960, '#ff9f6b', [A('l18', 'no', 0), A('l18', 'authority', 0), A('l18', 'authority', 1.2), A('l18', 'signature', 0), A('l18', 'timeout', 0)], B('l19', 0));
    ev('cn', 'dig www.github.com CNAME +short', ['github.com.', '↳ how a subdomain points at a CDN or load balancer', 'nslookup: same info, friendlier · dig shows TTL + flags'], 1180, 90, 960, '#7ee0ff', [A('l19', 'answers', 0), A('l19', 'c d n', 0), A('l19', 'ns', 0)], B('l20', 0));
    ev('fl', 'dig flags', ['qr  this is a RESPONSE', 'rd  recursion was requested', 'ra  the server supports recursion', 'ad  validated with DNSSEC (missing ad on a signed zone = a finding)'], 1100, 90, 1100, '#c084fc', [A('l20', 'q', 0), A('l20', 'r', 0.3), A('l20', 'r a', 0), A('l20', 'a d', 0)], B('l21', 0));
    em('rt', '🌍', 90, 1300, 420); em('tl', '🗂️', 90, 1500, 420); em('au', '📖', 90, 1700, 420);
    pop('rt', A('l21', 'root', -0.1)); pop('tl', A('l21', 'dot', 0.1)); pop('au', A('l21', 'example', 0.3));
    wl('trs', 'dig +trace: root → .com → authoritative · never a cached answer', '#3ddc84', 1500, 330, A('l21', 'trace', -0.3), 34);
    ['rt', 'tl', 'au', 'trs'].forEach((i) => hide(i, B('l22', 0.2), 0.4));
    stamp(0, A('l22', 'dex', -0.3), true); wl('ok1', '✅ DNS cleared', '#3ddc84', 970, 420, A('l22', 'cleared', -0.4), 44); hide('ok1', End('l22', 0.8), 0.4);
  });

  /* ===== S4: suspect two, the road and the gate ===== */
  blk('l23', 'l32', () => {
    walk('dana', B('l23', 0.2), 3.2, 1580); walk('rio', B('l23', 0.4), 3.2, 1490); cam(B('l23', -0.2), 2.4, 'mel');
    ev('tr', 'traceroute -m 5 example.com', ['1  *', '2  205.220.19.25            14.6 ms', '3  205.220.18.3             16.2 ms', '4  …airtelbroadband.in      56.4 ms', '5  182.79.205.103           87.5 ms'], 1180, 90, 900, '#f59e0b', [A('l24', 'five', 0), A('l24', 'hop', 1.0), A('l24', 'hop', 3.0), A('l24', 'fifty', 0), A('l24', 'eighty', 0)], B('l25', 0));
    ev('st', '* = that hop did not reply', ['often a router that drops these messages · NOT a failure', 'a TREND of timeouts at the same hop, across runs = real', 'a clean road does not clear the app · Mel measures the PATH'], 1100, 90, 1100, '#ff9f6b', [A('l26', 'star', 0), A('l26', 'trend', 0), A('l26', 'clean', 0)], B('l27', 0));
    ev('mt', 'mtr = traceroute that never stops', ['live loss % per hop', 'jitter per hop', 'one slow hop vs a hop dropping 20% of packets'], 1180, 90, 900, '#f59e0b', [A('l27', 'loss', 0), A('l27', 'jitter', 0), A('l27', 'separates', 0)], B('l28', 0));
    walk('dana', B('l28', 0.3), 2.6, 2290); walk('rio', B('l28', 0.5), 2.6, 2200); cam(B('l28', 0), 2.4, 'nell');
    ev('nc', 'nc -vz -w3 example.com 443', ['Connection to example.com port 443 succeeded!  ✓', 'nc -vz 127.0.0.1 1', 'nc: connectx … failed: Connection refused  ✗'], 1180, 90, 960, '#2dd4bf', [A('l29', 'succeeded', 0), A('l29', 'port', 1.5), A('l29', 'refused', 0)], B('l30', 0));
    em('gok', '✅', 90, 2350, 450); em('gno', '🚫', 90, 2480, 450); pop('gok', A('l29', 'succeeded', 0)); pop('gno', A('l29', 'refused', 0));
    ev('rf', 'refused vs timed out', ['refused → a packet reached the host · the OS said “nobody listens here” · the road works', 'timed out → no reply at all · a firewall drop or a dead route'], 1000, 90, 1200, '#ffd166', [A('l30', 'refused', 0), A('l30', 'timed', 0)], B('l31', 0.6));
    ['gok', 'gno'].forEach((i) => hide(i, B('l31', 0), 0.4));
    stamp(1, A('l31', 'gate', 0), true); wl('ok2', '✅ road + gate cleared', '#3ddc84', 2350, 420, A('l31', 'cleared', -0.4), 40); hide('ok2', End('l31', 0.8), 0.4);
  });

  /* ===== S5: suspect three, the passport inspector ===== */
  blk('l32', 'l37', () => {
    walk('dana', B('l32', 0.2), 3.2, 2980); walk('rio', B('l32', 0.4), 3.2, 2890); cam(B('l32', -0.2), 2.4, 'tess');
    ev('cc', 'openssl s_client -connect example.com:443 -servername example.com', ['Certificate chain', ' 0  s:/CN=example.com', '    i:/…/CN=Example CA Intermediate', ' 1  s:/…/CN=Example CA Intermediate', '    i:/…/CN=Example Root CA'], 1060, 70, 1180, '#a78bfa', [A('l33', 'certificate', 0), A('l33', 'certificate', 0.6), A('l33', 'intermediate', 0), A('l33', 'intermediate', 0.8), A('l33', 'root', 0)], B('l34', 0));
    ev('t3', 'three facts decide everything', ['1  -servername must match the cert (CN / subjectAltName)', '2  Verify return code: 0 (ok) = the chain validated', '    non-zero, e.g. 20 = incomplete chain / untrusted CA', '3  validity dates: openssl x509 -noout -dates → expired?'], 1000, 90, 1280, '#a78bfa', [A('l34', 'one', 0), A('l34', 'two', 0), A('l34', 'non', 0), A('l34', 'three', 0)], B('l35', 0));
    ev('sn', 'always pass -servername', ['without SNI the server may hand you a DIFFERENT certificate', 'the classic script bug: works in a browser, fails in a script'], 1000, 90, 1200, '#ff7b7b', [A('l35', 'without', 0), A('l35', 'missing', 0)], B('l36', 0.6));
    stamp(2, A('l36', 'tess', 0), true); wl('ok3', '✅ TLS cleared', '#3ddc84', 3070, 420, A('l36', 'cleared', -0.3), 44); hide('ok3', End('l36', 0.8), 0.4);
  });

  /* ===== S6: suspect four, the courier ===== */
  blk('l37', 'l46', () => {
    walk('dana', B('l37', 0.2), 3.2, 3680); walk('rio', B('l37', 0.4), 3.2, 3590); cam(B('l37', -0.2), 2.4, 'curt');
    ev('cv', 'curl -v  ·  three kinds of lines', ['*  curl’s own commentary: resolved · trying · connected · TLS 1.3 · h2', '>  what curl SENT:  GET / HTTP/2  ·  Host  ·  user-agent', '<  what it RECEIVED:  HTTP/2 200  ·  content-type  ·  server'], 1000, 90, 1200, '#f87171', [A('l38', 'star', 0), A('l38', 'greater', 0), A('l38', 'less', 0)], B('l39', 0));
    ev('c3', 'the * lines come from curl’s logic, not the wire', ['a connection failure shows up in the * lines, before any HTTP', 'ground truth → ask Tess (openssl) or Tad (tcpdump)'], 1000, 90, 1200, '#ffb066', [A('l39', 'connection', 0), A('l39', 'ground', 0)], B('l40', 0));
    ui('sw', T('curl -w   dns 0.0026 · connect 0.0031 · tls 0.1801 · ttfb 0.2319 · total 0.2320', 28, '#f87171', { w: 1700, font: mono }), 960, 110, {}); pop('sw', A('l40', 'd n s', -0.3)); hide('sw', B('l42', 0), 0.4);
    [['DNS', 0.0026, '#fbbf24'], ['connect', 0.0005, '#2dd4bf'], ['TLS ≈177 ms', 0.177, '#a78bfa'], ['server think ≈51 ms', 0.0518, '#f87171']].forEach((s, i, arr) => { const x0 = 360 + arr.slice(0, i).reduce((a, b) => a + Math.max(b[1] * 4200, 40), 0); const w = Math.max(s[1] * 4200, 40); ui('tb' + i, rect(0, 0, w, 90, s[2], { rx: 8 }) + T(i > 1 ? s[0] : '', 26, '#111', {}).replace('x="0"', 'x="' + w / 2 + '"'), x0, 190, {}); pop('tb' + i, A('l41', ['cumulative', 'subtract', 'about', 'about'][i], 0) + (i === 3 ? 1.0 : 0)); hide('tb' + i, B('l42', 0), 0.4); });
    C('sub', 'cumulative: SUBTRACT consecutive fields for each phase’s own cost', 1000, 330, '#ffd166', 'l41', 'careful', 940, -0.2); hide('sub', B('l42', 0), 0.4);
    ev('rs', 'curl --resolve example.com:443:172.66.147.243', ['forces ONE address · no system DNS involved', 'total:0.2119s  code:200', 'test a new server before changing a record · test one node behind a load balancer'], 1000, 90, 1260, '#3ddc84', [A('l42', 'force', 0), A('l42', 'resolve', 1.0), A('l42', 'standard', 0)], B('l43', 0));
    cam(B('l43', 0), 2.2, 'back'); ask('dn', 'go to each backend, bypass the proxy', '#38bdf8', 3680, 520, 3900, 520, A('l43', 'straight', -0.3), 1.0);
    walk('curt', A('l44', 'backend', -0.5), 3.0, 4840); 
    bubble('r1', '200 · fast ✓', '#3ddc84', 4900, 460); pop('r1', A('l44', 'one', 0)); bubble('r2', '200 · fast ✓', '#3ddc84', 5230, 460); pop('r2', A('l44', 'two', 0)); bubble('r3', '⏳ hangs · resets ✗', '#ff5d5d', 5560, 430); pop('r3', A('l44', 'three', 0));
    stamp(3, A('l44', 'three', 0.5), false);
    walk('dana', A('l45', 'backend', -1.0), 3.6, 5300); walk('rio', A('l45', 'backend', -0.8), 3.6, 5200);
  });

  /* ===== S7: the lead, sockets ===== */
  blk('l46', 'l52', () => {
    cam(B('l46', -0.3), 1.6, 'bo'); walk('nell', B('l46', 0.0), 4.0, 5440);
    ev('ss', 'ss -tan   (backend 3)', ['State       Local            Peer', 'LISTEN      0.0.0.0:443      0.0.0.0:*', 'ESTAB       10.0.1.5:51322   10.0.2.9:443', 'CLOSE-WAIT  10.0.1.5:51400   10.0.2.9:443', 'CLOSE-WAIT  10.0.1.5:51401   10.0.2.9:443', '… hundreds more CLOSE-WAIT'], 700, 80, 980, '#2dd4bf', [A('l47', 'hundreds', -0.6), A('l47', 'hundreds', -0.3), A('l47', 'hundreds', -0.1), A('l47', 'hundreds', 0), A('l47', 'hundreds', 0.4), A('l47', 'hundreds', 0.8)], B('l48', 0));
    ev('sm', 'TCP state machine · read the state → which side is stuck', ['SYN_SENT  → the SYN or its reply never arrived: routing / firewall', 'TIME_WAIT (many, after a load test) → normal cleanup, not a bug'], 600, 90, 1280, '#7ee0ff', [A('l48', 's y n', 0), A('l48', 'time', 0)], B('l49', 0));
    ev('cw', 'CLOSE_WAIT = a LEAK', ['the peer sent a FIN (“I am done”)', 'your app accepted it … and never called close()', 'the socket waits for the local side to finish'], 700, 90, 1100, '#ff5d5d', [A('l49', 'peer', 0), A('l49', 'never', 0), A('l49', 'sits', 0)], B('l50', 0));
    ev('lq', 'LISTEN row: Recv-Q climbing toward the backlog limit', ['connections arrive faster than accept() is called', 'at the limit the kernel drops or refuses new ones', 'macOS has no ss: use  netstat -an'], 700, 90, 1100, '#ffd166', [A('l50', 'receive', 0), A('l50', 'limit', 0), A('l50', 'mac', 0)], B('l51', 0));
    wl('lk', '🕳️ a leak in the APPLICATION, not the network', '#ff9f6b', 5450, 380, A('l51', 'leak', -0.2), 40);
    walk('dana', B('l51', 0.2), 2.5, 5900); walk('rio', B('l51', 0.4), 2.5, 5800);
  });

  /* ===== S8: the eavesdropper ===== */
  blk('l52', 'l57', () => {
    cam(B('l52', -0.3), 2.0, 'tower');
    ev('td', 'sudo tcpdump -n "host 172.66.147.243 and port 443"', ['[S]    10.0.1.5.51322 > 172.66.147.243.443   SYN', '[S.]   172.66.147.243.443 > 10.0.1.5.51322   SYN-ACK', '[.]    10.0.1.5.51322 > …443                 ACK', '[P.]   10.0.1.5.51322 > …443   length 516    TLS ClientHello', '        … 181 ms gap …', '[P.]   …443 > 10.0.1.5.51322   length 516    first bytes'], 560, 70, 1320, '#94a3b8', [A('l53', 'capital', 0), A('l53', 'sin', 0.4), A('l53', 'bare', 0), A('l53', 'fourth', 0), A('l53', 'gap', 0), A('l53', 'fifth', 0)], B('l54', 0));
    ev('bp', 'BPF filter = a small language', ['tcp[tcpflags] & tcp-syn != 0   → count only connection ATTEMPTS', 'host a and host b                 → follow ONE conversation', 'narrow it, or a busy interface drowns you'], 560, 90, 1320, '#c084fc', [A('l54', 'sin', 0), A('l54', 'host', 0), A('l54', 'narrow', 0)], B('l55', 0));
    ev('wn', 'tcpdump needs root, and sees payloads', ['never run it without a tight filter', 'beyond one line:  tcpdump -w capture.pcap  → open in Wireshark'], 560, 90, 1320, '#ff7b7b', [A('l55', 'never', 0), A('l55', 'file', 0)], B('l56', 0));
    ev('pr', 'the capture from backend 3', ['peer → FIN        (“I am done”)', 'backend → ACK', '… silence … the app never closes its side', 'no retransmissions · no resets → NOT the network'], 560, 90, 1320, '#ff5d5d', [A('l56', 'fin', 0), A('l56', 'ack', 0), A('l56', 'nothing', 0), A('l56', 'loss', 0)], B('l57', 0));
  });

  /* ===== S9: the culprit ===== */
  blk('l57', 'l63', () => {
    cam(B('l57', -0.3), 2.0, 'bo'); walk('dana', B('l57', 0.3), 3.0, 5400); walk('rio', B('l57', 0.5), 3.0, 5310); walk('tad', B('l57', 0.5), 3.0, 5700);
    wl('lg', 'CLOSE_WAIT leak → a missing  defer conn.Close()  or an unclosed  resp.Body.Close()', '#ff9f6b', 5450, 330, A('l57', 'almost', -0.2), 30);
    ui('cd', rect(0, 0, 1180, 330, '#0b0f1a', { rx: 18, stroke: '#3a4766', sw: 3 }) + T('bo/handler.go', 24, '#7ee0ff', { anchor: 'start', dx: 24, dy: 32, font: mono }), 700, 120, {}); pop('cd', A('l58', 'code', -0.5));
    ['resp, err := http.Get(url)', 'if err != nil { return err }', 'body, _ := io.ReadAll(resp.Body)   // read… never closed', 'return process(body)'].forEach((ln, i) => { ui('cl' + i, T(ln, 28, i === 2 ? '#ff9f6b' : '#e6edf7', { anchor: 'start', font: mono }), 730, 190 + i * 52, {}); pop('cl' + i, A('l59', ['call', 'read', 'read', 'return'][i], 0)); });
    ui('hl', rect(0, 0, 1120, 46, 'rgba(255,93,93,.25)', { rx: 8, stroke: '#ff5d5d', sw: 2 }), 720, 271, {}); pop('hl', A('l60', 'never', -0.2));
    wl('wc', 'every call leaves a connection waiting → they pile up → a new connection fails → 502 for 1%', '#ff7b7b', 5450, 300, A('l60', 'every', 0), 30);
    ui('fx', T('+  defer resp.Body.Close()', 30, '#3ddc84', { anchor: 'start', font: mono }), 730, 398, {}); pop('fx', A('l62', 'defer', -0.2));
    wl('ccl', '🔒 CASE CLOSED', '#3ddc84', 5450, 450, A('l62', 'case', 0), 60);
  });

  /* ===== S10: the health probe ===== */
  blk('l63', 'l67', () => {
    cam(B('l63', -0.3), 2.0, 'hq'); walk('dana', B('l63', 0.3), 5.0, 380); walk('rio', B('l63', 0.5), 5.0, 270);
    ui('pc', rect(0, 0, 1280, 440, '#0b0f1a', { rx: 18, stroke: '#3a4766', sw: 3 }) + T('netdebug/check.go', 24, '#7ee0ff', { anchor: 'start', dx: 24, dy: 32, font: mono }), 560, 70, {}); pop('pc', A('l63', 'probe', -0.4));
    ['conn, err := d.DialContext(ctx, "tcp", addr)', 'if err == nil { conn.Close(); return Open }', 'var ne net.Error', 'if errors.As(err, &ne) && ne.Timeout() { return Timeout }', 'if errors.Is(err, syscall.ECONNREFUSED) { return Refused }', 'return OtherError'].forEach((ln, i) => { ui('pl' + i, T(ln, 25, '#e6edf7', { anchor: 'start', font: mono }), 590, 130 + i * 52, {}); pop('pl' + i, A('l64', ['dials', 'no', 'net', 'timeout', 'refused', 'anything'][i], 0)); });
    [['Open', '#3ddc84'], ['Timeout · firewall drop / dead route', '#ffb066'], ['Refused · nothing listening (RST)', '#ff7b7b'], ['OtherError', '#9aa4b6']].forEach((o, i) => C('oc' + i, o[0], 1200, 520 + i * 62, o[1], 'l65', ['refused', 'timeout', 'refused', 'dashboard'][i], 700, 0));
    C('pt', 'tests prove all four outcomes · go test -race ✓', 1200, 800, '#3ddc84', 'l66', 'tests', 760, 0);
  });

  /* ===== S11: the case file ===== */
  blk('l67', 'q0', () => {
    cam(B('l67', -0.3), 1.4, 'hq');
    ui('cf', rect(0, 0, 1700, 140, 'rgba(8,12,24,.94)', { rx: 18, stroke: '#38bdf8', sw: 4 }) + T('THE CASE FILE · symptom → witness → what to read', 30, '#38bdf8', { dx: 850, dy: 34 }), 110, 60, {}); pop('cf', B('l67', 0.4));
    const CF = [['name will not resolve · NXDOMAIN', 'Dex · dig, dig +trace · status, ANSWER SECTION, TTL', 'l67', 'name', '#fbbf24'], ['connect hangs a long time', 'Nell + Mel · nc, traceroute · a firewall dropping SYNs', 'l67', 'connect', '#2dd4bf'], ['refused at once', 'Nell · nc, ss · no LISTEN row for that port', 'l67', 'refused', '#2dd4bf'], ['certificate errors', 'Tess · openssl s_client · verify code, names, dates', 'l68', 'certificate', '#a78bfa'], ['502 / 504 through a proxy', 'Curt · curl straight to the backend', 'l68', 'five', '#f87171'], ['200 but slow', 'Curt · curl -w phase timing', 'l68', 'slow', '#f87171'], ['all fine, behaviour wrong', 'Tad · tcpdump · flags, retransmissions, resets', 'l68', 'wire', '#94a3b8']];
    CF.forEach((r, i) => rowBox('cr' + i, r[0], r[1], 110, 210 + i * 100, 1700, 88, r[4], A(r[2], r[3], -0.3)));
    ['cf', 'cr0', 'cr1', 'cr2', 'cr3', 'cr4', 'cr5', 'cr6'].forEach((i) => hide(i, B('l69', -0.2), 0.4));
    ev('lm', 'know the limits', ['dig · curl · openssl: READ-ONLY, safe on production', 'tcpdump: needs privileges · may capture sensitive data', 'traceroute / mtr measure the PATH · TCP often recovers from loss unseen', '--resolve / DNS overrides: for TESTING, never a permanent fix'], 330, 130, 1300, '#ffb066', [A('l69', 'read', 0), A('l69', 'tcpdump', 0), A('l69', 'traceroute', 0), A('l69', 'resolve', 0)], B('l70', 0));
    ev('pf', 'production failures → what to check', ['stale IPs after a DNS change → the record’s TTL (dig)', 'intermittent 502 → curl each backend directly', 'TLS fine in a browser, not a script → trust store + SNI sent?', 'a host “sometimes” dead → tcpdump in the failure window: retransmits / resets'], 330, 130, 1300, '#ff9f6b', [A('l70', 'stale', 0), A('l70', 'intermittent', 0), A('l71', 'works', 0), A('l71', 'sometimes', 0)], B('l72', 0));
    ev('mn', 'what to monitor', ['DNS query latency · NXDOMAIN rate', 'TCP connect failures: refused vs timeout (different meanings)', 'TLS handshake failures · days to certificate expiry', 'HTTP errors broken down by phase timing'], 330, 130, 1300, '#3ddc84', [A('l72', 'query', 0), A('l72', 'connect', 0), A('l72', 'handshake', 0), A('l72', 'errors', 0)], B('l73', 0));
    ev('tr2', 'two more notes for Rio’s notebook', ['mtr: loss on a MIDDLE hop is noisy · only loss at the LAST hop is actionable', 'Go CLOSE_WAIT leak = a missing defer close · or an unclosed response body'], 330, 130, 1300, '#c084fc', [A('l73', 'mtr', 0), A('l73', 'go', 0)], End('l73', 0.6));
  });

  /* ===== S12: the rookie's exam ===== */
  blk('q0', 's0', () => {
    cam(B('q0', -0.3), 1.2, 'hq');
    const QA = [['A request times out, no error at all?', 'nc -zv host port → does TCP even connect? hangs = routing / firewall · instant success = the problem is above TCP', 'q1', 'q2'], ['curl: (35) SSL connect error?', 'openssl s_client -servername → verify code, names, dates · expired / hostname mismatch / missing intermediate', 'q3', 'q4'], ['traceroute: * at hop 6, destination fine at hop 10?', 'not necessarily · routers often drop the replies, not the traffic · ICMP policy', 'q5', 'q6'], ['hundreds of sockets in CLOSE_WAIT?', 'an app bug: the peer closed, the process never did · Go: unclosed resp.Body / no defer close', 'q7', 'q8'], ['when trust tcpdump over curl -v?', 'when explanation ≠ behaviour · curl says connected yet it stalls · two tools disagree', 'q9', 'q10'], ['TTL 3600, I changed the IP, users still see the old one?', 'resolvers cache independently · query the SAME resolver they use · check the remaining TTL', 'q11', 'q12'], ['refused vs timed out?', 'refused: the OS answered with a RST → nothing listening · timed out: no reply → firewall / dead route', 'q13', 'q14']];
    QA.forEach((q, i) => { const y = 70 + i * 140; ui('qa' + i, rect(0, 0, 1700, 126, 'rgba(8,12,24,.94)', { rx: 16, stroke: '#38bdf8', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 28, '#38bdf8', { anchor: 'start', dx: 24, dy: 36 }) + T(q[1], 22, '#fff', { anchor: 'start', dx: 24, dy: 88 }), 110, y, {}); pop('qa' + i, A(q[2], ['times', 'curl', 'trace', 'hundreds', 'trust', 'ttl', 'refused'][i] === 'ttl' ? 'thirty' : ['times', 'curl', 'trace', 'hundreds', 'trust', 'ttl', 'refused'][i], -0.3)); });
  });

  /* ===== S13: summary ===== */
  blk('s0', 'rn1', () => {
    ui('sh', T('CASE CLOSED · SUMMARY', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('s0', 0));
    const SUM = [['1', 'match the symptom to ONE layer · dig → nc/ss → openssl → curl → tcpdump (only if the rest do not explain it)', 's1a', '#38bdf8'], ['2', 'dig: no ANSWER + an SOA in AUTHORITY = NXDOMAIN · a timeout = resolver unreachable · +trace walks root → .com → authoritative', 's1b', '#fbbf24'], ['3', 'curl -w times are cumulative: subtract · --resolve tests one address without DNS', 's1c', '#f87171'], ['4', 'openssl s_client: always -servername · read the verify code, the names, the dates', 's1d', '#a78bfa'], ['5', 'nc: refused = nothing listening · timeout = firewall / dead route · ss: growing backlog = slow accept · CLOSE_WAIT = a leak', 's1e', '#2dd4bf'], ['6', 'tcpdump: tight filter, root, a capture file · traceroute / mtr measure the path, not the app', 's1f', '#94a3b8'], ['7', 'match the symptom to one layer, then run the one tool that inspects that layer', 's1g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1700, 108, 'rgba(8,12,24,.94)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 24, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 110, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'e1', () => {
    C('rn1a', '📘 notes: Network Debugging Toolkit - dig, curl, ss, tcpdump  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1300, 0);
    C('rn1b', '⬅ before: What Happens When You Type a URL · DNS · TCP · TLS and HTTPS', 960, 410, '#ffd166', 'rn1', 'before', 1300, 0);
    C('rn1c', '➡ after: Forward and Reverse Proxies - L4 vs L7', 960, 490, '#3ddc84', 'rn1', 'after', 1300, 0);
    C('rn1d', '↔ compare: I-O Models · HTTP Fundamentals', 960, 570, '#c084fc', 'rn1', 'compare', 1300, 0);
  });
  cam(B('e1', -0.4), 1.4, 'hq');
  tw('rio', B('e1', 0.5), 0.3, { r: -5 }); tw('rio', B('e1', 0.9), 0.3, { r: 5 }); tw('rio', B('e1', 1.3), 0.3, { r: 0 });
  ui('endT', T('Network Debugging Toolkit', 110, '#fff', { w: 1700 }), 960, 440, {}); ui('endS', T('one symptom · one layer · one tool', 48, '#cdd6e6', { w: 1100 }), 960, 570, {});
  pop('endT', B('e2', 1.2)); pop('endS', B('e2', 1.8));
})();
