/* UDP and QUIC: "The Night of the Final". Written against story_engine.js + story_lib.js. */
(function () {
  const { A, B, End, GY, ui, wd, em, uem, chip, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, world, bld, cast, board, qa, summary, readNext, endTitle, wave, camTw, tw, hide } = H;

  world(5000, { sky: '#0b1030', skyMid: '#3a2f6e', skyLow: '#e0885a' });
  bld('bHQ', 300, '#1e3a5f', 'MIRA · HQ', '🕵️'); bld('bU', 1000, '#be185d', 'POSTCARD LANE · UDI (UDP)', '💌'); bld('bT', 1700, '#92400e', 'REGISTERED MAIL · TOM (TCP)', '📮');
  bld('bQ', 2400, '#0e7490', 'QUIC DEPOT · QUINN', '🚚'); bld('bAl', 2800, '#1f2937', 'ALLEY', '🌑', 0.55); bld('bS', 3200, '#6d28d9', 'PASSPORTS · TESS (TLS)', '🛂'); bld('bR', 3900, '#b91c1c', 'FIREWALL GATE · REX', '🚧');
  const CFG = {
    mira: { who: 'MIRA', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '💻', w: 96, name: 'Mira', ring: '#38bdf8' },
    kit: { who: 'KIT', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Kit', ring: '#4ade80' },
    udi: { who: 'UDI', skin: '#e3b08a', shirt: '#db2777', pants: '#333', hair: '#8a5a2a', hold: '💌', w: 100, name: 'Udi', ring: '#f472b6' },
    tom: { who: 'TOM', skin: '#9b6a47', shirt: '#a16207', pants: '#444', hat: 'cap', hatColor: '#92400e', hold: '📮', w: 112, name: 'Tom', ring: '#f59e0b' },
    quinn: { who: 'QUINN', skin: '#f1c9a5', shirt: '#0d9488', pants: '#2a2540', hat: 'cap', hatColor: '#115e59', hair2: 'long', hold: '🚚', w: 94, name: 'Quinn', ring: '#2dd4bf' },
    tess: { who: 'TESS', skin: '#f0c4a0', shirt: '#7c3aed', pants: '#2a2540', glasses: 1, hair: '#7a3b1a', hair2: 'long', hold: '🛂', blush: 1, w: 90, name: 'Tess', ring: '#a78bfa' },
    rex: { who: 'REX', skin: '#d9a37a', shirt: '#dc2626', pants: '#333', hat: 'cap', hatColor: '#7f1d1d', hold: '🚧', w: 108, name: 'Rex', ring: '#f87171' },
    mal: { who: 'MAL', skin: '#e8b48a', shirt: '#111827', pants: '#111', hat: 'cap', hatColor: '#000', glasses: 1, hold: '📸', w: 98, name: 'Mal', ring: '#9ca3af' },
  };
  cast(CFG, { mira: [380], kit: [270], udi: [1020], tom: [1720], quinn: [2420], mal: [2800], tess: [3220], rex: [3920] });
  views({ hq: { x: 520, y: 520, s: 0.9 }, wide: { x: 2200, y: 470, s: 0.38 }, ut: { x: 1500, y: 520, s: 0.75 }, ud: { x: 800, y: 520, s: 0.9 }, quinn: { x: 2300, y: 520, s: 0.85 }, tess: { x: 2900, y: 520, s: 0.8 }, mig: { x: 1900, y: 520, s: 0.65 }, gate: { x: 3300, y: 520, s: 0.7 }, mid: { x: 2800, y: 480, s: 0.5 } });
  camTw(0, 0.001, { x: 2200, y: 470, s: 0.38 });
  const stamp = board('THE FIX LIST', [['⚡', 'UDP'], ['🚚', 'QUIC streams'], ['🛂', '1-RTT'], ['🕵️', '0-RTT'], ['📶', 'migration'], ['🚧', 'fallback']], 1500, 30, B('l3', 0));
  const rowsP = (pre, items, x, y0, dy, w, h, l) => items.forEach((it, i) => P(pre + i, it[0], it[1], x, y0 + i * dy, w, h, it[2], l, it[3]));
  const chips = (pre, items, x, y0, dy, l, w) => items.forEach((it, i) => C(pre + i, it[0], x, y0 + i * dy, it[2], l, it[1], w || 600, 0));
  const E = (id, title, lines, x, y, w, col, l, phs, endOff) => ev(id, title, lines, x, y, w, col, phs.map((p) => (typeof p === 'string' ? A(l, p, 0) : A(p[0], p[1], 0))), End(l, endOff === undefined ? 0.3 : endOff));

  /* S1: the night of the final */
  blk('l1', 'l2', () => {
    E('al', 'ALERT · 20:00 · Packet City', ['📺 Grand Cup final starts in 1 hour', '8,000,000 fans on the streaming app', '🚂 evening trains: the stream freezes', '🧊 one lost packet stalls the whole page'], 200, 120, 1000, '#ff7b7b', 'l1', ['grand', 'million', 'trains', 'stalls']);
    cam(B('l1', 5), 2.5, 'hq');
  });
  blk('l2', 'l4', () => {
    walk('kit', B('l2', 1.5), 1.8, 520);
    C('tr', 'TRANSPORTS = the ways data travels', 1000, 300, '#7ee0ff', 'l2', 'transports', 600, 0);
    C('pk', 'what is a packet?', 1000, 400, '#ffd166', 'l3', 'packet', 400, 0);
  });
  blk('l4', 'l5', () => {
    chips('w', [['packet: one small chunk (a 40-byte DNS question)', 'packet', '#7ee0ff'], ['port: picks the program (DNS = 53)', 'port', '#ffd166'], ['handshake: setup before real data', 'handshake', '#3ddc84'], ['round trip: there and back (50 ms on mobile)', 'round trip', '#c084fc'], ['retransmission: send the lost piece again', 'retransmission', '#ff9f6b']], 1000, 170, 85, 'l4', 760);
  });
  blk('l5', 'l6', () => {
    chips('x', [['head-of-line blocking: one gap, all wait', 'head', '#ff7b7b'], ['stream: ordered reliable flow in a connection', 'stream', '#7ee0ff'], ['TLS: the encryption layer (the lock icon)', 't l s', '#3ddc84']], 1000, 200, 90, 'l5', 760);
  });
  blk('l6', 'l7', () => {
    cam(B('l6', -0.2), 2.0, 'ut'); walk('mira', B('l6', 0.3), 3.5, 1250); walk('kit', B('l6', 0.5), 3.5, 1150);
    C('shc', '🗣️ shout across a noisy room = UDP', 800, 250, '#f472b6', 'l6', 'shout', 700, 0);
    C('bk', '📖 a whole book: page numbers, resend page 7 = QUIC', 800, 340, '#2dd4bf', 'l6', 'book', 700, 0);
  });
  blk('l7', 'l8', () => {
    rowsP('st', [['Application', 'on top · DNS and games use UDP directly', '#7ee0ff', 'application'], ['UDP: just send a datagram', 'a port and an optional checksum', '#f472b6', 'u d p'], ['QUIC: streams, retries, TLS', 'rides on UDP', '#2dd4bf', 'quic'], ['IP: deliver to an address', 'under both', '#ffd166', 'under']].map((r, i) => r), 120, 100, 120, 900, 100, 'l7');
    C('in1', 'UDP = send and hope', 1000, 600, '#f472b6', 'l7', 'hope', 500, 0);
    C('in2', 'QUIC = reliable, encrypted, independent streams', 1000, 680, '#2dd4bf', 'l7', 'reliable', 700, 0);
  });

  /* S2: why they exist */
  blk('l8', 'l9', () => {
    E('cost', 'every guarantee has a price', ['3-way handshake before any data moves', 'in-order delivery: one lost packet stalls the rest', 'congestion control tuned for a general byte stream'], 120, 120, 1100, '#ffd166', 'l8', ['three', 'order', 'congestion']);
  });
  blk('l9', 'l10', () => { wl('tm', '📮 number · signature · receipt', '#f59e0b', 1720, 330, A('l9', 'number', 0), 36); ask('syn', 'SYN → SYN-ACK → ACK', '#ffd166', 1720, 560, 1300, 560, A('l9', 'shake', 0), 2.0); });
  blk('l10', 'l11', () => { wl('ud', '💌 address · message · mailbox · gone', '#f472b6', 1020, 330, A('l10', 'address', 0), 36); });
  blk('l11', 'l12', () => {
    E('t1', 'a 40-byte DNS lookup over TCP', ['SYN, SYN-ACK, ACK, query, reply', '2 round trips before the answer ✗'], 120, 100, 1000, '#ff9f6b', 'l11', ['tcp', 'two round']);
    E('t2', 'the same lookup over UDP', ['query  →', '←  reply', '1 round trip · no setup cost ✓'], 120, 290, 1000, '#3ddc84', 'l11', ['u d p', 'reply', 'one round']);
    C('mm', 'millions of lookups a second', 1000, 520, '#7ee0ff', 'l11', 'millions', 560, 0);
  });
  blk('l12', 'l13', () => {
    E('vf', 'a live video frame · a game position', ['frame 120 arrives late', 'frame 121 has already replaced it', 'retransmitting stale data = wrong ✗'], 120, 100, 1000, '#ff7b7b', 'l12', ['frame', 'newer', 'retransmitting']);
    ask('f120', '🎥 frame 120', '#ff7b7b', 1020, 560, 520, 560, A('l12', 'late', 0), 2.5);
  });
  blk('l13', 'l14', () => {
    chips('u', [['RFC 768 · one of the oldest still in daily use', 'seven sixty eight', '#f472b6'], ['IP + ports + optional checksum. nothing else', 'checksum', '#ffd166'], ['fire and forget · no connection state', 'fire', '#3ddc84'], ['DNS: retry at the resolver · big replies → TCP', 'resolver', '#7ee0ff']], 800, 190, 80, 'l13', 760);
  });
  blk('l14', 'l15', () => {
    E('hol', 'HTTP/2 over TCP: the stall', ['many streams share ONE TCP byte stream', 'one lost IP packet stalls all of them ✗', 'QUIC: multiplex below reliability, over UDP ✓'], 120, 100, 1000, '#2dd4bf', 'l14', ['many', 'stalls', 'move']);
    C('rf', 'RFC 9000 · 2021 · carries HTTP/3 (RFC 9114)', 800, 420, '#7ee0ff', 'l14', 'standardized', 700, 0);
  });
  blk('l15', 'l16', () => {
    E('cr', "tonight's crime", ['stream = HTTP/2 over TCP', 'one lost packet on a train', 'video + chat + scoreboard freeze together ✗'], 120, 100, 1000, '#ff7b7b', 'l15', ['h t t p two', 'lost', 'video']);
    C('bt', 'UDP = TCP minus every optional guarantee', 800, 420, '#f472b6', 'l15', 'broken', 700, 0);
  });

  /* S3: mental model */
  blk('l16', 'l17', () => {
    ask('pc1', '💌 #1', '#7ee0ff', 1020, 560, 1700, 560, A('l16', 'postcard', 0), 2.5);
    ask('pc2', '💌 #2', '#ffd166', 1020, 600, 1500, 600, A('l16', 'arrived', 0), 2.5);
    wl('lo', '💥 never arrived? no way to know', '#ff7b7b', 1450, 480, A('l16', 'arrived', 1.0), 30);
    E('dn', 'DialUDP in Go', ['remembers a destination address locally', 'sends NOTHING to set anything up'], 120, 100, 900, '#f472b6', 'l16', ['net dial', 'sends']);
  });
  blk('l17', 'l18', () => {
    rowsP('th', [['thread 1', 'its own sequence numbers · its own retransmission', '#7ee0ff', 'several'], ['thread 2', 'a lost page reprints only this thread', '#ff9f6b', 'lost'], ['thread 3', 'unaffected, the whole letter keeps moving', '#3ddc84', 'whole']], 120, 110, 130, 1100, 110, 'l17');
  });
  blk('l18', 'l19', () => {
    chips('br', [['✉️ registered mail cannot change address mid-transit', 'cannot', '#ffd166'], ['📱 Wi-Fi → cellular: same Connection ID', 'wi', '#2dd4bf'], ['🎙️ like a courier knowing your voice on a new number', 'voice', '#c084fc']], 800, 190, 90, 'l18', 760);
  });

  /* S4: UDP */
  blk('l19', 'l20', () => {
    cam(B('l19', -0.3), 2.0, 'ud'); walk('mira', B('l19', 0.2), 3, 640); walk('kit', B('l19', 0.4), 3, 520);
    E('dg', 'a UDP datagram', ['address + payload → straight onto the wire', 'no setup · no "got it" · no "I am ready"', 'retry · dedupe · reorder = the app’s own job'], 120, 100, 1100, '#f472b6', 'l19', ['payload', 'setup', 'retrying']);
  });
  blk('l20', 'l21', () => {
    ask('dq', 'query', '#7ee0ff', 700, 560, 1000, 560, A('l20', 'client', 0), 1.4);
    ask('dr', 'reply ✓', '#3ddc84', 1000, 600, 700, 600, A('l20', 'lovely', 0), 1.4);
    ask('dx', 'query ✗', '#ff7b7b', 700, 520, 1000, 520, A('l20', 'drops', 0), 1.4);
    wl('dl', 'dropped: the client has no idea', '#ff7b7b', 850, 440, A('l20', 'drops', 0.8), 30);
    wl('tmo', '⏱️ only a timeout says: retry', '#ffd166', 850, 400, A('l20', 'timeout', 0), 30);
    C('nac', 'no Accept: every datagram carries the sender’s address', 1100, 220, '#f472b6', 'l20', 'accept', 700, 0);
  });
  blk('l21', 'l22', () => {
    rowsP('us', [['DNS', 'trades guaranteed delivery · a lost query retries · over 512 bytes → TCP', '#7ee0ff', 'd n s'], ['Video and voice (RTP, WebRTC)', 'trades retransmission · late frame discarded · adaptive bitrate', '#3ddc84', 'video'], ['Online games', 'trades ordering of old data · an old position is wrong when it lands', '#ffd166', 'online'], ['mDNS · SSDP discovery', 'trades the connection itself · broadcast and multicast need none', '#c084fc', 'm d n s']], 100, 100, 130, 1400, 110, 'l21');
  });
  blk('l22', 'l23', () => {
    E('cm', 'common mistake', ['DialUDP ≠ "the other side is reachable"', 'it sends NOTHING on the wire', 'first warning = a timeout, not an error ✗'], 120, 100, 1000, '#ff7b7b', 'l22', ['common', 'sends', 'timeout']);
    C('g1', 'UDP guarantees one thing: datagram + checksum + port', 800, 420, '#f472b6', 'l22', 'guarantees', 700, 0);
    stamp(0, End('l22', 0.2), true);
  });

  /* S5: QUIC streams */
  blk('l23', 'l24', () => {
    cam(B('l23', -0.3), 2.0, 'quinn'); walk('mira', B('l23', 0.2), 4, 2000); walk('kit', B('l23', 0.4), 4, 1900);
    E('qs', 'QUIC: many streams, one connection', ['one connection over UDP', 'many independent streams inside it', 'each: own sequence numbers + own retransmission', 'a loss on stream 1 never blocks stream 2 ✓'], 120, 100, 1100, '#2dd4bf', 'l23', ['connection', 'many', 'sequence', 'losing']);
  });
  blk('l24', 'l25', () => {
    E('pl', 'a page load, three streams', ['stream 1 · the HTML', 'stream 2 · the stylesheet   (a packet is lost)', 'stream 3 · the script   keeps delivering ✓', 'connection = Connection ID, not IP:port'], 120, 100, 1100, '#7ee0ff', 'l24', ['h t m l', 'stylesheet', 'script', 'identified']);
    ask('lp', '📦 ✗ lost', '#ff7b7b', 2420, 560, 2900, 560, A('l24', 'lost', 0), 2.0);
    ask('sp', '📦 script ✓', '#3ddc84', 2420, 610, 2000, 610, A('l24', 'script', 0.5), 2.0);
  });
  blk('l25', 'l26', () => {
    C('h3', 'HTTP/3 = HTTP over QUIC', 800, 250, '#2dd4bf', 'l25', 'entire', 600, 0);
    C('bl', 'the fix had to move BELOW TCP, onto UDP', 800, 340, '#ffd166', 'l25', 'below', 700, 0);
    stamp(1, End('l25', 0.2), true);
  });

  /* S6: handshake */
  blk('l26', 'l27', () => {
    cam(B('l26', -0.3), 2.0, 'tess'); walk('mira', B('l26', 0.2), 4, 2850); walk('kit', B('l26', 0.4), 4, 2750);
    E('hs', 'QUIC handshake: 1 RTT', ['client → Initial: ClientHello + transport params', 'server → Initial + Handshake: ServerHello, cert, Finished', 'client → Handshake: Finished', 'usable for application data after 1 RTT ✓'], 120, 100, 1300, '#a78bfa', 'l26', ['client', 'server', 'its own', 'usable']);
    ask('h1', 'ClientHello', '#7ee0ff', 2700, 560, 3200, 560, A('l26', 'client', 0.3), 1.2);
    ask('h2', 'ServerHello + cert', '#ffd166', 3200, 600, 2700, 600, A('l26', 'server', 0.3), 1.2);
  });
  blk('l27', 'l28', () => {
    C('c2', 'TCP + TLS 1.3: 2 round trips first ✗', 800, 250, '#ff9f6b', 'l27', 'two', 700, 0);
    C('c1', 'QUIC: 1 round trip ✓', 800, 340, '#3ddc84', 'l27', 'with quic', 500, 0);
    C('c0', 'no cleartext mode for application data', 800, 430, '#a78bfa', 'l27', 'unencrypted', 700, 0);
  });
  blk('l28', 'l29', () => {
    C('mo', 'mobile RTT 50 to 150 ms, paid on EVERY cold connection', 800, 250, '#ffd166', 'l28', 'mobile', 800, 0);
    C('dz', 'transport + TLS were designed together, nothing skipped', 800, 340, '#3ddc84', 'l28', 'designed', 800, 0);
    stamp(2, End('l28', 0.2), true);
  });

  /* S7: 0-RTT */
  blk('l29', 'l30', () => {
    E('zr', 'the loyalty card', ['session ticket from the last visit', 'application data in the FIRST flight', 'no round trip needed before talking business ✓'], 120, 100, 1000, '#3ddc84', 'l29', ['session', 'first flight', 'loyalty']);
  });
  blk('l30', 'l31', () => { wl('cp', '📸 copy saved…', '#ff7b7b', 2800, 330, A('l30', 'copy', 0), 36); });
  blk('l31', 'l32', () => {
    ask('rp', '🔁 same 0-RTT packet', '#ff7b7b', 2800, 560, 2430, 560, A('l31', 'replays', 0), 2.0);
    wl('cn', 'server cannot tell the replay from the original', '#ffb066', 2500, 340, A('l31', 'cannot', 0), 30);
  });
  blk('l32', 'l33', () => {
    C('ok', 'safe: an idempotent GET (a product page) ✓', 800, 250, '#3ddc84', 'l32', 'idempotent', 700, 0);
    C('no', 'never: a payment submission ✗', 800, 340, '#ff7b7b', 'l32', 'never', 600, 0);
  });
  blk('l33', 'l34', () => {
    E('cmx', 'common mistake', ['0-RTT is not "a faster handshake with no downside"', 'attached to "charge this card" = a real vulnerability ✗', 'the application layer must enforce it, not QUIC'], 120, 100, 1100, '#ff7b7b', 'l33', ['common', 'charge', 'application']);
    stamp(3, End('l33', 0.2), true);
  });

  /* S8: migration */
  blk('l34', 'l35', () => {
    cam(B('l34', -0.3), 2.0, 'mig'); walk('mira', B('l34', 0.2), 4, 2200); walk('kit', B('l34', 0.4), 4, 2100);
    E('tup', 'TCP identity = the 4-tuple', ['src IP · src port · dst IP · dst port', 'IP changes → matches no open socket ✗', 'QUIC identity = a Connection ID the endpoints chose ✓'], 120, 100, 1100, '#f59e0b', 'l34', ['four tuple', 'change', 'chose']);
    wd('ph', H.Em('📱', 110), 1100, 690); H.pop('ph', A('l34', 'phone', -0.2));
    wl('wf', '📶 Wi-Fi', '#7ee0ff', 1100, 600, A('l34', 'phone', 0), 34);
    tw('ph', A('l34', 'cellular', 0), 1.6, { x: 1800 });
    wl('ce', '📡 cellular', '#ffd166', 1800, 600, A('l34', 'cellular', 1.0), 34);
  });
  blk('l35', 'l36', () => {
    E('stp', 'path migration, step by step', ['1  IP changes, CID-7 does not', '2  next packet: CID-7 from a new address', '3  server: known ID, unknown address', '4  path validation: challenge + response', '5  the phone answers correctly', '6  server resumes on the new path ✓'], 120, 100, 1000, '#2dd4bf', 'l35', ['one', 'two', 'three', 'four', 'five', 'six']);
    ask('cid', 'CID-7', '#7ee0ff', 1800, 560, 2400, 560, A('l35', 'two', 0), 1.4);
    ask('chal', 'challenge?', '#ffd166', 2400, 520, 1800, 520, A('l35', 'four', 0.3), 1.4);
    ask('resp', 'response ✓', '#3ddc84', 1800, 600, 2400, 600, A('l35', 'five', 0), 1.4);
  });
  blk('l36', 'l37', () => { C('kq', '❓ what if path validation fails?', 800, 300, '#ffd166', 'l36', 'path', 600, 0); });
  blk('l37', 'l38', () => {
    C('rj', 'rejected → starts over (same as TCP would)', 800, 250, '#ff9f6b', 'l37', 'rejected', 700, 0);
    C('ss', 'TCP identity IS the 4-tuple: no migration possible', 800, 340, '#f59e0b', 'l37', 'structurally', 800, 0);
    stamp(4, End('l37', 0.2), true);
  });

  /* S9: worked example + options */
  blk('l38', 'l39', () => {
    cam(B('l38', -0.3), 2.0, 'quinn');
    rowsP('wb', [['Client opens a QUIC connection', '1-RTT handshake, TLS 1.3 inside', '#a78bfa', 'client'], ['Stream 1: a large file', 'loses a packet · retransmits', '#ff9f6b', 'stream one'], ['Stream 2: a small request', 'delivered immediately · the app reads it', '#3ddc84', 'stream two'], ['Stream 1 arrives eventually', 'the loss never stopped stream 2', '#7ee0ff', 'eventually']], 120, 100, 125, 1100, 105, 'l38');
  });
  blk('l39', 'l40', () => {
    E('tr2', 'tracing the exchange', ['1  UDP: a small query, no setup step', '2  QUIC: the 1-RTT handshake', '3  stream A: write 64 KB', '4  stream B: write 25 bytes ("small, independent stream")', '5  server echoes each on its own sequence space', '6  both replies verified independently ✓'], 120, 100, 1300, '#ffd166', 'l39', ['one', 'two', 'three', 'four it', 'five', 'six']);
  });
  blk('l40', 'l41', () => {
    E('ms', 'measured: Go 1.24 · quic-go 0.48.2 · loopback · -race', ['stream A: 64 KB echoed intact ✓', 'stream B: 25 bytes echoed intact ✓', 'both inside 5 s: A never blocked B ✓'], 120, 100, 1300, '#3ddc84', 'l40', ['sixty', 'twenty five', 'never']);
  });
  blk('l41', 'l45', () => {
    cam(B('l41', -0.3), 2.0, 'ut');
    P('cm0', 'Raw UDP', 'one send · maybe one receive · cost: every guarantee is your own code', 120, 100, 1380, 110, '#f472b6', 'l41', 'compare');
    P('cm1', 'TCP', 'one ordered byte stream, OS-managed · cost: head-of-line blocking on anything multiplexed', 120, 230, 1380, 110, '#f59e0b', 'l42', 'one');
    P('cm2', 'QUIC', 'many reliable streams + TLS 1.3 · cost: userspace CPU, some middleboxes block UDP', 120, 360, 1380, 110, '#2dd4bf', 'l43', 'me');
    P('cm3', 'RTP / WebRTC over UDP', 'app-managed loss tolerance, jitter buffers, adaptive bitrate · cost: no delivery guarantee', 120, 490, 1380, 110, '#c084fc', 'l44', 'fourth');
  });

  /* S10: trade-offs, failures, monitoring */
  blk('l45', 'l46', () => {
    E('to', 'trade-offs', ['kernel TCP: one shared, offload-friendly implementation', 'QUIC in every app’s userspace → more CPU per byte', '0-RTT replay → idempotent requests only', 'plain UDP: wrong once "delivered, in order" matters'], 120, 100, 1200, '#ff9f6b', 'l45', ['moves', 'costs', 'zero', 'plain']);
  });
  blk('l46', 'l47', () => {
    cam(B('l46', -0.3), 2.0, 'gate'); walk('mira', B('l46', 0.2), 6, 3400); walk('kit', B('l46', 0.4), 6, 3300);
    wl('blk1', '🚧 UDP BLOCKED at the stadium gate', '#ff7b7b', 3900, 330, A('l46', 'blocks', 0), 36);
    ask('qx', 'QUIC datagram ✗', '#ff7b7b', 3000, 560, 3780, 560, A('l46', 'blocks', 0.3), 2.0);
    C('rl', 'rate-limited · deprioritized · blocked', 800, 250, '#ff7b7b', 'l46', 'rate', 700, 0);
    C('am', 'abused for amplification DDoS', 800, 340, '#ffd166', 'l46', 'amplification', 600, 0);
  });
  blk('l47', 'l48', () => {
    cam(B('l47', -0.3), 2.0, 'mid');
    C('rt', 'HTTP/3 client retries over HTTP/2 on TCP ✓', 800, 250, '#3ddc84', 'l47', 'retries', 700, 0);
    C('fb', 'QUIC as default still needs a TCP fallback path', 800, 340, '#f59e0b', 'l47', 'fallback', 800, 0);
    ask('fl', '↩️ fallback to HTTP/2', '#3ddc84', 3800, 600, 1800, 600, A('l47', 'retries', 0), 3.0);
  });
  blk('l48', 'l49', () => {
    walk('mira', B('l48', 0.2), 8, 450); walk('kit', B('l48', 0.4), 8, 350);
    chips('rs', [['HTTP/3 by default: Google · Cloudflare · Meta · most CDNs', 'google', '#2dd4bf'], ['DNS: UDP port 53, TCP fallback', 'd n s', '#7ee0ff'], ['WebRTC calls and games: own protocols over UDP', 'web', '#c084fc']], 800, 190, 90, 'l48', 800);
  });
  blk('l49', 'l50', () => {
    cam(B('l49', 3), 2.5, 'hq');
    rowsP('fm', [['UDP blocked or rate-limited', 'clients detect it and fall back to TCP', '#ff7b7b', 'one'], ['0-RTT replay of a non-idempotent request', 'allow 0-RTT only for idempotent requests, enforced in the app', '#ffd166', 'two'], ['Migration path validation fails', 'a firewall drops the probe → a new connection, as TCP would do', '#2dd4bf', 'three']], 120, 130, 140, 1350, 110, 'l49');
  });
  blk('l50', 'l51', () => {
    E('mon', 'THE CONTROL WALL', ['UDP packet loss + retransmit rate per stream', '0-RTT accepts vs rejects', 'migration events + success rate', 'HTTP/3 → HTTP/2 fallback rate (rising = UDP newly blocked)'], 120, 100, 1300, '#38bdf8', 'l50', ['loss', 'accept', 'migration', 'fallback']);
    stamp(5, End('l50', 0.2), true);
  });

  /* S11: deep dive */
  blk('l51', 'l52', () => {
    E('d1', '1 · why QUIC is not "TCP but faster"', ['TCP stack: kernel code, OS-release timescales', 'QUIC: userspace, ships with your binary', 'new congestion controller = next deploy, not next kernel ✓'], 120, 100, 1200, '#ffd166', 'l51', ['tcp', 'userspace', 'congestion controller']);
  });
  blk('l52', 'l53', () => {
    E('d2', '2 · packet numbers', ['TCP: retransmit reuses seq 1000 → ACK is ambiguous ✗', 'QUIC: pkt #42 lost → the retransmit is pkt #58', 'ACK for #58 = unambiguously the retransmit ✓'], 120, 100, 1200, '#2dd4bf', 'l52', ['tcp', 'forty two', 'unambiguous']);
    ask('p42', '#42 ✗', '#ff7b7b', 600, 560, 1100, 560, A('l52', 'forty two', 0), 1.8);
    ask('p58', '#58 retransmit', '#3ddc84', 600, 610, 1100, 610, A('l52', 'fifty', 0), 1.8);
  });
  blk('l53', 'l54', () => {
    C('kn', "Karn's algorithm = patching TCP's ambiguity", 800, 250, '#ff9f6b', 'l53', 'karn', 700, 0);
    C('rm', 'QUIC removes it in the numbering itself', 800, 340, '#3ddc84', 'l53', 'removes', 700, 0);
  });
  blk('l54', 'l55', () => {
    E('d3', '3 · loss recovery + congestion control', ['reimplemented inside QUIC', 'packet-number ACKs · pluggable congestion controller', 'CUBIC / BBR-like · userspace, per connection'], 120, 100, 1200, '#c084fc', 'l54', ['reimplemented', 'pluggable', 'cubic']);
  });
  blk('l55', 'l56', () => {
    C('mp', '4 · multipath: several paths at once', 800, 250, '#7ee0ff', 'l55', 'multipath', 700, 0);
    C('mp2', '📶 Wi-Fi + 📱 cellular together: Connection ID + path validation', 800, 340, '#2dd4bf', 'l55', 'several', 900, 0);
    C('mp3', 'an active extension area, not yet universal', 800, 430, '#ffd166', 'l55', 'active', 700, 0);
  });
  blk('l56', 'g1', () => {
    E('d5', '5 · why DNS mostly stays on UDP', ['DNS over QUIC (DoQ, RFC 9250): privacy + fast resumption', 'but a query is one datagram each way', 'little head-of-line blocking to fix', 'QUIC earns its keep when many exchanges share a connection ✓'], 120, 100, 1300, '#f472b6', 'l56', ['d o q', 'typical', 'little', 'earns']);
  });

  /* S12: Go */
  hide('boardBg', B('g1', -0.3)); for (let i = 0; i < 6; i++) hide('cb' + i, B('g1', -0.3));
  blk('g1', 'g2', () => {
    C('go1', 'UDP half: standard library only (net)', 800, 250, '#f472b6', 'g1', 'standard', 700, 0);
    C('go2', 'QUIC half: github.com/quic-go/quic-go v0.48.2', 800, 340, '#2dd4bf', 'g1', 'quic go', 800, 0);
    C('go3', 'go vet ./...   ·   go test -race ./...', 800, 430, '#ffd166', 'g1', 'run', 700, 0);
  });
  const code = (id, l, LN, title, hls, fs) => {
    const cp = S.codePanel(id, LN, { x: 180, y: 90, w: 1560, fs: fs || 28, title, t0: B(l, 0.1), times: LN.map((x, i) => B(l, 0.4) + i * 0.25) });
    hls.forEach((h) => cp.hl(h[0], A(l, h[1], 0)));
    cp.out(End(l, 0.2));
  };
  blk('g2', 'g3', () => code('c2', 'g2', ['func EchoUDP(conn *net.UDPConn) error {', '    buf := make([]byte, 1500) // Ethernet-safe size', '    n, addr, err := conn.ReadFromUDP(buf) // payload + sender', '    if err != nil {', '        return err', '    }', '    _, err = conn.WriteToUDP(buf[:n], addr) // there is no Accept', '    return err', '}'], 'udp.go', [[1, 'buffer'], [2, 'read from'], [6, 'write to']]));
  blk('g3', 'g4', () => code('c3', 'g3', ['func SendAndWaitUDP(addr string, msg []byte, timeout time.Duration) ([]byte, error) {', '    raddr, _ := net.ResolveUDPAddr("udp", addr)', '    conn, err := net.DialUDP("udp", nil, raddr) // sends nothing yet', '    defer conn.Close()', '    conn.Write(msg)', '    conn.SetReadDeadline(time.Now().Add(timeout))', '    buf := make([]byte, 1500)', '    n, err := conn.Read(buf) // the deadline error is the only signal', '    if err != nil { return nil, err }', '    return buf[:n], nil', '}'], 'udp.go (error handling trimmed)', [[2, 'dial u d p'], [4, 'write sends'], [5, 'set read'], [7, 'error after']], 27));
  blk('g4', 'g5', () => code('c4', 'g4', ['func selfSignedTLSConfig() (*tls.Config, error) {', '    key, _ := rsa.GenerateKey(rand.Reader, 2048) // in memory', '    tmpl := &x509.Certificate{SerialNumber: big.NewInt(1)}', '    der, _ := x509.CreateCertificate(rand.Reader, tmpl, tmpl, &key.PublicKey, key)', '    cert, _ := tls.X509KeyPair(certPEM, keyPEM)', '    return &tls.Config{', '        Certificates: []tls.Certificate{cert},', '        NextProtos:   []string{"demo-echo"}, // ALPN, like "h3"', '    }, nil', '}'], 'quic.go (trimmed)', [[1, 'generates'], [7, 'next protos']], 26));
  blk('g5', 'g6', () => code('c5', 'g5', ['func RunQUICEchoServer(ctx context.Context, ln *quic.Listener) error {', '    conn, err := ln.Accept(ctx) // handshake done: one connection', '    for {', '        stream, err := conn.AcceptStream(ctx)', '        if err != nil { return nil } // connection closed', '        go func(s quic.Stream) {', '            defer s.Close()', '            io.Copy(s, s) // echo: one goroutine per stream', '        }(stream)', '    }', '}'], 'quic.go', [[1, 'accept'], [3, 'accept stream'], [5, 'goroutine'], [7, 'io copy']]));
  blk('g6', 'g7', () => code('c6', 'g6', ['func OpenStreamAndEcho(ctx context.Context,', '        conn quic.Connection, msg []byte) ([]byte, error) {', '    stream, _ := conn.OpenStreamSync(ctx) // an independent stream', '    stream.Write(msg)', '    stream.Close() // half-close: "I am done sending"', '    buf := make([]byte, len(msg))', '    io.ReadFull(stream, buf) // exactly len(msg) bytes', '    return buf, nil', '}'], 'quic.go', [[2, 'open stream'], [4, 'stream close'], [6, 'read full']]));
  blk('g7', 'q0', () => {
    code('c7', 'g7', ['func Listen() (*quic.Listener, error) {', '    tlsConf, _ := selfSignedTLSConfig()', '    return quic.ListenAddr("127.0.0.1:0", tlsConf,', '        &quic.Config{MaxIdleTimeout: 10 * time.Second})', '}', '', 'func Dial(ctx context.Context, addr string) (quic.Connection, error) {', '    tlsConf := &tls.Config{InsecureSkipVerify: true, // demo only', '        NextProtos: []string{"demo-echo"}}', '    return quic.DialAddr(ctx, addr, tlsConf, nil)', '}'], 'quic.go', [[2, 'binds'], [3, 'ten second'], [7, 'dial skips']], 27);
    C('tst', 'test: a 64 KB stream never blocks the 25-byte stream ✓', 960, 760, '#3ddc84', 'g7', 'test', 900, 0);
  });

  /* S13: interview */
  blk('q0', 's0', () => {
    qa([
      ['What exactly does UDP guarantee, and what does it not?', 'almost nothing: a datagram with a checksum for a port · no setup, order, retransmit or loss notice', 'q1', 'what'],
      ['How does QUIC fix head-of-line blocking and stay reliable?', 'streams multiplexed BELOW reliability: own sequence space, a loss stalls only its own stream', 'q3', 'how'],
      ['Why 1 RTT when TCP + TLS 1.3 needs 2?', 'transport and TLS are the same handshake: TLS rides inside QUIC’s first packets', 'q5', 'why'],
      ['Trap: is QUIC unreliable because it runs over UDP?', 'no: reliability, per-stream order and congestion control are rebuilt on top of UDP', 'q7', 'trap'],
      ['What is 0-RTT data, and its risk?', 'app data in the first flight from a session ticket · replayable → idempotent requests only', 'q9', 'what'],
      ['How does QUIC survive an IP change?', 'Connection ID, not the 4-tuple · a new address triggers path validation, then it continues', 'q11', 'how'],
      ['Why does every packet get a new packet number?', 'so an ACK is unambiguous about which transmission it covers: clean RTT samples', 'q13', 'why'],
    ]);
  });

  /* S14: summary */
  blk('s0', 's1a', () => {
    cam(B('s0', -0.3), 2.5, 'wide');
    C('z1', '🕘 21:00 · stream on HTTP/3, HTTP/2 fallback behind Rex', 960, 250, '#3ddc84', 's0', 'switched', 900, 0);
    C('z2', '🚇 tunnel · phones change networks · zero freezes ✓', 960, 340, '#ffd166', 's0', 'tunnel', 800, 0);
  });
  blk('s1a', 'rn1', () => {
    cam(B('s1a', -0.3), 2.0, 'hq');
    summary('CASE CLOSED · SUMMARY', [
      ['UDP: one datagram · no connection, ordering, retransmission or congestion control', 's1a', '#f472b6'],
      ['QUIC: reliable ordered streams over UDP, TLS 1.3 part of the handshake', 's1b', '#2dd4bf'],
      ['Independent streams fix head-of-line blocking, unlike HTTP/2 on one TCP stream', 's1c', '#7ee0ff'],
      ['1-RTT handshake vs 2 · 0-RTT is replayable → idempotent requests only', 's1d', '#a78bfa'],
      ['Connection ID + path validation = migration · unique packet numbers = no ambiguity', 's1e', '#ffd166'],
      ['Costs: userspace CPU, networks that block UDP · keep TCP fallback, watch its rate', 's1f', '#ff9f6b'],
      ['KEEP: UDP = send and hope · QUIC = reliable, encrypted, independent streams on UDP', 's1g', '#3ddc84'],
    ]);
  });

  /* S15: where next */
  blk('rn1', 'e1', () => {
    readNext('rn1', [['📘 notes: UDP and QUIC  +  UDP and QUIC - Go', 'open', '#7ee0ff'], ['⬅ before: TCP - Handshake, Reliability, Flow and Congestion Control', 'before', '#ffd166'], ['➡ after: HTTP-1.1 vs HTTP-2 vs HTTP-3 · HTTP Fundamentals', 'after', '#3ddc84'], ['↔ compare: TLS and HTTPS (the handshake QUIC embeds) · DNS (UDP-first)', 'compare', '#c084fc']]);
  });
  cam(B('e1', -0.4), 1.4, 'hq'); wave('kit', B('e1', 0.5)); wave('mira', B('e2', 0.5));
  endTitle('UDP and QUIC', 'send and hope, or send and be sure', 'e2');
})();
