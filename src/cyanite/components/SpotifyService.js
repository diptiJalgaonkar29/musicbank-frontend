import axios from "axios";

import { NetworkingError } from "../../common/model/NetworkingError";

class SpotifyService {
  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  loadSpotifySearchResultData(searchTerm) {
    //axios request
    return axios
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
        //console.log("cyanite data " + JSON.stringify(res.data));
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

export default SpotifyService;
