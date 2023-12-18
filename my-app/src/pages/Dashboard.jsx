import '../App.css'
import { useState, useEffect } from 'react'

function Dashboard() {
  const [patchVersion, setPatchVersion] = useState('Loading version...'); // Initialize patch version

  return (
    <>
      <div id='homeBody'>
        <h1>CARDS</h1>
      </div>
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