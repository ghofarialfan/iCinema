import { connectDB, disconnectDB } from "../../../utils/connectDB.js";

describe("connectDB utility", () => {
  it("connects to the in-memory MongoDB instance", async () => {
    const connection = await connectDB(process.env.MONGODB_URL);
    expect(connection.readyState).toBe(1);
  });

  it("reuses an existing connection when already connected", async () => {
    const connection = await connectDB(process.env.MONGODB_URL);
    expect(connection.readyState).toBe(1);
  });

  it("throws when no MongoDB URL is provided", async () => {
    const originalUrl = process.env.MONGODB_URL;
    delete process.env.MONGODB_URL;
    delete process.env.MONGO_URL;

    await expect(connectDB()).rejects.toThrow(
      "Missing MongoDB connection string"
    );

    process.env.MONGODB_URL = originalUrl;
    await connectDB(originalUrl);
  });

  it("disconnects from MongoDB", async () => {
    await disconnectDB();
    await connectDB(process.env.MONGODB_URL);
  });
});
