import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./demoData";
import { getCurrentHudPayload } from "./hud";

describe("getCurrentHudPayload", () => {
  it("defaults to following the leader", () => {
    const state = createInitialDemoState("Alex");

    expect(getCurrentHudPayload(state)).toMatchObject({
      mode: "follow",
      label: "FOLLOW AVA",
      arrow: "↗",
      distanceMeters: 84,
      target: { mapX: 62, mapY: 30 }
    });
  });

  it("uses SOS over meet, voice, and selected teammate", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "hank",
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 128,
        arrow: "→" as const,
        mapX: 58,
        mapY: 42,
        createdAt: 10
      },
      activeVoice: {
        id: "voice-1",
        senderName: "Ava",
        messageLabel: "Regroup near the blue run.",
        createdAt: 11,
        expiresAt: 20
      },
      activeSos: {
        id: "sos-1",
        senderName: "James",
        distanceMeters: 45,
        arrow: "←" as const,
        mapX: 27,
        mapY: 62,
        createdAt: 12
      }
    };

    expect(getCurrentHudPayload(state)).toMatchObject({
      mode: "sos",
      label: "SOS FROM JAMES",
      arrow: "←",
      distanceMeters: 45,
      target: { mapX: 27, mapY: 62 }
    });
  });

  it("uses meet over voice and selected teammate when there is no SOS", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "james",
      activeVoice: {
        id: "voice-1",
        senderName: "Ava",
        messageLabel: "Regroup near the blue run.",
        createdAt: 11,
        expiresAt: 20
      },
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 128,
        arrow: "→" as const,
        mapX: 58,
        mapY: 42,
        createdAt: 10
      }
    };

    expect(getCurrentHudPayload(state)).toMatchObject({
      mode: "meet",
      label: "MEET POINT",
      arrow: "→",
      distanceMeters: 128,
      target: { mapX: 58, mapY: 42 }
    });
  });
});
