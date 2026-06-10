import type { HudPayload } from "../types";

type GogglePreviewProps = {
  hud: HudPayload;
};

export function GogglePreview({ hud }: GogglePreviewProps) {
  return (
    <section className={`goggle-device ${hud.mode}`} aria-label="Simulated goggle output">
      <div className="goggle-frame">
        <div className="lens left-lens" />
        <div className="lens right-lens" />
        <div className="hud-window">
          <span className="hud-chip">{hud.mode.toUpperCase()}</span>
          <strong>{hud.label.replace(" FROM ", " ")}</strong>
          <span className="goggle-arrow">{hud.arrow}</span>
          {hud.distanceMeters ? <span className="goggle-distance">{hud.distanceMeters}m</span> : <span className="goggle-copy">{hud.messageLabel}</span>}
        </div>
      </div>
      <p>Simulated goggle output</p>
    </section>
  );
}
