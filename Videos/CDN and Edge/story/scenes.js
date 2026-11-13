/* CDN and Edge: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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

  // ---------- cast ----------
  const CFG = {
    maya: { who: 'MAYA', skin: '#c98d5b', shirt: '#ff8a3d', pants: '#3a3f5c', hair: '#1a1210', hair2: 'long', blush: 1, hold: '📱', w: 92, name: 'Maya', ring: '#ff8a3d' },
    oscar: { who: 'OSCAR', skin: '#e8b48a', shirt: '#b8c2d6', pants: '#4a4f5c', hat: 'chef', apron: '#f4f4f4', w: 150, name: 'Oscar', ring: '#e0a96d' },
    pia: { who: 'PIA', skin: '#d99b6c', shirt: '#2f9e5a', apron: '#e8f7ee', hat: 'cap', hatColor: '#2f9e5a', pants: '#2d3a4f', w: 94, blush: 1, name: 'Pia', ring: '#3ddc84' },
    sam: { who: 'SAM', skin: '#b07a52', shirt: '#6b7280', tie: '#d33a3a', glasses: 1, hair: '#444', pants: '#2a2f3a', w: 112, hold: '📋', name: 'Sam', ring: '#7aa7ff' },
    c1: { who: 'C1', skin: '#e0ac82', shirt: '#4c8bf5', pants: '#333', hair: '#3a2a1a', w: 100 },
    c2: { who: 'C2', skin: '#8d5a3b', shirt: '#b05cc7', pants: '#333', hair: '#111', w: 100 },
    c3: { who: 'C3', skin: '#f1c9a5', shirt: '#e5c140', pants: '#333', hair: '#5a3b1e', hair2: 'long', w: 96 },
    prank: { who: 'PRANK', skin: '#e0ac82', shirt: '#1c1c22', pants: '#1c1c22', mask: 1, hair: '#111', w: 104 },
  };

  // ---------- background (always there) ----------
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#4a5a9a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 7600, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 60 }, (_, i) => circ((i * 197) % 5200 - 800, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('hillsV', '<ellipse cx="3150" cy="860" rx="1100" ry="260" fill="#2c5a3a"/><ellipse cx="2300" cy="880" rx="700" ry="200" fill="#336a42"/><ellipse cx="3900" cy="880" rx="700" ry="200" fill="#336a42"/>', keep);
  mk('skyline', Array.from({ length: 22 }, (_, i) => { const h = 150 + ((i * 73) % 260); return rect(-300 + i * 78, 810 - h, 70, h, i % 2 ? '#1f2d57' : '#26356a'); }).join('') + rect(560, 520, 36, 290, '#2c3d78') + rect(900, 560, 36, 250, '#2c3d78') + '<path d="M-40 810 V620 Q20 520 80 620 V810Z" fill="#33467f"/>', keep);
  mk('ground', rect(-1600, 790, 7600, 2000, '#2b3a2e') + rect(-1600, 830, 7600, 70, '#3a3d4a') + Array.from({ length: 70 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  mk('trees', [2300, 2420, 3700, 3800, 3900, 1500, 2150, 2550].map((x, i) => '<g transform="translate(' + x + ' 790)">' + Em('🌳', 120 + (i % 3) * 20, { dy: -70 }) + '</g>').join(''), keep);
  mk('tMumbai', T('MUMBAI', 120, 'rgba(255,255,255,.14)', { w: 900 }), Object.assign({ x: 560, y: 330 }, keep));
  mk('tSam', T('REGIONAL HUB', 90, 'rgba(255,255,255,.14)', { w: 900 }), Object.assign({ x: 1850, y: 330 }, keep));
  mk('tVA', T('VIRGINIA', 120, 'rgba(255,255,255,.14)', { w: 900 }), Object.assign({ x: 3150, y: 250 }, keep));

  // Oscar's bakery
  mk('bakery', rect(-290, -430, 580, 430, '#c27a4c', { rx: 14 }) + '<polygon points="-310,-430 0,-560 310,-430" fill="#7a3f2a"/>' + rect(120, -620, 60, 140, '#7a3f2a') +
    rect(-230, -330, 170, 160, '#2a1a12', { rx: 12 }) + circ(-145, -250, 56, '#ff8f2d') + circ(-145, -250, 32, '#ffd27a') +
    rect(20, -300, 200, 300, '#6b3a22', { rx: 12 }) + circ(190, -140, 8, '#ffd27a') + T("OSCAR'S BAKERY", 40, '#fff4d6', { dy: -395 }) + '<g transform="translate(-220 -470)">' + Em('🇺🇸', 60) + '</g>', Object.assign({ x: 2950, y: GY }, keep));
  for (let i = 0; i < 3; i++) mk('smoke' + i, circ(0, 0, 26 + i * 8, 'rgba(230,230,240,.7)'), Object.assign({ x: 3130, y: GY - 640, loop: { dy: 170, period: 3.2, delay: i * 1.05 } }, keep));

  // Mumbai shop (hidden until scene 2), then Pia, then the counter in front of her
  const SHX = 700;
  mk('shopBack', rect(-290, -430, 580, 430, '#f2d9ae', { rx: 10 }) + rect(-290, -430, 580, 38, '#bd3b3b') + rect(-250, -258, 330, 14, '#8a5a34') + rect(-250, -148, 330, 14, '#8a5a34'), { x: SHX, y: GY, o: 0, keep: 1 });
  mkChar('pia', CFG.pia, 830, GY, { s: 0.92, o: 0, keep: 1 });
  mk('shopFront', rect(-300, -462, 600, 70, '#bd3b3b', { rx: 8 }) + Array.from({ length: 10 }, (_, i) => rect(-300 + i * 60, -462, 30, 70, '#fff')).join('') +
    T("PIA'S BRANCH · MUMBAI", 34, '#fff', { dy: -500 }) + rect(-290, -88, 580, 88, '#8a5a34', { rx: 6 }) + rect(-290, -96, 580, 14, '#b57d4a'), { x: SHX, y: GY, o: 0, keep: 1 });
  mkChar('oscar', CFG.oscar, 3010, GY, { s: 1.0, keep: 1, noBubble: false });
  mk('desk', rect(-120, -110, 240, 110, '#7a5a3a', { rx: 8 }) + rect(-130, -122, 260, 16, '#a97f4e', { rx: 6 }) + '<g transform="translate(-60 -160)">' + Em('☎️', 60) + '</g>' + T('SAM · SHIELD', 24, '#fff', { dy: -60 }), { x: 1850, y: GY + 10, o: 0, keep: 1 });
  mkChar('sam', CFG.sam, 1850, GY - 6, { s: 0.95, o: 0, keep: 1 });
  mkChar('maya', CFG.maya, -260, 830, { keep: 1 });
  mkChar('c1', CFG.c1, 1900, 830, { o: 0, keep: 1 });
  mkChar('c2', CFG.c2, 1900, 830, { o: 0, keep: 1 });
  mkChar('c3', CFG.c3, 1900, 830, { o: 0, keep: 1 });
  mkChar('prank', CFG.prank, 1900, 830, { o: 0, keep: 1 });
  portrait('pOscar', Object.assign({}, CFG.oscar), 40, 760);
  portrait('pSam', Object.assign({}, CFG.sam), 320, 760);
  const portraitOn = (id, t0, t1) => { tw(id, t0, 0.3, { o: 1 }); tw(id, t1, 0.3, { o: 0 }); };

  // shelf slots in Mumbai (world coords)
  const SL = [[510, 520], [585, 520], [660, 520], [735, 520], [510, 630], [585, 630], [660, 630], [735, 630]];
  const SLOAF = ['🍞', '🥖', '🥐', '🥨', '🥯', '🍞', '🥖', '🥐'];

  const views = { wide: { x: 1650, y: 470, s: 0.5 }, mumbai: { x: 780, y: 520, s: 1 }, tight: { x: 800, y: 540, s: 1.2 }, mid: { x: 1350, y: 520, s: 0.72 }, oscar: { x: 3000, y: 580, s: 1.05 } };
  const cam = (t, d, v) => camTw(t, d, views[v]);
  S.ents; // eslint-disable-line
  // camera start: close on Oscar
  camTw(0, 0.001, views.oscar);

  /* ================= S1: one kitchen, one planet ================= */
  scene(() => {
    em('f1', '🖼️', 80, 3010, 470); em('f2', '📄', 80, 3150, 440); em('f3', '🎬', 80, 3290, 470);
    pop('f1', A('l1', 'photo', -0.3)); pop('f2', A('l1', 'page', -0.3)); pop('f3', A('l1', 'video', -0.3));
    ['f1', 'f2', 'f3'].forEach((f, i) => tw(f, B('l2'), 0.6, { y: S.ents[f].cur.y - 30, o: 0 }));
    cam(B('l2', -0.2), 2.8, 'wide');
    go('maya', B('l2', 0.3), 3.5, 250);
    // request travels to Oscar, loaf returns: it is slow
    line('route', 250, 880, 3050, 880, '#ff5d5d', 10, { dash: '0.02 0.01' });
    draw('route', A('l4', 'cross', 0), 4.5);
    em('req', '🍞', 70, 250, 760); pop('req', B('l3', 0.3));
    fly('req', A('l4', 'cross'), [[250, 760], [1650, 640], [3040, 760]], 4.5, { ease: 'lin' });
    em('clock', '⏱️', 130, 1650, 520); pop('clock', A('l4', 'cross', 0.6));
    wd('latW', T('180–250 ms each way', 64, '#ffb3b3', { w: 800 }), 1650, 1010);
    pop('latW', A('l4', 'typically', 0.1)); tw('latW', A('l4', 'add', -0.2), 0.4, { o: 0 });
    wd('coldW', T('cold first byte: 400–600 ms', 64, '#ffd9a0', { w: 800 }), 1650, 1010);
    pop('coldW', A('l4', 'four', -0.4));
    fly('req', A('l4', 'add'), [[3040, 760], [1650, 700], [260, 760]], 4.0, { ease: 'lin' });
    // the crowd
    const crowd = [];
    for (let i = 0; i < 26; i++) { const id = 'cr' + i; em(id, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 90, 330 + i * 52, 780); pop(id, A('l5', 'fifty') + i * 0.11); crowd.push(id); }
    wd('c50k', T('50,000 per day', 130, '#fff', { w: 800 }), 1650, 1130); pop('c50k', A('l5', 'fifty', 0));
    for (let i = 0; i < 8; i++) { const id = 'lf' + i; em(id, '🍞', 60, 0, 0); fly(id, A('l5', 'baked', i * 0.55 - 0.2), [[3040, 730], [1650, 690], [330 + i * 80, 770]], 3.4, { ease: 'lin' }); hide(id, A('l5', 'baked', i * 0.55 + 3.3), 0.3); }
    em('sweat', '💦', 80, 3060, 540, { loop: { dy: 40, period: 1.1 } });
    tw('sweat', A('l6', 'i', -2), 0.3, { o: 1 });
    cam(A('l6', 'i', -2.5), 1.8, 'oscar');
    S.ents.oscar; tw('oscar', B('l6'), 0.4, { r: -3 }); tw('oscar', B('l6', 1), 0.4, { r: 3 }); tw('oscar', B('l6', 1.6), 0.4, { r: 0 });
    sc.push(...crowd);
  });
  kill(sc, B('l7', -0.4), 0.8);

  /* ================= S2: Pia opens a branch ================= */
  scene(() => {
    cam(B('l7', -0.3), 2.6, 'mumbai');
    tw('sweat', B('l7'), 0.3, { o: 0 });
    ['shopBack', 'shopFront'].forEach((id) => tw(id, B('l7', 1.6), 0.9, { o: [0, 1], s: [0.2, 1] }, { ease: 'back' }));
    tw('pia', B('l7', 3.0), 0.4, { o: 1 }); go('pia', B('l7', 3.0), 0.5, 830);
    card(A('l8', 'content', -0.3), 'CDN', 'Content Delivery Network', { color: '#7ee0ff' });
    card(A('l8', 'pop', -0.2), 'PoP', 'Point of Presence = one branch', { color: '#3ddc84', slot: 1 });
    go('maya', B('l9', -0.5), 6.5, 1090);
    for (let i = 0; i < 3; i++) { em('sl' + i, SLOAF[i], 62, SL[i][0], SL[i][1]); pop('sl' + i, B('l9', 1.0 + i * 0.5)); S.ents['sl' + i].keepAlways = 1; }
    ['sl0', 'sl1', 'sl2'].forEach((i) => sc.splice(sc.indexOf(i), 1));
    em('hit', '🍞', 70, 510, 520);
    fly('hit', B('l11', 0.4), [[510, 520], [800, 450], [1050, 560]], 1.0, { arc: 80 });
    hide('hit', B('l11', 1.6), 0.4);
    wd('fast', T('⚡ milliseconds', 60, '#7dffb0', { w: 800 }), 1290, 330); pop('fast', B('l11', 1.0));
    ui('oPip', rect(0, 0, 250, 150, 'rgba(14,18,30,.9)', { rx: 18, stroke: '#9aa4b6', sw: 3 }) + Em('😴', 70, { dx: 125, dy: 62 }) + T('Oscar: not asked', 24, '#cdd6e6', { dx: 125, dy: 122 }), 40, 880);
    pop('oPip', A('l12', 'never', -0.4));
    card(A('l12', 'cache', -0.2), 'Cache hit', 'served from the shelf', { color: '#3ddc84' });
    tw('maya', B('l12', 2.2), 0.6, { f: -1 });
  });
  kill(sc, B('l13', -0.4), 0.6); kill(['fast', 'oPip'], B('l13', -0.5), 0.5);

  /* ================= S3: a loaf Pia does not have ================= */
  scene(() => {
    cam(B('l13', -0.2), 2.2, 'mid');
    tw('desk', B('l13', 1.2), 0.5, { o: [0, 1], s: [0.3, 1] }, { ease: 'back' }); tw('sam', B('l13', 1.3), 0.4, { o: 1 });
    tw('c1', B('l13', 0.2), 0.001, { o: 1, x: 1500 }); go('c1', B('l13', 0.3), 3.0, 1250);
    em('rq', '🥖', 70, 1250, 600); wd('rqL', T('rye?', 44, '#fff'), 1250, 530); pop('rq', A('l13', 'asks', 0.4)); pop('rqL', A('l13', 'asks', 0.4));
    wd('empty', rect(-34, -34, 68, 68, 'rgba(255,255,255,.08)', { rx: 10, stroke: '#ffd166', sw: 4, dash: '10 8' }), SL[3][0], SL[3][1]); pop('empty', A('l13', 'never', -0.2));
    card(A('l13', 'cache miss', -0.1), 'Cache miss', 'branch has no copy', { color: '#ff7b7b' });
    line('ln1', 830, 600, 1850, 650, '#ffd166', 9); draw('ln1', A('l13', 'phones', -0.1), 1.2);
    em('ph1', '📞', 60, 0, 0); fly('ph1', A('l13', 'phones'), [[830, 600], [1850, 650]], 1.1, { ease: 'lin' }); hide('ph1', A('l13', 'phones', 1.1), 0.2);
    tw('sam', B('l15', 0.2), 0.3, { r: 4 }); tw('sam', B('l15', 0.6), 0.3, { r: -4 }); tw('sam', B('l15', 1.0), 0.3, { r: 0 });
    line('ln2', 1850, 650, 3040, 700, '#ffd166', 9); draw('ln2', A('l15', 'ask', -0.1), 1.4);
    em('ph2', '📞', 60, 0, 0); fly('ph2', A('l15', 'ask'), [[1850, 650], [3040, 700]], 1.3, { ease: 'lin' }); hide('ph2', A('l15', 'ask', 1.3), 0.2);
    cam(B('l16', -0.5), 1.8, 'wide');
    em('fire', '🔥', 90, 3005, 600); pop('fire', A('l16', 'bakes', -0.2));
    em('rye', '🥖', 70, 3040, 700); pop('rye', A('l16', 'bakes', 0));
    fly('rye', A('l16', 'travels', -0.3), [[3040, 700], [1850, 700], [1100, 600]], 4.2, { arc: 90 });
    cam(A('l16', 'travels', 1.4), 2.4, 'mumbai');
    fly('rye', A('l16', 'travels', 4.0), [[1100, 600], [SL[3][0], SL[3][1]]], 1.2, { arc: 60 });
    tw('ln1', A('l16', 'keeps', 0), 0.5, { o: 0 }); tw('ln2', A('l16', 'keeps', 0), 0.5, { o: 0 });
    card(A('l16', 'origin', -0.1), 'Origin shield', 'one tier between branches and origin', { color: '#7aa7ff' });
    hide('empty', A('l16', 'keeps', 0), 0.3); hide('fire', A('l16', 'keeps', -1), 0.3);
    tw('c1', A('l16', 'keeps', 1.5), 0.4, { o: 0 }); hide('rq', B('l17'), 0.3); hide('rqL', B('l17'), 0.3);
    // permanent slot loaf for the rye
    em('sl3', '🥖', 62, SL[3][0], SL[3][1]); sc.splice(sc.indexOf('sl3'), 1); tw('sl3', A('l16', 'keeps', 1.0), 0.01, { o: 1 }); tw('rye', A('l16', 'keeps', 1.0), 0.01, { o: 0 });
    // push vs pull
    cam(B('l18', -0.2), 2.0, 'wide');
    wd('van', Em('🚚', 140), 3050, 770); pop('van', A('l18', 'push', -0.8));
    fly('van', A('l18', 'delivers', -0.2), [[3050, 770], [1850, 770], [1020, 770]], 4.8, { ease: 'inOut' });
    for (let i = 4; i < 8; i++) { em('sl' + i, SLOAF[i], 62, SL[i][0], SL[i][1]); pop('sl' + i, A('l18', 'delivers', 4.6 + (i - 4) * 0.3)); sc.splice(sc.indexOf('sl' + i), 1); }
    hide('van', A('l18', 'delivers', 6.8), 0.4);
    card(A('l18', 'pull', -0.1), 'Pull CDN', 'fetch on the first miss (default)', { color: '#7ee0ff' });
    card(A('l18', 'push', -0.2), 'Push CDN', 'upload to every branch ahead of time', { color: '#c084fc', slot: 1 });
    cam(A('l18', 'delivers', 3.5), 2.2, 'mumbai');
  });
  kill(sc, B('l19', -0.4), 0.6);

  /* ================= S4: how Maya finds Pia (map screen) ================= */
  scene(() => {
    ui('mapBg', rect(0, 0, 1920, 1080, 'rgba(8,12,24,.93)'), 0, 0);
    tw('mapBg', B('l19', -0.3), 0.6, { o: 1 });
    const pins = [['Mumbai', 520, 560], ['Singapore', 820, 720], ['London', 1130, 360], ['Virginia', 1480, 560], ['Tokyo', 960, 880]];
    pins.forEach((p, i) => { uem('pin' + i, '📍', 80, p[1], p[2]); pop('pin' + i, B('l19', 0.2 + i * 0.15)); label('pinL' + i, p[0], 28, '#cdd6e6', p[1], p[2] + 64, B('l19', 0.3 + i * 0.15)); });
    uem('mapMaya', '📱', 90, 280, 720); pop('mapMaya', B('l19', 0.2));
    label('mapQ', 'Which branch?', 44, '#ffd166', 700, 200, B('l19', 0.5));
    tw('mapQ', A('l20', 'two'), 0.3, { o: 0 });
    // anycast: one number, rings spread, nearest answers
    label('anyT', 'ANYCAST: one number', 54, '#7ee0ff', 960, 150, A('l20', 'anycast', -0.2));
    for (let i = 0; i < 3; i++) { ui('rg' + i, '<circle r="60" fill="none" stroke="#7ee0ff" stroke-width="6"/>', 280, 720); tw('rg' + i, A('l20', 'rings', 0) + 0, 0.001, { o: 0 }); tw('rg' + i, A('l20', 'phone', -0.2 + i * 0.5), 1.8, { o: [0.9, 0], s: [0.3, 9] }, { ease: 'out' }); }
    ui('anyLine', '<path data-p pathLength="1" d="M280 720 L520 560" stroke="#3ddc84" stroke-width="10" stroke-linecap="round"/>', 0, 0, { p: 0 }); tw('anyLine', A('l20', 'nearest', -0.2), 0.001, { o: 1 }); tw('anyLine', A('l20', 'nearest', -0.2), 0.8, { p: [0, 1] });
    tw('pin0', A('l20', 'nearest', 0.4), 0.5, { s: 1.5 }, { ease: 'back' });
    chip('chCf', 'Cloudflare', 640, 960, '#7ee0ff', A('l20', 'cloudflare', -0.1)); chip('chFa', 'Fastly', 960, 960, '#7ee0ff', A('l20', 'fastly', -0.1));
    card(A('l20', 'anycast', 0.1), 'Anycast', 'one number, nearest branch answers', { color: '#7ee0ff' });
    // geo dns: directory
    ['anyLine', 'chCf', 'chFa'].forEach((i) => tw(i, A('l21', 'with', -0.3), 0.3, { o: 0 }));
    ['rg0', 'rg1', 'rg2'].forEach((i) => hide(i, A('l21', 'with', -0.4), 0.2));
    tw('anyT', A('l21', 'with', -0.3), 0.3, { o: 0 });
    label('geoT', 'GEO DNS: a number per region', 54, '#ffd166', 960, 150, A('l21', 'geo', -0.2));
    uem('book', '📖', 130, 1540, 760); pop('book', A('l21', 'directory', -0.1));
    const rows = [['Asia', 'Mumbai'], ['Europe', 'London'], ['Americas', 'Virginia']];
    rows.forEach((r, i) => chip('row' + i, r[0] + ' → ' + r[1], 1540, 860 + i * 66, i === 0 ? '#3ddc84' : '#9aa4b6', A('l21', 'different', 0.2 + i * 0.35), { w: 330 }));
    card(A('l21', 'geo', 0), 'GeoDNS', 'a directory answers per region', { color: '#ffd166' });
    chip('chCl', 'CloudFront: GeoDNS', 1160, 960, '#ffd166', A('l21', 'cloud', -0.1), { w: 340 }); chip('chAk', 'Akamai: mixes both', 1160, 1030, '#ffd166', A('l21', 'akamai', -0.1), { w: 340 });
    tw('mapBg', B('l22', -0.3), 0.6, { o: 0 });
  });
  kill(sc, B('l22', -0.1), 0.6);

  /* ================= S5: labels and freshness ================= */
  scene(() => {
    cam(B('l22', -0.3), 1.5, 'mumbai');
    portraitOn('pOscar', B('l22', -0.2), End('l23', 0.6));
    ui('tagBig', rect(0, 0, 520, 170, '#f3e3b2', { rx: 18, stroke: '#a98a45', sw: 5 }) + circ(34, 85, 16, '#0b1020') + T('Cache-Control', 30, '#6b5420', { anchor: 'start', dx: 78, dy: 52 }) + T('max-age=3600', 52, '#1b1b1b', { anchor: 'start', dx: 78, dy: 112 }), 1370, 760);
    pop('tagBig', B('l22', 0.8));
    // timer ring (fresh time draining)
    ui('ring', '<g transform="rotate(-90)"><circle r="95" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="22"/><circle data-p pathLength="1" r="95" fill="none" stroke="#3ddc84" stroke-width="22" stroke-linecap="round"/></g>' + T('fresh', 34, '#fff', { dy: 0 }), 1650, 360, { p: 1 });
    pop('ring', A('l24', 'max', -0.4));
    tw('ring', A('l24', 'max', 0.3), 5.5, { p: 0 }, { ease: 'lin' });
    card(A('l24', 'max', -0.1), 'max-age / TTL', 'how long a copy counts as fresh', { color: '#3ddc84' });
    chip('chS', 's-maxage: branches only', 1660, 520, '#7aa7ff', A('l24', 's max', -0.1), { w: 420 });
    chip('chNC', 'no-cache: check first', 1660, 590, '#ffd166', A('l24', 'no cache', -0.1), { w: 420 });
    chip('chNS', 'no-store: never shelve', 1660, 660, '#ff7b7b', A('l24', 'no store', -0.1), { w: 420 });
    tw('tagBig', A('l24', 'a', 20), 0.01, { o: 1 });
    ['chS', 'chNC', 'chNS'].forEach((c) => hide(c, A('l25', 'so', -0.2), 0.4)); hide('tagBig', A('l25', 'so', -0.2), 0.4);
    // expiry: loaf goes stale, Pia phones, 'still same?' goes out, 'yes' comes back
    em('stale', '⏰', 90, 640, 440); pop('stale', A('l25', 'hour', -0.2));
    em('q', '❓', 80, 830, 450); pop('q', A('l26', 'phone', -0.1));
    fly('q', A('l26', 'phone', 0.1), [[830, 450], [1500, 330]], 1.6, { arc: 60 }); hide('q', A('l26', 'phone', 1.7), 0.3);
    portraitOn('pOscar', B('l27', -0.2), End('l27', 0.5));
    em('yes', '✅', 80, 1500, 330); fly('yes', B('l27', 0.9), [[1500, 330], [830, 450]], 1.4, { arc: 60 }); hide('yes', B('l27', 2.4), 0.3);
    tw('ring', A('l28', 'three', 0.4), 1.3, { p: 1 }, { ease: 'out' });
    card(A('l28', 'three', -0.2), '304 Not Modified', 'cheap yes, no loaf resent', { color: '#3ddc84' });
    hide('stale', A('l28', 'copy', 0), 0.3); hide('ring', B('l29', -0.2), 0.4);
    // stale-while-revalidate
    em('old', '🍞', 70, 510, 520); fly('old', A('l29', 'instantly', -0.2), [[510, 520], [800, 440], [1060, 560]], 1.2, { arc: 80 }); hide('old', A('l29', 'instantly', 1.4), 0.3);
    em('bg', '☎️', 60, 830, 560); fly('bg', A('l29', 'background', -0.5), [[830, 560], [1500, 380]], 2.2, { arc: 40 }); hide('bg', A('l29', 'background', 1.8), 0.3);
    card(A('l29', 'stale', -0.1), 'stale-while-revalidate', 'serve old now, refresh in background', { color: '#c084fc' });
    sc.push('stale');
  });
  kill(sc, B('l30', -0.4), 0.6);

  /* ================= S6: which loaf is which ================= */
  scene(() => {
    cam(B('l30', -0.3), 1.2, 'mumbai');
    const plate = (id, a, b, y, col) => ui(id, rect(0, 0, 520, 100, 'rgba(14,18,30,.93)', { rx: 18, stroke: col, sw: 4 }) + Em(a, 56, { dx: 56, dy: 52 }) + T('sourdough', 30, '#fff', { anchor: 'start', dx: 110, dy: 34 }) + T(b, 34, col, { anchor: 'start', dx: 110, dy: 72 }), 1350, y);
    plate('pl1', '🍞', 'sliced', 320, '#7ee0ff'); plate('pl2', '🥖', 'whole', 450, '#c084fc');
    pop('pl1', A('l30', 'sliced', -0.6)); pop('pl2', A('l30', 'whole', -0.5));
    card(A('l30', 'cache', -0.1), 'Cache key', 'what decides: same loaf or not', { color: '#ffd166' });
    em('rib', '🎀', 70, 1090, 560); pop('rib', B('l31', 0.1));
    fly('rib', A('l31', 'ribbon', 0.3), [[1090, 560], [1400, 380]], 1.0, { arc: 90 });
    chip('rbChip', '+ ribbon=blue', 1860, 385, '#4c8bf5', A('l31', 'ribbon', 1.2), { w: 260 });
    tw('rbChip', A('l32', 'same', -0.2), 0.001, { o: 0 }); hide('rib', A('l32', 'ribbon', 0.4), 0.3);
    label('same1', 'same slot ✓', 40, '#3ddc84', 1610, 395, A('l32', 'same', 0));
    chip('utm1', 'utm_source=…', 1600, 600, '#9aa4b6', A('l33', 'tracking', -0.1), { w: 300 });
    chip('utm2', 'utm_campaign=…', 1600, 670, '#9aa4b6', A('l33', 'tracking', 0.4), { w: 330 });
    ui('xx', T('✕ ignored', 44, '#ff7b7b'), 1830, 640, {}); pop('xx', A('l33', 'ignores', -0.1));
    ['utm1', 'utm2', 'xx', 'same1', 'rbChip', 'pl1', 'pl2'].forEach((i) => hide(i, A('l33', 'but', -0.3), 0.4));
    // bad: a key per customer
    const faces = ['😀', '😎', '🤓', '😊', '🧐', '😄', '🙂', '😇', '🤠', '😺', '👩', '👨'];
    faces.forEach((f, i) => { const x = 1180 + (i % 6) * 120, y = 330 + Math.floor(i / 6) * 150; ui('fk' + i, rect(-48, -52, 96, 112, 'rgba(14,18,30,.93)', { rx: 14, stroke: '#ff7b7b', sw: 3 }) + Em(f, 40, { dy: -20 }) + Em('🍞', 40, { dy: 30 }), x, y); pop('fk' + i, A('l33', 'cookie', 0.1 + i * 0.12)); });
    label('noShare', 'no sharing, shelf useless', 46, '#ff7b7b', 1500, 650, A('l33', 'useless', -0.3));
    card(A('l33', 'vary', -0.2), 'Vary: Cookie', 'key per customer = nothing shared', { color: '#ff7b7b' });
  });
  kill(sc, B('l34', -0.4), 0.6);

  /* ================= S7: Friday rush ================= */
  scene(() => {
    cam(B('l34', -0.3), 2.0, 'mid');
    ['c1', 'c2', 'c3', 'prank'].forEach((c) => tw(c, 0, 0.001, { o: 0 }));
    em('clk', '⏰', 120, 1500, 380); pop('clk', B('l34', 0.2));
    wd('clkT', T('9:00', 64, '#fff'), 1500, 480); pop('clkT', B('l34', 0.3));
    em('sh2', '🏠', 150, 1250, 760); em('sh3', '🏠', 150, 1560, 760); pop('sh2', B('l34', 0.8)); pop('sh3', B('l34', 1.0));
    const crowd = [];
    for (let i = 0; i < 40; i++) { const gx = [1090, 1250, 1560][i % 3]; const id = 'rc' + i; em(id, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 56, gx + ((i * 37) % 200) - 80, 800 + ((i * 53) % 70)); pop(id, A('l34', 'hundred', 0.1) + (i % 8) * 0.04); crowd.push(id); }
    // everybody phones Oscar
    const phones = [];
    for (let i = 0; i < 40; i++) { const id = 'rp' + i; em(id, '📞', 44, 0, 0); const sx = S.ents['rc' + i].init.x; fly(id, A('l35', 'phoned', -0.2) + (i % 10) * 0.12, [[sx, 780], [1900, 640 + (i % 5) * 20], [3030, 700 + (i % 4) * 15]], 3.2, { ease: 'lin', arc: 50 + (i % 5) * 20 }); hide(id, A('l35', 'phoned', 3.4 + (i % 10) * 0.12), 0.2); phones.push(id); }
    wd('pile', Em('📞📞📞📞', 90), 3010, 460, { loop: { dy: 30, period: 0.8, delay: 0 } });
    tw('pile', A('l35', 'phoned', 2.8), 0.3, { o: 1 }); hide('pile', A('l35', 'stampede', 1.5), 0.4);
    ui('stamp', T('STAMPEDE', 150, '#ff5d5d', { w: 900 }), 960, 300, { r: -8 }); pop('stamp', A('l35', 'stampede', -0.2)); tw('stamp', A('l36', 'everyone', 0.5), 0.4, { o: 0 });
    // collapse
    ['c2'].forEach(() => 0);
    crowd.forEach((c) => tw(c, A('l36', 'everyone', 0), 0.4, { o: 0.45 }));
    em('one', '📞', 110, 830, 520);
    fly('one', A('l36', 'phone', 0.1), [[830, 520], [1850, 640]], 2.6, { ease: 'inOut', arc: 70 });
    fly('one', B('l38', 0.3), [[1850, 640], [3030, 700]], 2.6, { ease: 'inOut', arc: 70 });
    hide('one', B('l38', 3.0), 0.3);
    card(A('l37', 'request', -0.1), 'Request collapsing', 'many asks, one fetch', { color: '#3ddc84' });
    tw('desk', A('l38', 'one', -0.3), 0.001, { s: 1 }); tw('desk', A('l38', 'one', -0.2), 0.3, { s: 1.12 }, { ease: 'back' }); tw('desk', A('l38', 'one', 0.5), 0.3, { s: 1 });
    ui('cnt', T('100  →  1', 190, '#3ddc84', { w: 900 }), 960, 300, {}); pop('cnt', A('l39', 'exactly', -0.9));
    tw('cnt', End('l39', 1.4), 0.5, { o: 0 });
    sc.push(...crowd);
  });
  kill(sc, B('l40', -0.4), 0.6);

  /* ================= S8: what must never be shelved ================= */
  scene(() => {
    cam(B('l40', -0.3), 2.2, 'mumbai');
    ['c1', 'c2', 'c3'].forEach((c) => tw(c, 0, 0.001, { o: 0 }));
    tw('maya', 0, 0.001, { x: 1090 });
    wd('cake', Em('🎂', 100) + T('MAYA', 30, '#fff', { dy: 66 }), 830, 560); pop('cake', B('l40', 1.4));
    ui('priv', rect(-170, -60, 340, 120, 'rgba(255,60,60,.12)', { rx: 14, stroke: '#ff5d5d', sw: 8 }) + T('🔒 PRIVATE', 60, '#ff5d5d', { w: 800 }), 960, 300, { r: -6 });
    pop('priv', A('l41', 'private', -0.1)); hide('priv', B('l42', -0.2), 0.4);
    fly('cake', A('l41', 'never', 0), [[830, 560], [1000, 520], [1070, 590]], 1.4, { arc: 70 });
    wd('noSlot', rect(-34, -34, 68, 68, 'rgba(255,90,90,.12)', { rx: 10, stroke: '#ff5d5d', sw: 4, dash: '10 8' }) + Em('🚫', 40), 1160, 740); pop('noSlot', A('l41', 'shared', 0));
    card(A('l42', 'private', -0.1), 'private / no-store', 'one person\'s data never shared', { color: '#ff7b7b' });
    chip('setc', 'Set-Cookie → never shared', 1400, 780, '#ffd166', A('l42', 'set', -0.1), { w: 440 });
    // replay: cake on the shelf, stranger takes it
    wd('cake2', Em('🎂', 90) + T('MAYA', 28, '#fff', { dy: 60 }), 830, 560);
    fly('cake2', A('l42', 'shelved', -0.6), [[830, 560], [900, 430], [735, 630]], 1.4, { arc: 60 });
    tw('c2', A('l42', 'stranger', -0.8), 0.001, { o: 1, x: 1500 }); go('c2', A('l42', 'stranger', -0.8), 2.2, 1000);
    fly('cake2', A('l42', 'home', -0.7), [[735, 630], [950, 500], [1000, 480]], 1.2, { arc: 60 });
    go('c2', A('l42', 'home', 0.4), 2.5, 1700);
    fly('cake2', A('l42', 'home', 0.5), [[1000, 480], [1700, 500]], 2.4, { ease: 'inOut' });
    wd('wrong', T('✗ wrong person', 64, '#ff5d5d', { w: 900 }), 1200, 390); pop('wrong', A('l42', 'home', 0.3));
    ['cake2', 'wrong', 'setc', 'noSlot'].forEach((i) => hide(i, B('l43', -0.2), 0.4)); tw('c2', B('l43', -0.2), 0.4, { o: 0 });
    // poisoning
    tw('prank', A('l43', 'prankster', -0.2), 0.001, { o: 1, x: 1750 }); go('prank', A('l43', 'prankster', -0.2), 2.5, 1330);
    em('fake', '🏷️', 60, 1330, 560); pop('fake', A('l43', 'slips', -0.2));
    fly('fake', A('l43', 'slips', 0), [[1330, 560], [820, 470], [735, 520]], 1.4, { arc: 70 });
    card(A('l43', 'poisoning', -0.2), 'Cache poisoning', 'fake input gets cached for everyone', { color: '#ff7b7b' });
    ['c1', 'c3'].forEach((c, i) => { tw(c, A('l43', 'handed', -0.3), 0.001, { o: 1, x: 1750 + i * 120 }); go(c, A('l43', 'handed', -0.2), 1.5, 1230 + i * 130); });
    for (let i = 0; i < 3; i++) { em('pz' + i, '🥨', 56, 735, 520); fly('pz' + i, A('l43', 'handed', 0.2 + i * 0.3), [[735, 520], [950, 450], [1180 + i * 70, 600]], 1.3, { arc: 70 }); hide('pz' + i, A('l43', 'handed', 2 + i * 0.3), 0.3); }
    ['c1', 'c3', 'prank', 'fake'].forEach((i) => tw(i, A('l43', 'and', 4), 0.4, { o: 0 }));
    // deception
    ui('url', rect(-330, -36, 660, 72, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#ffd166', sw: 3 }) + T('maya/account/nonexistent.css', 32, '#ffd166', { w: 700 }), 960, 200, {});
    pop('url', A('l43', 'deception', -0.3)); hide('url', B('l44', -0.2), 0.4);
    card(A('l43', 'deception', -0.1), 'Cache deception', 'private page looks like a static file', { color: '#ffb066', slot: 1 });
    wd('pg', Em('📄', 80) + T('Maya\'s page', 22, '#fff', { dy: 56 }), 830, 560);
    fly('pg', A('l43', 'asks', 0.2), [[1330, 480], [735, 540]], 1.4, { arc: 70 });
    tw('c2', A('l43', 'strangers', -1.2), 0.001, { o: 1, x: 1500 }); go('c2', A('l43', 'strangers', -1.2), 1.4, 1250);
    fly('pg', A('l43', 'strangers', 0), [[735, 540], [1050, 520]], 1.4, { arc: 60 });
    hide('pg', B('l44', -0.2), 0.4); tw('c2', B('l44', -0.2), 0.4, { o: 0 });
    // fix
    ui('kp', rect(0, 0, 520, 280, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#3ddc84', sw: 4 }) + T('KEY PLATE', 30, '#3ddc84', { dx: 260, dy: 34 }), 1330, 340);
    pop('kp', A('l44', 'fix', -0.2));
    ['path', 'header', 'language', 'everything that varies'].forEach((r, i) => chip('kpr' + i, '✓ ' + r, 1590, 430 + i * 60, '#3ddc84', A('l44', 'shelf', 0.2 + i * 0.55), { w: 420 }));
    chip('rej', '✗ /x.css rejected at origin', 1390, 760, '#ff7b7b', A('l44', 'reject', -0.1), { w: 470 });
    ['kp', 'kpr0', 'kpr1', 'kpr2', 'kpr3', 'rej'].forEach((i) => hide(i, B('l45', -0.2), 0.4));
    // signed url + cookie
    ui('tick', rect(0, 0, 560, 150, '#f3e3b2', { rx: 18, stroke: '#a98a45', sw: 5 }) + circ(280, 0, 18, '#0b1020') + T('🎫 signed link', 40, '#4a3a10', { dy: 52, dx: 280 }) + T('expires 10:00 · sig: 9f3a…', 30, '#4a3a10', { dx: 280, dy: 106 }), 1280, 320);
    pop('tick', A('l45', 'signed', -0.1));
    card(A('l45', 'signed', -0.1), 'Signed URL', 'expiry + signature, branch verifies', { color: '#ffd166' });
    uem('chk', '✅', 80, 1760, 400); pop('chk', A('l45', 'checks', 0));
    uem('ck', '🍪', 90, 1400, 600); pop('ck', A('l45', 'cookie', -0.3));
    ui('aisle', T('→  whole aisle open', 44, '#7ee0ff', { w: 800 }), 1680, 600); pop('aisle', A('l45', 'aisle', -0.8));
    card(A('l45', 'cookie', -0.2), 'Signed cookie', 'one cookie unlocks a path prefix', { color: '#7ee0ff', slot: 1 });
    ['tick', 'chk', 'ck', 'aisle'].forEach((i) => hide(i, End('l45', 0.4), 0.5));
  });
  kill(sc, B('l46', -0.4), 0.6);

  /* ================= S9: changing the recipe ================= */
  scene(() => {
    cam(B('l46', -0.3), 1.2, 'mumbai');
    ['c1', 'c2', 'c3', 'prank'].forEach((c) => tw(c, 0, 0.001, { o: 0 }));
    ui('sign', rect(0, 0, 560, 120, '#f3e3b2', { rx: 18, stroke: '#a98a45', sw: 5 }) + T('Sourdough', 56, '#2a1c08', { dx: 280, dy: 62 }), 1310, 330); pop('sign', B('l46', 1.0));
    portraitOn('pOscar', B('l47', -0.2), End('l47', 0.6));
    tx('sign', A('l47', 'sourdough two', -0.4), 'Sourdough 2');
    for (let i = 0; i < 4; i++) tw('sl' + i, A('l48', 'abandoned', i * 0.15), 0.5, { o: 0.3 });
    for (let i = 0; i < 2; i++) { uem('nv' + i, '🍞', 90, 1460 + i * 130, 470); pop('nv' + i, A('l47', 'sourdough two', 0.2 + i * 0.3)); }
    ui('nv2t', T('new name = new cache entry', 34, '#7dffb0', { w: 800 }), 1600, 560); pop('nv2t', A('l47', 'sourdough two', 0.9));
    card(A('l48', 'versioned', -0.1), 'Versioned URL', 'new name, old entry just ignored', { color: '#3ddc84' });
    // tag purge and soft purge
    for (let i = 0; i < 4; i++) tw('sl' + i, B('l49', 0), 0.4, { o: 1 });
    ['nv0', 'nv1', 'nv2t', 'sign'].forEach((i) => hide(i, B('l49', -0.3), 0.4));
    [4, 5, 6].forEach((i, k) => { em('tg' + k, '🏷️', 40, SL[i][0] + 20, SL[i][1] - 30); pop('tg' + k, A('l49', 'tag', 0.2 + k * 0.2)); });
    [4, 5, 6].forEach((i) => tw('sl' + i, A('l49', 'purge', 0.5), 0.5, { o: 0, s: 0.3 }));
    card(A('l49', 'tag', 0), 'Tag purge', 'recall only the loaves with one tag', { color: '#ffd166' });
    [0, 1, 2, 3].forEach((i) => tw('sl' + i, A('l49', 'soft', 0.3), 0.5, { o: 0.45 }));
    em('zz', '💤', 70, 590, 440); pop('zz', A('l49', 'soft', 0.4));
    card(A('l49', 'soft', -0.1), 'Soft purge', 'mark stale, serve until fresh arrives', { color: '#c084fc', slot: 1 });
    hide('zz', B('l50', -0.3), 0.3);
    // purge everything: stampede
    [0, 1, 2, 3].forEach((i) => tw('sl' + i, B('l50', -0.2), 0.3, { o: 1 }));
    ui('btn', circ(0, 0, 70, '#ff3b3b', { stroke: '#fff', sw: 8 }) + T('ALL', 40, '#fff'), 1700, 400); pop('btn', A('l50', 'shout', -0.5));
    cam(A('l50', 'branches', -0.6), 2.2, 'wide');
    const bsh = [[700, 760], [1250, 760], [1560, 760], [2100, 770]];
    const ph = [];
    bsh.forEach((b, k) => { for (let j = 0; j < 6; j++) { const id = 'op' + k + '_' + j; em(id, '📞', 52, 0, 0); fly(id, A('l50', 'same', -0.3) + j * 0.14 + k * 0.05, [[b[0], b[1] - 80], [1900, 620], [3030, 690]], 2.6, { arc: 60 + j * 14, ease: 'lin' }); hide(id, A('l50', 'same', 2.5 + j * 0.14), 0.2); } });
    ui('outage', T('OUTAGE', 170, '#ff3b3b', { w: 900 }), 960, 300, { r: -6 }); pop('outage', A('l50', 'outage', -0.2));
    tw('oscar', A('l50', 'same', 1.5), 0.2, { r: -6 }); tw('oscar', A('l50', 'same', 1.7), 0.2, { r: 6 }); tw('oscar', A('l50', 'same', 1.9), 0.2, { r: -6 }); tw('oscar', A('l50', 'same', 2.1), 0.2, { r: 6 }); tw('oscar', A('l50', 'same', 2.3), 0.3, { r: 0 });
    ['btn', 'outage'].forEach((i) => hide(i, End('l50', 0.4), 0.5));
    chip('warnN', 'purge everything = self-made outage', 960, 990, '#ff7b7b', A('l50', 'routine', -0.2), { w: 720 });
  });
  kill(sc, B('l51', -0.4), 0.6);

  /* ================= S10: Pia has a brain ================= */
  scene(() => {
    cam(B('l51', -0.3), 1.8, 'tight');
    tw('c1', B('l51', 0.2), 0.001, { o: 1, x: 1600 }); go('c1', B('l51', 0.3), 2.5, 1260);
    [4, 5, 6].forEach((i) => tw('sl' + i, B('l51', 0.1), 0.6, { o: 1, s: 1 }, { ease: 'back' }));
    wd('thk', Em('💭', 120) + T('{ }', 48, '#222', { dy: -6, font: 'ui-monospace, Menlo, monospace' }), 840, 380); pop('thk', A('l51', 'edge', -0.3));
    card(A('l51', 'edge', -0.2), 'Edge compute', 'your own code at the branch', { color: '#c084fc' });
    em('tk', '🎫', 70, 1260, 520); pop('tk', A('l51', 'checks', 0.2));
    wd('tkc', T('✓ not expired', 36, '#7dffb0', { w: 600 }), 1260, 450); pop('tkc', A('l51', 'expiry', 0));
    hide('tk', A('l51', 'redirects', -0.4), 0.3); hide('tkc', A('l51', 'redirects', -0.4), 0.3);
    em('rd', '↪️', 80, 1060, 560); pop('rd', A('l51', 'redirects', 0));
    em('ab', '🅰️', 70, 980, 450); em('ab2', '🅱️', 70, 1080, 450); pop('ab', A('l51', 'taste', 0)); pop('ab2', A('l51', 'taste', 0.2));
    hide('rd', A('l51', 'taste', 1.4), 0.3); hide('ab', A('l51', 'troublemakers', -0.5), 0.3); hide('ab2', A('l51', 'troublemakers', -0.5), 0.3);
    tw('prank', A('l51', 'troublemakers', -0.2), 0.001, { o: 1, x: 1300 });
    go('prank', A('l51', 'troublemakers', 0.1), 2.0, 1900);
    tw('c1', A('l51', 'troublemakers', 2.3), 0.4, { o: 0 }); hide('thk', End('l51', 0.2), 0.4);
    // l52 members list at origin
    portraitOn('pOscar', B('l52', 0.5), End('l52', 0.8));
    uem('mem', '📒', 110, 1530, 440); pop('mem', A('l52', 'oscar', -0.1));
    label('memT', 'real member list lives at origin', 34, '#cdd6e6', 1530, 520, A('l52', 'oscar', 0.1));
    card(A('l52', 'never', -0.3), 'Auth stays at origin', 'edge copy is eventually consistent', { color: '#7aa7ff' });
    ['mem', 'memT'].forEach((i) => hide(i, B('l53', -0.3), 0.4));
    // l53 dynamic acceleration
    cam(B('l53', -0.2), 2.2, 'wide');
    em('hs', '🤝', 90, 900, 700); pop('hs', A('l53', 'handshakes', -0.2)); hide('hs', A('l53', 'handshakes', 2.4), 0.3);
    line('warm', 830, 700, 3040, 740, '#ffd166', 12); draw('warm', A('l53', 'warm', -0.2), 1.0);
    em('chk2', '🛒', 80, 0, 0); fly('chk2', A('l53', 'custom', -1.5), [[1080, 700], [2000, 650], [3040, 720]], 3.6, { arc: 60 });
    hide('chk2', A('l53', 'custom', 2.3), 0.3);
    line('bb', 830, 800, 3040, 820, '#7ee0ff', 16, { dash: '0.03 0.02' }); draw('bb', A('l53', 'backbone', -0.3), 1.2);
    wd('bbT', T('private backbone', 52, '#7ee0ff', { w: 900 }), 1950, 890); pop('bbT', A('l53', 'backbone', 0.1));
    card(A('l53', 'dynamic', -0.1), 'Dynamic site acceleration', 'warm connection + short TLS hop', { color: '#ffd166' });
    uem('wifi', '📶', 90, 1500, 300); uem('mob', '📱', 90, 1780, 300); ui('arr', T('→', 90, '#7ee0ff'), 1640, 300);
    pop('wifi', A('l53', 'newer', -0.3)); pop('mob', A('l53', 'switch', -0.1)); pop('arr', A('l53', 'switch', -0.4));
    chip('conn', 'same connection survives', 1640, 400, '#3ddc84', A('l53', 'survive', -0.1), { w: 470 });
    card(A('l53', 'newer', -0.1), 'HTTP/3 (QUIC)', 'survives wifi to mobile', { color: '#7ee0ff', slot: 1 });
    ['warm', 'bb', 'bbT', 'wifi', 'mob', 'arr', 'conn'].forEach((i) => hide(i, End('l53', 0.4), 0.5));
  });
  kill(sc, B('l54', -0.4), 0.6);

  /* ================= S11: video and the scoreboard ================= */
  scene(() => {
    cam(B('l54', -0.3), 1.6, 'mumbai');
    ['c1', 'c2', 'c3', 'prank'].forEach((c) => tw(c, 0, 0.001, { o: 0 }));
    tw('maya', 0, 0.001, { x: 1090 });
    uem('vid', '🎬', 190, 1635, 380); pop('vid', B('l54', 0.4));
    for (let i = 0; i < 6; i++) { ui('seg' + i, rect(-40, -34, 80, 68, '#1e2a4a', { rx: 10, stroke: '#7ee0ff', sw: 3 }) + T('seg ' + (i + 1), 22, '#7ee0ff'), 1635 + (i - 2.5) * 92, 380); tw('seg' + i, A('l54', 'slices', 0 + i * 0.12), 0.01, { o: 1 }); tw('seg' + i, A('l54', 'slices', 0.01 + i * 0.12), 0.5, { y: 380 + 160 }, { ease: 'back' }); }
    hide('vid', A('l54', 'slices', 0), 0.3);
    chip('hls', 'HLS', 1520, 250, '#7ee0ff', A('l54', 'h l s', 0), { w: 150 }); chip('dash', 'DASH', 1700, 250, '#7ee0ff', A('l54', 'dash', -0.1), { w: 170 });
    ui('qual', T('480p', 56, '#ffd166'), 1640, 760, {}); pop('qual', A('l54', 'switch', -0.8)); tx('qual', A('l54', 'switch', 0.4), '1080p'); tx('qual', A('l54', 'different', 0.2), '720p');
    card(A('l54', 'every', 0), 'Segment caching', 'each slice cached on its own', { color: '#7ee0ff' });
    ['vid', 'hls', 'dash', 'qual', 'seg0', 'seg1', 'seg2', 'seg3', 'seg4', 'seg5'].forEach((i) => hide(i, End('l54', 0.6), 0.5));
    // l55: hit ratio vs byte hit ratio
    ui('bars', rect(0, 0, 560, 360, 'rgba(14,18,30,.93)', { rx: 18, stroke: '#9aa4b6', sw: 3 }) + T('SCOREBOARD', 28, '#cdd6e6', { dx: 280, dy: 36 }) + rect(40, 90, 480, 44, 'rgba(255,255,255,.12)', { rx: 10 }) + rect(40, 210, 480, 44, 'rgba(255,255,255,.12)', { rx: 10 }) +
      T('request hit ratio', 28, '#3ddc84', { anchor: 'start', dx: 40, dy: 76 }) + T('byte hit ratio', 28, '#ffd166', { anchor: 'start', dx: 40, dy: 196 }), 1340, 320);
    pop('bars', A('l55', 'two', -0.2));
    const bar = (id, y, col, frac, t) => { ui(id, rect(0, 0, 480, 44, col, { rx: 10 }), 1380, y, { f: 0.001 }); tw(id, t, 0.01, { o: 1 }); tw(id, t, 1.2, { f: frac }, { ease: 'out' }); };
    bar('b1', 410, '#3ddc84', 0.93, A('l55', 'hit', 0.2)); bar('b2', 530, '#ffd166', 0.55, A('l55', 'byte', 0.2));
    uem('giant', '🎞️', 120, 1760, 600); pop('giant', A('l55', 'giant', -0.1));
    label('skew', 'one giant video skews the request ratio', 30, '#ffd166', 1620, 720, A('l55', 'look', -0.4), {});
    card(A('l55', 'byte', -0.2), 'Byte hit ratio', 'counts weight, not just requests', { color: '#ffd166' });
    ['bars', 'b1', 'b2', 'giant', 'skew'].forEach((i) => hide(i, B('l56', -0.2), 0.4));
    // l56: dashboard
    const tiles = [['origin offload', '🛡️', 'off'], ['first byte per region', '⏱️', 'ttfb'], ['purge speed', '🧹', 'purges'], ['bandwidth bill', '💸', 'bill']];
    const keys = ['offload', 'first', 'fast', 'bandwidth'];
    tiles.forEach((tl, i) => { const x = 1340 + (i % 2) * 280, y = 300 + Math.floor(i / 2) * 250; ui('tile' + i, rect(0, 0, 260, 210, 'rgba(14,18,30,.93)', { rx: 18, stroke: '#7ee0ff', sw: 3 }) + Em(tl[1], 70, { dx: 130, dy: 70 }) + T(tl[0], 24, '#cdd6e6', { dx: 130, dy: 160 }), x, y); pop('tile' + i, A('l56', keys[i], -0.3)); });
    card(A('l56', 'good', -0.2), 'What to watch', 'hit ratio, offload, TTFB, purges, cost', { color: '#7ee0ff' });
    for (let i = 0; i < 4; i++) hide('tile' + i, End('l56', 0.5), 0.5);
  });
  kill(sc, B('l57', -0.4), 0.6);

  /* ================= S12: providers, trade-offs, recap ================= */
  scene(() => {
    cam(B('l57', -0.3), 1.2, 'mumbai');
    const prov = [['Cloudflare', 'cache + security + code everywhere', 'cloudflare', '#f6821f'], ['Fastly', 'fine control, fast purge', 'fastly', '#ff6b6b'], ['Akamai', 'fine control, fast purge', 'akamai', '#4c8bf5'], ['CloudFront', 'fits Amazon services', 'cloud', '#ffb84d'], ['DIY: Varnish / Nginx', 'you own hardware + pager', 'varnish', '#9aa4b6']];
    prov.forEach((p, i) => { ui('pv' + i, rect(0, 0, 560, 100, 'rgba(14,18,30,.93)', { rx: 16, stroke: p[3], sw: 4 }) + T(p[0], 34, p[3], { anchor: 'start', dx: 24, dy: 32 }) + T(p[1], 22, '#cdd6e6', { anchor: 'start', dx: 24, dy: 72 }), 1340, 150 + i * 120); pop('pv' + i, A('l57', p[2], -0.2)); });
    prov.forEach((p, i) => hide('pv' + i, B('l58', -0.2), 0.4));
    // trade-offs
    const to = [['🥖⏰', 'may serve a stale loaf', 'stale'], ['🇧🇷🔍', 'a branch you do not own', 'brazil'], ['🔥🥖', 'one viral loaf = one shelf slot', 'viral'], ['🧩', 'rare custom orders gain little', 'rarely'], ['🏢', 'local staff only: no branches', 'cafeteria']];
    to.forEach((p, i) => { ui('to' + i, rect(0, 0, 560, 100, 'rgba(14,18,30,.93)', { rx: 16, stroke: '#ff9f6b', sw: 4 }) + Em(p[0], 46, { dx: 62, dy: 52 }) + T(p[1], 24, '#ffd9bf', { anchor: 'start', dx: 122, dy: 52 }), 1340, 150 + i * 120); pop('to' + i, A('l58', p[2], -0.3)); });
    to.forEach((p, i) => hide('to' + i, End('l58', 0.6), 0.4));
    // recap
    const rc = [['📍', 'copies close', 'copies'], ['🏷️', 'labels', 'labels'], ['🔑', 'cache key', 'key'], ['🤝', 'collapsing', 'collapsing'], ['✏️', 'rename', 'rename'], ['🔒', 'private', 'private'], ['⚡', 'edge vs origin', 'quick']];
    rc.forEach((p, i) => { const x = 1330 + (i % 2) * 290, y = 130 + Math.floor(i / 2) * 150; ui('rcp' + i, rect(0, 0, 270, 120, 'rgba(14,18,30,.93)', { rx: 16, stroke: '#3ddc84', sw: 4 }) + Em(p[0], 50, { dx: 46, dy: 62 }) + T(p[1], 22, '#d8ffe6', { anchor: 'start', dx: 90, dy: 62 }), x, y); pop('rcp' + i, A('l59', p[2], -0.2)); });
    ui('endT', T('CDN and Edge', 120, '#fff', { w: 900 }), 960, 440, {}); ui('endS', T('copies close, rules clear, decisions at the origin', 44, '#cdd6e6', { w: 700 }), 960, 560, {});
    rc.forEach((p, i) => hide('rcp' + i, A('l60', 'thank', -0.4), 0.5));
    tw('maya', B('l60', 0.2), 0.4, { r: -6 }); tw('maya', B('l60', 0.6), 0.4, { r: 6 }); tw('maya', B('l60', 1.0), 0.4, { r: 0 });
    pop('endT', B('l61', 1.2)); pop('endS', B('l61', 1.8));
  });

  /* ===== new chapters: deep dive, real headers, Go code, interview, read-next ===== */
  const mono = 'ui-monospace, Menlo, monospace';
  const dim = (id, t0, t1) => { ui(id, rect(0, 0, 1920, 1080, 'rgba(8,12,24,.92)'), 0, 0); tw(id, t0, 0.5, { o: 1 }); tw(id, t1, 0.5, { o: 0 }); };
  const rowBox = (id, title, sub, x, y, w, h, col, t) => { ui(id, rect(0, 0, w, h, 'rgba(14,18,30,.94)', { rx: 16, stroke: col, sw: 4 }) + T(title, 34, col, { anchor: 'start', dx: 24, dy: sub ? h * 0.32 : h / 2 }) + (sub ? T(sub, 24, '#cdd6e6', { anchor: 'start', dx: 24, dy: h * 0.72 }) : ''), x, y); pop(id, t); return id; };
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const blk = (l0, lEnd, fn) => { scene(() => { dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };

  blk('l58a', 'l58f', () => {
    rowBox('dd1', 's-maxage', 'a CDN freshness window different from the browser, one body', 200, 150, 1500, 120, '#7ee0ff', A('l58a', 's', 0));
    rowBox('dd2', 'stale-if-error', 'origin down? serve the old copy, not an error', 200, 300, 1500, 120, '#3ddc84', A('l58b', 'stale', 0.2));
    rowBox('dd3', 'anycast route flapping', 'routes change mid-session → long streams can break', 200, 450, 1500, 120, '#ff9f6b', A('l58c', 'anycast', 0));
    rowBox('dd4', 'cost shape', 'egress per GB varies by region · high hit ratio cuts origin bandwidth', 200, 600, 1500, 120, '#ffd166', A('l58d', 'cost', 0));
    rowBox('dd5', 'edge KV stores', 'fast reads everywhere, slow writes (seconds to tens of seconds)', 200, 750, 1500, 120, '#c084fc', A('l58d', 'edge', 0));
    rowBox('dd6', 'collapsing has a limit', 'only helps while a fetch is in flight', 200, 900, 1500, 120, '#ff7b7b', A('l58e', 'last', 0));
  });
  blk('l58f', 'l58h', () => {
    ui('hd1', rect(0, 0, 1100, 250, '#0b0f1a', { rx: 18, stroke: '#ff7b7b', sw: 4 }) + T('www.cloudflare.com (marketing page)', 30, '#ff9f9f', { anchor: 'start', dx: 30, dy: 38 }) + T('HTTP/2 200', 34, '#e6edf7', { anchor: 'start', dx: 30, dy: 100, font: mono }) + T('cache-control: no-store', 38, '#ff7b7b', { anchor: 'start', dx: 30, dy: 160, font: mono }) + T('personalised → opts out of every shared cache', 28, '#ffd9bf', { anchor: 'start', dx: 30, dy: 215 }), 260, 200, {}); pop('hd1', A('l58f', 'no', -0.2));
    ui('hd2', rect(0, 0, 1100, 300, '#0b0f1a', { rx: 18, stroke: '#3ddc84', sw: 4 }) + T('a public static file', 30, '#9be8b4', { anchor: 'start', dx: 30, dy: 38 }) + T('cache-control: public, max-age=3600', 36, '#3ddc84', { anchor: 'start', dx: 30, dy: 100, font: mono }) + T('age: …    x-cache: …', 34, '#e6edf7', { anchor: 'start', dx: 30, dy: 160, font: mono }) + T('any shared cache may hold it for one hour', 28, '#cdd6e6', { anchor: 'start', dx: 30, dy: 225 }), 560, 520, {}); pop('hd2', A('l58g', 'public', -0.2));
    C('hdN', 'a few headers tell you what any response will do', 960, 940, '#ffd166', 'l58g', 'reading', 760, 0);
  });
  scene(() => {
    dim('dmgo', B('l58h', -0.3), B('l58l', -0.3));
    const LN = ['func (s *Shield) Get(key string) ([]byte, int, error) {', '\ts.mu.Lock()', '\tif c, ok := s.inFlight[key]; ok { // a fetch is already running', '\t\tc.waiters++', '\t\ts.mu.Unlock()', '\t\t<-c.done // wait for the shared result', '\t\treturn c.value, c.waiters, c.err', '\t}', '\tc := &call{done: make(chan struct{}), waiters: 1}', '\ts.inFlight[key] = c // register BEFORE unlocking', '\ts.mu.Unlock()', '\tc.value, c.err = s.fetch(key) // one origin call', '\ts.mu.Lock(); delete(s.inFlight, key); s.mu.Unlock()', '\tclose(c.done) // wakes every waiter', '\treturn c.value, c.waiters, c.err', '}'];
    const cp = S.codePanel('code', LN, { x: 180, y: 110, w: 1560, fs: 30, title: 'shield.go', t0: B('l58h', 0), times: LN.map((x, i) => A('l58h', 'in', 0.5) + i * 0.15) });
    ui('gonote', T('type Shield struct { mu sync.Mutex; inFlight map[string]*call }', 28, '#7ee0ff', { w: 1500, font: mono }), 960, 70, {}); pop('gonote', B('l58h', 0.3));
    cp.hl(1, A('l58i', 'takes', 0)); cp.hl(5, A('l58i', 'waits', 0)); cp.hl(9, A('l58j', 'registers', 0)); cp.hl(11, A('l58j', 'calls', 0)); cp.hl(13, A('l58k', 'closed', 0));
    C('go100', '100 concurrent misses → 1 origin call (go test -race ✓)', 960, 990, '#3ddc84', 'l58k', 'hundred', 900, 0);
    S.scope(null);
  });
  kill(sc, B('l58l', -0.3), 0.5);
  blk('l58l', 'l59', () => {
    const QA = [['Max-age vs s-maxage?', 'max-age: every cache · s-maxage: shared caches only (CDN); browsers ignore it', 'l58m', 'one'], ['Hit ratio → ~0 after adding Vary: Cookie?', 'every request = its own cache key → nothing shared. Strip the cookie / stop varying', 'l58n', 'two'], ['"A CDN can’t help my logged-in dashboard"?', 'False: TLS at the PoP, warm origin pool, HTTP/3 = dynamic acceleration', 'l58o', 'three'], ['Poisoning vs deception?', 'poisoning: key misses an input → bad copy shared · deception: private page cached as “static”', 'l58p', 'four'], ['Edge vs origin for auth? GeoDNS vs anycast?', 'edge: signature + expiry pre-check, origin decides · anycast: instant failover; GeoDNS: simple but coarse, TTL-bound', 'l58q', 'five']];
    QA.forEach((q, i) => { const y = 130 + i * 175; ui('qa' + i, rect(0, 0, 1640, 160, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 34, '#7ee0ff', { anchor: 'start', dx: 28, dy: 44 }) + T(q[1], 26, '#fff', { anchor: 'start', dx: 28, dy: 106 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });
  scene(() => {
    C('rn1', '📘 notes: CDN and Edge  +  CDN and Edge - Go', 700, 330, '#7ee0ff', 'l59n', 'open', 800, 0);
    C('rn2', '⬅ before: HTTP Fundamentals · DNS', 700, 410, '#ffd166', 'l59n', 'before', 800, 0);
    C('rn3', '➡ after: Forward and Reverse Proxies · What Happens When You Type a URL', 700, 490, '#3ddc84', 'l59n', 'after', 800, 0);
    ['rn1', 'rn2', 'rn3'].forEach((x) => hide(x, A('l60', 'thank', -0.4), 0.5));
    S.scope(null);
  });
})();
