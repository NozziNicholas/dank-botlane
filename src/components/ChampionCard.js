import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useImageCache } from "@/hooks/useImageCache";
import { useState, useEffect } from "react";

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
        {/* Champion Image Row */}
        <div className="flex gap-4 mb-4">
          <div className="w-36 h-auto">
            <Image
              src={imageUrls.champion || TRANSPARENT_PLACEHOLDER}
              alt={champion.name}
              width={150}
              height={45}
              className="rounded-sm shadow-md"
              loading="lazy"
              unoptimized
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.classList.add(
                  "bg-lol-item-bg",
                  "rounded-sm",
                  "w-[150px]",
                  "h-[45px]"
                );
              }}
            />
          </div>

          {/* Main content aside champion image */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Summoners */}
            <div className="mb-2">
              <div className="text-sm text-white mb-2">Summoners</div>
              <div className="flex gap-2">
                <div className="w-8 h-8">
                  <Image
                    src={imageUrls.summoners.d || TRANSPARENT_PLACEHOLDER}
                    alt="Summoner D"
                    width={32}
                    height={32}
                    className="rounded-sm"
                    loading="lazy"
                    unoptimized
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add(
                        "bg-lol-item-bg",
                        "rounded-sm"
                      );
                    }}
                  />
                </div>
                <div className="w-8 h-8">
                  <Image
                    src={imageUrls.summoners.f || TRANSPARENT_PLACEHOLDER}
                    alt="Summoner F"
                    width={32}
                    height={32}
                    className="rounded-sm"
                    loading="lazy"
                    unoptimized
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add(
                        "bg-lol-item-bg",
                        "rounded-sm"
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Skill Order */}
            <div>
              <div className="text-sm text-white mb-2">Skill Order</div>
              <div className="flex gap-1 flex-wrap mb-1">
                {champion.skillOrder.map((skill, index) => (
                  <div key={index} className="w-8 h-8 relative">
                    <Image
                      src={
                        (imageUrls.spells &&
                          imageUrls.spells[
                            { Q: 0, W: 1, E: 2, R: 3 }[skill]
                          ]) ||
                        TRANSPARENT_PLACEHOLDER
                      }
                      alt={skill}
                      width={32}
                      height={32}
                      className="rounded-sm"
                      loading="lazy"
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = "none";
                        const parent = e.target.parentNode;
                        parent.classList.add(
                          "bg-lol-item-bg",
                          "rounded-sm",
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Runes Section */}
        <div className="mb-4">
          <div className="text-sm text-white mb-2 border-b border-lol-item-border pb-1">
            Runes
          </div>
          <div className="flex gap-6 mt-2">
            {/* Primary Runes */}
            <div>
              <div className="text-sm text-white opacity-75 mb-2">Primary</div>
              <div className="flex gap-2">
                {champion.runes.primary.map((rune, index) => (
                  <div key={index} className="w-[34px] h-[34px]">
                    <Image
                      src={
                        imageUrls.runes?.primary?.[index] ||
                        TRANSPARENT_PLACEHOLDER
                      }
                      alt={`Primary Rune ${index + 1}`}
                      width={34}
                      height={34}
                      className="rounded-sm"
                      loading="lazy"
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add(
                          "bg-lol-item-bg",
                          "rounded-sm"
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Runes */}
            <div>
              <div className="text-sm text-white opacity-75 mb-2">
                Secondary
              </div>
              <div className="flex gap-2">
                {champion.runes.secondary.map((rune, index) => (
                  <div key={index} className="w-[34px] h-[34px]">
                    <Image
                      src={
                        imageUrls.runes?.secondary?.[index] ||
                        TRANSPARENT_PLACEHOLDER
                      }
                      alt={`Secondary Rune ${index + 1}`}
                      width={34}
                      height={34}
                      className="rounded-sm"
                      loading="lazy"
                      unoptimized
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add(
                          "bg-lol-item-bg",
                          "rounded-sm"
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="grid grid-cols-3 gap-4">
          {/* Starting Item */}
          <div>
            <div className="text-sm text-white opacity-75 mb-2">Starting</div>
            <div className="w-[34px] h-[34px]">
              <Image
                src={imageUrls.startingItem || TRANSPARENT_PLACEHOLDER}
                alt="Starting Item"
                width={34}
                height={34}
                className="rounded-sm"
                loading="lazy"
                unoptimized
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.classList.add(
                    "bg-lol-item-bg",
                    "rounded-sm"
                  );
                }}
              />
            </div>
          </div>

          {/* Core Items */}
          <div>
            <div className="text-sm text-white opacity-75 mb-2">Core</div>
            <div className="flex gap-2">
              {champion.items.map((item, index) => (
                <div key={index} className="w-[34px] h-[34px]">
                  <Image
                    src={imageUrls.items?.[index] || TRANSPARENT_PLACEHOLDER}
                    alt={`Item ${index + 1}`}
                    width={34}
                    height={34}
                    className="rounded-sm"
                    loading="lazy"
                    unoptimized
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add(
                        "bg-lol-item-bg",
                        "rounded-sm"
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Boots */}
          <div>
            <div className="text-sm text-white opacity-75 mb-2">Boots</div>
            <div className="w-[34px] h-[34px]">
              <Image
                src={imageUrls.items?.[5] || TRANSPARENT_PLACEHOLDER}
                alt="Boots"
                width={34}
                height={34}
                className="rounded-sm"
                loading="lazy"
                unoptimized
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.classList.add(
                    "bg-lol-item-bg",
                    "rounded-sm"
                  );
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
