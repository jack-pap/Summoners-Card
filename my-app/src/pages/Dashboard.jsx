import "../App.css";
import Error from "./Error.jsx";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const options = [
  { label: "EUW" },
  { label: "EUNE" },
  { label: "NA" },
  { label: "KR" },
  { label: "JP" },
  { label: "BR" },
  { label: "LAN" },
  { label: "LAS" },
  { label: "OC" },
  { label: "TR" },
  { label: "RU" },
  { label: "PH" },
  { label: "SG" },
  { label: "TH" },
  { label: "TW" },
];

function Dashboard() {
  const [patchVersion, setPatchVersion] = useState("Loading version..."); // Initialize patch version
  const { server, summonerName } = useParams(); // Summoner name and server
  const { state } = useLocation();
  const { summonerInfo, summonerRankedInfo, summonerMatchInfo } = state; // Summoner info
  const [leagueImages, setleagueImages] = useState(""); // Images

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("homeBody").style.animation = "fade-in 1s forwards";
    getImages(summonerInfo, summonerMatchInfo, setleagueImages);
    loadVersion()
      .then((version) => {
        // Update the patch version state
        setPatchVersion(
          version[0].split(".")[0] + "." + version[0].split(".")[1]
        );
      })
      .catch((error) => {
        console.error("Error loading version:", error);
      });
  }, []);

  if (!options.find((option) => option.label === server)) {
    return <Error errorMessage={`Invalid server "${server}"`} />;
  } else {
    return (
      <>
        <div id="homeBody">
          <div id="summonerBlock">
            <div className="profileIconGroup">
              <img id="summonerIcon" src={leagueImages[0]} alt="Image" />
              <div id="level">{summonerInfo[1]}</div>
              <div id="summonerName">{summonerName.replace("-", "#")}</div>
            </div>

            <div id="rankedSolo">Rank {summonerRankedInfo[1].rankedTier}</div>
            <div id="rankedFlex">Rank {summonerRankedInfo[0].rankedTier}</div>
            <img id="master" src={leagueImages[1]} alt="Image" />
          </div>
          <div id="winrateBlock"></div>
          <div id="championBlock"></div>
          <div id="matchHistoryBlock">
            MATCH HISTORY
            <div id="matchList">{`${summonerMatchInfo}`}</div>
          </div>
          <div id="friendBlock"></div>
        </div>
      </>
    );
  }
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
      .then((response) => {
        if (!response.ok) {
          alert(`Cannot retrieve version number`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data[0].split(".")[0] + "." + data[0].split(".")[1]);
      })
      .catch((error) => {
        reject(error);
      });
  });
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
      .then((response) => {
        if (!response.ok) {
          //alert(`Summoner not found`);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
        console.log(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getImages(summonerInfo, summonerMatchInfo, setleagueImages) {
  const imgURL = `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/profileicon/${summonerInfo[2]}.png`;
  const imgURL2 = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-master.png`;

  setleagueImages([imgURL, imgURL2]);
}
export default Dashboard;
