import { useState, useEffect } from "react";

const summonerSpellCache = new Map();

export const useSummonerSpells = (patch) => {
  const [summonerSpells, setSummonerSpells] = useState(null);

  useEffect(() => {
    const fetchSummonerSpells = async () => {
      // Check if we already have the data for this patch
      if (summonerSpellCache.has(patch)) {
        setSummonerSpells(summonerSpellCache.get(patch));
        return;
      }

      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/summoner.json`
        );
        const data = await response.json();
        // Cache the data
        summonerSpellCache.set(patch, data);
        setSummonerSpells(data);
      } catch (error) {
        console.error("Error fetching summoner spell data:", error);
      }
    };

    if (patch) {
      fetchSummonerSpells();
    }
  }, [patch]);

  return summonerSpells;
};
