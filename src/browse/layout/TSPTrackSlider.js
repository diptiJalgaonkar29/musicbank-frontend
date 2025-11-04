import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import { SpinnerDefault } from "../../common/components/Spinner/Spinner";
import {
  setResults,
  setResultsFor,
} from "../../redux/actions/searchActions/index";
import { loadPopular } from "../actions/PopularTracksActions/PopularTracksActions";
import { loadRecentlyAdded } from "../actions/RecentlyAddedTracksActions/RecentlyAddedTracksActions";
import { loadCurated } from "../actions/CuratedPlaylistActions/CuratedPlaylistsActions";
import TrackSlideShow from "../components/TrackSlideShow/TrackSlideShow";
import TrackSlideShowItem from "../components/TrackSlideShowItem/TrackSlideShowItem";
import "./BrowsePageHoc.css";
import TrackSlideShowPlaylist from "../components/TrackSlideShow/TrackSlideShowPlaylist";
import TrackSlideShowItemPlaylist from "../components/TrackSlideShowItem/TrackSlideShowItemPlaylist";
import RecentlyAddedTracks from "../components/RecentlyAddedTracks/RecentlyAddedTracks";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

class TSPTrackSlider extends Component {
  state = {
    Loaded: false,
  };

  componentDidMount() {
    const { loadRecentlyAdded, loadPopular, loadCurated, configModules } =
      this.props;

    if (configModules.UpdateUItoV2) {
      let promiseArr = configModules.removeAlgolia
        ? [loadCurated()]
        : [loadCurated(), loadRecentlyAdded()];
      Promise.all(promiseArr).then(() => {
        this.setState({
          Loaded: true,
        });
      });
    } else {
      let promiseArr = configModules.removeAlgolia
        ? [loadRecentlyAdded()]
        : [loadRecentlyAdded(), loadPopular()];
      Promise.all(promiseArr).then(() => {
        this.setState({
          Loaded: true,
        });
      });
    }
  }

  renderContent() {
    const {
      recentlyAddedTracks,
      popularTracks,
      curatedPlaylists,
      intl,
      configModules,
    } = this.props;
    let curatedPlaylistsResponse = curatedPlaylists?.curatedPlaylists;
    let filteredCuratedPlaylists;
    if (!Array.isArray(curatedPlaylistsResponse)) {
      filteredCuratedPlaylists = [];
    } else {
      filteredCuratedPlaylists = curatedPlaylistsResponse?.filter(
        (item) => item.tracks.length > 0
      );
    }

    return (
      <>
        {configModules.curatorPlaylist &&
          filteredCuratedPlaylists?.length !== 0 && (
            <div className="slider-playlist">
              <TrackSlideShowPlaylist
                title={`${intl.messages["browse.page.curated"]}`}
              >
                {filteredCuratedPlaylists?.map((item, index) => (
                  <TrackSlideShowItemPlaylist key={index} playlist={item} />
                ))}
              </TrackSlideShowPlaylist>
            </div>
          )}

        {configModules.removeAlgolia ? (
          <RecentlyAddedTracks />
        ) : (
          <>
            {recentlyAddedTracks?.length !== 0 && (
              <div className="slider-recentlyAdded">
                <TrackSlideShow
                  title={`${intl.messages["browse.page.recently"]}`}
                >
                  {recentlyAddedTracks?.map((item, index) => (
                    <TrackSlideShowItem key={index} track={item} />
                  ))}
                </TrackSlideShow>
              </div>
            )}
          </>
        )}

        {configModules.popularTracks && popularTracks?.length !== 0 && (
          <TrackSlideShow title={`${intl.messages["browse.page.popular"]}`}>
            {popularTracks?.map((item, index) => (
              <TrackSlideShowItem key={index} track={item} />
            ))}
          </TrackSlideShow>
        )}
      </>
    );
  }

  renderLoadingSection() {
    return (
      <div className="browse__loading">
        <SpinnerDefault />{" "}
      </div>
    );
  }

  render() {
    const { Loaded } = this.state;
    return <>{Loaded ? this.renderContent() : this.renderLoadingSection()}</>;
  }
}

const mapStateToProps = (state) => ({
  recentlyAddedTracks: state.recentlyAdded.tracks,
  popularTracks: state.popular.tracks,
  curatedPlaylists: state.curatedPlaylists,
});

const mapDispatchToProps = (dispatch) => ({
  loadRecentlyAdded: () => dispatch(loadRecentlyAdded()),
  loadPopular: () => dispatch(loadPopular()),
  loadCurated: () => dispatch(loadCurated()),
  setResults: (result) => dispatch(setResults(result)),
  setResultsFor: (query) => dispatch(setResultsFor(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouterCompat(injectIntl(TSPTrackSlider)));
