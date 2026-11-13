/* HTTP Caching v2: "The Price That Would Not Change". Story scenes against story_engine.js + story_lib.js. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  world(3400, { sky: '#0e1a3a', skyMid: '#35508a', skyLow: '#e8b070' });
  bld('bB', 300, '#2a6fb0', "BEN'S HOME", '🏠'); bld('bF', 1000, '#0e7490', "FRAN · BEN'S FRIDGE (browser cache)", '🧊'); bld('bC', 1750, '#a05a12', 'CARL · WAREHOUSE (CDN)', '📦'); bld('bO', 2550, '#6d28d9', 'OLGA · PRICE OFFICE (origin)', '🏢');
  const CFG = {
    olga: { who: 'OLGA', skin: '#9b6a47', shirt: '#7c3aed', pants: '#222', hair: '#111', hair2: 'long', glasses: 1, hold: '🔍', w: 96, name: 'Olga', ring: '#c4b5fd' },
    ben: { who: 'BEN', skin: '#d9a37a', shirt: '#3b82f6', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 100, name: 'Ben', ring: '#60a5fa' },
    fran: { who: 'FRAN', skin: '#f0c4a0', shirt: '#06b6d4', pants: '#2a2540', hair: '#7a3b1a', hair2: 'long', hold: '🥛', blush: 1, w: 92, name: 'Fran', ring: '#22d3ee' },
    carl: { who: 'CARL', skin: '#e8b48a', shirt: '#b45309', pants: '#444', hat: 'cap', hatColor: '#92400e', hold: '📦', w: 112, name: 'Carl', ring: '#f59e0b' },
    vera: { who: 'VERA', skin: '#f1c9a5', shirt: '#be185d', pants: '#2a2540', hair: '#3a2a1a', hair2: 'long', hold: '🗂️', w: 90, name: 'Vera', ring: '#ec4899' },
  };
  cast(CFG, { olga: [2570], ben: [340], fran: [1020], carl: [1770], vera: [2150] });
  views({ wide: { x: 1500, y: 470, s: 0.5 }, ben: { x: 700, y: 520, s: 0.95 }, fran: { x: 1050, y: 520, s: 0.95 }, carl: { x: 1900, y: 520, s: 0.95 }, olga: { x: 2400, y: 520, s: 0.95 }, mid: { x: 1300, y: 500, s: 0.62 } });
  camTw(0, 0.001, { x: 1500, y: 470, s: 0.5 });
  const stamp = board('SUSPECTS', [['🥛', 'fridge'], ['⏱️', 'validation'], ['🗂️', 'Vary'], ['📦', 'warehouse']], 1500, 650, B('l1b', 0.5));
  const priceTag = (id, txt2, col, x, y, t) => { wd(id, rect(-150, -50, 300, 100, 'rgba(14,18,30,.95)', { rx: 18, stroke: col, sw: 5 }) + T(txt2, 56, col, {}), x, y); pop(id, t); };

  /* S1: the mystery */
  blk('l1', 'l5', () => {
    priceTag('pn', '₹199', '#3ddc84', 2570, 330, A('l1', 'one', 0.2)); wl('pnl', 'the NEW price, at the source (9:00)', '#7dffb0', 2570, 410, A('l1', 'one', 0.2), 30);
    priceTag('po', '₹149', '#ff7b7b', 340, 330, A('l1', 'ten', -0.2)); wl('pol', 'what customers STILL see (10:00)', '#ffb3b3', 340, 410, A('l1', 'ten', -0.2), 30);
    wl('qq1', '❓ why does nobody see it?', '#ffd166', 1500, 250, A('l1', 'why', -0.2), 70);
    cam(B('l1b', -0.3), 1.6, 'mid'); walk('ben', B('l1b', 0.3), 1.0, 1300);
    wl('hide', '🙈 a copy of my answer is hiding somewhere between the office and the customer', '#ffd166', 1500, 300, A('l1b', 'hiding', -0.1), 40);
    cam(B('l1c', -0.3), 1.6, 'ben');
    wl('rep', '🔁 the same logo · fonts · layout · price every morning', '#7ee0ff', 700, 330, A('l1c', 'logo', -0.1), 40);
  });

  /* S1: the words, then the idea */
  blk('l2', 'l5', () => {
    cam(B('l2', -0.3), 1.6, 'fran');
    em('milk', '🥛', 90, 1020, 540); pop('milk', A('l2', 'milk', -0.2)); wl('bb', 'best before', '#7ee0ff', 1020, 450, A('l2', 'best', -0.1), 36);
    [['Fran = Ben’s fridge · the browser cache', 'fran', '#22d3ee', 1020], ['Carl = a shared warehouse · a CDN', 'carl', '#fbbf24', 1750], ['Olga = the origin · owns the true price', 'olga', '#c4b5fd', 2550]].forEach((c, i) => { cam(B('l3', -0.2), 1.6, 'wide'); wl('who' + i, c[0], c[2], c[3], 300, A('l3', c[1], 0.2), 30); });
    [['request → response', 'request', '#7ee0ff'], ['header: a labelled line', 'header', '#ffd166'], ['body · status code (200 · 304)', 'body', '#3ddc84'], ['fingerprint: changes with the content', 'fingerprint', '#c084fc']].forEach((w, i) => C('wd' + i, w[0], 1500, 360 + i * 70, w[2], 'l4', w[1], 760, 0));
  });
  blk('l5', 'sus1', () => {
    cam(B('l5', -0.3), 1.6, 'wide');
    ev('p1', 'why caching exists', ['1000 people a minute load the same files · wasted bandwidth, CPU, delay', 'RFC 9111: two tools at two moments'], 90, 90, 1400, '#7ee0ff', [A('l5', 'thousand', 0), A('l6', 'rules', 0)], B('l6', 0.5));
    ev('g12', 'the two gates', ['GATE 1 · freshness: skip the trip entirely (max-age)', 'GATE 2 · validation: skip the resend once stale (304)', 'a 14-byte price at max-age=60 → 60 s of traffic = 0 origin requests'], 90, 90, 1400, '#3ddc84', [A('l6', 'freshness', 0), A('l6', 'validation', 0), A('l7', 'fourteen', 0)], B('l8', 0));
    ev('q2', 'Fran asks two questions, in order', ['1  do I already have a recent enough copy?', '2  has it actually changed since I last checked?'], 90, 90, 1400, '#ffd166', [A('l8', 'recent', 0), A('l8', 'changed', 0)], B('l9', 0));
    C('rem', 'ask “can I skip the trip?” before “can I skip the resend?”', 1100, 780, '#3ddc84', 'l9', 'before', 1000, -0.2);
  });

  /* S3: suspect one, the fridge: Cache-Control */
  blk('sus1', 'sus2', () => {
    cam(B('sus1', -0.3), 2.0, 'fran'); walk('olga', B('sus1', 0.2), 4.0, 1200);
    wl('s1', '🥛 suspect 1: a copy of the old price inside its best-before date?', '#22d3ee', 1020, 300, A('sus1', 'fridge', -0.2), 36);
    ask('hdr', 'Cache-Control: public, max-age=60', '#a78bfa', 2550, 520, 1040, 520, A('l11', 'cache', -0.1), 2.4);
    ring('r60', 1350, 200, 70, '#3ddc84', '60 s', A('l12', 'stores', -0.2), 8);
    wl('fresh', 'fresh: answered from memory, zero contact with Olga', '#3ddc84', 1350, 330, A('l12', 'memory', -0.2), 30);
    wl('stale', 'second 61: stale → must at least ask', '#ffb066', 1350, 400, A('l12', 'sixty', 1.0), 30);
    const D = [['max-age=N', 'fresh for N seconds · any cache · a best-before date', '#3ddc84', 'l13', 'max'], ['s-maxage=N', 'overrides max-age · shared caches only (CDN)', '#7ee0ff', 'l14', 's max'], ['no-cache', 'MAY store · must revalidate before every reuse', '#ffd166', 'l15', 'no cache'], ['no-store', 'keep nothing, anywhere · self-destructing message', '#ff7b7b', 'l16', 'no store'], ['private', 'only one user’s own browser · a locker with your key', '#c084fc', 'l17', 'private'], ['public', 'shared caches may store, even with auth · a notice board', '#f472b6', 'l17', 'public'], ['immutable', 'this URL never changes: skip even reload checks · hashed file names only', '#ff9f6b', 'l18', 'immutable'], ['stale-while-revalidate=N', 'serve stale now, refresh in the background', '#60a5fa', 'l19', 'stale while'], ['stale-if-error=N', 'serve stale if the origin errors or is unreachable', '#34d399', 'l19', 'stale if']];
    D.forEach((d, i) => { const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5; ui('dr' + i, rect(0, 0, 820, 110, 'rgba(14,18,30,.94)', { rx: 14, stroke: d[2], sw: 4 }) + T(d[0], 30, d[2], { anchor: 'start', dx: 20, dy: 32 }) + T(d[1], 22, '#cdd6e6', { anchor: 'start', dx: 20, dy: 78 }), 40 + col * 840, 90 + row * 125, {}); pop('dr' + i, A(d[3], d[4], -0.25)); hide('dr' + i, B('l20', 0.2), 0.4); });
    ev('mx', 'the mix-up to avoid', ['max-age: HOW LONG · no-cache / no-store: UNDER WHAT CONDITIONS · public / private: WHO', 'no-cache = keep it but always check first · no-store = keep nothing'], 90, 90, 1500, '#ff7b7b', [A('l20', 'mix', 0), A('l20', 'cache', 1.0)], End('l20', 0.4));
    stamp(0, End('l20', 0.2), false, '', 'one hiding place');
  });

  /* S4: suspect two, validation */
  blk('sus2', 'sus3', () => {
    cam(B('sus2', -0.3), 2.0, 'fran'); walk('olga', B('sus2', 0.1), 1.0, 1200);
    wl('s2', '⏱️ suspect 2: after the best-before date, does Fran check?', '#ffd166', 1050, 300, A('sus2', 'suspect', -0.2), 34);
    wl('tg', 'ETag: an exact fingerprint the server chooses', '#22d3ee', 1500, 400, A('l22', 'e tag', -0.2), 34); card(A('l22', 'e tag', -0.2), 'ETag', 'an exact fingerprint the server chooses', { color: '#22d3ee' });
    ask('qq2', '❓ what is the price today?', '#60a5fa', 340, 560, 1040, 560, B('l23', 0.2), 1.2);
    ask('inm', 'If-None-Match: "0f26d0f1409cfc3c"', '#22d3ee', 1040, 600, 2560, 600, B('l24', 0.6), 2.4); ask('r304', '304 Not Modified · no body', '#3ddc84', 2560, 680, 1040, 680, B('l25', 1.2), 2.4);
    card(A('l25', 'three', -0.1), '304 Not Modified', 'no body · copy fresh again', { color: '#3ddc84', slot: 1 });
    ev('b2', 'If-None-Match wins', ['If-None-Match (ETag): exact · byte for byte', 'If-Modified-Since: one-second resolution', 'RFC 9110 §13.1.3: the server prefers If-None-Match'], 90, 90, 1400, '#c084fc', [A('l27', 'tag', 0), A('l27', 'last', 0), A('l27', 'rule', 0)], B('l28', 0));
    ev('mi', '✗ a classic mistake', ['a timestamp or per-process random value inside the hashed bytes', '→ a new ETag on every request → the server NEVER answers 304 again', 'caching silently stops working ✗'], 90, 90, 1400, '#ff7b7b', [A('l28', 'mistake', 0), A('l28', 'new', 0), A('l28', 'silently', 0)], End('l28', 0.4));
    stamp(1, End('l28', 0.2), true, 'not it');
  });

  /* S5: suspect three, Vary */
  blk('sus3', 'car1', () => {
    cam(B('sus3', -0.3), 2.0, 'carl'); tw('vera', B('sus3', 0.1), 0.3, { o: 1 }); pulse('vera', A('sus3', 'vera', 0));
    wl('s3', '🗂️ suspect 3: one address, several versions?', '#ec4899', 1900, 300, A('sus3', 'suspect', -0.2), 36);
    wl('vh', 'Vary: Accept-Encoding', '#ec4899', 2150, 400, A('l29', 'vary', 0), 36); em('gz', '🗜️', 80, 2050, 640); em('pl', '📄', 80, 2250, 640); pop('gz', A('l30', 'gzip', -0.2)); pop('pl', A('l30', 'do', 0.2));
    ['vh', 'gz', 'pl'].forEach((i) => hide(i, A('l31', 'famous', -0.3), 0.4));
    wl('vc', 'Vary: Cookie  ✗', '#ff5d5d', 2150, 400, A('l31', 'cookie', 0), 44);
    for (let i = 0; i < 8; i++) { em('ck' + i, '🍪', 60, 1950 + (i % 4) * 90, 620 + Math.floor(i / 4) * 80); pop('ck' + i, A('l31', 'cookies', 0.1) + i * 0.12); }
    card(A('l31', 'vary', -0.2), 'Vary: Cookie', 'key per customer = nothing shared', { color: '#ff7b7b' });
    ev('pv', 'what to do instead', ['response differs per user → mark it private, skip the shared cache', 'or split cacheable, cookie-free parts from the personal parts', 'Vary is a correctness tool, not a speed tool'], 90, 90, 1400, '#c084fc', [A('l32', 'private', 0), A('l32', 'split', 0), A('l32', 'correctness', 0)], End('l32', 0.4));
    stamp(2, End('l32', 0.2), true, 'not it');
  });
  tw('vera', B('car1', -0.5), 0.4, { o: 0 });

  /* S5b: suspect four, the warehouse (the culprit) */
  blk('car1', 'l33', () => {
    cam(B('car1', -0.3), 2.0, 'carl'); walk('olga', B('car1', 0.1), 3.0, 1600);
    wl('s4', '📦 suspect 4: the warehouse on every street', '#f59e0b', 1750, 300, A('car1', 'warehouse', -0.2), 36);
    ev('cw', "Carl's shelf vs the browser", ['label: s-maxage=300  → Carl keeps the price 5 minutes · never asks Olga', 'browser: max-age = 0  → revalidates on every load', 'the CDN serves its OWN fresh copy for 300 s without reaching the origin'], 90, 90, 1500, '#f59e0b', [A('car2', 's', 0), A('car2', 'max', 0.8), A('car3', 'c d n', 0)], End('car3', 0.4));
    wl('old', '₹149 on Carl’s shelf', '#ff7b7b', 1750, 400, A('car2', 'five', 0), 44);
    stamp(3, A('car3', 'deliberately', 0.3), false, '', 'FOUND IT');
  });

  /* S6: a request traced */
  blk('l33', 'g1', () => {
    cam(B('l33', -0.3), 1.6, 'mid');
    ev('tr', 'price.json, two requests', ['1  cold request: no If-None-Match → Olga hashes → ETag + 200 + the 14-byte body', '2  Fran stores the body and the ETag', '3  60 s pass: max-age closes → stale', '4  conditional request: GET + If-None-Match: "0f26d0f1409cfc3c"', '5  Olga recomputes the tag → they match', '6  304 Not Modified · no body again = caching WORKING'], 90, 90, 1500, '#3ddc84', [A('l33', 'cold', 0), A('l34', 'stores', 0), A('l34', 'sixty', 0), A('l34', 'conditional', 0), A('l35', 'recomputes', 0), A('l35', 'three', 0)], End('l35', 0.4));
  });

  /* S7: Go */
  blk('g1', 'd1', () => {
    cam(B('g1', -0.3), 1.6, 'olga');
    const L1 = ['func (r Resource) etag() string {', '\tsum := sha256.Sum256(r.Body)', '\treturn `"` + hex.EncodeToString(sum[:8]) + `"` // fingerprint of the CONTENT', '}'];
    const c1 = S.codePanel('c1', L1, { x: 180, y: 90, w: 1560, fs: 29, title: 'etag.go', t0: B('g2', -0.2), times: L1.map((x, i) => A('g2', 'resource', 0) + i * 0.5) });
    c1.hl(1, A('g2', 'sha', 0)); c1.out(A('g3', 'handler', -0.3));
    const L2 = ['func Handler(get func() Resource, maxAge time.Duration) http.HandlerFunc {', '\treturn func(w http.ResponseWriter, req *http.Request) {', '\t\tres := get(); etag := res.etag()', '\t\tw.Header().Set("Cache-Control", "public, max-age=60, must-revalidate")', '\t\tw.Header().Set("ETag", etag)', '\t\tw.Header().Set("Last-Modified", res.LastModified.UTC().Format(http.TimeFormat))', '\t\tw.Header().Set("Vary", "Accept-Encoding")', '\t\tif inm := req.Header.Get("If-None-Match"); inm != "" {', '\t\t\tif inm == etag { w.WriteHeader(304); return }', '\t\t} else if ims := req.Header.Get("If-Modified-Since"); ims != "" {', '\t\t\tif t, err := http.ParseTime(ims); err == nil && !res.LastModified.After(t) {', '\t\t\t\tw.WriteHeader(304); return', '\t\t\t}', '\t\t}', '\t\tw.WriteHeader(200); w.Write(res.Body)', '\t}', '}'];
    const c2 = S.codePanel('c2', L2, { x: 140, y: 100, w: 1640, fs: 26, title: 'handler.go', t0: A('g3', 'handler', -0.2), times: L2.map((x, i) => A('g3', 'gets', 0) + i * 0.3) });
    c2.hl(3, A('g3', 'cache', 0)); c2.hl(7, A('g4', 'if', 0)); c2.hl(8, A('g4', 'equals', 0)); c2.hl(9, A('g4', 'fall', 0)); c2.hl(14, A('g4', 'otherwise', 0)); c2.out(End('g5', 0.3));
    C('gt', 'tests: repeat request with the current tag → 304 ✓ · Last-Modified fallback ✓ · go test -race', 960, 1000, '#3ddc84', 'g5', 'tests', 1300, -0.2);
  });

  /* S8: deep dive */
  blk('d1', 't1', () => {
    cam(B('d1', -0.3), 1.6, 'mid');
    ev('d1', 'strong vs weak validators', ['ETag without W/ = byte-identical · W/"…" = same meaning, maybe not same bytes', 'Range requests need a strong one'], 90, 90, 1500, '#7ee0ff', [A('d1', 'strong', 0), A('d1', 'range', 0)], B('d2', 0));
    ev('d2', 'must-revalidate', ['without it a cache MAY serve stale (e.g. origin unreachable)', 'with it: never stale without a successful check'], 90, 90, 1500, '#ffd166', [A('d2', 'without', 0), A('d2', 'forbids', 0)], B('d3', 0));
    ev('d3', 'a 304 still carries headers', ['a fresh Cache-Control, a changed ETag', 'the body is elided, not the metadata'], 90, 90, 1500, '#3ddc84', [A('d3', 'repeat', 0), A('d3', 'body', 0)], B('d4', 0));
    ev('d4', 'request collapsing', ['many concurrent stale requests → ONE revalidation upstream', 'avoids a thundering herd · a CDN / proxy detail, not a header'], 90, 90, 1500, '#c084fc', [A('d4', 'collapsing', 0), A('d4', 'thundering', 0)], End('d4', 0.4));
  });

  /* S9: trade-offs, failures, monitoring */
  blk('t1', 'fix1', () => {
    cam(B('t1', -0.3), 1.6, 'mid');
    ev('t1', 'trade-offs', ['live auction bid · stock ticker → no-store or a very short max-age', 'never stale-while-revalidate where a stale read is a BUG: inventory near zero · payment status', 'ETags cost a hash · for huge bodies Last-Modified is cheaper but coarser'], 90, 90, 1500, '#ffb066', [A('t1', 'auction', 0), A('t2', 'never', 0), A('t2', 'tags', 0)], B('t3', 0));
    ev('fm', 'production failures → fixes', ['stale data served silently → shorten max-age, or no-cache + strong ETags', 'a per-user page cached at a shared cache → private · never public with auth or cookies', 'Vary: Cookie kills sharing → split cacheable from personal', 'an ETag that changes every request → hash only stable fields'], 90, 90, 1500, '#ff7b7b', [A('t3', 'stale', 0), A('t3', 'user', 0), A('t4', 'vary', 0), A('t4', 'tag', 0)], B('t5', 0));
    ev('mn', 'what to monitor', ['hit ratio · 304 ratio (a low 304 on stable content = an unstable ETag)', 'static files: a hashed name + public, max-age=31536000, immutable'], 90, 90, 1500, '#3ddc84', [A('t5', 'hit', 0), A('t5', 'recipe', 0)], End('t5', 0.4));
  });

  /* S10: the fix */
  blk('fix1', 'q0', () => {
    cam(B('fix1', -0.3), 2.0, 'wide');
    ev('fx', 'the fix', ['Carl’s s-maxage 300 + Fran’s best-before + no validator = 3 hiding places', 'a shorter max-age · a long s-maxage ONLY where stale is safe · a strong ETag', 'for a price: no-cache + ETag → every reuse checked, yet a 304 still saves the download ✓'], 90, 90, 1500, '#3ddc84', [A('fix1', 'three', 0), A('fix2', 'shorter', 0), A('fix2', 'price', 0)], B('fix3', 0));
    priceTag('pn2', '₹199', '#3ddc84', 340, 330, A('fix3', 'one', 0)); priceTag('pn3', '₹199', '#3ddc84', 1750, 330, A('fix3', 'one', 0.3)); priceTag('pn4', '₹199', '#3ddc84', 2570, 330, A('fix3', 'one', 0.6));
    wl('cc', '🔒 CASE CLOSED · 10:15 · the new price everywhere', '#3ddc84', 1500, 250, A('fix3', 'case', 0), 70);
  });

  /* S11: interview */
  blk('q0', 's0', () => {
    qa([['No-cache versus no-store?', 'no-cache: store, but revalidate before every reuse (a 304 still saves the download) · no-store: keep nothing', 'q1', 'no'], ['Why does If-None-Match beat If-Modified-Since?', 'ETags are exact · Last-Modified has 1 s resolution and misses same-second round trips', 'q2', 'why'], ['Every request returns 200: is caching broken?', 'not necessarily · the bug is a repeat request with a correct If-None-Match STILL getting 200 → unstable ETag', 'q3', 'every'], ['stale-while-revalidate vs a shorter max-age?', 'the user never waits on the origin: serves stale instantly, refreshes in the background', 'q4', 'stale'], ['Why is Vary: Cookie almost always a mistake?', 'one entry per visitor → the shared cache never hits · use private instead', 'q5', 'why'], ['CDN s-maxage=300, browser still refetches?', 's-maxage is for shared caches only · a browser max-age of 0 → revalidates · set both deliberately', 'q6', 'the']], '#c4b5fd');
  });

  /* S12: summary, next */
  blk('s0', 'rn1', () => {
    summary('CASE CLOSED · SUMMARY', [['freshness skips the trip · validation skips the resend, once the copy is stale', 's1a', '#7ee0ff'], ['Cache-Control: how long · under what conditions · who · immutable for hashed files', 's1b', '#3ddc84'], ['stale-while-revalidate / stale-if-error trade a little staleness for speed and resilience', 's1c', '#ffd166'], ['ETag = exact · Last-Modified = 1 s · If-None-Match wins · a match → 304, no body = caching works', 's1d', '#22d3ee'], ['Vary splits by a header: Accept-Encoding fine, Cookie kills sharing · no timestamps in an ETag', 's1e', '#ff7b7b'], ['strong tags for Range · must-revalidate · a 304 keeps headers · caches collapse revalidations', 's1f', '#c084fc'], ['ask “can I skip the trip?” before “can I skip the resend?”', 's1g', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 notes: HTTP Caching - Cache-Control, ETag, Conditional Requests  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: HTTP-1.1 vs HTTP-2 vs HTTP-3 · HTTP Fundamentals', 'before', '#ffd166'], ['➡ after: CDN and Edge · Caching Fundamentals', 'after', '#3ddc84'], ['↔ compare: Cache Invalidation, TTL and Consistency (Redis-level caches)', 'compare', '#c084fc']]); });
  cam(B('e1', -0.4), 1.4, 'ben'); wave('ben', B('e1', 0.5));
  endTitle('HTTP Caching', 'can I skip the trip? can I skip the resend?', 'e2');
})();
