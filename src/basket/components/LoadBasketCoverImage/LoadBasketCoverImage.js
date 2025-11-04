import React from "react";
import "./LoadBasketCoverImage.css";
import MediaService from "../../../common/services/MediaService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

class LoadBasketCoverImage extends React.Component {
  state = {
    loading: true,
    preview_image_data: null,
  };

  componentDidMount() {
    setTimeout(() => {
      this.getTrackCover();
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.trackList !== prevProps.trackList) {
      this.getTrackCover();
    }
  }

  getTrackCover() {
    const { preview_image_url } = this.props;
    if (preview_image_url !== undefined && preview_image_url !== null) {
      if (this.props.data_type === "library") {
        Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
          this.setState({
            preview_image_data: res[0],
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
      <>
        <div className="Load-basket-cover-image-container">
          {this.state.loading ? (
            <SpinnerDefault />
          ) : (
            <img src={this.state.preview_image_data} alt="" />
          )}
        </div>
      </>
    );
  }
}

export default LoadBasketCoverImage;
