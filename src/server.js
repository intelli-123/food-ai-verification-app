//src/server.js
import dotenv from "dotenv";
dotenv.config();

const DEBUG = process.env.DEBUG === "true";

if (DEBUG) {
  console.log("DEBUG MODE ENABLED");
}

import app from "./app.js";
import { connectDB } from "./config/db.js";

connectDB();

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on ${process.env.PORT || 5000}`)
);
