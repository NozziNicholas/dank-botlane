import { useState, useEffect } from "react";

const itemDataCache = new Map();

export const useItemData = (patch) => {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      // Check if we already have the data for this patch
      if (itemDataCache.has(patch)) {
        setItemData(itemDataCache.get(patch));
        return;
      }

      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/item.json`
        );
        const data = await response.json();
        // Cache the data
        itemDataCache.set(patch, data);
        setItemData(data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    if (patch) {
      fetchItemData();
    }
  }, [patch]);

  return itemData;
};
