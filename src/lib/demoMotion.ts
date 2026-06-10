import type { DemoMember, HudArrow } from "../types";

const arrows: HudArrow[] = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function advanceDemoMembers(members: DemoMember[], tick: number): DemoMember[] {
  return members.map((member, index) => {
    if (member.status === "offline") return member;

    const wave = Math.sin(tick / 2 + index);
    const arrowIndex = Math.abs(Math.round(tick + index * 2)) % arrows.length;

    return {
      ...member,
      distanceMeters: clamp(Math.round(member.distanceMeters + wave * 4), 36, 240),
      arrow: arrows[arrowIndex],
      mapX: clamp(member.mapX + Math.cos(tick / 3 + index) * 1.4, 12, 88),
      mapY: clamp(member.mapY + Math.sin(tick / 4 + index) * 1.2, 14, 86)
    };
  });
}
