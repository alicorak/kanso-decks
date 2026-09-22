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

## 2. Proposal deck — 8 slides

Presented after the scoping call. Goal: the client can decide and sign — what we'll do, when, what's in, what it costs.
How we work together after signing (the people and their roles, communication, first two weeks) belongs in the kickoff deck.
Every slide except the cover: `addConfidential(frame, client)` → footer reads `Confidential — prepared for [Client]`.

### Extra intake (proposal only)

The answers come from the **scoping call**, held before the proposal: Kanso fills the scoping sheets in the call, so
the client gets no homework at this stage (source file, `Discovery & Workshop` page: `Scoping — Shared` pages 1 and 3,
plus the `Scoping — Variant · [Service]` page). Ask the user for the filled sheets, or work through these questions.

| # | Question | Default |
|---|---|---|
| 1 | Project fee (single fee, USD) | none — ask |
| 2 | Payment schedule | none — ask |
| 3 | Proposal validity | 15 days — confirm |
| 4 | Timeline: start date and duration per phase, key milestones | none — ask |
| 5 | Which phases are in scope, and what Support covers | Strategy · Design · Development · Support — confirm |
| 6 | Revision rounds | none — ask |
| 7 | Out-of-scope items | none — ask (suggest candidates from the brief) |
| 8 | Relevant case (optional slide) | Only if close to this project or read by people who missed the intro; Dataland for app / end-to-end |
| 9 | Google Docs signing link for this proposal (Kanso signs proposals with Google Docs eSignature) | none — keep `[e-sign link]` and list it under Open items |

**Never ask the client the deep questions before signing.** Audience, positioning, tone and references are the work
itself — they belong to the discovery form the client fills after signing (see the kickoff flow).

### Flow

| # | Layout | Content | Required |
|---|---|---|---|
| 1 | Cover | Client name + project title; footer meta = date | Yes |
| 2 | Challenge & idea | **How we understand the brief** — situation · problem · goals · success criteria | Yes |
| 3 | Proposal / What we propose | **What we propose** — one sentence, then "Our approach": a Lastik 42 line and a short body. Note = service | Yes |
| 4 | Proposal / Process & timeline | **Process & timeline** — title "[x] weeks from kickoff to launch."; four phase rows, each with a key deliverable under the phase name and a bar across 12 weeks; milestones line | Yes |
| 5 | Proposal / Scope | **Scope** — "What's in, and what's not.": In scope · Assumptions · Out of scope · Risks (3–5 short items each). No team line | Yes |
| 6 | Case cover + result row + optional quote | **Relevant work** — one case close to this project, one result, an optional verbatim quote (25 words or fewer) | Optional |
| 7 | Investment | **Investment & signing** — payment schedule, single fee in USD with what it covers, **Sign button** (helper: validity), Note: what signing confirms + kickoff within 5 days | Yes |
| 8 | Contact | Presenter + hello@ | Yes |

**Short by design.** No separate Approach, Process, Team, Assumptions or Next steps slides: approach sits on What
we propose, process and timeline are one slide, assumptions and risks are short columns on Scope, and the Investment
note says what happens after signing. The proposal names no people: the team (names, roles, faces), communication
cadence and the first two weeks go to the kickoff deck.

**Proof.** The intro deck already shows Kanso's work and testimonials, so a proposal doesn't repeat them: no
testimonials slide, and slide 6 only when the case is close to this project or the proposal will reach people who
didn't see the intro.

**Service variants.** Slides 3–5 change with the service (brand, mobile app / digital product, end-to-end,
website): the approach line, key deliverables, timeline length and bars, milestones and scope columns.
Phase names never change. Reference build: the Proposal page of the Client Introduction file (sections Shared and
Variant — Brand / Mobile app / End-to-end / Website).

**Signing.** The fee and the way to sign sit on the same slide: Investment ends with the Sign button
("Signed in Google Docs · valid until [date]"), linked with `setSignLink` to the Google Docs signing link. There is no
separate Acceptance slide and no signature block — the signature lives in the Google Doc. Only the client signs.
Footers read `NN / 08` (`NN / 07` without Relevant work); renumber if slides are removed.

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

## 4. Kickoff deck — 11 slides

First meeting after signing, held within **5 days** of signing. Goal: both teams leave aligned on goals, people,
rhythm, and the next two weeks. The kickoff doesn't sell again: no fee, no signing, no case studies; scope and
timeline come from the signed proposal. Every slide except the cover: `addConfidential(frame, client)`.

### Extra intake (kickoff only)

| # | Question | Default |
|---|---|---|
| 1 | The signed proposal (or its scope, timeline and service) and the signing date | none — ask |
| 2 | Goals and how success will be measured (metric, target, date) | none — ask |
| 3 | Team on both sides: names, roles, decision-maker, day-to-day contact | none — ask |
| 4 | Communication: check-in day and time, response time, design files link | Slack, Google Docs · weekly check-in · messages answered within one working day — confirm |
| 5 | Feedback: days to reply, revision rounds, who signs off | From the proposal — confirm |
| 6 | What we need from the client, with owner and date | Service defaults — confirm |
| 7 | First two weeks: workshop, research, first deliverable | Service defaults — confirm |
| 8 | Has the client filled the discovery form yet? | Send it with the kickoff invite; it prepares the workshop |

**Workshop (after signing).** Two scripts cover every service — `Workshop — Brand` and `Workshop — Product` (mobile
app, website, end-to-end; a 90-minute cut for small jobs) — on the source file's `Workshop` page. Each has an internal
run sheet and a client preparation form, sent with the kickoff invite.

The split that keeps them apart: **scoping collects facts** (what exists, what connects, what dates, who signs),
**preparation asks for judgement** (what you believe, who you would choose, what you would give up), **the workshop
takes the decisions** (primary audience, promise, not-list, or journeys, day-one line, metric), and **we write the
document** — positioning for brand, a scope note for product. That document is Gate 1; design starts once it is
approved. Never move a question up a stage: a prospect gets no homework, and nothing answerable in writing eats
workshop time.

**The Gate 1 document.** Written within two working days of the workshop, from the source file's `Workshop` page:
`Gate 1 — Positioning document` for brand, `Gate 1 — Scope note` for product. Two pages each — the decision and its
approval first, the reasoning second. Fill every `[placeholder]` from what the room actually decided; anything the
workshop left open goes in the open-questions rows with an owner and a date, never quietly resolved by us. The scope
note outranks the signed proposal where they disagree, because it is the later decision.

**Say the consequence, not the mechanism.** In anything a client reads, write “once you approve the positioning we
start design”, never “Gate 1”. The same goes for `not-list`, `day-one line` and `run sheet`: useful between us,
bureaucratic in front of them.

### Flow

| # | Layout | Content | Required |
|---|---|---|---|
| 1 | Cover | "Kickoff for" + project name; footer meta = client · kickoff date | Yes |
| 2 | Kickoff / Statement | **Why we're here** — the project goal in one sentence; Note: proposal signed on [date] | Yes |
| 3 | Kickoff / Three columns | **What success looks like.** — three goals, each with measure · target · by | Yes |
| 4 | Kickoff / Team | **Who you'll work with.** — Kanso (photos) and client (no photos), roles, decision-maker, day-to-day contact | Yes |
| 5 | Kickoff / Scope recap | **What we agreed.** — in / out from the signed proposal; "Anything new is scoped and priced separately." | Yes |
| 6 | Kickoff / Rows | **Plan** — "[x] weeks, phase by phase.": four phase rows with the work inside, weeks and sign-off | Yes · variant |
| 7 | Kickoff / Three columns | **How we work together.** — channels (Slack, Google Docs) · meetings · response times | Yes |
| 8 | Kickoff / Rows | **How feedback and sign-off work.** — Review → Feedback → Revise → Sign-off | Yes |
| 9 | Kickoff / Rows | **What we need from you.** — six inputs with owner and date; Note: late inputs move the dates after them | Yes · variant |
| 10 | Kickoff / Rows | **The first two weeks.** — W1/W2 rows: kickoff, access, workshop, research, check-in, first deliverable | Yes |
| 11 | Contact | **Let's get started.** — Studio hello@, Kanso project lead, client contact | Yes |

**Risks.** No separate slide: the proposal already lists them. Late inputs are covered on 9, feedback timing on 7 and 8.

**Service variants.** Slides 6 and 9 change with the service (brand, mobile app, end-to-end, website); slide 10's
workshop, research and first deliverable follow the service too. Reference build: the Kickoff page of the Client
Introduction file.

---

## 5. Proforma invoice — 1 A4 page

A payment request sent as a PDF for one milestone of a signed proposal. It is **not** the official invoice — that one
is issued from the accounting system once payment is received. One proforma per payment milestone, in USD.
No outline or copy step: fill the intake, show the filled values for approval ⏸, then build and review.

### Intake (invoice only)

| # | Question | Default |
|---|---|---|
| 1 | Invoice number — the last KNS number used (the skill can't know it) | none — ask; next = last + 1, format `KNS-YYYY-NNN` |
| 2 | Client legal name, address, VAT / tax ID, contact name and email | none — ask |
| 3 | Project name, proposal signing date, project fee | From the signed proposal |
| 4 | Which milestone this invoice is for, with a one-line description | none — ask |
| 5 | The full payment schedule (milestone · share) and which milestones are already paid | From the proposal — confirm paid ones |
| 6 | Issue date | Today |
| 7 | Theme | Light (print) · Dark on request |

Due date = issue date + **14 days**. Amount = share × project fee. Subtotal = amount. Total due = amount + VAT.
VAT line stays as it is in the source file unless the user gives the wording.

### Sections (top to bottom)

| # | Section | Content |
|---|---|---|
| 1 | Header | Logo · Invoice no. · Issue date · Due date |
| 2 | Title | Proforma invoice *(fixed)* |
| 3 | Parties | Project (name, signed on, fee) · From (Kanso — prefilled in the source file) · Bill to (client) |
| 4 | Line item | Milestone · description · share of fee · amount |
| 5 | Totals | Subtotal · VAT · Total due (USD) |
| 6 | Payment schedule | Every milestone with share, amount and status: Paid · This invoice · Upcoming |
| 7 | Pay by bank transfer | Bank details prefilled in the source file · Reference = invoice number |
| 8 | Footer | Proforma note *(fixed)* · kanso.solutions · hello@kanso.solutions · Page 1 / 1 |

### Retainer mode

For clients on a **fixed monthly fee, billed in advance** at the start of each month. Same A4 design without the
payment schedule; the source frame is `Invoice — Retainer`.

| # | Question | Default |
|---|---|---|
| 1 | Invoice number — the last KNS number used | none — ask |
| 2 | Client legal name, address, VAT / tax ID, contact | From the previous retainer invoice if the user has it |
| 3 | Retainer name, start date, monthly fee | none — ask |
| 4 | Month billed | The current month |
| 5 | Scope line (one line on what the retainer covers) | none — ask |
| 6 | Is any earlier month unpaid? | No — add an Outstanding line only if the user says yes |
| 7 | Theme | Light |

Retainer invoice sections: Header · Title · Retainer (name, since, monthly fee) · From · Bill to · Line item
(Retainer — Month YYYY · scope · period 1–last day of the month · fee) · Totals (Subtotal · VAT · optional Outstanding ·
Total due) · Pay by bank transfer · Note. Work outside the retainer is invoiced separately, never added to this one.

**Kanso's company and bank details are entered only in the Figma source file.** Never ask for them, never write them
into chat copy, files, or this repo — the build copies them from the source frame.

---

## Rules for all flows

- One idea per slide. If a slide needs two headlines, split it.
- Section openers only in decks over 20 slides, at most one per chapter.
- Never repeat the positioning statement.
- The contact slide is the last slide — no separate thank-you slide.
- Every case study shown anywhere has a Results (Stats) slide or result row.
- Use Stats as rows for any numbered list with a label and a right-aligned meta (process with durations, proof, approvals).
