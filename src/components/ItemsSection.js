import { GameImage } from "./ui/GameImage";

export const ItemsSection = ({ champion, imageUrls }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4">
        {/* Starting Item */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Starting</div>
          <GameImage
            src={imageUrls.startingItem}
            alt="Starting Item"
            width={36}
            height={36}
            className="rounded-lg"
          />
        </div>

        {/* Boots */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Boots</div>
          <GameImage
            src={imageUrls.items?.[5]}
            alt="Boots"
            width={36}
            height={36}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Core Items */}
      <div>
        <div className="text-sm text-white opacity-75 mb-1">Core Items</div>
        <div className="flex gap-1">
          {champion.items.map((item, index) => (
            <GameImage
              key={index}
              src={imageUrls.items?.[index]}
              alt={`Item ${index + 1}`}
              width={36}
              height={36}
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
