const AppModule = require("../../src/pages/App.jsx");

// export async function findMoreMatches(region, puuid) {
//     const newMatchIDS = await getMatchList(region, puuid, 0, 20);
//     const newMatchInfoList = await getMatchInfoList(newMatchIDS, region, puuid);
//     return newMatchInfoList.length == 0 ? null : newMatchInfoList.matchInfoList;
//   }

describe("findMoreMatches function tests", () => {
  test("Returns matches", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    jest.spyOn(AppModule, 'getMatchList').mockReturnValue(["A","B","C"]);
    jest.spyOn(AppModule, 'getMatchInfoList').mockReturnValue({ matchInfoList: [1, 2, 3] });

    const result = await AppModule.findMoreMatches(region, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Returns null", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    jest.spyOn(AppModule, 'getMatchList').mockReturnValue(["A","B","C"]);
    jest.spyOn(AppModule, 'getMatchInfoList').mockReturnValue({ matchInfoList: [] });

    const result = await AppModule.findMoreMatches(region, puuid);

    expect(result).toEqual([]);
  });
});
