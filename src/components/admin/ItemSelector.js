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

// Custom hook to fetch item image with SWR
const useItemImage = (itemId, patch) => {
  const { data, error } = useSWR(
    itemId && patch
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${itemId}.png`
      : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");
      return url;
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

export function ItemSelector({
  items,
  patch,
  onSelect,
  label = "Select item...",
  disabledItems = [], // Array of item IDs that are already selected
  slotType = "core", // "core", "starter", or "boots"
  disabled = false, // Whether the selector is disabled
}) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out items based on slot type and keep only unique names
  const filteredItemsByType = items
    ? Object.entries(items)
        // First convert to array of [key, item] pairs
        .filter(([_, item]) => {
          // Check if item builds from 3867 first
          const buildsFrom3867 = item.from && item.from.includes("3867");

          // First filter for Map 11 (Summoner's Rift) items
          // Allow items that build from 3867 even if not purchasable
          if (
            !item.maps ||
            !item.maps["11"] ||
            (!buildsFrom3867 && !item.gold.purchasable)
          ) {
            return false;
          }

          if (slotType === "starter") {
            // Starting items are typically consumables or items with low cost
            return (
              !item.tags.includes("Consumable") &&
              !item.tags.includes("Trinket") &&
              !item.tags.includes("Jungle") &&
              item.gold.base !== 0 &&
              item.gold.total <= 500
            );
          } else if (slotType === "boots") {
            return (
              item.tags.includes("Boots") &&
              item.into &&
              item.into.length > 0 &&
              item.gold.total > 500
            );
          } else {
            // For core items, exclude consumables, gold items, and boots
            const hasValidGold = item.gold.total > 500;

            return (
              !item.tags.includes("Consumable") &&
              !item.tags.includes("Boots") &&
              !item.tags.includes("Jungle") &&
              // Include items that either build from 3867 OR have valid gold
              (buildsFrom3867 || hasValidGold) &&
              // Only include final items (items that don't build into anything else)
              (!item.into || item.into.length === 0)
            );
          }
        })
        // Group items by name and take the first one from each group
        .reduce((acc, [key, item]) => {
          if (
            !acc.some(([_, existingItem]) => existingItem.name === item.name)
          ) {
            acc.push([key, item]);
          }
          return acc;
        }, [])
        // Map back to just the items
        .map(([_, item]) => item)
    : [];

  // Filter items based on search query
  const filteredItems = filteredItemsByType.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle item selection
  const handleSelect = (itemId) => {
    const item = filteredItemsByType.find((i) => i.id === itemId);
    if (!item) return;

    setSelectedItem(itemId);
    onSelect(item);
    setOpen(false);
  };

  // Handle clearing selection
  const handleClear = () => {
    setSelectedItem(null);
    onSelect(null);
    setOpen(false);
  };

  // Find the selected item data
  const selectedItemData = selectedItem
    ? filteredItemsByType.find((item) => item.id === selectedItem)
    : null;

  // Get the image URL for the selected item
  const { imageUrl: selectedItemImage } = useItemImage(selectedItem, patch);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between relative"
          disabled={disabled}
        >
          {selectedItem ? (
            <>
              {/* Clear button inside the selector on the left */}
              <div
                role="button"
                tabIndex={0}
                className="absolute cursor-pointer left-1 h-5 w-5 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear();
                  }
                }}
                aria-label="Clear selection"
              >
                <X className="h-3 w-3" />
              </div>

              <div className="flex items-center gap-2 pl-6">
                <div className="relative h-6 w-6 overflow-hidden rounded">
                  <Image
                    src={
                      selectedItemImage ||
                      `https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${selectedItem}.png`
                    }
                    alt={selectedItemData?.name || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedItemData?.name || ""}
              </div>
            </>
          ) : (
            label
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search item..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => {
                const isDisabled = disabledItems.includes(item.id);
                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => !isDisabled && handleSelect(item.id)}
                    disabled={isDisabled}
                    className={
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded">
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item.id}.png`}
                          alt={item.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{item.name || ""}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedItem === item.id ? "opacity-100" : "opacity-0"
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
