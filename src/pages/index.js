import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";
import { ChampionCard } from "@/components/ChampionCard";
import { useChampions } from "@/hooks/useChampions";
import { championCombos } from "@/config/championCombos";

export default function Home() {
  const { carry, support, patch, fetchChampionData } = useChampions();

  const handleClick = () => {
    // Get random combo from config
    const comboKeys = Object.keys(championCombos);
    const randomComboKey =
      comboKeys[Math.floor(Math.random() * comboKeys.length)];
    const selectedCombo = championCombos[randomComboKey];

    const carryChampion = selectedCombo.carry.key;
    const supportChampion = selectedCombo.support.key;

    fetchChampionData(carryChampion, supportChampion, selectedCombo);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-dank-primary">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full h-full">
        <div className="flex flex-col gap-[32px] items-center w-full h-1/5">
          <Button
            onClick={handleClick}
            className="cursor-pointer w-1/3 h-1/3 mx-auto"
            variant={"dank"}
            size={"lg"}
          >
            Let&apos;s get Dank
            <Hammer className="size-8" />
          </Button>
        </div>
        <div className="flex flex-row gap-[32px] items-center w-full h-full">
          {carry && support && (
            <>
              <ChampionCard champion={carry} patch={patch} />
              <ChampionCard champion={support} patch={patch} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
