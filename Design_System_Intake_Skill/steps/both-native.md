# Mobile "Both": native or cross-platform

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load only when 1.2 = Both.

### Both: native or cross-platform (Abdul, 2026-09-30)

| | **Native** | **Cross-platform (Flutter / React Native custom UI)** |
|---|---|---|
| Figma DS files | `<Project> iOS Design System` (HIG names such as System Background and Label, Dynamic Type, SF Symbols, pt) **and** `<Project> Android Design System` (`md.sys.color`, M3 type scale, state layers, elevation levels, Material Symbols, dp) | One `<Project> Design System` |
| Brand Foundation | Optional `<Project> Brand Foundation` file: Primitives only (no Semantics, styles or components) | Not needed: the one DS holds the Primitives |
| Design files | `<Project> iOS` linked **only** to the iOS DS, `<Project> Android` linked **only** to the Android DS | One `<Project>` Design file |
| Local folders | `<Project>_iOS\` and `<Project>_Android\`, each with its own full skill set and `status.json` (plus `<Project>_Brand\` when the Brand Foundation exists) | One `<Project>_Mobile\` |
| Main Skills | Both, run one after the other; each checkpoint is shown per platform | The base chosen at 1.5 |

Native rules:
- The Brand Foundation is the only thing the two systems have in common, and only as a source of values. Each platform DS **copies** its Primitives into its own local collection (never consumes them as remote library variables, so the audit's 0 remote variables still holds) and builds its own platform Semantics on top. A brand color change goes into the Brand Foundation first, then `tools/recolor.py` runs on each platform folder.
- An iOS Design file never enables the Android library and vice versa. The file check (section 7c) rejects a cross-link.
- Record the choice in each folder's `status.json`: `mobile_setup` (`native` / `cross-platform`), `sibling_project` (the other platform folder) and `figma.brand_foundation` (name, url, file_key, or null).
