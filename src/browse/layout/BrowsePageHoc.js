import qs from "qs"
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import { BrandingContext } from "../../branding/provider/BrandingContext";
import { Button } from "../../common/components/Button/Button";
import Navbar from "../../common/components/Navbar/NavBar";
import {
  setResults,
  setResultsFor,
} from "../../redux/actions/searchActions/index";
import { loadPopular } from "../actions/PopularTracksActions/PopularTracksActions";
import { loadRecentlyAdded } from "../actions/RecentlyAddedTracksActions/RecentlyAddedTracksActions";
//import { loadCurated } from "../actions/CuratedPlaylistActions/CuratedPlaylistsActions";
import TrackSlideShow from "../components/TrackSlideShow/TrackSlideShow";
import TrackSlideShowItem from "../components/TrackSlideShowItem/TrackSlideShowItem";
import "./BrowsePageHoc.css";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

const WebClassNames = {
  container: "browse-container",
  content: "browse-content",
};

const MobileClassNames = {
  container: "browse__Mobile-container",
  content: "browse__Mobile-content",
};

class BrowsePageHoc extends Component {
  componentDidMount() {
    const {
      loadRecentlyAdded,
      loadPopular,
      // loadCurated
    } = this.props;
    loadRecentlyAdded();
    loadPopular();
    //loadCurated();
  }

  renderTracks(tracks) {
    return tracks.map((item, index) => (
      <TrackSlideShowItem key={index} track={item} />
    ));
  }

  renderHeader() {
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div
            className="browse-header"
            style={{
              backgroundImage: `url(${config.assets.browse.backgroundImage})`,
            }}
          >
            <nav className="browse-navbar">
              <Navbar />
            </nav>
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }

  searchAll = () => {
    this.props.setResultsFor(" ");
    this.props.setResults("");
    let searchUrl = this.props.search_url;
    const parsedUrl = qs.parse(searchUrl);

    const newQueryString = {
      ...parsedUrl,
      "?query": "",
    };

    const urlWithNewQuery = qs.stringify(newQueryString);
    this.props.navigate(`/search_results/${urlWithNewQuery}`);
  };

  renderContent() {
    const { recentlyAddedTracks, popularTracks, intl } = this.props;
    return (
      <div
        className={isMobile ? MobileClassNames.content : WebClassNames.content}
      >
        <div className="button_container" onClick={this.searchAll}>
          <Button text="Browse All" marginTop="0px" />
        </div>

        <TrackSlideShow title={`${intl.messages["browse.page.recently"]}`}>
          {this.renderTracks(recentlyAddedTracks)}
        </TrackSlideShow>
        <div>
          <hr className="browse-seperator" />
        </div>
        <TrackSlideShow title={`${intl.messages["browse.page.popular"]}`}>
          {this.renderTracks(popularTracks)}
        </TrackSlideShow>
      </div>
    );
  }

  render() {
    return (
      <div
        className={
          isMobile ? MobileClassNames.container : WebClassNames.container
        }
      >
        {this.renderHeader()}
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  recentlyAddedTracks: state.recentlyAdded.tracks,
  popularTracks: state.popular.tracks,
});

const mapDispatchToProps = (dispatch) => ({
  loadRecentlyAdded: () => dispatch(loadRecentlyAdded()),
  loadPopular: () => dispatch(loadPopular()),
  //loadCurated: () => dispatch(loadCurated()),
  setResults: (result) => dispatch(setResults(result)),
  setResultsFor: (query) => dispatch(setResultsFor(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouterCompat(injectIntl(BrowsePageHoc)));
