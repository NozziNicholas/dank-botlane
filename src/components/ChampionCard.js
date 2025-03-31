import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImageCache } from "@/hooks/useImageCache";
import { useState, useEffect } from "react";
import { ChampionHeader } from "./ChampionHeader";
import { RunesSection } from "./RunesSection";
import { ItemsSection } from "./ItemsSection";

// Transparent 1x1 pixel GIF base64
const TRANSPARENT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const ChampionCard = ({ champion, patch, runeData, itemData }) => {
  const { getImage } = useImageCache();
  const [imageUrls, setImageUrls] = useState({
    champion: null,
    spells: [],
    startingItem: null,
    items: [],
    runes: {
      primary: [],
      secondary: [],
    },
    summoners: {
      d: null,
      f: null,
    },
  });

  useEffect(() => {
    const loadImages = async () => {
      if (!champion || !patch) return;

      try {
        // Create all the URLs first
        const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
        const spellImageUrls = champion.spellImgs.map(
          (spell) =>
            `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell}`
        );
        const startingItemUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.startingItem}.png`;
        const itemImageUrls = champion.items.map(
          (item) =>
            `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`
        );
        const bootsImageUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.boots}.png`;

        const primaryRuneUrls = champion.runes.primary.map((rune) => {
          const runeIcon = findRuneById(rune, runeData)?.icon;
          return runeIcon
            ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
            : "";
        });

        const secondaryRuneUrls = champion.runes.secondary.map((rune) => {
          const runeIcon = findRuneById(rune, runeData)?.icon;
          return runeIcon
            ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
            : "";
        });

        const summonerDUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerD}.png`;
        const summonerFUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerF}.png`;

        // Get cached URLs using getImage
        const championImage = await getImage(championImageUrl);
        const spellImages = await Promise.all(
          spellImageUrls.map((url) => getImage(url))
        );
        const startingItemImage = await getImage(startingItemUrl);
        const itemImages = await Promise.all(
          itemImageUrls.map((url) => getImage(url))
        );
        const bootsImage = await getImage(bootsImageUrl);
        const primaryRuneImages = await Promise.all(
          primaryRuneUrls.filter((url) => url).map((url) => getImage(url))
        );
        const secondaryRuneImages = await Promise.all(
          secondaryRuneUrls.filter((url) => url).map((url) => getImage(url))
        );
        const summonerDImage = await getImage(summonerDUrl);
        const summonerFImage = await getImage(summonerFUrl);

        // Map the cached URLs to the state structure
        setImageUrls({
          champion: championImage,
          spells: spellImages,
          startingItem: startingItemImage,
          items: [...itemImages, bootsImage],
          runes: {
            primary: primaryRuneImages,
            secondary: secondaryRuneImages,
          },
          summoners: {
            d: summonerDImage,
            f: summonerFImage,
          },
        });
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [champion?.id, patch, runeData, getImage]);

  // Helper function to find rune by ID
  const findRuneById = (runeId, runeData) => {
    if (!runeData) return null;
    for (const style of runeData) {
      for (const slot of style.slots) {
        for (const rune of slot.runes) {
          if (rune.id === runeId) return rune;
        }
      }
    }
    return null;
  };

  // Helper function to find item by ID
  const findItemById = (itemId, itemData) => {
    if (!itemData) return null;
    return itemData.data[itemId];
  };

  // Helper function to map skill letter from index
  const getSkillLetter = (index) => {
    return { 0: "Q", 1: "W", 2: "E", 3: "R" }[index] || "";
  };

  return (
    <Card className="w-full md:w-2/5 h-4/5 bg-lol-card-bg border border-lol-card-border shadow-lg mx-auto">
      <CardHeader className="pb-0 pt-2">
        <CardTitle className="text-center text-xl text-white">
          {champion.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <ChampionHeader champion={champion} imageUrls={imageUrls} />
        <RunesSection runes={champion.runes} imageUrls={imageUrls} />
        <ItemsSection champion={champion} imageUrls={imageUrls} />
      </CardContent>
    </Card>
  );
};
