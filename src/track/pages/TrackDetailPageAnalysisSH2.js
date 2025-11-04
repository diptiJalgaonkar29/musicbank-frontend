import React, { Component } from "react";
import { connect, useSelector } from "react-redux";

import MediaService from "../../common/services/MediaService";
import AlgoliaService from "../../networking/services/AlgoliaService";
import CreatePlaylistModal from "../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import VideoSlider from "../components/VideoSlider/index";
import TrackPageHoc from "../layout/TrackPageHoc";
import EditSection from "./EditSection";
import MoodChart from "../../cyanite/MoodChart";
import MoodChartTaxonomy from "../../cyanite/MoodChartTaxonomy";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import AsyncService from "../../networking/services/AsyncService";
import TrackPageTrackCardV3 from "../components/TrackPageTrackCard/TrackPageTrackCardV3";
import MoodChartTaxonomyV2 from "../../cyanite/MoodChartTaxonomyV2";
import { withRouterCompat } from "../../common/utils/withRouterCompat";
import algoliasearch from "algoliasearch";
import getMediaBucketPath from "../../common/utils/getMediaBucketPath";

const InitState = {
  queryID: "",
  image_path: "",
  track_name: "",
  track_tags: [],
  type: null,
  track_length: 0,
  preview_track_data: null,
  track_url: null,
  preview_track_url: null,
  loadingPicture: true,
  hasEdits: false,
  highlight: false,
  editResults: null,
  masterResults: null,
  descriptionTag: null,
  descriptionTag2: null,
  stems_zip_wav_url: null,
  videos: null,
  instrumentTags: null,
  tagUsedIn: null,
  isInternalUser: null,
  cyanite_id: null,
  cyanite_status: null,
  trackStatus: "",
  csToSsStatus: "",
  track_lyrics: null,
  feelingsTags: null,
  impactTags: null,
  motionTags: null,
  tonalityTags: null,
  keyTags: null,
  tempoTags: null,
  trackId: "",
  //genreTags: null,
  isSonicLogo: null,
  topTags: [],
  waveform_js: null,
  detail_image: null,
  waveformJSData: null,
  genreTags: null,
  instruments: null,
  eventTags: null,
  movementTags: null,
  emotionTags: null,
  keyTag: "",
  bpm: null,
  imgSrc: null,
  wavefile: null,
  strotswar_track_id: null,
  sonichub_track_id: null,
  instrument_vocal_data: null,
  wav_track: null,
  mp3_track: null,
  stems_zip: null,
  track_mediatypes: null,
  trackdetails_objectID: null,
};

const settingsToReceive = [
  "track_name",
  "tag_all",
  "preview_image_url",
  "preview_track_url",
  "duration_in_sec",
  "objectID",
  "master_id",
  "videos",
  "cyanite_id",
  "cyanite_status",
  "trackStatus",
  "trackActive",
];

const returnModifiedDataFromMount = (data, styleData) => {
  console.log("returnModifiedDataFromMount", data);

  // console.log("data****", data);
  // let tagGenre = data?.tag_genre || [];
  let tagUsedIn = data?.tag_used_in || [];
  //  const instrumentTags = data?.instrument_ids || [];
  const descriptionTag = data?.description || "";
  const descriptionTag2 = data?.description2 || "";
  // Get hidden tags in lowercase
  const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
    t.toLowerCase()
  );
  const hideGenreTags = (window.globalConfig?.HIDE_GENRE_TAGS || []).map((t) =>
    t.toLowerCase()
  );

  // Slice the genreTags to get only the first 10 visible tags
  const topGenreTags = (styleData.amp_genre_tags.tag_names || [])
    .filter((tag) => !hideGenreTags.includes(tag.toLowerCase()))
    .slice(0, 10);

  // Slice the ampMoodTags to get only the first 10 visible tags
  const topEmotionTags = (styleData.amp_all_mood_tags.tag_names || [])
    .filter((tag) => !hideMoodTags.includes(tag.toLowerCase()))
    .slice(0, 10);

  const topEventTags = (styleData.event_tags.tag_names || []).slice(0, 3);
  const topMovementTags = (styleData.moment_tags.tag_names || []).slice(0, 3);

  // Combine event & movement tags and take 3 random ones

  const topInstrumentsTags = (
    styleData.amp_instrument_tags.tag_names || []
  ).slice(0, 10);
  console.log("returnModifiedDataFromMount--image_path", data);

  let updatedData = {
    descriptionTag,
    descriptionTag2,
    image_path: getMediaBucketPath(
      data?.detail_image,
      data?.source_id,
      "image"
    ),
    wavefile: getMediaBucketPath(
      data?.wave_form_js,
      data?.source_id,
      "waveform"
    ),
    waveformJSData: getMediaBucketPath(
      data?.wave_form_js,
      data?.source_id,
      "waveformjsdata"
    ),
    track_length: data?.duration_in_sec,
    track_name: data?.track_name,
    registrationTitle: data?.registrationTitle || data?.track_name,
    artist_name: data?.artist?.name || "",
    publisherGEMANumber: data?.publisherGEMANumber || "",
    trackGEMANumber: data?.trackGEMANumber || "",
    tempo: data?.tempo || "",
    track_tags: [...(data?.tag_all || [])],
    type: data?.type || "",
    track_url: data?.track_url || "",
    preview_track_url: data?.preview_track_url || "",
    stems_zip_wav_url: data?.stems_zip_wav_url || "",
    track_type_id: data?.track_type_id || "",
    track_mediatypes: data?.track_mediatypes || "",
    source_id: data?.source_id || "",
    // instrumentTags,
    tagUsedIn,
    cyanite_id: data?.cyanite_id || "",
    cyanite_status: data?.cyanite_status || "",
    track_lyrics: data?.trackLyrics || "",
    trackCSStatus: data?.trackCSStatus || "",
    csToSsStatus: data?.csToSsStatus || "",
    csFlaxTrackId: data?.csFlaxTrackId || "",
    feelingsTags: data?.tag_feelings || [],
    impactTags: data?.tag_impact || [],
    motionTags: data?.tag_motion || [],
    tonalityTags: data?.tag_tonality || [],
    keyTags: data?.tag_key || [],
    tempoTags: [data?.tag_tempo] || [],
    //genreTags: data?.tag_genre || [],
    isSonicLogo: data?.assetProcessedId === "2",
    trackId: data?.objectID,
    album_Name: data?.album?.name || "",
    catlog_name: data?.catalog?.name || "",
    label: data?.label?.name || "",
    publisher: data?.publishers?.[0]?.name || "",
    writer: data?.writers?.[0]?.name || "",
    detail_image: getMediaBucketPath(
      data?.detail_image,
      data?.source_id,
      "image"
    ),
    waveform_js: getMediaBucketPath(
      data?.wave_form_js,
      data?.source_id,
      "waveform"
    ),
    topTags:
      data?.assetProcessedId === "2"
        ? data?.tag_soniclogo_allmood_ids || []
        : data?.tag_amp_allmood_ids || [],
    publisherData: data?.publishers || [],
    writerData: data?.writers || [],
    genreTags: topGenreTags || [],
    instruments: topInstrumentsTags || [],
    eventTags: topEventTags || [],
    movementTags: topMovementTags || [],
    emotionTags: topEmotionTags || [],
    keyTag: styleData?.tag_key || "",
    bpm: data?.bpm || null,
    strotswar_track_id: styleData?.strotswar_track_id || null,
    sonichub_track_id: styleData?.sonichub_track_id || null,
    instrument_vocal_data: styleData?.instrument_vocal_data || null,
    wav_track: styleData?.wav_track || null,
    mp3_track: styleData?.mp3_track || null,
    stems_zip: styleData?.stems_zip || null,
    track_mediatypes: styleData?.track_mediatypes || null,
    trackdetails_objectID: styleData?.objectID || null,
  };

  console.log("returnModifiedDataFromMount--updatedData", updatedData);
  return updatedData;
};

let isInternalUserVal = null;

function getUserType() {
  AsyncService.loadData("/users/getUserType")
    .then((res) => {
      isInternalUserVal =
        res.data.utype.toString().toLowerCase() === "external" ? false : true;
    })
    .catch(() => {
      console.log("error while catching User Type ");
    });
}

async function getTrackDetails(queryID) {
  console.log("getTrackDetails--queryID", queryID);
  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );
    const index = client.initIndex("tracksData_Details");

    // Directly fetch by objectID
    const record = await index.getObject(queryID);

    return record;
  } catch (error) {
    console.error("Error while getting track details:", error);
    return null;
  }
}
async function getTrackStyleData(queryID) {
  console.log("getTrackDetails--queryID", queryID);
  try {
    const client = algoliasearch(
      "UGELINWMHK",
      "ca0ae95e4a09ce03c09546001ac1a6d3"
    );
    const index = client.initIndex("tracksData_Search");

    // Directly fetch by objectID
    const TrackStyleData = await index.getObject(queryID);

    console.log("state in track detail analysis", TrackStyleData);
    return TrackStyleData;
  } catch (error) {
    console.error("Error while getting track details:", error);
    return null;
  }
}

class TrackDetailPageAnalysisSH2 extends Component {
  constructor(props) {
    super(props);
    this.state = { ...InitState };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Mount new Data when user cliked on trackdetail page
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({ ...InitState }, () => {
        // mount Data with updated queryID
        const newQueryID = nextProps.match.params.id;
        this.setState(
          {
            queryID: newQueryID,
            isInternalUser: isInternalUserVal,
          },
          () => {
            this.mountData(newQueryID);
          }
        );
      });
    } else {
      return null;
    }
  }

  componentDidMount() {
    const queryID = this.props.match.params.id;
    const isInternalUser = getUserType();

    this.mountData(queryID);
    this.setState({
      queryID,
      isInternalUser,
    });
  }

  mountData = (queryID) => {
    this.fetchTrackDetailsFromAlgolia(queryID);
  };

  fetchTrackDetailsFromAlgolia = async (queryID) => {
    try {
      const res = await getTrackDetails(queryID);
      console.log("fetchTrackDetailsFromAlgolia--res", res);

      const styleData = await getTrackStyleData(queryID);
      console.log("fetchTrackDetailsFromAlgolia--styleData", styleData);

      const tagsToUpdate = returnModifiedDataFromMount(res, styleData);
      console.log("fetchTrackDetailsFromAlgolia--tagsToUpdate", tagsToUpdate);

      if (JSON.stringify(tagsToUpdate) !== JSON.stringify(this.state)) {
        this.setState(
          {
            ...tagsToUpdate,
          },
          () => {
            this.fetchPicture();
          }
        );
      }
    } catch (error) {
      console.error("Error fetching track details:", error);
      this.setState({ trackStatus: "NA" });
    }
  };

  fetchPicture = () => {
    console.log("fetchPicture - detail_image", this.state.detail_image);
    this.setState({
      // preview_track_data: res,
      loadingPicture: false,
    });
  };

  renderUsedInSection = (videos) => {
    if (videos) {
      if (videos.length >= 1) {
        const sortedVideos = videos.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        return <VideoSlider videosProp={sortedVideos}></VideoSlider>;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  renderCyaniteProfileSection = (
    trackTags = [],
    isSonicLogo = false,
    topTags = []
  ) => {
    // alert(trackTags);
    const { playingIndex } = this.props;
    let showMoodData = false;
    const {
      track_name,
      loadingPicture,
      type,
      track_length,
      preview_track_data,
      preview_track_url,
      track_url,
      queryID,
      cyanite_status,
      track_lyrics,
      trackId,
    } = this.state;
    const { wavefile, source_id, strotswar_track_id } = this.props;
    //console.log("this.props wavefile", wavefile);
    // console.log("this.state", this.state);
    // showMoodData = cyanite_status === "synced" ? true : false;
    // if (showMoodData) {
    return (
      <>
        {/* {this.props?.configModules.CyaniteProfile && ( */}
        <div className="TrackPage__wrapper--edits">
          {/* {this.props?.configModules.UpdateUItoV2 ? null : (
            <div className="TrackPage__wrapper--headline--container">
              <div className="TrackPage__wrapper--headline">
                
                <h3>Mood Profile: </h3>
              </div>
            </div>
          )} */}
          <div className="TrackPage__wrapper--edits--content">
            <MoodChartTaxonomyV2
              indexProp={queryID}
              queryID={queryID}
              typeProp={type}
              loading={loadingPicture}
              playingIndex={playingIndex}
              track_lengthProp={track_length}
              imgSrc={preview_track_data}
              trackName={track_name}
              preview_track_url={preview_track_url}
              track_url={track_url}
              audioEditor={this.props?.configModules.AudioEditor}
              genreTags={this.props.genreTags}
              preview_track_image_url={this.state.image_path}
              trackTags={trackTags}
              isSonicLogo={isSonicLogo}
              topTags={topTags}
              wavefile={wavefile}
              source_id={source_id}
              strotswar_track_id={strotswar_track_id}
              trackId={trackId}
            />
          </div>
        </div>
      </>
    );
    // } else return null;
  };

  render() {
    const {
      //genreTags,
      createNewPlaylistDialogOpen,
      playingIndex,
      //instruments,
      // eventTags,
      // movementTags,
      // emotionTags,
      // keyTag,
      //bpm,
      //imgSrc,
      //wavefile,
      // strotswar_track_id,
      // sonichub_track_id,
      // instrument_vocal_data,
      // wav_track,
      // mp3_track,
      // stems_zip,
      // track_mediatypes,
      // trackdetails_objectID,
    } = this.props;

    const {
      track_name,
      track_tags,
      loadingPicture,
      type,
      track_length,
      //preview_track_data,
      preview_track_url,
      track_url,
      hasEdits,
      queryID,
      editResults,
      hasMaster,
      masterResults,
      descriptionTag,
      descriptionTag2,
      stems_zip_wav_url,
      videos,
      // instrumentTags,
      tagUsedIn,
      cyanite_id,
      cyanite_status,
      //trackStatus,
      track_lyrics,
      trackCSStatus,
      csToSsStatus,
      csFlaxTrackId,
      tempoTags,
      //keyTags,
      tonalityTags,
      motionTags,
      impactTags,
      // feelingsTags,
      genreTags,
      isSonicLogo,
      //topTags,
      track_type_id,
      //track_mediatypes,
      tempo,
      registrationTitle,
      artist_name,
      publisherGEMANumber,
      trackGEMANumber,
      trackId,
      album_Name,
      catlog_name,
      label,
      publisher,
      writer,
      detail_image,
      waveform_js,
      wavefile,
      //source_id,
      instruments,
      eventTags,
      movementTags,
      emotionTags,
      keyTag,
      bpm,
      //imgSrc,
      strotswar_track_id,
      sonichub_track_id,
      instrument_vocal_data,
      wav_track,
      mp3_track,
      stems_zip,
      track_mediatypes,
      trackdetails_objectID,
    } = this.state;
    console.log("trackdetailpageanalysissh2--", wavefile);
    return (
      <MainLayout>
        <TrackPageHoc key={this.props.match.params.id}>
          {/* {trackStatus === "NA" && (
            <div>
              <h1 style={{ textAlign: "center", marginTop: "50px" }}>
                <FormattedMessage id="trackDetail.page.notExists" />
              </h1>
            </div>
          )} */}

          {/* {trackStatus === "AVAILABLE" && ( */}
          <>
            <CreatePlaylistModal openProp={createNewPlaylistDialogOpen} />

            <div className="TrackPage__wrapper--track">
              <TrackPageTrackCardV3
                indexProp={queryID}
                trackdetails_objectID={trackdetails_objectID}
                queryID={queryID}
                typeProp={type}
                track_type_id={track_type_id}
                track_mediatypes={track_mediatypes}
                loading={loadingPicture}
                playingIndex={playingIndex}
                // Transform into DATA object
                track_lengthProp={track_length}
                imgSrc={detail_image}
                trackName={track_name}
                stems_zip_wav_url={stems_zip_wav_url}
                preview_track_url={preview_track_url}
                track_url={track_url}
                trackTags={track_tags}
                descriptionTag={descriptionTag}
                descriptionTag2={descriptionTag2}
                instrumentTags={instruments}
                tagUsedIn={tagUsedIn}
                feelingsTags={eventTags}
                movementTags={movementTags}
                impactTags={impactTags}
                motionTags={motionTags}
                tonalityTags={tonalityTags}
                keyTags={keyTag}
                tempoTags={tempoTags}
                genreTags={genreTags}
                isInternalUser={isInternalUserVal}
                cyanite_id={cyanite_id}
                cyanite_status={cyanite_status}
                preview_track_image_url={this.state.image_path}
                renderCyaniteProfileSection={this.renderCyaniteProfileSection}
                renderUsedInSection={this.renderUsedInSection}
                videos={videos}
                hasEdits={hasEdits}
                hasMaster={hasMaster}
                editResults={editResults}
                masterResults={masterResults}
                track_lyrics={track_lyrics}
                track_cs_status={trackCSStatus}
                csToSsStatus={csToSsStatus}
                track_flaxid={encodeURIComponent(csFlaxTrackId)}
                isSonicLogo={isSonicLogo}
                topTags={emotionTags}
                tempo={bpm}
                registrationTitle={registrationTitle}
                artist_name={artist_name}
                publisherGEMANumber={publisherGEMANumber}
                trackGEMANumber={trackGEMANumber}
                wavefile={wavefile}
                strotswar_track_id={strotswar_track_id}
                instrument_vocal_data={instrument_vocal_data}
                trackId={trackId}
                album_Name={album_Name}
                catlog_name={catlog_name}
                label={label}
                writer={writer}
                publisher={publisher}
                sonichub_track_id={sonichub_track_id}
                wav_track={wav_track}
                mp3_track={mp3_track}
                stems_zip={stems_zip}
                detail_image={detail_image}
                waveform_js={waveform_js}
                publisherData={this.state.publisherData}
                writerData={this.state.writerData}
                source_id={this.state.source_id}
                waveformJSData={this.state.waveformJSData}
              />
            </div>
            {this.props?.configModules.UpdateUItoV2
              ? null
              : this.renderCyaniteProfileSection()}
            {this.props?.configModules.UpdateUItoV2
              ? null
              : this.renderUsedInSection(videos)}
            {this.props?.configModules.UpdateUItoV2 ? null : (
              <EditSection
                hasEdits={hasEdits}
                hasMaster={hasMaster}
                editResults={editResults}
                masterResults={masterResults}
                playingIndex={playingIndex}
              />
            )}
          </>
          {/* )} */}
        </TrackPageHoc>
      </MainLayout>
    );
  }
}

// Connect to Redux
const mapStateToProps = (state) => {
  console.log("state in track detail analysis", state.trackData);
  return {
    createNewPlaylistDialogOpen: state.playlist.createNewPlaylistDialog,
    playingIndex: state.player.playingIndex,
    // genreTags: state.trackData.trackData?.genreTags || [],
    //emotionTags: state.trackData.trackData?.emotionTags || [],
    //eventTags: state.trackData.trackData?.eventTags || [],
    // movementTags: state.trackData.trackData?.movementTags || [],
    // instruments: state.trackData.trackData?.instruments || [],
    //bpm: state.trackData.trackData?.bpm,
    //keyTag: state.trackData.trackData?.keyTag,
    //imgSrc: state.trackData.trackData?.detail_image,
    //wavefile: state.trackData.trackData?.wavefile,
    //strotswar_track_id: state.trackData.trackData?.strotswar_track_id,
    //sonichub_track_id: state.trackData.trackData?.sonichub_track_id,
    //: state.trackData.trackData?.wav_track,
    //mp3_track: state.trackData.trackData?.mp3_track,
    //stems_zip: state.trackData.trackData?.stems_zip,
    //detail_image: state.trackData.trackData?.detail_image,
    //waveform_js: state.trackData.trackData?.waveform_js,
    //track_mediatypes: state.trackData.trackData?.track_mediatypes || [],
    //instrument_vocal_data: state.trackData.trackData?.instrument_vocal_data,
    //source_id: state.trackData.trackData?.source_id,
    //trackdetails_objectID: state.trackData.trackData?.trackdetails_objectID,
  };
};

export default connect(mapStateToProps)(
  withRouterCompat(TrackDetailPageAnalysisSH2)
);
