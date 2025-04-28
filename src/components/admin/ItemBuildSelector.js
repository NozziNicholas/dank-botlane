"use client";

import { useState } from "react";
import { ItemSelector } from "./ItemSelector";
import { Checkbox } from "@/components/ui/checkbox";

export function ItemBuildSelector({ items, patch, onItemsChange }) {
  const [selectedItems, setSelectedItems] = useState({
    starter: null,
    core: Array(5).fill(null),
    boots: null,
    noBoots: null,
  });
  const [showNoBoots, setShowNoBoots] = useState(false);

  // Get all selected item IDs for disabling
  const getAllSelectedItemIds = () => {
    const selectedIds = [];
    if (selectedItems.starter) selectedIds.push(selectedItems.starter.id);
    if (selectedItems.boots) selectedIds.push(selectedItems.boots.id);
    if (selectedItems.noBoots) selectedIds.push(selectedItems.noBoots.id);
    selectedItems.core.forEach((item) => {
      if (item) selectedIds.push(item.id);
    });
    return selectedIds;
  };

  // Handle item selection for any slot
  const handleItemSelect = (item, slotType, index = null) => {
    const newSelectedItems = { ...selectedItems };

    if (slotType === "starter") {
      newSelectedItems.starter = item;
    } else if (slotType === "boots") {
      newSelectedItems.boots = item;
      if (item) {
        setShowNoBoots(false);
        newSelectedItems.noBoots = null;
      }
    } else if (slotType === "noBoots") {
      newSelectedItems.noBoots = item;
      if (!item) {
        setShowNoBoots(false);
      }
    } else if (slotType === "core" && index !== null) {
      const newCore = [...newSelectedItems.core];
      newCore[index] = item;
      newSelectedItems.core = newCore;
    }

    setSelectedItems(newSelectedItems);
    onItemsChange?.(newSelectedItems);
  };

  // Handle checkbox change
  const handleNoBootsChange = (checked) => {
    setShowNoBoots(checked);
    if (checked) {
      const newSelectedItems = { ...selectedItems, boots: null };
      setSelectedItems(newSelectedItems);
      onItemsChange?.(newSelectedItems);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Starting Item</label>
        <ItemSelector
          items={items}
          patch={patch}
          onSelect={(item) => handleItemSelect(item, "starter")}
          label="Select starting item..."
          disabledItems={getAllSelectedItemIds()}
          slotType="starter"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Core Items</label>
        <div className="flex flex-wrap gap-2">
          {selectedItems.core.map((item, index) => (
            <ItemSelector
              key={index}
              items={items}
              patch={patch}
              onSelect={(item) => handleItemSelect(item, "core", index)}
              label={`Item ${index + 1}`}
              disabledItems={getAllSelectedItemIds()}
              slotType="core"
            />
          ))}
          {showNoBoots && (
            <ItemSelector
              items={items}
              patch={patch}
              onSelect={(item) => handleItemSelect(item, "noBoots")}
              label="Alternative Item"
              disabledItems={getAllSelectedItemIds()}
              slotType="core"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Boots</label>
            <ItemSelector
              items={items}
              patch={patch}
              onSelect={(item) => handleItemSelect(item, "boots")}
              label="Select boots..."
              disabledItems={getAllSelectedItemIds()}
              slotType="boots"
              disabled={showNoBoots}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noBoots"
              checked={showNoBoots}
              onCheckedChange={handleNoBootsChange}
            />
            <label
              htmlFor="noBoots"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              No Boots
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
