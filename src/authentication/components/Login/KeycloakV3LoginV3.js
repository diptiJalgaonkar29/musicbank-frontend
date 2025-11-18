import React, { Component } from "react";
import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import { FormattedMessage } from "react-intl";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import AsyncService from "../../../networking/services/AsyncService";
import V3AcceptanceSection from "../Acceptance/V3AcceptanceSection";
import { connect } from "react-redux";

//import { Link } from "react-router-dom";
import { compose } from "redux";
import {
  SSOloginWithKeycloak,
  login,
} from "../../actions/AuthenticationActions";
// import KeycloakDataService from "../../../branding/wpp/KeycloakDataService";
import TypographyWrapper from "../../../branding/componentWrapper/TypographyWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import "./KeycloakV3LoginV3.css";

import SplashScreen from "../SplashScreen/SplashScreen";
import RadioWrapper from "../../../branding/componentWrapper/RadioWrapper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import GetOsContextData from "../../../branding/wpp/GetOsContextData";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const styles = (theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    // padding: "32px 0px 40px 25px",
    boxShadow: "none",
    alignItems: "flex-start",
  },
  form: {
    // maxWidth: "85%",
    maxWidth: "100%",
    zIndex: 105,
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
    margin: "0rem",
  },
  inputContainer: {
    marginTop: "8px !important",
    marginBottom: "8px !important",
  },

  input: {
    fontSize: "1.4rem !important",
    // marginTop: "-0.8rem !important",
    backgroundColor: "#e8f0fe",
    color: "black",
    borderRadius: 25,
    height: 45,
    maxWidth: "430px",
    padding: "5px 45px 5px 15px",
    // border: "2px solid var(--color-primary)",
    "&::before": {
      borderBottom: "none !important",
    },
    "&::after": {
      borderBottom: "none !important",
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottom: "none !important",
    },
  },

  inputLabel: {
    color: "rgba(255, 255, 255, 0.7) !important",
    fontSize: "2rem",
    position: "relative",
    top: 14,
    left: 7,
  },
  errorLabel: {
    fontSize: "1.4rem",
    color: "var(--color-error)",
    margin: "15px 15px -10px",
  },
  recoverPasswordLink: {
    textAlign: "end",
    display: "inline-block",
    fontSize: "1.6rem",
    marginTop: "0px",
    color: "var(--color-primary)",
    fontWeight: "700",
  },
  loginButtonWrapper: {
    marginBottom: "2.4rem",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  ThermsAndConditions: {
    display: "flex",
  },
  submitButton: {
    width: "200px",
    // flex: 1,
    padding: "10px 20px",
    backgroundColor: "var(--color-secondary)",
    border: "none",
    margin: "5px 0",
    color: "rgb(245, 255, 244)",
    fontSize: "16px",
    borderRadius: "25px",
    cursor: "pointer",
    height: "48px",
    fontWeight: "bold",
    ["@media (max-width:1200px)"]: {
      minWidth: "150px",
    },
    ["@media (max-width:900px)"]: {
      minWidth: "125px",
    },
  },
  spinnerContainer: {
    scale: 0.6,
    position: "relative",
    bottom: "39px",
  },
  RegisterButton: {
    width: "200px",
    padding: "10px 20px",
    backgroundColor: "var(--color-register)",
    border: "none",
    margin: "5px 0",
    color: "rgb(245, 255, 244)",
    fontSize: "16px",
    borderRadius: "25px",
    cursor: "pointer",
    height: "48px",
    fontWeight: "bold",
    ["@media (max-width:1200px)"]: {
      minWidth: "150px",
    },
    ["@media (max-width:900px)"]: {
      minWidth: "125px",
    },
  },
  loginButtonWrapper: {
    marginBottom: "2.4rem",
    display: "flex",
    gap: "10px",
  },
});

class KeycloakV3LoginV3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      isLoading: false,
      loginStatus: { status: "", contactEmail: "" },
      isBlocked: false,
      osToken: this.props.osToken,
    };
    // console.log("KeycloakV3LoginV3 - constructor", this.props.osToken);
  }

  componentDidMount() {
    const { SSOloginWithKeycloak, navigate } = this.props;
    const brandId =
      BrandingContext._currentValue?.config?.brandId ||
      localStorage.getItem("brandId");
    try {
      this.DBConnect(getSuperBrandId())
        .then((response) => {
          // console.log("keycloakv3loginv3 db connect: ", this.state.osToken);
          if (this.state.osToken !== null) {
            //this.setState({ token: this.state.osToken });

            SSOloginWithKeycloak(this.state.osToken)
              .then((res) => {
                console.log(
                  "KeycloakV3LoginV3-got access - res",
                  res,
                  res?.response?.user_register_status
                );
                if (res && res?.response && res?.response?.status) {
                  //  navigate("/requestforLogin", {
                  //                     state: {
                  //                       status: res?.data?.status,
                  //                       email: res?.data?.email,
                  //                       fullName: res?.response?.userName,
                  //                       contactEmail: res?.response?.contactEmail,
                  //                     },
                  //                   });

                  localStorage.setItem("WPPstatus", res?.response?.status);
                  localStorage.setItem("WPPemail", res?.response?.email);
                  localStorage.setItem("WPPfullName", res?.response?.userName);
                  localStorage.setItem(
                    "WPPcontactEmail",
                    res?.response?.contactEmail
                  );
                  navigate("/requestforLogin"); //, {
                } else if (res?.response?.user_register_status) {
                  console.log(
                    "user_register_status:true called",
                    res?.response?.user_register_status
                  );
                  const savedPath = localStorage.getItem("pathname");
                  console.log("##savedPath", savedPath);
                  if (brandId > 0) {
                    // Get current full URL
                    const currentUrl = document.location.href;
                    console.log("##currentUrl", currentUrl);
                    console.log(
                      "From Predict:",
                      window.APP_FROM_PREDICT_NAVPATH,
                      window.APP_PREDICT_PARAM_TOKEN,
                      window.APP_FROM_PREDICT_HASHPATH
                    );

                    // Remove origin to get pathname + hash
                    //const urlPath = currentUrl.replace(document.location.origin, "");
                    //console.log("##urlPath", urlPath);
                    // Optionally remove leading # if using hash routing
                    //const fullPath = urlPath.startsWith("#") ? urlPath.slice(1): urlPath;
                    const fullPath =
                      window.APP_FROM_PREDICT_HASHPATH.startsWith("#")
                        ? window.APP_FROM_PREDICT_HASHPATH.slice(1)
                        : window.APP_FROM_PREDICT_HASHPATH;

                    console.log("##fullPath", fullPath);

                    if (
                      fullPath.includes("AISearchScreen") ||
                      fullPath.includes("track-download") ||
                      fullPath.includes("select-brand") ||
                      fullPath.includes("predict") ||
                      fullPath.includes("playlist") ||
                      fullPath.includes("projects")
                    ) {
                      navigate(fullPath);
                    } else {
                      navigate(savedPath || "/select-brand");
                    }
                  } else {
                    navigate("/select-brand");
                  }
                } else {
                  // console.log("not registere - set data and go to register");
                  localStorage.setItem(
                    "regUserMeta",
                    JSON.stringify({
                      id: res?.response?.user_id,
                      name: res?.response?.user_full_name,
                      email: res?.response?.user_email,
                    })
                  );
                  navigate("/register");
                }
              })
              .catch((err) => {
                console.log("Err logging kc user to sonic", err?.message);
                try {
                  this.setState({
                    loginStatus: JSON.parse(err?.message),
                    isBlocked: true,
                  });
                  setTimeout(() => {
                    //logout - not work for oscontext
                    //KeycloakDataService.logout();
                  }, 3000);
                } catch (error) {
                  console.log("error", error);
                }
              })
              .finally(() => {
                this.setState({ isLoading: false });
              });
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.error("error to connect DB : ", err);
        });
    } catch (error) {
      console.error("Authentication error:", error);
    }

    //console.log(`%cgetOSContextData::osContextDetails`,"padding:5px 10px; background: #ffaa8c;");
    //const osContextDetails = await GetOsContextData();
    //console.log("osContextDetails", osContextDetails);
  }

  async DBConnect(superBrandName) {
    try {
      AsyncService.loadDataUnauthorized(`/users/selectbrand/${superBrandName}`);
      return "OK";
    } catch (error) {
      console.error(`DBConnect error: ${error.message}`);
    }
  }

  /* handleKCAutPopup = () => {
    const loginUrl = keycloak.createLoginUrl();
    window.open(loginUrl, 'Keycloak Login', 'width=800,height=600');
  } */

  handleLogin = () => {
    // console.log("handle login");
    //KeycloakDataService.login();
  };

  handleLogout = () => {
    // console.log("handle logout");
    // KeycloakDataService.logout();
  };

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
    const { classes, modules, loginMessages } = this.props;
    const { loginStatus } = this.state;
    //console.log("KeycloakV3LoginV3 - render - ", this.props.match?.params?.kcMeta, this.state.isBlocked);

    //if (!!this.props.match?.params?.kcMeta && !this.state.isBlocked) {
    if (!this.state.isBlocked) {
      return (
        <div
          className={`${classes.wrapper} KeycloakV3LoginV3_container`}
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <SpinnerDefault />
        </div>
      );
    }

    return (
      <>
        <div className={`${classes.wrapper} KeycloakV3LoginV3_container`}>
          {modules.showSplashScreen && <SplashScreen />}
          <Paper className={classes.paper}>
            {modules.showV3LoginUI ? (
              <>
                <h1 className={classes.title}>
                  <FormattedMessage id="auth.login.page.V3title" />
                  <p className={classes.brandTitle}>
                    <FormattedMessage id="auth.login.page.V3subtitle" />
                  </p>
                </h1>
                <h2 className={classes.subtitle}>
                  <FormattedMessage id="auth.login.page.subtitleLogin" />
                </h2>
              </>
            ) : (
              <h1 className={classes.title}>
                <FormattedMessage id="auth.login.page.title" />
              </h1>
            )}
            <Formik
              initialValues={{
                acceptTerms: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.handleLogin();
              }}
              validationSchema={Yup.object().shape({
                acceptTerms: Yup.string().required("Required"),
              })}
            >
              {(props) => {
                const {
                  values,
                  dirty,
                  isValid,
                  isSubmitting,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                } = props;
                return (
                  <form
                    onSubmit={handleSubmit}
                    className="login_form"
                    // onSubmit={this.handleLogin}
                    onMouseEnter={() => {
                      document.getElementById("authFooter").style.display =
                        "block";
                    }}
                  >
                    <V3AcceptanceSection>
                      <Field
                        name="acceptTerms"
                        id="login-requirement"
                        type="radio"
                        value="accepted"
                        component={RadioWrapper}
                      />
                    </V3AcceptanceSection>
                    {errors.acceptTerms && touched.acceptTerms && (
                      <p className="login_form_error_msg acceptTerms_error_msg">
                        {errors.acceptTerms}
                      </p>
                    )}
                    {loginStatus?.status && (
                      <p
                        className="login_form_error_msg"
                        dangerouslySetInnerHTML={{
                          __html: this.getAuthErrorMessage(
                            loginMessages,
                            loginStatus?.status,
                            loginStatus?.contactEmail
                          ),
                        }}
                      />
                    )}

                    <div className="keycloack_login_form_btn_container">
                      <ButtonWrapper
                        type="submit"
                        disabled={isSubmitting || !isValid || !dirty}
                      >
                        {isSubmitting ? (
                          <div className="spinnerContainer">
                            <SpinnerDefault />
                          </div>
                        ) : (
                          "Login to Keycloak"
                        )}
                      </ButtonWrapper>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </Paper>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  SSOloginWithKeycloak: (token) => dispatch(SSOloginWithKeycloak(token)),
});

export default compose(
  withRouterCompat,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(KeycloakV3LoginV3);
