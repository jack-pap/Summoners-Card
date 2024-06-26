/* eslint-disable no-unused-vars */
import "../App.css";
import jsonKeyData from "../../../config.json";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const API_KEY = jsonKeyData.API_KEY; // Bound to change keep updating frequently

const serverOptions = [
  { value: "EUW1", label: "EUW" },
  { value: "EUN1", label: "EUNE" },
  { value: "NA1", label: "NA" },
  { value: "KR", label: "KR" },
  { value: "JP1", label: "JP" },
  { value: "BR1", label: "BR" },
  { value: "LA1", label: "LAN" },
  { value: "LA2", label: "LAS" },
  { value: "OC1", label: "OC" },
  { value: "TR1", label: "TR" },
  { value: "RU", label: "RU" },
  { value: "PH2", label: "PH" },
  { value: "SG2", label: "SG" },
  { value: "TH2", label: "TH" },
  { value: "TW2", label: "TW" },
  { value: "VN2", label: "VN" },
];


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
    outline: state.isFocused ? "1px solid #C89B3C" : "none", // Outline color on focus
    "&:hover": {
      borderColor: "#C89B3C", // Outline color on hover
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#A09B8C", // Set your desired color here
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 4,
    backgroundColor: state.isSelected ? "#C89B3C" : "transparent",
    color: state.isSelected ? "white" : "#A09B8C",
    "&:hover": {
      backgroundColor: "#C89B3C", // Background color on hover
      color: "white", // Text color on hover
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
  top: "43%",
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
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z" />
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
              }}
            >
              Please ensure that the summoner name has no whitespace or special
              symbols
            </Alert>
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
          throw new Error(`Network response was not ok: ${response.status}`);
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

/**
 * Gathers input from field, executes Riot API call
 * based on input to gather user account data
 *
 * @param {string} serverValue
 */

async function getInput(
  serverValue,
  serverLabel,
  navigate,
  setIsLoading,
  setOpen
) {
  const summonerName = document.getElementById("summonerName").value;
  const gameName = summonerName.split("#")[0].trim();
  const tagLine = summonerName.split("#")[1];
  const server = serverValue;

  // Checks for valid input and initiates API calls for data
  if (summonerName.match(/\s*#[^\s]*\S+$/)) {
    try {
      document.getElementById("homeBody").style.animation =
        "fade-out 0.3s forwards";
      document.getElementById("homeBody").style.pointerEvents = "none";
      setIsLoading(true);

      const { summonerInfo, rankedInfo, matchInfoList, summonerWinrate, masteryInfo } = await getSummonerStats(tagLine, gameName, server); // Returns JSON object for all champion and their respective game mode winrates
      //const winrateF = Math.round(((rankedInfo[0][4] / (rankedInfo[0][4] + rankedInfo[0][5])) * 100) * 10) / 10; // Rounded winrate percentage calculated from total games played in Flex queue
      //const winrateS = Math.round(((rankedInfo[1][4] / (rankedInfo[1][4] + rankedInfo[1][5])) * 100) * 10) / 10; // Rounded winrate percentage calculated from total games played in Solo queue

      navigate(`/player/${serverLabel}/${summonerName.replace("#", "-")}`, {
        state: {
          serverLabel,
          gameName: gameName,
          summonerInfo: summonerInfo,
          summonerRankedInfo: rankedInfo,
          summonerMatchInfo: matchInfoList,
          summonerWinrateInfo: summonerWinrate,
          summonerChampionWinrateInfo: masteryInfo,
        },
      });
      //alert("Flex W/R " + winrateF + "%")
      //alert("Solo W/R " + winrateS + "%")
    } catch (error) {
      console.log(error);
      document.getElementById("homeBody").style.animation = "fade-in 0.5s";
      document.getElementById("homeBody").style.pointerEvents = "all";
      setIsLoading(false);
      return;
    }
  } else {
    setOpen(true);
    return;
  }
}

export async function getSummonerStats(tagLine, gameName, server) {
  const puuid = await getPUUID(API_KEY, tagLine, gameName); // puuid identifier for summoner
  const summonerInfo = await getSummonerInfo(API_KEY, server, puuid); // Array that includes summoner ID, summoner level and profile picture
  const masteryInfo = await getMasteryInfo(API_KEY, server, puuid); // Array consisting of champion arrays that includes champion ID, level of mastery, and mastery points
  const matchList = await getMatchList(API_KEY, puuid); // Array constisting of match IDs
  const matchInfoList = await getMatchInfoList(API_KEY, matchList, puuid); // Returns array that contains match information for all matches in a list
  const rankedInfo = await getRankedInfo(API_KEY, server, summonerInfo[0]); // Array consisting of ranked info arrays that include queueType, tier, rank, points, wins, losses
  const summonerWinrate = getSummonerWinrates(rankedInfo); // Returns JSON object for all game mode winrates
  const champWinrate = await getChampionWinrate(masteryInfo, matchInfoList); // Returns JSON object for all champion and their respective game mode winrates
  return { summonerInfo, rankedInfo, matchInfoList, summonerWinrate, masteryInfo };
}

/**
 * API call to Riot for data
 *
 * @param {string} apiURL
 * @returns {Promise}
 */
function makeApiCall(apiURL) {
  // Return a Promise to allow the use of async/await
  return new Promise((resolve, reject) => {
    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          //alert(`Summoner not found`);
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
 * API call to retrieve PUUID identifier
 * based on username
 *
 * @param {string} API_KEY
 * @param {string} tagLine
 * @param {string} gameName
 * @returns {string}
 */
async function getPUUID(API_KEY, tagLine, gameName) {
  const puuidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;
  const data = await makeApiCall(puuidApiURL);
  return data.puuid;
}

/**
 * API call to retrieve summoner info (summoner id,summoner level, profile icon ID)
 * based on puuid and server
 *
 * @param {string} API_KEY
 * @param {string} server
 * @param {string} puuid
 * @returns {[string]}
 */
async function getSummonerInfo(API_KEY, server, puuid) {
  const summonerInfoApiURL = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await makeApiCall(summonerInfoApiURL);
  return [data.id, data.summonerLevel, data.profileIconId];
}

//TODO change structure so it dynamically adds queues instead of manually from constants and use JSON objects instead of arrays
/**
 * API call to retrieve arrays of summoner mastery info on all champions played
 * (champion ID, champion mastery level, champion mastery points)
 * based on puuid and server
 *
 * @param {string} API_KEY
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
async function getMasteryInfo(API_KEY, server, puuid) {
  const masteryApiURL = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await makeApiCall(masteryApiURL);
  const GAME_MODES = {
    NORMAL: 490,
    RANKED_SOLO: 420,
    RANKED_FLEX: 440,
    URF: 1900,
    ONE_FOR_ALL: 1020,
  }; // Object that stores queue Ids for different game modes
  var championStatsMapping = new Map(); // Mapping of championId to JSON stats

  for (const champion of data) {
    var champStats = {
      championPoints: champion.championPoints,
      championLevel: champion.championLevel,
      winrateMapping: new Map([
        [GAME_MODES.NORMAL, [0, 0, 0]],
        [GAME_MODES.RANKED_SOLO, [0, 0, 0]],
        [GAME_MODES.RANKED_FLEX, [0, 0, 0]],
        [GAME_MODES.URF, [0, 0, 0]],
        [GAME_MODES.ONE_FOR_ALL, [0, 0, 0]],
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
    var champInfo = masteryInfo.get(matchInfo[1].championId); // What champion was played
    console.info(queueId);
    if (champInfo.winrateMapping.get(queueId)) {
      champInfo.winrateMapping.get(queueId)[0] += 1; // Increment game count on existing queue
      if (matchInfo[1].win == true)
        champInfo.winrateMapping.get(queueId)[1] += 1; // If they won increment wins
    }
  }
  for (const champInfo of masteryInfo.values()) {
    for (const [queueId, winrateData] of champInfo.winrateMapping.entries()) {
      const gamesPlayed = winrateData[0];
      const wins = winrateData[1];
      var winrate = winrateData[2];

      if (winrateData[0] > 0) winrate = Math.ceil((wins / gamesPlayed) * 100); // W/R percentage rounded up to nearest second decimal
    }
  }
}

//TODO MAKE IT GET ALL MATCHES FROM THIS SEASON ONLY ?? OR SPECIFY TIME PERIOD IN PARAMS
/**
 * API call to retrieve an array of
 * summoner match IDs based on puuid
 *
 * @param {string} API_KEY
 * @param {string} puuid
 * @returns {Promise<Array<Object>>}
 */
async function getMatchList(API_KEY, puuid) {
  const matchListApiURL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&api_key=${API_KEY}`;
  const data = await makeApiCall(matchListApiURL);
  var matchList = [];
  for (const match of data) {
    matchList.push(match);
  }
  return matchList;
}

/**
 * API call to retrieve all match information from a matchID
 *
 * @param {string} API_KEY
 * @param {[string]} matchIDs
 * @param {string} puuid
 * @returns {[[string],[string], [string]]}
 */
async function getMatchInfoList(API_KEY, matchIDs, puuid) {
  var matchInfoList = [];
  for (const matchID of matchIDs) {
    const matchInfoApiURL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
    const data = await makeApiCall(matchInfoApiURL);
    const contents = {
      gameDate: Date.now() - new Date(data.info.gameEndTimestamp),
      gameDuration: data.info.gameDuration,
      gameQueueID: data.info.queueId,
    };
    const participants = data.info.participants;
    for (const playerInfo of participants) {
      if (playerInfo.puuid == puuid) {
        matchInfoList.push([contents, playerInfo, participants]);
        break;
      }
    }
  }
  return matchInfoList;
}

/**
 * API call to retrieve summoner ranked queue info
 * (wins, losses, rank, tier)
 * based on id and server
 *
 * @param {string} API_KEY
 * @param {string} server
 * @param {string} id
 * @returns {[[string]]}
 */
async function getRankedInfo(API_KEY, server, id) {
  const rankedApiURL = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`;
  const data = await makeApiCall(rankedApiURL);
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
