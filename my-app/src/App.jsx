import './App.css'
import jsonKeyData from '../../config.json'
import Select from 'react-select'
import { useState, useEffect } from 'react'

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

function App() {
  const [selectedServer, setSelectedServer] = useState(options[0]); // Initialize with the default value
  const [patchVersion, setPatchVersion] = useState('Loading version...'); // Initialize patch version

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
      <header className='header'>
        <div className='headerChildren'>PRIVACY</div>
        <div className='headerChildren' id='minih1'>SUMMONERS CARD</div>
        <div className='headerChildren'>CHAMPIONS</div>
      </header>
      <div id='homeBody'>
        <h1>SUMMONERS <br /> CARD</h1>
        <input type="text" className="summonerField" id="summonerName" placeholder='Enter summoner name: Gamename + #EUW' autoFocus={true} onKeyDown={(event) => {
          if (event.key == "Enter") getInput();
        }} />
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
          <button id="search" onClick={() => getInput(selectedServer.value)}> Search </button>
        </div>
        <div id='patcher'>Patch Version: {patchVersion}</div>
      </div>
      <footer className='footer'>
        <div id="footerLine" />
        <div className='image-container'>
          © 2023 JACK PAPAIOANNOU
          <a href="https://github.com/jack-pap" target="_blank"><img id="image" src="src\assets\git.png" alt="Github Icon" /></a>
        </div>
        Summoners Card isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or
        anyone officially involved in producing or managing Riot Games properties.
        Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </footer>
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
 */

async function getInput(serverValue) {
  const gameName = document.getElementById("summonerName").value.split("#")[0];
  const tagLine = document.getElementById("summonerName").value.split("#")[1];
  const server = serverValue;

  // Checks for valid input and plays animation
  if (gameName.match(/^[^#]*#?[^#]*$/) && tagLine) {
    document.getElementById("summonerName").value = "";
    /*alert(summonerName + " " + server)
    document.getElementById("rightLine").classList.add('horizMoveLeft');
    document.getElementById("leftLine").classList.add('horizMoveRight');
    document.getElementById("homeBody").classList.add('dissapear');*/

    const puiid = await getPUUID(API_KEY, tagLine, gameName); // PUIID identifier for summoner
    const summonerInfo = await getSummonerInfo(API_KEY, server, puiid); // Array that includes summoner ID, summoner level and profile picture
    const masteryInfo = await getMasteryInfo(API_KEY, server, puiid); // Array consisting of champion arrays that includes champion ID, level of mastery, and mastery points
    const rankedInfo = await getRankedInfo(API_KEY, server, summonerInfo[0]); // Array consisting of ranked info arrays that include queueType, tier, rank, points, wins, losses
    const winrate = Math.round(((rankedInfo[0][4] / (rankedInfo[0][4] + rankedInfo[0][5])) * 100) * 10) / 10
    alert(winrate + "%")
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
          alert(`Summoner not found`);
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
 * API call to retrieve arrays of summoner mastery info on the top 3 champions
 * (champion ID, champion mastery level, champion mastery points)
 * based on puuid and server 
 * 
 * @param {string} API_KEY 
 * @param {string} server
 * @param {string} puuid
 * @returns {[[string]]} 
 */
async function getMasteryInfo(API_KEY, server, puuid) {
  const masteryApiURL = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await makeApiCall(masteryApiURL);
  var champInfo = [];
  for (let i = 0; i < 3; i++) {
    var champList = [];
    champList.push(data[i].championId);
    champList.push(data[i].championLevel);
    champList.push(data[i].championPoints);
    champInfo.push(champList);
  }
  return champInfo;
}

/**
 * API call to retrieve summoner ranked queue info
 * (wins, losses, rank, tier)
 * based on id and server 
 * 
 * @param {string} API_KEY 
 * @param {string} server
 * @param {string} id
 * @returns {[string]} 
 */
async function getRankedInfo(API_KEY, server, id) {
  const rankedApiURL = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`;
  const data = await makeApiCall(rankedApiURL);
  var rankedSoloInfo = [];
  var rankedFlexInfo = [];
  var rankedInfo = [rankedFlexInfo, rankedSoloInfo]
  for (let i = 0; i < data.length; i++) {
    rankedInfo[i].push(data[i].queueType); // Solo/duo or Flex queue
    rankedInfo[i].push(data[i].tier); // Iron - Challenger
    rankedInfo[i].push(data[i].rank); // Roman numerical value IV - I
    rankedInfo[i].push(data[i].leaguePoints); // Points out of 100 in current rank
    rankedInfo[i].push(data[i].wins); // Wins in current ranked season
    rankedInfo[i].push(data[i].losses); // Losses in current ranked season
  }
  return rankedInfo;
}

export default App
