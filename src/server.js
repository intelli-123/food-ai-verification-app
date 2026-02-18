//src/server.js
import dotenv from "dotenv";
dotenv.config();

const DEBUG = process.env.DEBUG === "true";
const port = process.env.PORT || 5000;

if (DEBUG) {
  console.log("DEBUG MODE ENABLED");
}

import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB();

app.listen(port, () => { console.log(`Server running at http://localhost:${port}`); });