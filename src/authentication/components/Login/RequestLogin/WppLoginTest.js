import React, { useState } from "react";
import V3AuthLayout from "../../Layout/V3AuthLayout";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import { NetworkingError } from "../../../../common/model/NetworkingError";
import getSuperBrandId from "../../../../common/utils/getSuperBrandId";
import { useNavigate } from "react-router-dom";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import AsyncService from "../../../../networking/services/AsyncService";

const WppLoginTest = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const LOGIN_OPTIONS = {
    headers: {
      Authorization: "Basic cmVzdC1jbGllbnQ6cmVzdC1jbGllbnQtc2VjcmV0",
    },
  };

  function SSOKeycloakLogin(token) {
    const brandId =
      BrandingContext._currentValue?.config?.brandId ||
      localStorage.getItem("brandId");
    // console.log("SSOKeycloakLogin::", token);
    AsyncService.postDataUnauthorized(
      "/users/auth/keycloak",
      {
        token,
      },
      LOGIN_OPTIONS
    )
      .then((res) => {
        console.log("requestforLoginkeycloak", res);
        localStorage.setItem("WPPstatus", res?.data?.status);
        localStorage.setItem("WPPemail", res?.data?.email);
        localStorage.setItem("WPPfullName", res?.data?.userName);
        localStorage.setItem("WPPcontactEmail", res?.data?.contactEmail);
        // if (res?.data?.status) {
        if (res && res.data && res.data.status) {
          navigate("/requestforLogin", {
            state: {
              status: res?.data?.status,
              email: res?.data?.email,
              fullName: res?.data?.userName,
              contactEmail: res?.data?.contactEmail,
            },
          });
        } else if (res?.data?.user_register_status) {
          console.log(
            "user_register_status:true called",
            res?.data?.user_register_status
          );
          const savedPath = localStorage.getItem("pathname");
          console.log("##savedPath", savedPath);
          if (brandId > 0) {
            // Get current full URL
            const currentUrl = document.location.href;
            console.log("##currentUrl", currentUrl);
            console.log(
              "From Predict:",
              window.APP_FROM_PREDICT_NAVPATH,
              window.APP_PREDICT_PARAM_TOKEN,
              window.APP_FROM_PREDICT_HASHPATH
            );

            // Remove origin to get pathname + hash
            //const urlPath = currentUrl.replace(document.location.origin, "");
            //console.log("##urlPath", urlPath);
            // Optionally remove leading # if using hash routing
            //const fullPath = urlPath.startsWith("#") ? urlPath.slice(1): urlPath;
            const fullPath = window.APP_FROM_PREDICT_HASHPATH.startsWith("#")
              ? window.APP_FROM_PREDICT_HASHPATH.slice(1)
              : window.APP_FROM_PREDICT_HASHPATH;

            console.log("##fullPath", fullPath);

            if (
              fullPath.includes("AISearchScreen") ||
              fullPath.includes("track-download") ||
              fullPath.includes("select-brand") ||
              fullPath.includes("predict")
            ) {
              navigate(fullPath);
            } else {
              navigate(savedPath || "/select-brand");
            }
          } else {
            navigate("/select-brand");
          }
        } else {
          // console.log("not registere - set data and go to register");
          //   localStorage.setItem(
          //     "regUserMeta",
          //     JSON.stringify({
          //       id: res?.response?.user_id,
          //       name: res?.response?.user_full_name,
          //       email: res?.response?.user_email,
          //     })
          //   );
          navigate("/register");
        }
      })
      .catch((err) => {
        throw new NetworkingError(err?.message);
      });
  }

  return (
    <V3AuthLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InputWrapper onChange={(e) => setInputValue(e.target.value)} />

        {/* <div style={{border:"1px solid black", height:"30px"}}> */}
        <ButtonWrapper
          style={{ height: "30px", width: "120px" }}
          onClick={() => {
            SSOKeycloakLogin(inputValue);
          }}
        >
          Login
        </ButtonWrapper>
      </div>
    </V3AuthLayout>
  );
};

export default WppLoginTest;
