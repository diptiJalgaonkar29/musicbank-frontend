import React from "react";
import "./SonicToolTip.css";

const SonicToolTip = ({ children, title, ...restProps }) => {
  return (
    <div className="SonicToolTip" {...restProps}>
      <span tooltip={title} flow="down">
        {children}
      </span>
    </div>
  );
};

export default SonicToolTip;
