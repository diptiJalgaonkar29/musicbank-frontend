import React, { useEffect } from "react";
import "./VerificationMFAPage.css";
import V3AuthLayout from "../../components/Layout/V3AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import "../../components/Register/V3Register.css";
import { useNavigate } from "react-router-dom";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import { loginWithMFA } from "../../actions/AuthenticationActions";
import {
  addMFAMeta,
  removeMFAMeta,
} from "../../../redux/actions/authActions/authActions";
import AsyncService from "../../../networking/services/AsyncService";

const VerificationMFAPage = (props) => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { metaMFA } = useSelector((state) => state.authentication);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  // useEffect(() => {
  //   if (!metaMFA?.email) handleGoToLogin();
  //   return () => dispatch(removeMFAMeta());
  // }, [metaMFA?.email]);

  const handleSubmit = (values, setSubmitting, setErrors) => {
    dispatch(
      loginWithMFA({
        email: metaMFA?.email,
        code: values?.verificationCode,
      })
    )
      .then(() => {
        setSubmitting(false);
        dispatch(removeMFAMeta());
        navigate("/select-brand");
      })
      .catch(() => {
        setSubmitting(false);
        setErrors({ onSubmit: "Wrong OTP, Please try again!" });
      });
  };

  const setUpMFA = (email) => {
    const userMeta = {
      email,
    };
    AsyncService.postDataUnauthorized("/users/reAuthenticate", userMeta).then(
      (response) => {
        if (!!response?.data?.secretImageUri) {
          dispatch(
            addMFAMeta({
              email: metaMFA?.email,
              QRCodeMFABase64: response?.data?.secretImageUri,
            })
          );
        }
      }
    );
  };

  const isUserRegisterd = !metaMFA?.QRCodeMFABase64;

  return (
    <V3AuthLayout>
      <div className="container VerificationMFAPage_wrapper">
        <div className="container VerificationMFAPage_container">
          <h2 className="form-heading boldFamily">
            {
              props.intl.messages[
                isUserRegisterd
                  ? "auth.verifyMFA.page.OTPTitle"
                  : "auth.verifyMFA.page.qrCodeTitle"
              ]
            }
          </h2>
          <p className="form-subHeading">
            {
              props.intl.messages[
                isUserRegisterd
                  ? "auth.verifyMFA.page.OTPSubtitle"
                  : "auth.verifyMFA.page.qrCodeSubtitle"
              ]
            }
          </p>
          {!isUserRegisterd && (
            <img
              src={metaMFA?.QRCodeMFABase64}
              alt="qr_code"
              className="VerificationMFAPage_qr_code"
              onError={handleGoToLogin}
            />
          )}
          <Formik
            initialValues={{
              verificationCode: "",
            }}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              handleSubmit(values, setSubmitting, setErrors);
            }}
            validationSchema={Yup.object().shape({
              verificationCode: Yup.string()
                .trim()
                .min(6, "Must be exactly 6 digits")
                .max(6, "Must be exactly 6 digits")
                .required("Required"),
            })}
          >
            {(formikProps) => {
              const {
                dirty,
                isValid,
                isSubmitting,
                errors,
                setFieldValue,
                handleSubmit,
              } = formikProps;
              return (
                <form
                  onSubmit={handleSubmit}
                  className="VerificationMFAPage_form"
                >
                  {!isUserRegisterd && (
                    <p className="form-subHeading">
                      {props.intl.messages["auth.verifyMFA.page.OTPSubtitle"]}
                    </p>
                  )}
                  <Field
                    name="verificationCode"
                    type="text"
                    placeholder="XXXXXX"
                    className="VerificationMFAPage_code_input"
                    component={InputWrapper}
                    autoComplete="off"
                    autoFocus
                    onKeyDown={(e) => {
                      if (
                        isNaN(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                        return;
                      }
                      setFieldValue("verificationCode", e.target.value?.trim());
                    }}
                  />
                  {errors.verificationCode && dirty && (
                    <p className="VerificationMFAPage_error_msg">
                      {errors.verificationCode}
                    </p>
                  )}
                  {errors.onSubmit && (
                    <p className="VerificationMFAPage_error_msg">
                      {errors.onSubmit}
                    </p>
                  )}
                  <div className="VerificationMFAPage_btn_container">
                    <ButtonWrapper variant="outlined" onClick={handleGoToLogin}>
                      Cancel
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
                        "Submit"
                      )}
                    </ButtonWrapper>
                    {isUserRegisterd && (
                      <ButtonWrapper onClick={() => setUpMFA(metaMFA?.email)}>
                        Set up 2FA
                      </ButtonWrapper>
                    )}
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </V3AuthLayout>
  );
};

export default injectIntl(VerificationMFAPage);
