import { GameImage } from "./ui/GameImage";

export const RunesSection = ({ runes, imageUrls }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4">
        {/* Primary Runes */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Primary</div>
          <div className="flex gap-1">
            {imageUrls.runes.primary.map((runeUrl, index) => (
              <GameImage
                key={index}
                src={runeUrl}
                alt={`Primary Rune ${index + 1}`}
                width={36}
                height={36}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Secondary Runes */}
        <div>
          <div className="text-sm text-white opacity-75 mb-1">Secondary</div>
          <div className="flex gap-1">
            {imageUrls.runes.secondary.map((runeUrl, index) => (
              <GameImage
                key={index}
                src={runeUrl}
                alt={`Secondary Rune ${index + 1}`}
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
