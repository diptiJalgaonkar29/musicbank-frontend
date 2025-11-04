import UserAuthorization from "./UserAuthorization";
import moment from "moment";

class UserAuthorizationCreator {
  createFromResponse(data) {
    return new UserAuthorization(
      data.user_id,
      data.access_token,
      data.refresh_token,
      moment(new Date()).add(data.expires_in, "s").toDate()
    );
  }

  createFromStorage(data) {
    return new UserAuthorization(
      data.userId,
      data.token,
      data.refreshToken,
      data.expirationDate
    );
  }

  createInvalid() {
    return new UserAuthorization(null, null, null, new Date());
  }
}

export default new UserAuthorizationCreator();
