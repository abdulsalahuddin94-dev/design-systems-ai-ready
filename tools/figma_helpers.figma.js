// DS helpers for figma-console `figma_execute` (Design_System_Intake_Skill section 0c).
// Install ONCE per file per plugin run: paste this whole file into figma_execute. It stores the helpers in
// globalThis.DS (they stay loaded until the Desktop Bridge plugin restarts or the file changes), so later
// scripts are short: `await DS.ready(); const f = DS.frame('VERTICAL','Card',{gap:'space/4',pad:['space/4','space/3']});`
// If a script fails with "DS is not defined", paste this file again. Every value is bound to a variable or
// style by its FULL name (e.g. 'md/sys/color/primary', 'space/4'); raw hex/px is never written.
// Names, not node ids: ids differ between files (CLAUDE.md rule).
globalThis.DS = (() => {
  let vars = null, textStyles = null, effectStyles = null;
  const libVars = {}, libComps = {};
  const DS = {};

  // Load caches. Call at the top of each script (cheap after the first call). DS.ready(true) refreshes.
  DS.ready = async (refresh) => {
    if (vars && !refresh) return DS;
    vars = await figma.variables.getLocalVariablesAsync();
    textStyles = await figma.getLocalTextStylesAsync();
    effectStyles = await figma.getLocalEffectStylesAsync();
    return DS;
  };

  // Variables: local by full name, or a library variable imported by key (Design files: keys come from
  // data/component-registry.json or data/tokens.json, never from Figma reads).
  DS.v = (name) => {
    if (typeof name !== 'string') return name;
    const v = (vars || []).find(x => x.name === name) || libVars[name];
    if (!v) throw new Error('Variable not found: ' + name + ' (local or imported). Near: ' +
      (vars || []).filter(x => x.name.split('/').pop() === name.split('/').pop()).map(x => x.name).slice(0, 5).join(', '));
    return v;
  };
  DS.importVar = async (name, key) => (libVars[name] = await figma.variables.importVariableByKeyAsync(key));
  DS.comp = async (name, key) => {
    if (libComps[name]) return libComps[name];
    if (key) {
      try { return (libComps[name] = await figma.importComponentSetByKeyAsync(key)); }
      catch (e) { return (libComps[name] = await figma.importComponentByKeyAsync(key)); }
    }
    const n = figma.root.findOne(c => (c.type === 'COMPONENT_SET' || (c.type === 'COMPONENT' && c.parent.type !== 'COMPONENT_SET')) && c.name === name);
    if (!n) throw new Error('Component not found: ' + name);
    return (libComps[name] = n);
  };
  // Instance of a component (set): variant props as {Size:'Large', State:'Default'}.
  DS.instance = async (name, variant, key) => {
    const c = await DS.comp(name, key);
    if (c.type === 'COMPONENT') return c.createInstance();
    const want = variant || {};
    const match = c.children.find(k => Object.entries(want).every(([p, val]) => (k.variantProperties || {})[p] === val)) || c.defaultVariant;
    return match.createInstance();
  };
  // Set instance properties by their visible name ('Label' matches 'Label#12:3'); texts, booleans, swaps, variants.
  DS.props = (inst, values) => {
    const defs = inst.componentProperties, out = {};
    for (const [k, val] of Object.entries(values)) {
      const full = Object.keys(defs).find(p => p === k || p.split('#')[0] === k);
      if (!full) throw new Error('Property "' + k + '" not on ' + inst.name + '. Has: ' + Object.keys(defs).map(p => p.split('#')[0]).join(', '));
      out[full] = (defs[full].type === 'INSTANCE_SWAP' && typeof val === 'object') ? val.id : val;
    }
    inst.setProperties(out);
    return inst;
  };

  // Paint and binding helpers.
  DS.paint = (name) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', DS.v(name));
  DS.fill = (node, name) => { node.fills = name ? [DS.paint(name)] : []; return node; };
  DS.stroke = (node, name, weightVar) => {
    node.strokes = [DS.paint(name)];
    if (weightVar) ['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight'].forEach(k => node.setBoundVariable(k, DS.v(weightVar)));
    return node;
  };
  DS.radius = (node, name) => { ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(k => node.setBoundVariable(k, DS.v(name))); return node; };
  DS.gap = (node, name) => { node.setBoundVariable('itemSpacing', DS.v(name)); return node; };
  // pad(node, all) | pad(node, horizontal, vertical) | pad(node, top, right, bottom, left)
  DS.pad = (node, a, b, c, d) => {
    const [t, r, bo, l] = d !== undefined ? [a, b, c, d] : b !== undefined ? [b, a, b, a] : [a, a, a, a];
    [['paddingTop', t], ['paddingRight', r], ['paddingBottom', bo], ['paddingLeft', l]].forEach(([k, n]) => { if (n) node.setBoundVariable(k, DS.v(n)); });
    return node;
  };
  DS.size = (node, wVar, hVar) => { if (wVar) node.setBoundVariable('width', DS.v(wVar)); if (hVar) node.setBoundVariable('height', DS.v(hVar)); return node; };

  // Auto Layout frame, transparent unless fill is given. opts: {gap, pad:[...], fill, radius, stroke, w:'FILL'|'HUG'|'FIXED', h, align, counter}
  DS.frame = (dir, name, o = {}) => {
    const f = figma.createFrame();
    f.name = name; f.layoutMode = dir; f.fills = [];
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    if (o.gap) DS.gap(f, o.gap);
    if (o.pad) DS.pad(f, ...[].concat(o.pad));
    if (o.fill) DS.fill(f, o.fill);
    if (o.radius) DS.radius(f, o.radius);
    if (o.stroke) DS.stroke(f, o.stroke, o.strokeWeight);
    if (o.align) f.primaryAxisAlignItems = o.align;
    if (o.counter) f.counterAxisAlignItems = o.counter;
    if (o.parent) { o.parent.appendChild(f); DS.sizing(f, o.w, o.h); }
    return f;
  };
  // Sizing after the node is inside an Auto Layout parent: 'FILL' | 'HUG' | 'FIXED'.
  DS.sizing = (node, w, h) => { if (w) node.layoutSizingHorizontal = w; if (h) node.layoutSizingVertical = h; return node; };

  // Text with a local text style and a color variable. Loads the style's font first.
  DS.textStyle = (name) => {
    const s = (textStyles || []).find(x => x.name === name);
    if (!s) throw new Error('Text style not found: ' + name);
    return s;
  };
  DS.text = async (chars, style, color, name, parent) => {
    const s = DS.textStyle(style);
    await figma.loadFontAsync(s.fontName);
    const t = figma.createText();
    await t.setTextStyleIdAsync(s.id);
    t.characters = chars;
    if (color) DS.fill(t, color);
    t.name = name || chars.slice(0, 40);
    if (parent) parent.appendChild(t);
    return t;
  };
  DS.effect = async (node, name) => {
    const s = (effectStyles || []).find(x => x.name === name);
    if (!s) throw new Error('Effect style not found: ' + name);
    await node.setEffectStyleIdAsync(s.id);
    return node;
  };

  // Icon instance by name ('Icon/<name>' local component, or a component named <name>), color bound to a token.
  DS.icon = async (name, color, key) => {
    const c = key ? await DS.comp('Icon/' + name, key)
      : figma.root.findOne(n => n.type === 'COMPONENT' && (n.name === 'Icon/' + name || n.name === name));
    if (!c) throw new Error('Icon not found: ' + name);
    const i = c.createInstance();
    if (color) i.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.length).forEach(n => DS.fill(n, color));
    return i;
  };

  // Find by name (current page first, then the whole file) and find-or-create a Section.
  DS.find = (name, type) => {
    const ok = n => n.name === name && (!type || n.type === type);
    return figma.currentPage.findOne(ok) || figma.root.findOne(ok);
  };
  DS.section = (name) => {
    let s = figma.currentPage.findOne(n => n.type === 'SECTION' && n.name === name);
    if (!s) { s = figma.createSection(); s.name = name; }
    return s;
  };
  // Short report of what a script made: name, type, size, and any unbound fill / padding / gap left inside.
  DS.report = (node) => {
    const raw = [];
    [node, ...(node.findAll ? node.findAll(() => true) : [])].forEach(n => {
      if (n.type === 'INSTANCE' || (n.parent && n.parent.type === 'INSTANCE')) return;
      const bv = n.boundVariables || {};
      if (Array.isArray(n.fills) && n.fills.some((f, i) => f.type === 'SOLID' && f.visible !== false && !(bv.fills && bv.fills[i]))) raw.push(n.name + ': fill');
      ['itemSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(k => { if (n.layoutMode && n.layoutMode !== 'NONE' && n[k] > 0 && !bv[k]) raw.push(n.name + ': ' + k); });
    });
    return { name: node.name, type: node.type, size: Math.round(node.width) + 'x' + Math.round(node.height), raw: raw.slice(0, 20), rawCount: raw.length };
  };
  return DS;
})();
await DS.ready(true);
return 'DS helpers installed: ' + Object.keys(DS).join(', ');
