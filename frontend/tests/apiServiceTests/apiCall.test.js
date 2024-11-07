require("dotenv").config();
const fetch = require("isomorphic-fetch");
const apiService = require("@/src/utils/apiService.js");
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

jest.mock("isomorphic-fetch");

describe("apiCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ testData: "123" }),
    });

    const URL = "api.riotgames.com";
    const result = await apiService.apiCall(URL);

    expect(result).toStrictEqual({ testData: "123" });
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api?url=${encodeURIComponent(URL)}`
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ testData: "123" }),
    });
    const URL = "api.riotgames.com";

    await expect(apiService.apiCall(URL)).rejects.toThrow(
      "Network response was not ok 500"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api?url=${encodeURIComponent(URL)}`
    );
  });
});
