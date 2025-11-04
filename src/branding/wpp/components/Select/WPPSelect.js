import React from "react";
import { WppSelect, WppListItem } from "@wppopen/components-library-react";

export const WPPSelect = ({
  field,
  label = "",
  options,
  name,
  id,
  value,
  ...props
}) => {
  return (
    <React.Fragment>
      <WppSelect
        labelConfig={{ text: label }}
        {...field}
        {...props}
        onWppChange={props?.onChange || field?.onChange}
      >
        {options.map((contry) => (
          <WppListItem key={contry.label} value={contry.label}>
            <p slot="label">{contry.label}</p>
          </WppListItem>
        ))}
      </WppSelect>
    </React.Fragment>
  );
};
