import dotenv from "dotenv";
import { connectDB } from "./connectDB.js";
import logger from "./logger.js";

dotenv.config();

connectDB()
  .then(() => logger.info("MongoDb connected ..."))
  .catch((err) => logger.error({ err }, "MongoDB connection failed"));
