import React from "react";
import "./BudgetandTimeline.css";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import DatePickerField from "../../../../common/components/CustomDatePicker/CustomDatePicker";
import { useSelector } from 'react-redux';

const BudgetandTimeline = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const today = new Date();

  const budgetAndTimeline = useSelector((state) => state.musicLicensingForm.budgetAndTimeline) || {};

  const validationSchema = Yup.object().shape({
    budget: Yup.number()
      .typeError("Enter valid amount")
      .required("Budget is required")
      .min(0, "Budget cannot be negative"),

    startDate: Yup.date().required("Start date is required"),

    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before Start Date"),

    mediaPlanAvai: Yup.string().required("Please select an option"),
  });

  return (
    <div className="budgetandTimeline-container">
      <Formik
        innerRef={formikRef}
        initialValues={budgetAndTimeline}
        validationSchema={validationSchema}
        validateOnMount
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="budgetandTimeline-form">
            {/* Page Heading */}
            <div className="page_title">
              <FormattedMessage id="MusicLicensingReqest.budgetandTimelineHeading" />
            </div>

            {/* Budget Input */}
            <div className="budget-input-wrapper-main">
              <div className='budget-input-wrapper'><label htmlFor="musicBudget" className="budget-label">
                <FormattedMessage id="MusicLicensingReqest.estimatedBudget" />
              </label>

              <div className="budget-input-field">
                <span className="currency-symbol">€</span>
                <Field
                  type="number"
                  id="budget"
                  name="budget"
                  placeholder="0"
                  min="0"
                  className="budget-input"
                />
              </div></div>
              

              {touched.budget && errors.budget && (
                <p className="report_form_error">{errors.budget}</p>
              )}
            </div>

            {/* Timeline */}
            <div className="budgetandTimeline_date">
              <SonicInputLabel>
                <FormattedMessage id="MusicLicensingReqest.projectTimeline" />
              </SonicInputLabel>

              <div className="budgetandTimeline_Bothdate">
                {/* Start Date */}
                <div className="budgetandTimeline_startbox">
                  <div className="budgetandTimeline_startHead">Start Date</div>
                  <DatePickerField
                    name="startDate"
                    minDate={today}
                    placeholderText={intl.formatMessage({
                      id: "MusicLicensingReqest.datePlaceholder",
                    })}
                  />
                  {/* {touched.startDate && errors.startDate && (
                    <p className="report_form_error">{errors.startDate}</p>
                  )} */}
                </div>

                {/* End Date */}
                <div className="budgetandTimeline_startbox">
                  <div className="budgetandTimeline_startHead">End Date</div>
                  <DatePickerField
                    name="endDate"
                    minDate={today}
                    placeholderText={intl.formatMessage({
                      id: "MusicLicensingReqest.datePlaceholder",
                    })}
                  />
                  {/* {touched.endDate && errors.endDate && (
                    <p className="report_form_error">{errors.endDate}</p>
                  )} */}
                </div>
              </div>
            </div>

            {/* License Agreement Radio */}
            <div className="leagal-heading">
              <SonicInputLabel className="leagal-heading">
                <FormattedMessage id="MusicLicensingReqest.legalServicesHeading" />
              </SonicInputLabel>
            </div>

            <div className="contextMusicOption">
              <SonicInputLabel>
                <FormattedMessage id="MusicLicensingReqest.licenseAgreement" />
              </SonicInputLabel>

              <div className="contextMedia-Options">
                <div className="budgetandTimeline_musicOption">
                  <Field
                    name="mediaPlanAvai"
                    id="mediaPlanAvaiYes"
                    type="radio"
                    value="yes"
                    component={RadioWrapper}
                  />
                  <label htmlFor="mediaPlanAvaiYes">
                    <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiYes" />
                  </label>
                </div>

                <div className="budgetandTimeline_musicOption">
                  <Field
                    name="mediaPlanAvai"
                    id="mediaPlanAvaiNo"
                    type="radio"
                    value="no"
                    component={RadioWrapper}
                  />
                  <label htmlFor="mediaPlanAvaiNo">
                    <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiNo" />
                  </label>
                </div>
              </div>

              {touched.mediaPlanAvai && errors.mediaPlanAvai && (
                <p className="report_form_error">{errors.mediaPlanAvai}</p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BudgetandTimeline;
