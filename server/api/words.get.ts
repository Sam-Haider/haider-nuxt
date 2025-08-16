export default defineEventHandler(async () => {
  const wordlistModule = await import("wordlist-english");
  const words: string[] = wordlistModule.default["english"];
  return words.filter((w) => w.length === 6);
});
