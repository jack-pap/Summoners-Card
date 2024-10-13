import * as apiService from "../../api/controller/apiService.js";

const AppModule = require("../../src/pages/App.jsx");

jest.mock("../../api/controller/apiService.js");

describe("getRankedInfo function tests", () => {
  test("Returns ranked solo only", async () => {
    const server = "EUW";
    const id = "PtSa$ap1!2xj0-";

    apiService.apiProxyNoCacheCall.mockResolvedValue([
      {
        queueType: "RANKED_SOLO_5x5",
        tier: 1,
        rank: 2,
        leaguePoints: 3,
        wins: 4,
        losses: 5,
      },
    ]);

    const result = await AppModule.getRankedInfo(server, id);

    expect(result).toEqual([
      "Unranked",
      {
        queueType: "RANKED_SOLO_5x5",
        rankedDivision: 2,
        rankedGames: 9,
        rankedLosses: 5,
        rankedPoints: 3,
        rankedTier: 1,
        rankedWins: 4,
      },
    ]);
  });

  test("Returns ranked flex only", async () => {
    const server = "EUW";
    const id = "PtSa$ap1!2xj0-";

    apiService.apiProxyNoCacheCall.mockResolvedValue([
      {
        queueType: "RANKED_FLEX_SR",
        tier: 1,
        rank: 2,
        leaguePoints: 3,
        wins: 4,
        losses: 5,
      },
    ]);

    const result = await AppModule.getRankedInfo(server, id);

    expect(result).toEqual([
      {
        queueType: "RANKED_FLEX_SR",
        rankedDivision: 2,
        rankedGames: 9,
        rankedLosses: 5,
        rankedPoints: 3,
        rankedTier: 1,
        rankedWins: 4,
      },
      "Unranked",
    ]);
  });

  test("Returns both ranked modes", async () => {
    const server = "EUW";
    const id = "PtSa$ap1!2xj0-";

    apiService.apiProxyNoCacheCall.mockResolvedValue([
      {
        queueType: "RANKED_FLEX_SR",
        tier: 1,
        rank: 2,
        leaguePoints: 3,
        wins: 4,
        losses: 5,
      },
      {
        queueType: "RANKED_SOLO_5x5",
        tier: 1,
        rank: 2,
        leaguePoints: 3,
        wins: 4,
        losses: 5,
      },
    ]);

    const result = await AppModule.getRankedInfo(server, id);

    expect(result).toEqual([
      {
        queueType: "RANKED_FLEX_SR",
        rankedDivision: 2,
        rankedGames: 9,
        rankedLosses: 5,
        rankedPoints: 3,
        rankedTier: 1,
        rankedWins: 4,
      },
      {
        queueType: "RANKED_SOLO_5x5",
        rankedDivision: 2,
        rankedGames: 9,
        rankedLosses: 5,
        rankedPoints: 3,
        rankedTier: 1,
        rankedWins: 4,
      },
    ]);
  });

  test("Returns none of the ranked modes", async () => {
    const server = "EUW";
    const id = "PtSa$ap1!2xj0-";

    apiService.apiProxyNoCacheCall.mockResolvedValue([{}, {}]);

    const result = await AppModule.getRankedInfo(server, id);

    expect(result).toEqual(["Unranked", "Unranked"]);
  });
});
