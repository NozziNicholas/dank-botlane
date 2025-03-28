import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hammer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [carry, setCarry] = useState(null);
  const [support, setSupport] = useState(null);
  const [patch, setPatch] = useState(null);
  const [champions, setChampions] = useState(null);
  const [championList, setChampionList] = useState(null);

  useEffect(() => {
    axios
      .get("https://ddragon.leagueoflegends.com/api/versions.json")
      .then((res) => {
        setPatch(res.data[0]);
      });
  }, []);

  useEffect(() => {
    if (patch) {
      axios
        .get(
          `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`
        )
        .then((res) => {
          setChampions(res.data.data);
          setChampionList(Object.keys(res.data.data));
        });
    }
  }, [patch]);

  const config = {
    combo1: {
      carry: {
        name: "Veigar",
        key: "Veigar",
        id: "Veigar",
        skillOrder: ["Q", "W", "E"],
      },
      support: {
        name: "Poppy",
        key: "Poppy",
        id: "Poppy",
        skillOrder: ["Q", "E", "W"],
      },
    },
    combo2: {
      carry: {
        name: "Rengar",
        key: "Rengar",
        id: "Rengar",
        skillOrder: ["Q", "W", "E"],
      },
      support: {
        name: "Jinx",
        key: "Jinx",
        id: "Jinx",
        skillOrder: ["E", "Q", "W"],
      },
    },
    combo3: {
      carry: {
        name: "Lucian",
        key: "Lucian",
        id: "Lucian",
        skillOrder: ["E", "W", "Q"],
      },
      support: {
        name: "Lux",
        key: "Lux",
        id: "Lux",
        skillOrder: ["E", "Q", "W"],
      },
    },
    combo4: {
      carry: {
        name: "Kog'Maw",
        key: "KogMaw",
        id: "KogMaw",
        skillOrder: ["E", "Q", "W"],
      },
      support: {
        name: "Ziggs",
        key: "Ziggs",
        id: "Ziggs",
        skillOrder: ["E", "Q", "W"],
      },
    },
    combo5: {
      carry: {
        name: "Ahri",
        key: "Ahri",
        id: "Ahri",
        skillOrder: ["Q", "W", "E"],
      },
      support: {
        name: "Karma",
        key: "Karma",
        id: "Karma",
        skillOrder: ["E", "Q", "W"],
      },
    },
  };

  const handleClick = () => {
    // Get random combo from config
    const comboKeys = Object.keys(config);
    const randomComboKey =
      comboKeys[Math.floor(Math.random() * comboKeys.length)];
    const selectedCombo = config[randomComboKey];

    const carryChampion = selectedCombo.carry.key;
    const supportChampion = selectedCombo.support.key;

    Promise.all([
      axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${carryChampion}.json`
      ),
      axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${supportChampion}.json`
      ),
    ]).then(([carryRes, supportRes]) => {
      const carryData = Object.values(carryRes.data.data)[0];
      const supportData = Object.values(supportRes.data.data)[0];

      setCarry({
        name: carryData.name,
        key: carryData.key,
        id: carryData.id,
        skillOrder: selectedCombo.carry.skillOrder,
        spellImgs: carryData.spells.map((spell) => spell.image.full),
      });

      setSupport({
        name: supportData.name,
        key: supportData.key,
        id: supportData.id,
        skillOrder: selectedCombo.support.skillOrder,
        spellImgs: supportData.spells.map((spell) => spell.image.full),
      });
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-dank-primary">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full h-full">
        <div className="flex flex-col gap-[32px] items-center w-full h-1/5">
          <Button
            onClick={() => handleClick("Veigar", "Poppy")}
            className="cursor-pointer w-1/3 h-1/3 mx-auto"
            variant={"dank"}
            size={"lg"}
          >
            Let&apos;s get Dank
            <Hammer className="size-8" />
          </Button>
        </div>
        <div className="flex flex-row gap-[32px] items-center w-full h-full ">
          {carry && support && (
            <>
              <Card className="w-2/5 mx-auto h-full bg-dank-secondary border border-dank-primary">
                <CardHeader>
                  <CardTitle>{carry.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${carry.id}_0.jpg`}
                    alt={carry.name}
                    width={150}
                    height={50}
                  />
                  <div className="flex flex-row gap-[32px] items-center w-full h-full">
                    {carry.skillOrder.map((skill) => {
                      const skillIndex = {
                        Q: 0,
                        W: 1,
                        E: 2,
                        R: 3,
                      }[skill];

                      return (
                        <div key={skill}>
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${carry.spellImgs[skillIndex]}`}
                            alt={carry.name}
                            width={50}
                            height={50}
                          />
                          <p>{skill}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-2/5 mx-auto h-full bg-dank-secondary border border-dank-primary">
                <CardHeader>
                  <CardTitle>{support.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${support.id}_0.jpg`}
                    alt={support.name}
                    width={150}
                    height={50}
                  />
                  <div className="flex flex-row gap-[32px] items-center w-full h-full">
                    {support.skillOrder.map((skill) => {
                      const skillIndex = {
                        Q: 0,
                        W: 1,
                        E: 2,
                        R: 3,
                      }[skill];

                      return (
                        <div key={skill}>
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${support.spellImgs[skillIndex]}`}
                            alt={support.name}
                            width={50}
                            height={50}
                          />
                          <p>{skill}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
