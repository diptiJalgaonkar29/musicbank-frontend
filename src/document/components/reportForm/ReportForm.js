import React, { useContext, useState } from "react";
import "./ReportForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UploadIcon from "../../../static/uploadIcon.png";
import { ReactComponent as CloseIcon } from "../../../static/closeIcon.svg";
import getConfigJson from "../../../common/utils/getConfigJson";
import bytesToMegaBytes from "../../../common/utils/bytesToMegaBytes";
import AsyncService from "../../../networking/services/AsyncService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import getClientMeta from "../../../common/utils/getClientMeta";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const ReportForm = () => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { jsonConfig: CONFIG } = useContext(BrandingContext);

  const handleSubmit = async (values) => {
    const data = {
      ...getClientMeta(),
      subject: values.subject,
      description: values.description,
    };
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (!!values.mediaFile) {
        formData.append("file", values.mediaFile);
      } else {
        formData.append("file", new File([""], "mediaFile"));
      }
      // if (!!screenShot) {
      //   formData.append("SSFile", screenShot);
      // } else {
      formData.append("SSFile", new File([""], "SSmediaFile"));
      // }

      const response = await AsyncService.postFormData(
        `userReport/add`,
        formData
      );
      // console.log("API Response:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.log("error", error);
      setErrorMessage("Something went wrong...");
    }
  };

  const removeBugFile = (event, setFieldValue) => {
    let bug_file_input = document.getElementById("file");
    bug_file_input.value = null;
    setFieldValue("mediaFile", null);
  };

  const onBugFileChange = (event, setFieldValue) => {
    errorMessage && setErrorMessage("");
    let files = event.currentTarget?.files;
    if (files?.length === 0) return;
    setFieldValue("mediaFile", null);
    if (
      !(
        files?.[0]?.type?.startsWith("video/") ||
        files?.[0]?.type?.startsWith("image/")
      )
    ) {
      setErrorMessage("Unsupported file type");
      return;
    }

    let fileSizeInMb = bytesToMegaBytes(
      event.currentTarget?.files?.[0]?.size || 0
    );
    if (fileSizeInMb > CONFIG?.SUPPORT_FORM_FILE_SIZE) {
      setErrorMessage("File size exceeds the maximum limit");
      return;
    }
    setFieldValue("mediaFile", event.currentTarget?.files[0]);
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string().trim().required("Subject is required"),
    description: Yup.string().trim().required("Description is required"),
  });
  return !isSubmitted ? (
    <Formik
      initialValues={{
        subject: "",
        description: "",
        mediaFile: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, dirty, values, isValid }) => (
        <Form>
          <div className="form-group">
            <label className="label" htmlFor="subject">
              Subject*
            </label>
            <Field
              type="text"
              id="subject"
              name="subject"
              placeholder="Write the subject here."
              onChange={(e) => {
                errorMessage && setErrorMessage("");
                setFieldValue("subject", e.target.value);
              }}
            />
            <ErrorMessage
              name="subject"
              component="div"
              className="report_form_error"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="description">
              Description*
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              rows="10"
              cols="30"
              placeholder="Write your issue or request."
              onChange={(e) => {
                errorMessage && setErrorMessage("");
                setFieldValue("description", e.target.value);
              }}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="report_form_error"
            />
          </div>
          <div className="form-group">
            <label className="label">Reference(optional)</label>
            <div className="bugFile_input_container">
              <label className="label" htmlFor="file">
                <img src={UploadIcon} alt="upload" className="logo" />
                {values?.mediaFile?.name
                  ? `Your file is selected ( ${
                      values?.mediaFile?.name
                        ? values?.mediaFile?.name.slice(0, 25) + "..."
                        : ""
                    })`
                  : `Upload photo or video (max ${CONFIG?.SUPPORT_FORM_FILE_SIZE}mb)`}
              </label>
              {values?.mediaFile?.name && (
                <button
                  id="remove_bug_file"
                  onClick={(event) => {
                    removeBugFile(event, setFieldValue);
                  }}
                >
                  <CloseIcon />
                </button>
              )}
              <input
                id="file"
                name="file"
                type="file"
                accept="image/*,video/mp4,video/x-m4v,video/*"
                onChange={(event) => {
                  onBugFileChange(event, setFieldValue);
                }}
              />
            </div>

            {errorMessage && (
              <p className="report_form_error">{errorMessage}</p>
            )}
          </div>
          <div className="form-group groupButton">
            {isSubmitting ? (
              <SpinnerDefault />
            ) : (
              <button
                className="formButton"
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
              >
                Submit
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    <div className="feedBack_container">
      <p>Thank you for your message. It is very helpful for us!</p>
      <button
        className="back-link"
        onClick={() => {
          setSubmitted(false);
        }}
      >
        Report another issue / Make another enquiry{" "}
      </button>
    </div>
  );
};

export default ReportForm;
