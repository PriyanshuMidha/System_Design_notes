/* HTTP versions: "Ten Minutes to Noon". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  world(4500, { sky: '#0b1433', skyMid: '#34457f', skyLow: '#d98a5c' });
  bld('bZ', 300, '#1e3a5f', 'ZARA · HQ', '🕵️'); bld('bH', 1000, '#92400e', 'HAL · HTTP/1.1', '🪟'); bld('bM', 1750, '#0e7490', 'MAYA · HTTP/2', '🛎️');
  bld('bT', 2500, '#475569', 'TOM · TCP ROAD', '🛣️'); bld('bQ', 3250, '#6d28d9', 'QUINN · HTTP/3', '🌐'); bld('bG', 4000, '#b91c1c', 'GUS · FIREWALL', '🛡️');
  const CFG = {
    zara: { who: 'ZARA', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '🔍', w: 96, name: 'Zara', ring: '#38bdf8' },
    ravi: { who: 'RAVI', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Ravi', ring: '#4ade80' },
    hal: { who: 'HAL', skin: '#e3b08a', shirt: '#92400e', pants: '#333', glasses: 1, hair: '#8a8a8a', tie: '#fbbf24', hold: '🎫', w: 108, name: 'Hal', ring: '#fbbf24' },
    maya: { who: 'MAYA', skin: '#f0c4a0', shirt: '#0891b2', pants: '#2a2540', glasses: 1, hair: '#7a3b1a', hair2: 'long', hold: '🛎️', blush: 1, w: 90, name: 'Maya', ring: '#22d3ee' },
    tom: { who: 'TOM', skin: '#9b6a47', shirt: '#64748b', pants: '#333', hat: 'cap', hatColor: '#f59e0b', hold: '🚦', w: 112, name: 'Tom', ring: '#94a3b8' },
    quinn: { who: 'QUINN', skin: '#f1c9a5', shirt: '#7c3aed', pants: '#2a2540', hat: 'cap', hatColor: '#5b21b6', hair2: 'long', hold: '🧭', w: 94, name: 'Quinn', ring: '#a78bfa' },
    gus: { who: 'GUS', skin: '#d9a37a', shirt: '#dc2626', pants: '#333', hat: 'cap', hatColor: '#991b1b', hold: '🛡️', w: 106, name: 'Gus', ring: '#f87171' },
  };
  cast(CFG, { zara: [380], ravi: [270], hal: [1040], maya: [1790], tom: [2540], quinn: [3290], gus: [4040] });
  views({ hq: { x: 520, y: 520, s: 0.9 }, hal: { x: 1000, y: 520, s: 0.95 }, maya: { x: 1750, y: 520, s: 0.95 }, tom: { x: 2450, y: 520, s: 0.95 }, quinn: { x: 3200, y: 520, s: 0.95 }, gus: { x: 3900, y: 520, s: 0.95 } });
  camTw(0, 0.001, { x: 520, y: 520, s: 0.9 });
  const stamp = board('THE CASE', [['🚪', 'HTTP/1.1'], ['🛎️', 'HTTP/2'], ['🛣️', 'TCP road'], ['🌐', 'QUIC']], 1500, 30, B('l6', 0));
  // walk with the name tag following
  const walkN = (id, t, d, x) => { walk(id, t, d, x); tw('nm_' + id, t, d, { x }, { ease: 'inOut' }); };
  const jump = (id, t, x) => { tw(id, t, 0.001, { x }); tw('nm_' + id, t, 0.001, { x }); };
  const bar = (id, label, w, col, x, y, t, tEnd) => { ui(id, rect(0, 0, w, 40, col, { rx: 10 }) + T(label, 24, '#07101f', { anchor: 'start', dx: 14, dy: 20 }), x, y, {}); pop(id, t); hide(id, tEnd, 0.4); };

  /* ===== S1 the noon rush ===== */
  blk('l1', 'l5', () => {
    wl('clk', '🕚 11:50 · tickets go on sale at 12:00', '#ffd166', 520, 300, A('l1', 'eleven', 0), 44);
    wl('alm', '🚨 the checkout page crawls on phones', '#ff7b7b', 520, 230, A('l1', 'alarm', 0), 38);
    em('spn', '⏳', 110, 700, 600); pop('spn', A('l1', 'spinners', 0));
    wl('lv', '🏃 customers leave every second', '#ffb3b3', 520, 370, A('l1', 'leaves', 0), 34);
    ring('cd', 960, 200, 64, '#ff7b7b', '10:00', A('l1', 'ten', 0.2), 14);
    walkN('ravi', B('l2', 0.5), 1.5, 500);
    C('c3', '30 files · fast server · slow page', 960, 330, '#7ee0ff', 'l2', 'thirty', 700, -0.1);
    C('q1c', '❓ the files?', 600, 440, '#ffd166', 'l3', 'files', 300, 0); C('q2c', '❓ the road?', 960, 440, '#ffd166', 'l3', 'road', 300, 0); C('q3c', '❓ the server?', 1320, 440, '#ffd166', 'l3', 'server', 300, 0);
    ev('sv', 'the server is NOT the problem', ['server answers in 50 ms ✓', 'the problem is HOW we ask'], 90, 520, 900, '#3ddc84', [A('l4', 'fifty', 0), A('l4', 'ask', 0)], End('l4', 0.2));
    C('v1', 'HTTP/1.1', 560, 660, '#fbbf24', 'l4', 'versions', 260, 0.3); C('v2', 'HTTP/2', 860, 660, '#22d3ee', 'l4', 'one', 260, 0.2); C('v3', 'HTTP/3', 1160, 660, '#a78bfa', 'l4', 'meet', 260, 0);
  });
  blk('l5', 'l6', () => {
    const W = [['📨 request ↔ response', 'request', '#7ee0ff'], ['🔌 connection: an open line', 'connection', '#ffd166'], ['🚚 TCP: reliable, in order', 't c p', '#3ddc84'], ['📡 UDP: no promise of order', 'u d p', '#fb923c'], ['💥 packet loss: data dropped', 'packet loss', '#ff7b7b'], ['⏱️ RTT: there and back (40 ms)', 'round trip', '#c084fc'], ['🔀 multiplexing: many talks, one line', 'multiplexing', '#22d3ee'], ['🚧 head-of-line blocking: one stuck item', 'head of line', '#f472b6']];
    W.forEach((w, i) => C('wd' + i, w[0], i < 4 ? 520 : 1330, 130 + (i % 4) * 100, w[2], 'l5', w[1], 640, 0));
  });
  blk('l6', 'l7', () => {
    [['📄 HTML', 'stylesheet', '#7ee0ff', 0], ['🎨 CSS', 'stylesheet', '#ffd166', 1], ['⚙️ scripts', 'scripts', '#3ddc84', 2], ['🖼️ 20 images', 'images', '#f472b6', 3], ['🔤 a font', 'font', '#c084fc', 4]].forEach((c, i) => C('nf' + i, c[0], 420 + i * 330, 330, c[2], 'l6', c[1], 300, i * 0.35));
    C('nq', 'how do we ask for MANY things at once, even when the network drops data?', 960, 470, '#ffd166', 'l6', 'simple', 1300, 0);
  });
  blk('l7', 'h1', () => {
    ev('wb', 'the whiteboard: 6 requests × 50 ms each', ['HTTP/1.1, 1 connection  →  ~310 ms', 'HTTP/2, 1 connection  →  ~62 ms ✓', 'each version fixes the bottleneck of the one before'], 90, 90, 1300, '#38bdf8', [A('l7', 'six', 0), A('l7', 'sixty two', 0), A('l7', 'each', 0)], End('l7', 0.3));
    bar('wb1', '1.1 · 310 ms', 620, '#ff9f6b', 90, 330, A('l7', 'three hundred', 0), End('l7', 0.3));
    bar('wb2', '2 · 62 ms', 124, '#3ddc84', 90, 385, A('l7', 'sixty two', 0.3), End('l7', 0.3));
  });

  /* ===== S2 Hal ===== */
  cam(B('h1', -2), 1.2, 'hal');
  blk('h1', 'm1', () => {
    walkN('zara', B('h1', 0.3), 3.0, 900); walkN('ravi', B('h1', 0.5), 3.0, 800);
    wl('s1', '🪟 suspect 1: one window, one customer at a time', '#fbbf24', 1000, 400, A('h1', 'suspect', 0), 34);
    for (let i = 0; i < 4; i++) { em('cq' + i, '🧍', 70, 1230 + i * 75, 770); pop('cq' + i, A('h2', 'customer', 0) + i * 0.25); }
    ev('rq', "Hal's request: plain text", ['GET /style.css HTTP/1.1', 'Host: example.com', 'Accept-Encoding: gzip, br', '⏎ blank line = end of request   (keep-alive: still one at a time)'], 90, 90, 1400, '#fbbf24', [A('h2', 'g e t', 0), A('h2', 'host', 0), A('h2', 'accept', 0), A('h2', 'keep', 0)], B('h3', 0));
    hide('s1', B('h3', 0), 0.4);
    ask('pq', '📦📦📦 a whole queue?', '#4ade80', 800, 600, 980, 600, B('h3', 0.2), 1.3);
    ev('pp', 'pipelining', ['allowed by the spec ✓', 'answers must return IN THE SAME ORDER', 'one slow answer blocks all behind it ✗', 'no major browser ever turned it on'], 90, 90, 1400, '#ff7b7b', [A('h4', 'spec', 0), A('h4', 'same order', 0), A('h4', 'blocks', 0), A('h4', 'no major', 0)], B('h5', 0));
    stamp(0, End('h4', 0.2), false, '', 'slow');
    for (let i = 0; i < 6; i++) { line('cn' + i, 820, 540 + i * 42, 1200, 540 + i * 42, ['#60a5fa', '#3ddc84', '#fbbf24', '#f472b6', '#c084fc', '#22d3ee'][i], 9); draw('cn' + i, A('h5', 'six', 0.2) + i * 0.25, 0.7); }
    C('hc1', '6× TCP handshakes', 1160, 140, '#ff9f6b', 'h5', 't c p handshakes', 380, 0); C('hc2', '6× TLS handshakes', 1160, 215, '#ff9f6b', 'h5', 't l s', 380, 0); C('hc3', '6× congestion state from scratch', 1160, 290, '#ff9f6b', 'h5', 'congestion', 560, 0); C('hc4', '6 connections, one shared link', 1160, 365, '#ff9f6b', 'h5', 'fighting', 520, 0);
    ev('th', 'thirty files, six connections', ['30 files ÷ 6 connections = 5 round trips each', 'each connection serializes its own share', 'parallelism = however many sockets the browser will open'], 90, 90, 1400, '#7ee0ff', [A('h6', 'thirty', 0), A('h6', 'serializes', 0), A('h6', 'parallelism', 0)], End('h6', 0.3));
    ev('fl', '✗ classic mistake: more connections is NOT a free lunch', ['each new connection: TCP handshake = 1 RTT', 'over HTTPS: TLS adds 1 to 2 more RTT', '…all before one byte of the file arrives ✗'], 90, 90, 1400, '#ff7b7b', [A('h7', 'handshake', 0), A('h7', 't l s', 0), A('h7', 'before', 0)], End('h7', 0.3));
    wl('dr', '🏥 one patient in, finish, next · a second office = a second connection', '#ffd166', 1000, 400, A('h8', 'doctor', 0), 32);
  });

  /* ===== S3 Maya ===== */
  cam(B('m1', -2), 1.2, 'maya');
  blk('m1', 't1', () => {
    walkN('zara', B('m1', 0.3), 3.0, 1650); walkN('ravi', B('m1', 0.5), 3.0, 1550);
    wl('s2', '🛎️ suspect 2: one shared lobby for every stream (2015, from SPDY)', '#22d3ee', 1750, 400, A('m1', 'suspect', 0), 32);
    ev('fr', 'HTTP/2 binary frames', ['HEADERS · DATA · SETTINGS · WINDOW_UPDATE · RST_STREAM', 'every frame carries a stream ID', 'frames from many streams interleave on ONE connection'], 90, 90, 1400, '#22d3ee', [A('m2', 'headers', 0), A('m2', 'stream i d', 0), A('m2', 'interleave', 0)], B('m3', 0));
    const FR = [['HEADERS s1', '#60a5fa', 'headers'], ['HEADERS s3', '#3ddc84', 'three'], ['DATA s1', '#60a5fa', 'bit'], ['DATA s3', '#3ddc84', 'then'], ['HEADERS s5', '#f472b6', 'five'], ['DATA s1 (rest)', '#60a5fa', 'rest']];
    FR.forEach((f, i) => ask('fm' + i, f[0], f[1], 1480, 500 + i * 36, 1950, 500 + i * 36, A('m4', f[2], 0), 1.3));
    wl('np', '✅ no response waits for another', '#3ddc84', 1750, 440, A('m4', 'no response', 0), 36);
    C('p6c', '1 connection = the parallelism of 6', 960, 760, '#22d3ee', 'm4', 'parallelism', 760, 0);
    hide('s2', B('m3', 0), 0.4);
    ev('hp', 'HPACK: header compression', ['static table: 61 common pairs → a 1-byte index', 'dynamic table: a long cookie is sent once, then a number', 'Huffman coding for literals in neither table'], 90, 90, 1400, '#c084fc', [A('m5', 'static', 0), A('m5', 'dynamic', 0), A('m5', 'huffman', 0)], B('m6', 0));
    ev('pr', 'stream priority', ['dependency tree + weights: CSS before a background image', 'in practice servers ignored it or did it unevenly ✗', 'replaced by RFC 9218 (urgency 0 to 7)'], 90, 90, 1400, '#ffd166', [A('m6', 'priority', 0), A('m6', 'practice', 0), A('m6', 'replaced', 0)], B('m7', 0));
    ev('ps', 'server push (PUSH_PROMISE)', ['server sends app.js before it is asked', 'Chrome removed it in 2022: files were usually already cached ✗', 'use <link rel=preload> or 103 Early Hints instead ✓'], 90, 90, 1400, '#ff9f6b', [A('m7', 'push', 0), A('m7', 'chrome', 0), A('m7', 'preload', 0)], End('m7', 0.3));
    wl('dr2', '🏥 one receptionist swapping charts · but one entrance 🚪', '#ffd166', 1750, 400, A('m8', 'receptionist', 0), 34);
    stamp(1, End('m8', 0.1), false, '', 'half');
  });

  /* ===== S4 Tom ===== */
  cam(B('t1', -2), 1.2, 'tom');
  blk('t1', 'q1', () => {
    walkN('zara', B('t1', 0.2), 3.0, 2330); walkN('ravi', B('t1', 0.4), 3.0, 2230);
    wl('tr', '🚆 noon · the train enters a tunnel', '#ffd166', 2450, 400, A('t1', 'noon', 0), 36);
    [['#60a5fa', 's1'], ['#3ddc84', 's3'], ['#f472b6', 's5']].forEach((c, i) => { line('ls' + i, 1900, 560 + i * 60, 2300, 560 + i * 60, c[0], 10); draw('ls' + i, A('t1', 'noon', 0.3) + i * 0.2, 0.6); bubble('sp' + i, c[1], c[0], 1950, 560 + i * 60); fly('sp' + i, A('t1', 'packets', 0) + i * 0.3, [[1950, 560 + i * 60], [2230, 560 + i * 60]], 1.8); });
    wl('fz', '❄️ ALL streams frozen at the same instant', '#ff7b7b', 2450, 330, A('t1', 'freeze', 0), 38);
    hide('tr', B('t3', 0), 0.4); hide('fz', B('t3', 0), 0.4);
    C('sg1', 'seg 41 ✓', 520, 430, '#3ddc84', 't3', 'order', 300, 0); C('sg2', 'seg 42 ✗ LOST', 880, 430, '#ff5d5d', 't3', 'forty two', 360, 0); C('sg3', 'seg 43 · WAIT', 1240, 430, '#ffb066', 't3', 'forty three', 340, 0); C('sg4', 'seg 44 · WAIT', 1560, 430, '#ffb066', 't3', 'forty four', 340, 0);
    ev('tm', "Tom's rule: in-order delivery", ['promise: bytes reach the app IN ORDER', 'segment 42 lost ✗', '43, 44, 45 arrived but are WITHHELD', 'retransmit 42 → release everything'], 90, 90, 1400, '#94a3b8', [A('t3', 'order', 0), A('t3', 'forty two', 0), A('t3', 'forty three', 0), A('t3', 'sent again', 0)], B('t4', 0));
    ev('cm', '✗ the classic mistake', ['HTTP/2 fixed head-of-line blocking at the HTTP layer only', 'TCP in-order delivery still blocks EVERY stream', '1 lost packet = all streams stall ✗'], 90, 90, 1400, '#ff7b7b', [A('t4', 'one lost', 0), A('t4', 'h t t p layer', 0), A('t4', 'underneath', 0)], B('t5', 0));
    stamp(2, A('t4', 'classic', 0), false, '', 'JAM');
    ev('bf', 'one TCP receive buffer', ['frames of stream 1 · 3 · 5 pour into ONE buffer', 'strict byte order', 'stream-1 segment lost → ALL later bytes withheld ✗'], 90, 90, 1400, '#ff9f6b', [A('t5', 'buffer', 0), A('t5', 'strict', 0), A('t5', 'withholds', 0)], End('t5', 0.3));
  });

  /* ===== S5 Quinn ===== */
  cam(B('q1', -2), 1.2, 'quinn');
  blk('q1', 'p1', () => {
    walkN('zara', B('q1', 0.2), 3.0, 3050); walkN('ravi', B('q1', 0.4), 3.0, 2950);
    wl('s3', '🌐 suspect 3 (and the fix): a separate door for every stream · RFC 9114 (2022)', '#a78bfa', 3250, 400, A('q1', 'suspect', 0), 30);
    ev('h3m', 'HTTP/3 = the same model, a new transport', ['same request / response + frame model as HTTP/2', 'transport: QUIC over UDP, not TCP', 'every stream: its own loss detection + retransmission'], 90, 90, 1400, '#a78bfa', [A('q2', 'keep', 0), A('q2', 'quic', 0), A('q2', 'every', 0)], B('q3', 0));
    hide('s3', B('q3', 0), 0.4);
    ev('iso', 'loss is isolated per stream', ['stream 1: packet 1 ✓ · packet 2 LOST → waits', 'stream 3: app.js delivered in full ✓', 'only stream 1 retransmits'], 90, 90, 1400, '#3ddc84', [A('q3', 'first', 0), A('q3', 'three', 0), A('q3', 'only', 0)], B('q4', 0));
    ev('hs', 'handshakes: stacked vs folded', ['TCP then TLS = two handshakes stacked', 'QUIC folds TLS 1.3 into its own handshake'], 90, 90, 1400, '#22d3ee', [A('q4', 'stacked', 0), A('q4', 'fold', 0)], B('q5', 0));
    ev('rt', 'wait before the first request byte (50 ms RTT)', ['HTTP/2, fresh: ~100 ms (2 RTT)', 'HTTP/3, fresh: ~50 ms (1 RTT)', 'HTTP/3, resumed: ~0 ms (0-RTT)'], 90, 90, 1400, '#ffd166', [A('q5', 'hundred', 0), A('q5', 'three', 0), A('q5', 'zero', 0)], End('q5', 0.3));
    bar('rb1', 'HTTP/2 · 100 ms', 600, '#ff9f6b', 90, 330, A('q5', 'hundred', 0.2), End('q5', 0.3)); bar('rb2', 'HTTP/3 · 50 ms', 300, '#a78bfa', 90, 385, A('q5', 'three', 0.2), End('q5', 0.3)); bar('rb3', '0-RTT', 40, '#3ddc84', 90, 440, A('q5', 'zero', 0.2), End('q5', 0.3));
    ev('qp', 'QPACK vs HPACK', ['QPACK table updates ride their own one-way stream', 'a lost update never blocks headers on other streams ✓', 'HPACK inline ordered updates would bring HOL back ✗'], 90, 90, 1400, '#c084fc', [A('q6', 'table', 0), A('q6', 'lost', 0), A('q6', 'inline', 0)], End('q6', 0.3));
    wl('wf', '📶 Wi-Fi', '#7ee0ff', 3000, 420, A('q7', 'wi fi', 0), 36); wl('ce', '📱 cellular', '#fbbf24', 3550, 420, A('q7', 'cellular', 0), 36);
    em('ph', '📱', 90, 3000, 560); pop('ph', A('q7', 'phone', 0)); tw('ph', A('q7', 'cellular', -0.3), 1.2, { x: 3550 }, { ease: 'inOut' });
    C('cid', 'connection ID, not IP + port → the connection survives', 960, 140, '#a78bfa', 'q7', 'i d', 1000, 0);
    hide('wf', B('q8', 0), 0.4); hide('ce', B('q8', 0), 0.4); hide('ph', B('q8', 0), 0.4);
    wl('q8a', '🏥 every patient: their own entrance · same building', '#ffd166', 3250, 400, A('q8', 'entrance', 0), 34);
    wl('q8b', '⚠️ but streams still share one congestion budget + encryption', '#ffb066', 3250, 330, A('q8', 'breaks', 0), 30);
    ev('nu', 'QUIC is not raw UDP', ['QUIC ≠ "UDP with no reliability"', 'adds reliable delivery · congestion control · encryption', 'UDP is only the carrier ✓'], 90, 90, 1400, '#3ddc84', [A('q9', 'quic', 0), A('q9', 'adds', 0), A('q9', 'carrier', 0)], End('q9', 0.3));
    stamp(3, End('q9', 0.2), true, 'fix');
  });

  /* ===== S6 proof, comparison, trace ===== */
  blk('p1', 'p2', () => {
    ev('ex', 'the experiment: one handler that sleeps 50 ms', ['6 requests at once · serial ideal 6 × 50 = 300 ms · parallel ≈ 50 ms', 'HTTP/2 path: test server, TLS, ALPN picks h2, all 6 on ONE connection', 'HTTP/1.1 path: plain server, client capped to 1 connection per host'], 90, 90, 1450, '#38bdf8', [A('p1', 'baseline', 0), A('p1', 'path', 0), A('p1', 'plain', 0)], End('p1', 0.3));
  });
  blk('p2', 'p3', () => {
    ev('rs', 'result (Go 1.24, measured)', ['HTTP/1.1, 1 connection: ~313 ms  (serial ideal 300)', 'HTTP/2, 1 connection: ~68 ms  (parallel ideal 50)', 'same handler, different transport ✓'], 90, 90, 1400, '#3ddc84', [A('p2', 'one point one', 0), A('p2', 'fifty', 0), A('p2', 'identical', 0)], End('p2', 0.3));
    bar('r1', '1.1 · 313 ms', 626, '#ff9f6b', 90, 330, A('p2', 'one point one', 0.3), End('p2', 0.3)); bar('r2', '2 · 68 ms', 136, '#3ddc84', 90, 385, A('p2', 'fifty', 0.3), End('p2', 0.3));
  });
  blk('p3', 'p4', () => {
    ev('cu', 'what a real negotiation looks like', ['$ curl -v --http2 https://example.com/', '* ALPN: server accepted h2   →   < HTTP/2 200', '$ curl -v --http3 https://cloudflare.com/   →   * using HTTP/3'], 90, 90, 1450, '#ffd166', [A('p3', 'dash', 0), A('p3', 'accepted', 0), A('p3', 'using', 0)], End('p3', 0.3));
  });
  blk('p4', 'p5', () => {
    P('vv1', '1.1 · TCP · no multiplexing · no header compression', 'HOL per connection · simple services, legacy clients, some internal APIs', 60, 100, 1450, 130, '#fbbf24', 'p4', 'one point one');
    P('vv2', '2 · TCP + TLS (ALPN h2) · multiplexed · HPACK', 'HOL fixed at the HTTP layer, STILL at TCP · default for most web traffic and gRPC', 60, 250, 1450, 130, '#22d3ee', 'p4', 'two runs');
    P('vv3', '3 · QUIC over UDP · per-stream loss recovery · QPACK', 'HOL fixed at both layers · browsers and CDNs on lossy or mobile networks', 60, 400, 1450, 130, '#a78bfa', 'p4', 'three runs');
  });
  blk('p5', 'p6', () => {
    ev('sp', 'spotting TCP head-of-line blocking in production', ['symptom: several HTTP/2 streams spike in latency at the same instant', 'ss -ti on THAT connection → look at retrans:a/b', 'retransmits at the same moment → TCP head-of-line blocking ✓', 'no retransmits → handlers were just slow (app layer) ✗'], 90, 90, 1450, '#38bdf8', [A('p5', 'symptom', 0), A('p5', 'run', 0), A('p5', 'retransmits', 0), A('p5', 'no retransmits', 0)], End('p5', 0.3));
  });
  blk('p6', 'g1', () => {
    ev('tp', '✗ the trap', ['watching only request latency', '"multiplexing is broken" ← the wrong conclusion ✗', 'fix: accept the trade-off, or move to HTTP/3 ✓'], 90, 90, 1400, '#ff7b7b', [A('p6', 'trap', 0), A('p6', 'concluding', 0), A('p6', 'accept', 0)], End('p6', 0.3));
  });

  /* ===== S7 Go ===== */
  blk('g1', 'f1', () => {
    const L1 = ['func measureConcurrency(t *testing.T, client *http.Client,', '\turl string, n int, delay time.Duration) time.Duration {', '\tt.Helper()', '\tvar wg sync.WaitGroup', '\tstart := time.Now()', '\tfor i := 0; i < n; i++ {', '\t\twg.Add(1)', '\t\tgo func() {', '\t\t\tdefer wg.Done()', '\t\t\tresp, err := client.Get(url)', '\t\t\tif err != nil { t.Errorf("get: %v", err); return }', '\t\t\tresp.Body.Close()', '\t\t}()', '\t}', '\twg.Wait()', '\treturn time.Since(start)', '}'];
    const c1 = S.codePanel('c1', L1, { x: 100, y: 90, w: 1340, fs: 27, title: 'http2_test.go · the helper', t0: B('g2', -0.2), times: L1.map((x, i) => A('g2', 'helper', 0) + i * 0.4) });
    c1.hl(5, A('g2', 'fires', 0)); c1.hl(3, A('g2', 'wait group', 0)); c1.hl(15, A('g2', 'wall', 0));
    c1.hl(6, A('g3', 'add', 0)); c1.hl(7, A('g3', 'goroutine', 0)); c1.hl(8, A('g3', 'defer', 0)); c1.hl(9, A('g3', 'get', 0)); c1.hl(11, A('g3', 'close', 0)); c1.out(End('g3', 0.3));
    const L2 = ['handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {', '\ttime.Sleep(delay); fmt.Fprintf(w, "proto=%s", r.Proto)', '})', 'h2srv := httptest.NewUnstartedServer(handler)', 'h2srv.EnableHTTP2 = true', 'h2srv.StartTLS(); defer h2srv.Close()', 'h2Client := h2srv.Client()   // trusts the generated cert', 'h1srv := httptest.NewServer(handler)   // plain HTTP/1.1', 'h1Client := &http.Client{Transport: &http.Transport{MaxConnsPerHost: 1}}', '', 'h2Elapsed := measureConcurrency(t, h2Client, h2srv.URL, n, delay)', 'h1Elapsed := measureConcurrency(t, h1Client, h1srv.URL, n, delay)', 'if h2Elapsed >= time.Duration(n)*delay/2 { t.Fatalf("HTTP/2 too slow") }', 'if h1Elapsed < time.Duration(n)*delay*7/10 { t.Fatalf("HTTP/1.1 not serial") }'];
    const c2 = S.codePanel('c2', L2, { x: 100, y: 120, w: 1340, fs: 25, title: 'TestH1SingleConnVsH2Multiplexing', t0: B('g4', -0.2), times: L2.map((x, i) => i < 9 ? A('g4', 'handler', 0) + i * 0.9 : A('g5', 'measure', 0) + (i - 9) * 0.5) });
    c2.hl(0, A('g4', 'handler', 0)); c2.hl(3, A('g4', 'unstarted', 0)); c2.hl(4, A('g4', 'enable', 0)); c2.hl(5, A('g4', 'start', 0)); c2.hl(6, A('g4', 'trusts', 0)); c2.hl(7, A('g4', 'plain', 0)); c2.hl(8, A('g4', 'max conns', 0));
    c2.hl(12, A('g5', 'under half', 0)); c2.hl(13, A('g5', 'seventy', 0)); c2.out(End('g5', 0.3));
    ev('gm', 'measured on this machine', ['HTTP/1.1, 1 connection: 313 ms (ideal 300)', 'HTTP/2, 1 connection: 68 ms (ideal 50) ✓', 'go vet clean · go test -race passes'], 90, 90, 1300, '#3ddc84', [A('g6', 'three hundred', 0), A('g6', 'sixty eight', 0), A('g6', 'sixty eight', 1.5)], End('g6', 0.3));
    ev('gp', 'pitfalls', ['forgot resp.Body.Close() → leaked connections', 't.Fatalf inside a goroutine ✗ (use t.Errorf)', 'no MaxConnsPerHost → Go quietly opens extra connections', 'HTTP/3 not in the stdlib (Go 1.24): x/net/http3 or quic-go'], 90, 320, 1400, '#ffb066', [A('g6', 'forgetting', 0), A('g6', 'calling', 0), A('g6', 'leaving', 0), A('g6', 'standard library', 0)], End('g6', 0.3));
  });

  /* ===== S8 trade-offs, failures, monitoring ===== */
  blk('f1', 'd1', () => {
    ev('to', 'the trade-offs', ['HTTP/2 + 3: frame parsing · per-stream + per-connection flow control · a QUIC stack', 'QUIC loss recovery runs in user space → more CPU per byte', 'pick 1.1: you control both ends · no multiplexing · debugging (readable on the wire)'], 90, 90, 1450, '#ffb066', [A('f1', 'complexity', 0), A('f1', 'user space', 0), A('f1', 'pick', 0)], B('f2', 0));
    cam(B('f2', -0.3), 1.8, 'gus'); walkN('zara', B('f2', 0.2), 3.0, 3800); walkN('ravi', B('f2', 0.4), 3.0, 3700);
    wl('s4', '🛡️ Gus: the corporate firewall only knows TCP', '#f87171', 4000, 400, A('f2', 'firewall', 0), 34);
    ask('udp', 'UDP 443 ✗', '#ff7b7b', 3500, 560, 3850, 560, A('f2', 'block', 0), 1.6); ask('tcp', 'TCP 443 ✓', '#3ddc84', 3500, 640, 4200, 640, A('f2', 't c p', 0.3), 1.6);
    ev('gu', 'what the client must do', ['UDP/443 blocked or throttled by the middlebox', 'client MUST fall back to HTTP/2 over TCP', 'Alt-Svc header advertises HTTP/3 → fallback is explicit, not silent ✓'], 90, 90, 1400, '#f87171', [A('f2', 'block', 0), A('f2', 'fall', 0), A('f2', 'alt svc', 0)], B('f3', 0));
    hide('s4', B('f3', 0), 0.4);
    ev('fa', 'failure 1: loss on one stream', ['one slow stream degrades the whole HTTP/2 connection ✗', 'fix: prefer HTTP/3 on lossy networks', 'or open a 2nd HTTP/2 connection for latency-sensitive traffic ✓'], 90, 90, 1400, '#ff7b7b', [A('f3', 'single', 0), A('f3', 'fix', 0), A('f3', 'second', 0)], B('f4', 0));
    for (let i = 0; i < 6; i++) ask('rst' + i, 'RST_STREAM', '#ff7b7b', 3450, 480 + i * 45, 3900, 480 + i * 45, A('f4', 'flood', 0) + i * 0.3, 0.8);
    ev('fb', 'failure 2: Rapid Reset (CVE-2023-44487)', ['flood of cheap RST_STREAM frames → CPU exhausted ✗', 'fix: rate-limit stream resets per connection', 'fix: cap SETTINGS_MAX_CONCURRENT_STREAMS ✓'], 90, 90, 1400, '#ff7b7b', [A('f4', 'flood', 0), A('f4', 'rate', 0), A('f4', 'cap', 0)], B('f5', 0));
    ev('fc', 'failure 3: silent fallback', ['UDP blocked by a middlebox → silently falls back to TCP', 'rely on the client fallback via Alt-Svc', 'never assume HTTP/3 reached the server ✗'], 90, 90, 1400, '#ffb066', [A('f5', 'blocked', 0), A('f5', 'rely', 0), A('f5', 'never', 0)], B('f6', 0));
    ev('pd', 'in production', ['Go net/http negotiates HTTP/2 automatically over TLS', 'gRPC needs HTTP/2 · CDNs serve HTTP/3 at the edge'], 90, 90, 1400, '#7ee0ff', [A('f6', 'go', 0), A('f6', 'cloudflare', 0)], End('f6', 0.3));
    ev('mo', 'what to monitor', ['negotiated protocol per response (resp.Proto)', 'concurrent streams per connection', 'stream reset rate', 'QUIC packet loss + retransmission at the edge'], 90, 270, 1400, '#3ddc84', [A('f6', 'negotiated', 0), A('f6', 'concurrent', 0), A('f6', 'stream reset', 0), A('f6', 'quic packet', 0)], End('f6', 0.3));
  });

  /* ===== S9 deep dive ===== */
  cam(B('d1', -2), 1.2, 'hq'); jump('zara', B('d1', -1.5), 380); jump('ravi', B('d1', -1.5), 270);
  blk('d1', 'q0', () => {
    P('dd1', 'Why pipelining really failed', 'responses return in order → one stuck response wedges the connection · HTTP/2 frames each stream alone', 60, 90, 1450, 120, '#ffd166', 'd1', 'responses');
    P('dd2', 'Flow control: per stream AND per connection', 'WINDOW_UPDATE gives every stream its own window · one greedy stream cannot starve the others', 60, 225, 1450, 120, '#22d3ee', 'd2', 'window update');
    P('dd3', 'QUIC 0-RTT has a replay caveat', 'a captured first packet can be replayed · accept 0-RTT only for idempotent GETs, never state changes', 60, 360, 1450, 120, '#ff7b7b', 'd3', 'replay');
    P('dd4', 'Compression side channels (CRIME, BREACH)', 'size leaks secrets · never compress sensitive headers with attacker-controlled ones across a trust boundary', 60, 495, 1450, 120, '#c084fc', 'd4', 'compression');
    P('dd5', 'Priority: the RFC 9218 extensible scheme', 'urgency 0 to 7 + an incremental flag · a server may ignore it and stay conformant', 60, 630, 1450, 120, '#3ddc84', 'd5', 'uncertain');
  });

  /* ===== S10 interview ===== */
  ['boardBg', 'cb0', 'cb1', 'cb2', 'cb3'].forEach((k) => hide(k, B('q0', -0.4), 0.4));
  blk('q0', 's0', () => {
    qa([
      ['Did HTTP/2 solve head-of-line blocking?', 'Only at the HTTP layer · streams share one TCP byte stream, so one lost segment stalls all · HTTP/3 isolates loss per stream', 'iq1', 'did'],
      ['Why did browsers never use pipelining?', 'Responses must return in order, so one slow one blocks the rest, and middlemen mishandled it · parallel connections were safer', 'iq2', 'why'],
      ['What does HPACK compress, and why not just gzip?', 'Table indexes + Huffman · gzip over mixed secret and attacker headers leaked by size (CRIME, BREACH)', 'iq3', 'what'],
      ['Trap: is HTTP/3 just HTTP over UDP with no reliability?', 'No · QUIC adds reliable delivery, congestion control and encryption per stream · UDP escapes TCP-wide ordering', 'iq4', 'trap'],
      ['Why is server push deprecated?', 'Pushed files were usually already cached: wasted bandwidth, confused invalidation · Chrome removed it in 2022 · use preload', 'iq5', 'why'],
      ['What changes in a Go server for HTTP/2 vs HTTP/3?', 'Nothing for 2: net/http negotiates h2 over TLS via ALPN · 3 needs a QUIC module, a different transport', 'iq6', 'what'],
      ['A client on flaky Wi-Fi stalls mid download. Best fix?', 'Move to HTTP/3 · loss is isolated per stream, and the connection ID survives the switch to cellular', 'iq7', 'flaky'],
    ]);
  });

  /* ===== S11 summary ===== */
  blk('s0', 's1a', () => {
    wl('ok1', '🕚 11:59 · HTTP/3 switched on at the edge, HTTP/2 as the fallback', '#ffd166', 520, 290, A('s0', 'eleven', 0), 32);
    wl('ok2', '🎟️ 12:00 · the sale opens · the page loads · tickets sell', '#3ddc84', 520, 220, A('s0', 'noon', 0), 34);
    walkN('zara', B('s0', 0.2), 0.5, 380);
  });
  blk('s1a', 'rn1', () => {
    summary('CASE CLOSED · SUMMARY', [
      ['HTTP/1.1: one request at a time per connection · browsers opened 6 · pipelining failed', 's1a', '#fbbf24'],
      ['HTTP/2: many streams on ONE TCP connection · binary frames · HPACK', 's1b', '#22d3ee'],
      ['It fixes blocking only at the HTTP layer · one lost TCP segment still stalls every stream', 's1c', '#ff7b7b'],
      ['HTTP/3: the same model over QUIC on UDP · loss recovery per stream · QPACK', 's1d', '#a78bfa'],
      ['QUIC: 1 RTT new, 0-RTT resumed (replay caveat) · migrates by connection ID', 's1e', '#c084fc'],
      ['Server push is dead · use preload or 103 Early Hints · keep a fallback via Alt-Svc', 's1f', '#ffb066'],
      ['KEEP: each version fixes the last one’s bottleneck · 2 shares a connection, 3 stops one lost packet stalling all', 's1g', '#3ddc84'],
    ]);
  });
  /* ===== S12 next ===== */
  blk('rn1', 'e1', () => {
    readNext('rn1', [['📘 note: HTTP-1.1 vs HTTP-2 vs HTTP-3  +  its Go note', 'note', '#7ee0ff'], ['⬅ before: TCP · HTTP Fundamentals · UDP and QUIC', 'before', '#ffd166'], ['➡ after: TLS and HTTPS · HTTP Caching', 'after', '#3ddc84'], ['↔ compare: gRPC · Network Debugging Toolkit', 'compare', '#c084fc']]);
  });
  cam(B('e1', -0.4), 1.4, 'hq'); wave('ravi', B('e1', 0.5)); wave('zara', B('e2', 0.5));
  endTitle('HTTP/1.1 · HTTP/2 · HTTP/3', 'each version fixes the last one’s bottleneck', 'e2');
})();
