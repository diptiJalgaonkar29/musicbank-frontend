import React, { Component } from 'react';

import { Navigate } from 'react-router-dom';
import Audioplayer from '../../../common/components/Audiplayer/AudioPlayer';
import { SpinnerDefault } from '../../../common/components/Spinner/Spinner';
import MediaService from '../../../common/services/MediaService';
import { withRouterCompat } from '../../../common/utils/withRouterCompat';

class MobileTrackCardSmall extends Component {
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
          reject(console.error(err, 'something went wrong fetching Image Data'))
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
              'something went wrong fetching the Waveform Data'
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
      <div className="EditTrackCard__Mobile">
        {redirect}

        <div className="EditTrackCard__Mobile--left">
          {this.state.loading ? (
            <SpinnerDefault />
          ) : (
            <img
              onClick={this.routeToTrack}
              src={this.state.imageData}
              className="EditTrackCard__Mobile__img"
              alt="Edit Track"
            />
          )}
        </div>
        <div className="EditTrackCard__Mobile--middle">
          <h3>{this.props.track_name}</h3>

          <p>
            {this.props.editTags
              ? this.props.editTags.map((item, index) => {
                return (
                  <span key={index}>
                    {index !== 0 && <span>&nbsp;</span>}#{item}
                  </span>
                );
              })
              : null}
          </p>
        </div>
        <div className="EditTrackCard__Mobile--audio">
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
          />
        </div>
      </div>
    );
  }
}

export default withRouterCompat(MobileTrackCardSmall);
