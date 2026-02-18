import express from "express";
import { analyzeExistingImage } from "../controllers/analyze.controller.js";

const router = express.Router();

// Analyze existing stored image
router.post("/existing", analyzeExistingImage);

export default router;
