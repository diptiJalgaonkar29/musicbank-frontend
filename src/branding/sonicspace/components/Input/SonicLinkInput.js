import React, { useState, useEffect } from "react";
import "./SonicInput.css";
import { ReactComponent as LinkIcon } from "../../../../static/link-input-icon.svg";

const SonicLinkInput = ({
  field = {},
  form = {},
  size = "lg",
  className = "",
  onSearchClick,
  showSearchButton = false,
  ...props
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const effectiveValue = field?.value ?? props.value ?? "";
  const effectiveName = field?.name ?? props.name;
  const effectiveOnChange = field?.onChange ?? props.onChange;

  useEffect(() => {
    setShowSearch(showSearchButton && effectiveValue.trim() !== "");
  }, [effectiveValue, showSearchButton]);

  return (
    <div className="ss_link_input_container">
      <div className="ss_link_input_wrapper">
        <LinkIcon className="link-input-icon" />
        <input
          type="text"
          name={effectiveName}
          value={effectiveValue}
          onChange={effectiveOnChange}
          className={`ss_input ${size} ${className} ${
            form?.touched?.[effectiveName] && form?.errors?.[effectiveName]
              ? "invalid"
              : ""
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && showSearch && onSearchClick) {
              e.preventDefault();
              onSearchClick(effectiveValue);
            }
          }}
          autoComplete="off"
          {...props}
        />
        {showSearch && (
          <button
            type="button"
            className="link-search-btn"
            onClick={() => onSearchClick?.(effectiveValue)}
          >
            <p className="link-search-name">Search</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default SonicLinkInput;
