import React, { useState, useEffect } from "react";
import "./V3Register.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import countryNames from "./CountryNames";
import { useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import { FormattedMessage } from "react-intl";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import SelectWrapper from "../../../branding/componentWrapper/SelectWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import AuthorizationStorage from "../../services/AuthorizationStorage";
import { useDispatch } from "react-redux";
import { showError } from "../../../redux/actions/notificationActions";
import { setUserMeta } from "../../../redux/actions/userActions/userActions";

const V3RegisterSSO = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [regUserMeta, setRegUserMeta] = useState({});

  useEffect(() => {
    let regUserMetaLS = localStorage.getItem("regUserMeta");
    if (regUserMetaLS) {
      try {
        let regUser = JSON.parse(regUserMetaLS);
        // console.log("regUser", regUser);
        setRegUserMeta(regUser);
        setMessage(regUserMeta?.errorMessage || "");
      } catch (error) {
        console.log("error", error);
      }
    }
  }, []);

  const updateRegisteredUser = (userMeta, onSubmitProps) => {
    AsyncService.putData("/users/userUpdate", userMeta)
      .then((res) => {
        if (res.data?.status === "user blocked") {
          dispatch(showError("Your account has been temporarily blocked."));
          navigate("/ms_sso/user_blocked");
          // navigate("/logout");
          return;
        }
        let newToken = res.data?.access_token;
        // console.log("newToken", newToken);
        if (!newToken) {
          dispatch(showError("Something went wrong..."));
          navigate("/logout");
          return;
        }
        AuthorizationStorage.updateToken(newToken);
        // const email = `${userMeta?.user_email},${new Date().getTime()}`;
        // const encodedEmail = btoa(email);
        // localStorage.setItem("user", encodedEmail);
        localStorage.setItem("isSSOUserRegistered", "true");
        // localStorage.setItem("ssAccess", res.data?.ss_access ?? false);
        // localStorage.setItem("isCSUser", res.data?.cs_login ?? false);
        localStorage.removeItem("regUserMeta");
        const ssAccess = res.data?.ss_access;
        const isCSUser = res.data?.cs_login;
        const isPersonalizedTrackingAllowed =
          res.data?.is_personalized_tracking_allowed;
        const email = res.data?.user_email;
        const userId = res.data?.user_id;
        dispatch(
          setUserMeta({
            ssAccess,
            isCSUser,
            isPersonalizedTrackingAllowed,
            email,
            userId,
          })
        );
        navigate("/select-brand");
      })
      .catch((err) => {
        console.log(
          "Something went wrong creating a New User, please try again ",
          err
        );
        setMessage("Something went wrong, please try again");
      })
      .finally(() => {
        onSubmitProps.setSubmitting(false);
      });
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="container" id="register-container">
      <h2 className="form-heading boldFamily">
        <FormattedMessage
          id="auth.register.registerhere"
          className="boldFamily"
        />
      </h2>
      <p className="form-subHeading" style={{ marginBottom: "8px" }}>
        <FormattedMessage id="auth.register.access" />
      </p>

      <Formik
        initialValues={{
          email: "",
          confirm_email: "",
          country: null,
        }}
        onSubmit={(values, onSubmitProps) => {
          const { confirm_email, ...restValues } = values;
          updateRegisteredUser(
            {
              ...restValues,
              id: regUserMeta?.id,
              fullName: restValues.email?.split("@")?.[0] || "",
              country: values?.country?.label,
            },
            onSubmitProps
          );
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email()
            .required("Required")
            .trim()
            .transform((value) => value.toLowerCase()?.trim()),
          confirm_email: Yup.string()
            .oneOf([Yup.ref("email"), null], "Emails must match")
            .trim()
            .transform((value) => value.toLowerCase()?.trim())
            .required("Required"),
          country: Yup.object().required("Required"),
        })}
      >
        {(props) => {
          const {
            dirty,
            isValid,
            isSubmitting,
            touched,
            errors,
            handleSubmit,
          } = props;
          return (
            <form
              onSubmit={handleSubmit}
              className="register_form"
              style={{ marginTop: "10px" }}
            >
              {!!message && (
                <>
                  <h4
                    className="form-message highlight_text"
                    id="form-message"
                    dangerouslySetInnerHTML={{
                      __html: message,
                    }}
                  />
                </>
              )}
              <Field
                id="register_email"
                name="email"
                type="email"
                placeholder="Email address*"
                component={InputWrapper}
              />
              {errors.email && touched.email && (
                <p className="register_form_error_msg">{errors.email}</p>
              )}
              <div className="register_field_divider"></div>
              <Field
                id="register_confirm_email"
                name="confirm_email"
                type="email"
                placeholder="Confirm email address*"
                component={InputWrapper}
              />
              {errors.confirm_email && touched.confirm_email && (
                <p className="register_form_error_msg">
                  {errors.confirm_email}
                </p>
              )}
              <div className="register_field_divider"></div>
              <Field
                id="country"
                as="select"
                name="country"
                component={SelectWrapper}
                options={countryNames}
                placeholder="Country*"
              />
              {errors.country && touched.country && (
                <p className="register_form_error_msg">{errors.country}</p>
              )}
              <div className="register_field_divider"></div>
              <h4 className="form-hint" id="hint">
                *mandatory
              </h4>
              <div className="register_field_divider"></div>
              <div className="buttonContainer">
                <ButtonWrapper
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {isSubmitting ? (
                    <div className="spinnerContainer">
                      <SpinnerDefault />
                    </div>
                  ) : (
                    "Register"
                  )}
                </ButtonWrapper>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default V3RegisterSSO;
