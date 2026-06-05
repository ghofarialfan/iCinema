import React from "react";
import Joi from "joi";
import { connect } from "react-redux";
import { addGenre } from "../../actions/genreAction";
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
    this.props.history.push("/movies");
  };

  render() {
    const { data, errors } = this.state;
    const { name } = data;

    return (
      <div className="add-genre-page">
        <div className="add-genre-container">
          <section className="add-genre-hero">
            <div className="add-genre-hero-content">
              <span className="add-genre-badge">Admin Genre Management</span>

              <h1>Create New Genre</h1>

              <p>
                Add a new movie genre to keep the iCinema catalog organized,
                searchable, and easier for users to explore.
              </p>
            </div>

            <div className="add-genre-hero-card">
              <div className="add-genre-hero-icon">
                <i className="fas fa-tags"></i>
              </div>

              <div>
                <h4>Genre Entry</h4>
                <p>Use clear genre names to improve movie filtering.</p>
              </div>
            </div>
          </section>

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

const mapDispatchToProps = (dispatch) => {
  return {
    addGenre: (genre) => dispatch(addGenre(genre)),
  };
};

export default connect(null, mapDispatchToProps)(AddGenre);