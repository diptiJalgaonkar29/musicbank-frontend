import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import AuthFooter from "../../common/components/Footer/AuthFooter";
import Login from "../components/Login/Login";
import V3Login from "../components/Login/V3Login";
import V3AuthLayout from "../components/Layout/V3AuthLayout";
import SSOGmailLogin from "../components/Login/SSOGmailLogin";
import KeycloakV3LoginV3 from "../components/Login/KeycloakV3LoginV3";
import getSuperBrandName from "../../common/utils/getSuperBrandName";

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

class V3LoginPage extends Component {
  static defaultProps = {
    superBrandName: getSuperBrandName(),
  };
  render() {
    const { classes } = this.props;

    return (
      <BrandingContext.Consumer>
        {({ config, messages, osContext, osToken, jsonConfig }) => (
          <>
            {console.log(
              "V3LoginPage::--config, messages, osContext, osToken",
              config,
              messages,
              osContext,
              osToken
            )}
            {config.modules.UpdateUItoV2 ? (
              <>
                <V3AuthLayout>
                  {config.modules.keycloakAuth &&
                  osToken !== null &&
                  osToken !== undefined &&
                  osToken !== "mock-local-token" ? (
                    <KeycloakV3LoginV3
                      jsonConfig={jsonConfig}
                      modules={config.modules}
                      loginMessages={messages?.auth?.login?.page}
                      osContext={osContext}
                      osToken={osToken}
                    />
                  ) : (
                    <>
                      {config.modules.gmailSSOAuth ? (
                        <SSOGmailLogin
                          modules={config.modules}
                          loginMessages={messages?.auth?.login?.page}
                          jsonConfig={jsonConfig}
                        />
                      ) : (
                        <V3Login
                          modules={config.modules}
                          loginMessages={messages?.auth?.login?.page}
                          jsonConfig={jsonConfig}
                        />
                      )}
                    </>
                  )}
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
                    jsonConfig={jsonConfig}
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

export default withStyles(styles)(V3LoginPage);
