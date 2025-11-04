import React, { Component } from "react";
import NumberUtils from "../../../common/utils/NumberUtils";

class ThreeSplitBackgroundWrapper extends Component {
  state = {
    picturSrc: null,
  };

  componentDidMount() {
    this.setRandomBackgroundImage();
  }

  setRandomBackgroundImage() {
    const { config } = this.props;
    const backgroundImages = config.assets?.home?.backgroundImages;
    // console.log("backgroundImages", backgroundImages);
    if (backgroundImages) {
    }
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

    return (
      <div className="SearchPageTS__TitleSection">
        <div
          style={{ color: "var(--color-white)" }}
          className="SearchPageTS__LogoSection"
        ></div>
        {children}
      </div>
    );
  }
}

export default ThreeSplitBackgroundWrapper;
