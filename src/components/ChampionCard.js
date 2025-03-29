import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const ChampionCard = ({ champion, patch }) => {
  return (
    <Card className="w-2/5 mx-auto h-full bg-dank-secondary border border-dank-primary">
      <CardHeader>
        <CardTitle>{champion.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
          alt={champion.name}
          width={150}
          height={50}
        />
        <div className="flex flex-row gap-[32px] items-center w-full h-full">
          {champion.skillOrder.map((skill) => {
            const skillIndex = {
              Q: 0,
              W: 1,
              E: 2,
              R: 3,
            }[skill];

            return (
              <div key={skill}>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${champion.spellImgs[skillIndex]}`}
                  alt={champion.name}
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
  );
};
