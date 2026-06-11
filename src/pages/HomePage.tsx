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
          <h1>Phone Control Hub</h1>
          <p className="page-subtitle">Set the cue. The goggle stays simple.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => navigate("goggle")}>Preview</button>
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
