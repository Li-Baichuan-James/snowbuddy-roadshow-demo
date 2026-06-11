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
