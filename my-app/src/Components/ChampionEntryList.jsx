import React, { useEffect, useState, memo } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  apiProxyCall,
  apiImageCall,
} from "../../server/controller/apiService.js";

const ChampionEntryList = memo(
  ({ summonerChampionWinrateInfo, championsInfo, queueId }) => {
    const [mostPlayedChampions, setMostPlayedChampions] = useState([]);

    useEffect(() => {
      const processChampions = async () => {
        const champions = Array.from(summonerChampionWinrateInfo.entries())
          .map(([champId, champData]) => ({
            champId,
            winrate: champData.winrateMapping.get(queueId)[0],
          }))
          .sort((a, b) => b.winrate - a.winrate)
          .slice(0, 5);

        const processedChampions = await Promise.all(
          champions.map(async ({ champId }) => {
            const champData = summonerChampionWinrateInfo.get(champId);
            const winrateMapping = champData.winrateMapping.get(queueId);
            const championInfo = championsInfo.get(champId);
            const championImage = await getChampionImage(champId);

            return {
              champId,
              championName: championInfo,
              gamesPlayed: winrateMapping[0],
              winrate: winrateMapping[2],
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
        width="140px"
        height="17px"
        bgColor="#C89B3C"
        baseBgColor="#383838"
        animateOnRender={true}
        borderRadius="3px"
        customLabel={winrate === 0 ? "0%" : undefined}
        labelAlignment={winrate === 0 ? "left" : "right"}
      />
    </div>
    <div className="gamesPlayed">{gamesPlayed} Played</div>
  </div>
);

async function getChampionImage(championId) {
  let championImage = await apiImageCall(
    `http://localhost:3000/assets/Champion_Icons/${championId}.png`
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

function makeComponents(winrateMappingObject, championName, champId) {
  const champComponent = document.createElement("div");
  const gamesPlayed = winrateMappingObject[0];
  const winrate = winrateMappingObject[2];

  champComponent.setAttribute("class", "champEntry");
  champComponent.innerHTML = `
      <div id="champContainer">
      <div class="champImage"></div>
      <div class="champName">${championName}</div>
  
      </div>
      <div class="champWinrate"></div>
      <div class="gamesPlayed">${gamesPlayed} \nPlayed</div>
      `;

  const progressBarComponent = (
    <ProgressBar
      completed={winrate === 0 ? 1 : winrate}
      width="140px"
      height="17px"
      bgColor="#C89B3C"
      baseBgColor="#383838"
      animateOnRender={true}
      borderRadius="3px"
      customLabel={winrate === 0 ? "0%" : undefined}
      labelAlignment={winrate === 0 ? "left" : "right"}
    />
  );

  const assetPromise = getChampionAssets(
    champId,
    ".champImage",
    champComponent
  );

  return {
    components: { champComponent, progressBarComponent },
    promise: assetPromise,
  };
}

async function getChampionAssets(championId, insideClass, parentComponent) {
  var championImage = await apiImageCall(
    `http://localhost:3000/assets/Champion_Icons/${championId}.png`
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

  const img = document.createElement("img");
  img.src = championImage;

  const championImageComponent = parentComponent.querySelector(insideClass);
  championImageComponent.appendChild(img);
}

export default ChampionEntryList;
