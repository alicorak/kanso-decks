---
name: kanso-decks
description: Build on-brand Kanso client presentations in Figma — intro/capabilities decks, proposals, case studies, and project kickoffs. Use whenever someone at Kanso asks for a deck, pitch, presentation, proposal, case study slides, kickoff slides, or slide copy for a client meeting, even if they don't name the deck type. Handles the brief, outline, copy, Figma build from the Kanso Deck Template, and a final layout review, with approval between steps.
---

# Kanso decks

You help the Kanso team (designers, sales, project managers, founders) produce client decks that sound and look
like Kanso: calm, minimal, confident, and built only on verified facts.

Kanso is an independent design & development studio in Istanbul, founded in 2020 as Echo Studio.
Everything about the studio you may state lives in `references/kanso-facts.md`.

## Before you start

Check these once per session. If one fails, tell the user exactly what to fix and stop.

1. **Figma MCP is connected** and `whoami` shows an account with a **Full** seat on the team that owns the deck file
   (View seats cannot write).
2. **The `figma-use` skill is loaded** before any `use_figma` call (Figma plugin skill, or `skill://figma/figma-use`).
3. The user can **duplicate the Kanso Deck Template** in Figma
   (https://www.figma.com/design/Hc5KB8bcdQZHG19ZTI6OIA). The MCP cannot duplicate files.

## Which file to read, when

| Step | Read |
|---|---|
| Intake and outline | `references/deck-flows.md` (flows + intake questions), `references/kanso-facts.md` |
| Writing copy | `references/copy-rules.md`, `references/kanso-facts.md` |
| Questions about why a structure works | `references/deck-patterns.md` (deck.gallery research — structure only) |
| Figma build and review | `references/figma-system.md`, `scripts/build-helpers.js`, `scripts/review-scan.js` |

Read only what the current step needs.

## Workflow

Work in this order. **Stop for approval at every ⏸.** Never skip ahead because the answer seems obvious.

### 1. Brief

Ask the shared intake questions from `deck-flows.md` in a single message, plus the extra intake for the deck type.
Required before continuing: deck type · client name, industry, website · meeting type and presenter
(name, role, email) · the client's goal or problem.

- Proposal only: also ask the client's e-sign link (or keep `[e-sign link]`), fee (USD, single fee), payment schedule, validity (default 15 days — confirm), timeline,
  phases in scope and what Support covers, revision rounds, out-of-scope items, days from signing to kickoff.
  The proposal is short (9 slides): the team (names and roles), communication cadence and the first two weeks belong to the kickoff deck.
- Kickoff only: goals and success measures, both teams, milestones, cadence, client inputs, risks, first two weeks.
- If a website is given, read it to understand the client. Never copy its text onto slides.
- Missing optional answers become `[placeholders]`. Do not invent them.

### 2. Outline ⏸

Present a numbered slide list: `# · Section · Layout · What the slide says (one line)`.
Use the flow for the deck type in `deck-flows.md`; mark optional slides you included and why.
State the slide count against the target range. Wait for approval or edits.

### 3. Copy ⏸

Write every slide's text in a single markdown document, grouped by slide, using the layer names from
`figma-system.md` (Eyebrow, Headline, Column title…). Follow `copy-rules.md` strictly.
End with **Open items** — every `[placeholder]` and every fact the user must confirm.
Save the copy to a file if the environment has a filesystem (e.g. `[client]-[deck-type]-copy.md`); otherwise keep it
in the conversation. Wait for approval or edits.

### 4. Figma file

Ask the user to duplicate the template, rename it `[Client] — [Deck type] — [YYYY-MM-DD]`, and paste the link.
Confirm the file opens and the headings are still in Instrument Serif (see `figma-system.md` → API limits).
If duplication is impossible, use the bootstrap fallback described there and say what is missing.

### 5. Build

Follow `figma-system.md` → Build procedure:
- New page `Deck — [Client] — [Deck type]`; clone layouts in outline order; edit text by layer name.
- Paste `scripts/build-helpers.js` at the top of every script. At most 5–6 slides per call.
- Screenshot what you built after each call and fix problems before continuing.
- Theme: dark unless the brief says light (`setTheme`).
- Proposal and kickoff: `addConfidential(frame, client)` on every slide except the cover (sets the Footer's Meta to
  `Confidential — prepared for [Client]`).
- Body copy renders uppercase through the layout's text case — keep the copy itself in sentence case.
- Proposal signing: Investment ends with the Sign button and the Acceptance slide follows it (see `deck-flows.md` →
  Proposal and `figma-system.md` → Build procedure). Link both buttons with `setSignLink(frame, url)` when the brief
  has a URL; the review scan flags any unlinked button.
- Finish with `setPageNumbers`.

### 6. Review ⏸

Run `scripts/review-scan.js`. Fix overlaps, overflow, footer-zone hits, and empty text. Then report to the user:

1. Link to the deck page.
2. What was built (slide count, layouts used).
3. **Open items**: remaining placeholders, facts to confirm, images to add.
4. **Final step for the user:** switch `font/heading-family` to `Lastik` and `font/heading-style` to `Free`
   in the Typography variables — then ask you to run the scan again. After the switch, headings are wider:
   move text below headings with `stackBelow`; never try to resize Lastik text.

## Hard rules

- **Facts:** state only what is in `kanso-facts.md` or the user's brief. Numbers, dates, prices, client names,
  awards, durations — if unverified, use a `[placeholder]` and list it in Open items.
- **A price always leads to signing:** any deck that shows a fee also shows how to sign (Sign button + Acceptance
  slide). Never invent an e-sign URL — keep `[e-sign link]` and list it under Open items.
- **Kanso work only:** the case library is in `kanso-facts.md` (v1: Dataland). Team members' personal projects
  are never Kanso case studies. Other projects need a brief from the user; their facts stay placeholders until given.
- **Every case study has a Results slide or result line**, even if it is a placeholder.
- **Client names and logos:** those published on kanso.solutions are fine; ask before using any other.
- **Testimonials are verbatim.** Never edit or merge quotes.
- **English by default.** Another language only when the brief asks for it.
- **Process phases** are always Strategy → Design → Development → Support.
- **Bind, don't hard-code:** every color and font in Figma is bound to the template variables.
- **Research is structure only:** never reproduce copy or imagery from deck.gallery decks.

## When something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| `use_figma` says no edit access | View seat or wrong account | User reconnects the Figma MCP with a Full-seat account |
| `Cannot write to node with unloaded font "Lastik Free"` | Headings already switched to Lastik | User sets `font/heading-family` = Instrument Serif, `font/heading-style` = Regular; rerun; switch back after |
| `Missing variable …` | File is not a template copy | Ask for a duplicate of the template, or use the bootstrap fallback |
| A script fails halfway | Scripts are atomic — nothing was applied | Read the error, fix, rerun the same script |
| Review scan reports a spill (content taller than its column) | Copy longer than the layout — layouts are auto-layout, so text pushes siblings instead of overlapping | Shorten copy (preferred), remove list items with `removeListItems`, or move the content to a layout with more room; never shrink below the type scale |
| User says headings are switched, but the scan still reads Instrument Serif | The change isn't saved in the file the MCP reads yet (value not confirmed with Enter, a different copy, or sync delay) | Report the exact variable values you read and the file key; ask the user to confirm the value with Enter in *this* file and to check the headings visibly changed; scan again. Never report a Lastik check as passed while `font/heading-family` reads Instrument Serif |
| After the Lastik switch a headline leaves one word alone on its last line | Lastik is wider than Instrument Serif | Screenshot every slide in Lastik and list the affected headlines. Then, in one script, set `font/heading-family` / `font/heading-style` to Instrument Serif / Regular via `setValueForMode`, and add a manual line break (`\n`) where the Lastik render shows the first line can end — never change the words. Ask the user to switch back to Lastik, rescan, and `stackBelow` any text the new line counts push into. Don't set the variable to Lastik from the API: the MCP can't lay text out in Lastik |
