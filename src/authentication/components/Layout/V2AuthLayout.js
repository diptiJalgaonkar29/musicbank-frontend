import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AuthFooter from "../../../common/components/Footer/AuthFooter";

const styles = () => ({
  wrapper: {
    marginTop: "60px",
    height: "calc(100vh - 100px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "100px",
    padding: "0px 50px",
    overflow: "hidden",
    ["@media (max-width:1350px)"]: {
      gap: "35px",
    },
    ["@media (max-width:1000px)"]: {
      gap: "20px",
    },
    ["@media (max-height:750px)"]: {
      fontSize: "50%",
      marginTop: "40px",
    },
  },
  login_left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  login_right: {
    flex: 1,
    // justifyContent: "flex-end",
    justifyContent: "center",
    display: "flex",
    // backgroundColor: "red",
  },
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

class V2AuthLayout extends Component {
  state = { hideFooter: true };

  showFooter() {
    this.setState({ hideFooter: false });
  }
  componentDidMount() {
    window.addEventListener("wheel", () => {
      this.showFooter();
    });
  }
  componentWillUnmount() {
    window.removeEventListener("wheel", () => {
      this.showFooter();
    });
  }

  render() {
    const { classes, children } = this.props;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config }) => (
            <div>
              <div>
                <div className={classes.header}>
                  <img
                    className={classes.brand_logo}
                    src={config?.assets?.auth?.authNavLogo || ""}
                    alt="Logo"
                    width="80px"
                    height="80px"
                  />
                </div>
                <div className={classes.wrapper}>
                  <div className={classes.login_left}>{children}</div>
                  <div className={classes.login_right}>
                    <img className={classes.login_right_img} alt="Logo" />
                  </div>
                </div>
                <div
                  className={classes.footer}
                  id="authFooter"
                  style={{
                    display: this.state.hideFooter ? "none" : "block",
                  }}
                >
                  <AuthFooter />
                </div>
                <div
                  className={classes.handleFooterAction}
                  onMouseEnter={() => {
                    this.showFooter();
                  }}
                />
              </div>
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
)(withStyles(styles)(V2AuthLayout));
