/* Proxies: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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
    kai: { who: 'KAI', skin: '#d9a37a', shirt: '#3b82f6', pants: '#2a2f3a', hair: '#2b2118', hold: '💻', w: 100, name: 'Kai', ring: '#3b82f6' },
    fiona: { who: 'FIONA', skin: '#f0c4a0', shirt: '#ec4899', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', hold: '📞', blush: 1, w: 92, name: 'Fiona', ring: '#ec4899' },
    rhea: { who: 'RHEA', skin: '#9b6a47', shirt: '#dc2626', pants: '#222', hair: '#111', hair2: 'long', hold: '📋', w: 98, name: 'Rhea', ring: '#dc2626' },
    lou: { who: 'LOU', skin: '#e3b08a', shirt: '#64748b', hat: 'cap', hatColor: '#475569', pants: '#333', hold: '✉️', w: 112, name: 'Lou', ring: '#94a3b8' },
    olly: { who: 'OLLY', skin: '#e8b48a', shirt: '#f59e0b', apron: '#fff', pants: '#444', hair: '#333', hold: '📦', w: 120, name: 'Olly', ring: '#f59e0b' },
    uma: { who: 'UMA', skin: '#c98d5b', shirt: '#10b981', pants: '#333', hair: '#1a1210', hair2: 'long', w: 92 },
    bill: { who: 'BILL', skin: '#f1c9a5', shirt: '#8b5cf6', pants: '#333', hair: '#5a3b1e', w: 104 },
    mal: { who: 'MAL', skin: '#e0ac82', shirt: '#1c1c22', pants: '#1c1c22', mask: 1, hair: '#111', w: 104, name: 'Mal', ring: '#ff5d5d' },
    sid: { who: 'SID', skin: '#94a3b8', shirt: '#0ea5e9', pants: '#334155', glasses: 1, hold: '🔧', w: 90, name: 'Sid', ring: '#0ea5e9' },
    cora: { who: 'CORA', skin: '#f1c9a5', shirt: '#a855f7', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🎛️', w: 92, name: 'Cora', ring: '#a855f7' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#46589a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 56 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon, sc2) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY, s: sc2 || 1 }, keep));
  bld('bK', 300, '#2a8f86', 'KAI · OFFICE', '🏢'); bld('bF', 900, '#b0357a', 'FIONA · FORWARD', '📞'); bld('bR', 1700, '#b42323', 'RHEA · FRONT DESK', '📋');
  bld('bO', 2300, '#c27a1a', 'ORDERS', '📦', 0.7); bld('bU', 2650, '#0e8f6a', 'USERS', '👥', 0.7); bld('bB', 3000, '#6d3fc7', 'BILLING', '💳', 0.7);
  mk('inet', Em('🌐', 170), Object.assign({ x: 1300, y: 640 }, keep)); mk('inetL', T('internet', 34, '#cdd6e6'), Object.assign({ x: 1300, y: 760 }, keep));
  mkChar('kai', CFG.kai, 380, 830, keep); mkChar('fiona', CFG.fiona, 920, 830, keep); mkChar('rhea', CFG.rhea, 1740, 830, keep);
  mkChar('lou', CFG.lou, 1500, 830, { o: 0, keep: 1 });
  mkChar('olly', CFG.olly, 2330, 830, Object.assign({ s: 0.85 }, keep)); mkChar('uma', CFG.uma, 2680, 830, Object.assign({ s: 0.85 }, keep)); mkChar('bill', CFG.bill, 3030, 830, Object.assign({ s: 0.85 }, keep));
  mkChar('mal', CFG.mal, 1250, 830, { o: 0, keep: 1 });
  mkChar('sid', CFG.sid, 2440, 830, { o: 0, s: 0.62, keep: 1 }); mkChar('sid2', CFG.sid, 2790, 830, { o: 0, s: 0.62, keep: 1 });
  mkChar('cora', CFG.cora, 2650, 600, { o: 0, s: 0.8, keep: 1 });
  [['Kai', 380, '#3b82f6'], ['Fiona', 920, '#ec4899'], ['Rhea', 1740, '#f87171'], ['Olly', 2330, '#f59e0b'], ['Uma', 2680, '#10b981'], ['Bill', 3030, '#a78bfa']].forEach((n) => mk('nm' + n[0], T(n[0], 38, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['KAI', 'FIONA', 'RHEA', 'LOU', 'OLLY', 'MAL', 'SID', 'CORA'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { wide: { x: 1650, y: 470, s: 0.55 }, kai: { x: 700, y: 520, s: 0.95 }, orion: { x: 2250, y: 500, s: 0.7 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.kai);
  const pulse = (id, t) => { const b = S.ents[id].init.s; tw(id, t, 0.01, { s: b }); tw(id, t + 0.01, 0.3, { s: b * 1.1 }, { ease: 'back' }); tw(id, t + 0.7, 0.3, { s: b }); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, withDim, fn) => { scene(() => { if (withDim) dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };

  /* ===== S1: the words (world) ===== */
  blk('l1', 'l6', false, () => {
    cam(A('l3', 'open', -0.8), 2.0, 'wide');
    wl('tcl', 'client', '#7ee0ff', 380, 380, A('l2', 'client', 0)); wl('tsv', 'server / backend', '#ffd166', 1700, 330, A('l2', 'server', 0));
    C('ipp', 'IP address + port: 10.0.0.5:8080', 1400, 190, '#c084fc', 'l2', 'address', 620, 0);
    uline('tcp', 480, 600, 1620, 600, '#3ddc84', 10); tw('tcp', A('l3', 't c p', 0), 0.001, { o: 1 }); tw('tcp', A('l3', 't c p', 0), 1.2, { p: [0, 1] });
    C('tcpL', 'TCP connection = a phone line of bytes', 960, 640, '#3ddc84', 'l3', 'reliable', 560);
    bubble('env', '✉️ GET /orders', '#ffd166', 480, 540); fly('env', A('l3', 'h t t p', 0), [[480, 540], [1640, 540]], 2.2, { arc: 60 }); hide('env', A('l3', 'h t t p', 2.4), 0.3);
    C('hd', 'headers: name + value lines', 960, 450, '#7ee0ff', 'l3', 'headers', 440);
    C('tls', '🔒 TLS = encryption around it', 960, 380, '#ff9f6b', 'l3', 'encryption', 520, -0.7);
    ['hd', 'tls', 'tcp', 'tcpL', 'tcl', 'tsv', 'ipp'].forEach((i) => hide(i, A('l4', 'get', -0.1), 0.5));
    C('l4c', 'L4: connections + ports → :443', 960, 300, '#3ddc84', 'l5', 'four', 580, 0.2); C('l7c', 'L7: the HTTP message → /orders', 960, 380, '#ffd166', 'l5', 'seven', 580, 0.2);
  });

  /* ===== S2: why a go-between (world) ===== */
  blk('l6', 'l14', false, () => {
    cam(B('l6', -0.3), 1.5, 'wide');
    [['orders', 2300, '10.0.1.5', 'bO'], ['users', 2650, '10.0.2.7', 'bU'], ['billing', 3000, '10.0.3.9', 'bB']].forEach((b) => { pulse(b[3], A('l6', b[0], 0)); wl('ad' + b[0], b[2], '#cdd6e6', b[1], 420, A('l6', b[0], 0.1), 34); });
    [['3 internal names to learn', 'every', 0], ['3 TLS certificates', 'certificate', 0], ['3 rate limiters', 'rate', 0], ['redeploy every client to change', 'redeploying', 0]].forEach((t, i) => C('pb' + i, t[0], 960, 220 + i * 80, '#ff7b7b', 'l7', t[1], 560));
    ['pb0', 'pb1', 'pb2', 'pb3'].forEach((i) => hide(i, B('l8', 0.3), 0.4));
    card(A('l8', 'proxy', 0), 'Proxy', 'a go-between machine', { color: '#7ee0ff' });
    cam(B('l9', -0.2), 1.6, 'kai');
    pulse('bF', A('l9', 'forward', 0)); card(A('l9', 'forward', 0.2), 'Forward proxy', 'speaks for the client', { color: '#ec4899', slot: 1 });
    C('fnum', 'the other side only sees her number', 700, 300, '#ec4899', 'l9', 'number', 520, -0.5); hide('fnum', B('l11', -0.2), 0.4);
    cam(B('l11', -0.2), 1.8, 'orion');
    pulse('bR', A('l11', 'reverse', 0)); card(A('l11', 'reverse', 0.2), 'Reverse proxy', 'speaks for the server', { color: '#f87171', slot: 1 });
    [2300, 2650, 3000].forEach((x, i) => { line('rl' + i, 1800, 700, x - 60, 700, '#f87171', 8); draw('rl' + i, A('l11', 'decides', 0) + i * 0.3, 0.8); });
    cam(B('l13', -0.4), 1.4, 'wide');
    C('hc', 'FORWARD hides the CLIENT', 560, 190, '#ec4899', 'l13', 'forward', 560, 0); C('hs', 'REVERSE hides the SERVER', 1380, 190, '#f87171', 'l13', 'reverse', 560, 0);
  });

  /* ===== S3a: why a company wants a forward proxy (world) ===== */
  blk('l14', 'l15', false, () => {
    cam(B('l14', -0.3), 1.4, 'wide');
    [0, 1, 2].forEach((i) => { em('lp' + i, '💻', 70, 250 + i * 75, 700); pop('lp' + i, B('l14', 0.2 + i * 0.3)); em('lm' + i, '✉️', 50, 0, 0); fly('lm' + i, B('l14', 1.4 + i * 0.5), [[250 + i * 75, 680], [880, 650], [1230, 640]], 1.8, { arc: 40 }); hide('lm' + i, B('l14', 3.4 + i * 0.5), 0.3); });
    C('exit', 'one controlled exit', 900, 380, '#ec4899', 'l14', 'exit', 380, -0.1);
    C('blk', '❌ block bad sites', 600, 300, '#ff7b7b', 'l14', 'block', 340, 0); C('log', '📒 log what left', 1150, 300, '#ffd166', 'l14', 'log', 340, 0);
    C('pac', 'system proxy settings / PAC file', 900, 220, '#7ee0ff', 'l14', 'p a c', 520, -0.3);
  });
  /* ===== S3b: CONNECT, blind tunnel, TLS inspection (panels) ===== */
  blk('l15', 'l21', true, () => {
    P('pl', 'plain HTTP', 'GET /orders · the proxy reads it all', 200, 200, 600, 120, '#3ddc84', 'l15', 'plain');
    P('hs2', 'HTTPS', '🔒 sealed · it only sees CONNECT host:port', 200, 360, 600, 120, '#ff9f6b', 'l15', 'sealed');
    card(A('l15', 'connect', 0.1), 'CONNECT', 'ask the proxy to open a tunnel', { color: '#7ee0ff' });
    ui('tun', '<path data-p pathLength="1" d="M 900 300 L 1700 300" stroke="#7ee0ff" stroke-width="44" stroke-linecap="round" fill="none" opacity=".45"/>', 0, 0, { p: 0 }); tw('tun', A('l17', 'tunnel', 0), 0.001, { o: 1 }); tw('tun', A('l17', 'tunnel', 0), 1.2, { p: [0, 1] });
    uem('pk', '✉️', 70, 900, 300); fly('pk', A('l17', 'carry', 0), [[900, 300], [1700, 300]], 2.4, {}); pop('pk', A('l17', 'carry', -0.1));
    C('blind', '🙈 blind tunnel: sealed bytes both ways', 1300, 220, '#7ee0ff', 'l18', 'blind', 620);
    C('ok1', 'allow / block by HOSTNAME ✓', 1300, 520, '#3ddc84', 'l18', 'hostname', 560); C('no1', 'by path or body ✗ (inside the tunnel)', 1300, 600, '#ff7b7b', 'l18', 'path', 640);
    ['pl', 'hs2', 'tun', 'pk', 'blind', 'ok1', 'no1'].forEach((i) => hide(i, A('l19', 'some', -0.2), 0.4));
    [['Kai', 330, '#3b82f6', '🧑'], ['Fiona reads plain text', 960, '#ec4899', '🕵️'], ['website', 1590, '#ffd166', '🌐']].forEach((n, i) => { uem('ic' + i, n[3], 100, n[1], 480); ui('icl' + i, T(n[0], 30, n[2], { w: 500 }), n[1], 580, {}); pop('ic' + i, A('l19', 'ends', -0.2)); pop('icl' + i, A('l19', 'ends', -0.2)); });
    uline('t1', 430, 480, 850, 480, '#ec4899', 10); udraw('t1', A('l19', 'ends', 0), 0.8); uline('t2', 1070, 480, 1490, 480, '#ffd166', 10); udraw('t2', A('l19', 'second', -0.4), 0.8);
    C('t1l', 'TLS #1 · proxy\'s own cert', 640, 400, '#ec4899', 'l19', 'ends', 380, 0.2); C('t2l', 'TLS #2 · site\'s real cert', 1280, 400, '#ffd166', 'l19', 'second', 380, 0);
    C('ca', '🏛️ company CA installed on every laptop', 960, 720, '#c084fc', 'l19', 'certificate', 700, 0);
    ['ic0', 'ic1', 'ic2', 'icl0', 'icl1', 'icl2', 't1', 't2', 't1l', 't2l', 'ca'].forEach((i) => hide(i, A('l20', 'measured', -0.3), 0.4));
    ui('crt', rect(0, 0, 940, 260, '#f3e3b2', { rx: 20, stroke: '#a98a45', sw: 5 }) + T('certificate for developer.mozilla.org', 36, '#4a3a10', { dx: 470, dy: 60 }) + T('signed by: Zscaler', 58, '#9b1c1c', { dx: 470, dy: 140 }) + T('not by the site\'s real authority', 32, '#4a3a10', { dx: 470, dy: 210 }), 490, 320, {}); pop('crt', A('l20', 'certificate', 0));
    card(A('l20', 'proof', 0), 'TLS inspection', 'proxy in the middle, trusted by the laptop', { color: '#c084fc' });
  });

  /* ===== S4: reverse proxy jobs (world) ===== */
  blk('l21', 'l27', false, () => {
    cam(B('l21', -0.3), 1.6, 'orion');
    em('c1', '🧑', 80, 1200, 790); pop('c1', B('l21', 0.3));
    line('k1', 1260, 760, 1640, 760, '#7ee0ff', 9); draw('k1', A('l21', 'client', 0), 1.0); wl('k1t', 'connection 1', '#7ee0ff', 1450, 700, A('l21', 'client', 0.3), 30);
    [2300, 2650, 3000].forEach((x, i) => { line('k2' + i, 1840, 740 + i * 12, x - 60, 740 + i * 12, '#f87171', 8); draw('k2' + i, A('l21', 'connections', 0) + i * 0.3, 0.7); });
    wl('k2t', 'connection 2', '#f87171', 2050, 690, A('l21', 'connections', 0.4), 30);
    ['k1', 'k1t', 'k2t', 'k20', 'k21', 'k22'].forEach((i) => hide(i, B('l22', -0.2), 0.4));
    wl('tl1', '🔒', '#fff', 1740, 420, A('l22', 'certificate', -0.3), 80); tw('tl1', A('l22', 'unseal', -0.1), 0.01, { o: 0 }); wl('tl2', '🔓', '#fff', 1740, 420, A('l22', 'unseal', -0.1), 80);
    card(A('l22', 'termination', -0.2), 'TLS termination', 'proxy holds the certificate', { color: '#ff9f6b' });
    C('plain', 'inside: plain or re-sealed (mTLS)', 1740, 300, '#ffd166', 'l22', 'inside', 520);
    ['tl1', 'tl2', 'plain'].forEach((i) => hide(i, B('l23', -0.3), 0.4));
    [['/orders → Olly', 'orders', 2300, '#f59e0b'], ['/users → Uma', 'users', 2650, '#10b981'], ['/billing → Bill', 'billing', 3000, '#a78bfa']].forEach((r, i) => { bubble('rt' + i, r[0], r[3], 1840, 560 - i * 70); pop('rt' + i, A('l23', r[1], -0.2)); fly('rt' + i, A('l23', r[1], 0.3), [[1840, 560 - i * 70], [r[2], 560 - i * 70]], 1.1, { arc: 40 }); hide('rt' + i, A('l23', r[1], 1.6), 0.3); });
    card(A('l23', 'routing', -0.2), 'Routing', 'by host, path or header', { color: '#f87171' });
    em('slow', '🐌', 80, 1200, 790); pop('slow', B('l24', 0.1)); C('buf', 'waits for the whole message first', 1740, 330, '#7ee0ff', 'l24', 'wait', 520); C('mem', 'cost: memory or disk to hold it', 1740, 400, '#ffb066', 'l24', 'costs', 520);
    ['slow', 'buf', 'mem'].forEach((i) => hide(i, B('l25', -0.3), 0.4));
    [['gzip', 'compression'], ['cache', 'caching'], ['rate limit', 'rate'], ['WAF', 'web']].forEach((t, i) => C('ch' + i, t[0], 1500 + i * 190, 300, '#3ddc84', 'l25', t[1], 170));
    ['ch0', 'ch1', 'ch2', 'ch3'].forEach((i) => hide(i, B('l26', -0.3), 0.4));
    C('hid', 'visitors only ever see Rhea\'s address', 1740, 300, '#7ee0ff', 'l26', 'hide', 600, 0);
  });

  /* ===== S5a: Lou and Rhea (world) ===== */
  blk('l27', 'l30', false, () => {
    cam(B('l27', -0.3), 1.5, 'orion');
    tw('lou', B('l27', 0), 0.4, { o: 1 }); pulse('rhea', A('l27', 'rhea', 0));
    ui('envc', rect(0, 0, 460, 160, '#f3e3b2', { rx: 14, stroke: '#a98a45', sw: 4 }) + T('✉️ the envelope', 32, '#4a3a10', { dx: 230, dy: 36 }) + T('to 10.0.0.5 : 443', 38, '#222', { dx: 230, dy: 100, font: mono }), 80, 200, {}); pop('envc', A('l28', 'envelope', -0.3));
    ui('letc', rect(0, 0, 540, 210, '#fff', { rx: 14, stroke: '#9aa4b6', sw: 4 }) + T('📄 the letter', 32, '#333', { dx: 270, dy: 36 }) + T('GET /orders/42', 38, '#222', { dx: 270, dy: 100, font: mono }) + T('headers · body', 30, '#555', { dx: 270, dy: 160 }), 1300, 200, {}); pop('letc', A('l29', 'letter', -0.3));
  });
  /* ===== S5b: L4 vs L7 table, SNI (panels) ===== */
  blk('l30', 'l36', true, () => {
    ui('c4', T('L4  (Lou)', 52, '#94a3b8', { w: 500 }), 560, 110, {}); pop('c4', B('l30', 0.1)); ui('c7', T('L7  (Rhea)', 52, '#f87171', { w: 500 }), 1360, 110, {}); pop('c7', B('l30', 0.1));
    const TB = [['sees', 'IP, port, SNI name', 'the full HTTP request', 'l30', 'sees'], ['route by path / header', 'no', 'yes', 'l30', 'route'], ['terminate TLS', 'no · bytes pass through', 'yes · holds the certificate', 'l30', 'end'], ['overhead', 'very low', 'higher · parses, re-encrypts', 'l30', 'overhead'], ['typical tools', 'AWS NLB · iptables · IPVS', 'Nginx · Envoy · HAProxy · gateways', 'l31', 'tools']];
    TB.forEach((r, i) => { const y = 180 + i * 110; const t = A(r[3], r[4], -0.2); [[240, '#94a3b8', r[1]], [1040, '#f87171', r[2]]].forEach((c, k) => { ui('tb' + i + k, rect(0, 0, 640, 96, 'rgba(14,18,30,.94)', { rx: 14, stroke: c[1], sw: 3 }) + T(r[0], 22, '#9aa4b6', { anchor: 'start', dx: 20, dy: 26 }) + T(c[2], 29, '#fff', { anchor: 'start', dx: 20, dy: 66 }), c[0], y, {}); pop('tb' + i + k, t); }); });
    ['c4', 'c7'].forEach((i) => S.ents[i]); for (let i = 0; i < 5; i++) for (let k = 0; k < 2; k++) hide('tb' + i + k, A('l32', 'when', -0.2), 0.4);
    C('u4', 'L4: speed · end-to-end TLS', 560, 300, '#94a3b8', 'l32', 'four', 480); C('u7', 'L7: routing · rewrite · firewall · per-path rules', 1340, 300, '#f87171', 'l32', 'seven', 720);
    ['u4', 'u7', 'c4', 'c7'].forEach((i) => hide(i, A('l33', 'one', -0.3), 0.4));
    ui('hello', rect(0, 0, 760, 220, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('TLS ClientHello (not encrypted yet)', 30, '#7ee0ff', { dx: 380, dy: 40 }) + T('SNI: shop.example.com', 44, '#fff', { dx: 380, dy: 120, font: mono }) + T('visible on purpose', 28, '#ffd166', { dx: 380, dy: 180 }), 580, 180, {}); pop('hello', A('l33', 'server', -0.3));
    C('lpick', 'Lou reads the name → picks a backend', 960, 480, '#3ddc84', 'l33', 'reads', 640, 0);
    C('nokey', 'never touches the keys', 960, 560, '#ffd166', 'l33', 'keys', 460, 0);
    ['hello', 'lpick', 'nokey'].forEach((i) => hide(i, A('l34', 'why', -0.3), 0.4));
    P('sn1', 'before SNI', 'pick a certificate first → one certificate per IP', 300, 220, 640, 130, '#ff7b7b', 'l34', 'before'); P('sn2', 'with SNI', 'host name in the clear → many sites, one address', 980, 220, 640, 130, '#3ddc84', 'l34', 'puts');
    ['sn1', 'sn2'].forEach((i) => hide(i, B('l35', -0.3), 0.4));
    C('lb', 'which backend gets picked → Load Balancing note', 960, 400, '#c084fc', 'l35', 'round', 700, 0);
  });

  tw('lou', B('l36', -0.5), 0.4, { o: 0 });
  /* ===== S6a: who is the real client (world) ===== */
  blk('l36', 'l39', false, () => {
    cam(B('l36', -0.3), 1.6, 'orion');
    ask('rq', 'from: 10.0.0.1 (Rhea)', '#f87171', 1840, 560, 2250, 560, B('l36', 0.6), 1.2);
    bubble('who', '❓ who really called?', '#ffd166', 2330, 420); pop('who', A('l36', 'learn', -0.3));
    ui('xff', rect(0, 0, 900, 140, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('X-Forwarded-For: 203.0.113.9, 10.0.0.5', 36, '#fff', { dx: 450, dy: 50, font: mono }) + T('every hop appends what it saw', 28, '#7ee0ff', { dx: 450, dy: 105 }), 510, 180, {}); pop('xff', A('l37', 'x', -0.3));
    C('fwd', 'Forwarded: for= · proto= · host=  (the standard way)', 960, 360, '#c084fc', 'l37', 'newer', 760);
    tw('mal', B('l38', -0.3), 0.001, { o: 1, x: 1250 });
  });
  blk('l39', 'l45', true, () => {
    P('fg', 'forged header', 'X-Forwarded-For: 1.1.1.1', 300, 200, 640, 130, '#ff5d5d', 'l39', 'trap'); C('lm', 'left-most = whatever the attacker wrote ✗', 960, 380, '#ff7b7b', 'l39', 'left', 760);
    C('bypass', 'bypasses allow-lists and rate limits', 960, 450, '#ffb066', 'l39', 'allow', 560);
    ['fg', 'lm', 'bypass'].forEach((i) => hide(i, B('l40', -0.3), 0.4));
    ui('rule', T('trust N entries from the RIGHT', 60, '#3ddc84', { w: 1200 }), 960, 200, {}); pop('rule', A('l40', 'right', -0.5)); C('nn', 'N = number of proxies YOU control', 960, 290, '#ffd166', 'l40', 'proxies', 560);
    ['rule', 'nn'].forEach((i) => hide(i, B('l41', -0.3), 0.4));
    [['attacker-spoofed', '#ff5d5d', 'ignored ✗', 'attacker'], ['203.0.113.9', '#3ddc84', 'the real client ✓', 'two'], ['10.0.0.5', '#9aa4b6', 'appended by this hop', 'ten']].forEach((r, i) => { ui('en' + i, rect(0, 0, 420, 100, 'rgba(14,18,30,.95)', { rx: 14, stroke: r[1], sw: 4 }) + T(r[0], 34, r[1], { dx: 210, dy: 36, font: mono }) + T(r[2], 26, '#cdd6e6', { dx: 210, dy: 76 }), 330 + i * 450, 340, {}); pop('en' + i, A('l41', ['attacker', 'dot', 'ten'][i], -0.2)); });
    C('th', 'trustedHops = 2 → trust the last two', 960, 520, '#ffd166', 'l41', 'trust', 620);
    ['en0', 'en1', 'en2', 'th'].forEach((i) => hide(i, B('l42', -0.3), 0.4));
    C('o1', 'one proxy of yours → take the last entry', 960, 260, '#7ee0ff', 'l42', 'one', 640); C('o2', 'CDN + your proxy → two', 960, 340, '#7ee0ff', 'l42', 'c d n', 460); C('o3', 'a fact about YOUR topology, never inferred', 960, 420, '#ffd166', 'l42', 'fact', 700);
    ['o1', 'o2', 'o3'].forEach((i) => hide(i, B('l43', -0.3), 0.4));
    ui('pp', rect(0, 0, 1000, 150, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#c084fc', sw: 4 }) + T('PROXY TCP4 203.0.113.9 10.0.0.1 51234 443', 34, '#fff', { dx: 500, dy: 50, font: mono }) + T('+ the original bytes follow', 28, '#c084fc', { dx: 500, dy: 110 }), 460, 220, {}); pop('pp', A('l43', 'proxy', 0.2));
    card(A('l43', 'proxy', 0), 'PROXY protocol', 'real source address for raw TCP', { color: '#c084fc' });
    C('app1', 'append ✓', 700, 520, '#3ddc84', 'l44', 'append', 220, -0.1); C('app2', 'overwrite ✗ (loses earlier hops)', 1220, 520, '#ff7b7b', 'l44', 'overwrite', 520, 0);
  });

  tw('mal', B('l40', -0.3), 0.4, { o: 0 });
  /* ===== S7: timeouts and errors (panels) ===== */
  blk('l45', 'l52', true, () => {
    P('e502', '502 Bad Gateway', 'no valid answer: refused · reset · malformed', 140, 200, 760, 140, '#ff7b7b', 'l46', 'bad');
    P('e504', '504 Gateway Timeout', 'reached the backend, it took too long', 1020, 200, 760, 140, '#ffb066', 'l46', 'timeout', -0.4);
    uem('clk', '⏱️', 90, 1400, 480); pop('clk', A('l46', 'timer', -0.3)); ui('clkT', T('proxy timer 5 s  ·  backend 8 s', 34, '#ffb066', { w: 800 }), 1400, 560, {}); pop('clkT', A('l46', 'timer', -0.3));
    ['e502', 'e504', 'clk', 'clkT'].forEach((i) => hide(i, B('l47', -0.3), 0.4));
    const TM = [['connect timeout', 'time to open the connection', 'too short → 502s on a slow-to-accept backend', 'too long → piles up on a dead backend', 'l47', 'connect'], ['read timeout', 'time waiting for the reply', 'too short → 504s on slow but valid pages', 'too long → clients held open after giving up', 'l48', 'read'], ['idle timeout', 'how long a reused connection may sit', 'too short → extra handshakes', 'too long → reuse of a connection already closed', 'l49', 'idle']];
    TM.forEach((r, i) => { const y = 200 + i * 220; ui('tm' + i, rect(0, 0, 1400, 190, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#7ee0ff', sw: 4 }) + T(r[0], 38, '#7ee0ff', { anchor: 'start', dx: 30, dy: 40 }) + T(r[1], 26, '#cdd6e6', { anchor: 'start', dx: 30, dy: 82 }) + T(r[2], 30, '#ff9f6b', { anchor: 'start', dx: 30, dy: 126 }) + T(r[3], 30, '#ff7b7b', { anchor: 'start', dx: 30, dy: 164 }), 260, y, {}); pop('tm' + i, A(r[4], r[5], -0.3)); });
    ['tm0', 'tm1', 'tm2'].forEach((i) => hide(i, B('l50', -0.3), 0.4));
    for (let i = 0; i < 6; i++) { uem('pool' + i, '🔗', 80, 460 + i * 130, 300); pop('pool' + i, A('l50', 'pool', 0) + i * 0.12); }
    C('pf', 'too few → requests queue', 700, 460, '#ffb066', 'l50', 'few', 440); C('pm', 'too many → exhaust the backend', 1260, 460, '#ff7b7b', 'l50', 'many', 520); C('pk2', 'pool sized to the backend\'s own concurrency', 960, 560, '#7ee0ff', 'l50', 'sized', 660);
    for (let i = 0; i < 6; i++) hide('pool' + i, B('l51', -0.3), 0.4); ['pf', 'pm', 'pk2'].forEach((i) => hide(i, B('l51', -0.3), 0.4));
    P('b413', '413 Payload Too Large', 'cap the body at the proxy', 160, 200, 760, 120, '#ffd166', 'l51', 'maximum'); P('ws', 'WebSocket', 'forward Upgrade, then a raw two-way pipe', 1000, 200, 760, 120, '#3ddc84', 'l51', 'web'); P('h2', 'HTTP/2 and gRPC', 'speak HTTP/2 on both sides', 580, 360, 760, 120, '#c084fc', 'l51', 'two', -0.5);
  });

  /* ===== S8: sidecars and service mesh (world) ===== */
  blk('l52', 'l59', false, () => {
    cam(B('l52', -0.3), 1.6, 'orion');
    tw('sid', A('l52', 'sidecar', -0.5), 0.5, { o: 1 }); tw('sid2', A('l52', 'sidecar', -0.3), 0.5, { o: 1 }); card(A('l52', 'sidecar', 0), 'Sidecar', 'one proxy beside every service', { color: '#0ea5e9' });
    bubble('lh', 'localhost', '#ffd166', 2380, 560); pop('lh', B('l54', 0.3)); fly('lh', B('l54', 0.6), [[2380, 560], [2440, 640]], 0.8, {}); hide('lh', B('l54', 1.6), 0.3);
    line('mt', 2480, 700, 2750, 700, '#0ea5e9', 10); draw('mt', A('l55', 'mutual', -0.5), 0.9); wl('mtL', '🔒 mTLS', '#0ea5e9', 2610, 640, A('l55', 'mutual', -0.2), 36); wl('rtL', '↻ retry', '#ffd166', 2610, 590, A('l55', 'retries', -0.2), 36);
    tw('cora', A('l56', 'control', -0.5), 0.5, { o: 1 });
    [2440, 2790].forEach((x, i) => { line('cp' + i, 2650, 540, x, 650, '#a855f7', 6); draw('cp' + i, A('l56', 'push', 0) + i * 0.3, 0.6); });
    C('cfg', 'routing · retries · timeouts · certificates', 2650, 330, '#a855f7', 'l56', 'routing', 640);
    card(A('l57', 'mesh', 0), 'Service mesh', 'Istio · Linkerd', { color: '#a855f7' });
    C('cc1', 'extra hop per call', 2250, 250, '#ffb066', 'l57', 'extra', 300); C('cc2', 'memory + CPU across the fleet', 2650, 190, '#ffb066', 'l57', 'memory', 440); C('cc3', 'operational complexity', 3050, 250, '#ffb066', 'l57', 'operational', 380);
    ['cc1', 'cc2', 'cc3', 'cfg'].forEach((i) => hide(i, B('l58', -0.3), 0.4));
    C('spiffe', 'each sidecar shows an identity certificate (SPIFFE)', 2650, 330, '#3ddc84', 'l58', 'certificate', 760); C('vf', 'every hop verifies who it talks to ✓', 2650, 400, '#3ddc84', 'l58', 'verify', 640);
  });

  ['sid', 'sid2', 'cora'].forEach((i) => tw(i, B('l59', -0.3), 0.4, { o: 0 }));
  /* ===== S9: names that overlap ===== */
  blk('l59', 'l61', true, () => {
    P('g1', 'Reverse proxy', 'terminate and forward to backends', 200, 220, 1000, 120, '#f87171', 'l59', 'reverse'); P('g2', 'Load balancer', 'spread traffic across copies of one backend', 200, 370, 1000, 120, '#3ddc84', 'l59', 'load'); P('g3', 'API gateway', 'login checks · per-client quotas · request changes', 200, 520, 1000, 120, '#c084fc', 'l59', 'gateway');
    C('one3', 'one program (Nginx, Envoy) often does all three', 960, 760, '#ffd166', 'l60', 'one', 800, 0);
  });

  /* ===== S10: trade-offs, failures, monitoring ===== */
  blk('l61', 'g1', true, () => {
    [['every hop adds latency + a failure point', 'latency'], ['L4 passthrough: end-to-end TLS, no HTTP features', 'four'], ['mesh: not worth it for a handful of services', 'mesh'], ['trusting headers blindly: worse than not using them', 'trusting']].forEach((t, i) => C('to' + i, t[0], 960, 200 + i * 90, '#ffb066', 'l61', t[1], 900, -0.2));
    ['to0', 'to1', 'to2', 'to3'].forEach((i) => hide(i, B('l62', -0.3), 0.4));
    const FX = [['spoofed client IP', 'trust N hops from the right', 'l62', 'spoofed'], ['502s after a restart', 'health checks · idle timeout shorter than the backend\'s', 'l62', 'restart'], ['504s under load', 'slow backend, or wrong timer for that route?', 'l62', 'load'], ['huge uploads fill the proxy', 'cap · stream · presigned upload', 'l63', 'huge'], ['WebSocket drops when idle', 'raise idle timeout · app pings', 'l63', 'sockets']];
    FX.forEach((r, i) => { ui('fx' + i, rect(0, 0, 1500, 110, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#ff9f6b', sw: 4 }) + T(r[0], 32, '#ff9f6b', { anchor: 'start', dx: 24, dy: 34 }) + T('→ ' + r[1], 28, '#fff', { anchor: 'start', dx: 24, dy: 80 }), 210, 160 + i * 125, {}); pop('fx' + i, A(r[2], r[3], -0.2)); });
    for (let i = 0; i < 5; i++) hide('fx' + i, B('l64', -0.3), 0.4);
    ['502 / 504 counted at the proxy, apart from backend 500s', 'connect + response latency', 'connection pool size', 'TLS handshake failures', 'body-size rejections'].forEach((t, i) => C('mn' + i, '👁 ' + t, 960, 220 + i * 85, '#3ddc84', 'l64', ['five', 'connect', 'pool', 'handshake', 'body'][i], 900, -0.2));
    for (let i = 0; i < 5; i++) hide('mn' + i, B('l65', -0.3), 0.4);
    P('bf', 'Buffering', 'protects backends from slow clients · doubles memory on big uploads · adds delay', 240, 260, 1440, 130, '#7ee0ff', 'l65', 'buffering'); P('st', 'Streaming', 'no double buffering · brings back the slow-client risk', 240, 430, 1440, 130, '#ffb066', 'l65', 'streaming');
    C('bo', 'good proxies offer both', 960, 660, '#3ddc84', 'l65', 'both', 440, 0);
  });

  /* ===== S10b: Go code ===== */
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('p0', -0.3));
    const L1 = ['func appendForwardedFor(req *http.Request) {', '\thost, _, err := net.SplitHostPort(req.RemoteAddr)', '\tif err != nil { host = req.RemoteAddr }', '\tif prior := req.Header.Get("X-Forwarded-For"); prior != "" {', '\t\treq.Header.Set("X-Forwarded-For", prior+", "+host) // append', '\t} else {', '\t\treq.Header.Set("X-Forwarded-For", host)', '\t}', '\tif req.Header.Get("X-Forwarded-Proto") == "" {', '\t\treq.Header.Set("X-Forwarded-Proto", "http") // only if absent', '\t}', '}'];
    const c1 = S.codePanel('c1', L1, { x: 180, y: 150, w: 1560, fs: 29, title: 'proxy.go', t0: B('g1', 0.5), times: L1.map((x, i) => A('g2', 'first', 0) + i * 0.2) });
    c1.hl(1, A('g2', 'strips', -0.4)); c1.hl(4, A('g2', 'adds', 0)); c1.hl(8, A('g2', 'protocol', 0)); c1.out(A('g3', 'second', -0.2));
    const L2 = ['func TrustedClientIP(xff string, trustedHops int) string {', '\tif xff == "" || trustedHops <= 0 { return "" }', '\tparts := strings.Split(xff, ",")', '\tfor i := range parts { parts[i] = strings.TrimSpace(parts[i]) }', '\tif trustedHops > len(parts) { trustedHops = len(parts) }', '\treturn parts[len(parts)-trustedHops] // count from the RIGHT', '}'];
    const c2 = S.codePanel('c2', L2, { x: 180, y: 190, w: 1560, fs: 31, title: 'trusted_ip.go', t0: A('g3', 'second', 0), times: L2.map((x, i) => A('g3', 'second', 0.5) + i * 0.3) });
    c2.hl(2, A('g3', 'splits', 0)); c2.hl(4, A('g3', 'clamps', 0)); c2.hl(5, A('g3', 'returns', 0));
    chip('gx', 'trustedHops = 2 → "203.0.113.9, 10.0.0.5" → 203.0.113.9', 960, 700, '#ffd166', A('g3', 'one', 0.2), { w: 900 });
    chip('gt', 'tests: forwarding + headers ✓ · unreachable backend → 502 ✓ · forged header → right hop ✓ · go test -race', 960, 800, '#3ddc84', A('g4', 'three', 0), { w: 1500 });
    chip('gp', 'Director rewrites host · appends the header · ErrorHandler → clean 502', 960, 900, '#7ee0ff', A('g4', 'around', 0), { w: 1100 });
    S.scope(null);
  });
  kill(sc, B('p0', -0.3), 0.5);
  /* ===== S10c: interview round ===== */
  blk('p0', 'l66', true, () => {
    const QA = [['Forward vs reverse proxy?', 'forward = the client’s agent (outbound) · reverse = the server’s agent (inbound)', 'p1', 'one'], ['Blocked at a rate limit though under quota?', 'trusting the left-most X-Forwarded-For · count only N hops from the right', 'p2', 'two'], ['How does L4 route TLS without decrypting?', 'reads the SNI in the unencrypted hello, forwards raw bytes', 'p3', 'three'], ['502 and 504 in the same spike?', '502: no valid answer (health, refusals) · 504: too slow (latency, wrong timer)', 'p4', 'four'], ['Why is gRPC trickier than REST?', 'needs HTTP/2 multiplexed streams · an HTTP/1.1 backend leg breaks it', 'p5', 'five'], ['When choose L4 passthrough on purpose?', 'end-to-end TLS required · backend sees client certs · lowest latency, no HTTP features', 'p6', 'six']];
    QA.forEach((q, i) => { const y = 100 + i * 150; ui('qa' + i, rect(0, 0, 1640, 134, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 40 }) + T(q[1], 25, '#fff', { anchor: 'start', dx: 26, dy: 94 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });
  /* ===== S11: summary ===== */
  blk('l66', 'rn1', true, () => {
    ui('sh', T('SUMMARY · easy → advanced', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('l66', 0));
    const SUM = [['1', 'Level 1 · A proxy is a go-between. Forward hides the client, reverse hides the server', 'l66a', '#7ee0ff'], ['2', 'Level 2 · Forward: CONNECT tunnel, or TLS inspection. Reverse: terminate TLS, route, buffer, share chores', 'l66b', '#ec4899'], ['3', 'L4 reads the envelope: fast, end-to-end TLS. L7 reads the letter: routes by path. SNI lets L4 pick by name', 'l66c', '#94a3b8'], ['4', 'Level 3 · X-Forwarded-For: trust only the last N entries, append never overwrite. PROXY protocol for L4', 'l66d', '#ff7b7b'], ['5', '502 = no valid answer, 504 = too slow. Tune connect / read / idle timeouts, pool, body cap, HTTP/2 for gRPC', 'l66e', '#ffb066'], ['6', 'Sidecars: a proxy per service, one control plane. Mesh trades hops and complexity for retries + mTLS', 'l66f', '#a855f7'], ['7', 'Forward hides the client · reverse hides the server · L4 moves bytes · L7 reads requests', 'l66g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1640, 108, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 27, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 140, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'l67', true, () => {
    C('rn1a', '📘 notes: Forward and Reverse Proxies - L4 vs L7  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1100, 0);
    C('rn1b', '⬅ before: HTTP Fundamentals · TCP', 960, 410, '#ffd166', 'rn1', 'before', 1100, 0);
    C('rn1c', '➡ after: Nginx · TLS and HTTPS', 960, 490, '#3ddc84', 'rn1', 'after', 1100, 0);
    C('rn1d', '↔ compare: Load Balancing · API Gateway and BFF · CDN and Edge', 960, 570, '#c084fc', 'rn1', 'compare', 1100, 0);
  });
  cam(B('l67', -0.4), 1.4, 'kai');
  tw('kai', B('l67', 0.5), 0.3, { r: -5 }); tw('kai', B('l67', 0.9), 0.3, { r: 5 }); tw('kai', B('l67', 1.3), 0.3, { r: 0 });
  ui('endT', T('Proxies', 150, '#fff', { w: 900 }), 960, 440, {}); ui('endS', T('forward hides the client · reverse hides the server', 48, '#cdd6e6', { w: 1100 }), 960, 570, {});
  pop('endT', B('l68', 1.2)); pop('endS', B('l68', 1.8));
})();
