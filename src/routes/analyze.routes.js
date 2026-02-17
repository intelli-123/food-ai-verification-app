//src/routes/analyze.routes.js
import express from "express";
import { analyze } from "../controllers/analyze.controller.js";

const router = express.Router();
router.post("/", analyze);

export default router;
