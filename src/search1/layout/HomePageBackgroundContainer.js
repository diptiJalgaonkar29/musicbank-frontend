import React, { Component } from "react";
import NumberUtils from "../../common/utils/NumberUtils";

class HomePageBackgroundContainer extends Component {
  state = {
    picturSrc: null,
  };

  componentDidMount() {
    this.setRandomBackgroundImage();
  }

  setRandomBackgroundImage() {
    const { config } = this.props;
    const backgroundImages = config.assets?.home?.backgroundImages;
    if (!backgroundImages) return;

    const fallbackImages = config.assets?.home?.backgroundImagesFallback;
    const imageCount = backgroundImages?.length;
    const randomIndex = NumberUtils.getRandomInt(imageCount);

    this.setState({
      picturSrc: `url(${fallbackImages?.[randomIndex]})`,
    });

    const imageLoader = new Image();
    imageLoader.src = backgroundImages?.[randomIndex];

    imageLoader.onload = () => {
      this.setState({
        picturSrc: `url(${backgroundImages?.[randomIndex]})`,
      });
    };
  }

  render() {
    const { children } = this.props;
    const { picturSrc } = this.state;
    return (
      <div
        className="SearchPage__search-section-wrapper"
        style={{
          backgroundImage: picturSrc,
        }}
      >
        {children}
      </div>
    );
  }
}

export default HomePageBackgroundContainer;
