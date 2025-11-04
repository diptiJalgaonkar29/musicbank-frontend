import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import Slider from "react-slick";
import "./TrackSlideShowPlaylist.css";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

const NextArrow = (props) => {
  return <IconButtonWrapper icon="RightArrow" {...props} />;
};

const PrevArrow = (props) => {
  return <IconButtonWrapper icon="LeftArrow" {...props} />;
};

const SLIDER_SETTINGS = {
  adaptiveHeight: false,
  variableWidth: true,
  speed: 800,
  infinite: false,
  slidesToScroll: 2,
  draggable: isMobile,
  slidesToShow: 4,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1488,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1160,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 300,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

class TrackSlideShowPlaylist extends Component {
  render() {
    const { title, children } = this.props;

    return (
      <div>
        <h2> {title} </h2>
        <Slider {...SLIDER_SETTINGS}>{children}</Slider>
      </div>
    );
  }
}

export default TrackSlideShowPlaylist;
