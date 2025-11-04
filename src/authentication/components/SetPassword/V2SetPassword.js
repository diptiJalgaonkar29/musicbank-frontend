import React, { useState, useEffect } from "react";
import "../Register/V2Register.css";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AsyncService from "../../../networking/services/AsyncService";

const V2SetPassword = () => {
  const [message, setmessage] = useState("");
  let { encodedString } = useParams();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "minimum 8 characters ";
    }

    if (!values.confirmpassword) {
      errors.confirmpassword = "Required";
    } else if (values.confirmpassword !== values.password) {
      errors.confirmpassword = "password doesn't match";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validate,
    onSubmit: (values) => {
      setmessage("Please Wait...");
      AsyncService.postDataUnauthorized("/users/UserResetPassword", {
        encoded_str_user: encodedString,
        password: values.password,
      })
        .then(() => {
          let els1 = document.getElementsByClassName("input");
          Array.from(els1).forEach((el) => {
            el.style.display = "none";
          });
          document.getElementById("submitBtn").style.display = "none";
          setmessage("Password updated successfully! !!!!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((err) => {
          let els1 = document.getElementsByClassName("input");
          Array.from(els1).forEach((el) => {
            el.style.display = "none";
          });
          document.getElementById("submitBtn").style.display = "none";
          console.log("Something went wrong !!!  ", err);
          setmessage("Something went wrong !!!  ");
        });
    },
  });

  return (
    <div className="container" id="register-container">
      <h2 className="form-heading">Set your password</h2>
      <p className="form-subHeading">To get access to the Sonic Hub</p>

      <form
        id="register-form"
        className="register-form"
        onSubmit={formik.handleSubmit}
        onMouseEnter={() => {
          document.getElementById("authLoginFooter").style.display = "block";
        }}
      >
        {!!message && (
          <h4 className="form-message highlight_text" id="form-message">
            {message}
          </h4>
        )}
        <div className="input">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password*"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>
        <div className="input">
          <input
            id="confirmpassword"
            name="confirmpassword"
            type="password"
            placeholder="Confirm Password*"
            onChange={formik.handleChange}
            value={formik.values.confirmpassword}
          />
          {formik.errors.confirmpassword ? (
            <div className="error">{formik.errors.confirmpassword}</div>
          ) : null}
        </div>
        <div className="buttonContainer">
          <div className="buttons" id="submitBtn">
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default V2SetPassword;
