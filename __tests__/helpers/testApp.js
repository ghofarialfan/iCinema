import request from "supertest";
import { connectDB } from "../../utils/connectDB.js";

let app;

export async function getTestAgent() {
  if (!app) {
    await connectDB(process.env.MONGODB_URL);
    const appModule = await import("../../app.js");
    app = appModule.default;
  }
  return request(app);
}

export async function resetTestApp() {
  app = null;
}
