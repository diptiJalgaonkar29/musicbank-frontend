import React, { useMemo } from "react";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import "./TrackPageHeader.css";
import { formatDuration } from "../../../common/utils/formatDuration";
import TrackTypeBadge from "../../../AISearchScreen/Components/TrackTypeBadge/TrackTypeBadge";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import WaveSurferForm from "../../../AISearchScreen/Components/GetWaveForm/WaveSurferForm";
import AudioPlayerSH2 from "../../../common/components/Audiplayer/AudioPlayerSH2";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import CustomWaveform from "../../../common/utils/CanvasWaveform";

const TrackPageHeader = ({
  imgSrc,
  isImgLoading,
  trackName,
  trackType,
  children,
  isSonicLogo,
  keyTag,
  wavefile,
  tempo,
  trackId,
  sonichub_track_id,
  source_id,
  detail_image,
  waveform_js,
  waveformJSData,
  trackdetails_objectID,
  ...audioPlayerProps
}) => {
  // const waveformScriptUrl =
  //   getMediaBucketPath(`${wavefile}`, source_id, "waveform") +
  //   `?id=canvas-${trackId}`;

  //console.log("waveformScriptUrl from tph", waveformScriptUrl)
  //console.log("waveformJSData from tph", waveformJSData);

  //console.log("wavefile, source_id", wavefile, source_id);

  function isValidURL(url) {
    try {
      new URL(url); // will throw if invalid
      return true;
    } catch (_) {
      return false;
    }
  }

  const waveformScriptUrl = useMemo(() => {
    const url =
      getMediaBucketPath(`${wavefile}`, source_id, "waveform") +
      `?id=canvas-${trackId}`;
    return isValidURL(url)
      ? url
      : `${document.location.origin}/brandassets/common/js/57508207-2.js?id=${trackId}`;
  }, [wavefile, source_id, trackId]);

  return (
    <div className="TrackPageHeader_container">
      <div className="TrackPageHeader_container_left">
        {!isImgLoading ? (
          <div className="TrackPageHeader_img_holder">
            <img
              src={imgSrc}
              alt="Preview"
              onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                e.currentTarget.src = `${document.location.origin}/brandassets/common/images/default_cover.png`;
              }}
            />
            <div className="TrackPageHeader_img_play_btn">
              <AudioPlayerSH2
                {...audioPlayerProps}
                imgSrc={imgSrc}
                wavefile={wavefile}
                source_id={source_id}
                waveformJSData={waveformJSData}
                trackId={trackId}
                index={sonichub_track_id}
                key={sonichub_track_id}
                trackdetails_objectID={trackdetails_objectID}
              />
            </div>
          </div>
        ) : (
          <div className="TrackPageHeader_img_spinner_holder">
            <SpinnerDefault />
          </div>
        )}
      </div>
      <div className="TrackPageHeader_container_right">
        <div className="TrackPageHeader_track_title_player_container">
          <TrackTypeBadge trackType={Number(trackType) || ""} />
          <h2 className="TrackPageHeader_track_title">{trackName}</h2>
        </div>

        {isSonicLogo ? (
          <p className="TrackPageHeader_wave_header sonicLogoText">
            <span>{formatDuration(audioPlayerProps?.track_length)}</span>
            {!!keyTag && <span>Key : {keyTag}</span>}
          </p>
        ) : (
          <div className="TrackPageHeader_wave_container">
            {console.log("called_12445666")}
            <div className="TrackPageHeader_wave" data-attr={wavefile}>
              {wavefile && trackId && (
                <WaveSurferForm
                  key={trackId}
                  waveformScriptUrl={waveformScriptUrl}
                  wavformjsurl={waveformScriptUrl}
                  fallbackScriptUrl={`${document.location.origin}/brandassets/common/js/57508207-2.js?id=${trackId}`}
                  duration={20}
                  uuid={trackId}
                />
              )}
            </div>
            <div
              className="canvasWaveformContainer"
              data-attr={waveformJSData}
              style={{ display: "none" }}
            >
              <CustomWaveform
                scriptUrl={`${waveformJSData}?id=${trackId}`}
                fallbackUrl={`${document.location.origin}/brandassets/common/js/57508207-2.js?id=${trackId}`}
              />
            </div>
            <p className="TrackPageHeader_duration">
              {formatDuration(audioPlayerProps?.track_length)}
              <span
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <IconWrapper icon="MusicIcon" />
                <span>{`=${tempo}`}</span>
              </span>
            </p>
          </div>
        )}
        <div className="TrackPageHeader_action_btn_container">{children}</div>
      </div>
    </div>
  );
};

export default React.memo(TrackPageHeader);
