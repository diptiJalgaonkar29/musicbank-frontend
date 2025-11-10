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

   // ✅ Detect theme editor mode from URL
 // For hash router URLs like #/path?editor=theme
  const hash = window.location.hash;
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const searchParams = new URLSearchParams(queryString);
  const isThemeEditor = searchParams.get("editor") === "theme";

  return (
    <React.Fragment>
      <div className={`ss_textarea_container ${
          isThemeEditor ? "ss_theme_editor_textarea" : "other_textarea"
        }`}>
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
