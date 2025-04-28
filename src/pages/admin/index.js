import { useState } from "react";
import { ChampionSelector } from "@/components/admin/ChampionSelector";
import { SummonerSpellSelector } from "@/components/admin/SummonerSpellSelector";
import SkillOrderSelector from "@/components/admin/SkillOrderSelector";
import { useChampions } from "@/hooks/useChampions";
import { useSummonerSpells } from "@/hooks/useSummonerSpells";

export default function Admin() {
  const { champions, patch } = useChampions();
  const summonerSpells = useSummonerSpells(patch);
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

    // Clear the summoner spells and skill order for this champion
    setSelectedSummonerSpells((prev) => ({
      ...prev,
      [type]: { D: null, F: null },
    }));
    setSkillOrders((prev) => ({
      ...prev,
      [type]: [],
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
                  {skillOrders.carry && skillOrders.carry.length > 0 && (
                    <p>
                      Skill Order:{" "}
                      {Array.isArray(skillOrders.carry)
                        ? skillOrders.carry.join(" > ")
                        : skillOrders.carry}
                    </p>
                  )}
                  {selectedSummonerSpells.carry.D && (
                    <p>D Spell: {selectedSummonerSpells.carry.D.name}</p>
                  )}
                  {selectedSummonerSpells.carry.F && (
                    <p>F Spell: {selectedSummonerSpells.carry.F.name}</p>
                  )}
                </div>
              )}

              {selectedChampions.support && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Support: {selectedChampions.support.name}
                  </h3>
                  <p>ID: {selectedChampions.support.id}</p>
                  {skillOrders.support && skillOrders.support.length > 0 && (
                    <p>
                      Skill Order:{" "}
                      {Array.isArray(skillOrders.support)
                        ? skillOrders.support.join(" > ")
                        : skillOrders.support}
                    </p>
                  )}
                  {selectedSummonerSpells.support.D && (
                    <p>D Spell: {selectedSummonerSpells.support.D.name}</p>
                  )}
                  {selectedSummonerSpells.support.F && (
                    <p>F Spell: {selectedSummonerSpells.support.F.name}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No champions selected yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
