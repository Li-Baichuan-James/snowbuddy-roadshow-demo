import type { AppState, MapTarget } from "../types";

export const SELF_MAP_POSITION: MapTarget = { mapX: 48, mapY: 54 };
const DEFAULT_FOLLOW_TARGET: MapTarget = { mapX: 62, mapY: 30 };

export type DirectionTarget = MapTarget & {
  mode: "follow" | "meet" | "sos";
  label: string;
};

export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function normalizeRelativeAngle(degrees: number): number {
  const normalized = normalizeDegrees(degrees);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function getBearingDegrees(from: MapTarget, to: MapTarget): number {
  const radians = Math.atan2(to.mapX - from.mapX, from.mapY - to.mapY);
  return normalizeDegrees((radians * 180) / Math.PI);
}

export const DEFAULT_INITIAL_HEADING = getBearingDegrees(SELF_MAP_POSITION, DEFAULT_FOLLOW_TARGET);

export function calibrateDeviceHeading(initialDeviceHeading: number, currentDeviceHeading: number): number {
  return normalizeDegrees(DEFAULT_INITIAL_HEADING + normalizeRelativeAngle(currentDeviceHeading - initialDeviceHeading));
}

export function getRelativeAngle(targetBearing: number, phoneHeading: number): number {
  return normalizeRelativeAngle(targetBearing - phoneHeading);
}

export function describeRelativeAngle(relativeAngle: number): string {
  const rounded = Math.round(relativeAngle);
  if (Math.abs(rounded) <= 3) return "straight ahead";
  return rounded > 0 ? `${rounded} degrees right` : `${Math.abs(rounded)} degrees left`;
}

export function getActiveDirectionTarget(state: AppState): DirectionTarget {
  if (state.activeSos) {
    return {
      mode: "sos",
      label: `SOS from ${state.activeSos.senderName}`,
      mapX: state.activeSos.mapX,
      mapY: state.activeSos.mapY
    };
  }

  if (state.activeMeet) {
    return {
      mode: "meet",
      label: "Meet point",
      mapX: state.activeMeet.mapX,
      mapY: state.activeMeet.mapY
    };
  }

  const selected = state.members.find((member) => member.id === state.selectedMemberId && member.status === "online");
  const leader = state.members.find((member) => member.role === "leader" && member.status === "online");
  const fallback = state.members.find((member) => member.status === "online");
  const target = selected ?? leader ?? fallback;

  if (!target) {
    throw new Error("Demo session requires at least one online member");
  }

  return {
    mode: "follow",
    label: target.name,
    mapX: target.mapX,
    mapY: target.mapY
  };
}
