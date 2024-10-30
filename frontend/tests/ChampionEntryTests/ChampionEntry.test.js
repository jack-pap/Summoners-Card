import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChampionEntry from "@/src/components/ChampionEntry.jsx";
import ProgressBar from "@ramonak/react-progress-bar";

jest.mock("@ramonak/react-progress-bar", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="progress-bar">Mocked ProgressBar</div>
  )),
}));

describe("ChampionEntry render tests", () => {
  test("Renders component with normal stats", () => {
    const mockProps = {
      championName: "Braum",
      gamesPlayed: 50,
      winrate: 55,
      championImage: "http://example.com/Braum.png",
    };

    render(<ChampionEntry {...mockProps} />);

    expect(screen.getByText(mockProps.championName)).toBeInTheDocument();
    expect(screen.getByAltText(mockProps.championName)).toBeInTheDocument();
    expect(screen.getByText(`${mockProps.gamesPlayed} Played`)).toBeInTheDocument();
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    expect(ProgressBar).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: mockProps.winrate,
        width: "125px",
        height: "17px",
        bgColor: "#C89B3C",
        baseBgColor: "#383838",
        animateOnRender: true,
        borderRadius: "3px",
        customLabel: undefined,
        labelAlignment: "left",
      }),
      {}
    );
  });

  test("Renders component with 0 winrate", () => {
    const mockProps = {
      championName: "Braum",
      gamesPlayed: 50,
      winrate: 0,
      championImage: "http://example.com/Braum.png",
    };

    render(<ChampionEntry {...mockProps} />);

    expect(screen.getByText(mockProps.championName)).toBeInTheDocument();
    expect(screen.getByAltText(mockProps.championName)).toBeInTheDocument();
    expect(screen.getByText(`${mockProps.gamesPlayed} Played`)).toBeInTheDocument();
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    expect(ProgressBar).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: 1,
        width: "125px",
        height: "17px",
        bgColor: "#C89B3C",
        baseBgColor: "#383838",
        animateOnRender: true,
        borderRadius: "3px",
        customLabel: "0%",
        labelAlignment: "left",
      }),
      {}
    );
  });
});
