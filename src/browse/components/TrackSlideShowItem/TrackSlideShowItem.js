import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import MediaService from "../../../common/services/MediaService";
import "./TrackSlideShowItem.css";

class TrackSlideShowItem extends Component {
  state = {
    isLoading: false,
    imageData: null,
    hasError: false,
  };

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    const { track } = this.props;
    this.setState({
      isLoading: true,
    });
    MediaService.getImage(track.image || track.preview_image_url)
      .then((res) => {
        this.setState({
          imageData: res,
          isLoading: false,
          hasError: false,
        });
      })
      .catch(() => {
        this.setState({
          imageData: null,
          isLoading: false,
          hasError: true,
        });
      });
  }

  renderError() {
    return (
      <div className="track-slide-show-item-loading">
        <div className="track-slide-show-item-fallback" />
        <span>
          <FormattedMessage id="app.common.notFound" />
        </span>
        <span>...</span>
      </div>
    );
  }

  renderCaption(title) {
    return (
      <>
        <span className="track-slide-show-item-title">{title}</span>
      </>
    );
  }

  renderContent() {
    const { track } = this.props;
    const { imageData } = this.state;

    return (
      <Link
        to={`/track_page/${track.id || track.objectID}`}
        target="_self"
        className="track-slide-show-item"
      >
        <div className="track-slide-show-item-content">
          <LazyLoadImage
            className="trackslider_image"
            src={imageData}
            effect="opacity"
          />
          <br />
          {this.renderCaption(track.title || track.track_name)}
        </div>
      </Link>
    );
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return this.renderError();
    }
    return this.renderContent();
  }
}

export default TrackSlideShowItem;
