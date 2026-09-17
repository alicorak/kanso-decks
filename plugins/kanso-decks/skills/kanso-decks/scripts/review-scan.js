// Kanso deck review scan — UI v2
// Paste into a `use_figma` script (after setting DECK_PAGE_NAME). Read-only: it reports, it does not change anything.
// Run after the build, and again after the user switches headings to Lastik.

const DECK_PAGE_NAME = 'Deck — [Client] — [Deck type]'; // ← set this

const page = figma.root.children.find(p => p.name === DECK_PAGE_NAME);
if (!page) throw new Error(`Page "${DECK_PAGE_NAME}" not found.`);
await figma.setCurrentPageAsync(page);

const CHROME = new Set(['Header', 'Footer', 'Kanji background']); // full-width bars, ignored for overlap checks
const slides = page.children.filter(n => n.type === 'FRAME').sort((a, b) => a.x - b.x);
const report = { slides: slides.length, overlaps: [], spills: [], overflow: [], footerZone: [], placeholders: [], emptyText: [], unboundText: [], footerMeta: [], signing: [] };

const box = (n, f) => {
  const sx = f.absoluteTransform[0][2], sy = f.absoluteTransform[1][2];
  const x = n.absoluteTransform[0][2] - sx, y = n.absoluteTransform[1][2] - sy;
  return { x, y, r: x + n.width, b: y + n.height };
};
const insideChrome = n => { let p = n.parent; while (p && p.type !== 'PAGE') { if (CHROME.has(p.name)) return true; p = p.parent; } return CHROME.has(n.name); };

for (const f of slides) {
  // 1. Overlaps between top-level blocks (title column, content column, columns, placeholders…).
  const blocks = f.children.filter(n => n.visible && !CHROME.has(n.name));
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
    const a = box(blocks[i], f), b = box(blocks[j], f);
    const ix = Math.min(a.r, b.r) - Math.max(a.x, b.x), iy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
    if (ix > 2 && iy > 2) report.overlaps.push(`${f.name}: "${blocks[i].name}" × "${blocks[j].name}"`);
  }

  // 2. Content spilling out of its auto-layout container (e.g. a column taller than 776 px after the Lastik switch).
  for (const n of f.findAll(n => n.visible && !insideChrome(n))) {
    const p = n.parent;
    if (!p || p === f || !('layoutMode' in p) || p.layoutMode === 'NONE' || n.layoutPositioning === 'ABSOLUTE') continue;
    const c = box(n, f), pb = box(p, f);
    if (c.b > pb.b + 1 || c.r > pb.r + 1) report.spills.push(`${f.name}: "${n.name}" spills out of "${p.name}" by ${Math.round(Math.max(c.b - pb.b, c.r - pb.r))} px`);
  }

  // 3. Outside the slide, or into the footer bar (y ≥ 978).
  for (const n of f.findAll(n => n.visible && !insideChrome(n) && n.type !== 'GROUP')) {
    const b = box(n, f);
    if (b.x < -1 || b.y < -1 || b.r > 1921 || b.b > 1081) report.overflow.push(`${f.name}: "${n.name}" outside slide`);
    else if (f.height === 1080 && b.b > 978) report.footerZone.push(`${f.name}: "${n.name}" reaches y ${Math.round(b.b)}`);
  }

  // 4. Text checks.
  for (const t of f.findAll(n => n.type === 'TEXT')) {
    const s = t.characters;
    if (!insideChrome(t) && !s.trim()) report.emptyText.push(`${f.name}: "${t.name}"`);
    const ph = s.match(/\[[^\]]+\]/g);
    if (ph) report.placeholders.push(`${f.name}: "${t.name}" → ${ph.join(', ')}`);
    const fam = t.boundVariables && t.boundVariables.fontFamily;
    const bound = Array.isArray(fam) ? fam.length > 0 : !!fam;
    if (t.name !== 'Kanji' && !insideChrome(t) && !bound) report.unboundText.push(`${f.name}: "${t.name}"`);
  }

  // 5. Footer meta and page per slide (Footer instance, Footer frame, or intro "Chrome / Page" text).
  const footer = f.findChild(n => n.name === 'Footer');
  let meta = '—', pageText = null;
  if (footer && footer.type === 'INSTANCE') {
    const props = footer.componentProperties, key = p => Object.keys(props).find(k => k.startsWith(p));
    if (props[key('Show meta')] && props[key('Show meta')].value) meta = props[key('Meta')].value;
    pageText = String(props[key('Page')].value);
  } else {
    const m = footer && footer.findOne(n => n.type === 'TEXT' && n.name === 'Meta');
    if (m && m.visible) meta = m.characters;
    const pn = f.findOne(n => n.type === 'TEXT' && (n.name === 'Page number' || n.name === 'Chrome / Page'));
    if (pn) pageText = pn.characters;
  }
  report.footerMeta.push(`${f.name}: ${meta} · ${pageText || 'no page number'}`);
  const pagePh = pageText && pageText.match(/\[[^\]]+\]/g);
  if (pagePh) report.placeholders.push(`${f.name}: footer page → ${pagePh.join(', ')}`);
}

// 6. Proposal signing: a fee must be followed by a way to sign, and every Sign button needs a link.
const feeSlides = slides.filter(f => f.findOne(n => n.type === 'TEXT' && n.name === 'Fee'));
const signButtons = slides.flatMap(f => f.findAll(n => (n.type === 'INSTANCE' || n.type === 'FRAME') && n.name === 'Sign button').map(b => ({ f, b })));
if (feeSlides.length && !signButtons.length) report.signing.push('Fee shown but no Sign button in the deck — add addSignButton to Investment');
for (const f of feeSlides) if (!f.findOne(n => (n.type === 'INSTANCE' || n.type === 'FRAME') && n.name === 'Sign button')) report.signing.push(`${f.name}: fee without a Sign button on the same slide`);
for (const { f, b } of signButtons) {
  const label = b.findOne(n => n.type === 'TEXT' && n.name === 'Button label');
  const link = label ? label.getRangeHyperlink(0, label.characters.length) : null;
  if (!link || link === figma.mixed) report.signing.push(`${f.name}: Sign button has no e-sign link (Open item: [e-sign link])`);
}

report.ok = !report.overlaps.length && !report.spills.length && !report.overflow.length && !report.footerZone.length && !report.emptyText.length;
return report;
