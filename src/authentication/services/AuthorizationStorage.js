import AuthorizationLocalStorage from "./AuthorizationLocalStorage";
import AuthorizationCookieStorage from "./AuthorizationCookieStorage";
import Cookies from "js-cookie";
//import configData from "../../config.json"
import {
  setLoginStatusChecker,
  clearLoginStatusChecker,
} from "../../common/utils/LoginStatusChecker";
import getConfigJson from "../../common/utils/getConfigJson";

class AuthorizationStorage {
  constructor(authorizationLocalStorage, authorizationCookieStorage) {
    this.authorizationLocalStorage = authorizationLocalStorage;
    this.authorizationCookieStorage = authorizationCookieStorage;
  }

  store(userAuthorization) {
    this.authorizationLocalStorage.store(userAuthorization);
    this.authorizationCookieStorage.store(userAuthorization);

    //additional code for logout in certain time period - Trupti - 07062021
    //REACT_APP_LOGOUTTIME - added in seconds, so multiply by 1000 to get in ms
    Cookies.set("mu-logstatus", userAuthorization?.expirationDate, {
      expires: userAuthorization?.expirationDate,
      path: "/",
      SameSite: "Strict",
    });
    //document.cookie = `mu-logstatus=${expireDate};expires=${expireDate};path=/;SameSite=Strict`;
    setLoginStatusChecker();
  }

  clear() {
    this.authorizationLocalStorage.clear();
    this.authorizationCookieStorage.clear();
    //document.cookie = `mu-logstatus=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Strict`;
    Cookies.remove("mu-logstatus", { path: "/" });
    clearLoginStatusChecker();
  }

  load() {
    return this.authorizationLocalStorage.load();
  }

  updateToken(newToken) {
    let prevAuthDate = this.authorizationLocalStorage.load();

    try {
      // console.log("prevAuthDate", prevAuthDate);
      let updatedAuthData = { ...prevAuthDate, token: newToken };
      // console.log("updatedAuthData", updatedAuthData);
      this.store(updatedAuthData);
      return updatedAuthData;
    } catch (error) {
      console.log("updateToken error :: ", error);
      return prevAuthDate;
    }
  }
}

export default new AuthorizationStorage(
  AuthorizationLocalStorage,
  AuthorizationCookieStorage
);
