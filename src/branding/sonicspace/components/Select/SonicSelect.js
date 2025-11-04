import React from "react";
import Select from "react-select";
import "./SonicSelect.css";
import { reactSelectCustomStyles } from "../../../../_styles/reactSelectCustomStyles";

const SonicSelect = ({ field, form, options, ...props }) => {
  const handleChange = (selectedOption) => {
    form.setFieldValue(field.name, selectedOption);
  };

  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <div className={`ss_select_container`}>
      <Select
        options={options}
        name={field.name}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        styles={reactSelectCustomStyles(form.touched, form.errors, field.name)}
        {...props}
      />
    </div>
  );
};

export default SonicSelect;
