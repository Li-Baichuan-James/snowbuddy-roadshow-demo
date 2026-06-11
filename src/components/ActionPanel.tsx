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
        <div className="sos-confirm" role="region" aria-labelledby="sos-title" aria-describedby="sos-description">
          <div className="sos-confirm-header">
            <h3 id="sos-title">Simulate SOS alert?</h3>
            <button type="button" className="icon-button" onClick={() => setSosOpen(false)} aria-label="Close SOS alert">
              <X size={19} aria-hidden="true" />
            </button>
          </div>
          <p id="sos-description">The goggle HUD will switch to the selected teammate as the emergency target.</p>
          <div className="segmented-list" role="group" aria-label="Choose SOS teammate">
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
