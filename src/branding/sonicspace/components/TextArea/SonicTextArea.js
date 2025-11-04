import React from "react";
import "./SonicTextArea.css";

const SonicTextArea = ({ field, className = "", form, ...props }) => {
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
      <div className={`ss_textarea_container`}>
        {/* <label htmlFor={id} className="ss_textarea_label">
          {label}
        </label> */}
        <textarea
          type="text"
          {...field}
          {...props}
          onBlur={handleBlur}
          className={`ss_textarea ${className}`}
        />
      </div>

      {/* {touched[field.name] && errors[field.name] && (
        <div className="ss_error_msg">{errors[field.name]}</div>
      )} */}
    </React.Fragment>
  );
};

export default SonicTextArea;
