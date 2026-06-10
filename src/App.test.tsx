import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("SnowBuddy app flow", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/join/DEMO");
  });

  it("joins the demo team and shows Home controls", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));

    expect(screen.getByText("Current Target")).toBeInTheDocument();
    expect(screen.getByText("FOLLOW AVA")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /meet/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voice check/i })).toBeInTheDocument();
  });

  it("shows Meet and SOS priority in the shared HUD", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));
    await userEvent.click(screen.getByRole("button", { name: /^meet$/i }));

    expect(screen.getByText("MEET POINT")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^sos$/i }));
    await userEvent.click(screen.getByRole("button", { name: /simulate sos/i }));

    expect(screen.getByText("SOS FROM JAMES")).toBeInTheDocument();
    expect(screen.queryByText("MEET POINT")).not.toBeInTheDocument();
  });

  it("navigates to Map and Goggle after joining", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo team/i }));
    await userEvent.click(screen.getByRole("button", { name: /map/i }));

    expect(screen.getByText("Simulated slope map")).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /primary/i });
    await userEvent.click(within(nav).getByRole("button", { name: /^goggle$/i }));

    expect(screen.getByText("Low-distraction HUD")).toBeInTheDocument();
    expect(screen.getByText("Simulated goggle output")).toBeInTheDocument();
  });
});
