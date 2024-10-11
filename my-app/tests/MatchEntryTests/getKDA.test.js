const matchEntry = require("../../src/components/MatchEntry.jsx");

// function getKDA(playerInfo) {
//     var KDAstring = "";
//     if (playerInfo.deaths == 0) {
//       KDAstring = playerInfo.kills === 0 ? "0.00:1" : "Perfect";
//     } else {
//       KDAstring = `${(
//         (playerInfo.kills + playerInfo.assists) /
//         playerInfo.deaths
//       ).toFixed(2)}:1`;
//     }

//     return KDAstring;
//   }

describe("getKDA function tests", () => {
  test("Zero stats", () => {
    expect(matchEntry.getKDA({ kills: 0, deaths: 0, assists: 0 })).toBe(
      "0.00:1"
    );
  });

  test("Perfect KDA", () => {
    expect(matchEntry.getKDA({ kills: 10, deaths: 0, assists: 0 })).toBe(
      "Perfect"
    );
  });

  test("Normal KDA", () => {
    expect(matchEntry.getKDA({ kills: 5, deaths: 2, assists: 2 })).toBe(
      "3.50:1"
    );
  });

  test("Negative KDA", () => {
    expect(matchEntry.getKDA({ kills: 5, deaths: 14, assists: 2 })).toBe(
      "0.50:1"
    );
  });

  test("No contribution KDA", () => {
    expect(matchEntry.getKDA({ kills: 0, deaths: 10, assists: 0 })).toBe(
      "0.00:1"
    );
  });
});
