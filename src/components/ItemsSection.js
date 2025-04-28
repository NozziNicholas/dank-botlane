import { GameImage } from "./ui/GameImage";

export const ItemsSection = ({ champion, imageUrls }) => {
  // Check if boots is empty (null, undefined, or empty string)
  const hasNoBoots = !champion.boots || champion.boots === "";

  // Check if item6 exists in the imageUrls
  const hasItem6 =
    imageUrls.items && imageUrls.items.length > 5 && imageUrls.items[5];

  // Get the core items length, excluding the potential item6/boots
  const coreItemsLength = Math.min(champion.items.length, 5);

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
        {!hasNoBoots && hasItem6 && (
          <div>
            <div className="text-sm text-white opacity-75 mb-1">Boots</div>
            <GameImage
              src={imageUrls.items[5]}
              alt="Boots"
              width={36}
              height={36}
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Core Items */}
      <div>
        <div className="text-sm text-white opacity-75 mb-1">Core Items</div>
        <div className="flex gap-1">
          {champion.items.slice(0, coreItemsLength).map((item, index) => (
            <GameImage
              key={index}
              src={imageUrls.items?.[index]}
              alt={`Item ${index + 1}`}
              width={36}
              height={36}
              className="rounded-lg"
            />
          ))}
          {hasNoBoots && hasItem6 && (
            <GameImage
              src={imageUrls.items[5]}
              alt="Item 6"
              width={36}
              height={36}
              className="rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};
