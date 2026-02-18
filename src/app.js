//src/app.js
import express from "express";
import cors from "cors";

import analyzeRoutes from "./routes/analyze.routes.js";
import foodRoutes from "./routes/food.routes.js";

// ✅ Initialize app first
const app = express();

// 🔥 Disable caching for development
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static("src/public", {
  etag: false,
  lastModified: false,
  cacheControl: false
}));

// Routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/foods", foodRoutes);

export default app;
