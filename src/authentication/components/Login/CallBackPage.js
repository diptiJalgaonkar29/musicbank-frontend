import React, { useEffect, useState } from "react";
import keycloakConfig from "../../../branding/wpp/KeycloakConfig";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";

function CallbackPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!keycloakConfig.initCalled) {
      keycloakConfig
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          alert("open kcpopup--");
          setAuthenticated(authenticated);
          const token = keycloakConfig.token;
          // console.log("Auth Token::", token);
        })
        .catch(() => {
          alert("Failed to initialize Keycloak");
        });
      keycloakConfig.initCalled = true;
    }
  }, []);

  const handleKCAuthPopup = () => {
    // console.log("open kc popup");
    alert("open kcpopup");
    const loginUrl = keycloakConfig.createLoginUrl();
    window.open(loginUrl, "Keycloak Login", "width=800,height=600");
  };

  if (authenticated) {
    return <div>Welcome to the App!</div>;
  } else {
    return (
      <>
        <div style={{ position: "absolute", left: "100px", top: "100px" }}>
          <ButtonWrapper onClick={handleKCAuthPopup}>Login</ButtonWrapper>
        </div>
      </>
    );
  }
}

export default CallbackPage;
