import "../App.css";
import Error from "./Error.jsx";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";

const options = [
  { label: "EUW" },
  { label: "EUNE" },
  { label: "NA" },
  { label: "KR" },
  { label: "JP" },
  { label: "BR" },
  { label: "LAN" },
  { label: "LAS" },
  { label: "OC" },
  { label: "TR" },
  { label: "RU" },
  { label: "PH" },
  { label: "SG" },
  { label: "TH" },
  { label: "TW" },
];

const patchVersion = loadVersion().catch((error) => {
  console.error("Error loading version:", error);
});

function Dashboard() {
  const { server, summonerName } = useParams(); // Summoner name and server
  const { state } = useLocation();
  const {
    summonerInfo,
    gameName,
    summonerRankedInfo,
    summonerMatchInfo,
    summonerWinrateInfo,
  } = state; // Summoner info

  const navigate = useNavigate();

  useEffect(() => {
    makeSummonerProfile(summonerInfo, summonerRankedInfo);
    makeMatchHistory(summonerMatchInfo);
    document.getElementById("homeBody").style.animation = "fade-in 1s forwards";
  }, [summonerInfo, summonerRankedInfo, summonerMatchInfo]);

  if (!options.find((option) => option.label === server)) {
    return <Error errorMessage={`Invalid server "${server}"`} />;
  } else {
    return (
      <>
        <div id="homeBody">
          <div id="summonerContainer">
            <div id="winrateBlock">
              <ButtonGroup
                variant="outlined"
                sx={{
                  ".MuiButtonGroup-grouped": {
                    "&:hover": {
                      color: "#C89B3C",
                      backgroundColor: "#262c33",
                      borderColor: "#C89B3C",
                    },
                    color: "#A09B8C",
                    backgroundColor: "262c33",
                    borderColor: "#C89B3C",
                  },
                }}
                size="Large"
                aria-label="Basic button group"
              >
                <Button
                  onClick={() => {
                    loadWinrate(
                      summonerRankedInfo[1],
                      summonerWinrateInfo.rankedSoloWinrate
                    );
                  }}
                >
                  Normal
                </Button>
                <Button
                  onClick={() => {
                    loadWinrate(
                      summonerRankedInfo[1],
                      summonerWinrateInfo.rankedSoloWinrate
                    );
                  }}
                >
                  Solo
                </Button>
                <Button
                  onClick={() => {
                    loadWinrate(
                      summonerRankedInfo[0],
                      summonerWinrateInfo.rankedFlexWinrate
                    );
                  }}
                >
                  Flex
                </Button>
              </ButtonGroup>
              <div id="games">
                {`${summonerRankedInfo[1].rankedGames} Games`}{" "}
              </div>
              <div id="winrate">
                {`${summonerWinrateInfo.rankedSoloWinrate}% Winrate`}{" "}
              </div>
            </div>
            <div id="summonerBlock">
              <div className="profileGroup">
                <div id="profileIconGroupContainer"></div>
                <div id="name">
                  <div id="gameName"> {gameName} </div>
                  <div id="server"> #{server} </div>
                </div>
                <div id="chips">
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip
                    label="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: "#c89b3c",
                      color: "#c89b3c",
                    }}
                  />
                  <Chip label="primary" color="primary" variant="outlined" />
                  <Chip label="primary" color="primary" variant="outlined" />
                  <Chip label="primary" color="primary" variant="outlined" />
                </div>
              </div>
              <div className="rankedInfo">
                <div id="rankedSolo">
                  {summonerRankedInfo[1] === "Unranked"
                    ? "Unranked"
                    : `${summonerRankedInfo[1].rankedTier} ${summonerRankedInfo[1].rankedDivision}`}
                  <div>{`${summonerRankedInfo[1].rankedPoints} LP`}</div>
                  <div>
                    {`${summonerWinrateInfo.rankedSoloWinrate}% Winrate`}{" "}
                  </div>
                  <div>
                    {`${summonerRankedInfo[1].rankedWins}W ${summonerRankedInfo[1].rankedLosses}L`}{" "}
                  </div>
                </div>
                <div id="rankedFlex">
                  {summonerRankedInfo[0] === "Unranked" ? (
                    "Unranked"
                  ) : (
                    <>
                      <div>{`${summonerRankedInfo[0].rankedTier} ${summonerRankedInfo[0].rankedDivision} / ${summonerRankedInfo[0].rankedPoints} LP`}</div>
                      <div>{`${summonerRankedInfo[0].rankedPoints} LP`}</div>
                      <div>{`${summonerWinrateInfo.rankedFlexWinrate}`}</div>
                      <div>
                        {`${summonerRankedInfo[0].rankedWins}W ${summonerRankedInfo[0].rankedLosses}L`}{" "}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div id="championBlock">
              <ButtonGroup
                variant="outlined"
                sx={{
                  ".MuiButtonGroup-grouped": {
                    "&:hover": {
                      color: "#C89B3C",
                      backgroundColor: "#262c33",
                      borderColor: "#C89B3C",
                    },
                    color: "#A09B8C",
                    backgroundColor: "262c33",
                    borderColor: "#C89B3C",
                  },
                }}
                size="Large"
                aria-label="Basic button group"
              >
                <Button>Normal</Button>
                <Button>Solo</Button>
                <Button>Flex</Button>
              </ButtonGroup>
            </div>
          </div>

          <div id="matchHistoryBlock">
            MATCH HISTORY
            <div id="matchList" />
          </div>
          <div id="friendBlock"></div>
        </div>
      </>
    );
  }
}

/**
 * API call to Riot  Data Dragon
 * for retrieving latest patch version number
 *
 * @returns {Promise}
 */
async function loadVersion() {
  const apiURL = "https://ddragon.leagueoflegends.com/api/versions.json";

  return new Promise((resolve, reject) => {
    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          alert(`Cannot retrieve version number`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data[0].split(".")[0] + "." + data[0].split(".")[1]);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * API call to Riot for data
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
function makeApiCall(apiURL) {
  return new Promise((resolve, reject) => {
    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
        console.log(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * API call to imageURL to get image data
 *
 * @param {string} imageURL
 * @returns {Promise}
 */
function makeImageApiCall(imageURL) {
  return new Promise((resolve, reject) => {
    fetch(imageURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Image data failed to request: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function makeMatchHistory(summonerMatchInfo) {
  const container = document.getElementById("matchList");

  for (let counter = 0; counter < 20; counter++) {
    const component = document.createElement("div");
    component.setAttribute("class", "matchEntry");

    component.innerHTML = `
      <div id="matchStatsContainer">
      <div id='win'>${
        summonerMatchInfo[counter][1].win ? "Victory" : "Defeat"
      }</div>
      <div> ${getMatchTimeAgo(summonerMatchInfo[counter][0].gameDate)} </div>
      <div> Duration: ${Math.trunc(
        summonerMatchInfo[counter][0].gameDuration / 60
      )} mins and ${summonerMatchInfo[counter][0].gameDuration % 60} secs </div>
      <div> Queue ID: ${summonerMatchInfo[counter][0].gameQueueID} </div>
      </div>
      <div> ${summonerMatchInfo[counter][1].kills} / ${
      summonerMatchInfo[counter][1].deaths
    } / ${summonerMatchInfo[counter][1].assists} </div>
      <div> Vision score: ${summonerMatchInfo[counter][1].visionScore} </div>
      <div class="championContainer">
      <div class="championImage"></div>
      <div class='championLevel'>${
        summonerMatchInfo[counter][1].champLevel
      } </div>
      </div>
      <div class="spellsImages"></div>
      <div class="runeImages"></div>
      <div class="itemImages"></div>
      <div class="otherPlayers"></div>
      <div class="test"></div>
    `;

    if (summonerMatchInfo[counter][1].win == false) {
      component.setAttribute("class", "matchEntryDefeat");
      component.style.background =
        "linear-gradient(96deg, rgb(231 67 67 / 55%) 0%, rgba(49, 41, 85, 0.5) 110%)";
    }

    await getAllAssets(summonerMatchInfo, counter, component);
    container.appendChild(component);
  }
}

async function getAllAssets(summonerMatchInfo, counter, component) {
  await getChampionAssets(
    summonerMatchInfo[counter][1].championId,
    ".championImage",
    component
  );
  await getSummonerSpellAssets(
    summonerMatchInfo[counter][1].summoner1Id,
    summonerMatchInfo[counter][1].summoner2Id,
    ".spellsImages",
    component
  );
  await getSummonerRuneAssets(
    summonerMatchInfo[counter][1].perks.styles[0].selections[0].perk,
    ".runeImages",
    component
  );
  await getItemAssets(summonerMatchInfo[counter][1], ".itemImages", component);
  await getOtherPlayerAssets(
    summonerMatchInfo[counter][2],
    ".otherPlayers",
    component
  );
}

//TODO make it return the ranked emblems too
async function makeSummonerProfile(summonerInfo, summonerRankedInfo) {
  await makeProfileIcon(summonerInfo);
  await makeRankedEmblems(summonerRankedInfo);
}

async function makeProfileIcon(summonerInfo) {
  const container = document.getElementById("profileIconGroupContainer");

  const component = document.createElement("div");
  component.setAttribute("class", "profileIconGroup");

  component.innerHTML = `
    <div id="summonerIcon"></div>
    <div id="level">${summonerInfo[1]}</div>
    `;

  const imgURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerInfo[2]}.jpg`;
  const profileIconImage = await makeImageApiCall(imgURL);
  const img = document.createElement("img");
  img.src = profileIconImage;

  const profileIconImageComponent = component.querySelector("#summonerIcon");
  profileIconImageComponent.appendChild(img);

  container.appendChild(component);
}

async function makeRankedEmblems(summonerRankedInfo) {
  if (summonerRankedInfo[0] !== "Unranked")
    await makeRankedEmblem(summonerRankedInfo[0], "rankedFlex");
  if (summonerRankedInfo[1] !== "Unranked")
    await makeRankedEmblem(summonerRankedInfo[1], "rankedSolo");
}

async function makeRankedEmblem(summonerRankedInfo, containerName) {
  const container = document.getElementById(containerName);
  const component = document.createElement("div");
  component.setAttribute("class", "rankedEmblem");

  const imgURL = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${summonerRankedInfo.rankedTier.toLowerCase()}.png`;
  const profileIconImage = await makeImageApiCall(imgURL);
  const img = document.createElement("img");
  img.src = profileIconImage;

  component.appendChild(img);
  container.appendChild(component);
}

async function getChampionAssets(championId, divClass, component) {
  const championDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
  const championData = await makeApiCall(championDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const champImageURL = championData.squarePortraitPath;
  const extractedPath = champImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const championImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.src = championImage;

  const championImageComponent = component.querySelector(divClass);
  championImageComponent.appendChild(img);
}

/**
 * Driver method that gets JSON data from a URL
 * and uses it to get summoner image assets
 *
 * @param {string} summoner1Id
 * @param {string} summoner2Id
 * @returns {[HTMLImageElement, HTMLImageElement]}
 */
async function getSummonerSpellAssets(
  summoner1Id,
  summoner2Id,
  divClass,
  component
) {
  const summonerSpellsURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json`;
  const summonerSpellsData = await makeApiCall(summonerSpellsURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const img1 = await getSummonerSpellImage(
    summonerSpellsData,
    summoner1Id,
    baseImageURL
  );
  const img2 = await getSummonerSpellImage(
    summonerSpellsData,
    summoner2Id,
    baseImageURL
  );

  const spellsImagesComponent = component.querySelector(divClass);
  spellsImagesComponent.append(img1, img2);
}

/**
 * Executes API call to get image data
 * and creates image component from it
 *
 * @param {JSON} summonerSpellsData
 * @param {string} spellID
 * @param {string} baseImageURL
 * @returns {HTMLImageElement}
 */
async function getSummonerSpellImage(
  summonerSpellsData,
  spellID,
  baseImageURL
) {
  const summonerSpellImageURL = summonerSpellsData.find(
    (spell) => spell.id === spellID
  ).iconPath;
  const extractedPath = summonerSpellImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerSpellImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.src = summonerSpellImage;
  return img;
}

async function getSummonerRuneAssets(mainRuneID, divClass, component) {
  const runeDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`;
  const summonerRuneData = await makeApiCall(runeDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const runeImageURL = summonerRuneData.find(
    (rune) => rune.id === mainRuneID
  ).iconPath;
  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerRuneImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.src = summonerRuneImage;

  const summonerRunesImagesComponent = component.querySelector(divClass);
  summonerRunesImagesComponent.appendChild(img);
}

async function getItemAssets(summonerInfo, divClass, component) {
  const itemDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`;
  const summonerItemData = await makeApiCall(itemDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  var itemIds = [
    summonerInfo.item0,
    summonerInfo.item1,
    summonerInfo.item2,
    summonerInfo.item3,
    summonerInfo.item4,
    summonerInfo.item5,
    summonerInfo.item6,
  ];
  for (const id of itemIds) {
    if (id != 0) {
      var image = await getSummonerItemImage(
        summonerItemData,
        id,
        baseImageURL
      );
      const itemsImagesComponent = component.querySelector(divClass);
      itemsImagesComponent.append(image);
    }
  }
}

async function getSummonerItemImage(summonerItemData, itemID, baseImageURL) {
  const summonerItemImageURL = summonerItemData.find(
    (item) => item.id === itemID
  ).iconPath;

  const extractedPath = summonerItemImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const summonerItemImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.src = summonerItemImage;
  return img;
}

//CHANGE INNER HTML ORDER WHEN DOING OTHER TEAM
async function getOtherPlayerAssets(participantsInfo, divClass, component) {
  for (let participantInfo of participantsInfo) {
    const playerComponent = document.createElement("div");
    playerComponent.setAttribute("class", "player");
    playerComponent.innerHTML = `
    <div class="playerImage"> </div>
    <div class="playerUsername">${participantInfo.riotIdGameName}</div> 
    `;
    const playerParentComponent = component.querySelector(divClass);
    playerParentComponent.append(playerComponent);

    await getChampionAssets(
      participantInfo.championId,
      ".playerImage",
      playerComponent
    );
  }
}

function loadWinrate(gameQueue, winrateQueue) {
  const container = document.getElementById("winrateBlock");
  const games = document.createElement("div");
  const winrate = document.createElement("div");
  games.setAttribute("id", "games");
  winrate.setAttribute("id", "winrate");

  games.innerHTML = `
    ${gameQueue.rankedGames} Games
  `;
  winrate.innerHTML = `
    ${winrateQueue}% Winrate
  `;

  container.removeChild(document.getElementById("games"));
  container.removeChild(document.getElementById("winrate"));
  container.appendChild(games);
  container.appendChild(winrate);
}

function getMatchTimeAgo(milliseconds) {
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

export default Dashboard;
