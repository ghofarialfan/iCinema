import Genre from "../../models/genre.js";
import { getTestAgent } from "../helpers/testApp.js";
import {
  getAdminAuthHeader,
  getUserAuthHeader,
} from "../helpers/authHelper.js";

describe("Genre API", () => {
  let agent;

  beforeAll(async () => {
    agent = await getTestAgent();
  });

  it("GET /api/genres returns all genres", async () => {
    await Genre.create({ name: "Drama" });
    await Genre.create({ name: "Comedy" });

    const res = await agent.get("/api/genres");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((g) => g.name)).toEqual(
      expect.arrayContaining(["Drama", "Comedy"])
    );
  });

  it("POST /api/genres creates a new genre as admin", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/genres")
      .set(authHeader)
      .send({ name: "Horror" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Genre added successfully");
  });

  it("POST /api/genres returns 400 for duplicate genre", async () => {
    await Genre.create({ name: "Sci-Fi" });
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/genres")
      .set(authHeader)
      .send({ name: "Sci-Fi" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Genre already exists");
  });

  it("POST /api/genres returns 401 without token", async () => {
    const res = await agent.post("/api/genres").send({ name: "Thriller" });

    expect(res.status).toBe(401);
  });

  it("DELETE /api/genres/:genreId removes genre as admin", async () => {
    const genre = await Genre.create({ name: "Romance" });
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .delete(`/api/genres/${genre._id}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Genre deleted successfully");
    expect(res.body.genres.some((g) => g.name === "Romance")).toBe(false);
  });

  it("DELETE /api/genres/:genreId returns 403 for regular user", async () => {
    const genre = await Genre.create({ name: "Fantasy" });
    const authHeader = await getUserAuthHeader();

    const res = await agent
      .delete(`/api/genres/${genre._id}`)
      .set(authHeader);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Admins only.");
  });

  it("DELETE /api/genres/:genreId returns 404 for unknown genre", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .delete("/api/genres/507f1f77bcf86cd799439011")
      .set(authHeader);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Genre not found");
  });
});
