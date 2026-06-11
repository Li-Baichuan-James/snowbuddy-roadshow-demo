import type { CSSProperties } from "react";
import { describeRelativeAngle } from "../lib/direction";
import type { HudPayload } from "../types";

const NAVIGATION_ICON_PATH = "/images/icons/navigation.svg";
const STRAIGHT_AHEAD_ROTATION_OFFSET = -45;

type CurvedDirectionArrowProps = {
  relativeAngle: number;
  variant: HudPayload["mode"];
  size?: "compact" | "standard" | "map";
  label?: string;
};

export function CurvedDirectionArrow({ relativeAngle, variant, size = "standard", label }: CurvedDirectionArrowProps) {
  const accessibleLabel = label ?? `Direction cue, ${describeRelativeAngle(relativeAngle)}`;
  const rotation = `${relativeAngle + STRAIGHT_AHEAD_ROTATION_OFFSET}deg`;
  const style = {
    "--arrow-rotation": rotation,
    "--arrow-icon": `url("${NAVIGATION_ICON_PATH}")`
  } as CSSProperties;

  return (
    <span
      className={`curved-arrow curved-arrow-${size} ${variant}`}
      role="img"
      aria-label={accessibleLabel}
      data-icon="navigation"
      style={style}
    >
      <span className="curved-arrow-icon" aria-hidden="true" />
    </span>
  );
}
