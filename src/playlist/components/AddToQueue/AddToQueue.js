import React, { useContext, useState } from "react";
import "./AddToQueue.css";
import { useDispatch } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import MediaService from "../../../common/services/MediaService";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import { CircularProgress } from '@mui/material';

const AddToQueue = ({ trackMeta = {}, waveformData, className }) => {
  const dispatch = useDispatch();
  const { config } = useContext(BrandingContext);
  const { playPause, setPlayList, setPlayListType, playList } = useContext(
    FooterMusicPlayerContext
  );
  const [loading, setLoading] = useState(false);

  const addToQueue = async () => {
    // console.log("trackMeta", trackMeta);
    setLoading(true);
    try {
      setPlayListType("queue");
      // console.log("playList", playList);
      if (playList?.length === 0) {
        let trackmp3Blob = await MediaService.getMp3(trackMeta?.mp3);
        let trackImageBlob = await MediaService.getImage(trackMeta?.img);

        playPause({
          mp3: trackmp3Blob,
          title: trackMeta?.title,
          waveImage: waveformData,
          trackImage: trackImageBlob,
          id: +trackMeta?.id,
        });
      }

      const isTrackInPlayList = !!playList.find(
        (track) => track?.id === trackMeta?.id
      );
      if (isTrackInPlayList) {
        dispatch(showError(`Already Added in queue`));
      } else {
        setPlayList((prev) => [...prev, trackMeta]);
        dispatch(showSuccess(`Added ${trackMeta?.title} in queue`));
      }
    } catch (error) {
      dispatch(showError("Something went wrong!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {config.modules.showFooterMusicPlayer && (
        <ToolTipWrapper title="Add to queue">
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButtonWrapper
              icon="AddToQueue"
              className={`addtoQueue_btn ${className}`}
              onClick={addToQueue}
            />
          )}
        </ToolTipWrapper>
      )}
    </>
  );
};
export default AddToQueue;
