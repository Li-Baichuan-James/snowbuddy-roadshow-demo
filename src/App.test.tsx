import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("SnowBuddy roadshow flow", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/join/DEMO");
  });

  it("joins the demo and explains the prototype boundaries", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /smart cues for group skiing/i })).toBeInTheDocument();
    expect(screen.getByText(/roadshow prototype/i)).toBeInTheDocument();
    expect(screen.getByText(/no gps or account required/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /join demo/i }));

    expect(screen.getByRole("heading", { name: /phone control hub/i })).toBeInTheDocument();
    expect(screen.getByText(/current goggle cue/i)).toBeInTheDocument();
    expect(screen.getByText("FOLLOW AVA")).toBeInTheDocument();
    expect(screen.getByText(/set the cue/i)).toBeInTheDocument();
  });

  it("shows clear action labels and SOS priority", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo/i }));

    expect(screen.getByRole("button", { name: /^meet point$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sos$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^voice check$/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^meet point$/i }));
    expect(screen.getByText("MEET POINT")).toBeInTheDocument();
    expect(screen.getByText(/meet point sent to team/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^sos$/i }));
    await userEvent.click(screen.getByRole("button", { name: /activate sos from james/i }));

    expect(screen.getByText("SOS FROM JAMES")).toBeInTheDocument();
    expect(screen.queryByText("MEET POINT")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resolve sos/i })).toBeInTheDocument();
  });

  it("makes team selection and map-to-HUD relationship explicit", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo/i }));
    await userEvent.click(screen.getByRole("button", { name: /james/i }));

    expect(screen.getByText(/tracking in hud/i)).toBeInTheDocument();
    expect(screen.getByText("FOLLOW JAMES")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /map/i }));

    expect(screen.getByRole("heading", { name: /team positions/i })).toBeInTheDocument();
    expect(screen.getByText(/map for context/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /track james in hud/i })).toBeInTheDocument();
  });

  it("shows the goggle as sparse simulated output", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /join demo/i }));

    const nav = screen.getByRole("navigation", { name: /primary/i });
    await userEvent.click(within(nav).getByRole("button", { name: /goggle preview/i }));

    expect(screen.getByRole("heading", { name: /goggle preview/i })).toBeInTheDocument();
    expect(screen.getByText(/one cue at a time/i)).toBeInTheDocument();
    expect(screen.getByText(/simulated goggle output/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/simulated goggle output/i).querySelector(".goggle-frame.scenic-lens")).toBeInTheDocument();
  });
});
