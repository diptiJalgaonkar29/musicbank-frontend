import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { compose } from "redux";
import { login } from "../../actions/AuthenticationActions";
import V2AcceptanceSection from "../Acceptance/V2AcceptanceSection";
import InputAdornment from "@mui/material/InputAdornment";
import mailIcon from "../../../static/input-mail-icon.png";
import lockIcon from "../../../static/input-lock-icon.png";
import SplashScreen from "../SplashScreen/SplashScreen";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import Cookies from "js-cookie";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import AsyncService from "../../../networking/services/AsyncService";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = (theme) => ({
  wrapper: {
    width: "80%",
    display: "block", // Fix IE 11 issue.
    // backgroundColor: "red",
    ["@media (max-width:1400px)"]: {
      width: "100%",
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    // backgroundColor: "blue",
    padding: "32px 0px 40px 25px",
    alignItems: "flex-start",
    boxShadow: "none",
    ["@media (max-width:1150px)"]: {
      padding: "32px 0px 40px 25px",
    },
  },
  form: {
    maxWidth: "45rem",
    zIndex: 105,
    // backgroundColor: "green",
  },
  title: {
    fontSize: "4.8rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 0 4rem 0",
  },
  input: {
    fontSize: "1.4rem !important",
    marginTop: "-0.8rem !important",
    backgroundColor: "#e8f0fe",
    color: "black",
    borderRadius: 25,
    height: 35,

    padding: "5px 45px 5px 10px",
    border: "2px solid var(--color-primary)",
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
    fontSize: "1.4rem",
    marginTop: "0px",
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
    minWidth: "145px",
    maxWidth: "170px",
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "var(--color-primary)",
    border: "none",
    margin: "20px 0",
    color: "rgb(245, 255, 244)",
    fontSize: "18px",
    borderRadius: "25px",
    cursor: "pointer",
    height: "40px",
    fontWeight: "bold",
    ["@media (max-width:1000px)"]: {
      // eslint-disable-line no-useless-computed-key
      minWidth: "125px",
    },
  },
  spinnerContainer: {
    scale: 0.6,
    position: "relative",
    bottom: "43px",
  },
  RegisterButton: {
    flex: 1,
    minWidth: "145px",
    maxWidth: "170px",
    padding: "10px 20px",
    backgroundColor: "var(--color-register)",
    border: "none",
    margin: "20px 0",
    color: "rgb(245, 255, 244)",
    fontSize: "18px",
    borderRadius: "25px",
    cursor: "pointer",
    height: "40px",
    fontWeight: "bold",
    ["@media (max-width:1000px)"]: {
      // eslint-disable-line no-useless-computed-key
      minWidth: "125px",
    },
  },
  loginButtonWrapper: {
    marginBottom: "2.4rem",
    display: "flex",
    gap: "10px",
  },
});

class V2Login extends Component {
  state = {
    isLoading: false,
  };
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
    this.setState({ isLoading: true });
    const { login, navigate } = this.props;
    const { username, password } = this.state;

    event.preventDefault();

    if (username && password) {
      this.DBConnect(getSuperBrandId())
        .then((response) => {
          login(username, password).then((res) => {
            this.setState({ isLoading: false });
            navigate("/select-brand");
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.error("error to connect DB : ", err);
        });
    }
  };

  handleGoRegister = () => {
    this.props.navigate("/register");
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
    const { classes, authentication, modules, loginMessages } = this.props;
    const { isLoading } = this.state;
    const hasError = authentication.error !== null;

    return (
      <div className={classes.wrapper}>
        {modules.showSplashScreen && <SplashScreen />}
        <Paper className={classes.paper}>
          <h1 className={classes.title}>
            <FormattedMessage id="auth.login.page.title" />
          </h1>
          <h2 className={classes.subtitle}>
            <FormattedMessage id="auth.login.page.subtitleLogin" />
          </h2>
          <form
            className={classes.form}
            onSubmit={this.handleSubmit}
            onMouseEnter={() => {
              document.getElementById("authLoginFooter") &&
                (document.getElementById("authLoginFooter").style.display =
                  "block");
            }}
          >
            <FormControl margin="normal" fullWidth error={hasError}>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="mail@mail.com"
                autoFocus
                required
                className={classes.input}
                onChange={(event) => {
                  this.setState({
                    username: event.target.value,
                  });
                }}
                startAdornment={
                  <InputAdornment position="end">
                    <img
                      src={mailIcon}
                      style={{
                        height: 20,
                        width: 20,
                        position: "absolute",
                        bottom: "5px",
                        right: "15px",
                      }}
                      alt="mailIcon"
                    />
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl margin="normal" fullWidth error={hasError}>
              <Input
                name="password"
                type="password"
                id="password"
                placeholder="Type in your password"
                required
                autoComplete="current-password"
                className={classes.input}
                onChange={(event) => {
                  this.setState({
                    password: event.target.value,
                  });
                }}
                startAdornment={
                  <InputAdornment position="end">
                    <img
                      src={lockIcon}
                      style={{
                        height: 20,
                        width: 20,
                        position: "absolute",
                        bottom: "5px",
                        right: "15px",
                      }}
                      alt="lockIcon"
                    />
                  </InputAdornment>
                }
              />
              {authentication?.error && (
                <p
                  className={classes.errorLabel}
                  id="form-message"
                  dangerouslySetInnerHTML={{
                    __html: this.getAuthErrorMessage(
                      loginMessages,
                      authentication?.error?.message,
                      authentication?.error?.message
                    ),
                  }}
                />
              )}
            </FormControl>

            <div
              className={classes.recoverPasswordLink}
              style={{ paddingLeft: "15px" }}
            >
              <FormattedMessage id="auth.login.page.forgotPasswordMessage" />{" "}
              &nbsp;
            </div>

            <Link
              to="/recover-password"
              className={classes.recoverPasswordLink}
              style={{ color: "var(--color-primary)" }}
            >
              <FormattedMessage id="auth.login.page.forgotPasswordLink" />
            </Link>

            {modules.AcceptanceSection && <V2AcceptanceSection />}

            <div className={classes.loginButtonWrapper}>
              <button
                type="submit"
                className={classes.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={classes.spinnerContainer}>
                    <SpinnerDefault />
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              {this.props.modules.ShowRegister && (
                <button
                  onClick={this.handleGoRegister}
                  className={classes.RegisterButton}
                >
                  Register
                </button>
              )}
            </div>
          </form>
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
});

export default compose(
  withRouterCompat,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(V2Login);
