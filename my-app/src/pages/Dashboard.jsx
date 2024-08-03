import "../App.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { getSummonerStats, getMatchList, getMatchInfoList } from "./App.jsx";
import { apiCall } from "../controller/apiService.js";
import MatchEntry from "../components/MatchEntry";
import ErrorPage from "./ErrorPage.jsx";
import { useState, useEffect, createElement } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProgressBar from "@ramonak/react-progress-bar";

const API_KEY = import.meta.env.VITE_API_KEY;

const serverOptions = [
  { value: "EUW1", label: "EUW", region: "europe" },
  { value: "EUN1", label: "EUNE", region: "europe" },
  { value: "NA1", label: "NA", region: "americas" },
  { value: "KR", label: "KR", region: "asia" },
  { value: "JP1", label: "JP", region: "asia" },
  { value: "BR1", label: "BR", region: "americas" },
  { value: "LA1", label: "LAN", region: "americas" },
  { value: "LA2", label: "LAS", region: "americas" },
  { value: "OC1", label: "OC", region: "sea" },
  { value: "TR1", label: "TR", region: "europe" },
  { value: "RU", label: "RU", region: "europe" },
  { value: "PH2", label: "PH", region: "asia" },
  { value: "SG2", label: "SG", region: "sea" },
  { value: "TH2", label: "TH", region: "asia" },
  { value: "TW2", label: "TW", region: "asia" },
  { value: "VN2", label: "VN", region: "asia" },
];

const spinnerStyles = {
  position: "absolute",
  top: "43%",
  left: "50%",
  transform: "translateX(-50%)",
};

const serverDictionary = serverOptions.reduce((acc, option) => {
  acc[option.label] = option.value;
  return acc;
}, {});

const gameQueues = await getGameQueues();
var ownUsername;

function Dashboard() {
  const { server, summonerName } = useParams();
  const region = serverOptions.find(
    (option) => server === option.label
  )?.region;
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const [gameName, setGameName] = useState("");
  const [puuid, setPuuid] = useState(null);
  const [summonerInfo, setSummonerInfo] = useState(null);
  const [summonerRankedInfo, setSummonerRankedInfo] = useState(null);
  const [summonerMatchInfo, setSummonerMatchInfo] = useState(null);
  const [summonerWinrateInfo, setSummonerWinrateInfo] = useState(null);
  const [summonerChampionWinrateInfo, setSummonerChampionWinrateInfo] =
    useState(null);
  const [championsInfo, setChampions] = useState(null);

  if (!serverOptions.find((option) => option.label === server)) {
    return <ErrorPage errorMessage={`Invalid server "${server}"`} />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let newGameName, result;

        if (state == null) {
          newGameName = summonerName.split("-")[0].trim();
          result = await getSummonerStats(
            summonerName.split("-")[1],
            newGameName,
            serverDictionary[server],
            region
          );
        } else {
          newGameName = state.gameName;
          result = {
            puuid: state.puuid,
            summonerInfo: state.summonerInfo,
            rankedInfo: state.summonerRankedInfo,
            matchInfoList: state.summonerMatchInfo,
            summonerWinrate: state.summonerWinrateInfo,
            masteryInfo: state.summonerChampionWinrateInfo,
            champions: state.championsInfo,
          };
        }

        setGameName(newGameName);
        setPuuid(result.puuid);
        setSummonerInfo(result.summonerInfo);
        setSummonerRankedInfo(result.rankedInfo);
        setSummonerMatchInfo(result.matchInfoList);
        setSummonerWinrateInfo(result.summonerWinrate);
        setSummonerChampionWinrateInfo(result.masteryInfo);
        setChampions(result.champions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [state, summonerName, server]);

  useEffect(() => {
    if (
      !isLoading &&
      summonerInfo &&
      summonerRankedInfo &&
      summonerMatchInfo &&
      summonerWinrateInfo &&
      summonerChampionWinrateInfo &&
      championsInfo
    ) {
      document.getElementById("footer").style.position = "relative";

      makeSummonerProfile(
        summonerInfo,
        summonerRankedInfo,
        summonerMatchInfo,
        summonerWinrateInfo,
        summonerChampionWinrateInfo,
        championsInfo
      );
      makeChampionWinrate(summonerChampionWinrateInfo, championsInfo, 420);
      makeMatchHistory(summonerMatchInfo);
      document.getElementById("homeBody").style.animation =
        "fade-in 1s forwards";
      console.log(summonerMatchInfo);
    }
  }, [
    isLoading,
    summonerInfo,
    summonerRankedInfo,
    summonerWinrateInfo,
    summonerChampionWinrateInfo,
  ]);

  ownUsername = gameName;
  if (isLoading) {
    return (
      <GridLoader
        color={"#9b792f"}
        loading={isLoading}
        cssOverride={spinnerStyles}
        margin={6}
        size={26}
        speedMultiplier={0.8}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }
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
              fullWidth
            >
              {/* <Button
                  onClick={() => {
                    loadWinrate(
                      summonerRankedInfo[1],
                      summonerWinrateInfo.normalWinrate
                    );
                  }}
                >
                  Normal
                </Button> */}
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
              Winrate
              <CircularProgressbar
                strokeWidth={5}
                value={summonerWinrateInfo.rankedSoloWinrate}
                text={`${summonerWinrateInfo.rankedSoloWinrate}%`}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  textSize: "16px",
                  pathTransitionDuration: 0.4,
                  pathColor: `rgba(221, 156, 15, ${
                    summonerWinrateInfo.rankedSoloWinrate / 100
                  })`,
                  textColor: "#E3E4E4",
                  trailColor: "#65645E",
                })}
              />
            </div>
          </div>
          <div id="summonerBlock">
            <div className="profileGroup">
              <div id="profileIconGroupContainer"></div>
              <div id="name">
                <div id="gameName"> {gameName} </div>
                <div id="server"> #{server} </div>
              </div>
              <div className="summonerChips"></div>
            </div>
            <div className="rankedInfo">
              {summonerRankedInfo[1] !== "Unranked" && (
                <div id="rankedSolo">
                  <div>{`${summonerRankedInfo[1].rankedTier} ${summonerRankedInfo[1].rankedDivision}`}</div>
                  <div>{`${summonerRankedInfo[1].rankedPoints} LP`}</div>
                  <div>{`${summonerWinrateInfo.rankedSoloWinrate}% Winrate`}</div>
                  <div>{`${summonerRankedInfo[1].rankedWins}W ${summonerRankedInfo[1].rankedLosses}L`}</div>
                </div>
              )}
              {summonerRankedInfo[0] !== "Unranked" && (
                <div id="rankedFlex">
                  <div>{`${summonerRankedInfo[0].rankedTier} ${summonerRankedInfo[0].rankedDivision}`}</div>
                  <div>{`${summonerRankedInfo[0].rankedPoints} LP`}</div>
                  <div>{`${summonerWinrateInfo.rankedFlexWinrate}% Winrate`}</div>
                  <div>{`${summonerRankedInfo[0].rankedWins}W ${summonerRankedInfo[0].rankedLosses}L`}</div>
                </div>
              )}
            </div>
          </div>
          <div id="championBlock">
            <ButtonGroup
              id="championButtonGroup"
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
              fullWidth
            >
              makeChampionWinrate
              <Button
                onClick={() => {
                  makeChampionWinrate(
                    summonerChampionWinrateInfo,
                    championsInfo,
                    490
                  );
                }}
              >
                Normal
              </Button>
              <Button
                onClick={() => {
                  makeChampionWinrate(
                    summonerChampionWinrateInfo,
                    championsInfo,
                    420
                  );
                }}
              >
                Solo
              </Button>
              <Button
                onClick={() => {
                  makeChampionWinrate(
                    summonerChampionWinrateInfo,
                    championsInfo,
                    440
                  );
                }}
              >
                Flex
              </Button>
            </ButtonGroup>
            <div id="statNames">
              <div>Name</div>
              <div>Winrate</div>
              <div>Games</div>
            </div>
            <div id="championEntryList"></div>
          </div>
        </div>

        <div id="matchHistoryBlock">
          MATCH HISTORY
          <div id="matchList" />
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
            width="300px"
          >
            <Button
              onClick={() => {
                extendMatchHistory(
                  summonerMatchInfo,
                  region,
                  puuid,
                  setSummonerMatchInfo
                );
              }}
            >
              Load More
            </Button>
          </ButtonGroup>
        </div>
        <div id="friendBlock"></div>
      </div>
    </>
  );
}

async function getGameQueues() {
  const gameQueueURL =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json";
  const gameQueueData = await apiCall(gameQueueURL);
  var queueMapping = new Map();
  for (var queue in gameQueueData) {
    queueMapping.set(gameQueueData[queue].id, gameQueueData[queue].name);
  }
  return queueMapping;
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

//TODO Add maybe loader while loading winrate
// Make it retrieve based on most games not most mastery points
//Filter through champions with most games in that queue
/**
 * Function that displays champion winrate stats
 * for a specific game queue based on champion mastery info
 *
 * @param {Map[number, Object]} summonerChampionWinrateInfo
 * @param {Map[number, string]} championsInfo
 * @param {number} queueId
 */
async function makeChampionWinrate(
  summonerChampionWinrateInfo,
  championsInfo,
  queueId
) {
  const container = document.getElementById("championEntryList");
  container.innerHTML = "";

  var mostPlayedChampions = [];
  for (const [champId, champData] of summonerChampionWinrateInfo.entries()) {
    mostPlayedChampions.push([
      champId,
      champData.winrateMapping.get(queueId)[0],
    ]);
  }
  mostPlayedChampions = mostPlayedChampions
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const components = [];
  const promises = [];

  for (const [champId] of mostPlayedChampions) {
    const result = makeComponents(
      summonerChampionWinrateInfo.get(champId).winrateMapping.get(queueId),
      championsInfo.get(champId),
      champId
    );
    components.push(result.components);
    promises.push(result.promise);
  }

  await Promise.all(promises);

  components.forEach(({ champComponent, progressBarComponent }) => {
    container.appendChild(champComponent);
    const root = createRoot(champComponent.querySelector(".champWinrate"));
    root.render(progressBarComponent);
  });
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
      width="150px"
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

//TODO handle other game modes calculation arena doesnt work currently
async function makeMatchHistory(summonerMatchInfo) {
  const container = document.getElementById("matchList");
  const promises = [];

  for (
    let counter = 0;
    counter < Math.min(20, summonerMatchInfo.length);
    counter++
  ) {
    if (
      summonerMatchInfo[counter][0].gameQueueID.toString() != "420" &&
      summonerMatchInfo[counter][0].gameQueueID.toString() != "440"
    )
      continue;

    const matchComponent = document.createElement("div");
    matchComponent.setAttribute("class", "matchHistoryContainer");
    matchComponent.innerHTML = `
      <div class="entry"></div>
      `;
    container.append(matchComponent);

    const root = createRoot(matchComponent.querySelector(".entry"));

    const entryComponent = (
      <MatchEntry
        summonerMatchInfo={summonerMatchInfo}
        counter={counter}
        gameQueues={gameQueues}
      ></MatchEntry>
    );
    root.render(entryComponent);
    promises.push(getAllAssets(summonerMatchInfo, counter, matchComponent));
    //await createMatchEntry(summonerMatchInfo, container, counter);
  }
  await Promise.all(promises);
}

async function createMatchEntry(summonerMatchInfo, container, counter) {
  const component = document.createElement("div");
  component.setAttribute("class", "matchEntry");
  console.log(gameQueues.get(summonerMatchInfo[counter][0].gameQueueID));
  component.innerHTML = `
    <div id="matchStatsContainer">
    <div id='win'>${
      summonerMatchInfo[counter][1].win ? "Victory" : "Defeat"
    }</div>
    <div>${gameQueues.get(summonerMatchInfo[counter][0].gameQueueID)} </div>
    <div> ${getMatchTimeAgo(summonerMatchInfo[counter][0].gameDate)} </div>
    <div>${Math.trunc(summonerMatchInfo[counter][0].gameDuration / 60)}m ${
    summonerMatchInfo[counter][0].gameDuration % 60
  }s </div>
    </div>
    <div class="championContainer">
    <div class="championImage"></div>
    <div class='championLevel'>${
      summonerMatchInfo[counter][1].champLevel
    } </div>
    </div>
    <div class="spellsImages"></div>
    <div class="runeImages"></div>
    <div> ${summonerMatchInfo[counter][1].kills} / ${
    summonerMatchInfo[counter][1].deaths
  } / ${summonerMatchInfo[counter][1].assists} </div>
        <div> Vision score: ${summonerMatchInfo[counter][1].visionScore} </div>
    <div class="itemImages"></div>
    <div class="otherPlayers"></div>
    <div class="test"></div>
  `;

  if (summonerMatchInfo[counter][1].win == false) {
    component.setAttribute("class", "matchEntryDefeat");
  }

  await getAllAssets(summonerMatchInfo, counter, component);
  container.appendChild(component);
}

//DISABLE IT AND THEN REACTIVATE IT
async function extendMatchHistory(
  summonerMatchInfo,
  region,
  puuid,
  setSummonerMatchInfo
) {
  const container = document.getElementById("matchList");
  const newMatchList = await getMatchList(
    region,
    puuid,
    summonerMatchInfo.length,
    11
  );
  const newMatchInfoList = await getMatchInfoList(region, newMatchList, puuid);

  for (let counter = 0; counter < newMatchInfoList.length - 1; counter++) {
    if (
      newMatchInfoList[counter][0].gameQueueID.toString() != "420" &&
      newMatchInfoList[counter][0].gameQueueID.toString() != "440"
    )
      continue;
    const matchComponent = document.createElement("div");
    matchComponent.setAttribute("class", "matchHistoryContainer");
    matchComponent.innerHTML = `
        <div class="entry"></div>
        `;
    container.append(matchComponent);

    const root = createRoot(matchComponent.querySelector(".entry"));

    const entryComponent = (
      <MatchEntry
        summonerMatchInfo={newMatchInfoList}
        counter={counter}
        gameQueues={gameQueues}
      ></MatchEntry>
    );
    root.render(entryComponent);
    await getAllAssets(newMatchInfoList, counter, matchComponent);
    //await createMatchEntry(newMatchInfoList, container, counter);
  }

  setSummonerMatchInfo(summonerMatchInfo.concat(newMatchInfoList));
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
    summonerMatchInfo[counter][1].perks.styles[1].style,
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

async function makeSummonerProfile(
  summonerInfo,
  summonerRankedInfo,
  summonerMatchInfo,
  summonerWinrateInfo,
  summonerChampionWinrateInfo,
  championsInfo
) {
  makeSummonerBadges(
    summonerInfo,
    summonerRankedInfo,
    summonerMatchInfo,
    summonerWinrateInfo,
    summonerChampionWinrateInfo,
    championsInfo
  );

  await makeProfileIcon(summonerInfo);
  await makeRankedEmblems(summonerRankedInfo);
}

//Check summoner stats for different stats maybe push all of them in a list and render them at once
function makeSummonerBadges(
  summonerInfo,
  summonerRankedInfo,
  summonerMatchInfo,
  summonerWinrateInfo,
  summonerChampionWinrateInfo,
  championsInfo
) {
  const summComponent = document.getElementById("summonerBlock");
  const root = createRoot(summComponent.querySelector(".summonerChips"));
  const allSummonerChips = [];

  allSummonerChips.push(
    makeMillionBadge(championsInfo, summonerChampionWinrateInfo),
    makeMostSkilledBadge(championsInfo, summonerChampionWinrateInfo),
    makeMostPlayedBadge(championsInfo, summonerChampionWinrateInfo),
    //Add one for most played role
    makeStreakBadge(summonerMatchInfo)
  );

  //Check highest winrate champs
  root.render(<>{allSummonerChips}</>);
}

function makeMillionBadge(championsInfo, summonerChampionWinrateInfo) {
  const summonerChips = [];

  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    if (value.championPoints > 1000000) {
      summonerChips.push(
        <Chip
          key={id}
          label={`${championsInfo.get(id)} Million`}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "#c89b3c",
            color: "#c89b3c",
          }}
        />
      );
    }
  }
  return summonerChips;
}

function makeMostSkilledBadge(championsInfo, summonerChampionWinrateInfo) {
  var [bestChampName, bestChampWinrate] = ["null", 0];
  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    const normalWinrate = value.winrateMapping.get(490)[2];
    const soloWinrate = value.winrateMapping.get(420)[2];
    const flexWinrate = value.winrateMapping.get(440)[2];
    const sum = (normalWinrate + soloWinrate + flexWinrate) / 3;
    if (sum > bestChampWinrate) {
      bestChampName = championsInfo.get(id);
      bestChampWinrate = sum;
    }
  }

  return (
    <Chip
      key={bestChampName}
      label={`Skilled ${bestChampName}`}
      variant="outlined"
      sx={{
        borderRadius: "10px",
        borderColor: "#c89b3c",
        color: "#c89b3c",
      }}
    />
  );
}

function makeMostPlayedBadge(championsInfo, summonerChampionWinrateInfo) {
  var [bestChampName, bestChampGames] = ["null", 0];
  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    const normalGames = value.winrateMapping.get(490)[0];
    const soloGames = value.winrateMapping.get(420)[0];
    const flexGames = value.winrateMapping.get(440)[0];
    const sum = normalGames + soloGames + flexGames;
    if (sum > bestChampGames) {
      bestChampName = championsInfo.get(id);
      bestChampGames = sum;
    }
  }

  return (
    <Chip
      key={bestChampName}
      label={`OTP ${bestChampName}`}
      variant="outlined"
      sx={{
        borderRadius: "10px",
        borderColor: "#c89b3c",
        color: "#c89b3c",
      }}
    />
  );
}

function makeStreakBadge(summonerMatchInfo) {
  const streakType = summonerMatchInfo[0][1].win;
  var streakAmount = 0;
  for (let i = 1; i < Math.min(summonerMatchInfo.length, 5); i++) {
    if (summonerMatchInfo[i][1].win != streakType) {
      streakAmount = i;
      break;
    }
  }

  if (streakAmount < 3) return;

  const label = streakType ? `Winning streak` : `Losing streak`;
  // const label = streakType
  //   ? `${streakAmount} wins in a row!`
  //   : `${streakAmount} losses in a row :(`;

  return (
    <Chip
      key={streakType}
      label={label}
      variant="outlined"
      sx={{
        borderRadius: "10px",
        borderColor: "#c89b3c",
        color: "#c89b3c",
      }}
    />
  );
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

async function getChampionAssets(championId, insideClass, parentComponent) {
  const championDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
  const championData = await apiCall(championDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const champImageURL = championData.squarePortraitPath;
  const extractedPath = champImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const championImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.src = championImage;

  const championImageComponent = parentComponent.querySelector(insideClass);
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
  const summonerSpellsData = await apiCall(summonerSpellsURL);
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

async function getSummonerRuneAssets(
  mainRuneID,
  secondaryRuneID,
  divClass,
  component
) {
  await getRuneImage(mainRuneID, component, divClass);
  await getSecondaryRuneImage(secondaryRuneID, component, divClass);
}

async function getRuneImage(runeID, component, divClass) {
  const runeDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`;
  const summonerRuneData = await apiCall(runeDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const runeImageURL = summonerRuneData.find(
    (rune) => rune.id === runeID
  ).iconPath;
  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerRuneImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.setAttribute("id", "primaryRune");
  img.src = summonerRuneImage;

  const summonerRunesImagesComponent = component.querySelector(divClass);
  summonerRunesImagesComponent.appendChild(img);
}

async function getSecondaryRuneImage(runeID, component, divClass) {
  const runeDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`;
  const summonerRuneData = await apiCall(runeDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const runeImageURL = summonerRuneData.styles.find(
    (rune) => rune.id === runeID
  ).iconPath;
  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerRuneImage = await makeImageApiCall(finalURL);
  const img = document.createElement("img");
  img.setAttribute("id", "secondaryRune");
  img.src = summonerRuneImage;

  const summonerRunesImagesComponent = component.querySelector(divClass);
  summonerRunesImagesComponent.appendChild(img);
}

async function getItemAssets(summonerInfo, divClass, component) {
  const itemDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`;
  const summonerItemData = await apiCall(itemDataURL);
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
  var emptyImagesCounter = 0;
  for (var i = 0; i < 7; i++) {
    if (itemIds[i] != 0) {
      var image = await getSummonerItemImage(
        summonerItemData,
        itemIds[i],
        baseImageURL
      );
      const itemsImagesComponent = component.querySelector(divClass);
      itemsImagesComponent.append(image);
    } else emptyImagesCounter++;
  }
  for (var j = 0; j < emptyImagesCounter; j++) {
    var emptyImage = document.createElement("div");
    emptyImage.className = "emptyItem";
    const itemsImagesComponent = component.querySelector(divClass);
    itemsImagesComponent.append(emptyImage);
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

async function getOtherPlayerAssets(participantsInfo, divClass, component) {
  for (const participantInfo of participantsInfo) {
    const playerName = participantInfo.riotIdGameName;
    const playerTagLine = participantInfo.riotIdTagline;

    const playerComponent = document.createElement("div");
    playerComponent.setAttribute("class", "player");

    if (playerName == ownUsername) {
      playerComponent.innerHTML = `
      <div class="playerImage" id="ownImage"></div>
      <a class="ownUsername" href="${playerName}-${playerTagLine}" target="_blank">${playerName}</a> 
      <span class="tooltip-text">${playerName} #${playerTagLine}</span>
  
      `;
    } else {
      playerComponent.innerHTML = `
      <div class="playerImage"></div>
      <a class="playerUsername" href="${playerName}-${playerTagLine}" target="_blank">${playerName}</a>
      <span class="tooltip-text">${playerName} #${playerTagLine}</span>

      `;
    }

    const playerParentComponent = component.querySelector(divClass);
    playerParentComponent.append(playerComponent);

    await getChampionAssets(
      participantInfo.championId,
      ".playerImage",
      playerComponent
    );
  }
}

function loadWinrate(gameQueue, winrateNumber) {
  const gamesElement = document.getElementById("games");
  const winrateElement = document.querySelector(".CircularProgressbar-text");
  const progressbarElement = document.querySelector(
    ".CircularProgressbar-path"
  );

  var totalGames = 0;
  var winratePercentage = 0;

  if (gameQueue.rankedGames != undefined) {
    totalGames = gameQueue.rankedGames;
    winratePercentage = winrateNumber;
  }

  gamesElement.textContent = `${totalGames} Games`;
  winrateElement.textContent = `${winratePercentage}%`;

  progressbarElement.style.strokeDashoffset =
    298.451 * (1 - winratePercentage / 100);
  progressbarElement.style.stroke = `rgba(221, 156, 15, 0.5, ${
    winratePercentage / 100
  })`;
}

export function getMatchTimeAgo(milliseconds) {
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
