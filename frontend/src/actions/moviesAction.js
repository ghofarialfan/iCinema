import Axios from "axios";
import { GET_MOVIES_SUCCESS, GET_MOVIES_ERROR } from "./actionTypes";

export const getMovies = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/movies");
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
    }
  };
};

export const addMovie = (movie, history) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const payload = {
      title: movie.title,
      genre: movie.genre,
      rate: movie.rate,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      movieLength: movie.movieLength,
    };

    try {
      const result = await Axios.post(
        "/api/movies/addMovie",
        payload,
        config
      );
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
      history.push("/movies");
      const updatedMovies = await Axios.get("/api/movies");
      dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: updatedMovies.data.movies,
      });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};
