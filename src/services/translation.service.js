import { getLLM } from "../config/llm.js";

export const translateText = async (text, targetLang) => {
  if (targetLang === "en") return text;

  const llm = getLLM();

  const prompt = `
Translate the following text into ${targetLang}.
Keep meaning accurate. Do not add extra commentary.

Text:
${text}
`;

  const response = await llm.invoke(prompt);

  return response.content.trim();
};
