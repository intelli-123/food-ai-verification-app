//src/controllers/analyze.controller.js
import { analyzeFoodImage } from "../services/langchainAgent.js";

export const analyze = async (req, res) => {
  const { name, description, isVeg } = req.body;

  const result = await analyzeFoodImage(name, description, isVeg);
  res.json({ result });
};
