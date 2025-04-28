import { GameImage } from "./ui/GameImage";

export const ChampionHeader = ({ champion, imageUrls }) => {
  return (
    <div className="flex gap-4">
      {/* Champion Image */}
      <div className="w-36 h-auto">
        <GameImage
          src={imageUrls.champion}
          alt={champion.name}
          width={144}
          height={270}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Main content aside champion image */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Summoners */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Summoners</div>
          <div className="flex gap-1">
            <GameImage
              src={imageUrls.summoners.d}
              alt="Summoner D"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <GameImage
              src={imageUrls.summoners.f}
              alt="Summoner F"
              width={36}
              height={36}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Skill Order */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Skill Order</div>
          <div className="flex gap-1">
            {champion.skillOrder.map((skill, index) => (
              <GameImage
                key={index}
                src={imageUrls.spells?.[{ Q: 0, W: 1, E: 2, R: 3 }[skill]]}
                alt={skill}
                width={36}
                height={36}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
