import StringUtils from '../../common/utils/StringUtils';
import AxiosInstance from './AxiosInstance';
import AuthorizationStorage from '../../authentication/services/AuthorizationStorage';
import UserAuthorizationCreator from '../../authentication/services/UserAuthorizationCreator';

const REFRESH_TOKEN_OPTIONS = {
  headers: {
    'Authorization': 'Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

class TokenRefresher {

  constructor(axiosInstance, authorizationStorage, userAuthorizationCreator) {
    this.axiosInstance = axiosInstance;
    this.authorizationStorage = authorizationStorage;
    this.userAuthorizationCreator = userAuthorizationCreator;
    this.fetchingPromise = null;
  }

  loadRefreshToken() {
    return this.authorizationStorage.load().refreshToken;
  }

  refresh() {
    if (this.fetchingPromise !== null) {
      return this.fetchingPromise;
    }
    const refreshToken = this.loadRefreshToken();
    if (!refreshToken) {
      return Promise.reject();
    }
    const data = StringUtils.objectToString({
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken
    });
    this.fetchingPromise = this.axiosInstance.post('/oauth/token', data, REFRESH_TOKEN_OPTIONS);
    return this.fetchingPromise.then(response => {
      if (response.status === 200) {
        this.storeUserAuthorizationFromResponse(response);
        return Promise.resolve();
      }
      return Promise.reject();
    }).finally(() => {
      this.fetchingPromise = null;
    });
  }

  storeUserAuthorizationFromResponse(response) {
    const userAuthorization = this.userAuthorizationCreator.createFromResponse(response.data);
    this.authorizationStorage.store(userAuthorization);
  }
}

export default new TokenRefresher(AxiosInstance, AuthorizationStorage, UserAuthorizationCreator);

