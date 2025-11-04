import React from "react";
import { WppRadio } from "@wppopen/components-library-react";

const WPPRadio = ({ field, label = "", name, id, value, ...props }) => (
  <WppRadio
    labelConfig={{ text: label }}
    {...field}
    {...props}
    onWppChange={props?.onChange || field?.onChange}
    required
  />
);

export default WPPRadio;
