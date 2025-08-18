export async function useWordList() {
  const { data } = await useFetch<string[]>("/words-6.json", {
    default: () => [],
  });
  return { words: data };
}
