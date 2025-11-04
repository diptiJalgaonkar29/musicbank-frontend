import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import {
  Spinner,
  SpinnerDefault,
} from "../../../common/components/Spinner/Spinner";
import "../../../_styles/LatestTracks.css";
import LatestTracksService from "../../services/LatestTracksService";
import LatestTrackTrackCard from "../LatestTrackTrackCard/LatestTrackTrackCard";

const TRACK_AMOUNT = 3;

class LatestTracks extends Component {
  state = {
    tracks: [],
    isLoading: true,
  };

  componentDidMount() {
    LatestTracksService.getLatest(TRACK_AMOUNT).then((res) => {
      this.setState({
        tracks: res,
        isLoading: false,
      });
    });
  }

  renderLoading() {
    return <SpinnerDefault />;
  }

  renderHeading() {
    return (
      <div className="SearchPage__lastAdded__heading-wrapper">
        <h3>
          <FormattedMessage id="home.page.recently" />
        </h3>
      </div>
    );
  }

  renderTracks() {
    const { tracks } = this.state;
    return tracks.map((track) => {
      return <LatestTrackTrackCard key={track.objectID} track={track} />;
    });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="latestTracks__container">
        {this.renderHeading()}
        {isLoading ? this.renderLoading() : this.renderTracks()}
      </div>
    );
  }
}

export default LatestTracks;
