import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import "./MusicStyle.css";
import SelectWrapper from "../../../branding/componentWrapper/SelectWrapper";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { MultiSelect } from "react-multi-select-component";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import getAllTagMaster from "../../../cyanite/services/getAllTagMaster";

// Dropdown options
const energyAndTempo = [
  { label: "Slow", value: "Slow" },
  { label: "Medium Slow", value: "MeduimSlow" },
  { label: "Medium", value: "Medium" },
  { label: "Medium Fast", value: "MediumFast" },
  { label: "Fast", value: "Fast" },
  {
    label: "Match Tempo of Reference Track",
    value: "MatchTempoofReferenceTrack",
  },
];

const ASSET_TYPE_MASTER_GENRE = 7;

const MusicStyle = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const { musicStyle } = useSelector((state) => state.customTrackForm);
  const ampMainMoodTags = useSelector(
    (state) => state.taxonomy.ampMoodTagsIdAndLabelObj
  );
  const [genreOptions, setGenreOptions] = useState([]);

  const tonalityOptions = Object.entries(ampMainMoodTags || {})
    .map(([tagId, tagLabel]) => ({
      label: tagLabel,
      value: tagId,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    getAllTagMaster({
      masterId: ASSET_TYPE_MASTER_GENRE,
      onSuccess: (responseTags) => {
        //console.log("ASSET_TYPE_MASTER_GENRE", responseTags);
        const raw = responseTags?.data;
        if (!Array.isArray(raw)) {
          console.warn("Genre API did not return an array. Got:", raw);
          setGenreOptions([]);
          return;
        }
        const genreList = raw
          .filter((tag) => tag.status !== false)
          .map((tag) => ({
            label: tag.alternateTagName || tag.tagName,
            value: tag.tagId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setGenreOptions(genreList);
      },
      onError: (error) => {
        console.error("Failed to fetch genre options:", error);
      },
    });
  }, []);

  return (
    <div className="musicstyle-container">
      <Formik
        innerRef={formikRef}
        initialValues={musicStyle}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div>
              <div className="musicstyle-header">
                <FormattedMessage id="CustomTrackForm.musicStyle" />
              </div>

              <SonicInputLabel htmlFor="audioType">
                <FormattedMessage id="CustomTrackForm.energyTempo" />
              </SonicInputLabel>
              <Field
                id="audioType"
                name="audioType"
                options={energyAndTempo}
                component={SelectWrapper}
                placeholder={intl.formatMessage({
                  id: "CustomTrackForm.selectfromdropdown",
                })}
              />

              <SonicInputLabel htmlFor="tonality">
                <FormattedMessage id="CustomTrackForm.tonalties" />
              </SonicInputLabel>
              <MultiSelect
                id="tonality"
                name="tonality"
                options={tonalityOptions}
                value={values.tonality || []}
                onChange={(selected) => setFieldValue("tonality", selected)}
                disableSearch
                hasSelectAll
                labelledBy="Select"
                className="multi_select_genres_filter selectAll"
                overrideStrings={{
                  selectSomeItems: intl.formatMessage({
                    id: "CustomTrackForm.selectfromdropdown",
                  }),
                  allItemsAreSelected: "Select All",
                  selectAll: "Select All",
                }}
              />

              <SonicInputLabel htmlFor="genre">
                <FormattedMessage id="CustomTrackForm.genres" />
              </SonicInputLabel>
              <MultiSelect
                id="genre"
                name="genre"
                options={genreOptions}
                value={values.genre || []}
                onChange={(selected) => setFieldValue("genre", selected)}
                disableSearch
                hasSelectAll
                labelledBy="Select"
                className="multi_select_genres_filter selectAll"
                overrideStrings={{
                  selectSomeItems: intl.formatMessage({
                    id: "CustomTrackForm.selectfromdropdown",
                  }),
                  allItemsAreSelected: "Select All",
                  selectAll: "Select All",
                }}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MusicStyle;
