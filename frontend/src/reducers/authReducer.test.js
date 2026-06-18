import authReducer from "./authReducer";
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNOUT,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} from "../actions/actionTypes";

describe("authReducer", () => {
  const initialState = {
    loggedIn: false,
    user: null,
    authMessage: null,
  };

  it("returns initial state by default", () => {
    expect(authReducer(undefined, { type: "UNKNOWN" })).toEqual({
      loggedIn: false,
      user: null,
      authMessage: null,
    });
  });

  it("handles LOGIN_SUCCESS", () => {
    const payload = {
      user: { id: "1", email: "test@test.com", role: "user" },
      message: "Login successful",
    };

    const state = authReducer(initialState, {
      type: LOGIN_SUCCESS,
      payload,
    });

    expect(state.loggedIn).toBe(true);
    expect(state.user).toEqual(payload.user);
    expect(state.authMessage).toBe("Login successful");
  });

  it("handles LOGIN_ERROR", () => {
    const state = authReducer(initialState, {
      type: LOGIN_ERROR,
      error: { response: { data: { error: "Invalid credentials" } } },
    });

    expect(state.loggedIn).toBe(false);
    expect(state.authMessage).toBe("Invalid credentials");
  });

  it("handles SIGNUP_SUCCESS", () => {
    const payload = {
      user: { id: "2", email: "new@test.com", role: "user" },
    };

    const state = authReducer(initialState, {
      type: SIGNUP_SUCCESS,
      payload,
    });

    expect(state.loggedIn).toBe(true);
    expect(state.user).toEqual(payload.user);
  });

  it("handles SIGNUP_ERROR", () => {
    const state = authReducer(initialState, {
      type: SIGNUP_ERROR,
      error: { message: "Sign up failed" },
    });

    expect(state.authMessage).toBe("Sign up failed");
  });

  it("handles SIGNOUT", () => {
    const loggedInState = {
      loggedIn: true,
      user: { id: "1", email: "test@test.com" },
      authMessage: "Welcome",
    };

    const state = authReducer(loggedInState, { type: SIGNOUT });

    expect(state.loggedIn).toBe(false);
    expect(state.user).toBeNull();
    expect(state.authMessage).toBeNull();
  });
});
