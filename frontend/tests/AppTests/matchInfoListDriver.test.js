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

    apiGETDatabaseCall.mockResolvedValueOnce({
      matchInfo: {
        contents: "Test Content",
        ownPlayerInfo: { playerId: "123", score: 45 },
        participantsList: [{ playerId: "123" }, { playerId: "456" }],
      },
    });

    apiCall.mockResolvedValueOnce({
      info: {
        gameEndTimestamp: 1633017600000,
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
          gameDate: new Date(1633017600000),
          gameDateSQLFormat: "2021-09-30 16:00:00",
          gameDuration: 1800,
          gameID: "A",
          gameQueueID: 420,
        },
        undefined,
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
