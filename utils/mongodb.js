import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("Missing MongoDB connection string: set MONGODB_URL (or MONGO_URL)");
}

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected ..."))
  .catch((err) => console.log(err));
