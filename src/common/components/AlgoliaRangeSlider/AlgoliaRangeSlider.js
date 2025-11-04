import React, { useEffect, useRef, useState } from "react";
import { useRange } from "react-instantsearch";
import { RangeSlider as SpectrumRangeSlider } from "@adobe/react-spectrum";
import "./AlgoliaRangeSlider.css";
import { ReactComponent as Slider } from "../../../static/Slider.svg";

const AlgoliaRangeSlider = ({ attribute, onRangeInfo }) => {
  const { start, range, canRefine, refine } = useRange({ attribute });
  const { min, max } = range;

  const [value, setValue] = useState({ start: min, end: max });
  const [thumbPositions, setThumbPositions] = useState({ left: 0, right: 0 });

  const wrapperRef = useRef(null);

  const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min);
  const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max);

  useEffect(() => {
    setValue({ start: from, end: to });
  }, [from, to]);

  useEffect(() => {
    if (range?.min != null && range?.max != null) {
      onRangeInfo?.({ min: range.min, max: range.max });
    }
  }, [range.min, range.max, onRangeInfo]);

  useEffect(() => {
    const updateThumbPositions = () => {
      if (!wrapperRef.current) return;

      const thumbs = wrapperRef.current.querySelectorAll(
        '[class*="Slider-handle"]'
      );

      if (thumbs.length === 2) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const leftThumb = thumbs[0].getBoundingClientRect();
        const rightThumb = thumbs[1].getBoundingClientRect();

        setThumbPositions({
          left: leftThumb.left - wrapperRect.left + leftThumb.width / 2,
          right: rightThumb.left - wrapperRect.left + rightThumb.width / 2,
        });
      }
    };

    updateThumbPositions();
    window.addEventListener("resize", updateThumbPositions);

    const observer = new MutationObserver(updateThumbPositions);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateThumbPositions);
      observer.disconnect();
    };
  }, [value]);

  return (
    <div
      ref={wrapperRef}
      className={` custom-spectrum-slider ${
        value.start === min && value.end === max ? "" : "filtered"
      }`}
    >
      <SpectrumRangeSlider
        label=" "
        minValue={min}
        maxValue={max}
        value={value}
        onChange={setValue}
        onChangeEnd={({ start, end }) => refine([start, end])}
        isDisabled={!canRefine}
      />
      <div className="slider-thumb-labels">
        <span
          className="slider-value-label"
          style={{ left: `${thumbPositions.left}px` }}
        >
          {value.start}
        </span>
        <span
          className="slider-value-label"
          style={{ left: `${thumbPositions.right}px` }}
        >
          {value.end}
        </span>
      </div>
      <div className="slider-thumb-icon">
        <span
          className="slider-value-label slider-start-icon"
          style={{ left: `${thumbPositions.left}px` }}
        >
          <Slider />
        </span>
        <span
          className="slider-value-label"
          style={{ left: `${thumbPositions.right}px` }}
        >
          <Slider />
        </span>
      </div>
    </div>
  );
};

export default AlgoliaRangeSlider;
