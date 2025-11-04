import React, { useState } from "react";
import "./SonicButton.css";

const SonicButton = (props) => {
  const {
    children,
    variant = "filled", //outlined,filled
    type = "button",
    className = "",
    size = "m",
    ...restProps
  } = props;
  // const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      // className={`sonicButton ${variant} ${className} ${size} ${
      //   isHovered ? "sonicButtonHover" : ""
      // }`}
      className={`sonicButton ${variant} ${className} ${size}`}
      type={type}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      {...restProps}
    >
      {children}
    </button>
  );
};
export default SonicButton;
