import './App.css'

function App() {
  return (
    <>
      <div id='homeBody'>
        <h1>SUMMONERS <br /> CARD</h1>
        <input type="text" className="summonerField" id="summonerName" placeholder='Enter summoner name: Gamename + #EUW' onKeyDown={(event) => {
          if (event.key == "Enter") getInput();
        }} />
        <div className="box">
          <select id="server">
            <option value="EUW1">EUW</option>
            <option value="EUNE1">EUNE</option>
            <option value="NA1">NA</option>
          </select>
          <button id="search" onClick={getInput}> Search </button>
        </div>
        <div id='patcher'>Patch Version: 13.23</div>
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
 * Gathers input from field, executes Riot API call 
 * based on input to gather user account data
 */

async function getInput() {
  const API_KEY = "RGAPI-5972e6b6-715c-4f47-af9a-5aa3a944e12e"; // Bound to change keep updating frequently
  const gameName = document.getElementById("summonerName").value.split("#")[0];
  const tagLine = document.getElementById("summonerName").value.split("#")[1];
  const server = document.getElementById("server").value;


  // Checks for valid input and plays animation
  if (gameName.match(/^[0-9a-zA-Z#]+$/) && tagLine) {
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
    alert(winrate+ "%")
  }
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
    // API call
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
