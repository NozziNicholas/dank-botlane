import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ChampionCard } from "@/components/ChampionCard";
import { useChampions } from "@/hooks/useChampions";
import { useRuneData } from "@/hooks/useRuneData";
import { useItemData } from "@/hooks/useItemData";
import { useTheme } from "@/components/ThemeProvider";

export default function Home() {
  const { carry, support, patch, fetchChampionData } = useChampions();
  const { runeData } = useRuneData(patch);
  const itemData = useItemData(patch);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleFetchCombo = async () => {
    setIsLoading(true);
    try {
      await fetchChampionData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ${
        theme === "dark" ? "bg-dank-primary" : "bg-[#F5F5DC]"
      }`}
    >
      <Button
        variant="dank"
        onClick={handleFetchCombo}
        disabled={isLoading}
        className={`w-full max-w-md ${
          theme === "dark" ? "" : "bg-[#d4ccb1] hover:bg-[#d4ccb1]/90"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading...
          </>
        ) : (
          "Generate Bot Lane Combo"
        )}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {carry && (
          <ChampionCard
            champion={carry}
            patch={patch}
            runeData={runeData}
            itemData={itemData}
            role="Carry"
          />
        )}
        {support && (
          <ChampionCard
            champion={support}
            patch={patch}
            runeData={runeData}
            itemData={itemData}
            role="Support"
          />
        )}
      </div>
    </div>
  );
}
