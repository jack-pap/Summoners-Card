const AppModule = require("../../src/pages/App.jsx");

describe("matchInfoListDriver function tests", () => {
  test("Calls match info list normally", async () => {
    const region = "europe";
    const matchIDs = ["A"];
    const puuid = "PtSa$ap1!2xj0-";

    jest.spyOn(AppModule, "getMatchInfoList").mockReturnValue([1, 2, 3]);
    jest.spyOn(AppModule, "findMoreMatches").mockReturnValue([1, 2, 3]);

    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Calls more match info list", async () => {
    const region = "europe";
    const matchIDs = ["A", "B", "C", "D"];
    const puuid = "PtSa$ap1!2xj0-";

    jest.spyOn(AppModule, "getMatchInfoList").mockReturnValue([1]);
    jest.spyOn(AppModule, "findMoreMatches").mockReturnValue([1, 2, 3]);

    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Calls more match info list and gets nothing", async () => {
    const region = "europe";
    const matchIDs = ["A", "B", "C", "D"];
    const puuid = "PtSa$ap1!2xj0-";

    jest.spyOn(AppModule, "getMatchInfoList").mockReturnValue([1]);
    jest.spyOn(AppModule, "findMoreMatches").mockReturnValue([]);

    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([1]);
  });
});
