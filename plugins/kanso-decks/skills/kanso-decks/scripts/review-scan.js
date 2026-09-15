// Kanso deck review scan
// Paste into a `use_figma` script (after setting DECK_PAGE_NAME). Read-only: it reports, it does not change anything.
// Run after the build, and again after the user switches headings to Lastik.

const DECK_PAGE_NAME = 'Deck — [Client] — [Deck type]'; // ← set this

const page = figma.root.children.find(p => p.name === DECK_PAGE_NAME);
if (!page) throw new Error(`Page "${DECK_PAGE_NAME}" not found.`);
await figma.setCurrentPageAsync(page);

const FOOTER_LAYERS = new Set(['Page number', 'Confidential', 'Cover note', 'Note', 'Meta']);
const slides = page.children.filter(n => n.type === 'FRAME').sort((a, b) => a.x - b.x);
const report = { slides: slides.length, overlaps: [], overflow: [], footerZone: [], placeholders: [], emptyText: [], unboundText: [], extraClosing: [] };

const box = n => ({ x: n.x, y: n.y, r: n.x + n.width, b: n.y + n.height });
for (const f of slides) {
  const kids = f.children.filter(n => n.visible && n.name !== 'Header');

  // Overlaps between sibling elements (ignores the header).
  for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
    const a = box(kids[i]), b = box(kids[j]);
    const ix = Math.min(a.r, b.r) - Math.max(a.x, b.x), iy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
    if (ix > 2 && iy > 2) report.overlaps.push(`${f.name}: "${kids[i].name}" × "${kids[j].name}" (${Math.round(ix)}×${Math.round(iy)} px)`);
  }

  for (const n of kids) {
    const b = box(n);
    // Outside the slide.
    if (b.x < 0 || b.y < 0 || b.r > 1920 || b.b > 1080) report.overflow.push(`${f.name}: "${n.name}" outside slide (${Math.round(b.x)},${Math.round(b.y)} → ${Math.round(b.r)},${Math.round(b.b)})`);
    // Content running into the footer zone.
    if (!FOOTER_LAYERS.has(n.name) && b.b > 950) report.footerZone.push(`${f.name}: "${n.name}" reaches y ${Math.round(b.b)} (footer zone starts at 950)`);
  }

  for (const t of f.findAll(n => n.type === 'TEXT')) {
    const s = t.characters;
    if (!s.trim()) report.emptyText.push(`${f.name}: "${t.name}"`);
    const ph = s.match(/\[[^\]]+\]/g);
    if (ph) report.placeholders.push(`${f.name}: "${t.name}" → ${ph.join(', ')}`);
    const fam = t.boundVariables && t.boundVariables.fontFamily;
    const hasFontBinding = Array.isArray(fam) ? fam.length > 0 : !!fam;
    if (t.name !== 'Kanji' && t.parent && t.parent.type !== 'INSTANCE' && !hasFontBinding) report.unboundText.push(`${f.name}: "${t.name}"`);
  }
}

// Closing-slide duplication (anti-pattern: separate thank-you + contact).
const closing = slides.filter(f => /Contact|Thank/i.test(f.name));
if (closing.length > 1) report.extraClosing.push(closing.map(f => f.name).join(' · '));

report.ok = !report.overlaps.length && !report.overflow.length && !report.footerZone.length && !report.emptyText.length;
return report;
