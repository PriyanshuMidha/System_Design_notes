/* Internet: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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
    ana: { who: 'ANA', skin: '#c98d5b', shirt: '#14b8a6', pants: '#2a2f3a', hair: '#1a1210', hair2: 'long', hold: '💻', blush: 1, w: 92, name: 'Ana', ring: '#14b8a6' },
    ted: { who: 'TED', skin: '#e3b08a', shirt: '#f97316', pants: '#333', hair: '#333', w: 96, name: 'Ted', ring: '#f97316' },
    ivy: { who: 'IVY', skin: '#f0c4a0', shirt: '#6366f1', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', w: 88, name: 'Ivy', ring: '#6366f1' },
    eli: { who: 'ELI', skin: '#d9a37a', shirt: '#22c55e', pants: '#333', hair: '#222', hat: 'cap', hatColor: '#15803d', w: 98, name: 'Eli', ring: '#22c55e' },
    rory: { who: 'RORY', skin: '#9b6a47', shirt: '#64748b', pants: '#222', hat: 'cap', hatColor: '#334155', hold: '🧭', w: 108, name: 'Rory', ring: '#94a3b8' },
    gus: { who: 'GUS', skin: '#e8b48a', shirt: '#b45309', pants: '#444', glasses: 1, hair: '#555', hold: '📢', w: 104, name: 'Gus', ring: '#f59e0b' },
    gwen: { who: 'GWEN', skin: '#f1c9a5', shirt: '#be185d', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '📢', w: 90, name: 'Gwen', ring: '#ec4899' },
    sam: { who: 'SAM', skin: '#d9a37a', shirt: '#2563eb', pants: '#222', hair: '#2b2118', hold: '🖥️', w: 108, name: 'Sam', ring: '#3b82f6' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#46589a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 56 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY }, keep));
  bld('bA', 300, '#2a8f86', 'ANA · HOME', '🏠'); bld('bG', 1000, '#a05a12', 'GUS · ISP', '📡'); bld('bW', 1700, '#a01d63', 'GWEN · TRANSIT', '📡'); bld('bS', 2500, '#1d4ed8', 'SAM · SERVER', '🖥️');
  mkChar('ana', CFG.ana, 380, 830, keep); mkChar('gus', CFG.gus, 1020, 830, keep); mkChar('gwen', CFG.gwen, 1720, 830, keep); mkChar('sam', CFG.sam, 2520, 830, keep);
  mkChar('rory', CFG.rory, 1360, 830, keep);
  mkChar('ted', CFG.ted, 560, 830, { o: 0, s: 0.8, keep: 1 }); mkChar('ivy', CFG.ivy, 660, 830, { o: 0, s: 0.8, keep: 1 }); mkChar('eli', CFG.eli, 760, 830, { o: 0, s: 0.8, keep: 1 });
  [['Ana', 380, '#2dd4bf'], ['Gus', 1020, '#fbbf24'], ['Rory', 1360, '#94a3b8'], ['Gwen', 1720, '#f472b6'], ['Sam', 2520, '#60a5fa']].forEach((n) => mk('nm' + n[0], T(n[0], 38, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['ANA', 'TED', 'IVY', 'ELI', 'RORY', 'GUS', 'GWEN', 'SAM'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { wide: { x: 1450, y: 470, s: 0.58 }, ana: { x: 700, y: 520, s: 0.95 }, sam: { x: 2300, y: 520, s: 0.85 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.wide);
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, withDim, fn) => { scene(() => { if (withDim) dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };

  /* ===== S1: no straight road (world) ===== */
  blk('l1', 'l5', false, () => {
    cam(B('l1', 0), 0.01, 'wide');
    wl('q', '❓ no wire runs straight to Sam', '#ffd166', 1400, 300, A('l1', 'wire', 0), 44);
    em('pip', '📦', 70, 430, 760); pop('pip', A('l3', 'pip', -0.2));
    line('circ', 440, 880, 2440, 880, '#ff7b7b', 12); draw('circ', A('l2', 'circuit', 0), 1.6); wl('circL', 'circuit: a reserved wire, idle in every pause', '#ff9f9f', 1450, 930, A('l2', 'idle', -1.2), 36);
    hide('circ', A('l2', 'internet', -0.2), 0.4); hide('circL', A('l2', 'internet', -0.2), 0.4);
    C('mtu', 'packets: ≤ ~1500 bytes each', 1450, 200, '#3ddc84', 'l2', 'small', 520, -0.2);
    fly('pip', A('l3', 'forwards', -0.3), [[430, 760], [1020, 700], [1370, 700], [1720, 700]], 3.0, { arc: 40 });
    wl('bad', '❌ link down', '#ff5d5d', 1550, 620, A('l3', 'dies', 0), 44);
    fly('pip', A('l3', 'another', -0.1), [[1720, 700], [2100, 640], [2500, 760]], 2.2, { arc: 70 });
    chip('cc1', '✗ circuit: wastes capacity in silence', 700, 330, '#ff7b7b', A('l4', 'circuit', 0), { w: 600 }); chip('cc2', '✓ packets: many flows share one link', 1450, 330, '#3ddc84', A('l4', 'packet', 0), { w: 620 });
  });

  /* ===== S2: the words ===== */
  blk('l5', 'l8', true, () => {
    const W8 = [['host', 'any machine on a network', 'l5', 'host', '#7ee0ff'], ['packet', 'a small chunk with an address label', 'l5', 'packet', '#3ddc84'], ['header', 'label bytes stuck on the front', 'l5', 'header', '#ffd166'], ['IP address', 'names a host · 93.184.216.34', 'l6', 'address', '#c084fc'], ['port', 'names a program · 443 = HTTPS', 'l6', 'port', '#ff9f6b'], ['router', 'passes packets toward the destination', 'l6', 'router', '#94a3b8'], ['protocol', 'agreed rules: TCP · UDP · HTTP', 'l6', 'protocol', '#f472b6'], ['ISP', 'connects you to the internet', 'l6', 'i', '#60a5fa']];
    W8.forEach((w, i) => { const col = i < 4 ? 0 : 1, row = i % 4; rowBox('w' + i, w[0], w[1], 160 + col * 880, 170 + row * 170, 840, 140, w[4], A(w[2], w[3], -0.2)); });
    ui('rule', T('IP finds the machine · port finds the program · routers pass packets one hop at a time', 38, '#3ddc84', { w: 1700 }), 960, 940, {}); pop('rule', B('l7', 0.6));
  });

  /* ===== S3: nested envelopes ===== */
  blk('l8', 'l16', true, () => {
    const lay = [['Ethernet · to the next device (MAC)', 1100, 620, 410, '#22c55e', 'l11', 'ethernet'], ['IP · from Ana → to the server', 900, 500, 470, '#6366f1', 'l10', 'address'], ['TCP · port 443 · sequence number', 700, 380, 530, '#f97316', 'l9', 'port']];
    lay.forEach((r, i) => { ui('env' + i, rect(0, 0, r[1], r[2], 'rgba(14,18,30,.5)', { rx: 22, stroke: r[4], sw: 6 }) + T(r[0], 34, r[4], { anchor: 'start', dx: 28, dy: 40 }), 960 - r[1] / 2, 540 - r[2] / 2 - 10, {}); pop('env' + i, A(r[5], r[6], -0.3)); });
    ui('note', T('✉️ GET /', 60, '#fff', { w: 500 }), 960, 570, {}); pop('note', B('l8', 0.8));
    C('et', 'EtherType 0x0800 → IPv4', 300, 880, '#22c55e', 'l12', 'ether', 460, 0); C('pr', 'protocol: 6 TCP · 17 UDP · 1 ICMP', 960, 880, '#6366f1', 'l12', 'protocol', 540, 0); C('en', 'out: add headers · in: strip in reverse', 1560, 880, '#ffd166', 'l12', 'encapsulation', 520, -0.5);
    ['env0'].forEach((i) => tw(i, A('l13', 'open', -0.3), 0.4, { o: 0.25 })); tw('env2', A('l13', 'open', -0.3), 0.4, { o: 0.25 });
    C('ro', 'router opens ONLY the IP envelope', 960, 150, '#94a3b8', 'l13', 'open', 640, -0.2); C('nr', 'never a port · never the URL ✗', 960, 230, '#ff7b7b', 'l13', 'never', 540, -0.2);
    C('sw', 'switch opens only Ethernet', 480, 300, '#22c55e', 'l14', 'switch', 440, 0);
    tw('env0', A('l15', 'thrown', -0.3), 0.3, { o: 1 }); tw('env0', A('l15', 'replaced', -0.1), 0.3, { o: 0.2 }); tw('env0', A('l15', 'replaced', 0.4), 0.3, { o: 1 });
    C('hop', 'Ethernet envelope replaced at every hop · IP survives the whole trip', 960, 960, '#ffd166', 'l15', 'ivy', 900, 0);
  });

  /* ===== S4: hop by hop ===== */
  blk('l16', 'l18', true, () => {
    ui('ft', rect(0, 0, 1200, 330, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#94a3b8', sw: 4 }) + T('Rory\'s forwarding table', 34, '#94a3b8', { dx: 600, dy: 40 }) + T('93.184.216.0/24  →  link 2', 36, '#3ddc84', { anchor: 'start', dx: 60, dy: 120, font: mono }) + T('93.184.0.0/16    →  link 5', 36, '#fff', { anchor: 'start', dx: 60, dy: 190, font: mono }) + T('default          →  link 1', 36, '#fff', { anchor: 'start', dx: 60, dy: 260, font: mono }), 360, 160, {}); pop('ft', A('l16', 'forwarding', -0.2));
    C('lpm', 'longest matching prefix wins', 960, 560, '#ffd166', 'l16', 'longest', 560, -0.1); C('nh', 'no router knows the whole path · only the next hop', 960, 640, '#7ee0ff', 'l16', 'whole', 760, 0);
    ['ft', 'lpm', 'nh'].forEach((i) => hide(i, B('l17', -0.3), 0.4));
    P('o1', 'out of order', 'packets can overtake each other', 160, 220, 800, 130, '#ffb066', 'l17', 'order'); P('o2', 'duplicated', 'the same packet may arrive twice', 1000, 220, 800, 130, '#ffb066', 'l17', 'twice'); P('o3', 'lost', 'some never arrive', 160, 380, 800, 130, '#ff7b7b', 'l17', 'all'); C('tcp', 'TCP (and the app) repair all of this', 960, 640, '#3ddc84', 'l17', 'repair', 680, 0);
  });

  /* ===== S5: seven layers or four ===== */
  blk('l18', 'l21', true, () => {
    const OSI = [['7  Application', '#7ee0ff'], ['6  Presentation', '#7ee0ff'], ['5  Session', '#7ee0ff'], ['4  Transport', '#3ddc84'], ['3  Network', '#ffd166'], ['2  Data Link', '#ff9f6b'], ['1  Physical', '#ff9f6b']];
    OSI.forEach((o, i) => { ui('os' + i, rect(0, 0, 540, 90, 'rgba(14,18,30,.95)', { rx: 12, stroke: o[1], sw: 3 }) + T(o[0], 32, o[1], { dx: 270, dy: 45 }), 200, 150 + i * 100, {}); pop('os' + i, A('l19', ['application', 'presentation', 'session', 'transport', 'network', 'data', 'physical'][i] === 'application' ? 'seven' : ['application', 'presentation', 'session', 'transport', 'network', 'data', 'physical'][i], -0.1)); });
    const TC = [['Application', 150, 290, '#7ee0ff'], ['Transport', 450, 90, '#3ddc84'], ['Internet', 550, 90, '#ffd166'], ['Link', 650, 190, '#ff9f6b']];
    TC.forEach((t, i) => { ui('tc' + i, rect(0, 0, 540, t[2], 'rgba(14,18,30,.95)', { rx: 12, stroke: t[3], sw: 4 }) + T(t[0] + (i === 2 ? ' (IP)' : ''), 34, t[3], { dx: 270, dy: t[2] / 2 }), 1180, t[1], {}); pop('tc' + i, A('l18', ['application', 'transport', 'internet', 'link'][i] === 'application' ? 'four' : ['application', 'transport', 'internet', 'link'][i], 0.4 + 0)); });
    ui('hd7', T('OSI: a 1980s teaching map', 36, '#cdd6e6', { w: 700 }), 470, 100, {}); pop('hd7', B('l18', 0.3)); ui('hd4', T('TCP/IP: what really runs', 36, '#3ddc84', { w: 700 }), 1450, 100, {}); pop('hd4', B('l18', 0.6));
    C('shd', '"L4 balancer" = IP + port · "L7 proxy" = parses HTTP', 960, 900, '#ffd166', 'l20', 'shorthand', 900, 0); C('ns', 'never draw a "session layer protocol" in a real system', 960, 980, '#ff7b7b', 'l20', 'invent', 900, 0);
  });

  /* ===== S6: BGP ===== */
  blk('l21', 'l28', true, () => {
    [['AS 3 · Gus\nserver\'s ISP', 1500, '#f59e0b'], ['AS 2 · Gwen\ntransit', 960, '#ec4899'], ['AS 1 · Ana\'s ISP', 420, '#14b8a6']].forEach((a, i) => { ui('as' + i, rect(-190, -80, 380, 160, 'rgba(14,18,30,.95)', { rx: 18, stroke: a[2], sw: 5 }) + T(a[0].split('\n')[0], 34, a[2], { dy: -18 }) + T(a[0].split('\n')[1] || '', 26, '#cdd6e6', { dy: 28 }), a[1], 300, {}); pop('as' + i, A('l21', ['between', 'between', 'organization'][i], i === 2 ? 0.0 : 0.3 + i * 0.4)); });
    C('ig', 'inside one AS: OSPF / IS-IS', 960, 130, '#7ee0ff', 'l21', 'interior', 520, 0);
    bubble('an1', '93.184.216.0/24 · path [3]', '#f59e0b', 1500, 450); pop('an1', A('l23', 'path', -0.8)); fly('an1', A('l24', 'heard', -1.2), [[1500, 450], [980, 450]], 1.4, {}); 
    bubble('an2', 'reachable via me · path [2, 3]', '#ec4899', 980, 520); pop('an2', A('l24', 'repeat', 0)); fly('an2', A('l24', 'repeat', 0.4), [[980, 520], [440, 520]], 1.4, {});
    C('ins', 'Ana\'s ISP: shortest path + policy → installs the route', 960, 680, '#3ddc84', 'l25', 'picks', 760, 0);
    C('cut', '✂ one cable cut → neighbours switch to the next best route', 960, 760, '#ffd166', 'l26', 'cable', 880, 0);
    ['an1', 'an2', 'ins', 'cut'].forEach((i) => hide(i, B('l27', -0.2), 0.4));
    ui('as9', rect(-190, -80, 380, 160, 'rgba(60,10,10,.95)', { rx: 18, stroke: '#ff5d5d', sw: 5 }) + T('AS 9 · liar', 34, '#ff5d5d', { dy: -18 }) + T('claims the prefix', 26, '#ffb3b3', { dy: 28 }), 960, 560, {}); pop('as9', A('l27', 'falsely', -0.3));
    bubble('an3', '93.184.216.0/24 · mine!', '#ff5d5d', 960, 700); pop('an3', A('l27', 'hijack', 0));
    C('rpki', 'fix: RPKI route-origin validation (a bolt-on)', 960, 820, '#3ddc84', 'l27', 'bolt', 760, 0); C('noc', 'no central authority checks who may announce', 960, 900, '#ffb066', 'l27', 'central', 760, 0);
  });

  /* ===== S7: MTU ===== */
  blk('l28', 'l32', true, () => {
    ui('fr', rect(0, 0, 900, 150, 'rgba(14,18,30,.95)', { rx: 14, stroke: '#3ddc84', sw: 5 }) + T('Ethernet frame · payload ≤ 1500 bytes (MTU)', 34, '#3ddc84', { dx: 450, dy: 75 }), 510, 180, {}); pop('fr', A('l28', 'frames', -0.2));
    ui('big', rect(0, 0, 1200, 110, 'rgba(255,123,123,.2)', { rx: 14, stroke: '#ff7b7b', sw: 4 }) + T('a packet bigger than the MTU → fragment it', 34, '#ff7b7b', { dx: 600, dy: 55 }), 360, 380, {}); pop('big', A('l28', 'bigger', -0.2));
    C('ms', 'TCP: agrees an MSS at setup → fits one frame', 960, 560, '#3ddc84', 'l29', 't c p', 720, -0.2); C('ud', 'UDP / ICMP: may fragment · lose 1 fragment → resend ALL', 960, 640, '#ffb066', 'l29', 'u d p', 860, -0.2);
    C('pm', 'Path MTU discovery: "don\'t fragment" + "too big" replies', 960, 760, '#7ee0ff', 'l30', 'path', 840, 0);
    C('vp', 'VPN / tunnel header → over 1500 → "everything works except big responses"', 960, 880, '#ff7b7b', 'l31', 'tunnel', 1100, -0.3);
  });

  /* ===== S8: ports and the 5-tuple ===== */
  blk('l32', 'l38', true, () => {
    ui('bl', rect(0, 0, 560, 420, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#60a5fa', sw: 5 }) + T('🏢 host = one IP address', 34, '#60a5fa', { dx: 280, dy: 44 }), 100, 140, {}); pop('bl', B('l32', 0.3));
    [['80', 'HTTP'], ['443', 'HTTPS'], ['53', 'DNS']].forEach((p, i) => { ui('pt' + i, rect(0, 0, 440, 80, 'rgba(255,255,255,.08)', { rx: 12, stroke: '#60a5fa', sw: 3 }) + T('port ' + p[0] + ' · ' + p[1], 32, '#fff', { dx: 220, dy: 40 }), 160, 230 + i * 100, {}); pop('pt' + i, A('l32', ['eighty', 'four', 'fifty'][i], 0.1)); });
    C('wk', 'ports below 1024 are well known · root to bind on Linux', 380, 590, '#ffd166', 'l32', 'below', 760, 0);
    C('lis', 'listening port = where NEW connections arrive', 380, 700, '#3ddc84', 'l33', 'arrive', 700, 0);
    ['bl', 'pt0', 'pt1', 'pt2', 'wk', 'lis'].forEach((i) => hide(i, B('l34', -0.3), 0.4));
    ['protocol', 'source IP', 'source port', 'destination IP', 'destination port'].forEach((f, i) => { const hi = i === 2; ui('f' + i, rect(0, 0, 340, 90, 'rgba(14,18,30,.95)', { rx: 12, stroke: hi ? '#ff9f6b' : '#7ee0ff', sw: hi ? 6 : 3 }) + T(f, 28, hi ? '#ff9f6b' : '#7ee0ff', { dx: 170, dy: 45 }), 100 + i * 370, 180, {}); pop('f' + i, A('l34', ['protocol', 'source', 'source', 'destination', 'destination'][i], 0.0 + (i > 1 ? 0.6 : 0) + (i === 2 ? 0.3 : 0))); });
    const T1 = [['TCP', 'TCP'], ['192.168.1.42', '192.168.1.42'], ['51001', '51002'], ['93.184.216.34', '93.184.216.34'], ['443', '443']];
    T1.forEach((v, i) => { const hi = i === 2; [0, 1].forEach((k) => { ui('v' + i + k, T(v[k], 32, hi ? '#ff9f6b' : '#fff', { font: mono }), 270 + i * 370, 330 + k * 90, {}); pop('v' + i + k, A('l35', 'tabs', 0.1) + (k ? 0.5 : 0)); }); });
    ui('tl0', T('tab 1', 30, '#9aa4b6', { anchor: 'start' }), 100, 330, {}); ui('tl1', T('tab 2', 30, '#9aa4b6', { anchor: 'start' }), 100, 420, {}); pop('tl0', A('l35', 'tabs', 0)); pop('tl1', A('l35', 'tabs', 0.6));
    C('only', 'only the source port differs · and that is enough', 960, 600, '#ff9f6b', 'l36', 'only', 780, 0); C('eph', 'ephemeral ports: ~32768–60999 on Linux, picked by the OS', 960, 680, '#7ee0ff', 'l35', 'ephemeral', 900, 0);
    C('key', 'the kernel keys its socket table on the FULL 5-tuple', 960, 780, '#3ddc84', 'l36', 'keys', 840, 0);
    C('mis', 'one port serves thousands of clients, each tuple is unique', 960, 880, '#ffd166', 'l37', 'thousands', 900, 0);
  });

  /* ===== S9: loose ends ===== */
  blk('l38', 'g1', true, () => {
    P('tcpb', 'TCP', 'retransmits · keeps order · handshake + ACK cost\nuse when correctness matters: HTTP, SSH', 160, 150, 800, 160, '#3ddc84', 'l38', 't c p'); P('udpb', 'UDP', 'no guarantees · 8-byte header\nuse when latency matters: DNS, video, QUIC', 1000, 150, 800, 160, '#ffb066', 'l38', 'guarantees', -0.2);
    ['TTL 3', 'TTL 2', 'TTL 1', 'TTL 0 ✗'].forEach((t, i) => { chip('tt' + i, t, 380 + i * 380, 470, i === 3 ? '#ff7b7b' : '#7ee0ff', A('l39', 'router', -0.2) + i * 0.6, { w: 200 }); });
    C('tl', 'TTL = hop counter · stops loops · drop at 0 → ICMP "time exceeded"', 960, 570, '#ffd166', 'l39', 'stops', 1000, 0); C('trc', 'traceroute: TTL 1, 2, 3… → each router reveals itself', 960, 650, '#c084fc', 'l39', 'traceroute', 900, 0);
    C('any', 'anycast = one IP announced from many places via BGP → nearest wins', 960, 800, '#3ddc84', 'l41', 'anycast', 1020, 0); C('any2', 'DNS root servers · CDNs', 960, 880, '#7ee0ff', 'l41', 'd n s', 440, 0);
  });

  /* ===== S10: Go code ===== */
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('l42', -0.3));
    const L1 = ['ln, _ := net.Listen("tcp", "127.0.0.1:0") // OS picks a free port', 'conn, _ := net.Dial("tcp", ln.Addr().String())', 'fmt.Println(conn.LocalAddr(), "->", conn.RemoteAddr())', '', 'func FiveTuple(network string, conn net.Conn) string {', '\treturn fmt.Sprintf("%s %s -> %s", network, conn.LocalAddr(), conn.RemoteAddr())', '}'];
    const c1 = S.codePanel('c1', L1, { x: 180, y: 110, w: 1560, fs: 29, title: 'socket.go', t0: B('g1', 0.5), times: L1.map((x, i) => A('g2', 'listen', 0) + i * 0.4) });
    c1.hl(0, A('g2', 'listen', 0.2)); c1.hl(1, A('g2', 'dial', 0)); c1.hl(4, A('g3', 'five', 0));
    const L2 = ['func EchoServer(ln net.Listener, tuples chan<- string) {', '\tconn, err := ln.Accept()', '\tif err != nil { close(tuples); return }', '\tdefer conn.Close()', '\ttuples <- FiveTuple("tcp", conn) // report what the kernel sees', '\tclose(tuples)', '\tio.Copy(conn, conn) // echo everything back', '}'];
    const c2 = S.codePanel('c2', L2, { x: 180, y: 480, w: 1560, fs: 29, title: 'echo.go', t0: A('g3', 'echo', -0.3), times: L2.map((x, i) => A('g3', 'echo', 0) + i * 0.3) });
    c2.hl(4, A('g3', 'reports', 0)); c2.hl(6, A('g3', 'copies', 0));
    chip('gout1', 'tcp 127.0.0.1:51001 -> 127.0.0.1:43217', 960, 920, '#3ddc84', A('g4', 'two', 0), { w: 820 }); chip('gout2', 'tcp 127.0.0.1:51002 -> 127.0.0.1:43217   (different source port ✓)', 960, 990, '#3ddc84', A('g4', 'differ', 0), { w: 1000 });
    S.scope(null);
  });
  kill(sc, B('l42', -0.3), 0.5);

  /* ===== S11: failures and what to watch ===== */
  blk('l42', 'q0', true, () => {
    P('fa1', 'MTU black hole', 'big packets vanish silently → lower the MTU · clamp MSS', 160, 130, 1600, 120, '#ff7b7b', 'l42', 'black'); P('fa2', 'BGP leak / hijack', 'traffic goes somewhere wrong → RPKI + alerts on path changes', 160, 270, 1600, 120, '#ff9f6b', 'l43', 'leak'); P('fa3', 'port exhaustion', '~28,000 ephemeral ports → pool / reuse connections · widen the range', 160, 410, 1600, 120, '#ffd166', 'l44', 'exhaustion');
    ['interface MTU mismatches (PMTUD failures)', 'BGP session flaps · AS-path changes on your prefixes', 'ephemeral port usage on high-connection hosts'].forEach((t, i) => C('mn' + i, '👁 ' + t, 960, 640 + i * 80, '#3ddc84', 'l45', ['interface', 'session', 'ephemeral'][i], 960, -0.2));
    C('dp1', 'packet switching: something above IP must restore order + reliability', 960, 900, '#7ee0ff', 'l46', 'switching', 1080, 0); C('dp2', 'wrong EtherType / protocol field in raw sockets → silent drop', 960, 970, '#ffb066', 'l46', 'raw', 980, 0);
  });

  /* ===== S12: interview ===== */
  blk('q0', 'l47', true, () => {
    const QA = [['IP address vs port?', 'IP names a host · port (in the TCP/UDP header) names a program · routers use IP only', 'q1', 'one'], ['“Explain OSI as how the internet works”', 'trap: OSI is a teaching map · the internet runs 4-layer TCP/IP · layers 5-7 collapse into application', 'q2', 'two'], ['Two tabs, same site, why no clash?', 'different ephemeral source ports → different 5-tuple · kernel demuxes on the whole tuple', 'q3', 'three'], ['Packet bigger than the MTU?', 'router fragments it (costly) · TCP agrees an MSS at setup to avoid it', 'q4', 'four'], ['Router meets a never-seen packet?', 'forwarding table (IGP + BGP) · longest prefix match · out the matching link', 'q5', 'five'], ['TTL and traceroute?', 'hop counter stops loops · traceroute sends TTL 1, 2, 3… and reads each “time exceeded”', 'q6', 'six']];
    QA.forEach((q, i) => { const y = 100 + i * 150; ui('qa' + i, rect(0, 0, 1640, 134, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 40 }) + T(q[1], 25, '#fff', { anchor: 'start', dx: 26, dy: 94 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });

  /* ===== S13: summary ===== */
  blk('l47', 'rn1', true, () => {
    ui('sh', T('SUMMARY · easy → advanced', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('l47', 0));
    const SUM = [['1', 'Packets, not circuits: routed independently, hop by hop · no router knows the whole path', 'l47a', '#7ee0ff'], ['2', 'IP address → host · port → program · the 5-tuple = a connection\'s true identity', 'l47b', '#3ddc84'], ['3', 'Encapsulation: a header per layer out, stripped in reverse in · routers open only IP', 'l47c', '#ffd166'], ['4', 'OSI is vocabulary · TCP/IP\'s four layers are what runs', 'l47d', '#c084fc'], ['5', 'BGP: word-of-mouth routes · shortest path + policy · nobody checks, unless RPKI does', 'l47e', '#ff9f6b'], ['6', 'MTU ≈ 1500 · TCP agrees an MSS · UDP/ICMP can fragment · TTL stops loops, traceroute uses it', 'l47f', '#ff7b7b'], ['7', 'IP finds the machine · port finds the program · routers pass each packet one hop at a time', 'l47g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1640, 108, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 27, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 140, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'l48', true, () => {
    C('rn1a', '📘 notes: How the Internet Works  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1100, 0);
    C('rn1b', '⬅ before: nothing, this is the start', 960, 410, '#ffd166', 'rn1', 'nothing', 1100, 0);
    C('rn1c', '➡ after: IP Addressing, Subnets, NAT and VPC · TCP · DNS', 960, 490, '#3ddc84', 'rn1', 'after', 1100, 0);
    C('rn1d', '↔ compare: Forward and Reverse Proxies (L4 vs L7) · I/O Models', 960, 570, '#c084fc', 'rn1', 'compare', 1100, 0);
  });
  cam(B('l48', -0.4), 1.4, 'ana');
  tw('ana', B('l48', 0.5), 0.3, { r: -5 }); tw('ana', B('l48', 0.9), 0.3, { r: 5 }); tw('ana', B('l48', 1.3), 0.3, { r: 0 });
  ui('endT', T('How the Internet Works', 120, '#fff', { w: 1300 }), 960, 440, {}); ui('endS', T('IP finds the machine · the port finds the program', 48, '#cdd6e6', { w: 1100 }), 960, 570, {});
  pop('endT', B('l49', 1.2)); pop('endS', B('l49', 1.8));
})();
