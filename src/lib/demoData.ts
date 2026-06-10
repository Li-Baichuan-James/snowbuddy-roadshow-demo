import type { AppState, DemoMember, LocalParticipant } from "../types";

export const defaultMembers: DemoMember[] = [
  {
    id: "ava",
    name: "Ava",
    role: "leader",
    status: "online",
    distanceMeters: 84,
    arrow: "↗",
    mapX: 62,
    mapY: 30,
    color: "oklch(0.78 0.13 205)"
  },
  {
    id: "james",
    name: "James",
    role: "teammate",
    status: "online",
    distanceMeters: 142,
    arrow: "←",
    mapX: 28,
    mapY: 58,
    color: "oklch(0.72 0.15 18)"
  },
  {
    id: "hank",
    name: "Hank",
    role: "teammate",
    status: "online",
    distanceMeters: 210,
    arrow: "↘",
    mapX: 72,
    mapY: 70,
    color: "oklch(0.76 0.12 78)"
  },
  {
    id: "tim",
    name: "Tim",
    role: "teammate",
    status: "offline",
    distanceMeters: 0,
    arrow: "↑",
    mapX: 44,
    mapY: 82,
    color: "oklch(0.58 0.03 230)",
    lastSeenLabel: "Last seen 2 min ago"
  }
];

export function createParticipant(displayName: string): LocalParticipant {
  return {
    id: `local-${Date.now().toString(36)}`,
    roomCode: "DEMO",
    displayName,
    joinedAt: Date.now()
  };
}

export function createInitialDemoState(displayName: string): AppState {
  return {
    participant: createParticipant(displayName),
    members: defaultMembers.map((member) => ({ ...member })),
    selectedMemberId: null,
    activeMeet: null,
    activeSos: null,
    activeVoice: null,
    currentPage: "home"
  };
}
