import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  showSuccess,
  showError,
} from "../../../redux/actions/notificationActions";
import "./DownloadWidgetWithCookiesV2Dialog.css";
import { addBatchToDownloadBasket } from "../../../redux/actions/trackDownloads/tracksDownload";
import { useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import AddToBucket from "../../../addtobucket/AddToProject";
import MediaService from "../../../common/services/MediaService";
import Picture from "../../../search1/components/AnimatedPicture/AnimatedPicture";
import TrackTypeBadge from "../../../search1/components/TrackTypeBadge/TrackTypeBadge";
import AsyncService from "../../../networking/services/AsyncService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

function SimpleDialog(props) {
  const {
    onClose,
    open,
    setOpen,
    preview_track_url,
    track_url,
    stems_zip_wav_url,
    idProp,
    trackName,
    openProject,
    setOpenProject,
    preview_image_url,
    track_type_id,
    strotswar_track_id,
    track_mediatypes,
    trackdetails_objectID,
  } = props;
  const mediaOptions = [
    { mtype: "MP3", murl: preview_track_url },
    { mtype: "WAV", murl: track_url },
    { mtype: "STEM", murl: stems_zip_wav_url },
  ];

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledState, setDisabledState] = useState(
    new Array(mediaOptions.length).fill(false)
  );
  const [initCheckedState, setInitCheckedState] = useState([]);
  const { tracksInDownloadBasket } = useSelector(
    (state) => state.downloadBasket
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addTocart = (selectedMediaTypes) => {
    const addToCartOptions = [];
    let newTracksInDownloadBasket = tracksInDownloadBasket?.filter(
      (data) => !data?.isDownloadInProgress
    );
    selectedMediaTypes.forEach((mediaType) => {
      const trackInCart = newTracksInDownloadBasket?.find(
        ({ id, audio_type }) => {
          return id == idProp && audio_type == mediaType;
        }
      );
      if (!!trackInCart) {
        return;
      } else {
        addToCartOptions.push({
          id: idProp,
          algoliaId: trackdetails_objectID,
          audio_type: mediaType,
          checked: 0,
        });
      }
    });

    if (addToCartOptions?.length > 0) {
      dispatch(addBatchToDownloadBasket(addToCartOptions));
      // checkIfTrackIsInCart();
      // dispatch(showSuccess("Added to cart"));
      handleClose();
      return true;
    } else {
      dispatch(showError("Select Option"));
      return false;
    }
  };

  const handleClose = () => {
    onClose();
  };

  const openProjectModal = (selectedMediaTypes) => {
    const isAdded = addTocart(selectedMediaTypes);
    if (isAdded) {
      setTimeout(() => {
        setOpen(false);
        setOpenProject(!openProject);
      }, 200);
    }
  };

  const downloadPreview = (id) => {
    setLoading(true);
    let payload = {
      strotSwarIDs: id,
      fileType: "4",
      sourceType: "sonic",
    };

    return AsyncService.loadDataParam("/tracks/getFileData", payload)
      .then((response) => {
        console.log("getFileDataAPI response1", response);
        console.log("getFileDataAPI response2", response.data.status);
        console.log("getFileDataAPI response3", response.data.data);

        if (
          !response.data ||
          response.data.status.toLowerCase() !== "success"
        ) {
          console.error(
            "getFileDataAPI error:",
            response.data?.message || response.data?.status
          );
          showError("Failed to download file!");
          setOpen(false);
          return null;
        }

        const base64Data = response.data.data;

        // Convert base64 → binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Create Blob
        const blob = new Blob([byteArray], { type: "audio/mp3" });

        // Create download link
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = `track_${id}.mp3`; // filename
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
        showSuccess("Success:", response.data.statusMessage);
        setOpen(false);
        setLoading(false);
        return true; // indicate success
      })
      .catch((err) => {
        showError("Failed to download file!");
        setOpen(false);
        setLoading(false);
        console.error("getFileDataAPI failed", err);
        return null;
      });
  };

  // useEffect(() => {
  //   if (!open) return;
  //   loadImages();
  // }, [preview_track_url, open]);

  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={() => setOpen(false)}
      className="download-option-dialog"
      title="Download Asset"
    >
      <div
        style={{
          color: "var(--color-white)",
          textAlign: "center",
          fontSize: "16px",
          padding: "0px 40px",
        }}
      >
        <p className="download-option-dialog-subtitle">
          Choose one or multiple file formats to export
        </p>
        <Formik
          initialValues={{
            mediaTypes: initCheckedState,
          }}
          enableReinitialize
          onSubmit={(values) => {
            // CheckOut(values.mediaTypes);
          }}
          validationSchema={Yup.object().shape({
            mediaTypes: Yup.array().min(1, "Please select atleast one option"),
          })}
        >
          {(props) => {
            const { values, dirty, isValid, handleSubmit, resetForm } = props;
            console.log(image);
            return (
              <form onSubmit={handleSubmit}>
                <div className="download_dialog_image_options">
                  <div className="track_img">
                    {/* {alert(preview_image_url)} */}
                    <Picture
                      key={image}
                      //srcUrl={image}
                      srcUrl={preview_image_url}
                      loading={false}
                    />
                    {/* <TrackTypeBadge
                      //trackType={Number(track_type_id?.split(",")?.[0]) || ""}
                      trackType={Number(track_type_id) || ""}
                    /> */}
                  </div>
                  <ul>
                    {mediaOptions?.map(({ mtype, murl }, index) => {
                      //console.log("mtype", mtype);
                      return (
                        <li
                          key={index}
                          // style={{
                          //   display:
                          //     ["", "-", null, undefined].includes(
                          //       stems_zip_wav_url
                          //     ) && mtype === "STEM"
                          //       ? "none"
                          //       : "block",
                          // }}
                          style={{
                            display:
                              (["", "-", null, undefined].includes(
                                stems_zip_wav_url
                              ) &&
                                mtype === "STEM") ||
                              (["", "-", null, undefined].includes(
                                preview_track_url
                              ) &&
                                mtype === "MP3") ||
                              (["", "-", null, undefined].includes(track_url) &&
                                mtype === "WAV")
                                ? "none"
                                : "block",
                          }}
                          className="mediaType-list-item"
                        >
                          <Field
                            name="mediaTypes"
                            value={mtype}
                            id={mtype}
                            type="checkbox"
                            disabled={disabledState[index]}
                            component={CheckboxWrapper}
                            label={mtype.toLowerCase()}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="form_btn_container"></div>
                <div className="dwnld_Preview_btn btnContainer">
                  <ButtonWrapper
                    onClick={() => {
                      resetForm({});
                      handleClose();
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </ButtonWrapper>

                  {track_mediatypes?.includes("preview") &&
                    (loading ? (
                      <SpinnerDefault />
                    ) : (
                      <ButtonWrapper
                        onClick={() => downloadPreview(strotswar_track_id)}
                        disabled={false}
                        variant="filledSecondary"
                      >
                        Download Preview
                      </ButtonWrapper>
                    ))}
                  <ButtonWrapper
                    onClick={() => openProjectModal(values?.mediaTypes)}
                    disabled={!dirty || !isValid}
                    variant="filled"
                  >
                    Add to Project
                  </ButtonWrapper>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </ModalWrapper>
  );
}

export default function DownloadWidgetWithCookiesV2Dialog(props) {
  const [open, setOpen] = React.useState(false);
  const [projectModal, setProjectModal] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!!props.buttonText ? (
        <div
          className="DownloadWidgetWithCookiesV2Dialog_buttonText_container boldFamily"
          onClick={handleClickOpen}
        >
          <p className="DownloadWidgetWithCookiesV2Dialog_buttonText">
            {props.buttonText}
          </p>
          <IconButtonWrapper
            icon="Download"
            className={`${props?.className || ""}`}
            disabled={props?.disabled}
          />
        </div>
      ) : (
        <ToolTipWrapper
          title={props?.disabled ? "Download is in progress" : "Download"}
        >
          <IconButtonWrapper
            icon="Download"
            onClick={handleClickOpen}
            className={` ${props?.className || ""}`}
            disabled={props?.disabled}
          />
        </ToolTipWrapper>
      )}
      <SimpleDialog
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        openProject={projectModal}
        setOpenProject={setProjectModal}
        {...props}
      />
      <AddToBucket
        open={projectModal}
        setOpen={setProjectModal}
        trackID={props?.idProp}
        type="Download"
      />
    </>
  );
}
