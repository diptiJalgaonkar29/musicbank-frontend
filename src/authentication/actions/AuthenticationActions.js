import { SET_USER_META } from "../../redux/constants/actionTypes";
import AuthenticationService from "../services/AuthenticationService";

import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_REQUEST_MFA,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  SSO_LOGIN_REQUEST,
} from "./AuthenticationActionTypes";

const storeUserDataInRedux = (userData, dispatch) => {
  // console.log("userData", userData);
  const ssAccess = userData?.ss_access ?? false;
  const isCSUser = userData?.cs_login ?? false;
  const isPersonalizedTrackingAllowed =
    userData?.is_personalized_tracking_allowed ?? false;
  const email = userData?.user_email;
  const userId = userData?.user_id;

  dispatch({
    type: SET_USER_META,
    payload: {
      ssAccess,
      isCSUser,
      isPersonalizedTrackingAllowed,
      email,
      userId,
    },
  });
};

export const login = (username, password) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      username: username,
    });
    return AuthenticationService.login(username, password)
      .then((result) => {
        console.log("login::: result ", result);
        storeUserDataInRedux(result?.response, dispatch);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result,
        });
        return result;
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const SSOlogin = (id_token) => {
  return (dispatch) => {
    dispatch({
      type: SSO_LOGIN_REQUEST,
      idToken: id_token,
    });
    return AuthenticationService.SSOlogin(id_token)
      .then((result) => {
        storeUserDataInRedux(result?.response, dispatch);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result,
        });
        return result;
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const SSOloginWithGmail = (token, email) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      username: email,
    });
    return AuthenticationService.SSOWPPLoginNew(token)
      .then((result) => {
        storeUserDataInRedux(result?.response, dispatch);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result?.result,
        });
        return result;
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const SSOloginWithKeycloak = (osToken) => {
  console.log("SSOloginWithKeycloak -> SSOKeycloakLogin - osToken", osToken);
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      //username: email,
    });
    return AuthenticationService.SSOKeycloakLogin(osToken)
      .then((result) => {
        console.log("result response", result);
        if (result.response && result?.response?.status) {
          return result;
        }
        storeUserDataInRedux(result?.response, dispatch);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result?.result,
        });
        return result;
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const SSOloginWithMicrosoft = (encodedUserString) => {
  // console.log("encodedUserString -> ", encodedUserString);
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      //username: email,
    });
    return AuthenticationService.SSOMicrosoftLogin(encodedUserString)
      .then((result) => {
        storeUserDataInRedux(result?.response, dispatch);
        // console.log("dispatch - login success", result);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result?.result,
        });
        return result;
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const loginWithMFA = (verificationCode) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST_MFA,
      verificationCode: verificationCode,
    });
    return AuthenticationService.loginWithMFA(verificationCode)
      .then((result) => {
        storeUserDataInRedux(result?.response, dispatch);
        dispatch({
          type: LOGIN_SUCCESS,
          result: result,
        });
        return result;
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_FAILURE,
          error: error,
        });
        throw error;
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
    return AuthenticationService.logout()
      .then((result) => {
        if (localStorage.getItem("commentApproved") !== "complete")
          localStorage.setItem("commentShown", "false");

        dispatch({
          type: LOGOUT_SUCCESS,
          result: result,
        });
      })
      .catch((result) => {
        dispatch({
          type: LOGOUT_FAILURE,
          error: result,
        });
      });
  };
};

export const recoverPassword = (forEmail) => {
  return (dispatch) => {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });
    return AuthenticationService.recoverPassword(forEmail)
      .then((result) => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
          result: result,
        });
      })
      .catch((result) => {
        dispatch({
          type: RESET_PASSWORD_FAILURE,
          error: result,
        });
      });
  };
};
