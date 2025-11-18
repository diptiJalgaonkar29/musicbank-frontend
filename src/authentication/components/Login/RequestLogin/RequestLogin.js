import React, { useEffect, useState } from "react";
import "./RequestLogin.css";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import { useLocation } from "react-router-dom";
import AsyncService from "../../../../networking/services/AsyncService";
import V3AuthLayout from "../../Layout/V3AuthLayout";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import { FormattedMessage } from "react-intl";

const RequestLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestAcc, setRequestAcc] = useState(true); // default true
  const location = useLocation();
  const [constEmail2, setConstEmail2] = useState("");

  // const { status, email, contactEmail } = location.state || {};

  const status = localStorage.getItem("WPPstatus");
  const email = localStorage.getItem("WPPemail");
  const contactEmail = localStorage.getItem("WPPcontactEmail");

  // Load requestAcc from localStorage on mount
  // useEffect(() => {
  //   const storedRequestAcc = localStorage.getItem("requestAcc");
  //   if (storedRequestAcc !== null) {
  //     setRequestAcc(JSON.parse(storedRequestAcc));
  //   }
  // }, []);

  // Save requestAcc to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("requestAcc", JSON.stringify(requestAcc));
  }, [requestAcc]);

  const userRequest = () => {
    setIsLoading(true);
    AsyncService.postData("/authorised_users/requestAccess", { email })
      .then((response) => {
        setIsLoading(false);
        if (response?.data?.status === "not_whitelisted") {
          setConstEmail2(response?.data?.contactEmail);

          showSuccess("User added successfully!");
          localStorage.setItem("contactEmail", response?.data?.contactEmail);
        } else {
          showError("Error adding user.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        showError("Something went wrong!");
      });
  };

  return (
    <V3AuthLayout>
      <div className="requestforAccess-section">
        {isLoading ? (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <SpinnerDefault />
          </div>
        ) : (
          <div className="requestforAccess-form">
            {status === "pending" ? (
              <div className="form-heading-pending">
                <div className="pending-heading">
                  <FormattedMessage id="WppWhitelisting.wppAccessHeading" />
                </div>
                <div className="pending-info">
                  <FormattedMessage id="WppWhitelisting.wppAccessInfo" />{" "}
                  <span className="admin-email">{contactEmail}</span>
                </div>
              </div>
            ) : status === "not_whitelisted" ? (
              <div className="non-access-heading">
                <div className="non-access-subheading">
                  <FormattedMessage id="WppWhitelisting.wppUnlockHeading" />
                </div>
                <div className="non-access-info">
                  <FormattedMessage id="WppWhitelisting.wppUnlockSubInfo" />
                  <div style={{ marginTop: "5px" }}>
                    <FormattedMessage id="WppWhitelisting.wppUnlockInfo" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-heading-pending">
                <div className="pending-heading">
                  <FormattedMessage id="WppWhitelisting.wppFinalMessageHeading" />
                </div>
                <div className="pending-info">
                  <FormattedMessage id="WppWhitelisting.wppFinalMessageInfo" />{" "}
                  <span className="admin-email">
                    {contactEmail || localStorage.getItem("contactEmail")}
                  </span>
                </div>
              </div>
            )}

            {status === "not_whitelisted" && requestAcc && (
              <ButtonWrapper
                type="submit"
                style={{ height: "40px", width: "200px", marginTop: "10px" }}
                className="request-button"
                onClick={() => {
                  userRequest();
                  setRequestAcc(false); // this will also update localStorage
                  localStorage.setItem("WPPstatus", "pending");
                }}
              >
                <FormattedMessage id="WppWhitelisting.wppUnlockButton" />
              </ButtonWrapper>
            )}
          </div>
        )}
      </div>
    </V3AuthLayout>
  );
};

export default RequestLogin;
