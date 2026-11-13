/* TLS and HTTPS: "The Password at the Cafe". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, A, B, End, ui, wd, em, chip, line, draw, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect } = H;

  world(3700, { sky: '#0c1436', skyMid: '#2e3f80', skyLow: '#d98a60' });
  bld('bCafe', 400, '#7c3a1d', 'CAFÉ WI-FI · MAL LURKS', '☕');
  bld('bCass', 1370, '#7c3aed', 'CASS · CERTIFICATE OFFICE (CA)', '🏛️');
  bld('bLeo', 2270, '#0e7490', 'LEO · THE GATE (load balancer)', '🚪');
  bld('bSera', 3170, '#1d4ed8', 'SERA · BRIGHTWAY BANK', '🏦');
  const CFG = {
    ivy: { who: 'IVY', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '🔍', w: 96, name: 'Ivy', ring: '#38bdf8' },
    nico: { who: 'NICO', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Nico', ring: '#4ade80' },
    pip: { who: 'PIP', skin: '#f0c4a0', shirt: '#f472b6', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', hold: '📱', blush: 1, w: 90, name: 'Pip', ring: '#f9a8d4' },
    mal: { who: 'MAL', skin: '#e0ac82', shirt: '#1f2937', pants: '#111827', hat: 'cap', hatColor: '#111827', glasses: 1, hair: '#222', hold: '🕵️', w: 104, name: 'Mal', ring: '#ff7b7b' },
    cass: { who: 'CASS', skin: '#9b6a47', shirt: '#7c3aed', pants: '#222', hair: '#111', hair2: 'long', glasses: 1, hold: '🪪', w: 96, name: 'Cass', ring: '#c4b5fd' },
    sera: { who: 'SERA', skin: '#e3b08a', shirt: '#2563eb', pants: '#1e3a8a', hair: '#3a2a1a', tie: '#fbbf24', hold: '💻', w: 104, name: 'Sera', ring: '#60a5fa' },
    leo: { who: 'LEO', skin: '#d9a37a', shirt: '#0d9488', pants: '#333', hat: 'cap', hatColor: '#115e59', hold: '🚧', w: 112, name: 'Leo', ring: '#2dd4bf' },
  };
  cast(CFG, { pip: [300], mal: [520], ivy: [800], nico: [700], cass: [1370], leo: [2270], sera: [3170] });
  views({ cafe: { x: 650, y: 520, s: 0.9 }, hs: { x: 2400, y: 520, s: 0.62 }, lo: { x: 2450, y: 520, s: 0.72 }, cass: { x: 1350, y: 520, s: 0.95 }, sera: { x: 3000, y: 520, s: 0.8 } });
  camTw(0, 0.001, { x: 650, y: 520, s: 0.9 });
  const stamp = board('CASE BOARD', [['🔑', 'key exchange'], ['🪪', 'certificate'], ['⚡', 'fast handshake'], ['🏷️', 'SNI + ALPN'], ['🚪', 'termination'], ['💥', 'outages']], 1510, 620, B('a10', 0.5));
  const EV = (id, title, lines, col, specs, tEnd, w) => ev(id, title, lines, 90, 90, w || 1400, col, specs.map((s) => A(s[0], s[1], 0)), tEnd);
  const PX = 1650, SX = 3170; // pip and sera on the street

  /* ---------------- S1: the password at the cafe ---------------- */
  blk('a1', 'a2', () => {
    wl('lt', '🕘 launch: 09:00 tomorrow', '#ffd166', 700, 300, A('a1', 'nine', 0), 40);
    ring('clk', 1250, 230, 70, '#ff7b7b', '09:00', A('a1', 'nine', 0.3), 60);
    ask('pw1', 'password: ••••••••', '#f9a8d4', 300, 560, 520, 560, A('a1', 'passes', -0.3), 1.2);
    EV('malscr', 'Mal’s laptop', ['pip@mail  password: hunter2  ✗', 'ana@mail  password: qwerty1  ✗', 'card 4111 …  expiry 11/28  ✗'], '#ff7b7b', [['a1', 'reading'], ['a1', 'passes'], ['a1', 'thousands']], End('a1', 0.4), 900);
    wl('ten', '⏳ one night', '#ffd166', 700, 380, A('a1', 'one night', 0), 40);
  });
  blk('a2', 'a3', () => { pulse('ivy', A('a2', 'ivy', 0)); pulse('nico', A('a2', 'nico', 0)); wl('job', '🛡️ make the street safe before sunrise', '#7ee0ff', 760, 330, A('a2', 'safe', -0.2), 36); });
  blk('a3', 'a4', () => {
    pulse('mal', A('a3', 'mal', 0));
    C('pc', '✉️ plain HTTP = a postcard: everyone who carries it can read it', 900, 250, '#ff7b7b', 'a3', 'postcard', 1000, 0);
    C('rw', '✏️ and Mal can REWRITE it before it arrives', 900, 330, '#ffb066', 'a3', 'rewrite', 800, 0);
  });
  blk('a4', 'a5', () => {
    ask('pw2', 'password', '#f9a8d4', 300, 600, 520, 600, A('a4', 'password', 0), 1.0);
    C('r1', '📶 café router', 520, 250, '#ffd166', 'a4', 'router', 340, 0); C('r2', '🌐 the provider', 900, 330, '#ffd166', 'a4', 'internet provider', 340, 0); C('r3', '🖥️ many machines', 1250, 250, '#ffd166', 'a4', 'many machines', 340, 0);
  });
  blk('a5', 'a6', () => {
    EV('bad', 'plain HTTP on the wire', ['passwords · cookies · page content = readable bytes ✗', 'anyone on the path can READ it', 'anyone who injects packets can CHANGE it, or fake the bank ✗'], '#ff7b7b', [['a5', 'passwords'], ['a5', 'read them'], ['a5', 'inject packets']], End('a5', 0.4));
  });
  blk('a6', 'a7', () => {
    C('p1', '🙈 confidentiality: nobody else can read it', 900, 250, '#7ee0ff', 'a6', 'confidentiality', 900, 0);
    C('p2', '🪪 authentication: you know who you talk to', 900, 330, '#ffd166', 'a6', 'authentication', 900, 0);
    C('p3', '🔏 integrity: nobody can tamper unseen', 900, 410, '#3ddc84', 'a6', 'integrity', 900, 0);
    card(A('a6', 'simply', 0), 'HTTPS = HTTP over TLS', 'instead of plain TCP', { color: '#38bdf8', hold: 6 });
  });
  blk('a7', 'a8', () => { walk('nico', B('a7', 0.2), 1.0, 760); pulse('nico', A('a7', 'words', 0)); wl('qw', '📓 the words first', '#4ade80', 760, 330, A('a7', 'words', -0.2), 40); });
  blk('a8', 'a9', () => {
    const W = [['🔒 encryption: scramble data so only key holders read it', 'encryption', '#7ee0ff'], ['🔑 key: the secret number that scrambles / unscrambles', 'a key', '#ffd166'], ['👫 public + private key: a pair', 'public and private', '#c084fc'], ['✍️ signature: proof made with the private key', 'signature', '#f472b6'], ['🪪 certificate: “this public key belongs to this domain”', 'a certificate', '#3ddc84'], ['🏛️ CA: a trusted organisation that signs certificates', 'a c a', '#a78bfa'], ['🤝 handshake: the first messages that agree how to talk', 'handshake', '#38bdf8'], ['⏱️ round trip: a message there and its reply (~50 ms)', 'round trip', '#fbbf24']];
    W.forEach((w, i) => C('wd' + i, w[0], i < 4 ? 480 : 1330, 220 + (i % 4) * 85, w[2], 'a8', w[1], 800, 0));
  });
  blk('a9', 'a10', () => {
    EV('his', 'why was the web not already safe?', ['before 2015: a certificate cost money · manual yearly renewal', '2015: Let’s Encrypt → free and automatic', '~2018: browsers mark plain HTTP “Not Secure”'], '#ffd166', [['a9', 'cost money'], ['a9', 'free and automatic'], ['a9', 'not secure']], End('a9', 0.4));
  });
  blk('a10', 'b1', () => {
    [['1  TCP handshake finishes', 'one the'], ['2  browser sends ClientHello', 'two the'], ['3  server: certificate + key exchange', 'three the'], ['4  both hold a secret nobody else saw', 'four both'], ['5  all HTTP is encrypted with it', 'five all']].forEach((s, i) => C('pl' + i, s[0], 760, 230 + i * 80, ['#7ee0ff', '#38bdf8', '#ffd166', '#c084fc', '#3ddc84'][i], 'a10', s[1], 700, 0));
  });

  /* ---------------- S2: two jobs ---------------- */
  blk('b1', 'b2', () => {
    C('j1', '🔑 job one: key exchange · agree on a secret nobody else can compute', 800, 240, '#7ee0ff', 'b1', 'job one', 1000, 0);
    C('j2', '🪪 job two: identity · prove who is on the other end', 800, 330, '#ffd166', 'b1', 'job two', 1000, 0);
    C('j3', 'neither job alone is enough', 800, 420, '#ff7b7b', 'b1', 'neither', 600, 0);
  });
  blk('b2', 'b3', () => {
    walk('ivy', B('b2', 0.2), 4.0, 1260); walk('nico', B('b2', 0.6), 4.0, 1160); cam(B('b2', 0.8), 2.5, 'hs');
    wl('q2', '❓ a secret, in public, with a spy listening?', '#4ade80', 2000, 380, A('b2', 'listening', -0.5), 36);
  });
  blk('b3', 'b4', () => {
    walk('pip', B('b3', 0), 3.5, PX);
    wd('yel', Em0('🟡', 90), 2400, 560); pop('yel', A('b3', 'public yellow', -0.3)); wl('yell', 'public yellow', '#ffd166', 2400, 470, A('b3', 'public yellow', -0.3), 30);
    wd('pb', Em0('🔵', 80), PX, 430); pop('pb', A('b3', 'private colour', -0.3)); wl('pbl', 'my private colour', '#7ee0ff', PX, 360, A('b3', 'private colour', -0.3), 28);
    ask('mixP', '🟢 my mix', '#2dd4bf', PX, 540, SX - 60, 540, A('b3', 'send', -0.2), 2.2);
  });
  blk('b4', 'b5', () => {
    wd('sr', Em0('🔴', 80), SX, 430); pop('sr', A('b4', 'own private colour', -0.3)); wl('srl', 'Sera’s private colour', '#ff9f9f', SX, 360, A('b4', 'own private colour', -0.3), 28);
    ask('mixS', '🟠 Sera’s mix', '#fb923c', SX, 600, PX + 60, 600, A('b4', 'own private colour', 0.4), 2.2);
    wl('fin1', '🟣 same secret colour', '#c084fc', PX, 300, A('b4', 'identical', -0.2), 34); wl('fin2', '🟣 same secret colour', '#c084fc', SX, 300, A('b4', 'identical', -0.2), 34);
    wl('see', '👀 Mal only saw the two mixtures', '#ff7b7b', 1900, 420, A('b4', 'mal only', -0.2), 32);
  });
  blk('b5', 'b6', () => {
    cam(B('b5', -0.3), 2.0, 'hs');
    EV('ec', 'ECDHE · elliptic curve Diffie-Hellman, ephemeral', ['each side brings a random number + a well-known curve', 'same secret from OWN number + the OTHER side’s public value', 'a spy who sees only the public values cannot compute it ✓', 'fresh numbers every handshake → forward secrecy'], '#7ee0ff', [['b5', 'e c d h e'], ['b5', 'random number'], ['b5', 'cannot compute'], ['b5', 'forward secrecy']], End('b5', 0.4));
    stamp(0, End('b5', 0.2), true, ' ');
  });
  blk('b6', 'b7', () => { pulse('mal', A('b6', 'stand in the middle', 0)); wl('mm', '🥸 “I will be the bank”', '#ff7b7b', 1850, 380, A('b6', 'pretending', -0.4), 36); });
  blk('b7', 'b8', () => {
    EV('cert1', 'a certificate says…', ['“the holder of this private key is api.example.com”', 'signed by a Certificate Authority'], '#ffd166', [['b7', 'holder'], ['b7', 'signed']], End('b7', 0.4), 900);
  });
  blk('b8', 'b9', () => {
    cam(B('b8', -0.3), 2.0, 'cass');
    P('ch1', '🏛️ ROOT CA', 'self-signed · trust built into the OS / browser', 140, 150, 1100, 110, '#ff9f6b', 'b8', 'root signs', 0);
    P('ch2', '🏢 INTERMEDIATE CA', 'signed by the root', 140, 280, 1100, 110, '#a78bfa', 'b8', 'intermediate signs', 0);
    P('ch3', '📄 LEAF certificate', 'for the bank · signed by the intermediate', 140, 410, 1100, 110, '#3ddc84', 'b8', 'the leaf is', 0);
    C('wk', '⬆ the client walks up the chain until it reaches a root it trusts', 700, 590, '#ffd166', 'b8', 'walks back up', 1000, 0);
  });
  blk('b9', 'b10', () => { wl('qq', '❓ valid certificate = honest bank?', '#4ade80', 1350, 330, A('b9', 'valid', 0), 36); });
  blk('b10', 'b11', () => {
    EV('idv', 'what a valid certificate means', ['✓ this really is the domain named in the certificate', '✗ NOT that the domain is honest or handles your data well'], '#ff7b7b', [['b10', 'really'], ['b10', 'nothing about']], End('b10', 0.4), 1100);
    wl('gid', '🪪 the ID proves the name, not the honesty', '#ffd166', 1350, 560, A('b10', 'government', 0), 34);
  });
  blk('b11', 'c1', () => {
    C('k1', '🪪 certificate → WHO you are talking to', 700, 250, '#ffd166', 'b11', 'proves who', 800, 0);
    C('k2', '🔑 key exchange → NOBODY ELSE can read it', 700, 340, '#7ee0ff', 'b11', 'key exchange', 800, 0);
    stamp(1, End('b11', 0.2), true, ' ');
  });

  /* ---------------- S3: TLS 1.2 ---------------- */
  blk('c1', 'c2', () => {
    cam(B('c1', -0.3), 2.0, 'hs'); walk('mal', B('c1', 0.3), 3.5, 1850); walk('ivy', B('c1', 0.5), 2.0, 1300);
    wl('v12', 'TLS 1.2', '#ffd166', 2400, 300, A('c1', 'one point two', -0.3), 64);
  });
  blk('c2', 'c3', () => {
    ask('ch12', 'ClientHello: ciphers + random', '#7ee0ff', PX, 560, SX, 560, A('c2', 'clienthello', 0), 2.6);
    C('rt1', '⏱ round trip 1 starts', 1000, 250, '#ffd166', 'c2', 'clienthello', 560, 0);
  });
  blk('c3', 'c4', () => {
    ask('sh12', 'ServerHello: cipher + random', '#60a5fa', SX, 480, PX, 480, A('c3', 'serverhello', 0), 2.0);
    ask('ct12', '📄 Certificate', '#3ddc84', SX, 560, PX, 560, A('c3', 'certificate', 0), 2.0);
    ask('ske', 'ServerKeyExchange: ECDHE public value', '#c084fc', SX, 640, PX, 640, A('c3', 'serverkeyexchange', 0), 2.4);
    ask('shd', 'ServerHelloDone', '#94a3b8', SX, 720, PX, 720, A('c3', 'serverhellodone', 0), 2.0);
  });
  blk('c4', 'c5', () => {
    ask('ckx', 'ClientKeyExchange: my public value', '#c084fc', PX, 560, SX, 560, A('c4', 'clientkeyexchange', 0), 2.4);
    em('ky1', '🔑', 70, PX, 420); pop('ky1', A('c4', 'derive', 0)); em('ky2', '🔑', 70, SX, 420); pop('ky2', A('c4', 'derive', 0));
    ask('cf', '🔒 ChangeCipherSpec + Finished', '#7ee0ff', PX, 660, SX, 660, A('c4', 'changecipherspec', 0), 2.4);
    C('rt2', '⏱ round trip 2 starts', 1000, 250, '#ffd166', 'c4', 'clientkeyexchange', 560, 0);
  });
  blk('c5', 'c6', () => {
    ask('sf', '🔒 ChangeCipherSpec + Finished', '#60a5fa', SX, 600, PX, 600, A('c5', 'changecipherspec', 0), 2.4);
    C('two', '⏱⏱ two round trips done · only now can the HTTP request travel', 1000, 250, '#ff9f6b', 'c5', 'two round trips', 1000, 0);
  });
  blk('c6', 'd1', () => {
    EV('c12', 'the cost of TLS 1.2', ['2 round trips × ~50 ms = ~100 ms before the page starts', 'can it be faster?'], '#ff9f6b', [['c6', 'two round trips'], ['c6', 'faster']], End('c6', 0.4), 1000);
  });

  /* ---------------- S4: TLS 1.3 ---------------- */
  blk('d1', 'd2', () => { wl('v13', 'TLS 1.3 · do not wait to be told: guess', '#3ddc84', 2400, 300, A('d1', 'guess', -0.8), 52); });
  blk('d2', 'd3', () => {
    ask('ch13', 'ClientHello + key_share (guess: X25519)', '#7ee0ff', PX, 560, SX, 560, A('d2', 'clienthello', 0), 2.8);
  });
  blk('d3', 'd4', () => {
    ask('sh13', 'ServerHello + key_share', '#60a5fa', SX, 480, PX, 480, A('d3', 'serverhello', 0), 2.0);
    ask('enc', '🔒 EncryptedExtensions · Certificate · CertificateVerify · Finished', '#3ddc84', SX, 600, PX, 600, A('d3', 'encryptedextensions', 0), 3.4);
    em('ky3', '🔑', 70, SX, 420); pop('ky3', A('d3', 'derive', 0));
    C('enc2', 'everything after ServerHello is already encrypted', 1000, 250, '#3ddc84', 'd3', 'already encrypted', 760, 0);
  });
  blk('d4', 'd5', () => {
    ask('fin13', '🔒 Finished + GET /', '#7ee0ff', PX, 600, SX, 600, A('d4', 'finished', 0), 2.0);
    C('one', '⏱ ONE round trip before application data', 1000, 250, '#3ddc84', 'd4', 'one round trip', 760, 0);
  });
  blk('d5', 'd6', () => {
    wl('tick', '🎟️ session ticket from an earlier visit', '#ffd166', PX, 360, A('d5', 'resumption ticket', -0.3), 30);
    ask('z0', '🔒 ClientHello + early data (GET /)', '#ffd166', PX, 600, SX, 600, A('d5', 'very first flight', -0.2), 2.6);
    C('zr', '0-RTT · data in the very first flight', 1000, 250, '#ffd166', 'd5', 'zero', 760, 0);
  });
  blk('d6', 'd7', () => {
    pulse('mal', A('d6', 'capture', 0));
    ask('rp', '↺ replay: the same bytes, again', '#ff7b7b', 1850, 700, SX, 700, A('d6', 'replay', 0), 2.4);
    C('nw', 'no round trip yet = no fresh number to check ✗', 1000, 330, '#ff7b7b', 'd6', 'fresh number', 760, 0);
  });
  blk('d7', 'd8', () => {
    EV('zrr', '0-RTT: the rule', ['OK: idempotent, side-effect-free requests (a cacheable GET)', 'NEVER: moving money, sending email, changing state ✗', 'Go crypto/tls: 0-RTT not implemented (Go 1.24), by design'], '#ff7b7b', [['d7', 'idempotent'], ['d7', 'never'], ['d7', 'go s']], End('d7', 0.4));
  });
  blk('d8', 'd9', () => { wl('fr', '❓ is 0-RTT free speed?', '#4ade80', 1300, 330, A('d8', 'free', 0), 36); });
  blk('d9', 'e1', () => {
    C('trap', '🪤 trap: a round trip saved = a replay window opened', 1100, 250, '#ffd166', 'd9', 'replay window', 800, 0);
    stamp(2, End('d9', 0.2), true, ' ');
  });

  /* ---------------- S5: SNI + ALPN ---------------- */
  blk('e1', 'e2', () => {
    ask('hello', 'ClientHello (plain text)', '#7ee0ff', PX, 560, SX, 560, A('e1', 'clienthello', 0), 2.6);
    EV('hl', 'inside the first ClientHello', ['supported TLS versions · key share', 'SNI: the hostname I want', 'ALPN: the protocols I speak'], '#7ee0ff', [['e1', 'two more'], ['e1', 'two more'], ['e1', 'plain text']], End('e1', 0.4), 900);
  });
  blk('e2', 'e3', () => { C('sni', 'SNI = brightway.example (server name indication)', 1000, 330, '#ffd166', 'e2', 'server name indication', 800, 0); });
  blk('e3', 'e4', () => {
    cam(B('e3', -0.3), 2.0, 'lo');
    ['🏦 bank A', '🏦 bank B', '🏦 Brightway'].forEach((b, i) => { wl('mb' + i, b, '#ffd166', 2100 + i * 170, 300, A('e3', 'many banks', 0.2 + i * 0.3), 28); });
    wl('oneip', 'ONE IP address', '#7ee0ff', 2270, 240, A('e3', 'one i p', 0), 36);
    C('wc', '❓ which certificate do I show?', 1000, 470, '#ffb066', 'e3', 'which certificate', 600, 0);
    C('wc2', 'without SNI: one certificate for every site ✗', 1000, 540, '#ff7b7b', 'e3', 'one certificate', 760, 0);
  });
  blk('e4', 'e5', () => { C('alpn', 'ALPN = h2, http/1.1 (application layer protocol negotiation)', 1000, 330, '#c084fc', 'e4', 'application layer protocol negotiation', 1000, 0); });
  blk('e5', 'e6', () => {
    ask('picked', 'ServerHello · ALPN: h2', '#60a5fa', SX, 560, PX, 560, A('e5', 'serverhello', 0), 2.2);
    C('h2', '✓ HTTP/2 chosen, not 1.1', 1000, 330, '#3ddc84', 'e5', 'h t t p two', 600, 0);
  });
  blk('e6', 'f1', () => {
    EV('see2', 'what Mal can see', ['SNI: brightway.example ← readable ✗', 'password · path · body ← encrypted ✓', 'Encrypted Client Hello hides SNI · not widely deployed yet'], '#ff7b7b', [['e6', 'hostname'], ['e6', 'password'], ['e6', 'encrypted client hello']], End('e6', 0.4));
    stamp(3, End('e6', 0.2), true, ' ');
  });

  /* ---------------- S6: certificates ---------------- */
  blk('f1', 'f2', () => { cam(B('f1', -0.3), 2.0, 'cass'); });
  blk('f2', 'f3', () => {
    EV('cd', 'the certificate for api.example.com', ['Subject: CN=api.example.com   (a label only)', 'SAN: api.example.com, *.example.com   ← what browsers check', 'Issuer: Let’s Encrypt · valid 90 days'], '#c4b5fd', [['f2', 'hostnames'], ['f2', 'browsers ignore'], ['f2', 'only the s a n']], End('f3', 0.4));
  });
  blk('f3', 'f4', () => { C('cn', '✗ checking CN is the classic mistake · always issue the right SAN list', 1000, 330, '#ff7b7b', 'f3', 'common mistake', 1000, 0); });
  blk('f4', 'f5', () => {
    P('dv', 'DV · domain validation', 'proves control of the domain only · what Let’s Encrypt issues', 140, 150, 1200, 110, '#3ddc84', 'f4', 'd v', 0);
    P('ov', 'OV · organization validation', 'also checks the legal business', 140, 280, 1200, 110, '#ffd166', 'f4', 'o v', 0);
    P('evv', 'EV · extended validation', 'the old green bar · abandoned: users never noticed', 140, 410, 1200, 110, '#ff9f6b', 'f4', 'e v', 0);
  });
  blk('f5', 'f6', () => {
    ask('chal', 'challenge: serve this file / publish this TXT', '#c4b5fd', 1370, 600, 1650, 600, A('f5', 'challenge', 0), 2.0);
    EV('acme', 'ACME · RFC 8555', ['CA gives a challenge: a file at a well-known URL, or a DNS TXT record', 'server proves it → CA issues a 90-day certificate', 'an ACME client renews it automatically, well before expiry'], '#3ddc84', [['f5', 'challenge'], ['f5', 'proves it'], ['f5', 'renews']], End('f5', 0.4));
  });
  blk('f6', 'f7', () => { wl('rv', '❓ revoked? phone the CA every time?', '#f9a8d4', 1500, 330, A('f6', 'revoked', 0), 34); });
  blk('f7', 'f8', () => {
    wl('stp', '📎 OCSP stapling: Sera attaches the proof to the handshake', '#60a5fa', 2400, 330, A('f7', 'stapling', -0.3), 34);
    C('stp2', 'faster · and the CA never learns which sites you visit', 1900, 420, '#3ddc84', 'f7', 'faster', 800, 0);
  });
  blk('f8', 'g1', () => {
    EV('ct', 'Certificate Transparency · RFC 6962', ['every issued certificate goes into public, append-only logs', 'the real domain owner watches the logs → catches a mis-issued certificate', 'how several real CA incidents were caught'], '#c4b5fd', [['f8', 'public'], ['f8', 'watch'], ['f8', 'incidents']], End('f8', 0.4));
    stamp(1, End('f8', 0.2), true, ' ');
  });

  /* ---------------- S7: termination ---------------- */
  blk('g1', 'g2', () => {
    cam(B('g1', -0.3), 2.0, 'lo'); walk('ivy', B('g1', 0.3), 3.0, 2070); walk('nico', B('g1', 0.5), 3.0, 1990);
    wl('whe', '🔒 where does the TLS connection END?', '#ffd166', 2300, 300, A('g1', 'terminates', -0.4), 40);
  });
  const LY = 700;
  blk('g2', 'g3', () => {
    line('l1a', PX, LY, 2270, LY, '#3ddc84', 10); draw('l1a', A('g2', 'decrypt', -1.0), 1.0); line('l1b', 2270, LY, SX, LY, '#ff7b7b', 10, { dash: '22 14' }); draw('l1b', A('g2', 'plain text', -0.3), 1.0);
    wl('t1a', '🔒 TLS', '#3ddc84', 1950, 660, A('g2', 'decrypt', -1.0), 32); wl('t1b', '⚠ plain text · trusted network only', '#ff9f9f', 2720, 660, A('g2', 'plain text', -0.3), 30);
    EV('pa1', '1 · edge terminated  (most common)', ['Client ══ TLS ══▶ Leo (holds the cert) ── plain ──▶ App', 'OK only inside a trusted network (a VPC) · simplest cert management'], '#3ddc84', [['g2', 'edge terminated'], ['g2', 'trust']], End('g2', 0.4), 1200);
  });
  blk('g3', 'g4', () => {
    line('l2a', PX, LY + 50, 2270, LY + 50, '#3ddc84', 10); draw('l2a', A('g3', 'terminate', -0.3), 1.0); line('l2b', 2270, LY + 50, SX, LY + 50, '#38bdf8', 10); draw('l2b', A('g3', 'second', -0.2), 1.0);
    wl('t2', '🔒 TLS 1  +  🔒 TLS 2', '#38bdf8', 2400, 790, A('g3', 'second', -0.2), 32);
    EV('pa2', '2 · re-encrypt', ['Client ══ TLS ══▶ Leo ══ new TLS ══▶ App', 'use when internal traffic must be encrypted too (zero trust, compliance)', 'cost: two handshakes, two certificates to manage'], '#38bdf8', [['g3', 're encrypt'], ['g3', 'zero trust'], ['g3', 'cost']], End('g3', 0.4), 1200);
  });
  blk('g4', 'g5', () => {
    line('l3a', PX, LY + 100, SX, LY + 100, '#c084fc', 12); draw('l3a', A('g4', 'passthrough', 0), 2.0);
    wl('t3', '🔒 one TLS session, client ⇄ app · Leo only reads the SNI', '#c084fc', 2400, 850, A('g4', 's n i', 0), 30);
    EV('pa3', '3 · passthrough + mutual TLS', ['Client ═════ same TLS session ═════▶ App (verifies the client certificate)', 'Leo routes on SNI alone · needs no certificate', 'Go: tls.RequireAndVerifyClientCert · cost: no request inspection at Leo'], '#c084fc', [['g4', 'passthrough'], ['g4', 's n i alone'], ['g4', 'tls dot']], End('g4', 0.4), 1400);
  });
  blk('g5', 'g6', () => { C('mesh', 'service meshes build identity on this → see the Service-to-Service Auth note', 1000, 330, '#ffd166', 'g5', 'service meshes', 1100, 0); });
  blk('g6', 'g7', () => {
    EV('tv12', 'TLS 1.2', ['2 round trips', 'client proposes many ciphers · a weak one can slip in', 'RSA key exchange allowed → no forward secrecy ✗', 'renegotiation (source of past CVEs) · no 0-RTT'], '#ff9f6b', [['g6', 'two round trips'], ['g6', 'many ciphers'], ['g6', 'key exchange'], ['g6', 'renegotiation']], End('g6', 0.4));
  });
  blk('g7', 'h1', () => {
    EV('tv13', 'TLS 1.3', ['1 round trip · 0 on resumption', 'small fixed list of modern ciphers · no RC4, no export', 'ECDHE only → forward secrecy mandatory ✓', 'renegotiation removed · 0-RTT with replay risk'], '#3ddc84', [['g7', 'one round trip'], ['g7', 'small fixed'], ['g7', 'e c d h e only'], ['g7', 'renegotiation removed']], End('g7', 0.4));
    stamp(4, End('g7', 0.2), true, ' ');
  });

  /* ---------------- S8: deep dive ---------------- */
  blk('h1', 'h2', () => { cam(B('h1', -0.3), 2.0, 'hs'); wl('fsq', '❓ why does ECDHE give forward secrecy, and RSA not?', '#ffd166', 2400, 300, A('h1', 'forward secrecy', -0.3), 38); });
  blk('h2', 'h3', () => {
    EV('rsa', 'RSA key exchange ✗', ['client encrypts the secret with the server’s LONG-TERM public key', 'Mal records every session today …', '… steals the private key someday → decrypts ALL past sessions ✗'], '#ff7b7b', [['h2', 'encrypts'], ['h2', 'record'], ['h2', 'retroactively']], End('h2', 0.4));
  });
  blk('h3', 'h4', () => {
    EV('ecd', 'ECDHE ✓', ['fresh ephemeral key pair every handshake', 'secret depends on BOTH ephemeral values', 'long-term key only SIGNS · never derives the secret', 'a later leak exposes nothing from the past ✓'], '#3ddc84', [['h3', 'fresh'], ['h3', 'both ephemeral'], ['h3', 'only used to sign'], ['h3', 'later leak']], End('h3', 0.4));
  });
  blk('h4', 'h5', () => {
    EV('rem', 'removed outright in TLS 1.3', ['renegotiation → man-in-the-middle injection', 'static RSA key exchange → no forward secrecy', 'compression → the CRIME attack', 'most legacy cipher suites'], '#ffd166', [['h4', 'renegotiation'], ['h4', 'static r s a'], ['h4', 'compression'], ['h4', 'legacy cipher suites']], End('h4', 0.4));
    C('aud', 'smaller mandatory set = easier to audit', 1000, 330, '#3ddc84', 'h4', 'easier to audit', 700, 0);
  });
  blk('h5', 'h6', () => {
    EV('strip', 'SSL stripping', ['first visit: customer types the bank address over plain HTTP', 'Mal intercepts → keeps the customer on HTTP forever ✗'], '#ff7b7b', [['h5', 'first visit'], ['h5', 'forever']], End('h5', 0.4), 1100);
  });
  blk('h6', 'h7', () => {
    EV('hsts', 'HSTS · Strict-Transport-Security', ['header: “never try plain HTTP for this site again, for this long”', 'preload: the promise ships inside the browser itself', 'protects the customer even before the first visit ✓'], '#3ddc84', [['h6', 'strict transport security'], ['h6', 'preload'], ['h6', 'before the customer ever visits']], End('h6', 0.4));
  });
  blk('h7', 'h8', () => {
    EV('hs2', 'redirect + HSTS', ['HSTS protects REPEAT visits (the header must be seen once)', 'http:// → 301 / 308 → https:// on EVERY plain request', 'redirect covers visit one · HSTS protects every visit after'], '#ffd166', [['h7', 'repeat visits'], ['h7', 'three oh one'], ['h7', 'every visit after']], End('h7', 0.4));
  });
  blk('h8', 'h9', () => {
    EV('pq', 'post-quantum (Go 1.24)', ['X25519MLKEM768 = X25519 (classical) + ML-KEM (post-quantum, lattice)', 'on by default · client and server', 'hybrid: stays safe even if the post-quantum half is broken'], '#c084fc', [['h8', 'hybrid key exchange'], ['h8', 'lattice'], ['h8', 'undiscovered weakness']], End('h8', 0.4));
  });
  blk('h9', 'j1', () => { C('dnsb', 'DNS cutover (A / AAAA / CNAME, lower the TTL) = a DNS concern, not TLS', 1000, 330, '#7ee0ff', 'h9', 'd n s concern', 1100, 0); });

  /* ---------------- S9: Go ---------------- */
  const cpanel = (id, l0, lEnd, title, lines, steps) => blk(l0, lEnd, () => {
    const cp = S.codePanel(id, lines, { x: 100, y: 110, w: 1380, fs: 24, title, t0: B(l0, 0.3), times: lines.map((x, i) => B(l0, 0.6 + i * 0.25)) });
    steps.forEach((s) => cp.hl(s[0], A(l0, s[1], 0)));
    cp.out(End(lEnd === 'x' ? l0 : l0, 0.2));
  });
  blk('j1', 'j2', () => {
    cam(B('j1', -0.3), 2.0, 'sera');
    ['TestServerNegotiatesTLS13', 'TestTLS12ClientRejectedByTLS13Server', 'TestMutualTLS'].forEach((t, i) => C('tn' + i, '✅ ' + t, 700, 260 + i * 80, ['#3ddc84', '#ff9f6b', '#c084fc'][i], 'j1', ['negotiating', 'rejected', 'mutual'][i], 900, 0));
  });
  cpanel('cp1', 'j2', 'j3', 'server.go', ['srv := &http.Server{', '    Addr:      ":8443",', '    Handler:   mux,', '    TLSConfig: &tls.Config{MinVersion: tls.VersionTLS12},', '}', 'err := srv.ListenAndServeTLS("server.crt", "server.key")', '// h2 is chosen automatically through ALPN'], [[3, 'minimum'], [5, 'listenandservetls'], [6, 'a l p n']]);
  cpanel('cp2', 'j3', 'j4', 'tls_test.go', ['func newTLS13Server(handler http.Handler) *httptest.Server {', '    srv := httptest.NewUnstartedServer(handler)', '    srv.TLS = &tls.Config{MinVersion: tls.VersionTLS13}', '    srv.StartTLS()', '    return srv', '}'], [[1, 'newunstartedserver'], [2, 'srv dot tls'], [3, 'starttls']]);
  cpanel('cp3', 'j4', 'j5', 'tls_test.go', ['func TestServerNegotiatesTLS13(t *testing.T) {', '    srv := newTLS13Server(handler)', '    defer srv.Close()', '    client := srv.Client() // trusts the test server’s own CA', '    resp, err := client.Get(srv.URL)', '    if err != nil { t.Fatalf("get: %v", err) }', '    if resp.TLS.Version != tls.VersionTLS13 {', '        t.Fatalf("negotiated %x, want TLS 1.3", resp.TLS.Version)', '    }', '}'], [[3, 'srv dot client'], [3, 'insecureskipverify'], [6, 'resp dot tls dot version']]);
  cpanel('cp4', 'j5', 'j6', 'tls_test.go', ['func TestTLS12ClientRejectedByTLS13Server(t *testing.T) {', '    srv := newTLS13Server(handler)', '    defer srv.Close()', '    client := srv.Client()', '    transport := client.Transport.(*http.Transport).Clone()', '    transport.TLSClientConfig.MaxVersion = tls.VersionTLS12', '    client.Transport = transport', '    _, err := client.Get(srv.URL)', '    if err == nil { t.Fatal("expected handshake failure") }', '}'], [[4, 'clone'], [5, 'maxversion'], [8, 'must return an error']]);
  cpanel('cp5', 'j6', 'j7', 'testca_test.go', ['type testCA struct {', '    cert *x509.Certificate', '    key  *ecdsa.PrivateKey', '}', 'func newTestCA(t *testing.T) *testCA {', '    key, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)', '    tmpl := &x509.Certificate{ Subject: pkix.Name{CommonName: "test-ca"},', '        NotAfter: time.Now().Add(time.Hour), KeyUsage: x509.KeyUsageCertSign, IsCA: true }', '    der, _ := x509.CreateCertificate(rand.Reader, tmpl, tmpl, &key.PublicKey, key)', '    cert, _ := x509.ParseCertificate(der)', '    return &testCA{cert: cert, key: key}', '}  // error checks trimmed for the video'], [[5, 'p two fifty six'], [8, 'same template'], [7, 'isca true'], [7, 'one hour']]);
  cpanel('cp6', 'j7', 'j8', 'testca_test.go', ['func (ca *testCA) issue(t *testing.T, name string, client bool) tls.Certificate {', '    key, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)', '    tmpl := &x509.Certificate{Subject: pkix.Name{CommonName: name}}', '    if client {', '        tmpl.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth}', '    } else {', '        tmpl.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth}', '        tmpl.IPAddresses = []net.IP{net.ParseIP("127.0.0.1")}', '        tmpl.DNSNames = []string{"localhost"}', '    }', '    der, _ := x509.CreateCertificate(rand.Reader, tmpl, ca.cert, &key.PublicKey, ca.key)', '    return tls.Certificate{Certificate: [][]byte{der}, PrivateKey: key}', '}'], [[10, 'signs a leaf'], [3, 'one boolean'], [8, 'dnsnames']]);
  cpanel('cp7', 'j8', 'j9', 'tls_test.go', ['func TestMutualTLS(t *testing.T) {', '    ca := newTestCA(t)', '    serverCert := ca.issue(t, "127.0.0.1", false)', '    clientCert := ca.issue(t, "test-client", true)', '    srv.TLS = &tls.Config{', '        MinVersion:   tls.VersionTLS13,', '        Certificates: []tls.Certificate{serverCert},', '        ClientAuth:   tls.RequireAndVerifyClientCert,', '        ClientCAs:    pool,', '    }', '    // no client cert   -> handshake fails', '    // with clientCert -> 200, cn from r.TLS.PeerCertificates[0]', '}'], [[7, 'clientauth'], [10, 'no certificate'], [11, 'verified peer certificates']]);
  blk('j9', 'j10', () => {
    EV('meas', 'measured · Go 1.24.4 · darwin/arm64', ['go vet ./...                 → clean', 'go test -race -v            → 3 tests PASS ✓', 'cipher TLS_AES_128_GCM_SHA256 → TLS 1.3 end to end ✓'], '#3ddc84', [['j9', 'go vet'], ['j9', 'all three tests'], ['j9', 'cipher suite']], End('j9', 0.4));
    stamp(2, End('j9', 0.2), true, ' ');
  });
  blk('j10', 'j11', () => {
    EV('osl', 'a real site (representative output)', ['$ openssl s_client -connect example.com:443 -tls1_3', 'Protocol: TLSv1.3   Cipher: TLS_AES_256_GCM_SHA384', 'issuer=C=US, O=Let’s Encrypt, CN=E6', '$ curl -v https://example.com/', '* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256', '* ALPN: server accepted h2'], '#7ee0ff', [['j10', 'openssl'], ['j10', 'protocol'], ['j10', 'issuer'], ['j10', 'curl dash v'], ['j10', 't l s version'], ['j10', 'accepted h two']], End('j10', 0.4));
  });
  blk('j11', 'k1', () => {
    [['real throwaway CA, never skip verification', 'real throwaway'], ['ECDSA keys: fast to generate', 'e c d s a'], ['one issue() function with a flag', 'one issue function'], ['each test fails for exactly one reason', 'exactly one reason']].forEach((d, i) => C('dc' + i, d[0], 700, 260 + i * 80, ['#3ddc84', '#7ee0ff', '#ffd166', '#c084fc'][i], 'j11', d[1], 800, 0));
  });

  /* ---------------- S10: trade-offs, failures, monitoring ---------------- */
  blk('k1', 'k2', () => { cam(B('k1', -0.3), 2.0, 'lo'); wl('dawn', '🌅 dawn · launch in a few hours', '#ffd166', 2400, 300, A('k1', 'dawn', 0), 44); });
  blk('k2', 'k3', () => {
    EV('to1', 'trade-off · the cost of TLS', ['a real handshake (even at 1 RTT) + CPU on every connection', 'negligible for most traffic', 'matters at millions of short connections/s → resume + reuse'], '#ffd166', [['k2', 'handshake'], ['k2', 'negligible'], ['k2', 'millions']], End('k2', 0.4));
  });
  blk('k3', 'k4', () => {
    EV('to2', 'trade-off · mutual TLS', ['every client needs a certificate', 'rotation + revocation must be automated or it becomes an outage', 'use for service-to-service in a mesh · not public APIs (bearer tokens are enough)'], '#c084fc', [['k3', 'every client'], ['k3', 'rotation'], ['k3', 'service to service']], End('k3', 0.4));
  });
  blk('k4', 'k5', () => {
    EV('to3', 'trade-off · 0-RTT and no TLS at all', ['0-RTT: a round trip for a replay window · harmless repeatable requests only', 'no TLS: only inside one trusted process, or on loopback', 'anything crossing a network → encrypted by default'], '#ff9f6b', [['k4', 'zero'], ['k4', 'skipping'], ['k4', 'anything']], End('k4', 0.4));
  });
  blk('k5', 'k6', () => {
    cam(B('k5', -0.3), 2.0, 'sera'); em('alm', '🚨', 130, SX, 330); pop('alm', A('k5', 'alarm', -0.2)); wl('f1', '💥 failure 1', '#ff7b7b', SX, 250, A('k5', 'number one', -0.2), 44);
  });
  blk('k6', 'k7', () => {
    EV('exp', 'Your connection is not private', ['NET::ERR_CERT_DATE_INVALID', 'certificate expired at midnight ✗'], '#ff7b7b', [['k6', 'expired'], ['k6', 'warning page']], End('k6', 0.4), 900);
  });
  blk('k7', 'k8', () => {
    EV('fx1', 'fix', ['automate renewal (ACME) well before the expiry window', 'alert on DAYS TO EXPIRY, not only on failure ✓'], '#3ddc84', [['k7', 'automate renewal'], ['k7', 'days to expiry']], End('k7', 0.4), 1000);
  });
  blk('k8', 'k9', () => {
    cam(B('k8', -0.3), 2.0, 'lo'); wl('f2', '💥 failure 2 · missing intermediate', '#ff7b7b', 2400, 300, A('k8', 'missing', -0.3), 40);
    EV('mi', 'the chain is broken', ['server sends the leaf only ✗', 'older client / stale trust store cannot build the chain', 'fix: always serve the full chain (leaf + intermediates) ✓'], '#ffd166', [['k8', 'missing'], ['k8', 'cannot build'], ['k8', 'full chain']], End('k8', 0.4));
  });
  blk('k9', 'k10', () => {
    wl('f3', '💥 failure 3 · clock skew', '#ff7b7b', PX, 300, A('k9', 'failure three', -0.3), 40);
    EV('ck', 'the clock', ['phone clock says 1999 → valid certificate is “not yet valid” ✗', 'fix: keep NTP running on servers and clients ✓'], '#ff9f6b', [['k9', 'nineteen ninety nine'], ['k9', 'n t p']], End('k9', 0.4), 1100);
  });
  blk('k10', 'k11', () => {
    wl('f4', '💥 failure 4 · mixed content', '#ff7b7b', PX, 300, A('k10', 'failure four', -0.3), 40);
    EV('mx', 'mixed content', ['an https:// page loads an http:// image → blocked or flagged ✗', 'fix: https:// (or protocol-relative) everywhere ✓'], '#ff9f6b', [['k10', 'mixed content'], ['k10', 'rewrite']], End('k10', 0.4), 1100);
  });
  blk('k11', 'k12', () => {
    wl('f5', '💥 failure 5 · TLS ended at the wrong layer', '#ff7b7b', 2400, 300, A('k11', 'failure five', -0.3), 40);
    line('wr', 2270, 740, SX, 740, '#ff7b7b', 10, { dash: '22 14' }); draw('wr', A('k11', 'plain text', -0.3), 1.0);
    EV('wl2', 'wrong layer', ['Leo strips TLS, forwards plain text over an untrusted segment ✗', 'the encryption silently stops at that hop', 'know exactly which hops are encrypted ✓'], '#ff7b7b', [['k11', 'strip'], ['k11', 'silently'], ['k11', 'know exactly']], End('k11', 0.4));
  });
  blk('k12', 'k13', () => {
    EV('mon', 'what to monitor', ['days until certificate expiry (alert well before 30 days)', 'handshake failure rate', 'TLS version + cipher mix real clients use → when to drop 1.2', 'OCSP responder latency (if stapling)', 'HSTS header on every HTTPS response'], '#38bdf8', [['k12', 'days until'], ['k12', 'handshake failure'], ['k12', 'cipher mix'], ['k12', 'o c s p'], ['k12', 'h s t s']], End('k12', 0.4));
    stamp(5, End('k12', 0.2), true, ' ');
  });
  blk('k13', 'q0', () => {
    EV('prod', 'in production', ['nearly all public HTTPS = TLS 1.3 · 1.2 kept for legacy clients', 'Let’s Encrypt · ACM · ZeroSSL automate issuance', 'CDNs terminate at the edge, then re-encrypt or pass through', 'Go 1.22+: server minimum is TLS 1.2'], '#7ee0ff', [['k13', 'nearly all'], ['k13', 'let s encrypt'], ['k13', 'usually terminate'], ['k13', 'since go']], End('k13', 0.4));
  });

  /* ---------------- S11: interview ---------------- */
  ['boardBg', 'cb0', 'cb1', 'cb2', 'cb3', 'cb4', 'cb5'].forEach((k) => hide(k, B('q0', -0.3), 0.4));
  blk('q0', 's0', () => {
    qa([
      ['Why is TLS 1.3 one round trip, not two?', 'The client guesses the group and sends its key share in the first message, so the server can answer in one flight.', 'q1', 'why is'],
      ['What does a certificate prove, and what not?', 'The key holder controls the SAN names, vouched for by a CA chain to a trusted root. Not honesty or security practices.', 'q3', 'what exactly'],
      ['Trap: does 0-RTT make every request faster for free?', 'No. Data can be replayed verbatim. Idempotent, side-effect-free requests only, like a cacheable GET.', 'q5', 'the trap'],
      ['Why does dropping RSA key exchange matter?', 'A leaked server key decrypts all recorded sessions under RSA. Only ephemeral ECDHE remains, so forward secrecy is mandatory.', 'q7', 'why does'],
      ['Edge termination vs mTLS passthrough: when each?', 'Edge: simplest, trusted network. Passthrough: route on SNI, app verifies client certificates, for zero trust meshes.', 'q9', 'what is'],
      ['Protocol version mismatch: what is happening?', 'The server minimum excludes the client maximum. The handshake fails before any data. Lower the minimum or upgrade the client.', 'q11', 'a client'],
      ['Why does SNI leak the hostname when encrypted?', 'It travels in ClientHello before any key exists. The path and body stay hidden. Encrypted Client Hello fixes it, not universal yet.', 'q13', 'why does'],
    ], '#38bdf8');
  });

  /* ---------------- S12: summary ---------------- */
  blk('s0', 's0c', () => {
    cam(B('s0', -0.3), 2.5, 'cafe'); walk('mal', B('s0', 0.5), 6.0, 520); walk('pip', B('s0', 0.5), 6.0, 300); walk('ivy', B('s0', 0.5), 6.0, 800); walk('nico', B('s0', 0.5), 6.0, 700);
    wl('sun', '🌅 09:00 · Brightway goes live', '#ffd166', 650, 300, A('s0', 'nine', 0), 44);
    EV('mal2', 'Mal’s laptop, 09:01', ['▒▓░▒▒░▓▓░▒▓░▒▒░▓  (all noise)', 'fake bank → ⚠ certificate warning page', 'nothing to steal here ✗'], '#ff7b7b', [['s0b', 'noise'], ['s0b', 'pretended'], ['s0b', 'nothing']], B('s0c', 0));
  });
  blk('s0c', 'rn1', () => {
    summary('CASE CLOSED · SUMMARY', [
      ['HTTPS = HTTP over TLS: confidentiality, authentication, integrity', 's1a', '#38bdf8'],
      ['Two jobs: ECDHE agrees the secret, the certificate chain proves identity', 's2a', '#7ee0ff'],
      ['TLS 1.3: 1 round trip, 0-RTT only for safe requests, forward secrecy mandatory', 's3a', '#3ddc84'],
      ['SNI + ALPN ride in ClientHello · SAN not CN · ACME, stapling, Certificate Transparency', 's4a', '#ffd166'],
      ['Termination is a choice: edge, re-encrypt, or passthrough with mutual TLS', 's5a', '#c084fc'],
      ['Outages are boring: expiry, intermediates, clocks, mixed content · monitor days to expiry', 's6a', '#ff9f6b'],
      ['A certificate proves WHO · the key exchange makes sure NOBODY ELSE can read it', 's7g', '#3ddc84'],
    ]);
  });

  /* ---------------- S13: where next + end ---------------- */
  blk('rn1', 'z1', () => {
    readNext('rn1', [['📘 notes: TLS and HTTPS  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: TCP handshake · HTTP/1.1 vs 2 vs 3', 'before', '#ffd166'], ['➡ after: HTTP Caching · Forward and Reverse Proxies', 'after', '#3ddc84'], ['↔ compare: DNS · Service-to-Service Auth (mTLS)', 'compare', '#c084fc'], ['🛠 fuller Go server: TLS, HTTPS and HTTP2 in Go Servers', 'fuller', '#f9a8d4']]);
  });
  cam(B('z1', -0.4), 1.4, 'cafe'); wave('ivy', B('z2', 0.5));
  ui('endBg', rect(0, 330, 1920, 330, 'rgba(8,12,24,.82)'), 0, 0); tw('endBg', B('z2', 1.0), 0.5, { o: 1 });
  endTitle('TLS and HTTPS', 'a certificate says who · the key exchange keeps it private', 'z2');

  function Em0(e, size) { return S.E(e, size); }
})();
