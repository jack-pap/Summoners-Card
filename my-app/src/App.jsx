import './App.css'

function App() {
  return (
    <>
      <h1 onClick={() => window.location.reload()}>SUMMONERS CARD</h1>
      <input type="text" className="summonerField" id="summonerName" placeholder='Enter summonerName name...' />
      <div className="box">
        <select id="server">
          <option value="EUW">EUW</option>
          <option value="EUNE">EUNE</option>
          <option value="NA">NA</option>
        </select>
        <button onClick={getInput}>
          Search
        </button>
      </div>
    </>
  )
}

/**
 * Gathers input from field, executes Riot API call 
 * based on input to gather user account data
 */

async function getInput() {
  const gameName = document.getElementById("summonerName").value;
  const tagLine = document.getElementById("server").value;
  const API_KEY = "RGAPI-4d68addb-57c0-439d-adf1-e52ffec5ca99"; // Bound to change keep updating frequently

  // Checks for valid input and plays animation
  if (gameName.match(/^[0-9a-zA-Z]+$/) && tagLine) {
    document.getElementById("summonerName").value = "";
    /*alert(summonerName + " " + server)
    document.getElementById("rightLine").classList.add('horizMoveLeft');
    document.getElementById("leftLine").classList.add('horizMoveRight');
    document.getElementById("root").classList.add('dissapear');*/

    const puiid = await getPUUID(API_KEY, tagLine, gameName);
    alert("PLAYER ID IS: " + puiid);
    getSummonerInfo(API_KEY, tagLine, puiid)
  }
}

function getPUUID(API_KEY, tagLine, gameName) {
  const puiidApiURL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;

  alert(puiidApiURL);
  // Return a Promise to allow the use of async/await
  return new Promise((resolve, reject) => {
    //API call for PUIID
    fetch(puiidApiURL)
      .then(response => {
        if (!response.ok) {
          alert(`Summoner not found :(`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const puiid = data.puuid;
        resolve(puiid);
        console.log(jsonString);
      })
      .catch(error => {
        reject(error)
      });
  });
}

function getSummonerInfo(API_KEY, tagLine , puuid) {
  const summonerInfoApiURL =`https://${tagLine}1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
  const masteryApiURL = `https://${tagLine}1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${API_KEY}`;

  alert(puiidApiURL);
  // Return a Promise to allow the use of async/await
  return new Promise((resolve, reject) => {
    //API call for PUIID
    fetch(puiidApiURL)
      .then(response => {
        if (!response.ok) {
          alert(`Summoner not found :(`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const puiid = data.puuid;
        resolve(puiid);
        console.log(jsonString);
      })
      .catch(error => {
        reject(error)
      });
  });
}

export default App
