// Kanso deck build helpers — UI v2 (2026-09-15)
// Paste this block at the top of a `use_figma` script that runs in a file duplicated from the Kanso deck source file
// (Client Introduction). Source slides live on the pages "Introduction Slide", "Proposal" and "Kickoff".
// Everything is looked up by name, so it works in any copy of that file.
// Plain JavaScript with top-level await (the use_figma runtime wraps it). Always `return` results at the end.

// ---------- Fonts ----------
const FONTS = {
  heading: { family: 'Instrument Serif', style: 'Regular' },
  body: { family: 'Geist', style: 'Medium' },
  kanji: { family: 'Noto Serif JP', style: 'Regular' },
};
for (const f of Object.values(FONTS)) await figma.loadFontAsync(f);

// ---------- Variables ----------
const ALL_VARS = await figma.variables.getLocalVariablesAsync();
const COLLECTIONS = await figma.variables.getLocalVariableCollectionsAsync();
function varByName(name) {
  const v = ALL_VARS.find(x => x.name === name);
  if (!v) throw new Error(`Missing variable "${name}". Is this file duplicated from the Kanso deck source file (Client Introduction)?`);
  return v;
}
const V = {
  top: varByName('color/background-top'), bottom: varByName('color/background-bottom'),
  ph: varByName('color/placeholder'), primary: varByName('color/text-primary'),
  body: varByName('color/text-body'), secondary: varByName('color/text-secondary'),
  rule: varByName('color/rule'), ruleStrong: varByName('color/rule-strong'),
  outline: varByName('color/outline'), accent: varByName('color/accent'), negative: varByName('color/negative'),
  hf: varByName('font/heading-family'), hs: varByName('font/heading-style'),
  bf: varByName('font/body-family'), bs: varByName('font/body-style'),
};
const THEME = COLLECTIONS.find(c => c.name === 'Theme');
const THEME_MODE = Object.fromEntries(THEME.modes.map(m => [m.name, m.modeId])); // { Dark, Light }

// Headings can only be edited while they render in Instrument Serif (Lastik cannot be loaded by the MCP).
const HEADING_FAMILY = String(Object.values(V.hf.valuesByMode)[0]).trim();
const HEADINGS_EDITABLE = HEADING_FAMILY === 'Instrument Serif';
function assertHeadingsEditable() {
  if (!HEADINGS_EDITABLE) throw new Error(`font/heading-family is "${HEADING_FAMILY}". Set it to Instrument Serif / Regular for the edit, then ask the user to switch back to Lastik.`);
}

// ---------- Source pages ----------
// Intro and case slides: the "0N - …" sections of "Introduction Slide".
// Proposal and kickoff: sections "Shared" and "Variant — Brand | Mobile app | End-to-end | Website".
// Only slides inside sections are sources.
const SOURCE_PAGES = { intro: 'Introduction Slide', proposal: 'Proposal', kickoff: 'Kickoff', invoice: 'Invoice', discovery: 'Discovery & Workshop' };
// Page names may carry an order prefix ("03 - Proposal") — match on the name without it.
const pageKey = name => name.replace(/^\s*\d+\s*[-—–.]\s*/, '').trim().toLowerCase();
const PAGE = name => figma.root.children.find(p => p.name === name)
  || figma.root.children.find(p => pageKey(p.name) === pageKey(name));
async function sourcePage(kind) {
  const p = PAGE(SOURCE_PAGES[kind] || kind);
  if (!p) throw new Error(`Source page for "${kind}" not found. Is this a copy of the Kanso deck source file?`);
  await p.loadAsync();
  return p;
}
const stripNumber = name => name.replace(/^\d+\s+[—–-]\s+/, '');
// Section and slide names may use "—" or "-" (the source file has both); compare without the dash style.
const dashless = name => name.replace(/\s+[—–-]\s+/g, ' - ').trim();
// findSlide('proposal', 'Scope · Brand') or findSlide('intro', '10 — How we're different'); sectionName narrows the search.
async function findSlide(kind, slideName, sectionName) {
  const p = await sourcePage(kind);
  const sections = p.children.filter(n => n.type === 'SECTION'
    && (!sectionName || dashless(n.name) === dashless(sectionName))
    && (kind !== 'intro' || /^\d+ [—-] /.test(n.name)));
  const frames = sections.flatMap(sec => sec.children.filter(n => n.type === 'FRAME'));
  const hit = frames.find(f => f.name === slideName)
    || frames.find(f => dashless(stripNumber(f.name)) === dashless(stripNumber(slideName)));
  if (!hit) throw new Error(`Slide "${slideName}" not found on "${p.name}"${sectionName ? ` in "${sectionName}"` : ''}.`);
  return hit;
}

// ---------- Paint + primitives ----------
const isAL = p => p && p.layoutMode && p.layoutMode !== 'NONE';
const paint = variable => [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', variable)];
function boundIds(node, field) {
  const b = node.boundVariables && node.boundVariables[field];
  return Array.isArray(b) ? b.map(a => a.id) : b ? [b.id] : [];
}
function bgFill(frame) {
  const alias = v => figma.variables.createVariableAlias(v);
  frame.fills = [{
    type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: 0, g: 0, b: 0, a: 1 }, boundVariables: { color: alias(V.top) } },
      { position: 1, color: { r: 0.0784, g: 0.0784, b: 0.0784, a: 1 }, boundVariables: { color: alias(V.bottom) } },
    ],
  }];
}

// T(parent, text, { kind: 'h'|'b', size, lh (percent) | lh + px:true, color, upper, underline, outline, align, fill, w, name })
function T(parent, chars, o) {
  const t = figma.createText(); parent.appendChild(t);
  const h = o.kind === 'h';
  t.fontName = h ? FONTS.heading : FONTS.body; t.fontSize = o.size; t.characters = chars;
  t.letterSpacing = { unit: 'PERCENT', value: h ? -2 : -1 };
  t.lineHeight = o.lh == null ? { unit: 'AUTO' } : (o.px ? { unit: 'PIXELS', value: o.lh } : { unit: 'PERCENT', value: o.lh });
  if (o.upper) t.textCase = 'UPPER';
  if (o.underline) t.textDecoration = 'UNDERLINE';
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.outline) { t.fills = []; t.strokes = paint(V.outline); t.strokeWeight = 1.5; t.strokeAlign = 'OUTSIDE'; }
  else t.fills = paint(V[o.color || 'primary']);
  t.setBoundVariable('fontFamily', h ? V.hf : V.bf); t.setBoundVariable('fontStyle', h ? V.hs : V.bs);
  t.name = o.name || (h ? 'Headline' : 'Body');
  if (o.fill && isAL(parent)) { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; }
  else if (o.w) { t.resize(o.w, t.height); t.textAutoResize = 'HEIGHT'; }
  else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (!isAL(parent)) { if (o.x != null) t.x = o.x; if (o.y != null) t.y = o.y; }
  return t;
}
// AL(parent, 'VERTICAL'|'HORIZONTAL', { name, gap, pad:[t,r,b,l], main, cross, w, h, x, y, fillW, fillH, stroke:{ v, t, r, b, l } })
function AL(parent, dir, o = {}) {
  const f = figma.createAutoLayout(dir, { name: o.name || 'Group' }); parent.appendChild(f);
  f.fills = []; f.itemSpacing = o.gap || 0;
  if (o.pad) [f.paddingTop, f.paddingRight, f.paddingBottom, f.paddingLeft] = o.pad;
  if (o.main) f.primaryAxisAlignItems = o.main;
  if (o.cross) f.counterAxisAlignItems = o.cross;
  if (o.w || o.h) {
    f.resize(o.w || f.width, o.h || f.height);
    if (o.w) { if (dir === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED'; }
    if (o.h) { if (dir === 'VERTICAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED'; }
  }
  if (isAL(parent)) { if (o.fillW) f.layoutSizingHorizontal = 'FILL'; if (o.fillH) f.layoutSizingVertical = 'FILL'; }
  else { if (o.x != null) f.x = o.x; if (o.y != null) f.y = o.y; }
  if (o.stroke) {
    f.strokes = paint(V[o.stroke.v]); f.strokeAlign = 'INSIDE';
    f.strokeTopWeight = o.stroke.t || 0; f.strokeRightWeight = o.stroke.r || 0; f.strokeBottomWeight = o.stroke.b || 0; f.strokeLeftWeight = o.stroke.l || 0;
  }
  return f;
}
function Divider(parent) { const r = figma.createRectangle(); parent.appendChild(r); r.resize(100, 1); r.fills = paint(V.rule); r.name = 'Divider'; if (isAL(parent)) r.layoutSizingHorizontal = 'FILL'; return r; }
function ImageBox(parent, caption, o = {}) {
  const f = figma.createFrame(); parent.appendChild(f); f.name = o.name || 'Image placeholder'; f.clipsContent = true;
  f.fills = paint(V.ph); f.resize(o.w || 100, o.h || 100);
  if (isAL(parent)) { if (o.fillW) f.layoutSizingHorizontal = 'FILL'; if (o.fillH) f.layoutSizingVertical = 'FILL'; } else { f.x = o.x || 0; f.y = o.y || 0; }
  if (caption) { const c = T(f, caption, { kind: 'b', size: 20, lh: 28, px: true, upper: true, color: 'secondary', name: 'Caption' }); c.x = 24; c.y = f.height - 24 - c.height; c.constraints = { horizontal: 'MIN', vertical: 'MAX' }; }
  return f;
}

// ---------- Slides ----------
// Header and footer bars are plain frames in the source file (no components). New slides copy them from a kickoff slide.
async function chromeSource() { return findSlide('kickoff', 'Why we’re here', 'Shared'); }

// Blank slide with gradient, header, footer; optional title column and content column.
async function newSlide(deckPage, index, name, section, { meta = null, title = null, contentRule = false } = {}) {
  const src = await chromeSource();
  const f = figma.createFrame(); deckPage.appendChild(f);
  f.resize(1920, 1080); f.x = index * 2020; f.y = 0; f.clipsContent = true;
  f.name = `${String(index + 1).padStart(2, '0')} — ${name}`;
  bgFill(f);
  for (const part of ['Header', 'Footer']) {
    const c = src.findChild(n => n.name === part).clone(); f.appendChild(c); c.x = 0; c.y = part === 'Header' ? 0 : 978;
  }
  setSection(f, section);
  setFooter(f, { meta, page: '00 / 00' });
  let titleCol = null, contentCol = null;
  if (title != null) {
    titleCol = AL(f, 'VERTICAL', { name: 'Title column', x: 48, y: 153, w: 432, h: 776, pad: [48, 0, 48, 0], main: 'SPACE_BETWEEN' });
    T(titleCol, title, { kind: 'h', size: 60, lh: 100, name: 'Title', fill: true });
    contentCol = AL(f, 'VERTICAL', { name: 'Content column', x: 512, y: 153, w: 1360, h: 776, pad: [48, 0, 48, 0], main: 'SPACE_BETWEEN', stroke: contentRule ? { v: 'ruleStrong', l: 1 } : null });
  }
  return { frame: f, titleCol, contentCol };
}

// Clone a source slide onto the deck page: cloneSlide('kickoff', 'Plan · Brand', deckPage, 5, { section: 'Plan' }).
// Headings must render in Instrument Serif while cloning (a clone that contains Lastik text fails on append).
async function cloneSlide(kind, slideName, deckPage, index, { sectionName, section } = {}) {
  assertHeadingsEditable();
  const src = await findSlide(kind, slideName, sectionName);
  const f = src.clone(); deckPage.appendChild(f);
  f.x = index * 2020; f.y = 0;
  f.name = `${String(index + 1).padStart(2, '0')} — ${stripNumber(src.name).replace(/ · (Brand|Mobile app|End-to-end|Website)$/, '')}`;
  if (section) setSection(f, section);
  return f;
}

async function loadFontsOf(t) { for (const fn of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(fn); }

// Header label: component instance (older files) or the "Section label" text inside the Header frame.
function setSection(frame, section) {
  const header = frame.findChild(n => n.name === 'Header');
  if (!header) return false;
  if (header.type === 'INSTANCE') { const k = Object.keys(header.componentProperties).find(k => k.startsWith('Section')); if (k) { header.setProperties({ [k]: section }); return true; } }
  const t = header.findOne(n => n.type === 'TEXT' && n.name === 'Section label');
  if (t) t.characters = section;
  return !!t;
}

// meta: string shows it, null/'' hides it. page: optional page text.
// Works with Footer instances, Footer frames (Meta + Page number texts) and intro slides ("Chrome / Page" text).
function setFooter(frame, { meta, page } = {}) {
  const footer = frame.findChild(n => n.name === 'Footer');
  if (footer && footer.type === 'INSTANCE') {
    const props = footer.componentProperties, key = p => Object.keys(props).find(k => k.startsWith(p));
    const next = {};
    if (meta !== undefined) { next[key('Meta')] = meta || ''; next[key('Show meta')] = !!meta; }
    if (page !== undefined) next[key('Page')] = page;
    footer.setProperties(next);
    return true;
  }
  if (footer) {
    const m = footer.findOne(n => n.type === 'TEXT' && n.name === 'Meta');
    if (m && meta !== undefined) { if (meta) m.characters = meta; m.visible = !!meta; }
    const pn = footer.findOne(n => n.type === 'TEXT' && n.name === 'Page number');
    if (pn && page !== undefined) pn.characters = page;
    return true;
  }
  const chromePage = frame.findOne(n => n.type === 'TEXT' && n.name === 'Chrome / Page');
  if (chromePage && page !== undefined) chromePage.characters = page;
  return !!chromePage;
}
const addConfidential = (frame, client) => setFooter(frame, { meta: `Confidential — prepared for ${client}` });

// Intro source slides use generic layer names ("Headline", "Body", "Frame 12"). Replace their copy by its current text.
function replaceText(frame, currentText, text) {
  const node = frame.findAll(n => n.type === 'TEXT' && n.characters.trim() === currentText.trim())[0];
  if (!node) throw new Error(`No text "${currentText}" in "${frame.name}".`);
  if (boundIds(node, 'fontFamily').includes(V.hf.id)) assertHeadingsEditable();
  node.characters = text;
  return node;
}

// Text layers by name. order 'y' (default): top-to-bottom rows. order 'x': left-to-right columns.
function texts(frame, layerName, order = 'y') {
  const abs = n => n.absoluteTransform;
  const sort = order === 'x'
    ? (a, b) => (abs(a)[0][2] - abs(b)[0][2]) || (abs(a)[1][2] - abs(b)[1][2])
    : (a, b) => (abs(a)[1][2] - abs(b)[1][2]) || (abs(a)[0][2] - abs(b)[0][2]);
  return frame.findAll(n => n.type === 'TEXT' && n.name === layerName).sort(sort);
}
function setText(frame, layerName, text, nth = 0, order = 'y') {
  const node = texts(frame, layerName, order)[nth];
  if (!node) throw new Error(`Text layer "${layerName}" #${nth} not found in "${frame.name}".`);
  if (boundIds(node, 'fontFamily').includes(V.hf.id)) assertHeadingsEditable();
  node.characters = text;
  return node;
}

// Title-column Note ("*" on its own line, then 20 px text). setText would give the whole note the "*" size — use this.
function setNote(frame, text) {
  const node = texts(frame, 'Note')[0];
  if (!node) throw new Error(`No Note in "${frame.name}".`);
  const L = node.characters.length;
  const star = { size: node.getRangeFontSize(0, 1), lh: node.getRangeLineHeight(0, 1) };
  const rest = { size: node.getRangeFontSize(L - 1, L), lh: node.getRangeLineHeight(L - 1, L) };
  node.characters = '*\n' + text;
  node.setRangeFontSize(0, node.characters.length, rest.size); node.setRangeLineHeight(0, node.characters.length, rest.lh);
  node.setRangeFontSize(0, 1, star.size); node.setRangeLineHeight(0, 2, star.lh);
  return node;
}

// Captions of Image placeholder / Logo tile / Portrait frames, in reading order (left-to-right, then top-to-bottom).
function setCaptions(frame, captions) {
  const abs = n => n.absoluteTransform;
  const boxes = frame.findAll(n => n.type === 'FRAME' && ['Image placeholder', 'Logo tile', 'Portrait'].includes(n.name))
    .sort((a, b) => (abs(a)[1][2] - abs(b)[1][2]) || (abs(a)[0][2] - abs(b)[0][2]));
  captions.forEach((c, i) => {
    if (!boxes[i]) throw new Error(`"${frame.name}" has only ${boxes.length} image frames.`);
    const cap = boxes[i].findOne(n => n.type === 'TEXT');
    if (cap) { cap.characters = c; cap.y = boxes[i].height - (boxes[i].name === 'Logo tile' ? 0 : 24) - cap.height; }
  });
}

// Keep the first `keep` items of an auto-layout list and remove the rest with their dividers.
// skip: leading children that are not items (e.g. a Column label).
function removeListItems(list, keep, { skip = 0 } = {}) {
  const kids = [...list.children].slice(skip);
  let seen = 0;
  kids.forEach((k, i) => {
    if (k.name === 'Divider') return;
    seen++;
    if (seen > keep) { const prev = kids[i - 1]; if (prev && prev.name === 'Divider' && !prev.removed) prev.remove(); k.remove(); }
  });
}
function removeAll(frame, layerName) { frame.findAll(n => n.name === layerName).forEach(n => n.remove()); }

// ---------- Proforma invoice ----------
// Clone an A4 source frame: kind 'Proforma' (project milestone) or 'Retainer' (monthly fee), modeName 'Light' | 'Dark'.
async function cloneInvoice(targetPage, modeName = 'Light', kind = 'Proforma') {
  assertHeadingsEditable();
  const p = await sourcePage('invoice');
  const modeId = THEME_MODE[modeName];
  const src = p.findAll(n => n.type === 'FRAME' && n.parent.type === 'SECTION' && dashless(n.name) === dashless(`Invoice — ${kind}`))
    .find(f => (f.explicitVariableModes || {})[THEME.id] === modeId);
  if (!src) throw new Error(`No ${modeName} "Invoice — ${kind}" frame on the Invoice page.`);
  const f = src.clone(); targetPage.appendChild(f); f.x = 0; f.y = 0;
  return f;
}
// rows: [{ milestone, share, amount, status: 'Paid' | 'This invoice' | 'Upcoming' }]
function setInvoiceSchedule(frame, rows) {
  const list = frame.findOne(n => n.name === 'Payment schedule');
  const rowFrames = list.children.filter(n => n.name === 'Schedule row');
  if (rows.length > rowFrames.length) throw new Error(`The source has ${rowFrames.length} schedule rows; ${rows.length} needed. Ask the user to add a row in the source frame.`);
  if (rows.filter(r => r.status === 'This invoice').length !== 1) throw new Error('Exactly one row must be "This invoice".');
  const colour = { 'Paid': V.secondary, 'This invoice': V.accent, 'Upcoming': V.body };
  rowFrames.forEach((rf, i) => {
    const r = rows[i];
    if (!r) { const prev = rf.parent.children[rf.parent.children.indexOf(rf) - 1]; if (prev && prev.name === 'Divider') prev.remove(); rf.remove(); return; }
    const t = name => rf.findOne(n => n.type === 'TEXT' && n.name === name);
    t('Schedule milestone').characters = r.milestone;
    t('Schedule share').characters = r.share;
    t('Schedule amount').characters = r.amount;
    const st = t('Schedule status'); st.characters = r.status;
    st.fills = [figma.variables.setBoundVariableForPaint(st.fills[0], 'color', colour[r.status])]; // keeps the source fallback colour
  });
}

// Retainer only, and only when the user says a month is unpaid: adds "Outstanding (September 2026)" under VAT.
// Total due must then include it — set it with setText(frame, 'Total due', …).
function addOutstanding(frame, month, amount) {
  const totals = frame.findOne(n => n.name === 'Totals');
  const rows = totals.children.filter(n => n.name === 'Total row');
  const vatRow = rows.find(r => r.findOne(t => t.type === 'TEXT' && t.name === 'VAT'));
  const row = rows[0].clone(); totals.insertChild(totals.children.indexOf(vatRow) + 1, row);
  row.name = 'Outstanding row';
  row.findOne(t => t.type === 'TEXT' && t.name === 'Label').characters = `Outstanding (${month})`;
  const v = row.findOne(t => t.type === 'TEXT' && t.name !== 'Label'); v.name = 'Outstanding'; v.characters = amount;
  return row;
}

// ---------- File thumbnail ----------
// Every deck file's "Thumbnail" page has a "Cover" frame whose big "Headline" reads "Client Intro" in the source file.
// Set it to the project name. The source title is hard-coded Lastik (not editable by the MCP), so it is rebuilt as a
// full-width centred text bound to the heading variables — it renders in Lastik again after the user's switch.
async function setThumbnailTitle(title) {
  assertHeadingsEditable();
  const page = PAGE('Thumbnail');
  if (!page) throw new Error('No "Thumbnail" page in this file.');
  await page.loadAsync();
  const cover = page.children.find(n => n.type === 'FRAME' && n.name === 'Cover');
  if (!cover) throw new Error('No "Cover" frame on the Thumbnail page.');
  const old = cover.findAll(n => n.type === 'TEXT' && n.name === 'Headline').sort((a, b) => b.fontSize - a.fontSize)[0];
  const cy = old.y + old.height / 2;
  const t = figma.createText();
  t.fontName = FONTS.heading; t.characters = title;
  t.fontSize = old.fontSize; t.lineHeight = old.lineHeight; t.letterSpacing = old.letterSpacing;
  t.fills = JSON.parse(JSON.stringify(old.fills));
  t.setBoundVariable('fontFamily', V.hf); t.setBoundVariable('fontStyle', V.hs);
  t.name = 'Headline'; t.textAlignHorizontal = 'CENTER';
  old.parent.insertChild(old.parent.children.indexOf(old), t);
  t.textAutoResize = 'HEIGHT'; t.resize(cover.width, t.height); t.x = 0; t.y = Math.round(cy - t.height / 2);
  old.remove();
  return t;
}

// ---------- Proposal signing ----------
// The Investment slide already carries the Sign button (a frame named "Sign button" with "Button label" and
// "Button helper"). Links every Sign button on a slide to the Google Docs signing link: text hyperlinks (work in PDF
// exports) + a click action (works in Figma present mode). Works while headings render in Lastik.
async function setSignLink(frame, url) {
  const buttons = frame.findAll(n => (n.type === 'INSTANCE' || n.type === 'FRAME') && n.name === 'Sign button');
  for (const b of buttons) {
    for (const t of b.findAll(n => n.type === 'TEXT')) t.setRangeHyperlink(0, t.characters.length, { type: 'URL', value: url });
    await b.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'URL', url }] }]);
  }
  return buttons.length;
}

function setTheme(frame, modeName /* 'Dark' | 'Light' */) { frame.setExplicitVariableModeForCollection(THEME, THEME_MODE[modeName]); }

// "NN / TT" in every slide's footer, ordered left to right.
function setPageNumbers(deckPage) {
  const slides = deckPage.children.filter(n => n.type === 'FRAME').sort((a, b) => a.x - b.x);
  slides.forEach((f, i) => setFooter(f, { page: `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}` }));
  return slides.length;
}

// Legacy helper for absolutely positioned text (UI v1 decks). Auto-layout slides don't need it.
function stackBelow(above, below, gap = 32) { below.y = Math.round(above.y + above.height + gap); return below; }
