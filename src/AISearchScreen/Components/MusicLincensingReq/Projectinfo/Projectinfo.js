import React from "react";
import "./Projectinfo.css";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { FormattedMessage, useIntl } from "react-intl";
import TextAreaWrapper from "../../../../branding/componentWrapper/TextAreaWrapper";

const Projectinfo = ({ formikRef, onSubmit }) => {
  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company name is required"),
    projectName: Yup.string().required("Project name is required"),
    projectAssetList: Yup.string().required(
      "Project asset list is required"
    ),
  });

  return (
    <div className="projectinfo-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          companyName: "",
          projectName: "",
          projectPurpose: "",
          projectAssetList: "",
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
              <FormattedMessage id={"MusicLicensingReqest.projectInfoTitle"} />
            </div>
            <SonicInputLabel htmlFor="companyName">
              <FormattedMessage id={"MusicLicensingReqest.companyName"} />
            </SonicInputLabel>
            <Field
              id="companyName"
              name="companyName"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.companyNamePlaceholder",
              })}
              component={InputWrapper}
            />
            {errors.companyName && touched.companyName && (
              <p className="report_form_error">{errors.companyName}</p>
            )}
            <br />
            <br />
            <SonicInputLabel htmlFor="projectName">
              <FormattedMessage id={"MusicLicensingReqest.projectName"} />
            </SonicInputLabel>
            <Field
              id="projectName"
              name="projectName"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.projectNamePlaceholder",
              })}
              component={InputWrapper}
            />
            {errors.projectName && touched.projectName && (
              <p className="report_form_error">{errors.projectName}</p>
            )}
            <br />
            <br />
            <SonicInputLabel htmlFor="projectPurpose">
              <FormattedMessage
                id={"MusicLicensingReqest.projectPurposeOptional"}
              />
            </SonicInputLabel>
            <Field
              id="projectPurpose"
              name="projectPurpose"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.projectPurposePlaceholder",
              })}
              component={InputWrapper}
            />

            <br />
            <br />
            <SonicInputLabel htmlFor="projectAssetList">
              <FormattedMessage
                id={"MusicLicensingReqest.projectAssetListheading"}
              />
              <div className="projectListSubhed">
                <FormattedMessage
                  id={"MusicLicensingReqest.projectAsseListSubheading"}
                />
              </div>
            </SonicInputLabel>
            <div className="projectListTextarea">
              <Field
                id="projectAssetList"
                name="projectAssetList"
                type="text"
                placeholder={intl.formatMessage({
                  id: "MusicLicensingReqest.projectAssetListPlaceholder",
                })}
                component={TextAreaWrapper}
                rows="7"
              />
              {errors.projectAssetList && touched.projectAssetList && (
                <p className="report_form_error">{errors.projectAssetList}</p>
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Projectinfo;
