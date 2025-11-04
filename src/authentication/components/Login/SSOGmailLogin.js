import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { compose } from "redux";
import { SSOloginWithGmail, login } from "../../actions/AuthenticationActions";
import SplashScreen from "../SplashScreen/SplashScreen";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider } from "@react-oauth/google";
import AsyncService from "../../../networking/services/AsyncService";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = () => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    // padding: "32px 0px 40px 25px",
    boxShadow: "none",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "400",
    marginBottom: "0.5rem",
    marginTop: "0rem",
    lineHeight: "50px",
  },
  brandTitle: {
    fontSize: "6rem",
    fontWeight: "400",
    marginTop: "0.6rem",
    marginBottom: "0.8rem",
    color: "var(--color-primary)",
  },
  subtitle: {
    fontSize: "1.8rem",
    fontWeight: "400",
    margin: "0 0 3rem 0",
  },
  errorLabel: {
    fontSize: "1.4rem",
    color: "var(--color-error)",
    marginTop: "15px",
  },
  loadingLabel: {
    fontSize: "1.4rem",
    marginTop: "15px",
    color: "var(--color-white)",
  },
  spinnerContainer: {
    scale: 0.6,
    position: "relative",
    bottom: "39px",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
});

class SSOGmailLogin extends Component {
  state = {
    passwordToggle: false,
    isLoading: false,
    errorMessage: "",
    loginStatus: { status: "", contactEmail: "" },
  };

  async DBConnect(superBrandName) {
    try {
      const response = AsyncService.loadDataUnauthorized(
        `/users/selectbrand/${superBrandName}`
      );
      return response.json();
    } catch (error) {
      console.error(`DBConnect error: ${error.message}`);
    }
  }

  SSORegister = (state) => {
    this.props.navigate({
      pathname: "/register",
      // state,
    });
  };

  SSOGmailLogin = (token, email, name) => {
    this.setState({ isLoading: true });
    const { SSOloginWithGmail, navigate } = this.props;
    let brandId = getSuperBrandId();

    this.DBConnect(brandId)
      .then(() => {
        SSOloginWithGmail(token, email)
          .then((res) => {
            // console.log("res**", res?.data);
            this.setState({ isLoading: false });
            navigate("/select-brand");
          })
          .catch((err) => {
            AsyncService.postDataUnauthorized("/users/error_msg", {
              email: `g_sign_${email}`,
            }).then((statusResponse) => {
              // console.log(statusResponse?.data);
              this.setState({ loginStatus: statusResponse?.data });
              if (statusResponse?.data?.status === "user not found") {
                localStorage.setItem(
                  "regUserMeta",
                  JSON.stringify({
                    // id: res?.response?.user_id,
                    name,
                    email,
                  })
                );
                this.SSORegister();
                // this.SSORegister({
                //   name,
                //   email,
                //   errorMessage: this.getAuthErrorMessage(
                //     this.props.loginMessages,
                //     statusResponse?.data?.status,
                //     statusResponse?.data?.contactEmail
                //   ),
                // });
                return;
              }
              this.setState({
                errorMessage: this.getAuthErrorMessage(
                  this.props.loginMessages,
                  statusResponse?.data?.status,
                  statusResponse?.data?.contactEmail
                ),
              });
              this.setState({ isLoading: false });
            });
          });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.error("error to connect DB : ", err);
      });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props?.authentication?.error !== prevProps?.authentication?.error &&
      this.props.authentication?.error !== null
    ) {
      console.log("hasError");
      this.setState({ isLoading: false });
    }
  }

  getAuthErrorMessage = (authMessages, errorMessage, contactEmail) => {
    if (authMessages?.[errorMessage]) {
      return authMessages?.[errorMessage]?.replaceAll(
        "{{adminEmail}}",
        contactEmail
      );
    } else {
      return authMessages?.["default error"];
    }
  };

  render() {
    const { classes, authentication, modules } = this.props;
    const { isLoading, passwordToggle, errorMessage } = this.state;
    const hasError = authentication.error !== null;

    return (
      <div className={`${classes.wrapper} V3_login_container`}>
        {modules.showSplashScreen && <SplashScreen />}
        <Paper className={classes.paper}>
          {modules.showV3LoginUI ? (
            <h1 className={classes.title}>
              <FormattedMessage id="auth.login.page.V3title" />
              <p className={classes.brandTitle}>
                <FormattedMessage id="auth.login.page.V3subtitle" />
              </p>
            </h1>
          ) : (
            <h1 className={classes.title}>
              <FormattedMessage id="auth.login.page.title" />
            </h1>
          )}
          <h2 className={classes.subtitle}>
            <FormattedMessage id="auth.login.page.subtitleLogin" />
          </h2>

          <GoogleOAuthProvider
            clientId="849457559418-00n184ro20488msa5kasreve8qctqds0.apps.googleusercontent.com"
            onScriptLoadError={(err) => {
              console.log("error inside Oauthprovider", err);
            }}
            onScriptLoadSuccess={() => {
              // console.log("oauth script loaded");
            }}
          >
            <div className={classes.buttonContainer}>
              <GoogleLogin
                theme={"filled_black"}
                text={"signin_with"}
                shape={"circle"}
                logo_alignment={"center"}
                width={85}
                click_listener={() =>
                  !!this.state.errorMessage &&
                  this.setState({
                    errorMessage: "",
                  })
                }
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse?.credential);
                  this.SSOGmailLogin(
                    credentialResponse?.credential,
                    decoded?.email,
                    decoded?.name
                  );
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
              <GoogleLogin
                theme={"filled_black"}
                text={"signup_with"}
                shape={"circle"}
                logo_alignment={"center"}
                width={85}
                click_listener={() =>
                  !!this.state.errorMessage &&
                  this.setState({
                    errorMessage: "",
                  })
                }
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse?.credential);
                  this.SSORegister({
                    name: decoded?.name,
                    email: decoded?.email,
                  });
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </GoogleOAuthProvider>
          {!!isLoading && <p className={classes.loadingLabel}>Loading...</p>}
          {!!errorMessage && (
            <p
              className={classes.errorLabel}
              id="form-message"
              dangerouslySetInnerHTML={{
                __html: errorMessage,
              }}
            />
          )}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  SSOloginWithGmail: (token, email) =>
    dispatch(SSOloginWithGmail(token, email)),
});

export default compose(
  withRouterCompat,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(SSOGmailLogin);
