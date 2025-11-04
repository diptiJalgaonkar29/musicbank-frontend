import React from "react";
import "./SSToggle.css";

const SSToggle = ({ isSSToggleChecked, setIsSSToggleChecked }) => {
  return (
    <div className="SSToggle_wrapper">
      <label htmlFor="SSToggleCheckBox">Sonic Logo</label>
      <div className="SSToggle_container" id="button-10">
        <input
          type="checkbox"
          className="checkbox"
          id="SSToggleCheckBox"
          onChange={(e) => {
            setIsSSToggleChecked(e.target.checked);
          }}
          checked={isSSToggleChecked}
        />
        <div className="knobs">
          <span>on</span>
        </div>
        <div className="layer"></div>
      </div>
    </div>
  );
};

export default SSToggle;
