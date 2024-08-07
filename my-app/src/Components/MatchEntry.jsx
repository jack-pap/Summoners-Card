import { getMatchTimeAgo } from "../pages/Dashboard.jsx";
import { getKillParticipation } from "../pages/Dashboard.jsx";

function MatchEntry({ summonerMatchInfo, counter, gameQueues }) {
  const matchData = summonerMatchInfo[counter];
  const gameInfo = matchData[0];
  const playerInfo = matchData[1];

  const containerClassName = playerInfo.win ? "matchEntry" : "matchEntryDefeat";

  return (
    <div className={containerClassName}>
      <div id="matchStatsContainer">
        <div id="win">{playerInfo.win ? "Victory" : "Defeat"}</div>
        <div>{gameQueues.get(gameInfo.gameQueueID)}</div>
        <div>{getMatchTimeAgo(gameInfo.gameDate)}</div>
        <div>
          {Math.trunc(gameInfo.gameDuration / 60)}m {gameInfo.gameDuration % 60}
          s
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
        <div>
          {playerInfo.kills} / {playerInfo.deaths} / {playerInfo.assists}
        </div>
        <div>
          KDA:{" "}
          {playerInfo.deaths == 0
            ? "Perfect"
            : `${
                Math.round(
                  ((playerInfo.kills + playerInfo.assists) /
                    playerInfo.deaths) *
                    100
                ) / 100
              }:1`}
        </div>
        <div>
          Kill participation:{" "}
          {Math.round(getKillParticipation(matchData) * 100)}%
        </div>
        <div>Vision score: {playerInfo.visionScore}</div>
      </div>
      <div className="itemImages"></div>
      <div className="otherPlayers"></div>
      <div className="test"></div>
    </div>
  );
}
export default MatchEntry;
