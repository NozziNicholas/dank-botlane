import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";
import { ChampionCard } from "@/components/ChampionCard";
import { useChampions } from "@/hooks/useChampions";
import { useRuneData } from "@/hooks/useRuneData";
import { useItemData } from "@/hooks/useItemData";

export default function Home() {
  const { carry, support, patch, fetchChampionData } = useChampions();
  const runeData = useRuneData(patch);
  const itemData = useItemData(patch);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-dank-primary">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full h-full">
        <div className="flex flex-col gap-[32px] items-center w-full h-1/5">
          <Button
            onClick={fetchChampionData}
            className="cursor-pointer min-w-[200px] h-[60px] mx-auto"
            variant={"dank"}
            size={"lg"}
          >
            Let&apos;s get Dank
            <Hammer className="size-8" />
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-full h-full justify-center items-center">
          {carry && (
            <ChampionCard
              champion={carry}
              patch={patch}
              runeData={runeData}
              itemData={itemData}
            />
          )}
          {support && (
            <ChampionCard
              champion={support}
              patch={patch}
              runeData={runeData}
              itemData={itemData}
            />
          )}
        </div>
      </main>
    </div>
  );
}
