import React from "react";
import { connect } from "react-redux";


import AudioPlayerMini from "../../common/components/AudiplayerMini/AudioPlayerMini";
import MediaService from "../../common/services/MediaService";
import { Link } from "react-router-dom";
import AsyncService from "../../networking/services/AsyncService";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

class TrackMetaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      trackMetaData: null,
      preview_image_url: null,
      preview_image_data: null,
      preview_track_url: null,
      waveformData: null,
      trackTitle: "",
      error: false,
    };
  }

  componentDidMount() {
    // console.log("componentDidMount - TrackMetaPlayer ");
  }

  getTrackMeta() {
    const trackId = this.props.trackId;

    AsyncService.loadData(`/tracks?trackId=${trackId}`)
      .then((res) => {
        this.setState({
          trackMetaData: res.data,
          id: res.data.id,
          preview_image_url: res.data.preview_image_url,
          preview_track_url: res.data.preview_track_url,
          duration_in_sec: res.data.duration_in_sec,
          trackTitle: res.data.title,
        });
        this.getTrackMetaCover();
        this.getTrackTitle();
      })
      .catch(() => {
        console.log("error while catching getTrackMeta ");
      });
  }

  getTrackMetaCover() {
    const { preview_image_url } = this.state;

    if (preview_image_url !== undefined && preview_image_url !== null) {
      Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
        this.setState({
          preview_image_data: res[0],
          loading: false,
        });
      });
    }
  }

  getTrackTitle() {
    const { trackTitle } = this.state;
    this.setState({
      trackTitle: trackTitle,
    });
  }

  render() {
    const trackMetaData = this.state.trackMetaData;
    const playingIndexFromStore = this.props.playingIndex;

    if (trackMetaData == null) this.getTrackMeta();

    return (
      <>
        <div className="st-tbl-logo-text-holder">
          <span className="st-tbl-logo-holder">
            <img
              src={this.state.preview_image_data}
              alt=""
              className="st-tbl-logo"
            />
          </span>
          <AudioPlayerMini
            key={this.state.id}
            songUrl={this.state.preview_track_url}
            track_length={this.state.duration_in_sec}
            index={this.state.id}
            waveformDataProp={this.state.waveformData}
            playFromPicture={this.state.clickedOnImage}
            type="Tc"
            active={
              playingIndexFromStore !== null &&
              playingIndexFromStore === this.state.id
            }
            trackCardNameProp={this.state.trackTitle}
            srcUrl={this.state.preview_image_url}
          />

          <Link
            className="st-tbl-link"
            target="_blank"
            to={`/track_page/${this.props.trackId}`}
            style={{ textDecoration: "none !important" }}
          >
            <span data-track-id={this.props.trackId} className="st-tbl-text">
               {this.state.trackTitle}
            </span>
          </Link>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    search_result: state.search.search_result,
    refinement_items_redux: state.search.refinement_items,
  };
};

export default withRouterCompat(connect(mapStateToProps)(TrackMetaPlayer));
