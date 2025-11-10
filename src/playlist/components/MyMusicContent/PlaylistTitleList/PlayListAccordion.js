import React, { Fragment, useContext, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { FooterMusicPlayerContext } from "../../../../hooks/FooterMusicPlayerContext";
import Picture from "../../../../search1/components/AnimatedPicture/AnimatedPicture";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import DownloadWidgetWithCookiesV2Dialog from "../../../../track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV2Dialog";
import SimilaritySearchMenu from "../../SimilaritySearchMenu/SimilaritySearchMenu";
import TrackTypeBadge from "../../../../search1/components/TrackTypeBadge/TrackTypeBadge";
import AudioPlayerSH2 from "../../../../common/components/Audiplayer/AudioPlayerSH2";
import { setTrackData } from "../../../../redux/actions/trackActions/trackActions";
import { useNavigate } from "react-router-dom";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import appendCSUrlParams from "../../../../common/utils/appendCSUrlParams";
import {
  removeFavTrackId,
  setFavTrackId,
} from "../../../../redux/actions/searchActions";
import AsyncService from "../../../../networking/services/AsyncService";
import IconWrapper from "../../../../branding/componentWrapper/IconWrapper";
import TrackCardV3AudioPlayer from "../../../../common/components/Audiplayer/TrackCardV3AudioPlayer/TrackCardV3AudioPlayer";
import { useDispatch, useSelector } from "react-redux";
import getSortedLabelledTagsArray from "../../../../common/utils/getSortedLabelledTagsArray";
import ChipWrapper from "../../../../branding/componentWrapper/ChipWrapper";
import "./PlayListAccordion.css";
import getMediaBucketPath from "../../../../common/utils/getMediaBucketPath";
import { formatDuration } from "../../../../common/utils/formatDuration";
import DeleteTrackFromPlaylistMenu from "../../DeleteTrackFromPlaylistMenu/DeleteTrackFromPlaylistMenu";
import ToolTipWrapper from "../../../../branding/componentWrapper/ToolTipWrapper";
import getSuperBrandName from "../../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../../common/utils/brandConstants";
import getSuperBrandId from "../../../../common/utils/getSuperBrandId";

export default function PlayListAccordion(props) {
  // console.log("PlayListAccordion props", props);
  const [expanded, setExpanded] = useState(null);
  const [clickedOnImage, setClickedOnImage] = useState(false);
  const [waveformData, setWaveformData] = useState(null);
  const [loading, setLoading] = useState(false);
  const playingIndexFromStore = props.playingIndex;
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const favTracksIds = useSelector((state) => state.favTracksIds);
  const { onRefine = () => {} } = props;
  //const isCsTrackForStability = window.globalConfig?.SHOW_TAKETOAI;
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const handleChange = (panel) => () => {
    setExpanded((prev) => (prev === panel ? false : panel));
  };

  const { aimusicprovider, isCSUser } = useSelector((s) => s.userMeta) || {};

  const takeToAI = () => {
    if (aimusicprovider === "stability") {
      let getFilePath = getMediaBucketPath(
        props?.mp3_track,
        props?.source_id,
        "download"
      );
      console.log("getFilePath", getFilePath);
      AsyncService.postData("downloadTrack/takeToAi", [getFilePath])
        .then((response) => {
          console.log("response", response?.data?.[0]);

          const urlToNavigate = `${
            process.env.NODE_ENV === "development"
              ? "http://localhost:3098"
              : CONFIG?.CS_BASE_URL
          }/work-space/project-settings/${encodeURIComponent(
            response?.data?.[0]
          )}?${appendCSUrlParams()}&is-stability-track=${
            !!aimusicprovider === "stability" ? "1" : "0"
          }`;
          try {
            localStorage.setItem("CSLoggingOut", "false");
            window.open(urlToNavigate, "_self");
          } catch (error) {}
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      if (CONFIG?.INPROCESS_FLAX_CUE_IDS?.includes(props.track_flaxid)) {
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
        localStorage.setItem("CSLoggingOut", "false");
        window.open(urlToNavigate, "_self");
      } catch (error) {}
    }
  };
  const renderTopEmotionTags = (ids) => {
    const emotionTags =
      getSortedLabelledTagsArray(ids?.tag_names, "AMP_MOOD_TAGS") || [];

    const topThree = emotionTags.slice(0, 3);

    return (
      <div className="PlayListAccordion__item__tags_container">
        {topThree.map((tag, index) => (
          <ChipWrapper
            key={index}
            label={tag?.toString()}
            className="tag_amp_allmood_ids"
            // style={{
            //     backgroundColor: "#444444",
            // }}
          />
        ))}
      </div>
    );
  };

  const renderTaxonomyTags = (type) => {
    //console.log("renderTaxonomyTags", props);

    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );

    const top5Genres =
      props.amp_genre_tags?.tag_names && props.amp_genre_tags?.tag_values
        ? props.amp_genre_tags.tag_names
            .map((name, index) => ({
              name,
              value: props.amp_genre_tags.tag_values[index],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((tag) => tag.name)
            .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
        : (props.genreTags || [])
            .slice(0, 5)
            .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()));

    let emotionsgreaterthandot5 = [];
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
        .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()));
    }

    if (emotionsgreaterthandot5.length === 0) {
      emotionsgreaterthandot5 = (props.amp_all_mood_tags?.tag_names || [])
        .slice(0, 5)
        .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()));
    }

    const domains = [
      {
        label: "Genres",
        items: top5Genres || [],
        className: "amp_genre_tags.tag_names",
        refine: (val) => onRefine("tag_genre", val),
      },
      {
        label: "Emotions",
        items: emotionsgreaterthandot5 || [],
        className: "amp_all_mood_tags.tag_names",
        refine: (val) => onRefine("tag_amp_allmood_ids", val),
      },
      {
        label: "Instruments",
        items: props.amp_instrument_tags.tag_names || [],
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
        items: props.tag_key || [],
        className: "tag_key",
        refine: (val) => onRefine("tag_key", val),
      },
      {
        label: "Instrumental/Vocal",
        items: props.instrument_vocal_data,
        className: "instrument_vocal",
        refine: (val) => onRefine("instrument_vocal", val),
      },
      {
        label: "Stems",
        items: props.stems_zip != "" ? "Yes" : "No",
        className: "stems_zip",
        refine: (val) => onRefine("stems_zip", val),
      },
    ];

    const content = (
      <div className="PlayListAccordion__item__tags">
        <div className="PlayListAccordion__item__tags_container">
          {domains.map((domain, index, arr) => (
            <Fragment key={domain.label}>
              <span className="trackFilterLabel">{domain.label}</span>
              {Array.isArray(domain.items) && domain.items.length > 0 ? (
                domain.items.slice(0, 10).map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="trackFilterOption"
                    style={{
                      backgroundColor: props.isTagRefined?.(
                        domain.className,
                        item
                      )
                        ? "#444444"
                        : "transparent",
                    }}
                    onClick={
                      domain.refine ? () => domain.refine(item) : undefined
                    }
                  >
                    {item?.toString()}
                  </span>
                ))
              ) : (
                <span
                  className="trackFilterOption"
                  style={{
                    backgroundColor: props.isTagRefined?.(
                      domain.className,
                      domain.items
                    )
                      ? "#444444"
                      : "transparent",
                  }}
                  onClick={
                    domain.refine
                      ? () => domain.refine(domain.items)
                      : undefined
                  }
                >
                  {domain.items?.toString()}
                </span>
              )}
              {index !== domains.length - 1 && (
                <span className="verticalDevider"></span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );

    return content;
  };

  const onSimilaritySearch = (trackData) => {
    navigate("/AISearchScreen", {
      state: { type: "similarity", trackData: trackData },
    });
  };
  const redirect = (id) => {
    if (props.mCode) return;
    console.log("Redirecting to track page for ID:", props);
    const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
      t.toLowerCase()
    );
    const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map(
      (t) => t.toLowerCase()
    );

    // Slice the genreTags to get only the first 10 visible tags
    const topGenreTags = (props?.amp_genre_tags?.tag_names || [])
      .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
      .slice(0, 10);

    // Slice the ampMoodTags to get only the first 10 visible tags
    const topEmotionTags = (props?.amp_all_mood_tags?.tag_names || [])
      .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()))
      .slice(0, 10);

    const topEventTags = (props?.event_tags?.tag_names || []).slice(0, 3);
    const movementTags = (props?.moment_tags?.tag_names || []).slice(0, 3);

    // Combine event & movement tags and take 3 random ones

    const topInstrumentsTags = (
      props?.amp_instrument_tags?.tag_names || []
    ).slice(0, 10);

    // Dispatch the action
    dispatch(
      setTrackData({
        trackdetails_objectID: props.objectID,
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
        sonichub_track_id:
          serverName === "sh2Dev" || serverName === "sh2Wpp"
            ? Array.isArray(props?.facet_sonic_track_id)
              ? Number(
                  props.facet_sonic_track_id
                    .find((id) => id.startsWith(`${serverName}:`))
                    ?.split(":")[1]
                ) || null
              : null
            : Number(props?.sonichub_track_id) || null,
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
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }
  return (
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
          <div className="PlayListAccordion" key={props.indexProp}>
            <Accordion
              key={props.indexProp}
              expanded={expanded === `panel${props.indexProp}`}
            >
              <AccordionSummary>
                <div className="PlayListAccordion__main">
                  <div className={`PlayListAccordion__Left`}>
                    <div className="PlayListAccordion__cover">
                      <Picture
                        key={props.indexProp}
                        srcUrl={getMediaBucketPath(
                          props?.preview_image,
                          props?.source_id,
                          "image"
                        )}
                        loading={loading}
                        index={props.indexProp}
                      />
                      <AudioPlayerSH2
                        imgSrc={getMediaBucketPath(
                          props?.preview_image,
                          props?.source_id,
                          "image"
                        )}
                        isImgLoading={props.loading}
                        trackName={props.track_name}
                        songUrl={props.preview_track_url}
                        trackType={props.track_type_id}
                        track_length={props.duration_in_sec}
                        //index={props.sonichub_track_id}
                        index={
                          (serverName === "sh2Dev" ||
                            serverName === "sh2Wpp") &&
                          Array.isArray(props?.facet_sonic_track_id)
                            ? Number(
                                props.facet_sonic_track_id
                                  .find((id) => id.startsWith(`${serverName}:`))
                                  ?.split(":")[1]
                              ) || null
                            : Number(props?.sonichub_track_id) || null
                        }
                        waveformDataProp={props.waveformData}
                        playFromPicture={false}
                        key={props.queryID}
                        type={"TpTc"}
                        active={true}
                        isCyaniteActive={false}
                        trackCardNameProp={props.track_name}
                        srcUrl={getMediaBucketPath(
                          props?.preview_image,
                          props?.source_id,
                          "image"
                        )}
                        playingAudio={playingAudio}
                        setPlayingAudio={setPlayingAudio}
                        playPause={playPause}
                        setPlayList={setPlayList}
                        setPlayingIndex={setPlayingIndex}
                        setPlayListType={setPlayListType}
                        isSonicLogo={props.isSonicLogo}
                        keyTag={props.keyTags?.[0]}
                        strotswar_track_id={props.strotswar_track_id}
                        wavefile={props.wave_form_js}
                        wave_form_js={props.wave_form_js}
                        track_mediatypes={props.track_mediatypes}
                        track_type_id={props.track_type_id}
                        isUnRegistered={props.isUnRegistered}
                        trackdetails_objectID={props.objectID}
                        source_id={props?.source_id}
                      />
                    </div>
                  </div>

                  <div className="PlayListAccordion__info" key={props.key}>
                    <div
                      className="PlayListAccordion__title__container"
                      data-track_media_types={props.track_mediatypes}
                      data-track_type_id={props.track_type_id}
                    >
                      <p
                        className="PlayListAccordion__item__title"
                        onClick={() => redirect(props.objectID)}
                        data-paid={props.paid || 0}
                        data-unpaid={props.unpaid || 0}
                        data-radio={props.radio || 0}
                        data-track-id={props.indexProp || 0}
                        data-flax-id={props.track_flaxid || "NA"}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              props._highlightResult?.track_name?.value ||
                              props.track_name,
                          }}
                        />
                      </p>
                      {!props.mCode ? (
                        <>
                          {props.track_cs_status &&
                          props.track_flaxid &&
                          props?.userMeta?.isCSUser ? (
                            <ButtonWrapper
                              variant="filledSecondary"
                              size="s"
                              data-flaxid={props.track_flaxid}
                              onClick={() => {
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
                                  localStorage.setItem("CSLoggingOut", "false");
                                  window.open(urlToNavigate, "_self");
                                } catch (error) {}
                              }}
                            >
                              Take to AI
                            </ButtonWrapper>
                          ) : null}
                          {props?.config?.modules.showFavourites && (
                            <>
                              {favTracksIds?.includes(
                                String(props.sonichub_track_id)
                              ) ? (
                                <>
                                  <IconButtonWrapper
                                    icon="LikeOn"
                                    className="favBtn"
                                    onClick={() => {
                                      likeUnlikeTrack(props.sonichub_track_id);
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <IconButtonWrapper
                                    icon="LikeOff"
                                    className="favBtn"
                                    onClick={() => {
                                      likeUnlikeTrack(props.sonichub_track_id);
                                    }}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : null}
                    </div>
                    <div className="PlayListAccordion_lower_block">
                      <div className="PlayListAccordion__duration">
                        <div className="PlayListAccordion__duration__icon">
                          {formatDuration(props.duration_in_sec)}
                          <IconWrapper icon="MusicIcon" /> =
                          <span>{props.bpm}</span>
                        </div>
                        <TrackCardV3AudioPlayer
                          key={`TrackCardV2AudioPlayer-${props.indexProp}`}
                          songUrl={props.mp3_track}
                          track_length={props.duration_in_sec}
                          index={props.indexProp}
                          waveformDataProp={waveformData}
                          playFromPicture={clickedOnImage}
                          type="Tc"
                          active={
                            playingIndexFromStore !== null &&
                            playingIndexFromStore === props.indexProp
                          }
                          trackCardNameProp={props.track_name}
                          srcUrl={getMediaBucketPath(
                            props?.preview_image,
                            props?.source_id,
                            "image"
                          )}
                          playingAudio={playingAudio}
                          setPlayingAudio={setPlayingAudio}
                          playPause={playPause}
                          setPlayList={setPlayList}
                          setPlayingIndex={setPlayingIndex}
                          setPlayListType={setPlayListType}
                          playListType={playListType}
                          wavefile={props.wave_form_js}
                          wave_form_js={props.wave_form_js}
                          strotswar_track_id={props.strotswar_track_id}
                          id={props.objectID}
                          source_id={props.source_id}
                        />
                      </div>
                      {/* <TrackTypeBadge trackType={Number(props?.track_type_id)} /> */}
                      <div className="PlayListAccordion__tags">
                        {renderTopEmotionTags(props?.amp_all_mood_tags)}
                      </div>
                      {!props.mCode ? (
                        <div className="PlayListAccordion__actionBtns actionMenuSet">
                          {/* <SimilaritySearchMenu
                            className="PlayListAccordion__SS_menu"
                            cyaniteId={props.cyanite_id}
                            trackId={props.indexProp}
                          /> */}
                          <ToolTipWrapper title="Similarity Search">
                            <IconButtonWrapper
                              icon="SimilaritySearchSH2"
                              onClick={() =>
                                onSimilaritySearch({
                                  id: props.sonichub_track_id,
                                  track_name: props.track_name,
                                  bpm: props.bpm,
                                  key: props.tag_key,
                                  voice_gender: props.instrument_vocal_data,
                                  genreTags:
                                    props?.amp_genre_tags?.tag_names?.slice(
                                      0,
                                      5
                                    ),
                                  moodTags:
                                    props?.amp_all_mood_tags?.tag_names?.slice(
                                      0,
                                      5
                                    ),
                                  image: getMediaBucketPath(
                                    props?.preview_image,
                                    props?.source_id,
                                    "image"
                                  ),
                                  strotswar_track_id: props.strotswar_track_id,
                                  track_mediatypes: props.track_mediatypes,
                                  track_type_id: props.track_type_id,
                                  cyanite_id: props.cyanite_id,
                                })
                              }
                            />
                          </ToolTipWrapper>
                          {/* {(props.track_cs_status &&
                            props.track_flaxid &&
                            props?.userMeta?.isCSUser &&  */}
                          {/* {props.duration_in_sec >= 6 &&
                          props.duration_in_sec <= 185 &&
                          ((props.track_cs_status &&
                            props.track_flaxid &&
                            props?.userMeta?.isCSUser) ||
                            isCsTrackForStability) ? ( */}
                          {(() => {
                            const superBrandId = getSuperBrandId();
                            const brandId =
                              BrandingContext._currentValue?.config?.brandId ||
                              localStorage.getItem("brandId");
                            const {
                              duration_in_sec,
                              facet_cs_flex_id,
                              facet_enableTrackForCS,
                            } = props;
                            const track_cs_status =
                              facet_enableTrackForCS
                                ?.find(
                                  (id) =>
                                    typeof id === "string" &&
                                    id.startsWith(serverName + ":")
                                )
                                ?.split(":")[1] || null;
                            const track_flaxid =
                              facet_cs_flex_id
                                ?.find(
                                  (id) =>
                                    typeof id === "string" &&
                                    id.startsWith(
                                      serverName +
                                        "-" +
                                        superBrandId +
                                        "_" +
                                        brandId +
                                        ":"
                                    )
                                )
                                ?.split(":")[1] || null;

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
                                //className={`${className}`}
                                onClick={takeToAI}
                              />
                            </ToolTipWrapper>
                          )}
                          {/* ) : null} */}
                          {props?.config?.modules.showBasketDownload && (
                            <DownloadWidgetWithCookiesV2Dialog
                              className="PlayListAccordion__download_menu"
                              config={props.config}
                              idProp={props.sonichub_track_id}
                              track_type_id={props.track_type_id}
                              trackName={props.track_name}
                              preview_track_url={props.mp3_track}
                              track_url={props.wav_track}
                              edit_track_url={props.edit_track_url}
                              stems_zip_wav_url={props.stems_zip}
                              isUserInternal={props.isInternalUser}
                              cyanite_id={props.cyanite_id}
                              cyanite_status={props.cyanite_status}
                              preview_image_url={getMediaBucketPath(
                                props?.preview_image,
                                props?.source_id,
                                "image"
                              )}
                            />
                          )}
                          <DeleteTrackFromPlaylistMenu
                            deleteTrackHandlerProp={() =>
                              props.deleteTrackFromPlaylistHandler(
                                props.sonichub_track_id,
                                props.objectID
                              )
                            }
                          />
                          <IconButtonWrapper
                            icon={
                              expanded === `panel${props.indexProp}`
                                ? "UpArrow"
                                : "DownArrow"
                            }
                            onClick={handleChange(`panel${props.indexProp}`)}
                          />
                        </div>
                      ) : (
                        <div className="PlayListAccordion__actionBtns actionMenuSet"></div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="PlayListAccordion__item__tags__expansion__panel">
                  {props.search_result ? (
                    <span className="activeColor">{props.search_result}</span>
                  ) : null}
                  {/* {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER */}
                  {renderTaxonomyTags("web")}
                  {/* : renderTags("web")} */}
                  <br />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </>
      )}
    </FooterMusicPlayerContext.Consumer>
  );
}
