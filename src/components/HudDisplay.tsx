import { Radio } from "lucide-react";
import type { CompassHeading } from "../hooks/useCompassHeading";
import { getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import type { HudPayload } from "../types";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";
import { StatusPill } from "./StatusPill";

type HudDisplayProps = {
  hud: HudPayload;
  compass: CompassHeading;
  compact?: boolean;
};

export function HudDisplay({ hud, compass, compact = false }: HudDisplayProps) {
  const tone = hud.mode === "sos" ? "sos" : hud.mode === "meet" ? "meet" : hud.mode === "voice" ? "primary" : "default";
  const className = compact ? `hud-display compact ${hud.mode}` : `hud-display ${hud.mode}`;
  const targetBearing = hud.target ? getBearingDegrees(SELF_MAP_POSITION, hud.target) : 0;
  const relativeAngle = hud.target ? getRelativeAngle(targetBearing, compass.heading) : 0;

  return (
    <section className={className} aria-label="Current goggle cue">
      <div className="hud-topline">
        <StatusPill tone={tone}>{hud.mode.toUpperCase()}</StatusPill>
        <span className="signal"><Radio size={15} aria-hidden="true" /> {compass.statusLabel}</span>
      </div>
      <p className="hud-context">Current goggle cue</p>
      <div className="hud-label">{hud.label}</div>
      <CurvedDirectionArrow relativeAngle={relativeAngle} variant={hud.mode} size={compact ? "compact" : "standard"} />
      {hud.distanceMeters ? <div className="hud-distance">{hud.distanceMeters}m</div> : <div className="hud-message">{hud.messageLabel}</div>}
    </section>
  );
}
