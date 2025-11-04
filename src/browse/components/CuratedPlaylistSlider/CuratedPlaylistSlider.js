import React from "react";
import { isMobile } from "react-device-detect";
import Slider from "react-slick";
import "./CuratedPlaylistSlider.css";

const SLIDER_SETTINGS = {
  adaptiveHeight: false,
  variableWidth: true,
  speed: 800,
  infinite: false,
  draggable: isMobile,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const CuratedPlaylistSlider = ({ children }) => {
  return (
    <div className="CuratedPlaylistSlider_container">
      <Slider {...SLIDER_SETTINGS}>{children}</Slider>
    </div>
  );
};
export default CuratedPlaylistSlider;
