import axios from "axios";
import getSuperBrandId from "../../common/utils/getSuperBrandId";

const AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  crossdomain: true,
  mode: "no-cors",
  headers: {
    BrandName: getSuperBrandId(),
  },
});

export default AxiosInstance;
