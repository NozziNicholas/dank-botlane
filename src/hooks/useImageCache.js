import { useEffect } from "react";

// Global cache object
const globalCache = new Map();

export const useImageCache = () => {
  const getImage = async (url) => {
    // Check if image is already in cache
    if (globalCache.has(url)) {
      return globalCache.get(url);
    }

    try {
      // Fetch the image
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Add to cache
      globalCache.set(url, objectUrl);

      return objectUrl;
    } catch (error) {
      console.error("Error caching image:", error);
      return url; // Fallback to original URL if caching fails
    }
  };

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Only cleanup if the component is unmounting
      // This prevents unnecessary cleanup during re-renders
      if (document.hidden) {
        globalCache.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
        globalCache.clear();
      }
    };
  }, []);

  return { getImage };
};
