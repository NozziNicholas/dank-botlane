import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useImageCache } from "@/hooks/useImageCache";
import { useState, useEffect } from "react";

export const ChampionCard = ({ champion, patch }) => {
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
  });

  useEffect(() => {
    const loadImages = async () => {
      // Load champion image
      const championUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
      const championImageUrl = await getImage(championUrl);

      // Load spell images
      const spellUrls = champion.skillOrder.map((skill) => {
        const skillIndex = { Q: 0, W: 1, E: 2, R: 3 }[skill];
        return `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.spellImgs[skillIndex]}`;
      });
      const spellImageUrls = await Promise.all(
        spellUrls.map((url) => getImage(url))
      );

      // Load starting item image
      const startingItemUrl = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.startingItem}.png`;
      const startingItemImageUrl = await getImage(startingItemUrl);

      // Load core items images
      const itemUrls = champion.items.map(
        (item) =>
          `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`
      );
      const itemImageUrls = await Promise.all(
        itemUrls.map((url) => getImage(url))
      );

      // Load rune images
      const primaryRuneUrls = champion.runes.primary.map(
        (rune) =>
          `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png`
      );
      const secondaryRuneUrls = champion.runes.secondary.map(
        (rune) =>
          `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png`
      );
      const primaryRuneImageUrls = await Promise.all(
        primaryRuneUrls.map((url) => getImage(url))
      );
      const secondaryRuneImageUrls = await Promise.all(
        secondaryRuneUrls.map((url) => getImage(url))
      );

      setImageUrls({
        champion: championImageUrl,
        spells: spellImageUrls,
        startingItem: startingItemImageUrl,
        items: itemImageUrls,
        runes: {
          primary: primaryRuneImageUrls,
          secondary: secondaryRuneImageUrls,
        },
      });
    };

    loadImages();
  }, [champion, patch, getImage]);

  return (
    <Card className="w-2/5 mx-auto h-full bg-dank-secondary border border-dank-primary">
      <CardHeader>
        <CardTitle className="text-center">{champion.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* Champion Image */}
        <div className="flex justify-center">
          <Image
            src={
              imageUrls.champion ||
              `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`
            }
            alt={champion.name}
            width={150}
            height={50}
            className="rounded-lg"
          />
        </div>

        {/* Skill Order */}
        <div className="flex flex-col gap-1">
          <h3 className="text-center font-semibold text-sm">Skill Order</h3>
          <div className="flex flex-row gap-2 justify-center items-center">
            {champion.skillOrder.map((skill, index) => (
              <div key={skill} className="flex flex-col items-center">
                <Image
                  src={
                    imageUrls.spells[index] ||
                    `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${
                      champion.spellImgs[{ Q: 0, W: 1, E: 2, R: 3 }[skill]]
                    }`
                  }
                  alt={champion.name}
                  width={40}
                  height={40}
                />
                <p className="text-sm">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Starting Item */}
        <div className="flex flex-col gap-1">
          <h3 className="text-center font-semibold text-sm">Starting Item</h3>
          <div className="flex justify-center">
            <Image
              src={
                imageUrls.startingItem ||
                `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${champion.startingItem}.png`
              }
              alt="Starting Item"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Core Items */}
        <div className="flex flex-col gap-1">
          <h3 className="text-center font-semibold text-sm">Core Items</h3>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {champion.items.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={
                    imageUrls.items[index] ||
                    `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`
                  }
                  alt={`Item ${index + 1}`}
                  width={40}
                  height={40}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Runes */}
        <div className="flex flex-col gap-1">
          <h3 className="text-center font-semibold text-sm">Runes</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Primary Runes */}
            <div className="flex flex-col gap-1">
              <h4 className="text-center text-xs font-medium">Primary</h4>
              <div className="flex flex-row gap-1 justify-center">
                {champion.runes.primary.map((rune, index) => (
                  <div key={index} className="flex items-center">
                    <Image
                      src={
                        imageUrls.runes.primary[index] ||
                        `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png`
                      }
                      alt={`Primary Rune ${index + 1}`}
                      width={24}
                      height={24}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Secondary Runes */}
            <div className="flex flex-col gap-1">
              <h4 className="text-center text-xs font-medium">Secondary</h4>
              <div className="flex flex-row gap-1 justify-center">
                {champion.runes.secondary.map((rune, index) => (
                  <div key={index} className="flex items-center">
                    <Image
                      src={
                        imageUrls.runes.secondary[index] ||
                        `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png`
                      }
                      alt={`Secondary Rune ${index + 1}`}
                      width={24}
                      height={24}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
