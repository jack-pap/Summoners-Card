const AppModule = require("../../src/pages/App.jsx");
const {
  apiGETDatabaseCall,
  apiProxyCall,
} = require("../../api/controller/apiService.js");

jest.mock("../../api/controller/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn(),
  apiProxyCall: jest.fn(),
}));

describe("getExtendedMatchList function tests", () => {
  test("Extend match list through database", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue([
      "A",
      "B",
      "C",
      "D",
      "E",
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
    apiProxyCall.mockResolvedValue(["1A", "2B"]);

    const result = await AppModule.getExtendedMatchList(
      region,
      puuid,
      "2021-10-01 07:20:00"
    );

    expect(result).toEqual(["A", "B", "C", "D", "E", "1", "2", "3", "4", "5"]);
  });

  test("Extend match list through API call", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue(["A", "B", "C", "D"]);
    apiProxyCall.mockResolvedValue(["1A", "2B", "3B"]);

    const result = await AppModule.getExtendedMatchList(
      region,
      puuid,
      "2021-10-01 07:20:00"
    );

    expect(result).toEqual(["1A", "2B", "3B"]);
  });
});
