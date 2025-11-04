import React from "react";
import { connect } from "react-redux";

import Picture from "../AnimatedPicture/AnimatedPicture";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenu from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
import "./TrackcardV2.css";
import { Accordion } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadWidgetWithCookiesV2Dialog from "../../../track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV2Dialog";
import {
  setFavTrackId,
  removeFavTrackId,
} from "../../../redux/actions/searchActions";
import { showSuccess } from "../../../redux/actions/notificationActions";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";
import AsyncService from "../../../networking/services/AsyncService";
import TrackCardV2AudioPlayer from "../../../common/components/Audiplayer/TrackCardV2AudioPlayer/TrackCardV2AudioPlayer";
import SimilaritySearchMenu from "../../../playlist/components/SimilaritySearchMenu/SimilaritySearchMenu";
import AddToQueue from "../../../playlist/components/AddToQueue/AddToQueue";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import { formatDuration } from "../../../common/utils/formatDuration";
import {
  setCommonMessage,
  setIsOpenCommonMessageModal,
} from "../../../redux/actions/commonMessageModal";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import getConfigJson from "../../../common/utils/getConfigJson";
import TrackTypeBadge from "../TrackTypeBadge/TrackTypeBadge";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

//addition by Trupti-Wits -testing

// const INIT_TAGS_TO_SHOW = 9;
const REMOVE_WHITE_SPACES_REGEX = /\s/g;

class TrackcardV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      preview_image_data: null,
      preview_track_data: null,
      clickedOnImage: false,
      showMore: false,
      refined_items: [],
      // allTags: [],
      waveformData: null,
      expanded: null,
      likedTracksIdsArray: null,
    };
    this.tagClickHandler = this.tagClickHandler.bind(this);
  }

  componentDidMount() {
    this.loadImages();
    // this.setState({
    //   allTags: this.getFilteredTags(),
    // });
  }

  // getFilteredTags() {
  //   const { search_result, allTags } = this.props;

  //   if (search_result === null) {
  //     return [];
  //   }
  //   const searchResultWithoutWhiteSpace = search_result.replace(
  //     REMOVE_WHITE_SPACES_REGEX,
  //     ""
  //   );

  //   return allTags?.filter(
  //     (item) =>
  //       item.replace(REMOVE_WHITE_SPACES_REGEX, "") !==
  //       searchResultWithoutWhiteSpace
  //   );
  // }

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
      <div className="TrackcardV2__item__tags">
        <div className="TrackcardV2__item__tags--divider">
          {(this.props.feelingsTags && this.props.feelingsTags.length >= 1) ||
          (this.props.impactTags && this.props.impactTags.length >= 1) ||
          (this.props.motionTags && this.props.motionTags.length >= 1) ||
          (this.props.tonalityTags && this.props.tonalityTags.length >= 1) ? (
            <>
              <h4 key={"MusicalFeel"}>Musical Feel:</h4>
              <div className="TrackcardV2__item__tags_container">
                {this.props.feelingsTags?.map((item) => {
                  return (
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_amp_allmood_ids"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.impactTags?.map((item) => {
                  return (
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_amp_allmood_ids"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.motionTags?.map((item) => {
                  return (
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_amp_allmood_ids"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.tonalityTags?.map((item) => {
                  return (
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_amp_allmood_ids"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
        <div className="TrackcardV2__item__tags--divider">
          {this.props.instrumentTags &&
          this.props.instrumentTags.length >= 1 ? (
            <>
              <h4 key={"Instruments"}>Instruments:</h4>
              <div className="TrackcardV2__item__tags_container">
                {this.props.instrumentTags?.map((item) => {
                  return (
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
        <div className="TrackcardV2__item__tags--divider">
          {(this.props.genreTags && this.props.genreTags.length >= 1) ||
          (this.props.keyTags && this.props.keyTags.length >= 1) ||
          (this.props.tempoTags && this.props.tempoTags.length >= 1) ? (
            <>
              <h4 key={"Other"}>Other:</h4>
              <div className="TrackcardV2__item__tags_container">
                {this.props.genreTags?.map((item) => {
                  return (
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
        <div className="TrackcardV2__item__tags">
          <div className="TrackcardV2__item__tags--divider taxonomy__tags_container">
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
            {getSortedLabelledTagsArray(
              this.props?.instrumentTags,
              "INSTRUMENTS"
            )?.map((item) => {
              if (item) {
                return (
                  <ChipWrapper
                    key={item?.toString()}
                    className="instrument_ids"
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
              <div className="TrackcardV2" key={this.props.indexProp}>
                <Accordion
                  key={this.props.indexProp}
                  expanded={
                    this.state.expanded === `panel${this.props.indexProp}`
                  }
                >
                  <AccordionSummary>
                    <div className="TrackcardV2__main">
                      <div className={`TrackcardV2__Left`}>
                        <div className="TrackcardV2__cover">
                          <Picture
                            key={this.props.indexProp}
                            srcUrl={this.state.preview_image_data}
                            loading={this.state.loading}
                            index={this.props.indexProp}
                            clickedOnImage={() =>
                              this.redirect(this.props.indexProp)
                            }
                          />
                          <TrackTypeBadge
                            trackType={Number(
                              this.props?.trackType?.split(",")?.[0]
                            )}
                          />
                        </div>
                      </div>

                      <div className="TrackcardV2__info" key={this.props.key}>
                        <div className="TrackcardV2__title__container">
                          <p
                            className="TrackcardV2__item__title"
                            onClick={() => this.redirect(this.props.indexProp)}
                            data-paid={this.props.paid || 0}
                            data-unpaid={this.props.unpaid || 0}
                            data-radio={this.props.radio || 0}
                            data-track-id={this.props.indexProp || 0}
                            data-flax-id={this.props.track_flaxid || "NA"}
                          >
                            <span>
                              {this.props.track_name}
                              {/* ({this.props.unpaid || 0}/
                              {this.props.paid || 0}) */}
                            </span>
                          </p>
                          {this.props.track_cs_status &&
                          this.props.track_flaxid &&
                          this.props?.userMeta?.isCSUser ? (
                            <ButtonWrapper
                              variant="filledSecondary"
                              size="s"
                              data-flaxid={this.props.track_flaxid}
                              onClick={() => {
                                if (
                                  CONFIG?.INPROCESS_FLAX_CUE_IDS?.includes(
                                    this.props.track_flaxid
                                  )
                                ) {
                                  this.props.setIsOpenCommonMessageModal(true);
                                  this.props.setCommonMessage({
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
                                  this.props.track_flaxid
                                )}?${appendCSUrlParams()}&is-cs-track=${
                                  !!this.props.csToSsStatus ? "1" : "0" // csToSsStatus = 1 => flax id is cue id
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
                          {this.props.config.modules.showFavourites && (
                            <>
                              {this.props.favTracksIds?.includes(
                                this.props.indexProp
                              ) ? (
                                <>
                                  <IconButtonWrapper
                                    icon="LikeOn"
                                    className="favBtn"
                                    onClick={() => {
                                      this.likeUnlikeTrack(
                                        this.props.indexProp
                                      );
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <IconButtonWrapper
                                    icon="LikeOff"
                                    className="favBtn"
                                    onClick={() => {
                                      this.likeUnlikeTrack(
                                        this.props.indexProp
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <div className="TrackcardV2_lower_block">
                          <TrackCardV2AudioPlayer
                            key={`TrackCardV2AudioPlayer-${this.props.indexProp}`}
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
                            trackCardNameProp={this.props.track_name}
                            srcUrl={this.props.preview_image_url}
                            playingAudio={playingAudio}
                            setPlayingAudio={setPlayingAudio}
                            playPause={playPause}
                            setPlayList={setPlayList}
                            setPlayingIndex={setPlayingIndex}
                            setPlayListType={setPlayListType}
                            playListType={playListType}
                          />
                          <div className="TrackcardV2__duration">
                            {formatDuration(this.props.track_length)}
                          </div>
                          <div className="TrackcardV2__actionBtns actionMenuSet">
                            <SimilaritySearchMenu
                              className="TrackcardV2__SS_menu"
                              cyaniteId={this.props.cyanite_id}
                              trackId={this.props.indexProp}
                            />
                            <AddItemToPlaylistMenu
                              stClass="TrackcardV2__addtoPlaylist_menu"
                              trackCardIdProp={this.props.indexProp}
                              trackCardNameProp={this.props.track_name}
                            />
                            <AddToQueue
                              trackMeta={{
                                id: this.props.indexProp,
                                title: this.props.track_name,
                                img: this.props.preview_image_url,
                                mp3: this.props.preview_track_url,
                              }}
                              waveformData={this.state.waveformData}
                              className={"TrackcardV2__addtoQueue_menu"}
                            />
                            {this.props.config.modules.showBasketDownload && (
                              <DownloadWidgetWithCookiesV2Dialog
                                className="TrackcardV2__download_menu"
                                config={this.props.config}
                                idProp={this.props.indexProp}
                                track_type_id={this.props.trackType}
                                trackName={this.props.track_name}
                                preview_track_url={this.props.preview_track_url}
                                track_url={this.props.track_url}
                                edit_track_url={this.props.edit_track_url}
                                stems_zip_wav_url={this.props.stems_zip_wav_url}
                                isUserInternal={this.props.isInternalUser}
                                cyanite_id={this.props.cyanite_id}
                                cyanite_status={this.props.cyanite_status}
                                preview_image_url={
                                  this?.props?.preview_image_url
                                }
                              />
                            )}

                            {/* <Arrow
                          onClick={this.handleChange(
                            `panel${this.props.indexProp}`
                          )}
                          className={`TrackcardV2__tags__expandIcon ${
                            this.state.expanded ===
                            `panel${this.props.indexProp}`
                              ? "expanded"
                              : ""
                          }`}
                        /> */}
                            <IconButtonWrapper
                              icon={
                                this.state.expanded ===
                                `panel${this.props.indexProp}`
                                  ? "UpArrow"
                                  : "DownArrow"
                              }
                              /* className={`TrackcardV2__tags__expandIcon ${
                            this.state.expanded ===
                            `panel${this.props.indexProp}`
                              ? "expanded"
                              : ""
                          }`} */
                              onClick={this.handleChange(
                                `panel${this.props.indexProp}`
                              )}
                            />

                            {/* <IconButtonWrapper
                          icon="AddToQueue"
                          title="Add to queue"
                          onClick={this.handleChange(
                            `panel${this.props.indexProp}`
                          )}
                          className={`TrackcardV2__tags__expandIcon ${
                            this.state.expanded ===
                            `panel${this.props.indexProp}`
                              ? "expanded"
                              : ""
                          }`}
                        /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="TrackcardV2__item__tags__expansion__panel">
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
          )}
        </FooterMusicPlayerContext.Consumer>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFavTrackId: (trackId) => dispatch(setFavTrackId(trackId)),
    removeFavTrackId: (trackId) => dispatch(removeFavTrackId(trackId)),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    setCommonMessage: (msg) => dispatch(setCommonMessage(msg)),
    setIsOpenCommonMessageModal: (isOpen) =>
      dispatch(setIsOpenCommonMessageModal(isOpen)),
  };
};

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    search_result: state.search.search_result,
    refinement_items_redux: state.search.refinement_items,
    favTracksIds: state.favTracksIds,
    downloadBasket: state.downloadBasket,
    userMeta: state.userMeta,
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(TrackcardV2)
);
