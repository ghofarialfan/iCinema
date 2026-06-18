import movieReducer from "./movieReducer";
import { GET_MOVIES_SUCCESS, GET_MOVIES_ERROR } from "../actions/actionTypes";

describe("movieReducer", () => {
  const initialState = {
    movies: [],
    movie: {},
    error: null,
    loading: true,
  };

  it("returns initial state by default", () => {
    expect(movieReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("handles GET_MOVIES_SUCCESS", () => {
    const movies = [{ _id: "1", title: "Test Movie" }];

    const state = movieReducer(initialState, {
      type: GET_MOVIES_SUCCESS,
      payload: movies,
    });

    expect(state.movies).toEqual(movies);
    expect(state.loading).toBe(false);
  });

  it("handles GET_MOVIES_ERROR", () => {
    const error = new Error("Failed to fetch");

    const state = movieReducer(initialState, {
      type: GET_MOVIES_ERROR,
      error,
    });

    expect(state.error).toBe(error);
  });
});
