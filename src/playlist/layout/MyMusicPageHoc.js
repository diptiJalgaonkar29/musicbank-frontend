// HOC IS USED FOR THE LAYOUT OF THE PAGE !
import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import MyMusicSideBar from "../components/MyMusicSideBar/MyMusicSideBar";
import { ResponsiveTabletViewCondition768 } from "../../common/utils/ResponsiveTabletViewCondition";

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

//addition by Trupti-Wits

class MyMusicPageHoc extends Component {
  componentDidMount() {
    // GET ALL PLAYLISTS BY ID => SEND PROPS TO SIDEBAR
    // GET TRACK IDS FROM SPEZIFIC PLAYLIST AFTER USER CLICKED ON PLAYLIST ON SIDEBAR AND FETCH DATA FROM ALGOLIA AND DB AND THEN RENDER THEM ON SCREEN
  }

  renderWebVersion() {
    return <div className="MyMusic__Wrapper">{this.props.children}</div>;
  }

  renderMobileVersion() {
    return (
      <div className="MyMusic__Mobile__Wrapper">{this.props.children}</div>
    );
  }
  render() {
    let isUnregistered = this.props.isUnRegistered;
    return (
      <>
        <BrandingContext.Consumer>
          {({ config }) => (
            <>
              <MainLayout isUnregistered={isUnregistered}>
                <ThemeSelector config={config}>
                  <div className={`MyMusic__container`}>
                    {/* change to hide sidenav */}
                    {config.modules.UpdateUItoV2
                      ? null
                      : !isUnregistered && (
                          <div className="MyMusic__SideBar">
                            <MyMusicSideBar />
                          </div>
                        )}
                    {ResponsiveTabletViewCondition768()
                      ? this.renderMobileVersion()
                      : this.renderWebVersion()}
                  </div>

                  {/* {config.modules.UpdateUItoV2 ? (
                  <div className="MyMusic__footer">
                    <div className="MyMusic__footer__grid__bottom">
                      <TrackPageFooter />
                    </div>
                  </div>
                ) : null} */}
                </ThemeSelector>
              </MainLayout>
            </>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}

export default MyMusicPageHoc;
