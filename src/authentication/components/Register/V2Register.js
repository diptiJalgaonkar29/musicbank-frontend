import React, { useState, useCallback, useEffect, useContext } from "react";
import "./V2Register.css";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import countryNames from "./CountryNames";
import { useFormik } from "formik";
import {  useLocation, useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    padding: "5px 10px 5px 30px",
    color: "var(--color-white)",
    cursor: "pointer",
    backgroundColor: "black",
    ":hover": {
      color: "var(--color-primary)",
    },
    ":active": {
      color: "var(--color-primary)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    marginTop: "-4px",
    padding: "0px 20px",
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: 25,
    fontSize: "1.6rem !important",
    height: "35px !important",
    background: "#e8f0fe",
    border: "2px solid var(--color-primary)",
    minHeight: "35px !important",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    position: "absolute",
    right: 0,
    top: "-2px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    transition: "all .2s ease",
  }),
  menu: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid var(--color-card)",
    color: "red !important",
    background: "black",
    borderRadius: "100px",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "200px",
    border: "1px solid var(--color-white)",
    borderRadius: 10,
    background: "black",
    "::-webkit-scrollbar": {
      width: "10px",
      backgroundColor: "var(--color-bg)",
      border: "1px solid var(--color-white)",
      borderRadius: "18px",
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
      borderRadius: "18px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "var(--color-primary)",
      borderRadius: "18px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "var(--color-primary)",
    },
  }),
};

const V2Register = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const { config } = useContext(BrandingContext);

  const [companyName, setCompanyName] = useState();
  const [countryName, setCountryName] = useState();
  const [options, setOptions] = useState();
  const [message, setMessage] = useState(location?.state?.errorMessage || "");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    fetchAllCompanyName();
  }, []);

  const errors = {};
  const validate = (values) => {
    if (!values.fullname) {
      errors.fullname = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (values.email.length < 4) {
      errors.email = "Must be 5 characters or more";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!values.company) {
      errors.company = "Required";
    }
    if (!values.country) {
      errors.country = "Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullname: location?.state?.name || "",
      email: location?.state?.email || "",
      company: "",
      ref_contact: "",
      country: "",
      is_gmail_sso_user: !!config?.modules?.gmailSSOAuth,
    },
    validate,
    onSubmit: (values, onSubmitProps) => {
      values.type = "New-Reg";
      setMessage("Please Wait...");
      let userMeta = {
        ...values,
        email: values?.is_gmail_sso_user
          ? `g_sign_${values.email}`
          : values.email,
      };
      AsyncService.postDataUnauthorized("/users/register", userMeta)
        .then((res) => {
          if (res.data?.status === "Registered Successfully") {
            setMessage(
              `Once your information is verified, you will receive a confirmation email.<br/><br/>Should you continue to have troubles, please contact us at <a style="color:var(--color-primary)" href="mailto:${res.data?.contactEmail}">${res.data?.contactEmail}</a>`
            );
            onSubmitProps.resetForm();
            setCompanyName("");
            setCountryName("");
            setIsFormSubmitted(true);
          } else if (res.data.status.includes("User is already exists")) {
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
        });
    },
  });

  const fetchAllCompanyName = () => {
    AsyncService.loadDataUnauthorized("/users/getAllCompany")
      .then((res) => {
        let companysFromApi = res.data.map((comp) => {
          return { value: comp, label: comp };
        });
        setOptions(companysFromApi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = useCallback(
    (inputValue) => setCompanyName(inputValue),
    []
  );

  const handleChangeCountryName = useCallback(
    (inputValue) => setCountryName(inputValue),
    []
  );

  const handleCreate = useCallback(
    (inputValue) => {
      // console.log("input value", inputValue);
      const newValue = { value: inputValue.toLowerCase(), label: inputValue };
      // console.log("options", options);
      setOptions(
        [...options, newValue].sort((a, b) =>
          a.label > b.label ? 1 : b.label > a.label ? -1 : 0
        )
      );
      formik.setFieldValue("company", newValue?.label);
      setCompanyName(newValue);
    },
    [options]
  );

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="container" id="register-container">
      <h2 className="form-heading">
        {!isFormSubmitted ? (
          <FormattedMessage id="auth.register.registerhere" />
        ) : (
          <FormattedMessage id="auth.register.registerSuccess" />
        )}
      </h2>
      {!isFormSubmitted && (
        <h4 className="form-subHeading" style={{ marginBottom: "8px" }}>
          <FormattedMessage id="auth.register.access" />
        </h4>
      )}

      <form
        id="register-form"
        className="register-form"
        onSubmit={formik.handleSubmit}
        onMouseEnter={() => {
          document.getElementById("authLoginFooter").style.display = "block";
        }}
      >
        {!!message && (
          <h4
            className="form-message highlight_text"
            id="form-message"
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        )}
        {!isFormSubmitted && (
          <>
            <div className="input">
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Full name*"
                onChange={(e) => {
                  formik.handleChange(e);
                  !!message && setMessage("");
                }}
                value={formik.values.fullname}
              />
              {formik.errors.fullname ? (
                <div className="error">{formik.errors.fullname}</div>
              ) : null}
            </div>
            <div className="input">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address*"
                onChange={(e) => {
                  formik.handleChange(e);
                  !!message && setMessage("");
                }}
                value={formik.values.email}
              />
              {formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="input">
              <CreatableSelect
                placeholder={"Company / Agency*"}
                isClearable
                value={companyName}
                options={options}
                onChange={(value) => {
                  formik.setFieldValue("company", value?.label);
                  handleChange();
                  !!message && setMessage("");
                }}
                onCreateOption={(value) => {
                  handleCreate(value);
                }}
                styles={customStyles}
              />
              {formik.errors.company ? (
                <div className="error">{formik.errors.company}</div>
              ) : null}
            </div>

            <div className="input">
              <input
                id="ref_contact"
                name="ref_contact"
                placeholder="Reference person's name"
                type="text"
                onChange={(e) => {
                  formik.handleChange(e);
                  !!message && setMessage("");
                }}
                value={formik.values.ref_contact}
              />
            </div>
            <div className="input">
              <Select
                placeholder={"Country*"}
                onChange={(value) => {
                  formik.setFieldValue("country", value?.label);
                  handleChangeCountryName();
                  !!message && setMessage("");
                }}
                value={countryName}
                options={countryNames}
                styles={customStyles}
              />
              {formik.errors.country ? (
                <div className="error">{formik.errors.country}</div>
              ) : null}
            </div>
            <h4 className="form-hint" id="hint">
              *mandatory
            </h4>
          </>
        )}
        <div className="buttonContainer">
          {!isFormSubmitted && (
            <div className="buttons" id="submitBtn">
              <button type="submit">Submit</button>
            </div>
          )}
          <div className="buttons">
            <button id="cancelBtn" variant="outlined" onClick={handleGoBack}>
              {isFormSubmitted ? "Return to home" : "Cancel"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default V2Register;
