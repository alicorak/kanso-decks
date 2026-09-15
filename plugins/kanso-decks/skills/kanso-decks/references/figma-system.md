# Figma system

How Kanso decks are built in Figma: the template, the grid, the layouts, the variables, and the API limits that
shape the workflow. Read this before the first `use_figma` call of a deck.

## Template

| | |
|---|---|
| File | **Kanso Deck Template** — https://www.figma.com/design/Hc5KB8bcdQZHG19ZTI6OIA |
| Pages | `Slides` (layout library) · `Components` (Header) · `Read me` |
| Rule | Never build a client deck inside the template itself |

**The Figma MCP cannot duplicate files.** Every deck starts with the user duplicating the template in Figma
(⋯ → Duplicate), renaming it `[Client] — [Deck type] — [YYYY-MM-DD]`, and pasting the link. Build in that copy.

If the user cannot duplicate (no access), fall back to `create_new_file` + the bootstrap section of
`scripts/build-helpers.js`, which recreates the variables and the Header in a blank file. Tell the user this
fallback has no layout library, so slides are built from the helpers instead of cloned.

## Canvas and grid

| Measure | Value |
|---|---|
| Slide | 1920 × 1080 frame, `clipsContent = true`, fill bound to `color/background` |
| Header | `Header` instance at x 48, y 48, width 1824 (ends at y ≈ 105) |
| Content margin | x 80 (footer text at x 82) · right edge 1840 |
| Eyebrow | y 200, Geist 32, `color/text-secondary` |
| Headline | y 250–260, Instrument Serif → Lastik, 96–120 px |
| Content band | starts at y 480 (rules at 480, labels at 504, titles at 550) |
| Footer baseline | bottom of footer text at y 984 (page number right-aligned to 1838) |
| Columns | 4-up: x = 80 + i × 450, width 410 · 3-up: x = 80 + i × 600, width 560 · 2-up: x = 80 + i × 900, width 820–860 |
| Deck page layout | slides in a row: x = index × 2020, y = 0 |

## Typography

| Role | Font (bound variables) | Sizes |
|---|---|---|
| Headings | `font/heading-family` + `font/heading-style` (ships as Instrument Serif / Regular; final: Lastik / Free) | 240 · 200 · 144 · 120 · 96 · 80 · 72 · 64 · 56 · 48 · 40 |
| Body | `font/body-family` + `font/body-style` (Geist / Regular) | 36 · 32 · 28 · 26 · 24 · 22 |
| Header label | `font/body-family` + `font/body-medium-style` (Geist / Medium) | 24 |
| Kanji 簡素 | Noto Serif JP Regular (not bound — Lastik has no CJK glyphs) | 360 |

Letter spacing: headings −2 %, body −1 %. Line height: headlines 100–112 %, body 125–140 %.

## Colors — `Theme` collection

| Variable | Dark (default) | Light | Use |
|---|---|---|---|
| `color/background` | #0A0A0A | #FFFFFF | Slide fill |
| `color/placeholder` | #1C1C1C | #EDEDED | Image placeholders, timeline bars |
| `color/text-primary` | #F5F5F2 | #000000 | Headlines, key text, logo |
| `color/text-body` | #F5F5F2 @ 60 % | #000000 @ 60 % | Body copy |
| `color/text-secondary` | #F5F5F2 @ 50 % | #000000 @ 50 % | Eyebrows, meta, labels, page numbers |
| `color/rule` | #F5F5F2 @ 15 % | #000000 @ 15 % | Rules, header bottom line |

**Never hard-code colors.** Bind every fill and stroke to these variables. Switch a deck to light by setting the
explicit mode on each slide frame: `frame.setExplicitVariableModeForCollection(theme, lightModeId)`.

## Header component

- Page `Components`, component `Header`: logo (vector, bound to `color/text-primary`) + section label + bottom rule.
- Text property whose key starts with `Section` controls the label. Find the key at runtime:
  `Object.keys(header.componentPropertyDefinitions).find(k => k.startsWith('Section'))`.
- Every slide has exactly one Header instance at (48, 48). The label is the chapter name (`Intro`, `Services`,
  `Work`, `Proof`, `Next steps`, `Contact`, `Scope`, `Timeline`, `Team`, `Investment`, `Kickoff`…).

## Layout library (`Slides` page)

Clone a layout, then edit its text layers **by layer name**. Keep layer names — the review scan relies on them.

| Layout | Use for | Text layers (by name) |
|---|---|---|
| `Layout / Cover` | Deck cover | `Cover title`, `Cover note` |
| `Layout / Index` | Agenda | `Title`, `Index number` ×5, `Index item` ×5 |
| `Layout / Statement` | One big sentence | `Eyebrow`, `Statement` (bottom-anchored at 920) |
| `Layout / Name meaning` | 簡素 slide | `Eyebrow`, `Kanji`, `Definition`, `Body` |
| `Layout / Logo wall` | Client logos | `Eyebrow`, `Headline`, `Image placeholder` ×4 |
| `Layout / Split text + image` | Studio, signature detail | `Eyebrow`, `Headline`, `Meta`, `Image placeholder` |
| `Layout / Four columns` | Services, process | `Eyebrow`, `Headline`, `Column number/title/body` ×4, `Note` |
| `Layout / Two-column contrast` | Usual way vs our way | `Eyebrow`, `Headline`, `Column label/headline/body` ×2 |
| `Layout / Three columns` | Next steps, scope, communication | `Eyebrow`, `Headline`, `Column number/title/meta/body` ×3 |
| `Layout / Stats` | Results, proof | `Eyebrow`, `Headline`, `Stat` ×4, `Stat label` ×4 |
| `Layout / Testimonials` | Quotes | `Eyebrow`, `Main quote`, `Main attribution`, `Supporting quote/attribution` ×2 |
| `Layout / Contact` | Closing | `Eyebrow`, `Headline`, `Contact name/details` ×3 |
| `Layout / Case cover` | Case study opener | `Eyebrow`, `Headline`, `Meta`, `Image placeholder` |
| `Layout / Visual grid` | Case visuals | `Image placeholder` ×3 |
| `Layout / Challenge & idea` | Case framing, brief understanding | `Eyebrow` ×2, `Column headline/body` ×2, `Feature title/body` ×3 |
| `Layout / Timeline` | Proposal / kickoff timeline | `Eyebrow`, `Headline`, `Week label` ×12, `Phase label` ×4, `Phase bar` ×4, `Milestones` |
| `Layout / Team grid` | Team | `Eyebrow`, `Headline`, `Image placeholder` ×4, `Person name/role` ×4 |
| `Layout / Investment` | Fee | `Eyebrow`, `Headline`, `Fee`, `Fee note`, `Column label`, `Payment items`, `Confidential` |
| `Layout / Scope in-out` | Scope, assumptions & risks | `Eyebrow`, `Headline`, `Column label/items` ×2, `Confidential` |
| `Layout / Checklist` | What we need from you | `Eyebrow`, `Headline`, `Item number/Item/Item meta` ×6, `Confidential` |
| `Layout / Section opener` | Chapter break (decks > 20 slides only) | `Eyebrow`, `Section title` |

Every layout except `Cover` has a `Page number` layer. Proposal and kickoff slides need a `Confidential` layer —
add it with the helper if the cloned layout does not have one.

Repeating items (columns, stats, checklist rows): when the content has fewer items than the layout, **remove** the
extra item layers rather than leaving them empty; when it has more, choose a different layout or split the slide.

## Build procedure

1. Read the copy approved in the previous step.
2. In the duplicated file, create a page `Deck — [Client] — [Deck type]`.
3. Paste `scripts/build-helpers.js` at the top of each `use_figma` script.
4. Clone layouts in order with `cloneLayout(name, deckPage, index, section)`, then set the text layers:
   - Stacked layers (index items): `setText(frame, name, text, i)`.
   - Side-by-side layers (columns, stats, quotes, contact blocks): `setText(frame, name, text, i, 'x')`.
   - List-style bodies (e.g. service sub-items): one item per line (`\n`), even if the copy document shows them joined with ` · `.
   - Image captions: `setCaptions(frame, [...])`.
   - Bottom-anchored text (`Statement`, `Meta` at 920; `Note` at 984): `anchorBottom(node, y)` after setting it.
   - Text under a heading (`Body`, `Column body`, `Stat label`, attributions): `stackBelow(heading, text, gap)` after setting both.
   - Unused layers: `removeAll(frame, name)` or `removeExtra(frame, names, keep)`.
5. Build **at most 5–6 slides per `use_figma` call.** Switch pages at most once per call.
6. After each call, screenshot the slides you built (`await frame.screenshot({ scale: 0.25 })`, max 5 per call).
7. When all slides exist: `setPageNumbers(deckPage)`, then run `scripts/review-scan.js`.

## API limits and gotchas

- **Lastik cannot be loaded by the MCP.** Editing characters, font size, or width of a text node that currently
  renders in Lastik throws — and a thrown error **rolls back the entire script**. Before editing, the helpers
  check `font/heading-family`; if it is not Instrument Serif, stop and ask the user to switch it back
  (`Instrument Serif` / `Regular`) for the duration of the edits.
- What still works on Lastik nodes: moving (x/y), opacity, fills, `clone()`, `remove()`.
- After the user switches headings to Lastik, headings get wider. Run `review-scan.js` and move body text that
  sits under a heading (`stackBelow`) — do not try to resize the Lastik text.
- `figma.notify()` is not available; `console.log` is invisible — always `return` results.
- Fonts must be loaded before any text mutation, including `appendChild` of cloned text.
- Keep image placeholders as frames with the `Image placeholder` name; the user drops real images into them.
