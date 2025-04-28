import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImage, useImages } from "@/hooks/useImage";
import { useState, useEffect } from "react";
import { ChampionHeader } from "./ChampionHeader";
import { RunesSection } from "./RunesSection";
import { ItemsSection } from "./ItemsSection";

export const ChampionCard = ({ champion, patch, runeData, itemData }) => {
  // State to store all image URLs
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

  // Generate URLs for all images
  const generateImageUrls = () => {
    if (!champion || !patch) return {};

    // Champion image URL
    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;

    // Spell image URLs
    const spellImageUrls = champion.spellImgs.map(
      (spell) =>
        `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell}`
    );

    // Item image URLs
    const startingItemUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.startingItem}.png`;
    const itemImageUrls = champion.items.map(
      (item) =>
        `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`
    );
    const bootsImageUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.boots}.png`;

    // Rune image URLs
    const primaryRuneUrls = champion.runes.primary
      .map((rune) => {
        const runeIcon = findRuneById(rune, runeData)?.icon;
        return runeIcon
          ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
          : "";
      })
      .filter(Boolean);

    const secondaryRuneUrls = champion.runes.secondary
      .map((rune) => {
        const runeIcon = findRuneById(rune, runeData)?.icon;
        return runeIcon
          ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
          : "";
      })
      .filter(Boolean);

    // Summoner spell URLs
    const summonerDUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerD}.png`;
    const summonerFUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerF}.png`;

    return {
      championImageUrl,
      spellImageUrls,
      startingItemUrl,
      itemImageUrls,
      bootsImageUrl,
      primaryRuneUrls,
      secondaryRuneUrls,
      summonerDUrl,
      summonerFUrl,
    };
  };

  // Get all image URLs
  const {
    championImageUrl,
    spellImageUrls,
    startingItemUrl,
    itemImageUrls,
    bootsImageUrl,
    primaryRuneUrls,
    secondaryRuneUrls,
    summonerDUrl,
    summonerFUrl,
  } = generateImageUrls();

  // Use SWR hooks for images
  const { imageUrl: championImage } = useImage(championImageUrl);
  const { imageUrls: spellImages } = useImages(spellImageUrls);
  const { imageUrl: startingItemImage } = useImage(startingItemUrl);
  const { imageUrls: itemImages } = useImages(itemImageUrls);
  const { imageUrl: bootsImage } = useImage(bootsImageUrl);
  const { imageUrls: primaryRuneImages } = useImages(primaryRuneUrls);
  const { imageUrls: secondaryRuneImages } = useImages(secondaryRuneUrls);
  const { imageUrl: summonerDImage } = useImage(summonerDUrl);
  const { imageUrl: summonerFImage } = useImage(summonerFUrl);

  // Update imageUrls state when any image URL changes
  useEffect(() => {
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
  }, [
    championImage,
    spellImages,
    startingItemImage,
    itemImages,
    bootsImage,
    primaryRuneImages,
    secondaryRuneImages,
    summonerDImage,
    summonerFImage,
  ]);

  // If no champion data is provided, don't render anything
  if (!champion) return null;

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
