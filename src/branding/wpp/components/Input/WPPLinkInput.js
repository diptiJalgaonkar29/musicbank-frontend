// src/wpp/components/Input/WPPLinkInput.js
import React from "react";
import { WppInput } from "@wppopen/components-library-react";
import { ReactComponent as LinkIcon } from "../../../../static/link-input-icon.svg"; // adjust if your path is different
import "../../theme/shadow-part.css";

export const WPPLinkInput = ({ field, label = "", size = "lg", ...props }) => {
  return (
    <div className="wpp_link_input_container">
      <LinkIcon className="link-input-icon" />
      <WppInput
        labelConfig={{ text: label }}
        class={`wpp_input ${size}`}
        type="text"
        {...field}
        {...props}
        onWppChange={props?.onChange || field?.onChange}
        disabled={props?.disabled}
      />
      <button type="button" className="link-search-btn">
        Search
      </button>
    </div>
  );
};
