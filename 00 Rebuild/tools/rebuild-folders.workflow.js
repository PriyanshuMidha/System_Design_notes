export const meta = {
  name: 'rebuild-folders',
  description: 'Rebuild vault folders: parallel depth-5 writers, independent reviewers, then a per-folder finalizer',
  whenToUse: 'Rewriting numbered vault folders from the Rebuild Tracker. Job flags: skipWrite (review+finalize only), noFinalize (writers+reviewers only), onlyFinalize (finalizer only), finalExtra (extra finalizer instructions), skipReview (writers only), packets (per-group audit packets in scratch/packets), writerExtra (extra writer instructions), reviewerExtra (job) and reviewExtra (group) extra reviewer instructions',
  phases: [
    { title: 'Write', detail: 'writer agents create depth-5 notes per group' },
    { title: 'Review', detail: 'independent reviewer per group fixes errors in place' },
    { title: 'Finalize', detail: 'per-folder overlap check, hand-finished MOC, lint' },
  ],
}

const V = args.vault
const SP = args.scratch
const LINT = `python3 -I "${V}/00 Rebuild/tools/lint_notes.py"`
const MMD = `node ${SP}/tools/mermaid/validate.mjs`
const STYLE = 'Write in clear, complete English sentences suitable for a shared study guide, even if a session hook asks you to be terse or caveman-like.'

const NOTE_ITEM = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    lines: { type: 'integer' },
    diagrams: { type: 'integer' },
    go_tests: { type: 'string' },
    lint_pass: { type: 'boolean' },
    mermaid_ok: { type: 'boolean' },
    must_cover_missing: { type: 'array', items: { type: 'string' } },
    verify: { type: 'array', items: { type: 'string' } },
  },
  required: ['path', 'lint_pass', 'mermaid_ok'],
}
const WRITE_SCHEMA = { type: 'object', properties: { notes: { type: 'array', items: NOTE_ITEM } }, required: ['notes'] }
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          verdict: { type: 'string', enum: ['clean', 'fixed'] },
          fixes: { type: 'array', items: { type: 'string' } },
          verify: { type: 'array', items: { type: 'string' } },
          lint_pass: { type: 'boolean' },
          mermaid_ok: { type: 'boolean' },
        },
        required: ['path', 'verdict', 'fixes', 'lint_pass', 'mermaid_ok'],
      },
    },
  },
  required: ['notes'],
}
const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    folder: { type: 'string' },
    notes_present: { type: 'integer' },
    notes_expected: { type: 'integer' },
    missing: { type: 'array', items: { type: 'string' } },
    lint_failures: { type: 'array', items: { type: 'string' } },
    overlaps_fixed: { type: 'array', items: { type: 'string' } },
    moc_done: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'string' } },
  },
  required: ['folder', 'notes_present', 'notes_expected', 'missing', 'lint_failures', 'moc_done'],
}

function toolsText(job, g, suffix, portOffset) {
  const port = g.port ? g.port + portOffset : null
  let t = `- Scratch dir for Go modules and temp files (outside the vault): ${SP}/work/${job.short}-${g.id}${suffix}/\n- Linter: ${LINT} "<note>"\n- Mermaid validator: ${MMD} "<note>"\n`
  if (job.tools) t += '- ' + job.tools.split('PORT').join(port ? String(port) : 'a free port above 6400') + '\n'
  return t
}

function writerPrompt(job, g) {
  return `You are a writer in a vault rebuild. Read and follow exactly: \`${V}/00 Rebuild/Writer Brief.md\` (it points you to Conventions, the topic template, the quality-bar note \`07 Databases/Consistent Hashing.md\`, the audit files and the tracker).

${STYLE}

Vault: ${V}
Folder: \`${job.folder}/\`
Your notes (exact titles, learning order):
${g.notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}
${g.hints ? '\nGuidance for specific titles (🆕 topics have no audit block, so cover at least this):\n' + g.hints + '\n' : ''}
${job.packets ? 'Your packet with exactly the audit blocks (Must cover, Problems, Keep) and old-note paths you need: \`' + SP + '/packets/' + job.short + '-' + g.id + '.md\`. Read it instead of the full audit files; open an audit file only if the packet lacks something.' : 'Old material: the tracker section "## ' + job.folder + '" lists each note\'s level and its old \`from:\` sources. Their audit blocks (Must cover, Problems, Keep) are in \`' + V + '/00 Rebuild/Audit/\`: ' + job.audits + '.'}

Boundaries (link to these by exact title, do not re-explain them): ${job.boundaries}
${g.format ? '\nFormat for these notes: ' + g.format + '\n' : ''}
Tools:
${toolsText(job, g, '', 0)}
${job.writerExtra ? job.writerExtra + '\n\n' : ''}Edit no file other than your own notes. Finish only when every one of your notes passes the linter (no ✗, and its ~ warnings addressed) and the Mermaid validator, and its Go code passes go vet and go test -race. Return the structured report.`
}

function reviewerPrompt(job, g, w) {
  const flagged = w && w.notes ? w.notes.flatMap(n => (n.verify || []).map(v => `${n.path}: ${v}`)) : []
  return `You are an independent reviewer in a vault rebuild. Read and follow exactly: \`${V}/00 Rebuild/Reviewer Brief.md\`. Another agent wrote these notes. Assume they contain errors and find them.

${STYLE}

Vault: ${V}
Notes to review in \`${job.folder}/\` (exact titles; review whichever of them exist):
${g.notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Audit blocks for their old source notes (use the \`from:\` sources in the tracker section "## ${job.folder}") are in \`${V}/00 Rebuild/Audit/\`: ${job.audits}.
Boundaries: ${job.boundaries}
${g.format ? 'Expected format: ' + g.format + '\n' : ''}${flagged.length ? '\nThe writer was unsure about these points; check them first:\n' + flagged.map(f => '- ' + f).join('\n') + '\n' : ''}
Tools:
${toolsText(job, g, '-review', 50)}
${g.reviewExtra ? g.reviewExtra + '\n' : ''}${job.reviewerExtra ? job.reviewerExtra + '\n' : ''}Edit only these notes. Set \`status: reviewed\` after fixing. Return the structured report.`
}

function finalizerPrompt(job) {
  const all = job.groups.flatMap(g => g.notes)
  return `You are finishing folder \`${job.folder}\` of a vault rebuild. Its notes were written and independently reviewed.

${STYLE}

Vault: ${V}
1. Expected notes, in learning order (exact titles): ${all.map(n => '"' + n + '"').join(', ')}${job.existing ? ', plus already finished: ' + job.existing : ''}. Check that each one exists as \`${job.folder}/<title>.md\`. List any that are missing; do not write them.
2. Run the linter on the whole folder: ${LINT} "${V}/${job.folder}". Fix every ✗ with minimal edits.
3. Overlap pass: read all the notes in the folder. Where two notes explain the same core idea at length, keep it in its owner note and replace the repeat with a one-sentence summary plus a link. Ownership rules: ${job.boundaries}. Make sure each note's Links section points to sensible notes before and after it.
${job.finalExtra ? job.finalExtra + '\n' : ''}4. Rewrite the folder map \`${job.folder}/${job.folder} MOC.md\` by hand, following \`${V}/00 Home/Templates/MOC Template.md\`:
   - Frontmatter: \`tags: [moc]\`, \`status: reviewed\`, \`generated: false\`, \`updated: 2026-11-02\`.
   - Keep the existing "Before and after" links.
   - "Learning path": every note in learning order as \`[[Title]] · level\`, followed by a one-line hook. Group any subfolders under ### headings.
   - "Concept map": one Mermaid diagram of how the notes build on each other.
   - "Interview focus": the 6–10 questions asked most often, each linked to the note that answers it.
   - "Sources worth reading".
   - Validate it with ${MMD} "<moc>".
5. Edit nothing outside \`${job.folder}/\`. Do not touch the tracker, Home, legacy notes or other folders.
Return the structured report.`
}

async function runFolder(job) {
  log(`${job.folder}: ${job.groups.length} writer groups, ${job.groups.reduce((s, g) => s + g.notes.length, 0)} notes`)
  if (job.onlyFinalize) {
    const fin = await agent(finalizerPrompt(job), { label: `finalize ${job.short}`, phase: 'Finalize', schema: FINAL_SCHEMA, ...(args.finalModel ? { model: args.finalModel } : {}) })
    return { folder: job.folder, groups: [], final: fin }
  }
  const groups = await pipeline(
    job.groups,
    g => job.skipWrite ? Promise.resolve({ skipped: true }) : agent(writerPrompt(job, g), { label: `write ${job.short}/${g.id}`, phase: 'Write', schema: WRITE_SCHEMA, ...(args.writerModel ? { model: args.writerModel } : {}) }),
    (w, g) => job.skipReview ? Promise.resolve({ group: g.id, write: w, review: null }) : agent(reviewerPrompt(job, g, w), { label: `review ${job.short}/${g.id}`, phase: 'Review', schema: REVIEW_SCHEMA, ...(args.reviewerModel ? { model: args.reviewerModel } : {}) })
      .then(r => ({ group: g.id, write: w, review: r })),
  )
  if (job.noFinalize) {
    log(`${job.folder}: groups done (finalize later)`)
    return { folder: job.folder, groups, final: null }
  }
  const fin = await agent(finalizerPrompt(job), { label: `finalize ${job.short}`, phase: 'Finalize', schema: FINAL_SCHEMA, ...(args.finalModel ? { model: args.finalModel } : {}) })
  log(`${job.folder}: finalized (${fin ? fin.notes_present + '/' + fin.notes_expected + ' notes' : 'finalizer failed'})`)
  return { folder: job.folder, groups, final: fin }
}

const results = await parallel(args.jobs.map(job => () => runFolder(job)))
return results
