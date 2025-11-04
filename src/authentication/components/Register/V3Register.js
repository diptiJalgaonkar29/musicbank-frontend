import React, { useState, useEffect, useContext } from "react";
import "./V3Register.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import countryNames from "./CountryNames";
import { useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import SelectWrapper from "../../../branding/componentWrapper/SelectWrapper";
import CreatableSelectWrapper from "../../../branding/componentWrapper/CreatableSelectWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

const V3Register = () => {
  const navigate = useNavigate();
  const { config } = useContext(BrandingContext);
  const [options, setOptions] = useState();
  const [message, setMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [regUserMeta, setRegUserMeta] = useState({});

  useEffect(() => {
    fetchAllCompanyName();
    if (localStorage.getItem("regUserMeta")) {
      try {
        let regUser = JSON.parse(localStorage.getItem("regUserMeta"));
        setRegUserMeta(regUser);
        setMessage(regUserMeta?.errorMessage || "");
      } catch (error) {
        console.log("error", error);
      }
    }
    return () => localStorage.removeItem("regUserMeta");
  }, []);

  const registerUser = (userMeta, onSubmitProps) => {
    AsyncService.postDataUnauthorized("/usersData/register", userMeta)
      .then((res) => {
        if (res.data?.status === "Registered Successfully") {
          setMessage(
            `Once your information is verified, you will receive a confirmation email.<br/><br/>Should you continue to have troubles, please contact us at <a style="color:var(--color-primary)" href="mailto:${res.data?.contactEmail}">${res.data?.contactEmail}</a>`
          );
          onSubmitProps.resetForm();
          setIsFormSubmitted(true);
          localStorage.removeItem("regUserMeta");
        } else if (res.data?.status === "User is already exists") {
          setMessage(
            "Email already exists in the system. Please reset your password if you can not successfully login."
          );
        }
      })
      .catch((err) => {
        console.log(
          "Something went wrong creating a New User, please try again ",
          err
        );
        setMessage("Something went wrong, please try again ");
      })
      .finally(() => {
        onSubmitProps.setSubmitting(false);
      });
  };

  const updateRegisteredUser = (userMeta, onSubmitProps) => {
    AsyncService.putData("/users/userUpdate", userMeta)
      .then(() => {
        localStorage.removeItem("regUserMeta");
        navigate("/select-brand");
      })
      .catch((err) => {
        console.log(
          "Something went wrong creating a New User, please try again ",
          err
        );
        setMessage("Something went wrong, please try again ");
      })
      .finally(() => {
        onSubmitProps.setSubmitting(false);
      });
  };

  const fetchAllCompanyName = () => {
    AsyncService.loadDataUnauthorized("/company/getCompanyNames")
      .then((res) => {
        let allCompanies = res.data || [];
        const companyOptions =
          allCompanies?.map((company) => ({
            value: company?.id,
            label: company?.companyName,
          })) || [];
        console.log("res", res.data);
        setOptions(companyOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="container" id="register-container">
      {!isFormSubmitted ? (
        <>
          <h2 className="form-heading boldFamily">
            <FormattedMessage
              id="auth.register.registerhere"
              className="boldFamily"
            />
          </h2>
          <p className="form-subHeading" style={{ marginBottom: "8px" }}>
            <FormattedMessage id="auth.register.access" />
          </p>
        </>
      ) : (
        <h2 className="form-heading boldFamily">
          <FormattedMessage id="auth.register.registerSuccess" />
        </h2>
      )}

      <Formik
        initialValues={{
          fullName: regUserMeta?.name || "",
          email: regUserMeta?.email || "",
          companyId: null,
          refContact: "",
          country: null,
          userData: "",
          is_gmail_sso_user: !!config?.modules?.gmailSSOAuth,
          isKeycloakLogin: !!config?.modules?.keycloakAuth,
          isSSOLogin: !!regUserMeta?.isSSOLogin,
        }}
        enableReinitialize
        onSubmit={(values, onSubmitProps) => {
          let userMeta = {
            email: values?.email,
            fullName: values?.fullName,
            companyId: values?.companyId?.value,
            userData:
              values?.companyId?.value === 0 ? values?.companyId?.label : "",
            country: values?.country?.label,
            refContact: values?.refContact,
          };

          if (values?.isKeycloakLogin || values?.isSSOLogin) {
            updateRegisteredUser(
              { ...userMeta, id: regUserMeta?.id },
              onSubmitProps
            );
          } else {
            registerUser({ ...userMeta, type: "New-Reg" }, onSubmitProps);
          }
        }}
        validationSchema={Yup.object().shape({
          fullName: Yup.string().trim().required("Required"),
          email: Yup.string().email().trim().required("Required"),
          companyId: Yup.object().required("Required"),
          refContact: Yup.string().trim().required("Required"),
          country: Yup.object().required("Required"),
        })}
      >
        {(props) => {
          const {
            values,
            dirty,
            isValid,
            isSubmitting,
            touched,
            errors,
            handleSubmit,
            setFieldValue,
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
              {!isFormSubmitted ? (
                <>
                  {/* {console.log("values", JSON.stringify(values, null, 2))}
                  {console.log("errors", JSON.stringify(errors, null, 2))} */}
                  <Field
                    id="register_fullname"
                    name="fullName"
                    type="text"
                    placeholder="Full name*"
                    disabled={!!regUserMeta?.name}
                    component={InputWrapper}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="register_form_error_msg">{errors.fullName}</p>
                  )}
                  <div className="register_field_divider"></div>
                  <Field
                    id="register_email"
                    name="email"
                    type="text"
                    placeholder="Email address*"
                    disabled={!!regUserMeta?.email}
                    component={InputWrapper}
                  />
                  {errors.email && touched.email && (
                    <p className="register_form_error_msg">{errors.email}</p>
                  )}
                  <div className="register_field_divider"></div>
                  <Field
                    placeholder={"Company / Agency*"}
                    id="register_company"
                    name="companyId"
                    component={CreatableSelectWrapper}
                    options={options}
                    setOptions={setOptions}
                    value={values.companyId}
                    onChange={(value) => {
                      setFieldValue("companyId", value);
                      !!message && setMessage("");
                    }}
                    onCreateOption={(value) => {
                      setFieldValue("companyId", { value: 0, label: value });
                      !!message && setMessage("");
                    }}
                  />
                  {errors.companyId && touched.companyId && (
                    <p className="register_form_error_msg">
                      {errors.companyId}
                    </p>
                  )}
                  <div className="register_field_divider"></div>
                  <Field
                    id="register_ref_contact"
                    name="refContact"
                    type="text"
                    placeholder="Reference person's name*"
                    component={InputWrapper}
                  />
                  {errors.refContact && touched.refContact && (
                    <p className="register_form_error_msg">
                      {errors.refContact}
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
                    <ButtonWrapper onClick={handleGoBack} variant="outlined">
                      Cancel
                    </ButtonWrapper>
                    <ButtonWrapper
                      type="submit"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {/* Submit */}
                      {isSubmitting ? (
                        <div className="spinnerContainer">
                          <SpinnerDefault />
                        </div>
                      ) : (
                        "Register"
                      )}
                    </ButtonWrapper>
                  </div>
                </>
              ) : (
                <ButtonWrapper
                  onClick={handleGoBack}
                  style={{ marginTop: "10px" }}
                >
                  Return to home
                </ButtonWrapper>
              )}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default V3Register;
