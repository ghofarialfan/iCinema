import React from "react";
import Joi from "joi";
import Input from "../../components/common/Input";
import { connect } from "react-redux";
import { signUp } from "../../actions/authAction";
import "./style.css";

class RegisterForm extends React.Component {
  state = {
    data: {
      email: "",
      password: "",
      passwordRepeat: "",
    },
    errors: {},
    passwordError: "",
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
    password: Joi.string().min(8).required().label("Password"),
    passwordRepeat: Joi.string().required().label("Repeat Password"),
  };

  validateProperty = (input) => {
    const { name, value } = input;
    const obj = { [name]: value };
    const subSchema = Joi.object({ [name]: this.schema[name] });
    const { error } = subSchema.validate(obj);

    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({
      data,
      errors,
      passwordError: "",
    });
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

    if (errors) return;

    const { password, passwordRepeat, email } = this.state.data;

    if (password !== passwordRepeat) {
      this.setState({
        passwordError: "The passwords do not match.",
      });
      return;
    }

    this.props.signUp({ email, password }, this.props.history);
  };

  render() {
    const { authMessage } = this.props;
    const { errors, passwordError } = this.state;
    const { email, password, passwordRepeat } = this.state.data;

    return (
      <main className="register-page">
        <span className="auth-orb auth-orb-blue"></span>
        <span className="auth-orb auth-orb-red"></span>

        <div className="register-wrapper">
          <section className="register-brand-panel">
            <div className="register-brand-overlay"></div>

            <div className="register-brand-content">
              <span className="register-badge">Join iCinema</span>

              <h1>Create Your Cinema Account</h1>

              <p>
                Register to access iCinema features, browse movie collections,
                and enjoy a cleaner digital cinema experience.
              </p>

              <div className="register-feature-list">
                <div className="register-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    R
                  </span>
                  <div>
                    <strong>Easy Registration</strong>
                    <p>Create your account using email and password.</p>
                  </div>
                </div>

                <div className="register-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    M
                  </span>
                  <div>
                    <strong>Movie Access</strong>
                    <p>Browse movie collections through a modern interface.</p>
                  </div>
                </div>

                <div className="register-feature-item">
                  <span className="auth-feature-icon" aria-hidden="true">
                    S
                  </span>
                  <div>
                    <strong>Secure Account</strong>
                    <p>Your account is protected using authentication flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="register-form-panel">
            <div className="register-form-card">
              <div className="register-form-header">
                <div className="register-form-icon" aria-hidden="true">
                  R
                </div>

                <span>New Account</span>
                <h2>Register</h2>
                <p>Create your account to start using iCinema.</p>
              </div>

              <form onSubmit={this.handleSubmit} className="register-form">
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
                  label="Password"
                  type="password"
                  error={errors["password"]}
                  iconClass="password"
                  onChange={this.handleChange}
                  placeholder="Create your password"
                  value={password}
                />

                <Input
                  name="passwordRepeat"
                  type="password"
                  label="Repeat Password"
                  error={errors["passwordRepeat"]}
                  iconClass="password"
                  onChange={this.handleChange}
                  placeholder="Repeat your password"
                  value={passwordRepeat}
                />

                {(authMessage || passwordError) && (
                  <div className="register-auth-message">
                    <span className="auth-alert-icon" aria-hidden="true">
                      !
                    </span>
                    <span>
                      {authMessage} {passwordError}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="register-submit-button"
                  disabled={this.validate()}
                >
                  Sign Up
                </button>
              </form>

              <div className="register-footer-note">
                <p>
                  Already have an account? Use the login page to access your
                  iCinema account.
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
    signUp: (creds, history) => dispatch(signUp(creds, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
