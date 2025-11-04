import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import TSPTrackSlider from "../../../browse/layout/TSPTrackSlider";
import "../../../_styles/HomePageHocNew.css";
import ThreeSplitBackground from "./ThreeSplitBackgroundWrapper";
import "./ThreeSplitHomepage.css";
import IntroVideo from "./IntroVideo";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import useReloadOnce from "../../../hooks/useReloadOnce";

const ThreeSplitHomepage = () => {
  //useReloadOnce();
  const { config } = useContext(BrandingContext);
  const isOpen = useSelector((state) => state.search.isOpen);

  const renderTitleSection = (config) => {
    return <ThreeSplitBackground config={config} />;
  };

  const renderSlider = (isOpen, config) => {
    return (
      <div
        className={
          isOpen
            ? "SearchPageTS__SliderSection extended"
            : "SearchPageTS__SliderSection"
        }
      >
        <div className="SearchPageTS__TrackSection">
          <TSPTrackSlider configModules={config.modules} />
        </div>
      </div>
    );
  };

  console.log("ThreeSplitHomepage render");

  return (
    <MainLayout>
      {config.modules.ShowIntroVideo && <IntroVideo />}
      <div className="SearchPageTS__container">
        <div className="SearchPageTS__ContentWrapper SearchPageTS__ContentWrapper__Custom">
          {renderTitleSection(config)}
          {renderSlider(isOpen, config)}
        </div>
      </div>
    </MainLayout>
  );
};

export default ThreeSplitHomepage;
