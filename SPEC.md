# kanso-decks — Decision record (v1)

A Claude skill that helps the Kanso team produce client decks that are on-brand, consistent, and fast to build.
This document captures the decisions made in the 2026-09-14 Q&A rounds. The skill files are written against it.

---

## 1. Scope

| Topic | Decision |
|---|---|
| Users | Designers, sales / business development, project managers, founders |
| Deck types (v1) | Intro, Proposal, Case study, Kickoff |
| Output | Figma Design file, 1920×1080 frames |
| Language | English by default |
| Surfaces | Claude desktop app, Claude Code CLI, claude.ai web |

## 2. Voice and copy rules

| Topic | Decision |
|---|---|
| Voice | Calm and minimal + confident |
| Headlines | Short sentences ending with a period ("How we work.") |
| Point of view | "We" |
| Never | Agency clichés (cutting-edge, world-class, synergy…), exclamation marks, emoji, long paragraphs |
| Numbers | Verified only; otherwise `[placeholder]`, added to the open-items list |
| Client names / logos | Clients published on the website are fine (Dataland, Derimod, Pro Legacy, Chiliz); anything else needs approval |
| Non-Kanso work | Team members' personal projects are never used as case studies |

## 3. Shared content

| Topic | Decision |
|---|---|
| Process phases | **Strategy → Design → Development → Support** (Support scope set per proposal) |
| Case library | v1: **Dataland** only (Derimod and Pro Legacy once their website case studies are published) |
| Team slide | Asked for every deck |
| Contact slide | Presenter (name, role, email) + hello@kanso.solutions |
| Confidentiality note | Proposal and kickoff: "Confidential — prepared for [Client]" |
| Source of truth | `references/kanso-facts.md` (verified facts only) |

## 4. Deck types

### Intro
- Length: **18–24 slides** (single standard)
- Baseline: the Client Introduction deck (Intro / Services / Work / Proof / Next steps)

### Proposal
- Pricing: **single project fee, USD**
- Asked during the proposal flow: fee, payment schedule (no default), validity (default 30 days, still confirmed),
  timeline, revision rounds, out-of-scope items, communication cadence
- Required sections: how we understand the brief · approach and process · timeline · team · scope in / out ·
  assumptions and risks · payment terms and validity · relevant case studies

### Case study
- Length: **depends on use** (short inside a proposal, medium/long as a standalone presentation)
- **Every case has a Results slide** (placeholder + flag when data is missing)

### Kickoff
- Required sections: goals and success criteria · team and roles · timeline and milestones ·
  communication cadence and tools · scope summary · what we need from the client · risks and dependencies · first two weeks
- Tools: **Slack, Google Docs**; cadence asked per project

## 5. Workflow

1. **Brief** — required: client name / industry / website · meeting type and presenter · client goal / problem
   (budget and timeline are asked only in the proposal flow)
2. **Outline** (slide list) → **approval**
3. **Copy** → **approval**
4. **Figma** — new file duplicated from the template, slides built
5. **Review** — screenshots, overlap/overflow scan, list of open `[placeholder]`s

## 6. Visual system (Figma)

| Topic | Decision |
|---|---|
| Template | **"Kanso Deck Template"** Figma file, shared by link |
| Each deck | A separate file duplicated from the template |
| Default theme | **Dark (#0A0A0A)**; light as an alternative |
| Header | Logo + section label (Geist Medium 24) + bottom rule, 48 px margin |
| Typography | Headings: Lastik (via Typography variables) · Body: Geist |
| Lastik | Variable method: build with Instrument Serif, the user switches the variable to Lastik, the skill then checks for overflow |

## 7. Research

- Source: deck.gallery public API (`/api/catalog/decks.json`), slide-level captions from 50 decks
- Use: **embedded patterns** (`references/deck-patterns.md`) — no live lookups
- Rule: structure only; no copy or imagery reproduced; sources credited

## 8. Distribution

- **Public** repo: `github.com/alicorak/kanso-decks` (the repo doubles as the marketplace). Changed from private on
  2026-09-15 so teammates can install without invites. Nothing secret lives in the repo; keep it that way
  (no prices, credentials, or unpublished client work).
- Install (desktop / CLI): `claude plugin marketplace add alicorak/kanso-decks` → `claude plugin install kanso-decks@kanso`
- Figma: the template is shared by link (view access); each teammate duplicates it into drafts on a team where they
  have a Full seat
- claude.ai web: skill upload — steps to be verified during packaging

## 9. First test

Regenerate the Client Introduction deck from scratch with the skill and compare it with the hand-built version.

**Result (2026-09-14): passed.**

- File: "Kanso — Intro — 2026-09-14" (duplicate of the template), page "Deck — Kanso — Intro".
- Flow followed as written: brief → outline (18 slides, approved) → copy (approved) → build in 3 scripts → review.
- Review scan in Instrument Serif: 18 slides, 0 overlaps / overflow / footer-zone / empty text; 15 expected placeholders.
- After the Lastik switch: overlaps on slides 10 and 12 (body under wrapped headlines) and the Index's last row
  2 px into the footer zone. Fixed with position moves only; rescan clean. Template Index layout moved up 12 px.
- Compared with the hand-built deck (22 slides): same structure and voice; placeholder-only Derimod case and the
  empty stats slide dropped (v1 case library = Dataland); process uses the new phase names; Dataland gains a
  Results slide.

**Changes made to the skill because of the test**

- `build-helpers.js`: `setText(…, 'x')` for side-by-side layers, `setCaptions`, `anchorBottom`, `removeAll`.
- `figma-system.md`: build procedure now spells out which helper to use for each kind of layer.
- `SKILL.md` troubleshooting: switch not yet visible to the MCP; one-word last lines after the Lastik switch.

**Known follow-ups**

- ~~In Lastik, headlines on slides 06, 10, 12 and 18 leave a single word on their last line.~~ Fixed 2026-09-15:
  a full Lastik screenshot pass found six such headlines (06, 07, 10 ×2, 12, 18). Heading variables were set to
  Instrument Serif through the API, manual line breaks were added without changing the words, the user switched
  back to Lastik, and the rescan was clean with every headline on balanced lines. Method documented in SKILL.md.
- Lastik draws the curly double quotes on slide 16 like single quotes (font glyph). Check with the type designer
  or use straight quotes in Lastik headings.
- claude.ai web installation is still unverified.
