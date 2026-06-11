import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CurvedDirectionArrow } from "./CurvedDirectionArrow";

describe("CurvedDirectionArrow", () => {
  it("renders the navigation icon and points straight ahead upward at zero degrees", () => {
    render(<CurvedDirectionArrow relativeAngle={0} variant="follow" label="Direction cue" />);

    const arrow = screen.getByRole("img", { name: "Direction cue" });

    expect(arrow).toHaveAttribute("data-icon", "navigation");
    expect(arrow).toHaveStyle({ "--arrow-rotation": "-45deg" });
  });
});
