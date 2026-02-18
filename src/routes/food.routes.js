import express from "express";
import { getAllFoods, seedFoods } from "../controllers/food.controller.js";

const router = express.Router();

router.get("/", getAllFoods);
router.get("/seed", seedFoods);  // ✅ must be GET

export default router;
