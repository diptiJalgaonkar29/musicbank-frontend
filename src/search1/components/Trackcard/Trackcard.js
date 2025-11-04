import React from "react";
import { connect } from "react-redux";

import Picture from "../AnimatedPicture/AnimatedPicture";
import AudioPlayer from "../../../common/components/Audiplayer/AudioPlayer";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenu from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
import "./TrackCard.css";
import { MdQueue } from "react-icons/md";
import { Accordion } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { AccordionSummary } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadWidgetWithCookiesV2Dialog from "../../../track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV2Dialog";

import { BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";

import {
  setFavTrackId,
  removeFavTrackId,
} from "../../../redux/actions/searchActions";
import { showSuccess } from "../../../redux/actions/notificationActions";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";
import AsyncService from "../../../networking/services/AsyncService";
import SimilaritySearchMenu from "../../../playlist/components/SimilaritySearchMenu/SimilaritySearchMenu";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import getConfigJson from "../../../common/utils/getConfigJson";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

//addition by Trupti-Wits -testing

// const INIT_TAGS_TO_SHOW = 9;
const REMOVE_WHITE_SPACES_REGEX = /\s/g;

class TrackCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      preview_image_data: null,
      preview_track_data: null,
      clickedOnImage: false,
      showMore: false,
      refined_items: [],
      allTags: [],
      waveformData: null,
      expanded: null,
      likedTracksIdsArray: null,
    };
    this.tagClickHandler = this.tagClickHandler.bind(this);
  }

  trackList = [];

  componentDidMount() {
    this.loadImages();
    this.setState({
      allTags: this.getFilteredTags(),
    });
    // this.setState({ likedTracksIdsArray: this.props.likedTrackIds });
  }

  getFilteredTags() {
    const { search_result, allTags } = this.props;

    if (search_result === null) {
      return [];
    }
    const searchResultWithoutWhiteSpace = search_result.replace(
      REMOVE_WHITE_SPACES_REGEX,
      ""
    );

    return allTags?.filter(
      (item) =>
        item.replace(REMOVE_WHITE_SPACES_REGEX, "") !==
        searchResultWithoutWhiteSpace
    );
  }

  loadImages() {
    const { preview_image_url, preview_track_url } = this.props;
    Promise.all([
      MediaService.getImage(preview_image_url),
      MediaService.getWaveform(preview_track_url),
    ]).then((res) => {
      this.setState({
        preview_image_data: res[0],
        waveformData: res[1],
        loading: false,
      });
    });
  }

  redirect = (id) => {
    this.props.navigate(`/track_page/${id}`);
  };

  redirectToSimilar = (id) => {
    this.props.navigate(`/track_page/${id}`);
  };

  handleShowMore = () => {
    this.setState({
      showMore: true,
    });
  };

  handleShowLess = () => {
    this.setState({
      showMore: false,
    });
  };

  tagClickHandler = (item) => {
    // console.log("tag click " + item.target.textContent);
  };

  addToQueue = () => {
    this.props.showSuccess(`Added ${this.props.track_name} in queue`);
    localStorage.setItem("typeOfTrackList", "queue");

    this.trackList = JSON.parse(localStorage.getItem("trackList"));

    if (this.trackList == null) {
      this.trackList = [];
      document.getElementById("audioPlayer").style.display = "flex";
      document.getElementById("music-player-track").currentTime = 0;

      MediaService.getMp3(this.props.preview_track_url).then((mp3Data) => {
        document.getElementById("music-player-track").src = mp3Data;
      });

      MediaService.getImage(this.props.preview_image_url).then((imgData) => {
        document.getElementById("music-player-image").src = imgData;
      });

      document.getElementById("music-player-wave-image").src =
        this.state.waveformData;

      document.getElementById("music-player-title").innerText =
        this.props.track_name;

      localStorage.setItem("playIndex", 0);
    } else {
      localStorage.setItem("playIndex", 0);
    }
    this.trackList.push({
      id: this.props.indexProp,
      title: this.props.track_name,
      img: this.props.preview_image_url,
      mp3: this.props.preview_track_url,
    });

    localStorage.setItem("trackList", JSON.stringify(this.trackList));
    document.getElementById("music-player-track").play();
  };

  handleChange = (panel) => () => {
    this.setState({
      expanded: panel === this.state.expanded ? false : panel,
    });
  };

  renderTagsByCategory = (tagCategory) => {
    return (
      <>
        {this.props.tagCategory && this.props.tagCategory.length >= 1
          ? [
              this.props.tagCategory.map((item) => {
                return (
                  <span key={item.toString()} id={tagCategory}>
                    {item}
                  </span>
                );
              }),
            ]
          : null}
        ;
      </>
    );
  };

  renderTags(type) {
    const content = (
      <div className="TrackCard__item__tags">
        <div className="TrackCard__item__tags--divider">
          {(this.props.feelingsTags && this.props.feelingsTags.length >= 1) ||
          (this.props.impactTags && this.props.impactTags.length >= 1) ||
          (this.props.motionTags && this.props.motionTags.length >= 1) ||
          (this.props.tonalityTags && this.props.tonalityTags.length >= 1) ? (
            <>
              <h4 key={"MusicalFeel"}>Musical Feel:</h4>
              <div className="Trackcard__item__tags_container">
                {this.props.feelingsTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="feelingsTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_feelings"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.impactTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="impactTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_impact"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.motionTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="motionTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_motion"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.tonalityTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="tonalityTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_tonality"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
        <div className="TrackCard__item__tags--divider">
          {this.props.instrumentTags &&
          this.props.instrumentTags.length >= 1 ? (
            <>
              <h4 key={"Instruments"}>Instruments:</h4>
              <div className="Trackcard__item__tags_container">
                {this.props.instrumentTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="instrumentTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="instrument_ids"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
        {/* <div className="TrackCard__item__tags--divider">
          {this.props.tagUsedIn && this.props.tagUsedIn.length >= 1
            ? [
                <h4 key={"UsedIn"}>Used In:</h4>,
                this.props.tagUsedIn.map((item) => {
                  return (
                    <span key={item.toString()} id="tagUsedIn">
                      {item}
                    </span>
                  );
                }),
              ]
            : null}
        </div> */}
        <div className="TrackCard__item__tags--divider">
          {(this.props.genreTags && this.props.genreTags.length >= 1) ||
          (this.props.keyTags && this.props.keyTags.length >= 1) ||
          (this.props.tempoTags && this.props.tempoTags.length >= 1) ? (
            <>
              <h4 key={"Other"}>Other:</h4>
              <div className="Trackcard__item__tags_container">
                {this.props.genreTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="genreTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_genre"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.keyTags?.map((item) => {
                  if (item !== "" && item.length > 0) {
                    return (
                      // <span key={item.toString()} id="keyTags">
                      //   {item}
                      // </span>
                      <ChipWrapper
                        key={item?.toString()}
                        className="tag_key"
                        label={item?.toString()}
                      />
                    );
                  }
                })}
                {this.props.tempoTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="tempoTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_tempo"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );

    if (type === "web") {
      return content;
    }
    if (type === "mobile") {
      return (
        <Accordion className={this.props.classes.paper}>
          <AccordionSummary
            className={this.props.classes.root}
            expandIcon={<ExpandMoreIcon className={this.props.classes.icon} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            Show Tags
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      );
    }
  }

  renderTaxonomyTags(type) {
    let content;
    try {
      content = (
        <div className="TrackCard__item__tags">
          <div className="TrackCard__item__tags--divider taxonomy__tags_container">
            {getSortedLabelledTagsArray(
              this.props?.ampMoodTags,
              "AMP_MOOD_TAGS"
            )?.map((item) => {
              if (item) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="tag_amp_allmood_ids"
                    label={item?.toString()}
                  />
                );
              }
            })}
            {getSortedLabelledTagsArray(
              this.props?.sonicLogoMoodTags,
              "SONIC_LOGO_MOOD_TAGS"
            )?.map((item) => {
              if (item) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="tag_soniclogo_allmood_ids"
                    label={item?.toString()}
                  />
                );
              }
            })}
            {this.props?.genreTags?.sort()?.map((item) => {
              if (item) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="tag_genre"
                    label={item?.toString()}
                  />
                );
              }
            })}
            {this.props?.tempoTags?.map((item) => {
              if (item) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="tag_tempo"
                    label={item?.toString()}
                  />
                );
              }
            })}
            {this.props?.keyTags?.map((item) => {
              if (item && item?.length > 0) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="tag_key"
                    label={item?.toString()}
                  />
                );
              }
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.log("error", error);
      content = <></>;
    }

    if (type === "web") {
      return content;
    }
    if (type === "mobile") {
      return (
        <Accordion className={this.props.classes.paper}>
          <AccordionSummary
            className={this.props.classes.root}
            expandIcon={<ExpandMoreIcon className={this.props.classes.icon} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            Show Tags
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      );
    }
  }

  likeUnlikeTrack = (trackId) => {
    const favMeta = { fav_data: trackId, type: 1 };
    AsyncService.postData(`/favourites/insert`, favMeta).then((res) => {
      if (["liked", "inserted"].includes(res.data.Status)) {
        this.props.setFavTrackId(trackId);
      } else if (res.data.Status === "unliked") {
        this.props.removeFavTrackId(trackId);
      }
    });
  };
  static contextType = BrandingContext;
  render() {
    const playingIndexFromStore = this.props.playingIndex;
    const { jsonConfig: CONFIG } = this.context;

    return (
      <>
        <div className="TrackCard" key={this.props.indexProp}>
          <Accordion
            key={this.props.indexProp}
            // className={classes.paper}

            expanded={this.state.expanded === `panel${this.props.indexProp}`}
          >
            <AccordionSummary>
              <div
                className={`TrackCard__Left ${
                  this.props.config.modules.showBasketDownload &&
                  "activeDownloadBasket"
                }`}
              >
                <div className="TrackCard__cover">
                  <Picture
                    key={this.props.indexProp}
                    srcUrl={this.state.preview_image_data}
                    loading={this.state.loading}
                    index={this.props.indexProp}
                    clickedOnImage={() => this.redirect(this.props.indexProp)}
                  />
                </div>
                {this.props.UpdateUItoV2 && (
                  <div className="actionMenuSet">
                    {this.props.cyanite_id !== null &&
                      this.props.config.modules.SimilaritySearchBtn && (
                        <SimilaritySearchMenu
                          className="Trackcard__SS_menu"
                          cyaniteId={this.props.cyanite_id}
                          trackId={this.props.indexProp}
                        />
                      )}
                    <AddItemToPlaylistMenu
                      stClass="actionMenuIcons Trackcard__addToPlaylist"
                      trackCardIdProp={this.props.indexProp}
                      trackCardNameProp={this.props.track_name}
                    />

                    {this.props.config.modules.showFooterMusicPlayer && (
                      <button
                        onClick={this.addToQueue}
                        id={"queue-" + this.props.indexProp}
                      >
                        <MdQueue className="queueIcon" />
                      </button>
                    )}
                    {this.props.config.modules.showBasketDownload && (
                      <DownloadWidgetWithCookiesV2Dialog
                        config={this.props.config}
                        idProp={this.props.indexProp}
                        track_type_id={this.props.track_type_id}
                        trackName={this.props.track_name}
                        preview_track_url={this.props.preview_track_url}
                        track_url={this.props.track_url}
                        edit_track_url={this.props.edit_track_url}
                        stems_zip_wav_url={this.props.stems_zip_wav_url}
                        isUserInternal={this.props.isInternalUser}
                        cyanite_id={this.props.cyanite_id}
                        cyanite_status={this.props.cyanite_status}
                      />
                    )}
                  </div>
                )}
              </div>

              <div
                className={`TrackCard__details ${
                  this.props.config.modules.showBasketDownload &&
                  "activeDownloadBasket"
                }`}
              >
                <div className="TrackCard__info" key={this.props.key}>
                  <div className="TrackCard__title__container">
                    <p
                      className="TrackCard__item__title"
                      onClick={() => this.redirect(this.props.indexProp)}
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{this.props.track_name}</span>
                    </p>
                    {this.props.track_cs_status &&
                      this.props?.userMeta?.isCSUser && (
                        <ButtonWrapper
                          size="s"
                          data-flaxid={this.props.track_flaxid}
                          onClick={() => {
                            const urlToNavigate = `${
                              process.env.NODE_ENV === "development"
                                ? "http://localhost:3098"
                                : CONFIG?.CS_BASE_URL
                            }/work-space/project-settings/${encodeURIComponent(
                              this.props.track_flaxid
                            )}?${appendCSUrlParams()}&is-cs-track=${
                              !!this.props.csToSsStatus ? "1" : "0"
                            }`;
                            try {
                              localStorage.setItem("CSLoggingOut", "false");
                              window.open(urlToNavigate, "_self");
                            } catch (error) {}
                          }}
                        >
                          Edit Track
                        </ButtonWrapper>
                      )}
                    {this.props.config.modules.showFavourites && (
                      <>
                        {this.props.favTracksIds?.includes(
                          this.props.indexProp
                        ) ? (
                          <BsSuitHeartFill
                            className="favBtn"
                            onClick={() => {
                              this.likeUnlikeTrack(this.props.indexProp);
                            }}
                          />
                        ) : (
                          <BsSuitHeart
                            className="favBtn"
                            onClick={() => {
                              this.likeUnlikeTrack(this.props.indexProp);
                            }}
                          />
                        )}
                      </>
                    )}
                    {!this.props.UpdateUItoV2 && (
                      <AddItemToPlaylistMenu
                        trackCardIdProp={this.props.indexProp}
                        trackCardNameProp={this.props.track_name}
                      />
                    )}
                  </div>
                  <div
                    className="TrackCard__player"
                    style={{ position: "relative", left: "-17px" }}
                    key={this.props.key}
                  >
                    <AudioPlayer
                      key={this.props.indexProp}
                      songUrl={this.props.preview_track_url}
                      track_length={this.props.track_length}
                      index={this.props.indexProp}
                      waveformDataProp={this.state.waveformData}
                      playFromPicture={this.state.clickedOnImage}
                      type="Tc"
                      active={
                        playingIndexFromStore !== null &&
                        playingIndexFromStore === this.props.indexProp
                      }
                      // shubham goPhygital
                      trackCardNameProp={this.props.track_name}
                      srcUrl={this.props.preview_image_url}
                    />
                    <div
                      className="PlayListTitleList__Extra--actions"
                      // style={{ width: isUnRegistered ? "auto" : "10%" }}
                    >
                      <ExpandMoreIcon
                        onClick={this.handleChange(
                          `panel${this.props.indexProp}`
                        )}
                        className="PlayListTitleList__Extra--expansionIcon"
                        style={{
                          transform:
                            this.state.expanded ===
                            `panel${this.props.indexProp}`
                              ? "rotate(180deg) scale(1.8)"
                              : "rotate(0deg) scale(1.8)",
                          color: "var(--color-white)",
                          transition: "all 0.3s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="TrackCard__item__tags__expansion__panel">
                {this.props.search_result ? (
                  <span className="activeColor">
                    {this.props.search_result}
                  </span>
                ) : null}
                {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER
                  ? this.renderTaxonomyTags("web")
                  : this.renderTags("web")}

                <br />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFavTrackId: (trackId) => dispatch(setFavTrackId(trackId)),
    removeFavTrackId: (trackId) => dispatch(removeFavTrackId(trackId)),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
  };
};

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    search_result: state.search.search_result,
    refinement_items_redux: state.search.refinement_items,
    favTracksIds: state.favTracksIds,
    userMeta: state.userMeta,
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(TrackCard)
);
