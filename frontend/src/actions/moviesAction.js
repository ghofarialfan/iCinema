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

const getAuthConfig = (contentType, onUploadProgress) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    ...(onUploadProgress ? { onUploadProgress } : {}),
  };
};

export const addMovie = (movie, history, onUploadProgress) => {
  return async (dispatch) => {
    const formData = buildMovieFormData(movie);
    const config = getAuthConfig("multipart/form-data", onUploadProgress);

    try {
      const result = await Axios.post(
        "/api/movies/addMovie",
        formData,
        config
      );

      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });

      const updatedMovies = await Axios.get("/api/movies");
      dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: updatedMovies.data.movies,
      });

      return result.data;
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};

export const updateMovie = (movieId, movie, onUploadProgress) => {
  return async (dispatch) => {
    const formData = buildMovieFormData(movie);
    const config = getAuthConfig("multipart/form-data", onUploadProgress);

    try {
      const result = await Axios.patch(
        `/api/movies/${movieId}`,
        formData,
        config
      );

      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });

      const updatedMovies = await Axios.get("/api/movies");
      dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: updatedMovies.data.movies,
      });

      return result.data;
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};

export const deleteMovie = (movieId) => {
  return async (dispatch) => {
    const config = getAuthConfig();

    try {
      const result = await Axios.delete(`/api/movies/${movieId}`, config);

      dispatch({ type: DELETE_MOVIE_SUCCESS, payload: result.data.movies });
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });

      return result.data;
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
      throw error;
    }
  };
};
