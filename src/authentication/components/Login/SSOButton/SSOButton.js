import React from "react";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import getSuperBrandName from "../../../../common/utils/getSuperBrandName";
import { injectIntl } from "react-intl";

const SSOButton = ({ intl }) => {
  const handleSSOLoginCipm = () => {
    const brandNameInUpperCase = getSuperBrandName()?.toUpperCase();
    window.location.href =
      process.env[`REACT_APP_ACCESS_URL_CIPM_${brandNameInUpperCase}`];
  };
  const handleSSOLogin = () => {
    const brandNameInUpperCase = getSuperBrandName()?.toUpperCase();
    window.location.href =
      process.env[`REACT_APP_ACCESS_URL_${brandNameInUpperCase}`];
  };
  return (
    <div style={{ width: "100%", margin: "0 0 2rem 0" }}>
      <ButtonWrapper onClick={handleSSOLogin} className="SSOButton">
        {intl.messages["auth.login.page.ssoBtnText"] || "Login"}
      </ButtonWrapper>
      {getSuperBrandName() === "shell" && (
        <>
          <br />
          <ButtonWrapper onClick={handleSSOLoginCipm} className="SSOButton">
            {intl.messages["auth.login.page.ssoBtnTextCIPM"] || "Login"}
          </ButtonWrapper>
        </>
      )}
    </div>
  );
};

export default injectIntl(SSOButton);
