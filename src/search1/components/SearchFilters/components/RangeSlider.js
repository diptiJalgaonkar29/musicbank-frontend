import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connectRange } from "react-instantsearch-dom";
import "./RangeSlider.css";

import ChipWrapper from "../../../../branding/componentWrapper/ChipWrapper";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import RangeSliderWrapper from "../../../../branding/componentWrapper/RangeSliderWrapper";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";

let prevSliderValL = 0, prevSliderValR = 0;

const tempoRange = {
  Slow: { min: 1, max: 66, isFirst: true },
  "Medium Slow": { min: 67, max: 76 },
  Medium: { min: 77, max: 108 },
  "Medium Fast": { min: 109, max: 120 },
  Fast: { min: 121, max: 300, isLast: true },
};

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
  const [currentValues, setCurrentValues] = useState({
    min: min,
    max: max,
    inputMin: min,
    inputMax: max,
    inputVal: min,
  });

  useEffect(() => {
    if (canRefine) {
      setCurrentValues({
        min: currentRefinement.min,
        max: currentRefinement.max,
        label: `Range: ${currentRefinement.min}-${currentRefinement.max}`,
      });
    }
  }, [canRefine, currentRefinement]);

  const onValuesUpdated = useCallback((sliderState) => {
    setCurrentValues({
      min: checkIsNaN(sliderState.values[0]),
      max: checkIsNaN(sliderState.values[1]),
      label: `Range: ${sliderState.values[0]}-${sliderState.values[1]}`,
    });
    const input = document.getElementsByClassName("custom-textInput")[0];
    if (input) input.value = "";
  }, []);

  const onChange = useCallback((sliderState) => {
    if (
      sliderState.values[0] === prevSliderValL &&
      sliderState.values[1] === prevSliderValR
    ) return;

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
  }, [refine, currentRefinement, min, max]);

  const handle = useCallback((props) => {
    const valNow =
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
  }, []);

  const handleBPMButtonRange = useCallback(
    ({ min: rangeMin, max: rangeMax, isFirst = false, isLast = false }) => {
      let inputMinv = isFirst ? min : rangeMin;
      let inputMaxv = isLast ? max : rangeMax;

      inputMinv = inputMinv >= min ? inputMinv : min;
      inputMaxv = inputMaxv <= max ? inputMaxv : max;

      if (inputMinv >= inputMaxv) {
        inputMaxv = inputMinv;
      }

      setCurrentValues({ min: inputMinv, max: inputMaxv });

      refine({ min: inputMinv, max: inputMaxv });
    },
    [min, max, refine]
  );

  const handleSubmit = useCallback(() => {
    let inputValv = parseInt(currentValues.inputVal);
    if (inputValv < min) inputValv = min;
    else if (inputValv > max) inputValv = max;

    let inputMinv = inputValv - 10;
    let inputMaxv = inputValv + 10;
    inputMinv = inputMinv >= min ? inputMinv : min;
    inputMaxv = inputMaxv <= max ? inputMaxv : max;

    setCurrentValues({ min: inputMinv, max: inputMaxv });

    refine({ min: inputMinv, max: inputMaxv });
  }, [currentValues.inputVal, min, max, refine]);

  const updateInput = useCallback((e) => {
    setCurrentValues(prev => ({
      ...prev,
      inputVal: e.target.value,
    }));
  }, []);

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

  const checkIsNaN = (_val) => (isNaN(_val) ? 0 : _val);

  if (min === 0 && max === 0) {
    return <div className="no_tempo_data">No results</div>;
  }

  const isDisabled = min === max;

  return (
    <div className="ais-RangeSlider-wrapper">
      <RangeSliderWrapper
        min={min || 0}
        max={max || 0}
        values={[currentRefinement.min || 0, currentRefinement.max || 0]}
        onChange={onChange}
        handle={handle}
        disabled={isDisabled}
      />

      <div className="ais-RangeSlider-tempo">
        <div className="ais-RangeSlider-tempoSlowFast">
          {["Slow", "Fast"].map((tempo) => (
            <ChipWrapper
              key={tempo}
              label={tempo}
              onClick={() => handleBPMButtonRange(tempoRange?.[tempo])}
            />
          ))}
        </div>
        <div className="ais-RangeSlider-tempoRange">
          {["Medium Slow", "Medium", "Medium Fast"].map((tempo) => (
            <ChipWrapper
              key={tempo}
              label={tempo}
              onClick={() => handleBPMButtonRange(tempoRange?.[tempo])}
            />
          ))}
        </div>
      </div>

      <div className="custom-Input-wrapper">
        <div className="custom-inputicon-wrapper">
          <InputWrapper
            size="s"
            type="number"
            min={min}
            max={max}
            placeholder="Search BPM..."
            onChange={updateInput}
            onKeyPress={validateInput}
          />
        </div>
        <IconButtonWrapper
          icon="Search"
          className="submitInput"
          type="submit"
          onClick={handleSubmit}
        />
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
