import { createParticipant } from "./demoData";
import type { LocalParticipant } from "../types";

const STORAGE_KEY = "snowbuddy.participant";

export function normalizeDisplayName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    throw new Error("Display name is required");
  }
  return trimmed.slice(0, 20).trimEnd();
}

export function saveParticipant(displayName: string): LocalParticipant {
  const participant = createParticipant(normalizeDisplayName(displayName));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participant));
  return participant;
}

export function loadParticipant(): LocalParticipant | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LocalParticipant;
    if (parsed.roomCode !== "DEMO" || !parsed.displayName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearParticipant(): void {
  localStorage.removeItem(STORAGE_KEY);
}
