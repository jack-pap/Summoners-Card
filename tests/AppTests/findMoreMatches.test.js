const {
  findMoreMatches,
  getMatchList,
  getMatchInfoList,
} = require("@/src/App.jsx");

jest.mock("isomorphic-fetch");

jest.mock("@/src/App.jsx", () => ({
  getMatchList: jest.fn(),
  getMatchInfoList: jest.fn(),
  findMoreMatches: jest.requireActual("@/src/App.jsx").findMoreMatches,
}));

describe("findMoreMatches function tests", () => {
  test("Returns matches", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    getMatchList.mockResolvedValue(["A", "B", "C"]);
    getMatchInfoList.mockResolvedValue({
      matchInfoList: [1, 2, 3],
    });

    const result = await findMoreMatches(region, puuid);

    expect(result).toEqual([1, 2, 3]);
  });

  test("Returns null", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    getMatchList.mockResolvedValue(["A", "B", "C"]);

    getMatchInfoList.mockResolvedValue({
      matchInfoList: [],
    });

    const result = await findMoreMatches(region, puuid);

    expect(result).toBeNull();
  });
});
