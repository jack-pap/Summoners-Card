const { apiProxyCall } = require("../../server/controller/apiService.js");
const AppModule = require("../../src/pages/App.jsx");

// export async function matchInfoAPICall(region, matchID) {
//     const matchInfoApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
//     const data = await apiProxyCall(matchInfoApiURL);
//     const contents = {
//       gameID: matchID,
//       gameDate: new Date(data.info.gameEndTimestamp),
//       gameDateSQLFormat: formatDateSQL(data.info.gameEndTimestamp),
//       gameDuration: data.info.gameDuration,
//       gameQueueID: data.info.queueId,
//     };
//     const participants = data.info.participants;

//     return { contents, participants };
//   }

jest.mock("../../server/controller/apiService.js", () => ({
  apiProxyCall: jest.fn(),
}));

describe("matchInfoAPICall function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Returns correct formatted match info", async () => {
    const region = "europe";
    const puuid = "PtSa$ap1!2xj0-";

    apiProxyCall.mockResolvedValue({
      info: {
        gameEndTimestamp: new Date(1633072800000), 
        gameDuration: 1800,
        queueId: 420, 
        participants: [
          { puuid: "player1", win: true, championId: 1 },
          { puuid: "player2", win: false, championId: 2 },
        ],
      },
    });

    const result = await AppModule.matchInfoAPICall(region, puuid);

    expect(result).toEqual({
      contents: {
        gameDate: new Date(1633072800000),
        gameDateSQLFormat: "2021-10-01 07:20:00",
        gameDuration: 1800,
        gameID: "PtSa$ap1!2xj0-",
        gameQueueID: 420,
      },
      participants: [
        { championId: 1, puuid: "player1", win: true },
        { championId: 2, puuid: "player2", win: false },
      ],
    });
  });
});
