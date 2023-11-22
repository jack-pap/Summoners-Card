import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 onClick={()=> window.location.reload()}>SUMMONERS CARD</h1>
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

function getInput() {
  const gameName = document.getElementById("summonerName").value;
  const tagLine = document.getElementById("server").value;
  const api_key = "RGAPI-e5d86adb-e4f8-4d72-ba41-8f55e7dbc438";
  const apiURL = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine + "?api_key=" + api_key;

  // Checks for valid input and plays animation
  if (gameName.match(/^[0-9a-zA-Z]+$/) && tagLine) {
    document.getElementById("summonerName").value = "";
    /*alert(summonerName + " " + server)
    document.getElementById("rightLine").classList.add('horizMoveLeft');
    document.getElementById("leftLine").classList.add('horizMoveRight');*/
    document.getElementById("root").classList.add('dissapear');
    
    alert(apiURL)

    //API call
    fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();})
    .then(data => { 
      const jsonString = JSON.stringify(data.puuid); 
      alert(jsonString);
      console.log(jsonString);
    })
    .catch(error => console.error(error));

  }
}

export default App
