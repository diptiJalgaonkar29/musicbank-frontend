import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { formatDuration } from "../../../common/utils/formatDuration";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import {
  setFavTrackId,
  removeFavTrackId,
} from "../../../redux/actions/searchActions";
// import SimilaritySearchMenu from "../../../playlist/components/SimilaritySearchMenu/SimilaritySearchMenu";
// import AddItemToPlaylistMenuV2 from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
// import AddToQueue from "../../../playlist/components/AddToQueue/AddToQueue";
import DownloadWidgetWithCookiesV2Dialog from "../../../track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV2Dialog";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import Picture from "../AnimatedPicture/AnimatedPicture";
import AsyncService from "../../../networking/services/AsyncService";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";
//import MediaService from "../../../common/services/MediaService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import TrackCardV3AudioPlayer from "../../../common/components/Audiplayer/TrackCardV3AudioPlayer/TrackCardV3AudioPlayer";
import "./TrackcardV3.css";
import TrackTypeBadge from "../../../AISearchScreen/Components/TrackTypeBadge/TrackTypeBadge";
import AudioPlayerSH2 from "../../../common/components/Audiplayer/AudioPlayerSH2";
import { setTrackData } from "../../../redux/actions/trackActions/trackActions";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import { boolean } from "yup";
import {
  logEvent,
  TRACK_LIKE,
  TRACK_TITLE_CLICK,
  SIMILARITY_SEARCH,
  TAKE_TO_AI,
  DOWNLOAD_PREVIEW,
} from "../../../common/utils/logEvent";

export default function TrackcardV3(props) {
  // console.log("TrackcardV3 - favTracksIds", props.favTracksIds);
  // console.log("TrackcardV3 - indexProp", props.indexProp);

  const { onRefine = () => {} } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { aimusicprovider, isCSUser } = useSelector((state) => state.userMeta);
  //const aimusicprovider = userMeta?.aimusicprovider;
  // const isCSUser = userMeta?.isCSUser;
  // const showTakeToAI = window.globalConfig?.SHOW_TAKETOAI;
  // const isCsTrackForStability = aimusicprovider === "stability";
  // const isDurationValidforStability =
  //   props.duration_in_sec >= 6 && props.duration_in_sec <= 185;
  // const isTrackForTuney = props.track_cs_status && props.track_flaxid;

  // const stabilityProviderCheck =
  //   isCSUser &&
  //   showTakeToAI &&
  //   isDurationValidforStability &&
  //   isCsTrackForStability;
  // const tuneyProviderCheck = isCSUser && showTakeToAI && isTrackForTuney;

  const [loading, setLoading] = useState(true);
  const [previewImageData, setPreviewImageData] = useState(null);
  const [waveformData, setWaveformData] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [clickedOnImage, setClickedOnImage] = useState(false);
  const playingIndexFromStore = props.playingIndex;
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const { onSimilaritySearch = () => {} } = props;
  // console.log("TrackcardV3 - props", props.wave_form_js, props.source_id);

  console.log("window.globalConfig", window.globalConfig);

  const loadImages = useCallback(() => {
    Promise.all([]).then(([imageData]) => {
      setPreviewImageData(imageData);
      // setWaveformData(waveform);
      setLoading(false);
    });
  }, [props.preview_image_url, props.preview_track_url]);

  useEffect(() => {
    loadImages();
  }, []);

  // const trackTitleClick = (propsData, eventTypeKey) => {
  //   const eventType = EVENT_TYPES[eventTypeKey];
  //   const eventTypeId = EVENT_TYPE_IDS[eventTypeKey];

  //   trackEvent({
  //     algoliaId: props.trackdetails_objectID,

  //     mood_name: props.ampMoodTags?.[0] || "",

  //     mood_value: props.amp_all_mood_tags?.tag_values?.[0] || 0,

  //     genre_name: props.genreTags?.[0] || "",

  //     genre_value: props.amp_genre_tags?.tag_values?.[0] || 0,

  //     // projectId: props.strotswar_track_id || "NA",

  //     searchType: window?.globalConfig?.SEARCH_TYPE || "",

  //     eventType,

  //     eventTypeId,

  //     tempo: props.bpm,

  //     pageName: window.location.hash.replace("#/", "") || "",

  //     // serachType: "TagType",
  //     // objectIds: ["algoliaId"],
  //     // eventType: "TrackNameclick",
  //     // eventTypeId: "1",
  //     // moodName: "asdfg",
  //     // moodValue: "63598",
  //     // tempoName: "fast",
  //     // tempoValue: "654239",
  //     // generName: "qwerty",
  //     // generValue: "9632145",
  //     // pageName: "AISearchScreen",
  //   });
  // };

  const redirect = (id) => {
    // Get hidden tags in lowercase
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );

    // Slice the genreTags to get only the first 10 visible tags
    const topGenreTags = (props.genreTags || [])
      .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
      .slice(0, 10);

    // Slice the ampMoodTags to get only the first 10 visible tags
    const topEmotionTags = (props.ampMoodTags || [])
      .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()))
      .slice(0, 10);

    const topEventTags = (props.eventTags || []).slice(0, 3);
    const movementTags = (props.movementTags || []).slice(0, 3);

    // Combine event & movement tags and take 3 random ones

    const topInstrumentsTags = (props.instrumentTags || []).slice(0, 10);

    // Dispatch the action
    dispatch(
      setTrackData({
        trackdetails_objectID: props.trackdetails_objectID,
        genreTags: topGenreTags,
        emotionTags: topEmotionTags,
        eventTags: topEventTags,
        movementTags: movementTags,
        instruments: topInstrumentsTags,
        bpm: props.bpm,
        keyTag: props.keyTags,
        imgSrc: props.preview_image_url,
        wavefile: props.wavefile,
        strotswar_track_id: props.strotswar_track_id,
        sonichub_track_id: props.id,
        wav_track: props.wav_track,
        mp3_track: props.mp3_track,
        stems_zip: props.stems_zip,
        track_mediatypes: props.track_mediatypes,
        instrument_vocal_data: props.instrument_vocal_data,
        source_id: props.source_id,
      })
    );

    // Navigate to the track page
    navigate(`/track_page/${id}`);
  };

  const handleChange = (panel) => () => {
    setExpanded((prev) => (prev === panel ? false : panel));
  };

  const renderTaxonomyTags = () => {
    //console.log("renderTaxonomyTags", props);
    let top5Genres = [];
    // Get hidden tags from global config
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );

    let emotionsgreaterthandot5 = [];
    if (props.asset_type_id == 1) {
      top5Genres =
        props.amp_genre_tags?.tag_names && props.amp_genre_tags?.tag_values
          ? props.amp_genre_tags.tag_names
              .map((name, index) => ({
                name,
                value: props.amp_genre_tags.tag_values[index],
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((tag) => tag.name)
              .filter((tag) => !hideGenreTags.includes(tag.toLowerCase())) // <-- filter hidden
          : (props.genreTags || [])
              .slice(0, 5)
              .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()));
      if (
        props.amp_all_mood_tags?.tag_names &&
        props.amp_all_mood_tags?.tag_values
      ) {
        if (
          props.amp_all_mood_tags?.tag_names &&
          props.amp_all_mood_tags?.tag_values
        ) {
          emotionsgreaterthandot5 = props.amp_all_mood_tags.tag_names
            .map((name, index) => ({
              name,
              value: props.amp_all_mood_tags.tag_values[index],
            }))
            .filter((item) => item.value >= 0.5)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((tag) => tag.name)
            .filter((tag) => !hideMoodTags.includes(tag.toLowerCase())); // <-- filter hidden
        }
      }

      // If the filtered list is empty, fall back to the top 5 from the original dataset
      if (emotionsgreaterthandot5.length === 0) {
        emotionsgreaterthandot5 = (props.amp_all_mood_tags?.tag_names || [])
          .slice(0, 5)
          .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()));
      }
    } else if (props.asset_type_id == 2) {
    }

    const domains = [
      {
        label: "Genres",
        items: top5Genres || [],
        //items: amp_genre_tags || [],
        className: "amp_genre_tags.tag_names",
        refine: (val) => onRefine("tag_genre", val),
      },
      {
        label: "Emotions",
        items: emotionsgreaterthandot5 || [],
        //items: props.ampMoodTags || [],
        className: "amp_all_mood_tags.tag_names",
        refine: (val) => onRefine("tag_amp_allmood_ids", val),
      },
      {
        label: "Instruments",
        items: props.instrumentTags || [],
        className: "amp_instrument_tags.tag_names",
        refine: (val) => onRefine("instrument_ids", val),
      },
      {
        label: "BPM",
        items: props.tag_tempo || [],
        className: "tag_tempo",
        refine: (val) => onRefine("tag_tempo", val),
      },
      {
        label: "Key",
        items: props.keyTags || [],
        className: "tag_key",
        refine: (val) => onRefine("tag_key", val),
      },
      {
        label: "Instrumental/Vocal",
        items: props.instrument_vocal_data,
        className: "instrument_vocal_data",
        refine: (val) => onRefine("instrument_vocal_data", val),
      },
      {
        label: "Stems",
        items: props.stems_zipYesNo,
        className: "stems_zip",
        refine: (val) => onRefine("stems_zip", val),
      },
    ];

    const content = (
      <div className="TrackcardV3__item__tags">
        <div className="TrackcardV3__item__tags_container">
          {/* {console.log("domains", domains)} */}
          {domains.map((domain, index, arr) => (
            <>
              <span className="trackFilterLabel">{domain.label}</span>
              {Array.isArray(domain.items) && domain.items.length > 0 ? (
                <Fragment key={domain.label}>
                  {Array.isArray(domain.items) ? (
                    domain.items.slice(0, 10).map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className={`trackFilterOption ${
                          props.isTagRefined?.(domain.className, item)
                            ? "refined"
                            : ""
                        }`}
                        // style={{
                        //   backgroundColor: props.isTagRefined?.(
                        //     domain.className,
                        //     item
                        //   )
                        //     ? "#444444"
                        //     : "transparent",
                        // }}
                        onClick={
                          domain.refine ? () => domain.refine(item) : undefined
                        }
                        // onClick={() => {
                        //   if (domain.refine) domain.refine(item);

                        //   const isMood = domain.label === "Emotions";
                        //   const isGenre = domain.label === "Genres";

                        //   const moodIndex = isMood
                        //     ? props?.amp_all_mood_tags?.tag_names?.indexOf(item)
                        //     : -1;

                        //   const genreIndex = isGenre
                        //     ? props?.amp_genre_tags?.tag_names?.indexOf(item)
                        //     : -1;

                        //   logEvent({
                        //     eventType: "AI_SEARCH_SIDE_FILTER",
                        //     searchType: domain.label.toLowerCase(),
                        //     pageName:
                        //       window.location.hash.replace("#/", "") || "",
                        //     // Mood
                        //     moodName: isMood ? item : null,
                        //     moodValue:
                        //       isMood && moodIndex >= 0
                        //         ? props?.amp_all_mood_tags?.tag_values?.[
                        //             moodIndex
                        //           ]
                        //         : null,

                        //     // Genre
                        //     genreName: isGenre ? item : null,
                        //     genreValue:
                        //       isGenre && genreIndex >= 0
                        //         ? props?.amp_genre_tags?.tag_values?.[
                        //             genreIndex
                        //           ]
                        //         : null,
                        //   });
                        // }}
                      >
                        {item?.toString()}
                      </span>
                    ))
                  ) : (
                    <span
                      className={`trackFilterOption ${
                        props.isTagRefined?.(domain.className, domain.items)
                          ? "refined"
                          : ""
                      }`}
                      // style={{
                      //   backgroundColor: props.isTagRefined?.(
                      //     domain.className,
                      //     domain.items
                      //   )
                      //     ? "#444444"
                      //     : "transparent",
                      // }}
                      onClick={
                        domain.refine
                          ? () => domain.refine(domain.items)
                          : undefined
                      }
                    >
                      {/* {alert(props.isTagRefined)} */}
                      {domain.items?.toString()}
                    </span>
                  )}
                  <span className="verticalDevider"></span>
                </Fragment>
              ) : (
                <>
                  <span
                    className={`trackFilterOption ${
                      props.isTagRefined?.(domain.className, domain.items)
                        ? "refined"
                        : ""
                    }`}
                    // style={{
                    //   backgroundColor: props.isTagRefined?.(
                    //     domain.className,
                    //     domain.items
                    //   )
                    //     ? "#444444"
                    //     : "transparent",
                    // }}
                    onClick={
                      domain.refine
                        ? () => domain.refine(domain.items)
                        : undefined
                    }
                  >
                    {/* {alert(props.isTagRefined)} */}
                    {domain.items?.toString()}
                  </span>
                  {domain.label !== "Stems" &&
                    index !==
                      domains
                        .map((d, i) =>
                          Array.isArray(d.items) && d.items.length > 0
                            ? i
                            : null
                        )
                        .filter((i) => i !== null)
                        .slice(-1)[0] && (
                      <span className="verticalDevider"></span>
                    )}
                </>
              )}
            </>
          ))}
        </div>
      </div>
    );

    return content;
  };
  const renderTopEmotionTags = () => {
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );

    const emotionTags =
      getSortedLabelledTagsArray(props.ampMoodTags, "AMP_MOOD_TAGS") || [];

    // Filter out hidden tags
    const visibleTags = emotionTags.filter(
      (tag) => !hideMoodTags.includes(tag.toLowerCase())
    );

    const topThree = visibleTags.slice(0, 3);

    return (
      <div className="TrackcardV3__item__tags_container">
        {topThree.map((tag, index) => (
          <ChipWrapper
            key={index}
            label={tag?.toString()}
            className="tag_amp_allmood_ids"
          />
        ))}
      </div>
    );
  };

  const likeUnlikeTrack = (trackId) => {
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
      });
  };

  return (
    <>
      <FooterMusicPlayerContext.Consumer>
        {({
          playingAudio,
          setPlayingAudio,
          playPause,
          setPlayList,
          setPlayingIndex,
          setPlayListType,
          playListType,
        }) => (
          <>
            <div className="TrackcardV3" key={props.indexProp}>
              <Accordion
                key={props.indexProp}
                expanded={expanded === `panel${props.indexProp}`}
              >
                <AccordionSummary>
                  <div className="TrackcardV3__main">
                    <div className={`TrackcardV3__Left`}>
                      <div className="TrackcardV3__cover">
                        <Picture
                          key={props.indexProp}
                          srcUrl={props.preview_image_url}
                          loading={loading}
                          index={props.indexProp}
                        />
                        <AudioPlayerSH2
                          {...props}
                          imgSrc={props.preview_image_url}
                          isImgLoading={props.loading}
                          trackName={props.track_name}
                          songUrl={props.preview_track_url}
                          trackType={props.track_type_id}
                          track_length={props.track_length}
                          index={props.id}
                          waveformDataProp={props.waveformData}
                          playFromPicture={false}
                          key={props.queryID}
                          type={"TpTc"}
                          active={true}
                          isCyaniteActive={false}
                          trackCardNameProp={props.track_name}
                          srcUrl={props.preview_track_image_url}
                          playingAudio={playingAudio}
                          setPlayingAudio={setPlayingAudio}
                          playPause={playPause}
                          setPlayList={setPlayList}
                          setPlayingIndex={setPlayingIndex}
                          setPlayListType={setPlayListType}
                          isSonicLogo={props.isSonicLogo}
                          keyTag={props.keyTags?.[0]}
                          strotswar_track_id={props.strotswar_track_id}
                          wavefile={props.wavefile}
                          wave_form_js={props.wave_form_js}
                          track_mediatypes={props.track_mediatypes}
                          track_type_id={props.track_type_id}
                          source_id={props.source_id}
                          trackdetails_objectID={props.trackdetails_objectID}
                        />
                      </div>
                    </div>

                    <div className="TrackcardV3__info" key={props.key}>
                      <div
                        className="TrackcardV3__title__container"
                        data-track_media_types={props.track_mediatypes}
                        data-track_type_id={props.track_type_id}
                      >
                        <p
                          className="TrackcardV3__item__title"
                          onClick={(e) => {
                            console.log("props", props);
                            logEvent({
                              objectIdList: [props.trackdetails_objectID],
                              eventType: TRACK_TITLE_CLICK,
                              moodName: props.ampMoodTags?.[0],
                              moodValue:
                                props.amp_all_mood_tags?.tag_values?.[0] || 0,
                              genreName: props.genreTags?.[0] || "",
                              genreValue:
                                props.amp_genre_tags?.tag_values?.[0] || 0,
                              tempoName: props.tag_tempo?.[0] || "",
                              tempoValue:
                                props.tag_tempo?.[0]?.value || props.bpm || 0,
                              pageName:
                                window.location.hash.replace("#/", "") || "",
                            });
                            redirect(props.trackdetails_objectID);
                          }}
                          data-paid={props.paid || 0}
                          data-unpaid={props.unpaid || 0}
                          data-radio={props.radio || 0}
                          data-track-id={props.indexProp || 0}
                          data-flax-id={props.track_flaxid || "NA"}
                          data-cyanite-id={props.cyanite_id || "NA"}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                props._highlightResult?.track_name?.value ||
                                props.track_name,
                            }}
                          />
                        </p>

                        {props.config.modules.showFavourites && (
                          <>
                            {props.favTracksIds?.includes(
                              String(props.indexProp)
                            ) ? (
                              <>
                                <IconButtonWrapper
                                  icon="LikeOn"
                                  className="favBtn"
                                  onClick={(e) => {
                                    logEvent({
                                      objectIdList: [
                                        props.trackdetails_objectID,
                                      ],
                                      eventType: TRACK_LIKE,
                                      moodName: props.ampMoodTags?.[0],
                                      moodValue:
                                        props.amp_all_mood_tags
                                          ?.tag_values?.[0] || 0,
                                      genreName: props.genreTags?.[0] || "",
                                      genreValue:
                                        props.amp_genre_tags?.tag_values?.[0] ||
                                        0,
                                      tempoName: props.tag_tempo?.[0] || "",
                                      tempoValue:
                                        props.tag_tempo?.[0]?.value ||
                                        props.bpm ||
                                        0,
                                      pageName:
                                        window.location.hash.replace(
                                          "#/",
                                          ""
                                        ) || "",
                                    });
                                    likeUnlikeTrack(props.indexProp);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <IconButtonWrapper
                                  icon="LikeOff"
                                  className="favBtn"
                                  onClick={(e) => {
                                    logEvent({
                                      objectIdList: [
                                        props.trackdetails_objectID,
                                      ],
                                      eventType: TRACK_LIKE,
                                      moodName: props.ampMoodTags?.[0],
                                      moodValue:
                                        props.amp_all_mood_tags
                                          ?.tag_values?.[0] || 0,
                                      genreName: props.genreTags?.[0] || "",
                                      genreValue:
                                        props.amp_genre_tags?.tag_values?.[0] ||
                                        0,
                                      tempoName: props.tag_tempo?.[0] || "",
                                      tempoValue:
                                        props.tag_tempo?.[0]?.value ||
                                        props.bpm ||
                                        0,
                                      pageName:
                                        window.location.hash.replace(
                                          "#/",
                                          ""
                                        ) || "",
                                    });
                                    likeUnlikeTrack(props.indexProp);
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <div className="TrackcardV3_lower_block">
                        <div className="TrackcardV3__duration">
                          <div className="TrackcardV3__duration__icon">
                            {formatDuration(props.track_length)}
                            <IconWrapper icon="MusicIcon" /> =
                            <span>{props.bpm}</span>
                          </div>
                          <TrackCardV3AudioPlayer
                            key={`TrackCardV2AudioPlayer-${props.indexProp}`}
                            songUrl={props.preview_track_url}
                            track_length={props.track_length}
                            index={props.indexProp}
                            waveformDataProp={waveformData}
                            playFromPicture={clickedOnImage}
                            type="Tc"
                            active={
                              playingIndexFromStore !== null &&
                              playingIndexFromStore === props.indexProp
                            }
                            trackCardNameProp={props.track_name}
                            srcUrl={props.preview_image_url}
                            playingAudio={playingAudio}
                            setPlayingAudio={setPlayingAudio}
                            playPause={playPause}
                            setPlayList={setPlayList}
                            setPlayingIndex={setPlayingIndex}
                            setPlayListType={setPlayListType}
                            playListType={playListType}
                            wavefile={props.wavefile}
                            wave_form_js={props.wave_form_js}
                            strotswar_track_id={props.strotswar_track_id}
                            id={props.trackdetails_objectID}
                            source_id={props.source_id}
                          />
                        </div>
                        <TrackTypeBadge trackType={Number(props?.trackType)} />
                        <div className="TrackcardV3__tags">
                          {renderTopEmotionTags()}
                        </div>

                        <div className="TrackcardV3__actionBtns actionMenuSet">
                          <ToolTipWrapper title="Similarity Search">
                            <IconButtonWrapper
                              icon="SimilaritySearchSH2"
                              onClick={() => {
                                logEvent({
                                  objectIdList: [props.trackdetails_objectID],
                                  eventType: SIMILARITY_SEARCH,
                                  moodName: props.ampMoodTags?.[0],
                                  moodValue:
                                    props.amp_all_mood_tags?.tag_values?.[0] ||
                                    0,
                                  genreName: props.genreTags?.[0] || "",
                                  genreValue:
                                    props.amp_genre_tags?.tag_values?.[0] || 0,
                                  tempoName: props.tag_tempo?.[0] || "",
                                  tempoValue:
                                    props.tag_tempo?.[0]?.value ||
                                    props.bpm ||
                                    0,
                                  pageName:
                                    window.location.hash.replace("#/", "") ||
                                    "",
                                });
                                onSimilaritySearch({
                                  id: props.id,
                                  track_name: props.track_name,
                                  bpm: props.bpm,
                                  key: props.keyTags,
                                  voice_gender: props.instrument_vocal_data,
                                  genreTags: props.genreTags.slice(0, 5),
                                  moodTags: props.ampMoodTags.slice(0, 5),
                                  image: props.preview_image_url,
                                  strotswar_track_id: props.strotswar_track_id,
                                  track_mediatypes: props.track_mediatypes,
                                  track_type_id: props.track_type_id,
                                  cyanite_id: props.cyanite_id,
                                });
                              }}
                            />
                          </ToolTipWrapper>

                          {/* {props.duration_in_sec >= 6 &&
                          props.duration_in_sec <= 185 &&
                          ((props.track_cs_status &&
                            props.track_flaxid &&
                            isCSUser) ||
                            aimusicprovider === "stability") ? ( */}
                          {(() => {
                            const {
                              duration_in_sec,
                              track_cs_status,
                              track_flaxid,
                            } = props;
                            // const { aimusicprovider, isCSUser } =
                            //   useSelector((s) => s.userMeta) || {};
                            return (
                              isCSUser &&
                              window.globalConfig?.SHOW_TAKETOAI &&
                              duration_in_sec >= 6 &&
                              duration_in_sec <= 185 &&
                              (aimusicprovider === "stability" ||
                                (track_cs_status && track_flaxid))
                            );
                          })() && (
                            <ToolTipWrapper title="Take to AI">
                              <IconButtonWrapper
                                icon="AITrackIconSH2"
                                onClick={() => {
                                  logEvent({
                                    objectIdList: [props.trackdetails_objectID],
                                    eventType: TAKE_TO_AI,
                                    moodName: props.ampMoodTags?.[0],
                                    moodValue:
                                      props.amp_all_mood_tags
                                        ?.tag_values?.[0] || 0,
                                    genreName: props.genreTags?.[0] || "",
                                    genreValue:
                                      props.amp_genre_tags?.tag_values?.[0] ||
                                      0,
                                    tempoName: props.tag_tempo?.[0] || "",
                                    tempoValue:
                                      props.tag_tempo?.[0]?.value ||
                                      props.bpm ||
                                      0,
                                    pageName:
                                      window.location.hash.replace("#/", "") ||
                                      "",
                                  });

                                  if (aimusicprovider === "stability") {
                                    let getFilePath = getMediaBucketPath(
                                      props?.mp3_track,
                                      props?.source_id,
                                      "download"
                                    );
                                    console.log("getFilePath", getFilePath);
                                    AsyncService.postData(
                                      "downloadTrack/takeToAi",
                                      [getFilePath]
                                    )
                                      .then((response) => {
                                        console.log(
                                          "response",
                                          response?.data?.[0]
                                        );

                                        const urlToNavigate = `${
                                          process.env.NODE_ENV === "development"
                                            ? "http://localhost:3098"
                                            : CONFIG?.CS_BASE_URL
                                        }/work-space/project-settings/${encodeURIComponent(
                                          response?.data?.[0]
                                        )}?${appendCSUrlParams()}&is-stability-track=${
                                          !!aimusicprovider === "stability"
                                            ? "1"
                                            : "0"
                                        }`;
                                        try {
                                          localStorage.setItem(
                                            "CSLoggingOut",
                                            "false"
                                          );
                                          window.open(urlToNavigate, "_self");
                                        } catch (error) {}
                                      })
                                      .catch((error) => {
                                        console.log("error", error);
                                      });
                                  } else {
                                    if (
                                      CONFIG?.INPROCESS_FLAX_CUE_IDS?.includes(
                                        props.track_flaxid
                                      )
                                    ) {
                                      props.setIsOpenCommonMessageModal(true);
                                      props.setCommonMessage({
                                        title: "",
                                        body: "The AI is in process of ingesting this track, please wait for 24 hours.",
                                      });

                                      return;
                                    }
                                    const urlToNavigate = `${
                                      process.env.NODE_ENV === "development"
                                        ? "http://localhost:3098"
                                        : CONFIG?.CS_BASE_URL
                                    }/work-space/project-settings/${encodeURIComponent(
                                      props.track_flaxid
                                    )}?${appendCSUrlParams()}&is-cs-track=${
                                      !!props.csToSsStatus ? "1" : "0" // csToSsStatus = 1 => flax id is cue id
                                    }`;
                                    try {
                                      localStorage.setItem(
                                        "CSLoggingOut",
                                        "false"
                                      );
                                      window.open(urlToNavigate, "_self");
                                    } catch (error) {}
                                  }
                                }}
                              />
                            </ToolTipWrapper>
                          )}
                          {/* {alert(props?.track_mediatypes)} */}
                          {props.config.modules.showBasketDownload && (
                            <DownloadWidgetWithCookiesV2Dialog
                              className="TrackcardV3__download_menu"
                              {...props}
                              config={props.config}
                              idProp={props.indexProp}
                              track_type_id={props.trackType}
                              trackName={props.track_name}
                              preview_track_url={props.mp3_track}
                              track_url={props.wav_track}
                              edit_track_url={props.edit_track_url}
                              stems_zip_wav_url={props.stems_zip}
                              isUserInternal={props.isInternalUser}
                              cyanite_id={props.cyanite_id}
                              cyanite_status={props.cyanite_status}
                              preview_image_url={props?.preview_image_url}
                              strotswar_track_id={props?.strotswar_track_id}
                              track_mediatypes={props?.track_mediatypes}
                              trackdetails_objectID={
                                props.trackdetails_objectID
                              }
                            />
                          )}
                          <IconButtonWrapper
                            icon={
                              expanded === `panel${props.indexProp}`
                                ? "UpArrow"
                                : "DownArrow"
                            }
                            onClick={handleChange(`panel${props.indexProp}`)}
                            // onClick={() => {
                            //   console.log("this are all the props: ", props);
                            //   console.log(
                            //     "This is the asset type id: ",
                            //     props.asset_type_id
                            //   );
                            //   handleChange(`panel${props.indexProp}`);
                            // }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="TrackcardV3__item__tags__expansion__panel">
                    {props.search_result ? (
                      <span className="activeColor">{props.search_result}</span>
                    ) : null}
                    {renderTaxonomyTags()}
                    <br />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
      </FooterMusicPlayerContext.Consumer>
    </>
  );
}
