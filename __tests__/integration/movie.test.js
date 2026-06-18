import Genre from "../../models/genre.js";
import Movie from "../../models/movie.js";
import { getTestAgent } from "../helpers/testApp.js";
import {
  getAdminAuthHeader,
  getUserAuthHeader,
} from "../helpers/authHelper.js";

describe("Movie API", () => {
  let agent;
  let genreId;

  beforeAll(async () => {
    agent = await getTestAgent();
  });

  beforeEach(async () => {
    const genre = await Genre.create({ name: "Action" });
    genreId = genre._id.toString();
  });

  it("GET /api/movies returns all movies", async () => {
    await Movie.create({
      title: "Test Movie",
      genre: [genreId],
      rate: 8,
      description: "A test movie",
      movieLength: "120 min",
      image: "https://example.com/poster.jpg",
    });

    const res = await agent.get("/api/movies");

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.movies).toHaveLength(1);
    expect(res.body.movies[0].title).toBe("Test Movie");
  });

  it("GET /api/movies/:movieId returns a movie with populated genre", async () => {
    const movie = await Movie.create({
      title: "Single Movie",
      genre: [genreId],
      rate: 7,
      description: "Description",
      movieLength: "90 min",
      image: "https://example.com/poster.jpg",
    });

    const res = await agent.get(`/api/movies/${movie._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Single Movie");
    expect(res.body.genre[0].name).toBe("Action");
  });

  it("GET /api/movies/:movieId returns 404 for invalid id", async () => {
    const res = await agent.get("/api/movies/507f1f77bcf86cd799439011");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("The movie you are looking doesn't exist");
  });

  it("POST /api/movies/addMovie returns 401 without token", async () => {
    const res = await agent.post("/api/movies/addMovie").send({
      title: "Unauthorized Movie",
      genre: genreId,
      rate: 8,
      description: "Test",
      movieLength: "100 min",
    });

    expect(res.status).toBe(401);
  });

  it("POST /api/movies/addMovie returns 403 for regular user", async () => {
    const authHeader = await getUserAuthHeader();

    const res = await agent
      .post("/api/movies/addMovie")
      .set(authHeader)
      .send({
        title: "User Movie",
        genre: genreId,
        rate: 8,
        description: "Test",
        movieLength: "100 min",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Admins only.");
  });

  it("POST /api/movies/addMovie returns 400 when cover image is missing", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/movies/addMovie")
      .set({ ...authHeader, "x-test-no-image": "true" })
      .send({
        title: "No Image Movie",
        genre: genreId,
        rate: 8,
        description: "Test",
        movieLength: "100 min",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Cover image is required");
  });

  it("POST /api/movies/addMovie returns 400 for duplicate title", async () => {
    await Movie.create({
      title: "Duplicate Movie",
      genre: [genreId],
      rate: 8,
      description: "Existing",
      movieLength: "100 min",
      image: "https://example.com/poster.jpg",
    });

    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/movies/addMovie")
      .set(authHeader)
      .send({
        title: "Duplicate Movie",
        genre: genreId,
        rate: 7,
        description: "New",
        movieLength: "110 min",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Movie already exists");
  });

  it("DELETE /api/movies/:movieId returns 404 for unknown movie", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .delete("/api/movies/507f1f77bcf86cd799439011")
      .set(authHeader);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  it("PATCH /api/movies/:movieId returns 404 for unknown movie", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .patch("/api/movies/507f1f77bcf86cd799439011")
      .set(authHeader)
      .send({
        title: "Ghost Movie",
        genre: genreId,
        rate: 5,
        description: "Missing",
        movieLength: "90 min",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  it("POST /api/movies/addMovie uploads optional video file", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/movies/addMovie")
      .set({ ...authHeader, "x-test-with-video": "true" })
      .send({
        title: "New Admin Movie",
        genre: genreId,
        rate: 9,
        description: "A great movie",
        movieLength: "130 min",
        trailerLink: "https://youtube.com/watch?v=test",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Movie added successfully");
    const created = res.body.movies.find((m) => m.title === "New Admin Movie");
    expect(created).toBeDefined();
    expect(created.videoUrl).toContain("cloudinary.com");
  });

  it("POST /api/movies/addMovie creates movie as admin", async () => {
    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .post("/api/movies/addMovie")
      .set(authHeader)
      .send({
        title: "Simple Admin Movie",
        genre: genreId,
        rate: 9,
        description: "A great movie",
        movieLength: "130 min",
        trailerLink: "https://youtube.com/watch?v=test",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Movie added successfully");
    expect(res.body.movies.some((m) => m.title === "Simple Admin Movie")).toBe(
      true
    );
  });

  it("PATCH /api/movies/:movieId updates movie as admin", async () => {
    const movie = await Movie.create({
      title: "Old Title",
      genre: [genreId],
      rate: 6,
      description: "Old description",
      movieLength: "100 min",
      image: "https://example.com/poster.jpg",
    });

    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .patch(`/api/movies/${movie._id}`)
      .set(authHeader)
      .send({
        title: "Updated Title",
        genre: genreId,
        rate: 8,
        description: "Updated description",
        movieLength: "105 min",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Movie updated successfully");

    const updated = res.body.movies.find(
      (m) => m._id === movie._id.toString()
    );
    expect(updated.title).toBe("Updated Title");
    expect(updated.rate).toBe(8);
  });

  it("DELETE /api/movies/:movieId removes movie as admin", async () => {
    const movie = await Movie.create({
      title: "Delete Me",
      genre: [genreId],
      rate: 5,
      description: "To be deleted",
      movieLength: "80 min",
      image: "https://example.com/poster.jpg",
    });

    const authHeader = await getAdminAuthHeader();

    const res = await agent
      .delete(`/api/movies/${movie._id}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Movie deleted successfully");
    expect(
      res.body.movies.some((m) => m._id === movie._id.toString())
    ).toBe(false);
  });
});
