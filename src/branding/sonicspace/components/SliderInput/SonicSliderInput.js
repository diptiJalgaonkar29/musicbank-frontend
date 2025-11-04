import React from "react";
import "./SonicSliderInput.css";

const SonicSliderInput = ({ className = "", onChange, ...props }) => {
  return (
    <input
      type="range"
      onChange={(e) => {
        // console.log("value", e.target.value);
        onChange(e.target.value);
      }}
      className={`SonicSliderInput ${className}`}
      {...props}
    />
  );
};

export default SonicSliderInput;
