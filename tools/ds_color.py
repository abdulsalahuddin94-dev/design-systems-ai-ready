"""Color math for the design-system tools: hex <-> sRGB <-> OKLab/OKLCH, CIELAB L*, WCAG contrast,
and shade-scale (ramp) curve capture and regeneration. Standard library only."""
import math


def hex_to_rgba(h):
    h = h.strip().lstrip('#')
    if len(h) in (3, 4):
        h = ''.join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
    return r, g, b, a


def rgb_to_hex(r, g, b, a=1.0):
    c = lambda x: max(0, min(255, round(x * 255)))
    s = '#{:02X}{:02X}{:02X}'.format(c(r), c(g), c(b))
    return s if a >= 0.999 else s + '{:02X}'.format(c(a))


def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def rgb_to_oklab(r, g, b):
    r, g, b = _lin(r), _lin(g), _lin(b)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


def oklab_to_rgb(L, a, b):
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return r, g, bb


def hex_to_oklch(h):
    r, g, b, _ = hex_to_rgba(h)
    L, a, bb = rgb_to_oklab(r, g, b)
    C = math.hypot(a, bb)
    H = math.degrees(math.atan2(bb, a)) % 360
    return L, C, H


def _in_gamut(rgb, eps=1e-4):
    return all(-eps <= c <= 1 + eps for c in rgb)


def oklch_to_hex(L, C, H):
    """OKLCH -> hex, reducing chroma until the color fits sRGB (keeps lightness and hue)."""
    L = max(0.0, min(1.0, L))
    lo, hi = 0.0, max(0.0, C)
    def lin_rgb(c):
        a, b = c * math.cos(math.radians(H)), c * math.sin(math.radians(H))
        return oklab_to_rgb(L, a, b)
    if not _in_gamut(lin_rgb(hi)):
        for _ in range(30):
            mid = (lo + hi) / 2
            if _in_gamut(lin_rgb(mid)):
                lo = mid
            else:
                hi = mid
        hi = lo
    r, g, b = (max(0.0, min(1.0, x)) for x in lin_rgb(hi))
    return rgb_to_hex(_gam(r), _gam(g), _gam(b))


def relative_luminance(h):
    r, g, b, _ = hex_to_rgba(h)
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def cielab_lstar(h):
    y = relative_luminance(h)
    return 116 * (y ** (1 / 3)) - 16 if y > 216 / 24389 else y * 24389 / 27


def contrast(fg, bg):
    """WCAG 2.x contrast ratio. Alpha in fg is composited over bg."""
    fr, fg_, fb, fa = hex_to_rgba(fg)
    br, bg_, bb, _ = hex_to_rgba(bg)
    if fa < 1:
        fg = rgb_to_hex(fr * fa + br * (1 - fa), fg_ * fa + bg_ * (1 - fa), fb * fa + bb * (1 - fa))
    l1, l2 = relative_luminance(fg), relative_luminance(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


# ---------- shade scales ----------

def capture_curve(steps, base_step):
    """steps: {step_label: hex}. Returns the ramp's OKLCH curve relative to its base step."""
    bL, bC, bH = hex_to_oklch(steps[base_step])
    curve = {}
    for s, h in steps.items():
        L, C, H = hex_to_oklch(h)
        dh = ((H - bH + 180) % 360) - 180 if C > 0.02 and bC > 0.02 else 0.0
        curve[s] = {'L': round(L, 4), 'C_ratio': round(C / bC, 4) if bC > 1e-6 else 0.0,
                    'H_shift': round(dh, 2), 'L_star': round(cielab_lstar(h), 1)}
    return {'base_step': base_step, 'base_oklch': [round(bL, 4), round(bC, 4), round(bH, 2)], 'steps': curve}


def regenerate_ramp(curve, new_base_hex, order, keep_anchor_ends=True, mode='oklch'):
    """Build a new ramp with the same lightness/chroma shape around a new base color.
    order: step labels from lightest to darkest (or any consistent order).
    mode 'oklch': each step keeps its lightness; the base step becomes exactly the new color;
      the lightness difference at the base fades out linearly toward both ends of the scale.
    mode 'm3-tone': each step keeps its CIELAB L* tone exactly (Material 3 tonal palettes), hue and
      chroma come from the new base; the base step is also re-toned (use for Android palettes)."""
    nL, nC, nH = hex_to_oklch(new_base_hex)
    base = curve['base_step']
    oL = curve['steps'][base]['L']
    bi = order.index(base)
    out = {}
    for i, s in enumerate(order):
        st = curve['steps'][s]
        if mode == 'oklch' and s == base:
            out[s] = new_base_hex.upper()
            continue
        C = nC * st['C_ratio']
        H = (nH + st['H_shift']) % 360
        if mode == 'm3-tone':
            target = st['L_star']
            if target >= 99.95:
                out[s] = '#FFFFFF'; continue
            if target <= 0.05:
                out[s] = '#000000'; continue
            lo, hi = 0.0, 1.0
            for _ in range(40):
                mid = (lo + hi) / 2
                if cielab_lstar(oklch_to_hex(mid, C, H)) < target:
                    lo = mid
                else:
                    hi = mid
            out[s] = oklch_to_hex((lo + hi) / 2, C, H)
            continue
        span = bi if i < bi else (len(order) - 1 - bi)
        w = 1 - abs(i - bi) / span if span else 0
        if keep_anchor_ends and i in (0, len(order) - 1):
            w = 0
        L = st['L'] + (nL - oL) * w
        out[s] = oklch_to_hex(L, C, H)
    return out
