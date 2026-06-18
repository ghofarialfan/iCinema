import { getTestAgent } from "../helpers/testApp.js";

describe("Auth API", () => {
  let agent;

  beforeAll(async () => {
    agent = await getTestAgent();
  });

  it("POST /api/auth/signUp creates a new user with role user", async () => {
    const res = await agent
      .post("/api/auth/signUp")
      .send({ email: "newuser@test.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe("newuser@test.com");
    expect(res.body.user.role).toBe("user");
  });

  it("POST /api/auth/signUp returns 409 for duplicate email", async () => {
    await agent
      .post("/api/auth/signUp")
      .send({ email: "duplicate@test.com", password: "password123" });

    const res = await agent
      .post("/api/auth/signUp")
      .send({ email: "duplicate@test.com", password: "password456" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("The entered Email already exists!");
  });

  it("POST /api/auth/signUp assigns admin role for admin@gmail.com", async () => {
    const res = await agent
      .post("/api/auth/signUp")
      .send({ email: "admin@gmail.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("admin");
  });

  it("POST /api/auth/signIn returns token for valid credentials", async () => {
    await agent
      .post("/api/auth/signUp")
      .send({ email: "signin@test.com", password: "password123" });

    const res = await agent
      .post("/api/auth/signIn")
      .send({ email: "signin@test.com", password: "password123" });

    expect(res.status).toBe(202);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe("signin@test.com");
  });

  it("POST /api/auth/signIn returns 401 for wrong password", async () => {
    await agent
      .post("/api/auth/signUp")
      .send({ email: "wrongpass@test.com", password: "password123" });

    const res = await agent
      .post("/api/auth/signIn")
      .send({ email: "wrongpass@test.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Username or Password Incorrect");
  });

  it("POST /api/auth/signIn returns 401 for unknown email", async () => {
    const res = await agent
      .post("/api/auth/signIn")
      .send({ email: "unknown@test.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Username or Password Incorrect");
  });
});
