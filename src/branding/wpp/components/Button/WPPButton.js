import React from "react";
import { WppButton } from "@wppopen/components-library-react";

import "../../theme/shadow-part.css";

const WPPButton = (props) => {
  const { children, size = "m", className = "", ...rest } = props;
  return (
    <WppButton
      variant="primary"
      size={size}
      className={`${className} ${size}`}
      {...rest}
    >
      {children}
    </WppButton>
  );
};
export default WPPButton;
