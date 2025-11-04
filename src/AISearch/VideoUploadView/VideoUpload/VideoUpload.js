import React, { useState } from "react";
import "./VideoUpload.css";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import getConfigJson from "../../../common/utils/getConfigJson";
import bytesToMegaBytes from "../../../common/utils/bytesToMegaBytes";
// import AsyncService from "../../../networking/services/AsyncService";
import FileInputWrapper from "../../../branding/componentWrapper/FileInputWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  resetVideoUpload,
  setVideoUpload,
} from "../../../redux/actions/VideoAction/videoUploadActions";
import fileUpload from "../../Services/FileUpload/fileUpload";
import Notifications from "../../../common/components/Notification/Notifications";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import aiAnalysisApiRequest from "../../Services/AiAnalysisApiRequest/aiAnalysisApiRequest";
import { setAiMusicGenerator } from "../../../redux/actions/AIMusicGenerator/aiMusicGenerator";
import { useLocation, useNavigate } from "react-router-dom";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import ProgressBarWrapper from "../../../branding/componentWrapper/ProgressBarWrapper";
import { localStorageCommonAISearch } from "../../Services/localStorageCommonAISearch";

const VideoUpload = () => {
  const [errorMessage, setErrorMessage] = useState("");
  // const [screenShot, setscreenShot] = useState(null);
  let CONFIG = getConfigJson();
  let location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const queryParams = new URLSearchParams(location.search);
  const option = queryParams.get("option");
  const [processPercent, setProcessPercent] = useState(0);
  const [open, setOpen] = useState(false);

  const SUPPORTED_FORMATS = [
    "video/mp4",
    "video/quicktime", // for .mov
  ];

  const validationSchema = Yup.object().shape({
    mediaFile: Yup.mixed()
      .nullable(true)
      .test("fileFormat", "Unsupported Format", (value) => {
        // console.log("value", value);

        if (!value) return true;
        return SUPPORTED_FORMATS.some((format) =>
          value?.type?.startsWith(format)
        );
      }),
    // .test("fileSize", "File too large", (value) => {
    //   let fileSizeInMb = bytesToMegaBytes(value?.size || 0);
    //   // console.log("fileSizeInMb", fileSizeInMb);
    //   // console.log(
    //   //   "CONFIG?.SUPPORT_FORM_FILE_SIZE",
    //   //   CONFIG?.SUPPORT_FORM_FILE_SIZE
    //   // );
    //   if (!value) return true;
    //   return fileSizeInMb < CONFIG?.SUPPORT_FORM_FILE_SIZE;
    // }),
  });

  return (
    <>
      <Notifications allIds={notifications} />
      <Formik
        initialValues={{
          mediaFile: null,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          dispatch(
            setAiMusicGenerator({
              isLoading: true,
            })
          );
          // console.log("values", values);
          setOpen(true);
          const formdata = new FormData();
          formdata.append("file", values?.mediaFile);
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
              console.log("fileResponse", fileResponse);
              localStorageCommonAISearch("AISearchConfig", {
                videoFile: fileResponse?.data,
              });
              // dispatch(showSuccess("Video uploaded successfully!"));
              const videoFile = fileResponse?.data;
              if (!videoFile) return;
              setOpen(false);
              let data = {
                fileName: videoFile,
                mediatype: 1,
                inputText: videoFile,
              };

              aiAnalysisApiRequest({
                data,
                onSuccess: (Response) => {
                  console.log("Response", Response);
                  localStorageCommonAISearch("AISearchConfig", {
                    aiSearchId: Response?.data?.id,
                  });
                  dispatch(
                    setAiMusicGenerator({
                      id: Response?.data?.id,
                      status: Response?.data?.status,
                      mediatype: Response?.data?.mediatype,
                      isLoading: false,
                      videoFile: fileResponse?.data,
                    })
                  );
                  // dispatch(resetVideoUpload());
                  navigate(
                    `/ai_search/workspace?option=${option}&aiSearchid=${Response?.data?.id}`
                  );
                },
                onError: (error) => {
                  console.log("Error Uploading Video", error);
                  dispatch(
                    setAiMusicGenerator({
                      isLoading: false,
                    })
                  );
                },
              });
            },
            onError: (error) => {
              console.log("Error Uploading Video", error);
              dispatch(showError("Video upload failed!"));
              dispatch(resetVideoUpload());
              resetForm();
              setOpen(false);
              localStorageCommonAISearch("AISearchConfig", {
                videoFile: "",
              });
              dispatch(
                setAiMusicGenerator({
                  isLoading: false,
                })
              );
            },
          });
        }}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { dirty, isValid, resetForm, errors, touched, handleSubmit } =
            props;
          return (
            <form onSubmit={handleSubmit}>
              <React.Fragment>
                <Field
                  id="report_ref"
                  name="mediaFile"
                  type="file"
                  accept="video/mp4,video/quicktime"
                  placeholder={`Upload Video`}
                  component={FileInputWrapper}
                  onFileRemove={() => {
                    dispatch(resetVideoUpload());
                  }}
                  onFileSelect={(file) => {
                    console.log("onUpload", file);
                    const url = URL.createObjectURL(new Blob([file]));
                    console.log("url", url);
                    dispatch(setVideoUpload(url));

                    const isValidFormat = SUPPORTED_FORMATS.some((format) =>
                      file?.type?.startsWith(format)
                    );

                    if (!isValidFormat) {
                      dispatch(resetVideoUpload()); // dispatch only when invalid
                    }
                    // var formdata = new FormData();
                    // formdata.append("file", file);
                    // fileUpload({
                    //   formdata,
                    //   onSuccess: (fileResponse) => {
                    //     console.log("fileResponse", fileResponse);
                    //     localStorage.setItem(
                    //       "videoFile",
                    //       fileResponse?.data
                    //     );
                    //     dispatch(showSuccess("Video uploaded successfully!"));
                    //   },
                    //   onError: (error) => {
                    //     console.log("Error Uploading Video", error);
                    //     dispatch(showError("Video upload failed!"));
                    //     dispatch(resetVideoUpload());
                    //     resetForm()
                    //   },
                    // });
                  }}
                />
                {errors.mediaFile && (
                  <p className="report_form_error">{errors.mediaFile}</p>
                )}

                {errorMessage && (
                  <p className="report_form_error">{errorMessage}</p>
                )}
                <ButtonWrapper
                  id="videoAnalysisSumbitBtn"
                  style={{ width: "100%", marginTop: "20px", display: "none" }}
                  type="submit"
                >
                  Submit
                </ButtonWrapper>
              </React.Fragment>
            </form>
          );
        }}
      </Formik>
      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={() => setOpen(false)}
        className="Upload_Progress_dialog"
        disableBackdropClick={true}
        title="Uploading Video"
      >
        <div>
          <ProgressBarWrapper processPercent={processPercent} />
        </div>
      </ModalWrapper>
    </>
  );
};

export default VideoUpload;
