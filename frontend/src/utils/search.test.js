import search from "./search";

const movies = [
  { title: "Inception" },
  { title: "Interstellar" },
  { title: "The Matrix" },
];

describe("search utility", () => {
  it("returns all items when filter is empty", () => {
    expect(search(movies, "", "title")).toEqual(movies);
  });

  it("filters movies by title prefix case-insensitively", () => {
    const result = search(movies, "incep", "title");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Inception");
  });

  it("returns empty array when no match found", () => {
    expect(search(movies, "xyz", "title")).toEqual([]);
  });

  it("returns all items when filter is whitespace only", () => {
    expect(search(movies, "   ", "title")).toEqual(movies);
  });
});
