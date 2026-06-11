# Compass Curved Arrow Design

## Context

SnowBuddy is a deterministic roadshow mock app. It must remain stable without GPS, accounts, backend sync, microphone access, Bluetooth, or real goggle hardware. The current direction cue uses hand-authored arrow characters such as `↗`, `←`, and `→`, which makes the demo feel rough and disconnected from the product story.

For the roadshow, the app should tell a clearer story: each teammate or event has a fixed position on the simulated slope map, the phone heading comes from the device compass when available, and the HUD shows the relative direction to the target as a smooth curved arrow.

## Goals

- Replace the rough straight character arrows in Home, Map, and Goggle HUD with a polished curved direction arrow.
- Compute target direction from fixed mock map coordinates instead of random or hand-authored arrow symbols.
- Prefer real phone compass heading when supported and permitted.
- Fall back automatically to a smooth simulated heading when compass data is unavailable, denied, or unreliable.
- Keep the roadshow demo deterministic and understandable under venue pressure.

## Non-Goals

- Do not add GPS, live location, backend sync, accounts, Bluetooth, microphone access, or real goggle integration.
- Do not make the map a real navigation product.
- Do not block the demo behind a device permission prompt.
- Do not expand the feature beyond direction cue presentation.

## Direction Model

The app treats the simulated map as a fixed coordinate plane.

- `You` uses the current map position: `x = 48`, `y = 54`.
- Teammates, Meet, and SOS targets already carry `mapX` and `mapY`.
- Absolute target bearing is derived from the fixed coordinates with `atan2(targetX - selfX, selfY - targetY)` so `0deg` means visually ahead/up the map.
- Phone heading is `0deg` when the phone faces north/forward in the demo model.
- Relative cue angle is normalized from `targetBearing - phoneHeading` into `[-180, 180]`.

This lets the roadshow explanation stay simple: the target position is fixed, and the displayed arrow changes as the phone orientation changes.

## Compass Behavior

The app should use a single compass-heading hook shared by Home, Map, and Goggle.

The hook exposes:

- `heading`: current heading in degrees.
- `source`: `device` or `simulated`.
- `statusLabel`: short UI-safe label such as `Compass live` or `Simulated heading`.

Behavior:

- On supported mobile browsers, request or listen for device orientation data.
- On iOS, use `DeviceOrientationEvent.requestPermission` only behind a user gesture if implementation requires one.
- If permission is denied, unsupported, desktop-only, or no usable heading arrives, use a smooth simulated heading.
- The fallback is not an error state. It is the roadshow-safe default.
- Heading changes should be smoothed enough to avoid jitter but not so slow that the cue feels fake.

## Curved Arrow Visual

Home, Map, and Goggle HUD use one reusable SVG-based `CurvedDirectionArrow` component.

Component inputs:

- `relativeAngle`: normalized target angle.
- `variant`: follow, meet, sos, or voice.
- `size`: compact, standard, or map.
- Optional accessible label.

Visual rules:

- The arrow starts at the bottom center.
- The first segment is always vertical, reinforcing that the cue starts from the user.
- The path then bends left or right according to `relativeAngle`.
- `0deg` renders nearly straight upward.
- Left targets bend left; right targets bend right.
- Targets behind the user create a stronger bend without becoming a cluttered loop.
- The arrowhead follows the path endpoint direction.
- Colors follow existing priority styling: follow blue, meet amber, SOS red, voice subdued/blue.

## Screen Behavior

### Home

The main HUD cue replaces the large character arrow with the curved arrow. Distance, label, priority state, and action flow remain unchanged.

### Map

The map keeps fixed teammate and event markers. It additionally renders a longer curved route cue from `You` to the active target.

Target selection priority matches HUD priority:

1. Active SOS
2. Active Meet
3. Selected online teammate
4. Leader or first online teammate fallback

The map should still communicate that it is an abstract slope schematic, not live GPS.

### Goggle HUD

The simulated goggle preview replaces the character arrow with the compact curved arrow. The view remains sparse: direction, distance, and priority label only.

## Error Handling And Fallbacks

- Missing target coordinates fall back to the current selected/leader target rather than breaking rendering.
- Offline teammates cannot become active map targets through the existing disabled marker behavior.
- If compass data disappears after initially working, the app transitions to simulated heading.
- The UI should never show a blocking error for compass failure during the roadshow.

## Accessibility

- The SVG arrow must have an accessible label describing direction, e.g. `Direction cue, 32 degrees right`.
- Existing text label and distance remain visible for users who cannot interpret the arrow.
- SOS cannot rely on color alone; the existing `SOS FROM ...` label remains the primary priority indicator.
- Motion should be CSS/React-light and avoid excessive animation.

## Testing And Verification

Tests should cover the pure direction math separately from browser sensor APIs:

- Bearing from self to target coordinates.
- Relative angle normalization.
- HUD target priority for SOS, Meet, selected teammate, and fallback teammate.
- Compass fallback behavior can be tested through controllable hook helpers or by isolating non-browser math.

Manual roadshow checks:

- Home shows a curved arrow instead of a character arrow.
- Map shows a curved route cue from `You` to the active target.
- Goggle HUD shows a compact curved arrow.
- On desktop Chrome, the app works with simulated heading.
- On mobile Safari/Chrome, compass support does not block the demo if denied or unavailable.
- Meet and SOS still override ordinary tracking.

## Acceptance Criteria

- Home, Map, and Goggle HUD no longer depend on visible straight character arrows for the primary direction cue.
- The visual arrow direction is derived from target coordinates and current heading.
- Real compass heading is used when available, with automatic simulated fallback.
- The app does not introduce GPS, account, backend, microphone, Bluetooth, or hardware requirements.
- Existing tests pass, and new direction math tests pass.
