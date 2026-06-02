import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected ..."))
  .catch((err) => console.log(err));

console.log(process.env.MONGODB_URL);
