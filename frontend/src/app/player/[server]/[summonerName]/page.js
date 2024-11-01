"use client";
import React from "react";
import "../../../../App.css";
import { memo } from "react";
import { notFound } from "next/navigation";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { createRoot } from "react-dom/client";
import {
  getPUUID,
  getSummonerStats,
  getExtendedMatchList,
  matchInfoListDriver,
  matchListUpdated,
} from "@/src/App.jsx";
import { useData } from "@/src/context/dataContext";
import { apiCall, apiImageCall } from "@/src/utils/apiService";
import useSummonerStore from "@/src/utils/storeService";
import MatchEntry from "@/src/components/MatchEntry";
import ChampionEntryList from "@/src/components/ChampionEntryList";
import ErrorPage from "@/src/components/ErrorPage.jsx";
import { useEffect, useRef, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import { LineChart } from "@mui/x-charts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CircularProgress from "@mui/material/CircularProgress";
import "react-circular-progressbar/dist/styles.css";
import Header from "@/src/components/Header";

const serverOptions = [
  { value: "EUW1", label: "EUW", region: "europe" },
  { value: "EUN1", label: "EUNE", region: "europe" },
  { value: "NA1", label: "NA", region: "americas" },
  { value: "KR", label: "KR", region: "asia" },
  { value: "JP1", label: "JP", region: "asia" },
  { value: "BR1", label: "BR", region: "americas" },
  { value: "LA1", label: "LAN", region: "americas" },
  { value: "LA2", label: "LAS", region: "americas" },
  { value: "OC1", label: "OC", region: "sea" },
  { value: "TR1", label: "TR", region: "europe" },
  { value: "RU", label: "RU", region: "europe" },
  { value: "PH2", label: "PH", region: "asia" },
  { value: "SG2", label: "SG", region: "sea" },
  { value: "TH2", label: "TH", region: "asia" },
  { value: "TW2", label: "TW", region: "sea" },
  { value: "VN2", label: "VN", region: "asia" },
];

const serverDictionary = serverOptions.reduce((acc, option) => {
  acc[option.label] = option.value;
  return acc;
}, {});

const spinnerStyles = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translateX(-50%)",
};

var gameQueues;
var ownUsername;

/**
 * @module Dashboard
 */

function Dashboard() {
  const router = useRouter();
  const hasFetched = useRef(false);
  const summonerData = useSummonerStore((state) => state.summonerData);
  const setSummonerData = useSummonerStore((state) => state.setSummonerData);
  const storedData = useSummonerStore.getState().summonerData;
  var storedTransformedData = null;
  if (storedData) {
    storedTransformedData = {
      ...storedData,
      masteryInfo: new Map(storedData.masteryInfo),
      champions: new Map(storedData.champions),
    };
  }
  const { data } = useData();
  const { server, summonerName } = useParams();
  const region = serverOptions.find(
    (option) => server === option.label
  )?.region;

  const [isLoading, setIsLoading] = useState(true);
  const [isTempLoading, setIsTempLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [puuid, setPuuid] = useState(null);
  const [summonerInfo, setSummonerInfo] = useState(null);
  const [summonerRankedInfo, setSummonerRankedInfo] = useState(null);
  const [summonerMatchInfo, setSummonerMatchInfo] = useState(null);
  const [summonerWinrateInfo, setSummonerWinrateInfo] = useState(null);
  const [summonerChampionWinrateInfo, setSummonerChampionWinrateInfo] =
    useState(null);
  const [championsInfo, setChampions] = useState(null);
  const [graphData, setgraphData] = useState(null);

  if (!serverOptions.find((option) => option.label === server)) {
    setError(`Invalid server "${server}"`);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        gameQueues = await getGameQueues();
        setIsLoading(true);

        var result;
        const newGameName = summonerName.split("-")[0].trim();
        const fetchedTagLine = summonerName.split("-")[1].trim();
        const fetchedPUUID = await getPUUID(fetchedTagLine, newGameName);

        const noDataAvailable = !data && !storedTransformedData;
        const matchListNotUpdated = !(await matchListUpdated(
          region,
          fetchedPUUID
        ));
        const gameNameMismatch =
          storedTransformedData?.gameName !== summonerName;

        if (noDataAvailable || matchListNotUpdated || gameNameMismatch) {
          try {
            result = await getSummonerStats(
              summonerName.split("-")[1],
              newGameName,
              serverDictionary[server],
              region
            );
          } catch (error) {
            setError(`Cannot find ${summonerName}`);
          }
        } else {
          const resultData = data || storedTransformedData;
          result = {
            puuid: resultData.puuid,
            tagLine: resultData.tagLine,
            summonerInfo: resultData.summonerInfo,
            rankedInfo: resultData.rankedInfo,
            matchInfoList: resultData.matchInfoList,
            summonerWinrate: resultData.summonerWinrate,
            masteryInfo: resultData.masteryInfo,
            champions: resultData.champions,
          };
        }

        //When storing maps in local storage they dont get stored properly
        const transformedResult = {
          ...result,
          gameName: summonerName,
          masteryInfo: Array.from(result.masteryInfo.entries()),
          champions: Array.from(result.champions.entries()),
        };

        setSummonerData(transformedResult);
        setGameName(newGameName);
        setTagLine(result.tagLine);
        setPuuid(result.puuid);
        setSummonerInfo(result.summonerInfo);
        setSummonerRankedInfo(result.rankedInfo);
        setSummonerMatchInfo(result.matchInfoList);
        setSummonerWinrateInfo(result.summonerWinrate);
        setSummonerChampionWinrateInfo(result.masteryInfo);
        setChampions(result.champions);
        setIsLoading(false);

        getGraphDates(result.matchInfoList, setgraphData);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    fetchData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    data,
    region,
    router,
    setSummonerData,
    summonerData,
    summonerName,
    server,
  ]);

  useEffect(() => {
    if (!isLoading) {
      makeSummonerProfile(
        summonerInfo,
        summonerRankedInfo,
        summonerMatchInfo,
        summonerChampionWinrateInfo,
        championsInfo
      );
      makeMatchHistory(summonerMatchInfo, setIsTempLoading);

      document.documentElement.style.overflowY = "scroll";
      document.getElementById("footer").style.position = "relative";
      document.getElementById("homeBody").style.animation =
        "fade-in 1s forwards";
    }
  }, [
    summonerInfo,
    summonerRankedInfo,
    summonerWinrateInfo,
    summonerChampionWinrateInfo,
    isLoading,
  ]);

  if (error) {
    return notFound();
  }

  ownUsername = gameName;
  if (isLoading) {
    return (
      <GridLoader
        color={"#9b792f"}
        loading={isLoading}
        cssOverride={spinnerStyles}
        margin={6}
        size={26}
        speedMultiplier={0.8}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }
  return (
    <>
      <Header />
      <div className="dashboard">
        <div id="homeBody">
          <div id="summonerContainer">
            <div id="winrateBlockContainer">
              <div id="winrateBlock">
                <ButtonGroup
                  variant="outlined"
                  sx={{
                    ".MuiButtonGroup-grouped": {
                      "&:hover": {
                        color: "#C89B3C",
                        backgroundColor: "#262c33",
                        borderColor: "#C89B3C",
                      },
                      color: "#A09B8C",
                      backgroundColor: "262c33",
                      borderColor: "#C89B3C",
                    },
                  }}
                  size="Large"
                  aria-label="Basic button group"
                  fullWidth
                >
                  {/* <Button
                  onClick={() => {
                    loadWinrate(
                      summonerRankedInfo[1],
                      summonerWinrateInfo.normalWinrate
                    );
                  }}
                >
                  Normal
                </Button> */}
                  <Button
                    onClick={() => {
                      loadWinrate(
                        summonerRankedInfo[1],
                        summonerWinrateInfo.rankedSoloWinrate
                      );
                    }}
                  >
                    Solo/Duo
                  </Button>
                  <Button
                    onClick={() => {
                      loadWinrate(
                        summonerRankedInfo[0],
                        summonerWinrateInfo.rankedFlexWinrate
                      );
                    }}
                  >
                    Flex
                  </Button>
                </ButtonGroup>
                <div className="winrateContainer">
                  <div id="games">
                    <CircularProgressbar
                      strokeWidth={5}
                      value={
                        summonerRankedInfo[1].rankedGames != undefined
                          ? summonerRankedInfo[1].rankedGames
                          : 0
                      }
                      maxValue={1}
                      text={
                        summonerRankedInfo[1].rankedGames != undefined
                          ? summonerRankedInfo[1].rankedGames
                          : "0"
                      }
                      styles={buildStyles({
                        strokeLinecap: "butt",
                        strokeDashoffset:
                          summonerRankedInfo[1].rankedGames > 0 ? 0 : 298.451,
                        textSize: "18px",
                        pathTransitionDuration: 0.4,
                        pathColor: `rgb(197 134 0)`,
                        textColor: "#E3E4E4",
                        trailColor: "#65645E",
                      })}
                    />
                    Games Played
                  </div>
                  <div id="winrate">
                    <CircularProgressbar
                      strokeWidth={5}
                      value={
                        !isNaN(summonerWinrateInfo.rankedSoloWinrate)
                          ? summonerWinrateInfo.rankedSoloWinrate
                          : 0
                      }
                      text={
                        summonerWinrateInfo.rankedSoloWinrate
                          ? `${summonerWinrateInfo.rankedSoloWinrate}%`
                          : `0%`
                      }
                      styles={buildStyles({
                        strokeLinecap: "butt",
                        textSize: "18px",
                        pathTransitionDuration: 0.4,
                        pathColor: `rgb(197 134 0)`,
                        textColor: "#E3E4E4",
                        trailColor: "#65645E",
                      })}
                    />
                    Winrate
                  </div>
                </div>
              </div>
              <div className="winrateGraph">
                <LineChart
                  xAxis={[
                    {
                      data: graphData.map((item) => item.date),
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: graphData.map((item) => item.value),
                      color: "rgb(197, 134, 0)",
                      label: "Net Win Count",
                      valueFormatter: (v, { dataIndex }) => {
                        if (dataIndex >= 0 && dataIndex < graphData.length) {
                          const { date, label } = graphData[dataIndex];
                          return label;
                        }
                        return "";
                      },
                    },
                  ]}
                  width={450}
                  height={320}
                  grid={{ vertical: true, horizontal: true }}
                  slotProps={{
                    popper: {
                      sx: {
                        "& .MuiChartsTooltip-paper": {
                          backgroundColor: "#1b1f24 !important",
                          border: "1px solid #C89B3C !important",
                        },
                        "& .MuiChartsTooltip-cell": {
                          color: "#C89B3C !important",
                        },
                        "& .MuiChartsTooltip-mark": {
                          border: "0px !important",
                        },
                        "& .MuiChartsTooltip-table thead tr td": {
                          color: "#C89B3C !important",
                        },
                        "& .MuiChartsTooltip-table tbody tr td": {
                          borderTop: "1px solid #383838 !important",
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiMarkElement-root": {
                      // Marks in the grid
                      fill: "rgb(27, 31, 36) !important",
                    },
                    "& .MuiChartsAxisHighlight-root": {
                      // Inside of the mark color
                      stroke: "rgb(101, 100, 94) !important",
                    },
                    "& .MuiChartsAxis-line": {
                      // Axis lines color
                      stroke: "rgb(101, 100, 94) !important",
                    },
                    "& .MuiChartsGrid-line": {
                      // Grid lines color
                      stroke: "rgb(48, 48, 48) !important",
                    },
                    "& .MuiChartsAxis-tick": {
                      // Little line next to the marks
                      stroke: "rgb(101, 100, 94) !important",
                    },
                    "& .MuiChartsAxis-tickLabel": {
                      // Text on axis labels
                      fill: "rgb(101, 100, 94) !important",
                    },
                    "& .MuiChartsLegend-root text": {
                      // Text on axis labels
                      fill: "rgb(101, 100, 94) !important",
                    },
                  }}
                />
              </div>
            </div>
            <div id="summonerBlock">
              <div className="profileGroup">
                <div id="profileBg"> </div>
                <div id="profileIconGroupContainer"></div>
                <div id="name">
                  <div id="gameName"> {decodeURIComponent(gameName)} </div>
                  <div id="tagLine"> #{decodeURIComponent(tagLine)} </div>
                  <div
                    id="iconContainer"
                    onClick={() => {
                      copyToClipBoard(gameName, tagLine);
                    }}
                    onMouseEnter={resetCopyButton}
                  >
                    <span id="copyToClipboardIconText" className="tooltip-text">
                      Copy to clipboard
                    </span>
                    <svg
                      id="copyToClipboardIcon"
                      clipRule="evenodd"
                      fillRule="evenodd"
                      strokeLinejoin="round"
                      strokeMiterlimit="2"
                      viewBox="0 -1 21 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m6 18h-3c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 
                    1 1v14c0 .621-.522 1-1 1h-14c-.48
                    0-1-.379-1-1zm1.5-10.5v13h13v-13zm9-1.5v-2.5h-13v13h2.5v-9.5c0-.481.38-1 1-1z"
                        fillRule="nonzero"
                      />
                    </svg>
                  </div>
                </div>
                <div className="summonerChips"></div>
              </div>
              {(summonerRankedInfo[0] !== "Unranked" ||
                summonerRankedInfo[1] !== "Unranked") && (
                <div id="lineDivider"></div>
              )}
              <div className="rankedInfo">
                {summonerRankedInfo[1] !== "Unranked" && (
                  <div id="rankedSolo">
                    <div className="rankedRank">
                      <div>{`${summonerRankedInfo[1].rankedTier} ${summonerRankedInfo[1].rankedDivision} --`}</div>
                      <div>{`${summonerRankedInfo[1].rankedPoints} LP`}</div>
                    </div>
                    <div className="rankedTitle">Ranked Solo/Duo</div>
                    <div className="rankedWinrate">
                      <div>{`${summonerWinrateInfo.rankedSoloWinrate}% Winrate`}</div>
                      <div>{`(${summonerRankedInfo[1].rankedWins}W ${summonerRankedInfo[1].rankedLosses}L)`}</div>
                    </div>
                  </div>
                )}
                {summonerRankedInfo[0] !== "Unranked" && (
                  <div id="rankedFlex">
                    <div className="rankedRank">
                      <div>{`${summonerRankedInfo[0].rankedTier} ${summonerRankedInfo[0].rankedDivision} --`}</div>
                      <div>{`${summonerRankedInfo[0].rankedPoints} LP`}</div>
                    </div>
                    <div className="rankedTitle">Ranked Flex</div>
                    <div className="rankedWinrate">
                      <div>{`${summonerWinrateInfo.rankedFlexWinrate}% Winrate`}</div>
                      <div>{`(${summonerRankedInfo[0].rankedWins}W ${summonerRankedInfo[0].rankedLosses}L)`}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="championBlock">
              <ButtonGroup
                id="championButtonGroup"
                variant="outlined"
                sx={{
                  ".MuiButtonGroup-grouped": {
                    "&:hover": {
                      color: "#C89B3C",
                      backgroundColor: "#262c33",
                      borderColor: "#C89B3C",
                    },
                    color: "#A09B8C",
                    backgroundColor: "262c33",
                    borderColor: "#C89B3C",
                  },
                }}
                size="Large"
                aria-label="Basic button group"
                fullWidth
              >
                {/* <Button
                onClick={() => {
                  makeChampionWinrate(
                    summonerChampionWinrateInfo,
                    championsInfo,
                    490
                  );
                }}
              >
                Normal
              </Button> */}
                <Button
                  onClick={() => {
                    makeChampionWinrate(
                      summonerChampionWinrateInfo,
                      championsInfo,
                      420
                    );
                  }}
                >
                  Solo/Duo
                </Button>
                <Button
                  onClick={() => {
                    makeChampionWinrate(
                      summonerChampionWinrateInfo,
                      championsInfo,
                      440
                    );
                  }}
                >
                  Flex
                </Button>
              </ButtonGroup>
              <div id="statNames">
                <div>Name</div>
                <div>Winrate</div>
                <div>Games</div>
              </div>
              <ChampionEntryList
                summonerChampionWinrateInfo={summonerChampionWinrateInfo}
                championsInfo={championsInfo}
                queueId={420}
              ></ChampionEntryList>
            </div>
          </div>

          <div id="matchHistoryBlock">
            <div id="matchHistoryHeader"> MATCH HISTORY </div>
            <div id="matchList" />
            <ButtonGroup
              variant="outlined"
              sx={{
                ".MuiButtonGroup-grouped": {
                  "&:hover": {
                    color: "#C89B3C",
                    backgroundColor: "#262c33",
                    borderColor: "#C89B3C",
                  },
                  color: "#A09B8C",
                  backgroundColor: "262c33",
                  borderColor: "#C89B3C",
                },
              }}
              size="Large"
              aria-label="Basic button group"
              width="300px"
            >
              <LoadingButton
                loading={isTempLoading}
                loadingIndicator={
                  <CircularProgress sx={{ color: "#d8a841" }} size={35} />
                }
                loadingPosition="center"
                onClick={() => {
                  extendMatchHistory(
                    summonerMatchInfo,
                    region,
                    puuid,
                    setSummonerMatchInfo,
                    setIsTempLoading
                  );
                }}
              >
                Load More
              </LoadingButton>
            </ButtonGroup>
          </div>
        </div>
        {isVisible ? (
          <div
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <svg
              id="scrollUpIcon"
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m2.019 11.993c0 5.518 4.48 9.998 9.998 9.998 5.517 0 9.997-4.48 9.997-9.998s-4.48-9.998-9.997-9.998c-5.518 0-9.998 4.48-9.998 
          9.998zm1.5 0c0-4.69 3.808-8.498 8.498-8.498s8.497 3.808 8.497 8.498-3.807 8.498-8.497 8.498-8.498-3.808-8.498-8.498zm4.715-1.528s1.505-1.502
          3.259-3.255c.147-.146.338-.219.53-.219s.384.073.53.219c1.754 1.753 3.259 3.254 3.259 3.254.145.145.217.336.216.527 0 
          .191-.074.383-.22.53-.293.293-.766.294-1.057.004l-1.978-1.978v6.694c0
          .413-.336.75-.75.75s-.75-.337-.75-.75v-6.694l-1.978 1.979c-.29.289-.762.286-1.055-.007-.147-.146-.22-.338-.221-.53-.001-.19.071-.38.215-.524z"
              />
            </svg>{" "}
          </div>
        ) : null}
      </div>
    </>
  );
}

async function getGameQueues() {
  const gameQueueURL =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json";
  const gameQueueData = await apiCall(gameQueueURL);
  var queueMapping = new Map();
  for (var queue in gameQueueData) {
    queueMapping.set(gameQueueData[queue].id, gameQueueData[queue].name);
  }
  return queueMapping;
}

function copyToClipBoard(gameName, tagLine) {
  var toolTip = document.getElementById("copyToClipboardIconText");
  navigator.clipboard.writeText(decodeURIComponent(gameName) + "#" + tagLine);
  toolTip.innerHTML = "Copied!";
}

function resetCopyButton() {
  var toolTip = document.getElementById("copyToClipboardIconText");
  toolTip.innerHTML = "Copy to clipboard";
}

async function getProfileBackground(
  summonerChampionWinrateInfo,
  championsInfo
) {
  const [championId] = summonerChampionWinrateInfo.keys();
  var championName = championsInfo.get(championId).replace(/[\s\W]/g, "");
  const specialCases = {
    NunuWillump: "nunu",
    RenataGlasc: "renata",
    Wukong: "monkeyking",
  };
  championName = specialCases[championName] || championName;
  const container = document.getElementById("profileBg");

  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const champImageURL = `/lol-game-data/assets/ASSETS/Characters/${championName}/Skins/Base/Images/${championName}_splash_centered_0.jpg`;
  const extractedPath = champImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const championImage = await apiImageCall(finalURL);

  const img = document.createElement("img");
  img.src = championImage;
  container.appendChild(img);
}

/**
 * Function that displays champion winrate stats
 * for a specific game queue based on champion mastery info
 *
 * @param {Object<number, Object>} summonerChampionWinrateInfo
 * @param {Object<number, string>} championsInfo
 * @param {number} queueId
 */
async function makeChampionWinrate(
  summonerChampionWinrateInfo,
  championsInfo,
  queueId
) {
  const container = document.getElementById("championEntryList");
  if (container._reactRoot) container._reactRoot.unmount();
  container._reactRoot = createRoot(container);
  var root = container._reactRoot;
  const matchComponent = (
    <ChampionEntryList
      summonerChampionWinrateInfo={summonerChampionWinrateInfo}
      championsInfo={championsInfo}
      queueId={queueId}
    ></ChampionEntryList>
  );
  root.render(matchComponent);
}

/**
 * Driver method to enable spinner in match history
 * block and to then make match history entry components
 * to render in page
 *
 * @param {string[][]} summonerMatchInfo
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsTempLoading
 */
async function makeMatchHistory(summonerMatchInfo, setIsTempLoading) {
  setIsTempLoading(true);
  await makeMatchEntries(summonerMatchInfo, 15);
  setIsTempLoading(false);
}

/**
 * Extends match history by fetching the next 10
 * match entries that come after the last match rendered on the page
 *
 * @param {string[]} summonerMatchInfo
 * @param {string} region
 * @param {string} puuid
 * @param {React.Dispatch<React.SetStateAction<null>>} setSummonerMatchInfo
 * @param {React.Dispatch<React.SetStateAction<null>>} setIsTempLoading
 */
async function extendMatchHistory(
  summonerMatchInfo,
  region,
  puuid,
  setSummonerMatchInfo,
  setIsTempLoading
) {
  setIsTempLoading(true);

  const lastMatchDate = summonerMatchInfo.find(
    (matchObject) =>
      matchObject[0].gameID ===
      document.getElementById("matchList").lastChild.id
  )[0].gameDateSQLFormat;
  const newMatchList = await getExtendedMatchList(region, puuid, lastMatchDate);
  const newMatchInfoList = await matchInfoListDriver(
    region,
    newMatchList,
    puuid
  );

  await makeMatchEntries(newMatchInfoList, 10);
  setSummonerMatchInfo(summonerMatchInfo.concat(newMatchInfoList));
  setIsTempLoading(false);
}

/**
 * Goes through the list of match info stored
 * and create components with all the relevant
 * match information displayed
 *
 * @param {string[][]} summonerMatchInfo
 * @param {number} minLimit
 */
async function makeMatchEntries(summonerMatchInfo, minLimit) {
  const container = document.getElementById("matchList");
  const components = [];
  const promises = [];

  for (
    let counter = 0;
    counter < Math.min(minLimit, summonerMatchInfo.length);
    counter++
  ) {
    const matchComponent = document.createElement("div");
    matchComponent.setAttribute("class", "matchHistoryContainer");
    matchComponent.setAttribute("id", summonerMatchInfo[counter][0].gameID);
    matchComponent.innerHTML = ``;
    container.append(matchComponent);

    const root = createRoot(matchComponent);

    const entryComponent = (
      <MatchEntry
        summonerMatchInfo={summonerMatchInfo}
        counter={counter}
        gameQueues={gameQueues}
      ></MatchEntry>
    );

    root.render(entryComponent);
    matchComponent.style.display = "none";
    components.push(matchComponent);
    promises.push(getAllAssets(summonerMatchInfo, counter, matchComponent));
  }
  await Promise.all(promises);
  components.forEach((component) => {
    component.style.display = "flex";
  });
}

/**
 * Driver method that sends API calls to fetch
 * all image assets related to the match and
 * the participants
 *
 * @param {string[][]} summonerMatchInfo
 * @param {number} counter
 * @param {HTMLDivElement} component
 */
async function getAllAssets(summonerMatchInfo, counter, component) {
  await getSummonerSpellAssets(
    summonerMatchInfo[counter][1].summoner1Id,
    summonerMatchInfo[counter][1].summoner2Id,
    ".spellsImages",
    component
  );
  await getSummonerRuneAssets(
    summonerMatchInfo[counter][1].perks.styles[0].selections[0].perk,
    summonerMatchInfo[counter][1].perks.styles[1].style,
    ".runeImages",
    component
  );
  await getItemAssets(summonerMatchInfo[counter][1], ".itemImages", component);
  await getChampionAssets(
    summonerMatchInfo[counter][1].championId,
    ".championImage",
    component
  );
  await getOtherPlayerAssets(
    summonerMatchInfo[counter][2],
    ".otherPlayers",
    component
  );
}

/**
 * Driver method to build the main summoner profile
 * block with info regarding ranked mode and their gameplay
 *
 * @param {string[]} summonerInfo
 * @param {string[][]} summonerRankedInfo
 * @param {string[][]} summonerMatchInfo
 * @param {Object<number, Object[]>} summonerChampionWinrateInfo
 * @param {Object<number, string>} championsInfo
 */
async function makeSummonerProfile(
  summonerInfo,
  summonerRankedInfo,
  summonerMatchInfo,
  summonerChampionWinrateInfo,
  championsInfo
) {
  makeSummonerBadges(
    summonerMatchInfo,
    summonerChampionWinrateInfo,
    championsInfo
  );
  await getProfileBackground(summonerChampionWinrateInfo, championsInfo);
  await makeProfileIcon(summonerInfo);
  await makeRankedEmblems(summonerRankedInfo);
}

/**
 * Driver method to display badges on profile block
 * that represent key information about the player
 * and his performance
 *
 * @param {string[][]} summonerMatchInfo
 * @param {Object<number, Object[]>} summonerChampionWinrateInfo
 * @param {Object<number, string>} championsInfo
 */
function makeSummonerBadges(
  summonerMatchInfo,
  summonerChampionWinrateInfo,
  championsInfo
) {
  const summComponent = document.getElementById("summonerBlock");
  const root = createRoot(summComponent.querySelector(".summonerChips"));
  const allSummonerChips = [];

  allSummonerChips.push(
    makeMainRoleBadge(summonerMatchInfo),
    makeMillionBadge(summonerChampionWinrateInfo, championsInfo),
    //makeMostSkilledBadge(championsInfo, summonerChampionWinrateInfo),
    makeMostPlayedBadge(summonerChampionWinrateInfo, championsInfo),
    makeStreakBadge(summonerMatchInfo)
  );

  root.render(<>{allSummonerChips}</>);
}

/**
 * Gathers most played position in ranked from
 * summoner match info and displays it on badge
 *
 * @param {string[][]} summonerMatchInfo
 * @returns {React.ComponentType}
 */
function makeMainRoleBadge(summonerMatchInfo) {
  const rolesValues = new Map();
  var mostPlayedRole = "SUPPORT";
  rolesValues.set(mostPlayedRole, 0);
  for (let i = 0; i < summonerMatchInfo.length; i++) {
    var role = summonerMatchInfo[i][1].teamPosition;
    if (role == "UTILITY") role = "SUPPORT";
    else role = summonerMatchInfo[i][1].teamPosition;
    const count = rolesValues.get(role) || 0;
    rolesValues.set(role, count + 1);
  }

  for (const [role, count] of rolesValues) {
    if (rolesValues.get(role) > rolesValues.get(mostPlayedRole))
      mostPlayedRole = role;
  }

  mostPlayedRole = mostPlayedRole
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
  return (
    <Chip
      key={mostPlayedRole}
      label={`Main ${mostPlayedRole}`}
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor: "#c89b3c",
        backgroundColor: "#1b1f24",
        color: "#c89b3c",
      }}
    />
  );
}

/**
 * Iterates first couple champions on their mastery info
 * to determine which ones have a million plus mastery points
 * and then displays it on badge
 *
 * @param {Object<number, Object[]>} summonerChampionWinrateInfo
 * @param {Object<number, string>} championsInfo
 * @returns {React.ComponentType}
 */
function makeMillionBadge(summonerChampionWinrateInfo, championsInfo) {
  const summonerChips = [];

  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    if (value.championPoints < 1000000) break;

    summonerChips.push(
      <Chip
        key={id}
        label={`${championsInfo.get(id)} Million`}
        variant="outlined"
        sx={{
          borderRadius: "8px",
          borderColor: "#c89b3c",
          backgroundColor: "#1b1f24",
          color: "#c89b3c",
        }}
      />
    );
  }
  return summonerChips;
}

function makeMostSkilledBadge(championsInfo, summonerChampionWinrateInfo) {
  var [bestChampName, bestChampWinrate] = ["null", 0];
  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    const normalWinrate = value.winrateMapping.get(490)[2];
    const soloWinrate = value.winrateMapping.get(420)[2];
    const flexWinrate = value.winrateMapping.get(440)[2];
    const sum = (normalWinrate + soloWinrate + flexWinrate) / 3;
    if (sum > bestChampWinrate) {
      bestChampName = championsInfo.get(id);
      bestChampWinrate = sum;
    }
  }

  if (bestChampName == "null") return;
  return (
    <Chip
      key={`Best ${bestChampName}`}
      label={`Skilled ${bestChampName}`}
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor: "#c89b3c",
        backgroundColor: "#1b1f24",
        color: "#c89b3c",
      }}
    />
  );
}

/**
 * Scans games played on all champs in all modes
 * to determine the top champion with the most games played
 * and then displays it on a badge
 *
 * @param {Object<number, Object[]>} summonerChampionWinrateInfo
 * @param {Object<number, string>} championsInfo
 * @returns {React.ComponentType}
 */
function makeMostPlayedBadge(summonerChampionWinrateInfo, championsInfo) {
  var [bestChampName, bestChampGames] = [null, 0];
  for (const [id, value] of summonerChampionWinrateInfo.entries()) {
    const normalGames = value.normalGames;
    const soloGames = value.rankedSoloGames;
    const flexGames = value.rankedFlexGames;
    const sum = normalGames + soloGames + flexGames;
    if (sum > bestChampGames) {
      bestChampName = championsInfo.get(id);
      bestChampGames = sum;
    }
  }

  if (bestChampName == null) return;
  return (
    <Chip
      key={`OTP ${bestChampName}`}
      label={`OTP ${bestChampName}`}
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor: "#c89b3c",
        backgroundColor: "#1b1f24",
        color: "#c89b3c",
      }}
    />
  );
}

/**
 * Scans games until the win outcome changes to
 * determine if a player is on a winning streak or
 * a losing streak and displays it on a badge
 *
 * @param {string[][]} summonerMatchInfo
 * @returns {React.ComponentType}
 */
function makeStreakBadge(summonerMatchInfo) {
  const streakType = summonerMatchInfo[0][1].win;
  var streakAmount = 0;

  for (let i = 0; i < summonerMatchInfo.length; i++) {
    if (summonerMatchInfo[i][1].win != streakType) {
      streakAmount = i;
      break;
    }
  }

  if (streakAmount < 3) return;
  return (
    <Chip
      key={streakType}
      label={streakType ? `Winning streak` : `Losing streak`}
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor: "#c89b3c",
        backgroundColor: "#1b1f24",
        color: "#c89b3c",
      }}
    />
  );
}

/**
 * API call to retrieve the profile icon image
 * and then display it on a profile component
 *
 * @param {string[]} summonerInfo
 */
async function makeProfileIcon(summonerInfo) {
  const container = document.getElementById("profileIconGroupContainer");

  const component = document.createElement("div");
  component.setAttribute("class", "profileIconGroup");

  component.innerHTML = `
    <div id="summonerIcon"></div>
    <div id="level">${summonerInfo[1]}</div>
    `;

  const imgURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerInfo[2]}.jpg`;
  const profileIconImage = await apiImageCall(imgURL);
  const img = (
    <Image src={profileIconImage} width={120} height={120} alt="Profile Icon" />
  );
  const profileIconImageComponent = component.querySelector("#summonerIcon");
  const root = createRoot(profileIconImageComponent);

  root.render(img);
  container.appendChild(component);
}

/**
 * Driver method to retrieve ranked emblem image assets
 * and append them to profile components
 *
 * @param {string[]} summonerRankedInfo
 */
async function makeRankedEmblems(summonerRankedInfo) {
  if (summonerRankedInfo[0] !== "Unranked")
    await makeRankedEmblem(summonerRankedInfo[0], "rankedFlex");
  if (summonerRankedInfo[1] !== "Unranked")
    await makeRankedEmblem(summonerRankedInfo[1], "rankedSolo");
}

/**
 * Fetches ranked emblem image asset through API call to
 * server to send the static image or to a third party API
 * to retrieve the image and append it to a component
 *
 * @param {JSON} summonerRankedInfo
 * @param {string} containerName
 */
async function makeRankedEmblem(summonerRankedInfo, containerName) {
  const container = document.getElementById(containerName);
  const component = document.createElement("div");
  component.setAttribute("class", "rankedEmblem");

  const imgURL = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${summonerRankedInfo.rankedTier.toLowerCase()}.png`;
  const rankedIconImage = await apiImageCall(imgURL);

  const img = document.createElement("img");
  img.src = rankedIconImage;

  component.appendChild(img);
  container.appendChild(component);
}

/**
 * Retrieves champion image assets through API call to
 * server to send the static image or to a third party API
 * to retrieve the image and append it to a component
 *
 * @param {number} championId
 * @param {string} insideClass
 * @param {HTMLDivElement} parentComponent
 */
async function getChampionAssets(championId, insideClass, parentComponent) {
  const championDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
  const championData = await apiCall(championDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const champImageURL = championData.squarePortraitPath;
  const extractedPath = champImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const championImage = await apiImageCall(finalURL);

  const img = (
    <Image src={championImage} width={30} height={30} alt={championData.name} />
  );
  const championImageComponent = parentComponent.querySelector(insideClass);
  const root = createRoot(championImageComponent);

  root.render(img);
}

/**
 * Driver method that gets JSON data from a URL
 * and uses it to get summoner image assets
 *
 * @param {string} summoner1Id
 * @param {string} summoner2Id
 * @returns {HTMLImageElement[]}
 */
async function getSummonerSpellAssets(
  summoner1Id,
  summoner2Id,
  divClass,
  component
) {
  const summonerSpellsURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json`;
  const summonerSpellsData = await apiCall(summonerSpellsURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;

  const img1 = await getSummonerSpellImage(
    summonerSpellsData,
    summoner1Id,
    baseImageURL
  );
  const img2 = await getSummonerSpellImage(
    summonerSpellsData,
    summoner2Id,
    baseImageURL
  );

  const spellsImagesComponent = component.querySelector(divClass);
  const root = createRoot(spellsImagesComponent);
  root.render([img1, img2]);
}

/**
 * Executes API call to get image data
 * and return image component from it
 *
 * @param {JSON} summonerSpellsData
 * @param {string} spellID
 * @param {string} baseImageURL
 * @returns {HTMLImageElement}
 */
async function getSummonerSpellImage(
  summonerSpellsData,
  spellID,
  baseImageURL
) {
  const spellObject = summonerSpellsData.find((spell) => spell.id === spellID);
  const parts = spellObject.iconPath.split("/");
  const summonerSpellImageURL = spellObject.iconPath;
  const extractedPath = summonerSpellImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const summonerSpellImage = await apiImageCall(finalURL);

  const img = (
    <Image
      src={summonerSpellImage}
      width={35}
      height={35}
      alt="Summoner Spell Icon"
    />
  );

  return img;
}

/**
 * Driver method to get rune image files and render
 * HTMLImageElement components
 *
 * @param {number} mainRuneID
 * @param {number} secondaryRuneID
 * @param {string} divClass
 * @param {HTMLDivElement} component
 */
async function getSummonerRuneAssets(
  mainRuneID,
  secondaryRuneID,
  divClass,
  component
) {
  const runeImages = await Promise.all([
    getRuneImage(mainRuneID, false),
    getRuneImage(secondaryRuneID, true),
  ]);

  const summonerRunesImagesComponent = component.querySelector(divClass);
  const root = createRoot(summonerRunesImagesComponent);

  root.render(<>{runeImages}</>);
}

/**
 * Sends API call to gather JSON data for runes based on it's type
 * (primary or secondary), sends API call to retrieve image from the iconpath
 * in the JSON data and then creates a HTMLImageElement to append the file image
 *
 * @param {number} runeID
 * @param {boolean} isSecondary
 */
async function getRuneImage(runeID, isSecondary) {
  const runeDataURL = isSecondary
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`
    : `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`;
  const summonerRuneData = await apiCall(runeDataURL);
  const runeObject = isSecondary
    ? summonerRuneData.styles.find((rune) => rune.id === runeID)
    : summonerRuneData.find((rune) => rune.id === runeID);

  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  const runeImageURL = runeObject.iconPath;

  const extractedPath = runeImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const summonerRuneImage = await apiImageCall(finalURL);

  var img;
  if (!isSecondary) {
    img = (
      <Image
        src={summonerRuneImage}
        width={40}
        height={40}
        alt={"Primary Rune Icon"}
        id={"primaryRune"}
        key={"Primary Rune"}
      />
    );
  } else {
    img = (
      <Image
        src={summonerRuneImage}
        width={22}
        height={22}
        alt={"Secondary Rune Icon"}
        id={"secondaryRune"}
        key={"Secondary Rune"}
      />
    );
  }

  return img;
}

/**
 * Driver method that sends API call to retrieve item JSON data
 * in order to get icon paths based on item ID
 *
 * @param {string[]} summonerInfo
 * @param {string} divClass
 * @param {HTMLDivElement} component
 */
async function getItemAssets(summonerInfo, divClass, component) {
  const itemDataURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json`;
  const summonerItemData = await apiCall(itemDataURL);
  const baseImageURL = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/`;
  var itemIds = [
    summonerInfo.item0,
    summonerInfo.item1,
    summonerInfo.item2,
    summonerInfo.item3,
    summonerInfo.item4,
    summonerInfo.item5,
    summonerInfo.item6,
  ];

  var emptyImagesCounter = 0;
  const imagesArray = await Promise.all(
    itemIds.map(async (itemId, index) => {
      if (itemId !== 0) {
        const image = await getSummonerItemImage(
          summonerItemData,
          itemId,
          baseImageURL
        );
        return (
          <Image
            src={image}
            width={45}
            height={45}
            alt={`Summoner Item ${itemId}`}
            key={`${itemId}-${index}`}
          />
        );
      } else {
        emptyImagesCounter++;
        return null;
      }
    })
  );

  const itemsImagesComponent = component.querySelector(divClass);
  const root = createRoot(itemsImagesComponent);
  root.render(
    <>
      {imagesArray}
      {[...Array(emptyImagesCounter)].map((_, index) => (
        <div key={`empty-${index}`} className="emptyItem" />
      ))}
    </>
  );
}

/**
 * Queries JSON data to get URL for the icon path of
 * a specific item. API call is sent to that URL and
 * a HTMLImageElement is returned with that image on it
 *
 * @param {JSON} summonerItemData
 * @param {number} itemID
 * @param {string} baseImageURL
 * @returns {HTMLImageElement}
 */
async function getSummonerItemImage(summonerItemData, itemID, baseImageURL) {
  const itemObject = summonerItemData.find((item) => item.id === itemID);
  const summonerItemImageURL = itemObject.iconPath;

  const extractedPath = summonerItemImageURL
    .replace("/lol-game-data/assets/", "")
    .toLowerCase();
  const finalURL = baseImageURL + extractedPath;
  const summonerItemImage = await apiImageCall(finalURL);
  return summonerItemImage;
}

/**
 * Creates HTMLDivElement entry to display player name and champion picture
 * retrieved from API call
 *
 * @param {string[][]} participantsInfo
 * @param {string} divClass
 * @param {HTMLDivElement} component
 */
async function getOtherPlayerAssets(participantsInfo, divClass, component) {
  for (const participantInfo of participantsInfo) {
    const playerName = participantInfo.riotIdGameName;
    const playerTagLine = participantInfo.riotIdTagline;

    const playerComponent = document.createElement("div");
    playerComponent.setAttribute("class", "player");

    checkIfOwnPlayer(playerName, playerTagLine, playerComponent);

    const playerParentComponent = component.querySelector(divClass);
    playerParentComponent.append(playerComponent);

    await getChampionAssets(
      participantInfo.championId,
      ".playerImage",
      playerComponent
    );
  }
}

/**
 * Check to see if the player is the one being displayed on profile
 * in order to highlight it with a different class name
 *
 * @param {string} playerName
 * @param {string} playerTagLine
 * @param {HTMLDivElement} playerComponent
 */
function checkIfOwnPlayer(playerName, playerTagLine, playerComponent) {
  if (playerName == ownUsername) {
    playerComponent.innerHTML = `
      <div class="playerImage" id="ownImage"></div>
      <a class="ownUsername" href="${playerName}-${playerTagLine}" target="_blank">${playerName}</a> 
      <span class="tooltip-text">${playerName} #${playerTagLine}</span>

      `;
  } else {
    playerComponent.innerHTML = `
      <div class="playerImage"></div>
      <a class="playerUsername" href="${playerName}-${playerTagLine}">${playerName}</a>
      <span class="tooltip-text">${playerName} #${playerTagLine}</span>
      `;
  }
}

/**
 * Driver method to update games played and winrate percentage
 * based on ranked game mode (solo, flex)
 *
 * @param {number} gameQueue
 * @param {number} winrateNumber
 */
function loadWinrate(gameQueue, winrateNumber) {
  var totalGames = 0;
  var winratePercentage = 0;

  if (gameQueue.rankedGames != undefined) {
    totalGames = gameQueue.rankedGames;
    winratePercentage = winrateNumber;
  }

  updateProgressBar("games", totalGames, `${totalGames}`);
  updateProgressBar("winrate", winratePercentage, `${winratePercentage}%`);
}

/**
 * Button method to change winrate and games played
 * value on the circular progress bars
 *
 * @param {string} elementId
 * @param {number} value
 * @param {string} text
 */
function updateProgressBar(elementId, value, text) {
  const progressbarTextElement = document.querySelector(
    `#${elementId} .CircularProgressbar-text`
  );
  const progressbarElement = document.querySelector(
    `#${elementId} .CircularProgressbar-path`
  );

  progressbarTextElement.textContent = text;
  if (elementId == "games")
    progressbarElement.style.strokeDashoffset = value > 0 ? 0 : 298.451;
  else progressbarElement.style.strokeDashoffset = 298.451 * (1 - value / 100);
}

/**
 * Formats match info list into an array of value points
 * with labels to display on the LineChart component
 *
 * @param {string[][]} summonerMatchInfo
 * @param {React.Dispatch<React.SetStateAction<null>>} setgraphData
 */
function getGraphDates(summonerMatchInfo, setgraphData) {
  const dateMap = new Map();
  const reversedMatchInfo = [...summonerMatchInfo].reverse();

  for (const matchInfo of reversedMatchInfo) {
    if (matchInfo[0].gameDuration < 300) continue;
    const formattedDate = matchInfo[0].gameDateSQLFormat.split(" ")[0];
    const gamePoint = matchInfo[1].win ? 1 : -1;
    const dateData = dateMap.get(formattedDate);

    const wins =
      gamePoint > 0 ? (dateData?.[0] ?? 0) + gamePoint : dateData?.[0] ?? 0;

    const losses =
      gamePoint < 0 ? (dateData?.[1] ?? 0) + gamePoint : dateData?.[1] ?? 0;
    const total = wins + losses;
    dateMap.set(formattedDate, [wins, losses, total, `W:${wins} L:${losses}`]);
  }

  const dates = Array.from(dateMap, ([date, [wins, losses, value, label]]) => ({
    date,
    value,
    label,
  }));

  setgraphData(dates);
}

export default Dashboard;
