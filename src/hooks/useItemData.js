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

        // Process the data to ensure it's in the correct format
        const processedData = {
          ...data,
          data: Object.entries(data.data).reduce((acc, [id, item]) => {
            // Add the id to the item object for easier reference
            acc[id] = {
              ...item,
              id: id,
            };
            return acc;
          }, {}),
        };

        // Cache the processed data
        itemDataCache.set(patch, processedData);
        setItemData(processedData);
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
