import crypto from "crypto";
import logger from "./utils/logger.js";

if (!process.env.JWT_SECRET && !process.env.JWT_KEY) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString("hex");
  logger.warn(
    "JWT secret is not set (JWT_SECRET/JWT_KEY). Using an ephemeral secret; tokens will reset after restart."
  );
}

import app from "./app.js";
import "./utils/mongodb.js";

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Server running on port ${port}`));
