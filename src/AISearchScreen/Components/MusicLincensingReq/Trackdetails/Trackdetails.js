import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Trackdetails.css";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import FileInputWrapper from "../../../../branding/componentWrapper/FileInputWrapper";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import ProgressBarWrapper from "../../../../branding/componentWrapper/ProgressBarWrapper";
import MediaService from "../../../../common/services/MediaService";
import AsyncService from "../../../../networking/services/AsyncService";
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import { SET_MUSIC_LICENSING_FORM } from "../../../../redux/constants/actionTypes";

const Trackdetails = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const uploadControllerRef = useRef(null);

  const { trackDetails } =
    useSelector((state) => state.musicLicensingForm) || {};
  const { projectInformation } =
    useSelector((state) => state.musicLicensingForm) || {};

  // Upload UI state
  const [open, setOpen] = useState(false);
  const [reduxState, setReduxState] = useState(true);
  const [processPercent, setProcessPercent] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(
    trackDetails?.mediaFile || []
  ); // { name, url }
  const [loadingMap, setLoadingMap] = useState({});

  const uploadedFileNamesRef = useRef(new Set());
  
  const removeFile = (index, setFieldValue) => {
  setUploadedFiles((prev) => {
    const newFiles = [...prev];
    const removedFile = newFiles.splice(index, 1)[0];
    const removedName = removedFile?.name || removedFile;

    // Update Formik field
    setFieldValue(
      "mediaFile",
      (prev) =>
        (prev || []).filter(
          (f, i) => i !== index && (f.name || f) !== removedName
        )
    );

    // Remove from uploadedFileNamesRef
    if (removedName) {
      uploadedFileNamesRef.current.delete(removedName.toLowerCase());
    }

    // Update Redux
    dispatch({
      type: SET_MUSIC_LICENSING_FORM,
      payload: {
        key: "trackDetails",
        values: {
          ...trackDetails,
          mediaFile: (trackDetails?.mediaFile || []).filter(
            (_, i) => i !== index
          ),
        },
      },
    });

    return newFiles;
  });
};


  const validationSchema = Yup.object().shape({
    requestTrack: Yup.string().required("Requested track is required"),
    alternativesOption: Yup.string().required("Please select an option"),
    briefingAvailableOption: Yup.string().required("Please select an option"),
    mediaFile: Yup.mixed().nullable(),
  });

 
  useEffect(() => {
    if (trackDetails?.mediaFile?.length > 0) {
      setUploadedFiles(
        trackDetails.mediaFile.map((f) => ({
          name: f,
          url: null, // will be filled when blob loads
        }))
      );

      // Keep duplicate protection correct
      uploadedFileNamesRef.current = new Set(
        trackDetails.mediaFile.map((f) => f.toLowerCase())
      );
    }
  }, [trackDetails]);

const fileUpload = useCallback(
  ({ formdata, configMeta, onSuccess, onError }) => {
    AsyncService.postFormData(
      `vendorlicense/upload`,
      formdata,
      configMeta,
      {}
    )
      .then((res) => {
        showSuccess("SUCCESS", "File uploaded successfully!");
        onSuccess?.(res);
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          console.warn("Upload request canceled by user.");
          return;
        }
        console.error("Upload failed:", err);
        showError("Upload Error", "Something went wrong during upload.");
        onError?.();
      });
  },
  []
);


  // const uploadFileFunction = useCallback(
  //   (file, setFieldError, setFieldValue) => {
  //     if (!file) return;
  //     setReduxState(false);
  //     const lowerCaseName = file.name.toLowerCase();
  //     if (uploadedFileNamesRef.current.has(lowerCaseName)) {
  //       setFieldError("mediaFile", "This file has already been uploaded.");
  //       const fileInput = document.getElementById("sonic_file_input");
  //       if (fileInput) fileInput.value = null;
  //       return; // DO NOT set null
  //     }

  //     setOpen(true);

  //     const formdata = new FormData();
  //     formdata.append("file", file);
  //     formdata.append("vendorLicenseId", projectInformation?.id);

  //     const configMeta = {
  //       onUploadProgress: (e) => {
  //         const percent = Math.round((e.loaded * 100) / e.total);
  //         setProcessPercent(percent);
  //       },
  //     };

  //     fileUpload({
  //       formdata,
  //       configMeta,
  //       onSuccess: async (response) => {
  //         const uploadedName = response?.data;
  //         if (!uploadedName) {
  //           setOpen(false);
  //           return;
  //         }

  //         const nameLower = uploadedName.toLowerCase();
  //         if (uploadedFileNamesRef.current.has(nameLower)) {
  //           setOpen(false);
  //           return;
  //         }

  //         // Safely add to Formik field value
  //         setFieldValue(
  //           "mediaFile",
  //           (prev) => {
  //             const existing = Array.isArray(prev) ? prev.filter(Boolean) : [];
  //             return [...existing, uploadedName];
  //           },
  //           false
  //         );

  //         uploadedFileNamesRef.current.add(nameLower);

  //         setUploadedFiles((prev) => [
  //           ...prev,
  //           { name: uploadedName, url: "__loading__" },
  //         ]);
  //         setLoadingMap((prev) => ({ ...prev, [uploadedName]: true }));
  //         setOpen(false);

  //         try {
  //           const blobUrl = await MediaService.getCustomTrackVisualAsset(
  //             uploadedName,
  //             trackDetails?.id
  //           );
  //           setUploadedFiles((prev) =>
  //             prev.map((f) =>
  //               f.name === uploadedName ? { ...f, url: blobUrl } : f
  //             )
  //           );
  //         } catch (e) {
  //           console.error("Blob fetch error", e);
  //         } finally {
  //           setLoadingMap((prev) => {
  //             const map = { ...prev };
  //             delete map[uploadedName];
  //             return map;
  //           });
  //         }

  //         // Update Redux safely
  //         dispatch({
  //           type: SET_MUSIC_LICENSING_FORM,
  //           payload: {
  //             key: "trackDetails",
  //             values: {
  //               ...trackDetails,
  //               mediaFile: [
  //                 ...(trackDetails?.mediaFile?.filter(Boolean) || []),
  //                 uploadedName,
  //               ],
  //             },
  //           },
  //         });
  //       },
  //       onError: () => setOpen(false),
  //     });
  //   },
  //   [fileUpload, dispatch, projectInformation, trackDetails]
  // );

const uploadFileFunction = useCallback(
  (file, setFieldError, setFieldValue) => {
    if (!file) return;
     const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFieldError("mediaFile", "File size cannot exceed 100 MB.");
      const fileInput = document.getElementById("sonic_file_input");
      if (fileInput) fileInput.value = null;
      return;
    }
    setReduxState(false);

    // const lowerCaseName = file.name.toLowerCase();
    // if (uploadedFileNamesRef.current.has(lowerCaseName)) {
    //   setFieldError("mediaFile", "This file has already been uploaded.");
    //   const fileInput = document.getElementById("sonic_file_input");
    //   if (fileInput) fileInput.value = null;
    //   return;
    // }

    setOpen(true);

    // ✅ Create and store AbortController for this upload
    const controller = new AbortController();
    uploadControllerRef.current = controller;

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("vendorLicenseId", projectInformation?.id);

    const configMeta = {
      signal: controller.signal, // works if AsyncService uses fetch/axios v1.2+
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProcessPercent(percent);
      },
    };

    fileUpload({
      formdata,
      configMeta,
      onSuccess: async (response) => {
  uploadControllerRef.current = null;
  const uploadedName = response?.data;
  if (!uploadedName) {
    setOpen(false);
    return;
  }

  // ⛔ remove duplicate check here

  setFieldValue(
    "mediaFile",
    (prev) => {
      const existing = Array.isArray(prev) ? prev.filter(Boolean) : [];
      return [...existing, uploadedName];
    },
    false
  );

  setUploadedFiles((prev) => [
    ...prev,
    { name: uploadedName, url: "__loading__" },
  ]);

          const fileInput = document.getElementById("sonic_file_input");
  if (fileInput) fileInput.value = null;
  setLoadingMap((prev) => ({ ...prev, [uploadedName]: true }));
  setOpen(false);

  // try {
  //   const blobUrl = await MediaService.getCustomTrackVisualAsset(
  //     uploadedName,
  //     trackDetails?.id
  //   );
  //   setUploadedFiles((prev) =>
  //     prev.map((f) => (f.name === uploadedName ? { ...f, url: blobUrl } : f))
  //   );
  // } catch (e) {
  //   console.error("Blob fetch error", e);
  // } finally {
  //   setLoadingMap((prev) => {
  //     const map = { ...prev };
  //     delete map[uploadedName];
  //     return map;
  //   });
  // }

  // ✅ Redux update (now runs)
  dispatch({
    type: SET_MUSIC_LICENSING_FORM,
    payload: {
      key: "trackDetails",
      values: {
        ...trackDetails,
        mediaFile: [
          ...(trackDetails?.mediaFile?.filter(Boolean) || []),
          uploadedName,
        ],
      },
    },
  });
},

      onError: () => {
        uploadControllerRef.current = null; // ✅ clear controller
        setOpen(false);
      },
    });
  },
  [fileUpload, dispatch, projectInformation, trackDetails]
);


  return (
    <div className="trackdetails-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          requestTrack: trackDetails?.requestTrack || "",
          alternativesOption: trackDetails?.alternativesOption || "",
          briefingAvailableOption: trackDetails?.briefingAvailableOption || "",
          mediaFile: trackDetails?.mediaFile?.filter(Boolean) || [],
        }}
        validateOnMount
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={reduxState} // ✅ Prevent form reset on Redux update
      >
        {({ setFieldValue, setFieldError, errors, touched }) => (
          <Form>
            <div className="page_title">
              <FormattedMessage
                id={"MusicLicensingReqest.trackDetailsHeading"}
              />
            </div>

            <SonicInputLabel htmlFor="requestTrack">
              <span className="project-label">
                <FormattedMessage id="MusicLicensingReqest.requestedTrack" />
              </span>
            </SonicInputLabel>

            <Field
              id="requestTrack"
              name="requestTrack"
              type="text"
              placeholder={intl.formatMessage({
                id: "MusicLicensingReqest.requestedTrackPlaceholder",
              })}
              component={InputWrapper}
              readOnly
            />
            {errors.requestTrack && touched.requestTrack && (
              <p className="report_form_error">{errors.requestTrack}</p>
            )}

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
                  <label htmlFor="alternativesOption-Yes">
                    <FormattedMessage id={"MusicLicensingReqest.optionsYes"} />
                  </label>
                </div>
                <div className="openToAlter-option-A">
                  <Field
                    name="alternativesOption"
                    id="alternativesOption-No"
                    type="radio"
                    value="No"
                    component={RadioWrapper}
                  />
                  <label htmlFor="alternativesOption-No">
                    <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
                  </label>
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
                  <label htmlFor="briefingAvailableOption-Yes">
                    <FormattedMessage id={"MusicLicensingReqest.optionsYes"} />
                  </label>
                </div>
                <div className="openToAlter-option-A">
                  <Field
                    name="briefingAvailableOption"
                    id="briefingAvailableOption-No"
                    type="radio"
                    value="No"
                    component={RadioWrapper}
                  />
                  <label htmlFor="briefingAvailableOption-No">
                    <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
                  </label>
                </div>
              </div>
            </div>
            {errors.briefingAvailableOption &&
              touched.briefingAvailableOption && (
                <p className="report_form_error">
                  {errors.briefingAvailableOption}
                </p>
              )}

            <div style={{ marginTop: 16 }}>
              <Field
                id="mediaFile"
                name="mediaFile"
                type="file"
                accept="*"
                placeholder={intl.formatMessage({
                  id: "CustomTrackForm.uploadfile",
                })}
                multiple={true}
                maxFiles={20}
                component={FileInputWrapper}
                onFileSelect={async (file) => {
                  // const isValidType =
                  //   file && SUPPORTED_FORMATS.includes(file.type);
                  // if (!isValidType) {
                  //   setFieldValue("mediaFile", null, false);
                  //   setFieldError(
                  //     "mediaFile",
                  //     "Unsupported File Format. Only .jpg, .png, .mp4 are allowed."
                  //   );
                  //   return;
                  // }
                  await uploadFileFunction(file, setFieldError, setFieldValue);
                }}
              />
              {errors.mediaFile && touched.mediaFile && (
  <div className="error-message">{errors.mediaFile}</div>
)}
              {uploadedFiles?.length > 0 && (
                <div className="uploaded-files-list">
                  <span className="uploaded-files-title">Uploaded Files</span>
<ul>
 {uploadedFiles.map((file, index) => (
  <li key={index} className="uploaded-file-item">
    <span>{file.name || file}</span>
    <span
      onClick={() => removeFile(index, setFieldValue)}  // ✅ pass index
      style={{ marginLeft: 120, cursor: "pointer" }}
    >
      X
    </span>
  </li>
))}

</ul>

                  {/* <ul>
                    {uploadedFiles.map((file) => (
                      <li key={file.name} className="uploaded-file-item" style={{width:"50%"}}>
                        
                        <span >{file.name || file}</span>
                        <span onClick={()=>{removeFile(file,setFieldValue)}} style={{fontSize: "16px",marginLeft:"120px", cursor:"pointer"}}>X</span>
                      </li>
                    ))}
                  </ul> */}
                </div>
              )}
              {errors.mediaFile && (
                <p className="report_form_error">{errors.mediaFile}</p>
              )}
            </div>
          </Form>
        )}
      </Formik>
<ModalWrapper
  isOpen={open}
  setIsOpen={setOpen}
  onClose={(event, reason) => {
    if (reason === "backdropClick") return;

    // ✅ Cancel upload if in progress
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort();
      uploadControllerRef.current = null;
      console.log("Upload canceled by user.");
      showError("Upload Canceled", "File upload has been canceled by user.");
    }

    setOpen(false);
    setProcessPercent(0);
  }}
  className="Upload_Progress_dialog"
  title="Uploading File"
>
  <ProgressBarWrapper processPercent={processPercent} />
</ModalWrapper>

    </div>
  );
};

export default Trackdetails;
