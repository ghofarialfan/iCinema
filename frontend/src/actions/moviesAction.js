import Axios from "axios";
import {
  GET_MOVIES_SUCCESS,
  GET_MOVIES_ERROR,
  DELETE_MOVIE_SUCCESS,
} from "./actionTypes";

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

    const formData = new FormData();
    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("rate", movie.rate);
    formData.append("description", movie.description);
    formData.append("trailerLink", movie.trailerLink || "");
    formData.append("movieLength", movie.movieLength);
    formData.append("image", movie.imageFile);
    if (movie.videoFile) {
      formData.append("video", movie.videoFile);
    }

    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const result = await Axios.post(
        "/api/movies/addMovie",
        formData,
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

const buildMovieFormData = (movie) => {
  const formData = new FormData();
  formData.append("title", movie.title);
  formData.append("genre", movie.genre);
  formData.append("rate", movie.rate);
  formData.append("description", movie.description);
  formData.append("trailerLink", movie.trailerLink || "");
  formData.append("movieLength", movie.movieLength);
  if (movie.imageFile) {
    formData.append("image", movie.imageFile);
  }
  if (movie.videoFile) {
    formData.append("video", movie.videoFile);
  }
  return formData;
};

const getAuthConfig = (contentType) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
  };
};

export const updateMovie = (movieId, movie) => {
  return async (dispatch) => {
    const formData = buildMovieFormData(movie);
    const config = getAuthConfig("multipart/form-data");

    try {
      const result = await Axios.patch(
        `/api/movies/${movieId}`,
        formData,
        config
      );
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};

export const deleteMovie = (movieId) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    try {
      const result = await Axios.delete(`/api/movies/${movieId}`, config);
      dispatch({ type: DELETE_MOVIE_SUCCESS, payload: result.data.movies });
      // Also update general movies list
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};
