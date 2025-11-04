import React, { useState, useEffect, useCallback, useRef } from "react";
import { Field, Form, Formik } from "formik";
import "./VisualReferences.css";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import ProgressBarWrapper from "../../../branding/componentWrapper/ProgressBarWrapper";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import AsyncService from "../../../networking/services/AsyncService";
import MediaService from "../../../common/services/MediaService";
import { SET_CUSTOM_TRACK_FORM } from "../../../redux/constants/actionTypes";
import * as Yup from "yup";
import FileInputWrapper from "../../../branding/componentWrapper/FileInputWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

const VisualReferences = ({ formikRef, onSubmit }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const customTrackFormData = useSelector((state) => state.customTrackForm);
  const visualReferences = customTrackFormData.visualReferences;

  const [open, setOpen] = useState(false);
  const [processPercent, setProcessPercent] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);

  // ✅ Track files already rendered in the grid
  const uploadedFileNamesRef = useRef(new Set());

  useEffect(() => {
    const loadFiles = async () => {
      if (
        visualReferences?.mediaFile &&
        Array.isArray(visualReferences.mediaFile)
      ) {
        setLoadingFiles(true);

        const toFetch = visualReferences.mediaFile.filter(
          (name) => !uploadedFileNamesRef.current.has(name.toLowerCase())
        );

        const newFiles = await Promise.all(
          toFetch.map(async (filename) => {
            try {
              const url = await MediaService.getCustomTrackVisualAsset(
                filename,
                customTrackFormData.customTrackForm.id
              );
              return { name: filename, url };
            } catch (e) {
              console.error("Failed to load media URL", e);
              return { name: filename, url: "" };
            }
          })
        );

        if (newFiles.length > 0) {
          newFiles.forEach((f) =>
            uploadedFileNamesRef.current.add(f.name.toLowerCase())
          );
          setUploadedFiles((prev) => [...prev, ...newFiles]);
        }

        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, [visualReferences, customTrackFormData]);

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "video/mp4",
  ];

  const validationSchema = Yup.object().shape({
    mediaFile: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileType",
        "Unsupported File Format. Only .jpg, .png, .mp4 are allowed.",
        (value) => {
          if (!value || !value.type) return true;
          return SUPPORTED_FORMATS.includes(value.type);
        }
      ),
  });

  const fileUpload = useCallback(
    ({ formdata, configMeta, onSuccess, onError }) => {
      AsyncService.postFormData(`customtracks/upload`, formdata, configMeta, {})
        .then((res) => {
          showSuccess("SUCCESS", "File uploaded successfully!");
          onSuccess?.(res);
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          showError("Upload Error", "Something went wrong during upload.");
          onError?.();
        });
    },
    []
  );

  const uploadFileFunction = useCallback(
    (file, setFieldError, setTouched, setFieldValue) => {
      if (!file) return;

      const lowerCaseName = file.name.toLowerCase();
      if (uploadedFileNamesRef.current.has(lowerCaseName)) {
        setTouched({ mediaFile: true }, true);
        setFieldError("mediaFile", "This file has already been uploaded.");
        setFieldValue("mediaFile", null, false);
        setTimeout(() => {
          const fileInput = document.getElementById("sonic_file_input");
          if (fileInput) fileInput.value = null;
        }, 0);
        return;
      }

      setOpen(true);

      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("customTrackId", customTrackFormData.customTrackForm.id);

      const configMeta = {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProcessPercent(percent);
        },
      };
      // useEffect(() => {
      //   if (formikRef?.current) {
      //     formikRef.current.validateField("mediaFile");
      //   }
      // }, [formikRef?.current?.values.mediaFile]);

      fileUpload({
        formdata,
        configMeta,
        onSuccess: async (response) => {
          const uploadedName = response?.data;
          if (!uploadedName) {
            setOpen(false);
            return;
          }

          const nameLower = uploadedName.toLowerCase();
          if (uploadedFileNamesRef.current.has(nameLower)) {
            setOpen(false);
            return;
          }

          dispatch({
            type: SET_CUSTOM_TRACK_FORM,
            payload: {
              key: "visualReferences",
              values: {
                mediaFile: [
                  ...(visualReferences?.mediaFile || []),
                  uploadedName,
                ],
              },
            },
          });

          uploadedFileNamesRef.current.add(nameLower);
          setUploadedFiles((prev) => [
            ...prev,
            { name: uploadedName, url: "__loading__" },
          ]);
          setLoadingMap((prev) => ({ ...prev, [uploadedName]: true }));
          setOpen(false);

          try {
            const blobUrl = await MediaService.getCustomTrackVisualAsset(
              uploadedName,
              customTrackFormData.customTrackForm.id
            );
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.name === uploadedName ? { ...f, url: blobUrl } : f
              )
            );
          } catch (e) {
            console.error("Blob fetch error", e);
          } finally {
            setLoadingMap((prev) => {
              const map = { ...prev };
              delete map[uploadedName];
              return map;
            });
          }
        },
        onError: () => setOpen(false),
      });
    },
    [fileUpload, dispatch, visualReferences, customTrackFormData]
  );

  return (
    <div className="visualRef-container">
      <Formik
        innerRef={formikRef}
        initialValues={{
          mediaFile: visualReferences?.mediaFile || null,
        }}
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
          <Form>
            <div>
              <div className="visualRef-header">
                <FormattedMessage id="CustomTrackForm.visualReferences" />
              </div>

              <div className="visualRef-subtitle">
                <FormattedMessage id="CustomTrackForm.visualRefSubTitle" />
              </div>

              <SonicInputLabel htmlFor="mediaFile">
                <FormattedMessage id="CustomTrackForm.uploadfilesex" />
              </SonicInputLabel>

              <Field
                id="mediaFile"
                name="mediaFile"
                type="file"
                accept=".jpg, .jpeg, .png, .mp4"
                placeholder={intl.formatMessage({
                  id: "CustomTrackForm.uploadfile",
                })}
                multiple={true}
                maxFiles={20}
                component={FileInputWrapper}
                onFileSelect={async (file) => {
                  setTouched({ mediaFile: true });
                  setFieldTouched("mediaFile", true);
                  setFieldValue("mediaFile", file);

                  //await validateField("mediaFile");
                  const isValidType =
                    file && SUPPORTED_FORMATS.includes(file.type);

                  if (!isValidType) {
                    setFieldValue("mediaFile", null, false);
                    // ❌ Invalid file
                    setFieldError(
                      "mediaFile",
                      "Unsupported File Format. Only .jpg, .png, .mp4 are allowed."
                    );

                    // const removeButton =
                    //   document.getElementById("remove_sonic_file");
                    // removeButton?.click();
                    // console.log("removeButton", removeButton);
                    //   // 👇 Also reset the actual <input type="file" />
                    //   // setTimeout(() => {
                    //   //   const removeButton =
                    //   //     document.getElementById("remove_sonic_file");
                    //   //   removeButton?.click();
                    //   //   console.log("removeButton", removeButton);
                    //   // }, 500);

                    return;
                  }

                  // ✅ Valid file
                  // // Triggers schema validation
                  await uploadFileFunction(
                    file,
                    setFieldError,
                    setTouched,
                    setFieldValue
                  );
                }}
              />
              {/* {console.log("values", values)}
              {console.log("errors", errors)}
              {console.log("touched", touched)} */}
              {errors.mediaFile && touched.mediaFile && (
                <p className="report_form_error">{errors.mediaFile}</p>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {loadingFiles ? (
        <div className="grid-loader">
          <SpinnerDefault />
        </div>
      ) : (
        uploadedFiles.length > 0 && (
          <div className="visualRef-preview-grid">
            {uploadedFiles.map(({ name, url }, idx) => {
              const ext = name.split(".").pop().toLowerCase();
              const isImage = ["jpg", "jpeg", "png"].includes(ext);
              const isVideo = ext === "mp4";
              const isLoading = loadingMap[name] || url === "__loading__";

              return (
                <div key={idx} className="visualRef-thumbnail">
                  {isLoading && (
                    <div className="thumbnail-spinner">
                      <SpinnerDefault />
                    </div>
                  )}
                  {isImage && url && (
                    <img
                      src={url}
                      alt={`uploaded-${idx}`}
                      className="thumbnail-img"
                      style={{ display: isLoading ? "none" : "block" }}
                      onLoad={() =>
                        setLoadingMap((prev) => {
                          const map = { ...prev };
                          delete map[name];
                          return map;
                        })
                      }
                    />
                  )}
                  {isVideo && url !== "__loading__" && (
                    <video
                      controls
                      className="thumbnail-img"
                      onLoadedData={() =>
                        setLoadingMap((prev) => {
                          const map = { ...prev };
                          delete map[name];
                          return map;
                        })
                      }
                    >
                      <source src={url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return; // prevent closing on backdrop
          setOpen(false); // ✅ close the modal
        }}
        className="Upload_Progress_dialog"
        title="Uploading File"
      >
        <ProgressBarWrapper processPercent={processPercent} />
      </ModalWrapper>
    </div>
  );
};

export default VisualReferences;
