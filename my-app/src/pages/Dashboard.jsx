import "../App.css";
import React from "react";
import { memo } from "react";
import { createRoot } from "react-dom/client";
import { getSummonerStats, getMatchList, matchInfoListDriver } from "./App.jsx";
import {
  apiProxyCall,
  apiImageCall,
  apiGETDatabaseCall,
  apiPOSTDatabaseCall,
  apiPUTDatabaseCall,
} from "../../server/controller/apiService.js";
import MatchEntry from "../Components/MatchEntry";
import ErrorPage from "./ErrorPage.jsx";
import { useState, useEffect, createElement } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CircularProgress from "@mui/material/CircularProgress";
import "react-circular-progressbar/dist/styles.css";
import ProgressBar from "@ramonak/react-progress-bar";

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

const Dashboard = memo(function Dashboard() {
  const { server, summonerName } = useParams();
  const region = serverOptions.find(
    (option) => server === option.label
  )?.region;
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isTempLoading, setIsTempLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [gameName, setGameName] = useState("");
  const [puuid, setPuuid] = useState(null);
  const [summonerInfo, setSummonerInfo] = useState(null);
  const [summonerRankedInfo, setSummonerRankedInfo] = useState(null);
  const [summonerMatchInfo, setSummonerMatchInfo] = useState(null);
  const [summonerMatchInfoIndex, setSummonerMatchInfoIndex] = useState(null);
  const [summonerWinrateInfo, setSummonerWinrateInfo] = useState(null);
  const [summonerChampionWinrateInfo, setSummonerChampionWinrateInfo] =
    useState(null);
  const [championsInfo, setChampions] = useState(null);

  if (!serverOptions.find((option) => option.label === server)) {
    return <ErrorPage errorMessage={`Invalid server "${server}"`} />;
  }

  useEffect(() => {
    // apiGETDatabaseCall("match", "allMatches");
    // apiPUTDatabaseCall("match", "deleteMatch", { matchID: "test" });
    // apiGETDatabaseCall("match", "allMatches");
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
            matchInfoIndex: state.summonerMatchInfoIndex,
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
        setSummonerMatchInfoIndex(result.matchInfoIndex);
        setSummonerWinrateInfo(result.summonerWinrate);
        setSummonerChampionWinrateInfo(result.masteryInfo);
        setChampions(result.champions);
        setIsLoading(false);

        const handleScroll = () => {
          if (window.scrollY > 100) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        };
        window.addEventListener("scroll", handleScroll);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [state, summonerName, server]);

  useEffect(() => {
    if (
      !isLoading &&
      summonerInfo &&
      summonerRankedInfo &&
      summonerMatchInfo &&
      summonerMatchInfoIndex &&
      summonerWinrateInfo &&
      summonerChampionWinrateInfo &&
      championsInfo
    ) {
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

      document.getElementById("footer").style.position = "relative";
      document.getElementById("homeBody").style.animation =
        "fade-in 1s forwards";
    }
  }, [isLoading, summonerInfo, summonerRankedInfo, summonerWinrateInfo, summonerChampionWinrateInfo]);

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
            <LoadingButton
              loading={isTempLoading}
              loadingIndicator={
                <CircularProgress sx={{ color: "#d8a841" }} size={35} />
              }
              loadingPosition="center"
              onClick={() => {
                extendMatchHistory(
                  summonerMatchInfo,
                  summonerMatchInfoIndex,
                  region,
                  puuid,
                  setSummonerMatchInfo,
                  setSummonerMatchInfoIndex,
                  setIsTempLoading
                );
              }}
            >
              Load More
            </LoadingButton>
          </ButtonGroup>
        </div>
        <div id="friendBlock"></div>
      </div>
      {isVisible ? (
        <div
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <svg
            id="scrollUpIcon"
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m2.019 11.993c0 5.518 4.48 9.998 9.998 9.998 5.517 0 9.997-4.48 9.997-9.998s-4.48-9.998-9.997-9.998c-5.518 0-9.998 4.48-9.998 
          9.998zm1.5 0c0-4.69 3.808-8.498 8.498-8.498s8.497 3.808 8.497 8.498-3.807 8.498-8.497 8.498-8.498-3.808-8.498-8.498zm4.715-1.528s1.505-1.502
          3.259-3.255c.147-.146.338-.219.53-.219s.384.073.53.219c1.754 1.753 3.259 3.254 3.259 3.254.145.145.217.336.216.527 0 
          .191-.074.383-.22.53-.293.293-.766.294-1.057.004l-1.978-1.978v6.694c0
          .413-.336.75-.75.75s-.75-.337-.75-.75v-6.694l-1.978 1.979c-.29.289-.762.286-1.055-.007-.147-.146-.22-.338-.221-.53-.001-.19.071-.38.215-.524z"
            />
          </svg>{" "}
        </div>
      ) : null}
    </>
  );
});

async function getGameQueues() {
  const gameQueueURL =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json";
  const gameQueueData = await apiProxyCall(gameQueueURL);
  var queueMapping = new Map();
  for (var queue in gameQueueData) {
    queueMapping.set(gameQueueData[queue].id, gameQueueData[queue].name);
  }
  return queueMapping;
}

//TODO Add maybe loader while loading winrate and disable button
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

async function makeMatchHistory(summonerMatchInfo) {
  const container = document.getElementById("matchList");
  const promises = [];

  for (
    let counter = 0;
    counter < Math.min(20, summonerMatchInfo.length);
    counter++
  ) {
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
  }
  await Promise.all(promises);
}

async function extendMatchHistory(
  summonerMatchInfo,
  matchInfoIndex,
  region,
  puuid,
  setSummonerMatchInfo,
  setSummonerMatchInfoIndex,
  setIsTempLoading
) {
  setIsTempLoading(true);

  const container = document.getElementById("matchList");
  const newMatchList = await getMatchList(region, puuid, matchInfoIndex, 11);
  setSummonerMatchInfoIndex(matchInfoIndex + 10);
  const newMatchInfoList = await matchInfoListDriver(
    region,
    newMatchList,
    puuid
  );
  for (
    let counter = 0;
    counter < newMatchInfoList.matchInfoList.length - 1;
    counter++
  ) {
    const matchComponent = document.createElement("div");
    matchComponent.setAttribute("class", "matchHistoryContainer");
    matchComponent.innerHTML = `
        <div class="entry"></div>
        `;
    container.append(matchComponent);

    const root = createRoot(matchComponent.querySelector(".entry"));

    const entryComponent = (
      <MatchEntry
        summonerMatchInfo={newMatchInfoList.matchInfoList}
        counter={counter}
        gameQueues={gameQueues}
      ></MatchEntry>
    );
    root.render(entryComponent);
    await getAllAssets(newMatchInfoList.matchInfoList, counter, matchComponent);
  }

  setIsTempLoading(false);
  setSummonerMatchInfo(
    summonerMatchInfo.concat(newMatchInfoList.matchInfoList)
  );
}

async function getAllAssets(summonerMatchInfo, counter, component) {
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
  await getChampionAssets(
    summonerMatchInfo[counter][1].championId,
    ".championImage",
    component
  );
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
    summonerMatchInfo,
    summonerChampionWinrateInfo,
    championsInfo
  );

  await makeProfileIcon(summonerInfo);
  await makeRankedEmblems(summonerRankedInfo);
}

//Check summoner stats for different stats maybe push all of them in a list and render them at once
function makeSummonerBadges(
  summonerMatchInfo,
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
    makeStreakBadge(summonerMatchInfo)
    //Add one for most played role
  );

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

  if (bestChampName == "null") return;
  return (
    <Chip
      key={`Best ${bestChampName}`}
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
      key={`OTP ${bestChampName}`}
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
  return (
    <Chip
      key={streakType}
      label={streakType ? `Winning streak` : `Losing streak`}
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
  const profileIconImage = await apiImageCall(imgURL);
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

//TODO Add image static request from server
async function makeRankedEmblem(summonerRankedInfo, containerName) {
  var rankedIconImage;
  const container = document.getElementById(containerName);
  const component = document.createElement("div");
  component.setAttribute("class", "rankedEmblem");

  if (
    await checkFileExists(
      `/assets/Ranked_Emblems/emblem-${summonerRankedInfo.rankedTier}.png`
    )
  ) {
    rankedIconImage = `/assets/Ranked_Emblems/emblem-${summonerRankedInfo.rankedTier.toLowerCase()}.png`;
  } else {
    const imgURL = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${summonerRankedInfo.rankedTier.toLowerCase()}.png`;
    rankedIconImage = await apiImageCall(imgURL);
  }

  const img = document.createElement("img");
  img.src = rankedIconImage;

  component.appendChild(img);
  container.appendChild(component);
}

async function getChampionAssets(championId, insideClass, parentComponent) {
  var championImage;

  if (await checkFileExists(`/assets/Champion_Icons/${championId}.png`))
    championImage = `/assets/Champion_Icons/${championId}.png`;
  else {
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
  const summonerSpellsData = await apiProxyCall(summonerSpellsURL);
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

  const summonerSpellImage = await apiImageCall(finalURL);
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
  const summonerRuneData = await apiProxyCall(runeDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const runeImageURL = summonerRuneData.find(
    (rune) => rune.id === runeID
  ).iconPath;
  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerRuneImage = await apiImageCall(finalURL);
  const img = document.createElement("img");
  img.setAttribute("id", "primaryRune");
  img.src = summonerRuneImage;

  const summonerRunesImagesComponent = component.querySelector(divClass);
  summonerRunesImagesComponent.appendChild(img);
}

async function getSecondaryRuneImage(runeID, component, divClass) {
  const runeDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`;
  const summonerRuneData = await apiProxyCall(runeDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const runeImageURL = summonerRuneData.styles.find(
    (rune) => rune.id === runeID
  ).iconPath;
  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;

  const summonerRuneImage = await apiImageCall(finalURL);
  const img = document.createElement("img");
  img.setAttribute("id", "secondaryRune");
  img.src = summonerRuneImage;

  const summonerRunesImagesComponent = component.querySelector(divClass);
  summonerRunesImagesComponent.appendChild(img);
}

async function getItemAssets(summonerInfo, divClass, component) {
  const itemDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`;
  const summonerItemData = await apiProxyCall(itemDataURL);
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
  const summonerItemImage = await apiImageCall(finalURL);
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

async function checkFileExists(url) {
  try {
    const response = await fetch(url);
    return response.ok; // Returns true if the status code is in the range 200-299
  } catch (error) {
    console.error("Error checking file:", error);
    return false;
  }
}

export default Dashboard;
