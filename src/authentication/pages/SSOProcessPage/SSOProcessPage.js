import React, { useEffect } from "react";
import { useParams,  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SSOloginWithMicrosoft } from "../../actions/AuthenticationActions";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import "./SSOProcessPage.css";
import { showError } from "../../../redux/actions/notificationActions";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import NavBar from "../../../common/components/Navbar/NavBar";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import { isAuthenticated } from "../../../common/utils/getUserAuthMeta";

const messageArray = ["mfa_user", "sso_user_blocked", "user_blocked", "error"];

const getErrorMessage = (status) => {
  switch (status) {
    case "mfa_user":
      return "Your account is registered with 2FA. Please log in using 2FA.";
    case "sso_user_blocked":
      return "Your account has been temporarily blocked. Please contact the administrator for assistance.";
    case "user_blocked":
      return "Your account has been temporarily blocked. Please contact the administrator for assistance.";
    case "error":
      return "Your account is not yet activated. Please contact the administrator for assistance.";
    default:
      return "";
  }
};

const SSOProcessPage = () => {
  const { encodedUserString } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const logoutOrGoToLoginPage = () => {
    if (isAuthenticated()) {
      navigate("/logout");
    } else {
      navigate("/login");
    }
  };

  const loginByencodedUserString = (encodedUserString) => {
    dispatch(SSOloginWithMicrosoft(encodedUserString))
      .then((res) => {
        // console.log(
        //   "SSOloginWithMicrosoft-got access - res",
        //   res,
        //   res?.response?.user_register_status
        // );

        if (res?.response?.user_register_status) {
          navigate("/select-brand");
        } else {
          console.log("not registere - set data and go to register");
          localStorage.setItem(
            "regUserMeta",
            JSON.stringify({
              id: res?.response?.user_id,
              name: res?.response?.user_full_name,
              email: res?.response?.user_email,
              isSSOLogin: true,
            })
          );
          const superBrandName = getSuperBrandName();
          if (
            [brandConstants.MASTERCARD, brandConstants.SHELL].includes(
              superBrandName
            )
          ) {
            localStorage.setItem("isSSOUserRegistered", "false");
            navigate({ pathname: "/registerSSO" });
          } else {
            navigate({ pathname: "/register" });
          }
        }
      })
      .catch((err) => {
        console.log("Err logging ms user to sonic", err?.message);
        try {
          navigate({ pathname: "/login" });
          dispatch(showError("Something went wrong"));
        } catch (error) {
          console.log("error", error);
        }
      });
  };

  useEffect(() => {
    if (!encodedUserString || messageArray.includes(encodedUserString)) {
      return;
    }
    loginByencodedUserString(encodedUserString);
  }, [encodedUserString]);

  if (messageArray.includes(encodedUserString)) {
    return (
      <div className="SSOProcessPage_container">
        <div className="header">
          <NavBar isUnregistered />
        </div>
        <div className="SSOProcessPage_Description">
          <div className="SSOProcessPage_Description--wrapper">
            <div className="SSOProcessPage_Description--heading">
              <h2>{getErrorMessage(encodedUserString)}</h2>
            </div>
            <div className="SSOProcessPage_Description--button">
              <ButtonWrapper onClick={logoutOrGoToLoginPage}>
                Back to Login
              </ButtonWrapper>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="SSOProcessPage_loader_container">
      <SpinnerDefault />
    </div>
  );
};

export default SSOProcessPage;
