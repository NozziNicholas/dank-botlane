import { useState, useCallback, useMemo } from "react";
import { GameImage } from "../ui/GameImage";

const getIconUrl = (icon) =>
  `https://ddragon.leagueoflegends.com/cdn/img/${icon}`;

export const RuneSelector = ({ runeData, onRuneChange }) => {
  const [primaryPathId, setPrimaryPathId] = useState(null);
  const [secondaryPathId, setSecondaryPathId] = useState(null);
  const [selectedRunes, setSelectedRunes] = useState({
    primary_rune: {
      keystone: null,
      first: null,
      second: null,
      third: null,
    },
    secondary_rune: {
      first: null,
      second: null,
    },
  });

  const updateRunes = useCallback(
    (newRunes) => {
      setSelectedRunes(newRunes);
      // Use setTimeout to ensure state update is complete before calling onRuneChange
      setTimeout(() => {
        onRuneChange?.(newRunes);
      }, 0);
    },
    [onRuneChange]
  );

  const handlePathSelect = useCallback(
    (id, isSecondary = false) => {
      if (isSecondary) {
        if (id === primaryPathId) return;
        // Clear secondary runes when deselecting or changing secondary path
        setSecondaryPathId(id === secondaryPathId ? null : id);
        const newRunes = {
          ...selectedRunes,
          secondary_rune: { first: null, second: null },
        };
        updateRunes(newRunes);
      } else {
        if (id === primaryPathId) {
          // Clear primary runes when deselecting primary path
          setPrimaryPathId(null);
          const newRunes = {
            ...selectedRunes,
            primary_rune: {
              keystone: null,
              first: null,
              second: null,
              third: null,
            },
          };
          updateRunes(newRunes);
        } else {
          // Clear primary runes when changing primary path
          setPrimaryPathId(id);
          const newRunes = {
            ...selectedRunes,
            primary_rune: {
              keystone: null,
              first: null,
              second: null,
              third: null,
            },
            // Also clear secondary runes if secondary path is the same as new primary path
            ...(secondaryPathId === id && {
              secondary_rune: { first: null, second: null },
            }),
          };
          updateRunes(newRunes);
          // Clear secondary path and runes if it's the same as new primary path
          if (secondaryPathId === id) {
            setSecondaryPathId(null);
          }
        }
      }
    },
    [primaryPathId, secondaryPathId, selectedRunes, updateRunes]
  );

  const handlePrimaryRuneSelect = useCallback(
    (runeId, slot) => {
      const newRunes = {
        ...selectedRunes,
        primary_rune: { ...selectedRunes.primary_rune, [slot]: runeId },
      };
      updateRunes(newRunes);
    },
    [selectedRunes, updateRunes]
  );

  const handleSecondaryRuneSelect = useCallback(
    (runeId, slot, slotIdx, secondaryPath) => {
      if (!secondaryPath) return;

      const newRunes = {
        ...selectedRunes,
        secondary_rune: { ...selectedRunes.secondary_rune },
      };

      // If rune is already selected, deselect it
      if (
        newRunes.secondary_rune.first === runeId ||
        newRunes.secondary_rune.second === runeId
      ) {
        if (newRunes.secondary_rune.first === runeId) {
          newRunes.secondary_rune.first = null;
        } else {
          newRunes.secondary_rune.second = null;
        }
      } else {
        // Check if there's already a rune selected in this row (slotIdx)
        const firstRuneSlot =
          secondaryPath.slots.findIndex((slot) =>
            slot.runes.some((rune) => rune.id === newRunes.secondary_rune.first)
          ) - 1;
        const secondRuneSlot =
          secondaryPath.slots.findIndex((slot) =>
            slot.runes.some(
              (rune) => rune.id === newRunes.secondary_rune.second
            )
          ) - 1;

        // If clicking a rune in the same row as first selected rune
        if (slotIdx === firstRuneSlot) {
          newRunes.secondary_rune.first = runeId;
        }
        // If clicking a rune in the same row as second selected rune
        else if (slotIdx === secondRuneSlot) {
          newRunes.secondary_rune.second = runeId;
        }
        // If no rune in this row, put it in the first empty slot
        else if (!newRunes.secondary_rune.first) {
          newRunes.secondary_rune.first = runeId;
        } else if (!newRunes.secondary_rune.second) {
          newRunes.secondary_rune.second = runeId;
        }
      }

      updateRunes(newRunes);
    },
    [selectedRunes, updateRunes]
  );

  // Add null check for runeData after all hooks
  if (!runeData || !Array.isArray(runeData)) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        Loading rune data...
      </div>
    );
  }

  const primaryPath = runeData.find((p) => p.id === primaryPathId);
  const secondaryPath = runeData.find((p) => p.id === secondaryPathId);

  return (
    <div className="w-full space-y-4">
      {/* Path Selection Row */}
      <div className="flex gap-4">
        {/* Primary Path */}
        <div className="flex-1">
          <h4 className="text-xs font-medium mb-1 text-gray-400">
            Primary Path
          </h4>
          <div className="flex gap-1">
            {runeData.map((path) => (
              <button
                key={path.id}
                onClick={() => handlePathSelect(path.id)}
                disabled={secondaryPathId === path.id}
                className={`relative p-1 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                  primaryPathId === path.id
                    ? "bg-yellow-500 ring-1 ring-yellow-300"
                    : secondaryPathId === path.id
                    ? "bg-gray-700 opacity-40 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <GameImage
                  src={getIconUrl(path.icon)}
                  alt={path.name}
                  width={32}
                  height={32}
                  className={primaryPathId === path.id ? "" : "opacity-75"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Path */}
        <div className="flex-1">
          <h4 className="text-xs font-medium mb-1 text-gray-400">
            Secondary Path
          </h4>
          <div className="flex gap-1">
            {runeData.map((path) => (
              <button
                key={path.id}
                onClick={() => handlePathSelect(path.id, true)}
                disabled={!primaryPathId || primaryPathId === path.id}
                className={`relative p-1 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                  secondaryPathId === path.id
                    ? "bg-yellow-500 ring-1 ring-yellow-300"
                    : !primaryPathId || primaryPathId === path.id
                    ? "bg-gray-700 opacity-40 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <GameImage
                  src={getIconUrl(path.icon)}
                  alt={path.name}
                  width={32}
                  height={32}
                  className={secondaryPathId === path.id ? "" : "opacity-75"}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Paths Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Primary Path Column */}
        {primaryPath ? (
          <div className="space-y-3">
            {/* Keystones */}
            <div className="space-y-1 min-h-[240px]">
              {primaryPath.slots[0].runes.map((keystone) => (
                <button
                  key={keystone.id}
                  onClick={() =>
                    handlePrimaryRuneSelect(keystone.id, "keystone")
                  }
                  className={`w-full flex items-start gap-2 p-2 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                    selectedRunes.primary_rune.keystone === keystone.id
                      ? "bg-yellow-500/20 ring-1 ring-yellow-300"
                      : "bg-gray-700/50 hover:bg-gray-600/50"
                  }`}
                >
                  <GameImage
                    src={getIconUrl(keystone.icon)}
                    alt={keystone.name}
                    width={40}
                    height={40}
                    className={
                      selectedRunes.primary_rune.keystone === keystone.id
                        ? ""
                        : "opacity-75"
                    }
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-yellow-500">
                      {keystone.name}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {keystone.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Primary Slots */}
            {primaryPath.slots.slice(1).map((slot, idx) => (
              <div key={idx} className="flex flex-wrap gap-1">
                {slot.runes.map((rune) => (
                  <button
                    key={rune.id}
                    onClick={() =>
                      handlePrimaryRuneSelect(
                        rune.id,
                        ["first", "second", "third"][idx]
                      )
                    }
                    className={`relative p-1 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                      selectedRunes.primary_rune[
                        ["first", "second", "third"][idx]
                      ] === rune.id
                        ? "bg-yellow-500/20 ring-1 ring-yellow-300"
                        : "bg-gray-700/50 hover:bg-gray-600/50"
                    }`}
                  >
                    <GameImage
                      src={getIconUrl(rune.icon)}
                      alt={rune.name}
                      width={32}
                      height={32}
                      className={
                        selectedRunes.primary_rune[
                          ["first", "second", "third"][idx]
                        ] === rune.id
                          ? ""
                          : "opacity-75"
                      }
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[240px] flex items-center justify-center text-gray-500">
            Select a primary path
          </div>
        )}

        {/* Secondary Path Column */}
        {secondaryPath ? (
          <div className="space-y-3">
            {/* Secondary Slots */}
            {secondaryPath.slots.slice(1).map((slot, slotIdx) => (
              <div key={slotIdx} className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {slot.runes.map((rune) => {
                    const isSelected =
                      selectedRunes.secondary_rune.first === rune.id ||
                      selectedRunes.secondary_rune.second === rune.id;
                    const canSelect =
                      isSelected ||
                      !selectedRunes.secondary_rune.first ||
                      !selectedRunes.secondary_rune.second;

                    return (
                      <button
                        key={rune.id}
                        onClick={() =>
                          handleSecondaryRuneSelect(
                            rune.id,
                            isSelected
                              ? selectedRunes.secondary_rune.first === rune.id
                                ? "first"
                                : "second"
                              : !selectedRunes.secondary_rune.first
                              ? "first"
                              : "second",
                            slotIdx,
                            secondaryPath
                          )
                        }
                        className={`relative p-1 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                          isSelected
                            ? "bg-yellow-500/20 ring-1 ring-yellow-300"
                            : "bg-gray-700/50 hover:bg-gray-600/50"
                        }`}
                      >
                        <GameImage
                          src={getIconUrl(rune.icon)}
                          alt={rune.name}
                          width={32}
                          height={32}
                          className={isSelected ? "" : "opacity-75"}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[240px] flex items-center justify-center text-gray-500">
            Select a secondary path
          </div>
        )}
      </div>
    </div>
  );
};
