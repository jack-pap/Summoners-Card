const AppModule = require("../../src/pages/App.jsx");

// function formatDateSQL(timestamp) {
//   const date = new Date(timestamp);

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

const fixedDate = new Date("2024-01-01T00:00:00Z");

describe("getMatchTimeAgo function tests", () => {
  test("Returns formatted date correctly", () => {
    expect(AppModule.formatDateSQL(fixedDate)).toBe("2024-01-01 02:00:00");
  });
});
