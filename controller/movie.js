import express from "express";
const router = express.Router();

import Movie from "../models/movie.js";
import Genre from "../models/genre.js";
import checkAuth from "../middleware/checkAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";

import { upload } from "../utils/cloudinary.js";

const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed", message: err.message });
    }
    next();
  });
};

/**
 * Read all movies.
 * @route GET /api/movies
 * @returns {object} An object containing the count and list of movies.
 * @throws {Error} If an error occurs while retrieving the movies.
 */
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate({
      path: "genre",
      select: "name",
    });
    res.status(200).json({
      count: movies.length,
      movies: movies,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Read a movie by its ID.
 * @route GET /api/movies/:movieId
 * @param {string} movieId - The ID of the movie to retrieve.
 * @returns {object} The movie object.
 * @throws {Error} If the movie is not found or an error occurs while retrieving it.
 */
router.get("/:movieId", async (req, res) => {
  try {
    const movie = await Movie.findById({ _id: req.params.movieId })
      .populate("genre", "name")
      .exec(); // populate the genre associated with the movie
    if (movie) return res.status(200).json(movie);
    return res
      .status(404)
      .json({ error: "The movie you are looking doesn't exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a new movie.
 * @route POST /api/movies/addMovie
 * @param {string} title - The title of the movie.
 * @param {string} genre - The genre of the movie.
 * @param {number} rate - The rating of the movie.
 * @param {string} description - The description of the movie.
 * @param {string} trailerLink - The link to the movie's trailer.
 * @param {number} movieLength - The length of the movie in minutes.
 * @param {File} image - The image file for the movie.
 * @returns {object} A success message if the movie is added successfully.
 * @throws {Error} If the movie already exists, an error occurs while saving the movie, or validation fails.
 */
router.post(
  "/addMovie",
  checkAuth,
  checkAdmin,
  uploadImage,
  async (req, res) => {
    try {
      const { title, genre, rate, description, trailerLink, movieLength } =
      req.body;
    const isMovieExists = await Movie.findOne({ title });

    if (isMovieExists) {
      return res.status(400).json({ message: "Movie already exists" });
    }

    const imagePath = req.file?.path || "";
    const movieGenre = Array.isArray(genre) ? genre : genre ? [genre] : [];

    const newMovie = new Movie({
      title,
      genre: movieGenre,
      rate: Number(rate) || 0,
      description,
      trailerLink,
      movieLength,
      image: imagePath,
    });
    await newMovie.save();
    const movies = await Movie.find().populate({
      path: "genre",
      select: "name",
    });
    res.status(201).json({ message: "Movie added successfully", movies: movies });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add movie", message: error.message });
  }
});

/**
 * Update a movie by its ID.
 * @route PATCH /api/movies/:movieId
 * @param {string} movieId - The ID of the movie to update.
 * @returns {object} A success message and the updated movie object.
 * @throws {Error} If the movie is not found, an error occurs while updating it, or validation fails.
 */
router.patch("/:movieId", checkAuth, checkAdmin, async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(
      { _id: req.params.movieId },
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "movie updated successfully", updateMovie });
  } catch (err) {
    res.status(500).json({ err: `Something went wrong: ${err}` });
  }
});

export default router;
