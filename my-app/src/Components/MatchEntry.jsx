import {getMatchTimeAgo } from "../pages/Dashboard.jsx";

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
        <div className="championImage"></div>
        <div className="championLevel">{playerInfo.champLevel}</div>
      </div>
      <div className="spellsImages"></div>
      <div className="runeImages"></div>
      <div>
        {playerInfo.kills} / {playerInfo.deaths} / {playerInfo.assists}
      </div>
      <div>Vision score: {playerInfo.visionScore}</div>
      <div className="itemImages"></div>
      <div className="otherPlayers"></div>
      <div className="test"></div>
    </div>
  );
}
export default MatchEntry;
