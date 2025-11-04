import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/AuthenticationActions";
import getConfigJson from "../../../common/utils/getConfigJson";
import { googleLogout } from "@react-oauth/google";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { useContext } from "react";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import { useLocation, useNavigate } from "react-router-dom";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import FallBackPage from "../../../common/pages/FallBackPage";
import AsyncService from "../../../networking/services/AsyncService";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import { resetNotificationTopBar } from "../../../redux/actions/notificationActions";
import { isAuthenticated } from "../../../common/utils/getUserAuthMeta";
import { resetDownloadBasketMeta } from "../../../redux/actions/trackDownloads/tracksDownload";
import { useSelector } from "react-redux";
import { resetUserMeta } from "../../../redux/actions/userActions/userActions";

const Logout = () => {
  const dispatch = useDispatch();
  const {
    config,
    updateBrandThemeConfig,
    jsonConfig: CONFIG,
  } = useContext(BrandingContext);
  const { resetMusicPlayer } = useContext(FooterMusicPlayerContext);
  const navigate = useNavigate();
  let location = useLocation();
  const { brandName, isCSUser } = useSelector((state) => state.userMeta);

  const MSSSOLogout = () => {
    const isCSLoggedOut = localStorage.getItem("CSLoggingOut") === "true";
    const urlParams = new URLSearchParams(location.search);
    const isCSLoggedOutParam = urlParams.get("cs-logout") === "true";

    if (isCSUser && !isCSLoggedOut && !isCSLoggedOutParam) {
      localStorage.setItem("CSLoggingOut", "true");
      window.open(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:3098"
            : CONFIG?.CS_BASE_URL
        }/logout?${appendCSUrlParams()}`,
        "_self"
      );
      return;
    }

    AsyncService.loadData("/users/sslogout")
      .then(() => {})
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        resetMusicPlayer();
        dispatch(logout());
        dispatch(resetNotificationTopBar());
        dispatch(resetDownloadBasketMeta());
        try {
          document.body.classList.remove(localStorage.getItem("brandId"));
          document.body.classList.remove(
            brandName?.replaceAll(" ", "")?.toLowerCase()
          );
        } catch (error) {
          console.log("error", error);
        }
        localStorage.removeItem("brandId");
        localStorage.removeItem("superBrandThemeCache");
        sessionStorage.removeItem("hasAppliedSuperBrandTheme");
        const superBrandName = getSuperBrandName();
        updateBrandThemeConfig();
        const brandNameInUpperCase = superBrandName?.toUpperCase();

        const logoutUrl =
          process.env[`REACT_APP_LOGOUT_URL_${brandNameInUpperCase}`];
        setTimeout(() => {
          window.location.href = logoutUrl;
        }, 200);
      });
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/";
      return;
    }
    //Microsoft logout

    if (
      CONFIG.LOGIN_TYPE?.includes("SSO") &&
      localStorage.getItem("isSSOLogin") === "true"
    ) {
      MSSSOLogout();
      return;
    }

    //Google logout
    if (config.modules?.gmailSSOAuth) {
      try {
        googleLogout();
      } catch (error) {
        console.log("google Logout error :::", error);
      }
    }

    //Keycloak logout
    if (config.modules?.keycloakAuth) {
      try {
        //add for logout
        // console.log("add code for Keycloak Logout");
        //KeycloakDataService.logout();
      } catch (error) {
        console.log("Keycloak Logout error :::", error);
      }
    }

    setTimeout(() => {
      const isCSLoggedOut = localStorage.getItem("CSLoggingOut") === "true";

      const urlParams = new URLSearchParams(location.search);
      const isCSLoggedOutParam = urlParams.get("cs-logout") === "true";

      if (isCSUser && !isCSLoggedOut && !isCSLoggedOutParam) {
        localStorage.setItem("CSLoggingOut", "true");
        window.open(
          `${
            process.env.NODE_ENV === "development"
              ? "http://localhost:3098"
              : CONFIG?.CS_BASE_URL
          }/logout?${appendCSUrlParams()}`,
          "_self"
        );
        return;
      }

      AsyncService.loadData("/users/sslogout")
        .then(() => {})
        .catch((err) => {
          console.log("err", err);
        })
        .finally(async () => {
          try {
            document.body.classList.remove(localStorage.getItem("brandId"));
            document.body.classList.remove(
              brandName?.replaceAll(" ", "")?.toLowerCase()
            );
          } catch (error) {
            console.log("error", error);
          }
          resetMusicPlayer();
          dispatch(logout());
          dispatch(resetUserMeta());
          dispatch(resetDownloadBasketMeta());
          dispatch(resetNotificationTopBar());
          localStorage.removeItem("brandId");
          localStorage.removeItem("company");
          localStorage.removeItem("AISearchConfig");
          localStorage.removeItem("playlistCuratorId");
          localStorage.removeItem("superBrandThemeCache");
          sessionStorage.removeItem("hasAppliedSuperBrandTheme");
          await updateBrandThemeConfig();
          setTimeout(() => {
            // navigate("/login");
            window.location.href = "/";
          }, 250);
        });
    }, 250);
  }, []);

  return <FallBackPage />;
};

export default Logout;
