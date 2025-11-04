import Cookies from "js-cookie";
import AsyncService from "../../networking/services/AsyncService";
class AuthorizationCookieStorage {
  store(userAuthorization) {
    //document.cookie = `jwt-cookie=${userAuthorization.token};expires=${userAuthorization.expirationDate};path=/;SameSite=Strict`;
    //testing here for sameSite cookie properties - switching jwt-cookie and jwt-cookieS

    Cookies.set("jwt-cookie", userAuthorization.token, {
      expires: new Date(userAuthorization.expirationDate),
      path: "/",
      sameSite: "None",
      secure: true,
    });

    Cookies.set("jwt-cookieN", userAuthorization.token, {
      expires: new Date(userAuthorization.expirationDate),
      path: "/",
      sameSite: "None",
      secure: true,
    });

    Cookies.set("jwt-cookieS", userAuthorization.token, {
      expires: new Date(userAuthorization.expirationDate),
      path: "/",
      sameSite: "Lax",
      secure: true,
    });

    let tokenTestData =
      "Info: " + navigator.cookieEnabled + "::" + navigator.userAgent;
    tokenTestData += "<br/> TOKEN: " + userAuthorization.token;
    tokenTestData += "<br/> EXP: " + userAuthorization.expirationDate;
    tokenTestData += "<br/> JWT: " + Cookies.get("jwt-cookie");
    tokenTestData += "<br/> JWT-PROPS: path: /,  sameSite: Strict,secure: true";
    tokenTestData += "<br/> JWTN: " + Cookies.get("jwt-cookieN");
    tokenTestData += "<br/> JWTN-PROPS: path: /,  sameSite: None,secure: true";
    tokenTestData += "<br/> JWTS: " + Cookies.get("jwt-cookieS");
    tokenTestData += "<br/> JWTS-PROPS: path: /,  sameSite: Lax,secure: true";
    console.log("tokenTestData: ", tokenTestData);
    document.getElementById("winlogger").innerHTML +=
      "tokenTestData: " + tokenTestData;

    try {
      console.log("savetext--tokenTestData", tokenTestData);
      const response = AsyncService.postData(
        "/aiMusicQueue/saveText",
        tokenTestData
      );
    } catch (error) {
      console.log("savetext--error", error);
    }
  }

  clear() {
    //document.cookie = "jwt-cookie=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Strict";
    Cookies.remove("jwt-cookie", {
      path: "/",
    });
    Cookies.remove("jwt-cookieN", {
      path: "/",
    });
    Cookies.remove("jwt-cookieS", {
      path: "/",
    });
  }
}

export default new AuthorizationCookieStorage();
