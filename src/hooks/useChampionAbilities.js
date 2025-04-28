import { useState, useEffect } from "react";

export const useChampionAbilities = (champion, patch) => {
  const [abilities, setAbilities] = useState({
    Q: null,
    W: null,
    E: null,
    R: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbilities = async () => {
      if (!champion || !patch) {
        setAbilities({
          Q: null,
          W: null,
          E: null,
          R: null,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${champion.id}.json`
        );
        const data = await response.json();
        const championData = Object.values(data.data)[0];

        // Map abilities to their keys (Q, W, E, R)
        const mappedAbilities = {
          Q: championData.spells[0],
          W: championData.spells[1],
          E: championData.spells[2],
          R: championData.spells[3],
        };

        setAbilities(mappedAbilities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching champion abilities:", error);
        setLoading(false);
      }
    };

    fetchAbilities();
  }, [champion, patch]);

  return {
    abilities,
    loading,
  };
};
