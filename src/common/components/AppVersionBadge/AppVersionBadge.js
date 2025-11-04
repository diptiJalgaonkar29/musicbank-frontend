import React from "react";
import "./AppVersionBadge.css";

const AppVersionBadge = ({ appVersion }) => {
  return <span className="app_version">{appVersion}</span>;
};
export default AppVersionBadge;
