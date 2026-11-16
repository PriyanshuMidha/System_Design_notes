/* HTTP fundamentals: scene animation. Written against story_engine.js. Times come from the voice (S.W = a spoken phrase). */
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
    zoe: { who: 'ZOE', skin: '#c98d5b', shirt: '#ec4899', pants: '#2a2f3a', hair: '#1a1210', hair2: 'long', hold: '📱', blush: 1, w: 92, name: 'Zoe', ring: '#ec4899' },
    max: { who: 'MAX', skin: '#e8b48a', shirt: '#f59e0b', apron: '#fff', hat: 'cap', hatColor: '#b45309', pants: '#444', hold: '🧾', w: 112, name: 'Max', ring: '#f59e0b' },
    gia: { who: 'GIA', skin: '#f1c9a5', shirt: '#14b8a6', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🛵', w: 90, name: 'Gia', ring: '#2dd4bf' },
    pat: { who: 'PAT', skin: '#d9a37a', shirt: '#64748b', pants: '#333', glasses: 1, hair: '#444', hold: '🔍', w: 100, name: 'Pat', ring: '#94a3b8' },
  };
  const keep = { keep: true };
  mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset=".62" stop-color="#46589a"/><stop offset="1" stop-color="#f0a867"/></linearGradient></defs>' + rect(-1600, -1600, 8200, 2450, 'url(#sg)'), keep);
  mk('stars', Array.from({ length: 70 }, (_, i) => circ((i * 197) % 5200 - 600, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.7)')).join(''), keep);
  mk('skyline', Array.from({ length: 56 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#202f5c' : '#27376d'); }).join(''), keep);
  mk('ground', rect(-1600, 790, 8200, 2000, '#2b3a2e') + rect(-1600, 830, 8200, 70, '#3a3d4a') + Array.from({ length: 90 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  const bld = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY }, keep));
  bld('bZ', 300, '#a21c5f', 'ZOE · CLIENT', '📱'); bld('bG', 1100, '#0f766e', 'GIA · GATEWAY', '🛵'); bld('bM', 1950, '#b45309', 'MAX · SERVER', '🍽️');
  mkChar('zoe', CFG.zoe, 380, 830, keep); mkChar('gia', CFG.gia, 1120, 830, keep); mkChar('max', CFG.max, 1970, 830, keep); mkChar('pat', CFG.pat, 2400, 830, { o: 0, keep: 1 });
  [['Zoe', 380, '#f472b6'], ['Gia', 1120, '#2dd4bf'], ['Max', 1970, '#fbbf24']].forEach((n) => mk('nm' + n[0], T(n[0], 38, n[2]), Object.assign({ x: n[1], y: 885 }, keep)));
  ['ZOE', 'MAX', 'GIA', 'PAT'].forEach((w) => { portrait('pt' + w, Object.assign({}, CFG[w.toLowerCase()]), 40, 780); tw('pt' + w, 0, 0.01, { o: 1 }); });
  const views = { wide: { x: 1150, y: 470, s: 0.68 }, zoe: { x: 700, y: 520, s: 0.95 }, max: { x: 1850, y: 520, s: 0.95 } };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? views[v] : v);
  camTw(0, 0.001, views.wide);
  const C = (id, text, x, y, col, l, ph, w, off) => chip(id, text, x, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: w || Math.max(200, text.length * 17 + 60) });
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  const blk = (l0, lEnd, withDim, fn) => { scene(() => { if (withDim) dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); S.scope(null); }); kill(sc, B(lEnd, -0.3), 0.5); };
  const pulse = (id, t) => { const b = S.ents[id].init.s; tw(id, t, 0.01, { s: b }); tw(id, t + 0.01, 0.3, { s: b * 1.1 }, { ease: 'back' }); tw(id, t + 0.7, 0.3, { s: b }); };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };
  const termLine = (id, text, col, x, y, t) => { ui(id, T(text, 30, col, { anchor: 'start', font: mono }), x, y, {}); pop(id, t); };
  const rows = (prefix, list, x, y0, dy, w, h, col0) => list.forEach((r, i) => rowBox(prefix + i, r[0], r[1], x, y0 + i * dy, w, h, r[4] || col0, A(r[2], r[3], -0.25)));

  /* ===== S1: the words (world) ===== */
  blk('l1', 'l7', false, () => {
    cam(B('l1', 0), 0.01, 'wide');
    ask('rq', 'GET /orders', '#f472b6', 380, 560, 1960, 560, A('l1', 'phone', 0.5), 3.0); ask('rs', '200 OK + the list', '#3ddc84', 1960, 620, 400, 620, A('l1', 'answer', 0.2), 3.0);
    [['client: the program that asks', 'client', '#7ee0ff'], ['server: the program that answers', 'server', '#ffd166'], ['request → one message · response → its reply', 'request', '#c084fc']].forEach((w, i) => C('w' + i, w[0], 1150, 170 + i * 75, w[2], 'l2', w[1], 800, 0));
    ['w0', 'w1', 'w2'].forEach((i) => hide(i, B('l3', -0.2), 0.4));
    [['header: a Name: value line', 'header', '#ffd166'], ['body: the data itself', 'body', '#3ddc84'], ['status code: 3 digits · 404 = not found', 'status', '#ff9f6b'], ['cookie: a value the browser stores + resends', 'cookie', '#f472b6']].forEach((w, i) => C('x' + i, w[0], 1150, 170 + i * 75, w[2], 'l3', w[1], 800, 0));
    ['x0', 'x1', 'x2', 'x3'].forEach((i) => hide(i, B('l4', -0.2), 0.4));
    [['you say what you want → method + path', 'want', '#7ee0ff'], ['you add notes: “no onions” → headers', 'notes', '#ffd166'], ['a tray + a receipt → body + status code', 'tray', '#3ddc84']].forEach((w, i) => C('y' + i, w[0], 1150, 170 + i * 75, w[2], 'l4', w[1], 800, 0));
    ['y0', 'y1', 'y2'].forEach((i) => hide(i, B('l5', -0.2), 0.4));
    em('fg', '🧠❌', 110, 1970, 480); pop('fg', A('l5', 'forget', -0.2)); C('fgt', 'every time: tell me everything again', 1970, 380, '#ffb066', 'l5', 'time', 560, 0);
    ['fg', 'fgt'].forEach((i) => hide(i, B('l6', -0.2), 0.4));
    C('rm', 'ask with a method + path · answered with a status code · nothing remembered', 1150, 260, '#3ddc84', 'l6', 'remember', 1180, -0.3);
  });

  /* ===== S2: why a shared protocol ===== */
  blk('l7', 'l11', true, () => {
    P('b1', 'before HTTP', 'every service invented its own way to ask, and its own way to say “found” or “not found”', 160, 150, 1600, 130, '#ff7b7b', 'l7', 'every');
    P('b2', 'HTTP', 'one shared, text-readable request/response vocabulary · RFC 1945 → RFC 9110–9114', 160, 310, 1600, 130, '#3ddc84', 'l8', 'standardised');
    C('b3', 'a 1996 browser and a Go server today still agree on GET /index.html', 960, 520, '#ffd166', 'l8', 'nineteen', 900, -0.2);
    C('e0', 'POST /orders', 460, 690, '#7ee0ff', 'l9', 'post', 280, 0); C('e1', 'created → 201', 760, 690, '#3ddc84', 'l9', 'created', 260, 0); C('e2', 'rejected → 400', 1060, 690, '#ffb066', 'l9', 'rejected', 280, 0); C('e3', 'server broke → 500', 1400, 690, '#ff7b7b', 'l9', 'broke', 320, 0);
    C('b4', 'a vocabulary everyone already agrees on', 960, 860, '#c084fc', 'l10', 'vocabulary', 640, -0.2);
  });

  /* ===== S3: letter and receipt ===== */
  blk('l11', 'l16', true, () => {
    ui('rqb', rect(0, 0, 780, 480, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#7ee0ff', sw: 5 }) + T('REQUEST · a letter', 36, '#7ee0ff', { dx: 390, dy: 40 }), 120, 140, {}); pop('rqb', B('l11', 0.1));
    [['GET /orders/42', 'first line: what + where', 'first'], ['headers: who · formats · cached copy?', 'context', 'headers'], ['body (optional): data to act on', 'optional', 'body']].forEach((r, i) => { ui('rq' + i, T(r[0], 30, '#fff', { anchor: 'start', dx: 0, dy: -10 }) + T(r[1], 22, '#9aa4b6', { anchor: 'start', dx: 0, dy: 24 }), 160, 240 + i * 110, {}); pop('rq' + i, A('l11', r[2], -0.2)); });
    ui('rsb', rect(0, 0, 780, 480, 'rgba(14,18,30,.95)', { rx: 18, stroke: '#3ddc84', sw: 5 }) + T('RESPONSE · a receipt', 36, '#3ddc84', { dx: 390, dy: 40 }), 1020, 140, {}); pop('rsb', B('l12', 0.1));
    [['HTTP/1.1 200 OK', 'status line: what happened', 'status'], ['headers: metadata about the reply', 'describe', 'headers'], ['body (optional): the result', 'carries', 'body']].forEach((r, i) => { ui('rs' + i, T(r[0], 30, '#fff', { anchor: 'start', dx: 0, dy: -10 }) + T(r[1], 22, '#9aa4b6', { anchor: 'start', dx: 0, dy: 24 }), 1060, 240 + i * 110, {}); pop('rs' + i, A('l12', r[2], -0.2)); });
    C('sl', 'STATELESS: the clerk has no memory of your last visit', 960, 720, '#ffd166', 'l13', 'statelessness', 800, -0.1); C('ck', 'persist across requests → a cookie or a token on EVERY request', 960, 790, '#7ee0ff', 'l13', 'cookie', 880, 0);
    C('mk', '✗ “an open connection means the server remembers me”', 960, 860, '#ff7b7b', 'l14', 'mistake', 860, -0.2); C('gf', '✓ every request is understandable alone → any server in a pool can answer', 960, 930, '#3ddc84', 'l15', 'gift', 1100, -0.2);
  });

  /* ===== S4: a real exchange (terminal) ===== */
  blk('l16', 'l19', true, () => {
    ui('term', rect(0, 0, 1500, 800, '#0b0f1a', { rx: 18, stroke: '#334', sw: 3 }), 210, 150, {}); pop('term', B('l16', 0));
    const Q = ['$ curl -v http://127.0.0.1:8099/items/1', '> GET /items/1 HTTP/1.1', '> Host: 127.0.0.1:8099', '> User-Agent: curl/8.7.1', '> Accept: */*'];
    Q.forEach((q, i) => termLine('tq' + i, q, i === 0 ? '#9aa4b6' : '#7ee0ff', 250, 200 + i * 44, A('l16', ['curl', 'get', 'host', 'user', 'accept'][i], -0.2)));
    const R = ['< HTTP/1.1 200 OK', '< Cache-Control: max-age=60', '< Content-Type: application/json', '< Etag: "2cf24dba5fb0a30e"', '< Date: Fri, 06 Nov 2026 18:41:46 GMT', '< Content-Length: 26', '<', '{"body":"hello","id":"1"}'];
    R.forEach((q, i) => termLine('tr' + i, q, i === 7 ? '#ffd166' : '#3ddc84', 250, 450 + i * 44, A('l17', ['status', 'cache', 'content', 'e', 'date', 'content', 'blank', 'body'][i] === 'content' && i === 5 ? 'twenty' : ['status', 'cache', 'content', 'e', 'date', 'twenty', 'blank', 'body'][i], -0.2)));
    C('ar1', '>  what curl SENT', 1200, 280, '#7ee0ff', 'l18', 'greater', 360, 0); C('ar2', '<  what the server REPLIED', 1200, 600, '#3ddc84', 'l18', 'less', 420, 0);
  });

  /* ===== S5: methods ===== */
  blk('l19', 'l25', true, () => {
    const hdr = (x, t, c) => { ui('mh' + x, T(t, 30, c, { w: 600 }), x, 110, {}); pop('mh' + x, B('l19', 0.2)); };
    hdr(240, 'METHOD', '#cdd6e6'); hdr(560, 'SAFE', '#3ddc84'); hdr(800, 'IDEMPOTENT', '#7ee0ff'); hdr(1280, 'MEANING', '#ffd166');
    const M = [['GET', '✓', '✓', 'retrieve; never changes anything', 'get', '#3ddc84'], ['HEAD', '✓', '✓', 'headers only, no body', 'head', '#3ddc84'], ['OPTIONS', '✓', '✓', 'what is allowed (CORS preflight)', 'options', '#3ddc84'], ['PUT', '✗', '✓', 'replace entirely · same end state twice', 'put', '#7ee0ff'], ['DELETE', '✗', '✓', 'remove · twice still ends gone', 'delete', '#7ee0ff'], ['POST', '✗', '✗', 'create / side effect · a retry can duplicate', 'post', '#ff7b7b'], ['PATCH', '✗', 'usually ✗', 'partial change · relative patches repeat badly', 'patch', '#ffb066']];
    M.forEach((m, i) => { const y = 160 + i * 95; ui('mr' + i, rect(0, 0, 1640, 80, 'rgba(14,18,30,.95)', { rx: 14, stroke: m[5], sw: 3 }) + T(m[0], 34, m[5], { anchor: 'start', dx: 30, dy: 40 }) + T(m[1], 36, '#fff', { dx: 450, dy: 40 }) + T(m[2], 32, '#fff', { dx: 690, dy: 40 }) + T(m[3], 26, '#cdd6e6', { anchor: 'start', dx: 900, dy: 40 }), 140, y, {}); pop('mr' + i, A('l21', m[4], -0.2)); });
    C('sf', 'SAFE = never changes server state', 520, 880, '#3ddc84', 'l19', 'safe', 520, -0.1); C('id', 'IDEMPOTENT = repeating = same end state', 1300, 880, '#7ee0ff', 'l19', 'idempotent', 620, -0.1);
    C('tp', 'patch {"status":"shipped"} ✓ repeat-safe · patch {"$inc": stock -1} ✗', 960, 960, '#ffb066', 'l22', 'trap', 1000, 0);
    C('tp2', 'idempotent ≠ same response: a 2nd DELETE may be 404, end state still “gone”', 960, 1030, '#ffd166', 'l23', 'idempotent', 1000, 0);
  });
  blk('l24', 'l25', true, () => { C('ik', 'retry-safe payments / orders → an explicit IDEMPOTENCY KEY', 960, 400, '#c084fc', 'l24', 'key', 900, -0.3); });

  /* ===== S6: status codes ===== */
  blk('l25', 'l30', true, () => {
    [['1xx', 'informational', '#9aa4b6'], ['2xx', 'success', '#3ddc84'], ['3xx', 'redirect / not modified', '#7ee0ff'], ['4xx', 'the CLIENT did wrong', '#ffb066'], ['5xx', 'the SERVER broke', '#ff7b7b']].forEach((c, i) => { ui('fam' + i, rect(0, 0, 330, 200, 'rgba(14,18,30,.95)', { rx: 18, stroke: c[2], sw: 5 }) + T(c[0], 64, c[2], { dx: 165, dy: 70 }) + T(c[1], 26, '#cdd6e6', { dx: 165, dy: 150 }), 100 + i * 355, 150, {}); pop('fam' + i, A('l25', ['families', 'success', 'redirection', 'client', 'server'][i], -0.4)); });
    C('who', 'the family tells you WHO should act next', 960, 430, '#ffd166', 'l25', 'family', 640, -0.1);
    P('c401', '401 Unauthorized', 'not authenticated · missing/invalid credentials → “log in”', 160, 520, 780, 130, '#ffd166', 'l26', 'four', -0.3); P('c403', '403 Forbidden', 'authenticated but not allowed → “I know you, still no”', 980, 520, 780, 130, '#ff9f6b', 'l26', 'three', 0.2);
  });
  blk('l30', 'l33', true, () => {
    P('c4a', '400 Bad Request', 'malformed: broken JSON · wrong type · missing field → usually a client bug', 160, 130, 1600, 110, '#ffb066', 'l28', 'hundred');
    P('c4b', '422 Unprocessable', 'understood, but fails a business rule (end date before start) → show the user a message', 160, 260, 1600, 110, '#ffd166', 'l28', 'twenty');
    P('c4c', '409 Conflict', 'about STATE: version mismatch · duplicate unique key', 160, 390, 1600, 110, '#c084fc', 'l29', 'conflict');
    P('c5a', '502 Bad Gateway', 'the upstream answered, but invalidly', 160, 560, 1600, 110, '#ff7b7b', 'l31', 'bad');
    P('c5b', '503 Service Unavailable', 'temporarily unable · overloaded / maintenance · often Retry-After', 160, 690, 1600, 110, '#ff9f6b', 'l31', 'unavailable');
    P('c5c', '504 Gateway Timeout', 'no response from the upstream in time, at all', 160, 820, 1600, 110, '#ffd166', 'l31', 'timeout');
    C('vz', '401 = “I don’t know who you are” · 403 = “I know exactly who you are, still no”', 960, 1000, '#3ddc84', 'l32', 'remember', 1200, -0.2);
  });

  /* ===== S7: headers ===== */
  blk('l33', 'l36', true, () => {
    const H = [['Host', 'which domain · mandatory since HTTP/1.1', 'l34', 'host'], ['Content-Type', 'media type of the body · application/json', 'l34', 'content type'], ['Content-Length', 'body size in bytes · where the body ends', 'l34', 'content length'], ['Authorization', 'credentials · Bearer <token> · Basic', 'l34', 'authorization'], ['Cache-Control', 'max-age · no-store · must-revalidate', 'l35', 'cache control'], ['ETag / If-None-Match', 'a content fingerprint · a conditional request', 'l35', 'e tag'], ['Set-Cookie / Cookie', 'store this value · send it back', 'l35', 'set cookie'], ['Connection', 'keep-alive or close', 'l35', 'connection']];
    H.forEach((h, i) => { const col = i < 4 ? 0 : 1, row = i % 4; rowBox('hr' + i, h[0], h[1], 90 + col * 900, 170 + row * 190, 880, 160, ['#7ee0ff', '#3ddc84', '#ffd166', '#c084fc', '#ff9f6b', '#22d3ee', '#f472b6', '#9aa4b6'][i], A(h[2], h[3], -0.25)); });
  });

  /* ===== S8: conditional requests (world) ===== */
  blk('l36', 'l39', false, () => {
    cam(B('l36', -0.3), 1.4, 'wide');
    wl('tag', 'ETag: a hash of the content', '#22d3ee', 1970, 430, A('l36', 'tags', 0), 40);
    ask('c1', 'GET + If-None-Match: "2cf24dba…"', '#22d3ee', 400, 580, 1950, 580, A('l36', 'sends', -0.2), 2.6);
    ask('c2', '304 Not Modified · no body', '#3ddc84', 1970, 660, 420, 660, B('l37', 0.4), 2.6);
    C('kb', 'full 2 KB the first time · a few bytes of headers after', 1150, 250, '#ffd166', 'l38', 'kilobyte', 800, 0); C('wk', '304 = caching WORKING, not failing', 1150, 330, '#3ddc84', 'l38', 'working', 600, 0);
  });

  /* ===== S9: cookies ===== */
  blk('l39', 'l44', true, () => {
    P('ca0', 'Secure', 'only sent over HTTPS · blocks sniffing on plain HTTP', 140, 130, 1640, 112, '#3ddc84', 'l40', 'secure');
    P('ca1', 'HttpOnly', 'not readable from JavaScript · blunts XSS cookie theft', 140, 255, 1640, 112, '#7ee0ff', 'l40', 'http only', -0.3);
    P('ca2', 'SameSite', 'Strict / Lax / None · not sent on cross-site requests → blunts CSRF', 140, 380, 1640, 112, '#ffd166', 'l41', 'same site');
    P('ca3', 'Domain', 'which hosts receive it · too broad leaks to other subdomains', 140, 505, 1640, 112, '#c084fc', 'l41', 'domain');
    P('ca4', 'Path', 'scope to /admin instead of the whole site', 140, 630, 1640, 112, '#ff9f6b', 'l41', 'path');
    ui('good', T('Set-Cookie: session=…; Secure; HttpOnly; SameSite=Strict; Path=/', 34, '#3ddc84', { w: 1700, font: mono }), 960, 820, {}); pop('good', A('l42', 'secure', -0.3));
    C('bad', '✗ only HttpOnly = not safe · three attributes block THREE different attacks', 960, 930, '#ff7b7b', 'l43', 'mistake', 1100, -0.2);
  });

  /* ===== S10: keep-alive ===== */
  blk('l44', 'l46', true, () => {
    P('k10', 'HTTP/1.0', 'a fresh TCP connection for every request', 160, 180, 1600, 130, '#ff7b7b', 'l44', 'oh');
    P('k11', 'HTTP/1.1 keep-alive', 'one connection reused for several requests · no new TCP (or TLS) handshake each time', 160, 340, 1600, 130, '#3ddc84', 'l44', 'defaults');
    C('hol', 'still one answer at a time per connection (head-of-line blocking)', 960, 600, '#ffb066', 'l45', 'ordering', 900, -0.2); C('h2', 'browsers open several connections · HTTP/2 multiplexing fixes it', 960, 680, '#7ee0ff', 'l45', 'browsers', 940, 0);
    C('ks', 'keep-alive saves HANDSHAKES, not ORDERING', 960, 790, '#ffd166', 'l45', 'saves', 640, -0.3);
  });

  /* ===== S11: a worked example (dim steps) ===== */
  blk('l46', 'g1', true, () => {
    P('ws1', '1  PUT /items/42  {"Body":"v1"}', 'the store has no entry for 42 yet · items = { }', 220, 140, 1480, 120, '#7ee0ff', 'l46', 'first');
    P('ws2', '2  handler writes it → 201 Created', 'items = { "42": "v1" } · the resource did not exist before', 220, 290, 1480, 120, '#3ddc84', 'l47', 'writes');
    P('ws3', '3  the same PUT again (a retry after a timeout)', 'writes the same value → items = { "42": "v1" } · unchanged', 220, 440, 1480, 120, '#ffd166', 'l48', 'same');
    P('ws4', '4  → 200 OK this time', 'the resource already existed', 220, 590, 1480, 120, '#ff9f6b', 'l48', 'responds');
    C('ws5', 'responses differ (201 → 200) · stored STATE is identical = idempotent', 960, 820, '#3ddc84', 'l49', 'responses', 1100, -0.2);
  });

  /* ===== S12: Go code ===== */
  scene(() => {
    dim('dmgo', B('g1', -0.3), B('d1', -0.3));
    const L0 = ['type Store struct {', '\tmu     sync.Mutex', '\titems  map[string]string', '\tcreated atomic.Int64 // how many POSTs really created something', '}'];
    const c0 = S.codePanel('c0', L0, { x: 180, y: 120, w: 1560, fs: 30, title: 'store.go', t0: B('g1', 0.3), times: L0.map((x, i) => A('g2', 'store', 0) + i * 0.3) }); c0.out(A('g3', 'computes', -0.3));
    const L1 = ['func (s *Store) HandleGet(w http.ResponseWriter, r *http.Request) {', '\ts.mu.Lock(); body, ok := s.items[r.PathValue("id")]; s.mu.Unlock()', '\tif !ok { http.Error(w, "not found", 404); return }', '\ttag := etag(body)', '\tw.Header().Set("ETag", tag)', '\tw.Header().Set("Cache-Control", "max-age=60")', '\tif r.Header.Get("If-None-Match") == tag {', '\t\tw.WriteHeader(304); return // no body', '\t}', '\tjson.NewEncoder(w).Encode(map[string]string{"id": id, "body": body})', '}'];
    const c1 = S.codePanel('c1', L1, { x: 140, y: 110, w: 1640, fs: 27, title: 'HandleGet  ·  SAFE', t0: A('g2', 'handle', -0.3), times: L1.map((x, i) => A('g2', 'handle', 0.2) + i * 0.4) });
    c1.hl(1, A('g2', 'looks', 0)); c1.hl(2, A('g2', 'four', 0)); c1.hl(3, A('g3', 'computes', 0)); c1.hl(6, A('g3', 'equals', 0)); c1.hl(7, A('g3', 'three', 0)); c1.hl(9, A('g3', 'otherwise', 0)); c1.out(A('g4', 'put', -0.3));
    const L2 = ['func (s *Store) HandlePut(w http.ResponseWriter, r *http.Request) {', '\tvar req struct{ Body string }', '\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil { http.Error(w, "bad request", 400); return }', '\ts.mu.Lock(); _, existed := s.items[id]; s.items[id] = req.Body; s.mu.Unlock()', '\tif existed { w.WriteHeader(200) } else { w.WriteHeader(201) }', '}', '', 'func (s *Store) HandleDelete(w http.ResponseWriter, r *http.Request) {', '\ts.mu.Lock(); delete(s.items, id); s.mu.Unlock()', '\tw.WriteHeader(204) // 204 whether or not it existed', '}'];
    const c2 = S.codePanel('c2', L2, { x: 140, y: 110, w: 1640, fs: 26, title: 'HandlePut + HandleDelete  ·  IDEMPOTENT', t0: A('g4', 'put', -0.3), times: L2.map((x, i) => A('g4', 'put', 0.2) + i * 0.35) });
    c2.hl(2, A('g4', 'four', 0)); c2.hl(4, A('g4', 'existed', 0)); c2.hl(9, A('g5', 'two', 0.1)); c2.out(A('g5', 'post', -0.3));
    C('g6', 'POST: a NEW item with a NEW ID every call → a retry = a duplicate → NOT idempotent', 960, 500, '#ff7b7b', 'g5', 'post', 1300, -0.1); C('g7', 'tests prove each property · go test -race ✓', 960, 600, '#3ddc84', 'g5', 'tests', 760, 0);
    S.scope(null);
  });
  kill(sc, B('d1', -0.3), 0.5);

  /* ===== S13: versions ===== */
  blk('l50', 'd1', true, () => {
    P('v1', 'HTTP/1.1', 'plain text · one request at a time per connection · easy to debug by hand', 160, 150, 1600, 120, '#7ee0ff', 'l50', 'one');
    P('v2', 'HTTP/2', 'same methods, status codes, headers · multiplexed binary frames over one TCP connection', 160, 290, 1600, 120, '#3ddc84', 'l50', 'two');
    P('v3', 'HTTP/3', 'same semantics again · over QUIC streams · lossy and mobile networks', 160, 430, 1600, 120, '#c084fc', 'l50', 'three');
    C('vt', 'trap: only the wire format changed · HTTP/2 did NOT add new status codes', 960, 680, '#ff7b7b', 'l51', 'trap', 1000, -0.2);
  });

  /* ===== S14: deep dive ===== */
  blk('d1', 't1', true, () => {
    P('d1a', 'why 422 exists', '400 is any client error · 422 (from WebDAV) separates “understood, but invalid”', 140, 150, 1640, 150, '#ffd166', 'd1', 'four');
    P('d2a', 'why safe methods matter', 'prefetchers · crawlers · CDNs · client retries all treat GET/HEAD/OPTIONS as free · a GET with a side effect breaks them', 140, 330, 1640, 150, '#3ddc84', 'd2', 'safe');
    P('d3a', 'idempotency = end state', 'a 2nd DELETE may return 404 · still idempotent · same response ≠ same state', 140, 510, 1640, 150, '#7ee0ff', 'd3', 'third');
    P('d4a', 'Content-Length vs chunked', 'Content-Length needs the size up front · chunked sends sized pieces + a zero chunk · HTTP/2, 3 use their own framing', 140, 690, 1640, 150, '#c084fc', 'd4', 'content');
  });

  /* ===== S15: trade-offs, failures, monitoring ===== */
  blk('t1', 'q0', true, () => {
    C('to1', 'stateless = per-request context overhead, but any server can answer any request', 960, 120, '#ffb066', 't1', 'statelessness', 1200, -0.2); C('to2', 'repeated text headers (HTTP/1.1) → HPACK in HTTP/2', 960, 195, '#ffb066', 't1', 'repeated', 900, -0.2); C('to3', 'chat / live updates → WebSocket · SSE · long polling', 960, 270, '#ffb066', 't1', 'chat', 800, -0.2);
    P('p1', '403 treated as “please log in”', 'logging in again will not help · the account lacks permission', 140, 360, 1640, 110, '#ff7b7b', 't2', 'four');
    P('p2', 'blind retry of a POST', 'duplicate orders / charges → use an idempotency key', 140, 490, 1640, 110, '#ff9f6b', 't2', 'post', -0.3);
    P('p3', 'a GET with a side effect', '“mark as read on fetch” breaks prefetch, crawling, caching', 140, 620, 1640, 110, '#ffd166', 't3', 'get');
    P('p4', 'session cookie without Secure / HttpOnly', 'stealable over plain HTTP or via script injection', 140, 750, 1640, 110, '#c084fc', 't3', 'cookie');
    C('m1', '👁 status mix by class (rising 5xx = server health · rising 4xx = client/contract)', 960, 920, '#3ddc84', 't4', 'distribution', 1300, -0.2); C('m2', '304 hit rate on cacheable GETs · rate of Connection: close', 960, 990, '#3ddc84', 't4', 'rate', 1000, 0);
  });

  /* ===== S16: interview ===== */
  blk('q0', 's0', true, () => {
    const QA = [['Safe vs idempotent?', 'safe: never changes state (GET, HEAD, OPTIONS) · idempotent: same effect if repeated (PUT, DELETE too)', 'q1', 'one'], ['401 vs 403?', '401: no valid credentials · 403: known identity, not allowed (admin route, normal user)', 'q2', 'two'], ['400 vs 422?', '400: could not be understood (client bug) · 422: understood, fails a business rule (show a message)', 'q3', 'three'], ['Intermittent 502s and 504s?', '504: never answered in time → latency, health · 502: answered invalidly → raw response, crash mid-response', 'q4', 'four'], ['Is PATCH always non-idempotent, PUT always idempotent?', 'no to both: PUT can break the contract · absolute-value PATCH is idempotent in practice', 'q5', 'five'], ['Why both Secure and HttpOnly?', 'Secure: never over plain HTTP · HttpOnly: scripts cannot read it · different attacks', 'q6', 'six'], ['SameSite, Strict vs Lax?', 'stops cross-site cookie sending (CSRF) · Strict also breaks emailed-link logins · Lax allows top-level navigation', 'q7', 'seven']];
    QA.forEach((q, i) => { const y = 80 + i * 140; ui('qa' + i, rect(0, 0, 1640, 124, 'rgba(14,18,30,.95)', { rx: 16, stroke: '#7ee0ff', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 30, '#7ee0ff', { anchor: 'start', dx: 26, dy: 36 }) + T(q[1], 24, '#fff', { anchor: 'start', dx: 26, dy: 86 }), 140, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  });

  /* ===== S17: summary ===== */
  blk('s0', 'rn1', true, () => {
    ui('sh', T('SUMMARY · easy → advanced', 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B('s0', 0));
    const SUM = [['1', 'HTTP = a shared vocabulary · request: method + path + headers + body · response: status + headers + body · stateless', 's1a', '#7ee0ff'], ['2', 'Safe = no state change · idempotent = same end state · GET/HEAD/OPTIONS both · PUT/DELETE idempotent · POST neither', 's1b', '#3ddc84'], ['3', '2xx ok · 3xx redirect · 4xx client · 5xx server · 401 who? · 403 no · 400 malformed · 422 invalid · 409 conflict · 502/503/504', 's1c', '#ffd166'], ['4', 'a few headers do most of the work · ETag + If-None-Match → 304, no body', 's1d', '#22d3ee'], ['5', 'cookies: Secure stops sniffing · HttpOnly stops script theft · SameSite stops forged cross-site requests', 's1e', '#ff7b7b'], ['6', 'keep-alive saves handshakes, not ordering · same semantics in HTTP/1.1, 2, 3 · chunked streams unknown-size bodies', 's1f', '#c084fc'], ['7', 'ask with a method + path · answer with a status code · remember nothing, unless a cookie or token does', 's1g', '#3ddc84']];
    SUM.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1640, 108, 'rgba(14,18,30,.95)', { rx: 18, stroke: r[3], sw: 4 }) + circ(52, 54, 32, r[3]) + T(r[0], 38, '#111', { dx: 52, dy: 54 }) + T(r[1], 24, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 140, 170 + i * 120, {}); pop('sm' + i, B(r[2], 0.1)); });
  });
  blk('rn1', 'e1', true, () => {
    C('rn1a', '📘 notes: HTTP Fundamentals - Methods, Status Codes, Headers, Cookies  +  its Go note', 960, 330, '#7ee0ff', 'rn1', 'open', 1300, 0);
    C('rn1b', '⬅ before: TCP - Handshake, Reliability, Flow and Congestion Control', 960, 410, '#ffd166', 'rn1', 'before', 1300, 0);
    C('rn1c', '➡ after: HTTP-1.1 vs 2 vs 3 · HTTP Caching · REST and HTTP API Design', 960, 490, '#3ddc84', 'rn1', 'after', 1300, 0);
    C('rn1d', '↔ compare: Sessions and Cookies · Idempotency Keys · CORS · CSRF, XSS and Security Headers', 960, 570, '#c084fc', 'rn1', 'compare', 1500, 0);
  });
  cam(B('e1', -0.4), 1.4, 'zoe');
  tw('zoe', B('e1', 0.5), 0.3, { r: -5 }); tw('zoe', B('e1', 0.9), 0.3, { r: 5 }); tw('zoe', B('e1', 1.3), 0.3, { r: 0 });
  ui('endT', T('HTTP Fundamentals', 130, '#fff', { w: 1300 }), 960, 440, {}); ui('endS', T('a method and a path · a status code · no memory', 48, '#cdd6e6', { w: 1100 }), 960, 570, {});
  pop('endT', B('e2', 1.2)); pop('endS', B('e2', 1.8));
})();
