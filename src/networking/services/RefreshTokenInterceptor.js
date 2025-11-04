class RefreshTokenInterceptor {

  constructor(axiosInstance, tokenRefresher) {
    this.axiosInstance = axiosInstance;
    this.tokenRefresher = tokenRefresher;
  }

  intercept(errorResponse) {
    const status = errorResponse.response ? errorResponse.response.status : null;
    const originalRequest = errorResponse.config;
    if (status === 401 && !originalRequest._retry) {
      return this.handleRefresh(errorResponse, originalRequest);
    }
    return Promise.reject(errorResponse);
  }

  handleRefresh(errorResponse, originalRequest) {
    originalRequest._retry = true;
    originalRequest.baseURL = ''; // Prevents adding baseURL to requestURL multiple times
    return this.tokenRefresher.refresh().then(() => {
      return this.axiosInstance(originalRequest);
    }).catch(() => {
      return Promise.reject(errorResponse);
    });
  }
}

export default RefreshTokenInterceptor;