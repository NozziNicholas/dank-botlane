import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useRuneData = (patch) => {
  const { data, error, isLoading } = useSWR(
    patch
      ? `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/runesReforged.json`
      : null,
    fetcher
  );

  return {
    runeData: data || [],
    isLoading,
    isError: !!error,
  };
};
