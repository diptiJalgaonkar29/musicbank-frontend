import React, { useEffect, useState } from "react";
import "./MFAConfigModal.css";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import { FormattedMessage, injectIntl } from "react-intl";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { Field, Formik } from "formik";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import { SpinnerDefault } from "../Spinner/Spinner";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import AsyncService from "../../../networking/services/AsyncService";
import {
  addMFAMeta,
  removeMFAMeta,
} from "../../../redux/actions/authActions/authActions";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";

const MFAConfigModal = ({
  isMFAConfigureModalOpen,
  setisMFAConfigureModalOpen,
  email,
  intl,
}) => {
  const dispatch = useDispatch();
  const { metaMFA } = useSelector((state) => state.authentication);
  const [isQRImageLoading, setIsQRImageLoading] = useState(false);

  useEffect(() => {
    if (email && isMFAConfigureModalOpen) {
      dispatch(removeMFAMeta());
      setUpMFA(email);
    }
  }, [email, isMFAConfigureModalOpen]);

  const setUpMFA = (email) => {
    setIsQRImageLoading(true);
    const userMeta = {
      email,
    };
    AsyncService.postDataUnauthorized("/users/reAuthenticate", userMeta)
      .then((response) => {
        if (!!response?.data?.secretImageUri) {
          dispatch(
            addMFAMeta({
              email: email,
              QRCodeMFABase64: response?.data?.secretImageUri,
            })
          );
        } else {
          closeMFAConfigureModal();
          dispatch(showError("Something went wrong"));
        }
        setIsQRImageLoading(false);
      })
      .catch(() => setIsQRImageLoading(false));
  };

  const closeMFAConfigureModal = () => {
    setisMFAConfigureModalOpen(false);
  };

  const handleSubmit = (values, setSubmitting, setErrors) => {
    setSubmitting(false);
    const userMeta = {
      email,
      code: values?.verificationCode,
      reconfigureMFA: true,
    };
    AsyncService.postDataUnauthorized("/users/verify", userMeta)
      .then(() => {
        setSubmitting(false);
        dispatch(removeMFAMeta());
        dispatch(
          showSuccess(
            "Two-factor authentication has been successfully configured"
          )
        );
        closeMFAConfigureModal();
      })
      .catch(() => {
        setSubmitting(false);
        setErrors({ onSubmit: "Wrong OTP, Please try again!" });
      });
  };

  if (!isMFAConfigureModalOpen) return <></>;

  return (
    <ModalWrapper
      isOpen={isMFAConfigureModalOpen}
      onClose={closeMFAConfigureModal}
      title={intl.messages["profile.page.MFAConfigureTitle"]}
      aria-labelledby="data-policy-dialog"
      className="MFA-configure-dialog"
    >
      <div className="MFAConfigureModal_content">
        <p className="MFA_config_note">
          <FormattedMessage id="auth.verifyMFA.page.qrCodeSubtitle" />
        </p>

        {!isQRImageLoading ? (
          <img
            src={metaMFA?.QRCodeMFABase64}
            alt="qr_code"
            className="MFA_configure_qr_code"
          />
        ) : (
          <SpinnerDefault />
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
          {(props) => {
            const {
              dirty,
              isValid,
              isSubmitting,
              errors,
              setFieldValue,
              handleSubmit,
            } = props;
            return (
              <form onSubmit={handleSubmit} className="MFA_configure_form">
                <p className="MFA_config_note">
                  <FormattedMessage id="auth.verifyMFA.page.OTPSubtitle" />
                </p>
                <Field
                  name="verificationCode"
                  type="text"
                  placeholder="XXXXXX"
                  className="MFA_configure_code_input"
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
                  <p className="MFA_configure_error_msg">
                    {errors.verificationCode}
                  </p>
                )}
                {errors.onSubmit && (
                  <p className="MFA_configure_error_msg">{errors.onSubmit}</p>
                )}
                <div className="MFA_configure_dialog_btn_container">
                  <ButtonWrapper
                    onClick={closeMFAConfigureModal}
                    variant="outlined"
                  >
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
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </ModalWrapper>
  );
};

export default injectIntl(MFAConfigModal);
