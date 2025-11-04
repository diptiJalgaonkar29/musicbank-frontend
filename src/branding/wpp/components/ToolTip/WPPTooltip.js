import React from "react";
import "./WPPToolTip.css";

const WPPToolTip = ({ children, title }) => {
  return (
    <div className="WPPToolTip">
      <span tooltip={title} flow="down">
        {children}
      </span>
    </div>
  );
};

export default WPPToolTip;
