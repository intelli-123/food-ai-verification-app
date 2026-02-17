//src/app.js
import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));

app.use("/api/analyze", analyzeRoutes);

export default app;
