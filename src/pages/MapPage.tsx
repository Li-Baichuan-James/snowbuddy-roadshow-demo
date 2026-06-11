import { DemoMap } from "../components/DemoMap";
import type { CompassHeading } from "../hooks/useCompassHeading";
import type { DemoSession } from "../hooks/useDemoSession";
import type { AppPage } from "../types";

type MapPageProps = {
  session: DemoSession;
  navigate: (page: AppPage) => void;
  compass: CompassHeading;
};

export function MapPage({ session, navigate, compass }: MapPageProps) {
  void compass;

  const selected = session.state.members.find((member) => member.id === session.state.selectedMemberId)
    ?? session.state.members.find((member) => member.role === "leader");
  const selectedName = selected?.name ?? "Ava";

  return (
    <div className="page-stack map-page">
      <header className="page-header">
        <div>
          <h1>Team Positions</h1>
          <p className="page-subtitle">Map for context. HUD for motion.</p>
        </div>
      </header>

      <DemoMap session={session} compass={compass} />

      <section className="panel selected-panel">
        <div>
          <span className="muted-label">Selected teammate</span>
          <h2>{selectedName}</h2>
          <p>{selected?.status === "online" ? `${selected.distanceMeters}m away · ${selected.arrow}` : "Last seen 2 min ago"}</p>
        </div>
        <button type="button" className="primary-button small" onClick={() => navigate("goggle")}>Track {selectedName} in HUD</button>
      </section>
    </div>
  );
}
