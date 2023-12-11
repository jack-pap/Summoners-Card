import './App.css'
import jsonKeyData from '../../config.json'
import Select from 'react-select'
import { useState, useEffect } from 'react'

function Dashboard() {
  const [patchVersion, setPatchVersion] = useState('Loading version...'); // Initialize patch version

  return (
    <>
      <header className='header'>
        <div className='headerChildren'>PRIVACY</div>
        <div className='headerChildren' id='minih1'>SUMMONERS CARD</div>
        <div className='headerChildren'>CHAMPIONS</div>
      </header>
      <div id='homeBody'>
        <h1>CARDS</h1>
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

export default Dashboard