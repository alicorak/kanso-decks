# Figma system (UI v2)

How Kanso decks are built in Figma: the source file, the grid, the source slides, the variables, and the API limits that
shape the workflow. Read this before the first `use_figma` call of a deck.

UI v2 (2026-09-15) follows the redesigned Client Introduction deck: gradient background, full-width header and
footer bars, a title column + content column grid, uppercase Geist labels, and auto-layout everywhere.

## Source file

| | |
|---|---|
| File | **Client Introduction** — https://www.figma.com/design/q6Quf4V8CXEKlCLrmrQ6zb/Client-Introduction |
| Pages | `Introduction Slide` (intro and case slides) · `Proposal` · `Kickoff` |
| Sections | Intro: the `0N - …` sections. Proposal and kickoff: `Shared` + `Variant — Brand / Mobile app / End-to-end / Website` |
| Rule | Never build a client deck inside the source file. Only slides inside sections are sources |

The Kanso Deck Template (layout library + components) was archived on 2026-09-16; the source file replaces it.

**The Figma MCP cannot duplicate files.** Every deck starts with the user duplicating the source file in Figma
(⋯ → Duplicate), renaming it `[Client] — [Deck type] — [YYYY-MM-DD]`, and pasting the link. Build in that copy on a
new page, then delete the source pages the deck doesn't use once the review is done.

## Canvas and grid

| Element | Spec |
|---|---|
| Slide | 1920 × 1080 frame, `clipsContent = true`, linear gradient top → bottom, stops bound to `color/background-top` → `color/background-bottom` |
| Header | `Header` frame at (0, 0), 1920 × 105 — logo + `Section label` |
| Footer | `Footer` frame at (0, 978), 1920 × 102 — `Meta` + `Page number` (intro slides: a `Chrome / Page` text) |
| Content area | x 48–1872, y 153–929 (1824 × 776) |
| Title column | `Title column` auto-layout at (48, 153), 432 × 776, vertical, padding 48 top / 48 bottom, space-between |
| Content column | `Content column` auto-layout at (512, 153), 1360 × 776, padding 48 top / 48 bottom; optional 1 px left rule `color/rule-strong` |
| Four-column grid | `Column` frames at x = 48 + i × 464, 432 × 776; columns 2–4 carry a 1 px right rule `color/rule` |
| Deck page layout | slides in a row: x = index × 2020, y = 0 |

Everything inside the title and content columns is auto-layout. Text that grows pushes its siblings instead of
overlapping them — overflow shows up as content spilling past a column's 776 px height (the review scan reports it).

## Typography

| Role | Font | Size / line height | Notes |
|---|---|---|---|
| Cover / section title | Heading | 150 / 100 % | Centered. Outlined variant: no fill, 1.5 px outside stroke `color/outline` |
| Statement | Heading | 96 / 100 % | Bottom of the content column |
| Title (left column) | Heading | 60 / 100 % | One idea, 1–3 lines |
| Headline, list item, column title, stat, contact name | Heading | 42 / 100 % | |
| Quote | Heading | 32 / 120 % | Testimonials |
| Label, body, list text | Body | 24 · auto / 120 % / 150 % | **UPPERCASE via text case**, `color/text-secondary` (50 %) for labels, `color/text-body` (60 %) for body |
| Meta, caption | Body | 20 / 28 px | Uppercase |
| Note | Body | "*" 32 / 32 px + text 20 / 28 px | Bottom of the title column |
| Kanji 簡素 | Noto Serif JP Regular | 1211 | Background of The name and Contact slides |

Heading = `font/heading-family` + `font/heading-style` (ships as Instrument Serif / Regular; final Lastik / Free).
Body = `font/body-family` + `font/body-style` (Geist / **Medium**). Letter spacing: headings −2 %, body −1 %.

**Uppercase is a text property, not the copy.** Write body copy in sentence case; the layout renders it uppercase.

## Colors — `Theme` collection

| Variable | Dark (default) | Light | Use |
|---|---|---|---|
| `color/background-top` | #000000 | #FFFFFF | Slide gradient, top stop |
| `color/background-bottom` | #141414 | #F2F2F2 | Slide gradient, bottom stop |
| `color/placeholder` | #1A1A1A | #EDEDED | Image placeholders, avatars, timeline bars |
| `color/text-primary` | #F5F5F2 | #000000 | Headings, highlights, logo, icons |
| `color/text-body` | #F5F5F2 @ 60 % | #000000 @ 60 % | Body and list text |
| `color/text-secondary` | #F5F5F2 @ 50 % | #000000 @ 50 % | Labels, numbers, meta, captions, footer |
| `color/rule` | #F5F5F2 @ 15 % | #000000 @ 15 % | Dividers, header rule, column rules, quote mark |
| `color/rule-strong` | #FFFFFF @ 20 % | #000000 @ 20 % | Content column left rule |
| `color/outline` | #FFFFFF @ 50 % | #000000 @ 50 % | Outlined cover and section titles |
| `color/accent` | #8CFF8E | #1E8E3E | "Now" / current-step label; commitment labels (In scope, Assumptions, team groups) |

**Never hard-code colors** — one exception: the red `#FF4D4D` on Out of scope and Risks labels (no `color/negative` variable yet). Switch a deck to light with `setTheme(frame, 'Light')` on each slide.

## Source slides

There are no components: header, footer, sign button and decorations are plain frames inside each slide. Clone a
source slide with `cloneSlide(kind, name, deckPage, index, { sectionName, section })` and edit its copy. The flows in
`deck-flows.md` name layouts; this table says which source slide to clone for each.

| Layout (in `deck-flows.md`) | Clone | Edit copy with |
|---|---|---|
| Cover | intro `Cover` · proposal / kickoff `Cover` (`Shared`) | intro: `replaceText` · proposal / kickoff: `setText` (`Cover title outline`, `Cover title`) |
| Section opener | intro `Case Cover` or `Last Words Cover` | `replaceText` |
| Index | intro `What's inside` | `replaceText` |
| Statement | intro `Positioning` · kickoff `Why we’re here` | intro: `replaceText` · kickoff: `setText` (`Title`, `Statement`, `Note`) |
| Name meaning | intro `The name` | `replaceText` |
| Logo wall | intro `Clients · Established` / `Clients · Founders` | `replaceText`, `setCaptions` |
| Split text + image | intro `The studio` | `replaceText` |
| Four columns (services, process) | intro `Services` / `Process` | `replaceText` |
| Mark statement | intro `How we're different` | `replaceText` |
| Case cover | intro `Dataland · Cover` | `replaceText` |
| Visual grid | intro `Dataland · Visuals` | `setCaptions` |
| Challenge & idea (case) | intro `Dataland · Idea & process` | `replaceText` |
| Stats (results, proof) | intro `Proof in numbers` | `replaceText` |
| Testimonials | intro `Testimonials` | `replaceText` (quotes verbatim) |
| Three columns | intro `Next steps` · kickoff `Goals & success`, `How we work together` | intro: `replaceText` · kickoff: `setText` |
| Contact | intro `Contact` · proposal / kickoff `Contact` | intro: `replaceText` · proposal / kickoff: `setText` (`Contact name`, `Contact email`, order `'x'`) |
| Challenge & idea (brief) | proposal `How we understand the brief` | `setText` |
| Case cover + result (proposal) | proposal `Relevant work` | `setText` |
| Investment | proposal `Investment` (with the Sign button) | `setText` (`Payment item`, `Payment share`, `Fee`, `Fee note`, `Button helper`) |
| Proposal / What we propose, Process & timeline, Scope | proposal `Variant — [Service]` | `setText` (structures below) |
| Kickoff / Team, Scope recap, Plan, Approvals, Inputs, First two weeks | kickoff `Shared` or `Variant — [Service]` | `setText` (structures below) |

Intro slides use generic layer names (`Headline`, `Body`, `Frame 12`), so replace their copy by its current text with
`replaceText(frame, currentText, newText)`. Proposal and kickoff slides have stable layer names — use `setText`.
Case studies other than Dataland: clone the Dataland slides and replace every Dataland fact with the brief's facts or
`[placeholders]`.

**Proposal slides 3–5 (2026-09-16).** Structure and layer names of the variant slides on the Proposal page — useful
when editing a clone or rebuilding one with `newSlide`.

| Slide | Structure and layer names |
|---|---|
| `Proposal / What we propose` | Title column: `Title` "What we propose", `Note` = service · Content column (left rule, space between): `Statement` (heading 96) · `Approach` → `Column label` "Our approach", `Approach headline` (heading 42, 900 wide), `Approach body` (body 24, 640 wide) |
| `Proposal / Process & timeline` | Title column: `Title` "[x] weeks from kickoff to launch." · Content column (space between): `Week labels` (12 × `Week label`, 360 left padding) · `Divider` + `Phase row` ×4 → `Phase label group` (360 wide: `Phase label` heading 42, `Key deliverable` body 20 secondary), `Phase track` (fill; `Phase bar` in `color/placeholder`, x = start × track/12) · `Milestones` |
| `Proposal / Scope` | Title column: `Title` "What’s in, and what’s not." · Content column (left rule): `Scope columns` (fills the height, gap 32) → `Column` ×4 in the order In scope · Assumptions · Out of scope · Risks. Each column: fill height, space between, 1 px right rule, 32 right padding; `Column label` at the top, the item group at the bottom (`Column item`s with a `Divider` between them). What we commit to — In scope and Assumptions: labels `color/accent`, items `color/text-primary`. What we exclude or flag — Out of scope and Risks: labels red `#FF4D4D`, items `color/text-body`. No team line |


**Kickoff slides (2026-09-16).** Structure and layer names of the slides on the Kickoff page. Headings `Title` 60 in the title column; `Note` at its bottom where the copy has one.

| Slide | Structure and layer names |
|---|---|
| `Kickoff / Statement` | Content column (left rule, top-aligned, 32 left padding): `Statement` (heading 96) |
| `Kickoff / Three columns` | Content column (left rule): `Columns` (fill height, gap 32) → `Column` ×3 (fill, space between, 1 px right rule, 32 side padding): `Column number` at the top; `Column content` at the bottom → `Column title` (heading 42), then `Divider` + `Column item` per item (text-primary) |
| `Kickoff / Team` | Content column (left rule, space between): `Team group` ×2 → `Group label` (accent: "Kanso", "[Client]"), `People` → `Person` ×4 → `Image placeholder` (Kanso only, 220 high) or `Divider` (client), `Person name` (heading 32), `Person role` (body 20 secondary) |
| `Kickoff / Scope recap` | Content column (left rule, gap 48): `Columns` → `Column` ×2 like the proposal Scope (In scope accent / primary, Out of scope red / body) · `Bottom line` → `Divider`, `Scope note` |
| `Kickoff / Rows` | Content column (space between): rows separated by `Divider`, each row centred, 32 left padding: number (body 20 secondary, 80 wide) · main (heading) · optional detail (body 24, fills) · meta (body 20 secondary, right-aligned). Plan: `Phase row` → `Row number`, `Phase label` (60, 320 wide), `Phase work`, `Phase meta` (360 wide, "W1–W2⏎[sign-off]"). Approvals: `Stat row` → `Row number`, `Stat` (60, 320 wide), `Stat label`, `Row meta` (300). Inputs and first two weeks: `Item row` → `Item number`, `Item` (42, fills), `Item meta` (300) |

Repeated items: when the content has fewer items than the slide, remove the extras with `removeListItems`
(it also removes the matching dividers); when it has more, pick another slide or split it.
The current step in Three columns uses `color/accent` on its `Column number` ("Now").

## Build procedure

1. Read the copy approved in the previous step.
2. In the duplicated file, create a page `Deck — [Client] — [Deck type]`.
3. Paste `scripts/build-helpers.js` at the top of each `use_figma` script. Headings must render in Instrument Serif
   while you clone and edit (see API limits).
4. Clone source slides in outline order with `await cloneSlide(kind, name, deckPage, index, { sectionName, section })`
   (proposal and kickoff variants: `sectionName: 'Variant — [Service]'`), then:
   - Intro and case slides: `replaceText(frame, currentText, newText)`.
   - Proposal and kickoff slides — stacked layers (rows): `setText(frame, name, text, i)`; side-by-side layers
     (columns): `setText(frame, name, text, i, 'x')`.
   - Image captions: `setCaptions(frame, [...])` — covers `Image placeholder`, `Logo tile` and `Portrait`.
   - Header label: `setSection(frame, label)`. Footer: `setFooter(frame, { meta })`; proposal and kickoff:
     `addConfidential(frame, client)` on every slide but the cover.
   - Proposal signing: the cloned Investment already has the Sign button. With the Google Docs signing link from the
     brief: `await setSignLink(frame, url)`; otherwise leave it unlinked and list `[e-sign link]` under Open items.
   - Unused items: `removeListItems(listFrame, keep, { skip })`; unused layers: `removeAll(frame, name)`.
   - A slide the source file doesn't have: `await newSlide(deckPage, index, name, section, { meta, title })`, then
     build its content with `T`, `AL` and `Divider`.
5. Build **at most 5–6 slides per `use_figma` call.** Switch pages at most once per call.
6. After each call, screenshot the slides you built (`await frame.screenshot({ scale: 0.25 })`, max 5 per call).
7. When all slides exist: `setPageNumbers(deckPage)`, then run `scripts/review-scan.js`.

## API limits and gotchas

- **Lastik cannot be loaded by the MCP.** Editing characters, font size, or width of a text node that renders in
  Lastik throws — and a thrown error **rolls back the entire script**. The helpers check `font/heading-family`; if
  it is not Instrument Serif, set it (and `font/heading-style`) back to Instrument Serif / Regular with
  `setValueForMode` for the edits, then ask the user to switch back to Lastik. Never set it to Lastik from the API.
- What still works on Lastik nodes: moving, opacity, fills, strokes, `remove()`, and hyperlinks
  (`setRangeHyperlink`, tested 2026-09-16). `clone()` of a node that *contains* Lastik text fails on append.
- Because layouts are auto-layout, the Lastik switch rarely causes overlaps; it can still push content past a
  column's height or leave one word on a headline's last line. Screenshot every slide in Lastik and fix with
  manual line breaks (same words) — see SKILL.md troubleshooting.
- `figma.notify()` is not available; `console.log` is invisible — always `return` results.
- Load fonts before any text mutation, including `appendChild` of cloned text.
- Gradient stops are bound to variables through `boundVariables` on each stop; if a paint ever comes back unbound,
  rebuild it with `bgFill(frame)`.
