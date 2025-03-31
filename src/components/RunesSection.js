import { GameImage } from "./ui/GameImage";

export const RunesSection = ({ runes, imageUrls }) => {
  return (
    <div className="mb-4">
      <div className="text-sm text-white mb-2 border-b border-lol-item-border pb-1">
        Runes
      </div>
      <div className="flex gap-6 mt-2">
        {/* Primary Runes */}
        <div>
          <div className="text-sm text-white opacity-75 mb-2">Primary</div>
          <div className="flex gap-2">
            {runes.primary.map((rune, index) => (
              <GameImage
                key={index}
                src={imageUrls.runes?.primary?.[index]}
                alt={`Primary Rune ${index + 1}`}
                width={34}
                height={34}
              />
            ))}
          </div>
        </div>

        {/* Secondary Runes */}
        <div>
          <div className="text-sm text-white opacity-75 mb-2">Secondary</div>
          <div className="flex gap-2">
            {runes.secondary.map((rune, index) => (
              <GameImage
                key={index}
                src={imageUrls.runes?.secondary?.[index]}
                alt={`Secondary Rune ${index + 1}`}
                width={34}
                height={34}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
