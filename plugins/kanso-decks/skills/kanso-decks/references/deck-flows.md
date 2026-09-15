# Deck flows

Slide sequences and intake questions for the four deck types. Each flow lists the layout (see
`figma-system.md` → Layout library for layer names), what goes on it, and whether it is required.

Structure is informed by `deck-patterns.md` (deck.gallery research); Kanso-specific decisions come from `SPEC.md`.
**Required** slides are always in the outline. **Optional** slides are proposed when the brief supports them.

---

## Shared intake (every deck)

Ask these first, in one message. Do not start the outline until the required answers are in.

| # | Question | Required |
|---|---|---|
| 1 | Which deck type: intro, proposal, case study, or kickoff? | Yes |
| 2 | Client name, industry, and website | Yes |
| 3 | Meeting type (first intro, proposal presentation, kickoff…) and who is presenting (name, role, email) | Yes |
| 4 | The client's goal or problem — paste meeting notes or the email thread if you have them | Yes |
| 5 | Theme: dark (default) or light? | No — default dark |
| 6 | Language, if not English | No — default English |

If a website is given, read it to understand the client before drafting. Never copy its text onto slides.

---

## 1. Intro deck — 18–24 slides

First-contact meeting. Goal: the client understands who we are, what we do, and what happens next.

### Extra intake
- Is there a specific project or service to emphasise? (Otherwise present all four services equally.)
- Which case studies to show? (v1 library: Dataland.)

### Flow

| # | Section | Layout | Content | Required |
|---|---|---|---|---|
| 1 | Intro | Cover | "We are / Kanso" · footer "*formerly Echo Studio" | Yes |
| 2 | Intro | Index | Intro · Services · Work · Proof · Next steps | Yes |
| 3 | Intro | Statement | Title "Who we are" · positioning line | Yes |
| 4 | Intro | Name meaning | Title · definition of 簡素 + how it shapes our work | Yes |
| 5 | Intro | Logo wall | Established clients and founders (one sentence, two logo rows) | Yes |
| 6 | Intro | Split text + image | Studio: independent, Istanbul, since 2020, team size `[x]` | Yes |
| 7 | Services | Section opener | "Services and approach" | Optional (decks > 20 slides) |
| 8 | Services | Four columns | Brand · Design · Experience · Development with sub-services | Yes |
| 9 | Services | Stats *(as rows)* or Four columns | Process: Strategy · Design · Development · Support | Yes |
| 10 | Services | Mark statement | Design and code at the same table | Yes |
| 11 | Work | Section opener | "Case studies" | Optional |
| 12–16 | Work | Case study block (§3, intro length) | Case cover · Challenge & idea · Visual grid · **Stats (results)** | Yes (≥ 1 case) |
| 17 | Proof | Testimonials | Three quotes, verbatim | Yes |
| 18 | Proof | Stats | Verified numbers only; placeholders flagged | Optional |
| 19 | Next steps | Three columns | Discovery call · Workshop · Proposal (first column is "Now") | Yes |
| 20 | Next steps | Contact | Title "Let's make something that outlives the brief." · presenter + hello@ | Yes |

---

## 2. Proposal deck — 12–20 slides

Presented after discovery. Goal: the client can approve scope, timeline, team, and fee.
Every slide except the cover: `addConfidential(frame, client)` → footer reads `Confidential — prepared for [Client]`.

### Extra intake (proposal only)

| # | Question | Default |
|---|---|---|
| 1 | Project fee (single fee, USD) | none — ask |
| 2 | Payment schedule | none — ask |
| 3 | Proposal validity | 30 days — confirm |
| 4 | Timeline: start date and duration per phase | none — ask |
| 5 | Which phases are in scope, and what Support covers | Strategy · Design · Development · Support — confirm |
| 6 | Revision rounds | none — ask |
| 7 | Out-of-scope items | none — ask (suggest candidates from the brief) |
| 8 | Communication cadence | none — ask |
| 9 | Team on this project (names, roles) | none — ask |
| 10 | Relevant case studies | Dataland if relevant |

### Flow

| # | Layout | Content | Required |
|---|---|---|---|
| 1 | Cover | Client name + project title; footer meta = date | Yes |
| 2 | Statement | What we propose, in one sentence | Yes |
| 3 | Challenge & idea | **How we understand the brief** — situation · problem · goals · success criteria | Yes |
| 4 | Mark statement | **Our approach** — the core idea | Yes |
| 5 | Four columns | **Process**: phases in scope with activities and deliverables | Yes |
| 6 | Timeline | **Timeline** — phases across weeks, milestones | Yes |
| 7 | Scope in-out | **Scope in / out** | Yes |
| 8 | Team grid | **Team** — who works on this, roles | Yes |
| 9 | Case cover + Stats | **Relevant work** — 1–2 short cases, each with a result | Yes |
| 10 | Testimonials | Quotes relevant to the project | Optional |
| 11 | Scope in-out | **Assumptions and risks** — incl. revision rounds, client inputs | Yes |
| 12 | Investment | **Investment** — single fee in USD, payment schedule, validity | Yes |
| 13 | Three columns | Next steps: approval → kickoff date → first two weeks | Yes |
| 14 | Contact | Presenter + hello@ | Yes |

---

## 3. Case study — length depends on use

| Use | Length | Layouts |
|---|---|---|
| Inside a proposal | 2–3 | Case cover · Visual grid · **Stats** |
| Inside an intro deck | 4–5 | Case cover · Challenge & idea · Visual grid · **Stats** |
| Standalone presentation | 8–12 | Full flow below |

### Extra intake
- Which project? (v1 library: Dataland. Other projects need a brief from the user — all facts become placeholders otherwise.)
- Audience: prospective client in the same industry, or general?

### Standalone flow

| # | Layout | Content | Required |
|---|---|---|---|
| 1 | Case cover | Client name · one-line headline · location, year · platforms | Yes |
| 2 | Challenge & idea | The challenge · The idea · Deliverables & services · In numbers | Yes |
| 3 | Visual grid | Hero visuals | Yes |
| 4 | Split text + image | Signature detail (e.g. boot sequence) | Optional |
| 5 | Visual grid | Design system | Optional |
| 6 | Three columns | Key features / screens | Yes |
| 7 | Visual grid | Product screens | Optional |
| 8 | Stats | **Results** — verified numbers or placeholders | **Always** |
| 9 | Testimonials | Client quote (verbatim) | If available |
| 10 | Contact | Presenter + hello@ | Standalone only |

---

## 4. Kickoff deck — 10–16 slides

First meeting after signing. Goal: both teams leave aligned on goals, roles, rhythm, and the next two weeks.
Every slide except the cover: `addConfidential(frame, client)`.

### Extra intake (kickoff only)

| # | Question |
|---|---|
| 1 | Goals and how success will be measured |
| 2 | Team on both sides: names, roles, decision-maker, day-to-day contact |
| 3 | Timeline and milestones (from the signed proposal if available) |
| 4 | Communication cadence (tools default: Slack, Google Docs) |
| 5 | What we need from the client: access, assets, content, approvals |
| 6 | Known risks and dependencies |
| 7 | Plan for the first two weeks |

### Flow

| # | Layout | Content | Required |
|---|---|---|---|
| 1 | Cover | Project name + client; footer meta = kickoff date | Yes |
| 2 | Statement | Why we're here — the project goal in one sentence | Yes |
| 3 | Three columns | **Goals and success criteria** | Yes |
| 4 | Scope in-out | **Scope summary** — in / out | Yes |
| 5 | Team grid | **Team and roles** — both sides | Yes |
| 6 | Four columns | Process: Strategy · Design · Development · Support | Yes |
| 7 | Timeline | **Timeline and milestones** | Yes |
| 8 | Three columns | **Communication cadence and tools** — Slack, Google Docs, meeting rhythm | Yes |
| 9 | Stats *(as rows)* | Feedback and approval: how rounds work, who signs off | Optional |
| 10 | Checklist | **What we need from you** | Yes |
| 11 | Scope in-out | **Risks and dependencies** | Yes |
| 12 | Checklist | **First two weeks** | Yes |
| 13 | Contact | Day-to-day contacts on both sides | Yes |

---

## Rules for all flows

- One idea per slide. If a slide needs two headlines, split it.
- Section openers only in decks over 20 slides, at most one per chapter.
- Never repeat the positioning statement.
- The contact slide is the last slide — no separate thank-you slide.
- Every case study shown anywhere has a Results (Stats) slide or result row.
- Use Stats as rows for any numbered list with a label and a right-aligned meta (process with durations, proof, approvals).
