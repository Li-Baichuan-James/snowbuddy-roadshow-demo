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
