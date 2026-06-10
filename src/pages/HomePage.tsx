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
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="demo-kicker">SnowBuddy DEMO</p>
          <h1>Current Target</h1>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate("goggle")}>Goggle</button>
      </header>
      <HudDisplay hud={session.hud} />
      <ActionPanel session={session} />
      {session.state.activeVoice && (
        <section className="voice-panel">
          <div>
            <strong>Voice from {session.state.activeVoice.senderName}</strong>
            <p>{session.state.activeVoice.messageLabel}</p>
          </div>
          <button type="button" className="secondary-button" onClick={session.playVoice}>
            {session.voicePlayed ? "Played" : "Play"}
          </button>
        </section>
      )}
      <TeamList members={session.state.members} selectedMemberId={session.state.selectedMemberId} onSelect={session.selectMember} />
    </div>
  );
}
