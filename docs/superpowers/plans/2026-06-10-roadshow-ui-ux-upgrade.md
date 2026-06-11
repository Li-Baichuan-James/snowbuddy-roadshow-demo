# SnowBuddy Roadshow UI/UX Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the SnowBuddy roadshow app so investors and judges understand the product story within 30 seconds: the phone is the control hub, the goggle receives one low-distraction cue, and SOS/Meet/Voice priorities are obvious.

**Architecture:** Keep the existing Vite React TypeScript app and local-only demo state. Make the smallest correct changes to page/component structure, copy, CSS, and tests. Avoid introducing new routing, new state libraries, animation libraries, map SDKs, real permissions, backend calls, or hardware connection concepts.

**Tech Stack:** Vite, React 19, TypeScript, lucide-react, CSS with OKLCH tokens, Vitest, Testing Library.

---

## Source Of Truth

Use these files as the decision source before touching UI code:

- `DESIGN.md`: active SnowBuddy UI design system.
- `docs/product/PRODUCT.md`: product context and roadshow constraints.
- `docs/design/snowbuddy-roadshow-app-demo-build-doc.md`: original product and demo build brief.

The generated reference `tesla/DESIGN.md` is inspiration only. Root `DESIGN.md` overrides it.

## Non-Negotiable Product Constraints

- Do not request GPS, microphone, Bluetooth, account login, backend sync, or hardware connection.
- Do not imply real-time multi-device sync.
- Do not make Map the product center. Map explains relative positions; Goggle is the value point.
- SOS has highest visual and logical priority.
- Meet overrides normal tracking.
- Voice is short and simulated, not a call and not recording.
- Every primary interaction must be explainable in five seconds.

## Target Demo Story

The final UI should support this presenter flow without extra explanation:

1. Join: `No app download. No account. No GPS. No mic. No hardware required.`
2. Home: `Phone Control Hub` shows the current goggle cue and three understandable actions.
3. Team: tapping a teammate clearly means `Tracking in HUD`.
4. Meet: action changes the cue to `MEET POINT` and shows amber state.
5. SOS: action changes the cue to `SOS FROM JAMES`, visually overrides everything, and shows red state plus `Resolve SOS`.
6. Map: relative position view supports the cue but does not look like a full mapping app.
7. Goggle: sparse hardware preview shows only one cue: mode, label, arrow, distance/message.

## File Structure And Responsibilities

Modify existing files only unless a task explicitly creates a file.

- `src/App.test.tsx`: app-flow tests for roadshow copy, state priority, navigation, and simulation boundaries.
- `src/pages/JoinPage.tsx`: first impression, prototype boundary, join flow.
- `src/pages/HomePage.tsx`: main control hub, current cue, primary actions, team.
- `src/pages/MapPage.tsx`: relative team positions and track-in-HUD explanation.
- `src/pages/GogglePage.tsx`: value landing screen for sparse HUD preview.
- `src/components/HudDisplay.tsx`: shared cue display for Home/Map compact contexts.
- `src/components/ActionPanel.tsx`: Meet/SOS/Voice action tiles and active-state commands.
- `src/components/TeamList.tsx`: teammate selection and explicit tracking state.
- `src/components/DemoMap.tsx`: schematic map markers, selected/SOS/Meet emphasis.
- `src/components/GogglePreview.tsx`: physical-ish goggle HUD output.
- `src/components/BottomNav.tsx`: roadshow-safe navigation labels and active states.
- `src/components/StatusPill.tsx`: keep API, ensure tones support follow/meet/sos/voice/default/success.
- `src/styles.css`: all visual system, layout, responsive, interaction, and animation work.
- `README.md`: optional final note if UI copy changes affect demo explanation.

Do not split CSS into modules during this upgrade. One stylesheet is acceptable for the prototype and avoids unnecessary churn.

## Implementation Sequence

Implement tasks in order. Each task should leave the app runnable. Because commits are not explicitly requested, do not commit during execution unless the user asks for commits.

---

### Task 1: Lock Roadshow Copy With Failing Tests

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace the current app-flow tests with roadshow comprehension tests**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("SnowBuddy roadshow flow", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/join/DEMO");
  });

  it("joins the demo and explains the prototype boundaries", async () => {
    render(<App />);

    expect(screen.getByText(/simulated roadshow prototype/i)).toBeInTheDocument();
    expect(screen.getByText(/no app download/i)).toBeInTheDocument();
    expect(screen.getByText(/no gps/i)).toBeInTheDocument();
    expect(screen.getByText(/no mic/i)).toBeInTheDocument();
    expect(screen.getByText(/no hardware/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));

    expect(screen.getByRole("heading", { name: /phone control hub/i })).toBeInTheDocument();
    expect(screen.getByText(/current goggle cue/i)).toBeInTheDocument();
    expect(screen.getByText("FOLLOW AVA")).toBeInTheDocument();
  });

  it("shows clear action labels and SOS priority", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));

    expect(screen.getByRole("button", { name: /send meet point/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /simulate sos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send voice check/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /send meet point/i }));
    expect(screen.getByText("MEET POINT")).toBeInTheDocument();
    expect(screen.getByText(/meet point sent to team/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /simulate sos/i }));
    await userEvent.click(screen.getByRole("button", { name: /activate sos from james/i }));

    expect(screen.getByText("SOS FROM JAMES")).toBeInTheDocument();
    expect(screen.queryByText("MEET POINT")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resolve sos/i })).toBeInTheDocument();
  });

  it("makes team selection and map-to-HUD relationship explicit", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));
    await userEvent.click(screen.getByRole("button", { name: /james/i }));

    expect(screen.getByText(/tracking in hud/i)).toBeInTheDocument();
    expect(screen.getByText("FOLLOW JAMES")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /map/i }));

    expect(screen.getByRole("heading", { name: /team positions/i })).toBeInTheDocument();
    expect(screen.getByText(/the map explains the cue/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /track james in hud/i })).toBeInTheDocument();
  });

  it("shows the goggle as sparse simulated output", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));

    const nav = screen.getByRole("navigation", { name: /primary/i });
    await userEvent.click(within(nav).getByRole("button", { name: /^goggle$/i }));

    expect(screen.getByRole("heading", { name: /goggle preview/i })).toBeInTheDocument();
    expect(screen.getByText(/what the skier sees/i)).toBeInTheDocument();
    expect(screen.getByText(/no map/i)).toBeInTheDocument();
    expect(screen.getByText(/just the next cue/i)).toBeInTheDocument();
    expect(screen.getByText(/simulated goggle output/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails for expected copy gaps**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL. Missing labels should include `Phone Control Hub`, `Current goggle cue`, `Send Meet Point`, `Activate SOS from James`, or equivalent roadshow copy.

---

### Task 2: Upgrade Join Page First Impression

**Files:**
- Modify: `src/pages/JoinPage.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace `JoinPage.tsx` content with stronger prototype boundary copy**

Replace `src/pages/JoinPage.tsx` with:

```tsx
import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

type JoinPageProps = {
  onJoin: (displayName: string) => void;
};

export function JoinPage({ onJoin }: JoinPageProps) {
  const [name, setName] = useState("Alex");
  const [error, setError] = useState("");
  const teamCode = useMemo(() => window.location.pathname.split("/").pop() || "DEMO", []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = name.trim();
    if (!normalized) {
      setError("Enter a display name.");
      return;
    }
    onJoin(normalized);
  }

  return (
    <main className="join-screen">
      <section className="join-panel" aria-labelledby="join-title">
        <div className="brand-mark">
          <ShieldCheck size={24} aria-hidden="true" />
          <span>SnowBuddy</span>
        </div>

        <div className="join-hero-copy">
          <p className="demo-kicker">Simulated roadshow prototype</p>
          <h1 id="join-title">Smart goggle control for group skiing</h1>
          <p className="prototype-note">
            Join a local demo team and see how one phone cue becomes a low-distraction goggle HUD.
          </p>
        </div>

        <form className="join-form" onSubmit={submit}>
          <label>
            <span>Team Code</span>
            <input value={teamCode.toUpperCase()} readOnly aria-label="Team Code" />
          </label>
          <label>
            <span>Your Name</span>
            <input
              value={name}
              maxLength={20}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "join-error" : undefined}
            />
          </label>
          {error && <p id="join-error" className="form-error">{error}</p>}
          <button type="submit" className="primary-button join-button">
            Join Demo Team
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>

        <p className="join-footnote">No app download. No account. No GPS. No mic. No hardware required.</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Add Join-specific CSS refinements**

In `src/styles.css`, add these rules near the existing Join styles:

```css
.join-hero-copy {
  display: grid;
  gap: 8px;
}

.join-button {
  min-height: 56px;
}
```

- [ ] **Step 3: Run Join-focused tests**

Run: `npm run test -- src/App.test.tsx`

Expected: Still FAIL because later Home/Action/Map/Goggle copy has not been upgraded yet. Join boundary assertions should now pass.

---

### Task 3: Upgrade Home Information Architecture

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/HudDisplay.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace Home header and layout copy**

Replace `src/pages/HomePage.tsx` with:

```tsx
import { ActionPanel } from "../components/ActionPanel";
import { HudDisplay } from "../components/HudDisplay";
import { TeamList } from "../components/TeamList";
import type { DemoSession } from "../hooks/useDemoSession";
import type { AppPage } from "../types";

type HomePageProps = {
  session: DemoSession;
  navigate: (page: AppPage) => void;
};

export function HomePage({ session, navigate }: HomePageProps) {
  return (
    <div className="page-stack home-page">
      <header className="page-header">
        <div>
          <p className="demo-kicker">SnowBuddy DEMO</p>
          <h1>Phone Control Hub</h1>
          <p className="page-subtitle">Send one team cue. The goggle keeps only what matters.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate("goggle")}>Preview HUD</button>
      </header>

      <HudDisplay hud={session.hud} />
      <ActionPanel session={session} />

      {session.state.activeVoice && (
        <section className="voice-panel" aria-label="Simulated voice message">
          <div>
            <strong>Voice from {session.state.activeVoice.senderName}</strong>
            <p>{session.state.activeVoice.messageLabel}</p>
          </div>
          <button type="button" className="secondary-button" onClick={session.playVoice}>
            {session.voicePlayed ? "Played" : "Play simulated message"}
          </button>
        </section>
      )}

      <TeamList members={session.state.members} selectedMemberId={session.state.selectedMemberId} onSelect={session.selectMember} />
    </div>
  );
}
```

- [ ] **Step 2: Update `HudDisplay.tsx` to label the cue explicitly**

Replace `src/components/HudDisplay.tsx` with:

```tsx
import { Radio } from "lucide-react";
import type { HudPayload } from "../types";
import { StatusPill } from "./StatusPill";

type HudDisplayProps = {
  hud: HudPayload;
  compact?: boolean;
};

export function HudDisplay({ hud, compact = false }: HudDisplayProps) {
  const tone = hud.mode === "sos" ? "sos" : hud.mode === "meet" ? "meet" : hud.mode === "voice" ? "primary" : "default";
  const className = compact ? `hud-display compact ${hud.mode}` : `hud-display ${hud.mode}`;

  return (
    <section className={className} aria-label="Current goggle cue">
      <div className="hud-topline">
        <StatusPill tone={tone}>{hud.mode.toUpperCase()}</StatusPill>
        <span className="signal"><Radio size={15} aria-hidden="true" /> Signal simulated</span>
      </div>
      <p className="hud-context">Current goggle cue</p>
      <div className="hud-label">{hud.label}</div>
      <div className="hud-arrow" aria-label={`Direction ${hud.arrow}`}>{hud.arrow}</div>
      {hud.distanceMeters ? <div className="hud-distance">{hud.distanceMeters}m</div> : <div className="hud-message">{hud.messageLabel}</div>}
    </section>
  );
}
```

- [ ] **Step 3: Add Home/HUD hierarchy CSS**

In `src/styles.css`, add or update these selectors:

```css
.page-subtitle {
  max-width: 28rem;
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.hud-context {
  margin: 0;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hud-display {
  transition: background-color 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms cubic-bezier(0.22, 1, 0.36, 1), color 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hud-display.meet .hud-arrow {
  color: var(--meet);
}

.hud-display.voice .hud-arrow {
  color: var(--primary);
}

.hud-display.compact .hud-context {
  margin-top: 18px;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/App.test.tsx`

Expected: Still FAIL until action/team/map/goggle tasks are complete. Home heading and current cue assertions should pass.

---

### Task 4: Redesign Action Panel For Five-Second Comprehension

**Files:**
- Modify: `src/components/ActionPanel.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace `ActionPanel.tsx` with action tiles and clearer SOS flow**

Replace `src/components/ActionPanel.tsx` with:

```tsx
import { useState } from "react";
import { Mic2, OctagonAlert, UsersRound, X } from "lucide-react";
import type { DemoMember } from "../types";
import type { DemoSession } from "../hooks/useDemoSession";

type ActionPanelProps = {
  session: DemoSession;
};

export function ActionPanel({ session }: ActionPanelProps) {
  const [sosOpen, setSosOpen] = useState(false);
  const [selectedSosMemberId, setSelectedSosMemberId] = useState("james");
  const onlineMembers = session.state.members.filter((member) => member.status === "online");
  const selectedMember = onlineMembers.find((member) => member.id === selectedSosMemberId) ?? null;
  const selectedName = selectedMember?.name ?? "James";

  function simulateSos(member: DemoMember | null) {
    session.triggerSos(member);
    setSosOpen(false);
  }

  return (
    <section className="panel actions-panel" aria-labelledby="actions-title">
      <div className="section-heading stacked-heading">
        <div>
          <p className="muted-label">Primary actions</p>
          <h2 id="actions-title">Control the team cue</h2>
        </div>
      </div>

      <div className="action-grid">
        <button type="button" className="action-button meet" onClick={session.triggerMeet}>
          <UsersRound size={20} aria-hidden="true" />
          <span>
            <strong>Send Meet Point</strong>
            <small>Guide everyone to one regroup cue</small>
          </span>
        </button>
        <button type="button" className="action-button sos" onClick={() => setSosOpen(true)}>
          <OctagonAlert size={20} aria-hidden="true" />
          <span>
            <strong>Simulate SOS</strong>
            <small>Emergency overrides every cue</small>
          </span>
        </button>
        <button type="button" className="action-button voice" onClick={session.triggerVoice}>
          <Mic2 size={20} aria-hidden="true" />
          <span>
            <strong>Send Voice Check</strong>
            <small>Short message, no live call</small>
          </span>
        </button>
      </div>

      <p className="feedback-line" role="status">{session.feedback}</p>

      {session.state.activeMeet && !session.state.activeSos && (
        <button type="button" className="inline-command" onClick={session.clearMeet}>Clear Meet</button>
      )}
      {session.state.activeSos && (
        <button type="button" className="inline-command sos-clear" onClick={session.resolveSos}>Resolve SOS</button>
      )}

      {sosOpen && (
        <div className="sos-confirm" role="dialog" aria-modal="true" aria-labelledby="sos-title" aria-describedby="sos-description">
          <div className="sos-confirm-header">
            <h3 id="sos-title">Simulate SOS alert?</h3>
            <button type="button" className="icon-button" onClick={() => setSosOpen(false)} aria-label="Close SOS dialog">
              <X size={19} aria-hidden="true" />
            </button>
          </div>
          <p id="sos-description">The goggle HUD will switch to the selected teammate as the emergency target.</p>
          <div className="segmented-list" aria-label="Choose SOS teammate">
            {onlineMembers.map((member) => (
              <button
                type="button"
                key={member.id}
                className={selectedSosMemberId === member.id ? "segment selected" : "segment"}
                onClick={() => setSelectedSosMemberId(member.id)}
                aria-pressed={selectedSosMemberId === member.id}
              >
                {member.name}
              </button>
            ))}
          </div>
          <button type="button" className="primary-danger" onClick={() => simulateSos(selectedMember)}>
            Activate SOS from {selectedName}
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Replace action button CSS with tile layout**

In `src/styles.css`, replace the `.action-button` block and related child styling with:

```css
.stacked-heading {
  align-items: flex-start;
  margin-bottom: 12px;
}

.action-button {
  min-height: 76px;
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  justify-content: initial;
  gap: 11px;
  background: var(--surface-strong);
  border: 1px solid var(--line);
  padding: 12px;
  font-weight: 850;
  text-align: left;
}

.action-button span {
  display: grid;
  gap: 4px;
}

.action-button strong {
  font-size: 0.95rem;
}

.action-button small {
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 650;
  line-height: 1.25;
}

.action-button.meet {
  color: var(--meet);
  border-color: oklch(0.78 0.13 78 / 0.38);
}

.action-button.sos {
  color: oklch(0.84 0.14 25);
  border-color: oklch(0.62 0.21 25 / 0.55);
}

.action-button.voice {
  grid-column: 1 / -1;
  color: var(--primary);
}
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- src/App.test.tsx`

Expected: Action label and SOS activation assertions should pass. Team, Map, and Goggle assertions may still fail.

---

### Task 5: Make Team Selection Explicit

**Files:**
- Modify: `src/components/TeamList.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace `TeamList.tsx` with tracking copy and arrow/distance readout**

Replace `src/components/TeamList.tsx` with:

```tsx
import { UserRoundCheck } from "lucide-react";
import type { DemoMember } from "../types";
import { StatusPill } from "./StatusPill";

type TeamListProps = {
  members: DemoMember[];
  selectedMemberId: string | null;
  onSelect: (memberId: string) => void;
};

export function TeamList({ members, selectedMemberId, onSelect }: TeamListProps) {
  return (
    <section className="panel team-panel" aria-labelledby="team-title">
      <div className="section-heading stacked-heading">
        <div>
          <p className="muted-label">Team</p>
          <h2 id="team-title">Tap a teammate to track in HUD</h2>
        </div>
        <StatusPill tone="success">4 members</StatusPill>
      </div>
      <div className="team-list">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id;
          const meta = member.role === "leader" ? "Leader" : member.status === "offline" ? member.lastSeenLabel : "Teammate";
          return (
            <button
              type="button"
              className={isSelected ? "team-row selected" : "team-row"}
              key={member.id}
              onClick={() => member.status === "online" && onSelect(member.id)}
              disabled={member.status === "offline"}
              aria-pressed={isSelected}
            >
              <span className={member.status === "online" ? "member-dot online" : "member-dot"} style={{ "--member-color": member.color } as React.CSSProperties} />
              <span className="member-main">
                <span className="member-name">{member.name}</span>
                <span className="member-meta">{isSelected ? `${meta} · Tracking in HUD` : meta}</span>
              </span>
              <span className="member-distance">
                {member.status === "online" ? `${member.distanceMeters}m ${member.arrow}` : <UserRoundCheck size={17} aria-label="offline" />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update Team CSS for selected copy and scanability**

In `src/styles.css`, update these selectors:

```css
.team-row {
  min-height: 68px;
  grid-template-columns: 18px 1fr auto;
  padding: 10px 12px;
}

.team-row.selected {
  border-color: var(--primary);
  background: oklch(0.77 0.13 205 / 0.14);
}

.team-row:disabled {
  opacity: 0.62;
}

.member-distance {
  color: var(--ink);
  white-space: nowrap;
}

.team-row.selected .member-meta {
  color: var(--primary);
  font-weight: 800;
}
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- src/App.test.tsx`

Expected: Team tracking assertions should pass. Map and Goggle assertions may still fail.

---

### Task 6: Reframe Map As Cue Explanation, Not Mapping Product

**Files:**
- Modify: `src/pages/MapPage.tsx`
- Modify: `src/components/DemoMap.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace `MapPage.tsx` with cue explanation copy**

Replace `src/pages/MapPage.tsx` with:

```tsx
import { DemoMap } from "../components/DemoMap";
import { HudDisplay } from "../components/HudDisplay";
import type { DemoSession } from "../hooks/useDemoSession";
import type { AppPage } from "../types";

type MapPageProps = {
  session: DemoSession;
  navigate: (page: AppPage) => void;
};

export function MapPage({ session, navigate }: MapPageProps) {
  const selected = session.state.members.find((member) => member.id === session.state.selectedMemberId)
    ?? session.state.members.find((member) => member.role === "leader");
  const selectedName = selected?.name ?? "Ava";

  return (
    <div className="page-stack map-page">
      <header className="page-header">
        <div>
          <p className="demo-kicker">Simulated slope schematic</p>
          <h1>Team Positions</h1>
          <p className="page-subtitle">The map explains the cue; the goggle keeps only direction and distance.</p>
        </div>
      </header>

      <DemoMap session={session} />

      <section className="panel selected-panel">
        <div>
          <span className="muted-label">Selected teammate</span>
          <h2>{selectedName}</h2>
          <p>{selected?.status === "online" ? `${selected.distanceMeters}m away · ${selected.arrow}` : "Last seen 2 min ago"}</p>
        </div>
        <button type="button" className="primary-button small" onClick={() => navigate("goggle")}>Track {selectedName} in HUD</button>
      </section>

      <HudDisplay hud={session.hud} compact />
    </div>
  );
}
```

- [ ] **Step 2: Add current target emphasis in `DemoMap.tsx`**

Replace `src/components/DemoMap.tsx` with:

```tsx
import { LocateFixed } from "lucide-react";
import type { DemoSession } from "../hooks/useDemoSession";

type DemoMapProps = {
  session: DemoSession;
};

export function DemoMap({ session }: DemoMapProps) {
  const { state } = session;

  return (
    <section className="map-stage" aria-label="Simulated slope map">
      <svg className="slope-lines" viewBox="0 0 100 100" role="img" aria-label="Ski piste schematic">
        <path d="M8 16 C28 6, 44 20, 68 12 C82 8, 90 12, 96 20" />
        <path d="M5 38 C23 30, 38 46, 58 36 C76 27, 85 38, 96 34" />
        <path d="M3 65 C20 56, 40 68, 60 58 C78 48, 89 54, 97 62" />
        <path d="M12 88 C28 78, 48 89, 72 78 C84 72, 91 76, 98 82" />
      </svg>

      <div className="map-note">Abstract slope view, not live GPS</div>

      <div className="self-marker" style={{ left: "48%", top: "54%" }}>
        <LocateFixed size={18} aria-hidden="true" />
        <span>You</span>
      </div>

      {state.members.map((member) => (
        <button
          type="button"
          key={member.id}
          className={`map-marker ${member.status} ${state.selectedMemberId === member.id ? "selected" : ""}`}
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

- [ ] **Step 3: Add map note and selected marker CSS**

In `src/styles.css`, add:

```css
.map-note {
  position: absolute;
  z-index: 2;
  top: 12px;
  left: 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: oklch(0.10 0.014 226 / 0.82);
  color: var(--muted);
  padding: 7px 10px;
  font-size: 0.72rem;
  font-weight: 800;
}

.map-marker.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px oklch(0.77 0.13 205 / 0.14);
}

.map-event.sos {
  box-shadow: 0 0 0 5px oklch(0.62 0.21 25 / 0.20);
}

.map-event.meet {
  box-shadow: 0 0 0 5px oklch(0.78 0.13 78 / 0.16);
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/App.test.tsx`

Expected: Map assertions should pass. Goggle assertions may still fail.

---

### Task 7: Simplify Goggle Into The Roadshow Value Point

**Files:**
- Modify: `src/pages/GogglePage.tsx`
- Modify: `src/components/GogglePreview.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Replace `GogglePage.tsx` to remove duplicate compact HUD**

Replace `src/pages/GogglePage.tsx` with:

```tsx
import { GogglePreview } from "../components/GogglePreview";
import { StatusPill } from "../components/StatusPill";
import type { DemoSession } from "../hooks/useDemoSession";

type GogglePageProps = {
  session: DemoSession;
};

export function GogglePage({ session }: GogglePageProps) {
  return (
    <div className="page-stack goggle-page">
      <header className="page-header">
        <div>
          <p className="demo-kicker">What the skier sees</p>
          <h1>Goggle Preview</h1>
          <p className="page-subtitle">No map. No feed. Just the next cue.</p>
        </div>
        <StatusPill tone="default">Prototype</StatusPill>
      </header>

      <GogglePreview hud={session.hud} />

      <section className="panel display-mode-panel goggle-explainer">
        <span className="muted-label">Display Mode</span>
        <strong>Arrow + Distance</strong>
        <p>Only direction, distance, and emergency priority reach the simulated goggle display.</p>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Replace `GogglePreview.tsx` with sparse output copy**

Replace `src/components/GogglePreview.tsx` with:

```tsx
import type { HudPayload } from "../types";

type GogglePreviewProps = {
  hud: HudPayload;
};

export function GogglePreview({ hud }: GogglePreviewProps) {
  const label = hud.label.replace(" FROM ", " ");

  return (
    <section className={`goggle-device ${hud.mode}`} aria-label="Simulated goggle output">
      <p className="goggle-device-label">Simulated goggle output</p>
      <div className="goggle-frame">
        <div className="lens left-lens" />
        <div className="lens right-lens" />
        <div className="hud-window">
          <span className="hud-chip">{hud.mode.toUpperCase()}</span>
          <strong>{label}</strong>
          <span className="goggle-arrow" aria-label={`Direction ${hud.arrow}`}>{hud.arrow}</span>
          {hud.distanceMeters ? <span className="goggle-distance">{hud.distanceMeters}m</span> : <span className="goggle-copy">{hud.messageLabel}</span>}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Upgrade goggle CSS**

In `src/styles.css`, update/add:

```css
.goggle-device {
  padding: 14px;
  border-radius: 18px;
  background: oklch(0.055 0.01 226);
  border: 1px solid var(--line);
}

.goggle-device-label {
  margin: 0 0 12px;
  color: var(--muted);
  text-align: center;
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.goggle-frame {
  min-height: 318px;
  border-radius: 42px;
  background: linear-gradient(180deg, oklch(0.15 0.018 226), oklch(0.045 0.008 226));
}

.hud-window {
  inset: 38px 14%;
  border: 1px solid oklch(0.77 0.13 205 / 0.22);
  background: oklch(0.035 0.006 226 / 0.84);
}

.goggle-device.meet .hud-window,
.goggle-device.meet .goggle-arrow {
  color: var(--meet);
}

.goggle-device.sos .hud-window {
  border-color: oklch(0.62 0.21 25 / 0.50);
  background: oklch(0.12 0.04 25 / 0.88);
}

.goggle-explainer {
  align-self: stretch;
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/App.test.tsx`

Expected: All `src/App.test.tsx` tests should pass.

---

### Task 8: Refresh Visual Tokens, Layout Rhythm, And Motion

**Files:**
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Expand root tokens to match `DESIGN.md`**

At the top of `src/styles.css`, replace the `:root` block with:

```css
:root {
  color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --bg: oklch(0.09 0.014 226);
  --bg-elevated: oklch(0.12 0.018 224);
  --surface: oklch(0.15 0.022 224);
  --surface-strong: oklch(0.2 0.028 222);
  --surface-hud: oklch(0.055 0.01 226);
  --lens: oklch(0.18 0.045 210);
  --ink: oklch(0.96 0.015 215);
  --muted: oklch(0.74 0.04 220);
  --dim: oklch(0.56 0.045 220);
  --line: oklch(0.3 0.035 222);
  --line-strong: oklch(0.42 0.045 218);
  --primary: oklch(0.77 0.13 205);
  --primary-strong: oklch(0.84 0.12 205);
  --primary-ink: oklch(0.1 0.018 225);
  --meet: oklch(0.78 0.13 78);
  --meet-bg: oklch(0.23 0.05 78);
  --sos: oklch(0.62 0.21 25);
  --sos-strong: oklch(0.82 0.14 25);
  --sos-bg: oklch(0.19 0.06 25);
  --success: oklch(0.72 0.13 152);
  --offline: oklch(0.48 0.025 225);
  --radius: 14px;
  --nav-height: 78px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

- [ ] **Step 2: Improve global page rhythm and typography**

Update these selectors:

```css
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header h1,
.join-panel h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.demo-kicker,
.muted-label {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Tune interaction motion**

Replace existing button transition rules with:

```css
.primary-button,
.secondary-button,
.inline-command,
.primary-danger,
.action-button,
.icon-button,
.segment,
.nav-item,
.team-row,
.map-marker {
  transition: transform 180ms var(--ease-out), background-color 180ms var(--ease-out), border-color 180ms var(--ease-out), color 180ms var(--ease-out), opacity 180ms var(--ease-out);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}
```

- [ ] **Step 4: Keep reduced motion intact**

Confirm the existing `@media (prefers-reduced-motion: reduce)` remains at the bottom of `src/styles.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }
}
```

- [ ] **Step 5: Run tests**

Run: `npm run test`

Expected: PASS, 3 test files, 9 or more tests depending on final count.

---

### Task 9: Polish Bottom Navigation And Projection Layout

**Files:**
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Keep nav labels simple but add accessible descriptions**

Replace `src/components/BottomNav.tsx` with:

```tsx
import { Home, Map, ScanLine } from "lucide-react";
import type { AppPage } from "../types";

type BottomNavProps = {
  page: AppPage;
  onNavigate: (page: AppPage) => void;
};

const items = [
  { id: "home" as const, label: "Home", ariaLabel: "Home control hub", icon: Home },
  { id: "map" as const, label: "Map", ariaLabel: "Team positions map", icon: Map },
  { id: "goggle" as const, label: "Goggle", ariaLabel: "Goggle preview", icon: ScanLine }
];

export function BottomNav({ page, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={page === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(item.id)}
            aria-current={page === item.id ? "page" : undefined}
            aria-label={item.ariaLabel}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Improve bottom nav CSS**

Update bottom nav styles:

```css
.bottom-nav {
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 50%;
  width: min(100%, 520px);
  height: var(--nav-height);
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px 12px max(10px, env(safe-area-inset-bottom));
  background: oklch(0.10 0.014 226 / 0.97);
  border-top: 1px solid var(--line);
}

.nav-item {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 4px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 850;
}

.nav-item.active {
  background: oklch(0.77 0.13 205 / 0.14);
  border-color: oklch(0.77 0.13 205 / 0.20);
  color: var(--primary);
}
```

- [ ] **Step 3: Verify app tests still find nav buttons**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS. If role queries fail due to `aria-label`, update test nav button queries to `/team positions map/i` and `/goggle preview/i` only where needed.

---

### Task 10: Add Roadshow Visual QA Checklist To README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a roadshow UI QA section**

Append this section to `README.md`:

```md
## Roadshow UI QA

Before presenting, verify on iPhone Safari, Android Chrome, and Desktop Chrome:

- Join states clearly: No app download. No account. No GPS. No mic. No hardware required.
- Home title reads `Phone Control Hub`.
- Home shows `Current goggle cue` with large arrow and distance.
- Primary actions read `Send Meet Point`, `Simulate SOS`, and `Send Voice Check`.
- Tapping Meet changes the cue to `MEET POINT` and shows `Clear Meet`.
- Tapping SOS opens the simulation panel and `Activate SOS from James` works without extra setup.
- SOS changes the cue to `SOS FROM JAMES` and shows `Resolve SOS`.
- Tapping James in Team shows `Tracking in HUD` and changes the follow cue.
- Map title reads `Team Positions` and states that the map explains the cue.
- Goggle page states `No map. No feed. Just the next cue.`
- Goggle page shows only the simulated HUD output, not a full phone dashboard.
- App never asks for GPS, microphone, Bluetooth, account, or hardware permissions.
```

- [ ] **Step 2: Run docs-neutral verification**

Run: `npm run test`

Expected: PASS. README changes should not affect tests.

---

### Task 11: Full Verification And Build

**Files:**
- No code changes unless verification reveals a defect.

- [ ] **Step 1: Run full tests**

Run: `npm run test`

Expected: PASS. All test files pass. App flow tests must assert the upgraded roadshow copy.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS. TypeScript build and Vite production build complete.

- [ ] **Step 3: Manual route smoke test in browser**

Run: `npm run dev`

Open these routes:

```text
http://127.0.0.1:5173/join/DEMO
http://127.0.0.1:5173/app/home
http://127.0.0.1:5173/app/map
http://127.0.0.1:5173/app/goggle
```

Expected visible results:

- `/join/DEMO`: Join page with team code `DEMO`, default name `Alex`, and no-permission reassurance.
- `/app/home`: If local participant exists, Home shows `Phone Control Hub`; otherwise app routes to Join.
- `/app/map`: If local participant exists, Map shows `Team Positions`; otherwise app routes to Join.
- `/app/goggle`: If local participant exists, Goggle shows `Goggle Preview`; otherwise app routes to Join.

- [ ] **Step 4: Manual roadshow state smoke test**

In the browser after joining:

```text
Join Demo Team
Tap James
Tap Send Meet Point
Tap Simulate SOS
Tap Activate SOS from James
Open Map
Open Goggle
Tap Resolve SOS
Tap Send Voice Check
Tap Play simulated message
```

Expected:

- James selection updates normal follow target.
- Meet changes HUD to `MEET POINT`.
- SOS overrides Meet and changes HUD to `SOS FROM JAMES`.
- Map shows SOS marker while SOS is active.
- Goggle shows the same SOS cue while SOS is active.
- Resolve SOS returns to Meet if Meet remains active, or follow target if Meet was cleared.
- Voice displays simulated message without requesting microphone or playing real audio.

---

## Visual Acceptance Criteria

Use this checklist before calling the upgrade complete:

- Home has one dominant object: the current goggle cue.
- Action buttons explain outcomes, not just feature names.
- Team rows clearly show which teammate is tracked in HUD.
- SOS is visually stronger than Meet and Follow.
- Map looks schematic, not like a full mapping product.
- Goggle page looks like a sparse hardware preview, not another phone dashboard.
- There are no decorative gradients, neon glows, glassmorphism, gradient text, or identical card-grid filler.
- All primary controls are at least 44px tall; action tiles are larger.
- Focus rings are visible on dark backgrounds.
- Reduced-motion mode disables meaningful animation duration.
- Desktop projection stays centered and readable, not stretched into a dashboard.

## Test Strategy

Automated tests should cover comprehension-critical copy and state priority, not CSS pixels.

- `src/App.test.tsx` covers Join boundaries, Home labels, action labels, SOS priority, Team tracking copy, Map explanation, and Goggle value copy.
- `src/lib/hud.test.ts` should continue covering state priority logic.
- `src/lib/storage.test.ts` should continue covering local participant storage.

If tests become brittle because distances move every 2.5 seconds, assert stable labels such as `FOLLOW JAMES`, `MEET POINT`, `SOS FROM JAMES`, and button names. Do not assert exact moving distances outside existing unit tests.

## Out Of Scope

Do not include these in this upgrade:

- Real GPS.
- Real microphone recording.
- Audio playback.
- Bluetooth or hardware connection.
- Backend sync.
- Accounts.
- Real map tiles.
- New animation libraries.
- New design system package.
- Large app architecture refactor.

## Self-Review Notes

Spec coverage:

- UI copy: Tasks 1 to 7.
- UX clarity: Tasks 2 to 7.
- Interface hierarchy: Tasks 3, 6, 7, 8, 9.
- Animation and reduced motion: Task 8.
- Responsive and projection: Tasks 8, 9, 11.
- Accessibility: Tasks 4, 5, 8, 9, 11.
- Roadshow QA: Tasks 10 and 11.

Placeholder scan:

- This plan intentionally avoids `TBD`, `TODO`, and unspecified implementation steps.

Type consistency:

- All component props match existing code: `DemoSession`, `HudPayload`, `DemoMember`, and `AppPage` are reused without new app state types.
