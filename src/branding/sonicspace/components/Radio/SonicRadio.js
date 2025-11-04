import React from "react";
import "./SonicRadio.css";

const SonicRadio = (props) => {
  const { field, ...rest } = props;
  return (
    <span className="SonicRadio_container">
      <input {...field} {...rest} type="radio" />
    </span>
  );
};
export default SonicRadio;
