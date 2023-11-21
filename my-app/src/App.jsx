import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>SUMMONERS CARD</h1>
      <input type="text" className="summonerField" id="summoner" placeholder='Enter summoner name...' />
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

function getInput() {
  const summoner = document.getElementById("summoner").value;
  const server = document.getElementById("server").value;
  if (summoner.match(/^[0-9a-z]+$/) && server) {
    document.getElementById("summoner").value = "";
    /*alert(summoner + " " + server)
    document.getElementById("rightLine").classList.add('horizMoveLeft');
    document.getElementById("leftLine").classList.add('horizMoveRight');*/
    document.getElementById("root").classList.add('dissapear');
  }
}


export default App
