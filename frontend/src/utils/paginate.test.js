import paginate from "./paginate";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("paginate utility", () => {
  it("returns first page items", () => {
    expect(paginate(items, 1, 4)).toEqual([1, 2, 3, 4]);
  });

  it("returns second page items", () => {
    expect(paginate(items, 2, 4)).toEqual([5, 6, 7, 8]);
  });

  it("returns partial last page", () => {
    expect(paginate(items, 3, 4)).toEqual([9, 10]);
  });

  it("returns empty array for empty input", () => {
    expect(paginate([], 1, 4)).toEqual([]);
  });
});
