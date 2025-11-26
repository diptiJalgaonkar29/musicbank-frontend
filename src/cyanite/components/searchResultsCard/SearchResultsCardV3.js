import React, { useEffect, useState } from "react";
import "./SearchResultsCardV3.css";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { formatDuration } from "../../../common/utils/formatDuration";
import AudioPlayerSH2 from "../../../common/components/Audiplayer/AudioPlayerSH2";
import { useDispatch, useSelector } from "react-redux";
import { setTrackData } from "../../../redux/actions/trackActions/trackActions";
import { useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import {
  removeFavTrackId,
  setFavTrackId,
} from "../../../redux/actions/searchActions";
import {
  logEvent,
  TRACK_TITLE_CLICK,
  TRACK_LIKE,
} from "../../../common/utils/logEvent";

const SearchResultsCardV3 = ({
  id,
  track_name,
  duration,
  data_type,
  preview_image_url,
  tags,
  icon_url,
  defaultImg,
  preview_track_url,

  // 🔹 Missing props for AudioPlayerSH2
  track_type_id,
  track_length,
  sonichub_track_id,
  waveformData,
  queryID,
  preview_track_image_url,
  playingAudio,
  setPlayingAudio,
  playPause,
  setPlayList,
  setPlayingIndex,
  setPlayListType,
  isSonicLogo,
  keyTags,
  strotswar_track_id,
  wavefile,
  wave_form_js,
  track_mediatypes,
  genreTags,
  ampMoodTags,
  instrumentTags,
  bpm,
  wav_track,
  mp3_track,
  stems_zip,
  objectID,
  favTracksIds,
  eventTags,
  movementTags,
  instrument_vocal_data,
  source_id,
}) => {
  console.log(favTracksIds);
  console.log(sonichub_track_id);
  const [loading, setLoading] = useState(true);
  const [previewImageData, setPreviewImageData] = useState(null);
  const [imgError, setImgError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ local state to toggle like/unlike instantly
  const [localFav, setLocalFav] = useState(
    favTracksIds?.includes(String(sonichub_track_id))
  );
  // alert(localFav);

  useEffect(() => {
    setPreviewImageData(preview_image_url);
  }, [preview_image_url]);

  useEffect(() => {
    // keep local state in sync if Redux updates later
    setLocalFav(favTracksIds?.includes(String(sonichub_track_id)));
  }, [favTracksIds, sonichub_track_id]);

  const redirect = (id) => {
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );
    const topGenreTags = (genreTags || [])
      .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
      .slice(0, 10);

    // Slice the ampMoodTags to get only the first 10 visible tags
    const topEmotionTags = (ampMoodTags || [])
      .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()))
      .slice(0, 10);
    // const topGenreTags = genreTags.tag_names.slice(0, 10);
    // const topEmotionTags = ampMoodTags.tag_names.slice(0, 10);
    const topEventTags = eventTags.slice(0, 3);
    const topMovementTags = movementTags.slice(0, 3);
    const topInstrumentsTags = instrumentTags.tag_names.slice(0, 10);

    dispatch(
      setTrackData({
        // genreTags: topGenreTags,
        // emotionTags: topEmotionTags,
        // eventTags: topEventTags,
        // movementTags: topMovementTags,
        // instruments: topInstrumentsTags,
        // bpm: bpm,
        // keyTag: keyTags,
        // imgSrc: preview_image_url,
        // wavefile: wavefile,
        // strotswar_track_id: strotswar_track_id,
        // sonichub_track_id: sonichub_track_id,
        // wav_track: wav_track,
        // mp3_track: mp3_track,
        // stems_zip: stems_zip,
        genreTags: topGenreTags,
        emotionTags: topEmotionTags,
        eventTags: topEventTags,
        movementTags: topMovementTags,
        instruments: topInstrumentsTags,
        bpm: bpm,
        keyTag: keyTags,
        imgSrc: preview_image_url,
        wavefile: wavefile,
        strotswar_track_id: strotswar_track_id,
        sonichub_track_id: id,
        wav_track: wav_track,
        mp3_track: mp3_track,
        stems_zip: stems_zip,
        track_mediatypes: track_mediatypes,
        instrument_vocal_data: instrument_vocal_data,
        source_id: source_id,
      })
    );

    navigate(`/track_page/${id}`);
  };

  const likeUnlikeTrack = (trackId) => {
    // ✅ update UI immediately
    setLocalFav((prev) => !prev);

    const favMeta = { fav_data: trackId, type: 1 };
    AsyncService.postData(`/favourites/insert`, favMeta)
      .then((res) => {
        const status = res.data?.Status;

        if (["liked", "inserted"].includes(status)) {
          dispatch(setFavTrackId(String(trackId)));
        } else if (status === "unliked") {
          dispatch(removeFavTrackId(String(trackId)));
        }
      })
      .catch((err) => {
        console.error("Error liking/unliking track:", err);
        // rollback if API fails
        setLocalFav((prev) => !prev);
      });
  };

  return (
    <div className="search_results_card_container">
      {/* Left Image */}
      <div className="search_results_card_img_container">
        {loading && (
          <div className="search_results_card_loader">
            <SpinnerDefault />
          </div>
        )}
        <img
          src={imgError ? defaultImg : preview_image_url}
          alt={track_name}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImgError(true);
            setLoading(false);
          }}
          className="track-image"
        />

        <AudioPlayerSH2
          imgSrc={preview_image_url}
          isImgLoading={loading}
          trackName={track_name}
          songUrl={preview_track_url}
          trackType={track_type_id}
          track_length={track_length}
          index={sonichub_track_id}
          waveformDataProp={waveformData}
          playFromPicture={false}
          key={queryID}
          type={"TpTc"}
          active={true}
          isCyaniteActive={false}
          trackCardNameProp={track_name}
          srcUrl={preview_track_image_url}
          playingAudio={playingAudio}
          setPlayingAudio={setPlayingAudio}
          playPause={playPause}
          setPlayList={setPlayList}
          setPlayingIndex={setPlayingIndex}
          setPlayListType={setPlayListType}
          isSonicLogo={isSonicLogo}
          keyTag={keyTags?.[0]}
          strotswar_track_id={strotswar_track_id}
          wavefile={wavefile}
          wave_form_js={wave_form_js}
          track_mediatypes={track_mediatypes}
          track_type_id={track_type_id}
          source_id={source_id}
          genreTags={genreTags}
          ampMoodTags={ampMoodTags}
          instrumentTags={instrumentTags}
          eventTags={eventTags}
          movementTags={movementTags}
          bpm={bpm}
        />
      </div>

      {/* Middle Info */}
      <div className="search_results_card_info_container">
        <span
          className="search_results_card_title"
          onClick={(e) => {
            logEvent({
              objectIdList: [objectID],
              eventType: TRACK_TITLE_CLICK,
              moodName: ampMoodTags?.tag_names?.[0] || "",
              moodValue: ampMoodTags?.tag_values?.[0] || 0,
              genreName: genreTags?.tag_names?.[0] || "",
              genreValue: genreTags?.tag_values?.[0] || 0,
              pageName: window.location.hash.replace("#/", "") || "",
            });
            redirect(objectID);
          }}
        >
          {track_name}
        </span>
        {tags && tags.length > 0 && (
          <div className="tags_container">
            {tags.map((tag, idx) => (
              <span key={idx} className="track-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Icon + Duration */}
      <div className="track_icon_container">
        {duration && (
          <span className="search_results_card_duration" title={duration}>
            {formatDuration(duration)}
          </span>
        )}
        {localFav ? (
          <IconButtonWrapper
            icon="LikeOn"
            className="favBtn"
            onClick={(e) => {
              logEvent({
                objectIdList: [objectID],
                eventType: TRACK_LIKE,
                moodName: ampMoodTags?.tag_names?.[0] || "",
                moodValue: ampMoodTags?.tag_values?.[0] || 0,
                genreName: genreTags?.tag_names?.[0] || "",
                genreValue: genreTags?.tag_values?.[0] || 0,
                pageName: window.location.hash.replace("#/", "") || "",
              });
              likeUnlikeTrack(sonichub_track_id);
            }}
          />
        ) : (
          <IconButtonWrapper
            icon="LikeOff"
            className="favBtn"
            onClick={(e) => {
              logEvent({
                objectIdList: [objectID],
                eventType: TRACK_LIKE,
                moodName: ampMoodTags?.tag_names?.[0] || "",
                moodValue: ampMoodTags?.tag_values?.[0] || 0,
                genreName: genreTags?.tag_names?.[0] || "",
                genreValue: genreTags?.tag_values?.[0] || 0,
                pageName: window.location.hash.replace("#/", "") || "",
              });
              likeUnlikeTrack(sonichub_track_id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResultsCardV3;
