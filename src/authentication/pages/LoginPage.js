import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import AuthFooter from "../../common/components/Footer/AuthFooter";
import Login from "../components/Login/Login";
import V2Login from "../components/Login/V2Login";
import V2AuthLayout from "../components/Layout/V2AuthLayout";

const styles = () => ({
  wrapper: {
    marginTop: "80px",
    height: "calc(100vh - 100px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 50px",
    ["@media (max-height:750px)"]: {
      fontSize: "50%",
      marginTop: "40px",
    },
  },
  login_left: {},
  login_right: {},
  login_right_img: {
    width: "90%",
    maxWidth: "600px",
    position: "relative",
    top: "20px",
    paddingRight: "40px",
    left: "0px",
  },
  brand_logo: {
    position: "relative",
    left: "30px",
    height: "80px",
  },
  header: {
    position: "fixed",
    color: "var(--color-white)",
    top: "0",
    left: "0",
    width: "100%",
    textAlign: "left",
    fontSize: "1.8rem",
    lineHeight: "1.8rem",
    boxSizing: "content-box",
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--color-bg)",
    zIndex: "999 ",
  },
  footer: {
    width: "100%",
    height: "70px",
    display: "none",
    backgroundColor: "var(--color-bg) ",
    zIndex: 999,
    position: "relative",
  },
  handleFooterAction: {
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "50vh",
    width: "100%",
  },
});

class LoginPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config, messages }) => (
            <div>
              {config.modules.UpdateUItoV2 ? (
                <V2AuthLayout>
                  <V2Login
                    modules={config.modules}
                    loginMessages={messages?.auth?.login?.page}
                  />
                </V2AuthLayout>
              ) : (
                <div
                  className={classes.wrapper}
                  style={{
                    backgroundImage: `url(${config.assets.auth.backgroundImage}`,
                  }}
                >
                  <Login
                    modules={config.modules}
                    showregister={config.modules.ShowRegister}
                  />
                  <AuthFooter />
                </div>
              )}
            </div>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LoginPage));
