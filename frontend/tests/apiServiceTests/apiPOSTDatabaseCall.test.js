require("dotenv").config();
const fetch = require("isomorphic-fetch");
const apiService = require("@/src/utils/apiService.js");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

jest.mock("isomorphic-fetch");

describe("apiPOSTDatabaseCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: "success" }),
    });

    const path = "summoner";
    const queryRoute = "post";
    const summonerJSONObject = { testKey: "testValue" };

    const result = await apiService.apiPOSTDatabaseCall(
      path,
      queryRoute,
      summonerJSONObject
    );

    expect(result).toStrictEqual({ data: "success" });
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/${path}/${queryRoute}`,
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(summonerJSONObject),
      })
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const path = "summoner";
    const queryRoute = "post";
    const summonerJSONObject = { testKey: "testValue" };

    await expect(
      apiService.apiPOSTDatabaseCall(path, queryRoute, summonerJSONObject)
    ).rejects.toThrow("Network response was not ok 500");

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/${path}/${queryRoute}`,
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(summonerJSONObject),
      })
    );
  });
});
