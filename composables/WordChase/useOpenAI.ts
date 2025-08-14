export const useOpenAI = async () => {
  const response = await $fetch("/api/open-ai", {
    method: "POST",
    body: { message: "say hello world to me" },
  });
  console.log("OpenAI response:", response);
  return response;
};
