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
import "../Register/V3Register.css";
import Cookies from "js-cookie";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";

const styles = () => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    boxShadow: "none",
  },
  form: {
    maxWidth: "450px",
    width: "100%",
    zIndex: 105,
    marginTop: "10px",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "400",
    marginBottom: "0.5rem",
    marginTop: "0rem",
  },
  subtitle: {
    fontSize: "1.6rem",
    fontWeight: "400",
    margin: "0 0 2rem 0",
  },
  formMessage: {
    color: "var(--color-primary)",
    fontSize: "1.6rem",
    fontWeight: "400",
    margin: "-10px 0px 10px",
    padding: "0",
  },
  loginButtonWrapper: {
    margin: "2.4rem 0",
    display: "flex",
    gap: "10px",
  },
});

class V3RecoverPassword extends Component {
  state = {
    email: "",
    message: "",
  };

  handleSubmit = (event) => {
    const { email } = this.state;

    event.preventDefault();
    if (email) {
      this.setState({ message: "Please Wait..." });
      AsyncService.postDataUnauthorized("/users/sendResetPasswordRequest", {
        email: email,
      })
        .then((res) => {
          // console.log("(res.data", res.data);
          // console.log(
          //   "res.data.Status",
          //   res.data.Status,
          //   res.data.Status.includes("true")
          // );
          if (res.data.Status.includes("true")) {
            this.setState({ message: "Please check your email", email: "" });
          } else if (res.data.Status.includes("User Not Found")) {
            this.setState({ message: "User Not Found" });
          } else {
            this.setState({ message: "Something Went Wrong!!!!", email: "" });
          }
        })
        .catch((e) => {
          // console.log("error ", e);
          this.setState({ message: "Something Went Wrong!!!!" });
        });
    }
  };

  handleGoBack = () => {
    this.props.navigate("/login");
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        {/* <Paper className={classes.paper}>
          <h1 className={classes.title}>Enter your email or username</h1>
          <h2 className={classes.subtitle}>
            We&#39;ll send you a link to reset your password.
          </h2>
          {!!this.state.message && (
            <h4 className={classes.formMessage}>{this.state.message}</h4>
          )}
          <form className={classes.form} onSubmit={(e) => this.handleSubmit(e)}>
            <InputWrapper
              id="recover_email"
              name="email"
              placeholder="Email address"
              // label="Email address"
              variant="filled"
              type="email"
              autoFocus
              required
              value={this.state.email}
              onChange={(event) => {
                this.setState({
                  email: event.target.value,
                });
              }}
            />
            <div className={classes.loginButtonWrapper}>
              <ButtonWrapper
                type="submit"
                className="auth_btn"
                disabled={!this.state.email}
              >
                Submit
              </ButtonWrapper>
              <ButtonWrapper
                onClick={this.handleGoBack}
                className="auth_btn register_cancel_btn"
              >
                Cancel
              </ButtonWrapper>
            </div>
          </form>
        </Paper> */}
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
)(V3RecoverPassword);
