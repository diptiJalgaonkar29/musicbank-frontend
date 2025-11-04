import React, { useEffect, useState } from "react";
import "./VideoPopup.css";
import Iframe from "react-iframe";
import ModalWrapper from "../../branding/componentWrapper/ModalWrapper";
import AsyncService from "../../networking/services/AsyncService";
import { SpinnerDefault } from "../../common/components/Spinner/Spinner";

const VideoPopup = ({ videoUrl, title, isPopupOpen, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        setBlobUrl(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!videoUrl || videoUrl?.endsWith(".mp4")) return;
    console.log("videoUrl", videoUrl);
    setIsLoading(true);
    AsyncService.loadBlob(videoUrl?.replace("api", ""))
      .then((res) => {
        console.log("res", res);
        let url = URL.createObjectURL(res.data);
        console.log("url", url);
        setBlobUrl(url);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoading(false));
  }, [videoUrl]);

  return (
    <>
      <ModalWrapper
        isOpen={isPopupOpen}
        onClose={() => {
          onClose();
          setBlobUrl(null);
        }}
        title={title}
        aria-labelledby="document-viewer"
        className="document_viewer"
      >
        {videoUrl?.endsWith(".mp4") ? (
          <video
            className="vidplayer"
            width="100%"
            height="auto"
            controls
            autoPlay
            controlsList="nodownload noplaybackrate"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            {isLoading ? (
              <div className="document_viewer_loader">
                <SpinnerDefault />
              </div>
            ) : (
              <Iframe
                src={blobUrl}
                className="vidplayer"
                width="100%"
                height="auto"
              />
            )}
          </>
        )}
      </ModalWrapper>
    </>
  );
};

export default VideoPopup;
