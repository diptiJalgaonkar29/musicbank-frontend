import React from "react";
import { useNavigate } from "react-router-dom";
import "./SSAndCSAccessDeniedPage.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import NavBar from "../../../common/components/Navbar/NavBar";
import { FormattedMessage } from "react-intl";
import { isAuthenticated } from "../../../common/utils/getUserAuthMeta";

const SSAndCSAccessDeniedPage = () => {
  const navigate = useNavigate()

  const logoutOrGoToLoginPage = () => {
    if (isAuthenticated()) {
      navigate("/logout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="SSAndCSAccessDeniedPage_container">
      <div className="header">
        <NavBar isUnregistered />
      </div>
      <div className="SSAndCSAccessDeniedPage_Description">
        <div className="SSAndCSAccessDeniedPage_Description--wrapper">
          <div className="SSAndCSAccessDeniedPage_Description--heading">
            <h2>
              <FormattedMessage id="auth.SSAndCSAccessDenied.page.message" />
            </h2>
          </div>
          <div className="SSAndCSAccessDeniedPage_Description--button">
            <ButtonWrapper onClick={logoutOrGoToLoginPage}>
              Back to Login
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSAndCSAccessDeniedPage;
