export const meta = {
  name: 'vault-split-rollout',
  description: 'Split every topic into an easier, deeper theory note plus a teaching Go note; independent review against git original',
  phases: [{ title: 'Rewrite', detail: '3 notes per writer' }, { title: 'Review', detail: 'content-preservation + accuracy check' }],
}
const V = '/Users/priyanshumidha/Documents/OBZEDIAN'
const SP = '/private/tmp/claude-502/-Users-priyanshumidha-Documents-OBZEDIAN/00fc1435-48e1-42f0-9888-340e4e0fbca2/scratchpad'
const N = 120
const LINT = `python3 -I "${V}/00 Rebuild/tools/lint_notes.py"`
const MMD = `PATH=/opt/homebrew/bin:$PATH node ${SP}/tools/mermaid/validate.mjs`
const GETLIST = i => `python3 -c "import json;print('\\n'.join(json.load(open('${SP}/rollout_batches.json'))[${i}]))"`
const HINTS = `${SP}/hints.json`
const W = { type: 'object', properties: { notes: { type: 'array', items: { type: 'object', properties: {
  path: { type: 'string' }, split: { type: 'boolean' }, theory_diagrams: { type: 'integer' }, go_code_pct: { type: 'integer' },
  tests: { type: 'string' }, lint_ok: { type: 'boolean' }, mermaid_ok: { type: 'boolean' } }, required: ['path', 'split', 'lint_ok', 'mermaid_ok'] } } }, required: ['notes'] }
const R = { type: 'object', properties: { notes: { type: 'array', items: { type: 'object', properties: {
  path: { type: 'string' }, verdict: { type: 'string', enum: ['clean', 'fixed'] }, lost_content_restored: { type: 'array', items: { type: 'string' } },
  fixes: { type: 'array', items: { type: 'string' } }, lint_ok: { type: 'boolean' }, mermaid_ok: { type: 'boolean' } }, required: ['path', 'verdict', 'fixes', 'lint_ok', 'mermaid_ok'] } } }, required: ['notes'] }

const writer = i => `Your task (from the vault owner): make every topic easier and more detailed, with more theory and diagrams, by splitting theory from code. Vault: ${V}.
1. Get your 3 notes (vault-relative paths): \`${GETLIST(i)}\`
2. Read \`${V}/00 Rebuild/Split Brief.md\` fully and follow ALL of it: the split rules, the "Ease rules for theory notes", the "Teaching rules for Go notes", and the Rules section.
3. Per-note rater hints (biggest improvement, wrong level tag, confident factual errors) are in \`${HINTS}\` keyed by vault-relative path; apply them — fix every listed factual error, fix the level tag if flagged, and do the improvement.
4. For each note: if it has 30+ lines of Go, create "<Title> - Go.md" next to it (type: implementation) with all Go code, taught per the rules; the theory note keeps ≥5 topic-specific diagrams and no long code. If it has less Go, keep one note but apply the ease rules and raise it to ≥5 diagrams where the topic allows. Never lose any fact, code, test, SQL or interview question. Notes in a subfolder keep their Go note in the same subfolder.
5. Verify: Go code in a scratch module under ${SP}/work/roll-${i}/ (never in the vault): go vet + go test -race pass (live-DB code compile only, keep labels). Lint every touched note: ${LINT} "<note>" — no ✗. Mermaid: ${MMD} "<note>" — all OK.
6. Theory note status: reviewed; Go note status: draft. Also update the folder MOC learning-path line for each split note by appending " · Go code: [[<Title> - Go]]" (only that edit to the MOC).
Return the structured report.`

const reviewer = (i, w) => `Independent review of a just-finished rewrite in the Obsidian vault ${V}. Do not trust the writer's report.
Notes: \`${GETLIST(i)}\` (plus any "<Title> - Go.md" companions created next to them).
For each note:
1. Content preservation: get the original with \`git -C "${V}" show "HEAD:<vault-relative path>"\`. Compare against the new theory note + Go note. Every fact, number, code block, test, SQL statement, interview question and source from the original must still exist somewhere. Restore anything missing (put code in the Go note, theory in the theory note).
2. Accuracy: check new explanations, analogies and diagrams for technical errors; fix them. Confirm factual errors listed for this note in ${HINTS} were really fixed.
3. Ease: confirm theory note follows the Ease rules in \`${V}/00 Rebuild/Split Brief.md\` (plain words first, one idea per subsection, diagrams, short paragraphs) and the Go note is ≥50% explanation; improve where weak.
4. Code: rebuild Go code in ${SP}/work/rev-${i}/, go vet + go test -race must pass.
5. ${LINT} "<note>" no ✗; ${MMD} "<note>" all OK. Set Go note status: reviewed when done.
Writer said: ${JSON.stringify(w || {}).slice(0, 1500)}
Return the structured report.`

const res = await pipeline(
  Array.from({ length: N }, (_, i) => i),
  i => agent(writer(i), { label: `rewrite ${i + 1}`, phase: 'Rewrite', schema: W, model: 'claude-sonnet-5' }),
  (w, i) => agent(reviewer(i, w), { label: `review ${i + 1}`, phase: 'Review', schema: R, model: 'claude-sonnet-5' }).then(r => ({ i, w, r })),
)
const ok = res.filter(Boolean)
log(`${ok.length}/${N} batches completed`)
return ok.map(x => ({ i: x.i, w: x.w && x.w.notes, r: x.r && x.r.notes }))