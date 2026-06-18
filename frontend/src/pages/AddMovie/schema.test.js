import { movieSchema } from "./schema";

describe("movieSchema validation", () => {
  const validData = {
    title: "Test Movie",
    genre: "507f1f77bcf86cd799439011",
    rate: 8,
    description: "A test movie description",
    movieLength: "120 min",
    trailerLink: "https://youtube.com/watch?v=test",
  };

  it("validates correct movie data", () => {
    const { error } = movieSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it("requires title", () => {
    const { error } = movieSchema.validate({ ...validData, title: "" });
    expect(error).toBeDefined();
    expect(error.details[0].path).toContain("title");
  });

  it("requires genre", () => {
    const { error } = movieSchema.validate({ ...validData, genre: "" });
    expect(error).toBeDefined();
  });

  it("requires movieLength", () => {
    const { error } = movieSchema.validate({ ...validData, movieLength: "" });
    expect(error).toBeDefined();
  });

  it("rejects rate above 10", () => {
    const { error } = movieSchema.validate({ ...validData, rate: 11 });
    expect(error).toBeDefined();
  });

  it("rejects negative rate", () => {
    const { error } = movieSchema.validate({ ...validData, rate: -1 });
    expect(error).toBeDefined();
  });

  it("allows empty trailerLink", () => {
    const { error } = movieSchema.validate({ ...validData, trailerLink: "" });
    expect(error).toBeUndefined();
  });
});
