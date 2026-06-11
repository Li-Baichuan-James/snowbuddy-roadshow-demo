import type { HudPayload } from "../types";

type GogglePreviewProps = {
  hud: HudPayload;
};

export function GogglePreview({ hud }: GogglePreviewProps) {
  const label = hud.label.replace(" FROM ", " ");

  return (
    <section className={`goggle-device ${hud.mode}`} aria-label="Simulated goggle output">
      <p className="goggle-device-label">Simulated goggle output</p>
      <div className="goggle-frame scenic-lens">
        <div className="lens left-lens" />
        <div className="lens right-lens" />
        <div className="hud-window">
          <span className="hud-chip">{hud.mode.toUpperCase()}</span>
          <strong>{label}</strong>
          <span className="goggle-arrow" aria-label={`Direction ${hud.arrow}`}>{hud.arrow}</span>
          {hud.distanceMeters ? <span className="goggle-distance">{hud.distanceMeters}m</span> : <span className="goggle-copy">{hud.messageLabel}</span>}
        </div>
      </div>
    </section>
  );
}
