import React from "react";
import { connect } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Button } from "../../components/common";
import { addMovie } from "../../actions/moviesAction";
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
      trailerLink: "",
      movieLength: "",
    },
    errors: {},
    submitError: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.getGenres();
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

  handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = this.state;
    const { error } = movieSchema.validate(data);

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      this.setState({ errors, submitError: null });
      return;
    }

    this.setState({ errors: {}, submitError: null });

    try {
      await this.props.addMovie(data, this.props.history);

      if (this._isMounted) {
        this.setState({
          data: {
            title: "",
            genre: "",
            rate: 0,
            description: "",
            image: "",
            trailerLink: "",
            movieLength: "",
          },
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

  render() {
    const { data, submitError } = this.state;
    const { title, genre, rate, description, trailerLink, movieLength, image } =
      data;
    const { genres } = this.props;

    return (
      <div className="add-movie-page">
        <div className="add-movie-container">
          <section className="add-movie-hero">
            <div className="add-movie-hero-content">
              <span className="add-movie-badge">Admin Movie Management</span>

              <h1>Add New Movie</h1>

              <p>
                Create a new movie record for iCinema by completing the movie
                information, media source, rating, and description.
              </p>
            </div>

            <div className="add-movie-hero-card">
              <div className="add-movie-hero-icon">
                <i className="fas fa-plus-circle"></i>
              </div>

              <div>
                <h4>Movie Entry Form</h4>
                <p>Fill in accurate data before publishing it to the system.</p>
              </div>
            </div>
          </section>

          {submitError && (
            <div className="add-movie-error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="add-movie-form">
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
                    options={genres}
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
                    <p>Add poster and trailer information for the movie.</p>
                  </div>
                </div>

                <Input
                  name="image"
                  label="Cover Image URL"
                  onChange={this.handleChange}
                  error={this.getFieldError("image")}
                  iconClass="fas fa-file-image"
                  placeholder="https://..."
                  value={image}
                />

                <Input
                  name="trailerLink"
                  label="Trailer Link"
                  onChange={this.handleChange}
                  placeholder="Enter YouTube trailer link"
                  error={this.getFieldError("trailerLink")}
                  iconClass="fas fa-link"
                  value={trailerLink}
                />

                <div className="add-movie-helper-card">
                  <i className="fas fa-info-circle"></i>
                  <p>
                    Make sure the trailer link is accessible and the cover image
                    URL has a clear poster ratio for better movie card display.
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
    getGenres: () => dispatch(getGenres()),
  };
};

const mapStateToProps = (state) => {
  return {
    genres: state.genre.genres,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMovieForm);
