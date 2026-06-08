import React from "react";
import { connect } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Button } from "../../components/common";
import {
  addMovie,
  getMovies,
  deleteMovie,
  updateMovie,
} from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";
import { movieSchema } from "./schema";
import "./style.css";

const emptyFormData = (defaultGenre = "") => ({
  title: "",
  genre: defaultGenre,
  rate: 0,
  description: "",
  image: "",
  video: "",
  trailerLink: "",
  movieLength: "",
});

class AddMovieForm extends React.Component {
  _isMounted = false;
  formRef = React.createRef();

  state = {
    data: emptyFormData(),
    imageFile: null,
    errors: {},
    submitError: null,
    submitSuccess: null,
    imagePreview: null,
    videoFile: null,
    editingMovieId: null,
    existingImageUrl: null,
    existingVideoUrl: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.getGenres();
    this.props.getMovies();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.genres.length > 0 &&
      prevProps.genres.length === 0 &&
      !this.state.editingMovieId
    ) {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          genre: this.props.genres[0]._id,
        },
      }));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.revokeBlobPreview();
  }

  revokeBlobPreview = () => {
    const { imagePreview } = this.state;
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  getFieldError = (fieldName) => {
    const { errors } = this.state;

    if (!errors) return null;

    if (Array.isArray(errors)) {
      const fieldError = errors.find(
        (error) => error.path && error.path[0] === fieldName
      );

      return fieldError ? fieldError.message : null;
    }

    return errors[fieldName] || null;
  };

  resetForm = () => {
    this.revokeBlobPreview();
    const defaultGenre = this.props.genres[0]?._id || "";

    this.setState({
      data: emptyFormData(defaultGenre),
      imageFile: null,
      videoFile: null,
      imagePreview: null,
      errors: {},
      submitError: null,
      editingMovieId: null,
      existingImageUrl: null,
      existingVideoUrl: null,
    });
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.name === "rate" ? Number(input.value) : input.value;
    this.setState({ data, submitSuccess: null });
  };

  handleImageChange = ({ currentTarget: input }) => {
    const file = input.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      this.setState({
        errors: { ...this.state.errors, image: "Poster must be JPG or PNG" },
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.setState({
        errors: { ...this.state.errors, image: "Poster must be 5MB or smaller" },
      });
      return;
    }

    this.revokeBlobPreview();

    const errors = { ...this.state.errors };
    delete errors.image;

    this.setState({
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      errors,
      submitSuccess: null,
    });
  };

  handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ videoFile: file, submitSuccess: null });
    }
  };

  handleEdit = (movie) => {
    const genreId =
      movie.genre && movie.genre.length > 0
        ? typeof movie.genre[0] === "object"
          ? movie.genre[0]._id
          : movie.genre[0]
        : this.props.genres[0]?._id || "";

    this.revokeBlobPreview();

    this.setState(
      {
        editingMovieId: movie._id,
        existingImageUrl: movie.image || null,
        existingVideoUrl: movie.videoUrl || null,
        data: {
          title: movie.title || "",
          genre: genreId,
          rate: movie.rate || 0,
          description: movie.description || "",
          image: "",
          video: "",
          trailerLink: movie.trailerLink || "",
          movieLength: movie.movieLength || "",
        },
        imageFile: null,
        videoFile: null,
        imagePreview: movie.image || null,
        errors: {},
        submitError: null,
        submitSuccess: null,
      },
      () => {
        this.formRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  handleCancelEdit = () => {
    this.resetForm();
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { data, imageFile, editingMovieId, existingImageUrl } = this.state;
    const isEditing = Boolean(editingMovieId);
    const { error } = movieSchema.validate(data);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      this.setState({ errors, submitError: null, submitSuccess: null });
      return;
    }

    if (!isEditing && !imageFile) {
      this.setState({
        errors: { ...this.state.errors, image: "Cover image is required" },
        submitError: null,
        submitSuccess: null,
      });
      return;
    }

    if (isEditing && !imageFile && !existingImageUrl) {
      this.setState({
        errors: { ...this.state.errors, image: "Cover image is required" },
        submitError: null,
        submitSuccess: null,
      });
      return;
    }

    this.setState({ errors: {}, submitError: null, submitSuccess: null });

    const movieData = {
      ...data,
      imageFile: this.state.imageFile,
      videoFile: this.state.videoFile,
    };

    try {
      if (isEditing) {
        await this.props.updateMovie(editingMovieId, movieData);

        if (this._isMounted) {
          this.resetForm();
          this.setState({ submitSuccess: "Movie updated successfully" });
        }
      } else {
        await this.props.addMovie(movieData, this.props.history);

        if (this._isMounted) {
          this.resetForm();
        }
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        (isEditing ? "Failed to update movie" : "Failed to add movie");

      this.setState({ submitError: message });
    }
  };

  handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await this.props.deleteMovie(movieId);
        if (this.state.editingMovieId === movieId) {
          this.resetForm();
        }
      } catch (err) {
        alert("Failed to delete movie");
      }
    }
  };

  render() {
    const {
      data,
      submitError,
      submitSuccess,
      imagePreview,
      editingMovieId,
      existingVideoUrl,
      videoFile,
    } = this.state;
    const { title, genre, rate, description, trailerLink, movieLength } = data;
    const { genres = [], movies = [] } = this.props;
    const isEditing = Boolean(editingMovieId);

    return (
      <div className="add-movie-page">
        <div className="add-movie-container">
          <section className="add-movie-hero">
            <div className="add-movie-hero-content">
              <span className="add-movie-badge">Admin Movie Management</span>

              <h1>Manage Movies</h1>

              <p>
                Add new movies, edit existing ones, or remove them from the
                iCinema database.
              </p>
            </div>

            <div className="add-movie-hero-card">
              <div className="add-movie-hero-icon">
                <i className="fas fa-tasks"></i>
              </div>

              <div>
                <h4>Manage Catalog</h4>
                <p>Keep the movie list updated and relevant.</p>
              </div>
            </div>
          </section>

          <section className="add-movie-panel mb-5">
            <div className="add-movie-section-header">
              <span>
                <i className="fas fa-list"></i>
              </span>
              <div>
                <h3>Existing Movies</h3>
                <p>List of all movies currently in the database.</p>
              </div>
            </div>

            <div className="manage-list-container">
              {movies && movies.length > 0 ? (
                <div className="manage-table-wrapper">
                  <table className="manage-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((movie) => (
                        <tr key={movie._id}>
                          <td>{movie.title}</td>
                          <td>
                            {movie.genre &&
                            Array.isArray(movie.genre) &&
                            movie.genre.length > 0
                              ? movie.genre
                                  .map((g) =>
                                    typeof g === "object" ? g.name : g
                                  )
                                  .filter(Boolean)
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td>{movie.rate}</td>
                          <td>
                            <div className="manage-actions">
                              <button
                                type="button"
                                className="manage-edit-btn"
                                onClick={() => this.handleEdit(movie)}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button
                                type="button"
                                className="manage-delete-btn"
                                onClick={() => this.handleDelete(movie._id)}
                              >
                                <i className="fas fa-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No movies found in database.</p>
              )}
            </div>
          </section>

          <div className="add-movie-section-divider">
            <span>{isEditing ? "EDITING MOVIE" : "OR ADD NEW MOVIE"}</span>
          </div>

          {submitError && (
            <div className="add-movie-error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="add-movie-success-message">
              <i className="fas fa-check-circle"></i>
              <span>{submitSuccess}</span>
            </div>
          )}

          <form
            ref={this.formRef}
            onSubmit={this.handleSubmit}
            className="add-movie-form"
            encType="multipart/form-data"
          >
            <div className="add-movie-grid">
              <section className="add-movie-panel add-movie-main-panel">
                <div className="add-movie-section-header">
                  <span>
                    <i className="fas fa-film"></i>
                  </span>

                  <div>
                    <h3>Movie Information</h3>
                    <p>Basic details that describe the movie identity.</p>
                  </div>
                </div>

                <div className="add-movie-form-grid">
                  <Input
                    name="title"
                    value={title}
                    label="Title"
                    onChange={this.handleChange}
                    placeholder="Enter the movie title"
                    error={this.getFieldError("title")}
                    iconClass="fas fa-film"
                    autoFocus={isEditing}
                  />

                  <Select
                    name="genre"
                    label="Genre"
                    onChange={this.handleChange}
                    value={genre}
                    error={this.getFieldError("genre")}
                    options={genres || []}
                    iconClass="fas fa-tags"
                  />

                  <Input
                    name="rate"
                    label="Rating"
                    onChange={this.handleChange}
                    placeholder="Enter rating, e.g. 8"
                    error={this.getFieldError("rate")}
                    iconClass="fas fa-star"
                    value={rate}
                    type="number"
                  />

                  <Input
                    name="movieLength"
                    label="Movie Length"
                    onChange={this.handleChange}
                    placeholder="Enter duration, e.g. 120 min"
                    error={this.getFieldError("movieLength")}
                    iconClass="fas fa-clock"
                    value={movieLength}
                  />
                </div>
              </section>

              <section className="add-movie-panel">
                <div className="add-movie-section-header">
                  <span>
                    <i className="fas fa-photo-video"></i>
                  </span>

                  <div>
                    <h3>Media Source</h3>
                    <p>Upload a poster image and add a trailer link.</p>
                  </div>
                </div>

                <div className="input-container">
                  <label htmlFor="image">Cover Poster</label>
                  <div className="input-icon fas fa-file-image" />
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="form-control"
                    onChange={this.handleImageChange}
                  />
                  {this.getFieldError("image") && (
                    <div className="alert alert-danger">
                      {this.getFieldError("image")}
                    </div>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Poster preview"
                      className="add-movie-poster-preview"
                      style={{
                        maxWidth: "200px",
                        marginTop: "12px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>

                <Input
                  name="trailerLink"
                  label="Trailer Link"
                  onChange={this.handleChange}
                  placeholder="Enter YouTube trailer link"
                  error={this.getFieldError("trailerLink")}
                  iconClass="fas fa-link"
                  value={trailerLink}
                />

                <div className="add-movie-file-input">
                  <label>
                    <i className="fas fa-video"></i> Movie Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={this.handleVideoChange}
                    className="form-control"
                  />
                  {videoFile && (
                    <span className="file-selected-badge">
                      <i className="fas fa-check"></i> {videoFile.name}
                    </span>
                  )}
                  {!videoFile && existingVideoUrl && isEditing && (
                    <span className="file-selected-badge">
                      <i className="fas fa-check"></i> Current video kept
                    </span>
                  )}
                </div>

                <div className="add-movie-helper-card">
                  <i className="fas fa-info-circle"></i>
                  <p>
                    {isEditing
                      ? "Upload a new JPG or PNG poster (max 5MB) only if you want to replace the current one. Leave empty to keep the existing poster."
                      : "Upload a JPG or PNG poster (max 5MB). The image is stored on Cloudinary. Make sure the trailer link is accessible."}
                  </p>
                </div>
              </section>
            </div>

            <section className="add-movie-panel add-movie-description-panel">
              <div className="add-movie-section-header">
                <span>
                  <i className="fas fa-align-left"></i>
                </span>

                <div>
                  <h3>Description</h3>
                  <p>Write a short summary that helps users understand the movie.</p>
                </div>
              </div>

              <Input
                name="description"
                label="Description"
                placeholder="Enter a short description about this movie"
                iconClass="fas fa-info"
                error={this.getFieldError("description")}
                type="textarea"
                value={description}
                onChange={this.handleChange}
              />
            </section>

            <section className="add-movie-submit-panel">
              <div>
                <h4>{isEditing ? "Save your changes?" : "Ready to publish?"}</h4>
                <p>
                  {isEditing
                    ? "Review the updated movie details before saving them to the iCinema database."
                    : "Review the movie details before submitting it to the iCinema database."}
                </p>
              </div>

              <div className="add-movie-submit-actions">
                {isEditing && (
                  <button
                    type="button"
                    className="manage-cancel-btn"
                    onClick={this.handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
                <div className="add-movie-submit-button">
                  <Button
                    type="submit"
                    label={isEditing ? "Save Changes" : "Add Movie"}
                  />
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMovie: (movie, history) => dispatch(addMovie(movie, history)),
    updateMovie: (movieId, movie) => dispatch(updateMovie(movieId, movie)),
    getMovies: () => dispatch(getMovies()),
    deleteMovie: (movieId) => dispatch(deleteMovie(movieId)),
    getGenres: () => dispatch(getGenres()),
  };
};

const mapStateToProps = (state) => {
  return {
    genres: state.genre.genres,
    movies: state.movie.movies,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMovieForm);
