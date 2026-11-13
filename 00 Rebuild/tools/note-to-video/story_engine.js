/* story_engine.js: tiny seek-based SVG animation engine for story videos.
   The page calls seek(t) and the whole picture is computed from time t alone, so any frame can be
   rendered in any order (and in parallel). Authoring helpers are exposed on window.S for scenes.js. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1920, H = 1080;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const EASE = {
    lin: (p) => p,
    out: (p) => 1 - Math.pow(1 - p, 3),
    in: (p) => p * p * p,
    inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  };
  const svg = document.getElementById('stage');
  const mkEl = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a || {}) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; };
  const worldG = mkEl('g', {}, svg);
  const uiG = mkEl('g', {}, svg);
  const ents = {};
  const LINES = window.LINES || {};
  const talkWin = {}; // who -> [[s,e]]
  for (const id in LINES) { const L = LINES[id]; (talkWin[L.who] = talkWin[L.who] || []).push([L.s, L.e]); }
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  // ---- entities ----------------------------------------------------------------------------
  let scope = null; // array collecting ids created inside the current scene
  function mk(id, inner, o) {
    o = o || {};
    if (ents[id]) throw new Error('duplicate id ' + id);
    const g = mkEl('g', {}, o.ui ? uiG : worldG);
    g.innerHTML = inner;
    const e = {
      id, g, tw: [], texts: [], opts: o,
      init: { x: o.x || 0, y: o.y || 0, s: o.s === undefined ? 1 : o.s, o: o.o === undefined ? 1 : o.o, r: o.r || 0, f: o.f || 1, p: o.p === undefined ? 1 : o.p },
    };
    e.cur = Object.assign({}, e.init);
    e.pEl = g.querySelector('[data-p]');
    e.tEl = g.querySelector('[data-t]');
    ents[id] = e;
    if (scope && !o.keep) scope.push(id);
    return id;
  }
  function tw(id, t, d, to, o) {
    const e = ents[id]; if (!e) throw new Error('no entity ' + id);
    o = o || {};
    const from = {}, dst = {};
    for (const k in to) {
      if (Array.isArray(to[k])) { from[k] = to[k][0]; dst[k] = to[k][1]; } else { from[k] = e.cur[k]; dst[k] = to[k]; }
      e.cur[k] = dst[k];
    }
    e.tw.push({ t, d: Math.max(d, 0.001), from, to: dst, ease: EASE[o.ease || 'out'], arc: o.arc || 0, walk: !!o.walk });
    return id;
  }
  const show = (id, t, d, o) => tw(id, t, d === undefined ? 0.4 : d, { o: 1 }, o);
  const hide = (id, t, d) => tw(id, t, d === undefined ? 0.4 : d, { o: 0 });
  const pop = (id, t, d) => { const e = ents[id]; const s = e.init.s; tw(id, t, d || 0.5, { o: [0, 1], s: [s * 0.2, s] }, { ease: 'back' }); };
  const kill = (ids, t, d) => ids.forEach((i) => hide(i, t, d === undefined ? 0.5 : d));
  const tx = (id, t, str) => { ents[id].texts.push([t, str]); };

  // ---- timing helpers ------------------------------------------------------------------------
  const S = {
    L: (l, off) => LINES[l].s + (off || 0),
    End: (l, off) => LINES[l].e + (off || 0),
    // time at which a phrase inside a line is spoken
    W(l, phrase, off) {
      const L = LINES[l]; const toks = norm(phrase).split(' ');
      const ws = [], wt = [];
      L.words.forEach((w) => norm(w[0]).split(' ').filter(Boolean).forEach((tk) => { ws.push(tk); wt.push(w[1]); }));
      for (let i = 0; i + toks.length <= ws.length; i++) {
        let ok = true; for (let j = 0; j < toks.length; j++) if (ws[i + j] !== toks[j]) { ok = false; break; }
        if (ok) return wt[i] + (off || 0);
      }
      console.warn('PHRASE NOT FOUND: ' + l + ' / ' + phrase);
      return L.s + (off || 0);
    },
  };

  // ---- drawing helpers -----------------------------------------------------------------------
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const T = (str, size, fill, o) => { o = o || {}; return '<text data-t x="' + (o.dx || 0) + '" y="' + (o.dy || 0) + '" font-size="' + size + '" fill="' + (fill || '#fff') + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" font-weight="' + (o.w || 700) + '" font-family="' + (o.font || 'Inter, system-ui, -apple-system, sans-serif') + '">' + esc(str) + '</text>'; };
  const E = (e, size, o) => T(e, size, '#fff', Object.assign({ font: 'Apple Color Emoji, Noto Color Emoji, sans-serif' }, o || {}));
  const rect = (x, y, w, h, fill, o) => { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx || 0) + '" fill="' + fill + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 3) + '"' : '') + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; };
  const circ = (x, y, r, fill, o) => { o = o || {}; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 3) + '"' : '') + '/>'; };

  // character: origin at the feet, about 300 tall
  function charInner(c) {
    const bw = c.w || 104;
    const hair = c.hair || '#2b2118';
    let s = '';
    s += '<ellipse cx="0" cy="2" rx="' + (bw * 0.6) + '" ry="10" fill="rgba(0,0,0,.25)"/>';
    s += '<g class="legL" transform="translate(-' + bw * 0.22 + ' -92)"><rect x="-17" y="0" width="34" height="90" rx="12" fill="' + (c.pants || '#33415c') + '"/><rect x="-22" y="82" width="46" height="16" rx="8" fill="#222"/></g>';
    s += '<g class="legR" transform="translate(' + bw * 0.22 + ' -92)"><rect x="-17" y="0" width="34" height="90" rx="12" fill="' + (c.pants || '#33415c') + '"/><rect x="-22" y="82" width="46" height="16" rx="8" fill="#222"/></g>';
    if (c.hair2 === 'long') s += '<rect x="-52" y="-272" width="104" height="150" rx="40" fill="' + hair + '"/>';
    s += '<g class="armL" transform="translate(-' + (bw / 2 + 4) + ' -200)"><rect x="-14" y="0" width="28" height="100" rx="14" fill="' + c.shirt + '"/>' + circ(0, 104, 15, c.skin) + '</g>';
    s += '<rect x="-' + bw / 2 + '" y="-215" width="' + bw + '" height="128" rx="30" fill="' + c.shirt + '"/>';
    if (c.apron) s += '<rect x="-' + bw * 0.36 + '" y="-190" width="' + bw * 0.72 + '" height="100" rx="14" fill="' + c.apron + '"/>';
    if (c.tie) s += '<polygon points="0,-205 -12,-180 0,-120 12,-180" fill="' + c.tie + '"/>';
    s += '<g class="armR" transform="translate(' + (bw / 2 + 4) + ' -200)"><rect x="-14" y="0" width="28" height="100" rx="14" fill="' + c.shirt + '"/>' + circ(0, 104, 15, c.skin) + (c.hold ? '<g transform="translate(4 100)">' + E(c.hold, 44) + '</g>' : '') + '</g>';
    s += '<rect x="-14" y="-262" width="28" height="30" fill="' + c.skin + '"/>';
    s += circ(0, -280, 52, c.skin);
    if (c.hair2 === 'long') s += '<path d="M-54 -280 A54 54 0 0 1 54 -280 L54 -300 A54 54 0 0 0 -54 -300Z" fill="' + hair + '"/><path d="M-54 -285 Q0 -345 54 -285 Q40 -325 0 -330 Q-40 -325 -54 -285Z" fill="' + hair + '"/>';
    else if (c.hair2 !== 'bald' && !c.hat) s += '<path d="M-54 -285 Q0 -345 54 -285 Q40 -330 0 -334 Q-40 -330 -54 -285Z" fill="' + hair + '"/>';
    if (c.hat === 'chef') s += '<rect x="-46" y="-336" width="92" height="40" rx="8" fill="#fff"/>' + circ(-30, -352, 26, '#fff') + circ(0, -366, 32, '#fff') + circ(30, -352, 26, '#fff');
    if (c.hat === 'cap') s += '<path d="M-52 -296 Q0 -352 52 -296Z" fill="' + (c.hatColor || '#2f9e5a') + '"/><rect x="-6" y="-306" width="78" height="12" rx="6" fill="' + (c.hatColor || '#2f9e5a') + '"/>';
    if (c.mask) s += '<rect x="-48" y="-292" width="96" height="28" rx="12" fill="#111"/>';
    s += '<g class="eyes"><circle cx="-18" cy="-282" r="6.5" fill="#1b1b1b"/><circle cx="18" cy="-282" r="6.5" fill="#1b1b1b"/></g>';
    if (c.glasses) s += '<circle cx="-18" cy="-282" r="15" fill="none" stroke="#222" stroke-width="3.5"/><circle cx="18" cy="-282" r="15" fill="none" stroke="#222" stroke-width="3.5"/><line x1="-3" y1="-282" x2="3" y2="-282" stroke="#222" stroke-width="3"/>';
    if (c.blush) s += circ(-32, -266, 8, 'rgba(255,90,90,.35)') + circ(32, -266, 8, 'rgba(255,90,90,.35)');
    s += '<ellipse class="mouth" cx="0" cy="-258" rx="11" ry="2" fill="#7a1f1f"/>';
    if (c.sweat) s += '<g class="sweat">' + E('💧', 34, { dx: 62, dy: -300 }) + '</g>';
    // speaking dots above the head
    s += '<g class="bub" transform="translate(0 -455)"><rect x="-44" y="-24" width="88" height="48" rx="24" fill="#fff"/><polygon points="-8,22 8,22 0,36" fill="#fff"/><circle class="d1" cx="-20" cy="0" r="6" fill="#444"/><circle class="d2" cx="0" cy="0" r="6" fill="#444"/><circle class="d3" cx="20" cy="0" r="6" fill="#444"/></g>';
    return s;
  }
  function mkChar(id, c, x, y, o) {
    o = o || {};
    mk(id, charInner(c), Object.assign({ x, y, keep: o.keep }, o));
    ents[id].kind = 'char';
    ents[id].who = c.who || id;
    ents[id].phase = (id.length * 1.7) % 6;
    ents[id].noBubble = !!o.noBubble;
    return id;
  }

  // ---- main seek ---------------------------------------------------------------------------
  const camEnt = { init: { x: 1650, y: 540, s: 0.5 }, tw: [], cur: { x: 1650, y: 540, s: 0.5 } };
  function camTw(t, d, to, o) {
    const from = {}, dst = {};
    for (const k in to) { from[k] = camEnt.cur[k]; dst[k] = to[k]; camEnt.cur[k] = to[k]; }
    camEnt.tw.push({ t, d: Math.max(d, 0.001), from, to: dst, ease: EASE[(o && o.ease) || 'inOut'] });
  }
  function evalEnt(e, t) {
    const s = Object.assign({}, e.init); let arc = 0, walking = false;
    for (const w of e.tw) {
      if (t < w.t) break;
      const p = clamp((t - w.t) / w.d), k = w.ease(p);
      for (const key in w.to) s[key] = w.from[key] + (w.to[key] - w.from[key]) * k;
      arc = w.arc && p < 1 ? -w.arc * 4 * p * (1 - p) : 0;
      walking = w.walk && p > 0 && p < 1;
    }
    return { s, arc, walking };
  }
  window.seek = function (t) {
    const c = evalEnt(camEnt, t).s;
    worldG.setAttribute('transform', 'translate(' + W / 2 + ' ' + H / 2 + ') scale(' + c.s + ') translate(' + -c.x + ' ' + -c.y + ')');
    for (const id in ents) {
      const e = ents[id]; const { s, arc, walking } = evalEnt(e, t);
      let y = s.y + arc, op = s.o;
      if (e.opts.loop) { const lp = e.opts.loop; const f = (((t - (lp.delay || 0)) / lp.period) % 1 + 1) % 1; y -= lp.dy * f; op *= Math.sin(Math.PI * f); }
      if (e.opts.pulse) { const sc = 1 + e.opts.pulse * Math.sin(t * 6); s.s *= sc; }
      if (e.kind === 'char') {
        const talking = (talkWin[e.who] || []).some((w) => t >= w[0] && t <= w[1]);
        const g = e.g;
        const ph = walking ? Math.sin(t * 11 + e.phase) : 0;
        y += walking ? -Math.abs(ph) * 10 : Math.sin(t * 2 + e.phase) * 3;
        g.querySelector('.legL').setAttribute('transform', 'translate(-' + 23 + ' -92) rotate(' + ph * 24 + ')');
        g.querySelector('.legR').setAttribute('transform', 'translate(' + 23 + ' -92) rotate(' + -ph * 24 + ')');
        const armR = g.querySelector('.armR'), armL = g.querySelector('.armL');
        const raise = e.armRaise ? e.armRaise(t) : 0;
        const ax = parseFloat(armR.getAttribute('data-x') || '0');
        armR.style.transformOrigin = ''; // set via attribute below
        const bw = parseFloat(armR.getAttribute('transform').split('(')[1]);
        armR.setAttribute('transform', 'translate(' + bw + ' -200) rotate(' + (walking ? -ph * 30 : -raise) + ')');
        armL.setAttribute('transform', 'translate(' + -bw + ' -200) rotate(' + (walking ? ph * 30 : (e.armLRaise ? e.armLRaise(t) : 0)) + ')');
        const m = g.querySelector('.mouth');
        m.setAttribute('ry', talking ? (3 + 8 * Math.abs(Math.sin(t * 15 + e.phase))).toFixed(2) : 2);
        const blink = (t + e.phase) % 3.3 < 0.12;
        g.querySelector('.eyes').setAttribute('transform', blink ? 'translate(0 -282) scale(1 .1) translate(0 282)' : '');
        const b = g.querySelector('.bub');
        b.setAttribute('opacity', talking && !e.noBubble ? 1 : 0);
        if (talking) for (let i = 1; i <= 3; i++) b.querySelector('.d' + i).setAttribute('cy', (-5 * Math.max(0, Math.sin(t * 9 - i))).toFixed(1));
        if (talking) s.s *= 1 + 0.015 * Math.sin(t * 9);
      }
      if (e.pEl) { const p = s.p; e.pEl.setAttribute('stroke-dasharray', Math.max(p, 0.0001) + ' 2'); }
      if (e.texts.length && e.tEl) { let cur = null; for (const q of e.texts) if (t >= q[0]) cur = q[1]; if (cur !== null) e.tEl.textContent = cur; }
      e.g.setAttribute('transform', 'translate(' + s.x + ' ' + y + ') rotate(' + s.r + ') scale(' + s.s * s.f + ' ' + s.s + ')');
      e.g.setAttribute('opacity', Math.max(0, Math.min(1, op)));
      e.g.setAttribute('visibility', op <= 0.002 ? 'hidden' : 'visible');
    }
  };

  // ---- cards and portraits (screen space) ---------------------------------------------------
  let cardN = 0;
  function card(t, title, sub, o) {
    o = o || {};
    const id = 'card' + cardN++; const slot = o.slot || 0; const col = o.color || '#ffd166';
    const w = 560, h = sub ? 118 : 84;
    mk(id, rect(0, 0, w, h, 'rgba(14,18,30,.92)', { rx: 18, stroke: col, sw: 4 }) + rect(0, 0, 14, h, col, { rx: 7 }) + T(title, 40, col, { anchor: 'start', dx: 34, dy: sub ? 38 : h / 2 }) + (sub ? T(sub, 25, '#cdd6e6', { anchor: 'start', dx: 34, dy: 84, w: 500 }) : ''), { ui: true, x: W + 40, y: 70 + slot * 140, o: 0, keep: true });
    tw(id, t, 0.5, { x: W - w - 50, o: 1 }, { ease: 'back' });
    tw(id, t + (o.hold || 3.6), 0.45, { x: W + 40, o: 0 }, { ease: 'in' });
  }
  function portraitInner(c) {
    return rect(0, 0, 250, 290, 'rgba(14,18,30,.94)', { rx: 22, stroke: c.ring || '#fff', sw: 5 }) + '<g transform="translate(125 478) scale(1.0)"><g class="pchar">' + charInner(Object.assign({}, c)) + '</g></g>' + T(c.name || '', 30, c.ring || '#fff', { dx: 125, dy: 268 });
  }
  function portrait(id, c, x, y) { // shown while the character talks; clip to the frame
    const clip = id + '_clip';
    mk(id, '<defs><clipPath id="' + clip + '"><rect x="0" y="0" width="250" height="290" rx="22"/></clipPath></defs><g clip-path="url(#' + clip + ')">' + portraitInner(c) + '</g>', { ui: true, x, y, o: 0, keep: true });
    ents[id].kind = 'portrait'; ents[id].who = c.who;
  }

  // portraits glow only while their person talks
  const oldSeek = window.seek;
  window.seek = function (t) {
    oldSeek(t);
    for (const id in ents) {
      const e = ents[id];
      if (e.kind === 'portrait') {
        const talking = (talkWin[e.who] || []).some((w) => t >= w[0] - 0.1 && t <= w[1] + 0.3);
        const s = evalEnt(e, t).s;
        e.g.setAttribute('opacity', Math.min(1, s.o) * (talking ? 1 : 0.0));
        const m = e.g.querySelector('.mouth'); if (m) m.setAttribute('ry', talking ? 3 + 8 * Math.abs(Math.sin(t * 15)) : 2);
      }
    }
  };


  // code panel: lines reveal one by one; highlight bar can jump to a line. returns {hl, out}
  function codePanel(id, lines, o) {
    const fs = o.fs || 27, lh = o.lh || Math.round(fs * 1.5), w = o.w || 1560, h = lines.length * lh + 96;
    const mono = 'ui-monospace, Menlo, monospace';
    mk(id + '_bg', rect(0, 0, w, h, '#0b0f1a', { rx: 18, stroke: '#3a4766', sw: 3 }) + T(o.title || 'Go', 26, '#7ee0ff', { anchor: 'start', dx: 28, dy: 36, font: mono }), { ui: true, x: o.x, y: o.y, o: 0 });
    tw(id + '_bg', o.t0, 0.5, { o: 1 });
    mk(id + '_hl', rect(0, 0, w - 24, lh, 'rgba(255,209,102,.18)', { rx: 8, stroke: 'rgba(255,209,102,.7)', sw: 2 }), { ui: true, x: o.x + 12, y: o.y + 66, o: 0 });
    lines.forEach((ln, i) => {
      const col = ln.trim().startsWith('//') ? '#7f8aa3' : '#e6edf7';
      const t = '<text data-t x="0" y="0" font-size="' + fs + '" fill="' + col + '" font-family="' + mono + '" style="white-space:pre" dominant-baseline="central">' + esc(ln.replace(/\t/g, '    ')) + '</text>';
      mk(id + '_' + i, t, { ui: true, x: o.x + 30, y: o.y + 66 + lh / 2 + i * lh, o: 0 });
      tw(id + '_' + i, o.times[i] === undefined ? o.t0 + 0.4 + i * 0.2 : o.times[i], 0.25, { o: 1 });
    });
    return {
      hl(i, t, n) { const e = ents[id + '_hl']; tw(id + '_hl', t, 0.35, { o: 1, y: o.y + 66 + i * lh }); e.hlH = n; },
      ids: [id + '_bg', id + '_hl'].concat(lines.map((l, i) => id + '_' + i)),
      out(t) { this.ids.forEach((k) => tw(k, t, 0.5, { o: 0 })); },
    };
  }

  // chapter cards: a title card in the gap between scenes, so topic changes are clear
  function chapters() {
    const CH = window.SCENES || [];
    CH.forEach((c, i) => {
      const id = 'chap' + i;
      const size = c.title.length > 44 ? 58 : 76;
      mk(id, rect(0, 0, 1920, 1080, '#0b1020') + rect(760, 610, 400, 6, '#7ee0ff', { rx: 3 }) + T('CHAPTER ' + (i + 1) + ' OF ' + CH.length, 34, '#7ee0ff', { dx: 960, dy: 440 }) + T(c.title, size, '#ffffff', { dx: 960, dy: 530 }), { ui: true, keep: true, o: i === 0 ? 1 : 0 });
      if (i > 0) tw(id, c.from + 0.2, 0.55, { o: 1 });
      tw(id, c.s - 0.4, 0.6, { o: 0 });
    });
  }

  window.S = Object.assign(S, { chapters, codePanel, mk, tw, show, hide, pop, kill, tx, mkChar, card, portrait, camTw, ents, T, E, rect, circ, SW: W, SH: H, EASE,
    scope: (arr) => { scope = arr; }, setCharArm: (id, fn, left) => { ents[id][left ? 'armLRaise' : 'armRaise'] = fn; } });
})();
