import { GameImage } from "./ui/GameImage";

export const RunesSection = ({ runes, imageUrls }) => {
  // Check if runes and their properties exist and are arrays
  const primaryRunes =
    runes?.primary && Array.isArray(runes.primary) ? runes.primary : [];
  const secondaryRunes =
    runes?.secondary && Array.isArray(runes.secondary) ? runes.secondary : [];

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
            {primaryRunes.map((rune, index) => (
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
            {secondaryRunes.map((rune, index) => (
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
