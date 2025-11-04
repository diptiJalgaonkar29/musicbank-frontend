import Keycloak from "keycloak-js";

const keycloakConfigData = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  initCalled: false,
};

const keycloakConfig = new Keycloak(keycloakConfigData);

export default keycloakConfig;
