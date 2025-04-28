"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SummonerSpellSelector({
  summonerSpells,
  patch,
  onSelect,
  label = "Select summoner spell...",
  disabledSpells = [], // Array of spell IDs that are already selected
  selectedChampion = null, // Add this prop to track the selected champion
}) {
  const [open, setOpen] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset spell selection when champion changes
  useEffect(() => {
    setSelectedSpell(null);
    setSearchQuery("");
  }, [selectedChampion]);

  // Get spells array from the data
  const spellsArray = summonerSpells?.data
    ? Object.values(summonerSpells.data).filter((spell) =>
        spell.modes.includes("CLASSIC")
      )
    : [];

  // Enhanced search function that checks only the name property
  const enhancedSearch = (spell, query) => {
    if (!query) return true;

    const searchTerm = query.toLowerCase().trim();

    // Check only the name property
    if (spell.name && spell.name.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false;
  };

  // Filter spells based on enhanced search
  const filteredSpells = spellsArray.filter((spell) =>
    enhancedSearch(spell, searchQuery)
  );

  // Handle spell selection
  const handleSelect = (spell) => {
    if (!spell) return;

    setSelectedSpell(spell.id);
    onSelect(spell);
    setOpen(false);
  };

  // Handle clearing selection
  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedSpell(null);
    onSelect(null);
    setOpen(false);
  };

  // Find the selected spell data
  const selectedSpellData = selectedSpell
    ? spellsArray.find((spell) => spell.id === selectedSpell)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          {selectedSpell && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear(e);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedSpellData && (
                <div className="relative h-6 w-6 overflow-hidden rounded-full ml-6">
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${selectedSpellData.image.full}`}
                    alt={selectedSpellData.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span>{selectedSpellData?.name || label}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search summoner spell..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No summoner spell found.</CommandEmpty>
            <CommandGroup>
              {filteredSpells.length > 0 ? (
                filteredSpells.map((spell) => {
                  if (!spell?.id) return null;

                  const isDisabled = disabledSpells.includes(spell.id);
                  return (
                    <CommandItem
                      key={spell.id}
                      value={spell.id}
                      onSelect={() => !isDisabled && handleSelect(spell)}
                      disabled={isDisabled}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full">
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell.image.full}`}
                            alt={spell.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{spell.name || ""}</span>
                      </div>
                      {selectedSpell === spell.id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </CommandItem>
                  );
                })
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No spells match your search
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
