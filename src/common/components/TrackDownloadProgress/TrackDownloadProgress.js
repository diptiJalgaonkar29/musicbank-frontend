import React from "react";
import "./TrackDownloadProgress.css";
import { useDispatch, useSelector } from "react-redux";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { setDownloadBasketMeta } from "../../../redux/actions/trackDownloads/tracksDownload";

const TrackDownloadProgress = () => {
  const { trackDownloadingPercent, showTrackDownloadingProgress } = useSelector(
    (state) => state.downloadBasket
  );
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(
      setDownloadBasketMeta({
        showTrackDownloadingProgress: false,
      })
    );
  };

  if (showTrackDownloadingProgress) {
    return (
      <div className="TrackDownloadProgress_container">
        <p className="TrackDownloadProgress_note">
          Downloading tracks... {trackDownloadingPercent?.toFixed(2)}%
          <IconButtonWrapper
            icon={"Close"}
            onClick={onClose}
            className="TrackDownloadProgress_close_icon"
          />
        </p>
      </div>
    );
  } else {
    return <></>;
  }
};

export default TrackDownloadProgress;
