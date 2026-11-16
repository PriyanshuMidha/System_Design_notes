/* HTTP Fundamentals v2: "Lunch Rush at the Forgetful Counter". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  world(3400, { sky: '#12183a', skyMid: '#3a4a7a', skyLow: '#e0a060' });
  bld('bZ', 300, '#a21c5f', "ZOE'S TABLE", '📱'); bld('bG', 1000, '#0f766e', 'GIA · KITCHEN RUNNER', '🛵'); bld('bM', 1750, '#b45309', 'MAX · ORDER COUNTER (server)', '🍽️'); bld('bK', 2500, '#475569', 'THE KITCHEN (backend)', '👩‍🍳');
  const CFG = {
    zoe: { who: 'ZOE', skin: '#c98d5b', shirt: '#ec4899', pants: '#2a2f3a', hair: '#1a1210', hair2: 'long', hold: '📱', blush: 1, w: 92, name: 'Zoe', ring: '#f472b6' },
    max: { who: 'MAX', skin: '#e8b48a', shirt: '#f59e0b', apron: '#fff', hat: 'cap', hatColor: '#b45309', pants: '#444', hold: '🧾', w: 112, name: 'Max', ring: '#fbbf24' },
    gia: { who: 'GIA', skin: '#f1c9a5', shirt: '#14b8a6', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🛵', w: 90, name: 'Gia', ring: '#2dd4bf' },
    pat: { who: 'PAT', skin: '#d9a37a', shirt: '#64748b', pants: '#333', glasses: 1, hair: '#444', hold: '🔍', w: 100, name: 'Pat', ring: '#94a3b8' },
    mal: { who: 'MAL', skin: '#e0ac82', shirt: '#1c1c22', pants: '#1c1c22', mask: 1, hair: '#111', w: 104, name: 'Mal', ring: '#ff5d5d' },
  };
  cast(CFG, { zoe: [380], max: [1770], gia: [1020], pat: [1400, 1, true], mal: [800, 1, true] });
  views({ wide: { x: 1500, y: 470, s: 0.5 }, zoe: { x: 700, y: 520, s: 0.95 }, mid: { x: 1300, y: 500, s: 0.7 }, max: { x: 1800, y: 520, s: 0.95 }, kit: { x: 2300, y: 520, s: 0.8 } });
  camTw(0, 0.001, { x: 1500, y: 470, s: 0.5 });
  const stamp = board('LUNCH RUSH', [['📖', 'methods'], ['🔢', 'codes'], ['🏷️', 'headers'], ['🍪', 'cookies'], ['🔗', 'keep-alive']], 1500, 650, B('l2', 0.5));

  /* S1 */
  blk('l1', 'l7', () => {
    wl('rush', '🕛 lunch rush · 100 customers · 1 clerk who forgets everyone', '#ffd166', 1500, 250, A('l1', 'hundred', -0.2), 70);
    for (let i = 0; i < 30; i++) { em('cu' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 56, 700 + (i % 15) * 40, 790 + Math.floor(i / 15) * 26); pop('cu' + i, A('l1', 'hundred', 0) + i * 0.05); }
    cam(B('l1b', -0.3), 1.8, 'mid');
    ask('rq1', 'GET /orders', '#f472b6', 440, 560, 1760, 560, A('l1b', 'taps', 0), 3.0); ask('rs1', '200 OK + the list', '#3ddc84', 1760, 640, 440, 640, A('l1b', 'answer', 0.3), 3.0);
    [['client: the program that asks', 'client', '#7ee0ff'], ['server: the program that answers', 'server', '#ffd166'], ['request → one message · response → its reply', 'request', '#c084fc']].forEach((w, i) => C('w' + i, w[0], 1100, 150 + i * 70, w[2], 'l2', w[1], 760, 0)); ['w0', 'w1', 'w2'].forEach((i) => hide(i, B('l3', -0.2), 0.4));
    [['header: a Name: value line', 'header', '#ffd166'], ['body: the data itself', 'body', '#3ddc84'], ['status code: 3 digits · 404 = not found', 'status', '#ff9f6b'], ['cookie: a value the browser stores + resends', 'cookie', '#f472b6']].forEach((w, i) => C('x' + i, w[0], 1100, 150 + i * 70, w[2], 'l3', w[1], 800, 0)); ['x0', 'x1', 'x2', 'x3'].forEach((i) => hide(i, B('l4', -0.2), 0.4));
    [['you say what you want → method + path', 'want', '#7ee0ff'], ['you add notes: “no onions” → headers', 'notes', '#ffd166'], ['a tray + a receipt → body + status code', 'tray', '#3ddc84']].forEach((w, i) => C('y' + i, w[0], 1100, 150 + i * 70, w[2], 'l4', w[1], 800, 0)); ['y0', 'y1', 'y2'].forEach((i) => hide(i, B('l5', -0.2), 0.4));
    cam(B('l5', -0.3), 1.4, 'max'); em('fg', '🧠❌', 110, 1770, 480); pop('fg', A('l5', 'forget', -0.2)); C('fgt', 'every time: tell me everything again', 1500, 330, '#ffb066', 'l5', 'time', 560, 0);
    ['fg', 'fgt'].forEach((i) => hide(i, B('l6', -0.2), 0.4));
    C('rm', 'ask with a method + path · answered with a status code · nothing remembered', 1100, 250, '#3ddc84', 'l6', 'remember', 1180, -0.3);
  });

  /* S2 */
  blk('l7', 'l11', () => {
    cam(B('l7', -0.3), 1.6, 'wide');
    ev('b1', 'before HTTP', ['every service invented its own way to ask', 'and its own way to say “found” or “not found”', 'a browser built for one site could not talk to any other ✗'], 330, 90, 1200, '#ff7b7b', [A('l7', 'every', 0), A('l7', 'private', 0), A('l7', 'browser', 0)], B('l8', 0));
    ev('b2', 'HTTP: one shared vocabulary', ['text-readable request / response · RFC 1945 → RFC 9110–9114', 'a 1996 browser and a Go server today agree on GET /index.html ✓'], 330, 90, 1200, '#3ddc84', [A('l8', 'standardised', 0), A('l8', 'nineteen', 0)], B('l9', 0));
    ev('b3', 'POST /orders', ['created → 201', 'rejected → 400', 'server broke → 500', 'no custom error format per backend ✓'], 330, 90, 1000, '#7ee0ff', [A('l9', 'created', 0), A('l9', 'rejected', 0), A('l9', 'broke', 0), A('l9', 'without', 0)], B('l10', 0));
    C('b4', 'a vocabulary every client and server already agree on', 1100, 780, '#c084fc', 'l10', 'vocabulary', 800, -0.2);
  });

  /* S3 */
  blk('l11', 'l16', () => {
    cam(B('l11', -0.3), 1.6, 'mid');
    ev('rq', 'REQUEST · a letter', ['GET /orders/42             ← what + where', 'headers: who · formats · cached copy?', 'body (optional): data to act on'], 90, 90, 900, '#7ee0ff', [A('l11', 'first', 0), A('l11', 'headers', 0), A('l11', 'body', 0)], B('l12', 0));
    ev('rs', 'RESPONSE · a receipt', ['HTTP/1.1 200 OK        ← what happened', 'headers: metadata about the reply', 'body (optional): the result'], 90, 90, 900, '#3ddc84', [A('l12', 'status', 0), A('l12', 'describe', 0), A('l12', 'carries', 0)], B('l13', 0));
    C('sl', 'STATELESS: the clerk has no memory of your last visit', 1100, 780, '#ffd166', 'l13', 'statelessness', 800, -0.1); C('ck', 'persist across requests → a cookie or a token on EVERY request', 1100, 850, '#7ee0ff', 'l13', 'cookie', 880, 0);
    C('mk', '✗ “an open connection means the server remembers me”', 1100, 920, '#ff7b7b', 'l14', 'mistake', 860, -0.2); C('gf', '✓ every request stands alone → any server in a pool can answer', 1100, 990, '#3ddc84', 'l15', 'gift', 1000, -0.2);
  });

  /* S4 */
  blk('l16', 'l19', () => {
    cam(B('l16', -0.3), 1.6, 'mid');
    ev('cu', '$ curl -v http://127.0.0.1:8099/items/1', ['> GET /items/1 HTTP/1.1', '> Host: 127.0.0.1:8099', '> User-Agent: curl/8.7.1', '> Accept: */*', '< HTTP/1.1 200 OK', '< Cache-Control: max-age=60', '< Content-Type: application/json', '< Etag: "2cf24dba5fb0a30e"', '< Content-Length: 26', '{"body":"hello","id":"1"}'], 90, 90, 1300, '#3ddc84', [A('l16', 'get', 0), A('l16', 'host', 0), A('l16', 'user', 0), A('l16', 'accept', 0), A('l17', 'status', 0), A('l17', 'cache', 0), A('l17', 'content', 0), A('l17', 'e', 0), A('l17', 'twenty', 0), A('l17', 'body', 0)], A('l18', 'show', -0.2));
    C('ar', '>  what curl SENT  ·  <  what the server REPLIED', 1100, 780, '#7ee0ff', 'l18', 'greater', 700, 0);
  });

  /* S5: methods, incident one */
  blk('inc1', 'l25', () => {
    cam(B('inc1', -0.3), 1.8, 'mid');
    wl('i1', '🧾 incident 1 · 12:15 · two charges for one lunch', '#ff7b7b', 1300, 250, A('inc1', 'incident', -0.2), 48);
    ask('o1', 'POST /pay  (froze…)', '#f472b6', 440, 560, 1760, 560, A('inc1', 'froze', 0), 2.4); ask('o2', 'POST /pay  (sent AGAIN)', '#f472b6', 440, 640, 1760, 640, A('inc1', 'again', 0), 2.4);
    wl('dbl', '💳💳 double charge ✗', '#ff5d5d', 1760, 420, A('inc1', 'two', 0.3), 54);
    pulse('max', A('l19', 'two', 0));
    ev('sf', 'two promises behind every method', ['SAFE = never changes server state → a crawler / prefetcher / back button can call it freely', 'IDEMPOTENT = N calls leave the same state as one call'], 90, 90, 1400, '#7ee0ff', [A('l19', 'safe', 0), A('l19', 'idempotent', 0)], B('l20', 0));
    walk('pat', B('l20', 0), 0.3, 1400); tw('pat', B('l20', -0.5), 0.3, { o: 1 }); tw('nm_pat', B('l20', -0.5), 0.3, { o: 1 }); wl('pt', '🔍 Pat: only GET / HEAD / OPTIONS · visits thousands of pages · changes nothing', '#94a3b8', 1400, 330, A('l20', 'crawler', 0), 30);
    ev('mt', 'the methods', ['GET HEAD OPTIONS   safe ✓ · idempotent ✓', 'PUT  DELETE        safe ✗ · idempotent ✓  (replace / remove)', 'POST               safe ✗ · idempotent ✗  (a retry can DUPLICATE)', 'PATCH              usually ✗ idempotent'], 90, 90, 1400, '#ffd166', [A('l21', 'get', 0), A('l21', 'put', 0), A('l21', 'post', 0), A('l21', 'patch', 0)], B('l22', 0));
    ev('tp', 'the PATCH trap', ['PATCH {"status":"shipped"}   ✓ repeat-safe', 'PATCH {"$inc": {"stock": -1}} ✗ runs twice, removes two', 'the OPERATION decides, not the method name'], 90, 90, 1400, '#ffb066', [A('l22', 'harmless', 0), A('l22', 'relative', 0), A('l22', 'meaning', 0)], B('l23', 0));
    ev('rp', '✗ idempotent ≠ the same response', ['a 2nd DELETE may return 404 instead of 204', 'the END STATE (“gone”) is the same ✓'], 90, 90, 1400, '#ff9f6b', [A('l23', 'delete', 0), A('l23', 'end', 0)], B('l24', 0));
    ev('ik', 'the fix for incident 1', ['retry-safe payments / orders need an explicit IDEMPOTENCY KEY', 'the method alone is not enough ✓'], 90, 90, 1400, '#c084fc', [A('l24', 'key', 0), A('l24', 'alone', 0)], End('l24', 0.4));
    stamp(0, A('l24', 'alone', 0.5), true, ' ');
  });

  /* S6: status codes, incident two */
  blk('inc2', 'l33', () => {
    cam(B('inc2', -0.3), 1.8, 'max');
    wl('i2', '🧾 incident 2 · 12:45 · everyone got a different NUMBER', '#ffb066', 1800, 250, A('inc2', 'incident', -0.2), 48);
    ['404', '403', '400', '504'].forEach((c, i) => { bubble('cd' + i, c, '#ffb066', 1300 + i * 160, 600, {}); pop('cd' + i, A('inc2', ['found', 'allowed', 'bad', 'kitchen'][i], 0)); });
    ['cd0', 'cd1', 'cd2', 'cd3'].forEach((i) => hide(i, B('l25', 0.4), 0.4));
    ev('fa', 'five families (first digit)', ['2xx success · 3xx redirect / not modified', '4xx the CLIENT did wrong · 5xx the SERVER broke', 'the family tells you WHO should act next'], 90, 90, 1300, '#7ee0ff', [A('l25', 'success', 0), A('l25', 'client', 0), A('l25', 'family', 0)], B('l26', 0));
    ev('c4', '401 vs 403', ['401 Unauthorized: not authenticated · missing / invalid credentials → “log in”', '403 Forbidden: authenticated but not allowed → “I know you, still no”'], 90, 90, 1500, '#ffd166', [A('l26', 'four', 0), A('l26', 'three', 0.2)], B('l27', 0));
    C('nb', '✗ not “logged in or not”: a valid user on an admin route gets 403', 1100, 780, '#ff7b7b', 'l27', 'perfectly', 800, -0.2);
    ev('c5', '400 · 422 · 409', ['400 Bad Request: malformed JSON / wrong type / missing field', '422 Unprocessable: understood, but fails a business rule', '409 Conflict: about STATE (version mismatch, duplicate key)'], 90, 90, 1500, '#ffb066', [A('l28', 'hundred', 0), A('l28', 'twenty', 0), A('l29', 'conflict', 0)], B('l30', 0));
    walk('gia', B('l30', 0), 0.3, 1020); pulse('gia', A('l30', 'gia', 0));
    ev('g5', 'Gia reports trouble from the kitchen', ['502 Bad Gateway: the upstream answered, but invalidly', '503 Service Unavailable: overloaded / maintenance · often Retry-After', '504 Gateway Timeout: no reply in time, at all'], 90, 90, 1500, '#2dd4bf', [A('l31', 'bad', 0), A('l31', 'unavailable', 0), A('l31', 'timeout', 0)], B('l32', 0));
    C('rm2', '401 = “I don’t know who you are” · 403 = “I know exactly who you are, still no”', 1100, 780, '#3ddc84', 'l32', 'remember', 1100, -0.2);
    stamp(1, A('l32', 'still', 0.5), true, ' ');
  });

  /* S7: headers */
  blk('l33', 'l36', () => {
    cam(B('l33', -0.3), 1.6, 'max');
    const H8 = [['Host', 'which domain · mandatory since HTTP/1.1'], ['Content-Type', 'media type of the body · application/json'], ['Content-Length', 'body size in bytes · where the body ends'], ['Authorization', 'credentials · Bearer <token> · Basic'], ['Cache-Control', 'max-age · no-store · must-revalidate'], ['ETag / If-None-Match', 'a content fingerprint · a conditional request'], ['Set-Cookie / Cookie', 'store this value · send it back'], ['Connection', 'keep-alive or close']];
    ev('h1', 'notes on the tray: headers', H8.slice(0, 4).map((h) => h[0].padEnd(18) + h[1]), 90, 90, 1400, '#7ee0ff', [A('l34', 'host', 0), A('l34', 'content type', 0), A('l34', 'content length', 0), A('l34', 'authorization', 0)], B('l35', 0));
    ev('h2', 'notes on the tray: headers', H8.slice(4).map((h) => h[0].padEnd(20) + h[1]), 90, 90, 1400, '#ffd166', [A('l35', 'cache control', 0), A('l35', 'e tag', 0), A('l35', 'set cookie', 0), A('l35', 'connection', 0)], End('l35', 0.4));
    stamp(2, A('l35', 'connection', 0.5), true, ' ');
  });

  /* S8: conditional requests */
  blk('l36', 'l39', () => {
    cam(B('l36', -0.3), 1.6, 'mid');
    wl('tag', 'ETag: a hash of the content', '#22d3ee', 1760, 430, A('l36', 'tags', 0), 38);
    ask('c1', 'GET + If-None-Match: "2cf24dba…"', '#22d3ee', 440, 580, 1740, 580, A('l36', 'sends', -0.2), 2.6); ask('c2', '304 Not Modified · no body', '#3ddc84', 1760, 660, 440, 660, B('l37', 0.4), 2.6);
    C('kb', 'full 2 KB the first time · a few bytes of headers after', 1100, 250, '#ffd166', 'l38', 'kilobyte', 800, 0); C('wk', '304 = caching WORKING, not failing', 1100, 330, '#3ddc84', 'l38', 'working', 600, 0);
  });

  /* S9: cookies, incident three */
  blk('inc3', 'l44', () => {
    cam(B('inc3', -0.3), 1.8, 'wide');
    wl('i3', '🧾 incident 3 · 1:30 · a thief near the door', '#ff7b7b', 1500, 250, A('inc3', 'incident', -0.2), 70);
    tw('mal', B('inc3', 0.2), 0.3, { o: 1 }); tw('nm_mal', B('inc3', 0.2), 0.3, { o: 1 }); walk('mal', B('inc3', 0.5), 4.0, 560);
    em('wb', '🏷️', 70, 440, 600); wl('wbl', 'wristband = a cookie', '#f472b6', 440, 700, A('inc3', 'wristband', 0), 36); pop('wb', A('inc3', 'wristband', 0));
    fly('wb', A('inc3b', 'borrow', 0), [[440, 600], [560, 620]], 1.0, { arc: 40 });
    wl('ml', '😈 Mal orders as Zoe', '#ff5d5d', 700, 430, A('inc3b', 'borrow', 0.5), 40);
    cam(B('l39', -0.2), 1.6, 'zoe');
    ev('ca', 'cookie attributes: how exposed is it?', ['Secure       only over HTTPS → blocks sniffing on plain HTTP', 'HttpOnly     not readable from JavaScript → blunts XSS theft', 'SameSite     not sent on cross-site requests → blunts CSRF', 'Domain       which hosts · too broad leaks to other subdomains', 'Path         scope to /admin, not the whole site'], 90, 90, 1500, '#f472b6', [A('l40', 'secure', 0), A('l40', 'http only', 0), A('l41', 'same site', 0), A('l41', 'domain', 0), A('l41', 'path', 0)], B('l42', 0));
    ev('gd', 'a well-set session cookie', ['Set-Cookie: session=…; Secure; HttpOnly; SameSite=Strict; Path=/', 'HTTPS only · invisible to scripts · never attached to a cross-site request ✓'], 90, 90, 1500, '#3ddc84', [A('l42', 'secure', 0), A('l42', 'invisible', 0)], B('l43', 0));
    C('bd', '✗ only HttpOnly = not safe · THREE attributes block THREE different attacks', 1100, 780, '#ff7b7b', 'l43', 'mistake', 1000, -0.2);
    tw('mal', B('l43', -0.5), 0.4, { o: 0 }); tw('nm_mal', B('l43', -0.5), 0.4, { o: 0 });
    stamp(3, A('l43', 'attacks', 0.5), true, ' ');
  });

  /* S10: keep-alive */
  blk('l44', 'l46', () => {
    cam(B('l44', -0.3), 1.6, 'mid');
    ev('k0', 'HTTP/1.0 vs HTTP/1.1', ['1.0: a fresh TCP connection for EVERY request', '1.1 keep-alive: one connection reused · no new TCP (or TLS) handshake each time'], 90, 90, 1400, '#7ee0ff', [A('l44', 'oh', 0), A('l44', 'defaults', 0)], B('l45', 0));
    ev('k1', 'but it saves HANDSHAKES, not ORDERING', ['one answer at a time per connection (head-of-line blocking)', 'browsers open several connections · HTTP/2 multiplexing fixes it'], 90, 90, 1400, '#ffb066', [A('l45', 'ordering', 0), A('l45', 'browsers', 0)], End('l45', 0.4));
    line('ka', 440, 700, 1760, 700, '#3ddc84', 12); draw('ka', B('l44', 0.5), 1.0); for (let i = 0; i < 3; i++) { em('kq' + i, '✉️', 50, 0, 0); fly('kq' + i, B('l44', 1.8) + i * 1.2, [[440, 680], [1760, 680]], 1.0, {}); hide('kq' + i, B('l44', 2.8) + i * 1.2, 0.2); }
    stamp(4, A('l45', 'saves', 0.5), true, ' ');
  });

  /* S11: a PUT sent twice */
  blk('l46', 'g1', () => {
    cam(B('l46', -0.3), 1.6, 'max');
    ev('w', 'PUT /items/42 {"Body":"v1"}, sent twice', ['1  store has no 42        items = { }', '2  handler writes it         items = { "42": "v1" }  → 201 Created', '3  the same PUT again (a retry)   items = { "42": "v1" }  unchanged', '4  → 200 OK this time (it already existed)', 'responses differ · the stored STATE is identical = idempotent ✓'], 90, 90, 1500, '#3ddc84', [A('l46', 'first', 0), A('l47', 'writes', 0), A('l48', 'same', 0), A('l48', 'responds', 0), A('l49', 'responses', 0)], End('l49', 0.4));
  });

  /* S12: Go code */
  blk('g1', 'l50', () => {
    cam(B('g1', -0.3), 1.6, 'max');
    const L1 = ['func (s *Store) HandleGet(w http.ResponseWriter, r *http.Request) {', '\ts.mu.Lock(); body, ok := s.items[r.PathValue("id")]; s.mu.Unlock()', '\tif !ok { http.Error(w, "not found", 404); return }', '\ttag := etag(body)', '\tw.Header().Set("ETag", tag)', '\tw.Header().Set("Cache-Control", "max-age=60")', '\tif r.Header.Get("If-None-Match") == tag {', '\t\tw.WriteHeader(304); return // no body', '\t}', '\tjson.NewEncoder(w).Encode(map[string]string{"id": id, "body": body})', '}'];
    const c1 = S.codePanel('c1', L1, { x: 140, y: 100, w: 1640, fs: 27, title: 'HandleGet  ·  SAFE', t0: A('g2', 'handle', -0.3), times: L1.map((x, i) => A('g2', 'handle', 0.2) + i * 0.4) });
    c1.hl(1, A('g2', 'looks', 0)); c1.hl(2, A('g2', 'four', 0)); c1.hl(3, A('g3', 'computes', 0)); c1.hl(6, A('g3', 'equals', 0)); c1.hl(7, A('g3', 'three', 0)); c1.out(A('g4', 'put', -0.3));
    const L2 = ['func (s *Store) HandlePut(w http.ResponseWriter, r *http.Request) {', '\tvar req struct{ Body string }', '\tif err := json.NewDecoder(r.Body).Decode(&req); err != nil { http.Error(w, "bad request", 400); return }', '\ts.mu.Lock(); _, existed := s.items[id]; s.items[id] = req.Body; s.mu.Unlock()', '\tif existed { w.WriteHeader(200) } else { w.WriteHeader(201) }', '}', '', 'func (s *Store) HandleDelete(w http.ResponseWriter, r *http.Request) {', '\ts.mu.Lock(); delete(s.items, id); s.mu.Unlock()', '\tw.WriteHeader(204) // 204 whether or not it existed', '}'];
    const c2 = S.codePanel('c2', L2, { x: 140, y: 100, w: 1640, fs: 26, title: 'HandlePut + HandleDelete  ·  IDEMPOTENT', t0: A('g4', 'put', -0.3), times: L2.map((x, i) => A('g4', 'put', 0.2) + i * 0.35) });
    c2.hl(2, A('g4', 'four', 0)); c2.hl(4, A('g4', 'existed', 0)); c2.hl(9, A('g5', 'two', 0.1)); c2.out(A('g5', 'post', -0.3));
    C('g6', 'POST: a NEW item with a NEW ID every call → a retry = a duplicate → NOT idempotent (incident 1!)', 960, 500, '#ff7b7b', 'g5', 'post', 1400, -0.1); C('g7', 'tests prove each property · go test -race ✓', 960, 600, '#3ddc84', 'g5', 'tests', 760, 0);
  });

  /* S13: versions */
  blk('l50', 'd1', () => {
    cam(B('l50', -0.3), 1.6, 'wide');
    ev('v', 'new counters, same menu', ['HTTP/1.1  plain text · one request at a time per connection · easy to debug', 'HTTP/2    same methods, codes, headers · multiplexed binary frames over ONE TCP connection', 'HTTP/3    same semantics again · over QUIC streams · lossy / mobile networks', 'trap: only the wire format changed · HTTP/2 did NOT add new status codes ✗'], 90, 90, 1500, '#7ee0ff', [A('l50', 'one', 0), A('l50', 'two', 0), A('l50', 'three', 0), A('l51', 'trap', 0)], End('l51', 0.4));
  });

  /* S14: deep dive */
  blk('d1', 'inc4', () => {
    cam(B('d1', -0.3), 1.6, 'mid');
    ev('d1', 'why 422 exists', ['400 is any client error · 422 (from WebDAV) separates “understood, but invalid”'], 90, 90, 1500, '#ffd166', [A('d1', 'four', 0)], B('d2', 0));
    ev('d2', 'why safe methods matter', ['prefetchers · crawlers · CDNs · client retries treat GET/HEAD/OPTIONS as free', 'a GET with a side effect breaks all of them ✗'], 90, 90, 1500, '#3ddc84', [A('d2', 'safe', 0), A('d2', 'get', 0.5)], B('d3', 0));
    ev('d3', 'idempotency = END STATE', ['a 2nd DELETE may return 404 · still idempotent', 'same response ≠ same state'], 90, 90, 1500, '#7ee0ff', [A('d3', 'second', 0), A('d3', 'confusing', 0)], B('d4', 0));
    ev('d4', 'Content-Length vs chunked', ['Content-Length needs the size up front → fails for a streamed export', 'chunked: sized pieces + a zero chunk · HTTP/2, 3 use their own framing'], 90, 90, 1500, '#c084fc', [A('d4', 'content', 0), A('d4', 'chunked', 0)], End('d4', 0.4));
  });

  /* S15: trade-offs, failures, monitoring */
  blk('inc4', 'q0', () => {
    cam(B('inc4', -0.3), 1.6, 'mid');
    ev('t1', 'trade-offs', ['stateless = per-request context overhead, but any server can answer any request', 'repeated text headers (HTTP/1.1) → HPACK in HTTP/2', 'chat / live updates → WebSocket · SSE · long polling'], 90, 90, 1500, '#ffb066', [A('t1', 'statelessness', 0), A('t1', 'repeated', 0), A('t1', 'chat', 0)], B('t2', 0));
    ev('fl', 'production failures', ['403 treated as “please log in” → logging in again will not help', 'blind retry of a POST → duplicate orders → use an idempotency key', 'a GET with a side effect → breaks prefetch, crawling, caching', 'a session cookie without Secure / HttpOnly → stealable'], 90, 90, 1500, '#ff7b7b', [A('t2', 'four', 0), A('t2', 'post', 0), A('t3', 'get', 0), A('t3', 'cookie', 0)], B('t4', 0));
    ev('mo', 'what to monitor', ['status mix by class (rising 5xx = server health · rising 4xx = client / contract)', '304 hit rate on cacheable GETs · rate of Connection: close'], 90, 90, 1500, '#3ddc84', [A('t4', 'distribution', 0), A('t4', 'rate', 0)], End('t4', 0.4));
  });

  /* S16: interview */
  blk('q0', 'fin0', () => {
    qa([['Safe vs idempotent?', 'safe: never changes state (GET, HEAD, OPTIONS) · idempotent: same effect if repeated (PUT, DELETE too)', 'q1', 'one'], ['401 vs 403?', '401: no valid credentials · 403: known identity, not allowed (admin route, normal user)', 'q2', 'two'], ['400 vs 422?', '400: could not be understood (client bug) · 422: understood, fails a business rule', 'q3', 'three'], ['Intermittent 502s and 504s?', '504: never answered in time → latency · 502: answered invalidly → raw response, crash mid-response', 'q4', 'four'], ['Is PATCH always non-idempotent, PUT always idempotent?', 'no to both: PUT can break the contract · absolute-value PATCH is idempotent in practice', 'q5', 'five'], ['Why both Secure and HttpOnly?', 'Secure: never over plain HTTP · HttpOnly: scripts cannot read it · different attacks', 'q6', 'six'], ['SameSite, Strict vs Lax?', 'stops cross-site cookie sending (CSRF) · Strict also breaks emailed-link logins · Lax allows top-level navigation', 'q7', 'seven']], '#f472b6');
  });

  /* S17: the rush ends, summary, next */
  blk('fin0', 's0', () => {
    cam(B('fin0', -0.3), 2.0, 'wide');
    ev('fin', '🕑 2:00 PM · the rush is over', ['100 customers served', 'no mixed-up order · no double charge ✓'], 330, 90, 800, '#3ddc84', [A('fin0', 'hundred', 0), A('fin0', 'double', 0)], End('fin0', 0.5));
  });
  blk('s0', 'rn1', () => {
    summary('LUNCH RUSH · SUMMARY', [['HTTP = a shared vocabulary · request: method + path + headers + body · response: status + headers + body · stateless', 's1a', '#7ee0ff'], ['safe = no state change · idempotent = same end state · GET/HEAD/OPTIONS both · PUT/DELETE idempotent · POST neither', 's1b', '#3ddc84'], ['2xx ok · 3xx redirect · 4xx client · 5xx server · 401 who? · 403 no · 400 · 422 · 409 · 502/503/504', 's1c', '#ffd166'], ['a few headers do most of the work · ETag + If-None-Match → 304, no body', 's1d', '#22d3ee'], ['cookies: Secure stops sniffing · HttpOnly stops script theft · SameSite stops forged requests', 's1e', '#ff7b7b'], ['keep-alive saves handshakes, not ordering · same semantics in HTTP/1.1, 2, 3', 's1f', '#c084fc'], ['ask with a method + path · answer with a status code · remember nothing, unless a cookie or token does', 's1g', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 notes: HTTP Fundamentals - Methods, Status Codes, Headers, Cookies  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: TCP - Handshake, Reliability, Flow and Congestion Control', 'before', '#ffd166'], ['➡ after: HTTP-1.1 vs 2 vs 3 · HTTP Caching · REST and HTTP API Design', 'after', '#3ddc84'], ['↔ compare: Sessions and Cookies · Idempotency Keys · CORS · CSRF, XSS and Security Headers', 'compare', '#c084fc']]); });
  cam(B('e1', -0.4), 1.4, 'zoe'); wave('zoe', B('e1', 0.5));
  endTitle('HTTP Fundamentals', 'a method and a path · a status code · no memory', 'e2');
})();
