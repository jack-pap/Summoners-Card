const AppModule = require("@/src/App.jsx");
const { apiCall } = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiCall: jest.fn(),
}));

jest.mock("isomorphic-fetch");

describe("getSummonerInfo function tests", () => {
  test("Returns correct summoner info", async () => {
    const server = "EUW";
    const puuid = "1230DJOA1";

    apiCall.mockResolvedValue({
      summonerLevel: 520,
      profileIconId: 200,
    });

    const result = await AppModule.getSummonerInfo(server, puuid);

    expect(result).toEqual([520, 200]);
  });
});
