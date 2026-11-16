/* Orbit Station ep 1 v3: The Two Hatches. Plain language, clean screen. */
(function () {
  const { tx, mono, A, B, End, GY, ui, wd, em, uem, chip, fly, ask, ev, C, P, blk, walk, cam, views, wl, ring, cast, board, qa, summary, readNext, endTitle, wave, camTw, mk, tw, hide, pop, T, rect, circ, Em } = H;
  const keep = { keep: true };

  // ---- the spaceport: stars, planet, viewport windows, deck plates, docking bays -------------------------
  function space(width) {
    mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02040c"/><stop offset=".55" stop-color="#0a1130"/><stop offset="1" stop-color="#1a1d45"/></linearGradient></defs>' + rect(-1600, -1600, width + 3200, 2450, 'url(#sg)'), keep);
    mk('stars', Array.from({ length: Math.floor(width / 30) }, (_, i) => circ((i * 197) % (width + 1500) - 700, ((i * 89) % 900) - 600, 1.5 + (i % 3), 'rgba(255,255,255,.8)')).join(''), keep);
    mk('planet', circ(width * 0.5, 90, 330, '#1d4f9c') + circ(width * 0.5 + 70, 120, 270, 'rgba(0,0,0,.3)') + '<ellipse cx="' + width * 0.5 + '" cy="90" rx="520" ry="70" fill="none" stroke="rgba(180,210,255,.45)" stroke-width="10"/>' + circ(width - 260, 60, 90, '#cfd3da') + circ(width - 290, 40, 18, '#a9aeb8') + circ(260, 20, 60, '#c98a5b'), keep);
    mk('wall', rect(-1600, 300, width + 3200, 500, '#131a35') + Array.from({ length: Math.floor(width / 260) + 8 }, (_, i) => rect(-700 + i * 260, 360, 200, 110, '#040612', { rx: 16, stroke: '#2c3a75', sw: 4 }) + circ(-640 + i * 260, 400, 3, '#fff') + circ(-560 + i * 260, 430, 2, '#fff')).join('') + rect(-1600, 300, width + 3200, 14, '#2c3a75'), keep);
    mk('deck', rect(-1600, 790, width + 3200, 2000, '#262b3d') + rect(-1600, 830, width + 3200, 70, '#323a52') + Array.from({ length: Math.floor(width / 100) + 30 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#f5c542')).join('') + Array.from({ length: Math.floor(width / 140) + 20 }, (_, i) => rect(-1500 + i * 140, 905, 4, 200, 'rgba(255,255,255,.06)')).join(''), keep);
  }
  // a docking-bay module: wall block, round hatch, light strips, sign
  const bay = (id, x, col, sign, icon) => mk(id, rect(-210, -360, 420, 360, col, { rx: 14 }) + rect(-210, -360, 420, 26, 'rgba(255,255,255,.12)', { rx: 10 }) + circ(0, -170, 128, 'rgba(0,0,0,.35)') + circ(0, -170, 116, '#1b2340', { stroke: '#7ee0ff', sw: 8 }) + circ(0, -170, 86, '#0b1226', { stroke: 'rgba(255,255,255,.25)', sw: 4 }) + Array.from({ length: 8 }, (_, i) => circ(Math.cos(i * Math.PI / 4) * 104, -170 + Math.sin(i * Math.PI / 4) * 104, 5, '#ffd166')).join('') + '<g transform="translate(0 -170)">' + Em(icon, 90) + '</g>' + rect(-196, -330, 12, 150, '#3ddc84', { rx: 6 }) + rect(184, -330, 12, 150, '#3ddc84', { rx: 6 }) + T(sign, 28, '#fff', { dy: -392 }), Object.assign({ x, y: GY }, keep));

  space(3000);
  bay('bT', 300, '#1e3a5f', 'TOWER · VEGA', '📡'); bay('bL', 1050, '#5b21b6', 'CUSTOMS · LEX', '📜');
  bay('bH', 1800, '#0e7490', 'STATION HATCH', '🚪'); bay('bN', 2500, '#9f1239', 'NOVA · DOCKING ARM', '🚀');
  const CFG = {
    vega: { who: 'VEGA', skin: '#c98d5b', shirt: '#1d4ed8', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '📡', w: 96, name: 'Vega', ring: '#38bdf8' },
    pip: { who: 'PIP', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Pip', ring: '#4ade80' },
    brix: { who: 'BRIX', skin: '#e3b08a', shirt: '#0e7490', pants: '#333', hat: 'cap', hatColor: '#134e4a', tie: '#fbbf24', hold: '🚪', w: 112, name: 'Brix', ring: '#22d3ee' },
    lex: { who: 'LEX', skin: '#f0c4a0', shirt: '#7c3aed', pants: '#2a2540', glasses: 1, hair: '#8a8a8a', hold: '📜', w: 100, name: 'Lex', ring: '#c4b5fd' },
  };
  cast(CFG, { vega: [420], pip: [280], lex: [1110], brix: [1860] });
  views({
    wide: { x: 1500, y: 480, s: 0.5 }, tower: { x: 560, y: 520, s: 0.95 }, lex: { x: 1100, y: 520, s: 0.95 }, hatch: { x: 1850, y: 520, s: 0.95 },
    arm: { x: 2500, y: 520, s: 0.95 }, mid: { x: 2150, y: 500, s: 0.62 }, left: { x: 800, y: 500, s: 0.62 },
  });
  camTw(0, 0.001, { x: 2150, y: 500, s: 0.62 });
  const stamp = board('DOCKING BOARD', [['📜', 'Blueprint'], ['🔩', 'Hatch'], ['🛡️', 'Line'], ['🧩', 'Go code']], 1500, 30, B('d1', 0.4));

  // ---- clean-screen helpers: every item gets its own slot (index), and is faded before the next group ------
  const GX = 780, GY0 = 190, DY = 84;
  // a page of up to 4 chips: items [text, line, phrase, colour?]; all faded at tOut
  function pg(tag, items, tOut, col, o) {
    o = o || {};
    items.forEach((it, i) => { const id = tag + i; C(id, it[0], o.x || GX, (o.y || GY0) + i * DY, it[3] || col || '#7ee0ff', it[1], it[2], o.w || 760, 0); hide(id, tOut, 0.3); });
  }
  // the one-line rule of a scene
  const rule = (line, text) => { C('rule_' + line, '📏 RULE: ' + text, GX, 300, '#ffd166', line, 'so the rule is', 900, 0); hide('rule_' + line, End(line, 0.4), 0.3); };
  // rows of cards (title + sub) in their own slots, all faded at tOut
  function cards(tag, rows, tOut, col, o) {
    o = o || {};
    rows.forEach((r, i) => { const id = tag + i; P(id, r[0], r[1], 130, (o.y || 150) + i * 150, 1250, 124, r[4] || col || '#7ee0ff', r[2], r[3], 0); hide(id, tOut, 0.3); });
  }
  const GOLD = '#ffd166', GRN = '#3ddc84', RED = '#ff7b7b', CY = '#7ee0ff', PUR = '#c4b5fd', ORG = '#fb923c';

  /* 1: the ship that cannot dock */
  blk('a1', 'b1', () => {
    cam(B('a1', -0.2), 0.1, 'mid');
    wl('nv', '🚀 NOVA · low on fuel', '#fb7185', 2500, 290, A('a1', 'low on fuel', 0), 38);
    ring('r30', 1500, 180, 70, RED, '30 min', A('a1', 'half an hour', 0), 14); hide('r30', B('a2', -0.2), 0.3);
    pg('a1c', [['🔩 the arm does not fit the hatch ✗', 'a1', 'does not fit', RED]], B('a2', -0.15));
    cam(B('a2', -0.3), 1.6, 'tower');
    pg('a3c', [['🛠️ ship crew built the ARM', 'a3', 'ship crew', CY], ['🛠️ station crew built the HATCH', 'a3b', 'station crew', GRN], ['❓ nobody wrote the size down', 'a3c', 'nobody', RED]], B('a4', -0.15));
    pg('a5c', [['📐 agree on the shape first, in writing', 'a5', 'agree', CY]], B('a6', -0.15));
    rule('a6', 'write the shape down before anyone builds');
  });

  /* 2: the label nobody told us about */
  blk('b1', 'c1', () => {
    cam(B('b1', -0.3), 1.6, 'arm');
    ev('b1e', 'ship cargo screen', ['looking for: price', 'screen: (blank) ✗'], 90, 90, 760, RED, [A('b1', 'cargo screen', 0), A('b1', 'gone blank', 0)], B('b2', -0.2));
    cam(B('b2', -0.3), 1.6, 'tower');
    ev('b2e', 'the cargo form', ['yesterday: price', 'today: amount'], 90, 90, 760, GOLD, [A('b2c', 'one word', 0), A('b2c', 'became amount', 0)], B('b3', -0.1));
    cam(B('b3', -0.3), 1.6, 'hatch');
    cam(B('b4', -0.3), 1.6, 'arm');
    ev('b4e', "the ship's screen", ['asks for: price', 'finds nothing', 'shows nothing ✗'], 90, 90, 760, RED, [A('b4', 'still looks', 0), A('b4', 'finds nothing', 0), A('b4', 'shows nothing', 0)], B('b5', -0.1));
    pg('b5c', [['🟢 station checked its own side: all passed', 'b5', 'everything passed', GRN], ['🔴 a ship far away: blank screen', 'b5', 'far away', RED]], B('b6', -0.15));
    pg('b6c', [['📱 old app, not updated for weeks', 'b6', 'phone', CY], ['🔤 it still asks for the old word', 'b6', 'old word', GOLD], ['🕳️ blank screen, and no error on the station', 'b6', 'no error', RED]], B('b7', -0.15));
    rule('b7', 'a name others rely on is a promise, no quiet changes');
  });

  /* 3: the words we need */
  blk('c1', 'd1', () => {
    cam(B('c1', -0.3), 1.6, 'tower');
    pg('c2c', [['🔌 A P I: a program asks a program', 'c2', 'a p i', CY], ['💬 request and response: a question and its answer', 'c3', 'request', GRN], ['📦 field: one named box on a form', 'c4', 'field', ORG]], B('c5', 0));
    pg('c5c', [['📜 contract: the written promise of what goes in and out', 'c5', 'contract', PUR], ['💥 breaking change: a change that makes someone fail', 'c6', 'breaking change', RED]], B('c7', -0.2));
    rule('c7', 'an A P I is a conversation, the contract is its script');
  });

  /* 4: Lex and the blueprint */
  blk('d1', 'e1', () => {
    walk('vega', B('d1', 0.4), 3.4, 980); cam(B('d1', -0.3), 2.0, 'lex');
    pg('d4c', [['🔌 plug maker', 'd4c', 'plugs', CY], ['🔲 socket maker', 'd4c', 'sockets', GRN], ['📐 both build to one published shape', 'd4d', 'published shape', GOLD]], B('d5', -0.15));
    pg('d5c', [['✍️ write the shape down once, everyone builds to it', 'd5', 'write the shape', GOLD]], B('d6', -0.15));
    pg('d6c', [['📜 Open A P I: the technical drawing', 'd6', 'open a p i', PUR], ['🤖 so exact a machine can check a plug against it', 'd6', 'machine', CY]], B('d7', -0.2));
    rule('d7', 'one published shape, every side builds to it');
    stamp(0, End('d7', -0.3), true, 'done');
  });

  /* 5: draw first or build first */
  blk('e1', 'f1', () => {
    pg('e1c', [['✏️ contract first: draw, agree, then build', 'e1', 'draw the blueprint', CY], ['🔨 code first: build, then draw from it', 'e2', 'build first', ORG]], B('e3', -0.1));
    pg('e4c', [['✏️ draw first: many crews can start together', 'e4', 'draw first', CY], ['🔨 build first: quick for one small team', 'e5', 'build first', ORG], ['🙈 but the drawing shows only what it did', 'e5b', 'only shows', GOLD]], B('e6', -0.15));
    cam(A('e6', 'drift', -1), 1.6, 'hatch');
    pg('e6c', [['⚠️ DRIFT: drawing says one thing, hatch does another', 'e6', 'drift', RED], ['🏭 cut the hatch FROM the drawing: no disagreement', 'e7', 'cut from', GRN], ['🔁 build first: redraw by machine, stop on change', 'e8', 'redraw', CY]], B('e9', -0.15));
    rule('e9', 'make drawing and hatch unable to drift apart');
    stamp(1, End('e9', -0.3), true, 'done');
  });

  /* 6: inside the blueprint */
  blk('f1', 'g1', () => {
    cam(B('f1', -0.3), 1.6, 'lex');
    em('bp', '📜', 150, 1100, 640); pop('bp', A('f1', 'blueprint', 0));
    pg('f2c', [['🚪 the doors (endpoints)', 'f2', 'doors', CY], ['➡️ what goes in', 'f3', 'what goes in', GRN], ['⬅️ what comes out', 'f4', 'what comes out', ORG], ['🛑 what the errors say', 'f5', 'errors', RED]], B('f6', -0.15));
    pg('f6c', [['📏 every text has a longest length', 'f6b', 'longest length', GOLD], ['📏 every list has a biggest size', 'f6b', 'biggest size', GOLD]], B('f7', -0.15));
    pg('f7c', [['🔑 who may enter', 'f7', 'who may enter', PUR], ['🟢 health check: open to everyone', 'f7', 'health check', GRN]], B('f8', -0.2));
    rule('f8', 'doors, in, out, errors and limits, all written down');
  });

  /* 7: tidy habits */
  blk('g1', 'h1', () => {
    cam(B('g1', -0.3), 1.6, 'lex');
    pg('g2c', [['🕒 times: one standard way, one time zone', 'g2', 'times', CY], ['💰 money: whole cents plus a currency name', 'g3', 'money', GRN], ['🆔 ids: written as text, never rounded', 'g4', 'ids', ORG]], B('g5', 0));
    pg('g5c', [['🔤 names: one style everywhere', 'g5', 'names', PUR], ['📄 long lists: always in pages, with a maximum', 'g6', 'long lists', CY], ['🈳 no value: leave the field out', 'g7', 'no value', GOLD]], B('g8', -0.2));
    rule('g8', 'one way to write each thing, everywhere');
  });

  /* 8: must, may and empty */
  blk('h1', 'i1', () => {
    cam(B('h1', -0.3), 1.6, 'lex');
    pg('h2c', [['🟢 required: must be there', 'h2', 'must be there', GRN], ['🟡 optional: may be missing', 'h3b', 'may be missing', GOLD], ['⚪ null: there, but empty on purpose', 'h4b', 'empty on purpose', CY]], B('h6', -0.15));
    pg('h6c', [['missing → leave the old note alone', 'h6', 'is missing', GRN], ['empty → wipe the note', 'h6c', 'wipe it', ORG], ['words → replace the note', 'h6c', 'replace it', CY]], B('h7', -0.1));
    pg('h7c', [['🚨 mix up missing and empty: notes get wiped', 'h7', 'mix up', RED]], B('h8', -0.15));
    rule('h8', 'must, may and empty are three different promises');
  });

  /* 9: what breaks and what is safe */
  blk('i1', 'j1', () => {
    cam(B('i1', -0.3), 1.6, 'lex');
    pg('i2c', [['➕ add a new optional label: SAFE ✅', 'i2', 'adding', GRN]], B('i3', -0.15));
    pg('i3c', [['➖ take a label away: BREAKS ❌', 'i3', 'taking', RED], ['✏️ rename = take away + add: BREAKS ❌', 'i4', 'renaming', RED], ['🔁 number changed to text: BREAKS ❌', 'i4b', 'changing', RED]], B('i5', -0.15));
    pg('i5c', [['1  add the new label', 'i5a', 'step one', GRN], ['2  keep the old one, marked going away', 'i5b', 'step two', GOLD], ['3  watch until nobody uses the old one', 'i5d', 'step three', CY], ['4  remove it in the next big version', 'i5e', 'step four', ORG]], B('i6', -0.15));
    pg('i6c', [['👓 tolerant reader: ignore unknown labels', 'i6', 'tolerant reader', CY], ['❔ unknown status word shows as unknown', 'i6', 'status word', PUR]], B('i8', -0.15));
    C('rule_i9', '📏 RULE: add freely, take away slowly', GX, 300, GOLD, 'i9', 'add freely', 900, 0); hide('rule_i9', End('i9', 0.4), 0.3);
  });

  /* 10: booking a berth */
  blk('j1', 'k1', () => {
    cam(B('j1', -0.3), 1.6, 'mid');
    ask('rq', '📨 request', CY, 2500, 520, 1860, 520, A('j2', 'knocks', 0), 1.4);
    ev('j2e', 'REQUEST · door: bookings', ['berth: bay seven', 'bunks: two', 'note: empty on purpose'], 90, 90, 760, CY, [A('j2', 'berth', 0), A('j2', 'bunks', 0), A('j2', 'request', 0)], B('j3', -0.2));
    ask('rs', '📬 booking', GRN, 1860, 560, 2500, 560, A('j3', 'answers', 0), 1.4);
    ev('j3e', 'RESPONSE · the booking', ['booking number', 'status: confirmed', 'total: whole cents + currency'], 90, 90, 760, GRN, [A('j3', 'booking number', 0), A('j3', 'status', 0), A('j3', 'total', 0)], B('j4', -0.15));
    pg('j4c', [['📋 pending · confirmed · cancelled · more may come', 'j4', 'pending', GOLD], ['🆕 a new word? show "unknown", do not crash', 'j4', 'cope', CY]], B('j5', -0.15));
    ev('j5e', 'ERROR · always the same shape', ['short title', 'a status', 'a code: BUNK_TAKEN'], 90, 90, 760, RED, [A('j5', 'short title', 0), A('j5', 'a status', 0), A('j5', 'code', 0)], B('j6', -0.15));
    pg('j6c', [['🔁 the same booking sent twice?', 'j6', 'twice', RED], ['🔑 idempotency key: spot a repeat, same answer', 'j7d', 'idempotency', GRN]], B('j8', -0.2));
    rule('j8', 'one shape in, one shape out, one shape for every no');
  });

  /* 11: the safety line */
  blk('k1', 'l1', () => {
    cam(B('k1', -0.3), 1.6, 'lex');
    mk('belt', rect(820, 800, 760, 24, '#3a4766', { rx: 12 }) + rect(820, 824, 760, 8, '#1b2340'), { o: 0 }); pop('belt', A('k1', 'conveyor belt', -0.3));
    em('crate', '📦', 100, 850, 770); pop('crate', A('k1', 'conveyor belt', 0));
    pg('k2c', [['1  🧹 style check (Spectral)', 'k2', 'style check', CY], ['2  🔍 change check (oasdiff), red stamp', 'k3', 'change check', RED], ['3  ⚙️ make templates (oapi-codegen)', 'k4', 'templates', GRN]], B('k5', 0));
    tw('crate', A('k2', 'stop one', 0), 1.0, { x: 1000 }); tw('crate', A('k3', 'stop two', 0), 1.0, { x: 1150 }); tw('crate', A('k4', 'stop three', 0), 1.0, { x: 1300 });
    pg('k5c', [['4  🧪 test the real hatch (Schemathesis, Pact)', 'k5', 'test the real', ORG], ['5  📖 publish the guide, new baseline', 'k6', 'publish', PUR]], B('k7', -0.2));
    tw('crate', A('k5', 'stop four', 0), 1.0, { x: 1420 }); tw('crate', A('k6', 'stop five', 0), 1.0, { x: 1540 });
    rule('k7', 'no change reaches the dock without the line');
    stamp(2, End('k7', -0.3), true, 'done');
  });

  /* 12: in Go */
  blk('l1', 'm1', () => {
    cam(B('l1', -0.3), 1.6, 'lex');
    const L1 = ['// generated from the blueprint', 'type CreateInvoiceRequestObject struct{ Body *CreateInvoiceRequest }', '', 'type CreateInvoiceResponseObject interface {', '    VisitCreateInvoiceResponse(w http.ResponseWriter) error', '}', '', 'type CreateInvoice201JSONResponse Invoice', 'type CreateInvoice400ProblemResponse Problem', '', 'type StrictServerInterface interface {', '    CreateInvoice(ctx RequestContext,', '        req CreateInvoiceRequestObject) (CreateInvoiceResponseObject, error)', '}'];
    const c1 = S.codePanel('c1', L1, { x: 100, y: 120, w: 1360, fs: 27, title: 'server.gen.go', t0: B('l2', 0.0), times: L1.map((x, i) => B('l2', 0.5) + i * 0.55) });
    c1.hl(1, A('l2', 'request', 0)); c1.hl(3, A('l2', 'possible answer', 0)); c1.hl(10, A('l2', 'interface', 0));
    c1.hl(7, A('l3', 'handler', 0)); c1.hl(8, A('l3', 'clear error', 0)); c1.hl(10, A('l3', 'refuses', 0)); c1.out(End('l4', -0.1));
    const L2 = ['func (InvoiceService) CreateInvoice(ctx RequestContext,', '    req CreateInvoiceRequestObject) (CreateInvoiceResponseObject, error) {', '    if req.Body.AmountCents <= 0 {', '        return CreateInvoice400ProblemResponse{Title: "Bad Request",', '            Status: 400, Detail: "amountCents must be positive"}, nil', '    }', '    return CreateInvoice201JSONResponse{', '        Id: newID(), ClientId: req.Body.ClientId,', '        AmountCents: req.Body.AmountCents, Currency: req.Body.Currency, Status: "draft",', '    }, nil', '}'];
    const c2 = S.codePanel('c2', L2, { x: 100, y: 120, w: 1360, fs: 25, title: 'service.go', t0: B('l5', 0.0), times: L2.map((x, i) => B('l5', 0.4) + i * 0.45) });
    c2.hl(2, A('l5', 'positive', -0.3)); c2.hl(3, A('l5', 'error answer', -0.1)); c2.hl(6, A('l5', 'good one', -0.1)); c2.out(End('l5', -0.1));
    const L3 = ['doc, _ := openapi3.NewLoader().LoadFromFile("api/openapi.yaml")', 'router, _ := legacyrouter.NewRouter(doc)', 'route, pathParams, _ := router.FindRoute(r)', 'err := openapi3filter.ValidateRequest(r.Context(), &openapi3filter.RequestValidationInput{', '    Request: r, PathParams: pathParams, Route: route,', '})'];
    const c3 = S.codePanel('c3', L3, { x: 100, y: 160, w: 1360, fs: 24, title: 'validation guard (kin-openapi)', t0: B('l6', 0.0), times: L3.map((x, i) => B('l6', 0.5) + i * 0.7) });
    c3.hl(0, A('l6', 'loads', -0.1)); c3.hl(3, A('l6', 'checks every request', -0.2)); c3.hl(4, A('l6', 'turned away', -0.6)); c3.out(End('l6', -0.1));
    const L4 = ['type Field[T any] struct {', '    Present bool // the key appeared in the body', '    Null    bool // the key appeared with the value null', '    Value   T', '}', '', 'func (f *Field[T]) UnmarshalJSON(b []byte) error {', '    f.Present = true', '    if string(b) == "null" {', '        f.Null = true', '        return nil', '    }', '    return json.Unmarshal(b, &f.Value)', '}'];
    const c4 = S.codePanel('c4', L4, { x: 100, y: 120, w: 1360, fs: 26, title: 'patch.go', t0: B('l7', 0.0), times: L4.map((x, i) => B('l7', 0.4) + i * 0.5) });
    c4.hl(1, A('l7', 'was the key there', -0.2)); c4.hl(2, A('l7', 'empty on purpose', -0.2)); c4.hl(3, A('l7', 'what was the value', -0.2)); c4.hl(12, A('l8', 'a value sets', -0.6)); c4.out(End('l8', -0.1));
    rule('l9', 'let the blueprint write the template, guard the door');
    stamp(3, End('l9', -0.3), true, 'done');
  });

  /* 13: trade-offs */
  blk('m1', 'n1', () => {
    cam(B('m1', -0.3), 1.6, 'tower');
    pg('m2c', [['🐢 drawing first: slower at the start', 'm2', 'drawing first', GOLD], ['🧱 generated code: keep it at the edge', 'm3', 'generated code', CY], ['🚧 strict checks can block a safe roll out', 'm4', 'strict checking', ORG]], B('m5', 0));
    pg('m5c', [['🤝 crew tests: need crews you know', 'm5', 'public station', PUR], ['📖 not in the drawing: speed, order, how often', 'm6', 'cannot capture', RED]], B('m7', -0.2));
    rule('m7', 'a contract is strong, but it has a price');
  });

  /* 14: failures, fixes, monitoring */
  blk('n1', 'o1', () => {
    cam(B('n1', -0.3), 1.6, 'lex');
    cards('n2c', [['1 Drawing and hatch drift apart', 'fix: cut the hatch from the drawing, or redraw and stop on change', 'n2', 'story one', RED], ['2 A rename breaks old ships', 'fix: compare with the last released blueprint, block the break', 'n3', 'story two', RED], ['3 A new status word confuses an old ship', 'fix: say the list may grow, test unknown words', 'n4', 'story three', RED]], B('n5', 0));
    cards('n5c', [['4 No limits: a huge message gets in', 'fix: a limit on every text and list, a size cap at the door', 'n5', 'story four', RED]], B('n7', -0.15));
    cards('n8c', [['WATCH 1 Requests the door turned away', 'by field and by ship version', 'n8', 'one', GRN], ['WATCH 2 Old labels still in use', 'and doors marked as going away', 'n9', 'two', GRN], ['WATCH 3 Test answers that miss the drawing', 'drift, caught early', 'n10', 'three', GRN]], B('n11', -0.2));
    rule('n11', 'watch rejected requests and who uses old labels');
  });

  /* 15: deep dive */
  blk('o1', 'q0', () => {
    cam(B('o1', -0.3), 1.6, 'lex');
    cards('o2c', [['1 Two blueprint versions', "the newer one writes 'empty on purpose' differently", 'o2', 'common versions', CY], ['2 Very big ids', 'a browser drops the last digits: send big ids as text', 'o3', 'very big ids', ORG]], B('o5', 0));
    cards('o5c', [['3 Shape is not the journey', 'right shape, wrong booking: test a whole booking', 'o5', 'checking the shape', GOLD], ['4 The repeat-safe key', 'write who owns it, how long it is kept, what a clash says', 'o6', 'repeat safe key', GRN]], B('o7', -0.15));
    rule('o7', 'what is not written down is what breaks');
  });

  // board gone before the full-width cards
  ['boardBg', 'cb0', 'cb1', 'cb2', 'cb3'].forEach((k) => hide(k, B('q0', -0.6), 0.3));

  /* 16: interview round, one question at a time */
  blk('q0', 's0', () => {
    cam(B('q0', -0.3), 1.6, 'tower');
    const QA = [
      ['What belongs in a contract?', ['who may call, and how', 'each door: what goes in, what comes out', 'one error shape, the limits, repeats, versions', 'if a ship can depend on it, write it down'], 'q1', 'q2', 'q3'],
      ['Is a new field breaking? What about a new status word?', ['a new field: safe for tolerant ships, breaks strict ones', 'a new status word breaks ships that expect a closed list', 'so say from day one that the list is open'], 'q3', 'q4', 'q5'],
      ['Draw first, or build first?', ['draw first when several crews or outside ships are involved', 'build first for a quick piece with one caller', 'either way, redraw and compare by machine'], 'q5', 'q6', 'q7'],
      ['Why send money as whole cents?', ['decimals drift; ten dimes may not add to exactly one', 'whole cents are exact', 'the currency name is needed: small units differ'], 'q7', 'q8', 'q11'],
      ['Must, may and empty: why does it matter?', ['three promises: always there, may be missing, empty on purpose', 'in an update missing keeps, empty clears', 'mixing them up wipes data'], 'q11', 'q12', null],
    ];
    QA.forEach((r, i) => {
      const tEnd = r[4] ? B(r[4], -0.2) : End('q12b', 0.3);
      ui('qq' + i, rect(0, 0, 1500, 100, 'rgba(8,12,24,.94)', { rx: 16, stroke: '#38bdf8', sw: 4 }) + T('Q' + (i + 1) + '  ' + r[0], 32, '#38bdf8', { anchor: 'start', dx: 24, dy: 50 }), 90, 130, {}); pop('qq' + i, B(r[2], 0.15)); hide('qq' + i, tEnd, 0.3);
      const h = 40 + r[1].length * 46;
      ui('qa' + i, rect(0, 0, 1500, h, 'rgba(8,12,24,.94)', { rx: 16, stroke: '#3ddc84', sw: 4 }) + r[1].map((ln, j) => T('• ' + ln, 28, '#fff', { anchor: 'start', dx: 26, dy: 46 + j * 46 })).join(''), 90, 260, {}); pop('qa' + i, B(r[3], 0.15)); hide('qa' + i, tEnd, 0.3);
    });
  });

  /* 17: docked, summary */
  blk('s0', 'rn1', () => {
    cam(B('s0', -0.3), 1.6, 'mid');
    em('nv2', '🚀', 150, 2950, 560); pop('nv2', B('s0', 0.2)); tw('nv2', B('s0', 0.3), 4.5, { x: 2350 }, { ease: 'inOut' });
    ui('sh', T('DOCKED · SUMMARY', 56, GOLD, { w: 1000 }), 960, 80, {}); pop('sh', B('s1a', -0.3)); hide('sh', End('s1g', 1.0), 0.3);
    const SUM = [['1  Write the promise first, make everything from it', 's1a', CY], ['2  Add freely, take away slowly', 's1b', GRN], ['3  Write down every limit', 's1c', ORG], ['4  Must, may and empty are three promises', 's1d', PUR], ['5  Every change rides the safety line', 's1e', RED], ['6  Watch who still uses the old labels', 's1f', GOLD]];
    SUM.forEach((r, i) => { const slot = i % 3; P('sm' + i, r[0], '', 300, 150 + slot * 140, 1300, 110, r[2], r[1], ['one','two','three','four','five','six'][i], 0); });
    // the A and B pages: pop times follow the lines, fades come before the next page
    [0, 1, 2].forEach((i) => hide('sm' + i, B('s1d', -0.15), 0.3)); [3, 4, 5].forEach((i) => hide('sm' + i, B('s1g', -0.15), 0.3));
    ui('keep1', T('A contract is a promise. Keep it.', 84, GOLD, { w: 1700 }), 960, 300, {}); pop('keep1', B('s1g', 0.4)); hide('keep1', End('s1g', 0.8), 0.3);
  });

  /* 18: where to go next */
  blk('rn1', 'z1', () => {
    cam(B('rn1', -0.3), 1.6, 'tower');
    readNext('rn1', [['📘 notes: API Contract Design and OpenAPI + OpenAPI-First in Go', 'open', CY], ['⬅ before: REST and HTTP API Design, Choosing an API Style', 'before', GOLD], ['➡ after: Error Handling, Versioning, Idempotency', 'after', GRN], ['↔ compare: Protocol Buffers, GraphQL', 'compare', PUR]]);
  });
  cam(B('z1', -0.4), 1.4, 'tower'); wave('pip', B('z1', 0.5));
  endTitle('API Contract Design and OpenAPI', 'a contract is a promise. keep it.', 'z2');
})();
