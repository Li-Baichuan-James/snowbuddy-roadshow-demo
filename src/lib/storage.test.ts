import { describe, expect, it, beforeEach } from "vitest";
import { loadParticipant, saveParticipant } from "./storage";

describe("participant storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("trims and persists a DEMO participant", () => {
    const participant = saveParticipant("  Alex  ");

    expect(participant).toMatchObject({
      roomCode: "DEMO",
      displayName: "Alex"
    });
    expect(loadParticipant()).toMatchObject({
      roomCode: "DEMO",
      displayName: "Alex"
    });
  });

  it("rejects an empty display name", () => {
    expect(() => saveParticipant("   ")).toThrow("Display name is required");
  });

  it("limits display names to 20 characters", () => {
    const participant = saveParticipant("Alexandra Very Long Skier Name");

    expect(participant.displayName).toBe("Alexandra Very Long");
  });
});
