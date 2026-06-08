import React from "react";
import Joi from "joi";
import { connect } from "react-redux";
import { addGenre, getGenres, deleteGenre } from "../../actions/genreAction";
import { Input, Button } from "../../components/common";
import "./style.css";

class AddGenre extends React.Component {
  state = {
    data: {
      name: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Genre"),
  };

  componentDidMount() {
    this.props.getGenres();
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  validateProperty = (input) => {
    const { name, value } = input;
    const obj = { [name]: value };
    const subSchema = Joi.object({ [name]: this.schema[name] });
    const { error } = subSchema.validate(obj);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.object(this.schema).validate(
      this.state.data,
      options
    );

    if (!error) return null;

    const errors = {};
    error.details.forEach(
      (element) => (errors[element.path[0]] = element.message)
    );

    return errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();

    if (errors) {
      this.setState({ errors });
      return;
    }

    await this.props.addGenre(this.state.data);
    this.setState({ data: { name: "" } });
  };

  handleDelete = async (genreId) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      await this.props.deleteGenre(genreId);
    }
  };

  render() {
    const { data, errors } = this.state;
    const { name } = data;
    const { genres } = this.props;

    return (
      <div className="add-genre-page">
        <div className="add-genre-container">
          <section className="add-genre-hero">
            <div className="add-genre-hero-content">
              <span className="add-genre-badge">Admin Genre Management</span>

              <h1>Manage Genres</h1>

              <p>
                Add new movie genres or remove existing ones to keep the iCinema
                catalog organized.
              </p>
            </div>

            <div className="add-genre-hero-card">
              <div className="add-genre-hero-icon">
                <i className="fas fa-tasks"></i>
              </div>

              <div>
                <h4>Manage Categories</h4>
                <p>Use clear genre names to improve movie filtering.</p>
              </div>
            </div>
          </section>

          {/* Genre List Section */}
          <section className="add-genre-form-card mb-5">
            <div className="add-genre-section-header">
              <span>
                <i className="fas fa-list"></i>
              </span>
              <div>
                <h3>Existing Genres</h3>
                <p>List of all genres currently in the database.</p>
              </div>
            </div>

            <div className="manage-list-container">
              {genres && genres.length > 0 ? (
                <div className="manage-table-wrapper">
                  <table className="manage-table">
                    <thead>
                      <tr>
                        <th>Genre Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {genres.map((genre) => (
                        <tr key={genre._id}>
                          <td>{genre.name}</td>
                          <td>
                            <button
                              className="manage-delete-btn"
                              onClick={() => this.handleDelete(genre._id)}
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
                <p className="text-muted">No genres found in database.</p>
              )}
            </div>
          </section>

          <div className="add-movie-section-divider">
            <span>OR CREATE NEW GENRE</span>
          </div>

          <section className="add-genre-form-card">
            <div className="add-genre-section-header">
              <span>
                <i className="fas fa-film"></i>
              </span>

              <div>
                <h3>Genre Information</h3>
                <p>Enter the genre name that will be available in movie filters.</p>
              </div>
            </div>

            <form onSubmit={this.handleSubmit} className="add-genre-form">
              <Input
                name="name"
                label="Genre"
                type="text"
                error={errors["name"]}
                iconClass="fas fa-film"
                onChange={this.handleChange}
                placeholder="Example: Action, Drama, Comedy"
                value={name}
                autoFocus
              />

              <div className="add-genre-helper-card">
                <i className="fas fa-info-circle"></i>
                <p>
                  Make sure the genre name is simple and consistent, because it
                  will appear in the movie filter list.
                </p>
              </div>

              <div className="add-genre-submit-panel">
                <div>
                  <h4>Ready to add genre?</h4>
                  <p>
                    After submission, this genre can be used when adding or
                    filtering movies.
                  </p>
                </div>

                <div className="add-genre-submit-button">
                  <Button
                    disabled={this.validate()}
                    type="submit"
                    label="Add Genre"
                  />
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    genres: state.genre.genres,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGenre: (genre) => dispatch(addGenre(genre)),
    getGenres: () => dispatch(getGenres()),
    deleteGenre: (genreId) => dispatch(deleteGenre(genreId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGenre);