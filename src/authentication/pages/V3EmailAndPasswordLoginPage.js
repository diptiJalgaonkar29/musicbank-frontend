import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import AuthFooter from "../../common/components/Footer/AuthFooter";
import Login from "../components/Login/Login";
import V3AuthLayout from "../components/Layout/V3AuthLayout";
import V3EmailAndPasswordLogin from "../components/Login/V3EmailAndPasswordLogin";

const styles = () => ({
  wrapper: {
    backgroundPosition: "center center",
    position: "absolute",
    top: "0px",
    left: "0",
    width: "100vw",
    height: "100%",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ["@media (max-height:580px)"]: {
      height: "auto",
      top: "30px",
    },
  },
});

class V3EmailAndPasswordLoginPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <BrandingContext.Consumer>
        {({ config, messages }) => (
          <>
            {config.modules.UpdateUItoV2 ? (
              <>
                <V3AuthLayout>
                  <V3EmailAndPasswordLogin
                    modules={config.modules}
                    loginMessages={messages?.auth?.login?.page}
                  />
                </V3AuthLayout>
              </>
            ) : (
              <div>
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
              </div>
            )}
          </>
        )}
      </BrandingContext.Consumer>
    );
  }
}

export default withStyles(styles)(V3EmailAndPasswordLoginPage);
