import { OpenAI } from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default defineEventHandler(async (event) => {
  const { message } = await readBody<{ message?: string }>(event);
  if (!message)
    throw createError({ statusCode: 400, statusMessage: "message required" });

  const r = await client.responses.create({
    model: "gpt-5-nano", // pick any current text model
    input: message, // simple string in, simple string out
  });

  return { text: r.output_text }; // SDK helper for plain text
});
