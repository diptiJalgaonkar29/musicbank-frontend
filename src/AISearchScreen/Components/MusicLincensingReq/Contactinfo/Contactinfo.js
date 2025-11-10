import React from "react";
import "./Contactinfo.css";
import MainLayout from "../../../../common/components/MainLayout/MainLayout";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";

const Contactinfo = () => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    contactName: Yup.string().required("Contact Name is required"),
    agencyName: Yup.string().required("Agency Name is required"),
    emailAddress: Yup.string().required("Email Address is required"),
    location: Yup.string().required("Location is required"),
  });

  return (
    <div className="contactInfoForm-container">
      <Formik
        initialValues={{}}
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
          <form>
            <div className="page_title">
              <FormattedMessage id={"MusicLicensingReqest.contactInfoTitle"} />
            </div>
            <SonicInputLabel htmlFor="projectTitle">
              <FormattedMessage
                id={"MusicLicensingReqest.primaryConatctName"}
              />
            </SonicInputLabel>
            <Field
              id="contactName"
              name="contactName"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.primaryConatctName",
              })}
              component={InputWrapper}
            />
            {errors.contactName && touched.contactName && (
              <p className="report_form_error">{errors.contactName}</p>
            )}
            <br />
            <br />
            <SonicInputLabel htmlFor="projectTitle">
              <FormattedMessage id={"MusicLicensingReqest.agencyName"} />
            </SonicInputLabel>
            <Field
              id="agencyName"
              name="agencyName"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.agencyNamePlaceholder",
              })}
              component={InputWrapper}
            />
            {errors.agencyName && touched.agencyName && (
              <p className="report_form_error">{errors.agencyName}</p>
            )}
            <br />
            <br />
            <div className="contact-filleds">
              <div className="email-filled">
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage id={"MusicLicensingReqest.emailAddress"} />
                </SonicInputLabel>
                <Field
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "MusicLicensingReqest.emailAddressPlaceholder",
                  })}
                  component={InputWrapper}
                />
                {errors.emailAddress && touched.emailAddress && (
                  <p className="report_form_error">{errors.emailAddress}</p>
                )}
              </div>
              <div className="number-filled">
                <SonicInputLabel htmlFor="projectTitle">
                  <FormattedMessage id={"MusicLicensingReqest.phoneNumber"} />
                </SonicInputLabel>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "MusicLicensingReqest.phoneNumberPlaceholder",
                  })}
                  component={InputWrapper}
                />
               
              </div>
            </div>
            <br />
            <br />
            <SonicInputLabel htmlFor="projectTitle">
              <FormattedMessage id={"MusicLicensingReqest.location"} />
            </SonicInputLabel>
            <Field
              id="location"
              name="location"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.locationPlaceholder",
              })}
              component={InputWrapper}
            />
            {errors.location && touched.location && (
              <p className="report_form_error">{errors.location}</p>
            )}
            <br />
            <br />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Contactinfo;
