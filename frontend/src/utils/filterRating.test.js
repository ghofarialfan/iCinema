import filterRating from "./filterRating";

const movies = [
  { title: "Low", rate: 5 },
  { title: "Mid", rate: 7 },
  { title: "High", rate: 9 },
];

describe("filterRating utility", () => {
  it("returns all movies when rating is 0", () => {
    expect(filterRating(movies, 0)).toEqual(movies);
  });

  it("filters movies with rate greater than or equal to minimum", () => {
    const result = filterRating(movies, 7);
    expect(result).toHaveLength(2);
    expect(result.map((m) => m.title)).toEqual(["Mid", "High"]);
  });

  it("returns empty array when no movie meets rating threshold", () => {
    expect(filterRating(movies, 10)).toEqual([]);
  });
});
