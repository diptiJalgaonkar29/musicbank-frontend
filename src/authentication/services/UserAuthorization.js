import Cookies from "js-cookie";

//additional code for logout in certain time period - Trupti - 07062021

export default class UserAuthorization {
  constructor(userId, token, refreshToken, expirationDate) {
    this.userId = userId;
    this.token = token;
    this.refreshToken = refreshToken;
    this.expirationDate = expirationDate;
  }

  isExpired() {
    //const cookieValue = document.cookie.split('; ').find(row => row.startsWith('mu-logstatus=')).split('=')[1];
    let cookieValue = Cookies.get("mu-logstatus");
    cookieValue =
      cookieValue === undefined ? "Thu, 01 Jan 1970 00:00:01 GMT" : cookieValue;
    var cookieDate = new Date(cookieValue);

    return cookieDate <= new Date();

    //this was earlier check using expiry of jwt-token, using above code now for logging out after certain time period

    //return this.expirationDate <= new Date()
  }
}
