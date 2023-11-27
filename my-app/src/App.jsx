import './App.css'

function App() {
  return (
    <>
      <h1 onClick={() => window.location.reload()}>SUMMONERS <br /> CARD</h1>
      <input type="text" className="summonerField" id="summonerName" placeholder='Enter summoner name: Gamename + #EUW' />
      <div className="box">
        <select id="server">
          <option value="EUW1">EUW</option>
          <option value="EUNE1">EUNE</option>
          <option value="NA1">NA</option>
        </select>
        <button onClick={getInput}>
          Search
        </button>
      </div>

      <footer className='footer'>
        <div id="footerLine" />
        <div className='image-container'>
          © 2023 JACK PAPAIOANNOU 
          <a href="https://github.com/jack-pap" target="_blank"><img id="image" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Github Icon"/></a>
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
  const gameName = document.getElementById("summonerName").value.split("#")[0];
  const tagLine = document.getElementById("summonerName").value.split("#")[1];
  const server = document.getElementById("server").value;
  const API_KEY = "RGAPI-62185619-f332-4874-8a82-dc92384e6571"; // Bound to change keep updating frequently

  // Checks for valid input and plays animation
  if (gameName.match(/^[0-9a-zA-Z#]+$/) && tagLine) {
    document.getElementById("summonerName").value = "";
    /*alert(summonerName + " " + server)
    document.getElementById("rightLine").classList.add('horizMoveLeft');
    document.getElementById("leftLine").classList.add('horizMoveRight');*/
    document.getElementById("root").classList.add('dissapear');

    const puiid = await getPUUID(API_KEY, tagLine, gameName);
    const summoner = await getSummonerInfo(API_KEY, server, puiid);
  }
}

function makeApiCall(apiURL) {
  // Return a Promise to allow the use of async/await
  return new Promise((resolve, reject) => {
    // API call
    fetch(apiURL)
      .then(response => {
        if (!response.ok) {
          alert(`Summoner not found :(`);
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

async function getPUUID(API_KEY, tagLine, gameName) {
  const puiidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;
  const data = await makeApiCall(puiidApiURL)
  return data.puuid;
}

async function getSummonerInfo(API_KEY, server, puuid) {
  const summonerInfoApiURL = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await makeApiCall(summonerInfoApiURL)
  const level = data.summonerLevel
  const profileIcon = data.profileIconId
  alert(`Summoner is: LEVEL ${level} +  ${profileIcon}`)
  return makeApiCall(summonerInfoApiURL);

}

async function getMasteryInfo(API_KEY, server, puuid) {
  const masteryApiURL = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;
  const data = await makeApiCall(masteryApiURL)
  return makeApiCall(masteryApiURL);
}

export default App
