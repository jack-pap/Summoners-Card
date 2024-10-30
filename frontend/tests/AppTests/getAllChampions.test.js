const AppModule = require("@/src/App.jsx");
const { apiCall } = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiCall: jest.fn(),
}));

describe("getAllChampions function tests", () => {
  test("Check it returns correct champion mapping", async () => {
    apiCall.mockResolvedValue([{ name: "Braum", id: 201 }]);
    const result = await AppModule.getAllChampions();

    expect(result).toEqual(new Map([[201, "Braum"]]));
  });
});
