const AppModule = require("@/src/App.jsx");
const { apiGETDatabaseCall, apiCall } = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn(),
  apiCall: jest.fn(),
}));

describe("matchListUpdated function tests", () => {
  test("Check while list is updated", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([{ matchID: "recentMatchData" }]);
    apiCall.mockResolvedValue(["recentMatchData"]);

    const result = await AppModule.matchListUpdated(region, puuid);

    expect(result).toEqual(true);
  });

  test("Check while list is not updated", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue({});
    apiCall.mockResolvedValue([{ matchID: "notRecentMatchData" }]);

    const result = await AppModule.matchListUpdated(region, puuid);

    expect(result).toEqual(false);
  });

  test("Check while list is updated in state", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([{ matchID: "recentMatchData" }]);
    apiCall.mockResolvedValue(["recentMatchData"]);

    const result = await AppModule.matchListUpdated(region, puuid);

    expect(result).toEqual(true);
  });

  test("Check while list is not updated in state", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([]);
    apiCall.mockResolvedValue(["recentMatchData"]);

    const result = await AppModule.matchListUpdated(region, puuid);

    expect(result).toEqual(false);
  });
});
