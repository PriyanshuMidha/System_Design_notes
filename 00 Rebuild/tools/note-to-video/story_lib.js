/* story_lib.js: helpers shared by every story video. Loaded after story_engine.js, before scenes.js.
   scenes.js does:  const { ... } = H;   and only has to describe the cast, the places and the scenes. */
(function () {
  const { mk, tw, hide, pop, kill, tx, mkChar, card, portrait, camTw, T, rect, circ } = S;
  const A = S.W, B = S.L, End = S.End, Em = S.E;
  const GY = 800;
  const mono = 'ui-monospace, Menlo, monospace';

  // ---- primitives ----------------------------------------------------------------------------------
  const ui = (id, inner, x, y, o) => mk(id, inner, Object.assign({ ui: true, x, y, o: 0 }, o || {}));
  const wd = (id, inner, x, y, o) => mk(id, inner, Object.assign({ x, y, o: 0 }, o || {}));
  const em = (id, e, size, x, y, o) => wd(id, Em(e, size), x, y, o);
  const uem = (id, e, size, x, y, o) => ui(id, Em(e, size), x, y, o);
  function chip(id, text, x, y, col, t, o) {
    const w = (o && o.w) || Math.max(170, text.length * 20 + 56);
    ui(id, rect(-w / 2, -28, w, 56, 'rgba(14,18,30,.93)', { rx: 28, stroke: col, sw: 3 }) + T(text, 26, col), x, y, o);
    pop(id, t); return id;
  }
  function line(id, x1, y1, x2, y2, col, w, o) { // a line in the world that can be drawn on (progress p)
    o = o || {};
    return wd(id, '<path data-p pathLength="1" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + col + '" stroke-width="' + (w || 8) + '" stroke-linecap="round" fill="none"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>', 0, 0, Object.assign({ p: 0 }, o));
  }
  function draw(id, t, d) { tw(id, t, 0.001, { o: 1 }); tw(id, t, d, { p: [0, 1] }, { ease: 'inOut' }); }
  function fly(id, t, pts, total, o) { // move along waypoints, time split by distance
    o = o || {};
    const L = []; let sum = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); sum += l; }
    tw(id, t, 0.001, { o: 1, x: pts[0][0], y: pts[0][1] });
    let tt = t;
    for (let i = 1; i < pts.length; i++) { const d = total * L[i - 1] / sum; tw(id, tt, d, { x: pts[i][0], y: pts[i][1] }, { ease: o.ease || 'inOut', arc: o.arc || 0 }); tt += d; }
    return tt;
  }
  const dim = (id, t0, t1) => { ui(id, rect(0, 0, 1920, 1080, 'rgba(8,12,24,.9)'), 0, 0); tw(id, t0, 0.5, { o: 1 }); tw(id, t1, 0.5, { o: 0 }); };
  function bubble(id, text, col, x, y, o) { const w = Math.max(120, text.length * 17 + 40); return wd(id, rect(-w / 2, -28, w, 56, 'rgba(14,18,30,.95)', { rx: 28, stroke: col, sw: 4 }) + T(text, 28, col), x, y, o); }
  // a message bubble that flies from one spot to another in the world and disappears
  function ask(id, text, col, x1, y1, x2, y2, t, d) { bubble(id, text, col, x1, y1); fly(id, t, [[x1, y1], [x2, y2]], d || 1.0, { arc: 40 }); hide(id, t + (d || 1.0), 0.25); }
  const rowBox = (id, title, sub, x, y, w, h, col, t) => { ui(id, rect(0, 0, w, h, 'rgba(14,18,30,.94)', { rx: 16, stroke: col, sw: 4 }) + T(title, 34, col, { anchor: 'start', dx: 24, dy: sub ? h * 0.32 : h / 2 }) + (sub ? T(sub, 24, '#cdd6e6', { anchor: 'start', dx: 24, dy: h * 0.72 }) : ''), x, y); pop(id, t); return id; };
  const wl = (id, text, col, x, y, t, size) => { wd(id, T(text, size || 40, col, { w: 700 }), x, y); pop(id, t); };

  // ---- phrase-timed shortcuts ------------------------------------------------------------------------
  const C = (id, text, x, y, col, l, ph, w, off) => { const ww = Math.max(w || 200, text.length * 14.5 + 60); const xx = Math.min(Math.max(x, ww / 2 + 20), 1900 - ww / 2); return chip(id, text, xx, y, col, A(l, ph, off === undefined ? -0.15 : off), { w: ww }); };
  const P = (id, title, sub, x, y, w, h, col, l, ph, off) => rowBox(id, title, sub, x, y, w, h, col, A(l, ph, off === undefined ? -0.2 : off));
  let sc;
  // one block of the story: everything created inside is hidden again just before line `lEnd` starts
  const blk = (l0, lEnd, fn) => { sc = []; S.scope(sc); fn(); S.scope(null); kill(sc, B(lEnd, -0.3), 0.5); };
  // blk with a dimmed backdrop (use sparingly: a real story stays in the world)
  const blkDim = (l0, lEnd, fn) => blk(l0, lEnd, () => { dim('dm' + l0, B(l0, -0.3), B(lEnd, -0.3)); fn(); });
  const pulse = (id, t) => { const b = S.ents[id].init.s; tw(id, t, 0.01, { s: b }); tw(id, t + 0.01, 0.3, { s: b * 1.1 }, { ease: 'back' }); tw(id, t + 0.7, 0.3, { s: b }); };
  const walk = (id, t, d, x, y) => { const e = S.ents[id]; tw(id, t, 0.001, { f: x < e.cur.x ? -1 : 1 }); tw(id, t, d, y === undefined ? { x } : { x, y }, { ease: 'inOut', walk: true }); };
  const ring = (id, x, y, r, col, label, t, d) => { ui(id, '<g transform="rotate(-90)"><circle r="' + r + '" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="18"/><circle data-p pathLength="1" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="18" stroke-linecap="round"/></g>' + T(label, 26, '#fff'), x, y, { p: 1 }); pop(id, t); tw(id, t + 0.6, d, { p: 0 }, { ease: 'lin' }); };

  // an "evidence card": a small monospace card beside the characters; its lines appear one by one at `times`
  const ev = (id, title, lines, x, y, w, col, times, tEnd) => {
    const maxLen = Math.max.apply(null, lines.map((l) => l.length));
    w = Math.min(Math.max(w, 700), 1400); x = Math.max(30, Math.min(x, 1500 - w));
    const fs = Math.max(17, Math.min(26, Math.floor((w - 56) / (maxLen * 0.62))));
    const h = 70 + lines.length * 42;
    ui(id, rect(0, 0, w, h, 'rgba(8,12,24,.94)', { rx: 16, stroke: col, sw: 4 }) + T(title, 26, col, { anchor: 'start', dx: 24, dy: 34 }), x, y, {}); pop(id, times[0] - 0.4);
    lines.forEach((ln, i) => { ui(id + '_' + i, T(ln, fs, i === lines.length - 1 && /✗|✓/.test(ln) ? col : '#e6edf7', { anchor: 'start', font: mono }), x + 24, y + 62 + i * 42, {}); pop(id + '_' + i, times[i]); });
    [id].concat(lines.map((l, i) => id + '_' + i)).forEach((k) => hide(k, tEnd, 0.4));
  };

  // ---- the world --------------------------------------------------------------------------------------
  const keep = { keep: true };
  // sky, stars, skyline and a road. width = how far the street runs.
  function world(width, o) {
    o = o || {};
    const top = o.sky || '#0a1230', mid = o.skyMid || '#2c3a75', low = o.skyLow || '#c9805a';
    mk('sky', '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset=".62" stop-color="' + mid + '"/><stop offset="1" stop-color="' + low + '"/></linearGradient></defs>' + rect(-1600, -1600, width + 3200, 2450, 'url(#sg)'), keep);
    mk('stars', Array.from({ length: Math.floor(width / 60) }, (_, i) => circ((i * 197) % (width + 1500) - 700, ((i * 89) % 330) - 250, 2 + (i % 3), 'rgba(255,255,255,.75)')).join(''), keep);
    mk('skyline', Array.from({ length: Math.floor(width / 80) + 12 }, (_, i) => { const h = 90 + ((i * 73) % 200); return rect(-200 + i * 80, 810 - h, 70, h, i % 2 ? '#1b2650' : '#222f63'); }).join(''), keep);
    mk('ground', rect(-1600, 790, width + 3200, 2000, o.ground || '#26332b') + rect(-1600, 830, width + 3200, 70, '#363948') + Array.from({ length: Math.floor(width / 100) + 30 }, (_, i) => rect(-1500 + i * 100, 862, 50, 6, '#c9c9d6')).join(''), keep);
  }
  // a building with a sign and a big icon. scale < 1 makes a small house.
  const bld = (id, x, col, sign, icon, sc2) => mk(id, rect(-210, -360, 420, 360, col, { rx: 12 }) + '<polygon points="-230,-360 0,-470 230,-360" fill="rgba(0,0,0,.35)"/>' + rect(-45, -190, 90, 190, 'rgba(0,0,0,.35)', { rx: 8 }) + rect(-190, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + rect(100, -250, 90, 90, 'rgba(255,240,200,.85)', { rx: 8 }) + '<g transform="translate(0 -260)">' + Em(icon, 90) + '</g>' + T(sign, 28, '#fff', { dy: -315 }), Object.assign({ x, y: GY, s: sc2 || 1 }, keep));
  // characters: cfg = { key: {who,skin,shirt,...,name,ring} }, spots = { key: [x, scale?, hidden?] }. adds name tags and talking portraits.
  function cast(cfg, spots) {
    Object.keys(spots).forEach((k) => {
      const sp = spots[k]; const c = cfg[k];
      mkChar(k, c, sp[0], 830, Object.assign({ s: sp[1] || 1, keep: 1 }, sp[2] ? { o: 0 } : {}));
      if (c.name) mk('nm_' + k, T(c.name, 36, c.ring || '#fff'), Object.assign({ x: sp[0], y: 885 }, keep, sp[2] ? { o: 0 } : {}));
    });
    Object.keys(cfg).forEach((k) => { if (!cfg[k].name) return; portrait('pt_' + k, Object.assign({}, cfg[k]), 40, 780); tw('pt_' + k, 0, 0.01, { o: 1 }); });
  }
  // camera presets
  let VIEWS = {};
  const views = (v) => { VIEWS = v; };
  const cam = (t, d, v) => camTw(t, d, typeof v === 'string' ? VIEWS[v] : v);

  // a case board / progress prop: items [[emoji, label], ...]. returns stamp(i, t, ok, okText, badText)
  function board(title, items, x, y, tShow) {
    ui('boardBg', rect(0, 0, 400, 80 + items.length * 58, 'rgba(8,12,24,.9)', { rx: 18, stroke: '#38bdf8', sw: 4 }) + T(title, 26, '#38bdf8', { dx: 200, dy: 32 }), x, y, {}); pop('boardBg', tShow - 0.5);
    items.forEach((s, i) => { ui('cb' + i, T(s[0] + ' ' + s[1] + '  ❓', 34, '#e6edf7', { anchor: 'start' }), x + 30, y + 70 + i * 58, {}); pop('cb' + i, tShow + i * 0.3); });
    return (i, t, ok, okT, badT) => tx('cb' + i, t, items[i][0] + ' ' + items[i][1] + (ok ? '  ✅ ' + (okT || 'cleared') : '  🚨 ' + (badT || 'lead')));
  }

  // ---- the standard closing chapters -------------------------------------------------------------------
  // interview round: rows = [[question, answer, line, phrase], ...] (a rookie asks, the hero answers)
  function qa(rows, tint) {
    rows.forEach((q, i) => { const y = 70 + i * Math.min(150, 940 / rows.length); ui('qa' + i, rect(0, 0, 1700, 126, 'rgba(8,12,24,.94)', { rx: 16, stroke: tint || '#38bdf8', sw: 4 }) + T('Q' + (i + 1) + '  ' + q[0], 28, tint || '#38bdf8', { anchor: 'start', dx: 24, dy: 36 }) + T(q[1], 22, '#fff', { anchor: 'start', dx: 24, dy: 88 }), 110, y, {}); pop('qa' + i, A(q[2], q[3], -0.3)); });
  }
  // summary: rows = [[text, line, colour], ...]  (rows pop when their line starts)
  function summary(title, rows) {
    ui('sh', T(title, 60, '#ffd166', { w: 1000 }), 960, 90, {}); pop('sh', B(rows[0][1], -0.2));
    rows.forEach((r, i) => { ui('sm' + i, rect(0, 0, 1700, 108, 'rgba(8,12,24,.94)', { rx: 18, stroke: r[2], sw: 4 }) + circ(52, 54, 32, r[2]) + T(String(i + 1), 38, '#111', { dx: 52, dy: 54 }) + T(r[0], 24, '#fff', { anchor: 'start', dx: 108, dy: 54 }), 110, 170 + i * 120, {}); pop('sm' + i, B(r[1], 0.1)); });
  }
  // "where to go next" card: items [[text, phrase, colour], ...] all spoken in `line`
  function readNext(line, items) { items.forEach((r, i) => C('rn' + i, r[0], 960, 330 + i * 80, r[2], line, r[1], 1300, 0)); }
  // end title on the last line
  function endTitle(title, sub, line) {
    ui('endT', T(title, title.length > 24 ? 100 : 130, '#fff', { w: 1700 }), 960, 440, {}); ui('endS', T(sub, 48, '#cdd6e6', { w: 1200 }), 960, 570, {});
    pop('endT', B(line, 1.2)); pop('endS', B(line, 1.8));
  }
  // the hero waves goodbye
  const wave = (id, t) => { tw(id, t, 0.3, { r: -5 }); tw(id, t + 0.4, 0.3, { r: 5 }); tw(id, t + 0.8, 0.3, { r: 0 }); };

  window.H = { mk, tw, hide, pop, kill, tx, mkChar, card, portrait, camTw, T, rect, circ, A, B, End, Em, GY, mono, ui, wd, em, uem, chip, line, draw, fly, dim, bubble, ask, rowBox, wl, C, P, blk, blkDim, pulse, walk, ring, ev, world, bld, cast, views, cam, board, qa, summary, readNext, endTitle, wave, keep };
})();
