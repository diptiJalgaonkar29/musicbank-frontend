import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenuV2 from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
import "../../../_styles/TpTc.css";
import "./TrackPageTrackCardV3.css";
import DownloadWidgetWithCookiesV2 from "./DownloadWidgetWithCookiesV2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayListCoverPictue from "../../../playlist/components/MyMusicContent/PlayListCoverPicture/PlayListCoverPictue";
import DownloadWidgetWithCookiesV2Dialog from "./DownloadWidgetWithCookiesV2Dialog";
import { Link, useNavigate } from "react-router-dom";
import getConfigJson from "../../../common/utils/getConfigJson";
import getEnabledAmpMainMoodTagsByTrackId from "../../../cyanite/services/getEnabledAmpMainMoodTagsByTrackId";
import getEnabledSonicLogoMainMoodTagsByTrackId from "../../../cyanite/services/getEnabledSonicLogoMainMoodTagsByTrackId";
import { connect, useSelector } from "react-redux";
import AsyncService from "../../../networking/services/AsyncService";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";
import SimilaritySearchMenu from "../../../playlist/components/SimilaritySearchMenu/SimilaritySearchMenu";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import TrackPageHeader from "../TrackPageHeader/TrackPageHeader";
import TakeToAIMenu from "../../../playlist/components/TakeToAIMenu/TakeToAIMenu";
import TrackUsageAccordion from "../TrackUsageAccordion/TrackUsageAccordion";
import TrackInfoAccordion from "../TrackInfoAccordion/TrackInfoAccordion";
import TrackLyricsAccordion from "../TrackLyricsAccordion/TrackLyricsAccordion";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import { withStyles } from "@mui/styles";
import TrackStyleAccordion from "../TrackStyleAccordion/TrackStyleAccordion";
import MasterEditsAccordion from "../MasterEditsAccordion/MasterEditsAccordion";
import SonicLogoAssetAnalysisAccordion from "../SonicLogoAssetAnalysisAccordion/SonicLogoAssetAnalysisAccordion";
import SonicLogoVariationAccordion from "../SonicLogoVariationAccordion/SonicLogoVariationAccordion";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
const classNamesWeb = {
  wrapper: "TpTc__wrapper",
  container: "TpTc__container",
  img: "TpTc__img",
  title: "TpTc__title",
  titleButton: "TpTc__title--btn",
  tags: "TpTc__tags",
  description: "TpTc__description",
  player: "TpTc__player",
  downloads: "TpTc__downloads",
};

const classNamesMobile = {
  wrapper: "TpTc__Mobile__wrapper",
  container: "TpTc__Mobile__container",
  img: "TpTc__Mobile__img",
  title: "TpTc__Mobile__title",
  titleButton: "TpTc__Mobile__title--btn",
  tags: "TpTc__Mobile__tags",
  description: "TpTc__Mobile__description",
  player: "TpTc__Mobile__player",
  downloads: "TpTc__Mobile__downloads",
};

const styles = {
  paper: {
    background: "transparent",
    color: "var(--color-white)",
    boxShadow: "none",
  },
  root: {
    fontSize: "1.6rem",
    color: "var(--color-white)",
  },
  icon: {
    fontSize: "large",
    color: "var(--color-white)",
  },
};

function TrackPageTrackCardV3(props) {
  console.log("TrackPageTrackCardV3--props", props);
  const {
    classes,
    trackName,
    queryID,
    track_lengthProp,
    descriptionTag,
    descriptionTag2,
    isMobileProp,
    playingIndex,
    track_lyrics,
    track_cs_status,
    track_flaxid,
    csToSsStatus,

    // data props
    imgSrc,
    loading: imgLoading,
    preview_track_url,
    track_url,
    edit_track_url,
    stems_zip_wav_url,
    isInternalUser,
    cyanite_id,
    cyanite_status,
    track_type_id,
    track_mediatypes,
    indexProp,
    keyTags,
    genreTags,
    topTags,
    feelingsTags,
    movementTags,
    impactTags,
    motionTags,
    instrumentTags,
    tempo,
    hasEdits,
    hasMaster,
    editResults,
    masterResults,
    isSonicLogo,
    registrationTitle,
    artist_name,
    publisherGEMANumber,
    trackGEMANumber,
    preview_track_image_url,

    // redux & user
    userMeta,
    album_Name,
    catlog_name,
    label,
    publisher,
    writer,
    sonichub_track_id,
    wav_track,
    mp3_track,
    stems_zip,
    wavefile,
    strotswar_track_id,
    trackId,
    waveform_js,
    publisherData,
    writerData,
    source_id,
    instrument_vocal_data,
    trackdetails_objectID,
  } = props;

  //console.log("TrackPageTrackCardV3 props:::", wavefile, source_id);
  // const { onSimilaritySearch = () => {} } = props;
  const { config, jsonConfig } = useContext(BrandingContext);
  const footerCtx = useContext(FooterMusicPlayerContext);
  const {
    playingAudio,
    setPlayingAudio,
    playPause,
    setPlayList,
    setPlayingIndex,
    setPlayListType,
  } = footerCtx || {};

  // local state
  const [loading, setLoading] = useState(true);
  const [waveformData, setWaveformData] = useState(null);
  const [propsLoaded, setPropsLoaded] = useState(false);
  const [usedInVideoData, setUsedInVideoData] = useState(null);
  const [trackTags, setTrackTags] = useState([]);
  const isCsTrackForStability = window.globalConfig?.SHOW_TAKETOAI;
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const navigate = useNavigate();

  const onSimilaritySearch = (trackData) => {
    navigate("/AISearchScreen", {
      state: { type: "similarity", trackData: trackData },
    });
  };
  const takeToAI = () => {
    if (isCsTrackForStability) {
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
            !!isCsTrackForStability ? "1" : "0"
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
  // ===== view =====
  const content = (
    <>
      <TrackPageHeader
        imgSrc={props.imgSrc}
        isImgLoading={imgLoading}
        trackName={trackName}
        songUrl={preview_track_url}
        trackType={track_type_id}
        track_mediatypes={track_mediatypes}
        track_length={track_lengthProp}
        index={1}
        waveformDataProp={waveformData}
        playFromPicture={false}
        key={queryID}
        type={isMobileProp ? "Tc" : "TpTc"}
        active={playingIndex !== null && playingIndex === indexProp}
        isCyaniteActive={false}
        trackCardNameProp={trackName}
        srcUrl={preview_track_image_url}
        playingAudio={playingAudio}
        setPlayingAudio={setPlayingAudio}
        playPause={playPause}
        setPlayList={setPlayList}
        setPlayingIndex={setPlayingIndex}
        setPlayListType={setPlayListType}
        isSonicLogo={isSonicLogo}
        keyTag={keyTags?.[0]}
        wavefile={wavefile}
        tempo={tempo}
        strotswar_track_id={strotswar_track_id}
        trackId={trackId}
        source_id={source_id}
        waveformJSData={props.waveformJSData}
        sonichub_track_id={props.sonichub_track_id}
        trackdetails_objectID={trackdetails_objectID}
      >
        {/* {track_cs_status && userMeta?.isCSUser && ( */}
        {/* <TakeToAIMenu
          urlToNavigate={`${
            process.env.NODE_ENV === "development"
              ? "http://localhost:3098"
              : jsonConfig?.CS_BASE_URL
          }/work-space/project-settings/${encodeURIComponent(
            track_flaxid
          )}?${appendCSUrlParams()}&is-cs-track=${csToSsStatus ? "1" : "0"}`}
          flaxId={track_flaxid}
          buttonText="Take to AI"
        /> */}
        {/* )} */}
        {/* {(props.track_cs_status &&
          props.track_flaxid &&
          props?.userMeta?.isCSUser) ||
        isCsTrackForStability ? ( */}
        {(() => {
          const { track_lengthProp, track_cs_status, track_flaxid } = props;
          const { aimusicprovider, isCSUser } =
            useSelector((s) => s.userMeta) || {};
          return (
            isCSUser &&
            window.globalConfig?.SHOW_TAKETOAI &&
            track_lengthProp >= 6 &&
            track_lengthProp <= 185 &&
            (aimusicprovider === "stability" ||
              (track_cs_status && track_flaxid))
          );
        })() && (
          <div
            className="SimilaritySearchMenu_buttonText_container boldFamily"
            onClick={takeToAI}
          >
            <p className="SimilaritySearchMenu_buttonText">Take to AI</p>
            <IconButtonWrapper
              icon="AITrackIconSH2"
              //className={`${className}`}
              onClick={takeToAI}
            />
          </div>
          // ) : null}
        )}
        <div
          className="SimilaritySearchMenu_buttonText_container boldFamily"
          onClick={() =>
            onSimilaritySearch({
              id: sonichub_track_id,
              track_name: trackName,
              bpm: tempo,
              key: keyTags,
              voice_gender: instrument_vocal_data,
              genreTags: genreTags?.slice(0, 5),
              moodTags: topTags?.slice(0, 5),
              image: imgSrc,
              strotswar_track_id: strotswar_track_id,
              track_mediatypes: track_mediatypes,
              track_type_id: track_type_id,
              cyanite_id: cyanite_id,
            })
          }
        >
          <p className="SimilaritySearchMenu_buttonText">Search Similar</p>
          <IconButtonWrapper
            icon="SimilaritySearchSH2"
            //className={`${className}`}
            onClick={() =>
              navigate("/AISearchScreen", { state: { type: "similarity" } })
            }
          />
        </div>
        {/* <SimilaritySearchMenu
          cyaniteId={cyanite_id}
          trackId={queryID}
          buttonText="Search Similar"
        /> */}
        <AddItemToPlaylistMenuV2
          trackCardNameProp={trackName}
          trackCardIdProp={sonichub_track_id}
          trackdetails_objectID={trackdetails_objectID}
          buttonText="Add to Playlist"
        />
        {config.modules.showBasketDownload ? (
          <DownloadWidgetWithCookiesV2Dialog
            config={config}
            idProp={sonichub_track_id}
            trackName={trackName}
            preview_track_url={wav_track}
            track_url={mp3_track}
            edit_track_url={edit_track_url}
            track_type_id={track_type_id}
            track_mediatypes={track_mediatypes}
            stems_zip_wav_url={stems_zip}
            isUserInternal={isInternalUser}
            cyanite_id={cyanite_id}
            cyanite_status={cyanite_status}
            buttonText="Download"
            preview_image_url={imgSrc}
            strotswar_track_id={strotswar_track_id}
            trackdetails_objectID={trackdetails_objectID}
          />
        ) : (
          <DownloadWidgetWithCookiesV2
            config={config}
            idProp={queryID}
            preview_track_url={preview_track_url}
            track_url={track_url}
            edit_track_url={edit_track_url}
            stems_zip_wav_url={stems_zip_wav_url}
            isUserInternal={isInternalUser}
            cyanite_id={cyanite_id}
            cyanite_status={cyanite_status}
            trackName={trackName}
            strotswar_track_id={strotswar_track_id}
          />
        )}
      </TrackPageHeader>

      <div className="trackDetails_V3">
        {!isSonicLogo ? (
          <>
            <TrackStyleAccordion
              genreTags={genreTags}
              emotionTags={topTags}
              topEventTags={feelingsTags}
              topMovementTags={movementTags}
              instrumentTags={instrumentTags}
              bpm={tempo}
              keyTag={keyTags}
            />

            {source_id == 1 && (
              <TrackInfoAccordion
                registrationTitle={registrationTitle}
                artist_name={artist_name}
                publisherGEMANumber={publisherGEMANumber}
                trackGEMANumber={trackGEMANumber}
                trackId={trackId}
                album_Name={album_Name}
                catlog_name={catlog_name}
                label={label}
                writer={writer}
                publisher={publisher}
                publisherData={publisherData}
                writerData={writerData}
              />
            )}

            {/* <TrackInfoAccordion
              registrationTitle={registrationTitle}
              artist_name={artist_name}
              publisherGEMANumber={publisherGEMANumber}
              trackGEMANumber={trackGEMANumber}
              trackId={trackId}
              album_Name={album_Name}
              catlog_name={catlog_name}
              label={label}
              writer={writer}
              publisher={publisher}
              publisherData={publisherData}
              writerData={writerData}
            /> */}
            <MasterEditsAccordion
              hasEdits={hasEdits}
              hasMaster={hasMaster}
              editResults={editResults}
              masterResults={masterResults}
            />

            <TrackUsageAccordion
              showUsedInVideos={config.modules.showUsedInVideos}
              usedInVideoData={usedInVideoData}
            />

            {/* {config.modules.CyaniteProfile && ( */}
            <div className="CyaniteProfileSection">
              {props.renderCyaniteProfileSection?.(
                topTags,
                isSonicLogo,
                topTags
              )}
            </div>
            {/* )} */}

            <TrackLyricsAccordion
              showTrackLyrics={config.modules.showTrackLyrics}
              trackLyrics={track_lyrics}
              HTMLDescription2={config.modules.HTMLDescription2}
            />
          </>
        ) : (
          <>
            <TrackInfoAccordion
              registrationTitle={registrationTitle}
              artist_name={artist_name}
              publisherGEMANumber={publisherGEMANumber}
              trackGEMANumber={trackGEMANumber}
              trackId={trackId}
              album_Name={album_Name}
              catlog_name={catlog_name}
              label={label}
              writer={writer}
              publisher={publisher}
              publisherData={publisherData}
              writerData={writerData}
            />
            {/* <TrackInfoAccordion
              registrationTitle={registrationTitle}
              artist_name={artist_name}
              publisherGEMANumber={publisherGEMANumber}
              trackGEMANumber={trackGEMANumber}
            /> */}
            <SonicLogoVariationAccordion
              variations={[
                {
                  cyanite_id: 16616029,
                  cyanite_status: "synced",
                  track_name: "Masollan_Balmorhea-012",
                  duration_in_sec: 313,
                  preview_image_url:
                    "Mastercard_Media_Preview_evNFXs_2024-01-12T0951.png",
                  preview_track_url:
                    "Mastercard_Media_Br9pYq_2024-01-12T095315.mp3",
                  tag_all: [""],
                  master_id: 37,
                  trackStatus: true,
                  trackActive: true,
                  objectID: "39",
                },
              ]}
            />
            <SonicLogoAssetAnalysisAccordion
              registrationTitle={registrationTitle}
              artist_name={artist_name}
              publisherGEMANumber={publisherGEMANumber}
              trackGEMANumber={trackGEMANumber}
              wavefile={wavefile}
            />
          </>
        )}
      </div>
    </>
  );

  return (
    <div
      className={`${
        isMobileProp ? classNamesMobile.wrapper : classNamesWeb.wrapper
      } TrackPageTrackCardV3`}
    >
      {content}
    </div>
  );
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  downloadBasket: state.downloadBasket,
  userMeta: state.userMeta,
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(TrackPageTrackCardV3));
