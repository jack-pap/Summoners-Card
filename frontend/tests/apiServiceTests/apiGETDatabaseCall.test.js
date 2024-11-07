require("dotenv").config();
const fetch = require("isomorphic-fetch");
const apiService = require("@/src/utils/apiService.js");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

jest.mock("isomorphic-fetch");

describe("apiGETDatabaseCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ testData: "testData" }),
    });

    const path = "summoner";
    const queryRoute = "get";

    const result = await apiService.apiGETDatabaseCall(path, queryRoute);

    expect(result).toStrictEqual({ testData: "testData" });
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/${path}/${queryRoute}`
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const path = "summoner";
    const queryRoute = "get";

    await expect(
      apiService.apiGETDatabaseCall(path, queryRoute)
    ).rejects.toThrow("Network response was not ok 500");

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/${path}/${queryRoute}`
    );
  });
});
