import React from "react";
import Joi from "joi";
import _ from "lodash";
import Input from "../../components/common/Input";
import { connect } from "react-redux";
import { signIn } from "../../actions/authAction";
import Button from "../../components/common/Button";
import "./style.css";

class Login extends React.Component {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn && !prevProps.loggedIn) {
      this.props.history.push("/movies");
    }
  }

  schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
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

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (_.isEmpty(errors)) {
      this.props.signIn(this.state.data, this.props.history);
    }
  };

  render() {
    const { data, errors } = this.state;
    const { email, password } = data;
    const { authMessage } = this.props;

    return (
      <main className="login-page">
        <span className="auth-orb auth-orb-red"></span>
        <span className="auth-orb auth-orb-blue"></span>

        <div className="login-wrapper">
          <section className="login-brand-panel">
            <div className="login-brand-overlay"></div>

            <div className="login-brand-content">
              <span className="login-badge">iCinema Platform</span>

              <h1>Welcome Back to iCinema</h1>

              <p>
                Sign in to continue exploring movie collections, managing admin
                content, and enjoying a cleaner cinema browsing experience.
              </p>

              <div className="login-feature-list">
                <div className="login-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    M
                  </span>
                  <div>
                    <strong>Movie Library</strong>
                    <p>Explore curated movies with a modern interface.</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    F
                  </span>
                  <div>
                    <strong>Smart Filtering</strong>
                    <p>Find movies faster using genre and rating filters.</p>
                  </div>
                </div>

                <div className="login-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    S
                  </span>
                  <div>
                    <strong>Secure Access</strong>
                    <p>Admin features are protected using authenticated access.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="login-form-panel">
            <div className="login-form-card">
              <div className="login-form-header">
                <div className="login-form-icon" aria-hidden="true">
                  A
                </div>

                <span>Account Access</span>
                <h2>Login</h2>
                <p>Enter your credentials to access your iCinema account.</p>
              </div>

              <form onSubmit={this.handleSubmit} className="login-form">
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  error={errors["email"]}
                  iconClass="email"
                  onChange={this.handleChange}
                  placeholder="Enter your email address"
                  value={email}
                  autoFocus
                />

                <Input
                  name="password"
                  type="password"
                  label="Password"
                  error={errors["password"]}
                  iconClass="password"
                  onChange={this.handleChange}
                  placeholder="Enter your password"
                  value={password}
                />

                {authMessage && (
                  <div className="login-auth-message">
                    <span className="auth-alert-icon" aria-hidden="true">
                      !
                    </span>
                    <span>{authMessage}</span>
                  </div>
                )}

                <div className="login-button-wrapper">
                  <Button
                    disabled={this.validate()}
                    type="submit"
                    label="Login"
                  />
                </div>
              </form>

              <div className="login-footer-note">
                <p>
                  Admin access is required to manage movies, genres, and system
                  content.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    authMessage: state.auth.authMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds, history) => dispatch(signIn(creds, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
