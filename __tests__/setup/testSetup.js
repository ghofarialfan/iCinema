import mongoose from "mongoose";
import { connectDB } from "../../utils/connectDB.js";

beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB(process.env.MONGODB_URL);
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
