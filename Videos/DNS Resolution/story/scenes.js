/* DNS: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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

  // ---------- cast ----------
  const CFG = {
    rita: { who: 'RITA', skin: '#c98d5b', shirt: '#1fb5a8', pants: '#3a3f5c', hair: '#1a1210', hair2: 'long', blush: 1, hold: '💻', w: 92, name: 'Rita', ring: '#1fb5a8' },
    rex: { who: 'REX', skin: '#e3b08a', shirt: '#8a5a34', pants: '#3b3b46', glasses: 1, hair: '#8a8a8a', tie: '#c9a24a', hold: '📚', w: 112, name: 'Rex', ring: '#c9a24a' },
    roz: { who: 'ROZ', skin: '#9b6a47', shirt: '#2f6bd6', pants: '#222233', hair: '#111', hair2: 'long', hold: '🌍', w: 100, name: 'Roz', ring: '#2f6bd6' },
    tom: { who: 'TOM', skin: '#d9a37a', shirt: '#e5b83a', pants: '#333344', hat: 'cap', hatColor: '#e5b83a', hold: '🗂️', w: 104, name: 'Tom', ring: '#e5b83a' },
    ava: { who: 'AVA', skin: '#f0c4a0', shirt: '#8e5bd6', pants: '#2a2540', hair: '#4a2a1a', hair2: 'long', hold: '📖', blush: 1, w: 94, name: 'Ava', ring: '#8e5bd6' },
    mal: { who: 'MAL', skin: '#e0ac82', shirt: '#1c1c22', pants: '#1c1c22', mask: 1, hair: '#111', w: 104 },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16244d"/><stop offset=".62" stop-color="#4f5fa0"/><stop offset="1" stop-color="#f2b36e"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 52 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY }, keep));
  bld('bR', 300, '#2a8f86', 'RITA · HOME', '🏠'); bld('bX', 1100, '#8a5a34', 'REX · LIBRARY', '📚'); bld('bZ', 1900, '#2f6bd6', 'ROZ · ROOT', '🌍'); bld('bT', 2700, '#b88a1c', 'TOM · .COM', '🗂️'); bld('bA', 3500, '#7a4ec0', 'AVA · example.com', '📖');
  mk('plate', rect(-150, -20, 300, 40, '#f4ead0', { rx: 8, stroke: '#7a6a3a', sw: 3 }) + T('172.66.147.243', 26, '#2a2a2a'), Object.assign({ x: 3500, y: GY - 60 }, keep));
  mkChar('rita', CFG.rita, 440, 830, keep); mkChar('rex', CFG.rex, 1100, 830, keep); mkChar('roz', CFG.roz, 1900, 830, keep); mkChar('tom', CFG.tom, 2700, 830, keep); mkChar('ava', CFG.ava, 3500, 830, keep);
  mkChar('mal', CFG.mal, 1700, 830, { o: 0, keep: 1 });
  [['Rita', 440, '#1fb5a8'], ['Rex', 1100, '#c9a24a'], ['Roz', 1900, '#5b97ff'], ['Tom', 2700, '#e5b83a'], ['Ava', 3500, '#b48cff']].forEach((n) => mk('nm' + n[0], T(n[0], 40, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['RITA', 'REX', 'ROZ', 'TOM', 'AVA'].forEach((w, i) => { const c = CFG[w.toLowerCase()]; portrait('pt' + w, Object.assign({}, c), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });

  const views = { town: { x: 1900, y: 470, s: 0.5 }, rita: { x: 760, y: 520, s: 0.9 }, ava: { x: 3300, y: 520, s: 0.9 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.rita);
  const ttl = (id, x, y, r, col, t, d) => { ui(id, '<g transform="rotate(-90)"><circle r="' + r + '" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="16"/><circle data-p pathLength="1" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="16" stroke-linecap="round"/></g>' + T('TTL', 22, '#fff'), x, y, { p: 1 }); pop(id, t); tw(id, t + 0.6, d, { p: 0 }, { ease: 'lin' }); };

  /* ===== S1: a town that finds houses by number ===== */
  scene(() => {
    chip('n1', '🏷️ example.com', 960, 190, '#7ee0ff', A('l1', 'example'), { w: 380 });
    chip('n2', '#️⃣ 172.66.147.243', 960, 270, '#ffd166', A('l1', 'numbers', -0.3), { w: 400 });
    cam(A('l1', 'but', -0.3), 2.6, 'town');
    em('think', '🤔', 90, 440, 450); pop('think', B('l2', 0.1)); hide('think', End('l2', 0.3), 0.3);
    tx('plate', A('l3', 'number', 0), '104.20.23.154'); tw('plate', A('l3', 'number', 0), 0.01, { s: 1 }); tw('plate', A('l3', 'number', 0.01), 0.35, { s: 1.4 }, { ease: 'back' }); tw('plate', A('l3', 'number', 0.5), 0.3, { s: 1 });
    card(A('l3', 'domain', 0), 'DNS', 'Domain Name System', { color: '#7ee0ff' });
    wd('own', T('👑 owner', 44, '#ffd166', { w: 700 }), 3500, 380); pop('own', A('l3', 'owner'));
    ['n1', 'n2', 'think'].forEach((i) => hide(i, A('l3', 'every', -0.3), 0.4));
    chip('bk1', '📕 root book', 560, 190, '#ff7b7b', A('l4', 'root', 0), { w: 300 }); chip('bk2', '📗 .com book', 960, 190, '#3ddc84', A('l4', 'dot com book', 0), { w: 300 }); chip('bk3', '📘 example.com\'s own book', 1450, 190, '#7ee0ff', A('l4', 'own', -0.3), { w: 440 });
    S.scope(null);
  });
  kill(sc, B('l5', -0.3), 0.5);

  /* ===== S2: a name has levels ===== */
  scene(() => {
    dim('d2', B('l5', -0.2), B('l6', -0.2));
    [['www', 480, '#9aa4b6', 'subdomain', 'subdomains'], ['.example', 850, '#7ee0ff', 'registered domain', 'registered'], ['.com', 1250, '#ffd166', 'TLD', 'top'], ['.', 1440, '#ff7b7b', 'root', 'root']].forEach((p, i) => {
      ui('nl' + i, T(p[0], 120, p[2], { font: mono }), p[1], 380, {}); ui('nlL' + i, T(p[3], 34, p[2]), p[1], 480, {});
      pop('nl' + i, A('l5', p[4], -0.2)); pop('nlL' + i, A('l5', p[4], 0));
    });
    ui('rtl', T('← read right to left', 40, '#cdd6e6'), 960, 600, {}); pop('rtl', A('l5', 'read', 0));
    cam(B('l6', -0.3), 1.5, 'town');
    [['bZ', 'roz'], ['bT', 'tom'], ['bA', 'ava']].forEach((b, i) => { tw(b[0], A('l6', b[1], 0), 0.01, { s: 1 }); tw(b[0], A('l6', b[1], 0.01), 0.3, { s: 1.08 }); tw(b[0], A('l6', b[1], 0.7), 0.3, { s: 1 }); });
    card(A('l6', 'authoritative', -0.2), 'Authoritative', 'the owner of the real entry', { color: '#b48cff' });
    S.scope(null);
  });
  kill(sc, B('l10', -0.4), 0.4);

  /* ===== S3: Rita asks, Rex walks ===== */
  scene(() => {
    cam(B('l10', -0.4), 1.4, 'rita');
    chip('stub', 'stub resolver', 654, 250, '#9aa4b6', A('l10', 'stub', -0.1), { w: 240 }); chip('rec', 'recursive resolver', 1266, 250, '#c9a24a', A('l10', 'recursive', -0.2), { w: 330 });
    ['ISP', '8.8.8.8 · Google', '1.1.1.1 · Cloudflare', 'cloud network built-in'].forEach((t, i) => chip('pr' + i, t, 1690, 380 + i * 75, '#c9a24a', [A('l10', 'provider', -0.2), A('l10', 'eight', -0.2), A('l10', 'cloudflare', -0.9), A('l10', 'built', -0.2)][i], { w: 330 }));
    ['pr0', 'pr1', 'pr2', 'pr3', 'stub', 'rec'].forEach((i) => hide(i, B('l11', -0.2), 0.4));
    ask('q1', '❓ example.com', '#1fb5a8', 480, 520, 1080, 520, A('l11', 'rex', 0.5), 1.1);
    card(A('l12', 'recursive', -0.1), 'Recursive query', 'give me the final answer or an error', { color: '#1fb5a8' });
    bubble('empty', '🗄️ cache: empty', '#c9a24a', 1100, 400); pop('empty', B('l13', 0.2)); hide('empty', B('l14', 0.1), 0.3);
    cam(B('l14', -0.3), 1.8, { x: 1500, y: 520, s: 0.7 });
    go('rex', B('l14', 1.0), 3.0, 1760);
    ask('q2', '❓ example.com', '#c9a24a', 1760, 520, 1890, 520, B('l15', 0.1), 0.9);
    ask('r1', '👉 ask Tom (.com)', '#5b97ff', 1900, 520, 1770, 520, B('l16', 0.4), 1.1);
    card(A('l17', 'referral', -0.2), 'Referral', 'not the answer, just who to ask next', { color: '#5b97ff' });
    cam(B('l17', 0.0), 3.4, { x: 2300, y: 520, s: 0.7 });
    go('rex', B('l17', 0.0), 3.6, 2560);
    ask('q3', '❓ example.com', '#c9a24a', 2560, 520, 2690, 520, B('l18', 0.1), 0.9);
    ask('r2', '👉 ask Ava', '#e5b83a', 2700, 520, 2570, 520, B('l19', 0.4), 1.0);
    cam(B('l19', 0.8), 3.2, { x: 3100, y: 520, s: 0.7 });
    go('rex', B('l19', 1.0), 3.2, 3360);
    ask('q4', '❓ example.com', '#c9a24a', 3360, 520, 3490, 520, B('l20', 0.1), 0.9);
    ask('a1', '172.66.147.243', '#3ddc84', 3500, 520, 3380, 520, B('l21', 0.7), 1.1);
    ttl('ttl3', 1500, 160, 56, '#3ddc84', A('l21', 'remember', -0.1), 6);
    card(A('l21', 'two', 0), 'TTL = 230 s', 'how long Rex may remember it', { color: '#3ddc84' });
    cam(B('l22', -0.2), 1.0, 'town');
    ['bZ', 'bT', 'bA'].forEach((b, i) => { const x = [1900, 2700, 3500][i]; wd('bd' + i, circ(0, 0, 36, ['#ff7b7b', '#ffd166', '#3ddc84'][i]) + T(String(i + 1), 44, '#111'), x, 330); pop('bd' + i, [A('l22', 'root', 0), A('l22', 't l d', 0), A('l22', 'authoritative', 0)][i]); });
    cam(B('l22', 2.5), 3.5, 'rita'); hide('ttl3', B('l22', 0.5), 0.4);
    go('rex', B('l22', 0.3), 6.8, 1250);
    ask('a2', '172.66.147.243', '#3ddc84', 1180, 520, 520, 520, B('l23', 0.5), 1.1);
    S.scope(null);
  });
  kill(sc, B('l24', -0.3), 0.5);

  /* ===== S4: caches and the TTL countdown ===== */
  scene(() => {
    const L = [['1  Browser', 'about 60 s cap in Chrome', 'l24', 'browser', '#7ee0ff'], ['2  Operating system', 'honors TTL · hosts file never expires', 'l24', 'operating', '#3ddc84'], ['3  Rex (the resolver)', 'shared by every customer', 'l25', 'third', '#ffd166'], ['4  Your own program', 'Go stdlib: caches nothing', 'l25', 'fourth', '#ff9f6b']];
    L.forEach((r, i) => rowBox('lay' + i, r[0], r[1], 1330, 140 + i * 125, 560, 105, r[4], A(r[2], r[3], -0.2)));
    chip('hit', 'cache hit ✓ no walk', 760, 330, '#3ddc84', A('l24', 'nobody', -0.1), { w: 340 }); hide('hit', B('l25', 0), 0.4);
    ['lay0', 'lay1', 'lay2', 'lay3'].forEach((i) => tw(i, B('l26', -0.2), 0.4, { o: 0.25 }));
    [['browser', 1400, 0], ['OS', 1600, 1.4], ['Rex', 1800, 2.8]].forEach((r, i) => { ttl('tr' + i, r[1], 800, 62, ['#7ee0ff', '#3ddc84', '#ffd166'][i], A('l26', 'starts', r[2] - 0.5), 5); ui('trL' + i, T(r[0], 26, '#cdd6e6'), r[1], 900, {}); pop('trL' + i, A('l26', 'starts', r[2] - 0.5)); });
    card(A('l26', 'time', 0), 'TTL', 'a countdown, fresh at each layer', { color: '#ffd166' });
    ['lay0', 'lay1', 'lay2', 'lay3', 'tr0', 'tr1', 'tr2', 'trL0', 'trL1', 'trL2'].forEach((i) => hide(i, B('l27', -0.2), 0.4));
    rowBox('low', 'LOW TTL', 'changes show fast · Ava asked a lot', 1330, 160, 560, 120, '#3ddc84', A('l27', 'low', -0.2)); rowBox('high', 'HIGH TTL', 'few questions · slow rollout', 1330, 310, 560, 120, '#ffb066', A('l27', 'high', -0.2));
    chip('mv1', '① lower the TTL', 1610, 540, '#7ee0ff', A('l27', 'lower', 0), { w: 380 }); chip('mv2', '② do the move', 1610, 620, '#ffd166', A('l27', 'move', 0), { w: 380 }); chip('mv3', '③ raise it again', 1610, 700, '#3ddc84', A('l27', 'raise', 0), { w: 380 });
    ['low', 'high', 'mv1', 'mv2', 'mv3'].forEach((i) => hide(i, B('l28', -0.2), 0.4));
    rowBox('live', 'Ava: new answer live ✓', 'available at once', 1330, 200, 560, 110, '#3ddc84', A('l28', 'ava', 0.2)); rowBox('wait', '⏳ every cache waits', 'old answer expires by its TTL', 1330, 340, 560, 110, '#ffb066', A('l28', 'what', 0));
    chip('myth', 'propagation = old caches expiring', 1610, 520, '#ff7b7b', A('l28', 'propagation', 0), { w: 520 });
    S.scope(null);
  });
  kill(sc, B('l29', -0.3), 0.5);

  /* ===== S5: remembering "does not exist" ===== */
  scene(() => {
    cam(B('l29', -0.3), 1.0, 'rita');
    ask('ty', '❓ exmaple.com', '#1fb5a8', 480, 520, 1080, 520, B('l29', 0.4), 1.1);
    bubble('nx', '🚫 NXDOMAIN', '#ff7b7b', 1100, 420); pop('nx', A('l30', 'no', 0.1)); hide('nx', B('l31', -0.1), 0.3);
    rowBox('nb', '📓 Rex\'s notebook', 'exmaple.com → no such name', 1330, 200, 560, 130, '#ff7b7b', A('l31', 'negative', -0.1));
    ttl('nttl', 1500, 520, 62, '#ff7b7b', A('l31', 'minimum', -0.2), 6);
    chip('soa', 'SOA minimum: 1800 s', 1760, 520, '#ffd166', A('l31', 'minimum', 0), { w: 340 });
    chip('crt', 'record created ✓', 1610, 680, '#3ddc84', A('l31', 'create', 0), { w: 340 }); chip('stl', 'cached "no" still answers ✗', 1610, 760, '#ff7b7b', A('l31', 'keeps', 0), { w: 440 });
    S.scope(null);
  });
  kill(sc, B('l32', -0.3), 0.5);

  /* ===== S6: delegation and glue ===== */
  scene(() => {
    cam(B('l32', -0.3), 1.5, 'town');
    line('ns1', 1960, 600, 2640, 600, '#ffd166', 12); draw('ns1', A('l32', 'n s', 0), 1.4); wd('ns1t', T('NS → .com', 44, '#ffd166', { w: 700 }), 2300, 540); pop('ns1t', A('l32', 'n s', 0.5));
    line('ns2', 2760, 600, 3440, 600, '#ffd166', 12); draw('ns2', A('l32', 'pointer', -0.6), 1.4); wd('ns2t', T('NS → example.com', 44, '#ffd166', { w: 700 }), 3100, 540); pop('ns2t', A('l32', 'pointer', -0.4));
    card(A('l32', 'delegation', -0.2), 'Delegation', 'parent points at the child’s nameservers', { color: '#ffd166' });
    ['ns1', 'ns1t', 'ns2', 'ns2t'].forEach((i) => hide(i, B('l33', 1.5), 0.4));
    dim('d6', B('l33', 1.6), End('l37', 0.6));
    chip('g1', 'need NS of example.com', 960, 230, '#7ee0ff', A('l33', 'n s', 0.4), { w: 420 }); chip('g2', 'it is ns1.example.com', 960, 330, '#ffd166', A('l33', 'one', 0), { w: 420 });
    chip('g3', 'need ns1\'s number', 960, 430, '#ff9f6b', A('l34', 'find', 0), { w: 420 }); chip('g4', 'ask example.com\'s nameserver…', 960, 530, '#ff7b7b', A('l34', 'must', 0), { w: 520 });
    ui('loop', T('↻ circle! can’t reach it without its number', 44, '#ff7b7b', { w: 900 }), 960, 640, {}); pop('loop', A('l34', 'cannot', 0));
    ['g1', 'g2', 'g3', 'g4', 'loop'].forEach((i) => tw(i, A('l35', 'fix', -0.2), 0.4, { o: 0.2 }));
    chip('glue', '📎 glue: ns1.example.com = 203.0.113.5', 960, 780, '#3ddc84', A('l35', 'glue', 0), { w: 720 });
    card(A('l35', 'glue', -0.1), 'Glue record', 'the number, attached to the delegation', { color: '#3ddc84' });
    chip('nog', 'no glue → whole zone breaks', 960, 900, '#ff7b7b', A('l37', 'forget', 0), { w: 560 });
    S.scope(null);
  });
  kill(sc, B('l38', -0.3), 0.5);

  /* ===== S7: thirteen roots, and how questions travel ===== */
  scene(() => {
    dim('d7', B('l38', -0.3), End('l39', 0.6));
    const L13 = 'ABCDEFGHIJKLM'.split('');
    L13.forEach((c, i) => { ui('rl' + i, circ(0, 0, 38, '#2f6bd6') + T(c, 40, '#fff'), 300 + i * 110, 230, {}); pop('rl' + i, A('l38', 'thirteen', 0) + i * 0.12); });
    L13.forEach((c, i) => { for (let j = 0; j < 4; j++) { ui('rd' + i + '_' + j, circ(0, 0, 9, '#8fb4ff'), 300 + i * 110 + (j - 1.5) * 20, 330 + (j % 2) * 24, {}); pop('rd' + i + '_' + j, A('l38', 'hundreds', 0) + i * 0.06 + j * 0.03, 0.3); } });
    chip('ident', '13 identities ≠ 13 machines', 960, 470, '#ffd166', A('l38', 'identities', -0.3), { w: 560 });
    uem('rexI', '📚', 90, 420, 700); pop('rexI', A('l38', 'anycast', -0.4)); uline('anyl', 430, 690, 740, 345, '#3ddc84', 8); udraw('anyl', A('l38', 'nearest', -0.2), 1.0);
    card(A('l38', 'anycast', -0.1), 'Anycast', 'same address, nearest copy answers', { color: '#7ee0ff' });
    ['ident', 'rexI', 'anyl'].forEach((i) => hide(i, B('l39', -0.2), 0.4)); L13.forEach((c, i) => { hide('rl' + i, B('l39', -0.3), 0.4); for (let j = 0; j < 4; j++) hide('rd' + i + '_' + j, B('l39', -0.3), 0.4); });
    uem('pk', '📦', 90, 300, 520); pop('pk', A('l39', 'fast', -0.5)); fly('pk', A('l39', 'fast', -0.4), [[300, 520], [1500, 520]], 2.0, { ease: 'inOut' });
    chip('udp', 'UDP · port 53 · fast, no handshake', 900, 440, '#3ddc84', A('l39', 'mostly', 0), { w: 620 });
    uem('pk2', '📦📦📦', 90, 300, 700); pop('pk2', A('l39', 'big', -0.3)); chip('tcp', 'too big → retry over TCP · 53', 900, 790, '#ffd166', A('l39', 'retries', -0.2), { w: 620 });
    chip('edns', 'EDNS0: bigger buffer 1232 / 4096 bytes', 960, 910, '#c084fc', A('l39', 'zero', -0.1), { w: 720 });
    card(A('l39', 'zero', -0.2), 'EDNS0', 'resolver announces a bigger UDP size', { color: '#c084fc' });
    S.scope(null);
  });
  kill(sc, B('l40', -0.3), 0.5);

  /* ===== S8: records ===== */
  scene(() => {
    dim('d8', B('l40', -0.3), End('l43', 0.8));
    const R = [['A', 'name → IPv4', 'l40', 'a record', '#7ee0ff'], ['AAAA', 'name → IPv6', 'l40', 'quad', '#7ee0ff'], ['CNAME', 'alias to another name', 'l41', 'alias', '#c084fc'], ['ALIAS', 'CNAME-like, legal at the apex', 'l41', 'alias record', '#3ddc84'], ['MX', 'mail servers + priority', 'l42', 'm x', '#ffd166'], ['TXT', 'free text, proofs', 'l42', 't x t', '#ffd166'], ['NS', 'delegates a zone', 'l42', 'delegates', '#5b97ff'], ['SOA', 'zone header, one per zone', 'l42', 'header', '#5b97ff'], ['PTR', 'number → name', 'l43', 'p t r', '#ff9f6b'], ['SRV', 'host + port of a service', 'l43', 's r v', '#ff9f6b'], ['CAA', 'who may issue certificates', 'l43', 'c a a', '#ff7b7b']];
    R.forEach((r, i) => { const col = i < 6 ? 0 : 1, row = i < 6 ? i : i - 6; rowBox('rc' + i, r[0], r[1], 120 + col * 560, 150 + row * 135, 520, 112, r[4], A(r[2], r[3], -0.25)); });
    chip('apx', 'CNAME at the apex ✗', 1560, 330, '#ff7b7b', A('l41', 'apex', 0), { w: 430 }); chip('apx2', 'apex must hold SOA + NS', 1560, 410, '#ffb066', A('l41', 'must', 0), { w: 430 });
    chip('spf', 'SPF: who may send', 1560, 640, '#ffd166', A('l42', 's p f', 0), { w: 360 }); chip('dkim', 'DKIM: signature key', 1560, 710, '#ffd166', A('l42', 'd k i m', 0), { w: 360 }); chip('dmarc', 'DMARC: if they fail…', 1560, 780, '#ffd166', A('l42', 'd m a r c', 0), { w: 360 });
    S.scope(null);
  });
  kill(sc, B('l44', -0.3), 0.5);

  /* ===== S9: DNS as a traffic director ===== */
  scene(() => {
    dim('d9', B('l44', -0.3), End('l47', 0.8));
    uem('avaI', '📖', 100, 960, 200); chip('avaT', 'Ava’s answer list', 960, 290, '#b48cff', B('l44', 0.1), { w: 330 }); pop('avaI', B('l44', 0.1));
    [['A', 480], ['B', 960], ['C', 1440]].forEach((h, i) => { uem('hs' + i, '🏠', 100, h[1], 520); ui('hsl' + i, T('house ' + h[0], 30, '#cdd6e6'), h[1], 600, {}); pop('hs' + i, B('l44', 0.3)); pop('hsl' + i, B('l44', 0.3)); });
    [0, 1, 2].forEach((i) => { uem('rr' + i, '🧑', 70, 300 + i * 600, 820); fly('rr' + i, A('l44', 'round', 0.5) + i * 1.2, [[300 + i * 600, 820], [480 + i * 480, 560]], 1.0, { arc: 60 }); });
    uem('dead', '💀', 90, 1440, 440); pop('dead', A('l44', 'dead', 0)); uem('rr3', '🧑', 70, 1440, 820); fly('rr3', A('l44', 'keeps', 0), [[1440, 820], [1440, 590]], 1.0, { arc: 30 }); uem('rr3x', '❌', 70, 1440, 760); pop('rr3x', A('l44', 'keeps', 1.0));
    card(A('l44', 'round', -0.2), 'Round robin', 'list of numbers, client picks', { color: '#7ee0ff' });
    ['avaI', 'avaT', 'hs0', 'hs1', 'hs2', 'hsl0', 'hsl1', 'hsl2', 'rr0', 'rr1', 'rr2', 'rr3', 'rr3x', 'dead'].forEach((i) => hide(i, B('l45', -0.2), 0.4));
    uem('dc1', '🏢', 100, 500, 480); ui('dc1l', T('Mumbai DC', 30, '#cdd6e6'), 500, 560, {}); uem('dc2', '🏢', 100, 1420, 480); ui('dc2l', T('Dublin DC', 30, '#cdd6e6'), 1420, 560, {});
    ['dc1', 'dc1l', 'dc2', 'dc2l'].forEach((i) => pop(i, B('l45', 0.1)));
    uem('cm', '🧑', 80, 400, 800); ui('cml', T('Mumbai visitor', 28, '#cdd6e6'), 400, 870, {}); uem('cd', '🧑', 80, 1500, 800); ui('cdl', T('Dublin visitor', 28, '#cdd6e6'), 1500, 870, {});
    ['cm', 'cml', 'cd', 'cdl'].forEach((i) => pop(i, A('l45', 'visitor', -0.3)));
    uline('gl1', 410, 760, 490, 540, '#3ddc84', 8); udraw('gl1', A('l45', 'mumbai', 0.2), 0.8); uline('gl2', 1490, 760, 1430, 540, '#3ddc84', 8); udraw('gl2', A('l45', 'dublin', 0.2), 0.8);
    card(A('l45', 'geo', -0.2), 'GeoDNS', 'nearest branch, judged by the resolver', { color: '#ffd166' });
    uem('far', '📚', 80, 960, 800); ui('farl', T('far resolver / VPN', 28, '#ff9f6b'), 960, 870, {}); pop('far', A('l45', 'someone', -0.3)); pop('farl', A('l45', 'someone', -0.3));
    uline('gl3', 960, 760, 1410, 540, '#ff7b7b', 8); udraw('gl3', A('l45', 'wrong', -0.8), 0.8); ui('wr', T('wrong branch ✗', 44, '#ff7b7b', { w: 600 }), 1200, 660, {}); pop('wr', A('l45', 'wrong', 0));
    ['dc1', 'dc1l', 'dc2', 'dc2l', 'cm', 'cml', 'cd', 'cdl', 'gl1', 'gl2', 'gl3', 'far', 'farl', 'wr'].forEach((i) => hide(i, B('l46', -0.2), 0.4));
    [['A', 480], ['B', 960], ['C', 1440]].forEach((h, i) => { uem('hc' + i, '🏠', 100, h[1], 520); ui('hcl' + i, T('house ' + h[0], 30, '#cdd6e6'), h[1], 600, {}); pop('hc' + i, B('l46', 0.1)); pop('hcl' + i, B('l46', 0.1)); uem('pbx' + i, '🩺', 56, h[1], 400); pop('pbx' + i, A('l46', 'probing', 0.1 + i * 0.4)); });
    uem('hx', '❌', 80, 960, 520); pop('hx', A('l46', 'fail', 0)); ui('hxl', T('removed from the answer', 34, '#ff7b7b', { w: 700 }), 960, 680, {}); pop('hxl', A('l46', 'stops', 0));
    chip('hbd', 'but still bounded by the TTL', 960, 800, '#ffd166', A('l46', 'bounded', 0), { w: 520 });
    card(A('l46', 'health', -0.2), 'Health-checked failover', 'probe, then withhold the sick one', { color: '#3ddc84' });
    ['hc0', 'hc1', 'hc2', 'hcl0', 'hcl1', 'hcl2', 'pbx0', 'pbx1', 'pbx2', 'hx', 'hxl', 'hbd'].forEach((i) => hide(i, B('l47', -0.2), 0.4));
    [['DNS lookup', 360, '#3ddc84'], ['connect', 960, '#9aa4b6'], ['request', 1560, '#9aa4b6']].forEach((p, i) => { chip('tl' + i, p[0], p[1], 500, p[2], B('l47', 0.1 + i * 0.2), { w: 360 }); });
    uline('tla', 560, 500, 760, 500, '#9aa4b6', 6); udraw('tla', B('l47', 0.4), 0.5); uline('tlb', 1160, 500, 1360, 500, '#9aa4b6', 6); udraw('tlb', B('l47', 0.5), 0.5);
    ui('onlyh', T('DNS decides only here', 44, '#3ddc84', { w: 800 }), 360, 620, {}); pop('onlyh', A('l47', 'before', 0));
    ui('nev', T('never looks at the request ✗', 40, '#ff7b7b', { w: 800 }), 1500, 620, {}); pop('nev', A('l47', 'never', 0));
    S.scope(null);
  });
  kill(sc, B('l48', -0.3), 0.5);

  /* ===== S10: inside a cluster ===== */
  scene(() => {
    dim('d10', B('l48', -0.3), End('l49', 0.8));
    uem('pod', '☸️', 120, 360, 320); chip('podl', 'pod looks up "my-service"', 360, 430, '#7ee0ff', B('l48', 0.2), { w: 440 }); pop('pod', B('l48', 0.2));
    card(A('l48', 'core', -0.2), 'CoreDNS', 'the cluster’s internal DNS', { color: '#7ee0ff' });
    ['my-service.my-namespace.svc.cluster.local', 'my-service.svc.cluster.local', 'my-service.cluster.local'].forEach((t, i) => chip('sl' + i, t, 1000, 230 + i * 78, '#9aa4b6', A('l48', 'search', 0) + i * 0.5, { w: 760 }));
    chip('nd', 'ndots:5', 360, 600, '#ffd166', A('l48', 'n', 0.1), { w: 220 });
    chip('nd1', 'fewer than 5 dots → try the suffix list first', 1000, 600, '#ffb066', A('l48', 'fewer', 0), { w: 800 }); chip('nd2', '5 or more dots → asked as-is, list skipped', 1000, 690, '#3ddc84', A('l48', 'skips', -0.4), { w: 800 });
    ['sl0', 'sl1', 'sl2', 'nd', 'nd1', 'nd2', 'podl', 'pod'].forEach((i) => hide(i, B('l49', -0.2), 0.4));
    chip('ex', 'api.partner.com  (only 2 dots)', 960, 220, '#cdd6e6', B('l49', 0.2), { w: 600 });
    [0, 1, 2].forEach((i) => chip('xf' + i, 'try suffix ' + (i + 1) + ' ✗', 960, 330 + i * 80, '#ff7b7b', A('l49', 'every', 0) + i * 0.7, { w: 420 }));
    chip('xok', 'finally the real lookup ✓ (slow)', 960, 600, '#ffd166', A('l49', 'before', 0.2), { w: 600 });
    chip('tdot', 'api.partner.com.  ← trailing dot = absolute ✓', 960, 760, '#3ddc84', A('l49', 'trailing', -0.1), { w: 880 });
    S.scope(null);
  });
  kill(sc, B('l50', -0.3), 0.5);

  /* ===== S11: forgeries and trust ===== */
  scene(() => {
    cam(B('l50', -0.4), 1.4, 'rita');
    tw('mal', B('l50', 0.3), 0.001, { o: 1, x: 1750 }); go('mal', B('l50', 0.4), 2.6, 1260);
    ask('fk', '📨 FAKE answer', '#ff5d5d', 1700, 520, 1130, 520, A('l50', 'race', 0.0), 1.0);
    bubble('pz', '☠️ poisoned cache', '#ff5d5d', 1100, 400); pop('pz', A('l50', 'poisoned', 0.2)); hide('pz', A('l50', 'defence', 0.5), 0.4); tw('mal', A('l50', 'defence', 0.3), 0.4, { o: 0 });
    dim('d11', A('l50', 'zones', -0.3), A('l54', 'cost', 2.5));
    const CH = [['🔑 Root trust anchor (built into the resolver)', '#ff7b7b'], ['DS at the root vouches for .com', '#ff7b7b'], ['.com DNSKEY', '#ffd166'], ['DS in .com vouches for example.com', '#ffd166'], ['example.com DNSKEY', '#b48cff'], ['RRSIG: signature on the answer', '#b48cff'], ['Answer: A 172.66.147.243 ✓', '#3ddc84']];
    CH.forEach((c, i) => rowBox('ch' + i, c[0], '', 560, 800 - i * 100, 800, 80, c[1], [A('l50', 'root', 0.2), B('l51', 0.1), B('l51', 0.9), B('l52', 0.1), B('l52', 0.9), B('l53', 0.1), B('l53', 0.9)][i]));
    card(A('l50', 'd n s', 0), 'DNSSEC', 'a signed chain up to the root', { color: '#ffd166' });
    chip('chk', 'only works if the resolver checks', 1560, 520, '#ffb066', A('l54', 'only', -0.2), { w: 480 });
    CH.forEach((c, i) => hide('ch' + i, B('l54', 0.9), 0.5)); hide('chk', B('l54', 0.9), 0.5);
    uem('r', '👩', 100, 400, 520); uem('x', '📚', 100, 1520, 520); uline('pipe', 480, 520, 1440, 520, '#7ee0ff', 10);
    [ 'r', 'x'].forEach((i) => pop(i, B('l54', 1.0))); udraw('pipe', B('l54', 1.0), 0.8);
    uem('eye', '👀', 100, 960, 300); pop('eye', A('l54', 'anyone', 0)); ui('seen', T('sees example.com?', 36, '#ff7b7b', { w: 700 }), 960, 400, {}); pop('seen', A('l54', 'anyone', 0.3));
    uem('lock', '🔒', 120, 960, 520); pop('lock', A('l54', 'encrypt', 0)); tw('seen', A('l54', 'encrypt', 0), 0.4, { o: 0 }); ui('blk', T('can no longer read it', 36, '#3ddc84', { w: 700 }), 960, 400, {}); pop('blk', A('l54', 'encrypt', 0.3));
    chip('doh', 'DoH: DNS over HTTPS', 720, 700, '#7ee0ff', A('l54', 'that', 0.2), { w: 420 }); chip('dot', 'DoT: DNS over TLS', 1200, 700, '#7ee0ff', A('l54', 'that', 1.4), { w: 420 }); chip('cs', 'cost: needs TLS · middleboxes lose filtering', 960, 790, '#ffb066', A('l54', 'cost', 0), { w: 800 });
    S.scope(null);
  });
  kill(sc, B('l55', -0.3), 0.5);

  /* ===== S12: dig ===== */
  scene(() => {
    dim('d12', B('l55', -0.3), End('l55', 0.8));
    ui('term', rect(0, 0, 1500, 640, '#0b0f1a', { rx: 18, stroke: '#334', sw: 3 }), 210, 200, {}); pop('term', B('l55', 0));
    ui('cmd', T('$ dig example.com A +noall +answer', 34, '#9aa4b6', { anchor: 'start', font: mono }), 260, 270, {}); pop('cmd', B('l55', 0.2));
    [['example.com.', 260, 'name', 'name', '#7ee0ff'], ['230', 640, 'TTL left', 'remaining', '#ffd166'], ['IN', 780, 'class', 'class', '#9aa4b6'], ['A', 910, 'type', 'type', '#3ddc84'], ['172.66.147.243', 1010, 'data', 'data', '#ff9f6b']].forEach((c, i) => { ui('dg' + i, T(c[0], 44, c[4], { anchor: 'start', font: mono }), c[1], 380, {}); ui('dl' + i, T('↑ ' + c[2], 28, c[4], { anchor: 'start' }), c[1], 440, {}); pop('dg' + i, B('l55', 0.6)); pop('dl' + i, A('l55', c[3], -0.1)); });
    ui('cmd2', T('$ dig +trace example.com', 34, '#9aa4b6', { anchor: 'start', font: mono }), 260, 560, {}); pop('cmd2', A('l55', 'trace', -0.4));
    [['. (root) → referral to .com', 'tz1'], ['.com → referral to example.com', 'tz2'], ['authoritative → the answer', 'tz3']].forEach((t, i) => { ui(t[1], T(t[0], 34, '#3ddc84', { anchor: 'start', font: mono }), 260, 620 + i * 60, {}); pop(t[1], A('l55', 'showing', 0) + i * 0.9); });
    card(A('l55', 'dig', 0), 'dig', 'ask DNS directly, debug', { color: '#3ddc84' });
    S.scope(null);
  });
  kill(sc, B('l56', -0.3), 0.5);

  /* ===== S13: traps and monitoring ===== */
  scene(() => {
    dim('d13', B('l56', -0.3), End('l57', 0.8));
    ui('hd1', T('TRAPS', 48, '#ff7b7b', { w: 600 }), 480, 140, {}); pop('hd1', B('l56', 0)); ui('hd2', T('WATCH', 48, '#3ddc84', { w: 600 }), 1440, 140, {}); pop('hd2', B('l57', 0));
    [['forgot to lower TTL before a move', 'forgot'], ['CNAME at the apex → use ALIAS', 'apex'], ['cached NXDOMAIN hides a new record', 'just'], ['slow pods: ndots:5', 'pods'], ['split horizon: keep two books in sync', 'split']].forEach((t, i) => chip('tp' + i, t[0], 480, 240 + i * 120, '#ff7b7b', A('l56', t[1], -0.1), { w: 780 }));
    [['query volume + SERVFAIL / NXDOMAIN rate', 'volume'], ['DNSSEC validation failures', 'sec'], ['health-check status', 'health'], ['response time per client region', 'response']].forEach((t, i) => chip('wt' + i, t[0], 1440, 240 + i * 130, '#3ddc84', A('l57', t[1], -0.1), { w: 780 }));
    S.scope(null);
  });
  kill(sc, End('l57', 0.6), 0.5);

  /* ===== S14: summary ===== */
  scene(() => {
    dim('d14', B('l58', -0.3), End('l58h', 0.8));
    ui('sh', T('SUMMARY', 64, '#ffd166', { w: 700 }), 960, 90, {}); pop('sh', B('l58', 0));
    const SUM = [['1', 'Names → numbers. Owned and delegated: root → TLD → authority', 'l58a', '#7ee0ff'], ['2', 'Stub → recursive resolver → iterative walk → one answer', 'l58b', '#c9a24a'], ['3', 'Cached at every layer. TTL = a countdown per layer. Even “no” is cached', 'l58c', '#ffd166'], ['4', 'NS + glue link zones. 13 root names, hundreds of machines. UDP, TCP fallback', 'l58d', '#5b97ff'], ['5', 'Records: A · AAAA · CNAME (never at apex) · MX · TXT · NS · SOA · PTR · SRV · CAA', 'l58e', '#b48cff'], ['6', 'Steering: round robin, geo, health. Before the connection. Bounded by TTL', 'l58f', '#ff9f6b'], ['7', 'DNSSEC signs, DoH / DoT encrypts. ndots:5 in a cluster. Debug: dig +trace', 'l58g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1500, 96, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 48, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 48 }) + T(r[1], 30, '#fff', { anchor: 'start', dx: 110, dy: 48 }), 210, 150 + i * 108, {}); pop('sm' + i, B(r[2], 0.1)); });
    ui('ban', rect(0, 0, 1500, 120, 'rgba(61,220,132,.18)', { rx: 22, stroke: '#3ddc84', sw: 5 }) + T('DNS = a delegated, cached phone book', 54, '#3ddc84', { dx: 750, dy: 60 }), 210, 920, {}); pop('ban', B('l58h', 0.3));
    S.scope(null);
  });
  kill(sc, End('l58h', 0.8), 0.5);
  // end: back to the street
  cam(B('l59', -0.4), 1.2, 'rita');
  tw('rita', B('l59', 0.5), 0.3, { r: -5 }); tw('rita', B('l59', 0.9), 0.3, { r: 5 }); tw('rita', B('l59', 1.3), 0.3, { r: 0 });
  ui('endT', T('DNS', 160, '#fff', { w: 900 }), 960, 440, {}); ui('endS', T('a delegated, cached phone book', 52, '#cdd6e6', { w: 900 }), 960, 570, {});
  pop('endT', B('l60', 1.2)); pop('endS', B('l60', 1.8));

  /* ===== new chapters: deep dive, Go code, interview, read-next ===== */
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const blk = (l0, lEnd, fn) => { scene(() => { dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  blk('d1', 'g1', () => {
    rowBox('dd1', 'trust boundary', 'the stub trusts its resolver completely · a bad resolver lies to everyone behind it', 160, 150, 1600, 120, '#ffd166', A('d1', 'trust', 0));
    rowBox('dd2', 'amplification attacks', 'big UDP answers + spoofed source = flood on the victim · restrict who may ask', 160, 300, 1600, 120, '#ff7b7b', A('d2', 'amplification', -0.2));
    rowBox('dd3', 'anycast + TCP', 'fine for UDP · a TCP connection must stay on one instance, a route flap breaks it', 160, 450, 1600, 120, '#ff9f6b', A('d3', 'anycast', 0));
    rowBox('dd4', 'why Go does not cache', 'caching is policy: how long, rotation, failures → the app or the OS decides', 160, 600, 1600, 120, '#7ee0ff', A('d4', 'fourth', 0));
    rowBox('dd5', 'DNSSEC gaps', 'proving “no such name” uses NSEC records · many resolvers do not validate', 160, 750, 1600, 120, '#c084fc', A('d5', 'last', 0));
  });
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('q0', -0.3));
    const LN = ['func (c *CachingResolver) Lookup(ctx, host) ([]string, bool, error) {', '\tc.mu.Lock()', '\tif e, ok := c.cache[host]; ok && now().Before(e.expires) {', '\t\tc.mu.Unlock()', '\t\treturn e.addrs, true, nil // cache hit: no network', '\t}', '\tc.mu.Unlock()', '\taddrs, err := c.Upstream.LookupHost(ctx, host) // cache miss', '\tif err != nil { return nil, false, err }', '\tc.mu.Lock()', '\tc.cache[host] = entry{addrs: addrs, expires: now().Add(c.TTL)}', '\tc.mu.Unlock()', '\treturn addrs, false, nil', '}'];
    const cp = S.codePanel('code', LN, { x: 180, y: 160, w: 1560, fs: 29, title: 'dnscache.go', t0: B('g1', 0), times: LN.map((x, i) => A('g2', 'cache', 0.2) + i * 0.17) });
    ui('gonote', T('type entry struct { addrs []string; expires time.Time }', 28, '#7ee0ff', { w: 1500, font: mono }), 960, 90, {}); pop('gonote', A('g2', 'map', 0));
    cp.hl(2, A('g3', 'checks', 0)); cp.hl(4, A('g3', 'hit', 0)); cp.hl(7, A('g4', 'miss', 0)); cp.hl(10, A('g4', 'stores', 0));
    C('gt1', 'inside the TTL: 0 extra upstream calls ✓', 960, 920, '#3ddc84', 'g5', 'inside', 720, -0.1); C('gt2', 'after expiry: one fresh query ✓', 960, 990, '#3ddc84', 'g5', 'after', 640, -0.1);
    S.scope(null);
  });
  kill(sc, B('q0', -0.3), 0.5);
  blk('q0', 'l58', () => {
    const QA = [['Recursive vs authoritative?', 'recursive: walks + caches, owns no data · authoritative: holds the real records, never walks', 'q1', 'one'], ['“Propagation takes 48 hours”?', 'false: new answer is live at once · old caches wait out their TTL → lower the TTL first', 'q2', 'two'], ['Why no CNAME at the apex?', 'it cannot sit beside SOA + NS → use ALIAS / flattening', 'q3', 'three'], ['How does negative caching work?', 'NXDOMAIN / NODATA cached for the SOA minimum', 'q4', 'four'], ['DNS load balancing vs a load balancer?', 'DNS: which IP, cached up to TTL, before any connection · LB: per request, live', 'q5', 'five'], ['Does Go’s resolver cache?', 'no, every call is a fresh query · wrap it for TTL-aware reuse', 'q6', 'six'], ['DoH / DoT vs DNSSEC?', 'DNSSEC: answer not tampered with · DoH / DoT: question hidden from the network', 'q7', 'seven']];
    QA.forEach((q, i) => { const y = 90 + i * 140; ui('qa' + i, rect(0, 0, 1640, 124, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 36 }) + T(q[1], 25, '#fff', { anchor: 'start', dx: 26, dy: 86 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });
  scene(() => {
    C('rn1', '📘 notes: DNS - Resolution, Records and Caching  +  its Go note', 960, 330, '#7ee0ff', 'l58n', 'open', 1000, 0);
    C('rn2', '⬅ before: How the Internet Works · IP Addressing', 960, 410, '#ffd166', 'l58n', 'before', 1000, 0);
    C('rn3', '➡ after: TLS and HTTPS · CDN and Edge', 960, 490, '#3ddc84', 'l58n', 'after', 1000, 0);
    C('rn4', '↔ compare: Load Balancing · Forward and Reverse Proxies', 960, 570, '#c084fc', 'l58n', 'compare', 1000, 0);
    ['rn1', 'rn2', 'rn3', 'rn4'].forEach((x) => hide(x, A('l59', 'thank', -0.4), 0.5));
    S.scope(null);
  });
})();
