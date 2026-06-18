import dotenv from "dotenv";
import { connectDB } from "./connectDB.js";

dotenv.config();

connectDB()
  .then(() => console.log("MongoDb connected ..."))
  .catch((err) => console.log(err));
