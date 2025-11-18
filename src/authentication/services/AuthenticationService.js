import { NetworkingError } from "../../common/model/NetworkingError";
import { ValidationError } from "../../common/model/ValidationError";
import StringUtils from "../../common/utils/StringUtils";
import AsyncService from "../../networking/services/AsyncService";
import AuthorizationStorage from "./AuthorizationStorage";
import UserAuthorizationCreator from "./UserAuthorizationCreator";
import validator from "validator";
import Cookies from "js-cookie";
import getConfigJson from "../../common/utils/getConfigJson";
import getSuperBrandId from "../../common/utils/getSuperBrandId";

const LOGIN_OPTIONS = {
  headers: {
    Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
  },
};

const RECOVER_PASSWORD_OPTIONS = {
  headers: {
    "Content-Type": "application/json",
  },
};

class AuthenticationService {
  constructor(asyncService, authorizationStorage, userAuthorizationCreator) {
    this.asyncService = asyncService;
    this.authorizationStorage = authorizationStorage;
    this.userAuthorizationCreator = userAuthorizationCreator;
  }

  load() {
    return this.authorizationStorage.load();
  }

  //send token to cs
  postCrossDomainMessage = (msg) => {
    // console.log("postCrossDomainMessage ", msg);
    try {
      let CONFIG = getConfigJson();
      var win = document.getElementById("CS-iframe").contentWindow;
      // console.log("AuthenticationService :: data to send CS", msg);
      win.postMessage(msg, CONFIG?.CS_IFRAME_URL);
    } catch (error) {
      console.log("error while sending token...");
    }
  };

  login(username, password) {
    const data = StringUtils.objectToString({
      username: username,
      password: password,
      grant_type: "password",
    });
    return this.asyncService
      .postDataUnauthorized("/oauth/token", data, LOGIN_OPTIONS)
      .then((response) => {
        console.log(" login response?.data", response?.data);
        if (!response?.data?.access_token) {
          // console.log("no token");
          throw new NetworkingError("Authentication failed!");
        }
        // localStorage.setItem("isCSUser", response.data?.cs_login ?? false);
        // localStorage.setItem("ssAccess", response.data?.ss_access ?? false);
        localStorage.setItem("CSLoggingOut", "true");
        // const email = `${response.data?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        localStorage.setItem("isSSOLogin", "false");
        // localStorage.setItem(
        //   "isPersonalizedTrackingAllowed",
        //   response.data?.is_personalized_tracking_allowed ?? true
        // );
        if (response.data.last_login_time_stamp) {
          Cookies.set("is-first-login", false, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        } else {
          Cookies.set("is-first-login", true, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        }

        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        this.authorizationStorage.store(result);
        return { result, response: response.data };
      })
      .catch(() => {
        throw new NetworkingError("Authentication failed!");
      });
  }

  SSOWPPLoginNew(token) {
    return this.asyncService
      .postDataUnauthorized(
        "/users/auth/google",
        {
          token,
        },
        LOGIN_OPTIONS
      )
      .then((response) => {
        // console.log("response?.data", response?.data);
        // console.log("response?.data?.token", response?.data?.token);
        if (!response?.data?.access_token) {
          // console.log("no token");
          throw new NetworkingError("Authentication failed!");
        }
        // localStorage.setItem("isCSUser", response.data?.cs_login ?? false);
        localStorage.setItem("isSSOLogin", "true");
        // localStorage.setItem("ssAccess", response.data?.ss_access ?? false);
        localStorage.setItem("CSLoggingOut", "true");
        // const email = `${response.data?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        // if (response?.data?.cs_login) {
        //   this.postCrossDomainMessage({
        //     action: "LOGIN",
        //     token: response.data.cs_token,
        //     isPersonalizedTrackingAllowed:
        //       response.data?.is_personalized_tracking_allowed || false,
        //     musicBankBrandName: response.data.MusicBankBrandName,
        //     tuneyBrandName: response.data.TuneyBrandName,
        //     ss_access: response.data.ss_access,
        //     brandHomeUrl: `${window.location.origin}`,
        //     brandId: getSuperBrandId(),
        //   });
        // }
        if (response.data?.last_login_time_stamp) {
          Cookies.set("is-first-login", false, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        } else {
          Cookies.set("is-first-login", true, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        }

        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        this.authorizationStorage.store(result);
        return { result, response: response.data };
        // return response;
      })
      .catch(() => {
        throw new NetworkingError("Authentication failed!");
      });
  }

  SSOKeycloakLogin(token) {
    return this.asyncService
      .postDataUnauthorized(
        "/users/auth/keycloak",
        {
          token,
        },
        LOGIN_OPTIONS
      )
      .then((response) => {
        console.log("response", response);
        if (response && response?.data && response?.data?.status) {
          return { response: response.data };
          // navigate("/requestforLogin", {
          //   state: {
          //     status: response?.data?.status,
          //     email: response?.data?.email,
          //     fullName: response?.response?.userName,
          //     contactEmail: response?.response?.contactEmail,
          //   },
          // });
        } else if (response?.data?.status) {
          throw new NetworkingError(JSON.stringify(response?.data));
        }
        if (!response?.data?.access_token) {
          // console.log("no token");
          throw new NetworkingError("Authentication failed!");
        }
        // localStorage.setItem("isCSUser", response.data?.cs_login ?? false);
        // localStorage.setItem("ssAccess", response.data?.ss_access ?? false);
        localStorage.setItem("isSSOLogin", "true");
        localStorage.setItem("CSLoggingOut", "true");
        // const email = `${response.data?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        localStorage.setItem("osToken", token ?? null);
        // localStorage.setItem(
        //   "isPersonalizedTrackingAllowed",
        //   response.data?.is_personalized_tracking_allowed ?? true
        // );
        if (response?.data?.cs_login) {
          this.postCrossDomainMessage({
            action: "LOGIN",
            token: response.data.cs_token,
            isPersonalizedTrackingAllowed:
              response.data?.is_personalized_tracking_allowed || false,
            musicBankBrandName: response.data.MusicBankBrandName,
            tuneyBrandName: response.data.TuneyBrandName,
            ss_access: response.data.ss_access,
            brandHomeUrl: `${window.location.origin}`,
            brandId: getSuperBrandId(),
            osToken: token,
            csThemeData: localStorage.getItem("csThemeData"),
          });
        }
        if (response.data?.last_login_time_stamp) {
          Cookies.set("is-first-login", false, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        } else {
          Cookies.set("is-first-login", true, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        }

        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        this.authorizationStorage.store(result);
        return { result, response: response.data };
        // return response;
      })
      .catch((err) => {
        throw new NetworkingError(err?.message);
      });
  }

  SSOMicrosoftLogin(encodedUserString) {
    // console.log("SSOMicrosoftLogin::", encodedUserString);
    return this.asyncService
      .loadDataUnauthorized(`/users/ssoEncodedKey/${encodedUserString}`)
      .then((response) => {
        // console.log("response?.data", response?.data);
        console.log("response?.data?.token", response?.data?.access_token);
        if (response?.data?.status) {
          throw new NetworkingError(JSON.stringify(response?.data));
        }
        if (!response?.data?.access_token) {
          // console.log("no token");
          throw new NetworkingError("Authentication failed!");
        }
        // localStorage.setItem("isCSUser", response.data?.cs_login ?? false);
        // localStorage.setItem("ssAccess", response.data?.ss_access ?? false);
        localStorage.setItem("isSSOLogin", "true");
        localStorage.setItem("CSLoggingOut", "true");
        // const email = `${response.data?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        // localStorage.setItem(
        //   "isPersonalizedTrackingAllowed",
        //   response.data?.is_personalized_tracking_allowed ?? true
        // );
        // if (response?.data?.cs_login) {
        //   this.postCrossDomainMessage({
        //     action: "LOGIN",
        //     token: response.data.cs_token,
        //     isPersonalizedTrackingAllowed:
        //       response.data?.is_personalized_tracking_allowed || false,
        //     musicBankBrandName: response.data.MusicBankBrandName,
        //     tuneyBrandName: response.data.TuneyBrandName,
        //     ss_access: response.data.ss_access,
        //     brandHomeUrl: `${window.location.origin}`,
        //     brandId: getSuperBrandId(),
        //   });
        // }
        if (response.data?.last_login_time_stamp) {
          Cookies.set("is-first-login", false, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        } else {
          Cookies.set("is-first-login", true, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        }

        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        console.log("result", result);
        this.authorizationStorage.store(result);
        return { result, response: response.data };
        // return response;
      })
      .catch((err) => {
        throw new NetworkingError(err?.message);
      });
  }

  loginWithMFA(verificationCode) {
    return this.asyncService
      .postDataUnauthorized("/users/verify", verificationCode)
      .then((response) => {
        // console.log("response?.data", response?.data);
        // console.log("response?.data?.token", response?.data?.access_token);
        localStorage.setItem("isSSOLogin", "false");
        // localStorage.setItem("ssAccess", response.data?.ss_access ?? false);
        localStorage.setItem("CSLoggingOut", "true");
        // const email = `${response.data?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        if (response?.data?.status) {
          throw new NetworkingError(JSON.stringify(response?.data));
        }
        if (!response?.data?.access_token) {
          // console.log("no token");
          throw new NetworkingError("Authentication failed!");
        }
        // localStorage.setItem("isCSUser", response.data?.cs_login ?? false);
        // localStorage.setItem(
        //   "isPersonalizedTrackingAllowed",
        //   response.data?.is_personalized_tracking_allowed ?? true
        // );
        // if (response?.data?.cs_login) {
        //   this.postCrossDomainMessage({
        //     action: "LOGIN",
        //     token: response.data.cs_token,
        //     isPersonalizedTrackingAllowed:
        //       response.data?.is_personalized_tracking_allowed || false,
        //     musicBankBrandName: response.data.MusicBankBrandName,
        //     tuneyBrandName: response.data.TuneyBrandName,
        //     ss_access: response.data.ss_access,
        //     brandHomeUrl: `${window.location.origin}`,
        //     brandId: getSuperBrandId(),
        //   });
        // }
        if (response.data?.last_login_time_stamp) {
          Cookies.set("is-first-login", false, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        } else {
          Cookies.set("is-first-login", true, {
            path: "/",
            SameSite: "Strict",
            expires: 365,
          });
        }

        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        this.authorizationStorage.store(result);
        return { result, response: response.data };
      })
      .catch((error) => {
        throw new NetworkingError(error?.message);
      });
  }

  SSOlogin(id_token) {
    return this.asyncService
      .postDataUnauthorizedForSSO("api/sso/login", id_token)
      .then((response) => {
        const result = this.userAuthorizationCreator.createFromResponse(
          response.data
        );
        this.authorizationStorage.store(result);
        return { result, response: response.data };
      })
      .catch((error) => {
        const res = error.response;
        const errMessage = res.data;
        const statusCode = res.status;

        switch (res.status) {
          case 401:
            // case 401 User was already created but is blocked
            throw new NetworkingError(`${errMessage}`, statusCode);
          case 201:
            // case 201 User was created right now but needs to be approved
            throw new NetworkingError(`${errMessage}`, statusCode);
          case 500:
            // case 500 wrong Signature, Token expired, wrong Identity
            throw new NetworkingError(`${errMessage}`, statusCode);
          default:
            throw new NetworkingError(
              "Thank you for requesting access to Sound Space.\nYou will receive an email with your credentials within 24 hours.",
              400
            );
        }
      });
  }

  logout() {
    // console.log("authservice - logout");
    return new Promise((resolve) => {
      this.authorizationStorage.clear();
      resolve(this.userAuthorizationCreator.createInvalid());
    });
  }

  recoverPassword(email) {
    /* this code is not working, pendig from client side, below comment line (TODO...) is added by client, 
        //I have commented client code and added new block of code to sort this issue - Trupti - 04032021

        
        
        //if (!EmailValidator.validate(email)) {
        //    return Promise.reject(new ValidationError("Invalid Email!"));
        //}

        */

    if (!validator.isEmail(email)) {
      return Promise.reject(new ValidationError("Invalid Email!"));
    }
    // console.log("email validated call pwd reset");

    const data = JSON.stringify({
      email: email,
    });
    return this.asyncService
      .postDataUnauthorized("/password/reset", data, RECOVER_PASSWORD_OPTIONS)
      .then(() => {
        return true;
      })
      .catch(() => {
        throw new NetworkingError("Recovering Password failed!");
      });
  }
}

export default new AuthenticationService(
  AsyncService,
  AuthorizationStorage,
  UserAuthorizationCreator
);
