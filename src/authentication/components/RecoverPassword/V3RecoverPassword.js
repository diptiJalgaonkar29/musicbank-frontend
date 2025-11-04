import Paper from "@mui/material/Paper";
import withStyles from "@mui/styles/withStyles";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import React, { Component } from "react";

import { compose } from "redux";
import AsyncService from "../../../networking/services/AsyncService";
import "../Register/V3Register.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import { injectIntl } from "react-intl";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = () => ({
  paper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "var(--color-white)",
    backgroundColor: "var(--login-background-color)",
    boxShadow: "none",
  },
  form: {
    maxWidth: "100%",
    zIndex: 105,
  },
  title: {
    fontSize: "4rem",
    fontWeight: "400",
    // marginBottom: "0.5rem",
    margin: "0rem",
  },
  subtitle: {
    fontSize: "1.6rem",
    fontWeight: "400",
    margin: "0.5rem 0px 0.8rem",
  },
  formMessage: {
    color: "var(--color-primary)",
    fontSize: "1.6rem",
    fontWeight: "400",
    margin: "5px 0px",
    padding: "0",
  },
  input: {
    fontSize: "1.6rem",
    margin: "9px 0px",
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
    width: "200px",
    padding: "10px 20px",
    backgroundColor: "var(--color-primary)",
    border: "none",
    margin: "3rem 0",
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
  CancelButton: {
    width: "200px",
    padding: "10px 20px",
    backgroundColor: "var(--color-register-cancel-btn) ",
    border: "none",
    margin: "3rem 0",
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
    margin: "2rem 0",
    display: "flex",
    gap: "1.5rem",
  },
});

class V3RecoverPassword extends Component {
  state = {
    message: "",
  };

  handleSubmit = (values, setSubmitting, setFieldError, resetForm) => {
    const { email } = values;

    if (email) {
      AsyncService.postDataUnauthorized("/users/sendResetPasswordRequest", {
        email: email,
      })
        .then((res) => {
          console.log("res", res);
          if (res.data.Status.includes("true")) {
            this.setState({
              message:
                this.props.intl.messages["auth.recoverPassword.page.success"],
            });
            resetForm();
            // setTimeout(() => {
            //   this.props.navigate("/login");
            // }, 3000);
          } else if (res.data.Status === "sso user not allowed") {
            setFieldError(
              "email",
              this.props.intl.messages["auth.recoverPassword.page.sso user"]
            );
          } else if (res.data.Status === "blocked user") {
            setFieldError(
              "email",
              this.props.intl.messages[
                "auth.recoverPassword.page.blocked user"
              ]?.replaceAll("{{adminEmail}}", res.data.contactEmail)
            );
          } else if (res.data.Status.includes("User Not Found")) {
            setFieldError(
              "email",
              this.props.intl.messages[
                "auth.recoverPassword.page.user not found"
              ]
            );
          } else if (res.data.Status === "blocked user") {
            setFieldError(
              "email",
              this.props.intl.messages[
                "auth.recoverPassword.page.blocked user"
              ]?.replaceAll("{{adminEmail}}", res.data.contactEmail)
            );
          } else {
            setFieldError(
              "email",
              this.props.intl.messages["auth.recoverPassword.page.error"]
            );
          }
        })
        .catch((e) => {
          console.log("error ", e);
          setFieldError(
            "email",
            this.props.intl.messages["auth.recoverPassword.page.error"]
          );
        })
        .finally(() => {
          setSubmitting(false);
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
        <div className={classes.paper}>
          <h1 className={`${classes.title} boldFamily authTitle`}>
            {this.props.intl.messages["auth.recoverPassword.page.title"]}
          </h1>
          <p className={`${classes.subtitle} authSubtitle`}>
            {this.props.intl.messages["auth.recoverPassword.page.subtitle"]}
          </p>
          {!!this.state.message ? (
            <>
              <h4 className={classes.formMessage}>{this.state.message}</h4>
              <div className={classes.loginButtonWrapper}>
                <ButtonWrapper onClick={this.handleGoBack} variant="outlined">
                  Cancel
                </ButtonWrapper>
              </div>
            </>
          ) : (
            <>
              <div className={classes.form}>
                <Formik
                  initialValues={{
                    email: "",
                  }}
                  onSubmit={(
                    values,
                    { setSubmitting, setFieldError, resetForm }
                  ) => {
                    setTimeout(() => {
                      this.handleSubmit(
                        values,
                        setSubmitting,
                        setFieldError,
                        resetForm
                      );
                    }, 500);
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email().trim().required("Required"),
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
                      handleReset,
                    } = props;
                    return (
                      <form onSubmit={handleSubmit}>
                        <Field
                          id="Form_email"
                          name="email"
                          type="text"
                          placeholder="Enter Your Email"
                          component={InputWrapper}
                          className={classes.input}
                        />
                        {errors.email && touched.email && (
                          <p
                            className="ss_error_msg"
                            id="form-message"
                            dangerouslySetInnerHTML={{
                              __html: errors.email,
                            }}
                          />
                        )}
                        <div
                          className={`${classes.loginButtonWrapper} buttonContainer`}
                        >
                          <ButtonWrapper
                            onClick={this.handleGoBack}
                            variant="outlined"
                          >
                            Cancel
                          </ButtonWrapper>
                          <ButtonWrapper
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                          >
                            {isSubmitting ? (
                              <div className="V3RecoverPassword_spinnerContainer">
                                <SpinnerDefault />
                              </div>
                            ) : (
                              "Submit"
                            )}
                          </ButtonWrapper>
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(
  compose(withRouterCompat, withStyles(styles))(V3RecoverPassword)
);
