# Form Elements - component reference

> **Node IDs:** any id like `75:26830` in this file belongs to the original Trianglz file only. In a duplicated template or another file the ids change, so always find components, styles and variables by **name** (e.g. `figma.root.findAll(n => n.name === 'User Avatar')`, `getLocalVariablesAsync()` by variable name). Never use an id from this file to edit a copy.

File key `7qsOqckanKwGDbkljD3rb9`. Read on 2026-09-29 via Figma Desktop Bridge.
Import a set with `await figma.importComponentSetByKeyAsync(key)` (from another file, once published)
or `await figma.getNodeByIdAsync(id)` inside this file, then `set.children.find(v => v.name === "Property 1=Default").createInstance()`.
Node ids can change if the file is restructured; keys are stable.

Token shorthand: `text/primary` = `color/text/primary` in the `Semantic` collection.
"(raw)" = hard-coded value, not bound to a variable. "(remote)" = bound to a variable from another library.

---

## 1. Input fields - text input / select trigger
- Set `72:21377` · key `4d6dee7b53498d95f173c855eb7a952c76d63fad` · page ➜ Input Fields and Dropdown
- Size 392 x 92 (field 392 x 40)
- **Variant** `Property 1`: `Default` | `hover` | `active` | `filled` | `Variant5` (error) | `dimmed` (disabled)
- **Properties**

| Property | Type | Default | Controls |
|---|---|---|---|
| Show optional | Boolean | true | "(Optional)" next to label |
| Show hint | Boolean | true | Hint line (between label and field) |
| Show error message | Boolean | true | Error line (only exists in `Variant5`) |
| Show icon | Boolean | **true** | Chevron-down at the right. On = Select trigger, off = text input |
| Show Payment method icon | Boolean | false | Not used in this set |
| Show link | Boolean | false | Not used in this set |

- **Anatomy**: Label row (Label `sm/Medium` text/primary · (Optional) `sm/Regular` text/muted · tooltip "i" 9px Medium, no text style) -> Hint `xs/Regular` text/muted -> Input frame (bg/primary, 1px border/default, radius/lg, padding space/2, gap space/2) containing Text `sm/Regular` + "Down Icon" (raw vector, fill `bg/inverse`, child vector bound to remote `Text/Body text color`) -> error row `xs/Regular` text/error.
- **States**: hover = bg/muted + border/strong + 2 raw drop shadows (shadow-sm). active = border/focus + raw 2px inner ring #3b82f6 + cursor "|" in text/secondary. filled = border/strong + value text/secondary. Variant5 = border/error, hint hidden, error row visible. dimmed = bg/muted + border/strong, and the whole component at **50% opacity** (label, hint, field, chevron all faded).
- **Visual** (screenshot): white 40px box, thin light-grey border, chevron at right, grey 12px hint above the box. Hover = grey box with slight shadow. Focus = strong blue border. Error = red border + red "Error message" under the box.
- **Use for**: names, emails, phone, any single-line text; with chevron, a Select/Dropdown trigger (the option menu itself does not exist in this group).
- **Don't**: use for long text (Textarea), search (Search), or numbers with +/- (numeric field).

## 2. Input fields - URL / link prefix
- Set `73:23456` · key `45a006e994ef4126f260d5b5f5d5cb76702d5aa2`
- Same variants as #1. Defaults differ: `Show icon=false`, `Show link=true`.
- **Anatomy difference**: inside the field, a prefix group "http://" (`sm/Regular` text/secondary) + 1px vertical divider (border/strong) before the value. Hint is placed **below** the field here (other sets put it above).
- Default variant carries the rest shadow (other sets only on hover).
- Visual check: the `hover` variant **drops the http:// prefix** (shows only "www.example.com"), unlike every other state. Treat it as a file bug; in code keep the prefix in all states.
- `dimmed` = whole component at 50% opacity.
- **Use for**: website, portfolio, social profile URLs. **Don't** use for emails or general text.

## 3. Input fields - payment card number
- Set `73:23641` · key `a82f90aa888a4869633b5bbf7b7c2eefc0b9d589`
- Variants: `Default` | `hover` | `active` | `folled` (= filled, typo) | `Variant5` (error) | `dimmed`
- Defaults: `Show Payment method icon=true`, `Show link=true` (no visible effect), `Show icon=false`.
- **Anatomy difference**: a card badge (white, 1px #f2f4f7 raw stroke, radius/base) with a Mastercard logo (raw brand hex, fine for a logo) before the value "0000 0000 0000 0000".
- Bug: in the `Default` variant the `Show Payment method icon` property is also bound to the whole Input frame, so turning it off hides the field.
- **Use for**: card number only. Expiry, CVV and name on card -> #1.

## 4. Search
- Set `80:30243` · key `3b7bf4aaba69fb475efe6388bee7e1d05d9fa931`
- Size 346 x 56 (outer wrapper padding space/2 x space/3, inner field 322 x 40)
- **Variant** `Property 1`: `default` | `hover` | `active` | `filled`
- **Properties** (all **unwired**, copied from Upload Field): Show Label, Label Text ("Upload File"), Hint Text, Show (Optional), Show Help Icon. They change nothing.
- **Anatomy**: wrapper (radius/lg) -> Text Input (bg/primary, 1px border/strong, radius 8 raw, padding space/2 x space/3, gap space/2) -> magnifier "Linear / Search / Magnifer" (raw vectors, 1.5 stroke border/inverse) + placeholder "Search by..." `sm/Regular` text/placeholder. `filled` adds a Close (x) icon (raw vectors, remote `Neutral/Grey 800`).
- **Visual**: 40px white pill-less box (8px corners), grey magnifier left, grey "Search by..." placeholder. Hover gets a **dark** border (much stronger than text-input hover). Filled shows a black x at the right to clear.
- **States**: hover = btn/secondary/bg-hover fill + border/inverse stroke. active = border/focus. filled = value text/secondary + clear icon.
- No error or disabled state (not needed for search).
- **Use for**: filtering tables/lists, global search in headers. **Don't** put inside a form as a data field; no label is rendered, so give it an accessible label in code.

## 5. Upload Field
- Set `80:28810` · key `cb92ecdd78d58f3dc49b4af14328fd058bb4dcca`
- Size 392 x 92 (error 392 x 116)
- **Variant**: `Default` | `hover` | `Uploaded` | `error` | `dimmed`
- **Properties** (all **unwired**): Show Label (true), Label Text ("Upload File"), Hint Text ("Accepted Formats: PDF, Word , Excel. Max File Size: 5MB"), Show (Optional), Show Help Icon. Edit the layers "Label" and "This is a hint text." directly.
- **Anatomy**: same label row + hint as #1 -> field (bg/primary, 1px border/strong, radius/lg, padding space/2) with Upload Icon (fill btn/Primary/bg 2) + "Click to upload" `sm/Regular` btn/Primary/bg 2.
- **Visual**: the box has a **dashed** light-grey border (dash 8/2) with a blue upload arrow and blue "Click to upload" link text, so it reads as a drop zone.
- **States**: hover = grey bg/muted box (still dashed), icon + text btn/Primary/bg-hover 2. Uploaded = **solid** border, document icon + file name in dark grey + red trash icon at the right. error = solid red border + red error line below. dimmed = bg/muted, whole component at 50% opacity.
- **Use for**: one attachment (CV, invoice, ID). Always state formats and size limit in the hint. **Don't** use for images that need a preview (Avatars & upload image lives in another grouping) or multi-file drops.

## 6. Verification code input field (OTP group)
- Set `69:20901` · key `1dd90b2e8a7cacaabafdbf9eb161962e69a0cfb1`
- Size 420 x ~108
- **Variant**: `empty` | `filled` | `dimmed` | `success` | `error`
- **Properties**: Show Label (true), Show hint (true), Show success message (true), Show error message (true)
- **Anatomy**: vertical gap 6 (raw) -> Label "Enter code" `sm/Medium` text/primary -> row of **6** `code field` instances, gap 12 (raw) -> hint `xs/Regular` text/muted, or error row (remote `alert-circle` icon 18px + `xs/Regular` text/error), or success message.
- In `empty`, the first cell is `focused` (blue), the rest `empty`. `filled` = 1-6 in grey-bordered cells. `dimmed` = all cells at 40% opacity (disabled). `success` = six green-bordered cells + green check "This is a success message." `error` = six red-bordered cells + red alert icon "Error message".
- **Use for**: SMS/email verification, 2FA, PIN. **Don't** use for arbitrary-length numbers.

## 7. code field (OTP cell)
- Set `68:20624` · key `986d26102a64898336455fb2c18bf74258dcf882`
- 60 x 60, radius 8 (raw), padding 8 (raw), effect style `Shadow/Elevation 1/E 1 Rest state` (remote)
- **Variant**: `empty` | `hover` | `focused` | `filled` | `error` | `success` | `dimmed`
- Fill btn/secondary/bg (hover: btn/secondary/bg-hover). Stroke border/strong 1px; hover border/strong 2px; focused border/focus 2px; error border/error 2px; success border/success 2px. Digit `2xl/Semi Bold` text/primary.
- Visual: `hover` = light grey fill with a thicker grey border; `focused` = blue 2px border; `dimmed` = the filled cell at 40% opacity (disabled).
- Internal building block for #6 and #8. Do not place alone.

## 8. numeric field (quantity stepper)
- Set `75:27016` · key `f5ccbf2a5bb65ba529d1845d66e95cc52f552beb`
- 110 x 38, 1px border/default, radius 8 (raw)
- **Variant**: `dimmed` = value at minimum (shows **0**, minus button at 40% opacity, cannot decrease) | `active` = value above minimum (shows **1**, both buttons active)
- **Anatomy**: [minus button 36x36 btn/secondary/bg-active, 1.5px line btn/Info/border] [code field `filled` instance resized to 36x36] [plus button 36x36, Add icon btn/Primary/bg 2]. Button padding bound to **remote** `Space 2/4` and gap to remote `(Space 3)`.
- **Use for**: small bounded integers (1-99): quantities, guests, seats. **Don't** use for prices, years, or unbounded numbers.

## 9. Catalyst / Textarea
- Set `209:206` · key `17db97dfeb9f75d97d4e44735c26e2f286dca5c8` · page ➜ Text Area
- Size 889 x 166 (field 889 x 114; Invalid 208 tall)
- **Variant** `State`: `Default` | `filled` | `Hover` | `Focus` | `Disabled` | `Invalid`
- **Properties**: Show Optional (true), Show Tooltip (true), Show Hint (true)
- **Anatomy**: Label Row (gap space/1): "Description" `sm/Medium` text/primary + "(Optional)" `sm/Regular` **text/placeholder** + tooltip (radius 8 raw) -> Hint `xs/Regular` text/muted -> field (bg/primary, 1px border/default, radius/lg, padding space/2) with placeholder "Enter description".
- **States**: Hover = bg/secondary + border/strong + shadow-sm. Focus = border/focus + 2px blue inner ring. Disabled = bg/muted + border/strong and the whole component at 50% opacity. Invalid = border/error, field grows to 128, error text "This field is required." in **`sm/Regular`** (14px, other fields use 12px).
- **Use for**: descriptions, notes, comments, messages (more than ~80 characters). **Don't** use for single-line values.

## 10. Checkbox
- Set `2003:636` (light master) · key `31a3641360215afb794dda9b754b6ec6c86718e5` · dark duplicate `2003:697` key `cdf1f9a56bd820775cb7b6dd91d277513ca9afcd`
- 98 x 20, horizontal gap 8 (raw)
- **Variant**: `Default` | `Checked` | `Indeterminate` | `Disabled` | `disabled (selected)`
- **Properties**: Text (text, "Checkbox"), Show text (true)
- **Anatomy**: box 20x20 radius 4 (raw), 2px stroke; label `sm/Regular` text/secondary.
  - Default: fill bg/primary, stroke border/strong. Checked/Indeterminate: fill + stroke btn/Primary/bg 2, check or dash vector 1.75px stroked with **border/default**.
  - Disabled: empty box at 40% opacity + label text/muted. disabled (selected): blue checked box at 50% opacity (reads light blue) + label text/muted.
  - Visual: Checked shows a white tick, Indeterminate a white dash, both on solid blue. In Dark mode the box is light blue (blue/300) with a dark tick.
- No hover, focus or error variants.
- **Use for**: multi-select lists, "remember me", accepting terms, bulk "select all" (Indeterminate).

## 11. Toggle
- Set `2003:826` (light master) · key `e3845c8ae8629b328e9e63bebc680a9c60f3b63a` · dark duplicate `2003:887` key `77dfc7db8b21108fe6652c337c64878bace382ef`
- 81 x 24, gap 8 (raw)
- **Variant**: `enabled` (On) | `disabled` (Off) | `enabled - dimmed` (On, disabled) | `disabled - dimmed` (Off, disabled)
- **Properties**: Show text (true). Label "Text" is **not** a text property; override the layer.
- **Anatomy**: track 44x24 radius full (raw 16777200), padding 4 with a 24px offset to place the 16px thumb (bg/primary). On track btn/Primary/bg 2 (thumb right); Off track btn/Neutral/bg-active (thumb left); On+disabled = blue track at 30% opacity (reads pale blue); Off+disabled = bg/subtle track at 50%. Disabled labels turn text/muted. Label `sm/Regular` text/secondary.
- **Use for**: instant settings. **Don't** use in forms that need Submit or for choices with more than two states.

## 12. RadioButton
- Set `80:28711` (light master) · key `d7a79c20e521eb4b81b6e9c45199f26f0ce7b8fe` · dark duplicate `80:28758` key `601c25b34c4633c1a00f50ab41d1849dcf942128`
- 125 x 20, gap 8 (raw)
- **Variant**: `Default` | `Checked` | `Disabled` | `Status4` (= checked + disabled)
- **Properties**: Text (text, "Radio Buttons"). No `Show text` toggle.
- **Anatomy**: ring 20x20 (radius 20 raw), 2px stroke border/strong; Checked = stroke btn/Primary/bg 2 + inner dot btn/Primary/bg 2. Disabled = empty ring at 40% opacity; Status4 = Checked ring+dot at 50% opacity (reads pale blue). Both disabled labels text/muted. Label `sm/Regular` text/secondary.
- No hover, focus or error variants.
- **Use for**: one choice among 2-5 visible options (plan, shipping method, gender). More than ~6 options -> Select (#1 with chevron).
