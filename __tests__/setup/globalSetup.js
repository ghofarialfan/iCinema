import { MongoMemoryServer } from "mongodb-memory-server";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function globalSetup() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGODB_URL = mongoUri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
  process.env.NODE_ENV = "test";

  const configPath = join(__dirname, "mongo-config.json");
  writeFileSync(
    configPath,
    JSON.stringify({ mongoUri, mongoServerId: mongoServer.instanceInfo?.port })
  );

  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_SERVER__ = mongoServer;
}
