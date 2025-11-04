import axios from "axios";
import AuthorizationStorage from "../../authentication/services/AuthorizationStorage";
import UserAuthorizationCreator from "../../authentication/services/UserAuthorizationCreator";
import AxiosInstance from "./AxiosInstance";
import RefreshTokenInterceptor from "./RefreshTokenInterceptor";
import TokenRefresher from "./TokenRefresher";
import getSuperBrandId from "../../common/utils/getSuperBrandId";

//addition by Trupti-Wits

class AsyncService {
  constructor(
    axios,
    authorizationStorage,
    userAuthorizationCreator,
    tokenRefresher
  ) {
    this.axios = axios;
    this.authorizationStorage = authorizationStorage;
    this.refreshTokenInterceptor = new RefreshTokenInterceptor(
      this.axios,
      tokenRefresher
    );
    this.configure();
  }

  configure() {
    this.axios.interceptors.request.use(
      (config) => {
        const token = this.authorizationStorage.load().token;
        const authorizationHeader = config.headers["Authorization"] || "";
        const hasBasicHeader = authorizationHeader.startsWith("Basic");
        const hasBrandNameHeader = config.headers["BrandName"] || "";
        if (!hasBrandNameHeader) {
          config.headers["BrandName"] = getSuperBrandId();
        }
        const hasBrandIdHeader = config.headers["BrandId"] || "";
        if (!hasBrandIdHeader) {
          config.headers["BrandId"] = localStorage.getItem("brandId") || "null";
        }
        if (token && !hasBasicHeader) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    this.axios.interceptors.response.use(
      (response) => response,
      (errorResponse) => {
        return this.refreshTokenInterceptor.intercept(errorResponse);
      }
    );
  }

  assignContentTypeJSONOptions(options) {
    return {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
      },
    };
  }

  loadBlob(resource) {
    const options = {
      responseType: "blob",
    };
    return this.axios.get(resource, options);
  }

  loadBlobParam(resource, customoptions) {
    const options = {
      responseType: "blob",
      ...customoptions,
    };
    return this.axios.get(resource, options);
  }

  loadBlobUnregistered(config) {
    return axios
      .post("api/" + config.url, config.data, config.headerConfig)
      .then((response) => {
        return response;
      });
  }

  loadData(resource, config = {}) {
    // console.log("config", config);
    return this.axios.get(resource, config);
  }

  loadDataParam(resource, data, options) {
    return this.axios.post(resource, data, options);
  }
  patchData(resource, data, options) {
    return this.axios.patch(resource, data, options);
  }

  loadDataParam1(resource, data, options) {
    return this.axios.get(resource, data, options);
  }

  loadDataUnauthorized(resource, options = {}) {
    let unathOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
      },
    };
    return this.axios.get(resource, unathOptions);
  }

  postData(resource, data, options) {
    const optionsExtended = this.assignContentTypeJSONOptions(options || {});
    return this.axios.post(resource, data, optionsExtended);
  }

  postDataUnauthorized(resource, data, options = {}) {
    let unathOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
      },
    };
    return this.axios.post(resource, data, unathOptions);
  }

  putDataUnauthorized(resource, data, options = {}) {
    let unathOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
      },
    };
    return this.axios.put(resource, data, unathOptions);
  }

  postDataUnauthorizedForSSO(resource, id_token) {
    return axios.post(resource, {
      idToken: id_token,
    });
  }

  postFormData(resource, Formdata, options = {}) {
    let multiPartOptions = {
      ...options,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
    };
    return this.axios.post(resource, Formdata, multiPartOptions);
  }

  putData(resource, data, options) {
    const optionsExtended = this.assignContentTypeJSONOptions(options || {});
    return this.axios.put(resource, data, optionsExtended);
  }

  remove(resource, data, options) {
    return this.axios.delete(resource, options);
  }
}

export default new AsyncService(
  AxiosInstance,
  AuthorizationStorage,
  UserAuthorizationCreator,
  TokenRefresher
);
