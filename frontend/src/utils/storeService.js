import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSummonerStore = create(
  persist(
    (set, get) => ({
      summonerData: null,
      setSummonerData: (summonerData) => set({ summonerData }),
    }),
    {
      name: "summoner-store",
    }
  )
);

export default useSummonerStore;
