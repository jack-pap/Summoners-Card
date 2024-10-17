"use client";
import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    puuid: "",
    gameName: "",
    tagLine: "",
    summonerInfo: "",
    rankedInfo: "",
    matchInfoList: "",
    summonerWinrate: "",
    masteryInfo: "",
    champions: "",
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
