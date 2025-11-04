import React, { useState } from "react";
import "./MultipleCheckBoxes.css";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import { Field } from "formik";
import capitalizeFirstLetter from "../../../common/utils/capitalizeFirstLetter";

export default function MutipleCheckBoxes({
  mediaTypeList,
  mediaTypeParentId,
  name,
  setFieldValue,
}) {
  const [otherMedia, setOtherMedia] = useState("");

  const handleOtherMediaType = (text) => {
    setFieldValue(`otherMedia-${mediaTypeParentId}`, text.trim());
    setOtherMedia(text.trim());
  };

  return (
    <div className="checkboxes-container">
      <ul className="mediaTypeList-list">
        {mediaTypeList?.map(
          ({ mediaType, mediaId, parentId, parentMedia }, index) => {
            return (
              <li key={index} className="mediaTypeList-list-item">
                <Field
                  name={name}
                  value={`${parentId}-${parentMedia}-${mediaId}-${mediaType}`} //'1-Traditional-1-Banner',...
                  id={mediaType}
                  type="checkbox"
                  component={CheckboxWrapper}
                  label={capitalizeFirstLetter(mediaType)}
                />
              </li>
            );
          }
        )}
        <li className="mediaTypeList-list-item">
          <div>
            <div className="left-section others-section">
              <label className="checkbox-label">
                <Field
                  component={CheckboxWrapper}
                  checked={!!otherMedia?.trim()}
                  label="Other"
                />
                <input
                  type="text"
                  autoComplete="off"
                  name={"otherMedia"}
                  value={otherMedia}
                  onChange={(e) => handleOtherMediaType(e.target.value)}
                  className="mb_input_other"
                />
              </label>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
