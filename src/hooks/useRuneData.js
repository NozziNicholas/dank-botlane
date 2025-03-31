import { useState, useEffect } from "react";

const runeDataCache = new Map();

export const useRuneData = (patch) => {
  const [runeData, setRuneData] = useState(null);

  useEffect(() => {
    const fetchRuneData = async () => {
      // Check if we already have the data for this patch
      if (runeDataCache.has(patch)) {
        setRuneData(runeDataCache.get(patch));
        return;
      }

      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/runesReforged.json`
        );
        const data = await response.json();
        // Cache the data
        runeDataCache.set(patch, data);
        setRuneData(data);
      } catch (error) {
        console.error("Error fetching rune data:", error);
      }
    };

    if (patch) {
      fetchRuneData();
    }
  }, [patch]);

  return runeData;
};
