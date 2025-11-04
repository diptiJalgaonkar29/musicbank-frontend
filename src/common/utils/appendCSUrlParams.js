import { getUserMeta } from "./getUserAuthMeta";
import Cookies from "js-cookie";

const appendCSUrlParams = () => {
  const { brandName, brandId, email, userId } = getUserMeta();
  console.log(getUserMeta())
  const isSSOLogin = localStorage.getItem("isSSOLogin") === "true";
  const redirectUrl = window.location.origin;
  const encodedEmailStr = `${userId},${new Date().getTime()}`;
  const encodedEmail = btoa(encodedEmailStr);

  let cookieValue = Cookies.get("mu-logstatus");
  const expiryDate = new Date(cookieValue);

  const encodedExpiry = btoa(expiryDate);

  if (isSSOLogin) {
    return `user=${encodeURIComponent(
      encodedEmail
    )}&redirect_url=${encodeURIComponent(
      redirectUrl
    )}&brand_id=${brandId}&brand_name=${encodeURIComponent(
      brandName
    )}&is_sso=1&meta=${encodeURIComponent(encodedExpiry)}`;
  } else {
    return `user=${encodeURIComponent(
      encodedEmail
    )}&redirect_url=${encodeURIComponent(
      redirectUrl
    )}&brand_id=${brandId}&brand_name=${encodeURIComponent(
      brandName
    )}&meta=${encodeURIComponent(encodedExpiry)}`;
  }
};

export default appendCSUrlParams;
