import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  ChampionEntryList,
  getChampionImage,
} from "../../src/components/ChampionEntryList.jsx";
import * as apiService from "../../api/controller/apiService.js";

jest.mock("../../src/components/ChampionEntry.jsx", () => ({
  __esModule: true,
  default: jest.fn(({ championName }) => (
    <div data-testid="championEntry">Mocked {championName}</div>
  )),
}));

jest.mock("../../api/controller/apiService.js", () => ({
  apiImageCall: jest.fn(),
  apiProxyCall: jest.fn(),
}));

describe("ChampionEntryList render tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders list component with ranked solo stats", async () => {
    const mockProps = {
      summonerChampionWinrateInfo: new Map([
        [
          201,
          {
            rankedSoloWins: 10,
            rankedSoloGames: 20,
            rankedSoloWinrate: 50,
          },
        ],
        [
          999,
          {
            rankedSoloWins: 10,
            rankedSoloGames: 20,
            rankedSoloWinrate: 50,
          },
        ],
      ]),
      championsInfo: new Map([
        [201, "Braum"],
        [999, "Muarb"],
      ]),
      queueId: 420,
    };

    apiService.apiImageCall.mockResolvedValue("path/to/BraumImage.png");

    render(<ChampionEntryList {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByTestId("championEntry")[0]).toBeInTheDocument();
      expect(screen.getByText("Mocked Braum")).toBeInTheDocument();
    });

    expect(apiService.apiImageCall).toHaveBeenCalled();
  });
});
