const AppModule = require("@/src/App.jsx");

describe("getSummonerWinrates function tests", () => {
  test("Returns correct formatted winrate", async () => {
    const rankedInfo = [
      { rankedWins: 2, rankedLosses: 1, rankedGames: 3 }, // Flex
      { rankedWins: 1, rankedLosses: 1, rankedGames: 2 }, // Solo
    ];
    const matchInfoList = [
      [{ gameDuration: 200, gameQueueID: 440}],
      [{ gameDuration: 600, gameQueueID: 420  }],
      [{ gameDuration: 400, gameQueueID: 440 }],
      [{ gameDuration: 800, gameQueueID: 440 }],
      [{ gameDuration: 800, gameQueueID: 420 }],
    ];

    const result = await AppModule.getSummonerWinrates(
      rankedInfo,
      matchInfoList
    );

    expect(result).toEqual({
      normalWinrate: 1,
      rankedFlexWinrate: 100,
      rankedSoloWinrate: 50,
    });
  });
});
