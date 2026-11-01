---
tags: [rebuild/audit]
reviewed: 2026-11-02
---

# Audit E - ByteByteGo Fundamentals and Frontend

> [!info] What this is
> One block per old note: what it has, what is wrong, what to keep, where it goes, and the **must-cover outline** the rewrite follows. Verdicts: KEEP · POLISH · REWRITE · MERGE · SPLIT · DELETE. Depth 0 (definition only) to 5 (complete). The area plan is at the end. Back to [[Rebuild Plan]].

Scope: 76 notes in 11 folders, plus 104 images in 9 image folders. I viewed 48 images (list under "Image audit").
Conventions: "template %" = 100 − audit `pct`. "Owner part" = text above the first generated heading. Notes with no `## Complete notes` heading start the generated part at `## Revision notes`. That happens in 26 notes, so audit `hand` reads 0 for them even when they carry 50–160 pasted lines (e.g. core_Concepts, hooks, Promises).
Shared defects that every block below has, stated once here: a generic folder-wide mermaid diagram (CSS: HTML→Selector→Paint; JS: event loop without microtasks; React: VDOM diff; memory: CPU→cache→RAM→disk; DS: "Data → Access pattern" chooser; cloud: code→CI→image→cloud) and the template sections "Why it matters / How to think / Real project example / Common mistakes / Quick revision".

---

## Css

### CSS CONENT
`bytes GO complete thimh/Css/theory/CSS CONENT.md` · 75 lines · real 35 · depth 0 · DELETE
- Has: links to the 9 CSS notes; generated "Must know" (class reusable, ID unique, flex 1-D, grid 2-D).
- Problems: nav-only; title typo (CONENT → CONTENT). The "real 35" is the same link list repeated 3× (list, topic map, study order). The study-order diagram is just a chain of links.
- Keep: nothing.
- New home: `03 Frontend/Frontend MOC`
- Must cover: n/a (navigation). The MOC lists the frontend notes in learning order, one line each on why a backend engineer reads it.
- Diagrams: none.

### Types
`bytes GO complete thimh/Css/theory/Types.md` · 87 lines · real 17 · depth 1 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: owner's 3 ways to add CSS (inline, internal, external) with a broken `<style>` example; generated part is template only.
- Problems: ~69% template; no "Complete notes" section. "3 type of css property" → these are 3 ways to include CSS, not property types. "backdroung-col" → `background-color`. The `<style>` tags were stripped and render as bare "style". The external section stops at "so to link it we use" with no `<link>`. It never says which method wins.
- Keep: owner's point, corrected: inline `style=""` styles one element; internal `<style>` in `<head>` styles one page; an external `.css` file linked with `<link rel="stylesheet" href="style.css">` styles the whole site.
- New home: `03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model` (section "Adding CSS")
- Must cover: the 3 inclusion methods with code · when to use each (external is cacheable by browser and CDN; inline has the highest precedence but no reuse) · cascade order (origin → `!important` → specificity → source order) · inline vs `!important` · external CSS is render-blocking (CSSOM must exist before first paint) · `media` attribute and preload for non-critical CSS · `@import` cost (serial downloads) · CSS-in-JS and Tailwind as modern alternatives (one line)
- Diagrams: flowchart of how the browser picks the winning declaration (origin/importance → specificity → order).

### CLASS_ID
`bytes GO complete thimh/Css/theory/CLASS_ID.md` · 118 lines · real 25 · depth 1 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: ID is unique, class is reusable, each with an HTML + CSS snippet.
- Problems: ~61% template. Owner wrote "to access it we user `.` … `.id{color:red}`", which is wrong: IDs are selected with `#`. The generated CSS block reads `# hero {` because a formatter turned `#hero` into a heading, so the selector is invalid. It lists "specificity" as a key term but never explains it.
- Keep: owner's idea, corrected: `id="test"` must be unique on the page and is selected with `#test`; classes are reusable and selected with `.btn`; JS reaches them with `getElementById('test')` or `querySelector('#test')`.
- New home: same note (section "Selectors & specificity")
- Must cover: type, class, ID, attribute and universal selectors · combinators (descendant, `>`, `+`, `~`) · specificity as (a,b,c) with worked examples (`#nav .item a` = 1,1,1) · why styling by ID is discouraged · inheritance (color/font inherit, box properties don't) · `!important` and when it's acceptable · `:where()` (zero specificity) vs `:is()` (specificity of its strongest argument) · `@layer` cascade layers · BEM naming · selector-performance myth (browsers match right-to-left; rarely a bottleneck)
- Diagrams: specificity table with examples; optional flowchart "one element, three rules: which wins".

### Position
`bytes GO complete thimh/Css/theory/Position.md` · 108 lines · real 24 · depth 1 · MERGE→`03 Frontend/CSS Layout - Position, Flexbox, Grid`
- Has: owner's one-liners on static/relative/absolute/fixed/sticky with 6 tutorial screenshots; generated part is template only.
- Problems: ~62% template.
  - "static … make the thing sticky to a fixed place" is wrong: static is the default, normal flow.
  - "relative … free to move any where": relative offsets the element from its own normal spot and keeps that space reserved.
  - "absolute … top is based on the root as it has no direct parent": absolute uses the nearest positioned ancestor; the root is used only if there is none.
  - fixed and sticky are vague.
  - The screenshots are video frames with no code. The code that explains the box-1/box-2 example is in an orphan image (`Pasted image 20260802015015.png`) that the note never embeds.
- Keep:
  - owner's model "absolute is a ghost" (out of flow), which is correct.
  - the orphan 20260802015015 code re-typed as a code block: `#box1 {position: relative}`, `#box2 {position: absolute; top:100px; left:100px}`.
  - "sticky sticks once you scroll past it", a correct intuition.
- New home: `03 Frontend/CSS Layout - Position, Flexbox, Grid` (section "Positioning")
- Must cover: normal flow first · static (default; ignores top/left/z-index) · relative (offset from its normal position, original space kept, becomes the containing block for absolute children) · absolute (out of flow; nearest positioned ancestor, else the initial containing block) · fixed (viewport; changes when an ancestor has `transform`/`filter`) · sticky (relative until a threshold inside its scroll container; `overflow` on an ancestor changes which container that is) · z-index and stacking contexts (positioned + z-index, opacity < 1, transform) · relative-parent/absolute-child pattern (badges, dropdowns, tooltips) · `inset` shorthand · when to use flex/grid instead of absolute
- Diagrams: excalidraw sketch of one parent with five children, each labelled with the box it positions against (flow / own spot / positioned ancestor / viewport / scroll container).

### flex
`bytes GO complete thimh/Css/theory/flex.md` · 92 lines · real 18 · depth 1 · MERGE→`03 Frontend/CSS Layout - Position, Flexbox, Grid`
- Has: owner notes on justify-content, align-items, flex-direction, flex-wrap and align-content, with 3 tutorial screenshots; generated part is template only.
- Problems: ~68% template.
  - "align item in y axis" is only true for `flex-direction: row`; with column the cross axis becomes horizontal.
  - "space around: add space between each block" describes space-between. space-around adds half-size gaps at the edges.
  - No `flex-grow/shrink/basis`, `gap` or `order`.
  - Key term "container" is auto-linked to `[[Docker_Image_Container]]`.
- Keep: owner's points, corrected:
  - put `display:flex` on the parent.
  - justify-content works on the main axis; align-items works on the cross axis.
  - the default direction is row; `flex-direction: column` swaps the axes.
  - `flex-wrap: wrap` moves items to new lines; align-content spaces those lines (only when wrapping).
- New home: same note (section "Flexbox")
- Must cover: flex container vs items · main vs cross axis and how `flex-direction` swaps them · justify-content values (start, center, space-between, space-around, space-evenly) · align-items vs align-self vs align-content · `flex: 1` = grow 1, shrink 1, basis 0% · flex-basis vs width · wrap + gap · `min-width: auto` overflow gotcha (long text won't shrink) · `order` and accessibility · the centering recipe · flex vs grid (content-out vs layout-in)
- Diagrams: excalidraw of a flex row with main and cross axes labelled, next to the same container with `flex-direction: column` (axes swapped); a table of justify-content values.

### grid
`bytes GO complete thimh/Css/theory/grid.md` · 99 lines · real 25 · depth 1 · MERGE→`03 Frontend/CSS Layout - Position, Flexbox, Grid`
- Has: owner notes on grid-template-columns/rows, fr, auto-rows, auto-flow, template areas and justify/align; 3 screenshots; generated part is template only.
- Problems: ~60% template.
  - `grid-tempate-column:200px,200px,200px` is wrong: the property is plural and values are space-separated. The owner's own screenshot shows `grid-template-columns: 1fr 1fr 2fr`.
  - "1fr is resizeto size" → fr is a share of the free space.
  - "git-auto-rows" is a typo.
  - "grid-auto-flow … left scroll" → it sets the auto-placement direction (row, column, dense).
  - It says both justify-items and align-items are horizontal; align-items is vertical (block axis).
  - "justify-content/align-content … based on the text" → they place the whole set of tracks inside the container.
  - "container" is auto-linked to the Docker note.
- Keep: owner's points, corrected:
  - `display:grid` + `grid-template-columns: 200px 200px 200px`.
  - `fr` shares leftover space.
  - `grid-auto-rows` sizes the rows the grid creates implicitly.
  - `grid-template-areas` gives named layouts.
  - `justify-items/align-items: center` centres items inside their cells.
- New home: same note (section "Grid")
- Must cover: container, lines, tracks, cells, areas · `grid-template-columns/rows` with px, fr and % · `repeat()` and `minmax()` · `repeat(auto-fit, minmax(200px, 1fr))` responsive cards without media queries · explicit vs implicit grid (`grid-auto-rows`, `grid-auto-flow: dense`) · placing items by line numbers and spans · `grid-template-areas` page layout (header/sidebar/main/footer) · justify-* (inline axis) vs align-* (block axis); -items vs -content vs -self · gap · subgrid · grid vs flex
- Diagrams: excalidraw of a 3×3 grid with line numbers, plus a named-areas page layout; a table of justify/align properties by axis.

### inline_block
`bytes GO complete thimh/Css/theory/inline_block.md` · 108 lines · real 24 · depth 2 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: a correct inline vs block vs inline-block distinction with example tags; notes that width/height apply to inline-block.
- Problems: ~63% template. Doesn't say that inline elements ignore width, height and vertical margins. Lists `img` as plain inline; it is a replaced element, so width and height work. No `display:none` vs `visibility:hidden`, no formatting contexts.
- Keep: owner's points: inline elements (`span`) take only their content's width; block elements take the full line and start on a new line.
- New home: same note (section "Display and normal flow")
- Must cover: block vs inline formatting · box properties inline elements ignore (width, height, vertical margin) · inline-block uses (buttons, nav items) and the whitespace-gap gotcha · replaced elements (img, input) · `display:none` vs `visibility:hidden` vs `opacity:0` (layout and accessibility) · outer vs inner display (`flex`, `grid`, `contents`) · margin collapsing between blocks · block formatting context (`display: flow-root`) to contain floats
- Diagrams: excalidraw of one paragraph showing inline spans, stacked blocks and inline-block buttons.

### shadows
`bytes GO complete thimh/Css/theory/shadows.md` · 103 lines · real 19 · depth 2 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: box-shadow and text-shadow syntax with examples; what x, y, blur, spread and color do.
- Problems: ~68% template. The owner part is one code screenshot. "Fourth optional value is spread" is stated for both, but `text-shadow` has no spread. No `inset`, no multiple shadows.
- Keep: screenshot 20260802021610 as code: `h1 { text-shadow: 0 0 5px yellow, 0 -5px 5px … }` (several shadows) and `h1:hover { box-shadow: 5px 5px 5px black }`.
- New home: same note (small section "Shadows")
- Must cover: box-shadow syntax (x y blur spread color, `inset`) · text-shadow syntax (no spread) · comma-separated multiple shadows · shadows don't affect layout · elevation scales in design systems · `filter: drop-shadow()` for transparent PNG/SVG · focus rings with box-shadow (accessibility) · animating shadows cheaply (animate the opacity of a pseudo-element)
- Diagrams: none; a rendered example table is enough.

### styles
`bytes GO complete thimh/Css/theory/styles.md` · 140 lines · real 35 · depth 1 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: owner's list of font, text-decoration, border-radius, padding, background, margin, float and gap properties, with 3 screenshots; generated part is template only.
- Problems: ~58% template. Several invalid properties or values:
  - "font-width" → `font-weight`
  - "san-serif" → `sans-serif`
  - `text-decoration:cyan dotted line` → `underline dotted cyan`
  - "body-style:utset" → `border-style: outset`
  - `background_position` and `background_ size` → hyphens
  - "marin left" → `margin-left`
  - "Padding … the space between the margin and the text" is wrong: padding sits between content and border.
  - The margin section mixes in `border:12px`; the "font size" heading appears twice.
- Keep: owner's checklist of common properties, corrected: `font-family: Arial, sans-serif` (fallback list, generic family last), `font-size`, `font-weight`, `text-decoration`, `border-radius`, `padding`, `margin`, `background: linear-gradient(blue, green)`, `background-size: cover`, `background-attachment: fixed`, `float: left` (text wraps around an image), `gap`.
- New home: same note (sections "Box model" and "Typography & backgrounds")
- Must cover: box model (content → padding → border → margin) · `box-sizing: border-box` and why every reset sets it · margin collapsing · units (px, %, em, rem, vw/vh, ch) and when to use rem · typography (font stack, weight, line-height, web fonts and FOIT/FOUT) · colors (hex, rgb/rgba, hsl, `currentColor`) · backgrounds (image, size cover/contain, position, gradients) · overflow and text-overflow ellipsis · float (legacy, clearfix) vs flex · custom properties (CSS variables) · responsive basics (media queries, `clamp()`)
- Diagrams: excalidraw box-model sketch (nested content/padding/border/margin rectangles); mermaid can't draw this well.

### sudo class
`bytes GO complete thimh/Css/theory/sudo class.md` · 104 lines · real 24 · depth 2 · MERGE→`03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model`
- Has: generated list of common pseudo-classes, a hover example, and pseudo-class vs pseudo-element. The owner part is 4 code screenshots.
- Problems: ~61% template; title typo "sudo" → pseudo. The screenshots show `a:link`, `:visited`, `:hover`, `:active`, but the note never states that this order (LVHA) is required. No `:focus-visible`, `:not()` or `:has()`, and doesn't say `::before` needs `content`.
- Keep: screenshot 20260802015539 as code: `a:link {color: lawngreen} a:visited {color: grey} a:hover {color: tomato} a:active {color: yellow}`, plus the rule "keep the LVHA order, or later rules override earlier ones".
- New home: same note (section "Pseudo-classes and pseudo-elements")
- Must cover: pseudo-class (a state) vs pseudo-element (a part), `:` vs `::` · link states and LVHA order · `:focus` vs `:focus-visible` (keyboard accessibility) · structural `:first-child`, `:nth-child(2n+1)`, `:nth-of-type` · `:not()`, `:is()`, `:where()` · `:has()` as a parent selector · form states (`:checked`, `:disabled`, `:invalid`) · `::before/::after` with `content` (icons, badges) · `::placeholder`, `::selection` · pseudo-class specificity (same as a class)
- Diagrams: none; a table of selector → when it matches.

---

## DNS

### DNS CONTENT TABLE
`bytes GO complete thimh/DNS/theory/DNS CONTENT TABLE.md` · 54 lines · real 14 · depth 0 · DELETE
- Has: 2 links and 4 "Must know" bullets.
- Problems: nav-only. "uses `[[API Caching with Redis|caching]]`" links DNS caching to a Redis API-caching note.
- Keep: nothing.
- New home: `02 Networking & Web/Networking MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### whtat DNS
`bytes GO complete thimh/DNS/theory/whtat DNS.md` · 103 lines · real 33 · depth 2 · MERGE→`02 Networking & Web/DNS - Resolution, Records and Caching`
- Has: DNS turns names into IPs; A, AAAA, CNAME, MX and TXT records; a 4-step lookup; a correct resolver sequence diagram.
- Problems: ~51% template; title typo "whtat". No TTL, no NS/SOA/PTR/SRV/CAA records, no CNAME-at-apex rule. Overlaps the DNS half of `advance backend/theory/aws/Domain DNS HTTPS SSL TLS.md`.
- Keep: owner's one-liner "DNS converts human-readable google.com to an IP address"; the generated record list, which is accurate.
- New home: `02 Networking & Web/DNS - Resolution, Records and Caching` (section "Records")
- Must cover: A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, SRV and CAA with one example each · CNAME rules (none at the zone apex; ALIAS / Route 53 alias records) · choosing a TTL (low for fast failover vs high for cache hit rate) · SPF, DKIM and DMARC via TXT · reverse DNS (PTR) · zones, delegation and glue records · reading `dig` output · why "propagation" is really TTL expiry
- Diagrams: none beyond the resolution sequence in work_DNS.

### work_DNS
`bytes GO complete thimh/DNS/theory/work_DNS.md` · 90 lines · real 25 · depth 2 · REWRITE
- Has: three server levels (root, TLD, authoritative); a correct iterative-resolution sequence diagram; 3 ByteByteGo screenshots.
- Problems: ~57% template.
  - No text on recursive vs iterative queries, the caches (browser, OS, resolver) or TTL; the 9-step flow exists only in a screenshot.
  - "Authoritative Level" is listed, but its screenshot (20260827014932) is not embedded.
  - The key term `[[cache]]` links to the data-structure CPU-cache note.
  - The screenshot shows 93.184.216.34 (example.com's old IP) as google.com's address; don't copy it.
- Keep:
  - owner's 3 levels: root → TLD → authoritative.
  - the 9-step flow of screenshot 20260827015028 (browser cache → resolver cache → root → .com TLD → authoritative → answer cached), redrawn as mermaid.
  - the existing sequence diagram, which is correct.
- New home: `02 Networking & Web/DNS - Resolution, Records and Caching`
- Must cover: name hierarchy (root `.`, TLD, second-level, subdomain) · stub resolver → recursive resolver (ISP, 8.8.8.8, 1.1.1.1, VPC resolver) · recursive vs iterative queries and referrals · cache layers (browser, OS / systemd-resolved, `/etc/hosts`, resolver), TTL and negative caching · 13 root identities served via anycast · UDP/53 with TCP fallback, EDNS0 · DNS load balancing, GeoDNS / latency routing and health-checked failover (Route 53) · Kubernetes DNS (CoreDNS, `ndots:5`, search domains) · Go: `net.Resolver`, pure-Go vs cgo resolver, Go doesn't cache lookups · security: DNSSEC, DoH/DoT, cache poisoning · debugging with `dig +trace`
- Diagrams: sequence diagram browser → OS → recursive resolver → root → TLD → authoritative, with cache checks and TTL notes; flowchart of the name-hierarchy tree.

---

## LAtency

### what is latency
`bytes GO complete thimh/LAtency/what is latency.md` · 89 lines · real 14 · depth 1 · REWRITE
- Has: 10 ByteByteGo video frames of "Latency numbers for the 2020s" (the 1 ns → 1 s pyramid); the only text is one generated definition.
- Problems: ~74% template. No text at all: every number is in screenshots, and the screenshots include the YouTube player and the presenter's face, so they can't be shared. The diagram is a generic client→API→DB flow unrelated to the pyramid. The title should say "Latency Numbers". The frame "TLS handshake 250–500 ms" holds only for intercontinental round trips.
- Keep: frames 20260827021107 … 021652 as a table (verify each placement against the frames when transcribing):

  | Band | Examples |
  |---|---|
  | 1 ns | CPU cycle, register |
  | 1–10 ns | L1/L2 cache, branch mispredict |
  | 10–100 ns | L3, main memory |
  | 100–1000 ns | syscall/trap, hashing small data |
  | 1–10 µs | context switch, 64 KB memcpy |
  | 10–100 µs | NGINX proxy request, 1 MB sequential RAM read, SSD 8 KB read |
  | 100–1000 µs | SSD write, intra-zone RTT, Redis/memcached GET |
  | 1–10 ms | inter-zone RTT, HDD seek |
  | 10–100 ms | cross-continent RTT, 1 GB sequential RAM read |
  | 100–1000 ms | bcrypt, TLS handshake over long RTT, 1 GB SSD read |
  | > 1 s | 1 GB over the network in-region |
- New home: `01 CS Fundamentals/Latency Numbers Every Engineer Should Know`
- Must cover: latency vs throughput vs bandwidth · units (ns, µs, ms) · the table by order of magnitude · ratios (RAM ≈ 100× L1; SSD ≈ 1000× RAM; cross-region ≈ 100× intra-AZ) · why sequential I/O beats random · round-trip maths: TCP 1 RTT + TLS 1.3 1 RTT (TLS 1.2: 2) before the first byte · back-of-envelope use in design (N sequential DB calls × ~1 ms) · tail latency (p50/p95/p99/p999) and fan-out amplification · latency budgets per hop · Little's law (L = λW) · measuring in Go (`time.Since`, histograms, pprof/trace), linked to `Latency Debugging`
- Diagrams: log-scale bar chart or table of the latency ladder; sequence diagram of a cold HTTPS request (DNS → TCP → TLS → request) with RTT counts.

---

## REST

### REST content table
`bytes GO complete thimh/REST/theory/REST content table.md` · 54 lines · real 14 · depth 0 · DELETE
- Has: 2 links and 4 "Must know" bullets.
- Problems: nav-only.
- Keep: nothing.
- New home: `05 APIs/APIs MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### what is rest
`bytes GO complete thimh/REST/theory/what is rest.md` · 86 lines · real 34 · depth 2 · MERGE→`05 APIs/REST API Design`
- Has: REST = resources + URLs + HTTP methods + JSON; the method list; good vs bad URLs; common mistakes (verbs in URLs, POST for everything).
- Problems: ~29% template (the best in this folder). Owner typo "stae" → state. No REST constraints, no status codes, no idempotency; statelessness appears only in the last line. Overlaps `Api architecture/theory/REST API.md` and `golang backend/Go REST API Coding.md`.
- Keep:
  - screenshot points as text: `/api/v3/products` (correct: a noun) vs `/api/v3/getAllProducts` (wrong: a verb).
  - POST → create, GET → read, PUT → update, DELETE → delete; add PATCH.
  - the generated "Common mistakes" list.
- New home: `05 APIs/REST API Design`
- Must cover: Fielding's constraints (client-server, stateless, cacheable, uniform interface, layered, code-on-demand) · resources vs representations · URI design (plural nouns, shallow nesting, filters as query params) · safe vs idempotent methods (GET/HEAD/PUT/DELETE idempotent; POST/PATCH not) · status codes that matter (200/201/202/204, 301/304, 400/401/403/404/409/412/422/429, 500/502/503/504) · error format (RFC 9457 `application/problem+json`) · pagination (offset vs cursor) · filtering, sorting, sparse fields · versioning and deprecation · idempotency keys for POST · conditional requests (ETag + If-None-Match for caching, If-Match for optimistic locking) · HATEOAS and the Richardson maturity model · REST vs GraphQL vs gRPC · link to the Go implementation note
- Diagrams: sequence diagram of create-order with an idempotency key and a retry (first call 201; the retry returns the stored 201); a table of methods × safe / idempotent / cacheable.

### use of rest
`bytes GO complete thimh/REST/theory/use of rest.md` · 88 lines · real 42 · depth 2 · MERGE→`05 APIs/REST API Design`
- Has: where REST is used, CRUD endpoints, why it's popular, and when WebSocket, GraphQL or gRPC fit better; owner screenshots on pagination and versioning.
- Problems: ~24% template. The owner text is only headings ("pagination", "version change") over screenshots. Pagination is shown only as limit/offset, with no cost or consistency discussion. The title is misleading; the note is really about pagination and versioning.
- Keep: `/products?limit=25&offset=50`; the `/v1/products` → `/v2/products` URI-versioning example; the generated "When another API style may be better" section, which is accurate.
- New home: `05 APIs/REST API Design` (sections "Pagination", "Versioning", "When not to use REST")
- Must cover: offset pagination and why deep offsets are slow (the DB reads offset+limit rows) · cursor/keyset pagination (`WHERE (created_at,id) < (…)`) with opaque cursors · cost of total counts · consistency when rows are inserted between pages · versioning in the URI vs a header vs content negotiation · breaking vs additive changes · deprecation (Sunset/Deprecation headers) · REST for public APIs vs gRPC internally vs a GraphQL BFF vs WebSocket/SSE for push · rate-limit responses (429, Retry-After)
- Diagrams: flowchart comparing offset and cursor pagination over an index; timeline v1 → v2 with a deprecation window.

---

## React

### React Content
`bytes GO complete thimh/React/React Theory/React Content.md` · 143 lines · real 43 · depth 0 · DELETE
- Has: links to 12 notes, the "rafce" snippet tip, a generated topic map and study order.
- Problems: nav-only. It lists 5 non-React topics as React (CDN, async/defer, async/await, library vs framework, monolith vs microservices). The study order skips `mcroservise_monolith`. It has 2 mermaid diagrams, both useless (a link chain and the generic VDOM flow).
- Keep: tip "`rafce` = VS Code ES7+ React snippets shortcut for a React arrow-function component with export".
- New home: `03 Frontend/Frontend MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### CDN
`bytes GO complete thimh/React/React Theory/CDN.md` · 102 lines · real 18 · depth 1 · MERGE→`02 Networking & Web/CDN and Edge Caching`
- Has: owner screenshots defining a CDN (geographically distributed proxy servers) and "why use a CDN"; the generated text covers only loading React from unpkg.
- Problems: in the wrong folder (React); ~69% template.
  - The generated part reduces a CDN to "script tags for demos".
  - Its URL `unpkg.com/react/umd/react.development.js` breaks for React 19, which removed UMD builds.
  - The diagram is the VDOM flowchart.
  - Screenshot 20260803004438 is embedded twice; 20260803004258 is a byte-identical orphan copy of 20260803004339.
  - It is the third CDN note in the vault, alongside `advance backend/theory/api design/CDN.md` and `Global CDN and Edge.md`.
- Keep: screenshot text "a CDN is a geographically distributed network of proxy servers and their data centers"; "why CDN: faster load times, scalability", rewritten as text.
- New home: `02 Networking & Web/CDN and Edge Caching`
- Must cover: edge PoPs, origin and origin shield · steering users to the nearest edge (anycast vs GeoDNS) · cache hit/miss flow and cache keys · Cache-Control, `s-maxage`, `stale-while-revalidate` and ETag · purge/invalidation vs hashed asset filenames · push vs pull CDN · dynamic-content acceleration (TLS terminated near the user, warm connections to origin) · edge compute (Cloudflare Workers, Lambda@Edge) · DDoS absorption, WAF, signed URLs/cookies · cost (egress, hit ratio) · CloudFront + S3 with OAC · public-CDN script tags (SRI hashes, version pinning; the browser cache is partitioned per site, so shared-CDN caching no longer helps)
- Diagrams: sequence diagram of user A → edge (miss) → origin shield → origin, then user B → edge (hit); flowchart of DNS/anycast steering users to PoPs.

### LIFE_Of _REact
`bytes GO complete thimh/React/React Theory/LIFE_Of _REact.md` · 91 lines · real 20 · depth 2 · MERGE→`03 Frontend/React Rendering - Virtual DOM, Reconciliation, Lifecycle`
- Has: pasted Q&A on class lifecycle methods (constructor, render, componentDidMount, componentDidUpdate, componentWillUnmount) and the render/commit-phase diagram.
- Problems: ~63% template. The text is copied verbatim from a Q&A source (first letters dropped: "he `componentDidMount`"). Class components only, with no mapping to `useEffect`. Omits shouldComponentUpdate, getDerivedStateFromProps, getSnapshotBeforeUpdate and error boundaries. Method names are capitalised ("ComponentDidMount"); title typo.
- Keep:
  - phases: mount → update → unmount.
  - the render phase is pure and can be paused or restarted; the commit phase may touch the DOM and run side effects (from screenshot 20260803024110, Wojtek Maj's lifecycle diagram; link the site instead of embedding it).
  - componentWillUnmount is for cleanup: cancel requests, remove listeners.
- New home: same note (section "Lifecycle")
- Must cover: mount, update, unmount · render vs commit phase · class methods including shouldComponentUpdate · error boundaries (componentDidCatch, getDerivedStateFromError) · hook equivalents (`useEffect(fn, [])`, dependency arrays, cleanup, `useLayoutEffect`) · what triggers a re-render (state, parent render, context) · StrictMode runs effects twice in development · leaks from missing cleanup (subscriptions, intervals, `AbortController` for fetch)
- Diagrams: state diagram Mounting → Updating ↺ → Unmounting, with the class method and hook equivalent on each transition.

### Prop dilling
`bytes GO complete thimh/React/React Theory/Prop dilling.md` · 174 lines · real 77 · depth 3 · MERGE→`03 Frontend/React State Management - Props, Context, Redux`
- Has: prop drilling with an example; lifting state up (a class example); Context Provider/Consumer with code; the default-value question.
- Problems: ~40% template.
  - Pasted Q&A with dropped first letters ("rop drilling").
  - Code is unfenced and unindented, so JSX renders as broken HTML in Obsidian.
  - Class and `Context.Consumer` style is legacy.
  - Wrong answer: "If we don't pass a value to the provider does it take the default value? — it does". The default applies only when there is no Provider above; `<Provider>` without `value` gives `undefined`.
  - Title typo "dilling".
- Keep: the three code examples (App → Parent → Child drilling; lifting count state to the parent with an `onIncrement` callback; createContext + Provider). Convert them to function components and fence them.
- New home: `03 Frontend/React State Management - Props, Context, Redux`
- Must cover: one-way data flow and props · prop drilling and when it's fine (2–3 levels) · lifting state up · composition/`children` as an alternative to context · Context API (createContext, Provider, useContext) and the default-value rule · context re-render cost; split or memoize the value · local vs global vs server state · Redux Toolkit (store, slice, action, dispatch, selector) · server state with RTK Query or TanStack Query · lightweight stores (Zustand) · how to choose
- Diagrams: flowchart comparing the prop-drilling path (App → A → B → C), Context (Provider → C directly) and a store (components subscribe).

### Real_virtual
`bytes GO complete thimh/React/React Theory/Real_virtual.md` · 103 lines · real 22 · depth 2 · MERGE→`03 Frontend/React Rendering - Virtual DOM, Reconciliation, Lifecycle`
- Has: real DOM vs virtual DOM; a 4-step diff flow; an honest note that the VDOM is not magic speed.
- Problems: ~65% template. Owner wrote "in reach" (→ React) and "Reconciliation: so check the page" (nothing else). Screenshot 20260803010406 says "React updates complete document in the Real DOM … changes reflect directly on the complete webpage", which is wrong: DOM updates are per node; the cost is layout/repaint plus manual bookkeeping. Nothing on keys, Fiber or batching.
- Keep: the generated 4 steps (state change → new tree → diff → patch the real DOM) and the point that the VDOM buys predictability, not raw speed.
- New home: same note (section "Rendering & reconciliation")
- Must cover: the DOM tree and the cost of reflow vs repaint · React elements as plain objects · render → reconcile → commit · diff heuristics (different type ⇒ remount; keys give list identity; O(n) instead of O(n³)) · why index-as-key breaks state · Fiber (interruptible work, priorities/lanes) · automatic batching (React 18) · `startTransition` and `useDeferredValue` · memoization (`React.memo`, `useMemo`, React Compiler) · no-VDOM frameworks (Svelte, Solid) as contrast
- Diagrams: flowchart state change → render (new element tree) → diff vs the previous fiber tree → commit minimal DOM ops; a small keyed-list diff example.

### asyncVSdeffer
`bytes GO complete thimh/React/React Theory/asyncVSdeffer.md` · 96 lines · real 18 · depth 2 · MERGE→`03 Frontend/How Browsers Load and Render a Page`
- Has: a correct async vs defer explanation (both download in parallel; async runs as soon as it arrives, in no fixed order; defer runs after parsing, in document order).
- Problems: in the wrong folder (browser topic, not React); ~69% template. The owner part is one screenshot of third-party text. The VDOM diagram is unrelated. Missing: `type="module"` scripts are deferred by default; DOMContentLoaded timing; async/defer are ignored on inline scripts.
- Keep: the generated rule "use defer for app scripts, async for independent scripts like analytics".
- New home: `03 Frontend/How Browsers Load and Render a Page` (section "Script loading")
- Must cover: HTML → DOM, CSS → CSSOM, render tree, layout, paint, composite · parser-blocking scripts and render-blocking CSS · normal vs async vs defer vs module timelines · DOMContentLoaded vs load · preload, prefetch, preconnect · critical rendering path and Core Web Vitals (LCP, INP, CLS) · reflow vs repaint triggers · backend levers (TTFB, compression, caching headers; HTTP/2 push was dropped by browsers)
- Diagrams: mermaid gantt of HTML parsing vs script download/execute for normal, async and defer scripts.

### async_await
`bytes GO complete thimh/React/React Theory/async_await.md` · 112 lines · real 23 · depth 2 · MERGE→`03 Frontend/JavaScript Async - Event Loop, Promises, async-await`
- Has: async functions return Promises; await pauses until the Promise settles; a fetch example; try/catch.
- Problems: in the wrong folder (JS, not React); ~64% template. Owner's "await is used inside async function only" is outdated: ES modules allow top-level await. The event-loop diagram has no microtask queue, which is where await continuations run. Nothing on sequential vs parallel awaits.
- Keep: the generated getUser/fetch and try/catch snippets, which are correct.
- New home: `03 Frontend/JavaScript Async - Event Loop, Promises, async-await` (section "async/await")
- Must cover: an async function always returns a Promise · `await` yields to the event loop and resumes as a microtask · sequential awaits vs `Promise.all` · errors via try/catch vs `.catch` · top-level await in modules · `for await…of` · cancellation with AbortController · unhandled rejections · fetch doesn't reject on 4xx/5xx (check `res.ok`)
- Diagrams: sequence diagram of await suspending, the caller continuing, and the continuation resuming from the microtask queue.

### core_Concepts
`bytes GO complete thimh/React/React Theory/core_Concepts.md` · 285 lines · real 135 · depth 2 · SPLIT
- Has: pasted Q&A on package.json, bundlers, render-then-fetch, shimmer UI, optional chaining, expressions vs statements, conditional rendering, SPAs, client vs server routing, super(props), why useEffect can't be async, lazy, Suspense.
- Problems: ~33% template, but the "real" part is pasted third-party Q&A plus 5 text screenshots. It is a grab-bag of JS, tooling, React and web-architecture topics, and the code is unfenced.
  - SPA "Faster Initial Load" is wrong: SPAs load slower the first time and navigate faster afterwards.
  - The Suspense example is wrong: passing a Promise as a prop doesn't suspend. Suspense needs `React.lazy`, `use()` or a Suspense-enabled library.
  - "lazy() … and React.lazy()" are the same function.
  - The startTransition error explanation never states the fix (wrap the update in `startTransition`).
  - `super(props)` is legacy class-component trivia.
- Keep:
  - render-then-fetch (render a skeleton/shimmer → fetch in an effect → re-render) from screenshot 20260803022549.
  - the optional-chaining and conditional-rendering examples.
  - the `lazy` + `<Suspense fallback>` code-splitting example.
  - why a `useEffect` callback can't be async: it must return a cleanup function or nothing.
- New home: React parts → `03 Frontend/React Fundamentals - Components, JSX, Props, State`; SPA and routing → `03 Frontend/React Routing and Rendering Strategies - CSR, SSR, SSG`; optional chaining and expressions → `03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`; package.json/bundler → a tooling section in React Fundamentals.
- Must cover (React Fundamentals): components as functions of props and state · JSX → the jsx runtime / `createElement` · props vs state · events and controlled inputs · conditional and list rendering with keys · state updates are batched; functional updates · the data-fetching pattern (effect + loading/error states, or TanStack Query) · code splitting with lazy/Suspense · error boundaries · tooling (package.json, dependencies vs devDependencies, lockfiles, Vite/webpack, tree shaking) · React 19 additions (Actions, `use`, ref as a prop)
- Diagrams: flowchart of the render-then-fetch cycle (render skeleton → effect fetch → setState → re-render); build pipeline flowchart (JSX/TS → bundler → chunks → browser).

### hooks
`bytes GO complete thimh/React/React Theory/hooks.md` · 162 lines · real 65 · depth 3 · POLISH
- Has: useState (screenshot), useEffect with a fetch example and its uses, useContext, a useReducer counter, a useRef focus example.
- Problems: ~41% template. Pasted Q&A with dropped first letters ("his hook"); code is unfenced. The auto-linker corrupted the fetch URL inside the code: `'[[Domain DNS HTTPS SSL TLS|https]]://api.example.com/data'`. No rules of hooks, dependency-array semantics, stale closures, cleanup, useMemo/useCallback or custom hooks.
- Keep: all five code examples (fix the URL, fence them); "useEffect is for data fetching, DOM manipulation, subscriptions, and avoiding memory leaks".
- New home: `03 Frontend/React Hooks`
- Must cover: rules of hooks and why (call order per render) · useState (functional updates, batching, immutable object updates) · useEffect (no deps / `[]` / `[a,b]`, cleanup, race conditions via AbortController or an ignore flag, "you might not need an effect") · useLayoutEffect vs useEffect · useRef (DOM refs; mutable values that don't trigger re-render) · useContext · useReducer and when to prefer it · useMemo/useCallback and referential equality · custom hooks (useFetch, useDebounce) · the stale-closure bug and its fix · newer hooks (useTransition, useDeferredValue, useId, use, useActionState, useOptimistic) · StrictMode double effects
- Diagrams: sequence diagram render → commit → effect runs → setState → re-render → cleanup before the next effect.

### lib_frame
`bytes GO complete thimh/React/React Theory/lib_frame.md` · 105 lines · real 24 · depth 2 · MERGE→`16 Software Architecture/Inversion of Control - Library vs Framework`
- Has: a library is something you call; a framework calls your code (owner's "architect vs blueprint" summary). Examples: React, Lodash, Axios vs Next.js, Angular, Django.
- Problems: in the wrong folder (React); ~62% template. The owner part is 3 screenshots plus a pasted 2-line summary. It never names the principle (inversion of control, the "Hollywood principle"). The VDOM diagram is unrelated.
- Keep: owner's summary, which is correct: "Library: you are the architect and call it when needed. Framework: it provides the skeleton (structure, routing, data flow) and you fill in your logic."
- New home: `16 Software Architecture/Inversion of Control - Library vs Framework`
- Must cover: inversion of control (Hollywood principle) · library vs framework vs platform/SDK · Go examples: `net/http` calling your handlers (framework-like) vs `encoding/json` (a library); stdlib vs Gin/Echo/chi · middleware chains and plugin hooks as IoC · dependency injection (constructor injection in Go; wire/fx) · lock-in and upgrade cost · when a framework pays off (conventions, team size) · React = library, Next.js = framework
- Diagrams: two sequence diagrams: your code → library (you call it) vs framework → your callbacks (it calls you).

### mcroservise_monolith
`bytes GO complete thimh/React/React Theory/mcroservise_monolith.md` · 112 lines · real 29 · depth 2 · MERGE→`16 Software Architecture/Monolith vs Microservices`
- Has: pasted definitions with keyword lists; generated "start with a monolith" advice; a stock monolith-vs-microservices diagram.
- Problems: in the wrong folder (React); ~59% template. The keyword lists ("Decomposition, Independence…") are never explained. The mermaid diagram is the generic route→middleware→controller chain. Duplicates `advance backend/theory/system design/Monolith and Microservices.md`. Title typos.
- Keep: the generated line "microservices add complexity; start with a monolith unless there's a strong reason" (matches Fowler's MonolithFirst); the idea of screenshot 20260803230911 (one deployable containing UI + logic + data layer vs many services, each with its own DB), redrawn.
- New home: `16 Software Architecture/Monolith vs Microservices`
- Must cover: the spectrum: monolith, modular monolith, microservices, serverless · what actually splits (deploys, data ownership, team ownership / Conway's law) · database per service and its cost (no joins, sagas, eventual consistency) · sync REST/gRPC vs async events · failure modes (cascading failures, timeouts, retries, circuit breakers) · operational cost (observability, per-service CI/CD, service discovery, a platform team) · when to split (team size, independent scaling, different SLAs) · strangler-fig migration · the distributed-monolith anti-pattern · real cases (Amazon/Netflix; Shopify's modular monolith; Prime Video moving back to a monolith) · Go layout for a modular monolith
- Diagrams: side-by-side flowchart: monolith (one process, one DB) vs microservices (gateway → services → their own DBs + an event bus); sequence diagram of a strangler-fig migration.

### redux
`bytes GO complete thimh/React/React Theory/redux.md` · 105 lines · real 23 · depth 2 · MERGE→`03 Frontend/React State Management - Props, Context, Redux`
- Has: useContext vs Redux; Redux Toolkit advantages; dispatch via `useDispatch`.
- Problems: ~65% template; pasted Q&A ("edux", "n Redux"). "useContext … is used for managing state" is wrong: Context only passes a value down, and the state lives in useState/useReducer. The "Explain Reducer" heading is empty. "global state container" is auto-linked to `[[Docker_Image_Container]]`.
- Keep: the useDispatch example (fenced); "RTK = less boilerplate and easier async (createAsyncThunk)".
- New home: same note (section "Redux")
- Must cover: single store, actions, pure reducers, immutability · data flow dispatch → reducer → new state → subscribers re-render · RTK: `configureStore`, `createSlice` (Immer), `useSelector` · async with createAsyncThunk vs RTK Query · middleware (thunk, logging) · DevTools time travel · when Redux is overkill · Context vs Redux re-render behaviour
- Diagrams: flowchart UI event → dispatch(action) → reducer → store → useSelector → re-render.

### routing
`bytes GO complete thimh/React/React Theory/routing.md` · 141 lines · real 51 · depth 2 · REWRITE
- Has: React Router examples (Route, Switch) and descriptions of createHashRouter and createMemoryRouter. The "Child routing" and "Dynamic routing" headings are empty.
- Problems: ~47% template. Mixes React Router v5 (`Switch`, `component=`) with v6.4 APIs. `<createHashRouter>` and `<createMemoryRouter>` are used as JSX components, which is wrong: they are functions whose result goes to `<RouterProvider router>`. The screenshot names createBrowserRouter but there's no example. Pasted text has dropped letters ("eateHashRouter").
- Keep: "a hash router keeps the route after `#`, so the server never sees it; this works on static hosting without rewrite rules"; memory routers are for tests.
- New home: `03 Frontend/React Routing and Rendering Strategies - CSR, SSR, SSG`
- Must cover: client-side vs server-side routing · History API vs hash routing (and the server rewrite rule an SPA needs) · React Router v6.4+/v7: createBrowserRouter + RouterProvider, nested routes and `<Outlet>`, params `/users/:id`, loaders and actions · navigation (`<Link>`, `useNavigate`) · protected routes · code splitting per route · CSR vs SSR vs SSG vs ISR vs streaming SSR, hydration · React Server Components (Next.js App Router) · SEO and TTFB trade-offs · createMemoryRouter in tests
- Diagrams: flowchart URL change → route match → nested layout/outlet render; sequence diagrams of the first load under CSR vs SSR.

---

## backend burger

> What "backend burger" is: both screenshots show the same "Backend Burger" infographic (a ByteByteGo-style video frame; verify the source). Each burger layer is one skill area of a backend engineer, with example tools:
> - programming language: Java, Python, Ruby, PHP, C#, JS/TS, Go, Rust
> - frameworks: Next.js, Flask, Express.js, Laravel
> - database: relational (PostgreSQL, MySQL, MS SQL, Aurora) and non-relational (MongoDB, Firebase, Cassandra)
> - testing: unit, integration, functional
> - caching: CDN, browser cache, Redis, Memcached
> - VCS: GitHub, GitLab, Bitbucket
> - APIs: REST, GraphQL, tRPC
> - architectural patterns: microservice, monolithic, serverless
> - CI/CD tools: GitHub Actions, CircleCI, ArgoCD
> - containerization: Docker, containerd, LXC
>
> It is a roadmap or tech-landscape map. It is not a request-flow diagram, and it says nothing about startups. All generated text in the 3 notes ("top bun = client request, sauce = routing, patty = business logic, cheese = database"; "startup backend should start simple") was invented by the generator. It belongs in `19 Interview & Career` as a roadmap checklist mapped to the vault folders.

### backend burger content
`bytes GO complete thimh/backend burger/theory/backend burger content.md` · 90 lines · real 19 · depth 0 · DELETE
- Has: 2 links and the generator's invented burger-as-request-layers analogy.
- Problems: nav-only; the analogy doesn't match the screenshot.
- Keep: nothing.
- New home: none (replaced by `19 Interview & Career/Backend Roadmap and Tech Landscape`).
- Must cover: n/a (navigation).
- Diagrams: none.

### backendburgerDiagram
`bytes GO complete thimh/backend burger/theory/backendburgerDiagram.md` · 104 lines · real 26 · depth 0 · MERGE→`19 Interview & Career/Backend Roadmap and Tech Landscape`
- Has: one screenshot of the Backend Burger; generated text about request layers (client → route → middleware → controller → service → DB).
- Problems: ~61% template. The generated text describes something the image doesn't show. The request-layering content belongs in `06 Backend Engineering in Go` (handler / middleware / service / repository).
- Keep: screenshot 20260907030045 as a checklist table, one row per layer (list above), each mapped to its vault folder (language → 04, frameworks → 06, DB → 07, caching → 08, testing → 15, VCS/CI-CD/containers → 13, APIs → 05, architecture → 16).
- New home: `19 Interview & Career/Backend Roadmap and Tech Landscape` (merge with `sde3 roadmap/SDE3 Backend Roadmap.md` and the Excalidraw roadmap)
- Must cover: the 10 layers, each with the Go-specific choice (frameworks → net/http, chi, Gin; testing → `testing`, testify, testcontainers; DB → pgx, sqlc) · what an SDE-3 must know deeply vs only recognise · learning order · a link to each target folder · layers the burger omits: messaging (Kafka, RabbitMQ, SQS), observability, security/auth, cloud (AWS), orchestration (Kubernetes), IaC, AI engineering
- Diagrams: mermaid `mindmap` "Backend engineer" → ~16 skill areas → vault folders.

### bakcedburgerforstatup
`bytes GO complete thimh/backend burger/theory/bakcedburgerforstatup.md` · 94 lines · real 18 · depth 0 · DELETE
- Has: a second crop of the same Backend Burger screenshot and a generated "startup backend should start simple" list.
- Problems: image 20260907030320 is a near-duplicate of 20260907030045. All text is invented (nothing in the source mentions startups). Title typos ("bakced", "statup").
- Keep: nothing. The "start simple: one DB, a monolith, cache only after measuring" idea is covered in `16 Software Architecture/Monolith vs Microservices`.
- New home: none.
- Must cover: n/a.
- Diagrams: none.

---

## cache

### cache content table
`bytes GO complete thimh/cache/theory/cache content table.md` · 59 lines · real 18 · depth 0 · DELETE
- Has: 3 links (one target has a trailing space: `[[cache used for ]]`); generated "Must know" (TTL, invalidation, stale data).
- Problems: nav-only; `[[cache|Cache]]` points to the data-structure CPU-cache note.
- Keep: nothing.
- New home: `08 Caching & Redis/Caching MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### type of cache
`bytes GO complete thimh/cache/theory/type of cache.md` · 90 lines · real 14 · depth 1 · SPLIT
- Has: owner's L1/L2/L3 descriptions, "page cache: the OS uses this", "file cache: used to access files in memory"; 3 ByteByteGo frames.
- Problems: ~74% template. Mixes hardware and OS caches into a folder that is otherwise about system-level caching. The L3 line is wrong: "slower than the L1 … used via different cups" → L3 is slower than L2 and shared by all cores. The "file cache" screenshot (20260907025047) actually shows the inode cache (metadata); file data lives in the page cache. The hit/miss diagram is generic. The auto-linker turned "fastest cache" in the owner text into "fastest `[[cache]]`".
- Keep: owner's points, corrected:
  - L1 is the fastest and smallest, per core, inside the CPU.
  - L2 is larger and slower, usually per core.
  - L3 is the largest and slowest CPU cache, shared by cores.
  - the OS page cache keeps recently read file pages in RAM.
  - inode/dentry caches keep file metadata and path lookups in RAM.
- New home: L1–L3 → `01 CS Fundamentals/Memory Hierarchy and CPU Caches`; page cache and inode cache → `01 CS Fundamentals/Page Cache, File Systems and fsync`
- Must cover (CPU caches): L1i/L1d/L2/L3 sizes and latencies (~4 / ~12 / ~40 cycles) · cache lines (64 B; 128 B on Apple M-series) · spatial and temporal locality · hits, misses, associativity, eviction · write-back vs write-through · coherence (MESI) and false sharing (Go: pad hot counters, shard per CPU) · hardware prefetching · NUMA · why slices beat linked lists in practice · measuring with `perf stat` and Go benchmarks
- Diagrams: flowchart CPU core → L1 → L2 → shared L3 → DRAM, labelled with sizes and latencies; excalidraw of two cores bouncing one cache line between them (false sharing).

### cache used for
`bytes GO complete thimh/cache/theory/cache used for.md` · 94 lines · real 21 · depth 1 · SPLIT
- Has: a generated "why cache" list (speed, DB load, fewer network calls) with examples at every layer; a staleness/TTL note; a hit/miss flowchart.
- Problems: ~65% template. The note's only screenshot (20260907024938) is the Translation Lookaside Buffer (a cache for virtual → physical address translations). The generator ignored it and wrote generic text; the TLB is never explained. `[[cache|Cache]]` links to the CPU-cache data-structure note.
- Keep: the generated "why cache" bullets and the hit/miss flowchart (correct but generic); the TLB screenshot as the source for a redrawn diagram.
- New home: TLB → `01 CS Fundamentals/Virtual Memory, Paging and the TLB`; why-cache text → `08 Caching & Redis/Caching Fundamentals`
- Must cover (virtual memory): virtual vs physical addresses · pages and frames (4 KB) · multi-level page tables and the MMU · TLB hits, misses and page-walk cost · minor vs major page faults, demand paging · copy-on-write and `fork` · mmap · swap, thrashing and the OOM killer · huge pages (and THP pauses in Redis and databases) · RSS vs VSZ, and why Go's reported memory differs (GOGC, GOMEMLIMIT) · process isolation and ASLR
- Diagrams: flowchart CPU → TLB (hit → physical address; miss → page-table walk → TLB fill) → page fault → disk; excalidraw of two processes mapping the same virtual address to different frames.

### real_cache
`bytes GO complete thimh/cache/theory/real_cache.md` · 100 lines · real 20 · depth 1 · MERGE→`08 Caching & Redis/Caching Fundamentals`
- Has: owner headings + 8 ByteByteGo frames: CDN (first vs second request), load balancer, Kafka, Redis, Elasticsearch, database-level caches.
- Problems: ~66% template, with no "Complete notes"; every explanation lives in the screenshots. Owner's "Kafka: the message can be cache[d] … based on retention" is wrong: Kafka is a durable log, not a cache. Typos "Kakfa", "lifer". `[[cache]]` and `[[API Caching with Redis|caching]]` are auto-linked inside the owner's text.
- Keep: overview screenshot 20260907025132 redrawn as mermaid. It shows where caching happens: client cache → CDN (static data) → load-balancer cache → API gateway → service CPU/RAM/disk caches → Redis (distributed cache) → Elasticsearch (indexed data) → Kafka (messages) → RDBMS WAL, buffer pool, materialized views, transaction and replication logs. Also keep the owner's point that the CDN misses the first time and hits the second.
- New home: `08 Caching & Redis/Caching Fundamentals` (section "Caching layers across a system")
- Must cover: why cache (latency, load, cost) and when not to · hit-ratio maths and its effect on p99 · layers: browser (Cache-Control), CDN, reverse proxy/LB, in-process (Go map, ristretto) vs distributed (Redis) · database internals that act as caches (buffer pool, materialized views) · cache-aside vs read-through vs write-through vs write-behind · TTL vs explicit invalidation; versioned keys · eviction (LRU, LFU, TTL) · consistency problems (stale reads; update-vs-invalidate race) · stampede, avalanche and penetration (link) · hot keys · sizing and memory cost · a multi-level example
- Diagrams: flowchart of the stack (client → CDN → LB → service local cache → Redis → DB buffer pool); sequence diagram of a cache-aside read plus the write-then-invalidate race.

---

## cloud native

### cloud native content table
`bytes GO complete thimh/cloud native/theory/cloud native content table.md` · 61 lines · real 19 · depth 0 · DELETE
- Has: 3 links (targets padded with spaces: `[[ Cloud computing ]]`, `[[Pillars of Cloud Native ]]`) and 2 ByteByteGo frames (the cloud-native pyramid and the CNCF project grid).
- Problems: nav-only; check that the space-padded link targets resolve. The CNCF frame shows the presenter's webcam.
- Keep: frame 20260907030658, the "Cloud Native Pyramid" (cloud provider → containerized compute → microservices → CI/CD-enabled DevOps); frame 20260907031431, CNCF graduated projects by category (Argo/Flux CI-CD, containerd runtime, CoreDNS/etcd discovery, Envoy proxy, Fluentd logging, Harbor registry, Helm packaging, Jaeger tracing, Kubernetes orchestration, Linkerd mesh, OPA policy, Prometheus monitoring, Rook storage), as a table.
- New home: `13 DevOps & Cloud/DevOps & Cloud MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### cloudnative
`bytes GO complete thimh/cloud native/theory/cloudnative.md` · 93 lines · real 20 · depth 1 · REWRITE
- Has: owner one-liner ("scalable and more available apps on cloud"); generated list (containers, microservices, CI/CD, observability, autoscaling, managed services).
- Problems: ~65% template. Only buzzwords, no definition. No CNCF definition, 12-factor, immutable infrastructure or declarative APIs.
- Keep: owner's idea "built to run on the cloud: scalable and highly available", expanded into the CNCF definition.
- New home: `13 DevOps & Cloud/Cloud Native and the 12-Factor App`
- Must cover: the CNCF definition (containers, service meshes, microservices, immutable infrastructure, declarative APIs) · cloud-native vs cloud-hosted ("lift and shift") · the 4 pillars (see next block) · the 12-factor app with Go examples (config from env, stateless processes, logs to stdout, graceful shutdown on SIGTERM, dev/prod parity) · immutable infrastructure and declarative desired state (the Kubernetes reconcile loop) · resilience (liveness/readiness probes, retries, circuit breakers) · observability by default (OpenTelemetry) · autoscaling (HPA, KEDA) · the CNCF landscape by category (from the screenshot) · GitOps (Argo CD, Flux) · cost and complexity, and when not to bother
- Diagrams: flowchart of the cloud-native pyramid; flowchart of the Kubernetes reconcile loop (desired vs actual state → controller → act).

### Cloud computing
`bytes GO complete thimh/cloud native/theory/Cloud computing.md` · 97 lines · real 24 · depth 2 · REWRITE
- Has: renting compute over the internet; AWS, Azure, GCP; one-liners for IaaS, PaaS and SaaS; benefits (pay-as-you-go, elasticity, managed services).
- Problems: ~60% template. The owner text is one line ("running the application on cloud") plus 2 frames. No shared-responsibility model, regions/AZs, pricing models or serverless. The diagram is a CI/CD pipeline.
- Keep: the generated IaaS/PaaS/SaaS definitions (correct); the idea of screenshot 20260907030823 (servers, desktops, platforms, apps and storage delivered over the internet to any device).
- New home: `13 DevOps & Cloud/Cloud Computing Basics`
- Must cover: NIST essentials (on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service) · IaaS / PaaS / FaaS / SaaS with AWS examples (EC2, App Runner/Beanstalk, Lambda, Gmail) · the shared-responsibility model · regions, AZs and edge locations; designing for an AZ failure · public, private, hybrid and multi-cloud · CapEx vs OpEx; on-demand vs reserved/savings plans vs spot · scalability vs elasticity · virtualization (hypervisor, VMs vs containers, Firecracker microVMs) · managed vs self-hosted (RDS vs Postgres on EC2) · cost traps (egress, NAT gateway, idle resources) · vendor lock-in
- Diagrams: a "who manages what" table for on-prem / IaaS / PaaS / SaaS; flowchart region → AZs → subnets → instances.

### Pillars of Cloud Native
`bytes GO complete thimh/cloud native/theory/Pillars of Cloud Native.md` · 82 lines · real 15 · depth 1 · MERGE→`13 DevOps & Cloud/Cloud Native and the 12-Factor App`
- Has: 5 ByteByteGo frames (the 4 pillars DevOps / open standards / microservices / containers; architecture; container example; DevOps); owner text: "containers: a light weight application which contain all the things".
- Problems: ~69% template, with no "Complete notes". The generated line "pillars are automation, resilience, observability, security, scalability" contradicts the owner's own screenshot (DevOps, cloud-native open standards, microservices, containers). The container definition is wrong: a container is an isolated process started from an image and sharing the host kernel, not "an application".
- Keep: the 4 pillars from frame 20260907030919; frame 20260907031248 (DevOps team ↔ functionality ↔ microservice ↔ many lightweight containers: each team owns a service that is deployed and scaled as containers).
- New home: same note (section "The four pillars")
- Must cover: microservices (link 16) · containers: namespaces + cgroups + image layers; container vs VM (link Docker) · DevOps and CI/CD ("you build it, you run it"; DORA metrics) · open standards (OCI image/runtime, CRI, CNI, CSI, OpenTelemetry) · service mesh and API gateway as cloud-native infrastructure · how the pillars depend on each other · GitOps · anti-pattern: a containerised monolith with manual deploys
- Diagrams: flowchart team → service → container replicas (from 20260907031248); a 2×2 of the four pillars with one example tool each.

---

## data structure

### Data structure content table
`bytes GO complete thimh/data structure/theory/Data structure content table.md` · 77 lines · real 36 · depth 0 · DELETE
- Has: links to 10 notes; a ByteByteGo overview frame mapping each structure to an everyday use.
- Problems: nav-only; "syfix tree" typo; lists "cache" as a data structure. There is no complexity table anywhere in the folder.
- Keep: screenshot 20260907023008 as a table:

  | Structure | Everyday use (per the frame) |
  |---|---|
  | list | Twitter feeds |
  | array | math operations, large data sets |
  | stack | undo/redo |
  | queue | printer jobs, user actions in games |
  | heap | task scheduling |
  | tree | HTML document, AI decisions |
  | suffix tree | searching a string in a document |
  | graph | friendship tracking, path finding |
  | R-tree | nearest neighbour |
  | hash table | caching systems |
- New home: `01 CS Fundamentals/Data Structures Overview and Big-O Cheat Sheet` (a NEW note that replaces this MOC)
- Must cover: n/a for navigation. The new overview note needs one table: structure × access/search/insert/delete (average and worst) × memory layout × Go type or package × real use.
- Diagrams: the table only.

### List
`bytes GO complete thimh/data structure/theory/List.md` · 96 lines · real 18 · depth 1 · REWRITE
- Has: array list vs linked list (fast index access vs cheap insert at a known node); owner: "used in task management, social media manager".
- Problems: ~70% template. No complexities, no singly/doubly/circular variants, no cache-locality discussion, no Go code. Stray empty bullet.
- Keep: owner's use cases (feeds, task lists); the generated array-list vs linked-list contrast.
- New home: `01 CS Fundamentals/Linked Lists`
- Must cover: nodes and pointers in memory (scattered heap allocations) · singly vs doubly vs circular · Big-O: access O(n), insert/delete at a known node O(1), search O(n) · why linked lists lose to slices in practice (cache misses, GC pressure) · Go `container/list` (doubly linked, `*Element`, `MoveToFront`; untyped `any` values) · LRU = map + doubly linked list (link 17 LLD) · sentinel/dummy nodes · reverse a list · detect a cycle (Floyd) · merge two sorted lists · middle node (slow/fast pointers) · remove the nth node from the end
- Diagrams: flowchart head → … → tail with prev/next pointers; before/after of an O(1) delete.

### array
`bytes GO complete thimh/data structure/theory/array.md` · 101 lines · real 17 · depth 1 · REWRITE
- Has: contiguous indexed storage, fast index access, slow middle insert; owner: "fixed size collection, used for image processing"; a 2-D array screenshot.
- Problems: ~72% template. The example is JavaScript in a Go vault. "Fixed size" is true only for static arrays (Go `[N]T`), not slices. No Big-O table, no amortised append, no memory layout.
- Keep: owner's points: arrays are fixed-size and good for image processing (pixels in a 2-D grid) and maths over large data sets; the 2-D array idea from screenshot 20260902152313 (one row per day: date, high, low).
- New home: `01 CS Fundamentals/Arrays and Dynamic Arrays (Go Slices)` (cross-link to the Go slices/maps internals note in 04)
- Must cover: contiguous memory; address = base + i × size, hence O(1) access · cache locality and prefetching · Big-O: access O(1), search O(n) or O(log n) if sorted, middle insert/delete O(n), append amortised O(1) · Go `[N]T` (a value; copied on assignment) vs the slice header (ptr, len, cap) · append growth (2× up to 256 elements, then ~1.25× with smoothing) · the aliasing bug when two slices share a backing array · `copy`, the full slice expression `s[a:b:c]`, and the leak from keeping a tiny sub-slice of a huge array · 2-D slices vs a flat `[]T` with row-major indexing · `slices` package (Sort/pdqsort, BinarySearch, Insert, Delete) · two pointers · sliding window · prefix sums · Kadane · binary search on the answer
- Diagrams: flowchart of a slice header pointing into its backing array, then an append past cap that copies into a new array; row-major layout of a 2-D grid.

### cache
`bytes GO complete thimh/data structure/theory/cache.md` · 90 lines · real 17 · depth 1 · SPLIT
- Has: a generated eviction list (LRU, LFU, FIFO), memoization and use cases; the owner's single frame shows CPU ↔ CPU cache ↔ RAM.
- Problems: in the wrong folder: a cache is not a data structure (an LRU cache is built from a hash map + a doubly linked list). The screenshot (hardware CPU cache) and the generated text (software eviction) describe different things. Every plain `[[cache]]` link in the vault resolves here, so the DNS, Kafka, L1, SRAM and Memory notes all point to it. The frame shows the presenter's webcam.
- Keep: the generated eviction list (LRU, LFU, FIFO) and the memoization idea; the CPU-cache frame as a source for the memory-hierarchy diagram.
- New home: CPU cache → `01 CS Fundamentals/Memory Hierarchy and CPU Caches`; eviction/LRU → `08 Caching & Redis/Cache Eviction Policies - LRU, LFU, TTL` and the existing `LLD with Go/practice/LRU Cache LLD in Go.md`
- Must cover (eviction note): LRU (map + DLL, O(1) get/put) · LFU (frequency buckets; the O(1) variant) · FIFO, random, ARC, 2Q · TinyLFU-based caches (Ristretto, Caffeine) · TTL expiry (lazy vs active; Redis sampling) · Redis `maxmemory-policy` (allkeys-lru, volatile-ttl, approximate LRU by sampling) · memoization vs caching · concurrency (sharded locks, where `sync.Map` fits) · measuring hit ratio
- Diagrams: flowchart of the LRU structure (map entries pointing into a doubly linked list, most recent at the head); sequence diagram of get → move-to-front and put → evict the tail.

### graph
`bytes GO complete thimh/data structure/theory/graph.md` · 103 lines · real 22 · depth 1 · REWRITE
- Has: nodes and edges; directed, undirected and weighted graphs; examples (maps, social networks, computer networks); BFS, DFS and Dijkstra named; 2 frames.
- Problems: ~66% template. Algorithms are only named. No representations, complexities or code.
- Keep: owner's points: graphs track relationships and are used in recommendation engines; the overview frame adds friendship tracking and path finding.
- New home: `01 CS Fundamentals/Graphs and Graph Algorithms`
- Must cover: terms (vertex, edge, degree, path, cycle, DAG, connected component) · adjacency list vs matrix vs edge list, space O(V+E) vs O(V²) · Go: `map[int][]int` or `[][]int` · BFS (unweighted shortest path, O(V+E)) · DFS (recursive and iterative, cycle detection) · topological sort with Kahn's algorithm (build systems, dependency resolution, migration order) · Dijkstra with `container/heap`, O((V+E) log V) · Bellman-Ford (negative edges) and A* · union-find, Kruskal MST · real systems: social graph (Facebook TAO), map routing, service dependency graphs, deadlock detection via wait-for cycles, Go GC's tri-color marking · graph DBs (Neo4j) vs adjacency tables in SQL · problems: number of islands, course schedule, clone graph, network delay time, word ladder
- Diagrams: a small weighted graph (flowchart LR with edge weights) next to its adjacency list; a step table of Dijkstra on it.

### hash table
`bytes GO complete thimh/data structure/theory/hash table.md` · 114 lines · real 25 · depth 2 · REWRITE
- Has: key-value storage; a hash function maps the key to an index; collisions via chaining or open addressing; an average-case O(1) table screenshot; use cases.
- Problems: ~64% template. The example is a JS object literal, which V8 doesn't store as a plain hash table (use `Map`, or `map[K]V` in Go). Owner's "used for insertion and deletion" misses the point (O(1) average lookup by key). Only the average case is shown; worst case O(n) is missing. No load factor or resizing. The diagram is the generic DS chooser, not buckets.
- Keep: owner's use cases (search engines, caching systems; matches the overview frame "hash table → caching systems"); screenshot 20260902154325 as a table (space O(n); search/insert/delete O(1) average) plus a worst-case column.
- New home: `01 CS Fundamentals/Hash Tables and Go Maps` (cross-link to Go maps internals in 04)
- Must cover: hash function properties (deterministic, uniform, fast; not cryptographic) · buckets; index = hash mod m · separate chaining vs open addressing (linear/quadratic probing, Robin Hood) · load factor and resize/rehash (amortised O(1)) · worst case O(n), hash flooding, and per-map random seeds in Go · Go map internals: before 1.24, 8-slot buckets with tophash bytes, overflow buckets and incremental growth at load factor 6.5; Go 1.24+ Swiss Tables · Go map rules: random iteration order; concurrent writes crash the program (fatal error) → mutex, sharding or `sync.Map`; map values aren't addressable; writing to a nil map panics; the `maps` package · sets as `map[T]struct{}` · Java HashMap treeification as contrast · mod-N vs consistent hashing (link 07) · Bloom filter as a probabilistic set · problems: two-sum, group anagrams, subarray sum = k, longest consecutive sequence, LRU
- Diagrams: flowchart key → hash → bucket index → bucket array with one chained collision; before/after diagram of a resize.

### heaps
`bytes GO complete thimh/data structure/theory/heaps.md` · 102 lines · real 18 · depth 1 · REWRITE
- Has: min and max heaps; "not fully sorted"; use cases (priority queue, scheduling, top-K, Dijkstra); a screenshot of a priority tree.
- Problems: ~71% template. Owner's "used for … memory management" confuses the heap data structure with heap memory; they are unrelated, and the source slide says only "task scheduling". No array layout, sift-up/down, complexities or `container/heap`. "priority queue" is auto-linked to `[[Message Queue with Redis]]`.
- Keep: owner's "task management/scheduling" use; screenshot 20260902152656 (min-heap 10 → 20, 80 → 40, 60, 85, 99 → 50, 76, 65, with priority/value labels) redrawn as the worked example.
- New home: `01 CS Fundamentals/Heaps and Priority Queues`
- Must cover: a complete binary tree stored in an array (children 2i+1 and 2i+2, parent (i−1)/2) · min vs max heap property · push = append + sift-up O(log n); pop = swap root with last + sift-down O(log n); peek O(1) · heapify in O(n) · heapsort · Go `container/heap` (implement Len/Less/Swap/Push/Pop; `heap.Fix` to change a priority) · top-K with a size-K min-heap, O(n log k) · k-way merge (k sorted lists or log files) · running median with two heaps · the Dijkstra/A* frontier · schedulers and timers (Go's runtime keeps timers in a per-P 4-ary heap; delayed-job queues) · "heap" the structure ≠ heap memory · problems: kth largest, top-K frequent, meeting rooms II, task scheduler
- Diagrams: the same min-heap drawn as a tree and as its array; step-by-step sift-down after a pop.

### queue
`bytes GO complete thimh/data structure/theory/queue.md` · 105 lines · real 22 · depth 1 · MERGE→`01 CS Fundamentals/Stacks, Queues and Deques`
- Has: FIFO; enqueue, dequeue, front; the ticket-line analogy; use cases (printer, scheduling, message queues, BFS); 2 chat-app frames.
- Problems: ~66% template. The data-structure queue is auto-linked to `[[Message Queue with Redis]]`, which confuses the in-memory structure with a message broker. No implementation or complexities.
- Keep: owner's "FIFO; used in chat applications for sending messages (in order)"; the ticket-line analogy.
- New home: `01 CS Fundamentals/Stacks, Queues and Deques` (section "Queues")
- Must cover: FIFO semantics, O(1) enqueue/dequeue · slice with a head index, ring buffer (circular array, index mod capacity), linked list · Go pitfall: `q = q[1:]` never frees the backing array; use a ring buffer or compact periodically · buffered channels as a bounded concurrent FIFO and natural backpressure · `container/ring` · deques and the monotonic deque (sliding-window max) · queue vs priority queue · in-memory queue vs durable message queue (persistence, acks, redelivery; link 09) · BFS level order · problems: queue from two stacks, sliding-window maximum, rotting oranges
- Diagrams: excalidraw ring buffer with head/tail indices wrapping around; flowchart producer → buffered channel → consumer.

### stack
`bytes GO complete thimh/data structure/theory/stack.md` · 100 lines · real 19 · depth 1 · MERGE→`01 CS Fundamentals/Stacks, Queues and Deques`
- Has: LIFO; push, pop, peek; the plates analogy; uses (undo/redo, browser history, call stack, parentheses); 1 frame.
- Problems: ~69% template. No implementation, no complexities, no call-stack or stack-overflow mechanics.
- Keep: owner's "LIFO; used for undo/redo" (implemented as two stacks: undo and redo).
- New home: same note (section "Stacks")
- Must cover: LIFO, O(1) push/pop/peek · Go slice stack (`append`; read `s[len(s)-1]`; `s = s[:len(s)-1]`; nil out popped pointers so the GC can free them) · undo/redo with two stacks · the call stack, frames, recursion depth and stack overflow · goroutine stacks (start at 2 KB, grow by copying) vs OS thread stacks (~8 MB) · iterative DFS with an explicit stack · expression evaluation (shunting-yard, RPN) · monotonic stack (next greater element, daily temperatures, largest rectangle in a histogram) · valid parentheses · browser back/forward as two stacks
- Diagrams: flowchart of undo/redo with two stacks across 3 edits; call-stack frames for a recursive factorial.

### sufux tree
`bytes GO complete thimh/data structure/theory/sufux tree.md` · 105 lines · real 24 · depth 1 · REWRITE
- Has: a suffix tree stores all suffixes; the "banana" suffix list; use cases (text search, DNA, repeated substrings); a suffix-tree frame for "bytebytego$".
- Problems: ~64% template; title typo "sufux". Owner's "used for text editors" is inaccurate: editors use ropes or piece tables, and search engines use inverted indexes. No construction cost, no suffix arrays, no tries.
- Keep: the "banana" suffix example; screenshot 20260902154523 (suffix tree of "bytebytego$"), redrawn small.
- New home: `01 CS Fundamentals/Tries, Suffix Trees and Suffix Arrays`
- Must cover: trie (prefix tree) for autocomplete · radix/compressed trie (Go HTTP routers such as httprouter and chi; IP routing tables) · suffix tree with the `$` terminator · naive O(n²) vs Ukkonen O(n) construction · substring search in O(m) · longest repeated and longest common substring · suffix array + LCP array as the practical alternative · Go `index/suffixarray` (New, Lookup, FindAllIndex) · real uses: genome alignment (BWT/FM-index in BWA, Bowtie), plagiarism detection, compression · why full-text search uses inverted indexes instead (link the search notes) · problems: implement a trie, word search II, longest common prefix
- Diagrams: a trie for {go, gopher, golang}; the suffix tree of "banana$" (flowchart TD with edge labels).

### tree
`bytes GO complete thimh/data structure/theory/tree.md` · 106 lines · real 24 · depth 1 · REWRITE
- Has: root, parent, child, leaf, height; binary tree, BST, heap, trie; uses (folders, the DOM, search and DB indexes); 3 frames.
- Problems: ~64% template. No BST operations, balancing, traversals or complexity. The "ml in clasificaution" screenshot (20260902154232) is a TensorFlow Playground neural network, not a tree; drop it.
- Keep: owner's "trees model hierarchy"; "used in ML classification" is true only for decision trees, random forests and gradient-boosted trees; the overview frame's "tree → HTML document".
- New home: `01 CS Fundamentals/Trees, BSTs and Balanced Trees` (cross-link to the B+tree index notes in 07)
- Must cover: terms (depth, height, degree, subtree) · traversals: pre/in/post-order (recursive and iterative) and level order · BST search/insert/delete in O(h); degenerate case O(n) · AVL vs red-black trees (rotations; used by the Linux scheduler, Java TreeMap, C++ std::map) · B-trees/B+trees (high fan-out, disk pages, range scans; InnoDB and Postgres indexes) · LSM-tree vs B-tree (link 07) · tries and heaps as specialised trees · Go has no stdlib ordered map → `google/btree`, or a sorted slice + binary search · real uses: file systems, the DOM, ASTs (`go/ast`), decision trees, interval trees · problems: max depth, validate BST, lowest common ancestor, serialize/deserialize, kth smallest in a BST
- Diagrams: a BST with its in-order traversal sequence; a B+tree with internal keys and linked leaf pages.

---

## js

> Shared problems in all JS notes:
> - The code is copied from the Chai aur Code (Hitesh Choudhary) JavaScript series ("hitesh", "chai", "shaktiman/naagraj").
> - It is unfenced and unindented, and a formatter mangled bold markers (`- *Merged Array**`).
> - Every note carries the same event-loop mermaid, which has no microtask queue.

### JS Content
`bytes GO complete thimh/js/theory/JS Content.md` · 75 lines · real 35 · depth 0 · DELETE
- Has: links to 11 JS notes; generated "Must know" (JS runs in the browser and in Node; event-driven).
- Problems: nav-only; the study order omits the primitive-types note.
- Keep: nothing.
- New home: `03 Frontend/Frontend MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### variables
`bytes GO complete thimh/js/theory/variables.md` · 106 lines · real 30 · depth 1 · MERGE→`03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`
- Has: const/let/var declarations; a list of primitive types; `typeof null`; `==` vs `===`; comparisons with undefined.
- Problems: ~57% template. The heading "default values" actually lists types. "number => 2 to power 53" → Number is an IEEE-754 double, and integers are exact only up to 2^53 − 1. `accountCity = "Jaipur"` creates an implicit global (an error in strict mode) without comment. No explanation of let/const/var scope or the TDZ.
- Keep: owner's points, corrected:
  - `const` can't be reassigned; `let` is block-scoped; avoid `var`.
  - `typeof null === "object"` is a historic bug.
  - `3 == "3"` is true (coercion); `3 === "3"` is false.
  - `undefined == 0`, `undefined > 0` and `undefined < 0` are all false.
- New home: same note (section "Variables & types")
- Must cover: var vs let vs const (scope, redeclare, reassign, hoisting/TDZ) · `const` objects (the binding is fixed, the object can still change) · the 7 primitives + object · `typeof` quirks (null, function, NaN) · Number as float64, `MAX_SAFE_INTEGER`, BigInt · the `==` coercion table, including `null >= 0` true while `null == 0` false · strict mode and implicit globals · naming and `const` by default
- Diagrams: table var/let/const × scope / hoisting / TDZ / reassign / redeclare.

### strings
`bytes GO complete thimh/js/theory/strings.md` · 104 lines · real 22 · depth 2 · MERGE→`03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`
- Has: template literals; useful string methods; strings are immutable.
- Problems: ~65% template. The owner part is one template-literal example. Nothing on UTF-16 length gotchas.
- Keep: template literal `${}` interpolation (owner); the generated methods list.
- New home: same note (section "Strings")
- Must cover: literals and template literals (multi-line, tagged) · immutability · common methods (slice vs substring, split/join, includes, padStart, replaceAll, trim) · UTF-16 code units: `"😀".length === 2`; iterate with `for…of` · comparison, `localeCompare` and `Intl` · string ↔ number conversion (`Number()`, `parseInt` with a radix) · building strings (`join` vs `+=`) · contrast with Go (immutable bytes, runes, `len` counts bytes)
- Diagrams: none.

### Promitive_non_Primitive_Types
`bytes GO complete thimh/js/theory/Promitive_non_Primitive_Types.md` · 96 lines · real 25 · depth 1 · MERGE→`03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`
- Has: examples of primitives (number, boolean, null, undefined, symbol, bigint) and reference types (array, object, function).
- Problems: ~59% template; title typo "Promitive". Code only: it never states the key difference (copy by value vs sharing a reference). The primitive examples don't include a string.
- Keep: owner's example `Symbol('123') === Symbol('123')` → false (every symbol is unique); arrays, objects and functions are reference types.
- New home: same note (section "Value vs reference")
- Must cover: the 7 primitive types · objects, arrays and functions as references · assignment and argument passing copy the value (for objects, the reference) · mutation through a shared reference · object equality is identity · shallow copy (spread, `Object.assign`) vs deep copy (`structuredClone`) · `Object.freeze` is shallow · autoboxing (`"a".toUpperCase()`) · Symbol uses (unique keys; well-known symbols like `Symbol.iterator`)
- Diagrams: excalidraw of two variables pointing to one object vs two independent copied primitives.

### Arrays
`bytes GO complete thimh/js/theory/Arrays.md` · 99 lines · real 20 · depth 1 · MERGE→`03 Frontend/JavaScript Objects, Arrays and Iteration`
- Has: array creation, push/pop, unshift/shift, merging with spread, flattening nested arrays with `flat(Infinity)`.
- Problems: ~67% template. Unfenced code with broken markers ("/ myArr.unshift(9)", "- *Merged Array**"). No costs (shift/unshift are O(n)) and no mutating vs non-mutating split.
- Keep: owner's examples: `push/pop` (end), `unshift/shift` (front), `[...a, ...b]` to merge, `arr.flat(Infinity)` to flatten nested arrays.
- New home: same note (section "Arrays")
- Must cover: creating arrays (`[]`, `Array.from`, the `new Array(n)` pitfall) · mutating methods (push, pop, shift, unshift, splice, sort, reverse) vs non-mutating ones (slice, concat, map, filter; ES2023 toSorted/toSpliced) · costs: push/pop O(1), shift/unshift O(n) · default `sort()` is lexicographic (`[10,2,1].sort()` → `[1,10,2]`); pass a comparator · searching (indexOf, includes, find, findIndex, `at(-1)`) · flat/flatMap · destructuring and spread · sparse arrays and holes
- Diagrams: table of methods: mutates? returns what? cost.

### Objects
`bytes GO complete thimh/js/theory/Objects.md` · 131 lines · real 50 · depth 2 · MERGE→`03 Frontend/JavaScript Objects, Arrays and Iteration`
- Has: object literals, dot vs bracket access, methods, `this` in methods, building an empty object, nested objects, merging with spread.
- Problems: ~44% template; unfenced code. The symbol key `Mysym:mykey` is wrong: it should be `[mySym]: "mykey"` with `const mySym = Symbol("key1")`. `console.log(JsUser.greeting())` prints `undefined` after the greeting, unexplained. No prototypes, `Object.keys/entries`, destructuring, or Map vs Object.
- Keep: dot vs bracket notation (brackets are needed for keys with spaces like `"full name"` and for symbol keys); a method using `this.name`; nested access; `{...obj1, ...obj2}` merges, with later keys winning.
- New home: same note (section "Objects")
- Must cover: literals, computed keys, shorthand · property access, optional chaining `?.`, nullish `??` · methods and `this` · iterating (`Object.keys/values/entries`; `for…in` + an own-property check) · destructuring with defaults and renames · spread merge and shallow copy · prototypes and `class` as syntax sugar · `Object.freeze`, getters/setters · Map/Set vs plain objects (key types, order, size, performance) · JSON.stringify/parse limits (dates, undefined, BigInt)
- Diagrams: prototype-chain flowchart (obj → Constructor.prototype → Object.prototype → null).

### Loops
`bytes GO complete thimh/js/theory/Loops.md` · 166 lines · real 68 · depth 2 · MERGE→`03 Frontend/JavaScript Objects, Arrays and Iteration`
- Has: for, while, do-while, for…of (array, Map, an attempt on an object), for…in, forEach.
- Problems: ~38% template. Unfenced code, mostly commented-out lines. `while (arr < myArray.length)` uses an undeclared counter. The `for…of` over a plain object is commented out without saying it throws a TypeError (plain objects aren't iterable). No break/continue, and doesn't say that forEach can't break or await.
- Keep: owner's catalogue: for, while and do-while; `for…of` over arrays and `for (const [k, v] of map)` over Maps; `for…in` over object keys; forEach with callbacks. A Map keeps unique keys (setting 'IN' twice keeps one entry).
- New home: same note (section "Iteration")
- Must cover: for / while / do-while · for…of (iterables: arrays, strings, Map, Set) vs for…in (enumerable keys, including inherited ones) · iterating objects via `Object.entries` · forEach limits (no break; ignores await) · break, continue, labels · async iteration (`for await…of`; sequential awaits in a loop vs `Promise.all`) · the iterator protocol (`Symbol.iterator`, generators) · closures in loops (`var` vs `let` capture bug)
- Diagrams: table loop × works on × can break × awaits correctly.

### filters
`bytes GO complete thimh/js/theory/filters.md` · 122 lines · real 47 · depth 2 · MERGE→`03 Frontend/JavaScript Objects, Arrays and Iteration`
- Has: filter (numbers; books by genre), map chaining, reduce (sum; cart total).
- Problems: ~45% template. Titled "filters" but also covers map and reduce. Unfenced code. Typo `myNumers`, and `const myNums` is declared twice (a SyntaxError in one scope). Heading "Reduse".
- Keep: owner's line "a loop only iterates; filter returns just the matching items"; the book-genre filter; the shopping-cart `reduce((acc, item) => acc + item.price, 0)`.
- New home: same note (section "map / filter / reduce")
- Must cover: map vs forEach (map returns a new array) · filter predicates · reduce with an initial value (and the TypeError on an empty array without one) · chaining vs a single pass · find, some, every, flatMap · no mutation of the input · each chain step allocates a new array · Go equivalents (plain loops; `slices` helpers)
- Diagrams: flowchart [1..10] → map(×10) → map(+1) → filter(≥40), showing each intermediate array.

### functions
`bytes GO complete thimh/js/theory/functions.md` · 126 lines · real 41 · depth 2 · MERGE→`03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`
- Has: function declarations, function expressions, arrow functions (implicit return), IIFEs (named and arrow).
- Problems: ~49% template; unfenced code.
  - "const a = function(){…} … so this is a named function" is wrong: it's an anonymous function expression stored in a variable.
  - "if we are not using a bracket we do not require return" means curly braces; the implicit return works only for an expression body, and returning an object literal needs parentheses.
  - The arrow `console.log(this)` example never explains lexical `this`.
  - The first example has an unreachable second `return`.
- Keep: owner's forms: a declaration; an expression stored in a variable; an arrow `(a, b) => a + b` with implicit return; an IIFE `(function(){…})()` that runs immediately (one-time setup, private scope).
- New home: same note (section "Functions")
- Must cover: declaration vs expression vs arrow (hoisting differs) · default and rest parameters; no `arguments` in arrows · first-class functions, callbacks, higher-order functions · `this`: default, implicit, explicit (call/apply/bind), `new`, arrow (lexical) · closures (counter, memoize, module pattern) · IIFEs and why ES modules replaced them · pure functions and side effects · currying/partial application (brief) · recursion and the call stack
- Diagrams: decision flowchart for what `this` refers to (arrow? `new`? call/bind? method call? default).

### scope
`bytes GO complete thimh/js/theory/scope.md` · 96 lines · real 26 · depth 1 · MERGE→`03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this` (this block carries the merged note's outline)
- Has: a nested-function scope example; a hoisting example with a function declaration and a const function expression.
- Problems: ~59% template. "addTwo(5); const addTwo = function… so this will work because of hoisting" is wrong: it throws a ReferenceError (TDZ); only `addone` (a declaration) works. Typo `console.log(h)l`. No block scope, closures or scope chain.
- Keep: owner's example, corrected:
  - inner `two()` can read outer `h`, but `one()` can't read inner `w`.
  - `addone(5)` works before its declaration, because function declarations are hoisted with their body.
  - calling `addTwo` before `const addTwo = function…` throws.
- New home: `03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this`
- Must cover: engine basics (single thread, call stack, heap; V8 JIT in one line) · types and value vs reference · var/let/const · global, function, block and module scope · lexical scoping and the scope chain · hoisting: var (undefined), let/const/class (TDZ), function declarations (whole body) · closures with real uses (counter, memoize, privacy) and the loop-capture bug · `this` binding rules · strict mode · GC basics and closure memory leaks · equality and coercion pitfalls
- Diagrams: flowchart of nested scopes (global → one() → two()) with lookup arrows; a hoisting-behaviour table.

### Dom
`bytes GO complete thimh/js/theory/Dom.md` · 90 lines · real 17 · depth 1 · REWRITE
- Has: querySelector; a click listener that removes clicked images using event delegation; setTimeout and setInterval.
- Problems: ~70% template. "setInterval(sayDate, 1000, "hi") will run after 1 sec" is wrong: it repeats every second until `clearInterval`. The listener is missing its closing `})`. Never says the example is event delegation. The event-loop diagram isn't tied to timers.
- Keep: owner's delegation example (one listener on `#images`; `if (e.target.tagName === 'IMG') e.target.parentNode.remove()`); `setTimeout(fn, 2000)` runs once after at least 2 s.
- New home: `03 Frontend/DOM, Events and Timers`
- Must cover: the DOM tree and node types · selecting (getElementById, querySelector/All; live vs static NodeList) · creating and updating nodes (`textContent` vs `innerHTML` and XSS) · batching DOM writes to avoid layout thrashing · event flow (capture → target → bubble; `stopPropagation`, `preventDefault`) · event delegation (the owner's example) · passive listeners and removing listeners · timers (setTimeout/setInterval, minimum delays, clearing them) · requestAnimationFrame · MutationObserver and IntersectionObserver
- Diagrams: flowchart of a click capturing down to the IMG and bubbling up to `#images`.

### Promises
`bytes GO complete thimh/js/theory/Promises.md` · 189 lines · real 94 · depth 2 · POLISH
- Has: 7 examples: create/consume; resolve with data; reject + catch + finally; then-chaining; async/await with try/catch; fetch with async/await; fetch with then.
- Problems: ~31% template; unfenced code. "There are different types of Promises" is wrong: these are different ways to create or consume the same Promise. "resolve means correct and true, reject means false or wrong" → resolve fulfils with a value; reject settles with a reason (usually an Error). The fetch URL in the code was mangled by the auto-linker. No event loop or microtasks, no combinators, no state diagram.
- Keep: all 7 examples (fence them, fix the URL); owner's notes, corrected:
  - `.then` runs when the promise fulfils.
  - a value returned from `.then` is passed to the next `.then`.
  - `finally` runs either way.
  - `await` inside try/catch turns a rejection into a thrown error.
- New home: `03 Frontend/JavaScript Async - Event Loop, Promises, async-await` (absorbs async_await and the timer part of Dom)
- Must cover: why async in a single-threaded runtime · the event loop: call stack, Web APIs/libuv, task queue, microtask queue, rendering steps · states pending → fulfilled/rejected (settles once) · creating promises and promisifying callbacks · chaining, returning promises from then, error propagation · catch/finally · combinators all, allSettled, race, any (with timeouts) · async/await and the sequential-vs-parallel pitfall · fetch gotchas (no rejection on 4xx/5xx; AbortController; timeouts) · unhandled rejections · ordering puzzles (setTimeout vs Promise.then vs queueMicrotask) · comparison with Go goroutines and channels
- Diagrams: state diagram of a Promise; sequence diagram of the event loop running sync code → draining microtasks → next task, for a classic ordering puzzle.

---

## memory and storage

> Shared problems in all memory and storage notes:
> - The owner text is 2–9 lines of definitions.
> - The generated "Complete notes" are correct but shallow.
> - The same CPU→cache→RAM→disk mermaid appears in all 12 notes, including BIOS and Firmware.
> - Nothing connects the hardware to what a backend engineer does with it (buffer pools, fsync, OOM kills, instance sizing).

### MEMORY AND STORAGE Content table
`bytes GO complete thimh/memory and storage/theory/MEMORY AND STORAGE Content table.md` · 65 lines · real 25 · depth 0 · DELETE
- Has: 2 links; a generated topic map; "memory is fast and temporary, storage is slow and permanent".
- Problems: nav-only. The link `[[Storages ]]` has a trailing space. Typos "Types o f", "Types od".
- Keep: nothing.
- New home: `01 CS Fundamentals/CS Fundamentals MOC`
- Must cover: n/a (navigation).
- Diagrams: none.

### Memory
`bytes GO complete thimh/memory and storage/theory/Memory.md` · 88 lines · real 14 · depth 1 · MERGE→`01 CS Fundamentals/Memory Hierarchy and CPU Caches`
- Has: owner list (RAM, ROM); generated registers → cache → RAM → virtual memory, and memory vs storage.
- Problems: ~74% template. "Virtual memory uses storage as extra memory when RAM is not enough" describes swapping, not virtual memory (per-process address translation via page tables and the MMU). `[[cache]]` points to the data-structure note. No sizes or latencies.
- Keep: the hierarchy order registers → caches → RAM → storage; "memory is fast and volatile; storage is slower and persistent".
- New home: `01 CS Fundamentals/Memory Hierarchy and CPU Caches` (intro sections)
- Must cover: the pyramid trade-off (speed vs capacity vs cost per GB) · volatile vs non-volatile · registers · what "loading a program into memory" means · memory-bound vs CPU-bound code · typical sizes and latencies for each level · plus the CPU-cache outline in the "type of cache" block (same target note) · where virtual memory fits (link to its own note)
- Diagrams: pyramid/flowchart registers → L1 → L2 → L3 → DRAM → SSD → HDD → network, with size and latency at each level.

### RAM
`bytes GO complete thimh/memory and storage/theory/RAM.md` · 93 lines · real 19 · depth 1 · MERGE→`01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Has: RAM is volatile working memory; more RAM helps multitasking; the types are SRAM and DRAM.
- Problems: ~67% template. "it is deleted when the system is closed" → it is lost when power is removed. Doesn't explain what "random access" means.
- Keep: owner's points, corrected: RAM holds running programs' data temporarily, is volatile, and comes as SRAM or DRAM.
- New home: `01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Must cover: "random access" means any address in about constant time · SRAM cell (6 transistors, no refresh) vs DRAM cell (1 transistor + 1 capacitor, refreshed every ~64 ms) · the density/cost/speed trade-off and where each is used · DRAM organisation (channels, ranks, banks, rows; row-buffer hits) · SDRAM → DDR1–5 (double data rate, prefetch growth, MT/s vs MHz; DDR5 has two 32-bit sub-channels and on-die ECC) · ECC RAM in servers · GDDR (GPU, wide bus, bandwidth over latency) vs HBM (3D-stacked, AI accelerators) · bandwidth vs latency · capacity planning for services (Go heap, GOMEMLIMIT, container memory limits, OOM kills)
- Diagrams: excalidraw of SRAM vs DRAM cells; flowchart memory controller → channels → DIMMs → banks.

### SRAM
`bytes GO complete thimh/memory and storage/theory/SRAM.md` · 92 lines · real 16 · depth 1 · MERGE→`01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Has: SRAM is static and fast, used for CPU caches, needs no refresh, and is expensive and large per bit.
- Problems: ~71% template. The owner text "cpu `[[API Caching with Redis|caching]]`" links CPU caching to the Redis API-caching note. Doesn't show the cell structure.
- Keep: owner's points: SRAM is static, faster than DRAM, used where access time matters, i.e. CPU caches.
- New home: same note (section "SRAM")
- Must cover: the 6T bistable cell and why it needs no refresh · speed, and why it costs more (area per bit) · on-die uses: L1–L3 caches, register files, TLBs · power and leakage · why caches can't just be bigger (latency grows with size) · SRAM vs DRAM comparison table · variations (eDRAM, AMD 3D V-Cache) · where SRAM sits in the hierarchy
- Diagrams: table SRAM vs DRAM (cell, refresh, speed, density, cost, use).

### DRAM
`bytes GO complete thimh/memory and storage/theory/DRAM.md` · 100 lines · real 20 · depth 2 · MERGE→`01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Has: capacitor-based; needs refresh; cheaper, denser and slower than SRAM; used as main memory; owner list of DRAM types.
- Problems: ~67% template. The owner list has link-stripping debris ("FPM DRAMFPM DRAM", "EDO DRAMEDO DRAM", "SDRAMSDRAM"). Typo "Ramdon". "GDDRM SDRM" → GDDR SDRAM, and its link `[[ GDDRM SDRM]]` has a leading space.
- Keep: owner's lineage, corrected: FPM DRAM → EDO DRAM (both obsolete) → SDRAM → DDR SDRAM → GDDR SDRAM (graphics); "needs constant refresh; slower and cheaper than SRAM".
- New home: same note (section "DRAM")
- Must cover: the 1T1C cell and charge leakage · refresh cycles and their cost · row/column addressing and CAS latency (CL) · asynchronous (FPM, EDO) vs synchronous DRAM · banks and row-buffer locality · DRAM latency (~80–100 ns) vs bandwidth (tens of GB/s) · Rowhammer · where DRAM sits in the latency table
- Diagrams: timeline of generations FPM → EDO → SDRAM → DDR1–5.

### DDR SDRAM
`bytes GO complete thimh/memory and storage/theory/DDR SDRAM.md` · 87 lines · real 14 · depth 1 · MERGE→`01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Has: DDR = double data rate (two transfers per clock cycle); versions DDR3, DDR4, DDR5.
- Problems: ~74% template. Owner list "DDR$" (→ DDR4) starts at DDR4. No numbers (MT/s, voltage), no ECC.
- Keep: owner's list, corrected: DDR4, DDR5.
- New home: same note (section "DDR generations")
- Must cover: transfers on both the rising and falling clock edge · prefetch buffer growth (2n → 16n) · data rates and voltages (DDR4 1.2 V, up to ~3200 MT/s; DDR5 1.1 V, 4800–8800 MT/s) · DDR5 changes (two sub-channels, on-die ECC, PMIC on the DIMM) · LPDDR in laptops and phones · dual/quad-channel bandwidth · ECC vs non-ECC · why bandwidth matters for servers (databases, analytics)
- Diagrams: table generation × rate × voltage × notable change.

### GDDRM SDRM
`bytes GO complete thimh/memory and storage/theory/GDDRM SDRM.md` · 91 lines · real 15 · depth 1 · MERGE→`01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM`
- Has: GDDR = graphics DDR for GPUs, high bandwidth; GDDR5, 6, 6X; how it differs from DDR.
- Problems: ~73% template; title typo (→ GDDR SDRAM). Owner's "the fasted DRAM" → GDDR trades latency for bandwidth, and HBM gives more total bandwidth. No HBM.
- Keep: owner's "used by the GPU for processing" (graphics memory, VRAM).
- New home: same note (section "GDDR and HBM")
- Must cover: why GPUs need bandwidth (thousands of parallel cores) · GDDR: wide bus, high per-pin rate, soldered next to the GPU · GDDR6/6X/7 (PAM4 and PAM3 signalling) · higher latency than DDR · HBM: 3D-stacked dies, TSVs, a 1024-bit interface per stack, used in AI accelerators (H100/H200) · bandwidth numbers vs DDR · VRAM capacity as the limit for serving LLMs (link 18) · why this matters for ML inference cost
- Diagrams: excalidraw comparing DDR DIMMs vs GDDR chips around a GPU vs HBM stacks on an interposer.

### ROM
`bytes GO complete thimh/memory and storage/theory/ROM.md` · 99 lines · real 21 · depth 1 · MERGE→`01 CS Fundamentals/ROM, Flash, Firmware and the Boot Process`
- Has: ROM is non-volatile and stores boot instructions and firmware; RAM vs ROM.
- Problems: ~66% template. Owner's "Types of ROM: Firewares, BIOS" is wrong: firmware and the BIOS are software stored in ROM/flash. The actual ROM types are mask ROM, PROM, EPROM, EEPROM and flash. "so it is storage thing" blurs ROM with secondary storage. Stray empty bullet.
- Keep: owner's points, corrected: ROM is read-only memory, non-volatile (survives power-off), and holds firmware such as the BIOS/UEFI.
- New home: `01 CS Fundamentals/ROM, Flash, Firmware and the Boot Process`
- Must cover: volatile vs non-volatile · the ROM family: mask ROM, PROM, EPROM (UV-erasable), EEPROM, NOR flash, NAND flash · why modern "ROM" is rewritable flash (SPI NOR holds firmware) · what firmware is, with examples (BIOS/UEFI, SSD controller, NIC, BMC, CPU microcode) · firmware updates and the bricking risk · the boot sequence: power-on → firmware POST → bootloader (GRUB, systemd-boot) → kernel → init/systemd → services · BIOS + MBR vs UEFI + GPT; Secure Boot · server extras (BMC/IPMI, PXE network boot) · cloud: instances boot under a hypervisor (EC2 Nitro); cold-start implications
- Diagrams: flowchart of the boot sequence from power-on to a Go service starting under systemd.

### Firewares
`bytes GO complete thimh/memory and storage/theory/Firewares.md` · 89 lines · real 15 · depth 1 · MERGE→`01 CS Fundamentals/ROM, Flash, Firmware and the Boot Process`
- Has: firmware = low-level software inside hardware devices; examples (router, keyboard, BIOS/UEFI, SSD, phone); updates can fix bugs or brick a device.
- Problems: ~73% template; title typo (→ Firmware). Owner's "it controls how hardware devices control rom" is garbled. The generated "before normal software controls it" ignores firmware that runs all the time (SSD and NIC controllers).
- Keep: the generated example list and the update caution, both correct.
- New home: same note (section "Firmware")
- Must cover: where firmware lives (SPI flash/EEPROM) · it runs on the device's own microcontroller · BIOS/UEFI is the PC's firmware · update mechanisms (UEFI capsules, fwupd) · signed firmware and firmware rootkits · CPU microcode updates (Spectre/Meltdown) · SSD firmware runs the FTL and shapes SSD performance · in the cloud the provider handles it (Nitro)
- Diagrams: none beyond the boot flowchart in the ROM block.

### BIOS
`bytes GO complete thimh/memory and storage/theory/BIOS.md` · 92 lines · real 17 · depth 2 · MERGE→`01 CS Fundamentals/ROM, Flash, Firmware and the Boot Process`
- Has: what BIOS means; POST; finding the boot device; starting the OS boot; UEFI as the modern replacement.
- Problems: ~70% template. Owner's "starting power to computer" is wrong: the power supply powers the machine and the BIOS runs after power-on. "providing a control to operating system" happens through the bootloader.
- Keep: owner's points, corrected: BIOS = Basic Input/Output System, the first code the CPU runs at power-on. It tests and initialises the hardware (POST) and hands control to the bootloader, which loads the OS.
- New home: same note (section "BIOS vs UEFI")
- Must cover: POST steps · boot order · legacy BIOS limits (16-bit real mode; MBR up to 2 TB, 4 primary partitions) · UEFI features (GPT, Secure Boot, the EFI system partition, drivers) · CMOS/NVRAM settings · TPM and measured boot · how the bootloader takes over · why servers moved to UEFI
- Diagrams: see the boot flowchart in the ROM block.

### HDD
`bytes GO complete thimh/memory and storage/theory/HDD.md` · 88 lines · real 17 · depth 1 · MERGE→`01 CS Fundamentals/Storage Devices - HDD, SSD, NVMe`
- Has: spinning magnetic disks; cheaper, slower and more fragile; HDD vs SSD bullets.
- Problems: ~69% template. The handwritten part is empty (the note starts at "## Complete notes"). No mechanics (seek + rotational latency), no numbers.
- Keep: the generated HDD vs SSD bullets, which are correct.
- New home: same note (section "HDD")
- Must cover: platters, heads, tracks and sectors · seek time (~5–10 ms) plus rotational latency (7200 rpm ≈ 4.2 ms on average) · sequential ~150–250 MB/s vs random ~100–200 IOPS · why databases and Kafka favour sequential writes · where HDDs still fit (backups, cold tiers, HDD-backed st1/sc1 EBS)
- Diagrams: excalidraw of a platter with head, track and sector.

### Storages
`bytes GO complete thimh/memory and storage/theory/Storages.md` · 93 lines · real 20 · depth 1 · REWRITE
- Has: storage is non-volatile; HDD, SSD, USB, memory card, cloud; capacity, speed, latency, durability.
- Problems: ~66% template. The owner list is mangled by link stripping ("SSDSSD", "USBUSB", "SD cardSD Cards"). No SSD internals, no NVMe, no IOPS-throughput relationship, no block/file/object split. The key term `[[Backup and Restore|backup]]` links to a database note.
- Keep: owner's list of drive types (HDD, SSD, USB, SD card).
- New home: `01 CS Fundamentals/Storage Devices - HDD, SSD, NVMe`
- Must cover: HDD mechanics and numbers (see the HDD block) · SSD internals: NAND types (SLC/MLC/TLC/QLC), pages vs erase blocks, FTL, wear levelling, write amplification, garbage collection, TRIM, over-provisioning · SATA/AHCI vs NVMe over PCIe (many deep queues; ~20–100 µs latency) · metrics: IOPS, throughput, latency, queue depth (IOPS × block size = throughput) · sequential vs random I/O · durability: fsync, device write caches, power-loss protection, and why fsync latency dominates database commits · RAID 0/1/5/10 · block vs file vs object storage (EBS vs EFS vs S3) and cloud volume types (gp3 vs io2) · USB/SD cards as flash with weak controllers · choosing storage for a database vs logs vs backups
- Diagrams: flowchart of the write path app → page cache → fsync → device cache → NAND; table HDD vs SATA SSD vs NVMe vs EBS gp3 (latency, IOPS, throughput, cost).

---

## Area plan: `bytes GO complete thimh/`: CS fundamentals, networking/web, frontend

Verdicts across the 76 notes: KEEP 0 · POLISH 2 · REWRITE 14 · MERGE 45 · SPLIT 4 · DELETE 11.
Depth: 0 → 12 · 1 → 36 · 2 → 26 · 3 → 2 · 4–5 → 0.

### New notes, ordered basic → advanced
**01 CS Fundamentals**
1. `01 CS Fundamentals/How a Computer Runs a Program` · B · from: NEW (fetch-decode-execute; compile, link, load; Go static binaries)
2. `01 CS Fundamentals/Memory Hierarchy and CPU Caches` · B · from: Memory, type of cache (L1–L3 part), data structure/cache (image), SRAM (part)
3. `01 CS Fundamentals/RAM Technologies - SRAM, DRAM, DDR, GDDR, HBM` · B · from: RAM, SRAM, DRAM, DDR SDRAM, GDDRM SDRM
4. `01 CS Fundamentals/ROM, Flash, Firmware and the Boot Process` · B · from: ROM, Firewares, BIOS
5. `01 CS Fundamentals/Storage Devices - HDD, SSD, NVMe` · B · from: Storages, HDD
6. `01 CS Fundamentals/Latency Numbers Every Engineer Should Know` · B · from: what is latency
7. `01 CS Fundamentals/Number Representation and Text Encoding` · B · from: NEW
8. `01 CS Fundamentals/Processes, Threads and Context Switching` · I · from: NEW
9. `01 CS Fundamentals/System Calls and User vs Kernel Mode` · I · from: NEW
10. `01 CS Fundamentals/Virtual Memory, Paging and the TLB` · I · from: cache used for (TLB image), Memory (corrected)
11. `01 CS Fundamentals/Process Memory Layout - Stack vs Heap` · I · from: NEW (link to Go escape analysis)
12. `01 CS Fundamentals/Page Cache, File Systems and fsync` · I · from: type of cache (page/inode cache part)
13. `01 CS Fundamentals/CPU Scheduling` · I · from: NEW
14. `01 CS Fundamentals/Concurrency Primitives - Mutex, Semaphore, Atomics` · I · from: NEW
15. `01 CS Fundamentals/I-O Models - Blocking, epoll, io_uring and the Go Netpoller` · A · from: NEW
16. `01 CS Fundamentals/Complexity Analysis - Big-O and Amortized Cost` · B · from: NEW
17. `01 CS Fundamentals/Data Structures Overview and Big-O Cheat Sheet` · B · from: Data structure content table (overview image)
18. `01 CS Fundamentals/Arrays and Dynamic Arrays (Go Slices)` · B · from: array
19. `01 CS Fundamentals/Linked Lists` · B · from: List
20. `01 CS Fundamentals/Stacks, Queues and Deques` · B · from: stack, queue
21. `01 CS Fundamentals/Hash Tables and Go Maps` · I · from: hash table
22. `01 CS Fundamentals/Trees, BSTs and Balanced Trees` · I · from: tree
23. `01 CS Fundamentals/Heaps and Priority Queues` · I · from: heaps
24. `01 CS Fundamentals/Graphs and Graph Algorithms` · I · from: graph
25. `01 CS Fundamentals/Tries, Suffix Trees and Suffix Arrays` · A · from: sufux tree
26. `01 CS Fundamentals/Union-Find, Bloom Filters, Skip Lists and Sketches` · A · from: NEW
27. `01 CS Fundamentals/Sorting, Searching and Interview Patterns` · I · from: NEW

**02 Networking & Web**
1. `02 Networking & Web/How the Internet Works - IP, Ports, Packets, OSI vs TCP-IP` · B · from: NEW
2. `02 Networking & Web/IP Addressing, Subnets, NAT and VPC Basics` · B · from: NEW
3. `02 Networking & Web/DNS - Resolution, Records and Caching` · B · from: work_DNS, whtat DNS (+ the DNS half of aws/Domain DNS HTTPS SSL TLS)
4. `02 Networking & Web/HTTP Fundamentals - Methods, Status Codes, Headers, Cookies` · B · from: NEW
5. `02 Networking & Web/TCP - Handshake, Reliability, Flow and Congestion Control` · I · from: NEW
6. `02 Networking & Web/UDP and QUIC` · I · from: NEW
7. `02 Networking & Web/HTTP-1.1 vs HTTP-2 vs HTTP-3` · I · from: NEW
8. `02 Networking & Web/TLS and the HTTPS Handshake` · I · from: NEW (+ the TLS half of aws/Domain DNS HTTPS SSL TLS)
9. `02 Networking & Web/HTTP Caching - Cache-Control, ETag, Conditional Requests` · I · from: NEW
10. `02 Networking & Web/CDN and Edge Caching` · I · from: React/CDN (+ api design/CDN, api design/Global CDN and Edge, the CDN part of real_cache)
11. `02 Networking & Web/Proxies and Load Balancers - Forward, Reverse, L4 vs L7` · I · from: other areas (api design/Reverse Proxy vs Forward Proxy, system design/Load Balancer)
12. `02 Networking & Web/CORS, Same-Origin Policy and Cookies` · I · from: NEW (or put it in 12 Security)
13. `02 Networking & Web/What Happens When You Type a URL` · I · from: NEW (capstone: DNS → TCP → TLS → HTTP → CDN → render)
14. `02 Networking & Web/Network Debugging Toolkit - dig, curl, ss, tcpdump` · A · from: NEW

**03 Frontend** (★ = core for a backend engineer; the others are optional)
1. ★ `03 Frontend/How Browsers Load and Render a Page` · B · from: asyncVSdeffer, the Real DOM part of Real_virtual
2. `03 Frontend/CSS Fundamentals - Cascade, Selectors, Box Model` · B · from: Types, CLASS_ID, styles, inline_block, sudo class, shadows
3. `03 Frontend/CSS Layout - Position, Flexbox, Grid` · B · from: Position, flex, grid
4. ★ `03 Frontend/JavaScript Core - Types, Scope, Hoisting, Closures, this` · B · from: variables, strings, Promitive_non_Primitive_Types, functions, scope, core_Concepts (JS parts)
5. `03 Frontend/JavaScript Objects, Arrays and Iteration` · B · from: Objects, Arrays, Loops, filters
6. `03 Frontend/DOM, Events and Timers` · B · from: Dom
7. ★ `03 Frontend/JavaScript Async - Event Loop, Promises, async-await` · I · from: Promises, async_await
8. ★ `03 Frontend/React Fundamentals - Components, JSX, Props, State` · B · from: core_Concepts
9. `03 Frontend/React Hooks` · I · from: hooks
10. ★ `03 Frontend/React Rendering - Virtual DOM, Reconciliation, Lifecycle` · I · from: Real_virtual, LIFE_Of _REact
11. `03 Frontend/React State Management - Props, Context, Redux` · I · from: Prop dilling, redux
12. `03 Frontend/React Routing and Rendering Strategies - CSR, SSR, SSG` · I · from: routing, core_Concepts (SPA, client vs server routing, lazy/Suspense)

**05 APIs**
1. `05 APIs/REST API Design` · B→A · from: what is rest, use of rest (+ Api architecture/REST API; Go REST coding stays in 06)

**08 Caching & Redis**
1. `08 Caching & Redis/Caching Fundamentals` · B · from: real_cache, cache used for (text part)
2. `08 Caching & Redis/Cache Eviction Policies - LRU, LFU, TTL` · I · from: data structure/cache (text part)

**13 DevOps & Cloud**
1. `13 DevOps & Cloud/Cloud Computing Basics` · B · from: Cloud computing
2. `13 DevOps & Cloud/Cloud Native and the 12-Factor App` · I · from: cloudnative, Pillars of Cloud Native, images from cloud native content table

**16 Software Architecture**
1. `16 Software Architecture/Inversion of Control - Library vs Framework` · B · from: lib_frame
2. `16 Software Architecture/Monolith vs Microservices` · I · from: mcroservise_monolith (+ system design/Monolith and Microservices)

**19 Interview & Career**
1. `19 Interview & Career/Backend Roadmap and Tech Landscape` · B · from: backendburgerDiagram (+ the SDE3 roadmap notes)

### Misplaced notes → proper target
| Current | Target |
|---|---|
| React/CDN | `02 Networking & Web/CDN and Edge Caching` |
| React/asyncVSdeffer | `03 Frontend/How Browsers Load and Render a Page` |
| React/async_await | `03 Frontend/JavaScript Async - Event Loop, Promises, async-await` |
| React/mcroservise_monolith | `16 Software Architecture/Monolith vs Microservices` |
| React/lib_frame | `16 Software Architecture/Inversion of Control - Library vs Framework` |
| React/core_Concepts | split: JS Core / React Fundamentals / React Routing & Rendering Strategies |
| data structure/cache | image → `01 …/Memory Hierarchy and CPU Caches`; text → `08 …/Cache Eviction Policies` |
| cache/type of cache | `01 …/Memory Hierarchy and CPU Caches` + `01 …/Page Cache, File Systems and fsync` |
| cache/cache used for | `01 …/Virtual Memory, Paging and the TLB` + `08 …/Caching Fundamentals` |
| cache/real_cache | `08 Caching & Redis/Caching Fundamentals` |
| memory and storage/* (12) | `01 CS Fundamentals` (4 hardware notes + MOC) |
| LAtency | `01 CS Fundamentals/Latency Numbers…` |
| DNS | `02 Networking & Web/DNS…` |
| REST | `05 APIs/REST API Design` |
| cloud native | `13 DevOps & Cloud` |
| backend burger | `19 Interview & Career/Backend Roadmap and Tech Landscape` |

### Frontend: quality and keep-vs-drop for a backend vault
Quality:
- Average depth is 1.6 across the 35 CSS/JS/React notes.
- Almost all the "real" text is copied course material: the Chai aur Code JS series, Namaste React-style Q&A and screenshots, and frames from a YouTube CSS course.
- About 600 lines of code are unfenced and unindented, so JSX renders as broken HTML in Obsidian.
- The copied material carries 15+ wrong statements (listed below).
- No note goes beyond beginner level.

Recommendation:
- Keep `03 Frontend` as an optional, lite section. Write the 5 ★ notes first: browser loading and rendering, JS core, JS async/event loop, React fundamentals, React rendering. These come up in full-stack and "what happens when you type a URL" interviews and help debugging (CORS, cookies, caching, TTFB).
- The 2 CSS notes, DOM, objects/arrays, hooks, state management and routing are optional and low priority.
- Drop as standalone notes: loops, strings, filters, class-component trivia (`super(props)`, the full lifecycle-method list), React Router API specifics (they change with every major version), and loading React from a CDN.
- Don't carry copied course text into notes meant for sharing; rewrite it in your own words.

### Gaps (topics missing entirely for complete coverage)
I checked the rest of the vault with grep. TCP, QUIC, TLS handshakes, virtual memory, syscalls, epoll, fsync, cache lines and number representation appear nowhere except the bbg notes; the Load Balancer note mentions TCP/UDP only in passing.

**01 CS Fundamentals:**
- process vs thread vs goroutine; PCB; context-switch cost
- system calls, user vs kernel mode, vDSO, strace
- virtual memory, page tables, TLB, page faults, mmap, copy-on-write, swap, OOM killer, huge pages
- process memory layout (text, data, BSS, heap, stack); stack vs heap allocation (link Go escape analysis)
- CPU scheduling: preemption, time slices, CFS/EEVDF, cgroup CPU quotas → container CPU throttling
- concurrency primitives and hazards: mutex, RWMutex, semaphore, condition variable, CAS/atomics, deadlock's four conditions, livelock, starvation, priority inversion
- file systems: inode, dentry, journaling, page cache, fsync/fdatasync, O_DIRECT; file descriptors and ulimit
- I/O models: blocking, non-blocking, select/poll/epoll/kqueue, io_uring; the Go netpoller
- signals (SIGTERM vs SIGKILL, graceful shutdown); IPC (pipes, Unix sockets, shared memory)
- number representation (two's complement, overflow, IEEE-754 and `0.1+0.2`), endianness, UTF-8 vs UTF-16, runes
- GC basics (mark-sweep, tri-color, generational vs Go's non-generational collector)
- Big-O and amortized analysis; sorting and searching (binary search, pdqsort, stability)
- interview patterns: two pointers, sliding window, BFS/DFS, DP, backtracking, greedy
- data structures with no note: deque/ring buffer, union-find, B-tree/B+tree, skip list (Redis ZSET), Bloom filter, HyperLogLog, count-min sketch, R-tree/geohash/quadtree (the overview image even lists R-tree), segment/Fenwick tree, trie, LRU as a structure

**02 Networking & Web:**
- OSI vs TCP/IP layers; IP addressing, CIDR, subnets, NAT, ARP, DHCP; routing and BGP basics; VPC
- ports and sockets
- TCP: 3-way handshake, 4-way close, TIME_WAIT, retransmission, flow control (rwnd), congestion control (slow start, CUBIC, BBR), Nagle/delayed ACK, keepalive, head-of-line blocking
- UDP; QUIC
- HTTP/1.1 (keep-alive, pipelining), HTTP/2 (streams, HPACK, multiplexing), HTTP/3 (QUIC, 0-RTT)
- TLS 1.2 vs 1.3 handshakes, certificates and the chain of trust, SNI, ALPN, mTLS, session resumption, OCSP stapling
- HTTP caching headers; cookies (SameSite, HttpOnly, Secure); CORS and preflight; the same-origin policy
- the browser request lifecycle end-to-end
- bandwidth vs latency; bandwidth-delay product
- Go connection pooling (`http.Transport` MaxIdleConnsPerHost, keep-alive, the timeout family)
- anycast
- network debugging tools (dig, curl -v, mtr, ss, tcpdump/Wireshark)

**03 Frontend:**
- the rendering pipeline and Core Web Vitals
- the event loop's microtask queue
- prototypes and classes
- ES modules vs CommonJS
- TypeScript basics
- React 18/19 concurrency features
- accessibility basics
- the frontend side of security (XSS, CSP, tokens in localStorage vs cookies)

### Delete list (with reason)
- Navigation-only (10): CSS CONENT, DNS CONTENT TABLE, REST content table, React Content, backend burger content, cache content table, cloud native content table, Data structure content table, JS Content, MEMORY AND STORAGE Content table. Each is replaced by one MOC per target folder.
- `bakcedburgerforstatup`: its only image duplicates backendburgerDiagram's, and all its text was invented.
- Images:
  - `React/Image/Pasted image 20260803004258.png`: byte-identical to 004339 (md5 08e927f0…).
  - `backend burger/img/Pasted image 20260907030320.png`: near-duplicate crop of 030045.
  - `data structure/img/Pasted image 20260902154232.png`: a neural network filed under "tree".
  - the second embed of 20260803004438 in CDN.md.
  - orphans `DNS/img/Pasted image 20260827014932.png` (an early frame of 015028) and `Css/css image/Pasted image 20260802015015.png` (transcribe its code first).
- All template sections in every note ("Revision notes", "Revision dashboard", generic diagrams).

### Cross-area overlaps found
- **CDN ×3+:** React/CDN + `advance backend/theory/api design/CDN.md` + `api design/Global CDN and Edge.md` + the CDN part of real_cache → one 02 note.
- **DNS:** whtat DNS + work_DNS + the DNS half of `advance backend/theory/aws/Domain DNS HTTPS SSL TLS.md`. That note's TLS half → the 02 TLS note.
- **Latency:** `what is latency` (reference numbers) vs `production debugging/Latency Debugging.md` (diagnosis). Keep both; cross-link them.
- **REST:** what is rest + use of rest + `Api architecture/theory/REST API.md` → `05 APIs/REST API Design`. `golang backend/Go REST API Coding.md` stays in 06 as the implementation.
- **Monolith/microservices:** React/mcroservise_monolith + `system design/Monolith and Microservices.md` + the microservices pillar of cloud native + the "architectural patterns" row of the backend burger.
- **Caching:** cache ×4 + data structure/cache + `redis/API Caching with Redis.md` + `redis/Caching Patterns and Types.md` + `performance/Cache Stampede Avalanche Penetration.md` + `aws/AWS ElastiCache.md` + `LLD with Go/practice/LRU Cache LLD in Go.md` + `Excalidraw/LLD/LRU Cache LLD Drawing`.
- **Cloud:** cloud native ×4 vs `cloud deployment/*` (AWS Deployment, Production Architecture, CI CD Pipeline, ECR and ECS) and the docker notes (container definition).
- **Hash table ↔ consistent hashing:** `database/Consistent Hashing.md` and `00 Rebuild/Sample - Consistent Hashing.md`. Cross-link mod-N vs consistent hashing; don't merge.
- **Suffix tree/trie ↔ search:** `data modeling/Search Indexes.md` and `database/Search Architecture.md` (inverted index). Cross-link only.
- **Data-structure queue ↔ messaging:** `redis/Message Queue with Redis.md`, `reliability/Dead Letter Queue.md`, Go worker queues. The auto-linker currently joins them; keep in-memory and durable queues separate.
- **Heap ↔ scheduling:** `reliability/Durable Job Scheduler.md`, `golang backend/Go Cron Scheduled Jobs.md` (delayed jobs use heaps or sorted sets).
- **Arrays and hash tables ↔ Go internals:** slices/maps in `golang backend/Go Backend Complete Notes.md` and `Go Pointers Memory Values.md`. The DS notes take the language-neutral view and link to 04.
- **Memory/OS ↔ elsewhere:** `production debugging/Memory Leak Debugging.md`, `performance/Thread Pools and Blocking IO.md`, `docker/how docker Works.md` (namespaces/cgroups).
- **Strings and encoding:** JS strings ↔ `golang backend/Go Strings Runes Time Files.md`; encoding concepts go to 01.
- **Roadmaps:** backend burger ↔ `sde3 roadmap/SDE3 Backend Roadmap.md`, `Excalidraw/SDE3 Backend Roadmap.excalidraw.md`, `golang backend/Go Backend Coding Roadmap.md`.
- **TLS/HTTP2 implementation:** `golang backend/Go HTTPS HTTP2 TLS Server.md` and `Go gRPC TLS Metadata Deadlines.md` are the implementation; they need the missing 02 concept notes underneath them.
- **Proxy/LB:** `api design/Reverse Proxy vs Forward Proxy.md` and `system design/Load Balancer.md` → 02 (concepts) or 11 (design).

### Factual errors found (quote → correction)
**CSS**
1. CLASS_ID (owner): "to access it we user . … `.id{color:red}`" → IDs use `#` (`#test {}`); `.` selects classes.
2. CLASS_ID (generated): `# hero {` → `#hero {`. The space (formatter damage) makes the selector invalid.
3. Position: "static … make the thing sticky to a fixed place" → static is the default, normal flow; offsets and z-index are ignored.
4. Position: "relative … free to move any where" → relative offsets the box from its normal position and keeps that space reserved.
5. Position: "absolute … top is based on the root … as it has no direct parent" → absolute uses the nearest positioned (non-static) ancestor, and the initial containing block only if there is none.
6. flex: "align item in y axis" → align-items works on the cross axis, which is vertical only when `flex-direction: row`.
7. flex: "space around: add space between each block" → that's space-between; space-around gives each item equal space around it (half-size gaps at the edges).
8. grid: `grid-tempate-column:200px,200px,200px` → `grid-template-columns: 200px 200px 200px;`.
9. grid: "justify item … horizontal … align item focus on horizontal" → justify-* is the inline (horizontal) axis; align-* is the block (vertical) axis.
10. grid: "justify-content / align content … based on the text" → they position the whole set of tracks inside the container.
11. grid: "1fr is resizeto size" → fr is a fraction of the remaining free space.
12. styles: "font-width" → `font-weight`; "san-serif" → `sans-serif`; "body-style:utset" → `border-style: outset`; `background_position` → `background-position`.
13. styles: `text-decoration:cyan dotted line` → `text-decoration: underline dotted cyan`.
14. styles: "Padding … the space between the margin and the text" → padding is between the content and the border; margin is outside the border.
15. Types: "3 type of css property" → three ways to include CSS (inline, `<style>`, `<link>`), not property types.
16. shadows (generated): spread listed as a shadow value in general → only box-shadow has spread; text-shadow is x, y, blur, color.

**DNS / latency**
17. work_DNS screenshot: google.com → 93.184.216.34 → that is example.com's old address; use a placeholder IP.
18. Latency frame "TLS handshake 250–500 ms" → only with ~100+ ms RTTs. A handshake costs TCP 1 RTT + TLS 1.3 1 RTT (TLS 1.2: 2 RTT); in-region that's a few ms.

**React**
19. Prop dilling: "If we don't pass a value to the provider does it take the default value? … it does" → `createContext(default)` is used only when no Provider is above; `<Provider>` without `value` provides `undefined`.
20. core_Concepts: SPA "Faster Initial Load" → SPAs usually load slower the first time (large JS bundle); later navigations are faster.
21. core_Concepts: Suspense data-fetching example → passing a Promise as a prop never suspends. Suspense works with `React.lazy`, React 19 `use(promise)` or Suspense-enabled libraries.
22. core_Concepts: "lazy() … and with the React.lazy() component" → they are the same function; the startTransition error is fixed by wrapping the suspending update in `startTransition`/`useTransition`, which the note never says.
23. routing: `<createHashRouter><Route …/></createHashRouter>` → `const router = createHashRouter([{ path: "/", element: <Home/> }]); <RouterProvider router={router}/>`. Also, `Switch` and `component=` are v5 APIs; v6+ uses `<Routes>` and `element=`.
24. Real_virtual screenshot: "React updates complete document in the Real DOM … changes reflect directly on the complete webpage" → DOM updates are per node; the cost is reflow/repaint. React computes a minimal set of mutations and applies them in the commit phase.
25. redux: "useContext … is used for managing state" → Context only passes a value down; the state lives in useState/useReducer, and every consumer re-renders when the value changes.
26. async_await: "await is used inside async function only" → ES modules also allow top-level await (ES2022).
27. CDN (generated): `unpkg.com/react/umd/react.development.js` → React 19 removed UMD builds. Pin `react@18` or use an ESM CDN; a CDN is an edge-caching network, not a way to load demo scripts.
28. JS/React event-loop diagram (in 12+ notes): promise callbacks go through the "Callback/task queue" → promise reactions and await continuations run from the microtask queue, which is drained before the next task.

**JavaScript**
29. scope: "addTwo(5); const addTwo = function… so this will work because of hoisting" → ReferenceError (TDZ). Only function declarations are hoisted with their body.
30. functions: "const a = function(){…} … this is a named function" → an anonymous function expression assigned to a variable (its inferred `.name` is "a").
31. functions: "if we are not using a bracket we do not require return" → braces; an implicit return works only for expression bodies, and an object literal needs `() => ({…})`.
32. Dom: "setInterval(sayDate, 1000, "hi") will run after 1 sec" → it runs every second until `clearInterval`.
33. Promises: "There are different types of Promises" → these are different ways to create or consume the same Promise.
34. Promises: "resolve means correct and true, reject means false or wrong" → resolve fulfils with a value; reject settles with a reason.
35. Objects: `Mysym:mykey` → `[mySym]: "mykey"`; unbracketed, the key is the string "Mysym" and `mykey` is an undefined identifier.
36. variables: "number => 2 to power 53" → Number is a 64-bit float; integers are exact up to `Number.MAX_SAFE_INTEGER` = 2^53 − 1; use BigInt beyond.
37. variables: "default values" list → these are the primitive types, not defaults; `accountCity = "Jaipur"` silently creates a global (a ReferenceError in strict mode).
38. Loops: `while (arr < myArray.length)` → the counter is undeclared; also, `for…of` over a plain object throws TypeError (use `Object.entries`).
39. filters: `const myNums` declared twice and `myNumers` → a SyntaxError in one scope, plus a typo.

**Data structures**
40. heaps: "used for … memory management" → the heap data structure is unrelated to heap memory. Allocators use free lists and size classes (Go: mcache/mcentral/mheap spans).
41. hash table: "used for insertion and deletion" with average-case figures only → O(1) average lookup/insert/delete; O(n) worst case; no ordering.
42. hash table (generated): a JS object literal as the hash-table example → use `Map` in JS, or `map[K]V` in Go.
43. tree: "ml in clasificaution" illustrated with a TensorFlow Playground neural network → trees in ML are decision trees and tree ensembles; the image isn't a tree.
44. sufux tree: "used for text editors" → used for substring search, repeated/common substrings and genomics. Editors use ropes or piece tables; search engines use inverted indexes.
45. array: "Fixed size colection" → true for static arrays (`[N]T`). Go slices and JS arrays are dynamic arrays with amortised O(1) append.

**Caches / OS**
46. type of cache: "l3 … slower than the L1 … used via different cups" → L3 is slower than L2 and shared by all cores (L1 and L2 are usually per core).
47. type of cache: "File cache … used to access file in the memory" → the screenshot shows the inode cache (file metadata). File contents are cached in the page cache.
48. real_cache: "Kakfa: the message can be cache[d] … based on retention" → Kafka is a durable, replicated log that keeps messages per `retention.ms/bytes`. It is not a cache; its reads are fast because of sequential I/O and the OS page cache.
49. Memory (generated): "Virtual memory uses storage as extra memory when RAM is not enough" → that's swapping. Virtual memory is the per-process address space mapped to physical frames by page tables, the MMU and the TLB.

**Hardware**
50. ROM: "Types of ROM: Firewares, BIOS" → firmware and BIOS are software stored in ROM/flash; ROM types are mask ROM, PROM, EPROM, EEPROM and flash.
51. BIOS: "starting power to computer" → the PSU powers the machine; the BIOS/UEFI runs POST, initialises hardware and hands off to the bootloader.
52. Firewares: "it controls how hardware devices control rom" → firmware is low-level software, stored in non-volatile memory, that controls the device itself.
53. GDDRM SDRM: "this is the fasted DRAM" → GDDR is bandwidth-optimised with higher latency than DDR; HBM has more total bandwidth.
54. RAM: "it is deleted when the system is closed" → volatile: lost when power is removed.
55. DDR SDRAM: "DDR$" → DDR4. Earlier generations are DDR, DDR2 and DDR3.

**Cloud / backend burger**
56. Pillars (generated): "pillars are automation, resilience, observability, security, scalability" → the owner's own screenshot names DevOps, cloud-native open standards, microservices and containers.
57. Pillars (owner): "Containers: a light weight application which contain all the things" → a container is an isolated process (namespaces + cgroups) started from an image that bundles the app and its dependencies; it shares the host kernel.
58. backend burger (generated): "Top bun = client request, sauce = routing … cheese = database layer" → invented. The source image is a backend tech-landscape map; the "startup" note's text is also invented.

### Owner content worth preserving
- **Mental models** (corrected):
  - absolute positioning is a "ghost" (out of flow).
  - inline elements are content-width, blocks take the full line.
  - `fr` = a share of free space.
  - L1 < L2 < L3 in size and latency, with L3 shared.
  - the page cache is the OS keeping file pages in RAM.
  - DNS levels go root → TLD → authoritative.
  - library = you call it; framework = it calls you.
  - stack = LIFO for undo/redo; queue = FIFO for in-order chat delivery.
  - graphs model relationships; trees model hierarchies.
  - ROM is non-volatile and holds firmware.
  - DRAM needs refresh and is cheaper and slower than SRAM.
  - BIOS runs POST, then hands over to the bootloader.
- **Code to carry** (fence it, fix it, and rewrite in your own words before sharing):
  - the event-delegation example (Dom).
  - the Promise chain with catch/finally and the async/await + try/catch examples (Promises).
  - Map iteration with `for (const [k, v] of map)` (Loops).
  - the cart `reduce` (filters).
  - drilling, lifting state and Context (Prop dilling, as function components).
  - the useEffect fetch, useReducer counter and useRef focus examples (hooks).
  - `lazy` + Suspense (core_Concepts).
  - the CSS relative/absolute pair (orphan 20260802015015).
  - LVHA link states (sudo class).
- **Tables to transcribe from screenshots:**
  - the latency ladder (LAtency).
  - "where caching happens" (real_cache 20260907025132).
  - data structures → everyday use (DS content table 20260907023008).
  - the Backend Burger checklist (backendburgerDiagram 20260907030045).
  - CNCF projects by category (031431).
  - the cloud-native pyramid (030658) and the 4 pillars (030919).
  - the hash-table complexity table (154325), extended with a worst-case column.
  - REST examples (noun URLs, CRUD mapping, limit/offset, /v1 → /v2).

### Image audit (48 of 104 viewed; all 9 image folders sampled)
I viewed 48 images:
- backend burger 2
- DNS 2
- CSS 7
- LAtency 3
- REST 5
- React 11
- cache 5
- cloud native 5
- data structure 8

**Classification: 100% third-party; I found no owner drawings.** Every file is a `Pasted image <timestamp>` screenshot.
- **ByteByteGo YouTube frames** (dark theme; some show the logo, the presenter's webcam or YouTube UI): DNS (4), LAtency (10), cache (12), cloud native (9), data structure (16). The Backend Burger (2) is in the same style (verify the source). REST (5) are white-theme frames from ByteByteGo's REST video (verify).
- **Namaste React-style notes screenshots** (cream background, handwriting font; text only): most of React/Image (~21). Plus 3 third-party diagrams: Wojtek Maj's React lifecycle diagram (024110), a stock monolith-vs-microservices diagram (230911) and a TensorFlow Playground capture (DS 154232).
- **YouTube CSS tutorial frames** (VS Code + browser output, Lorem ipsum): all 21 in `Css/css image`.

**These show a person's face or a player UI and must never be published:** LAtency 021107 and 021411 (webcam + YouTube player), data structure 022833 (webcam), cloud native 031431 (webcam). Others may contain a partial webcam corner (e.g., DS 152656, cache 025047).

**Worth keeping as private reference, then redrawing as mermaid/excalidraw:**
- `LAtency/image/Pasted image 20260827021107.png`, 021411 and 021652: latency ladder, context switch / memcpy, TLS round trips → a table + a sequence diagram.
- `DNS/img/Pasted image 20260827015028.png`: full 9-step resolution → a sequence diagram.
- `cache/img/Pasted image 20260907025132.png`: caching layers → a flowchart.
- `cache/img/Pasted image 20260907024938.png` (TLB), 025008 (page cache) and 025047 (inode cache) → OS flowcharts.
- `data structure/img/Pasted image 20260907023008.png`: DS → use → a table; 20260902152656 (heap) and 20260902154523 (suffix tree) → mermaid graphs.
- `backend burger/img/Pasted image 20260907030045.png`: landscape → a mindmap/table.
- `cloud native/img/Pasted image 20260907030658.png` (pyramid), 030919 (pillars), 031248 (team → service → containers) and 031431 (CNCF grid) → flowcharts/tables.
- `React/Image/Pasted image 20260803024110.png`: lifecycle → link to the original site, or redraw as a state diagram.
- `React/Image/Pasted image 20260803230911.png`: monolith vs microservices → a flowchart.

**Not worth keeping:** every Namaste React text screenshot and every CSS code/output frame (transcribe as text or fenced code), the REST slides (transcribe), and the duplicates and orphans listed under Delete.

**If the notes will be shared publicly:** redraw every third-party screenshot as mermaid or excalidraw, and embed no video frames at all (copyright, and some show a person's face). In shared notes, copied course code and text should also be rewritten in your own words.

### Tooling damage to fix during migration
- **Auto-linker inside owner text and code:**
  - `[[Domain DNS HTTPS SSL TLS|https]]` inside fetch URLs in Promises and hooks code.
  - `[[Docker_Image_Container|container]]` for CSS flex/grid containers and the Redux store.
  - `[[Message Queue with Redis|Queue]]` for the data-structure queue and priority queue.
  - `[[API Caching with Redis|caching]]` in SRAM (CPU cache), the DNS content table and real_cache.
  - plain `[[cache]]` resolves to `data structure/theory/cache.md` from work_DNS, real_cache (Kafka line), type of cache (L1 line), Memory and SRAM.
  - `[[Scaling Concepts|Scaling]]` inside the pasted microservice text.
- **Formatter damage:**
  - `# hero {` (CSS).
  - `- *Merged Array**` style bold corruption in Arrays, Loops, Objects, functions, strings, async_await and lib_frame.
  - link-stripping debris: "SSDSSD", "USBUSB", "FPM DRAMFPM DRAM", "SDRAMSDRAM".
  - link targets padded with spaces: `[[cache used for ]]`, `[[ Cloud computing ]]`, `[[Storages ]]`, `[[ GDDRM SDRM]]`.
- **Unfenced code:** 0 code fences in the owner part of all 25 JS/React notes (~600 code lines). JSX is parsed as HTML in reading view.
- **Audit metric caveat:** for the 26 notes in this folder without `## Complete notes`, the generated part starts at `## Revision notes`, and audit `hand` is 0 for every one of them, even core_Concepts (162 owner lines), Promises (97) and Prop dilling (89).
