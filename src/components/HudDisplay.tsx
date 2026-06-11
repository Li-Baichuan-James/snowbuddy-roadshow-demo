import { Radio } from "lucide-react";
import type { HudPayload } from "../types";
import { StatusPill } from "./StatusPill";

type HudDisplayProps = {
  hud: HudPayload;
  compact?: boolean;
};

export function HudDisplay({ hud, compact = false }: HudDisplayProps) {
  const tone = hud.mode === "sos" ? "sos" : hud.mode === "meet" ? "meet" : hud.mode === "voice" ? "primary" : "default";
  const className = compact ? `hud-display compact ${hud.mode}` : `hud-display ${hud.mode}`;

  return (
    <section className={className} aria-label="Current goggle cue">
      <div className="hud-topline">
        <StatusPill tone={tone}>{hud.mode.toUpperCase()}</StatusPill>
        <span className="signal"><Radio size={15} aria-hidden="true" /> Signal simulated</span>
      </div>
      <p className="hud-context">Current goggle cue</p>
      <div className="hud-label">{hud.label}</div>
      <div className="hud-arrow" aria-label={`Direction ${hud.arrow}`}>{hud.arrow}</div>
      {hud.distanceMeters ? <div className="hud-distance">{hud.distanceMeters}m</div> : <div className="hud-message">{hud.messageLabel}</div>}
    </section>
  );
}
