import { apiImageCall, apiCall } from "@/src/utils/apiService.js";

const championEntryList = require("../../src/components/ChampionEntryList.jsx");

jest.mock("@/src/utils/apiService.js");

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe("getChampionImage function tests", () => {

  test("API call to community dragon for the champion image", async () => {
    const championId = "201";
    const mockChampionData = {
      squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/201.png",
    };

    apiImageCall.mockResolvedValueOnce(mockChampionData);
    apiCall.mockResolvedValueOnce(mockChampionData);

    const result = await championEntryList.getChampionImage(championId);

    expect(result).toBe(mockChampionData);
    expect(apiImageCall).toHaveBeenCalledWith(
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`
    );
  });
});
