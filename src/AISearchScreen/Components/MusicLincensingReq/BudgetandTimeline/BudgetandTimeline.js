import React from "react";
import "./BudgetandTimeline.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";

import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { MultiSelect } from "react-multi-select-component";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import DatePickerField from "../../../../common/components/CustomDatePicker/CustomDatePicker";
import AmountInput from '../../../../common/components/AmountInput/AmountInput';

const BudgetandTimeline = () => {
  const today = new Date();
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Project title is required"),
    projectName: Yup.string().required("Focus of your content is required"),
    projectAssetList: Yup.string().required(
      "Focus of your content is required"
    ),
  });

  return (
    <div className="budgetandTimeline-container">
      <Formik
        initialValues={
          {
            //  ...customTrackForm,
          }
        }
        validateOnMount
        validationSchema={validationSchema}
        // onSubmit={handleFormSubmit}
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
          <form className="budgetandTimeline-form">
            <div className="page_title">
              <FormattedMessage
                id={"MusicLicensingReqest.contextandUsageHeading"}
              />
            </div>

            <div>
              Reserve
              {/* <AmountInput /> */}
            </div>

            {/* Project TimeLine */}

            <div className="budgetandTimeline_date">
              <div>
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage
                    id={"MusicLicensingReqest.usageandLicenseHeading"}
                  />
                </SonicInputLabel>
              </div>
              <div className="budgetandTimeline_Bothdate">
                <div className="budgetandTimeline-Datestart">
                  <div className='budgetandTimeline_startbox'>
                    <div className='budgetandTimeline_startHead'>Start Date</div>
                    <DatePickerField
                    placeholderText={intl.formatMessage({
                      id: "CustomTrackForm.deadlinePlaceholder",
                    })}
                    name="deadline"
                    minDate={today}
                    showYearDropdown
                  />
                  </div>
                  <div className='budgetandTimeline_startbox'>
                    <div className='budgetandTimeline_startHead'>End Date</div>
                    <DatePickerField
                    placeholderText={intl.formatMessage({
                      id: "CustomTrackForm.deadlinePlaceholder",
                    })}
                    name="deadline"
                    minDate={today}
                    showYearDropdown
                  />
                  </div>
                </div>
              </div>
            </div>

            {/*leagal Service*/}

            <div>
              <SonicInputLabel htmlFor="projectTitle">
                <FormattedMessage
                  id={"MusicLicensingReqest.usageandLicenseHeading"}
                />
              </SonicInputLabel>

              <div>
                <div className="budgetandTimeline-legalService">
                  <SonicInputLabel htmlFor="projectTitle">
                    <FormattedMessage
                      id={"MusicLicensingReqest.mediaPlanAvaiHeading"}
                    />
                  </SonicInputLabel>
                  <div className="contextMusicOption">
                    <div className="budgetandTimeline_musicOption">
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
                    <div className="budgetandTimeline_musicOption">
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
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default BudgetandTimeline;
