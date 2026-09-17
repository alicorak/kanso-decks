# Copy rules

Every word on a Kanso slide follows these rules. Check the draft against this file before showing it for approval.

## Voice

**Calm, minimal, confident.** We say less, and we mean it. Confidence comes from specifics and proof, never from
adjectives. The studio is named after a principle of removing clutter — the copy should feel like that.

- Point of view: **"we"** for Kanso, **"you"** for the client. Use "Kanso" only on the cover, the contact slide,
  and when quoting others.
- Default language: **English** (US spelling). Write another language only when the brief asks for it.
- Tone check: would a senior designer say this out loud in a meeting without feeling awkward? If not, rewrite.

## Slide text anatomy

| Element | Rule | Limit |
|---|---|---|
| Eyebrow | Short label above the headline, sentence case, no period | 1–4 words |
| Headline | One idea, a complete short sentence, **ends with a period** | ≤ 10 words (≤ 2 lines at 96–120 px) |
| Body | Supports the headline; plain sentences | ≤ 2–3 sentences, ≤ 45 words |
| List items | Nouns or short phrases, parallel grammar, no end punctuation | ≤ 6 items, ≤ 5 words each |
| Captions / meta | Facts separated by " · " | 1 line |
| Section label (header) | Chapter name, title case, no period | 1–3 words |

**Layout conventions (UI v2).** The left-column `Title` (Lastik 60) carries the slide's main idea in ≤ 6 words;
headlines, list items and column titles are Lastik 42. Labels, body and list text render **uppercase** through the
layout's text case — always write them in sentence case in the copy document. Keep uppercase lines short: body
≤ 30 words, list items ≤ 5 words.

Exceptions to "headline ends with a period": the cover line ("We are Kanso"), section openers, questions
("Why should this app ever be opened at all?"), and numbers used as headlines ("2,000+").

## Headlines that work

Make a claim, not a label. The headline is the takeaway if someone reads nothing else.

| Weak (label) | Strong (claim) |
|---|---|
| Our process | How we work. |
| Why Kanso | Design and code, at the same table. |
| Project timeline | Twelve weeks from kickoff to launch. *(only if the timeline is confirmed)* |
| Results | [Metric] in the first [period]. |

Techniques that fit the brand:
- **Split one sentence across two slides** for emphasis ("We partner with established brands…" → "…and the founders building what comes next.").
- **Contrast** the usual way with our way, in two columns.
- **Questions** only when they frame a real problem the next slide answers.

## Never

- **Agency clichés:** cutting-edge, world-class, best-in-class, innovative solutions, synergy, seamless, leverage,
  game-changer, next-level, disruptive, passionate, holistic, 360°, end-to-end *(say what we actually do instead)*.
- **Exclamation marks and emoji.**
- **Long paragraphs.** If body copy runs past three sentences, split the slide or cut.
- **Superlatives without proof** ("the fastest", "the best").
- **Invented facts.** No numbers, dates, client names, awards, durations, or prices that are not in
  `kanso-facts.md` or the user's brief.
- **Non-Kanso work.** Team members' personal projects are never case studies.

## Placeholders

Anything unknown becomes a placeholder — never a guess.

- Syntax: square brackets with a hint of what goes there: `[Tagline — one line on the outcome]`, `[x weeks]`, `[USD fee]`.
- Every placeholder is listed in the **open items** summary at the end of the copy step and again after the Figma build.
- A slide may still ship with placeholders; the presenter fills them before the meeting.

## Numbers and proof

- Only verified numbers: from `kanso-facts.md`, the client's public material the user points to, or the user.
- Write numbers as numerals with thousands separators: `2,000+`, `16`, `$48,000`.
- Currency in proposals: **USD**, formatted `$48,000` (no decimals for round figures).
- Dates: `February–August 2026` (en dash for ranges), `14 September 2026` for specific days.
- Every case study has a **Results** slide. If there is no verified result, keep the slide with placeholders and flag it.

## Testimonials

- Quote verbatim from `kanso-facts.md`. Never edit, shorten, or merge quotes.
- Attribution format: `Name — Title, Company`.
- One testimonial per slide as the main element; at most two supporting quotes in smaller type.

**In proposals:** no testimonials slide — the intro already carries them. At most one quote, on the optional
Relevant work slide, and only if it is **25 words or fewer** — quotes can't be shortened, so a longer one is left out
(the quote sits in the narrow title column; the 38-word Dataland quote filled it in the 2026-09-16 test).

## Mobile apps: never "native"

- Kanso builds iOS and Android together, not as separate native apps. Never write "native" (native app, native
  development, native iOS, native platforms).
- Write **iOS and Android**, **mobile app**, or **iOS and Android app** instead — e.g. "iOS and Android app design",
  "Product design through development", "2 platforms: iOS and Android".

## Headlines in columns

- In three- and four-column slides (brief, goals, how we work together), a column title is **4 words or fewer**.
  Lastik breaks those columns after about four words, so longer titles leave one word alone on the last line.
- If a longer title is unavoidable, plan the break: add a manual line break (`\n`) so both lines are balanced.

## Client names and logos

- Free to use: clients published on kanso.solutions (Dataland, Derimod, Pro Legacy, Chiliz).
- Any other client name or logo: ask the user before using it.

## Signing

- Button label: **Sign the proposal →** (the only place an arrow is used).
- Signing tool: **Google Docs eSignature**. Only the client signs.
- Investment helper: `Signed in Google Docs · valid until [date]` — the only place validity appears.
- Investment note: *Signing confirms the scope, timeline, fee and payment schedule in this proposal. After signing, we schedule the kickoff within 5 days.*
- Fee note: `Covers [phases in scope] as described in this proposal.`
- Validity: **15 days** from the proposal date by default (confirm per proposal).
- Kickoff: within **5 days** of signing.
- Proposals have no Acceptance or Next steps slide — Investment covers signing and what happens after it.

## Kickoff

- Scope recap bottom line: *Anything new is scoped and priced separately.* (Kanso policy)
- Response time: *Messages answered within one working day.* (Kanso standard)
- Kickoff is held within 5 days of signing; the deck never repeats the fee.

## Invoices

- Title: **Proforma invoice** — never "Invoice" alone. Note (fixed): *This is a proforma invoice. The official invoice
  follows once payment is received. Bank fees are paid by the sender.*
- Numbering: `KNS-YYYY-NNN`, sequential per year (KNS-2026-001). Reference on the bank row = the invoice number.
- Dates: `18 September 2026`. Due date: issue date + 14 days.
- Money: USD with cents on invoices — `$19,200.00` (proposals drop the cents).
- Line item: title = milestone name (e.g. Design sign-off); description = one line on what was reached
  (e.g. UI and design system approved); share = `40% of $48,000.00`.
- Schedule statuses: `Paid` · `This invoice` · `Upcoming` — exactly one `This invoice`.
- Retainer: item title `Retainer — October 2026`; period `1–31 October 2026`; parties column `Retainer since
  1 March 2026` · `Monthly fee $4,000.00 · billed in advance`. Note (fixed): *This is a proforma invoice for the month
  ahead, billed in advance. The official invoice follows once payment is received. Bank fees are paid by the sender.*
- Retainer arrears: only when the user says a month is unpaid — `Outstanding (September 2026)` under VAT, and Total due
  includes it. No billing history table.

## Confidentiality

Proposal and kickoff decks carry a footer on every slide except the cover:
`Confidential — prepared for [Client]`.

## Punctuation and style

- Em dash with spaces for asides and attributions: `Kanso — formerly Echo Studio`.
- Middle dot with spaces for inline lists and meta: `Istanbul · Since 2020`.
- Ellipsis character `…` (not three dots) for split sentences.
- Curly quotes and apostrophes: `“ ” ’`.
- Product and platform names as their owners write them: iOS, Android, App Store, Google Play, Figma, Slack.
