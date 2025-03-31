import { GameImage } from "./ui/GameImage";

export const ItemsSection = ({ champion, imageUrls }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Starting Item */}
      <div>
        <div className="text-sm text-white opacity-75 mb-2">Starting</div>
        <GameImage
          src={imageUrls.startingItem}
          alt="Starting Item"
          width={34}
          height={34}
        />
      </div>

      {/* Core Items */}
      <div>
        <div className="text-sm text-white opacity-75 mb-2">Core</div>
        <div className="flex gap-2">
          {champion.items.map((item, index) => (
            <GameImage
              key={index}
              src={imageUrls.items?.[index]}
              alt={`Item ${index + 1}`}
              width={34}
              height={34}
            />
          ))}
        </div>
      </div>

      {/* Boots */}
      <div>
        <div className="text-sm text-white opacity-75 mb-2">Boots</div>
        <GameImage
          src={imageUrls.items?.[5]}
          alt="Boots"
          width={34}
          height={34}
        />
      </div>
    </div>
  );
};
