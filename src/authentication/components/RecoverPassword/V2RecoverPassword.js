import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { compose } from "redux";
import { recoverPassword } from "../../actions/AuthenticationActions";
import AsyncService from "../../../networking/services/AsyncService";
import "../Register/V2Register.css";
import Cookies from "js-cookie";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = () => ({
  wrapper: {
    width: "80%",
    display: "block", // Fix IE 11 issue.
    ["@media (max-width:1400px)"]: {
      width: "100%",
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    padding: "32px 0px 40px 25px",
    alignItems: "flex-start",
    boxShadow: "none",
    ["@media (max-width:1150px)"]: {
      padding: "32px 0px 40px 25px",
    },
  },
  form: {
    maxWidth: "45rem",
    width: "100%",
    zIndex: 105,
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
  formMessage: {
    color: "var(--color-primary)",
    fontSize: "1.6rem",
    fontWeight: "400",
    margin: "-10px 0px 10px",
    padding: "0",
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
      minWidth: "125px",
    },
  },
  CancelButton: {
    flex: 1,
    minWidth: "145px",
    maxWidth: "170px",
    padding: "10px 20px",
    backgroundColor: "var(--color-register-cancel-btn) ",
    border: "none",
    margin: "20px 0",
    color: "rgb(245, 255, 244)",
    fontSize: "18px",
    borderRadius: "25px",
    cursor: "pointer",
    height: "40px",
    fontWeight: "bold",
    ["@media (max-width:1000px)"]: {
      minWidth: "125px",
    },
  },
  loginButtonWrapper: {
    marginBottom: "2.4rem",
    display: "flex",
    gap: "10px",
  },
});

class V2RecoverPassword extends Component {
  state = {
    email: "",
    message: "",
  };

  handleSubmit = (event) => {
    const { email } = this.state;

    if (email) {
      event.preventDefault();
      this.setState({ message: "Please Wait..." });
      AsyncService.postDataUnauthorized("/users/sendResetPasswordRequest", {
        email: email,
      })
        .then((res) => {
          if (res.data.Status.includes("true")) {
            this.setState({ message: "Please check your email" });
            document.getElementById("email").value = "";
          } else if (res.data.Status.includes("User Not Found")) {
            this.setState({ message: "User Not Found" });
          } else {
            this.setState({ message: "Something Went Wrong!!!!" });
            document.getElementById("email").value = "";
          }
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
          <h1 className={classes.title}>Enter your email or username</h1>
          <h2 className={classes.subtitle}>
            We&#39;ll send you a link to reset your password.
          </h2>
          {!!this.state.message && (
            <h4 className={classes.formMessage}>{this.state.message}</h4>
          )}
          <div className={classes.form}>
            <FormControl margin="normal" fullWidth error={hasError}>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
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
            <div className={classes.loginButtonWrapper}>
              <button
                type="submit"
                onClick={this.handleSubmit}
                className={classes.submitButton}
              >
                Submit
              </button>
              <button
                onClick={this.handleGoBack}
                className={classes.CancelButton}
              >
                Cancel
              </button>
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
)(V2RecoverPassword);
