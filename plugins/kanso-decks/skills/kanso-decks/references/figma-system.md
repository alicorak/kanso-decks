# Figma system (UI v2)

How Kanso decks are built in Figma: the template, the grid, the layouts, the variables, and the API limits that
shape the workflow. Read this before the first `use_figma` call of a deck.

UI v2 (2026-09-15) follows the redesigned Client Introduction deck: gradient background, full-width header and
footer bars, a title column + content column grid, uppercase Geist labels, and auto-layout everywhere.

## Template

| | |
|---|---|
| File | **Kanso Deck Template** — https://www.figma.com/design/Hc5KB8bcdQZHG19ZTI6OIA |
| Pages | `Slides` (layout library) · `Components` (Header, Footer, decorations) · `Read me` |
| Rule | Never build a client deck inside the template itself |

**The Figma MCP cannot duplicate files.** Every deck starts with the user duplicating the template in Figma
(⋯ → Duplicate), renaming it `[Client] — [Deck type] — [YYYY-MM-DD]`, and pasting the link. Build in that copy.

## Canvas and grid

| Element | Spec |
|---|---|
| Slide | 1920 × 1080 frame, `clipsContent = true`, linear gradient top → bottom, stops bound to `color/background-top` → `color/background-bottom` |
| Header | `Header` instance at (0, 0), 1920 × 105 |
| Footer | `Footer` instance at (0, 978), 1920 × 102 |
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
| Kanji 簡素 | Noto Serif JP Regular | 1211 | Only inside the `Kanji background` component |

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
| `color/accent` | #8CFF8E | #1E8E3E | "Now" / current-step label only |

**Never hard-code colors.** Switch a deck to light with `setTheme(frame, 'Light')` on each slide.

## Components (`Components` page)

| Component | Size | Properties | Use |
|---|---|---|---|
| `Header` | 1920 × 105 | `Section` (text, shown uppercase) | Every slide, at (0, 0) |
| `Footer` | 1920 × 102 | `Meta` (text), `Show meta` (boolean), `Page` (text) | Every slide, at (0, 978). Cover: Meta "*formerly Echo Studio". Proposal / kickoff: Meta "Confidential — prepared for [Client]" |
| `Kanji background` | 1920 × 1080 | — | First child of Name meaning and Contact slides |
| `O mark` | 214 × 256 | — | Mark statement |
| `Quote mark` | 20 × 32 | — | Testimonial columns |
| `Globe icon` | 24 × 24 | — | Studio meta |

Find property keys at runtime (they carry a `#id` suffix) — the helpers do this.

## Layout library (`Slides` page)

Clone a layout, then edit text **by layer name**. Keep layer names — helpers and the review scan rely on them.

| Layout | Use for | Layer names |
|---|---|---|
| `Layout / Cover` | Deck cover | `Cover title outline`, `Cover title` · Footer Meta |
| `Layout / Section opener` | Chapter divider (decks > 20 slides) | `Section title` (outlined) |
| `Layout / Index` | Agenda | `Title` · `Index row` ×5 → `Index number`, `Index item` · `Divider` |
| `Layout / Statement` | One big sentence | `Title` · `Statement` |
| `Layout / Name meaning` | 簡素 slide | Kanji background · `Title` · `Definition`, `Body` |
| `Layout / Logo wall` | Clients | `Title` · `Headline` · `Logo row` ×2 → `Logo tile` ×4 (`Caption`) |
| `Layout / Split text + image` | Studio, signature detail | `Title` · `Meta`, `Rule`, `Meta highlight` + Globe icon · `Headline`, `Image placeholder` |
| `Layout / Mark statement` | How we're different, approach | `Title`, `Note` · O mark · `Headline`, `Body` |
| `Layout / Three columns` | Next steps, goals, communication | `Title`, `Note` · `Column` ×3 → `Column number`, `Column title`, `Column item` (+ `Divider`) |
| `Layout / Four columns` | Services, process | `Column` ×4 → `Column number`, `Column title`, `Column item` ×4 (+ `Divider`) |
| `Layout / Stats` | Results, proof in numbers, process rows | `Title` · `Stat row` ×4 → `Row number`, `Stat`, `Stat label`, `Row meta` · `Divider` |
| `Layout / Testimonials` | Quotes | `Portrait` · `Column` ×3 → Quote mark, `Quote`, `Avatar`, `Person name`, `Person title` |
| `Layout / Contact` | Closing | Kanji background · `Title` · `Contact` ×3 → `Contact name`, `Contact email` |
| `Layout / Case cover` | Case study opener | `Title`, `Subtitle`, `Meta`, `Rule`, `Meta highlight` · `Image placeholder` |
| `Layout / Visual grid` | Case visuals | `Image placeholder` ×3 |
| `Layout / Challenge & idea` | Case framing, brief understanding, scope summary | `Column` ×4 → `Column label`, `Column title`, `Column body` or `Column item` |
| `Layout / Timeline` | Proposal / kickoff timeline | `Title` · `Week label` ×12 · `Phase row` ×4 → `Phase label`, `Phase bar` · `Milestones` · Footer Meta |
| `Layout / Team grid` | Team | `Title` · `Person` ×4 → `Image placeholder`, `Person name`, `Person role` |
| `Layout / Investment` | Fee | `Title` · `Fee`, `Fee note` · `Payment row` ×3 → `Payment item`, `Payment share` · Footer Meta |
| `Layout / Scope in-out` | Scope, assumptions & risks | `Title` · `Column` ×2 → `Column label`, `Column item` ×5 · Footer Meta |
| `Layout / Checklist` | What we need from you, first two weeks | `Title` · `Item row` ×6 → `Item number`, `Item`, `Item meta` · Footer Meta |

Repeated items: when the content has fewer items than the layout, remove the extras with `removeListItems`
(it also removes the matching dividers); when it has more, pick another layout or split the slide.
The current step in Three columns uses `color/accent` on its `Column number` ("Now").

## Build procedure

1. Read the copy approved in the previous step.
2. In the duplicated file, create a page `Deck — [Client] — [Deck type]`.
3. Paste `scripts/build-helpers.js` at the top of each `use_figma` script.
4. Clone layouts in order with `cloneLayout(name, deckPage, index, section)`, then:
   - Stacked layers (rows): `setText(frame, name, text, i)`. Side-by-side layers (columns): `setText(frame, name, text, i, 'x')`.
   - Image captions: `setCaptions(frame, [...])` — covers `Image placeholder`, `Logo tile` and `Portrait`.
   - Footer: `setFooter(frame, { meta })`; proposal and kickoff: `addConfidential(frame, client)` on every slide but the cover.
   - Unused items: `removeListItems(listFrame, keep, { skip })`; unused layers: `removeAll(frame, name)`.
5. Build **at most 5–6 slides per `use_figma` call.** Switch pages at most once per call.
6. After each call, screenshot the slides you built (`await frame.screenshot({ scale: 0.25 })`, max 5 per call).
7. When all slides exist: `setPageNumbers(deckPage)`, then run `scripts/review-scan.js`.

## API limits and gotchas

- **Lastik cannot be loaded by the MCP.** Editing characters, font size, or width of a text node that renders in
  Lastik throws — and a thrown error **rolls back the entire script**. The helpers check `font/heading-family`; if
  it is not Instrument Serif, set it (and `font/heading-style`) back to Instrument Serif / Regular with
  `setValueForMode` for the edits, then ask the user to switch back to Lastik. Never set it to Lastik from the API.
- What still works on Lastik nodes: moving, opacity, fills, strokes, `clone()`, `remove()`.
- Because layouts are auto-layout, the Lastik switch rarely causes overlaps; it can still push content past a
  column's height or leave one word on a headline's last line. Screenshot every slide in Lastik and fix with
  manual line breaks (same words) — see SKILL.md troubleshooting.
- `figma.notify()` is not available; `console.log` is invisible — always `return` results.
- Load fonts before any text mutation, including `appendChild` of cloned text.
- Gradient stops are bound to variables through `boundVariables` on each stop; if a paint ever comes back unbound,
  rebuild it with `bgFill(frame)`.
