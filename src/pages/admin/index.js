import { useState } from "react";
import { ChampionSelector } from "@/components/admin/ChampionSelector";
import { SummonerSpellSelector } from "@/components/admin/SummonerSpellSelector";
import SkillOrderSelector from "@/components/admin/SkillOrderSelector";
import { RuneSelector } from "@/components/admin/RuneSelector";
import { ItemBuildSelector } from "@/components/admin/ItemBuildSelector";
import { useChampions } from "@/hooks/useChampions";
import { useSummonerSpells } from "@/hooks/useSummonerSpells";
import { useRuneData } from "@/hooks/useRuneData";
import { useItemData } from "@/hooks/useItemData";
import axios from "axios";

const getRuneInfo = (runeData, selectedRunes) => {
  if (!runeData || !selectedRunes || !Array.isArray(runeData)) return null;

  const primaryPath = runeData.find((path) => {
    const keystone = path.slots[0].runes.find(
      (rune) => rune.id === selectedRunes.primary_rune.keystone
    );
    return !!keystone;
  });

  const secondaryPath = runeData.find((path) => {
    const hasSecondaryRune = path.slots
      .slice(1)
      .some((slot) =>
        slot.runes.some(
          (rune) =>
            rune.id === selectedRunes.secondary_rune.first ||
            rune.id === selectedRunes.secondary_rune.second
        )
      );
    return hasSecondaryRune;
  });

  // Get names for primary runes
  const keystoneRune = primaryPath?.slots[0].runes.find(
    (rune) => rune.id === selectedRunes.primary_rune.keystone
  );
  const firstRune = primaryPath?.slots[1].runes.find(
    (rune) => rune.id === selectedRunes.primary_rune.first
  );
  const secondRune = primaryPath?.slots[2].runes.find(
    (rune) => rune.id === selectedRunes.primary_rune.second
  );
  const thirdRune = primaryPath?.slots[3].runes.find(
    (rune) => rune.id === selectedRunes.primary_rune.third
  );

  // Get names for secondary runes
  const firstSecondaryRune = secondaryPath?.slots
    .slice(1)
    .flatMap((slot) => slot.runes)
    .find((rune) => rune.id === selectedRunes.secondary_rune.first);
  const secondSecondaryRune = secondaryPath?.slots
    .slice(1)
    .flatMap((slot) => slot.runes)
    .find((rune) => rune.id === selectedRunes.secondary_rune.second);

  return {
    primaryPath: primaryPath?.name,
    secondaryPath: secondaryPath?.name,
    keystone: keystoneRune?.name,
    primaryRunes: {
      first: firstRune?.name,
      second: secondRune?.name,
      third: thirdRune?.name,
    },
    secondaryRunes: {
      first: firstSecondaryRune?.name,
      second: secondSecondaryRune?.name,
    },
  };
};

export default function Admin() {
  const { champions, patch } = useChampions();
  const summonerSpells = useSummonerSpells(patch);
  const { runeData, isLoading: runesLoading } = useRuneData(patch);
  const itemData = useItemData(patch);

  const [selectedChampions, setSelectedChampions] = useState({
    carry: null,
    support: null,
  });
  const [selectedSummonerSpells, setSelectedSummonerSpells] = useState({
    carry: { D: null, F: null },
    support: { D: null, F: null },
  });
  const [skillOrders, setSkillOrders] = useState({
    carry: [],
    support: [],
  });
  const [selectedRunes, setSelectedRunes] = useState({
    carry: {
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
    },
    support: {
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
    },
  });
  const [selectedItems, setSelectedItems] = useState({
    carry: {
      starter: null,
      core: Array(5).fill(null),
      boots: null,
    },
    support: {
      starter: null,
      core: Array(5).fill(null),
      boots: null,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle champion selection
  const handleChampionSelect = (type, champion) => {
    // Check if the champion is already selected for the other role
    const otherType = type === "carry" ? "support" : "carry";
    if (
      selectedChampions[otherType] &&
      selectedChampions[otherType].id === champion.id
    ) {
      // Don't allow selecting the same champion for both roles
      return;
    }

    // Update the selected champion
    setSelectedChampions((prev) => ({
      ...prev,
      [type]: champion,
    }));

    // Clear the summoner spells, skill order, and runes for this champion
    setSelectedSummonerSpells((prev) => ({
      ...prev,
      [type]: { D: null, F: null },
    }));
    setSkillOrders((prev) => ({
      ...prev,
      [type]: [],
    }));
    setSelectedRunes((prev) => ({
      ...prev,
      [type]: {
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
      },
    }));
  };

  // Handle rune selection
  const handleRuneChange = (type, runes) => {
    setSelectedRunes((prev) => ({
      ...prev,
      [type]: runes,
    }));
  };

  // Handle summoner spell selection
  const handleSummonerSpellSelect = (type, slot, spell) => {
    setSelectedSummonerSpells((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [slot]: spell,
      },
    }));
  };

  // Handle skill order change
  const handleSkillOrderChange = (type, newOrder) => {
    // If newOrder is a string, split it into an array
    const orderArray =
      typeof newOrder === "string" ? newOrder.split(",") : newOrder;

    // Only update if the order has actually changed
    setSkillOrders((prev) => {
      if (JSON.stringify(prev[type]) === JSON.stringify(orderArray)) {
        return prev;
      }
      return {
        ...prev,
        [type]: orderArray,
      };
    });
  };

  // Get disabled spells for a specific champion and slot
  const getDisabledSpells = (type, slot) => {
    const otherSlot = slot === "D" ? "F" : "D";
    const disabledSpells = [];

    // Only add the other slot's spell from the same champion
    if (selectedSummonerSpells[type][otherSlot]) {
      disabledSpells.push(selectedSummonerSpells[type][otherSlot].id);
    }

    return disabledSpells;
  };

  // Get disabled champions for a specific role
  const getDisabledChampions = (type) => {
    const otherType = type === "carry" ? "support" : "carry";
    const disabledChampions = [];

    // Add the champion from the other role
    if (selectedChampions[otherType]) {
      disabledChampions.push(selectedChampions[otherType].id);
    }

    return disabledChampions;
  };

  // Handle item selection
  const handleItemsChange = (type, items) => {
    setSelectedItems((prev) => {
      const newItems = {
        ...prev,
        [type]: items,
      };

      // Log the current state after items change
      console.log("Current State:", {
        combo: {
          carry_id: selectedChampions.carry?.id,
          support_id: selectedChampions.support?.id,
        },
        build: [
          {
            champion_id: selectedChampions.carry?.id,
            rune_page: selectedRunes.carry,
            inventory: newItems.carry,
            summoner_d: selectedSummonerSpells.carry.D?.id,
            summoner_f: selectedSummonerSpells.carry.F?.id,
            skill_order: skillOrders.carry?.join(","),
          },
          {
            champion_id: selectedChampions.support?.id,
            rune_page: selectedRunes.support,
            inventory: newItems.support,
            summoner_d: selectedSummonerSpells.support.D?.id,
            summoner_f: selectedSummonerSpells.support.F?.id,
            skill_order: skillOrders.support?.join(","),
          },
        ],
        inventoryCarry: {
          items: {
            starter: newItems.carry?.starter?.id
              ? [newItems.carry.starter.id]
              : [],
            boots: newItems.carry?.boots?.id ? [newItems.carry.boots.id] : [],
            item1: { best: newItems.carry?.core[0]?.id || null, alt: [] },
            item2: { best: newItems.carry?.core[1]?.id || null, alt: [] },
            item3: { best: newItems.carry?.core[2]?.id || null, alt: [] },
            item4: { best: newItems.carry?.core[3]?.id || null, alt: [] },
            item5: { best: newItems.carry?.core[4]?.id || null, alt: [] },
            item6: { best: newItems.carry?.noBoots?.id || null, alt: [] },
          },
        },
        inventorySupport: {
          items: {
            starter: newItems.support?.starter?.id
              ? [newItems.support.starter.id]
              : [],
            boots: newItems.support?.boots?.id
              ? [newItems.support.boots.id]
              : [],
            noBoots: newItems.support?.noBoots?.id
              ? [newItems.support.noBoots.id]
              : [],
            item1: { best: newItems.support?.core[0]?.id || null, alt: [] },
            item2: { best: newItems.support?.core[1]?.id || null, alt: [] },
            item3: { best: newItems.support?.core[2]?.id || null, alt: [] },
            item4: { best: newItems.support?.core[3]?.id || null, alt: [] },
            item5: { best: newItems.support?.core[4]?.id || null, alt: [] },
            item6: { best: newItems.support?.noBoots?.id || null, alt: [] },
          },
        },
        runePageCarry: selectedRunes.carry,
        runePageSupport: selectedRunes.support,
      });

      return newItems;
    });
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // Check champions
    if (!selectedChampions.carry || !selectedChampions.support) {
      return false;
    }

    // Check summoner spells
    if (
      !selectedSummonerSpells.carry.D ||
      !selectedSummonerSpells.carry.F ||
      !selectedSummonerSpells.support.D ||
      !selectedSummonerSpells.support.F
    ) {
      return false;
    }

    // Check skill orders
    if (!skillOrders.carry.length || !skillOrders.support.length) {
      return false;
    }

    // Check runes
    if (
      !selectedRunes.carry.primary_rune.keystone ||
      !selectedRunes.support.primary_rune.keystone
    ) {
      return false;
    }

    // Check items
    if (!selectedItems.carry.starter || !selectedItems.support.starter) {
      return false;
    }

    // Check if all core items are selected
    const carryCoreItemsComplete = selectedItems.carry.core.every(
      (item) => item !== null
    );
    const supportCoreItemsComplete = selectedItems.support.core.every(
      (item) => item !== null
    );

    if (!carryCoreItemsComplete || !supportCoreItemsComplete) {
      return false;
    }

    // Check if boots are selected
    if (!selectedItems.carry.boots || !selectedItems.support.boots) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSubmitError("Please fill in all required fields for both champions");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await axios.post("/api/addCombo", {
        combo: {
          carry_id: selectedChampions.carry.id,
          support_id: selectedChampions.support.id,
        },
        build: [
          {
            champion_id: selectedChampions.carry.key,
            rune_page: selectedRunes.carry,
            inventory: selectedItems.carry,
            summoner_d: selectedSummonerSpells.carry.D.id,
            summoner_f: selectedSummonerSpells.carry.F.id,
            skill_order: skillOrders.carry.join(","),
          },
          {
            champion_id: selectedChampions.support.key,
            rune_page: selectedRunes.support,
            inventory: selectedItems.support,
            summoner_d: selectedSummonerSpells.support.D.id,
            summoner_f: selectedSummonerSpells.support.F.id,
            skill_order: skillOrders.support.join(","),
          },
        ],
        inventoryCarry: {
          items: {
            starter: selectedItems.carry.starter.id
              ? [selectedItems.carry.starter.id]
              : [],
            boots: selectedItems.carry.boots.id
              ? [selectedItems.carry.boots.id]
              : [],
            item1: { best: selectedItems.carry.core[0]?.id || null, alt: [] },
            item2: { best: selectedItems.carry.core[1]?.id || null, alt: [] },
            item3: { best: selectedItems.carry.core[2]?.id || null, alt: [] },
            item4: { best: selectedItems.carry.core[3]?.id || null, alt: [] },
            item5: { best: selectedItems.carry.core[4]?.id || null, alt: [] },
            item6: { best: selectedItems.carry.noBoots?.id || null, alt: [] },
          },
        },
        inventorySupport: {
          items: {
            starter: selectedItems.support.starter.id
              ? [selectedItems.support.starter.id]
              : [],
            boots: selectedItems.support.boots.id
              ? [selectedItems.support.boots.id]
              : [],
            item1: { best: selectedItems.support.core[0]?.id || null, alt: [] },
            item2: { best: selectedItems.support.core[1]?.id || null, alt: [] },
            item3: { best: selectedItems.support.core[2]?.id || null, alt: [] },
            item4: { best: selectedItems.support.core[3]?.id || null, alt: [] },
            item5: { best: selectedItems.support.core[4]?.id || null, alt: [] },
            item6: { best: selectedItems.support.noBoots?.id || null, alt: [] },
          },
        },
        runePageCarry: selectedRunes.carry,
        runePageSupport: selectedRunes.support,
      });

      setSubmitSuccess(true);
      // Reset form
      setSelectedChampions({ carry: null, support: null });
      setSelectedSummonerSpells({
        carry: { D: null, F: null },
        support: { D: null, F: null },
      });
      setSkillOrders({ carry: [], support: [] });
      setSelectedRunes({
        carry: {
          primary_rune: {
            keystone: null,
            first: null,
            second: null,
            third: null,
          },
          secondary_rune: { first: null, second: null },
        },
        support: {
          primary_rune: {
            keystone: null,
            first: null,
            second: null,
            third: null,
          },
          secondary_rune: { first: null, second: null },
        },
      });
      setSelectedItems({
        carry: { starter: null, core: Array(5).fill(null), boots: null },
        support: { starter: null, core: Array(5).fill(null), boots: null },
      });
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to add combo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carry Section */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Carry</h3>
            <ChampionSelector
              champions={champions}
              patch={patch}
              onSelect={(champion) => handleChampionSelect("carry", champion)}
              label="Select carry..."
              disabledChampions={getDisabledChampions("carry")}
            />

            {selectedChampions.carry && (
              <>
                {/* Runes */}
                {!runesLoading && runeData && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Runes</h4>
                    <RuneSelector
                      runeData={runeData}
                      onRuneChange={(runes) => handleRuneChange("carry", runes)}
                    />
                  </div>
                )}

                {/* Skill Order Selector */}
                <div className="mt-4">
                  <SkillOrderSelector
                    champion={selectedChampions.carry}
                    patch={patch}
                    onSkillOrderChange={(newOrder) =>
                      handleSkillOrderChange("carry", newOrder)
                    }
                  />
                </div>

                {/* Summoner Spells */}
                {summonerSpells && (
                  <div className="mt-4 w-full">
                    <h4 className="text-sm font-medium mb-2">
                      Summoner Spells
                    </h4>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SummonerSpellSelector
                          summonerSpells={summonerSpells}
                          patch={patch}
                          onSelect={(spell) =>
                            handleSummonerSpellSelect("carry", "D", spell)
                          }
                          label="D Spell"
                          slot="D"
                          disabledSpells={getDisabledSpells("carry", "D")}
                          selectedChampion={selectedChampions.carry}
                        />
                      </div>
                      <div className="flex-1">
                        <SummonerSpellSelector
                          summonerSpells={summonerSpells}
                          patch={patch}
                          onSelect={(spell) =>
                            handleSummonerSpellSelect("carry", "F", spell)
                          }
                          label="F Spell"
                          slot="F"
                          disabledSpells={getDisabledSpells("carry", "F")}
                          selectedChampion={selectedChampions.carry}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-8">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <ItemBuildSelector
                    items={itemData?.data}
                    patch={patch}
                    onItemsChange={(items) => handleItemsChange("carry", items)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Support Section */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <ChampionSelector
              champions={champions}
              patch={patch}
              onSelect={(champion) => handleChampionSelect("support", champion)}
              label="Select support..."
              disabledChampions={getDisabledChampions("support")}
            />

            {selectedChampions.support && (
              <>
                {/* Runes */}
                {!runesLoading && runeData && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Runes</h4>
                    <RuneSelector
                      runeData={runeData}
                      onRuneChange={(runes) =>
                        handleRuneChange("support", runes)
                      }
                    />
                  </div>
                )}

                {/* Skill Order Selector */}
                <div className="mt-4">
                  <SkillOrderSelector
                    champion={selectedChampions.support}
                    patch={patch}
                    onSkillOrderChange={(newOrder) =>
                      handleSkillOrderChange("support", newOrder)
                    }
                  />
                </div>

                {/* Summoner Spells */}
                {summonerSpells && (
                  <div className="mt-4 w-full">
                    <h4 className="text-sm font-medium mb-2">
                      Summoner Spells
                    </h4>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SummonerSpellSelector
                          summonerSpells={summonerSpells}
                          patch={patch}
                          onSelect={(spell) =>
                            handleSummonerSpellSelect("support", "D", spell)
                          }
                          label="D Spell"
                          slot="D"
                          disabledSpells={getDisabledSpells("support", "D")}
                          selectedChampion={selectedChampions.support}
                        />
                      </div>
                      <div className="flex-1">
                        <SummonerSpellSelector
                          summonerSpells={summonerSpells}
                          patch={patch}
                          onSelect={(spell) =>
                            handleSummonerSpellSelect("support", "F", spell)
                          }
                          label="F Spell"
                          slot="F"
                          disabledSpells={getDisabledSpells("support", "F")}
                          selectedChampion={selectedChampions.support}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-8">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <ItemBuildSelector
                    items={itemData?.data}
                    patch={patch}
                    onItemsChange={(items) =>
                      handleItemsChange("support", items)
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Display selected champions */}
        <div className="mt-8 p-4 border rounded-lg w-full">
          <h2 className="text-xl font-bold mb-4">Selected Combo</h2>

          {selectedChampions.carry || selectedChampions.support ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChampions.carry && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Carry: {selectedChampions.carry.name}
                  </h3>
                  <p>ID: {selectedChampions.carry.id}</p>
                  {/* Runes */}
                  {runeData && selectedRunes.carry && (
                    <div className="mt-2">
                      {(() => {
                        const runeInfo = getRuneInfo(
                          runeData,
                          selectedRunes.carry
                        );
                        return runeInfo ? (
                          <>
                            <p className="text-sm">
                              <span className="text-yellow-500">
                                {runeInfo.primaryPath}
                              </span>
                              {" + "}
                              <span className="text-yellow-500">
                                {runeInfo.secondaryPath}
                              </span>
                            </p>
                            <div className="text-sm text-gray-400 mt-1">
                              <p>Keystone: {runeInfo.keystone}</p>
                              <p>
                                Primary Runes: {runeInfo.primaryRunes.first} •{" "}
                                {runeInfo.primaryRunes.second} •{" "}
                                {runeInfo.primaryRunes.third}
                              </p>
                              <p>
                                Secondary Runes: {runeInfo.secondaryRunes.first}{" "}
                                • {runeInfo.secondaryRunes.second}
                              </p>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {/* Skill Order */}
                  {skillOrders.carry && skillOrders.carry.length > 0 && (
                    <p className="mt-2">
                      Skill Order:{" "}
                      {Array.isArray(skillOrders.carry)
                        ? skillOrders.carry.join(" > ")
                        : skillOrders.carry}
                    </p>
                  )}
                  {/* Summoner Spells */}
                  {selectedSummonerSpells.carry.D && (
                    <p className="mt-2">
                      D Spell: {selectedSummonerSpells.carry.D.name}
                    </p>
                  )}
                  {selectedSummonerSpells.carry.F && (
                    <p>F Spell: {selectedSummonerSpells.carry.F.name}</p>
                  )}
                  {/* Items */}
                  {selectedItems.carry && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {selectedItems.carry.starter && (
                          <p>Starter: {selectedItems.carry.starter.name}</p>
                        )}
                        {selectedItems.carry.boots ? (
                          <p>Boots: {selectedItems.carry.boots.name}</p>
                        ) : selectedItems.carry.noBoots ? (
                          <p>
                            Alternative Item: {selectedItems.carry.noBoots.name}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          {selectedItems.carry.core.map(
                            (item, index) =>
                              item && (
                                <p key={index}>
                                  Core {index + 1}: {item.name}
                                </p>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedChampions.support && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Support: {selectedChampions.support.name}
                  </h3>
                  <p>ID: {selectedChampions.support.id}</p>
                  {/* Runes */}
                  {runeData && selectedRunes.support && (
                    <div className="mt-2">
                      {(() => {
                        const runeInfo = getRuneInfo(
                          runeData,
                          selectedRunes.support
                        );
                        return runeInfo ? (
                          <>
                            <p className="text-sm">
                              <span className="text-yellow-500">
                                {runeInfo.primaryPath}
                              </span>
                              {" + "}
                              <span className="text-yellow-500">
                                {runeInfo.secondaryPath}
                              </span>
                            </p>
                            <div className="text-sm text-gray-400 mt-1">
                              <p>Keystone: {runeInfo.keystone}</p>
                              <p>
                                Primary Runes: {runeInfo.primaryRunes.first} •{" "}
                                {runeInfo.primaryRunes.second} •{" "}
                                {runeInfo.primaryRunes.third}
                              </p>
                              <p>
                                Secondary Runes: {runeInfo.secondaryRunes.first}{" "}
                                • {runeInfo.secondaryRunes.second}
                              </p>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {/* Skill Order */}
                  {skillOrders.support && skillOrders.support.length > 0 && (
                    <p className="mt-2">
                      Skill Order:{" "}
                      {Array.isArray(skillOrders.support)
                        ? skillOrders.support.join(" > ")
                        : skillOrders.support}
                    </p>
                  )}
                  {/* Summoner Spells */}
                  {selectedSummonerSpells.support.D && (
                    <p className="mt-2">
                      D Spell: {selectedSummonerSpells.support.D.name}
                    </p>
                  )}
                  {selectedSummonerSpells.support.F && (
                    <p>F Spell: {selectedSummonerSpells.support.F.name}</p>
                  )}
                  {/* Items */}
                  {selectedItems.support && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {selectedItems.support.starter && (
                          <p>Starter: {selectedItems.support.starter.name}</p>
                        )}
                        {selectedItems.support.boots && (
                          <p>Boots: {selectedItems.support.boots.name}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {selectedItems.support.core.map(
                            (item, index) =>
                              item && (
                                <p key={index}>
                                  Core {index + 1}: {item.name}
                                </p>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No champions selected yet</p>
          )}
        </div>

        {/* Add submit button and status messages */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
            className={`px-6 py-3 rounded-lg border-2 ${
              isSubmitting
                ? "bg-gray-400 border-gray-500 cursor-not-allowed"
                : isFormValid()
                ? "bg-blue-500 hover:bg-blue-600 border-blue-600 cursor-pointer shadow-md hover:shadow-lg"
                : "bg-gray-300 border-gray-400 cursor-not-allowed"
            } text-white font-semibold transition-all duration-200 text-lg`}
          >
            {isSubmitting ? "Adding Combo..." : "Add Combo"}
          </button>

          {!isFormValid() && (
            <div className="text-amber-500 font-medium">
              Please fill in all required fields for both champions
            </div>
          )}

          {submitError && (
            <div className="text-red-500 font-medium">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="text-green-500 font-medium">
              Combo added successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
