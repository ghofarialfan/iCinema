import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/authAction";
import icinemaLogo from "../../images/iCinema_Logo.jpeg";
import "./style.css";

function Navbar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const toggleNav = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeNav = () => {
    setIsOpen(false);
    setAccountOpen(false);
  };

  const handleSignOut = () => {
    closeNav();
    props.signOut();
  };

  const isAdmin = useMemo(() => {
    const role = props.user?.role || props.user?.user?.role;
    return role === "admin";
  }, [props.user]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setIsOpen(false);
      }
    };

    const onPointerDown = (event) => {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <nav className="nav-wrapper">
      <div className="nav-shell">
        <div className="nav-surface">
          <div className="nav-left">
            <Link className="nav-brand" to="/movies" onClick={closeNav}>
              <span className="nav-brand-icon" aria-hidden="true">
                <img
                  src={icinemaLogo}
                  alt="iCinema Logo"
                  className="nav-brand-logo"
                />
              </span>
              <span className="nav-brand-text">iCinema</span>
            </Link>

            <div className="nav-desktop-menu" aria-label="Main navigation">
              <NavLink
                exact
                className="nav-link-item"
                activeClassName="active"
                to="/movies"
              >
                <i className="fas fa-home" aria-hidden="true"></i>
                Movies
              </NavLink>

              {isAdmin && (
                <>
                  <NavLink
                    className="nav-link-item"
                    activeClassName="active"
                    to="/movies/new"
                  >
                    <i className="fas fa-video" aria-hidden="true"></i>
                    Manage Movie
                  </NavLink>

                  <NavLink
                    className="nav-link-item"
                    activeClassName="active"
                    to="/genres/new"
                  >
                    <i className="fas fa-tags" aria-hidden="true"></i>
                    Manage Genre
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="nav-right">
            <div className="nav-desktop-actions">
              {!props.loggedIn ? (
                <>
                  <NavLink
                    className="nav-action-link"
                    activeClassName="active"
                    to="/login"
                    onClick={closeNav}
                  >
                    Login
                  </NavLink>

                  <NavLink
                    className="nav-primary-button"
                    to="/register"
                    onClick={closeNav}
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <div className="nav-account" ref={accountRef}>
                  <button
                    type="button"
                    className={
                      accountOpen
                        ? "nav-account-button is-open"
                        : "nav-account-button"
                    }
                    onClick={() => setAccountOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <span className="nav-account-icon" aria-hidden="true">
                      <i className="fas fa-user"></i>
                    </span>
                    <span className="nav-account-label">Akun</span>
                    <span className="nav-account-caret" aria-hidden="true">
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </button>

                  <div
                    className={
                      accountOpen
                        ? "nav-account-menu is-open"
                        : "nav-account-menu"
                    }
                    role="menu"
                  >
                    <button
                      type="button"
                      className="nav-account-menu-item"
                      onClick={handleSignOut}
                      role="menuitem"
                    >
                      <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                      Logout
                    </button>
                  </div>
                </div>
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
        </div>
      </div>

      <div className={isOpen ? "slider active" : "slider"}>
        <div className="mobile-menu-header">
          <div>
            <span className="mobile-menu-label">Navigation</span>
            <h3>iCinema Menu</h3>
          </div>
        </div>

        <ul className="list">
          <NavLink
            exact
            onClick={closeNav}
            activeClassName="active"
            to="/movies"
          >
            <i className="fas fa-home"></i>
            Home
          </NavLink>

          {!props.loggedIn ? (
            <>
              <NavLink onClick={closeNav} activeClassName="active" to="/login">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </NavLink>

              <NavLink
                onClick={closeNav}
                activeClassName="active"
                to="/register"
              >
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

          {isAdmin && (
            <>
              <NavLink
                onClick={closeNav}
                activeClassName="active"
                to="/movies/new"
              >
                <i className="fas fa-plus-circle"></i>
                Manage Movie
              </NavLink>

              <NavLink
                onClick={closeNav}
                activeClassName="active"
                to="/genres/new"
              >
                <i className="fas fa-tags"></i>
                Manage Genre
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
