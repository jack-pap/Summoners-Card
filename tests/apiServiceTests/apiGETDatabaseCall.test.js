const apiService = require("../../api/controller/apiService.js");

global.fetch = jest.fn();

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
      `https://summoners-card.onrender.com/${path}/${queryRoute}`
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
      `https://summoners-card.onrender.com/${path}/${queryRoute}`
    );
  });
});
