import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/authAction";
import "./style.css";

function Navbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    closeNav();
    props.signOut();
  };

  return (
    <nav className="nav-wrapper">
      <div className="nav-container">
        <Link className="nav-brand" to="/movies" onClick={closeNav}>
          <span className="nav-brand-icon">
            <i className="fas fa-film"></i>
          </span>
          <span className="nav-brand-text">iCinema</span>
        </Link>

        <div className="nav-desktop-menu">
          <NavLink className="nav-link-item" activeClassName="active" to="/movies">
            Movies
          </NavLink>

          {props.user && props.user.role === "admin" && (
            <>
              <NavLink
                className="nav-link-item"
                activeClassName="active"
                to="/movies/new"
              >
                Add Movie
              </NavLink>

              <NavLink
                className="nav-link-item"
                activeClassName="active"
                to="/genres/new"
              >
                Add Genre
              </NavLink>
            </>
          )}
        </div>

        <div className="nav-desktop-actions">
          {!props.loggedIn ? (
            <>
              <NavLink
                className="nav-action-link"
                activeClassName="active"
                to="/login"
              >
                Login
              </NavLink>

              <NavLink className="nav-primary-button" to="/register">
                Register
              </NavLink>
            </>
          ) : (
            <button className="nav-logout-button" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          )}
        </div>

        <button
          id="burger"
          className={isOpen ? "ico-btn is-active" : "ico-btn"}
          onClick={toggleNav}
          type="button"
          aria-label="Toggle navigation"
        >
          <span className="ico-btn__burger"></span>
        </button>
      </div>

      <div className={isOpen ? "slider active" : "slider"}>
        <button
          type="button"
          className="mobile-menu-close"
          onClick={closeNav}
          aria-label="Close navigation menu"
        >
          <i className="fas fa-times"></i>
        </button>
      
        <div className="mobile-menu-header">
          <div>
            <span className="mobile-menu-label">Navigation</span>
            <h3>iCinema Menu</h3>
          </div>
        </div>

        <ul className="list">
          <NavLink onClick={closeNav} activeClassName="active" to="/movies">
            <i className="fas fa-home"></i>
            Home
          </NavLink>

          {!props.loggedIn ? (
            <>
              <NavLink onClick={closeNav} activeClassName="active" to="/login">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </NavLink>

              <NavLink onClick={closeNav} activeClassName="active" to="/register">
                <i className="fas fa-user-plus"></i>
                Register
              </NavLink>
            </>
          ) : (
            <Link onClick={handleSignOut} to="/#">
              <i className="fas fa-sign-out-alt"></i>
              Log out
            </Link>
          )}

          {props.user && props.user.role === "admin" && (
            <>
              <NavLink onClick={closeNav} activeClassName="active" to="/movies/new">
                <i className="fas fa-plus-circle"></i>
                Add Movie
              </NavLink>

              <NavLink onClick={closeNav} activeClassName="active" to="/genres/new">
                <i className="fas fa-tags"></i>
                Add Genre
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
