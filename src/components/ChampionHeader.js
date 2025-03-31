import { GameImage } from "./ui/GameImage";

export const ChampionHeader = ({ champion, imageUrls }) => {
  return (
    <div className="flex gap-4 mb-4">
      <div className="w-36 h-auto">
        <GameImage
          src={imageUrls.champion}
          alt={champion.name}
          width={150}
          height={45}
          className="shadow-md"
        />
      </div>

      {/* Main content aside champion image */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Summoners */}
        <div className="mb-2">
          <div className="text-sm text-white mb-2">Summoners</div>
          <div className="flex gap-2">
            <GameImage
              src={imageUrls.summoners.d}
              alt="Summoner D"
              width={32}
              height={32}
            />
            <GameImage
              src={imageUrls.summoners.f}
              alt="Summoner F"
              width={32}
              height={32}
            />
          </div>
        </div>

        {/* Skill Order */}
        <div>
          <div className="text-sm text-white mb-2">Skill Order</div>
          <div className="flex gap-1 flex-wrap mb-1">
            {champion.skillOrder.map((skill, index) => (
              <GameImage
                key={index}
                src={imageUrls.spells?.[{ Q: 0, W: 1, E: 2, R: 3 }[skill]]}
                alt={skill}
                width={32}
                height={32}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
