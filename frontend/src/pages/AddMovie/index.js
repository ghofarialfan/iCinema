import React from "react";
import { connect } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Button } from "../../components/common";
import { addMovie, getMovies, deleteMovie } from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";
import { movieSchema } from "./schema";
import "./style.css";

class AddMovieForm extends React.Component {
  _isMounted = false;

  state = {
    data: {
      title: "",
      genre: "",
      rate: 0,
      description: "",
      image: "",
      video: "",
      trailerLink: "",
      movieLength: "",
    },
    imageFile: null,
    errors: {},
    submitError: null,
    imagePreview: null,
    videoFile: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.getGenres();
    this.props.getMovies();
  }

  componentDidUpdate(prevProps) {
    if (this.props.genres.length > 0 && prevProps.genres.length === 0) {
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
    if (this.state.imagePreview) {
      URL.revokeObjectURL(this.state.imagePreview);
    }
  }

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

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.name === "rate" ? Number(input.value) : input.value;
    this.setState({ data });
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

    if (this.state.imagePreview) {
      URL.revokeObjectURL(this.state.imagePreview);
    }

    const errors = { ...this.state.errors };
    delete errors.image;

    this.setState({
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      errors,
    });
  };

  handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        videoFile: file,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { data, imageFile } = this.state;
    const { error } = movieSchema.validate(data);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      this.setState({ errors, submitError: null });
      return;
    }

    if (!imageFile) {
      this.setState({
        errors: { ...this.state.errors, image: "Cover image is required" },
        submitError: null,
      });
      return;
    }

    this.setState({ errors: {}, submitError: null });

    try {
      const movieData = {
        ...data,
        imageFile: this.state.imageFile,
        videoFile: this.state.videoFile,
      };
      await this.props.addMovie(movieData, this.props.history);

      if (this._isMounted) {
        if (this.state.imagePreview) {
          URL.revokeObjectURL(this.state.imagePreview);
        }

        this.setState({
          data: {
            title: "",
            genre: "",
            rate: 0,
            description: "",
            image: "",
            video: "",
            trailerLink: "",
            movieLength: "",
          },
          imageFile: null,
          videoFile: null,
          imagePreview: null,
          errors: {},
          submitError: null,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add movie";

      this.setState({ submitError: message });
    }
  };

  handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await this.props.deleteMovie(movieId);
      } catch (err) {
        alert("Failed to delete movie");
      }
    }
  };

  render() {
    const { data, submitError, imagePreview } = this.state;
    const { title, genre, rate, description, trailerLink, movieLength } = data;
    const { genres = [], movies = [] } = this.props;

    return (
      <div className="add-movie-page">
        <div className="add-movie-container">
          <section className="add-movie-hero">
            <div className="add-movie-hero-content">
              <span className="add-movie-badge">Admin Movie Management</span>

              <h1>Manage Movies</h1>

              <p>
                Add new movies or remove existing ones from the iCinema
                database.
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

          {/* Movie List Section */}
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
                            {movie.genre && Array.isArray(movie.genre) && movie.genre.length > 0
                              ? movie.genre
                                  .map((g) => (typeof g === "object" ? g.name : g))
                                  .filter(Boolean)
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td>{movie.rate}</td>
                          <td>
                            <button
                              className="manage-delete-btn"
                              onClick={() => this.handleDelete(movie._id)}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
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
            <span>OR ADD NEW MOVIE</span>
          </div>

          {submitError && (
            <div className="add-movie-error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{submitError}</span>
            </div>
          )}

          <form
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
                    autoFocus
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
                  {this.state.videoFile && (
                    <span className="file-selected-badge">
                      <i className="fas fa-check"></i> {this.state.videoFile.name}
                    </span>
                  )}
                </div>

                <div className="add-movie-helper-card">
                  <i className="fas fa-info-circle"></i>
                  <p>
                    Upload a JPG or PNG poster (max 5MB). The image is stored on
                    Cloudinary. Make sure the trailer link is accessible.
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
                <h4>Ready to publish?</h4>
                <p>
                  Review the movie details before submitting it to the iCinema
                  database.
                </p>
              </div>

              <div className="add-movie-submit-button">
                <Button type="submit" label="Add Movie" />
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
