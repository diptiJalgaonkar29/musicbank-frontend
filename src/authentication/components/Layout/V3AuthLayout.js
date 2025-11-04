import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AuthFooter from "../../../common/components/Footer/AuthFooter";
import {
  ASSET_PATHS,
  checkRightBlockBgImage,
  checkV3WrapperBgImage,
  getBrandAssetPath,
} from "../../../common/utils/getBrandAssetMeta";
import { Tooltip } from "@mui/material";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import "./V3AuthLayout.css";
import RightImageToolTip from "./RightImageToolTip";

const styles = () => ({
  wrapper: {
    // height: "100vh",
    // minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    gap: "100px",
    overflow: "hidden",
    ["@media (max-height:750px)"]: {
      fontSize: "50%",
    },
    ["@media (max-width:1000px)"]: {
      gap: "20px",
    },
    maxWidth: "1920px",
    margin: "0 auto",
  },
  login_left: {
    flex: 1,
    display: "flex",
    // justifyContent: "center",
    zIndex: "100",
    ["@media (max-width: 1600px)"]: {
      flex: 1.25,
    },
  },
  login_left_content: {
    padding: "190px 50px 0px 160px",
    width: "70%",
    display: "block",
    maxWidth: "450px",
    ["@media (max-width:1100px)"]: {
      padding: "190px 30px 0px 100px",
      width: "80%",
    },
    ["@media (max-width:800px)"]: {
      padding: "190px 20px 0px 60px",
      width: "80%",
    },
  },
  login_right: {
    flex: 1,
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  brand_logo: {
    width: "auto",
    height: "80px",
    objectFit: "contain",
  },
  logo_container: {
    width: "100%",
    backgroundColor: "var(--color-card)",
    overflow: "hidden",
    borderRadius: "0px 300px",
    ["@media (max-width: 1600px)"]: {
      borderRadius: "0px 200px",
    },
    ["@media (max-width: 1000px)"]: {
      borderRadius: "0px 150px",
    },
  },
  login_right_img_logo_container: {
    display: "flex",
    alignItems: "end",
    justifyContent: "center",
    height: "575px",
    textAlign: "center",
    ["@media (max-width: 1600px)"]: {
      height: "475px",
    },
    ["@media (max-width: 1100px)"]: {
      height: "425px",
    },
    ["@media (max-width: 950px)"]: {
      height: "400px",
    },
  },
  login_right_img: {
    width: "360px",
    ["@media (max-width: 1600px)"]: {
      width: "300px",
    },
    ["@media (max-width: 1100px)"]: {
      width: "250px",
    },
    ["@media (max-width: 950px)"]: {
      width: "220px",
    },
  },
  Shapes_img: {
    height: "270px",
    width: "300px",
    float: "right",
    ["@media (max-width: 1100px)"]: {
      width: "250px",
    },
    ["@media (max-width: 950px)"]: {
      width: "175px",
    },
    ["@media (max-width: 820px)"]: {
      width: "135px",
      height: "200px",
    },
  },
  shape_circle: {
    backgroundColor: "#636569",
    height: "135px",
    width: "135px",
    borderRadius: "50%",
    marginLeft: "auto",
    display:'none',
    ["@media (max-width: 820px)"]: {
      height: "100px",
      width: "100px",
    },
  },
  Shapes_rect: {
    backgroundColor: "var(--color-primary)",
    width: "100%",
    height: "50%",
    borderTopLeftRadius: "135px",
    display:'none'
  },
  header: {
    color: "var(--color-white)",
    width: "100%",
    textAlign: "left",
    fontSize: "1.8rem",
    lineHeight: "1.8rem",
    boxSizing: "content-box",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "999",
    padding: "40px 0px 0px 60px",
    width: "calc(100% - 60px)",
  },
  footer: {
    width: "100%",
    position: "absolute",
    // bottom: "-70px",
    left: "0",
    height: "70px",
    backgroundColor: "var(--color-bg) ",
    zIndex: 999,
  },
  handleFooterAction: {
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "50vh",
    width: "100%",
  },
});

class V3AuthLayout extends Component {
  state = { hideFooter: true };

  showFooter() {
    this.setState({ hideFooter: false });
  }

  render() {
    const { classes, children } = this.props;

    const bgImagePath = getBrandAssetPath(
      ASSET_PATHS?.AUTH_BACKGROUND_IMAGE_PATH
    );
    const rightBgImagePath = getBrandAssetPath(
      ASSET_PATHS?.AUTH_RIGHT_BLOCK_BG_IMAGE_PATH
    );

    return (
      <div className="V3AuthLayout">
        <div className={classes.header}>
          <img
            className={`${classes.brand_logo} brand_logo`}
            src={getBrandAssetPath(ASSET_PATHS?.NAV_LOGO_PATH)}
            alt="Logo"
          />
        </div>
        <div
          className={`${classes.wrapper} V3AuthLayout_wrapper`}
          style={{
            ...(checkV3WrapperBgImage() && {
              backgroundImage: `url(${bgImagePath})`,
            }),
          }}
        >
          <div
            className={`${classes.login_left} V3AuthLayout_left`}
            onMouseEnter={() => {
              if (this.state.hideFooter) {
                this.showFooter();
              }
            }}
          >
            <main
              className={`${classes.login_left_content} V3AuthLayout_left_content`}
            >
              {children}
            </main>
          </div>
          <div className={`${classes.login_right} V3AuthLayout_right`}>

            <div
              className={`${classes.logo_container} login_right_img_logo_container`}
              style={{
                ...(checkRightBlockBgImage() && {
                  backgroundImage: `url(${rightBgImagePath})`,
                }),
              }}
            >
              <Tooltip
                title={getSuperBrandName() === "shell" ? "Imagined with AI. Young Asian woman in yellow jumper wearing headphones and speaking into a microphone." : null}
                arrow
                // open
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '14px',
                    },
                  },
                }}
              >
                <div className={`${classes.login_right_img_logo_container}`}>
                  <img
                    className={`${classes.login_right_img} login_right_img`}
                    src={getBrandAssetPath(
                      ASSET_PATHS?.AUTH_RIGHT_BLOCK_IMAGE_PATH
                    )}
                    alt="Logo"
                  />
                </div>
                <div className={`${classes.Shapes_img} shapes_img`}>
                  <div className={`${classes.shape_circle} shape_circle`}></div>
                  <div className={`${classes.Shapes_rect} Shapes_rect`}></div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          className={`${classes.footer} V3AuthFooter`}
          id="authFooter"
          style={{
            display: this.state.hideFooter ? "none" : "block",
          }}
        >
          <AuthFooter />
        </div>
        {/* <div
                className={classes.handleFooterAction}
                onMouseEnter={() => {
                  console.log("onMouseEnter");
                  this.showFooter();
                }}
              /> */}
      </div >
    );
  }
}

export default withStyles(styles)(V3AuthLayout);
