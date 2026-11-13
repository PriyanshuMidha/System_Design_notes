/* IP addressing: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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
    dev: { who: 'DEV', skin: '#d9a37a', shirt: '#3b82f6', pants: '#2a2f3a', hair: '#2b2118', hold: '💻', w: 100, name: 'Dev', ring: '#3b82f6' },
    cid: { who: 'CID', skin: '#e8b48a', shirt: '#475569', pants: '#222', glasses: 1, hair: '#666', tie: '#f59e0b', hold: '📐', w: 108, name: 'Cid', ring: '#94a3b8' },
    nora: { who: 'NORA', skin: '#f0c4a0', shirt: '#db2777', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', hold: '🗒️', blush: 1, w: 92, name: 'Nora', ring: '#f472b6' },
    vic: { who: 'VIC', skin: '#9b6a47', shirt: '#ea580c', pants: '#333', hat: 'cap', hatColor: '#9a3412', hold: '☁️', w: 110, name: 'Vic', ring: '#fb923c' },
    rae: { who: 'RAE', skin: '#f1c9a5', shirt: '#0d9488', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🧭', w: 90, name: 'Rae', ring: '#2dd4bf' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#46589a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 56 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY }, keep));
  bld('bD', 300, '#1d4ed8', 'DEV · HOME', '🏠'); bld('bN', 950, '#9d174d', 'NORA · NAT DESK', '🗒️'); bld('bC', 1900, '#475569', 'CID · PLANNER', '📐'); bld('bV', 2650, '#c2410c', 'VIC · AWS VPC', '☁️');
  mk('inet', Em('🌐', 170), Object.assign({ x: 1450, y: 640 }, keep)); mk('inetL', T('internet', 34, '#cdd6e6'), Object.assign({ x: 1450, y: 760 }, keep));
  mkChar('dev', CFG.dev, 380, 830, keep); mkChar('nora', CFG.nora, 970, 830, keep); mkChar('cid', CFG.cid, 1920, 830, keep); mkChar('vic', CFG.vic, 2660, 830, keep); mkChar('rae', CFG.rae, 2870, 830, keep);
  [['Dev', 380, '#60a5fa'], ['Nora', 970, '#f472b6'], ['Cid', 1920, '#cbd5e1'], ['Vic', 2660, '#fb923c'], ['Rae', 2870, '#2dd4bf']].forEach((n) => mk('nm' + n[0], T(n[0], 38, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['DEV', 'CID', 'NORA', 'VIC', 'RAE'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { wide: { x: 1500, y: 470, s: 0.56 }, dev: { x: 700, y: 520, s: 0.95 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.wide);
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, withDim, fn) => { scene(() => { if (withDim) dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };
  const mono2 = (id, text, col, x, y, t, size) => { ui(id, T(text, size || 34, col, { anchor: 'start', font: mono }), x, y, {}); pop(id, t); };

  /* ===== S1: one public address (world) ===== */
  blk('l1', 'l7', false, () => {
    cam(B('l1', 0), 0.01, 'wide');
    [['💻', 250, '192.168.1.42'], ['📱', 330, '192.168.1.43'], ['📺', 410, '192.168.1.44']].forEach((d, i) => { em('dv' + i, d[0], 70, d[1], 560 - i * 0); wl('dvl' + i, d[2], '#7ee0ff', d[1], 640 + i * 0, A('l1', ['laptop', 'phones', 'television'][i], 0), 22); pop('dv' + i, A('l1', ['laptop', 'phones', 'television'][i], -0.2)); });
    wl('pubA', '1 public address: 203.0.113.9', '#ffd166', 950, 330, A('l1', 'exactly', -0.2), 36);
    ['dv0', 'dv1', 'dv2', 'dvl0', 'dvl1', 'dvl2', 'pubA'].forEach((i) => hide(i, A('l2', 'level', -0.4), 0.4));
    [['IP address: names one device · 10.0.1.17', 'address', '#7ee0ff'], ['bit: 0 or 1 · IPv4 = 32 of them', 'bit', '#3ddc84'], ['/24: the first 24 bits are fixed', 'prefix', '#ffd166']].forEach((w, i) => C('w' + i, w[0], 1500, 170 + i * 75, w[2], 'l2', w[1], 760, 0));
    ['w0', 'w1', 'w2'].forEach((i) => hide(i, B('l3', -0.2), 0.4));
    C('st', 'network part = the street (10.0.1) · host part = the house (.17)', 1500, 170, '#c084fc', 'l3', 'network', 1000, 0);
    ['st'].forEach((i) => hide(i, B('l4', -0.2), 0.4));
    [['port: a program on a device · 443', 'port', '#ff9f6b'], ['router: forwards toward the destination', 'router', '#7ee0ff'], ['public 8.8.8.8 · private 192.168.1.5', 'public', '#3ddc84'], ['route table: traffic for this range goes there', 'route', '#c084fc']].forEach((w, i) => C('x' + i, w[0], 1500, 170 + i * 75, w[2], 'l4', w[1], 820, 0));
    ['x0', 'x1', 'x2', 'x3'].forEach((i) => hide(i, B('l5', -0.2), 0.4));
    C('rm', '/N fixes the first N bits · NAT lets many private devices share one public IP', 1500, 250, '#3ddc84', 'l6', 'remember', 1200, -0.3);
  });

  /* ===== S2: why addressing and NAT exist ===== */
  blk('l7', 'l12', true, () => {
    ui('big', T('2³² ≈ 4.3 billion addresses', 80, '#ffd166', { w: 1500 }), 960, 200, {}); pop('big', A('l7', 'thirty', -0.2));
    C('ph', 'more phones on the planet than IPv4 addresses', 960, 310, '#ff7b7b', 'l7', 'phones', 760, 0);
    P('f1', 'fix 1 · CIDR', 'flexible prefix lengths replace rigid class A / B / C → hand out exactly the size needed', 160, 400, 1600, 120, '#7ee0ff', 'l8', 'first');
    P('f2', 'fix 2 · private addressing + NAT', 'every home and company reuses the same private ranges · only the NAT box’s public IP is visible', 160, 540, 1600, 120, '#3ddc84', 'l9', 'second');
    ['home', 'office', '1000 others'].forEach((n, i) => { ui('nb' + i, rect(0, 0, 440, 100, 'rgba(14,18,30,.95)', { rx: 14, stroke: '#ffd166', sw: 4 }) + T(n + ' · 192.168.1.0/24', 30, '#ffd166', { dx: 220, dy: 50 }), 200 + i * 520, 740, {}); pop('nb' + i, A('l10', ['home', 'office', 'thousand'][i], -0.2)); });
    C('nc', 'no conflict: none of these addresses ever appear on the public internet', 960, 900, '#3ddc84', 'l10', 'conflict', 940, -0.1);
    C('pun', 'CIDR solved allocation waste · NAT solved scarcity', 960, 990, '#c084fc', 'l11', 'allocation', 800, -0.3);
  });

  /* ===== S3: the mental model ===== */
  blk('l12', 'l17', true, () => {
    ui('ad', T('10.0.1.17 / 24', 120, '#fff', { w: 1500, font: mono }), 960, 190, {}); pop('ad', B('l12', 0.5));
    ui('nbx', rect(0, 0, 780, 130, 'rgba(61,220,132,.15)', { rx: 16, stroke: '#3ddc84', sw: 5 }) + T('10.0.1  ·  first 24 bits  ·  the neighbourhood', 32, '#3ddc84', { dx: 390, dy: 65 }), 180, 300, {}); pop('nbx', A('l13', 'prefix', -0.2));
    ui('hbx', rect(0, 0, 440, 130, 'rgba(255,209,102,.15)', { rx: 16, stroke: '#ffd166', sw: 5 }) + T('.17  ·  last 8 bits  ·  the house', 32, '#ffd166', { dx: 220, dy: 65 }), 990, 300, {}); pop('hbx', A('l13', 'remaining', -0.2));
    C('h256', '2⁸ = 256 possible houses', 960, 500, '#7ee0ff', 'l13', 'two', 520, 0); C('res', '2 reserved: the network address + the broadcast address → 254 usable', 960, 580, '#ffb066', 'l14', 'reserved', 920, -0.2);
    ui('log', rect(0, 0, 1100, 190, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#f472b6', sw: 4 }) + T('Nora’s log = the NAT translation table, keyed by port', 32, '#f472b6', { dx: 550, dy: 40 }) + T('private ip:port  ⇄  public ip:port', 34, '#fff', { dx: 550, dy: 110, font: mono }), 410, 680, {}); pop('log', A('l15', 'log', -0.2));
    C('br', 'NAT also hands brand-new outbound mail a tracking number (a port) so the reply finds its way back', 960, 940, '#c084fc', 'l16', 'tracking', 1300, -0.2);
  });

  /* ===== S4: CIDR prefix math ===== */
  blk('l17', 'l19', true, () => {
    const R = [['/8', '16,777,216', '16,777,214', 'a legacy class A', 'l17', 'eight'], ['/16', '65,536', '65,534', 'a whole VPC', 'l18', 'sixteen'], ['/20', '4,096', '4,094', 'one subnet per AZ', 'l18', 'twenty'], ['/24', '256', '254', 'a typical LAN', 'l18', 'twenty'], ['/30', '4', '2', 'a router-to-router link', 'l18', 'thirty'], ['/31', '2', '2', 'point-to-point (RFC 3021)', 'l18', 'thirty one'], ['/32', '1', '1', 'a single host route', 'l18', 'thirty two']];
    ['PREFIX', 'ADDRESSES', 'USABLE', 'TYPICAL USE'].forEach((h, i) => { ui('ph' + i, T(h, 26, '#9aa4b6', { w: 500 }), [260, 640, 1010, 1420][i], 90, {}); pop('ph' + i, B('l17', 0.3)); });
    R.forEach((r, i) => { ui('pr' + i, rect(0, 0, 1640, 84, 'rgba(14,18,30,.95)', { rx: 14, stroke: '#7ee0ff', sw: 3 }) + T(r[0], 36, '#7ee0ff', { dx: 120, dy: 42 }) + T(r[1], 32, '#fff', { dx: 500, dy: 42, font: mono }) + T(r[2], 32, '#3ddc84', { dx: 870, dy: 42, font: mono }) + T(r[3], 26, '#cdd6e6', { anchor: 'start', dx: 1100, dy: 42 }), 140, 120 + i * 98, {}); pop('pr' + i, A(r[4], r[5], -0.3) + (i === 3 ? 0.4 : 0)); });
    C('hv', 'each extra prefix bit HALVES the block · each fewer bit DOUBLES it', 960, 840, '#ffd166', 'l17', 'halves', 960, 0);
  });
  blk('l19', 'l22', true, () => {
    ui('vp', T('10.0.0.0/16  →  /20 subnets:  2^(20−16) = 16 blocks', 52, '#fff', { w: 1700 }), 960, 110, {}); pop('vp', A('l19', 'split', -0.2));
    for (let i = 0; i < 16; i++) { const x = 160 + (i % 4) * 420, y = 200 + Math.floor(i / 4) * 130; ui('sn' + i, rect(0, 0, 390, 110, 'rgba(14,18,30,.95)', { rx: 14, stroke: i < 4 ? '#3ddc84' : '#475569', sw: i < 4 ? 4 : 2 }) + T('10.0.' + (i * 16) + '.0/20', 32, i < 4 ? '#3ddc84' : '#64748b', { dx: 195, dy: 55, font: mono }), x, y, {}); pop('sn' + i, A('l20', ['first', 'next', 'then', 'then'][i] || 'step', 0) + (i > 3 ? 3 + i * 0.1 : 0) + (i === 3 ? 0.9 : 0) + (i === 2 ? 0.3 : 0)); }
    C('st4', 'each step adds 4,096 addresses', 960, 760, '#ffd166', 'l20', 'step', 560, 0);
    C('mis', '✗ a bigger prefix number is NOT a bigger block · /24 is smaller than /16', 960, 860, '#ff7b7b', 'l21', 'mistake', 1000, -0.2); C('mis2', 'smaller /N number = bigger block', 960, 940, '#3ddc84', 'l21', 'smaller', 640, 0);
  });

  /* ===== S5: IPv4 vs IPv6 ===== */
  blk('l22', 'l25', true, () => {
    ui('v6', T('IPv6:  2001:0db8:85a3:0000:0000:8a2e:0370:7334', 46, '#c084fc', { w: 1700, font: mono }), 960, 140, {}); pop('v6', A('l22', 'eight', -0.2)); C('v6b', '128 bits · ~340 undecillion addresses · drop leading zeros', 960, 220, '#c084fc', 'l22', 'dropping', 900, -0.2);
    const T6 = [['address size', '32 bits', '128 bits', 'l23', 'compare'], ['total addresses', '~4.3 billion', '~340 undecillion', 'l23', 'billion'], ['needs NAT to share?', 'yes, in practice', 'no · globally routable', 'l23', 'n a t'], ['private equivalent', 'RFC 1918', 'unique local fc00::/7', 'l23', 'private'], ['written as', 'four dotted bytes', 'eight colon-separated hex groups', 'l23', 'written']];
    ui('c4', T('IPv4', 40, '#7ee0ff', { w: 500 }), 760, 330, {}); ui('c6', T('IPv6', 40, '#c084fc', { w: 500 }), 1400, 330, {}); pop('c4', B('l23', 0.2)); pop('c6', B('l23', 0.2));
    T6.forEach((r, i) => { ui('t6' + i, rect(0, 0, 1640, 90, 'rgba(14,18,30,.95)', { rx: 14, stroke: '#475569', sw: 3 }) + T(r[0], 26, '#9aa4b6', { anchor: 'start', dx: 24, dy: 45 }) + T(r[1], 28, '#7ee0ff', { dx: 760 - 140, dy: 45 }) + T(r[2], 28, '#c084fc', { dx: 1400 - 140, dy: 45 }), 140, 370 + i * 100, {}); pop('t6' + i, A(r[3], r[4], -0.2) + i * 0.7); });
    C('ds', 'dual stack: both addresses · prefers IPv6 when both sides support it (the AAAA record)', 960, 920, '#3ddc84', 'l24', 'dual', 1200, -0.2);
  });

  /* ===== S6: private ranges ===== */
  blk('l25', 'l28', true, () => {
    P('r1', '10.0.0.0/8', '10.0.0.0 – 10.255.255.255 · ~16.7 million · large company networks, most cloud VPCs', 160, 140, 1600, 130, '#3ddc84', 'l26', 'ten');
    P('r2', '172.16.0.0/12', '172.16.0.0 – 172.31.255.255 · ~1 million · Docker’s default bridge range', 160, 300, 1600, 130, '#7ee0ff', 'l26', 'one');
    P('r3', '192.168.0.0/16', '192.168.0.0 – 192.168.255.255 · 65,536 · home routers', 160, 460, 1600, 130, '#ffd166', 'l26', 'and');
    C('r4', 'RFC 1918 · never on the public internet → anyone can reuse them', 960, 660, '#c084fc', 'l25', 'reserved', 900, -0.2);
    C('r5', '127.0.0.0/8 loopback · “this machine”', 560, 780, '#ff9f6b', 'l27', 'one', 560, -0.1); C('r6', '169.254.0.0/16 link-local', 1360, 780, '#ff9f6b', 'l27', 'sixty', 460, -0.1);
    C('r7', 'a private range in a log = internal · outside a private network = misconfigured', 960, 900, '#3ddc84', 'l27', 'instant', 1100, -0.1);
  });

  /* ===== S7: NAT and PAT (world + table) ===== */
  blk('l28', 'l35', false, () => {
    cam(B('l28', -0.3), 1.4, 'wide');
    wl('n1', 'NAT: private → public source rewrite · reversed on the way back', '#f472b6', 1500, 250, A('l28', 'rewrites', -0.2), 36);
    wl('n2', 'one-to-one NAT saves no addresses', '#ffb066', 1500, 320, A('l28', 'saves', -0.2), 36);
    ['n1', 'n2'].forEach((i) => hide(i, B('l29', -0.2), 0.4));
    wl('n3', 'PAT also rewrites the SOURCE PORT · key = (public IP, public port)', '#3ddc84', 1500, 250, A('l29', 'port', -0.3), 38);
    hide('n3', B('l30', -0.2), 0.4);
    ask('t1', '192.168.1.42:51000 → example.com:443', '#7ee0ff', 400, 580, 940, 580, B('l30', 1.2), 2.2);
    ui('tbl', rect(0, 0, 1200, 160, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#f472b6', sw: 4 }) + T('NAT table', 28, '#f472b6', { dx: 600, dy: 30 }) + T('192.168.1.42:51000  ⇄  203.0.113.9:40001', 36, '#fff', { dx: 600, dy: 100, font: mono }), 360, 110, {}); pop('tbl', A('l31', 'table', -0.2));
    ask('t2', 'src now 203.0.113.9:40001', '#ffd166', 1000, 640, 1450, 640, A('l31', 'rewrite', -0.2), 2.0);
    ask('t3', 'reply → 203.0.113.9:40001', '#3ddc84', 1450, 700, 1010, 700, A('l32', 'replies', -0.1), 2.2);
    ask('t4', 'dst back to 192.168.1.42:51000', '#3ddc84', 970, 760, 420, 760, A('l32', 'looks', 0.8), 2.2);
    C('lim', 'one public IP ≈ 64,000 simultaneous outbound connections (16-bit ports)', 1500, 460, '#ffd166', 'l33', 'sixty', 900, -0.2);
    C('nf', '✗ NAT ≠ a firewall · it blocks unsolicited inbound only incidentally', 1500, 540, '#ff7b7b', 'l34', 'mistake', 920, -0.2);
  });

  /* ===== S8: AWS VPC ===== */
  blk('l35', 'l40', true, () => {
    ui('vpcb', rect(0, 0, 1700, 640, 'rgba(14,18,30,.5)', { rx: 22, stroke: '#fb923c', sw: 5 }) + T('VPC · 10.0.0.0/16 · your own private address space', 32, '#fb923c', { dx: 850, dy: 36 }), 110, 110, {}); pop('vpcb', A('l35', 'private', -0.4));
    [['public subnet', '0.0.0.0/0 → Internet Gateway|instances need a public / Elastic IP', '#3ddc84', 150, 'l37', 'public'], ['private subnet', '0.0.0.0/0 → NAT gateway|NAT sits in a public subnet', '#7ee0ff', 760, 'l38', 'private'], ['isolated subnet', 'no default route at all|not even outbound', '#ff7b7b', 1370, 'l39', 'isolated']].forEach((s, i) => { ui('sub' + i, rect(0, 0, 480, 380, 'rgba(14,18,30,.95)', { rx: 18, stroke: s[2], sw: 5 }) + T(s[0], 34, s[2], { dx: 240, dy: 50 }) + T(s[1].split('|')[0], 24, '#fff', { dx: 240, dy: 120 }) + T(s[1].split('|')[1], 22, '#cdd6e6', { dx: 240, dy: 170 }), s[3], 220, {}); pop('sub' + i, A(s[4], s[5], -0.3)); });
    ui('az', T('each subnet is pinned to ONE availability zone · each has a route table', 28, '#cdd6e6', { w: 1500 }), 960, 640, {}); pop('az', A('l35', 'availability', -0.2));
    C('nsr', 'there is NO “public subnet” resource · it is only the route table', 960, 720, '#ffd166', 'l36', 'surprise', 960, -0.2);
    C('pi', 'public instances need a public / Elastic IP', 960, 790, '#3ddc84', 'l37', 'instances', 640, 0); C('po', 'private: outbound only (packages, external APIs) · nothing can initiate inbound', 960, 860, '#7ee0ff', 'l38', 'reach', 1000, -0.2);
    C('ng', 'the NAT gateway holds one Elastic IP and does PAT like a home router', 960, 930, '#c084fc', 'l39', 'holds', 940, -0.2); C('is', 'isolated: a compromised DB host cannot send data out', 960, 1000, '#ff7b7b', 'l39', 'compromised', 800, 0);
  });

  /* ===== S9: five reserved addresses ===== */
  blk('l40', 'l43', true, () => {
    const RS = [['10.0.0.0', 'network address', '#ff9f6b', 'zero'], ['10.0.0.1', 'VPC router', '#7ee0ff', 'one'], ['10.0.0.2', 'AWS DNS resolver', '#3ddc84', 'two'], ['10.0.0.3', 'reserved for future use', '#c084fc', 'three'], ['10.0.0.255', 'broadcast (reserved, not supported)', '#ff7b7b', 'two']];
    RS.forEach((r, i) => { ui('rs' + i, rect(0, 0, 1500, 110, 'rgba(14,18,30,.95)', { rx: 14, stroke: r[2], sw: 5 }) + T(r[0], 38, r[2], { anchor: 'start', dx: 30, dy: 55, font: mono }) + T(r[1], 32, '#fff', { anchor: 'start', dx: 440, dy: 55 }), 210, 130 + i * 128, {}); pop('rs' + i, A('l40', r[3], -0.2) + (i === 4 ? 4 : 0)); });
    C('pl', 'a plain /24: 2 reserved → 254 usable', 560, 840, '#ffd166', 'l40', 'plain', 520, 0); C('aw', 'AWS /24: 5 reserved → 251 usable', 1360, 840, '#ff9f6b', 'l42', 'two', 520, -0.4);
    C('sz', 'size for a small buffer above the raw instance count', 960, 940, '#3ddc84', 'l42', 'size', 800, 0);
  });

  /* ===== S10: a worked example ===== */
  blk('l43', 'g1', true, () => {
    ui('wk', T('address → 32-bit integer → add a step → back to an address', 48, '#fff', { w: 1700 }), 960, 120, {}); pop('wk', A('l43', 'heart', -0.2));
    P('s1', '1  step = 1 << (32 − 20) = 1 << 12 = 4096', 'each /20 spans 4,096 addresses', 220, 220, 1480, 120, '#7ee0ff', 'l44', 'step');
    P('s2', '2  subnet 0 → 10.0.0.0   ·   subnet 1 → 10.0.0.0 + 4096 = 10.0.16.0', 'subnet 2 → 10.0.32.0 · … · 16 subnets in all (2^(20−16))', 220, 370, 1480, 140, '#3ddc84', 'l45', 'subnet');
    C('s3', '4096 is a power of two → every step lands exactly on a boundary', 960, 620, '#ffd166', 'l45', 'power', 900, -0.2);
  });

  /* ===== S11: Go code ===== */
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('l46', -0.3));
    const L1 = ['func UsableHosts(ones int) (int, error) {', '\tif ones < 0 || ones > 32 { return 0, fmt.Errorf("prefix /%d out of range", ones) }', '\tswitch ones {', '\tcase 32: return 1, nil', '\tcase 31: return 2, nil // RFC 3021 point-to-point', '\tdefault:', '\t\treturn (1 << (32 - ones)) - 2, nil // minus network + broadcast', '\t}', '}'];
    const c1 = S.codePanel('c1', L1, { x: 180, y: 110, w: 1560, fs: 28, title: 'usable.go', t0: B('g2', -0.2), times: L1.map((x, i) => A('g2', 'usable', 0) + i * 0.45) });
    c1.hl(1, A('g2', 'rejects', 0)); c1.hl(3, A('g2', 'thirty', 0.1)); c1.hl(4, A('g2', 'thirty', 1.5)); c1.hl(6, A('g2', 'every', 0)); c1.out(A('g3', 'subnets', -0.3));
    const L2 = ['func Subnets(parentCIDR string, newPrefix int) ([]string, error) {', '\t_, ipNet, err := net.ParseCIDR(parentCIDR)', '\tones, _ := ipNet.Mask.Size()', '\tcount := 1 << (newPrefix - ones)          // 2^(20-16) = 16', '\tstep := uint32(1) << (32 - newPrefix)      // 4096 for a /20', '\tbaseInt := toUint32(ipNet.IP.To4())', '\tfor i := 0; i < count; i++ {', '\t\taddr := fromUint32(baseInt + uint32(i)*step)', '\t\tout = append(out, fmt.Sprintf("%s/%d", addr, newPrefix))', '\t}', '}', 'func toUint32(ip net.IP) uint32 { return uint32(ip[0])<<24 | uint32(ip[1])<<16 | uint32(ip[2])<<8 | uint32(ip[3]) }'];
    const c2 = S.codePanel('c2', L2, { x: 100, y: 110, w: 1720, fs: 25, title: 'subnets.go', t0: A('g3', 'subnets', -0.2), times: L2.map((x, i) => A('g3', 'subnets', 0.2) + i * 0.4) });
    c2.hl(3, A('g3', 'count', 0)); c2.hl(4, A('g3', 'step', 0)); c2.hl(7, A('g4', 'loop', 0)); c2.hl(11, A('g4', 'helpers', 0));
    C('gt', 'tests: usable hosts for common prefixes ✓ · the 16 subnets ✓ · private-range check ✓ · go test -race', 960, 930, '#3ddc84', 'g5', 'tests', 1500, -0.2);
    S.scope(null);
  });
  kill(sc, B('l46', -0.3), 0.5);

  /* ===== S12: variants ===== */
  blk('l46', 't1', true, () => {
    P('va0', 'static VLSM subnetting', 'a prefix per subnet by expected size · stable needs · resizing later is disruptive', 140, 130, 1640, 110, '#7ee0ff', 'l46', 'static');
    P('va1', 'DHCP within a subnet', 'a server leases addresses from the host range · hosts come and go · does not change the size', 140, 255, 1640, 110, '#3ddc84', 'l46', 'd h c p');
    P('va2', 'NAT / PAT (IPv4)', 'rewrite source IP (+ port) at the edge · breaks end-to-end addressing · needs connection tracking', 140, 380, 1640, 110, '#ffd166', 'l47', 'n a t');
    P('va3', 'IPv6, no NAT', 'every host globally unique · needs dual-stack during a long transition', 140, 505, 1640, 110, '#c084fc', 'l47', 'version six');
    P('va4', 'VPC peering / Transit Gateway', 'route between VPCs without NAT · the CIDR ranges must NOT overlap', 140, 630, 1640, 110, '#ff9f6b', 'l47', 'peering');
  });

  /* ===== S13: trade-offs, failures, monitoring ===== */
  blk('t1', 'd1', true, () => {
    C('o1', 'NAT breaks “one address per host”: incoming connections · VoIP · P2P → STUN / TURN · hairpin NAT', 960, 110, '#ffb066', 't1', 'breaks', 1400, -0.2);
    C('o2', 'oversized: a /16 for 10 hosts wastes 65,000+ · undersized: a painful re-IP · remember the 5 reserved', 960, 185, '#ffb066', 't2', 'over', 1500, -0.2); C('o3', 'NAT gateway costs per hour + per GB · air-gapped → an isolated subnet', 960, 260, '#ffb066', 't2', 'costs', 1100, -0.2); C('o4', 'pick non-overlapping ranges company-wide, up front', 960, 335, '#3ddc84', 't2', 'choose', 760, -0.2);
    P('pf1', 'CIDR overlap when peering', 'renumber one side or Transit Gateway · identical ranges cannot be routed between', 140, 410, 1640, 105, '#ff7b7b', 't3', 'overlapping');
    P('pf2', 'one NAT gateway = bottleneck / SPOF', 'one per AZ · resilience + no cross-AZ transfer charges', 140, 530, 1640, 105, '#ff9f6b', 't3', 'single', -0.3);
    P('pf3', 'out of IPs in a subnet', 'size for peak scale-out, not the average', 140, 650, 1640, 105, '#ffd166', 't4', 'running');
    P('pf4', 'private subnet with no NAT route', 'cannot pull images or call external APIs · check the default route target', 140, 770, 1640, 105, '#c084fc', 't4', 'private');
    C('mo', '👁 NAT gateway bandwidth + connection count · free IPs per subnet · cross-AZ / cross-region transfer cost', 960, 940, '#3ddc84', 't5', 'bandwidth', 1600, -0.2);
  });

  /* ===== S14: deep dive ===== */
  blk('d1', 'q0', true, () => {
    P('dd1', 'why PAT stops near 64K', 'key = (public IP, public port) · 16-bit ports · CGNAT gives each subscriber a RANGE of ports', 140, 130, 1640, 150, '#ffd166', 'd1', 'why');
    P('dd2', 'CIDR vs classful (before 1993)', 'need 300 addresses → a wasteful /16 · CIDR gives /23 (510 usable) · route aggregation shrinks routing tables', 140, 310, 1640, 150, '#7ee0ff', 'd2', 'second');
    P('dd3', 'VPC route precedence', 'longest prefix match: 10.0.1.0/24 beats 10.0.0.0/16 · how most traffic goes to NAT but a peered range goes direct', 140, 490, 1640, 150, '#3ddc84', 'd3', 'third');
    P('dd4', 'dual-stack realities', 'clouds default to dual-stack · enterprise tooling is still IPv4 → RFC 1918 + NAT planning stay a day-one decision', 140, 670, 1640, 150, '#c084fc', 'd4', 'fourth');
    P('dd5', 'the isolated tier', 'no default route · reachable only from the app tier’s security group · smaller blast radius', 140, 850, 1640, 150, '#ff7b7b', 'd5', 'last');
  });

  /* ===== S15: interview ===== */
  blk('q0', 's0', true, () => {
    const QA = [['/24: meaning and usable hosts?', 'first 24 of 32 bits fixed · 256 addresses · 254 usable · AWS reserves 5 → 251', 'q1', 'one'], ['“NAT and a firewall are the same”', 'no: NAT translates + tracks connections (blocks inbound only incidentally) · a firewall allows/denies by policy', 'q2', 'two'], ['How does PAT share one IP?', 'rewrites source IP + port · table (public ip:port → private ip:port) · tens of thousands of connections', 'q3', 'three'], ['Public vs private AWS subnet?', 'only the route table: IGW = public · NAT gateway = private · no default route = isolated', 'q4', 'four'], ['Why not 10.0.0.0/24 for every private subnet?', 'peering / on-prem with the same range → routing is ambiguous · plan non-overlapping ranges', 'q5', 'five'], ['Why does IPv6 not need NAT?', '128-bit space → globally unique addresses · unique local ranges exist · NAT optional', 'q6', 'six'], ['Which 5 addresses does AWS reserve?', '.0 network · .1 router · .2 DNS · .3 future use · .255 broadcast-equivalent', 'q7', 'seven']];
    QA.forEach((q, i) => { const y = 80 + i * 140; ui('qa' + i, rect(0, 0, 1640, 124, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 36 }) + T(q[1], 24, '#fff', { anchor: 'start', dx: 26, dy: 86 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });

  /* ===== S16: summary ===== */
  blk('s0', 'rn1', true, () => {
    ui('sh', T('SUMMARY · easy → advanced', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('s0', 0));
    const SUM = [['1', '/N fixes the first N bits · block = 2^(32−N) · usable = that − 2 · smaller /N = bigger block', 's1a', '#7ee0ff'], ['2', 'CIDR ended classful waste + enabled route aggregation · private ranges + NAT ended scarcity · 10/8 · 172.16/12 · 192.168/16', 's1b', '#3ddc84'], ['3', 'NAT = addresses · PAT also ports (≈64K connections per IP) · not a firewall', 's1c', '#ffd166'], ['4', 'IPv6: 128 bits, no NAT needed · hosts run dual-stack and prefer IPv6', 's1d', '#c084fc'], ['5', 'AWS: public vs private = the route table · 5 reserved addresses per subnet · longest prefix match', 's1e', '#ff9f6b'], ['6', 'non-overlapping ranges company-wide · one NAT gateway per AZ · size for peak · watch free IPs + NAT bandwidth', 's1f', '#ff7b7b'], ['7', '/N fixes the first N bits · NAT lets many private devices share one public IP', 's1g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1640, 108, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 23, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 140, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'e1', true, () => {
    C('rn1a', '📘 notes: IP Addressing, Subnets, NAT and VPC Basics  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1300, 0);
    C('rn1b', '⬅ before: How the Internet Works', 960, 410, '#ffd166', 'rn1', 'before', 1300, 0);
    C('rn1c', '➡ after: DNS - Resolution, Records and Caching · TCP', 960, 490, '#3ddc84', 'rn1', 'after', 1300, 0);
    C('rn1d', '↔ compare: Load Balancing · Forward and Reverse Proxies', 960, 570, '#c084fc', 'rn1', 'compare', 1300, 0);
  });
  cam(B('e1', -0.4), 1.4, 'dev');
  tw('dev', B('e1', 0.5), 0.3, { r: -5 }); tw('dev', B('e1', 0.9), 0.3, { r: 5 }); tw('dev', B('e1', 1.3), 0.3, { r: 0 });
  ui('endT', T('IP Addressing, Subnets, NAT, VPC', 100, '#fff', { w: 1700 }), 960, 440, {}); ui('endS', T('/N fixes the first N bits · NAT shares one public IP', 48, '#cdd6e6', { w: 1200 }), 960, 570, {});
  pop('endT', B('e2', 1.2)); pop('endS', B('e2', 1.8));
})();
