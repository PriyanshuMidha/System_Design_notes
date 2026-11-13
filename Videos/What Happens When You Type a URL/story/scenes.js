/* What Happens When You Type a URL: "The Sixty Second Sale". Written against story_engine.js + story_lib.js. */
(function () {
  const { A, B, End, GY, ui, wd, em, chip, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, hide, ring, mk, rect } = H;
  const HID = (ids, t) => ids.forEach((i) => hide(i, t, 0.4));
  // a stack of chips: rows = [text, line, phrase, colour, offset?]
  const stack = (pre, rows, x, y0, dy, w) => { const ids = rows.map((r, i) => { C(pre + i, r[0], x, y0 + i * dy, r[3], r[1], r[2], w || 800, r[4] === undefined ? -0.1 : r[4]); return pre + i; }); return ids; };

  world(6400);
  mk('sea', rect(3560, 800, 760, 130, '#1e40af') + rect(3560, 800, 760, 12, '#60a5fa'), { keep: true });
  bld('bHome', 300, '#1e3a5f', 'BROWSER HOME', '🌐'); bld('bDir', 1000, '#92400e', 'D N S DIRECTORY · DEV', '📖'); bld('bGate', 1700, '#0f766e', 'T C P GATE · TARA', '🚪');
  bld('bVault', 2400, '#6d28d9', 'T L S VAULT · TILLY', '🔐'); bld('bEdge', 3200, '#b45309', 'C D N BRANCH · EDGAR', '🏬');
  bld('bProxy', 4520, '#475569', 'PROXY · ROY', '🔀'); bld('bApp', 5170, '#1d4ed8', 'APP · ANVI', '🍳'); bld('bDb', 5820, '#15803d', 'DATABASE · DARA', '🗄️');
  const CFG = {
    pia: { who: 'PIA', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '📦', w: 96, name: 'Pia', ring: '#38bdf8' },
    raj: { who: 'RAJ', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Raj', ring: '#4ade80' },
    dev: { who: 'DEV', skin: '#e3b08a', shirt: '#92400e', pants: '#333', glasses: 1, hair: '#8a8a8a', tie: '#fbbf24', hold: '📖', w: 108, name: 'Dev', ring: '#fbbf24' },
    tara: { who: 'TARA', skin: '#f1c9a5', shirt: '#0d9488', pants: '#2a2540', hat: 'cap', hatColor: '#115e59', hair2: 'long', hold: '🚧', w: 94, name: 'Tara', ring: '#2dd4bf' },
    tilly: { who: 'TILLY', skin: '#f0c4a0', shirt: '#7c3aed', pants: '#2a2540', glasses: 1, hair: '#7a3b1a', hair2: 'long', hold: '🔑', blush: 1, w: 90, name: 'Tilly', ring: '#a78bfa' },
    edgar: { who: 'EDGAR', skin: '#d9a37a', shirt: '#dc2626', pants: '#333', hat: 'cap', hatColor: '#991b1b', hold: '🏷️', w: 106, name: 'Edgar', ring: '#f87171' },
    roy: { who: 'ROY', skin: '#9b6a47', shirt: '#ca8a04', pants: '#444', hat: 'cap', hatColor: '#f59e0b', hold: '☎️', w: 112, name: 'Roy', ring: '#f59e0b' },
    anvi: { who: 'ANVI', skin: '#e0ac82', shirt: '#2563eb', pants: '#1e3a8a', hair: '#3a2a1a', hair2: 'long', hold: '🍳', w: 98, name: 'Anvi', ring: '#60a5fa' },
    dara: { who: 'DARA', skin: '#e8b48a', shirt: '#475569', pants: '#222', glasses: 1, hair: '#222', hold: '🗂️', w: 100, name: 'Dara', ring: '#94a3b8' },
  };
  cast(CFG, { pia: [380], raj: [270], dev: [1020], tara: [1720], tilly: [2420], edgar: [3220], roy: [4520], anvi: [5170], dara: [5820] });
  views({ home: { x: 520, y: 520, s: 0.9 }, dir: { x: 1000, y: 520, s: 0.95 }, gate: { x: 1700, y: 520, s: 0.95 }, vault: { x: 2400, y: 520, s: 0.95 }, edge: { x: 3200, y: 520, s: 0.95 }, sea: { x: 3950, y: 520, s: 0.6 }, proxy: { x: 4520, y: 520, s: 0.95 }, app: { x: 5170, y: 520, s: 0.95 }, db: { x: 5800, y: 520, s: 0.95 } });
  camTw(0, 0.001, { x: 520, y: 520, s: 0.9 });
  const stamp = board('THE JOURNEY', [['💾', 'Cache'], ['📖', 'DNS'], ['🚪', 'TCP'], ['🔐', 'TLS'], ['🏬', 'CDN'], ['🔀', 'Proxy'], ['🍳', 'App'], ['🗄️', 'DB'], ['🎨', 'Render']], 1515, 30, B('l8', 0));

  /* ===== S1: the sixty second sale ===== */
  blk('l1', 'l9', () => {
    wl('clk', '⏱️ SALE ENDS IN 60 s', '#ff7b7b', 420, 330, A('l1', 'sixty', -0.2), 44);
    ring('rg', 1250, 270, 90, '#ff5d5d', '60 s', A('l1', 'sixty', 0), 40);
    C('mira', '🛍️ Mira · Mumbai · taps checkout', 1000, 420, '#7ee0ff', 'l1', 'mira', 760, -0.1);
    HID(['clk', 'mira'], A('l2', 'request', 0));
    walk('raj', B('l2', 0.5), 1.8, 520);
    C('req', '📦 the request: GET /cart · shop.example.com', 1000, 330, '#ffd166', 'l2', 'cart', 860, -0.2);
    C('rq', '“it is just an address, what is there to carry?”', 1000, 420, '#4ade80', 'l3', 'carry', 860, -0.2);
    HID(['req', 'rq', 'rg'], B('l4', 0.2));
    C('c9', '9 steps between Enter and the page', 800, 250, '#3ddc84', 'l4', 'nine', 760, -0.2);
    C('cold', '🥶 cold first visit: 300–800 ms', 800, 330, '#ff9f6b', 'l4', 'three', 760, -0.1);
    C('warm', '🔥 warm visit: under 50 ms', 800, 410, '#3ddc84', 'l4', 'warm', 760, -0.1);
    HID(['c9', 'cold', 'warm'], B('l5', -0.3));
    const W5 = stack('w5', [['URL · the full address of a page', 'l5', 'u r l', '#7ee0ff'], ['IP address · the numeric address machines use', 'l5', 'i p', '#ff9f6b'], ['DNS · phone book: name in, IP out', 'l5', 'd n s', '#fbbf24'], ['cache · a saved copy, so work is not repeated', 'l5', 'cache', '#3ddc84'], ['round trip (RTT) · there and back · Mumbai ↔ US east ≈ 220 ms', 'l5', 'round', '#c084fc', 0]], 780, 140, 62, 1000);
    const W6 = stack('w6', [['TCP · a reliable connection', 'l6', 't c p', '#2dd4bf'], ['TLS · encrypts it: the S in HTTPS', 'l6', 't l s', '#a78bfa'], ['CDN edge · a nearby server keeping copies', 'l6', 'c d n', '#f59e0b'], ['reverse proxy · front door of the origin', 'l6', 'reverse', '#94a3b8']], 780, 450, 62, 1000);
    HID(W5.concat(W6), B('l7', -0.3));
    const AN = stack('an', [['📖 look up the number', 'l7', 'look', '#fbbf24'], ['📞 dial', 'l7', 'dial', '#2dd4bf'], ['🔐 agree a code word', 'l7', 'code', '#a78bfa'], ['🏬 ask · the local branch may answer', 'l7', 'ask', '#f59e0b']], 780, 160, 66, 860);
    HID(AN, B('l8', -0.2));
    C('nine', 'nine boxes · one request · left to right', 780, 170, '#ffd166', 'l8', 'nine', 860, -0.2);
    C('tick', 'the board ticks each one off →', 780, 250, '#38bdf8', 'l8', 'board', 860, -0.1);
  });

  /* ===== S2: why this chain exists ===== */
  blk('l9', 'l16', () => {
    const SYS = [['🌐 browser cache', 'browser', 300, 150], ['📖 DNS resolver', 'd n s', 700, 150], ['🏬 CDN', 'c d n', 1100, 150], ['🔀 reverse proxy', 'reverse', 300, 230], ['🍳 app server', 'app', 700, 230], ['🗄️ database', 'database', 1100, 230]];
    SYS.forEach((s, i) => C('sy' + i, s[0], s[2], s[3], ['#7ee0ff', '#fbbf24', '#f59e0b', '#94a3b8', '#60a5fa', '#3ddc84'][i], 'l9', s[1], 340, -0.1));
    C('six', 'six systems · six owners · one page', 700, 320, '#ffd166', 'l9', 'six', 800, -0.1);
    HID(['sy0', 'sy1', 'sy2', 'sy3', 'sy4', 'sy5', 'six'], B('l10', -0.2));
    const NC = stack('nc', [['DNS promises: name → address, nothing else', 'l10', 'name', '#fbbf24'], ['TCP promises: bytes, reliably, nothing else', 'l10', 'bytes', '#2dd4bf'], ['TLS promises: secrecy, nothing else', 'l10', 'secrecy', '#a78bfa']], 700, 160, 70, 860);
    HID(NC, B('l11', -0.2));
    ev('sl', 'slow  vs  named', ['“the page is slow”  →  no idea where to look  ✗', '“TLS to origin adds 180 ms because the CDN cache is missing”  →  fix that box  ✓'], 100, 90, 1400, '#38bdf8', [A('l11', 'slow', 0), A('l11', 'second', 0)], B('l12', -0.2));
    ev('sc', 'THE SCENARIO, used all through the story', ['Mira · Mumbai · GET https://shop.example.com/cart', 'browser cache: cold', 'TLS session: cold', 'CDN cache: cold for this URL (it is personal)', 'origin + database: us-east-1 · 220 ms away', 'CDN edge: Mumbai ✓'], 100, 90, 1300, '#7ee0ff', [A('l12', 'mira', 0), A('l12', 'browser', 0), A('l12', 't l s', 0), A('l12', 'personal', 0), A('l12', 'origin', 0), A('l12', 'edge', 0)], B('l13', -0.2));
    const MM = stack('mm', [['📓 check your own notebook', 'l13', 'notebook', '#7ee0ff'], ['📞 call directory assistance once', 'l13', 'directory', '#fbbf24'], ['📟 dial and wait for pickup', 'l13', 'dial', '#2dd4bf'], ['🔐 agree a code word', 'l13', 'code', '#a78bfa'], ['🏬 ask the local branch', 'l13', 'branch', '#f59e0b'], ['☎️ the operator connects a department', 'l13', 'operator', '#94a3b8'], ['🗄️ the filing cabinet', 'l13', 'cabinet', '#3ddc84']], 700, 130, 60, 800);
    HID(MM, B('l14', -0.2));
    C('brk1', '⚠ a phone call = ONE conversation', 700, 170, '#ff9f6b', 'l14', 'breaks', 760, -0.1);
    C('brk2', 'our chain = SEVERAL separate exchanges', 700, 250, '#ff9f6b', 'l14', 'several', 800, -0.1);
    C('brk3', 'each one skippable if its own cache has the answer', 700, 330, '#3ddc84', 'l14', 'skipped', 900, -0.1);
    C('r15', 'look-up step = a cache · ring-and-pick-up step = a handshake = one round trip', 800, 240, '#4ade80', 'l15', 'cache', 1300, -0.2);
  });

  /* ===== S3: the notebook and the directory ===== */
  blk('l16', 'l22', () => {
    ev('bc', '1 · the notebook (in-process, no network)', ['HTTP cache: do I have this exact response saved?', 'DNS cache: do I know this host\'s IP?', 'both are local lookups · no round trip · no handshake'], 150, 90, 1200, '#7ee0ff', [A('l16', 'saved', 0), A('l16', 'host', 0), A('l16', 'handshake', 0)], B('l17', 0));
    ev('cm', 'GET /cart · Cache-Control: private, no-store', ['browser cache: MISS, found out in < 1 ms  ✗', 'DNS cache: shop.example.com never looked up this session  ✗', '→ off to the directory'], 150, 90, 1250, '#ff9f6b', [A('l17', 'guaranteed', 0), A('l17', 'another', 0), A('l17', 'directory', 0)], End('l17', 1.0));
    stamp(0, End('l17', 0.2), true, 'miss');
    walk('pia', End('l17', -1.5), 2.6, 930); walk('raj', End('l17', -1.3), 2.6, 840); cam(End('l17', -1.8), 2.6, 'dir');
    ask('q1', 'shop.example.com ?', '#38bdf8', 940, 620, 1010, 620, B('l18', 3.0), 1.0);
    ev('dv', '2 · the directory chain (cold)', ['OS stub cache → miss', 'recursive resolver: cache → miss', 'authoritative server: shop.example.com ?'], 150, 90, 1000, '#fbbf24', [A('l18', 'operating', 0), A('l18', 'recursive', 0), A('l18', 'authoritative', 0)], B('l19', 0));
    ev('an', 'the answer', ['shop.example.com  →  93.184.215.14  (A / AAAA record + a TTL)', 'resolver caches it for the TTL, hands it to the browser', 'cold: 20–120 ms · warm: < 1 ms  ✓'], 150, 90, 1250, '#3ddc84', [A('l19', 'record', 0), A('l19', 'resolver', 0), A('l19', 'cold', 0)], B('l20', 0));
    card(A('l19', 't t l', -0.2), 'TTL', 'how long the answer stays cached', { color: '#fbbf24', slot: 1 });
    stamp(1, End('l19', 0.3), true, 'ok');
    C('w1', 'a cold DNS lookup: a delay faster code cannot fix', 800, 200, '#ff9f6b', 'l20', 'cannot', 860, -0.2);
    C('w2', 'the only levers: the record\'s TTL · may the client cache?', 800, 280, '#3ddc84', 'l20', 'levers', 860, -0.2);
    C('m1', '⚠ mistake: “the answer is good for the whole session”', 800, 200, '#ff7b7b', 'l21', 'session', 860, -0.2);
    C('m2', 'good only until the TTL expires', 800, 280, '#ffd166', 'l21', 'expires', 760, -0.2);
    C('m3', 'a resolver ignoring a short TTL serves a STALE IP', 800, 360, '#ff7b7b', 'l21', 'stale', 860, -0.2);
  });

  /* ===== S4: the gate and the vault ===== */
  blk('l22', 'l31', () => {
    walk('pia', B('l22', 0.5), 3.0, 1620); walk('raj', B('l22', 0.7), 3.0, 1530); cam(B('l22', 0.3), 2.8, 'gate');
    ask('sy', 'SYN', '#38bdf8', 1600, 620, 1700, 620, A('l23', 'syn', 0), 0.9);
    ask('sa', 'SYN-ACK', '#2dd4bf', 1700, 580, 1600, 580, A('l23', 'answers', 0), 0.9);
    ask('ac', 'ACK', '#38bdf8', 1600, 620, 1700, 620, A('l23', 'done', -1.0), 0.9);
    ev('h1', 'TCP handshake · 1 round trip', ['browser → SYN', 'edge    → SYN-ACK', 'browser → ACK', 'connected · a reliable pipe  ✓'], 150, 90, 900, '#2dd4bf', [A('l23', 'syn', 0), A('l23', 'answers', 0), A('l23', 'done', -1.0), A('l23', 'done', 0)], B('l24', 0));
    stamp(2, End('l23', 0.3), true, 'ok');
    C('g1', 'the gate is the NEAR edge in Mumbai, not the far origin', 800, 200, '#2dd4bf', 'l24', 'nearby', 900, -0.2);
    C('g2', '1 local round trip: 10–40 ms', 800, 280, '#3ddc84', 'l24', 'forty', 700, -0.2);
    walk('pia', End('l24', 0.4), 2.4, 2320); walk('raj', End('l24', 0.6), 2.4, 2230); cam(End('l24', 0.2), 2.4, 'vault');
    ev('t13', 'TLS 1.3 · the vault opens', ['ClientHello  (key share + server name)', 'one reply', 'ServerHello + certificate + Finished'], 150, 90, 1000, '#a78bfa', [A('l25', 'clienthello', 0), A('l25', 'reply', 0), A('l25', 'serverhello', 0)], B('l26', 0));
    ev('t13b', 'then the browser finishes', ['browser Finished  +  the first HTTP request, piggybacked', 'TCP 1 RTT + TLS 1 RTT = 2 round trips in total', 'the request moves in the third flight  ✓'], 150, 90, 1250, '#a78bfa', [A('l26', 'finished', 0), A('l26', 'total', 0), A('l26', 'third', 0)], B('l27', 0));
    stamp(3, End('l26', 0.3), true, 'ok');
    C('rq4', '“I heard TLS needed more than that…”', 800, 250, '#4ade80', 'l27', 'needed', 760, -0.2);
    P('c12', 'TLS 1.2 · 3 round trips before data', 'TCP  →  hello  →  separate key exchange + Finished  →  data', 150, 120, 1300, 110, '#ff7b7b', 'l28', 'separate', -0.3);
    P('c13', 'TLS 1.3 · 2 round trips before data', 'TCP  →  hello + key share, reply with Finished  →  data', 150, 250, 1300, 110, '#3ddc84', 'l28', 'removes', -0.3);
    C('why', 'why an EDGE exists at the TCP/TLS layer: 2 long trips → 2 cheap local ones', 800, 250, '#f59e0b', 'l29', 'turns', 1250, -0.3);
    HID(['c12', 'c13'], B('l29', -0.2)); HID(['why'], B('l30', -0.2));
    const RL = stack('rl', [['1.3 = 1 round trip: the key share rides in message one', 'l30', 'rule', '#a78bfa'], ['a resumed session can even use 0-RTT', 'l30', 'resumed', '#ffd166'], ['⚠ a trap hides in 0-RTT… (later)', 'l30', 'trap', '#ff7b7b']], 800, 200, 80, 900);
  });

  /* ===== S5: the branch and head office ===== */
  blk('l31', 'l41', () => {
    walk('pia', B('l31', 0.5), 4.0, 3120); walk('raj', B('l31', 0.7), 4.0, 3030); cam(B('l31', 0.3), 3.5, 'edge');
    C('rq5', '📨 one HTTP request: GET /cart  →  Edgar', 800, 200, '#ffd166', 'l31', 'request', 860, -0.2);
    HID(['rq5'], B('l32', -0.4));
    ev('ed', '5 · CDN edge, Mumbai · cache lookup', ['Cache-Control: private, no-store', 'lookup /cart  →  MISS  ✗', 'forward over a connection it already keeps open to the origin proxy'], 150, 90, 1250, '#f59e0b', [A('l32', 'private', 0), A('l32', 'miss', 0), A('l32', 'already', 0)], B('l33', 0));
    stamp(4, End('l32', 0.3), true, 'miss');
    cam(B('l33', -0.3), 2.2, 'sea'); walk('pia', B('l33', 1.0), 5.0, 4400); walk('raj', B('l33', 1.2), 5.0, 4310);
    wl('oc', '🌊 220 ms each way', '#7ee0ff', 3940, 640, A('l33', 'ocean', 0), 44);
    ask('go', 'GET /cart', '#ffd166', 3300, 560, 4440, 560, B('l33', 1.0), 5.0);
    cam(B('l34', -0.4), 2.0, 'proxy');
    ev('ry', '6 · reverse proxy, us-east-1', ['TLS ends here', 'pick an upstream  ·  layer-7 routing', 'forward to the app server'], 150, 90, 900, '#94a3b8', [A('l34', 'end', 0), A('l34', 'pick', 0), A('l34', 'pass', 0)], B('l35', 0));
    stamp(5, End('l34', 0.3), true, 'ok');
    walk('pia', End('l34', 0), 2.4, 5070); walk('raj', End('l34', 0.2), 2.4, 4980); cam(End('l34', 0), 2.4, 'app');
    ev('ap', '7 · app server', ['authenticate the session', 'build the query', 'ask the database: SELECT cart rows'], 150, 90, 900, '#60a5fa', [A('l35', 'authenticate', 0), A('l35', 'build', 0), A('l35', 'ask', 0)], B('l36', 0));
    stamp(6, End('l35', 0.3), true, 'ok');
    walk('pia', End('l35', 0), 2.4, 5720); walk('raj', End('l35', 0.2), 2.4, 5630); cam(End('l35', 0), 2.4, 'db');
    ev('db', '8 · database', ['pooled connection · no new handshake', 'indexed lookup (primary key)', 'rows back in a few ms  ✓'], 150, 90, 900, '#3ddc84', [A('l36', 'pooled', 0), A('l36', 'indexed', 0), A('l36', 'rows', 0)], B('l37', 0));
    stamp(7, End('l36', 0.3), true, 'ok');
    ev('rs', 'the answer travels back', ['app → 200 OK + JSON body', 'proxy → edge → browser', 'edge may cache it per Cache-Control (not here)'], 150, 90, 1000, '#ffd166', [A('l37', 'two', 0), A('l37', 'back', 0), A('l37', 'cache', 0)], B('l38', 0));
    cam(B('l38', -0.3), 3.0, 'edge'); walk('pia', B('l38', 0.2), 4.5, 3120); walk('raj', B('l38', 0.4), 4.5, 3030);
    C('p1', '🏊 Edgar keeps a POOL of connections to the origin', 800, 200, '#f59e0b', 'l38', 'pool', 860, -0.2);
    C('p2', 'already open · already through TLS', 800, 280, '#3ddc84', 'l38', 'already', 760, -0.1);
    P('np', 'without the pool · 3 round trips × 220 ms', 'DNS + TCP + TLS to the origin, then the request', 150, 120, 1300, 110, '#ff7b7b', 'l39', 'three', -0.3);
    P('wp', 'with the warm pool · 1 round trip', 'a CDN-fronted site still feels fast on a miss', 150, 250, 1300, 110, '#3ddc84', 'l39', 'one', -0.3);
    C('mk1', '⚠ mistake: “a CDN miss = full DNS+TCP+TLS to the far origin”', 800, 200, '#ff7b7b', 'l40', 'mistake', 1000, -0.2);
    C('mk2', '✓ a miss pays ONE round trip at the real distance, not three', 800, 280, '#3ddc84', 'l40', 'warm', 1000, -0.2);
  });

  /* ===== S6: the page is drawn ===== */
  blk('l41', 'l46', () => {
    cam(B('l41', -0.3), 3.0, 'home'); walk('pia', B('l41', 0.3), 9.0, 380); walk('raj', B('l41', 0.5), 9.0, 270);
    const RS = stack('rs', [['1 · parse the HTML', 'l41', 'parse', '#7ee0ff'], ['2 · discover what else the page needs', 'l41', 'discover', '#fbbf24'], ['3 · fetch those things', 'l41', 'fetch', '#2dd4bf'], ['4 · only then: show anything', 'l41', 'only', '#3ddc84']], 800, 170, 66, 860);
    C('rp', 'a smaller version of the whole chain, repeated per subresource', 800, 460, '#c084fc', 'l41', 'repeated', 1100, -0.2);
    HID(RS.concat(['rp']), B('l42', -0.3));
    ev('rn', '9 · render: one main request, many small ones', ['GET /cart  →  HTML', 'reads the HTML, finds style.css · app.js · logo.png · a font', 'fetched in parallel, same warm connection', 'DOM + CSSOM  →  layout  →  paint  ✓'], 150, 90, 1250, '#c084fc', [A('l42', 'reads', 0), A('l42', 'finds', 0), A('l42', 'parallel', 0), A('l42', 'paints', 0)], B('l43', 0));
    stamp(8, End('l42', 0.3), true, 'ok');
    C('n1', 'same origin + same connection: no new DNS, TCP or TLS', 800, 200, '#3ddc84', 'l43', 'none', 900, -0.2);
    C('n2', 'HTTP/2 multiplexing: many requests on ONE connection', 800, 280, '#7ee0ff', 'l43', 'multiplexing', 900, -0.2);
    C('r44', 'page load = 1 main request + a parallel chain of small ones', 800, 240, '#4ade80', 'l44', 'main', 1000, -0.2);
    wl('crt', '🛒 Mira\'s cart appears', '#3ddc84', 420, 330, A('l45', 'cart', -0.2), 44);
    ring('rg2', 1200, 270, 90, '#3ddc84', '52 s left', A('l45', 'fifty', -0.2), 8);
  });

  /* ===== S7: where the time went ===== */
  blk('l46', 'l51', () => {
    ev('t1', 'where the time goes · cold, Mumbai → us-east-1', ['browser cache check      < 1 ms', 'DNS                      20–120 ms cold · < 1 ms warm', 'TCP                      1 RTT to the nearest edge · 10–40 ms', 'TLS 1.3                  1 RTT · often with the first request'], 100, 90, 1400, '#7ee0ff', [A('l46', 'check', 0), A('l46', 'd n s', 0), A('l46', 't c p', 0), A('l46', 't l s', 0)], B('l47', 0));
    ev('t2', 'where the time goes · the rest', ['edge → origin (miss)    1 RTT at the real distance · ~220 ms', 'app + database          single digit to tens of ms', 'render                  tens to hundreds of ms', 'WARM repeat visit       one RTT to the edge · < 50 ms  ✓'], 100, 90, 1400, '#3ddc84', [A('l47', 'edge', 0), A('l47', 'app', 0), A('l47', 'render', 0), A('l47', 'warm', 0)], B('l48', 0.5));
    C('sk', 'every row is skippable by a cache or an open connection …', 800, 200, '#ffd166', 'l48', 'skippable', 1000, -0.2);
    C('sk2', '… except app + database: it runs on EVERY request', 800, 280, '#ff9f6b', 'l48', 'except', 900, -0.2);
    ev('cw', 'curl -w   (cumulative from the start)', ['dns:     0.0026 s', 'connect: 0.0031 s', 'tls:     0.1801 s', 'ttfb:    0.2319 s', 'total:   0.2320 s'], 100, 90, 800, '#f59e0b', [A('l49', 'finished', 0), A('l49', 'connect', 0), A('l49', 't l s', 0), A('l49', 'first', 0), A('l49', 'total', 0)], End('l50', 0.5));
    ev('sb', 'subtract to read each phase', ['TCP    0.0031 − 0.0026 ≈ 0.5 ms   (a nearby server)', 'TLS    0.1801 − 0.0031 ≈ 177 ms   ← the one long round trip', 'server think time  0.2319 − 0.1801 ≈ 52 ms'], 100, 420, 1250, '#ff9f6b', [A('l50', 'half', 0), A('l50', 'hundred', 0), A('l50', 'think', 0)], End('l50', 0.5));
  });

  /* ===== S8: variants ===== */
  blk('l51', 'd1', () => {
    ev('v1', 'variants · what gets skipped', ['fully cold          skips nothing                               300–800 ms', 'warm + CDN HIT        skips DNS, TCP, TLS and the origin          10–50 ms', 'warm + CDN MISS      skips DNS, TCP, TLS · pays edge + origin RTT + app/DB'], 100, 90, 1400, '#7ee0ff', [A('l51', 'fully', 0), A('l51', 'hit', 0), A('l51', 'miss', 0)], B('l52', 0));
    ev('v2', 'more variants', ['TLS resumption       skips cert exchange + signature · saves tens of ms (mobile)', 'HTTP/3 over QUIC     no extra stall after a lost packet', 'same-origin follow-up   skips DNS, TCP, TLS (maybe the whole request)'], 100, 90, 1400, '#c084fc', [A('l52', 'resumption', 0), A('l52', 'three', 0), A('l52', 'same', 0)], End('l52', 0.6));
  });

  /* ===== S9: deep dive ===== */
  blk('d1', 'g1', () => {
    const DD = [['d1', 'why TCP + TLS = 2 round trips, not 3', 'ClientHello carries the key share → one reply → Finished piggybacks the request', '#a78bfa'], ['d2', 'why the CDN hop to origin is cheap at 220 ms', 'a pool of established, TLS-ready connections · the edge forwards on a warm line', '#f59e0b'], ['d3', 'where app + database time goes', 'indexed point lookup: low single-digit ms · unindexed scan or N+1 can dominate', '#3ddc84'], ['d4', 'what render hides', 'streams the HTML · finds subresources · DOM + CSSOM · layout · paint: a second chain', '#c084fc'], ['d5', 'load balancing is invisible here, on purpose', 'edge picks an origin · proxy picks an app instance · algorithms live in their own note', '#94a3b8']];
    DD.forEach((r, i) => P('dd' + i, r[1], r[2], 110, 100 + i * 112, 1360, 98, r[3], r[0], 'deep', -0.2));
  });

  /* ===== S10: in Go ===== */
  blk('g1', 'g2', () => {
    C('go1', 'package urltrace · standard library only', 800, 200, '#7ee0ff', 'g1', 'url', 860, -0.2);
    C('go2', 'net/http/httptrace · the idea behind curl -w and the browser waterfall', 800, 280, '#3ddc84', 'g1', 'trace', 1100, -0.2);
  });
  blk('g2', 'g3', () => {
    const L = ['type Timings struct {', '\tDNSLookup    time.Duration', '\tConnect      time.Duration', '\tTLSHandshake time.Duration', '\tTTFB         time.Duration // from request start', '\tTotal        time.Duration', '}', '// a phase is 0 when the transport skipped it'];
    const cp = S.codePanel('cA', L, { x: 100, y: 110, w: 1360, fs: 27, title: 'urltrace.go', t0: B('g2', 0.2), times: [A('g2', 'struct', 0), A('g2', 'lookup', 0), A('g2', 'connect', 0), A('g2', 't l s', 0), A('g2', 'byte', 0), A('g2', 'total', 0), A('g2', 'total', 0.3), A('g2', 'zero', 0)] });
    cp.hl(0, A('g2', 'struct', 0)); cp.hl(7, A('g2', 'zero', 0)); cp.hl(0, A('g2', 'beats', 0)); cp.out(End('g2', 0.2));
  });
  blk('g3', 'g5', () => {
    const L = ['func Do(client *http.Client, req *http.Request) (Timings, int, error) {', '    var t Timings', '    var start, dnsStart, connectStart, tlsStart time.Time', '    trace := &httptrace.ClientTrace{', '        DNSStart: func(httptrace.DNSStartInfo) { dnsStart = time.Now() },', '        DNSDone: func(httptrace.DNSDoneInfo) {', '            if !dnsStart.IsZero() { t.DNSLookup = time.Since(dnsStart) }', '        },', '        ConnectStart: func(string, string) { connectStart = time.Now() },', '        ConnectDone: func(network, addr string, err error) {', '            if err == nil && !connectStart.IsZero() { t.Connect = time.Since(connectStart) }', '        },', '        // TLSHandshakeStart / TLSHandshakeDone: same pattern → t.TLSHandshake', '        GotFirstResponseByte: func() { t.TTFB = time.Since(start) },', '    }'];
    const cp = S.codePanel('cB', L, { x: 100, y: 90, w: 1360, fs: 24, lh: 38, title: 'urltrace.go', t0: B('g3', 0.2), times: [A('g3', 'function', 0), A('g3', 'function', 0.5), A('g3', 'function', 1.0), A('g3', 'builds', 0), A('g3', 'd n s', 0), A('g3', 'stores', 0), A('g3', 'guarded', 0), A('g3', 'guarded', 0.6), A('g4', 'connect', 0), A('g4', 'connect', 0.5), A('g4', 'done', 0), A('g4', 'done', 0.3), A('g4', 't l s', 0), A('g4', 'got', 0), A('g4', 'got', 0.5)] });
    cp.hl(3, A('g3', 'builds', 0)); cp.hl(4, A('g3', 'd n s', 0)); cp.hl(6, A('g3', 'guarded', 0)); cp.hl(8, A('g4', 'connect', 0)); cp.hl(12, A('g4', 't l s', 0)); cp.hl(13, A('g4', 'got', 0)); cp.out(End('g4', 0.2));
  });
  blk('g5', 'g6', () => {
    const L = ['    start = time.Now()', '    req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))', '    resp, err := client.Do(req)', '    if err != nil { return t, 0, fmt.Errorf("do request: %w", err) }', '    defer resp.Body.Close()', '    if _, err := io.Copy(io.Discard, resp.Body); err != nil { … }  // drain', '    t.Total = time.Since(start)', '    return t, resp.StatusCode, nil'];
    const cp = S.codePanel('cC', L, { x: 100, y: 110, w: 1360, fs: 25, title: 'urltrace.go · Do, second half', t0: B('g5', 0.2), times: [A('g5', 'attaches', -0.3), A('g5', 'attaches', 0.2), A('g5', 'runs', 0), A('g5', 'runs', 0.8), A('g5', 'runs', 1.2), A('g5', 'drains', 0), A('g5', 'reuse', -0.5), A('g5', 'reuse', 0)] });
    cp.hl(1, A('g5', 'context', 0)); cp.hl(5, A('g5', 'drains', 0)); cp.hl(5, A('g5', 'pool', 0)); cp.out(End('g5', 0.2));
  });
  blk('g6', 't1', () => {
    const L = ['func TestDoHTTPS(t *testing.T) {', '    srv := httptest.NewTLSServer(...)   // handler sleeps 5 ms', '    timings, status, err := Do(srv.Client(), req)', '    if timings.DNSLookup != 0 { t.Errorf("want 0 for a literal IP") }', '    if timings.Connect <= 0 || timings.TLSHandshake <= 0 { t.Errorf(…) }', '    if timings.TTFB < 5*time.Millisecond { t.Errorf("want >= 5ms") }', '    if timings.Total < timings.TTFB { t.Errorf(…) }', '', 'func TestDoReusesConnection(t *testing.T) {', '    Do(client, req1)                      // first: pays Connect + TLS', '    timings, _, err := Do(client, req2)   // second: same client', '    if timings.Connect != 0 || timings.TLSHandshake != 0 { t.Errorf(…) }'];
    const cp = S.codePanel('cD', L, { x: 100, y: 110, w: 1360, fs: 24, lh: 40, title: 'urltrace_test.go', t0: B('g6', 0.2), times: [A('g6', 'test', 0), A('g6', 'sleeps', 0), A('g6', 'expected', -0.3), A('g6', 'd n s', 0), A('g6', 'connect', 0), A('g6', 'time', 0), A('g6', 'total', 0), A('g7', 'and', -0.5), A('g7', 'reuses', 0), A('g7', 'first', 0), A('g7', 'second', 0), A('g7', 'zero', 0)] });
    cp.hl(3, A('g6', 'd n s', 0)); cp.hl(4, A('g6', 'connect', 0)); cp.hl(5, A('g6', 'time', 0)); cp.hl(6, A('g6', 'total', 0)); cp.hl(9, A('g7', 'first', 0)); cp.hl(11, A('g7', 'zero', 0));
    C('gp', 'go test -race  ✓  both pass · the warm path, proven in code', 800, 760, '#3ddc84', 'g7', 'pass', 1000, -0.2);
    cp.out(End('g7', 0.5));
  });

  /* ===== S11: trade-offs, failures, monitoring ===== */
  blk('t1', 't4', () => {
    const R = [['t1', 'assumes a public page behind a CDN', 'service-to-service in one data center skips public DNS + CDN: app + DB time dominates', '#7ee0ff', 'assumes'], ['t2', 'CDN caching: freshness ↔ speed', 'safe-to-cache rules live in the HTTP caching note', '#f59e0b', 'second'], ['t2', 'keep-alive + resumption: memory and file descriptors ↔ latency', 'a server with a connection limit may need SHORTER keep-alive timeouts', '#2dd4bf', 'third'], ['t3', '0-RTT resumption: one round trip ↔ replay risk', 'idempotent requests only · never “charge this card”', '#ff7b7b', 'fourth']];
    R.forEach((r, i) => P('to' + i, r[1], r[2], 110, 110 + i * 120, 1360, 100, r[3], r[0], r[4], -0.2));
  });
  blk('t4', 't7', () => {
    const R = [['t4', 'slow TTFB, fast DNS / TCP / TLS → the origin', 'check proxy → app → DB · curl -w and dig localize it', '#ff7b7b', 'slow'], ['t5', 'high DNS time on every request', 'TTL not sane, or the client is not caching', '#fbbf24', 'high'], ['t5', 'high TLS time', 'full handshake each time instead of resumption · or slow certificate check (OCSP)', '#a78bfa', 'resumption'], ['t6', 'CDN hit ratio near zero on a cacheable page', 'check Cache-Control and Vary are really cacheable', '#f59e0b', 'ratio']];
    R.forEach((r, i) => P('fl' + i, r[1], r[2], 110, 110 + i * 120, 1360, 100, r[3], r[0], r[4], -0.2));
    C('shp', 'always the same shape: something cached or kept warm to save a round trip', 800, 620, '#3ddc84', 't6', 'shape', 1200, -0.2);
  });
  blk('t7', 'q0', () => {
    ev('mn', 'what to monitor', ['per-phase timing percentiles p50 / p95 / p99 (real user monitoring)', 'CDN cache hit ratio', 'TLS handshake failure rate', 'edge → origin latency'], 100, 90, 1400, '#3ddc84', [A('t7', 'percentiles', 0), A('t7', 'cache', 0), A('t7', 'handshake', 0), A('t7', 'latency', 0)], End('t7', 0.4));
  });

  /* ===== S12: interview ===== */
  ['boardBg', 'cb0', 'cb1', 'cb2', 'cb3', 'cb4', 'cb5', 'cb6', 'cb7', 'cb8'].forEach((k) => hide(k, B('q0', -0.5), 0.4));
  blk('q0', 's0', () => {
    qa([['Walk me through: Enter → the page starts to render', 'cache → DNS → TCP → TLS 1.3 → HTTP → CDN (a hit stops here) or proxy → app → DB → back → render', 'q1', 'walk'], ['Why is the very first request so slow?', 'DNS + fresh TCP + fresh TLS = 2+ round trips before any HTTP byte, plus a CDN miss · later ones reuse it all', 'q3', 'first'], ['Trap: is TLS 0-RTT always faster, no downside?', 'No · early data can be replayed · idempotent requests only, never “transfer funds”', 'q5', 'trap'], ['TTFB 600 ms but DNS + TCP + TLS = 40 ms: where next?', 'the origin · is the URL cacheable at the CDN? · curl -w or tracing: app logic or a slow query', 'q7', 'where'], ['Does a CDN make edge-to-origin TLS unnecessary?', 'No · that hop crosses the open internet too · its own TLS session, the origin\'s certificate', 'q9', 'does'], ['Why does HTTP/3 help mobile more than wired?', 'QUIC: one lost packet stalls only its stream · mobile = more loss + IP changes that QUIC survives', 'q11', 'why'], ['Where does load balancing happen?', 'twice · the edge picks an origin server · the reverse proxy picks an app instance', 'q13', 'where']]);
  });

  /* ===== S13: summary ===== */
  blk('s0', 'rn1', () => {
    summary('SALE SAVED · SUMMARY', [['order: cache → DNS → TCP → TLS → HTTP → CDN → proxy → app → DB → render', 's1a', '#38bdf8'], ['every step below the app avoids redoing work: a cache hit, a reused connection, a resumed session', 's1b', '#fbbf24'], ['cold first visit: DNS + 1 TCP round trip + 1 TLS round trip before any HTTP byte', 's1c', '#2dd4bf'], ['a CDN hit never reaches the origin · a miss adds ONE round trip, thanks to warm pools', 's1d', '#f59e0b'], ['0-RTT trades a round trip for replay risk: idempotent requests only', 's1e', '#a78bfa'], ['TTFB high but DNS, TCP, TLS fast → look at the origin · measure with curl -w or httptrace', 's1f', '#f87171'], ['KEEP: find the address, connect securely, ask, draw · every step skippable if cached or kept open', 's1g', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => {
    readNext('rn1', [['📘 notes: What Happens When You Type a URL  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: DNS · TCP · TLS and HTTPS · HTTP Fundamentals', 'before', '#ffd166'], ['➡ after: Network Debugging Toolkit · How Browsers Load and Render a Page', 'after', '#3ddc84'], ['↔ compare: HTTP Caching · CDN and Edge · Forward and Reverse Proxies', 'compare', '#c084fc']]);
  });
  cam(B('e1', -0.4), 1.4, 'home'); wave('pia', B('e1', 0.5));
  endTitle('What Happens When You Type a URL', 'find the box that is slow', 'e2');
})();
