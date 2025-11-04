import React, { useEffect, useState } from "react";
import "./VideoUploadView.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { resetVideoUpload } from "../../redux/actions/VideoAction/videoUploadActions";
import Notifications from "../../common/components/Notification/Notifications";

const VideoUploadView = () => {
  let location = useLocation();
  const navigate = useNavigate()
  let dispatch = useDispatch();
  const [FileSource, SetFileSource] = useState();
  const [vidSource, setVidSource] = useState();
  const [projectDuration, setProjectDuration] = useState(0);
  const [isVideoHasAudio, setIsVideoHasAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retain, setRetain] = useState(false);
  const [pollingID, setPollingID] = useState(null);
  const [pollingModal, setPollingModal] = useState(false);
  const [loaderForProcedding, setLoaderForProcedding] = useState(false);
  const [processPercent, setProcessPercent] = useState(0);
  const { mediaFile } = useSelector((state) => state.videoUpload);
  const { aiMusicGenerator } = useSelector((state) => state.aiMusicGenerator);
  const notifications = useSelector((state) => state.notifications);

  const queryParams = new URLSearchParams(location.search);
  const option = queryParams.get("option");

  const onCancelClick = () => {
    dispatch(resetVideoUpload());
    navigate("/ai_search");
  };

  useEffect(() => {
    dispatch(resetVideoUpload());
  }, []);

  const hasAudio = (video) => {
    if (!video) return null;
    return (
      video?.mozHasAudio ||
      Boolean(video?.webkitAudioDecodedByteCount) ||
      Boolean(video?.audioTracks && video?.audioTracks?.length)
    );
  };

  const uploadVideo = async () => {
    setLoading(true);
    let getElement = document.getElementById("videoAnalysisSumbitBtn");
    if (getElement) {
      getElement.click()
    }
  };

  //   useEffect(() => {
  //     if (!pollingID) return; // Prevent execution if ID is not set

  //     const interval = setInterval(() => {
  //       axiosCSPrivateInstance.get(`/ai_analysis/getAllAiAnalysisData/${pollingID}`)
  //         .then((response) => {
  //           if (response.data?.status === "completed") {
  //             clearInterval(interval); // Stop polling
  //             dispatch(RESET_LOADING_STATUS());
  //             setLoading(false);
  //             console.log("Analysis completed!");

  //             // Navigate to workspace after completion
  //             navigate(`${NavStrings?.WORKSPACE}/${projectID}`, { state: { key: aiMusicGeneratorOption } });
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error in request:", error);
  //           setLoading(false);
  //           setPollingModal(false)
  //         });
  //     }, 10000); // Retry every 10 seconds

  //     return () => clearInterval(interval); // Cleanup on unmount
  //   }, [pollingID, dispatch, navigate, projectID, aiMusicGeneratorOption]);

  // console.log("loading", loading);

  return (
    <>
      <Notifications allIds={notifications} />
      <div className="UploadViewVideo_container">
        <div className="video_upload_container_header">
          {!mediaFile && (
            <div className="video_upload_content">
              <h1>
                <FormattedMessage id={"AISearch.title"} />
              </h1>
              <p className="subtitle">
                <FormattedMessage id={"AISearch.subtitle"} />
              </p>
              <p className="option_selection_title">
                <FormattedMessage id={"AISearch.optionSelectionTitle"} />
              </p>
            </div>
          )}
          {mediaFile && (
            <div className="video_upload_container">
              <p className={"note"}>Your Video</p>
              <div className="thumbnail_container">
                <ReactPlayer
                  className="UploadViewVideo_video_thumbnail"
                  id="test"
                  width="100%"
                  height="100%"
                  style={{ backgroundColor: "var(--color-bg)" }}
                  url={mediaFile}
                  // muted={values.selectAudio === "AudioOff"}
                  onDuration={(duration) => {
                    if (!isNaN(duration)) {
                      setProjectDuration(duration);
                    }
                  }}
                  onReady={(e) => {
                    const video = document.querySelector(
                      ".thumbnail_container video"
                    );
                    const hasAudioInVideo = hasAudio(video);
                    setIsVideoHasAudio(hasAudioInVideo);
                    // if (!hasAudioInVideo) {
                    //   showNotification(
                    //     "WARNING",
                    //     "Your video has no audio"
                    //   );
                    // }
                  }}
                  onError={(e) => {
                    const newBlobUrl = window.URL.createObjectURL(
                      new Blob([FileSource])
                    );
                    setVidSource(newBlobUrl);
                  }}
                  controls
                  config={{
                    file: {
                      attributes: {
                        controlsList:
                          "nodownload noplaybackrate noremoteplayback",
                        disablePictureInPicture: true,
                      },
                    },
                  }}
                />
              </div>
              <div className="AITrackCreationWithVideo_btn_container">
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
                  disabled={aiMusicGenerator?.isLoading}
                  onClick={uploadVideo}
                >
                  {aiMusicGenerator?.isLoading
                    ? "Searching..."
                    : "Search Track"}
                </ButtonWrapper>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoUploadView;
