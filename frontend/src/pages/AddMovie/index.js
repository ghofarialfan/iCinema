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

    isUploading: false,
    uploadProgress: 0,
    uploadStatus: "",
    uploadSuccess: false,
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

  normalizeRating = (value) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) return 0;
    if (parsedValue < 0) return 9;
    if (parsedValue > 9) return 0;

    return parsedValue;
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

  handleUploadProgress = (progressEvent) => {
    if (!progressEvent.total) {
      this.setState({
        uploadProgress: 55,
        uploadStatus: "Uploading movie assets...",
      });
      return;
    }

    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );

    let uploadStatus = "Uploading movie data...";

    if (percentCompleted < 25) {
      uploadStatus = "Preparing poster and movie files...";
    } else if (percentCompleted < 60) {
      uploadStatus = "Uploading assets to server...";
    } else if (percentCompleted < 95) {
      uploadStatus = "Finalizing upload process...";
    } else {
      uploadStatus = "Processing movie data...";
    }

    this.setState({
      uploadProgress: percentCompleted,
      uploadStatus,
    });
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
      submitSuccess: null,
      editingMovieId: null,
      existingImageUrl: null,
      existingVideoUrl: null,
      isUploading: false,
      uploadProgress: 0,
      uploadStatus: "",
      uploadSuccess: false,
    });
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };

    if (input.name === "rate") {
      data.rate = this.normalizeRating(input.value);
    } else {
      data[input.name] = input.value;
    }

    this.setState({ data, submitSuccess: null });
  };

  handleImageChange = ({ currentTarget: input }) => {
    const file = input.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      this.setState({
        errors: {
          ...this.state.errors,
          image: "Poster must be JPG or PNG",
        },
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.setState({
        errors: {
          ...this.state.errors,
          image: "Poster must be 5MB or smaller",
        },
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
      this.setState({
        videoFile: file,
        submitSuccess: null,
      });
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
        isUploading: false,
        uploadProgress: 0,
        uploadStatus: "",
        uploadSuccess: false,
      },
      () => {
        this.formRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  handleCancelEdit = () => {
    if (this.state.isUploading) return;
    this.resetForm();
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { data, imageFile, editingMovieId, existingImageUrl } = this.state;
    const isEditing = Boolean(editingMovieId);

    const sanitizedData = {
      ...data,
      rate: this.normalizeRating(data.rate),
    };

    const { error } = movieSchema.validate(sanitizedData);

    if (error) {
      const errors = {};

      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      this.setState({
        errors,
        submitError: null,
        submitSuccess: null,
      });
      return;
    }

    if (!isEditing && !imageFile) {
      this.setState({
        errors: {
          ...this.state.errors,
          image: "Cover image is required",
        },
        submitError: null,
        submitSuccess: null,
      });
      return;
    }

    if (isEditing && !imageFile && !existingImageUrl) {
      this.setState({
        errors: {
          ...this.state.errors,
          image: "Cover image is required",
        },
        submitError: null,
        submitSuccess: null,
      });
      return;
    }

    this.setState({
      errors: {},
      submitError: null,
      submitSuccess: null,
      isUploading: true,
      uploadProgress: 0,
      uploadStatus: isEditing ? "Preparing update..." : "Preparing upload...",
      uploadSuccess: false,
    });

    const movieData = {
      ...sanitizedData,
      imageFile: this.state.imageFile,
      videoFile: this.state.videoFile,
    };

    try {
      if (isEditing) {
        await this.props.updateMovie(
          editingMovieId,
          movieData,
          this.handleUploadProgress
        );

        if (this._isMounted) {
          this.setState({
            uploadProgress: 100,
            uploadStatus: "Movie updated successfully.",
            uploadSuccess: true,
            submitSuccess: "Movie updated successfully",
          });

          setTimeout(() => {
            if (!this._isMounted) return;
            this.resetForm();
          }, 900);
        }
      } else {
        await this.props.addMovie(
          movieData,
          this.props.history,
          this.handleUploadProgress
        );

        if (this._isMounted) {
          this.setState({
            uploadProgress: 100,
            uploadStatus: "Movie uploaded successfully.",
            uploadSuccess: true,
            submitSuccess: "Movie uploaded successfully",
          });

          setTimeout(() => {
            if (!this._isMounted) return;
            this.resetForm();
          }, 900);
        }
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        (isEditing ? "Failed to update movie" : "Failed to add movie");

      this.setState({
        submitError: message,
        isUploading: false,
        uploadProgress: 0,
        uploadStatus: "",
        uploadSuccess: false,
      });
    }
  };

  handleDelete = async (movieId) => {
    if (this.state.isUploading) return;

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
      isUploading,
      uploadProgress,
      uploadStatus,
      uploadSuccess,
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
                                disabled={isUploading}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </button>

                              <button
                                type="button"
                                className="manage-delete-btn"
                                onClick={() => this.handleDelete(movie._id)}
                                disabled={isUploading}
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

          {submitSuccess && !isUploading && (
            <div className="add-movie-success-message">
              <i className="fas fa-check-circle"></i>
              <span>{submitSuccess}</span>
            </div>
          )}

          {isUploading && (
            <div
              className={
                uploadSuccess
                  ? "upload-progress-card upload-success"
                  : "upload-progress-card"
              }
            >
              <div className="upload-progress-header">
                <div className="upload-progress-icon">
                  <i
                    className={
                      uploadSuccess
                        ? "fas fa-check"
                        : "fas fa-cloud-upload-alt"
                    }
                  ></i>
                </div>

                <div>
                  <h4>
                    {uploadSuccess
                      ? isEditing
                        ? "Movie Updated"
                        : "Movie Uploaded"
                      : isEditing
                      ? "Updating Movie"
                      : "Uploading Movie"}
                  </h4>
                  <p>{uploadStatus}</p>
                </div>

                <strong>{uploadProgress}%</strong>
              </div>

              <div className="upload-progress-track">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>

              <div className="upload-progress-footer">
                <span>
                  <i className="fas fa-image"></i>
                  Poster
                </span>

                <span>
                  <i className="fas fa-video"></i>
                  Movie File
                </span>

                <span>
                  <i className="fas fa-database"></i>
                  Database
                </span>
              </div>
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
                    min="0"
                    max="9"
                    step="1"
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
                    <i className="fas fa-camera"></i>
                  </span>

                  <div>
                    <h3>Media Source</h3>
                    <p>Upload a poster image and add a trailer link.</p>
                  </div>
                </div>
                
                <div className="input-container media-file-field">
                  <label htmlFor="image">Cover Poster</label>

                  <div className="custom-file-upload">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="custom-file-input"
                      onChange={this.handleImageChange}
                      disabled={isUploading}
                    />

                    <label htmlFor="image" className="custom-file-button">
                      <span className="file-upload-emoji" aria-hidden="true">
                        🖼️
                      </span>
                      <span className="file-upload-text">Choose File</span>
                    </label>

                    <span className="custom-file-name">
                      {this.state.imageFile
                        ? this.state.imageFile.name
                        : imagePreview
                        ? "Current poster selected"
                        : "No file selected"}
                    </span>
                  </div>

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
                  <label htmlFor="video">Movie Video File</label>

                  <div className="custom-file-upload">
                    <input
                      id="video"
                      name="video"
                      type="file"
                      accept="video/*"
                      onChange={this.handleVideoChange}
                      className="custom-file-input"
                      disabled={isUploading}
                    />

                    <label htmlFor="video" className="custom-file-button">
                      <span className="file-upload-emoji" aria-hidden="true">
                        🎥
                      </span>
                      <span className="file-upload-text">Choose File</span>
                    </label>

                    <span className="custom-file-name">
                      {videoFile
                        ? videoFile.name
                        : existingVideoUrl && isEditing
                        ? "Current video kept"
                        : "No file selected"}
                    </span>
                  </div>
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
                  <p>
                    Write a short summary that helps users understand the movie.
                  </p>
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
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                )}

                <div className="add-movie-submit-button">
                  <Button
                    type="submit"
                    label={
                      isUploading
                        ? isEditing
                          ? "Updating..."
                          : "Uploading..."
                        : isEditing
                        ? "Save Changes"
                        : "Add Movie"
                    }
                    disabled={isUploading}
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
    addMovie: (movie, history, onUploadProgress) =>
      dispatch(addMovie(movie, history, onUploadProgress)),
    updateMovie: (movieId, movie, onUploadProgress) =>
      dispatch(updateMovie(movieId, movie, onUploadProgress)),
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
