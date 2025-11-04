import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import { Link } from "react-router-dom";
import MediaService from "../../../common/services/MediaService";
import PlayListCoverPictue from "../../../playlist/components/MyMusicContent/PlayListCoverPicture/PlayListCoverPictue";

import "./TrackSlideShowItemPlaylist.css";
import getConfigJson from "../../../common/utils/getConfigJson";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

class TrackSlideShowItemPlaylist extends Component {
  state = {
    isLoading: false,
    imageData: null,
    hasError: false,
  };

  componentDidMount() {
    //this.loadImage();
  }

  loadImage() {
    const { playlist } = this.props;
    this.setState({
      isLoading: true,
    });

    MediaService.getImagePlaylist(playlist.cover_image)
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
      <div className="track-slide-show-item-loading-playlist">
        <div className="track-slide-show-item-fallback-playlist" />
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
        <span className="track-slide-show-item-title-playlist">
          {unescape(title)}
        </span>
        {/* {subtitle && <span>{subtitle}</span>} */}
      </>
    );
  }
  static contextType = BrandingContext;
  renderContent() {
    const { playlist } = this.props;

    let ImagesArray = null;

    if (
      Object.entries(playlist).length === 0 &&
      playlist.constructor === Object
    ) {
      //console.log();
    } else {
      ImagesArray = playlist?.tracks
        ?.map((item) => item.preview_image_url)
        ?.splice(0, 4);
    }

    const { jsonConfig: CONFIG } = this.context;
    return (
      <Link
        to={`/mymusic/${playlist.id}/${CONFIG?.brandCuratorMCode}`}
        target="_blank"
        className="track-slide-show-item-playlist"
      >
        <div className="track-slide-show-item-content-playlist">
          <PlayListCoverPictue
            key={playlist.name}
            // className="trackslider_image-playlist"
            imagesData={ImagesArray}
            isUnRegistered={false}
            // style={{ width: "100%", height: "100%", objectFit: "cover" }}
            coverImage={
              playlist.cover_image !== null ? [playlist.cover_image] : ""
            }
            curatorCover={playlist.cover_image !== null ? true : false}
          />
          <br />
          {this.renderCaption(playlist.name)}
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

export default TrackSlideShowItemPlaylist;
