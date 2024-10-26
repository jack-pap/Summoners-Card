const fetch = require("isomorphic-fetch");
const apiService = require("@/src/utils/apiService.js");
jest.mock("isomorphic-fetch");

describe("apiImageCall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Working API call", async () => {
    const blob = new Blob([], { type: "image/png" });
    const URL = "https://raw.communitydragon.org/image.png";

    fetch.mockResolvedValue({
      ok: true,
      status: 500,
      blob: async () => blob,
    });

    global.URL = {
      createObjectURL: jest.fn(() => `blob:${blob.size}`),
    };

    const result = await apiService.apiImageCall(URL);

    expect(result).toStrictEqual(`blob:${blob.size}`);
    expect(fetch).toHaveBeenCalledWith(URL);
  });
});
