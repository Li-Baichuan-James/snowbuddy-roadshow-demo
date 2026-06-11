import type { CompassHeading } from "../hooks/useCompassHeading";
import { getBearingDegrees, getRelativeAngle, SELF_MAP_POSITION } from "../lib/direction";
import type { HudPayload } from "../types";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";

type GogglePreviewProps = {
  hud: HudPayload;
  compass: CompassHeading;
};

export function GogglePreview({ hud, compass }: GogglePreviewProps) {
  const label = hud.label.replace(" FROM ", " ");
  const targetBearing = hud.target ? getBearingDegrees(SELF_MAP_POSITION, hud.target) : 0;
  const relativeAngle = hud.target ? getRelativeAngle(targetBearing, compass.heading) : 0;

  return (
    <section className={`goggle-device ${hud.mode}`} aria-label="Simulated goggle output">
      <p className="goggle-device-label">Simulated goggle output</p>
      <div className="goggle-frame scenic-lens">
        <div className="lens left-lens" />
        <div className="lens right-lens" />
        <div className="hud-window">
          <span className="hud-chip">{hud.mode.toUpperCase()}</span>
          <strong>{label}</strong>
          <CurvedDirectionArrow relativeAngle={relativeAngle} variant={hud.mode} size="compact" label="Goggle direction cue" />
          {hud.distanceMeters ? <span className="goggle-distance">{hud.distanceMeters}m</span> : <span className="goggle-copy">{hud.messageLabel}</span>}
        </div>
      </div>
    </section>
  );
}
