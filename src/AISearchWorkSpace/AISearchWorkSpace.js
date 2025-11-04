import React, { use, useEffect, useState } from "react";
import "./AISearchWorkSpace.css";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../common/components/MainLayout/MainLayout";
import IconWrapper from "../branding/componentWrapper/IconWrapper";
import AIMusicWorkSpaceOptions from "../common/components/HelperFunction/AIMusicWorkSpaceOptions";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import {
  resetVideoUpload,
  setVideoUpload,
} from "../redux/actions/VideoAction/videoUploadActions";
import AsyncService from "../networking/services/AsyncService";
import CustomLoaderSpinner from "../common/components/customLoaderSpinner/CustomLoaderSpinner";
import { resetAiMusicGenerator } from "../redux/actions/AIMusicGenerator/aiMusicGenerator";
import { showError } from "../redux/actions/notificationActions";
import { FormattedMessage } from 'react-intl';

const AISearchWorkSpace = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const selectedOption =
    queryParams.get("option") || localStorage.getItem("selectedOption");
  const AISearchId = queryParams.get("aiSearchid");
  // console.log('AISearchId', AISearchId)
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [brief, setBrief] = useState(
    JSON.parse(localStorage.getItem("AISearchConfig"))?.brief || ""
  );
  const [aiSearchid, setAiSearchId] = useState(null);
  const [processPercent, setProcessPercent] = useState(0);
  const [statusMaintenance, setStatusMaintenance] = useState(null);

  const handleOptionClick = (key) => {
    queryParams.set("option", key);
    navigate({ search: queryParams.toString() });
  };

  const selectedConfig = AIMusicWorkSpaceOptions.find(
    (option) => option.key === selectedOption
  );

  const RightPanelComponent = selectedConfig?.Component;
  const { mediaFile } = useSelector((state) => state.videoUpload);
  const { aiMusicGenerator } = useSelector((state) => state.aiMusicGenerator);
  const [file, setFile] = useState(null); // Initially the original mediaFile
  // const [file, setFile] = useState(mediaFile); // Initially the original mediaFile
  // const [hasTriedFallback, setHasTriedFallback] = useState(false);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("AISearchConfig"))?.aiSearchId;
    setAiSearchId(id);
  }, []);

  function GetAnalysisData(interval = 0) {
    AsyncService.loadData(`ai_search/getTracksFromGenreMoodTempo/${aiSearchid}`)
      .then((response) => {
        console.log("response", response.data.status);
        setTrackData(response.data);
        setStatusMaintenance(response?.data?.status)
        if (response.data?.status === "completed") {
          clearInterval(interval); // Stop polling
          setIsLoading(false);
          setBrief(response.data?.description);
        } else if (["failed", "bad_request"]?.includes(response.data?.status)) {
          clearInterval(interval); // Stop polling
          setIsLoading(false);
          // dispatch(showError("Something Went Wrong"));
        } else {
          setIsLoading(true); // Keep loader on
        }
      })
      .catch((error) => {
        console.error("Error in request:", error);
        setIsLoading(false);
        clearInterval(interval);
      });
  }

  useEffect(() => {
    if (!aiSearchid) return; // Prevent execution if ID is not set
    GetAnalysisData();
    const interval = setInterval(() => {
      GetAnalysisData(interval);
    }, 10000); // Retry every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate, aiSearchid]);

  useEffect(() => {
    // if (
    //   (selectedOption !== "video" || !aiSearchid || hasTriedFallback) &&
    //   !!mediaFile
    // )
    //   return;
    const loadBlobFile = async () => {
      try {
        if (!aiSearchid || selectedOption !== "video") return;
        setIsVideoLoading(true);
        const response = await AsyncService.loadBlobParam(
          `ai_search/getFile/${aiSearchid}`,
          {
            onDownloadProgress: (progressEvent) => {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProcessPercent(percentage);
            },
          }
        );
        const url = URL.createObjectURL(new Blob([response.data]));
        console.log("url", url);
        dispatch(setVideoUpload(url));
        setFile(url);
      } catch (error) {
        console.error("Error in fallback video load:", error);
      } finally {
        setIsVideoLoading(false);
      }
    };

    // if (hasTriedFallback || !mediaFile) {
    loadBlobFile();
    // }
  }, [selectedOption, aiSearchid]);

  return (
    <MainLayout>
      <div className="AISearchWorkSpace_container">
        <div className="content">
          {/* selection cards */}
          <div className="mainSide_bar">
            <div
              className="AISearchWorkSpace_backBtn"
              onClick={() => {
                navigate("/ai_search");
                dispatch(resetVideoUpload());
                localStorage.removeItem("AISearchConfig");
                dispatch(resetAiMusicGenerator());
              }}
            >
              <IconWrapper icon={"Back"} />
              <span>Back</span>
            </div>
            <div className="cards-grid">
              {AIMusicWorkSpaceOptions?.map(
                ({ key, icon, title, subTitle }) => {
                  const isActive = selectedOption === key;
                  const showHeader =
                    !isActive || key === "SimilaritySearch" || key === "brief";
                  return (
                    <div
                      className={`card ${isActive ? "active" : "not-active"}`}
                      key={key}
                      onClick={() => handleOptionClick(key)}
                    >
                      {showHeader && (
                        <>
                          <div className="card-icon">
                            <IconWrapper icon={icon} />
                          </div>
                          <h2>{title}</h2>
                          <p>{subTitle}</p>
                        </>
                      )}

                      {isActive && key === "video" && (
                        <div className="card-layout-content">
                          {/* Replace with your actual video input UI */}
                          <div className="thumbnail_container">
                            {isVideoLoading ? (
                              <div className="thumbnail_container_loader">
                                <CustomLoaderSpinner
                                  processPercent={processPercent}
                                />
                              </div>
                            ) : (
                              <ReactPlayer
                                className="UploadViewVideo_video_thumbnail"
                                id="ai_search_video"
                                width="100%"
                                height="100%"
                                style={{ backgroundColor: "var(--color-bg)" }}
                                url={file}
                                onReady={(e) => {
                                  const video = document.querySelector(
                                    ".thumbnail_container video"
                                  );
                                }}
                                // onError={(e) => {
                                //   // Trigger fallback logic
                                //   if (!hasTriedFallback)
                                //     setHasTriedFallback(true);
                                // }}
                                controls
                                muted
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
                            )}
                          </div>
                        </div>
                      )}

                      {isActive && key === "brief" && (
                        <>
                          {/* {!!localStorage.getItem("briefFileName") ? (
                            <div className="card-layout-content">
                              <p>File name :-</p>
                              <p>{localStorage.getItem("briefFileName")}</p>
                              <textarea
                                className="brief-textarea"
                                value=""
                                disabled={!trackData?.description}
                              />
                            </div>
                          ) : ( */}
                          <div className="card-layout-content">
                            {/* Replace with your actual brief input UI */}
                            {!!JSON.parse(
                              localStorage.getItem("AISearchConfig")
                            )?.briefFileName ? (
                              <>
                                <p>File name :</p>
                                <p
                                  style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {
                                    JSON.parse(
                                      localStorage.getItem("AISearchConfig")
                                    )?.briefFileName
                                  }
                                </p>
                              </>
                            ) : (
                              <p>Prompt</p>
                            )}
                            <textarea
                              className="brief-textarea"
                              value={
                                trackData?.description?.replace(/\\n/g, " ") ||
                                JSON.parse(
                                  localStorage.getItem("AISearchConfig")
                                )?.brief
                              }
                              disabled={!trackData?.description}
                            // value={brief || localStorage.getItem("brief")}
                            // onChange={(e) => {
                            //   setBrief(e?.target?.value);
                            // }}
                            />
                          </div>
                          {/* )} */}
                        </>
                      )}
                    </div>
                  );
                }
              )}
            </div>
            <div className="bottomBar">
              <p className="cmn_label">Not convinced with the track results?</p>
              <ButtonWrapper
                className="commision_button"
                onClick={() => navigate("/CustomTrackForm")}
              >
                Commission a Custom Track
              </ButtonWrapper>
            </div>
          </div>
          {isLoading && selectedOption !== "SimilaritySearch" ? (
            <div className="loader_container">
              <div className="loader_container_text">
                {/* Replace this with your actual loader/spinner */}
                {["in_progress", "not_send"].includes(trackData?.status) && (
                  <h1>Generating AI search result...</h1>
                )}
                <SpinnerDefault />
              </div>
            </div>
          ) : (
            <>
              {RightPanelComponent ? (
                <div className="AISearch_Content">
                  <RightPanelComponent trackData={trackData} status={statusMaintenance} />
                </div>
              ) : (
                <div className="">
                  <FormattedMessage id={"AISearch.NoDataFound"} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AISearchWorkSpace;
