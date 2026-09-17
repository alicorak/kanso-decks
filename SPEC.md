# kanso-decks — Decision record (v1)

A Claude skill that helps the Kanso team produce client decks that are on-brand, consistent, and fast to build.
This document captures the decisions made in the 2026-09-14 Q&A rounds. The skill files are written against it.

---

## 1. Scope

| Topic | Decision |
|---|---|
| Users | Designers, sales / business development, project managers, founders |
| Deck types (v1) | Intro, Proposal, Case study, Kickoff · plus Proforma invoice (A4, 2026-09-17) |
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
| Team slide | Intro and kickoff; proposals name no people (v1.3) |
| Contact slide | Presenter (name, role, email) + hello@kanso.solutions |
| Confidentiality note | Proposal and kickoff: "Confidential — prepared for [Client]" |
| Source of truth | `references/kanso-facts.md` (verified facts only) |

## 4. Deck types

### Intro
- Length: **18–24 slides** (single standard)
- Baseline: the Client Introduction deck (Intro / Services / Work / Proof / Next steps)

### Proposal
- Pricing: **single project fee, USD**
- Asked during the proposal flow: fee, payment schedule (no default), validity (default 15 days, still confirmed),
  timeline, revision rounds, out-of-scope items; kickoff within 5 days of signing (standard)
- Required sections (v1.3): how we understand the brief · what we propose + approach · process & timeline ·
  scope (in / assumptions / out / risks) · investment, validity and signing · contact;
  relevant work optional
- **Signing (2026-09-16):** wherever the fee appears, the client is led to sign. Investment ends with a
  "Sign the proposal →" button linked to the client's e-sign tool (tool not fixed; `[e-sign link]` per client), and a
  new Acceptance slide follows with the same button plus a client-only signature block as a print/PDF backup.
  (Superseded: see v1.4 below.)
- **Leaner proof (2026-09-16):** proposals don't repeat the intro's proof — no Result or Testimonials slides; one
  optional Relevant work slide (case + one result + optional verbatim quote) when the case is close to the project.
- **Short proposal (v1.3, 2026-09-16):** the proposal holds only what the client needs to decide and sign.
  9 slides: Cover · How we understand the brief · What we propose (+ approach) · Process & timeline · Scope
  (in / assumptions / out / risks as short columns) · Relevant work (optional) · Investment ·
  Acceptance · Contact. Removed: separate Approach, Process, Timeline, Team, Assumptions & risks, and Next steps
  slides. The team (names, roles, faces), communication cadence and the first two weeks move to the kickoff deck;
  the proposal names no people. Scope colours: commitments (in, assumptions) accent, exclusions and risks red. Service variants
  change slides 3–5.
- **Signing in Google Docs (v1.4, 2026-09-16):** Kanso signs proposals with Google Docs eSignature, so the signature
  lives in the Doc and a signature block on a slide adds nothing. Acceptance is removed; Investment carries the fee,
  the Sign button ("Signed in Google Docs · valid until [date]") and the note on what signing confirms, with kickoff
  within 5 days. The proposal is **8 slides** (7 without Relevant work).

### Case study
- Length: **depends on use** (short inside a proposal, medium/long as a standalone presentation)
- **Every case has a Results slide** (placeholder + flag when data is missing)

### Kickoff
- **11 slides (2026-09-16):** Cover · Why we're here · Goals & success · Team · Scope recap · Plan (variant) ·
  How we work together · Reviews & approvals · What we need from you (variant) · First two weeks · Contact
- Held within **5 days** of signing; no fee, signing or case studies; no separate risks slide (late inputs, feedback
  timing and approvals cover them)
- Tools: **Slack, Google Docs**; cadence asked per project

### Proforma invoice (2026-09-17)
- A4 payment request per proposal milestone, USD, sent as PDF; the official invoice comes from accounting after payment
- Numbering `KNS-YYYY-NNN` (the user gives the last number) · due = issue + 14 days · bank fees paid by the sender
- Retainer mode (2026-09-17): fixed monthly fee billed in advance; same design without the payment schedule; an
  Outstanding line only when a month is unpaid; work outside the retainer is invoiced separately
- Source: `Invoice` page of the Client Introduction file, Proforma and Retainer frames in Light (default) and Dark; Kanso company and bank
  details live only there, never in this repo

## 5. Workflow

1. **Brief** — required: client name / industry / website · meeting type and presenter · client goal / problem
   (budget and timeline are asked only in the proposal flow)
2. **Outline** (slide list) → **approval**
3. **Copy** → **approval**
4. **Figma** — new file duplicated from the source file, slides built
5. **Review** — screenshots, overlap/overflow scan, list of open `[placeholder]`s

## 6. Visual system (Figma)

| Topic | Decision |
|---|---|
| Source file | **Client Introduction** Figma file (intro, proposal and kickoff pages), shared by link. The "Kanso Deck Template" was archived on 2026-09-16 |
| Each deck | A separate file duplicated from the source file; slides are cloned from its pages |
| Default theme | **Dark**: gradient #000000 → #141414 (top → bottom); light as an alternative |
| UI version | **v2 (2026-09-15)** — follows the redesigned Client Introduction deck (UI only, copy unchanged) |
| Header / footer | Full-width bars: header 1920 × 105 (logo + UPPERCASE section label + rule), footer 1920 × 102 (meta + page number) |
| Grid | Title column 432 + content column 1360, or four 432 columns with rules; all auto-layout |
| Typography | Headings: Lastik (via Typography variables) 150 / 96 / 60 / 42 / 32 · Body: Geist Medium, UPPERCASE labels and body |
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
- Figma: the source file is shared by link (view access); each teammate duplicates it into drafts on a team where they
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
