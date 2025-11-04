import React, { Component } from "react";
import { connect, useSelector } from "react-redux";

import { FormattedMessage } from "react-intl";
import MediaService from "../../common/services/MediaService";
import AlgoliaService from "../../networking/services/AlgoliaService";
import CreatePlaylistModal from "../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import TrackPageTrackCard from "../components/TrackPageTrackCard/TrackPageTrackCard";
import VideoSlider from "../components/VideoSlider/index";
import TrackPageHoc from "../layout/TrackPageHoc";
import EditSection from "./EditSection";
import TrackPageTrackCardV2 from "../components/TrackPageTrackCard/TrackPageTrackCardV2";
import MoodChart from "../../cyanite/MoodChart";
import MoodChartTaxonomy from "../../cyanite/MoodChartTaxonomy";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import AsyncService from "../../networking/services/AsyncService";
import TrackPageTrackCardV3 from "../components/TrackPageTrackCard/TrackPageTrackCardV3";
import MoodChartTaxonomyV2 from "../../cyanite/MoodChartTaxonomyV2";
import { withRouterCompat } from "../../common/utils/withRouterCompat";
import algoliasearch from "algoliasearch";

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
  //genreTags: null,
  isSonicLogo: null,
  topTags: [],
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

const returnModifiedDataFromMount = (data) => {
  console.log("returnModifiedDataFromMount", data);

  // console.log("data****", data);
  // let tagGenre = data?.tag_genre || [];
  let tagUsedIn = data?.tag_used_in || [];
  //  const instrumentTags = data?.instrument_ids || [];
  const descriptionTag = data?.description;
  const descriptionTag2 = data?.description2;

  return {
    descriptionTag,
    descriptionTag2,
    image_path: data?.detail_image_url,
    track_length: data?.duration_in_sec,
    track_name: data?.track_name,
    registrationTitle: data?.registrationTitle || data?.track_name,
    artist_name: data?.artist?.name,
    publisherGEMANumber: data?.publisherGEMANumber,
    trackGEMANumber: data?.trackGEMANumber,
    tempo: data?.tempo,
    track_tags: [...(data?.tag_all || [])],
    type: data?.type,
    track_url: data?.track_url,
    preview_track_url: data?.preview_track_url,
    stems_zip_wav_url: data?.stems_zip_wav_url,
    track_type_id: data?.track_type_id,
    // instrumentTags,
    tagUsedIn,
    cyanite_id: data?.cyanite_id,
    cyanite_status: data?.cyanite_status,
    track_lyrics: data?.trackLyrics,
    trackCSStatus: data?.trackCSStatus,
    csToSsStatus: data?.csToSsStatus,
    csFlaxTrackId: data?.csFlaxTrackId,
    feelingsTags: data?.tag_feelings || [],
    impactTags: data?.tag_impact || [],
    motionTags: data?.tag_motion || [],
    tonalityTags: data?.tag_tonality || [],
    keyTags: data?.tag_key || [],
    tempoTags: [data?.tag_tempo] || [],
    // genreTags: data?.tag_genre || [],
    isSonicLogo: data?.assetProcessedId === "2",
    trackId: data?.objectID,
    album_Name: data?.album?.name,
    catlog_name: data?.catalog?.name,
    label: data?.label?.name,
    publisher: data.publishers[0].name,
    writer: data.writers[0].name,
    topTags:
      data?.assetProcessedId === "2"
        ? data?.tag_soniclogo_allmood_ids || []
        : data?.tag_amp_allmood_ids || [],
  };
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

// async function getTrackDetails(queryID) {
//   try {
//     const trackDetails = await AsyncService.loadData(
//       `/trackMeta/trackData/${queryID}`
//     );
//     return trackDetails?.data;
//   } catch (error) {
//     console.log("error while getting track details");
//     return null;
//   }
// }

class TrackDetailPageAnalysis extends Component {
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
    if (this.props?.configModules?.removeAlgolia) {
      this.fetchTrackDetailsFromDB(queryID);
    } else {
      let edits = null;
      AlgoliaService.getObject(queryID)
        .then((res) => {
          trackExternalAPICalls({
            url: "",
            requestData: JSON.stringify({
              queryID,
            }),
            usedFor: "getObject",
            serviceBy: "Algolia",
            statusCode: 200,
            statusMessage: "",
          });
          if (res.trackStatus && res?.trackActive) {
            this.setState({ trackStatus: "AVAILABLE" });
          } else {
            this.setState({ trackStatus: "NA" });
            return;
          }
          // // SET VIDEOS
          // this.setState({
          //   videos: res.videos,
          // });
          // IF USER SELECTED A TRACK WICH IS A EDIT => SEARCH FOR THE MASTER
          if (res.type === "edit") {
            const masterTrackID = res.master_id;
            this.fetchIsEditFetchMasterData(masterTrackID);
          }
          // HERE BEGINS THE CASE IS USER SELECTED A MASTER TRACK
          // CHECK IF MASTER HAS EDITS
          edits = res.edit_ids;
          const tagsToUpdate = returnModifiedDataFromMount(res);
          this.setState(
            {
              ...tagsToUpdate,
            },
            () => {
              this.fetchPicture();
            }
          );
        })
        .then(() => {
          // HERE BEGINS THE CASE IF SELECTED MASTER TRACK HAS EDITS => THEY SHOULD BE DISPLAYED
          if (edits?.length >= 1) {
            this.fetchEditData(edits);
          }
        })
        .catch((error) => {
          console.log("getObject error", error);
          trackExternalAPICalls({
            url: "",
            requestData: JSON.stringify({
              queryID,
            }),
            usedFor: "getObject",
            serviceBy: "Algolia",
            statusCode: error?.statusCode || "404",
            statusMessage: error?.message,
          });
          this.setState({ trackStatus: "NA" });
          console.error(
            error,
            "Something went wrong catching the Data on the TrackDetail Page"
          );
        });
    }
  };

  fetchTrackDetailsFromDB = (queryID) => {
    getTrackDetails(queryID)
      .then((res) => {
        // if (res.trackStatus && res?.trackActive) {
        //   this.setState({ trackStatus: "AVAILABLE" });
        // } else {
        //   this.setState({ trackStatus: "NA" });
        //   return;
        // }
        // if (res.type === "master") {
        //   if (!res?.editMeta || res?.editMeta?.length === 0) {
        //     this.setState({
        //       hasEdits: false,
        //       editResults: null,
        //     });
        //   } else {
        //     this.setState({
        //       hasEdits: true,
        //       editResults: res?.editMeta,
        //     });
        //   }
        // } else if (res.type === "edit") {
        //   this.setState({
        //     hasMaster: true,
        //     masterResults: res?.masterMeta,
        //   });
        // }
        const tagsToUpdate = returnModifiedDataFromMount(res);
        this.setState(
          {
            ...tagsToUpdate,
          },
          () => {
            this.fetchPicture();
          }
        );
      })
      .catch(() => this.setState({ trackStatus: "NA" }));
  };

  // CASTE IF COOSEN TRACK IS AN EDIT
  fetchIsEditFetchMasterData = (masterTrackID) => {
    // HERE IT IS CLEAR THE OUR TRACK IS AN MASTER WICH HAS EDITS
    AlgoliaService.getObject(masterTrackID, [...settingsToReceive])
      .then((res) => {
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            masterTrackID,
            settingsToReceive: [...settingsToReceive],
          }),
          usedFor: "getObject",
          serviceBy: "Algolia",
          statusCode: 200,
          statusMessage: "",
        });
        const isTrackEnabled = res?.trackStatus && res?.trackActive;
        if (isTrackEnabled) {
          return {
            hasMaster: true,
            masterResults: res,
          };
        } else {
          return {
            hasMaster: false,
            masterResults: null,
          };
        }
      })
      .then((update) => {
        this.setState({
          ...update,
        });
      })
      .catch((error) => {
        console.log("getObject error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            masterTrackID,
            settingsToReceive: [...settingsToReceive],
          }),
          usedFor: "getObject",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
        console.error("tctp", error);
      });
  };

  fetchEditData = (edits) => {
    // FETCH ALL RELATED EDIST FROM ALGOLIA
    const editsToString = edits.map((id) => id.toString());
    AlgoliaService.getObjects(editsToString, [...settingsToReceive])
      .then((res) => {
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            editsToString,
            settingsToReceive: [...settingsToReceive],
          }),
          usedFor: "getObjects",
          serviceBy: "Algolia",
          statusCode: 200,
          statusMessage: "",
        });
        const enabledEdits =
          res.results?.filter(
            (track) => track?.trackStatus && track?.trackActive
          ) || [];
        if (!enabledEdits || enabledEdits?.length === 0) {
          return {
            hasEdits: false,
            editResults: null,
          };
        } else {
          return {
            hasEdits: true,
            editResults: res.results?.filter(
              (track) => track?.trackStatus && track?.trackActive
            ),
          };
        }
      })
      .then((update) => {
        this.setState({
          ...update,
        });
      })
      .catch((error) => {
        console.log("getObject error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({
            editsToString,
            settingsToReceive: [...settingsToReceive],
          }),
          usedFor: "getObjects",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
      });
  };

  fetchPicture = () => {
    // MediaService.getImage(this.state.image_path)
    //   .then((res) => {
    this.setState({
      // preview_track_data: res,
      loadingPicture: false,
    });
    // })
    // .catch((err) => {
    //   this.setState({
    //     loadingPicture: false,
    //   });
    //   console.error(
    //     err,
    //     "something went wrong fetching the TrackDetail Page Picture"
    //   );
    // });
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
    } = this.state;
    const { wavefile, strotswar_track_id } = this.props;

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
            {/* {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER ? (
                  <>
                    {this.props?.configModules.trackDetailPageUIV3 ? ( */}

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
              strotswar_track_id={strotswar_track_id}
            />
            {/* ) : (
                      <MoodChartTaxonomy
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
                        preview_track_image_url={this.state.image_path}
                        trackTags={trackTags}
                        isSonicLogo={isSonicLogo}
                      />
                    )}
                  </>
                ) : (
                  <MoodChart
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
                    preview_track_image_url={this.state.image_path}
                  />
                )} */}
          </div>
        </div>
        {/* )} */}
      </>
    );
    // } else return null;
  };

  render() {
    const {
      genreTags,
      createNewPlaylistDialogOpen,
      playingIndex,
      instruments,
      eventTags,
      emotionTags,
      keyTag,
      bpm,
      imgSrc,
      wavefile,
      strotswar_track_id,
      sonichub_track_id,
      wav_track,
      mp3_track,
      stems_zip,
    } = this.props;

    const {
      track_name,
      track_tags,
      loadingPicture,
      type,
      track_length,
      preview_track_data,
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
      trackStatus,
      track_lyrics,
      trackCSStatus,
      csToSsStatus,
      csFlaxTrackId,
      tempoTags,
      keyTags,
      tonalityTags,
      motionTags,
      impactTags,
      feelingsTags,
      //genreTags,
      isSonicLogo,
      //topTags,
      track_type_id,
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
    } = this.state;
    // alert(sonichub_track_id);
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
              {this.props?.configModules.UpdateUItoV2 ? (
                <>
                  {this.props?.configModules.trackDetailPageUIV3 ? (
                    <TrackPageTrackCardV3
                      indexProp={queryID}
                      queryID={queryID}
                      typeProp={type}
                      track_type_id={track_type_id}
                      loading={loadingPicture}
                      playingIndex={playingIndex}
                      // Transform into DATA object
                      track_lengthProp={track_length}
                      imgSrc={imgSrc}
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
                      renderCyaniteProfileSection={
                        this.renderCyaniteProfileSection
                      }
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
                    />
                  ) : (
                    <TrackPageTrackCardV2
                      indexProp={queryID}
                      queryID={queryID}
                      typeProp={type}
                      loading={loadingPicture}
                      playingIndex={playingIndex}
                      // Transform into DATA object
                      track_lengthProp={track_length}
                      imgSrc={preview_track_data}
                      trackName={track_name}
                      stems_zip_wav_url={stems_zip_wav_url}
                      preview_track_url={preview_track_url}
                      track_url={track_url}
                      trackTags={track_tags}
                      descriptionTag={descriptionTag}
                      descriptionTag2={descriptionTag2}
                      instrumentTags={instruments}
                      tagUsedIn={tagUsedIn}
                      feelingsTags={feelingsTags}
                      impactTags={impactTags}
                      motionTags={motionTags}
                      tonalityTags={tonalityTags}
                      keyTags={keyTags}
                      tempoTags={tempoTags}
                      genreTags={genreTags}
                      isInternalUser={isInternalUserVal}
                      cyanite_id={cyanite_id}
                      cyanite_status={cyanite_status}
                      preview_track_image_url={this.state.image_path}
                      renderCyaniteProfileSection={
                        this.renderCyaniteProfileSection
                      }
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
                      topTags={eventTags}
                    />
                  )}
                </>
              ) : (
                <TrackPageTrackCard
                  indexProp={queryID}
                  queryID={queryID}
                  typeProp={type}
                  loading={loadingPicture}
                  playingIndex={playingIndex}
                  // Transform into DATA object
                  track_lengthProp={track_length}
                  imgSrc={preview_track_data}
                  trackName={track_name}
                  stems_zip_wav_url={stems_zip_wav_url}
                  preview_track_url={preview_track_url}
                  track_url={track_url}
                  trackTags={track_tags}
                  descriptionTag={descriptionTag}
                  descriptionTag2={descriptionTag2}
                  instrumentTags={instruments}
                  tagUsedIn={tagUsedIn}
                  isInternalUser={isInternalUserVal}
                  cyanite_id={cyanite_id}
                  cyanite_status={cyanite_status}
                  preview_track_image_url={this.state.image_path}
                />
              )}
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
  return {
    createNewPlaylistDialogOpen: state.playlist.createNewPlaylistDialog,
    playingIndex: state.player.playingIndex,
    genreTags: state.trackData.trackData?.genreTags || [],
    emotionTags: state.trackData.trackData?.emotionTags || [],
    eventTags: state.trackData.trackData?.eventTags || [],
    instruments: state.trackData.trackData?.instruments || [],
    bpm: state.trackData.trackData?.bpm,
    keyTag: state.trackData.trackData?.keyTag,
    imgSrc: state.trackData.trackData?.imgSrc,
    wavefile: state.trackData.trackData?.wavefile,
    strotswar_track_id: state.trackData.trackData?.strotswar_track_id,
    sonichub_track_id: state.trackData.trackData?.sonichub_track_id,
    wav_track: state.trackData.trackData?.wav_track,
    mp3_track: state.trackData.trackData?.mp3_track,
    stems_zip: state.trackData.trackData?.stems_zip,
  };
};

export default connect(mapStateToProps)(
  withRouterCompat(TrackDetailPageAnalysis)
);
