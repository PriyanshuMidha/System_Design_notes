/* <Topic>: scene animation. Written against story_engine.js + story_lib.js. Times come from the voice:
   A('l3', 'phrase')  = when that phrase is spoken   B('l3') = line start   End('l3') = line end   */
(function () {
  const { A, B, End, GY, ui, wd, em, chip, ask, bubble, ev, C, P, blk, walk, pulse, cam, views, wl, world, bld, cast, board, qa, summary, readNext, endTitle, wave, card, camTw } = H;

  // 1. the places (x positions along one street) and the cast (cfg per character, spots = [x, scale?, hidden?])
  world(3000);
  bld('bHQ', 300, '#1e3a5f', 'HERO · HQ', '🕵️'); bld('bW1', 1000, '#92400e', 'WITNESS 1', '📖');
  const CFG = {
    hero: { who: 'HERO', skin: '#c98d5b', shirt: '#334155', pants: '#1e293b', hat: 'cap', hatColor: '#0f172a', hair2: 'long', hold: '🔍', w: 96, name: 'Hero', ring: '#38bdf8' },
    rookie: { who: 'ROOKIE', skin: '#d9a37a', shirt: '#22c55e', pants: '#2a2f3a', hair: '#2b2118', hold: '📓', w: 92, name: 'Rookie', ring: '#4ade80' },
    wit1: { who: 'WIT1', skin: '#e3b08a', shirt: '#92400e', pants: '#333', glasses: 1, hair: '#8a8a8a', hold: '📖', w: 108, name: 'Wit1', ring: '#fbbf24' },
  };
  cast(CFG, { hero: [380], rookie: [270], wit1: [1020] });   // speaker keys in script.txt are the upper-case `who` values
  views({ hq: { x: 520, y: 520, s: 0.9 }, w1: { x: 1000, y: 520, s: 0.95 } });
  camTw(0, 0.001, { x: 520, y: 520, s: 0.9 });
  const stamp = board('CASE BOARD', [['📖', 'Suspect 1'], ['🚪', 'Suspect 2']], 1560, 30, B('l4', 0));

  // 2. one blk per scene: blk(firstLine, nextSceneFirstLine, () => { ... }). Everything created inside fades out before the next scene.
  blk('l1', 'l4', () => {
    wl('alarm', '🚨 the crisis, in a few words', '#ff7b7b', 420, 330, A('l1', 'crisis', 0), 44);
    walk('rookie', B('l2', 0.5), 1.8, 520);
    C('w1', 'basic word one: plain meaning', 1300, 330, '#7ee0ff', 'l3', 'basic', 700, 0);
  });
  blk('l4', 'd1', () => {
    cam(B('l4', -0.3), 2.4, 'w1'); walk('hero', B('l4', 0.3), 3.0, 900);
    ev('e1', 'the tool / output / diagram', ['line one', 'line two', 'result ✓'], 700, 90, 900, '#fbbf24', [A('l4', 'model', 0), A('l4', 'concept', 0), A('l4', 'events', 0)], End('l4', 0.4));
    stamp(0, End('l4', 0), true);
  });
  blk('d1', 'g1', () => { P('dd1', 'deep-dive point', 'one sentence', 140, 150, 1640, 150, '#ffd166', 'd1', 'note'); });
  blk('g1', 't1', () => {
    const LN = ['func Example() {', '\t// the real code from the Go note', '}'];
    const cp = S.codePanel('code', LN, { x: 180, y: 160, w: 1560, fs: 30, title: 'file.go', t0: B('g1', 0.3), times: LN.map((x, i) => A('g1', 'code', 0.2) + i * 0.4) });
    cp.hl(1, A('g1', 'step', 0)); cp.out(End('g1', 0.2));
  });
  blk('t1', 'q0', () => { P('fm1', 'a failure mode', 'and its fix', 140, 150, 1640, 110, '#ff7b7b', 't1', 'failure'); });
  blk('q0', 's0', () => { qa([['First question?', 'the answer, one line', 'q1', 'first']]); });
  blk('s0', 'rn1', () => { summary('CASE CLOSED · SUMMARY', [['Point one', 's1a', '#38bdf8'], ['The one line to keep', 's1g', '#3ddc84']]); });
  blk('rn1', 'e1', () => { readNext('rn1', [['📘 notes: <Note title>  +  its Go note', 'open', '#7ee0ff'], ['⬅ before: …', 'before', '#ffd166'], ['➡ after: …', 'after', '#3ddc84'], ['↔ compare: …', 'compare', '#c084fc']]); });
  cam(B('e1', -0.4), 1.4, 'hq'); wave('rookie', B('e1', 0.5));
  endTitle('<Topic>', 'the one line to remember', 'e2');
})();
