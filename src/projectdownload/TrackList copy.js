import React, { useCallback, useContext, useEffect, useState } from "react";
import ".././track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV2Dialog.css";
import { formatDuration } from "../common/utils/formatDuration";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import MediaService from "../common/services/MediaService";
import RadioWrapper from "../branding/componentWrapper/RadioWrapper";
import { ReactComponent as TrashIcon } from "../static/crossIcon.svg";
import _ from "lodash";
import { Field, Formik } from "formik";
import ModalWrapper from "../branding/componentWrapper/ModalWrapper";
import * as Yup from "yup";
import CheckboxWrapper from "../branding/componentWrapper/CheckboxWrapper";
import AsyncService from "../networking/services/AsyncService";
import ToolTipWrapper from "../branding/componentWrapper/ToolTipWrapper";
import MenuWrapper from "../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import IconButtonWrapper from "../branding/componentWrapper/IconButtonWrapper";
import IconWrapper from "../branding/componentWrapper/IconWrapper";
import appendCSUrlParams from "../common/utils/appendCSUrlParams";
import ChipWrapper from "../branding/componentWrapper/ChipWrapper";
import { BrandingContext } from "../branding/provider/BrandingContext";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FooterMusicPlayerContext } from "../hooks/FooterMusicPlayerContext";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import { MultiSelect } from "react-multi-select-component";
import TrackTypeBadge from "../search1/components/TrackTypeBadge/TrackTypeBadge";

export function SimpleDialog(props) {
  const {
    onClose,
    open,
    setOpen,
    checkedValue,
    projectId,
    getDownloadProjectById,
  } = props;
  const { id, type } = checkedValue || {};

  const handleClose = () => {
    onClose();
  };

  const handleDeleteTrack = (param) => {
    console.log(param);
    AsyncService.postData("/projectTracks/deleteProjectTracks", param)
      .then((response) => {
        console.log("object");
        getDownloadProjectById();
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={() => setOpen(false)}
      className="download-option-dialog"
      title="Delete Asset"
    >
      <div
        style={{
          color: "var(--color-white)",
          textAlign: "center",
          fontSize: "16px",
        }}
      >
        <Formik
          initialValues={type?.split(",")?.reduce((acc, item) => {
            acc[item] = false;
            return acc;
          }, {})}
          enableReinitialize
          onSubmit={(values) => {
            let removedMediaTye = [];
            for (const key in values) {
              if (Object.prototype.hasOwnProperty.call(values, key)) {
                const element = values[key];
                if (element) {
                  removedMediaTye?.push(key);
                }
              }
            }
            handleDeleteTrack({
              trackId: id,
              deleteType: removedMediaTye,
              projectId: projectId,
            });
          }}
        >
          {(props) => {
            const {
              values,
              dirty,
              isValid,
              handleSubmit,
              resetForm,
              setFieldValue,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <ul>
                  {type?.split(",")?.map((e, idx) => {
                    return (
                      <li key={idx} className="mediaType-list-item">
                        <Field
                          name="mediaTypes"
                          value={values?.mediaTypes}
                          id={idx}
                          type="checkbox"
                          checked={values[e]}
                          component={CheckboxWrapper}
                          label={e}
                          onChange={(evt) => {
                            setFieldValue(e, evt?.target?.checked);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
                <div className="form_btn_container"></div>
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
                    type="submit"
                    variant="filled"
                    disabled={!dirty}
                  >
                    Delete
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

export default function TrackList({
  details,
  handleChangeCredit,
  index,
  creditValue,
  deleteTrack,
  projectId,
  status,
  newData,
  loading,
  downloadedTracks,
  handleChangeForSocialMedia,
}) {
  console.log("TrackList", details);
  const navigate = useNavigate();
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [removeTrackType, setRemoveTrackType] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openToggle = Boolean(anchorEl);
  const { isCSUser } = useSelector((state) => state?.userMeta);
  const [imageLoading, setImageLoading] = useState(true);
  const [socialMediaMaster, setSocialMediaMaster] = useState([]);

  const genratetImage = useCallback((url) => {
    MediaService.getImage(url)
      .then((response) => {
        setImageUrl(response);
      })
      .catch((err) => {
        console?.error(err);
      })
      .finally(() => setImageLoading(false));
  }, []);

  useEffect(() => {
    genratetImage(details?.preview_image_url);
  }, [details?.preview_image_url]);

  const handleDeleteModal = (param) => {
    setRemoveTrackType(param);
    setOpen(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchSocialMediaList = (param = 0) => {
    AsyncService.loadData(`project/getAllMediaType?mediaType=${param}`)
      .then((response) => {
        setSocialMediaMaster(
          response?.data
            ?.slice() // make a copy so we don't mutate original
            ?.sort((a, b) => a?.mediaType?.localeCompare(b?.mediaType))
            ?.map((e) => ({
              label: e?.mediaType,
              value: e?.id,
            }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSocialMediaList();
  }, []);

  const trackMenuItems = [
    details.track_cs_status && details.csflax_track_id && isCSUser
      ? {
          menuTitle: "Take to AI",
          onClick: () => {
            const urlToNavigate = `${
              process.env.NODE_ENV === "development"
                ? "http://localhost:3098"
                : CONFIG?.CS_BASE_URL
            }/work-space/project-settings/${encodeURIComponent(
              details?.csflax_track_id
            )}?${appendCSUrlParams()}&is-cs-track=${
              !!details?.csToSsStatus ? "1" : "0" // csToSsStatus = 1 => flax id is cue id
            }`;
            try {
              localStorage.setItem("CSLoggingOut", "false");
              window.open(urlToNavigate, "_self");
            } catch (error) {}
            handleClose();
          },
          icon: "AiIcon",
        }
      : null,
    {
      menuTitle: "Search Similar Tracks",
      onClick: () => {
        const win = window.open(
          "/#/similar_tracks/" + details?.cyanite_id + "-" + details?.trackId,
          "_self"
        );
        win.focus();
        handleClose();
      },
      icon: "SimilaritySearch",
      // icon: <GridNotActive />,
    },
    {
      menuTitle: "Download Preview",
      onClick: () => {
        handleClose();
      },
      icon: "Download",
      // icon: <DeleteIcon />,
    },
  ]?.filter(Boolean);

  const { playingAudio, setPlayingAudio, playPause } = useContext(
    FooterMusicPlayerContext
  );

  const [playerMeta, setPlayerMeta] = useState({
    mp3Blob: "",
    waveBlob: "",
    imageBlob: "",
  });

  const playAudio = async (details) => {
    if (!!playerMeta?.mp3Blob) {
      playPause({
        mp3: playerMeta?.mp3Blob,
        title: details?.title,
        waveImage: playerMeta?.waveBlob || "",
        trackImage: playerMeta?.imageBlob,
        id: +details?.trackId,
      });
      return;
    }
    setPlayingAudio((prev) => ({
      ...prev,
      isLoading: true,
    }));
    let trackmp3Blobstrotswar = await MediaService.getMp3FromStroswar(
      details?.strotswar_track_id
    );
    // const [trackImageBlob, trackWaveImageBlob, trackmp3Blob] =
    //   await Promise.all([
    //     MediaService.getImage(details?.preview_image_url),
    //     MediaService.getWaveform(details?.preview_track_url),
    //     MediaService.getMp3(details?.preview_track_url),
    //   ]);

    setPlayerMeta({
      mp3Blob: trackmp3Blobstrotswar || "",
      waveBlob: details?.wave_form_js || "",
      imageBlob: details?.preview_image_url,
    });

    setPlayingAudio((prev) => ({
      ...prev,
      isLoading: false,
    }));

    playPause({
      mp3: trackmp3Blobstrotswar || "",
      title: details?.title,
      waveImage: details?.wave_form_js || "",
      trackImage: details?.preview_image_url,
      id: +details?.trackId,
    });
  };

  return (
    <div className="track trackListBlock">
      <div className="track-image-wrapper">
        {imageLoading ? (
          <div className="track-image-loader">
            <SpinnerDefault />
          </div>
        ) : (
          <>
            <img
              src={details?.preview_image_url}
              alt={details?.trackId}
              className="track-image"
              loading={loading}
            />
            <TrackTypeBadge trackType={Number(details?.track_type_id) || ""} />
            <div className="play-button">
              {playingAudio?.isLoading ? (
                <div className="track-image-loader">
                  <SpinnerDefault />
                </div>
              ) : (
                <IconButtonWrapper
                  type="button"
                  id="pButton"
                  className={
                    +details?.trackId !== +playingAudio?.id ||
                    !playingAudio?.isPlaying
                      ? ""
                      : "track-playing"
                  }
                  icon={
                    +details?.trackId !== +playingAudio?.id ||
                    !playingAudio?.isPlaying
                      ? "Play"
                      : "Pause"
                  }
                  onClick={() => playAudio(details)}
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="track-info">
        <div className="track-title">
          <ToolTipWrapper title={`${details?.title} (${details?.type})`}>
            <p onClick={() => navigate(`/track_page/${details?.objectId}`)}>
              {details?.title} {details?.type && `(${details?.type})`}
            </p>
          </ToolTipWrapper>
          {downloadedTracks?.includes(details?.trackId) &&
            status !== "active" && <ChipWrapper label="Downloaded" />}
        </div>
        <div className="track-details">
          {formatDuration(details?.duration || "")}
        </div>
        <div className="media-type">
          <div className="radio-options">
            <label>
              <RadioWrapper
                type="radio"
                name={`media - ${index}`} // Ensure unique name for each track
                checked={creditValue[details?.trackId]?.value === 0}
                onChange={() => {
                  handleChangeCredit(
                    details?.trackId,
                    0,
                    projectId,
                    downloadedTracks?.includes(details?.trackId) &&
                      status !== "active"
                      ? 0
                      : details?.unpaid
                  );
                  fetchSocialMediaList(0);
                }}
                disabled={
                  status === "completed" ||
                  loading ||
                  (downloadedTracks?.includes(details?.trackId) &&
                    status !== "active")
                }
              />
              Standard Commercial Use
            </label>
            <label>
              <RadioWrapper
                type="radio"
                name={`media - ${index}`} // Ensure unique name for each track
                checked={creditValue[details?.trackId]?.value === 1}
                onChange={() => {
                  handleChangeCredit(
                    details?.trackId,
                    1,
                    projectId,
                    downloadedTracks?.includes(details?.trackId) &&
                      status !== "active"
                      ? 0
                      : details?.paid,
                    fetchSocialMediaList(1)
                  );
                }}
                disabled={
                  status === "completed" ||
                  loading ||
                  (downloadedTracks?.includes(details?.trackId) &&
                    status !== "active")
                }
              />
              Paid Media
            </label>
            <label>
              <RadioWrapper
                type="radio"
                name={`media - ${index}`} // Ensure unique name for each track
                checked={creditValue[details?.trackId]?.value === 2}
                onChange={() =>
                  handleChangeCredit(
                    details?.trackId,
                    2,
                    projectId,
                    downloadedTracks?.includes(details?.trackId) &&
                      status !== "active"
                      ? 0
                      : details?.radio
                  )
                }
                disabled={
                  status === "completed" ||
                  loading ||
                  (downloadedTracks?.includes(details?.trackId) &&
                    status !== "active")
                }
              />
              Tv/Radio
            </label>
          </div>
          {creditValue[details?.trackId]?.value !== 2 && (
            <div className="channel-section">
              <span className="project_divider">|</span>
              <span className="channel-label">Channel * :</span>
              <div className="channel-select">
                <MultiSelect
                  key={details?.trackId}
                  options={socialMediaMaster}
                  value={creditValue[details?.trackId]?.socialMedia || []}
                  onChange={(e) =>
                    handleChangeForSocialMedia(e, details?.trackId, projectId)
                  }
                  // isOpen
                  disableSearch
                  disabled={
                    status === "completed" ||
                    loading ||
                    (downloadedTracks?.includes(details?.trackId) &&
                      status !== "active")
                  }
                  hasSelectAll={false}
                  labelledBy="Choose from the dropdown"
                  className={`multi_select_social_Media_filter selectAll`}
                  overrideStrings={{
                    selectSomeItems: "Choose from the dropdown",
                    // allItemsAreSelected: "Choose from the dropdown",
                    selectAll: "Choose from the dropdown",
                  }}
                  // isOpen
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="track-actions">
        <div className="trackbutton isPrintDisable">
          <p className="track_header_option" onClick={handleClick}>
            <IconWrapper icon={"MenuIcon"} />
          </p>
          <MenuWrapper
            id="track_menu_dropdown"
            anchorEl={anchorEl}
            open={openToggle}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {trackMenuItems.map((data) => (
              <MenuItemWrapper
                className="track_menu_item"
                onClick={data.onClick}
                key={data.menuTitle}
              >
                <IconWrapper icon={data.icon} />
                {data.menuTitle}
              </MenuItemWrapper>
            ))}
          </MenuWrapper>
          {/* <ButtonWrapper variant="outlined">Take to AI</ButtonWrapper>
        <ButtonWrapper variant="outlined">Download Preview</ButtonWrapper> */}

          {status !== "completed" && (
            <span
              className="credits-info"
              onClick={() =>
                handleDeleteModal({ id: details?.trackId, type: details?.type })
              }
            >
              <TrashIcon className="track-delete-icon" />
            </span>
          )}
        </div>
        <div className="track-credit">
          <span className="credits-info">
            Tokens:{" "}
            {downloadedTracks?.includes(details?.trackId) && status !== "active"
              ? 0
              : creditValue[details?.trackId]?.value === 1
              ? details?.paid
              : creditValue[details?.trackId]?.value === 2
              ? details?.radio
              : details?.unpaid}
          </span>
        </div>
      </div>
      <SimpleDialog
        open={open}
        setOpen={setOpen}
        checkedValue={removeTrackType}
        projectId={projectId}
        onClose={() => setOpen(false)}
        getDownloadProjectById={newData}
      />
    </div>
  );
}
