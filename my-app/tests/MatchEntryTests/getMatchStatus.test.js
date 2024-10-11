const matchEntry = require("../../src/components/MatchEntry.jsx");

// function getMatchStatus(playerInfo, gameInfo) {
//     if (gameInfo.gameDuration < 300) return "Remake";
//     return playerInfo.win ? "Victory" : "Defeat";
//   }

describe("getMatchStatus function tests", () => {
  test("Remake with win", () => {
    expect(
      matchEntry.getMatchStatus({ win: true }, { gameDuration: 299 })
    ).toBe("Remake");
  });

  test("Remake with loss", () => {
    expect(
      matchEntry.getMatchStatus({ win: false }, { gameDuration: 200 })
    ).toBe("Remake");
  });

  test("Won match", () => {
    expect(
      matchEntry.getMatchStatus({ win: true }, { gameDuration: 301 })
    ).toBe("Victory");
  });

  test("Lost match", () => {
    expect(
      matchEntry.getMatchStatus({ win: false }, { gameDuration: 400 })
    ).toBe("Defeat");
  });
});
