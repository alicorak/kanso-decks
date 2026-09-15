// Kanso deck build helpers
// Paste this block at the top of a `use_figma` script that runs in a file duplicated from "Kanso Deck Template".
// Everything is looked up by name, so it works in any copy of the template.
// Plain JavaScript with top-level await (the use_figma runtime wraps it). Always `return` results at the end.

// ---------- Fonts ----------
const FONTS = {
  heading: { family: 'Instrument Serif', style: 'Regular' },
  body: { family: 'Geist', style: 'Regular' },
  bodyMedium: { family: 'Geist', style: 'Medium' },
  kanji: { family: 'Noto Serif JP', style: 'Regular' },
};
for (const f of Object.values(FONTS)) await figma.loadFontAsync(f);

// ---------- Variables ----------
const ALL_VARS = await figma.variables.getLocalVariablesAsync();
const COLLECTIONS = await figma.variables.getLocalVariableCollectionsAsync();
function varByName(name) {
  const v = ALL_VARS.find(x => x.name === name);
  if (!v) throw new Error(`Missing variable "${name}". Is this file duplicated from Kanso Deck Template?`);
  return v;
}
const V = {
  bg: varByName('color/background'),
  ph: varByName('color/placeholder'),
  primary: varByName('color/text-primary'),
  body: varByName('color/text-body'),
  secondary: varByName('color/text-secondary'),
  rule: varByName('color/rule'),
  hf: varByName('font/heading-family'),
  hs: varByName('font/heading-style'),
  bf: varByName('font/body-family'),
  bs: varByName('font/body-style'),
};
const THEME = COLLECTIONS.find(c => c.name === 'Theme');
const THEME_MODE = Object.fromEntries(THEME.modes.map(m => [m.name, m.modeId])); // { Dark, Light }

// Headings can only be edited while they render in Instrument Serif (Lastik cannot be loaded by the MCP).
const HEADING_FAMILY = String(Object.values(V.hf.valuesByMode)[0]).trim();
const HEADINGS_EDITABLE = HEADING_FAMILY === 'Instrument Serif';
function assertHeadingsEditable() {
  if (!HEADINGS_EDITABLE) {
    throw new Error(`font/heading-family is "${HEADING_FAMILY}". Ask the user to set it to "Instrument Serif" and font/heading-style to "Regular" before editing text, then switch back.`);
  }
}

// ---------- Pages, header, layouts ----------
const PAGE = name => figma.root.children.find(p => p.name === name);
const componentsPage = PAGE('Components');
const slidesPage = PAGE('Slides');
if (componentsPage) await componentsPage.loadAsync();
if (slidesPage) await slidesPage.loadAsync();
const HEADER = componentsPage && componentsPage.findOne(n => n.type === 'COMPONENT' && n.name === 'Header');
const SECTION_KEY = HEADER && Object.keys(HEADER.componentPropertyDefinitions).find(k => k.startsWith('Section'));

// Text bindings are stored per range, so boundVariables.fontFamily is an array of aliases.
function boundIds(node, field) {
  const b = node.boundVariables && node.boundVariables[field];
  return Array.isArray(b) ? b.map(a => a.id) : b ? [b.id] : [];
}

// ---------- Paint + primitives ----------
const paint = variable => [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', variable)];

// T(parent, text, { kind: 'h'|'b', size, color: 'primary'|'body'|'secondary', x, y, w, bottom, right, lh, name })
function T(parent, text, o) {
  const t = figma.createText(); parent.appendChild(t);
  const h = o.kind === 'h';
  t.fontName = h ? FONTS.heading : FONTS.body;
  t.fontSize = o.size; t.characters = text;
  t.letterSpacing = { unit: 'PERCENT', value: h ? -2 : -1 };
  t.lineHeight = o.lh ? { unit: 'PERCENT', value: o.lh } : { unit: 'AUTO' };
  t.fills = paint(V[o.color || 'primary']);
  t.setBoundVariable('fontFamily', h ? V.hf : V.bf);
  t.setBoundVariable('fontStyle', h ? V.hs : V.bs);
  if (o.w) { t.resize(o.w, t.height); t.textAutoResize = 'HEIGHT'; }
  t.x = o.x ?? 80;
  t.y = o.bottom != null ? o.bottom - t.height : (o.y ?? 0);
  if (o.right != null) t.x = o.right - t.width;
  t.name = o.name || (h ? 'Headline' : 'Body');
  return t;
}
const Eyebrow = (f, s, x = 80, y = 200) => T(f, s, { kind: 'b', size: 32, color: 'secondary', x, y, name: 'Eyebrow' });
function Rule(parent, x, y, w) { const r = figma.createRectangle(); parent.appendChild(r); r.resize(w, 1); r.x = x; r.y = y; r.fills = paint(V.rule); r.name = 'Rule'; return r; }
function ImageBox(parent, x, y, w, h, caption) {
  const r = figma.createFrame(); parent.appendChild(r); r.resize(w, h); r.x = x; r.y = y;
  r.fills = paint(V.ph); r.name = 'Image placeholder';
  T(r, caption, { kind: 'b', size: 24, color: 'secondary', x: 32, bottom: h - 28, name: 'Caption' });
  return r;
}

// ---------- Slides ----------
// Blank slide with header (use when no layout fits).
function newSlide(deckPage, index, name, section, { confidential = false, pageNumber = true } = {}) {
  const f = figma.createFrame(); deckPage.appendChild(f);
  f.resize(1920, 1080); f.x = index * 2020; f.y = 0; f.clipsContent = true;
  f.name = `${String(index + 1).padStart(2, '0')} — ${name}`;
  f.fills = paint(V.bg);
  const h = HEADER.createInstance(); f.appendChild(h); h.x = 48; h.y = 48;
  h.setProperties({ [SECTION_KEY]: section });
  if (pageNumber) T(f, '00 / 00', { kind: 'b', size: 24, color: 'secondary', right: 1838, bottom: 984, name: 'Page number' });
  if (confidential) addConfidential(f, '[Client]');
  return f;
}

// Clone a layout from the Slides page onto the deck page.
function cloneLayout(layoutName, deckPage, index, section) {
  const src = slidesPage.findChild(n => n.type === 'FRAME' && n.name === `Layout / ${layoutName}`);
  if (!src) throw new Error(`Layout "${layoutName}" not found on the Slides page.`);
  const f = src.clone(); deckPage.appendChild(f);
  f.x = index * 2020; f.y = 0;
  f.name = `${String(index + 1).padStart(2, '0')} — ${layoutName}`;
  if (section) setSection(f, section);
  return f;
}

function setSection(frame, section) {
  const inst = frame.findOne(n => n.type === 'INSTANCE' && n.name === 'Header');
  if (inst) inst.setProperties({ [SECTION_KEY]: section });
}

// Set the nth text layer with a given name. Headings require HEADINGS_EDITABLE.
// order 'y' (default): top-to-bottom — index items, stacked rows.
// order 'x': left-to-right — columns, stats, side-by-side quotes (their y can differ after reflow).
function setText(frame, layerName, text, nth = 0, order = 'y') {
  const sort = order === 'x' ? (a, b) => (a.x - b.x) || (a.y - b.y) : (a, b) => (a.y - b.y) || (a.x - b.x);
  const nodes = frame.findAll(n => n.type === 'TEXT' && n.name === layerName).sort(sort);
  const node = nodes[nth];
  if (!node) throw new Error(`Text layer "${layerName}" #${nth} not found in "${frame.name}".`);
  if (boundIds(node, 'fontFamily').includes(V.hf.id)) assertHeadingsEditable();
  node.characters = text;
  return node;
}

// Remove repeated item layers beyond `keep` (e.g. a 4-column layout used for 3 items).
function removeExtra(frame, layerNames, keep) {
  for (const name of layerNames) {
    const nodes = frame.findAll(n => n.name === name).sort((a, b) => (a.x - b.x) || (a.y - b.y));
    nodes.slice(keep).forEach(n => n.remove());
  }
}

// Remove every layer with this name (e.g. the Note on a second Four columns slide, Column meta on a scope slide).
function removeAll(frame, layerName) { frame.findAll(n => n.name === layerName).forEach(n => n.remove()); }

// Set captions of the slide's Image placeholders, left-to-right then top-to-bottom, keeping them bottom-aligned.
function setCaptions(frame, captions) {
  const boxes = frame.children.filter(n => n.name === 'Image placeholder').sort((a, b) => (a.x - b.x) || (a.y - b.y));
  captions.forEach((c, i) => {
    if (!boxes[i]) throw new Error(`"${frame.name}" has only ${boxes.length} image placeholders.`);
    const cap = boxes[i].findOne(n => n.type === 'TEXT');
    cap.characters = c; cap.y = boxes[i].height - 28 - cap.height;
  });
}

// Re-anchor bottom-aligned text after its content changes (Statement → 920, Meta → 920, Note / footer → 984).
function anchorBottom(node, bottom) { node.y = Math.round(bottom - node.height); return node; }

// Place `below` directly under `above` (use after text reflows, e.g. after the Lastik switch).
function stackBelow(above, below, gap = 32) { below.y = Math.round(above.y + above.height + gap); return below; }

function addConfidential(frame, client) {
  const existing = frame.findOne(n => n.type === 'TEXT' && n.name === 'Confidential');
  if (existing) { existing.characters = `Confidential — prepared for ${client}`; return existing; }
  return T(frame, `Confidential — prepared for ${client}`, { kind: 'b', size: 24, color: 'secondary', x: 82, bottom: 984, name: 'Confidential' });
}

function setTheme(frame, modeName /* 'Dark' | 'Light' */) {
  frame.setExplicitVariableModeForCollection(THEME, THEME_MODE[modeName]);
}

// Renumber "NN / TT" on every slide of the deck page, ordered left to right.
function setPageNumbers(deckPage) {
  const slides = deckPage.children.filter(n => n.type === 'FRAME').sort((a, b) => a.x - b.x);
  slides.forEach((f, i) => {
    const pn = f.findOne(n => n.type === 'TEXT' && n.name === 'Page number');
    if (pn) { pn.characters = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`; pn.x = 1838 - pn.width; pn.y = 984 - pn.height; }
  });
  return slides.length;
}

// ---------- Bootstrap (fallback only: blank file without the template) ----------
// Recreates Theme + Typography variables and the Header component. Paste the SVG from assets/kanso-logo.svg.
// Only run when the user cannot duplicate the template. Do not run in a template copy.
async function bootstrapBlankFile(logoSvg) {
  const theme = figma.variables.createVariableCollection('Theme');
  const dark = theme.modes[0].modeId; theme.renameMode(dark, 'Dark'); const light = theme.addMode('Light');
  const W = { r: 0.96, g: 0.96, b: 0.95 }, K = { r: 0, g: 0, b: 0 };
  const color = (n, d, l, s) => { const v = figma.variables.createVariable(n, theme, 'COLOR'); v.setValueForMode(dark, d); v.setValueForMode(light, l); v.scopes = s; return v; };
  color('color/background', { r: 0.039, g: 0.039, b: 0.039, a: 1 }, { r: 1, g: 1, b: 1, a: 1 }, ['FRAME_FILL', 'SHAPE_FILL']);
  color('color/placeholder', { r: 0.11, g: 0.11, b: 0.11, a: 1 }, { r: 0.93, g: 0.93, b: 0.93, a: 1 }, ['FRAME_FILL', 'SHAPE_FILL']);
  color('color/text-primary', { ...W, a: 1 }, { ...K, a: 1 }, ['TEXT_FILL', 'SHAPE_FILL']);
  color('color/text-body', { ...W, a: 0.6 }, { ...K, a: 0.6 }, ['TEXT_FILL']);
  color('color/text-secondary', { ...W, a: 0.5 }, { ...K, a: 0.5 }, ['TEXT_FILL']);
  color('color/rule', { ...W, a: 0.15 }, { ...K, a: 0.15 }, ['STROKE_COLOR', 'SHAPE_FILL']);
  const typo = figma.variables.createVariableCollection('Typography');
  const tm = typo.modes[0].modeId; typo.renameMode(tm, 'Default');
  const str = (n, val, scope) => { const v = figma.variables.createVariable(n, typo, 'STRING'); v.setValueForMode(tm, val); v.scopes = [scope]; return v; };
  str('font/heading-family', 'Instrument Serif', 'FONT_FAMILY');
  str('font/heading-style', 'Regular', 'FONT_STYLE');
  str('font/body-family', 'Geist', 'FONT_FAMILY');
  str('font/body-style', 'Regular', 'FONT_STYLE');
  str('font/body-medium-style', 'Medium', 'FONT_STYLE');
  // Header component: see references/figma-system.md → "Header component" for the exact structure
  // (horizontal auto-layout 1824 wide, SPACE_BETWEEN, bottom-aligned, 24 px bottom padding, 1 px bottom stroke bound
  // to color/rule, logo from logoSvg with fills bound to color/text-primary, Geist Medium 24 label with a TEXT
  // component property "Section").
  return { themeId: theme.id, typographyId: typo.id, logoSvgLength: logoSvg.length };
}
