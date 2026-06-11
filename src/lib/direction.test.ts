import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./demoData";
import {
  DEFAULT_INITIAL_HEADING,
  SELF_MAP_POSITION,
  describeRelativeAngle,
  getActiveDirectionTarget,
  getBearingDegrees,
  getRelativeAngle
} from "./direction";

describe("direction math", () => {
  it("uses 0 degrees for a target directly above self", () => {
    expect(getBearingDegrees(SELF_MAP_POSITION, { mapX: 48, mapY: 24 })).toBeCloseTo(0, 5);
  });

  it("uses 90 degrees for a target directly right of self", () => {
    expect(getBearingDegrees(SELF_MAP_POSITION, { mapX: 78, mapY: 54 })).toBeCloseTo(90, 5);
  });

  it("normalizes relative angles into -180 to 180", () => {
    expect(getRelativeAngle(10, 350)).toBe(20);
    expect(getRelativeAngle(350, 10)).toBe(-20);
    expect(getRelativeAngle(180, 0)).toBe(180);
  });

  it("describes relative angle accessibly", () => {
    expect(describeRelativeAngle(0)).toBe("straight ahead");
    expect(describeRelativeAngle(32)).toBe("32 degrees right");
    expect(describeRelativeAngle(-47)).toBe("47 degrees left");
  });

  it("aligns the initial simulated heading with the default follow target", () => {
    const state = createInitialDemoState("Alex");
    const target = getActiveDirectionTarget(state);
    const targetBearing = getBearingDegrees(SELF_MAP_POSITION, target);

    expect(getRelativeAngle(targetBearing, DEFAULT_INITIAL_HEADING)).toBe(0);
  });
});

describe("active direction target", () => {
  it("defaults to the leader", () => {
    const state = createInitialDemoState("Alex");

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "Ava",
      mode: "follow",
      mapX: 62,
      mapY: 30
    });
  });

  it("uses selected online teammate before fallback leader", () => {
    const state = { ...createInitialDemoState("Alex"), selectedMemberId: "james" };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "James",
      mode: "follow",
      mapX: 28,
      mapY: 58
    });
  });

  it("uses meet over selected teammate when there is no SOS", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "james",
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 120,
        arrow: "→" as const,
        mapX: 55,
        mapY: 46,
        createdAt: 10
      }
    };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "Meet point",
      mode: "meet",
      mapX: 55,
      mapY: 46
    });
  });

  it("uses SOS over meet and selected teammate", () => {
    const state = {
      ...createInitialDemoState("Alex"),
      selectedMemberId: "hank",
      activeMeet: {
        id: "meet-1",
        label: "MEET POINT" as const,
        distanceMeters: 120,
        arrow: "→" as const,
        mapX: 55,
        mapY: 46,
        createdAt: 10
      },
      activeSos: {
        id: "sos-1",
        senderName: "James",
        distanceMeters: 45,
        arrow: "←" as const,
        mapX: 28,
        mapY: 58,
        createdAt: 11
      }
    };

    expect(getActiveDirectionTarget(state)).toMatchObject({
      label: "SOS from James",
      mode: "sos",
      mapX: 28,
      mapY: 58
    });
  });
});
