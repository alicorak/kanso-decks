# kanso-decks

A Claude skill that builds on-brand Kanso client decks in Figma — **intro**, **proposal**, **case study**, and
**kickoff** — plus **proforma invoices** for proposal milestones — from a short brief, with approval at every step.

It knows the studio's verified facts, the Kanso voice, the deck structures that work (distilled from 50 decks in the
[deck.gallery](https://www.deck.gallery) public catalog), and how to build slides from the **Kanso deck source file**
(Client Introduction) in Figma.

---

## What you need

| Requirement | Why |
|---|---|
| **Claude desktop app** (Code tab) or **Claude Code CLI** | Where the skill runs |
| **Figma MCP connected with a Full seat** on the Figma team where you'll keep your decks | View seats cannot write to Figma |
| **The Kanso deck source file** — https://www.figma.com/design/q6Quf4V8CXEKlCLrmrQ6zb/Client-Introduction | Every deck starts as a copy of it (duplicate it into your own drafts); it holds the intro, proposal and kickoff slides |
| **Lastik installed locally** | Final heading font (Claude builds with Instrument Serif; you switch to Lastik at the end) |

## Install

No invite or GitHub account needed — the repo is public.

### 1. Add the marketplace and install the plugin

```bash
claude plugin marketplace add alicorak/kanso-decks
```

```bash
claude plugin install kanso-decks@kanso
```

The same commands work inside a Claude session as `/plugin marketplace add alicorak/kanso-decks` and
`/plugin install kanso-decks@kanso`. In the desktop app you can also use the plugin manager.

### 2. Connect Figma

Connect the Figma MCP (claude.ai → Settings → Connectors → Figma) with an account that has a **Full** seat on the
Figma team where your deck copies live. Check it in a session by asking Claude to run Figma `whoami`.

### claude.ai (web)

Not verified yet. Uploading a custom skill on claude.ai depends on your plan and settings; if **Skills** is available
under Settings → Capabilities, upload a ZIP of `plugins/kanso-decks/skills/kanso-decks/`. The skill also needs the
Figma connector enabled. Report back what works so this section can be updated.

## Use

Ask in plain words — the skill triggers on deck requests:

> Make an intro deck for Northwind, a fintech startup. First meeting next Tuesday, I'm presenting.

or call it directly:

```
/kanso-decks:kanso-decks
```

What happens:

1. **Brief** — Claude asks the intake questions for the deck type.
2. **Outline** — a numbered slide list. *You approve.*
3. **Copy** — all slide text plus a list of open items. *You approve.*
4. **Figma file** — you duplicate the source file (⋯ → Duplicate), rename it `[Client] — [Deck type] — [YYYY-MM-DD]`,
   and paste the link.
5. **Build** — Claude clones the source slides and fills in the copy, checking screenshots as it goes.
6. **Review** — Claude scans for overlaps and overflow and lists remaining placeholders. *You approve.*
7. **Lastik** — you set `font/heading-family` = `Lastik` and `font/heading-style` = `Free` in the Typography
   variables, then ask Claude to run the scan again.

## Update

```bash
claude plugin marketplace update kanso
```

Then run `/reload-plugins` in an open session (or start a new one).

## Maintain

| To change… | Edit |
|---|---|
| Studio facts, cases, testimonials | `plugins/kanso-decks/skills/kanso-decks/references/kanso-facts.md` |
| Voice and copy rules | `references/copy-rules.md` |
| Slide order and intake questions | `references/deck-flows.md` |
| Figma grid, source slides, variables | `references/figma-system.md` **and** the Client Introduction file |
| Build or review code | `scripts/build-helpers.js`, `scripts/review-scan.js` |
| Decisions and scope | `SPEC.md` |

**Adding a case study:** add it to `kanso-facts.md` with verified facts only (challenge, idea, what we built,
scope, timeline, verified results, testimonial). Unknown fields stay as `[placeholder]`.

**Rules that never change:** only verified facts; Kanso work only (never team members' personal projects);
testimonials verbatim; nothing copied from deck.gallery decks — structure only, with sources credited in
`references/deck-patterns.md`.

## Repository layout

```
kanso-decks/
├── .claude-plugin/marketplace.json      # marketplace "kanso"
├── SPEC.md                              # decision record
├── README.md
└── plugins/kanso-decks/
    ├── .claude-plugin/plugin.json
    └── skills/kanso-decks/
        ├── SKILL.md                     # workflow and hard rules
        ├── assets/                      # kanso-logo, o-mark, quote-mark, globe-icon (SVG)
        ├── references/
        │   ├── kanso-facts.md
        │   ├── copy-rules.md
        │   ├── deck-flows.md
        │   ├── deck-patterns.md
        │   └── figma-system.md
        └── scripts/
            ├── build-helpers.js
            └── review-scan.js
```
