const matchEntry = require("../../src/components/MatchEntry.jsx");

// export function getMatchStatusName(playerInfo, gameInfo) {
//     if (gameInfo.gameDuration < 300) return "matchEntryRemake";
//     return playerInfo.win ? "matchEntryWin" : "matchEntryDefeat";
//   }

describe("getMatchStatusName function tests", () => {
  test("Remake with win", () => {
    expect(
      matchEntry.getMatchStatusName({ win: true }, { gameDuration: 299 })
    ).toBe("matchEntryRemake");
  });

  test("Remake with loss", () => {
    expect(
      matchEntry.getMatchStatusName({ win: false }, { gameDuration: 200 })
    ).toBe("matchEntryRemake");
  });

  test("Won match", () => {
    expect(
      matchEntry.getMatchStatusName({ win: true }, { gameDuration: 301 })
    ).toBe("matchEntryWin");
  });

  test("Lost match", () => {
    expect(
      matchEntry.getMatchStatusName({ win: false }, { gameDuration: 400 })
    ).toBe("matchEntryDefeat");
  });
});
