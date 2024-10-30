const AppModule = require("@/src/App.jsx");
const { apiCall } = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiCall: jest.fn(),
}));

describe("getPUUID function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns puuid", async () => {
    const tagLine = "#EUW";
    const gameName = "Extinct";

    const puuid = "PtSa$ap1!2xj0-";

    apiCall.mockResolvedValue({ puuid: puuid });

    const result = await AppModule.getPUUID(tagLine, gameName);

    expect(result).toEqual(puuid);
  });
});
