import React from "react";
import { WppToggle } from "@wppopen/components-library-react";

const WPPToggle = ({
  field,
  label = "",
  bgColor = "var(--color-primary)",
  ...props
}) => (
  <>
    <WppToggle
      labelConfig={{ text: label }}
      {...field}
      {...props}
      className={bgColor}
      style={{
        "--toggle-bg-color-hover": `var(${bgColor})`,
        "--toggle-bg-color-checked": `var(${bgColor})`,
      }}
      onWppChange={props?.onChange || field?.onChange}
      required
      size="s"
    />
  </>
);

export default WPPToggle;
