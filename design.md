# Design system

JSON Formatter uses **AsriUI only** for UI controls and layout (`Button`, `Card`, `Tabs`, `Dropdown`, `Switch`, `Callout`, etc.). Import via `@/shared/asriui` (subpath facade). Global styles: `asriui/style.css`. Theme: `AsriUIProvider` + `ThemeSwitch` in the header.

JSON editing uses `@monaco-editor/react` in `MonacoJsonEditor` because AsriUI’s bundled Monaco entry conflicts with Vite production builds.

## Visual language

| Token | Role |
|-------|------|
| `background` / `foreground` | Page canvas and primary text |
| `card` / `border` | Panels, sidebar cards, tab bar |
| `primary` | Brand indigo, primary actions, active accents |
| `muted-foreground` | Secondary labels, hints, tab inactive state |
| `success` / `destructive` / `warning` | Validation status, errors, repair hints |

Light and dark themes swap via `ThemeProvider` (`class="dark"` on `documentElement`). Editor chrome (Monaco) uses separate syntax themes selected in Settings.

## Typography

- **UI:** Inter (400–700)
- **Code:** JetBrains Mono in Monaco

## Core components

| Component | Usage |
|-----------|--------|
| `Button` | Sidebar actions (variants: primary, secondary, ghost, danger) |
| `Card` + `CardHeader` + `CardContent` | Settings, stats, help, actions |
| `Panel` | Input/output editor shells with toolbar chips |
| `Chip` | Open, clear, copy, download |
| `Select` / `Toggle` / `Label` | Settings card |
| `IconButton` | Header theme toggle |
| `StatRow` / `HelpItem` | Stats and help lists |

## Layout

- **Shell:** edge-to-edge column; header / toolbar / tabs / editors / footer share one surface with hairline dividers
- **Header:** `{}` logo, title, theme switch
- **Toolbar:** muted strip; icon actions (Format primary); settings grouped behind a vertical rule (language, indent, theme, toggles)
- **Tabs:** connected tabs flush to the editor; validity dot; inline “+” new tab
- **Main:** 50/50 input | output; compact pane headers with icon actions
- **Footer:** status, stats pills (JSON mode), cursor; invalid JSON also uses short toasts

## Interaction patterns

- Primary action: **Format JSON** (full-width primary button)
- Destructive or rare actions use secondary styling unless they remove data
- Loading states replace button icons with a spinner; buttons disable while any operation runs
- Auto-validate debounces 500ms on input change; Monaco markers show parse errors

## Accessibility

- Toggle switches expose `role="switch"` and `aria-checked`
- Icon buttons include `title` where meaning is icon-only
- Focus rings use `ring-ring` on form controls
