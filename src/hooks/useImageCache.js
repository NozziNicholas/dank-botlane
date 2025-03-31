import { useCallback } from "react";

// Global cache object to store images between component instances
const globalCache = new Map();

export const useImageCache = () => {
  // Function to get an image from cache or download it
  const getImage = useCallback(async (url) => {
    // Check if URL is valid
    if (!url || url.includes("undefined") || url.includes("null")) {
      console.warn("Invalid image URL detected:", url);
      return "";
    }

    // Check if image is already in cache
    if (globalCache.has(url)) {
      return globalCache.get(url);
    }

    try {
      // Fetch the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      // Convert the image to blob
      const blob = await response.blob();

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      // Store the base64 data in cache
      globalCache.set(url, base64Data);

      // Return the base64 data
      return base64Data;
    } catch (error) {
      console.error("Error caching image:", error, url);
      return ""; // Return empty string on error
    }
  }, []);

  return { getImage };
};
