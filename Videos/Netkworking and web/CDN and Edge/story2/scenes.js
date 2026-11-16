/* CDN and Edge: "Friday at Nine". Story scenes written against story_engine.js + story_lib.js. */
(function () {
  const { tx, A, B, End, GY, ui, wd, em, uem, chip, line, draw, fly, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, ring, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;

  // ---------- the street: Mumbai (left) -> regional hub -> Virginia (right) ----------
  world(3200);
  bld('bP', 330, '#a01d1d', 'PIA · MUMBAI BRANCH', '🥖'); bld('bS', 1550, '#1e5fa8', 'SAM · REGIONAL HUB', '🛡️'); bld('bO', 2600, '#a05a12', "OSCAR'S BAKERY · VIRGINIA", '🍞');
  const CFG = {
    oscar: { who: 'OSCAR', skin: '#e8b48a', shirt: '#b8c2d6', pants: '#4a4f5c', hat: 'chef', apron: '#f4f4f4', w: 150, name: 'Oscar', ring: '#e0a96d' },
    ravi: { who: 'RAVI', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Ravi', ring: '#4ade80' },
    pia: { who: 'PIA', skin: '#d99b6c', shirt: '#2f9e5a', apron: '#e8f7ee', hat: 'cap', hatColor: '#2f9e5a', pants: '#2d3a4f', w: 94, blush: 1, name: 'Pia', ring: '#3ddc84' },
    sam: { who: 'SAM', skin: '#b07a52', shirt: '#6b7280', tie: '#d33a3a', glasses: 1, hair: '#444', pants: '#2a2f3a', hold: '📋', w: 112, name: 'Sam', ring: '#7aa7ff' },
    maya: { who: 'MAYA', skin: '#c98d5b', shirt: '#ff8a3d', pants: '#3a3f5c', hair: '#1a1210', hair2: 'long', blush: 1, hold: '📱', w: 92, name: 'Maya', ring: '#ff8a3d' },
    mal: { who: 'MAL', skin: '#e0ac82', shirt: '#1c1c22', pants: '#1c1c22', mask: 1, hair: '#111', w: 104, name: 'Mal', ring: '#ff5d5d' },
  };
  cast(CFG, { pia: [440, 0.92], maya: [-300], oscar: [2540], ravi: [2380], sam: [1570], mal: [900, 1, true] });
  views({ wide: { x: 1500, y: 470, s: 0.5 }, pia: { x: 650, y: 520, s: 0.95 }, hub: { x: 1500, y: 520, s: 0.9 }, osc: { x: 2500, y: 520, s: 0.9 }, mid: { x: 1000, y: 500, s: 0.62 } });
  camTw(0, 0.001, { x: 1500, y: 470, s: 0.5 });
  const SL = [[170, 540], [245, 540], [320, 540], [395, 540], [170, 640], [245, 640], [320, 640], [395, 640]];
  const stamp = board('FRIDAY PLAN', [['📍', 'branch'], ['🏷️', 'labels'], ['🔑', 'keys'], ['🤝', 'collapse'], ['🔒', 'private'], ['✏️', 'recall']], 1540, 620, B('l6', 0.5));

  /* S1: the deadline */
  blk('l1', 'l7', () => {
    wl('clk', '⏰ Friday 9:00 · fifty thousand orders', '#ffd166', 1500, 230, A('l1', 'friday', -0.2), 80);
    ask('rq', '🍞 one loaf, please', '#ff8a3d', -250, 640, 2500, 640, A('l4', 'cross', -0.2), 4.0);
    line('route', 40, 880, 2480, 880, '#ff5d5d', 10, { dash: '0.03 0.015' }); draw('route', A('l4', 'cross', 0), 3.5);
    wl('lat', '180–250 ms each way', '#ffb3b3', 1500, 400, A('l4', 'typically', 0), 90);
    walk('maya', B('l4', -0.5), 3.5, 190);
    for (let i = 0; i < 30; i++) { em('cr' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 60, 300 + i * 40, 790); pop('cr' + i, A('l5', 'fifty', 0) + i * 0.08); }
    wl('c50', '50,000 customers', '#fff', 1500, 330, A('l5', 'fifty', 0), 80);
    cam(B('l5', -0.4), 2.0, { x: 2400, y: 520, s: 0.9 });
    em('sw', '💦', 80, 2560, 540, { loop: { dy: 40, period: 1.1 } }); tw('sw', A('l5', 'buried', -0.5), 0.3, { o: 1 });
    cam(B('l6', -0.6), 1.5, 'osc'); walk('ravi', B('l3', 0.2), 0.8, 2380);
  });

  /* S2: Pia's branch */
  blk('l7', 'l13', () => {
    cam(B('l7', -0.3), 2.2, 'pia');
    wl('shp', '🏪 a branch inside Mumbai', '#7ee0ff', 330, 300, A('l7', 'branch', 0), 40);
    card(A('l8', 'content', -0.3), 'CDN', 'Content Delivery Network', { color: '#7ee0ff' }); card(A('l8', 'pop', -0.2), 'PoP', 'Point of Presence = one branch', { color: '#3ddc84', slot: 1 });
    for (let i = 0; i < 3; i++) { em('sl' + i, ['🍞', '🥖', '🥐'][i], 62, SL[i][0], SL[i][1], { keep: true }); pop('sl' + i, B('l9', 0.8 + i * 0.4)); }
    walk('maya', B('l9', 0.5), 5.0, 760);
    em('hit', '🍞', 70, 170, 540); fly('hit', B('l11', 0.3), [[170, 540], [450, 470], [740, 580]], 1.0, { arc: 80 }); hide('hit', B('l11', 1.5), 0.3);
    wl('fast', '⚡ milliseconds', '#7dffb0', 800, 380, B('l11', 0.9), 54);
    card(A('l12', 'cache', -0.2), 'Cache hit', 'served from the shelf', { color: '#3ddc84' }); wl('zz', '😴 Oscar: not even asked', '#cdd6e6', 330, 160, A('l12', 'never', -0.2), 34);
    stamp(0, A('l12', 'hit', 0.5), true, 'done');
  });

  /* S3: the miss, the shield, push and pull */
  blk('l13', 'l19', () => {
    cam(B('l13', -0.2), 2.2, 'mid');
    wd('empty', rect(-34, -34, 68, 68, 'rgba(255,255,255,.08)', { rx: 10, stroke: '#ffd166', sw: 4, dash: '10 8' }), 245, 640); pop('empty', A('l13', 'never', -0.2));
    em('rq3', '🥖', 70, 760, 640); wl('rq3l', 'rye?', '#fff', 760, 560, A('l13', 'miss', -0.3), 44); pop('rq3', A('l13', 'asks', -0.3));
    card(A('l13', 'cache miss', -0.1), 'Cache miss', 'branch has no copy', { color: '#ff7b7b' });
    ask('p1', '📞 do you have the rye?', '#ffd166', 440, 520, 1560, 520, B('l14', 0.3), 1.6); ask('p2', '📞 not today · I will ask Oscar', '#7aa7ff', 1560, 560, 2520, 560, B('l15', 0.4), 2.0);
    cam(B('l16', -0.5), 2.0, 'wide');
    em('rye', '🥖', 70, 2560, 700); pop('rye', A('l16', 'bakes', -0.1)); fly('rye', A('l16', 'travels', -0.2), [[2560, 700], [1560, 700], [450, 600]], 4.2, { arc: 90 });
    card(A('l16', 'origin', -0.1), 'Origin shield', 'one tier between branches and origin', { color: '#7aa7ff' });
    em('sl3', '🥖', 62, 335, 540, { keep: true }); tw('sl3', A('l16', 'keeps', 0.5), 0.01, { o: 1 }); tw('rye', A('l16', 'keeps', 0.5), 0.01, { o: 0 }); hide('empty', A('l16', 'keeps', 0.3), 0.3);
    cam(B('l18', -0.2), 2.0, 'mid');
    wd('van', Em('🚚', 140), 2500, 770); pop('van', A('l18', 'push', -0.6)); fly('van', A('l18', 'delivers', -0.2), [[2500, 770], [1500, 770], [520, 770]], 4.8, {});
    for (let i = 4; i < 8; i++) { em('sl' + i, ['🥖', '🍞', '🥐', '🥯'][i - 4], 62, SL[i][0], SL[i][1], { keep: true }); pop('sl' + i, A('l18', 'delivers', 4.6 + (i - 4) * 0.3)); }
    hide('van', A('l18', 'delivers', 6.8), 0.4);
    card(A('l18', 'pull', -0.1), 'Pull CDN', 'fetch on the first miss (default)', { color: '#7ee0ff' }); card(A('l18', 'push', -0.2), 'Push CDN', 'upload to every branch ahead of time', { color: '#c084fc', slot: 1 });
  });

  /* S4: how Maya finds Pia */
  blk('l19', 'l22', () => {
    cam(B('l19', -0.3), 1.8, 'wide');
    [['🏪 Mumbai', 330], ['🏪 London', 1000], ['🏪 Tokyo', 1900], ['🏪 Virginia', 2600]].forEach((p, i) => { wl('pin' + i, p[0], '#cdd6e6', p[1], 330, B('l19', 0.3 + i * 0.2), 40); });
    ask('d1', '☎️ which branch?', '#ff8a3d', 790, 560, 380, 400, B('l19', 1.5), 1.2);
    wl('any', 'ANYCAST: one number, the network rings the nearest', '#7ee0ff', 1500, 220, A('l20', 'anycast', -0.2), 42);
    for (let i = 0; i < 3; i++) { wd('rg' + i, '<circle r="60" fill="none" stroke="#7ee0ff" stroke-width="8"/>', 760, 640); tw('rg' + i, A('l20', 'phone', -0.2 + i * 0.5), 1.8, { o: [0.9, 0], s: [0.3, 8] }, { ease: 'out' }); }
    C('cf', 'Cloudflare · Fastly', 760, 120, '#7ee0ff', 'l20', 'cloudflare', 440, -0.1);
    card(A('l20', 'anycast', 0.1), 'Anycast', 'one number, nearest branch answers', { color: '#7ee0ff' });
    wl('geo', 'GEO DNS: a directory gives a number per region', '#ffd166', 1500, 280, A('l21', 'geo', -0.2), 42);
    C('cl', 'CloudFront: GeoDNS · Akamai: mixes both', 1500, 120, '#ffd166', 'l21', 'cloud', 640, -0.1);
    card(A('l21', 'geo', 0), 'GeoDNS', 'a directory answers per region', { color: '#ffd166', slot: 1 });
  });

  /* S5: labels and freshness */
  blk('l22', 'l30', () => {
    cam(B('l22', -0.3), 2.0, 'mid');
    walk('ravi', B('l22', 0), 1.0, 2380);
    wd('tag', rect(-250, -80, 500, 160, '#f3e3b2', { rx: 18, stroke: '#a98a45', sw: 5 }) + T('Cache-Control', 30, '#6b5420', { dy: -28 }) + T('max-age=3600', 52, '#1b1b1b', { dy: 34 }), 2300, 420); pop('tag', B('l22', 0.5));
    ring('r1', 330, 300, 70, '#3ddc84', 'fresh', A('l24', 'max', -0.3), 6);
    card(A('l24', 'max', -0.1), 'max-age / TTL', 'how long a copy counts as fresh', { color: '#3ddc84' });
    C('c1', 's-maxage: branches only', 1000, 150, '#7aa7ff', 'l24', 's max', 420, -0.1); C('c2', 'no-cache: check first', 1000, 220, '#ffd166', 'l24', 'no cache', 420, -0.1); C('c3', 'no-store: never shelve', 1000, 290, '#ff7b7b', 'l24', 'no store', 420, -0.1);
    hide('tag', A('l25', 'so', -0.2), 0.4);
    em('stale', '⏰', 90, 330, 400); pop('stale', A('l25', 'hour', -0.2));
    ask('q', '❓ still the same batch?', '#ffd166', 440, 470, 2500, 470, A('l26', 'phone', 0), 2.4); ask('y', '✅ same recipe: keep it', '#3ddc84', 2500, 520, 440, 520, B('l27', 0.4), 2.4);
    card(A('l28', 'three', -0.2), '304 Not Modified', 'cheap yes, no loaf resent', { color: '#3ddc84' }); hide('stale', A('l28', 'copy', 0), 0.3);
    card(A('l29', 'stale', -0.1), 'stale-while-revalidate', 'serve old now, refresh in the background', { color: '#c084fc', slot: 1 });
    em('old', '🍞', 70, 170, 540); fly('old', A('l29', 'instantly', -0.2), [[170, 540], [450, 470], [740, 580]], 1.2, { arc: 80 }); hide('old', A('l29', 'instantly', 1.4), 0.3);
    stamp(1, A('l29', 'customer', 0.5), true, 'done');
  });

  /* S6: the cache key */
  blk('l30', 'l34', () => {
    cam(B('l30', -0.3), 1.6, 'pia');
    ui('pl1', rect(0, 0, 520, 100, 'rgba(14,18,30,.93)', { rx: 18, stroke: '#7ee0ff', sw: 4 }) + Em('🍞', 56, { dx: 56, dy: 52 }) + T('sourdough', 30, '#fff', { anchor: 'start', dx: 110, dy: 34 }) + T('sliced', 34, '#7ee0ff', { anchor: 'start', dx: 110, dy: 72 }), 1050, 330, {}); pop('pl1', A('l30', 'sliced', -0.6));
    ui('pl2', rect(0, 0, 520, 100, 'rgba(14,18,30,.93)', { rx: 18, stroke: '#c084fc', sw: 4 }) + Em('🥖', 56, { dx: 56, dy: 52 }) + T('sourdough', 30, '#fff', { anchor: 'start', dx: 110, dy: 34 }) + T('whole', 34, '#c084fc', { anchor: 'start', dx: 110, dy: 72 }), 1050, 450, {}); pop('pl2', A('l30', 'whole', -0.5));
    card(A('l30', 'cache', -0.1), 'Cache key', 'what decides: same loaf or not', { color: '#ffd166' });
    walk('maya', B('l31', -0.2), 0.8, 790);
    em('rib', '🎀', 70, 790, 560); pop('rib', B('l31', 0.1)); fly('rib', A('l31', 'ribbon', 0.3), [[790, 560], [1000, 380]], 1.0, { arc: 90 }); hide('rib', A('l32', 'ribbon', 0.4), 0.3);
    wl('same', 'same slot ✓', '#3ddc84', 1300, 390, A('l32', 'same', 0), 40);
    C('utm', 'utm_source=… ignored ✗', 1250, 560, '#9aa4b6', 'l33', 'tracking', 440, -0.1);
    ['😀', '😎', '🤓', '😊', '🧐', '😄', '🙂', '😇'].forEach((f, i) => { ui('fk' + i, rect(-48, -52, 96, 112, 'rgba(14,18,30,.93)', { rx: 14, stroke: '#ff7b7b', sw: 3 }) + Em(f, 40, { dy: -20 }) + Em('🍞', 40, { dy: 30 }), 1040 + i * 110, 700, {}); pop('fk' + i, A('l33', 'cookie', 0.1 + i * 0.12)); });
    card(A('l33', 'vary', -0.2), 'Vary: Cookie', 'key per customer = nothing shared', { color: '#ff7b7b' });
    stamp(2, A('l33', 'useless', 0.5), true, 'done');
  });

  /* S7: the rehearsal stampede */
  blk('l34', 'l40', () => {
    cam(B('l34', -0.3), 2.0, 'wide');
    wl('mid', '🌙 midnight rehearsal of Friday 9:00', '#ffd166', 1500, 210, B('l34', 0.3), 44);
    for (let i = 0; i < 40; i++) { em('rc' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 56, 650 + (i % 10) * 45, 790 + Math.floor(i / 10) * 25); pop('rc' + i, A('l34', 'hundred', 0.1) + (i % 8) * 0.04); }
    for (let i = 0; i < 40; i++) { em('rp' + i, '📞', 44, 0, 0); fly('rp' + i, A('l35', 'phoned', -0.3) + (i % 10) * 0.1, [[700 + (i % 10) * 45, 760], [1700, 640 + (i % 5) * 20], [2480, 700 + (i % 4) * 15]], 3.2, { arc: 50 + (i % 5) * 20, ease: 'lin' }); hide('rp' + i, A('l35', 'phoned', 3.4 + (i % 10) * 0.1), 0.2); }
    wl('stamp1', 'STAMPEDE', '#ff5d5d', 1500, 300, A('l35', 'stampede', -0.2), 120); hide('stamp1', A('l36', 'everyone', 0.5), 0.4);
    for (let i = 0; i < 40; i++) tw('rc' + i, A('l36', 'everyone', 0), 0.4, { o: 0.45 });
    em('one', '📞', 110, 450, 480); fly('one', A('l36', 'phone', 0.1), [[450, 480], [1560, 560]], 2.6, { arc: 70 }); fly('one', B('l38', 0.3), [[1560, 560], [2480, 700]], 2.6, { arc: 70 }); hide('one', B('l38', 3.0), 0.3);
    card(A('l37', 'request', -0.1), 'Request collapsing', 'many asks, one fetch', { color: '#3ddc84' });
    wl('cnt', '100 → 1', '#3ddc84', 1500, 300, A('l39', 'exactly', -0.9), 150); hide('cnt', End('l39', 1.2), 0.5);
    stamp(3, A('l39', 'rehearsal', 0.3), true, 'done');
  });

  /* S8: Mal the prankster */
  blk('l40', 'l46', () => {
    cam(B('l40', -0.3), 2.0, 'pia'); tw('mal', B('l40', 0.2), 0.01, { o: 1 }); walk('mal', B('l40', 0.3), 3.0, 1000);
    walk('maya', B('l40', 0.2), 1.0, 790);
    wd('cake', Em('🎂', 100) + T('MAYA', 30, '#fff', { dy: 66 }), 440, 560); pop('cake', A('l40', 'cake', 0));
    ui('priv', rect(-170, -60, 340, 120, 'rgba(255,60,60,.12)', { rx: 14, stroke: '#ff5d5d', sw: 8 }) + T('🔒 PRIVATE', 60, '#ff5d5d', { w: 800 }), 960, 250, { r: -6 }); pop('priv', A('l41', 'private', -0.1)); hide('priv', B('l42', -0.2), 0.4);
    fly('cake', A('l41', 'never', 0), [[440, 560], [640, 520], [790, 590]], 1.4, { arc: 70 });
    card(A('l42', 'private', -0.1), 'private / no-store', "one person's data never shared", { color: '#ff7b7b' }); C('sc', 'Set-Cookie → never in a shared cache', 1300, 780, '#ffd166', 'l42', 'set', 560, -0.1);
    ev('po', 'cache POISONING', ['Mal slips a FAKE label on a loaf', 'the shelf ignores that detail when matching', '→ the fake loaf is handed to everyone ✗'], 560, 90, 900, '#ff7b7b', [A('l43', 'poisoning', 0), A('l43', 'slips', 0), A('l43', 'handed', 0)], A('l43', 'deception', -0.3));
    em('fakeL', '🏷️', 60, 1000, 560); pop('fakeL', A('l43', 'slips', -0.2)); fly('fakeL', A('l43', 'slips', 0), [[1000, 560], [500, 480], [395, 540]], 1.4, { arc: 70 });
    ev('de', 'cache DECEPTION', ['GET /maya/account/nonexistent.css', 'the shelf: “a plain style file”, shelves it', "→ Maya's private page goes to strangers ✗"], 560, 90, 900, '#ffb066', [A('l43', 'deception', 0), A('l43', 'ending', 0), A('l43', 'strangers', 0)], B('l44', 0));
    ev('fx', 'the fix, for both', ['the shelf code includes EVERYTHING that varies', 'the bakery rejects strange endings', 'signed URL: expiry + signature · signed cookie: a whole aisle ✓'], 560, 90, 1000, '#3ddc84', [A('l44', 'everything', 0), A('l44', 'reject', 0), A('l45', 'signed', 0)], End('l45', 0.5));
    walk('mal', A('l44', 'not', 0.2), 3.0, 1700);
    stamp(4, A('l45', 'aisle', 0.5), true, 'done');
  });
  tw('mal', B('l46', -0.5), 0.4, { o: 0 });

  /* S9: the recipe changes */
  blk('l46', 'l51', () => {
    cam(B('l46', -0.3), 2.0, 'wide');
    wd('sign', rect(-280, -60, 560, 120, '#f3e3b2', { rx: 18, stroke: '#a98a45', sw: 5 }) + T('Sourdough', 56, '#2a1c08', {}), 2500, 330); pop('sign', B('l46', 1.0));
    tx('sign', A('l47', 'sourdough two', -0.4), 'Sourdough 2');
    for (let i = 0; i < 4; i++) tw('sl' + i, A('l48', 'abandoned', i * 0.15), 0.5, { o: 0.3 });
    C('v2', 'new name = a new cache entry · nothing has to expire', 1500, 520, '#7dffb0', 'l47', 'sourdough two', 700, 0.4);
    card(A('l48', 'versioned', -0.1), 'Versioned URL', 'new name, old entry just ignored', { color: '#3ddc84' });
    for (let i = 0; i < 4; i++) tw('sl' + i, B('l49', 0), 0.4, { o: 1 });
    [4, 5, 6].forEach((i, k) => { em('tg' + k, '🏷️', 40, SL[i][0] + 20, SL[i][1] - 30); pop('tg' + k, A('l49', 'tag', 0.2 + k * 0.2)); });
    [4, 5, 6].forEach((i) => tw('sl' + i, A('l49', 'purge', 0.5), 0.5, { o: 0, s: 0.3 }));
    card(A('l49', 'tag', 0), 'Tag purge', 'recall only the loaves with one tag', { color: '#ffd166' });
    [0, 1, 2, 3].forEach((i) => tw('sl' + i, A('l49', 'soft', 0.3), 0.5, { o: 0.45 })); card(A('l49', 'soft', -0.1), 'Soft purge', 'mark stale, serve until fresh arrives', { color: '#c084fc', slot: 1 });
    [0, 1, 2, 3].forEach((i) => tw('sl' + i, B('l50', -0.2), 0.3, { o: 1 }));
    wl('btn', '🔴 THROW AWAY EVERYTHING', '#ff3b3b', 1500, 300, A('l50', 'shout', -0.5), 60);
    [[330], [1000], [1900]].forEach((b, k) => { for (let j = 0; j < 6; j++) { em('op' + k + '_' + j, '📞', 52, 0, 0); fly('op' + k + '_' + j, A('l50', 'same', -0.3) + j * 0.14 + k * 0.05, [[b[0], 700], [1700, 640], [2480, 700]], 2.6, { arc: 60 + j * 14, ease: 'lin' }); hide('op' + k + '_' + j, A('l50', 'same', 2.5 + j * 0.14), 0.2); } });
    wl('out', 'OUTAGE', '#ff3b3b', 1500, 450, A('l50', 'outage', -0.2), 150); hide('out', End('l50', 0.4), 0.5); hide('btn', End('l50', 0.4), 0.5);
    tw('oscar', A('l50', 'same', 1.5), 0.2, { r: -6 }); tw('oscar', A('l50', 'same', 1.7), 0.2, { r: 6 }); tw('oscar', A('l50', 'same', 1.9), 0.3, { r: 0 });
    stamp(5, A('l50', 'routine', 0.5), true, 'done');
  });
  [4, 5, 6].forEach((i) => tw('sl' + i, B('l51', 0.1), 0.6, { o: 1, s: 1 }, { ease: 'back' }));

  /* S10: Pia has a brain */
  blk('l51', 'l54', () => {
    cam(B('l51', -0.3), 1.8, 'pia');
    wd('thk', Em('💭', 120) + T('{ }', 48, '#222', { dy: -6 }), 450, 380); pop('thk', A('l51', 'edge', -0.3));
    card(A('l51', 'edge', -0.2), 'Edge compute', 'your own code at the branch', { color: '#c084fc' });
    em('tk', '🎫', 70, 800, 540); pop('tk', A('l51', 'checks', 0.2)); wl('tkc', '✓ not expired', '#7dffb0', 800, 470, A('l51', 'expiry', 0), 36); hide('tk', A('l51', 'redirects', -0.4), 0.3); hide('tkc', A('l51', 'redirects', -0.4), 0.3);
    em('rd', '↪️', 80, 720, 580); pop('rd', A('l51', 'redirects', 0)); em('ab', '🅰️', 70, 640, 470); em('ab2', '🅱️', 70, 740, 470); pop('ab', A('l51', 'taste', 0)); pop('ab2', A('l51', 'taste', 0.2));
    hide('rd', A('l51', 'taste', 1.4), 0.3); hide('ab', A('l51', 'troublemakers', -0.5), 0.3); hide('ab2', A('l51', 'troublemakers', -0.5), 0.3);
    ev('au', 'auth: edge vs origin', ['the edge: fast pre-checks (token signature + expiry)', 'the origin: the real decision · member list lives with Oscar', "Pia's copy is only eventually up to date"], 560, 90, 1000, '#7aa7ff', [A('l52', 'never', 0), A('l52', 'oscar', 0), A('l52', 'eventually', 0)], B('l53', 0));
    cam(B('l53', -0.2), 2.2, 'wide');
    em('hs', '🤝', 90, 800, 700); pop('hs', A('l53', 'handshakes', -0.2)); hide('hs', A('l53', 'handshakes', 2.4), 0.3);
    line('warm', 450, 700, 2480, 740, '#ffd166', 12); draw('warm', A('l53', 'warm', -0.2), 1.0);
    em('chk2', '🛒', 80, 0, 0); fly('chk2', A('l53', 'custom', -1.5), [[800, 700], [1500, 650], [2480, 720]], 3.6, { arc: 60 }); hide('chk2', A('l53', 'custom', 2.3), 0.3);
    line('bb', 450, 800, 2480, 820, '#7ee0ff', 16, { dash: '0.03 0.02' }); draw('bb', A('l53', 'backbone', -0.3), 1.2); wl('bbt', 'private backbone', '#7ee0ff', 1500, 890, A('l53', 'backbone', 0.1), 52);
    card(A('l53', 'dynamic', -0.1), 'Dynamic site acceleration', 'warm connection + short TLS hop', { color: '#ffd166' }); card(A('l53', 'newer', -0.1), 'HTTP/3 (QUIC)', 'survives wifi to mobile', { color: '#7ee0ff', slot: 1 });
  });

  /* S11: video and the scoreboard */
  blk('l54', 'l57', () => {
    cam(B('l54', -0.3), 1.6, 'pia');
    uem('vid', '🎬', 190, 1635, 380); pop('vid', B('l54', 0.4)); hide('vid', A('l54', 'slices', 0), 0.3);
    for (let i = 0; i < 6; i++) { ui('seg' + i, rect(-40, -34, 80, 68, '#1e2a4a', { rx: 10, stroke: '#7ee0ff', sw: 3 }) + T('seg ' + (i + 1), 22, '#7ee0ff'), 1635 + (i - 2.5) * 92, 380, {}); tw('seg' + i, A('l54', 'slices', i * 0.12), 0.01, { o: 1 }); tw('seg' + i, A('l54', 'slices', 0.01 + i * 0.12), 0.5, { y: 540 }, { ease: 'back' }); }
    C('hls', 'HLS · DASH', 1700, 250, '#7ee0ff', 'l54', 'h l s', 260, 0); C('ql', 'quality switches by asking for another slice', 1500, 760, '#ffd166', 'l54', 'switch', 700, -0.4);
    ev('sb', 'Pia’s scoreboard', ['request hit ratio    ████████████', 'byte hit ratio       ███████  (a giant video skews the request count)', 'origin offload · TTFB per region · purge speed · egress bill'], 440, 90, 1300, '#3ddc84', [A('l55', 'hit', 0), A('l55', 'byte', 0), A('l56', 'origin', 0)], End('l56', 0.5));
  });

  /* S12: who sells branches, trade-offs */
  blk('l57', 'l58a', () => {
    cam(B('l57', -0.3), 1.6, 'wide');
    [['Cloudflare', '#f6821f', 'cloudflare', 330], ['Fastly', '#ff6b6b', 'fastly', 1000], ['Akamai', '#4c8bf5', 'akamai', 1650], ['CloudFront', '#ffb84d', 'cloud', 2300]].forEach((p, i) => { wl('pv' + i, '🏪 ' + p[0], p[1], p[3], 330, A('l57', p[2], -0.2), 46); });
    wl('diy', 'DIY: Varnish / Nginx → you own hardware, routing and the pager', '#9aa4b6', 1500, 420, A('l57', 'varnish', -0.2), 36);
    ev('to', 'branches are not free', ['Pia may serve a stale loaf', "a problem in Brazil = a branch Oscar does not own", 'one viral loaf still funnels to one shelf slot', 'rarely repeated custom orders gain little', 'a local-only cafeteria needs no branches ✗'], 440, 90, 1200, '#ff9f6b', [A('l58', 'stale', 0), A('l58', 'brazil', 0), A('l58', 'viral', 0), A('l58', 'rarely', 0), A('l58', 'cafeteria', 0)], End('l58', 0.5));
  });

  /* S13: deep dive (evidence cards beside Oscar) */
  blk('l58a', 'l58f', () => {
    cam(B('l58a', -0.3), 1.6, 'osc'); walk('ravi', B('l58a', 0.2), 1.0, 2400);
    ev('dd1', 's-maxage · stale-if-error', ['s-maxage: a CDN freshness window different from the browser, one body', 'stale-if-error: origin down? serve the old copy, not an error'], 300, 90, 1300, '#7ee0ff', [A('l58a', 's', 0), A('l58b', 'stale', 0.2)], B('l58c', 0));
    ev('dd2', 'anycast route flapping', ['routes change mid-session → a long stream or WebSocket can break', 'providers keep announcements very stable'], 300, 90, 1300, '#ff9f6b', [A('l58c', 'anycast', 0), A('l58c', 'providers', 0)], B('l58d', 0));
    ev('dd3', 'cost shape · edge KV', ['egress per GB varies by region · a high hit ratio cuts the origin bill', 'edge KV: fast reads everywhere, slow writes · a flag yes, a counter no'], 300, 90, 1300, '#ffd166', [A('l58d', 'cost', 0), A('l58d', 'edge', 0)], B('l58e', 0));
    ev('dd4', 'collapsing has a limit', ['only helps while a fetch is in flight', 'a key cold everywhere, asked at different moments = normal traffic', 'the shield’s job there: hold the warm copy'], 300, 90, 1300, '#ff7b7b', [A('l58e', 'last', 0), A('l58e', 'cold', 0), A('l58e', 'shield', 0)], End('l58e', 0.5));
  });

  /* S14: real headers */
  blk('l58f', 'l58h', () => {
    ev('h1', 'curl -sI www.cloudflare.com  (marketing page)', ['HTTP/2 200', 'cache-control: no-store', '→ personalised: opts out of every shared cache ✓'], 300, 90, 1300, '#ff7b7b', [A('l58f', 'cache', 0), A('l58f', 'no', 0), A('l58f', 'personalised', 0)], B('l58g', -0.2));
    ev('h2', 'a public static file', ['cache-control: public, max-age=3600', 'age: … · x-cache: …', 'any shared cache may hold it for one hour ✓'], 300, 90, 1300, '#3ddc84', [A('l58g', 'public', 0), A('l58g', 'age', 0), A('l58g', 'literally', 0)], End('l58g', 0.5));
  });

  /* S15: Go code, at three in the morning */
  blk('l58h', 'l58l', () => {
    cam(B('l58h', -0.3), 1.6, 'osc');
    const LN = ['func (s *Shield) Get(key string) ([]byte, int, error) {', '\ts.mu.Lock()', '\tif c, ok := s.inFlight[key]; ok { // a fetch is already running', '\t\tc.waiters++', '\t\ts.mu.Unlock()', '\t\t<-c.done // wait for the shared result', '\t\treturn c.value, c.waiters, c.err', '\t}', '\tc := &call{done: make(chan struct{}), waiters: 1}', '\ts.inFlight[key] = c // register BEFORE unlocking', '\ts.mu.Unlock()', '\tc.value, c.err = s.fetch(key) // one origin call', '\ts.mu.Lock(); delete(s.inFlight, key); s.mu.Unlock()', '\tclose(c.done) // wakes every waiter', '\treturn c.value, c.waiters, c.err', '}'];
    const cp = S.codePanel('code', LN, { x: 180, y: 80, w: 1560, fs: 30, title: 'shield.go', t0: B('l58h', 0.3), times: LN.map((x, i) => A('l58h', 'in', 0.5) + i * 0.15) });
    cp.hl(1, A('l58i', 'takes', 0)); cp.hl(5, A('l58i', 'waits', 0)); cp.hl(9, A('l58j', 'registers', 0)); cp.hl(11, A('l58j', 'calls', 0)); cp.hl(13, A('l58k', 'closed', 0)); cp.out(End('l58k', 0.3));
    C('go100', '100 concurrent misses → 1 origin call (go test -race ✓)', 960, 1000, '#3ddc84', 'l58k', 'hundred', 900, 0);
  });

  /* S16: interview, Ravi asks, Oscar answers */
  blk('l58l', 'l59a', () => {
    qa([['Max-age vs s-maxage?', 'max-age: every cache · s-maxage: shared caches only (CDN); browsers ignore it', 'l58m', 'one'], ['Hit ratio → ~0 after adding Vary: Cookie?', 'every request = its own cache key → nothing shared · strip the cookie / stop varying', 'l58n', 'two'], ['“A CDN can’t help my logged-in dashboard”?', 'False: TLS at the PoP, a warm origin pool, HTTP/3 = dynamic acceleration', 'l58o', 'three'], ['Poisoning vs deception?', 'poisoning: key misses an input → a bad copy shared · deception: a private page cached as “static”', 'l58p', 'four'], ['Edge vs origin for auth? GeoDNS vs anycast?', 'edge: signature + expiry pre-check, origin decides · anycast: instant failover; GeoDNS: simple, coarse, TTL-bound', 'l58q', 'five']], '#7ee0ff');
  });

  /* S17: Friday at nine, then the summary */
  blk('l59a', 'l59d', () => {
    cam(B('l59a', -0.3), 2.0, 'wide');
    for (let i = 0; i < 50; i++) { em('fc' + i, ['🙋‍♀️', '🙋‍♂️', '🙋'][i % 3], 56, 80 + (i % 25) * 38, 780 + Math.floor(i / 25) * 28); pop('fc' + i, A('l59a', 'fifty', 0) + i * 0.03); }
    ev('db', "Oscar's dashboard · Friday 9:00", ['requests            ████████████████████  100,000', 'reached the origin  █                      a handful', 'served by Pia        ███████████████████   the rest ✓'], 480, 90, 1000, '#3ddc84', [A('l59b', 'hundred', 0), A('l59b', 'handful', 0), A('l59b', 'rest', 0)], End('l59b', 0.5));
    cam(B('l59c', -0.3), 1.6, 'pia'); wave('maya', B('l59c', 0.2));
  });
  blk('l59d', 'rn1', () => {
    summary('FRIDAY PLAN · SUMMARY', [['📍 copies sit close to the customers', 'l59d', '#3ddc84'], ['🏷️ labels say how long they stay fresh', 'l59d', '#ffd166'], ['🔑 the key says what is shared', 'l59d', '#7ee0ff'], ['🤝 collapsing protects Oscar', 'l59d', '#c084fc'], ['✏️ rename instead of recall', 'l59d', '#ff9f6b'], ['🔒 private stays private', 'l59d', '#ff7b7b'], ['⚡ quick checks at the edge, real decisions at the origin', 'l59d', '#3ddc84']]);
  });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 notes: CDN and Edge  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: HTTP Fundamentals · DNS', 'before', '#ffd166'], ['➡ after: Forward and Reverse Proxies · What Happens When You Type a URL', 'after', '#3ddc84']]); });
  cam(B('e1', -0.4), 1.4, 'osc'); wave('ravi', B('e1', 0.5));
  endTitle('CDN and Edge', 'copies close · rules clear · decisions at the origin', 'e2');
})();
