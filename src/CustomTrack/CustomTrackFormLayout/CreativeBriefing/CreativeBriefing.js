import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import FileInputWrapper from "../../../branding/componentWrapper/FileInputWrapper";
import TextAreaWrapper from "../../../branding/componentWrapper/TextAreaWrapper";
import ProgressBarWrapper from "../../../branding/componentWrapper/ProgressBarWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import AsyncService from "../../../networking/services/AsyncService";
import { useDispatch, useSelector } from "react-redux";
import "./CreativeBriefing.css";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { setCustomTrackForm } from "../../../redux/actions/customTrackForm/customTrackForm";
import * as Yup from "yup";

const CreativeBriefing = ({ formikRef, onSubmit, setIsStepValid }) => {
  const intl = useIntl();
  const customTrackFormData = useSelector((state) => state.customTrackForm);
  const creativeBriefing = customTrackFormData.creativeBriefing;
  const [processPercent, setProcessPercent] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object()
    .shape({
      mediaFile: Yup.mixed()
        .nullable()
        .notRequired()
        .test("fileFormat", "Only PDF files are allowed.", (value) => {
          if (!value || !value.type) return true;
          return value.type === "application/pdf";
        }),
      keywords: Yup.string().nullable(),
    })
    .test(
      "media-or-keywords-required",
      "Please either upload a PDF file or enter keywords.",
      function (values) {
        const mediaFile = values?.mediaFile;
        const keywords = values?.keywords;

        const hasText = !!keywords && keywords.length > 0;
        const hasFile = !!mediaFile && mediaFile.length > 0;
        if (!hasFile && !hasText) {
          return this.createError({
            path: "keywords",
            message: "Please either upload a PDF file or enter keywords.",
          });
        }

        return true;
      }
    );
  //const { values } = useFormikContext(); // ✅ Get Formik values here

  const FormValidityWatcher = ({ values, setIsStepValid }) => {
    useEffect(() => {
      const hasFile = !!values.mediaFile?.trim?.();
      const hasKeywords = !!values.keywords?.trim?.();

      //console.log("hasFile", hasFile, "hasKeywords", hasKeywords);
      setIsStepValid(hasFile || hasKeywords);
    }, [values.mediaFile, values.keywords]);

    return null; // this component just runs the effect
  };

  const fileUpload = ({ formdata, configMeta, onSuccess, onError }) => {
    AsyncService.postFormData(`customtracks/upload`, formdata, configMeta)
      .then((res) => {
        showSuccess("SUCCESS", "File uploaded successfully!");
        onSuccess?.(res);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        showError("ERROR", "Something went wrong!");
        onError?.();
      });
  };

  const uploadFileFunction = (fileObject, currentFormikValues) => {
    if (!fileObject) {
      console.error("No file selected!");
      return;
    }
    console.log("currentFormikValues", currentFormikValues);
    dispatch(
      setCustomTrackForm({
        key: "creativeBriefing",
        values: {
          ...creativeBriefing,
          mediaFile: fileObject,
          keywords: currentFormikValues.keywords, // ✅ preserve this
        },
      })
    );

    setOpen(true);

    const formdata = new FormData();
    formdata.append("file", fileObject);
    formdata.append("customTrackId", customTrackFormData.customTrackForm.id);

    const configMeta = {
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProcessPercent(percentage);
      },
    };

    fileUpload({
      formdata,
      configMeta,
      onSuccess: (fileResponse) => {
        setOpen(false);
        dispatch(
          setCustomTrackForm({
            key: "creativeBriefing",
            values: {
              ...creativeBriefing,
              mediaFile: fileResponse?.data,
              keywords: currentFormikValues.keywords, // ✅ preserve again
            },
          })
        );
      },
      onError: (error) => {
        console.log("Error Uploading File", error);
        setOpen(false);
      },
    });
  };

  return (
    <div className="CreativeBrief-container">
      <Formik
        innerRef={formikRef}
        initialValues={creativeBriefing}
        enableReinitialize
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          setFieldError,
          setTouched,
          errors,
          touched,
          setFieldTouched,
          validateField,
        }) => (
          <>
            <FormValidityWatcher
              values={values}
              setIsStepValid={setIsStepValid}
            />

            <Form>
              <div>
                <div className="CreativeBrief-header">
                  <FormattedMessage id="CustomTrackForm.creativeBriefing" />
                </div>

                <SonicInputLabel htmlFor="mediaFile">
                  <FormattedMessage id="CustomTrackForm.uploadYourBrief" />
                </SonicInputLabel>

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
                  filePreviewName={creativeBriefing.mediaFile} // ✅ new prop
                  onFileSelect={async (file) => {
                    setTouched({ mediaFile: true });
                    setFieldTouched("mediaFile", true);
                    setFieldValue("mediaFile", file);

                    await validateField("mediaFile");

                    const isValid = file && file.type === "application/pdf";

                    if (!isValid) {
                      const removeButton =
                        document.getElementById("remove_sonic_file");
                      console.log("removeButton", removeButton);
                      removeButton.click();
                      setFieldError("mediaFile", "Only PDF files are allowed.");
                      //setTimeout(() => {

                      // }, 500);
                      return;
                    }

                    uploadFileFunction(file, values);
                  }}
                  // onFileRemove={() => {
                  //   setFieldValue("mediaFile", null);
                  //   setTouched({ mediaFile: false });
                  //   setFieldError("mediaFile", undefined);
                  //   dispatch(
                  //     setCustomTrackForm({
                  //       key: "creativeBriefing",
                  //       values: {
                  //         ...creativeBriefing,
                  //         mediaFile: null,
                  //         keywords: values.keywords, // preserve keywords
                  //       },
                  //     })
                  //   );
                  // }}
                />
                {/* {console.log("values", values)}
                {console.log("errors", errors)}
                {console.log("touched", touched)} */}
                <br />
                {errors.mediaFile && (
                  <p className="report_form_error">{errors.mediaFile}</p>
                )}
              </div>

              <SonicInputLabel>
                <FormattedMessage id="CustomTrackForm.andor" />
              </SonicInputLabel>

              <SonicInputLabel htmlFor="keywords">
                <FormattedMessage id="CustomTrackForm.keywords" />
              </SonicInputLabel>

              <Field
                id="keywords"
                name="keywords"
                type="text"
                component={TextAreaWrapper}
                rows="6"
                placeholder={intl.formatMessage({
                  id: "CustomTrackForm.KeywordsPlaceholder",
                })}
              />

              {errors.keywords && touched.keywords && (
                <p className="report_form_error">{errors.keywords}</p>
              )}
            </Form>
          </>
        )}
      </Formik>

      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          setOpen(false);
        }}
        className="Upload_Progress_dialog"
        title="Uploading File"
      >
        <ProgressBarWrapper processPercent={processPercent} />
      </ModalWrapper>
    </div>
  );
};

export default CreativeBriefing;
