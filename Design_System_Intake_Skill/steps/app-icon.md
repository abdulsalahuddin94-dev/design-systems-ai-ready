# App Icon page

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load when the ⭐Setup pages are built, when ➜ App Icon is missing from a DS file (Fix on create, Scenario C), or when the user says they dropped an app icon (also in quick mode).

## 7h. ➜ App Icon (every DS file, every platform)

Every design system gets a standard **➜ App Icon** page in ⭐Setup, right after ➜ Icons. It is always created, even before the product has an icon. When the user drops an icon into it, Claude presents the icon the platform's standard way, with documentation and export-ready frames.
Exact sizes, masks, drop zones and file names: `tools/app_icon_specs.json` (one block per platform). Platform rules in words: the platform Main Skill section 5b. Each platform reads only its own block; nothing is shared between platform files.

**Tool:** FigCli Yolo by default for the whole flow (reads, builds, export settings, `verify --save` screenshots), with `FIGMA_FILE` set and `figma.root.name` checked before the first write. A user who has only the Desktop Bridge does the whole flow with it. Nothing here needs a slot, so never ask a Yolo user to open the Desktop Bridge for this page.

### 7h-1. Create the page (always, with the ⭐Setup pages)
1. Add the page `➜ App Icon` in ⭐Setup after ➜ Icons (iOS: before ➜ App Store Screenshots). Web replaces the old `➜ Favicon` page some references keep in ⭐Data Display: favicons are part of the app icon, and the app icon is a foundation.
2. On it, one documentation frame `App Icon` (same Header + Content layout as the other docs frames) holding:
   - `App Icon Drop Zones`: one frame per drop zone in the platform block (`drop_zones`), each at its listed size, with a dashed border bound to a Semantic border token and a label in a text style: what to drop there ("Drop the default icon here: 1024 x 1024, square, opaque"). Required zones first.
   - `App Icon Guidelines`: the platform rules from the Main Skill section 5b (sizes, mask, appearances, safe zone), written in text styles, so the page is useful before any icon exists.
   - `App Icon Status`: "Waiting for the app icon".
3. Every fill, stroke and text is bound to Semantic variables and text styles (docs are linked, never static); Light and Dark frames set their Semantic mode explicitly. Auto Layout on every frame, meaningful layer names.
   - Cross-platform mobile (`<Project>_Mobile/`, one shared design): the page holds both the iOS and the Android blocks, because the same icon ships to both stores.
4. Save `status.json > app_icon` = `{"status": "waiting", "appearances": [], "last_update": "<date>"}` and log the page in `CHANGELOG.md`.
5. At the Foundation checkpoint, add to the user's to-do list: "Drop your app icon into ➜ App Icon (drop zones listed there) and tell me." It is not a blocker: the build goes on without it.

### 7h-2. Notice a drop
- When the user says the icon is in, or at the start of a session on a project whose `app_icon.status` is `waiting`, run one short read-only check of the drop zones (children other than the label, image fills). If they are still empty, say nothing; the to-do line stays.
- Accepted: a pasted or dragged image (PNG, JPG), an SVG, a vector, group, frame or component. If the art sits on the page but outside a zone, Ask (choice): "Use '<layer name>' as the <zone> icon?" "Yes, use it (Recommended)" / "No, I will move it into the drop zone".
- Never edit, flatten or recolor the user's artwork in place. It stays on the page as `App Icon Source / <zone>`.

### 7h-3. Check the source
Read-only checks, reported as numbers, per the platform block and Main Skill section 5b:
- Square (1:1); raster at least the zone size; any vector size is fine.
- iOS: Default fully opaque, no baked rounded corners or shadow, key shapes clear of the corners the mask cuts.
- Android: Foreground transparent with key shapes inside the 66 dp safe circle (bounding box of the visible layers); Background opaque; Monochrome one flat color.
- Web: still readable at 16 px; apple-touch and maskable versions opaque; maskable shapes inside the central 80% circle.
- Visual check in ds-auditor (image-heavy, returns text): the smallest sizes (iOS 40 px, Android 48 px, Web 16 px) on Light and Dark backgrounds.
Report "The icon passed" or "The icon has N issues" with one line each, then Ask (choice): "Use it as it is" (Recommended when there are 0 issues) / "I will drop a fixed version" / "Fix it for me" (description: safe fixes only, in a copy: add an opaque background from a Semantic or brand color, center and scale into the safe zone; the original is kept).

Missing optional appearances (iOS Dark and Tinted, Android Background, Monochrome and Play Store, Web Dark and Maskable): Ask (multi): "Some versions are missing. Which should I make from your icon?" one option per missing version, each described by how it is derived (Tinted and Monochrome: the shape in one gray; Dark: the shape on the dark Semantic background; Maskable and Play Store: the icon on the Background color, scaled into the safe zone). Unpicked versions fall back to the platform default, which the docs frame states.

### 7h-4. Present it
1. Turn each source into the main component set `App Icon` (variant property per the platform Main Skill section 5b: iOS `Appearance`, Android `Layer`, Web `Appearance` plus `Type`). Content constraints are Scale, so every preview is an **instance** rescaled to its size (`instance.rescale(size / master)`): a new source later updates every preview. Write Purpose, Usage Rules and Accessibility in the component description.
2. Build the previews listed in the platform block (`previews`): masks and contexts, the full size ladder, each appearance in Light and Dark frames whose Semantic mode is set (Dark only or Light only projects show their one mode plus the platform's own dark context where the platform has one, e.g. the iOS Dark Home Screen). Masks are preview frames clipping the instance; they are never part of the exported art.
3. Every size frame gets an **export setting** (PNG at exact px, SVG for `icon.svg` and Android vector layers) and is named after its file (`AppIcon-60@3x.png`, `ic_launcher_foreground`, `apple-touch-icon.png`), so developers export from the page directly.
4. Under the previews, an `App Icon Specs` table (text styles): file, size, appearance, where it goes in code (`code_target`, `files` or `html` + `manifest_icons` from the platform block).
5. Update `App Icon Status` to "Presented, <date>", set `status.json > app_icon` (`status: "presented"`, the `appearances` made, `last_update`), and add a `CHANGELOG.md` entry (`Storybook synced: no` when the project has a Storybook or plans one).
6. Screenshot the page in each mode (ds-auditor) and show it with the summary; docs-writer adds an "App Icon" section to `Foundation_Skill` (sizes, files, appearances, where the source lives).
7. A new icon later: the user drops it into the same zone, Claude repeats 7h-3, swaps the component's source, and every preview follows.

### 7h-5. Storybook (only when the user chose it)
- Only when `status.json > storybook_plan` is `yes` (or `has_storybook` is true): the Storybook gets a `Foundations/App Icon` page (`Storybook_Design_System_Skill` section 4, step 4).
- `later` or `no`: nothing is added and no Storybook question is asked here; Storybook questions stay at intake 0.7 and its triggers. When a `later` Storybook is built, the App Icon page is included then.
