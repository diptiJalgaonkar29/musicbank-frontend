import React from "react";
import axios from "axios";
import "../../search1/_styles/CustomSearchForAll.css";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import AlgoliaService from "../../networking/services/AlgoliaService";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import IconButtonWrapper from "../../branding/componentWrapper/IconButtonWrapper";
import InputWrapper from "../../branding/componentWrapper/InputWrapper";
import { connect } from "react-redux";
import { FilterByTags } from "./filterByTags/FilterByTags";

import AsyncService from "../../networking/services/AsyncService";
import FilterByTagsDB from "./filterByTagsDB/FilterByTagsDB";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

//https://codepen.io/pravid/pen/bGRNoWM
//spotify search query
//https://developer.spotify.com/console/get-search-item/?q=Muse&type=track&market=&limit=&offset=&include_external=

class SpotifySearch3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTracksDialog: false,
      isSpotifyTracksDialog: false,
      searchTerm: "",
      searchSpotifyTracksByTitle: [],
      searchSpotifyTracksByArtist: [],
      searchLibraryTracks: [],
      searchToggle: "song",
      tags: [],
      toggleChecked: false,
      hideAutoCompleteBox: true,
      preview_image_data: "",
      refresh_token: process.env.REACT_APP_API_SPOTIFY_REFRESH_TOKEN,
    };
    this.autocomplete = this.autocomplete.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.redirectToBrowseAndFilterTracksBySpotifyId =
      this.redirectToBrowseAndFilterTracksBySpotifyId.bind(this);
    this.resetStateValues = this.resetStateValues.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  componentDidMount() {
    this.refreshSpotifyToken();
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
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

  getAlgoliaTracks(query) {
    AlgoliaService.search({
      query,
      filters: `trackStatus:true AND trackActive:true`,
      attributesToRetrieve: ["preview_image_url", "track_name", "objectID"],
    })
      .then(({ hits }) => {
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query,
          }),
          usedFor: "search",
          serviceBy: "Algolia",
          statusCode: 200,
          statusMessage: "",
        });
        this.setState({ searchLibraryTracks: hits });
      })
      .catch((error) => {
        console.log("Search error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            query,
          }),
          usedFor: "search",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
      });
  }

  getTracks(query) {
    AsyncService.loadData(`/trackMeta/searchByTitle?trackName=${query}`)
      .then((res) => {
        if (Array.isArray(res?.data) && res?.data?.length > 0) {
          this.setState({ searchLibraryTracks: res?.data || [] });
        }
      })
      .catch((error) => {
        console.log("Search error", error);
      });
  }

  autocomplete(evt, configModules) {
    let text = evt.target.value;
    this.setState({ searchTerm: text });

    if (text.length >= 3) {
      this.setState({ hideAutoCompleteBox: false });
      if (configModules.SpotifySearchBox) {
        axios
          .get(
            `https://api.spotify.com/v1/search?q=${text}&type=track&limit=20`,
            {
              headers: {
                "Content-Type": "application/json",
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
              let output = res.data.tracks.items.filter((eachVal) => {
                let opt = eachVal.artists.some(({ name }) =>
                  name.toLowerCase().includes(text.toLowerCase())
                );
                return opt;
              });
              this.setState({ searchSpotifyTracksByArtist: output });
              this.setState({
                searchSpotifyTracksByTitle: res.data.tracks.items,
              });
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
          });
      }
      let trackQuery = text.toLowerCase()?.trim();
      if (configModules.removeAlgolia) {
        this.getTracks(trackQuery);
      } else {
        this.getAlgoliaTracks(trackQuery);
      }
    } else {
      this.setState({ hideAutoCompleteBox: true });
    }
  }

  redirectToBrowseV2AndFilterTracksBySpotifyId(id) {
    this.resetStateValues();
    this.props.navigate(`/search_results/spt-${id}`);
    this.closeDialog();
  }

  redirectToBrowseAndFilterTracksBySpotifyId(id) {
    this.resetStateValues();
    this.props.navigate(`/search_results/spt-${id}`);
    this.closeDialog();
  }

  redirectToTackDetailPage(id) {
    this.resetStateValues();
    this.props.navigate(`/track_page/${id}`);
    this.closeDialog();
  }

  closeDialog() {
    this.setState({ showTracksDialog: false });
    document.body.style.overflow = "auto";
  }

  ShowMoreSpotiftyResults() {
    this.setState({ isSpotifyTracksDialog: true, showTracksDialog: true });
    document.body.style.overflow = "hidden";
  }

  ShowMoreAlgoliaResults() {
    this.setState({ isSpotifyTracksDialog: false, showTracksDialog: true });
    document.body.style.overflow = "hidden";
  }

  resetStateValues() {
    this.setState({
      searchTerm: "",
      hideAutoCompleteBox: true,
    });
  }

  setTags(tags) {
    this.setState({ tags });
  }

  render() {
    const {
      searchSpotifyTracksByTitle,
      searchTerm,
      isSpotifyTracksDialog,
      searchToggle,
      searchSpotifyTracksByArtist,
      searchLibraryTracks,
      tags,
      hideAutoCompleteBox,
      showTracksDialog,
    } = this.state;
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            <div
              className={`custSearchBoxForAll expand`}
              id="custSearchBoxForAll"
            >
              <div className="custSearch__container" id="custSearch__container">
                <div className="custSearch__dropdownHolder">
                  <div className="">
                    <div className="form-group">
                      <InputWrapper
                        type="text"
                        size="s"
                        id="autocomplete"
                        placeholder="Search by title or any keyword"
                        onChange={(e) => this.autocomplete(e, config?.modules)}
                        value={searchTerm}
                        autoComplete="off"
                        className="custom-input searchBar-input"
                      />
                      {!!searchTerm && (
                        <span
                          className="custSearch_closeBtn"
                          onClick={() => {
                            this.resetStateValues();
                          }}
                        >
                          <IconButtonWrapper icon="Close" />
                        </span>
                      )}
                      <div
                        className="custSearchBoxForAll__tblHolder"
                        id="custSearchTblData"
                        style={{
                          display:
                            !hideAutoCompleteBox &&
                            (searchSpotifyTracksByTitle.length >= 1 ||
                              searchLibraryTracks.length >= 1 ||
                              tags.length >= 1)
                              ? "block"
                              : "none",
                        }}
                      >
                        <div className="custSearchBoxForAll__dataHolder">
                          {/* spotify block */}
                          {searchSpotifyTracksByTitle.length >= 1 && (
                            <div className="custSearchBoxForAll__data1">
                              <table className="autoTable">
                                {searchSpotifyTracksByTitle
                                  .slice(0, 2)
                                  .map((item, idx) => (
                                    <tr
                                      style={{ cursor: "pointer" }}
                                      className={`spt-${item.id} autoTr`}
                                      key={idx}
                                      onClick={() => {
                                        if (config.modules.removeAlgolia) {
                                          this.redirectToBrowseV2AndFilterTracksBySpotifyId(
                                            item.id
                                          );
                                        } else {
                                          this.redirectToBrowseAndFilterTracksBySpotifyId(
                                            item.id
                                          );
                                        }
                                      }}
                                    >
                                      <SearchResultsCard
                                        data_type="spotify"
                                        track_name={item.name}
                                        artist_name={item.artists[0].name}
                                        preview_image_url={
                                          item.album.images[2].url
                                        }
                                      />
                                    </tr>
                                  ))}
                              </table>
                              <div className="clearfixSearch"></div>
                              <button
                                className="custSearchShowMoreResults"
                                id="custSearchShowMoreSpotiftyResults"
                                onClick={() => {
                                  this.ShowMoreSpotiftyResults();
                                }}
                              >
                                Show All Spotify Tracks
                              </button>
                            </div>
                          )}
                          {/* library block */}
                          {searchLibraryTracks.length >= 1 && (
                            <div className="custSearchBoxForAll__data2">
                              <table className="autoTable">
                                {searchLibraryTracks.slice(0, 2).map((item) => (
                                  <tr
                                    key={`lib-${item.objectID}`}
                                    style={{ cursor: "pointer" }}
                                    className={`lib-${item.objectID} autoTr`}
                                    onClick={() =>
                                      this.redirectToTackDetailPage(
                                        Number(item.objectID)
                                      )
                                    }
                                  >
                                    <SearchResultsCard
                                      data_type="library"
                                      track_name={item.track_name}
                                      preview_image_url={item.preview_image_url}
                                    />
                                  </tr>
                                ))}
                              </table>
                              <div className="clearfixSearch"></div>
                              <button
                                className="custSearchShowMoreResults"
                                id="custSearchShowMoreSpotiftyResults"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  this.ShowMoreAlgoliaResults();
                                }}
                              >
                                Show All Track Names
                              </button>
                            </div>
                          )}
                          {/* tags block */}
                          {config.modules.removeAlgolia ? (
                            <FilterByTagsDB
                              searchTerm={searchTerm}
                              setTags={this.setTags}
                            />
                          ) : (
                            <FilterByTags
                              searchTerm={searchTerm}
                              limit={500}
                              attribute="tag_amp_allmood_ids"
                              operator="or"
                              key="tag_amp_allmood_ids"
                              resetStateValues={this.resetStateValues}
                              setTags={this.setTags}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <IconButtonWrapper
                  icon="Search"
                  className="searchIconContainer"
                />
              </div>
              <div className="clearfixSearch"></div>
            </div>
            {showTracksDialog && (
              <>
                <div className="clearfixSearch"></div>
                <div
                  className="custSearchResultDialogBg"
                  id="custSearchResultDialogBg"
                >
                  <div className="custSearchResultDialog">
                    <div className="custSearchResultDialogHeading__Holder">
                      <h2 className="custSearchResultDialogHeading">
                        {isSpotifyTracksDialog
                          ? "Please select a Spotify track"
                          : "Please select a track"}
                      </h2>

                      {isSpotifyTracksDialog && (
                        <div className="custSearchResultDialogToggle__Holder">
                          <span className="custSearchToggleBy__SongArtist">
                            Song
                          </span>
                          <label className="switch">
                            <input
                              type="checkbox"
                              className="toggleBar"
                              id="toggleBar"
                              checked={this.state.toggleChecked}
                              onChange={() => {
                                if (this.state.searchToggle === "song") {
                                  this.setState({
                                    searchToggle: "artist",
                                    toggleChecked: true,
                                  });
                                } else {
                                  this.setState({
                                    searchToggle: "song",
                                    toggleChecked: false,
                                  });
                                }
                              }}
                            />

                            <span className="slider round"></span>
                          </label>
                          <span className="custSearchToggleBy__SongArtist">
                            Artist
                          </span>
                        </div>
                      )}
                      <div
                        className="closeIconContainer"
                        id="closeIconContainer"
                        onClick={this.closeDialog}
                      >
                        <IconButtonWrapper icon="Close" className="closeIcon" />
                      </div>
                    </div>
                    {isSpotifyTracksDialog ? (
                      <div
                        className="custSearchResultSpotifyTracksOuterContainer"
                        id="custSearchResultSpotifyTracksOuterContainer"
                      >
                        <div className="custSearchResultTracksInnerContainer">
                          {searchToggle === "song" ? (
                            <table
                              className="autoTable"
                              id="autoTable"
                              cellPadding="20px"
                            >
                              <tbody>
                                {searchSpotifyTracksByTitle.length === 0 ? (
                                  <tr>
                                    <td>
                                      <h2
                                        style={{
                                          color: "var(--color-white)",
                                          textAlign: "center",
                                          fontSize: "20px",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        No Results Found For Search &#34;
                                        {searchTerm}
                                        &#34;
                                      </h2>
                                    </td>
                                  </tr>
                                ) : (
                                  <>
                                    {searchSpotifyTracksByTitle.map(
                                      (item, idx) => (
                                        <div
                                          className="custSearchBoxForAll__Tracks"
                                          key={
                                            "custSearchBoxForAll__Tracks" + idx
                                          }
                                        >
                                          <tr
                                            style={{ cursor: "pointer" }}
                                            className={`lib-${item.objectID}`}
                                            key={idx}
                                            onClick={() => {
                                              if (
                                                config.modules.removeAlgolia
                                              ) {
                                                this.redirectToBrowseV2AndFilterTracksBySpotifyId(
                                                  item.id
                                                );
                                              } else {
                                                this.redirectToBrowseAndFilterTracksBySpotifyId(
                                                  item.id
                                                );
                                              }
                                            }}
                                          >
                                            <SearchResultsCard
                                              data_type="spotify"
                                              track_name={item?.name}
                                              artist_name={
                                                item?.artists?.[0]?.name
                                              }
                                              preview_image_url={
                                                item?.album?.images?.[2]?.url
                                              }
                                              key={item?.artists?.[0]?.name}
                                            />
                                          </tr>
                                        </div>
                                      )
                                    )}
                                  </>
                                )}
                              </tbody>
                            </table>
                          ) : (
                            <table
                              className="autoTable"
                              id="autoTable"
                              cellPadding="20px"
                            >
                              {searchSpotifyTracksByArtist.length === 0 ? (
                                <tr>
                                  <h2
                                    style={{
                                      color: "var(--color-white)",
                                      textAlign: "center",
                                      fontSize: "20px",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    No Results Found For Search &#34;
                                    {searchTerm}
                                    &#34;
                                  </h2>
                                </tr>
                              ) : (
                                <>
                                  {searchSpotifyTracksByArtist.map(
                                    (item, idx) => (
                                      <div
                                        className="custSearchBoxForAll__Tracks"
                                        key={
                                          "custSearchBoxForAll__Tracks" + idx
                                        }
                                      >
                                        <tr
                                          style={{ cursor: "pointer" }}
                                          className={`spt-${item.id} autoTr`}
                                          key={idx}
                                          onClick={() => {
                                            if (config.modules.removeAlgolia) {
                                              this.redirectToBrowseV2AndFilterTracksBySpotifyId(
                                                item.id
                                              );
                                            } else {
                                              this.redirectToBrowseAndFilterTracksBySpotifyId(
                                                item.id
                                              );
                                            }
                                          }}
                                        >
                                          <SearchResultsCard
                                            data_type="spotify"
                                            track_name={item?.name}
                                            artist_name={
                                              item?.artists?.[0]?.name
                                            }
                                            preview_image_url={
                                              item?.album?.images?.[2]?.url
                                            }
                                            key={item?.artists?.[0]?.name}
                                          />
                                        </tr>
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                            </table>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="custSearchResultLibraryTracksOuterContainer"
                        id="custSearchResultLibraryTracksOuterContainer"
                      >
                        <div className="custSearchResultTracksInnerContainer">
                          <table
                            className="autoTable"
                            id="autoTable"
                            cellPadding="20px"
                          >
                            <tbody>
                              {searchLibraryTracks.length === 0 ? (
                                <tr>
                                  <td>
                                    <h2
                                      style={{
                                        color: "var(--color-white)",
                                        textAlign: "center",
                                        fontSize: "20px",
                                        fontWeight: "normal",
                                      }}
                                    >
                                      No Results Found For Search &#34;
                                      {searchTerm}
                                      &#34;
                                    </h2>
                                  </td>
                                </tr>
                              ) : (
                                <>
                                  {searchLibraryTracks.map((item, idx) => (
                                    <div
                                      className="custSearchBoxForAll__Tracks"
                                      key={"custSearchBoxForAll__Tracks" + idx}
                                    >
                                      <tr
                                        style={{ cursor: "pointer" }}
                                        className={`lib-${item.objectID} autoTr`}
                                        key={idx}
                                        onClick={() =>
                                          this.redirectToTackDetailPage(
                                            Number(item.objectID)
                                          )
                                        }
                                      >
                                        <SearchResultsCard
                                          data_type="library"
                                          track_name={item.track_name}
                                          preview_image_url={
                                            item.preview_image_url
                                          }
                                        />
                                      </tr>
                                    </div>
                                  ))}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    taxonomy: state.taxonomy,
  };
};

export default withRouterCompat(connect(mapStateToProps, null)(SpotifySearch3));
