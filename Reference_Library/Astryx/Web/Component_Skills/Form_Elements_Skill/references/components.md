# Form Elements - components (Astryx Library DS)

> **Node IDs:** none are stored here. In a duplicate every id changes, so find components, styles and variables by **name**.

> **Generated** from `data/component-registry.json` (read-only FigCli scan, 2026-10-06). When this file and the JSON differ, the JSON wins.

33 components, 679 variants. Light screenshots of every set were checked; Dark was checked by computed contrast (see `contrast` column), not by screenshots.


## Atoms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Calendar / .CalendarDay (internal) | Data Input | 8 | State: Default, Today, Selected, In Range, Range Start, Range End, Outside, Disabled | - | - | **no** | 0/0 |
| Chat / ChatComposerTokenElement | Chat | 4 | Type: Mention, Command, Attachment, Text | - | - | yes | 0/0 |
| Checkbox / CheckboxInput | Data Input | 24 | Value: Unchecked, Checked, Indeterminate; Size: sm, md; State: Default, Hover, Focused, Disabled | hasDescription (boolean), Label (boolean) | - | **no** | 0/0 |
| Field / .FieldLabel (internal) | Data Input | 3 | Indicator: Default, Optional, Required | hasIcon (boolean), hasTooltip (boolean) | - | **no** | 0/0 |
| InputGroupText | Data Input | 1 | - | text (text) | - | **no** | 1/0 |
| SegmentedControl / SegmentedControlItem | Action | 45 | Size: SM, MD, LG; State: Default, Hover, Selected, Disabled, Focus; Content: Text, Icon + Text, Icon Only | Label (text) | - | yes | 0/0 |
| Switch | Data Input | 16 | State: off, on, disabled-off, disabled-on, focused-off, focused-on, hover-off, hover-on; Label Position: end, start | Label (text), Has Description (boolean), Description (text) | - | **no** | 0/0 |

## Molecules

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Chat / ChatComposerDrawer | Chat | 2 | State: Expanded, Collapsed | Label (text), Collapsible (boolean) | Content | yes | 1/0 |
| Chat / ChatComposerInput | Chat | 4 | state: empty, filled, focused, disabled | Placeholder (text) | Content | yes | 0/0 |
| Checkbox / CheckboxList | Data Input | 4 | Orientation: Vertical, Horizontal; Size: sm, md | label (text), description (text) | - | **no** | 0/0 |
| Checkbox / CheckboxListItem | Data Input | 24 | State: Default, Hovered, Disabled; Selected: true, false; Size: sm, md; Description: true, false | label (text), description (text), Start Content (boolean), End Content (boolean) | [Slot: startContent], [Slot: endContent] | **no** | 0/0 |
| DateInput | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | **no** | 0/0 |
| Field | Data Input | 4 | status: none, error, warning, success | - | - | **no** | 0/0 |
| FileInput | Data Input | 16 | mode: input, dropzone; state: rest, hover, focused, error, warning, success, loading, disabled | - | - | **no** | 0/0 |
| InputGroup | Data Input | 15 | state: rest, focused, error, disabled, hover; size: md, sm, lg | descriptionText (text), placeholder (text), statusText (text), description (boolean), startIcon (boolean), startIconType (instance_swap), showLabel (boolean), hasPrefix (boolean), hasSuffix (boolean) | Prefix, Suffix | yes | 24/0 |
| NumberInput | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | Show Labels (boolean) | - | **no** | 0/0 |
| PowerSearch / Trigger | Data Input | 6 | State: Rest, Focused, Disabled; Content: Placeholder, With Filters | Placeholder (text), Query (text), Has Clear (boolean), Has Result Count (boolean) | Filters | **no** | 0/0 |
| Radio / RadioList | Data Input | 4 | Orientation: Vertical, Horizontal; Size: sm, md | label (text), description (text) | - | **no** | 0/0 |
| Radio / RadioListItem | Data Input | 24 | State: Default, Hovered, Disabled; Selected: true, false; Size: sm, md; Description: true, false | label (text), description (text) | - | **no** | 0/0 |
| SegmentedControl | Action | 18 | Size: SM, LG, MD; State: Default, Disabled; Content: Text, Icon + Text, Icon Only | Segment 1 (text), Segment 2 (text), Segment 3 (text) | - | yes | 12/0 |
| Selector | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | hasSearch (boolean), searchPlaceholder (text) | - | **no** | 0/0 |
| Slider | Data Input | 14 | state: rest, hover, focus, disabled, error, warning, success; type: single, range | Show Description (boolean), Show Marks (boolean), Show Value (boolean), Description (text), Value (text), Status Message (text) | - | yes | 0/6 |
| TextArea | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | **no** | 0/0 |
| TextInput | Data Input | 24 | state: rest, focused, error, disabled, warning, success, loading, hover; size: md, sm, lg | descriptionText (text), placeholder (text), statusText (text), description (boolean), startIcon (boolean), startIconType (instance_swap), statusMessage (boolean), showLabel (boolean) | - | **no** | 0/0 |
| TimeInput | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | **no** | 0/0 |
| Tokenizer | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | **no** | 0/0 |
| Typeahead | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | **no** | 0/0 |

## Organisms

| Component | Astryx page | Variants | Variant properties | Other properties | Slots | Description | Contrast fails (L/D) |
|---|---|---|---|---|---|---|---|
| Calendar | Data Input | 4 | Mode: Single, Range; Number Of Months: 1, 2 | - | - | **no** | 0/0 |
| Chat / ChatComposer | Chat | 3 | state: empty, typing, streaming | - | Footer, Header | **no** | 1/1 |
| DateRangeInput | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | yes | 0/0 |
| DateTimeInput | Data Input | 24 | state: rest, focused, hover, error, warning, success, loading, disabled; size: sm, md, lg | - | - | yes | 0/0 |
| PowerSearch / Popover | Data Input | 4 | Mode: Fields, Value Editor, Results, Empty | - | Content | **no** | 0/0 |
| Selector / MultiSelector | Data Input | 192 | Size: Small, Medium, Large; State: Rest, Hovered, Focused, Disabled; Display: Placeholder, Count, Labels, Badges; Status: None, Error, Warning, Success | - | - | **no** | 0/0 |

## Figma descriptions (as written in the file)

- **Chat / ChatComposerDrawer**: Collapsible drawer panel above the chat input inside ChatComposer. Pass to the composer drawer slot for attachments, context chips, or previews. Expanded shows a drag handle + content; Collapsed shows a count badge + label. Content is a freeform slot.
- **Chat / ChatComposerInput**: Rich text input for the chat composer. The editable content area is a native slot supporting placeholder text, typed text, and inline tokens rendered as badges (@ mentions, / commands). States: empty (placeholder), filled (typed value + token), focused (active caret), disabled. Source: packages/core/src/Chat/ChatComposerInput.tsx
- **Chat / ChatComposerTokenElement**: Renders a single token chip (a Badge) for the chat composer input â€” e.g. an @mention, / command, attachment, or pasted-text token. Wraps a badge config or custom render so the token serializes and stays visually consistent with tokens inside the composer. Type variants illustrate common composer tokens; underlying visual is the Badge component.
- **DateRangeInput**: DateRangeInput â€” a startâ€“end date range field. Trigger shows the formatted range (e.g. "Jul 1 â€“ Jul 15") or the placeholder "Select date range", with a trailing calendar icon that opens a dual-month calendar popover. Variants: state (rest/focused/hover/error/warning/success/loading/disabled) أ— size (sm/md/lg). Built on Field + FieldLabel, mirroring DateInput.
- **DateTimeInput**: DateTimeInput â€” combined date + time field under one label. Date field (calendar icon) + time field (clock icon) side by side. Mirrors DateInput/TimeInput anatomy. Variants: state (rest, focused, hover, error, warning, success, loading, disabled) x size (sm, md, lg).
- **InputGroup**: Groups an input with prefix/suffix addons in a visually connected container with shared border. Prefix and Suffix are slots â€” drop an InputGroupText or a Button; toggle with hasPrefix/hasSuffix. Mirrors TextInput field anatomy (label, description, states, sizes, status).
- **SegmentedControl**: Segmented button group for single selection with radio group semantics. Visually resembles a tab bar but controls a value, not a view. Supports text, icon + text, and icon-only content modes.
- **SegmentedControl / SegmentedControlItem**: Individual segment item within a segmented control. Supports text, icon + text, and icon-only content modes with default, hover, selected, disabled, and focus states.
- **Slider**: Slider â€” a draggable control for selecting a numeric value or range. Track rail (Effects/Track) + filled portion (Core/Accent) + thumb. Wrapped in the Field pattern (label, description, status). Variants: state (rest/hover/focus/disabled/error/warning/success) x type (single/range). Toggles: Show Marks (ticks), Show Value (tooltip bubble), Show Description. Maps to packages/core/src/Slider.
