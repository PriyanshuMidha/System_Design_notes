// Usage: node validate.mjs <file.md> [...]  -> validates every ```mermaid block with mermaid.parse
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window; globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser; globalThis.Element = dom.window.Element;
try { globalThis.navigator = dom.window.navigator; } catch {}
const mermaid = (await import('mermaid')).default;
mermaid.initialize({ startOnLoad: false });
let bad = 0, total = 0;
for (const f of process.argv.slice(2)) {
  const text = fs.readFileSync(f, 'utf8');
  const re = /```mermaid\n([\s\S]*?)```/g; let m, i = 0;
  while ((m = re.exec(text))) {
    i++; total++;
    const line = text.slice(0, m.index).split('\n').length;
    try { await mermaid.parse(m[1]); }
    catch (e) { bad++; console.log(`FAIL ${f}:${line} block#${i}: ${String(e.message || e).split('\n').slice(0, 3).join(' | ')}`); }
  }
}
console.log(`mermaid: ${total - bad}/${total} blocks OK`);
process.exit(bad ? 1 : 0);
