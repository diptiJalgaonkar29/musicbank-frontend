import React from "react";
import VideoSlider from "./VideoSlider";
import { ResponsiveTabletViewCondition768 } from "../../../common/utils/ResponsiveTabletViewCondition";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

export default function index({ videosProp }) {
  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <>
          {config.modules.showUsedInVideos && (
            <div className="TrackPage__wrapper--usedin">
              <div
                className={
                  ResponsiveTabletViewCondition768()
                    ? "usedin--mobile--specs"
                    : "TrackPage__usedin--headline"
                }
              >
                <div className="TrackPage__wrapper--headline usedin--specs">
                  <h3>Used In: </h3>
                </div>
              </div>

              <VideoSlider videosProp={videosProp} />
            </div>
          )}
        </>
      )}
    </BrandingContext.Consumer>
  );
}
