import React from "react";
import { WppInput } from "@wppopen/components-library-react";
import "../../theme/shadow-part.css";

export const WPPInput = ({ field, label = "", size = "lg", ...props }) => {
  return (
    <React.Fragment>
      <WppInput
        labelConfig={{ text: label }}
        class={`wpp_input ${size}`}
        type="text"
        {...field}
        {...props}
        onWppChange={props?.onChange || field?.onChange}
        disabled={props?.disabled}
      />
    </React.Fragment>
  );
};
