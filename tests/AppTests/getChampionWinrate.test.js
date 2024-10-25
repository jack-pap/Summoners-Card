const AppModule = require("@/src/App.jsx");

describe("getChampionWinrate function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calls getChampionWinrate normally", async () => {
    const masteryInfo = "europe";
    const getMatchInfoList = ["A"];
    const rankedInfo = "PtSa$ap1!2xj0-";

    const result = await AppModule.getChampionWinrate(region, matchIDs, puuid);
    
    expect(result).toEqual([1, 2, 3]);
  });
});
