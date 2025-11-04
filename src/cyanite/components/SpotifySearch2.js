import React from "react";
import axios from "axios";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";

//https://codepen.io/pravid/pen/bGRNoWM
//spotify search query
//https://developer.spotify.com/console/get-search-item/?q=Muse&type=track&market=&limit=&offset=&include_external=

let fromSS = false;

class SpotifySearch2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        sptid: "",
        name: "",
        uri: "",
        popularity: "",
      },
      cursor: 0,
      searchTerm: "",
      searchItems: [],
      //refresh_token: "BQAeGWAkNl2uYF5khNB37jXATySL30rOfLTcpAmgwvbDaPkNhoYzRZhgplF2IQTdYl21e76cgyGTiaYnGLNkRw2RJLF5lpeObesHzOJqveWzzWBQsJfVaL5UQ3vL06THHidlrP_UpBTmX3HPYdWA4XVvtUR13G-ic6MgiMdYtMGpkSb2xrbsnar_fA"
      refresh_token: process.env.REACT_APP_API_SPOTIFY_REFRESH_TOKEN,
    };
    fromSS = props.fromSS;
    this.autocomplete = this.autocomplete.bind(this);
    this.hanldeKeyup = this.hanldeKeyup.bind(this);
    this.hanldeKeydown = this.hanldeKeydown.bind(this);
    this.handleListKeydown = this.handleListKeydown.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // console.log("componentDidMount");
    //this.loadSpotifySearchResultData("a");
    this.refreshSpotifyToken();
  }

  refreshSpotifyToken() {
    // console.log("refreshSpotifyToken ");

    //var encodedStringBtoA = btoa(decodedStringBtoA);

    const qs = require("qs");
    let data = qs.stringify({
      grant_type: "refresh_token",
      //'refresh_token': 'AQDBz2-xq-BMLfXk7WQRB60d0JxrBv-utSm5BzqOydAy1S5-kcutfzINs5y35MzkONou_cNZk33cWlzWwNbkIBNEN4FqJnn4E_OeO08TE1LpMiDRQZjKq1OXfhM8B0mDMfU'
      refresh_token: `${process.env.REACT_APP_API_SPOTIFY_REFRESH_TOKEN}`,
    });
    let config = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        //'Authorization': 'Basic M2FlMzA4NmIzZTllNDhmZGE2MmFkMWExNjg1Y2IzNmE6YTcyZDYyOTNlZThjNGIyNTg2Mjg1YzE5MzVmM2UyOTU=',
        Authorization: `Basic ${process.env.REACT_APP_API_SPOTIFY_ACCESS_TOKEN}`,
        //'Authorization': `${encText}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        this.setState({ refresh_token: response.data.access_token });
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log('encText ', encText);
  }

  autocomplete(evt) {
    let text = evt.target.value;
    this.setState({ searchTerm: text });
    if (text.length >= 3) {
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
          {
            headers: {
              "Content-Type": "application/json",
              //   Authorization: '"' + "Bearer " + this.state.refresh_token + '"',
              Authorization: `Bearer ${this.state.refresh_token}`,
            },
          }
        )

        .then((res) => {
          trackExternalAPICalls({
            url: `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
            requestData: "",
            usedFor: "spotifySearch",
            serviceBy: "Spotify",
            statusCode: 200,
            statusMessage: "",
          });
          if (res !== undefined) {
            // console.log('res', res.data.tracks.items);
            this.setState({ searchItems: [] });
            this.setState({ searchItems: res.data.tracks.items });
          }
        })
        .catch((err) => {
          console.log("error getting spotify data  " + err.message);
          trackExternalAPICalls({
            url: `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
            requestData: "",
            usedFor: "spotifySearch",
            serviceBy: "Spotify",
            statusCode: err?.statusCode || "404",
            statusMessage: err?.message,
          });
          this.setState({ searchItems: [] });
        });
    } else {
      this.setState({ searchItems: [] });
    }
  }

  hanldeKeyup(evt) {
    // console.log('handlekeyup ' + evt.keyCode);
    if (evt.keyCode === 27) {
      this.setState({ searchItems: [] });
      return false;
    }
  }

  hanldeKeydown(evt) {
    // console.log('handleKeyDown ' + evt.keyCode);
    const { cursor, searchItems } = this.state;
    // arrow up/down button should select next/previous list element
    if (evt.keyCode === 38 && cursor > 0) {
      this.setState((prevState) => ({
        cursor: prevState.cursor - 1,
      }));
    } else if (evt.keyCode === 40 && cursor < searchItems.length - 1) {
      this.setState((prevState) => ({
        cursor: prevState.cursor + 1,
      }));
    }
    if (evt.keyCode === 13) {
      let currentItem = searchItems[cursor];
      if (currentItem !== undefined) {
        const { name, popularity, uri } = currentItem;

        const sptid = currentItem.id;
        this.setState({
          item: { name, sptid, popularity, uri },
          searchItems: [],
          searchTerm: name,
        });
        this.selectItem(sptid);
      }
    }
    if (evt.keyCode === 8) {
      // console.log();
    }
  }

  selectItem(id) {
    const { searchItems } = this.state;

    let selectedItem = searchItems.find((item) => item.id === id);
    const { name, uri, popularity } = selectedItem;

    const sptid = selectedItem.id;
    this.setState({ item: { sptid, name, uri, popularity } });
    this.setState({ searchItems: [] });
    this.setState({ searchTerm: name });
    if (fromSS) {
      const win = window.open("/#/similar_tracks/spt-" + sptid);
      win.focus();
    } else {
      this.props.fetchSimilarFromSpotify(sptid);
    }
    let spotifyTracksTableElement = document.querySelector(
      ".autoTable.spotifyTracksList"
    );
    if (spotifyTracksTableElement) {
      // console.log("spotifyTracksTableElement hide");
      spotifyTracksTableElement.style.display = "none";
    }
  }

  handleListKeydown(evt) {
    // console.log("keydown", evt.keyCode);
  }

  handleChange(evt) {
    // console.log('handlechange', evt.target.name);
    this.setState({ item: { [evt.target.name]: evt.target.value } });
  }

  render() {
    const { searchItems, cursor, item, handleChange, searchTerm } = this.state;
    const { sptid, uri, popularity } = item;

    return (
      <div className="mt-3 st-inner">
        <div className="form-group">
          <IconWrapper icon="Search" className="spotifySearchIcon" />
          <input
            type="text"
            id="autocomplete"
            autoComplete="off"
            placeholder="Search for a track in Spotify"
            onChange={this.autocomplete}
            onKeyUp={this.hanldeKeyup}
            onKeyDown={this.hanldeKeydown}
            value={searchTerm}
            className="custom-input form-control st-input-search"
            onFocus={() => {
              this.props.setShowDropDown(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                this.props.setShowDropDown(false);
              }, 250);
            }}
          />
          <table
            className="autoTable spotifyTracksList"
            style={{
              display:
                searchItems.length >= 2 && this.props.showDropDown
                  ? "block"
                  : "none",
            }}
          >
            <tbody>
              {searchItems.map((item, idx) => (
                <LazyLoadComponent ref={React.createRef()} defaultHeight={50}>
                  <tr
                    className={cursor === idx ? "sptactive autoTr" : "autoTr"}
                    key={idx}
                    onClick={() => this.selectItem(item.id)}
                  >
                    <td>
                      <SearchResultsCard
                        data_type="spotify"
                        track_name={item.name}
                        artist_name={item.artists[0].name}
                        preview_image_url={item.album.images[2].url}
                      />
                    </td>
                  </tr>
                </LazyLoadComponent>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="sptData"
          style={{ visibility: "collapse", position: "absolute" }}
        >
          <label htmlFor="sptid">sptid</label>
          <input
            type="text"
            name="sptid"
            id="sptid"
            value={sptid}
            onChange={handleChange}
            readOnly
            className="custom-input form-control"
          />
          <label htmlFor="uri">uri</label>
          <input
            type="text"
            name="uri"
            id="uri"
            value={uri}
            onChange={handleChange}
            readOnly
            className="custom-input form-control"
          />
          <label htmlFor="popularity">popularity</label>
          <input
            type="text"
            name="popularity"
            id="popularity"
            value={popularity}
            onChange={handleChange}
            readOnly
            className="custom-input form-control"
          />
        </div>
      </div>
    );
  }
}

export default SpotifySearch2;
