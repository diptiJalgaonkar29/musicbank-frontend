import AsyncService from "../../networking/services/AsyncService";
import { NetworkingError } from "../../common/model/NetworkingError";
import axios from "axios";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";

class UserService {
  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  getAllByUserNameQuery(userNameQuery) {
    return this.asyncService
      .loadData(`/users?query=${userNameQuery}`)
      .then((response) => {
        return response.data.map(
          (responseItem) =>
            new User(responseItem.id, responseItem.fullname, responseItem.email)
        );
      })
      .catch(() => {
        throw new NetworkingError("Failed loading Users by Query!");
      });
  }

  getAllUsers() {
    return this.asyncService
      .loadData("/users")
      .then((response) => {
        return response.data.map(
          (responseItem) =>
            new User(responseItem.id, responseItem.fullname, responseItem.email)
        );
      })
      .catch(() => {
        throw new NetworkingError("Failed loading Users by Query!");
      });
  }

  loadSpotifySearchResultData(searchTerm) {
    axios
      .get(
        "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer BQBDvEMvjV7TzMrF01zXbt_WLY5isfbn-UM6KjccfJlVe2zRwC8M61r02wfJ0UTdG-Visn4Q6frhohmMLhzTqaWtMjsqrFssxZr47K6m4DEXJuLjml23Bs4u_dc3eDWsfIc1SAN54el26tMVtPl1tN316N_8980Njj6reUC8Bno-EhNTGiBJadofFBKAL-MuIrCVPRM",
          },
        }
      )
      .then((res) => {
        trackExternalAPICalls({
          url:
            "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
          requestData: "",
          usedFor: "spotifySearch",
          serviceBy: "Spotify",
          statusCode: 200,
          statusMessage: "",
        });
        this.setState({
          spotify_search_data: res.data.tracks.items,
        });
      })
      .catch((err) => {
        console.log("error while catching cyanite data  ");
        trackExternalAPICalls({
          url:
            "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
          requestData: "",
          usedFor: "spotifySearch",
          serviceBy: "Spotify",
          statusCode: err?.statusCode || "404",
          statusMessage: err?.message,
        });
        throw new NetworkingError("Failed loading Spotify data!");
      });
  }
}

export class User {
  constructor(id, fullname, email) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
  }
}

export default new UserService(AsyncService);
