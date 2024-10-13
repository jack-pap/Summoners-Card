const AppModule = require("../../src/pages/App.jsx");
const { apiProxyCall } = require("../../server/controller/apiService.js");

jest.mock("../../server/controller/apiService.js", () => ({
  apiProxyCall: jest.fn(),
}));

describe("getAllChampions function tests", () => {
  test("Check it returns correct champion mapping", async () => {
    apiProxyCall.mockResolvedValue([{ name: "Braum", id: 201 }]);
    const result = await AppModule.getAllChampions();

    expect(result).toEqual(new Map([[201, "Braum"]]));
  });
});
