import Image from "next/image";

const TRANSPARENT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const GameImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={`${containerClassName}`}>
      <Image
        src={src || TRANSPARENT_PLACEHOLDER}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-sm ${className}`}
        loading="lazy"
        unoptimized
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentNode.classList.add(
            "bg-lol-item-bg",
            "rounded-sm",
            ...containerClassName.split(" ")
          );
        }}
      />
    </div>
  );
};
