import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showError } from "../../../redux/actions/notificationActions";
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
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import getTrackDetailsByAlgoliaId from "../../../common/utils/getTrackDetailsByAlgoliaId";
import tracksInDownloadBasket from "../../../redux/reducers/tracksDownload";

function SimpleDialog({
  open,
  setOpen,
  onClose,
  selectedTracks,
  openProject,
  setOpenProject,
  selectedTrackIds,
  createPredictProject,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tracksInDownloadBasket } = useSelector(
    (state) => state.downloadBasket
  );

  const handleClose = () => onClose();

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [disabledState, setDisabledState] = useState([false, false, false]);
  const [initCheckedState, setInitCheckedState] = useState([]);
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }
  const mediaOptions = [
    { mtype: "MP3", key: "mp3_track" },
    { mtype: "WAV", key: "wav_track" },
    { mtype: "STEM", key: "stems_zip" },
  ];

  const isAllMediaTypeAvailable = (mtypeKey) =>
    selectedTracks?.every(
      (track) =>
        track[mtypeKey] && track[mtypeKey] !== "-" && track[mtypeKey] !== ""
    );

  const filteredMediaOptions = mediaOptions.filter(({ key }) =>
    isAllMediaTypeAvailable(key)
  );
  const getImage = getMediaBucketPath(
    selectedTracks?.[0]?.preview_image,
    selectedTracks?.[0]?.source_id,
    "image"
  );
  // useEffect(() => {
  //   if (!open || selectedTracks.length === 0) return;
  //   const firstTrack = selectedTracks[0];
  //   if (!firstTrack?.preview_image) return;

  //   // MediaService?.getImage(firstTrack.preview_image)
  //   //   .then((res) => setImage(res))
  //   //   .catch((error) => console.log("err", error))
  //   //   .finally(() => setLoading(false));
  // }, [open, selectedTracks]);

  const addTocart = (selectedMediaTypes) => {
    const addToCartOptions = [];
    let newTracksInDownloadBasket = tracksInDownloadBasket?.filter(
      (data) => !data?.isDownloadInProgress
    );

    selectedTracks.forEach((track) => {
      selectedMediaTypes.forEach((mediaType) => {
        // ✅ Get sonicTrackId based on current server
        let sonicTrackId = "";

        if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
          if (Array.isArray(track?.facet_sonic_track_id)) {
            const match = track.facet_sonic_track_id.find((id) =>
              id.startsWith(serverName + ":")
            );
            sonicTrackId = match ? match.split(":")[1] : "";
          }
        } else {
          sonicTrackId = track?.sonichub_track_id;
        }

        // ✅ Check if this track already exists in the cart
        const trackInCart = newTracksInDownloadBasket?.find(
          ({ id, audio_type }) =>
            id === sonicTrackId && audio_type === mediaType
        );

        // ✅ Add only if not already present
        if (!trackInCart) {
          addToCartOptions.push({
            id: sonicTrackId,
            algoliaId: track.objectID,
            audio_type: mediaType,
            checked: 0,
          });
        }
      });
    });

    if (addToCartOptions.length > 0) {
      dispatch(addBatchToDownloadBasket(addToCartOptions));
      return true;
    } else {
      dispatch(showError("Select Option"));
      return false;
    }
  };

  const openProjectModal = (selectedMediaTypes) => {
    console.log("openprojectmodal ", selectedMediaTypes);
    const isAdded = addTocart(selectedMediaTypes);
    if (isAdded) {
      setTimeout(() => {
        setOpen(false);
        setOpenProject(true);
      }, 200);
    }
  };

  return createPredictProject ? (
    <>
      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={handleClose}
        className="download-option-predict-dialog"
        // title={`First create a project to add tracks to prediction`}
      >
        <div className="predict_project_container">
          <h2 style={{ fontSize: "18px", color: "var(--color-white)" }}>
            First create a project to add tracks to prediction.
          </h2>
          <div className="Btn_wrapper">
            <ButtonWrapper
              onClick={() => {
                handleClose();
              }}
              variant="outlined"
            >
              Cancel
            </ButtonWrapper>
            <ButtonWrapper
              onClick={() => openProjectModal(["MP3"])}
              variant="filled"
            >
              Create project
            </ButtonWrapper>
          </div>
        </div>
      </ModalWrapper>
    </>
  ) : (
    <>
      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={handleClose}
        className="download-option-dialog"
        title={`Download Asset (${selectedTrackIds.length} Tracks Selected)`}
      >
        <div className="download-option-dialog-subtitle">
          Choose one or multiple file formats to export
        </div>
        <Formik
          initialValues={{ mediaTypes: initCheckedState }}
          enableReinitialize
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            mediaTypes: Yup.array().min(1, "Please select at least one option"),
          })}
        >
          {({ values, dirty, isValid, handleSubmit, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <div className="download_dialog_image_options">
                <div className="track_img">
                  {/* {console.log("dd", JSON.stringify(selectedTracks[0]))} */}
                  <Picture key={image} srcUrl={getImage} loading={false} />
                  {/* <TrackTypeBadge
                  trackType={Number(selectedTracks?.[0]?.track_type_id) || ""}
                /> */}
                </div>
                <ul>
                  {filteredMediaOptions.map(({ mtype }, index) => (
                    <li key={index} className="mediaType-list-item">
                      <Field
                        name="mediaTypes"
                        value={mtype}
                        id={mtype}
                        type="checkbox"
                        disabled={false}
                        component={CheckboxWrapper}
                        label={mtype.toLowerCase()}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="btnContainer">
                <ButtonWrapper
                  onClick={() => {
                    resetForm({});
                    handleClose();
                  }}
                  variant="outlined"
                >
                  Cancel
                </ButtonWrapper>
                <ButtonWrapper
                  disabled={!dirty || !isValid}
                  onClick={() => openProjectModal(values?.mediaTypes)}
                  variant="filled"
                >
                  Add to Project
                </ButtonWrapper>
              </div>
            </form>
          )}
        </Formik>
      </ModalWrapper>
    </>
  );
}

export default function DownloadWidgetWithCookiesV3Dialog({
  allHits = [],
  selectedTrackIds = [],
  buttonText,
  disabled,
  className,
  onClose,
  createPredictProject,
  open: externalOpen,
}) {
  console.log("createPredictProject ", createPredictProject);
  const [open, setOpen] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const isControlledExternally = typeof externalOpen !== "undefined";
  const isOpen = isControlledExternally ? externalOpen : open;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    if (isControlledExternally && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }

  // const selectedTracks = allHits.filter((t) =>
  //   selectedTrackIds.some((item) => item.algoliaId === t.objectID)
  // );

  useEffect(() => {
    const fetchSelectedTracks = async () => {
      try {
        const algoliaIds = selectedTrackIds.map((t) => t.algoliaId);
        const data = await getTrackDetailsByAlgoliaId(algoliaIds);
        setSelectedTracks(data || []); // ✅ update state instead of local var
        console.log("Fetched tracks:", data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    // ✅ Call async function
    if (selectedTrackIds?.length) {
      fetchSelectedTracks();
    }
  }, [selectedTrackIds]);

  return (
    <>
      {!isControlledExternally &&
        (!!buttonText ? (
          <div onClick={handleClickOpen}>
            <p>{buttonText}</p>
            <IconButtonWrapper icon="Download" />
          </div>
        ) : (
          <ToolTipWrapper
            title={disabled ? "Download is in progress" : "Download"}
          >
            <IconButtonWrapper
              icon="Download"
              onClick={handleClickOpen}
              disabled={disabled}
            />
          </ToolTipWrapper>
        ))}

      <SimpleDialog
        open={isOpen}
        setOpen={setOpen}
        onClose={handleClose}
        selectedTracks={selectedTracks}
        openProject={projectModal}
        setOpenProject={setProjectModal}
        selectedTrackIds={selectedTrackIds}
        createPredictProject={createPredictProject}
      />

      <AddToBucket
        open={projectModal}
        setOpen={setProjectModal}
        trackID={selectedTrackIds}
        type="Download"
      />
    </>
  );
}
