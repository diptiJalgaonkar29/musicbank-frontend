import {
  ADD_MFA_META,
  REMOVE_MFA_META,
  RESET_USER_META,
  SET_USER_META,
} from "../../redux/constants/actionTypes";
import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
} from "../actions/AuthenticationActionTypes";
import AuthenticationService from "../services/AuthenticationService";

const initialState = {
  userAuthorization: AuthenticationService.load(),
  error: null,
  metaMFA: {},
};

const AuthenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userAuthorization: action.result,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        userAuthorization: null,
        error: action.error,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        userAuthorization: action.result,
        error: null,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case ADD_MFA_META:
      return {
        ...state,
        metaMFA: action.metaMFA,
      };
    case REMOVE_MFA_META:
      return {
        ...state,
        metaMFA: {},
      };
    default:
      return state;
  }
};

export default AuthenticationReducer;
