import './App.css'

function Dashboard() {
    return (
      <>
        <div id='homeBody'>
          <h1>CARDS</h1>
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