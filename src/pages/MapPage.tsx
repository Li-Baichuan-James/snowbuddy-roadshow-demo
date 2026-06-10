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

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="demo-kicker">Team Map</p>
          <h1>Simulated slope map</h1>
        </div>
      </header>
      <DemoMap session={session} />
      <section className="panel selected-panel">
        <div>
          <span className="muted-label">Selected</span>
          <h2>{selected?.name ?? "Ava"}</h2>
          <p>{selected?.status === "online" ? `${selected.distanceMeters}m away` : "Last seen 2 min ago"}</p>
        </div>
        <button type="button" className="primary-button small" onClick={() => navigate("goggle")}>Track in Goggle</button>
      </section>
      <HudDisplay hud={session.hud} compact />
    </div>
  );
}
