import React from "react";
import "./SonicInput.css";

const SonicInput = ({ field, form, size = "lg", className, ...props }) => {
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Only trim if value is a string
    if (typeof value === "string") {
      form?.setFieldValue?.(name, value.trim());
    }

    // Also mark field as touched
    form?.setFieldTouched?.(name, true);
  };
  return (
    <React.Fragment>
      <div className={`ss_input_container`}>
        {/* <label htmlFor={id} className="ss_input_label">
          {label}
        </label> */}
        <input
          type="text"
          {...field}
          {...props}
          onBlur={handleBlur}
          className={`ss_input ${size} ${className} ${
            form?.touched[field.name] && form?.errors[field.name]
              ? "invalid"
              : ""
          }`}
        />
      </div>

      {/* {touched[field.name] && errors[field.name] && (
        <div className="ss_error_msg">{errors[field.name]}</div>
      )} */}
    </React.Fragment>
  );
};

export default SonicInput;
