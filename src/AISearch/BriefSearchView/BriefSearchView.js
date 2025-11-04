import React, { useState } from "react";
import "./BriefSearchView.css";
import { Field, Formik } from "formik";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import FileInputWrapper from "../../branding/componentWrapper/FileInputWrapper";
import TextAreaWrapper from "../../branding/componentWrapper/TextAreaWrapper";
import * as Yup from "yup";
import SonicInputLabel from "../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { useDispatch, useSelector } from "react-redux";
// import trackExternalAPICalls from "../../../../common/service/trackExternalAPICalls";
// import getWorkSpacePath from "../../../../utils/getWorkSpacePath";
// import { SET_VIDEO_META } from "../../redux/videoSlice";
// import uploadProjectVideoAndSplitAudio from "../../services/videoDB/uploadProjectVideoAndSplitAudio";
import _ from "lodash";
// import { RESET_LOADING_STATUS, SET_LOADING_STATUS } from "../../../../common/redux/loaderSlice";
// import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import aiAnalysisApiRequest from "../Services/AiAnalysisApiRequest/aiAnalysisApiRequest";
import fileUpload from "../Services/FileUpload/fileUpload";
import { setAiMusicGenerator } from "../../redux/actions/AIMusicGenerator/aiMusicGenerator";
import { showError } from "../../redux/actions/notificationActions";
import ProgressBarWrapper from "../../branding/componentWrapper/ProgressBarWrapper";
import ModalWrapper from "../../branding/componentWrapper/ModalWrapper";
import { localStorageCommonAISearch } from "../Services/localStorageCommonAISearch";

const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/msword",
  "text/plain",
  "application/pdf",
];

const validationSchema = Yup.object()
  .shape({
    prompt: Yup.string().test(
      "non-empty-if-required",
      "Prompt cannot be empty",
      function (value) {
        const { mediaFile } = this.parent;
        if (!mediaFile) {
          return !!value && value.trim().length > 0;
        }
        return true; // if mediaFile is present, prompt can be empty
      }
    ),
    mediaFile: Yup.mixed()
      .nullable()
      .test("fileFormat", "Only PDF files are allowed.", (value) => {
        if (!value || !value.type) return true;
        return value.type === "application/pdf";
      }),
  })
  .test("at-least-one", "Either Prompt or Media File is required", (values) => {
    if (!values) return false;
    return !!values.prompt?.trim() || !!values.mediaFile;
  });

const BriefSearchView = () => {
  const navigate = useNavigate()
  let location = useLocation();
  let dispatch = useDispatch();
  const [projectDuration, setProjectDuration] = useState(0);
  const [FileSource, SetFileSource] = useState();
  const [vidSource, setVidSource] = useState();
  const [retain, setRetain] = useState(false);
  const [pollingID, setPollingID] = useState(null);
  const [isVideoHasAudio, setIsVideoHasAudio] = useState(null);
  const [processPercent, setProcessPercent] = useState(0);
  const [pollingModal, setPollingModal] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const option = queryParams.get("option");
  const { aiMusicGenerator } = useSelector((state) => state.aiMusicGenerator);
  const [open, setOpen] = useState(false);

  const onCancelClick = () => {
    navigate("/ai_search");
  };

  const handleSubmit = (values) => {
    dispatch(
      setAiMusicGenerator({
        isLoading: true,
      })
    );
    console.log("values", values.mediaFile?.name);
    if (values?.mediaFile) {
      localStorageCommonAISearch("AISearchConfig", {
        briefFileName: values.mediaFile?.name,
      });
    }
    //     // dispatch(
    //     //   SET_LOADING_STATUS({ loaderStatus: true, loaderProgressPercent: -1 })
    //     // );
    //     if (!pollingModal) setPollingModal(true)
    let data = {
      fileName: values?.prompt ? null : values?.mediaFile?.name,
      mediatype: values?.prompt ? 4 : 3,
      inputText: values?.prompt?.replace(/(\r|\n|\\r|\\n)/g, " "),
    };

    if (values?.mediaFile) {
      uploadFileFunction(values.mediaFile);
    } else {
      aiAnalysisApiRequest({
        data,
        onSuccess: (Response) => {
          // if (!pollingModal) setPollingModal(true)
          if (Response?.status === 200) {
            setPollingID(Response?.data?.id);
            navigate(
              `/ai_search/workspace?option=${option}&aiSearchid=${Response?.data?.id}`
            );
            localStorageCommonAISearch("AISearchConfig", {
              aiSearchId: Response?.data?.id,
            });
            dispatch(
              setAiMusicGenerator({
                id: Response?.data?.id,
                status: Response?.data?.status,
                mediatype: Response?.data?.mediatype,
                isLoading: false,
              })
            );
          }
        },
        onError: (error) => {
          console.log("Error Uploading Video", error);
          dispatch(
            setAiMusicGenerator({
              isLoading: false,
            })
          );
          // dispatch(
          //   RESET_LOADING_STATUS()
          // )
          // setPollingModal(false)
        },
      });
    }
  };

  const uploadFileFunction = (fileObject) => {
    dispatch(
      setAiMusicGenerator({
        isLoading: true,
      })
    );
    setOpen(true);
    console.log("fileObject", fileObject);

    if (!fileObject) {
      console.error("Error: No file selected!");
      return;
    }

    var formdata = new FormData();
    formdata.append("file", fileObject);
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
        let data = {
          fileName: fileResponse?.data,
          mediatype: 3,
          inputText: fileResponse?.data,
        };

        aiAnalysisApiRequest({
          data,
          onSuccess: (Response) => {
            console.log("Response", Response);
            setPollingID(Response?.data?.id);
            navigate(
              `/ai_search/workspace?option=${option}&aiSearchid=${Response?.data?.id}`
            );
            // if (!pollingModal) setPollingModal(true)
            localStorageCommonAISearch("AISearchConfig", {
              aiSearchId: Response?.data?.id,
            });
            dispatch(
              setAiMusicGenerator({
                id: Response?.data?.id,
                status: Response?.data?.status,
                mediatype: Response?.data?.mediatype,
                isLoading: false,
              })
            );
          },
          onError: (error) => {
            console.log("Error Uploading Video", error);
            dispatch(
              setAiMusicGenerator({
                isLoading: false,
              })
            );
            // dispatch(
            //   RESET_LOADING_STATUS()
            // )
            setPollingModal(false);
          },
        });
      },
      onError: (error) => {
        console.log("Error Uploading Video", error);
        dispatch(
          setAiMusicGenerator({
            isLoading: false,
          })
        );
        setOpen(false);
        dispatch(showError("File upload failed!"));
        setPollingModal(false);
      },
    });
  };

  // useEffect(() => {
  //   if (!pollingID) return; // Prevent execution if ID is not set

  //   const interval = setInterval(() => {
  //     AxiosInstance.get(`ai_search/getTracksFromGenreMoodTempo`)
  //       .then((response) => {
  //         if (response.data?.status === "completed") {
  //           clearInterval(interval); // Stop polling
  //           // dispatch(RESET_LOADING_STATUS());
  //           console.log("Analysis completed!");

  //           // Navigate to workspace after completion
  //           // navigate(`/AISearch_workspace?option=${option}`);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error in request:", error);
  //       });
  //   }, 10000); // Retry every 10 seconds

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [ dispatch,history,pollingID]);

  //   useEffect(() => {
  //     SetFileSource((prev) => {
  //       return JSON.stringify(prev) === JSON.stringify(fileSource) ? prev : fileSource;
  //     });

  //     setVidSource((prev) => (prev === VideoURL ? prev : VideoURL));
  //   }, [VideoURL, fileSource]);

  return (
    <div className="AITrackCreationWithBrief_container">
      <div className="BriefSearchView_Container">
        <Formik
          initialValues={{
            prompt: "",
            mediaFile: null,
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log("values", values);
            setTimeout(() => {
              handleSubmit(values);
              // uploadFileFunction(values)
            }, 500);
          }}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              dirty,
              isValid,
              resetForm,
              isSubmitting,
              errors,
              touched,
              values,
              handleSubmit,
              setFieldValue,
              setFieldError,
              validateForm,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <SonicInputLabel
                  htmlFor="brief_upload_btn_ref"
                  style={{ marginBottom: "10px" }}
                >
                  Upload Brief
                </SonicInputLabel>
                <Field
                  id="brief_upload_btn_ref"
                  name="mediaFile"
                  label="Upload Brief"
                  type="file"
                  className="brief_upload_btn"
                  accept=".pdf"
                  placeholder={`Upload Brief`}
                  component={FileInputWrapper}
                  disabled={values?.prompt ? true : false}
                  // disabled={true}
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("mediaFile", file);
                    setFieldValue("prompt", "");
                  }}
                  // onFileSelect={(file) => {
                  //   // Only allow PDF
                  //   console.log("file", file);
                  //   if (file && file.type !== "application/pdf") {
                  //     setFieldValue("mediaFile", null);
                  //     const inputElement =
                  //       document.querySelector("brief_upload_btn");
                  //     if (inputElement) {
                  //       inputElement.value = "";
                  //     }
                  //     // setFieldError("mediaFile", "Only PDF files are allowed.");
                  //     dispatch(showError("Only PDF files are allowed."));
                  //     return;
                  //   }

                  //   // Valid file
                  //   setFieldValue("mediaFile", file);
                  //   setFieldValue("prompt", "");
                  // }}
                />
                {errors.mediaFile && (
                  <p className="report_form_error">{errors.mediaFile}</p>
                )}
                <p className="brief_form_divider">- Or -</p>
                <SonicInputLabel style={{ marginBottom: "10px" }}>
                  Prompt
                </SonicInputLabel>
                <Field
                  name="prompt"
                  type="text"
                  label="Prompt"
                  placeholder="Add as much detail as possible to help the AI create more precise results for you.
                       e.g. A melancholic yet hopeful piano piece with ambient textures, subtle strings, and a soft ticking sound to evoke the passage of time."
                  component={TextAreaWrapper}
                  rows="5"
                  className="prompt_textarea"
                  disabled={values?.mediaFile ? true : false}
                  onChange={(e) => {
                    setFieldValue("prompt", e.target.value);
                    localStorageCommonAISearch("AISearchConfig", {
                      brief: e.target.value,
                    });
                    setFieldValue("mediaFile", null); // Clear mediaFile when prompt is entered
                    validateForm();
                  }}
                  onPaste={() => {
                    // Let paste happen, then handle it
                    setTimeout(() => {
                      const value =
                        document.querySelector(".prompt_textarea").value;
                      setFieldValue("prompt", value);
                      localStorageCommonAISearch("AISearchConfig", {
                        brief: value,
                      });
                      setFieldValue("mediaFile", null);
                    }, 0);
                  }}
                />

                <div className="brief_form_btn_container">
                  <ButtonWrapper
                    disabled={aiMusicGenerator?.isLoading}
                    onClick={onCancelClick}
                    variant="outlined"
                  >
                    Cancel
                  </ButtonWrapper>
                  <ButtonWrapper
                    type="submit"
                    variant="filled"
                    disabled={aiMusicGenerator?.isLoading || !isValid || !dirty}
                  >
                    {aiMusicGenerator?.isLoading
                      ? "Searching..."
                      : "Search Track"}
                  </ButtonWrapper>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={() => setOpen(false)}
        className="Upload_Progress_dialog"
        disableBackdropClick={true}
        title="Uploading File"
      >
        <div>
          <ProgressBarWrapper processPercent={processPercent} />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default BriefSearchView;
