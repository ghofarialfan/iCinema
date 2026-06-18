import genreReducer from "./genreReducer";
import {
  GET_GENRES_SUCCESS,
  GET_GENRES_ERROR,
  ADD_GENRE_SUCCESS,
  ADD_GENRE_ERROR,
} from "../actions/actionTypes";

describe("genreReducer", () => {
  const initialState = {
    genres: [],
    newGenre: {},
    error: null,
  };

  it("returns initial state by default", () => {
    expect(genreReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("handles GET_GENRES_SUCCESS", () => {
    const genres = [{ _id: "1", name: "Action" }];

    const state = genreReducer(initialState, {
      type: GET_GENRES_SUCCESS,
      payload: genres,
    });

    expect(state.genres).toEqual(genres);
  });

  it("handles GET_GENRES_ERROR", () => {
    const error = new Error("Failed");

    const state = genreReducer(initialState, {
      type: GET_GENRES_ERROR,
      error,
    });

    expect(state.error).toBe(error);
  });

  it("handles ADD_GENRE_SUCCESS", () => {
    const newGenre = { message: "Genre added successfully" };

    const state = genreReducer(initialState, {
      type: ADD_GENRE_SUCCESS,
      payload: newGenre,
    });

    expect(state.newGenre).toEqual(newGenre);
  });

  it("handles ADD_GENRE_ERROR", () => {
    const error = new Error("Add failed");

    const state = genreReducer(initialState, {
      type: ADD_GENRE_ERROR,
      error,
    });

    expect(state.error).toBe(error);
  });
});
