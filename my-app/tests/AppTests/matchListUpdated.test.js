const AppModule = require("../../src/pages/App.jsx");
const {
  apiGETDatabaseCall,
  apiProxyNoCacheCall,
} = require("../../server/controller/apiService.js");

// export async function matchListUpdated(region, puuid, stateMatch) {
//     const matchListApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${0}&count=${1}&type=ranked&api_key=${API_KEY}`;
//     const data = await apiProxyNoCacheCall(matchListApiURL);
//     const DBMatch = await apiGETDatabaseCall(
//       "match",
//       `getMatchSpecific?matchID=${data[0]}&puuid=${puuid}`
//     );
//     if (stateMatch && DBMatch[0]) return stateMatch == DBMatch[0].matchID;
//     return DBMatch.length > 0;
//   }

jest.mock("../../server/controller/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn(),
  apiProxyNoCacheCall: jest.fn(),
}));

describe("matchListUpdated function tests", () => {
  test("Check while list is updated", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([{ matchID: "recentMatchData" }]);
    apiProxyNoCacheCall.mockResolvedValue(["recentMatchData"]);

    const result = await AppModule.matchListUpdated(region, puuid, null);

    expect(result).toEqual(true);
  });

  test("Check while list is not updated", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue({});
    apiProxyNoCacheCall.mockResolvedValue([{ matchID: "notRecentMatchData" }]);

    const result = await AppModule.matchListUpdated(region, puuid, null);

    expect(result).toEqual(false);
  });

  test("Check while list is updated in state", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([{ matchID: "recentMatchData" }]);
    apiProxyNoCacheCall.mockResolvedValue(["recentMatchData"]);

    const result = await AppModule.matchListUpdated(
      region,
      puuid,
      "recentMatchData"
    );

    expect(result).toEqual(true);
  });

  test("Check while list is not updated in state", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([{ matchID: "recentMatchData" }]);
    apiProxyNoCacheCall.mockResolvedValue([]);

    const result = await AppModule.matchListUpdated(
      region,
      puuid,
      "notRecentMatchData"
    );

    expect(result).toEqual(false);
  });
});
