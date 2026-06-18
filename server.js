import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";

if (!process.env.JWT_SECRET && !process.env.JWT_KEY) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn(
    "JWT secret is not set (JWT_SECRET/JWT_KEY). Using an ephemeral secret; tokens will reset after restart."
  );
}

import app from "./app.js";
import "./utils/mongodb.js";

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
