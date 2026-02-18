//food-ai-verification-app\src\services\langchainAgent.js

import fs from "fs";
import { getLLM } from "../config/llm.js";
import { COMPANY_POLICIES } from "../config/policies.js";

export const analyzeFoodImage = async (
  imagePath,
  name,
  description,
  isVeg,
  targetLang = "en"
) => {
  const llm = getLLM();

  // Convert image to base64
  const imageBase64 = fs.readFileSync(imagePath, {
    encoding: "base64"
  });

  const prompt = `
You are a professional Food Compliance AI.

Analyze this food image and return response strictly in ${targetLang} language.

Food Name: ${name}
Description: ${description}
Veg Claim: ${isVeg}

Company Policies:
${COMPANY_POLICIES}

Return ONLY valid JSON:

{
  "authenticity": number (0-100),
  "clarity": number (0-100),
  "purity": number (0-100),
  "safety": number (0-100),
  "consistency": number (0-100),
  "final_confidence": number (0-100),
  "explanation": "short explanation"
}
`;

  const response = await llm.invoke([
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: `data:image/jpeg;base64,${imageBase64}`
        }
      ]
    }
  ]);

  const DEBUG = process.env.DEBUG === "true";
  if (DEBUG) {
    console.log("LLM Raw Content:");
    console.log(response.content);
  }

  console.log("LLM Response:", response.content);

  return response.content;
};
