# <Project> - Project Brief

Intake answers (Design_System_Intake_Skill). Paths are relative to the Root, never absolute. Fill as the intake runs; never re-ask what is recorded here.
Order asked: 0.0-0.2, then Platform 1.1-1.4, then 0.3-0.8, then Path.

## Basics
| # | Question | Answer |
|---|---|---|
| 0.1 | Project name | |
| 0.2 | Figma links (DS file, Design files with names; connected file confirmed?) | |
| 0.3 | Local folder (relative, with platform suffix) | `My Projects/<Project>/` |
| 0.4 | Color modes (Light only / Light and Dark / Dark only) | |
| 0.5 | Arabic / RTL | |
| 0.6 | Fonts (Latin / Arabic) | |
| 0.7 | Storybook (Yes / Later, ask at: ... / No) | |
| 0.8 | Example screens (Yes after components / No) | |

## Platform
| # | Question | Answer |
|---|---|---|
| 1.1 | Web / Mobile | |
| 1.2 | iOS / Android / Both | |
| 1.3 | Both: Native / Cross-platform (one shared design) | |
| 1.4 | Native: shared Brand Foundation file (Yes / No) | |
| 1.5 | Cross-platform: framework (Flutter / React Native) and base (Material 3 / Apple HIG / Custom) | |
| - | Sibling platform folder (Both + Native) | |
| - | Main Skill(s) loaded | |

## Path
| # | Question | Answer |
|---|---|---|
| 2.1 | Greenfield / Brownfield | |
| 2.2 | Brownfield type (1 screens, 2 live code, 3 DS + unlinked screens) | |
| 3.1 | Existing AI-ready DS / Reference template (entry id from references.json) / No | |
| 3.3 | Brand color(s) and contrast pre-check | |
| 3.4 | Industry | |

## Inputs
- Brand: `Inputs/Brand/`
- Inspiration: `Inputs/Inspiration/`
- Screens: `Inputs/Screens/`
- Research: `Inputs/Research/`

## Design direction
- Style:
- Corners / density / elevation:
- Type personality / icon weight:
- Brand contrast result and fix:

## Intake Summary (approved: <date>)
```
Project: <name>            Local folder: <path>
Figma: <links and roles>
Platform: <Web / iOS / Android / Both native (+ Brand Foundation yes/no) / Both cross-platform (Flutter / RN, base) / Both Mobile Adaptive (EN or EN+AR)> -> Main Skill(s): <names>
Modes: <Light / Dark>      RTL: <Yes/No>      Fonts: <Latin / Arabic>
Path: <Greenfield 3a/3b-3d | Brownfield type 1/2/3>
Inputs found: Brand <n files / empty>, Inspiration <n / empty>, Screens <n / link>, Research <n / empty>
Direction: <style, corner/density/elevation, brand contrast result and fix>
Screens: <Yes after components / No>
Storybook: <Yes after components / Later (ask at: ...) / No>
Next step: <first action>
```

## Figma
Registry: `status.json > figma` (register Design files with `python tools/project_status.py "<folder>" --add-design-file <url> --name "<name>"`).
- Design System file:
- Design files:
- Last library publish:

## Checkpoints
Status is `Ready for review` until the user replies; only the user's approval sets `Approved` (agents never write Approved, Passed or Completed).

| Checkpoint | Status | Date |
|---|---|---|
| Foundation | | |
| Components | | |
| Screens | | |

## User to-do
- 

## Status
- Phase: Intake
- Next step (the next session starts here, Intake section 0c): 
