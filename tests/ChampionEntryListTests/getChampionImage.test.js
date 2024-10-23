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
  test("API call to server that serves the champion image", async () => {
    const championId = "201";
    const mockImage = "mockImageDataBlob201";

    apiImageCall.mockResolvedValueOnce(mockImage);

    const result = await championEntryList.getChampionImage(championId);

    expect(result).toBe(mockImage);
    expect(apiImageCall).toHaveBeenCalledWith(
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`
    );
  });

  test("API call to community dragon for the champion image", async () => {
    const championId = "201";
    const mockChampionData = {
      squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/201.png",
    };
    const mockImage = "mockImageDataBlob201";

    apiImageCall.mockResolvedValueOnce(null);
    apiCall.mockResolvedValueOnce(mockChampionData);
    apiImageCall.mockResolvedValueOnce(mockImage);

    const result = await championEntryList.getChampionImage(championId);

    expect(result).toBe(mockImage);
    expect(apiImageCall).toHaveBeenCalledWith(
      `https://summoners-card.onrender.com/assets/Champion_Icons/${championId}.png`
    );
    expect(apiImageCall).toHaveBeenCalledWith(
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`
    );
  });
});
