import { GogglePreview } from "../components/GogglePreview";
import { HudDisplay } from "../components/HudDisplay";
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
          <p className="demo-kicker">Goggle Preview</p>
          <h1>Low-distraction HUD</h1>
        </div>
        <StatusPill tone="default">Prototype</StatusPill>
      </header>
      <GogglePreview hud={session.hud} />
      <section className="panel display-mode-panel">
        <span className="muted-label">Display Mode</span>
        <strong>Arrow + Distance</strong>
        <p>Only the current cue is shown in the goggle display.</p>
      </section>
      <HudDisplay hud={session.hud} compact />
    </div>
  );
}
