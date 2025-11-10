import React, { Fragment, useState } from "react";
import "./RequestLogin.css";
import { FormattedMessage } from "react-intl";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import AsyncService from "../../../../networking/services/AsyncService";
import V3AuthLayout from "../../Layout/V3AuthLayout";
import BrandButton from "../../../pages/BrandButton/BrandButton";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import {
  showError,
  showNotification,
  showSuccess,
} from "../../../../redux/actions/notificationActions";

const RequestLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestAcc, setRequestAcc] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [constEmail2, setConstEmail2] = useState("");
  

  const { status, email, fullName, contactEmail } = location.state;


  const userRequest = () => {
    AsyncService.postData("/authorised_users/requestAccess", {
      // fullName: fullName,
      email: email,
    })
      .then((response) => {
        console.log(response);
        if (response?.data?.status == 1) {
          // alert("click")
          console.log("response?.data?.contactEmail",response?.data?.contactEmail);          
          setConstEmail2(response?.data?.contactEmail);
          showSuccess("user add succsesfully!");
        } else {
          // alert("click")
          showError("Error");
        }
        // setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
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
            {(status == "pending" &&requestAcc)? (
              <div className="form-heading-pending">
                <div className="pending-heading">Access to be approved</div>
                <div className="pending-info">
                  Please wait until the admin approves your user access request.
                  You will be notified via an email. For urgent support, please
                  contact: <span className="admin-email">{contactEmail}</span>
                </div>
              </div>
            ) : (status == "not_whitelisted"&&requestAcc )? (
              <div className="non-access-heading">
                <div className="non-access-subheading">
                  Unlock Your Workspace
                </div>
                <div className="non-access-info">
                  You’re almost in!
                  <div style={{ marginTop: "5px" }}>
                    Request access so we can verify your account and get you set
                    up quickly.
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-heading-pending">
                <div className="pending-heading">
                  Thank you for submitting your request!
                </div>
                <div className="pending-info">
                  Our team will review your request and get back to you in the
                  next days. If you need any urgent assistance please contact:{" "}
                  <span className="admin-email">{constEmail2}</span>
                </div>
              </div>
            )}

            {status == "not_whitelisted" && requestAcc && (
              <ButtonWrapper
                type="submit"
                style={{ height: "40px", width: "200px", marginTop: "10px" }}
                className="request-button"
                onClick={() => {
                  userRequest();
                  setRequestAcc(false);
                }}
              >
                Request Access
                {/* <FormattedMessage id="project.createProject" /> */}
              </ButtonWrapper>
            )}
            {status == "not_whitelisted" && (
              <div className="userResonseMsg">
                {/* <FormattedMessage id="project.createProject" /> */}
                {userData === 1
                  ? "user add successfully"
                  : userData === 0
                  ? "error"
                  : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </V3AuthLayout>
  );
};

export default RequestLogin;
