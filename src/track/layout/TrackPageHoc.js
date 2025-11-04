import React from "react";
import { Element } from "react-scroll";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { ResponsiveTabletViewCondition768 } from "../../common/utils/ResponsiveTabletViewCondition";
import IconWrapper from '../../branding/componentWrapper/IconWrapper';
import {  useLocation, useNavigate } from 'react-router-dom';

const UISetV1 = React.lazy(() => import("./UISetV1"));
const UISetV2 = React.lazy(() => import("./UISetV2"));

const ThemeSelector = ({ config, children }) => {
  return (
    <>
      <React.Suspense fallback={<></>}>
        {config.modules.UpdateUItoV2 ? <UISetV2 /> : <UISetV1 />}
      </React.Suspense>
      {children}
    </>
  );
};

export default ({ className, children }) => {
  const navigate = useNavigate()
  const param = useLocation()
  let checkUrl = param?.pathname?.split("/")?.includes("track_page")
  const renderMobileHOC = () => {
    return (
      <div className={`TrackPage__Mobile__container  ${className}`}>
        {/* <NavBar /> */}
        {
          checkUrl && window?.history?.length > 1 ?
            (
              <div className='TrackPage_backBtn' onClick={() => navigate(-1)}>
                <IconWrapper icon={"Back"} />
                <span>
                  Back
                </span>
              </div>
            ) : null
        }
        <Element
          className={`TrackPage__Mobile__wrapper`}
          name="scroll-to-track-detail-page-top"
        >
          {children}
        </Element>
      </div >
    );
  };

  const renderDesktopHOC = () => {
    return (
      <div className={`TrackPage__container ${className}`}>
        {/* <NavBar /> */}
        {
          checkUrl && window?.history?.length > 1 ? (
            <div className='TrackPage_backBtn' onClick={() => navigate(-1)}>
              <IconWrapper icon={"Back"} />
              <span>
                Back
              </span>
            </div>
          ) : null
        }
        < Element
          className={"TrackPage__wrapper"}
          name="scroll-to-track-detail-page-top"
        >
          {children}
        </Element>
      </div >
    );
  };

  return (
    <>
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            <ThemeSelector config={config}>
              {ResponsiveTabletViewCondition768()
                ? renderMobileHOC()
                : renderDesktopHOC()}
            </ThemeSelector>
          </>
        )}
      </BrandingContext.Consumer>
    </>
  );
};