import path from "path";
import fs from "fs";
import { analyzeFoodImage } from "../services/langchainAgent.js";

const DEBUG = process.env.DEBUG === "true";

export const analyzeExistingImage = async (req, res) => {
  try {
    const { imageUrl, name, description, isVeg } = req.body;

    if (DEBUG) {
      console.log("Incoming Request:");
      console.log(req.body);
    }

    const cleanPath = imageUrl.startsWith("/")
      ? imageUrl.substring(1)
      : imageUrl;

    const imagePath = path.join(process.cwd(), "src/public", cleanPath);

    if (!fs.existsSync(imagePath)) {
      console.error("Image not found:", imagePath);
      return res.status(400).json({
        error: "Image file not found",
        pathTried: imagePath
      });
    }

    if (DEBUG) {
      console.log("Image Path:", imagePath);
    }

    const result = await analyzeFoodImage(
      imagePath,
      name,
      description,
      isVeg,
      "en"
    );

    if (DEBUG) {
      console.log("Raw LLM Response:");
      console.log(result);
    }

    res.json({ result });

  } catch (error) {
    console.error("Analyze Existing Error:", error);
    res.status(500).json({ error: error.message });
  }
};
