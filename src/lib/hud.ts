import type { AppState, DemoMeet, DemoMember, DemoSos, DemoVoice, HudPayload } from "../types";

export function memberToHud(member: DemoMember): HudPayload {
  return {
    mode: "follow",
    label: `FOLLOW ${member.name.toUpperCase()}`,
    arrow: member.arrow,
    distanceMeters: member.distanceMeters,
    target: { mapX: member.mapX, mapY: member.mapY }
  };
}

export function meetToHud(meet: DemoMeet): HudPayload {
  return {
    mode: "meet",
    label: meet.label,
    arrow: meet.arrow,
    distanceMeters: meet.distanceMeters,
    target: { mapX: meet.mapX, mapY: meet.mapY }
  };
}

export function sosToHud(sos: DemoSos): HudPayload {
  return {
    mode: "sos",
    label: `SOS FROM ${sos.senderName.toUpperCase()}`,
    arrow: sos.arrow,
    distanceMeters: sos.distanceMeters,
    target: { mapX: sos.mapX, mapY: sos.mapY }
  };
}

export function voiceToHud(voice: DemoVoice): HudPayload {
  return {
    mode: "voice",
    label: `VOICE FROM ${voice.senderName.toUpperCase()}`,
    arrow: "↑",
    messageLabel: voice.messageLabel
  };
}

export function getSelectedMember(state: AppState): DemoMember {
  const selected = state.members.find((member) => member.id === state.selectedMemberId && member.status === "online");
  const leader = state.members.find((member) => member.role === "leader");
  const fallback = state.members.find((member) => member.status === "online");

  if (selected) return selected;
  if (leader) return leader;
  if (fallback) return fallback;

  throw new Error("Demo session requires at least one online member");
}

export function getCurrentHudPayload(state: AppState): HudPayload {
  if (state.activeSos) return sosToHud(state.activeSos);
  if (state.activeMeet) return meetToHud(state.activeMeet);
  if (state.activeVoice) return voiceToHud(state.activeVoice);
  return memberToHud(getSelectedMember(state));
}
