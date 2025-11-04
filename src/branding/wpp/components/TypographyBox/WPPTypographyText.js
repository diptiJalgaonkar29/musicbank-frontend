import React from "react";
import { WppTypography } from "@wppopen/components-library-react";
import "@wppopen/components-library/dist/platform-ui-kit/wpp-theme.css";

const WPPTypographyText = (props) => {
  const { children, ...rest } = props;
  return (
    <WppTypography type={props.type} {...rest}>
      {children}
    </WppTypography>
  );
};
export default WPPTypographyText;
