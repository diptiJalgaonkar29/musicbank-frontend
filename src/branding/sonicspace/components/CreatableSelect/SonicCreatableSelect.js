import React from "react";
import "./SonicCreatableSelect.css";
import CreatableSelect from "react-select/creatable";
import { reactSelectCustomStyles } from "../../../../_styles/reactSelectCustomStyles";

const SonicCreatableSelect = ({ field, form, options, ...props }) => {
  const handleChange = (selectedOption) => {
    form.setFieldValue(field.name, selectedOption);
  };

  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <div className={`ss_select_container`}>
      <CreatableSelect
        isClearable
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

export default SonicCreatableSelect;
