const apiService = require("../../api/controller/apiService.js");

global.fetch = jest.fn();

describe("apiProxyNoCacheCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ testData: "123" }),
    });

    const URL = "Google.com";
    const result = await apiService.apiProxyNoCacheCall(URL);

    expect(result).toStrictEqual({ testData: "123" });
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/proxyNoCache?url=${encodeURIComponent(URL)}`
    );
  });

  test("Broken API call", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ testData: "123" }),
    });
    const URL = "Google.com";

    await expect(apiService.apiProxyNoCacheCall(URL)).rejects.toThrow(
      "Network response was not ok 500"
    );
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/proxyNoCache?url=${encodeURIComponent(URL)}`
    );
  });
});
