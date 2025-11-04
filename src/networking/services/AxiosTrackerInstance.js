import axios from "axios";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import Cookies from "js-cookie";
import TokenRefresher from "../services/TokenRefresher";

let authToken = Cookies.get("jwt-cookie");

const AxiosTrackerInstance = axios.create({
  baseURL: "/api",
  headers: {
    BrandName: getSuperBrandId(),
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  },
});

AxiosTrackerInstance.interceptors.response.use(
  (response) => {
    // console.log('response from interceptor', response.data);
    return response.data;
  },
  async (error) => {
    console.log("err", error);
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        return AxiosTrackerInstance(error.config);
      } catch (refreshError) {
        console.log("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

async function refreshToken() {
  try {
    await TokenRefresher.refresh();
    const newAccessToken = await TokenRefresher.loadRefreshToken();
    AxiosTrackerInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export default AxiosTrackerInstance;
