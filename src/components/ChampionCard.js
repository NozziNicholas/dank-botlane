import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImage, useImages } from "@/hooks/useImage";
import { useState, useEffect, useMemo } from "react";
import { ChampionHeader } from "./ChampionHeader";
import { RunesSection } from "./RunesSection";
import { ItemsSection } from "./ItemsSection";
import { useTheme } from "./ThemeProvider";

export const ChampionCard = ({ champion, patch, runeData, itemData, role }) => {
  const { theme } = useTheme();
  // Helper function to find rune by ID
  const findRuneById = (runeId, runeData) => {
    if (!runeData || !Array.isArray(runeData)) return null;
    for (const style of runeData) {
      for (const slot of style.slots) {
        for (const rune of slot.runes) {
          if (rune.id === runeId) return rune;
        }
      }
    }
    return null;
  };

  // Generate URLs for all images using useMemo to prevent recalculation on every render
  const imageUrls = useMemo(() => {
    if (!champion || !patch) return {};

    // Champion image URL
    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;

    // Spell image URLs
    const spellImageUrls =
      champion.spellImgs?.map(
        (spell) =>
          `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell}`
      ) || [];

    // Item image URLs
    const startingItemUrl = champion.startingItem
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.startingItem}.png`
      : null;

    const itemImageUrls =
      champion.items?.map(
        (item) =>
          `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`
      ) || [];

    const bootsImageUrl = champion.boots
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.boots}.png`
      : null;

    // Rune image URLs
    const primaryRuneUrls =
      champion.runes?.primary && Array.isArray(champion.runes.primary)
        ? champion.runes.primary
            .map((rune) => {
              const runeIcon = findRuneById(rune, runeData)?.icon;
              return runeIcon
                ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
                : "";
            })
            .filter(Boolean)
        : [];

    const secondaryRuneUrls =
      champion.runes?.secondary && Array.isArray(champion.runes.secondary)
        ? champion.runes.secondary
            .map((rune) => {
              const runeIcon = findRuneById(rune, runeData)?.icon;
              return runeIcon
                ? `https://ddragon.leagueoflegends.com/cdn/img/${runeIcon}`
                : "";
            })
            .filter(Boolean)
        : [];

    // Summoner spell URLs
    const summonerDUrl = champion.summonerD
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerD}.png`
      : null;

    const summonerFUrl = champion.summonerF
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.summonerF}.png`
      : null;

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
  }, [champion, patch, runeData]);

  // Use SWR hooks for images
  const { imageUrl: championImage } = useImage(imageUrls.championImageUrl);
  const { imageUrls: spellImages } = useImages(imageUrls.spellImageUrls);
  const { imageUrl: startingItemImage } = useImage(imageUrls.startingItemUrl);
  const { imageUrls: itemImages } = useImages(imageUrls.itemImageUrls);
  const { imageUrl: bootsImage } = useImage(imageUrls.bootsImageUrl);
  const { imageUrls: primaryRuneImages } = useImages(imageUrls.primaryRuneUrls);
  const { imageUrls: secondaryRuneImages } = useImages(
    imageUrls.secondaryRuneUrls
  );
  const { imageUrl: summonerDImage } = useImage(imageUrls.summonerDUrl);
  const { imageUrl: summonerFImage } = useImage(imageUrls.summonerFUrl);

  // Create a stable object for the component props
  const componentImageUrls = useMemo(
    () => ({
      champion: championImage,
      spells: spellImages,
      startingItem: startingItemImage,
      items: [...itemImages, bootsImage].filter(Boolean),
      runes: {
        primary: primaryRuneImages,
        secondary: secondaryRuneImages,
      },
      summoners: {
        d: summonerDImage,
        f: summonerFImage,
      },
    }),
    [
      championImage,
      spellImages,
      startingItemImage,
      itemImages,
      bootsImage,
      primaryRuneImages,
      secondaryRuneImages,
      summonerDImage,
      summonerFImage,
    ]
  );

  // If no champion data is provided, don't render anything
  if (!champion) return null;

  return (
    <Card
      className={`w-full ${
        theme === "dark"
          ? "bg-dank-secondary border-dank-details"
          : "bg-[#d4ccb1] border-dank-details/70"
      } shadow-lg overflow-hidden md:h-3/4`}
    >
      <CardHeader className="pb-1 pt-2">
        <CardTitle
          className={`text-center text-xl ${
            theme === "dark" ? "text-dank-buttons" : "text-dank-primary"
          } font-bold`}
        >
          {champion.name} ({role})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 pt-3 pb-0">
        <ChampionHeader champion={champion} imageUrls={componentImageUrls} />
        <RunesSection runes={champion.runes} imageUrls={componentImageUrls} />
        <ItemsSection champion={champion} imageUrls={componentImageUrls} />
      </CardContent>
    </Card>
  );
};
