"""Platform code names for design tokens, text styles and component properties.

Used by tools/tokens_to_css.py (token names in tokens.ts + DesignTokens.swift / DesignTokens.kt) and
tools/storybook_docs.py (text styles and component properties), so an iOS or Android Storybook shows
developers the names they type, not CSS variables. Figma stays the source: every code name is derived
mechanically from the Figma name, and the Figma name is always shown next to it.

Rules
- Web:     CSS variable (--color-text-primary), text style class (.ts-sm-semi-bold).
- iOS:     SwiftUI. Colors Color.<camel path> (asset catalog name = Figma path for UIKit), numbers
           <Collection>.<camel> (CGFloat), text styles the Dynamic Type style (.font(.body), Emphasized
           = .bold()), properties camelCase with enum cases (.filled).
- Android: Jetpack Compose. M3 roles MaterialTheme.colorScheme.<role> (md.sys.color.<role>), state
           layers <role>.copy(alpha = 0.08f), M3 type scale MaterialTheme.typography.<style>
           (md.sys.typescale.*), M3 shapes MaterialTheme.shapes.<size>; everything else
           AppTheme.colors.<camel> / AppTheme.<Collection>.<camel> (XML @color/<snake>, @dimen/<snake>).
"""
import re

M3_COLOR_ROLES = {
    "primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "inversePrimary",
    "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer",
    "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
    "background", "onBackground", "surface", "onSurface", "surfaceVariant", "onSurfaceVariant",
    "surfaceTint", "inverseSurface", "inverseOnSurface", "error", "onError", "errorContainer",
    "onErrorContainer", "outline", "outlineVariant", "scrim", "surfaceBright", "surfaceContainer",
    "surfaceContainerHigh", "surfaceContainerHighest", "surfaceContainerLow", "surfaceContainerLowest",
    "surfaceDim", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
    "secondaryFixed", "secondaryFixedDim", "onSecondaryFixed", "onSecondaryFixedVariant",
    "tertiaryFixed", "tertiaryFixedDim", "onTertiaryFixed", "onTertiaryFixedVariant",
}
M3_TYPE = {f"{g}{s}" for g in ("display", "headline", "title", "body", "label") for s in ("Large", "Medium", "Small")}
M3_SHAPES = {"extraSmall", "small", "medium", "large", "extraLarge"}
HIG_TEXT = {"largetitle": "largeTitle", "title1": "title", "title": "title", "title2": "title2", "title3": "title3",
            "headline": "headline", "body": "body", "callout": "callout", "subheadline": "subheadline",
            "footnote": "footnote", "caption1": "caption", "caption": "caption", "caption2": "caption2"}
PLATFORM_LABEL = {"web": "CSS variable", "ios": "SwiftUI", "android": "Jetpack Compose"}


def platform_key(platform):
    p = (platform or "web").lower()
    return "ios" if "ios" in p else "android" if "android" in p else "web"


def words(text, dedupe=True):
    """Words of a Figma name: no emoji or symbols, camel humps split. With dedupe, a word that repeats a
    parent segment is dropped ("Status/Danger/Danger Background" -> status danger background)."""
    out = []
    for seg in re.sub(r"\(.*?\)", " ", text).split("/"):
        seg = re.sub(r"([a-z])([A-Z])", r"\1 \2", seg)
        parents = [x.lower() for x in out]
        for w in re.findall(r"[A-Za-z]+|\d+", seg):
            if not dedupe or w.isdigit() or w.lower() not in parents:
                out.append(w)
    return out


def camel(text, dedupe=True):
    ws = words(text, dedupe)
    if not ws:
        return "token"
    s = ws[0].lower() + "".join(w[:1].upper() + w[1:].lower() if not w.isdigit() else w for w in ws[1:])
    return s if not s[0].isdigit() else "v" + s


def pascal(text):
    c = camel(text)
    return c[:1].upper() + c[1:]


def kebab(text):
    return "-".join(w.lower() for w in words(text, dedupe=False))


def snake(text):
    return "_".join(w.lower() for w in words(text, dedupe=False))


def _collection_name(collection):
    return pascal(re.sub(r"(?i)^color\s*/\s*", "", collection)) or "Tokens"


def _strip_color(name):
    return re.sub(r"(?i)^colou?r/", "", name)


def token_code(var, platform, role=""):
    """[{label, name}] for one variable; the first entry is what developers type."""
    p = platform_key(platform)
    name, col, typ = var["name"], var["collection"], var["type"]
    role = (role or "").lower()
    if p == "ios":
        if typ == "color":
            return [{"label": "SwiftUI", "name": f"Color.{camel(_strip_color(name))}"},
                    {"label": "UIKit", "name": f'UIColor(named: "{name}")'}]
        return [{"label": "SwiftUI", "name": f"{_collection_name(col)}.{camel(name)}"}]
    if p == "android":
        last = name.split("/")[-1]
        if typ == "color":
            m = re.match(r"(?i)state ?layers?/(.+)/opacity-?(\d+)", name)
            if m and camel(m.group(1)) in M3_COLOR_ROLES:
                a = int(m.group(2)) / 100
                return [{"label": "Compose", "name": f"MaterialTheme.colorScheme.{camel(m.group(1))}.copy(alpha = {a:g}f)"},
                        {"label": "M3 token", "name": f"md.sys.state.{kebab(m.group(1))}.opacity-{m.group(2)}"}]
            # an M3 role only when the variable is an M3 scheme color (Schemes/..., md.sys..., or the bare role name),
            # so "color/text/primary" stays a custom color and is not mistaken for colorScheme.primary
            m3_path = re.search(r"(?i)(^|/)schemes?/|md\.sys|(^|/)m3(/|$)", col + "/" + name) or "/" not in name
            if camel(last) in M3_COLOR_ROLES and "primitive" not in role and m3_path:
                return [{"label": "Compose", "name": f"MaterialTheme.colorScheme.{camel(last)}"},
                        {"label": "M3 token", "name": f"md.sys.color.{kebab(last)}"}]
            if "primitive" in role:
                path = "/".join(name.split("/")[1:]) if name.lower().startswith("palette") else name
                return [{"label": "Compose", "name": f"Palette.{camel(path)}"},
                        {"label": "M3 token", "name": f"md.ref.palette.{kebab(path)}"}]
            path = re.sub(r"(?i)^schemes/", "", _strip_color(name))
            parent = path.split("/")[-2] if "/" in path else ""
            # M3-style names repeat their group in the last segment ("Info/On Info Container"): the last
            # segment alone is the name. Otherwise ("text/primary") the path is the name.
            self_contained = not parent or all(w.lower() in [x.lower() for x in words(last, False)] for w in words(parent, False))
            short = camel(last, dedupe=False) if self_contained else camel(path, dedupe=False)
            return [{"label": "Compose", "name": f"AppTheme.colors.{short}"},
                    {"label": "XML", "name": f"@color/{snake(path)}"}]
        if re.search(r"(?i)corner|shape|radius|raduis", col + "/" + name):
            if camel(last) in M3_SHAPES:
                return [{"label": "Compose", "name": f"MaterialTheme.shapes.{camel(last)}"},
                        {"label": "M3 token", "name": f"md.sys.shape.corner.{kebab(last)}"}]
            return [{"label": "Compose", "name": f"AppTheme.{_collection_name(col)}.{camel(last)}"},
                    {"label": "M3 token", "name": f"md.sys.shape.corner.{kebab(last)}"}]
        if typ not in ("number", "dimension", "float"):
            return [{"label": "Compose", "name": f"AppTheme.{_collection_name(col)}.{camel(name)}"}]
        return [{"label": "Compose", "name": f"AppTheme.{_collection_name(col)}.{camel(name)}"},
                {"label": "XML", "name": f"@dimen/{snake(name)}"}]
    return [{"label": "CSS variable", "name": var.get("css", "")}]


def text_style_code(style, platform, css_class=""):
    p = platform_key(platform)
    if p == "ios":
        base, _, weight = style.partition("/")
        hig = HIG_TEXT.get(re.sub(r"[^a-z0-9]", "", base.lower()))
        if hig:
            bold = ".bold()" if re.search(r"(?i)emphasi|bold|semi", weight) else ""
            return [{"label": "SwiftUI", "name": f".font(.{hig}{bold})"}, {"label": "Dynamic Type", "name": f"UIFont.TextStyle.{hig}"}]
        return [{"label": "SwiftUI", "name": f".font(.{camel(style)})"}]
    if p == "android":
        c = camel(style)
        if c in M3_TYPE:
            return [{"label": "Compose", "name": f"MaterialTheme.typography.{c}"}, {"label": "M3 token", "name": f"md.sys.typescale.{kebab(style)}"}]
        return [{"label": "Compose", "name": f"AppTextStyles.{c}"}]
    return [{"label": "CSS class", "name": "." + css_class}] if css_class else []


def property_code(component, props, variants, defaults, platform):
    """Suggested code API for a component: [{figma, code, values}] and a one-line call."""
    p = platform_key(platform)
    if p == "web":
        return [], ""
    rows, args = [], []
    for k, values in variants.items():
        enum = pascal(component) + pascal(k)
        cases = [(f".{camel(v)}" if p == "ios" else f"{enum}.{pascal(v)}") for v in values]
        rows.append({"figma": k, "code": camel(k), "type": enum, "values": cases})
        d = defaults.get(k, values[0]) if values else None
        if d in values:
            args.append(f"{camel(k)}: {cases[values.index(d)]}" if p == "ios" else f"{camel(k)} = {cases[values.index(d)]}")
    for k, kind in props.items():
        t = {"BOOLEAN": "Bool" if p == "ios" else "Boolean", "TEXT": "String", "INSTANCE_SWAP": "Image" if p == "ios" else "ImageVector"}.get(kind, "Any")
        rows.append({"figma": k, "code": camel(k), "type": t, "values": []})
        if kind == "TEXT":
            v = defaults.get(k, k)
            args.append(f'{camel(k)}: "{v}"' if p == "ios" else f'{camel(k)} = "{v}"')
    call = f"{pascal(component)}({', '.join(args)})"
    return rows, call


# ------------------------------------------------------------------ platform source files
def _hex(v):
    h = str(v or "").lstrip("#").upper()
    if len(h) == 6:
        h += "FF"
    return h if re.fullmatch(r"[0-9A-F]{8}", h) else None


def _num(v):
    try:
        return f"{float(v):g}"
    except (TypeError, ValueError):
        return None


def swift_source(variables, collections, text_styles, project):
    lines = [
        f"// DesignTokens.swift - {project} design tokens for SwiftUI.",
        "// Generated by tools/tokens_to_css.py from data/tokens.json (Figma variables). Do not edit by hand.",
        "// Names match the SwiftUI column in Storybook. Colors adapt to Light/Dark automatically.",
        "import SwiftUI",
        "import UIKit",
        "",
        "extension Color {",
        "    init(hex: UInt32) {",
        "        self.init(.sRGB, red: Double((hex >> 24) & 0xFF) / 255, green: Double((hex >> 16) & 0xFF) / 255,",
        "                  blue: Double((hex >> 8) & 0xFF) / 255, opacity: Double(hex & 0xFF) / 255)",
        "    }",
        "    init(light: UInt32, dark: UInt32) {",
        "        self.init(UIColor { $0.userInterfaceStyle == .dark ? UIColor(Color(hex: dark)) : UIColor(Color(hex: light)) })",
        "    }",
        "",
    ]
    numbers, seen = {}, set()
    for v in variables.values():
        modes = collections[v["collection"]]["modes"]
        res = v.get("resolved") or {}
        if v["type"] == "color":
            code = token_code(v, "ios")[0]["name"].split(".", 1)[1]
            if code in seen:
                continue
            seen.add(code)
            light = next((m for m in modes if m.lower() == "light"), None)
            dark = next((m for m in modes if m.lower() == "dark"), None)
            if light and dark and _hex(res.get(light)) and _hex(res.get(dark)):
                lines.append(f"    static let {code} = Color(light: 0x{_hex(res[light])}, dark: 0x{_hex(res[dark])}) // {v['collection']}::{v['name']}")
            elif _hex(res.get(modes[0])):
                lines.append(f"    static let {code} = Color(hex: 0x{_hex(res[modes[0]])}) // {v['collection']}::{v['name']}")
        elif _num(next(iter(v["values"].values()), None)) is not None:
            numbers.setdefault(_collection_name(v["collection"]), []).append(v)
    lines += ["}", ""]
    for enum, vs in numbers.items():
        lines.append(f"enum {enum} {{")
        names = set()
        for v in vs:
            c = camel(v["name"])
            if c in names:
                continue
            names.add(c)
            lines.append(f"    static let {c}: CGFloat = {_num(next(iter(v['values'].values())))} // {v['collection']}::{v['name']}")
        lines += ["}", ""]
    if text_styles:
        lines.append("// Text styles: use the Dynamic Type style in the Storybook SwiftUI column, e.g. Text(\"Hi\").font(.body).")
    return "\n".join(lines) + "\n"


def kotlin_source(variables, collections, text_styles, project, roles):
    pkg = "designsystem." + (snake(project) or "tokens")
    lines = [
        f"// DesignTokens.kt - {project} design tokens for Jetpack Compose (Material 3).",
        "// Generated by tools/tokens_to_css.py from data/tokens.json (Figma variables). Do not edit by hand.",
        "// Names match the Compose column in Storybook.",
        f"package {pkg}",
        "",
        "import androidx.compose.foundation.shape.RoundedCornerShape",
        "import androidx.compose.material3.*",
        "import androidx.compose.runtime.*",
        "import androidx.compose.ui.graphics.Color",
        "import androidx.compose.ui.text.TextStyle",
        "import androidx.compose.ui.text.font.FontWeight",
        "import androidx.compose.ui.unit.dp",
        "import androidx.compose.ui.unit.sp",
        "",
    ]
    palette, m3, custom, dims = [], {}, {}, {}
    for v in variables.values():
        role = roles.get(v["collection"], "")
        if v["type"] == "color":
            code = token_code(v, "android", role)[0]["name"]
            if code.startswith("Palette."):
                palette.append((code.split(".", 1)[1], v))
            elif code.startswith("MaterialTheme.colorScheme.") and ".copy(" not in code:
                m3[code.rsplit(".", 1)[1]] = v
            elif code.startswith("AppTheme.colors."):
                custom[code.rsplit(".", 1)[1]] = v
        elif _num(next(iter(v["values"].values()), None)) is not None:
            code = token_code(v, "android", role)[0]["name"]
            if code.startswith("AppTheme."):
                dims.setdefault(code.split(".")[1], {})[code.split(".")[2]] = v
            elif code.startswith("MaterialTheme.shapes."):
                dims.setdefault("M3Shapes", {})[code.rsplit(".", 1)[1]] = v
    if palette:
        lines.append("object Palette {")
        lines += [f"    val {c} = Color(0x{_argb(v)}) // {v['collection']}::{v['name']}" for c, v in palette if _argb(v)]
        lines += ["}", ""]
    modes = sorted({m for v in list(m3.values()) + list(custom.values()) for m in collections[v["collection"]]["modes"]})
    for mode in modes or ["Value"]:
        if m3:
            fn = "darkColorScheme" if mode.lower() == "dark" else "lightColorScheme"
            lines.append(f"val {pascal(mode)}ColorScheme = {fn}(")
            lines += [f"    {c} = Color(0x{_argb(v, mode)})," for c, v in m3.items() if _argb(v, mode)]
            lines += [")", ""]
    if custom:
        lines.append("@Immutable")
        lines.append("class AppColors(")
        lines += [f"    val {c}: Color," for c in custom]
        lines += [")", ""]
        for mode in modes or ["Value"]:
            lines.append(f"val {pascal(mode)}AppColors = AppColors(")
            lines += [f"    {c} = Color(0x{_argb(v, mode) or '00000000'})," for c, v in custom.items()]
            lines += [")", ""]
        lines.append(f"val LocalAppColors = staticCompositionLocalOf {{ {pascal(modes[0]) if modes else 'Value'}AppColors }}")
        lines.append("")
    lines.append("object AppTheme {")
    if custom:
        lines.append("    val colors: AppColors @Composable get() = LocalAppColors.current")
    for obj, vs in dims.items():
        if obj == "M3Shapes":
            continue
        lines.append(f"    object {obj} {{")
        lines += [f"        val {c} = {_num(next(iter(v['values'].values())))}.dp // {v['collection']}::{v['name']}" for c, v in vs.items()]
        lines.append("    }")
    lines += ["}", ""]
    if dims.get("M3Shapes"):
        lines.append("val AppShapes = Shapes(")
        lines += [f"    {c} = RoundedCornerShape({_num(next(iter(v['values'].values())))}.dp)," for c, v in dims["M3Shapes"].items()]
        lines += [")", ""]
    if text_styles:
        lines.append("object AppTextStyles {")
        base = []
        for s in text_styles:
            c = camel(s["name"])
            w = "SemiBold" if re.search(r"(?i)semi", s.get("font", "")) else "Bold" if re.search(r"(?i)bold", s.get("font", "")) else "Medium" if re.search(r"(?i)medium", s.get("font", "")) else "Normal"
            lines.append(f"    val {c} = TextStyle(fontSize = {s.get('size', 14):g}.sp, lineHeight = {s.get('line_height', 20):g}.sp, letterSpacing = {s.get('letter_spacing', 0):g}.sp, fontWeight = FontWeight.{w})")
            if c in M3_TYPE:
                base.append(c)
        lines += ["}", "", "val AppTypography = Typography("]
        lines += [f"    {c} = AppTextStyles.{c}," for c in base]
        lines += [")", ""]
    return "\n".join(lines) + "\n"


def _argb(v, mode=None):
    res = v.get("resolved") or {}
    val = res.get(mode) if mode else next(iter(res.values()), None)
    h = _hex(val)
    return (h[6:] + h[:6]) if h else None


def assign_codes(variables, platform, roles):
    """{key: [{label, name}]} for every variable; names that would collide fall back to the full Figma path."""
    out = {k: token_code(v, platform, roles.get(v["collection"], "")) for k, v in variables.items()}
    seen = {}
    for k, codes in out.items():
        seen.setdefault(codes[0]["name"], []).append(k)
    for name, keys in seen.items():
        if len(keys) > 1 and platform_key(platform) != "web" and "(" not in name:
            for k in keys:
                v = variables[k]
                head = name.rsplit(".", 1)[0]
                out[k][0]["name"] = f"{head}.{camel(_strip_color(v['collection'] + '/' + v['name']), dedupe=False)}"
    return out
