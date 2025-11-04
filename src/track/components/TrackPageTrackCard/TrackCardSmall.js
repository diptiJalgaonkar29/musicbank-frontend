import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import Audioplayer from "../../../common/components/Audiplayer/AudioPlayer";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import MediaService from "../../../common/services/MediaService";
import { Link } from "react-router-dom";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";
class TrackCardSmall extends Component {
  state = {
    imageData: null,
    loading: true,
    waveFormData: null,
    routeToTrack: false,
  };

  componentDidMount() {
    Promise.all([this.fetchPreviewImage(), this.fetchWaveform()]).then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  fetchPreviewImage() {
    return new Promise((resolve, reject) => {
      MediaService.getImage(this.props.editImageUrl)
        .then((res) => {
          resolve(
            this.setState({
              imageData: res,
            })
          );
        })
        .catch((err) =>
          reject(console.error(err, "something went wrong fetching Image Data"))
        );
    });
  }

  fetchWaveform() {
    return new Promise((resolve, reject) => {
      MediaService.getWaveform(this.props.editTrackUrl)
        .then((res) => {
          resolve(
            this.setState({
              waveformData: res,
            })
          );
        })
        .catch((err) =>
          reject(
            console.error(
              err,
              "something went wrong fetching hte Waveform Data"
            )
          )
        );
    });
  }

  routeToTrack = () => {
    this.setState({
      routeToTrack: true,
    });
  };

  componentWillUnmount() {
    this.setState({
      routeToTrack: true,
    });
  }

  render() {
    const { playingIndex } = this.props;
    let redirect = null;

    if (this.props.idProp && this.state.routeToTrack === true) {
      redirect = <Navigate push to={`/track_page/${this.props.idProp}`} />;
    }

    return (
      <FooterMusicPlayerContext.Consumer>
        {({
          playingAudio,
          setPlayingAudio,
          playPause,
          setPlayList,
          setPlayingIndex,
          setPlayListType,
        }) => (
          <div className="EditTrackCard">
            {redirect}

            <div className="EditTrackCard--left" onClick={this.routeToTrack}>
              {this.state.loading ? (
                <SpinnerDefault />
              ) : (
                <img
                  src={this.state.imageData}
                  className="EditTrackCard__img"
                  alt="Edit Track"
                />
              )}
            </div>
            <div className="EditTrackCard--middle" onClick={this.routeToTrack}>
              <Link
                to={`/track_page/${this.props.indexProp}`}
                className="EditTrackCard--title--link"
              >
                <h3>{this.props.track_name}</h3>
              </Link>
              <div className="EditTrackCard--right">
                <p>
                  {this.props.editTags
                    ? this.props.editTags.map((item, index) => {
                        return (
                          <span key={index}>
                            {index !== 0 && <span>&nbsp;</span>}
                            {!!item && `#${item}`}
                          </span>
                        );
                      })
                    : null}
                </p>
              </div>
            </div>
            <div className="EditTrackCard--audio">
              <Audioplayer
                songUrl={this.props.editTrackUrl}
                track_length={this.props.track_length}
                waveformDataProp={this.state.waveformData}
                index={this.props.indexProp}
                key={this.props.queryID}
                type="Tc"
                active={
                  playingIndex !== null && playingIndex === this.props.indexProp
                }
                trackCardNameProp={this.props.track_name}
                srcUrl={this.props.editImageUrl}
                playingAudio={playingAudio}
                setPlayingAudio={setPlayingAudio}
                playPause={playPause}
                setPlayList={setPlayList}
                setPlayingIndex={setPlayingIndex}
                setPlayListType={setPlayListType}
              />
            </div>
          </div>
        )}
      </FooterMusicPlayerContext.Consumer>
    );
  }
}

export default withRouterCompat(TrackCardSmall);
