import React from "react";
import { useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import { Autocomplete } from "downshift";
import { useIntl } from "react-intl";

const DatePickerField = ({ name, ...props }) => {
  const { setFieldValue, setFieldTouched, values, errors, touched } =
    useFormikContext();
  const intl = useIntl();
  return (
    <>
      <DatePicker
        id={name}
        portalId="root"
        properPlacement="bottom-start"
        selected={values[name] ? new Date(values[name]) : null}
        onChange={(val) => setFieldValue(name, val)}
        onBlur={() => setFieldTouched(name, true)}
        dateFormat="dd/MM/yyyy"
        //placeholderText="Select a deadline"
        // placeholderText={intl.formatMessage({
        //   id: "CustomTrackForm.deadlinePlaceholder",
        // })}
        //placeholderText='{}'
        className="custom-datepicker"
        autoComplete="off"
        {...props} // ✅ Spread any additional props like minDate
      />
      {errors[name] && touched[name] && (
        <p className="report_form_error">{errors[name]}</p>
      )}
    </>
  );
};

export default DatePickerField;
