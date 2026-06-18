import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { getTestAgent } from "./testApp.js";

export async function createUser(email, password, role = "user") {
  const user = new User({ email, password, role });
  await user.save();
  return user;
}

export async function createAdmin(email = "admin@gmail.com", password = "password123") {
  return createUser(email, password, "admin");
}

export function getAuthHeader(userId) {
  const secret = process.env.JWT_SECRET || process.env.JWT_KEY;
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
  return { Authorization: `Bearer ${token}` };
}

export async function signUpViaApi(email, password) {
  const agent = await getTestAgent();
  const res = await agent.post("/api/auth/signUp").send({ email, password });
  return res;
}

export async function signInViaApi(email, password) {
  const agent = await getTestAgent();
  const res = await agent.post("/api/auth/signIn").send({ email, password });
  return res;
}

export async function getAdminAuthHeader() {
  const admin = await createAdmin();
  return getAuthHeader(admin._id);
}

export async function getUserAuthHeader(email = "user@test.com", password = "password123") {
  const user = await createUser(email, password, "user");
  return getAuthHeader(user._id);
}
