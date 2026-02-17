//src/services/langchainAgent.js
import { getLLM } from "../config/llm.js";
import { COMPANY_POLICIES } from "../config/policies.js";

export const analyzeFoodImage = async (name, description, isVeg) => {
  const llm = getLLM();

  const prompt = `
You are a food compliance AI.

Food Name: ${name}
Description: ${description}
Veg Claim: ${isVeg}

Policies:
${COMPANY_POLICIES}

Return JSON:
{
authenticity: 0-100,
clarity: 0-100,
purity: 0-100,
safety: 0-100,
consistency: 0-100,
final_confidence: 0-100,
explanation: ""
}
`;

  const response = await llm.invoke(prompt);
  return response.content;
};
