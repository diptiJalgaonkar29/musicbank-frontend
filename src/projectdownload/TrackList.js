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
//import TrackTypeBadge from "../search1/components/TrackTypeBadge/TrackTypeBadge";
import { de } from "date-fns/locale";
import { showError, showSuccess } from "../redux/actions/notificationActions";
import TrackTypeBadge from "../AISearchScreen/Components/TrackTypeBadge/TrackTypeBadge";

export function SimpleDialog(props) {
  const {
    onClose,
    open,
    setOpen,
    checkedValue,
    projectId,
    getDownloadProjectById,
  } = props;
  const { id, type, algoliaId } = checkedValue || {};

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
              algoliaId: algoliaId,
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
                          checked={values?.[e]}
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
  sonicTrackId,
  facetTrackId,
  algoliaId,
  status,
  newData,
  loading,
  downloadedTracks,
  handleChangeForSocialMedia,
}) {
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
  const [loadingState, setLoadingState] = useState(false);
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

  const fetchSocialMediaList = (
    param = creditValue[details?.trackId]?.value
  ) => {
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

  const onSimilaritySearch = (trackData) => {
    navigate("/AISearchScreen", {
      state: { type: "similarity", trackData: trackData },
    });
  };
  const downloadPreview = (id) => {
    setLoadingState(true);
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
        setLoadingState(false);
        return true; // indicate success
      })
      .catch((err) => {
        showError("Failed to download file!");
        setOpen(false);
        setLoadingState(false);
        console.error("getFileDataAPI failed", err);
        return null;
      });
  };

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
              !!details?.csToSsStatus ? "1" : "0"
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
        onSimilaritySearch({
          id: details.trackId,
          track_name: details.title,
          bpm: details.bpm,
          key: details.tag_key,
          voice_gender: details.instrument_vocal_data,
          genreTags: details?.genre_tags?.slice(0, 5),
          moodTags: details?.amp_all_mood_tags?.slice(0, 5),
          image: details.preview_image_url,
          strotswar_track_id: details.strotswar_track_id,
          track_mediatypes: details.track_mediatypes,
          track_type_id: details.track_type_id,
          cyanite_id: details.cyanite_id,
        });
      },
      icon: "SimilaritySearchSH2",
    },

    details?.track_mediatypes?.includes("preview")
      ? {
          menuTitle: loadingState ? <SpinnerDefault /> : "Download Preview",
          onClick: loadingState
            ? null
            : () => downloadPreview(details.strotswar_track_id),
          icon: loadingState ? null : "Download",
          disabled: loadingState,
        }
      : null,
  ].filter(Boolean);

  const { playingAudio, setPlayingAudio, playPause, setPlayList } = useContext(
    FooterMusicPlayerContext
  );

  const [playerMeta, setPlayerMeta] = useState({
    mp3Blob: "",
    waveBlob: "",
    imageBlob: "",
  });

  const playAudio = async (details) => {
    console.log("playAudio details", details);
    if (!!playerMeta?.mp3Blob) {
      playPause({
        mp3: playerMeta?.mp3Blob,
        title: details?.title,
        waveImage: playerMeta?.waveImage || "",
        trackImage: playerMeta?.imageBlob,
        id: +details?.trackId,
        source_id: details?.source_id,
      });
      return;
    }
    setPlayingAudio((prev) => ({
      ...prev,
      isLoading: true,
    }));
    let trackmp3Blobstrotswar = await MediaService.getMp3FromStroswar(
      details?.strotswar_track_id,
      details.track_mediatypes,
      details.track_type_id,
      details?.source_id
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
    setPlayList([
      {
        id: details?.trackId,
        trackdetails_objectID: details.objectId,
        title: "",
        img: "",
        mp3: "",
      },
    ]);
    playPause({
      mp3: trackmp3Blobstrotswar || "",
      title: details?.title,
      waveImage: details?.wave_form_js || "",
      trackImage: details?.preview_image_url,
      id: +details?.trackId,
      source_id: details?.source_id,
    });
  };
  //const redirect = (id) => {
  //  console.log("redirect to track page", details);
  // Get hidden tags in lowercase
  // const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
  //   t.toLowerCase()
  // );
  // const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
  //   (t) => t.toLowerCase()
  // );

  // // Slice the genreTags to get only the first 10 visible tags
  // const topGenreTags = (props.genreTags || [])
  //   .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
  //   .slice(0, 10);

  // // Slice the ampMoodTags to get only the first 10 visible tags
  // const topEmotionTags = (props.ampMoodTags || [])
  //   .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()))
  //   .slice(0, 10);

  // const topEventTags = (props.eventTags || []).slice(0, 3);
  // const movementTags = (props.movementTags || []).slice(0, 3);

  // // Combine event & movement tags and take 3 random ones

  // const topInstrumentsTags = (props.instrumentTags || []).slice(0, 10);

  // Dispatch the action
  // dispatch(
  //   setTrackData({
  //     trackdetails_objectID: props.trackdetails_objectID,
  //     genreTags: topGenreTags,
  //     emotionTags: topEmotionTags,
  //     eventTags: topEventTags,
  //     movementTags: movementTags,
  //     instruments: topInstrumentsTags,
  //     bpm: props.bpm,
  //     keyTag: props.keyTags,
  //     imgSrc: props.preview_image_url,
  //     wavefile: props.wavefile,
  //     strotswar_track_id: props.strotswar_track_id,
  //     sonichub_track_id: props.id,
  //     wav_track: props.wav_track,
  //     mp3_track: props.mp3_track,
  //     stems_zip: props.stems_zip,
  //     track_mediatypes: props.track_mediatypes,
  //     instrument_vocal_data: props.instrument_vocal_data,
  //     source_id: props.source_id,
  //   })
  // );

  // Navigate to the track page
  // navigate(`/track_page/${id}`);
  // };

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
            {/* <TrackTypeBadge
              trackType={Number(details?.track_type_id) || ""}
            /> */}
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
          <div className="track-title-icon">
            <TrackTypeBadge trackType={Number(details?.track_type_id) || ""} />
          </div>
          <ToolTipWrapper title={`${details?.title} (${details?.type})`}>
            <p
              onClick={() => navigate(`/track_page/${details?.objectId}`)}
              //onClick={() => redirect(details?.objectId)}
            >
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
                    sonicTrackId,
                    facetTrackId,
                    algoliaId,
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
                    sonicTrackId,
                    facetTrackId,
                    algoliaId,
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
                    sonicTrackId,
                    facetTrackId,
                    algoliaId,
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
                    handleChangeForSocialMedia(
                      e,
                      details?.trackId,
                      algoliaId,
                      projectId,
                      creditValue[details?.trackId]?.value
                    )
                  }
                  // isOpen
                  isLoading={loading}
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
            {trackMenuItems.map((data, index) => (
              <MenuItemWrapper
                className="track_menu_item"
                onClick={data.onClick}
                key={index} // safer to use index if menuTitle can be JSX
                disabled={data.disabled} // handle disabled state for loader
              >
                {data.icon && <IconWrapper icon={data.icon} />}
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
                handleDeleteModal({
                  id: details?.trackId,
                  type: details?.type,
                  algoliaId: algoliaId,
                })
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
