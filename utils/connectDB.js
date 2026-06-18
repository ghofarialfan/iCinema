import mongoose from "mongoose";

export async function connectDB(uri) {
  const mongoUrl = uri || process.env.MONGODB_URL || process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error(
      "Missing MongoDB connection string: set MONGODB_URL (or MONGO_URL)"
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose.connection;
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
