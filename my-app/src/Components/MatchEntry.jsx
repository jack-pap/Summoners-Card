import { memo } from "react";

const MatchEntry = memo(function MatchEntry({
  summonerMatchInfo,
  counter,
  gameQueues,
}) {
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
          KDA: <div id="kda">{getKDA(playerInfo)}</div>
        </div>
        <div>
          Kill participation: {getKillParticipation(matchData, playerInfo.win)}%
        </div>
        <div>Vision score: {playerInfo.visionScore}</div>
      </div>
      <div className="itemImages"></div>
      <div className="otherPlayers"></div>
    </div>
  );
});

function getMatchStatusName(playerInfo, gameInfo) {
  if (gameInfo.gameDuration < 300) return "matchEntryRemake";
  return playerInfo.win ? "matchEntryWin" : "matchEntryDefeat";
}

function getMatchStatus(playerInfo, gameInfo) {
  if (gameInfo.gameDuration < 300) return "Remake";
  return playerInfo.win ? "Victory" : "Defeat";
}

function getKillParticipation(matchInfo, winStatus) {
  var totalKills = 0;
  var killParticipation = 0;

  for (const participantInfo of matchInfo[2]) {
    if (participantInfo.win == winStatus) totalKills += participantInfo.kills;
  }

  if ((matchInfo[1].kills + matchInfo[1].assists) / totalKills)
    killParticipation =
      (matchInfo[1].kills + matchInfo[1].assists) / totalKills;

  return Math.round(killParticipation * 100);
}

function getMatchTimeAgo(gameDate) {
  const milliseconds = Date.now() - new Date(gameDate);
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "A day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "An hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  }
}

function getKDA(playerInfo) {
  var KDAstring = "";
  if (playerInfo.deaths == 0) {
    KDAstring = playerInfo.kills === 0 ? "0.00:1" : "Perfect";
  } else {
    KDAstring = `${(
      (playerInfo.kills + playerInfo.assists) /
      playerInfo.deaths
    ).toFixed(2)}:1`;
  }

  return KDAstring;
}
export default MatchEntry;
