import { GogglePreview } from "../components/GogglePreview";
import { StatusPill } from "../components/StatusPill";
import type { CompassHeading } from "../hooks/useCompassHeading";
import type { DemoSession } from "../hooks/useDemoSession";

type GogglePageProps = {
  session: DemoSession;
  compass: CompassHeading;
};

export function GogglePage({ session, compass }: GogglePageProps) {
  return (
    <div className="page-stack goggle-page">
      <header className="page-header">
        <div>
          <h1>Goggle Preview</h1>
          <p className="page-subtitle">One cue at a time.</p>
        </div>
        <StatusPill tone="default">Prototype</StatusPill>
      </header>

      <GogglePreview hud={session.hud} compass={compass} />

      <section className="panel display-mode-panel goggle-explainer">
        <span className="muted-label">Display mode</span>
        <strong>Arrow + Distance</strong>
        <p>Direction, distance, and emergency priority only.</p>
      </section>
    </div>
  );
}
