import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { compose } from "redux";
import { Button } from "../../../common/components/Button/Button";
import { login } from "../../actions/AuthenticationActions";
import AcceptanceSection from "../Acceptance/V2AcceptanceSection";
import SplashScreen from "../SplashScreen/SplashScreen";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = (theme) => ({
  wrapper: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    [theme.breakpoints.up(500 + theme.spacing(3 * 2))]: {
      width: 740,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",

    padding: `${theme.spacing(4)}px ${theme.spacing(5)}px ${theme.spacing(
      5
    )}px`,
    alignItems: "center",
    boxShadow: "none",
  },
  form: {
    maxWidth: "39rem",
  },
  title: {
    fontSize: "5.5rem",
    fontWeight: "800",
    marginBottom: "2.4rem",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "4.2rem",
    fontWeight: "400",
    margin: 0,
    color: "rgba(255, 255, 255, 0.7)",
  },
  input: {
    fontSize: "1.6rem",
    // marginTop: 18,
    backgroundColor: "#e8f0fe",
    color: "black",
    borderRadius: 25,
    height: 40,
    border: "none",
    padding: "5px 10px",
    "&::before": {
      borderBottom: "1px solid rgba(255, 255, 255, 0)",
    },
    "&::after": {
      borderBottom: "1px solid rgba(44, 97, 147, 0)",
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      // borderBottomColor: "#cdcde7",
      borderBottom: "1px solid rgba(205, 205, 231,0)",
    },
  },
  inputLabel: {
    color: "rgba(255, 255, 255, 0.7) !important",
    fontSize: "2rem",
    // paddingBottom: 18,
    position: "relative",
    top: 14,
    left: 7,
  },
  errorLabel: {
    fontSize: "1.6rem",
    color: "var(--color-error)",
  },
  recoverPasswordLink: {
    width: "100%",
    textAlign: "end",
    display: "inline-block",
    fontSize: "1.4rem",
    marginTop: "0px",
  },
  loginButtonWrapper: {
    marginBottom: "2.4rem",
    display: "flex",
    justifyContent: "space-around",
  },
  ThermsAndConditions: {
    display: "flex",
  },
});

class Login extends Component {
  handleSubmit = (event) => {
    const { login, navigate } = this.props;
    const { username, password } = this.state;

    event.preventDefault();

    if (username && password) {
      login(username, password).then(() => {
        navigate("/select-brand");
      });
    }
  };

  handleGoRegister = () => {
    this.props.navigate("/register");
  };

  render() {
    const { classes, authentication, modules } = this.props;
    const hasError = authentication.error !== null;

    return (
      <div className={classes.wrapper}>
        {modules.showSplashScreen && <SplashScreen />}
        <Paper className={classes.paper}>
          <h1 className={classes.title}>
            <FormattedMessage id="auth.login.page.title" />
          </h1>
          <h2 className={classes.subtitle}>
            <FormattedMessage id="auth.login.page.subtitle" />
          </h2>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" fullWidth error={hasError}>
              <InputLabel className={classes.inputLabel} htmlFor="username">
                <FormattedMessage id="auth.login.page.email" />
              </InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                required
                className={classes.input}
                onChange={(event) => {
                  this.setState({
                    username: event.target.value,
                  });
                }}
              />
            </FormControl>

            <FormControl margin="normal" fullWidth error={hasError}>
              <InputLabel className={classes.inputLabel} htmlFor="password">
                <FormattedMessage id="auth.login.page.password" />
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                required
                autoComplete="current-password"
                className={classes.input}
                onChange={(event) => {
                  this.setState({
                    password: event.target.value,
                  });
                }}
              />
              {hasError && (
                <FormHelperText className={classes.errorLabel}>
                  <FormattedMessage id="auth.login.page.invalidCredentials" />
                </FormHelperText>
              )}
            </FormControl>

            <Link
              to="/recover-password"
              className={classes.recoverPasswordLink}
            >
              <FormattedMessage id="auth.login.page.forgotPassword" />
            </Link>
            {modules.AcceptanceSection === true && <AcceptanceSection />}

            <div className={classes.loginButtonWrapper}>
              <Button
                type="submit"
                text={<FormattedMessage id="auth.login.page.accept" />}
                borderRadius="25px"
                marginRight="25px"
                width="170px"
              />
              {this.props.showregister && (
                <Button
                  text={"Register"}
                  borderRadius="25px"
                  onClick={this.handleGoRegister}
                  width="170px"
                />
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
)(Login);
