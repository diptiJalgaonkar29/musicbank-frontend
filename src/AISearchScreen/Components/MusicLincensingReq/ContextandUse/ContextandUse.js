import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ContextandUse.css";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import RadioWrapper from "../../../../branding/componentWrapper/RadioWrapper";
import { MultiSelect } from "react-multi-select-component";
import FileInputWrapper from "../../../../branding/componentWrapper/FileInputWrapper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import countryRegionData from "../../../../addtobucket/countryRegionData.json";
import { formatRegionCountryOptions } from "../../../../common/utils/countryFormatter";
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import AsyncService from "../../../../networking/services/AsyncService";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import ProgressBarWrapper from "../../../../branding/componentWrapper/ProgressBarWrapper";
import MediaService from "../../../../common/services/MediaService";
import { SET_MUSIC_LICENSING_FORM } from "../../../../redux/constants/actionTypes";

const ContextandUse = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { contextAndUsage, projectInformation } =
    useSelector((state) => state.musicLicensingForm) || {};

  // States
  const [fromDate, setFromDate] = useState(
    contextAndUsage?.startDate ? new Date(contextAndUsage.startDate) : null
  );
  const [reduxState, setReduxState] = useState(true);
  const uploadControllerRef = useRef(null);
  const [toDate, setToDate] = useState(
    contextAndUsage?.endDate ? new Date(contextAndUsage.endDate) : null
  );
  const [open, setOpen] = useState(false);
  const [processPercent, setProcessPercent] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(
    (contextAndUsage?.mediaFile || []).map((f) => ({ name: f, url: null }))
  );
  const [loadingMap, setLoadingMap] = useState({});
  const uploadedFileNamesRef = useRef(
    new Set((contextAndUsage?.mediaFile || []).map((f) => f.toLowerCase()))
  );
  

  // Validation Schema
  const validationSchema = Yup.object().shape({
    licenseTypeOptions: Yup.string().required("License Type is required"),
    contextMusicOption: Yup.string().required(
      "Importance of Music is required"
    ),
    mediaPlanAvai: Yup.string().required("Media Plan is required"),
    airingRegionOption: Yup.array()
      .min(1, "Select region")
      .max(1, "Only one region allowed")
      .required("Select region"),
    mediaTypeOption: Yup.array()
      .min(1, "Select at least one media type")
      .required("Select at least one media type"),
    usageDuration: Yup.array()
      .min(1, "Select usage duration")
      .required("Select usage duration"),
     mediaFile: Yup.mixed().nullable(),
    startDate: Yup.date()
      .transform((value, originalValue) =>
        originalValue ? new Date(originalValue) : null
      )
      .nullable()
      .min(new Date().setHours(0, 0, 0, 0), "Start date cannot be in the past"),
    endDate: Yup.date()
      .transform((value, originalValue) =>
        originalValue ? new Date(originalValue) : null
      )
      .nullable()
      .min(Yup.ref("startDate"), "End date cannot be earlier than start date"),
  });

  // Load existing file URLs
  useEffect(() => {
    const loadExistingFiles = async () => {
      if (!contextAndUsage?.mediaFile?.length) return;

      const newFiles = await Promise.all(
        contextAndUsage.mediaFile.map(async (filename) => {
          if (uploadedFileNamesRef.current.has(filename.toLowerCase()))
            return null;
          // try {
          //   const url =
          //     (await MediaService.getCustomTrackVisualAsset?.(
          //       filename,
          //       contextAndUsage?.id || projectInformation?.id
          //     )) || "";
          //   return { name: filename, url };
          // } catch {
          //   return { name: filename, url: "" };
          // }
        })
      );

      const filteredFiles = newFiles.filter(Boolean);
      filteredFiles.forEach((f) =>
        uploadedFileNamesRef.current.add(f.name.toLowerCase())
      );
      setUploadedFiles((prev) => [
  ...prev,
  ...filteredFiles.filter(
    (f) => !prev.some((p) => p.name.toLowerCase() === f.name.toLowerCase())
  ),
]);
    };

    loadExistingFiles();
  }, [contextAndUsage?.mediaFile, projectInformation?.id]);

  // Upload function
  // const uploadFileFunction = useCallback(
  //   async (file, setFieldError, setTouched, setFieldValue) => {
  //     if (!file) return;
  //     const lowerName = file.name.toLowerCase();

  //     if (uploadedFileNamesRef.current.has(lowerName)) {
  //       setTouched({ mediaFile: true });
  //       setFieldError("mediaFile", "This file has already been uploaded.");
  //       return;
  //     }

  //     setOpen(true);
  //     setProcessPercent(0);

  //     const formData = new FormData();
  //     formData.append("file", file);
  //     if (projectInformation?.id)
  //       formData.append("vendorLicenseId", projectInformation.id);

  //     try {
  //       const response = await AsyncService.postFormData(
  //         "vendorlicense/upload",
  //         formData,
  //         {
  //           onUploadProgress: (e) => {
  //             setProcessPercent(Math.round((e.loaded * 100) / e.total));
  //           },
  //         }
  //       );

  //       const uploadedName = response?.data;
  //       if (!uploadedName) return;

  //       uploadedFileNamesRef.current.add(uploadedName.toLowerCase());
  //       setUploadedFiles((prev) => [
  //         ...prev,
  //         { name: uploadedName, url: "__loading__" },
  //       ]);
  //       setFieldValue("mediaFile", (prev) => [...(prev || []), uploadedName]);

  //       dispatch({
  //         type: SET_MUSIC_LICENSING_FORM,
  //         payload: {
  //           key: "contextAndUsage",
  //           values: {
  //             ...contextAndUsage,
  //             mediaFile: [...(contextAndUsage?.mediaFile || []), uploadedName],
  //           },
  //         },
  //       });

  //       // Fetch blob URL
  //       const blobUrl =
  //         (await MediaService.getCustomTrackVisualAsset?.(
  //           uploadedName,
  //           contextAndUsage?.id || projectInformation?.id
  //         )) || "";
  //       setUploadedFiles((prev) =>
  //         prev.map((f) =>
  //           f.name === uploadedName ? { ...f, url: blobUrl } : f
  //         )
  //       );
  //     } catch (err) {
  //       console.error(err);
  //       setFieldError("mediaFile", "Upload failed.");
  //     } finally {
  //       setOpen(false);
  //       setProcessPercent(0);
  //     }
  //   },
  //   [dispatch, contextAndUsage, projectInformation]
  // );

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
//         const lowerCaseName = file.name.toLowerCase();
// if (uploadedFileNamesRef.current.has(lowerCaseName)) {
//   setFieldError("mediaFile", "This file has already been uploaded.");
//   return; // stop further processing
// }

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
  //     contextAndUsage?.id
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
      key: "contextAndUsage",
      values: {
        ...contextAndUsage,
        mediaFile: [
          ...(contextAndUsage?.mediaFile?.filter(Boolean) || []),
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
  [fileUpload, dispatch, projectInformation, contextAndUsage]
);
  // Remove file
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
         key: "contextAndUsage",
         values: {
           ...contextAndUsage,
           mediaFile: (contextAndUsage?.mediaFile || []).filter(
             (_, i) => i !== index
           ),
         },
       },
     });
 
     return newFiles;
   });
  };
  
  const mediaTypeOption = [
    { label: "TV", value: "TV" },
    { label: "Online/Social", value: "Online/Social" },
    { label: "Cinema", value: "Cinema" },
    { label: "Podcast/Radio", value: "Podcast/Radio" },
    { label: "Internal/B2B", value: "Internal/B2B" },
    { label: "Live Event", value: "Live Event" },
    { label: "Other", value: "Other" },
  ];

  const usageDuration = [
    { label: "3 months", value: "3 months" },
    { label: "6 months", value: "6 months" },
    { label: "1 year", value: "1 year" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="contextandUse-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          ...contextAndUsage,
           airingRegionOption: (contextAndUsage?.airingRegionOption || []).map((v) => ({
    label: v.label,
    value: v.value,
  })),
  mediaTypeOption: (contextAndUsage?.mediaTypeOption || []).map((v) => ({
    label: v.label,
    value: v.value,
  })),
  usageDuration: (contextAndUsage?.usageDuration || []).map((v) => ({
    label: v.label,
    value: v.value,
  })),
        }}
        validateOnMount
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={reduxState}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldError,
          setTouched,
        }) => {
          const isDateReadOnly = values.usageDuration[0] !== "Other";
          return (
            <form className="contextandUse-form">
              <div className="page_title">
                <FormattedMessage id="MusicLicensingReqest.contextandUsageHeading" />
              </div>

              {/* License Type */}
              <SonicInputLabel>
                <FormattedMessage id="MusicLicensingReqest.licenseTypeOptions" />
              </SonicInputLabel>
              <div className="licenseTypeOptions">
                {[
                  {
                    id: "originalOption",
                    value: "Original(MasterRecording)",
                    label: "originalOption",
                  },
                  {
                    id: "customOption",
                    value: "CustomReproduction/Remix(Publishing)",
                    label: "customOption",
                  },
                  { id: "TBDOption", value: "TBD", label: "TBDOption" },
                ].map((item) => (
                  <div className="licenseTypeOptionsAll" key={item.id}>
                    <Field
                      name="licenseTypeOptions"
                      id={item.id}
                      type="radio"
                      value={item.value}
                      component={RadioWrapper}
                    />
                    <label htmlFor={item.id}>
                      <FormattedMessage
                        id={`MusicLicensingReqest.${item.label}`}
                      />
                    </label>
                  </div>
                ))}
              </div>
              {touched.licenseTypeOptions && errors.licenseTypeOptions && (
                <p className="report_form_error">{errors.licenseTypeOptions}</p>
              )}

              {/* Context Music Option */}
              <SonicInputLabel>
                <FormattedMessage id="MusicLicensingReqest.contextandMusicOptions" />
              </SonicInputLabel>
              <div className="contextMusicOption">
                {[
                  {
                    id: "backgroundMusicOption",
                    value: "BackgroundMusic",
                    label: "backgroundMusicOption",
                  },
                  {
                    id: "thematicOption",
                    value: "Featured/Thematic",
                    label: "thematicOption",
                  },
                ].map((item) => (
                  <div className="contextMusicOptionAll" key={item.id}>
                    <Field
                      name="contextMusicOption"
                      id={item.id}
                      type="radio"
                      value={item.value}
                      component={RadioWrapper}
                    />
                    <label htmlFor={item.id}>
                      <FormattedMessage
                        id={`MusicLicensingReqest.${item.label}`}
                      />
                    </label>
                  </div>
                ))}
              </div>
              {touched.contextMusicOption && errors.contextMusicOption && (
                <p className="report_form_error">{errors.contextMusicOption}</p>
              )}

              {/* Regions & Media Type */}
             <div
  className="regionandMeadia-Section"
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "15px",
    flexWrap: "wrap",
  }}
>
  {/* Airing Region */}
  <div
    className="region-dropdown"
    style={{
      flex: "1",
      minWidth: "300px",
      backgroundColor: "#000000ff",
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    <SonicInputLabel>
      <FormattedMessage id="MusicLicensingReqest.airingAndRegionDropdown" />
    </SonicInputLabel>
    <MultiSelect
      options={formatRegionCountryOptions(countryRegionData)}
      value={formatRegionCountryOptions(countryRegionData).filter((o) =>
        (values.airingRegionOption || []).some((v) => v.value === o.value)
      )}
      onChange={(selected) => setFieldValue("airingRegionOption", selected)}
      disableSearch
      hasSelectAll={false}
      labelledBy="Select"
      className="multi_select_genres_filter selectAll"
      singleSelect
    />
    {touched.airingRegionOption && errors.airingRegionOption && (
      <p
        className="report_form_error"
        style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
      >
        {errors.airingRegionOption}
      </p>
    )}
  </div>

  {/* Media Type */}
  <div
    className="region-dropdown"
    style={{
      flex: "1",
      minWidth: "300px",
      // backgroundColor: "#f9f9f9",
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    <SonicInputLabel>
      <FormattedMessage id="MusicLicensingReqest.mediaTypeDropdown" />
    </SonicInputLabel>
    <MultiSelect
      options={mediaTypeOption}
      value={mediaTypeOption.filter((o) =>
        (values.mediaTypeOption || []).some((v) => v.value === o.value)
      )}
      onChange={(selected) => setFieldValue("mediaTypeOption", selected)}
      disableSearch
      hasSelectAll
      labelledBy="Select"
      className="multi_select_genres_filter selectAll"
    />
    {touched.mediaTypeOption && errors.mediaTypeOption && (
      <p
        className="report_form_error"
        style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
      >
        {errors.mediaTypeOption}
      </p>
    )}
  </div>
</div>




              {/* Usage Duration & Date Pickers */}
              <div className="usage-duration-Section">
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.usageandLicenseHeading" />
  </SonicInputLabel>
  <div className="usage-duration-Section-dropdown">
    <div className="region-dropdown date-range-dropdown">
      <div className="date-range-heading">Date Range</div>
      <MultiSelect
        options={usageDuration} // [{ label, value }]
        value={usageDuration.filter((o) =>
          (values.usageDuration || []).some((v) => v.value === o.value)
        )}
        onChange={(selected) => {
          const onlyOne = selected.slice(-1); // allow only last selected
          setFieldValue("usageDuration", onlyOne);

          const today = new Date();
          setFieldValue("startDate", today);
          setFromDate(today);

          const end = new Date(today);

          // Set end date only if predefined duration is selected
          const predefined = ["3 months", "6 months", "1 year"];
          if (predefined.includes(onlyOne[0]?.value)) {
            if (onlyOne[0].value === "3 months") end.setMonth(end.getMonth() + 3);
            if (onlyOne[0].value === "6 months") end.setMonth(end.getMonth() + 6);
            if (onlyOne[0].value === "1 year") end.setFullYear(end.getFullYear() + 1);
            setToDate(end);
            setFieldValue("endDate", end);
          } else {
            // For "Other" allow manual selection
            setToDate(null);
            setFieldValue("endDate", null);
          }
        }}
        disableSearch
        hasSelectAll={false}
        labelledBy="Select"
        className="multi_select_genres_filter usage-duration-select"
        singleSelect
      />
      {touched.usageDuration && errors.usageDuration && (
        <p className="report_form_error">{errors.usageDuration}</p>
      )}
    </div>

    <div className="region-dropdown date-range-dropdown2">
      <div className="date-range-inputs">
        <div>From</div>
        <DatePicker
          selected={fromDate}
          onChange={(date) => {
            setFromDate(date);
            setFieldValue("startDate", date);
          }}
          minDate={new Date()}
          placeholderText="Set a Date"
          className="date-input"
          dateFormat="yyyy-MM-dd"
          disabled={
            values.usageDuration[0]?.value !== "Other" &&
            ["3 months", "6 months", "1 year"].includes(
              values.usageDuration[0]?.value
            )
          }
        />

        <div>To</div>
        <DatePicker
          selected={toDate}
          onChange={(date) => {
            setToDate(date);
            setFieldValue("endDate", date);
          }}
          placeholderText="Set a Date"
          className="date-input"
          minDate={fromDate || new Date()}
          dateFormat="yyyy-MM-dd"
          disabled={
            values.usageDuration[0]?.value !== "Other" &&
            ["3 months", "6 months", "1 year"].includes(
              values.usageDuration[0]?.value
            )
          }
        />
      </div>
    </div>
  </div>
</div>
          

              {/* Media Plan */}
              <div className="media-Plan-Section">
                <SonicInputLabel>
                  <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiHeading" />
                </SonicInputLabel>
                <div className="contextMusicOption">
                  {[
                    {
                      id: "mediaPlanAvaiYes",
                      value: "yes",
                      label: "mediaPlanAvaiYes",
                    },
                    {
                      id: "mediaPlanAvaiNo",
                      value: "no",
                      label: "mediaPlanAvaiNo",
                    },
                  ].map((item) => (
                    <div className="contextMusicOptionAll" key={item.id}>
                      <Field
                        name="mediaPlanAvai"
                        id={item.id}
                        type="radio"
                        value={item.value}
                        component={RadioWrapper}
                      />
                      <label htmlFor={item.id}>
                        <FormattedMessage
                          id={`MusicLicensingReqest.${item.label}`}
                        />
                      </label>
                    </div>
                  ))}
                </div>
                {touched.mediaPlanAvai && errors.mediaPlanAvai && (
                  <p className="report_form_error">{errors.mediaPlanAvai}</p>
                )}
              </div>

              {/* File Upload */}
              <div style={{ marginTop: 16 }}>
                <Field
                  id="mediaFile"
                  name="mediaFile"
                  type="file"
                  accept="*"
                  placeholder={intl.formatMessage({
                    id: "CustomTrackForm.uploadfile",
                  })}
                  multiple={false}
                  maxFiles={20}
                  component={FileInputWrapper}
                  onFileSelect={async (file) => {
                    setTouched({ mediaFile: true });
                    setFieldValue("mediaFile", file);

                    // if (!file || !SUPPORTED_FORMATS.includes(file.type)) {
                    //   setFieldValue("mediaFile", null, false);
                    //   setFieldError(
                    //     "mediaFile",
                    //     "Unsupported File Format. Only .jpg, .png, .mp4 are allowed."
                    //   );
                    //   return;
                    // }

                    await uploadFileFunction(
                      file,
                      setFieldError,
                      setTouched,
                      setFieldValue
                    );
                  }}
                />
                {errors.mediaFile && (
                <p className="report_form_error">{errors.mediaFile}</p>
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
                  </div>
                )}
               
              </div>
            </form>
          );
        }}
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

export default ContextandUse;
