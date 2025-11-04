import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Spinner,
  SpinnerDefault,
} from "../../../common/components/Spinner/Spinner";
import LazyImage from "../../../common/components/LayzloadImage/LazyloadImage";
import MediaService from "../../../common/services/MediaService";

class LatestTrackTrackCard extends Component {
  state = {
    url: null,
    isLoading: true,
  };

  componentDidMount() {
    const { track } = this.props;
    MediaService.getImage(track.preview_image_url).then((res) => {
      this.setState({
        url: res,
        isLoading: false,
      });
    });
  }

  renderLoading() {
    return <SpinnerDefault />;
  }

  renderImage() {
    const { track } = this.props;
    const { url } = this.state;
    return (
      <Link
        to={`/track_page/${track.objectID}`}
        style={{ textDecoration: "none !important" }}
      >
        <LazyImage
          src={url}
          alt="Track Picutre"
          width="100%"
          className="LtTc__cover--img"
        />
      </Link>
    );
  }

  renderTags(tags) {
    return tags.map((item, i) => (
      <span
        style={{ color: "var(--color-white)" }}
        key={i}
      >{`  #${item} `}</span>
    ));
  }

  render() {
    const { track } = this.props;
    const { isLoading } = this.state;
    return (
      <div className="LtTc">
        <div className="LtTc__cover">
          {isLoading ? this.renderLoading() : this.renderImage()}
        </div>
        <div className="LtTc__container">
          <br />
          <h3>{track.track_name}</h3>
          <p>
            Genre :{this.renderTags(track.tag_genre)}
            <br />
            All Tags :{this.renderTags(track.tag_all)}
          </p>
        </div>
      </div>
    );
  }
}

export default LatestTrackTrackCard;
