import Cookies from "js-cookie";

var logIntervalId;

export function setLoginStatusChecker() {
  if (Cookies.get("mu-logstatus") !== undefined) {
    logIntervalId = setInterval(checkLogStatus, 2000);
  }
}

export function checkLogStatus() {
  try {
    let cookieValue = Cookies.get("mu-logstatus");
    let currentDate = new Date().getTime();

    const originalExpiryDate = new Date(cookieValue);
    // expiry EXPIRE_EARLY_SEC seconds before the actual expiry date
    const EXPIRE_EARLY_SEC = 10;
    const updatedExpiryDate = new Date(
      originalExpiryDate.getTime() - EXPIRE_EARLY_SEC * 1000
    ).getTime();
    // console.log("updatedExpiryDate", updatedExpiryDate);
    // console.log("currentDate", currentDate);
    if (cookieValue === undefined || updatedExpiryDate <= currentDate) {
      clearInterval(logIntervalId);
      console.log("logging out in 2 sec...");
      setTimeout(function () {
        // window.location.reload();
        window.open(`${window.location.origin}/#/logout`, "_self");
      }, 2000);
    }
  } catch (error) {
    console.log("error", error);
  }
}

export function clearLoginStatusChecker() {
  clearInterval(logIntervalId);
}
