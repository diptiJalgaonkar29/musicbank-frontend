import UserAuthorizationCreator from "./UserAuthorizationCreator";

const STORAGE_KEY = "userAuthorization";

class AuthorizationLocalStorage {
  constructor(userAuthorizationCreator) {
    this.userAuthorizationCreator = userAuthorizationCreator;
  }

  store(userAuthorization) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userAuthorization));
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  load() {
    const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storageData === null) {
      // return this.userAuthorizationCreator.createInvalid();
      return {
        result: this.userAuthorizationCreator.createInvalid(),
        response: {},
      };
    }

    return {
      result: this.userAuthorizationCreator.createFromStorage(storageData),
      response: {},
    };
  }
}

export default new AuthorizationLocalStorage(UserAuthorizationCreator);
