import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { withStyles } from "@mui/styles";
import qs from "qs";
import React, { Component } from "react";
import { connectScrollTo } from "react-instantsearch-dom";
import { connect } from "react-redux";
import SearchResultsFooter from "../../../common/components/Footer/SearchResultsPageFooter";
import { LazyLoadComponent } from "../../../common/components/LazyLoadComponent/LazyLoadComponent";
import CreatePlaylistModal from "../../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import {
  setResults,
  setSearchState,
} from "../../../redux/actions/searchActions";
import "../../_styles/Accordion.css";
import "../../../_styles/ResponsivenessRetina.css";
import NewSearchDialog from "../../components/Dialog/NewSearchDialog";
import InstrumentalVocalFilter from "../../components/InstrumentalVocalFilter/InstrumentalVocalFilter";
import TrackCard from "../../components/Trackcard/Trackcard";
import SearchResultsPageHoc from "../../layout/SearchResultsPageHoc";
import {
  CurrentRefinementsSection,
  HiddenTagAllRefinement,
  ResultsForText,
  SearchFilters,
} from "./SearchResultsPageFragments";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { connectHits } from "react-instantsearch-dom";
import SpotifySearch3 from "../../../cyanite/components/SpotifySearch3";
import Iframe from "react-iframe";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import { ResponsiveTabletViewCondition768 } from "../../../common/utils/ResponsiveTabletViewCondition";
import { setAllFavTrackIds } from "../../../redux/actions/searchActions/searchActions";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import SearchResultsCard from "../../../cyanite/components/searchResultsCard/SearchResultsCard";
import AsyncService from "../../../networking/services/AsyncService";
import TrackcardV2 from "../../components/TrackcardV2/TrackcardV2";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const { v4: uuidv4 } = require('uuid');
const updateAfter = 700;
const createURL = (state) => `?${qs.stringify(state)}`;
const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : "";

let spotify_library_Ids = [];
let library_library_Ids = [];
var searchType = "";
var tagCategory = "";
var tagParamID = "";

class ScrollTo extends Component {
  componentDidUpdate(prevProps) {
    const { value, hasNotChanged } = this.props;
    if (value !== prevProps.value && !hasNotChanged) {
      this.el.scrollIntoView();
    }
  }

  render() {
    return (
      <div key={'spage--"+Math.random() * 5)'} ref={(ref) => (this.el = ref)}>
        {this.props.children}
      </div>
    );
  }
}

const drawerWidth = "40rem";

const styles = {
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#04070e",
    color: "var(--color-white)",
  },
};

var paramID = "";
var spotifyParamID = "";

class SearchResultsPage extends Component {
  state = {
    query: "",
    typeOfQuery: "",
    refinements: null,
    resultsOnLoad: null,
    loading: true,
    toggle: true,
    preview_image_data: "",
    queryReduxFromState: "",
    uniqueKey: null,
    mobileDrawerOpen: false,
    cyanite_id: "",
    qsParamID: "",
    spotify_library_Ids: [],
    library_library_Ids: [],
    noDataForSpotify: false,
    // likedTrackIds: null,
  };

  componentWillMount() {
    this.getparamData();
    this.getLikedTracks();
  }

  shouldComponentUpdate() {
    //this.getparamData();
    return true;
  }

  componentDidMount() {
    this.getNewId();
    const searchState = this.props.search_state;
    const newState = {
      ...searchState,
      query: this.props.results_for,
    };
    this.props.setSearchState(newState);
    this.getparamData();
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      // console.info("This page is reloaded");
      localStorage.removeItem("trackList");
    } else {
      // console.info("This page is not reloaded");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { SpotifyTrackName } = this.state;
    if (this.props?.match?.params?.id !== prevProps?.match?.params?.id) {
      if (this.props?.match?.params?.id.includes("spt-")) {
        // console.log("spotify id updated");
        this.getparamData();
      }
    }
    if (prevState.SpotifyTrackName !== SpotifyTrackName) {
      this.getparamData();
    }
    if (
      prevProps.search_state.refinementList !==
      this.props.search_state.refinementList
    ) {
      clearTimeout(this.debouncedSetState);
      this.debouncedSetState = setTimeout(() => {
        this.props.navigate(
          searchStateToUrl(this.props, this.props.search_state),
          this.props.search_state
        );
      }, updateAfter);
    }

    if (
      this.props.queryRedux !== prevProps.queryRedux ||
      this.props.newSearch !== prevProps.newSearch
    ) {
      this.setState({
        queryReduxFromState: this.props.queryRedux,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout();
  }

  getLikedTracks() {
    AsyncService.loadData(`favourites/1`).then((res) => {
      var favTracks = res.data.map((data) => {
        return data.fav_data;
      });
      this.props.setAllFavTrackIds(favTracks);
    });
  }

  getparamData() {
    if (Object.keys(this.props.match.params).length > 0) {
      paramID = this.props.match.params.id;
      this.setState({ qsParamID: paramID });
      if (paramID.indexOf("spt-") >= 0) {
        spotifyParamID = paramID.replace("spt-", "");
        searchType = "spotify";
        setTimeout(() => {
          this.getSpotifyToLibraryData(spotifyParamID);
          this.setState({ spotifyParamID: spotifyParamID });
        }, 50);
      } else if (paramID.indexOf("t-") >= 0) {
        var tagDetail = paramID.split("-");
        tagCategory = tagDetail[1];
        tagParamID = tagDetail[2];
        searchType = "tag";
      } else if (paramID.indexOf("lib-") >= 0) {
        var libParamID = paramID.replace("lib-", "");
        searchType = "library";
        setTimeout(() => {
          this.getLibraryToLibraryData(libParamID);
        }, 50);
      } else {
        searchType = "normal";
      }
    }
  }

  getSpotifyToLibraryData(_sptid) {
    AsyncService.loadData(
      `/cyanite/fetchSimilarFromSpotify?spotifyId=${_sptid}&toSearch=library`
    )
      .then((res) => {
        if (
          res.data?.length > 0 &&
          Array.isArray(res.data?.[0]?.body) &&
          res.data?.[0]?.body?.length > 0
        ) {
          spotify_library_Ids = res.data[0].body.map((val) => {
            return val.music_bank_id.toString();
          });
          this.setState({ spotify_library_Ids: spotify_library_Ids });
        } else {
          spotify_library_Ids = [];
          this.setState({ spotify_library_Ids: [] });
        }
      })
      .catch((err) => {
        console.log("error while catching fetchSimilarFromSpotify", err);
        searchType = "normal";
        if (err.response?.status === 502) {
          this.setState({ noDataForSpotify: true });
        }
      });
  }

  getLibraryToLibraryData(cyaniteId) {
    AsyncService.loadData(
      `/cyanite/fetchSimilarFromLibrary?cyaniteId=${cyaniteId}&toSearch=library`
    )
      .then((res) => {
        if (
          res.data?.length > 0 &&
          Array.isArray(res.data?.[0]?.body) &&
          res.data?.[0]?.body?.length > 0
        ) {
          library_library_Ids = res.data[0].body.map((val) => {
            return val.music_bank_id.toString();
          });
          this.setState({ library_library_Ids: library_library_Ids });
        } else {
          library_library_Ids = [];
          this.setState({ library_library_Ids: [] });
        }
      })
      .catch(() => {
        console.log("error while catching fetchSimilarFromLibrary");
      });
  }

  getNewId() {
    let uniqueKey = uuidv4();
    this.setState({
      uniqueKey: uniqueKey,
    });
  }

  setToggle = () => {
    this.setState(({ toggle }) => ({ toggle: !toggle }));
  };

  renderSideBar(_ShowBPMSlider) {
    return (
      <React.Fragment>
        <InstrumentalVocalFilter attribute={"is_instrumental"} />
        <div style={{ display: "none" }}>
          {this.props.newSearch === false ? (
            <HiddenTagAllRefinement
              newSearchID={this.props.newSearchID}
              uniqueKey={this.state.uniqueKey}
              queryReduxFromState={this.state.queryReduxFromState}
              queryRedux={this.props.queryRedux}
            />
          ) : null}
        </div>
        <SearchFilters isShowBPMSlider={_ShowBPMSlider} />
      </React.Fragment>
    );
  }

  toggleDrawer = (e) => {
    if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }

    this.setState({ mobileDrawerOpen: true });
  };
  closeDrawer = () => {
    this.setState({ mobileDrawerOpen: false });
  };

  loadingDone = () => {
    this.setState({ loading: false });
  };

  renderWebVersion(Results, _ShowBPMSlider, config) {
    return (
      <React.Fragment>
        <MainLayout>
          <div
            className={`searchResults__refinements_custom ${
              config.modules.showPageFooter ? "" : "no__footer"
            } ${config.modules.showDisclaimerText ? "" : "no__Disclaimer"} ${
              config.modules?.browseUIV3 ? "browseUIV3" : ""
            }`}
          >
            <div className={`searchResults__refinements `}>
              {this.renderSideBar(_ShowBPMSlider)}
            </div>
            <div className={`searchResults__results`}>
              <div className="searchResults__results--header">
                <div className="searchResults__header__custom">
                  <div className="searchResults__custSearch">
                    {config.modules.SpotifySearchBox && (
                      <div className="searchResults__custSearch_rp">
                        <SpotifySearch3 fromSS={true} />
                      </div>
                    )}
                    <div className="searchResults__custSearch_lp">
                      <div className="searchResults__results--headerTextBox">
                        <NewSearchDialog isShowBPMSlider={_ShowBPMSlider} />
                        <ResultsForText results_for=" " />
                      </div>
                    </div>

                    <div style={{ clear: "both" }}></div>
                  </div>
                  <div className="searchResults__results--refinements">
                    <CurrentRefinementsSection />
                  </div>
                </div>
              </div>

              <div
                className="searchResults__results--body"
                id="searchResults_container"
              >
                <div className="results__hits--cards">
                  <CustomScrollTo>{Results}</CustomScrollTo>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </React.Fragment>
    );
  }

  renderMobileVersion(Results, _ShowBPMSlider) {
    // setTimeout(function () {
    //   let navMobile = document.querySelector('.navbar__container');
    //   let heightNavMobile = navMobile.offsetHeight;
    //   let boxSResult = document.querySelector(
    //     '.searchResults__Mobile__results--header'
    //   );
    //   let heightSResult = boxSResult.offsetHeight;
    //   let height = heightNavMobile + heightSResult + 20;
    //   document.getElementById('searchResultsMobile_container').style.marginTop =
    //     height + 'px';
    // }, 1000);
    setTimeout(function () {
      if (document.querySelector(".searchResults__results--header")) {
        let boxSResult = document.querySelector(
          ".searchResults__results--header"
        );
        let heightSResult = boxSResult?.offsetHeight;
        let height = heightSResult + 20;
        document.getElementById("searchResults_container") &&
          (document.getElementById("searchResults_container").style.marginTop =
            height + "px");
      }
    }, 1000);
    return (
      <React.Fragment>
        <SwipeableDrawer
          anchor="left"
          ModalProps={{ keepMounted: true }}
          classes={{
            paper: this.props.classes.drawerPaper,
          }}
          open={this.state.mobileDrawerOpen}
          onClose={this.closeDrawer}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          {this.renderSideBar(_ShowBPMSlider)}
        </SwipeableDrawer>

        <div className="searchResults__Mobile__results">
          <div className="searchResults__Mobile__results--header">
            <div className="searchResults__results--headerTextBox">
              <NewSearchDialog isShowBPMSlider={_ShowBPMSlider} />
              {this.props.results_for && (
                <ResultsForText results_for={this.props.results_for} />
              )}
            </div>

            <div className="searchResults__results--refinements">
              <div className="ais-ClearRefinements">
                <button
                  className="openFilter-button"
                  onClick={(e) => this.toggleDrawer(e)}
                >
                  &#8592; Open Filter
                </button>
              </div>
              <CurrentRefinementsSection />
            </div>
          </div>

          <div
            className="searchResults__results--body"
            id="searchResultsMobile_container"
          >
            <div className="results__Mobile__hits--cards">
              {" "}
              <ScrollTo>{Results}</ScrollTo>
            </div>

            <SearchResultsFooter />
          </div>
        </div>
      </React.Fragment>
    );
  }

  changeHeightOfContainer(height, config) {
    let footerHeightToReduce = config.modules.showPageFooter ? 0 : 100;
    footerHeightToReduce = config.modules.showDisclaimerText
      ? footerHeightToReduce
      : 50;
    if (config.modules.browseUIV3) {
      footerHeightToReduce += 30;
    }
    document.getElementsByClassName(
      "track_outer_container"
    )[0].style.height = `calc(100vh - ${height - footerHeightToReduce}px)`;
    document.getElementsByClassName(
      "track_inner_container"
    )[0].style.height = `calc(100vh - ${height - footerHeightToReduce}px)`;
  }

  loadSpotifySingleTrackData(_sptid, config) {
    if (_sptid !== undefined && searchType === "spotify") {
      let sptIframe =
        "https://open.spotify.com/embed/track/" + _sptid + "?theme=0";

      if (
        document.getElementsByClassName("track_outer_container").length !== 0
      ) {
        if (document.querySelector(".ais-CurrentRefinements-item")) {
          this.changeHeightOfContainer(446, config);
        } else {
          this.changeHeightOfContainer(400, config);
        }
      }

      return (
        <div className="searchResult_SingleResBlock">
          <span
            className="custSearch_closeBtn"
            onClick={() => {
              this.props.navigate("/search_results_algolia/%3Fquery=");
            }}
          >
            <IconButtonWrapper icon="Close" />
          </span>
          <Iframe
            src={sptIframe}
            width="250px"
            height="80"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
            style={{ borderRadius: "20px !important" }}
          />
        </div>
      );
    }
  }

  loading = true;
  renderSearchResultBlocks(hits, config) {
    if (document.querySelector(".ais-CurrentRefinements-item")) {
      if (
        document.getElementsByClassName("track_outer_container").length !== 0
      ) {
        this.changeHeightOfContainer(336, config);
      }
    }

    var cyaniteId = this.props.match.params.id;

    // if (config.modules.ShuffledTracks) {
    //   hits = hits.sort(() => Math.random() - 0.5);
    // }

    var hitsUpdated = hits;

    if (searchType === "library") {
      var selectedCyaniteId = this.props.match.params.id.substring(4);
      this.selectedTrack = hits.filter((val) => {
        return val.cyanite_id === selectedCyaniteId;
      });
    }

    if (cyaniteId.startsWith("%3Fquery=")) {
      searchType = "normal";
    }

    if (searchType === "spotify") {
      hitsUpdated = hits.filter((val) => {
        return spotify_library_Ids.includes(val.objectID);
      });
    } else if (searchType === "library") {
      hitsUpdated = hits.filter((val) => {
        return library_library_Ids.includes(val.objectID);
      });
    } else if (searchType === "tag") {
      let tag = String(cyaniteId);
      if (tag.startsWith("t-")) {
        let tagsearch = tagParamID; //"Bass";
        hitsUpdated = hits.filter((val) => val.tag_all.includes(tagsearch));
      }
    }

    try {
      if (document.getElementsByClassName("resultCount").length > 0)
        document.getElementsByClassName("resultCount")[0].innerHTML =
          hitsUpdated.length;
      if (spotifyParamID !== "" && this.state.noDataForSpotify) {
        document.getElementsByClassName("resultCount")[0].innerHTML = 0;
      }
    } catch (error) {
      console.log(error);
    }

    if (config.modules.ShuffledTracks) {
      hitsUpdated = hitsUpdated.sort(() => Math.random() - 0.5);
    }

    if (config.modules.showFavourites) {
      hitsUpdated = hitsUpdated.sort(
        (a, b) =>
          Number(this.props.favTracksIds?.includes(b.objectID)) -
            Number(this.props.favTracksIds?.includes(a.objectID)) ||
          a.track_name.localeCompare(b.track_name)
      );
    }

    return (
      <>
        {
          //load single track data from spotify - embed
          this.loadSpotifySingleTrackData(this.state.spotifyParamID, config)
        }
        {searchType === "library" ? (
          this.selectedTrack.length !== 0 ? (
            <div className="searchResult_SingleResBlock">
              <SearchResultsCard
                data_type="library"
                track_name={this.selectedTrack[0].track_name}
                //artist_name={this.selectedTrack[0].artist_name}
                preview_image_url={this.selectedTrack[0].preview_image_url}
              />
              {document.getElementsByClassName("track_outer_container")
                .length !== 0
                ? this.changeHeightOfContainer(395, config)
                : null}
            </div>
          ) : null
        ) : null}

        {searchType === "tag" ? (
          <div
            className="searchResult_SingleResBlock seletedTagContainer"
            id={tagCategory}
          >
            <span className="seletedTag">{tagParamID}</span>

            {document.getElementsByClassName("track_outer_container").length !==
            0
              ? document.querySelector(".ais-CurrentRefinements-item")
                ? this.changeHeightOfContainer(395, config)
                : this.changeHeightOfContainer(337, config)
              : null}
          </div>
        ) : null}

        {spotifyParamID !== "" && this.state.noDataForSpotify ? (
          <div
            style={{
              color: "var(--font-primary-color)",
              fontSize: "15px",
              padding: "5px",
            }}
          >
            <span>No spotify data available</span>
          </div>
        ) : (
          <div className="track_outer_container">
            <div className="track_inner_container">
              {hitsUpdated.map((hitObj, index) => {
                let ampMainMoodTags = [];
                let ampMoodTags = [];
                let sonicLogoMainMoodTags = [];
                let sonicLogoMoodTags = [];
                let tagGenre = [];
                let otherTags = [];
                let emotionTags = [];
                let instrumentTags = [];
                let feelingsTags = [];
                let impactTags = [];
                let motionTags = [];
                let tonalityTags = [];
                let keyTags = [];
                let tempoTags = [];

                if (process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER) {
                  ampMainMoodTags = hitObj?.tag_amp_mainmood_ids || [];
                  ampMoodTags = hitObj?.tag_amp_allmood_ids || [];
                  sonicLogoMainMoodTags =
                    hitObj?.tag_soniclogo_mainmood_ids || [];
                  sonicLogoMoodTags = hitObj?.tag_soniclogo_allmood_ids || [];
                  tagGenre = hitObj?.tag_genre || [];
                  otherTags = [
                    ...(hitObj.tag_key || []),
                    ...([hitObj.tag_tempo] || []),
                  ];
                  keyTags = [hitObj?.tag_key];
                  tempoTags = [hitObj?.tag_tempo];
                  instrumentTags = hitObj?.instrument_ids;
                } else {
                  emotionTags = [
                    ...hitObj.tag_feelings,
                    ...hitObj.tag_impact,
                    ...hitObj.tag_motion,
                    ...hitObj.tag_tonality,
                  ];
                  instrumentTags = hitObj?.tag_instruments;
                  tagGenre = hitObj?.tag_genre;
                  otherTags = tagGenre.concat(
                    hitObj?.tag_key || [],
                    hitObj?.tag_tempo || []
                  );
                  feelingsTags = [...hitObj.tag_feelings];
                  impactTags = [...hitObj.tag_impact];
                  motionTags = [...hitObj.tag_motion];
                  tonalityTags = [...hitObj.tag_tonality];
                  keyTags = [hitObj.tag_key];
                  tempoTags = [hitObj.tag_tempo];
                }
                return (
                  <LazyLoadComponent
                    ref={React.createRef()}
                    defaultHeight={config.modules.browseUIV3 ? 130 : 195}
                    key={`${hitObj?.objectID}-${index}`}
                  >
                    <div className="lload">
                      {config.modules.browseUIV3 ? (
                        <TrackcardV2
                          id={hitObj?.created_at_timestamp}
                          key={hitObj?.created_at_timestamp}
                          indexProp={hitObj?.objectID}
                          cyanite_id={hitObj?.cyanite_id}
                          track_length={hitObj?.duration_in_sec}
                          allTags={hitObj?.tag_all}
                          track_name={hitObj?.track_name}
                          preview_image_url={hitObj?.preview_image_url}
                          preview_track_url={hitObj?.preview_track_url}
                          track_url={hitObj?.track_url}
                          stems_zip_wav_url={hitObj?.stems_zip_wav_url}
                          tempo={hitObj?.tempo}
                          tag_tempo={hitObj?.tag_tempo}
                          cyaniteProfile={config.modules.CyaniteProfile}
                          UpdateUItoV2={config.modules.UpdateUItoV2}
                          emotionTags={emotionTags}
                          instrumentTags={instrumentTags}
                          ampMainMoodTags={ampMainMoodTags}
                          ampMoodTags={ampMoodTags}
                          sonicLogoMainMoodTags={sonicLogoMainMoodTags}
                          sonicLogoMoodTags={sonicLogoMoodTags}
                          otherTags={otherTags}
                          feelingsTags={feelingsTags}
                          impactTags={impactTags}
                          motionTags={motionTags}
                          tonalityTags={tonalityTags}
                          keyTags={keyTags}
                          tempoTags={tempoTags}
                          genreTags={tagGenre}
                          config={config}
                          track_cs_status={hitObj?.trackCSStatus}
                          csToSsStatus={hitObj?.csToSsStatus}
                          track_flaxid={encodeURIComponent(
                            hitObj?.csFlaxTrackId
                          )}
                        />
                      ) : (
                        <TrackCard
                          id={hitObj?.created_at_timestamp}
                          key={hitObj?.created_at_timestamp}
                          indexProp={hitObj?.objectID}
                          cyanite_id={hitObj?.cyanite_id}
                          track_length={hitObj?.duration_in_sec}
                          allTags={hitObj?.tag_all}
                          track_name={hitObj?.track_name}
                          preview_image_url={hitObj?.preview_image_url}
                          preview_track_url={hitObj?.preview_track_url}
                          track_url={hitObj?.track_url}
                          stems_zip_wav_url={hitObj?.stems_zip_wav_url}
                          tempo={hitObj?.tempo}
                          tag_tempo={hitObj?.tag_tempo}
                          cyaniteProfile={config.modules.CyaniteProfile}
                          UpdateUItoV2={config.modules.UpdateUItoV2}
                          emotionTags={emotionTags}
                          instrumentTags={instrumentTags}
                          ampMainMoodTags={ampMainMoodTags}
                          ampMoodTags={ampMoodTags}
                          sonicLogoMainMoodTags={sonicLogoMainMoodTags}
                          sonicLogoMoodTags={sonicLogoMoodTags}
                          otherTags={otherTags}
                          feelingsTags={feelingsTags}
                          impactTags={impactTags}
                          motionTags={motionTags}
                          tonalityTags={tonalityTags}
                          keyTags={keyTags}
                          tempoTags={tempoTags}
                          genreTags={tagGenre}
                          config={config}
                          track_cs_status={hitObj?.trackCSStatus}
                          csToSsStatus={hitObj?.csToSsStatus}
                          track_flaxid={encodeURIComponent(
                            hitObj?.csFlaxTrackId
                          )}
                        />
                      )}
                    </div>
                  </LazyLoadComponent>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }

  render() {
    const { createNewPlaylistDialogOpen } = this.props;

    const Hits = ({ hits }) => {
      if (searchType === "spotify") {
        if (this.state.spotify_library_Ids.length === 0) return null;
      } else if (searchType === "library") {
        if (this.state.library_library_Ids.length === 0) return null;
      }
      if (!hits) {
        return (
          <div className="Hits-loader">
            {(this.loading = false)}
            <SpinnerDefault />
          </div>
        );
      }

      return (
        <BrandingContext.Consumer>
          {({ config }) => (
            <>
              {hits?.length === 0 ? (
                <h2 className="no-result-text">No Results Found</h2>
              ) : (
                <div>{this.renderSearchResultBlocks(hits, config)}</div>
              )}
            </>
          )}
        </BrandingContext.Consumer>
      );
    };

    const CustomHits = connectHits(Hits);
    let Results = <CustomHits />;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <SearchResultsPageHoc>
            <CreatePlaylistModal openProp={createNewPlaylistDialogOpen} />
            {ResponsiveTabletViewCondition768()
              ? this.renderMobileVersion(Results, config.modules.ShowBPMSlider)
              : this.renderWebVersion(
                  Results,
                  config.modules.ShowBPMSlider,
                  config
                )}
          </SearchResultsPageHoc>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const CustomScrollTo = connectScrollTo(ScrollTo);
// Redux connector
const mapDispatchToProps = (dispatch) => {
  return {
    setSearchState: (search_state) => dispatch(setSearchState(search_state)),
    setResults: (result) => dispatch(setResults(result)),
    setAllFavTrackIds: (trackIds) => dispatch(setAllFavTrackIds(trackIds)),
  };
};

const mapStateToProps = (state) => {
  return {
    result: state.search,
    refinement_items: state.refinement_items,
    queryRedux: state.search.search_result,
    results_for: state.search.results_for,
    createNewPlaylistDialogOpen: state.playlist.createNewPlaylistDialog,
    search_state: state.search.search_state,
    newSearch: state.layout.newSearchModalOpen,
    newSearchID: state.layout.id,
    favTracksIds: state.favTracksIds,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchResultsPage));
