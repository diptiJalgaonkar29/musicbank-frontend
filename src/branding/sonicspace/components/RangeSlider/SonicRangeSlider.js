import React from "react";
import "./SonicRangeSlider.css";
import Rheostat from "rheostat";

const SonicRangeSlider = ({ min, max, disabled = false, ...props }) => {
  const handle = (props) => {
    //console.log("handle " + props['aria-valuenow'])
    let valNow =
      props["aria-valuenow"] === undefined || isNaN(props["aria-valuenow"])
        ? ""
        : props["aria-valuenow"];

    return (
      <div className="slideCtrBox">
        <button
          type="button"
          aria-label={props["data-handle-key"] === 0 ? "From" : "To"}
          {...props}
          tabIndex={props["aria-disabled"] ? -1 : props.tabIndex}
        >
          <div className="slideCtrLbl">{valNow}</div>
        </button>
      </div>
    );
  };
  return (
    <div
      className={`sonic-rangeslider-wrapper ${
        disabled ? "sonic-rangeslider-wrapper-disabled" : ""
      }`}
    >
      <Rheostat
        className="sonic-rangeslider"
        min={min}
        max={max}
        disabled={disabled}
        handle={handle}
        {...props}
      />
      <div className="sonic-rangeslider-numbers">
        <div>{min}</div>
        <div>{max}</div>
      </div>
    </div>
  );
};

export default SonicRangeSlider;
