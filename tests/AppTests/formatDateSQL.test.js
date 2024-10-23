const AppModule = require("@/src/App.jsx");
const fixedDate = new Date("2024-01-01T00:00:00Z");

describe("getMatchTimeAgo function tests", () => {
  test("Returns formatted date correctly", () => {
    expect(AppModule.formatDateSQL(fixedDate)).toBe("2024-01-01 00:00:00");
  });
});
