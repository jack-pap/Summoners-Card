const AppModule = require("../../src/pages/App.jsx");
const { apiProxyCall } = require("../../server/controller/apiService.js");

jest.mock("../../server/controller/apiService.js", () => ({
  apiProxyCall: jest.fn(),
}));

describe("getPUUID function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns puuid", async () => {
    const tagLine = "#EUW";
    const gameName = "Extinct";

    const puuid = "PtSa$ap1!2xj0-";

    apiProxyCall.mockResolvedValue({ puuid: puuid });

    const result = await AppModule.getPUUID(tagLine, gameName);

    expect(result).toEqual(puuid);
  });
});
