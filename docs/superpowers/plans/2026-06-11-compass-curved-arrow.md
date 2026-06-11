# Compass Curved Arrow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace rough character direction arrows with coordinate-derived curved SVG cues that use real compass heading when available and simulated heading otherwise.

**Architecture:** Add pure direction utilities for bearing, relative angle, and active target selection. Extend HUD payloads with target coordinates, read one shared compass heading in `App`, and pass the resulting relative angle into reusable curved arrow components used by Home, Map, and Goggle HUD.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, browser `DeviceOrientationEvent` with simulated fallback.

---

## File Structure

- Create: `src/lib/direction.ts` for pure coordinate math, active target selection, and direction labels.
- Create: `src/lib/direction.test.ts` for math and active target priority tests.
- Create: `src/hooks/useCompassHeading.ts` for browser heading acquisition and simulated fallback.
- Create: `src/components/CurvedDirectionArrow.tsx` for reusable SVG arrow rendering.
- Modify: `src/types.ts` to add target coordinates to `HudPayload` and a small reusable target coordinate type.
- Modify: `src/lib/hud.ts` to include target coordinates in every directional HUD payload.
- Modify: `src/components/HudDisplay.tsx` to render `CurvedDirectionArrow` instead of a character arrow.
- Modify: `src/components/GogglePreview.tsx` to render compact `CurvedDirectionArrow` instead of a character arrow.
- Modify: `src/components/DemoMap.tsx` to render a map-scale curved route cue from `You` to the active target.
- Modify: `src/pages/HomePage.tsx`, `src/pages/MapPage.tsx`, and `src/pages/GogglePage.tsx` to accept and pass compass metadata where needed.
- Modify: `src/App.tsx` to instantiate `useCompassHeading` once and pass the same heading to all pages.
- Modify: `src/styles.css` for arrow visuals and responsive sizing.
- Modify: `src/App.test.tsx` and `src/lib/hud.test.ts` for changed direction semantics.

---

### Task 1: Direction Math And Active Target Selection

**Files:**
- Create: `src/lib/direction.ts`
- Create: `src/lib/direction.test.ts`
- Modify: `src/types.ts`

- [ ] **Step 1: Add target coordinate types**

Modify `src/types.ts` so `HudPayload` can carry target map coordinates. Keep the existing `arrow` field during this task to minimize churn in existing tests and components.

```ts
export type HudArrow = "↑" | "↗" | "→" | "↘" | "↓" | "↙" | "←" | "↖";

export type MapTarget = {
  mapX: number;
  mapY: number;
};

export type HudPayload = {
  mode: "follow" | "meet" | "sos" | "voice";
  label: string;
  arrow: HudArrow;
  distanceMeters?: number;
  messageLabel?: string;
  target?: MapTarget;
};
```

- [ ] **Step 2: Write failing direction utility tests**

Create `src/lib/direction.test.ts` with these tests.

```ts
import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./demoData";
import {
  SELF_MAP_POSITION,
  describeRelativeAngle,
  getActiveDirectionTarget,
  getBearingDegrees,
  getRelativeAngle
} from "./direction";

describe("direction math", () => {
  it("uses 0 degrees for a target directly above self", () => {
    expect(getBearingDegrees(SELF_MAP_POSITION, { mapX: 48, mapY: 24 })).toBeCloseTo(0, 5);
  });

  it("uses 90 degrees for a target directly right of self", () => {
    expect(getBearingDegrees(SELF_MAP_POSITION, { mapX: 78, mapY: 54 })).toBeCloseTo(90, 5);
  });

  it("normalizes relative angles into -180 to 180", () => {
    expect(getRelativeAngle(10, 350)).toBe(20);
    expect(getRelativeAngle(350, 10)).toBe(-20);
    expect(getRelativeAngle(180, 0)).toBe(180);
  });

  it("describes relative angle accessibly", () => {
    expect(describeRelativeAngle(0)).toBe("straight ahead");
    expect(describeRelativeAngle(32)).toBe("32 degrees right");
    expect(describeRelativeAngle(-47)).toBe("47 degrees left");
  });
});

describe("active direction target", () => {
  it("defaults to the leader", () => {
    const state = createInitialDemoState("Alex");

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "Ava",
      mode: "follow",
      mapX: 62,
      mapY: 30
    });
  });

  it("uses selected online teammate before fallback leader", () => {
    const state = { ...createInitialDemoState("Alex"), selectedMemberId: "james" };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "James",
      mode: "follow",
      mapX: 28,
      mapY: 58
    });
  });

  it("uses meet over selected teammate when there is no SOS", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "james",
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 120,
        arrow: "→" as const,
        mapX: 55,
        mapY: 46,
        createdAt: 10
      }
    };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "Meet point",
      mode: "meet",
      mapX: 55,
      mapY: 46
    });
  });

  it("uses SOS over meet and selected teammate", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "hank",
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 120,
        arrow: "→" as const,
        mapX: 55,
        mapY: 46,
        createdAt: 10
      },
      activeSos: {
        id: "sos-1",
        senderName: "James",
        distanceMeters: 45,
        arrow: "←" as const,
        mapX: 28,
        mapY: 58,
        createdAt: 11
      }
    };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "SOS from James",
      mode: "sos",
      mapX: 28,
      mapY: 58
    });
  });
});
```

- [ ] **Step 3: Run the new tests to verify failure**

Run: `npm run test -- src/lib/direction.test.ts`

Expected: FAIL because `src/lib/direction.ts` does not exist.

- [ ] **Step 4: Implement direction utilities**

Create `src/lib/direction.ts`.

```ts
import type { AppState, MapTarget } from "../types";

export const SELF_MAP_POSITION: MapTarget = { mapX: 48, mapY: 54 };

export type DirectionTarget = MapTarget & {
  mode: "follow" | "meet" | "sos";
  label: string;
};

export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function normalizeRelativeAngle(degrees: number): number {
  const normalized = normalizeDegrees(degrees);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function getBearingDegrees(from: MapTarget, to: MapTarget): number {
  const radians = Math.atan2(to.mapX - from.mapX, from.mapY - to.mapY);
  return normalizeDegrees((radians * 180) / Math.PI);
}

export function getRelativeAngle(targetBearing: number, phoneHeading: number): number {
  return normalizeRelativeAngle(targetBearing - phoneHeading);
}

export function describeRelativeAngle(relativeAngle: number): string {
  const rounded = Math.round(relativeAngle);
  if (Math.abs(rounded) <= 3) return "straight ahead";
  return rounded > 0 ? `${rounded} degrees right` : `${Math.abs(rounded)} degrees left`;
}

export function getActiveDirectionTarget(state: AppState): DirectionTarget {
  if (state.activeSos) {
    return {
      mode: "sos",
      label: `SOS from ${state.activeSos.senderName}`,
      mapX: state.activeSos.mapX,
      mapY: state.activeSos.mapY
    };
  }

  if (state.activeMeet) {
    return {
      mode: "meet",
      label: "Meet point",
      mapX: state.activeMeet.mapX,
      mapY: state.activeMeet.mapY
    };
  }

  const selected = state.members.find((member) => member.id === state.selectedMemberId && member.status === "online");
  const leader = state.members.find((member) => member.role === "leader" && member.status === "online");
  const fallback = state.members.find((member) => member.status === "online");
  const target = selected ?? leader ?? fallback;

  if (!target) {
    throw new Error("Demo session requires at least one online member");
  }

  return {
    mode: "follow",
    label: target.name,
    mapX: target.mapX,
    mapY: target.mapY
  };
}
```

- [ ] **Step 5: Run direction tests to verify pass**

Run: `npm run test -- src/lib/direction.test.ts`
Expected: PASS for all tests in `direction.test.ts`.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/types.ts src/lib/direction.ts src/lib/direction.test.ts
git commit -m "feat: add direction cue math"
```

---

### Task 2: Add Target Coordinates To HUD Payloads

**Files:**
- Modify: `src/lib/hud.ts`
- Modify: `src/lib/hud.test.ts`

- [ ] **Step 1: Update HUD tests to expect targets**

Modify `src/lib/hud.test.ts` expectations so the existing tests verify `target` coordinates.

```ts
expect(getCurrentHudPayload(state)).toMatchObject({
  mode: "follow",
  label: "FOLLOW AVA",
  arrow: "↗",
  distanceMeters: 84,
  target: { mapX: 62, mapY: 30 }
});
```

For the SOS test, use:

```ts
expect(getCurrentHudPayload(state)).toMatchObject({
  mode: "sos",
  label: "SOS FROM JAMES",
  arrow: "←",
  distanceMeters: 45,
  target: { mapX: 27, mapY: 62 }
});
```

For the meet test, use:

```ts
expect(getCurrentHudPayload(state)).toMatchObject({
  mode: "meet",
  label: "MEET POINT",
  arrow: "→",
  distanceMeters: 128,
  target: { mapX: 58, mapY: 42 }
});
```

- [ ] **Step 2: Run HUD tests to verify failure**

Run: `npm run test -- src/lib/hud.test.ts`
Expected: FAIL because HUD payloads do not yet include `target`.

- [ ] **Step 3: Add targets to HUD payloads**

Modify `src/lib/hud.ts`.

```ts
export function memberToHud(member: DemoMember): HudPayload {
  return {
    mode: "follow",
    label: `FOLLOW ${member.name.toUpperCase()}`,
    arrow: member.arrow,
    distanceMeters: member.distanceMeters,
    target: { mapX: member.mapX, mapY: member.mapY }
  };
}

export function meetToHud(meet: DemoMeet): HudPayload {
  return {
    mode: "meet",
    label: meet.label,
    arrow: meet.arrow,
    distanceMeters: meet.distanceMeters,
    target: { mapX: meet.mapX, mapY: meet.mapY }
  };
}

export function sosToHud(sos: DemoSos): HudPayload {
  return {
    mode: "sos",
    label: `SOS FROM ${sos.senderName.toUpperCase()}`,
    arrow: sos.arrow,
    distanceMeters: sos.distanceMeters,
    target: { mapX: sos.mapX, mapY: sos.mapY }
  };
}
```

Keep `voiceToHud` without a target because voice is not a directional target in the current flow.

- [ ] **Step 4: Run HUD tests to verify pass**

Run: `npm run test -- src/lib/hud.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add src/lib/hud.ts src/lib/hud.test.ts
git commit -m "feat: include direction targets in hud payloads"
```

---

### Task 3: Shared Compass Heading Hook

**Files:**
- Create: `src/hooks/useCompassHeading.ts`
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/MapPage.tsx`
- Modify: `src/pages/GogglePage.tsx`

- [ ] **Step 1: Create compass hook**

Create `src/hooks/useCompassHeading.ts`.

```ts
import { useEffect, useState } from "react";
import { normalizeDegrees } from "../lib/direction";

type DeviceOrientationWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export type CompassHeading = {
  heading: number;
  source: "device" | "simulated";
  statusLabel: "Compass live" | "Simulated heading";
};

const SIMULATED_STEP_DEGREES = 4;

function getDeviceHeading(event: DeviceOrientationWithCompass): number | null {
  if (typeof event.webkitCompassHeading === "number") {
    return normalizeDegrees(event.webkitCompassHeading);
  }

  if (typeof event.alpha === "number") {
    return normalizeDegrees(360 - event.alpha);
  }

  return null;
}

export function useCompassHeading(): CompassHeading {
  const [heading, setHeading] = useState(0);
  const [source, setSource] = useState<"device" | "simulated">("simulated");

  useEffect(() => {
    let receivedDeviceHeading = false;
    let cancelled = false;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const nextHeading = getDeviceHeading(event as DeviceOrientationWithCompass);
      if (nextHeading === null) return;

      receivedDeviceHeading = true;
      setSource("device");
      setHeading((current) => current + (nextHeading - current) * 0.35);
    };

    const startListening = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    const eventConstructor = window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission | undefined;

    if (eventConstructor?.requestPermission) {
      const requestOnFirstTouch = () => {
        eventConstructor.requestPermission?.()
          .then((permission) => {
            if (cancelled || permission !== "granted") return;
            startListening();
          })
          .catch(() => {
            setSource("simulated");
          });
      };

      window.addEventListener("pointerdown", requestOnFirstTouch, { once: true });

      return () => {
        cancelled = true;
        window.removeEventListener("pointerdown", requestOnFirstTouch);
        window.removeEventListener("deviceorientation", handleOrientation, true);
      };
    }

    if (eventConstructor) {
      startListening();
    }

    const fallbackTimer = window.setInterval(() => {
      if (receivedDeviceHeading) return;
      setSource("simulated");
      setHeading((current) => normalizeDegrees(current + SIMULATED_STEP_DEGREES));
    }, 2200);

    return () => {
      cancelled = true;
      window.clearInterval(fallbackTimer);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  return {
    heading: normalizeDegrees(heading),
    source,
    statusLabel: source === "device" ? "Compass live" : "Simulated heading"
  };
}
```

- [ ] **Step 2: Wire compass metadata through pages without rendering changes**

Modify `src/App.tsx` to create one compass heading and pass it to all app pages.

```tsx
import { useCompassHeading } from "./hooks/useCompassHeading";

// inside App()
const compass = useCompassHeading();

// page rendering
{page === "home" && <HomePage session={session} navigate={navigate} compass={compass} />}
{page === "map" && <MapPage session={session} navigate={navigate} compass={compass} />}
{page === "goggle" && <GogglePage session={session} compass={compass} />}
```

Modify each page prop type.

```ts
import type { CompassHeading } from "../hooks/useCompassHeading";

type HomePageProps = {
  session: DemoSession;
  navigate: (page: AppPage) => void;
  compass: CompassHeading;
};
```

Use the same pattern in `src/pages/MapPage.tsx` and `src/pages/GogglePage.tsx`.

- [ ] **Step 3: Run typecheck/build**

Run: `npm run build`
Expected: PASS. There should be no unused-variable errors; if a page receives `compass` but does not use it yet, add `void compass;` inside that component as a temporary line and remove it in later tasks when the prop is used.

- [ ] **Step 4: Commit Task 3**

Run:

```bash
git add src/hooks/useCompassHeading.ts src/App.tsx src/pages/HomePage.tsx src/pages/MapPage.tsx src/pages/GogglePage.tsx
git commit -m "feat: add shared compass heading hook"
```

---

### Task 4: Reusable Curved Direction Arrow Component

**Files:**
- Create: `src/components/CurvedDirectionArrow.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create SVG curved arrow component**

Create `src/components/CurvedDirectionArrow.tsx`.

```tsx
import { describeRelativeAngle } from "../lib/direction";
import type { HudPayload } from "../types";

type CurvedDirectionArrowProps = {
  relativeAngle: number;
  variant: HudPayload["mode"];
  size?: "compact" | "standard" | "map";
  label?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getArrowPath(relativeAngle: number, size: "compact" | "standard" | "map" = "standard") {
  const bend = clamp(relativeAngle / 120, -1, 1);
  const strength = size === "map" ? 36 : size === "compact" ? 25 : 31;
  const start = { x: 50, y: 91 };
  const first = { x: 50, y: 70 };
  const control = { x: 50 + bend * strength * 0.55, y: 43 };
  const end = { x: 50 + bend * strength, y: 16 + Math.abs(bend) * 8 };
  const headRotation = clamp(relativeAngle * 0.62, -58, 58);

  return {
    d: `M ${start.x} ${start.y} C ${start.x} ${start.y - 12}, ${first.x} ${first.y + 8}, ${first.x} ${first.y} C ${control.x} ${control.y}, ${end.x} ${end.y + 18}, ${end.x} ${end.y}`,
    end,
    headRotation
  };
}

export function CurvedDirectionArrow({ relativeAngle, variant, size = "standard", label }: CurvedDirectionArrowProps) {
  const path = getArrowPath(relativeAngle, size);
  const accessibleLabel = label ?? `Direction cue, ${describeRelativeAngle(relativeAngle)}`;

  return (
    <svg
      className={`curved-arrow curved-arrow-${size} ${variant}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={accessibleLabel}
      focusable="false"
    >
      <path className="curved-arrow-glow" d={path.d} />
      <path className="curved-arrow-line" d={path.d} />
      <path
        className="curved-arrow-head"
        d="M 50 8 L 42 24 L 50 20 L 58 24 Z"
        transform={`translate(${path.end.x - 50} ${path.end.y - 14}) rotate(${path.headRotation} 50 22)`}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Add base arrow CSS**

Modify `src/styles.css` by adding these rules near existing `.hud-arrow` styles.

```css
.curved-arrow {
  display: block;
  overflow: visible;
  color: var(--primary);
}

.curved-arrow-standard {
  width: min(46vw, 190px);
  height: min(46vw, 190px);
}

.curved-arrow-compact {
  width: 112px;
  height: 112px;
}

.curved-arrow-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.curved-arrow-line,
.curved-arrow-glow {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.curved-arrow-line {
  stroke-width: 5.4;
}

.curved-arrow-glow {
  opacity: 0.22;
  stroke-width: 13;
}

.curved-arrow-head {
  fill: currentColor;
}

.curved-arrow.meet {
  color: var(--meet);
}

.curved-arrow.sos {
  color: oklch(0.82 0.14 25);
}

.curved-arrow.voice {
  color: var(--primary);
  opacity: 0.72;
}
```

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit Task 4**

Run:

```bash
git add src/components/CurvedDirectionArrow.tsx src/styles.css
git commit -m "feat: add curved direction arrow component"
```

---

### Task 5: Replace Home And Goggle HUD Character Arrows

**Files:**
- Modify: `src/components/HudDisplay.tsx`
- Modify: `src/components/GogglePreview.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/GogglePage.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add UI test expectations for curved arrows**

Modify `src/App.test.tsx` in the join test after `FOLLOW AVA`.

```ts
expect(screen.getByRole("img", { name: /direction cue/i })).toBeInTheDocument();
expect(screen.getByText(/simulated heading|compass live/i)).toBeInTheDocument();
```

Modify the goggle test after `simulated goggle output`.

```ts
expect(screen.getByRole("img", { name: /goggle direction cue/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run app tests to verify failure**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL because HUD components still render character arrows.

- [ ] **Step 3: Update `HudDisplay` props and rendering**

Modify `src/components/HudDisplay.tsx`.

```tsx
import { Radio } from "lucide-react";
import { getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import type { CompassHeading } from "../hooks/useCompassHeading";
import type { HudPayload } from "../types";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";
import { StatusPill } from "./StatusPill";

type HudDisplayProps = {
  hud: HudPayload;
  compass: CompassHeading;
  compact?: boolean;
};

export function HudDisplay({ hud, compass, compact = false }: HudDisplayProps) {
  const tone = hud.mode === "sos" ? "sos" : hud.mode === "meet" ? "meet" : hud.mode === "voice" ? "primary" : "default";
  const className = compact ? `hud-display compact ${hud.mode}` : `hud-display ${hud.mode}`;
  const targetBearing = hud.target ? getBearingDegrees(SELF_MAP_POSITION, hud.target) : 0;
  const relativeAngle = hud.target ? getRelativeAngle(targetBearing, compass.heading) : 0;

  return (
    <section className={className} aria-label="Current goggle cue">
      <div className="hud-topline">
        <StatusPill tone={tone}>{hud.mode.toUpperCase()}</StatusPill>
        <span className="signal"><Radio size={15} aria-hidden="true" /> {compass.statusLabel}</span>
      </div>
      <p className="hud-context">Current goggle cue</p>
      <div className="hud-label">{hud.label}</div>
      <CurvedDirectionArrow relativeAngle={relativeAngle} variant={hud.mode} size={compact ? "compact" : "standard"} />
      {hud.distanceMeters ? <div className="hud-distance">{hud.distanceMeters}m</div> : <div className="hud-message">{hud.messageLabel}</div>}
    </section>
  );
}
```

- [ ] **Step 4: Update `GogglePreview` props and rendering**

Modify `src/components/GogglePreview.tsx`.

```tsx
import type { CompassHeading } from "../hooks/useCompassHeading";
import { getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import type { HudPayload } from "../types";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";

type GogglePreviewProps = {
  hud: HudPayload;
  compass: CompassHeading;
};

export function GogglePreview({ hud, compass }: GogglePreviewProps) {
  const label = hud.label.replace(" FROM ", " ");
  const targetBearing = hud.target ? getBearingDegrees(SELF_MAP_POSITION, hud.target) : 0;
  const relativeAngle = hud.target ? getRelativeAngle(targetBearing, compass.heading) : 0;

  return (
    <section className={`goggle-device ${hud.mode}`} aria-label="Simulated goggle output">
      <p className="goggle-device-label">Simulated goggle output</p>
      <div className="goggle-frame">
        <div className="lens left-lens" />
        <div className="lens right-lens" />
        <div className="hud-window">
          <span className="hud-chip">{hud.mode.toUpperCase()}</span>
          <strong>{label}</strong>
          <CurvedDirectionArrow relativeAngle={relativeAngle} variant={hud.mode} size="compact" label="Goggle direction cue" />
          {hud.distanceMeters ? <span className="goggle-distance">{hud.distanceMeters}m</span> : <span className="goggle-copy">{hud.messageLabel}</span>}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Pass compass to Home and Goggle components**

Modify `src/pages/HomePage.tsx`.

```tsx
<HudDisplay hud={session.hud} compass={compass} />
```

Modify `src/pages/GogglePage.tsx` so it calls:

```tsx
<GogglePreview hud={session.hud} compass={compass} />
```

- [ ] **Step 6: Remove obsolete character arrow CSS sizing**

Modify `src/styles.css` to replace `.hud-arrow` and `.goggle-arrow` font-size-driven styling with layout rules for the new SVG. Remove these old selectors if no longer used: `.hud-arrow`, `.goggle-arrow`, `.hud-display.sos .hud-arrow`, `.hud-display.meet .hud-arrow`, `.hud-display.voice .hud-arrow`, `.goggle-device.meet .goggle-arrow`, `.goggle-device.sos .goggle-arrow`.

Add:

```css
.hud-display .curved-arrow {
  margin: 4px auto 0;
}

.hud-display.compact .curved-arrow {
  width: 106px;
  height: 106px;
}

.hud-window .curved-arrow {
  margin: -2px auto -4px;
}
```

- [ ] **Step 7: Run app tests**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS.

- [ ] **Step 8: Run build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 9: Commit Task 5**

Run:

```bash
git add src/components/HudDisplay.tsx src/components/GogglePreview.tsx src/pages/HomePage.tsx src/pages/GogglePage.tsx src/styles.css src/App.test.tsx
git commit -m "feat: render curved arrows in hud views"
```

---

### Task 6: Add Curved Route Cue To Map

**Files:**
- Modify: `src/components/DemoMap.tsx`
- Modify: `src/pages/MapPage.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add app test for map route cue**

Modify the map test in `src/App.test.tsx` after verifying `Track James in HUD`.

```ts
expect(screen.getByRole("img", { name: /map direction cue/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run app test to verify failure**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL because the map route cue is not rendered yet.

- [ ] **Step 3: Render map cue in `DemoMap`**

Modify `src/components/DemoMap.tsx`.

```tsx
import { LocateFixed } from "lucide-react";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";
import type { CompassHeading } from "../hooks/useCompassHeading";
import { getActiveDirectionTarget, getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import type { DemoSession } from "../hooks/useDemoSession";

type DemoMapProps = {
  session: DemoSession;
  compass: CompassHeading;
};

export function DemoMap({ session, compass }: DemoMapProps) {
  const { state } = session;
  const activeTarget = getActiveDirectionTarget(state);
  const targetBearing = getBearingDegrees(SELF_MAP_POSITION, activeTarget);
  const relativeAngle = getRelativeAngle(targetBearing, compass.heading);

  const getMarkerLabel = (member: DemoSession["state"]["members"][number]) => {
    if (member.status === "online") {
      return `Select ${member.name}, ${member.distanceMeters} meters away`;
    }

    return `${member.name} offline, Last seen 2 min ago`;
  };

  return (
    <section className="map-stage" aria-label="Simulated slope map">
      <svg className="slope-lines" viewBox="0 0 100 100" role="img" aria-label="Ski piste schematic">
        <path d="M8 16 C28 6, 44 20, 68 12 C82 8, 90 12, 96 20" />
        <path d="M5 38 C23 30, 38 46, 58 36 C76 27, 85 38, 96 34" />
        <path d="M3 65 C20 56, 40 68, 60 58 C78 48, 89 54, 97 62" />
        <path d="M12 88 C28 78, 48 89, 72 78 C84 72, 91 76, 98 82" />
      </svg>

      <CurvedDirectionArrow relativeAngle={relativeAngle} variant={activeTarget.mode} size="map" label="Map direction cue" />

      <div className="map-note">Abstract slope view · {compass.statusLabel}</div>

      <div className="self-marker" style={{ left: "48%", top: "54%" }}>
        <LocateFixed size={18} aria-hidden="true" />
        <span>You</span>
      </div>

      {state.members.map((member) => (
        <button
          type="button"
          key={member.id}
          className={`map-marker ${member.status} ${state.selectedMemberId === member.id ? "selected" : ""}`}
          aria-label={getMarkerLabel(member)}
          aria-pressed={state.selectedMemberId === member.id}
          style={{ left: `${member.mapX}%`, top: `${member.mapY}%`, "--member-color": member.color } as React.CSSProperties}
          onClick={() => member.status === "online" && session.selectMember(member.id)}
          disabled={member.status === "offline"}
        >
          <span>{member.name}</span>
        </button>
      ))}

      {state.activeMeet && (
        <div className="map-event meet" style={{ left: `${state.activeMeet.mapX}%`, top: `${state.activeMeet.mapY}%` }}>Meet</div>
      )}
      {state.activeSos && (
        <div className="map-event sos" style={{ left: `${state.activeSos.mapX}%`, top: `${state.activeSos.mapY}%` }}>SOS</div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Pass compass to map components**

Modify `src/pages/MapPage.tsx`.

```tsx
<DemoMap session={session} compass={compass} />
```

Modify the compact HUD call on the same page.

```tsx
<HudDisplay hud={session.hud} compact compass={compass} />
```

- [ ] **Step 5: Add map cue CSS refinement**

Modify `src/styles.css` to make the map cue sit under markers but above slope lines.

```css
.map-stage .curved-arrow-map {
  color: oklch(0.77 0.13 205 / 0.9);
  opacity: 0.82;
  filter: drop-shadow(0 0 16px oklch(0.77 0.13 205 / 0.18));
}

.map-stage .curved-arrow-map.meet {
  color: oklch(0.78 0.13 78 / 0.9);
}

.map-stage .curved-arrow-map.sos {
  color: oklch(0.82 0.14 25 / 0.94);
}
```

- [ ] **Step 6: Run app tests**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS.

- [ ] **Step 7: Run build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: Commit Task 6**

Run:

```bash
git add src/components/DemoMap.tsx src/pages/MapPage.tsx src/styles.css src/App.test.tsx
git commit -m "feat: show curved direction cue on map"
```

---

### Task 7: Final Cleanup And Verification

**Files:**
- Modify only files needed for cleanup discovered by tests or build.

- [ ] **Step 1: Search for obsolete visible character arrow usage**

Run: `rg "hud-arrow|goggle-arrow|Direction \\\${hud.arrow}|direction \\\${member.arrow}" src`
Expected: No matches in rendered HUD or map cue code. Matches in data/tests are acceptable only if still used for legacy metadata.

- [ ] **Step 2: Run full test suite**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Manual roadshow smoke test**

Run: `npm run dev`
Expected: Vite starts at `http://127.0.0.1:5173/`.

Open `/join/DEMO` and verify:

- Home shows a curved arrow and `Simulated heading` or `Compass live`.
- Tapping `Send Meet Point` changes the arrow tone to meet color and label to `MEET POINT`.
- Tapping `Simulate SOS` then `Activate SOS from James` changes the arrow tone to SOS color and label to `SOS FROM JAMES`.
- Map shows a route cue from the `You` area and keeps marker selection working.
- Goggle preview shows a compact curved arrow and remains sparse.

- [ ] **Step 5: Commit final cleanup**

If cleanup changed files, run:

```bash
git add src
git commit -m "chore: verify compass curved arrow flow"
```

If no cleanup changed files, do not create an empty commit.

---

## Self-Review Notes

- Spec coverage: Tasks cover coordinate-derived bearing, shared compass with simulated fallback, reusable curved SVG arrow, Home/Map/Goggle integration, accessibility labels, non-blocking fallback, and tests/build/manual verification.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: `MapTarget`, `CompassHeading`, `CurvedDirectionArrow`, `getBearingDegrees`, `getRelativeAngle`, and `getActiveDirectionTarget` are introduced before any task uses them.
