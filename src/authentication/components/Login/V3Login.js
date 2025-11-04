import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { compose } from "redux";
import { login } from "../../actions/AuthenticationActions";
import SplashScreen from "../SplashScreen/SplashScreen";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import AsyncService from "../../../networking/services/AsyncService";
import LoginForm from "./LoginForm/LoginForm";
import getConfigJson from "../../../common/utils/getConfigJson";
import SSOButton from "./SSOButton/SSOButton";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { resetUserMeta } from "../../../redux/actions/userActions/userActions";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = (theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    // padding: "32px 0px 40px 25px",
    boxShadow: "none",
    alignItems: "flex-start",
    width: "100%",
  },
  form: {
    // maxWidth: "85%",
    maxWidth: "100%",
    zIndex: 105,
  },
  title: {
    fontSize: "4rem",
    fontWeight: "400",
    marginBottom: "0rem",
    marginTop: "0rem",
    lineHeight: "50px",
  },
  brandTitle: {
    fontSize: "6rem",
    fontWeight: "400",
    marginTop: "0rem",
    marginBottom: "1rem",
    color: "var(--color-primary)",
  },
  subtitle: {
    fontSize: "1.8rem",
    fontWeight: "400",
    margin: "0 0 3rem 0",
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
    marginBottom: "25px",
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

class V3Login extends Component {
  state = {
    loginStatus: { status: "", contactEmail: "" },
  };

  componentDidMount() {
    const brandassetsFolderName = localStorage.getItem("brandassetsFolderName");
    const superBrandId = getSuperBrandId();
    this.props.resetUserMeta();
    localStorage.removeItem("brandId");
    localStorage.removeItem("brandName");
    //console.log("brandassetsFolderName", brandassetsFolderName);
    //console.log("superBrandId", superBrandId);
    localStorage.setItem("brandassetsFolderName", getSuperBrandId());
    //console.log("brandassetsFolderName****", brandassetsFolderName);
    try {
      document.body.className = getSuperBrandName();
    } catch (error) {
      console.log("error", error);
    }
    if (superBrandId != brandassetsFolderName) {
      location.reload();
    }
  }

  async DBConnect(superBrandName) {
    try {
      const response = AsyncService.loadDataUnauthorized(
        `/users/selectbrand/${superBrandName}`
      );
      return response;
    } catch (error) {
      console.error(`DBConnect error: ${error.message}`);
    }
  }

  handleSubmit = (event) => {
    const { login, navigate } = this.props;
    const { username, password } = this.state;

    // event.preventDefault();

    if (username && password) {
      this.DBConnect(getSuperBrandId())
        .then((response) => {
          login(username, password)
            .then(() => {
              navigate("/select-brand");
            })
            .catch((err) => {
              console.log("Err", err);
              AsyncService.postDataUnauthorized("/users/error_msg", {
                email: username,
              }).then((statusResponse) => {
                // console.log(statusResponse?.data);
                this.setState({ loginStatus: statusResponse?.data });
              });
            });
        })
        .catch((err) => {
          console.error("error to connect DB : ", err);
        });
    }
  };

  handleGoRegister = () => {
    // this.props.navigate("/register");
    const { navigate } = this.props;

    navigate("/register");
  };

  componentDidUpdate(prevProps) {
    if (
      this.props?.authentication?.error !== prevProps?.authentication?.error &&
      this.props.authentication?.error !== null
    ) {
      console.log("hasError");
    }
  }

  render() {
    const { classes, modules, loginMessages, jsonConfig } = this.props;
    const loginTypes = Array.isArray(jsonConfig.LOGIN_TYPE)
      ? jsonConfig.LOGIN_TYPE.flatMap((t) => t.split(","))
      : [];

    return (
      <div className={`${classes.wrapper} V3_login_container`}>
        {modules.showSplashScreen && <SplashScreen />}
        <div className={classes.paper}>
          {modules.showV3LoginUI ? (
            <>
              <p className={`${classes.title} V3LoginTitle`}>
                <FormattedMessage id="auth.login.page.V3title" />
              </p>
              <p className={`${classes.brandTitle} V3LoginBrandTitle`}>
                <FormattedMessage id="auth.login.page.V3subtitle" />
              </p>
            </>
          ) : (
            <p className={`${classes.title} boldFamily V3LoginTitle`}>
              <FormattedMessage id="auth.login.page.title" />
            </p>
          )}
          <p className={`${classes.subtitle} V3LoginSubTitle`}>
            <FormattedMessage id="auth.login.page.subtitleLogin" />
          </p>
          <div
            onMouseEnter={() => {
              document.getElementById("authFooter").style.display = "block";
            }}
            style={{ paddingBottom: "50px", width: "100%" }}
          >
            {loginTypes.includes("SSO") && <SSOButton />}
            {loginTypes.includes("SSO") && loginTypes.includes("Normal") && (
              <div className="separator">or</div>
            )}
            {loginTypes.includes("Normal") && (
              <LoginForm
                history={this.props.navigate}
                loginMessages={loginMessages}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  resetUserMeta: () => dispatch(resetUserMeta()),
});

export default compose(
  withRouterCompat,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(V3Login);
