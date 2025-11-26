import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import appendCSUrlParams from "../../common/utils/appendCSUrlParams";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";
import { isAuthenticated as isAuthenticatedFunc } from "../../common/utils/getUserAuthMeta";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import useReloadOnce from "../../hooks/useReloadOnce";

const ProtectedRoute = ({ element }) => {
  //useReloadOnce();
  const location = useLocation();
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const authentication = useSelector((state) => state.authentication);
  const userMeta = useSelector((state) => state.userMeta);

  const isAuthenticated = () => {
    if (
      CONFIG?.modules?.keycloakAuth &&
      process.env.NODE_ENV !== "development"
    ) {
      return isAuthenticatedFunc();
    }
    return isAuthenticatedFunc();
  };

  console.log('ProtectedRoute','ProtectedRoute');
  
  if (!isAuthenticated()) {
    if (getSuperBrandName() === brandConstants.WPP) {
      const fullHashPath = location.hash?.startsWith("#")
        ? location.hash.slice(1)
        : location.hash;

      localStorage.setItem("pathname", fullHashPath || "/");
    } else {
      if (location.pathname === "/requestTokenAction") {
        localStorage.setItem(
          "pathname",
          location.pathname + location.search
        );
      } else {
        localStorage.setItem(
          "pathname",
          location.pathname
        );
      }

    }

    return <Navigate to="/login" replace state={{ from: location }} />;
  } else {
    if (getSuperBrandName() === brandConstants.WPP) {
      const fullHashPath = window.location.hash?.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;

      localStorage.setItem("pathname", fullHashPath || "/");
    }
  }

  const brandId = userMeta?.brandId;
  const ssAccess = userMeta?.ssAccess;
  const csAccess = userMeta?.isCSUser;
  const isSSOUserNotRegistered =
    localStorage.getItem("isSSOUserRegistered") === "false";
  const superBrandName = getSuperBrandName();

  if (!ssAccess && !csAccess) {
    return <Navigate to="/access_denied" replace />;
  }

  if (!brandId) {
    return <Navigate to="/select-brand" replace />;
  }

  if (
    isSSOUserNotRegistered &&
    [brandConstants.MASTERCARD, brandConstants.SHELL].includes(superBrandName)
  ) {
    return <Navigate to="/registerSSO" replace />;
  }

  if (!ssAccess && csAccess) {
    const allowedPaths = [
      "/documents/guidelines",
      "/documents/templates",
      "/documents/faq",
      "/profile",
      "/logout",
      "/editor/ss",
      "/editor/cs",
      "/editor/admin",
    ];

    if (allowedPaths.includes(location?.pathname)) {
      return element;
    }

    useEffect(() => {
      localStorage.setItem("CSLoggingOut", "false");
      const urlToNavigate = `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3098"
          : CONFIG?.CS_BASE_URL
      }?${appendCSUrlParams()}`;
      window.open(urlToNavigate, "_self");
    }, []); // runs only once

    return null;
  }

  return element;
};

export default ProtectedRoute;
