import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useRuneData = (patch) => {
  const shouldFetch = !!patch;
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/runesReforged.json`
      : null,
    fetcher
  );

  return {
    runeData: Array.isArray(data) ? data : [],
    isLoading,
    isError: !!error,
  };
};
