import React, { useContext, useMemo, useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import "./LoginForm.css";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import { Link, useNavigate } from "react-router-dom";
import V3AcceptanceSection from "../../Acceptance/V3AcceptanceSection";
import { useDispatch } from "react-redux";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import getSuperBrandId from "../../../../common/utils/getSuperBrandId";
import { login } from "../../../actions/AuthenticationActions";
import AsyncService from "../../../../networking/services/AsyncService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { addMFAMeta } from "../../../../redux/actions/authActions/authActions";
import getConfigJson from "../../../../common/utils/getConfigJson";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";

const LoginForm = ({ loginMessages }) => {
  const navigate = useNavigate();
  const [isPasswordToggle, setIsPasswordToggle] = useState(false);
  const [loginStatus, setLoginStatus] = useState({
    status: "",
    contactEmail: "",
  });
  const dispatch = useDispatch();

  const DBConnect = async () => {
    const superBrandId = getSuperBrandId();
    try {
      const response = AsyncService.loadDataUnauthorized(
        `/users/selectbrand/${superBrandId}`
      );
      return response;
    } catch (error) {
      console.error(`DBConnect error: ${error.message}`);
    }
  };

  const setErrorMessage = (username) => {
    AsyncService.postDataUnauthorized("/users/error_msg", {
      email: username,
    }).then((statusResponse) => {
      setLoginStatus(statusResponse?.data);
    });
  };

  const checkForMFA = async (username, password, setSubmitting) => {
    // console.log("username, password", username, password);
    let userMeta = { email: username, password };
    try {
      const response = await AsyncService.postDataUnauthorized(
        "/users/authenticate",
        userMeta
      );
      if (response?.data?.isUserAuthenticated) {
        dispatch(
          addMFAMeta({
            email: username,
          })
        );
        navigate("/verify-mfa");
        return;
      }
      if (!!response?.data?.secretImageUri) {
        dispatch(
          addMFAMeta({
            email: username,
            QRCodeMFABase64: response?.data?.secretImageUri,
          })
        );
        navigate("/verify-mfa");
      } else {
        setErrorMessage(username);
      }
      setSubmitting(false);
    } catch (error) {
      setLoginStatus({ status: "Something went wrong", contactEmail: "" });
      setSubmitting(false);
    }
  };

  const loginAndStoreState = (username, password, setSubmitting) => {
    dispatch(login(username, password))
      .then((result) => {
        console.log("loginAndStoreState:: /select-brand");
        console.log("loginAndStoreState::: result ", result);
        navigate("/select-brand");
      })
      .catch((err) => {
        console.log("Err", err);
        setErrorMessage(username);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const handleSubmit = (values, setSubmitting) => {
    setSubmitting(true);
    const { email: username, password } = values;

    if (username && password) {
      DBConnect()
        .then(() => {
          if (CONFIG?.LOGIN_TYPE?.includes("MFA")) {
            checkForMFA(username, password, setSubmitting);
          } else {
            loginAndStoreState(username, password, setSubmitting);
          }
        })
        .catch((err) => {
          setSubmitting(false);
          console.error("error to connect DB : ", err);
          setLoginStatus({ status: "error" });
        });
    }
  };

  const getAuthErrorMessage = (authMessages, errorMessage, contactEmail) => {
    if (authMessages?.[errorMessage]) {
      return authMessages?.[errorMessage]?.replaceAll(
        "{{adminEmail}}",
        contactEmail
      );
    } else {
      return authMessages?.["default error"];
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        acceptTerms: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          handleSubmit(values, setSubmitting);
        }, 500);
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().trim().required("Required"),
        password: Yup.string().trim().required("Required"),
        acceptTerms: Yup.string().required("Required"),
      })}
    >
      {(props) => {
        const {
          dirty,
          isValid,
          isSubmitting,
          errors,
          touched,
          handleChange,
          handleSubmit,
        } = props;
        return (
          <form onSubmit={handleSubmit} className="login_form">
            <Field
              id="login_email"
              name="email"
              type="text"
              placeholder="Email address"
              component={InputWrapper}
              onChange={(e) => {
                handleChange(e);
                !!loginStatus?.status &&
                  setLoginStatus({
                    status: "",
                    contactEmail: "",
                  });
              }}
            />
            {errors.email && touched.email && (
              <p className="login_form_error_msg">{errors.email}</p>
            )}
            <br />
            <div className="login_password_input">
              <Field
                id="login_password"
                name="password"
                type={isPasswordToggle ? "text" : "password"}
                placeholder="Password"
                component={InputWrapper}
                onChange={(e) => {
                  handleChange(e);
                  !!loginStatus?.status &&
                    setLoginStatus({
                      status: "",
                      contactEmail: "",
                    });
                }}
              />
              <div
                className="eye_icon"
                onClick={() => {
                  setIsPasswordToggle((prev) => !prev);
                }}
              >
                {!isPasswordToggle ? (
                  <FaEyeSlash fontSize={20} color="#757575" />
                ) : (
                  // <IconButtonWrapper icon="EyeOff" />
                  <FaEye fontSize={20} color="#757575" />
                  // <IconButtonWrapper icon="EyeOn" />
                )}
              </div>
            </div>
            {errors.password && touched.password && (
              <p className="login_form_error_msg">{errors.password}</p>
            )}
            <p className="V3LoginForgotPasswordLinkWrapper">
              <Link
                to="/recover-password"
                className={`V3LoginForgotPasswordLink`}
              >
                <FormattedMessage id="auth.login.page.forgotPasswordMessage" />
              </Link>
            </p>

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
                id="form-message"
                dangerouslySetInnerHTML={{
                  __html: getAuthErrorMessage(
                    loginMessages,
                    loginStatus?.status,
                    loginStatus?.contactEmail
                  ),
                }}
              />
            )}

            <div className="login_form_btn_container">
              <ButtonWrapper
                onClick={() => navigate("/register")}
                variant={"primaryOutlined"}
                id="register_btn"
              >
                Register
              </ButtonWrapper>
              <ButtonWrapper
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
              >
                {isSubmitting ? (
                  <div className="spinnerContainer">
                    <SpinnerDefault />
                  </div>
                ) : (
                  "Sign in"
                )}
              </ButtonWrapper>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
