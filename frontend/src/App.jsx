/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import fetch from "isomorphic-fetch";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useData } from "./context/dataContext";
import "./App.css";
import "./index.css";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  apiCall,
  apiGETDatabaseCall,
  apiPOSTDatabaseCall,
} from "./utils/apiService.js";
import GridLoader from "react-spinners/GridLoader";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import ErrorPage from "@/src/components/ErrorPage";

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
  { value: "TW2", label: "TW", region: "sea" },
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
  top: "40%",
  left: "50%",
  transform: "translateX(-50%)",
};

/**
 * @module App
 */
function App() {
  const router = useRouter();
  const { setData } = useData();
  const [selectedServer, setSelectedServer] = useState(serverOptions[0]); // Initialize with the default value
  const [patchVersion, setPatchVersion] = useState("    "); // Initialize patch version
  const [isLoading, setIsLoading] = useState(false); // Spinner state for when data is loading
  const [open, setOpen] = useState(false);

  const handleChange = (server) => {
    setSelectedServer(server);
    console.log(`Option selected:`, server);
  };

  useEffect(() => {
    document.getElementById("homeBody").style.animation = "fade-in 1s forwards"; // Play fade in animation
    document.getElementById("footer").style.position = "absolute";
    loadVersion()
      .then((version) => {
        setPatchVersion(
          version[0].split(".")[0] + "." + version[0].split(".")[1]
        );
      })
      .catch((error) => {
        console.error("Error loading version:", error);
      });
    // if (errorName) {
    //   document.querySelector(
    //     ".MuiAlert-message"
    //   ).textContent = `Trouble finding summoner ${errorName}`;
    //   setOpen(true);
    //   window.history.replaceState({}, "");
    //   return;
    // }
  }, []);

  return (
    <>
      <div id="homeBodyContainer">
        <div className="line" id="leftLine"></div>
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
                    router,
                    setIsLoading,
                    setOpen,
                    setData
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
                  router,
                  setIsLoading,
                  setOpen,
                  setData
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
        <div className="line" id="rightLine"></div>
      </div>
    </>
  );
}

/**
 * API call to Riot Data Dragon
 * for retrieving the latest patch version number
 *
 * @returns {Promise<JSON>}
 */
export async function loadVersion() {
  const apiURL = "https://ddragon.leagueoflegends.com/api/versions.json";

  return new Promise((resolve, reject) => {
    fetch(apiURL, {
      cache: "no-cache",
    })
      .then((response) => {
        if (!response.ok) {
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

/**
 * Method to retrieve JSON data of champions
 * to return mapping between their respective ids and names
 *
 * @returns {Map<number, string>}
 */
export async function getAllChampions() {
  const championApiURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json`;
  const data = await apiCall(championApiURL);
  var championMapping = new Map();
  for (const champion of data) {
    championMapping.set(champion.id, champion.name);
  }
  return championMapping;
}

/**
 * Gathers input from field, retrieves data
 * from the DB or executes Riot API calls
 * to gather user account data for the input name
 *
 * @param {string} serverValue
 * @param {string} serverLabel
 * @param {string} regionValue
 * @param {NavigateFunction} navigate
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setOpen
 */
export async function getInput(
  serverValue,
  serverLabel,
  regionValue,
  router,
  setIsLoading,
  setOpen,
  setData
) {
  const summonerName = document.getElementById("summonerName").value;
  const gameName = summonerName.split("#")[0].trim();
  const tagLine = summonerName.split("#")[1];
  const server = serverValue;
  const region = regionValue;

  // Checks for valid summoner name input
  if (!summonerName.match(/\s*#[^\s]*\S+\s*$/)) {
    document.querySelector(".MuiAlert-message").textContent =
      "Please ensure that the summoner name has no special symbols";
    setOpen(true);
    return;
  }

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
      summonerWinrate,
      masteryInfo,
      champions,
    } = await getSummonerStats(tagLine, gameName, server, region); // Returns all relevant info for the player, games played etc.

    const handleNavigation = () => {
      const path = `/player/${serverLabel}/${summonerName.replace(
        "#",
        "-"
      )}`.toString();
      setData({
        puuid,
        gameName,
        tagLine,
        summonerInfo: summonerInfo,
        rankedInfo: rankedInfo,
        matchInfoList: matchInfoList,
        summonerWinrate: summonerWinrate,
        masteryInfo: masteryInfo,
        champions: champions,
      });
      router.push(path);
    };
    handleNavigation();
  } catch (error) {
    // Stops spinner and reverts back to homepage while showing an error
    console.log(error);
    document.getElementById("homeBody").style.animation = "fade-in 0.5s";
    document.getElementById("homeBody").style.pointerEvents = "all";
    setIsLoading(false);
    document.querySelector(
      ".MuiAlert-message"
    ).textContent = `Trouble finding summoner ${summonerName}`;
    setOpen(true);
    return;
  }
}

/**
 * Driver method that retrieves all summoner data
 * based on database if no new information added
 * or by API calls to fill in missing data
 *
 *
 * @param {string} tagLine
 * @param {string} gameName
 * @param {string} server
 * @param {string} region
 *
 * @returns {JSON}
 */
export async function getSummonerStats(tagLine, gameName, server, region) {
  var puuid; // puuid identifier for summoner
  var summonerInfo; // Array that includes summoner ID, summoner level and profile picture
  var rankedInfo; // Array consisting of ranked info arrays that include queueType, tier, rank, points, wins, losses
  var masteryInfo; // Array consisting of champion arrays that includes champion ID, level of mastery, and mastery points
  var matchList; // Array constisting of match IDs
  var matchInfoList; // Returns array that contains match information for all matches in a list
  var summonerWinrate; // Returns JSON object for all game mode winrates
  const champions = await getAllChampions(); // Returns mapping for champions between their respective ids and names

  const DBSummoner = await apiGETDatabaseCall(
    "summoners",
    `?RiotID=${gameName}-${tagLine}`
  );

  if (
    DBSummoner.length > 0 &&
    (await matchListUpdated(region, DBSummoner[0].puuid))
  ) {
    const processedSummonerInfo = DBSummoner[0].summonerInfo;

    puuid = DBSummoner[0].puuid;
    summonerInfo = processedSummonerInfo.summonerInfo;
    rankedInfo = processedSummonerInfo.rankedInfo;
    masteryInfo = new Map(processedSummonerInfo.masteryInfo);
    matchList = await getMatchList(region, puuid, 0, 20);
    matchInfoList = await matchInfoListDriver(region, matchList, puuid);
    summonerWinrate = processedSummonerInfo.summonerWinrate;
  } else {
    puuid = await getPUUID(tagLine, gameName);
    summonerInfo = await getSummonerInfo(server, puuid);
    rankedInfo = await getRankedInfo(server, summonerInfo[0]);
    masteryInfo = await getMasteryInfo(server, puuid);
    matchList = await getMatchList(region, puuid, 0, 20);
    matchInfoList = await matchInfoListDriver(region, matchList, puuid);
    summonerWinrate = getSummonerWinrates(rankedInfo, matchInfoList);

    apiPOSTDatabaseCall("summoners", "", {
      RiotID: `${gameName}-${tagLine}`,
      puuid: puuid,
      summonerInfo: {
        summonerInfo: summonerInfo,
        rankedInfo: rankedInfo,
        summonerWinrate: summonerWinrate,
        masteryInfo: Array.from(masteryInfo.entries()),
      },
      lastUpdatedDate: formatDateSQL(Date.now()),
    });
  }

  await getChampionWinrate(masteryInfo, matchInfoList, rankedInfo); // Calculates for every champion their respective game mode winrates

  return {
    puuid,
    tagLine,
    summonerInfo,
    rankedInfo,
    matchInfoList,
    summonerWinrate,
    masteryInfo,
    champions,
  };
}

/**
 * API call to retrieve PUUID identifier
 * based on gameName and tagLine
 *
 * @param {string} tagLine
 * @param {string} gameName
 * @returns {string}
 */
export async function getPUUID(tagLine, gameName) {
  const puuidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  const data = await apiCall(puuidApiURL);
  return data.puuid;
}

/**
 * API call to retrieve summoner info (summoner id,summoner level, profile icon ID)
 * based on puuid and server
 *
 * @param {string} server
 * @param {string} puuid
 * @returns {string[]}
 */
export async function getSummonerInfo(server, puuid) {
  const summonerInfoApiURL = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  const data = await apiCall(summonerInfoApiURL);
  return [data.id, data.summonerLevel, data.profileIconId];
}

/**
 * API call to retrieve arrays of summoner mastery info on all champions played
 * (champion ID, champion mastery level, champion mastery points)
 * based on puuid and server
 *
 * @param {string} server
 * @param {string} puuid
 * @returns {Object<number, JSON>} A mapping between champion ids and a JSON object
 * that holds champion data
 */
export async function getMasteryInfo(server, puuid) {
  const masteryApiURL = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;
  const data = await apiCall(masteryApiURL);
  var championStatsMapping = new Map(); // Mapping of championId to JSON stats
  for (const champion of data) {
    var champStats = {
      championPoints: champion.championPoints,
      championLevel: champion.championLevel,
      normalGames: 0,
      normalWins: 0,
      normalWinrate: 0,
      rankedSoloGames: 0,
      rankedSoloWins: 0,
      rankedSoloWinrate: 0,
      rankedFlexGames: 0,
      rankedFlexWins: 0,
      rankedFlexWinrate: 0,
    };
    championStatsMapping.set(champion.championId, champStats);
  }
  return championStatsMapping;
}

//TODO GET NORMAL WINRATES
/**
 * Calculates summoner winrate for ranked solo/duo and flex queue
 * modes based on ranked info and remade matches found
 *
 * @param {JSON} rankedInfo
 * @param {string[][]} matchInfoList
 */
export function getSummonerWinrates(rankedInfo, matchInfoList) {
  const flexRemakes = getRemakesNumber(rankedInfo, matchInfoList, 440);
  const soloRemakes = getRemakesNumber(rankedInfo, matchInfoList, 420);
  const winrates = {
    normalWinrate: 1, //TODO FIX THIS TO GET NORMAL WINRATE
    rankedFlexWinrate:
      Math.round(
        (rankedInfo[0].rankedWins /
          (rankedInfo[0].rankedWins +
            rankedInfo[0].rankedLosses -
            flexRemakes)) *
          100 *
          10
      ) / 10,
    rankedSoloWinrate:
      Math.round(
        (rankedInfo[1].rankedWins /
          (rankedInfo[1].rankedWins +
            rankedInfo[1].rankedLosses -
            soloRemakes)) *
          100 *
          10
      ) / 10,
  };
  return winrates;
}

/**
 * Scans through all matches to determine if
 * a games was under 5 minutes to be classified
 * as a remake
 *
 * @param {JSON} rankedInfo
 * @param {string[][]} matchInfoList
 * @returns {number}
 */
export function getRemakesNumber(rankedInfo, matchInfoList, gameQueueID) {
  var remakeNumber = 0;
  const totalRankedGames =
    rankedInfo[0].rankedGames ?? 0 + rankedInfo[1].rankedGames ?? 0;
  for (const matchInfo of matchInfoList.slice(0, totalRankedGames)) {
    if (
      matchInfo[0].gameDuration < 300 &&
      gameQueueID == matchInfo[0].gameQueueID
    )
      remakeNumber++;
  }
  return remakeNumber;
}

/**
 * Method that iterates through matches stored
 * and calculates champion winrate values
 * while ignoring remade games and non ranked games
 *
 * @param {Map} masteryInfo
 * @param {string[][]} matchInfoList
 * @param {JSON} rankedInfo
 */
export function getChampionWinrate(masteryInfo, matchInfoList, rankedInfo) {
  const allRankedGames =
    rankedInfo[0].rankedGames ?? 0 + rankedInfo[1].rankedGames ?? 0;

  for (const matchInfo of matchInfoList.slice(0, allRankedGames)) {
    if (matchInfo[0].gameDuration < 300) continue;

    const queueId = matchInfo[0].gameQueueID; // What type of game was played
    if (!Object.values(GAME_MODES).includes(queueId)) continue;

    var gameType; // Set gametype JSON fields to alter
    if (queueId === GAME_MODES.RANKED_SOLO) {
      gameType = "rankedSolo";
    } else if (queueId === GAME_MODES.RANKED_FLEX) {
      gameType = "rankedFlex";
    } else {
      continue;
    }

    var champInfo = masteryInfo.get(matchInfo[1].championId); // What champion was played

    champInfo[`${gameType}Games`] += 1; // Increment game count on existing queue
    if (matchInfo[1].win === true) champInfo[`${gameType}Wins`] += 1; // If they won increment win
  }

  for (const champInfo of masteryInfo.values()) {
    // Calculate winrates for ranked solo and ranked flex
    for (const gameType of ["rankedSolo", "rankedFlex"]) {
      const gamesPlayed = champInfo[`${gameType}Games`];
      const wins = champInfo[`${gameType}Wins`];
      let winrate = champInfo[`${gameType}Winrate`];

      if (gamesPlayed > 0) {
        winrate = Math.floor((wins / gamesPlayed) * 100); // W/R percentage rounded up to nearest second decimal
        champInfo[`${gameType}Winrate`] = winrate; // Update the winrate value in the JSON
      }
    }
  }
}

/**
 * Retrieves an array of
 * summoner match IDs based on puuid
 * from the DB if its updated or through
 * API call
 *
 * @param {string} region
 * @param {string} puuid
 * @param {number} matchAmountStart
 * @param {number} matchAmount
 * @returns {Array<Object>|Promise<Array<Object>>}
 */
export async function getMatchList(
  region,
  puuid,
  matchAmountStart,
  matchAmount
) {
  if (await matchListUpdated(region, puuid)) {
    const DBMatchList = await apiGETDatabaseCall("matches", `?puuid=${puuid}`);
    return DBMatchList.map((obj) => Object.values(obj)[0]);
  } else {
    const matchListApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${matchAmountStart}&count=${matchAmount}&type=ranked`;
    const data = await apiCall(matchListApiURL);
    var matchList = [];
    for (const match of data) {
      matchList.push(match);
    }
    return matchList;
  }
}

/**
 * Returns a matchList with matches from the last point extended in
 * the dashboard to extend the current list of games viewed. The matchList
 * is fetched through the DB if available or through an API call
 *
 * @param {string} region
 * @param {string} puuid
 * @param {string} lastGameDate
 * @returns {Array<Object>|Promise<Array<Object>>}
 */
export async function getExtendedMatchList(region, puuid, lastGameDate) {
  const APIFormatDate = new Date(lastGameDate).getTime() / 1000;
  const DBExtendedMatchList = await apiGETDatabaseCall(
    "matches",
    `?puuid=${puuid}&matchDate=${lastGameDate}`
  );
  if (DBExtendedMatchList.length < 10) {
    const matchListApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?endTime=${APIFormatDate}&start=1&count=10&type=ranked`;
    const matchList = await apiCall(matchListApiURL);
    return matchList;
  }

  return DBExtendedMatchList.map((obj) => Object.values(obj)[0]);
}

/**
 * Cross references the most recent match a summoner
 * played through an API call and checks if it is in
 * the database to determine if the list is updated
 *
 * @param {string} region
 * @param {string} puuid
 * @returns {boolean}
 */
export async function matchListUpdated(region, puuid) {
  const matchListApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${0}&count=${1}&type=ranked`;
  const data = await apiCall(matchListApiURL);
  const DBMatch = await apiGETDatabaseCall(
    "matches",
    `?matchID=${data[0]}&puuid=${puuid}`
  );
  return DBMatch.length > 0;
}

/**
 * Driver method that etrieves all match
 * information from a matchID through
 * an API call or the DB it repeats
 * the process if no matches were found
 *
 * @param {string} region
 * @param {string[]} matchIDs
 * @param {string} puuid
 * @returns {string[][]}
 */
export async function matchInfoListDriver(region, matchIDs, puuid) {
  var matchInfoList = await getMatchInfoList(matchIDs, region, puuid);

  // Disabled for now while rate limit is low
  // if (matchInfoList.length < matchIDs.length) {
  //   const moreMatchesObject = await findMoreMatches(region, puuid);
  //   if (moreMatchesObject) {
  //     matchInfoList = [...new Set(matchInfoList.concat(moreMatchesObject))];
  //   }
  // }

  return matchInfoList;
}

/**
 * Retrieves and formats match information for every
 * matchID in the list through DB calls or API calls
 * depending on availability and returns an array of
 * arrays that contain the JSON objects with the information
 * about the match data, the summoner and all the participants
 *
 * @param {string[]} matchIDs
 * @param {string} region
 * @param {string} puuid
 * @returns {string[][]}
 */
export async function getMatchInfoList(matchIDs, region, puuid) {
  var matchInfoList = [];

  const DBMatchInfos = await Promise.all(
    matchIDs.map((matchID) =>
      apiGETDatabaseCall("matches", `?matchID=${matchID}&puuid=${puuid}`)
    )
  );

  await Promise.all(
    matchIDs.map(async (matchID, index) => {
      const DBMatchInfo = DBMatchInfos[index];

      // If found in DB process it
      if (DBMatchInfo.length > 0) {
        const matchInfo = DBMatchInfo[0].matchInfo;
        if (
          checkMatchEligibility(
            matchInfo.contents.gameDateSQLFormat,
            matchInfo.contents.gameQueueID
          )
        )
          return;
        matchInfoList[index] = [
          matchInfo.contents,
          matchInfo.ownPlayerInfo,
          matchInfo.participantsList,
        ];
        return;
      }

      const { contents, participants } = await matchInfoAPICall(
        region,
        matchID
      );

      if (
        checkMatchEligibility(contents.gameDateSQLFormat, contents.gameQueueID)
      )
        return;

      var ownPlayerInfo;
      // Keeps only necessary JSON data
      const participantsList = participants.map((playerInfo) => {
        const pickedPlayerInfo = (({
          win,
          championId,
          champLevel,
          kills,
          deaths,
          assists,
          totalMinionsKilled,
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
          teamPosition,
        }) => ({
          win,
          championId,
          champLevel,
          kills,
          deaths,
          assists,
          totalMinionsKilled,
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
          teamPosition,
        }))(playerInfo);

        if (playerInfo.puuid == puuid) {
          ownPlayerInfo = pickedPlayerInfo;
        }
        return pickedPlayerInfo;
      });

      matchInfoList[index] = [contents, ownPlayerInfo, participantsList];

      apiPOSTDatabaseCall("matches", "", {
        puuid: puuid,
        matchID: matchID,
        matchInfo: {
          contents: contents,
          ownPlayerInfo: ownPlayerInfo,
          participantsList: participantsList,
        },
        matchDate: contents.gameDateSQLFormat,
      });
    })
  );

  matchInfoList = matchInfoList.filter((n) => n); // Filters empty entries
  return matchInfoList;
}

/**
 * Checks a match for its date and queue ID
 * to determine if it should be processed or not
 *
 * @param {string} matchDate
 * @param {string} matchID
 * @returns {boolean}
 */
export function checkMatchEligibility(matchDate, matchID) {
  // Dont process any unranked or older than a year games
  const isOverAYearAgo = Date.now() - new Date(matchDate) > 31536000000;
  const isNotValidGameMode = !Object.values(GAME_MODES).includes(matchID);

  return isNotValidGameMode || isOverAYearAgo;
}

/**
 * API call to retrieve and format match
 * information data for a specific matchID
 *
 * @param {string} region
 * @param {string} matchID
 * @returns {Promise<JSON>}
 */
export async function matchInfoAPICall(region, matchID) {
  const matchInfoApiURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`;
  const data = await apiCall(matchInfoApiURL);
  const contents = {
    gameID: matchID,
    gameDate: new Date(data.info.gameEndTimestamp),
    gameDateSQLFormat: formatDateSQL(data.info.gameEndTimestamp),
    gameDuration: data.info.gameDuration,
    gameQueueID: data.info.queueId,
  };
  const participants = data.info.participants;

  return { contents, participants };
}

/**
 * Attempts to find more ranked/normal games to fill
 * the desired matchIDs length. If the length cannot be
 * filled it means no games can be found and it returns
 *
 * @param {string} region
 * @param {string} puuid
 * @returns {Promise<Array<Object>,Object>}
 */
export async function findMoreMatches(region, puuid) {
  const newMatchIDS = await getMatchList(region, puuid, 0, 20);
  const newMatchInfoList = await getMatchInfoList(newMatchIDS, region, puuid);
  return newMatchInfoList.length == 0 ? null : newMatchInfoList.matchInfoList;
}

/**
 * API call to retrieve summoner ranked queue info
 * (wins, losses, rank, tier)
 * based on id and server
 *
 * @param {string} server
 * @param {string} id
 * @returns {JSON}
 */
export async function getRankedInfo(server, id) {
  const rankedApiURL = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`;
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

/**
 * Formats timestamp milliseconds into DATETIME
 * format for entry in MySQL database
 *
 * @param {number} timestamp
 * @returns {string}
 */
export function formatDateSQL(timestamp) {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default App;
