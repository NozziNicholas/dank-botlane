"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Custom hook to fetch champion image with SWR
const useChampionImage = (championId, patch) => {
  const { data, error } = useSWR(
    championId && patch
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championId}.png`
      : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");
      return url; // Return the URL directly since Next.js Image component handles the actual loading
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 24 * 60 * 60 * 1000, // Cache for 24 hours
    }
  );

  return {
    imageUrl: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export function ChampionSelector({
  champions,
  patch,
  onSelect,
  label = "Select champion...",
  disabledChampions = [], // Array of champion IDs that are already selected for the other role
}) {
  const [open, setOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get champions array from the data
  const championsArray = champions ? Object.values(champions) : [];

  // Filter champions based on search query
  const filteredChampions = championsArray.filter((champion) =>
    champion?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle champion selection
  const handleSelect = (championId) => {
    const champion = championsArray.find((c) => c.id === championId);
    if (!champion) return;

    setSelectedChampion(championId);
    onSelect(champion);
    setOpen(false);
  };

  // Handle clearing selection
  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedChampion(null);
    onSelect(null);
    setOpen(false);
  };

  // Find the selected champion data
  const selectedChampionData = selectedChampion
    ? championsArray.find((champion) => champion.id === selectedChampion)
    : null;

  // Get the image URL for the selected champion
  const { imageUrl: selectedChampionImage } = useChampionImage(
    selectedChampion,
    patch
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between relative"
        >
          {selectedChampion ? (
            <>
              {/* Clear button inside the selector on the left */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute cursor-pointer left-1 h-5 w-5 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="flex items-center gap-2 pl-6">
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={
                      selectedChampionImage ||
                      `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${selectedChampion}.png`
                    }
                    alt={selectedChampionData?.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedChampionData?.name || ""}
              </div>
            </>
          ) : (
            label
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search champion..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No champion found.</CommandEmpty>
            <CommandGroup>
              {filteredChampions.map((champion) => {
                const isDisabled = disabledChampions.includes(champion.id);
                return (
                  <CommandItem
                    key={champion.id}
                    value={champion.id}
                    onSelect={() => !isDisabled && handleSelect(champion.id)}
                    disabled={isDisabled}
                    className={
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champion.id}.png`}
                          alt={champion.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{champion.name || ""}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedChampion === champion.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
