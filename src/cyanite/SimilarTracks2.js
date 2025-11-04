import axios from "axios";
import React from "react";
import TrackPageHoc from "../track/layout/TrackPageHoc";
import CyaniteSearchBlockCard from "./components/CyaniteSearchBlockCard";
import SpotifySearchBlockCard from "./components/SpotifySearchBlockCard";
// import Autocomplete1, { CustomAutocomplete } from "./components/AlgoSearch";
// import SpotifySearch2 from "./components/SpotifySearch2";
import { CustomAutocomplete } from "./components/AlgoSearch";
import SpotifySearch2 from "./components/SpotifySearch2";
import { connectHits } from "react-instantsearch-dom";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import "./components/SpotifySearch.css";
import SpotifySearch3 from "./components/SpotifySearch3";
import MainLayout from "../common/components/MainLayout/MainLayout";
import { ReactComponent as SpotifyIcon } from "../static/icons-spotify.svg";
import { BrandingContext } from "../branding/provider/BrandingContext";
import { connect } from "react-redux";
import SearchResultsCard from "./components/searchResultsCard/SearchResultsCard";
import AsyncService from "../networking/services/AsyncService";
import { LazyLoadComponent } from "../common/components/LazyLoadComponent/LazyLoadComponent";
import trackExternalAPICalls from "../common/services/trackExternalAPICalls";
import LibrarySearch from "./components/LibrarySearch";
import { withRouterCompat } from "../common/utils/withRouterCompat";

//test this url for query
//https://app.cyanite.ai/similarity-search?source=library&sourceId=1313076&target=spotify

var combineIdSet = "";

var selfThis;
var fetchFrom = "";

var stSearchFrom = "library";
var stSearchTo = "library";

var clearSearchResult = false;
var trackDataError = "This track cannot be processed, try another track...";
var jsonDataError = "No similar tracks data found, try another track...";
var paramID = "NOID";

var analysisStates = [
  "AudioAnalysisV6Processing",
  "AudioAnalysisV6NotStarted",
  "AudioAnalysisV6Enqueued",
];

class SimilarTracks extends React.Component {
  constructor(props) {
    super(props);
    selfThis = this;
    //this.authorizationStorage = authorizationStorage;
    this.state = {
      jsonData: null,
      error: false,
      trackId: null,
      cyaniteId: null,
      trackData: null,
      matchIdSet: null,
      spotify_search_data: null,
      fetchFrom: null,
      stSearchFrom: "library",
      stSearchTo: "library",
      dataLoading: false,
      clearSearchResult: false,
      showDropDown: false,
      libQuery: "",
      libTracks: [],
    };
    //jwToken = authorizationStorage.load().token;
  }

  setShowDropDown(option) {
    selfThis.setState({ showDropDown: option });
  }

  setLibTracks(libTracks) {
    selfThis.setState({ libTracks });
  }

  componentWillUnmount() {
    //console.log('The component is going to be unmounted');
  }

  componentWillMount() {
    // console.log('The component is going to be mounted', this.props);
    paramID = this.props.match.params.id;
    if (paramID === undefined) {
      paramID = "NOID";
      return;
    } else if (paramID.indexOf("spt-") >= 0) {
      var spotifyParamID = paramID.replace("spt-", "");
      selfThis.setState({ stSearchFrom: "spotify", stSearchTo: "library" });
      stSearchFrom = "spotify";
      stSearchTo = "library";
      setTimeout(() => {
        this.fetchSimilarFromSpotify(spotifyParamID);
      }, 1000);
    } else {
      combineIdSet = this.props.match.params.id;
      this.updateMatchIdState(this.props.match.params.id);
    }
  }

  componentDidMount() {
    // console.log("componentDidMount");
    //this.loadSpotifySearchResultData("a");
  }

  getTrackCyaniteData(combineIdSet) {
    //const trackId = this.props.match.params.id.split("-")[1];
    const trackId = combineIdSet.split("-")[1];
    //this.setState({ trackId: trackId });

    /* //1 For getting track with cyanite
        Url Get Mapping         http://localhost:8080/api/tracks?trackId=1
        2 For getting Cyanite
        Get mapping        http://localhost:8080/api/cyanite?musicBankId=5 */

    AsyncService.loadData(`/tracks?trackId=${trackId}`)
      .then((res) => {
        //console.log("cyanite data " + JSON.stringify(res.data));
        this.setState({ trackData: res.data });
      })
      .catch(() => {
        console.log("error while catching cyanite data  ");
        this.setState({ trackData: "Error", error: false });
      });
  }

  fetchSimilarTracks(combineIdSet) {
    paramID = "";

    clearSearchResult = true;
    this.setState({ dataLoading: true, clearSearchResult: true });
    //this.setState({ matchIdSet: combineIdSet });
    //alert("call fetchSimilarTracks " + combineIdSet);

    const cyaniteId = combineIdSet.split("-")[0];
    //this.setState({ cyaniteId: cyaniteId });
    /* GET : http://localhost:3002/api/cyanite/*fetchSimilarFromLibrary*
        Params :        cyaniteId = <LibraryTrackID>
        toSearch = "library" OR "spotify"
        GET : http://localhost:3002/api/cyanite/*fetchSimilarFromSpotify*
        Params :  cyaniteId = <SpotifyTrackID>
        toSearch = "library" OR "spotify"        
        Note : Bearer token required  */

    fetchFrom = "library";
    //fetchFrom = this.state.stSearchTo;

    AsyncService.loadData(
      `/cyanite/fetchSimilarFromLibrary?cyaniteId=${cyaniteId}&toSearch=${stSearchTo}`
    )
      .then((res) => {
        clearSearchResult = false;
        if (res.data?.[0]?.statusMessage === "trackNotAnalyzed") {
          this.setState({
            jsonData: "Error",
            error: false,
            dataLoading: false,
            clearSearchResult: false,
          });
          return;
        }
        let jsonData1 = stSearchTo === "spotify" ? res.data : res.data[0].body;
        if (
          jsonData1 !== "" &&
          jsonData1 !== "[]" &&
          jsonData1 !== undefined &&
          jsonData1 !== null
        ) {
          let jsonDataTemp =
            stSearchTo === "spotify" ? res.data : res.data[0].body;
          this.setState({
            //jsonData: stSearchTo == "spotify" ? res.data[0].spotifyTrack.similarTracks.edges : res.data[0].body,
            jsonData: jsonDataTemp,
            // jsonData: res.data[0].body,
            error: false,
            dataLoading: false,
            clearSearchResult: false,
          });
        } else {
          clearSearchResult = false;

          this.setState({
            jsonData: "Error",
            error: false,
            dataLoading: false,
            clearSearchResult: false,
          });
        }
      })
      .catch(() => {
        //this.setState({ error: true });
        clearSearchResult = false;

        this.setState({
          jsonData: "Error",
          error: false,
          dataLoading: false,
          clearSearchResult: false,
        });
        console.log("error while catching cyanite data");
      });
  }

  fetchSimilarFromSpotify(_sptid) {
    paramID = "";

    clearSearchResult = true;
    selfThis.setState({ dataLoading: true, clearSearchResult: true });
    stSearchFrom = selfThis.state.stSearchFrom;
    stSearchTo = selfThis.state.stSearchTo;

    fetchFrom = "spotify";
    selfThis.setState({
      jsonData: null,
      trackData: null,
    });
    selfThis.loadSpotifyTrackData(_sptid);

    AsyncService.loadData(
      `/cyanite/fetchSimilarFromSpotify?spotifyId=${_sptid}&toSearch=${stSearchTo}`
    )
      .then((res) => {
        clearSearchResult = false;
        if (
          res.data?.[0]?.statusMessage === "trackNotAnalyzed" ||
          (!res.data && res.status === 200)
        ) {
          selfThis.setState({
            error: false,
            jsonData: "Error",
            clearSearchResult: false,
            dataLoading: false,
          });
          return;
        }
        selfThis.setState({ dataLoading: false, clearSearchResult: false });
        if (res.data[0] !== undefined && res.data[0] !== null) {
          if (res.data[0].spotifyTrack !== undefined) {
            if (
              res.data[0].spotifyTrack.similarTracks.code === "trackNotAnalyzed"
            ) {
              selfThis.setState({
                jsonData: "AudioAnalysisV6NotStarted",
                error: false,
              });
            } else {
              selfThis.setState({
                jsonData:
                  stSearchTo === "spotify"
                    ? res.data[0].spotifyTrack.similarTracks.edges
                    : res.data[0].body,
                error: false,
              });
            }
          } else {
            selfThis.setState({
              jsonData:
                stSearchTo === "spotify"
                  ? res.data[0].spotifyTrack.similarTracks.edges
                  : res.data[0].body,
              error: false,
            });
          }
        }
      })
      .catch((err) => {
        clearSearchResult = false;

        selfThis.setState({
          error: false,
          jsonData: "Error",
          clearSearchResult: false,
          dataLoading: false,
        });
        console.log("error while catching fetchSimilarFromSpotify");
      });
  }

  loadSpotifySearchResultData(searchTerm) {
    axios
      .get(
        "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_SPOTIFY_ACCESS_TOKEN}`,
          },
        }
      )
      .then((res) => {
        this.setState({ spotify_search_data: res.data.tracks.items });
        trackExternalAPICalls({
          url:
            "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
          requestData: "",
          usedFor: "spotifySearch",
          serviceBy: "Spotify",
          statusCode: 200,
          statusMessage: "",
        });
      })
      .catch((err) => {
        trackExternalAPICalls({
          url:
            "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
          requestData: "",
          usedFor: "spotifySearch",
          serviceBy: "Spotify",
          statusCode: err?.statusCode || "404",
          statusMessage: err?.message,
        });
        console.log("error while catching cyanite data  ");
      });
  }

  loadSpotifyTrackData(_sptid) {
    //http://localhost:3002/api/cyanite/fetchSpotifyAnalysis?spotifyId=1g81E6YHw7oJ7nBEERUvau

    AsyncService.loadData(`cyanite/fetchSpotifyAnalysis?spotifyId=${_sptid}`)
      .then((res) => {
        if (res.data?.[0]?.statusMessage === "trackNotAnalyzed") {
          selfThis.setState({
            error: false,
            jsonData: "Error",
            clearSearchResult: false,
            dataLoading: false,
          });
          return;
        }
        if (
          analysisStates.includes(
            res.data[0].spotifyTrack.audioAnalysisV6.__typename
          )
        ) {
          //if (res.data[0].spotifyTrack.audioAnalysisV6.__typename === "AudioAnalysisV6NotStarted" || res.data[0].spotifyTrack.audioAnalysisV6.__typename === "AudioAnalysisV6Enqueued")
          this.setState({
            trackData: "AudioAnalysisV6NotStarted",
            error: false,
          });
        } else {
          this.setState({ trackData: res.data[0], error: false });
        }
      })
      .catch(() => {
        console.log(
          "error while catching cyanite data - loadSpotifyTrackData  "
        );

        clearSearchResult = false;

        this.setState({
          trackData: "Error",
          error: false,
          clearSearchResult: false,
          dataLoading: false,
        });
      });
  }

  CustomHitsBlock() {
    const Hits = ({ hits }) => {
      if (hits?.length === 0 || !hits) return <></>;
      if (document.getElementsByClassName("librarySearchInput").length >= 1) {
        if (
          document.getElementsByClassName("librarySearchInput")[0].value !==
          "" &&
          document.getElementsByClassName("librarySearchInput")[0].value
            .length >= 2
        ) {
          return (
            <table className="autoTable libraryTracksList">
              <tbody>
                {hits?.map((hit) => {
                  if (
                    hit.cyanite_id !== null &&
                    hit.trackStatus == true &&
                    hit.trackActive == true
                  ) {
                    return (
                      <LazyLoadComponent
                        ref={React.createRef()}
                        defaultHeight={50}
                      >
                        <tr
                          key={hit.objectID}
                          className="autoTr"
                          data-cyaniteid={hit.cyanite_id}
                          data-trackid={hit.objectID}
                          onClick={() => {
                            combineIdSet = `${hit.cyanite_id}-${hit.objectID}`;
                            this.setState({
                              matchIdSet: `${hit.cyanite_id}-${hit.objectID}`,
                            });
                            this.updateMatchIdState(
                              `${hit.cyanite_id}-${hit.objectID}`
                            );
                            // let libraryTracksTableElement =
                            //   document.querySelector(
                            //     ".autoTable.libraryTracksList"
                            //   );
                            // if (libraryTracksTableElement) {
                            //   // console.log("libraryTracksTableElement hide");
                            //   libraryTracksTableElement.style.display = "none";
                            // }
                          }}
                        >
                          <td>
                            <SearchResultsCard
                              data_type="library"
                              track_name={hit.track_name}
                              preview_image_url={hit.preview_image_url}
                            />
                          </td>
                        </tr>
                      </LazyLoadComponent>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          );
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    const CustomHits = connectHits(Hits);
    return <CustomHits />;
  }

  CustomHitsBlockLibrary() {
    // console.log("this.state.libTracks", this.state.libTracks);
    const hits =
      this.state.libTracks?.filter((track) => !!track.cyanite_id) || [];
    if (hits?.length === 0 || !hits) return <></>;
    return (
      <table className="autoTable libraryTracksList">
        <tbody>
          {hits?.map((hit) => {
            return (
              <LazyLoadComponent ref={React.createRef()} defaultHeight={50}>
                <tr
                  key={hit.objectID}
                  className="autoTr"
                  data-cyaniteid={hit.cyanite_id}
                  data-trackid={hit.objectID}
                  onClick={(evt) => {
                    combineIdSet = `${hit.cyanite_id}-${hit.objectID}`;
                    this.setState({
                      matchIdSet: `${hit.cyanite_id}-${hit.objectID}`,
                    });
                    this.updateMatchIdState(
                      `${hit.cyanite_id}-${hit.objectID}`
                    );
                    this.setState({ showDropDown: false });
                    // let libraryTracksTableElement = document.querySelector(
                    //   ".autoTable.libraryTracksList"
                    // );
                    // if (libraryTracksTableElement) {
                    //   console.log("libraryTracksTableElement hide");
                    //   libraryTracksTableElement.style.display = "none";
                    // }
                  }}
                >
                  <td>
                    <SearchResultsCard
                      data_type="library"
                      track_name={hit.track_name}
                      preview_image_url={hit.preview_image_url}
                    />
                  </td>
                </tr>
              </LazyLoadComponent>
            );
          })}
        </tbody>
      </table>
    );
    //   } else {
    //     return <></>;
    //   }
    // } else {
    //   return <></>;
    // }
  }

  updateMatchIdState(combineIdSet) {
    fetchFrom = "library";

    combineIdSet =
      combineIdSet === null || combineIdSet === undefined
        ? this.props.match.params.id
        : combineIdSet;

    stSearchFrom = this.state.stSearchFrom;
    stSearchTo = this.state.stSearchTo;

    this.setState({ matchIdSet: combineIdSet });

    this.fetchSimilarTracks(combineIdSet);

    this.getTrackCyaniteData(combineIdSet);
  }

  renderCyaniteSpotifyBlock(trackObj, trackType) {
    var renderBlock = "";
    if (trackType === "single") {
      renderBlock = stSearchFrom;
    } else {
      renderBlock = stSearchTo;
    }

    if (renderBlock === "spotify") {
      // console.log("renderBlock ", renderBlock);
      if (analysisStates.includes(trackObj) || trackObj === null) {
        //if(trackObj === "AudioAnalysisV6NotStarted" || trackObj === "AudioAnalysisV6Enqueued" || trackObj === null)
        if (trackType === "single")
          return (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "25px" }}>
                {trackDataError}
              </td>
            </tr>
          );
        else
          return (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "25px" }}>
                {jsonDataError}
              </td>
            </tr>
          );
      }
      //else if (trackObj.spotifyTrack !== undefined) {
      else if (trackObj !== undefined) {
        if (trackType === "single") {
          return (
            <SpotifySearchBlockCard
              key={trackObj.spotifyTrack.id}
              id={trackObj.spotifyTrack.id}
              cyanite_id={trackObj.spotifyTrack.id}
              music_bank_id={trackObj.spotifyTrack.id}
              bpm={trackObj.spotifyTrack.audioAnalysisV6.result.bpm}
              dmkey={trackObj.spotifyTrack.audioAnalysisV6.result.key}
              genreTags={trackObj.spotifyTrack.audioAnalysisV6.result.genreTags}
              moodTags={trackObj.spotifyTrack.audioAnalysisV6.result.moodTags}
              arousal={trackObj.spotifyTrack.audioAnalysisV6.result.arousal}
              valence={trackObj.spotifyTrack.audioAnalysisV6.result.valence}
              indexProp={trackObj.spotifyTrack.id}
              tempo=""
              tag_tempo=""
              version="6"
              voice={
                trackObj.spotifyTrack.audioAnalysisV6.result
                  .predominantVoiceGender
              }
            />
          );
        } else {
          // console.log("renderblock - librarry fetchfrom ", fetchFrom);
          if (fetchFrom === "library") {
            return (
              <SpotifySearchBlockCard
                key={trackObj.spotifyTrack.id}
                id={trackObj.spotifyTrack.id}
                cyanite_id={trackObj.spotifyTrack.id}
                music_bank_id={trackObj.spotifyTrack.id}
                bpm={trackObj.spotifyTrack.audioAnalysisV6.result.bpm}
                dmkey={trackObj.spotifyTrack.audioAnalysisV6.result.key}
                genreTags={
                  trackObj.spotifyTrack.audioAnalysisV6.result.genreTags
                }
                moodTags={trackObj.spotifyTrack.audioAnalysisV6.result.moodTags}
                arousal={trackObj.spotifyTrack.audioAnalysisV6.result.arousal}
                valence={trackObj.spotifyTrack.audioAnalysisV6.result.valence}
                indexProp={trackObj.spotifyTrack.id}
                tempo=""
                tag_tempo=""
                version="6"
                voice={
                  trackObj.spotifyTrack.audioAnalysisV6.result
                    .predominantVoiceGender
                }
              />
            );
          } else {
            return (
              <SpotifySearchBlockCard
                key={trackObj.node.id}
                id={trackObj.node.id}
                cyanite_id={trackObj.node.id}
                music_bank_id={trackObj.node.id}
                bpm={trackObj.node.audioAnalysisV6.result.bpm}
                dmkey={trackObj.node.audioAnalysisV6.result.key}
                genreTags={trackObj.node.audioAnalysisV6.result.genreTags}
                moodTags={trackObj.node.audioAnalysisV6.result.moodTags}
                arousal={trackObj.node.audioAnalysisV6.result.arousal}
                valence={trackObj.node.audioAnalysisV6.result.valence}
                indexProp={trackObj.node.id}
                tempo=""
                tag_tempo=""
                version="6"
                voice={
                  trackObj.node.audioAnalysisV6.result.predominantVoiceGender
                }
              />
            );
          }
        }
      } else {
        return (
          <tr>
            {/* <td scope="row">AudioAnalysisV6 not available</td> */}
            <td colSpan={9} style={{ textAlign: "center", padding: "25px" }}>
              This track cannot be processed, try another track...
            </td>
          </tr>
        );
      }
    } else {
      if (trackObj !== undefined && trackObj !== null) {
        let moodTags;
        if (process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER) {
          moodTags =
            trackType === "single"
              ? trackObj?.ampmastertag
                  ?.map((tag) => tag.alternate_tag_name)
                  ?.sort()
              : trackObj?.mood_tags
                  ?.map(
                    (data) =>
                      this.props?.taxonomy?.ampMainMoodTagsIdAndLabelObj[
                        data
                      ] || data
                  )
                  ?.sort();
        } else {
          moodTags =
            trackType === "single"
              ? trackObj?.cyanite?.mood_tags
              : trackObj?.mood_tags;
        }

        return (
          <CyaniteSearchBlockCard
            key={trackObj.id}
            id={trackObj.id}
            cyanite_id={
              trackType === "single"
                ? trackObj?.cyanite?.cyanite_id
                : trackObj?.cyanite_id
            }
            music_bank_id={
              trackType === "single" ? trackObj.id : trackObj?.music_bank_id
            }
            bpm={trackType === "single" ? trackObj.cyanite?.bpm : trackObj.bpm}
            dmkey={
              trackType === "single" ? trackObj.cyanite?.key : trackObj.key
            }
            genreTags={
              trackType === "single"
                ? trackObj.cyanite?.genre_tags?.sort()
                : trackObj.genre_tags?.sort()
            }
            moodTags={moodTags}
            arousal={
              trackType === "single"
                ? trackObj?.cyanite?.arousal
                : trackObj.arousal
            }
            valence={
              trackType === "single"
                ? trackObj.cyanite?.valence
                : trackObj.valence
            }
            indexProp={trackObj.id}
            track_length={trackObj.duration_in_sec}
            track_name={trackObj.title}
            preview_image_url={trackObj.preview_image_url}
            preview_track_url={trackObj.preview_track_url}
            tempo={trackObj.tempo}
            tag_tempo={trackObj.tempo}
            version={
              trackType === "single"
                ? trackObj.cyanite?.version
                : trackObj.version
            }
            voice={
              trackType === "single" ? trackObj.cyanite?.voice : trackObj.voice
            }
          />
        );
      }
    }
  }

  setSearchStatus = (event) => {
    var st = event.target.getAttribute("searchstatus");
    switch (st?.split("-")?.[0]) {
      case "from":
        selfThis.setState({ stSearchFrom: st.split("-")[1] });
        //selfThis.setState({ stSearchTo: st.split("-")[1] });
        break;
      case "to":
        selfThis.setState({ stSearchTo: st.split("-")[1] });
        //selfThis.setState({ stSearchFrom: st.split("-")[1] });
        break;
      default:
        selfThis.setState({ stSearchFrom: "library", stSearchTo: "library" });
        stSearchFrom = stSearchTo = "library";
        break;
    }
    clearSearchResult = true;
    selfThis.setState({ clearSearchResult: true });
  };

  render() {
    const jsonData = this.state.jsonData;
    const trackData = this.state.trackData;

    //if (jsonData == null)
    //    this.updateMatchIdState(this.props.match.params.id)

    combineIdSet =
      combineIdSet === null || combineIdSet === undefined
        ? this.props.match.params.id
        : combineIdSet;

    //if (jsonData == null)
    //this.fetchSimilarTracks(combineIdSet);
    //if (trackData == null)
    // this.getTrackCyaniteData(combineIdSet);

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            <MainLayout>
              <TrackPageHoc
                key={this.state.matchIdSet}
                className="similarity_search_container"
              >
                <div className="st-container" style={{ margin: "0 auto" }}>
                  <div className="st-container-inner">
                    <div className="st-container__custSearch">
                      <div className="st-container__custSearch_lp">
                        <span className="main-subtitle boldFamily">
                          Similarity Search
                        </span>
                      </div>
                      {config.modules.SpotifySearchBox && (
                        <div className="st-container__custSearch_rp">
                          <SpotifySearch3 fromSS={true} />
                        </div>
                      )}

                      <div style={{ clear: "both" }}></div>
                    </div>
                    {/* <h2>Similarity Search</h2> */}
                    <div className="st-filter-header">
                      <div className="st-filter-lp">
                        <p className="st-filter-para">
                          Select a track you want to use as a reference
                        </p>
                        <div className="st-filter-lp-inner">
                          <button
                            className={`st-filter-btn st-btn-spotify ${
                              this.state.stSearchFrom === "spotify"
                                ? "active"
                                : ""
                            }`}
                            searchstatus="from-spotify"
                            onClick={selfThis.setSearchStatus}
                          >
                            <SpotifyIcon /> Spotify
                          </button>
                          <button
                            className={`st-filter-btn st-btn-library ${
                              this.state.stSearchFrom === "library"
                                ? "active"
                                : ""
                            } `}
                            searchstatus="from-library"
                            onClick={selfThis.setSearchStatus}
                          >
                            Library
                          </button>
                        </div>
                      </div>
                      <div className="st-filter-rp-inner st-filter-cp">
                        <div
                          className="st-similar-autosearch"
                          style={{
                            display:
                              this.state.stSearchFrom === "library"
                                ? "block"
                                : "none",
                          }}
                        >
                          {config.modules.removeAlgolia ? (
                            <LibrarySearch
                              setShowDropDown={this.setShowDropDown}
                              setLibTracks={this.setLibTracks}
                            />
                          ) : (
                            <CustomAutocomplete
                              defaultRefinement=""
                              setShowDropDown={this.setShowDropDown}
                            />
                          )}
                          <div
                            style={{
                              display: this.state.showDropDown
                                ? "block"
                                : "none",
                            }}
                          >
                            {config.modules.removeAlgolia
                              ? this.CustomHitsBlockLibrary()
                              : this.CustomHitsBlock()}
                          </div>
                        </div>
                        <div
                          className="st-similar-autosearch spotify"
                          style={{
                            display:
                              this.state.stSearchFrom === "spotify"
                                ? "block"
                                : "none",
                          }}
                        >
                          <SpotifySearch2
                            fetchSimilarFromSpotify={
                              this.fetchSimilarFromSpotify
                            }
                            setShowDropDown={this.setShowDropDown}
                            showDropDown={this.state.showDropDown}
                          />
                        </div>
                      </div>
                      <div className="st-filter-rp">
                        <p className="st-filter-para">Results from</p>
                        <div>
                          <button
                            className={`st-filter-btn st-btn-spotify ${
                              this.state.stSearchTo === "spotify"
                                ? "active"
                                : ""
                            }`}
                            searchstatus="to-spotify"
                            onClick={selfThis.setSearchStatus}
                          >
                            <SpotifyIcon /> Spotify
                          </button>
                          <button
                            className={`st-filter-btn st-btn-library ${
                              this.state.stSearchTo === "library"
                                ? "active"
                                : ""
                            } `}
                            searchstatus="to-library"
                            onClick={selfThis.setSearchStatus}
                          >
                            Library
                          </button>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                    <div
                      className="dataLoading"
                      style={{
                        display: this.state.dataLoading ? "block" : "none",
                        textAlign: "center",
                      }}
                    >
                      <SpinnerDefault />
                      <div style={{ fontSize: "1.8rem", marginTop: "-11px" }}>
                        Track is processing, please wait...
                      </div>
                    </div>
                    {paramID === "NOID" ? (
                      <div className="clearfix"></div>
                    ) : !clearSearchResult ? (
                      this.state.error ? (
                        <h1 style={{ color: "red", padding: "25px" }}>
                          This track cannot be processed, try another track...
                        </h1>
                      ) : jsonData == null ? (
                        <h1
                          style={{
                            color: "var(--color-white)",
                            padding: "25px",
                          }}
                        >
                          Please wait...
                        </h1>
                      ) : jsonData.length <= 0 ? (
                        <h1
                          style={{
                            color: "var(--color-white)",
                            padding: "25px",
                          }}
                        >
                          {jsonDataError}
                        </h1>
                      ) : (
                        <>
                          <div className="clearfix"></div>
                          <div
                            className="mtop50"
                            style={{ overflowY: "hidden", overflowX: "auto" }}
                          >
                            <h2>Reference Track</h2>
                            <div className="mtop20">
                              <table
                                className="table table-bordered table-dark"
                                width="100%"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">BPM</th>
                                    {/* <th scope="col">Time Signature</th> */}
                                    <th scope="col">Dominant Key</th>
                                    <th scope="col">
                                      Predominant Voice Gender
                                    </th>
                                    {/* <th scope="col">Voice Presence Profile</th> */}
                                    <th scope="col">Genre Tags</th>
                                    {/* <th scope="col">EDM Tag</th> */}
                                    <th scope="col">Mood Tags</th>
                                    <th scope="col">Valence Mean</th>
                                    <th scope="col">Arousal Mean</th>
                                    <th scope="col">version</th>
                                    {/* <th scope="col">Actions</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.renderCyaniteSpotifyBlock(
                                    trackData,
                                    "single"
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="mtop50">
                            <h2>Search Results</h2>
                            <div
                              className="mtop20"
                              style={{ overflowY: "hidden", overflowX: "auto" }}
                            >
                              <table
                                className="table table-bordered table-dark"
                                width="100%"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">BPM</th>
                                    {/* <th scope="col">Time Signature</th> */}
                                    <th scope="col">Dominant Key</th>
                                    <th scope="col">
                                      Predominant Voice Gender
                                    </th>
                                    {/* <th scope="col">Voice Presence Profile</th> */}
                                    <th scope="col">Genre Tags</th>
                                    {/* <th scope="col">EDM Tag</th> */}
                                    <th scope="col">Mood Tags</th>
                                    <th scope="col">Valence Mean</th>
                                    <th scope="col">Arousal Mean</th>
                                    <th scope="col">version</th>
                                    {/* <th scope="col">Actions</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* {console.log("jsonData ---", jsonData)} */}
                                  {
                                    //jsonData !== null && jsonData !== "AudioAnalysisV6NotStarted" && jsonData !== "AudioAnalysisV6Enqueued" && jsonData !== "[]" && jsonData !== "Error" ? (
                                    jsonData !== null &&
                                      jsonData !== "[]" &&
                                      jsonData !== "Error" &&
                                      !analysisStates.includes(jsonData) ? (
                                      jsonData.map((track) => (
                                        <>
                                          {selfThis.renderCyaniteSpotifyBlock(
                                            track,
                                            "list"
                                          )}
                                        </>
                                      ))
                                    ) : //) : jsonData === "AudioAnalysisV6NotStarted" || jsonData === "AudioAnalysisV6Enqueued" ? (
                                    analysisStates.includes(jsonData) ? (
                                      <>
                                        <tr>
                                          <td
                                            colSpan={9}
                                            style={{
                                              textAlign: "center",
                                              padding: "25px",
                                            }}
                                          >
                                            {jsonDataError}
                                          </td>
                                        </tr>
                                      </>
                                    ) : jsonData === "Error" ? (
                                      <tr>
                                        <td
                                          colSpan={9}
                                          style={{
                                            textAlign: "center",
                                            padding: "25px",
                                          }}
                                        >
                                          {jsonDataError}
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={9}
                                          style={{
                                            textAlign: "center",
                                            padding: "25px",
                                          }}
                                        >
                                          {jsonDataError}
                                        </td>
                                      </tr>
                                    )
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="clearfix"></div>
                        </>
                      )
                    ) : (
                      <div className="clearfix"></div>
                    )}
                  </div>
                  <div className="clearfix"></div>
                </div>
                {/* <TrackPageFooter /> */}
              </TrackPageHoc>
            </MainLayout>
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

export default withRouterCompat(connect(mapStateToProps, null)(SimilarTracks));

// export default SimilarTracks;
