import React from "react";
import "./SonicTabHeaderItem.css";
import { Tab } from "@mui/material";

const SonicTabHeaderItem = ({ label, index, ...props }) => {
  return (
    <Tab label={label} value={index} className="sonic_tab_title" {...props} />
  );
};

export default SonicTabHeaderItem;
