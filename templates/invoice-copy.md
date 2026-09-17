# Kanso — Proforma invoice template · Copy

Template for the `kanso-decks` skill. Document: **proforma invoice** (payment request, not the official invoice) ·
Format: Figma A4 portrait, exported as PDF · Language: English · Currency: USD · One invoice per payment milestone
from the signed proposal.

Conventions
- `[brackets]` = filled per invoice. Kanso's company and bank details live **only in the Figma source file**, never in
  the public skill repo.
- Labels render uppercase (Geist Medium); the title, amounts and names use the heading font (Lastik).
- Dates: `18 September 2026`. Money: cents are shown on invoices (`$19,200.00`), dropped on proposals (`$48,000`).
- Numbering: `KNS-[YYYY]-[NNN]`, sequential per year (e.g. KNS-2026-001).
- Due date: issue date + **14 days**.

---

## 1 — Header
- **Logo:** Kanso
- **Title:** Proforma invoice
- **Meta rows (label / value):**
  - Invoice no. / KNS-[YYYY]-[NNN]
  - Issue date / [DD Month YYYY]
  - Due date / [DD Month YYYY] *(issue date + 14 days)*

## 2 — Parties (two columns)
| From | Bill to |
|---|---|
| **[Kanso legal name]** | **[Client legal name]** |
| [Street address] | [Street address] |
| [Postcode] Istanbul, Türkiye | [Postcode] [City], [Country] |
| Tax ID: [Kanso tax ID] | VAT / Tax ID: [Client tax ID] |
| hello@kanso.solutions | Attn: [Contact name], [email] |

## 3 — Project
- **Label:** Project
- **Value:** [Project name]
- **Meta:** Proposal signed on [DD Month YYYY] · Project fee $[fee]

## 4 — Line item (table)
| Description | Share | Amount |
|---|---|---|
| **[Milestone]** — [Milestone description, one line] | [x]% of $[fee] | $[amount] |

Example: **Design sign-off** — UI and design system approved · 40% of $[fee] · $[amount]

## 5 — Totals (right-aligned)
- Subtotal / $[amount]
- VAT / [0% — [VAT note]] *(to confirm with the accountant for services invoiced abroad)*
- **Total due (USD) / $[amount]**

## 6 — Payment schedule (summary)
- **Label:** Payment schedule
- Rows (milestone · share · amount · status):
  - [Milestone 1] · [x]% · $[amount] · Paid
  - [Milestone 2] · [x]% · $[amount] · **This invoice**
  - [Milestone 3] · [x]% · $[amount] · Upcoming
- Status styles: *Paid* text-secondary · **This invoice** accent · *Upcoming* text-body

## 7 — Payment details
- **Label:** Pay by bank transfer
- Bank / [Bank name]
- Account name / [Kanso legal name]
- IBAN (USD) / [IBAN]
- SWIFT / BIC / [SWIFT]
- Reference / KNS-[YYYY]-[NNN]

## 8 — Note
This is a proforma invoice. The official invoice follows once payment is received. Bank fees are paid by the sender.

## 9 — Footer
kanso.solutions · hello@kanso.solutions · Page 1 / 1

---

## Open items
- **Kanso company details:** legal name, address, tax ID — to be entered directly in the Figma source file.
- **Bank details:** bank, account name, USD IBAN, SWIFT — Figma source file only.
- **VAT line:** exact wording for services billed to clients abroad — confirm with the accountant.
- **Numbering:** who keeps the running KNS number (the skill asks for it on every invoice; it can't know the last one).
