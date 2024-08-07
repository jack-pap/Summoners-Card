/* eslint-disable no-unused-vars */
import "../App.css";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../controller/apiService.js";
import GridLoader from "react-spinners/GridLoader";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ErrorPage from "./ErrorPage";

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

const GAME_MODES = {
  NORMAL: 490,
  NORMAL_DRAFT: 400,
  RANKED_SOLO: 420,
  RANKED_FLEX: 440,
}; // Object that stores queue Ids for different game modes

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "40px",
    width: "100px",
    borderRadius: "9px",
    border: "1px solid transparent",
    boxShadow: "none",
    fontSize: "1em",
    fontWeight: "500",
    fontFamily: "Spiegel",
    color: "#A09B8C",
    backgroundColor: "#1a1a1a",
    cursor: "pointer",
    transition: "border-color 0.25s, transform 300ms ease-in-out",
    outline: state.isFocused ? "1px solid #C89B3C" : "none",
    "&:hover": {
      borderColor: "#C89B3C",
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#A09B8C",
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 4,
    backgroundColor: state.isSelected ? "#C89B3C" : "transparent",
    color: state.isSelected ? "white" : "#A09B8C",
    "&:hover": {
      backgroundColor: "#C89B3C",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a1a1a", // Background color of the dropdown menu
  }),
  indicatorSeparator: () => ({ display: "none" }), // Hide the default separator
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuIsOpen ? "#A09B8C" : "#A09B8C",
    transition: "transform 0.25s",
    transform: state.selectProps.menuIsOpen
      ? "rotate(-180deg)"
      : "rotate(0deg)",
    "&:hover": {
      color: "#A09B8C",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    marginTop: 30,
  }),
};

const spinnerStyles = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translateX(-50%)",
};

function App() {
  const [selectedServer, setSelectedServer] = useState(serverOptions[0]); // Initialize with the default value
  const [patchVersion, setPatchVersion] = useState("    "); // Initialize patch version
  const [isLoading, setIsLoading] = useState(false); // Spinner state for when data is loading
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (server) => {
    setSelectedServer(server);
    console.log(`Option selected:`, server);
  };

  useEffect(() => {
    document.getElementById("homeBody").style.animation = "fade-in 1s forwards"; // Play fade in animation
    loadVersion()
      .then((version) => {
        setPatchVersion(
          version[0].split(".")[0] + "." + version[0].split(".")[1]
        ); // Update the patch version state
      })
      .catch((error) => {
        console.error("Error loading version:", error);
      });
  }, []);

  return (
    <>
      <div id="homeBody">
        <h1>
          SUMMONERS <br /> CARD
        </h1>
        <div className="fieldBox">
          <input
            type="text"
            className="summonerField"
            id="summonerName"
            placeholder={`Enter summoner name: Gamename + #${selectedServer.label}`}
            autoFocus={true}
            onKeyDown={(event) => {
              if (event.key == "Enter")
                getInput(
                  selectedServer.value,
                  selectedServer.label,
                  selectedServer.region,
                  navigate,
                  setIsLoading,
                  setOpen
                );
            }}
          />
          <div className="tooltip">
            <a
              id="link"
              href="https://support-leagueoflegends.riotgames.com/hc/en-us/articles/360041788533-Riot-ID-FAQ#:~:text=If%20your%20Riot%20ID%20is,not%20have%20to%20be%20unique."
              target="_blank"
              rel="noreferrer"
            >
              <svg
                id="infoIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 
                  1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 
                  1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 
                  2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 
                  1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"
                />
              </svg>{" "}
            </a>
            <span className="tooltip-text">Click for more help</span>
          </div>
        </div>
        <div className="box">
          <Select
            id="serverList"
            options={serverOptions}
            onChange={handleChange}
            styles={customStyles}
            theme={"primary50"}
            defaultValue={serverOptions[0]}
            isSearchable={false}
            menuPortalTarget={document.body}
          />
          <button
            className="customButton"
            id="search"
            onClick={() =>
              getInput(
                selectedServer.value,
                selectedServer.label,
                selectedServer.region,
                navigate,
                setIsLoading,
                setOpen
              )
            }
          >
            {" "}
            Search{" "}
          </button>
        </div>
        <div id="patcher">Patch Version: {patchVersion}</div>
        <Box sx={{ width: "100%" }}>
          <Collapse in={open}>
            <Alert
              id="errorPopup"
              variant="outlined"
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 2,
                color: "#F4C7C7",
                backgroundColor: "#160B0B",
                borderColor: "#160B0B",
                ".MuiAlert-message": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          </Collapse>
        </Box>
      </div>
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
    </>
  );
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
          throw new ErrorPage(`Network response was not ok ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getAllChampions() {
  const championApiURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json`;
  const data = await apiCall(championApiURL);
  var championMapping = new Map();
  for (const champion of data) {
    championMapping.set(champion.id, champion.name);
  }
  return championMapping;
}

/**
 * Gathers input from field, executes Riot API call
 * based on input to gather user account data
 *
 * @param {string} serverValue
 */
async function getInput(
  serverValue,
  serverLabel,
  regionValue,
  navigate,
  setIsLoading,
  setOpen
) {
  const summonerName = document.getElementById("summonerName").value;
  const gameName = summonerName.split("#")[0].trim();
  const tagLine = summonerName.split("#")[1];
  const server = serverValue;
  const region = regionValue;

  // Checks for valid input and initiates API calls for data
  if (summonerName.match(/\s*#[^\s]*\S+$/)) {
    try {
      document.getElementById("homeBody").style.animation =
        "fade-out 0.3s forwards";
      document.getElementById("homeBody").style.pointerEvents = "none";
      setIsLoading(true);

      const {
        puuid,
        summonerInfo,
        rankedInfo,
        matchInfoList,
        matchInfoIndex,
        summonerWinrate,
        masteryInfo,
        champions,
      } = await getSummonerStats(tagLine, gameName, server, region); // Returns all relevant info for the player, games played etc.

      navigate(`/player/${serverLabel}/${summonerName.replace("#", "-")}`, {
        state: {
          serverLabel,
          puuid: puuid,
          gameName: gameName,
          summonerInfo: summonerInfo,
          summonerRankedInfo: rankedInfo,
          summonerMatchInfo: matchInfoList,
          summonerMatchInfoIndex: matchInfoIndex,
          summonerWinrateInfo: summonerWinrate,
          summonerChampionWinrateInfo: masteryInfo,
          championsInfo: champions,
        },
      });
    } catch (error) {
      // Stops spinner and reverts back to homepage while showing an error
      console.log(error);
      document.getElementById("homeBody").style.animation = "fade-in 0.5s";
      document.getElementById("homeBody").style.pointerEvents = "all";
      setIsLoading(false);
      document.querySelector(
        ".MuiAlert-message"
      ).textContent = `Trouble finding summoner ${gameName}`;
      setOpen(true);
      return;
    }
  } else {
    document.querySelector(".MuiAlert-message").textContent =
      "Please ensure that the summoner name has no whitespace or special symbols";
    setOpen(true);
    return;
  }
}

/**
 * Driver method that initiates all API calls
 *
 * @param {string} tagLine
 * @param {string} gameName
 * @param {string} server
 * @param {string} region
 *
 * @returns {JSON}
 */
export async function getSummonerStats(tagLine, gameName, server, region) {
  try {
    const puuid = await getPUUID(tagLine, gameName); // puuid identifier for summoner
    const summonerInfo = await getSummonerInfo(server, puuid); // Array that includes summoner ID, summoner level and profile picture
    const masteryInfo = await getMasteryInfo(server, puuid); // Array consisting of champion arrays that includes champion ID, level of mastery, and mastery points
    const matchList = await getMatchList(region, puuid, 0, 40); // Array constisting of match IDs
    const matchInfoListResult = await getMatchInfoList(
      region,
      matchList,
      puuid
    );
    const matchInfoList = matchInfoListResult.matchInfoList; // Returns array that contains match information for all matches in a list
    const matchInfoIndex = matchInfoListResult.lastIndex;
    const rankedInfo = await getRankedInfo(server, summonerInfo[0]); // Array consisting of ranked info arrays that include queueType, tier, rank, points, wins, losses
    const summonerWinrate = getSummonerWinrates(rankedInfo); // Returns JSON object for all game mode winrates
    await getChampionWinrate(masteryInfo, matchInfoList); // Calculates for every champion their respective game mode winrates
    const champions = await getAllChampions();
    return {
      puuid,
      summonerInfo,
      rankedInfo,
      matchInfoList,
      matchInfoIndex,
      summonerWinrate,
      masteryInfo,
      champions,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * API call to Riot for data
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
export function makeApiCall(apiURL) {
  // Return a Promise to allow the use of async/await
  return new Promise((resolve, reject) => {
    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new ErrorPage(`Network response was not ok ${response.status}`);
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
 * API call to retrieve PUUID identifier
 * based on username
 *
 * @param {string} tagLine
 * @param {string} gameName
 * @returns {string}
 */
async function getPUUID(tagLine, gameName) {
  const puuidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;
  const data = await apiCall(puuidApiURL);
  return data.puuid;
}

/**
 * API call to retrieve summoner info (summoner id,summoner level, profile icon ID)
 * based on puuid and server
 *
 * @param {string} server
 * @param {string} puuid
 * @returns {[string]}
 */
async function getSummonerInfo(server, puuid) {
  const summonerInfoApiURL = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await apiCall(summonerInfoApiURL);
  return [data.id, data.summonerLevel, data.profileIconId];
}

//TODO change structure so it dynamically adds queues instead of manually from constants and use JSON objects instead of arrays
/**
 * API call to retrieve arrays of summoner mastery info on all champions played
 * (champion ID, champion mastery level, champion mastery points)
 * based on puuid and server
 *
 * @param {string} server
 * @param {string} puuid
 * @returns {Promise<Array<Object>>} An array of objects representing champion mastery information.
 * Each object includes:
 *   - championId {number} - The ID of the champion.
 *   - championPoints {number} - The champion mastery points.
 *   - championLevel {number} - The champion mastery level.
 *   - normalWinrate {Map} - Map with key 490 for normal game win rate (e.g., Map([NORMAL_GAME_MODE, [0, 0]])).
 *   - rankedSoloWinrate {Map} - Map with key 420 for ranked solo game win rate (e.g., Map([RANKED_SOLO_GAME_MODE, [0, 0]])).
 *   - rankedFlexWinrate {Map} - Map with key 440 for ranked flex game win rate (e.g., Map([RANKED_FLEX_GAME_MODE, [0, 0]])).
 */
async function getMasteryInfo(server, puuid) {
  const masteryApiURL = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await apiCall(masteryApiURL);
  var championStatsMapping = new Map(); // Mapping of championId to JSON stats
  for (const champion of data) {
    var champStats = {
      championPoints: champion.championPoints,
      championLevel: champion.championLevel,
      winrateMapping: new Map([
        [GAME_MODES.NORMAL, [0, 0, 0]],
        [GAME_MODES.RANKED_SOLO, [0, 0, 0]],
        [GAME_MODES.RANKED_FLEX, [0, 0, 0]],
      ]), // Mapping between game modes and their winrates data -> [games played, wins, winrate]
    };
    championStatsMapping.set(champion.championId, champStats);
  }
  return championStatsMapping;
}

//TODO GET NORMAL WINRATES
function getSummonerWinrates(rankedInfo) {
  const winrates = {
    normalWinrate: 1, //TODO FIX THIS TO GET NORMAL WINRATE
    rankedFlexWinrate:
      Math.round(
        (rankedInfo[0].rankedWins /
          (rankedInfo[0].rankedWins + rankedInfo[0].rankedLosses)) *
          100 *
          10
      ) / 10,
    rankedSoloWinrate:
      Math.round(
        (rankedInfo[1].rankedWins /
          (rankedInfo[1].rankedWins + rankedInfo[1].rankedLosses)) *
          100 *
          10
      ) / 10,
  };
  return winrates;
}

/**
 * Method that iterates through matches
 * and calculates champion winrate values
 *
 * @param {Map} masteryInfo
 * @param {[string]} matchInfoList
 * @returns {[string,[string]]}
 */
function getChampionWinrate(masteryInfo, matchInfoList) {
  for (const matchInfo of matchInfoList) {
    const queueId = matchInfo[0].gameQueueID; // What type of game was played
    for (const mode of Object.values(GAME_MODES)) {
      if (queueId == mode) {
        var champInfo = masteryInfo.get(matchInfo[1].championId); // What champion was played
        if (champInfo.winrateMapping.get(queueId)) {
          champInfo.winrateMapping.get(queueId)[0] += 1; // Increment game count on existing queue
          if (matchInfo[1].win == true)
            champInfo.winrateMapping.get(queueId)[1] += 1; // If they won increment wins
        }
      }
    }
  }
  for (const champInfo of masteryInfo.values()) {
    for (const [queueId, winrateData] of champInfo.winrateMapping.entries()) {
      const gamesPlayed = winrateData[0];
      const wins = winrateData[1];
      var winrate = winrateData[2];

      if (gamesPlayed > 0) winrate = Math.ceil((wins / gamesPlayed) * 100); // W/R percentage rounded up to nearest second decimal

      champInfo.winrateMapping.set(queueId, [gamesPlayed, wins, winrate]); // Update the winrate value in the map
    }
  }
}

/**
 * API call to retrieve an array of
 * summoner match IDs based on puuid
 *
 * @param {string} puuid
 * @returns {Promise<Array<Object>>}
 */
export async function getMatchList(
  region,
  puuid,
  matchAmountStart,
  matchAmount
) {
  const matchListApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${matchAmountStart}&count=${matchAmount}&api_key=${API_KEY}`;
  const data = await apiCall(matchListApiURL);
  var matchList = [];
  for (const match of data) {
    matchList.push(match);
  }
  return matchList;
}

/**
 * API call to retrieve all match information from a matchID
 *
 * @param {[string]} matchIDs
 * @param {string} puuid
 * @returns {[[string],[string], [string]]}
 */
export async function getMatchInfoList(region, matchIDs, puuid) {
  var { matchInfoList, lastIndex } = await getMatchInfo(
    matchIDs,
    region,
    puuid
  );

  if (matchInfoList.length < matchIDs.length) {
    const moreMatchesObject = await findMoreMatches(region, puuid, matchIDs);
    if (moreMatchesObject.matches) {
      matchInfoList = matchInfoList.concat(moreMatchesObject.matches);
      lastIndex = moreMatchesObject.index;
    }
  }

  return { matchInfoList, lastIndex };
}

async function getMatchInfo(matchIDs, region, puuid) {
  var matchInfoList = [];
  var lastIndex = -1;
  for (const matchID of matchIDs) {
    const matchInfoApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
    const data = await apiCall(matchInfoApiURL);
    const contents = {
      gameDate: Date.now() - new Date(data.info.gameEndTimestamp),
      gameDuration: data.info.gameDuration,
      gameQueueID: data.info.queueId,
    };
    const participants = data.info.participants;
    const participantsList = [];
    var ownPlayerInfo = null;

    if (!Object.values(GAME_MODES).includes(contents.gameQueueID)) continue;

    for (const playerInfo of participants) {
      const pickedPlayerInfo = (({
        win,
        championId,
        champLevel,
        kills,
        deaths,
        assists,
        visionScore,
        summoner1Id,
        summoner2Id,
        perks,
        item0,
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
        riotIdGameName,
        riotIdTagline,
      }) => ({
        win,
        championId,
        champLevel,
        kills,
        deaths,
        assists,
        visionScore,
        summoner1Id,
        summoner2Id,
        perks,
        item0,
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
        riotIdGameName,
        riotIdTagline,
      }))(playerInfo);

      participantsList.push(pickedPlayerInfo);
      if (playerInfo.puuid == puuid) ownPlayerInfo = pickedPlayerInfo;
    }
    matchInfoList.push([contents, ownPlayerInfo, participantsList]);
    lastIndex = matchIDs.length;
  }
  return { matchInfoList, lastIndex };
}

/**
 * Attempts to find more ranked/normal games to fill
 * the desired matchIDs length. If the length cannot be
 * filled it means no games can be found and it returns
 *
 * @param {string} region
 * @param {string} puuid
 * @param {[string]} matchIDs
 * @param {[[string],[string], [string]]} matchInfoList
 * @returns {Promise<Array<Object>,Object>}
 */
async function findMoreMatches(region, puuid, matchIDs) {
  const newMatchIDS = await getMatchList(
    region,
    puuid,
    matchIDs.length,
    matchIDs.length
  );
  const newMatchInfoList = await getMatchInfo(newMatchIDS, region, puuid);
  if (newMatchInfoList.length == 0)
    return {
      matches: null,
      index: -1,
    };
  return {
    matches: newMatchInfoList.matchInfoList,
    index: matchIDs.length + newMatchIDS.length,
  };
}

/**
 * API call to retrieve summoner ranked queue info
 * (wins, losses, rank, tier)
 * based on id and server
 *
 * @param {string} server
 * @param {string} id
 * @returns {[[string]]}
 */
async function getRankedInfo(server, id) {
  const rankedApiURL = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`;
  const data = await apiCall(rankedApiURL);
  var rankedSoloInfo = null;
  var rankedFlexInfo = null;
  for (let i = 0; i < data.length; i++) {
    const currentRankedInfo = {
      queueType: data[i].queueType, // Solo/duo or Flex queue (RANKED_SOLO_5x5, RANKED_FLEX_SR)
      rankedTier: data[i].tier, // Iron - Challenger
      rankedDivision: data[i].rank, // Roman numerical value IV - I
      rankedPoints: data[i].leaguePoints, // Points out of 100 in current rank
      rankedGames: data[i].wins + data[i].losses, // Total number of games played this season
      rankedWins: data[i].wins, // Wins in current ranked season
      rankedLosses: data[i].losses, // Losses in current ranked season
    };

    if (currentRankedInfo.queueType === "RANKED_SOLO_5x5") {
      rankedSoloInfo = currentRankedInfo;
    } else if (currentRankedInfo.queueType === "RANKED_FLEX_SR") {
      rankedFlexInfo = currentRankedInfo;
    }
  }
  return [rankedFlexInfo || "Unranked", rankedSoloInfo || "Unranked"];
}

export default App;
