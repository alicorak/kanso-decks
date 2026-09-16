// Kanso deck build helpers — UI v2 (2026-09-15)
// Paste this block at the top of a `use_figma` script that runs in a file duplicated from "Kanso Deck Template".
// Everything is looked up by name, so it works in any copy of the template.
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
  if (!v) throw new Error(`Missing variable "${name}". Is this file duplicated from the UI v2 Kanso Deck Template?`);
  return v;
}
const V = {
  top: varByName('color/background-top'), bottom: varByName('color/background-bottom'),
  ph: varByName('color/placeholder'), primary: varByName('color/text-primary'),
  body: varByName('color/text-body'), secondary: varByName('color/text-secondary'),
  rule: varByName('color/rule'), ruleStrong: varByName('color/rule-strong'),
  outline: varByName('color/outline'), accent: varByName('color/accent'),
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

// ---------- Pages and components ----------
const PAGE = name => figma.root.children.find(p => p.name === name);
const componentsPage = PAGE('Components');
const slidesPage = PAGE('Slides');
await componentsPage.loadAsync();
await slidesPage.loadAsync();
const COMPONENT = name => componentsPage.findOne(n => n.type === 'COMPONENT' && n.name === name);
const HEADER = COMPONENT('Header'), FOOTER = COMPONENT('Footer');
const KANJI = COMPONENT('Kanji background'), OMARK = COMPONENT('O mark'), QUOTE = COMPONENT('Quote mark'), GLOBE = COMPONENT('Globe icon');
const propKey = (component, prefix) => Object.keys(component.componentPropertyDefinitions).find(k => k.startsWith(prefix));
const SECTION_KEY = propKey(HEADER, 'Section');
const FOOTER_KEY = { meta: propKey(FOOTER, 'Meta'), show: propKey(FOOTER, 'Show meta'), page: propKey(FOOTER, 'Page') };

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
// Blank slide with gradient, header, footer; optional title column and content column.
function newSlide(deckPage, index, name, section, { meta = null, title = null, contentRule = false } = {}) {
  const f = figma.createFrame(); deckPage.appendChild(f);
  f.resize(1920, 1080); f.x = index * 2020; f.y = 0; f.clipsContent = true;
  f.name = `${String(index + 1).padStart(2, '0')} — ${name}`;
  bgFill(f);
  const h = HEADER.createInstance(); f.appendChild(h); h.x = 0; h.y = 0; h.setProperties({ [SECTION_KEY]: section });
  const ft = FOOTER.createInstance(); f.appendChild(ft); ft.x = 0; ft.y = 978;
  setFooter(f, { meta, page: '00 / 00' });
  let titleCol = null, contentCol = null;
  if (title != null) {
    titleCol = AL(f, 'VERTICAL', { name: 'Title column', x: 48, y: 153, w: 432, h: 776, pad: [48, 0, 48, 0], main: 'SPACE_BETWEEN' });
    T(titleCol, title, { kind: 'h', size: 60, lh: 100, name: 'Title', fill: true });
    contentCol = AL(f, 'VERTICAL', { name: 'Content column', x: 512, y: 153, w: 1360, h: 776, pad: [48, 0, 48, 0], main: 'SPACE_BETWEEN', stroke: contentRule ? { v: 'ruleStrong', l: 1 } : null });
  }
  return { frame: f, titleCol, contentCol };
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
  const inst = frame.findChild(n => n.type === 'INSTANCE' && n.name === 'Header');
  if (inst) inst.setProperties({ [SECTION_KEY]: section });
}

// meta: string shows it, null/'' hides it. page: optional page text.
function setFooter(frame, { meta, page } = {}) {
  const inst = frame.findChild(n => n.type === 'INSTANCE' && n.name === 'Footer');
  if (!inst) return;
  const props = {};
  if (meta !== undefined) { props[FOOTER_KEY.meta] = meta || ''; props[FOOTER_KEY.show] = !!meta; }
  if (page !== undefined) props[FOOTER_KEY.page] = page;
  inst.setProperties(props);
}
const addConfidential = (frame, client) => setFooter(frame, { meta: `Confidential — prepared for ${client}` });

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

// ---------- Proposal signing ----------
// Returns the "Sign button" component, creating it on the Components page if this file predates the signing update.
function ensureSignButton() {
  const existing = COMPONENT('Sign button');
  if (existing) return existing;
  const lowest = componentsPage.children.reduce((m, n) => Math.max(m, n.y + n.height), 0);
  const btn = figma.createComponent(); componentsPage.appendChild(btn);
  btn.name = 'Sign button'; btn.x = 100; btn.y = lowest + 160;
  btn.layoutMode = 'HORIZONTAL'; btn.primaryAxisAlignItems = 'SPACE_BETWEEN'; btn.counterAxisAlignItems = 'CENTER';
  btn.paddingTop = 28; btn.paddingBottom = 28; btn.paddingLeft = 32; btn.paddingRight = 32; btn.itemSpacing = 32;
  btn.fills = []; btn.strokes = paint(V.ruleStrong); btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE'; btn.cornerRadius = 999;
  btn.resize(1360, 100); btn.primaryAxisSizingMode = 'FIXED'; btn.counterAxisSizingMode = 'AUTO';
  const label = T(btn, 'Sign the proposal →', { kind: 'h', size: 42, lh: 100, name: 'Button label' });
  const helper = T(btn, 'Signed in Google Docs · valid until [date]', { kind: 'b', size: 24, lh: 120, upper: true, color: 'secondary', name: 'Button helper', align: 'RIGHT' });
  label.componentPropertyReferences = { characters: btn.addComponentProperty('Label', 'TEXT', 'Sign the proposal →') };
  helper.componentPropertyReferences = { characters: btn.addComponentProperty('Helper', 'TEXT', 'Signed in Google Docs · valid until [date]') };
  btn.description = 'Proposal signing CTA. Link it to the client’s e-sign URL with setSignLink.';
  return btn;
}
const signKey = (btn, prefix) => Object.keys(btn.componentPropertyDefinitions).find(k => k.startsWith(prefix));

// Appends a Sign button as the last item of the slide's Content column (Investment). helper: text on the right.
function addSignButton(frame, helper = 'Signed in Google Docs · valid until [date]') {
  const btn = ensureSignButton();
  const col = frame.findChild(n => n.name === 'Content column');
  if (!col) throw new Error(`"${frame.name}" has no Content column.`);
  col.findAll(n => n.type === 'INSTANCE' && n.name === 'Sign button').forEach(n => n.remove());
  const inst = btn.createInstance(); col.appendChild(inst); inst.layoutSizingHorizontal = 'FILL';
  inst.setProperties({ [signKey(btn, 'Helper')]: helper });
  return inst;
}

// Links every Sign button on a slide to the e-sign URL: text hyperlinks (work in PDF exports) + a click action
// (works in Figma present mode). Works while headings render in Lastik.
async function setSignLink(frame, url) {
  const buttons = frame.findAll(n => n.type === 'INSTANCE' && n.name === 'Sign button');
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
