import * as apiService from "../../server/controller/apiService.js";

const AppModule = require("../../src/pages/App.jsx");

// export async function getRankedInfo(server, id) {
//     const rankedApiURL = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`;
//     const data = await apiProxyNoCacheCall(rankedApiURL);
//     var rankedSoloInfo = null;
//     var rankedFlexInfo = null;
//     for (let i = 0; i < data.length; i++) {
//       const currentRankedInfo = {
//         queueType: data[i].queueType, // Solo/duo or Flex queue (RANKED_SOLO_5x5, RANKED_FLEX_SR)
//         rankedTier: data[i].tier, // Iron - Challenger
//         rankedDivision: data[i].rank, // Roman numerical value IV - I
//         rankedPoints: data[i].leaguePoints, // Points out of 100 in current rank
//         rankedGames: data[i].wins + data[i].losses, // Total number of games played this season
//         rankedWins: data[i].wins, // Wins in current ranked season
//         rankedLosses: data[i].losses, // Losses in current ranked season
//       };

//       if (currentRankedInfo.queueType === "RANKED_SOLO_5x5") {
//         rankedSoloInfo = currentRankedInfo;
//       } else if (currentRankedInfo.queueType === "RANKED_FLEX_SR") {
//         rankedFlexInfo = currentRankedInfo;
//       }
//     }
//     return [rankedFlexInfo || "Unranked", rankedSoloInfo || "Unranked"];
//   }

jest.mock("../../server/controller/apiService.js");

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
