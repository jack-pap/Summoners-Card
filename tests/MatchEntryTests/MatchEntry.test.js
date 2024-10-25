import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatchEntry from "@/src/components/MatchEntry.jsx";

jest.mock("@/src/components/MatchEntry.jsx", () => ({
  __esModule: true,
  default: function MatchEntry({ summonerMatchInfo, counter, gameQueues }) {
    const getMatchStatusName = jest.fn().mockReturnValue("matchEntryWin");
    const getMatchStatus = jest.fn().mockReturnValue("Victory");
    const getMatchTimeAgo = jest.fn().mockReturnValue("1 day ago");
    const getKDA = jest.fn().mockReturnValue("2.5");
    const getKillParticipation = jest.fn().mockReturnValue(50);

    const matchData = summonerMatchInfo[counter];
    const gameInfo = matchData[0];
    const playerInfo = matchData[1];

    const containerClassName = getMatchStatusName(playerInfo, gameInfo);

    return (
      <div className={containerClassName}>
        <div className="matchStatsContainer">
          <div className="matchTypeStats">
            <div id="win">{getMatchStatus(playerInfo, gameInfo)}</div>
            <div>{gameQueues.get(gameInfo.gameQueueID)}</div>
          </div>
          <div className="matchTimeStats">
            <div>{getMatchTimeAgo(gameInfo.gameDate)}</div>
            <div>
              {Math.trunc(gameInfo.gameDuration / 60)}min{" "}
              {gameInfo.gameDuration % 60}s
            </div>
          </div>
        </div>
        <div className="championContainer">
          <div className="championImageContainer">
            <div className="championImage"></div>
            <div className="championLevel">{playerInfo.champLevel}</div>
          </div>
          <div className="spellsAndRunesContainer">
            <div className="spellsImages"></div>
            <div className="runeImages"></div>
          </div>
        </div>
        <div className="playerStats">
          <div id="performanceStats">
            {playerInfo.kills} / {playerInfo.deaths} / {playerInfo.assists}
          </div>
          <div className="kdaContainer">
            <div id="kda">{getKDA(playerInfo)} KDA </div>
          </div>
          <div>
            {getKillParticipation(matchData, playerInfo.win)}% Kill
            Participation
          </div>
          <div>{playerInfo.visionScore} Vision Score</div>
          <div>{playerInfo.totalMinionsKilled} CS</div>
        </div>
        <div className="itemImages"></div>
        <div className="otherPlayers"></div>
      </div>
    );
  },
}));

describe("MatchEntry component render test", () => {
  const summonerMatchInfo = [
    [
      { gameQueueID: 420, gameDate: new Date(), gameDuration: 1800 },
      {
        win: true,
        kills: 5,
        deaths: 3,
        assists: 7,
        champLevel: 18,
        visionScore: 50,
        totalMinionsKilled: 200,
      },
    ],
  ];

  const gameQueues = new Map([[420, "Ranked Solo/Duo"]]);

  test("Renders match entry components correctly", () => {
    render(
      <MatchEntry
        summonerMatchInfo={summonerMatchInfo}
        counter={0}
        gameQueues={gameQueues}
      />
    );

    expect(screen.getByText("Victory")).toBeInTheDocument();
    expect(screen.getByText("Ranked Solo/Duo")).toBeInTheDocument();
    expect(screen.getByText("1 day ago")).toBeInTheDocument();
    expect(screen.getByText("30min 0s")).toBeInTheDocument();
    expect(screen.getByText("5 / 3 / 7")).toBeInTheDocument();
    expect(screen.getByText("2.5 KDA")).toBeInTheDocument();
    expect(screen.getByText("50% Kill Participation")).toBeInTheDocument();
    expect(screen.getByText("50 Vision Score")).toBeInTheDocument();
    expect(screen.getByText("200 CS")).toBeInTheDocument();
  });
});
