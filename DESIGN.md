---
version: beta
name: SnowBuddy-anthropic-alpine-design-system
register: product
description: A restrained light UI direction for a SnowBuddy roadshow demo. It adapts Claude's warm humanist canvas, editorial typography, soft hairlines, and coral action vocabulary into a precise alpine product interface. The app should feel calm, premium, field-ready, and easy to understand in a 30-second investor demo.

inspiration:
  claude: "Use a warm off-white canvas, warm black ink, humanist sans text, occasional literary serif headings, muted coral primary actions, low-chrome surfaces, and generous editorial breathing room. Do not copy Claude as a marketing page; SnowBuddy is a task product."
  anthropic: "Sound thoughtful and calm. Prefer specific, short interface copy over enthusiastic slogans. Use restraint as the sign of quality."
  snowbuddy: "Keep the ski context visible through semantic cues: slope, team, goggle, meet point, SOS, distance, direction. Avoid generic AI assistant language."

colors:
  canvas: "oklch(0.982 0.006 82)"
  canvas-cool: "oklch(0.965 0.010 235)"
  surface: "oklch(0.955 0.012 78)"
  surface-raised: "oklch(0.992 0.004 82)"
  surface-snow: "oklch(0.975 0.009 225)"
  surface-selected: "oklch(0.930 0.030 45)"
  ink: "oklch(0.205 0.010 80)"
  ink-soft: "oklch(0.345 0.012 80)"
  muted: "oklch(0.515 0.015 80)"
  muted-soft: "oklch(0.660 0.014 80)"
  hairline: "oklch(0.875 0.018 82)"
  hairline-soft: "oklch(0.920 0.014 82)"
  primary: "oklch(0.630 0.105 34)"
  primary-hover: "oklch(0.560 0.120 34)"
  primary-soft: "oklch(0.920 0.045 34)"
  primary-ink: "oklch(0.990 0.004 82)"
  alpine: "oklch(0.570 0.080 220)"
  alpine-soft: "oklch(0.925 0.030 220)"
  meet: "oklch(0.670 0.115 82)"
  meet-soft: "oklch(0.935 0.050 82)"
  sos: "oklch(0.570 0.175 28)"
  sos-soft: "oklch(0.925 0.050 28)"
  success: "oklch(0.560 0.095 150)"
  offline: "oklch(0.600 0.010 80)"
  hud-bg: "oklch(0.160 0.010 80)"
  hud-surface: "oklch(0.215 0.012 80)"
  hud-ink: "oklch(0.965 0.006 82)"
  hud-muted: "oklch(0.725 0.010 82)"

typography:
  display-family: "Copernicus, Tiempos Headline, Georgia, serif"
  ui-family: "StyreneB, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  mono-family: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  page-title:
    fontFamily: "{typography.display-family}"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: -0.018em
  section-title:
    fontFamily: "{typography.ui-family}"
    fontSize: 17px
    fontWeight: 560
    lineHeight: 1.28
    letterSpacing: 0
  body:
    fontFamily: "{typography.ui-family}"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: 0
  label:
    fontFamily: "{typography.ui-family}"
    fontSize: 12px
    fontWeight: 520
    lineHeight: 1.35
    letterSpacing: 0
  button:
    fontFamily: "{typography.ui-family}"
    fontSize: 14px
    fontWeight: 560
    lineHeight: 1
    letterSpacing: 0
  caption:
    fontFamily: "{typography.ui-family}"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  data:
    fontFamily: "{typography.mono-family}"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  hud-label:
    fontFamily: "{typography.ui-family}"
    fontSize: 13px
    fontWeight: 620
    lineHeight: 1.2
    letterSpacing: 0.04em
  hud-arrow:
    fontFamily: "{typography.ui-family}"
    fontSize: 96px
    fontWeight: 720
    lineHeight: 0.9
    letterSpacing: -0.025em
  hud-distance:
    fontFamily: "{typography.ui-family}"
    fontSize: 34px
    fontWeight: 680
    lineHeight: 1
    letterSpacing: -0.015em

radii:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  screen-x: 18px
  screen-y: 22px
  nav-height: 74px

motion:
  fast: 140ms
  standard: 190ms
  slow: 240ms
  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
---

# SnowBuddy Design System

## 1. Product Scene

A judge scans the demo QR code in a bright roadshow venue. The host explains that SnowBuddy turns a phone into a ski-team control hub and reduces the goggle display to one clear cue: direction, distance, meet point, voice check, or SOS priority.

This scene requires a light interface. The demo is shown on personal phones and sometimes projected on a screen; a dark, futuristic shell makes the product feel like an AI concept. A calm light canvas makes SnowBuddy feel closer to premium equipment, a ski pass, and a field control app.

## 2. Design Positioning

SnowBuddy should use a custom direction: **Anthropic alpine product UI**.

- From Claude: warm off-white canvas, warm black text, soft cream panels, coral primary actions, low visual noise, and thoughtful typography.
- From alpine equipment: cool snow tints, precise directional cues, compact status information, and emergency clarity.
- From product UI: standard controls, readable spacing, predictable navigation, and no decorative complexity.

The interface should feel less like "AI software" and more like a considered tool for outdoor safety. It is premium because it is quiet, specific, and legible.

## 3. Core Principles

1. **Light by default, dark only for the goggle.** App screens use warm snow surfaces. The simulated HUD may stay dark because it represents hardware.
2. **One useful sentence per region.** Remove explanatory paragraphs unless they prevent demo confusion. No stacked helper copy that competes with controls.
3. **Status through structure, not glow.** Use label, position, icon, and state color together. Avoid neon, glass, heavy shadows, or thin sci-fi borders.
4. **Phone controls, goggle distills.** Home and Map can explain. Goggle should be sparse and almost silent.
5. **Prototype honesty.** Keep `Prototype`, `Simulated`, and `No GPS required` where needed, but make them quiet annotations.

## 4. Visual Diagnosis Of Current UI

The current interface feels too "AI-generated" for three reasons:

- **Dark base plus cyan accents.** The near-black blue background, cyan action color, and glowing HUD vocabulary push the app toward sci-fi dashboard territory.
- **Thin borders everywhere.** Light one-pixel outlines on dark surfaces make the UI look like generated SaaS chrome instead of premium product hardware.
- **Too much explanatory text.** Several panels explain the same concept in different words. On mobile, the copy fights for space and can visually overlap with controls.

The redesign must reduce the number of visible panels, make controls more native, and let the ski scenario carry the product story.

## 5. Color System

Use OKLCH tokens in CSS. Hex values from the Claude reference may be used only as a source reference; production tokens should stay OKLCH.

### Surface Roles

- `canvas`: main app background. Warm white, close to Claude's `#faf9f5`, but slightly cleaner for a snow product.
- `canvas-cool`: optional full-screen wash for map and goggle-adjacent sections.
- `surface`: cream panel background for grouped content.
- `surface-raised`: buttons, inputs, bottom nav, and high-priority controls.
- `surface-snow`: cool-tinted map and slope schematic surfaces.
- `surface-selected`: selected teammate or active row background.
- `hairline`: normal separators. Use sparingly.
- `hairline-soft`: internal dividers and subtle panel separation.

### Text Roles

- `ink`: primary text, headings, active labels.
- `ink-soft`: secondary titles, row metadata, icon strokes.
- `muted`: support copy and prototype annotations.
- `muted-soft`: placeholders, disabled hints, quiet timestamps.

Muted text must still meet contrast. Do not use low-opacity gray for elegance.

### Semantic Roles

- `primary`: muted Anthropic coral. Use for the main action and selected bottom nav state.
- `alpine`: cool blue used only for navigation context, follow mode, and slope/map affordances.
- `meet`: muted alpine amber for regroup state.
- `sos`: grounded red for emergency state.
- `success`: restrained green for online/ready state.
- `offline`: neutral gray-brown for inactive teammates.

### Color Use Rules

- Body background must never be pure white or dark navy.
- Coral is the brand action color, not a decoration. Avoid coral gradients and coral floods.
- Blue is a ski-context color, not the primary brand.
- SOS must not rely on red alone. Pair red with `SOS`, icon, layout priority, and a stronger button treatment.
- Avoid purple, magenta, neon cyan, black-blue dashboards, and rainbow gradients.

## 6. Typography

Use two type voices:

- **Display serif** for page titles and the join-screen brand statement only: `Copernicus, Tiempos Headline, Georgia, serif`.
- **Humanist sans** for all UI controls, labels, data, and body copy: `StyreneB, Inter, system-ui, sans-serif`.

If Copernicus, Tiempos, or StyreneB are not available, the fallback stack must still look intentional. Do not block implementation on custom font licensing.

### Type Rules

- Page titles are serif, weight 400, 28-32px on mobile. They should feel editorial, not dramatic.
- Section titles are sans, 16-18px, medium weight. No display fonts inside dense panels.
- Body copy is 14-15px with comfortable line-height. It should rarely exceed two lines.
- Labels should use sentence case by default. Avoid tiny uppercase tracking except inside the dark HUD.
- Letter spacing should be 0 for most UI. Do not use negative tracking in buttons, labels, or body.
- Avoid font weights below 400. Thin text is one of the current "AI polish" tells.

## 7. Copy Reduction Rules

The app should explain itself through hierarchy and state. Keep only copy that changes a decision.

### Keep

- `Phone Control Hub`
- `Team Positions`
- `Goggle Preview`
- `Simulated`
- `Prototype`
- `No GPS required`
- Action labels: `Meet Point`, `SOS`, `Voice Check`, `Track in HUD`

### Rewrite

- `Send one team cue. The goggle keeps only what matters.` -> `Set the cue. The goggle stays simple.`
- `The map explains the cue; the goggle keeps only direction and distance.` -> `Map for context. HUD for motion.`
- `No map. No feed. Just the next cue.` -> `One cue at a time.`
- `Emergency overrides every cue` -> `Overrides HUD`
- `Short message, no live call` -> `Simulated audio`

### Remove Or Hide

- Repeated explanations of phone-versus-goggle on every page.
- Long helper text under each action when the icon and title are enough.
- Multiple status phrases that all mean "simulated".
- Any text that wraps inside a button on 360px mobile width.

## 8. Layout System

### App Shell

- Mobile width: `min(100%, 520px)`.
- Desktop projection width: up to 900px, with the phone UI centered or shown as a refined app panel.
- Screen padding: 18px horizontal, 22px vertical.
- Bottom nav height: 74px including safe-area allowance.
- Minimum touch target: 44px, preferred 48-52px.

The background is a continuous canvas, not a dark stage. Avoid full-screen radial glows.

### Spacing

- Use fewer, more deliberate groups.
- Prefer 12px internal gaps, 16px between related modules, 24px between major modules.
- Avoid nested cards. A panel may contain rows or controls, but not another floating card.
- Keep card radius between 8px and 16px. No 24px-plus rounded panels.

### Borders And Shadows

- Use either a hairline or a very small shadow, rarely both.
- Preferred panel treatment: `background: surface; border: 1px solid hairline-soft`.
- Preferred raised control: `background: surface-raised; box-shadow: 0 1px 2px oklch(0.2 0.01 80 / 0.08)`.
- Avoid ghost-card styling: 1px border plus large blurred shadow.

## 9. Page Direction

### Join

Goal: enter the demo instantly.

Structure:

1. Compact SnowBuddy wordmark.
2. Serif statement: `Smart cues for group skiing.`
3. One-line note: `Roadshow prototype. No GPS or account required.`
4. Name input.
5. Primary coral button: `Join Demo`.

Remove large framed hero cards. The join screen should feel like a tasteful check-in form on a warm snow canvas.

### Home

Goal: show the phone as the control hub.

Structure:

1. Header: `Phone Control Hub` plus a quiet `Prototype` pill.
2. Current cue summary as the primary module.
3. Three compact action buttons: `Meet Point`, `SOS`, `Voice Check`.
4. Feedback line.
5. Team list.

The HUD summary should be large enough to understand, but not a dark glowing centerpiece. Save the full dark hardware treatment for the Goggle page.

### Map

Goal: show relative team positions without becoming a map product.

Structure:

1. Header: `Team Positions`.
2. Slope schematic on `surface-snow`, using contour-like curves and soft blue/amber markers.
3. Selected teammate row with distance and `Track in HUD`.
4. Compact current cue strip.

Keep the map quiet and schematic. No satellite textures, game minimap styling, or excessive coordinate labels.

### Goggle

Goal: make the product value obvious.

Structure:

1. Header: `Goggle Preview` plus `Prototype`.
2. Full dark goggle preview, with one cue only.
3. Small display mode row: `Arrow + distance`.

This is the only page where dark UI is appropriate. It represents the goggle lens, not the app brand.

## 10. Component Rules

### Buttons

- Primary: coral fill, white text, 8px radius, 44-48px height.
- Secondary: warm raised surface, ink text, subtle hairline.
- Destructive: red fill only for confirmed SOS activation or active emergency state.
- Icon buttons: 36-40px, circular or 8px radius depending on context.
- Do not place long explanatory text inside buttons. Use icon + short label.

### Bottom Navigation

- Use a warm raised nav bar with 8-12px radius on desktop and edge-to-edge mobile if needed.
- Active item uses coral text and a very soft coral background.
- Inactive icons use `muted`, not low-opacity black.
- Labels remain visible: `Home`, `Map`, `Goggle`.

### Panels

- Panels are for major functional groups only: current cue, actions, team, map.
- Panel headers should be one short line. Do not use uppercase eyebrow labels by default.
- Use rows and separators inside panels instead of nested cards.

### Status Pills

- Pills should be small, quiet, and sentence case.
- `Prototype`, `Simulated`, `Online`, `Offline`, `SOS`.
- Radius can be pill, but avoid high-saturation fills for inactive states.

### Action Panel

Current buttons contain a title and helper sentence. Reduce them to:

- `Meet Point`
- `SOS`
- `Voice Check`

The selected or active state can show a short caption below the grid, not inside every button.

### Team List

- Use a single list panel with row dividers.
- Each row: name, role/status, distance, small state dot.
- Selected row uses `surface-selected`.
- Offline row uses muted text and no saturated accent.

### HUD Display

The phone-side current cue should be light:

- warm panel background
- large direction/distance in ink
- small mode pill
- optional blue/amber/red left icon or marker

The goggle preview should be dark:

- `hud-bg` lens background
- `hud-ink` text
- large arrow
- distance below
- mode label above
- no extra paragraphs inside the lens

## 11. Motion And Interaction

- Use 140-190ms transitions for hover, press, selected, and sheet reveal.
- Button hover on desktop may shift by 1px; mobile should rely on active state color.
- No page-load choreography.
- No decorative particles, aurora gradients, glass blur, or looping animations.
- Respect `prefers-reduced-motion: reduce` by removing transforms and keeping color changes.

## 12. Accessibility

- Body text must meet 4.5:1 contrast.
- Large text and primary controls must meet 3:1 minimum, preferably higher.
- Focus rings should be visible and use coral or alpine blue with enough contrast.
- Touch targets are at least 44px.
- SOS is communicated by text, icon, position, and color.
- Inputs need visible labels; placeholders are not labels.
- Ensure all button text fits at 360px width without overlap.

## 13. Implementation Checklist

1. Replace dark root tokens with the light OKLCH palette above.
2. Set `color-scheme: light`.
3. Introduce display serif only for page titles and join hero statement.
4. Remove radial dark body background.
5. Convert panels from dark cards to warm cream surfaces.
6. Simplify action buttons to short labels and icons.
7. Reduce repeated explanatory copy according to the copy rules.
8. Keep the Goggle preview dark using `hud-*` tokens.
9. Audit every screen at 360px, 390px, 520px, and desktop projection width.
10. Verify no text overlaps, no button label wraps awkwardly, and no panel uses decorative glass or glow.

## 14. Success Criteria

The redesigned app succeeds when a judge can say, within 30 seconds:

- This is a ski-team control hub.
- The phone sets the cue.
- The goggle shows only what the skier needs.
- SOS is clearly highest priority.
- The prototype feels stable and premium, not like a generic AI demo.

The visual test is simple: if the UI could be mistaken for a dark AI dashboard, it fails. If it feels like a calm Anthropic-inspired alpine product surface, it is on direction.
