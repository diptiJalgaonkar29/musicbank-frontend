import Keycloak from "keycloak-js";
import getConfigJson from "../../common/utils/getConfigJson";

let CONFIG;
let keycloakInitiated = false;

class KeycloakDataService {
  constructor() {
    CONFIG = getConfigJson();
    keycloakInitiated = false;
    this.keycloak = new Keycloak({
      url: CONFIG?.WPP_KEYCLOAK_URL,
      realm: CONFIG?.WPP_KEYCLOAK_REALM,
      clientId: CONFIG?.WPP_KEYCLOAK_CLIENTID,
      //clientSecret: CONFIG?.WPP_KEYCLOAK_CLIENTSECRET,
      silentCheckSSOFallBack: CONFIG?.WPP_KEYCLOAK_SILENTCHECKSSOFALLBACK,
    });
  }

  /*   initpoptest() {
    if (!this.keycloak.initCalled) {
      this.keycloak.init({ onLoad: 'check-sso' })
        .then(authenticated => {          
          //setAuthenticated(authenticated);
          const token = this.keycloak.token;
         console.log("Auth Token::", token);
         this.keycloak.token = this.keycloak.token
        })
        .catch(() => {
          alert('Failed to initialize Keycloak');
        });
        this.keycloak.initCalled = true;
       }
  }
 */

  init() {
    return new Promise((resolve, reject) => {
      // console.log("init called:");
      // console.log("init called:", keycloakInitiated);
      if (!keycloakInitiated) {
        this.keycloak
          .init({
            //onLoad: "check-sso"
            onLoad: "login-required",
            redirectUri: CONFIG?.WPP_KEYCLOAK_REDIRECTURI,
          })
          .then((authenticated) => {
            if (authenticated) {
              // console.log("KeycloakDataService-authenticated:::", authenticated, keycloakInitiated);
              keycloakInitiated = true;
              resolve();
            } else {
              // console.log("KeycloakDataService - not authenticated:::",
              //   authenticated
              // );
              keycloakInitiated = true;
              reject();
            }
          });
        //this.keycloak.initCalled = true;
      } else {
        keycloakInitiated = true;
        // console.log(
        //   "KeycloakDataService - already authenticated:::",
        //   keycloakInitiated
        // );
        resolve();
      }
    });
  }

  getLoginUrl() {
    return this.keycloak.createLoginUrl();
  }

  getToken() {
    return this.keycloak.token;
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    return this.keycloak.logout();
  }

  isLoggedIn() {
    return this.keycloak.authenticated;
  }
}

export default new KeycloakDataService();
