import { LocateFixed } from "lucide-react";
import type { CompassHeading } from "../hooks/useCompassHeading";
import type { DemoSession } from "../hooks/useDemoSession";
import { getActiveDirectionTarget, getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";

type DemoMapProps = {
  session: DemoSession;
  compass: CompassHeading;
};

export function DemoMap({ session, compass }: DemoMapProps) {
  const { state } = session;
  const activeTarget = getActiveDirectionTarget(state);
  const targetBearing = getBearingDegrees(SELF_MAP_POSITION, activeTarget);
  const relativeAngle = getRelativeAngle(targetBearing, compass.heading);

  const getMarkerLabel = (member: DemoSession["state"]["members"][number]) => {
    if (member.status === "online") {
      return `Select ${member.name}, ${member.distanceMeters} meters away`;
    }

    return `${member.name} offline, Last seen 2 min ago`;
  };

  return (
    <section className="map-stage" aria-label="Simulated slope map">
      <svg className="slope-lines" viewBox="0 0 100 100" role="img" aria-label="Ski piste schematic">
        <path d="M8 16 C28 6, 44 20, 68 12 C82 8, 90 12, 96 20" />
        <path d="M5 38 C23 30, 38 46, 58 36 C76 27, 85 38, 96 34" />
        <path d="M3 65 C20 56, 40 68, 60 58 C78 48, 89 54, 97 62" />
        <path d="M12 88 C28 78, 48 89, 72 78 C84 72, 91 76, 98 82" />
      </svg>

      <CurvedDirectionArrow relativeAngle={relativeAngle} variant={activeTarget.mode} size="map" label="Map direction cue" />

      <div className="map-note">Abstract slope view · {compass.statusLabel}</div>

      <div className="self-marker" style={{ left: "48%", top: "54%" }}>
        <LocateFixed size={18} aria-hidden="true" />
        <span>You</span>
      </div>

      {state.members.map((member) => (
        <button
          type="button"
          key={member.id}
          className={`map-marker ${member.status} ${state.selectedMemberId === member.id ? "selected" : ""}`}
          aria-label={getMarkerLabel(member)}
          aria-pressed={state.selectedMemberId === member.id}
          style={{ left: `${member.mapX}%`, top: `${member.mapY}%`, "--member-color": member.color } as React.CSSProperties}
          onClick={() => member.status === "online" && session.selectMember(member.id)}
          disabled={member.status === "offline"}
        >
          <span>{member.name}</span>
        </button>
      ))}

      {state.activeMeet && (
        <div className="map-event meet" style={{ left: `${state.activeMeet.mapX}%`, top: `${state.activeMeet.mapY}%` }}>Meet</div>
      )}
      {state.activeSos && (
        <div className="map-event sos" style={{ left: `${state.activeSos.mapX}%`, top: `${state.activeSos.mapY}%` }}>SOS</div>
      )}
    </section>
  );
}
