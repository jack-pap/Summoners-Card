import * as AppModule from "@/src/App.jsx";
const { apiCall, apiGETDatabaseCall } = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn(),
  apiCall: jest.fn(),
}));

jest.mock("isomorphic-fetch");

describe("getMatchList function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns match list from DB", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";
    const matchAmountStart = 0;
    const matchAmount = 20;

    apiCall.mockResolvedValueOnce(["EU1"]);
    apiGETDatabaseCall.mockResolvedValueOnce(["EU1"]);
    apiGETDatabaseCall.mockResolvedValueOnce([
      { matchID: "EU1" },
      { matchID: "EU2" },
      { matchID: "EU3" },
    ]);

    const result = await AppModule.getMatchList(
      region,
      puuid,
      matchAmountStart,
      matchAmount
    );

    expect(result).toEqual(["EU1", "EU2", "EU3"]);
  });

  test("Returns match list from API", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";
    const matchAmountStart = 0;
    const matchAmount = 20;

    apiCall.mockResolvedValueOnce([]);
    apiGETDatabaseCall.mockResolvedValueOnce([]);
    apiCall.mockResolvedValueOnce(["EU1", "EU2"]);

    const result = await AppModule.getMatchList(
      region,
      puuid,
      matchAmountStart,
      matchAmount
    );

    expect(result).toEqual(["EU1", "EU2"]);
  });
});
