import React from "react";
import "./ContextandUse.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import FileInputWrapper from "../../../../branding/componentWrapper/FileInputWrapper";

const ContextandUse = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    licenseTypeOptions: Yup.string().required("License Type is required"),
    contextMusicOption: Yup.string().required(
      "Importance of Music is required"
    ),
    mediaPlanAvai: Yup.string().required("Media Plan is required"),
  });
  const ampMainMoodTags = useSelector(
    (state) => state.taxonomy.ampMoodTagsIdAndLabelObj
  );

  const airingRegionOption = [
    { label: "Major", value: "major" },
    { label: "Minor", value: "minor" },
    { label: "Neutral", value: "neutral" },
    { label: "Dark", value: "dark" },
    { label: "Bright", value: "bright" },
  ];

  return (
    <div className="contextandUse-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          licenseTypeOptions: "",
          contextMusicOption: "",
          mediaPlanAvai: "",
        }}
        validateOnMount
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          dirty,
          isValid,
          isSubmitting,
          handleSubmit,
        }) => (
          <form className="contextandUse-form">
            <div className="page_title">
              {" "}
              <FormattedMessage
                id={"MusicLicensingReqest.contextandUsageHeading"}
              />
            </div>
            <SonicInputLabel htmlFor="projectTitle">
              <FormattedMessage
                id={"MusicLicensingReqest.licenseTypeOptions"}
              />
            </SonicInputLabel>
            <div className="licenseTypeOptions">
              <div className="licenseTypeOptionsAll">
                <Field
                  name="licenseTypeOptions"
                  id="originalOption"
                  type="radio"
                  value="accept1"
                  component={RadioWrapper}
                />
                <div>
                  <label htmlFor="originalOption">
                    <FormattedMessage
                      id={"MusicLicensingReqest.originalOption"}
                    />
                  </label>
                </div>
              </div>
              <div className="licenseTypeOptionsAll">
                <Field
                  name="licenseTypeOptions"
                  id="customOption"
                  type="radio"
                  value="accept2"
                  component={RadioWrapper}
                />
                <div>
                  <label htmlFor="customOption">
                    <FormattedMessage
                      id={"MusicLicensingReqest.customOption"}
                    />
                  </label>
                </div>
              </div>
              <div className="licenseTypeOptionsAll">
                <Field
                  name="licenseTypeOptions"
                  id="TBDOption"
                  type="radio"
                  value="accept3"
                  component={RadioWrapper}
                />
                <div>
                  <label htmlFor="TBDOption">
                    <FormattedMessage id={"MusicLicensingReqest.TBDOption"} />
                  </label>
                </div>
              </div>
            </div>
            {errors.licenseTypeOptions && touched.licenseTypeOptions && (
              <p className="report_form_error">{errors.licenseTypeOptions}</p>
            )}
            <SonicInputLabel htmlFor="projectTitle">
              <FormattedMessage
                id={"MusicLicensingReqest.contextandMusicOptions"}
              />
            </SonicInputLabel>
            <div className="contextMusicOption">
              <div className="contextMusicOptionAll">
                <Field
                  name="contextMusicOption"
                  id="backgroundMusicOption"
                  type="radio"
                  value="accept1"
                  component={RadioWrapper}
                />
                <div>
                  <label htmlFor="backgroundMusicOption">
                    <FormattedMessage
                      id={"MusicLicensingReqest.backgroundMusicOption"}
                    />
                  </label>
                </div>
              </div>
              <div className="contextMusicOptionAll">
                <Field
                  name="contextMusicOption"
                  id="thematicOption"
                  type="radio"
                  value="accept2"
                  component={RadioWrapper}
                />
                <div>
                  <label htmlFor="thematicOption">
                    <FormattedMessage
                      id={"MusicLicensingReqest.thematicOption"}
                    />
                  </label>
                </div>
              </div>
            </div>
            {errors.contextMusicOption && touched.contextMusicOption && (
              <p className="report_form_error">{errors.contextMusicOption}</p>
            )}
            {/* Airing And Media Section*/}

            <div className="regionandMeadia-Section">
              <div className="region-dropdown">
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage
                    id={"MusicLicensingReqest.airingAndRegionDropdown"}
                  />
                </SonicInputLabel>
                <MultiSelect
                  id="airingRegionOption"
                  name="airingRegionOptionName"
                  options={airingRegionOption}
                  value={values.airingRegionOption || []}
                  // onChange={(selected) => setFieldValue("tonality", selected)}
                  disableSearch
                  hasSelectAll
                  labelledBy="Select"
                  className="multi_select_genres_filter selectAll"
                  overrideStrings={{
                    selectSomeItems: intl.formatMessage({
                      id: "MusicLicensingReqest.airingAndRegionDropdownPlaceholder",
                    }),
                    allItemsAreSelected: "Select All",
                    selectAll: "Select All",
                  }}
                />
              </div>
              <div className="region-dropdown">
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage
                    id={"MusicLicensingReqest.mediaTypeDropdown"}
                  />
                </SonicInputLabel>
                <MultiSelect
                  id="tonality"
                  name="tonality"
                  options={[]}
                  // value={values.tonality || []}
                  // onChange={(selected) => setFieldValue("tonality", selected)}
                  disableSearch
                  hasSelectAll
                  labelledBy="Select"
                  className="multi_select_genres_filter selectAll"
                  overrideStrings={{
                    selectSomeItems: intl.formatMessage({
                      id: "MusicLicensingReqest.mediaTypeDropdownPlaceholder",
                    }),
                    allItemsAreSelected: "Select All",
                    selectAll: "Select All",
                  }}
                />
              </div>
            </div>

            {/* Usage Duration Section*/}
            <div className="usage-duration-Section">
              <div>
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage
                    id={"MusicLicensingReqest.usageandLicenseHeading"}
                  />
                </SonicInputLabel>
              </div>
              <div className="usage-duration-Section-dropdown">
                <div className="region-dropdown">
                  <MultiSelect
                    id="tonality"
                    name="tonality"
                    options={[]}
                    // value={values.tonality || []}
                    // onChange={(selected) => setFieldValue("tonality", selected)}
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
                <div className="region-dropdown">
                  <MultiSelect
                    id="tonality"
                    name="tonality"
                    options={[]}
                    // value={values.tonality || []}
                    // onChange={(selected) => setFieldValue("tonality", selected)}
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
              </div>
            </div>

            {/* Media Plan Section*/}

            <div className="media-Plan-Section">
              <SonicInputLabel htmlFor="projectTitle">
                <FormattedMessage
                  id={"MusicLicensingReqest.mediaPlanAvaiHeading"}
                />
              </SonicInputLabel>
              <div className="contextMusicOption">
                <div className="contextMusicOptionAll">
                  <Field
                    name="mediaPlanAvai"
                    id="mediaPlanAvaiYes"
                    type="radio"
                    value="accept1"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="mediaPlanAvaiYes">
                      <FormattedMessage
                        id={"MusicLicensingReqest.mediaPlanAvaiYes"}
                      />
                    </label>
                  </div>
                </div>
                <div className="contextMusicOptionAll">
                  <Field
                    name="mediaPlanAvai"
                    id="mediaPlanAvaiNo"
                    type="radio"
                    value="accept2"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="mediaPlanAvaiNo">
                      <FormattedMessage
                        id={"MusicLicensingReqest.mediaPlanAvaiNo"}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {errors.mediaPlanAvai && touched.mediaPlanAvai && (
              <p className="report_form_error">{errors.mediaPlanAvai}</p>
            )}

            <Field
              id="mediaFile"
              name="mediaFile"
              type="file"
              accept=".pdf"
              placeholder={intl.formatMessage({
                id: "CustomTrackForm.uploadBrief",
              })}
              component={FileInputWrapper}
              disabled={!!values.mediaFile} // ✅ disable when file is present
              // filePreviewName={creativeBriefing.mediaFile} // ✅ new prop
              onFileSelect={async (file) => {
                //  uploadFileFunction(file, values);
              }}
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ContextandUse;
