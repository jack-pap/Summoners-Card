const AppModule = require("@/src/App.jsx");
const {
  apiCall,
  apiGETDatabaseCall,
  apiPOSTDatabaseCall,
} = require("@/src/utils/apiService.js");

jest.mock("@/src/utils/apiService.js", () => ({
  apiGETDatabaseCall: jest.fn(),
  apiCall: jest.fn(),
  apiPOSTDatabaseCall: jest.fn(),
}));

jest.mock("isomorphic-fetch");

describe("matchInfoListDriver function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calls match info list normally", async () => {
    const region = "europe";
    const matchIDs = ["A"];
    const puuid = "PtSa$ap1!2xj0-";

    // Use a recent date (1 month ago) to ensure it passes the eligibility check
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentDate = new Date(oneMonthAgo);
    const year = recentDate.getUTCFullYear();
    const month = String(recentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(recentDate.getUTCDate()).padStart(2, "0");
    const hours = String(recentDate.getUTCHours()).padStart(2, "0");
    const minutes = String(recentDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(recentDate.getUTCSeconds()).padStart(2, "0");
    const sqlFormatDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    apiGETDatabaseCall.mockResolvedValueOnce([]);

    apiCall.mockResolvedValueOnce({
      info: {
        gameEndTimestamp: oneMonthAgo,
        gameDuration: 1800,
        queueId: 420,
        participants: [
          {
            assists: 5,
            champLevel: 15,
            championId: 123,
            deaths: 3,
            item0: 1055,
            item1: 3006,
            item2: 3072,
            item3: 3031,
            item4: 3139,
            item5: 3046,
            item6: 3363,
            kills: 8,
            perks: { primaryStyle: 8000, subStyle: 8100 },
            puuid: "PtSa$ap1!2xj0-",
            riotIdGameName: "PlayerOne",
            riotIdTagline: "EUW1",
            summoner1Id: 4,
            summoner2Id: 14,
            teamPosition: "TOP",
            totalMinionsKilled: 180,
            visionScore: 35,
            win: true,
          },
        ],
      },
    });
    apiPOSTDatabaseCall.mockResolvedValueOnce([]);
    const result = await AppModule.matchInfoListDriver(region, matchIDs, puuid);

    expect(result).toEqual([
      [
        {
          gameDate: recentDate,
          gameDateSQLFormat: sqlFormatDate,
          gameDuration: 1800,
          gameID: "A",
          gameQueueID: 420,
        },
        {
          assists: 5,
          champLevel: 15,
          championId: 123,
          deaths: 3,
          item0: 1055,
          item1: 3006,
          item2: 3072,
          item3: 3031,
          item4: 3139,
          item5: 3046,
          item6: 3363,
          kills: 8,
          perks: { primaryStyle: 8000, subStyle: 8100 },
          riotIdGameName: "PlayerOne",
          riotIdTagline: "EUW1",
          summoner1Id: 4,
          summoner2Id: 14,
          teamPosition: "TOP",
          totalMinionsKilled: 180,
          visionScore: 35,
          win: true,
        },
        [
          {
            assists: 5,
            champLevel: 15,
            championId: 123,
            deaths: 3,
            item0: 1055,
            item1: 3006,
            item2: 3072,
            item3: 3031,
            item4: 3139,
            item5: 3046,
            item6: 3363,
            kills: 8,
            perks: { primaryStyle: 8000, subStyle: 8100 },
            riotIdGameName: "PlayerOne",
            riotIdTagline: "EUW1",
            summoner1Id: 4,
            summoner2Id: 14,
            teamPosition: "TOP",
            totalMinionsKilled: 180,
            visionScore: 35,
            win: true,
          },
        ],
      ],
    ]);
  });
});
