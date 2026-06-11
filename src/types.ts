export type HudArrow = "↑" | "↗" | "→" | "↘" | "↓" | "↙" | "←" | "↖";

export type MapTarget = {
  mapX: number;
  mapY: number;
};

export type HudPayload = {
  mode: "follow" | "meet" | "sos" | "voice";
  label: string;
  arrow: HudArrow;
  distanceMeters?: number;
  messageLabel?: string;
  target?: MapTarget;
};

export type LocalParticipant = {
  id: string;
  roomCode: "DEMO";
  displayName: string;
  joinedAt: number;
};

export type DemoMember = {
  id: string;
  name: string;
  role: "leader" | "teammate";
  status: "online" | "offline";
  distanceMeters: number;
  arrow: HudArrow;
  mapX: number;
  mapY: number;
  color: string;
  lastSeenLabel?: string;
};

export type DemoMeet = {
  id: string;
  label: "MEET POINT";
  distanceMeters: number;
  arrow: HudArrow;
  mapX: number;
  mapY: number;
  createdAt: number;
};

export type DemoSos = {
  id: string;
  senderName: string;
  distanceMeters: number;
  arrow: HudArrow;
  mapX: number;
  mapY: number;
  createdAt: number;
};

export type DemoVoice = {
  id: string;
  senderName: string;
  messageLabel: string;
  createdAt: number;
  expiresAt: number;
};

export type AppPage = "home" | "map" | "goggle";

export type AppState = {
  participant: LocalParticipant | null;
  members: DemoMember[];
  selectedMemberId: string | null;
  activeMeet: DemoMeet | null;
  activeSos: DemoSos | null;
  activeVoice: DemoVoice | null;
  currentPage: AppPage;
};
