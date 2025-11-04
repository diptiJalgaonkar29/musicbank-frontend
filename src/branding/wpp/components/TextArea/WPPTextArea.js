import React from "react";
import { WppTextareaInput } from "@wppopen/components-library-react";

export const WPPTextArea = ({ field, label = "", ...props }) => {
  return (
    <React.Fragment>
      <WppTextareaInput
        {...field}
        {...props}
        labelConfig={{ text: label }}
        onWppChange={props?.onChange || field?.onChange}
      />
    </React.Fragment>
  );
};
