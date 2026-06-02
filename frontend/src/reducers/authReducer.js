import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNOUT,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
} from "../actions/actionTypes";

const user = JSON.parse(localStorage.getItem("user"));

const initState = {
  loggedIn: user ? true : false,
  user: user ? user : null,
  authMessage: null,
};

export default function (state = initState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        authMessage: action.payload.message,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        authMessage:
          action.error?.response?.data?.error ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          "Login failed",
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        authMessage: action.payload.message,
      };

    case SIGNUP_ERROR:
      return {
        ...state,
        authMessage:
          action.error?.response?.data?.error ||
          action.error?.response?.data?.message ||
          action.error?.message ||
          "Sign up failed",
      };

    case SIGNOUT:
      return {
        ...state,
        user: null,
        loggedIn: false,
        authMessage: null,
      };
    default:
      return state;
  }
}
