import { getTestAgent } from "../helpers/testApp.js";

describe("Health API", () => {
  let agent;

  beforeAll(async () => {
    agent = await getTestAgent();
  });

  it("GET /health returns 200 with status ok", async () => {
    const res = await agent.get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("icinema");
    expect(res.body.uptime).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it("GET /health/ready returns 200 when MongoDB is connected", async () => {
    const res = await agent.get("/health/ready");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ready");
    expect(res.body.db).toBe("connected");
  });
});
