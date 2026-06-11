import { describeRelativeAngle } from "../lib/direction";
import type { HudPayload } from "../types";

type CurvedDirectionArrowProps = {
  relativeAngle: number;
  variant: HudPayload["mode"];
  size?: "compact" | "standard" | "map";
  label?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getArrowPath(relativeAngle: number, size: "compact" | "standard" | "map" = "standard") {
  const bend = clamp(relativeAngle / 120, -1, 1);
  const strength = size === "map" ? 36 : size === "compact" ? 25 : 31;
  const start = { x: 50, y: 91 };
  const first = { x: 50, y: 70 };
  const control = { x: 50 + bend * strength * 0.55, y: 43 };
  const end = { x: 50 + bend * strength, y: 16 + Math.abs(bend) * 8 };
  const headRotation = clamp(relativeAngle * 0.62, -58, 58);

  return {
    d: `M ${start.x} ${start.y} C ${start.x} ${start.y - 12}, ${first.x} ${first.y + 8}, ${first.x} ${first.y} C ${control.x} ${control.y}, ${end.x} ${end.y + 18}, ${end.x} ${end.y}`,
    end,
    headRotation
  };
}

export function CurvedDirectionArrow({ relativeAngle, variant, size = "standard", label }: CurvedDirectionArrowProps) {
  const path = getArrowPath(relativeAngle, size);
  const accessibleLabel = label ?? `Direction cue, ${describeRelativeAngle(relativeAngle)}`;

  return (
    <svg
      className={`curved-arrow curved-arrow-${size} ${variant}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={accessibleLabel}
      focusable="false"
    >
      <path className="curved-arrow-glow" d={path.d} />
      <path className="curved-arrow-line" d={path.d} />
      <path
        className="curved-arrow-head"
        d="M 50 8 L 42 24 L 50 20 L 58 24 Z"
        transform={`translate(${path.end.x - 50} ${path.end.y - 14}) rotate(${path.headRotation} 50 22)`}
      />
    </svg>
  );
}
