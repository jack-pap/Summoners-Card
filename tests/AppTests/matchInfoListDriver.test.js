const AppModule = require("@/src/App.jsx");
const { matchInfoListDriver } = require("@/src/App.jsx");

jest.mock("@/src/utils/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn().mockResolvedValue([1]),
}));

jest.mock("isomorphic-fetch");
jest.mock("@/src/App.jsx", () => {
  const actualModule = jest.requireActual("@/src/App.jsx");  // Get the actual implementation

  return {
    ...actualModule, // Keep all other exports intact
    getMatchInfoList: jest.fn().mockResolvedValue([1, 2, 3]),  // Mock getMatchInfoList
    findMoreMatches: jest.fn().mockResolvedValue([1, 2, 3]),   // Mock findMoreMatches
  };
});

describe("matchInfoListDriver function tests", () => {
  test("Calls match info list normally", async () => {
    const region = "europe";
    const matchIDs = ["A"];
    const puuid = "PtSa$ap1!2xj0-";

    // jest.spyOn(AppModule, "getMatchInfoList").mockResolvedValue([1, 2, 3]);
    // jest.spyOn(AppModule, "findMoreMatches").mockResolvedValue([1, 2, 3]);

    const result = await matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Calls more match info list", async () => {
    const region = "europe";
    const matchIDs = ["A", "B", "C", "D"];
    const puuid = "PtSa$ap1!2xj0-";

    AppModule.getMatchInfoList.mockReturnValue([1]);
    AppModule.findMoreMatches.mockReturnValue([1, 2, 3]);

    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Calls more match info list and gets nothing", async () => {
    const region = "europe";
    const matchIDs = ["A", "B", "C", "D"];
    const puuid = "PtSa$ap1!2xj0-";

    AppModule.getMatchInfoList.mockReturnValue([1]);
    AppModule.findMoreMatches.mockReturnValue([]);

    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1]);
  });
});
