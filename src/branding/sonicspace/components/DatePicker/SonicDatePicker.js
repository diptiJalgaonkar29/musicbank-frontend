import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import "./SonicDatePicker.css";

const SonicDatePicker = ({ className = "", ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        id="date-picker-dialog"
        views={["month", "year"]}
        openTo="year"
        {...props}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            className={`sonic_datepicker ${className}`}
            autoComplete="off"
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default SonicDatePicker;
