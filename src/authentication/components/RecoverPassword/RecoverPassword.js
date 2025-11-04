import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { compose } from "redux";
import { Button } from "../../../common/components/Button/Button";
import { recoverPassword } from "../../actions/AuthenticationActions";

import AsyncService from "../../../networking/services/AsyncService";
import Cookies from "js-cookie";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = (theme) => ({
  wrapper: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    [theme.breakpoints.up(500 + theme.spacing(3 * 2))]: {
      width: 750,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  formMessage: {
    color: "var(--color-primary)",
    fontSize: 22,
    margin: 10,
    alignSelf: "center",
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
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    textAlign: "center",
  },
  input: {
    fontSize: "1.6rem",

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
      borderBottom: "1px solid rgba(205, 205, 231,0)",
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
    fontSize: "1.6rem",
    color: "var(--color-error)",
  },
  successLabel: {
    fontSize: "1.6rem",
    color: "var(--color-success)",
  },
  bottom: {
    display: "flex",
  },
});

class RecoverPassword extends Component {
  state = {
    email: "",
    message: "",
    showMessage: false,
  };

  handleSubmit = (event) => {
    const { email } = this.state;

    if (email) {
      event.preventDefault();
      this.setState({ showMessage: true });
      this.setState({ message: "Please Wait..." });
      AsyncService.loadData(
        "/users/sendResetPasswordRequest/" +
          email +
          "?url=" +
          window.location.href
      )
        .then(() => {
          this.setState({ message: "Please check your email" });
          document.getElementById("email").value = "";
        })
        .catch((e) => {
          console.log("error ", e);

          this.setState({ message: "Something Went Wrong!!!!" });
        });
    }
  };

  handleGoBack = () => {
    this.props.navigate("/login");
  };

  render() {
    const { classes, recoverPasswordReducer } = this.props;
    const hasError = recoverPasswordReducer.error !== null;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <h1 className={classes.title}>
            <FormattedMessage id="auth.recoverPassword.page.title" />
          </h1>
          {this.state.showMessage ? (
            <h4 className={classes.formMessage}>{this.state.message}</h4>
          ) : null}
          <div className={classes.form}>
            <FormControl margin="normal" fullWidth error={hasError}>
              <InputLabel className={classes.inputLabel} htmlFor="email">
                <FormattedMessage id="auth.recoverPassword.page.email" />
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                required
                className={classes.input}
                onChange={(event) => {
                  this.setState({
                    email: event.target.value,
                  });
                }}
              />
              {hasError && (
                <FormHelperText className={classes.errorLabel}>
                  {recoverPasswordReducer.error.message}
                </FormHelperText>
              )}
              {recoverPasswordReducer.result && (
                <FormHelperText className={classes.successLabel}>
                  <FormattedMessage id="auth.recoverPassword.page.success" />
                </FormHelperText>
              )}
            </FormControl>
            <div className={classes.bottom}>
              <div>
                <Button
                  text={<FormattedMessage id="app.common.goBack" />}
                  onClick={this.handleGoBack}
                  borderRadius="25px"
                />
              </div>
              <div style={{ marginLeft: "2rem" }}>
                <Button
                  type="submit"
                  text={
                    <FormattedMessage id="auth.recoverPassword.page.resetPassword" />
                  }
                  disabled={!this.state.email}
                  onClick={this.handleSubmit}
                  borderRadius="25px"
                />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  recoverPasswordReducer: state.recoverPassword,
});

const mapDispatchToProps = (dispatch) => ({
  recoverPassword: (email) => dispatch(recoverPassword(email)),
});

export default compose(
  withRouterCompat,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(RecoverPassword);
