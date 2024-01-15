import '../App.css'
import Error from './Error.jsx';
import { useState, useEffect } from 'react'
import { useParams,
         useNavigate, 
         useLocation} from 'react-router-dom';

const options = [
  { label: 'EUW' },
  { label: 'EUNE' },
  { label: 'NA' },
  { label: 'KR' },
  { label: 'JP' },
  { label: 'BR' },
  { label: 'LAN' },
  { label: 'LAS' },
  { label: 'OC' },
  { label: 'TR' },
  { label: 'RU' },
  { label: 'PH' },
  { label: 'SG' },
  { label: 'TH' },
  { label: 'TW' }]

function Dashboard() {
  const [patchVersion, setPatchVersion] = useState('Loading version...'); // Initialize patch version
  const {state} = useLocation();
  const {server, summonerName} = useParams();
  const {match} = state
  alert(match)
  alert(JSON.stringify(match))
  const navigate = useNavigate();

  if (!options.some(option => option.label === server)) {
    return  <Error errorMessage={`Invalid server "${server}"`} />
  } else return (
    <>
      <div id='homeBody'>
        <h1>CARDS</h1>
        <h2>{summonerName}{server}</h2>
        <div>{`${match}`}</div>
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