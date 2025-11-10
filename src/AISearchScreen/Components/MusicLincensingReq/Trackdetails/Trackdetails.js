import React, { useState } from "react";
import "./Trackdetails.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import FileInputWrapper from "../../../../branding/componentWrapper/FileInputWrapper";

const Trackdetails = ({ formikRef, onSubmit }) => {
  // const [alternativesOption , setAlternativesOption] = useState(null);
  // const [briefingAvailableOption , setBriefingAvailableOption] = useState(null);
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    requestTrack: Yup.string().required("Requested track is required"),
    alternativesOption: Yup.string().required("Please select an option"),
    briefingAvailableOption: Yup.string().required("Please select an option"),
  });

  return (
    <div className="trackdetails-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          requestTrack: "",
          alternativesOption: "",
          briefingAvailableOption: "",
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
          <form>
            <div className="page_title">
              {" "}
              <FormattedMessage
                id={"MusicLicensingReqest.trackDetailsHeading"}
              />
            </div>
            <SonicInputLabel htmlFor="projectTitle">
              <span className="project-label">
                <FormattedMessage id="MusicLicensingReqest.requestedTrack" />
              </span>
            </SonicInputLabel>

            <br />
            <Field
              id="requestTrack"
              name="requestTrack"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.requestedTrackPlaceholder",
              })}
              component={InputWrapper}
            />
            {errors.requestTrack && touched.requestTrack && (
              <p className="report_form_error">{errors.requestTrack}</p>
            )}
            <br />
            <br />

            <div className="openToAlter">
              <FormattedMessage
                id={"MusicLicensingReqest.alternativesOptionsHeading"}
              />

              <div className="openToAlter-option">
                <div className="openToAlter-option-A">
                  <Field
                    name="alternativesOption"
                    id="alternativesOption-Yes"
                    type="radio"
                    value="Yes"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="alternativesOption-Yes">
                      <FormattedMessage
                        id={"MusicLicensingReqest.optionsYes"}
                      />
                    </label>
                  </div>
                </div>

                <div className="openToAlter-option-A">
                  <Field
                    name="alternativesOption"
                    id="alternativesOption-No"
                    type="radio"
                    value="No"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="alternativesOption-No">
                      <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {errors.alternativesOption && touched.alternativesOption && (
              <p className="report_form_error">{errors.alternativesOption}</p>
            )}

            <div className="openToAlter">
              <FormattedMessage
                id={"MusicLicensingReqest.briefingAvailableOption"}
              />
              <div className="openToAlter-option">
                <div className="openToAlter-option-A">
                  <Field
                    name="briefingAvailableOption"
                    id="briefingAvailableOption-Yes"
                    type="radio"
                    value="Yes"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="briefingAvailableOption-Yes">
                      <FormattedMessage
                        id={"MusicLicensingReqest.optionsYes"}
                      />
                    </label>
                  </div>
                </div>
                <div className="openToAlter-option-A">
                  <Field
                    name="briefingAvailableOption"
                    id="briefingAvailableOption-No"
                    type="radio"
                    value="No"
                    component={RadioWrapper}
                  />
                  <div>
                    <label htmlFor="briefingAvailableOption-No">
                      <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {errors.briefingAvailableOption &&
              touched.briefingAvailableOption && (
                <p className="report_form_error">
                  {errors.briefingAvailableOption}
                </p>
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

export default Trackdetails;
