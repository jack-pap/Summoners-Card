const {
  apiPOSTDatabaseCall,
  apiGETDatabaseCall,
  apiProxyCall,
} = require("../../api/controller/apiService.js");
const AppModule = require("../../src/pages/App.jsx");

jest.mock("../../api/controller/apiService.js", () => ({
  apiPOSTDatabaseCall: jest.fn(),
  apiGETDatabaseCall: jest.fn(),
  apiProxyCall: jest.fn(),
}));

describe("getMatchInfoList function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Returns correct formatted match list", async () => {
    const matchIDs = ["A"];
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiGETDatabaseCall.mockResolvedValue({});
    apiPOSTDatabaseCall.mockResolvedValue({});
    apiProxyCall.mockResolvedValue({
      info: {
        gameEndTimestamp: 1633072800000,
        gameDuration: 1800,
        queueId: 420,
        participants: [
          {
            puuid: "PtSa$ap1!2xj0-",
            win: true,
            championId: 1,
            assists: 5,
            champLevel: 18,
            kills: 10,
            deaths: 2,
            totalMinionsKilled: 200,
            visionScore: 50,
            summoner1Id: 1,
            summoner2Id: 2,
            perks: { style: 1, subStyle: 2 },
            item0: 1001,
            item1: 1002,
            item2: 1003,
            item3: 1004,
            item4: 1005,
            item5: 1006,
            item6: 1007,
            riotIdGameName: "Player1",
            riotIdTagline: "Tag1",
            teamPosition: "TOP",
          },
          {
            puuid: "player2",
            win: false,
            championId: 2,
            assists: 3,
            champLevel: 15,
            kills: 5,
            deaths: 7,
            totalMinionsKilled: 150,
            visionScore: 30,
            summoner1Id: 3,
            summoner2Id: 4,
            perks: { style: 3, subStyle: 4 },
            item0: 2001,
            item1: 2002,
            item2: 2003,
            item3: 2004,
            item4: 2005,
            item5: 2006,
            item6: 2007,
            riotIdGameName: "Player2",
            riotIdTagline: "Tag2",
            teamPosition: "JUNGLE",
          },
        ],
      },
    });

    const result = await AppModule.getMatchInfoList(matchIDs, region, puuid);

    expect(result).toEqual([
      [
        {
          gameDate: new Date(1633072800000),
          gameDateSQLFormat: "2021-10-01 07:20:00",
          gameDuration: 1800,
          gameID: "A",
          gameQueueID: 420,
        },
        {
          assists: 5,
          champLevel: 18,
          championId: 1,
          deaths: 2,
          item0: 1001,
          item1: 1002,
          item2: 1003,
          item3: 1004,
          item4: 1005,
          item5: 1006,
          item6: 1007,
          kills: 10,
          perks: {
            style: 1,
            subStyle: 2,
          },
          riotIdGameName: "Player1",
          riotIdTagline: "Tag1",
          summoner1Id: 1,
          summoner2Id: 2,
          teamPosition: "TOP",
          totalMinionsKilled: 200,
          visionScore: 50,
          win: true,
        },
        [
          {
            assists: 5,
            champLevel: 18,
            championId: 1,
            deaths: 2,
            item0: 1001,
            item1: 1002,
            item2: 1003,
            item3: 1004,
            item4: 1005,
            item5: 1006,
            item6: 1007,
            kills: 10,
            perks: {
              style: 1,
              subStyle: 2,
            },
            riotIdGameName: "Player1",
            riotIdTagline: "Tag1",
            summoner1Id: 1,
            summoner2Id: 2,
            teamPosition: "TOP",
            totalMinionsKilled: 200,
            visionScore: 50,
            win: true,
          },
          {
            assists: 3,
            champLevel: 15,
            championId: 2,
            deaths: 7,
            item0: 2001,
            item1: 2002,
            item2: 2003,
            item3: 2004,
            item4: 2005,
            item5: 2006,
            item6: 2007,
            kills: 5,
            perks: {
              style: 3,
              subStyle: 4,
            },
            riotIdGameName: "Player2",
            riotIdTagline: "Tag2",
            summoner1Id: 3,
            summoner2Id: 4,
            teamPosition: "JUNGLE",
            totalMinionsKilled: 150,
            visionScore: 30,
            win: false,
          },
        ],
      ],
    ]);
  });
});
