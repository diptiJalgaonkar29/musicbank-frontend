import React from "react";
import MediaService from "../../../common/services/MediaService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

import "./BasketTrackCard.css";

class BasketTrackCard extends React.Component {
  state = {
    loading: true,
    preview_image_data: null,
  };

  componentDidMount() {
    this.getTrackCover();
  }

  getTrackCover() {
    const { preview_image_url } = this.props;
    if (preview_image_url !== undefined && preview_image_url !== null) {
      if (this.props.data_type === "library") {
        Promise.all([MediaService.getImage(preview_image_url)])
          .then((res) => {
            this.setState({
              preview_image_data: res[0],
              loading: false,
            });
          })
          .catch(() => {
            this.setState({
              loading: false,
            });
          });
      } else {
        this.setState({
          preview_image_data: preview_image_url,
          loading: false,
        });
      }
    }
  }

  render() {
    return (
      <div className="download-Basket-track-card-container">
        <div
          className="st-tbl-logo-holder download-Basket-track-card-left"
          style={{ float: "left" }}
        >
          <img
            src={this.state.preview_image_data}
            alt="-"
            className="st-tbl-logo"
          />
          <div
            className="searchRowImgLoader"
            style={{ display: this.state.loading ? "block" : "none" }}
          >
            <SpinnerDefault />
          </div>
        </div>
        <div className="download-Basket-track-card-right">
          <p className="st-tbl-text trackTitle" title={this.props.track_name}>
            Title : {this.props.track_name}
          </p>
          <p className="st-tbl-text trackTitle" title={this.props.track_name}>
            Media type : {this.props.mediaType}
          </p>

          {this.props.artist_name !== "" && (
            <p
              className="st-tbl-text trackArtist"
              title={this.props.artist_name}
            >
              {this.props.artist_name}
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default BasketTrackCard;
