import { useState, useEffect } from "react";
import axios from "axios";

export const useChampions = () => {
  const [carry, setCarry] = useState(null);
  const [support, setSupport] = useState(null);
  const [patch, setPatch] = useState(null);
  const [champions, setChampions] = useState(null);

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
        });
    }
  }, [patch]);

  const fetchChampionData = async () => {
    try {
      // Fetch random combo from API
      const comboRes = await axios.get("/api/getRandomCombo");
      const data = comboRes.data;

      // Fetch champion data from Riot API
      const [carryRes, supportRes] = await Promise.all([
        axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${data.combo.carry_id}.json`
        ),
        axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${data.combo.support_id}.json`
        ),
      ]);

      const carryData = Object.values(carryRes.data.data)[0];
      const supportData = Object.values(supportRes.data.data)[0];

      // Transform carry data
      const carryBuild = data.build.find(
        (b) => b.champion_id === parseInt(carryData.key)
      );
      const carryItems = data.inventoryCarry.items;
      const carryRunes = data.runePageCarry;

      setCarry({
        name: carryData.name,
        key: carryData.key,
        id: carryData.id,
        skillOrder: carryBuild.skill_order.split(","),
        spellImgs: carryData.spells.map((spell) => spell.image.full),
        startingItem: carryItems.starter[0],
        items: [
          carryItems.item1.best,
          carryItems.item2.best,
          carryItems.item3.best,
          carryItems.item4.best,
          carryItems.item5.best,
        ],
        boots: carryItems.boots[0],
        runes: {
          primary: [
            carryRunes.primary_rune.keystone,
            carryRunes.primary_rune.first,
            carryRunes.primary_rune.second,
            carryRunes.primary_rune.third,
          ],
          secondary: [
            carryRunes.secondary_rune.first,
            carryRunes.secondary_rune.second,
          ],
        },
        summonerD: carryBuild.summoner_d,
        summonerF: carryBuild.summoner_f,
      });

      // Transform support data
      const supportBuild = data.build.find(
        (b) => b.champion_id === parseInt(supportData.key)
      );
      const supportItems = data.inventorySupport.items;
      const supportRunes = data.runePageSupport;

      setSupport({
        name: supportData.name,
        key: supportData.key,
        id: supportData.id,
        skillOrder: supportBuild.skill_order.split(","),
        spellImgs: supportData.spells.map((spell) => spell.image.full),
        startingItem: supportItems.starter[0],
        items: [
          supportItems.item1.best,
          supportItems.item2.best,
          supportItems.item3.best,
          supportItems.item4.best,
          supportItems.item5.best,
        ],
        boots: supportItems.boots[0],
        runes: {
          primary: [
            supportRunes.primary_rune.keystone,
            supportRunes.primary_rune.first,
            supportRunes.primary_rune.second,
            supportRunes.primary_rune.third,
          ],
          secondary: [
            supportRunes.secondary_rune.first,
            supportRunes.secondary_rune.second,
          ],
        },
        summonerD: supportBuild.summoner_d,
        summonerF: supportBuild.summoner_f,
      });
    } catch (error) {
      console.error("Error fetching champion data:", error);
    }
  };

  return {
    carry,
    support,
    patch,
    champions,
    setCarry,
    setSupport,
    fetchChampionData,
  };
};
