const AppModule = require("@/src/App.jsx");
describe("getRemakesNumber function tests", () => {
  test("Returns remakes number for both queues", async () => {
    const rankedInfo = [{ rankedGames: 2 }, { rankedGames: 1 }];
    const matchInfoList = [
      [{ gameDuration: 200 }],
      [{ gameDuration: 100 }],
      [{ gameDuration: 400 }],
    ];

    const result = await AppModule.getRemakesNumber(rankedInfo, matchInfoList);

    expect(result).toEqual(2);
  });

  test("Returns remakes number for undefined queues", async () => {
    const rankedInfo = ["Unranked", "Unranked"];
    const matchInfoList = [];

    const result = await AppModule.getRemakesNumber(rankedInfo, matchInfoList);

    expect(result).toEqual(0);
  });
});
