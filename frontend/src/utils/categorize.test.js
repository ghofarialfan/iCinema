import categorize from "./categorize";

const movies = [
  { title: "Movie A", genre: [{ name: "Action" }, { name: "Drama" }] },
  { title: "Movie B", genre: [{ name: "Comedy" }] },
  { title: "Movie C", genre: [{ name: "Action" }] },
];

describe("categorize utility", () => {
  it('returns all movies when genre is "All"', () => {
    expect(categorize(movies, "All")).toEqual(movies);
  });

  it("filters movies by genre name", () => {
    const result = categorize(movies, "Action");
    expect(result).toHaveLength(2);
    expect(result.map((m) => m.title)).toEqual(["Movie A", "Movie C"]);
  });

  it("returns empty array when no movie matches genre", () => {
    expect(categorize(movies, "Horror")).toEqual([]);
  });
});
