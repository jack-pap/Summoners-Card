const AppModule = require("../../src/pages/App.jsx");
const {
  apiGETDatabaseCall,
  apiProxyNoCacheCall,
} = require("../../server/controller/apiService.js");

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
