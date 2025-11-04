// Here's an example showing how to connect the airbnb rheostat slider to React InstantSearch using the
// range connector
import PropTypes from "prop-types";
import React, { Component, useEffect, useState } from "react";
import { connectRange } from "react-instantsearch-dom";
import Rheostat from "rheostat";
//import RheostatRangeSlider from "instantsearch-rheostat-range-slider-react";
//import { ClearRefinements, CurrentRefinements } from "react-instantsearch-dom";
//import CustomRefinementList from "./CustomRefinementLists";
import { ReactSVG } from "react-svg";
import MagnifingGlass from "../../../../static/magnifing-glass.svg";
import "./RangeSlider.css";

let prevSliderValL,
  prevSliderValR = 0;

const TRangeSlider = ({
  name,
  min,
  max,
  currentRefinement,
  refine,
  canRefine,
  label,
  inputMin,
  inputMax,
  inputVal,
}) => {
  const [state, setState] = useState({
    currentValues: {
      min: min,
      max: max,
      inputMin: min,
      inputMax: max,
      inputVal: min,
    },
  });

  useEffect(() => {
    if (canRefine) {
      setState({
        currentValues: {
          min: currentRefinement.min,
          max: currentRefinement.max,
          label: `Range: ${currentRefinement.min}-${currentRefinement.max}`,
        },
      });
    }
  }, [canRefine, currentRefinement]);

  const checkIsNaN = (_val) => (isNaN(_val) ? 0 : _val);

  const onValuesUpdated = (sliderState) => {
    setState({
      currentValues: {
        min: checkIsNaN(sliderState.values[0]),
        max: checkIsNaN(sliderState.values[1]),
        label: `Range: ${sliderState.values[0]}-${sliderState.values[1]}`,
      },
    });

    const inputEl = document.getElementsByClassName("custom-textInput")[0];
    if (inputEl) inputEl.value = "";
  };

  const onChange = (sliderState) => {
    if (
      sliderState.values[0] === prevSliderValL &&
      sliderState.values[1] === prevSliderValR
    ) {
      return;
    }

    let minVal = checkIsNaN(min);
    let maxVal = checkIsNaN(max);

    currentRefinement.min =
      currentRefinement.min === undefined || isNaN(currentRefinement.min)
        ? minVal
        : currentRefinement.min;
    currentRefinement.max =
      currentRefinement.max === undefined || isNaN(currentRefinement.max)
        ? maxVal
        : currentRefinement.max;

    if (
      sliderState.values[0] >= min &&
      sliderState.values[1] <= max &&
      (currentRefinement.min !== sliderState.values[0] ||
        currentRefinement.max !== sliderState.values[1])
    ) {
      currentRefinement.label = `Range${sliderState.values[0]}-${sliderState.values[1]}`;
      refine({
        min: checkIsNaN(sliderState.values[0]),
        max: checkIsNaN(sliderState.values[1]),
      });
    }

    prevSliderValL = sliderState.values[0];
    prevSliderValR = sliderState.values[1];
  };

  const handle = (props) => {
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

  const handleSubmit = () => {
    let inputValv = parseInt(state.inputVal);
    if (inputValv < min) inputValv = min;
    else if (inputValv > max) inputValv = max;

    let inputMinv = inputValv - 10;
    let inputMaxv = inputValv + 10;
    inputMinv = inputMinv >= min ? inputMinv : min;
    inputMaxv = inputMaxv <= max ? inputMaxv : max;

    setState({
      currentValues: { min: inputMinv, max: inputMaxv },
    });

    refine({ min: inputMinv, max: inputMaxv });
  };

  const updateInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      inputVal: e.target.value,
    }));
  };

  const validateInput = (evt) => {
    var custEvent = evt || window.event;
    var key;

    if (custEvent.type === "paste") {
      key = evt.clipboardData.getData("text/plain");
    } else {
      key = custEvent.keyCode || custEvent.which;
      key = String.fromCharCode(key);
    }

    if (!/[0-9]/.test(key)) {
      custEvent.returnValue = false;
      if (custEvent.preventDefault) custEvent.preventDefault();
    }
  };

  const slider = (
    <Rheostat
      className="ais-RangeSlider"
      min={min}
      max={max}
      values={[currentRefinement.min, currentRefinement.max]}
      onChange={onChange}
      onValuesUpdated={onValuesUpdated}
      handle={handle}
    />
  );

  const disabledSlider = (
    <Rheostat
      className="ais-RangeSlider"
      min={min}
      max={max}
      values={[min, max]}
      handle={handle}
      disabled={true}
    />
  );

  return (
    <div className="ais-RangeSlider-wrapper">
      <h4 className="rangeTitle">BPM (Tempo)</h4>
      {min !== max ? slider : disabledSlider}
      <div className="ais-RangeSlider-numbers">
        <div>{min}</div>
        <div>{max}</div>
      </div>
      <div className="custom-Input-wrapper">
        <div className="custom-inputicon-wrapper">
          <input
            className="custom-textInput"
            type="number"
            min={min}
            max={max}
            onChange={updateInput}
            onKeyPress={validateInput}
            disabled={min === max}
          />
          <ReactSVG
            svgstyle={{ transform: "scale(1)" }}
            className="custom-input-icon"
            src={`${MagnifingGlass}`}
          />
        </div>
        <button
          className="submitInput"
          type="submit"
          onClick={handleSubmit}
        >
          Search BPM
        </button>
      </div>
    </div>
  );
};

TRangeSlider.propTypes = {
  name: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  currentRefinement: PropTypes.object,
  refine: PropTypes.func.isRequired,
  canRefine: PropTypes.bool.isRequired,
  label: PropTypes.string,
  inputMin: PropTypes.number,
  inputMax: PropTypes.number,
  inputVal: PropTypes.number,
};

export default connectRange(TRangeSlider);
