import '../App.css'
import infoIcon from '../assets/infoIcon.png';
import summonerNameIcon from '../assets/summonerName.png';
import jsonKeyData from '../../../config.json'
import Select from 'react-select'
import { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";

const API_KEY = jsonKeyData.API_KEY; // Bound to change keep updating frequently

const options = [
  { value: 'EUW1', label: 'EUW' },
  { value: 'EUN1', label: 'EUNE' },
  { value: 'NA1', label: 'NA' },
  { value: 'KR', label: 'KR' },
  { value: 'JP1', label: 'JP' },
  { value: 'BR1', label: 'BR' },
  { value: 'LA1', label: 'LAN' },
  { value: 'LA2', label: 'LAS' },
  { value: 'OC1', label: 'OC' },
  { value: 'TR1', label: 'TR' },
  { value: 'RU', label: 'RU' },
  { value: 'PH2', label: 'PH' },
  { value: 'SG2', label: 'SG' },
  { value: 'TH2', label: 'TH' },
  { value: 'TW2', label: 'TW' },
  { value: 'VN2', label: 'VN' },
]

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: '40px',
    width: '100px',
    borderRadius: '9px',
    border: '1px solid transparent',
    boxShadow: 'none',
    fontSize: '1em',
    fontWeight: '500',
    fontFamily: 'Spiegel',
    color: '#A09B8C',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
    transition: 'border-color 0.25s, transform 300ms ease-in-out',
    outline: state.isFocused ? '1px solid #C89B3C' : 'none', // Outline color on focus
    '&:hover': {
      borderColor: '#C89B3C', // Outline color on hover
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: '#A09B8C', // Set your desired color here
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 4,
    backgroundColor: state.isSelected ? '#C89B3C' : 'transparent',
    color: state.isSelected ? 'white' : '#A09B8C',
    '&:hover': {
      backgroundColor: '#C89B3C', // Background color on hover
      color: 'white', // Text color on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1a1a1a', // Background color of the dropdown menu
  }),
  indicatorSeparator: () => ({ display: 'none' }), // Hide the default separator
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuIsOpen ? '#A09B8C' : '#A09B8C',
    transition: 'transform 0.25s',
    transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
    '&:hover': {
      color: '#A09B8C',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    marginTop: 30,
  }),
}

const spinnerStyles = {
  position: "absolute",
  top: "43%",
  left: "50%",
  transform: "translateX(-50%)"
}

function App() {
  const [selectedServer, setSelectedServer] = useState(options[0]); // Initialize with the default value
  const [patchVersion, setPatchVersion] = useState("    "); // Initialize patch version
  const [isLoading, setIsLoading] = useState(false); // Spinner state for when data is loading 

  const navigate = useNavigate();

  const handleChange = (server) => {
    setSelectedServer(server);
    console.log(`Option selected:`, server);
  };

  useEffect(() => {
    loadVersion()
      .then(version => {
        // Update the patch version state
        setPatchVersion(version);
      })
      .catch(error => {
        console.error('Error loading version:', error);
      });
  });

  return (
    <>
      <div id='homeBody'>
        <h1>SUMMONERS <br /> CARD</h1>
        <div className='fieldBox'>
          <input type="text" className="summonerField" id="summonerName" placeholder={`Enter summoner name: Gamename + #${selectedServer.label}`} autoFocus={true} onKeyDown={(event) => {
            if (event.key == "Enter") getInput(selectedServer.value, selectedServer.label, navigate, setIsLoading);
          }} />
          <div className="tooltip">
            <a id="link" href="https://support-leagueoflegends.riotgames.com/hc/en-us/articles/360041788533-Riot-ID-FAQ#:~:text=If%20your%20Riot%20ID%20is,not%20have%20to%20be%20unique." target="_blank">
              <img id="infoIcon" src={infoIcon} alt="Info Icon" />
            </a>
            <span className="tooltip-text">
              Click for more help
            </span>
          </div>
        </div>
        <div className="box">
          <Select
            id='serverList'
            options={options}
            onChange={handleChange}
            styles={customStyles}
            theme={'primary50'}
            defaultValue={options[0]}
            isSearchable={false}
          />
          <button id="search" onClick={() => getInput(selectedServer.value, selectedServer.label, navigate, setIsLoading)}> Search </button>
        </div>
        <div id='patcher'>Patch Version: {patchVersion}</div>
      </div>
      <GridLoader
        color={'#9b792f'}
        loading={isLoading}
        cssOverride={spinnerStyles}
        margin={6}
        size={26}
        speedMultiplier={0.8}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  )
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
      .then(response => {
        if (!response.ok) {
          alert(`Cannot retrieve version number`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data[0].split('.')[0] + "." + data[0].split('.')[1]);
      })
      .catch(error => {
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

async function getInput(serverValue, serverLabel, navigate, setIsLoading) {
  const summonerName = document.getElementById("summonerName").value
  const gameName = summonerName.split("#")[0];
  const tagLine = summonerName.split("#")[1];
  const server = serverValue;


  // Checks for valid input and initiates API calls for data
  if (summonerName.match(/^[a-zA-Z0-9]+#[a-zA-Z0-9]+$/)) {

    document.getElementById("homeBody").style.display = "none";
    setIsLoading(true);

    // document.getElementById("rightLine").style.animation = "moveLeft 1.5s forwards";
    // document.getElementById("leftLine").style.animation = "moveRight 1.5s forwards";
    // document.getElementById("leftLine").addEventListener('animationend', () => {
    //   console.log('Animation is complete');
    //   setIsLoading(true);
    // });

    try {
      const puiid = await getPUUID(API_KEY, tagLine, gameName); // PUIID identifier for summoner
      const summonerInfo = await getSummonerInfo(API_KEY, server, puiid); // Array that includes summoner ID, summoner level and profile picture
      const masteryInfo = await getMasteryInfo(API_KEY, server, puiid); // Array consisting of champion arrays that includes champion ID, level of mastery, and mastery points
      const matchList = await getMatchList(API_KEY, puiid); // Array constisting of match IDs
      const matchInfoList = await getMatchInfoList(API_KEY, matchList, puiid);
      const champWinrate = await getChampionWinrate(masteryInfo, matchInfoList);
      const rankedInfo = await getRankedInfo(API_KEY, server, summonerInfo[0]); // Array consisting of ranked info arrays that include queueType, tier, rank, points, wins, losses
      //const winrateF = Math.round(((rankedInfo[0][4] / (rankedInfo[0][4] + rankedInfo[0][5])) * 100) * 10) / 10; // Rounded winrate percentage calculated from total games played in Flex queue
      //const winrateS = Math.round(((rankedInfo[1][4] / (rankedInfo[1][4] + rankedInfo[1][5])) * 100) * 10) / 10; // Rounded winrate percentage calculated from total games played in Solo queue

      navigate(`/player/${serverLabel}/${summonerName.replace("#", "-")}`, { state: { serverLabel, summonerName, match: matchInfoList } });
      //alert("Flex W/R " + winrateF + "%")
      //alert("Solo W/R " + winrateS + "%")

    } catch (error) {
      console.log(error);
      setIsLoading(false);
      document.getElementById("homeBody").style.display = "contents";
      return
    }
  } else alert("Please ensure that the summoner name follows the specified format and has no whitespace or special symbols")

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
      .then(response => {
        if (!response.ok) {
          //alert(`Summoner not found`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
        console.log(data);
      })
      .catch(error => {
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
  const puiidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;
  const data = await makeApiCall(puiidApiURL)
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
  const data = await makeApiCall(summonerInfoApiURL)
  return [data.id, data.summonerLevel, data.profileIconId];
}

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
  const NORMAL_GAME_MODE = 490; // QueueId for normal game mode
  const RANKED_SOLO_GAME_MODE = 420; // QueueId for ranked solo game mode
  const RANKED_FLEX_GAME_MODE = 440; // QueueId for ranked flex game mode
  var championStatsMapping = new Map(); // Mapping of championId to JSON stats

  for (const champion of data) {
    var champStats = {
      championPoints: champion.championPoints,
      championLevel: champion.championLevel,
      winrateMapping: new Map([[NORMAL_GAME_MODE, [0, 0, 0]], [RANKED_SOLO_GAME_MODE, [0, 0, 0]], [RANKED_FLEX_GAME_MODE, [0, 0, 0]]]) // [games played, wins, winrate]
    };
    championStatsMapping.set(champion.championId, champStats);
  }
  return championStatsMapping;
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
    const queueId = matchInfo[0][2];
    var champInfo = masteryInfo.get(matchInfo[1].championId);

    champInfo.winrateMapping.get(queueId)[0] += 1
    if (matchInfo[1].win == true) champInfo.winrateMapping.get(queueId)[1] += 1
  }
  for (const champInfo of masteryInfo.values()) {
    champInfo.winrateMapping.get(490)[2] = Math.ceil((champInfo.winrateMapping.get(490)[1] / champInfo.winrateMapping.get(490)[0]) * 100); // Normal W/R percentage rounded up to nearest second decimal
    champInfo.winrateMapping.get(420)[2] = Math.ceil((champInfo.winrateMapping.get(420)[1] / champInfo.winrateMapping.get(420)[0]) * 100); // Ranked Solo W/R percentage rounded up to nearest second decimal
    champInfo.winrateMapping.get(440)[2] = Math.ceil((champInfo.winrateMapping.get(440)[1] / champInfo.winrateMapping.get(440)[0]) * 100); // Ranked Flex W/R percentage rounded up to nearest second decimal 
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
  const data = await makeApiCall(matchListApiURL)
  var matchList = []
  for (const match of data) {
    matchList.push(match)
  }
  return matchList;
}

//TODO Maybe adjust data structure for better readability. Beware dependencies
/**
 * API call to retrieve all match information from a matchID
 * 
 * @param {string} API_KEY 
 * @param {[string]} matchIDs
 * @param {string} puuid
 * @returns {[[string],[string]]} 
 */
async function getMatchInfoList(API_KEY, matchIDs, puiid) {
  var matchInfoList = []
  for (const matchID of matchIDs) {
    const matchInfoApiURL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
    const data = await makeApiCall(matchInfoApiURL)
    const contents = [new Date(data.info.gameCreation), data.info.gameDuration / 60, data.info.queueId];
    const participants = data.info.participants
    const participantIDs = [data.metadata.participants]
    for (const participantInfo of participants) {
      if (participantInfo.puuid == puiid) {
        matchInfoList.push([contents, participantInfo])
        break
      }
    }
  }
  return matchInfoList
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
  var rankedSoloInfo = [];
  var rankedFlexInfo = [];
  for (let i = 0; i < data.length; i++) {
    const currentRankedInfo = {
      queueType: data[i].queueType, // Solo/duo or Flex queue (RANKED_SOLO_5x5, RANKED_FLEX_SR)
      rankedTier: data[i].tier, // Iron - Challenger
      rankedDivision: data[i].rank, // Roman numerical value IV - I
      rankedPoints: data[i].leaguePoints, // Points out of 100 in current rank
      rankedWins: data[i].wins, // Wins in current ranked season
      rankedLosses: data[i].losses // Losses in current ranked season
    };

    if (currentRankedInfo.queueType === "RANKED_SOLO_5x5") {
      rankedSoloInfo.push(currentRankedInfo);
    } else if (queueType === "RANKED_FLEX_SR") {
      rankedFlexInfo.push(currentRankedInfo);
    }
  }
  return [rankedFlexInfo, rankedSoloInfo];
}

export default App
