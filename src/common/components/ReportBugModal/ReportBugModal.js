import React, { useContext, useState } from "react";
import "./ReportBugModal.css";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import getConfigJson from "../../../common/utils/getConfigJson";
import bytesToMegaBytes from "../../../common/utils/bytesToMegaBytes";
import AsyncService from "../../../networking/services/AsyncService";
import html2canvas from "html2canvas";
import { useEffect } from "react";
import getClientMeta from "../../utils/getClientMeta";
import { FormattedMessage } from "react-intl";
import { SpinnerDefault } from "../Spinner/Spinner";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import TextAreaWrapper from "../../../branding/componentWrapper/TextAreaWrapper";
import FileInputWrapper from "../../../branding/componentWrapper/FileInputWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setIsReportModalOpen } from "../../../redux/actions/reportModalActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const ReportBugModal = () => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isSubmittingForm, setSubmittingForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [screenShot, setscreenShot] = useState(null);
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const dispatch = useDispatch();
  const { isReportModalOpen } = useSelector((state) => state.isReportModalOpen);

  const onClose = () => {
    dispatch(setIsReportModalOpen(false));
  };

  useEffect(() => {
    if (!isReportModalOpen) return;
    html2canvas(document.body, {
      useCORS: true,
      allowTaint: true,
    })
      .then(async function (canvas) {
        // console.log("canvas", canvas);
        let dateInMS = Date.now();
        var file = dataURLtoFile(
          canvas.toDataURL("image/png"),
          `screenshot_${dateInMS}.png`
        );
        setscreenShot(file);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [isReportModalOpen]);

  const handleSubmit = async (values) => {
    setSubmittingForm(true);
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
      if (!!screenShot) {
        formData.append("SSFile", screenShot);
      } else {
        formData.append("SSFile", new File([""], "SSmediaFile"));
      }

      await AsyncService.postFormData(`userReport/add`, formData);
      // console.log("API Response:", response.data);
      setSubmitted(true);
      setSubmittingForm(false);
      setErrorMessage("");
    } catch (error) {
      console.log("error", error);
      setErrorMessage("Something went wrong...");
      setSubmittingForm(false);
    }
  };
  const SUPPORTED_FORMATS = ["image/", "video/"];

  const validationSchema = Yup.object().shape({
    subject: Yup.string().trim().required("Subject is required"),
    description: Yup.string().trim().required("Description is required"),
    mediaFile: Yup.mixed()
      .nullable(true)
      .test("fileFormat", "Unsupported Format", (value) => {
        // console.log("value", value, !value);
        // console.log("value.type", value?.type);
        // console.log("SUPPORTED_FORMATS", SUPPORTED_FORMATS);
        if (!value) return true;
        return SUPPORTED_FORMATS.some((format) =>
          value?.type?.startsWith(format)
        );
      })
      .test("fileSize", "File too large", (value) => {
        let fileSizeInMb = bytesToMegaBytes(value?.size || 0);
        // console.log("fileSizeInMb", fileSizeInMb);
        // console.log(
        //   "CONFIG?.SUPPORT_FORM_FILE_SIZE",
        //   CONFIG?.SUPPORT_FORM_FILE_SIZE
        // );
        // if (!value) return true;
        return fileSizeInMb < CONFIG?.SUPPORT_FORM_FILE_SIZE;
      }),
  });

  return (
    <ModalWrapper
      isOpen={isReportModalOpen}
      onClose={onClose}
      title={!isSubmitted ? "Report / Enquiry" : ""}
      className="report-bug-dialog"
    >
      <Formik
        initialValues={{
          subject: "",
          description: "",
          mediaFile: null,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            handleSubmit(values);
          }, 500);
        }}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { dirty, isValid, resetForm, errors, touched, handleSubmit } =
            props;
          return (
            <form onSubmit={handleSubmit}>
              {!isSubmitted ? (
                <React.Fragment>
                  <SonicInputLabel htmlFor="report_subject">
                    Subject*
                  </SonicInputLabel>
                  <Field
                    id="report_subject"
                    name="subject"
                    type="text"
                    // autoFocus
                    placeholder="Write the subject here."
                    component={InputWrapper}
                  />
                  {errors.subject && touched.subject && (
                    <p className="report_form_error">{errors.subject}</p>
                  )}
                  <br />
                  <br />
                  <SonicInputLabel htmlFor="report_description">
                    Description*
                  </SonicInputLabel>
                  <Field
                    id="report_description"
                    name="description"
                    type="text"
                    placeholder="Write your issue or request."
                    component={TextAreaWrapper}
                    rows="6"
                  />
                  {errors.description && touched.description && (
                    <p className="report_form_error">{errors.description}</p>
                  )}
                  <br />
                  <br />
                  <SonicInputLabel htmlFor="report_ref">
                    Reference(optional)
                  </SonicInputLabel>
                  <Field
                    id="report_ref"
                    name="mediaFile"
                    type="file"
                    accept="image/*,video/*"
                    placeholder={`Upload photo or video (max ${CONFIG?.SUPPORT_FORM_FILE_SIZE}mb)`}
                    component={FileInputWrapper}
                    variant="outlined"
                  />
                  {errors.mediaFile && (
                    <p className="report_form_error">{errors.mediaFile}</p>
                  )}

                  {errorMessage && (
                    <p className="report_form_error">{errorMessage}</p>
                  )}
                  <div className="groupButton">
                    {isSubmittingForm ? (
                      <SpinnerDefault />
                    ) : (
                      <div className="report_form_btn_container">
                        <ButtonWrapper onClick={onClose} variant="outlined">
                          <FormattedMessage id="playlist.member.decline" />
                        </ButtonWrapper>
                        <ButtonWrapper
                          type="submit"
                          disabled={isSubmittingForm || !isValid || !dirty}
                        >
                          Submit
                        </ButtonWrapper>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ) : (
                <div className="feedBack_container">
                  <p>Thank you for your message. It is very helpful for us!</p>
                  <ButtonWrapper
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSubmitted(false);
                      resetForm();
                    }}
                  >
                    Report another issue / Make another enquiry
                  </ButtonWrapper>
                </div>
              )}
            </form>
          );
        }}
      </Formik>
    </ModalWrapper>
  );
};

export default ReportBugModal;
