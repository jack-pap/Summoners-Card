import React, { useEffect, useState, memo } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  apiProxyCall,
  apiImageCall,
} from "../../server/controller/apiService.js";

const GAME_MODES = {
  NORMAL: 490,
  NORMAL_DRAFT: 400,
  RANKED_SOLO: 420,
  RANKED_FLEX: 440,
}; // Object that stores queue IDs for different game modes

/**
 * @module ChampionEntryList
 */

const ChampionEntryList = memo(
  ({ summonerChampionWinrateInfo, championsInfo, queueId }) => {
    const [mostPlayedChampions, setMostPlayedChampions] = useState([]);

    useEffect(() => {
      const processChampions = async () => {
        var gameType;
        if (queueId === GAME_MODES.RANKED_SOLO) {
          gameType = "rankedSolo";
        } else if (queueId === GAME_MODES.RANKED_FLEX) {
          gameType = "rankedFlex";
        } else {
          return;
        }

        const champions = Array.from(summonerChampionWinrateInfo.entries())
          .map(([champId, champData]) => ({
            champId,
            gamesPlayed: champData[`${gameType}Games`],
            winrate: champData[`${gameType}Winrate`],
          }))
          .sort((a, b) => {
            if (b.gamesPlayed !== a.gamesPlayed) {
              return b.gamesPlayed - a.gamesPlayed; // Sort by games played in descending order
            } else {
              return b.winrate - a.winrate; // If games played are equal sort by winrate
            }
          })
          .slice(0, 7); // Get only 7 champions to display

        const processedChampions = await Promise.all(
          champions.map(async ({ champId }) => {
            const champData = summonerChampionWinrateInfo.get(champId);
            const championInfo = championsInfo.get(champId);
            const championImage = await getChampionImage(champId);

            return {
              champId,
              championName: championInfo,
              gamesPlayed: champData[`${gameType}Games`],
              winrate: champData[`${gameType}Winrate`],
              championImage,
            };
          })
        );

        setMostPlayedChampions(processedChampions);
      };

      processChampions();
    }, [summonerChampionWinrateInfo, championsInfo, queueId]);

    return (
      <div id="championEntryList">
        {mostPlayedChampions.map((champion) => (
          <ChampionEntry key={champion.champId} {...champion} />
        ))}
      </div>
    );
  }
);

const ChampionEntry = ({
  championName,
  gamesPlayed,
  winrate,
  championImage,
}) => (
  <div className="champEntry">
    <div id="champContainer">
      <div className="champImage">
        <img src={championImage} alt={championName} />
      </div>
      <div className="champName">{championName}</div>
    </div>
    <div className="champWinrate">
      <ProgressBar
        completed={winrate === 0 ? 1 : winrate}
        width="125px"
        height="17px"
        bgColor="#C89B3C"
        baseBgColor="#383838"
        animateOnRender={true}
        borderRadius="3px"
        customLabel={winrate === 0 ? "0%" : undefined}
        labelAlignment={"left"}
      />
    </div>
    <div className="gamesPlayed">{gamesPlayed} Played</div>
  </div>
);

/**
 * Retrieves champion image through API call to
 * server to send the static image or to a third party API
 * to retrieve the image 
 * 
 * @param {number} championId 
 * @returns {Promise}
 */
async function getChampionImage(championId) {
  let championImage = await apiImageCall(
    `http://localhost:3001/assets/Champion_Icons/${championId}.png`
  );

  if (!championImage) {
    const championDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
    const championData = await apiProxyCall(championDataURL);
    const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
    const champImageURL = championData.squarePortraitPath;
    const extractedPath = champImageURL
      .replace("/lol-game-data/assets/", "")
      .toLowerCase();
    const finalURL = baseImageURL + extractedPath;
    championImage = await apiImageCall(finalURL);
  }

  return championImage;
}

export default ChampionEntryList;
