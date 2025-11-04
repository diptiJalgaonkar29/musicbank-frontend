import React, { useState, useEffect } from "react";
import "../Register/V3Register.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useParams, Link, useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { injectIntl } from "react-intl";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import { RedirectToLoginAfterDelay } from './RedirectToLoginAfterDelay';

const RegExForOneUppercaseOneSpecialOneNumbericAndEightCharacters =
  /^(?=.*?[0-9])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).*$/; //  one Number, one Uppercars, one special Character

const setPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      RegExForOneUppercaseOneSpecialOneNumbericAndEightCharacters,
      "Password needs to have at least one uppercase character, one number, and one special character ($&+,:;=?@#|'<>.^*()%!-)"
    )
    .min(8, "Too Short, needs min 8 Characters!")
    .trim()
    .required("Required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords don’t match")
    .trim()
    .required("Required"),
});

const V3SetPassword = (props) => {
  const [message, setmessage] = useState("");
  const [isLinkValid, setIsLinkValid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let { encodedString } = useParams();
  const navigate = useNavigate();

  const getLinkValidity = () => {
    AsyncService.loadDataUnauthorized(
      `/users/linkDurationCheck/${encodedString}`
    )
      .then((res) => {
        setIsLinkValid(res?.data);
      })
      .catch((err) => {
        console.log("Something went wrong", err);
        setmessage(props.intl.messages["auth.setPassword.page.error"]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getLinkValidity();
  }, []);

  return (
    <div className="container" id="set-password-container">
      <h2 className="form-heading boldFamily">
        {props.intl.messages["auth.setPassword.page.title"]}
      </h2>
      <h4 className="form-subHeading">
        {props.intl.messages["auth.setPassword.page.subtitle"]}
      </h4>
      {isLoading ? (
        <h4 className="form-message highlight_text" id="form-message">
          Loading...
        </h4>
      ) : (
        <>
          {!!message ? (
            <h4 className="form-message highlight_text" id="form-message">
              {message}
            </h4>
          ) : (
            <>
              {isLinkValid?.status === "Link_Expired" ? (
                <>
                  {isLinkValid?.loginType === "SSO" ? (
                    <RedirectToLoginAfterDelay />
                  ) : (
                    <div style={{ marginTop: "20px" }}>
                      <h4
                        className="form-message highlight_text"
                        id="form-message"
                      >
                        {
                          props.intl.messages[
                          "auth.setPassword.page.linkExpiredMsg"
                          ]
                        }
                      </h4>
                      {/* <Link
                      to="/recover-password"
                      style={{ textDecoration: "none" }}
                    >
                      <ButtonWrapper>Forgot Password</ButtonWrapper>
                    </Link> */}

                      <div
                        style={{
                          justifyContent: "flex-start",
                          marginTop: "20px",
                        }}
                      >
                        <Link
                          to="/recover-password"
                          style={{ textDecoration: "none" }}
                        >
                          <ButtonWrapper>Forgot Password</ButtonWrapper>
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : isLinkValid === true ? (
                <Formik
                  initialValues={{
                    password: "",
                    confirmpassword: "",
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    AsyncService.postDataUnauthorized(
                      "/users/UserResetPassword",
                      {
                        encoded_str_user: encodedString,
                        password: values.password,
                      }
                    )
                      .then(() => {
                        setmessage(
                          props.intl.messages["auth.setPassword.page.success"]
                        );
                        setTimeout(() => {
                          navigate("/login");
                        }, 3000);
                      })
                      .catch((err) => {
                        console.log("Something went wrong", err);
                        setmessage(
                          props.intl.messages["auth.setPassword.page.error"]
                        );
                      })
                      .finally(() => {
                        setSubmitting(false);
                      });
                  }}
                  validationSchema={setPasswordSchema}
                >
                  {(props) => {
                    const {
                      dirty,
                      isValid,
                      isSubmitting,
                      errors,
                      touched,
                      handleSubmit,
                    } = props;
                    return (
                      <form
                        onSubmit={handleSubmit}
                        id="register-form"
                        className="register-form"
                      >
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Password"
                          component={InputWrapper}
                        />
                        {errors.password && touched.password ? (
                          <div className="error">{errors.password}</div>
                        ) : null}

                        <Field
                          id="confirmpassword"
                          name="confirmpassword"
                          style={{ marginTop: "10px" }}
                          type="password"
                          placeholder="Re-enter your password"
                          component={InputWrapper}
                        />
                        {errors.confirmpassword && touched.confirmpassword ? (
                          <div className="error">{errors.confirmpassword}</div>
                        ) : null}
                        <div
                          className="buttonContainer"
                          style={{ marginTop: "10px" }}
                        >
                          <ButtonWrapper
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                          >
                            {isSubmitting ? (
                              <div className="V3setPassword_spinnerContainer">
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
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default injectIntl(V3SetPassword);
