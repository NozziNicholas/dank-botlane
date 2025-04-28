import { GameImage } from "./ui/GameImage";

export const ItemsSection = ({ champion, imageUrls }) => {
  // Check if there are boots in the combo
  const hasBoots = champion.boots || (imageUrls.items && imageUrls.items[5]);

  return (
    <div className={`grid ${hasBoots ? "grid-cols-3" : "grid-cols-2"} gap-4`}>
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

      {/* Boots - Only show if there are boots */}
      {hasBoots && (
        <div>
          <div className="text-sm text-white opacity-75 mb-2">Boots</div>
          <GameImage
            src={imageUrls.items?.[5]}
            alt="Boots"
            width={34}
            height={34}
          />
        </div>
      )}
    </div>
  );
};
