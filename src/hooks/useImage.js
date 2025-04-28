import useSWR from "swr";

// Global fetcher function for images
const imageFetcher = async (url) => {
  if (!url || url.includes("undefined") || url.includes("null")) {
    console.warn("Invalid image URL detected:", url);
    return "";
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }
    return url; // Return the URL directly since Next.js Image component handles the actual loading
  } catch (error) {
    console.error("Error fetching image:", error, url);
    return ""; // Return empty string on error
  }
};

// Custom hook for fetching a single image with SWR
export const useImage = (url) => {
  const { data, error, isLoading } = useSWR(url, imageFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  return {
    imageUrl: data,
    isLoading,
    isError: error,
  };
};

// Custom hook for fetching multiple images with SWR
export const useImages = (urls) => {
  const { data, error, isLoading } = useSWR(
    urls,
    async (urls) => {
      const results = await Promise.all(urls.map((url) => imageFetcher(url)));
      return results;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 24 * 60 * 60 * 1000, // Cache for 24 hours
    }
  );

  return {
    imageUrls: data || [],
    isLoading,
    isError: error,
  };
};
