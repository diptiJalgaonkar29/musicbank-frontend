/*var bannerText =
  "Attention Mastercard Sonic Hub Users: We're committed to enhancing your experience. Please be advised that Sonic Hub will undergo scheduled maintenance and will not be available for 4 days starting Thursday 27 March through Sunday 31 March. We appreciate your understanding and patience as we work to improve our service. Thank you for your continued support.";*/
var bannerText =
  "<center style='margin: 5px 0;'><b>Important Update: Mastercard Sonic Hub Scheduled Downtime</b></center>Mastercard Sonic Hub will be unavailable due to scheduled maintenance from November 12 - 15. Starting November 15, please log in via Mastercard SSO. For any issues, kindly reach out to <a href='mailto:mc.sonic-identity@ampcontact.com'>mc.sonic-identity@ampcontact.com</a>. Thank you for your understanding!";

var siteText =
  "<center style='margin: 5px 0;'><b>Important Update: Mastercard Sonic Hub Scheduled Downtime</b></center>Mastercard Sonic Hub will be unavailable due to scheduled maintenance from November 12 - 15. Starting November 15, please log in via Mastercard SSO. For any issues, kindly reach out to <a href='mailto:mc.sonic-identity@ampcontact.com'>mc.sonic-identity@ampcontact.com</a>. Thank you for your understanding!";

var mntPopShown = false;
var popText = "";
var logStatusInterval;

function openClosePopup(_st) {
  var popup = document.getElementById("mntPopup");
  if (_st) {
    popup.style.zIndex = "1000001";
    popup.classList.add("show");
  } else {
    popup.style.zIndex = "0";
    popup.classList.remove("show");
  }
}

function getCookieValue(cookieName) {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

function createPopup() {
  var logstatus = getCookieValue("mu-logstatus");
  // console.log("logstatus ", logstatus);

  var popupContainer = document.createElement("div");
  popupContainer.classList.add("mntPopup");
  popupContainer.id = "mntPopup";
  var popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");
  var textElement = document.createElement("p");

  popupContent.appendChild(textElement);

  if (logstatus != null || 1 == 1) {
    // console.log("after login");
    popupContainer.style.position = "sticky";
    popText = siteText;
    popupContent.classList.add("popAL");
    var xButton = document.createElement("button");
    xButton.classList.add("buttonX");
    xButton.textContent = "X";
    popupContent.appendChild(xButton);
    xButton.addEventListener("click", function () {
      popupContainer.remove();
      clearInterval(logStatusInterval);
    });
  } else {
    // console.log("before login");
    popupContainer.style.position = "absolute";
    popText = bannerText;
    popupContent.classList.add("popBL");
    var okayButton = document.createElement("button");
    okayButton.classList.add("buttonOk");
    okayButton.textContent = "Ok";
    popupContent.appendChild(okayButton);
    okayButton.addEventListener("click", function () {
      popupContainer.remove();
      chkLogStatus();
    });
  }
  textElement.innerHTML = popText;
  popupContainer.appendChild(popupContent);
  document.body.insertBefore(popupContainer, document.getElementById("root"));
}

function chkLogStatus() {
  if (!mntPopShown) {
    logStatusInterval = setInterval(function () {
      var logstatus = getCookieValue("mu-logstatus");
      // console.log("chkLogStatus", logstatus, mntPopShown);
      if (logstatus != null) {
        createPopup();
        openClosePopup(true);
        mntPopShown = true;
      }
      if (mntPopShown) {
        clearInterval(logStatusInterval);
      }
    }, 1000);
  }
}

//uncomment the below line to activate the popup
// createPopup();
// openClosePopup(true);
