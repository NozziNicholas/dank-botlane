import { useState, useEffect } from "react";
import axios from "axios";

export const useChampions = () => {
  const [carry, setCarry] = useState(null);
  const [support, setSupport] = useState(null);
  const [patch, setPatch] = useState(null);
  const [champions, setChampions] = useState(null);
  const [championList, setChampionList] = useState(null);

  useEffect(() => {
    axios
      .get("https://ddragon.leagueoflegends.com/api/versions.json")
      .then((res) => {
        setPatch(res.data[0]);
      });
  }, []);

  useEffect(() => {
    if (patch) {
      axios
        .get(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`
        )
        .then((res) => {
          setChampions(res.data.data);
          setChampionList(Object.keys(res.data.data));
        });
    }
  }, [patch]);

  const fetchChampionData = async (
    carryChampion,
    supportChampion,
    selectedCombo
  ) => {
    const [carryRes, supportRes] = await Promise.all([
      axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${carryChampion}.json`
      ),
      axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${supportChampion}.json`
      ),
    ]);

    const carryData = Object.values(carryRes.data.data)[0];
    const supportData = Object.values(supportRes.data.data)[0];

    setCarry({
      name: carryData.name,
      key: carryData.key,
      id: carryData.id,
      skillOrder: selectedCombo.carry.skillOrder,
      spellImgs: carryData.spells.map((spell) => spell.image.full),
    });

    setSupport({
      name: supportData.name,
      key: supportData.key,
      id: supportData.id,
      skillOrder: selectedCombo.support.skillOrder,
      spellImgs: supportData.spells.map((spell) => spell.image.full),
    });
  };

  return {
    carry,
    support,
    patch,
    champions,
    championList,
    fetchChampionData,
  };
};
