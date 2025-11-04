import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";

import {
  ADD_MFA_META,
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
  REMOVE_MFA_META,
  SET_AUTH_REDIRECT_PATH,
} from "../../constants/actionTypes";
import { resetNotificationTopBar } from "../notificationActions";
import { getUserId } from "../../../common/utils/getUserAuthMeta";

const qs = require("qs");

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  //document.cookie = "jwt-cookie=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Strict";
   Cookies.remove("jwt-cookie", {
      path: "/",
    });
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  // This will be the time , when App will make an AutoLogout

  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
      dispatch(resetNotificationTopBar());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password) => {
  // console.log("sso", "auth");
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      username: email,
      password: password,
      grant_type: "password",
    };
    let url = "/api/oauth/token";

    axios({
      url,
      method: "post",
      withCredentials: true,
      crossdomain: true,
      mode: "no-cors",
      data: qs.stringify(authData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
        Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
      },
    })
      .then((response) => {
        const expirationDate = moment(new Date())
          .add(response.data.expires_in, "s")
          .toDate();

        document.cookie = `jwt-cookie=${response.data.access_token};expires=${expirationDate};path=/;SameSite=Strict`;
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("expirationDate", expirationDate);

        dispatch(
          authSuccess(response.data.access_token, response.data.user_id)
        );
        dispatch(checkAuthTimeout(response.data.expires_in));
      })
      .catch((err) => {
        dispatch(authFail(err.response));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const addMFAMeta = (metaMFA) => {
  return {
    type: ADD_MFA_META,
    metaMFA,
  };
};

export const removeMFAMeta = () => {
  return {
    type: REMOVE_MFA_META,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      dispatch(resetNotificationTopBar());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
        dispatch(resetNotificationTopBar());
      } else {
        const userId = getUserId();

        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 10
          )
        );
      }
    }
  };
};
