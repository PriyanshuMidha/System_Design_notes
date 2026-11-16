/* TCP: "The Midnight Postcards". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  // ---------- the postal road: depot (left) -> warden -> watchtower -> hospital (right) ----------
  world(3400, { sky: '#0a1030', skyMid: '#2a2f6a', skyLow: '#7a5a7a' });
  bld('bT', 330, '#1e3a5f', 'TARA · POST DEPOT', '📮'); bld('bC', 1500, '#7c2d12', 'CORA · ROAD CHECKPOINT', '🚦'); bld('bK', 2250, '#334155', 'KIP · WATCHTOWER', '🔭'); bld('bR', 3000, '#14532d', 'REX · HOSPITAL', '🏥');
  const CFG = {
    tara: { who: 'TARA', skin: '#c98d5b', shirt: '#2563eb', pants: '#1e293b', hat: 'cap', hatColor: '#1e3a8a', hair2: 'long', hold: '✉️', w: 96, name: 'Tara', ring: '#60a5fa' },
    remy: { who: 'REMY', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Remy', ring: '#4ade80' },
    rex: { who: 'REX', skin: '#e8b48a', shirt: '#f1f5f9', pants: '#334155', glasses: 1, hair: '#666', hold: '📋', w: 108, name: 'Rex', ring: '#86efac' },
    cora: { who: 'CORA', skin: '#f1c9a5', shirt: '#ea580c', pants: '#2a2540', hat: 'cap', hatColor: '#c2410c', hair2: 'long', hold: '🚦', w: 94, name: 'Cora', ring: '#fb923c' },
    nate: { who: 'NATE', skin: '#e3b08a', shirt: '#a16207', pants: '#444', apron: '#fde68a', hair: '#555', hold: '📦', w: 112, name: 'Nate', ring: '#facc15' },
    kip: { who: 'KIP', skin: '#9b6a47', shirt: '#475569', pants: '#222', hat: 'cap', hatColor: '#0f172a', hold: '🔦', w: 108, name: 'Kip', ring: '#94a3b8' },
  };
  cast(CFG, { tara: [420], remy: [300], nate: [600], cora: [1520], kip: [2270], rex: [3020] });
  views({ depot: { x: 520, y: 520, s: 0.95 }, wide: { x: 1700, y: 470, s: 0.46 }, road: { x: 1300, y: 500, s: 0.62 }, warden: { x: 1550, y: 520, s: 0.95 }, tower: { x: 2250, y: 520, s: 0.95 }, hosp: { x: 2900, y: 520, s: 0.95 }, both: { x: 1700, y: 500, s: 0.58 } });
  camTw(0, 0.001, { x: 520, y: 520, s: 0.95 });
  const stamp = board('MIDNIGHT DELIVERY', [['🤝', 'connected'], ['📮', 'reliable'], ['🪑', 'flow'], ['🚦', 'congestion'], ['👋', 'closed']], 1500, 650, B('l4', 0));
  // a postcard flies along the road
  const card1 = (id, label, t, x1, x2, d, y) => { bubble(id, label, '#ffd166', x1, y || 600); fly(id, t, [[x1, y || 600], [x2, y || 600]], d, { arc: 50 }); hide(id, t + d, 0.25); };

  /* S1: the deadline */
  blk('l1', 'l8', () => {
    wl('clk', '🕙 10 PM → midnight: 50 pages, 500 postcards', '#ffd166', 1700, 250, A('l1', 'ten', -0.2), 70);
    for (let i = 0; i < 12; i++) { em('pc' + i, '✉️', 56, 0, 0); fly('pc' + i, A('l1', 'cuts', 0.2) + i * 0.35, [[460, 700], [1500, 640 + (i % 3) * 30], [2950, 700]], 6.0, { arc: 40 + (i % 4) * 20 }); hide('pc' + i, A('l1', 'cuts', 6.4 + i * 0.35), 0.3); }
    wl('lost', '❌ lost', '#ff5d5d', 1400, 540, A('l2', 'lost', 0), 70); wl('twice', '✉️✉️ twice', '#ffb066', 1900, 520, A('l2', 'twice', 0), 60); wl('rnd', '🔀 random order', '#ffd166', 1650, 440, A('l2', 'random', 0), 60);
    ['lost', 'twice', 'rnd'].forEach((i) => hide(i, B('l3', 0.2), 0.4));
    C('t4', 'TCP: number them · ask “which did you get?” · resend the missing', 1700, 330, '#3ddc84', 'l4', 'numbers', 1000, -0.4);
    cam(B('l5', -0.3), 1.6, 'depot');
    [['segment: one chunk ≈ 1,460 bytes', 'segment', '#7ee0ff'], ['IP: moves packets · no promises', 'i p', '#ffb066'], ['port: a program · socket: its handle (net.Conn)', 'port', '#c084fc']].forEach((w, i) => C('wa' + i, w[0], 1000, 170 + i * 75, w[2], 'l5', w[1], 760, 0)); ['wa0', 'wa1', 'wa2'].forEach((i) => hide(i, B('l6', -0.2), 0.4));
    [['ACK: “I got data up to here”', 'a c k', '#3ddc84'], ['RTT: a round trip · 40 ms Mumbai ↔ Singapore', 'r t t', '#ffd166'], ['buffer: where received bytes wait', 'buffer', '#7ee0ff'], ['window: bytes allowed before waiting for an ACK', 'window', '#ff9f6b']].forEach((w, i) => C('wb' + i, w[0], 1000, 170 + i * 75, w[2], 'l6', w[1], 760, 0)); ['wb0', 'wb1', 'wb2', 'wb3'].forEach((i) => hide(i, B('l7', -0.2), 0.4));
    C('ph', '“got it up to page 12” · “slow down, my notebook is full”', 1000, 260, '#3ddc84', 'l7', 'phone', 880, -0.2);
  });

  /* S2: why TCP exists */
  blk('l8', 'l12', () => {
    cam(B('l8', -0.3), 1.8, 'road');
    ev('ip', 'IP alone promises nothing', ['a packet can be dropped ✗', 'duplicated ✗', 'delivered out of order ✗', 'no idea what “a connection” is'], 700, 90, 800, '#ff7b7b', [A('l8', 'dropped', 0), A('l8', 'duplicated', 0), A('l8', 'order', 0), A('l8', 'connection', 0)], B('l9', 0));
    ev('g3', 'TCP gives every byte stream three guarantees', ['1  reliable delivery: lost segments are retransmitted', '2  ordering: bytes arrive in the order sent', '3  flow control: a fast sender cannot flood a slow receiver ✓'], 700, 90, 1000, '#3ddc84', [A('l9', 'reliable', 0), A('l9', 'ordering', 0), A('l9', 'flow', 0)], B('l10', 0));
    ev('c4', 'a FOURTH mechanism', ['congestion control: NOT a guarantee to the app', 'it protects the NETWORK from the senders using it'], 700, 90, 900, '#fb923c', [A('l10', 'fourth', 0), A('l10', 'protects', 0)], B('l11', 0));
    ev('wr', 'conn.Write(...)', ['arrives byte-for-byte and in order ✓', 'or the connection is torn down with an error ✗'], 700, 90, 900, '#7ee0ff', [A('l11', 'write', 0), A('l11', 'or', 0)], End('l11', 0.4));
  });

  /* S3: the mental model */
  blk('l12', 'l16', () => {
    cam(B('l12', -0.3), 2.0, 'both');
    wl('tl', 'next byte: 1,460,001 · I have everything up to 980,000', '#ffd166', 1700, 300, A('l12', 'segment', 0), 44);
    ring('rw', 3020, 330, 70, '#86efac', 'ears', A('l13', 'receive', -0.2), 8); wl('rwL', 'receive window = Rex’s EARS', '#86efac', 3020, 450, A('l13', 'ears', 0), 36);
    pulse('cora', A('l14', 'congestion', 0)); wl('cwL', 'congestion window = the road’s capacity · found by trial and error', '#fb923c', 1520, 330, A('l14', 'number', 0), 40);
    C('mn', 'send at most min(receive window, congestion window)', 1700, 210, '#ffd166', 'l15', 'smaller', 900, -0.3);
  });

  /* S4: the three-way handshake */
  blk('l16', 'l23', () => {
    cam(B('l16', -0.3), 2.0, 'wide');
    wl('isn', '🎲 each side picks a RANDOM initial sequence number', '#c084fc', 1700, 260, A('l16', 'random', -0.2), 52);
    ask('s1', 'SYN  seq=1000', '#60a5fa', 470, 560, 2960, 560, B('l17', 0.4), 2.6); ask('s2', 'SYN-ACK  seq=5000 · ack=1001', '#86efac', 2960, 640, 470, 640, B('l18', 0.6), 2.8); ask('s3', 'ACK  ack=5001', '#60a5fa', 470, 720, 2960, 720, B('l19', 0.4), 2.6);
    stamp(0, A('l19', 'connected', 0.3), true, ' ');
    ev('ak', 'what ack=1001 means', ['“I have everything through byte 1000 · send 1001 next”', 'a SYN or FIN consumes one sequence number', 'SYN-ACK = “I ack your SYN” + “here is my SYN” in ONE segment'], 330, 90, 1300, '#7ee0ff', [A('l20', 'ack', 0), A('l20', 'consumes', 0), A('l21', 'combines', 0)], End('l21', 0.4));
    ev('rt', 'the handshake is not free', ['one full round trip before any data · tens of ms across regions', 'measured: connect + write + echo + read on loopback = 331 µs'], 330, 90, 1300, '#ffd166', [A('l22', 'cost', 0), A('l22', 'machine', 0)], End('l22', 0.4));
  });

  /* S5: reliability */
  blk('l23', 'l31', () => {
    cam(B('l23', -0.3), 2.0, 'wide');
    [['1000–1999', 400], ['2000–2999', 700], ['3000–3999', 1000], ['4000–4999', 1300]].forEach((p, i) => { bubble('n' + i, p[0], '#ffd166', 470, 560 + i * 0, {}); fly('n' + i, A('l23', 'byte', 0.2) + i * 0.7, [[470, 560], [i === 1 ? 1700 : 2950, 560]], i === 1 ? 2.2 : 4.0, { arc: 50 }); hide('n' + i, A('l23', 'byte', 0.2) + i * 0.7 + (i === 1 ? 2.2 : 4.0), 0.25); });
    wl('lostx', '❌ lost on the road', '#ff5d5d', 1700, 480, A('l23', 'byte', 2.4), 60); hide('lostx', B('l24', 0.5), 0.4);
    ask('ak1', 'ack 2000  (still missing 2000–2999)', '#86efac', 2950, 640, 470, 640, B('l24', 0.5), 3.0);
    ev('sk', 'SACK: selective acknowledgement', ['I have 1000–1999 and 3000–3999', 'still missing 2000–2999', '→ the sender resends ONLY the gap ✓'], 330, 90, 1100, '#c084fc', [A('l25', 'ranges', 0), A('l25', 'still', 0), A('l25', 'only', 0)], B('l26', 0));
    ring('rto', 330, 300, 70, '#ffb066', '80 ms', A('l26', 'timer', -0.2), 5);
    ev('ro', 'retransmission timer (RTO) · RFC 6298', ['RTO = SRTT + 4 × RTTVAR  (never a fixed number)', 'SRTT 40 ms + 4 × 10 ms = 80 ms', 'no ACK in 80 ms → resend · TCP has NO negative ack'], 520, 90, 1100, '#ffb066', [A('l26', 'computed', 0), A('l27', 'forty', 0), A('l27', 'absence', 0)], B('l28', 0));
    ev('fr', 'fast retransmit', ['3 duplicate ACKs for the same byte', 'the receiver: “I keep getting data beyond a gap”', '→ resend at once, no timer wait ✓'], 520, 90, 1100, '#3ddc84', [A('l28', 'three', 0), A('l28', 'keeps', 0), A('l28', 'fast', 0)], B('l30', -0.2));
    for (let i = 0; i < 3; i++) ask('dup' + i, 'ack 2000', '#86efac', 2950, 580 + i * 40, 470, 580 + i * 40, A('l28', 'three', 0.3) + i * 0.5, 2.0);
    ask('rs', '2000–2999 again!', '#ff9f6b', 470, 760, 2950, 760, B('l29', 0.4), 2.4);
    C('cm', '✗ an ACK does NOT mean “I received segment N” · it is cumulative', 1700, 780, '#ff7b7b', 'l30', 'mistake', 1100, -0.2);
    stamp(1, A('l30', 'reports', 0.3), true, ' ');
  });

  /* S6: flow control */
  blk('l31', 'l36', () => {
    cam(B('l31', -0.3), 2.0, 'hosp');
    ui('nb', rect(0, 0, 640, 300, 'rgba(14,18,30,.94)', { rx: 18, stroke: '#86efac', sw: 4 }) + T("Rex's notebook (receive buffer)", 28, '#86efac', { dx: 320, dy: 36 }), 90, 90, {}); pop('nb', A('l31', 'flow', -0.2));
    ['window 64 KB', 'window 8 KB', 'window 2 KB', 'window 0'].forEach((w, i) => { ui('wn' + i, T(w, 44, ['#86efac', '#ffd166', '#ffb066', '#ff5d5d'][i], { anchor: 'start', font: mono }), 130, 200 + 0, {}); });
    ['wn0', 'wn1', 'wn2', 'wn3'].forEach((id, i) => { tw(id, B('l31', 0.6) + (i === 0 ? 0 : 0), 0.01, { o: 0 }); });
    tw('wn0', A('l31', 'advertises', 0), 0.3, { o: 1 }); tw('wn0', A('l32', 'filling', -0.3), 0.3, { o: 0 }); tw('wn1', A('l32', 'filling', -0.3), 0.3, { o: 1 }); tw('wn1', A('l32', 'only', -0.3), 0.3, { o: 0 }); tw('wn2', A('l32', 'only', -0.3), 0.3, { o: 1 });
    tw('wn2', A('l33', 'zero', -0.3), 0.3, { o: 0 }); tw('wn3', A('l33', 'zero', -0.3), 0.3, { o: 1 });
    ask('wv', '“window: 2,000 bytes”', '#ffb066', 2980, 540, 520, 540, A('l32', 'window', -0.4), 2.4);
    wl('stp', '⛔ zero window: STOP', '#ff5d5d', 1500, 330, A('l33', 'zero', 0), 70);
    ask('zp', '1-byte probe: “room yet?”', '#7ee0ff', 480, 700, 2950, 700, A('l34', 'probe', 0), 3.0); ask('zr', 'window: 8,000', '#86efac', 2950, 760, 480, 760, A('l34', 'probe', 3.2), 2.8);
    ev('wc', 'the Go model: three numbers', ['NextSeq    next byte to send', 'UnackedAt  oldest byte not yet ACKed', 'RecvWin    what the receiver can still buffer'], 90, 420, 900, '#7ee0ff', [A('l35', 'three', 0), A('l35', 'oldest', 0), A('l35', 'window', 0.8)], End('l35', 0.4));
    stamp(2, A('l35', 'window', 1.0), true, ' ');
  });

  /* S7: congestion control, Cora's road */
  blk('l36', 'l47', () => {
    cam(B('l36', -0.3), 2.0, 'warden');
    ui('cwb', rect(0, 0, 1260, 520, 'rgba(8,12,24,.9)', { rx: 18, stroke: '#fb923c', sw: 4 }) + T('cwnd (segments)  ·  Cora’s road', 28, '#fb923c', { dx: 630, dy: 34 }), 90, 80, {}); pop('cwb', A('l36', 'congestion', -0.2));
    const BARS = [[1, 'one'], [2, 'two'], [4, 'four'], [8, 'eight'], [16, 'sixteen'], [32, 'thirty'], [64, 'sixty']];
    BARS.forEach((b, i) => { const h = Math.max(8, b[0] * 6.4); ui('bar' + i, rect(0, 0, 100, h, '#fb923c', { rx: 6 }) + T(String(b[0]), 26, '#fff', { dx: 50, dy: -18 }), 150 + i * 130, 560 - h, {}); pop('bar' + i, A('l37', b[1], -0.1)); });
    C('ssl', 'slow start: cwnd DOUBLES every RTT · until ssthresh (64) or a loss', 700, 650, '#ffd166', 'l38', 'slow', 1000, -0.2);
    [[65, 'sixty five'], [66, 'sixty six'], [67, 'sixty seven']].forEach((b, i) => { ui('ca' + i, rect(0, 0, 60, 410 + i * 6, '#3ddc84', { rx: 6 }) + T(String(b[0]), 24, '#fff', { dx: 30, dy: -18 }), 1060 + i * 70, 560 - 410 - i * 6, {}); pop('ca' + i, A('l39', b[1], -0.1)); });
    C('ci', 'congestion avoidance: +1 segment per RTT', 700, 720, '#3ddc84', 'l40', 'additive', 760, -0.2);
    hide('ssl', A('l41', 'lost', -0.3), 0.3); hide('ci', A('l41', 'lost', -0.3), 0.3);
    wl('los', '❌ LOSS at cwnd 70', '#ff5d5d', 1550, 330, A('l41', 'lost', 0), 64);
    ev('ml', 'multiplicative decrease', ['3 duplicate ACKs → fast retransmit', 'ssthresh = 70 / 2 = 35', 'cwnd → 1 (timeout) or → ssthresh (fast retransmit)', 'slow start again, now stopping at 35 not 64 ✓'], 90, 620, 1200, '#ff9f6b', [A('l42', 'three', 0), A('l42', 'threshold', 0.5), A('l42', 'drops', 0), A('l42', 'stops', 0)], B('l43', 0));
    ev('cu', 'Reno → CUBIC (Linux default)', ['Reno: additive increase, multiplicative decrease (RFC 5681)', 'CUBIC: cubic function of time since the last loss', 'fast after a loss · flat near the old loss point · fast again', 'better on long-distance, high-bandwidth paths ✓'], 90, 620, 1200, '#7ee0ff', [A('l43', 'reno', 0), A('l43', 'cubic', 0), A('l43', 'fast', 0), A('l43', 'better', 0)], B('l44', 0));
    ev('bb', 'BBR (Google): does NOT wait for loss', ['loss-based: every drop = congestion', 'bufferbloat: packets queue for 100s of ms before any drop', 'lossy Wi-Fi / satellite: loss is just noise', 'BBR models bottleneck delivery rate + minimum RTT ✓'], 90, 620, 1200, '#c084fc', [A('l44', 'loss', 0), A('l44', 'bufferbloat', 0), A('l44', 'wi', 0), A('l45', 'models', 0)], B('l46', 0));
    ev('tr', 'trap: two different windows', ['flow control protects the RECEIVER’s buffer', 'congestion control protects the NETWORK path', 'effective window = min(cwnd, rwnd)'], 90, 620, 1200, '#ffd166', [A('l46', 'flow', 0), A('l46', 'congestion', 0), A('l46', 'minimum', 0)], End('l46', 0.4));
    stamp(3, A('l46', 'minimum', 0.5), true, ' ');
  });

  /* S8: Nate and Kip */
  blk('l47', 'l54', () => {
    cam(B('l47', -0.3), 2.0, 'depot');
    for (let i = 0; i < 3; i++) { em('spk' + i, '✉️', 50, 650 + i * 40, 560); pop('spk' + i, A('l47', 'small', 0) + i * 0.3); }
    C('ng', 'Nagle: hold a small write while data is in flight · pack them together', 1100, 260, '#facc15', 'l47', 'pack', 900, -0.3);
    ev('dl', 'Nagle × delayed ACK', ['Nagle holds the small request (data is “in flight”)', 'the reply’s ACK is held, waiting to piggyback', 'the timers compound: tens to hundreds of ms', 'a request/response latency problem, not throughput ✗'], 700, 90, 1100, '#ff9f6b', [A('l48', 'nagle', 0), A('l48', 'forty', 0), A('l48', 'stack', 0), A('l48', 'anti', 0)], B('l49', 0));
    C('nd', 'conn.SetNoDelay(true) → TCP_NODELAY → small writes leave at once', 1100, 260, '#3ddc84', 'l50', 'no', 900, -0.2); tw('spk0', A('l49', 'now', 0), 1.5, { x: 1500 });
    cam(B('l51', -0.3), 2.0, 'tower');
    for (let i = 0; i < 3; i++) ask('kp' + i, '🔦 still there?', '#94a3b8', 2300, 560 + i * 40, 2980, 560 + i * 40, A('l52', 'probes', 0) + i * 1.0, 1.4);
    wl('dead', '✗ no reply after N retries → close', '#ff7b7b', 2500, 330, A('l52', 'retries', 0), 44);
    ev('ka', 'keepalive (SO_KEEPALIVE)', ['an idle connection looks the same: fine · crashed · NAT forgot it', 'Go 1.23: net.Dialer.KeepAliveConfig → idle · interval · retries', 'a transport heartbeat, NOT application health ✗'], 330, 90, 1200, '#94a3b8', [A('l51', 'idle', 0), A('l52', 'go', 0), A('l53', 'transport', 0)], End('l53', 0.4));
  });

  /* S9: closing */
  blk('l54', 'l61', () => {
    cam(B('l54', -0.3), 2.0, 'wide');
    ask('f1', 'FIN · I have sent everything', '#60a5fa', 470, 560, 2960, 560, B('l55', 0.3), 2.6); ask('f2', 'ACK', '#86efac', 2960, 620, 470, 620, B('l56', 0.2), 2.6); ask('f3', 'FIN · from me too', '#86efac', 2960, 700, 470, 700, B('l56', 2.0), 2.6); ask('f4', 'ACK · goodbye', '#60a5fa', 470, 780, 2960, 780, B('l57', 0.3), 2.6);
    C('fd', 'full-duplex: “I am done sending” while still receiving · 4 segments, not 3', 1700, 250, '#7ee0ff', 'l54', 'duplex', 1100, 0);
    ring('tw', 470, 330, 80, '#ffd166', '2×MSL', A('l58', 'wait', -0.2), 7); wl('twl', 'TIME_WAIT · the active closer waits ≈ 60 s on Linux', '#ffd166', 1000, 330, A('l58', 'wait', 0), 40);
    ev('tm', 'why TIME_WAIT', ['a delayed duplicate FIN must still find a socket to re-ACK', 'old segments must expire before the same 4-tuple is reused'], 330, 90, 1100, '#ffd166', [A('l59', 'delayed', 0), A('l59', 'old', 0)], B('l60', 0));
    C('tx', '✗ many short connections pile up TIME_WAIT → pool + keep-alive reuse · SO_REUSEADDR', 1700, 780, '#ff7b7b', 'l60', 'many', 1300, -0.2);
    stamp(4, A('l60', 'reuse', 0.5), true, ' ');
  });

  /* S10: head-of-line blocking, bytes not messages */
  blk('l61', 'l65', () => {
    cam(B('l61', -0.3), 2.0, 'wide');
    for (let i = 0; i < 6; i++) { em('hl' + i, '✉️', 70, 1300 + i * 110, 640); pop('hl' + i, A('l61', 'byte', 0) + i * 0.15); }
    wl('hlx', '❌ byte 9,999 lost → 10,000 and everything behind it WAITS', '#ff5d5d', 1700, 430, A('l62', 'lost', -0.3), 48);
    for (let i = 1; i < 6; i++) tw('hl' + i, A('l62', 'stalls', 0), 0.4, { o: 0.35 });
    C('h2', 'HTTP/2 multiplexes many requests on ONE connection → one loss stalls them all · QUIC fixes it', 1700, 250, '#ffb066', 'l62', 'multiplexes', 1300, -0.5);
    ev('bs', 'bytes, not messages', ['ONE large write can arrive split across several reads', 'SEVERAL small writes (Nagle) can arrive as ONE read', 'protocols needing boundaries (HTTP …) frame them themselves ✓'], 330, 90, 1200, '#7ee0ff', [A('l64', 'large', 0), A('l64', 'small', 0), A('l64', 'frame', 0)], End('l64', 0.4));
  });

  /* S11: reading a live connection */
  blk('l65', 't1', () => {
    cam(B('l65', -0.3), 1.6, 'depot');
    ev('ss', 'ss -tin dst 10.0.4.12', ['ESTAB  10.0.4.7:51342 → 10.0.4.12:443', 'cubic wscale:7,7 rto:204 rtt:3.4/1.1 mss:1448 cwnd:40 ssthresh:28', 'bytes_sent:184320 bytes_retrans:1448 bytes_acked:182872', 'cwnd 40 ≈ 58 KB in flight · ssthresh 28 → a loss already happened'], 90, 90, 1400, '#2dd4bf', [A('l65', 'cubic', 0), A('l65', 'cubic', 0.4), A('l66', 'bytes', 0), A('l65', 'allowed', 0)], A('l67', 'table', -0.3));
    ev('al', 'choosing an algorithm', ['Reno      legacy baseline · slow recovery on fast links', 'CUBIC     Linux default · general purpose, long-distance', 'BBR       lossy / bufferbloated links · aggressive vs loss-based flows', 'Vegas     infers congestion from RTT growth · research, rarely deployed'], 90, 90, 1400, '#7ee0ff', [A('l67', 'reno', 0), A('l67', 'cubic', 0), A('l67', 'b', 0.2), A('l67', 'vegas', 0)], End('l67', 0.4));
  });

  /* S12: trade-offs, failures, monitoring */
  blk('t1', 'd1', () => {
    cam(B('t1', -0.3), 1.6, 'both');
    ev('t1', 'trade-offs', ['ordering is a liability: one loss stalls everything behind it', 'handshake + slow start cost time before full speed', 'a game position / live video frame: TCP is pure overhead → UDP, QUIC 0-RTT', 'fair by design: wrong for one operator’s private backbone → tuned congestion control'], 90, 90, 1400, '#ffb066', [A('t1', 'ordering', 0), A('t1', 'handshake', 0), A('t1', 'game', 0), A('t2', 'fair', 0)], B('t3', 0));
    ev('fl', 'production failures → fixes', ['bufferbloat → BBR, or active queue management (CoDel)', 'incast → smaller datacentre RTOs · request pacing and jitter', 'TIME_WAIT exhaustion → pooling and keep-alive reuse', 'silent peer death behind a NAT / firewall → tuned keepalive'], 90, 90, 1400, '#ff7b7b', [A('t3', 'bufferbloat', 0), A('t3', 'incast', 0), A('t4', 'time', 0), A('t4', 'silent', 0)], B('t5', 0));
    ev('mo', 'what to monitor', ['retransmission rate: bytes_retrans / bytes_sent', 'RTT and its variance · current cwnd (loss-limited?)', 'sockets stuck in TIME_WAIT / CLOSE_WAIT', 'SYN backlog drops on a listening socket under load'], 90, 90, 1400, '#3ddc84', [A('t5', 'retransmission', 0), A('t5', 'round', 0), A('t5', 'count', 0), A('t5', 'listen', 0)], End('t5', 0.4));
  });

  /* S13: deep dive */
  blk('d1', 'g1', () => {
    ev('dd1', 'cumulative ACK vs SACK', ['one number is cheap · but one gap makes later segments look out of order', 'SACK (RFC 2018): options naming the exact ranges received'], 90, 90, 1400, '#c084fc', [A('d1', 'cumulative', 0), A('d1', 's a c k', 0)], B('d2', 0));
    ev('dd2', 'why slow start is exponential', ['no information about the path → doubling finds the scale in ~log(capacity) RTTs', 'it can itself cause the first loss → ssthresh remembers where'], 90, 90, 1400, '#fb923c', [A('d2', 'unused', 0), A('d2', 'cost', 0)], B('d3', 0));
    ev('dd3', 'why BBR does not wait for loss', ['deep buffers: the sender overshoots for a while before any drop', 'target = the bandwidth-delay product: what the PIPE holds, not what the buffer holds'], 90, 90, 1400, '#7ee0ff', [A('d3', 'deep', 0), A('d3', 'targets', 0)], B('d4', 0));
    ev('dd4', 'Nagle × delayed ACK', ['a small request is held by Nagle, its ack by delayed ACK', 'tens to hundreds of ms · latency, not throughput'], 90, 90, 1400, '#facc15', [A('d4', 'small', 0), A('d4', 'timers', 0)], B('d5', 0));
    ev('dd5', 'MSS and path MTU', ['MSS is negotiated at the handshake from each side’s MTU', 'a smaller MTU mid-path (VPN, tunnel) is invisible then → PMTU discovery: “don’t fragment” + ICMP “too big”'], 90, 90, 1400, '#3ddc84', [A('d5', 'maximum', 0), A('d5', 'path', 0)], End('d5', 0.4));
  });

  /* S14: Go code */
  blk('g1', 'q0', () => {
    cam(B('g1', -0.3), 1.6, 'depot');
    const L1 = ['type Window struct {', '\tNextSeq   int // next byte the sender will send', '\tUnackedAt int // oldest byte not yet ACKed', '\tRecvWin   int // bytes the receiver can still buffer', '}', 'func (w *Window) CanSend() int {', '\tinFlight := w.NextSeq - w.UnackedAt', '\troom := w.RecvWin - inFlight', '\tif room < 0 { return 0 }; return room', '}', 'func (w *Window) OnAck(ackSeq, newRecvWin int) { w.UnackedAt = ackSeq; w.RecvWin = newRecvWin }'];
    const c1 = S.codePanel('c1', L1, { x: 130, y: 80, w: 1660, fs: 27, title: 'window.go', t0: B('g1', 0.3), times: L1.map((x, i) => A('g2', 'window', 0) + i * 0.5) });
    c1.hl(6, A('g2', 'computes', 0)); c1.hl(7, A('g2', 'room', 0)); c1.hl(10, A('g2', 'ack', 0)); c1.out(A('g3', 'sender', -0.3));
    const L2 = ['type Sender struct { Cwnd, Ssthresh float64; InSlowStart bool }', 'func NewSender() *Sender { return &Sender{Cwnd: 1, Ssthresh: 64, InSlowStart: true} }', 'func (s *Sender) OnACK() {', '\tif s.Cwnd < s.Ssthresh { s.Cwnd *= 2 } else { s.Cwnd += 1 } // slow start / congestion avoidance', '}', 'func (s *Sender) OnLoss() {', '\ts.Ssthresh = s.Cwnd / 2; if s.Ssthresh < 2 { s.Ssthresh = 2 }', '\ts.Cwnd = 1; s.InSlowStart = true // Reno-style decrease', '}'];
    const c2 = S.codePanel('c2', L2, { x: 130, y: 80, w: 1660, fs: 27, title: 'sender.go', t0: A('g3', 'sender', -0.2), times: L2.map((x, i) => A('g3', 'sender', 0.3) + i * 0.5) });
    c2.hl(3, A('g3', 'doubles', 0)); c2.hl(6, A('g4', 'threshold', 0)); c2.hl(7, A('g4', 'resets', 0)); c2.out(A('g5', 'socket', -0.3));
    const L3 = ['func Serve(ln net.Listener) error {', '\tconn, _ := ln.Accept()', '\ttc := conn.(*net.TCPConn)', '\ttc.SetNoDelay(true) // latency-sensitive: small writes leave at once', '\ttc.SetKeepAlive(true) // detect a silently dead peer', '\tio.Copy(conn, conn) // echo', '}', 'func DialAndRoundtrip(addr string, msg []byte) ([]byte, time.Duration, error) {', '\tstart := time.Now(); conn, _ := net.Dial("tcp", addr) // the 3-way handshake hides here', '\tconn.Write(msg); buf := make([]byte, len(msg)); io.ReadFull(conn, buf)', '\treturn buf, time.Since(start), nil // measured: 331 µs on loopback', '}'];
    const c3 = S.codePanel('c3', L3, { x: 130, y: 80, w: 1660, fs: 26, title: 'socket.go', t0: A('g5', 'socket', -0.2), times: L3.map((x, i) => A('g5', 'socket', 0.3) + i * 0.4) });
    c3.hl(3, A('g5', 'tunes', 0)); c3.hl(8, A('g5', 'dial', 0)); c3.hl(10, A('g5', 'elapsed', 0)); c3.out(End('g5', 0.3));
    C('gt', 'tests: slow start → congestion avoidance ✓ · loss halves ssthresh, resets cwnd ✓ · handshake + echo ✓ · go test -race', 960, 1000, '#3ddc84', 'g4', 'tests', 1500, -0.2);
  });

  /* S15: interview, Remy asks, Tara answers */
  blk('q0', 'f1', () => {
    qa([['Why 3 segments for the handshake, 4 for the close?', 'SYN-ACK combines two messages · a close cannot: full-duplex, each side may still have data', 'q1', 'three'], ['What is TIME_WAIT protecting against?', 'a delayed duplicate FIN, and old segments before the 4-tuple is reused · many short connections → pool', 'q3', 'time'], ['Flow control vs congestion control?', 'flow: the receiver’s advertised window · congestion: the sender’s cwnd estimate · obey the smaller', 'q5', 'flow'], ['Big cwnd, low throughput: what first?', 'the receive window: a slow reader or a small socket buffer caps it · ss -ti shows both', 'q7', 'big'], ['One write = one read?', 'no: a byte stream · writes split or coalesce · frame your messages', 'q9', 'one'], ['Why BBR over CUBIC, and the risk?', 'low queueing delay, faster recovery on lossy / bufferbloated paths · fairness: it can take more of a shared link', 'q11', 'b'], ['What does Nagle trade off? When disable it?', 'latency for fewer, larger packets · disable for small request/response protocols', 'q13', 'nagle']], '#60a5fa');
  });

  /* S16: delivered, summary, next */
  blk('f1', 'f3', () => {
    cam(B('f1', -0.3), 2.0, 'hosp');
    for (let i = 0; i < 50; i++) { em('fp' + i, '✉️', 40, 3100 + (i % 10) * 36, 600 + Math.floor(i / 10) * 40); pop('fp' + i, A('f1', 'arrives', 0) + i * 0.04); }
    ev('fin', '🕛 11:58 PM', ['pages received: 50 / 50', 'in order ✓   missing: 0 ✓', 'two minutes to spare'], 90, 90, 800, '#3ddc84', [A('f1', 'last', 0), A('f2', 'every', 0), A('f1', 'two', 0)], End('f2', 0.4));
  });
  blk('f3', 'rn1', () => {
    summary('MIDNIGHT DELIVERY · SUMMARY', [['TCP numbers every byte, waits for ACKs, resends what is missing, limits what is in flight', 'f3', '#60a5fa'], ['SYN · SYN-ACK · ACK with random ISNs · the close is 4 segments · TIME_WAIT for the active closer', 'f4', '#86efac'], ['ACKs are cumulative · SACK names the gap · resend on RTO (SRTT + 4×RTTVAR) or 3 dup ACKs', 'f5', '#ffd166'], ['flow = the receiver’s window · congestion = the sender’s cwnd · effective = min of the two', 'f6', '#fb923c'], ['slow start doubles → ssthresh → +1 per RTT · loss halves ssthresh · CUBIC default · BBR models the path', 'f7', '#c084fc'], ['Nagle batches · TCP_NODELAY disables · keepalive finds a dead peer · one lost segment blocks the stream', 'f8', '#facc15'], ['numbers every byte · waits for ACKs · resends what is missing · limits what is in flight', 'f9', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 notes: TCP - Handshake, Reliability, Flow and Congestion Control  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: How the Internet Works', 'before', '#ffd166'], ['➡ after: UDP and QUIC · TLS and HTTPS · HTTP Fundamentals', 'after', '#3ddc84'], ['↔ compare: Forward and Reverse Proxies (L4) · Network Debugging Toolkit', 'compare', '#c084fc']]); });
  cam(B('e1', -0.4), 1.4, 'depot'); wave('remy', B('e1', 0.5));
  endTitle('TCP', 'number it · acknowledge it · resend it · pace it', 'e2');
})();
