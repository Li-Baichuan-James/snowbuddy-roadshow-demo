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

  function simulateSos(member: DemoMember | null) {
    session.triggerSos(member);
    setSosOpen(false);
  }

  return (
    <section className="panel actions-panel">
      <div className="action-grid">
        <button type="button" className="action-button meet" onClick={session.triggerMeet}>
          <UsersRound size={20} />
          <span>Meet</span>
        </button>
        <button type="button" className="action-button sos" onClick={() => setSosOpen(true)}>
          <OctagonAlert size={20} />
          <span>SOS</span>
        </button>
        <button type="button" className="action-button voice" onClick={session.triggerVoice}>
          <Mic2 size={20} />
          <span>Voice Check</span>
        </button>
      </div>

      <p className="feedback-line">{session.feedback}</p>

      {session.state.activeMeet && !session.state.activeSos && (
        <button type="button" className="inline-command" onClick={session.clearMeet}>Clear Meet</button>
      )}
      {session.state.activeSos && (
        <button type="button" className="inline-command sos-clear" onClick={session.resolveSos}>Resolve SOS</button>
      )}

      {sosOpen && (
        <div className="sos-confirm" role="dialog" aria-modal="true" aria-labelledby="sos-title">
          <div className="sos-confirm-header">
            <h3 id="sos-title">Simulate SOS alert?</h3>
            <button type="button" className="icon-button" onClick={() => setSosOpen(false)} aria-label="Close SOS dialog">
              <X size={19} />
            </button>
          </div>
          <p>Your team will see the selected teammate as the emergency target.</p>
          <div className="segmented-list">
            {onlineMembers.map((member) => (
              <button
                type="button"
                key={member.id}
                className={selectedSosMemberId === member.id ? "segment selected" : "segment"}
                onClick={() => setSelectedSosMemberId(member.id)}
              >
                {member.name}
              </button>
            ))}
          </div>
          <button type="button" className="primary-danger" onClick={() => simulateSos(selectedMember)}>
            Simulate SOS
          </button>
        </div>
      )}
    </section>
  );
}
